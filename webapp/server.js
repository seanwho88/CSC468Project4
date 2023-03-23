const http = require('http');
const pool = require('./app');

const hn = 'hostname';
const port = 3000;

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

function startServer() {
  getUsers((results) => {
    console.log(results);

    const server = http.createServer((req, res) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Access-Control-Allow-Origin', '*');
      
      const data = JSON.stringify(results);

      const html = `
        <html>
          <head>
            <title>Users</title>
          </head>
          <body>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Spotify ID</th>
                  <th>Latitude</th>
                  <th>Longitude</th>
                  <th>Current Song</th>
                  <th>Current Artist</th>
                  <th>Location ID</th>
                </tr>
              </thead>
              <tbody>
              </tbody>
            </table>
            <script>
              const data = ${data};
              const tbody = document.querySelector('tbody');
              data.forEach(user => {
                const tr = document.createElement('tr');
                tr.innerHTML = \`<td>\${user.id}</td><td>\${user.Username}</td><td>\${user.SpotifyID}</td><td>\${user.Latitude}</td><td>\${user.Longitude}</td><td>\${user.CurrentSong}</td><td>\${user.CurrentArtist}</td><td>\${user.locationID}</td>\`;
                tbody.appendChild(tr);
              });
            </script>
          </body>
        </html>
      `;

      res.end(html);
    });

    server.listen(port, () => {
      console.log(`Server running at http://${hn}:${port}/`);
    });
  });
}

// Keep trying to connect to the database until successful
function connectToDatabase() {
  pool.getConnection((error, connection) => {
    if (error) {
      console.error('Error connecting to database:', error);
      setTimeout(connectToDatabase, 5000); // retry after 5 seconds
    } else {
      console.log('Connected to database');
      connection.release();
      startServer();
    }
  });
}

connectToDatabase();
