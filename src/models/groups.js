'use strict';

const Bluebird = require('bluebird');
const Joi      = require('joi');

const engage = function (server, knex) {

  const pub = {};
  
  /**
   * Sanitize and validate groupID
   */
  const validateGroupID = function (groupID) {

    return new Bluebird((resolve, reject) => {

      const schema  = server.plugins.schemas.groupID;
      const options = { stripUnknown: true };
    
      // Validate against schema
      Joi.validate(groupID, schema, options, (err, val) => {
        
        if (err) {
          reject(new Error('groupID is malformed'));
        } else { 
          resolve(val);
        }
      });
    })
    .then((validID) => {

        // Check for presence in database
        return knex
          .select('id')
          .from('groups')
          .where('id', validID)
          .then((result) => {
            if (result.length === 0) {
              throw new Error('groupID does not exist');
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

      const schema  = server.plugins.schemas.groupCreatePayload;
      const options = { stripUnknown: true };
    
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

      const schema  = server.plugins.schemas.groupUpdatePayload;
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

      const schema  = server.plugins.schemas.groupReplacePayload;
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
   * Sanitize and validate currentUser
   */
  const validateCurrentUser = function (currentUser) {

    return new Bluebird((resolve, reject) => {

      const schema  = server.plugins.schemas.username;
      const options = { stripUnknown: true };
    
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
          .then((rows) => {
            if (rows.length === 0) {
              throw new Error('currentUser does not exist');
            } else { 
              return validCurrentUser;
            }
          });
    });
  };

  /**
   * Transform "flat" database rows into "hierarchical" objects.
   */
  const format = function (results) {

    const findOrCreateGroup = function (collection, item) {

      let group = collection.find((i) => { return i.id === item.id });

      if (!group) {

        group = {
          id: item.id,
          name: item.name,
          members: [],
        };

        collection.push(group);
      }

      return group;
    };

    return results.reduce((acc, row) => {

      let g = findOrCreateGroup(acc, row);

      g.members.push({
        username: row.username, 
        real_name: row.real_name,
      });

      return acc;
    }, []);
  };

  /**
   * Find all groups owned by current user
   */
  pub.findAll = function(currentUser) {

    return Bluebird
      .all([
        validateCurrentUser(currentUser),
      ])
      .then((valid) => {

        const validCurrentUser = valid[0];

        // Get all groups by owner
        
        return knex
          .select(
            'groups.id',
            'groups.name',
            'members.username',
            'members.real_name'
          )
          .from('groups')
          .leftJoin('users AS owners', 'owners.id', '=', 'groups.owner_id')
          .leftJoin('group_members', 'groups.id', '=', 'group_members.group_id')
          .leftJoin('users AS members', 'members.id', '=', 'group_members.user_id')
          .where('owners.username', validCurrentUser)
          .orderBy('groups.id', 'ASC')
          .then((result) => {
            return result;
          });

      })
      .then(format);
  };

  /**
   * Find group specified by id and owned by currentUser
   */
  pub.findByID = function(groupID, currentUser) {

    return Bluebird
      .all([
        validateGroupID(groupID),
        validateCurrentUser(currentUser),
      ])
      .then((valid) => {

        const validID          = valid[0];
        const validCurrentUser = valid[1];

        // Get one group by id and owner
        
        return knex
          .select(
            'groups.id',
            'groups.name',
            'members.username',
            'members.real_name'
          )
          .from('groups')
          .leftJoin('users AS owners', 'owners.id', '=', 'groups.owner_id')
          .leftJoin('group_members', 'groups.id', '=', 'group_members.group_id')
          .leftJoin('users AS members', 'members.id', '=', 'group_members.user_id')
          .where('groups.id', validID)
          .andWhere('owners.username', validCurrentUser)
          .then((results) => {
            return results;
          });

      })
      .then(format)
      .then((formattedResults) => {
        return formattedResults[0];
      });
  };

  /**
   * Create a new group owned by currentUser
   */
  pub.create = function(payload, currentUser) {

    let validPayload     = null;
    let validCurrentUser = null;
    let userID           = null;
    let groupID          = null;
    let memberIDs        = null;

    return Bluebird
      .all([
        validateCreatePayload(payload),
        validateCurrentUser(currentUser),
      ])
      .then((valid) => {
        
        validPayload     = valid[0]
        validCurrentUser = valid[1];
      })
      .then(() => {

        // Get user id from username

        return knex
          .select('id')
          .from('users')
          .where('username', validCurrentUser)
          .then((result) => {
            userID = result[0].id;
          });
      })
      .then(() => {

        // Insert into groups, save groupID
        
        return knex
          .insert({
            name: validPayload.name,
            owner_id: userID,
          })
          .into('groups')
          .returning('id')
          .then((result) => {
            groupID = result[0];
          });
      })
      .then(() => {
  
        // Get member ids from usernames

        return knex
          .select('id')
          .from('users')
          .whereIn('username', validPayload.members)
          .then((results) => {

            memberIDs = results.map((r) => {
              return r.id;
            });
          });
      })
      .then(() => {

        // Insert into group_members

        const rows = memberIDs.map((i) => {
          return { group_id: groupID, user_id: i };
        });

        return knex
          .insert(rows)
          .into('group_members');
      })
      .then(() => {
        return groupID;
      });
  };

  /**
   * Update group specified by id and owned by currentUser (partial change)
   */
  pub.update = function(groupID, payload, currentUser) {

    let validGroupID     = null;
    let validPayload     = null;
    let validCurrentUser = null;
    let userID           = null;
    let existingMembers  = [];
    let payloadMembers   = [];

    return Bluebird
      .all([
        validateGroupID(groupID),
        validateUpdatePayload(payload),
        validateCurrentUser(currentUser),
      ])
      .then((valid) => {

        validGroupID     = valid[0];
        validPayload     = valid[1];
        validCurrentUser = valid[2];
      })
      .then(() => {

        // Get user id from username

        return knex
          .select('id')
          .from('users')
          .where('username', validCurrentUser)
          .then((result) => {
            userID = result[0].id;
          });
      })
      .then(() => {

        // Update groups table if necessary

        if (validPayload.name) {

          return knex('groups')
            .update({
              name: validPayload.name,
            })
            .where('id', validGroupID)
            .andWhere('owner_id', userID)
            .then((result) => {
              return result;
            });
        }
      })
      .then(() => {

        if (validPayload.members) {

          // get existing members
          return knex
            .select(
              'id', 
              'group_id', 
              'user_id'
            )
            .from('group_members')
            .where('group_id', groupID)
            .then((result) => {
              existingMembers = result;
            });
        }
      })
      .then(() => {

        if (validPayload.members) {

          // get payload members
          return knex
            .select('id')
            .from('users')
            .whereIn('username', validPayload.members)
            .then((results) => {

              results.forEach((user) => {

                payloadMembers.push({
                  group_id: validGroupID,
                  user_id: user.id,
                });
              });
            });
        }
      })
      .then(() => {

        let membersToDelete = existingMembers.reduce((acc, val) => {

          let test = payloadMembers.find((pm) => {
            if (pm.user_id === val.user_id) {
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
          .from('group_members')
          .whereIn('id', membersToDelete)
          .then(() => {
            return true;
          });
      })
      .then(() => {

        let membersToInsert = payloadMembers.reduce((acc, val) => {

          let test = existingMembers.find((em) => {
            if (em.user_id === val.user_id) {
              return true;
            }
          });

          if (test === undefined) {
            acc.push(val);
          }

          return acc;
        }, []);

        return knex
          .insert(membersToInsert)
          .into('group_members')
          .then(() => {
            return true;
          });
      })
      .then(() => {
        return true;
      });
  };

  /**
   * Replace group specified by id and owned by currentUser (complete replacement)
   */
  pub.replace = function(groupID, payload, currentUser) {

    let validGroupID     = null;
    let validPayload     = null;
    let validCurrentUser = null;
    let userID           = null;
    let existingMembers  = [];
    let payloadMembers   = [];

    return Bluebird
      .all([
        validateGroupID(groupID),
        validateReplacePayload(payload),
        validateCurrentUser(currentUser),
      ])
      .then((valid) => {

        validGroupID     = valid[0];
        validPayload     = valid[1];
        validCurrentUser = valid[2];
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

        // Update groups table 

        return knex('groups')
          .update({
            name: validPayload.name,
          })
          .where('id', validGroupID)
          .andWhere('owner_id', userID)
          .then((result) => {
            return result;
          });
      })
      .then(() => {

        // get existing members
        return knex
          .select(
            'id', 
            'group_id', 
            'user_id'
          )
          .from('group_members')
          .where('group_id', groupID)
          .then((result) => {
            existingMembers = result;
          });
      })
      .then(() => {

        // get payload members
        return knex
          .select('id')
          .from('users')
          .whereIn('username', validPayload.members)
          .then((results) => {

            results.forEach((user) => {

              payloadMembers.push({
                group_id: validGroupID,
                user_id: user.id,
              });
            });
          });
      })
      .then(() => {

        let membersToDelete = existingMembers.reduce((acc, val) => {

          let test = payloadMembers.find((pm) => {
            if (pm.user_id === val.user_id) {
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
          .from('group_members')
          .whereIn('id', membersToDelete)
          .then(() => {
            return true;
          });
      })
      .then(() => {

        let membersToInsert = payloadMembers.reduce((acc, val) => {

          let test = existingMembers.find((em) => {
            if (em.user_id === val.user_id) {
              return true;
            }
          });

          if (test === undefined) {
            acc.push(val);
          }

          return acc;
        }, []);

        return knex
          .insert(membersToInsert)
          .into('group_members')
          .then(() => {
            return true;
          });
      })
      .then(() => {
        return true;
      });
  };

  /**
   * Delete group specified by id and owned by currentUser
   */
  pub.destroy = function(groupID, currentUser) {

    let validID          = null;
    let validCurrentUser = null;
    let userID           = null;

    return Bluebird
      .all([
        validateGroupID(groupID),
        validateCurrentUser(currentUser),
      ])
      .then((valid) => {

        validID          = valid[0];
        validCurrentUser = valid[1];
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

        // delete from groups

        // correspoding entries in group_members, and note_grants are also 
        // deleted because of foreign key references

        return knex
          .del()
          .from('groups')
          .where('id', validID)
          .andWhere('owner_id', userID)
          .then((result) => {
            return result;
          });
      })
      .then(() => {
        return true;
      });
  };

  return pub;
};

module.exports = engage;
