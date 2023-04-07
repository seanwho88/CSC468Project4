const express = require('express');
const pool = require('../db');

const router = express.Router();

function getUsers(callback) {
  pool.getConnection((error, connection) => {
    if (error) throw error;

    connection.query('SELECT * FROM users', (error, results, fields) => {
      if (error) throw error;

      connection.release();
      callback(results);
    });
  });
}

function updateUserLocation(latitude, longitude, callback) {
    pool.getConnection((error, connection) => {
      if (error) throw error;
  
     /*  const query = 'INSERT INTO location (latitude, longitude) VALUES (?, ?)';
      connection.query(query, [latitude, longitude], (error, results, fields) => {
        if (error) throw error;
  
        connection.release();
        callback();
      }); */
      connection.query(`UPDATE users SET Latitude = ${latitude}, Longitude = ${longitude}`, (error, results, fields) => {
        if (error) throw error;
  
        connection.release();
        console.log(`Updated user location to (${latitude}, ${longitude})`);

        setTimeout(() => {
            updateUserLocation(latitude,longitude, callback);
        }, 10000);
      });
    });
  }

router.get('/users', (req, res) => {
  getUsers((results) => {
    res.json(results);
  });
});

router.post('/updateUserLocation', (req, res) => {
    const { latitude, longitude } = req.body;
    updateUserLocation(latitude, longitude, () => {
      res.sendStatus(201);
    });
  });
  
module.exports = router;
