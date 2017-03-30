#!/bin/bash

cp ./src/config/test.example.js ./src/config/test.js

npm install -g codecov

./node_modules/lab/bin/lab -cv -I __core-js_shared__ -m 10000 -r console -o stdout -r lcov -o lcov.info

codecov
