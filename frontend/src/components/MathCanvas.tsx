import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useAffectiveStore } from '../store/useAffectiveStore';

interface MathCanvasProps {
  onSubmitDrawing?: (imageDataUrl: string) => void;
  userColor?: string;
}

export const MathCanvas: React.FC<MathCanvasProps> = ({
  onSubmitDrawing,
  userColor = '#1E88E5'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tool, setTool] = useState<'pen' | 'pencil' | 'eraser'>('pen');
  const [penColor, setPenColor] = useState<string>(userColor);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [history, setHistory] = useState<ImageData[]>([]);

  const { incrementCanvasErases } = useAffectiveStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // White canvas background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle grid paper lines
    ctx.strokeStyle = '#F0F0F0';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    const initialData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory([initialData]);
  }, []);

  const saveState = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => [...prev.slice(-15), data]);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    saveState();
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = 16;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = penColor;
      ctx.lineWidth = tool === 'pencil' ? 2 : 4;
      ctx.globalAlpha = tool === 'pencil' ? 0.6 : 1.0;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    saveState();
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#F0F0F0';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    incrementCanvasErases();
  };

  const handleSubmit = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const imageDataUrl = canvas.toDataURL('image/png');
    if (onSubmitDrawing) {
      onSubmitDrawing(imageDataUrl);
    }
  };

  return (
    <div style={{
      background: '#fff',
      borderRadius: '24px',
      padding: '1.25rem',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      border: '2px solid rgba(255,255,255,0.9)',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Nunito'
    }}>
      {/* Goodnotes Toolbar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 12px',
        background: '#F5F5F5',
        borderRadius: '16px',
        marginBottom: '0.75rem'
      }}>
        <button
          onClick={() => setTool('pen')}
          style={{
            background: tool === 'pen' ? userColor : '#fff',
            color: tool === 'pen' ? '#fff' : '#444',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '12px',
            fontWeight: 800,
            fontSize: '0.8rem',
            cursor: 'pointer',
            fontFamily: 'Nunito'
          }}
        >
          ✏️ ปากกา
        </button>

        <button
          onClick={() => setTool('pencil')}
          style={{
            background: tool === 'pencil' ? userColor : '#fff',
            color: tool === 'pencil' ? '#fff' : '#444',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '12px',
            fontWeight: 800,
            fontSize: '0.8rem',
            cursor: 'pointer',
            fontFamily: 'Nunito'
          }}
        >
          ✎ ดินสอ
        </button>

        <button
          onClick={() => setTool('eraser')}
          style={{
            background: tool === 'eraser' ? userColor : '#fff',
            color: tool === 'eraser' ? '#fff' : '#444',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '12px',
            fontWeight: 800,
            fontSize: '0.8rem',
            cursor: 'pointer',
            fontFamily: 'Nunito'
          }}
        >
          🧹 ยางลบ
        </button>

        <div style={{ width: 1, height: 20, background: '#ccc', margin: '0 4px' }} />

        {['#1E88E5', '#E91E8C', '#4CAF50', '#222222'].map((c) => (
          <button
            key={c}
            onClick={() => {
              setPenColor(c);
              setTool('pen');
            }}
            style={{
              width: 22,
              height: 22,
              borderRadius: '50%',
              background: c,
              border: penColor === c ? '3px solid #FF8C42' : 'none',
              cursor: 'pointer'
            }}
          />
        ))}

        <button
          onClick={clearCanvas}
          style={{
            background: '#FFEBEE',
            color: '#C62828',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '12px',
            fontWeight: 800,
            fontSize: '0.75rem',
            cursor: 'pointer',
            fontFamily: 'Nunito',
            marginLeft: 'auto'
          }}
        >
          🗑️ ลบทั้งหมด
        </button>
      </div>

      {/* Canvas Paper */}
      <div style={{
        position: 'relative',
        width: '100%',
        minHeight: '340px',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '2px dashed #E0E0E0',
        background: '#FAFAFA'
      }}>
        <canvas
          ref={canvasRef}
          width={650}
          height={340}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          style={{
            cursor: tool === 'eraser' ? 'cell' : 'crosshair',
            display: 'block',
            width: '100%',
            height: '100%',
            touchAction: 'none'
          }}
        />
      </div>

      {/* Trigger Submit to AI */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
        <button
          onClick={handleSubmit}
          style={{
            background: `linear-gradient(135deg, ${userColor}, ${userColor}dd)`,
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '14px',
            fontWeight: 900,
            fontSize: '0.85rem',
            cursor: 'pointer',
            fontFamily: 'Nunito',
            boxShadow: `0 4px 12px ${userColor}40`,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          🤖 ส่งวิธีทำตรวจด้วย AI
        </button>
      </div>
    </div>
  );
};
