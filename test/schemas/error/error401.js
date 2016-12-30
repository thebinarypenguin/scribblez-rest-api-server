'use strict';

const Code    = require('code');
const Hapi    = require('hapi');
const Joi     = require('joi');
const Lab     = require('lab');
const config  = require('../../../src/config');
const schemas = require('../../../src/schemas');

const lab = exports.lab = Lab.script();

lab.experiment('error401 schema', () => {

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

  lab.experiment('statusCode', () => {

    lab.test('is required', (done) => {

      const good = {
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Go away!',
      };

      const bad = {
        error: 'Unauthorized',
        message: 'Go away!',
      };

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.error401)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.error401)).to.throw();

      done();
    });

    lab.test('must be the number 401', (done) => {

      const good = {
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Go away!',
      };

      const bad = [
        // Wrong type
        {
          statusCode: '401',
          error: 'Unauthorized',
          message: 'Go away!',
        },
        // Wrong value
        {
          statusCode: 999,
          error: 'Unauthorized',
          message: 'Go away!',
        },
      ];

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.error401)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad[0], server.plugins.schemas.error401)).to.throw();
      Code.expect(Joi.assert.bind(this, bad[1], server.plugins.schemas.error401)).to.throw();

      done();
    });
  });

  lab.experiment('error', () => {

    lab.test('is required', (done) => {

      const good = {
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Go away!',
      };

      const bad = {
        statusCode: 401,
        message: 'Go away!',
      };

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.error401)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.error401)).to.throw();

      done();
    });

    lab.test('must be the string "Unauthorized"', (done) => {
      
      const good = {
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Go away!',
      };

      const bad = [
        // Wrong type
        {
          statusCode: 401,
          error: 999,
          message: 'Go away!',
        },
        // Wrong value
        {
          statusCode: 401,
          error: 'Foobar',
          message: 'Go away!',
        },
      ];

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.error401)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad[0], server.plugins.schemas.error401)).to.throw();
      Code.expect(Joi.assert.bind(this, bad[1], server.plugins.schemas.error401)).to.throw();

      done();
    });
  });

  lab.experiment('message', () => {

    lab.test('is optional', (done) => {

      const good = [
        // With message
        {
          statusCode: 401,
          error: 'Unauthorized',
          message: 'Go away!',
        },
        // Without message
        {
          statusCode: 401,
          error: 'Unauthorized',
        },
      ];

      Code.expect(Joi.assert.bind(this, good[0], server.plugins.schemas.error401)).to.not.throw();
      Code.expect(Joi.assert.bind(this, good[1], server.plugins.schemas.error401)).to.not.throw();

      done();
    });

    lab.test('must be a string', (done) => {

      const good = {
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Go away!',
      };

      const bad = {
        statusCode: 401,
        error: 'Unauthorized',
        message: 999,
      };

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.error401)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.error401)).to.throw();

      done();
    });
  });
});
