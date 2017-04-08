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
          "created_at": "2017-04-07T15:20:07Z",
          "updated_at": "2017-04-07T15:20:07Z",
        },
        {
          "id": 50,
          "body": "Selma Bouvier's first shared note",
          "owner": {
            "real_name": "Selma Bouvier",
            "username": "selma",
          },
          "created_at": "2017-04-07T15:20:06Z",
          "updated_at": "2017-04-07T15:20:06Z",
        },
        {
          "id": 46,
          "body": "Selma Bouvier's third public note",
          "owner": {
            "real_name": "Selma Bouvier",
            "username": "selma",
          },
          "created_at": "2017-04-07T15:20:02Z",
          "updated_at": "2017-04-07T15:20:02Z",
        },
        {
          "id": 45,
          "body": "Selma Bouvier's second public note",
          "owner": {
            "real_name": "Selma Bouvier",
            "username": "selma",
          },
          "created_at": "2017-04-07T15:20:01Z",
          "updated_at": "2017-04-07T15:20:01Z",
        },
        {
          "id": 44,
          "body": "Selma Bouvier's first public note",
          "owner": {
            "real_name": "Selma Bouvier",
            "username": "selma",
          },
          "created_at": "2017-04-07T15:20:00Z",
          "updated_at": "2017-04-07T15:20:00Z",
        },
        {
          "id": 43,
          "body": "Patty Bouvier's second shared note",
          "owner": {
            "real_name": "Patty Bouvier",
            "username": "patty",
          },
          "created_at": "2017-04-07T15:19:59Z",
          "updated_at": "2017-04-07T15:19:59Z",
        },
        {
          "id": 42,
          "body": "Patty Bouvier's first shared note",
          "owner": {
            "real_name": "Patty Bouvier",
            "username": "patty",
          },
          "created_at": "2017-04-07T15:19:58Z",
          "updated_at": "2017-04-07T15:19:58Z",
        },
        {
          "id": 38,
          "body": "Patty Bouvier's third public note",
          "owner": {
            "real_name": "Patty Bouvier",
            "username": "patty",
          },
          "created_at": "2017-04-07T15:19:54Z",
          "updated_at": "2017-04-07T15:19:54Z",
        },
        {
          "id": 37,
          "body": "Patty Bouvier's second public note",
          "owner": {
            "real_name": "Patty Bouvier",
            "username": "patty",
          },
          "created_at": "2017-04-07T15:19:53Z",
          "updated_at": "2017-04-07T15:19:53Z",
        },
        {
          "id": 36,
          "body": "Patty Bouvier's first public note",
          "owner": {
            "real_name": "Patty Bouvier",
            "username": "patty",
          },
          "created_at": "2017-04-07T15:19:52Z",
          "updated_at": "2017-04-07T15:19:52Z",
        },
        {
          "id": 35,
          "body": "Lisa Simpson's second shared note",
          "owner": {
            "real_name": "Lisa Simpson",
            "username": "lisa",
          },
          "created_at": "2017-04-07T15:19:51Z",
          "updated_at": "2017-04-07T15:19:51Z",
        },
        {
          "id": 34,
          "body": "Lisa Simpson's first shared note",
          "owner": {
            "real_name": "Lisa Simpson",
            "username": "lisa",
          },
          "created_at": "2017-04-07T15:19:50Z",
          "updated_at": "2017-04-07T15:19:50Z",
        },
        {
          "id": 30,
          "body": "Lisa Simpson's third public note",
          "owner": {
            "real_name": "Lisa Simpson",
            "username": "lisa",
          },
          "created_at": "2017-04-07T15:19:46Z",
          "updated_at": "2017-04-07T15:19:46Z",
        },
        {
          "id": 29,
          "body": "Lisa Simpson's second public note",
          "owner": {
            "real_name": "Lisa Simpson",
            "username": "lisa",
          },
          "created_at": "2017-04-07T15:19:45Z",
          "updated_at": "2017-04-07T15:19:45Z",
        },
        {
          "id": 28,
          "body": "Lisa Simpson's first public note",
          "owner": {
            "real_name": "Lisa Simpson",
            "username": "lisa",
          },
          "created_at": "2017-04-07T15:19:44Z",
          "updated_at": "2017-04-07T15:19:44Z",
        },
        {
          "id": 27,
          "body": "Bart Simpson's second shared note",
          "owner": {
            "real_name": "Bart Simpson",
            "username": "bart",
          },
          "created_at": "2017-04-07T15:19:43Z",
          "updated_at": "2017-04-07T15:19:43Z",
        },
        {
          "id": 26,
          "body": "Bart Simpson's first shared note",
          "owner": {
            "real_name": "Bart Simpson",
            "username": "bart",
          },
          "created_at": "2017-04-07T15:19:42Z",
          "updated_at": "2017-04-07T15:19:42Z",
        },
        {
          "id": 22,
          "body": "Bart Simpson's third public note",
          "owner": {
            "real_name": "Bart Simpson",
            "username": "bart",
          },
          "created_at": "2017-04-07T15:19:38Z",
          "updated_at": "2017-04-07T15:19:38Z",
        },
        {
          "id": 21,
          "body": "Bart Simpson's second public note",
          "owner": {
            "real_name": "Bart Simpson",
            "username": "bart",
          },
          "created_at": "2017-04-07T15:19:37Z",
          "updated_at": "2017-04-07T15:19:37Z",
        },
        {
          "id": 20,
          "body": "Bart Simpson's first public note",
          "owner": {
            "real_name": "Bart Simpson",
            "username": "bart",
          },
          "created_at": "2017-04-07T15:19:36Z",
          "updated_at": "2017-04-07T15:19:36Z",
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
          "created_at": "2017-04-07T15:46:35Z",
          "updated_at": "2017-04-07T15:46:35Z",
        },
        {
          "id": 45,
          "body": "Selma Bouvier's second public note",
          "owner": {
            "real_name": "Selma Bouvier",
            "username": "selma",
          },
          "created_at": "2017-04-07T15:46:34Z",
          "updated_at": "2017-04-07T15:46:34Z",
        },
        {
          "id": 44,
          "body": "Selma Bouvier's first public note",
          "owner": {
            "real_name": "Selma Bouvier",
            "username": "selma",
          },
          "created_at": "2017-04-07T15:46:33Z",
          "updated_at": "2017-04-07T15:46:33Z",
        },
        {
          "id": 38,
          "body": "Patty Bouvier's third public note",
          "owner": {
            "real_name": "Patty Bouvier",
            "username": "patty",
          },
          "created_at": "2017-04-07T15:46:27Z",
          "updated_at": "2017-04-07T15:46:27Z",
        },
        {
          "id": 37,
          "body": "Patty Bouvier's second public note",
          "owner": {
            "real_name": "Patty Bouvier",
            "username": "patty",
          },
          "created_at": "2017-04-07T15:46:26Z",
          "updated_at": "2017-04-07T15:46:26Z",
        },
        {
          "id": 36,
          "body": "Patty Bouvier's first public note",
          "owner": {
            "real_name": "Patty Bouvier",
            "username": "patty",
          },
          "created_at": "2017-04-07T15:46:25Z",
          "updated_at": "2017-04-07T15:46:25Z",
        },
        {
          "id": 30,
          "body": "Lisa Simpson's third public note",
          "owner": {
            "real_name": "Lisa Simpson",
            "username": "lisa",
          },
          "created_at": "2017-04-07T15:46:19Z",
          "updated_at": "2017-04-07T15:46:19Z",
        },
        {
          "id": 29,
          "body": "Lisa Simpson's second public note",
          "owner": {
            "real_name": "Lisa Simpson",
            "username": "lisa",
          },
          "created_at": "2017-04-07T15:46:18Z",
          "updated_at": "2017-04-07T15:46:18Z",
        },
        {
          "id": 28,
          "body": "Lisa Simpson's first public note",
          "owner": {
            "real_name": "Lisa Simpson",
            "username": "lisa",
          },
          "created_at": "2017-04-07T15:46:17Z",
          "updated_at": "2017-04-07T15:46:17Z",
        },
        {
          "id": 22,
          "body": "Bart Simpson's third public note",
          "owner": {
            "real_name": "Bart Simpson",
            "username": "bart",
          },
          "created_at": "2017-04-07T15:46:11Z",
          "updated_at": "2017-04-07T15:46:11Z",
        },
        {
          "id": 21,
          "body": "Bart Simpson's second public note",
          "owner": {
            "real_name": "Bart Simpson",
            "username": "bart",
          },
          "created_at": "2017-04-07T15:46:10Z",
          "updated_at": "2017-04-07T15:46:10Z",
        },
        {
          "id": 20,
          "body": "Bart Simpson's first public note",
          "owner": {
            "real_name": "Bart Simpson",
            "username": "bart",
          },
          "created_at": "2017-04-07T15:46:09Z",
          "updated_at": "2017-04-07T15:46:09Z",
        },
        {
          "id": 12,
          "body": "Marge Simpson's third public note",
          "owner": {
            "real_name": "Marge Simpson",
            "username": "marge",
          },
          "created_at": "2017-04-07T15:46:01Z",
          "updated_at": "2017-04-07T15:46:01Z",
        },
        {
          "id": 11,
          "body": "Marge Simpson's second public note",
          "owner": {
            "real_name": "Marge Simpson",
            "username": "marge",
          },
          "created_at": "2017-04-07T15:46:00Z",
          "updated_at": "2017-04-07T15:46:00Z",
        },
        {
          "id": 10,
          "body": "Marge Simpson's first public note",
          "owner": {
            "real_name": "Marge Simpson",
            "username": "marge",
          },
          "created_at": "2017-04-07T15:45:59Z",
          "updated_at": "2017-04-07T15:45:59Z",
        },
        {
          "id": 3,
          "body": "Homer Simpson's third public note",
          "owner": {
            "real_name": "Homer Simpson",
            "username": "homer",
          },
          "created_at": "2017-04-07T15:45:52Z",
          "updated_at": "2017-04-07T15:45:52Z",
        },
        {
          "id": 2,
          "body": "Homer Simpson's second public note",
          "owner": {
            "real_name": "Homer Simpson",
            "username": "homer",
          },
          "created_at": "2017-04-07T15:45:51Z",
          "updated_at": "2017-04-07T15:45:51Z",
        },
        {
          "id": 1,
          "body": "Homer Simpson's first public note",
          "owner": {
            "real_name": "Homer Simpson",
            "username": "homer",
          },
          "created_at": "2017-04-07T15:45:50Z",
          "updated_at": "2017-04-07T15:45:50Z",
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
          "created_at": "2017-04-08T09:25:03Z",
          "updated_at": "2017-04-08T09:25:03Z",
        },
        {
          "id": 50,
          "body": "Selma Bouvier's first shared note",
          "owner": {
            "real_name": "Selma Bouvier",
            "username": "selma",
          },
          "created_at": "2017-04-08T09:25:02Z",
          "updated_at": "2017-04-08T09:25:02Z",
        },
        {
          "id": 46,
          "body": "Selma Bouvier's third public note",
          "owner": {
            "real_name": "Selma Bouvier",
            "username": "selma",
          },
          "created_at": "2017-04-08T09:24:58Z",
          "updated_at": "2017-04-08T09:24:58Z",
        },
        {
          "id": 45,
          "body": "Selma Bouvier's second public note",
          "owner": {
            "real_name": "Selma Bouvier",
            "username": "selma",
          },
          "created_at": "2017-04-08T09:24:57Z",
          "updated_at": "2017-04-08T09:24:57Z",
        },
        {
          "id": 44,
          "body": "Selma Bouvier's first public note",
          "owner": {
            "real_name": "Selma Bouvier",
            "username": "selma",
          },
          "created_at": "2017-04-08T09:24:56Z",
          "updated_at": "2017-04-08T09:24:56Z",
        },
        {
          "id": 43,
          "body": "Patty Bouvier's second shared note",
          "owner": {
            "real_name": "Patty Bouvier",
            "username": "patty",
          },
          "created_at": "2017-04-08T09:24:55Z",
          "updated_at": "2017-04-08T09:24:55Z",
        },
        {
          "id": 42,
          "body": "Patty Bouvier's first shared note",
          "owner": {
            "real_name": "Patty Bouvier",
            "username": "patty",
          },
          "created_at": "2017-04-08T09:24:54Z",
          "updated_at": "2017-04-08T09:24:54Z",
        },
        {
          "id": 38,
          "body": "Patty Bouvier's third public note",
          "owner": {
            "real_name": "Patty Bouvier",
            "username": "patty",
          },
          "created_at": "2017-04-08T09:24:50Z",
          "updated_at": "2017-04-08T09:24:50Z",
        },
        {
          "id": 37,
          "body": "Patty Bouvier's second public note",
          "owner": {
            "real_name": "Patty Bouvier",
            "username": "patty",
          },
          "created_at": "2017-04-08T09:24:49Z",
          "updated_at": "2017-04-08T09:24:49Z",
        },
        {
          "id": 36,
          "body": "Patty Bouvier's first public note",
          "owner": {
            "real_name": "Patty Bouvier",
            "username": "patty",
          },
          "created_at": "2017-04-08T09:24:48Z",
          "updated_at": "2017-04-08T09:24:48Z",
        },
        {
          "id": 35,
          "body": "Lisa Simpson's second shared note",
          "owner": {
            "real_name": "Lisa Simpson",
            "username": "lisa",
          },
          "created_at": "2017-04-08T09:24:47Z",
          "updated_at": "2017-04-08T09:24:47Z",
        },
        {
          "id": 34,
          "body": "Lisa Simpson's first shared note",
          "owner": {
            "real_name": "Lisa Simpson",
            "username": "lisa",
          },
          "created_at": "2017-04-08T09:24:46Z",
          "updated_at": "2017-04-08T09:24:46Z",
        },
        {
          "id": 30,
          "body": "Lisa Simpson's third public note",
          "owner": {
            "real_name": "Lisa Simpson",
            "username": "lisa",
          },
          "created_at": "2017-04-08T09:24:42Z",
          "updated_at": "2017-04-08T09:24:42Z",
        },
        {
          "id": 29,
          "body": "Lisa Simpson's second public note",
          "owner": {
            "real_name": "Lisa Simpson",
            "username": "lisa",
          },
          "created_at": "2017-04-08T09:24:41Z",
          "updated_at": "2017-04-08T09:24:41Z",
        },
        {
          "id": 28,
          "body": "Lisa Simpson's first public note",
          "owner": {
            "real_name": "Lisa Simpson",
            "username": "lisa",
          },
          "created_at": "2017-04-08T09:24:40Z",
          "updated_at": "2017-04-08T09:24:40Z",
        },
        {
          "id": 27,
          "body": "Bart Simpson's second shared note",
          "owner": {
            "real_name": "Bart Simpson",
            "username": "bart",
          },
          "created_at": "2017-04-08T09:24:39Z",
          "updated_at": "2017-04-08T09:24:39Z",
        },
        {
          "id": 26,
          "body": "Bart Simpson's first shared note",
          "owner": {
            "real_name": "Bart Simpson",
            "username": "bart",
          },
          "created_at": "2017-04-08T09:24:38Z",
          "updated_at": "2017-04-08T09:24:38Z",
        },
        {
          "id": 22,
          "body": "Bart Simpson's third public note",
          "owner": {
            "real_name": "Bart Simpson",
            "username": "bart",
          },
          "created_at": "2017-04-08T09:24:34Z",
          "updated_at": "2017-04-08T09:24:34Z",
        },
        {
          "id": 21,
          "body": "Bart Simpson's second public note",
          "owner": {
            "real_name": "Bart Simpson",
            "username": "bart",
          },
          "created_at": "2017-04-08T09:24:33Z",
          "updated_at": "2017-04-08T09:24:33Z",
        },
        {
          "id": 20,
          "body": "Bart Simpson's first public note",
          "owner": {
            "real_name": "Bart Simpson",
            "username": "bart",
          },
          "created_at": "2017-04-08T09:24:32Z",
          "updated_at": "2017-04-08T09:24:32Z",
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
          "created_at": "2017-04-08T09:25:04Z",
          "updated_at": "2017-04-08T09:25:04Z",
        },
        {
          "id": 44,
          "body": "Selma Bouvier's first public note",
          "owner": {
            "real_name": "Selma Bouvier",
            "username": "selma",
          },
          "created_at": "2017-04-08T09:25:03Z",
          "updated_at": "2017-04-08T09:25:03Z",
        },
        {
          "id": 43,
          "body": "Patty Bouvier's second shared note",
          "owner": {
            "real_name": "Patty Bouvier",
            "username": "patty",
          },
          "created_at": "2017-04-08T09:25:02Z",
          "updated_at": "2017-04-08T09:25:02Z",
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
          "created_at": "2017-04-08T09:25:16Z",
          "updated_at": "2017-04-08T09:25:16Z",
        },
        {
          "id": 50,
          "body": "Selma Bouvier's first shared note",
          "owner": {
            "real_name": "Selma Bouvier",
            "username": "selma",
          },
          "created_at": "2017-04-08T09:25:15Z",
          "updated_at": "2017-04-08T09:25:15Z",
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
          "created_at": "2017-04-08T09:25:18Z",
          "updated_at": "2017-04-08T09:25:18Z",
        },
        {
          "id": 45,
          "body": "Selma Bouvier's second public note",
          "owner": {
            "real_name": "Selma Bouvier",
            "username": "selma",
          },
          "created_at": "2017-04-08T09:25:17Z",
          "updated_at": "2017-04-08T09:25:17Z",
        },
        {
          "id": 44,
          "body": "Selma Bouvier's first public note",
          "owner": {
            "real_name": "Selma Bouvier",
            "username": "selma",
          },
          "created_at": "2017-04-08T09:25:16Z",
          "updated_at": "2017-04-08T09:25:16Z",
        },
        {
          "id": 38,
          "body": "Patty Bouvier's third public note",
          "owner": {
            "real_name": "Patty Bouvier",
            "username": "patty",
          },
          "created_at": "2017-04-08T09:25:10Z",
          "updated_at": "2017-04-08T09:25:10Z",
        },
        {
          "id": 37,
          "body": "Patty Bouvier's second public note",
          "owner": {
            "real_name": "Patty Bouvier",
            "username": "patty",
          },
          "created_at": "2017-04-08T09:25:09Z",
          "updated_at": "2017-04-08T09:25:09Z",
        },
        {
          "id": 36,
          "body": "Patty Bouvier's first public note",
          "owner": {
            "real_name": "Patty Bouvier",
            "username": "patty",
          },
          "created_at": "2017-04-08T09:25:08Z",
          "updated_at": "2017-04-08T09:25:08Z",
        },
        {
          "id": 30,
          "body": "Lisa Simpson's third public note",
          "owner": {
            "real_name": "Lisa Simpson",
            "username": "lisa",
          },
          "created_at": "2017-04-08T09:25:02Z",
          "updated_at": "2017-04-08T09:25:02Z",
        },
        {
          "id": 29,
          "body": "Lisa Simpson's second public note",
          "owner": {
            "real_name": "Lisa Simpson",
            "username": "lisa",
          },
          "created_at": "2017-04-08T09:25:01Z",
          "updated_at": "2017-04-08T09:25:01Z",
        },
        {
          "id": 28,
          "body": "Lisa Simpson's first public note",
          "owner": {
            "real_name": "Lisa Simpson",
            "username": "lisa",
          },
          "created_at": "2017-04-08T09:25:00Z",
          "updated_at": "2017-04-08T09:25:00Z",
        },
        {
          "id": 22,
          "body": "Bart Simpson's third public note",
          "owner": {
            "real_name": "Bart Simpson",
            "username": "bart",
          },
          "created_at": "2017-04-08T09:24:54Z",
          "updated_at": "2017-04-08T09:24:54Z",
        },
        {
          "id": 21,
          "body": "Bart Simpson's second public note",
          "owner": {
            "real_name": "Bart Simpson",
            "username": "bart",
          },
          "created_at": "2017-04-08T09:24:53Z",
          "updated_at": "2017-04-08T09:24:53Z",
        },
        {
          "id": 20,
          "body": "Bart Simpson's first public note",
          "owner": {
            "real_name": "Bart Simpson",
            "username": "bart",
          },
          "created_at": "2017-04-08T09:24:52Z",
          "updated_at": "2017-04-08T09:24:52Z",
        },
        {
          "id": 12,
          "body": "Marge Simpson's third public note",
          "owner": {
            "real_name": "Marge Simpson",
            "username": "marge",
          },
          "created_at": "2017-04-08T09:24:44Z",
          "updated_at": "2017-04-08T09:24:44Z",
        },
        {
          "id": 11,
          "body": "Marge Simpson's second public note",
          "owner": {
            "real_name": "Marge Simpson",
            "username": "marge",
          },
          "created_at": "2017-04-08T09:24:43Z",
          "updated_at": "2017-04-08T09:24:43Z",
        },
        {
          "id": 10,
          "body": "Marge Simpson's first public note",
          "owner": {
            "real_name": "Marge Simpson",
            "username": "marge",
          },
          "created_at": "2017-04-08T09:24:42Z",
          "updated_at": "2017-04-08T09:24:42Z",
        },
        {
          "id": 3,
          "body": "Homer Simpson's third public note",
          "owner": {
            "real_name": "Homer Simpson",
            "username": "homer",
          },
          "created_at": "2017-04-08T09:24:35Z",
          "updated_at": "2017-04-08T09:24:35Z",
        },
        {
          "id": 2,
          "body": "Homer Simpson's second public note",
          "owner": {
            "real_name": "Homer Simpson",
            "username": "homer",
          },
          "created_at": "2017-04-08T09:24:34Z",
          "updated_at": "2017-04-08T09:24:34Z",
        },
        {
          "id": 1,
          "body": "Homer Simpson's first public note",
          "owner": {
            "real_name": "Homer Simpson",
            "username": "homer",
          },
          "created_at": "2017-04-08T09:24:33Z",
          "updated_at": "2017-04-08T09:24:33Z",
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
          "created_at": "2017-04-08T09:40:33Z",
          "updated_at": "2017-04-08T09:40:33Z",
        },
        {
          "id": 50,
          "body": "Selma Bouvier's first shared note",
          "owner": {
            "real_name": "Selma Bouvier",
            "username": "selma",
          },
          "created_at": "2017-04-08T09:40:32Z",
          "updated_at": "2017-04-08T09:40:32Z",
        },
        {
          "id": 43,
          "body": "Patty Bouvier's second shared note",
          "owner": {
            "real_name": "Patty Bouvier",
            "username": "patty",
          },
          "created_at": "2017-04-08T09:40:25Z",
          "updated_at": "2017-04-08T09:40:25Z",
        },
        {
          "id": 42,
          "body": "Patty Bouvier's first shared note",
          "owner": {
            "real_name": "Patty Bouvier",
            "username": "patty",
          },
          "created_at": "2017-04-08T09:40:24Z",
          "updated_at": "2017-04-08T09:40:24Z",
        },
        {
          "id": 35,
          "body": "Lisa Simpson's second shared note",
          "owner": {
            "real_name": "Lisa Simpson",
            "username": "lisa",
          },
          "created_at": "2017-04-08T09:40:17Z",
          "updated_at": "2017-04-08T09:40:17Z",
        },
        {
          "id": 34,
          "body": "Lisa Simpson's first shared note",
          "owner": {
            "real_name": "Lisa Simpson",
            "username": "lisa",
          },
          "created_at": "2017-04-08T09:40:16Z",
          "updated_at": "2017-04-08T09:40:16Z",
        },
        {
          "id": 27,
          "body": "Bart Simpson's second shared note",
          "owner": {
            "real_name": "Bart Simpson",
            "username": "bart",
          },
          "created_at": "2017-04-08T09:40:09Z",
          "updated_at": "2017-04-08T09:40:09Z",
        },
        {
          "id": 26,
          "body": "Bart Simpson's first shared note",
          "owner": {
            "real_name": "Bart Simpson",
            "username": "bart",
          },
          "created_at": "2017-04-08T09:40:08Z",
          "updated_at": "2017-04-08T09:40:08Z",
        },
        {
          "id": 19,
          "body": "Marge Simpson's fourth shared note",
          "owner": {
            "real_name": "Marge Simpson",
            "username": "marge",
          },
          "created_at": "2017-04-08T09:40:01Z",
          "updated_at": "2017-04-08T09:40:01Z",
        },
        {
          "id": 18,
          "body": "Marge Simpson's third shared note",
          "owner": {
            "real_name": "Marge Simpson",
            "username": "marge",
          },
          "created_at": "2017-04-08T09:40:00Z",
          "updated_at": "2017-04-08T09:40:00Z",
        },
        {
          "id": 17,
          "body": "Marge Simpson's second shared note",
          "owner": {
            "real_name": "Marge Simpson",
            "username": "marge",
          },
          "created_at": "2017-04-08T09:39:59Z",
          "updated_at": "2017-04-08T09:39:59Z",
        },
        {
          "id": 16,
          "body": "Marge Simpson's first shared note",
          "owner": {
            "real_name": "Marge Simpson",
            "username": "marge",
          },
          "created_at": "2017-04-08T09:39:58Z",
          "updated_at": "2017-04-08T09:39:58Z",
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
