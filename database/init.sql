CREATE TABLE location (
  locationID INT PRIMARY KEY,
  longitude FLOAT(10,6) NOT NULL,
  latitude  FLOAT(10,6) NOT NULL
);

CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT,
  Username VARCHAR(255) NOT NULL,
  SpotifyID VARCHAR(255) NOT NULL,
  Latitude FLOAT(10,6) NOT NULL,
  Longitude FLOAT(10,6) NOT NULL,
  CurrentSong VARCHAR(255),
  CurrentArtist VARCHAR(255),
  locationOld INT NOT NULL,
  locationNew INT NOT NULL,
  FOREIGN KEY (locationOld) REFERENCES location(locationID),
  FOREIGN KEY (locationNew) REFERENCES location(locationID), 
  PRIMARY KEY (id)
);

INSERT INTO location (locationID, longitude, latitude) VALUES
(1, 34.0522, -118.2437),
(2, 40.7128, -74.0060),
(3, 51.5074, -0.1278);

INSERT INTO users (Username, SpotifyID, Latitude, Longitude, CurrentSong, CurrentArtist, locationOld, locationNew) VALUES
('john_doe', 'abc123', 34.0522, -118.2437, 'Bohemian Rhapsody', 'Queen', 1, 2),
('jane_smith', 'def456', 40.7128, -74.0060, 'Shape of You', 'Ed Sheeran', 2, 3),
('bob_johnson', 'ghi789', 51.5074, -0.1278, 'Stairway to Heaven', 'Led Zeppelin', 3, 1);
