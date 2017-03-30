#!/bin/bash

#
# Create a PostgreSQL database.
#

psql -c 'CREATE DATABASE scribblez;' -U postgres

psql -c 'CREATE ROLE scribblez WITH LOGIN;' -U postgres

psql -c 'GRANT ALL PRIVILEGES ON DATABASE scribblez TO scribblez;' -U postgres

#
# Migrate the PostgreSQL database using the scripts from scribblez-database
#

git clone https://github.com/thebinarypenguin/scribblez-database.git

cd scribblez-database

npm install

cp knexfile.example.js knexfile.js

./node_modules/knex/bin/cli.js migrate:latest

cd ..

rm -rf scribblez-database

#
# Install scribblez-rest-api-server
#

npm install

#
# Configure scribblez-rest-api-server
#

cp ./src/config/test.example.js ./src/config/test.js
