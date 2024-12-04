from typing import Annotated, Optional
from fastapi import APIRouter, Depends, File, UploadFile, Form
from fastapi.responses import JSONResponse, Response, StreamingResponse
import models, os, sys
from database import engine, SessionLocal
from schema import ContentBase
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


"""POST API to upload a content wrt to course and topic"""
@router.post("/content")
async def create_content(
    db: db_dependency, 
    course_id: int = Form(...), 
    topic_id: int = Form(...),
    content_created_by: int = Form(...),
    content_updated_by: int = Form(...), 
    file: UploadFile = File(...)):
    try:
        gridfs_id = fs.put(
            file.file,
            filename=file.filename,
            content_type=file.content_type,
            metadata={"uploader": content_created_by, "course_id": course_id, "topic_id": topic_id}
        )
        
        db_content = models.Contents(
            course_id=course_id,
            topic_id=topic_id,
            content_id=str(gridfs_id), 
            content_created_by=content_created_by,
            content_updated_by=content_updated_by,
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

