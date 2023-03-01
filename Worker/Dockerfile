FROM python:3.9-alpine

COPY worker.py 

COPY requirements.txt

RUN pip install --no-cache-dir -r requirements.txt

CMD ["python", "worker.py"]
