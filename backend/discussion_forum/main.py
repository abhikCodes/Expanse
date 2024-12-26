from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from discussion_forum import models
from discussion_forum.database import engine
from discussion_forum.forum import router as forum_router
from discussion_forum.comments import router as comment_router

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

app.include_router(forum_router)
app.include_router(comment_router)
