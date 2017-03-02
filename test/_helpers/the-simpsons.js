'use strict';

const bcrypt = require('bcrypt');

exports.seed = function(knex, Bluebird) {

  let users         = [];
  let notes         = [];
  let groups        = [];
  let group_members = [];
  let note_grants   = [];

  const getUserID = function (realName) {
    
    let target = users.find((u) => {
      return u.real_name === realName;
    });

    return target.id;
  };

  const getGroupID = function (userRealName, groupName) {

    let target = groups.find((g) => {
      return g.owner_id === getUserID(userRealName) && g.name === groupName;
    });

    return target.id;
  };

  const getNoteID = function (userRealName, bodyContents, visibility) {

    let target = notes.find((n) => {
      return n.owner_id === getUserID(userRealName) && n.body.includes(bodyContents) && n.visibility === visibility;
    });

    return target.id;
  };

  const hash_password = function (password) {

    // Using the synchronous version is acceptable in a small script like this
    // but using the asynchronous version is necessary in application code

    return bcrypt.hashSync(password, 10);
  };

  return new Bluebird(function (resolve) {
    resolve();
  })
  .then(() => {

    users = [
      { real_name: 'Homer Simpson',  email_address: 'homer@example.com',  username: 'homer',  password_hash: hash_password('password') },
      { real_name: 'Marge Simpson',  email_address: 'marge@example.com',  username: 'marge',  password_hash: hash_password('password') },
      { real_name: 'Bart Simpson',   email_address: 'bart@example.com',   username: 'bart',   password_hash: hash_password('password') },
      { real_name: 'Lisa Simpson',   email_address: 'lisa@example.com',   username: 'lisa',   password_hash: hash_password('password') },
      { real_name: 'Maggie Simpson', email_address: 'maggie@example.com', username: 'maggie', password_hash: hash_password('password') },

      { real_name: 'Patty Bouvier',  email_address: 'patty@example.com',  username: 'patty',  password_hash: hash_password('password') },
      { real_name: 'Selma Bouvier',  email_address: 'selma@example.com',  username: 'selma',  password_hash: hash_password('password') },

      { real_name: 'Ned Flanders',   email_address: 'ned@example.com',    username: 'ned',    password_hash: hash_password('password') },
      { real_name: 'Maude Flanders', email_address: 'maude@example.com',  username: 'maude',  password_hash: hash_password('password') },
      { real_name: 'Rod Flanders',   email_address: 'rod@example.com',    username: 'rod',    password_hash: hash_password('password') },
      { real_name: 'Todd Flanders',  email_address: 'todd@example.com',   username: 'todd',   password_hash: hash_password('password') },

      { real_name: 'Lenny Leonard',  email_address: 'lenny@example.com',  username: 'lenny',  password_hash: hash_password('password') },
      { real_name: 'Carl Carlson',   email_address: 'carl@example.com',   username: 'carl',   password_hash: hash_password('password') },

      { real_name: 'Moe Szyslak',    email_address: 'moe@example.com',    username: 'moe',    password_hash: hash_password('password') },
    ]

    return knex.insert(users, 'id').into('users').then((ids) => {
      ids.forEach((id, index) => {
        users[index].id = id;
      });
    });
  })
  .then(() => {

    users.forEach((user) => {

      if (user.real_name === 'Homer Simpson') {

        notes.push({ owner_id: user.id, body: `${user.real_name}'s first public note`, visibility: 'public' });
        notes.push({ owner_id: user.id, body: `${user.real_name}'s second public note`, visibility: 'public' });
        notes.push({ owner_id: user.id, body: `${user.real_name}'s third public note`, visibility: 'public' });

        notes.push({ owner_id: user.id, body: `${user.real_name}'s first private note`, visibility: 'private' });
        notes.push({ owner_id: user.id, body: `${user.real_name}'s second private note`, visibility: 'private' });
        notes.push({ owner_id: user.id, body: `${user.real_name}'s third private note`, visibility: 'private' });

        notes.push({ owner_id: user.id, body: `${user.real_name}'s first shared note`, visibility: 'shared' });
        notes.push({ owner_id: user.id, body: `${user.real_name}'s second shared note`, visibility: 'shared' });
        notes.push({ owner_id: user.id, body: `${user.real_name}'s third shared note`, visibility: 'shared' });
      }
      
      if (user.real_name === 'Marge Simpson') {

        notes.push({ owner_id: user.id, body: `${user.real_name}'s first public note`, visibility: 'public' });
        notes.push({ owner_id: user.id, body: `${user.real_name}'s second public note`, visibility: 'public' });
        notes.push({ owner_id: user.id, body: `${user.real_name}'s third public note`, visibility: 'public' });

        notes.push({ owner_id: user.id, body: `${user.real_name}'s first private note`, visibility: 'private' });
        notes.push({ owner_id: user.id, body: `${user.real_name}'s second private note`, visibility: 'private' });
        notes.push({ owner_id: user.id, body: `${user.real_name}'s third private note`, visibility: 'private' });

        notes.push({ owner_id: user.id, body: `${user.real_name}'s first shared note`, visibility: 'shared' });
        notes.push({ owner_id: user.id, body: `${user.real_name}'s second shared note`, visibility: 'shared' });
        notes.push({ owner_id: user.id, body: `${user.real_name}'s third shared note`, visibility: 'shared' });
        notes.push({ owner_id: user.id, body: `${user.real_name}'s fourth shared note`, visibility: 'shared' });
      }
      
      if (user.real_name === 'Bart Simpson') {

        notes.push({ owner_id: user.id, body: `${user.real_name}'s first public note`, visibility: 'public' });
        notes.push({ owner_id: user.id, body: `${user.real_name}'s second public note`, visibility: 'public' });
        notes.push({ owner_id: user.id, body: `${user.real_name}'s third public note`, visibility: 'public' });

        notes.push({ owner_id: user.id, body: `${user.real_name}'s first private note`, visibility: 'private' });
        notes.push({ owner_id: user.id, body: `${user.real_name}'s second private note`, visibility: 'private' });
        notes.push({ owner_id: user.id, body: `${user.real_name}'s third private note`, visibility: 'private' });

        notes.push({ owner_id: user.id, body: `${user.real_name}'s first shared note`, visibility: 'shared' });
        notes.push({ owner_id: user.id, body: `${user.real_name}'s second shared note`, visibility: 'shared' });
      }
      
      if (user.real_name === 'Lisa Simpson') {

        notes.push({ owner_id: user.id, body: `${user.real_name}'s first public note`, visibility: 'public' });
        notes.push({ owner_id: user.id, body: `${user.real_name}'s second public note`, visibility: 'public' });
        notes.push({ owner_id: user.id, body: `${user.real_name}'s third public note`, visibility: 'public' });

        notes.push({ owner_id: user.id, body: `${user.real_name}'s first private note`, visibility: 'private' });
        notes.push({ owner_id: user.id, body: `${user.real_name}'s second private note`, visibility: 'private' });
        notes.push({ owner_id: user.id, body: `${user.real_name}'s third private note`, visibility: 'private' });

        notes.push({ owner_id: user.id, body: `${user.real_name}'s first shared note`, visibility: 'shared' });
        notes.push({ owner_id: user.id, body: `${user.real_name}'s second shared note`, visibility: 'shared' });
      }
      
      if (user.real_name === 'Maggie Simpson') {
        // None
      }
      
      if (user.real_name === 'Patty Bouvier') {

        notes.push({ owner_id: user.id, body: `${user.real_name}'s first public note`, visibility: 'public' });
        notes.push({ owner_id: user.id, body: `${user.real_name}'s second public note`, visibility: 'public' });
        notes.push({ owner_id: user.id, body: `${user.real_name}'s third public note`, visibility: 'public' });

        notes.push({ owner_id: user.id, body: `${user.real_name}'s first private note`, visibility: 'private' });
        notes.push({ owner_id: user.id, body: `${user.real_name}'s second private note`, visibility: 'private' });
        notes.push({ owner_id: user.id, body: `${user.real_name}'s third private note`, visibility: 'private' });

        notes.push({ owner_id: user.id, body: `${user.real_name}'s first shared note`, visibility: 'shared' });
        notes.push({ owner_id: user.id, body: `${user.real_name}'s second shared note`, visibility: 'shared' });
      }
      
      if (user.real_name === 'Selma Bouvier') {

        notes.push({ owner_id: user.id, body: `${user.real_name}'s first public note`, visibility: 'public' });
        notes.push({ owner_id: user.id, body: `${user.real_name}'s second public note`, visibility: 'public' });
        notes.push({ owner_id: user.id, body: `${user.real_name}'s third public note`, visibility: 'public' });

        notes.push({ owner_id: user.id, body: `${user.real_name}'s first private note`, visibility: 'private' });
        notes.push({ owner_id: user.id, body: `${user.real_name}'s second private note`, visibility: 'private' });
        notes.push({ owner_id: user.id, body: `${user.real_name}'s third private note`, visibility: 'private' });

        notes.push({ owner_id: user.id, body: `${user.real_name}'s first shared note`, visibility: 'shared' });
        notes.push({ owner_id: user.id, body: `${user.real_name}'s second shared note`, visibility: 'shared' });
      }
      
      if (user.real_name === 'Ned Flanders') {

        notes.push({ owner_id: user.id, body: `${user.real_name}'s first shared note`, visibility: 'shared' });
        notes.push({ owner_id: user.id, body: `${user.real_name}'s second shared note`, visibility: 'shared' });
        notes.push({ owner_id: user.id, body: `${user.real_name}'s third shared note`, visibility: 'shared' });
        notes.push({ owner_id: user.id, body: `${user.real_name}'s fourth shared note`, visibility: 'shared' });
        notes.push({ owner_id: user.id, body: `${user.real_name}'s fifth shared note`, visibility: 'shared' });
        notes.push({ owner_id: user.id, body: `${user.real_name}'s sixth shared note`, visibility: 'shared' });
      }
      
      if (user.real_name === 'Maude Flanders') {
        // None
      }
      
      if (user.real_name === 'Rod Flanders') {

        notes.push({ owner_id: user.id, body: `${user.real_name}'s first shared note`, visibility: 'shared' });
      }
      
      if (user.real_name === 'Todd Flanders') {

        notes.push({ owner_id: user.id, body: `${user.real_name}'s first shared note`, visibility: 'shared' });
      }
      
      if (user.real_name === 'Lenny Leonard') {
        // None
      }
      
      if (user.real_name === 'Carl Carlson') {
        // None
      }
      
      if (user.real_name === 'Moe Szyslak') {
        // None
      }
    });

    return knex.insert(notes, 'id').into('notes').then((ids) => {
      ids.forEach((id, index) => {
        notes[index].id = id;
      });
    });
  })
  .then(() => {
    
    groups = [

      { owner_id: getUserID('Homer Simpson'), name: 'Family' },
      { owner_id: getUserID('Homer Simpson'), name: 'Friends' },
      { owner_id: getUserID('Homer Simpson'), name: 'In-Laws' },
      { owner_id: getUserID('Homer Simpson'), name: 'Stupid Flanders' },

      { owner_id: getUserID('Marge Simpson'), name: 'Sisters' },
      { owner_id: getUserID('Marge Simpson'), name: 'Family' },
      { owner_id: getUserID('Marge Simpson'), name: 'Flanders' },
      { owner_id: getUserID('Marge Simpson'), name: 'Everyone' },

      
      { owner_id: getUserID('Bart Simpson'), name: 'Family' },

      { owner_id: getUserID('Lisa Simpson'), name: 'Family' },

      { owner_id: getUserID('Maggie Simpson'), name: 'Family' },

      { owner_id: getUserID('Patty Bouvier'), name: 'Sisters' },
      { owner_id: getUserID('Patty Bouvier'), name: 'In-Laws' },
      
      { owner_id: getUserID('Selma Bouvier'), name: 'Sisters' },
      { owner_id: getUserID('Selma Bouvier'), name: 'In-Laws' },
      
      { owner_id: getUserID('Ned Flanders'), name: 'Family' },
      { owner_id: getUserID('Ned Flanders'), name: 'Sons' },
      { owner_id: getUserID('Ned Flanders'), name: 'Myself' },
      
      { owner_id: getUserID('Maude Flanders'), name: 'Family' },
      
      { owner_id: getUserID('Rod Flanders'), name: 'Family' },
      
      { owner_id: getUserID('Todd Flanders'), name: 'Family' },

      { owner_id: getUserID('Moe Szyslak'), name: 'Friends' },
    ];

    return knex.insert(groups, 'id').into('groups').then((ids) => {
      ids.forEach((id, index) => {
        groups[index].id = id;
      });
    });
  })
  .then(() => {

    group_members = [
      { group_id: getGroupID('Homer Simpson', 'Family'), user_id: getUserID('Marge Simpson') },
      { group_id: getGroupID('Homer Simpson', 'Family'), user_id: getUserID('Bart Simpson') },
      { group_id: getGroupID('Homer Simpson', 'Family'), user_id: getUserID('Lisa Simpson') },
      { group_id: getGroupID('Homer Simpson', 'Family'), user_id: getUserID('Maggie Simpson') },

      { group_id: getGroupID('Homer Simpson', 'Friends'), user_id: getUserID('Lenny Leonard') },
      { group_id: getGroupID('Homer Simpson', 'Friends'), user_id: getUserID('Carl Carlson') },

      { group_id: getGroupID('Homer Simpson', 'In-Laws'), user_id: getUserID('Patty Bouvier') },
      { group_id: getGroupID('Homer Simpson', 'In-Laws'), user_id: getUserID('Selma Bouvier') },

      { group_id: getGroupID('Homer Simpson', 'Stupid Flanders'), user_id: getUserID('Ned Flanders') },

      { group_id: getGroupID('Marge Simpson', 'Sisters'), user_id: getUserID('Patty Bouvier') },
      { group_id: getGroupID('Marge Simpson', 'Sisters'), user_id: getUserID('Selma Bouvier') },

      { group_id: getGroupID('Marge Simpson', 'Family'), user_id: getUserID('Homer Simpson') },
      { group_id: getGroupID('Marge Simpson', 'Family'), user_id: getUserID('Bart Simpson') },
      { group_id: getGroupID('Marge Simpson', 'Family'), user_id: getUserID('Lisa Simpson') },
      { group_id: getGroupID('Marge Simpson', 'Family'), user_id: getUserID('Maggie Simpson') },

      { group_id: getGroupID('Marge Simpson', 'Flanders'), user_id: getUserID('Ned Flanders') },
      { group_id: getGroupID('Marge Simpson', 'Flanders'), user_id: getUserID('Maude Flanders') },
      { group_id: getGroupID('Marge Simpson', 'Flanders'), user_id: getUserID('Rod Flanders') },
      { group_id: getGroupID('Marge Simpson', 'Flanders'), user_id: getUserID('Todd Flanders') },

      { group_id: getGroupID('Marge Simpson', 'Everyone'), user_id: getUserID('Patty Bouvier') },
      { group_id: getGroupID('Marge Simpson', 'Everyone'), user_id: getUserID('Selma Bouvier') },
      { group_id: getGroupID('Marge Simpson', 'Everyone'), user_id: getUserID('Homer Simpson') },
      { group_id: getGroupID('Marge Simpson', 'Everyone'), user_id: getUserID('Bart Simpson') },
      { group_id: getGroupID('Marge Simpson', 'Everyone'), user_id: getUserID('Lisa Simpson') },
      { group_id: getGroupID('Marge Simpson', 'Everyone'), user_id: getUserID('Maggie Simpson') },
      { group_id: getGroupID('Marge Simpson', 'Everyone'), user_id: getUserID('Ned Flanders') },
      { group_id: getGroupID('Marge Simpson', 'Everyone'), user_id: getUserID('Maude Flanders') },
      { group_id: getGroupID('Marge Simpson', 'Everyone'), user_id: getUserID('Rod Flanders') },
      { group_id: getGroupID('Marge Simpson', 'Everyone'), user_id: getUserID('Todd Flanders') },

      { group_id: getGroupID('Bart Simpson', 'Family'), user_id: getUserID('Homer Simpson') },
      { group_id: getGroupID('Bart Simpson', 'Family'), user_id: getUserID('Marge Simpson') },
      { group_id: getGroupID('Bart Simpson', 'Family'), user_id: getUserID('Lisa Simpson') },
      { group_id: getGroupID('Bart Simpson', 'Family'), user_id: getUserID('Maggie Simpson') },

      { group_id: getGroupID('Lisa Simpson', 'Family'), user_id: getUserID('Homer Simpson') },
      { group_id: getGroupID('Lisa Simpson', 'Family'), user_id: getUserID('Marge Simpson') },
      { group_id: getGroupID('Lisa Simpson', 'Family'), user_id: getUserID('Bart Simpson') },
      { group_id: getGroupID('Lisa Simpson', 'Family'), user_id: getUserID('Maggie Simpson') },

      { group_id: getGroupID('Maggie Simpson', 'Family'), user_id: getUserID('Homer Simpson') },
      { group_id: getGroupID('Maggie Simpson', 'Family'), user_id: getUserID('Marge Simpson') },
      { group_id: getGroupID('Maggie Simpson', 'Family'), user_id: getUserID('Bart Simpson') },
      { group_id: getGroupID('Maggie Simpson', 'Family'), user_id: getUserID('Lisa Simpson') },

      { group_id: getGroupID('Patty Bouvier', 'Sisters'), user_id: getUserID('Selma Bouvier') },
      { group_id: getGroupID('Patty Bouvier', 'Sisters'), user_id: getUserID('Marge Simpson') },

      { group_id: getGroupID('Patty Bouvier', 'In-Laws'), user_id: getUserID('Homer Simpson') },
      { group_id: getGroupID('Patty Bouvier', 'In-Laws'), user_id: getUserID('Bart Simpson') },
      { group_id: getGroupID('Patty Bouvier', 'In-Laws'), user_id: getUserID('Lisa Simpson') },
      { group_id: getGroupID('Patty Bouvier', 'In-Laws'), user_id: getUserID('Maggie Simpson') },

      { group_id: getGroupID('Selma Bouvier', 'Sisters'), user_id: getUserID('Patty Bouvier') },
      { group_id: getGroupID('Selma Bouvier', 'Sisters'), user_id: getUserID('Marge Simpson') },
      
      { group_id: getGroupID('Selma Bouvier', 'In-Laws'), user_id: getUserID('Homer Simpson') },
      { group_id: getGroupID('Selma Bouvier', 'In-Laws'), user_id: getUserID('Bart Simpson') },
      { group_id: getGroupID('Selma Bouvier', 'In-Laws'), user_id: getUserID('Lisa Simpson') },
      { group_id: getGroupID('Selma Bouvier', 'In-Laws'), user_id: getUserID('Maggie Simpson') },
      
      { group_id: getGroupID('Ned Flanders', 'Family'), user_id: getUserID('Maude Flanders') },
      { group_id: getGroupID('Ned Flanders', 'Family'), user_id: getUserID('Rod Flanders') },
      { group_id: getGroupID('Ned Flanders', 'Family'), user_id: getUserID('Todd Flanders') },

      { group_id: getGroupID('Ned Flanders', 'Sons'), user_id: getUserID('Rod Flanders') },
      { group_id: getGroupID('Ned Flanders', 'Sons'), user_id: getUserID('Todd Flanders') },
      
      { group_id: getGroupID('Ned Flanders', 'Myself'), user_id: getUserID('Ned Flanders') },

      { group_id: getGroupID('Maude Flanders', 'Family'), user_id: getUserID('Ned Flanders') },
      { group_id: getGroupID('Maude Flanders', 'Family'), user_id: getUserID('Rod Flanders') },
      { group_id: getGroupID('Maude Flanders', 'Family'), user_id: getUserID('Todd Flanders') },
      
      { group_id: getGroupID('Rod Flanders', 'Family'), user_id: getUserID('Ned Flanders') },
      { group_id: getGroupID('Rod Flanders', 'Family'), user_id: getUserID('Maude Flanders') },
      { group_id: getGroupID('Rod Flanders', 'Family'), user_id: getUserID('Todd Flanders') },
      
      { group_id: getGroupID('Todd Flanders', 'Family'), user_id: getUserID('Ned Flanders') },
      { group_id: getGroupID('Todd Flanders', 'Family'), user_id: getUserID('Maude Flanders') },
      { group_id: getGroupID('Todd Flanders', 'Family'), user_id: getUserID('Rod Flanders') },
    ];

    return knex.insert(group_members, 'id').into('group_members').then((ids) => {
      ids.forEach((id, index) => {
        group_members[index].id = id;
      });
    });
  })
  .then(() => {

    note_grants = [

      { note_id: getNoteID('Homer Simpson', 'first', 'shared'), user_id: getUserID('Lenny Leonard'), group_id: null },
      { note_id: getNoteID('Homer Simpson', 'first', 'shared'), user_id: getUserID('Lenny Leonard'), group_id: getGroupID('Homer Simpson', 'Friends') },
      { note_id: getNoteID('Homer Simpson', 'first', 'shared'), user_id: getUserID('Carl Carlson'), group_id: getGroupID('Homer Simpson', 'Friends') },
      
      { note_id: getNoteID('Homer Simpson', 'second', 'shared'), user_id: getUserID('Carl Carlson'), group_id: null },
      { note_id: getNoteID('Homer Simpson', 'second', 'shared'), user_id: getUserID('Lenny Leonard'), group_id: getGroupID('Homer Simpson', 'Friends') },
      { note_id: getNoteID('Homer Simpson', 'second', 'shared'), user_id: getUserID('Carl Carlson'), group_id: getGroupID('Homer Simpson', 'Friends') },

      { note_id: getNoteID('Homer Simpson', 'third', 'shared'), user_id: getUserID('Lenny Leonard'), group_id: getGroupID('Homer Simpson', 'Friends') },
      { note_id: getNoteID('Homer Simpson', 'third', 'shared'), user_id: getUserID('Carl Carlson'), group_id: getGroupID('Homer Simpson', 'Friends') },

      { note_id: getNoteID('Marge Simpson', 'first', 'shared'), user_id: getUserID('Ned Flanders'), group_id: null },
      { note_id: getNoteID('Marge Simpson', 'first', 'shared'), user_id: getUserID('Patty Bouvier'), group_id: getGroupID('Marge Simpson', 'Sisters') },
      { note_id: getNoteID('Marge Simpson', 'first', 'shared'), user_id: getUserID('Selma Bouvier'), group_id: getGroupID('Marge Simpson', 'Sisters') },
      { note_id: getNoteID('Marge Simpson', 'first', 'shared'), user_id: getUserID('Homer Simpson'), group_id: getGroupID('Marge Simpson', 'Family') },
      { note_id: getNoteID('Marge Simpson', 'first', 'shared'), user_id: getUserID('Bart Simpson'), group_id: getGroupID('Marge Simpson', 'Family') },
      { note_id: getNoteID('Marge Simpson', 'first', 'shared'), user_id: getUserID('Lisa Simpson'), group_id: getGroupID('Marge Simpson', 'Family') },
      { note_id: getNoteID('Marge Simpson', 'first', 'shared'), user_id: getUserID('Maggie Simpson'), group_id: getGroupID('Marge Simpson', 'Family') },

      { note_id: getNoteID('Marge Simpson', 'second', 'shared'), user_id: getUserID('Patty Bouvier'), group_id: null },
      { note_id: getNoteID('Marge Simpson', 'second', 'shared'), user_id: getUserID('Selma Bouvier'), group_id: null },
      { note_id: getNoteID('Marge Simpson', 'second', 'shared'), user_id: getUserID('Homer Simpson'), group_id: getGroupID('Marge Simpson', 'Family') },
      { note_id: getNoteID('Marge Simpson', 'second', 'shared'), user_id: getUserID('Bart Simpson'), group_id: getGroupID('Marge Simpson', 'Family') },
      { note_id: getNoteID('Marge Simpson', 'second', 'shared'), user_id: getUserID('Lisa Simpson'), group_id: getGroupID('Marge Simpson', 'Family') },
      { note_id: getNoteID('Marge Simpson', 'second', 'shared'), user_id: getUserID('Maggie Simpson'), group_id: getGroupID('Marge Simpson', 'Family') },

      { note_id: getNoteID('Marge Simpson', 'third', 'shared'), user_id: getUserID('Ned Flanders'), group_id: null },
      { note_id: getNoteID('Marge Simpson', 'third', 'shared'), user_id: getUserID('Maude Flanders'), group_id: null },
      { note_id: getNoteID('Marge Simpson', 'third', 'shared'), user_id: getUserID('Patty Bouvier'), group_id: getGroupID('Marge Simpson', 'Sisters') },
      { note_id: getNoteID('Marge Simpson', 'third', 'shared'), user_id: getUserID('Selma Bouvier'), group_id: getGroupID('Marge Simpson', 'Sisters') },
      { note_id: getNoteID('Marge Simpson', 'third', 'shared'), user_id: getUserID('Homer Simpson'), group_id: getGroupID('Marge Simpson', 'Family') },
      { note_id: getNoteID('Marge Simpson', 'third', 'shared'), user_id: getUserID('Bart Simpson'), group_id: getGroupID('Marge Simpson', 'Family') },
      { note_id: getNoteID('Marge Simpson', 'third', 'shared'), user_id: getUserID('Lisa Simpson'), group_id: getGroupID('Marge Simpson', 'Family') },
      { note_id: getNoteID('Marge Simpson', 'third', 'shared'), user_id: getUserID('Maggie Simpson'), group_id: getGroupID('Marge Simpson', 'Family') },

      { note_id: getNoteID('Marge Simpson', 'fourth', 'shared'), user_id: getUserID('Ned Flanders'), group_id: getGroupID('Marge Simpson', 'Flanders') },
      { note_id: getNoteID('Marge Simpson', 'fourth', 'shared'), user_id: getUserID('Maude Flanders'), group_id: getGroupID('Marge Simpson', 'Flanders') },
      { note_id: getNoteID('Marge Simpson', 'fourth', 'shared'), user_id: getUserID('Rod Flanders'), group_id: getGroupID('Marge Simpson', 'Flanders') },
      { note_id: getNoteID('Marge Simpson', 'fourth', 'shared'), user_id: getUserID('Todd Flanders'), group_id: getGroupID('Marge Simpson', 'Flanders') },
      { note_id: getNoteID('Marge Simpson', 'fourth', 'shared'), user_id: getUserID('Homer Simpson'), group_id: getGroupID('Marge Simpson', 'Everyone') },
      { note_id: getNoteID('Marge Simpson', 'fourth', 'shared'), user_id: getUserID('Bart Simpson'), group_id: getGroupID('Marge Simpson', 'Everyone') },
      { note_id: getNoteID('Marge Simpson', 'fourth', 'shared'), user_id: getUserID('Lisa Simpson'), group_id: getGroupID('Marge Simpson', 'Everyone') },
      { note_id: getNoteID('Marge Simpson', 'fourth', 'shared'), user_id: getUserID('Maggie Simpson'), group_id: getGroupID('Marge Simpson', 'Everyone') },
      { note_id: getNoteID('Marge Simpson', 'fourth', 'shared'), user_id: getUserID('Patty Bouvier'), group_id: getGroupID('Marge Simpson', 'Everyone') },
      { note_id: getNoteID('Marge Simpson', 'fourth', 'shared'), user_id: getUserID('Selma Bouvier'), group_id: getGroupID('Marge Simpson', 'Everyone') },
      { note_id: getNoteID('Marge Simpson', 'fourth', 'shared'), user_id: getUserID('Ned Flanders'), group_id: getGroupID('Marge Simpson', 'Everyone') },
      { note_id: getNoteID('Marge Simpson', 'fourth', 'shared'), user_id: getUserID('Maude Flanders'), group_id: getGroupID('Marge Simpson', 'Everyone') },
      { note_id: getNoteID('Marge Simpson', 'fourth', 'shared'), user_id: getUserID('Rod Flanders'), group_id: getGroupID('Marge Simpson', 'Everyone') },
      { note_id: getNoteID('Marge Simpson', 'fourth', 'shared'), user_id: getUserID('Todd Flanders'), group_id: getGroupID('Marge Simpson', 'Everyone') },

      { note_id: getNoteID('Bart Simpson', 'first', 'shared'), user_id: getUserID('Lisa Simpson'), group_id: null },
      { note_id: getNoteID('Bart Simpson', 'first', 'shared'), user_id: getUserID('Homer Simpson'), group_id: getGroupID('Bart Simpson', 'Family') },
      { note_id: getNoteID('Bart Simpson', 'first', 'shared'), user_id: getUserID('Marge Simpson'), group_id: getGroupID('Bart Simpson', 'Family') },
      { note_id: getNoteID('Bart Simpson', 'first', 'shared'), user_id: getUserID('Lisa Simpson'), group_id: getGroupID('Bart Simpson', 'Family') },
      { note_id: getNoteID('Bart Simpson', 'first', 'shared'), user_id: getUserID('Maggie Simpson'), group_id: getGroupID('Bart Simpson', 'Family') },

      { note_id: getNoteID('Bart Simpson', 'second', 'shared'), user_id: getUserID('Lisa Simpson'), group_id: null },
      { note_id: getNoteID('Bart Simpson', 'second', 'shared'), user_id: getUserID('Homer Simpson'), group_id: getGroupID('Bart Simpson', 'Family') },
      { note_id: getNoteID('Bart Simpson', 'second', 'shared'), user_id: getUserID('Marge Simpson'), group_id: getGroupID('Bart Simpson', 'Family') },
      { note_id: getNoteID('Bart Simpson', 'second', 'shared'), user_id: getUserID('Lisa Simpson'), group_id: getGroupID('Bart Simpson', 'Family') },
      { note_id: getNoteID('Bart Simpson', 'second', 'shared'), user_id: getUserID('Maggie Simpson'), group_id: getGroupID('Bart Simpson', 'Family') },

      { note_id: getNoteID('Lisa Simpson', 'first', 'shared'), user_id: getUserID('Bart Simpson'), group_id: null },
      { note_id: getNoteID('Lisa Simpson', 'first', 'shared'), user_id: getUserID('Homer Simpson'), group_id: getGroupID('Lisa Simpson', 'Family') },
      { note_id: getNoteID('Lisa Simpson', 'first', 'shared'), user_id: getUserID('Marge Simpson'), group_id: getGroupID('Lisa Simpson', 'Family') },
      { note_id: getNoteID('Lisa Simpson', 'first', 'shared'), user_id: getUserID('Bart Simpson'), group_id: getGroupID('Lisa Simpson', 'Family') },
      { note_id: getNoteID('Lisa Simpson', 'first', 'shared'), user_id: getUserID('Maggie Simpson'), group_id: getGroupID('Lisa Simpson', 'Family') },

      { note_id: getNoteID('Lisa Simpson', 'second', 'shared'), user_id: getUserID('Bart Simpson'), group_id: null },
      { note_id: getNoteID('Lisa Simpson', 'second', 'shared'), user_id: getUserID('Homer Simpson'), group_id: getGroupID('Lisa Simpson', 'Family') },
      { note_id: getNoteID('Lisa Simpson', 'second', 'shared'), user_id: getUserID('Marge Simpson'), group_id: getGroupID('Lisa Simpson', 'Family') },
      { note_id: getNoteID('Lisa Simpson', 'second', 'shared'), user_id: getUserID('Bart Simpson'), group_id: getGroupID('Lisa Simpson', 'Family') },
      { note_id: getNoteID('Lisa Simpson', 'second', 'shared'), user_id: getUserID('Maggie Simpson'), group_id: getGroupID('Lisa Simpson', 'Family') },

      { note_id: getNoteID('Patty Bouvier', 'first', 'shared'), user_id: getUserID('Selma Bouvier'), group_id: getGroupID('Patty Bouvier', 'Sisters') },
      { note_id: getNoteID('Patty Bouvier', 'first', 'shared'), user_id: getUserID('Marge Simpson'), group_id: getGroupID('Patty Bouvier', 'Sisters') },
      { note_id: getNoteID('Patty Bouvier', 'first', 'shared'), user_id: getUserID('Homer Simpson'), group_id: getGroupID('Patty Bouvier', 'In-Laws') },
      { note_id: getNoteID('Patty Bouvier', 'first', 'shared'), user_id: getUserID('Bart Simpson'), group_id: getGroupID('Patty Bouvier', 'In-Laws') },
      { note_id: getNoteID('Patty Bouvier', 'first', 'shared'), user_id: getUserID('Lisa Simpson'), group_id: getGroupID('Patty Bouvier', 'In-Laws') },
      { note_id: getNoteID('Patty Bouvier', 'first', 'shared'), user_id: getUserID('Maggie Simpson'), group_id: getGroupID('Patty Bouvier', 'In-Laws') },

      { note_id: getNoteID('Patty Bouvier', 'second', 'shared'), user_id: getUserID('Selma Bouvier'), group_id: getGroupID('Patty Bouvier', 'Sisters') },
      { note_id: getNoteID('Patty Bouvier', 'second', 'shared'), user_id: getUserID('Marge Simpson'), group_id: getGroupID('Patty Bouvier', 'Sisters') },
      { note_id: getNoteID('Patty Bouvier', 'second', 'shared'), user_id: getUserID('Homer Simpson'), group_id: getGroupID('Patty Bouvier', 'In-Laws') },
      { note_id: getNoteID('Patty Bouvier', 'second', 'shared'), user_id: getUserID('Bart Simpson'), group_id: getGroupID('Patty Bouvier', 'In-Laws') },
      { note_id: getNoteID('Patty Bouvier', 'second', 'shared'), user_id: getUserID('Lisa Simpson'), group_id: getGroupID('Patty Bouvier', 'In-Laws') },
      { note_id: getNoteID('Patty Bouvier', 'second', 'shared'), user_id: getUserID('Maggie Simpson'), group_id: getGroupID('Patty Bouvier', 'In-Laws') },

      { note_id: getNoteID('Selma Bouvier', 'first', 'shared'), user_id: getUserID('Patty Bouvier'), group_id: getGroupID('Selma Bouvier', 'Sisters') },
      { note_id: getNoteID('Selma Bouvier', 'first', 'shared'), user_id: getUserID('Marge Simpson'), group_id: getGroupID('Selma Bouvier', 'Sisters') },
      { note_id: getNoteID('Selma Bouvier', 'first', 'shared'), user_id: getUserID('Homer Simpson'), group_id: getGroupID('Selma Bouvier', 'In-Laws') },
      { note_id: getNoteID('Selma Bouvier', 'first', 'shared'), user_id: getUserID('Bart Simpson'), group_id: getGroupID('Selma Bouvier', 'In-Laws') },
      { note_id: getNoteID('Selma Bouvier', 'first', 'shared'), user_id: getUserID('Lisa Simpson'), group_id: getGroupID('Selma Bouvier', 'In-Laws') },
      { note_id: getNoteID('Selma Bouvier', 'first', 'shared'), user_id: getUserID('Maggie Simpson'), group_id: getGroupID('Selma Bouvier', 'In-Laws') },

      { note_id: getNoteID('Selma Bouvier', 'second', 'shared'), user_id: getUserID('Patty Bouvier'), group_id: getGroupID('Selma Bouvier', 'Sisters') },
      { note_id: getNoteID('Selma Bouvier', 'second', 'shared'), user_id: getUserID('Marge Simpson'), group_id: getGroupID('Selma Bouvier', 'Sisters') },
      { note_id: getNoteID('Selma Bouvier', 'second', 'shared'), user_id: getUserID('Homer Simpson'), group_id: getGroupID('Selma Bouvier', 'In-Laws') },
      { note_id: getNoteID('Selma Bouvier', 'second', 'shared'), user_id: getUserID('Bart Simpson'), group_id: getGroupID('Selma Bouvier', 'In-Laws') },
      { note_id: getNoteID('Selma Bouvier', 'second', 'shared'), user_id: getUserID('Lisa Simpson'), group_id: getGroupID('Selma Bouvier', 'In-Laws') },
      { note_id: getNoteID('Selma Bouvier', 'second', 'shared'), user_id: getUserID('Maggie Simpson'), group_id: getGroupID('Selma Bouvier', 'In-Laws') },

      { note_id: getNoteID('Ned Flanders', 'first', 'shared'), user_id: getUserID('Rod Flanders'), group_id: null },
      { note_id: getNoteID('Ned Flanders', 'first', 'shared'), user_id: getUserID('Todd Flanders'), group_id: null },

      { note_id: getNoteID('Ned Flanders', 'second', 'shared'), user_id: getUserID('Rod Flanders'), group_id: null },
      { note_id: getNoteID('Ned Flanders', 'second', 'shared'), user_id: getUserID('Todd Flanders'), group_id: null },

      { note_id: getNoteID('Ned Flanders', 'third', 'shared'), user_id: getUserID('Maude Flanders'), group_id: getGroupID('Ned Flanders', 'Family') },
      { note_id: getNoteID('Ned Flanders', 'third', 'shared'), user_id: getUserID('Rod Flanders'), group_id: getGroupID('Ned Flanders', 'Family') },
      { note_id: getNoteID('Ned Flanders', 'third', 'shared'), user_id: getUserID('Todd Flanders'), group_id: getGroupID('Ned Flanders', 'Family') },
      { note_id: getNoteID('Ned Flanders', 'third', 'shared'), user_id: getUserID('Rod Flanders'), group_id: getGroupID('Ned Flanders', 'Sons') },
      { note_id: getNoteID('Ned Flanders', 'third', 'shared'), user_id: getUserID('Todd Flanders'), group_id: getGroupID('Ned Flanders', 'Sons') },

      { note_id: getNoteID('Ned Flanders', 'fourth', 'shared'), user_id: getUserID('Maude Flanders'), group_id: getGroupID('Ned Flanders', 'Family') },
      { note_id: getNoteID('Ned Flanders', 'fourth', 'shared'), user_id: getUserID('Rod Flanders'), group_id: getGroupID('Ned Flanders', 'Family') },
      { note_id: getNoteID('Ned Flanders', 'fourth', 'shared'), user_id: getUserID('Todd Flanders'), group_id: getGroupID('Ned Flanders', 'Family') },
      { note_id: getNoteID('Ned Flanders', 'fourth', 'shared'), user_id: getUserID('Rod Flanders'), group_id: getGroupID('Ned Flanders', 'Sons') },
      { note_id: getNoteID('Ned Flanders', 'fourth', 'shared'), user_id: getUserID('Todd Flanders'), group_id: getGroupID('Ned Flanders', 'Sons') },

      { note_id: getNoteID('Ned Flanders', 'fifth', 'shared'), user_id: getUserID('Ned Flanders'), group_id: null },

      { note_id: getNoteID('Ned Flanders', 'sixth', 'shared'), user_id: getUserID('Ned Flanders'), group_id: getGroupID('Ned Flanders', 'Myself') },

      { note_id: getNoteID('Rod Flanders', 'first', 'shared'), user_id: getUserID('Todd Flanders'), group_id: null },

      { note_id: getNoteID('Todd Flanders', 'first', 'shared'), user_id: getUserID('Rod Flanders'), group_id: null },
    ];

    return knex.insert(note_grants, 'id').into('note_grants').then((ids) => {
      ids.forEach((id, index) => {
        note_grants[index].id = id;
      });
    });
  });
};
