import React, { useState, useEffect, useRef } from 'react';
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
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  time: string;
}

// --- Mock Data ---
const BOT_REPLIES: Record<string, string> = {
  register: 'To register for online admission:<br/><br/>1. Visit <a href="https://gujacpc.admissions.nic.in/" target="_blank" class="text-acpc-blue font-bold underline">gujacpc.admissions.nic.in</a><br/>2. Create a new candidate account<br/>3. Fill in your personal & academic details<br/>4. Upload required documents<br/>5. Pay the registration fee online<br/><br/>Keep your <strong>HSC/SSC marksheet</strong> and a valid email ID ready.',
  courses: 'ACPC manages admissions for the following professional courses:<br/><br/>📐 <strong>After HSC:</strong> BE/B.Tech, Degree/Diploma Pharmacy, B.Arch, B.Plan, B.I.D & B.C.T, Hotel & Tourism Management<br/><br/>🎓 <strong>After Graduation:</strong> ME/M.Tech, M.Pharm, MBA/MCA, M.Arch, M.Plan<br/><br/>🔁 <strong>Lateral Entry:</strong> D to D Engineering & Pharmacy<br/><br/>Explore all from the <strong>Courses</strong> menu above.',
  institute: 'To find institutes by district, use the <strong>Institute Search form</strong> on this page:<br/><br/>1. Select your Program (e.g. B.E./B.Tech)<br/>2. Choose Branch (optional)<br/>3. Select Institute Type<br/>4. Pick your District<br/>5. Click <strong>Search</strong><br/><br/>You will see a full list of ACPC-affiliated institutes in that district.',
  ddcet: 'DDCET syllabus documents are available for download:<br/><br/>📘 <a href="#" class="text-acpc-blue font-semibold underline">DDCET Syllabus — Engineering</a><br/>💊 <a href="#" class="text-acpc-blue font-semibold underline">DDCET Syllabus — Pharmacy</a><br/><br/>You can also find them under the <strong>Circulars</strong> section of this website.',
  contact: 'You can reach ACPC through:<br/><br/>📍 <strong>Address:</strong> Admission Building, Nr. Library, L. D. College of Engg. Campus, Ahmedabad 380015<br/>📞 <strong>Phone:</strong> +91-79-26566000<br/>📧 <strong>Email:</strong> acpc@gujarat.gov.in<br/>🌐 <strong>Helpdesk:</strong> <a href="#" class="text-acpc-blue font-semibold underline">Visit Help Desk page</a><br/><br/>Office hours: Monday–Friday, 10:30 AM to 6:00 PM.'
};

const SUGGESTIONS = [
  { id: 'register', text: '🎓 How do I register for online admission?' },
  { id: 'courses', text: '📋 What courses does ACPC offer?' },
  { id: 'institute', text: '🏛️ How can I find institutes by district?' },
  { id: 'ddcet', text: '📄 Where can I find DDCET syllabus?' },
  { id: 'contact', text: '📞 How do I contact ACPC helpdesk?' }
];

// --- Components ---

const TopBar = () => (
  <div className="top-bar-area py-2 text-white">
    <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2">
      <div className="flex-1"></div>
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
                      <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-700">Sub Item 1</li>
                      <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-700">Sub Item 2</li>
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mobile Menu */}
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
                  <a href={item.href} className="flex items-center justify-between px-6 py-3 text-acpc-blue font-semibold border-b border-gray-50">
                    <span className="flex items-center gap-2">{item.icon}{item.name}</span>
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
    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
      <div className="text-center text-white px-4">
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 drop-shadow-lg">
          Welcome to ACPC Gujarat
        </h2>
        <p className="text-lg md:text-xl max-w-2xl mx-auto drop-shadow-md">
          Empowering students through transparent and merit-based professional admissions.
        </p>
      </div>
    </div>
  </div>
);

const SearchSection = () => (
  <div className="py-12 bg-white">
    <div className="container mx-auto px-4">
      <div className="max-w-4xl">
        <h3 className="text-2xl font-bold text-acpc-blue mb-6">Institute Search</h3>
        <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600">Program</label>
              <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-acpc-blue outline-none transition-all">
                <option>Select Program</option>
                <option>B.E./ B.Tech</option>
                <option>DEGREE PHARMACY</option>
                <option>DIPLOMA PHARMACY</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600">Branch</label>
              <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-acpc-blue outline-none transition-all">
                <option>Select Branch</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600">Institute Type</label>
              <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-acpc-blue outline-none transition-all">
                <option>Institute Type</option>
                <option>PVT</option>
                <option>Govt/GIA</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600">District</label>
              <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-acpc-blue outline-none transition-all">
                <option>Select District</option>
                <option>Ahmedabad</option>
                <option>Rajkot</option>
                <option>Surat</option>
              </select>
            </div>
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
    "Important information for parents and students regarding admission",
    "DDCET Syllabus Engineering 2025",
    "DDCET Syllabus Pharmacy 2025",
    "DDCET GR Gujarati",
    "DDCET GR English",
    "Information Regarding fees determined by FRC"
  ];

  const news = [
    "Corrigendum of EoI for Banking Services",
    "Invitation for Expression of Interest (EOI) for banking services",
    "Admission process Dos and Don'ts",
    "Advertisement for inviting Expression of Interest",
    "Change in Venue for ACPC Awareness Seminar"
  ];

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-acpc-blue mb-4 flex items-center gap-2">
                <FileText size={20} /> Circulars
              </h3>
              <ul className="space-y-3">
                {circulars.map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-700 hover:text-acpc-blue cursor-pointer group">
                    <span className="text-acpc-yellow">▶</span>
                    <span className="group-hover:underline">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-acpc-blue mb-4 flex items-center gap-2">
                <MessageSquare size={20} /> Latest News
              </h3>
              <ul className="space-y-3">
                {news.map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-700 hover:text-acpc-blue cursor-pointer group">
                    <span className="text-acpc-yellow">▶</span>
                    <span className="group-hover:underline">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="bg-acpc-blue text-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold mb-4">Available Courses</h3>
            <ul className="space-y-2">
              {[
                "BE/B.TECH", "Deg./Dip. Pharmacy", "DDCET", "D to D Engineering",
                "D to D Pharmacy", "B.Arch", "B.Plan", "B.I.D & B.C.T", "MBA/MCA"
              ].map((course, i) => (
                <li key={i} className="flex items-center gap-2 text-sm hover:text-acpc-yellow cursor-pointer transition-colors">
                  <ExternalLink size={14} /> {course}
                </li>
              ))}
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
            <p className="flex gap-2"><MapPin size={18} className="flex-shrink-0" /> Admission Building, Nr. Library, L. D. College of Engg. Campus, Ahmedabad 380015</p>
            <p className="flex gap-2"><Phone size={18} className="flex-shrink-0" /> +91-79-26566000</p>
            <p className="flex gap-2"><Mail size={18} className="flex-shrink-0" /> acpc@gujarat.gov.in</p>
          </div>
        </div>
        <div>
          <h4 className="text-acpc-yellow font-bold mb-4">Important Links</h4>
          <ul className="space-y-2 text-sm opacity-90">
            <li className="hover:text-acpc-yellow cursor-pointer">Online Admission Process</li>
            <li className="hover:text-acpc-yellow cursor-pointer">Fee Regulatory Committee</li>
            <li className="hover:text-acpc-yellow cursor-pointer">Director of Technical Education</li>
            <li className="hover:text-acpc-yellow cursor-pointer">MYSY Scholarship</li>
          </ul>
        </div>
        <div>
          <h4 className="text-acpc-yellow font-bold mb-4">Portals</h4>
          <ul className="space-y-2 text-sm opacity-90">
            <li className="hover:text-acpc-yellow cursor-pointer">AICTE, New Delhi</li>
            <li className="hover:text-acpc-yellow cursor-pointer">Pharmacy Council of India</li>
            <li className="hover:text-acpc-yellow cursor-pointer">Council of Architecture</li>
            <li className="hover:text-acpc-yellow cursor-pointer">Digital Gujarat Portal</li>
          </ul>
        </div>
        <div>
          <h4 className="text-acpc-yellow font-bold mb-4">Support</h4>
          <ul className="space-y-2 text-sm opacity-90">
            <li className="hover:text-acpc-yellow cursor-pointer">Grievance Cell</li>
            <li className="hover:text-acpc-yellow cursor-pointer">RTI Disclaimer</li>
            <li className="hover:text-acpc-yellow cursor-pointer">Privacy Policy</li>
          </ul>
        </div>
      </div>
    </div>
    <div className="bg-acpc-yellow py-4">
      <div className="container mx-auto px-4 text-center text-acpc-blue font-bold text-sm">
        &copy; 2026 All right reserved by ACPC Gujarat
      </div>
    </div>
  </footer>
);

const ChatBot = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (o: boolean) => void }) => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      text: "👋 Hello! I'm <strong>Ask Ally</strong>, the ACPC support assistant. I'm here to help you with all admission-related queries for Gujarat's professional courses.", 
      sender: 'bot', 
      time: 'Just now' 
    },
    { 
      id: '2', 
      text: "Pick a question below or type your own to get started.", 
      sender: 'bot', 
      time: 'Just now' 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Mock bot response
    setTimeout(() => {
      setIsTyping(false);
      const botReplyText = getBotReply(text);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: botReplyText,
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    }, 1000 + Math.random() * 1000);
  };

  const getBotReply = (text: string) => {
    const l = text.toLowerCase();
    if (l.includes('register') || l.includes('online admission') || l.includes('apply')) return BOT_REPLIES.register;
    if (l.includes('course') || l.includes('programme') || l.includes('offer')) return BOT_REPLIES.courses;
    if (l.includes('institute') || l.includes('district') || l.includes('college') || l.includes('find')) return BOT_REPLIES.institute;
    if (l.includes('ddcet') || l.includes('syllabus')) return BOT_REPLIES.ddcet;
    if (l.includes('contact') || l.includes('helpdesk') || l.includes('phone') || l.includes('email')) return BOT_REPLIES.contact;
    
    return "Thank you for your query! For detailed information, please visit our <strong>Help Desk</strong> page or call <strong>+91-79-26566000</strong> during office hours.";
  };

  return (
    <>
      {/* Toggle Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-acpc-blue text-white shadow-2xl flex items-center justify-center transition-all hover:scale-110 z-[100]"
        >
          <div className="absolute -top-1 -right-1 bg-acpc-yellow text-acpc-blue text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">1</div>
          <MessageSquare size={28} />
        </button>
      )}

      {/* Chat Panel Content (rendered inside the parent flex container) */}
      <div className="chat-panel-container flex flex-col h-full w-full">
        {/* Header */}
        <div className="chat-header-gradient p-4 text-white flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="bot-avatar-gradient w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-md">🤖</div>
            <div>
              <div className="font-bold text-sm font-display">Ask Ally — ACPC Support</div>
              <div className="text-[10px] flex items-center gap-1 text-green-300">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Online &middot; Replies instantly
              </div>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f0f4fb] chat-messages-scrollbar">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-2 max-w-[90%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-1 shadow-sm ${msg.sender === 'bot' ? 'bot-avatar-gradient' : 'bg-acpc-blue text-white'}`}>
                {msg.sender === 'bot' ? '🤖' : <User size={14} />}
              </div>
              <div className="flex flex-col gap-1">
                <div 
                  className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.sender === 'bot' ? 'bg-white text-gray-800 rounded-tl-none border border-gray-100' : 'user-bubble-gradient text-white rounded-tr-none'}`}
                  dangerouslySetInnerHTML={{ __html: msg.text }}
                />
                <span className={`text-[10px] text-gray-400 px-1 ${msg.sender === 'user' ? 'text-right' : ''}`}>{msg.time}</span>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-2 max-w-[90%]">
              <div className="w-8 h-8 rounded-full bot-avatar-gradient flex items-center justify-center text-xs flex-shrink-0 mt-1 shadow-sm">🤖</div>
              <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm">
                <div className="flex gap-1.5 py-1">
                  <div className="typing-dot"></div>
                  <div className="typing-dot" style={{ animationDelay: '0.2s' }}></div>
                  <div className="typing-dot" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        {messages.length < 5 && (
          <div className="p-3 bg-[#e4ecf8] border-t border-gray-100">
            <div className="text-[10px] font-bold text-acpc-blue/60 uppercase tracking-widest mb-2">Frequently Asked</div>
            <div className="flex flex-col gap-2">
              {SUGGESTIONS.map((s) => (
                <button 
                  key={s.id}
                  onClick={() => handleSend(s.text)}
                  className="suggestion-chip"
                >
                  {s.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-3 bg-white border-t border-gray-100 flex items-end gap-2">
          <textarea 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend(inputValue);
              }
            }}
            placeholder="Type your question here..."
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm outline-none focus:border-acpc-blue focus:bg-white transition-all resize-none max-h-32"
            rows={1}
          />
          <button 
            onClick={() => handleSend(inputValue)}
            className="w-11 h-11 bg-acpc-blue text-white rounded-xl flex items-center justify-center shadow-md hover:opacity-90 transition-opacity"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </>
  );
};

// --- Main App ---

export default function App() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        setShowBackToTop(scrollContainerRef.current.scrollTop > 400);
      }
    };
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <div className="flex h-screen overflow-hidden font-sans text-gray-900 bg-white">
      {/* Website Panel */}
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
          
          {/* Additional Info Section */}
          <div className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="w-16 h-16 bg-acpc-blue/10 text-acpc-blue rounded-full flex items-center justify-center mx-auto mb-6">
                    <FileText size={32} />
                  </div>
                  <h4 className="text-xl font-bold mb-3">Admission Rules</h4>
                  <p className="text-gray-600 text-sm">Detailed guidelines and eligibility criteria for all professional courses.</p>
                </div>
                <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="w-16 h-16 bg-acpc-blue/10 text-acpc-blue rounded-full flex items-center justify-center mx-auto mb-6">
                    <Clock size={32} />
                  </div>
                  <h4 className="text-xl font-bold mb-3">Key Dates</h4>
                  <p className="text-gray-600 text-sm">Stay updated with the latest admission schedules and deadlines.</p>
                </div>
                <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="w-16 h-16 bg-acpc-blue/10 text-acpc-blue rounded-full flex items-center justify-center mx-auto mb-6">
                    <Phone size={32} />
                  </div>
                  <h4 className="text-xl font-bold mb-3">24/7 Support</h4>
                  <p className="text-gray-600 text-sm">Our helpdesk and AI assistant are here to solve your queries.</p>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>

      {/* Chat Panel */}
      <div 
        className={`transition-all duration-500 ease-in-out overflow-hidden border-l border-gray-200 bg-white flex flex-col ${isChatOpen ? 'w-full md:w-[500px]' : 'w-0 border-l-0'}`}
      >
        <ChatBot isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
      </div>

      {/* Back to Top */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-24 right-6 w-12 h-12 bg-acpc-yellow text-acpc-blue rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-50"
          >
            <ArrowUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
