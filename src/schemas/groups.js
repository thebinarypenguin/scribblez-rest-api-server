'use strict';

const Joi = require('joi');

const user = require('./users.js');

const schemas = {};

schemas.groupID = Joi.number().integer();

schemas.groupName = Joi.string().min(1).max(80);

schemas.group = Joi.object().keys({
  id: Joi.number().integer().required(),
  name: Joi.string().min(1).max(80).required(),
  members: Joi.array().items(user.userRedacted).required(),
});

schemas.groupCollection = Joi.array().items(schemas.group);

schemas.groupCreatePayload = Joi.object().keys({
  name: Joi.string().min(1).max(80).required(),
  members: Joi.array().items(user.username).required(),
});

schemas.groupUpdatePayload = Joi.object().keys({
  name: Joi.string().min(1).max(80).optional(),
  members: Joi.array().items(user.username).optional(),
}).min(1);

schemas.groupReplacePayload = Joi.object().keys({
  name: Joi.string().min(1).max(80).required(),
  members: Joi.array().items(user.username).required(),
});

module.exports = schemas;
