import re

with open("src/components/TechEcosystemMap.jsx", "r", encoding="utf-8") as f:
    content = f.read()

new_content = """import React from 'react';
import { Radio, MonitorPlay, ShoppingCart, MessageSquare, Copy, Users, BarChart3, Link, ShieldCheck, Zap } from 'lucide-react';

const features = [
  { id: 1, name: "LIVE ĐA NỀN TẢNG", icon: <MonitorPlay className="w-6 h-6 text-cyan-400" />, shadow: "shadow-[0_0_15px_rgba(6,182,212,0.6)]", color: "#22d3ee" },
  { id: 2, name: "AI AVATAR", icon: <Zap className="w-6 h-6 text-purple-400" />, shadow: "shadow-[0_0_15px_rgba(168,85,247,0.6)]", color: "#c084fc" },
  { id: 3, name: "CHỐT ĐƠN TỰ ĐỘNG", icon: <ShoppingCart className="w-6 h-6 text-emerald-400" />, shadow: "shadow-[0_0_15px_rgba(16,185,129,0.6)]", color: "#34d399" },
  { id: 4, name: "CHATBOT AI", icon: <MessageSquare className="w-6 h-6 text-pink-400" />, shadow: "shadow-[0_0_15px_rgba(236,72,153,0.6)]", color: "#f472b6" },
  { id: 5, name: "CLONE LUỒNG", icon: <Copy className="w-6 h-6 text-amber-400" />, shadow: "shadow-[0_0_15px_rgba(245,158,11,0.6)]", color: "#fbbf24" },
  { id: 6, name: "QUẢN LÝ ĐA TK", icon: <Users className="w-6 h-6 text-blue-400" />, shadow: "shadow-[0_0_15px_rgba(59,130,246,0.6)]", color: "#60a5fa" },
  { id: 7, name: "PHÂN TÍCH DATA", icon: <BarChart3 className="w-6 h-6 text-indigo-400" />, shadow: "shadow-[0_0_15px_rgba(99,102,241,0.6)]", color: "#818cf8" },
  { id: 8, name: "HỆ THỐNG AFF", icon: <Link className="w-6 h-6 text-rose-400" />, shadow: "shadow-[0_0_15px_rgba(244,63,94,0.6)]", color: "#fb7185" }
];

export default function TechEcosystemMap() {
  return (
    <div className="relative w-full h-[500px] flex items-center justify-center">
      <style>
        {`
          @keyframes flowToCenter {
            0% { stroke-dashoffset: 20; }
            100% { stroke-dashoffset: 0; }
          }
          .animate-flow-lines {
            animation: flowToCenter 1s linear infinite;
          }
        `}
      </style>
      
      {/* Background Glows */}
      <div className="absolute w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Core Center */}
      <div className="absolute z-20 flex flex-col items-center justify-center w-36 h-36 bg-[#05050A]/90 rounded-full border border-cyan-500/50 shadow-[0_0_60px_rgba(6,182,212,0.5)] backdrop-blur-md">
         <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/10 to-purple-500/10 animate-pulse"></div>
         <div className="relative w-16 h-16 rounded-[14px] bg-gradient-to-tr from-[#EF4444] via-[#8B5CF6] to-[#06B6D4] p-0.5 shadow-2xl mb-2">
            <img 
              src="/official_logo.jpg" 
              alt="AvaLive Core" 
              className="w-full h-full object-cover rounded-[12px]"
            />
         </div>
         <div className="flex items-center gap-1.5 bg-[#111118] border border-white/10 px-2 py-0.5 rounded-full shadow-inner">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></div>
            <span className="text-cyan-400 font-black text-[9px] tracking-widest uppercase drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]">Core AI</span>
         </div>
      </div>

      {/* Radar Rings */}
      <div className="absolute w-[250px] h-[250px] rounded-full border border-white/10"></div>
      <div className="absolute w-[450px] h-[450px] rounded-full border border-white/10 border-dashed animate-[spin_60s_linear_infinite]"></div>

      {/* Orbit Container */}
      <div className="absolute w-[450px] h-[450px] animate-[spin_40s_linear_infinite]">
        {/* SVG Flow Lines from nodes to center */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 450 450">
           {features.map((f, i) => {
              const angle = (i / features.length) * 360;
              return (
                 <line 
                   key={i}
                   x1="225" y1="20"   // Node position (outer)
                   x2="225" y2="225"  // Center position
                   stroke={f.color} 
                   strokeWidth="2"
                   strokeDasharray="5 5" 
                   transform={`rotate(${angle} 225 225)`} 
                   className="animate-flow-lines"
                   style={{ opacity: 0.6 }}
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
                transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-205px)` 
              }}
            >
              {/* Anti-spin container to keep text upright */}
              <div 
                className="flex flex-col items-center justify-center bg-[#0B0B13]/90 backdrop-blur-md border border-white/10 rounded-2xl w-24 h-24 hover:scale-110 transition-transform cursor-pointer animate-[spin_40s_linear_infinite_reverse] group"
                style={{ animationDirection: 'reverse' }}
              >
                 <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${f.shadow}`}></div>
                 <div className="mb-1.5 z-10">{f.icon}</div>
                 <span className="text-[9px] font-black text-center text-white z-10 px-1 leading-tight uppercase tracking-wider">{f.name}</span>
              </div>
            </div>
          );
        })}
      </div>
      
    </div>
  );
}
"""

with open("src/components/TechEcosystemMap.jsx", "w", encoding="utf-8") as f:
    f.write(new_content)

print("Updated TechEcosystemMap.jsx")
