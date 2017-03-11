'use strict';

const Code     = require('code');
const Joi      = require('joi');
const Lab      = require('lab');
const helpers  = require('../../_helpers');
const config   = require('../../../src/config');
const models   = require('../../../src/models');
const routes   = require('../../../src/routes');
const schemas  = require('../../../src/schemas');

const lab = exports.lab = Lab.script();

lab.experiment('POST /users', () => {

  let server = null;
  
  lab.before(() => {

    return helpers.initializeTestServer(config, [models, routes, schemas])
      .then((testServer) => {
        server = testServer;
      });
  });

  lab.experiment('No Authorization header', () => {

    const noAuth = {
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
      method: 'POST',
      url: '/users',
      headers: {
        'authorization': `Basic ${credentials}`,
      },
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

  lab.experiment('No body', () => {

    const credentials = new Buffer('homer:password', 'utf8').toString('base64')

    const noBody = {
      method: 'POST',
      url: '/users',
      headers: {
        'authorization': `Basic ${credentials}`,
      },
    };

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(config);
    });

    lab.test('Status code should be 400 Bad Request', () => {

      return server.inject(noBody).then((response) => {
        Code.expect(response.statusCode).to.equal(400);
      });
    });

    lab.test('Content-Type should contain application/json', () => {

      return server.inject(noBody).then((response) => {
        Code.expect(response.headers['content-type']).to.contain('application/json');
      });
    });

    lab.test('Body should match the error400 schema', () => {

      return server.inject(noBody).then((response) => {
        Joi.assert(response.payload, server.plugins.schemas.error400);
      });
    });
  });

  lab.experiment('Invalid Body', () => {

    const credentials = new Buffer('homer:password', 'utf8').toString('base64')

    const invalidBody = {
      method: 'POST',
      url: '/users',
      headers: {
        'authorization': `Basic ${credentials}`,
      },
      payload: {
        foo: 'bar',
      },
    };

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(config);
    });

    lab.test('Status code should be 400 Bad Request', () => {

      return server.inject(invalidBody).then((response) => {
        Code.expect(response.statusCode).to.equal(400);
      });
    });

    lab.test('Content-Type should contain application/json', () => {

      return server.inject(invalidBody).then((response) => {
        Code.expect(response.headers['content-type']).to.contain('application/json');
      });
    });

    lab.test('Body should match the error400 schema', () => {

      return server.inject(invalidBody).then((response) => {
        Joi.assert(response.payload, server.plugins.schemas.error400);
      });
    });
  });

  lab.experiment('Valid Request', () => {

    const credentials = new Buffer('homer:password', 'utf8').toString('base64')

    const valid = {
      method: 'POST',
      url: '/users',
      headers: {
        'authorization': `Basic ${credentials}`,
      },
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

    lab.test('Location should be the URI of the new user', () => {

      return server.inject(valid).then((response) => {
        Code.expect(response.headers['location']).to.contain('/users/');
      });
    });

    lab.test('Body should be empty', () => {

      return server.inject(valid).then((response) => {
        Code.expect(response.payload).to.be.null();
      });
    });
  });
});