'use strict';

const Code     = require('code');
const Lab      = require('lab');
const helpers  = require('../../_helpers');
const config   = require('../../../src/config');
const models   = require('../../../src/models');
const schemas  = require('../../../src/schemas');

const cfg = config.load('test');

const lab = exports.lab = Lab.script();

lab.experiment('models.users.destroy(username, currentUser)', () => {

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

      return server.plugins.models.users.destroy(mismatchedUsername, mismatchedCurrentUser)
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
      const malformedCurrentUser = 12345;

      return server.plugins.models.users.destroy(malformedUsername, malformedCurrentUser)
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

      return server.plugins.models.users.destroy(nonexistentUsername, nonexistentCurrentUser)
        .then(() => {
          throw new Error('Expected promise to reject');
        })
        .catch((err) => {
          Code.expect(err).to.be.an.error('username does not exist');
        });
    });
  });

  lab.experiment('Valid Input', () => {

    const validUsername    = 'homer';
    const validCurrentUser = 'homer';

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(cfg);
    });

    lab.test('Should resolve with boolean true', () => {

      return server.plugins.models.users.destroy(validUsername, validCurrentUser)
        .then((data) => {
          Code.expect(data).to.be.a.boolean();
          Code.expect(data).to.be.true();
        });
    });

    lab.test('Should modify database as expected', () => {
      
      const func = server.plugins.models.users.destroy.bind(this, validUsername, validCurrentUser);

      return helpers.testDatabaseChanges(cfg, func)
        .then((changes) => {
          
          Code.expect(changes).to.be.an.array();
          Code.expect(changes).to.have.length(50);

          Code.expect(changes[0].kind).to.equal('D');
          Code.expect(changes[0].path).to.equal([ 'groups', '1']);
          
          Code.expect(changes[1].kind).to.equal('D');
          Code.expect(changes[1].path).to.equal([ 'groups', '2']);
          
          Code.expect(changes[2].kind).to.equal('D');
          Code.expect(changes[2].path).to.equal([ 'groups', '3']);
          
          Code.expect(changes[3].kind).to.equal('D');
          Code.expect(changes[3].path).to.equal([ 'groups', '4']);

          Code.expect(changes[4].kind).to.equal('D');
          Code.expect(changes[4].path).to.equal([ 'group_members', '1']);
          
          Code.expect(changes[5].kind).to.equal('D');
          Code.expect(changes[5].path).to.equal([ 'group_members', '2']);
          
          Code.expect(changes[6].kind).to.equal('D');
          Code.expect(changes[6].path).to.equal([ 'group_members', '3']);
          
          Code.expect(changes[7].kind).to.equal('D');
          Code.expect(changes[7].path).to.equal([ 'group_members', '4']);
          
          Code.expect(changes[8].kind).to.equal('D');
          Code.expect(changes[8].path).to.equal([ 'group_members', '5']);
          
          Code.expect(changes[9].kind).to.equal('D');
          Code.expect(changes[9].path).to.equal([ 'group_members', '6']);
          
          Code.expect(changes[10].kind).to.equal('D');
          Code.expect(changes[10].path).to.equal([ 'group_members', '7']);
          
          Code.expect(changes[11].kind).to.equal('D');
          Code.expect(changes[11].path).to.equal([ 'group_members', '8']);
          
          Code.expect(changes[12].kind).to.equal('D');
          Code.expect(changes[12].path).to.equal([ 'group_members', '9']);

          Code.expect(changes[13].kind).to.equal('D');
          Code.expect(changes[13].path).to.equal([ 'group_members', '12']);
          
          Code.expect(changes[14].kind).to.equal('D');
          Code.expect(changes[14].path).to.equal([ 'group_members', '22']);
          
          Code.expect(changes[15].kind).to.equal('D');
          Code.expect(changes[15].path).to.equal([ 'group_members', '30']);
          
          Code.expect(changes[16].kind).to.equal('D');
          Code.expect(changes[16].path).to.equal([ 'group_members', '34']);
          
          Code.expect(changes[17].kind).to.equal('D');
          Code.expect(changes[17].path).to.equal([ 'group_members', '38']);
          
          Code.expect(changes[18].kind).to.equal('D');
          Code.expect(changes[18].path).to.equal([ 'group_members', '44']);
          
          Code.expect(changes[19].kind).to.equal('D');
          Code.expect(changes[19].path).to.equal([ 'group_members', '50']);

          Code.expect(changes[20].kind).to.equal('D');
          Code.expect(changes[20].path).to.equal([ 'notes', '1']);
          
          Code.expect(changes[21].kind).to.equal('D');
          Code.expect(changes[21].path).to.equal([ 'notes', '2']);
          
          Code.expect(changes[22].kind).to.equal('D');
          Code.expect(changes[22].path).to.equal([ 'notes', '3']);
          
          Code.expect(changes[23].kind).to.equal('D');
          Code.expect(changes[23].path).to.equal([ 'notes', '4']);
          
          Code.expect(changes[24].kind).to.equal('D');
          Code.expect(changes[24].path).to.equal([ 'notes', '5']);
          
          Code.expect(changes[25].kind).to.equal('D');
          Code.expect(changes[25].path).to.equal([ 'notes', '6']);
          
          Code.expect(changes[26].kind).to.equal('D');
          Code.expect(changes[26].path).to.equal([ 'notes', '7']);
          
          Code.expect(changes[27].kind).to.equal('D');
          Code.expect(changes[27].path).to.equal([ 'notes', '8']);
          
          Code.expect(changes[28].kind).to.equal('D');
          Code.expect(changes[28].path).to.equal([ 'notes', '9']);

          Code.expect(changes[29].kind).to.equal('D');
          Code.expect(changes[29].path).to.equal([ 'note_grants', '1']);
          
          Code.expect(changes[30].kind).to.equal('D');
          Code.expect(changes[30].path).to.equal([ 'note_grants', '2']);
          
          Code.expect(changes[31].kind).to.equal('D');
          Code.expect(changes[31].path).to.equal([ 'note_grants', '3']);
          
          Code.expect(changes[32].kind).to.equal('D');
          Code.expect(changes[32].path).to.equal([ 'note_grants', '4']);
          
          Code.expect(changes[33].kind).to.equal('D');
          Code.expect(changes[33].path).to.equal([ 'note_grants', '5']);
          
          Code.expect(changes[34].kind).to.equal('D');
          Code.expect(changes[34].path).to.equal([ 'note_grants', '6']);
          
          Code.expect(changes[35].kind).to.equal('D');
          Code.expect(changes[35].path).to.equal([ 'note_grants', '7']);
          
          Code.expect(changes[36].kind).to.equal('D');
          Code.expect(changes[36].path).to.equal([ 'note_grants', '8']);

          Code.expect(changes[37].kind).to.equal('D');
          Code.expect(changes[37].path).to.equal([ 'note_grants', '12']);
          
          Code.expect(changes[38].kind).to.equal('D');
          Code.expect(changes[38].path).to.equal([ 'note_grants', '18']);
          
          Code.expect(changes[39].kind).to.equal('D');
          Code.expect(changes[39].path).to.equal([ 'note_grants', '26']);
          
          Code.expect(changes[40].kind).to.equal('D');
          Code.expect(changes[40].path).to.equal([ 'note_grants', '34']);
          
          Code.expect(changes[41].kind).to.equal('D');
          Code.expect(changes[41].path).to.equal([ 'note_grants', '45']);
          
          Code.expect(changes[42].kind).to.equal('D');
          Code.expect(changes[42].path).to.equal([ 'note_grants', '50']);
          
          Code.expect(changes[43].kind).to.equal('D');
          Code.expect(changes[43].path).to.equal([ 'note_grants', '55']);
          
          Code.expect(changes[44].kind).to.equal('D');
          Code.expect(changes[44].path).to.equal([ 'note_grants', '60']);
          
          Code.expect(changes[45].kind).to.equal('D');
          Code.expect(changes[45].path).to.equal([ 'note_grants', '66']);
          
          Code.expect(changes[46].kind).to.equal('D');
          Code.expect(changes[46].path).to.equal([ 'note_grants', '72']);
          
          Code.expect(changes[47].kind).to.equal('D');
          Code.expect(changes[47].path).to.equal([ 'note_grants', '78']);
          
          Code.expect(changes[48].kind).to.equal('D');
          Code.expect(changes[48].path).to.equal([ 'note_grants', '84']);
          
          Code.expect(changes[49].kind).to.equal('D');
          Code.expect(changes[49].path).to.equal([ 'users', '1']);
        });
    });
  });
});
