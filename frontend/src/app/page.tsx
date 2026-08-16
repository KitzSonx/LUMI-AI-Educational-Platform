'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { StressMonitorCard } from '../components/StressMonitorCard';
import { useVisionSensing } from '../hooks/useVisionSensing';
import { useTelemetryWS } from '../hooks/useTelemetryWS';
import { useKnowledgeStore } from '../store/useKnowledgeStore';

const subjects = [
  { id: 'math', label: 'Mathematics', emoji: '🔢', color: '#FF8C42', bg: '#FFF0E6', dark: '#E05A00', lessons: 48, unit: 'Unit 6', topic: 'Fractions & Decimals', desc: 'Start here today' },
  { id: 'science', label: 'Science', emoji: '🔬', color: '#4CAF50', bg: '#E8F5E9', dark: '#2E7D32', lessons: 42, unit: 'Unit 4', topic: 'Plants & Ecosystems', desc: 'Keep the flow' },
  { id: 'reading', label: 'Reading', emoji: '📖', color: '#7C4DFF', bg: '#EDE7F6', dark: '#4527A0', lessons: 64, unit: 'Unit 9', topic: 'Story Comprehension', desc: 'A gentle challenge' },
  { id: 'history', label: 'History', emoji: '🏛️', color: '#F4A020', bg: '#FFF8E1', dark: '#E65100', lessons: 36, unit: 'Unit 2', topic: 'Ancient Civilizations', desc: 'Explore past' },
  { id: 'art', label: 'Art & Music', emoji: '🎨', color: '#E91E8C', bg: '#FCE4EC', dark: '#880E4F', lessons: 28, unit: 'Unit 5', topic: 'Color & Rhythm', desc: 'Express creative' },
  { id: 'coding', label: 'Coding', emoji: '💻', color: '#1E88E5', bg: '#E3F2FD', dark: '#0D47A1', lessons: 55, unit: 'Unit 3', topic: 'Loops & Logic', desc: 'Build things' },
];

const mapStops = [
  { id: 1, label: 'Start', emoji: '🚩', done: true, active: false },
  { id: 2, label: 'Numbers', emoji: '🔢', done: true, active: false },
  { id: 3, label: 'Shapes', emoji: '🔷', done: true, active: false },
  { id: 4, label: 'Fractions', emoji: '🍕', done: false, active: true, tag: 'NOW' },
  { id: 5, label: 'Algebra', emoji: '➕', done: false, active: false },
  { id: 6, label: 'Geometry', emoji: '📐', done: false, active: false },
  { id: 7, label: 'Champion', emoji: '🏆', done: false, active: false },
];

export default function HomePage() {
  const { videoRef, startCamera } = useVisionSensing();
  useTelemetryWS();
  const { getStudent } = useKnowledgeStore();
  const [mapSelected, setMapSelected] = useState<number>(4);

  const student = getStudent();
  const { yesterdayProgress, streakDays, mood, greeting, color } = student;
  const { unitTopic, yesterdayPct, todayPct } = yesterdayProgress;
  const growth = todayPct - yesterdayPct;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontFamily: 'Nunito' }}>
      <video ref={videoRef} className="hidden" playsInline muted />

      {/* Welcome Banner */}
      <div style={{
        background: `linear-gradient(135deg, ${color} 0%, ${color}bb 100%)`,
        borderRadius: 24,
        padding: '1.5rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: `0 8px 24px ${color}30`,
        border: '3px solid rgba(255,255,255,0.5)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 800, fontSize: '0.8rem', marginBottom: 4 }}>
            📅 เรียนต่อเนื่องเป็นวันที่ {streakDays} แล้ว!
          </div>
          <div style={{ fontWeight: 900, fontSize: 'clamp(1.2rem, 2.5vw, 1.75rem)', color: '#fff', marginBottom: 6 }}>
            Hi {student.name}! {mood}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.95)', fontSize: '0.9rem', fontWeight: 700 }}>
            {greeting}
          </div>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.25)',
          backdropFilter: 'blur(8px)',
          padding: '0.8rem 1.2rem',
          borderRadius: 20,
          textAlign: 'center',
          border: '2px solid rgba(255,255,255,0.4)',
          color: '#fff',
          flexShrink: 0
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>Day Streak</div>
          <div style={{ fontSize: '2rem', fontWeight: 900, lineHeight: 1 }}>🔥 {streakDays}</div>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, marginTop: 2 }}>วันแห่งการเรียนรู้</div>
        </div>
      </div>

      {/* Progress Bar Banner */}
      <div style={{ background: 'rgba(255,255,255,0.9)', borderRadius: 24, padding: '1.25rem 1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '2px solid rgba(255,255,255,0.9)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div>
            <div style={{ fontWeight: 900, fontSize: '1.05rem', color: '#222' }}>📈 ความคืบหน้าประจำยูนิต</div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#666' }}>{unitTopic}</div>
          </div>
          <div style={{ background: growth >= 0 ? '#E8F5E9' : '#FFEBEE', color: growth >= 0 ? '#2E7D32' : '#C62828', padding: '6px 14px', borderRadius: 20, fontWeight: 900, fontSize: '0.85rem' }}>
            {growth >= 0 ? `🚀 เก่งขึ้น +${growth}% จากเมื่อวาน!` : `${growth}%`}
          </div>
        </div>

        <div style={{ position: 'relative', marginTop: 12, marginBottom: 8 }}>
          <div style={{ height: 14, background: `${color}25`, borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${Math.min(100, Math.max(0, todayPct))}%`, background: color, borderRadius: 14, transition: 'width 1s ease-in-out' }} />
          </div>
          <div
            style={{ position: 'absolute', top: -4, left: `${yesterdayPct}%`, bottom: -4, width: 3, background: '#333', borderRadius: 2 }}
            title={`เมื่อวาน: ${yesterdayPct}%`}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 800, color: '#777' }}>
          <span>เมื่อวานนี้: {yesterdayPct}%</span>
          <span style={{ color: color, fontWeight: 900 }}>วันนี้: {todayPct}%</span>
        </div>
      </div>

      {/* Middle Grid: Path Map + Continuation & Affective Sensing */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        {/* Left: Unit Map Path */}
        <div style={{ background: 'rgba(255,255,255,0.88)', borderRadius: 24, padding: '1.25rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '2px solid rgba(255,255,255,0.9)' }}>
          <div style={{ fontWeight: 900, fontSize: '1rem', color: '#2E7D32', marginBottom: '0.1rem' }}>📍 Unit 6, Math</div>
          <div style={{ fontWeight: 800, fontSize: '0.78rem', color: '#81C784', marginBottom: '1rem' }}>Fractions & Decimals</div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', paddingLeft: 20 }}>
            {mapStops.map((stop, i) => (
              <div key={stop.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <button
                    onClick={() => setMapSelected(stop.id)}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      border: stop.active || mapSelected === stop.id ? '3px solid #FF8C42' : '3px solid ' + (stop.done ? '#4CAF50' : '#ddd'),
                      background: stop.done ? '#4CAF50' : stop.active ? '#FF8C42' : '#fff',
                      color: stop.done || stop.active ? '#fff' : '#bbb',
                      fontSize: 18,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {stop.emoji}
                  </button>
                  {i < mapStops.length - 1 && (
                    <div style={{ width: 4, height: 16, background: stop.done ? '#4CAF50' : '#e5e5e5', borderRadius: 2 }} />
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 800, fontSize: '0.76rem', color: stop.done ? '#2E7D32' : stop.active ? '#FF8C42' : '#bbb' }}>
                    {stop.label}
                  </span>
                  {stop.tag && (
                    <span style={{ background: '#FF8C42', color: '#fff', fontSize: '0.6rem', fontWeight: 900, padding: '2px 8px', borderRadius: 10 }}>
                      {stop.tag}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Stack: Pick Up Lesson + Affective Stress Sensing */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Pick Up Where You Left Off */}
          <div style={{ background: 'linear-gradient(135deg, #7C4DFF 0%, #B39DDB 100%)', borderRadius: 24, padding: '1.25rem', color: '#fff', boxShadow: '0 8px 24px rgba(124, 77, 255, 0.3)' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, opacity: 0.8, marginBottom: 4 }}>PICK UP WHERE YOU LEFT OFF</div>
            <div style={{ fontWeight: 900, fontSize: '1.05rem', marginBottom: 6 }}>🍕 Fractions: Pieces of the Whole</div>
            <div style={{ height: 8, background: 'rgba(255,255,255,0.25)', borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${todayPct}%`, background: '#fff', borderRadius: 8 }} />
            </div>
            <Link
              href="/math-lab"
              style={{
                marginTop: '0.9rem',
                display: 'block',
                textAlign: 'center',
                padding: '10px',
                borderRadius: 16,
                background: '#fff',
                color: '#7C4DFF',
                fontWeight: 900,
                fontSize: '0.9rem',
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              ▶ Continue Lesson
            </Link>
          </div>

          {/* Real Affective Stress Sensing Component */}
          <StressMonitorCard onToggleCamera={startCamera} />
        </div>
      </div>

      {/* Explore a Subject Grid */}
      <div style={{ background: 'rgba(255,255,255,0.88)', borderRadius: 24, padding: '1.25rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '2px solid rgba(255,255,255,0.9)' }}>
        <div style={{ fontWeight: 900, fontSize: '0.95rem', color: '#222', marginBottom: '0.8rem' }}>Explore a Subject</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.6rem' }}>
          {subjects.map((s) => (
            <Link
              key={s.id}
              href="/math-lab"
              style={{
                background: s.bg,
                textDecoration: 'none',
                borderRadius: 16,
                padding: '0.75rem 0.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                fontFamily: 'Nunito',
                border: `2px solid ${s.color}20`
              }}
            >
              <span style={{ fontSize: 24 }}>{s.emoji}</span>
              <span style={{ fontSize: '0.68rem', fontWeight: 800, color: s.dark }}>{s.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom Section: Recommended for You */}
      <div style={{ background: 'rgba(255,255,255,0.88)', borderRadius: 24, padding: '1.25rem 1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '2px solid rgba(255,255,255,0.9)' }}>
        <div style={{ fontWeight: 900, fontSize: '1rem', color: '#222', marginBottom: 2 }}>✨ Recommended for You</div>
        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#888', marginBottom: '1rem' }}>Picked based on where you are — no rush</div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          {subjects.slice(0, 3).map((s, idx) => {
            const subjectPct = student.subjectProgress[idx] || 50;
            return (
              <div
                key={s.id}
                style={{
                  background: s.bg,
                  borderRadius: 20,
                  padding: '1rem',
                  border: `2px solid ${s.color}30`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 2 }}>{s.emoji}</div>
                <div style={{ fontWeight: 900, fontSize: '0.9rem', color: s.dark }}>{s.label}</div>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#666', marginBottom: 4 }}>{s.desc}</div>
                <div style={{ height: 8, background: `${s.color}25`, borderRadius: 8, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${subjectPct}%`, background: s.color, borderRadius: 8 }} />
                </div>
                <div style={{ fontSize: '0.65rem', fontWeight: 800, color: s.color, marginTop: 2 }}>{subjectPct}% Progress</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
