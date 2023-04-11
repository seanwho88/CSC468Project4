const express = require('express');
const fs = require('fs');
const pool = require('./db');
const apiRouter = require('./public/api');
const expressStatic = require('express-static');
const qs = require('querystring');
require('dotenv').config();
const request = require('request');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const hn = "hostname";
const app = express();
const port = 3000;
const SPOTIFY_CLIENT_ID = '455f4bbcf534453e92b92e6842f1b66d';
const SPOTIFY_CLIENT_SECRET = '333e4d017b3645688aab9aca08c3de57';
const SPOTIFY_REDIRECT_URI = 'http://hostname:3000/callback';

const stateKey = 'spotify_auth_state';

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api', apiRouter);
app.use(cookieParser());
app.use(cors());

app.get('/', (req, res) => {
  fs.readFile(__dirname + '/public/index.html', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading index.html');
    } else {
      res.send(data);
    }
  });
});

function generateRandomString(length) {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let text = '';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

app.get('/login', (req, res) => {
  const state = generateRandomString(16);
  res.cookie(stateKey, state);

  const queryParams = qs.stringify({
    client_id: SPOTIFY_CLIENT_ID,
    response_type: 'code',
    redirect_uri: SPOTIFY_REDIRECT_URI,
    state: state,
    scope: 'user-read-private user-read-email user-read-currently-playing user-read-playback-state',
  });

  res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
});

app.get('/callback', (req, res) => {
  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' + qs.stringify({ error: 'state_mismatch' }));
  } else {
    res.clearCookie(stateKey);

    axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      data: qs.stringify({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: SPOTIFY_REDIRECT_URI,
      }),
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${new Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
      },
    })
      .then(response => {
        if (response.status === 200) {
          const { access_token, refresh_token, token_type } = response.data;

          axios
            .get('https://api.spotify.com/v1/me', {
              headers: {
                Authorization: `${token_type} ${access_token}`,
              },
            })
            .then(response => {
              res.redirect(
                '/#' +
                qs.stringify({
                  access_token: access_token,
                  refresh_token: refresh_token
                }));
            })
        }
      })
      .catch(error => {
        console.error(error);
        res.status(500).send('Error requesting access token');
      });
  }
});

app.post('/api/saveUserData', (req, res) => {
  const { display_name, id, currentSong, currentArtist } = req.body;

  if (!display_name || !id || !currentSong || !currentArtist) {
    console.error('Some required data is missing:', req.body);
    res.status(400).send({ message: 'Some required data is missing' });
    return;
  }

  console.log('Data to be saved:', { display_name, id, currentSong, currentArtist });

  pool.query('SELECT * FROM users WHERE SpotifyID = ?', [id], (error, userExists) => {
    if (error) {
      console.error('Error fetching user data from database:', error);
      res.status(500).send({ message: 'Error fetching user data from database' });
      return;
    }

    if (userExists.length > 0) {
      pool.query(
        'UPDATE users SET CurrentSong = ?, CurrentArtist = ? WHERE SpotifyID = ?',
        [currentSong, currentArtist, id],
        (error) => {
          if (error) {
            console.error('Error updating user data in database:', error);
            res.status(500).send({ message: 'Error updating user data in database' });
            return;
          }
          res.status(200).send({ message: 'User data updated in database' });
        }
      );
    } else {
      pool.execute(
        'INSERT INTO users (Username, SpotifyID, Latitude, Longitude, CurrentSong, CurrentArtist, locationOld, locationNew) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [display_name, id, 0, 0, currentSong, currentArtist, 1, 11],
        (error, results) => {
          if (error) {
            console.error('Error saving user data to database:', error);
            res.status(500).send({ message: 'Error saving user data to database' });
            return;
          }
          res.status(200).send({ message: 'User data saved to database', insertId: results.insertId });
        }
      );
    }
  });
});



app.use(expressStatic('public'));

function connectToDatabase() {
  pool.getConnection((error, connection) => {
    if (error) {
      console.error('Error connecting to database:', error);
      setTimeout(connectToDatabase, 5000); // retry after 5 seconds
    } else {
      console.log('Connected to database');
      connection.release();
      app.listen(port, () => {
        console.log(`Server running at http://${hn}:${port}/`);
      });
    }
  });
}
connectToDatabase();

