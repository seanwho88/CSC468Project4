import mysql.connector
import time

connected = False
while not connected:
    try:
        mydb = mysql.connector.connect(
            host="hostname",
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
