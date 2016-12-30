'use strict';

const Code    = require('code');
const Hapi    = require('hapi');
const Joi     = require('joi');
const Lab     = require('lab');
const config  = require('../../../src/config');
const schemas = require('../../../src/schemas');

const lab = exports.lab = Lab.script();

lab.experiment('noteCollectionRedacted schema', () => {

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
      },
    ];

    const bad = {};

    Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.noteCollectionRedacted)).to.not.throw();
    Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.noteCollectionRedacted)).to.throw();

    done();
  });

  lab.test('items must match the noteRedacted schema', (done) => {

    const good = [
      {
        id: 42,
        body: 'A note',
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
      },
    ];

    const bad = [
      {
        id: 42,
        body: 'A note',
      },
    ];

    Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.noteCollectionRedacted)).to.not.throw();
    Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.noteCollectionRedacted)).to.throw();

    done();
  });
});
