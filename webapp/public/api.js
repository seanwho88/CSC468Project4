const express = require('express');
const pool = require('../db');
const geolib = require('geolib');
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
    if (error) {
      console.error('Error getting connection:', error);
      if (typeof callback === 'function') {
        callback(error);
      }
      return;
    }

    connection.query(
      'UPDATE users SET currentSong = ?, currentArtist = ? WHERE SpotifyID = ?',
      [song, artist, spotifyID],
      (error, results, fields) => {
        if (error) {
          console.error('Error executing query:', error);
          if (typeof callback === 'function') {
            callback(error);
          }
          return;
        }

        connection.release();
        //console.log(`Updated currently playing song and artist for user ${spotifyID}`);
        if (typeof callback === 'function') {
          callback(null, results);
        }
      }
    );
  });
}

function updateUserLocation(latitude, longitude, spotifyID, callback) {
  pool.getConnection((error, connection) => {
    if (error) {
      if (typeof callback === 'function') {
        callback(error);
      }
      return;
    }

    connection.query(
      'UPDATE users SET Latitude = ?, Longitude = ? WHERE SpotifyID = ?',
      [latitude, longitude, spotifyID],
      (error, results, fields) => {
        if (error) {
          console.error('Error updating user location:', error);
          if (typeof callback === 'function') {
            callback(error);
          }
          return;
        }

        connection.release();
        //console.log(`Updated user location to (${latitude}, ${longitude}) for user ${spotifyID}`);
        if (typeof callback === 'function') {
          callback(null);
        }
      }
    );
  });
}


function getStaticLocation(locationID, callback) {
  pool.getConnection((error, connection) => {
    if (error) {
      if (typeof callback === 'function') {
        callback(error);
      }
      return;
    }

    connection.query(
      'SELECT Latitude, Longitude FROM location WHERE locationID = ?',
      [locationID],
      (error, results, fields) => {
        if (error) {
          console.error('Error:', error);
          if (typeof callback === 'function') {
            callback(error);
          }
          return;
        }

        connection.release();
        if (typeof callback === 'function') {
          callback(null, results[0]);
        }
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
  updateUserLocation(latitude, longitude, spotifyID, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error updating user location');
    } else {
      res.status(201).json({ message: 'Created' });
    }
  });
});

router.post('/saveCurrentlyPlaying', (req, res) => {
  const { spotifyID, song, artist } = req.body;
 /*  console.log(spotifyID);
  console.log(artist);
  console.log(song); */

  saveCurrentlyPlaying(spotifyID, song, artist, (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Error saving currently playing song' });
    } else {
      res.status(201).json({ message: 'Created' });
    }
  });
});

router.post('/checkUserProximity', async (req, res) => {
  const { Latitude, Longitude, SpotifyID } = req.body;
 /*  console.log('Received data in checkUserProximity:', req.body);
  console.log('latitude:', Latitude);
  console.log('longitude:', Longitude);
  console.log('spotifyID:', SpotifyID); */

  const proximity = 100;
  const targetLocationID = 1;

  try {
    const targetLocation = await new Promise((resolve, reject) => {
      getStaticLocation(targetLocationID, (error, location) => {
        if (error) {
          console.error('Error getting static location:', error);
          reject(error);
        } else {
          //console.log('Static location:', location);
          resolve(location);
        }
      });
    });

    //console.log('User location:', { Latitude, Longitude });

    const isWithinProximity = geolib.isPointWithinRadius(
      { latitude: Latitude, longitude: Longitude },
      { latitude: targetLocation.Latitude, longitude: targetLocation.Longitude },
      proximity * 1000
    );

    if (isWithinProximity) {
      res.json({ isWithinProximity: true });
    } else {
      res.json({ isWithinProximity: false });
    }
  } catch (error) {
    console.error('Error checking user proximity:', error);
    res.status(500).send(`Error checking user proximity: ${error.message}`);
  }
});



module.exports = router;
