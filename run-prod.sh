#!/bin/sh

./build-prod.sh && cd server/dist && node index.js
