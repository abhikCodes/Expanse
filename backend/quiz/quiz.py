from .database import SessionLocal
from .models import Quiz, Question, Option, QuizXrefUser
from sqlalchemy.orm import joinedload
from sqlalchemy.exc import SQLAlchemyError
import datetime

# Create a new quiz
def create_quiz(quiz_data):
    session = SessionLocal()
    try:
        # Create and save the Quiz object
        new_quiz = Quiz(
            quiz_description=quiz_data['description'],
            quiz_content=quiz_data['content'],  # Typically a JSON link or content reference
            max_score=quiz_data['max_score'],
            course_id=quiz_data['course_id']
        )
        session.add(new_quiz)
        session.commit()
        session.refresh(new_quiz)

        # Create and save the Question objects
        for question_data in quiz_data['questions']:
            question = Question(
                quiz_id=new_quiz.quiz_id,
                question_text=question_data['question_text'],
                question_type=question_data['question_type']
            )
            session.add(question)
            session.commit()
            session.refresh(question)

            # Create and save the Option objects for each question
            for option_data in question_data['options']:
                option = Option(
                    question_id=question.question_id,
                    option_text=option_data['option_text'],
                    is_correct=option_data['is_correct']
                )
                session.add(option)

        session.commit()
        return new_quiz
    except SQLAlchemyError as e:
        session.rollback()
        print(f"Error occurred: {e}")
        raise e
    finally:
        session.close()

# Get a quiz by ID
def get_quiz_by_id(quiz_id):
    session = SessionLocal()
    try:
        quiz = session.query(Quiz).options(joinedload(Quiz.questions).joinedload(Question.options)).filter(Quiz.quiz_id == quiz_id).first()
        return quiz
    except SQLAlchemyError as e:
        print(f"Error occurred: {e}")
        raise e
    finally:
        session.close()

# Record user's quiz submission
def record_user_submission(submission_data):
    session = SessionLocal()
    try:
        # Create and save the QuizXrefUser object
        new_submission = QuizXrefUser(
            quiz_id=submission_data['quiz_id'],
            user_id=submission_data['user_id'],
            score=submission_data.get('score', 0),
        )
        session.add(new_submission)
        session.commit()
        session.refresh(new_submission)
        return new_submission
    except SQLAlchemyError as e:
        session.rollback()
        print(f"Error occurred: {e}")
        raise e
    finally:
        session.close()

# Auto-grade a quiz submission
def auto_grade_submission(submission_data):
    session = SessionLocal()
    try:
        quiz = session.query(Quiz).options(joinedload(Quiz.questions).joinedload(Question.options)).filter(Quiz.quiz_id == submission_data['quiz_id']).first()
        if not quiz:
            raise ValueError("Quiz not found")

        total_score = 0
        for answer in submission_data['answers']:
            question = next((q for q in quiz.questions if q.question_id == answer['question_id']), None)
            if not question:
                continue

            if question.question_type == 'multiple_choice':
                correct_option = next((opt for opt in question.options if opt.is_correct), None)
                if correct_option and correct_option.option_id == answer['selected_option_id']:
                    total_score += 1  # Increment score for correct answer

        # Record the user's submission with the calculated score
        new_submission = QuizXrefUser(
            quiz_id=submission_data['quiz_id'],
            user_id=submission_data['user_id'],
            score=total_score
        )
        session.add(new_submission)
        session.commit()
        session.refresh(new_submission)
        return new_submission
    except SQLAlchemyError as e:
        session.rollback()
        print(f"Error occurred: {e}")
        raise e
    finally:
        session.close()

# Fetch results for a user
def get_user_results(user_id, quiz_id):
    session = SessionLocal()
    try:
        result = session.query(QuizXrefUser).filter(QuizXrefUser.user_id == user_id, QuizXrefUser.quiz_id == quiz_id).first()
        return result
    except SQLAlchemyError as e:
        print(f"Error occurred: {e}")
        raise e
    finally:
        session.close()

# Fetch all quizzes for a course
def get_quizzes_for_course(course_id):
    session = SessionLocal()
    try:
        quizzes = session.query(Quiz).filter(Quiz.course_id == course_id).all()
        return quizzes
    except SQLAlchemyError as e:
        print(f"Error occurred: {e}")
        raise e
    finally:
        session.close()
