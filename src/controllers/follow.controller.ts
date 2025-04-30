import { Request,Response } from "express";
import { Follow } from "../entities/Follow";
import { AppDataSource } from "../data-source";

export class FollowController{
    private followRepository = AppDataSource.getRepository(Follow);

    //Gett all follow
    async getAllFollow(req: Request, res: Response) {
      try{
        const follows = await this.followRepository.find({relations: ['follower', 'following']});
        res.json(follows);
      } 
      catch (e){
        res.status(500).json({message: 'Error fetching follows',e});
      }
    }

    //Create follow
    async createFollow(req: Request, res: Response) {
      try {
        const {follower, following} = req.body;
        if (!follower?.id || !following?.id) {
          return res.status(400).json({ message: 'Missing follower or following id' });
        }
        if (follower.id === following.id) {
          return res.status(400).json({ message: 'You cannot follow yourself' });
        }
        //Check if follow already exists
        const existing = await this.followRepository.findOne({
          where: {
            follower: { id: follower.id },
            following: { id: following.id },
          },
        });
        if (existing) {
          return res.status(400).json({ message: 'Already following this user' });
        }
        const follow = this.followRepository.create(req.body);
        const result = await this.followRepository.save(follow);
        res.status(201).json(result);
      } 
      catch(e){
        res.status(500).json({ message: 'Error creating follow', e });
      }
    }
    
    //Delete follow
    async deleteFollow(req: Request,res: Response) {
      const id = parseInt(req.params.id);
      try{
        const result = await this.followRepository.delete(id);
        if (result.affected === 0) return res.status(404).json({message: 'Follow not found'});
        res.status(204).send();
      }
      catch(e){
        res.status(500).json({message: 'Error deleting follow',e});
      }
    }

    //Get followers of a user
    async getFollowers(req: Request, res: Response) {
        const userId = parseInt(req.params.id);
        try {
            const followers = await this.followRepository.find({
                where: { following: { id: userId } },
                relations: ['follower'],
            });
            res.json(followers.map(f => f.follower));
        } catch (e) {
            res.status(500).json({ message: 'Error fetching followers', e });
        }
    }

    //Get followings of a user
    async getFollowings(req: Request,res: Response) {
        const userId = parseInt(req.params.id);
        try {
            const followings = await this.followRepository.find({where: { follower: { id: userId } },relations: ['following'],});
            res.json(followings.map(f => f.following));
        } 
        catch(e) {
            res.status(500).json({message: 'Error fetching followings',e});
        }
    }
}