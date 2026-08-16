import { useEffect, useRef } from 'react';
import { useTeacherStore } from '../store/useTeacherStore';

export function useTeacherClassroomWS(backendWsUrl: string = 'ws://localhost:8000') {
  const socketRef = useRef<WebSocket | null>(null);
  const { classId, setWsConnected, updateClassroomSnapshot } = useTeacherStore();

  useEffect(() => {
    const wsUrl = `${backendWsUrl}/ws/teacher/classroom/${classId}`;
    const ws = new WebSocket(wsUrl);
    socketRef.current = ws;

    ws.onopen = () => {
      setWsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data && Array.isArray(data.students)) {
          updateClassroomSnapshot(data.students);
        }
      } catch (err) {
        console.error('Failed to parse teacher classroom telemetry packet:', err);
      }
    };

    ws.onerror = () => {
      setWsConnected(false);
    };

    ws.onclose = () => {
      setWsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, [backendWsUrl, classId, setWsConnected, updateClassroomSnapshot]);

  return {
    isSocketActive: socketRef.current?.readyState === WebSocket.OPEN
  };
}
