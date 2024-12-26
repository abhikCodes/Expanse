from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from quiz_service.api import quiz_bp

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

# Register the quiz router
app.include_router(quiz_bp, prefix="/quiz", tags=["quiz"])

# You can add more routers for other parts of your application as needed
