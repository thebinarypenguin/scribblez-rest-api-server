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

lab.experiment('GET /feed', () => {

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
      url: '/feed',
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
          "body": "Bart Simpson's first public note",
          "id": 20,
          "owner": {
            "real_name": "Bart Simpson",
            "username": "bart",
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
        {
          "body": "Homer Simpson's second public note",
          "id": 2,
          "owner": {
            "real_name": "Homer Simpson",
            "username": "homer",
          },
        },
        {
          "body": "Selma Bouvier's third public note",
          "id": 46,
          "owner": {
            "real_name": "Selma Bouvier",
            "username": "selma",
          },
        },
        {
          "body": "Bart Simpson's second public note",
          "id": 21,
          "owner": {
            "real_name": "Bart Simpson",
            "username": "bart",
          },
        },
        {
          "body": "Patty Bouvier's second public note",
          "id": 37,
          "owner": {
            "real_name": "Patty Bouvier",
            "username": "patty",
          },
        },
        {
          "body": "Patty Bouvier's third public note",
          "id": 38,
          "owner": {
            "real_name": "Patty Bouvier",
            "username": "patty",
          },
        },
        {
          "body": "Lisa Simpson's first public note",
          "id": 28,
          "owner": {
            "real_name": "Lisa Simpson",
            "username": "lisa",
          },
        },
        {
          "body": "Lisa Simpson's third public note",
          "id": 30,
          "owner": {
            "real_name": "Lisa Simpson",
            "username": "lisa",
          },
        },
        {
          "body": "Lisa Simpson's second public note",
          "id": 29,
          "owner": {
            "real_name": "Lisa Simpson",
            "username": "lisa",
          },
        },
        {
          "body": "Patty Bouvier's first public note",
          "id": 36,
          "owner": {
            "real_name": "Patty Bouvier",
            "username": "patty",
          },
        },
        {
          "body": "Selma Bouvier's first public note",
          "id": 44,
          "owner": {
            "real_name": "Selma Bouvier",
            "username": "selma",
          },
        },
        {
          "body": "Homer Simpson's first public note",
          "id": 1,
          "owner": {
            "real_name": "Homer Simpson",
            "username": "homer",
          },
        },
        {
          "body": "Bart Simpson's third public note",
          "id": 22,
          "owner": {
            "real_name": "Bart Simpson",
            "username": "bart",
          },
        },
        {
          "body": "Selma Bouvier's second public note",
          "id": 45,
          "owner": {
            "real_name": "Selma Bouvier",
            "username": "selma",
          },
        },
        {
          "body": "Homer Simpson's third public note",
          "id": 3,
          "owner": {
            "real_name": "Homer Simpson",
            "username": "homer",
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
      url: '/feed',
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
          "body": "Bart Simpson's first public note",
          "id": 20,
          "owner": {
            "real_name": "Bart Simpson",
            "username": "bart",
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
        {
          "body": "Homer Simpson's second public note",
          "id": 2,
          "owner": {
            "real_name": "Homer Simpson",
            "username": "homer",
          },
        },
        {
          "body": "Selma Bouvier's third public note",
          "id": 46,
          "owner": {
            "real_name": "Selma Bouvier",
            "username": "selma",
          },
        },
        {
          "body": "Bart Simpson's second public note",
          "id": 21,
          "owner": {
            "real_name": "Bart Simpson",
            "username": "bart",
          },
        },
        {
          "body": "Patty Bouvier's second public note",
          "id": 37,
          "owner": {
            "real_name": "Patty Bouvier",
            "username": "patty",
          },
        },
        {
          "body": "Patty Bouvier's third public note",
          "id": 38,
          "owner": {
            "real_name": "Patty Bouvier",
            "username": "patty",
          },
        },
        {
          "body": "Lisa Simpson's first public note",
          "id": 28,
          "owner": {
            "real_name": "Lisa Simpson",
            "username": "lisa",
          },
        },
        {
          "body": "Lisa Simpson's third public note",
          "id": 30,
          "owner": {
            "real_name": "Lisa Simpson",
            "username": "lisa",
          },
        },
        {
          "body": "Lisa Simpson's second public note",
          "id": 29,
          "owner": {
            "real_name": "Lisa Simpson",
            "username": "lisa",
          },
        },
        {
          "body": "Patty Bouvier's first public note",
          "id": 36,
          "owner": {
            "real_name": "Patty Bouvier",
            "username": "patty",
          },
        },
        {
          "body": "Selma Bouvier's first public note",
          "id": 44,
          "owner": {
            "real_name": "Selma Bouvier",
            "username": "selma",
          },
        },
        {
          "body": "Homer Simpson's first public note",
          "id": 1,
          "owner": {
            "real_name": "Homer Simpson",
            "username": "homer",
          },
        },
        {
          "body": "Bart Simpson's third public note",
          "id": 22,
          "owner": {
            "real_name": "Bart Simpson",
            "username": "bart",
          },
        },
        {
          "body": "Selma Bouvier's second public note",
          "id": 45,
          "owner": {
            "real_name": "Selma Bouvier",
            "username": "selma",
          },
        },
        {
          "body": "Homer Simpson's third public note",
          "id": 3,
          "owner": {
            "real_name": "Homer Simpson",
            "username": "homer",
          },
        },
      ];

      return server.inject(invalidAuth).then((response) => {
        Code.expect(JSON.parse(response.payload)).to.equal(expectedData);
      });
    });
  });

  lab.experiment('Valid Request', () => {

    const credentials = new Buffer('homer:password', 'utf8').toString('base64')

    const validAuth = {
      method: 'GET',
      url: '/feed',
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
          "body": "Bart Simpson's first shared note",
          "id": 26,
          "owner": {
            "real_name": "Bart Simpson",
            "username": "bart",
          },
        },
        {
          "body": "Bart Simpson's second shared note",
          "id": 27,
          "owner": {
            "real_name": "Bart Simpson",
            "username": "bart",
          },
        },
        {
          "body": "Lisa Simpson's first shared note",
          "id": 34,
          "owner": {
            "real_name": "Lisa Simpson",
            "username": "lisa",
          },
        },
        {
          "body": "Lisa Simpson's second shared note",
          "id": 35,
          "owner": {
            "real_name": "Lisa Simpson",
            "username": "lisa",
          },
        },
        {
          "body": "Patty Bouvier's first shared note",
          "id": 42,
          "owner": {
            "real_name": "Patty Bouvier",
            "username": "patty",
          },
        },
        {
          "body": "Patty Bouvier's second shared note",
          "id": 43,
          "owner": {
            "real_name": "Patty Bouvier",
            "username": "patty",
          },
        },
        {
          "body": "Selma Bouvier's first shared note",
          "id": 50,
          "owner": {
            "real_name": "Selma Bouvier",
            "username": "selma",
          },
        },
        {
          "body": "Selma Bouvier's second shared note",
          "id": 51,
          "owner": {
            "real_name": "Selma Bouvier",
            "username": "selma",
          },
        },
        {
          "body": "Bart Simpson's first public note",
          "id": 20,
          "owner": {
            "real_name": "Bart Simpson",
            "username": "bart",
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
        {
          "body": "Selma Bouvier's third public note",
          "id": 46,
          "owner": {
            "real_name": "Selma Bouvier",
            "username": "selma",
          },
        },
        {
          "body": "Bart Simpson's second public note",
          "id": 21,
          "owner": {
            "real_name": "Bart Simpson",
            "username": "bart",
          },
        },
        {
          "body": "Patty Bouvier's second public note",
          "id": 37,
          "owner": {
            "real_name": "Patty Bouvier",
            "username": "patty",
          },
        },
        {
          "body": "Patty Bouvier's third public note",
          "id": 38,
          "owner": {
            "real_name": "Patty Bouvier",
            "username": "patty",
          },
        },
        {
          "body": "Lisa Simpson's first public note",
          "id": 28,
          "owner": {
            "real_name": "Lisa Simpson",
            "username": "lisa",
          },
        },
        {
          "body": "Lisa Simpson's third public note",
          "id": 30,
          "owner": {
            "real_name": "Lisa Simpson",
            "username": "lisa",
          },
        },
        {
          "body": "Lisa Simpson's second public note",
          "id": 29,
          "owner": {
            "real_name": "Lisa Simpson",
            "username": "lisa",
          },
        },
        {
          "body": "Patty Bouvier's first public note",
          "id": 36,
          "owner": {
            "real_name": "Patty Bouvier",
            "username": "patty",
          },
        },
        {
          "body": "Selma Bouvier's first public note",
          "id": 44,
          "owner": {
            "real_name": "Selma Bouvier",
            "username": "selma",
          },
        },
        {
          "body": "Bart Simpson's third public note",
          "id": 22,
          "owner": {
            "real_name": "Bart Simpson",
            "username": "bart",
          },
        },
        {
          "body": "Selma Bouvier's second public note",
          "id": 45,
          "owner": {
            "real_name": "Selma Bouvier",
            "username": "selma",
          },
        },
      ];

      return server.inject(validAuth).then((response) => {
        Code.expect(JSON.parse(response.payload)).to.equal(expectedData);
      });
    });
  });
});
