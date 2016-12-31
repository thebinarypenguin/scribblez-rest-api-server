'use strict';

const engage = function (server, knex) {

  const pub = {};

  pub.findByUsername = function(username, currentUser) {};

  pub.create = function(payload) {};

  pub.update = function(username, payload, currentUser) {};

  pub.replace = function(username, payload, currentUser) {};

  pub.destroy = function(username, currentUser) {};

  pub.authenticate = function(username, password) {};

  return pub;
};

module.exports = engage;
