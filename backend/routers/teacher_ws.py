import json
import asyncio
import time
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter()

@router.websocket("/ws/teacher/classroom/{class_id}")
async def teacher_classroom_websocket(websocket: WebSocket, class_id: str):
    await websocket.accept()
    try:
        while True:
            # Broadcast 1Hz snapshot of classroom telemetry
            snapshot = {
                "class_id": class_id,
                "active_students_count": 4,
                "timestamp": int(time.time()),
                "students": [
                    {
                        "student_id": "std_001",
                        "name": "student 1",
                        "avatar": "🐱",
                        "stress_index": 0.15,
                        "stress_level": "LOW",
                        "zone": "FLOW",
                        "current_skill": "fractions_addition",
                        "mastery_prob": 0.55,
                        "status_flag": "BALANCED_LEARNING"
                    },
                    {
                        "student_id": "marcus",
                        "name": "Marcus",
                        "avatar": "🦊",
                        "stress_index": 0.45,
                        "stress_level": "MEDIUM",
                        "zone": "FRUSTRATION",
                        "current_skill": "fractions_addition",
                        "mastery_prob": 0.72,
                        "status_flag": "REPEATED_ERASE"
                    },
                    {
                        "student_id": "std_002",
                        "name": "student 2",
                        "avatar": "🦋",
                        "stress_index": 0.20,
                        "stress_level": "LOW",
                        "zone": "FLOW",
                        "current_skill": "science_energy_transfer",
                        "mastery_prob": 0.60,
                        "status_flag": "BALANCED_LEARNING"
                    },
                    {
                        "student_id": "std_003",
                        "name": "student 3",
                        "avatar": "🦉",
                        "stress_index": 0.85,
                        "stress_level": "HIGH",
                        "zone": "BURNOUT",
                        "current_skill": "fractions_addition",
                        "mastery_prob": 0.30,
                        "status_flag": "FATIGUE_DETECTED"
                    }
                ]
            }

            await websocket.send_json(snapshot)
            await asyncio.sleep(1.0)
    except WebSocketDisconnect:
        pass
    except Exception:
        await websocket.close()
