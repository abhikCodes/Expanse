from fastapi import FastAPI
import models
from database import engine
from posts import router as forum_router

app = FastAPI()

models.Base.metadata.create_all(bind=engine)

app.include_router(forum_router)
