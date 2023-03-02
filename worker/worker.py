import mysql.connector

mydb = mysql.connector.connect(
  host="hostname",
  user="user",
  password="123",
  port="3306",
  database="database"
)

print(mydb)
