import { handleOSDownload } from '../utils/downloadOS';
import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, CheckCircle2, ArrowRight, Zap, ShieldCheck, 
  Tv, Users, CreditCard, ChevronRight, ChevronDown, Crown, Star, 
  BarChart2, Share2, Globe, HeartHandshake, Building2,
  Play, MousePointerClick, MessageSquare, Smartphone, Facebook,
  Bot, Clock, ShoppingCart, ShoppingBag, Lock, Headphones, Search, MonitorPlay,
  DollarSign, TrendingUp, Layers, User, UserSquare2, Video, Activity, Brain, Image as ImageIcon, Mic, Download, LogOut
} from 'lucide-react';
import SePayModal from './SePayModal';
import TechEcosystemMap from './TechEcosystemMap';
import { getPlans } from '../lib/plansConfig';
import { supabase } from '../lib/supabaseClient';
import { getCurrentLanguage, setCurrentLanguage } from '../utils/i18n';
import { landingTranslations } from './landing/landingTranslations';

import HeroSection from './landing/HeroSection';
import PainPointsSection from './landing/PainPointsSection';
import SolutionFeaturesSection from './landing/SolutionFeaturesSection';
import SuperPowersSection from './landing/SuperPowersSection';
import ArchitectureSection from './landing/ArchitectureSection';
const IconMap = {
  MonitorPlay,
  Zap,
  Crown,
  Building2
};

const customStyles = `
  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes marquee-reverse {
    0% { transform: translateX(-50%); }
    100% { transform: translateX(0); }
  }
  .animate-marquee {
    animation: marquee 40s linear infinite;
  }
  .animate-marquee-reverse {
    animation: marquee-reverse 40s linear infinite;
  }
  .marquee-container:hover .animate-marquee,
  .marquee-container:hover .animate-marquee-reverse {
    animation-play-state: paused;
  }
`;

// Intersection Observer Hook for Scroll Animations
function useOnScreen(options) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
    }, options);
    
    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [ref, options]);

  return [ref, isVisible];
}

const RevealOnScroll = ({ children, className = '' }) => {
  const [ref, isVisible] = useOnScreen({ threshold: 0.1 });
  return (
    <div ref={ref} className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${className}`}>
      {children}
    </div>
  );
};

export default function SalesLandingPage({ setGoogleLoginModalOpen, currentUser, setActiveTab }) {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [isScrolled, setIsScrolled] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [sepayModalOpen, setSepayModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [currentLang, setCurrentLangState] = useState(() => {
    const saved = getCurrentLanguage();
    return saved === 'en' ? 'en' : 'vi';
  });

  const handleLanguageChange = (langCode) => {
    setCurrentLanguage(langCode);
    setCurrentLangState(langCode);
  };

  useEffect(() => {
    const handleLang = (e) => {
      if (e.detail?.language) {
        setCurrentLangState(e.detail.language === 'en' ? 'en' : 'vi');
      }
    };
    window.addEventListener('avalive_language_changed', handleLang);
    return () => window.removeEventListener('avalive_language_changed', handleLang);
  }, []);

  const t = landingTranslations[currentLang] || landingTranslations.vi;
  
  const handlePurchase = (plan) => {
    if (!currentUser) {
      alert(currentLang === 'vi' ? "Bạn cần Đăng nhập bằng Google trước khi mua gói!" : "Please Sign In with Google before purchasing a plan!");
      setGoogleLoginModalOpen(true);
      return;
    }
    
    if (plan.monthly === 0 || plan.name.includes('MIỄN PHÍ') || plan.name.includes('FREE')) {
       alert(currentLang === 'vi' ? `Gói ${plan.name} đã được kích hoạt thành công cho tài khoản của bạn.` : `${plan.name} plan has been activated successfully for your account.`);
       setActiveTab('broadcast');
       return;
    }

    setSelectedPlan(plan);
    setSepayModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#070410] text-gray-100 font-sans overflow-x-hidden selection:bg-[#EC4899] selection:text-white">
      <style>{customStyles}</style>
      
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-[100] bg-[#070410]/95 backdrop-blur-2xl border-b border-[#8B5CF6]/30 py-4 px-6 transition-all shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo(0, 0)}>
            <div className="relative">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-[#00F0FF] via-[#EC4899] to-[#9333EA] rounded-2xl blur-sm opacity-80 group-hover:opacity-100 transition duration-500 animate-pulse"></div>
              <div className="relative w-11 h-11 rounded-xl bg-[#0F0A20] p-0.5 shadow-2xl group-hover:scale-105 transition-all border border-white/30">
                <img src="/official_logo.jpg" alt="AvaLive" className="w-full h-full object-cover rounded-[10px]" />
              </div>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-1.5 leading-none">
              <span className="text-[#00F0FF] drop-shadow-[0_0_12px_rgba(0,240,255,0.8)]">AVA</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EC4899] via-[#A855F7] to-white font-black drop-shadow-[0_0_12px_rgba(236,72,153,0.8)]">LIVE</span>
            </h1>
          </div>

          <nav className="hidden lg:flex items-center gap-7">
            <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="text-sm font-bold text-white hover:text-[#00F0FF] transition-all cursor-pointer">{t.navHome}</button>
            <a 
              href="#" onClick={handleOSDownload}
              className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-[#EC4899] to-[#A855F7] hover:scale-105 transition-all cursor-pointer flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/5 border border-[#EC4899]/40 shadow-[0_0_15px_rgba(236,72,153,0.3)] hover:shadow-[0_0_25px_rgba(0,240,255,0.5)]"
              title={currentLang === 'vi' ? "Tải Về File ZIP Phần Mềm (Mac & Win)" : "Download Desktop Application ZIP (Mac & Win)"}
            >
              <Download className="w-4 h-4 text-[#00F0FF]" />
              <span>{t.navDownload}</span>
            </a>
            <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm font-bold text-gray-300 hover:text-white transition-all cursor-pointer">{t.navFeatures}</button>
            <button onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm font-bold text-gray-300 hover:text-white transition-all cursor-pointer">{t.navPricing}</button>
            <button onClick={() => document.getElementById('guide')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm font-bold text-gray-300 hover:text-white transition-all cursor-pointer">{t.navGuide}</button>
            <button onClick={() => document.getElementById('affiliate-intro')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] to-[#EC4899] hover:opacity-80 transition-all cursor-pointer">{t.navAffiliate}</button>
            <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm font-bold text-gray-300 hover:text-white transition-all cursor-pointer">{t.navContact}</button>
          </nav>

          <div className="flex items-center gap-4">
            {/* Language Switcher Switch */}
            <div className="flex items-center bg-[#150D2E] border border-[#8B5CF6]/40 rounded-full p-1 shadow-[0_0_15px_rgba(139,92,246,0.25)]">
              <button 
                onClick={() => handleLanguageChange('vi')}
                className={`px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${currentLang === 'vi' ? 'bg-gradient-to-r from-[#EC4899] to-[#9333EA] text-white shadow-[0_0_12px_rgba(236,72,153,0.6)]' : 'text-gray-400 hover:text-white'}`}
                title="Chuyển sang Tiếng Việt"
              >
                <span>🇻🇳</span>
                <span>VI</span>
              </button>
              <button 
                onClick={() => handleLanguageChange('en')}
                className={`px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${currentLang === 'en' ? 'bg-gradient-to-r from-[#00F0FF] to-[#3B82F6] text-white shadow-[0_0_12px_rgba(0,240,255,0.6)]' : 'text-gray-400 hover:text-white'}`}
                title="Switch to English"
              >
                <span>🇺🇸</span>
                <span>EN</span>
              </button>
            </div>

            {!currentUser ? (
              <button 
                onClick={() => setGoogleLoginModalOpen(true)}
                className="px-6 py-2.5 rounded-full border-2 border-[#00F0FF]/50 hover:border-[#EC4899] bg-gradient-to-r from-[#00F0FF]/10 to-[#EC4899]/10 text-white font-bold text-sm hover:scale-105 shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] transition-all cursor-pointer"
              >
                {t.navLogin}
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="w-9 h-9 rounded-full bg-[#161622] border-2 border-white/10 hover:border-[#EF4444] transition-all shadow-sm cursor-pointer p-0.5 group shrink-0"
                  title="Mở menu tài khoản"
                >
                  <img 
                    src={currentUser?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback"} 
                    className="w-full h-full rounded-full object-cover" 
                    alt="Avatar" 
                  />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-80 min-w-[320px] glass-panel p-4 rounded-3xl border border-white/20 shadow-2xl z-[150] space-y-2.5 text-xs bg-[#0A0A0A]/98 backdrop-blur-2xl animate-fadeIn">
                    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-[#121218] to-black border border-white/15 space-y-1.5">
                      <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                        <svg className="w-3 h-3" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                        </svg>
                        {t.googleAccount}
                      </span>
                      <p className="font-mono text-emerald-400 font-black text-xs truncate">{currentUser.email}</p>
                      <div className="flex items-center justify-between pt-1">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[9px] font-black inline-block">
                          {currentUser.isAdmin ? `👑 ${t.superAdminVip}` : `🟢 ${t.vipLicense}`}
                        </span>
                        <span className="text-[10px] text-amber-300 font-mono font-bold">
                          🪙 {(currentUser.tokens || 100000).toLocaleString()} Tokens
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1 pt-1">
                      <button onClick={() => { setActiveTab("profile"); setProfileDropdownOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-gray-200 hover:text-white hover:bg-white/10 font-bold text-xs transition-all text-left cursor-pointer">
                        <User className="w-4 h-4 text-[#EF4444]" /><span>{t.profileAndDeposit}</span>
                      </button>
                      <button onClick={() => { setActiveTab("affiliate-dashboard"); setProfileDropdownOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-gray-200 hover:text-white hover:bg-white/10 font-bold text-xs transition-all text-left cursor-pointer">
                        <Share2 className="w-4 h-4 text-emerald-400" /><span>{t.affiliateProgram}</span>
                      </button>
                      <button onClick={() => { setActiveTab("sales-analytics"); setProfileDropdownOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[#EF4444] hover:bg-[#EF4444]/10 font-black text-xs transition-all text-left cursor-pointer">
                        <ShoppingBag className="w-4 h-4 text-[#EF4444]" /><span>{t.salesManagement}</span>
                      </button>
                      <button onClick={() => { setActiveTab("team"); setProfileDropdownOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-gray-200 hover:text-white hover:bg-white/10 font-bold text-xs transition-all text-left cursor-pointer">
                        <ShieldCheck className="w-4 h-4 text-purple-400" /><span>{t.teamPermissions}</span>
                      </button>
                      {(currentUser.isAdmin || currentUser?.email === 'quocthiencr90@gmail.com') && (
                        <div className="space-y-1 pt-1.5 border-t border-white/10">
                          <button onClick={() => { setActiveTab("admin"); setProfileDropdownOpen(false); }} className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 font-black text-xs transition-all text-left cursor-pointer">
                            <div className="flex items-center gap-2.5"><ShieldCheck className="w-4 h-4 text-amber-400" /><span>{t.adminSystem}</span></div>
                            <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                          </button>
                        </div>
                      )}
                    </div>
                    {/* Logout Button */}
                    <div className="pt-2 border-t border-white/10">
                      <button
                        onClick={async () => {
                          await supabase.auth.signOut();
                          localStorage.removeItem('avalive_current_user');
                          window.location.reload();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-400 hover:bg-red-500/10 font-bold text-xs transition-all text-left cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-red-400" />
                        <span>{t.logout}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 1. HERO SECTION */}
      <HeroSection 
        currentUser={currentUser} 
        setActiveTab={setActiveTab} 
        setGoogleLoginModalOpen={setGoogleLoginModalOpen} 
        currentLang={currentLang}
      />

      {/* 1.1 PAIN POINTS */}
      <PainPointsSection currentLang={currentLang} />

      {/* 1.2 SOLUTION FEATURES */}
      <SolutionFeaturesSection currentLang={currentLang} />

      {/* 1.3 SUPER POWERS */}
      <SuperPowersSection currentLang={currentLang} />

      {/* 2. FEATURES RIBBON (MARQUEE) */}
      <section id="features" className="border-y border-white/[0.02] bg-[#030305] py-8 relative z-20 overflow-hidden marquee-container shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-[#030305] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-[#030305] to-transparent z-10 pointer-events-none"></div>
        
        <div className="flex w-max animate-marquee">
          <div className="flex w-max justify-around items-center px-4 gap-8">
            <RibbonItem icon={<Globe />} title={t.ribbonLive} subtitle={t.ribbonLiveSub} color="text-purple-400" borderCol="border-purple-500" />
            <RibbonItem icon={<MessageSquare />} title={t.ribbonChatbot} subtitle={t.ribbonChatbotSub} color="text-cyan-400" borderCol="border-cyan-500" />
            <RibbonItem icon={<ShoppingCart />} title={t.ribbonSales} subtitle={t.ribbonSalesSub} color="text-amber-400" borderCol="border-amber-500" />
            <RibbonItem icon={<CreditCard />} title={t.ribbonPayment} subtitle={t.ribbonPaymentSub} color="text-orange-400" borderCol="border-orange-500" />
            <RibbonItem icon={<Users />} title={t.ribbonManage} subtitle={t.ribbonManageSub} color="text-emerald-400" borderCol="border-emerald-500" />
            <RibbonItem icon={<BarChart2 />} title={t.ribbonReport} subtitle={t.ribbonReportSub} color="text-blue-400" borderCol="border-blue-500" />
          </div>
          <div className="flex w-max justify-around items-center px-4 gap-8">
            <RibbonItem icon={<Globe />} title={t.ribbonLive} subtitle={t.ribbonLiveSub} color="text-purple-400" borderCol="border-purple-500" />
            <RibbonItem icon={<MessageSquare />} title={t.ribbonChatbot} subtitle={t.ribbonChatbotSub} color="text-cyan-400" borderCol="border-cyan-500" />
            <RibbonItem icon={<ShoppingCart />} title={t.ribbonSales} subtitle={t.ribbonSalesSub} color="text-amber-400" borderCol="border-amber-500" />
            <RibbonItem icon={<CreditCard />} title={t.ribbonPayment} subtitle={t.ribbonPaymentSub} color="text-orange-400" borderCol="border-orange-500" />
            <RibbonItem icon={<Users />} title={t.ribbonManage} subtitle={t.ribbonManageSub} color="text-emerald-400" borderCol="border-emerald-500" />
            <RibbonItem icon={<BarChart2 />} title={t.ribbonReport} subtitle={t.ribbonReportSub} color="text-blue-400" borderCol="border-blue-500" />
          </div>
        </div>
      </section>

      {/* 3. VIDEO & WHY CHOOSE US */}
      <section id="demo-section" className="py-20 px-4 max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left: Video Player */}
          <RevealOnScroll className="rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-md hover:bg-white/[0.04] transition-colors p-6 shadow-2xl relative overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white uppercase tracking-wider">{t.videoTitle}</h3>
            </div>
            
            <div className="relative flex-1 rounded-2xl bg-black border border-white/5 overflow-hidden group cursor-pointer aspect-video flex items-center justify-center" onClick={() => setIsVideoPlaying(true)}>
              {!isVideoPlaying ? (
                <>
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#1a103c] via-[#05050A] to-[#121c33] opacity-80"></div>
                  
                  {/* Central Play Button */}
                  <div className="relative z-10 w-20 h-20 rounded-full border border-purple-500/50 bg-purple-500/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(139,92,246,0.4)]">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                  
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                     <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 opacity-20 blur-[2px]">AVA</span>
                     <span className="text-2xl font-bold text-white opacity-40">LIVE</span>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 bg-black flex items-center justify-center">
                  <p className="text-gray-400 animate-pulse font-mono">{currentLang === 'vi' ? 'Đang tải video demo...' : 'Loading demo video...'}</p>
                </div>
              )}
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-[#FBBF24] font-bold text-sm uppercase tracking-widest">{t.videoSub1}</p>
              <p className="text-gray-400 text-xs tracking-widest">{t.videoSub2}</p>
            </div>
          </RevealOnScroll>

          {/* Right: Why Choose Us */}
          <RevealOnScroll className="rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-md hover:bg-white/[0.04] transition-colors p-8 shadow-2xl">
            <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-8">{t.whyChooseTitle}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FeatureCard icon={<Clock />} title={t.why1Title} desc={t.why1Desc} color="text-purple-400" bg="bg-purple-500/10" border="border-purple-500/20" />
              <FeatureCard icon={<BarChart2 />} title={t.why2Title} desc={t.why2Desc} color="text-blue-400" bg="bg-blue-500/10" border="border-blue-500/20" />
              <FeatureCard icon={<Zap />} title={t.why3Title} desc={t.why3Desc} color="text-cyan-400" bg="bg-cyan-500/10" border="border-cyan-500/20" />
              <FeatureCard icon={<MousePointerClick />} title={t.why4Title} desc={t.why4Desc} color="text-orange-400" bg="bg-orange-500/10" border="border-orange-500/20" />
              <FeatureCard icon={<ShieldCheck />} title={t.why5Title} desc={t.why5Desc} color="text-red-400" bg="bg-red-500/10" border="border-red-500/20" />
              <FeatureCard icon={<Headphones />} title={t.why6Title} desc={t.why6Desc} color="text-emerald-400" bg="bg-emerald-500/10" border="border-emerald-500/20" />
            </div>
          </RevealOnScroll>

        </div>
      </section>

      {/* 4. REALTIME AI CORE SECTION */}
      <section className="py-20 px-4 max-w-7xl mx-auto relative z-10">
         <div className="bg-white/[0.02] backdrop-blur-md rounded-3xl border border-white/10 shadow-lg p-8 lg:p-12 relative overflow-hidden">
            {/* Background connecting lines */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
               <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                 <path d="M 100 200 L 500 200" stroke="#00FF66" strokeWidth="2" fill="none" />
                 <path d="M 900 200 L 500 200" stroke="#00FF66" strokeWidth="2" fill="none" />
               </svg>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 relative z-10">
               <div>
                 <h2 className="text-2xl font-black text-white tracking-tight">{currentLang === 'vi' ? 'BỘ NÃO ĐIỀU KHIỂN AVA LIVE REALTIME' : 'AVA LIVE REALTIME AI ENGINE'}</h2>
                 <p className="text-sm text-gray-400 font-medium">{currentLang === 'vi' ? 'AI trung tâm điều phối tiến trình, tín hiệu truyền liên tục qua từng nhánh xử lý.' : 'Central AI orchestration engine transmitting continuous signals across all modules.'}</p>
               </div>
               <div className="mt-4 md:mt-0 flex items-center gap-4 bg-black/40 px-4 py-2 rounded-xl border border-white/10 shadow-inner">
                  <span className="text-xs font-bold text-gray-400">{currentLang === 'vi' ? 'Tải hệ thống' : 'System Load'}</span>
                  <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-[#00FF66] w-[75%] shadow-glow-green"></div>
                  </div>
                  <span className="text-xs font-black text-[#00FF66]">75%</span>
               </div>
            </div>

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
               {/* Left nodes */}
               <div className="flex flex-col gap-6 w-full lg:w-64">
                  <div className="bg-black/40 border border-white/10 shadow-sm rounded-xl p-4 hover:border-[#00FF66]/30 transition-colors">
                    <div className="font-bold text-white text-sm mb-1">{currentLang === 'vi' ? 'Tạo hình ảnh AI' : 'AI Avatar Generation'}</div>
                    <div className="text-[10px] text-gray-400 mb-3">{currentLang === 'vi' ? 'Đang tạo mẫu nhân vật #708' : 'Generating Idol Model #708'}</div>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-[#00FF66] w-[40%] shadow-glow-green"></div></div>
                  </div>
                  <div className="bg-black/40 border border-white/10 shadow-sm rounded-xl p-4 ml-8 hover:border-amber-500/30 transition-colors">
                    <div className="font-bold text-white text-sm mb-1">{currentLang === 'vi' ? 'Hồ sơ Thần Tượng' : 'Idol Profile Layer'}</div>
                    <div className="text-[10px] text-gray-400 mb-3">{currentLang === 'vi' ? 'Đang kiểm tra chất lượng #750' : 'Verifying profile quality #750'}</div>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-amber-500 w-[80%] shadow-glow-yellow"></div></div>
                  </div>
                  <div className="bg-black/40 border border-white/10 shadow-sm rounded-xl p-4 hover:border-purple-500/30 transition-colors">
                    <div className="font-bold text-white text-sm mb-1">{currentLang === 'vi' ? 'Giọng nói AI Cảm Xúc' : 'Emotional AI Voice'}</div>
                    <div className="text-[10px] text-gray-400 mb-3">{currentLang === 'vi' ? 'Đang xử lý biểu cảm #715' : 'Processing emotional voice #715'}</div>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-purple-500 w-[60%] shadow-glow-purple"></div></div>
                  </div>
               </div>

               {/* Center Core */}
               <div className="flex flex-col items-center">
                  <div className="flex gap-4 mb-8">
                    <div className="text-center"><div className="text-2xl font-black text-[#00FF66]">39</div><div className="text-[10px] font-bold text-gray-500 uppercase">{currentLang === 'vi' ? 'Job chạy' : 'Active'}</div></div>
                    <div className="text-center"><div className="text-2xl font-black text-[#00FF66]">697</div><div className="text-[10px] font-bold text-gray-500 uppercase">{currentLang === 'vi' ? 'Hoàn tất' : 'Done'}</div></div>
                    <div className="text-center"><div className="text-2xl font-black text-amber-500">13</div><div className="text-[10px] font-bold text-gray-500 uppercase">{currentLang === 'vi' ? 'Đang chờ' : 'Queued'}</div></div>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#00FF66]/20 blur-2xl rounded-full animate-pulse"></div>
                    <div className="bg-black/80 border border-[#00FF66]/50 p-8 rounded-2xl shadow-glow-green relative z-10 text-center w-56 backdrop-blur-md">
                       <Activity className="w-10 h-10 text-[#00FF66] mx-auto mb-2" />
                       <h3 className="text-lg font-black text-[#00FF66]">AVA LIVE</h3>
                       <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Realtime Core</div>
                    </div>
                  </div>
               </div>

               {/* Right nodes */}
               <div className="flex flex-col gap-6 w-full lg:w-64">
                  <div className="bg-black/40 border border-white/10 shadow-sm rounded-xl p-4 hover:border-emerald-500/30 transition-colors">
                    <div className="font-bold text-white text-sm mb-1">{currentLang === 'vi' ? 'Đồng bộ Khẩu hình' : 'Lipsync Synchronization'}</div>
                    <div className="text-[10px] text-gray-400 mb-3">{currentLang === 'vi' ? 'Đang đồng bộ môi #729' : 'Matching lipsync #729'}</div>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 w-[30%] shadow-glow-green"></div></div>
                  </div>
                  <div className="bg-black/40 border border-white/10 shadow-sm rounded-xl p-4 mr-8 hover:border-blue-500/30 transition-colors">
                    <div className="font-bold text-white text-sm mb-1">{currentLang === 'vi' ? 'Xử lý Đơn hàng' : 'Order Processing'}</div>
                    <div className="text-[10px] text-gray-400 mb-3">{currentLang === 'vi' ? 'Đang kích hoạt mã giảm giá #757' : 'Triggering discount #757'}</div>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-blue-500 w-[90%] shadow-glow-blue"></div></div>
                  </div>
                  <div className="bg-black/40 border border-white/10 shadow-sm rounded-xl p-4 hover:border-cyan-500/30 transition-colors">
                    <div className="font-bold text-white text-sm mb-1">{currentLang === 'vi' ? 'Kịch bản Chốt Sale' : 'Dynamic Closing Script'}</div>
                    <div className="text-[10px] text-gray-400 mb-3">{currentLang === 'vi' ? 'Đang phát sóng kịch bản #736' : 'Broadcasting script #736'}</div>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-cyan-500 w-[100%] shadow-glow-blue"></div></div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 5.1 ARCHITECTURE SECTION */}
      <ArchitectureSection currentLang={currentLang} />

      {/* 6. PRICING SECTION */}
      <section id="pricing" className="py-20 px-4 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12 flex flex-col items-center">
          <h2 className="text-3xl font-black text-white uppercase tracking-wider mb-8">{t.pricingTitle}</h2>
          
          <div className="flex items-center gap-2 bg-white/[0.02] backdrop-blur-md hover:bg-white/[0.04] transition-colors p-1.5 rounded-full border border-white/10 relative">
            <button 
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${billingCycle === 'monthly' ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              {t.payMonthly}
            </button>
            <button 
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all relative ${billingCycle === 'yearly' ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              {t.payYearly}
              <div className="absolute -top-3 -right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.6)] animate-pulse border border-white/20 whitespace-nowrap">
                {t.gift2Months}
              </div>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto w-full">
          {getPlans().map((plan, i) => {
            const Icon = IconMap[plan.iconName] || MonitorPlay;
            
            // Bilingual localized plan content
            let displayName = plan.name;
            let displayDesc = plan.desc;
            let displayBtn = plan.btnText;
            let displayFeatures = plan.features;

            if (currentLang === 'en') {
              if (plan.id === 'FREE' || plan.name.includes('MIỄN PHÍ')) {
                displayName = 'FREE TIER';
                displayDesc = 'Basic experience, unlimited time';
                displayBtn = 'START FOR FREE';
                displayFeatures = [
                  '1 Streaming Platform',
                  'Auto Sales (50 orders/mo)',
                  'Standard AI Chatbot',
                  'Community Support'
                ];
              } else if (plan.id === 'PRO' || plan.name.includes('CHUYÊN NGHIỆP')) {
                displayName = 'PROFESSIONAL';
                displayDesc = 'For professional online sellers & creators';
                displayBtn = 'BUY NOW';
                displayFeatures = [
                  '5 Platforms Streaming',
                  'Advanced AI Chatbot & Brain',
                  '500 Orders / Month',
                  'Automated Payments',
                  'Detailed Sales Analytics',
                  '24/7 Priority Support',
                  'API Integration'
                ];
              } else if (plan.id === 'BUSINESS' || plan.name.includes('DOANH NGHIỆP')) {
                displayName = 'ENTERPRISE';
                displayDesc = 'For medium & large scaling brands';
                displayBtn = 'BUY NOW';
                displayFeatures = [
                  'Unlimited Streaming Platforms',
                  'Intelligent AI Brain',
                  'Unlimited Orders',
                  'Advanced Auto Payments',
                  'Advanced Revenue Analytics',
                  '24/7 VIP Support',
                  'Full API Integration'
                ];
              } else if (plan.id === 'LIFETIME' || plan.name.includes('TRỌN ĐỜI')) {
                displayName = 'LIFETIME VIP';
                displayDesc = 'Lifetime ownership - No monthly fees';
                displayBtn = 'BUY NOW';
                displayFeatures = [
                  'All Enterprise Features',
                  'Unlimited Streaming Platforms',
                  'Unlimited Orders',
                  'Lifetime VIP Support',
                  'Free Lifetime Updates',
                  'Full API Integration'
                ];
              }
            }

            return (
            <RevealOnScroll key={i} className={`relative flex flex-col h-full rounded-[2rem] border bg-[#0B0B13]/80 backdrop-blur-xl overflow-hidden transition-all duration-500 hover:-translate-y-3 cursor-pointer active:scale-90 group hover:border-blue-500/50 ${plan.borderColor} ${plan.isPopular ? 'shadow-[0_0_40px_rgba(59,130,246,0.25)] hover:shadow-[0_0_60px_rgba(59,130,246,0.4)] ring-1 ring-blue-500/50 md:-translate-y-4' : 'hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] hover:border-white/20'}`} onClick={() => handlePurchase(plan)}>
              
              {/* Glassmorphism shine effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

              {plan.isPopular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-[10px] font-black uppercase tracking-widest py-1.5 px-5 rounded-bl-2xl shadow-[0_4px_15px_rgba(59,130,246,0.5)] z-10">
                  {t.popular}
                </div>
              )}

              <div className="p-8 pb-6 text-center border-b border-white/5 relative z-10 flex flex-col items-center flex-shrink-0">
                <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center bg-gradient-to-br ${plan.color} bg-opacity-10 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                   <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black text-white mb-2 uppercase tracking-widest">{displayName}</h3>
                <p className="text-gray-400 text-xs mb-6 min-h-[32px] font-medium leading-relaxed">{displayDesc}</p>
                
                <div className="flex flex-col items-center justify-center min-h-[85px] w-full">
                  {plan.monthly === 0 ? (
                     <>
                       <span className={`text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r ${plan.color} drop-shadow-sm`}>
                         {currentLang === 'vi' ? 'MIỄN PHÍ' : 'FREE'}
                       </span>
                       <div className="flex items-center gap-2 mt-1 text-gray-500 text-xs font-semibold uppercase tracking-wider">{t.forever}</div>
                     </>
                  ) : (plan.name === 'TRỌN ĐỜI' || plan.id === 'LIFETIME') ? (
                     <>
                       <span className={`text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r ${plan.color} drop-shadow-sm`}>
                         {plan.monthly.toLocaleString()}đ
                       </span>
                       <div className="flex items-center gap-2 mt-1">
                         <span className="text-gray-600 text-[11px] line-through decoration-red-500/50">{plan.oldMonthly.toLocaleString()}đ{t.monthUnit}</span>
                       </div>
                     </>
                  ) : billingCycle === 'monthly' ? (
                     <>
                       <span className={`text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r ${plan.color} drop-shadow-sm`}>
                         {plan.monthly.toLocaleString()}đ
                       </span>
                       <div className="flex items-center gap-2 mt-1 text-gray-500 text-xs font-medium">{t.monthUnit}</div>
                     </>
                  ) : (
                     <>
                       <span className={`text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r ${plan.color} drop-shadow-sm`}>
                         {plan.monthly.toLocaleString()}đ
                       </span>
                       <div className="flex items-center gap-2 mt-1">
                         <span className="text-gray-600 text-[11px] line-through decoration-red-500/50">{plan.oldMonthly.toLocaleString()}đ</span>
                         <span className="text-gray-500 text-xs font-medium">{t.monthUnit}</span>
                       </div>
                       <div className="text-emerald-400 text-[10px] font-bold mt-2 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/30 whitespace-nowrap shadow-[0_0_10px_rgba(16,185,129,0.2)]">{t.yearPay} {plan.yearly.toLocaleString()}đ/{currentLang === 'vi' ? 'năm' : 'year'}</div>
                     </>
                  )}
                </div>

                <button 
                  onClick={(e) => { e.stopPropagation(); handlePurchase(plan); }}
                  className={`w-full mt-6 py-3.5 rounded-xl font-black text-sm text-white bg-gradient-to-r ${plan.color} shadow-lg transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] group-hover:scale-105 active:scale-95 uppercase tracking-wider`}
                >
                  {displayBtn}
                </button>
              </div>

              <div className="p-8 space-y-4 bg-gradient-to-b from-transparent to-black/20 flex-1 relative z-10">
                {displayFeatures.map((feat, j) => (
                  <div className="flex items-start gap-3 group/feat" key={j}>
                    <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center bg-gradient-to-br ${plan.color} shadow-sm group-hover/feat:scale-110 transition-transform`}>
                       <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-300 group-hover/feat:text-white transition-colors">{feat}</span>
                  </div>
                ))}
              </div>
            </RevealOnScroll>
            );
          })}
        </div>

        {/* TOKEN ADDON PACKAGES SUB-SECTION */}
        <div className="mt-16 bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-indigo-500/10 border border-amber-500/30 rounded-3xl p-8 max-w-7xl mx-auto backdrop-blur-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 text-center md:text-left">
            <div>
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-xs font-black uppercase tracking-wider inline-flex items-center gap-1.5 mb-2">
                💎 {t.tokenAddonTitle}
              </span>
              <h3 className="text-2xl font-black text-white">{t.tokenAddonSubtitle}</h3>
              <p className="text-gray-400 text-xs mt-1">{t.tokenAddonDesc}</p>
            </div>
            <button
              onClick={() => setActiveTab && setActiveTab('enterprise')}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90 text-white font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <span>{t.viewSepayDetails}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* GÓI 1 */}
            <div 
              onClick={() => setActiveTab && setActiveTab('enterprise')}
              className="bg-[#0B0B14] p-6 rounded-2xl border border-white/10 hover:border-amber-500/50 transition-all cursor-pointer group hover:-translate-y-1 shadow-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black text-blue-400 bg-blue-500/10 border border-blue-500/30 px-2 py-0.5 rounded-full">{currentLang === 'vi' ? 'THƯỞNG +10%' : 'BONUS +10%'}</span>
                <span className="text-xs text-gray-400 font-mono">10.000 + 1.000</span>
              </div>
              <h4 className="text-lg font-black text-white group-hover:text-amber-400 transition-colors">{currentLang === 'vi' ? 'Gói Token Khởi Nghiệp' : 'Starter Token Pack'}</h4>
              <p className="text-2xl font-black text-amber-400 my-2">499.000đ</p>
              <p className="text-xs text-gray-300 font-bold mb-4 flex items-center gap-1">
                <span>💎 {currentLang === 'vi' ? 'Nhận:' : 'Receive:'}</span>
                <span className="text-emerald-400 font-black text-sm">11.000 Tokens</span>
              </p>
              <ul className="text-xs text-gray-400 space-y-1.5 border-t border-white/5 pt-3">
                <li>✓ {currentLang === 'vi' ? 'Dùng AI Gemini & TTS ~1.500 lượt' : 'AI Gemini & TTS ~1,500 calls'}</li>
                <li>✓ {currentLang === 'vi' ? 'Không giới hạn thời gian hết hạn' : 'No expiration date'}</li>
                <li>✓ {currentLang === 'vi' ? 'Quét mã VietQR nhận token ngay 3s' : 'Instant VietQR Top-up 3s'}</li>
              </ul>
            </div>

            {/* GÓI 2 */}
            <div 
              onClick={() => setActiveTab && setActiveTab('enterprise')}
              className="bg-[#0E0C1B] p-6 rounded-2xl border-2 border-amber-500/60 shadow-xl shadow-amber-500/10 hover:border-amber-400 transition-all cursor-pointer group hover:-translate-y-1 relative"
            >
              <div className="absolute -top-3 right-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black px-3 py-0.5 rounded-full shadow">
                {currentLang === 'vi' ? 'PHỔ BIẾN NHẤT +15%' : 'MOST POPULAR +15%'}
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black text-amber-300 bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 rounded-full">{currentLang === 'vi' ? 'GIÁ TRỊ X3' : 'VALUE X3'}</span>
                <span className="text-xs text-gray-400 font-mono">30.000 + 4.500</span>
              </div>
              <h4 className="text-lg font-black text-white group-hover:text-amber-300 transition-colors">{currentLang === 'vi' ? 'Gói Token Tăng Trưởng' : 'Growth Token Pack'}</h4>
              <p className="text-2xl font-black text-amber-400 my-2">1.497.000đ</p>
              <p className="text-xs text-gray-300 font-bold mb-4 flex items-center gap-1">
                <span>💎 {currentLang === 'vi' ? 'Nhận:' : 'Receive:'}</span>
                <span className="text-emerald-400 font-black text-sm">34.500 Tokens</span>
              </p>
              <ul className="text-xs text-gray-400 space-y-1.5 border-t border-white/5 pt-3">
                <li>✓ {currentLang === 'vi' ? 'Dùng AI Gemini & TTS ~5.000 lượt' : 'AI Gemini & TTS ~5,000 calls'}</li>
                <li>✓ {currentLang === 'vi' ? 'Ưu tiên băng thông đường truyền AI' : 'Priority AI streaming bandwidth'}</li>
                <li>✓ {currentLang === 'vi' ? 'Tặng thêm +15% Token thưởng' : '+15% bonus tokens included'}</li>
              </ul>
            </div>

            {/* GÓI 3 */}
            <div 
              onClick={() => setActiveTab && setActiveTab('enterprise')}
              className="bg-[#0B0B14] p-6 rounded-2xl border border-white/10 hover:border-amber-500/50 transition-all cursor-pointer group hover:-translate-y-1 shadow-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black text-purple-400 bg-purple-500/10 border border-purple-500/30 px-2 py-0.5 rounded-full">{currentLang === 'vi' ? 'SIÊU VIP +20%' : 'SUPER VIP +20%'}</span>
                <span className="text-xs text-gray-400 font-mono">90.000 + 18.000</span>
              </div>
              <h4 className="text-lg font-black text-white group-hover:text-purple-300 transition-colors">{currentLang === 'vi' ? 'Gói Token Đột Phá VIP' : 'Breakthrough VIP Pack'}</h4>
              <p className="text-2xl font-black text-amber-400 my-2">4.491.000đ</p>
              <p className="text-xs text-gray-300 font-bold mb-4 flex items-center gap-1">
                <span>💎 {currentLang === 'vi' ? 'Nhận:' : 'Receive:'}</span>
                <span className="text-emerald-400 font-black text-sm">108.000 Tokens</span>
              </p>
              <ul className="text-xs text-gray-400 space-y-1.5 border-t border-white/5 pt-3">
                <li>✓ {currentLang === 'vi' ? 'Dùng AI Gemini & TTS ~15.000 lượt' : 'AI Gemini & TTS ~15,000 calls'}</li>
                <li>✓ {currentLang === 'vi' ? 'Tặng thêm +20% Token thưởng' : '+20% bonus tokens included'}</li>
                <li>✓ {currentLang === 'vi' ? 'Hỗ trợ kỹ thuật VIP riêng 24/7' : 'Dedicated 24/7 VIP technical team'}</li>
              </ul>
            </div>
          </div>
        </div>

      </section>

      {/* 5. STATS & PARTNERS */}
      <section className="py-12 border-y border-white/5 bg-[#0a0a10] relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
            <StatItem icon={<Crown />} value="10.000+" label={t.stat1} color="text-amber-400" />
            <StatItem icon={<MonitorPlay />} value="50.000+" label={t.stat2} color="text-purple-400" />
            <StatItem icon={<ShoppingBag />} value="1.000.000+" label={t.stat3} color="text-blue-400" />
            <StatItem icon={<ShieldCheck />} value="99.9%" label={t.stat4} color="text-emerald-400" />
            <StatItem icon={<Users />} value="24/7" label={t.stat5} color="text-cyan-400" />
          </div>
          <div className="text-center mt-8">
            <h4 className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-6">{t.trustedPartners}</h4>
            <div className="relative z-20 overflow-hidden marquee-container py-4">
              <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0a0a10] to-transparent z-10 pointer-events-none"></div>
              <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0a0a10] to-transparent z-10 pointer-events-none"></div>
              
              <div className="flex w-max animate-marquee-reverse">
                <div className="flex w-max justify-around items-center px-4 gap-8">
                   <PlatformLogo text="TikTok" icon={<svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/></svg>} hoverColor="hover:text-cyan-400" />
                   <PlatformLogo text="facebook" icon={<Facebook className="w-8 h-8"/>} hoverColor="hover:text-[#1877F2]" />
                   <PlatformLogo text="YouTube" icon={<Tv className="w-8 h-8"/>} hoverColor="hover:text-[#FF0000]" />
                   <PlatformLogo text="Shopee" icon={<ShoppingCart className="w-8 h-8"/>} hoverColor="hover:text-[#EE4D2D]" />
                   <PlatformLogo text="Lazada" icon={<Globe className="w-8 h-8"/>} hoverColor="hover:text-[#0A2647]" />
                </div>
                <div className="flex w-max justify-around items-center px-4 gap-8">
                   <PlatformLogo text="TikTok" icon={<svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/></svg>} hoverColor="hover:text-cyan-400" />
                   <PlatformLogo text="facebook" icon={<Facebook className="w-8 h-8"/>} hoverColor="hover:text-[#1877F2]" />
                   <PlatformLogo text="YouTube" icon={<Tv className="w-8 h-8"/>} hoverColor="hover:text-[#FF0000]" />
                   <PlatformLogo text="Shopee" icon={<ShoppingCart className="w-8 h-8"/>} hoverColor="hover:text-[#EE4D2D]" />
                   <PlatformLogo text="Lazada" icon={<Globe className="w-8 h-8"/>} hoverColor="hover:text-[#0A2647]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── AFFILIATE PROGRAM ──────────────────────────────────────────── */}
      <section id="affiliate-intro" className="py-24 px-6 bg-gradient-to-b from-[#0A0A0A] via-[#120A1A] to-[#0A0A0A]">
        <RevealOnScroll className="max-w-6xl mx-auto">
          <div className="glass-panel rounded-3xl border border-[#8B5CF6]/30 p-8 md:p-14 bg-gradient-to-br from-[#8B5CF6]/10 to-[#EF4444]/5 shadow-neon-purple relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#8B5CF6]/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#EF4444]/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 text-center space-y-6 mb-12">
              <span className="px-5 py-2 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-[#8B5CF6] text-xs font-black tracking-wider uppercase inline-flex items-center gap-2">
                <HeartHandshake className="w-4 h-4" /> {t.affiliateBadge}
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
                {t.affiliateTitle1}<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#EF4444]">{t.affiliateTitle2}</span>
              </h2>
              <p className="text-gray-300 text-sm md:text-base max-w-3xl mx-auto leading-relaxed">
                {t.affiliateDesc}
              </p>
            </div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {[
                { 
                  icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-400/20', border: 'border-emerald-400/30',
                  title: t.aff1Title, 
                  desc: t.aff1Desc 
                },
                { 
                  icon: Clock, color: 'text-[#3B82F6]', bg: 'bg-[#3B82F6]/20', border: 'border-[#3B82F6]/30',
                  title: t.aff2Title, 
                  desc: t.aff2Desc 
                },
                { 
                  icon: TrendingUp, color: 'text-[#EF4444]', bg: 'bg-[#EF4444]/20', border: 'border-[#EF4444]/30',
                  title: t.aff3Title, 
                  desc: t.aff3Desc 
                },
                { 
                  icon: Layers, color: 'text-[#8B5CF6]', bg: 'bg-[#8B5CF6]/20', border: 'border-[#8B5CF6]/30',
                  title: t.aff4Title, 
                  desc: t.aff4Desc 
                },
              ].map((item, idx) => (
                <div key={idx} className={`p-6 rounded-2xl bg-black/40 border ${item.border} space-y-4 hover:scale-105 transition-transform duration-300 group`}>
                  <div className={`w-12 h-12 rounded-xl ${item.bg} ${item.color} flex items-center justify-center`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-black text-white group-hover:text-gray-200 transition-colors">{item.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="relative z-10 flex justify-center">
              <button
                onClick={() => setActiveTab && setActiveTab('affiliate-landing')}
                className="px-10 py-5 bg-gradient-to-r from-[#8B5CF6] to-[#EF4444] text-white font-black text-base rounded-2xl animate-cta-pulse hover:scale-105 transition-all flex items-center gap-3 cursor-pointer shadow-[0_0_30px_rgba(139,92,246,0.5)]"
              >
                {t.affiliateBtn} <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="bg-[#05050A] pt-16 pb-8 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          
          {/* Top Footer Banner Cards */}
          <div id="guide" className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md hover:bg-white/[0.04] p-8 flex items-center justify-between group cursor-pointer hover:border-purple-500/30 transition-colors">
              <div>
                <h4 className="text-xl font-bold text-white mb-2 uppercase">{t.footerGuideTitle}</h4>
                <p className="text-gray-400 text-sm mb-4">{t.footerGuideDesc}</p>
                <button className="px-5 py-2 rounded-lg border border-white/20 text-white text-xs font-bold hover:bg-white/10 transition-colors">{t.footerGuideBtn} <Play className="w-3 h-3 inline ml-1" /></button>
              </div>
              <div className="w-32 h-20 bg-black rounded-lg border border-white/10 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <Play className="w-6 h-6 text-purple-400" />
              </div>
            </div>
            
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md hover:bg-white/[0.04] p-8 flex items-center justify-between group cursor-pointer hover:border-blue-500/30 transition-colors">
              <div>
                <h4 className="text-xl font-bold text-white mb-2 uppercase">{t.footerSupportTitle}</h4>
                <p className="text-gray-400 text-sm mb-4">{t.footerSupportDesc}</p>
                <button className="px-5 py-2 rounded-lg border border-white/20 text-white text-xs font-bold hover:bg-white/10 transition-colors">{t.footerSupportBtn}</button>
              </div>
              <div className="w-24 h-24 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <Headphones className="w-10 h-10 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#111] p-0.5 border border-white/20">
                  <img src="/official_logo.jpg" alt="AvaLive" className="w-full h-full object-cover rounded-[10px]" />
                </div>
                <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-1.5 leading-none">
                  <span className="text-[#00F0FF] drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]">AVA</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EC4899] to-[#9333EA] font-black drop-shadow-[0_0_8px_rgba(236,72,153,0.6)]">LIVESTREAM</span>
                </h1>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed">
                {t.footerBrandDesc}
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4 uppercase text-sm">{t.footerProducts}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition-colors">{t.navFeatures}</button></li>
                <li><button onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition-colors">{t.navPricing}</button></li>
                <li><button onClick={() => document.getElementById('guide')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition-colors">{t.navGuide}</button></li>
                <li><button onClick={() => document.getElementById('affiliate-intro')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition-colors">{t.navAffiliate}</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4 uppercase text-sm">{t.footerContact}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="mailto:support@avalive.com" className="hover:text-white transition-colors">support@avalive.com</a></li>
                <li><a href="tel:0909000000" className="hover:text-white transition-colors">0909 000 000</a></li>
                <li><button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition-colors">{t.footerSupportBtn}</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4 uppercase text-sm">{t.footerSupport}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">{t.footerHelpCenter}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t.footerTerms}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t.footerPrivacy}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t.footerPaymentGuide}</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-xs">
              &copy; {new Date().getFullYear()} AVA LIVE. {t.footerRights}
            </p>
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-500">{t.footerConnect}</span>
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-full bg-[#1877F2] flex items-center justify-center text-white"><Facebook className="w-3 h-3" /></div>
                <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center text-white"><svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/></svg></div>
                <div className="w-6 h-6 rounded-full bg-[#FF0000] flex items-center justify-center text-white"><Play className="w-3 h-3" /></div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Chat Button */}
      <button className="fixed bottom-6 right-6 z-[100] px-5 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-sm shadow-xl flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer">
         <MessageSquare className="w-5 h-5" /> {t.floatingChat}
      </button>

      {/* Payment Modal */}
      {selectedPlan && (
        <SePayModal 
          isOpen={sepayModalOpen} 
          onClose={() => setSepayModalOpen(false)} 
          plan={selectedPlan} 
          billingCycle={billingCycle}
          currentUser={currentUser}
          onSuccess={() => {
            setSepayModalOpen(false);
            alert("Thanh toán thành công! Gói đã được kích hoạt.");
            setActiveTab('broadcast');
          }}
        />
      )}
      
    </div>
  );
}

// Subcomponents for cleaner code
function RibbonItem({ icon, title, subtitle, color, borderCol }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#140C2E]/60 backdrop-blur-xl border border-[#8B5CF6]/30 hover:border-[#00F0FF] hover:shadow-[0_0_25px_rgba(0,240,255,0.4)] transition-all cursor-pointer group shrink-0 min-w-max mx-6">
      <div className={`p-3.5 rounded-xl bg-gradient-to-br from-[#1E113F] to-[#100926] border border-white/20 ${color} group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(0,0,0,0.5)]`}>
        {React.cloneElement(icon, { className: "w-7 h-7" })}
      </div>
      <div>
        <h4 className="text-white text-sm font-black leading-tight uppercase tracking-wide group-hover:text-[#00F0FF] transition-colors">{title} <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EC4899] to-[#00F0FF] font-extrabold">{subtitle}</span></h4>
      </div>
    </div>
  );
}

function PlatformLogo({ icon, text, hoverColor }) {
  const colorClass = hoverColor ? hoverColor.replace('hover:', '') : 'text-white';
  return (
    <div className={`flex items-center gap-3 transition-all duration-500 cursor-pointer min-w-max mx-12 group drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:drop-shadow-[0_0_35px_rgba(0,240,255,0.6)] hover:scale-110 active:scale-95 ${colorClass}`}>
      {React.cloneElement(icon, { className: "w-10 h-10 group-hover:scale-110 transition-transform" })}
      <span className="text-3xl font-black tracking-wider uppercase drop-shadow">{text}</span>
    </div>
  );
}

function FeatureCard({ icon, title, desc, color, bg, border }) {
  return (
    <div className={`p-6 rounded-2xl border-2 ${border} ${bg} flex gap-4 hover:scale-[1.03] transition-all backdrop-blur-xl shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:shadow-[0_0_30px_rgba(236,72,153,0.3)] group`}>
      <div className={`p-3.5 rounded-xl bg-gradient-to-br from-[#1C103B] to-[#0D071E] h-max border border-white/20 ${color} group-hover:scale-110 transition-transform shadow-lg`}>
        {React.cloneElement(icon, { className: "w-7 h-7" })}
      </div>
      <div>
        <h4 className="text-white font-black text-sm md:text-base mb-1.5 uppercase tracking-wide group-hover:text-[#00F0FF] transition-colors">{title}</h4>
        <p className="text-gray-300/90 text-xs md:text-[13px] leading-relaxed font-light">{desc}</p>
      </div>
    </div>
  );
}

function StatItem({ icon, value, label, color }) {
  return (
    <div className="flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-[#8B5CF6]/30 bg-gradient-to-b from-[#180F33]/80 to-[#0C071C]/90 backdrop-blur-xl hover:border-[#00F0FF] hover:shadow-[0_0_25px_rgba(0,240,255,0.3)] text-center transition-all">
      <div className={`p-3 rounded-2xl bg-[#090514] border border-white/20 ${color} mb-3 shadow-[0_0_20px_rgba(0,0,0,0.8)]`}>
        {React.cloneElement(icon, { className: "w-6 h-6" })}
      </div>
      <h4 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#00F0FF] to-[#EC4899] mb-1 drop-shadow">{value}</h4>
      <p className="text-gray-400 text-[11px] uppercase font-black tracking-wider">{label}</p>
    </div>
  );
}

// Shopping Bag Icon component since lucide-react ShoppingBag is not imported, let's use ShoppingCart or custom svg
function ShoppingBagIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
      <path d="M3 6h18"/>
      <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  );
}
