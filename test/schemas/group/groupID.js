'use strict';

const Code    = require('code');
const Hapi    = require('hapi');
const Joi     = require('joi');
const Lab     = require('lab');
const config  = require('../../../src/config');
const schemas = require('../../../src/schemas');

const lab = exports.lab = Lab.script();

lab.experiment('groupID schema', () => {

  const server = new Hapi.Server();
  
  lab.before((done) => {

    server.connection({
      host: config.hapi.host,
      port: config.hapi.port,
    });

    server.register([
      schemas,
    ], (err) => {

      if (err) { throw err; }

      server.initialize((err) => {

        if (err) { throw err; }

        done();
      });
    });
  });

  lab.test('must be an integer', (done) => {

    const good = 42;

    const bad = '42';

    Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.groupID)).to.not.throw();
    Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.groupID)).to.throw();

    done();
  });
});
