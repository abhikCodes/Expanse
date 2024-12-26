# Generated by the gRPC Python protocol compiler plugin. DO NOT EDIT!
"""Client and server classes corresponding to protobuf-defined services."""
import grpc
import warnings

import discussion_forum.check_services_pb2 as check__services__pb2

GRPC_GENERATED_VERSION = '1.68.1'
GRPC_VERSION = grpc.__version__
_version_not_supported = False

try:
    from grpc._utilities import first_version_is_lower
    _version_not_supported = first_version_is_lower(GRPC_VERSION, GRPC_GENERATED_VERSION)
except ImportError:
    _version_not_supported = True

if _version_not_supported:
    raise RuntimeError(
        f'The grpc package installed is at version {GRPC_VERSION},'
        + f' but the generated code in check_services_pb2_grpc.py depends on'
        + f' grpcio>={GRPC_GENERATED_VERSION}.'
        + f' Please upgrade your grpc module to grpcio>={GRPC_GENERATED_VERSION}'
        + f' or downgrade your generated code using grpcio-tools<={GRPC_VERSION}.'
    )


class CourseServiceStub(object):
    """gRPC service definition
    """

    def __init__(self, channel):
        """Constructor.

        Args:
            channel: A grpc.Channel.
        """
        self.CheckEnrollment = channel.unary_unary(
                '/courses_topics.CourseService/CheckEnrollment',
                request_serializer=check__services__pb2.EnrollmentRequest.SerializeToString,
                response_deserializer=check__services__pb2.EnrollmentResponse.FromString,
                _registered_method=True)
        self.CheckValidity = channel.unary_unary(
                '/courses_topics.CourseService/CheckValidity',
                request_serializer=check__services__pb2.ValidityRequest.SerializeToString,
                response_deserializer=check__services__pb2.ValidityResponse.FromString,
                _registered_method=True)


class CourseServiceServicer(object):
    """gRPC service definition
    """

    def CheckEnrollment(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

    def CheckValidity(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')


def add_CourseServiceServicer_to_server(servicer, server):
    rpc_method_handlers = {
            'CheckEnrollment': grpc.unary_unary_rpc_method_handler(
                    servicer.CheckEnrollment,
                    request_deserializer=check__services__pb2.EnrollmentRequest.FromString,
                    response_serializer=check__services__pb2.EnrollmentResponse.SerializeToString,
            ),
            'CheckValidity': grpc.unary_unary_rpc_method_handler(
                    servicer.CheckValidity,
                    request_deserializer=check__services__pb2.ValidityRequest.FromString,
                    response_serializer=check__services__pb2.ValidityResponse.SerializeToString,
            ),
    }
    generic_handler = grpc.method_handlers_generic_handler(
            'courses_topics.CourseService', rpc_method_handlers)
    server.add_generic_rpc_handlers((generic_handler,))
    server.add_registered_method_handlers('courses_topics.CourseService', rpc_method_handlers)


 # This class is part of an EXPERIMENTAL API.
class CourseService(object):
    """gRPC service definition
    """

    @staticmethod
    def CheckEnrollment(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(
            request,
            target,
            '/courses_topics.CourseService/CheckEnrollment',
            check__services__pb2.EnrollmentRequest.SerializeToString,
            check__services__pb2.EnrollmentResponse.FromString,
            options,
            channel_credentials,
            insecure,
            call_credentials,
            compression,
            wait_for_ready,
            timeout,
            metadata,
            _registered_method=True)

    @staticmethod
    def CheckValidity(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(
            request,
            target,
            '/courses_topics.CourseService/CheckValidity',
            check__services__pb2.ValidityRequest.SerializeToString,
            check__services__pb2.ValidityResponse.FromString,
            options,
            channel_credentials,
            insecure,
            call_credentials,
            compression,
            wait_for_ready,
            timeout,
            metadata,
            _registered_method=True)
