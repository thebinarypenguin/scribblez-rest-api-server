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

lab.experiment('schemas.groupOptions', () => {

  let server = null;
  
  lab.before(() => {

    return helpers.initializeTestServer(cfg, [schemas])
      .then((testServer) => {
        server = testServer;
      });
  });

  lab.experiment('page', () => {

    lab.test('is optional', (done) => {

      const schema = server.plugins.schemas.groupOptions;

      const options = { convert: false };

      const good = [
        {
          page: 1,
        },
        {
        },
      ];

      Code.expect(Joi.validate(good[0], schema, options).error).to.be.null();
      Code.expect(Joi.validate(good[1], schema, options).error).to.be.null();

      done();
    });

    lab.test('must be an integer', (done) => {

      const schema = server.plugins.schemas.groupOptions;

      const options = { convert: false };

      const good = {
        page: 2,
      };

      const bad = {
        page: '2',
      };

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });

    lab.test('must be positive', (done) => {

      const schema = server.plugins.schemas.groupOptions;

      const options = { convert: false };

      const good = {
        page: 3,
      };

      const bad = {
        page: -3,
      };

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });

    lab.test('has a default of 1', (done) => {

      const schema = server.plugins.schemas.groupOptions;

      const options = { convert: false };

      const missing = {};

      Code.expect(Joi.validate(missing, schema, options).error).to.be.null();
      Code.expect(Joi.validate(missing, schema, options).value.page).to.equal(1);

      done();
    });
  });

  lab.experiment('per_page', () => {

    lab.test('is optional', (done) => {

      const schema = server.plugins.schemas.groupOptions;

      const options = { convert: false };

      const good = [
        {
          per_page: 10,
        },
        {
        },
      ];

      Code.expect(Joi.validate(good[0], schema, options).error).to.be.null();
      Code.expect(Joi.validate(good[1], schema, options).error).to.be.null();

      done();
    });

    lab.test('must be an integer', (done) => {

      const schema = server.plugins.schemas.groupOptions;

      const options = { convert: false };

      const good = {
        per_page: 10,
      };

      const bad = {
        per_page: '10',
      };

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });

    lab.test('must be positive', (done) => {

      const schema = server.plugins.schemas.groupOptions;

      const options = { convert: false };

      const good = {
        per_page: 10,
      };

      const bad = {
        per_page: -10,
      };

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });

    lab.test('has a default of 20', (done) => {

      const schema = server.plugins.schemas.groupOptions;

      const options = { convert: false };

      const missing = {};

      Code.expect(Joi.validate(missing, schema, options).error).to.be.null();
      Code.expect(Joi.validate(missing, schema, options).value.per_page).to.equal(20);

      done();
    });
  });
});
