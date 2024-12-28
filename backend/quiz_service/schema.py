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

# class QuizCreateSchema(BaseModel):
#     description: str
#     content: Dict[str, Any]  # JSON field for questions and options
#     max_score: float
#     course_id: int

# class SubmissionSchema(BaseModel):
#     quiz_id: int
#     user_id: int
#     answers: List[Dict[str, Any]]  # Answer content should align with the new JSON structure