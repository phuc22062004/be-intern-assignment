import { Request,Response } from "express";
import { Like } from "../entities/Like";
import { AppDataSource } from "../data-source";

export class LikeController{
    private likeRepository = AppDataSource.getRepository(Like);

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

    //Find like by id
    async getLikeById(req: Request, res: Response){
        try{
            const id = parseInt(req.params.id);
            const like = await this.likeRepository.findOne({where: {id}, relations: ['user', 'post']});
            if(!like) return res.status(404).json({message: 'Like not found'});
            res.json(like);
        }
        catch(e){
            return res.status(500).json({message: 'Error fetching like', e});
        }
    }

    //Create like
    async createLike(req: Request, res: Response){
        try{
            const like = this.likeRepository.create(req.body);
            const result  = await this.likeRepository.save(like);
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
            const like = await this.likeRepository.delete(id);
            if(like.affected === 0){
                return res.status(404).json({message: 'Like not found'});
            }
            res.status(204).send();
        }
        catch(e){
            return res.status(500).json({message: 'Error deleting like', e});
        }
    }
}