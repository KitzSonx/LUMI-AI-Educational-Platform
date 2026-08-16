import React from 'react';
import { useTeacherStore } from '../../store/useTeacherStore';

interface AITeacherAssistantCardProps {
  onGeneratePlan: () => void;
  isLoading?: boolean;
}

export const AITeacherAssistantCard: React.FC<AITeacherAssistantCardProps> = ({
  onGeneratePlan,
  isLoading = false
}) => {
  const { aiActionPlan } = useTeacherStore();

  return (
    <div style={{
      background: 'linear-gradient(135deg, #7C4DFF 0%, #B39DDB 100%)',
      borderRadius: '24px',
      padding: '1.25rem 1.5rem',
      boxShadow: '0 8px 24px rgba(124, 77, 255, 0.3)',
      border: '3px solid rgba(255,255,255,0.4)',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      fontFamily: 'Nunito'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '14px',
            background: 'rgba(255,255,255,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px'
          }}>
            🤖
          </div>
          <div>
            <div style={{ fontWeight: 900, fontSize: '1.1rem' }}>
              Gemini 1.5 Flash AI Pedagogical Action Plan
            </div>
            <div style={{ fontSize: '0.72rem', opacity: 0.9, fontWeight: 700 }}>
              ระบบวิเคราะห์ข้อเสนอแนะการจัดการเรียนการสอนอัตโนมัติสำหรับครู
            </div>
          </div>
        </div>

        <button
          onClick={onGeneratePlan}
          disabled={isLoading}
          style={{
            marginLeft: 'auto',
            background: '#fff',
            color: '#7C4DFF',
            border: 'none',
            padding: '10px 18px',
            borderRadius: '16px',
            fontWeight: 900,
            fontSize: '0.85rem',
            cursor: 'pointer',
            fontFamily: 'Nunito',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            opacity: isLoading ? 0.7 : 1
          }}
        >
          {isLoading ? '⏳ กำลังประมวลผล...' : '✨ Generate Class Pedagogical Insights'}
        </button>
      </div>

      {/* 3-Bullet Action Plan Display */}
      <div style={{
        background: 'rgba(255,255,255,0.95)',
        borderRadius: '18px',
        padding: '1rem 1.25rem',
        color: '#222',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <div style={{ fontWeight: 900, fontSize: '0.82rem', color: '#4527A0', textTransform: 'uppercase' }}>
          📋 แผนการปรับการสอน 3 ขั้นตอน (Actionable Interventions):
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {aiActionPlan.map((step, idx) => (
            <div
              key={idx}
              style={{
                background: '#F5F5F5',
                borderRadius: '12px',
                padding: '0.75rem',
                fontWeight: 700,
                fontSize: '0.82rem',
                color: '#333',
                lineHeight: 1.45
              }}
            >
              {step}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
