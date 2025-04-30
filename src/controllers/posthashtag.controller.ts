import { Request, Response } from 'express';
import { Post_hashtag } from '../entities/Post_hashtag';
import { AppDataSource } from '../data-source';

export class PostHashTagController{
    private posthashtagRepository = AppDataSource.getRepository(Post_hashtag);

    //Get all post hashtag
    async getAllPosthashtag(req: Request,res: Response) {
        try{
          const links = await this.posthashtagRepository.find({relations: ['post', 'hashtag']});
          res.json(links);
        } 
        catch(e){
          res.status(500).json({message: 'Error fetching post-hashtag links',e});
        }
      }

    //Find all post hashtag by id
    async getPostHashtagById(req: Request, res: Response){
        const id = parseInt(req.params.id);
        try{
            const post_hashtag = await this.posthashtagRepository.findOne({where: {id}, relations: ['post', 'hashtag']});
            if(!post_hashtag) return res.status(404).json({message: 'Post hashtag not found'});
            res.json(post_hashtag);
        }
        catch(e){
            res.status(500).json({message: 'Error fetching post',e});
        }
    }        
    //Create post hashtag
    async createPostHashtag(req: Request,res: Response) {
        try{
          const link = this.posthashtagRepository.create(req.body);
          const result = await this.posthashtagRepository.save(link);
          res.status(201).json(result);
        }
        catch(e){
          res.status(500).json({message: 'Error creating post-hashtag link',e});
        }
      }

    //Delete post hashtag
    async deletePostHashtag(req: Request,res: Response) {
        const id = parseInt(req.params.id);
        try {
          const result = await this.posthashtagRepository.delete(id);
          if (result.affected === 0) return res.status(404).json({message: 'Link not found'});
          res.status(204).send();
        } catch (e) {
          res.status(500).json({message: 'Error deleting post-hashtag link',e});
        }
      }
}