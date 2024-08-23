const Joi = require('joi');

export const addAccountdeletionsValidator = Joi.object().keys(
  {
    userId: Joi.string().min(2).max(255).required(),
    reason: Joi.string().min(2).max(1000).required()
  }
);

export const updateAccountdeletionsValidator = Joi.object().keys(
  {
    userId: Joi.string().min(2).max(255).required(),
    reason: Joi.string().min(2).max(1000).required()
  }
);

export const getAllAccountdeletionsValidator = Joi.object().keys(
  {
    keyword: Joi.any(),
    withoutPagination: Joi.any(),
    page: Joi.any(),
    per_page: Joi.any()
  }
);

