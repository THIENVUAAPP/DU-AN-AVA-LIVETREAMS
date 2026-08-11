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

// --- PLACEHOLDER COMPONENTS FOR PAGES ---
const PlaceholderPage = ({ title }) => (
  <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
    <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center mb-6">
      <Sparkles className="w-12 h-12 text-blue-500" />
    </div>
    <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
    <p className="text-gray-500 max-w-md">
      Hệ thống đang được nâng cấp luồng và kết nối backend cho module này. 
      Vui lòng quay lại sau!
    </p>
  </div>
);

// --- MAIN DASHBOARD (TOP NAV LAYOUT) ---
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
    { id: 'api', label: 'API', badge: 'Beta', icon: Code2 },
    { id: 'payment', label: 'Thanh toán', icon: CreditCard },
  ];

  const QUICK_TASKS = [
    { id: 'create-aidol', label: 'Tạo AIDOL mới', desc: 'Từ ảnh nhân vật, ảnh mẫu và thiết lập thương hiệu của bạn.', icon: Sparkles, color: 'bg-blue-500' },
    { id: 'studio', label: 'Sáng tạo bằng AIDOL', desc: 'Chọn công cụ và dựng video cho nhân vật.', icon: PlayCircle, color: 'bg-purple-100 text-purple-600' },
    { id: 'voice', label: 'Tạo giọng nói', desc: 'Tạo lời đọc, chọn giọng hoặc dùng giọng nhân bản.', icon: Mic, color: 'bg-pink-100 text-pink-600' },
    { id: 'lipsync', label: 'Tạo nhép môi', desc: 'Đồng bộ giọng nói và khẩu hình cho video.', icon: UserSquare2, color: 'bg-emerald-100 text-emerald-600' },
    { id: 'video', label: 'Tạo video', desc: 'Tạo video AI từ ý tưởng hoặc từ ảnh nguồn.', icon: Video, color: 'bg-cyan-100 text-cyan-600' },
    { id: 'image', label: 'Tạo ảnh riêng lẻ', desc: 'Tạo ảnh mới để dùng cho nội dung và chiến dịch.', icon: ImageIcon, color: 'bg-orange-100 text-orange-600' },
  ];

  return (
    // LIGHT THEME BACKGROUND with faint network pattern (CSS pattern)
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans flex flex-col relative overflow-hidden">
      
      {/* Network Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
      </div>

      {/* TOP NAVIGATION BAR */}
      <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 relative z-50 shadow-sm">
        
        {/* LOGO: KOL LIVE */}
        <div className="flex items-center gap-3 mr-8 cursor-pointer" onClick={() => setActiveTab('home')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
            <Radio className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-800">
              KOL LIVE
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
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-slate-600 hover:text-blue-600 hover:bg-slate-100'
                }`}
              >
                {item.label}
                {item.suffix && <span className="text-[10px] font-normal text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{item.suffix}</span>}
                {item.badge && <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">{item.badge}</span>}
                {item.hasDropdown && <ChevronDown className={`w-4 h-4 transition-transform ${showTaskDropdown ? 'rotate-180' : ''}`} />}
              </button>

              {/* DROPDOWN MENU - TÁC VỤ */}
              {item.hasDropdown && showTaskDropdown && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[600px] bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-slate-100 p-4 z-50">
                  <div className="flex items-center justify-between mb-4 px-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span> TÁC VỤ NHANH
                    </span>
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-full">Hôm nay bạn muốn tạo gì?</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {/* Primary Big Card */}
                    <button className="col-span-2 flex items-center p-5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-lg hover:shadow-blue-500/30 transition-all text-left group">
                      <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mr-4 backdrop-blur-sm">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="text-[10px] uppercase font-bold text-blue-100 tracking-wider mb-0.5">Bắt đầu nhân vật</div>
                        <div className="text-lg font-black mb-1">Tạo AIDOL mới</div>
                        <div className="text-xs text-blue-50">Từ ảnh nhân vật, ảnh mẫu và thiết lập thương hiệu của bạn.</div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-blue-600 transition-colors">
                        <Plus className="w-4 h-4" />
                      </div>
                    </button>

                    {/* Secondary Cards */}
                    {QUICK_TASKS.slice(1).map((task) => (
                      <button key={task.id} className="flex items-start p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-colors text-left group">
                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-3 flex-shrink-0 ${task.color}`}>
                           <task.icon className="w-5 h-5" />
                         </div>
                         <div>
                           <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{task.id}</div>
                           <div className="text-sm font-bold text-slate-800 mb-1 group-hover:text-blue-600">{task.label}</div>
                           <div className="text-[10px] text-slate-500 leading-tight">{task.desc}</div>
                         </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* ACCOUNT / SETTINGS */}
        <div className="flex items-center gap-3">
          <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border border-blue-200 text-blue-600 text-sm font-bold hover:bg-blue-50 transition-colors">
            Thanh toán
          </button>
          <button className="flex items-center gap-2 px-1 pl-1 pr-4 py-1 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
              AI
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-800">Tài khoản</span>
              <span className="text-[9px] text-slate-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Online
              </span>
            </div>
          </button>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 relative z-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {activeTab === 'home' && <TrangChu />}
          {activeTab === 'my-aidol' && <ThuVienAIDOL />}
          {activeTab === 'livestream-ai' && <LivestreamAISetup />}
          {activeTab === 'history' && <LichSuTao />}
          {activeTab === 'guide' && <HuongDanAcademy />}
          {activeTab === 'payment' && <ThanhToanCoin />}
          {activeTab === 'api' && <AIDOLLiveConsole />}
        </div>
      </main>

    </div>
  );
}
