'use strict';

const Code    = require('code');
const Hapi    = require('hapi');
const Joi     = require('joi');
const Lab     = require('lab');
const config  = require('../../../src/config');
const schemas = require('../../../src/schemas');

const lab = exports.lab = Lab.script();

lab.experiment('userReplacePayload schema', () => {

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

  lab.experiment('real_name', () => {

    lab.test('is required', (done) => {

      const good = {
        real_name: 'John Doe',
        email_address: 'jdoe@example.com',
        password: 'password',
        password_confirmation: 'password',
      };

      const bad = {
        email_address: 'jdoe@example.com',
        password: 'password',
        password_confirmation: 'password',
      };

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.userReplacePayload)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.userReplacePayload)).to.throw();

      done();
    });
    
    lab.test('must be a string', (done) => {

      const good = {
        real_name: 'John Doe',
        email_address: 'jdoe@example.com',
        password: 'password',
        password_confirmation: 'password',
      };

      const bad = {
        real_name: 999,
        email_address: 'jdoe@example.com',
        password: 'password',
        password_confirmation: 'password',
      };

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.userReplacePayload)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.userReplacePayload)).to.throw();

      done();
    });
    
    lab.test('must be at least 1 character long', (done) => {

      const good = {
        real_name: 'John Doe',
        email_address: 'jdoe@example.com',
        password: 'password',
        password_confirmation: 'password',
      };

      const bad = {
        real_name: '',
        email_address: 'jdoe@example.com',
        password: 'password',
        password_confirmation: 'password',
      };

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.userReplacePayload)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.userReplacePayload)).to.throw();

      done();
    });
    
    lab.test('must be at most 80 characters long', (done) => {

      const good = {
        real_name: 'John Doe',
        email_address: 'jdoe@example.com',
        password: 'password',
        password_confirmation: 'password',
      };

      const bad = {
        real_name: 'x'.repeat(81),
        email_address: 'jdoe@example.com',
        password: 'password',
        password_confirmation: 'password',
      };

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.userReplacePayload)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.userReplacePayload)).to.throw();

      done();
    });
  });

  lab.experiment('email_address', () => {

    lab.test('is required', (done) => {

      const good = {
        real_name: 'John Doe',
        email_address: 'jdoe@example.com',
        password: 'password',
        password_confirmation: 'password',
      };

      const bad = {
        real_name: 'John Doe',
        password: 'password',
        password_confirmation: 'password',
      };

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.userReplacePayload)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.userReplacePayload)).to.throw();

      done();
    });
    
    lab.test('must be a string', (done) => {

      const good = {
        real_name: 'John Doe',
        email_address: 'jdoe@example.com',
        password: 'password',
        password_confirmation: 'password',
      };

      const bad = {
        real_name: 'John Doe',
        email_address: 999,
        password: 'password',
        password_confirmation: 'password',
      };

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.userReplacePayload)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.userReplacePayload)).to.throw();

      done();
    });
    
    lab.test('must be formatted like an email address', (done) => {

      const good = {
        real_name: 'John Doe',
        email_address: 'jdoe@example.com',
        password: 'password',
        password_confirmation: 'password',
      };

      const bad = {
        real_name: 'John Doe',
        email_address: 'I am not an email address',
        password: 'password',
        password_confirmation: 'password',
      };

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.userReplacePayload)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.userReplacePayload)).to.throw();

      done();
    });
    
    lab.test('must be at least 1 character long', (done) => {

      const good = {
        real_name: 'John Doe',
        email_address: 'jdoe@example.com',
        password: 'password',
        password_confirmation: 'password',
      };

      const bad = {
        real_name: 'John Doe',
        email_address: '',
        password: 'password',
        password_confirmation: 'password',
      };

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.userReplacePayload)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.userReplacePayload)).to.throw();

      done();
    });
    
    lab.test('must be at most 80 characters long', (done) => {

      const good = {
        real_name: 'John Doe',
        email_address: 'jdoe@example.com',
        password: 'password',
        password_confirmation: 'password',
      };

      const bad = {
        real_name: 'John Doe',
        email_address: 'x'.repeat(81),
        password: 'password',
        password_confirmation: 'password',
      };

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.userReplacePayload)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.userReplacePayload)).to.throw();

      done();
    });
  });

  lab.experiment('password', () => {

    lab.test('is required', (done) => {

      const good = {
        real_name: 'John Doe',
        email_address: 'jdoe@example.com',
        password: 'password',
        password_confirmation: 'password',
      };

      const bad = {
        real_name: 'John Doe',
        email_address: 'jdoe@example.com',
        password_confirmation: 'password',
      };

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.userReplacePayload)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.userReplacePayload)).to.throw();

      done();
    });

    lab.test('must be a string', (done) => {

      const good = {
        real_name: 'John Doe',
        email_address: 'jdoe@example.com',
        password: 'password',
        password_confirmation: 'password',
      };

      const bad = {
        real_name: 'John Doe',
        email_address: 'jdoe@example.com',
        password: 999,
        password_confirmation: 'password',
      };

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.userReplacePayload)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.userReplacePayload)).to.throw();

      done();
    });

    lab.test('must be at least 8 characters long', (done) => {

      const good = {
        real_name: 'John Doe',
        email_address: 'jdoe@example.com',
        password: 'password',
        password_confirmation: 'password',
      };

      const bad = {
        real_name: 'John Doe',
        email_address: 'jdoe@example.com',
        password: 'pass',
        password_confirmation: 'password',
      };

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.userReplacePayload)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.userReplacePayload)).to.throw();

      done();
    });

    lab.test('must be at most 80 characters long', (done) => {

      const good = {
        real_name: 'John Doe',
        email_address: 'jdoe@example.com',
        password: 'password',
        password_confirmation: 'password',
      };

      const bad = {
        real_name: 'John Doe',
        email_address: 'jdoe@example.com',
        password: 'x'.repeat(81),
        password_confirmation: 'password',
      };

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.userReplacePayload)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.userReplacePayload)).to.throw();

      done();
    });
  });

  lab.experiment('password_confirmation', () => {

    lab.test('is required', (done) => {

      const good = {
        real_name: 'John Doe',
        email_address: 'jdoe@example.com',
        password: 'password',
        password_confirmation: 'password',
      };

      const bad = {
        real_name: 'John Doe',
        email_address: 'jdoe@example.com',
        password: 'password',
      };

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.userReplacePayload)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.userReplacePayload)).to.throw();

      done();
    });

    lab.test('must be a string', (done) => {

      const good = {
        real_name: 'John Doe',
        email_address: 'jdoe@example.com',
        password: 'password',
        password_confirmation: 'password',
      };

      const bad = {
        real_name: 'John Doe',
        email_address: 'jdoe@example.com',
        password: 'password',
        password_confirmation: 999,
      };

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.userReplacePayload)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.userReplacePayload)).to.throw();

      done();
    });

    lab.test('must match password', (done) => {

      const good = {
        real_name: 'John Doe',
        email_address: 'jdoe@example.com',
        password: 'password',
        password_confirmation: 'password',
      };

      const bad = {
        real_name: 'John Doe',
        email_address: 'jdoe@example.com',
        password: 'password',
        password_confirmation: 'pass',
      };

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.userReplacePayload)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.userReplacePayload)).to.throw();

      done();
    });
  });
});