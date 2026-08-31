import React from 'react';
import RevealOnScroll from './RevealOnScroll';

export default function ArchitectureSection() {
  const layers = [
    { num: '06', title: 'DATA LAYER', desc: 'Analytics / Logs / KPI / Reports', color: 'border-pink-500/50 text-pink-400' },
    { num: '05', title: 'COMMERCE LAYER', desc: 'Product / Offer / Lead / Checkout', color: 'border-blue-500/50 text-blue-400' },
    { num: '04', title: 'EXPERIENCE LAYER', desc: 'Voice / Animation / Video / Scene / Music', color: 'border-emerald-500/50 text-emerald-400' },
    { num: '03', title: 'EVENT ENGINE', desc: 'Comment / Gift / Like / Follow / Trigger', color: 'border-amber-500/50 text-amber-400' },
    { num: '02', title: 'INTELLIGENCE LAYER', desc: 'AI Brain / Context / Knowledge / Decision', color: 'border-cyan-500/50 text-cyan-400' },
    { num: '01', title: 'IDENTITY LAYER', desc: 'AI Idol / Brand Profile / Voice / Personality', color: 'border-violet-500/50 text-violet-400' }
  ];

  return (
    <section className="py-24 px-4 bg-[#05050A] relative z-10 border-t border-white/5">
      <div className="max-w-4xl mx-auto text-center">
        <RevealOnScroll>
          <span className="text-xs font-bold text-violet-400 uppercase tracking-widest border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 rounded-full inline-block mb-4">
            KIẾN TRÚC AVA LIVE OS
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-wider mb-16">
            MỘT HỆ ĐIỀU HÀNH CHO TOÀN BỘ <br className="hidden md:block"/> QUY TRÌNH LIVESTREAM
          </h2>
        </RevealOnScroll>

        <div className="relative">
          {/* Vertical connecting line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 bg-gradient-to-b from-pink-500 via-cyan-500 to-violet-500 opacity-20 hidden md:block"></div>
          
          <div className="flex flex-col gap-6">
            {layers.map((layer, index) => (
              <RevealOnScroll key={index}>
                <div className="relative bg-[#101725]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 hover:bg-[#172033] hover:border-white/20 transition-all z-10 mx-auto max-w-2xl group cursor-default">
                  <div className={`w-14 h-14 shrink-0 rounded-full border-2 flex items-center justify-center font-black text-xl shadow-lg bg-black ${layer.color} group-hover:scale-110 transition-transform`}>
                    {layer.num}
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-lg font-black text-white tracking-widest uppercase mb-1">{layer.title}</h3>
                    <p className="text-sm font-mono text-gray-400">{layer.desc}</p>
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
