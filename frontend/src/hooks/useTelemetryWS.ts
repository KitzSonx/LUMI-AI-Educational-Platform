import { useEffect, useRef, useState, useCallback } from 'react';
import { useAffectiveStore } from '../store/useAffectiveStore';
import { useKnowledgeStore } from '../store/useKnowledgeStore';

export function useTelemetryWS(backendWsUrl: string = 'ws://localhost:8000') {
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const { studentId } = useKnowledgeStore();
  const { ear, headPitch, gazeOffscreen, canvasErases, updateStressTelemetry } = useAffectiveStore();

  // Connect to WebSocket Gateway
  useEffect(() => {
    const wsUrl = `${backendWsUrl}/ws/telemetry/${studentId}`;
    const ws = new WebSocket(wsUrl);
    socketRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data && typeof data.stress_index === 'number') {
          updateStressTelemetry({
            stress_index: data.stress_index,
            stress_level: data.stress_level,
            recommendation: data.recommendation
          });
        }
      } catch (err) {
        console.error('Failed to parse telemetry message:', err);
      }
    };

    ws.onerror = (err) => {
      setIsConnected(false);
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, [backendWsUrl, studentId, updateStressTelemetry]);

  // Throttled dispatch payload every 1000ms (1Hz)
  const sendTelemetryPacket = useCallback(() => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      const payload = {
        student_id: studentId,
        timestamp: Math.floor(Date.now() / 1000),
        ear: ear,
        head_pitch: headPitch,
        gaze_offscreen: gazeOffscreen,
        canvas_erases: canvasErases
      };
      socketRef.current.send(JSON.stringify(payload));
    }
  }, [studentId, ear, headPitch, gazeOffscreen, canvasErases]);

  useEffect(() => {
    const interval = setInterval(sendTelemetryPacket, 1000);
    return () => clearInterval(interval);
  }, [sendTelemetryPacket]);

  return {
    isConnected
  };
}
