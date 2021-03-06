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

lab.experiment('schemas.noteCollectionRedacted', () => {

  let server = null;
  
  lab.before(() => {

    return helpers.initializeTestServer(cfg, [schemas])
      .then((testServer) => {
        server = testServer;
      });
  });

  lab.test('must be an array', (done) => {
    
    const schema = server.plugins.schemas.noteCollectionRedacted;

    const options = { convert: false };
    
    const good = [
      {
        id: 42,
        body: 'A note',
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
        created_at: '2017-04-03T11:18:05Z',
        updated_at: '2017-04-03T11:23:36Z',
      },
    ];

    const bad = {};

    Code.expect(Joi.validate(good, schema, options).error).to.be.null();
    Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

    done();
  });

  lab.test('items must match the noteRedacted schema', (done) => {
    
    const schema = server.plugins.schemas.noteCollectionRedacted;

    const options = { convert: false };

    const good = [
      {
        id: 42,
        body: 'A note',
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
        created_at: '2017-04-03T11:18:05Z',
        updated_at: '2017-04-03T11:23:36Z',
      },
    ];

    const bad = [
      {
        id: 42,
        body: 'A note',
        created_at: '2017-04-03T11:18:05Z',
        updated_at: '2017-04-03T11:23:36Z',
      },
    ];

    Code.expect(Joi.validate(good, schema, options).error).to.be.null();
    Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

    done();
  });
});
