from sqlalchemy import Column, Integer, String, ForeignKey, Float, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import JSON
from quiz_service.database import Base


# Quiz Table Model
class Quiz(Base):
    __tablename__ = 'quizzes'  # Fixed the table name to match the ForeignKey references

    quiz_id = Column(Integer, primary_key=True, autoincrement=True, unique=True)
    quiz_description = Column(String, nullable=True)
    quiz_content = Column(JSON, nullable=False)
    max_score = Column(Float, nullable=False)
    course_id = Column(Integer, nullable=False)
    quiz_created_by = Column(String, nullable=False, index=True)
    quiz_created_timestamp = Column(DateTime, default=func.now(), nullable=False, index=True)

    # Relationships (if needed)
    users = relationship('QuizXrefUser', back_populates='quiz')


# Cross Reference Table Between Quiz and User (Quiz_XREF_USER)
class QuizXrefUser(Base):
    __tablename__ = 'quiz_xref_user'

    id = Column(Integer, primary_key=True, autoincrement=True, unique=True)
    quiz_id = Column(Integer, ForeignKey('quizzes.quiz_id'), nullable=False)
    user_id = Column(String, nullable=False)
    score = Column(Float, nullable=False)
    date_attempted = Column(DateTime, default=func.now(), nullable=False, index=True)

    # Relationships (if needed)
    quiz = relationship('Quiz', back_populates='users')


