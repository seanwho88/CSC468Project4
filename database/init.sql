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
  FOREIGN KEY (locationNew) REFERENCES location(locationID), 
  PRIMARY KEY (id)
);

