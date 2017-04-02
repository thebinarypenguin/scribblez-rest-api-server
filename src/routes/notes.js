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
    },
    handler: (request, reply) => {

      const currentUser = request.auth.credentials.username;

      server.plugins.models.notes.findAll(currentUser)
        .then((data) => {
          reply(data);
        })
        .catch(() => {
          reply(Boom.badImplementation());
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
    },
    handler: (request, reply) => {

      const payload     = request.payload;
      const currentUser = request.auth.credentials.username;

      server.plugins.models.notes.create(payload, currentUser)
        .then((data) => {
          reply(null).code(201).header('Location', `${server.info.uri}/notes/${data}`);
        })
        .catch((err) => {

          if (err.message === 'payload is malformed') {
            reply(Boom.badRequest('body is malformed'));
          }

          else {
            reply(Boom.badImplementation());
          }
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
    },
    handler: (request, reply) => {

      const noteID      = parseInt(request.params.noteID, 10);
      const currentUser = request.auth.credentials.username;
      
      server.plugins.models.notes.findByID(noteID, currentUser)
        .then((data) => {
          reply(data);
        })
        .catch((err) => {

          if (err.message === 'noteID is malformed') {
            reply(Boom.badRequest(err.message));
          }

          else if (err.message === 'noteID does not exist') {
            reply(Boom.notFound(err.message));
          }

          else if (err.message === 'Permission denied') {
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
    path: '/notes/{noteID}',
    config: {
      auth: {
        mode: 'required',
        strategy: 'simple',
      },
    },
    handler: (request, reply) => {

      const noteID      = parseInt(request.params.noteID, 10);
      const payload     = request.payload;
      const currentUser = request.auth.credentials.username;
      
      server.plugins.models.notes.replace(noteID, payload, currentUser)
        .then(() => {
          reply(null);
        })
        .catch((err) => {

          if (err.message === 'noteID is malformed') {
            reply(Boom.badRequest(err.message));
          }

          else if (err.message === 'noteID does not exist') {
            reply(Boom.notFound(err.message));
          }

          else if (err.message === 'payload is malformed') {
            reply(Boom.badRequest('body is malformed'));
          }

          else if (err.message === 'Permission denied') {
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
    path: '/notes/{noteID}',
    config: {
      auth: {
        mode: 'required',
        strategy: 'simple',
      },
    },
    handler: (request, reply) => {

      const noteID      = parseInt(request.params.noteID, 10);
      const payload     = request.payload;
      const currentUser = request.auth.credentials.username;
      
      server.plugins.models.notes.update(noteID, payload, currentUser)
        .then(() => {
          reply(null);
        })
        .catch((err) => {

          if (err.message === 'noteID is malformed') {
            reply(Boom.badRequest(err.message));
          }

          else if (err.message === 'noteID does not exist') {
            reply(Boom.notFound(err.message));
          }

          else if (err.message === 'payload is malformed') {
            reply(Boom.badRequest('body is malformed'));
          }

          else if (err.message === 'Permission denied') {
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
    path: '/notes/{noteID}',
    config: {
      auth: {
        mode: 'required',
        strategy: 'simple',
      },
    },
    handler: (request, reply) => {

      const noteID      = parseInt(request.params.noteID, 10);
      const currentUser = request.auth.credentials.username;
      
      server.plugins.models.notes.destroy(noteID, currentUser)
        .then(() => {
          reply(null);
        })
        .catch((err) => {

          if (err.message === 'noteID is malformed') {
            reply(Boom.badRequest(err.message));
          }

          else if (err.message === 'noteID does not exist') {
            reply(Boom.notFound(err.message));
          }

          else if (err.message === 'Permission denied') {
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
