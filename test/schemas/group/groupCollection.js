'use strict';

const Code    = require('code');
const Hapi    = require('hapi');
const Joi     = require('joi');
const Lab     = require('lab');
const config  = require('../../../src/config');
const schemas = require('../../../src/schemas');

const lab = exports.lab = Lab.script();

lab.experiment('groupCollection schema', () => {

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

    Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.groupCollection)).to.not.throw();
    Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.groupCollection)).to.throw();

    done();
  });

  lab.test('items must match the group schema', (done) => {

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

    Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.groupCollection)).to.not.throw();
    Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.groupCollection)).to.throw();

    done();
  });
});
