import Joi from 'joi';

export const createPostSchema = Joi.object({
  content: Joi.string().required().messages({
    'string.empty': 'Post content is required'
  }),
  userId: Joi.number().integer().required().messages({
    'number.base': 'User ID must be a number',
    'any.required': 'User ID is required'
  })
});

export const updatePostSchema = Joi.object({
  content: Joi.string().messages({
    'string.empty': 'Post content cannot be empty'
  })
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});
