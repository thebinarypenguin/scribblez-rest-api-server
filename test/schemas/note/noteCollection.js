'use strict';

const Code    = require('code');
const Hapi    = require('hapi');
const Joi     = require('joi');
const Lab     = require('lab');
const config  = require('../../../src/config');
const schemas = require('../../../src/schemas');

const lab = exports.lab = Lab.script();

lab.experiment('schemas.noteCollection', () => {

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

  lab.test('must be an array', (done) => {
    
    const good = [
      {
        id: 42,
        body: 'A note',
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
        visibility: 'public',
      },
    ];

    const bad = {};

    Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.noteCollection)).to.not.throw();
    Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.noteCollection)).to.throw();

    done();
  });

  lab.test('items must match the note schema', (done) => {

    const good = [
      {
        id: 42,
        body: 'A note',
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
        visibility: 'public',
      },
    ];

    const bad = [
      {
        id: 42,
        body: 'A note',
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
      },
    ];

    Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.noteCollection)).to.not.throw();
    Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.noteCollection)).to.throw();

    done();
  });
});
