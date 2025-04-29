import Joi from 'joi';

export const createHashtagSchema = Joi.object({
  name: Joi.string().required().max(255).messages({
    'string.empty': 'Hashtag name is required',
    'string.max': 'Hashtag name cannot exceed 255 characters'
  })
});

export const updateHashtagSchema = Joi.object({
  name: Joi.string().max(255).messages({
    'string.max': 'Hashtag name cannot exceed 255 characters'
  })
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});
