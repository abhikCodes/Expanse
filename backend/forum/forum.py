from typing import Annotated, Optional
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from database import SessionLocal
from schema import PostBase, PostCreate
from sqlalchemy.orm import Session
from datetime import datetime
from backend.common.response_format import success_response, error_response

import os, sys
import models as forum_models
import backend.courses_topics.models as course_models


router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]


"""POST API: to create a new post in a course forum"""
@router.post("/course/{course_id}/forum")
async def create_post(course_id: int, post: PostCreate, db: db_dependency):
    try:
        db_course = db.query(course_models.Courses).filter(course_models.Courses.course_id == course_id).first()
        if not db_course:
            return JSONResponse(
                status_code = 404,
                content = error_response(
                    message = "Course Not Found"
                )
            )

        db_forum = forum_models.Posts(
            post_title = post.post_title,
            post_content = post.post_content,
            post_created_by = post.post_created_by,
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


"""GET API: to get all the posts in the course forum"""
@router.get("/course/{course_id}/forum")
async def get_posts(course_id: int, db: db_dependency):
    try:
        db_course = db.query(course_models.Courses).filter(course_models.Courses.course_id == course_id).first()
        if not db_course:
            return JSONResponse(
                status_code = 404,
                content = error_response(
                    message = "Course Not Found"
                )
            )

        result = db.query(forum_models.Posts).filter(forum_models.Posts.course_id == course_id).all()
        if not result:
            return JSONResponse(
                status_code = 404,
                content = error_response(
                    message = "No Posts Found"
                )
            )

        return JSONResponse(
            status_code = 200,
            content = success_response(
                data = [PostBase.model_validate(pos).model_dump() for pos in result],
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


"""GET API: to get all the details for a specific post using it's ID"""
@router.get("/course/{course_id}/forum/{post_id}")
async def get_comments(course_id: int, post_id: int, db: db_dependency):
    try:
        db_course = db.query(course_models.Courses).filter(course_models.Courses.course_id == course_id).first()
        if not db_course:
            return JSONResponse(
                status_code = 404,
                content = error_response(
                    message = "Course Not Found"
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

        result = db.query(forum_models.Comments).filter(forum_models.Comments.comment_in_post == post_id).all()
        if not result:
            return JSONResponse(
                status_code = 200,
                content = success_response(
                    data = [PostBase.model_validate(pos).model_dump() for pos in result],
                    message = "No Comments Found"
                )
            )

        return JSONResponse(
            status_code = 200,
            content = success_response(
                data = [PostBase.model_validate(pos).model_dump() for pos in result],
                message = "Comments retrieved successfully"
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


"""PUT API: to update a post"""
@router.put("/course/{course_id}/forum/{post_id}")
async def update_post(course_id: int, post_id: int, post: PostBase, db: db_dependency):
    try:
        db_course = db.query(course_models.Courses).filter(course_models.Courses.course_id == course_id).first()
        if not db_course:
            return JSONResponse(
                status_code = 404,
                content = error_response(
                    message = "Course Not Found"
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
@router.delete("/course/{course_id}/forum/{post_id}")
async def delete_post(course_id: int, post_id: int, db: db_dependency):
    try:
        db_course = db.query(course_models.Courses).filter(course_models.Courses.course_id == course_id).first()
        if not db_course:
            return JSONResponse(
                status_code = 404,
                content = error_response(
                    message = "Course Not Found"
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
