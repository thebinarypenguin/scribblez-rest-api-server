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

lab.experiment('GET /groups', () => {

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
      url: '/groups',
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
        Joi.assert(JSON.parse(response.payload), server.plugins.schemas.error401);
      });
    });

    lab.test('Error message should be "Missing authentication"', () => {

      return server.inject(noAuth).then((response) => {
        Code.expect(JSON.parse(response.payload).message).to.equal('Missing authentication');
      });
    });
  });

  lab.experiment('Invalid Authorization header', () => {

    const credentials = new Buffer('badUser:badPassword', 'utf8').toString('base64')

    const invalidAuth = {
      method: 'GET',
      url: '/groups',
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
        Joi.assert(JSON.parse(response.payload), server.plugins.schemas.error401);
      });
    });

    lab.test('Error message should be "Bad username or password"', () => {

      return server.inject(invalidAuth).then((response) => {
        Code.expect(JSON.parse(response.payload).message).to.equal('Bad username or password');
      });
    });
  });

  lab.experiment('Valid Request', () => {

    const credentials = new Buffer('homer:password', 'utf8').toString('base64')

    const validAuth = {
      method: 'GET',
      url: '/groups',
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

    lab.test('Body should match the groupCollection schema', () => {

      return server.inject(validAuth).then((response) => {
        Joi.assert(JSON.parse(response.payload), server.plugins.schemas.groupCollection);
      });
    });

    lab.test('Body should match expected data', () => {

      const expectedData = [
        {
          "id": 1,
          "name": "Family",
          "members": [
            {
              "real_name": "Marge Simpson",
              "username": "marge",
            },
            {
              "real_name": "Bart Simpson",
              "username": "bart",
            },
            {
              "real_name": "Lisa Simpson",
              "username": "lisa",
            },
            {
              "real_name": "Maggie Simpson",
              "username": "maggie",
            },
          ],
        },
        {
          "id": 2,
          "name": "Friends",
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
        },
        {
          "id": 3,
          "name": "In-Laws",
          "members": [
            {
              "real_name": "Patty Bouvier",
              "username": "patty",
            },
            {
              "real_name": "Selma Bouvier",
              "username": "selma",
            },
          ],
        },
        {
          "id": 4,
          "name": "Stupid Flanders",
          "members": [
            {
              "real_name": "Ned Flanders",
              "username": "ned",
            },
          ],
        },
      ];

      return server.inject(validAuth).then((response) => {
        Code.expect(JSON.parse(response.payload)).to.equal(expectedData);
      });
    });
  });
});
