'use strict';

const Code     = require('code');
const Lab      = require('lab');
const helpers  = require('../../_helpers');
const config   = require('../../../src/config');
const models   = require('../../../src/models');
const schemas  = require('../../../src/schemas');

const lab = exports.lab = Lab.script();

lab.experiment('models.notes.destroy(noteID, currentUser)', () => {

  let server = null;
  
  lab.before(() => {

    return helpers.initializeTestServer(config, [models, schemas])
      .then((testServer) => {
        server = testServer;
      });
  });

  lab.experiment('Malformed noteID', () => {

    lab.test('Should reject with a "malformed" error', () => {

      const malformedNoteID  = 'one';
      const validCurrentUser = 'homer';

      return server.plugins.models.notes.destroy(malformedNoteID, validCurrentUser)
        .then(() => {
          throw new Error('Expected promise to reject');
        })
        .catch((err) => {
          Code.expect(err).to.be.an.error('noteID is malformed');
        });
    });
  });

  lab.experiment('Malformed currentUser', () => {

    lab.test('Should reject with a "malformed" error', () => {

      const validNoteID          = 1;
      const malformedCurrentUser = 12345;

      return server.plugins.models.notes.destroy(validNoteID, malformedCurrentUser)
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
      
      return helpers.resetDatabase(config);
    });

    lab.test('Should reject with a "nonexistent" error', () => {

      const nonexistentNoteID = 999999;
      const validCurrentUser  = 'homer';

      return server.plugins.models.notes.destroy(nonexistentNoteID, validCurrentUser)
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
      
      return helpers.resetDatabase(config);
    });

    lab.test('Should reject with a "nonexistent" error', () => {

      const validNoteID            = 1;
      const nonexistentCurrentUser = 'grimey';

      return server.plugins.models.notes.destroy(validNoteID, nonexistentCurrentUser)
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
      
      return helpers.resetDatabase(config);
    });

    lab.test('Should reject with a "permission" error', () => {

      const unownedNoteID    = 1;
      const validCurrentUser = 'marge';

      return server.plugins.models.groups.destroy(unownedNoteID, validCurrentUser)
        .then(() => {
          throw new Error('Expected promise to reject');
        })
        .catch((err) => {
          Code.expect(err).to.be.an.error('Permission denied');
        });
    });
  });

  lab.experiment('Valid Input', () => {

    const validNoteID      = 18;
    const validCurrentUser = 'marge';

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(config);
    });

    lab.test('Should resolve with boolean true', () => {

      return server.plugins.models.notes.destroy(validNoteID, validCurrentUser)
        .then((data) => {
          Code.expect(data).to.be.a.boolean();
          Code.expect(data).to.be.true();
        });
    });

    lab.test('Should modify database as expected', () => {
      
      const func = server.plugins.models.notes.destroy.bind(this, validNoteID, validCurrentUser);

      return helpers.testDatabaseChanges(config, func)
        .then((changes) => {

          Code.expect(changes).to.be.an.array();
          Code.expect(changes).to.have.length(9);

          Code.expect(changes[0].kind).to.equal('D');
          Code.expect(changes[0].path).to.equal([ 'notes', '18' ]);

          Code.expect(changes[1].kind).to.equal('D');
          Code.expect(changes[1].path).to.equal([ 'note_grants', '22' ]);

          Code.expect(changes[2].kind).to.equal('D');
          Code.expect(changes[2].path).to.equal([ 'note_grants', '23' ]);

          Code.expect(changes[3].kind).to.equal('D');
          Code.expect(changes[3].path).to.equal([ 'note_grants', '24' ]);

          Code.expect(changes[4].kind).to.equal('D');
          Code.expect(changes[4].path).to.equal([ 'note_grants', '25' ]);

          Code.expect(changes[5].kind).to.equal('D');
          Code.expect(changes[5].path).to.equal([ 'note_grants', '26' ]);

          Code.expect(changes[6].kind).to.equal('D');
          Code.expect(changes[6].path).to.equal([ 'note_grants', '27' ]);

          Code.expect(changes[7].kind).to.equal('D');
          Code.expect(changes[7].path).to.equal([ 'note_grants', '28' ]);

          Code.expect(changes[8].kind).to.equal('D');
          Code.expect(changes[8].path).to.equal([ 'note_grants', '29' ]);
        });
    });
  });
});
