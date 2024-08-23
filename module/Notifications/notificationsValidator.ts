import UserRoles from "../../utils/enums/userRoles";

const Joi = require('joi');

export const addNotificationsValidator = Joi.object().keys(
    {
  title: Joi.string().min(2).max(255).required(),
  body: Joi.string().min(2).max(1000).required(),
  sender_id: Joi.string().min(2).max(255).optional(),
  receiver_id: Joi.string().min(2).max(255).optional(),
  topic: Joi.string().min(2).max(255).required(),
  ref_id: Joi.string().min(2).max(255).optional(),
  is_read: Joi.boolean(),
  status: Joi.boolean(),
  type: Joi.string().valid(UserRoles.USER,UserRoles.ADMIN).required(),
  updatedAt: Joi.date(),
  deletedAt: Joi.date()
}
);

export const updateNotificationsValidator = Joi.object().keys(
    {
  title: Joi.string().min(2).max(255).required(),
  body: Joi.string().min(2).max(1000).required(),
  sender_id: Joi.string().min(2).max(255).required(),
  receiver_id: Joi.string().min(2).max(255).required(),
  topic: Joi.string().min(2).max(255).required(),
  ref_id: Joi.string().min(2).max(255).required(),
  is_read: Joi.boolean(),
  status: Joi.boolean(),
      type: Joi.string().valid(UserRoles.USER,UserRoles.ADMIN).required(),
  updatedAt: Joi.date(),
  deletedAt: Joi.date()
}
);

export const getAllNotificationsValidator = Joi.object().keys(
    {
  title: Joi.string().min(2).max(255),
  body: Joi.string().min(2).max(1000),
  sender_id: Joi.string().min(2).max(255),
  receiver_id: Joi.string().min(2).max(255),
  topic: Joi.string().min(2).max(255),
  ref_id: Joi.string().min(2).max(255),
  is_read: Joi.boolean(),
  status: Joi.boolean(),
      type: Joi.string().valid(UserRoles.USER,UserRoles.ADMIN),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
  deletedAt: Joi.date(),
  keyword: Joi.any(),
  withoutPagination: Joi.any(),
  page: Joi.any(),
  per_page: Joi.any()
}
);

