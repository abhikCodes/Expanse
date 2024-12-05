from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from .database import SessionLocal
from .quiz import create_quiz, get_quiz_by_id, record_user_submission, get_user_results

quiz_bp = APIRouter()

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic request models for validation
class OptionSchema(BaseModel):
    option_id: int
    option_text: str
    is_correct: bool

class QuestionSchema(BaseModel):
    question_id: int
    question_text: str
    question_type: str
    options: List[OptionSchema]

class QuizCreateSchema(BaseModel):
    description: str
    content: str
    max_score: float
    course_id: int
    questions: List[QuestionSchema]

class SubmissionSchema(BaseModel):
    quiz_id: int
    user_id: int
    answers: List[dict]

# Endpoint for creating a new quiz
@quiz_bp.post("/create-quiz")
def create_quiz_endpoint(quiz: QuizCreateSchema, db: Session = Depends(get_db)):
    try:
        new_quiz = create_quiz(quiz.dict())
        return {"message": "Quiz created successfully", "quiz_id": new_quiz.quiz_id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Endpoint to get quiz by ID
@quiz_bp.get("/quiz/{quiz_id}")
def get_quiz_endpoint(quiz_id: int, db: Session = Depends(get_db)):
    try:
        quiz = get_quiz_by_id(quiz_id)
        if quiz:
            return quiz
        else:
            raise HTTPException(status_code=404, detail="Quiz not found")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Endpoint for recording user submission
@quiz_bp.post("/submit-quiz")
def record_submission(submission: SubmissionSchema, db: Session = Depends(get_db)):
    try:
        recorded_submission = record_user_submission(submission.dict())
        return {"message": "Submission recorded successfully", "submission_id": recorded_submission.id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
