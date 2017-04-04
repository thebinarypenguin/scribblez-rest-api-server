'use strict';

const Joi = require('joi');

const user  = require('./users.js');
const group = require('./groups.js');

const schemas = {};

const DATE_STRING = /^\d{4}\-\d{2}\-\d{2}\T\d{2}\:\d{2}\:\d{2}Z$/;

schemas.noteID = Joi.number().integer();

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
  created_at: Joi.string().regex(DATE_STRING).required(),
  updated_at: Joi.string().regex(DATE_STRING).required(),
});

schemas.noteRedacted = Joi.object().keys({
  id: Joi.number().integer().required(),
  body: Joi.string().min(1).max(10000).required(),
  owner: user.userRedacted.required(),
  visibility: Joi.any().forbidden(),
  created_at: Joi.string().regex(DATE_STRING).required(),
  updated_at: Joi.string().regex(DATE_STRING).required(),
});

schemas.noteCollection = Joi.array().items(schemas.note);

schemas.noteCollectionRedacted = Joi.array().items(schemas.noteRedacted);

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
});

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
}).min(1);

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
});

module.exports = schemas;
