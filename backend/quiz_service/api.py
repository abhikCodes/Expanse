import os, sys
from fastapi import APIRouter, HTTPException, Depends, Header
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from typing import Annotated
from sqlalchemy import select
from sqlalchemy.orm import Session
from quiz_service.database import SessionLocal
from quiz_service.schema import QuizCreateSchema, SubmissionSchema
from quiz_service.models import Quiz, QuizXrefUser
from quiz_service.grpc_client import CourseClient
from common.token_decoder import token_decoder
from common.response_format import success_response, error_response

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependency = Annotated[Session, Depends(get_db)]


# Checks enrollment of a student with a course
def check_enrollment(user_id: str, course_id: int):
    client = CourseClient(server_address="courses_topics:50051")
    is_enrolled = client.check_enrollment(user_id, course_id)
    return is_enrolled


# Checks if a course is present
def check_course_validity(course_id: int):
    client = CourseClient(server_address="courses_topics:50051")
    is_valid = client.check_validity(course_id)
    return is_valid

def get_course_name(course_id:int):
    client = CourseClient(server_address="courses_topics:50051")
    course_name = client.get_course_name(course_id)
    return course_name


# Endpoint for creating a new quiz
@router.post("/create-quiz")
def create_quiz(quiz: QuizCreateSchema, db: db_dependency, authorization: str = Header(...)):
    """
    Create a new quiz. Stores the JSON content (questions + options) in the quiz_details table.
    """
    try:
        # Authorization token checker and userid extraction 
        if not authorization.startswith("Bearer "):
            return JSONResponse(
                status_code=401,
                content=error_response(message="Invalid Authorization header format")
            )
        token = authorization.split(" ")[1]
        decoded_payload = token_decoder(token)[1]
        user_id = decoded_payload.get("sub")
        if not user_id:
            return JSONResponse(
                status_code=401,
                content=error_response(message="User ID not found in token")
            )
        
        quiz_data = jsonable_encoder(quiz)

        # Check if course is valid or not
        if not check_course_validity(course_id=quiz_data['course_id']):
            return JSONResponse(
                status_code = 404,
                content = error_response(
                    message = "Course Not Found"
                )
            )
        
        # Create and save the Quiz object
        new_quiz = Quiz(
            quiz_description=quiz_data['quiz_description'],
            quiz_content=quiz_data['quiz_content'],
            max_score=quiz_data['max_score'],
            course_id=quiz_data['course_id'],
            quiz_created_by=user_id
        )
        try:
            db.add(new_quiz)
            db.commit()
            db.refresh(new_quiz)
        except Exception as e:
            db.rollback()
            detail_dict = {
                "exception": e
            }
            return JSONResponse(
                status_code=500,
                content=error_response(message="Error creating quiz", details=str(e))
            )
        
        
        return JSONResponse(
            status_code=200,
            content=success_response(
                data={"quiz_id": new_quiz.quiz_id}, 
                message="Quiz created successfully"
            )
        )
    except Exception as e:
        exc_type, exc_obj, exc_tb = sys.exc_info()
        fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
        detail_dict = {
            "exception": e,
            "exception_type": exc_type,
            "file_name": fname,
            "line_number": exc_tb.tb_lineno
        }
        return JSONResponse(
            status_code=500, 
            content=error_response(message=f"Error creating quiz", details=detail_dict)
        )


# Endpoint to get quiz by ID
@router.get("/get-quiz/{quiz_id}")
def get_quiz(quiz_id: int, db: db_dependency):
    """
    Get the quiz details including questions and options stored in JSON.
    """
    try:
        quiz = db.query(Quiz).filter(Quiz.quiz_id == quiz_id).first()
        if not quiz:
            return JSONResponse(
                status_code=404,
                content=error_response(message="Quiz Not Found")
            )
        
        content = quiz.quiz_content
        quiz_content = []
        for obj in content:
            obj.pop('answer', None)
            quiz_content.append(obj)
        
        response = {
            "quiz_id": quiz.quiz_id,
            "description": quiz.quiz_description,
            "content": quiz_content,  
            "max_score": quiz.max_score,
            "course_id": quiz.course_id
        }
        return JSONResponse(
            status_code=200,
            content=success_response(
                data=response, 
                message="Quiz retrieved successfully"
            )
        )
        
    except Exception as e:
        exc_type, exc_obj, exc_tb = sys.exc_info()
        fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
        detail_dict = {
            "exception": e,
            "exception_type": exc_type,
            "file_name": fname,
            "line_number": exc_tb.tb_lineno
        }
        return JSONResponse(
            status_code=500, 
            content=error_response(message=f"Error in getting quiz", details=detail_dict)
        )


# Endpoint to get all quizzes by course ID
@router.get("/get-quiz-course/{course_id}")
def get_quiz_by_course(course_id: int, db: db_dependency):
    """
        Get quiz details by course ID
    """
    try:
        # Check if course is valid or not
        if not check_course_validity(course_id=course_id):
            return JSONResponse(
                status_code = 404,
                content = error_response(
                    message = "Course Not Found"
                )
            )
        
        quiz_lst = db.query(Quiz).filter(Quiz.course_id == course_id).all()
        if not quiz_lst:
            return JSONResponse(
                status_code=404,
                content=error_response(
                    message="No quizzes found for this course"
                )
            )
        
        quiz_data = []
        for quiz in quiz_lst:
            content = quiz.quiz_content
            quiz_content = []
            for obj in content:
                obj.pop('answer', None)
                quiz_content.append(obj)

            quiz_data.append({
                "quiz_id": quiz.quiz_id,
                "quiz_description": quiz.quiz_description,
                "max_score": quiz.max_score,
                "course_id": quiz.course_id,
                "quiz_content": quiz_content 
            })

        return JSONResponse(
            status_code=200,
            content=success_response(
                data=quiz_data, 
                message="Course retrieved successfully"
            )
        )
        
    except Exception as e:
        exc_type, exc_obj, exc_tb = sys.exc_info()
        fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
        detail_dict = {
            "exception": e,
            "exception_type": exc_type,
            "file_name": fname,
            "line_number": exc_tb.tb_lineno
        }
        return JSONResponse(
            status_code=500, 
            content=error_response(message=f"Error in getting quiz", details=detail_dict)
        )


# Endpoint for recording user submission
@router.post("/submit-quiz")
def record_submission(submission: SubmissionSchema, db: db_dependency, authorization: str = Header(...)):
    """
        Record a user's submission, including the answers provided and the calculated score.
    """
    try:
        # Authorization token checker and userid extraction 
        if not authorization.startswith("Bearer "):
            return JSONResponse(
                status_code=401,
                content=error_response(message="Invalid Authorization header format")
            )
        token = authorization.split(" ")[1]
        decoded_payload = token_decoder(token)[1]
        user_id = decoded_payload.get("sub")
        if not user_id:
            return JSONResponse(
                status_code=401,
                content=error_response(message="User ID not found in token")
            )
        
        # payload processing
        submission_data = jsonable_encoder(submission)
        quiz_id = submission_data['quiz_id']
        quiz = db.query(Quiz).filter(Quiz.quiz_id == quiz_id).first()
        if not quiz:
            return JSONResponse(
                status_code=404,
                content=error_response(message="Quiz not found")
            )
        
        # gRPC Enrollment checker
        if not check_enrollment(user_id=user_id, course_id=quiz.course_id):
            return JSONResponse(
                status_code = 401,
                content = error_response(
                    message = "User not enrolled in course"
                )
            )
        
        # score calculation
        content_map = {c_obj['ques_no']: c_obj for c_obj in quiz.quiz_content}
        max_score = quiz.max_score
        ind_score = max_score / len(quiz.quiz_content)
        score = sum(ind_score for obj in submission_data['answers'] if content_map.get(obj['ques_no'], {}).get('answer') == obj['answer'])

        # db insert
        new_submission = QuizXrefUser(
            quiz_id=submission_data['quiz_id'],
            user_id=user_id,
            score=score,
        )
        try:
            db.add(new_submission)
            db.commit()
            db.refresh(new_submission)

        except Exception as e:
            db.rollback()
            detail_dict = {
                "exception": e
            }
            return JSONResponse(
                status_code=500,
                content=error_response(message="Error submitting quiz", details=str(e))
            )

        # response 
        response = {
            "quiz_id": submission_data['quiz_id'],
            "submission_id": new_submission.id,
            "content": quiz.quiz_content,
            "score": score
        }
        return JSONResponse(
            status_code=200,
            content=success_response(
                data=response, 
                message="Submission recorded successfully"
            )
        )
    except Exception as e:
        exc_type, exc_obj, exc_tb = sys.exc_info()
        fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
        detail_dict = {
            "exception": e,
            "exception_type": exc_type,
            "file_name": fname,
            "line_number": exc_tb.tb_lineno
        }
        return JSONResponse(
            status_code=500, 
            content=error_response(message=f"Error in submitting quiz", details=detail_dict)
        )


@router.get("/get-score")
def get_scores(db: db_dependency, authorization: str = Header(...)):
    """
        get scores and quiz attempt details of a user.
    """
    try:
        # Authorization token checker and userid extraction 
        if not authorization.startswith("Bearer "):
            return JSONResponse(
                status_code=401,
                content=error_response(message="Invalid Authorization header format")
            )
        token = authorization.split(" ")[1]
        decoded_payload = token_decoder(token)[1]
        user_id = decoded_payload.get("sub")
        if not user_id:
            return JSONResponse(
                status_code=401,
                content=error_response(message="User ID not found in token")
            )
        
        results = db.query(
            Quiz.course_id,
            QuizXrefUser.quiz_id,
            Quiz.quiz_description,
            Quiz.max_score,
            QuizXrefUser.score,
            QuizXrefUser.date_attempted
        ).join(Quiz, Quiz.quiz_id == QuizXrefUser.quiz_id).filter(QuizXrefUser.user_id==user_id).order_by(QuizXrefUser.date_attempted.desc()).all()

        course_map = {}
        for res in results:
            course_id = res.course_id
            if not check_course_validity(course_id=course_id):
                return JSONResponse(
                    status_code = 404,
                    content = error_response(
                        message = "Course Not Found"
                    )
                )
            course_name = get_course_name(course_id=course_id)
            if course_id not in course_map:
                course_map[course_id] = {
                    'course_id': course_id,
                    'course_name': course_name,
                    'quiz_details': []
                }
            course_map[course_id]['quiz_details'].append({
                'quiz_id': res.quiz_id,
                'quiz_description': res.quiz_description,
                'max_score': res.max_score,
                'score_obtained': res.score,
                'date_attempted': res.date_attempted.isoformat()
            })

        response = list(course_map.values())

        return JSONResponse(
            status_code=200,
            content=success_response(
                data=response, 
                message="Quiz retrieved successfully"
            )
        )

        
    except Exception as e:
        exc_type, exc_obj, exc_tb = sys.exc_info()
        fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
        detail_dict = {
            "exception": e,
            "exception_type": exc_type,
            "file_name": fname,
            "line_number": exc_tb.tb_lineno
        }
        return JSONResponse(
            status_code=500, 
            content=error_response(message=f"Error in submitting quiz", details=detail_dict)
        )