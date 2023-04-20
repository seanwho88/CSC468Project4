
//gets hash parameters from URL and returns as obj w key pairs
function getHashParams() {
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
  getUserSpotInfo(accessToken);
} else {
  console.log('No access token found in URL');
}


async function getCurrentLocation(userSpotifyID) {
  if ('geolocation' in navigator) {
    const successCallback = async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const user = userSpotifyID;
      document.getElementById('location').innerHTML = `Current Location: Latitude ${lat}, Longitude ${lon} for user ${user}`;

      const callback = async () => {
        const users = await fetchUsers();
        const currentUser = users.find(user => user.SpotifyID === userSpotifyID);
        if (currentUser) {
          await checkUserProximity(lat, lon, userSpotifyID, currentUser.CurrentSong, currentUser.CurrentArtist);
        }
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
      timeout: 10000
    };


    // Call successCallback every 30 seconds instead of using watchPosition
    setInterval(() => {
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options);
    }, 5000);
  }

}



document.addEventListener('DOMContentLoaded', () => {
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
      console.log(result.message)
    })
    .catch((error) => {
      console.error('Error saving currently playing data to database:', error);
    });
}


async function getUserSpotInfo(accessToken) {
  try {
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();

    updateUserInfo(data);

    const userSpotifyID = data.id;

    const currentlyPlayingData = await getCurrentlyPlaying(accessToken);
    if (currentlyPlayingData) {
      saveCurrentlyPlayingToDatabase(currentlyPlayingData, userSpotifyID);
      saveUserDataToDatabase(
        data,
        currentlyPlayingData.item.name,
        currentlyPlayingData.item.artists[0].name,
        userSpotifyID
      ).then(() => {
        getCurrentLocation(userSpotifyID);
      });
    } else {
      saveUserDataToDatabase(data, null, null, userSpotifyID).then(() => {
        getCurrentLocation(userSpotifyID);
      });
    }

    setInterval(() => updateSong(userSpotifyID, accessToken), 5000);
    return userSpotifyID;
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
}



async function getCurrentlyPlaying(accessToken, userSpotifyID) {
  try {
    const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 204 || !response.ok) {
      console.log('No song currently playing or an error occurred.');
      return null;
    }

    const text = await response.text();
    if (!text) {
      console.log('Empty response.');
      return null;
    }

    const data = JSON.parse(text);
    updateCurrentlyPlaying(data);
    saveCurrentlyPlayingToDatabase(data, userSpotifyID);
    return data;
  } catch (error) {
    console.error('Error fetching currently playing data:', error);
  }
}



async function saveUserDataToDatabase(userData, currentSong, currentArtist, userSpotifyID) {
  try {
    const response = await fetch('/api/saveUserData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...userData, currentSong, currentArtist, id: userSpotifyID }),
    });
    const result_1 = await response.json();
    console.log(result_1.message);
  } catch (error) {
    console.error('Error saving user data to database:', error);
  }
}


async function fetchUsers() {
  try {
    const response = await fetch('http://localhost:3001/api/users');
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
  try {
    const response = await fetch('/api/checkUserProximity', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ Latitude, Longitude, SpotifyID }),
    });

    if (response.status === 200) {
      const data = await response.json();
      const proximityUsersDiv = document.getElementById('proximity-users');
      const userDiv = document.createElement('div');
      userDiv.id = `user-${SpotifyID}`;
      const existingUserDiv = document.getElementById(`user-${SpotifyID}`);
      const currentlyPlayingText = CurrentSong && CurrentArtist ? `${CurrentSong} by ${CurrentArtist}` : 'No track is currently playing';

      if (data.isWithinProximity) {
        if (!existingUserDiv) {
          userDiv.innerHTML = `
            <h3>User: ${SpotifyID}</h3>
            <p>Currently playing: ${currentlyPlayingText}</p>
          `;
          proximityUsersDiv.appendChild(userDiv);
        } else {
          existingUserDiv.innerHTML = `
            <h3>User: ${SpotifyID}</h3>
            <p>Currently playing: ${currentlyPlayingText}</p>
          `;
        }
      } else {
        if (existingUserDiv) {
          proximityUsersDiv.removeChild(existingUserDiv);
        }
      }
      return data;
    } else {
    }
  } catch (error) {
    console.error('Error checking user proximity:', error);
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

    populateUserList(users);
  } catch (error) {
    console.error('Error while checking proximity for all users:', error);
  }
} 
function updateSong(userSpotifyID, accessToken) {
  getCurrentlyPlaying(accessToken, userSpotifyID);
}


checkProximityForAllUsers();
setInterval(checkProximityForAllUsers, 5000);
