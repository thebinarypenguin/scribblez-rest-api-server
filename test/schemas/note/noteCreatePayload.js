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

lab.experiment('schemas.noteCreatePayload', () => {

  let server = null;
  
  lab.before(() => {

    return helpers.initializeTestServer(cfg, [schemas])
      .then((testServer) => {
        server = testServer;
      });
  });

  lab.experiment('body', () => {

    lab.test('is required', (done) => {
      
      const schema = server.plugins.schemas.noteCreatePayload;

      const options = { convert: false };

      const good = {
        body: 'A note',
        visibility: 'public',
      };

      const bad = {
        visibility: 'public',
      };

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });

    lab.test('must be a string', (done) => {
      
      const schema = server.plugins.schemas.noteCreatePayload;

      const options = { convert: false };

      const good = {
        body: 'A note',
        visibility: 'public',
      };

      const bad = {
        body: 999,
        visibility: 'public',
      };

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });
    
    lab.test('must be at least 1 character long', (done) => {
      
      const schema = server.plugins.schemas.noteCreatePayload;

      const options = { convert: false };

      const good = {
        body: 'A note',
        visibility: 'public',
      };

      const bad = {
        body: '',
        visibility: 'public',
      };

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });
    
    lab.test('must be at most 10,000 characters long', (done) => {
      
      const schema = server.plugins.schemas.noteCreatePayload;

      const options = { convert: false };

      const good = {
        body: 'A note',
        visibility: 'public',
      };

      const bad = {
        body: 'x'.repeat(10001),
        visibility: 'public',
      };

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });
  });

  lab.experiment('visibility', () => {

    lab.test('is required', (done) => {
      
      const schema = server.plugins.schemas.noteCreatePayload;

      const options = { convert: false };

      const good = {
        body: 'A note',
        visibility: 'public',
      };

      const bad = {
        body: 'A note',
      };

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });

    lab.test('may be the string "public"', (done) => {
      
      const schema = server.plugins.schemas.noteCreatePayload;

      const options = { convert: false };

      const good = {
        body: 'A note',
        visibility: 'public',
      };

      const bad = {
        body: 'A note',
        visibility: 'foobar',
      };

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });

    lab.test('may be the string "private"', (done) => {
      
      const schema = server.plugins.schemas.noteCreatePayload;

      const options = { convert: false };

      const good = {
        body: 'A note',
        visibility: 'private',
      };

      const bad = {
        body: 'A note',
        visibility: 'foobar',
      };

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });

    lab.test('may be a "shared with" object', (done) => {
      
      const schema = server.plugins.schemas.noteCreatePayload;

      const options = { convert: false };

      const good = {
        body: 'A note',
        visibility: {
          users: [ 'john_doe' ],
          groups: [ 'Friends' ],
        },
      };

      const bad = {
        body: 'A note',
        visibility: {},
      };

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });
  });
});
