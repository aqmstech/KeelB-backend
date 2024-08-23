const Joi = require('joi');

export const addCityValidator = Joi.object().keys(
  {
    countryId: Joi.string().min(2).max(255).required(),
    regionId: Joi.string().min(2).max(255).required(),
    subRegionId: Joi.string().min(2).max(255).required(),
    stateId: Joi.string().min(2).max(255).required(),
    name: Joi.string().min(2).max(255).required(),
    population: Joi.number().required(),
  }
);

export const updateCityValidator = Joi.object().keys(
  {
    countryId: Joi.string().min(2).max(255).required(),
    regionId: Joi.string().min(2).max(255).required(),
    subRegionId: Joi.string().min(2).max(255).required(),
    stateId: Joi.string().min(2).max(255).required(),
    name: Joi.string().min(2).max(255).required(),
    population: Joi.number().required(),
  }
);

export const getAllCityValidator = Joi.object().keys(
  {
    keyword: Joi.any(),
    withoutPagination: Joi.any(),
    page: Joi.any(),
    per_page: Joi.any()
  }
);

