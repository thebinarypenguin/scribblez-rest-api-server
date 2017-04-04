'use strict';

const Bluebird = require('bluebird');
const Joi      = require('joi');

const engage = function (server, knex) {

  const MALFORMED_OWNER          = 'owner is malformed';
  const MALFORMED_CURRENT_USER   = 'currentUser is malformed';
  
  const NONEXISTENT_OWNER        = 'owner does not exist';
  const NONEXISTENT_CURRENT_USER = 'currentUser does not exist';

  const pub = {};

  /**
   * Sanitize and validate currentUser.
   */
  const validateCurrentUser = function (currentUser, optional) {
  
    if (optional) {
      if (currentUser === null || currentUser === undefined) {
        return new Bluebird.resolve(null);
      }
    }

    return new Bluebird((resolve, reject) => {

      const schema  = server.plugins.schemas.username;
      const options = {
        convert: false,
        stripUnknown: true,
      };
    
      // Validate against schema
      Joi.validate(currentUser, schema, options, (err, val) => {
        
        if (err) {
          reject(new Error(MALFORMED_CURRENT_USER));
        } else { 
          resolve(val);
        }
      });
    })
    .tap((validCurrentUser) => {

      // Check for presence in database
      return knex
        .select('username')
        .from('users')
        .where('username', validCurrentUser)
        .then((result) => {
          if (result.length === 0) {
            throw new Error(NONEXISTENT_CURRENT_USER);
          }
        });      
    });
  };

  /**
   * Sanitize and validate owner.
   */
  const validateOwner = function (owner) {

    return new Bluebird((resolve, reject) => {
      
      const schema  = server.plugins.schemas.username;
      const options = {
        convert: false,
        stripUnknown: true,
      };
    
      // Validate against schema
      Joi.validate(owner, schema, options, (err, val) => {
        
        if (err) {
          reject(new Error(MALFORMED_OWNER));
        } else { 
          resolve(val);
        }
      });
    })
    .tap((validOwner) => {

      // Check for presence in database
      return knex
        .select('username')
        .from('users')
        .where('username', validOwner)
        .then((result) => {
          if (result.length === 0) {
            throw new Error(NONEXISTENT_OWNER);
          }
        }); 
    });
  };

  /**
   * Transform "flat" database rows into "hierarchical" objects.
   */
  const format = function (result) {

    return result.map((row) => {
      
      return {
        id: row.id,
        body: row.body,
        owner: {
          username: row.username,
          real_name: row.real_name,
        },
        created_at: dateToString(row.created_at),
        updated_at: dateToString(row.updated_at),
      };
    });
  };

  /**
   * Convert a Date to an ISO 8601 format string
   */
  const dateToString = function (date) {

    const pad = function (num) {
      return (num < 10) ? '0' + num : num ;
    };

    const year    = date.getFullYear();
    const month   = pad(date.getMonth() + 1);
    const day     = pad(date.getDate());
    const hours   = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
  };


  /**
   * Find all public notes.
   */
  pub.findPublic = function () {

    return Bluebird
      .resolve()
      .then(() => {

        // Get public notes from database

        return knex
          .select(
            'notes.id', 
            'notes.body',
            'notes.created_at',
            'notes.updated_at', 
            'owners.username',
            'owners.real_name'
          )
          .from('notes')
          .leftJoin('users AS owners', 'owners.id', '=', 'notes.owner_id')
          .where('notes.visibility', 'public')
          .orderBy('notes.created_at', 'DESC')
          .then((result) => {
            return result;
          });
      })
      .then(format);
  };
  
  /**
   * Find all notes shared with currentUser
   */
  pub.findShared = function (currentUser) {

    let validCurrentUser = null;

    return Bluebird
      .resolve()
      .then(() => {

        return validateCurrentUser(currentUser).then((data) => {
          validCurrentUser = data;
        });
      })
      .then(() => {

        return knex
          .select(
            'notes.id', 
            'notes.body', 
            'notes.created_at',
            'notes.updated_at', 
            'owners.username',
            'owners.real_name'
          )
          .from('notes')
          .leftJoin('users AS owners', 'owners.id', '=', 'notes.owner_id')
          .leftJoin('note_grants', 'note_grants.note_id', '=', 'notes.id')
          .leftJoin('users', 'users.id' ,'=', 'note_grants.user_id')
          .where('users.username', validCurrentUser)
          .orderBy('notes.created_at', 'DESC')
          .then((result) => {
            return result;
          });
      })
      .then(format);
  };
  
  /**
   * Find all notes currentUser can see (public + shared).
   */
  pub.findAll = function (currentUser) {

    let validCurrentUser = null;

    return Bluebird
      .resolve()
      .then(() => {

        return validateCurrentUser(currentUser, true).then((data) => {
          validCurrentUser = data;
        });
      })
      .then(() => {

        // Get public plus shared notes from database

        return knex
          .select(
            'notes.id', 
            'notes.body', 
            'notes.created_at',
            'notes.updated_at', 
            'owners.username',
            'owners.real_name'
          )
          .from('notes')
          .leftJoin('users AS owners', 'owners.id', '=', 'notes.owner_id')
          .leftJoin('note_grants', 'note_grants.note_id', '=', 'notes.id')
          .leftJoin('users', 'users.id' ,'=', 'note_grants.user_id')
          .where(function () {
            if (validCurrentUser) {
              this
                .where(function () {
                  this
                    .where('notes.visibility', 'public')
                    .orWhere('users.username', validCurrentUser);
                })
                .andWhere('owners.username', '<>', validCurrentUser);              
            } else {
              this
                .where('notes.visibility', 'public');
            }
          })
          .orderBy('notes.created_at', 'DESC')
          .then((result) => {
            return result;
          });
      })
      .then(format);
  };

  /**
   * Find all notes owned by owner that currentUser can see (public + shared).
   */
  pub.findByOwner = function(owner, currentUser) {

    let validOwner       = null;
    let validCurrentUser = null;

    return Bluebird
      .resolve()
      .then(() => {

        return validateOwner(owner).then((data) => {
          validOwner = data;
        });
      })
      .then(() => {

        return validateCurrentUser(currentUser, true).then((data) => {
          validCurrentUser = data;
        });
      })
      .then(() => {

        // Get public plus shared notes by owner from database
        
        return knex
          .select(
            'notes.id', 
            'notes.body', 
            'notes.created_at',
            'notes.updated_at', 
            'owners.username',
            'owners.real_name'
          )
          .from('notes')
          .leftJoin('users AS owners', 'owners.id', '=', 'notes.owner_id')
          .leftJoin('note_grants', 'note_grants.note_id', '=', 'notes.id')
          .leftJoin('users', 'users.id' ,'=', 'note_grants.user_id')
          .where('owners.username', validOwner)
          .where(function () {
            if (validCurrentUser) {
              this
                .where('notes.visibility', 'public')
                .orWhere('users.username', validCurrentUser);
            } else {
              this
                .where('notes.visibility', 'public');
            }
          })
          .orderBy('notes.created_at', 'DESC')
          .then((result) => {
            return result;
          });
      })
      .then(format);
  };

  return pub;
};

module.exports = engage;
