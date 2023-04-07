from geopy.distance import distance
import mysql.connector
import time

connected = False
while not connected:
    try:
        mydb = mysql.connector.connect(
            host="c220g2-030832vm-1.wisc.cloudlab.us", #localhost
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

# Create a cursor object
c = mydb.cursor()

# Get all users from the users table
c.execute("SELECT * FROM users")
users = c.fetchall()

c.execute("SELECT * FROM location")
locations = c.fetchall()


for user in users:

    userid = user[1]

    for location in locations:

        loc = location[0]

        # Get user latitude
        c.execute("SELECT Latitude FROM users WHERE Username = %s", (userid,))
        result = c.fetchone()
        lat = result[0]

        # Get user longitude
        c.execute("SELECT Longitude FROM users WHERE Username = %s", (userid,))
        result = c.fetchone()
        long = result[0]

        # Get location i's latitude
        c.execute("SELECT latitude FROM location WHERE locationID = %s", (loc,))
        result = c.fetchone()
        loclat = result[0]

        # Get location i's longitude
        c.execute("SELECT longitude FROM location WHERE locationID = %s", (loc,))
        result = c.fetchone()
        loclong = result[0]

        usepoint = (lat, long)  # (latitude, longitude)
        locpoint = (loclat, loclong)

        # Calculate the distance in meters
        dist = distance(usepoint, locpoint).m

        if dist <= 500:
            print("MOVED")

            c.execute("UPDATE users SET locationNew = %s WHERE Username = %s",(loc, userid))
            mydb.commit()
            break
