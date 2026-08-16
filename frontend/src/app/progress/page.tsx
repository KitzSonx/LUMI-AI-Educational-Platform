'use client';

import React from 'react';
import { useKnowledgeStore } from '../../store/useKnowledgeStore';
import { useAffectiveStore } from '../../store/useAffectiveStore';

const milestones = [
  { emoji: '🌱', label: 'First Step', desc: 'Completed your first lesson', unlocked: true },
  { emoji: '🔥', label: 'Getting Warm', desc: 'Kept a 3-day streak', unlocked: true },
  { emoji: '⭐', label: 'Star Moment', desc: 'Scored 100% on a quiz', unlocked: true },
  { emoji: '📅', label: 'Week Wonder', desc: 'Learned 7 days in a row', unlocked: true },
  { emoji: '🌊', label: 'Flow State', desc: 'Finished 3 lessons in one day', unlocked: false },
  { emoji: '🗺️', label: 'Explorer', desc: 'Tried all 6 subjects', unlocked: false },
  { emoji: '🎯', label: 'Sharpshooter', desc: 'Hit your goal 5 days straight', unlocked: false },
  { emoji: '🌟', label: 'Breakthrough', desc: 'Finished a full unit', unlocked: false },
];

export default function ProgressPage() {
  const { getStudent } = useKnowledgeStore();
  const { stressIndex, stressLevel, earHistory, canvasErases } = useAffectiveStore();

  const student = getStudent();
  const { name, masteryMap, xp, streakDays, badges } = student;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontFamily: 'Nunito' }}>
      {/* Page Header */}
      <div>
        <div style={{ fontWeight: 900, fontSize: '1.5rem', color: '#2E7D32' }}>
          My Progress & Milestones 📊🌟
        </div>
        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#81C784' }}>
          วิเคราะห์ระดับความรู้ Bayesian Knowledge Tracing (P(L<sub>t</sub>)) และสภาวะอารมณ์ของ {name}
        </div>
      </div>

      {/* Top Profile Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        <div style={{ background: '#fff', borderRadius: 20, padding: '1rem', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', border: '2px solid rgba(255,255,255,0.9)' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#888' }}>ACTIVE PROFILE</div>
          <div style={{ fontWeight: 900, fontSize: '1.1rem', color: '#222', marginTop: 2 }}>{name} ({student.avatar})</div>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#2E7D32', marginTop: 2 }}>LearnDi Profile Synced</div>
        </div>

        <div style={{ background: '#fff', borderRadius: 20, padding: '1rem', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', border: '2px solid rgba(255,255,255,0.9)' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#888' }}>TOTAL XP</div>
          <div style={{ fontWeight: 900, fontSize: '1.1rem', color: '#FF8C42', marginTop: 2 }}>⚡ {xp} XP</div>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#888', marginTop: 2 }}>Level {student.level} Scholar</div>
        </div>

        <div style={{ background: '#fff', borderRadius: 20, padding: '1rem', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', border: '2px solid rgba(255,255,255,0.9)' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#888' }}>STRESS INDEX (S<sub>t</sub>)</div>
          <div style={{ fontWeight: 900, fontSize: '1.1rem', color: stressLevel === 'HIGH' ? '#C62828' : stressLevel === 'MEDIUM' ? '#E65100' : '#2E7D32', marginTop: 2 }}>
            {stressLevel} ({Math.round(stressIndex * 100)}%)
          </div>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#888', marginTop: 2 }}>Sliding Z-Scores</div>
        </div>

        <div style={{ background: '#fff', borderRadius: 20, padding: '1rem', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', border: '2px solid rgba(255,255,255,0.9)' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#888' }}>DAY STREAK</div>
          <div style={{ fontWeight: 900, fontSize: '1.1rem', color: '#4CAF50', marginTop: 2 }}>🔥 {streakDays} Days</div>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#888', marginTop: 2 }}>Top Learning Flow</div>
        </div>
      </div>

      {/* Main Analytics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        {/* pyBKT Skill Mastery Matrix */}
        <div style={{ background: 'rgba(255,255,255,0.92)', borderRadius: 24, padding: '1.25rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '2px solid rgba(255,255,255,0.9)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #F0F0F0', paddingBottom: '0.5rem' }}>
            <div style={{ fontWeight: 900, fontSize: '1rem', color: '#222' }}>
              🧠 Bayesian Knowledge Tracing (P(L<sub>t</sub>))
            </div>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#2E7D32', background: '#E8F5E9', padding: '3px 8px', borderRadius: 10 }}>
              pyBKT Active
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {Object.entries(masteryMap).map(([skill, pLt]) => {
              const pct = Math.round(pLt * 100);
              return (
                <div key={skill} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 800 }}>
                    <span style={{ color: '#333', textTransform: 'capitalize' }}>{skill.replace(/_/g, ' ')}</span>
                    <span style={{ color: student.color, fontWeight: 900 }}>P(L<sub>t</sub>) = {pLt.toFixed(2)} ({pct}%)</span>
                  </div>
                  <div style={{ height: 10, background: `${student.color}25`, borderRadius: 10, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: student.color, borderRadius: 10, transition: 'width 0.5s ease-in-out' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Telemetry Sensor History */}
        <div style={{ background: 'rgba(255,255,255,0.92)', borderRadius: 24, padding: '1.25rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '2px solid rgba(255,255,255,0.9)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #F0F0F0', paddingBottom: '0.5rem' }}>
            <div style={{ fontWeight: 900, fontSize: '1rem', color: '#222' }}>
              📷 Affective Sensing Stream
            </div>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#1E88E5', background: '#E3F2FD', padding: '3px 8px', borderRadius: 10 }}>
              1Hz Gateway
            </span>
          </div>

          <div style={{ background: '#F9F9F9', padding: '1rem', borderRadius: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#666' }}>EAR (Eye Aspect Ratio) Telemetry History</div>
            <div style={{ height: 70, display: 'flex', alignItems: 'flex-end', gap: 4, paddingTop: 8 }}>
              {(earHistory.length > 0 ? earHistory : [0.25, 0.26, 0.24, 0.28, 0.27, 0.25, 0.22, 0.26]).map((val, idx) => (
                <div
                  key={idx}
                  style={{
                    flex: 1,
                    background: '#4CAF50',
                    height: `${Math.min(Math.max(val * 200, 10), 100)}%`,
                    borderRadius: '4px 4px 0 0',
                    transition: 'all 0.3s ease'
                  }}
                  title={`EAR: ${val}`}
                />
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div style={{ background: '#F5F5F5', padding: '0.75rem', borderRadius: 14 }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#888' }}>Total Canvas Erases</div>
              <div style={{ fontWeight: 900, fontSize: '1rem', color: '#222', marginTop: 2 }}>{canvasErases} ครั้ง</div>
            </div>
            <div style={{ background: '#F5F5F5', padding: '0.75rem', borderRadius: 14 }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#888' }}>Sampling Frequency</div>
              <div style={{ fontWeight: 900, fontSize: '1rem', color: '#2E7D32', marginTop: 2 }}>10 FPS Vision</div>
            </div>
          </div>
        </div>
      </div>

      {/* Milestones Grid */}
      <div style={{ background: 'rgba(255,255,255,0.92)', borderRadius: 24, padding: '1.25rem 1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '2px solid rgba(255,255,255,0.9)' }}>
        <div style={{ fontWeight: 900, fontSize: '1.1rem', color: '#222', marginBottom: '0.75rem' }}>
          Milestones & Unlocked Badges ({badges.length}) 🌟
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
          {badges.map((b) => (
            <div
              key={b.id}
              style={{
                background: b.unlocked ? '#FFF8E1' : '#F5F5F5',
                border: `2px solid ${b.unlocked ? '#FFE082' : '#E0E0E0'}`,
                borderRadius: 20,
                padding: '1rem',
                textAlign: 'center',
                opacity: b.unlocked ? 1 : 0.6
              }}
            >
              <div style={{ fontSize: 32 }}>{b.icon}</div>
              <div style={{ fontWeight: 900, fontSize: '0.9rem', color: b.unlocked ? '#E65100' : '#888', marginTop: 4 }}>
                {b.name}
              </div>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#777', marginTop: 2 }}>
                {b.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
