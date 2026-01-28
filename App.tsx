
import React, { useState, useRef, useEffect, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { geminiService } from './geminiService';
import { Message, GroundingLink } from './types';
import { FAMOUS_PLACES, NAV_LINKS, CHAT_SUGGESTIONS, AI_UTILITIES } from './constants';
import { 
  PaperAirplaneIcon, 
  CheckIcon, 
  ClipboardDocumentIcon, 
  SparklesIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/solid';

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800";

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: "Chào mừng bạn đến với **Khe Sanh Super AI**! ⛰️\n\nTôi là Trợ lý đa năng chuyên biệt cho vùng đất Khe Sanh. Tôi có thể giúp bạn từ việc lên lịch trình, tìm kiếm các địa danh mới nổi cho đến tư vấn món ăn đặc sản.\n\nHãy thử hỏi tôi về các quán ăn ngon nhất tại thị trấn Khe Sanh nhé!",
      timestamp: new Date()
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<any>(FAMOUS_PLACES[0] || null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const mainScrollRef = useRef<HTMLDivElement>(null);
  const chatSectionRef = useRef<HTMLElement>(null);
  const destinationSectionRef = useRef<HTMLElement>(null);
  const mapSectionRef = useRef<HTMLElement>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const scrollToSection = (id: string) => {
    if (id === 'home') {
      mainScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const target = document.getElementById(id);
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleCopy = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSend = async (customText?: string) => {
    const text = (customText || input).trim();
    if (!text || isLoading) return;
    
    setIsLoading(true);
    if (!customText) setInput('');
    
    const userMsg: Message = { role: 'user', text, timestamp: new Date() };
    const currentMessages = [...messages, userMsg];
    setMessages(currentMessages);

    try {
      // Chuẩn bị lịch sử theo định dạng của SDK
      const history = messages.map(m => ({
        role: m.role as 'user' | 'model',
        parts: [{ text: m.text }]
      }));
      
      const response = await geminiService.chat(text, history);
      
      const groundingLinks: GroundingLink[] = [];
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        chunks.forEach((chunk: any) => {
          if (chunk.web) {
            groundingLinks.push({
              title: chunk.web.title,
              uri: chunk.web.uri,
              type: 'search'
            });
          }
        });
      }

      setMessages(prev => [...prev, {
        role: 'model',
        text: response.text || "Tôi chưa tìm được thông tin chính xác.",
        groundingLinks,
        timestamp: new Date()
      }]);
    } catch (e: any) {
      let errorText = "Xin lỗi, kết nối AI đang bị gián đoạn. Vui lòng thử lại sau vài giây.";
      if (e.message === "API_KEY_MISSING") {
        errorText = "LỖI: Chưa cấu hình API Key trên Vercel. Vui lòng kiểm tra Environment Variables.";
      }
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: errorText, 
        timestamp: new Date() 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#050a12] text-slate-200 overflow-hidden font-['Plus_Jakarta_Sans']">
      
      {/* SIDEBAR */}
      <aside className="w-[320px] border-r border-white/5 flex flex-col p-6 hidden xl:flex shrink-0 glass-card">
        <div className="flex items-center gap-4 mb-16 cursor-pointer" onClick={() => scrollToSection('home')}>
          <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center font-black text-white text-2xl">K</div>
          <h1 className="text-xl font-extrabold uppercase">KheSanh<span className="text-emerald-500">Smart</span></h1>
        </div>

        <div className="space-y-12">
          <div>
            <div className="mb-6 flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">AI Core</span>
              <div className="active-status-pulse"></div>
            </div>
            <div className="space-y-3">
              {AI_UTILITIES.map((util, idx) => (
                <button key={idx} onClick={() => { handleSend(util.query); scrollToSection('chat'); }} className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl bg-white/5 hover:bg-emerald-500/10 border border-white/5 transition-all text-left group">
                  <span className="text-xl group-hover:scale-110 transition-transform">{util.icon}</span>
                  <span className="text-xs font-bold text-slate-400 group-hover:text-white">{util.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      <main ref={mainScrollRef} className="flex-1 flex flex-col h-full overflow-y-auto no-scrollbar relative scroll-smooth">
        <nav className="px-6 md:px-10 py-5 flex justify-between items-center border-b border-white/5 bg-[#050a12]/80 backdrop-blur-3xl sticky top-0 z-50">
          <div className="flex items-center gap-4 xl:hidden">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center font-black text-white">K</div>
          </div>
          <div className="hidden md:flex gap-12">
            {NAV_LINKS.map(link => (
              <button key={link.id} onClick={() => scrollToSection(link.id)} className="text-[10px] font-black text-slate-400 hover:text-emerald-500 uppercase tracking-widest">{link.name}</button>
            ))}
          </div>
          <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <SparklesIcon className="w-3 h-3 text-emerald-500" />
            <span className="text-[9px] font-black text-emerald-400 uppercase">AI Active</span>
          </div>
        </nav>

        <div className="px-4 py-8 md:p-14 max-w-5xl mx-auto w-full space-y-20 pb-40">
          
          <section id="chat" className="scroll-mt-24 bg-[#0a111c]/60 rounded-[40px] border border-white/5 min-h-[600px] flex flex-col shadow-2xl glass-card overflow-hidden">
            <div className="px-8 py-6 border-b border-white/5 bg-white/5 flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center font-black">AI</div>
              <div>
                <h3 className="text-lg font-black text-white">KHE SANH SUPER AI</h3>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">Trợ lý du lịch 2026</p>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 px-8 py-10 space-y-10 overflow-y-auto no-scrollbar h-[500px]">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-6 rounded-[32px] relative group ${
                    msg.role === 'user' ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-slate-800/50 border border-white/5 rounded-tl-none'
                  }`}>
                    <div className="markdown-content text-sm md:text-base">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                    {msg.role === 'model' && (
                      <button onClick={() => handleCopy(msg.text, i)} className="absolute -right-12 top-0 p-3 opacity-0 group-hover:opacity-100 transition-all">
                        {copiedId === i ? <CheckIcon className="w-4 h-4 text-emerald-500" /> : <ClipboardDocumentIcon className="w-4 h-4 text-slate-600" />}
                      </button>
                    )}
                    {msg.groundingLinks && msg.groundingLinks.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-white/5 space-y-3">
                        <p className="text-[10px] font-black text-slate-500 uppercase">Nguồn tham khảo:</p>
                        <div className="flex flex-wrap gap-2">
                          {msg.groundingLinks.map((link, idx) => (
                            <a key={idx} href={link.uri} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-black/30 border border-white/10 rounded-xl text-[10px] text-emerald-400 font-bold hover:border-emerald-500/50 transition-all">
                              <span className="line-clamp-1 max-w-[150px]">{link.title}</span>
                              <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-center gap-4 px-8 py-6 bg-slate-800/50 rounded-3xl w-fit border border-white/5">
                  <div className="flex gap-1"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></span><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-75"></span><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-150"></span></div>
                  <span className="text-[10px] font-black text-emerald-500 uppercase">AI đang xử lý...</span>
                </div>
              )}
            </div>

            <footer className="p-8 bg-white/5 border-t border-white/5">
              <div className="flex gap-3 mb-6 overflow-x-auto no-scrollbar">
                {CHAT_SUGGESTIONS.map((s, idx) => (
                  <button key={idx} onClick={() => handleSend(s)} className="whitespace-nowrap px-6 py-3 rounded-full border border-white/5 bg-white/5 text-[10px] font-bold text-slate-400 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all">
                    {s}
                  </button>
                ))}
              </div>
              <div className="relative">
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Nhập câu hỏi về Khe Sanh..." className="w-full bg-slate-900 border border-white/10 rounded-[24px] py-6 px-8 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all pr-20" />
                <button onClick={() => handleSend()} disabled={!input.trim() || isLoading} className="absolute right-3 top-1/2 -translate-y-1/2 w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center hover:bg-emerald-600 disabled:opacity-20 transition-all">
                  <PaperAirplaneIcon className="w-6 h-6 text-white" />
                </button>
              </div>
            </footer>
          </section>

          <section id="destinations" className="scroll-mt-24 space-y-12">
            <h2 className="text-4xl font-black text-white">Điểm Đến Hàng Đầu</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {FAMOUS_PLACES.map((place, idx) => (
                <div key={idx} onClick={() => { setSelectedPlace(place); scrollToSection('map'); }} className="bg-white/5 rounded-[40px] overflow-hidden border border-white/5 group hover:border-emerald-500/30 transition-all cursor-pointer">
                  <div className="h-60 overflow-hidden"><img src={place.image} className="w-full h-full object-cover group-hover:scale-110 transition-duration-1000" alt={place.name} /></div>
                  <div className="p-8"><h4 className="text-white font-bold text-xl mb-2">{place.name}</h4><p className="text-slate-500 text-sm line-clamp-2">{place.desc}</p></div>
                </div>
              ))}
            </div>
          </section>

          <section id="map" className="scroll-mt-24 space-y-12">
            <h2 className="text-4xl font-black text-white">Bản Đồ Du Lịch</h2>
            <div className="h-[600px] bg-white rounded-[40px] overflow-hidden border-8 border-white shadow-2xl">
              {selectedPlace && (
                <iframe className="w-full h-full" src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedPlace.name + ' Khe Sanh')}&t=&z=14&ie=UTF8&iwloc=&output=embed`} allowFullScreen></iframe>
              )}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};

export default App;
