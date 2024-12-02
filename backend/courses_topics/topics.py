# from typing import Annotated, Optional
# from fastapi import APIRouter, Depends, File, UploadFile
# from fastapi.responses import JSONResponse
# import models, os, sys
# from database import engine, SessionLocal
# from schema import CourseBase, CourseCreate
# from sqlalchemy.orm import Session
# from pymongo import MongoClient
# import boto3
# from datetime import datetime
# from backend.common.response_format import success_response, error_response

# router = APIRouter()

# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()

# db_dependency = Annotated[Session, Depends(get_db)]

# mongo_client = MongoClient("mongodb://localhost:27017")
# mongo_db = mongo_client["expanse_platform"]
# mongo_topics = mongo_db["topics"]


# s3_client = boto3.client("s3", aws_access_key_id="YOUR_ACCESS_KEY", aws_secret_access_key="YOUR_SECRET_KEY")


# @router.post("/courses/{course_id}/topics")
# async def create_topic(course_id: int, topic: TopicCreate, db: Session = Depends(get_db), file: UploadFile = File(...)):
#     try:
#         # 1. Store the video file in AWS S3 (or another storage solution)
#         s3_key = f"videos/{course_id}/{file.filename}"
#         s3_client.upload_fileobj(file.file, "your-s3-bucket-name", s3_key)
#         video_url = f"https://your-s3-bucket-name.s3.amazonaws.com/{s3_key}"

#         # 2. Store content data in MongoDB
#         mongo_data = {
#             "topic_name": topic.topic_name,
#             "topic_description": topic.topic_description,
#             "course_id": course_id,
#             "video_url": video_url, 
#             "additional_content": topic.additional_content, 
#             "created_at": datetime.utcnow(),
#             "updated_at": datetime.utcnow()
#         }
#         mongo_result = mongo_topics.insert_one(mongo_data)
#         mongo_id = str(mongo_result.inserted_id) 

#         # 3. Store topic metadata in PostgreSQL
#         db_topic = models.Topics(
#             topic_name=topic.topic_name,
#             topic_description=topic.topic_description,
#             course_id=course_id,
#             topic_is_released=topic.topic_is_released,
#             topic_content=mongo_id, 
#             topic_created_by=topic.topic_created_by,
#             topic_updated_by=topic.topic_updated_by,
#             topic_created_timestamp=datetime.now(),
#             topic_updated_timestamp=datetime.now()
#         )
#         db.add(db_topic)
#         db.commit()
#         db.refresh(db_topic)
        
#         return JSONResponse(
#             status_code=201,
#             content=success_response(
#                 data={
#                     "topic_id": db_topic.topic_id,
#                     "topic_name": db_topic.topic_name,
#                     "video_url": video_url,
#                     "mongo_content_id": mongo_id
#                 },
#                 message="Topic created successfully with video"
#             )
#         )
#     except Exception as e:
#         return JSONResponse(
#             status_code=500,
#             content=error_response(status_code=500, message="Error creating topic", details=str(e))
#         )


# # """GET API: to get all the details for a specific topic using it's ID"""
# # @router.get("/topic/{topic_id}")
# # async def get_topic(topic_id: int, db: db_dependency):
# #     try:
# #         print("Get")
# #     except Exception as e:
# #         exc_type, exc_obj, exc_tb = sys.exc_info()
# #         fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
# #         detail_dict = {
# #             "exception": e,
# #             "exception_type": exc_type,
# #             "file_name": fname,
# #             "line_number": exc_tb.tb_lineno
# #         }
# #         return JSONResponse(
# #             status_code=500, 
# #             content=error_response(message=f"Error in retrieving course", details=detail_dict)
# #         )



# # """POST API: to create a new topic..."""
# # @router.post("/topic/")
# # async def create_course(course: CourseCreate, db: db_dependency):
# #     try:
# #         print("Post")
# #     except Exception as e:
# #         exc_type, exc_obj, exc_tb = sys.exc_info()
# #         fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
# #         detail_dict = {
# #             "exception": e,
# #             "exception_type": exc_type,
# #             "file_name": fname,
# #             "line_number": exc_tb.tb_lineno
# #         }
# #         return JSONResponse(
# #             status_code=500, 
# #             content=error_response(message="Error creating course", details=detail_dict)
# #         )



# # """PUT API: to update any detail for the courses."""
# # @router.put("/course/{course_id}")
# # async def update_course(course_id: int, course: CourseBase, db: db_dependency):
# #     try:
# #         print("Put")
# #     except Exception as e:
# #         exc_type, exc_obj, exc_tb = sys.exc_info()
# #         fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
# #         detail_dict = {
# #             "exception": e,
# #             "exception_type": exc_type,
# #             "file_name": fname,
# #             "line_number": exc_tb.tb_lineno
# #         }
# #         return JSONResponse(
# #             status_code=500, 
# #             content=error_response(message="Error updating course", details=detail_dict)
# #         )



# # """DELETE API: to delete any course."""
# # @router.delete("/course/{course_id}")
# # async def delete_course(course_id: int, db: db_dependency):
# #     try:
# #         print("Delete")
# #     except Exception as e:
# #         exc_type, exc_obj, exc_tb = sys.exc_info()
# #         fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
# #         detail_dict = {
# #             "exception": e,
# #             "exception_type": exc_type,
# #             "file_name": fname,
# #             "line_number": exc_tb.tb_lineno
# #         }
# #         return JSONResponse(
# #             status_code=500, 
# #             content=error_response(message="Error deleting course", details=detail_dict)
# #         )
