const Joi = require('joi');

export const addRecentSearchesValidator = Joi.object().keys(
    {
  user_id: Joi.string().min(2).max(255).required(),
  keyword: Joi.string().min(2).max(255).required(),
  module: Joi.string().valid('restaurants'),
  updatedAt: Joi.date(),
  deletedAt: Joi.date()
}
);

export const updateRecentSearchesValidator = Joi.object().keys(
    {
  user_id: Joi.string().min(2).max(255).required(),
  keyword: Joi.string().min(2).max(255).required(),
  module: Joi.string().valid('restaurants'),
  updatedAt: Joi.date(),
  deletedAt: Joi.date()
}
);

export const getAllRecentSearchesValidator = Joi.object().keys(
    {
  user_id: Joi.string().min(2).max(255),
  keyword: Joi.any(),
  module: Joi.string().valid('restaurants'),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
  deletedAt: Joi.date(),
  withoutPagination: Joi.any(),
  page: Joi.any(),
  per_page: Joi.any()
}
);

