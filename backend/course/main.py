from typing import Annotated, Optional
from fastapi import FastAPI, HTTPException, Depends
import models
from database import engine, SessionLocal
from schema import CourseBase, CourseResponse, CourseCreate
from sqlalchemy.orm import Session
from datetime import datetime
from backend.common.response_format import success_response, error_response

app = FastAPI()

models.Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]


"""GET API: to get all the details for a specific course using it's ID"""
@app.get("/course/{course_id}")
async def get_course(course_id: int, db: db_dependency):
    try:
        result = db.query(models.Courses).filter(models.Courses.course_id == course_id).first()
        if not result:
            raise HTTPException(
                status_code=404, 
                detail=error_response(status_code=404, message="Course Not Found")
            )
        return success_response(status_code=200, data=CourseBase.model_validate(result).model_dump(), message="Course retrieved successfully")
    except Exception as e:
        return error_response(status_code=500, message="Course retrieved successfully", details=e)


"""POST API: to create a new course..."""
@app.post("/course/")
async def create_course(course: CourseCreate, db: db_dependency):
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
        raise HTTPException(
            status_code=500,
            detail=error_response(status_code=500, message="Error creating course", details=str(e))
        )
    return success_response(status_code=201, data=CourseBase.model_validate(db_course).model_dump(), message="Course created successfully")



"""PUT API: to update any detail for the courses."""
@app.put("/course/{course_id}")
async def update_course(course_id: int, course: CourseBase, db: db_dependency):
    db_course = db.query(models.Courses).filter(models.Courses.course_id == course_id).first()
    
    if not db_course:
        raise HTTPException(
            status_code=404, 
            message=error_response(status_code=404, message="Course Not Found")
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
        raise HTTPException(
            status_code=500,
            detail=error_response(status_code=500, message="Error creating course", details=str(e))
        )
    
    return success_response(status_code=201, data=CourseBase.model_validate(db_course).model_dump(), message="Course updated successfully")
