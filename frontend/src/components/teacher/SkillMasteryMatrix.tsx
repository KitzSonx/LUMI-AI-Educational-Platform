import React from 'react';
import Link from 'next/link';
import { ClassroomStudent } from '../../store/useTeacherStore';

interface SkillMatrixItem {
  skill_name: string;
  topic_th: string;
  class_avg_p_lt: number;
  status: string;
}

interface SkillMasteryMatrixProps {
  skillMatrix?: SkillMatrixItem[];
  atRiskStudents?: ClassroomStudent[];
}

export const SkillMasteryMatrix: React.FC<SkillMasteryMatrixProps> = ({
  skillMatrix = [
    { skill_name: 'fractions_addition', topic_th: 'การบวกเศษส่วน (สพฐ. ป.4-6)', class_avg_p_lt: 0.54, status: 'NEEDS_RECAP' },
    { skill_name: 'fractions_multiplication', topic_th: 'การคูณเศษส่วน', class_avg_p_lt: 0.61, status: 'ON_TRACK' },
    { skill_name: 'decimals_conversion', topic_th: 'การแปลงทศนิยม', class_avg_p_lt: 0.59, status: 'ON_TRACK' },
    { skill_name: 'science_energy_transfer', topic_th: 'พลังงานและระบบนิเวศ', class_avg_p_lt: 0.66, status: 'ON_TRACK' }
  ],
  atRiskStudents = [
    { student_id: 'std_003', name: 'student 3', avatar: '🦉', stress_index: 0.85, stress_level: 'HIGH', zone: 'BURNOUT', current_skill: 'fractions_addition', mastery_prob: 0.30, status_flag: 'FATIGUE_DETECTED' }
  ]
}) => {
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
            🧠 pyBKT Class Mastery Matrix (P(L<sub>t</sub>))
          </div>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#888' }}>
            ระดับความรู้เฉลี่ยทั้งชั้นเรียนตามตัวชี้วัด สพฐ.
          </div>
        </div>
      </div>

      {/* Skills Matrix List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {skillMatrix.map((item) => {
          const pct = Math.round(item.class_avg_p_lt * 100);
          const isRecap = item.class_avg_p_lt < 0.55;
          return (
            <div
              key={item.skill_name}
              style={{
                background: '#F9F9F9',
                borderRadius: '16px',
                padding: '0.85rem 1rem',
                border: `2px solid ${isRecap ? '#FFE082' : '#E0E0E0'}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 900, fontSize: '0.85rem', color: '#222' }}>{item.topic_th}</span>
                <span style={{ fontWeight: 900, fontSize: '0.85rem', color: isRecap ? '#E65100' : '#2E7D32' }}>
                  Avg P(L<sub>t</sub>) = {item.class_avg_p_lt.toFixed(2)} ({pct}%)
                </span>
              </div>

              <div style={{ height: '8px', background: '#E0E0E0', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: isRecap ? '#FF8C42' : '#4CAF50', borderRadius: '8px' }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* At-Risk Students Panel */}
      <div style={{ background: '#FFF8E1', border: '2px solid #FFE082', borderRadius: '16px', padding: '0.85rem 1rem' }}>
        <div style={{ fontWeight: 900, fontSize: '0.82rem', color: '#E65100', marginBottom: '6px' }}>
          🚨 กลุ่มนักเรียนเสี่ยง At-Risk (P(L<sub>t</sub>) &lt; 0.50):
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {atRiskStudents.map((student) => (
            <Link
              key={student.student_id}
              href={`/teacher/student/${student.student_id}`}
              style={{
                background: '#fff',
                border: '1px solid #FFE082',
                borderRadius: '12px',
                padding: '4px 10px',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: 'Nunito'
              }}
            >
              <span>{student.avatar}</span>
              <span style={{ fontWeight: 900, fontSize: '0.78rem', color: '#222' }}>{student.name}</span>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#C62828' }}>
                (P(L<sub>t</sub>) = {student.mastery_prob})
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
