#!/bin/bash

#
# Use a custom test command so we can send coverage info to codecov.io
#

npm install -g codecov

./node_modules/lab/bin/lab -cv -I __core-js_shared__ -m 10000 -r console -o stdout -r lcov -o lcov.info

codecov
