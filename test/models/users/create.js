'use strict';

const Code     = require('code');
const Lab      = require('lab');
const helpers  = require('../../_helpers');
const config   = require('../../../src/config');
const models   = require('../../../src/models');
const schemas  = require('../../../src/schemas');

const cfg = config.load('test');

const lab = exports.lab = Lab.script();

lab.experiment('models.users.create(payload)', () => {

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

  lab.experiment('Malformed payload', () => {

    lab.test('Should reject with a "malformed" error', () => {

      const malformedPayload = {};

      return server.plugins.models.users.create(malformedPayload)
        .then(() => {
          throw new Error('Expected promise to reject');
        })
        .catch((err) => {
          Code.expect(err).to.be.an.error('payload is malformed');
        });
    });
  });

  lab.experiment('Payload.username is already taken', () => {

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(cfg);
    });

    lab.test('Should reject with an "already exists" error', () => {

      const duplicateUsername = {
        username: 'homer',
        real_name: 'Homer Simpson',
        email_address: 'homer@example.com',
        password: 'password',
        password_confirmation: 'password',
      };

      return server.plugins.models.users.create(duplicateUsername)
        .then(() => {
          throw new Error('Expected promise to reject');
        })
        .catch((err) => {
          Code.expect(err).to.be.an.error('username already exists');
        });
    });
  });

  lab.experiment('Valid Input', () => {

    const validPayload = {
      username: 'poochie',
      real_name: 'Poochie',
      email_address: 'poochie@example.com',
      password: 'ToTheMax',
      password_confirmation: 'ToTheMax',
    };

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(cfg);
    });

    lab.test('Should resolve with the username of the new user', () => {

      return server.plugins.models.users.create(validPayload)
        .then((data) => {
          Code.expect(data).to.equal('poochie');
        });
    });

    lab.test('Should modify database as expected', () => {
      
      const func = server.plugins.models.users.create.bind(this, validPayload);

      return helpers.testDatabaseChanges(cfg, func)
        .then((changes) => {

          Code.expect(changes).to.be.an.array();
          Code.expect(changes).to.have.length(1);

          Code.expect(changes[0].kind).to.equal('N');
          Code.expect(changes[0].path).to.equal([ 'users', '15']);
        });
    });
  });
});
