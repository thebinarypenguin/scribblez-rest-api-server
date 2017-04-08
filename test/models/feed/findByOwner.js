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

lab.experiment('models.feed.findByOwner(owner, currentUser, options)', () => {

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
      
      return helpers.resetDatabase(cfg);
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

  lab.experiment('Malformed options', () => {

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(cfg);
    });

    lab.test('Should reject with a "malformed" error', () => {

      const validOwner       = 'marge';
      const validCurrentUser = 'homer';
      const malformedoptions = { page: 'all-of-them' };

      return server.plugins.models.feed.findByOwner(validOwner, validCurrentUser, malformedoptions)
        .then(() => {
          throw new Error('Expected promise to reject');
        })
        .catch((err) => {
          Code.expect(err).to.be.an.error('options is malformed');
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
      
      return helpers.resetDatabase(cfg);
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
      
      return helpers.resetDatabase(cfg);
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
      ];

      return server.plugins.models.feed.findByOwner(validOwner, validCurrentUser)
        .then((data) => {
          
          for (let i=0;i<expectedData.length;i++) {
            expectedData[i].created_at = data[i].created_at;
            expectedData[i].updated_at = data[i].updated_at;
          }

          Code.expect(data).to.equal(expectedData);
        });
    });
    
    lab.test('Should not modify the database', () => {

      const func = server.plugins.models.feed.findByOwner.bind(this, validOwner, validCurrentUser);

      return helpers.testDatabaseChanges(cfg, func)
        .then((data) => {
          Code.expect(data).be.undefined();
        });
    });
  });

  lab.experiment('Valid input (currentUser not specified)', () => {

    const validOwner = 'marge';

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(cfg);
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
      ];

      return server.plugins.models.feed.findByOwner(validOwner)
        .then((data) => {

          for (let i=0;i<expectedData.length;i++) {
            expectedData[i].created_at = data[i].created_at;
            expectedData[i].updated_at = data[i].updated_at;
          }

          Code.expect(data).to.equal(expectedData);
        });
    });
    
    lab.test('Should not modify the database', () => {

      const func = server.plugins.models.feed.findByOwner.bind(this, validOwner);

      return helpers.testDatabaseChanges(cfg, func)
        .then((data) => {
          Code.expect(data).be.undefined();
        });
    });
  });

  lab.experiment('Valid input (no options specified)', () => {

    const validOwner       = 'marge';
    const validCurrentUser = 'homer';

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(cfg);
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
      ];

      return server.plugins.models.feed.findByOwner(validOwner, validCurrentUser)
        .then((data) => {
          
          for (let i=0;i<expectedData.length;i++) {
            expectedData[i].created_at = data[i].created_at;
            expectedData[i].updated_at = data[i].updated_at;
          }

          Code.expect(data).to.equal(expectedData);
        });
    });
    
    lab.test('Should not modify the database', () => {

      const func = server.plugins.models.feed.findByOwner.bind(this, validOwner, validCurrentUser);

      return helpers.testDatabaseChanges(cfg, func)
        .then((data) => {
          Code.expect(data).be.undefined();
        });
    });
  });

  lab.experiment('Valid input (options.page specified)', () => {

    const validOwner       = 'marge';
    const validCurrentUser = 'homer';
    const options          = { page: 2, per_page: 3 };

    // NOTE: I don't have enough sample data to let per_page be the default

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(cfg);
    });

    lab.test('Should resolve with data that matches the noteCollectionRedacted schema', () => {

      return server.plugins.models.feed.findByOwner(validOwner, validCurrentUser, options)
        .then((data) => {
          Joi.assert(data, server.plugins.schemas.noteCollectionRedacted);
        });
    });
    
    lab.test('Should resolve with data that matches the expected data', () => {

      const expectedData = [
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
      ];

      return server.plugins.models.feed.findByOwner(validOwner, validCurrentUser, options)
        .then((data) => {
          
          for (let i=0;i<expectedData.length;i++) {
            expectedData[i].created_at = data[i].created_at;
            expectedData[i].updated_at = data[i].updated_at;
          }

          Code.expect(data).to.equal(expectedData);
        });
    });
    
    lab.test('Should not modify the database', () => {

      const func = server.plugins.models.feed.findByOwner.bind(this, validOwner, validCurrentUser, options);

      return helpers.testDatabaseChanges(cfg, func)
        .then((data) => {
          Code.expect(data).be.undefined();
        });
    });
  });

  lab.experiment('Valid input (options.per_page)', () => {

    const validOwner       = 'marge';
    const validCurrentUser = 'homer';
    const options          = { per_page: 3 };

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(cfg);
    });

    lab.test('Should resolve with data that matches the noteCollectionRedacted schema', () => {

      return server.plugins.models.feed.findByOwner(validOwner, validCurrentUser, options)
        .then((data) => {
          Joi.assert(data, server.plugins.schemas.noteCollectionRedacted);
        });
    });
    
    lab.test('Should resolve with data that matches the expected data', () => {

      const expectedData = [
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
      ];

      return server.plugins.models.feed.findByOwner(validOwner, validCurrentUser, options)
        .then((data) => {
          
          for (let i=0;i<expectedData.length;i++) {
            expectedData[i].created_at = data[i].created_at;
            expectedData[i].updated_at = data[i].updated_at;
          }

          Code.expect(data).to.equal(expectedData);
        });
    });
    
    lab.test('Should not modify the database', () => {

      const func = server.plugins.models.feed.findByOwner.bind(this, validOwner, validCurrentUser, options);

      return helpers.testDatabaseChanges(cfg, func)
        .then((data) => {
          Code.expect(data).be.undefined();
        });
    });
  });

  lab.experiment('Valid input (options.visibility = public)', () => {

    const validOwner       = 'marge';
    const validCurrentUser = 'homer';
    const options          = { visibility: 'public' };

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(cfg);
    });

    lab.test('Should resolve with data that matches the noteCollectionRedacted schema', () => {

      return server.plugins.models.feed.findByOwner(validOwner, validCurrentUser, options)
        .then((data) => {
          Joi.assert(data, server.plugins.schemas.noteCollectionRedacted);
        });
    });
    
    lab.test('Should resolve with data that matches the expected data', () => {

      const expectedData = [
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
      ];

      return server.plugins.models.feed.findByOwner(validOwner, validCurrentUser, options)
        .then((data) => {
          
          for (let i=0;i<expectedData.length;i++) {
            expectedData[i].created_at = data[i].created_at;
            expectedData[i].updated_at = data[i].updated_at;
          }

          Code.expect(data).to.equal(expectedData);
        });
    });
    
    lab.test('Should not modify the database', () => {

      const func = server.plugins.models.feed.findByOwner.bind(this, validOwner, validCurrentUser, options);

      return helpers.testDatabaseChanges(cfg, func)
        .then((data) => {
          Code.expect(data).be.undefined();
        });
    });
  });

  lab.experiment('Valid input (options.visibility = shared)', () => {

    const validOwner       = 'marge';
    const validCurrentUser = 'homer';
    const options          = { visibility: 'shared' };

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(cfg);
    });

    lab.test('Should resolve with data that matches the noteCollectionRedacted schema', () => {

      return server.plugins.models.feed.findByOwner(validOwner, validCurrentUser, options)
        .then((data) => {
          Joi.assert(data, server.plugins.schemas.noteCollectionRedacted);
        });
    });
    
    lab.test('Should resolve with data that matches the expected data', () => {

      const expectedData = [
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

      return server.plugins.models.feed.findByOwner(validOwner, validCurrentUser, options)
        .then((data) => {
          
          for (let i=0;i<expectedData.length;i++) {
            expectedData[i].created_at = data[i].created_at;
            expectedData[i].updated_at = data[i].updated_at;
          }

          Code.expect(data).to.equal(expectedData);
        });
    });
    
    lab.test('Should not modify the database', () => {

      const func = server.plugins.models.feed.findByOwner.bind(this, validOwner, validCurrentUser, options);

      return helpers.testDatabaseChanges(cfg, func)
        .then((data) => {
          Code.expect(data).be.undefined();
        });
    });
  });
});
