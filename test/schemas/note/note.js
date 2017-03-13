'use strict';

const Code    = require('code');
const Hapi    = require('hapi');
const Joi     = require('joi');
const Lab     = require('lab');
const config  = require('../../../src/config');
const schemas = require('../../../src/schemas');

const lab = exports.lab = Lab.script();

lab.experiment('schemas.note', () => {

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
      
      const schema = server.plugins.schemas.note;

      const options = { convert: false };

      const good = {
        id: 42,
        body: 'A note',
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
        visibility: 'public',
      };

      const bad = {
        body: 'A note',
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
        visibility: 'public',
      };

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });

    lab.test('must be an integer', (done) => {
      
      const schema = server.plugins.schemas.note;

      const options = { convert: false };

      const good = {
        id: 42,
        body: 'A note',
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
        visibility: 'public',
      };

      const bad = {
        id: '42',
        body: 'A note',
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
        visibility: 'public',
      };

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });
  });

  lab.experiment('body', () => {

    lab.test('is required', (done) => {
      
      const schema = server.plugins.schemas.note;

      const options = { convert: false };

      const good = {
        id: 42,
        body: 'A note',
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
        visibility: 'public',
      };

      const bad = {
        id: 42,
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
        visibility: 'public',
      };

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });

    lab.test('must be a string', (done) => {
      
      const schema = server.plugins.schemas.note;

      const options = { convert: false };

      const good = {
        id: 42,
        body: 'A note',
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
        visibility: 'public',
      };

      const bad = {
        id: 42,
        body: 999,
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
        visibility: 'public',
      };

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });
    
    lab.test('must be at least 1 character long', (done) => {
      
      const schema = server.plugins.schemas.note;

      const options = { convert: false };

      const good = {
        id: 42,
        body: 'A note',
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
        visibility: 'public',
      };

      const bad = {
        id: 42,
        body: '',
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
        visibility: 'public',
      };

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });
    
    lab.test('must be at most 10,000 characters long', (done) => {
      
      const schema = server.plugins.schemas.note;

      const options = { convert: false };

      const good = {
        id: 42,
        body: 'A note',
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
        visibility: 'public',
      };

      const bad = {
        id: 42,
        body: 'x'.repeat(10001),
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
        visibility: 'public',
      };

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });
  });

  lab.experiment('owner', () => {

    lab.test('is required', (done) => {
      
      const schema = server.plugins.schemas.note;

      const options = { convert: false };

      const good = {
        id: 42,
        body: 'A note',
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
        visibility: 'public',
      };

      const bad = {
        id: 42,
        body: 'A note',
        visibility: 'public',
      };

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });

    lab.test('must match the userRedacted schema', (done) => {
      
      const schema = server.plugins.schemas.note;

      const options = { convert: false };

      const good = {
        id: 42,
        body: 'A note',
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
        visibility: 'public',
      };

      const bad = {
        id: 42,
        body: 'A note',
        owner: {
          username: 'john_doe',
        },
        visibility: 'public',
      };

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });
  });

  lab.experiment('visibility', () => {

    lab.test('is required', (done) => {
      
      const schema = server.plugins.schemas.note;

      const options = { convert: false };

      const good = {
        id: 42,
        body: 'A note',
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
        visibility: 'public',
      };

      const bad = {
        id: 42,
        body: 'A note',
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
      };

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });

    lab.test('may be the string "public"', (done) => {
      
      const schema = server.plugins.schemas.note;

      const options = { convert: false };

      const good = {
        id: 42,
        body: 'A note',
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
        visibility: 'public',
      };

      const bad = {
        id: 42,
        body: 'A note',
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
        visibility: 'foobar',
      };

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });

    lab.test('may be the string "private"', (done) => {
      
      const schema = server.plugins.schemas.note;

      const options = { convert: false };

      const good = {
        id: 42,
        body: 'A note',
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
        visibility: 'private',
      };

      const bad = {
        id: 42,
        body: 'A note',
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
        visibility: 'foobar',
      };

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });

    lab.test('may be a "shared with" object', (done) => {
      
      const schema = server.plugins.schemas.note;

      const options = { convert: false };

      const good = {
        id: 42,
        body: 'A note',
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
        visibility: {
          users: [
            {
              username: 'john_doe',
              real_name: 'John Doe',
            },
          ],
          groups: [
            {
              id: 42,
              name: 'Just John',
              members: [
                {
                  username: 'john_doe',
                  real_name: 'John Doe',
                },
              ],
            },
          ],
        },
      };

      const bad = {
        id: 42,
        body: 'A note',
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
        visibility: {},
      };

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });
  });
});
