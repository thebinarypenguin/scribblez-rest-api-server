'use strict';

const Code     = require('code');
const Lab      = require('lab');
const helpers  = require('../../_helpers');
const config   = require('../../../src/config');
const models   = require('../../../src/models');
const schemas  = require('../../../src/schemas');

const lab = exports.lab = Lab.script();

lab.experiment('models.notes.create(payload, currentUser)', () => {

  let server = null;
  
  lab.before(() => {

    return helpers.initializeTestServer(config, [models, schemas])
      .then((testServer) => {
        server = testServer;
      });
  });

  lab.experiment('Malformed payload', () => {

    lab.test('Should reject with a "malformed" error', () => {

      const malformedPayload = {};
      const validCurrentUser = 'homer';

      return server.plugins.models.notes.create(malformedPayload, validCurrentUser)
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

      const validPayload = {
        body: 'A valid example note',
        visibility: 'public',
      };

      const malformedCurrentUser = 12345;

      return server.plugins.models.notes.create(validPayload, malformedCurrentUser)
        .then(() => {
          throw new Error('Expected promise to reject');
        })
        .catch((err) => {
          Code.expect(err).to.be.an.error('currentUser is malformed');
        });
    });
  });

  lab.experiment('Nonexistent user(s) in payload.visibility.users', () => {

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(config);
    });

    lab.test('Should reject with a "nonexistent" error', () => {
      
      const nonexistentUsers = {
        body: 'An updated note', 
        visibility: {
          users: ['grimey', 'drmonroe'],
          groups: [],
        },
      };
      
      const validCurrentUser = 'homer';

      return server.plugins.models.notes.create(nonexistentUsers, validCurrentUser)
        .then(() => {
          throw new Error('Expected promise to reject');
        })
        .catch((err) => {
          Code.expect(err).to.be.an.error('Nonexistent user(s) in payload.visibility.users');
        });
    });
  });

  lab.experiment('Nonexistent group(s) in payload.visibility.groups', () => {

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(config);
    });

    lab.test('Should reject with a "nonexistent" error', () => {
      
      const nonexistentGroups = {
        body: 'An updated note', 
        visibility: {
          users: [],
          groups: ['Stonecutters', 'No Homers'],
        },
      };
      
      const validCurrentUser = 'homer';

      return server.plugins.models.notes.create(nonexistentGroups, validCurrentUser)
        .then(() => {
          throw new Error('Expected promise to reject');
        })
        .catch((err) => {
          Code.expect(err).to.be.an.error('Nonexistent group(s) in payload.visibility.groups');
        });
    });
  });

  lab.experiment('Nonexistent currentUser', () => {

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(config);
    });

    lab.test('Should reject with a "nonexistent" error', () => {

      const validPayload = {
        body: 'A valid example note',
        visibility: 'public',
      };

      const nonexistentCurrentUser = 'grimey';

      return server.plugins.models.notes.create(validPayload, nonexistentCurrentUser)
        .then(() => {
          throw new Error('Expected promise to reject');
        })
        .catch((err) => {
          Code.expect(err).to.be.an.error('currentUser does not exist');
        });
    });
  });

  lab.experiment('Note "shared" with 0 users and 0 groups', () => {

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(config);
    });

    lab.test('Should reject with a "malformed" error', () => {

      const notShared = {
        body: 'A note shared with no one',
        visibility: {
          users: [],
          groups: [],
        },
      };

      const validCurrentUser = 'homer';

      return server.plugins.models.notes.create(notShared, validCurrentUser)
        .then(() => {
          throw new Error('Expected promise to reject');
        })
        .catch((err) => {
          Code.expect(err).to.be.an.error('A shared note must be shared with atleast one user or group');
        });
    });
  });

  lab.experiment('Valid Input (public)', () => {

    const validPayload = {
      body: 'A valid example note',
      visibility: 'public',
    };

    const validCurrentUser = 'homer';

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(config);
    });

    lab.test('Should resolve with the ID of the new note', () => {

      return server.plugins.models.notes.create(validPayload, validCurrentUser)
        .then((data) => {
          Code.expect(data).to.equal(60);
        });
    });

    lab.test('Should modify database as expected', () => {
      
      const func = server.plugins.models.notes.create.bind(this, validPayload, validCurrentUser);

      return helpers.testDatabaseChanges(config, func)
        .then((changes) => {
          Code.expect(changes).to.be.an.array();
          Code.expect(changes).to.have.length(1);

          Code.expect(changes[0].kind).to.equal('N');
          Code.expect(changes[0].path).to.equal([ 'notes', '60' ]);
        });
    });
  });

  lab.experiment('Valid Input (private)', () => {

    const validPayload = {
      body: 'A valid example note',
      visibility: 'private',
    };

    const validCurrentUser = 'homer';

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(config);
    });

    lab.test('Should resolve with the ID of the new note', () => {

      return server.plugins.models.notes.create(validPayload, validCurrentUser)
        .then((data) => {
          Code.expect(data).to.equal(60);
        });
    });

    lab.test('Should modify database as expected', () => {
      
      const func = server.plugins.models.notes.create.bind(this, validPayload, validCurrentUser);

      return helpers.testDatabaseChanges(config, func)
        .then((changes) => {
          Code.expect(changes).to.be.an.array();
          Code.expect(changes).to.have.length(1);

          Code.expect(changes[0].kind).to.equal('N');
          Code.expect(changes[0].path).to.equal([ 'notes', '60' ]);
        });
    });
  });

  lab.experiment('Valid Input (shared)', () => {

    const validPayload = {
      body: 'A valid example note',
      visibility: {
        users: [
          'patty', 
          'selma',
        ],
        groups: [
          'Family',
          'Friends',
        ],
      },
    };

    const validCurrentUser = 'homer';

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(config);
    });

    lab.test('Should resolve with ID of the new note', () => {

      return server.plugins.models.notes.create(validPayload, validCurrentUser)
        .then((data) => {
          Code.expect(data).to.equal(60);
        });
    });

    lab.test('Should modify database as expected', () => {
      
      const func = server.plugins.models.notes.create.bind(this, validPayload, validCurrentUser);

      return helpers.testDatabaseChanges(config, func)
        .then((changes) => {
          Code.expect(changes).to.be.an.array();
          Code.expect(changes).to.have.length(9);

          Code.expect(changes[0].kind).to.equal('N');
          Code.expect(changes[0].path).to.equal([ 'notes', '60' ]);

          Code.expect(changes[1].kind).to.equal('N');
          Code.expect(changes[1].path).to.equal([ 'note_grants', '106' ]);
          Code.expect(changes[1].rhs.user_id).to.equal(6);
          Code.expect(changes[1].rhs.group_id).to.equal(null);

          Code.expect(changes[2].kind).to.equal('N');
          Code.expect(changes[2].path).to.equal([ 'note_grants', '107' ]);
          Code.expect(changes[2].rhs.user_id).to.equal(7);
          Code.expect(changes[2].rhs.group_id).to.equal(null);

          Code.expect(changes[3].kind).to.equal('N');
          Code.expect(changes[3].path).to.equal([ 'note_grants', '108' ]);
          Code.expect(changes[3].rhs.user_id).to.equal(2);
          Code.expect(changes[3].rhs.group_id).to.equal(1);

          Code.expect(changes[4].kind).to.equal('N');
          Code.expect(changes[4].path).to.equal([ 'note_grants', '109' ]);
          Code.expect(changes[4].rhs.user_id).to.equal(3);
          Code.expect(changes[4].rhs.group_id).to.equal(1);

          Code.expect(changes[5].kind).to.equal('N');
          Code.expect(changes[5].path).to.equal([ 'note_grants', '110' ]);
          Code.expect(changes[5].rhs.user_id).to.equal(4);
          Code.expect(changes[5].rhs.group_id).to.equal(1);

          Code.expect(changes[6].kind).to.equal('N');
          Code.expect(changes[6].path).to.equal([ 'note_grants', '111' ]);
          Code.expect(changes[6].rhs.user_id).to.equal(5);
          Code.expect(changes[6].rhs.group_id).to.equal(1);

          Code.expect(changes[7].kind).to.equal('N');
          Code.expect(changes[7].path).to.equal([ 'note_grants', '112' ]);
          Code.expect(changes[7].rhs.user_id).to.equal(12);
          Code.expect(changes[7].rhs.group_id).to.equal(2);

          Code.expect(changes[8].kind).to.equal('N');
          Code.expect(changes[8].path).to.equal([ 'note_grants', '113' ]);
          Code.expect(changes[8].rhs.user_id).to.equal(13);
          Code.expect(changes[8].rhs.group_id).to.equal(2);
        });
    });
  });

  lab.experiment('Valid Input (shared with duplicate users and groups)', () => {

    const validPayload = {
      body: 'A valid example note',
      visibility: {
        users: [
          'patty', 
          'selma',
          'patty',
        ],
        groups: [
          'Family',
          'Friends',
          'Family',
        ],
      },
    };

    const validCurrentUser = 'homer';

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(config);
    });

    lab.test('Should resolve with ID of the new note', () => {

      return server.plugins.models.notes.create(validPayload, validCurrentUser)
        .then((data) => {
          Code.expect(data).to.equal(60);
        });
    });

    lab.test('Should modify database as expected', () => {
      
      const func = server.plugins.models.notes.create.bind(this, validPayload, validCurrentUser);

      return helpers.testDatabaseChanges(config, func)
        .then((changes) => {
          Code.expect(changes).to.be.an.array();
          Code.expect(changes).to.have.length(9);

          Code.expect(changes[0].kind).to.equal('N');
          Code.expect(changes[0].path).to.equal([ 'notes', '60' ]);

          Code.expect(changes[1].kind).to.equal('N');
          Code.expect(changes[1].path).to.equal([ 'note_grants', '106' ]);
          Code.expect(changes[1].rhs.user_id).to.equal(6);
          Code.expect(changes[1].rhs.group_id).to.equal(null);

          Code.expect(changes[2].kind).to.equal('N');
          Code.expect(changes[2].path).to.equal([ 'note_grants', '107' ]);
          Code.expect(changes[2].rhs.user_id).to.equal(7);
          Code.expect(changes[2].rhs.group_id).to.equal(null);

          Code.expect(changes[3].kind).to.equal('N');
          Code.expect(changes[3].path).to.equal([ 'note_grants', '108' ]);
          Code.expect(changes[3].rhs.user_id).to.equal(2);
          Code.expect(changes[3].rhs.group_id).to.equal(1);

          Code.expect(changes[4].kind).to.equal('N');
          Code.expect(changes[4].path).to.equal([ 'note_grants', '109' ]);
          Code.expect(changes[4].rhs.user_id).to.equal(3);
          Code.expect(changes[4].rhs.group_id).to.equal(1);

          Code.expect(changes[5].kind).to.equal('N');
          Code.expect(changes[5].path).to.equal([ 'note_grants', '110' ]);
          Code.expect(changes[5].rhs.user_id).to.equal(4);
          Code.expect(changes[5].rhs.group_id).to.equal(1);

          Code.expect(changes[6].kind).to.equal('N');
          Code.expect(changes[6].path).to.equal([ 'note_grants', '111' ]);
          Code.expect(changes[6].rhs.user_id).to.equal(5);
          Code.expect(changes[6].rhs.group_id).to.equal(1);

          Code.expect(changes[7].kind).to.equal('N');
          Code.expect(changes[7].path).to.equal([ 'note_grants', '112' ]);
          Code.expect(changes[7].rhs.user_id).to.equal(12);
          Code.expect(changes[7].rhs.group_id).to.equal(2);

          Code.expect(changes[8].kind).to.equal('N');
          Code.expect(changes[8].path).to.equal([ 'note_grants', '113' ]);
          Code.expect(changes[8].rhs.user_id).to.equal(13);
          Code.expect(changes[8].rhs.group_id).to.equal(2);
        });
    });
  });
});
