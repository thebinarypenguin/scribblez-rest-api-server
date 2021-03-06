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

  lab.experiment('Valid input (no options specified)', () => {

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
          "visibility": "public",
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
          "visibility": "public",
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "body": "Homer Simpson's first private note",
          "id": 4,
          "owner": {
            "real_name": "Homer Simpson",
            "username": "homer",
          },
          "visibility": "private",
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "body": "Homer Simpson's second private note",
          "id": 5,
          "owner": {
            "real_name": "Homer Simpson",
            "username": "homer",
          },
          "visibility": "private",
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "body": "Homer Simpson's third private note",
          "id": 6,
          "owner": {
            "real_name": "Homer Simpson",
            "username": "homer",
          },
          "visibility": "private",
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
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
                    "real_name": "Carl Carlson",
                    "username": "carl",
                  },
                  {
                    "real_name": "Lenny Leonard",
                    "username": "lenny",
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
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
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
                    "real_name": "Carl Carlson",
                    "username": "carl",
                  },
                  {
                    "real_name": "Lenny Leonard",
                    "username": "lenny",
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
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
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
                    "real_name": "Carl Carlson",
                    "username": "carl",
                  },
                  {
                    "real_name": "Lenny Leonard",
                    "username": "lenny",
                  },
                ],
                "name": "Friends",
              },
            ],
            "users": [
            ],
          },
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
      ];

      return server.plugins.models.notes.findAll(validCurrentUser)
        .then((data) => {

          for (let i=0;i<expectedData.length;i++) {
            expectedData[i].created_at = data[i].created_at;
            expectedData[i].updated_at = data[i].updated_at;
          }

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

  lab.experiment('Valid input (options.page specified)', () => {

    const validCurrentUser = 'homer';
    const options          = { page: 2, per_page: 3 };  

    // NOTE: I don't have enough sample data to let per_page be the default

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(cfg);
    });

    lab.test('Should resolve with data that matches the noteCollection schema', () => {

      return server.plugins.models.notes.findAll(validCurrentUser, options)
        .then((data) => {
          Joi.assert(data, server.plugins.schemas.noteCollection);
        });
    });
    
    lab.test('Should resolve with data that matches the expected data', () => {

      const expectedData = [
        {
          "body": "Homer Simpson's first private note",
          "id": 4,
          "owner": {
            "real_name": "Homer Simpson",
            "username": "homer",
          },
          "visibility": "private",
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "body": "Homer Simpson's second private note",
          "id": 5,
          "owner": {
            "real_name": "Homer Simpson",
            "username": "homer",
          },
          "visibility": "private",
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
        {
          "body": "Homer Simpson's third private note",
          "id": 6,
          "owner": {
            "real_name": "Homer Simpson",
            "username": "homer",
          },
          "visibility": "private",
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
      ];

      return server.plugins.models.notes.findAll(validCurrentUser, options)
        .then((data) => {

          for (let i=0;i<expectedData.length;i++) {
            expectedData[i].created_at = data[i].created_at;
            expectedData[i].updated_at = data[i].updated_at;
          }

          Code.expect(data).to.equal(expectedData);
        });
    });
    
    lab.test('Should not modify the database', () => {

      const func = server.plugins.models.notes.findAll.bind(this, validCurrentUser, options);

      return helpers.testDatabaseChanges(cfg, func)
        .then((data) => {
          Code.expect(data).be.undefined();
        });
    });
  });

  lab.experiment('Valid input (options.per_page specified)', () => {

    const validCurrentUser = 'homer';
    const options          = { per_page: 2 };

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(cfg);
    });

    lab.test('Should resolve with data that matches the noteCollection schema', () => {

      return server.plugins.models.notes.findAll(validCurrentUser, options)
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
          "visibility": "public",
          "created_at": "CANNOT BE RELIABLY PREDICTED",
          "updated_at": "CANNOT BE RELIABLY PREDICTED",
        },
      ];

      return server.plugins.models.notes.findAll(validCurrentUser, options)
        .then((data) => {

          for (let i=0;i<expectedData.length;i++) {
            expectedData[i].created_at = data[i].created_at;
            expectedData[i].updated_at = data[i].updated_at;
          }

          Code.expect(data).to.equal(expectedData);
        });
    });
    
    lab.test('Should not modify the database', () => {

      const func = server.plugins.models.notes.findAll.bind(this, validCurrentUser, options);

      return helpers.testDatabaseChanges(cfg, func)
        .then((data) => {
          Code.expect(data).be.undefined();
        });
    });
  });
});
