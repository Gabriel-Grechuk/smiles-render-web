FROM python:3.12.7-alpine

WORKDIR /app
COPY . .

RUN pip install -r requirements.txt

CMD [ "python3", "src/main.py" ]
