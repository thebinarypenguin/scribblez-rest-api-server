'use strict';

const Code    = require('code');
const Hapi    = require('hapi');
const Joi     = require('joi');
const Lab     = require('lab');
const config  = require('../../../src/config');
const schemas = require('../../../src/schemas');

const lab = exports.lab = Lab.script();

lab.experiment('schemas.userRedacted', () => {

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

  lab.experiment('username', () => {

    lab.test('is required', (done) => {

      const good = {
        username: 'john_doe',
        real_name: 'John Doe',
      };

      const bad = {
        real_name: 'John Doe',
      };

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.userRedacted)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.userRedacted)).to.throw();

      done();
    });
    
    lab.test('must be a string', (done) => {

      const good = {
        username: 'john_doe',
        real_name: 'John Doe',
      };

      const bad = {
        username: 999,
        real_name: 'John Doe',
      };

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.userRedacted)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.userRedacted)).to.throw();

      done();
    });
    
    lab.test('must match the regex /^[a-z0-9_]+$/', (done) => {

      const good = {
        username: 'john_doe',
        real_name: 'John Doe',
      };

      const bad = [
        // Capital
        {
          username: 'John_Doe',
          real_name: 'John Doe',       
        },
        // Punctuation
        {
          username: 'john.doe',
          real_name: 'John Doe',        
        },
        // Space
        {
          username: 'john doe',
          real_name: 'John Doe',         
        },
      ];

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.userRedacted)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad[0], server.plugins.schemas.userRedacted)).to.throw();
      Code.expect(Joi.assert.bind(this, bad[1], server.plugins.schemas.userRedacted)).to.throw();
      Code.expect(Joi.assert.bind(this, bad[2], server.plugins.schemas.userRedacted)).to.throw();

      done();
    });
    
    lab.test('must be at least 3 characters long', (done) => {

      const good = {
        username: 'john_doe',
        real_name: 'John Doe',
      };

      const bad = {
        username: 'jd',
        real_name: 'John Doe',
      };

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.userRedacted)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.userRedacted)).to.throw();

      done();
    });
    
    lab.test('must be at most 20 characters long', (done) => {

      const good = {
        username: 'john_doe',
        real_name: 'John Doe',
      };

      const bad = {
        username: '______john__doe______',
        real_name: 'John Doe',
      };

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.userRedacted)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.userRedacted)).to.throw();

      done();
    });
  });

  lab.experiment('real_name', () => {

    lab.test('is required', (done) => {

      const good = {
        username: 'john_doe',
        real_name: 'John Doe',
      };

      const bad = {
        username: 'john_doe',
      };

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.userRedacted)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.userRedacted)).to.throw();

      done();
    });
    
    lab.test('must be a string', (done) => {

      const good = {
        username: 'john_doe',
        real_name: 'John Doe',
      };

      const bad = {
        username: 'john_doe',
        real_name: 999,
      };

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.userRedacted)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.userRedacted)).to.throw();

      done();
    });
    
    lab.test('must be at least 1 character long', (done) => {

      const good = {
        username: 'john_doe',
        real_name: 'John Doe',
      };

      const bad = {
        username: 'john_doe',
        real_name: '',
      };

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.userRedacted)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.userRedacted)).to.throw();

      done();
    });
    
    lab.test('must be at most 80 characters long', (done) => {

      const good = {
        username: 'john_doe',
        real_name: 'John Doe',
      };

      const bad = {
        username: 'john_doe',
        real_name: 'x'.repeat(81),
      };

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.userRedacted)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.userRedacted)).to.throw();

      done();
    });
  });

  lab.experiment('email_address', () => {

    lab.test('must not be present', (done) => {

      const good = {
        username: 'john_doe',
        real_name: 'John Doe',
      };

      const bad = {
        username: 'john_doe',
        real_name: 'John Doe',
        email_address: 'jdoe@example.com',
      };

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.userRedacted)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.userRedacted)).to.throw();

      done();
    });
  });
});
