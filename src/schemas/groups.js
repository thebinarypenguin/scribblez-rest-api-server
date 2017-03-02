'use strict';

const Joi = require('joi');

const user = require('./users.js');

const schemas = {};

schemas.groupID = Joi.number().integer().options({ convert: false });

schemas.groupName = Joi.string().min(1).max(80).options({ convert: false });

schemas.group = Joi.object().keys({
  id: Joi.number().integer().required(),
  name: Joi.string().min(1).max(80).required(),
  members: Joi.array().items(user.userRedacted).required(),
}).options({ convert: false });

schemas.groupCollection = Joi.array().items(schemas.group).options({ convert: false });

schemas.groupCreatePayload = Joi.object().keys({
  name: Joi.string().min(1).max(80).required(),
  members: Joi.array().items(user.username).required(),
}).options({ convert: false });

schemas.groupUpdatePayload = Joi.object().keys({
  name: Joi.string().min(1).max(80).optional(),
  members: Joi.array().items(user.username).optional(),
}).min(1).options({ convert: false });

schemas.groupReplacePayload = Joi.object().keys({
  name: Joi.string().min(1).max(80).required(),
  members: Joi.array().items(user.username).required(),
}).options({ convert: false });

module.exports = schemas;
