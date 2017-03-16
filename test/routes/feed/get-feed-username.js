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

lab.experiment('GET /feed/{username}', () => {

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
      url: '/feed/marge',
    };

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(config);
    });

    lab.test('Status code should be 200 OK', () => {

      return server.inject(noAuth).then((response) => {
        Code.expect(response.statusCode).to.equal(200);
      });
    });

    lab.test('Content-Type should contain application/json', () => {

      return server.inject(noAuth).then((response) => {
        Code.expect(response.headers['content-type']).to.contain('application/json');
      });
    });

    lab.test('Body should match the noteCollectionRedacted schema', () => {

      return server.inject(noAuth).then((response) => {
        Joi.assert(JSON.parse(response.payload), server.plugins.schemas.noteCollectionRedacted);
      });
    });

    lab.test('Body should match expected data', () => {

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

      return server.inject(noAuth).then((response) => {
        Code.expect(JSON.parse(response.payload)).to.equal(expectedData);
      });
    });
  });

  lab.experiment('Invalid Authorization header', () => {

    const credentials = new Buffer('badUser:badPassword', 'utf8').toString('base64')

    const invalidAuth = {
      method: 'GET',
      url: '/feed/marge',
      headers: {
        'authorization': `Basic ${credentials}`,
      },
    };

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(config);
    });

    lab.test('Status code should be 200 OK', () => {

      return server.inject(invalidAuth).then((response) => {
        Code.expect(response.statusCode).to.equal(200);
      });
    });

    lab.test('Content-Type should contain application/json', () => {

      return server.inject(invalidAuth).then((response) => {
        Code.expect(response.headers['content-type']).to.contain('application/json');
      });
    });

    lab.test('Body should match the noteCollectionRedacted schema', () => {

      return server.inject(invalidAuth).then((response) => {
        Joi.assert(JSON.parse(response.payload), server.plugins.schemas.noteCollectionRedacted);
      });
    });

    lab.test('Body should match expected data', () => {

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

      return server.inject(invalidAuth).then((response) => {
        Code.expect(JSON.parse(response.payload)).to.equal(expectedData);
      });
    });
  });

  lab.experiment('Malformed username', () => {

    const credentials = new Buffer('homer:password', 'utf8').toString('base64')

    const malformedUsername = {
      method: 'GET',
      url: '/feed/!!!!!',
      headers: {
        'authorization': `Basic ${credentials}`,
      },
    };

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(config);
    });

    lab.test('Status code should be 400 Bad Request', () => {

      return server.inject(malformedUsername).then((response) => {
        Code.expect(response.statusCode).to.equal(400);
      });
    });

    lab.test('Content-Type should contain application/json', () => {

      return server.inject(malformedUsername).then((response) => {
        Code.expect(response.headers['content-type']).to.contain('application/json');
      });
    });

    lab.test('Body should match the error400 schema', () => {

      return server.inject(malformedUsername).then((response) => {
        Joi.assert(JSON.parse(response.payload), server.plugins.schemas.error400);
      });
    });

    lab.test('Error message should be "username is malformed"', () => {

      return server.inject(malformedUsername).then((response) => {
        Code.expect(JSON.parse(response.payload).message).to.equal('username is malformed');
      });
    });
  });

  lab.experiment('Nonexistent username', () => {

    const nonexistentUsername = {
      method: 'GET',
      url: '/feed/grimey',
    };

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(config);
    });

    lab.test('Status code should be 404 Not Found', () => {

      return server.inject(nonexistentUsername).then((response) => {
        Code.expect(response.statusCode).to.equal(404);
      });
    });

    lab.test('Content-Type should contain application/json', () => {

      return server.inject(nonexistentUsername).then((response) => {
        Code.expect(response.headers['content-type']).to.contain('application/json');
      });
    });

    lab.test('Body should match the error404 schema', () => {

      return server.inject(nonexistentUsername).then((response) => {
        Joi.assert(JSON.parse(response.payload), server.plugins.schemas.error404);
      });
    });

    lab.test('Error message should be "username does not exist"', () => {

      return server.inject(nonexistentUsername).then((response) => {
        Code.expect(JSON.parse(response.payload).message).to.equal('username does not exist');
      });
    });
  });

  lab.experiment('Valid Request', () => {

    const credentials = new Buffer('homer:password', 'utf8').toString('base64')

    const validAuth = {
      method: 'GET',
      url: '/feed/marge',
      headers: {
        'authorization': `Basic ${credentials}`,
      },
    };

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(config);
    });

    lab.test('Status code should be 200 OK', () => {

      return server.inject(validAuth).then((response) => {
        Code.expect(response.statusCode).to.equal(200);
      });
    });

    lab.test('Content-Type should contain application/json', () => {

      return server.inject(validAuth).then((response) => {
        Code.expect(response.headers['content-type']).to.contain('application/json');
      });
    });

    lab.test('Body should match the noteCollectionRedacted schema', () => {

      return server.inject(validAuth).then((response) => {
        Joi.assert(JSON.parse(response.payload), server.plugins.schemas.noteCollectionRedacted);
      });
    });

    lab.test('Body should match expected data', () => {

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

      return server.inject(validAuth).then((response) => {
        Code.expect(JSON.parse(response.payload)).to.equal(expectedData);
      });
    });
  });
});
