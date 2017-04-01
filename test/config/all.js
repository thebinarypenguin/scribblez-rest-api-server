'use strict';

const Code    = require('code');
const Lab     = require('lab');
const config  = require('../../src/config');

const lab = exports.lab = Lab.script();

lab.experiment('config.load(environment)', () => {

  lab.experiment('invalid environment', () => {

    lab.test('Should throw an Error', (done) => {
      
      const a = config.load.bind(this, 'nonexistent');

      Code.expect(a).to.throw();
      done();
    });
  });

  lab.experiment('valid environment', () => {

    lab.test('Should return the specified environment', (done) => {
      
      const a = config.load('test');
      const b = require('../../src/config/test.js');

      Code.expect(a).to.equal(b);
      done();
    });
  });

  lab.experiment('environment not specified', () => {

    lab.test('Should return the development environment', (done) => {
      
      const a = config.load();
      const b = require('../../src/config/development.js');

      Code.expect(a).to.equal(b);
      done();
    });
  });
});
