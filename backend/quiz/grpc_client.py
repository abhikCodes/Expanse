import grpc
from quiz.check_enrollment_pb2 import EnrollmentRequest
from quiz.check_enrollment_pb2_grpc import EnrollmentServiceStub

class EnrollmentClient:
    """gRPC client for the EnrollmentService."""

    def __init__(self, server_address="localhost:50051"):
        self.channel = grpc.insecure_channel(server_address)
        self.stub = EnrollmentServiceStub(self.channel)

    def check_enrollment(self, user_id: str, course_id: int) -> bool:
        """
        Check if a user is enrolled in a course.
        user_id: str (string ID of the user)
        course_id: int (ID of the course)
        """
        request = EnrollmentRequest(user_id=user_id, course_id=course_id)
        response = self.stub.CheckEnrollment(request)
        return response.is_enrolled
