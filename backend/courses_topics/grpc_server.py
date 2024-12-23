import grpc
from concurrent import futures
from courses_topics.check_enrollment_pb2 import EnrollmentResponse
from courses_topics.check_enrollment_pb2_grpc import EnrollmentServiceServicer, add_EnrollmentServiceServicer_to_server
from courses_topics.database import SessionLocal
import courses_topics.models as models

class EnrollmentService(EnrollmentServiceServicer):
    """Implementation of the EnrollmentService gRPC server."""

    def CheckEnrollment(self, request, context):
        """
        Check if a user is enrolled in a course.
        Enrollment is determined by the presence of a record in the database.
        """
        user_id = request.user_id       # user_id is a string now
        course_id = request.course_id   # course_id remains an integer

        db = SessionLocal()
        try:
            # Query the User-Course mapping table
            is_enrolled = db.query(models.UserXrefCourse).filter(
                models.UserXrefCourse.user_id == user_id,
                models.UserXrefCourse.course_id == course_id
            ).first() is not None  # Check if a record exists

            # Return the response
            return EnrollmentResponse(is_enrolled=is_enrolled)
        finally:
            db.close()

def serve():
    """Start the gRPC server."""
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    add_EnrollmentServiceServicer_to_server(EnrollmentService(), server)
    server.add_insecure_port('[::]:50051')
    print("gRPC server is running on port 50051...")
    server.start()
    server.wait_for_termination()

if __name__ == "__main__":
    serve()
