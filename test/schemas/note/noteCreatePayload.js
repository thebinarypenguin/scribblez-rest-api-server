'use strict';

const Code    = require('code');
const Hapi    = require('hapi');
const Joi     = require('joi');
const Lab     = require('lab');
const config  = require('../../../src/config');
const schemas = require('../../../src/schemas');

const lab = exports.lab = Lab.script();

lab.experiment('schemas.noteCreatePayload', () => {

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

  lab.experiment('body', () => {

    lab.test('is required', (done) => {

      const good = {
        body: 'A note',
        visibility: 'public',
      };

      const bad = {
        visibility: 'public',
      };

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.noteCreatePayload)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.noteCreatePayload)).to.throw();

      done();
    });

    lab.test('must be a string', (done) => {

      const good = {
        body: 'A note',
        visibility: 'public',
      };

      const bad = {
        body: 999,
        visibility: 'public',
      };

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.noteCreatePayload)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.noteCreatePayload)).to.throw();

      done();
    });
    
    lab.test('must be at least 1 character long', (done) => {

      const good = {
        body: 'A note',
        visibility: 'public',
      };

      const bad = {
        body: '',
        visibility: 'public',
      };

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.noteCreatePayload)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.noteCreatePayload)).to.throw();

      done();
    });
    
    lab.test('must be at most 10,000 characters long', (done) => {

      const good = {
        body: 'A note',
        visibility: 'public',
      };

      const bad = {
        body: 'x'.repeat(10001),
        visibility: 'public',
      };

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.noteCreatePayload)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.noteCreatePayload)).to.throw();

      done();
    });
  });

  lab.experiment('visibility', () => {

    lab.test('is required', (done) => {

      const good = {
        body: 'A note',
        visibility: 'public',
      };

      const bad = {
        body: 'A note',
      };

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.noteCreatePayload)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.noteCreatePayload)).to.throw();

      done();
    });

    lab.test('may be the string "public"', (done) => {

      const good = {
        body: 'A note',
        visibility: 'public',
      };

      const bad = {
        body: 'A note',
        visibility: 'foobar',
      };

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.noteCreatePayload)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.noteCreatePayload)).to.throw();

      done();
    });

    lab.test('may be the string "private"', (done) => {

      const good = {
        body: 'A note',
        visibility: 'private',
      };

      const bad = {
        body: 'A note',
        visibility: 'foobar',
      };

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.noteCreatePayload)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.noteCreatePayload)).to.throw();

      done();
    });

    lab.test('may be a "shared with" object', (done) => {

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

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.noteCreatePayload)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.noteCreatePayload)).to.throw();

      done();
    });
  });
});
