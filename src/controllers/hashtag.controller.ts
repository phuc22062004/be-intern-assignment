import { Request, Response } from "express";
import { Hashtag } from "../entities/Hashtag";
import { AppDataSource } from "../data-source";

export class HashtagController{
    private hashtagRepository = AppDataSource.getRepository(Hashtag);

    //Get all hashtag
    async getAllHashtag(req:Request, res: Response){
        try{
            const hashtags = await this.hashtagRepository.find({relations: ['post_hashtags']});
            res.json(hashtags);
        }
        catch(e){
            res.status(500).json({message: 'Error fetching hashtags',e})
        }
    }

    //Find hashtag by id
    async getHashtagById(req:Request, res: Response){
        const id = parseInt(req.params.id);
        try{
            const hashtag = await this.hashtagRepository.findOne({where: {id}, relations: ['post_hashtags']});
            if(!hashtag) return res.status(404).json({message: 'Hashtag not found'});
            res.json(hashtag);
        }
        catch(e){
            res.status(500).json({message: 'Error fetching hashtag',e});
        }
    }

    //Create hashtag
    async createHashtag(req: Request, res: Response){
        try{
            const hashtag = this.hashtagRepository.create(req.body);
            const result = await this.hashtagRepository.save(hashtag);
            res.status(201).json(result);
        }
        catch(e){
            return res.status(500).json({message: 'Error creating hashtag',e});
        }
    }

    //Delete hashtag
    async deleteHashtag(req: Request, res: Response){
        const id = parseInt(req.params.id);
        try{
            const hashtag = await this.hashtagRepository.delete(id);
            if(hashtag.affected === 0) return res.status(404).json({message: 'Hashtag not found'});
            res.status(204).send();
        }
        catch(e){
            res.status(500).json({message: 'Error deleting hashtag', e})
        }
    }
}