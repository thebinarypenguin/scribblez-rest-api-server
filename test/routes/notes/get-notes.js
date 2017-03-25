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

lab.experiment('GET /notes', () => {

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
        method: 'GET',
        url: '/notes',
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
        method: 'GET',
        url: '/notes',
        headers: {
          'authorization': `Basic ${credentials}`,
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

  lab.experiment('Valid Request', () => {

    let response = null;

    lab.before(() => {
      
      const credentials = new Buffer('homer:password', 'utf8').toString('base64')

      const validAuth = {
        method: 'GET',
        url: '/notes',
        headers: {
          'authorization': `Basic ${credentials}`,
        },
      };

      return helpers.resetDatabase(config)
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

    lab.test('Body should match the noteCollection schema', (done) => {
      Joi.assert(response.payload, server.plugins.schemas.noteCollection);
      done();
    });

    lab.test('Body should match expected data', (done) => {

      const expectedData = [
        {
          "body": "Homer Simpson's first shared note",
          "id": 7,
          "owner": {
            "real_name": "Homer Simpson",
            "username": "homer",
          },
          "visibility": {
            "groups": [
              {
                "id": 7,
                "members": [
                  {
                    "real_name": "Lenny Leonard",
                    "username": "lenny",
                  },
                  {
                    "real_name": "Carl Carlson",
                    "username": "carl",
                  },
                ],
                "name": "Friends",
              },
            ],
            "users": [
              {
                "real_name": "Lenny Leonard",
                "username": "lenny",
              },
            ],
          },
        },
        {
          "body": "Homer Simpson's second shared note",
          "id": 8,
          "owner": {
            "real_name": "Homer Simpson",
            "username": "homer",
          },
          "visibility": {
            "groups": [
              {
                "id": 8,
                "members": [
                  {
                    "real_name": "Lenny Leonard",
                    "username": "lenny",
                  },
                  {
                    "real_name": "Carl Carlson",
                    "username": "carl",
                  },
                ],
                "name": "Friends",
              },
            ],
            "users": [
              {
                "real_name": "Carl Carlson",
                "username": "carl",
              },
            ],
          },
        },
        {
          "body": "Homer Simpson's third shared note",
          "id": 9,
          "owner": {
            "real_name": "Homer Simpson",
            "username": "homer",
          },
          "visibility": {
            "groups": [
              {
                "id": 9,
                "members": [
                  {
                    "real_name": "Lenny Leonard",
                    "username": "lenny",
                  },
                  {
                    "real_name": "Carl Carlson",
                    "username": "carl",
                  },
                ],
                "name": "Friends",
              },
            ],
            "users": [
            ],
          },
        },
        {
          "body": "Homer Simpson's second public note",
          "id": 2,
          "owner": {
            "real_name": "Homer Simpson",
            "username": "homer",
          },
          "visibility": "public",
        },
        {
          "body": "Homer Simpson's second private note",
          "id": 5,
          "owner": {
            "real_name": "Homer Simpson",
            "username": "homer",
          },
          "visibility": "private",
        },
        {
          "body": "Homer Simpson's third private note",
          "id": 6,
          "owner": {
            "real_name": "Homer Simpson",
            "username": "homer",
          },
          "visibility": "private",
        },
        {
          "body": "Homer Simpson's first private note",
          "id": 4,
          "owner": {
            "real_name": "Homer Simpson",
            "username": "homer",
          },
          "visibility": "private",
        },
        {
          "body": "Homer Simpson's first public note",
          "id": 1,
          "owner": {
            "real_name": "Homer Simpson",
            "username": "homer",
          },
          "visibility": "public",
        },
        {
          "body": "Homer Simpson's third public note",
          "id": 3,
          "owner": {
            "real_name": "Homer Simpson",
            "username": "homer",
          },
          "visibility": "public",
        },
      ];

      Code.expect(JSON.parse(response.payload)).to.equal(expectedData);
      done();
    });
  });
});
