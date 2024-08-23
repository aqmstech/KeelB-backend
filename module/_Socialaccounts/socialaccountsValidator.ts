const Joi = require('joi');

export const addSocialaccountsValidator = Joi.object().keys(
  {
    userId: Joi.string().min(2).max(255).required(),
    clientId: Joi.string().min(2).max(255).required(),
    authType: Joi.string().min(2).max(255).required()
  }
);

export const updateSocialaccountsValidator = Joi.object().keys(
  {
    userId: Joi.string().min(2).max(255).required(),
    clientId: Joi.string().min(2).max(255).required(),
    authType: Joi.string().min(2).max(255).required(),
    updatedAt: Joi.date()
  }
);

export const getAllSocialaccountsValidator = Joi.object().keys(
  {
    userId: Joi.string().min(2).max(255),
    clientId: Joi.string().min(2).max(255),
    authType: Joi.string().min(2).max(255),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
    keyword: Joi.any(),
    withoutPagination: Joi.any(),
    page: Joi.any(),
    per_page: Joi.any()
  }
);

