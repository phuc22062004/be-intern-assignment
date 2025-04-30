import { Router } from 'express';
import { LikeController } from '../controllers/like.controller';

export const likeRouter = Router();
const likeController = new LikeController();

// Like a post
likeRouter.post('/', likeController.createLike.bind(likeController));

// Unlike a post
likeRouter.delete('/:id', likeController.deleteLike.bind(likeController));

// Get all likes
likeRouter.get('/', likeController.getAllLike.bind(likeController));
