'use strict';

const Boom = require('boom');

const engage = function (server) {

  server.route({
    method: 'POST',
    path: '/users',
    config: {
      auth: false,
    },
    handler: (request, reply) => {
      
      server.plugins.models.users.create(request.payload)
        .then((data) => {
          reply(null).code(201).header('Location', `${server.info.uri}/users/${data}`);
        })
        .catch((err) => {

          if (err.message === 'payload is malformed') {
            reply(Boom.badRequest('body is malformed'));
          }

          else if (err.message === 'username already exists') {
            reply(Boom.badRequest(err.message));
          }

          else {
            reply(Boom.badImplementation());
          }
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
            reply(Boom.forbidden(err.message));
          }

          else if (err.message === 'username is malformed') {
            reply(Boom.badRequest(err.message));
          }

          else if (err.message === 'username does not exist') {
            reply(Boom.notFound(err.message));
          }

          else {
            reply(Boom.badImplementation());
          }
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
            reply(Boom.forbidden(err.message));
          }

          else if (err.message === 'username is malformed') {
            reply(Boom.badRequest(err.message));
          }

          else if (err.message === 'username does not exist') {
            reply(Boom.notFound(err.message));
          }

          else if (err.message === 'payload is malformed') {
            reply(Boom.badRequest('body is malformed'));
          }

          else {
            reply(Boom.badImplementation());
          }
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
            reply(Boom.forbidden(err.message));
          }

          else if (err.message === 'username is malformed') {
            reply(Boom.badRequest(err.message));
          }

          else if (err.message === 'username does not exist') {
            reply(Boom.notFound(err.message));
          }

          else if (err.message === 'payload is malformed') {
            reply(Boom.badRequest('body is malformed'));
          }

          else {
            reply(Boom.badImplementation());
          }
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
            reply(Boom.forbidden(err.message));
          }

          else if (err.message === 'username is malformed') {
            reply(Boom.badRequest(err.message));
          }

          else if (err.message === 'username does not exist') {
            reply(Boom.notFound(err.message));
          }

          else {
            reply(Boom.badImplementation());
          }
        });
    },
  });
};

module.exports = engage;
