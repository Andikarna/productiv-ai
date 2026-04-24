import { useEffect, useRef, useState } from 'react';
import { useChat } from '../context/ChatContext';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

const QUICK_PROMPTS = [
  { icon: '⌘', text: 'Optimize my daily schedule' },
  { icon: '✧', text: 'Draft a project roadmap' },
  { icon: '⚡', text: 'I need a productivity boost' },
  { icon: '⟡', text: 'Review my pending tasks' },
];

export default function ChatWindow({ tasks = [] }) {
  const { messages, isTyping, sendMessage, loadHistory, clearChat } = useChat();
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Mention State
  const [mentionOpen, setMentionOpen] = useState(false);
  const [mentionFilter, setMentionFilter] = useState('');
  const [mentionIndex, setMentionIndex] = useState(0);
  const [mentionStart, setMentionStart] = useState(-1);

  // Image Upload State
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePayload, setImagePayload] = useState(null);

  // Filter pending tasks based on mention filter
  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const filteredTasks = pendingTasks.filter(t => 
    t.title.toLowerCase().includes(mentionFilter.toLowerCase())
  );

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (text) => {
    const msg = (text || input).trim();
    if (!msg && !imagePayload || sending) return;
    setInput('');
    setMentionOpen(false);
    setSending(true);
    
    await sendMessage(msg, imagePayload);
    
    setSending(false);
    setSelectedImage(null);
    setImagePayload(null);
    inputRef.current?.focus();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setSelectedImage(base64String);
        
        // Extract base64 data and mimeType
        const mimeType = base64String.split(';')[0].split(':')[1];
        const data = base64String.split(',')[1];
        
        setImagePayload({ data, mimeType });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePayload(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const insertTaskMention = (task) => {
    const beforeMention = input.slice(0, mentionStart);
    // Find where the mention text ends (from the current cursor pos when typed, roughly input length for now or up to next space)
    const afterMention = input.slice(inputRef.current.selectionStart || input.length);
    const newText = `${beforeMention}[Task: ${task.title}] ${afterMention}`;
    
    setInput(newText);
    setMentionOpen(false);
    
    // Focus back and move cursor after the inserted mention
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.selectionStart = beforeMention.length + `[Task: ${task.title}] `.length;
        inputRef.current.selectionEnd = inputRef.current.selectionStart;
      }
    }, 0);
  };

  const handleKeyDown = (e) => {
    if (mentionOpen) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setMentionIndex(prev => Math.min(prev + 1, filteredTasks.length - 1));
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setMentionIndex(prev => Math.max(prev - 1, 0));
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredTasks[mentionIndex]) {
          insertTaskMention(filteredTasks[mentionIndex]);
        }
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setMentionOpen(false);
        return;
      }
    } else {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInput(val);

    // Mention Trigger Logic
    const cursor = e.target.selectionStart;
    const textBeforeCursor = val.slice(0, cursor);
    const wordsBeforeCursor = textBeforeCursor.split(/\s/);
    const currentWord = wordsBeforeCursor[wordsBeforeCursor.length - 1];

    if (currentWord.startsWith('@')) {
      setMentionOpen(true);
      setMentionFilter(currentWord.slice(1));
      setMentionStart(cursor - currentWord.length);
      setMentionIndex(0);
    } else {
      setMentionOpen(false);
    }
  };

  const isEmpty = messages.length === 0 && !isTyping;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100%', overflow: 'hidden', position: 'relative' }}>
      
      {/* Background ambient glow inside chat */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '70%', height: '70%', background: 'radial-gradient(circle, var(--color-surface) 0%, transparent 70%)',
        opacity: 0.5, pointerEvents: 'none', zIndex: 0
      }}/>

      {/* Chat Header */}
      <div className="glass" style={{
        padding: '0 32px',
        height: 'var(--header-h)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--color-border)',
        flexShrink: 0,
        zIndex: 10,
        boxShadow: 'none'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-success)',
              boxShadow: '0 0 12px var(--color-success)', animation: 'pulse-gradient 2s infinite alternate'
            }} />
            <div style={{
              position: 'absolute', width: '20px', height: '20px', borderRadius: '50%',
              border: '1px solid var(--color-success)', opacity: 0.5, animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite'
            }}/>
          </div>
          <h2 style={{ fontSize: '1.1rem', margin: 0, fontFamily: 'var(--font-display)', fontWeight: '600', letterSpacing: '0.02em' }}>
            Neural Link Active
          </h2>
        </div>
        <button
          id="btn-clear-chat"
          onClick={clearChat}
          className="btn btn-ghost btn-sm"
          style={{ fontSize: '0.85rem', color: 'var(--color-danger)', border: '1px solid rgba(255,42,85,0.2)', borderRadius: 'var(--radius-full)' }}
          title="Clear chat history"
        >
           PURGE DATA
        </button>
      </div>

      {/* Messages Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        zIndex: 1,
      }}>
        {isEmpty && (
          <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '40px', textAlign: 'center' }}>
            {/* Welcome */}
            <div style={{ position: 'relative' }}>
              <div style={{ 
                fontSize: '4rem', marginBottom: '24px', filter: 'drop-shadow(var(--glow-primary))',
                animation: 'float 6s infinite alternate'
              }}>⚡</div>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '12px', lineHeight: '1.2' }}>
                System Ready, <br/><span className="text-gradient">Commander</span>
              </h2>
              <p style={{ color: 'var(--color-text-muted)', maxWidth: '460px', lineHeight: '1.6', fontSize: '1.05rem' }}>
                Advanced AI core initialized. Request analysis, construct task matrices, or generate strategic plans.
              </p>
            </div>

            {/* Quick prompts Bento Style */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', width: '100%', maxWidth: '600px' }}>
              {QUICK_PROMPTS.map((p, i) => (
                <button
                  key={i}
                  id={`quick-prompt-${i}`}
                  onClick={() => handleSend(p.text)}
                  className="bento-card btn-ghost animate-slide-up stagger-1"
                  style={{
                    animationDelay: `${i * 0.1}s`,
                    padding: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    color: 'var(--color-text)'
                  }}
                >
                  <span style={{ 
                    fontSize: '1.5rem', color: 'var(--color-accent)',
                    background: 'rgba(0, 240, 255, 0.1)', padding: '10px', borderRadius: '12px'
                  }}>{p.icon}</span>
                  <span style={{ fontSize: '0.95rem', fontWeight: '500', fontFamily: 'var(--font-display)' }}>{p.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <MessageBubble key={msg.id} message={msg} delay={idx % 5} />
        ))}

        {isTyping && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="glass" style={{
        padding: '24px 32px',
        borderTop: '1px solid var(--color-border)',
        flexShrink: 0,
        zIndex: 10,
        boxShadow: '0 -10px 40px rgba(0,0,0,0.3)',
        borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
        position: 'relative'
      }}>
        
        {/* Task Mention Menu Popup */}
        {mentionOpen && (
          <div className="glass-panel animate-slide-up" style={{
            position: 'absolute',
            bottom: '100%',
            left: '32px',
            marginBottom: '8px',
            width: '350px',
            maxHeight: '220px',
            overflowY: 'auto',
            borderRadius: 'var(--radius-lg)',
            padding: '8px',
            boxShadow: 'var(--shadow-lg)'
          }}>
             <div style={{ padding: '8px', fontSize: '0.75rem', color: 'var(--color-text-muted)', borderBottom: '1px solid var(--color-border)', marginBottom: '8px' }}>
                Select a directive to cross-reference
             </div>
             {filteredTasks.length === 0 ? (
               <div style={{ padding: '12px', fontSize: '0.9rem', color: 'var(--color-text-faint)', textAlign: 'center' }}>
                  No active directives found matching "{mentionFilter}"
               </div>
             ) : (
               <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                 {filteredTasks.map((task, idx) => (
                   <button
                     key={task.id}
                     onClick={(e) => { e.preventDefault(); insertTaskMention(task); }}
                     onMouseEnter={() => setMentionIndex(idx)}
                     style={{
                       display: 'flex', alignItems: 'center', gap: '12px',
                       padding: '12px', width: '100%', textAlign: 'left',
                       background: mentionIndex === idx ? 'rgba(138,43,226,0.2)' : 'transparent',
                       border: mentionIndex === idx ? '1px solid rgba(138,43,226,0.5)' : '1px solid transparent',
                       borderRadius: 'var(--radius-sm)',
                       color: 'var(--color-text)',
                       cursor: 'pointer',
                       transition: 'background 0.1s ease',
                     }}
                   >
                     <span style={{ color: 'var(--color-accent)' }}>⚡</span>
                     <span style={{ fontSize: '0.9rem', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                       {task.title}
                     </span>
                   </button>
                 ))}
               </div>
             )}
          </div>
        )}

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          background: 'rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 'var(--radius-lg)',
          padding: '8px 8px 8px 24px',
          transition: 'all var(--bounce)',
          boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.2)'
        }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-primary)';
            e.currentTarget.style.boxShadow = '0 0 20px rgba(138,43,226,0.2), inset 0 2px 10px rgba(0,0,0,0.2)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
            e.currentTarget.style.boxShadow = 'inset 0 2px 10px rgba(0,0,0,0.2)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          {/* Image Preview Area */}
          {selectedImage && (
            <div style={{ position: 'relative', marginBottom: '8px', display: 'inline-block' }}>
              <img src={selectedImage} alt="Preview" style={{ height: '60px', borderRadius: '8px', border: '1px solid var(--color-border)' }} />
              <button
                onClick={removeImage}
                style={{
                  position: 'absolute', top: '-8px', right: '-8px', background: 'var(--color-danger)', 
                  color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', 
                  fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >
                ✕
              </button>
            </div>
          )}
          
          <div style={{ display: 'flex', width: '100%', alignItems: 'flex-end', gap: '16px' }}>
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              style={{ display: 'none' }} 
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn btn-ghost"
              style={{ padding: '12px', borderRadius: '50%', color: 'var(--color-text-muted)' }}
              title="Upload Image"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            </button>
            <textarea
              id="chat-input"
              ref={inputRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type @ to cross-reference tasks..."
            rows={1}
            disabled={sending}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              resize: 'none',
              color: 'var(--color-text)',
              fontFamily: 'var(--font-sans)',
              fontSize: '1rem',
              lineHeight: '1.6',
              padding: '12px 0',
              maxHeight: '160px',
              overflowY: 'auto'
            }}
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px';
            }}
          />
          <button
            id="btn-send-message"
            onClick={() => handleSend()}
            disabled={(!input.trim() && !imagePayload) || sending}
            className="btn btn-primary"
            style={{
              borderRadius: 'var(--radius-lg)',
              padding: '12px 20px',
              alignSelf: 'flex-end',
              minWidth: '60px',
            }}
          >
            {sending ? <span className="spin">⟳</span> : <span style={{ fontSize: '1.2rem'}}>↑</span>}
          </button>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', padding: '0 8px' }}>
           <p style={{ fontSize: '0.75rem', color: 'var(--color-text-faint)', fontFamily: 'var(--font-mono)' }}>
             [ENTER] to submit // [@] reference task
           </p>
           <p style={{ fontSize: '0.75rem', color: 'var(--color-accent)', fontFamily: 'var(--font-mono)', opacity: 0.6 }}>
             SECURE CONNECTION
           </p>
        </div>
      </div>
    </div>
  );
}
