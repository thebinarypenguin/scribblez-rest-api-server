'use strict';

const Code     = require('code');
const Joi      = require('joi');
const Lab      = require('lab');
const helpers  = require('../../_helpers');
const config   = require('../../../src/config');
const models   = require('../../../src/models');
const schemas  = require('../../../src/schemas');

const lab = exports.lab = Lab.script();

lab.experiment('models.feed.findByOwner(owner, currentUser)', () => {

  let server = null;
  
  lab.before(() => {
    
    return helpers
      .checkDatabase(config)
      .then(() => {

        return helpers.initializeTestServer(config, [models, schemas])
      })
      .then((testServer) => {
        server = testServer;
      });
  });

  lab.after(() => {

    return helpers.emptyDatabase(config);
  });

  lab.experiment('Malformed owner', () => {

    lab.test('Should reject with a "malformed" error', () => {

      const malformedOwner   = 12345;
      const validCurrentUser = 'homer';

      return server.plugins.models.feed.findByOwner(malformedOwner, validCurrentUser)
        .then(() => {
          throw new Error('Expected promise to reject');
        })
        .catch((err) => {
          Code.expect(err).to.be.an.error('owner is malformed');
        });
    });
  });

  lab.experiment('Malformed currentUser', () => {

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(config);
    });

    lab.test('Should reject with a "malformed" error', () => {

      const validOwner           = 'homer';
      const malformedCurrentUser = 12345;

      return server.plugins.models.feed.findByOwner(validOwner, malformedCurrentUser)
        .then(() => {
          throw new Error('Expected promise to reject');
        })
        .catch((err) => {
          Code.expect(err).to.be.an.error('currentUser is malformed');
        });
    });
  });

  lab.experiment('Nonexistent owner', () => {

    lab.test('Should reject with a "nonexistent" error', () => {

      const nonexistentOwner = 'grimey';
      const validCurrentUser = 'homer';

      return server.plugins.models.feed.findByOwner(nonexistentOwner, validCurrentUser)
        .then(() => {
          throw new Error('Expected promise to reject');
        })
        .catch((err) => {
          Code.expect(err).to.be.an.error('owner does not exist');
        });
    });
  });

  lab.experiment('Nonexistent currentUser', () => {

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(config);
    });

    lab.test('Should reject with a "nonexistent" error', () => {

      const validOwner             = 'homer';
      const nonexistentCurrentUser = 'grimey';

      return server.plugins.models.feed.findByOwner(validOwner, nonexistentCurrentUser)
        .then(() => {
          throw new Error('Expected promise to reject');
        })
        .catch((err) => {
          Code.expect(err).to.be.an.error('currentUser does not exist');
        });
    });
  });

  lab.experiment('Valid input (currentUser specified)', () => {

    const validOwner       = 'marge';
    const validCurrentUser = 'homer';

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(config);
    });

    lab.test('Should resolve with data that matches the noteCollectionRedacted schema', () => {

      return server.plugins.models.feed.findByOwner(validOwner, validCurrentUser)
        .then((data) => {
          Joi.assert(data, server.plugins.schemas.noteCollectionRedacted);
        });
    });
    
    lab.test('Should resolve with data that matches the expected data', () => {

      const expectedData = [
        {
          "body": "Marge Simpson's first public note",
          "id": 10,
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
      ];

      return server.plugins.models.feed.findByOwner(validOwner, validCurrentUser)
        .then((data) => {
          data.sort((a,b) => { return a.id - b.id; });
          Code.expect(data).to.equal(expectedData);
        });
    });
    
    lab.test('Should not modify the database', () => {

      const func = server.plugins.models.feed.findByOwner.bind(this, validOwner, validCurrentUser);

      return helpers.testDatabaseChanges(config, func)
        .then((data) => {
          Code.expect(data).be.undefined();
        });
      });
  });

  lab.experiment('Valid input (currentUser not specified)', () => {

    const validOwner = 'marge';

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(config);
    });

    lab.test('Should resolve with data that matches the noteCollectionRedacted schema', () => {

      return server.plugins.models.feed.findByOwner(validOwner)
        .then((data) => {
          Joi.assert(data, server.plugins.schemas.noteCollectionRedacted);
        });
    });
    
    lab.test('Should resolve with data that matches the expected data', () => {

      const expectedData = [
        {
          "body": "Marge Simpson's first public note",
          "id": 10,
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
      ];

      return server.plugins.models.feed.findByOwner(validOwner)
        .then((data) => {
          data.sort((a,b) => { return a.id - b.id; });
          Code.expect(data).to.equal(expectedData);
        });
    });
    
    lab.test('Should not modify the database', () => {

      const func = server.plugins.models.feed.findByOwner.bind(this, validOwner);

      return helpers.testDatabaseChanges(config, func)
        .then((data) => {
          Code.expect(data).be.undefined();
        });
      });
  });
});
