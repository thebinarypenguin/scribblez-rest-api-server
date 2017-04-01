'use strict';

const Code     = require('code');
const Lab      = require('lab');
const helpers  = require('../../_helpers');
const config   = require('../../../src/config');
const models   = require('../../../src/models');
const schemas  = require('../../../src/schemas');

const cfg = config.load('test');

const lab = exports.lab = Lab.script();

lab.experiment('models.users.authenticate(username, password)', () => {

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

  lab.experiment('Malformed username', () => {

    lab.test('Should reject with a "malformed" error', () => {

      const malformedUsername = 12345;
      const validPassword     = 'password';

      return server.plugins.models.users.authenticate(malformedUsername, validPassword)
        .then(() => {
          throw new Error('Expected promise to reject');
        })
        .catch((err) => {
          Code.expect(err).to.be.an.error('username is malformed');
        });
    });
  });

  lab.experiment('Malformed password', () => {

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(cfg);
    });

    lab.test('Should reject with a "malformed" error', () => {

      const validUsername     = 'homer';
      const malformedPassword = 12345;

      return server.plugins.models.users.authenticate(validUsername, malformedPassword)
        .then(() => {
          throw new Error('Expected promise to reject');
        })
        .catch((err) => {
          Code.expect(err).to.be.an.error('password is malformed');
        });
    });
  });

  lab.experiment('Invalid credentials', () => {

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(cfg);
    });

    lab.test('Should reject with an "invalid" error', () => {

      const validUsername = 'homer';
      const wrongPassword = 'wrong password';

      return server.plugins.models.users.authenticate(validUsername, wrongPassword)
        .then(() => {
          throw new Error('Expected promise to reject');
        })
        .catch((err) => {
          Code.expect(err).to.be.an.error('credentials are invalid');
        });
    });
  });

  lab.experiment('Valid input', () => {

    const validUsername = 'homer';
    const validPassword = 'password';

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(cfg);
    });

    lab.test('Should resolve with boolean true', () => {

      return server.plugins.models.users.authenticate(validUsername, validPassword)
        .then((data) => {
          Code.expect(data).to.be.a.boolean();
          Code.expect(data).to.be.true();
        });
    });

    lab.test('Should not modify the database', () => {

      const func = server.plugins.models.users.authenticate.bind(this, validUsername, validPassword);

      return helpers.testDatabaseChanges(cfg, func)
        .then((data) => {
          Code.expect(data).be.undefined();
        });
      });
  });
});
