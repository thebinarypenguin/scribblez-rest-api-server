'use strict';

const Code     = require('code');
const Lab      = require('lab');
const helpers  = require('../../_helpers');
const config   = require('../../../src/config');
const models   = require('../../../src/models');
const schemas  = require('../../../src/schemas');

const lab = exports.lab = Lab.script();

lab.experiment('models.groups.destroy(groupID, currentUser)', () => {

  let server = null;
  
  lab.before(() => {

    return helpers.initializeTestServer(config, [models, schemas])
      .then((testServer) => {
        server = testServer;
      });
  });

  lab.experiment('Malformed groupID', () => {

    lab.test('Should reject with a "malformed" error', () => {

      const malformedGroupID = 'one';
      const validCurrentUser = 'homer';

      return server.plugins.models.groups.destroy(malformedGroupID, validCurrentUser)
        .then(() => {
          throw new Error('Expected promise to reject');
        })
        .catch((err) => {
          Code.expect(err).to.be.an.error('groupID is malformed');
        });
    });
  });

  lab.experiment('Malformed currentUser', () => {

    lab.test('Should reject with a "malformed" error', () => {

      const validGroupID         = 1;
      const malformedCurrentUser = 12345;

      return server.plugins.models.groups.destroy(validGroupID, malformedCurrentUser)
        .then(() => {
          throw new Error('Expected promise to reject');
        })
        .catch((err) => {
          Code.expect(err).to.be.an.error('currentUser is malformed');
        });
    });
  });

  lab.experiment('Nonexistent groupID', () => {

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(config);
    });

    lab.test('Should reject with a "nonexistent" error', () => {

      const nonexistentGroupID = 999999;
      const validCurrentUser   = 'homer';

      return server.plugins.models.groups.destroy(nonexistentGroupID, validCurrentUser)
        .then(() => {
          throw new Error('Expected promise to reject');
        })
        .catch((err) => {
          Code.expect(err).to.be.an.error('groupID does not exist');
        });
    });
  });

  lab.experiment('Nonexistent currentUser', () => {

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(config);
    });

    lab.test('Should reject with a "nonexistent" error', () => {

      const validGroupID           = 1;
      const nonexistentCurrentUser = 'grimey';

      return server.plugins.models.groups.destroy(validGroupID, nonexistentCurrentUser)
        .then(() => {
          throw new Error('Expected promise to reject');
        })
        .catch((err) => {
          Code.expect(err).to.be.an.error('currentUser does not exist');
        });
    });
  });

  lab.experiment('Group not owned by currentUser', () => {

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(config);
    });

    lab.test('Should reject with a "permission" error', () => {

      const unownedGroupID   = 15;
      const validCurrentUser = 'homer';

      return server.plugins.models.groups.destroy(unownedGroupID, validCurrentUser)
        .then(() => {
          throw new Error('Expected promise to reject');
        })
        .catch((err) => {
          Code.expect(err).to.be.an.error('Permission denied');
        });
    });
  });

  lab.experiment('Valid Input', () => {

    const validGroupID     = 2;
    const validCurrentUser = 'homer';

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(config);
    });

    lab.test('Should resolve with boolean true', () => {

      return server.plugins.models.groups.destroy(validGroupID, validCurrentUser)
        .then((data) => {
          Code.expect(data).to.be.a.boolean();
          Code.expect(data).to.be.true();
        });
    });

    lab.test('Should modify database as expected', () => {
      
      const func = server.plugins.models.groups.destroy.bind(this, validGroupID, validCurrentUser);

      return helpers.testDatabaseChanges(config, func)
        .then((changes) => {
          Code.expect(changes).to.be.an.array();
          Code.expect(changes).to.have.length(9);

          Code.expect(changes[0].kind).to.equal('D');
          Code.expect(changes[0].path).to.equal([ 'groups', '2' ]);
          Code.expect(changes[0].lhs.name).to.equal('Friends');

          Code.expect(changes[1].kind).to.equal('D');
          Code.expect(changes[1].path).to.equal([ 'group_members', '5' ]);
          Code.expect(changes[1].lhs.user_id).to.equal(12);

          Code.expect(changes[2].kind).to.equal('D');
          Code.expect(changes[2].path).to.equal([ 'group_members', '6' ]);
          Code.expect(changes[2].lhs.user_id).to.equal(13);

          Code.expect(changes[3].kind).to.equal('D');
          Code.expect(changes[3].path).to.equal([ 'note_grants', '2' ]);
          Code.expect(changes[3].lhs.user_id).to.equal(12);

          Code.expect(changes[4].kind).to.equal('D');
          Code.expect(changes[4].path).to.equal([ 'note_grants', '3' ]);
          Code.expect(changes[4].lhs.user_id).to.equal(13);

          Code.expect(changes[5].kind).to.equal('D');
          Code.expect(changes[5].path).to.equal([ 'note_grants', '5' ]);
          Code.expect(changes[5].lhs.user_id).to.equal(12);

          Code.expect(changes[6].kind).to.equal('D');
          Code.expect(changes[6].path).to.equal([ 'note_grants', '6' ]);
          Code.expect(changes[6].lhs.user_id).to.equal(13);

          Code.expect(changes[7].kind).to.equal('D');
          Code.expect(changes[7].path).to.equal([ 'note_grants', '7' ]);
          Code.expect(changes[7].lhs.user_id).to.equal(12);

          Code.expect(changes[8].kind).to.equal('D');
          Code.expect(changes[8].path).to.equal([ 'note_grants', '8' ]);
          Code.expect(changes[8].lhs.user_id).to.equal(13);
        });
    });
  });
});
