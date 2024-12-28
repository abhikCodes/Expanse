import grpc
from quiz_service.check_services_pb2 import EnrollmentRequest, ValidityRequest
from quiz_service.check_services_pb2_grpc import CourseServiceStub

class CourseClient:
    """gRPC client for the CourseService to check user enrollment and course validity."""

    def __init__(self, server_address="localhost:50051"):
        """
        Initialize the gRPC client.
        :param server_address: Address of the CourseService server (e.g., localhost:50051).
        """
        self.channel = grpc.insecure_channel(server_address)
        self.stub = CourseServiceStub(self.channel)

    def check_enrollment(self, user_id: str, course_id: int) -> bool:
        """
        Check if a user is enrolled in a course.
        :param user_id: The user ID to check.
        :param course_id: The course ID to check.
        :return: True if the user is enrolled, False otherwise.
        """
        try:
            request = EnrollmentRequest(user_id=user_id, course_id=course_id)
            response = self.stub.CheckEnrollment(request)
            return response.is_enrolled
        except grpc.RpcError as e:
            print(f"gRPC Error: {e.code()} - {e.details()}")
            return False

    def check_validity(self, course_id: int) -> bool:
        """
        Check if a course is valid.
        :param course_id: The course ID to check.
        :return: True if the course is valid, False otherwise.
        """
        try:
            request = ValidityRequest(course_id=course_id)
            response = self.stub.CheckValidity(request)
            return response.is_valid
        except grpc.RpcError as e:
            print(f"gRPC Error: {e.code()} - {e.details()}")
            return False
