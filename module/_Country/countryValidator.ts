const Joi = require('joi');

export const addCountryValidator = Joi.object().keys(
  {
    regionId: Joi.string().min(2).max(255).required(),
    subRegionId: Joi.string().min(2).max(255).required(),
    name: Joi.string().min(2).max(255).required(),
    capital: Joi.string().min(2).max(255).required(),
    population: Joi.number().required(),
  }
);

export const updateCountryValidator = Joi.object().keys(
  {
    regionId: Joi.string().min(2).max(255).required(),
    subRegionId: Joi.string().min(2).max(255).required(),
    name: Joi.string().min(2).max(255).required(),
    capital: Joi.string().min(2).max(255).required(),
    population: Joi.number().required(),
  }
);

export const getAllCountryValidator = Joi.object().keys(
  {
    keyword: Joi.any(),
    withoutPagination: Joi.any(),
    page: Joi.any(),
    per_page: Joi.any()
  }
);

