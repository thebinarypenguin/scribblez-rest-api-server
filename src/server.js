'use strict';

const Hapi      = require('hapi');
const AuthBasic = require('hapi-auth-basic');
const config    = require('./config');
const auth      = require('./auth');
const models    = require('./models');
const routes    = require('./routes');
const schemas   = require('./schemas');
const pkg       = require('../package.json');

const cfg = config.load(process.env.NODE_ENV);

const server = new Hapi.Server();

server.connection({
  host: cfg.hapi.host,
  port: cfg.hapi.port,
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
                `in ${cfg.environment} mode ` + 
                `at ${server.info.uri}`);
  });
});
