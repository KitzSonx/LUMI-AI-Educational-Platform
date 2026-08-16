'use client';

import './globals.css';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AISStatusBadge } from '../components/AISStatusBadge';
import { useKnowledgeStore } from '../store/useKnowledgeStore';
import { useAffectiveStore } from '../store/useAffectiveStore';

const USERS_LIST = [
  { id: 'std_001', name: 'student 1', age: 7, avatar: '🐱', color: '#E91E8C', bg: '#FCE4EC', level: 3 },
  { id: 'marcus', name: 'Marcus', age: 14, avatar: '🦊', color: '#1E88E5', bg: '#E3F2FD', level: 7 },
  { id: 'std_002', name: 'student 2', age: 32, avatar: '🦋', color: '#4CAF50', bg: '#E8F5E9', level: 5 },
  { id: 'std_003', name: 'student 3', age: 58, avatar: '🦉', color: '#FF8C42', bg: '#FFF0E6', level: 4 },
];

function Cloud({ style }: { style?: React.CSSProperties }) {
  return (
    <svg width="120" height="60" viewBox="0 0 120 60" fill="white" opacity="0.85" style={style}>
      <ellipse cx="60" cy="45" rx="55" ry="18" />
      <ellipse cx="40" cy="38" rx="28" ry="22" />
      <ellipse cx="72" cy="34" rx="32" ry="26" />
      <ellipse cx="95" cy="42" rx="22" ry="16" />
    </svg>
  );
}

function SkyBackground() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, background: 'linear-gradient(180deg, #87CEEB 0%, #b8e4f7 55%, #d4f0a0 100%)', overflow: 'hidden', pointerEvents: 'none' }}>
      <div className="float" style={{ position: 'absolute', top: 24, left: '8%' }}><Cloud /></div>
      <div className="float2" style={{ position: 'absolute', top: 16, left: '35%', transform: 'scale(0.75)' }}><Cloud /></div>
      <div className="float" style={{ position: 'absolute', top: 40, right: '12%', transform: 'scale(1.1)' }}><Cloud /></div>
      <div className="float2" style={{ position: 'absolute', top: 10, right: '38%', transform: 'scale(0.6)' }}><Cloud /></div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 90, background: 'linear-gradient(180deg, #78c850 0%, #5aac44 100%)', borderRadius: '50% 50% 0 0 / 20px 20px 0 0' }} />
      <div style={{ position: 'absolute', bottom: 70, left: '-5%', width: '35%', height: 120, background: '#6abf40', borderRadius: '50% 50% 0 0' }} />
      <div style={{ position: 'absolute', bottom: 70, right: '-5%', width: '30%', height: 100, background: '#6abf40', borderRadius: '50% 50% 0 0' }} />
    </div>
  );
}

function UserSwitcherModal({
  currentId,
  onSelect,
  onClose
}: {
  currentId: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  const { students } = useKnowledgeStore();

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={onClose}
    >
      <div
        style={{ background: '#fff', borderRadius: 28, padding: '2rem', width: 340, boxShadow: '0 24px 60px rgba(0,0,0,0.2)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontWeight: 900, fontSize: '1.1rem', color: '#333', marginBottom: '0.4rem' }}>Who's learning today?</div>
        <div style={{ fontWeight: 700, fontSize: '0.78rem', color: '#aaa', marginBottom: '1.25rem' }}>Each profile saves its own progress</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {USERS_LIST.map((u) => {
            const student = students[u.id] || u;
            const isSelected = u.id === currentId;
            return (
              <button
                key={u.id}
                onClick={() => {
                  onSelect(u.id);
                  onClose();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '0.85rem 1rem',
                  borderRadius: 18,
                  border: `3px solid ${isSelected ? u.color : 'transparent'}`,
                  background: isSelected ? u.bg : '#f9f9f9',
                  cursor: 'pointer',
                  fontFamily: 'Nunito',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: u.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}>
                  {u.avatar}
                </div>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ fontWeight: 900, fontSize: '0.95rem', color: '#222' }}>{student.name}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.72rem', color: '#888' }}>Age {u.age} · Day {student.streakDays}</div>
                </div>
                {isSelected && (
                  <span style={{ background: u.color, color: '#fff', fontWeight: 800, fontSize: '0.65rem', padding: '3px 10px', borderRadius: 20 }}>Active</span>
                )}
              </button>
            );
          })}
        </div>
        <button
          onClick={onClose}
          style={{ width: '100%', marginTop: '1rem', padding: '10px', background: '#f5f5f5', border: 'none', borderRadius: 14, fontWeight: 800, fontSize: '0.85rem', color: '#666', cursor: 'pointer', fontFamily: 'Nunito' }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [showSwitcher, setShowSwitcher] = useState(false);
  const { studentId, setStudentId, getStudent } = useKnowledgeStore();
  const { switchStudent } = useAffectiveStore();

  const currentStudent = getStudent();

  const handleSelectUser = (id: string) => {
    setStudentId(id);
    switchStudent(id);
  };

  const navTabs = [
    { href: '/', emoji: '🏠', label: 'Home' },
    { href: '/math-lab', emoji: '✏️', label: 'Math Lab' },
    { href: '/progress', emoji: '📊', label: 'My Progress' },
    { href: '/teacher', emoji: '👩‍🏫', label: 'Teacher Hub' },
  ];

  return (
    <html lang="th">
      <head>
        <title>เพื่อนเรียน - LUMI Adaptive AI Tutor</title>
      </head>
      <body style={{ minHeight: '100vh', fontFamily: 'Nunito, system-ui, sans-serif', padding: '1.5rem', position: 'relative' }}>
        <SkyBackground />

        {/* Floating Header Badge Bar */}
        <div style={{ maxWidth: 1100, margin: '0 auto 1.25rem auto', display: 'flex', justifyContent: 'flex-end', position: 'relative', zIndex: 10 }}>
          <AISStatusBadge />
        </div>

        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
          {/* Sticky Glass Sidebar */}
          <aside style={{
            width: 230,
            flexShrink: 0,
            background: 'rgba(255,255,255,0.88)',
            backdropFilter: 'blur(20px)',
            borderRadius: '28px',
            padding: '1.5rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem',
            boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
            border: '2px solid rgba(255,255,255,0.9)',
            position: 'sticky',
            top: '1.5rem',
            height: 'fit-content'
          }}>
            {/* App Brand Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: '1.25rem', paddingLeft: 6 }}>
              <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg, #4CAF50, #81C784)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, boxShadow: '0 4px 12px #4CAF5040' }}>🌟</div>
              <div>
                <div style={{ fontWeight: 900, fontSize: '1.1rem', color: '#2E7D32', lineHeight: 1.1 }}>เพื่อนเรียน</div>
                <div style={{ fontSize: '0.68rem', color: '#81C784', fontWeight: 700 }}>Learning Together</div>
              </div>
            </div>

            {/* Active User Card Button */}
            <button
              onClick={() => setShowSwitcher(true)}
              style={{
                background: `linear-gradient(135deg, ${currentStudent.color}, ${currentStudent.color}bb)`,
                borderRadius: 18,
                padding: '0.9rem',
                marginBottom: '0.5rem',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'Nunito',
                textAlign: 'left',
                boxShadow: `0 4px 16px ${currentStudent.color}40`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                  {currentStudent.avatar}
                </div>
                <div>
                  <div style={{ fontWeight: 900, fontSize: '0.9rem' }}>{currentStudent.name}</div>
                  <div style={{ fontSize: '0.65rem', opacity: 0.85, fontWeight: 700 }}>Age {currentStudent.age} · Level {currentStudent.level}</div>
                </div>
                <span style={{ marginLeft: 'auto', fontSize: '0.65rem', background: 'rgba(255,255,255,0.25)', padding: '3px 8px', borderRadius: 10, fontWeight: 700 }}>Switch</span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ flex: 1, background: 'rgba(255,255,255,0.2)', borderRadius: 10, padding: '4px 8px', textAlign: 'center' }}>
                  <div style={{ fontWeight: 900, fontSize: '0.95rem' }}>⚡ {currentStudent.xp}</div>
                  <div style={{ fontSize: '0.58rem', opacity: 0.85, fontWeight: 700 }}>My XP</div>
                </div>
                <div style={{ flex: 1, background: 'rgba(255,255,255,0.2)', borderRadius: 10, padding: '4px 8px', textAlign: 'center' }}>
                  <div style={{ fontWeight: 900, fontSize: '0.95rem' }}>📅 Day {currentStudent.streakDays}</div>
                  <div style={{ fontSize: '0.58rem', opacity: 0.85, fontWeight: 700 }}>Streak</div>
                </div>
              </div>
            </button>

            {/* Navigation Tabs */}
            {navTabs.map((t) => {
              const isActive = pathname === t.href;
              return (
                <Link
                  key={t.href}
                  href={t.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '0.7rem 0.9rem',
                    borderRadius: 16,
                    textDecoration: 'none',
                    fontFamily: 'Nunito',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    transition: 'all 0.2s ease',
                    background: isActive ? `linear-gradient(135deg, ${currentStudent.color}, ${currentStudent.color}bb)` : 'transparent',
                    color: isActive ? '#fff' : '#555',
                    boxShadow: isActive ? `0 4px 12px ${currentStudent.color}35` : 'none',
                  }}
                >
                  <span style={{ fontSize: 20 }}>{t.emoji}</span>
                  {t.label}
                </Link>
              );
            })}

            {/* Today's Goal Progress */}
            <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
              <div style={{ background: '#FFF8E1', borderRadius: 14, padding: '0.75rem', border: '2px dashed #F4A020' }}>
                <div style={{ fontSize: 20, marginBottom: 4 }}>🎯</div>
                <div style={{ fontWeight: 800, fontSize: '0.78rem', color: '#E65100' }}>Today's goal</div>
                <div style={{ fontWeight: 900, fontSize: '1rem', color: '#FF8C42', marginBottom: 6 }}>{currentStudent.dailyDone} / {currentStudent.dailyGoal} lessons</div>
                <div style={{ height: 8, background: '#FFE082', borderRadius: 8, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.round((currentStudent.dailyDone / currentStudent.dailyGoal) * 100)}%`, background: '#FF8C42', borderRadius: 8 }} />
                </div>
              </div>
            </div>
          </aside>

          {/* Main App Content Area */}
          <main style={{ flex: 1, minWidth: 0 }}>{children}</main>
        </div>

        {showSwitcher && (
          <UserSwitcherModal
            currentId={studentId}
            onSelect={handleSelectUser}
            onClose={() => setShowSwitcher(false)}
          />
        )}
      </body>
    </html>
  );
}
