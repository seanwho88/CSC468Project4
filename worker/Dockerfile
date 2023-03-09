FROM python:3.9

WORKDIR /worker

COPY requirements.txt . 

RUN pip install --no-cache-dir -r requirements.txt

COPY worker.py .

# Set environment variables
# this will be unique everytime!! we need a way for this to be updated each experiment.
#ENV DB_HOST=docker.mikec123-149382.cloud-edu.emulab.net
#ENV DB_PORT=3306
#ENV DB_USER=user
#ENV DB_PASSWORD=123
#ENV DB_DATABASE=database

# Expose the port the app will run on
EXPOSE 5000

CMD ["python", "worker.py"]
