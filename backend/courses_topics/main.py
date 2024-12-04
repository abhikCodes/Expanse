from fastapi import FastAPI
import models
from database import engine
from course import router as course_router
from topics import router as topic_router
from content import router as content_router
from fastapi.middleware.cors import CORSMiddleware

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
app.include_router(content_router)
