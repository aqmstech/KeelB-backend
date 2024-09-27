const Joi = require('joi');

export const addAmbianceValidator = Joi.object().keys(
    {
  name: Joi.string().min(2).max(255).required(),
  image: Joi.string().min(2).max(255).required(),
  status: Joi.boolean().required(),
  isFeatured: Joi.boolean(),
  updatedAt: Joi.date(),
  deletedAt: Joi.date()
}
);

export const updateAmbianceValidator = Joi.object().keys(
    {
  name: Joi.string().min(2).max(255).required(),
  image: Joi.string().min(2).max(255).required(),
  status: Joi.boolean().required(),
  isFeatured: Joi.boolean(),
  updatedAt: Joi.date(),
  deletedAt: Joi.date()
}
);

export const getAllAmbianceValidator = Joi.object().keys(
    {
  name: Joi.string().min(2).max(255),
  image: Joi.string().min(2).max(255),
      status: Joi.number(),
      isFeatured: Joi.number(),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
  deletedAt: Joi.date(),
  keyword: Joi.any(),
  withoutPagination: Joi.any(),
  page: Joi.any(),
  per_page: Joi.any()
}
);

