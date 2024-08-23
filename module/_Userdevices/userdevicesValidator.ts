const Joi = require('joi');

export const addUserdevicesValidator = Joi.object().keys(
  {
    userId: Joi.string().min(2).max(255).required(),
    deviceToken: Joi.string().min(2).max(255).required(),
    deviceType: Joi.string().min(2).max(255).required(),
    isDeleted: Joi.boolean()
  }
);

export const updateUserdevicesValidator = Joi.object().keys(
  {
    userId: Joi.string().min(2).max(255).required(),
    deviceToken: Joi.string().min(2).max(255).required(),
    deviceType: Joi.string().min(2).max(255).required(),
    isDeleted: Joi.boolean(),
    updatedAt: Joi.date().required()
  }
);

export const getAllUserdevicesValidator = Joi.object().keys(
  {
    userId: Joi.string().min(2).max(255),
    deviceToken: Joi.string().min(2).max(255),
    deviceType: Joi.string().min(2).max(255),
    isDeleted: Joi.boolean(),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
    keyword: Joi.any(),
    withoutPagination: Joi.any(),
    page: Joi.any(),
    per_page: Joi.any()
  }
);

export const getDevicesOfUserValidator = Joi.object().keys(
  {
    userId: Joi.array().min(1).required()
  }
);

