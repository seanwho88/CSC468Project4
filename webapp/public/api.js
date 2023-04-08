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
        if (error) {
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
                    console.error('Error:', error);
                    if (typeof callback === 'function') {
                        callback(error);
                    }
                    return;
                }

                connection.release();
                console.log(`Updated currently playing song and artist for user ${spotifyID}`);
                if (typeof callback === 'function') {
                    callback(results);
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
                    console.error('Error:', error);
                    if (typeof callback === 'function') {
                        callback(results);
                    }
                    return;
                }

                connection.release();
                console.log(`Updated user location to (${latitude}, ${longitude}) for user ${spotifyID}`);
                if (typeof callback === 'function') {
                    callback(null);
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
            res.sendStatus(201);
        }
    });
});

router.post('/saveCurrentlyPlaying', (req, res) => {
    const { spotifyID, song, artist } = req.body;
    saveCurrentlyPlaying(spotifyID, song, artist, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error saving currently playing song');
        } else {
            res.sendStatus(201);
        }
    });
});


router.post('/saveCurrentlyPlaying', (req, res) => {
    const { spotifyID, song, artist } = req.body;
    saveCurrentlyPlaying(spotifyID, song, artist, () => {
        res.sendStatus(201);
    });
});

module.exports = router;
