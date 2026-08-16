import React from 'react';
import Link from 'next/link';
import { ClassroomStudent } from '../../store/useTeacherStore';

interface RealtimeClassHeatmapProps {
  students: ClassroomStudent[];
}

export const RealtimeClassHeatmap: React.FC<RealtimeClassHeatmapProps> = ({ students }) => {
  const flowZone = students.filter((s) => s.stress_index <= 0.40);
  const frustrationZone = students.filter((s) => s.stress_index > 0.40 && s.stress_index <= 0.75);
  const burnoutZone = students.filter((s) => s.stress_index > 0.75);

  const renderStudentCard = (student: ClassroomStudent, zoneColor: string, zoneBg: string, zoneBorder: string) => {
    const stressPct = Math.round(student.stress_index * 100);
    return (
      <div
        key={student.student_id}
        style={{
          background: zoneBg,
          border: `2px solid ${zoneBorder}`,
          borderRadius: '16px',
          padding: '0.85rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          fontFamily: 'Nunito'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>{student.avatar}</span>
            <div>
              <div style={{ fontWeight: 900, fontSize: '0.85rem', color: '#222' }}>{student.name}</div>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#666' }}>{student.current_skill}</div>
            </div>
          </div>
          <span style={{ fontWeight: 900, fontSize: '0.85rem', color: zoneColor }}>{stressPct}%</span>
        </div>

        {/* Progress Bar */}
        <div style={{ height: '6px', background: 'rgba(0,0,0,0.06)', borderRadius: '6px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${stressPct}%`, background: zoneColor, borderRadius: '6px' }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.68rem', fontWeight: 800 }}>
          <span style={{ color: zoneColor }}>S<sub>t</sub> Index: {student.stress_index}</span>
          <Link
            href={`/teacher/student/${student.student_id}`}
            style={{ color: '#1E88E5', textDecoration: 'none', fontWeight: 900 }}
          >
            ดูสถิติ ➔
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.92)',
      borderRadius: '24px',
      padding: '1.25rem',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      border: '2px solid rgba(255,255,255,0.9)',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      fontFamily: 'Nunito'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontWeight: 900, fontSize: '1rem', color: '#222' }}>
            📊 Real-Time Classroom Affective Heatmap
          </div>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#888' }}>
            แบ่งโซนสภาวะอารมณ์จาก telemetry stream แบบเรียลไทม์ (1Hz)
          </div>
        </div>
      </div>

      {/* 3 Zones Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        {/* 🟢 Flow Zone */}
        <div style={{ background: '#F4FBF7', border: '2px dashed #A5D6A7', borderRadius: '18px', padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 900, fontSize: '0.78rem', color: '#2E7D32' }}>🟢 Flow Zone (0-40%)</span>
            <span style={{ background: '#E8F5E9', color: '#2E7D32', fontSize: '0.68rem', fontWeight: 900, padding: '2px 8px', borderRadius: '10px' }}>
              {flowZone.length} คน
            </span>
          </div>
          {flowZone.map((s) => renderStudentCard(s, '#2E7D32', '#E8F5E9', '#A5D6A7'))}
        </div>

        {/* 🟡 Frustration Zone */}
        <div style={{ background: '#FFFDF5', border: '2px dashed #FFE082', borderRadius: '18px', padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 900, fontSize: '0.78rem', color: '#E65100' }}>🟡 Frustration (41-75%)</span>
            <span style={{ background: '#FFF8E1', color: '#E65100', fontSize: '0.68rem', fontWeight: 900, padding: '2px 8px', borderRadius: '10px' }}>
              {frustrationZone.length} คน
            </span>
          </div>
          {frustrationZone.map((s) => renderStudentCard(s, '#E65100', '#FFF8E1', '#FFE082'))}
        </div>

        {/* 🔴 Burnout Zone */}
        <div style={{ background: '#FFF5F5', border: '2px dashed #FFCDD2', borderRadius: '18px', padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 900, fontSize: '0.78rem', color: '#C62828' }}>🔴 Burnout/Fatigue (&gt;75%)</span>
            <span style={{ background: '#FFEBEE', color: '#C62828', fontSize: '0.68rem', fontWeight: 900, padding: '2px 8px', borderRadius: '10px' }}>
              {burnoutZone.length} คน
            </span>
          </div>
          {burnoutZone.map((s) => renderStudentCard(s, '#C62828', '#FFEBEE', '#FFCDD2'))}
        </div>
      </div>
    </div>
  );
};
