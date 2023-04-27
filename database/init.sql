CREATE TABLE location (
  locationID INT PRIMARY KEY AUTO_INCREMENT,
  latitude  FLOAT(10,6) NOT NULL,
  longitude FLOAT(10,6) NOT NULL
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

INSERT INTO location (latitude, longitude)
VALUES (39.9535359, -75.5997438);


