const Joi = require('joi');

export const addCuisinesValidator = Joi.object().keys(
    {
  name: Joi.string().min(2).max(255).required(),
  image: Joi.string().min(2).max(255).required(),
  status: Joi.boolean().required(),
  isFeatured: Joi.boolean(),
  updatedAt: Joi.date(),
  deletedAt: Joi.date()
}
);

export const updateCuisinesValidator = Joi.object().keys(
    {
  name: Joi.string().min(2).max(255).required(),
  image: Joi.string().min(2).max(255).required(),
  status: Joi.boolean().required(),
  isFeatured: Joi.boolean(),
  updatedAt: Joi.date(),
  deletedAt: Joi.date()
}
);

export const getAllCuisinesValidator = Joi.object().keys(
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

