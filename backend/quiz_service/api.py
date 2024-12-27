from fastapi import APIRouter, HTTPException, Depends, Header
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from pydantic import BaseModel
from quiz_service.database import SessionLocal
from quiz_service.quiz import create_quiz, get_quiz_by_id, record_user_submission, get_user_results

quiz_bp = APIRouter()

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic request models for validation
class QuizCreateSchema(BaseModel):
    description: str
    content: Dict[str, Any]  # JSON field for questions and options
    max_score: float
    course_id: int

class SubmissionSchema(BaseModel):
    quiz_id: int
    user_id: int
    answers: List[Dict[str, Any]]  # Answer content should align with the new JSON structure

# Endpoint for creating a new quiz
@quiz_bp.post("/create-quiz")
def create_quiz_endpoint(quiz: QuizCreateSchema, db: Session = Depends(get_db)):
    """
    Create a new quiz. Stores the JSON content (questions + options) in the quiz_details table.
    """
    try:
        new_quiz = create_quiz(quiz.dict(), db)
        return {"message": "Quiz created successfully", "quiz_id": new_quiz.quiz_id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Endpoint to get quiz by ID
@quiz_bp.get("/quiz/{quiz_id}")
def get_quiz_endpoint(quiz_id: int, db: Session = Depends(get_db)):
    """
    Get the quiz details including questions and options stored in JSON.
    """
    try:
        quiz = get_quiz_by_id(quiz_id, db)
        if quiz:
            return quiz
        else:
            raise HTTPException(status_code=404, detail="Quiz not found")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Endpoint for recording user submission
@quiz_bp.post("/submit-quiz")
def record_submission(submission: SubmissionSchema, db: Session = Depends(get_db)):
    """
    Record a user's submission, including the answers provided and the calculated score.
    """
    try:
        recorded_submission = record_user_submission(submission.dict(), db)
        return {
            "message": "Submission recorded successfully",
            "submission_id": recorded_submission.id,
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
