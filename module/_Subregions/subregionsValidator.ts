const Joi = require('joi');

export const addSubregionsValidator = Joi.object().keys(
  {
    regionId: Joi.string().min(2).max(255).required(),
    name: Joi.string().min(2).max(255).required(),
  }
);

export const updateSubregionsValidator = Joi.object().keys(
  {
    regionId: Joi.string().min(2).max(255).required(),
    name: Joi.string().min(2).max(255).required(),
  }
);

export const getAllSubregionsValidator = Joi.object().keys(
  {
    keyword: Joi.any(),
    withoutPagination: Joi.any(),
    page: Joi.any(),
    per_page: Joi.any()
  }
);

