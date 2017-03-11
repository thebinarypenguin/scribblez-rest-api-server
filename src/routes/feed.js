'use strict';

const engage = function (server) {

  server.route({
    method: 'GET',
    path: '/feed',
    config: {
      auth: {
        mode: 'try',
        strategy: 'simple',
      },
    },
    handler: (request, reply) => {
      reply({ foo: 'bar' });
    },
  });

  server.route({
    method: 'GET',
    path: '/feed/{username}',
    config: {
      auth: {
        mode: 'try',
        strategy: 'simple',
      },
    },
    handler: (request, reply) => {
      reply({ foo: 'bar' });
    },
  });
};

module.exports = engage;
