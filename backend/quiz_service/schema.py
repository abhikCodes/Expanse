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

class Answers(BaseModel):
    ques_no: Optional[int] = None
    answer: Optional[str] = None

class SubmissionSchema(BaseModel):
    quiz_id: Optional[int] = None
    answers: List[Answers]
