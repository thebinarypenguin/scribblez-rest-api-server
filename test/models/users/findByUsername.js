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

lab.experiment('models.users.findByUsername(username, currentUser)', () => {

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

  lab.experiment('username and currentUser do not match', () => {

    lab.test('Should reject with a "permission" error', () => {

      const mismatchedUsername    = 'homer';
      const mismatchedCurrentUser = 'marge';

      return server.plugins.models.users.findByUsername(mismatchedUsername, mismatchedCurrentUser)
        .then(() => {
          throw new Error('Expected promise to reject');
        })
        .catch((err) => {
          Code.expect(err).to.be.an.error('Permission denied');
        });
    });
  });

  lab.experiment('Malformed username (and currentUser)', () => {

    lab.test('Should reject with a "malformed" error', () => {

      const malformedUsername    = 12345;
      const malformedCurrentUser = 12345;

      return server.plugins.models.users.findByUsername(malformedUsername, malformedCurrentUser)
        .then(() => {
          throw new Error('Expected promise to reject');
        })
        .catch((err) => {
          Code.expect(err).to.be.an.error('username is malformed');
        });
    });
  });

  lab.experiment('Nonexistent username (and currentUser)', () => {

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(cfg);
    });

    lab.test('Should reject with a "nonexistent" error', () => {

      const nonexistentUsername    = 'grimey';
      const nonexistentCurrentUser = 'grimey';

      return server.plugins.models.users.findByUsername(nonexistentUsername, nonexistentCurrentUser)
        .then(() => {
          throw new Error('Expected promise to reject');
        })
        .catch((err) => {
          Code.expect(err).to.be.an.error('username does not exist');
        });
    });
  });

  lab.experiment('Valid input', () => {

    const validUsername    = 'homer';
    const validCurrentUser = 'homer';

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(cfg);
    });

    lab.test('Should resolve with data that matches the user schema', () => {

      return server.plugins.models.users.findByUsername(validUsername, validCurrentUser)
        .then((data) => {
          Joi.assert(data, server.plugins.schemas.user);
        });
    });
    
    lab.test('Should resolve with data that matches the expected data', () => {

      const expectedData = {
        "real_name": "Homer Simpson",
        "email_address": "homer@example.com",
        "username": "homer",
      };

      return server.plugins.models.users.findByUsername(validUsername, validCurrentUser)
        .then((data) => {
          Code.expect(data).to.equal(expectedData);
        });
    });
    
    lab.test('Should not modify the database', () => {

      const func = server.plugins.models.users.findByUsername.bind(this, validUsername, validCurrentUser);

      return helpers.testDatabaseChanges(cfg, func)
        .then((data) => {
          Code.expect(data).be.undefined();
        });
      });
  });
});
