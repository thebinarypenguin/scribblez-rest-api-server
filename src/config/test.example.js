'use strict';

const settings = {};

settings.environment = 'test';

settings.hapi = {
  host: 'localhost',
  port: 8000,
};

settings.knex = {
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'scribblez',
    password : 'scribblez',
    database : 'scribblez',
  },
};

module.exports = settings;
