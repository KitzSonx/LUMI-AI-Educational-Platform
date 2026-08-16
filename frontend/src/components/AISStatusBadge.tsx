import React from 'react';

interface AISStatusBadgeProps {
  isConnected?: boolean;
}

export const AISStatusBadge: React.FC<AISStatusBadgeProps> = ({ isConnected = true }) => {
  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(12px)',
      borderRadius: '20px',
      padding: '6px 14px',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
      border: '2px solid rgba(255,255,255,0.9)',
      fontFamily: 'Nunito',
      fontSize: '0.75rem',
      fontWeight: 800,
      color: '#333'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ position: 'relative', display: 'flex', width: '10px', height: '10px' }}>
          <span style={{
            position: 'absolute',
            display: 'inline-flex',
            height: '100%',
            width: '100%',
            borderRadius: '50%',
            backgroundColor: isConnected ? '#4CAF50' : '#FF8C42',
            opacity: 0.75,
            animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite'
          }}></span>
          <span style={{
            position: 'relative',
            display: 'inline-flex',
            borderRadius: '50%',
            height: '10px',
            width: '10px',
            backgroundColor: isConnected ? '#2E7D32' : '#E05A00'
          }}></span>
        </span>
        <span style={{ color: '#2E7D32', fontWeight: 900 }}>⚡ AIS 5G Latency</span>
      </div>

      <div style={{ width: '1px', height: '14px', background: '#e0e0e0' }} />

      <div style={{ color: '#666', fontWeight: 700 }}>
        🛡️ LearnDi Active
      </div>
    </div>
  );
};
