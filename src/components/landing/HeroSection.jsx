import React from 'react';
import { Play, Sparkles, Zap, ShieldCheck, Flame } from 'lucide-react';
import TechEcosystemMap from '../TechEcosystemMap';

export default function HeroSection({ currentUser, setActiveTab, setGoogleLoginModalOpen }) {
  return (
    <section className="relative pt-36 pb-24 overflow-hidden flex flex-col items-center px-4 bg-[#080512]">
      {/* Dynamic Multi-Color Ambient Neon Glows */}
      <div className="absolute top-[-100px] left-1/4 w-[600px] h-[500px] bg-gradient-to-br from-[#9333EA]/30 via-[#EC4899]/25 to-transparent blur-[140px] rounded-full pointer-events-none animate-pulse"></div>
      <div className="absolute top-[100px] right-1/4 w-[600px] h-[500px] bg-gradient-to-bl from-[#00F0FF]/25 via-[#3B82F6]/20 to-transparent blur-[140px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-gradient-to-t from-[#EC4899]/15 via-[#8B5CF6]/15 to-transparent blur-[160px] rounded-full pointer-events-none"></div>

      {/* Cyber Grid Pattern with glowing mask */}
      <div className="absolute inset-0 bg-[radial-gradient(#8B5CF6_1px,transparent_1px)] [background-size:28px_28px] opacity-15 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* Left Text Content */}
        <div className="flex flex-col items-start text-left space-y-7">
          
          {/* Glowing Top Badge */}
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-[#00F0FF]/40 bg-gradient-to-r from-[#9333EA]/20 via-[#EC4899]/20 to-[#00F0FF]/20 backdrop-blur-xl shadow-[0_0_25px_rgba(0,240,255,0.25)] relative overflow-hidden group">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F0FF] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00F0FF] shadow-[0_0_10px_#00F0FF]"></span>
            </span>
            <span className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#00F0FF] to-[#EC4899] uppercase tracking-[0.2em] drop-shadow-sm">
              ✨ NỀN TẢNG AI LIVESTREAM TỶ ĐÔ THẾ HỆ MỚI
            </span>
          </div>
          
          {/* Main Title */}
          <h1 className="text-5xl md:text-[4.2rem] lg:text-[4.8rem] font-black text-white leading-[1.1] tracking-tight drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
            ĐỪNG CHỈ LIVE.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-[#EC4899] to-[#A855F7] inline-block mt-3 filter drop-shadow-[0_0_35px_rgba(236,72,153,0.5)]">
              XÂY DỰNG CỖ MÁY <br className="hidden md:block"/> LIVESTREAM AI.
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl font-normal drop-shadow">
            Hợp nhất sức mạnh của <span className="text-[#00F0FF] font-bold drop-shadow-[0_0_10px_rgba(0,240,255,0.6)]">AI Idol</span>, <span className="text-[#EC4899] font-bold drop-shadow-[0_0_10px_rgba(236,72,153,0.6)]">AI Voice</span>, <span className="text-[#A855F7] font-bold drop-shadow-[0_0_10px_rgba(168,85,247,0.6)]">AI Brain</span> và luồng bán hàng tự động 24/7 để tạo ra doanh số đột phá!
          </p>
          
          {/* CTA Buttons with Neon Radiance */}
          <div className="flex flex-wrap items-center gap-5 pt-4">
            <button 
              onClick={() => currentUser ? setActiveTab('profile') : setGoogleLoginModalOpen(true)}
              className="relative px-9 py-4 rounded-2xl bg-gradient-to-r from-[#00F0FF] via-[#EC4899] to-[#9333EA] text-white font-black text-sm uppercase tracking-widest shadow-[0_0_35px_rgba(236,72,153,0.6)] hover:shadow-[0_0_50px_rgba(0,240,255,0.8)] hover:scale-105 transition-all duration-300 overflow-hidden group border border-white/30 cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <span className="relative z-10 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-white animate-spin" style={{ animationDuration: '4s' }} />
                {currentUser ? "VÀO BẢNG ĐIỀU KHIỂN QUẢN TRỊ" : "BẮT ĐẦU VỚI AVA LIVE NGAY"}
              </span>
            </button>
            
            <a 
              href="#demo-section" 
              className="group px-8 py-4 rounded-2xl border-2 border-[#8B5CF6]/50 hover:border-[#00F0FF] text-white font-bold text-sm uppercase tracking-widest flex items-center gap-3 bg-gradient-to-r from-[#1E113F]/80 to-[#120A2B]/80 hover:bg-[#2A1859] backdrop-blur-xl shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(0,240,255,0.4)] transition-all duration-300 cursor-pointer"
            >
              KHÁM PHÁ <Play className="w-4 h-4 text-[#00F0FF] group-hover:scale-125 transition-transform drop-shadow-[0_0_8px_#00F0FF]" />
            </a>
          </div>

          {/* Glowing Status Badges */}
          <div className="pt-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#170E33] to-[#110A26] border border-[#00F0FF]/30 shadow-[0_0_15px_rgba(0,240,255,0.15)]">
              <Zap className="w-4 h-4 text-[#00F0FF]" />
              <span className="text-xs font-bold text-white">Tương Tác Real-time &lt; 0.5s</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#170E33] to-[#110A26] border border-[#EC4899]/30 shadow-[0_0_15px_rgba(236,72,153,0.15)]">
              <Flame className="w-4 h-4 text-[#EC4899]" />
              <span className="text-xs font-bold text-white">Live 24/7 Không Nghỉ</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#170E33] to-[#110A26] border border-[#A855F7]/30 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
              <ShieldCheck className="w-4 h-4 text-[#A855F7]" />
              <span className="text-xs font-bold text-white">Bảo Mật Chuẩn Doanh Nghiệp</span>
            </div>
          </div>

        </div>

        {/* Right AI Robot Illustration */}
        <div className="relative h-[650px] flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-r from-[#9333EA]/20 via-[#EC4899]/20 to-[#00F0FF]/20 blur-[100px] rounded-full pointer-events-none"></div>
          <TechEcosystemMap />
        </div>
      </div>
    </section>
  );
}
