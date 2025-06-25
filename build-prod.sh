#!/bin/sh

echo 'Installing dependencies'
/bin/bash setup.sh

echo 'Building the UI'
cd ui && npm run build && cd -

echo 'Building the Server'
cd server && npm run build && cd -
