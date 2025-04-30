import { Router } from 'express';
import { PostHashtagController } from '../controllers/post_hashtag.controller';

export const postHashtagRouter = Router();
const postHashtagController = new PostHashtagController();

// Get all post-hashtag links
postHashtagRouter.get('/', postHashtagController.getAll.bind(postHashtagController));

// Get one by ID
postHashtagRouter.get('/:id', postHashtagController.getById.bind(postHashtagController));

// Create post-hashtag link
postHashtagRouter.post('/', postHashtagController.create.bind(postHashtagController));

// Delete post-hashtag link
postHashtagRouter.delete('/:id', postHashtagController.delete.bind(postHashtagController));
