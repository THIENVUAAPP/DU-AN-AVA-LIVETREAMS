import React from 'react';
import RevealOnScroll from './RevealOnScroll';
import { Clock, BatteryWarning, Layers, DollarSign, MessageSquareOff, TrendingDown, AlertTriangle } from 'lucide-react';
import { landingTranslations } from './landingTranslations';

export default function PainPointsSection({ currentLang = 'vi' }) {
  const t = landingTranslations[currentLang] || landingTranslations.vi;

  const painPoints = [
    {
      icon: <Clock />,
      emoji: "⏳",
      title: t.pain1Title,
      desc: t.pain1Desc,
      gradient: "from-[#EC4899]/20 via-[#9333EA]/10 to-transparent",
      borderColor: "border-[#EC4899]/40 hover:border-[#EC4899]",
      glowColor: "shadow-[0_0_30px_rgba(236,72,153,0.25)] hover:shadow-[0_0_40px_rgba(236,72,153,0.5)]",
      badgeColor: "bg-gradient-to-br from-[#EC4899] to-[#BE185D] text-white",
      textColor: "text-[#EC4899]"
    },
    {
      icon: <BatteryWarning />,
      emoji: "🔋",
      title: t.pain2Title,
      desc: t.pain2Desc,
      gradient: "from-[#F59E0B]/20 via-[#EF4444]/10 to-transparent",
      borderColor: "border-[#F59E0B]/40 hover:border-[#F59E0B]",
      glowColor: "shadow-[0_0_30px_rgba(245,158,11,0.25)] hover:shadow-[0_0_40px_rgba(245,158,11,0.5)]",
      badgeColor: "bg-gradient-to-br from-[#F59E0B] to-[#D97706] text-white",
      textColor: "text-[#F59E0B]"
    },
    {
      icon: <Layers />,
      emoji: "🎭",
      title: t.pain3Title,
      desc: t.pain3Desc,
      gradient: "from-[#00F0FF]/20 via-[#3B82F6]/10 to-transparent",
      borderColor: "border-[#00F0FF]/40 hover:border-[#00F0FF]",
      glowColor: "shadow-[0_0_30px_rgba(0,240,255,0.25)] hover:shadow-[0_0_40px_rgba(0,240,255,0.5)]",
      badgeColor: "bg-gradient-to-br from-[#00F0FF] to-[#0284C7] text-white",
      textColor: "text-[#00F0FF]"
    },
    {
      icon: <DollarSign />,
      emoji: "💸",
      title: t.pain4Title,
      desc: t.pain4Desc,
      gradient: "from-[#EF4444]/20 via-[#9333EA]/10 to-transparent",
      borderColor: "border-[#EF4444]/40 hover:border-[#EF4444]",
      glowColor: "shadow-[0_0_30px_rgba(239,68,68,0.25)] hover:shadow-[0_0_40px_rgba(239,68,68,0.5)]",
      badgeColor: "bg-gradient-to-br from-[#EF4444] to-[#B91C1C] text-white",
      textColor: "text-[#EF4444]"
    },
    {
      icon: <MessageSquareOff />,
      emoji: "💬",
      title: t.pain5Title,
      desc: t.pain5Desc,
      gradient: "from-[#A855F7]/20 via-[#EC4899]/10 to-transparent",
      borderColor: "border-[#A855F7]/40 hover:border-[#A855F7]",
      glowColor: "shadow-[0_0_30px_rgba(168,85,247,0.25)] hover:shadow-[0_0_40px_rgba(168,85,247,0.5)]",
      badgeColor: "bg-gradient-to-br from-[#A855F7] to-[#7E22CE] text-white",
      textColor: "text-[#A855F7]"
    },
    {
      icon: <TrendingDown />,
      emoji: "📉",
      title: t.pain6Title,
      desc: t.pain6Desc,
      gradient: "from-[#8B5CF6]/20 via-[#00F0FF]/10 to-transparent",
      borderColor: "border-[#8B5CF6]/40 hover:border-[#8B5CF6]",
      glowColor: "shadow-[0_0_30px_rgba(139,92,246,0.25)] hover:shadow-[0_0_40px_rgba(139,92,246,0.5)]",
      badgeColor: "bg-gradient-to-br from-[#8B5CF6] to-[#4F46E5] text-white",
      textColor: "text-[#8B5CF6]"
    }
  ];

  return (
    <section className="py-28 px-4 bg-[#0A0618] relative z-10 border-t border-[#8B5CF6]/20 overflow-hidden">
      {/* Background Neon ambient lighting */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[#EC4899]/15 blur-[160px] rounded-full pointer-events-none"></div>
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-[#00F0FF]/15 blur-[160px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <RevealOnScroll>
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#EC4899]/50 bg-[#EC4899]/10 backdrop-blur-xl shadow-[0_0_20px_rgba(236,72,153,0.3)] mb-6">
              <AlertTriangle className="w-4 h-4 text-[#EC4899] animate-bounce" />
              <span className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-[#EC4899] via-white to-[#00F0FF] uppercase tracking-[0.2em]">
                {t.painBadge}
              </span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-6 leading-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
              {t.painTitle1} <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EF4444] via-[#EC4899] to-[#F59E0B]">
                {t.painTitle2}
              </span>
            </h2>
            <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto font-light">
              {t.painSubtitle}
            </p>
          </RevealOnScroll>
        </div>

        {/* 6 Pain Points Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {painPoints.map((point, index) => (
            <RevealOnScroll key={index} className="h-full">
              <div className={`bg-gradient-to-b from-[#191038]/90 via-[#100B26]/90 to-[#0B071B]/95 backdrop-blur-2xl border-2 ${point.borderColor} rounded-[28px] p-8 transition-all duration-500 hover:-translate-y-2 h-full flex flex-col group relative overflow-hidden ${point.glowColor}`}>
                
                {/* Glowing Top Corner Background */}
                <div className={`absolute top-0 right-0 w-44 h-44 bg-gradient-to-bl ${point.gradient} rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-700`}></div>
                
                {/* Header with Huge Emoji Badge */}
                <div className="flex items-center justify-between mb-7 relative z-10">
                  <div className={`w-18 h-18 rounded-2xl ${point.badgeColor} flex items-center justify-center text-3xl shadow-[0_0_25px_rgba(0,0,0,0.6)] group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border border-white/40 p-4`}>
                    <span>{point.emoji}</span>
                  </div>
                  <span className="text-xs font-black px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 uppercase tracking-widest">
                    {t.painIssue} #{index + 1}
                  </span>
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-black text-white mb-3 tracking-wide relative z-10 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-[#00F0FF] transition-all">
                  {point.title}
                </h3>
                <p className="text-gray-300/90 text-sm md:text-[15px] leading-relaxed font-light relative z-10 flex-1">
                  {point.desc}
                </p>

                {/* Bottom Status bar */}
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2 relative z-10">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                  <span className="text-xs font-bold text-red-400">{t.painLoss}</span>
                </div>

              </div>
            </RevealOnScroll>
          ))}
        </div>

      </div>
    </section>
  );
}
