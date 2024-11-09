from fastapi import FastAPI
import models
from database import engine
from course import router as course_router

app = FastAPI()

models.Base.metadata.create_all(bind=engine)

app.include_router(course_router)
