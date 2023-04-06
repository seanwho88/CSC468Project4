FROM python:3.9

WORKDIR /worker

COPY requirements.txt . 

RUN pip install --no-cache-dir -r requirements.txt

COPY worker.py .
COPY data.py .
COPY run.sh .

EXPOSE 5000

CMD ["bash", "run.sh"]
