const Joi = require('joi');

export const addUserFavoritesValidator = Joi.object().keys(
    {
  user_id: Joi.string().min(2).max(255),
  restaurant_id: Joi.string().min(2).max(255),
  updatedAt: Joi.date(),
  deletedAt: Joi.date()
}
);

export const updateUserFavoritesValidator = Joi.object().keys(
    {
  user_id: Joi.string().min(2).max(255),
  restaurant_id: Joi.string().min(2).max(255),
  updatedAt: Joi.date(),
  deletedAt: Joi.date()
}
);

export const getAllUserFavoritesValidator = Joi.object().keys(
    {
  user_id: Joi.string().min(2).max(255),
  restaurant_id: Joi.string().min(2).max(255),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
  deletedAt: Joi.date(),
  keyword: Joi.any(),
  withoutPagination: Joi.any(),
  page: Joi.any(),
  per_page: Joi.any()
}
);

