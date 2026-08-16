from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import telemetry_ws, socratic_rag, bkt_engine, teacher_api, teacher_ws
from config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="Adaptive Learning AI Tutor Backend Service"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(telemetry_ws.router)
app.include_router(socratic_rag.router)
app.include_router(bkt_engine.router)
app.include_router(teacher_api.router)
app.include_router(teacher_ws.router)

@app.get("/")
async def root():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "telemetry_ws": "/ws/telemetry/{student_id}",
        "teacher_ws": "/ws/teacher/classroom/{class_id}",
        "endpoints": {
            "socratic_chat": "/api/socratic/chat",
            "bkt_update": "/api/bkt/update",
            "teacher_summary": "/api/teacher/class-summary/{class_id}",
            "teacher_action_plan": "/api/teacher/generate-action-plan"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
