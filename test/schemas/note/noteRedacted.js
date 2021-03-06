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

lab.experiment('schemas.noteRedacted', () => {

  let server = null;
  
  lab.before(() => {

    return helpers.initializeTestServer(cfg, [schemas])
      .then((testServer) => {
        server = testServer;
      });
  });

  lab.experiment('id', () => {

    lab.test('is required', (done) => {
      
      const schema = server.plugins.schemas.noteRedacted;

      const options = { convert: false };

      const good = {
        id: 42,
        body: 'A note',
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
        created_at: '2017-04-03T11:18:05Z',
        updated_at: '2017-04-03T11:23:36Z',
      };

      const bad = {
        body: 'A note',
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
        created_at: '2017-04-03T11:18:05Z',
        updated_at: '2017-04-03T11:23:36Z',
      };

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });

    lab.test('must be an integer', (done) => {
      
      const schema = server.plugins.schemas.noteRedacted;

      const options = { convert: false };

      const good = {
        id: 42,
        body: 'A note',
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
        created_at: '2017-04-03T11:18:05Z',
        updated_at: '2017-04-03T11:23:36Z',
      };

      const bad = {
        id: '42',
        body: 'A note',
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
        created_at: '2017-04-03T11:18:05Z',
        updated_at: '2017-04-03T11:23:36Z',
      };

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });
  });

  lab.experiment('body', () => {

    lab.test('is required', (done) => {
      
      const schema = server.plugins.schemas.noteRedacted;

      const options = { convert: false };

      const good = {
        id: 42,
        body: 'A note',
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
        created_at: '2017-04-03T11:18:05Z',
        updated_at: '2017-04-03T11:23:36Z',
      };

      const bad = {
        id: 42,
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
        created_at: '2017-04-03T11:18:05Z',
        updated_at: '2017-04-03T11:23:36Z',
      };

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });

    lab.test('must be a string', (done) => {
      
      const schema = server.plugins.schemas.noteRedacted;

      const options = { convert: false };

      const good = {
        id: 42,
        body: 'A note',
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
        created_at: '2017-04-03T11:18:05Z',
        updated_at: '2017-04-03T11:23:36Z',
      };

      const bad = {
        id: 42,
        body: 999,
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
        created_at: '2017-04-03T11:18:05Z',
        updated_at: '2017-04-03T11:23:36Z',
      };

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });
    
    lab.test('must be at least 1 character long', (done) => {
      
      const schema = server.plugins.schemas.noteRedacted;

      const options = { convert: false };

      const good = {
        id: 42,
        body: 'A note',
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
        created_at: '2017-04-03T11:18:05Z',
        updated_at: '2017-04-03T11:23:36Z',
      };

      const bad = {
        id: 42,
        body: '',
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
        created_at: '2017-04-03T11:18:05Z',
        updated_at: '2017-04-03T11:23:36Z',
      };

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });
    
    lab.test('must be at most 10,000 characters long', (done) => {
      
      const schema = server.plugins.schemas.noteRedacted;

      const options = { convert: false };

      const good = {
        id: 42,
        body: 'A note',
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
        created_at: '2017-04-03T11:18:05Z',
        updated_at: '2017-04-03T11:23:36Z',
      };

      const bad = {
        id: 42,
        body: 'x'.repeat(10001),
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
        created_at: '2017-04-03T11:18:05Z',
        updated_at: '2017-04-03T11:23:36Z',
      };

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });
  });

  lab.experiment('owner', () => {

    lab.test('is required', (done) => {
      
      const schema = server.plugins.schemas.noteRedacted;

      const options = { convert: false };

      const good = {
        id: 42,
        body: 'A note',
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
        created_at: '2017-04-03T11:18:05Z',
        updated_at: '2017-04-03T11:23:36Z',
      };

      const bad = {
        id: 42,
        body: 'A note',
        created_at: '2017-04-03T11:18:05Z',
        updated_at: '2017-04-03T11:23:36Z',
      };

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });

    lab.test('must match the userRedacted schema', (done) => {
      
      const schema = server.plugins.schemas.noteRedacted;

      const options = { convert: false };

      const good = {
        id: 42,
        body: 'A note',
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
        created_at: '2017-04-03T11:18:05Z',
        updated_at: '2017-04-03T11:23:36Z',
      };

      const bad = {
        id: 42,
        body: 'A note',
        owner: {
          username: 'john_doe',
        },
        created_at: '2017-04-03T11:18:05Z',
        updated_at: '2017-04-03T11:23:36Z',
      };

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });
  });

  lab.experiment('visibility', () => {

    lab.test('must not be present', (done) => {
      
      const schema = server.plugins.schemas.noteRedacted;

      const options = { convert: false };

      const good = {
        id: 42,
        body: 'A note',
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
        created_at: '2017-04-03T11:18:05Z',
        updated_at: '2017-04-03T11:23:36Z',
      };

      const bad = {
        id: 42,
        body: 'A note',
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
        visibility: 'public',
        created_at: '2017-04-03T11:18:05Z',
        updated_at: '2017-04-03T11:23:36Z',
      };

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });
  });

  lab.experiment('created_at', () => {

    lab.test('is required', (done) => {
      
      const schema = server.plugins.schemas.noteRedacted;

      const options = { convert: false };

      const good = {
        id: 42,
        body: 'A note',
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
        created_at: '2017-04-03T11:18:05Z',
        updated_at: '2017-04-03T11:23:36Z',
      };

      const bad = {
        id: 42,
        body: 'A note',
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
        updated_at: '2017-04-03T11:23:36Z',
      };

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });

    lab.test('must be a string', (done) => {
      
      const schema = server.plugins.schemas.noteRedacted;

      const options = { convert: false };

      const good = {
        id: 42,
        body: 'A note',
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
        created_at: '2017-04-03T11:18:05Z',
        updated_at: '2017-04-03T11:23:36Z',
      };

      const bad = {
        id: 42,
        body: 'A note',
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
        created_at: Date.now(),
        updated_at: '2017-04-03T11:23:36Z',
      };

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });

    lab.test('must be in ISO 8601 format', (done) => {
      
      const schema = server.plugins.schemas.noteRedacted;

      const options = { convert: false };

      const good = {
        id: 42,
        body: 'A note',
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
        created_at: '2017-04-03T11:18:05Z',
        updated_at: '2017-04-03T11:23:36Z',
      };

      const bad = {
        id: 42,
        body: 'A note',
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
        created_at: '04-03-2017',
        updated_at: '2017-04-03T11:23:36Z',
      };

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });
  });

  lab.experiment('updated_at', () => {

    lab.test('is required', (done) => {
      
      const schema = server.plugins.schemas.noteRedacted;

      const options = { convert: false };

      const good = {
        id: 42,
        body: 'A note',
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
        created_at: '2017-04-03T11:18:05Z',
        updated_at: '2017-04-03T11:23:36Z',
      };

      const bad = {
        id: 42,
        body: 'A note',
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
        created_at: '2017-04-03T11:18:05Z',
      };

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });

    lab.test('must be a string', (done) => {
      
      const schema = server.plugins.schemas.noteRedacted;

      const options = { convert: false };

      const good = {
        id: 42,
        body: 'A note',
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
        created_at: '2017-04-03T11:18:05Z',
        updated_at: '2017-04-03T11:23:36Z',
      };

      const bad = {
        id: 42,
        body: 'A note',
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
        created_at: '2017-04-03T11:18:05Z',
        updated_at: Date.now(),
      };

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });

    lab.test('must be in ISO 8601 format', (done) => {
      
      const schema = server.plugins.schemas.noteRedacted;

      const options = { convert: false };

      const good = {
        id: 42,
        body: 'A note',
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
        created_at: '2017-04-03T11:18:05Z',
        updated_at: '2017-04-03T11:23:36Z',
      };

      const bad = {
        id: 42,
        body: 'A note',
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
        created_at: '2017-04-03T11:18:05Z',
        updated_at: '04-03-2017',
      };

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });
  });
});
