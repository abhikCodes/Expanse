import os, sys
from datetime import datetime
from typing import Annotated, Optional
from fastapi import APIRouter, Depends, Request, Header
from fastapi.responses import JSONResponse, Response
from fastapi.encoders import jsonable_encoder
from sqlalchemy import select
from sqlalchemy.orm import Session
from pymongo import MongoClient
from gridfs import GridFS
from bson import ObjectId
from courses_topics import models
from courses_topics.database import engine, SessionLocal
from courses_topics.schema import CourseBase, CourseCreate, CourseResponse, UserEnroll
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

MONGO_URI = os.getenv('MONGO_URL')
MONGO_DB_NAME = os.getenv('MONGO_DB_NAME')
client = MongoClient(MONGO_URI)
db_mongo = client[MONGO_DB_NAME]
fs = GridFS(db_mongo)


"""GET API: to get all the details for a specific course using it's ID"""
@router.get("/course")
async def get_course(db: db_dependency, course_id: int = None, mode: str = None, authorization: str = Header(...)):
    try:
        if mode=='all' and not course_id:
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
            course_id_lst = db.scalars(select(models.UserXrefCourse.course_id).filter(models.UserXrefCourse.user_id == user_id)).all()
            result = db.query(models.Courses).filter(models.Courses.course_id.in_(course_id_lst)).all()

        elif mode != 'all' and course_id:
            result = [db.query(models.Courses).filter(models.Courses.course_id == course_id).first()]

        else:
            return JSONResponse(
                status_code=404, 
                content=error_response(message="Invalid Query Parameters")
            )

        if not result:
            return JSONResponse(
                status_code=404, 
                content=error_response(message="Course Not Found")
            )
        
        return JSONResponse(
            status_code=200,
            content=success_response(
                data=jsonable_encoder([CourseResponse.model_validate(cor).model_dump() for cor in result]), 
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
            content=error_response(message=f"Error in retrieving course", details=detail_dict)
        )



"""POST API: to create a new course..."""
@router.post("/course")
async def create_course(course: CourseCreate, db: db_dependency, authorization: str = Header(...)):
    try:
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

        db_course = models.Courses(
            course_code=course.course_code, 
            course_name=course.course_name, 
            course_description=course.course_description,
            course_created_by=user_id,
            course_updated_by=user_id
        )
        try:
            db.add(db_course)
            db.commit()
            db.refresh(db_course)

            db_user_xref_course = models.UserXrefCourse(
                course_id=db_course.course_id,
                user_id=user_id
            )
            db.add(db_user_xref_course)
            db.commit()
            db.refresh(db_user_xref_course)

        except Exception as e:
            db.rollback()
            detail_dict = {
                "exception": e
            }
            return JSONResponse(
                status_code=500,
                content=error_response(message="Error creating course", details=str(e))
            )
        return JSONResponse(
            status_code=201, 
            content=success_response(
                data=jsonable_encoder({
                    "course_id": db_course.course_id,
                    **CourseBase.model_validate(db_course).model_dump()
                }), 
                message="Course created successfully"
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
            content=error_response(message="Error creating course", details=detail_dict)
        )



"""PUT API: to update any detail for the courses."""
@router.put("/course")
async def update_course(course_id: int, course: CourseBase, db: db_dependency):
    try:
        db_course = db.query(models.Courses).filter(models.Courses.course_id == course_id).first()
        
        if not db_course:
            return JSONResponse(
                status_code=404, 
                content=error_response(message="Course Not Found")
            )
        
        update_data = course.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_course, key, value)

        db_course.course_updated_timestamp = datetime.now()

        try:
            db.commit()
            db.refresh(db_course)
        except Exception as e:
            db.rollback()
            detail_dict = {
                "exception": e
            }
            return JSONResponse(
                status_code=500,
                content=error_response(message="Error updating course", details=detail_dict)
            )
        
        return JSONResponse(
            status_code=200,
            content=success_response(
                data=jsonable_encoder(CourseBase.model_validate(db_course).model_dump()), 
                message="Course updated successfully"
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
            content=error_response(message="Error updating course", details=detail_dict)
        )



"""DELETE API: to delete any course."""
@router.delete("/course")
async def delete_course(course_id: int, db: db_dependency):
    try:
        db_course = db.query(models.Courses).filter(models.Courses.course_id == course_id).first()
        
        if not db_course:
            return JSONResponse(
                status_code=404, 
                content=error_response(message="Course Not Found")
            )
        
        db_topics = db.query(models.Topics).filter(models.Topics.course_id == course_id).all()

        try:
            db.query(models.UserXrefCourse).filter(models.UserXrefCourse.course_id == course_id).delete()

            for topic in db_topics:
                db_contents = db.query(models.Contents).filter(models.Contents.topic_id == topic.topic_id).all()
                for content in db_contents:
                    if fs.exists({"_id": ObjectId(content.content_id)}):
                        fs.delete(ObjectId(content.content_id))
                    db.delete(content)
                db.delete(topic)

            db.delete(db_course)
            db.commit()
        except Exception as e:
            db.rollback()
            detail_dict = {
                "exception": e
            }
            return JSONResponse(
                status_code=500,
                content=error_response(message="Error deleting course", details=detail_dict)
            )
        
        return Response(
            status_code=204,
            # content=success_response(
            #     data={},
            #     message="Course deleted successfully"
            # )
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
            content=error_response(message="Error deleting course", details=detail_dict)
        )



"""POST API: Enroll a user in a course."""
@router.post("/enrollUser")
async def enroll_user(enroll: UserEnroll, db: db_dependency, authorization: str = Header(...)):
    try:
        if not authorization.startswith("Bearer "):
            return JSONResponse(
                status_code=401,
                content=error_response(message="Invalid Authorization header format")
            )
        token = authorization.split(" ")[1]
        decoded_payload = token_decoder(token)[1]
        auth_user_id = decoded_payload.get("sub")
        if not auth_user_id:
            return JSONResponse(
                status_code=401,
                content=error_response(message="User ID not found in token")
            )
        
        
        user_id_lst = enroll.user_id if isinstance(enroll.user_id, list) else [enroll.user_id]
        user_id_lst = set(user_id_lst)

        enrolled_user_id_lst = set(db.scalars(select(models.UserXrefCourse.user_id).filter(models.UserXrefCourse.course_id == enroll.course_id)).all())

        to_be_deenrolled_user_ids = enrolled_user_id_lst - user_id_lst
        if auth_user_id in to_be_deenrolled_user_ids:
            to_be_deenrolled_user_ids.remove(auth_user_id)
        db.query(models.UserXrefCourse).filter(
            models.UserXrefCourse.user_id.in_(to_be_deenrolled_user_ids), 
            models.UserXrefCourse.course_id == enroll.course_id
        ).delete()

        common_user_ids = enrolled_user_id_lst.intersection(user_id_lst)
        user_id_lst = user_id_lst - common_user_ids

        bulk_data = [
            models.UserXrefCourse(course_id=enroll.course_id, user_id=uid)
            for uid in user_id_lst
        ]
        
        try:
            db.bulk_save_objects(bulk_data)
            db.commit()
        except Exception as e:
            db.rollback()
            detail_dict = {
                "exception": e
            }
            return JSONResponse(
                status_code=500,
                content=error_response(message="Error enrolling user", details=str(e))
            )
        
        enrolled_users = [{"course_id": enroll.course_id, "user_id": uid} for uid in user_id_lst]
        return JSONResponse(
            status_code=201, 
            content=success_response(
                data=enrolled_users, 
                message="User enrolled successfully"
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
            content=error_response(message="Error enrolling user", details=detail_dict)
        )
    


"""GET API: Get all the enrolled students for a course"""
@router.get("/enrolledUsers")
async def get_enrolled_users(course_id: int, db: db_dependency):
    try:
        result = db.scalars(select(models.UserXrefCourse.user_id).filter(models.UserXrefCourse.course_id == course_id)).all()

        enrolled_users = {"course_id": course_id, "users": result}
            
        return JSONResponse(
            status_code=200, 
            content=success_response(
                data=enrolled_users, 
                message="Enrolled Users Fetched"
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
            content=error_response(message="Error getting users", details=detail_dict)
        )