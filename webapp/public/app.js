
//gets hash parameters from URL and returns as obj w key pairs
function getHashParams() {
  console.log("Get Hash");
  const hashParams = {};
  const r = /([^&;=]+)=?([^&;]*)/g;
  const q = window.location.hash.substring(1);
  let e;

  while ((e = r.exec(q))) {
    hashParams[e[1]] = decodeURIComponent(e[2]);
  }

  return hashParams;
}

const params = getHashParams();
const accessToken = params.access_token;

if (accessToken) {
  console.log('Access token found, calling getUserSpotInfo');
  getUserSpotInfo(accessToken);
} else {
  console.log('No access token found in URL');
}



function getCurrentLocation(userSpotifyID) {
  if ('geolocation' in navigator) {
    console.log("getCurrentLocation being called");

    const successCallback = (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const user = userSpotifyID;
      document.getElementById('location').innerHTML = `Current Location: Latitude ${lat}, Longitude ${lon} for user ${user}`;

      console.log('User ID:', user);
      const callback = () => {
        console.log("Calling checkUserProximity");
        checkUserProximity(lat, lon, userSpotifyID)
          .then((data) => {
            const proximityUsersDiv = document.getElementById('proximity-users');
            const existingUserDiv = document.getElementById(`user-${userSpotifyID}`);
            if (!data.isWithinProximity && existingUserDiv) {
              proximityUsersDiv.removeChild(existingUserDiv);
            }
          });
      };

      if (!user) {
        console.error('Error: User not defined');
        return;
      }

      fetch('/api/updateUserLocation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ latitude: lat, longitude: lon, spotifyID: user }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.text();
        })
        .then((data) => {
          console.log('Update user location result:', data.message);
          callback();
        })
        .catch((error) => {
          console.error('Error updating user location:', error);
        });
    };

    const errorCallback = (error) => {
      console.error('Error getting current position:', error);
      document.getElementById('location').innerHTML = 'Error getting current position.';
    };

    const options = {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 5000
    };

    navigator.geolocation.watchPosition(successCallback, errorCallback, options);
  } else {
    document.getElementById('location').innerHTML = 'Geolocation is not supported by your browser.';
  }
}



document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded event fired');

  fetch('/api/users')
    .then(response => response.json())
    .then(users => {
      populateUserList(users);
    });
});


function populateUserList(users) {
  const tbody = document.querySelector('tbody');
  tbody.innerHTML = ''; // Clear the existing table body

  users.forEach(user => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${user.id}</td><td>${user.Username}</td><td>${user.SpotifyID}</td><td>${user.Latitude}</td><td>${user.Longitude}</td><td>${user.CurrentSong}</td><td>${user.CurrentArtist}</td><td>${user.locationOld}</td><td>${user.locationNew}</td>`;
    tbody.appendChild(tr);
  });
}




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

function saveCurrentlyPlayingToDatabase(data, userSpotifyID) {
  fetch('/api/saveCurrentlyPlaying', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      spotifyID: userSpotifyID,
      song: data.item.name,
      artist: data.item.artists[0].name,
    }),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result.message);
    })
    .catch((error) => {
      console.error('Error saving currently playing data to database:', error);
    });
}

async function getUserSpotInfo(accessToken) {
  console.log('getUserSpotInfo called with access token:', accessToken);
  try {
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();

    console.log('User data:', data);

    updateUserInfo(data);

    const userSpotifyID = data.id;

    const currentlyPlayingData = await getCurrentlyPlaying(accessToken);
    saveCurrentlyPlayingToDatabase(currentlyPlayingData, userSpotifyID);
    saveUserDataToDatabase(data, currentlyPlayingData.item.name, currentlyPlayingData.item.artists[0].name, userSpotifyID)
      .then(() => {
        console.log("calling getCurrentLocation");
        getCurrentLocation(userSpotifyID);
      });

    return userSpotifyID;
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
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
      return data;
    })
    .catch((error) => {
      console.error('Error fetching currently playing data:', error);
    });
}


function saveUserDataToDatabase(userData, currentSong, currentArtist, userSpotifyID) {
  console.log("This is userSpotifyID: " + userSpotifyID);
  return fetch('/api/saveUserData', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...userData, currentSong, currentArtist, id: userSpotifyID }),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result.message);
    })
    .catch((error) => {
      console.error('Error saving user data to database:', error);
    });
}


async function fetchUsers() {
  try {
    const response = await fetch('http://hostname:3000/api/users');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error while fetching users:', error);
  }
}

async function checkUserProximity(Latitude, Longitude, SpotifyID, CurrentSong, CurrentArtist) {
  console.log('Checking user proximity...');
  console.log('Latitude:', Latitude);
  console.log('Longitude:', Longitude);
  console.log('Spotify ID:', SpotifyID);

  try {
    console.log('Sending data to checkUserProximity:', { Latitude, Longitude, SpotifyID });
    const response = await fetch('/api/checkUserProximity', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ Latitude, Longitude, SpotifyID }),
    });

    if (response.status === 200) {
      const data = await response.json();
      console.log(`Fetched proximity data for ${SpotifyID}: ${CurrentSong} by ${CurrentArtist}`);
      //console.log('Proximity data:', data);
      const proximityUsersDiv = document.getElementById('proximity-users');
      const userDiv = document.createElement('div');
      userDiv.id = `user-${SpotifyID}`;
      const existingUserDiv = document.getElementById(`user-${SpotifyID}`);
      if (data.isWithinProximity) {
        if (!existingUserDiv) {
          userDiv.innerHTML = `
            <h3>User: ${SpotifyID}</h3>
            <p>Currently playing: ${CurrentSong} by ${CurrentArtist}</p>
          `;
          proximityUsersDiv.appendChild(userDiv);
        } else {
          existingUserDiv.innerHTML = `
            <h3>User: ${SpotifyID}</h3>
            <p>Currently playing: ${CurrentSong} by ${CurrentArtist}</p>
          `;
        }
      } else {
        if (existingUserDiv) {
          proximityUsersDiv.removeChild(existingUserDiv);
        }
      }
      updateUserLocation(SpotifyID, Latitude, Longitude);
      return data;
    } else {
      console.error('Error checking user proximity');
    }
  } catch (error) {
    console.error('Error checking user proximity:', error);
  }
}

async function updateUserLocation(userSpotifyID, lat, lon) {
  try {
    const response = await fetch('/api/updateUserLocation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ spotifyID: userSpotifyID, latitude: lat, longitude: lon }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log('Update user location result:', data.message);
  } catch (error) {
    console.error('Error updating user location:', error);
  }
}


async function checkProximityForAllUsers() {
  try {
    const users = await fetchUsers();
    if (!users) {
      console.error('No users found');
      return;
    }

    const usersWithinProximity = [];

    // Wait for all proximity checks to complete
    await Promise.all(users.map(async (user) => {
      const { Latitude, Longitude, SpotifyID, CurrentSong, CurrentArtist } = user;
      const proximityData = await checkUserProximity(Latitude, Longitude, SpotifyID, CurrentSong, CurrentArtist);
      if (!proximityData) {
        console.error(`Unable to retrieve proximity data for user ${SpotifyID}`);
        return;
      }

      if (proximityData.isWithinProximity) {
        console.log(`User ${SpotifyID} is within proximity. Song: ${CurrentSong} by ${CurrentArtist}`);
        usersWithinProximity.push(user);
      } else {
        console.log(`User ${SpotifyID} is not within proximity.`);
      }
    }));

    populateUserList(usersWithinProximity); // Update the user list on the web page
  } catch (error) {
    console.error('Error while checking proximity for all users:', error);
  }
}


checkProximityForAllUsers();
setInterval(checkProximityForAllUsers, 5000);
