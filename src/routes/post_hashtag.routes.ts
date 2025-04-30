import { Router } from 'express';
import { PostHashTagController } from '../controllers/posthashtag.controller';

export const postHashtagRouter = Router();
const postHashtagController = new PostHashTagController();

// Get all post-hashtag links
postHashtagRouter.get('/', postHashtagController.getAllPosthashtag.bind(postHashtagController));

// Get one by ID
postHashtagRouter.get('/:id', postHashtagController.getPostHashtagById.bind(postHashtagController));

// Create post-hashtag link
postHashtagRouter.post('/', postHashtagController.createPostHashtag.bind(postHashtagController));

// Delete post-hashtag link
postHashtagRouter.delete('/:id', postHashtagController.deletePostHashtag.bind(postHashtagController));
