const Joi = require('joi');

export const addUserCardsValidator = Joi.object().keys(
    {
  user_id: Joi.string().min(2).max(255).optional(),
  pm_id: Joi.string().min(2).max(255).required()
}
);

export const updateUserCardsValidator = Joi.object().keys(
    {
  user_id: Joi.string().min(2).max(255).optional(),
  pm_id: Joi.string().min(2).max(255).required(),
  updatedAt: Joi.date().required(),
  deletedAt: Joi.date().optional()
}
);

export const getAllUserCardsValidator = Joi.object().keys(
    {
  user_id: Joi.string().min(2).max(255),
  pm_id: Joi.string().min(2).max(255),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
  deletedAt: Joi.date(),
  keyword: Joi.any(),
  withoutPagination: Joi.any(),
  page: Joi.any(),
  per_page: Joi.any()
}
);

