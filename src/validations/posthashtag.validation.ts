import Joi from 'joi';

export const createPostHashtagSchema = Joi.object({
  postId: Joi.number().integer().required().messages({
    'number.base': 'Post ID must be a number',
    'any.required': 'Post ID is required'
  }),
  hashtagId: Joi.number().integer().required().messages({
    'number.base': 'Hashtag ID must be a number',
    'any.required': 'Hashtag ID is required'
  })
});
