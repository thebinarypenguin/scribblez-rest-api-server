'use strict';

const Boom = require('boom');

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
      
      const currentUser = request.auth.credentials.username;

      server.plugins.models.groups.findAll(currentUser)
        .then((data) => {
          reply(data);
        })
        .catch((err) => {

          return reply(Boom.badImplementation(err.message));
        });
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

      const currentUser = request.auth.credentials.username;

      server.plugins.models.groups.create(request.payload, currentUser)
        .then((data) => {
          reply(null).header('Location', `${server.info.uri}/groups/${data}`);
        })
        .catch((err) => {

          if (err.message === 'payload is malformed') {
            return reply(Boom.badRequest(err.message));
          }

          return reply(Boom.badImplementation(err.message));
        });
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

      const groupID = parseInt(request.params.groupID, 10);
      const currentUser = request.auth.credentials.username;
      
      server.plugins.models.groups.findByID(groupID, currentUser)
        .then((data) => {
          reply(data);
        })
        .catch((err) => {

          if (err.message === 'groupID is malformed') {
            return reply(Boom.badRequest(err.message));
          }

          if (err.message === 'groupID does not exist') {
            return reply(Boom.notFound(err.message));
          }

          return reply(Boom.badImplementation(err.message));
        });
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

      const groupID = parseInt(request.params.groupID, 10);
      const currentUser = request.auth.credentials.username;
      
      server.plugins.models.groups.replace(groupID, request.payload, currentUser)
        .then(() => {
          reply(null);
        })
        .catch((err) => {

          if (err.message === 'groupID is malformed') {
            return reply(Boom.badRequest(err.message));
          }

          if (err.message === 'groupID does not exist') {
            return reply(Boom.notFound(err.message));
          }

          if (err.message === 'payload is malformed') {
            return reply(Boom.badRequest(err.message));
          }

          return reply(Boom.badImplementation(err.message));
        });
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

      const groupID = parseInt(request.params.groupID, 10);
      const currentUser = request.auth.credentials.username;
      
      server.plugins.models.groups.update(groupID, request.payload, currentUser)
        .then(() => {
          reply(null);
        })
        .catch((err) => {

          if (err.message === 'groupID is malformed') {
            return reply(Boom.badRequest(err.message));
          }

          if (err.message === 'groupID does not exist') {
            return reply(Boom.notFound(err.message));
          }

          if (err.message === 'payload is malformed') {
            return reply(Boom.badRequest(err.message));
          }

          return reply(Boom.badImplementation(err.message));
        });
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

      const groupID = parseInt(request.params.groupID, 10);
      const currentUser = request.auth.credentials.username;
      
      server.plugins.models.groups.destroy(groupID, currentUser)
        .then(() => {
          reply(null);
        })
        .catch((err) => {

          if (err.message === 'groupID is malformed') {
            return reply(Boom.badRequest(err.message));
          }

          if (err.message === 'groupID does not exist') {
            return reply(Boom.notFound(err.message));
          }

          return reply(Boom.badImplementation(err.message));
        });
    },
  });
};

module.exports = engage;
