import { Router } from 'express';
import { FollowController } from '../controllers/follow.controller';

export const followRouter = Router();
const followController = new FollowController();

//Follow a user
followRouter.post('/',followController.createFollow.bind(followController));

//Unfollow (delete by follow ID)
followRouter.delete('/:id',followController.deleteFollow.bind(followController));

//Get followers of a user
followRouter.get('/followers/:id',followController.getFollowers.bind(followController));

//Get followings of a user
followRouter.get('/followings/:id',followController.getFollowings.bind(followController));
