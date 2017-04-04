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

lab.experiment('models.feed.findShared(currentUser)', () => {

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

      return server.plugins.models.feed.findShared(malformedCurrentUser)
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

      return server.plugins.models.feed.findShared(nonexistentCurrentUser)
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

    lab.test('Should resolve with data that matches the noteCollectionRedacted schema', () => {

      return server.plugins.models.feed.findShared(validCurrentUser)
        .then((data) => {
          Joi.assert(data, server.plugins.schemas.noteCollectionRedacted);
        });
    });
    
    lab.test('Should resolve with data that matches the expected data', () => {

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
      ];

      return server.plugins.models.feed.findShared(validCurrentUser)
        .then((data) => {

          data.sort((a,b) => { return a.id - b.id; });
          
          expectedData.forEach((note) => {
            note.created_at = data[0].created_at;
            note.updated_at = data[0].updated_at;
          });

          Code.expect(data).to.equal(expectedData);
        });
    });
    
    lab.test('Should not modify the database', () => {

      const func = server.plugins.models.feed.findShared.bind(this, validCurrentUser);

      return helpers.testDatabaseChanges(cfg, func)
        .then((data) => {
          Code.expect(data).be.undefined();
        });
    });
  });
});
