import os

ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")
    if origin.strip()
]
MAX_BODY_BYTES = int(os.getenv("MAX_BODY_BYTES", "1048576"))
RATE_LIMIT = os.getenv("RATE_LIMIT", "30/minute")
