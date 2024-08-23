const Joi = require('joi');

export const addDonationsValidator = Joi.object().keys(
    {
  donation_number: Joi.string().min(2).max(255),
  donor_name: Joi.string().min(2).max(255).required(),
  purpose: Joi.string().min(2).required(),
  amount: Joi.number().required(),
  user_id: Joi.string().min(2).max(255),
  payment_method: Joi.string().min(2).max(255).required(),
  payment_method_type: Joi.string().valid('apple','google','stripe').required(),
  status: Joi.string().valid('succeeded','failed','pending'),
  payload: Joi.any(),
  updatedAt: Joi.date(),
  deletedAt: Joi.date()
}
);

export const updateDonationsValidator = Joi.object().keys(
    {
  donation_number: Joi.string().min(2).max(255),
  donor_name: Joi.string().min(2).max(255).required(),
  purpose: Joi.string().min(2).required(),
  amount: Joi.number().required(),
  user_id: Joi.string().min(2).max(255),
  payment_method: Joi.string().min(2).max(255).required(),
  payment_method_type: Joi.string().valid('apple','google','stripe').required(),
  status: Joi.string().valid('succeeded','failed','pending'),
  payload: Joi.any(),
  updatedAt: Joi.date(),
  deletedAt: Joi.date()
}
);

export const getAllDonationsValidator = Joi.object().keys(
    {
  donation_number: Joi.string().min(2).max(255),
  donor_name: Joi.string().min(2).max(255),
  purpose: Joi.string().min(2),
  amount: Joi.number(),
  user_id: Joi.string().min(2).max(255),
  payment_method: Joi.string().min(2).max(255),
  payment_method_type: Joi.string().valid('apple','google','stripe'),
  status: Joi.string().valid('succeeded','failed','pending'),
  payload: Joi.any(),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
  deletedAt: Joi.date(),
  keyword: Joi.any(),
  withoutPagination: Joi.any(),
  page: Joi.any(),
  per_page: Joi.any()
}
);

