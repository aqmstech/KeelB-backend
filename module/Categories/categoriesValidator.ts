const Joi = require('joi');

export const addCategoriesValidator = Joi.object().keys(
    {
  name: Joi.string().min(2).max(255).required(),
  image: Joi.string().min(2).max(255).required(),
  parent_id: Joi.string().min(2).max(255),
  status: Joi.boolean().required(),
  type: Joi.string().valid('food'),
  isFeatured: Joi.boolean(),
  updatedAt: Joi.date(),
  deletedAt: Joi.date()
}
);

export const updateCategoriesValidator = Joi.object().keys(
    {
  name: Joi.string().min(2).max(255).required(),
  image: Joi.string().min(2).max(255).required(),
  parent_id: Joi.string().min(2).max(255),
  status: Joi.boolean().required(),
  type: Joi.string().valid('food'),
  isFeatured: Joi.boolean(),
  updatedAt: Joi.date(),
  deletedAt: Joi.date()
}
);

export const getAllCategoriesValidator = Joi.object().keys(
    {
  name: Joi.string().min(2).max(255),
  image: Joi.string().min(2).max(255),
  parent_id: Joi.string().min(2).max(255),
  status: Joi.boolean(),
  type: Joi.string().valid('food'),
  isFeatured: Joi.boolean(),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
  deletedAt: Joi.date(),
  keyword: Joi.any(),
  filter: Joi.any(),
  withoutPagination: Joi.any(),
  page: Joi.any(),
  per_page: Joi.any()
}
);

