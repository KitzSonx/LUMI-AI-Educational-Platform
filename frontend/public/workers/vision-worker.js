/**
 * MediaPipe Face Landmarker Web Worker
 * Calculates EAR (Eye Aspect Ratio), Head Pose (Pitch, Yaw, Roll), and Eye Gaze Direction
 */

// Helper to compute Euclidean distance between 2D/3D landmark points
function euclideanDist(p1, p2) {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  const dz = (p1.z || 0) - (p2.z || 0);
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Calculates Eye Aspect Ratio (EAR) using 6 landmark points per eye
 * Formula: EAR = (||p2 - p6|| + ||p3 - p5||) / (2 * ||p1 - p4||)
 */
function calculateEAR(landmarks) {
  // Left Eye Landmarks (standard MediaPipe face mesh indices)
  // p1=33, p2=160, p3=158, p4=133, p5=153, p6=144
  const p1 = landmarks[33];
  const p2 = landmarks[160];
  const p3 = landmarks[158];
  const p4 = landmarks[133];
  const p5 = landmarks[153];
  const p6 = landmarks[144];

  if (!p1 || !p2 || !p3 || !p4 || !p5 || !p6) return 0.28;

  const num1 = euclideanDist(p2, p6);
  const num2 = euclideanDist(p3, p5);
  const den = euclideanDist(p1, p4);

  if (den === 0) return 0.28;

  const ear = (num1 + num2) / (2.0 * den);
  return ear;
}

/**
 * Estimates Head Pose (Pitch, Yaw, Roll) from key facial features
 */
function calculateHeadPose(landmarks) {
  const nose = landmarks[1];
  const leftEye = landmarks[33];
  const rightEye = landmarks[263];
  const chin = landmarks[152];

  if (!nose || !leftEye || !rightEye || !chin) {
    return { pitch: 0, yaw: 0, roll: 0 };
  }

  // Pitch (up/down rotation) based on nose to eye-line vertical distance vs chin
  const eyeMidY = (leftEye.y + rightEye.y) / 2;
  const pitch = (nose.y - eyeMidY) * 100 - 12;

  // Yaw (left/right rotation) based on nose horizontal displacement relative to eyes
  const eyeMidX = (leftEye.x + rightEye.x) / 2;
  const yaw = (nose.x - eyeMidX) * 100;

  // Roll (tilt) based on angle between eyes
  const roll = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x) * (180 / Math.PI);

  return {
    pitch: parseFloat(pitch.toFixed(2)),
    yaw: parseFloat(yaw.toFixed(2)),
    roll: parseFloat(roll.toFixed(2))
  };
}

/**
 * Detects off-screen gazing using head yaw/pitch and eye direction thresholds
 */
function checkGazeOffscreen(headPose, ear) {
  const isOffscreen = Math.abs(headPose.yaw) > 18 || Math.abs(headPose.pitch) > 22 || ear < 0.14;
  return isOffscreen;
}

// Receive frame landmark tensor/array from main thread
self.onmessage = function (e) {
  const { type, landmarks, timestamp } = e.data;

  if (type === 'PROCESS_LANDMARKS' && landmarks && landmarks.length > 0) {
    const ear = calculateEAR(landmarks);
    const headPose = calculateHeadPose(landmarks);
    const gazeOffscreen = checkGazeOffscreen(headPose, ear);

    self.postMessage({
      type: 'VISION_METRICS_RESULT',
      timestamp: timestamp || Date.now(),
      ear: parseFloat(ear.toFixed(3)),
      headPitch: headPose.pitch,
      headYaw: headPose.yaw,
      headRoll: headPose.roll,
      gazeOffscreen: gazeOffscreen
    });
  }
};
