from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .core.database import engine, Base
from . import models

# Note: models must be imported before create_all for discovery
def init_db():
    Base.metadata.drop_all(bind=engine) # Drop to fix schema mismatch
    Base.metadata.create_all(bind=engine)

from .routes import (
    resume_router,
    analyze_router,
    probability_router,
    detector_router,
    full_analysis_router
)

def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        debug=settings.DEBUG
    )

    # Database setup on startup
    @app.on_event("startup")
    def on_startup():
        init_db()

    # CORS Middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:5173"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Health Check Endpoint
    @app.get("/health", tags=["Health"])
    async def health_check():
        return {
            "status": "healthy",
            "app_name": settings.APP_NAME,
            "version": settings.APP_VERSION
        }

    # Register Routers under /api/v1
    app.include_router(resume_router, prefix="/api/v1")
    app.include_router(analyze_router, prefix="/api/v1")
    app.include_router(probability_router, prefix="/api/v1")
    app.include_router(detector_router, prefix="/api/v1")
    app.include_router(full_analysis_router, prefix="/api/v1", tags=["Full Analysis"])

    return app

app = create_app()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

@app.get("/")
def root():
    return {"message": "AI Resume Analyzer Backend Running 🚀"}