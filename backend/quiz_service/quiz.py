from starlette.responses import Content
import datetime
from quiz_service.database import SessionLocal
from quiz_service.models import Quiz, QuizDetail, QuizXrefUser
from sqlalchemy.orm import joinedload
from sqlalchemy.exc import SQLAlchemyError

# Create a new quiz
def create_quiz(quiz_data, db_session):
    session = db_session or SessionLocal()
    try:
        # Create and save the Quiz object
        new_quiz = Quiz(
            quiz_description=quiz_data['description'],
            quiz_content=quiz_data['content'],
            max_score=quiz_data['max_score'],
            course_id=quiz_data['course_id']
        )
        session.add(new_quiz)
        session.commit()
        session.refresh(new_quiz)

        new_quiz_details = QuizDetail(
            quiz_id = new_quiz.quiz_id,
            content = quiz_data['content']
        )
        session.add(new_quiz_details)
        session.commit()
        session.refresh(new_quiz_details)

        return new_quiz

    except SQLAlchemyError as e:
        session.rollback()
        print(f"Error occurred: {e}")
        raise e
    finally:
        session.close()

# Get a quiz by ID
def get_quiz_by_id(quiz_id, db_session=None):
    session = db_session or SessionLocal()
    try:
        quiz = (
                session.query(Quiz)
                .filter(Quiz.quiz_id == quiz_id)
                .first()
                )
        quiz_details = (
                session.query(QuizDetails)
                .filter(QuizDetails.quiz_id == quiz_id)
                .first()
                )

        if quiz and quiz_details:
                return {
                    "quiz_id": quiz.quiz_id,
                    "description": quiz.quiz_description,
                    "content": quiz_details.content,  # Return JSON details
                    "max_score": quiz.max_score,
                    "course_id": quiz.course_id
                    }
        return None
    except SQLAlchemyError as e:
        print(f"Error occurred: {e}")
        raise e
    finally:
        session.close()

# Record user's quiz submission
def record_user_submission(submission_data, db_session=None):
    session = db_session or SessionLocal()
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
def auto_grade_submission(submission_data, db_session=None):
    session = SessionLocal()
    try:
        quiz_details = session.query(QuizDetail).filter(QuizDetails.quiz_id == submission_data['quiz_id']).first()
        if not quiz_details:
                raise ValueError("Quiz not found")

        total_score = 0
        for answer in submission_data['answers']:
            question = next((q for q in quiz_details.content["questions"] if q["question_id"] == answer["question_id"]), None)
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
