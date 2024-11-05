from pydantic import BaseModel
from typing import Optional


class CourseBase(BaseModel):
    course_name: Optional[str] = None
    course_description: Optional[str] = None

class CourseCreate(CourseBase):
    course_created_by: Optional[int] = None
    course_updated_by: Optional[int] = None

class TopicBase(BaseModel):
    topic_name: Optional[str] = None
    topic_description: Optional[str] = None
    topic_is_released: Optional[bool] = False
    




