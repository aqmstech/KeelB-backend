const Joi = require('joi');

export const addStatesValidator = Joi.object().keys(
  {
    name: Joi.string().min(2).max(255).required(),
    countryId: Joi.string().min(2).max(255).required(),
    regionId: Joi.string().min(2).max(255).required(),
    subRegionId: Joi.string().min(2).max(255).required(),
  }
);

export const updateStatesValidator = Joi.object().keys(
  {
    name: Joi.string().min(2).max(255).required(),
    countryId: Joi.string().min(2).max(255).required(),
    regionId: Joi.string().min(2).max(255).required(),
    subRegionId: Joi.string().min(2).max(255).required(),
  }
);

export const getAllStatesValidator = Joi.object().keys(
  {
    keyword: Joi.any(),
    withoutPagination: Joi.any(),
    page: Joi.any(),
    per_page: Joi.any()
  }
);

