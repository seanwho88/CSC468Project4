var mysql = require('mysql2');

var pool = mysql.createPool({
    host: 'hostname',
    user: 'user',
    password: '123',
    database: 'database'
});

// Use the pool to execute SQL queries
pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query('SELECT * FROM users', function (error, results, fields) {
        if (error) throw error;
        console.log(results);
        connection.release();
        pool.end();
    });
});
