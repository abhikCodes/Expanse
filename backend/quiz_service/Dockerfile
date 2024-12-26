FROM python:3.11

WORKDIR /app

COPY quiz_service/requirements.txt .
RUN pip install -r requirements.txt

COPY common/ /app/common
COPY protos/ /app/protos
COPY quiz_service/ /app/quiz_service

CMD uvicorn quiz_service.main:app --host 0.0.0.0 --port 8082 --reload