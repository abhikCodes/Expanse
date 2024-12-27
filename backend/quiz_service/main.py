from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from quiz_service.api import quiz_bp
from quiz_service.grpc_client import CourseClient

app = FastAPI()

origins = [
    "http://localhost:3000",
]

# Add the CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register the quiz router
app.include_router(quiz_bp, prefix="/quiz", tags=["quiz"])

# Initialize the gRPC client for course-related checks
course_client = CourseClient(server_address="localhost:50051")  # Replace with actual gRPC server address if different

# Health Check Endpoint (Optional)
@app.get("/health")
def health_check():
    return {"status": "ok"}

# Example endpoint using the gRPC client
@app.get("/check-enrollment/{user_id}/{course_id}")
def check_enrollment(user_id: str, course_id: int):
    """
    Endpoint to check if a user is enrolled in a course.
    """
    is_enrolled = course_client.check_enrollment(user_id, course_id)
    return {"user_id": user_id, "course_id": course_id, "is_enrolled": is_enrolled}

@app.get("/check-course-validity/{course_id}")
def check_course_validity(course_id: int):
    """
    Endpoint to check if a course is valid.
    """
    is_valid = course_client.check_validity(course_id)
    return {"course_id": course_id, "is_valid": is_valid}
