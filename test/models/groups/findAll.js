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

lab.experiment('models.groups.findAll(currentUser)', () => {

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

  lab.experiment('Malformed currentUser', () => {

    lab.test('Should reject with a "malformed" error', () => {

      const malformedCurrentUser = 12345;

      return server.plugins.models.groups.findAll(malformedCurrentUser)
        .then(() => {
          throw new Error('Expected promise to reject');
        })
        .catch((err) => {
          Code.expect(err).to.be.an.error('currentUser is malformed');
        });
    });
  });

  lab.experiment('Nonexistent currentUser', () => {

    lab.test('Should reject with a "nonexistent" error', () => {

      const nonexistentCurrentUser = 'grimey';

      return server.plugins.models.groups.findAll(nonexistentCurrentUser)
        .then(() => {
          throw new Error('Expected promise to reject');
        })
        .catch((err) => {
          Code.expect(err).to.be.an.error('currentUser does not exist');
        });
    });
  });

  lab.experiment('Valid input (no options specified)', () => {

    const validCurrentUser = 'homer';

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(cfg);
    });

    lab.test('Should resolve with data that matches the groupCollection schema', () => {

      return server.plugins.models.groups.findAll(validCurrentUser)
        .then((data) => {
          Joi.assert(data, server.plugins.schemas.groupCollection);
        });
    });
    
    lab.test('Should resolve with data that matches the expected data', () => {

      const expectedData = [
        {
          id: 1,
          name: 'Family',
          members: [
            {
              real_name: 'Marge Simpson',
              username: 'marge',
            },
            {
              real_name: 'Bart Simpson',
              username: 'bart',
            },
            {
              real_name: 'Lisa Simpson',
              username: 'lisa',
            },
            {
              real_name: 'Maggie Simpson',
              username: 'maggie',
            },
          ],
        },
        {
          id: 2,
          name: 'Friends',
          members: [
            {
              real_name: 'Lenny Leonard',
              username: 'lenny',
            },
            {
              real_name: 'Carl Carlson',
              username: 'carl',
            },
          ],
        },
        {
          id: 3,
          name: 'In-Laws',
          members: [
            {
              real_name: 'Patty Bouvier',
              username: 'patty',
            },
            {
              real_name: 'Selma Bouvier',
              username: 'selma',
            },
          ],
        },
        {
          id: 4,
          name: 'Stupid Flanders',
          members: [
            {
              real_name: 'Ned Flanders',
              username: 'ned',
            },
          ],
        },
      ];

      return server.plugins.models.groups.findAll(validCurrentUser)
        .then((data) => {
          data.sort((a,b) => { return a.id - b.id; });
          Code.expect(data).to.equal(expectedData);
        });
    });
    
    lab.test('Should not modify the database', () => {

      const func = server.plugins.models.groups.findAll.bind(this, validCurrentUser);

      return helpers.testDatabaseChanges(cfg, func)
        .then((data) => {
          Code.expect(data).be.undefined();
        });
    });
  });

  lab.experiment('Valid input (options.page specified)', () => {

    const validCurrentUser = 'homer';
    const options          = { page: 2, per_page: 3 };  

    // NOTE: I don't have enough sample data to let per_page be the default

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(cfg);
    });

    lab.test('Should resolve with data that matches the groupCollection schema', () => {

      return server.plugins.models.groups.findAll(validCurrentUser, options)
        .then((data) => {
          Joi.assert(data, server.plugins.schemas.groupCollection);
        });
    });
    
    lab.test('Should resolve with data that matches the expected data', () => {

      const expectedData = [
        {
          id: 4,
          name: 'Stupid Flanders',
          members: [
            {
              real_name: 'Ned Flanders',
              username: 'ned',
            },
          ],
        },
      ];

      return server.plugins.models.groups.findAll(validCurrentUser, options)
        .then((data) => {
          data.sort((a,b) => { return a.id - b.id; });
          Code.expect(data).to.equal(expectedData);
        });
    });
    
    lab.test('Should not modify the database', () => {

      const func = server.plugins.models.groups.findAll.bind(this, validCurrentUser, options);

      return helpers.testDatabaseChanges(cfg, func)
        .then((data) => {
          Code.expect(data).be.undefined();
        });
    });
  });

  lab.experiment('Valid input (options.per_page specified)', () => {

    const validCurrentUser = 'homer';
    const options          = { per_page: 2 };

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(cfg);
    });

    lab.test('Should resolve with data that matches the groupCollection schema', () => {

      return server.plugins.models.groups.findAll(validCurrentUser, options)
        .then((data) => {
          Joi.assert(data, server.plugins.schemas.groupCollection);
        });
    });
    
    lab.test('Should resolve with data that matches the expected data', () => {

      const expectedData = [
        {
          id: 1,
          name: 'Family',
          members: [
            {
              real_name: 'Marge Simpson',
              username: 'marge',
            },
            {
              real_name: 'Bart Simpson',
              username: 'bart',
            },
            {
              real_name: 'Lisa Simpson',
              username: 'lisa',
            },
            {
              real_name: 'Maggie Simpson',
              username: 'maggie',
            },
          ],
        },
        {
          id: 2,
          name: 'Friends',
          members: [
            {
              real_name: 'Lenny Leonard',
              username: 'lenny',
            },
            {
              real_name: 'Carl Carlson',
              username: 'carl',
            },
          ],
        },
      ];

      return server.plugins.models.groups.findAll(validCurrentUser, options)
        .then((data) => {
          data.sort((a,b) => { return a.id - b.id; });
          Code.expect(data).to.equal(expectedData);
        });
    });
    
    lab.test('Should not modify the database', () => {

      const func = server.plugins.models.groups.findAll.bind(this, validCurrentUser, options);

      return helpers.testDatabaseChanges(cfg, func)
        .then((data) => {
          Code.expect(data).be.undefined();
        });
    });
  });
});
