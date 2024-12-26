FROM python:3.11

WORKDIR /app

COPY courses_topics/requirements.txt .
RUN pip install -r requirements.txt

COPY common/ /app/common
COPY protos/ /app/protos
COPY courses_topics/ /app/courses_topics

CMD python3 /app/courses_topics/grpc_server.py & \
    uvicorn courses_topics.main:app --host 0.0.0.0 --port 8080 --reload