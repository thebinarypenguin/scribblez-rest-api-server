'use strict';

const Code    = require('code');
const Hapi    = require('hapi');
const Joi     = require('joi');
const Lab     = require('lab');
const config  = require('../../../src/config');
const schemas = require('../../../src/schemas');

const lab = exports.lab = Lab.script();

lab.experiment('schemas.error500', () => {

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
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Oh crap!',
      };

      const bad = {
        error: 'Internal Server Error',
        message: 'Oh crap!',
      };

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.error500)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.error500)).to.throw();

      done();
    });

    lab.test('must be the number 500', (done) => {

      const good = {
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Oh crap!',
      };

      const bad = [
        // Wrong type
        {
          statusCode: '500',
          error: 'Internal Server Error',
          message: 'Oh crap!',
        },
        // Wrong value
        {
          statusCode: 999,
          error: 'Internal Server Error',
          message: 'Oh crap!',
        },
      ];

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.error500)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad[0], server.plugins.schemas.error500)).to.throw();
      Code.expect(Joi.assert.bind(this, bad[1], server.plugins.schemas.error500)).to.throw();

      done();
    });
  });

  lab.experiment('error', () => {

    lab.test('is required', (done) => {

      const good = {
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Oh crap!',
      };

      const bad = {
        statusCode: 500,
        message: 'Oh crap!',
      };

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.error500)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.error500)).to.throw();

      done();
    });

    lab.test('must be the string "Internal Server Error"', (done) => {
      
      const good = {
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Oh crap!',
      };

      const bad = [
        // Wrong type
        {
          statusCode: 500,
          error: 999,
          message: 'Oh crap!',
        },
        // Wrong value
        {
          statusCode: 500,
          error: 'Foobar',
          message: 'Oh crap!',
        },
      ];

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.error500)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad[0], server.plugins.schemas.error500)).to.throw();
      Code.expect(Joi.assert.bind(this, bad[1], server.plugins.schemas.error500)).to.throw();

      done();
    });
  });

  lab.experiment('message', () => {

    lab.test('is optional', (done) => {

      const good = [
        // With message
        {
          statusCode: 500,
          error: 'Internal Server Error',
          message: 'Oh crap!',
        },
        // Without message
        {
          statusCode: 500,
          error: 'Internal Server Error',
        },
      ];

      Code.expect(Joi.assert.bind(this, good[0], server.plugins.schemas.error500)).to.not.throw();
      Code.expect(Joi.assert.bind(this, good[1], server.plugins.schemas.error500)).to.not.throw();

      done();
    });

    lab.test('must be a string', (done) => {

      const good = {
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Oh crap!',
      };

      const bad = {
        statusCode: 500,
        error: 'Internal Server Error',
        message: 999,
      };

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.error500)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.error500)).to.throw();

      done();
    });
  });
});
