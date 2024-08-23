const Joi = require('joi');

export const addVideosValidator = Joi.object().keys(
    {
  category_id: Joi.string().min(2).max(255),
  title: Joi.string().min(2).max(255).required(),
  thumbnail: Joi.string().max(255),
  url: Joi.string().max(255).required(),
  duration: Joi.number().required(),
  is_feature: Joi.boolean().required(),
  status: Joi.boolean().required(),
  updatedAt: Joi.date(),
  deletedAt: Joi.date()
}
);

export const updateVideosValidator = Joi.object().keys(
    {
  category_id: Joi.string().min(2).max(255),
  title: Joi.string().min(2).max(255).required(),
  thumbnail: Joi.string().max(255),
  url: Joi.string().max(255).required(),
  duration: Joi.number().required(),
  is_feature: Joi.boolean().required(),
  status: Joi.boolean().required(),
  updatedAt: Joi.date(),
  deletedAt: Joi.date()
}
);

export const getAllVideosValidator = Joi.object().keys(
    {
  category_id: Joi.string().min(2).max(255),
  title: Joi.string().min(2).max(255),
  thumbnail: Joi.string().max(255),
  url: Joi.string().max(255),
  duration: Joi.number(),
  is_feature: Joi.string(),
  status: Joi.string(),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
  deletedAt: Joi.date(),
  keyword: Joi.any(),
  withoutPagination: Joi.any(),
  page: Joi.any(),
  per_page: Joi.any()
}
);

