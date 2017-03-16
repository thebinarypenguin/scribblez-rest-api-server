'use strict';

const Joi = require('joi');

const schemas = {};

schemas.error400 = Joi.object().keys({
  statusCode: Joi.number().equal(400).required(),
  error: Joi.string().equal('Bad Request').required(),
  message: Joi.string().optional(),
});

schemas.error401 = Joi.object().keys({
  statusCode: Joi.number().equal(401).required(),
  error: Joi.string().equal('Unauthorized').required(),
  message: Joi.string().optional(),
  attributes: Joi.object().optional(),
});

schemas.error404 = Joi.object().keys({
  statusCode: Joi.number().equal(404).required(),
  error: Joi.string().equal('Not Found').required(),
  message: Joi.string().optional(),
});

schemas.error500 = Joi.object().keys({
  statusCode: Joi.number().equal(500).required(),
  error: Joi.string().equal('Internal Server Error').required(),
  message: Joi.string().optional(),
});

module.exports = schemas;
