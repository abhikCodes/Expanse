from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CourseBase(BaseModel):
    course_code: Optional[str] = None
    course_name: Optional[str] = None
    course_description: Optional[str] = None
    course_created_by: Optional[int] = None
    course_updated_by: Optional[int] = None
    class Config:
        from_attributes=True


class CourseCreate(CourseBase):
    pass


class CourseResponse(CourseBase):
    course_id: Optional[int] = None
    course_created_timestamp: Optional[datetime] = None
    course_updated_timestamp: Optional[datetime] = None
    class Config:
        from_attributes=True


class TopicBase(BaseModel):
    course_id: Optional[int] = None
    topic_name: Optional[str] = None
    topic_description: Optional[str] = None
    topic_is_released: Optional[bool] = False
    topic_created_by: Optional[int] = None
    topic_updated_by: Optional[int] = None
    class Config:
        from_attributes=True

class TopicCreate(TopicBase):
    pass

class TopicResponse(TopicBase):
    topic_id: Optional[int] = None
    topic_created_timestamp: Optional[datetime] = None
    topic_updated_timestamp: Optional[datetime] = None
    class Config:
        from_attributes=True


class ContentBase(BaseModel):
    course_id: Optional[int] = None
    topic_id: Optional[int] = None
    content_id: Optional[str] = None
    content_created_by: Optional[int] = None
    content_updated_by: Optional[int] = None
    content_created_timestamp: Optional[datetime] = None
    content_updated_timestamp: Optional[datetime] = None
    class Config:
        from_attributes=True


    




