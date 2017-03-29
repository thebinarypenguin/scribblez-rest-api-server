# Scribblez REST API Server

[![Build Status](https://travis-ci.org/thebinarypenguin/scribblez-rest-api-server.svg?branch=master)](https://travis-ci.org/thebinarypenguin/scribblez-rest-api-server)
[![codecov](https://codecov.io/gh/thebinarypenguin/scribblez-rest-api-server/branch/master/graph/badge.svg)](https://codecov.io/gh/thebinarypenguin/scribblez-rest-api-server)


A REST API server for a simple note-sharing social network.

## Prerequisites

- [scribblez-database](https://github.com/thebinarypenguin/scribblez-database)

## Installation

1. Install dependencies

    ```
    npm install
    ```

2. Create configuration files from examples

    ```
    cp src/config/development.example.js src/config/development.js
    cp src/config/test.example.js src/config/test.js
    ```

3. Edit settings in configuration files

4. Start the server

    ```
    npm start
    ```
