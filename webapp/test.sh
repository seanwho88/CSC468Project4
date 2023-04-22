#!/bin/bash

set -x

name=$(hostname -f)

#sed -i "s/test/${name}/g" ./webapp/server.js
#sed -i "s/test/${name}/g" ./webapp/public/app.js
sed -i "s/test/${name}/g" server.js
sed -i "s/test/${name}/g" public/app.js
