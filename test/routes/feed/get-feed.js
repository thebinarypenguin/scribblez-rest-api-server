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

lab.experiment('GET /feed', () => {

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
        url: '/feed',
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
          "body": "Bart Simpson's first public note",
          "id": 20,
          "owner": {
            "real_name": "Bart Simpson",
            "username": "bart",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "body": "Marge Simpson's second public note",
          "id": 11,
          "owner": {
            "real_name": "Marge Simpson",
            "username": "marge",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "body": "Marge Simpson's third public note",
          "id": 12,
          "owner": {
            "real_name": "Marge Simpson",
            "username": "marge",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "body": "Marge Simpson's first public note",
          "id": 10,
          "owner": {
            "real_name": "Marge Simpson",
            "username": "marge",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "body": "Homer Simpson's second public note",
          "id": 2,
          "owner": {
            "real_name": "Homer Simpson",
            "username": "homer",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "body": "Selma Bouvier's third public note",
          "id": 46,
          "owner": {
            "real_name": "Selma Bouvier",
            "username": "selma",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "body": "Bart Simpson's second public note",
          "id": 21,
          "owner": {
            "real_name": "Bart Simpson",
            "username": "bart",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "body": "Patty Bouvier's second public note",
          "id": 37,
          "owner": {
            "real_name": "Patty Bouvier",
            "username": "patty",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "body": "Patty Bouvier's third public note",
          "id": 38,
          "owner": {
            "real_name": "Patty Bouvier",
            "username": "patty",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "body": "Lisa Simpson's first public note",
          "id": 28,
          "owner": {
            "real_name": "Lisa Simpson",
            "username": "lisa",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "body": "Lisa Simpson's third public note",
          "id": 30,
          "owner": {
            "real_name": "Lisa Simpson",
            "username": "lisa",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "body": "Lisa Simpson's second public note",
          "id": 29,
          "owner": {
            "real_name": "Lisa Simpson",
            "username": "lisa",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "body": "Patty Bouvier's first public note",
          "id": 36,
          "owner": {
            "real_name": "Patty Bouvier",
            "username": "patty",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "body": "Selma Bouvier's first public note",
          "id": 44,
          "owner": {
            "real_name": "Selma Bouvier",
            "username": "selma",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "body": "Homer Simpson's first public note",
          "id": 1,
          "owner": {
            "real_name": "Homer Simpson",
            "username": "homer",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "body": "Bart Simpson's third public note",
          "id": 22,
          "owner": {
            "real_name": "Bart Simpson",
            "username": "bart",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "body": "Selma Bouvier's second public note",
          "id": 45,
          "owner": {
            "real_name": "Selma Bouvier",
            "username": "selma",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "body": "Homer Simpson's third public note",
          "id": 3,
          "owner": {
            "real_name": "Homer Simpson",
            "username": "homer",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
      ];

      const actualData = JSON.parse(response.payload);

      expectedData.forEach((note) => {
        note.created_at = actualData[0].created_at;
        note.updated_at = actualData[0].updated_at;
      });

      Code.expect(actualData).to.equal(expectedData);
      done();
    });
  });

  lab.experiment('Invalid Authorization header', () => {

    let response = null;

    lab.before(() => {

      const credentials = new Buffer('badUser:badPassword', 'utf8').toString('base64')

      const invalidAuth = {
        method: 'GET',
        url: '/feed',
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
          "body": "Bart Simpson's first public note",
          "id": 20,
          "owner": {
            "real_name": "Bart Simpson",
            "username": "bart",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "body": "Marge Simpson's second public note",
          "id": 11,
          "owner": {
            "real_name": "Marge Simpson",
            "username": "marge",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "body": "Marge Simpson's third public note",
          "id": 12,
          "owner": {
            "real_name": "Marge Simpson",
            "username": "marge",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "body": "Marge Simpson's first public note",
          "id": 10,
          "owner": {
            "real_name": "Marge Simpson",
            "username": "marge",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "body": "Homer Simpson's second public note",
          "id": 2,
          "owner": {
            "real_name": "Homer Simpson",
            "username": "homer",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "body": "Selma Bouvier's third public note",
          "id": 46,
          "owner": {
            "real_name": "Selma Bouvier",
            "username": "selma",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "body": "Bart Simpson's second public note",
          "id": 21,
          "owner": {
            "real_name": "Bart Simpson",
            "username": "bart",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "body": "Patty Bouvier's second public note",
          "id": 37,
          "owner": {
            "real_name": "Patty Bouvier",
            "username": "patty",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "body": "Patty Bouvier's third public note",
          "id": 38,
          "owner": {
            "real_name": "Patty Bouvier",
            "username": "patty",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "body": "Lisa Simpson's first public note",
          "id": 28,
          "owner": {
            "real_name": "Lisa Simpson",
            "username": "lisa",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "body": "Lisa Simpson's third public note",
          "id": 30,
          "owner": {
            "real_name": "Lisa Simpson",
            "username": "lisa",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "body": "Lisa Simpson's second public note",
          "id": 29,
          "owner": {
            "real_name": "Lisa Simpson",
            "username": "lisa",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "body": "Patty Bouvier's first public note",
          "id": 36,
          "owner": {
            "real_name": "Patty Bouvier",
            "username": "patty",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "body": "Selma Bouvier's first public note",
          "id": 44,
          "owner": {
            "real_name": "Selma Bouvier",
            "username": "selma",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "body": "Homer Simpson's first public note",
          "id": 1,
          "owner": {
            "real_name": "Homer Simpson",
            "username": "homer",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "body": "Bart Simpson's third public note",
          "id": 22,
          "owner": {
            "real_name": "Bart Simpson",
            "username": "bart",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "body": "Selma Bouvier's second public note",
          "id": 45,
          "owner": {
            "real_name": "Selma Bouvier",
            "username": "selma",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "body": "Homer Simpson's third public note",
          "id": 3,
          "owner": {
            "real_name": "Homer Simpson",
            "username": "homer",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
      ];

      const actualData = JSON.parse(response.payload);

      expectedData.forEach((note) => {
        note.created_at = actualData[0].created_at;
        note.updated_at = actualData[0].updated_at;
      });

      Code.expect(actualData).to.equal(expectedData);
      done();
    });
  });

  lab.experiment('Valid Request', () => {

    let response = null;

    lab.before(() => {

      const credentials = new Buffer('homer:password', 'utf8').toString('base64')

      const validAuth = {
        method: 'GET',
        url: '/feed',
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
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "body": "Marge Simpson's second shared note",
          "id": 17,
          "owner": {
            "real_name": "Marge Simpson",
            "username": "marge",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "body": "Marge Simpson's third shared note",
          "id": 18,
          "owner": {
            "real_name": "Marge Simpson",
            "username": "marge",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "body": "Marge Simpson's fourth shared note",
          "id": 19,
          "owner": {
            "real_name": "Marge Simpson",
            "username": "marge",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "body": "Bart Simpson's first shared note",
          "id": 26,
          "owner": {
            "real_name": "Bart Simpson",
            "username": "bart",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "body": "Bart Simpson's second shared note",
          "id": 27,
          "owner": {
            "real_name": "Bart Simpson",
            "username": "bart",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "body": "Lisa Simpson's first shared note",
          "id": 34,
          "owner": {
            "real_name": "Lisa Simpson",
            "username": "lisa",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "body": "Lisa Simpson's second shared note",
          "id": 35,
          "owner": {
            "real_name": "Lisa Simpson",
            "username": "lisa",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "body": "Patty Bouvier's first shared note",
          "id": 42,
          "owner": {
            "real_name": "Patty Bouvier",
            "username": "patty",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "body": "Patty Bouvier's second shared note",
          "id": 43,
          "owner": {
            "real_name": "Patty Bouvier",
            "username": "patty",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "body": "Selma Bouvier's first shared note",
          "id": 50,
          "owner": {
            "real_name": "Selma Bouvier",
            "username": "selma",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "body": "Selma Bouvier's second shared note",
          "id": 51,
          "owner": {
            "real_name": "Selma Bouvier",
            "username": "selma",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "body": "Bart Simpson's first public note",
          "id": 20,
          "owner": {
            "real_name": "Bart Simpson",
            "username": "bart",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "body": "Marge Simpson's second public note",
          "id": 11,
          "owner": {
            "real_name": "Marge Simpson",
            "username": "marge",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "body": "Marge Simpson's third public note",
          "id": 12,
          "owner": {
            "real_name": "Marge Simpson",
            "username": "marge",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "body": "Marge Simpson's first public note",
          "id": 10,
          "owner": {
            "real_name": "Marge Simpson",
            "username": "marge",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "body": "Selma Bouvier's third public note",
          "id": 46,
          "owner": {
            "real_name": "Selma Bouvier",
            "username": "selma",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "body": "Bart Simpson's second public note",
          "id": 21,
          "owner": {
            "real_name": "Bart Simpson",
            "username": "bart",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "body": "Patty Bouvier's second public note",
          "id": 37,
          "owner": {
            "real_name": "Patty Bouvier",
            "username": "patty",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "body": "Patty Bouvier's third public note",
          "id": 38,
          "owner": {
            "real_name": "Patty Bouvier",
            "username": "patty",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "body": "Lisa Simpson's first public note",
          "id": 28,
          "owner": {
            "real_name": "Lisa Simpson",
            "username": "lisa",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "body": "Lisa Simpson's third public note",
          "id": 30,
          "owner": {
            "real_name": "Lisa Simpson",
            "username": "lisa",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "body": "Lisa Simpson's second public note",
          "id": 29,
          "owner": {
            "real_name": "Lisa Simpson",
            "username": "lisa",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "body": "Patty Bouvier's first public note",
          "id": 36,
          "owner": {
            "real_name": "Patty Bouvier",
            "username": "patty",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "body": "Selma Bouvier's first public note",
          "id": 44,
          "owner": {
            "real_name": "Selma Bouvier",
            "username": "selma",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "body": "Bart Simpson's third public note",
          "id": 22,
          "owner": {
            "real_name": "Bart Simpson",
            "username": "bart",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "body": "Selma Bouvier's second public note",
          "id": 45,
          "owner": {
            "real_name": "Selma Bouvier",
            "username": "selma",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
      ];

      const actualData = JSON.parse(response.payload);

      expectedData.forEach((note) => {
        note.created_at = actualData[0].created_at;
        note.updated_at = actualData[0].updated_at;
      });

      Code.expect(actualData).to.equal(expectedData);
      done();
    });
  });
});
