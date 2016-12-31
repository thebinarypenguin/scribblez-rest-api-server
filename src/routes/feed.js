'use strict';

const engage = function (server) {

  server.route({
    method: 'GET',
    path: '/feed',
    handler: (request, reply) => {
      reply({ foo: 'bar' });
    },
  });

  server.route({
    method: 'GET',
    path: '/feed/{username}',
    handler: (request, reply) => {
      reply({ foo: 'bar' });
    },
  });
};

module.exports = engage;
