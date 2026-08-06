import React from 'react';
import { Radio, MonitorPlay, ShoppingCart, MessageSquare, Copy, Users, BarChart3, Link, ShieldCheck, Zap } from 'lucide-react';

const features = [
  { id: 1, name: "LIVE ĐA NỀN TẢNG", icon: <MonitorPlay className="w-8 h-8 text-cyan-400" />, shadow: "shadow-[0_0_20px_rgba(6,182,212,0.6)]" },
  { id: 2, name: "AI AVATAR", icon: <Zap className="w-8 h-8 text-purple-400" />, shadow: "shadow-[0_0_20px_rgba(168,85,247,0.6)]" },
  { id: 3, name: "CHỐT ĐƠN TỰ ĐỘNG", icon: <ShoppingCart className="w-8 h-8 text-emerald-400" />, shadow: "shadow-[0_0_20px_rgba(16,185,129,0.6)]" },
  { id: 4, name: "CHATBOT AI", icon: <MessageSquare className="w-8 h-8 text-pink-400" />, shadow: "shadow-[0_0_20px_rgba(236,72,153,0.6)]" },
  { id: 5, name: "CLONE LUỒNG", icon: <Copy className="w-8 h-8 text-amber-400" />, shadow: "shadow-[0_0_20px_rgba(245,158,11,0.6)]" },
  { id: 6, name: "QUẢN LÝ ĐA TK", icon: <Users className="w-8 h-8 text-blue-400" />, shadow: "shadow-[0_0_20px_rgba(59,130,246,0.6)]" },
  { id: 7, name: "PHÂN TÍCH DATA", icon: <BarChart3 className="w-8 h-8 text-indigo-400" />, shadow: "shadow-[0_0_20px_rgba(99,102,241,0.6)]" },
  { id: 8, name: "HỆ THỐNG AFF", icon: <Link className="w-8 h-8 text-rose-400" />, shadow: "shadow-[0_0_20px_rgba(244,63,94,0.6)]" }
];

export default function TechEcosystemMap() {
  return (
    <div className="relative w-full py-24 bg-[#030308] overflow-hidden flex flex-col lg:flex-row items-center justify-center font-sans">
      
      {/* Background Grid & Glows */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-[1400px] w-full mx-auto px-6 flex flex-col lg:flex-row items-center justify-between z-10">
          {/* LEFT: Orbiting Ecosystem */}
          <div className="w-full lg:w-1/2 flex items-center justify-center relative min-h-[700px]">
            
            {/* Core Center */}
            <div className="absolute z-20 flex flex-col items-center justify-center w-48 h-48 bg-black/80 rounded-full border-2 border-cyan-500/40 shadow-[0_0_80px_rgba(6,182,212,0.4)] backdrop-blur-xl">
               <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/10 to-purple-500/10 animate-pulse"></div>
               <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-tr from-[#EF4444] via-[#8B5CF6] to-[#06B6D4] p-[2px] shadow-2xl mb-3">
                  <img 
                    src="/official_logo.jpg" 
                    alt="AvaLive PRO Core" 
                    className="w-full h-full object-cover rounded-[14px]"
                  />
               </div>
               <div className="flex items-center gap-1.5 bg-[#111118] border border-white/10 px-3 py-1 rounded-full shadow-inner">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></div>
                  <span className="text-white font-black text-[10px] tracking-widest drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] uppercase">Core AI 24/7</span>
               </div>
            </div>

            {/* Radar Rings */}
            <div className="absolute w-[350px] h-[350px] rounded-full border border-white/5 shadow-[inset_0_0_50px_rgba(255,255,255,0.02)]"></div>
            <div className="absolute w-[550px] h-[550px] rounded-full border border-white/10 border-dashed animate-[spin_60s_linear_infinite]"></div>

            {/* Orbit Container */}
            <div className="absolute w-[550px] h-[550px] animate-[spin_40s_linear_infinite]">
              {/* SVG Dotted Lines from center to nodes */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 550 550">
                 {features.map((f, i) => {
                    const angle = (i / features.length) * 360;
                    return (
                       <line 
                         key={i}
                         x1="275" y1="275" 
                         x2="275" y2="25" 
                         stroke="rgba(6, 182, 212, 0.5)" 
                         strokeWidth="1.5"
                         strokeDasharray="4 6" 
                         transform={`rotate(${angle} 275 275)`} 
                         className="animate-pulse"
                       />
                    );
                 })}
              </svg>

              {/* Nodes */}
              {features.map((f, i) => {
                const angle = (i / features.length) * 360;
                return (
                  <div 
                    key={f.id}
                    className="absolute top-1/2 left-1/2"
                    style={{ 
                      transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-250px)` 
                    }}
                  >
                    {/* Anti-spin container to keep text upright */}
                    <div 
                      className="flex flex-col items-center justify-center bg-[#0B0B13]/95 backdrop-blur-xl border border-white/10 rounded-[20px] w-[100px] h-[100px] hover:scale-110 transition-transform cursor-pointer animate-[spin_40s_linear_infinite_reverse] group"
                      style={{ animationDirection: 'reverse' }}
                    >
                       <div className={`absolute inset-0 rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${f.shadow}`}></div>
                       <div className="mb-2 z-10">{f.icon}</div>
                       <span className="text-[9px] font-black text-center text-white z-10 px-2 leading-tight uppercase tracking-wider opacity-80 group-hover:opacity-100">{f.name}</span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* RIGHT: Detail Blocks */}
          <div className="w-full lg:w-1/2 flex flex-col gap-8 relative z-10 px-8 lg:px-12 mt-16 lg:mt-0">
             <div className="mb-2 relative">
                <div className="absolute -left-6 top-2 w-1.5 h-16 bg-gradient-to-b from-cyan-400 to-purple-600 rounded-full"></div>
                <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] mb-4">
                   HỆ SINH THÁI <br/>
                   <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-gradient-x">CÔNG NGHỆ LÕI</span>
                </h2>
                <p className="text-gray-400 text-sm lg:text-base leading-relaxed max-w-lg font-medium">
                   AvaLive PRO được kiến trúc dựa trên lõi AI trung tâm, phân nhánh sức mạnh xử lý ra toàn bộ hệ sinh thái giúp tối ưu hóa luồng dữ liệu và tự động hóa 100% quy trình bán hàng.
                </p>
             </div>

             <div className="space-y-4">
                 {/* Info Block 1 */}
                 <div className="bg-[#111118]/80 backdrop-blur-md border border-white/5 p-5 rounded-2xl relative group overflow-hidden shadow-xl hover:border-cyan-500/50 transition-colors">
                    <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10">
                       <h3 className="text-base font-black text-white mb-1.5 flex items-center gap-2"><MonitorPlay className="w-4 h-4 text-cyan-400" /> KẾT NỐI API THỜI GIAN THỰC</h3>
                       <p className="text-xs text-gray-400 font-medium">Tích hợp mượt mà với TikTok, Shopee, Facebook qua giao thức WebSocket, đảm bảo đồng bộ đơn hàng và bình luận dưới 0.1 giây.</p>
                    </div>
                 </div>

                 {/* Info Block 2 */}
                 <div className="bg-[#111118]/80 backdrop-blur-md border border-white/5 p-5 rounded-2xl relative group overflow-hidden shadow-xl hover:border-purple-500/50 transition-colors">
                    <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10">
                       <h3 className="text-base font-black text-white mb-1.5 flex items-center gap-2"><Zap className="w-4 h-4 text-purple-400" /> MÔ HÌNH NGÔN NGỮ ĐA CHIỀU</h3>
                       <p className="text-xs text-gray-400 font-medium">Lõi AI xử lý hàng triệu tham số NLP để MC ảo hiểu ngữ cảnh, tương tác mượt mà và tự động điều hướng khách hàng chốt đơn.</p>
                    </div>
                 </div>

                 {/* Info Block 3 */}
                 <div className="bg-[#111118]/80 backdrop-blur-md border border-white/5 p-5 rounded-2xl relative group overflow-hidden shadow-xl hover:border-emerald-500/50 transition-colors">
                    <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10">
                       <h3 className="text-base font-black text-white mb-1.5 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-400" /> HẠ TẦNG BẢO MẬT ĐÁM MÂY</h3>
                       <p className="text-xs text-gray-400 font-medium">Dữ liệu được lưu trữ trên nền tảng Supabase Enterprise với chuẩn mã hóa AES-256, sao lưu tự động và phân quyền nghiêm ngặt.</p>
                    </div>
                 </div>
             </div>

          </div>
      </div>
    </div>
  );
}
