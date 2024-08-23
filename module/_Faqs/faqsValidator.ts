const Joi = require('joi');

export const addFaqsValidator = Joi.object().keys(
  {
    question: Joi.string().min(2).max(1000).required(),
    answer: Joi.string().min(2).max(1000).required()
  }
);

export const updateFaqsValidator = Joi.object().keys(
  {
    question: Joi.string().min(2).max(1000).required(),
    answer: Joi.string().min(2).max(1000).required(),
  }
);

export const getAllFaqsValidator = Joi.object().keys(
  {
    keyword: Joi.any(),
    withoutPagination: Joi.any(),
    page: Joi.any(),
    per_page: Joi.any()
  }
);

