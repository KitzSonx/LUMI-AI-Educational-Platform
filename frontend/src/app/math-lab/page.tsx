'use client';

import React, { useState } from 'react';
import { MathCanvas } from '../../components/MathCanvas';
import { SocraticChat } from '../../components/SocraticChat';
import { StressMonitorCard } from '../../components/StressMonitorCard';
import { useVisionSensing } from '../../hooks/useVisionSensing';
import { useTelemetryWS } from '../../hooks/useTelemetryWS';
import { useSocraticTutor } from '../../hooks/useSocraticTutor';

export default function MathLabPage() {
  const { videoRef, startCamera } = useVisionSensing();
  useTelemetryWS();
  const { submitProblemAttempt } = useSocraticTutor();

  const [activeSkill, setActiveSkill] = useState<string>('fractions_addition');
  const [feedbackStatus, setFeedbackStatus] = useState<string | null>(null);

  const handleDrawingSubmit = (dataUrl: string) => {
    setFeedbackStatus('🔍 ส่งวิธีทำด้วย AI: ได้รับรูปภาพวิธีทำแล้ว ลองสอบถามขอคำใบ้หรือคำตอบจาก AI Tutor Assistant ทางขวามือได้เลยครับ!');
  };

  const handleSimulateAnswer = (isCorrect: boolean) => {
    submitProblemAttempt(activeSkill, isCorrect);
    setFeedbackStatus(
      isCorrect
        ? '🎉 เก่งมากครับ! คำตอบถูกต้อง สมการ 3x = 15 ดังนั้น x = 5 (รับ +50 XP, pyBKT อัปเดต)'
        : '💡 ยังไม่ถูกต้องนะครับ ลองถามพี่ติวเตอร์ AI ทางขวามือเพื่อขอคำใบ้เพิ่มเติม'
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontFamily: 'Nunito' }}>
      <video ref={videoRef} className="hidden" playsInline muted />

      {/* Header Title */}
      <div>
        <div style={{ fontWeight: 900, fontSize: '1.5rem', color: '#2E7D32' }}>
          Math Canvas Lab ✏️🤖
        </div>
        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#81C784' }}>
          กระดาษทดเลขสไตล์ Goodnotes พร้อม AI ผู้ช่วยสอนส่วนตัว (Socratic RAG)
        </div>
      </div>

      {/* Workspace Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.25rem' }}>
        {/* Left Column: Math Canvas & Problem Header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Math Problem Card */}
          <div style={{
            background: '#fff',
            borderRadius: 24,
            padding: '1.25rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '2px solid rgba(255,255,255,0.9)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <div style={{
              background: '#FFF0E6',
              padding: '1rem',
              borderRadius: 16,
              border: '2px solid #FF8C4230'
            }}>
              <div style={{ fontWeight: 900, fontSize: '0.8rem', color: '#E05A00', marginBottom: 2 }}>
                โจทย์คณิตศาสตร์ประจำวันนี้ (Unit 6)
              </div>
              <div style={{ fontWeight: 900, fontSize: '1.2rem', color: '#222' }}>
                จงหาค่าของตัวแปร x จากสมการ: <span style={{ color: '#FF8C42' }}>3x + 7 = 22</span>
              </div>
            </div>

            {/* Quick Answer Simulator */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#666' }}>
                ทดลองส่งคำตอบ:
              </span>
              <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
                <button
                  onClick={() => handleSimulateAnswer(true)}
                  style={{
                    background: '#E8F5E9',
                    color: '#2E7D32',
                    border: '2px solid #A5D6A7',
                    padding: '6px 12px',
                    borderRadius: 12,
                    fontWeight: 900,
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    fontFamily: 'Nunito'
                  }}
                >
                  ✅ ตอบถูก (x = 5)
                </button>
                <button
                  onClick={() => handleSimulateAnswer(false)}
                  style={{
                    background: '#FFEBEE',
                    color: '#C62828',
                    border: '2px solid #FFCDD2',
                    padding: '6px 12px',
                    borderRadius: 12,
                    fontWeight: 900,
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    fontFamily: 'Nunito'
                  }}
                >
                  ❌ ตอบผิด
                </button>
              </div>
            </div>

            {feedbackStatus && (
              <div style={{
                background: '#FFF8E1',
                border: '2px solid #FFE082',
                borderRadius: 14,
                padding: '0.75rem',
                fontSize: '0.78rem',
                fontWeight: 800,
                color: '#E65100'
              }}>
                {feedbackStatus}
              </div>
            )}
          </div>

          {/* Math Scratchpad Canvas */}
          <MathCanvas onSubmitDrawing={handleDrawingSubmit} userColor="#1E88E5" />

          {/* Real Affective Stress Monitor */}
          <StressMonitorCard onToggleCamera={startCamera} />
        </div>

        {/* Right Column: AI Tutor Assistant */}
        <div>
          <SocraticChat currentSkill={activeSkill} userColor="#7C4DFF" />
        </div>
      </div>
    </div>
  );
}
