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

lab.experiment('schemas.groupName', () => {

  let server = new Hapi.Server();
  
  lab.before(() => {

    return helpers.initializeTestServer(cfg, [schemas])
      .then((testServer) => {
        server = testServer;
      });
  });

  lab.test('must be a string', (done) => {
    
    const schema = server.plugins.schemas.groupName;

    const options = { convert: false };

    const good = 'Just John';

    const bad = 999;

    Code.expect(Joi.validate(good, schema, options).error).to.be.null();
    Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

    done();
  });

  lab.test('must be at least 1 character long', (done) => {
    
    const schema = server.plugins.schemas.groupName;

    const options = { convert: false };

    const good = 'Just John';

    const bad = '';

    Code.expect(Joi.validate(good, schema, options).error).to.be.null();
    Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

    done();
  });

  lab.test('must be at most 80 characters long', (done) => {
    
    const schema = server.plugins.schemas.groupName;

    const options = { convert: false };

    const good = 'Just John';

    const bad = 'x'.repeat(81);

    Code.expect(Joi.validate(good, schema, options).error).to.be.null();
    Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

    done();
  });
});
