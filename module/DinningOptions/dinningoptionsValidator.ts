const Joi = require('joi');

export const addDinningOptionsValidator = Joi.object().keys(
    {
  name: Joi.string().min(2).max(255).required(),
  image: Joi.string().min(2).max(255),
  status: Joi.boolean().required(),
  isFeatured: Joi.boolean(),
  updatedAt: Joi.date(),
  deletedAt: Joi.date()
}
);

export const updateDinningOptionsValidator = Joi.object().keys(
    {
  name: Joi.string().min(2).max(255).required(),
  image: Joi.string().min(2).max(255),
  status: Joi.boolean().required(),
  isFeatured: Joi.boolean(),
  updatedAt: Joi.date(),
  deletedAt: Joi.date()
}
);

export const getAllDinningOptionsValidator = Joi.object().keys(
    {
  name: Joi.string().min(2).max(255),
  image: Joi.string().min(2).max(255),
  status: Joi.boolean(),
  isFeatured: Joi.boolean(),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
  deletedAt: Joi.date(),
  keyword: Joi.any(),
  withoutPagination: Joi.any(),
  page: Joi.any(),
  per_page: Joi.any()
}
);

