FROM python:3.9

WORKDIR /worker

COPY requirements.txt . 

RUN pip install --no-cache-dir -r requirements.txt

COPY worker.py .
COPY data.py .

# Expose the port the app will run on
EXPOSE 5000

CMD ["sh", "-c", "python data.py && python worker.py"]
