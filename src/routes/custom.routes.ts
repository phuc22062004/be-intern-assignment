import { Router } from 'express';
import { CustomController } from '../controllers/custom.controller';
import { FollowController } from '../controllers/follow.controller';

export const customRouter = Router();
const customController = new CustomController();
const followController = new FollowController();

//Personalized content feed
customRouter.get('/feed', customController.getFeed.bind(CustomController));

//Find posts by hashtag
customRouter.get('/posts/hashtag/:tag', customController.getPostsByHashtag.bind(CustomController));

//Get user's followers 
customRouter.get('/users/:id/followers', followController.getFollowers.bind(followController));

//View user activity history 
customRouter.get('/users/:id/activity', customController.getUserActivity.bind(CustomController));
