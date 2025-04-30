import { Request, Response } from "express";
import { Post } from "../entities/Post";
import { AppDataSource } from "../data-source";


export class PostController {
    private postRepository = AppDataSource.getRepository(Post);

    //Get all post
    async getAllPost(req: Request, res: Response){
        try{
            const posts = await this.postRepository.find({relations: ['user','likes','post_hashtags']});
            res.json(posts);
        }
        catch(e){
            res.status(500).json({message: 'Error fetching users', e});
        }
    }

    //Find post by id
    async getPostById(req: Request, res: Response){
        const id = parseInt(req.params.id);
        try{
            const post = await this.postRepository.findOne({where: {id}, relations: ['user','likes', 'post_hashtags']});
            if(!post) return res.status(404).json({message: 'Post not found'});
            res.json(post);
        }
        catch(e){
            res.status(500).json({message: 'Error fetching post',e});
        }
    }

    //Create post
    async createPost(req: Request, res: Response){
        try{
            const post = this.postRepository.create(req.body);
            const result = await this.postRepository.save(post);
            res.status(201).json(result);
        }
        catch(e){
            res.status(500).json({message: 'Error to creating post', e});
        }
    }

    //Update post
    async updatePost(req: Request, res: Response){
        const id = parseInt(req.params.id);
        try{
            const post = await this.postRepository.findOneBy({id});
            if(!post){
                return res.status(404).json({message: 'Post not found '});
            }
            this.postRepository.merge(post, req.body);
            const result = await this.postRepository.save(post);
            res.json(result);
        }
        catch(e){
            res.status(500).json({message: 'Error updating post',e});
        }
    }

    //Delete post
    async deletePost(req: Request, res: Response){
        const id = parseInt(req.params.id);
        try {
            const result = await this.postRepository.delete(id);
            if(result.affected === 0){
                return res.status(404).json({message: 'Post not found'});
            }
            res.status(204).send();
        }
        catch(e)
        {   
            res.status(500).json({message: 'Error deleting post',e});
        }

    }
}