from datetime import datetime
from fastapi import HTTPException

def success_response(data: dict, message: str = "Operation successful"):
    return {
        "status": "success",
        "message": message,
        "data": data,
        "timestamp": datetime.utcnow().isoformat()
    }

def error_response(message: str, details: dict = {}):
    return {
        "status": "error",
        "message": message,
        "details": details,
        "timestamp": datetime.utcnow().isoformat()
    }