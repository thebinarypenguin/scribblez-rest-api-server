'use strict';

const engage = function (server) {

  server.route({
    method: 'POST',
    path: '/users',
    handler: (request, reply) => {
      reply({ foo: 'bar' });
    },
  });

  server.route({
    method: 'GET',
    path: '/users/{username}',
    handler: (request, reply) => {
      reply({ foo: 'bar' });
    },
  });

  server.route({
    method: 'PUT',
    path: '/users/{username}',
    handler: (request, reply) => {
      reply({ foo: 'bar' });
    },
  });

  server.route({
    method: 'PATCH',
    path: '/users/{username}',
    handler: (request, reply) => {
      reply({ foo: 'bar' });
    },
  });

  server.route({
    method: 'DELETE',
    path: '/users/{username}',
    handler: (request, reply) => {
      reply({ foo: 'bar' });
    },
  });
};

module.exports = engage;
