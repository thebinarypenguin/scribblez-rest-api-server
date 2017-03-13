'use strict';

const Code    = require('code');
const Hapi    = require('hapi');
const Joi     = require('joi');
const Lab     = require('lab');
const config  = require('../../../src/config');
const schemas = require('../../../src/schemas');

const lab = exports.lab = Lab.script();

lab.experiment('schemas.noteUpdatePayload', () => {

  const server = new Hapi.Server();
  
  lab.before((done) => {

    server.connection({
      host: config.hapi.host,
      port: config.hapi.port,
    });

    server.register([
      schemas,
    ], (err) => {

      if (err) { throw err; }

      server.initialize((err) => {

        if (err) { throw err; }

        done();
      });
    });
  });

  lab.test('must have at least one property', (done) => {

    const schema = server.plugins.schemas.noteUpdatePayload;

    const options = { convert: false };

    const good = {
      body: 'A note',
    };

    const bad = {};

    Code.expect(Joi.validate(good, schema, options).error).to.be.null();
    Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

    done();
  });

  lab.experiment('body', () => {

    lab.test('is optional', (done) => {

      const schema = server.plugins.schemas.noteUpdatePayload;

      const options = { convert: false };

      const good = [
        // Present
        {
          body: 'A note',
          visibility: 'public',
        },
        // Absent
        {
          visibility: 'public',
        },
      ];
        
      Code.expect(Joi.validate(good[0], schema, options).error).to.be.null();
      Code.expect(Joi.validate(good[1], schema, options).error).to.be.null();

      done();
    });

    lab.test('must be a string', (done) => {

      const schema = server.plugins.schemas.noteUpdatePayload;

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

      const schema = server.plugins.schemas.noteUpdatePayload;

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

      const schema = server.plugins.schemas.noteUpdatePayload;

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

    lab.test('is optional', (done) => {

      const schema = server.plugins.schemas.noteUpdatePayload;

      const options = { convert: false };

      const good = [
        // Present
        {
          body: 'A note',
          visibility: 'public',
        },
        // Absent
        {
          body: 'A note',
        },
      ];
        
      Code.expect(Joi.validate(good[0], schema, options).error).to.be.null();
      Code.expect(Joi.validate(good[1], schema, options).error).to.be.null();

      done();
    });

    lab.test('may be the string "public"', (done) => {

      const schema = server.plugins.schemas.noteUpdatePayload;

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

      const schema = server.plugins.schemas.noteUpdatePayload;

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

      const schema = server.plugins.schemas.noteUpdatePayload;

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
