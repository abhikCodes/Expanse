from fastapi import FastAPI
from backend.quiz.api import quiz_bp

app = FastAPI()

# Register the quiz router
app.include_router(quiz_bp, prefix="/quiz", tags=["quiz"])

# You can add more routers for other parts of your application as needed
