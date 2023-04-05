#!/bin/bash

set -x

name=$(hostname -f)

sed -i "s/mysql/${name}/g" ./worker/worker.py
sed -i "s/hostname/${name}/g" ./webapp/server.js
sed -i "s/mysql/${name}/g" ./webapp/app.js
