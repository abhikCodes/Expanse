from typing import Annotated, Optional
from fastapi import APIRouter, Depends, File, UploadFile, Form
from fastapi.responses import JSONResponse, Response
import models, os, sys
from database import engine, SessionLocal
from schema import TopicBase, TopicCreate, TopicResponse
from sqlalchemy.orm import Session
from pymongo import MongoClient
from gridfs import GridFS
from bson import ObjectId
import boto3
from fastapi.encoders import jsonable_encoder
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

MONGO_URI = "mongodb://localhost:27017"  
MONGO_DB_NAME = "file_storage"
client = MongoClient(MONGO_URI)
db_mongo = client[MONGO_DB_NAME]
fs = GridFS(db_mongo)

"""POST API to create a topic and upload it's content"""
@router.post("/topics")
async def create_topic(topic: TopicCreate, db: db_dependency):
    try:
        
        db_topic = models.Topics(
            topic_name=topic.topic_name,
            topic_description=topic.topic_description,
            course_id=topic.course_id,
            topic_is_released=topic.topic_is_released,
            topic_created_by=topic.topic_created_by,
            topic_updated_by=topic.topic_updated_by,
            topic_created_timestamp=datetime.now(),
            topic_updated_timestamp=datetime.now()
        )
        
        try:
            db.add(db_topic)
            db.commit()
            db.refresh(db_topic)
        except Exception as e:
            db.rollback()
            
            return JSONResponse(
                status_code=500,
                content=error_response(message="Error creating topic", details=str(e))
            )
        return JSONResponse(
            status_code=201,
            content=success_response(
                data=jsonable_encoder({
                    "topic_id": db_topic.topic_id,
                    **TopicBase.model_validate(db_topic).model_dump()
                }),
                message="Topic created successfully"
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
            content=error_response(message="Error creating topic", details=detail_dict)
        )


"""GET API: get all topics for a course OR get all the details for a specific topic using it's ID"""
@router.get("/topics")
async def get_topic(db: db_dependency, course_id: int, topic_id: int = None, mode: str = None):
    try:
        if mode == 'all':
            result = db.query(models.Topics).filter(models.Topics.course_id == course_id).all()
        else:
            result = [db.query(models.Topics).filter(models.Topics.topic_id == topic_id).first()]

        if not result:
            return JSONResponse(
                status_code=404, 
                content=error_response(message="Topics Not Found")
            )
        
        return JSONResponse(
            status_code=200,
            content=success_response(
                data=jsonable_encoder([TopicResponse.model_validate(top).model_dump() for top in result]), 
                message="Topics retrieved successfully"
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
            content=error_response(message=f"Error in retrieving topics", details=detail_dict)
        )



"""PUT API: to update any detail for the courses."""
@router.put("/topics")
async def update_course(topic_id: int, topic: TopicBase, db: db_dependency):
    try:
        db_topic = db.query(models.Topics).filter(models.Topics.topic_id == topic_id).first()
        
        if not db_topic:
            return JSONResponse(
                status_code=404, 
                content=error_response(message="Topic Not Found")
            )
        
        update_data = topic.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_topic, key, value)

        db_topic.topic_updated_timestamp = datetime.now()

        try:
            db.commit()
            db.refresh(db_topic)
        except Exception as e:
            db.rollback()
            detail_dict = {
                "exception": e
            }
            return JSONResponse(
                status_code=500,
                content=error_response(message="Error updating topic", details=detail_dict)
            )
        
        return JSONResponse(
            status_code=200,
            content=success_response(
                data=jsonable_encoder(TopicBase.model_validate(db_topic).model_dump()), 
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
            content=error_response(message="Error updating topic", details=detail_dict)
        )



"""DELETE API: to delete any topic."""
@router.delete("/topics")
async def delete_topic(topic_id: int, db: db_dependency):
    try:
        db_topic = db.query(models.Topics).filter(models.Topics.topic_id == topic_id).first()
        
        if not db_topic:
            return JSONResponse(
                status_code=404, 
                content=error_response(message="Topic Not Found")
            )
        
        db_contents = db.query(models.Contents).filter(models.Contents.topic_id == topic_id).all()

        try:
            for content in db_contents:
                if fs.exists({"_id": ObjectId(content.content_id)}):
                    fs.delete(ObjectId(content.content_id))
                db.delete(content)

            db.delete(db_topic)
            db.commit()
        except Exception as e:
            db.rollback()
            detail_dict = {
                "exception": e
            }
            return JSONResponse(
                status_code=500,
                content=error_response(message="Error deleting topic", details=detail_dict)
            )
        
        return Response(
            status_code=204,
            # content=success_response(
            #     data={},
            #     message="Topic deleted successfully"
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
            content=error_response(message="Error deleting topic", details=detail_dict)
        )
