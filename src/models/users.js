'use strict';

const bcrypt   = require('bcrypt');
const Bluebird = require('bluebird');
const Joi      = require('joi');

const engage = function (server, knex) {

  const bcryptSaltRounds     = 10;
  
  const MALFORMED_USERNAME   = 'username is malformed';
  const MALFORMED_PAYLOAD    = 'payload is malformed';
  const MALFORMED_PASSWORD   = 'password is malformed';
  
  const NONEXISTENT_USERNAME = 'username does not exist';
  const DUPLICATE_USERNAME   = 'username already exists';
  
  const PERMISSION_DENIED    = 'Permission Denied';
  const INVALID_CREDENTIALS  = 'Invalid Credentials';

  const pub = {};

  /**
   * Sanitize and validate username
   */
  const validateUsername = function (username, currentUser) {

    return new Bluebird((resolve, reject) => {

      const schema  = server.plugins.schemas.username;
      const options = {
        convert: false,
        stripUnknown: true,
      };
    
      if (arguments.length > 1) {
        
        if (username !== currentUser) {
          return reject(new Error(PERMISSION_DENIED));
        }  
      }

      // Validate against schema
      Joi.validate(username, schema, options, (err, val) => {
        
        if (err) {
          reject(new Error(MALFORMED_USERNAME));
        } else { 
          resolve(val);
        }
      });
    })
    .then((validUsername) => {

      // Check for presence in database
      return knex
        .select('username')
        .from('users')
        .where('username', validUsername)
        .then((result) => {
          if (result.length === 0) {
            throw new Error(NONEXISTENT_USERNAME);
          } else { 
            return validUsername;
          }
        });
    });
  };

  /**
   * Sanitize and validate createPayload
   */
  const validateCreatePayload = function (createPayload) {

    return new Bluebird((resolve, reject) => {

      const schema  = server.plugins.schemas.userCreatePayload;
      const options = {
        convert: false,
        stripUnknown: true,
      };
    
      // Validate against schema
      Joi.validate(createPayload, schema, options, (err, val) => {
        
        if (err) {
          reject(new Error(MALFORMED_PAYLOAD));
        } else { 
          resolve(val);
        }
      })
    })
    .then((validPayload) => {

      // Check for presence in database
      return knex
        .select('username')
        .from('users')
        .where('username', validPayload.username)
        .then((result) => {
          if (result.length > 0) {
            throw new Error(DUPLICATE_USERNAME);
          } else { 
            return validPayload;
          }
        });
    });
  };

  /**
   * Sanitize and validate updatePayload
   */
  const validateUpdatePayload = function (updatePayload) {

    return new Bluebird((resolve, reject) => {

      const schema  = server.plugins.schemas.userUpdatePayload;
      const options = {
        convert: false,
        stripUnknown: true,
      };
    
      // Validate against schema
      Joi.validate(updatePayload, schema, options, (err, val) => {
        
        if (err) {
          reject(new Error(MALFORMED_PAYLOAD));
        } else { 
          resolve(val);
        }
      });
    });
  };

  /**
   * Sanitize and validate replacePayload
   */
  const validateReplacePayload = function (replacePayload) {

    return new Bluebird((resolve, reject) => {

      const schema  = server.plugins.schemas.userReplacePayload;
      const options = {
        convert: false,
        stripUnknown: true,
      };
    
      // Validate against schema
      Joi.validate(replacePayload, schema, options, (err, val) => {
        
        if (err) {
          reject(new Error(MALFORMED_PAYLOAD));
        } else { 
          resolve(val);
        }
      });
    });
  };

  /**
   * Sanitize and validate password
   */
  const validatePassword = function (password) {
  
    return new Bluebird((resolve, reject) => {

      // Must be a string
      Joi.validate(password, Joi.string(), (err, val) => {
        
        if (err) {
          reject(new Error(MALFORMED_PASSWORD));
        } else { 
          resolve(val);
        }
      });
    });
  };

  /**
   * Find own user
   */
  pub.findByUsername = function(username, currentUser) {

    let validUsername = null;

    return Bluebird
      .resolve()
      .then(() => {

        return validateUsername(username, currentUser).then((data) => {
          validUsername = data;
        });
      })
      .then(() => {

        return knex
          .select(
            'username', 
            'real_name', 
            'email_address'
          )
          .from('users')
          .where('username', validUsername)
          .then((results) => {
            return results[0];
          })
      })
  };

  /**
   * Create a new user
   */
  pub.create = function(payload) {

    let validPayload = null;
    let passwordHash = null;

    return Bluebird
      .resolve()
      .then(() => {

        return validateCreatePayload(payload).then((data) => {
          validPayload = data;
        });
      })
      .then(() => {

        return bcrypt.hash(validPayload.password, bcryptSaltRounds)
          .then((hash) => {
            passwordHash = hash;
          });
      })
      .then(() => {

        let insert = {
          username: validPayload.username,
          real_name: validPayload.real_name,
          email_address: validPayload.email_address,
          password_hash: passwordHash,
        };

        return knex
          .insert(insert)
          .into('users')
          .then(() => {
            return validPayload.username;
          });
      });
  };

  /**
   * Update own user (partial change)
   */
  pub.update = function(username, payload, currentUser) {

    let validUsername = null;
    let validPayload  = null;
    let passwordHash  = null;

    return Bluebird
      .resolve()
      .then(() => {

        return validateUsername(username, currentUser).then((data) => {
          validUsername = data;
        });
      })
      .then(() => {

        return validateUpdatePayload(payload).then((data) => {
          validPayload = data;
        });
      })
      .then(() => {
        
        if (validPayload.password) {
          
          return bcrypt.hash(validPayload.password, bcryptSaltRounds)
            .then((hash) => {
              passwordHash = hash;
            });
        }
      })
      .then(() => {

        let updates = {};

        if (validPayload.real_name) {
          updates.real_name = validPayload.real_name;
        }

        if (validPayload.email_address) {
          updates.email_address = validPayload.email_address;
        }

        if (validPayload.password) {
          updates.password_hash = passwordHash;
        }

        return knex('users')
          .update(updates)
          .where('username', validUsername)
          .then(() => {
            return true;
          });
      });
  };

  /**
   * Replace own user (complete replacement)
   */
  pub.replace = function(username, payload, currentUser) {

    let validUsername = null;
    let validPayload  = null;
    let passwordHash  = null;

    return Bluebird
      .resolve()
      .then(() => {

        return validateUsername(username, currentUser).then((data) => {
          validUsername = data;
        });
      })
      .then(() => {

        return validateReplacePayload(payload).then((data) => {
          validPayload = data;
        });
      })
      .then(() => {
        
        return bcrypt.hash(validPayload.password, bcryptSaltRounds)
          .then((hash) => {
            passwordHash = hash;
          });
      })
      .then(() => {

        let updates = {
          real_name: validPayload.real_name,
          email_address: validPayload.email_address,
          password_hash: passwordHash,
        };
        
        return knex('users')
          .update(updates)
          .where('username', validUsername)
          .then(() => {
            return true;
          });
      });
  };

  /**
   * Delete own user
   */
  pub.destroy = function(username, currentUser) {

    let validUsername = null;

    return Bluebird
      .resolve()
      .then(() => {

        return validateUsername(username, currentUser).then((data) => {
          validUsername = data;
        });
      })
      .then(() => {

        return knex
          .del()
          .from('users')
          .where('username', validUsername)
          .then(() => {
            return true;
          }); 
      });
  };

  /**
   * Check user credentials
   */
  pub.authenticate = function(username, password) {

    let validUsername = null;
    let validPassword = null;
    let passwordHash  = null;

    return Bluebird
      .resolve()
      .then(() => {

        return validateUsername(username).then((data) => {
          validUsername = data;
        });
      })
      .then(() => {

        return validatePassword(password).then((data) => {
          validPassword = data;
        });
      })
      .then(() => {

        return knex
          .select('password_hash')
          .from('users')
          .where('username', validUsername)
          .then((result) => {
            passwordHash = result[0].password_hash;
          })
      })
      .then(() => {

        return bcrypt.compare(validPassword, passwordHash)
          .then((res) => {
            
            if (res === true) {
            
              return true;
            
            } else {
            
              throw new Error(INVALID_CREDENTIALS);
            }
          })
      });
  };

  return pub;
};

module.exports = engage;
