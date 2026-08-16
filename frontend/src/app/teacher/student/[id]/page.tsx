'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useKnowledgeStore } from '../../../../store/useKnowledgeStore';
import { useAffectiveStore } from '../../../../store/useAffectiveStore';
import { useTeacherStore } from '../../../../store/useTeacherStore';

export default function StudentDeepDivePage() {
  const params = useParams();
  const studentIdParam = (params?.id as string) || 'std_001';

  const { students } = useKnowledgeStore();
  const { earHistory } = useAffectiveStore();
  const { summary } = useTeacherStore();

  const student = students[studentIdParam] || students['std_001'];
  const auditLogs = (summary?.guardrail_audit_log || [
    { timestamp: '12:45', student_id: 'std_003', query: 'x เท่ากับกี่ครับ', guardrail_triggered: true, action: 'Stripped direct numeric answer, rewritten to Socratic prompt.' },
    { timestamp: '12:48', student_id: 'marcus', query: 'ขอเฉลยบวกเศษส่วน', guardrail_triggered: true, action: 'Prompt rewritten to ask guiding question on numerators.' }
  ]).filter((l) => l.student_id === student.id || student.id === 'std_003');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontFamily: 'Nunito' }}>
      {/* Header Back Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Link
          href="/teacher"
          style={{
            background: '#fff',
            color: '#2E7D32',
            textDecoration: 'none',
            padding: '8px 14px',
            borderRadius: '14px',
            fontWeight: 900,
            fontSize: '0.82rem',
            border: '2px solid rgba(255,255,255,0.9)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
          }}
        >
          ⬅️ กลับไปยัง Teacher Dashboard
        </Link>
      </div>

      {/* Student Overview Banner */}
      <div style={{
        background: `linear-gradient(135deg, ${student.color} 0%, ${student.color}bb 100%)`,
        borderRadius: 24,
        padding: '1.5rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: '#fff',
        boxShadow: `0 8px 24px ${student.color}30`,
        border: '3px solid rgba(255,255,255,0.5)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 32
          }}>
            {student.avatar}
          </div>
          <div>
            <div style={{ fontWeight: 900, fontSize: '1.4rem' }}>{student.name} ({student.id})</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.9, fontWeight: 700 }}>
              Age {student.age} · Level {student.level} Scholar · {student.greeting}
            </div>
          </div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.25)', borderRadius: 16, padding: '10px 16px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 800 }}>MY XP</div>
          <div style={{ fontWeight: 900, fontSize: '1.3rem' }}>⚡ {student.xp}</div>
        </div>
      </div>

      {/* Grid Details */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        {/* pyBKT Skill Mastery Matrix */}
        <div style={{ background: 'rgba(255,255,255,0.92)', borderRadius: 24, padding: '1.25rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '2px solid rgba(255,255,255,0.9)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ fontWeight: 900, fontSize: '1rem', color: '#222' }}>
            🧠 pyBKT Skill Mastery Matrix (P(L<sub>t</sub>))
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Object.entries(student.masteryMap).map(([skill, pLt]) => {
              const pct = Math.round(pLt * 100);
              return (
                <div key={skill} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 800 }}>
                    <span style={{ color: '#333', textTransform: 'capitalize' }}>{skill.replace(/_/g, ' ')}</span>
                    <span style={{ color: student.color, fontWeight: 900 }}>P(L<sub>t</sub>) = {pLt.toFixed(2)} ({pct}%)</span>
                  </div>
                  <div style={{ height: 10, background: `${student.color}25`, borderRadius: 10, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: student.color, borderRadius: 10 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Telemetry Stream */}
        <div style={{ background: 'rgba(255,255,255,0.92)', borderRadius: 24, padding: '1.25rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '2px solid rgba(255,255,255,0.9)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ fontWeight: 900, fontSize: '1rem', color: '#222' }}>
            📷 MediaPipe Telemetry Stream & EAR
          </div>

          <div style={{ background: '#F9F9F9', padding: '1rem', borderRadius: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#666' }}>EAR (Eye Aspect Ratio) Realtime Stream</div>
            <div style={{ height: 70, display: 'flex', alignItems: 'flex-end', gap: 4, paddingTop: 8 }}>
              {(earHistory.length > 0 ? earHistory : [0.25, 0.26, 0.24, 0.28, 0.27, 0.25, 0.22, 0.26]).map((val, idx) => (
                <div
                  key={idx}
                  style={{
                    flex: 1,
                    background: '#4CAF50',
                    height: `${Math.min(Math.max(val * 200, 10), 100)}%`,
                    borderRadius: '4px 4px 0 0'
                  }}
                  title={`EAR: ${val}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Socratic Chat Logs & Safety Guardrail Audit */}
      <div style={{ background: 'rgba(255,255,255,0.92)', borderRadius: 24, padding: '1.25rem 1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '2px solid rgba(255,255,255,0.9)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ fontWeight: 900, fontSize: '1rem', color: '#222' }}>
          🛡️ Socratic AI Safety Guardrail Audit Log
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {auditLogs.length > 0 ? (
            auditLogs.map((log, idx) => (
              <div
                key={idx}
                style={{
                  background: '#FFF8E1',
                  border: '2px solid #FFE082',
                  borderRadius: 14,
                  padding: '0.85rem 1rem',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  color: '#E65100',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ color: '#222', fontWeight: 900 }}>[{log.timestamp}] คำถามนักเรียน: "{log.query}"</div>
                  <div style={{ fontSize: '0.72rem', color: '#666', marginTop: 2 }}>{log.action}</div>
                </div>
                <span style={{ background: '#E65100', color: '#fff', fontSize: '0.65rem', fontWeight: 900, padding: '2px 8px', borderRadius: 8 }}>
                  Guardrail Passed ✅
                </span>
              </div>
            ))
          ) : (
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#666', background: '#F5F5F5', padding: '1rem', borderRadius: 14 }}>
              ยังไม่มีประวัติการละเมิด Guardrail สำหรับนักเรียนคนนี้
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
