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

lab.experiment('schemas.error401', () => {

  let server = null;
  
  lab.before(() => {

    return helpers.initializeTestServer(cfg, [schemas])
      .then((testServer) => {
        server = testServer;
      });
  });

  lab.experiment('statusCode', () => {

    lab.test('is required', (done) => {

      const schema = server.plugins.schemas.error401;

      const options = { convert: false };

      const good = {
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Go away!',
      };

      const bad = {
        error: 'Unauthorized',
        message: 'Go away!',
      };

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });

    lab.test('must be the number 401', (done) => {

      const schema = server.plugins.schemas.error401;

      const options = { convert: false };

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

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad[0], schema, options).error).to.be.an.error();
      Code.expect(Joi.validate(bad[1], schema, options).error).to.be.an.error();

      done();
    });
  });

  lab.experiment('error', () => {

    lab.test('is required', (done) => {

      const schema = server.plugins.schemas.error401;

      const options = { convert: false };

      const good = {
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Go away!',
      };

      const bad = {
        statusCode: 401,
        message: 'Go away!',
      };

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });

    lab.test('must be the string "Unauthorized"', (done) => {

      const schema = server.plugins.schemas.error401;

      const options = { convert: false };
      
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

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad[0], schema, options).error).to.be.an.error();
      Code.expect(Joi.validate(bad[1], schema, options).error).to.be.an.error();

      done();
    });
  });

  lab.experiment('message', () => {

    lab.test('is optional', (done) => {

      const schema = server.plugins.schemas.error401;

      const options = { convert: false };

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

      Code.expect(Joi.validate(good[0], schema, options).error).to.be.null();
      Code.expect(Joi.validate(good[1], schema, options).error).to.be.null();

      done();
    });

    lab.test('must be a string', (done) => {

      const schema = server.plugins.schemas.error401;

      const options = { convert: false };

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

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });
  });

  lab.experiment('attributes', () => {

    lab.test('is optional', (done) => {

      const schema = server.plugins.schemas.error401;

      const options = { convert: false };

      const good = [
        // With attributes
        {
          statusCode: 401,
          error: 'Unauthorized',
          message: 'Go away!',
          attributes: {},
        },
        // Without attributes
        {
          statusCode: 401,
          error: 'Unauthorized',
          message: 'Go away!',
        },
      ];

      Code.expect(Joi.validate(good[0], schema, options).error).to.be.null();
      Code.expect(Joi.validate(good[1], schema, options).error).to.be.null();

      done();
    });

    lab.test('must be an object', (done) => {

      const schema = server.plugins.schemas.error401;

      const options = { convert: false };

      const good = {
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Go away!',
        attributes: {},
      };

      const bad = {
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Go away!',
        attributes: 'error',
      };

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });
  });
});
