'use strict';

const Code    = require('code');
const Hapi    = require('hapi');
const Joi     = require('joi');
const Lab     = require('lab');
const helpers = require('../../_helpers');
const config  = require('../../../src/config');
const schemas = require('../../../src/schemas');

const lab = exports.lab = Lab.script();

lab.experiment('schemas.error400', () => {

  let server = new Hapi.Server();
  
  lab.before(() => {

    return helpers.initializeTestServer(config, [schemas])
      .then((testServer) => {
        server = testServer;
      });
  });

  lab.experiment('statusCode', () => {

    lab.test('is required', (done) => {

      const schema = server.plugins.schemas.error400;

      const options = { convert: false };

      const good = {
        statusCode: 400,
        error: 'Bad Request',
        message: 'Your request is bad and you should feel bad.',
      };

      const bad = {
        error: 'Bad Request',
        message: 'Your request is bad and you should feel bad.',
      };

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });

    lab.test('must be the number 400', (done) => {

      const schema = server.plugins.schemas.error400;

      const options = { convert: false };

      const good = {
        statusCode: 400,
        error: 'Bad Request',
        message: 'Your request is bad and you should feel bad.',
      };

      const bad = [
        // Wrong type
        {
          statusCode: '400',
          error: 'Bad Request',
          message: 'Your request is bad and you should feel bad.',
        },
        // Wrong value
        {
          statusCode: 999,
          error: 'Bad Request',
          message: 'Your request is bad and you should feel bad.',
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

      const schema = server.plugins.schemas.error400;

      const options = { convert: false };

      const good = {
        statusCode: 400,
        error: 'Bad Request',
        message: 'Your request is bad and you should feel bad.',
      };

      const bad = {
        statusCode: 400,
        message: 'Your request is bad and you should feel bad.',
      };

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });

    lab.test('must be the string "Bad Request"', (done) => {

      const schema = server.plugins.schemas.error400;

      const options = { convert: false };
      
      const good = {
        statusCode: 400,
        error: 'Bad Request',
        message: 'Your request is bad and you should feel bad.',
      };

      const bad = [
        // Wrong type
        {
          statusCode: 400,
          error: 999,
          message: 'Your request is bad and you should feel bad.',
        },
        // Wrong value
        {
          statusCode: 400,
          error: 'Foobar',
          message: 'Your request is bad and you should feel bad.',
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

      const schema = server.plugins.schemas.error400;

      const options = { convert: false };

      const good = [
        // With message
        {
          statusCode: 400,
          error: 'Bad Request',
          message: 'Your request is bad and you should feel bad.',
        },
        // Without message
        {
          statusCode: 400,
          error: 'Bad Request',
        },
      ];

      Code.expect(Joi.validate(good[0], schema, options).error).to.be.null();
      Code.expect(Joi.validate(good[1], schema, options).error).to.be.null();

      done();
    });

    lab.test('must be a string', (done) => {

      const schema = server.plugins.schemas.error400;

      const options = { convert: false };

      const good = {
        statusCode: 400,
        error: 'Bad Request',
        message: 'Your request is bad and you should feel bad.',
      };

      const bad = {
        statusCode: 400,
        error: 'Bad Request',
        message: 999,
      };

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });
  });
});
