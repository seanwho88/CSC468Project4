var mysql = require('mysql2');

var pool = mysql.createPool({
    host: 'hostname',
    user: 'user',
    password: '123',
    database: 'database'
});

module.exports = pool;

