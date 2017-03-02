'use strict';

const Code    = require('code');
const Hapi    = require('hapi');
const Joi     = require('joi');
const Lab     = require('lab');
const config  = require('../../../src/config');
const schemas = require('../../../src/schemas');

const lab = exports.lab = Lab.script();

lab.experiment('schemas.groupName', () => {

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

  lab.test('must be a string', (done) => {

    const good = 'Just John';

    const bad = 999;

    Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.groupName)).to.not.throw();
    Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.groupName)).to.throw();

    done();
  });

  lab.test('must be at least 1 character long', (done) => {

    const good = 'Just John';

    const bad = '';

    Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.groupName)).to.not.throw();
    Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.groupName)).to.throw();

    done();
  });

  lab.test('must be at most 80 characters long', (done) => {

    const good = 'Just John';

    const bad = 'x'.repeat(81);

    Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.groupName)).to.not.throw();
    Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.groupName)).to.throw();

    done();
  });
});
