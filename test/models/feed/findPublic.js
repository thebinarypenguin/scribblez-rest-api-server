'use strict';

const Code     = require('code');
const Joi      = require('joi');
const Lab      = require('lab');
const helpers  = require('../../_helpers');
const config   = require('../../../src/config');
const models   = require('../../../src/models');
const schemas  = require('../../../src/schemas');

const lab = exports.lab = Lab.script();

lab.experiment('models.feed.findPublic()', () => {

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

  lab.beforeEach(() => {

    return helpers.resetDatabase(config);
  });

  lab.test('Should resolve with data that matches the noteCollectionRedacted schema', () => {

    return server.plugins.models.feed.findPublic()
      .then((data) => {
        Joi.assert(data, server.plugins.schemas.noteCollectionRedacted);
      });
  });
  
  lab.test('Should resolve with data that matches the expected data', () => {

    const expectedData = [ 
      {
        "body": "Homer Simpson's first public note",
        "id": 1,
        "owner": {
          "real_name": "Homer Simpson",
          "username": "homer",
        },
      },
      {
        "body": "Homer Simpson's second public note",
        "id": 2,
        "owner": {
          "real_name": "Homer Simpson",
          "username": "homer",
        },
      },
      {
        "body": "Homer Simpson's third public note",
        "id": 3,
        "owner": {
          "real_name": "Homer Simpson",
          "username": "homer",
        },
      },
      {
        "body": "Marge Simpson's first public note",
        "id": 10,
        "owner": {
          "real_name": "Marge Simpson",
          "username": "marge",
        },
      },
      {
        "body": "Marge Simpson's second public note",
        "id": 11,
        "owner": {
          "real_name": "Marge Simpson",
          "username": "marge",
        },
      },
      {
        "body": "Marge Simpson's third public note",
        "id": 12,
        "owner": {
          "real_name": "Marge Simpson",
          "username": "marge",
        },
      },
      {
        "body": "Bart Simpson's first public note",
        "id": 20,
        "owner": {
          "real_name": "Bart Simpson",
          "username": "bart",
        },
      },
      {
        "body": "Bart Simpson's second public note",
        "id": 21,
        "owner": {
          "real_name": "Bart Simpson",
          "username": "bart",
        },
      },
      {
        "body": "Bart Simpson's third public note",
        "id": 22,
        "owner": {
          "real_name": "Bart Simpson",
          "username": "bart",
        },
      },
      {
        "body": "Lisa Simpson's first public note",
        "id": 28,
        "owner": {
          "real_name": "Lisa Simpson",
          "username": "lisa",
        },
      },
      {
        "body": "Lisa Simpson's second public note",
        "id": 29,
        "owner": {
          "real_name": "Lisa Simpson",
          "username": "lisa",
        },
      },
      {
        "body": "Lisa Simpson's third public note",
        "id": 30,
        "owner": {
          "real_name": "Lisa Simpson",
          "username": "lisa",
        },
      },
      {
        "body": "Patty Bouvier's first public note",
        "id": 36,
        "owner": {
          "real_name": "Patty Bouvier",
          "username": "patty",
        },
      },
      {
        "body": "Patty Bouvier's second public note",
        "id": 37,
        "owner": {
          "real_name": "Patty Bouvier",
          "username": "patty",
        },
      },
      {
        "body": "Patty Bouvier's third public note",
        "id": 38,
        "owner": {
          "real_name": "Patty Bouvier",
          "username": "patty",
        },
      },
      {
        "body": "Selma Bouvier's first public note",
        "id": 44,
        "owner": {
          "real_name": "Selma Bouvier",
          "username": "selma",
        },
      },
      {
        "body": "Selma Bouvier's second public note",
        "id": 45,
        "owner": {
          "real_name": "Selma Bouvier",
          "username": "selma",
        },
      },
      {
        "body": "Selma Bouvier's third public note",
        "id": 46,
        "owner": {
          "real_name": "Selma Bouvier",
          "username": "selma",
        },
      },
    ];

    return server.plugins.models.feed.findPublic()
      .then((data) => {
        data.sort((a,b) => { return a.id - b.id; });
        Code.expect(data).to.equal(expectedData);
      });
  });
  
  lab.test('Should not modify the database', () => {

    const func = server.plugins.models.feed.findPublic;

    return helpers.testDatabaseChanges(config, func)
      .then((data) => {
        Code.expect(data).be.undefined();
      });
  });
});
