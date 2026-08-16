'use client';

import React from 'react';
import { useTeacherStore } from '../../store/useTeacherStore';
import { useTeacherClassroomWS } from '../../hooks/useTeacherClassroomWS';
import { useTeacherAnalytics } from '../../hooks/useTeacherAnalytics';
import { StressAlertBanner } from '../../components/teacher/StressAlertBanner';
import { RealtimeClassHeatmap } from '../../components/teacher/RealtimeClassHeatmap';
import { SkillMasteryMatrix } from '../../components/teacher/SkillMasteryMatrix';
import { AITeacherAssistantCard } from '../../components/teacher/AITeacherAssistantCard';

export default function TeacherDashboardPage() {
  const { students, activeAlerts, summary, isWsConnected } = useTeacherStore();
  useTeacherClassroomWS();
  const { isGeneratingPlan, generatePedagogicalPlan } = useTeacherAnalytics();

  const totalCount = students.length;
  const avgStress = students.length > 0 ? (students.reduce((acc, s) => acc + s.stress_index, 0) / students.length).toFixed(2) : '0.25';
  const highStressCount = students.filter((s) => s.stress_level === 'HIGH').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontFamily: 'Nunito' }}>
      {/* Page Header Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontWeight: 900, fontSize: '1.5rem', color: '#2E7D32' }}>
            👩‍🏫 Teacher Analytics Dashboard Hub
          </div>
          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#81C784' }}>
            ศูนย์ควบคุมการเรียนการสอนเรียลไทม์ (Real-Time Classroom Affective & pyBKT Monitoring)
          </div>
        </div>

        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '6px 14px',
          border: '2px solid rgba(255,255,255,0.9)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.75rem',
          fontWeight: 800
        }}>
          <span style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: isWsConnected ? '#4CAF50' : '#FF8C42'
          }} />
          <span style={{ color: isWsConnected ? '#2E7D32' : '#E05A00' }}>
            {isWsConnected ? '1Hz Classroom WS Active' : 'WS Connecting...'}
          </span>
        </div>
      </div>

      {/* Top Classroom Quick Metrics Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        <div style={{ background: '#fff', borderRadius: 20, padding: '1rem', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', border: '2px solid rgba(255,255,255,0.9)' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#888' }}>ACTIVE STUDENTS</div>
          <div style={{ fontWeight: 900, fontSize: '1.3rem', color: '#222', marginTop: 2 }}>{totalCount} คน</div>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#2E7D32', marginTop: 2 }}>ห้อง ป.4/1 (สพฐ.)</div>
        </div>

        <div style={{ background: '#fff', borderRadius: 20, padding: '1rem', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', border: '2px solid rgba(255,255,255,0.9)' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#888' }}>AVG STRESS INDEX (S<sub>t</sub>)</div>
          <div style={{ fontWeight: 900, fontSize: '1.3rem', color: '#1E88E5', marginTop: 2 }}>{avgStress}</div>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#888', marginTop: 2 }}>Classroom Average</div>
        </div>

        <div style={{ background: '#fff', borderRadius: 20, padding: '1rem', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', border: '2px solid rgba(255,255,255,0.9)' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#888' }}>BURNOUT / FATIGUE</div>
          <div style={{ fontWeight: 900, fontSize: '1.3rem', color: highStressCount > 0 ? '#C62828' : '#2E7D32', marginTop: 2 }}>
            {highStressCount} คน
          </div>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#888', marginTop: 2 }}>Red Zone Count</div>
        </div>

        <div style={{ background: '#fff', borderRadius: 20, padding: '1rem', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', border: '2px solid rgba(255,255,255,0.9)' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#888' }}>TARGET MASTERY (P(L<sub>t</sub>) ≥ 0.85)</div>
          <div style={{ fontWeight: 900, fontSize: '1.3rem', color: '#FF8C42', marginTop: 2 }}>
            {summary?.pct_mastery_target || 25.0}%
          </div>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#888', marginTop: 2 }}>Class Achievement</div>
        </div>
      </div>

      {/* Stress Alert Notification Banner */}
      <StressAlertBanner alerts={activeAlerts} />

      {/* AI Teacher Assistant Card (Gemini Action Plan) */}
      <AITeacherAssistantCard
        onGeneratePlan={generatePedagogicalPlan}
        isLoading={isGeneratingPlan}
      />

      {/* Real-time Classroom Heatmap */}
      <RealtimeClassHeatmap students={students} />

      {/* pyBKT Skill Mastery Matrix */}
      <SkillMasteryMatrix
        skillMatrix={summary?.skill_matrix}
        atRiskStudents={summary?.at_risk_students || students.filter((s) => s.mastery_prob < 0.5)}
      />
    </div>
  );
}
