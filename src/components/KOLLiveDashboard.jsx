import React, { useState, useRef, useEffect } from 'react';
import { 
  Home, Wand2, UserSquare2, Radio, Clock, BookOpen, Code2, 
  CreditCard, User, ChevronDown, Plus, Mic, Video, Image as ImageIcon,
  Sparkles, PlayCircle, Settings
} from 'lucide-react';

import LichSuTao from './genaidol/LichSuTao';
import HuongDanAcademy from './genaidol/HuongDanAcademy';
import ThanhToanCoin from './genaidol/ThanhToanCoin';
import ThuVienAIDOL from './genaidol/ThuVienAIDOL';
import LivestreamAISetup from './genaidol/LivestreamAISetup';
import AIDOLLiveConsole from './genaidol/AIDOLLiveConsole';
import TrangChu from './genaidol/TrangChu';
import TaoAIDOLMoi from './genaidol/TaoAIDOLMoi';
import WorkspaceTacVu from './genaidol/WorkspaceTacVu';

// --- PLACEHOLDER COMPONENTS FOR PAGES ---
const PlaceholderPage = ({ title }) => (
  <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
    <div className="w-24 h-24 rounded-full bg-[#121216] border border-[#00FF66]/30 flex items-center justify-center mb-6 shadow-glow-green">
      <Sparkles className="w-12 h-12 text-[#00FF66]" />
    </div>
    <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
    <p className="text-gray-400 max-w-md">
      Hệ thống đang được nâng cấp luồng và kết nối backend cho module này. 
      Vui lòng quay lại sau!
    </p>
  </div>
);

// --- MAIN DASHBOARD (TOP NAV LAYOUT - DARK THEME) ---
export default function KOLLiveDashboard() {
  const [activeTab, setActiveTab] = useState('home');
  const [showTaskDropdown, setShowTaskDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowTaskDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const NAVIGATION = [
    { id: 'home', label: 'Trang chủ', icon: Home },
    { id: 'tasks', label: 'Tác vụ', suffix: 'Chọn nhanh', hasDropdown: true },
    { id: 'my-aidol', label: 'AIDOL của tôi', icon: UserSquare2 },
    { id: 'livestream-ai', label: 'Livestream AI', icon: Radio },
    { id: 'history', label: 'Lịch sử', icon: Clock },
    { id: 'guide', label: 'Hướng dẫn', icon: BookOpen },
  ];

  const QUICK_TASKS = [
    { id: 'create-aidol', label: 'Tạo AIDOL mới', desc: 'Từ ảnh nhân vật, ảnh mẫu và thiết lập thương hiệu của bạn.', icon: Sparkles, color: 'bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/50' },
    { id: 'studio', label: 'Sáng tạo bằng AIDOL', desc: 'Chọn công cụ và dựng video cho nhân vật.', icon: PlayCircle, color: 'bg-purple-500/20 text-purple-400 border border-purple-500/50' },
    { id: 'voice', label: 'Tạo giọng nói', desc: 'Tạo lời đọc, chọn giọng hoặc dùng giọng nhân bản.', icon: Mic, color: 'bg-pink-500/20 text-pink-400 border border-pink-500/50' },
    { id: 'lipsync', label: 'Tạo nhép môi', desc: 'Đồng bộ giọng nói và khẩu hình cho video.', icon: UserSquare2, color: 'bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/50' },
    { id: 'video', label: 'Tạo video', desc: 'Tạo video AI từ ý tưởng hoặc từ ảnh nguồn.', icon: Video, color: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50' },
    { id: 'image', label: 'Tạo ảnh riêng lẻ', desc: 'Tạo ảnh mới để dùng cho nội dung và chiến dịch.', icon: ImageIcon, color: 'bg-orange-500/20 text-orange-400 border border-orange-500/50' },
  ];

  return (
    // DARK THEME BACKGROUND (AVA Live Style)
    <div className="min-h-screen bg-[#0B0E14] text-white font-sans flex flex-col relative overflow-hidden">
      
      {/* Network Background Pattern - Dark */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
      </div>

      {/* TOP NAVIGATION BAR - GLASSMORPHISM DARK */}
      <header className="h-16 bg-[#121216]/80 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-4 sm:px-6 relative z-50 shadow-lg">
        
        {/* LOGO: KOL LIVE */}
        <div className="flex items-center gap-3 mr-8 cursor-pointer" onClick={() => setActiveTab('home')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00FF66] to-[#00CC52] flex items-center justify-center shadow-glow-green">
            <Radio className="w-6 h-6 text-black" />
          </div>
          <div>
            <h1 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#00FF66] to-white tracking-wider uppercase">
              AVA LIVE
            </h1>
          </div>
        </div>

        {/* MAIN MENU */}
        <nav className="hidden lg:flex flex-1 items-center justify-center gap-1">
          {NAVIGATION.map((item) => (
            <div key={item.id} className="relative" ref={item.hasDropdown ? dropdownRef : null}>
              <button
                onClick={() => {
                  if (item.hasDropdown) {
                    setShowTaskDropdown(!showTaskDropdown);
                  } else {
                    setActiveTab(item.id);
                    setShowTaskDropdown(false);
                  }
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                  (activeTab === item.id || (item.hasDropdown && showTaskDropdown))
                    ? 'text-[#00FF66] bg-[#00FF66]/10 shadow-[inset_0_0_10px_rgba(0,255,102,0.1)] border border-[#00FF66]/30' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                {item.label}
                {item.suffix && <span className="text-[10px] font-normal text-black bg-[#00FF66] px-1.5 py-0.5 rounded shadow-glow-green">{item.suffix}</span>}
                {item.badge && <span className="text-[10px] font-bold text-black bg-amber-400 px-1.5 py-0.5 rounded shadow-glow-yellow">{item.badge}</span>}
                {item.hasDropdown && <ChevronDown className={`w-4 h-4 transition-transform ${showTaskDropdown ? 'rotate-180' : ''}`} />}
              </button>

              {/* DROPDOWN MENU - TÁC VỤ */}
              {item.hasDropdown && showTaskDropdown && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[600px] bg-[#1A1F2B] rounded-2xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)] border border-white/10 p-4 z-50 backdrop-blur-xl">
                  <div className="flex items-center justify-between mb-4 px-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#00FF66] animate-pulse shadow-glow-green"></span> TÁC VỤ NHANH
                    </span>
                    <span className="text-xs font-bold text-gray-300 bg-white/10 px-2 py-1 rounded-full border border-white/5">Hôm nay bạn muốn tạo gì?</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {/* Primary Big Card */}
                    <button 
                      onClick={() => { setActiveTab('create-aidol'); setShowTaskDropdown(false); }}
                      className="col-span-2 flex items-center p-5 rounded-xl bg-gradient-to-r from-[#00FF66]/20 to-transparent border border-[#00FF66]/30 hover:border-[#00FF66] hover:shadow-glow-green transition-all text-left group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-[#00FF66]/20 flex items-center justify-center mr-4 backdrop-blur-sm border border-[#00FF66]/50 group-hover:bg-[#00FF66] transition-colors">
                        <Sparkles className="w-6 h-6 text-[#00FF66] group-hover:text-black transition-colors" />
                      </div>
                      <div className="flex-1">
                        <div className="text-[10px] uppercase font-bold text-[#00FF66] tracking-wider mb-0.5">Bắt đầu nhân vật</div>
                        <div className="text-lg font-black text-white mb-1">Tạo AIDOL mới</div>
                        <div className="text-xs text-gray-400">Từ ảnh nhân vật, ảnh mẫu và thiết lập thương hiệu của bạn.</div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#00FF66] group-hover:text-black transition-colors text-white border border-white/20">
                        <Plus className="w-4 h-4" />
                      </div>
                    </button>

                    {/* Secondary Cards */}
                    {QUICK_TASKS.slice(1).map((task) => (
                      <button 
                        key={task.id} 
                        onClick={() => { setActiveTab(task.id); setShowTaskDropdown(false); }}
                        className="flex items-start p-4 rounded-xl border border-white/5 hover:border-white/20 hover:bg-white/5 transition-colors text-left group bg-[#121216]"
                      >
                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-3 flex-shrink-0 ${task.color}`}>
                           <task.icon className="w-5 h-5" />
                         </div>
                         <div>
                           <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">{task.id}</div>
                           <div className="text-sm font-bold text-gray-200 mb-1 group-hover:text-white">{task.label}</div>
                           <div className="text-[10px] text-gray-500 leading-tight group-hover:text-gray-400 transition-colors">{task.desc}</div>
                         </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 relative z-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {activeTab === 'home' && <TrangChu />}
          {activeTab === 'create-aidol' && <TaoAIDOLMoi />}
          {activeTab === 'voice' && <WorkspaceTacVu defaultTab="voice" />}
          {activeTab === 'lipsync' && <WorkspaceTacVu defaultTab="lipsync" />}
          {(activeTab === 'video' || activeTab === 'image' || activeTab === 'studio') && <WorkspaceTacVu defaultTab="image-video" />}
          {activeTab === 'my-aidol' && <ThuVienAIDOL />}
          {activeTab === 'livestream-ai' && <LivestreamAISetup />}
          {activeTab === 'history' && <LichSuTao />}
          {activeTab === 'guide' && <HuongDanAcademy />}
        </div>
      </main>

    </div>
  );
}
