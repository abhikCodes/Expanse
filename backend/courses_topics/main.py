from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from courses_topics import models
from courses_topics.database import engine
from courses_topics.course import router as course_router
from courses_topics.topics import router as topic_router

app = FastAPI()

origins = [
    "http://localhost:3000",
]

# Add the CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

models.Base.metadata.create_all(bind=engine)

app.include_router(course_router)
app.include_router(topic_router)
