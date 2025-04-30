import { Request,Response } from "express";
import { Like } from "../entities/Like";
import { AppDataSource } from "../data-source";
import { Post } from '../entities/Post';

export class LikeController{
    private likeRepository = AppDataSource.getRepository(Like);
    private postRepository = AppDataSource.getRepository(Post);

    //Get all like
    async getAllLike(req: Request, res: Response){
        try{
            const likes = await this.likeRepository.find({relations: ['post', 'user']});
            res.json(likes);
        }
        catch(e){
            res.status(500).json({message: 'Error fetching likes', e});
        }
    }

    //Create like
    async createLike(req: Request, res: Response){
        try{
            const like = this.likeRepository.create(req.body);
            const result  = await this.likeRepository.save(like);
            await this.postRepository.increment({ id: req.body.postId }, 'sumlikes', 1);
            res.status(201).json(result);
        }
        catch(e){
            res.status(500).json({message: 'Error creating like',e});
        }
    }

    //Delete like
    async deleteLike(req: Request, res: Response){
        const id = parseInt(req.params.id);
        try{
            const like = await this.likeRepository.findOne({ where: { id }, relations: ['post'] });
            if(!like){
                return res.status(404).json({message: 'Like not found'});
            }
            const postId = like.post.id;

            await this.likeRepository.delete(id);

            await this.postRepository.decrement({ id: postId }, 'sumlikes', 1);
            res.status(204).send();
        }
        catch(e){
            return res.status(500).json({message: 'Error deleting like', e});
        }
    }
}