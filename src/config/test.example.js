'use strict';

const settings = {};

settings.environment = 'test';

settings.hapi = {
  server: {
    connections: {
      router: {
        stripTrailingSlash: true,
      },
      routes: {
        json: {
          space: 2,
          suffix: "\n",
        },
      },
    },
  },

  connection: {    
    host: 'localhost',
    port: 8000,
  },
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
