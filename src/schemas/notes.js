'use strict';

const Joi = require('joi');

const user  = require('./users.js');
const group = require('./groups.js');

const schemas = {};

schemas.noteID = Joi.number().integer().options({ convert: false });

schemas.note = Joi.object().keys({
  id: Joi.number().integer().required(),
  body: Joi.string().min(1).max(10000).required(),
  owner: user.userRedacted.required(),
  visibility: Joi.alternatives().try(
    Joi.string().equal('public'),
    Joi.string().equal('private'),
    Joi.object().keys({
      users: user.userCollectionRedacted.required(),
      groups: group.groupCollection.required(),
    })
  ).required(),
}).options({ convert: false });

schemas.noteRedacted = Joi.object().keys({
  id: Joi.number().integer().required(),
  body: Joi.string().min(1).max(10000).required(),
  owner: user.userRedacted.required(),
  visibility: Joi.any().forbidden(),
}).options({ convert: false });

schemas.noteCollection = Joi.array().items(schemas.note).options({ convert: false });

schemas.noteCollectionRedacted = Joi.array().items(schemas.noteRedacted).options({ convert: false });

schemas.noteCreatePayload = Joi.object().keys({
  body: Joi.string().min(1).max(10000).required(),
  visibility: Joi.alternatives().try(
    Joi.string().equal('public'),
    Joi.string().equal('private'),
    Joi.object().keys({
      users: Joi.array().items(user.username).required(),
      groups: Joi.array().items(group.groupName).required(),
    })
  ).required(),
}).options({ convert: false });

schemas.noteUpdatePayload = Joi.object().keys({
  body: Joi.string().min(1).max(10000).optional(),
  visibility: Joi.alternatives().try(
    Joi.string().equal('public'),
    Joi.string().equal('private'),
    Joi.object().keys({
      users: Joi.array().items(user.username).required(),
      groups: Joi.array().items(group.groupName).required(),
    })
  ).optional(),
}).min(1).options({ convert: false });

schemas.noteReplacePayload = Joi.object().keys({
  body: Joi.string().min(1).max(10000).required(),
  visibility: Joi.alternatives().try(
    Joi.string().equal('public'),
    Joi.string().equal('private'),
    Joi.object().keys({
      users: Joi.array().items(user.username).required(),
      groups: Joi.array().items(group.groupName).required(),
    })
  ).required(),
}).options({ convert: false });

module.exports = schemas;
