from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.database import init_db
from app.api.health import router as health_router
from app.api.analysis import router as analysis_router
from app.api.url_analysis import router as url_router
from app.api.image_analysis import router as image_router
from app.api.voice_analysis import router as voice_router
from app.api.document_analysis import router as document_router
from app.api.chat import router as chat_router
from app.api.reports import router as reports_router
from app.api.tools import router as tools_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize SQLite database schema
    init_db()
    yield


app = FastAPI(
    title="SAFEAI API",
    description="AI-Powered Personal Cybersecurity Assistant",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(health_router)
app.include_router(analysis_router)
app.include_router(url_router)
app.include_router(image_router)
app.include_router(voice_router)
app.include_router(document_router)
app.include_router(chat_router)
app.include_router(reports_router)
app.include_router(tools_router)


@app.get("/")
def root():
    return {
        "name": "SAFEAI",
        "description": "AI-Powered Personal Cybersecurity Assistant",
        "status": "running",
        "docs": "/docs",
        "features": [
            "AI Text Security Analyzer",
            "Safe URL Analyzer",
            "Screenshot Vision Analyzer",
            "Voice Message Analyzer",
            "Document Security Analyzer",
            "Cybersecurity Coach Chat",
            "Security History & Reports"
        ]
    }