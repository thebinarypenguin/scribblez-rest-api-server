'use strict';

const fs   = require('fs');
const path = require('path');

const register = function (server, options, next) {

  const allSchemas = {};

  fs.readdir(__dirname, (err, files) => {
    
    if (err) { throw err; }

    files.forEach((filename) => {

      if (filename === 'index.js') {
        return;
      }

      Object.assign(allSchemas, require(path.join(__dirname, filename)));
    });

    server.plugins.schemas = allSchemas;
    
    return next();
  });
};

register.attributes = {
  name: 'schemas',
};

module.exports = register;
