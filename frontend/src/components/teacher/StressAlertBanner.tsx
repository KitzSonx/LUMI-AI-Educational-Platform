import React from 'react';
import Link from 'next/link';
import { ClassroomStudent } from '../../store/useTeacherStore';

interface StressAlertBannerProps {
  alerts: ClassroomStudent[];
}

export const StressAlertBanner: React.FC<StressAlertBannerProps> = ({ alerts }) => {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div style={{
      background: '#FFEBEE',
      border: '2px solid #FFCDD2',
      borderRadius: '20px',
      padding: '1rem 1.25rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      boxShadow: '0 4px 16px rgba(198, 40, 40, 0.12)',
      fontFamily: 'Nunito'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: '#C62828',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 900,
          fontSize: '14px'
        }}>
          ⚠️
        </div>
        <div style={{ fontWeight: 900, fontSize: '0.95rem', color: '#C62828' }}>
          แจ้งเตือนสภาวะความเครียดสะสม (Burnout / Fatigue Alert)
        </div>
        <span style={{ marginLeft: 'auto', background: '#C62828', color: '#fff', fontSize: '0.65rem', fontWeight: 900, padding: '2px 8px', borderRadius: '10px' }}>
          &gt; 60 วินาทีใน Red Zone
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {alerts.map((student) => (
          <div
            key={student.student_id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#fff',
              padding: '8px 12px',
              borderRadius: '12px',
              border: '1px solid #FFCDD2'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>{student.avatar}</span>
              <span style={{ fontWeight: 900, fontSize: '0.85rem', color: '#222' }}>{student.name}</span>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#C62828' }}>
                (Stress Index S<sub>t</sub> = {student.stress_index} · {student.status_flag})
              </span>
            </div>

            <Link
              href={`/teacher/student/${student.student_id}`}
              style={{
                background: '#C62828',
                color: '#fff',
                textDecoration: 'none',
                padding: '4px 10px',
                borderRadius: '8px',
                fontWeight: 900,
                fontSize: '0.72rem'
              }}
            >
              ดูสถิติรายบุคคล ➔
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
