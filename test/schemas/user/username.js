'use strict';

const Code    = require('code');
const Hapi    = require('hapi');
const Joi     = require('joi');
const Lab     = require('lab');
const config  = require('../../../src/config');
const schemas = require('../../../src/schemas');

const lab = exports.lab = Lab.script();

lab.experiment('schemas.username', () => {

  const server = new Hapi.Server();
  
  lab.before((done) => {

    server.connection({
      host: config.hapi.host,
      port: config.hapi.port,
    });

    server.register([
      schemas,
    ], (err) => {

      if (err) { throw err; }

      server.initialize((err) => {

        if (err) { throw err; }

        done();
      });
    });
  });

  lab.test('must be a string', (done) => {

    const good = 'john_doe';

    const bad = 999;

    Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.username)).to.not.throw();
    Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.username)).to.throw();

    done();
  });
    
  lab.test('must match the regex /^[a-z0-9_]+$/', (done) => {

    const good = 'john_doe';

    const bad = [
      
      // Capital
      'John_Doe',
      
      // Punctuation
      'john.doe',
      
      // Space
      'john doe',
    ];

    Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.username)).to.not.throw();
    Code.expect(Joi.assert.bind(this, bad[0], server.plugins.schemas.username)).to.throw();
    Code.expect(Joi.assert.bind(this, bad[1], server.plugins.schemas.username)).to.throw();
    Code.expect(Joi.assert.bind(this, bad[2], server.plugins.schemas.username)).to.throw();

    done();
  });
    
  lab.test('must be at least 3 characters long', (done) => {

    const good = 'john_doe';

    const bad = 'jd';

    Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.username)).to.not.throw();
    Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.username)).to.throw();

    done();
  });
    
  lab.test('must be at most 20 characters long', (done) => {

    const good = 'john_doe';

    const bad = '______john__doe______';

    Code.expect(Joi.assert.bind(this, good, server.plugins.schemas.username)).to.not.throw();
    Code.expect(Joi.assert.bind(this, bad, server.plugins.schemas.username)).to.throw();

    done();
  });
});
