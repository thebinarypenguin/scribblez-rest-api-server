#!/bin/bash

sudo add-apt-repository ppa:ubuntu-toolchain-r/test -y

sudo apt-get update -q

sudo apt-get install g++-4.8 -y

psql -c 'CREATE DATABASE scribblez;' -U postgres

psql -c 'CREATE ROLE scribblez WITH LOGIN;' -U postgres

psql -c 'GRANT ALL PRIVILEGES ON DATABASE scribblez TO scribblez;' -U postgres

git clone https://github.com/thebinarypenguin/scribblez-database.git

cd scribblez-database

npm install

cp knexfile.example.js knexfile.js

./node_modules/knex/bin/cli.js migrate:latest

./node_modules/knex/bin/cli.js seed:run
