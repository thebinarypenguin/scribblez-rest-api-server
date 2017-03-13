'use strict';

const Code    = require('code');
const Hapi    = require('hapi');
const Joi     = require('joi');
const Lab     = require('lab');
const helpers = require('../../_helpers');
const config  = require('../../../src/config');
const schemas = require('../../../src/schemas');

const lab = exports.lab = Lab.script();

lab.experiment('schemas.userUpdatePayload', () => {

  let server = new Hapi.Server();
  
  lab.before(() => {

    return helpers.initializeTestServer(config, [schemas])
      .then((testServer) => {
        server = testServer;
      });
  });

  lab.test('must have at least one property', (done) => {

    const schema = server.plugins.schemas.userUpdatePayload;

    const options = { convert: false };

    const good = {
      real_name: 'John Doe',
      email_address: 'jdoe@example.com',
      password: 'password',
      password_confirmation: 'password',
    };

    const bad = {};

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

    done();
  });

  lab.test('password and password_confirmation must appear (or not) as a pair', (done) => {

    const schema = server.plugins.schemas.userUpdatePayload;

    const options = { convert: false };

    const good = [
      // Both
      {
        real_name: 'John Doe',
        email_address: 'jdoe@example.com',
        password: 'password',
        password_confirmation: 'password',
      },
      // Neither
      {
        real_name: 'John Doe',
        email_address: 'jdoe@example.com',
      },
    ];

    const bad = [
      // Only password
      {
        real_name: 'John Doe',
        email_address: 'jdoe@example.com',
        password: 'password',
      },
      // Only password_confirmation
      {
        real_name: 'John Doe',
        email_address: 'jdoe@example.com',
        password_confirmation: 'password',
      },
    ];

    Code.expect(Joi.validate(good[0], schema, options).error).to.be.null();
    Code.expect(Joi.validate(good[1], schema, options).error).to.be.null();
    Code.expect(Joi.validate(bad[0], schema, options).error).to.be.an.error();
    Code.expect(Joi.validate(bad[1], schema, options).error).to.be.an.error();

    done();
  });

  lab.experiment('real_name', () => {

    lab.test('is optional', (done) => {

      const schema = server.plugins.schemas.userUpdatePayload;

      const options = { convert: false };

      const good =[
        // Present
        {
          real_name: 'John Doe',
          email_address: 'jdoe@example.com',
          password: 'password',
          password_confirmation: 'password',
        },
        // Absent
        {
          email_address: 'jdoe@example.com',
          password: 'password',
          password_confirmation: 'password',
        },
      ];

      Code.expect(Joi.validate(good[0], schema, options).error).to.be.null();
      Code.expect(Joi.validate(good[1], schema, options).error).to.be.null();

      done();
    });
    
    lab.test('must be a string', (done) => {

      const schema = server.plugins.schemas.userUpdatePayload;

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

      const schema = server.plugins.schemas.userUpdatePayload;

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

      const schema = server.plugins.schemas.userUpdatePayload;

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

    lab.test('is optional', (done) => {

      const schema = server.plugins.schemas.userUpdatePayload;

      const options = { convert: false };

      const good =[
        // Present
        {
          real_name: 'John Doe',
          email_address: 'jdoe@example.com',
          password: 'password',
          password_confirmation: 'password',
        },
        // Absent
        {
          real_name: 'John Doe',
          password: 'password',
          password_confirmation: 'password',
        },
      ];

      Code.expect(Joi.validate(good[0], schema, options).error).to.be.null();
      Code.expect(Joi.validate(good[1], schema, options).error).to.be.null();

      done();
    });
    
    lab.test('must be a string', (done) => {

      const schema = server.plugins.schemas.userUpdatePayload;

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

      const schema = server.plugins.schemas.userUpdatePayload;

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

      const schema = server.plugins.schemas.userUpdatePayload;

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

      const schema = server.plugins.schemas.userUpdatePayload;

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

    lab.test('is optional', (done) => {

      const schema = server.plugins.schemas.userUpdatePayload;

      const options = { convert: false };

      const good =[
        // Present
        {
          real_name: 'John Doe',
          email_address: 'jdoe@example.com',
          password: 'password',
          password_confirmation: 'password',
        },
        // Absent
        {
          real_name: 'John Doe',
          email_address: 'jdoe@example.com',
        },
      ];

      Code.expect(Joi.validate(good[0], schema, options).error).to.be.null();
      Code.expect(Joi.validate(good[1], schema, options).error).to.be.null();

      done();
    });

    lab.test('must be a string', (done) => {

      const schema = server.plugins.schemas.userUpdatePayload;

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

      const schema = server.plugins.schemas.userUpdatePayload;

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

      const schema = server.plugins.schemas.userUpdatePayload;

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

    lab.test('is optional', (done) => {

      const schema = server.plugins.schemas.userUpdatePayload;

      const options = { convert: false };

      const good =[
        // Present
        {
          real_name: 'John Doe',
          email_address: 'jdoe@example.com',
          password: 'password',
          password_confirmation: 'password',
        },
        // Absent
        {
          real_name: 'John Doe',
          email_address: 'jdoe@example.com',
        },
      ];

      Code.expect(Joi.validate(good[0], schema, options).error).to.be.null();
      Code.expect(Joi.validate(good[1], schema, options).error).to.be.null();

      done();
    });

    lab.test('must be a string', (done) => {

      const schema = server.plugins.schemas.userUpdatePayload;

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

      const schema = server.plugins.schemas.userUpdatePayload;

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