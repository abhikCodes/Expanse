from typing import Annotated, Optional
from fastapi import APIRouter, Depends, File, UploadFile, Form, Header
from fastapi.responses import JSONResponse, Response, StreamingResponse
import models, os, sys
from database import engine, SessionLocal
from schema import TopicBase, TopicCreate, TopicResponse, ContentBase
from sqlalchemy.orm import Session
from pymongo import MongoClient
from gridfs import GridFS
from bson import ObjectId
import boto3
from fastapi.encoders import jsonable_encoder
from datetime import datetime
from backend.common.response_format import success_response, error_response
from backend.common.token_decoder import token_decoder

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

MONGO_URI = "mongodb://localhost:27017"  
MONGO_DB_NAME = "expanseDB"
client = MongoClient(MONGO_URI)
db_mongo = client[MONGO_DB_NAME]
fs = GridFS(db_mongo)


"""POST API to create topic and upload conetnt"""
@router.post("/topics")
async def create_topic(
    db: db_dependency, 
    topic_name: str = Form(...), 
    topic_description: str = Form(...), 
    course_id: int = Form(...), 
    topic_is_released: bool = Form(...), 
    file: UploadFile = File(...), 
    authorization: str = Header(...)):
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
        
        gridfs_id = None
        db_topic = models.Topics(
            topic_name=topic_name,
            topic_description=topic_description,
            course_id=course_id,
            topic_is_released=topic_is_released,
            topic_created_by=user_id,
            topic_updated_by=user_id,
            topic_created_timestamp=datetime.now(),
            topic_updated_timestamp=datetime.now()
        )
        try:
            db.add(db_topic)
            db.commit()
            db.refresh(db_topic)

            gridfs_id = fs.put(
                file.file,
                filename=file.filename,
                content_type=file.content_type,
                metadata={
                    "uploader": user_id, 
                    "course_id": course_id, 
                    "topic_id": db_topic.topic_id
                }
            )

            if gridfs_id:
                db_content = models.Contents(
                    course_id=course_id,
                    topic_id=db_topic.topic_id,
                    content_id=str(gridfs_id), 
                    content_created_by=user_id,
                    content_updated_by=user_id,
                    content_created_timestamp=datetime.now(),
                    content_updated_timestamp=datetime.now()
                )
                db.add(db_content)
                db.commit()
                db.refresh(db_content)

        except Exception as e:
            db.rollback()
            if gridfs_id:
                fs.delete(gridfs_id)
            
            return JSONResponse(
                status_code=500,
                content=error_response(message="Error creating topic", details=str(e))
            )
        return JSONResponse(
            status_code=201,
            content=success_response(
                data=jsonable_encoder({
                    "topic_id": db_topic.topic_id,
                    "content_id": str(gridfs_id),
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
async def update_topic(topic_id: int, topic: TopicBase, db: db_dependency):
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


"""POST API to upload a content wrt to course and topic"""
@router.post("/content")
async def create_content(
    db: db_dependency, 
    course_id: int = Form(...), 
    topic_id: int = Form(...), 
    file: UploadFile = File(...),
    authorization: str = Header(...)):
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
        gridfs_id = fs.put(
            file.file,
            filename=file.filename,
            content_type=file.content_type,
            metadata={"uploader": user_id, "course_id": course_id, "topic_id": topic_id}
        )
        
        db_content = models.Contents(
            course_id=course_id,
            topic_id=topic_id,
            content_id=str(gridfs_id), 
            content_created_by=user_id,
            content_updated_by=user_id,
            content_created_timestamp=datetime.now(),
            content_updated_timestamp=datetime.now()
        )
        
        try:
            db.add(db_content)
            db.commit()
            db.refresh(db_content)
        except Exception as e:
            db.rollback()
            fs.delete(gridfs_id)
            
            return JSONResponse(
                status_code=500,
                content=error_response(message="Error uploading content", details=str(e))
            )
        return JSONResponse(
            status_code=201,
            content=success_response(
                data=jsonable_encoder({
                    "content_id": db_content.id,
                    **ContentBase.model_validate(db_content).model_dump()
                }),
                message="Content uploaded successfully"
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
            content=error_response(message="Error uploading content", details=detail_dict)
        )
    


"""GET API to retrieve content details."""
@router.get("/content")
async def get_content(content_id: str):
    try:
        gridfs_file = fs.get(ObjectId(content_id))
        if not gridfs_file:
            return JSONResponse(
                status_code=404, 
                content=error_response(message="Content Not Found")
            )

        # Stream the file back to the client
        def iter_file():
            while chunk := gridfs_file.read(1024 * 1024):  # Read in chunks
                yield chunk

        filename = gridfs_file.filename
        sanitized_filename = filename.replace("\u202f", " ").replace(" ", "_")

        return StreamingResponse(
            iter_file(),
            media_type=gridfs_file.content_type,
            headers={
                "Content-Disposition": f"attachment; filename={sanitized_filename}"
            }
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
            content=error_response(message="Error retrieving content", details=detail_dict)
        )



"""DELETE API to delete a content."""
@router.delete("/content")
async def delete_content(content_id: str, db: db_dependency):
    try:
        db_content = db.query(models.Contents).filter(models.Contents.content_id == content_id).first()
        
        if not db_content:
            return JSONResponse(
                status_code=404, 
                content=error_response(message="Content Not Found")
            )

        gridfs_file = fs.find_one({"_id": ObjectId(content_id)})
        if gridfs_file:
            fs.delete(ObjectId(content_id))

        try:
            db.delete(db_content)
            db.commit()
        except Exception as e:
            db.rollback()
            return JSONResponse(
                status_code=500,
                content=error_response(message="Error deleting content", details=str(e))
            )
        
        return Response(
            status_code=204,
            # content=success_response(
            #     data={},
            #     message="Content deleted successfully"
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
            content=error_response(message="Error deleting content", details=detail_dict)
        )
