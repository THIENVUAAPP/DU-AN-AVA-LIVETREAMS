import React from 'react';
import { Play } from 'lucide-react';
import TechEcosystemMap from '../TechEcosystemMap';

export default function HeroSection({ currentUser, setActiveTab, setGoogleLoginModalOpen }) {
  return (
    <section className="relative pt-32 pb-16 overflow-hidden flex flex-col items-center px-4" style={{
      backgroundImage: 'radial-gradient(circle at 50% 0%, #1c103f 0%, #05050A 50%)'
    }}>
      {/* Background Grid Lines */}
      <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* Left Text Content */}
        <div className="flex flex-col items-start text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#8B5CF6]/40 bg-[#8B5CF6]/10 backdrop-blur-sm shadow-[0_0_15px_rgba(139,92,246,0.2)]">
            <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-widest">AI LIVESTREAM AUTOMATION PLATFORM</span>
          </div>
          
          <h1 className="text-5xl md:text-[3.5rem] font-black text-white leading-[1.2] tracking-normal">
            ĐỪNG CHỈ LIVESTREAM.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 inline-block mt-2 drop-shadow-sm">
              HÃY XÂY DỰNG CỖ MÁY <br className="hidden md:block"/> LIVESTREAM AI.
            </span>
          </h1>
          
          <p className="text-gray-400 text-lg leading-relaxed max-w-xl font-medium">
            AVA LIVE biến AI Idol, AI Voice, AI Brain, video, bình luận và dữ liệu livestream thành một hệ thống vận hành thông minh — giúp doanh nghiệp tạo, phát, tương tác và tối ưu livestream từ một nơi.
          </p>
          
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button 
              onClick={() => currentUser ? setActiveTab('profile') : setGoogleLoginModalOpen(true)}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-600 text-white font-black text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:scale-105 hover:shadow-[0_0_40px_rgba(139,92,246,0.6)] transition-all cursor-pointer border border-white/10"
            >
              {currentUser ? "VÀO BẢNG ĐIỀU KHIỂN QUẢN TRỊ" : "BẮT ĐẦU VỚI AVA LIVE"}
            </button>
            <a href="#demo-section" className="px-8 py-4 rounded-full border border-white/20 text-white font-bold text-sm uppercase flex items-center gap-2 hover:bg-white/10 transition-all cursor-pointer">
              KHÁM PHÁ NỀN TẢNG <Play className="w-4 h-4 text-cyan-400" />
            </a>
          </div>

          <div className="pt-8 flex flex-col gap-2">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
              SYSTEM ONLINE
            </div>
            <div className="text-sm font-semibold text-gray-400">
              Real-time AI interaction • Multi-channel workflow • Centralized control
            </div>
            <div className="text-xs text-gray-600 italic">Designed for creators, sellers & modern businesses</div>
          </div>
        </div>

        {/* Right AI Robot Illustration (CSS Based mockup) */}
        <div className="relative h-[600px] flex items-center justify-center">
           <TechEcosystemMap />
        </div>
      </div>
    </section>
  );
}
