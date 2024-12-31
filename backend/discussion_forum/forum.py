import os, sys
from datetime import datetime
from typing import Annotated
from fastapi import APIRouter, Depends, Header
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from sqlalchemy import desc
from discussion_forum.database import SessionLocal
from discussion_forum.schema import PostBase, PostCreate
import discussion_forum.models as forum_models
from discussion_forum.grpc_client import CourseClient
from common.response_format import success_response, error_response
from common.token_decoder import token_decoder


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


"""GET API: to get all the posts in the course forum"""
@router.get("/courses/{course_id}/discussions")
async def get_posts(course_id: int, db: db_dependency, authorization: str = Header(...)):
    try:
        # gRPC validity checker
        if not check_course_validity(course_id=course_id):
            return JSONResponse(
                status_code = 404,
                content = error_response(
                    message = "Course Not Found"
                )
            )

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

        # gRPC Enrollment checker
        if not check_enrollment(user_id=user_id, course_id=course_id):
            return JSONResponse(
                status_code = 401,
                content = error_response(
                    message = "User not enrolled in course"
                )
            )

        db_forum = db.query(forum_models.Posts).filter(forum_models.Posts.course_id == course_id).order_by(forum_models.Posts.post_updated_timestamp).all()
        if not db_forum:
            return JSONResponse(
                status_code = 404,
                content = error_response(
                    message = "No Posts Found for the Course"
                )
            )

        return JSONResponse(
            status_code = 200,
            content = success_response(
                data = jsonable_encoder(db_forum),
                message = "All posts retrieved successfully"
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
            status_code = 500,
            content = error_response(
                details = detail_dict,
                message = "Error in retrieving posts"
            )
        )


"""POST API: to create a new post in a course forum"""
@router.post("/courses/{course_id}/discussions")
async def create_post(course_id: int, post: PostCreate, db: db_dependency, authorization: str = Header(...)):
    try:
        # Course Validity gRPC call
        if not check_course_validity(course_id=course_id):
            return JSONResponse(
                status_code = 404,
                content = error_response(
                    message = "Course Not Found"
                )
            )

        # Auth User ID
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
        
        # gRPC Enrollment checker
        if not check_enrollment(user_id=user_id, course_id=course_id):
            return JSONResponse(
                status_code = 401,
                content = error_response(
                    message = "User not enrolled in course"
                )
            )

        # API Logic
        db_forum = forum_models.Posts(
            post_title = post.post_title,
            post_content = post.post_content,
            post_created_by = user_id,
            course_id = course_id
        )
        try:
            db.add(db_forum)
            db.commit()
            db.refresh(db_forum)
        except Exception as e:
            db.rollback()
            detail_dict = {
                "exception": e
            }
            return JSONResponse(
                status_code = 500,
                content = error_response(
                    details = detail_dict,
                    message = "Error creating post"
                )
            )

        return JSONResponse(
            status_code = 201,
            content = success_response(
                data = PostBase.model_validate(db_forum).model_dump(),
                message = "Post created successfully"
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
            status_code = 500,
            content = error_response(
                details = detail_dict,
                message = "Error creating post"
            )
        )


"""PUT API: to update OR vote a post"""
@router.put("/courses/{course_id}/discussions")
async def update_post(course_id: int, post_id: int, post: PostBase, db: db_dependency, authorization: str = Header(...), mode: str = None, new_vote: int = None):
    try:
        # Course Validity gRPC call
        if not check_course_validity(course_id=course_id):
            return JSONResponse(
                status_code = 404,
                content = error_response(
                    message = "Course Not Found"
                )
            )

        # User ID Auth
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
        
        # API Logic
        db_forum = db.query(forum_models.Posts).filter(forum_models.Posts.course_id == course_id).filter(forum_models.Posts.post_id == post_id).first()
        if not db_forum:
            return JSONResponse(
                status_code = 404,
                content = error_response(
                    message = "Post Not Found"
                )
            )
        
        if db_forum.post_created_by != user_id:
            return JSONResponse(
                status_code = 404,
                content = error_response(
                    message = "You are not post creator. You cannot edit the post"
                )
            )

        update_data = post.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_forum, key, value)
        db_forum.post_updated_timestamp = datetime.now()

        try:
            db.commit()
            db.refresh(db_forum)
        except Exception as e:
            db.rollback()
            detail_dict = {
                "exception": e
            }
            return JSONResponse(
                status_code = 500,
                content = error_response(
                    details = detail_dict,
                    message = "Error updating post"
                )
            )

        return JSONResponse(
            status_code = 200,
            content = success_response(
                data = PostBase.model_validate(db_forum).model_dump(),
                message = "Post updated successfully"
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
            status_code = 500,
            content = error_response(
                details = detail_dict,
                message = "Error updating post"
            )
        )


"""DELETE API: to delete a post"""
@router.delete("/courses/{course_id}/discussions")
async def delete_post(course_id: int, post_id: int, db: db_dependency, authorization: str = Header(...)):
    try:
        if not check_course_validity(course_id=course_id):
            return JSONResponse(
                status_code = 404,
                content = error_response(
                    message = "Course Not Found"
                )
            )
        
        # User ID Auth
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

        db_forum = db.query(forum_models.Posts).filter(forum_models.Posts.course_id == course_id).filter(forum_models.Posts.post_id == post_id).first()
        if not db_forum:
            return JSONResponse(
                status_code = 404,
                content = error_response(
                    message = "Post Not Found"
                )
            )
        
        if db_forum.post_created_by != user_id:
            return JSONResponse(
                status_code = 404,
                content = error_response(
                    message = "You are not post creator. You cannot delete the post"
                )
            )

        try:
            db.delete(db_forum)
            db.commit()
        except Exception as e:
            db.rollback()
            detail_dict = {
                "exception": e
            }
            return JSONResponse(
                status_code = 500,
                content = error_response(
                    details = detail_dict,
                    message = "Error deleting post"
                )
            )

        return JSONResponse(
            status_code = 200,
            content = success_response(
                data = {},
                message = "Post deleted successfully"
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
            status_code = 500,
            content = error_response(
                details = detail_dict,
                message = "Error deleting post"
            )
        )
