'use strict';

const fs     = require('fs');
const path   = require('path');
const knex   = require('knex');
const config = require('../config');

const after = function (server, next) {

  const allModels    = {};
  const knexInstance = knex(config.knex);

  fs.readdir(__dirname, (err, files) => {
    
    if (err) { throw err; }

    files.forEach((filename) => {

      if (filename === 'index.js') {
        return;
      }

      const baseName = path.basename(filename, '.js');
      const fullPath = path.join(__dirname, filename);
      
      allModels[baseName] = require(fullPath)(server, knexInstance);
    });
    
    server.plugins.models = allModels;

    return next();
  });
};

const register = function (server, options, next) {

  server.dependency('schemas', after);
  return next();
};

register.attributes = {
  name: 'models',
};

module.exports = register;
