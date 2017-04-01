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

lab.experiment('schemas.error404', () => {

  let server = null;
  
  lab.before(() => {

    return helpers.initializeTestServer(cfg, [schemas])
      .then((testServer) => {
        server = testServer;
      });
  });

  lab.experiment('statusCode', () => {

    lab.test('is required', (done) => {

      const schema = server.plugins.schemas.error404;

      const options = { convert: false };

      const good = {
        statusCode: 404,
        error: 'Not Found',
        message: 'There is no spoon.',
      };

      const bad = {
        error: 'Not Found',
        message: 'There is no spoon.',
      };

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });

    lab.test('must be the number 404', (done) => {

      const schema = server.plugins.schemas.error404;

      const options = { convert: false };

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

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad[0], schema, options).error).to.be.an.error();
      Code.expect(Joi.validate(bad[1], schema, options).error).to.be.an.error();

      done();
    });
  });

  lab.experiment('error', () => {

    lab.test('is required', (done) => {

      const schema = server.plugins.schemas.error404;

      const options = { convert: false };

      const good = {
        statusCode: 404,
        error: 'Not Found',
        message: 'There is no spoon.',
      };

      const bad = {
        statusCode: 404,
        message: 'There is no spoon.',
      };

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });

    lab.test('must be the string "Not Found"', (done) => {

      const schema = server.plugins.schemas.error404;

      const options = { convert: false };
      
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

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad[0], schema, options).error).to.be.an.error();
      Code.expect(Joi.validate(bad[1], schema, options).error).to.be.an.error();

      done();
    });
  });

  lab.experiment('message', () => {

    lab.test('is optional', (done) => {

      const schema = server.plugins.schemas.error404;

      const options = { convert: false };

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

      Code.expect(Joi.validate(good[0], schema, options).error).to.be.null();
      Code.expect(Joi.validate(good[1], schema, options).error).to.be.null();

      done();
    });

    lab.test('must be a string', (done) => {

      const schema = server.plugins.schemas.error404;

      const options = { convert: false };

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

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });
  });
});
