from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from quiz_service.api import router
from quiz_service.database import engine
from quiz_service.grpc_client import CourseClient
from quiz_service import models

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

app.include_router(router)



