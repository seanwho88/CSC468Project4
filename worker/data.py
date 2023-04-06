import mysql.connector
import random
import string

# connect to the database
mydb = mysql.connector.connect(
    host="hostname",
    user="user",
    password="123",
    port="3306",
    database="database"
)

# create a cursor object
mycursor = mydb.cursor()

# create a table (if it doesn't exist)
# mycursor.execute("CREATE TABLE IF NOT EXISTS employees (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), age INT)")

for i in range(11):
    locid  = (i + 4) #for the 3 hard coded locations
    loclat = random.uniform(0, 100)
    loclong = random.uniform(0, 100)

    qry = "INSERT INTO location (locationID, longitude, latitude) VALUES (%s, %s, %s)"
    val = (locid, loclat, loclong)
    mycursor.execute(qry, val)


mydb.commit()


# insert 25 new data sets into the table

for i in range(25):
    # generate random string
    N = 10
    rstr = ''.join(random.choices(string.ascii_uppercase + string.digits, k=N))

    # generate a random name and age
    uid = (i +4)
    uname = "user " + str(i + 1)
    spotid = "user " + str(i + 1)
    lat = random.uniform(1, 100)
    longi = random.uniform(1, 100)
    currsong = rstr
    currart = rstr
    locNew = random.randint(1, 14)
    locOld = random.randint(1, 14)

    # insert the data into the table
    sql = "INSERT INTO users (id, Username, SpotifyID, Latitude, Longitude, CurrentSong, CurrentArtist, locationOld, locationNew) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"
    val = (uid, uname, spotid, lat, longi, currart,currsong, locOld, locNew)
    mycursor.execute(sql, val)

# commit the changes to the database
mydb.commit()

# print the number of rows affected
print(mycursor.rowcount, "records inserted.")
