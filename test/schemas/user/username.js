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

lab.experiment('schemas.username', () => {

  let server = new Hapi.Server();
  
  lab.before(() => {

    return helpers.initializeTestServer(cfg, [schemas])
      .then((testServer) => {
        server = testServer;
      });
  });

  lab.test('must be a string', (done) => {

    const schema = server.plugins.schemas.username;

    const options = { convert: false };

    const good = 'john_doe';

    const bad = 999;

    Code.expect(Joi.validate(good, schema, options).error).to.be.null();
    Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

    done();
  });
    
  lab.test('must match the regex /^[a-z0-9_]+$/', (done) => {

    const schema = server.plugins.schemas.username;

    const options = { convert: false };

    const good = 'john_doe';

    const bad = [
      
      // Capital
      'John_Doe',
      
      // Punctuation
      'john.doe',
      
      // Space
      'john doe',
    ];

    Code.expect(Joi.validate(good, schema, options).error).to.be.null();
    Code.expect(Joi.validate(bad[0], schema, options).error).to.be.an.error();
    Code.expect(Joi.validate(bad[1], schema, options).error).to.be.an.error();
    Code.expect(Joi.validate(bad[2], schema, options).error).to.be.an.error();

    done();
  });
    
  lab.test('must be at least 3 characters long', (done) => {

    const schema = server.plugins.schemas.username;

    const options = { convert: false };

    const good = 'john_doe';

    const bad = 'jd';

    Code.expect(Joi.validate(good, schema, options).error).to.be.null();
    Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

    done();
  });
    
  lab.test('must be at most 20 characters long', (done) => {

    const schema = server.plugins.schemas.username;

    const options = { convert: false };

    const good = 'john_doe';

    const bad = '______john__doe______';

    Code.expect(Joi.validate(good, schema, options).error).to.be.null();
    Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

    done();
  });
});
