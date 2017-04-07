'use strict';

const Joi = require('joi');

const schemas = {};

schemas.feedOptions = Joi.object().keys({
  page: Joi.number().positive().integer().optional().default(1),
  per_page: Joi.number().positive().integer().optional().default(20),
  visibility: Joi.any().valid('public', 'shared').optional(),
});

module.exports = schemas;
