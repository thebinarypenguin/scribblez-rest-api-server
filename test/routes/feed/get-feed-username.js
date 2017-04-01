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

lab.experiment('GET /feed/{username}', () => {

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
        url: '/feed/marge',
      };

      return helpers.resetDatabase(cfg)
        .then(() => {

          return server.inject(noAuth).then((res) => {
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

    lab.test('Body should match the noteCollectionRedacted schema', (done) => {
      Joi.assert(JSON.parse(response.payload), server.plugins.schemas.noteCollectionRedacted);
      done();
    });

    lab.test('Body should match expected data', (done) => {

      const expectedData = [
        {
          "body": "Marge Simpson's second public note",
          "id": 11,
          "owner": {
            "real_name": "Marge Simpson",
            "username": "marge",
          },
        },
        {
          "body": "Marge Simpson's third public note",
          "id": 12,
          "owner": {
            "real_name": "Marge Simpson",
            "username": "marge",
          },
        },
        {
          "body": "Marge Simpson's first public note",
          "id": 10,
          "owner": {
            "real_name": "Marge Simpson",
            "username": "marge",
          },
        },
      ];

      Code.expect(JSON.parse(response.payload)).to.equal(expectedData);
      done();
    });
  });

  lab.experiment('Invalid Authorization header', () => {

    let response = null;

    lab.before(() => {

      const credentials = new Buffer('badUser:badPassword', 'utf8').toString('base64')

      const invalidAuth = {
        method: 'GET',
        url: '/feed/marge',
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

    lab.test('Status code should be 200 OK', (done) => {
      Code.expect(response.statusCode).to.equal(200);
      done();
    });

    lab.test('Content-Type should contain application/json', (done) => {
      Code.expect(response.headers['content-type']).to.contain('application/json');
      done();
    });

    lab.test('Body should match the noteCollectionRedacted schema', (done) => {
      Joi.assert(JSON.parse(response.payload), server.plugins.schemas.noteCollectionRedacted);
      done();
    });

    lab.test('Body should match expected data', (done) => {

      const expectedData = [
        {
          "body": "Marge Simpson's second public note",
          "id": 11,
          "owner": {
            "real_name": "Marge Simpson",
            "username": "marge",
          },
        },
        {
          "body": "Marge Simpson's third public note",
          "id": 12,
          "owner": {
            "real_name": "Marge Simpson",
            "username": "marge",
          },
        },
        {
          "body": "Marge Simpson's first public note",
          "id": 10,
          "owner": {
            "real_name": "Marge Simpson",
            "username": "marge",
          },
        },
      ];

      Code.expect(JSON.parse(response.payload)).to.equal(expectedData);
      done();
    });
  });

  lab.experiment('Malformed username', () => {

    let response = null;

    lab.before(() => {

      const credentials = new Buffer('homer:password', 'utf8').toString('base64')

      const malformedUsername = {
        method: 'GET',
        url: '/feed/!!!!!',
        headers: {
          'authorization': `Basic ${credentials}`,
        },
      };

      return helpers.resetDatabase(cfg)
        .then(() => {

          return server.inject(malformedUsername).then((res) => {
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
      Joi.assert(JSON.parse(response.payload), server.plugins.schemas.error400);
      done();
    });

    lab.test('Error message should be "username is malformed"', (done) => {
      Code.expect(JSON.parse(response.payload).message).to.equal('username is malformed');
      done();
    });
  });

  lab.experiment('Nonexistent username', () => {

    let response = null;

    lab.before(() => {

      const nonexistentUsername = {
        method: 'GET',
        url: '/feed/grimey',
      };

      return helpers.resetDatabase(cfg)
        .then(() => {

          return server.inject(nonexistentUsername).then((res) => {
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
      Joi.assert(JSON.parse(response.payload), server.plugins.schemas.error404);
      done();
    });

    lab.test('Error message should be "username does not exist"', (done) => {
      Code.expect(JSON.parse(response.payload).message).to.equal('username does not exist');
      done();
    });
  });

  lab.experiment('Valid Request', () => {

    let response = null;

    lab.before(() => {

      const credentials = new Buffer('homer:password', 'utf8').toString('base64')

      const validAuth = {
        method: 'GET',
        url: '/feed/marge',
        headers: {
          'authorization': `Basic ${credentials}`,
        },
      };

      return helpers.resetDatabase(cfg)
        .then(() => {

          return server.inject(validAuth).then((res) => {
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

    lab.test('Body should match the noteCollectionRedacted schema', (done) => {
      Joi.assert(JSON.parse(response.payload), server.plugins.schemas.noteCollectionRedacted);
      done();
    });

    lab.test('Body should match expected data', (done) => {

      const expectedData = [
        {
          "body": "Marge Simpson's first shared note",
          "id": 16,
          "owner": {
            "real_name": "Marge Simpson",
            "username": "marge",
          },
        },
        {
          "body": "Marge Simpson's second shared note",
          "id": 17,
          "owner": {
            "real_name": "Marge Simpson",
            "username": "marge",
          },
        },
        {
          "body": "Marge Simpson's third shared note",
          "id": 18,
          "owner": {
            "real_name": "Marge Simpson",
            "username": "marge",
          },
        },
        {
          "body": "Marge Simpson's fourth shared note",
          "id": 19,
          "owner": {
            "real_name": "Marge Simpson",
            "username": "marge",
          },
        },
        {
          "body": "Marge Simpson's second public note",
          "id": 11,
          "owner": {
            "real_name": "Marge Simpson",
            "username": "marge",
          },
        },
        {
          "body": "Marge Simpson's third public note",
          "id": 12,
          "owner": {
            "real_name": "Marge Simpson",
            "username": "marge",
          },
        },
        {
          "body": "Marge Simpson's first public note",
          "id": 10,
          "owner": {
            "real_name": "Marge Simpson",
            "username": "marge",
          },
        },
      ];

      Code.expect(JSON.parse(response.payload)).to.equal(expectedData);
      done();
    });
  });
});
