'use strict';

const Code      = require('code');
const AuthBasic = require('hapi-auth-basic');
const Joi       = require('joi');
const Lab       = require('lab');
const helpers   = require('../../_helpers');
const config    = require('../../../src/config');
const auth      = require('../../../src/auth');
const models    = require('../../../src/models');
const routes    = require('../../../src/routes');
const schemas   = require('../../../src/schemas');

const lab = exports.lab = Lab.script();

lab.experiment('PATCH /notes/{noteID}', () => {

  let server = null;
  
  lab.before(() => {

    return helpers.initializeTestServer(config, [AuthBasic, auth, models, routes, schemas])
      .then((testServer) => {
        server = testServer;
      });
  });

  lab.experiment('No Authorization header', () => {

    const noAuth = {
      method: 'PATCH',
      url: '/notes/1',
      payload: {
        body: 'New note name',
      },
    };

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(config);
    });

    lab.test('Status code should be 401 Unauthorized', () => {

      return server.inject(noAuth).then((response) => {
        Code.expect(response.statusCode).to.equal(401);
      });
    });

    lab.test('Content-Type should contain application/json', () => {

      return server.inject(noAuth).then((response) => {
        Code.expect(response.headers['content-type']).to.contain('application/json');
      });
    });

    lab.test('Body should match the error401 schema', () => {

      return server.inject(noAuth).then((response) => {
        Joi.assert(response.payload, server.plugins.schemas.error401);
      });
    });

    lab.test('Error message should be "Missing authentication"', () => {

      return server.inject(noAuth).then((response) => {
        Code.expect(JSON.parse(response.payload).message).to.equal('Missing authentication');
      });
    });
  });

  lab.experiment('Invalid Authorization header', () => {

    const credentials = new Buffer('badUser:badPassword', 'utf8').toString('base64')

    const invalidAuth = {
      method: 'PATCH',
      url: '/notes/1',
      headers: {
        'authorization': `Basic ${credentials}`,
      },
      payload: {
        body: 'New note name', 
      },
    };

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(config);
    });

    lab.test('Status code should be 401 Unauthorized', () => {

      return server.inject(invalidAuth).then((response) => {
        Code.expect(response.statusCode).to.equal(401);
      });
    });

    lab.test('Content-Type should contain application/json', () => {

      return server.inject(invalidAuth).then((response) => {
        Code.expect(response.headers['content-type']).to.contain('application/json');
      });
    });

    lab.test('Body should match the error401 schema', () => {

      return server.inject(invalidAuth).then((response) => {
        Joi.assert(response.payload, server.plugins.schemas.error401);
      });
    });

    lab.test('Error message should be "Bad username or password"', () => {

      return server.inject(invalidAuth).then((response) => {
        Code.expect(JSON.parse(response.payload).message).to.equal('Bad username or password');
      });
    });
  });

  lab.experiment('Malformed noteID', () => {

    const credentials = new Buffer('homer:password', 'utf8').toString('base64')

    const malformedNoteID = {
      method: 'PATCH',
      url: '/notes/!!!!!',
      headers: {
        'authorization': `Basic ${credentials}`,
      },
      payload: {
        body: 'New note name',
      },
    };

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(config);
    });

    lab.test('Status code should be 400 Bad Request', () => {

      return server.inject(malformedNoteID).then((response) => {
        Code.expect(response.statusCode).to.equal(400);
      });
    });

    lab.test('Content-Type should contain application/json', () => {

      return server.inject(malformedNoteID).then((response) => {
        Code.expect(response.headers['content-type']).to.contain('application/json');
      });
    });

    lab.test('Body should match the error400 schema', () => {

      return server.inject(malformedNoteID).then((response) => {
        Joi.assert(response.payload, server.plugins.schemas.error400);
      });
    });

    lab.test('Error message should be "noteID is malformed"', () => {

      return server.inject(malformedNoteID).then((response) => {
        Code.expect(JSON.parse(response.payload).message).to.equal('noteID is malformed');
      });
    });
  });

  lab.experiment('Nonexistent noteID', () => {

    const credentials = new Buffer('homer:password', 'utf8').toString('base64')

    const nonexistentNoteID = {
      method: 'PATCH',
      url: '/notes/999999',
      headers: {
        'authorization': `Basic ${credentials}`,
      },
      payload: {
        body: 'New note name',
      },
    };

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(config);
    });

    lab.test('Status code should be 404 Not Found', () => {

      return server.inject(nonexistentNoteID).then((response) => {
        Code.expect(response.statusCode).to.equal(404);
      });
    });

    lab.test('Content-Type should contain application/json', () => {

      return server.inject(nonexistentNoteID).then((response) => {
        Code.expect(response.headers['content-type']).to.contain('application/json');
      });
    });

    lab.test('Body should match the error404 schema', () => {

      return server.inject(nonexistentNoteID).then((response) => {
        Joi.assert(response.payload, server.plugins.schemas.error404);
      });
    });

    lab.test('Error message should be "noteID does not exist"', () => {

      return server.inject(nonexistentNoteID).then((response) => {
        Code.expect(JSON.parse(response.payload).message).to.equal('noteID does not exist');
      });
    });
  });

  lab.experiment('Note not owned by authenticated user', () => {

    const credentials = new Buffer('homer:password', 'utf8').toString('base64')

    const denied = {
      method: 'PATCH',
      url: '/notes/15',
      headers: {
        'authorization': `Basic ${credentials}`,
      },
      payload: {
        body: 'New note name',
      },
    };

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(config);
    });

    lab.test('Status code should be 403 Forbidden', () => {

      return server.inject(denied).then((response) => {
        Code.expect(response.statusCode).to.equal(403);
      });
    });

    lab.test('Content-Type should contain application/json', () => {

      return server.inject(denied).then((response) => {
        Code.expect(response.headers['content-type']).to.contain('application/json');
      });
    });

    lab.test('Body should match the error403 schema', () => {

      return server.inject(denied).then((response) => {
        Joi.assert(JSON.parse(response.payload), server.plugins.schemas.error403);
      });
    });

    lab.test('Error message should be "Permission denied"', () => {

      return server.inject(denied).then((response) => {
        Code.expect(JSON.parse(response.payload).message).to.equal('Permission denied');
      });
    });
  });

  lab.experiment('Malformed body', () => {

    const credentials = new Buffer('homer:password', 'utf8').toString('base64')

    const malformedBody = {
      method: 'PATCH',
      url: '/notes/1',
      headers: {
        'authorization': `Basic ${credentials}`,
      },
      payload: {
        foo: 'bar',
      },
    };

    lab.beforeEach(() => {
      
      return helpers.resetDatabase(config);
    });

    lab.test('Status code should be 400 Bad Request', () => {

      return server.inject(malformedBody).then((response) => {
        Code.expect(response.statusCode).to.equal(400);
      });
    });

    lab.test('Content-Type should contain application/json', () => {

      return server.inject(malformedBody).then((response) => {
        Code.expect(response.headers['content-type']).to.contain('application/json');
      });
    });

    lab.test('Body should match the error400 schema', () => {

      return server.inject(malformedBody).then((response) => {
        Joi.assert(response.payload, server.plugins.schemas.error400);
      });
    });

    lab.test('Error message should be "body is malformed"', () => {

      return server.inject(malformedBody).then((response) => {
        Code.expect(JSON.parse(response.payload).message).to.equal('body is malformed');
      });
    });
  });

  lab.experiment('Valid Request', () => {

    const credentials = new Buffer('homer:password', 'utf8').toString('base64')

    const valid = {
      method: 'PATCH',
      url: '/notes/1',
      headers: {
        'authorization': `Basic ${credentials}`,
      },
      payload: {
        body: 'New note name',
      },
    };

    lab.test('Status code should be 200 OK', () => {

      return server.inject(valid).then((response) => {
        Code.expect(response.statusCode).to.equal(200);
      });
    });

    lab.test('Body should be empty', () => {

      return server.inject(valid).then((response) => {
        Code.expect(response.payload).to.equal('');
      });
    });
  });
});
