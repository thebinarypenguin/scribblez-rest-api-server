'use strict';

const Code    = require('code');
const Hapi    = require('hapi');
const Joi     = require('joi');
const Lab     = require('lab');
const config  = require('../../../src/config');
const schemas = require('../../../src/schemas');

const lab = exports.lab = Lab.script();

lab.experiment('schemas.userReplacePayload', () => {

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
      
      const schema = server.plugins.schemas.userReplacePayload;

      const options = { convert: false };

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

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });
    
    lab.test('must be a string', (done) => {
      
      const schema = server.plugins.schemas.userReplacePayload;

      const options = { convert: false };

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

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });
    
    lab.test('must be at least 1 character long', (done) => {
      
      const schema = server.plugins.schemas.userReplacePayload;

      const options = { convert: false };

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

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });
    
    lab.test('must be at most 80 characters long', (done) => {
      
      const schema = server.plugins.schemas.userReplacePayload;

      const options = { convert: false };

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

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });
  });

  lab.experiment('email_address', () => {

    lab.test('is required', (done) => {
      
      const schema = server.plugins.schemas.userReplacePayload;

      const options = { convert: false };

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

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });
    
    lab.test('must be a string', (done) => {
      
      const schema = server.plugins.schemas.userReplacePayload;

      const options = { convert: false };

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

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });
    
    lab.test('must be formatted like an email address', (done) => {
      
      const schema = server.plugins.schemas.userReplacePayload;

      const options = { convert: false };

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

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });
    
    lab.test('must be at least 1 character long', (done) => {
      
      const schema = server.plugins.schemas.userReplacePayload;

      const options = { convert: false };

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

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });
    
    lab.test('must be at most 80 characters long', (done) => {
      
      const schema = server.plugins.schemas.userReplacePayload;

      const options = { convert: false };

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

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });
  });

  lab.experiment('password', () => {

    lab.test('is required', (done) => {
      
      const schema = server.plugins.schemas.userReplacePayload;

      const options = { convert: false };

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

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });

    lab.test('must be a string', (done) => {
      
      const schema = server.plugins.schemas.userReplacePayload;

      const options = { convert: false };

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

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });

    lab.test('must be at least 8 characters long', (done) => {
      
      const schema = server.plugins.schemas.userReplacePayload;

      const options = { convert: false };

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

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });

    lab.test('must be at most 80 characters long', (done) => {
      
      const schema = server.plugins.schemas.userReplacePayload;

      const options = { convert: false };

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

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });
  });

  lab.experiment('password_confirmation', () => {

    lab.test('is required', (done) => {
      
      const schema = server.plugins.schemas.userReplacePayload;

      const options = { convert: false };

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

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });

    lab.test('must be a string', (done) => {
      
      const schema = server.plugins.schemas.userReplacePayload;

      const options = { convert: false };

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

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });

    lab.test('must match password', (done) => {
      
      const schema = server.plugins.schemas.userReplacePayload;

      const options = { convert: false };

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

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });
  });
});