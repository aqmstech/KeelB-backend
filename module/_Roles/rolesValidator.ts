const Joi = require('joi');

export const addRolesValidator = Joi.object().keys(
    {
  name: Joi.string().min(2).max(255).required(),
  roleId: Joi.number().required(),
  isDeleted: Joi.boolean().required()
}
);

export const updateRolesValidator = Joi.object().keys(
    {
  name: Joi.string().min(2).max(255).required(),
  roleId: Joi.number().required(),
  isDeleted: Joi.boolean().required(),
  updatedAt: Joi.date().required()
}
);

export const getAllRolesValidator = Joi.object().keys(
    {
  name: Joi.string().min(2).max(255),
  roleId: Joi.number(),
  isDeleted: Joi.boolean(),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
  keyword: Joi.any(),
  withoutPagination: Joi.any(),
  page: Joi.any(),
  per_page: Joi.any()
}
);

