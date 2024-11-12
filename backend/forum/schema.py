from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class PostBase(BaseModel):
    post_title: Optional[str] = None
    post_content: Optional[str] = None
    post_created_by: Optional[int] = None
    course_id: Optional[int] = None

    class Config:
        from_attributes=True

class PostCreate(PostBase):
    pass

class PostResponse(PostBase):
    post_created_timestamp: Optional[datetime] = None
    post_updated_timestamp: Optional[datetime] = None
    class Config:
        from_attributes=True


# class CommentBase(BaseModel):
#     comment_content: Optional[str] = None
#     comment_created_by: Optional[str] = None
