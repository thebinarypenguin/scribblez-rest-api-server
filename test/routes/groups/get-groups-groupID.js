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

lab.experiment('GET /groups/{groupID}', () => {

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
      url: '/groups/1',
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
  });

  lab.experiment('Invalid Authorization header', () => {

    const credentials = new Buffer('badUser:badPassword', 'utf8').toString('base64')

    const invalidAuth = {
      method: 'GET',
      url: '/groups/1',
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
  });

  lab.experiment('Invalid groupID', () => {

    const credentials = new Buffer('homer:password', 'utf8').toString('base64')

    const invalidGroupID = {
      method: 'GET',
      url: '/groups/999999',
      headers: {
        'authorization': `Basic ${credentials}`,
      },
    };

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(config);
    });

    lab.test('Status code should be 404 Not Found', () => {

      return server.inject(invalidGroupID).then((response) => {
        Code.expect(response.statusCode).to.equal(404);
      });
    });

    lab.test('Content-Type should contain application/json', () => {

      return server.inject(invalidGroupID).then((response) => {
        Code.expect(response.headers['content-type']).to.contain('application/json');
      });
    });

    lab.test('Body should match the error404 schema', () => {

      return server.inject(invalidGroupID).then((response) => {
        Joi.assert(response.payload, server.plugins.schemas.error404);
      });
    });
  });

  lab.experiment('Valid Request', () => {

    const credentials = new Buffer('homer:password', 'utf8').toString('base64')

    const valid = {
      method: 'GET',
      url: '/groups/1',
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

    lab.test('Body should match the group schema', () => {

      return server.inject(valid).then((response) => {
        Joi.assert(response.payload, server.plugins.schemas.group);
      });
    });
  });
});
