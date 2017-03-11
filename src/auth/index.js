'use strict';

const after = function (server, next) {

  const validate = function (request, username, password, callback) {
    
    server.plugins.models.users.authenticate(username, password)
      .then(() => {
        callback(null, true, { currentUser: username });
      })
      .catch(() => {
        callback(null, false);
      });
  };

  server.auth.strategy('simple', 'basic', { validateFunc: validate });

  return next();
};

const register = function (server, options, next) {

  server.dependency(['hapi-auth-basic','models'], after);
  return next();
};

register.attributes = {
  name: 'auth',
};

module.exports = register;
