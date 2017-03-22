'use strict';

const Boom = require('boom');

const engage = function (server) {

  server.route({
    method: 'GET',
    path: '/notes',
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

      const currentUser = request.auth.credentials.username;

      server.plugins.models.notes.findAll(currentUser)
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
    path: '/notes',
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

      const currentUser = request.auth.credentials.username;

      server.plugins.models.notes.create(request.payload, currentUser)
        .then((data) => {
          reply(null).code(201).header('Location', `${server.info.uri}/notes/${data}`);
        })
        .catch((err) => {

          if (err.message === 'payload is malformed') {
            return reply(Boom.badRequest('body is malformed'));
          }

          return reply(Boom.badImplementation(err.message));
        });
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
      json: {
        space: 2,
        suffix: "\n",
      },
    },
    handler: (request, reply) => {

      const noteID = parseInt(request.params.noteID, 10);
      const currentUser = request.auth.credentials.username;
      
      server.plugins.models.notes.findByID(noteID, currentUser)
        .then((data) => {
          reply(data);
        })
        .catch((err) => {

          if (err.message === 'noteID is malformed') {
            return reply(Boom.badRequest(err.message));
          }

          if (err.message === 'noteID does not exist') {
            return reply(Boom.notFound(err.message));
          }

          if (err.message === 'Permission denied') {
            return reply(Boom.forbidden(err.message));
          }

          return reply(Boom.badImplementation(err.message));
        });
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
      json: {
        space: 2,
        suffix: "\n",
      },
    },
    handler: (request, reply) => {

      const noteID = parseInt(request.params.noteID, 10);
      const currentUser = request.auth.credentials.username;
      
      server.plugins.models.notes.replace(noteID, request.payload, currentUser)
        .then(() => {
          reply(null);
        })
        .catch((err) => {

          if (err.message === 'noteID is malformed') {
            return reply(Boom.badRequest(err.message));
          }

          if (err.message === 'noteID does not exist') {
            return reply(Boom.notFound(err.message));
          }

          if (err.message === 'payload is malformed') {
            return reply(Boom.badRequest('body is malformed'));
          }

          if (err.message === 'Permission denied') {
            return reply(Boom.forbidden(err.message));
          }

          return reply(Boom.badImplementation(err.message));
        });
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
      json: {
        space: 2,
        suffix: "\n",
      },
    },
    handler: (request, reply) => {

      const noteID = parseInt(request.params.noteID, 10);
      const currentUser = request.auth.credentials.username;
      
      server.plugins.models.notes.update(noteID, request.payload, currentUser)
        .then(() => {
          reply(null);
        })
        .catch((err) => {

          if (err.message === 'noteID is malformed') {
            return reply(Boom.badRequest(err.message));
          }

          if (err.message === 'noteID does not exist') {
            return reply(Boom.notFound(err.message));
          }

          if (err.message === 'payload is malformed') {
            return reply(Boom.badRequest('body is malformed'));
          }

          if (err.message === 'Permission denied') {
            return reply(Boom.forbidden(err.message));
          }

          return reply(Boom.badImplementation(err.message));
        });
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
      json: {
        space: 2,
        suffix: "\n",
      },
    },
    handler: (request, reply) => {

      const noteID = parseInt(request.params.noteID, 10);
      const currentUser = request.auth.credentials.username;
      
      server.plugins.models.notes.destroy(noteID, currentUser)
        .then(() => {
          reply(null);
        })
        .catch((err) => {

          if (err.message === 'noteID is malformed') {
            return reply(Boom.badRequest(err.message));
          }

          if (err.message === 'noteID does not exist') {
            return reply(Boom.notFound(err.message));
          }

          if (err.message === 'Permission denied') {
            return reply(Boom.forbidden(err.message));
          }

          return reply(Boom.badImplementation(err.message));
        });
    },
  });
};

module.exports = engage;
