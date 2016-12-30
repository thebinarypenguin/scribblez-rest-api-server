'use strict';

const Joi = require('joi');

const schemas = {};

schemas.username = Joi.string().regex(/^[a-z0-9_]+$/).min(3).max(20);

schemas.user = Joi.object().keys({
  username: Joi.string().regex(/^[a-z0-9_]+$/).min(3).max(20).required(),
  real_name: Joi.string().min(1).max(80).required(),
  email_address: Joi.string().email().min(1).max(80).required(),
}).options({ convert: false });

schemas.userRedacted = Joi.object().keys({
  username: Joi.string().regex(/^[a-z0-9_]+$/).min(3).max(20).required(),
  real_name: Joi.string().min(1).max(80).required(),
  email_address: Joi.any().forbidden(),
}).options({ convert: false });

schemas.userCollectionRedacted = Joi.array().items(schemas.userRedacted);

schemas.userCreatePayload = Joi.object().keys({
  username: Joi.string().regex(/^[a-z0-9_]+$/).min(3).max(20).required(),
  real_name: Joi.string().min(1).max(80).required(),
  email_address: Joi.string().email().min(1).max(80).required(),
  password: Joi.string().min(8).max(80).required(),
  password_confirmation: Joi.string().valid(Joi.ref('password')).required(),
}).options({ convert: false });

schemas.userUpdatePayload = Joi.object().keys({
  real_name: Joi.string().min(1).max(80).optional(),
  email_address: Joi.string().email().min(1).max(80).optional(),
  password: Joi.string().min(8).max(80).optional(),
  password_confirmation: Joi.string().valid(Joi.ref('password')).optional(),
}).min(1).and('password', 'password_confirmation').options({ convert: false });

schemas.userReplacePayload = Joi.object().keys({
  real_name: Joi.string().min(1).max(80).required(),
  email_address: Joi.string().email().min(1).max(80).required(),
  password: Joi.string().min(8).max(80).required(),
  password_confirmation: Joi.string().valid(Joi.ref('password')).required(),
}).options({ convert: false });

module.exports = schemas;
