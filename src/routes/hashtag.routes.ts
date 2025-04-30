import { Router } from 'express';
import { HashtagController } from '../controllers/hashtag.controller';
import { validate } from '../middleware/validation.middleware';
import { createHashtagSchema, updateHashtagSchema } from '../validations/hashtag.validation';

export const hashtagRouter = Router();
const hashtagController = new HashtagController();

// Get all hashtags
hashtagRouter.get('/', hashtagController.getAllHashtag.bind(hashtagController));

// Get hashtag by id
hashtagRouter.get('/:id', hashtagController.getHashtagById.bind(hashtagController));

// Create new hashtag
hashtagRouter.post('/', validate(createHashtagSchema), hashtagController.createHashtag.bind(hashtagController));

// Update hashtag
hashtagRouter.put('/:id', validate(updateHashtagSchema), hashtagController.updateHashtag.bind(hashtagController));

// Delete hashtag
hashtagRouter.delete('/:id', hashtagController.deleteHashtag.bind(hashtagController));
