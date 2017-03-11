'use strict';

const Hapi      = require('hapi');
const AuthBasic = require('hapi-auth-basic');
const config    = require('./config');
const auth      = require('./auth');
const models    = require('./models');
const routes    = require('./routes');
const schemas   = require('./schemas');
const pkg       = require('../package.json');

const server = new Hapi.Server();

server.connection({
  host: config.hapi.host,
  port: config.hapi.port,
});

server.register([
  AuthBasic,
  auth,
  models,
  routes,
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
