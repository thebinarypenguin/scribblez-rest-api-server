'use strict';

const path = require('path');

const pub = {};

pub.load = function (environment) {

  const env = environment || 'development';

  return require(path.join(__dirname, `${env}.js`));
};

module.exports = pub;
