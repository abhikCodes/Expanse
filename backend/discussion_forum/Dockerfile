FROM python:3.11

WORKDIR /app

COPY discussion_forum/requirements.txt .
RUN pip install -r requirements.txt

COPY common/ /app/common
COPY protos/ /app/protos
COPY discussion_forum/ /app/discussion_forum

CMD uvicorn discussion_forum.main:app --host 0.0.0.0 --port 8081 --reload