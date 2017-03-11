'use strict';

const engage = function (server) {

  server.route({
    method: 'GET',
    path: '/notes',
    config: {
      auth: {
        mode: 'required',
        strategy: 'simple',
      },
    },
    handler: (request, reply) => {
      reply({ foo: 'bar' });
    },
  });

  server.route({
    method: 'POST',
    path: '/notes',
    config: {
      auth: {
        mode: 'required',
        strategy: 'simple',
      },
    },
    handler: (request, reply) => {
      reply({ foo: 'bar' });
    },
  });

  server.route({
    method: 'GET',
    path: '/notes/{noteID}',
    config: {
      auth: {
        mode: 'required',
        strategy: 'simple',
      },
    },
    handler: (request, reply) => {
      reply({ foo: 'bar' });
    },
  });

  server.route({
    method: 'PUT',
    path: '/notes/{noteID}',
    config: {
      auth: {
        mode: 'required',
        strategy: 'simple',
      },
    },
    handler: (request, reply) => {
      reply({ foo: 'bar' });
    },
  });

  server.route({
    method: 'PATCH',
    path: '/notes/{noteID}',
    config: {
      auth: {
        mode: 'required',
        strategy: 'simple',
      },
    },
    handler: (request, reply) => {
      reply({ foo: 'bar' });
    },
  });

  server.route({
    method: 'DELETE',
    path: '/notes/{noteID}',
    config: {
      auth: {
        mode: 'required',
        strategy: 'simple',
      },
    },
    handler: (request, reply) => {
      reply({ foo: 'bar' });
    },
  });
};

module.exports = engage;
