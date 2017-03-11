'use strict';

const engage = function (server) {

  server.route({
    method: 'GET',
    path: '/groups',
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
    path: '/groups',
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
    path: '/groups/{groupID}',
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
    path: '/groups/{groupID}',
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
    path: '/groups/{groupID}',
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
    path: '/groups/{groupID}',
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
