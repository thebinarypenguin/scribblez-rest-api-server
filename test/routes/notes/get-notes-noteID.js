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

lab.experiment('GET /notes/{noteID}', () => {

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

  lab.experiment('No Authorization header', () => {

    let response = null;

    lab.before(() => {
      
      const noAuth = {
        method: 'GET',
        url: '/notes/1',
      };

      return helpers.resetDatabase(cfg)
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
        method: 'GET',
        url: '/notes/1',
        headers: {
          'authorization': `Basic ${credentials}`,
        },
      };

      return helpers.resetDatabase(cfg)
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

  lab.experiment('Malformed noteID', () => {

    let response = null;

    lab.before(() => {
      
      const credentials = new Buffer('homer:password', 'utf8').toString('base64')

      const malformedNoteID = {
        method: 'GET',
        url: '/notes/!!!!!',
        headers: {
          'authorization': `Basic ${credentials}`,
        },
      };

      return helpers.resetDatabase(cfg)
        .then(() => {

          return server.inject(malformedNoteID).then((res) => {
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

    lab.test('Error message should be "noteID is malformed"', (done) => {
      Code.expect(JSON.parse(response.payload).message).to.equal('noteID is malformed');
      done();
    });
  });

  lab.experiment('Nonexistent noteID', () => {

    let response = null;

    lab.before(() => {
      
      const credentials = new Buffer('homer:password', 'utf8').toString('base64')

      const nonexistentNoteID = {
        method: 'GET',
        url: '/notes/999999',
        headers: {
          'authorization': `Basic ${credentials}`,
        },
      };

      return helpers.resetDatabase(cfg)
        .then(() => {

          return server.inject(nonexistentNoteID).then((res) => {
            response = res;
          });
        });
    });

    lab.test('Status code should be 404 Not Found', (done) => {
      Code.expect(response.statusCode).to.equal(404);
      done();
    });

    lab.test('Content-Type should contain application/json', (done) => {
      Code.expect(response.headers['content-type']).to.contain('application/json');
      done();
    });

    lab.test('Body should match the error404 schema', (done) => {
      Joi.assert(response.payload, server.plugins.schemas.error404);
      done();
    });

    lab.test('Error message should be "noteID does not exist"', (done) => {
      Code.expect(JSON.parse(response.payload).message).to.equal('noteID does not exist');
      done();
    });
  });

  lab.experiment('Note not owned by authenticated user', () => {

    let response = null;

    lab.before(() => {
      
      const credentials = new Buffer('homer:password', 'utf8').toString('base64')

      const denied = {
        method: 'GET',
        url: '/notes/15',
        headers: {
          'authorization': `Basic ${credentials}`,
        },
      };

      return helpers.resetDatabase(cfg)
        .then(() => {

          return server.inject(denied).then((res) => {
            response = res;
          });
        });
    });

    lab.test('Status code should be 403 Forbidden', (done) => {
      Code.expect(response.statusCode).to.equal(403);
      done();
    });

    lab.test('Content-Type should contain application/json', (done) => {
      Code.expect(response.headers['content-type']).to.contain('application/json');
      done();
    });

    lab.test('Body should match the error403 schema', (done) => {
      Joi.assert(JSON.parse(response.payload), server.plugins.schemas.error403);
      done();
    });

    lab.test('Error message should be "Permission Denied"', (done) => {
      Code.expect(JSON.parse(response.payload).message).to.equal('Permission Denied');
      done();
    });
  });

  lab.experiment('Valid Request', () => {

    let response = null;

    lab.before(() => {
      
      const credentials = new Buffer('homer:password', 'utf8').toString('base64')

      const valid = {
        method: 'GET',
        url: '/notes/1',
        headers: {
          'authorization': `Basic ${credentials}`,
        },
      };

      return helpers.resetDatabase(cfg)
        .then(() => {

          return server.inject(valid).then((res) => {
            response = res;
          });
        });
    });

    lab.test('Status code should be 200 OK', (done) => {
      Code.expect(response.statusCode).to.equal(200);
      done();
    });

    lab.test('Content-Type should contain application/json', (done) => {
      Code.expect(response.headers['content-type']).to.contain('application/json');
      done();
    });

    lab.test('Body should match the note schema', (done) => {
      Joi.assert(response.payload, server.plugins.schemas.note);
      done();
    });

    lab.test('Body should match expected data', (done) => {

      const expectedData = {
        "body": "Homer Simpson's first public note",
        "id": 1,
        "owner": {
          "real_name": "Homer Simpson",
          "username": "homer",
        },
        "visibility": "public",
        "created_at": "CANNOT BE RELIABLY PREDICTED",
        "updated_at": "CANNOT BE RELIABLY PREDICTED",
      };

      const actualData = JSON.parse(response.payload);

      expectedData.created_at = actualData.created_at;
      expectedData.updated_at = actualData.updated_at;

      Code.expect(actualData).to.equal(expectedData);
      done();
    });
  });
});
