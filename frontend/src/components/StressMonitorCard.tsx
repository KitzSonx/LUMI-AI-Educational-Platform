import React from 'react';
import { useAffectiveStore, StressLevel } from '../store/useAffectiveStore';

interface StressMonitorCardProps {
  onToggleCamera?: () => void;
}

export const StressMonitorCard: React.FC<StressMonitorCardProps> = ({ onToggleCamera }) => {
  const {
    isCameraActive,
    stressIndex,
    stressLevel,
    recommendation,
    ear,
    headPitch,
    gazeOffscreen,
    canvasErases,
  } = useAffectiveStore();

  const stressPercentage = Math.round(stressIndex * 100);

  const getBadgeConfig = (level: StressLevel) => {
    switch (level) {
      case 'LOW':
        return {
          bg: '#E8F5E9',
          color: '#2E7D32',
          border: '#A5D6A7',
          label: '😊 ปกติ (LOW STRESS)',
          barColor: '#4CAF50'
        };
      case 'MEDIUM':
        return {
          bg: '#FFF8E1',
          color: '#E65100',
          border: '#FFE082',
          label: '🤔 เริ่มมีความเครียด (MEDIUM)',
          barColor: '#FF8C42'
        };
      case 'HIGH':
        return {
          bg: '#FFEBEE',
          color: '#C62828',
          border: '#FFCDD2',
          label: '😟 เครียดสูง (HIGH STRESS)',
          barColor: '#E53935'
        };
    }
  };

  const config = getBadgeConfig(stressLevel);

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.92)',
      borderRadius: '24px',
      padding: '1.25rem',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      border: '2px solid rgba(255,255,255,0.9)',
      fontFamily: 'Nunito',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.85rem'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '12px',
            background: '#E8F5E9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px'
          }}>
            🧠
          </div>
          <div>
            <div style={{ fontWeight: 900, fontSize: '0.95rem', color: '#222' }}>
              Real-time Affective Sensing
            </div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#888' }}>
              ตรวจจับสภาวะอารมณ์ 10 FPS
            </div>
          </div>
        </div>

        <button
          onClick={onToggleCamera}
          style={{
            background: isCameraActive ? '#E8F5E9' : '#F5F5F5',
            color: isCameraActive ? '#2E7D32' : '#666',
            border: `2px solid ${isCameraActive ? '#A5D6A7' : '#E0E0E0'}`,
            borderRadius: '14px',
            padding: '6px 12px',
            fontWeight: 800,
            fontSize: '0.75rem',
            cursor: 'pointer',
            fontFamily: 'Nunito',
            transition: 'all 0.2s ease'
          }}
        >
          {isCameraActive ? '📷 Vision Active' : '📷 เปิดกล้องตรวจจับ'}
        </button>
      </div>

      {/* Stress Bar Gauge */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 800, color: '#555', marginBottom: '4px' }}>
          <span>Stress Index (S<sub>t</sub>)</span>
          <span style={{ color: config.color, fontWeight: 900 }}>{stressPercentage}%</span>
        </div>
        <div style={{ height: '12px', background: '#F0F0F0', borderRadius: '12px', overflow: 'hidden', padding: '2px' }}>
          <div style={{
            height: '100%',
            width: `${Math.min(Math.max(stressPercentage, 5), 100)}%`,
            background: config.barColor,
            borderRadius: '12px',
            transition: 'width 0.5s ease-in-out'
          }} />
        </div>
      </div>

      {/* Recommendation Banner */}
      <div style={{
        background: config.bg,
        border: `2px solid ${config.border}`,
        borderRadius: '16px',
        padding: '0.75rem 1rem',
        color: config.color
      }}>
        <div style={{ fontWeight: 900, fontSize: '0.78rem', textTransform: 'uppercase', marginBottom: '2px' }}>
          {config.label}
        </div>
        <div style={{ fontWeight: 700, fontSize: '0.75rem', opacity: 0.95 }}>
          {recommendation}
        </div>
      </div>

      {/* Sensor Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', textTransform: 'none' }}>
        <div style={{ background: '#F9F9F9', borderRadius: '12px', padding: '6px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.62rem', fontWeight: 700, color: '#888' }}>EAR (ตา)</div>
          <div style={{ fontWeight: 900, fontSize: '0.85rem', color: '#222', marginTop: '2px' }}>{ear}</div>
        </div>
        <div style={{ background: '#F9F9F9', borderRadius: '12px', padding: '6px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.62rem', fontWeight: 700, color: '#888' }}>Head Pitch</div>
          <div style={{ fontWeight: 900, fontSize: '0.85rem', color: '#222', marginTop: '2px' }}>{headPitch}°</div>
        </div>
        <div style={{ background: '#F9F9F9', borderRadius: '12px', padding: '6px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.62rem', fontWeight: 700, color: '#888' }}>Offscreen</div>
          <div style={{ fontWeight: 900, fontSize: '0.85rem', color: gazeOffscreen ? '#C62828' : '#2E7D32', marginTop: '2px' }}>
            {gazeOffscreen ? '👀 หันนอกจอ' : 'ปกติ'}
          </div>
        </div>
        <div style={{ background: '#F9F9F9', borderRadius: '12px', padding: '6px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.62rem', fontWeight: 700, color: '#888' }}>ลบกระดาน</div>
          <div style={{ fontWeight: 900, fontSize: '0.85rem', color: '#222', marginTop: '2px' }}>{canvasErases}</div>
        </div>
      </div>
    </div>
  );
};
