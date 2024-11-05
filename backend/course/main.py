from typing import Annotated, Optional
from fastapi import FastAPI, HTTPException, Depends
import models
from database import engine, SessionLocal
from schema import CourseBase, TopicBase
from sqlalchemy.orm import Session

app = FastAPI()

models.Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]


@app.get("/course/{course_id}")
async def get_course(course_id: int, db: db_dependency):
    result = db.query(models.Courses).filter(models.Courses.course_id == course_id).first()
    if not result:
        raise HTTPException(status_code=404, detail="Question not Found")
    return result


@app.post("/course/")
async def create_course(course: CourseBase, db: db_dependency):
    db_course = models.Courses(course_name=course.course_name, course_description=course.course_description)
    db.add(db_course)
    db.commit()
    db.refresh(db_course)