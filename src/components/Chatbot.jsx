import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  MessageCircle, X, Send, Bot, User, Sparkles, RotateCcw,
  ChevronDown, Loader2, Copy, ThumbsUp, ThumbsDown,
  Maximize2, Minimize2, Download, Mic, MicOff, CheckCircle2,
  Star, MessageSquarePlus, AlertCircle, Flag,
} from 'lucide-react';
import { chatWithStudent } from '../api/apiService';

// ── Toast Notification ─────────────────────────────────────────────────────────
const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`fixed bottom-36 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-2 px-4 py-2.5 rounded-full shadow-xl text-sm font-medium animate-slide-up ${
      type === 'success' ? 'bg-green-500 text-white' : 'bg-violet-600 text-white'
    }`}>
      {type === 'success' ? <CheckCircle2 size={15} /> : <Sparkles size={15} />}
      {message}
    </div>
  );
};

// ── Star Rating ────────────────────────────────────────────────────────────────
const StarRating = ({ value, onChange }) => (
  <div className="flex gap-1">
    {[1,2,3,4,5].map(n => (
      <button key={n} onClick={() => onChange(n)}
        className={`transition-all hover:scale-110 ${
          n <= value ? 'text-yellow-400' : 'text-slate-300 dark:text-slate-600'
        }`}>
        <Star size={24} fill={n <= value ? 'currentColor' : 'none'} />
      </button>
    ))}
  </div>
);

// ── Session Feedback Modal ─────────────────────────────────────────────────────
const SessionFeedbackModal = ({ onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!rating) return;
    onSubmit({ rating, comment });
    setSubmitted(true);
    setTimeout(onClose, 1800);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl shadow-2xl p-6 w-80 max-w-[90vw]" onClick={e => e.stopPropagation()}>
        {submitted ? (
          <div className="flex flex-col items-center gap-3 py-4">
            <CheckCircle2 size={40} className="text-green-500" />
            <p className="font-semibold text-foreground">Thanks for your feedback!</p>
            <p className="text-sm text-muted-foreground text-center">Your input helps us improve EduAI 💜</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Star size={16} className="text-yellow-400" /> Rate this session
              </h3>
              <button onClick={onClose} className="p-1 rounded-lg hover:bg-muted text-muted-foreground"><X size={16} /></button>
            </div>
            <p className="text-sm text-muted-foreground mb-3">How helpful was EduAI in this conversation?</p>
            <div className="flex justify-center mb-4"><StarRating value={rating} onChange={setRating} /></div>
            <textarea value={comment} onChange={e => setComment(e.target.value)}
              placeholder="Any additional comments? (optional)"
              rows={3}
              className="w-full text-sm px-3 py-2 rounded-xl border border-border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-violet-500/40 placeholder:text-muted-foreground mb-3" />
            <button onClick={handleSubmit} disabled={!rating}
              className="w-full py-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white text-sm font-medium hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              Submit Feedback
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// ── Negative Feedback Panel ────────────────────────────────────────────────────
const FEEDBACK_REASONS = [
  'Wrong information', 'Not helpful', 'Too vague',
  'Too long', 'Off topic', 'Other',
];

const NegativeFeedbackPanel = ({ onSubmit, onClose }) => {
  const [selected, setSelected] = useState([]);
  const [note, setNote] = useState('');

  const toggle = (r) => setSelected(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]);

  return (
    <div className="mt-1 ml-9 bg-card border border-red-200 dark:border-red-900/50 rounded-xl p-3 shadow-md animate-slide-up max-w-[82%]">
      <p className="text-[11px] font-semibold text-red-500 mb-2 flex items-center gap-1">
        <Flag size={11} /> What was wrong?
      </p>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {FEEDBACK_REASONS.map(r => (
          <button key={r} onClick={() => toggle(r)}
            className={`text-[11px] px-2 py-0.5 rounded-full border transition-all ${
              selected.includes(r)
                ? 'bg-red-500 text-white border-red-500'
                : 'border-border text-muted-foreground hover:border-red-400 hover:text-red-500'
            }`}>{r}</button>
        ))}
      </div>
      <input value={note} onChange={e => setNote(e.target.value)}
        placeholder="Additional note (optional)"
        className="w-full text-[11px] px-2 py-1.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-1 focus:ring-red-400/40 placeholder:text-muted-foreground mb-2" />
      <div className="flex gap-2">
        <button onClick={() => onSubmit(selected, note)}
          className="flex-1 text-[11px] py-1 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors">Submit</button>
        <button onClick={onClose}
          className="flex-1 text-[11px] py-1 rounded-lg border border-border text-muted-foreground hover:bg-muted transition-colors">Cancel</button>
      </div>
    </div>
  );
};

const API_BASE = 'https://sageathon-api.onrender.com';

// ── Prompt Categories ──────────────────────────────────────────────────────────
const PROMPT_CATEGORIES = [
  {
    label: '📊 Performance', prompts: [
      'How am I performing overall?',
      'Which subject needs the most attention?',
      'What is my current risk level?',
    ],
  },
  {
    label: '📚 Study Tips', prompts: [
      'Give me a study schedule for this week',
      'How can I improve my focus while studying?',
      'Suggest a 30-minute study plan for today',
    ],
  },
  {
    label: '🎯 Exam Prep', prompts: [
      'How should I prepare for upcoming exams?',
      'What topics should I prioritize?',
      'How to handle exam stress effectively?',
    ],
  },
  {
    label: '📅 Attendance', prompts: [
      'Tips to improve my attendance',
      'How does attendance affect my grades?',
      'Am I at risk due to low attendance?',
    ],
  },
];

const WELCOME_MESSAGE = {
  id: 'welcome',
  role: 'model',
  text: "Hi! I'm **EduAI Assistant** 👋\n\nI'm your personal AI academic mentor. I can help you:\n- 📊 Understand your academic performance\n- 📚 Build better study habits\n- 🎯 Prepare effectively for exams\n- 💡 Stay motivated and on track\n\nPick a topic below or ask me anything!",
  timestamp: new Date(),
  followUps: [],
  reaction: null,
};

// ── Markdown Renderer ──────────────────────────────────────────────────────────
function renderMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/```([\w]*)\n?([\s\S]*?)```/g, (_m, _l, code) =>
      `<pre class="chat-code"><code>${code.trim().replace(/</g,'&lt;').replace(/>/g,'&gt;')}</code></pre>`)
    .replace(/`([^`\n]+)`/g, '<code class="chat-inline-code">$1</code>')
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^### (.+)$/gm, '<div class="chat-h3">$1</div>')
    .replace(/^## (.+)$/gm, '<div class="chat-h2">$1</div>')
    .replace(/^[-*•] (.+)$/gm, '<div class="chat-li">• $1</div>')
    .replace(/^\d+\. (.+)$/gm, (_m, item) => `<div class="chat-li">▸ ${item}</div>`)
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');
}

// ── Typewriter Text ────────────────────────────────────────────────────────────
function TypewriterText({ text, speed = 5, onDone }) {
  const [displayed, setDisplayed] = useState('');
  const idxRef = useRef(0);
  useEffect(() => {
    idxRef.current = 0;
    setDisplayed('');
    const iv = setInterval(() => {
      idxRef.current++;
      setDisplayed(text.slice(0, idxRef.current));
      if (idxRef.current >= text.length) { clearInterval(iv); if (onDone) onDone(); }
    }, speed);
    return () => clearInterval(iv);
  }, [text]);
  return <div className="chat-markdown" dangerouslySetInnerHTML={{ __html: renderMarkdown(displayed) }} />;
}

// ── Copy Hook ──────────────────────────────────────────────────────────────────
function useCopy() {
  const [copied, setCopied] = useState(false);
  const copy = useCallback((t) => {
    navigator.clipboard.writeText(t).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }).catch(() => {});
  }, []);
  return { copied, copy };
}

// ── Message Bubble ─────────────────────────────────────────────────────────────
const MessageBubble = ({ msg, isLatest, onReact, onFollowUp, onNegativeFeedback }) => {
  const isUser = msg.role === 'user';
  const { copied, copy } = useCopy();
  const [typingDone, setTypingDone] = useState(!isLatest || isUser || !!msg.isLoading);
  const [showNegPanel, setShowNegPanel] = useState(false);

  useEffect(() => {
    if (!isLatest || isUser) setTypingDone(true);
  }, [isLatest, isUser]);

  const handleReactDown = (id) => {
    onReact(id, 'down');
    setShowNegPanel(prev => !prev);
  };

  return (
    <div className={`flex flex-col gap-0 ${isUser ? 'items-end' : 'items-start'}`}>
      <div className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : ''} animate-slide-up w-full`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-md mt-0.5 ${isUser ? 'bg-gradient-to-br from-blue-500 to-indigo-600' : 'bg-gradient-to-br from-violet-500 to-purple-700'}`}>
          {isUser ? <User size={14} className="text-white" /> : <Bot size={14} className="text-white" />}
        </div>

        <div className={`flex flex-col gap-1 max-w-[82%] ${isUser ? 'items-end' : 'items-start'}`}>
          {/* Bubble */}
          <div className={`relative group px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${isUser ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-tr-sm' : 'bg-white dark:bg-slate-800 text-foreground border border-border rounded-tl-sm'}`}>
            {msg.isLoading ? (
              <div className="flex items-center gap-1.5 py-0.5">
                <span className="typing-dot" /><span className="typing-dot" style={{ animationDelay: '0.2s' }} /><span className="typing-dot" style={{ animationDelay: '0.4s' }} />
              </div>
            ) : isUser ? (
              <p className="whitespace-pre-wrap">{msg.text}</p>
            ) : isLatest && !typingDone ? (
              <TypewriterText text={msg.text} speed={5} onDone={() => setTypingDone(true)} />
            ) : (
              <div className="chat-markdown" dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.text) }} />
            )}

            {/* Copy btn */}
            {!isUser && !msg.isLoading && typingDone && (
              <button onClick={() => copy(msg.text)} title="Copy"
                className="absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity bg-slate-100 dark:bg-slate-700 text-muted-foreground hover:text-foreground">
                {copied ? <CheckCircle2 size={12} className="text-green-500" /> : <Copy size={12} />}
              </button>
            )}

            {msg.timestamp && !msg.isLoading && (
              <p className={`text-[10px] mt-1.5 ${isUser ? 'text-blue-200' : 'text-muted-foreground'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
          </div>

          {/* Reactions */}
          {!isUser && !msg.isLoading && typingDone && (
            <div className="flex items-center gap-1 ml-1">
              <button onClick={() => onReact(msg.id, 'up')} title="Helpful"
                className={`p-1 rounded transition-all ${msg.reaction === 'up' ? 'bg-green-100 dark:bg-green-900/40 text-green-600' : 'text-muted-foreground hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'}`}>
                <ThumbsUp size={11} />
              </button>
              <button onClick={() => handleReactDown(msg.id)} title="Not helpful"
                className={`p-1 rounded transition-all ${msg.reaction === 'down' ? 'bg-red-100 dark:bg-red-900/40 text-red-500' : 'text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'}`}>
                <ThumbsDown size={11} />
              </button>
              {msg.reaction === 'up' && (
                <span className="text-[10px] text-green-600 font-medium ml-0.5">Thanks! 🎉</span>
              )}
            </div>
          )}

          {/* Follow-up chips */}
          {!isUser && !msg.isLoading && typingDone && msg.followUps && msg.followUps.length > 0 && (
            <div className="flex flex-wrap gap-1.5 ml-1 mt-0.5">
              {msg.followUps.map((q, i) => (
                <button key={i} onClick={() => onFollowUp(q)}
                  className="text-[11px] px-2.5 py-1 rounded-full border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 hover:bg-violet-500 hover:text-white hover:border-violet-500 transition-all">
                  {q}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Negative Feedback Panel */}
      {showNegPanel && (
        <NegativeFeedbackPanel
          onSubmit={(reasons, note) => {
            onNegativeFeedback(msg.id, reasons, note);
            setShowNegPanel(false);
          }}
          onClose={() => setShowNegPanel(false)}
        />
      )}
    </div>
  );
};

// ── Quick Prompts Panel ────────────────────────────────────────────────────────
const QuickPromptsPanel = ({ onSend }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  return (
    <div className="px-3 pb-3 flex-shrink-0 bg-background border-t border-border">
      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide my-2">
        {PROMPT_CATEGORIES.map((cat, i) => (
          <button key={i} onClick={() => setActiveIdx(i)}
            className={`flex-shrink-0 text-[11px] px-2.5 py-1 rounded-full font-medium transition-all ${activeIdx === i ? 'bg-violet-600 text-white shadow-sm' : 'bg-muted text-muted-foreground hover:bg-violet-100 dark:hover:bg-violet-900/20'}`}>
            {cat.label}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-1">
        {PROMPT_CATEGORIES[activeIdx].prompts.map((p) => (
          <button key={p} onClick={() => onSend(p)}
            className="text-left text-[12px] px-3 py-2 rounded-xl border border-border bg-card hover:border-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 text-foreground hover:text-violet-700 dark:hover:text-violet-300 transition-all">
            {p}
          </button>
        ))}
      </div>
    </div>
  );
};

// ── Main Chatbot ───────────────────────────────────────────────────────────────
const Chatbot = ({ studentId, isOpenExternal, onExternalOpenChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [showPrompts, setShowPrompts] = useState(true);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [toast, setToast] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const scrollRef = useRef(null);
  const recognitionRef = useRef(null);

  // Speech API setup
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    setSpeechSupported(!!SR);
    if (SR) {
      const rec = new SR();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = 'en-US';
      rec.onresult = (e) => setInput(Array.from(e.results).map(r => r[0].transcript).join(''));
      rec.onend = () => setIsListening(false);
      rec.onerror = () => setIsListening(false);
      recognitionRef.current = rec;
    }
  }, []);

  useEffect(() => {
    if (isOpenExternal !== undefined && isOpenExternal !== isOpen) setIsOpen(isOpenExternal);
  }, [isOpenExternal]);

  const setIsOpenAndNotify = (val) => {
    const next = typeof val === 'function' ? val(isOpen) : val;
    setIsOpen(next);
    if (onExternalOpenChange) onExternalOpenChange(next);
  };

  const scrollToBottom = useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
  }, []);

  useEffect(() => {
    if (isOpen) { scrollToBottom(false); setUnreadCount(0); setTimeout(() => inputRef.current?.focus(), 150); }
  }, [isOpen, scrollToBottom]);

  useEffect(() => {
    if (isOpen) scrollToBottom();
    else if (messages.length > 1) setUnreadCount(c => c + 1);
  }, [messages, isOpen, scrollToBottom]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (el) setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 120);
  };

  const toggleVoice = () => {
    if (!recognitionRef.current) return;
    if (isListening) { recognitionRef.current.stop(); }
    else { setIsListening(true); recognitionRef.current.start(); }
  };

  const exportChat = () => {
    const content = messages.filter(m => !m.isLoading)
      .map(m => `[${m.role === 'user' ? 'You' : 'EduAI'}] ${m.text}`).join('\n\n---\n\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eduai-chat-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const sendMessage = useCallback(async (text) => {
    const userText = (text || input).trim();
    if (!userText || isLoading) return;
    setInput('');
    setShowPrompts(false);

    if (!studentId) {
      setMessages(prev => [...prev, {
        id: Date.now() + 2,
        role: 'model',
        text: 'Missing student context. Please log in again before using the chat assistant.',
        timestamp: new Date(),
        followUps: []
      }]);
      return;
    }

    const userMsg = { id: Date.now(), role: 'user', text: userText, timestamp: new Date() };
    const historyForAPI = messages.filter(m => m.id !== 'welcome' && !m.isLoading).map(m => ({ role: m.role, text: m.text }));
    setMessages(prev => [...prev, userMsg]);

    const loadingId = Date.now() + 1;
    setMessages(prev => [...prev, { id: loadingId, role: 'model', isLoading: true }]);
    setIsLoading(true);

    try {
      const data = await chatWithStudent(studentId, userText, historyForAPI);
      const replyText = data.reply || "Sorry, I couldn't get a response. Please try again.";
      const followUps = Array.isArray(data.followUps) ? data.followUps : [];
      setMessages(prev => prev.map(m => m.id === loadingId
        ? { ...m, isLoading: false, text: replyText, timestamp: new Date(), followUps, reaction: null }
        : m));
    } catch {
      setMessages(prev => prev.map(m => m.id === loadingId
        ? { ...m, isLoading: false, text: '⚠️ Network error. Please check your connection and try again.', timestamp: new Date(), followUps: [] }
        : m));
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, studentId]);

  const handleReact = useCallback((id, reaction) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, reaction: m.reaction === reaction ? null : reaction } : m));
    if (reaction === 'up') setToast({ message: 'Thanks for the positive feedback! 🎉', type: 'success' });
  }, []);

  const handleNegativeFeedback = useCallback((msgId, reasons, note) => {
    console.log('Negative feedback:', { msgId, reasons, note });
    setToast({ message: 'Feedback submitted. We\'ll improve! 🙏', type: 'info' });
  }, []);

  const handleSessionFeedback = useCallback(({ rating, comment }) => {
    console.log('Session feedback:', { rating, comment });
    setToast({ message: `Rating submitted: ${'⭐'.repeat(rating)}`, type: 'success' });
  }, []);

  const clearChat = () => { setMessages([WELCOME_MESSAGE]); setUnreadCount(0); setShowPrompts(true); };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const msgCount = messages.filter(m => !m.isLoading && m.id !== 'welcome').length;

  // Panel sizing
  const panelStyle = isExpanded
    ? { position: 'fixed', bottom: '1rem', right: '1rem', width: 'min(860px, calc(100vw - 2rem))', height: 'calc(100vh - 2rem)', zIndex: 50 }
    : { position: 'fixed', bottom: '8rem', right: '1.5rem', width: '375px', maxWidth: 'calc(100vw - 2rem)', height: '560px', zIndex: 50 };

  return (
    <>
      {/* ── FAB ── */}
      <button id="chatbot-fab"
        onClick={() => { setIsOpenAndNotify(o => !o); setUnreadCount(0); }}
        className={`fixed bottom-20 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-slate-700 rotate-90 scale-90' : 'bg-gradient-to-br from-violet-500 to-purple-700 hover:scale-110 hover:shadow-purple-500/40'}`}
        aria-label={isOpen ? 'Close chat' : 'Open AI Chat'}>
        {isOpen ? <X size={22} className="text-white" /> : <MessageCircle size={22} className="text-white" />}
        {!isOpen && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">{unreadCount}</span>
        )}
      </button>

      {/* ── Chat Panel ── */}
      <div style={panelStyle}
        className={`rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${isOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-90 pointer-events-none'}`}>

        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 px-4 py-3 flex items-center gap-3 flex-shrink-0 relative overflow-hidden">
          {/* Animated bg orbs */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-white rounded-full blur-2xl animate-pulse" />
            <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>

          <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 relative">
            <Bot size={18} className="text-white" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white" />
          </div>

          <div className="flex-1 min-w-0 relative">
            <h3 className="text-white font-semibold text-sm flex items-center gap-1.5">
              EduAI Assistant <Sparkles size={13} className="text-yellow-300" />
            </h3>
            <p className="text-white/70 text-[11px]">
              {msgCount > 0 ? `${msgCount} message${msgCount !== 1 ? 's' : ''} · ` : ''}Powered by Gemini AI
            </p>
          </div>

          {/* Header actions */}
          <div className="flex items-center gap-1 relative">
            <button onClick={exportChat} title="Export chat"
              className="p-1.5 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-colors">
              <Download size={14} />
            </button>
            <button onClick={() => setShowSessionModal(true)} title="Rate this session"
              className="p-1.5 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-colors">
              <Star size={14} />
            </button>
            <button onClick={clearChat} title="Clear conversation"
              className="p-1.5 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-colors">
              <RotateCcw size={14} />
            </button>
            <button onClick={() => setIsExpanded(e => !e)} title={isExpanded ? 'Minimize' : 'Expand'}
              className="p-1.5 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-colors">
              {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
            <button onClick={() => setIsOpenAndNotify(false)}
              className="p-1.5 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-colors">
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-4 space-y-4 bg-background relative">
          {messages.map((msg, idx) => (
            <MessageBubble key={msg.id} msg={msg}
              isLatest={idx === messages.length - 1}
              onReact={handleReact}
              onFollowUp={(q) => sendMessage(q)}
              onNegativeFeedback={handleNegativeFeedback} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Scroll btn */}
        {showScrollBtn && (
          <button onClick={() => scrollToBottom()}
            className="absolute bottom-28 right-4 w-8 h-8 rounded-full bg-violet-600 shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform z-10">
            <ChevronDown size={16} />
          </button>
        )}

        {/* Quick Prompts */}
        {showPrompts && messages.length <= 1 && (
          <QuickPromptsPanel onSend={(p) => sendMessage(p)} />
        )}

        {/* Input */}
        <div className="px-3 py-3 border-t border-border bg-card flex-shrink-0">
          <div className="flex items-end gap-2">
            {speechSupported && (
              <button onClick={toggleVoice} title={isListening ? 'Stop listening' : 'Voice input'}
                className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-muted text-muted-foreground hover:bg-violet-100 dark:hover:bg-violet-900/30 hover:text-violet-600'}`}>
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
            )}
            <div className="flex-1 relative">
              <textarea ref={inputRef} id="chatbot-input"
                value={input} onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isListening ? '🎤 Listening…' : 'Ask me anything about your studies…'}
                rows={1} disabled={isLoading}
                className="w-full resize-none text-sm px-3 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all placeholder:text-muted-foreground disabled:opacity-50 max-h-28 overflow-y-auto"
                style={{ lineHeight: '1.5' }} />
              {input.length > 0 && (
                <span className="absolute bottom-1 right-2 text-[10px] text-muted-foreground">{input.length}</span>
              )}
            </div>
            <button id="chatbot-send-btn" onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-white shadow-md hover:shadow-purple-500/30 hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all">
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1.5 text-center">
            Press <kbd className="px-1 py-0.5 rounded bg-muted text-xs font-mono">Enter</kbd> to send · <kbd className="px-1 py-0.5 rounded bg-muted text-xs font-mono">Shift+Enter</kbd> for new line
          </p>
        </div>
      </div>

      {/* Session Feedback Modal */}
      {showSessionModal && (
        <SessionFeedbackModal
          onClose={() => setShowSessionModal(false)}
          onSubmit={handleSessionFeedback}
        />
      )}

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
};

export default Chatbot;
