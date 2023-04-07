#!/bin/bash

set -x

name=$(hostname -f)

sed -i "/^ *host: *'mysql'/ s/'mysql'/'${name}'/" ./webapp/db.js
sed -i "/^ *host *= *\"mysql\"/ s/\"mysql\"/\"${name}\"/" ./worker/worker.py
sed -i "/^ *host *= *\"mysql\"/ s/\"mysql\"/\"${name}\"/" ./worker/data.py
sed -i "/^ *host *= *\"mysql\"/ s/\"mysql\"/\"${name}\"/" ./worker_spotify/worker.py
sed -i "/^ *host *= *\"mysql\"/ s/\"mysql\"/\"${name}\"/" ./worker_spotify/data.py
sed -i "/^ *host *= *\"mysql\"/ s/\"mysql\"/\"${name}\"/" ./worker/locup.py
sed -i "s/hostname/${name}/g" ./webapp/server.js
