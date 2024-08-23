const Joi = require('joi');

export const addSamplesValidator = Joi.object().keys(
    {
  name: Joi.string().min(2).max(255).required(),
  description: Joi.string().min(2).max(1000).required()
}
);

export const updateSamplesValidator = Joi.object().keys(
    {
  name: Joi.string().min(2).max(255).required(),
  description: Joi.string().min(2).max(1000).required()
}
);

export const getAllSamplesValidator = Joi.object().keys(
    {
  name: Joi.string().min(2).max(255),
  description: Joi.string().min(2).max(1000),
  createdAt: Joi.date().max('10-10-2023').iso(),
  keyword: Joi.any(),
  withoutPagination: Joi.any(),
  page: Joi.any(),
  per_page: Joi.any()
}
);

