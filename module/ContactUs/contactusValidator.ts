const Joi = require('joi');

export const addContactUsValidator = Joi.object().keys(
    {
  name: Joi.string().min(2).max(255).required(),
  email: Joi.string().min(10).max(255).required(),
  phone: Joi.string().min(10).max(255).required(),
  message: Joi.string().min(2).max(1000).required(),
  deletedAt: Joi.date()
}
);

export const updateContactUsValidator = Joi.object().keys(
    {
  name: Joi.string().min(2).max(255).required(),
  email: Joi.string().min(10).max(255).required(),
  phone: Joi.string().min(10).max(255).required(),
  message: Joi.string().min(2).max(1000).required(),
  deletedAt: Joi.date()
}
);

export const getAllContactUsValidator = Joi.object().keys(
    {
  name: Joi.string().min(2).max(255),
  email: Joi.string().min(10).max(255),
  phone: Joi.string().min(10).max(255),
  message: Joi.string().min(2).max(1000),
  createdAt: Joi.date(),
  deletedAt: Joi.date(),
  keyword: Joi.any(),
  withoutPagination: Joi.any(),
  page: Joi.any(),
  per_page: Joi.any()
}
);

