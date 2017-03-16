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

const lab = exports.lab = Lab.script();

lab.experiment('POST /users', () => {

  let server = null;
  
  lab.before(() => {

    return helpers.initializeTestServer(config, [AuthBasic, auth, models, routes, schemas])
      .then((testServer) => {
        server = testServer;
      });
  });

  lab.experiment('Username already exists', () => {

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

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(config);
    });

    lab.test('Status code should be 400 Bad Request', () => {

      return server.inject(duplicateUser).then((response) => {
        Code.expect(response.statusCode).to.equal(400);
      });
    });

    lab.test('Content-Type should contain application/json', () => {

      return server.inject(duplicateUser).then((response) => {
        Code.expect(response.headers['content-type']).to.contain('application/json');
      });
    });

    lab.test('Body should match the error400 schema', () => {

      return server.inject(duplicateUser).then((response) => {
        Joi.assert(response.payload, server.plugins.schemas.error400);
      });
    });

    lab.test('Error message should be "username already exists"', () => {

      return server.inject(duplicateUser).then((response) => {
        Code.expect(JSON.parse(response.payload).message).to.equal('username already exists');
      });
    });    
  });

  lab.experiment('Malformed Body', () => {

    const malformedBody = {
      method: 'POST',
      url: '/users',
      payload: {
        foo: 'bar',
      },
    };

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(config);
    });

    lab.test('Status code should be 400 Bad Request', () => {

      return server.inject(malformedBody).then((response) => {
        Code.expect(response.statusCode).to.equal(400);
      });
    });

    lab.test('Content-Type should contain application/json', () => {

      return server.inject(malformedBody).then((response) => {
        Code.expect(response.headers['content-type']).to.contain('application/json');
      });
    });

    lab.test('Body should match the error400 schema', () => {

      return server.inject(malformedBody).then((response) => {
        Joi.assert(response.payload, server.plugins.schemas.error400);
      });
    });

    lab.test('Error message should be "body is malformed"', () => {

      return server.inject(malformedBody).then((response) => {
        Code.expect(JSON.parse(response.payload).message).to.equal('body is malformed');
      });
    });
  });

  lab.experiment('Valid Request', () => {

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

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(config);
    });

    lab.test('Status code should be 201 Created', () => {

      return server.inject(valid).then((response) => {
        Code.expect(response.statusCode).to.equal(201);
      });
    });

    lab.test('Location should be the URI of the new user', () => {

      return server.inject(valid).then((response) => {
        Code.expect(response.headers['location']).to.contain('/users/');
      });
    });

    lab.test('Body should be empty', () => {

      return server.inject(valid).then((response) => {
        Code.expect(response.payload).to.equal('');
      });
    });
  });
});
