import React, { useState } from 'react';
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
  const [activeTab, setActiveTab] = useState('my-aidol');

  const NAVIGATION = [
    { id: 'my-aidol', label: 'AIDOL của tôi', icon: UserSquare2 },
    { id: 'voice', label: 'Giọng nói', icon: Mic },
    { id: 'livestream-ai', label: 'Tạo Video & Live', icon: Radio },
    { id: 'history', label: 'Lịch sử', icon: Clock },
    { id: 'guide', label: 'Hướng dẫn', icon: BookOpen },
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
        <div className="flex items-center gap-3 mr-4 cursor-pointer" onClick={() => setActiveTab('my-aidol')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00FF66] to-[#00CC52] flex items-center justify-center shadow-glow-green">
            <Radio className="w-6 h-6 text-black" />
          </div>
          <div>
            <h1 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#00FF66] to-white tracking-wider uppercase hidden xl:block">
              AVA LIVE
            </h1>
          </div>
        </div>

        {/* MAIN MENU */}
        <nav className="flex flex-1 items-center justify-center gap-1 overflow-x-auto custom-scrollbar px-2">
          {NAVIGATION.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-full text-[11px] lg:text-sm font-bold transition-all duration-200 whitespace-nowrap ${
                activeTab === item.id
                  ? 'text-[#00FF66] bg-[#00FF66]/10 shadow-[inset_0_0_10px_rgba(0,255,102,0.1)] border border-[#00FF66]/30' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <item.icon className="w-4 h-4 hidden sm:block" />
              {item.label}
            </button>
          ))}
        </nav>

      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 relative z-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {activeTab === 'voice' && <WorkspaceTacVu defaultTab="voice" />}
          {activeTab === 'my-aidol' && <ThuVienAIDOL />}
          {activeTab === 'livestream-ai' && <LivestreamAISetup />}
          {activeTab === 'history' && <LichSuTao />}
          {activeTab === 'guide' && <HuongDanAcademy />}
        </div>
      </main>

    </div>
  );
}
