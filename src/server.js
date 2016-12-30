'use strict';

const Hapi    = require('hapi');
const config  = require('./config');
const schemas = require('./schemas');
const pkg     = require('../package.json');

const server = new Hapi.Server();

server.connection({
  host: config.hapi.host,
  port: config.hapi.port,
});

server.register([
  schemas,
], (err) => {

  if (err) { throw err; }

  server.start((err) => {

    if (err) { throw err; }

    console.log(`${pkg.name}@${pkg.version} is running ` +
                `in ${config.environment} mode ` + 
                `at ${server.info.uri}`);
  });
});
