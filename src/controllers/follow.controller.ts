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
        res.status(500).json({message: 'e fetching follows',e});
      }
    }

    //Create follow
    async createFollow(req: Request, res: Response) {
      try{
        const follow = this.followRepository.create(req.body);
        const result = await this.followRepository.save(follow);
        res.status(201).json(result);
      }
      catch(e){
        res.status(500).json({message: 'e creating follow',e});
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
}