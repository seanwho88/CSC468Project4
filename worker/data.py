import mysql.connector
import random
import string
import time

# Define a function to generate random strings of 4 letters
def generate_spotify_id():
    return ''.join(random.choices(string.ascii_lowercase, k=4))

connected = False
while not connected:
    try:
        mydb = mysql.connector.connect(
            host="pcvm701-1.emulab.net",
            user="user",
            password="123",
            port="3306",
            database="database"
        )
        connected = True
    except mysql.connector.Error as err:
        print("Failed to connect to database:", err)
        time.sleep(5)

print("Connected to database:", mydb)

# Define a cursor object to execute SQL queries
mycursor = mydb.cursor()

# Generate 10 random locations and insert them into the location table
locations = []
for i in range(10):
    longitude = round(random.uniform(-180, 180), 6)
    latitude = round(random.uniform(-90, 90), 6)
    locations.append((longitude, latitude))

sql = "INSERT INTO location (longitude, latitude) VALUES (%s, %s)"
mycursor.executemany(sql, locations)
mydb.commit()
print(f"{mycursor.rowcount} locations inserted.")

# Generate 15 random users and insert them into the users table
users = []
for i in range(15):
    username = f"user_{i}"
    spotify_id = generate_spotify_id()
    latitude = round(random.uniform(-90, 90), 6)
    longitude = round(random.uniform(-180, 180), 6)
    current_song = f"song_{i}"
    current_artist = f"artist_{i}"
    location_old = random.randint(1, 10)
    location_new = random.randint(1, 10)
    users.append((username, spotify_id, latitude, longitude, current_song, current_artist, location_old, location_new))

sql = "INSERT INTO users (Username, SpotifyID, Latitude, Longitude, CurrentSong, CurrentArtist, locationOld, locationNew) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
mycursor.executemany(sql, users)
mydb.commit()
print(f"{mycursor.rowcount} users inserted.")
