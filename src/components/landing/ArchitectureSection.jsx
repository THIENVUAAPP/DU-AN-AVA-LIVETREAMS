import React from 'react';
import RevealOnScroll from './RevealOnScroll';
import { Layers, Sparkles, Cpu, ShieldCheck } from 'lucide-react';
import { landingTranslations } from './landingTranslations';

export default function ArchitectureSection({ currentLang = 'vi' }) {
  const t = landingTranslations[currentLang] || landingTranslations.vi;

  const layers = [
    { num: '06', emoji: '📊', title: t.layer6Title, desc: t.layer6Desc, color: 'from-[#EC4899] to-[#F43F5E]', border: 'border-[#EC4899]/50 hover:border-[#EC4899]', glow: 'shadow-[0_0_30px_rgba(236,72,153,0.3)]', badge: 'bg-[#EC4899]/20 text-[#EC4899]' },
    { num: '05', emoji: '🛒', title: t.layer5Title, desc: t.layer5Desc, color: 'from-[#3B82F6] to-[#00F0FF]', border: 'border-[#3B82F6]/50 hover:border-[#00F0FF]', glow: 'shadow-[0_0_30px_rgba(59,130,246,0.3)]', badge: 'bg-[#3B82F6]/20 text-[#00F0FF]' },
    { num: '04', emoji: '🎬', title: t.layer4Title, desc: t.layer4Desc, color: 'from-[#10B981] to-[#00F0FF]', border: 'border-[#10B981]/50 hover:border-[#10B981]', glow: 'shadow-[0_0_30px_rgba(16,185,129,0.3)]', badge: 'bg-[#10B981]/20 text-[#10B981]' },
    { num: '03', emoji: '⚡', title: t.layer3Title, desc: t.layer3Desc, color: 'from-[#F59E0B] to-[#EF4444]', border: 'border-[#F59E0B]/50 hover:border-[#F59E0B]', glow: 'shadow-[0_0_30px_rgba(245,158,11,0.3)]', badge: 'bg-[#F59E0B]/20 text-[#F59E0B]' },
    { num: '02', emoji: '🧠', title: t.layer2Title, desc: t.layer2Desc, color: 'from-[#00F0FF] to-[#A855F7]', border: 'border-[#00F0FF]/50 hover:border-[#00F0FF]', glow: 'shadow-[0_0_30px_rgba(0,240,255,0.3)]', badge: 'bg-[#00F0FF]/20 text-[#00F0FF]' },
    { num: '01', emoji: '👸', title: t.layer1Title, desc: t.layer1Desc, color: 'from-[#9333EA] to-[#EC4899]', border: 'border-[#9333EA]/50 hover:border-[#EC4899]', glow: 'shadow-[0_0_30px_rgba(147,51,234,0.3)]', badge: 'bg-[#9333EA]/20 text-[#EC4899]' }
  ];

  return (
    <section className="py-28 px-4 bg-[#080512] relative z-10 border-t border-[#8B5CF6]/20 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-b from-[#9333EA]/15 via-[#EC4899]/15 to-[#00F0FF]/15 blur-[180px] rounded-full pointer-events-none"></div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        
        {/* Section Header */}
        <RevealOnScroll>
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#00F0FF]/50 bg-[#00F0FF]/10 backdrop-blur-xl shadow-[0_0_20px_rgba(0,240,255,0.3)] mb-6">
            <Cpu className="w-4 h-4 text-[#00F0FF] animate-pulse" />
            <span className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-white to-[#EC4899] uppercase tracking-[0.2em]">
              {t.archBadge}
            </span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-4 leading-tight drop-shadow-[0_4px_25px_rgba(0,0,0,0.8)]">
            {t.archTitle1} <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-[#EC4899] to-[#9333EA]">
              {t.archTitle2}
            </span>
          </h2>
          <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto font-light mb-16">
            {t.archSubtitle}
          </p>
        </RevealOnScroll>

        <div className="relative">
          {/* Laser beam with neon animated pulse */}
          <div className="absolute left-1/2 top-4 bottom-4 w-[3px] -translate-x-1/2 bg-gradient-to-b from-[#EC4899] via-[#00F0FF] to-[#9333EA] shadow-[0_0_15px_#00F0FF] hidden md:block">
            <div className="absolute top-0 left-[-2px] w-[7px] h-24 bg-white rounded-full blur-[2px] animate-bounce"></div>
          </div>
          
          <div className="flex flex-col gap-7">
            {layers.map((layer, index) => (
              <RevealOnScroll key={index}>
                <div className={`relative bg-gradient-to-r from-[#1A103A]/95 via-[#120B29]/95 to-[#0B071B]/98 backdrop-blur-2xl border-2 ${layer.border} rounded-[28px] p-6 md:p-8 flex flex-col md:flex-row items-center gap-7 transition-all duration-500 z-10 mx-auto max-w-3xl group cursor-default ${layer.glow} hover:-translate-y-1.5`}>
                  
                  {/* Huge Circular Glowing Badge */}
                  <div className={`w-20 h-20 shrink-0 rounded-2xl bg-gradient-to-br ${layer.color} border-2 border-white/50 flex flex-col items-center justify-center shadow-[0_0_25px_rgba(0,0,0,0.6)] group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 relative`}>
                    <span className="text-2xl">{layer.emoji}</span>
                    <span className="text-[10px] font-black text-white uppercase tracking-wider font-mono">{t.archLayer} {layer.num}</span>
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                      <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${layer.badge} border border-white/10 uppercase tracking-widest`}>
                        {t.archLayer} {layer.num}
                      </span>
                    </div>
                    <h3 className="text-lg md:text-xl font-black text-white tracking-wide uppercase mb-1.5 group-hover:text-[#00F0FF] transition-colors">
                      {layer.title}
                    </h3>
                    <p className="text-sm md:text-[15px] font-light text-gray-300/90 leading-relaxed">
                      {layer.desc}
                    </p>
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
