#!/bin/bash

SQL="CREATE DATABASE scribblez; "
SQL+="CREATE ROLE scribblez WITH LOGIN; "
SQL+="GRANT ALL PRIVILEGES ON DATABASE scribblez TO scribblez; "

psql -c "$SQL" -U postgres

git clone https://github.com/thebinarypenguin/scribblez-database.git

cd scribblez-database

npm install

cp knexfile.example.js knexfile.js

./node_modules/knex/bin/cli.js migrate:latest

./node_modules/knex/bin/cli.js seed:run
