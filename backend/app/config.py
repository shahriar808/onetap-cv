import os

ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")
    if origin.strip()
]
MAX_BODY_BYTES = int(os.getenv("MAX_BODY_BYTES", "1048576"))
RATE_LIMIT = os.getenv("RATE_LIMIT", "30/minute")
SMTP_HOST = os.getenv("SMTP_HOST", "").strip()
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "").strip()
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
FEEDBACK_TO_EMAIL = os.getenv("FEEDBACK_TO_EMAIL", "").strip()
FEEDBACK_FROM_EMAIL = os.getenv("FEEDBACK_FROM_EMAIL", "").strip() or SMTP_USER
FEEDBACK_RATE_LIMIT = os.getenv("FEEDBACK_RATE_LIMIT", "3/hour")
