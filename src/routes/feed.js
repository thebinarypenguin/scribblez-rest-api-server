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

      let currentUser = null;
      
      if (request.auth.isAuthenticated) {
        currentUser = request.auth.credentials.username
      }

      server.plugins.models.feed.findAll(currentUser)
        .then((data) => {
          reply(data);
        })
        .catch(() => {
          reply(Boom.badImplementation());
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

      let owner       = request.params.username;
      let currentUser = null;
      
      if (request.auth.isAuthenticated) {
        currentUser = request.auth.credentials.username
      }

      server.plugins.models.feed.findByOwner(owner, currentUser)
        .then((data) => {
          reply(data);
        })
        .catch((err) => {

          if (err.message === 'owner is malformed') {
            reply(Boom.badRequest('username is malformed'));
          }

          else if (err.message === 'owner does not exist') {
            reply(Boom.notFound('username does not exist'));
          }

          else {
            reply(Boom.badImplementation());
          }
        });
    },
  });
};

module.exports = engage;
