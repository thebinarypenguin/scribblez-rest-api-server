'use strict';

const Code     = require('code');
const Lab      = require('lab');
const helpers  = require('../../_helpers');
const config   = require('../../../src/config');
const models   = require('../../../src/models');
const schemas  = require('../../../src/schemas');

const lab = exports.lab = Lab.script();

lab.experiment('models.notes.update(noteID, payload, currentUser)', () => {

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
      const validPayload     = { body: 'An updated note' };
      const validCurrentUser = 'homer';

      return server.plugins.models.notes.update(malformedNoteID, validPayload, validCurrentUser)
        .then(() => {
          throw new Error('Expected promise to reject');
        })
        .catch((err) => {
          Code.expect(err).to.be.an.error('noteID is malformed');
        });
    });
  });

  lab.experiment('Malformed payload', () => {

    lab.test('Should reject with a "malformed" error', () => {

      const validNoteID      = 1;
      const malformedPayload = {};
      const validCurrentUser = 'homer';

      return server.plugins.models.notes.update(validNoteID, malformedPayload, validCurrentUser)
        .then(() => {
          throw new Error('Expected promise to reject');
        })
        .catch((err) => {
          Code.expect(err).to.be.an.error('payload is malformed');
        });
    });
  });

  lab.experiment('Malformed currentUser', () => {

    lab.test('Should reject with a "malformed" error', () => {

      const validNoteID          = 1;
      const validPayload         = { body: 'An updated note' };
      const malformedCurrentUser = 12345;

      return server.plugins.models.notes.update(validNoteID, validPayload, malformedCurrentUser)
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
      const validPayload      = { body: 'A valid example note' };
      const validCurrentUser = 'homer';

      return server.plugins.models.notes.update(nonexistentNoteID, validPayload, validCurrentUser)
        .then(() => {
          throw new Error('Expected promise to reject');
        })
        .catch((err) => {
          Code.expect(err).to.be.an.error('noteID does not exist');
        });
    });
  });

  lab.experiment('Nonexistent user in payload.visibility.users', () => {

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(config);
    });

    lab.test('STUB', (done) => {
      
      done(new Error('STUB'));
    });
  });

  lab.experiment('Nonexistent group in payload.visibility.groups', () => {

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(config);
    });

    lab.test('STUB', (done) => {
      
      done(new Error('STUB'));
    });
  });

  lab.experiment('Nonexistent currentUser', () => {

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(config);
    });

    lab.test('Should reject with a "nonexistent" error', () => {

      const validNoteID            = 1;
      const validPayload           = { body: 'An updated note' };
      const nonexistentCurrentUser = 'grimey';

      return server.plugins.models.notes.update(validNoteID, validPayload, nonexistentCurrentUser)
        .then(() => {
          throw new Error('Expected promise to reject');
        })
        .catch((err) => {
          Code.expect(err).to.be.an.error('currentUser does not exist');
        });
    });
  });

  lab.experiment('Valid Input (body only)', () => {

    const validNoteID      = 1;
    const validPayload     = { body: 'An updated note' };
    const validCurrentUser = 'homer';

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(config);
    });

    lab.test('Should resolve with boolean true', () => {

      return server.plugins.models.notes.update(validNoteID, validPayload, validCurrentUser)
        .then((data) => {
          Code.expect(data).to.be.a.boolean();
          Code.expect(data).to.be.true();
        });
    });

    lab.test('Should modify database as expected', () => {
      
      const func = server.plugins.models.notes.update.bind(this, validNoteID, validPayload, validCurrentUser);

      return helpers.testDatabaseChanges(config, func)
        .then((changes) => {
          Code.expect(changes).to.be.an.array();
          Code.expect(changes).to.have.length(2);

          Code.expect(changes[0].kind).to.equal('E');
          Code.expect(changes[0].path).to.equal([ 'notes', '1', 'body' ]);
          Code.expect(changes[0].rhs).to.equal('An updated note');

          Code.expect(changes[1].kind).to.equal('E');
          Code.expect(changes[1].path).to.equal([ 'notes', '1', 'updated_at' ]);
        });
    });
  });

  lab.experiment('Valid Input (visibility only)', () => {

    const validNoteID      = 1;
    const validPayload     = { visibility: 'private' };
    const validCurrentUser = 'homer';

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(config);
    });

    lab.test('Should resolve with boolean true', () => {

      return server.plugins.models.notes.update(validNoteID, validPayload, validCurrentUser)
        .then((data) => {
          Code.expect(data).to.be.a.boolean();
          Code.expect(data).to.be.true();
        });
    });

    lab.test('Should modify database as expected', () => {
      
      const func = server.plugins.models.notes.update.bind(this, validNoteID, validPayload, validCurrentUser);

      return helpers.testDatabaseChanges(config, func)
        .then((changes) => {
          Code.expect(changes).to.be.an.array();
          Code.expect(changes).to.have.length(2);

          Code.expect(changes[0].kind).to.equal('E');
          Code.expect(changes[0].path).to.equal([ 'notes', '1', 'visibility' ]);
          Code.expect(changes[0].rhs).to.equal('private');

          Code.expect(changes[1].kind).to.equal('E');
          Code.expect(changes[1].path).to.equal([ 'notes', '1', 'updated_at' ]);
        });
    });
  });

  lab.experiment('Valid Input (add/remove grants)', () => {

    const validNoteID = 18;
    
    const validPayload = {
      visibility: {
        users: ['ned', 'moe'],
        groups: ['Sisters', 'Flanders'],
      },
    };
    
    const validCurrentUser = 'marge';

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(config);
    });

    lab.test('Should resolve with boolean true', () => {

      return server.plugins.models.notes.update(validNoteID, validPayload, validCurrentUser)
        .then((data) => {
          Code.expect(data).to.be.a.boolean();
          Code.expect(data).to.be.true();
        });
    });

    lab.test('Should modify database as expected', () => {
      
      const func = server.plugins.models.notes.update.bind(this, validNoteID, validPayload, validCurrentUser);

      return helpers.testDatabaseChanges(config, func)
        .then((changes) => {
          Code.expect(changes).to.be.an.array();
          Code.expect(changes).to.have.length(11);

          Code.expect(changes[0].kind).to.equal('E');
          Code.expect(changes[0].path).to.equal([ 'notes', '18', 'updated_at' ]);

          Code.expect(changes[1].kind).to.equal('D');
          Code.expect(changes[1].path).to.equal([ 'note_grants', '23' ]);
          Code.expect(changes[1].lhs.user_id).to.equal(9);
          Code.expect(changes[1].lhs.group_id).to.equal(null);

          Code.expect(changes[2].kind).to.equal('D');
          Code.expect(changes[2].path).to.equal([ 'note_grants', '26' ]);
          Code.expect(changes[2].lhs.user_id).to.equal(1);
          Code.expect(changes[2].lhs.group_id).to.equal(6);

          Code.expect(changes[3].kind).to.equal('D');
          Code.expect(changes[3].path).to.equal([ 'note_grants', '27' ]);
          Code.expect(changes[3].lhs.user_id).to.equal(3);
          Code.expect(changes[3].lhs.group_id).to.equal(6);

          Code.expect(changes[4].kind).to.equal('D');
          Code.expect(changes[4].path).to.equal([ 'note_grants', '28' ]);
          Code.expect(changes[4].lhs.user_id).to.equal(4);
          Code.expect(changes[4].lhs.group_id).to.equal(6);

          Code.expect(changes[5].kind).to.equal('D');
          Code.expect(changes[5].path).to.equal([ 'note_grants', '29' ]);
          Code.expect(changes[5].lhs.user_id).to.equal(5);
          Code.expect(changes[5].lhs.group_id).to.equal(6);

          Code.expect(changes[6].kind).to.equal('N');
          Code.expect(changes[6].path).to.equal([ 'note_grants', '106' ]);
          Code.expect(changes[6].rhs.user_id).to.equal(14);
          Code.expect(changes[6].rhs.group_id).to.equal(null);

          Code.expect(changes[7].kind).to.equal('N');
          Code.expect(changes[7].path).to.equal([ 'note_grants', '107' ]);
          Code.expect(changes[7].rhs.user_id).to.equal(8);
          Code.expect(changes[7].rhs.group_id).to.equal(7);

          Code.expect(changes[8].kind).to.equal('N');
          Code.expect(changes[8].path).to.equal([ 'note_grants', '108' ]);
          Code.expect(changes[8].rhs.user_id).to.equal(9);
          Code.expect(changes[8].rhs.group_id).to.equal(7);

          Code.expect(changes[9].kind).to.equal('N');
          Code.expect(changes[9].path).to.equal([ 'note_grants', '109' ]);
          Code.expect(changes[9].rhs.user_id).to.equal(10);
          Code.expect(changes[9].rhs.group_id).to.equal(7);

          Code.expect(changes[10].kind).to.equal('N');
          Code.expect(changes[10].path).to.equal([ 'note_grants', '110' ]);
          Code.expect(changes[10].rhs.user_id).to.equal(11);
          Code.expect(changes[10].rhs.group_id).to.equal(7);
        });
    });
  });
});
