import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from services.affect_rules import calculate_stress_index
from config import settings

router = APIRouter()

# Redis async connection setup with in-memory fallback
redis_client = None
try:
    import redis.asyncio as aioredis
    redis_client = aioredis.from_url(settings.REDIS_URL, decode_responses=True)
except Exception:
    redis_client = None

telemetry_store = {}

@router.websocket("/ws/telemetry/{student_id}")
async def telemetry_websocket(websocket: WebSocket, student_id: str):
    await websocket.accept()
    try:
        while True:
            data_str = await websocket.receive_text()
            try:
                payload = json.loads(data_str)
            except Exception:
                continue

            # Ensure student_id
            payload["student_id"] = student_id

            # Save telemetry to Redis or in-memory fallback
            if redis_client:
                try:
                    await redis_client.set(f"telemetry:{student_id}", json.dumps(payload), ex=60)
                except Exception:
                    telemetry_store[student_id] = payload
            else:
                telemetry_store[student_id] = payload

            # Compute Stress Index using Affect Rules
            affect_result = calculate_stress_index(student_id, payload)

            # Send back real-time feedback packet
            response_payload = {
                "student_id": student_id,
                "timestamp": payload.get("timestamp"),
                "ear": payload.get("ear"),
                "head_pitch": payload.get("head_pitch"),
                "gaze_offscreen": payload.get("gaze_offscreen"),
                "stress_index": affect_result["stress_index"],
                "stress_level": affect_result["stress_level"],
                "z_scores": affect_result["z_scores"],
                "recommendation": affect_result["recommendation"]
            }

            await websocket.send_json(response_payload)
    except WebSocketDisconnect:
        pass
    except Exception as e:
        await websocket.close()
