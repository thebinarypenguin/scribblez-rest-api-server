'use strict';

const Code      = require('code');
const AuthBasic = require('hapi-auth-basic');
const Joi       = require('joi');
const Lab       = require('lab');
const helpers   = require('../../_helpers');
const config    = require('../../../src/config');
const auth      = require('../../../src/auth');
const models    = require('../../../src/models');
const routes    = require('../../../src/routes');
const schemas   = require('../../../src/schemas');

const cfg = config.load('test');

const lab = exports.lab = Lab.script();

lab.experiment('POST /users', () => {

  let server = null;
  
  lab.before(() => {
    
    return helpers
      .checkDatabase(cfg)
      .then(() => {

        return helpers.initializeTestServer(cfg, [AuthBasic, auth, models, routes, schemas])
      })
      .then((testServer) => {
        server = testServer;
      });
  });

  lab.after(() => {

    return helpers.emptyDatabase(cfg);
  });

  lab.experiment('Username already exists', () => {

    let response = null;

    lab.before(() => {

      const duplicateUser = {
        method: 'POST',
        url: '/users',
        payload: {
          username: 'homer',
          real_name: 'Evil Homer',
          email_address: 'evilhomer@example.com',
          password: 'I am Evil Homer',
          password_confirmation: 'I am Evil Homer',
        },
      };

      return helpers.resetDatabase(cfg)
        .then(() => {

          return server.inject(duplicateUser).then((res) => {
            response = res;
          });
        });
    });

    lab.test('Status code should be 400 Bad Request', (done) => {
      Code.expect(response.statusCode).to.equal(400);
      done();
    });

    lab.test('Content-Type should contain application/json', (done) => {
      Code.expect(response.headers['content-type']).to.contain('application/json');
      done();
    });

    lab.test('Body should match the error400 schema', (done) => {
      Joi.assert(response.payload, server.plugins.schemas.error400);
      done();
    });

    lab.test('Error message should be "username already exists"', (done) => {
      Code.expect(JSON.parse(response.payload).message).to.equal('username already exists');
      done();
    });    
  });

  lab.experiment('Malformed Body', () => {

    let response = null;

    lab.before(() => {

      const malformedBody = {
        method: 'POST',
        url: '/users',
        payload: {
          foo: 'bar',
        },
      };

      return helpers.resetDatabase(cfg)
        .then(() => {

          return server.inject(malformedBody).then((res) => {
            response = res;
          });
        });
    });

    lab.test('Status code should be 400 Bad Request', (done) => {
      Code.expect(response.statusCode).to.equal(400);
      done();
    });

    lab.test('Content-Type should contain application/json', (done) => {
      Code.expect(response.headers['content-type']).to.contain('application/json');
      done();
    });

    lab.test('Body should match the error400 schema', (done) => {
      Joi.assert(response.payload, server.plugins.schemas.error400);
      done();
    });

    lab.test('Error message should be "body is malformed"', (done) => {
      Code.expect(JSON.parse(response.payload).message).to.equal('body is malformed');
      done();
    });
  });

  lab.experiment('Valid Request', () => {

    let response = null;

    lab.before(() => {

      const valid = {
        method: 'POST',
        url: '/users',
        payload: {
          username: 'poochie',
          real_name: 'Poochie',
          email_address: 'poochie@example.com',
          password: 'ToTheMax',
          password_confirmation: 'ToTheMax',
        },
      };

      return helpers.resetDatabase(cfg)
        .then(() => {

          return server.inject(valid).then((res) => {
            response = res;
          });
        });
    });

    lab.test('Status code should be 201 Created', (done) => {
      Code.expect(response.statusCode).to.equal(201);
      done();
    });

    lab.test('Location should be the URI of the new user', (done) => {
      Code.expect(response.headers['location']).to.contain('/users/');
      done();
    });

    lab.test('Body should be empty', (done) => {
      Code.expect(response.payload).to.equal('');
      done();
    });
  });
});
