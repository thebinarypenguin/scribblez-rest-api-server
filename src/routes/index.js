'use strict';

const fs   = require('fs');
const path = require('path');

const after = function (server, next) {

  fs.readdir(__dirname, (err, files) => {
    
    if (err) { throw err; }

    files.forEach((filename) => {

      if (filename === 'index.js') {
        return;
      }

      require(path.join(__dirname, filename))(server);
    });
    
    return next();
  }); 
};

const register = function (server, options, next) {

  server.dependency(['auth'], after);
  return next();
};


register.attributes = {
  name: 'routes',
};

module.exports = register;
