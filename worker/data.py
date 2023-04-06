import mysql.connector
import random
import string
import socket
import time


connected = False
while not connected:
    try:
        mydb = mysql.connector.connect(
            host="mysql",
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

# create a cursor object
mycursor = mydb.cursor()


# Clear the users and location tables
mycursor.execute("DELETE FROM users")
mycursor.execute("DELETE FROM location")

# Reset the auto-increment value for primary keys
mycursor.execute("ALTER TABLE users AUTO_INCREMENT = 1")
mycursor.execute("ALTER TABLE location AUTO_INCREMENT = 1")


for i in range(1,12):
    locid  = i 
    loclat = random.uniform(0, 100)
    loclong = random.uniform(0, 100)

    qry = "INSERT INTO location (locationID, longitude, latitude) VALUES (%s, %s, %s)"
    val = (locid, loclat, loclong)
    mycursor.execute(qry, val)


mydb.commit()


# insert 25 new data sets into the table

for i in range(5):
    # generate random string
    N = 10
    rstr = ''.join(random.choices(string.ascii_uppercase + string.digits, k=N))

    # generate a random name and age
    uid = i 
    uname = "user " + str(i + 1)
    spotid = "user " + str(i + 1)
    lat = random.uniform(1, 100)
    longi = random.uniform(1, 100)
    currsong = rstr
    currart = rstr
    locNew = random.randint(1, 11)
    locOld = random.randint(1, 11)

    # insert the data into the table
    sql = "INSERT INTO users (id, Username, SpotifyID, Latitude, Longitude, CurrentSong, CurrentArtist, locationOld, locationNew) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"
    val = (uid, uname, spotid, lat, longi, currart,currsong, locOld, locNew)
    mycursor.execute(sql, val)

# commit the changes to the database
mydb.commit()

# print the number of rows affected
print(mycursor.rowcount, "records inserted.")
