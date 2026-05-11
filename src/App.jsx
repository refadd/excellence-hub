import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, BookOpen, Trophy, Search, ChevronRight, 
  FileSpreadsheet, Zap, Flame, Target, Lock, ArrowRight, 
  Sparkles, Eye, EyeOff, Award, CheckCircle2, Clock, 
  Star, ShieldCheck, Crown, Activity, TrendingUp, Quote,
  User, Settings, LogOut, PlayCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Data & Quotes ---
const QUOTES = [
  { text: "Sesuatu yang indah tentang belajar adalah tidak ada yang bisa mengambilnya darimu.", author: "B.B. King" },
  { text: "Keunggulan bukanlah sebuah keterampilan, melainkan sikap. Kuasai alatmu, kuasai hidupmu.", author: "Aristoteles" },
  { text: "Data adalah minyak baru. Excel adalah kilang yang mengubahnya menjadi emas.", author: "Clive Humby" },
  { text: "Kemajuan harian 1% Anda dalam belajar akan terakumulasi menjadi 100% penguasaan.", author: "James Clear" },
  { text: "Hiduplah seolah-olah kamu akan mati besok. Belajarlah seolah-olah kamu akan hidup selamanya.", author: "Mahatma Gandhi" }
];

const SKILL_TREE_LEVELS = [
  { id: 1, name: "Excel Basic & Navigation", status: "Completed", progress: 100, color: "bg-emerald-500", items: 20, desc: "Fondasi navigasi, shortcut, dan pemahaman struktur spreadsheet." },
  { id: 2, name: "Text & Data Cleaning", status: "In Progress", progress: 65, color: "bg-blue-500", items: 20, desc: "Transformasi data berantakan menjadi informasi yang siap diolah." },
  { id: 3, name: "Logic & Conditional", status: "Locked", progress: 0, color: "bg-amber-500", items: 20, desc: "Menggunakan IF, AND, OR, dan logika tingkat lanjut untuk otomasi." },
  { id: 4, name: "Lookup & Data Matching", status: "Locked", progress: 0, color: "bg-slate-500", items: 20, desc: "Integrasi data lintas tabel menggunakan VLOOKUP dan XLOOKUP." },
  { id: 5, name: "Real Case & Study Case", status: "Locked", progress: 0, color: "bg-slate-500", items: 20, desc: "Penyelesaian masalah bisnis nyata untuk portofolio profesional." }
];

const PREMIUM_LEVELS = [
  { level: 1, title: "Lvl 1: Fundamentals Mastery", items: 20, desc: "Kuasai fondasi utama Excel untuk efisiensi kerja maksimal." },
  { level: 2, title: "Lvl 2: Professional Cleaning", items: 20, desc: "Teknik tingkat tinggi merapikan data berantakan dalam hitungan detik." },
  { level: 3, title: "Lvl 3: Advanced Logic", items: 20, desc: "Gunakan formula logika kompleks untuk pengambilan keputusan otomatis." },
  { level: 4, title: "Lvl 4: Matrix & Lookups", items: 20, desc: "Integrasi antar tabel dengan VLOOKUP, INDEX, dan MATCH profesional." },
  { level: 5, title: "Lvl 5: Expert Simulation", items: 20, desc: "Simulasi kasus bisnis nyata untuk portofolio tingkat ahli." }
];

const FREE_COURSES = [
  { id: 'f1', title: "Quick Basic: Intro to Cells", items: 5, desc: "Pengenalan antarmuka dan navigasi dasar bagi pemula." },
  { id: 'f2', title: "Quick Basic: Simple Sums", items: 8, desc: "Rumus matematika dasar untuk kebutuhan sehari-hari." }
];

const USER_DATA = {
  name: "Budi Santoso",
  email: "budi.santoso@email.com",
  isPremium: false,
  streak: 12,
  xp: 1250,
  level: "Pivot Hero",
  overallProgress: 35,
};

// --- Sub-Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-300 ${active ? 'bg-emerald-50 text-emerald-600 shadow-sm' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}>
    <Icon size={20} />
    <span className="font-semibold text-[13px] tracking-tight">{label}</span>
  </button>
);

const ProgressBar = ({ value, color = "bg-emerald-500", height = "h-1.5" }) => (
  <div className={`w-full bg-slate-100 ${height} rounded-full overflow-hidden`}>
    <motion.div 
      initial={{ width: 0 }}
      animate={{ width: `${value}%` }}
      transition={{ duration: 1.5, ease: "circOut" }}
      className={`h-full ${color}`}
    />
  </div>
);

const ModuleCard = ({ module, isPremium, type = "premium" }) => (
  <motion.div 
    whileHover={{ y: -6, scale: 1.01 }}
    className={`bg-white p-6 rounded-[32px] border ${type === 'free' ? 'border-emerald-100 hover:border-emerald-300' : 'border-slate-100 hover:border-slate-200'} shadow-sm hover:shadow-xl transition-all cursor-pointer group relative overflow-hidden`}
  >
    {type === 'premium' && !isPremium && (
      <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-10 flex items-center justify-center p-6 text-center">
         <div className="bg-white p-4 rounded-3xl shadow-2xl border border-slate-100 flex flex-col items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white mb-1">
              <Lock size={18} />
            </div>
            <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">Upgrade Pro</span>
            <p className="text-[9px] text-slate-400 font-medium leading-tight">Buka akses selamanya</p>
         </div>
      </div>
    )}
    
    <div className="flex items-start justify-between mb-5">
      <div className={`w-12 h-12 ${type === 'free' ? 'bg-emerald-500' : 'bg-slate-900'} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
        {type === 'free' ? <Star size={24} className="fill-white" /> : <Crown size={24} className="fill-emerald-400 text-emerald-400" />}
      </div>
      <div className="text-right">
        <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${type === 'free' ? 'text-emerald-500' : 'text-slate-400'}`}>
           {type === 'free' ? 'Starter Pack' : 'Premium Level'}
        </span>
      </div>
    </div>
    
    <h3 className="font-bold text-slate-900 text-lg mb-2 group-hover:text-emerald-600 transition-colors leading-tight">{module.title || module.name}</h3>
    <p className="text-[11px] text-slate-500 leading-relaxed mb-6 font-medium line-clamp-2">{module.desc}</p>
    
    <div className="flex items-center gap-4 text-[10px] text-slate-400 mb-6 font-bold tracking-tight uppercase">
      <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg"><BookOpen size={12} /> {module.items} Modul</span>
      <span className={`flex items-center gap-1.5 px-2 py-1 rounded-lg ${type === 'free' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
        {type === 'free' ? <Zap size={12} /> : <ShieldCheck size={12} />} {type === 'free' ? 'Gratis' : 'Sertifikat'}
      </span>
    </div>
    
    <div className="space-y-2">
      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
        <span className="text-slate-400">Progres</span>
        <span className="text-slate-900">{module.progress || 0}%</span>
      </div>
      <ProgressBar value={module.progress || 0} color={type === 'free' ? 'bg-emerald-500' : 'bg-emerald-600'} />
    </div>
  </motion.div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % QUOTES.length);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900 flex overflow-hidden transition-all duration-700 ${isFocusMode ? 'grayscale-[0.8] brightness-90' : ''}`}>
      
      {/* --- Sidebar --- */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col p-6 fixed h-full z-50">
        <div className="flex items-center space-x-3 mb-12 px-2 text-slate-900">
          <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <FileSpreadsheet size={22} />
          </div>
          <span className="font-extrabold text-xl tracking-tight">Excellence</span>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarItem icon={BookOpen} label="Materi Belajar" active={activeTab === 'courses'} onClick={() => setActiveTab('courses')} />
          <SidebarItem icon={Trophy} label="Pencapaian" active={activeTab === 'achievements'} onClick={() => setActiveTab('achievements')} />
        </nav>

        <div className="mt-auto">
          {!USER_DATA.isPremium && (
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-slate-900 p-5 rounded-[24px] text-white relative overflow-hidden group cursor-pointer shadow-2xl shadow-slate-200"
            >
              <p className="font-bold text-sm mb-1">Upgrade Pro</p>
              <p className="text-[10px] text-slate-400 mb-4 leading-snug">Buka akses penuh ke kurikulum eksklusif.</p>
              <button className="w-full bg-emerald-500 text-white text-[11px] font-bold py-2.5 rounded-xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20">Subscribe Now</button>
              <Crown size={40} className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-transform" />
            </motion.div>
          )}
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className="flex-1 ml-64 overflow-y-auto h-screen">
        
        <header className="sticky top-0 z-40 bg-slate-50/80 backdrop-blur-md px-10 py-6 flex items-center justify-between border-b border-slate-100/50">
          <div className="relative w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
            <input type="text" placeholder="Cari materi..." className="w-full bg-white border border-slate-100 rounded-2xl py-2 pl-12 pr-4 text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all shadow-sm" />
          </div>

          <div className="flex items-center gap-4 relative" ref={dropdownRef}>
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-900 leading-none mb-1">{USER_DATA.name}</p>
              <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider leading-none">{USER_DATA.level}</p>
            </div>
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-10 h-10 bg-emerald-100 rounded-xl overflow-hidden border-2 border-white shadow-sm ring-4 ring-emerald-50 hover:ring-emerald-200 transition-all active:scale-95 flex items-center justify-center cursor-pointer"
            >
              <img src={`https://ui-avatars.com/api/?name=${USER_DATA.name}&background=10B981&color=fff`} alt="User" />
            </button>

            <AnimatePresence>
              {showProfileMenu && (
                <motion.div 
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  className="absolute right-0 top-full mt-3 w-56 bg-white border border-slate-100 rounded-[24px] shadow-2xl p-2 z-50 origin-top-right"
                >
                  <div className="px-4 py-3 border-b border-slate-50 mb-1">
                    <p className="text-xs font-bold text-slate-900 leading-none">{USER_DATA.name}</p>
                    <p className="text-[10px] text-slate-400 mt-1 truncate">{USER_DATA.email}</p>
                  </div>
                  <div className="space-y-1 text-slate-600">
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 text-[11px] font-bold hover:bg-slate-50 rounded-xl transition-colors text-left group">
                      <User size={14} className="text-slate-400 group-hover:text-emerald-500" /> Profil Saya
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 text-[11px] font-bold hover:bg-slate-50 rounded-xl transition-colors text-left group">
                      <Settings size={14} className="text-slate-400 group-hover:text-emerald-500" /> Pengaturan
                    </button>
                    <div className="h-px bg-slate-50 mx-2 my-1"></div>
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 text-[11px] font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors text-left group">
                      <LogOut size={14} className="text-red-400 group-hover:text-red-600" /> Keluar Sesi
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        <div className="px-10 pb-12">
          <AnimatePresence mode="wait">
            
            {activeTab === 'dashboard' && (
              <motion.div key="dash" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10 pt-4">
                
                {/* Hero Section */}
                <section className="bg-white rounded-[48px] border border-slate-100 overflow-hidden shadow-sm flex flex-col lg:flex-row min-h-[500px]">
                  <div className="flex-1 p-12 flex flex-col justify-center relative bg-white">
                    <Quote size={80} className="absolute top-8 left-6 text-slate-50/60 -z-10" />
                    
                    <div className="min-h-[140px] mb-8">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={quoteIndex}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="flex flex-col"
                        >
                          <h1 className="text-4xl font-extrabold text-slate-900 leading-tight mb-4 tracking-tight">
                            "{QUOTES[quoteIndex].text}"
                          </h1>
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-[2px] bg-emerald-500"></div>
                             <span className="text-emerald-500 font-bold text-[12px] uppercase tracking-[0.2em]">
                                {QUOTES[quoteIndex].author}
                             </span>
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    <div className="mb-8 p-6 bg-slate-50 rounded-[32px] border border-slate-100">
                       <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-2">
                             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Ready To Start? (Free)</span>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100/50 px-2.5 py-1 rounded-full">Tersedia Sekarang</span>
                       </div>
                       
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {FREE_COURSES.map(course => (
                            <motion.div 
                              key={course.id}
                              whileHover={{ y: -4, backgroundColor: '#ffffff' }}
                              className="p-5 bg-white/60 border border-transparent hover:border-emerald-200 rounded-2xl flex flex-col gap-4 transition-all group cursor-pointer shadow-sm hover:shadow-md"
                            >
                               <div className="flex items-center justify-between">
                                 <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                                    <PlayCircle size={20} />
                                 </div>
                                 <div className="text-right">
                                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{course.items} Modul</span>
                                 </div>
                               </div>
                               <div>
                                  <p className="text-[13px] font-extrabold text-slate-900 leading-snug mb-1">{course.title}</p>
                                  <p className="text-[10px] text-slate-500 line-clamp-1 leading-relaxed">{course.desc}</p>
                               </div>
                               <div className="flex items-center justify-between pt-2">
                                  <div className="flex -space-x-1.5">
                                     {[1,2,3].map(i => <div key={i} className="w-4 h-4 rounded-full bg-emerald-100 border border-white" />)}
                                  </div>
                                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">Mulai <ChevronRight size={12} /></span>
                               </div>
                            </motion.div>
                          ))}
                       </div>
                    </div>

                    <button onClick={() => setActiveTab('courses')} className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-xs hover:bg-emerald-600 transition-all self-start shadow-xl shadow-slate-200 active:scale-95">
                      Lihat Kurikulum Lengkap <ArrowRight size={16} />
                    </button>
                  </div>

                  {/* Statistics Sidebar */}
                  <div className="lg:w-80 bg-slate-900 p-8 flex flex-col relative">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-white text-[11px] font-bold uppercase tracking-widest flex items-center gap-2">
                        <Activity size={14} className="text-emerald-400 animate-pulse" /> Statistik Belajar
                      </h3>
                      <button onClick={() => setIsFocusMode(!isFocusMode)} className={`p-2 rounded-lg transition-all ${isFocusMode ? 'bg-emerald-500 text-white' : 'bg-white/10 text-slate-400 hover:text-white'}`}>
                          {isFocusMode ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                    
                    <div className="space-y-7 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                      {SKILL_TREE_LEVELS.map((skill, idx) => (
                        <motion.div 
                          key={skill.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="group"
                        >
                          <div className="flex justify-between text-[11px] mb-2 font-bold tracking-tight">
                            <span className="text-slate-300 group-hover:text-white transition-colors">{skill.name}</span>
                            <span className={skill.progress === 100 ? "text-emerald-400" : "text-slate-500"}>
                              {skill.progress}%
                            </span>
                          </div>
                          <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }} 
                              animate={{ width: `${skill.progress}%` }} 
                              transition={{ duration: 2, ease: "circOut", delay: idx * 0.2 }}
                              className={`h-full ${skill.color} shadow-[0_0_8px_rgba(16,185,129,0.3)]`} 
                            />
                          </div>
                          <div className="flex justify-between items-center mt-1.5 px-0.5">
                             <div className="flex gap-1">
                                {[1,2,3,4,5].map(dot => (
                                  <div key={dot} className={`w-1 h-1 rounded-full ${dot <= (skill.progress/20) ? 'bg-emerald-400' : 'bg-white/10'}`} />
                                ))}
                             </div>
                             <span className="text-[9px] text-slate-600 font-bold uppercase tracking-tighter">
                                {skill.status}
                             </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
                       <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[10px] text-slate-500 uppercase font-bold mb-0.5">Harian 🔥</p>
                            <p className="text-xl font-bold text-white tracking-tight">{USER_DATA.streak} Hari</p>
                          </div>
                          <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500 border border-orange-500/20">
                            <Flame size={20} className="fill-orange-500" />
                          </div>
                       </div>
                    </div>
                  </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                   {[
                    { icon: Zap, label: "Total XP", val: USER_DATA.xp, color: "text-blue-500", bg: "bg-blue-50" },
                    { icon: Target, label: "Target", val: "85%", color: "text-emerald-500", bg: "bg-emerald-50" },
                    { icon: Clock, label: "Waktu Belajar", val: "12j 30m", color: "text-amber-500", bg: "bg-amber-50" },
                    { icon: Award, label: "Badge", val: "Junior", color: "text-purple-500", bg: "bg-purple-50" }
                   ].map((item, i) => (
                     <motion.div 
                        key={i} 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + (i * 0.1) }}
                        whileHover={{ y: -5 }}
                        className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-4 cursor-default transition-all"
                      >
                        <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center ${item.color}`}>
                          <item.icon size={24} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.label}</p>
                          <p className="text-lg font-bold text-slate-900">{item.val}</p>
                        </div>
                     </motion.div>
                   ))}
                </div>

                {/* --- JALUR KOMPETENSI (Each Level 20 Modules) --- */}
                <div className="space-y-6 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                        <TrendingUp size={20} className="text-emerald-500" /> Jalur Kompetensi
                      </h3>
                      <p className="text-[11px] text-slate-400 font-medium">Kurikulum bertahap untuk penguasaan data profesional.</p>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-600 hover:translate-x-1 transition-transform cursor-pointer">
                      <span>Lihat Kurikulum Lengkap</span> <ChevronRight size={14} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {SKILL_TREE_LEVELS.map((skill) => (
                       <motion.div 
                       key={skill.id}
                       whileHover={{ y: -6, scale: 1.01 }}
                       className={`bg-white p-6 rounded-[32px] border transition-all cursor-pointer group relative overflow-hidden ${skill.status === 'Locked' ? 'border-slate-100 opacity-80' : 'border-slate-100 hover:border-slate-200 hover:shadow-xl shadow-sm'}`}
                     >
                       {/* Locked Overlay for UI Consistency */}
                       {skill.status === 'Locked' && (
                         <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-10 flex items-center justify-center p-6 text-center">
                            <div className="bg-white p-4 rounded-3xl shadow-2xl border border-slate-100 flex flex-col items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                               <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white mb-1">
                                 <Lock size={18} />
                               </div>
                               <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">Terkunci</span>
                               <p className="text-[9px] text-slate-400 font-medium leading-tight">Selesaikan level sebelumnya</p>
                            </div>
                         </div>
                       )}
                       
                       <div className="flex items-start justify-between mb-5">
                         <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${skill.status === 'Completed' ? 'bg-emerald-500' : 'bg-slate-900'}`}>
                           {skill.status === 'Completed' ? <CheckCircle2 size={24} className="text-white" /> : <TrendingUp size={24} className="text-emerald-400" />}
                         </div>
                         <div className="text-right">
                           <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${skill.status === 'Completed' ? 'text-emerald-500' : 'text-slate-400'}`}>
                              Level {skill.id}
                           </span>
                         </div>
                       </div>
                       
                       <h3 className="font-bold text-slate-900 text-lg mb-2 group-hover:text-emerald-600 transition-colors leading-tight">{skill.name}</h3>
                       <p className="text-[11px] text-slate-500 leading-relaxed mb-6 font-medium line-clamp-2">{skill.desc}</p>
                       
                       <div className="flex items-center gap-4 text-[10px] text-slate-400 mb-6 font-bold tracking-tight uppercase">
                         {/* MANDATORY: 20 Modules per level */}
                         <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg"><BookOpen size={12} /> {skill.items} Modul</span>
                         <span className={`flex items-center gap-1.5 px-2 py-1 rounded-lg ${skill.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                            {skill.status === 'Completed' ? <Trophy size={12} /> : <Zap size={12} />} {skill.status}
                         </span>
                       </div>
                       
                       <div className="space-y-2">
                         <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                           <span className="text-slate-400">Progres</span>
                           <span className="text-slate-900">{skill.progress}%</span>
                         </div>
                         <ProgressBar value={skill.progress} color={skill.status === 'Completed' ? 'bg-emerald-500' : 'bg-blue-500'} />
                       </div>
                     </motion.div>
                    ))}
                  </div>
                </div>

              </motion.div>
            )}

            {activeTab === 'courses' && (
              <motion.div key="courses" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-16 pt-8 pb-20">
                <section className="space-y-8">
                  <div className="max-w-2xl border-l-4 border-emerald-500 pl-6">
                    <div className="flex items-center gap-3 text-emerald-600 font-black text-[10px] uppercase tracking-[0.3em] mb-2">
                       <Sparkles size={14} /> Kategori Terbuka
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Free Starter Pack</h2>
                    <p className="text-slate-500 text-sm leading-relaxed font-medium">Mulai perjalanan Anda dengan materi dasar gratis. Dirancang khusus untuk membangun fondasi Excel yang kuat sebelum melangkah ke tingkat profesional.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl">
                    {FREE_COURSES.map(course => <ModuleCard key={course.id} module={course} isPremium={true} type="free" />)}
                  </div>
                </section>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>

                <section className="space-y-8">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="max-w-2xl border-l-4 border-slate-900 pl-6">
                      <div className="flex items-center gap-3 text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] mb-2">
                         <Crown size={14} className="text-amber-500" /> Akses Eksklusif
                      </div>
                      <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Professional Premium Levels</h2>
                      <p className="text-slate-500 text-sm leading-relaxed font-medium">Kurikulum mendalam untuk karir profesional. Dapatkan akses ke studi kasus industri nyata dan sertifikat keahlian.</p>
                    </div>
                    {!USER_DATA.isPremium && (
                      <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center gap-3 shadow-xl shadow-slate-200">
                        Unlock All Levels <ArrowRight size={16} />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {PREMIUM_LEVELS.map(lvl => <ModuleCard key={lvl.level} module={lvl} isPremium={USER_DATA.isPremium} type="premium" />)}
                  </div>
                </section>
              </motion.div>
            )}

            {activeTab === 'achievements' && (
              <motion.div key="achieve" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center min-h-[500px] text-center">
                <motion.div 
                  animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="w-32 h-32 bg-emerald-50 rounded-[40px] flex items-center justify-center text-emerald-400 mb-8 border border-emerald-100 shadow-inner"
                >
                  <Trophy size={64} />
                </motion.div>
                <h2 className="font-black text-2xl text-slate-900 mb-3 tracking-tight uppercase">Pencapaian Anda</h2>
                <p className="text-slate-400 text-sm max-w-sm leading-relaxed font-semibold">Selesaikan modul dan kumpulkan lencana keahlian untuk memvalidasi kemampuan Excel Anda.</p>
                <button className="mt-10 bg-white border border-slate-200 px-8 py-3.5 rounded-2xl text-xs font-black text-slate-600 hover:bg-slate-50 transition-all uppercase tracking-widest">Buka Leaderboard</button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        <footer className="px-10 py-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between text-slate-400 text-[11px] font-bold tracking-tight">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-emerald-600 rounded-lg flex items-center justify-center text-white text-[10px]">E</div>
            <span>© 2024 Excellence Hub. Professional Excel Training.</span>
          </div>
          <div className="flex gap-10 mt-6 md:mt-0">
             <a href="#" className="hover:text-emerald-600 transition-colors uppercase tracking-[0.2em]">Terms</a>
             <a href="#" className="hover:text-emerald-600 transition-colors uppercase tracking-[0.2em]">Privacy</a>
             <a href="#" className="hover:text-emerald-600 transition-colors uppercase tracking-[0.2em]">Support</a>
          </div>
        </footer>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
        .line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}} />
    </div>
  );
}
