
import React, { useState, useRef, useEffect, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { geminiService } from './geminiService';
import { Message, GroundingLink } from './types';
import { FAMOUS_PLACES, FAMOUS_DISHES, NAV_LINKS, CHAT_SUGGESTIONS, AI_UTILITIES } from './constants';
import { 
  PaperAirplaneIcon, 
  MapPinIcon, 
  ChevronRightIcon, 
  MagnifyingGlassIcon, 
  MapIcon, 
  ArrowPathIcon, 
  InformationCircleIcon, 
  ArrowTopRightOnSquareIcon, 
  XMarkIcon, 
  SparklesIcon, 
  SunIcon, 
  CakeIcon, 
  PhotoIcon,
  ClipboardDocumentIcon,
  CheckIcon,
  ArrowUpIcon,
  Bars3BottomLeftIcon
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
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchingAI, setIsLoadingAI] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  const [selectedPlace, setSelectedPlace] = useState<any>(FAMOUS_PLACES[0] || null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const mainScrollRef = useRef<HTMLDivElement>(null);
  const chatSectionRef = useRef<HTMLElement>(null);
  const destinationSectionRef = useRef<HTMLElement>(null);
  const cuisineSectionRef = useRef<HTMLElement>(null);
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

  useEffect(() => {
    const handleScroll = () => {
      if (mainScrollRef.current) {
        setShowScrollTop(mainScrollRef.current.scrollTop > 500);
      }
    };
    const currentRef = mainScrollRef.current;
    currentRef?.addEventListener('scroll', handleScroll);
    return () => currentRef?.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const refs: Record<string, React.RefObject<HTMLElement | null>> = {
      'chat': chatSectionRef,
      'destinations': destinationSectionRef,
      'cuisine': cuisineSectionRef,
      'map': mapSectionRef
    };

    if (id === 'home') {
      mainScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const targetRef = refs[id];
    if (targetRef?.current) {
      targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const filteredPlaces = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return FAMOUS_PLACES;
    return FAMOUS_PLACES.filter(place => 
      place.name.toLowerCase().includes(term) ||
      place.category.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = FALLBACK_IMAGE;
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
    setMessages(prev => [...prev, userMsg]);

    try {
      const history = messages.map(m => ({
        role: m.role,
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
        text: response.text || "Tôi chưa tìm được thông tin chính xác, bạn có thể hỏi cụ thể hơn không?",
        groundingLinks,
        timestamp: new Date()
      }]);
    } catch (e: any) {
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: "Xin lỗi, kết nối AI đang bị gián đoạn. Vui lòng thử lại sau vài giây.", 
        timestamp: new Date() 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAISearchPlace = async () => {
    if (!searchTerm.trim() || isSearchingAI) return;
    setIsLoadingAI(true);
    try {
      const prompt = `Tra cứu thông tin du lịch chi tiết và thực tế về "${searchTerm}" tại khu vực Khe Sanh, Quảng Trị. Cung cấp mô tả ngắn gọn và hấp dẫn.`;
      const response = await geminiService.chat(prompt, []);
      
      setSelectedPlace({
        name: searchTerm,
        category: 'KẾT QUẢ AI',
        image: FALLBACK_IMAGE,
        desc: (response.text || "").substring(0, 250),
        location: 'Khe Sanh, Quảng Trị'
      });
      
      handleSend(`Thông tin du lịch về ${searchTerm}`);
      scrollToSection('chat');
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingAI(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#050a12] text-slate-200 overflow-hidden font-['Plus_Jakarta_Sans'] selection:bg-emerald-500/30">
      
      {/* SIDEBAR - DESKTOP ONLY */}
      <aside className="w-[320px] glass-card border-r border-white/5 flex flex-col p-6 overflow-y-auto no-scrollbar hidden xl:flex shrink-0 z-50">
        <div className="flex items-center gap-4 mb-16 group cursor-pointer" onClick={() => scrollToSection('home')}>
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center font-black text-white text-2xl shadow-lg shadow-emerald-500/20 group-hover:rotate-12 transition-all">K</div>
          <h1 className="text-xl font-extrabold tracking-tight uppercase">KheSanh<span className="text-emerald-500">Smart</span></h1>
        </div>

        <div className="space-y-12">
          <div>
            <div className="mb-6 flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em]">AI Core</span>
              <div className="active-status-pulse"></div>
            </div>
            <div className="space-y-3">
              {AI_UTILITIES.map((util, idx) => (
                <button 
                  key={idx} 
                  onClick={() => { handleSend(util.query); scrollToSection('chat'); }}
                  className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl bg-white/5 hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/30 transition-all group active:scale-[0.97] text-left"
                >
                  <span className="text-xl group-hover:scale-125 transition-transform duration-300">{util.icon}</span>
                  <span className="text-xs font-bold text-slate-400 group-hover:text-white transition-colors break-words">{util.title}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] mb-6">Top Destinations</h3>
            <div className="space-y-4">
              {FAMOUS_PLACES.slice(0, 5).map((place, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center gap-3 cursor-pointer group hover:bg-white/5 p-2 rounded-2xl transition-all"
                  onClick={() => { setSelectedPlace(place); scrollToSection('map'); }}
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/10">
                    <img src={place.image} onError={handleImageError} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500" alt={place.name} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-slate-300 group-hover:text-emerald-400 transition-colors line-clamp-1 break-words">{place.name}</p>
                    <p className="text-[9px] text-slate-600 font-bold uppercase tracking-wider mt-0.5">{place.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      <main ref={mainScrollRef} className="flex-1 flex flex-col h-full overflow-y-auto no-scrollbar bg-[#050a12] relative scroll-smooth">
        
        {/* STICKY NAV - RESPONSIVE */}
        <nav className="px-6 md:px-10 py-5 flex justify-between items-center border-b border-white/5 bg-[#050a12]/80 backdrop-blur-3xl sticky top-0 z-[60]">
          <div className="flex items-center gap-4 xl:hidden">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center font-black text-white text-xl shadow-lg">K</div>
            <span className="font-extrabold text-sm tracking-tight uppercase">KheSanh<span className="text-emerald-500">AI</span></span>
          </div>
          <div className="hidden md:flex gap-8 lg:gap-12">
            {NAV_LINKS.map(link => (
              <button 
                key={link.id} 
                onClick={() => scrollToSection(link.id)}
                className="text-[10px] font-black text-slate-400 hover:text-emerald-500 transition-all uppercase tracking-[0.3em] relative group"
              >
                {link.name}
                <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-emerald-500 transition-all group-hover:w-full"></span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <SparklesIcon className="w-3 h-3 text-emerald-500" />
            <span className="text-[8px] md:text-[9px] font-black text-emerald-400 uppercase tracking-widest whitespace-nowrap">Global AI Travel</span>
          </div>
        </nav>

        <div className="px-4 py-8 md:p-14 space-y-20 md:space-y-32 max-w-6xl mx-auto w-full pb-40">
          
          {/* Section: Chat AI */}
          <section id="chat" ref={chatSectionRef} className="scroll-mt-24 bg-[#0a111c]/60 rounded-[32px] md:rounded-[48px] border border-white/5 min-h-[500px] md:min-h-[700px] flex flex-col shadow-2xl relative overflow-hidden glass-card">
            <div className="px-6 md:px-10 py-6 md:py-8 border-b border-white/5 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-4 md:gap-6">
                <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl md:rounded-2xl flex items-center justify-center text-xs md:text-sm font-black shadow-xl">AI</div>
                <div className="min-w-0">
                  <h3 className="text-base md:text-lg font-black uppercase text-white tracking-tighter truncate">Khe Sanh Super AI</h3>
                  <p className="text-[8px] md:text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Tra cứu thời gian thực</p>
                </div>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 px-6 md:px-10 py-8 md:py-12 space-y-8 md:space-y-12 overflow-y-auto no-scrollbar h-[400px] md:h-[550px] scroll-smooth">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
                  <div className={`max-w-[92%] md:max-w-[85%] group relative p-6 md:p-8 rounded-[28px] md:rounded-[40px] shadow-2xl ${
                    msg.role === 'user' ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-[#141d2b] border border-white/5 rounded-tl-none text-slate-200'
                  }`}>
                    <div className="markdown-content text-[14px] md:text-[15px] font-medium break-words overflow-hidden">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                    
                    {msg.role === 'model' && (
                      <button 
                        onClick={() => handleCopy(msg.text, i)}
                        className="absolute -right-10 md:-right-12 top-0 p-2 md:p-3 rounded-xl bg-white/5 hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-all hidden sm:block"
                      >
                        {copiedId === i ? <CheckIcon className="w-4 h-4 text-emerald-500" /> : <ClipboardDocumentIcon className="w-4 h-4 text-slate-500" />}
                      </button>
                    )}

                    {msg.groundingLinks && msg.groundingLinks.length > 0 && (
                      <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-white/5 space-y-3 md:space-y-4">
                        <p className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Nguồn tham khảo:</p>
                        <div className="flex flex-wrap gap-2">
                          {msg.groundingLinks.map((link, idx) => (
                            <a 
                              key={idx} 
                              href={link.uri} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-slate-900 border border-white/10 rounded-lg md:rounded-xl text-[9px] md:text-[10px] text-emerald-400 font-bold hover:border-emerald-500/50 transition-all"
                            >
                              <span className="line-clamp-1 max-w-[120px] md:max-w-[150px] break-words">{link.title}</span>
                              <ArrowTopRightOnSquareIcon className="w-3 md:w-3.5 h-3 md:h-3.5" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-center gap-4 md:gap-6 px-6 md:px-8 py-4 md:py-6 bg-[#141d2b] rounded-2xl md:rounded-[32px] w-fit shadow-xl border border-white/5 relative overflow-hidden">
                  <div className="shimmer absolute inset-0"></div>
                  <div className="flex gap-1.5 relative z-10"><span className="thinking-dot"></span><span className="thinking-dot"></span><span className="thinking-dot"></span></div>
                  <span className="text-[9px] md:text-[11px] font-black text-emerald-500 uppercase tracking-[0.2em] relative z-10">AI Thinking...</span>
                </div>
              )}
            </div>

            <footer className="p-6 md:p-10 bg-white/5 border-t border-white/5">
              <div className="flex gap-3 md:gap-4 mb-6 md:mb-8 overflow-x-auto no-scrollbar pb-2">
                {CHAT_SUGGESTIONS.map((s, idx) => (
                  <button key={idx} onClick={() => handleSend(s)} className="whitespace-nowrap px-5 md:px-6 py-2.5 md:py-3 rounded-full border border-white/5 bg-white/5 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-emerald-500/10 hover:text-emerald-400 transition-all">
                    {s}
                  </button>
                ))}
              </div>
              <div className="relative group">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                  placeholder="Hỏi AI về Khe Sanh..."
                  className="w-full bg-[#141d2b] border border-white/10 rounded-[24px] md:rounded-[32px] py-5 md:py-7 px-6 md:px-10 text-sm md:text-base font-semibold focus:outline-none focus:ring-4 focus:ring-emerald-500/20 transition-all pr-20 md:pr-24 text-slate-100 placeholder:text-slate-600"
                />
                <button 
                  onClick={() => handleSend()} 
                  disabled={!input.trim() || isLoading} 
                  className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 bg-emerald-500 rounded-xl md:rounded-2xl flex items-center justify-center hover:bg-emerald-600 transition-all shadow-xl disabled:opacity-20 active:scale-90"
                >
                  <PaperAirplaneIcon className="w-6 md:w-7 h-6 md:h-7 text-white" />
                </button>
              </div>
            </footer>
          </section>

          {/* Các phần khác của App... (giữ nguyên logic hiển thị) */}
          <section id="destinations" ref={destinationSectionRef} className="scroll-mt-24 space-y-12 md:space-y-16">
            <div className="flex flex-col gap-3 md:gap-4">
              <div className="flex items-center gap-3 md:gap-4 text-emerald-500 font-black text-[10px] md:text-xs uppercase tracking-[0.5em]">
                <div className="h-0.5 w-8 md:w-12 bg-emerald-500"></div> Top Collection
              </div>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white break-words">Điểm Đến Tuyệt Vời Tại Khe Sanh</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
              {FAMOUS_PLACES.map((place, idx) => (
                <div key={idx} className="bg-white/5 rounded-[32px] md:rounded-[48px] overflow-hidden border border-white/5 group hover:border-emerald-500/30 transition-all cursor-pointer shadow-2xl relative" onClick={() => { setSelectedPlace(place); scrollToSection('map'); }}>
                  <div className="h-56 md:h-72 overflow-hidden relative">
                    <img src={place.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={place.name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  </div>
                  <div className="p-8 md:p-10 space-y-4 md:space-y-5 relative">
                    <h4 className="text-white font-black text-xl md:text-2xl uppercase tracking-tight group-hover:text-emerald-400 transition-colors line-clamp-2 break-words leading-tight">{place.name}</h4>
                    <p className="text-slate-500 text-xs md:text-sm font-medium leading-relaxed line-clamp-2 break-words">{place.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Map Section */}
          <section id="map" ref={mapSectionRef} className="scroll-mt-24 py-10 md:py-16 space-y-12 md:space-y-20">
            <div className="text-center max-w-3xl mx-auto space-y-4 md:space-y-6">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase break-words">Bản Đồ Du Lịch Khe Sanh</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 bg-white rounded-[48px] md:rounded-[64px] p-4 md:p-6 shadow-3xl border border-slate-200 overflow-hidden min-h-fit lg:min-h-[850px]">
              <div className="lg:col-span-4 bg-slate-50 rounded-[36px] md:rounded-[48px] p-6 md:p-8 flex flex-col">
                {/* Search & List */}
                <div className="space-y-3 md:space-y-4 overflow-y-auto no-scrollbar flex-1">
                  {filteredPlaces.map((place, idx) => (
                    <button key={idx} onClick={() => setSelectedPlace(place)} className={`w-full text-left p-4 rounded-[24px] transition-all flex items-center gap-3 ${selectedPlace?.name === place.name ? 'bg-white shadow-xl ring-2 ring-emerald-500' : 'bg-white/60'}`}>
                      <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                        <img src={place.image} onError={handleImageError} className="w-full h-full object-cover" alt={place.name} />
                      </div>
                      <p className="text-[13px] font-black uppercase text-slate-800">{place.name}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div className="lg:col-span-8 bg-slate-100 rounded-[36px] md:rounded-[48px] relative overflow-hidden h-[400px] lg:h-auto">
                 {selectedPlace && (
                   <iframe className="w-full h-full border-none" title="google-maps" src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedPlace.name + ' Khe Sanh Quảng Trị')}&t=&z=14&ie=UTF8&iwloc=&output=embed`} allowFullScreen loading="lazy"></iframe>
                 )}
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};

export default App;
