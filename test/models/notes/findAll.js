'use strict';

const Code     = require('code');
const Joi      = require('joi');
const Lab      = require('lab');
const helpers  = require('../../_helpers');
const config   = require('../../../src/config');
const models   = require('../../../src/models');
const schemas  = require('../../../src/schemas');

const cfg = config.load('test');

const lab = exports.lab = Lab.script();

lab.experiment('models.notes.findAll(currentUser)', () => {

  let server = null;
  
  lab.before(() => {
    
    return helpers
      .checkDatabase(cfg)
      .then(() => {

        return helpers.initializeTestServer(cfg, [models, schemas])
      })
      .then((testServer) => {
        server = testServer;
      });
  });

  lab.after(() => {

    return helpers.emptyDatabase(cfg);
  });

  lab.experiment('Malformed currentUser', () => {

    lab.test('Should reject with a "malformed" error', () => {

      const malformedCurrentUser = 12345;

      return server.plugins.models.notes.findAll(malformedCurrentUser)
        .then(() => {
          throw new Error('Expected promise to reject');
        })
        .catch((err) => {
          Code.expect(err).to.be.an.error('currentUser is malformed');
        });
    });
  });

  lab.experiment('Nonexistent currentUser', () => {

    lab.test('Should reject with a "nonexistent" error', () => {

      const nonexistentCurrentUser = 'grimey';

      return server.plugins.models.notes.findAll(nonexistentCurrentUser)
        .then(() => {
          throw new Error('Expected promise to reject');
        })
        .catch((err) => {
          Code.expect(err).to.be.an.error('currentUser does not exist');
        });
    });
  });

  lab.experiment('Valid input', () => {

    const validCurrentUser = 'homer';

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(cfg);
    });

    lab.test('Should resolve with data that matches the noteCollection schema', () => {

      return server.plugins.models.notes.findAll(validCurrentUser)
        .then((data) => {
          Joi.assert(data, server.plugins.schemas.noteCollection);
        });
    });
    
    lab.test('Should resolve with data that matches the expected data', () => {

      const expectedData = [
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
          "body": "Homer Simpson's second public note",
          "id": 2,
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
      ];

      return server.plugins.models.notes.findAll(validCurrentUser)
        .then((data) => {
          data.sort((a, b) => { return a.id - b.id; });
          Code.expect(data).to.equal(expectedData);
        });
    });
    
    lab.test('Should not modify the database', () => {

      const func = server.plugins.models.notes.findAll.bind(this, validCurrentUser);

      return helpers.testDatabaseChanges(cfg, func)
        .then((data) => {
          Code.expect(data).be.undefined();
        });
      });
  });
});
