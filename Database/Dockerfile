FROM mysql:latest
#probably want to set this to a specific version so we dont run into errors.

# Set the root password for MySQL
ENV MYSQL_ROOT_PASSWORD=test

# Create a database and user
ENV MYSQL_DATABASE=database
ENV MYSQL_USER=user
ENV MYSQL_PASSWORD=123

# Copy the custom SQL script into the container
COPY ./init.sql /docker-entrypoint-initdb.d/
