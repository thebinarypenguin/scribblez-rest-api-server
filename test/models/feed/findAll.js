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

lab.experiment('models.feed.findAll(currentUser, options)', () => {

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

      return server.plugins.models.feed.findAll(malformedCurrentUser)
        .then(() => {
          throw new Error('Expected promise to reject');
        })
        .catch((err) => {
          Code.expect(err).to.be.an.error('currentUser is malformed');
        });
    });
  });

  lab.experiment('Malformed options', () => {

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(cfg);
    });

    lab.test('Should reject with a "malformed" error', () => {

      const validCurrentUser = 'homer';
      const malformedOptions = { page: 'all-of-them' };

      return server.plugins.models.feed.findAll(validCurrentUser, malformedOptions)
        .then(() => {
          throw new Error('Expected promise to reject');
        })
        .catch((err) => {
          Code.expect(err).to.be.an.error('options is malformed');
        });
    });
  });

  lab.experiment('Nonexistent currentUser', () => {

    lab.test('Should reject with a "nonexistent" error', () => {

      const nonexistentCurrentUser = 'grimey';

      return server.plugins.models.feed.findAll(nonexistentCurrentUser)
        .then(() => {
          throw new Error('Expected promise to reject');
        })
        .catch((err) => {
          Code.expect(err).to.be.an.error('currentUser does not exist');
        });
    });
  });

  lab.experiment('Valid input (currentUser specified)', () => {

    const validCurrentUser = 'homer';

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(cfg);
    });

    lab.test('Should resolve with data that matches the noteCollectionRedacted schema', () => {

      return server.plugins.models.feed.findAll(validCurrentUser)
        .then((data) => {
          Joi.assert(data, server.plugins.schemas.noteCollectionRedacted);
        });
    });
    
    lab.test('Should resolve with data that matches the expected data', () => {

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

      return server.plugins.models.feed.findAll(validCurrentUser)
        .then((data) => {

          for (let i=0;i<expectedData.length;i++) {
            expectedData[i].created_at = data[i].created_at;
            expectedData[i].updated_at = data[i].updated_at;
          }

          Code.expect(data).to.equal(expectedData);
        });
    });
    
    lab.test('Should not modify the database', () => {

      const func = server.plugins.models.feed.findAll.bind(this, validCurrentUser);

      return helpers.testDatabaseChanges(cfg, func)
        .then((data) => {
          Code.expect(data).be.undefined();
        });
    });
  });

  lab.experiment('Valid input (currentUser not specified)', () => {

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(cfg);
    });

    lab.test('Should resolve with data that matches the noteCollectionRedacted schema', () => {

      return server.plugins.models.feed.findAll()
        .then((data) => {
          Joi.assert(data, server.plugins.schemas.noteCollectionRedacted);
        });
    });
    
    lab.test('Should resolve with data that matches the expected data', () => {

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

      return server.plugins.models.feed.findAll()
        .then((data) => {

          for (let i=0;i<expectedData.length;i++) {
            expectedData[i].created_at = data[i].created_at;
            expectedData[i].updated_at = data[i].updated_at;
          }

          Code.expect(data).to.equal(expectedData);
        });
    });
    
    lab.test('Should not modify the database', () => {

      const func = server.plugins.models.feed.findAll.bind(this);

      return helpers.testDatabaseChanges(cfg, func)
        .then((data) => {
          Code.expect(data).be.undefined();
        });
    });
  });

  lab.experiment('Valid input (no options specified)', () => {

    const validCurrentUser = 'homer';

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(cfg);
    });

    lab.test('Should resolve with data that matches the noteCollectionRedacted schema', () => {

      return server.plugins.models.feed.findAll(validCurrentUser)
        .then((data) => {
          Joi.assert(data, server.plugins.schemas.noteCollectionRedacted);
        });
    });
    
    lab.test('Should resolve with data that matches the expected data', () => {

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

      return server.plugins.models.feed.findAll(validCurrentUser)
        .then((data) => {

          for (let i=0;i<expectedData.length;i++) {
            expectedData[i].created_at = data[i].created_at;
            expectedData[i].updated_at = data[i].updated_at;
          }

          Code.expect(data).to.equal(expectedData);
        });
    });
    
    lab.test('Should not modify the database', () => {

      const func = server.plugins.models.feed.findAll.bind(this, validCurrentUser);

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

    lab.test('Should resolve with data that matches the noteCollectionRedacted schema', () => {

      return server.plugins.models.feed.findAll(validCurrentUser, options)
        .then((data) => {
          Joi.assert(data, server.plugins.schemas.noteCollectionRedacted);
        });
    });
    
    lab.test('Should resolve with data that matches the expected data', () => {

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

      return server.plugins.models.feed.findAll(validCurrentUser, options)
        .then((data) => {

          for (let i=0;i<expectedData.length;i++) {
            expectedData[i].created_at = data[i].created_at;
            expectedData[i].updated_at = data[i].updated_at;
          }

          Code.expect(data).to.equal(expectedData);
        });
    });
    
    lab.test('Should not modify the database', () => {

      const func = server.plugins.models.feed.findAll.bind(this, validCurrentUser, options);

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

    lab.test('Should resolve with data that matches the noteCollectionRedacted schema', () => {

      return server.plugins.models.feed.findAll(validCurrentUser, options)
        .then((data) => {
          Joi.assert(data, server.plugins.schemas.noteCollectionRedacted);
        });
    });
    
    lab.test('Should resolve with data that matches the expected data', () => {

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
      ];

      return server.plugins.models.feed.findAll(validCurrentUser, options)
        .then((data) => {

          for (let i=0;i<expectedData.length;i++) {
            expectedData[i].created_at = data[i].created_at;
            expectedData[i].updated_at = data[i].updated_at;
          }

          Code.expect(data).to.equal(expectedData);
        });
    });
    
    lab.test('Should not modify the database', () => {

      const func = server.plugins.models.feed.findAll.bind(this, validCurrentUser, options);

      return helpers.testDatabaseChanges(cfg, func)
        .then((data) => {
          Code.expect(data).be.undefined();
        });
    });
  });

  lab.experiment('Valid input (options.visibility = public)', () => {

    const validCurrentUser = 'homer';
    const options          = { visibility: 'public' };

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(cfg);
    });

    lab.test('Should resolve with data that matches the noteCollectionRedacted schema', () => {

      return server.plugins.models.feed.findAll(validCurrentUser, options)
        .then((data) => {
          Joi.assert(data, server.plugins.schemas.noteCollectionRedacted);
        });
    });
    
    lab.test('Should resolve with data that matches the expected data', () => {

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

      return server.plugins.models.feed.findAll(validCurrentUser, options)
        .then((data) => {

          for (let i=0;i<expectedData.length;i++) {
            expectedData[i].created_at = data[i].created_at;
            expectedData[i].updated_at = data[i].updated_at;
          }

          Code.expect(data).to.equal(expectedData);
        });
    });
    
    lab.test('Should not modify the database', () => {

      const func = server.plugins.models.feed.findAll.bind(this, validCurrentUser, options);

      return helpers.testDatabaseChanges(cfg, func)
        .then((data) => {
          Code.expect(data).be.undefined();
        });
    });
  });

  lab.experiment('Valid input (options.visibility = shared)', () => {

    const validCurrentUser = 'homer';
    const options          = { visibility: 'shared' };

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(cfg);
    });

    lab.test('Should resolve with data that matches the noteCollectionRedacted schema', () => {

      return server.plugins.models.feed.findAll(validCurrentUser, options)
        .then((data) => {
          Joi.assert(data, server.plugins.schemas.noteCollectionRedacted);
        });
    });
    
    lab.test('Should resolve with data that matches the expected data', () => {

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

      return server.plugins.models.feed.findAll(validCurrentUser, options)
        .then((data) => {

          for (let i=0;i<expectedData.length;i++) {
            expectedData[i].created_at = data[i].created_at;
            expectedData[i].updated_at = data[i].updated_at;
          }

          Code.expect(data).to.equal(expectedData);
        });
    });
    
    lab.test('Should not modify the database', () => {

      const func = server.plugins.models.feed.findAll.bind(this, validCurrentUser, options);

      return helpers.testDatabaseChanges(cfg, func)
        .then((data) => {
          Code.expect(data).be.undefined();
        });
    });
  });
});
