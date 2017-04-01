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

lab.experiment('models.notes.findByID(noteID, currentUser)', () => {

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

  lab.experiment('Malformed noteID', () => {

    lab.test('Should reject with a "malformed" error', () => {

      const malformedNoteID = 'one';
      const validCurrentUser = 'homer';

      return server.plugins.models.notes.findByID(malformedNoteID, validCurrentUser)
        .then(() => {
          throw new Error('Expected promise to reject');
        })
        .catch((err) => {
          Code.expect(err).to.be.an.error('noteID is malformed');
        });
    });
  });

  lab.experiment('Malformed currentUser', () => {

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(cfg);
    });

    lab.test('Should reject with a "malformed" error', () => {

      const validNoteID         = 1;
      const malformedCurrentUser = 12345;

      return server.plugins.models.notes.findByID(validNoteID, malformedCurrentUser)
        .then(() => {
          throw new Error('Expected promise to reject');
        })
        .catch((err) => {
          Code.expect(err).to.be.an.error('currentUser is malformed');
        });
    });
  });

  lab.experiment('Nonexistent noteID', () => {

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(cfg);
    });

    lab.test('Should reject with a "nonexistent" error', () => {

      const nonexistentNoteID = 999999;
      const validCurrentUser   = 'homer';

      return server.plugins.models.notes.findByID(nonexistentNoteID, validCurrentUser)
        .then(() => {
          throw new Error('Expected promise to reject');
        })
        .catch((err) => {
          Code.expect(err).to.be.an.error('noteID does not exist');
        });
    });
  });

  lab.experiment('Nonexistent currentUser', () => {

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(cfg);
    });

    lab.test('Should reject with a "nonexistent" error', () => {

      const validNoteID            = 1;
      const nonexistentCurrentUser = 'grimey';

      return server.plugins.models.notes.findByID(validNoteID, nonexistentCurrentUser)
        .then(() => {
          throw new Error('Expected promise to reject');
        })
        .catch((err) => {
          Code.expect(err).to.be.an.error('currentUser does not exist');
        });
    });
  });

  lab.experiment('Note not owned by currentUser', () => {

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(cfg);
    });

    lab.test('Should reject with a "permission" error', () => {

      const unownedNoteID    = 15;
      const validCurrentUser = 'homer';

      return server.plugins.models.notes.findByID(unownedNoteID, validCurrentUser)
        .then(() => {
          throw new Error('Expected promise to reject');
        })
        .catch((err) => {
          Code.expect(err).to.be.an.error('Permission denied');
        });
    });
  });

  lab.experiment('Valid input', () => {

    const validNoteID      = 1;
    const validCurrentUser = 'homer';

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(cfg);
    });

    lab.test('Should resolve with data that matches the note schema', () => {

      return server.plugins.models.notes.findByID(validNoteID, validCurrentUser)
        .then((data) => {
          Joi.assert(data, server.plugins.schemas.note);
        });
    });
    
    lab.test('Should resolve with data that matches the expected data', () => {

      const expectedData = {
        "body": "Homer Simpson's first public note",
        "id": 1,
        "owner": {
          "real_name": "Homer Simpson",
          "username": "homer",
        },
        "visibility": "public",
      };

      return server.plugins.models.notes.findByID(validNoteID, validCurrentUser)
        .then((data) => {
          Code.expect(data).to.equal(expectedData);
        });
    });
    
    lab.test('Should not modify the database', () => {

      const func = server.plugins.models.notes.findByID.bind(this, validNoteID, validCurrentUser);

      return helpers.testDatabaseChanges(cfg, func)
        .then((data) => {
          Code.expect(data).be.undefined();
        });
      });
  });
});
