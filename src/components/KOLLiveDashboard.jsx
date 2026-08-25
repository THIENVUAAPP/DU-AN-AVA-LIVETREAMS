import React, { useState } from 'react';
import { 
  UserSquare2, Radio, Clock, BookOpen, Mic, Video, Sparkles, Download, 
  ChevronRight, Shield, Zap, HelpCircle, Layers, MonitorPlay
} from 'lucide-react';

import LichSuTao from './genaidol/LichSuTao';
import HuongDanAcademy from './genaidol/HuongDanAcademy';
import ThuVienAIDOL from './genaidol/ThuVienAIDOL';
import LivestreamAISetup from './genaidol/LivestreamAISetup';
import AIVoiceModule from './kol-live/AIVoiceModule';

export default function KOLLiveDashboard() {
  const [activeTab, setActiveTab] = useState('my-aidol');

  const NAVIGATION = [
    { id: 'my-aidol', label: 'Kho AIDOL Của Tôi', desc: 'Thư viện nhân vật AI Idol 4K', icon: UserSquare2, badge: 'HOT' },
    { id: 'voice', label: 'Giọng Nói AI Voice', desc: 'Clone giọng & thu âm tiếng Việt', icon: Mic, badge: 'AI' },
    { id: 'livestream-ai', label: 'Tạo Video & Live AI', desc: 'Phòng thu tạo video & kịch bản live', icon: Radio, badge: 'PRO' },
    { id: 'history', label: 'Lịch Sử Hoạt Động', desc: 'Nhật ký tạo & dữ liệu phiên live', icon: Clock },
    { id: 'guide', label: 'Học Viện & Hướng Dẫn', desc: '13 Bài học livestream kiếm tiền', icon: BookOpen, badge: 'VIP' },
  ];

  return (
    <div className="min-h-screen bg-[#07090E] text-white font-sans flex flex-col lg:flex-row relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* ─── LEFT SIDEBAR NAVIGATION ─── */}
      <aside className="w-full lg:w-72 bg-[#0C0F17]/95 backdrop-blur-2xl border-r border-white/10 flex flex-col shrink-0 z-30 shadow-2xl">
        {/* Sidebar Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/30">
              <div className="w-full h-full bg-[#080B12] rounded-2xl flex items-center justify-center">
                <Radio className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <h1 className="text-base font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent uppercase tracking-wider">
                AVA LIVE STUDIO
              </h1>
              <p className="text-[10px] text-gray-400 font-semibold">Trung Tâm Quản Trị AI Idol</p>
            </div>
          </div>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 p-3.5 space-y-1.5 overflow-y-auto custom-scrollbar">
          <div className="px-3 py-2 text-[10px] font-black uppercase tracking-wider text-gray-500">
            CHỨC NĂNG CHÍNH
          </div>
          {NAVIGATION.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all duration-200 group cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500/20 via-teal-500/15 to-transparent border border-emerald-400/40 text-white shadow-lg shadow-emerald-500/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                    isActive 
                      ? 'bg-emerald-400 text-black shadow-md shadow-emerald-400/50' 
                      : 'bg-white/5 text-gray-400 group-hover:text-emerald-400 group-hover:bg-white/10'
                  }`}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-bold truncate group-hover:text-white flex items-center gap-1.5">
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-black ${
                          isActive ? 'bg-emerald-400 text-black' : 'bg-white/10 text-emerald-400'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-gray-500 truncate">{item.desc}</div>
                  </div>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform ${isActive ? 'text-emerald-400 translate-x-0.5' : 'text-gray-600 opacity-0 group-hover:opacity-100'}`} />
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer Card */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-950/40 to-cyan-950/30 border border-cyan-500/20 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-black">
              <Sparkles className="w-4 h-4" />
              <span>BẢN QUYỀN VIP PRO</span>
            </div>
            <p className="text-[10px] text-gray-400 leading-relaxed">
              Mở khóa 100% tính năng phòng thu AI 4K, 63 tỉnh thành & game chiến đấu.
            </p>
          </div>
        </div>
      </aside>

      {/* ─── MAIN CONTENT AREA ─── */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {activeTab === 'voice' && <AIVoiceModule />}
          {activeTab === 'my-aidol' && <ThuVienAIDOL />}
          {activeTab === 'livestream-ai' && <LivestreamAISetup />}
          {activeTab === 'history' && <LichSuTao />}
          {activeTab === 'guide' && <HuongDanAcademy />}
        </div>
      </main>
    </div>
  );
}
