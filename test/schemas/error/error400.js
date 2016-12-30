'use strict';

const Code    = require('code');
const Hapi    = require('hapi');
const Joi     = require('joi');
const Lab     = require('lab');
const config  = require('../../../src/config');
const schemas = require('../../../src/schemas');

const lab = exports.lab = Lab.script();

lab.experiment('error400 schema', () => {

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

  lab.experiment('statusCode', () => {

    lab.test('is required', (done) => {

      const good = {
        statusCode: 400,
        error: 'Bad Request',
        message: 'Your request is bad and you should feel bad.',
      };

      const bad = {
        error: 'Bad Request',
        message: 'Your request is bad and you should feel bad.',
      };

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.error400)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.error400)).to.throw();

      done();
    });

    lab.test('must be the number 400', (done) => {

      const good = {
        statusCode: 400,
        error: 'Bad Request',
        message: 'Your request is bad and you should feel bad.',
      };

      const bad = [
        // Wrong type
        {
          statusCode: '400',
          error: 'Bad Request',
          message: 'Your request is bad and you should feel bad.',
        },
        // Wrong value
        {
          statusCode: 999,
          error: 'Bad Request',
          message: 'Your request is bad and you should feel bad.',
        },
      ];

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.error400)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad[0], server.plugins.schemas.error400)).to.throw();
      Code.expect(Joi.assert.bind(this, bad[1], server.plugins.schemas.error400)).to.throw();

      done();
    });
  });

  lab.experiment('error', () => {

    lab.test('is required', (done) => {

      const good = {
        statusCode: 400,
        error: 'Bad Request',
        message: 'Your request is bad and you should feel bad.',
      };

      const bad = {
        statusCode: 400,
        message: 'Your request is bad and you should feel bad.',
      };

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.error400)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.error400)).to.throw();

      done();
    });

    lab.test('must be the string "Bad Request"', (done) => {
      
      const good = {
        statusCode: 400,
        error: 'Bad Request',
        message: 'Your request is bad and you should feel bad.',
      };

      const bad = [
        // Wrong type
        {
          statusCode: 400,
          error: 999,
          message: 'Your request is bad and you should feel bad.',
        },
        // Wrong value
        {
          statusCode: 400,
          error: 'Foobar',
          message: 'Your request is bad and you should feel bad.',
        },
      ];

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.error400)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad[0], server.plugins.schemas.error400)).to.throw();
      Code.expect(Joi.assert.bind(this, bad[1], server.plugins.schemas.error400)).to.throw();

      done();
    });
  });

  lab.experiment('message', () => {

    lab.test('is optional', (done) => {

      const good = [
        // With message
        {
          statusCode: 400,
          error: 'Bad Request',
          message: 'Your request is bad and you should feel bad.',
        },
        // Without message
        {
          statusCode: 400,
          error: 'Bad Request',
        },
      ];

      Code.expect(Joi.assert.bind(this, good[0], server.plugins.schemas.error400)).to.not.throw();
      Code.expect(Joi.assert.bind(this, good[1], server.plugins.schemas.error400)).to.not.throw();

      done();
    });

    lab.test('must be a string', (done) => {

      const good = {
        statusCode: 400,
        error: 'Bad Request',
        message: 'Your request is bad and you should feel bad.',
      };

      const bad = {
        statusCode: 400,
        error: 'Bad Request',
        message: 999,
      };

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.error400)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.error400)).to.throw();

      done();
    });
  });
});
