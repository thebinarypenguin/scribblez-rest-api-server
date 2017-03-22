'use strict';

const Boom = require('boom');

const engage = function (server) {

  server.route({
    method: 'POST',
    path: '/users',
    config: {
      auth: false,
      json: {
        space: 2,
        suffix: "\n",
      },
    },
    handler: (request, reply) => {
      
      server.plugins.models.users.create(request.payload)
        .then((data) => {
          reply(null).code(201).header('Location', `${server.info.uri}/users/${data}`);
        })
        .catch((err) => {

          if (err.message === 'payload is malformed') {
            return reply(Boom.badRequest('body is malformed'));
          }

          if (err.message === 'username already exists') {
            return reply(Boom.badRequest(err.message));
          }

          return reply(Boom.badImplementation(err.message));
        });
    },
  });

  server.route({
    method: 'GET',
    path: '/users/{username}',
    config: {
      auth: {
        mode: 'required',
        strategy: 'simple',
      },
      json: {
        space: 2,
        suffix: "\n",
      },
    },
    handler: (request, reply) => {

      const username = request.params.username;
      const currentUser = request.auth.credentials.username;
      
      server.plugins.models.users.findByUsername(username, currentUser)
        .then((data) => {
          reply(data);
        })
        .catch((err) => {

          if (err.message === 'Permission denied') {
            return reply(Boom.forbidden(err.message));
          }

          if (err.message === 'username is malformed') {
            return reply(Boom.badRequest(err.message));
          }

          if (err.message === 'username does not exist') {
            return reply(Boom.notFound(err.message));
          }

          return reply(Boom.badImplementation(err.message));
        });
    },
  });

  server.route({
    method: 'PUT',
    path: '/users/{username}',
    config: {
      auth: {
        mode: 'required',
        strategy: 'simple',
      },
      json: {
        space: 2,
        suffix: "\n",
      },
    },
    handler: (request, reply) => {

      const username = request.params.username;
      const currentUser = request.auth.credentials.username;
      
      server.plugins.models.users.replace(username, request.payload, currentUser)
        .then(() => {
          reply(null);
        })
        .catch((err) => {

          if (err.message === 'Permission denied') {
            return reply(Boom.forbidden(err.message));
          }

          if (err.message === 'username is malformed') {
            return reply(Boom.badRequest(err.message));
          }

          if (err.message === 'username does not exist') {
            return reply(Boom.notFound(err.message));
          }

          if (err.message === 'payload is malformed') {
            return reply(Boom.badRequest('body is malformed'));
          }

          return reply(Boom.badImplementation(err.message));
        });
    },
  });

  server.route({
    method: 'PATCH',
    path: '/users/{username}',
    config: {
      auth: {
        mode: 'required',
        strategy: 'simple',
      },
      json: {
        space: 2,
        suffix: "\n",
      },
    },
    handler: (request, reply) => {

      const username = request.params.username;
      const currentUser = request.auth.credentials.username;
      
      server.plugins.models.users.update(username, request.payload, currentUser)
        .then(() => {
          reply(null);
        })
        .catch((err) => {

          if (err.message === 'Permission denied') {
            return reply(Boom.forbidden(err.message));
          }

          if (err.message === 'username is malformed') {
            return reply(Boom.badRequest(err.message));
          }

          if (err.message === 'username does not exist') {
            return reply(Boom.notFound(err.message));
          }

          if (err.message === 'payload is malformed') {
            return reply(Boom.badRequest('body is malformed'));
          }

          return reply(Boom.badImplementation(err.message));
        });
    },
  });

  server.route({
    method: 'DELETE',
    path: '/users/{username}',
    config: {
      auth: {
        mode: 'required',
        strategy: 'simple',
      },
      json: {
        space: 2,
        suffix: "\n",
      },
    },
    handler: (request, reply) => {

      const username = request.params.username;
      const currentUser = request.auth.credentials.username;
      
      server.plugins.models.users.destroy(username, currentUser)
        .then(() => {
          reply(null);
        })
        .catch((err) => {

          if (err.message === 'Permission denied') {
            return reply(Boom.forbidden(err.message));
          }

          if (err.message === 'username is malformed') {
            return reply(Boom.badRequest(err.message));
          }

          if (err.message === 'username does not exist') {
            return reply(Boom.notFound(err.message));
          }

          return reply(Boom.badImplementation(err.message));
        });
    },
  });
};

module.exports = engage;
