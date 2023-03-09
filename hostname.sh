#!/bin/bash

set -x

name=$(hostname -f)

sed -i "s/hostname/${name}/g" ./worker/worker.py
sed -i "s/hostname/${name}/g" ./webapp/server.js
sed -i "s/hostname/${name}/g" ./webapp/app.js
