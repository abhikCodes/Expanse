from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class QuizContent(BaseModel):
    ques_no: Optional[int] = None
    question: Optional[str] = None
    options: Dict[str, str]
    answer: str = Field(..., pattern="^[A-D]$", description="Answer must be one of 'A', 'B', 'C', 'D'.")

class QuizCreateSchema(BaseModel):
    quiz_description: Optional[str] = None
    quiz_content: List[QuizContent]
    max_score: Optional[float] = None
    course_id: Optional[int] = None

class QuizResponse(BaseModel):
    quiz_id: Optional[int] = None
    quiz_description: Optional[str] = None
    score: Optional[float] = None


class UserQuizReponse(BaseModel):
    course_id: Optional[int] = None
    course_name: Optional[str] = None
    quiz_details: List[QuizResponse]


class Answers(BaseModel):
    ques_no: Optional[int] = None
    answer: Optional[str] = None

class SubmissionSchema(BaseModel):
    quiz_id: Optional[int] = None
    answers: List[Answers]
