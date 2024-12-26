from sqlalchemy import Column, Integer, String, ForeignKey, Float
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import JSON
from quiz_service.database import Base

# Quiz Table Model
class Quiz(Base):
    __tablename__ = 'quizzes'  # Fixed the table name to match the ForeignKey references

    quiz_id = Column(Integer, primary_key=True, autoincrement=True, unique=True)
    quiz_description = Column(String, nullable=True)
    quiz_content = Column(String, nullable=False)  # Link to MongoDB JSON or a URL
    max_score = Column(Float, nullable=False)
    course_id = Column(Integer, nullable=False)

    # Relationships (if needed)
    users = relationship('QuizXrefUser', back_populates='quiz')

# Cross Reference Table Between Quiz and User (Quiz_XREF_USER)
class QuizXrefUser(Base):
    __tablename__ = 'quiz_xref_user'

    id = Column(Integer, primary_key=True, autoincrement=True, unique=True)
    quiz_id = Column(Integer, ForeignKey('quizzes.quiz_id'), nullable=False)
    user_id = Column(Integer, ForeignKey('users.user_id'), nullable=False)
    score = Column(Float, nullable=True)

    # Relationships (if needed)
    quiz = relationship('Quiz', back_populates='users')

# Question Model
class Question(Base):
    __tablename__ = 'questions'

    question_id = Column(Integer, primary_key=True, autoincrement=True, unique=True)
    quiz_id = Column(Integer, ForeignKey('quizzes.quiz_id'), nullable=False)
    question_text = Column(String, nullable=False)
    question_type = Column(String, nullable=False)  # E.g., 'multiple_choice'

    # Relationships (if needed)
    quiz = relationship('Quiz', back_populates='questions')
    options = relationship('Option', back_populates='question')

# Option Model
class Option(Base):
    __tablename__ = 'options'

    option_id = Column(Integer, primary_key=True, autoincrement=True, unique=True)
    question_id = Column(Integer, ForeignKey('questions.question_id'), nullable=False)
    option_text = Column(String, nullable=False)
    is_correct = Column(Integer, nullable=False)  # Use Boolean if possible

    # Relationships (if needed)
    question = relationship('Question', back_populates='options')
