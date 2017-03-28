#!/bin/bash

npm install -g codecov

./node_modules/lab/bin/lab -m 10000 -r lcov -o lcov.info && codecov
