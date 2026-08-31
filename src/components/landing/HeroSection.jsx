import React from 'react';
import { Play } from 'lucide-react';
import TechEcosystemMap from '../TechEcosystemMap';

export default function HeroSection({ currentUser, setActiveTab, setGoogleLoginModalOpen }) {
  return (
    <section className="relative pt-36 pb-24 overflow-hidden flex flex-col items-center px-4" style={{
      background: 'radial-gradient(120% 120% at 50% -10%, #15102a 0%, #05050A 40%, #030305 100%)'
    }}>
      {/* Premium ambient light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* Left Text Content */}
        <div className="flex flex-col items-start text-left space-y-7">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 backdrop-blur-md shadow-[0_0_20px_rgba(99,102,241,0.15)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span>
            <span className="text-[10px] font-extrabold text-indigo-200 uppercase tracking-[0.2em]">AI LIVESTREAM AUTOMATION PLATFORM</span>
          </div>
          
          <h1 className="text-5xl md:text-[4rem] lg:text-[4.5rem] font-black text-white leading-[1.1] tracking-tight">
            ĐỪNG CHỈ LIVESTREAM.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-cyan-300 to-violet-300 inline-block mt-3 drop-shadow-[0_2px_20px_rgba(139,92,246,0.3)]">
              XÂY DỰNG CỖ MÁY <br className="hidden md:block"/> LIVESTREAM AI.
            </span>
          </h1>
          
          <p className="text-gray-400/90 text-lg md:text-xl leading-relaxed max-w-xl font-light">
            Biến <strong className="text-white font-medium">AI Idol, AI Voice, AI Brain</strong> và hàng vạn tương tác thành một hệ thống vận hành thông minh — giúp doanh nghiệp tự động hoá doanh số 24/7 từ một trung tâm duy nhất.
          </p>
          
          <div className="flex flex-wrap items-center gap-5 pt-6">
            <button 
              onClick={() => currentUser ? setActiveTab('profile') : setGoogleLoginModalOpen(true)}
              className="relative px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 text-white font-black text-sm uppercase tracking-widest shadow-[0_10px_40px_-10px_rgba(139,92,246,0.6)] hover:shadow-[0_15px_50px_-10px_rgba(139,92,246,0.8)] hover:-translate-y-1 transition-all duration-300 overflow-hidden group border border-white/10"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <span className="relative z-10">{currentUser ? "VÀO BẢNG ĐIỀU KHIỂN QUẢN TRỊ" : "BẮT ĐẦU VỚI AVA LIVE"}</span>
            </button>
            <a href="#demo-section" className="group px-8 py-4 rounded-2xl border border-white/10 text-gray-300 hover:text-white hover:border-white/30 font-bold text-sm uppercase tracking-widest flex items-center gap-3 bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all duration-300 cursor-pointer">
              KHÁM PHÁ <Play className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            </a>
          </div>
        </div>

        {/* Right AI Robot Illustration */}
        <div className="relative h-[650px] flex items-center justify-center">
           <TechEcosystemMap />
        </div>
      </div>
    </section>
  );
}
