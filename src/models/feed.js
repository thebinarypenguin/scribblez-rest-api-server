'use strict';

const engage = function (server, knex) {

  const pub = {};
  
  pub.findPublic = function() {};
  
  pub.findShared = function(currentUser) {};
  
  pub.findAll = function (currentUser) {};

  pub.findByOwner = function(owner, currentUser) {};

  return pub;
};

module.exports = engage;
