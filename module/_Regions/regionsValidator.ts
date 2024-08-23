const Joi = require('joi');

export const addRegionsValidator = Joi.object().keys(
  {
    name: Joi.string().min(2).max(255).required(),
    status: Joi.boolean(),
  }
);

export const updateRegionsValidator = Joi.object().keys(
  {
    name: Joi.string().min(2).max(255).required(),
    status: Joi.boolean(),
  }
);

export const getAllRegionsValidator = Joi.object().keys(
  {
    keyword: Joi.any(),
    withoutPagination: Joi.any(),
    page: Joi.any(),
    per_page: Joi.any()
  }
);

