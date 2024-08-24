const Joi = require('joi');

export const addReviewsValidator = Joi.object().keys(
    {
  reviewer_name: Joi.string().min(2).max(255),
  images: Joi.array(),
  description: Joi.string().min(2).required(),
  rating: Joi.number().required(),
  user_id: Joi.string().min(2).max(255),
  restaurant_id: Joi.string().min(2).max(255),
  status: Joi.boolean(),
  updatedAt: Joi.date(),
  deletedAt: Joi.date()
}
);

export const updateReviewsValidator = Joi.object().keys(
    {
  reviewer_name: Joi.string().min(2).max(255),
  images: Joi.array(),
  description: Joi.string().min(2).required(),
  rating: Joi.number().required(),
  user_id: Joi.string().min(2).max(255),
  restaurant_id: Joi.string().min(2).max(255),
  status: Joi.boolean(),
  updatedAt: Joi.date(),
  deletedAt: Joi.date()
}
);

export const getAllReviewsValidator = Joi.object().keys(
    {
  reviewer_name: Joi.string().min(2).max(255),
  images: Joi.array(),
  description: Joi.string().min(2),
  rating: Joi.number(),
  user_id: Joi.string().min(2).max(255),
  restaurant_id: Joi.string().min(2).max(255),
  status: Joi.boolean(),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
  deletedAt: Joi.date(),
  keyword: Joi.any(),
  withoutPagination: Joi.any(),
  page: Joi.any(),
  per_page: Joi.any()
}
);

