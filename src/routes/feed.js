'use strict';

const Boom = require('boom');

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

      let currentUser = undefined;
      
      if (request.auth.isAuthenticated) {
        currentUser = request.auth.credentials.username
      }

      server.plugins.models.feed.findAll(currentUser)
        .then((data) => {
          reply(data);
        })
        .catch((err) => {
          reply(Boom.badImplementation(err.message));
        });
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

      let currentUser = undefined;
      
      if (request.auth.isAuthenticated) {
        currentUser = request.auth.credentials.username
      }

      server.plugins.models.feed.findByOwner(request.params.username, currentUser)
        .then((data) => {
          reply(data);
        })
        .catch((err) => {

          if (err.message === 'owner is malformed') {
            return reply(Boom.badRequest(err.message));
          }

          if (err.message === 'owner does not exist') {
            return reply(Boom.notFound(err.message));
          }

          return reply(Boom.badImplementation(err.message));
        });
    },
  });
};

module.exports = engage;
