import mysql.connector
import os
# Get the database connection information from environment variables
db_host = os.environ.get('DB_HOST')
db_port = os.environ.get('DB_PORT')
db_user = os.environ.get('DB_USER')
db_password = os.environ.get('DB_PASSWORD')
db_database = os.environ.get('DB_DATABASE')

mydb = mysql.connector.connect(
  host=db_host,
  user=db_user,
  password=db_password,
  port=db_port,
  database=db_database
)

print(mydb)
