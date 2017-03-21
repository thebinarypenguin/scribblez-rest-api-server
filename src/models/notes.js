'use strict';

const Bluebird = require('bluebird');
const Joi      = require('joi');

const engage = function (server, knex) {

  const pub = {};

  /**
   * Sanitize and validate noteID
   */
  const validateNoteID = function (noteID) {

    return new Bluebird((resolve, reject) => {

      const schema  = server.plugins.schemas.noteID;
      const options = {
        convert: false,
        stripUnknown: true,
      };
    
      // Validate against schema
      Joi.validate(noteID, schema, options, (err, val) => {
        
        if (err) {
          reject(new Error('noteID is malformed'));
        } else { 
          resolve(val);
        }
      });
    })
    .then((validID) => {

        // Check for presence in database
        return knex
          .select('id')
          .from('notes')
          .where('id', validID)
          .then((result) => {
            if (result.length === 0) {
              throw new Error('noteID does not exist');
            } else { 
              return validID;
            }
          });
    });
  };

  /**
   * Sanitize and validate createPayload
   */
  const validateCreatePayload = function (createPayload) {

    return new Bluebird((resolve, reject) => {

      const schema  = server.plugins.schemas.noteCreatePayload;
      const options = {
        convert: false,
        stripUnknown: true,
      };
    
      // Validate against schema
      Joi.validate(createPayload, schema, options, (err, val) => {
        
        if (err) {
          reject(new Error('payload is malformed'));
        } else { 
          resolve(val);
        }
      });
    });
  };

  /**
   * Sanitize and validate updatePayload
   */
  const validateUpdatePayload = function (updatePayload) {

    return new Bluebird((resolve, reject) => {

      const schema  = server.plugins.schemas.noteUpdatePayload;
      const options = {
        convert: false,
        stripUnknown: true,
      };
    
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

      const schema  = server.plugins.schemas.noteReplacePayload;
      const options = {
        convert: false,
        stripUnknown: true,
      };
    
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
   * Sanitize and validate currentUser
   */
  const validateCurrentUser = function (currentUser) {

    return new Bluebird((resolve, reject) => {

      const schema  = server.plugins.schemas.username;
      const options = {
        convert: false,
        stripUnknown: true,
      };
    
      // Validate against schema
      Joi.validate(currentUser, schema, options, (err, val) => {
        
        if (err) {
          reject(new Error('currentUser is malformed'));
        } else { 
          resolve(val);
        }
      });
    })
    .then((validCurrentUser) => {

        // Check for presence in database
        return knex
          .select('username')
          .from('users')
          .where('username', validCurrentUser)
          .then((result) => {
            if (result.length === 0) {
              throw new Error('currentUser does not exist');
            } else { 
              return validCurrentUser;
            }
          });
    });
  };

  /**
   * Determine if note is owned by currentUser
   */
  const validateOwnership = function (noteID, currentUser) {

    // Check for presence in database
    return knex
      .select('notes.id')
      .from('notes')
      .leftJoin('users', 'users.id', '=', 'notes.owner_id')
      .where('notes.id', noteID)
      .andWhere('users.username', currentUser)
      .then((result) => {
        if (result.length === 0) {
          throw new Error('Permission denied');
        } else { 
          return true;
        }
      });
  };

  /**
   * Transform "flat" database rows into "hierarchical" objects.
   */
  const format = function (results) {

    const findOrCreateSharedNote = function (collection, item) {

      let note = collection.find((i) => { return i.id === item.id });

      if (!note) {
        
        note = {
          id: item.id,
          body: item.body,
          owner: {
            username: item.owners_username,
            real_name: item.owners_real_name,
          },
          visibility: {
            users: [],
            groups: [],
          },            
        };

        collection.push(note);
      }

      return note;
    };

    const findOrCreateGroup = function (collection, item) {

      let group = collection.find((i) => { return i.id = item.id });

      if (!group) {

        group = {
          id: item.grant_group_id,
          name: item.grant_group_name,
          members: [],
        };

        collection.push(group);
      }

      return group;
    };

    return results.reduce((acc, row) => {

      if (row.visibility === 'public' || row.visibility === 'private') {
        
        // public and private notes are easy, just append to collection

        acc.push({
          id: row.id,
          body: row.body,
          owner: {
            username: row.owners_username,
            real_name: row.owners_real_name,
          },
          visibility: row.visibility,
        });
      }

      if (row.visibility === 'shared') {

        // Find the shared note in the collection, or create a new one if necessary

        let note = findOrCreateSharedNote(acc, row);

        if (row.grant_group_id === null) {

          // Append a user grant (note shared with user directly)

          note.visibility.users.push({
            username: row.grant_username,
            real_name: row.grant_real_name,
          });

        } else {

          // Append a group grant (note shared with user via a group)

          let group = findOrCreateGroup(note.visibility.groups, row);

          group.members.push({
            username: row.grant_username,
            real_name: row.grant_real_name,
          });
        }
      }

      return acc;
    }, []);
  };

  /**
   * Get the visibility type ('public', 'private', 'shared')
   */
  const getVisibilityType = function (visibility) {

    let visibilityType = undefined;

    if (visibility === 'public') {
      visibilityType = 'public';
    }

    if (visibility === 'private') {
      visibilityType = 'private';
    }

    if (visibility && visibility.users && visibility.groups) {
      visibilityType = 'shared';
    }

    return visibilityType;
  };

  /**
   * Find all notes owned by current user
   */
  pub.findAll = function(currentUser) {

    return Bluebird
      .all([
        validateCurrentUser(currentUser),
      ])
      .then((valid) => {
        
        const validCurrentUser = valid[0];

        return knex
          .select(
            'notes.id',
            'notes.body',
            'notes.visibility',
            'owners.username AS owners_username',
            'owners.real_name AS owners_real_name',
            'users.username AS grant_username',
            'users.real_name AS grant_real_name',
            'groups.id AS grant_group_id',
            'groups.name AS grant_group_name'
          )
          .from('notes')
          .leftJoin('users AS owners', 'owners.id', '=','notes.owner_id')
          .leftJoin('note_grants', 'note_grants.note_id', '=', 'notes.id')
          .leftJoin('users', 'users.id',  '=',  'note_grants.user_id')
          .leftJoin('groups', 'groups.id', '=', 'note_grants.group_id')
          .where('owners.username', validCurrentUser)
          .orderBy('notes.created_at', 'DESC')
          .then((results) => {
            return results;
          });
      })
      .then(format);
  };

  /**
   * Find note specified by id and owned by currentUser
   */
  pub.findByID = function(noteID, currentUser) {

    let validNoteID      = null;
    let validCurrentUser = null;

    return Bluebird
      .resolve()
      .then(() => {

        return validateNoteID(noteID)
          .then((data) => {
            validNoteID = data;
          }); 
      })
      .then(() => {

        return validateCurrentUser(currentUser)
          .then((data) => {
            validCurrentUser = data;
          });
      })
      .then(() => {

        return validateOwnership(noteID, currentUser);
      }) 
      .then(() => {

        return knex
          .select(
            'notes.id',
            'notes.body',
            'notes.visibility',
            'owners.username AS owners_username',
            'owners.real_name AS owners_real_name',
            'users.username AS grant_username',
            'users.real_name AS grant_real_name',
            'groups.id AS grant_group_id',
            'groups.name AS grant_group_name'
          )
          .from('notes')
          .leftJoin('users AS owners', 'owners.id', '=','notes.owner_id')
          .leftJoin('note_grants', 'note_grants.note_id', '=', 'notes.id')
          .leftJoin('users', 'users.id',  '=',  'note_grants.user_id')
          .leftJoin('groups', 'groups.id', '=', 'note_grants.group_id')
          .andWhere('notes.id', validNoteID)
          .where('owners.username', validCurrentUser)
          .orderBy('notes.created_at', 'DESC')
          .then((results) => {
            return results;
          });
      })
      .then(format)
      .then((formatted) => {
        return formatted[0];
      });
  };

  /**
   * Create a new note owned by currentUser
   */
  pub.create = function(payload, currentUser) {

    let validPayload     = null;
    let validCurrentUser = null;
    let userID           = null;
    let noteID           = null;

    return Bluebird
      .all([
        validateCreatePayload(payload),
        validateCurrentUser(currentUser),
      ])
      .then((valid) => {
        validPayload     = valid[0];
        validCurrentUser = valid[1];
      })
      .then(() => {

        // Get user id for currentUser

        return knex
          .select('id')
          .from('users')
          .where('username', validCurrentUser)
          .then((result) => {
            userID = result[0].id;
          });
      })
      .then(() => {

        // Insert note into notes table (save new note id)

        return knex
          .insert({
            body: validPayload.body,
            owner_id: userID,
            visibility: getVisibilityType(validPayload.visibility),
          })
          .into('notes')
          .returning('id')
          .then((result) => {
            noteID = result[0];
          });
      })
      .then(() => {

        // Add any possible user grants

        if (validPayload.visibility.users && validPayload.visibility.users.length > 0) {

          // Get user ids from usernames

          return knex
            .select('id')
            .from('users')
            .whereIn('username', validPayload.visibility.users)
            .then((results) => {
              
              let userGrants = results.map((user) => {

                return {
                  note_id: noteID,
                  user_id: user.id,
                  group_id: null,
                };
              });

              // Insert user grants into note_grants table

              return knex
                .insert(userGrants)
                .into('note_grants');
            });
        }
      })
      .then(() => {

        // Add any possible group grants

        if (validPayload.visibility.groups && validPayload.visibility.groups.length > 0) {

          // Get group ids from names

          return knex
            .select('id')
            .from('groups')
            .whereIn('name', validPayload.visibility.groups)
            .andWhere('owner_id', userID)
            .then((results) => {
              
              let groupIDs = results.map((g) => { return g.id });

              // Get groups' members

              return knex
                .select(
                  'user_id', 
                  'group_id'
                )
                .from('group_members')
                .whereIn('group_id', groupIDs)
                .then((results) => {

                  let groupGrants = results.map((row) => {
                    
                    return {
                      note_id: noteID,
                      user_id: row.user_id,
                      group_id: row.group_id,
                    };
                  });

                  // Insert group grants into note_grants table

                  return knex
                    .insert(groupGrants)
                    .into('note_grants');
                });
            });
        }
      })
      .then(() => {
        return noteID;
      });
  };

  /**
   * Update note specified by id and owned by currentUser (partial change)
   */
  pub.update = function(noteID, payload, currentUser) {

    let validNoteID      = null;
    let validPayload     = null;
    let validCurrentUser = null;
    let userID           = null;
    let existingGrants   = [];
    let payloadGrants    = [];

    return Bluebird
      .resolve()
      .then(() => {

        return validateNoteID(noteID)
          .then((data) => {
            validNoteID = data;
          });
      })
      .then(() => {

        return validateUpdatePayload(payload)
          .then((data) => {
            validPayload = data;
          });
      })
      .then(() => {

        return validateCurrentUser(currentUser)
          .then((data) => {
            validCurrentUser = data;
          });
      })
      .then(() => {

        return validateOwnership(noteID, currentUser);
      }) 
      .then(() => {

        // Get user id for currentUser

        return knex
          .select('id')
          .from('users')
          .where('username', validCurrentUser)
          .then((result) => {
            userID = result[0].id;
          });
      })
      .then(() => {

        // Update note in notes table

        let updates = {}

        if (validPayload.body) {
          updates.body = validPayload.body;
        }
        
        if (validPayload.visibility) {
          updates.visibility = getVisibilityType(validPayload.visibility);
        }

        return knex('notes')
          .update(updates)
          .where('id', validNoteID)
          .andWhere('owner_id', userID)
          .then((result) => {
            return result;
          });
        
      })
      .then(() => {

        // Get existing grants (user and group) for note

        return knex
          .select(
            'id',
            'note_id',
            'user_id',
            'group_id'
          )
          .from('note_grants')
          .where('note_id', noteID)
          .then((results) => {
            existingGrants = results;
          });
      })
      .then(() => {

        // Get any possible user grants from payload, append to payloadGrants

        if (validPayload.visibility && validPayload.visibility.users && validPayload.visibility.users.length > 0) {

          return knex
            .select('id')
            .from('users')
            .whereIn('username', validPayload.visibility.users)
            .then((results) => {

              results.forEach((user) => {
                
                payloadGrants.push({
                  note_id: noteID,
                  user_id: user.id,
                  group_id: null,
                });
              });
            });
        }
      })
      .then(() => {

        // Get any possible group grants from payload, append to payloadGrants

        if (validPayload.visibility && validPayload.visibility.groups && validPayload.visibility.groups.length > 0) {

          return knex
            .select('id')
            .from('groups')
            .whereIn('name', validPayload.visibility.groups)
            .andWhere('owner_id', userID)
            .then((results) => {

              let groupIDs = results.map((g) => { return g.id });

              return knex
                .select(
                  'user_id', 
                  'group_id'
                )
                .from('group_members')
                .whereIn('group_id', groupIDs)
                .then((results) => {

                  results.forEach((g) => {

                    payloadGrants.push({
                      note_id: noteID,
                      user_id: g.user_id,
                      group_id: g.group_id,
                    });
                  });
                });
            });
        }
      })
      .then(() => {

        let grantsToDelete = existingGrants.reduce((acc, val) => {

          let test = payloadGrants.find((pg) => {
            
            if (pg.note_id === val.note_id && pg.user_id === val.user_id && pg.group_id === val.group_id) {
              
              return true;
            }
          });

          if (test === undefined) {

            acc.push(val.id);
          }

          return acc; 
        }, []);

        return knex
          .del()
          .from('note_grants')
          .whereIn('id', grantsToDelete)
          .then(() => {
            return true;
          });
      })
      .then(() => {

        let grantsToInsert = payloadGrants.reduce((acc, val) => {

          let test = existingGrants.find((eg) => {

            if (eg.note_id === val.note_id && eg.user_id === val.user_id && eg.group_id === val.group_id) {
              
              return true;
            }
          });

          if (test === undefined) {
            
            acc.push(val);
          }

          return acc;
        }, []);

        return knex
          .insert(grantsToInsert)
          .into('note_grants')
          .then(() => {
            return true;
          });
      })
      .then(() => {
        return true;
      });
  };

  /**
   * Replace note specified by id and owned by currentUser (complete replacement)
   */
  pub.replace = function(noteID, payload, currentUser) {

    let validNoteID      = null;
    let validPayload     = null;
    let validCurrentUser = null;
    let userID           = null;
    let existingGrants   = [];
    let payloadGrants    = [];

    return Bluebird
      .resolve()
      .then(() => {

        return validateNoteID(noteID)
          .then((data) => {
            validNoteID = data;
          });
      })
      .then(() => {

        return validateReplacePayload(payload)
          .then((data) => {
            validPayload = data;
          });
      })
      .then(() => {

        return validateCurrentUser(currentUser)
          .then((data) => {
            validCurrentUser = data;
          });
      })
      .then(() => {

        return validateOwnership(noteID, currentUser);
      }) 
      .then(() => {

        // Get user id for currentUser

        return knex
          .select('id')
          .from('users')
          .where('username', validCurrentUser)
          .then((result) => {
            userID = result[0].id;
          });
      })
      .then(() => {

        // Update note in notes table

        let updates = Object.assign({}, validPayload);

        updates.visibility = getVisibilityType(validPayload.visibility);
        
        return knex('notes')
          .update(updates)
          .where('id', validNoteID)
          .andWhere('owner_id', userID)
          .then((result) => {
            return result;
          });
        
      })
      .then(() => {

        // Get existing grants (user and group) for note

        return knex
          .select(
            'id',
            'note_id',
            'user_id',
            'group_id'
          )
          .from('note_grants')
          .where('note_id', noteID)
          .then((results) => {
            existingGrants = results;
          });
      })
      .then(() => {

        // Get any possible user grants from payload, append to payloadGrants

        if (validPayload.visibility && validPayload.visibility.users && validPayload.visibility.users.length > 0) {

          return knex
            .select('id')
            .from('users')
            .whereIn('username', validPayload.visibility.users)
            .then((results) => {

              results.forEach((user) => {
                
                payloadGrants.push({
                  note_id: noteID,
                  user_id: user.id,
                  group_id: null,
                });
              });
            });
        }
      })
      .then(() => {

        // Get any possible group grants from payload, append to payloadGrants

        if (validPayload.visibility && validPayload.visibility.groups && validPayload.visibility.groups.length > 0) {

          return knex
            .select('id')
            .from('groups')
            .whereIn('name', validPayload.visibility.groups)
            .andWhere('owner_id', userID)
            .then((results) => {

              let groupIDs = results.map((g) => { return g.id });

              return knex
                .select(
                  'user_id', 
                  'group_id'
                )
                .from('group_members')
                .whereIn('group_id', groupIDs)
                .then((results) => {

                  results.forEach((g) => {

                    payloadGrants.push({
                      note_id: noteID,
                      user_id: g.user_id,
                      group_id: g.group_id,
                    });
                  });
                });
            });
        }
      })
      .then(() => {

        let grantsToDelete = existingGrants.reduce((acc, val) => {

          let test = payloadGrants.find((pg) => {
            
            if (pg.note_id === val.note_id && pg.user_id === val.user_id && pg.group_id === val.group_id) {
              
              return true;
            }
          });

          if (test === undefined) {

            acc.push(val.id);
          }

          return acc; 
        }, []);

        return knex
          .del()
          .from('note_grants')
          .whereIn('id', grantsToDelete)
          .then(() => {
            return true;
          });
      })
      .then(() => {

        let grantsToInsert = payloadGrants.reduce((acc, val) => {

          let test = existingGrants.find((eg) => {

            if (eg.note_id === val.note_id && eg.user_id === val.user_id && eg.group_id === val.group_id) {
              
              return true;
            }
          });

          if (test === undefined) {
            
            acc.push(val);
          }

          return acc;
        }, []);

        return knex
          .insert(grantsToInsert)
          .into('note_grants')
          .then(() => {
            return true;
          });
      })
      .then(() => {
        return true;
      });
  };

  /**
   * Delete note specified by id and owned by currentUser
   */
  pub.destroy = function(noteID, currentUser) {

    let validNoteID      = null;
    let validCurrentUser = null;
    let userID           = null;

    return Bluebird
      .resolve()
      .then(() => {

        return validateNoteID(noteID)
          .then((data) => {
            validNoteID = data;
          });
      })
      .then(() => {

        return validateCurrentUser(currentUser)
          .then((data) => {
            validCurrentUser = data;
          });
      })
      .then(() => {

        return validateOwnership(noteID, currentUser);
      }) 
      .then(() => {

        // Get user id

        return knex
          .select('id')
          .from('users')
          .where('username', validCurrentUser)
          .then((result) => {
            userID = result[0].id;
          });
      })
      .then(() => {

        // Delete from notes

        // Coresponding entries in note_grants are also deleted because of 
        // foreign key references

        return knex
          .del()
          .from('notes')
          .where('id', validNoteID)
          .andWhere('owner_id', userID)
          .then((result) => {
            return result;
          });
      })
      .then(() => {
        return true;
      })
  };

  return pub;
};

module.exports = engage;
