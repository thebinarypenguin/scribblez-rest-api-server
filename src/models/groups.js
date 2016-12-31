'use strict';

const engage = function (server, knex) {

  const pub = {};
  
  pub.findAll = function(currentUser) {};

  pub.findByID = function(id, currentUser) {};

  pub.create = function(payload, currentUser) {};

  pub.update = function(id, payload, currentUser) {};

  pub.replace = function(id, payload, currentUser) {};

  pub.destroy = function(id, currentUser) {};

  return pub;
};

module.exports = engage;
