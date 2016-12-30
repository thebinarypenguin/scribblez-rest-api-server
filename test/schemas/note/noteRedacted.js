'use strict';

const Code    = require('code');
const Hapi    = require('hapi');
const Joi     = require('joi');
const Lab     = require('lab');
const config  = require('../../../src/config');
const schemas = require('../../../src/schemas');

const lab = exports.lab = Lab.script();

lab.experiment('noteRedacted schema', () => {

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

  lab.experiment('id', () => {

    lab.test('is required', (done) => {

      const good = {
        id: 42,
        body: 'A note',
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
      };

      const bad = {
        body: 'A note',
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
      };

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.noteRedacted)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.noteRedacted)).to.throw();

      done();
    });

    lab.test('must be an integer', (done) => {

      const good = {
        id: 42,
        body: 'A note',
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
      };

      const bad = {
        id: '42',
        body: 'A note',
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
      };

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.noteRedacted)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.noteRedacted)).to.throw();

      done();
    });
  });

  lab.experiment('body', () => {

    lab.test('is required', (done) => {

      const good = {
        id: 42,
        body: 'A note',
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
      };

      const bad = {
        id: 42,
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
      };

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.noteRedacted)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.noteRedacted)).to.throw();

      done();
    });

    lab.test('must be a string', (done) => {

      const good = {
        id: 42,
        body: 'A note',
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
      };

      const bad = {
        id: 42,
        body: 999,
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
      };

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.noteRedacted)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.noteRedacted)).to.throw();

      done();
    });
    
    lab.test('must be at least 1 character long', (done) => {

      const good = {
        id: 42,
        body: 'A note',
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
      };

      const bad = {
        id: 42,
        body: '',
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
      };

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.noteRedacted)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.noteRedacted)).to.throw();

      done();
    });
    
    lab.test('must be at most 10,000 characters long', (done) => {

      const good = {
        id: 42,
        body: 'A note',
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
      };

      const bad = {
        id: 42,
        body: 'x'.repeat(10001),
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
      };

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.noteRedacted)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.noteRedacted)).to.throw();

      done();
    });
  });

  lab.experiment('owner', () => {

    lab.test('is required', (done) => {

      const good = {
        id: 42,
        body: 'A note',
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
      };

      const bad = {
        id: 42,
        body: 'A note',
      };

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.noteRedacted)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.noteRedacted)).to.throw();

      done();
    });

    lab.test('must match the userRedacted schema', (done) => {

      const good = {
        id: 42,
        body: 'A note',
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
      };

      const bad = {
        id: 42,
        body: 'A note',
        owner: {
          username: 'john_doe',
        },
      };

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.noteRedacted)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.noteRedacted)).to.throw();

      done();
    });
  });

  lab.experiment('visibility', () => {

    lab.test('must not be present', (done) => {

      const good = {
        id: 42,
        body: 'A note',
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
      };

      const bad = {
        id: 42,
        body: 'A note',
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
        visibility: 'public',
      };

      Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.noteRedacted)).to.not.throw();
      Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.noteRedacted)).to.throw();

      done();
    });
  });
});
