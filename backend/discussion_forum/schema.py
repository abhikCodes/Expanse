from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class PostBase(BaseModel):
    post_id: Optional[int] = None
    post_title: Optional[str] = None
    post_content: Optional[str] = None
    # course_id: Optional[int] = None
    # vote_count: Optional[int] = None
    # upvotes_by: Optional[str] = None
    # downvotes_by: Optional[str] = None

    class Config:
        from_attributes=True

class PostCreate(PostBase):
    pass

class PostResponse(PostBase):
    post_created_by: Optional[int] = None
    post_created_timestamp: Optional[datetime] = None
    post_updated_timestamp: Optional[datetime] = None
    class Config:
        from_attributes=True


class CommentBase(BaseModel):
    comment_id: Optional[int] = None
    reply_to: Optional[str] = None
    comment_content: Optional[str] = None
    # vote_count: Optional[int] = None
    # upvotes_by: Optional[str] = None
    # downvotes_by: Optional[str] = None

class CommentCreate(CommentBase):
    pass

class CommentResponse(CommentBase):
    comment_created_by: Optional[int] = None
    comment_created_timestamp: Optional[datetime] = None
    comment_updated_timestamp: Optional[datetime] = None
    class Config:
        from_attributes=True
