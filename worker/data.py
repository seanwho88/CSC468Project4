import mysql.connector
import random

# connect to the database
mydb = mysql.connector.connect(
  host="hostname",
  user="user",
  password="123",
  port="3306",
  database="yourdatabase"
)

# create a cursor object
mycursor = mydb.cursor()

# create a table (if it doesn't exist)
#mycursor.execute("CREATE TABLE IF NOT EXISTS employees (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), age INT)")

# insert 25 new data sets into the table
for i in range(25):
    #generate random string
    N = 10
    rstr = ''.join(random.choices(string.ascii_uppercase + string.digits, K=N))
  
    # generate a random name and age
    uid = i
    uname = "user " +str(i+1)
    spotid = "user " +str(i+1)
    lat = random.uniform(0, 100)
    longi = random.uniform(0, 100)
    currart = rstr
    locid = random.randint(0,10)
    
    # insert the data into the table
    sql = "INSERT INTO users (uid, Username, spotifyid, latitude, longitude, CurrentArtist, loccationid) VALUES (%s, %s, %s, %s, %s, %s)"
    val = (uid, uname, spotid, lat, longi, currart, locid)
    mycursor.execute(sql, val)

# commit the changes to the database
mydb.commit()

# print the number of rows affected
print(mycursor.rowcount, "records inserted.")
