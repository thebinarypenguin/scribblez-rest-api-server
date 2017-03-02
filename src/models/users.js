'use strict';

const bcrypt   = require('bcrypt');
const Bluebird = require('bluebird');
const Joi      = require('joi');

const engage = function (server, knex) {

  const bcryptSaltRounds = 10;

  const pub = {};

  /**
   * Sanitize and validate username
   */
  const validateUsername = function (username, currentUser) {

    return new Bluebird((resolve, reject) => {

      const schema  = server.plugins.schemas.username;
      const options = { stripUnknown: true };
    
      if (arguments.length > 1) {
        
        if (username !== currentUser) {
          return reject(new Error('username does not match currentUser'));
        }  
      }

      // Validate against schema
      Joi.validate(username, schema, options, (err, val) => {
        
        if (err) {
          reject(new Error('username is malformed'));
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
              throw new Error('username does not exist');
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
      const options = { stripUnknown: true };
    
      // Validate against schema
      Joi.validate(createPayload, schema, options, (err, val) => {
        
        if (err) {
          reject(new Error('payload is malformed'));
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
            throw new Error('username already exists');
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
      const options = { stripUnknown: true };
    
      // Validate against schema
      Joi.validate(updatePayload, schema, options, (err, val) => {
        
        if (err) {
          reject(new Error('payload is malformed'));
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
      const options = { stripUnknown: true };
    
      // Validate against schema
      Joi.validate(replacePayload, schema, options, (err, val) => {
        
        if (err) {
          reject(new Error('payload is malformed'));
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
          reject(new Error('password is malformed'));
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

    return Bluebird
      .all([
        validateUsername(username, currentUser),
      ])
      .then((valid) => {

        let validUsername = valid[0];

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
      .all([
        validateCreatePayload(payload),
      ])
      .then((valid) => {
        validPayload = valid[0];
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
      .all([
        validateUsername(username, currentUser),
        validateUpdatePayload(payload),
      ])
      .then((valid) => {
        validUsername = valid[0];
        validPayload  = valid[1];
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
      .all([
        validateUsername(username, currentUser),
        validateReplacePayload(payload),
      ])
      .then((valid) => {
        validUsername = valid[0];
        validPayload  = valid[1];
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

    return Bluebird
      .all([
        validateUsername(username, currentUser),
      ])
      .then((valid) => {

        let validUsername = valid[0];

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
      .all([
        validateUsername(username),
        validatePassword(password),
      ])
      .then((valid) => {

        validUsername = valid[0];
        validPassword = valid[1];

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
            
              throw new Error('credentials are invalid');
            }
          })
      });
  };

  return pub;
};

module.exports = engage;
