from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import ALLOWED_ORIGINS
from app.api.health import router as health_router
from app.api.resume import router as resume_router
from app.api.templates import router as templates_router

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
    allow_credentials=False,
)
app.include_router(health_router)
app.include_router(templates_router)
app.include_router(resume_router)
