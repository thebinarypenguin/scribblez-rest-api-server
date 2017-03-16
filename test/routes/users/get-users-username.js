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

lab.experiment('GET /users/{username}', () => {

  let server = null;
  
  lab.before(() => {

    return helpers.initializeTestServer(config, [AuthBasic, auth, models, routes, schemas])
      .then((testServer) => {
        server = testServer;
      });
  });

  lab.experiment('No Authorization header', () => {

    const noAuth = {
      method: 'GET',
      url: '/users/homer',
    };

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(config);
    });

    lab.test('Status code should be 401 Unauthorized', () => {

      return server.inject(noAuth).then((response) => {
        Code.expect(response.statusCode).to.equal(401);
      });
    });

    lab.test('Content-Type should contain application/json', () => {

      return server.inject(noAuth).then((response) => {
        Code.expect(response.headers['content-type']).to.contain('application/json');
      });
    });

    lab.test('Body should match the error401 schema', () => {

      return server.inject(noAuth).then((response) => {
        Joi.assert(response.payload, server.plugins.schemas.error401);
      });
    });

    lab.test('Error message should be "Missing authentication"', () => {

      return server.inject(noAuth).then((response) => {
        Code.expect(JSON.parse(response.payload).message).to.equal('Missing authentication');
      });
    });
  });

  lab.experiment('Invalid Authorization header', () => {

    const credentials = new Buffer('badUser:badPassword', 'utf8').toString('base64')

    const invalidAuth = {
      method: 'GET',
      url: '/users/homer',
      headers: {
        'authorization': `Basic ${credentials}`,
      },
    };

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(config);
    });

    lab.test('Status code should be 401 Unauthorized', () => {

      return server.inject(invalidAuth).then((response) => {
        Code.expect(response.statusCode).to.equal(401);
      });
    });

    lab.test('Content-Type should contain application/json', () => {

      return server.inject(invalidAuth).then((response) => {
        Code.expect(response.headers['content-type']).to.contain('application/json');
      });
    });

    lab.test('Body should match the error401 schema', () => {

      return server.inject(invalidAuth).then((response) => {
        Joi.assert(response.payload, server.plugins.schemas.error401);
      });
    });

    lab.test('Error message should be "Bad username or password"', () => {

      return server.inject(invalidAuth).then((response) => {
        Code.expect(JSON.parse(response.payload).message).to.equal('Bad username or password');
      });
    });
  });

  lab.experiment('Username does not match authorized user', () => {

    const credentials = new Buffer('homer:password', 'utf8').toString('base64')

    const mismatch = {
      method: 'GET',
      url: '/users/nothomer',
      headers: {
        'authorization': `Basic ${credentials}`,
      },
    };

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(config);
    });

    lab.test('Status code should be 403 Forbidden', () => {

      return server.inject(mismatch).then((response) => {
        Code.expect(response.statusCode).to.equal(403);
      });
    });

    lab.test('Content-Type should contain application/json', () => {

      return server.inject(mismatch).then((response) => {
        Code.expect(response.headers['content-type']).to.contain('application/json');
      });
    });

    lab.test('Body should match the error403 schema', () => {

      return server.inject(mismatch).then((response) => {
        Joi.assert(response.payload, server.plugins.schemas.error403);
      });
    });

    lab.test('Error message should be "Permission denied"', () => {

      return server.inject(mismatch).then((response) => {
        Code.expect(JSON.parse(response.payload).message).to.equal('Permission denied');
      });
    });
  });

  lab.experiment('Valid Request', () => {

    const credentials = new Buffer('homer:password', 'utf8').toString('base64')

    const valid = {
      method: 'GET',
      url: '/users/homer',
      headers: {
        'authorization': `Basic ${credentials}`,
      },
    };

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(config);
    });

    lab.test('Status code should be 200 OK', () => {

      return server.inject(valid).then((response) => {
        Code.expect(response.statusCode).to.equal(200);
      });
    });

    lab.test('Content-Type should contain application/json', () => {

      return server.inject(valid).then((response) => {
        Code.expect(response.headers['content-type']).to.contain('application/json');
      });
    });

    lab.test('Body should match the user schema', () => {

      return server.inject(valid).then((response) => {
        Joi.assert(response.payload, server.plugins.schemas.user);
      });
    });

    lab.test('Body should match expected data', () => {

      const expectedData = {
        "username": "homer",
        "real_name": "Homer Simpson",
        "email_address": "homer@example.com",
      };

      return server.inject(valid).then((response) => {
        Code.expect(JSON.parse(response.payload)).to.equal(expectedData);
      });
    });
  });
});
