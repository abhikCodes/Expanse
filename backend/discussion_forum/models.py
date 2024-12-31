from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from discussion_forum.database import Base


class Posts(Base):
    __tablename__ = "posts"

    post_id = Column(Integer, primary_key=True, index=True)
    post_title = Column(String, nullable=False, index=True)
    post_content = Column(String, nullable=False, index=True)
    post_created_by = Column(String, nullable=False, index=True)
    post_created_timestamp = Column(DateTime, default=func.now(), nullable=False, index=True)
    # post_updated_by = Column(String, index=True)
    post_updated_timestamp = Column(DateTime, default=func.now(), nullable=False, index=True)
    vote_count = Column(Integer, index=True)
    upvotes_by = Column(String, index=True)
    downvotes_by = Column(String, index=True)
    course_id = Column(Integer, nullable=False, index=True)

class Comments(Base):
    __tablename__ = "comments"

    comment_id = Column(Integer, primary_key=True, index=True)
    comment_content = Column(String, nullable=False, index=True)
    comment_created_by = Column(String, nullable=False, index=True)
    comment_created_timestamp = Column(DateTime, default=func.now(), nullable=False, index=True)
    # comment_updated_by = Column(Integer, index=True)
    comment_updated_timestamp = Column(DateTime, default=func.now(), index=True)
    vote_count = Column(Integer, index=True)
    upvotes_by = Column(String, index=True)
    downvotes_by = Column(String, index=True)
    comment_in_post = Column(Integer, nullable=False, index=True)
    reply_to = Column(String, nullable=False, index=True)
