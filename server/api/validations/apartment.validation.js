const Joi = require('joi');
const User = require('../models/user.model');

module.exports = {

  // POST /v1/apartments
  createApartment: {
    body: {
      name: Joi.string().required(),
      description: Joi.string().required(),
      size: Joi.number().required(),
      price: Joi.number().required(),
      rooms: Joi.number().integer().required(),
      location: {
        lat: Joi.number().required(),
        lng: Joi.number().required()
      },
      address: Joi.string().required()
    },
  },


  // PATCH /v1/apartments/:apartmentId
  updateApartment: {
    body: {
      name: Joi.string(),
      description: Joi.string(),
      size: Joi.number(),
      price: Joi.number(),
      rooms: Joi.number().integer(),
      location: {
        lat: Joi.number(),
        lng: Joi.number()
      },
      address: Joi.string()
    },
    params: {
      apartmentId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },
};
