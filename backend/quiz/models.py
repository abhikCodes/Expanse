from sqlalchemy import Column, Integer, String, ForeignKey, Float
from sqlalchemy.orm import relationship
from courses_topics.database import Base
from sqlalchemy.dialects.postgresql import JSON

# Quiz Table Model
class Quiz(Base):
    __tablename__ = 'quizes'

    quiz_id = Column(Integer, primary_key=True, autoincrement=True, unique=True)
    quiz_description = Column(String, nullable=True)
    quiz_content = Column(String, nullable=False)  # Link to MongoDB JSON or a URL
    max_score = Column(Float, nullable=False)
    course_id = Column(Integer, ForeignKey('courses.course_id'), nullable=False)

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
