'use strict';

const Bluebird = require('bluebird');
const deepDiff = require('deep-diff');
const Hapi     = require('hapi');
const knex     = require('knex');
const testData = require('./the-simpsons.js');

const pub = {};

pub.initializeTestServer = function (config, plugins) {

  return new Bluebird((resolve, reject) => {

    const server = new Hapi.Server();

    server.connection({
      host: config.hapi.host,
      port: config.hapi.port,
    });

    server.register(plugins, (err) => {

      if (err) { return reject(err); }

      server.initialize((err) => {

        if (err) { return reject(err); }

        resolve(server);
      });
    });
  });
};

pub.checkDatabase = function (config) {

  const db = knex(config.knex);

  const tables = ['groups', 'group_members', 'notes', 'note_grants', 'users'];

  const message = 'The specified database already contains data. '
                + 'Please remove the data manually or specify another database.';

  return Bluebird
    .each(tables, (t) => {

      return db
        .select('id')
        .from(t)
        .then((result) => {

          if (result.length > 0) {
            throw new Error(message);
          }
        });
    })
    .then(() => {
      return db.destroy();
    })
    .then(() => {
      return true;
    });
};

pub.resetDatabase = function (config) {

  const db = knex(config.knex);

  return db
    .raw('TRUNCATE groups, group_members, notes, note_grants, users RESTART IDENTITY;')
    .then(() => {
      return testData.seed(db, Bluebird);
    })
    .then(() => {
      return db.destroy();
    })
    .then(() => {
      return true;
    });
};

pub.emptyDatabase = function (config) {

  const db = knex(config.knex);

  return db
    .raw('TRUNCATE groups, group_members, notes, note_grants, users RESTART IDENTITY;')
    .then(() => {
      return db.destroy();
    })
    .then(() => {
      return true;
    });
};

pub.testDatabaseChanges = function (config, func) {

  const db = knex(config.knex);

  const dump = function () {

    const tables = ['groups', 'group_members', 'notes', 'note_grants', 'users'];
    const dump = {};

    return Bluebird
      .each(tables, (t) => {

        return db
          .select('*')
          .from(t)
          .orderBy('id')
          .then((result) => {
          
            let obj = {};

            // Index by string to make diff-friendly
            result.forEach((row) => {
              obj[`${row.id}`] = row;
            });

            dump[t] = obj;
          });
      })
      .then(() => {
        return dump;
      });    
  };

  let before = null;
  let after  = null;

  return Bluebird
    .resolve()
    .then(() => {
      return dump().then((data) => { before = data; });
    })
    .then(() => {
      return func();
    })
    .then(() => {
      return dump().then((data) => { after = data; });
    })
    .then(() => {
      return db.destroy();
    })
    .then(() => {
      return deepDiff.diff(before, after);
    });
};

module.exports = pub;