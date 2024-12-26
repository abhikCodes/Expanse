import grpc
from discussion_forum.check_services_pb2 import EnrollmentRequest, ValidityRequest
from discussion_forum.check_services_pb2_grpc import CourseServiceStub

class CourseClient:
    """gRPC client for the CourseService."""

    def __init__(self, server_address="localhost:50051"):
        self.channel = grpc.insecure_channel(server_address)
        self.stub = CourseServiceStub(self.channel)

    def check_enrollment(self, user_id: str, course_id: int) -> bool:
        """
        Check if a user is enrolled in a course.
        user_id: str (string ID of the user)
        course_id: int (ID of the course)
        """
        request = EnrollmentRequest(user_id=user_id, course_id=course_id)
        response = self.stub.CheckEnrollment(request)
        return response.is_enrolled
    
    def check_validity(self, course_id: int) -> bool:
        """
        Check if a course is valid.
        course_id: int (ID of the course)
        """
        request = ValidityRequest(course_id=course_id)
        response = self.stub.CheckValidity(request)
        return response.is_valid
    


   
