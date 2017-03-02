'use strict';

const Code     = require('code');
const Lab      = require('lab');
const helpers  = require('../../_helpers');
const config   = require('../../../src/config');
const models   = require('../../../src/models');
const schemas  = require('../../../src/schemas');

const lab = exports.lab = Lab.script();

lab.experiment('models.groups.create(payload, currentUser)', () => {

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

      return server.plugins.models.groups.create(malformedPayload, validCurrentUser)
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
        name: 'An empty test group',
        members: [],
      };

      const malformedCurrentUser = 12345;

      return server.plugins.models.groups.create(validPayload, malformedCurrentUser)
        .then(() => {
          throw new Error('Expected promise to reject');
        })
        .catch((err) => {
          Code.expect(err).to.be.an.error('currentUser is malformed');
        });
    });
  });

  lab.experiment('Nonexistent user in payload.members', () => {

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

      const validPayload = {
        name: 'An empty test group',
        members: [],
      };

      const nonexistentCurrentUser = 'grimey';

      return server.plugins.models.groups.create(validPayload, nonexistentCurrentUser)
        .then(() => {
          throw new Error('Expected promise to reject');
        })
        .catch((err) => {
          Code.expect(err).to.be.an.error('currentUser does not exist');
        });
    });
  });

  lab.experiment('Valid Input (0 members)', () => {

    const validPayload = {
      name: 'An empty test group',
      members: [],
    };

    const validCurrentUser = 'homer';

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(config);
    });

    lab.test('Should resolve with the new group ID', () => {

      return server.plugins.models.groups.create(validPayload, validCurrentUser)
        .then((data) => {
          Code.expect(data).to.equal(23);
        });
    });

    lab.test('Should modify database as expected', () => {
      
      const func = server.plugins.models.groups.create.bind(this, validPayload, validCurrentUser);

      return helpers.testDatabaseChanges(config, func)
        .then((changes) => {
          Code.expect(changes).to.be.an.array();
          Code.expect(changes).to.have.length(1);

          Code.expect(changes[0].kind).to.equal('N');
          Code.expect(changes[0].path).to.equal([ 'groups', '23' ]);
        });
    });
  });

  lab.experiment('Valid Input (2 members)', () => {

    const validPayload = {
      name: 'The Gruesome Twosome',
      members: [ 'patty', 'selma' ],
    };

    const validCurrentUser = 'homer';

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(config);
    });

    lab.test('Should resolve with the new group ID', () => {

      return server.plugins.models.groups.create(validPayload, validCurrentUser)
        .then((data) => {
          Code.expect(data).to.equal(23);
        });
    });

    lab.test('Should modify database as expected', () => {
      
      const func = server.plugins.models.groups.create.bind(this, validPayload, validCurrentUser);

      return helpers.testDatabaseChanges(config, func)
        .then((changes) => {
          Code.expect(changes).to.be.an.array();
          Code.expect(changes).to.have.length(3);

          Code.expect(changes[0].kind).to.equal('N');
          Code.expect(changes[0].path).to.equal([ 'groups', '23' ]);

          Code.expect(changes[1].kind).to.equal('N');
          Code.expect(changes[1].path).to.equal([ 'group_members', '69' ]);

          Code.expect(changes[2].kind).to.equal('N');
          Code.expect(changes[2].path).to.equal([ 'group_members', '70' ]);
        });
    });
  });
});
