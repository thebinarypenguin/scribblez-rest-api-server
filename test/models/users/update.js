'use strict';

const Code     = require('code');
const Lab      = require('lab');
const helpers  = require('../../_helpers');
const config   = require('../../../src/config');
const models   = require('../../../src/models');
const schemas  = require('../../../src/schemas');

const cfg = config.load('test');

const lab = exports.lab = Lab.script();

lab.experiment('models.users.update(username, payload, currentUser)', () => {

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
      const validPayload          = { real_name: 'The Chosen One' };
      const mismatchedCurrentUser = 'marge';

      return server.plugins.models.users.update(mismatchedUsername, validPayload, mismatchedCurrentUser)
        .then(() => {
          throw new Error('Expected promise to reject');
        })
        .catch((err) => {
          Code.expect(err).to.be.an.error('Permission Denied');
        });
    });
  });

  lab.experiment('Malformed username (and currentUser)', () => {

    lab.test('Should reject with a "malformed" error', () => {

      const malformedUsername    = 12345;
      const validPayload         = { real_name: 'The Chosen One' };
      const malformedCurrentUser = 12345;

      return server.plugins.models.users.update(malformedUsername, validPayload, malformedCurrentUser)
        .then(() => {
          throw new Error('Expected promise to reject');
        })
        .catch((err) => {
          Code.expect(err).to.be.an.error('username is malformed');
        });
    });
  });

  lab.experiment('Malformed payload', () => {

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(cfg);
    });

    lab.test('Should reject with a "malformed" error', () => {

      const validUsername    = 'homer';
      const malformedPayload = {};
      const validCurrentUser = 'homer';

      return server.plugins.models.users.update(validUsername, malformedPayload, validCurrentUser)
        .then(() => {
          throw new Error('Expected promise to reject');
        })
        .catch((err) => {
          Code.expect(err).to.be.an.error('payload is malformed');
        });
    });
  });

  lab.experiment('Nonexistent username (and currentUser)', () => {

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(cfg);
    });

    lab.test('Should reject with a "nonexistent" error', () => {

      const nonexistentUsername    = 'grimey';
      const validPayload           = { real_name: 'The Chosen One' };
      const nonexistentCurrentUser = 'grimey';

      return server.plugins.models.users.update(nonexistentUsername, validPayload, nonexistentCurrentUser)
        .then(() => {
          throw new Error('Expected promise to reject');
        })
        .catch((err) => {
          Code.expect(err).to.be.an.error('username does not exist');
        });
    });
  });

  lab.experiment('Valid Input (real_name only)', () => {

    const validUsername    = 'homer';
    const validPayload     = { real_name: 'The Chosen One' };
    const validCurrentUser = 'homer';

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(cfg);
    });

    lab.test('Should resolve with boolean true', () => {

      return server.plugins.models.users.update(validUsername, validPayload, validCurrentUser)
        .then((data) => {
          Code.expect(data).to.be.a.boolean();
          Code.expect(data).to.be.true();
        });
    });

    lab.test('Should modify database as expected', () => {
      
      const func = server.plugins.models.users.update.bind(this, validUsername, validPayload, validCurrentUser);

      return helpers.testDatabaseChanges(cfg, func)
        .then((changes) => {
          
          Code.expect(changes).to.be.an.array();
          Code.expect(changes).to.have.length(1);

          Code.expect(changes[0].kind).to.equal('E');
          Code.expect(changes[0].path).to.equal([ 'users', '1' , 'real_name']);
          Code.expect(changes[0].lhs).to.equal('Homer Simpson');
          Code.expect(changes[0].rhs).to.equal('The Chosen One');
        });
    });
  });

  lab.experiment('Valid Input (everything but real_name)', () => {

    const validUsername    = 'homer';
    const validPayload     = {
      email_address: 'TheChosenOne@example.com',
      password: 'stonecutter',
      password_confirmation: 'stonecutter',
    };
    const validCurrentUser = 'homer';

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(cfg);
    });

    lab.test('Should resolve with boolean true', () => {

      return server.plugins.models.users.update(validUsername, validPayload, validCurrentUser)
        .then((data) => {
          Code.expect(data).to.be.a.boolean();
          Code.expect(data).to.be.true();
        });
    });

    lab.test('Should modify database as expected', () => {
      
      const func = server.plugins.models.users.update.bind(this, validUsername, validPayload, validCurrentUser);

      return helpers.testDatabaseChanges(cfg, func)
        .then((changes) => {
          
          Code.expect(changes).to.be.an.array();
          Code.expect(changes).to.have.length(2);

          Code.expect(changes[0].kind).to.equal('E');
          Code.expect(changes[0].path).to.equal([ 'users', '1' , 'email_address']);
          Code.expect(changes[0].lhs).to.equal('homer@example.com');
          Code.expect(changes[0].rhs).to.equal('TheChosenOne@example.com');

          Code.expect(changes[1].kind).to.equal('E');
          Code.expect(changes[1].path).to.equal([ 'users', '1' , 'password_hash']);
        });
    });
  });
});
