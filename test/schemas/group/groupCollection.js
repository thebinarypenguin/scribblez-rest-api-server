'use strict';

const Code    = require('code');
const Hapi    = require('hapi');
const Joi     = require('joi');
const Lab     = require('lab');
const config  = require('../../../src/config');
const schemas = require('../../../src/schemas');

const lab = exports.lab = Lab.script();

lab.experiment('schemas.groupCollection', () => {

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
    
    const schema = server.plugins.schemas.groupCollection;

    const options = { convert: false };

    const good = [
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
    ];

    const bad = {};

    Code.expect(Joi.validate(good, schema, options).error).to.be.null();
    Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

    done();
  });

  lab.test('items must match the group schema', (done) => {
    
    const schema = server.plugins.schemas.groupCollection;

    const options = { convert: false };

    const good = [
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
    ];

    const bad = [
      {
        id: 42,
        name: 'Just John',
      },
    ];

    Code.expect(Joi.validate(good, schema, options).error).to.be.null();
    Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

    done();
  });
});
