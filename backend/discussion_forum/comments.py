import os, sys
from datetime import datetime
from typing import Annotated
from fastapi import APIRouter, Depends, Header
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from sqlalchemy import desc
from discussion_forum.database import SessionLocal
from discussion_forum.schema import PostBase, CommentBase, CommentCreate
import discussion_forum.models as forum_models
from discussion_forum.grpc_client import CourseClient
from common.response_format import success_response, error_response
from common.token_decoder import token_decoder
# import courses_topics.models as course_models


router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

GRPC_SERVER = os.getenv("GRPC_SERVER")
# Checks enrollment of a student with a course
def check_enrollment(user_id: str, course_id: int):
    client = CourseClient(server_address=GRPC_SERVER)
    is_enrolled = client.check_enrollment(user_id, course_id)
    return is_enrolled

# Checks if a course is present
def check_course_validity(course_id: int):
    client = CourseClient(server_address=GRPC_SERVER)
    is_valid = client.check_validity(course_id)
    return is_valid


"""GET API: to get all the comments for a specific post"""
@router.get("/courses/{course_id}/discussions/{post_id}")
async def get_comments(course_id: int, post_id: int, db: db_dependency, authorization: str = Header(...)):
    try:
        # gRPC validity checker
        if not check_course_validity(course_id=course_id):
            return JSONResponse(
                status_code = 404,
                content = error_response(
                    message = "Course Not Found"
                )
            )

        # user Id Auth
        if not authorization.startswith("Bearer "):
            return JSONResponse(
                status_code = 401,
                content = error_response(
                    message = "Invalid Authorization Header Format"
                )
            )
        token = authorization.split(" ")[1]
        decoded_payload = token_decoder(token)[1]
        user_id = decoded_payload.get("sub")
        if not user_id:
            return JSONResponse(
                status_code = 401,
                content = error_response(
                    message = "User ID not found in Token"
                )
            )

        # gRPC Enrollment checker
        if not check_enrollment(user_id=user_id, course_id=course_id):
            return JSONResponse(
                status_code = 401,
                content = error_response(
                    message = "User not enrolled in course"
                )
            )

        db_forum = db.query(forum_models.Posts).filter(forum_models.Posts.course_id == course_id).filter(forum_models.Posts.post_id == post_id).first()
        if not db_forum:
            return JSONResponse(
                status_code = 404,
                content = error_response(
                    message = "Post Not Found"
                )
            )

        result = db.query(forum_models.Comments).filter(forum_models.Comments.comment_in_post == post_id).order_by(forum_models.Comments.comment_updated_timestamp).all()

        return JSONResponse(
            status_code = 200,
            content = success_response(
                data = jsonable_encoder({
                    "PostData": [db_forum],
                    "CommentData": result
                }),
                message = "Comments retrieved successfully" if result else "No Comments Found for the Post"
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
                message = "Error in retrieving comments"
            )
        )


"""POST API: to create a new comment in a post"""
@router.post("/courses/{course_id}/discussions/{post_id}")
async def create_comment(course_id: int, post_id: int, comm: CommentCreate, db: db_dependency, authorization: str = Header(...)):
    try:
        # validity checker for course id gRPC
        if not check_course_validity(course_id=course_id):
            return JSONResponse(
                status_code = 404,
                content = error_response(
                    message = "Course Not Found"
                )
            )

        # user id auth
        if not authorization.startswith("Bearer "):
            return JSONResponse(
                status_code = 401,
                content = error_response(
                    message = "Invalid Authorization Header Format"
                )
            )
        token = authorization.split(" ")[1]
        decoded_payload = token_decoder(token)[1]
        user_id = decoded_payload.get("sub")
        if not user_id:
            return JSONResponse(
                status_code = 401,
                content = error_response(
                    message = "User ID not found in Token"
                )
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

        db_comment = forum_models.Comments(
            comment_content = comm.comment_content,
            comment_created_by = user_id,
            reply_to = comm.reply_to,
            comment_in_post = post_id
        )
        
        try:
            db.add(db_comment)
            db.commit()
            db.refresh(db_comment)

        except Exception as e:
            db.rollback()
            detail_dict = {
                "exception": e
            }
            return JSONResponse(
                status_code = 500,
                content = error_response(
                    details = detail_dict,
                    message = "Error creating comment"
                )
            )

        return JSONResponse(
            status_code = 201,
            content = success_response(
                data = jsonable_encoder({
                    "course_id": course_id,
                    "post_id": db_comment.comment_in_post,
                    "comment_content": db_comment.comment_content,
                    "reply_to": db_comment.reply_to
                }),
                message = "Comment created successfully"
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
                message = "Error creating comment"
            )
        )


"""PUT API: to update OR vote a comment in a post"""
@router.put("/courses/{course_id}/discussions/{post_id}")
async def update_comment(course_id: int, post_id: int, comment_id: int, comm: CommentCreate, db: db_dependency, authorization: str = Header(...), mode: str = None, new_vote: int = None):
    try:
        # Course Validity
        if not check_course_validity(course_id=course_id):
            return JSONResponse(
                status_code = 404,
                content = error_response(
                    message = "Course Not Found"
                )
            )

        # Authorization Error
        if not authorization.startswith("Bearer "):
            return JSONResponse(
                status_code = 401,
                content = error_response(
                    message = "Invalid Authorization Header Format"
                )
            )
        token = authorization.split(" ")[1]
        decoded_payload = token_decoder(token)[1]
        user_id = decoded_payload.get("sub")
        if not user_id:
            return JSONResponse(
                status_code = 401,
                content = error_response(
                    message = "User ID not found in Token"
                )
            )

        db_forum = db.query(forum_models.Posts).filter(forum_models.Posts.course_id == course_id).filter(forum_models.Posts.post_id == post_id).first()
        if not db_forum:
            return JSONResponse(
                status_code = 404,
                content = error_response(
                    message = "Comment Not Found"
                )
            )

        db_comment = db.query(forum_models.Comments).filter(forum_models.Comments.comment_id == comment_id).first()
        if not db_comment:
            return JSONResponse(
                status_code = 404,
                content = error_response(
                    message = "Comment Not Found"
                )
            )
        
        if db_comment.comment_created_by != user_id:
            return JSONResponse(
                status_code = 404,
                content = error_response(
                    message = "You are not comment creator. You cannot edit the comment"
                )
            )

        update_data = comm.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_comment, key, value)

        db_comment.comment_updated_timestamp = datetime.now()

        try:
            db.commit()
            db.refresh(db_comment)
        except Exception as e:
            db.rollback()
            detail_dict = {
                "exception": e
            }
            return JSONResponse(
                status_code = 500,
                content = error_response(
                    details = detail_dict,
                    message = "Error updating comment"
                )
            )

        return JSONResponse(
            status_code = 200,
            content = success_response(
                data = jsonable_encoder(db_comment),
                message = "Comment updated successfully"
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
                message = "Error updating comment"
            )
        )


"""DELETE API: to delete a comment in a post"""
@router.delete("/courses/{course_id}/discussions/{post_id}")
async def delete_comment(course_id: int, post_id: int, comment_id: int, db: db_dependency, authorization: str = Header(...)):
    try:
        # Course validity checker gRPC
        if not check_course_validity(course_id=course_id):
            return JSONResponse(
                status_code = 404,
                content = error_response(
                    message = "Course Not Found"
                )
            )
        
        # Authorization Error
        if not authorization.startswith("Bearer "):
            return JSONResponse(
                status_code = 401,
                content = error_response(
                    message = "Invalid Authorization Header Format"
                )
            )
        token = authorization.split(" ")[1]
        decoded_payload = token_decoder(token)[1]
        user_id = decoded_payload.get("sub")
        if not user_id:
            return JSONResponse(
                status_code = 401,
                content = error_response(
                    message = "User ID not found in Token"
                )
            )

        db_forum = db.query(forum_models.Posts).filter(forum_models.Posts.course_id == course_id).filter(forum_models.Posts.post_id == post_id).first()
        if not db_forum:
            return JSONResponse(
                status_code = 404,
                content = error_response(
                    message = "Comment Not Found"
                )
            )

        db_comment = db.query(forum_models.Comments).filter(forum_models.Comments.comment_id == comment_id).first()
        if not db_comment:
            return JSONResponse(
                status_code = 404,
                content = error_response(
                    message = "Comment Not Found"
                )
            )
        
        if db_comment.comment_created_by != user_id:
            return JSONResponse(
                status_code = 404,
                content = error_response(
                    message = "You are not comment creator. You cannot delete the comment"
                )
            )

        try:
            db.delete(db_comment)
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
                    message = "Error deleting comment"
                )
            )

        return JSONResponse(
            status_code = 200,
            content = success_response(
                data = {},
                message = "Comment deleted successfully"
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
                message = "Error deleting comment"
            )
        )
