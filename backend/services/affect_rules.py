import numpy as np
from typing import Dict, List, Any

# Sliding window storage for historical baseline per student
student_baselines: Dict[str, Dict[str, List[float]]] = {}

def calculate_stress_index(student_id: str, telemetry: Dict[str, Any]) -> Dict[str, Any]:
    """
    Calculate real-time Stress Index S_t in [0.0, 1.0] using standard deviation Z-Scores.
    Formula: Z = (X - mu) / sigma
    """
    ear = float(telemetry.get("ear", 0.25))
    head_pitch = abs(float(telemetry.get("head_pitch", 0.0)))
    gaze_offscreen = bool(telemetry.get("gaze_offscreen", False))
    canvas_erases = int(telemetry.get("canvas_erases", 0))

    if student_id not in student_baselines:
        student_baselines[student_id] = {
            "ear": [],
            "pitch": [],
            "erases": []
        }

    history = student_baselines[student_id]
    history["ear"].append(ear)
    history["pitch"].append(head_pitch)
    history["erases"].append(canvas_erases)

    # Keep sliding window of last 30 samples (30 seconds at 1Hz)
    for key in history:
        if len(history[key]) > 30:
            history[key].pop(0)

    # Calculate mean and std for EAR
    ear_array = np.array(history["ear"])
    mu_ear = np.mean(ear_array) if len(ear_array) > 1 else 0.28
    sigma_ear = np.std(ear_array) if len(ear_array) > 1 and np.std(ear_array) > 0.001 else 0.04

    # Z-Score for low EAR (squinting/drowsiness increases stress score)
    z_ear = (mu_ear - ear) / sigma_ear

    # Head posture & distraction penalty
    z_pitch = head_pitch / 25.0  # Normalized pitch offset score

    # Frustration penalty (frequent canvas erases)
    erase_penalty = min(canvas_erases * 0.15, 0.45)

    # Gaze offscreen penalty
    gaze_penalty = 0.25 if gaze_offscreen else 0.0

    # Composite Stress Score
    raw_stress = (max(0, z_ear) * 0.25) + (z_pitch * 0.20) + erase_penalty + gaze_penalty

    # Sigmoid / clamp normalization to [0.0, 1.0]
    stress_index = float(np.clip(raw_stress, 0.0, 1.0))
    stress_index = round(stress_index, 3)

    if stress_index < 0.35:
        stress_level = "LOW"
    elif stress_index < 0.70:
        stress_level = "MEDIUM"
    else:
        stress_level = "HIGH"

    return {
        "stress_index": stress_index,
        "stress_level": stress_level,
        "z_scores": {
            "z_ear": float(round(z_ear, 2)),
            "z_pitch": float(round(z_pitch, 2))
        },
        "recommendation": (
            "นักเรียนผ่อนคลาย พร้อมเรียนรู้ต่อ" if stress_level == "LOW" else
            "นักเรียนมีความลังเล ให้คำแนะนำเบาๆ" if stress_level == "MEDIUM" else
            "นักเรียนมีระดับความเครียดสูง ควรให้กำลังใจและเสนอพักเบรก"
        )
    }
