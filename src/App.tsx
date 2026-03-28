import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Search,
  Home,
  ChevronDown,
  Youtube,
  Instagram,
  MessageSquare,
  X,
  Send,
  ArrowUp,
  Menu,
  User,
  ExternalLink,
  FileText,
  Phone,
  Mail,
  MapPin,
  Clock,
  AlertCircle,
  ChevronRight,
  BookOpen,
  Link2,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { API_BASE_URL } from './config';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────
interface Source {
  rank: number;
  score: number | null;
  text_preview: string;
  file_name: string;
  url: string;
}

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  time: string;
  sources?: Source[];
  isError?: boolean;
  isLoading?: boolean;
}

// ─────────────────────────────────────────────────────────────
// QUICK SUGGESTIONS
// ─────────────────────────────────────────────────────────────
const SUGGESTIONS = [
  '🎓 How do I register for online admission?',
  '📋 What professional courses does ACPC manage?',
  '🏛️ How can I search for institutes by district?',
  '📄 Where can I find the DDCET syllabus?',
  '📅 What are the important admission dates?',
  '📞 How do I contact ACPC helpdesk?',
];

// ─────────────────────────────────────────────────────────────
// SOURCE CARD
// ─────────────────────────────────────────────────────────────
const SourceCard = ({ source, index }: { source: Source; index: number }) => {
  const [expanded, setExpanded] = useState(false);
  const hasUrl = source.url && source.url !== 'N/A';

  return (
    <div className="source-card group">
      <button
        onClick={() => setExpanded(!expanded)}
        className="source-card-header"
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="source-rank">{index + 1}</span>
          <span className="source-filename truncate">{source.file_name}</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {source.score !== null && (
            <span className="source-score">{(source.score * 100).toFixed(0)}%</span>
          )}
          <ChevronRight
            size={14}
            className={`text-acpc-blue/50 transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}
          />
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="source-preview">{source.text_preview}</div>
            {hasUrl && (
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="source-link"
                onClick={(e) => e.stopPropagation()}
              >
                <Link2 size={12} />
                View Document
                <ExternalLink size={11} className="ml-auto opacity-60" />
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// MESSAGE BUBBLE
// ─────────────────────────────────────────────────────────────
const MessageBubble = ({ msg }: { msg: Message }) => {
  const isBot = msg.sender === 'bot';
  const hasSources = isBot && msg.sources && msg.sources.length > 0;
  const [showSources, setShowSources] = useState(false);

  return (
    <div className={`flex gap-2.5 ${isBot ? '' : 'flex-row-reverse ml-auto max-w-[88%]'}`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-1 shadow-sm
          ${isBot ? 'bot-avatar-gradient' : 'bg-acpc-blue text-white'}`}
      >
        {isBot ? '🏛️' : <User size={14} />}
      </div>

      <div className={`flex flex-col gap-1 ${isBot ? 'max-w-[88%]' : ''}`}>
        {/* Bubble */}
        <div
          className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm
            ${isBot
              ? msg.isError
                ? 'bg-red-50 text-red-800 border border-red-200 rounded-tl-none'
                : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
              : 'user-bubble-gradient text-white rounded-tr-none'
            }`}
        >
          {msg.isLoading ? (
            <div className="flex gap-1.5 py-1">
              <div className="typing-dot" />
              <div className="typing-dot" style={{ animationDelay: '0.2s' }} />
              <div className="typing-dot" style={{ animationDelay: '0.4s' }} />
            </div>
          ) : msg.isError ? (
            <div className="flex items-start gap-2">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5 text-red-500" />
              <span>{msg.text}</span>
            </div>
          ) : (
            <div
              className="chat-response-text"
              dangerouslySetInnerHTML={{ __html: msg.text }}
            />
          )}
        </div>

        {/* Sources toggle */}
        {hasSources && (
          <div className="flex flex-col gap-1.5 mt-1">
            <button
              onClick={() => setShowSources(!showSources)}
              className="sources-toggle-btn"
            >
              <BookOpen size={12} />
              {showSources ? 'Hide' : 'View'} {msg.sources!.length} source{msg.sources!.length > 1 ? 's' : ''}
              <ChevronRight
                size={12}
                className={`ml-auto transition-transform duration-200 ${showSources ? 'rotate-90' : ''}`}
              />
            </button>
            <AnimatePresence>
              {showSources && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden flex flex-col gap-1.5"
                >
                  {msg.sources!.map((src, i) => (
                    <SourceCard key={i} source={src} index={i} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        <span className={`text-[10px] text-gray-400 px-1 ${!isBot ? 'text-right' : ''}`}>
          {msg.time}
        </span>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// CHAT BOT PANEL
// ─────────────────────────────────────────────────────────────
const ChatBot = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (o: boolean) => void;
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      text: "Namaste! 🙏 I'm <strong>ACPC Assist</strong>, the official AI support assistant for the Admission Committee for Professional Courses, Gujarat. I can answer questions about admissions, courses, institutes, eligibility, fees, schedules, and more — all based on official ACPC documents.",
      sender: 'bot',
      time: 'Just now',
    },
    {
      id: 'welcome-2',
      text: 'Please select a common question below or type your own query in English or Gujarati.',
      sender: 'bot',
      time: 'Just now',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isQuerying, setIsQuerying] = useState(false);
  const [apiStatus, setApiStatus] = useState<'unknown' | 'ok' | 'error'>('unknown');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ── Check backend health on open ──
  useEffect(() => {
    if (!isOpen || apiStatus !== 'unknown') return;
    fetch(`${API_BASE_URL}/health`)
      .then((r) => (r.ok ? setApiStatus('ok') : setApiStatus('error')))
      .catch(() => setApiStatus('error'));
  }, [isOpen, apiStatus]);

  // ── Auto-scroll ──
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Auto-resize textarea ──
  const resizeTextarea = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
  }, []);

  const now = () =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // ── Format bot HTML response ──
  const formatResponse = (text: string): string => {
    if (!text) return '';
    return text
      // Bold **text**
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Numbered lists
      .replace(/^\d+\.\s+(.+)$/gm, '<li class="ml-4 list-decimal">$1</li>')
      // Bullet lists
      .replace(/^[-•]\s+(.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
      // Wrap consecutive <li> items
      .replace(/(<li.*<\/li>\n?)+/g, (m) => `<ul class="space-y-1 my-2">${m}</ul>`)
      // Line breaks
      .replace(/\n{2,}/g, '</p><p class="mt-2">')
      .replace(/\n/g, '<br/>');
  };

  // ── Send query to FastAPI ──
  const handleSend = async (text: string) => {
    const q = text.trim();
    if (!q || isQuerying) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      text: q,
      sender: 'user',
      time: now(),
    };

    const loadingId = `b-${Date.now() + 1}`;
    const loadingMsg: Message = {
      id: loadingId,
      text: '',
      sender: 'bot',
      time: now(),
      isLoading: true,
    };

    setMessages((prev) => [...prev, userMsg, loadingMsg]);
    setInputValue('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setIsQuerying(true);

    try {
      const res = await fetch(`${API_BASE_URL}/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q }),
      });

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }

      const data = await res.json();

      const botMsg: Message = {
        id: loadingId,
        text: formatResponse(data.answer ?? 'No answer returned.'),
        sender: 'bot',
        time: now(),
        sources: data.sources ?? [],
      };

      setMessages((prev) => prev.map((m) => (m.id === loadingId ? botMsg : m)));
    } catch (err: any) {
      const errMsg: Message = {
        id: loadingId,
        text:
          'I'm currently unable to reach the ACPC knowledge base. Please check your connection or try again in a moment. For urgent queries, contact ACPC directly at +91-79-26566000.',
        sender: 'bot',
        time: now(),
        isError: true,
      };
      setMessages((prev) => prev.map((m) => (m.id === loadingId ? errMsg : m)));
    } finally {
      setIsQuerying(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(inputValue);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        text: "Chat cleared. How can I help you with ACPC admissions today?",
        sender: 'bot',
        time: now(),
      },
    ]);
  };

  return (
    <div className="chat-panel-container flex flex-col h-full w-full">
      {/* ── Header ── */}
      <div className="chat-header-gradient p-4 text-white flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bot-avatar-gradient w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-md">
            🏛️
          </div>
          <div>
            <div className="font-bold text-sm">ACPC Assist — Official Support</div>
            <div className="text-[10px] flex items-center gap-1.5">
              {apiStatus === 'ok' && (
                <>
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-green-300">Knowledge base connected</span>
                </>
              )}
              {apiStatus === 'error' && (
                <>
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                  <span className="text-red-300">Backend offline</span>
                </>
              )}
              {apiStatus === 'unknown' && (
                <span className="text-white/50">Connecting…</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={clearChat}
            title="Clear chat"
            className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
          >
            <RefreshCw size={16} />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* ── Disclaimer banner ── */}
      <div className="disclaimer-banner">
        <AlertCircle size={12} className="flex-shrink-0 mt-0.5" />
        <span>
          Responses are based on official ACPC documents. Always verify critical
          information on{' '}
          <a
            href="https://acpc.gujarat.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-semibold"
          >
            acpc.gujarat.gov.in
          </a>
          .
        </span>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f0f4fb] chat-messages-scrollbar">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Quick suggestions (shown until user sends 2+ msgs) ── */}
      {messages.filter((m) => m.sender === 'user').length < 2 && (
        <div className="p-3 bg-[#e8eef8] border-t border-gray-200">
          <div className="text-[10px] font-bold text-acpc-blue/50 uppercase tracking-widest mb-2">
            Common Questions
          </div>
          <div className="flex flex-col gap-1.5">
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                onClick={() => handleSend(s)}
                disabled={isQuerying}
                className="suggestion-chip"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Input ── */}
      <div className="p-3 bg-white border-t border-gray-100 flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            resizeTextarea();
          }}
          onKeyDown={handleKeyDown}
          placeholder="Ask about admissions, courses, institutes…"
          disabled={isQuerying}
          className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm outline-none focus:border-acpc-blue focus:bg-white transition-all resize-none max-h-32 disabled:opacity-60"
          rows={1}
        />
        <button
          onClick={() => handleSend(inputValue)}
          disabled={isQuerying || !inputValue.trim()}
          className="w-11 h-11 bg-acpc-blue text-white rounded-xl flex items-center justify-center shadow-md hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isQuerying ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Send size={18} />
          )}
        </button>
      </div>

      {/* ── Footer ── */}
      <div className="chat-footer">
        Powered by ACPC Gujarat Knowledge Base · Official documents only
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// WEBSITE COMPONENTS (unchanged visual structure, minor polish)
// ─────────────────────────────────────────────────────────────
const TopBar = () => (
  <div className="top-bar-area py-2 text-white">
    <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2">
      <div className="flex-1" />
      <a
        href="https://gujacpc.admissions.nic.in/"
        className="text-acpc-yellow hover:text-white underline text-sm md:text-base font-bold text-center"
      >
        CLICK HERE FOR ONLINE ADMISSION REGISTRATION
      </a>
      <div className="flex items-center gap-4">
        <span className="text-acpc-yellow text-sm hidden sm:inline">Stay Updated</span>
        <div className="flex gap-2">
          <a href="#" className="hover:opacity-80 transition-opacity">
            <Youtube size={20} className="text-white" />
          </a>
          <a href="#" className="hover:opacity-80 transition-opacity">
            <Instagram size={20} className="text-white" />
          </a>
        </div>
      </div>
    </div>
  </div>
);

const Header = () => (
  <div className="bg-[#f6f3ee] py-4 border-b border-gray-200">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-shrink-0">
          <div className="w-20 h-20 bg-acpc-blue rounded-full flex items-center justify-center text-white font-bold text-2xl">
            ACPC
          </div>
        </div>
        <div className="text-center flex-1">
          <h2 className="text-acpc-blue font-bold text-lg md:text-xl lg:text-2xl mb-1">
            અડમિશન કમિટી ફોર પ્રોફેશનલ કોર્સીસ (ACPC), ગુજરાત
          </h2>
          <h1 className="text-acpc-blue font-bold text-xl md:text-2xl lg:text-3xl">
            Admission Committee for Professional Courses (ACPC), Gujarat
          </h1>
        </div>
        <div className="flex-shrink-0 hidden lg:block">
          <div className="w-20 h-20 border-2 border-acpc-blue rounded-lg flex items-center justify-center text-acpc-blue font-bold">
            GTERS
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuItems = [
    { name: 'Home', icon: <Home size={16} />, href: '#' },
    { name: 'Courses', hasSub: true, href: '#' },
    { name: 'About Us', hasSub: true, href: '#' },
    { name: 'Help Desk', href: '#' },
    { name: 'Rules', hasSub: true, href: '#' },
    { name: 'Circulars', href: '#' },
    { name: 'Archives', hasSub: true, href: '#' },
    { name: 'Institute Login', hasSub: true, href: '#' },
    { name: 'Candidate Login', href: '#' },
    { name: 'Contact Us', href: '#' },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center lg:justify-center h-14">
          <button
            className="lg:hidden p-2 text-acpc-blue"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu size={24} />
          </button>
          <ul className="hidden lg:flex items-center gap-1 h-full">
            {menuItems.map((item, idx) => (
              <li key={idx} className="h-full group relative">
                <a
                  href={item.href}
                  className="flex items-center gap-1 px-3 h-full text-acpc-blue font-semibold text-sm hover:bg-gray-100 transition-colors"
                >
                  {item.icon}
                  {item.name}
                  {item.hasSub && <ChevronDown size={14} />}
                </a>
                {item.hasSub && (
                  <div className="absolute top-full left-0 w-48 bg-white shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border-t-2 border-acpc-blue">
                    <ul className="py-2">
                      <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-700">
                        Sub Item 1
                      </li>
                      <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-700">
                        Sub Item 2
                      </li>
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-white border-t overflow-hidden"
          >
            <ul className="py-2">
              {menuItems.map((item, idx) => (
                <li key={idx}>
                  <a
                    href={item.href}
                    className="flex items-center justify-between px-6 py-3 text-acpc-blue font-semibold border-b border-gray-50"
                  >
                    <span className="flex items-center gap-2">
                      {item.icon}
                      {item.name}
                    </span>
                    {item.hasSub && <ChevronDown size={16} />}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => (
  <div className="relative h-[300px] md:h-[450px] overflow-hidden">
    <img
      src="https://raw.githubusercontent.com/Pruthil-2910/ACPC_UI/46e9f3bfdd9b984d82557a58b94bc03d7ceb6fdf/display-011652795026.jpg"
      alt="ACPC Hero"
      className="w-full h-full object-cover"
      referrerPolicy="no-referrer"
    />
  </div>
);

const SearchSection = () => (
  <div className="py-12 bg-white">
    <div className="container mx-auto px-4">
      <div className="max-w-4xl">
        <h3 className="text-2xl font-bold text-acpc-blue mb-6">Institute Search</h3>
        <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['Program', 'Branch', 'Institute Type', 'District'].map((label) => (
              <div key={label} className="space-y-2">
                <label className="text-sm font-semibold text-gray-600">{label}</label>
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-acpc-blue outline-none transition-all">
                  <option>Select {label}</option>
                </select>
              </div>
            ))}
          </div>
          <button className="mt-6 bg-acpc-yellow hover:bg-acpc-blue hover:text-white text-acpc-blue font-bold py-3 px-8 rounded-lg transition-all shadow-md">
            Search Institutes
          </button>
        </div>
      </div>
    </div>
  </div>
);

const CircularsSection = () => {
  const circulars = [
    'Important information for parents and students regarding admission',
    'DDCET Syllabus Engineering 2025',
    'DDCET Syllabus Pharmacy 2025',
    'DDCET GR Gujarati',
    'DDCET GR English',
    'Information Regarding fees determined by FRC',
  ];
  const news = [
    'Corrigendum of EoI for Banking Services',
    'Invitation for Expression of Interest (EOI) for banking services',
    'Admission process Dos and Don'ts',
    'Advertisement for inviting Expression of Interest',
    'Change in Venue for ACPC Awareness Seminar',
  ];
  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
            {[{ title: 'Circulars', icon: <FileText size={20} />, items: circulars }, { title: 'Latest News', icon: <MessageSquare size={20} />, items: news }].map(
              ({ title, icon, items }) => (
                <div key={title} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-xl font-bold text-acpc-blue mb-4 flex items-center gap-2">
                    {icon} {title}
                  </h3>
                  <ul className="space-y-3">
                    {items.map((item, i) => (
                      <li key={i} className="flex gap-2 text-sm text-gray-700 hover:text-acpc-blue cursor-pointer group">
                        <span className="text-acpc-yellow">▶</span>
                        <span className="group-hover:underline">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            )}
          </div>
          <div className="bg-acpc-blue text-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold mb-4">Available Courses</h3>
            <ul className="space-y-2">
              {['BE/B.TECH', 'Deg./Dip. Pharmacy', 'DDCET', 'D to D Engineering', 'D to D Pharmacy', 'B.Arch', 'B.Plan', 'B.I.D & B.C.T', 'MBA/MCA'].map(
                (course, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm hover:text-acpc-yellow cursor-pointer transition-colors">
                    <ExternalLink size={14} /> {course}
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const Footer = () => (
  <footer className="bg-acpc-light-blue text-white">
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <h4 className="text-acpc-yellow font-bold mb-4">Contact Us</h4>
          <div className="space-y-3 text-sm opacity-90">
            <p className="flex gap-2">
              <MapPin size={18} className="flex-shrink-0" /> Admission Building, Nr. Library,
              L. D. College of Engg. Campus, Ahmedabad 380015
            </p>
            <p className="flex gap-2">
              <Phone size={18} className="flex-shrink-0" /> +91-79-26566000
            </p>
            <p className="flex gap-2">
              <Mail size={18} className="flex-shrink-0" /> acpc@gujarat.gov.in
            </p>
          </div>
        </div>
        {[
          {
            title: 'Important Links',
            links: ['Online Admission Process', 'Fee Regulatory Committee', 'Director of Technical Education', 'MYSY Scholarship'],
          },
          {
            title: 'Portals',
            links: ['AICTE, New Delhi', 'Pharmacy Council of India', 'Council of Architecture', 'Digital Gujarat Portal'],
          },
          {
            title: 'Support',
            links: ['Grievance Cell', 'RTI Disclaimer', 'Privacy Policy'],
          },
        ].map(({ title, links }) => (
          <div key={title}>
            <h4 className="text-acpc-yellow font-bold mb-4">{title}</h4>
            <ul className="space-y-2 text-sm opacity-90">
              {links.map((l) => (
                <li key={l} className="hover:text-acpc-yellow cursor-pointer">
                  {l}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
    <div className="bg-acpc-yellow py-4">
      <div className="container mx-auto px-4 text-center text-acpc-blue font-bold text-sm">
        &copy; 2026 All rights reserved by ACPC Gujarat
      </div>
    </div>
  </footer>
);

// ─────────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────────
export default function App() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current)
        setShowBackToTop(scrollContainerRef.current.scrollTop > 400);
    };
    const c = scrollContainerRef.current;
    c?.addEventListener('scroll', handleScroll);
    return () => c?.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden font-sans text-gray-900 bg-white">
      {/* Website panel */}
      <div
        ref={scrollContainerRef}
        className="flex-1 flex flex-col overflow-y-auto transition-all duration-500 ease-in-out custom-scrollbar"
      >
        <TopBar />
        <Header />
        <Navbar />
        <main className="flex-1">
          <Hero />
          <SearchSection />
          <CircularsSection />
          <div className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                {[
                  { icon: <FileText size={32} />, title: 'Admission Rules', desc: 'Detailed guidelines and eligibility criteria for all professional courses.' },
                  { icon: <Clock size={32} />, title: 'Key Dates', desc: 'Stay updated with the latest admission schedules and deadlines.' },
                  { icon: <Phone size={32} />, title: '24/7 AI Support', desc: 'Our AI assistant answers queries from official ACPC documents instantly.' },
                ].map(({ icon, title, desc }) => (
                  <div key={title} className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="w-16 h-16 bg-acpc-blue/10 text-acpc-blue rounded-full flex items-center justify-center mx-auto mb-6">
                      {icon}
                    </div>
                    <h4 className="text-xl font-bold mb-3">{title}</h4>
                    <p className="text-gray-600 text-sm">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>

      {/* Chat panel */}
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden border-l border-gray-200 bg-white flex flex-col
          ${isChatOpen ? 'w-full md:w-[420px]' : 'w-0 border-l-0'}`}
      >
        {isChatOpen && <ChatBot isOpen={isChatOpen} setIsOpen={setIsChatOpen} />}
      </div>

      {/* FAB — only when chat is closed */}
      <AnimatePresence>
        {!isChatOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsChatOpen(true)}
            className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-acpc-blue text-white shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-[100]"
          >
            <div className="absolute -top-1 -right-1 bg-acpc-yellow text-acpc-blue text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
              AI
            </div>
            <MessageSquare size={28} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Back to top */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`fixed bottom-6 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-50 w-12 h-12 bg-acpc-yellow text-acpc-blue ${isChatOpen ? 'right-[436px]' : 'right-24'}`}
          >
            <ArrowUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
