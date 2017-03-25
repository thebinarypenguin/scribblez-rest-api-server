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

lab.experiment('POST /notes', () => {

  let server = null;
  
  lab.before(() => {
    
    return helpers
      .checkDatabase(config)
      .then(() => {

        return helpers.initializeTestServer(config, [AuthBasic, auth, models, routes, schemas])
      })
      .then((testServer) => {
        server = testServer;
      });
  });

  lab.after(() => {

    return helpers.emptyDatabase(config);
  });

  lab.experiment('No Authorization header', () => {

    let response = null;

    lab.before(() => {
      
      const noAuth = {
        method: 'POST',
        url: '/notes',
        payload: {
          body: 'An example test note',
          visibility: 'public',
        },
      };

      return helpers.resetDatabase(config)
        .then(() => {

          return server.inject(noAuth).then((res) => {
            response = res;
          });
        });
    });

    lab.test('Status code should be 401 Unauthorized', (done) => {
      Code.expect(response.statusCode).to.equal(401);
      done();
    });

    lab.test('Content-Type should contain application/json', (done) => {
      Code.expect(response.headers['content-type']).to.contain('application/json');
      done();
    });

    lab.test('Body should match the error401 schema', (done) => {
      Joi.assert(response.payload, server.plugins.schemas.error401);
      done();
    });

    lab.test('Error message should be "Missing authentication"', (done) => {
      Code.expect(JSON.parse(response.payload).message).to.equal('Missing authentication');
      done();
    });
  });

  lab.experiment('Invalid Authorization header', () => {

    let response = null;

    lab.before(() => {
      
      const credentials = new Buffer('badUser:badPassword', 'utf8').toString('base64')

      const invalidAuth = {
        method: 'POST',
        url: '/notes',
        headers: {
          'authorization': `Basic ${credentials}`,
        },
        payload: {
          body: 'An example test note',
          visibility: 'public',
        },
      };

      return helpers.resetDatabase(config)
        .then(() => {

          return server.inject(invalidAuth).then((res) => {
            response = res;
          });
        });
    });

    lab.test('Status code should be 401 Unauthorized', (done) => {
      Code.expect(response.statusCode).to.equal(401);
      done();
    });

    lab.test('Content-Type should contain application/json', (done) => {
      Code.expect(response.headers['content-type']).to.contain('application/json');
      done();
    });

    lab.test('Body should match the error401 schema', (done) => {
      Joi.assert(response.payload, server.plugins.schemas.error401);
      done();
    });

    lab.test('Error message should be "Bad username or password"', (done) => {
      Code.expect(JSON.parse(response.payload).message).to.equal('Bad username or password');
      done();
    });
  });

  lab.experiment('Malformed Body', () => {

    let response = null;

    lab.before(() => {
      
      const credentials = new Buffer('homer:password', 'utf8').toString('base64')

      const malformedBody = {
        method: 'POST',
        url: '/notes',
        headers: {
          'authorization': `Basic ${credentials}`,
        },
        payload: {
          foo: 'bar',
        },
      };

      return helpers.resetDatabase(config)
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
      
      const credentials = new Buffer('homer:password', 'utf8').toString('base64')

      const valid = {
        method: 'POST',
        url: '/notes',
        headers: {
          'authorization': `Basic ${credentials}`,
        },
        payload: {
          body: 'An example test note',
          visibility: 'public',
        },
      };

      return helpers.resetDatabase(config)
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

    lab.test('Location should be the URI of the new note', (done) => {
      Code.expect(response.headers['location']).to.contain('/notes/');
      done();
    });

    lab.test('Body should be empty', (done) => {
      Code.expect(response.payload).to.equal('');
      done();
    });
  });
});
