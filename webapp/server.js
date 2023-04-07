const express = require('express');
const fs = require('fs');
const pool = require('./db');
const apiRouter = require('./public/api');
const expressStatic = require('express-static');
const qs = require('querystring');
require('dotenv').config();
const request = require ('request');
const axios = require ('axios');


const hn = "hostname"
const app = express();
const port = 3000;
const SPOTIFY_CLIENT_ID = '35a5e3f642214b238a5015aa91e9d9f8'
const SPOTIFY_CLIENT_SECRET = '185026c7c8b646a382279a4ceae0bd38';
const SPOTIFY_REDIRECT_URI = 'http://hostname:3000/callback';

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api', apiRouter); // use the api router for paths starting with /api

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

//app.get('/auth/spotify', (req, res) => {
  app.get('/login', function(req, res) {
  const scopes = 'user-read-private user-read-email';
  const queryParams = qs.stringify({
    client_id: SPOTIFY_CLIENT_ID,
    response_type: 'code',
    redirect_uri: SPOTIFY_REDIRECT_URI,
  });

  res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
});

/* app.get('/auth/spotify/callback', (req, res) => {
  const code = req.query.code || null;
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: SPOTIFY_REDIRECT_URI,
      grant_type: 'authorization_code',
    },
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64')),
    },
    json: true,
  };

  request.post(authOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const access_token = body.access_token;
      const refresh_token = body.refresh_token;

      // Get user profile data here and save it to the database
      

      res.redirect('/'); // Redirect back to the main page
    } else {
      res.redirect('/#' +
        qs.stringify({
          error: 'invalid_token',
        }));
    }
  });
});
*/

app.get('/callback', (req, res) => {
  const code = req.query.code || null;

  axios({
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    data: qs.stringify({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: SPOTIFY_REDIRECT_URI
    }),
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${new Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
    },
  })
  .then(response => {
    if (response.status === 200) {

      const { access_token, token_type } = response.data;

      axios.get('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `${token_type} ${access_token}`
        }
      })
        .then(response => {
          res.send(`<pre>${JSON.stringify(response.data, null, 2)}</pre>`);
        })
        .catch(error => {
          res.send(error);
        });

    } else {
      res.send(response);
    }
  })
  .catch(error => {
    res.send(error);
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
