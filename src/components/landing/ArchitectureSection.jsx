import React from 'react';
import RevealOnScroll from './RevealOnScroll';

export default function ArchitectureSection() {
  const layers = [
    { num: '06', title: 'DATA LAYER', desc: 'Analytics / Logs / KPI / Reports', color: 'border-pink-500/30 text-pink-400 bg-pink-500/10' },
    { num: '05', title: 'COMMERCE LAYER', desc: 'Product / Offer / Lead / Checkout', color: 'border-blue-500/30 text-blue-400 bg-blue-500/10' },
    { num: '04', title: 'EXPERIENCE LAYER', desc: 'Voice / Animation / Video / Scene / Music', color: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' },
    { num: '03', title: 'EVENT ENGINE', desc: 'Comment / Gift / Like / Follow / Trigger', color: 'border-amber-500/30 text-amber-400 bg-amber-500/10' },
    { num: '02', title: 'INTELLIGENCE LAYER', desc: 'AI Brain / Context / Knowledge / Decision', color: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10' },
    { num: '01', title: 'IDENTITY LAYER', desc: 'AI Idol / Brand Profile / Voice / Personality', color: 'border-violet-500/30 text-violet-400 bg-violet-500/10' }
  ];

  return (
    <section className="py-32 px-4 bg-[#030305] relative z-10 border-t border-white/5 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-b from-indigo-900/5 via-violet-900/5 to-transparent blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <RevealOnScroll>
          <span className="text-[10px] font-extrabold text-violet-300 uppercase tracking-[0.2em] border border-violet-500/20 bg-violet-500/10 backdrop-blur-md px-5 py-2 rounded-full inline-block mb-6 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
            KIẾN TRÚC AVA LIVE OS
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-violet-300 uppercase tracking-tight mb-20 leading-tight">
            MỘT HỆ ĐIỀU HÀNH CHO TOÀN BỘ <br className="hidden md:block"/> QUY TRÌNH LIVESTREAM
          </h2>
        </RevealOnScroll>

        <div className="relative">
          {/* Vertical connecting line with glowing effect */}
          <div className="absolute left-1/2 top-4 bottom-4 w-[2px] -translate-x-1/2 bg-gradient-to-b from-pink-500/20 via-cyan-500/20 to-violet-500/20 hidden md:block">
            <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-transparent via-cyan-400 to-transparent animate-[pulse_3s_ease-in-out_infinite] shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
          </div>
          
          <div className="flex flex-col gap-8">
            {layers.map((layer, index) => (
              <RevealOnScroll key={index}>
                <div className="relative bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 hover:bg-white/[0.04] hover:border-white/20 transition-all duration-500 z-10 mx-auto max-w-2xl group cursor-default shadow-[0_10px_40px_rgba(0,0,0,0.2)] hover:-translate-y-1">
                  <div className={`w-16 h-16 shrink-0 rounded-2xl border flex items-center justify-center font-black text-2xl shadow-[0_0_20px_rgba(0,0,0,0.5)] ${layer.color} group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                    {layer.num}
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-lg font-black text-white/90 tracking-widest uppercase mb-2 group-hover:text-white transition-colors">{layer.title}</h3>
                    <p className="text-[14px] font-light text-gray-400/80">{layer.desc}</p>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
