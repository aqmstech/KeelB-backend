const Joi = require('joi');

export const addPagesValidator = Joi.object().keys(
  {
    title: Joi.string().min(2).max(1000).required(),
    content: Joi.string().min(2).required(),
    slug: Joi.string().min(2).max(255).required(),
  }
);

export const updatePagesValidator = Joi.object().keys(
  {
    title: Joi.string().min(2).max(1000).required(),
    content: Joi.string().min(2).required(),
    slug: Joi.string().min(2).max(255).required(),
  }
);

export const getAllPagesValidator = Joi.object().keys(
  {
    keyword: Joi.any(),
    withoutPagination: Joi.any(),
    page: Joi.any(),
    per_page: Joi.any()
  }
);

