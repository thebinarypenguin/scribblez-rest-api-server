'use strict';

const Code    = require('code');
const Hapi    = require('hapi');
const Joi     = require('joi');
const Lab     = require('lab');
const config  = require('../../../src/config');
const schemas = require('../../../src/schemas');

const lab = exports.lab = Lab.script();

lab.experiment('error404 schema', () => {

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
        statusCode: 404,
        error: 'Not Found',
        message: 'There is no spoon.',
      };

      const bad = {
        error: 'Not Found',
        message: 'There is no spoon.',
      };

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.error404)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.error404)).to.throw();

      done();
    });

    lab.test('must be the number 404', (done) => {

      const good = {
        statusCode: 404,
        error: 'Not Found',
        message: 'There is no spoon.',
      };

      const bad = [
        // Wrong type
        {
          statusCode: '404',
          error: 'Not Found',
          message: 'There is no spoon.',
        },
        // Wrong value
        {
          statusCode: 999,
          error: 'Not Found',
          message: 'There is no spoon.',
        },
      ];

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.error404)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad[0], server.plugins.schemas.error404)).to.throw();
      Code.expect(Joi.assert.bind(this, bad[1], server.plugins.schemas.error404)).to.throw();

      done();
    });
  });

  lab.experiment('error', () => {

    lab.test('is required', (done) => {

      const good = {
        statusCode: 404,
        error: 'Not Found',
        message: 'There is no spoon.',
      };

      const bad = {
        statusCode: 404,
        message: 'There is no spoon.',
      };

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.error404)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.error404)).to.throw();

      done();
    });

    lab.test('must be the string "Not Found"', (done) => {
      
      const good = {
        statusCode: 404,
        error: 'Not Found',
        message: 'There is no spoon.',
      };

      const bad = [
        // Wrong type
        {
          statusCode: 404,
          error: 999,
          message: 'There is no spoon.',
        },
        // Wrong value
        {
          statusCode: 404,
          error: 'Foobar',
          message: 'There is no spoon.',
        },
      ];

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.error404)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad[0], server.plugins.schemas.error404)).to.throw();
      Code.expect(Joi.assert.bind(this, bad[1], server.plugins.schemas.error404)).to.throw();

      done();
    });
  });

  lab.experiment('message', () => {

    lab.test('is optional', (done) => {

      const good = [
        // With message
        {
          statusCode: 404,
          error: 'Not Found',
          message: 'There is no spoon.',
        },
        // Without message
        {
          statusCode: 404,
          error: 'Not Found',
        },
      ];

      Code.expect(Joi.assert.bind(this, good[0], server.plugins.schemas.error404)).to.not.throw();
      Code.expect(Joi.assert.bind(this, good[1], server.plugins.schemas.error404)).to.not.throw();

      done();
    });

    lab.test('must be a string', (done) => {

      const good = {
        statusCode: 404,
        error: 'Not Found',
        message: 'There is no spoon.',
      };

      const bad = {
        statusCode: 404,
        error: 'Not Found',
        message: 999,
      };

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.error404)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.error404)).to.throw();

      done();
    });
  });
});
