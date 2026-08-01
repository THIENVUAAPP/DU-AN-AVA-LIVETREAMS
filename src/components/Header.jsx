import React, { useState, useRef, useEffect } from 'react';
import { 
  Tv, 
  ShoppingBag, 
  Bot, 
  Building2, 
  Sparkles, 
  Radio, 
  Share2, 
  UserCheck,
  ShieldCheck,
  User,
  Award,
  Layers,
  LogOut,
  LogIn,
  TrendingUp,
  ChevronDown,
  CreditCard,
  Zap,
  MessageSquare
} from 'lucide-react';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  isLive, 
  setIsLive,
  currentUser,
  setCurrentUser,
  googleLoginModalOpen,
  setGoogleLoginModalOpen,
  aiAvatarFeatureEnabled,
  setAiAvatarFeatureEnabled
}) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Navigation when LOGGED OUT (Public Visitors)
  const publicNavItems = [
    { id: 'overview', label: 'Trang Chủ' },
    { id: 'affiliate-landing', label: 'Tiếp Thị 30%' },
  ];

  // Navigation when LOGGED IN (Dynamic based on Admin AI Avatar Toggle)
  const workspaceNavItems = [
    { id: 'broadcast', label: 'Live Studio' },
    { 
      id: 'avatars', 
      label: aiAvatarFeatureEnabled 
        ? 'MC AI & Restream' 
        : 'Restream 24/7' 
    },
    { id: 'multistream', label: 'Đa Nền Tảng' },
    { id: 'chat-hub', label: 'Chat Hub AI' },
  ];

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogoClick = () => {
    if (currentUser) {
      setActiveTab('broadcast');
    } else {
      setActiveTab('overview');
    }
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-white/10 px-4 lg:px-8 py-3 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
        
        {/* High-End 3D Neon Official Studio Logo */}
        <div 
          className="flex items-center gap-3 cursor-pointer group shrink-0" 
          onClick={handleLogoClick}
          title={currentUser ? "Tải lại Workspace Studio" : "Về Trang Chủ"}
        >
          <div className="relative">
            {/* Ultra Neon Aura Lighting Ring */}
            <div className="absolute -inset-2 bg-gradient-to-r from-red-600 via-purple-600 to-cyan-500 rounded-2xl blur-lg opacity-90 group-hover:opacity-100 transition duration-500 animate-pulse" />
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#EF4444] via-[#8B5CF6] to-[#06B6D4] p-0.5 shadow-2xl group-hover:scale-105 transition-all">
              <img 
                src="/official_logo.jpg" 
                alt="AvaLive PRO Official Logo" 
                className="w-full h-full object-cover rounded-[14px] border border-white/40 drop-shadow-[0_0_18px_rgba(239,68,68,0.9)]"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <h1 className="text-2xl font-black tracking-tight text-white group-hover:text-red-400 transition-all flex items-center gap-1.5 drop-shadow-[0_0_20px_rgba(239,68,68,0.7)]">
              AvaLive <span className="text-[#EF4444] bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(239,68,68,1)]">PRO</span>
            </h1>
            
          </div>
        </div>

        {/* Clean 1-Row Borderless Nav Items with Big Bold Text */}
        <div className="flex-1 flex items-center justify-center overflow-x-auto no-scrollbar py-1">
          
          {!currentUser ? (
            /* Public Nav Items */
            <nav className="flex flex-row flex-nowrap items-center justify-center gap-6 lg:gap-10 whitespace-nowrap">
              {publicNavItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`relative px-2 py-1.5 text-base lg:text-xl font-black tracking-wide transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'text-white drop-shadow-[0_0_12px_rgba(239,68,68,0.7)] scale-105'
                        : 'text-gray-400 hover:text-white hover:scale-102'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="absolute -bottom-1 left-0 right-0 h-1 rounded-full bg-gradient-to-r from-[#EF4444] via-purple-500 to-[#3B82F6] shadow-[0_0_10px_#EF4444]" />
                    )}
                  </button>
                );
              })}
            </nav>
          ) : (
            /* Workspace 1-Row Clean Navigation (No border, No icon, Big & Bold Text) */
            <nav className="flex flex-row flex-nowrap items-center justify-center gap-6 lg:gap-10 whitespace-nowrap">
              {workspaceNavItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`relative px-2 py-1.5 text-base lg:text-xl font-black tracking-wide transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'text-white drop-shadow-[0_0_14px_rgba(239,68,68,0.8)] scale-105'
                        : 'text-gray-400 hover:text-white hover:scale-102'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="absolute -bottom-1.5 left-0 right-0 h-1 rounded-full bg-gradient-to-r from-[#EF4444] via-purple-500 to-[#3B82F6] shadow-[0_0_12px_#EF4444]" />
                    )}
                  </button>
                );
              })}
            </nav>
          )}

        </div>

        {/* User Account Pill Badge & Master Live Button */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="relative" ref={dropdownRef}>
              
              {/* Sleek User Pill Badge (Siêu Mini - Nhỏ Gấp 3 Lần) */}
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#121216] border border-white/20 hover:border-[#EF4444] transition-all shadow-sm cursor-pointer group text-[9px]"
              >
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name}
                  className="w-3.5 h-3.5 rounded-full object-cover border border-[#EF4444]"
                />
                <span className="font-bold text-white max-w-[50px] truncate group-hover:text-red-400">{currentUser.name}</span>
                <ChevronDown className={`w-2.5 h-2.5 text-gray-400 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile & Account Quick Menu Dropdown (Nơi chứa Quản Trị Admin VIP & Thông Tin Cá Nhân/AFF) */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-3 w-80 min-w-[340px] glass-panel p-4 rounded-3xl border border-white/20 shadow-2xl z-50 space-y-3 text-xs bg-[#0A0A0A]/98 backdrop-blur-2xl animate-fadeIn">
                  
                  {/* Account Identity Header Card */}
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-[#121218] to-black border border-white/15 space-y-1.5">
                    <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block">TÀI KHOẢN GMAIL KẾT NỐI:</span>
                    <p className="font-mono text-emerald-400 font-black text-sm truncate">{currentUser.email}</p>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-black inline-block">
                      {currentUser.isAdmin ? "👑 SUPER ADMIN VIP" : "🟢 GÓI BẢN QUYỀN ACTIVE"}
                    </span>
                  </div>

                  {/* Concise Menu Items */}
                  <div className="space-y-1 pt-1">
                    <button
                      onClick={() => {
                        setActiveTab("profile");
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-200 hover:text-white hover:bg-white/10 font-bold text-xs transition-all text-left cursor-pointer"
                    >
                      <User className="w-4 h-4 text-[#EF4444]" />
                      <span>Hồ Sơ Cá Nhân</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab("sales-analytics");
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#EF4444] hover:bg-[#EF4444]/10 font-black text-xs transition-all text-left cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4 text-[#EF4444]" />
                      <span>Quản Lý Đơn Hàng</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab("team");
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-200 hover:text-white hover:bg-white/10 font-bold text-xs transition-all text-left cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Quản Lý Đội Ngũ</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab("affiliate-dashboard");
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-200 hover:text-white hover:bg-white/10 font-bold text-xs transition-all text-left cursor-pointer"
                    >
                      <TrendingUp className="w-4 h-4 text-[#8B5CF6]" />
                      <span>Hoa Hồng Tiếp Thị (AFF)</span>
                    </button>

                    {currentUser.isAdmin && (
                      <div className="space-y-2 pt-2 border-t border-white/10">
                        <button
                          onClick={() => {
                            setActiveTab("admin");
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 font-black text-xs transition-all text-left cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <ShieldCheck className="w-4 h-4 text-amber-400" />
                            <span>Quản Trị Admin</span>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-amber-500 text-black text-[9px] font-black">
                            ADMIN
                          </span>
                        </button>

                        <div className="p-3 rounded-2xl bg-[#121218] border border-purple-500/30 flex items-center justify-between gap-2 text-left">
                          <div>
                            <span className="text-xs font-bold text-white block">TÍNH NĂNG MC AI AVATAR</span>
                            <span className={`text-[10px] font-black block ${aiAvatarFeatureEnabled ? "text-emerald-400" : "text-amber-400"}`}>
                              {aiAvatarFeatureEnabled ? "● Đang Hoạt Động" : "🔒 Tạm Khóa / Ẩn"}
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              setAiAvatarFeatureEnabled(!aiAvatarFeatureEnabled);
                              alert(aiAvatarFeatureEnabled ? "🔒 Đã TẠM KHÓA tính năng MC AI Avatar!" : "⚡ Đã MỞ BẬT LẠI tính năng MC AI Avatar!");
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition-all ${
                              aiAvatarFeatureEnabled
                                ? "bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30"
                                : "bg-emerald-600 text-white shadow-glow-emerald hover:bg-emerald-700"
                            }`}
                          >
                            {aiAvatarFeatureEnabled ? "TẮT" : "MỞ BẬT"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Logout Button */}
                  <div className="pt-2 border-t border-white/10">
                    <button
                      onClick={() => {
                        setCurrentUser(null);
                        setActiveTab("overview");
                        setProfileDropdownOpen(false);
                        alert("Đã đăng xuất tài khoản!");
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 font-bold text-xs transition-all text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-red-400" />
                      <span>Đăng Xuất</span>
                    </button>
                  </div>

                </div>
              )}

            </div>
          ) : (
            <button
              onClick={() => setGoogleLoginModalOpen(true)}
              className="flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-black bg-white text-black hover:bg-gray-100 transition-all shadow-glow-white cursor-pointer scale-105"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>VÀO WORKSPACE</span>
            </button>
          )}

          {/* Master Live Button */}
          <button
            onClick={() => {
              if (!currentUser) {
                setGoogleLoginModalOpen(true);
              } else {
                const goingOffline = isLive;
                setIsLive(!isLive);
                if (goingOffline) {
                  setTimeout(() => {
                    alert("🔴 Đã kết thúc Phiên Livestream!\n\n⬇️ HỆ THỐNG ĐANG TỰ ĐỘNG KẾT XUẤT VÀ TẢI VỀ MÁY...\nToàn bộ Video Source Gốc của phiên Live đang được tự động tải về máy tính của bạn.\n(Dù người dùng có ẩn source hay ẩn live, hệ thống vẫn tự động tải về đầy đủ!)");
                  }, 500);
                }
              }
            }}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-black transition-all shadow-lg ${
              isLive
                ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse shadow-glow-red'
                : 'bg-gradient-to-r from-[#EF4444] via-[#8B5CF6] to-[#3B82F6] hover:opacity-95 text-white shadow-glow-red scale-105'
            }`}
          >
            <Radio className={`w-4 h-4 ${isLive ? 'animate-spin' : ''}`} />
            <span>{isLive ? '🔴 PHÁT LIVE' : '⚡ PHÁT LIVE'}</span>
          </button>
        </div>

      </div>
    </header>
  );
}
