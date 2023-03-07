CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT,
  Username VARCHAR(255) NOT NULL,
  SpotifyID VARCHAR(255) NOT NULL,
  Latitude FLOAT(10,6) NOT NULL,
  Longitude FLOAT(10,6) NOT NULL,
  CurrentSong VARCHAR(255),
  CurrentArtist VARCHAR(255),
  locationID INT NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO users (Username, SpotifyID, Latitude, Longitude, CurrentSong, CurrentArtist, locationID)
VALUES ('user1', 'spotifyid1', 40.7128, -74.0060, 'song1', 'artist1', 1),
       ('user2', 'spotifyid2', 34.0522, -118.2437, 'song2', 'artist2', 2),
       ('user3', 'spotifyid3', 51.5074, -0.1278, 'song3', 'artist3', 3);
