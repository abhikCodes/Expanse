from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime
from sqlalchemy.sql import func
from courses_topics.database import Base


class Courses(Base):
    __tablename__ = "courses"

    course_id = Column(Integer, primary_key=True, index=True)
    course_code = Column(String, nullable=False, unique=True)
    course_name = Column(String, nullable=False, index=True)
    course_description = Column(String, nullable=False, index=True)
    course_created_by = Column(String, nullable=False, index=True)
    course_created_timestamp = Column(DateTime, default=func.now(), nullable=False, index=True)
    course_updated_by = Column(String, nullable=False, index=True)
    course_updated_timestamp = Column(DateTime, default=func.now(), nullable=False, index=True)


class Topics(Base):
    __tablename__ = "topics"

    topic_id = Column(Integer, primary_key=True, index=True)
    topic_name = Column(String, nullable=False, index=True)
    topic_description = Column(String, nullable=False, index=True)
    course_id = Column(Integer, ForeignKey("courses.course_id"))
    topic_is_released = Column(Boolean, default=False, nullable=False, index=True)
    topic_created_by = Column(String, nullable=False, index=True)
    topic_created_timestamp = Column(DateTime, default=func.now(), nullable=False, index=True)
    topic_updated_by = Column(String, nullable=False, index=True)
    topic_updated_timestamp = Column(DateTime, default=func.now(), nullable=False, index=True)


class Contents(Base):
    __tablename__ = "topics_xref_contents"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.course_id"))
    topic_id = Column(Integer, ForeignKey("topics.topic_id"))
    content_id = Column(String, default=False, nullable=False, index=True)
    content_created_by = Column(String, nullable=False, index=True)
    content_created_timestamp = Column(DateTime, default=func.now(), nullable=False, index=True)
    content_updated_by = Column(String, nullable=False, index=True)
    content_updated_timestamp = Column(DateTime, default=func.now(), nullable=False, index=True)


class UserXrefCourse(Base):
    __tablename__ = "user_xref_course"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, nullable=False, index=True)
    course_id = Column(Integer, ForeignKey("courses.course_id"))
    enrollment_date = Column(DateTime, default=func.now(), nullable=False, index=True)




