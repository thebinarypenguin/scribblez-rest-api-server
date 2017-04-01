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

lab.experiment('schemas.groupReplacePayload', () => {

  let server = new Hapi.Server();
  
  lab.before(() => {

    return helpers.initializeTestServer(cfg, [schemas])
      .then((testServer) => {
        server = testServer;
      });
  });

  lab.experiment('name', () => {

    lab.test('is required', (done) => {
      
      const schema = server.plugins.schemas.groupReplacePayload;

      const options = { convert: false };

      const good = {
        name: 'Just John',
        members: [ 'john_doe' ],
      };

      const bad = {
        members: [ 'john_doe' ],
      };

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });

    lab.test('must be a string', (done) => {
      
      const schema = server.plugins.schemas.groupReplacePayload;

      const options = { convert: false };

      const good = {
        name: 'Just John',
        members: [ 'john_doe' ],
      };

      const bad = {
        name: 999,
        members: [ 'john_doe' ],
      };

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });

    lab.test('must be at least 1 character long', (done) => {
      
      const schema = server.plugins.schemas.groupReplacePayload;

      const options = { convert: false };

      const good = {
        name: 'Just John',
        members: [ 'john_doe' ],
      };

      const bad = {
        name: '',
        members: [ 'john_doe' ],
      };

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });

    lab.test('must be at most 80 characters long', (done) => {
      
      const schema = server.plugins.schemas.groupReplacePayload;

      const options = { convert: false };

      const good = {
        name: 'Just John',
        members: [ 'john_doe' ],
      };

      const bad = {
        name: 'x'.repeat(81),
        members: [ 'john_doe' ],
      };

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });
  });

  lab.experiment('members', () => {

    lab.test('is required', (done) => {
      
      const schema = server.plugins.schemas.groupReplacePayload;

      const options = { convert: false };

      const good = {
        name: 'Just John',
        members: [ 'john_doe' ],
      };

      const bad = {
        name: 'Just John',
      };

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });

    lab.test('must be an array', (done) => {
      
      const schema = server.plugins.schemas.groupReplacePayload;

      const options = { convert: false };

      const good = {
        name: 'Just John',
        members: [ 'john_doe' ],
      };

      const bad = {
        name: 'Just John',
        members: {},
      };

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });

    lab.test('items must match the username schema', (done) => {
      
      const schema = server.plugins.schemas.groupReplacePayload;

      const options = { convert: false };

      const good = {
        name: 'Just John',
        members: [ 'john_doe' ],
      };

      const bad = {
        name: 'Just John',
        members: [
          {
            username: 'john_doe',
            real_name: 'John Doe',
          },
        ],
      };

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });
  });
});
