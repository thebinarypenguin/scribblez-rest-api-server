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
      const options     = request.query;

      server.plugins.models.groups.findAll(currentUser, options)
        .then((data) => {
          reply(data);
        })
        .catch((err) => {

          if (err.message === 'options is malformed') {
            reply(Boom.badRequest('query parameters are malformed'));
          }

          else {
            reply(Boom.badImplementation());
          }
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

      const payload     = request.payload;
      const currentUser = request.auth.credentials.username;

      server.plugins.models.groups.create(payload, currentUser)
        .then((data) => {
          reply(null).code(201).header('Location', `${server.info.uri}/groups/${data}`);
        })
        .catch((err) => {

          if (err.message === 'payload is malformed') {
            reply(Boom.badRequest('body is malformed'));
          }

          else if (err.message === 'Nonexistent user(s) in payload.members') {
            reply(Boom.badRequest('Nonexistent user(s) in members'))
          }

          else {
            reply(Boom.badImplementation());
          }
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

      const groupID     = parseInt(request.params.groupID, 10);
      const currentUser = request.auth.credentials.username;
      
      server.plugins.models.groups.findByID(groupID, currentUser)
        .then((data) => {
          reply(data);
        })
        .catch((err) => {

          if (err.message === 'groupID is malformed') {
            reply(Boom.badRequest(err.message));
          }

          else if (err.message === 'groupID does not exist') {
            reply(Boom.notFound(err.message));
          }

          else if (err.message === 'Permission Denied') {
            reply(Boom.forbidden(err.message));
          }

          else {
            reply(Boom.badImplementation());
          }
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

      const groupID     = parseInt(request.params.groupID, 10);
      const payload     = request.payload;
      const currentUser = request.auth.credentials.username;
      
      server.plugins.models.groups.replace(groupID, payload, currentUser)
        .then(() => {
          reply(null);
        })
        .catch((err) => {

          if (err.message === 'groupID is malformed') {
            reply(Boom.badRequest(err.message));
          }

          else if (err.message === 'groupID does not exist') {
            reply(Boom.notFound(err.message));
          }

          else if (err.message === 'payload is malformed') {
            reply(Boom.badRequest('body is malformed'));
          }

          else if (err.message === 'Nonexistent user(s) in payload.members') {
            reply(Boom.badRequest('Nonexistent user(s) in members'))
          }

          else if (err.message === 'Permission Denied') {
            reply(Boom.forbidden(err.message));
          }

          else {
            reply(Boom.badImplementation());
          }
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

      const groupID     = parseInt(request.params.groupID, 10);
      const payload     = request.payload;
      const currentUser = request.auth.credentials.username;
      
      server.plugins.models.groups.update(groupID, payload, currentUser)
        .then(() => {
          reply(null);
        })
        .catch((err) => {

          if (err.message === 'groupID is malformed') {
            reply(Boom.badRequest(err.message));
          }

          else if (err.message === 'groupID does not exist') {
            reply(Boom.notFound(err.message));
          }

          else if (err.message === 'payload is malformed') {
            reply(Boom.badRequest('body is malformed'));
          }

          else if (err.message === 'Nonexistent user(s) in payload.members') {
            reply(Boom.badRequest('Nonexistent user(s) in members'))
          }

          else if (err.message === 'Permission Denied') {
            reply(Boom.forbidden(err.message));
          }

          else {
            reply(Boom.badImplementation());
          }
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

      const groupID     = parseInt(request.params.groupID, 10);
      const currentUser = request.auth.credentials.username;
      
      server.plugins.models.groups.destroy(groupID, currentUser)
        .then(() => {
          reply(null);
        })
        .catch((err) => {

          if (err.message === 'groupID is malformed') {
            reply(Boom.badRequest(err.message));
          }

          else if (err.message === 'groupID does not exist') {
            reply(Boom.notFound(err.message));
          }

          else if (err.message === 'Permission Denied') {
            reply(Boom.forbidden(err.message));
          }

          else {
            reply(Boom.badImplementation());
          }
        });
    },
  });
};

module.exports = engage;
