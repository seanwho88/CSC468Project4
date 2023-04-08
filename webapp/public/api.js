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

function saveCurrentlyPlaying(spotifyID, song, artist, callback) {
    pool.getConnection((error, connection) => {
      if (error) throw error;
  
      connection.query(
        'UPDATE users SET currentSong = ?, currentArtist = ? WHERE SpotifyID = ?',
        [song, artist, spotifyID],
        (error, results, fields) => {
          if (error) throw error;
  
          connection.release();
          console.log(`Updated currently playing song and artist for user ${spotifyID}`);
          callback();
        }
      );
    });
  }
  

/* function updateUserLocation(latitude, longitude, callback) {
    pool.getConnection((error, connection) => {
      if (error) throw error;
      connection.query(`UPDATE users SET Latitude = ${latitude}, Longitude = ${longitude}`, (error, results, fields) => {
        if (error) throw error;
  
        connection.release();
        console.log(`Updated user location to (${latitude}, ${longitude})`);

        setTimeout(() => {
            updateUserLocation(latitude,longitude, callback);
        }, 10000);
      });
    });
  } */

  function updateUserLocation(latitude, longitude, spotifyID, callback) {
    pool.getConnection((error, connection) => {
      if (error) throw error;
  
      connection.query(
        'UPDATE users SET Latitude = ?, Longitude = ? WHERE SpotifyID = ?',
        [latitude, longitude, spotifyID],
        (error, results, fields) => {
          if (error) throw error;
  
          connection.release();
          console.log(`Updated user location to (${latitude}, ${longitude}) for user ${spotifyID}`);
          callback();
        }
      );
    });
  }
  

router.get('/users', (req, res) => {
  getUsers((results) => {
    res.json(results);
  });
});

router.post('/updateUserLocation', (req, res) => {
    const { latitude, longitude, spotifyID } = req.body;
    updateUserLocation(latitude, longitude, spotifyID, () => {
      res.sendStatus(201);
    });
  });

  router.post('/saveCurrentlyPlaying', (req, res) => {
    const { spotifyID, song, artist } = req.body;
    saveCurrentlyPlaying(spotifyID, song, artist, () => {
      res.sendStatus(201);
    });
  });
  
module.exports = router;
