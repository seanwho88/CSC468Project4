#!/bin/bash

set -x

name=$(hostname -f)

sed -i "/^ *host: *'mysql'/ s/'mysql'/'${name}'/" ./webapp/app.js
sed -i "/^ *host *= *\"mysql\"/ s/\"mysql\"/\"${name}\"/" ./worker/worker.py
sed -i "/^ *host: *'hostname'/ s/'hostname'/'${name}'/" ./webapp/server.js
