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

lab.experiment('PUT /groups/{groupID}', () => {

  let server = null;
  
  lab.before(() => {

    return helpers.initializeTestServer(config, [AuthBasic, auth, models, routes, schemas])
      .then((testServer) => {
        server = testServer;
      });
  });

  lab.experiment('No Authorization header', () => {

    let response = null;

    lab.before(() => {

      const noAuth = {
        method: 'PUT',
        url: '/groups/1',
        payload: {
          name: 'New group name', 
          members: [],
        },
      };

      return helpers.resetDatabase(config)
        .then(() => {
          
          return server.inject(noAuth).then((res) => {
            response = res;
          });
        });  
    });

    lab.test('Status code should be 401 Unauthorized', (done) => {
      Code.expect(response.statusCode).to.equal(401);
      done();
    });

    lab.test('Content-Type should contain application/json', (done) => {
      Code.expect(response.headers['content-type']).to.contain('application/json');
      done();
    });

    lab.test('Body should match the error401 schema', (done) => {
      Joi.assert(JSON.parse(response.payload), server.plugins.schemas.error401);
      done();
    });

    lab.test('Error message should be "Missing authentication"', (done) => {
      Code.expect(JSON.parse(response.payload).message).to.equal('Missing authentication');
      done();
    });
  });

  lab.experiment('Invalid Authorization header', () => {

    let response = null;

    lab.before(() => {

      const credentials = new Buffer('badUser:badPassword', 'utf8').toString('base64')

      const invalidAuth = {
        method: 'PUT',
        url: '/groups/1',
        headers: {
          'authorization': `Basic ${credentials}`,
        },
        payload: {
          name: 'New group name', 
          members: [],
        },
      };

      return helpers.resetDatabase(config)
        .then(() => {
          
          return server.inject(invalidAuth).then((res) => {
            response = res;
          });
        });  
    });

    lab.test('Status code should be 401 Unauthorized', (done) => {
      Code.expect(response.statusCode).to.equal(401);
      done();
    });

    lab.test('Content-Type should contain application/json', (done) => {
      Code.expect(response.headers['content-type']).to.contain('application/json');
      done();
    });

    lab.test('Body should match the error401 schema', (done) => {
      Joi.assert(JSON.parse(response.payload), server.plugins.schemas.error401);
      done();
    });

    lab.test('Error message should be "Bad username or password"', (done) => {
      Code.expect(JSON.parse(response.payload).message).to.equal('Bad username or password');
      done();
    });
  });

  lab.experiment('Malformed groupID', () => {

    let response = null;

    lab.before(() => {

      const credentials = new Buffer('homer:password', 'utf8').toString('base64')

      const malformedGroupID = {
        method: 'PUT',
        url: '/groups/!!!!!',
        headers: {
          'authorization': `Basic ${credentials}`,
        },
        payload: {
          name: 'New group name', 
          members: [],
        },
      };
      
      return helpers.resetDatabase(config)
        .then(() => {
          
          return server.inject(malformedGroupID).then((res) => {
            response = res;
          });
        });  
    });

    lab.test('Status code should be 400 Bad Request', (done) => {
      Code.expect(response.statusCode).to.equal(400);
      done();
    });

    lab.test('Content-Type should contain application/json', (done) => {
      Code.expect(response.headers['content-type']).to.contain('application/json');
      done();
    });

    lab.test('Body should match the error400 schema', (done) => {
      Joi.assert(JSON.parse(response.payload), server.plugins.schemas.error400);
      done();
    });

    lab.test('Error message should be "groupID is malformed"', (done) => {
      Code.expect(JSON.parse(response.payload).message).to.equal('groupID is malformed');
      done();
    });
  });

  lab.experiment('Nonexistent groupID', () => {

    let response = null;

    lab.before(() => {

      const credentials = new Buffer('homer:password', 'utf8').toString('base64')

      const nonexistentGroupID = {
        method: 'PUT',
        url: '/groups/999999',
        headers: {
          'authorization': `Basic ${credentials}`,
        },
        payload: {
          name: 'New group name', 
          members: [],
        },
      };
      
      return helpers.resetDatabase(config)
        .then(() => {
          
          return server.inject(nonexistentGroupID).then((res) => {
            response = res;
          });
        });  
    });

    lab.test('Status code should be 404 Not Found', (done) => {
      Code.expect(response.statusCode).to.equal(404);
      done();
    });

    lab.test('Content-Type should contain application/json', (done) => {
      Code.expect(response.headers['content-type']).to.contain('application/json');
      done();
    });

    lab.test('Body should match the error404 schema', (done) => {
      Joi.assert(JSON.parse(response.payload), server.plugins.schemas.error404);
      done();
    });

    lab.test('Error message should be "groupID does not exist"', (done) => {
      Code.expect(JSON.parse(response.payload).message).to.equal('groupID does not exist');
      done();
    });
  });

  lab.experiment('Group not owned by authenticated user', () => {

    let response = null;

    lab.before(() => {

      const credentials = new Buffer('homer:password', 'utf8').toString('base64')

      const denied = {
        method: 'PUT',
        url: '/groups/10',
        headers: {
          'authorization': `Basic ${credentials}`,
        },
        payload: {
          name: 'New group name', 
          members: [],
        },
      };
      
      return helpers.resetDatabase(config)
        .then(() => {
          
          return server.inject(denied).then((res) => {
            response = res;
          });
        });  
    });

    lab.test('Status code should be 403 Forbidden', (done) => {
      Code.expect(response.statusCode).to.equal(403);
      done();
    });

    lab.test('Content-Type should contain application/json', (done) => {
      Code.expect(response.headers['content-type']).to.contain('application/json');
      done();
    });

    lab.test('Body should match the error403 schema', (done) => {
      Joi.assert(JSON.parse(response.payload), server.plugins.schemas.error403);
      done();
    });

    lab.test('Error message should be "Permission denied"', (done) => {
      Code.expect(JSON.parse(response.payload).message).to.equal('Permission denied');
      done();
    });
  });

  lab.experiment('Malformed body', () => {

    let response = null;

    lab.before(() => {

      const credentials = new Buffer('homer:password', 'utf8').toString('base64')

      const malformedBody = {
        method: 'PUT',
        url: '/groups/1',
        headers: {
          'authorization': `Basic ${credentials}`,
        },
        payload: {
          foo: 'bar',
        },
      };
      
      return helpers.resetDatabase(config)
        .then(() => {
          
          return server.inject(malformedBody).then((res) => {
            response = res;
          });
        });  
    });

    lab.test('Status code should be 400 Bad Request', (done) => {
      Code.expect(response.statusCode).to.equal(400);
      done();
    });

    lab.test('Content-Type should contain application/json', (done) => {
      Code.expect(response.headers['content-type']).to.contain('application/json');
      done();
    });

    lab.test('Body should match the error400 schema', (done) => {
      Joi.assert(JSON.parse(response.payload), server.plugins.schemas.error400);
      done();
    });

    lab.test('Error message should be "body is malformed"', (done) => {
      Code.expect(JSON.parse(response.payload).message).to.equal('body is malformed');
      done();
    });
  });

  lab.experiment('Valid Request', () => {



    let response = null;

    lab.before(() => {

      const credentials = new Buffer('homer:password', 'utf8').toString('base64')

      const valid = {
        method: 'PUT',
        url: '/groups/1',
        headers: {
          'authorization': `Basic ${credentials}`,
        },
        payload: {
          name: 'New group name', 
          members: [],
        },
      };
      return helpers.resetDatabase(config)
        .then(() => {
          
          return server.inject(valid).then((res) => {
            response = res;
          });
        });  
    });

    lab.test('Status code should be 200 OK', (done) => {
      Code.expect(response.statusCode).to.equal(200);
      done();
    });

    lab.test('Body should be empty', (done) => {
      Code.expect(response.payload).to.equal('');
      done();
    });
  });
});
