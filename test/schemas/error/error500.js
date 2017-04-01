'use strict';

const Code    = require('code');
const Hapi    = require('hapi');
const Joi     = require('joi');
const Lab     = require('lab');
const helpers = require('../../_helpers');
const config  = require('../../../src/config');
const schemas = require('../../../src/schemas');

const cfg = config.load('test');

const lab = exports.lab = Lab.script();

lab.experiment('schemas.error500', () => {

  let server = null;
  
  lab.before(() => {

    return helpers.initializeTestServer(cfg, [schemas])
      .then((testServer) => {
        server = testServer;
      });
  });

  lab.experiment('statusCode', () => {

    lab.test('is required', (done) => {

      const schema = server.plugins.schemas.error500;

      const options = { convert: false };

      const good = {
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Oh crap!',
      };

      const bad = {
        error: 'Internal Server Error',
        message: 'Oh crap!',
      };

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });

    lab.test('must be the number 500', (done) => {

      const schema = server.plugins.schemas.error500;

      const options = { convert: false };

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

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad[0], schema, options).error).to.be.an.error();
      Code.expect(Joi.validate(bad[1], schema, options).error).to.be.an.error();

      done();
    });
  });

  lab.experiment('error', () => {

    lab.test('is required', (done) => {

      const schema = server.plugins.schemas.error500;

      const options = { convert: false };

      const good = {
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Oh crap!',
      };

      const bad = {
        statusCode: 500,
        message: 'Oh crap!',
      };

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });

    lab.test('must be the string "Internal Server Error"', (done) => {

      const schema = server.plugins.schemas.error500;

      const options = { convert: false };
      
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

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad[0], schema, options).error).to.be.an.error();
      Code.expect(Joi.validate(bad[1], schema, options).error).to.be.an.error();

      done();
    });
  });

  lab.experiment('message', () => {

    lab.test('is optional', (done) => {

      const schema = server.plugins.schemas.error500;

      const options = { convert: false };

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

      Code.expect(Joi.validate(good[0], schema, options).error).to.be.null();
      Code.expect(Joi.validate(good[1], schema, options).error).to.be.null();

      done();
    });

    lab.test('must be a string', (done) => {

      const schema = server.plugins.schemas.error500;

      const options = { convert: false };

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

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });
  });
});
