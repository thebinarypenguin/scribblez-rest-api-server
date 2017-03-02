'use strict';

const Code    = require('code');
const Hapi    = require('hapi');
const Joi     = require('joi');
const Lab     = require('lab');
const config  = require('../../../src/config');
const schemas = require('../../../src/schemas');

const lab = exports.lab = Lab.script();

lab.experiment('schemas.groupCreatePayload', () => {

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

  lab.experiment('name', () => {

    lab.test('is required', (done) => {

      const good = {
        name: 'Just John',
        members: [ 'john_doe' ],
      };

      const bad = {
        members: [ 'john_doe' ],
      };

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.groupCreatePayload)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.groupCreatePayload)).to.throw();

      done();
    });

    lab.test('must be a string', (done) => {

      const good = {
        name: 'Just John',
        members: [ 'john_doe' ],
      };

      const bad = {
        name: 999,
        members: [ 'john_doe' ],
      };

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.groupCreatePayload)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.groupCreatePayload)).to.throw();

      done();
    });

    lab.test('must be at least 1 character long', (done) => {

      const good = {
        name: 'Just John',
        members: [ 'john_doe' ],
      };

      const bad = {
        name: '',
        members: [ 'john_doe' ],
      };

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.groupCreatePayload)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.groupCreatePayload)).to.throw();

      done();
    });

    lab.test('must be at most 80 characters long', (done) => {

      const good = {
        name: 'Just John',
        members: [ 'john_doe' ],
      };

      const bad = {
        name: 'x'.repeat(81),
        members: [ 'john_doe' ],
      };

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.groupCreatePayload)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.groupCreatePayload)).to.throw();

      done();
    });
  });

  lab.experiment('members', () => {

    lab.test('is required', (done) => {

      const good = {
        name: 'Just John',
        members: [ 'john_doe' ],
      };

      const bad = {
        name: 'Just John',
      };

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.groupCreatePayload)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.groupCreatePayload)).to.throw();

      done();
    });

    lab.test('must be an array', (done) => {

      const good = {
        name: 'Just John',
        members: [ 'john_doe' ],
      };

      const bad = {
        name: 'Just John',
        members: {},
      };

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.groupCreatePayload)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.groupCreatePayload)).to.throw();

      done();
    });

    lab.test('items must match the username schema', (done) => {

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

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.groupCreatePayload)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.groupCreatePayload)).to.throw();

      done();
    });
  });
});
