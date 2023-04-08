function getCurrentLocation() {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      document.getElementById('location').innerHTML = `Current Location: Latitude ${lat}, Longitude ${lon}`;

      // Send the location to the server
      fetch('/api/updateUserLocation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ latitude: lat, longitude: lon, spotifyID: userSpotifyID }),
      });
    });
  } else {
    document.getElementById('location').innerHTML = 'Geolocation is not supported by your browser.';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/users')
    .then(response => response.json())
    .then(users => {
      const tbody = document.querySelector('tbody');
      users.forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${user.id}</td><td>${user.Username}</td><td>${user.SpotifyID}</td><td>${user.Latitude}</td><td>${user.Longitude}</td><td>${user.CurrentSong}</td><td>${user.CurrentArtist}</td><td>${user.locationOld}</td><td>${user.locationNew}</td>`;
        tbody.appendChild(tr);
      });
    });

  getCurrentLocation();
});

function updateUserInfo(data) {
  const userInfoDiv = document.getElementById('user-info');
  userInfoDiv.innerHTML = `
    <h2>User Information</h2>
    <p>ID: ${data.id}</p>
    <p>Display Name: ${data.display_name}</p>
    <p>Email: ${data.email}</p>
    <p>Country: ${data.country}</p>
  `;
}

function updateCurrentlyPlaying(data) {
  const currentlyPlayingDiv = document.getElementById('currently-playing');
  if (data.is_playing) {
    currentlyPlayingDiv.innerHTML = `
      <h2>Currently Playing</h2>
      <p>Track: ${data.item.name}</p>
      <p>Artist: ${data.item.artists[0].name}</p>
      <p>Album: ${data.item.album.name}</p>
    `;
  } else {
    currentlyPlayingDiv.innerHTML = `
      <h2>Currently Playing</h2>
      <p>No track is currently playing.</p>
    `;
  }
}

function saveCurrentlyPlayingToDatabase(data) {
  fetch('/api/saveCurrentlyPlaying', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      spotifyID: data.context.uri.split(':')[2],
      song: data.item.name,
      artist: data.item.artists[0].name,
    }),
  })
    .catch((error) => {
      console.error('Error saving currently playing data to database:', error);
    });
}

function getUserSpotInfo(accessToken) {
  fetch('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('User data:', data);
      updateUserInfo(data);
      getCurrentlyPlaying(accessToken).then((currentlyPlayingData) => {
        saveUserDataToDatabase(data, currentlyPlayingData.item.name, currentlyPlayingData.item.artists[0].name);
      });
    })
    .catch((error) => {
      console.error('Error fetching user data:', error);
    });
}


function getCurrentlyPlaying(accessToken) {
  return fetch('https://api.spotify.com/v1/me/player/currently-playing', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => {
      console.log('Currently playing response status:', response.status);
      return response.json();
    })
    .then((data) => {
      console.log('Currently playing data:', data);
      updateCurrentlyPlaying(data);
      saveCurrentlyPlayingToDatabase(data);
      return data;
    })
    .catch((error) => {
      console.error('Error fetching currently playing data:', error);
    });
}

function saveUserDataToDatabase(userData, currentSong, currentArtist) {
  fetch('/api/saveUserData', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...userData, currentSong, currentArtist }),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result.message);
    })
    .catch((error) => {
      console.error('Error saving user data to database:', error);
    });
}




function checkAccessToken() {
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);

  if (params.has('access_token')) {
    const accessToken = params.get('access_token');
    getUserSpotInfo(accessToken);
    getCurrentlyPlaying(accessToken).then((data) => {
      userSpotifyID = data.context.uri.split(':')[2];
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  checkAccessToken();
});
