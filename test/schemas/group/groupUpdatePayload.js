

const Code    = require('code');
const Hapi    = require('hapi');
const Joi     = require('joi');
const Lab     = require('lab');
const config  = require('../../../src/config');
const schemas = require('../../../src/schemas');

const lab = exports.lab = Lab.script();

lab.experiment('schemas.groupUpdatePayload', () => {

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

  lab.test('must have at least one property', (done) => {

    const schema = server.plugins.schemas.groupUpdatePayload;

    const options = { convert: false };

    const good = {
      name: 'Just John',
    };

    const bad = {};

    Code.expect(Joi.validate(good, schema, options).error).to.be.null();
    Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

    done();    
  });

  lab.experiment('name', () => {

    lab.test('is optional', (done) => {

      const schema = server.plugins.schemas.groupUpdatePayload;

      const options = { convert: false };

      const good = [
        // Present
        {
          name: 'Just John',
          members: [ 'john_doe' ],
        },
        // Absent
        {
          members: [ 'john_doe' ],
        },
      ];

      Code.expect(Joi.validate(good[0], schema, options).error).to.be.null();
      Code.expect(Joi.validate(good[1], schema, options).error).to.be.null();

      done();
    });

    lab.test('must be a string', (done) => {

      const schema = server.plugins.schemas.groupUpdatePayload;

      const options = { convert: false };

      const good = {
        name: 'Just John',
        members: [ 'john_doe' ],
      };

      const bad = {
        name: 999,
        members: [ 'john_doe' ],
      };

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });

    lab.test('must be at least 1 character long', (done) => {

      const schema = server.plugins.schemas.groupUpdatePayload;

      const options = { convert: false };

      const good = {
        name: 'Just John',
        members: [ 'john_doe' ],
      };

      const bad = {
        name: '',
        members: [ 'john_doe' ],
      };

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });

    lab.test('must be at most 80 characters long', (done) => {

      const schema = server.plugins.schemas.groupUpdatePayload;

      const options = { convert: false };

      const good = {
        name: 'Just John',
        members: [ 'john_doe' ],
      };

      const bad = {
        name: 'x'.repeat(81),
        members: [ 'john_doe' ],
      };

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });
  });

  lab.experiment('members', () => {

    lab.test('is optional', (done) => {

      const schema = server.plugins.schemas.groupUpdatePayload;

      const options = { convert: false };

      const good = [
        // Present
        {
          name: 'Just John',
          members: [ 'john_doe' ],
        },
        // Absent
        {
          name: 'Just John',
        },
      ];

      Code.expect(Joi.validate(good[0], schema, options).error).to.be.null();
      Code.expect(Joi.validate(good[1], schema, options).error).to.be.null();

      done();
    });

    lab.test('must be an array', (done) => {

      const schema = server.plugins.schemas.groupUpdatePayload;

      const options = { convert: false };

      const good = {
        name: 'Just John',
        members: [ 'john_doe' ],
      };

      const bad = {
        name: 'Just John',
        members: {},
      };

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });

    lab.test('items must match the username schema', (done) => {

      const schema = server.plugins.schemas.groupUpdatePayload;

      const options = { convert: false };

      const good = {
        name: 'Just John',
        members: [ 'john_doe' ],
      };

      const bad = {
        name: 'Just John',
        members: [
          {
            username: 'john_doe',
            real_name: 'John Doe',
          },
        ],
      };

      Code.expect(Joi.validate(good, schema, options).error).to.be.null();
      Code.expect(Joi.validate(bad, schema, options).error).to.be.an.error();

      done();
    });
  });
});
