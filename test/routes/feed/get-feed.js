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
          "id": 46,
          "body": "Selma Bouvier's third public note",
          "owner": {
            "real_name": "Selma Bouvier",
            "username": "selma",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 45,
          "body": "Selma Bouvier's second public note",
          "owner": {
            "real_name": "Selma Bouvier",
            "username": "selma",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 44,
          "body": "Selma Bouvier's first public note",
          "owner": {
            "real_name": "Selma Bouvier",
            "username": "selma",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 38,
          "body": "Patty Bouvier's third public note",
          "owner": {
            "real_name": "Patty Bouvier",
            "username": "patty",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 37,
          "body": "Patty Bouvier's second public note",
          "owner": {
            "real_name": "Patty Bouvier",
            "username": "patty",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 36,
          "body": "Patty Bouvier's first public note",
          "owner": {
            "real_name": "Patty Bouvier",
            "username": "patty",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 30,
          "body": "Lisa Simpson's third public note",
          "owner": {
            "real_name": "Lisa Simpson",
            "username": "lisa",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 29,
          "body": "Lisa Simpson's second public note",
          "owner": {
            "real_name": "Lisa Simpson",
            "username": "lisa",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 28,
          "body": "Lisa Simpson's first public note",
          "owner": {
            "real_name": "Lisa Simpson",
            "username": "lisa",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 22,
          "body": "Bart Simpson's third public note",
          "owner": {
            "real_name": "Bart Simpson",
            "username": "bart",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 21,
          "body": "Bart Simpson's second public note",
          "owner": {
            "real_name": "Bart Simpson",
            "username": "bart",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 20,
          "body": "Bart Simpson's first public note",
          "owner": {
            "real_name": "Bart Simpson",
            "username": "bart",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 12,
          "body": "Marge Simpson's third public note",
          "owner": {
            "real_name": "Marge Simpson",
            "username": "marge",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 11,
          "body": "Marge Simpson's second public note",
          "owner": {
            "real_name": "Marge Simpson",
            "username": "marge",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 10,
          "body": "Marge Simpson's first public note",
          "owner": {
            "real_name": "Marge Simpson",
            "username": "marge",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 3,
          "body": "Homer Simpson's third public note",
          "owner": {
            "real_name": "Homer Simpson",
            "username": "homer",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 2,
          "body": "Homer Simpson's second public note",
          "owner": {
            "real_name": "Homer Simpson",
            "username": "homer",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 1,
          "body": "Homer Simpson's first public note",
          "owner": {
            "real_name": "Homer Simpson",
            "username": "homer",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
      ];

      const actualData = JSON.parse(response.payload);

      for (let i=0;i<expectedData.length;i++) {
        expectedData[i].created_at = actualData[i].created_at;
        expectedData[i].updated_at = actualData[i].updated_at;
      }

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
          "id": 46,
          "body": "Selma Bouvier's third public note",
          "owner": {
            "real_name": "Selma Bouvier",
            "username": "selma",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 45,
          "body": "Selma Bouvier's second public note",
          "owner": {
            "real_name": "Selma Bouvier",
            "username": "selma",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 44,
          "body": "Selma Bouvier's first public note",
          "owner": {
            "real_name": "Selma Bouvier",
            "username": "selma",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 38,
          "body": "Patty Bouvier's third public note",
          "owner": {
            "real_name": "Patty Bouvier",
            "username": "patty",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 37,
          "body": "Patty Bouvier's second public note",
          "owner": {
            "real_name": "Patty Bouvier",
            "username": "patty",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 36,
          "body": "Patty Bouvier's first public note",
          "owner": {
            "real_name": "Patty Bouvier",
            "username": "patty",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 30,
          "body": "Lisa Simpson's third public note",
          "owner": {
            "real_name": "Lisa Simpson",
            "username": "lisa",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 29,
          "body": "Lisa Simpson's second public note",
          "owner": {
            "real_name": "Lisa Simpson",
            "username": "lisa",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 28,
          "body": "Lisa Simpson's first public note",
          "owner": {
            "real_name": "Lisa Simpson",
            "username": "lisa",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 22,
          "body": "Bart Simpson's third public note",
          "owner": {
            "real_name": "Bart Simpson",
            "username": "bart",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 21,
          "body": "Bart Simpson's second public note",
          "owner": {
            "real_name": "Bart Simpson",
            "username": "bart",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 20,
          "body": "Bart Simpson's first public note",
          "owner": {
            "real_name": "Bart Simpson",
            "username": "bart",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 12,
          "body": "Marge Simpson's third public note",
          "owner": {
            "real_name": "Marge Simpson",
            "username": "marge",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 11,
          "body": "Marge Simpson's second public note",
          "owner": {
            "real_name": "Marge Simpson",
            "username": "marge",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 10,
          "body": "Marge Simpson's first public note",
          "owner": {
            "real_name": "Marge Simpson",
            "username": "marge",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 3,
          "body": "Homer Simpson's third public note",
          "owner": {
            "real_name": "Homer Simpson",
            "username": "homer",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 2,
          "body": "Homer Simpson's second public note",
          "owner": {
            "real_name": "Homer Simpson",
            "username": "homer",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 1,
          "body": "Homer Simpson's first public note",
          "owner": {
            "real_name": "Homer Simpson",
            "username": "homer",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
      ];

      const actualData = JSON.parse(response.payload);

      for (let i=0;i<expectedData.length;i++) {
        expectedData[i].created_at = actualData[i].created_at;
        expectedData[i].updated_at = actualData[i].updated_at;
      }

      Code.expect(actualData).to.equal(expectedData);
      done();
    });
  });

  lab.experiment('Valid Request (no query params)', () => {

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
          "id": 51,
          "body": "Selma Bouvier's second shared note",
          "owner": {
            "real_name": "Selma Bouvier",
            "username": "selma",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 50,
          "body": "Selma Bouvier's first shared note",
          "owner": {
            "real_name": "Selma Bouvier",
            "username": "selma",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 46,
          "body": "Selma Bouvier's third public note",
          "owner": {
            "real_name": "Selma Bouvier",
            "username": "selma",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 45,
          "body": "Selma Bouvier's second public note",
          "owner": {
            "real_name": "Selma Bouvier",
            "username": "selma",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 44,
          "body": "Selma Bouvier's first public note",
          "owner": {
            "real_name": "Selma Bouvier",
            "username": "selma",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 43,
          "body": "Patty Bouvier's second shared note",
          "owner": {
            "real_name": "Patty Bouvier",
            "username": "patty",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 42,
          "body": "Patty Bouvier's first shared note",
          "owner": {
            "real_name": "Patty Bouvier",
            "username": "patty",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 38,
          "body": "Patty Bouvier's third public note",
          "owner": {
            "real_name": "Patty Bouvier",
            "username": "patty",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 37,
          "body": "Patty Bouvier's second public note",
          "owner": {
            "real_name": "Patty Bouvier",
            "username": "patty",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 36,
          "body": "Patty Bouvier's first public note",
          "owner": {
            "real_name": "Patty Bouvier",
            "username": "patty",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 35,
          "body": "Lisa Simpson's second shared note",
          "owner": {
            "real_name": "Lisa Simpson",
            "username": "lisa",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 34,
          "body": "Lisa Simpson's first shared note",
          "owner": {
            "real_name": "Lisa Simpson",
            "username": "lisa",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 30,
          "body": "Lisa Simpson's third public note",
          "owner": {
            "real_name": "Lisa Simpson",
            "username": "lisa",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 29,
          "body": "Lisa Simpson's second public note",
          "owner": {
            "real_name": "Lisa Simpson",
            "username": "lisa",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 28,
          "body": "Lisa Simpson's first public note",
          "owner": {
            "real_name": "Lisa Simpson",
            "username": "lisa",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 27,
          "body": "Bart Simpson's second shared note",
          "owner": {
            "real_name": "Bart Simpson",
            "username": "bart",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 26,
          "body": "Bart Simpson's first shared note",
          "owner": {
            "real_name": "Bart Simpson",
            "username": "bart",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 22,
          "body": "Bart Simpson's third public note",
          "owner": {
            "real_name": "Bart Simpson",
            "username": "bart",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 21,
          "body": "Bart Simpson's second public note",
          "owner": {
            "real_name": "Bart Simpson",
            "username": "bart",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 20,
          "body": "Bart Simpson's first public note",
          "owner": {
            "real_name": "Bart Simpson",
            "username": "bart",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
      ];

      const actualData = JSON.parse(response.payload);

      for (let i=0;i<expectedData.length;i++) {
        expectedData[i].created_at = actualData[i].created_at;
        expectedData[i].updated_at = actualData[i].updated_at;
      }

      Code.expect(actualData).to.equal(expectedData);
      done();
    });
  });

  lab.experiment('Valid Request (with page query param)', () => {

    let response = null;

    lab.before(() => {

      const credentials = new Buffer('homer:password', 'utf8').toString('base64')

      // NOTE: I don't have enough sample data to let per_page be the default

      const validAuth = {
        method: 'GET',
        url: '/feed?page=2&per_page=3',
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
          "id": 45,
          "body": "Selma Bouvier's second public note",
          "owner": {
            "real_name": "Selma Bouvier",
            "username": "selma",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 44,
          "body": "Selma Bouvier's first public note",
          "owner": {
            "real_name": "Selma Bouvier",
            "username": "selma",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 43,
          "body": "Patty Bouvier's second shared note",
          "owner": {
            "real_name": "Patty Bouvier",
            "username": "patty",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
      ];

      const actualData = JSON.parse(response.payload);

      for (let i=0;i<expectedData.length;i++) {
        expectedData[i].created_at = actualData[i].created_at;
        expectedData[i].updated_at = actualData[i].updated_at;
      }

      Code.expect(actualData).to.equal(expectedData);
      done();
    });
  });

  lab.experiment('Valid Request (with per_page query params)', () => {

    let response = null;

    lab.before(() => {

      const credentials = new Buffer('homer:password', 'utf8').toString('base64')

      const validAuth = {
        method: 'GET',
        url: '/feed?per_page=2',
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
          "body": "Selma Bouvier's second shared note",
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "id": 51,
          "owner": {
            "real_name": "Selma Bouvier",
            "username": "selma",
          },
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "body": "Selma Bouvier's first shared note",
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "id": 50,
          "owner": {
            "real_name": "Selma Bouvier",
            "username": "selma",
          },
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
      ];

      const actualData = JSON.parse(response.payload);

      for (let i=0;i<expectedData.length;i++) {
        expectedData[i].created_at = actualData[i].created_at;
        expectedData[i].updated_at = actualData[i].updated_at;
      }

      Code.expect(actualData).to.equal(expectedData);
      done();
    });
  });

  lab.experiment('Valid Request (with visibility=public query param)', () => {

    let response = null;

    lab.before(() => {

      const credentials = new Buffer('homer:password', 'utf8').toString('base64')

      const validAuth = {
        method: 'GET',
        url: '/feed?visibility=public',
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
          "id": 46,
          "body": "Selma Bouvier's third public note",
          "owner": {
            "real_name": "Selma Bouvier",
            "username": "selma",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 45,
          "body": "Selma Bouvier's second public note",
          "owner": {
            "real_name": "Selma Bouvier",
            "username": "selma",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 44,
          "body": "Selma Bouvier's first public note",
          "owner": {
            "real_name": "Selma Bouvier",
            "username": "selma",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 38,
          "body": "Patty Bouvier's third public note",
          "owner": {
            "real_name": "Patty Bouvier",
            "username": "patty",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 37,
          "body": "Patty Bouvier's second public note",
          "owner": {
            "real_name": "Patty Bouvier",
            "username": "patty",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 36,
          "body": "Patty Bouvier's first public note",
          "owner": {
            "real_name": "Patty Bouvier",
            "username": "patty",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 30,
          "body": "Lisa Simpson's third public note",
          "owner": {
            "real_name": "Lisa Simpson",
            "username": "lisa",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 29,
          "body": "Lisa Simpson's second public note",
          "owner": {
            "real_name": "Lisa Simpson",
            "username": "lisa",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 28,
          "body": "Lisa Simpson's first public note",
          "owner": {
            "real_name": "Lisa Simpson",
            "username": "lisa",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 22,
          "body": "Bart Simpson's third public note",
          "owner": {
            "real_name": "Bart Simpson",
            "username": "bart",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 21,
          "body": "Bart Simpson's second public note",
          "owner": {
            "real_name": "Bart Simpson",
            "username": "bart",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 20,
          "body": "Bart Simpson's first public note",
          "owner": {
            "real_name": "Bart Simpson",
            "username": "bart",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 12,
          "body": "Marge Simpson's third public note",
          "owner": {
            "real_name": "Marge Simpson",
            "username": "marge",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 11,
          "body": "Marge Simpson's second public note",
          "owner": {
            "real_name": "Marge Simpson",
            "username": "marge",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 10,
          "body": "Marge Simpson's first public note",
          "owner": {
            "real_name": "Marge Simpson",
            "username": "marge",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 3,
          "body": "Homer Simpson's third public note",
          "owner": {
            "real_name": "Homer Simpson",
            "username": "homer",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 2,
          "body": "Homer Simpson's second public note",
          "owner": {
            "real_name": "Homer Simpson",
            "username": "homer",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 1,
          "body": "Homer Simpson's first public note",
          "owner": {
            "real_name": "Homer Simpson",
            "username": "homer",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
      ];

      const actualData = JSON.parse(response.payload);

      for (let i=0;i<expectedData.length;i++) {
        expectedData[i].created_at = actualData[i].created_at;
        expectedData[i].updated_at = actualData[i].updated_at;
      }

      Code.expect(actualData).to.equal(expectedData);
      done();
    });
  });

  lab.experiment('Valid Request (with visibility=shared query param)', () => {

    let response = null;

    lab.before(() => {

      const credentials = new Buffer('homer:password', 'utf8').toString('base64')

      const validAuth = {
        method: 'GET',
        url: '/feed?visibility=shared',
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
          "id": 51,
          "body": "Selma Bouvier's second shared note",
          "owner": {
            "real_name": "Selma Bouvier",
            "username": "selma",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 50,
          "body": "Selma Bouvier's first shared note",
          "owner": {
            "real_name": "Selma Bouvier",
            "username": "selma",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 43,
          "body": "Patty Bouvier's second shared note",
          "owner": {
            "real_name": "Patty Bouvier",
            "username": "patty",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 42,
          "body": "Patty Bouvier's first shared note",
          "owner": {
            "real_name": "Patty Bouvier",
            "username": "patty",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 35,
          "body": "Lisa Simpson's second shared note",
          "owner": {
            "real_name": "Lisa Simpson",
            "username": "lisa",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 34,
          "body": "Lisa Simpson's first shared note",
          "owner": {
            "real_name": "Lisa Simpson",
            "username": "lisa",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 27,
          "body": "Bart Simpson's second shared note",
          "owner": {
            "real_name": "Bart Simpson",
            "username": "bart",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 26,
          "body": "Bart Simpson's first shared note",
          "owner": {
            "real_name": "Bart Simpson",
            "username": "bart",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 19,
          "body": "Marge Simpson's fourth shared note",
          "owner": {
            "real_name": "Marge Simpson",
            "username": "marge",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 18,
          "body": "Marge Simpson's third shared note",
          "owner": {
            "real_name": "Marge Simpson",
            "username": "marge",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 17,
          "body": "Marge Simpson's second shared note",
          "owner": {
            "real_name": "Marge Simpson",
            "username": "marge",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "id": 16,
          "body": "Marge Simpson's first shared note",
          "owner": {
            "real_name": "Marge Simpson",
            "username": "marge",
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
      ];

      const actualData = JSON.parse(response.payload);

      for (let i=0;i<expectedData.length;i++) {
        expectedData[i].created_at = actualData[i].created_at;
        expectedData[i].updated_at = actualData[i].updated_at;
      }

      Code.expect(actualData).to.equal(expectedData);
      done();
    });
  });
});
