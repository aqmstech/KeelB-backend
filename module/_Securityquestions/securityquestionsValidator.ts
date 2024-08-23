const Joi = require('joi');

export const addSecurityquestionsValidator = Joi.object().keys(
  {
    question: Joi.string().min(2).max(1000).required()
  }
);

export const updateSecurityquestionsValidator = Joi.object().keys(
  {
    question: Joi.string().min(2).max(1000).required()
  }
);

export const getAllSecurityquestionsValidator = Joi.object().keys(
  {
    keyword: Joi.any(),
    withoutPagination: Joi.any(),
    page: Joi.any(),
    per_page: Joi.any()
  }
);

