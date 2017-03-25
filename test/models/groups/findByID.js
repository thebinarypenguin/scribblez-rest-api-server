'use strict';

const Code     = require('code');
const Joi      = require('joi');
const Lab      = require('lab');
const helpers  = require('../../_helpers');
const config   = require('../../../src/config');
const models   = require('../../../src/models');
const schemas  = require('../../../src/schemas');

const lab = exports.lab = Lab.script();

lab.experiment('models.groups.findByID(groupID, currentUser)', () => {

  let server = null;
  
  lab.before(() => {
    
    return helpers
      .checkDatabase(config)
      .then(() => {

        return helpers.initializeTestServer(config, [models, schemas])
      })
      .then((testServer) => {
        server = testServer;
      });
  });

  lab.after(() => {

    return helpers.emptyDatabase(config);
  });

  lab.experiment('Malformed groupID', () => {

    lab.test('Should reject with a "malformed" error', () => {

      const malformedGroupID = 'one';
      const validCurrentUser = 'homer';

      return server.plugins.models.groups.findByID(malformedGroupID, validCurrentUser)
        .then(() => {
          throw new Error('Expected promise to reject');
        })
        .catch((err) => {
          Code.expect(err).to.be.an.error('groupID is malformed');
        });
    });
  });

  lab.experiment('Malformed currentUser', () => {
    
    lab.beforeEach(() => {
      
      return helpers.resetDatabase(config);
    });

    lab.test('Should reject with a "malformed" error', () => {

      const validGroupID         = 1;
      const malformedCurrentUser = 12345;

      return server.plugins.models.groups.findByID(validGroupID, malformedCurrentUser)
        .then(() => {
          throw new Error('Expected promise to reject');
        })
        .catch((err) => {
          Code.expect(err).to.be.an.error('currentUser is malformed');
        });
    });
  });

  lab.experiment('Nonexistent groupID', () => {

    lab.test('Should reject with a "nonexistent" error', () => {

      const nonexistentGroupID = 999999;
      const validCurrentUser   = 'homer';

      return server.plugins.models.groups.findByID(nonexistentGroupID, validCurrentUser)
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

      return server.plugins.models.groups.findByID(validGroupID, nonexistentCurrentUser)
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

      return server.plugins.models.groups.findByID(unownedGroupID, validCurrentUser)
        .then(() => {
          throw new Error('Expected promise to reject');
        })
        .catch((err) => {
          Code.expect(err).to.be.an.error('Permission denied');
        });
    });
  });

  lab.experiment('Valid input', () => {

    const validGroupID     = 1;
    const validCurrentUser = 'homer';

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(config);
    });

    lab.test('Should resolve with data that matches the group schema', () => {

      return server.plugins.models.groups.findByID(validGroupID, validCurrentUser)
        .then((data) => {
          Joi.assert(data, server.plugins.schemas.group);
        });
    });
    
    lab.test('Should resolve with data that matches the expected data', () => {

      const expectedData = {
        "id": 1,
        "name": "Family",
        "members": [
          {
            "real_name": "Marge Simpson",
            "username": "marge",
          },
          {
            "real_name": "Bart Simpson",
            "username": "bart",
          },
          {
            "real_name": "Lisa Simpson",
            "username": "lisa",
          },
          {
            "real_name": "Maggie Simpson",
            "username": "maggie",
          },
        ],
      };

      return server.plugins.models.groups.findByID(validGroupID, validCurrentUser)
        .then((data) => {
          Code.expect(data).to.equal(expectedData);
        });
    });
    
    lab.test('Should not modify the database', () => {

      const func = server.plugins.models.groups.findByID.bind(this, validGroupID, validCurrentUser);

      return helpers.testDatabaseChanges(config, func)
        .then((data) => {
          Code.expect(data).be.undefined();
        });
      });
  });
});
