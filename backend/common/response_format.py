from datetime import datetime
from fastapi import HTTPException

def success_response(status_code: int, data: dict, message: str = "Operation successful"):
    return {
        "status": "success",
        "response_code": status_code,
        "data": data,
        "message": message,
        "timestamp": datetime.utcnow().isoformat()
    }

def error_response(status_code: int, message: str, details: str = None):
    return {
        "status": "error",
        "error_code": status_code,
        "message": message,
        "details": details,
        "timestamp": datetime.utcnow().isoformat()
    }