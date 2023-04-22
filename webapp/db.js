var mysql = require('mysql2');

var pool = mysql.createPool({
    host: 'pcvm701-1.emulab.net',
    user: 'user',
    password: '123',
    database: 'database'
});
module.exports = pool;
