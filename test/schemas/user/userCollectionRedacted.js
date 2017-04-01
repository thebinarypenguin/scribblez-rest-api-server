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

lab.experiment('schemas.userCollectionRedacted', () => {

  let server = null;
  
  lab.before(() => {

    return helpers.initializeTestServer(cfg, [schemas])
      .then((testServer) => {
        server = testServer;
      });
  });

  lab.test('must be an array', (done) => {
  
    const schema = server.plugins.schemas.userCollectionRedacted;

    const options = { convert: false };

    const good = [
      {
        username: 'john_doe',
        real_name: 'John Doe',
      },
    ];

    const bad = {};

    Code.expect(Joi.validate(good, schema, options).error).to.be.null();
    Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

    done();
  });

  lab.test('items must match the userRedacted schema', (done) => {
  
    const schema = server.plugins.schemas.userCollectionRedacted;

    const options = { convert: false };

    const good = [
      {
        username: 'john_doe',
        real_name: 'John Doe',
      },
    ];

    const bad = [
      {
        username: 'john_doe',
        real_name: 'John Doe',
        email_address: 'jdoe@example.com',
      },
    ];

    Code.expect(Joi.validate(good, schema, options).error).to.be.null();
    Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

    done();
  });
});
