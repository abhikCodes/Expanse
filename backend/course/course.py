from typing import Annotated, Optional
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
import models
from database import engine, SessionLocal
from schema import CourseBase, CourseCreate
from sqlalchemy.orm import Session
from datetime import datetime
from backend.common.response_format import success_response, error_response

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]


"""GET API: to get all the details for a specific course using it's ID"""
@router.get("/course/{course_id}")
async def get_course(course_id: int, db: db_dependency):
    try:
        result = db.query(models.Courses).filter(models.Courses.course_id == course_id).first()
        if not result:
            return JSONResponse(
                status_code=404, 
                content=error_response(message="Course Not Found")
            )
        return JSONResponse(
            status_code=200,
            content=success_response(
                data=CourseBase.model_validate(result).model_dump(), 
                message="Course retrieved successfully"
            )
        )
    except Exception as e:
        return JSONResponse(
            status_code=500, 
            content=error_response(message="Error in retrieving course", details=str(e))
        )



"""POST API: to create a new course..."""
@router.post("/course/")
async def create_course(course: CourseCreate, db: db_dependency):
    try:
        db_course = models.Courses(
            course_code=course.course_code, 
            course_name=course.course_name, 
            course_description=course.course_description,
            course_created_by=course.course_created_by,
            course_updated_by=course.course_updated_by
        )
        try:
            db.add(db_course)
            db.commit()
            db.refresh(db_course)
        except Exception as e:
            db.rollback()
            return JSONResponse(
                status_code=500,
                content=error_response(message="Error creating course", details=str(e))
            )
        return JSONResponse(
            status_code=201, 
            content=success_response(
                data=CourseBase.model_validate(db_course).model_dump(), 
                message="Course created successfully"
            )
        )
    
    except Exception as e:
        return JSONResponse(
            status_code=500, 
            content=error_response(message="Error creating course", details=str(e))
        )



"""PUT API: to update any detail for the courses."""
@router.put("/course/{course_id}")
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
            return JSONResponse(
                status_code=500,
                content=error_response(message="Error updating course", details=str(e))
            )
        
        return JSONResponse(
            status_code=200,
            content=success_response(
                data=CourseBase.model_validate(db_course).model_dump(), 
                message="Course updated successfully"
            )
        )
    
    except Exception as e:
        return JSONResponse(
            status_code=500, 
            content=error_response(message="Error updating course", details=str(e))
        )



"""DELETE API: to delete any course."""
@router.delete("/course/{course_id}")
async def delete_course(course_id: int, db: db_dependency):
    try:
        db_course = db.query(models.Courses).filter(models.Courses.course_id == course_id).first()
        
        if not db_course:
            return JSONResponse(
                status_code=404, 
                content=error_response(message="Course Not Found")
            )

        try:
            db.delete(db_course)
            db.commit()
            
        except Exception as e:
            db.rollback()
            return JSONResponse(
                status_code=500,
                content=error_response(message="Error deleting course", details=str(e))
            )
        
        return JSONResponse(
            status_code=204,
            content=success_response(
                data={},
                message="Course deleted successfully"
            )
        )
    
    except Exception as e:
        return JSONResponse(
            status_code=500, 
            content=error_response(message="Error deleting course", details=str(e))
        )
