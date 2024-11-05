from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime
from sqlalchemy.sql import func
from database import Base


class Courses(Base):
    __tablename__ = "courses"

    course_id = Column(Integer, primary_key=True, index=True)
    course_name = Column(String, nullable=False, index=True)
    course_description = Column(String, nullable=False, index=True)
    course_created_by = Column(Integer, nullable=False, index=True)
    course_created_timestamp = Column(DateTime, default=func.now(), nullable=False, index=True)
    course_updated_by = Column(Integer, nullable=False, index=True)
    course_updated_timestamp = Column(DateTime, default=func.now(), nullable=False, index=True)


class Topics(Base):
    __tablename__ = "topics"

    topic_id = Column(Integer, primary_key=True, index=True)
    topic_name = Column(String, nullable=False, index=True)
    topic_description = Column(String, nullable=False, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"))
    topic_is_released = Column(Boolean, default=False, nullable=False, index=True)
    topic_content = Column(String, default=False, nullable=False, index=True)
    topic_created_by = Column(Integer, nullable=False, index=True)
    topic_created_timestamp = Column(DateTime, default=func.now(), nullable=False, index=True)
    topic_updated_by = Column(Integer, nullable=False, index=True)
    topic_updated_timestamp = Column(DateTime, default=func.now(), nullable=False, index=True)

