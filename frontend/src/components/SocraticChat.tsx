import React, { useState } from 'react';
import { useSocraticTutor, ChatMessage } from '../hooks/useSocraticTutor';

interface SocraticChatProps {
  currentSkill?: string;
  userColor?: string;
}

export const SocraticChat: React.FC<SocraticChatProps> = ({
  currentSkill = 'fractions_addition',
  userColor = '#7C4DFF'
}) => {
  const { messages, isLoading, sendMessage } = useSocraticTutor();
  const [inputText, setInputText] = useState<string>('');

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(inputText, currentSkill);
    setInputText('');
  };

  const handleGetHint = () => {
    sendMessage('ขอคำใบ้เพิ่มหน่อยครับ', currentSkill);
  };

  return (
    <div style={{
      background: '#FFF',
      borderRadius: '24px',
      padding: '1.25rem',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      border: '2px solid rgba(255,255,255,0.9)',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Nunito',
      height: '100%',
      minHeight: '480px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginBottom: '1rem',
        paddingBottom: '0.75rem',
        borderBottom: '2px solid #f0f0f0'
      }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 14,
          background: '#EDE7F6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 22
        }}>
          🤖
        </div>
        <div>
          <div style={{ fontWeight: 900, fontSize: '1rem', color: '#4527A0' }}>AI Tutor Assistant</div>
          <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#7C4DFF' }}>ผู้ช่วยสอนคณิตศาสตร์ (Socratic RAG)</div>
        </div>
      </div>

      {/* Messages Feed */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        paddingRight: 4,
        maxHeight: '340px'
      }}>
        {messages.map((msg: ChatMessage) => (
          <div
            key={msg.id}
            style={{
              background: msg.sender === 'user' ? '#E3F2FD' : '#F5F5F5',
              border: msg.sender === 'user' ? '2px solid #90CAF9' : '1px solid #E0E0E0',
              borderRadius: 14,
              padding: '0.75rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: msg.sender === 'user' ? '#0D47A1' : '#333',
              lineHeight: 1.45,
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '90%'
            }}
          >
            {msg.stressAdapted && (
              <div style={{
                fontSize: '0.65rem',
                fontWeight: 800,
                color: '#E65100',
                background: '#FFF8E1',
                padding: '2px 8px',
                borderRadius: '8px',
                marginBottom: '4px',
                width: 'fit-content'
              }}>
                🧡 พักผ่อน & ส่งกำลังใจ (Stress-Adapted)
              </div>
            )}
            <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
            <div style={{ fontSize: '0.6rem', color: '#888', marginTop: '4px', textAlign: 'right' }}>
              {msg.timestamp}
            </div>
          </div>
        ))}

        {isLoading && (
          <div style={{
            background: '#EDE7F6',
            borderRadius: 14,
            padding: '0.75rem',
            fontSize: '0.8rem',
            fontWeight: 800,
            color: '#7C4DFF',
            width: 'fit-content'
          }}>
            ⏳ พี่ติวเตอร์กำลังคิดคำตอบ...
          </div>
        )}
      </div>

      {/* Quick Actions & Input Bar */}
      <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button
          onClick={handleGetHint}
          disabled={isLoading}
          style={{
            background: '#EDE7F6',
            color: '#7C4DFF',
            border: 'none',
            padding: '10px',
            borderRadius: 14,
            fontWeight: 900,
            fontSize: '0.82rem',
            cursor: 'pointer',
            fontFamily: 'Nunito'
          }}
        >
          💡 ขอคำใบ้เพิ่ม
        </button>

        <form onSubmit={handleSend} style={{ display: 'flex', gap: '6px' }}>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="พิมพ์คำถามหรือวิธีคิดของคุณ..."
            style={{
              flex: 1,
              background: '#F5F5F5',
              border: '2px solid #E0E0E0',
              borderRadius: 14,
              padding: '10px 14px',
              fontSize: '0.82rem',
              fontWeight: 700,
              outline: 'none',
              fontFamily: 'Nunito'
            }}
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            style={{
              background: userColor,
              color: '#fff',
              border: 'none',
              padding: '10px 16px',
              borderRadius: 14,
              fontWeight: 900,
              fontSize: '0.85rem',
              cursor: 'pointer',
              fontFamily: 'Nunito',
              opacity: !inputText.trim() || isLoading ? 0.6 : 1
            }}
          >
            ส่ง 🚀
          </button>
        </form>
      </div>
    </div>
  );
};
