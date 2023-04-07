const express = require('express');
const fs = require('fs');
const pool = require('./db');
const apiRouter = require('./public/api');
const expressStatic = require('express-static');

const hn = "hostname"
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api', apiRouter); // use the api router for paths starting with /api
app.use(expressStatic('public'));

app.get('/', (req, res) => {
  getUsers((results) => {
    fs.readFile(__dirname + '/index.html', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error reading index.html');
      } else {
        res.send(data);
      }
    });
  });
});

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
