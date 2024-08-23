const Joi = require('joi');

export const addBlockusersValidator = Joi.object().keys(
  {
    blockedUserId: Joi.string().required().min(2).max(255).required()
  }
);

export const updateBlockusersValidator = Joi.object().keys(
  {
    userId: Joi.string().min(2).max(255).required(),
    blockedUserId: Joi.string().min(2).max(255).required()
  }
);

export const getAllBlockusersValidator = Joi.object().keys(
  {
    keyword: Joi.any(),
    withoutPagination: Joi.any(),
    page: Joi.any(),
    per_page: Joi.any()
  }
);

