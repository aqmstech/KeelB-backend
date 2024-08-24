const Joi = require('joi');

export const addUserRestaurantSuggestionsValidator = Joi.object().keys(
    {
  name: Joi.string().min(2).max(255),
  location: Joi.any(),
  address: Joi.string().min(2).required(),
  phone: Joi.string().min(10).max(255).required(),
  user_id: Joi.string().min(2).max(255),
  updatedAt: Joi.date(),
  deletedAt: Joi.date()
}
);

export const updateUserRestaurantSuggestionsValidator = Joi.object().keys(
    {
  name: Joi.string().min(2).max(255),
  location: Joi.any(),
  address: Joi.string().min(2).required(),
  phone: Joi.string().min(10).max(255).required(),
  user_id: Joi.string().min(2).max(255),
  updatedAt: Joi.date(),
  deletedAt: Joi.date()
}
);

export const getAllUserRestaurantSuggestionsValidator = Joi.object().keys(
    {
  name: Joi.string().min(2).max(255),
  location: Joi.any(),
  address: Joi.string().min(2),
  phone: Joi.string().min(10).max(255),
  user_id: Joi.string().min(2).max(255),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
  deletedAt: Joi.date(),
  keyword: Joi.any(),
  withoutPagination: Joi.any(),
  page: Joi.any(),
  per_page: Joi.any()
}
);

