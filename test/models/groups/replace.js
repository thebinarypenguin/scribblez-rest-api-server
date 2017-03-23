'use strict';

const Code     = require('code');
const Lab      = require('lab');
const helpers  = require('../../_helpers');
const config   = require('../../../src/config');
const models   = require('../../../src/models');
const schemas  = require('../../../src/schemas');

const lab = exports.lab = Lab.script();

lab.experiment('models.groups.replace(groupID, payload, currentUser)', () => {

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
      const validPayload     = { name: 'New group name', members: [] };
      const validCurrentUser = 'homer';

      return server.plugins.models.groups.replace(malformedGroupID, validPayload, validCurrentUser)
        .then(() => {
          throw new Error('Expected promise to reject');
        })
        .catch((err) => {
          Code.expect(err).to.be.an.error('groupID is malformed');
        });
    });
  });

  lab.experiment('Malformed payload', () => {

    lab.test('Should reject with a "malformed" error', () => {

      const validGroupID     = 1;
      const malformedPayload = {};
      const validCurrentUser = 'homer';

      return server.plugins.models.groups.replace(validGroupID, malformedPayload, validCurrentUser)
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

      const validGroupID         = 1;
      const validPayload         = { name: 'New group name', members: [] };
      const malformedCurrentUser = 12345;

      return server.plugins.models.groups.replace(validGroupID, validPayload, malformedCurrentUser)
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
      const validPayload       = { name: 'New group name', members: [] };
      const validCurrentUser   = 'homer';

      return server.plugins.models.groups.replace(nonexistentGroupID, validPayload, validCurrentUser)
        .then(() => {
          throw new Error('Expected promise to reject');
        })
        .catch((err) => {
          Code.expect(err).to.be.an.error('groupID does not exist');
        });
    });
  });

  lab.experiment('Nonexistent user(s) in payload.members', () => {

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(config);
    });

    lab.test('Should reject with a "nonexistent" error', () => {

      const validGroupID     = 1;
      const nonexistentUsers = { name: 'New group name', members: [ 'grimey', 'drmonroe' ] };
      const validCurrentUser = 'homer';

      return server.plugins.models.groups.replace(validGroupID, nonexistentUsers, validCurrentUser)
        .then(() => {
          throw new Error('Expected promise to reject');
        })
        .catch((err) => {
          Code.expect(err).to.be.an.error('Nonexistent user(s) in payload.members');
        });
    });
  });

  lab.experiment('Nonexistent currentUser', () => {

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(config);
    });

    lab.test('Should reject with a "nonexistent" error', () => {

      const validGroupID           = 1;
      const validPayload           = { name: 'New group name', members: [] };
      const nonexistentCurrentUser = 'grimey';

      return server.plugins.models.groups.replace(validGroupID, validPayload, nonexistentCurrentUser)
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
      const validPayload     = { name: 'New group name', members: [ 'lenny', 'carl' ] };
      const validCurrentUser = 'homer';

      return server.plugins.models.groups.replace(unownedGroupID, validPayload, validCurrentUser)
        .then(() => {
          throw new Error('Expected promise to reject');
        })
        .catch((err) => {
          Code.expect(err).to.be.an.error('Permission denied');
        });
    });
  });

  lab.experiment('Valid Input (change name)', () => {

    const validGroupID     = 2;
    const validPayload     = { name: 'New group name', members: [ 'lenny', 'carl' ] };
    const validCurrentUser = 'homer';

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(config);
    });

    lab.test('Should resolve with boolean true', () => {

      return server.plugins.models.groups.replace(validGroupID, validPayload, validCurrentUser)
        .then((data) => {
          Code.expect(data).to.be.a.boolean();
          Code.expect(data).to.be.true();
        });
    });

    lab.test('Should modify database as expected', () => {
      
      const func = server.plugins.models.groups.replace.bind(this, validGroupID, validPayload, validCurrentUser);

      return helpers.testDatabaseChanges(config, func)
        .then((changes) => {
          Code.expect(changes).to.be.an.array();
          Code.expect(changes).to.have.length(1);


          Code.expect(changes[0].kind).to.equal('E');
          Code.expect(changes[0].path).to.equal([ 'groups', '2', 'name' ]);
          Code.expect(changes[0].rhs).to.equal('New group name');
        });
    });
  });

  lab.experiment('Valid Input (change members)', () => {

    const validGroupID     = 2;
    const validPayload     = { name: 'Friends', members: [ 'lenny', 'moe' ] };
    const validCurrentUser = 'homer';

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(config);
    });

    lab.test('Should resolve with boolean true', () => {

      return server.plugins.models.groups.replace(validGroupID, validPayload, validCurrentUser)
        .then((data) => {
          Code.expect(data).to.be.a.boolean();
          Code.expect(data).to.be.true();
        });
    });

    lab.test('Should modify database as expected', () => {
      
      const func = server.plugins.models.groups.replace.bind(this, validGroupID, validPayload, validCurrentUser);

      return helpers.testDatabaseChanges(config, func)
        .then((changes) => {
          Code.expect(changes).to.be.an.array();
          Code.expect(changes).to.have.length(2);

          Code.expect(changes[0].kind).to.equal('D');
          Code.expect(changes[0].path).to.equal([ 'group_members', '6' ]);
          Code.expect(changes[0].lhs.user_id).to.equal(13);

          Code.expect(changes[1].kind).to.equal('N');
          Code.expect(changes[1].path).to.equal([ 'group_members', '69' ]);
          Code.expect(changes[1].rhs.user_id).to.equal(14);
        });
    });
  });
});
