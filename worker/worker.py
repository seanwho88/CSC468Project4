import mysql.connector

mydb = mysql.connector.connect(
  host="docker.mikec123-149438.cloud-edu.emulab.net",
  user="user",
  password="123",
  port="3306",
  database="database"
)

print(mydb)
