'use strict';

const Code    = require('code');
const Hapi    = require('hapi');
const Joi     = require('joi');
const Lab     = require('lab');
const helpers = require('../../_helpers');
const config  = require('../../../src/config');
const schemas = require('../../../src/schemas');

const lab = exports.lab = Lab.script();

lab.experiment('schemas.noteCollection', () => {

  let server = new Hapi.Server();
  
  lab.before(() => {

    return helpers.initializeTestServer(config, [schemas])
      .then((testServer) => {
        server = testServer;
      });
  });

  lab.test('must be an array', (done) => {
    
    const schema = server.plugins.schemas.noteCollection;

    const options = { convert: false };
    
    const good = [
      {
        id: '42',
        body: 'A note',
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
        visibility: 'public',
      },
    ];

    const bad = {};

    Code.expect(Joi.validate(good, schema, options).error).to.be.null();
    Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

    done();
  });

  lab.test('items must match the note schema', (done) => {
    
    const schema = server.plugins.schemas.noteCollection;

    const options = { convert: false };

    const good = [
      {
        id: '42',
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
        id: '42',
        body: 'A note',
        owner: {
          username: 'john_doe',
          real_name: 'John Doe',
        },
      },
    ];

    Code.expect(Joi.validate(good, schema, options).error).to.be.null();
    Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

    done();
  });
});
