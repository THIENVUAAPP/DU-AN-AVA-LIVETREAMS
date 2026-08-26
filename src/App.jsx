import { syncUserToSupabase, supabase } from "./lib/supabaseClient";
import React, { useState, useEffect } from "react";
import RecentPurchasePopup from "./components/RecentPurchasePopup";
import Header from "./components/Header";
import LandingHero from "./components/LandingHero";
import SalesLandingPage from "./components/SalesLandingPage";
import ProductionStudio from "./components/ProductionStudio";
import AIAvatarStudio from "./components/AIAvatarStudio";
import LiveCommerceStudio from "./components/LiveCommerceStudio";
import MultistreamStudio from "./components/MultistreamStudio";
import UnifiedChatHub from "./components/UnifiedChatHub";
import DanceFloorStudio from "./components/DanceFloorStudio";
import KOLLiveDashboard from "./components/KOLLiveDashboard";
import DanceFloorOverlay from "./components/DanceFloorOverlay";
import GameBattleOverlay from "./components/genaidol/game/GameBattleOverlay";
import CleanLiveOverlay from "./components/genaidol/CleanLiveOverlay";
import GameBanDoOverlay from "./components/genaidol/game/GameBanDoOverlay";
import MultiAccountManager from "./components/MultiAccountManager";
import AISellerOps from "./components/AISellerOps";
import EnterprisePayment from "./components/EnterprisePayment";
import AdminDashboard from "./components/AdminDashboard";
import UserProfile from "./components/UserProfile";
import AffiliateLanding from "./components/AffiliateLanding";
import AffiliateDashboard from "./components/AffiliateDashboard";
import TeamPermissionsManager from "./components/TeamPermissionsManager";
import SalesAnalyticsManager from "./components/SalesAnalyticsManager";
import LivestreamClonerStudio from "./components/LivestreamClonerStudio";
import UpgradePrompt from "./components/UpgradePrompt";
import AutoCaptchaSolver from "./components/AutoCaptchaSolver";
import { syncMasterLiveState } from "./lib/masterLiveSync";
import { Lock, Sparkles, ShieldCheck, Mail, LogIn, ArrowRight } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLive, setIsLive] = useState(false);
  const [aiAvatarFeatureEnabled, setAiAvatarFeatureEnabled] = useState(false);

  // Tự động đồng bộ trạng thái Master Live khi chuyển Tab
  useEffect(() => {
    let stage = 'idol';
    if (activeTab === 'dance-floor') stage = 'dancefloor';
    else if (activeTab === 'broadcast') stage = 'broadcast';
    else if (activeTab === 'avatars') stage = 'idol';
    else if (activeTab === 'ai-storyteller') stage = 'bando';
    syncMasterLiveState({ stage });
  }, [activeTab]);

  // Real Google User State (Loaded from localStorage or Supabase session)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("avalive_current_user");
      if (saved) {
         let parsedUser = JSON.parse(saved);
         // Realtime check plan expiration
         if (parsedUser.plan !== 'FREE' && parsedUser.plan_expires_at) {
             const expiresAt = new Date(parsedUser.plan_expires_at).getTime();
             const now = new Date().getTime();
             if (now > expiresAt) {
                 // Downgrade to FREE
                 parsedUser.plan = 'FREE';
                 parsedUser.plan_expires_at = null;
                 localStorage.setItem("avalive_current_user", JSON.stringify(parsedUser));
             }
         }
         return parsedUser;
      }
      return {
        name: "Quốc Thiên Admin",
        email: "quocthiencr90@gmail.com",
        avatar: "https://lh3.googleusercontent.com/a/default-user",
        isAdmin: true,
        plan: "FREE",
        plan_expires_at: null
      };
    } catch (e) {
      return null;
    }
  });

  const [googleLoginModalOpen, setGoogleLoginModalOpen] = useState(false);
  const [realGmailInput, setRealGmailInput] = useState("");
  const [realNameInput, setRealNameInput] = useState("");

  // Handle OAuth Popup Redirect Callback
  useEffect(() => {
    // Some OAuth providers return data in the search query (?code=...), others in the hash fragment (#access_token=...)
    const searchParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.substring(1)); // remove the '#'

    const code = searchParams.get('code');
    const accessToken = hashParams.get('access_token');
    const state = searchParams.get('state') || hashParams.get('state');
    const error = searchParams.get('error') || hashParams.get('error');

    if (window.opener && (code || accessToken || error)) {
      // We are inside the popup window
      let platform = 'unknown';
      if (state?.startsWith('tiktok_auth_')) platform = 'tiktok';
      else if (state?.startsWith('facebook_auth_')) platform = 'facebook';
      else if (state?.startsWith('youtube_auth_')) platform = 'youtube';
      
      if (code) {
        window.opener.postMessage({ type: 'OAUTH_CODE', platform, code }, window.location.origin);
      } else if (accessToken) {
        window.opener.postMessage({ type: 'OAUTH_TOKEN', platform, accessToken }, window.location.origin);
      } else if (error) {
        window.opener.postMessage({ type: 'OAUTH_ERROR', platform, error }, window.location.origin);
      }
      
      // Close the popup window after sending message
      window.close();
    }
  }, []);

  // Check Supabase Auth Session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const gUser = {
          name: session.user.user_metadata?.full_name || session.user.email.split("@")[0],
          email: session.user.email,
          avatar: session.user.user_metadata?.avatar_url || "https://lh3.googleusercontent.com/a/default-user",
          isAdmin: session.user.email === "quocthiencr90@gmail.com",
        };
        setCurrentUser(gUser);
        localStorage.setItem("avalive_current_user", JSON.stringify(gUser));
        syncUserToSupabase(gUser);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const gUser = {
          name: session.user.user_metadata?.full_name || session.user.email.split("@")[0],
          email: session.user.email,
          avatar: session.user.user_metadata?.avatar_url || "https://lh3.googleusercontent.com/a/default-user",
          isAdmin: session.user.email === "quocthiencr90@gmail.com",
        };
        setCurrentUser(gUser);
        localStorage.setItem("avalive_current_user", JSON.stringify(gUser));
        syncUserToSupabase(gUser);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  // Handle Real Supabase Google OAuth Redirect
  const handleRealGoogleOAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) {
        console.error("Google OAuth error:", error.message);
      }
    } catch (err) {
      console.error("Google OAuth catch:", err);
    }
  };

  // Handle Real Custom Gmail Address Login
  const handleRealGmailSubmit = async (e) => {
    e.preventDefault();
    if (!realGmailInput.trim()) {
      alert("Vui lòng nhập địa chỉ Gmail thực tế của bạn!");
      return;
    }

    const emailClean = realGmailInput.trim().toLowerCase();
    const isAdmin = emailClean === "quocthiencr90@gmail.com";
    const nameClean = realNameInput.trim() || emailClean.split("@")[0];
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(emailClean)}`;

    const newUser = {
      name: nameClean,
      email: emailClean,
      avatar: avatarUrl,
      isAdmin: isAdmin,
      plan: isAdmin ? "ENTERPRISE" : "STARTER"
    };

    setCurrentUser(newUser);
    localStorage.setItem("avalive_current_user", JSON.stringify(newUser));
    setGoogleLoginModalOpen(false);
    setActiveTab(isAdmin ? "admin" : "profile");

    // Sync directly to Supabase Database
    await syncUserToSupabase(newUser);
    alert(`⚡ ĐÃ KẾT NỐI THÀNH CÔNG TÀI KHOẢN GOOGLE REAL-TIME!\n\n👤 Email: ${emailClean}\n👑 Quyền hạn: ${isAdmin ? "SUPER ADMIN VIP" : "THÀNH VIÊN GÓI CHÍNH THỨC"}\n\nHồ sơ đã được đồng bộ với Cơ sở dữ liệu Supabase!`);
  };

  // Cửa Sổ Master Live Overlay 1 Link Duy Nhất cho TikTok LIVE Studio & OBS Studio
  const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const pathName = typeof window !== "undefined" ? window.location.pathname.toLowerCase() : "";
  const overlayType = searchParams?.get("overlay")?.toLowerCase();

  const isOverlayDance = overlayType === "dancefloor" || pathName.includes("/overlay-dance") || pathName.includes("/overlay/dance") || pathName === "/dancefloor";
  const isOverlayBattle = overlayType === "gamebattle" || overlayType === "battle" || pathName.includes("/overlay-battle") || pathName.includes("/overlay/battle") || pathName === "/battle";
  const isOverlayBanDo = overlayType === "bando" || overlayType === "vietnam_map" || overlayType === "map" || overlayType === "vietnam" || pathName.includes("/overlay-bando") || pathName.includes("/overlay/bando") || pathName === "/bando";
  const isMasterLiveOverlay = overlayType === "live" || overlayType === "stage" || overlayType === "tiktok" || overlayType === "obs" || overlayType === "cleanlive" || overlayType === "avatar" || overlayType === "stream" || overlayType === "idol" || overlayType === "master" || pathName.includes("/overlay-live") || pathName.includes("/overlay-idol") || pathName.includes("/overlay") || pathName.includes("/live") || pathName === "/idol";

  if (isOverlayDance) return <DanceFloorOverlay />;
  if (isOverlayBattle) return <GameBattleOverlay />;
  if (isOverlayBanDo) return <GameBanDoOverlay />;
  if (isMasterLiveOverlay) return <CleanLiveOverlay />;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-gray-100 flex flex-col font-sans selection:bg-[#EF4444] selection:text-white">
      
      {/* Navigation Header (Luôn hiển thị đầy đủ tất cả các tab quản trị & studio) */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isLive={isLive} 
        setIsLive={setIsLive} 
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        googleLoginModalOpen={googleLoginModalOpen}
        setGoogleLoginModalOpen={setGoogleLoginModalOpen}
        aiAvatarFeatureEnabled={aiAvatarFeatureEnabled}
        setAiAvatarFeatureEnabled={setAiAvatarFeatureEnabled}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1700px] w-full mx-auto px-3 lg:px-6 py-4">
        
        {/* PUBLIC TABS & GENERAL TABS */}
        {activeTab === "overview" && (
          <SalesLandingPage setActiveTab={setActiveTab} setGoogleLoginModalOpen={setGoogleLoginModalOpen} currentUser={currentUser} />
        )}

        {activeTab === "affiliate-landing" && (
          <AffiliateLanding 
            currentUser={currentUser} 
            setGoogleLoginModalOpen={setGoogleLoginModalOpen} 
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === "enterprise" && (
          <EnterprisePayment setActiveTab={setActiveTab} />
        )}

        {/* WORKSPACE VIP STUDIO MODE (When User IS Logged In) */}
        {currentUser && (
          <>
            {activeTab === "broadcast" && (
              <ProductionStudio isLive={isLive} aiAvatarFeatureEnabled={aiAvatarFeatureEnabled} setActiveTab={setActiveTab} currentUser={currentUser} />
            )}

            {activeTab === "avatars" && (
              (currentUser?.plan === 'FREE' || currentUser?.plan === 'STARTER')
                ? <UpgradePrompt featureName="AI Avatar Studio" requiredPlan="Gói PRO" setActiveTab={setActiveTab} />
                : <AIAvatarStudio isLive={isLive} aiAvatarFeatureEnabled={aiAvatarFeatureEnabled} />
            )}

            {activeTab === "commerce" && (
              (currentUser?.plan === 'FREE') 
                ? <UpgradePrompt featureName="Live Commerce Chốt Đơn Đa Kênh" requiredPlan="Gói STARTER" setActiveTab={setActiveTab} />
                : <LiveCommerceStudio isLive={isLive} />
            )}

            {activeTab === "multistream" && (
              (currentUser?.plan === 'FREE') 
                ? <UpgradePrompt featureName="Phân Phối Luồng Restream Đa Kênh" requiredPlan="Gói STARTER" setActiveTab={setActiveTab} />
                : <MultistreamStudio isLive={isLive} setIsLive={setIsLive} currentUser={currentUser} />
            )}

            {activeTab === "chat-hub" && (
              (currentUser?.plan === 'FREE')
                ? <UpgradePrompt featureName="Hộp Thư Đa Nền Tảng (Chat Hub)" requiredPlan="Gói STARTER" setActiveTab={setActiveTab} />
                : <UnifiedChatHub isLive={isLive} />
            )}

            {activeTab === "dance-floor" && (
              (currentUser?.plan === 'FREE')
                ? <UpgradePrompt featureName="Sàn Nhảy TikTok Tương Tác" requiredPlan="Gói STARTER" setActiveTab={setActiveTab} />
                : <DanceFloorStudio isLive={isLive} setIsLive={setIsLive} />
            )}

            {activeTab === "ai-storyteller" && (
              <KOLLiveDashboard />
            )}

            <div style={{ display: activeTab === "livestream-cloner" ? "block" : "none" }}>
              {(currentUser?.plan === 'FREE' || currentUser?.plan === 'STARTER') 
                ? (activeTab === "livestream-cloner" && <UpgradePrompt featureName="Sao Chép Livestream Clone" requiredPlan="Gói PRO" setActiveTab={setActiveTab} />)
                : <LivestreamClonerStudio />
              }
            </div>

            {activeTab === "team" && (
              <TeamPermissionsManager currentUser={currentUser} setCurrentUser={setCurrentUser} setActiveTab={setActiveTab} />
            )}

            {activeTab === "sales-analytics" && (
              <SalesAnalyticsManager currentUser={currentUser} />
            )}

            {activeTab === "accounts" && (
              (currentUser?.plan === 'FREE')
                ? <UpgradePrompt featureName="Quản Lý Đa Tài Khoản Mạng Xã Hội" requiredPlan="Gói STARTER" setActiveTab={setActiveTab} />
                : <MultiAccountManager />
            )}

            {activeTab === "affiliate-dashboard" && (
              <AffiliateDashboard currentUser={currentUser} />
            )}

            {activeTab === "captcha" && (
              <AutoCaptchaSolver setActiveTab={setActiveTab} />
            )}

            {activeTab === "profile" && (
              <UserProfile setActiveTab={setActiveTab} 
                currentUser={currentUser} 
                aiAvatarFeatureEnabled={aiAvatarFeatureEnabled}
                setAiAvatarFeatureEnabled={setAiAvatarFeatureEnabled}
              />
            )}

            {activeTab === "admin" && (
              <AdminDashboard setActiveTab={setActiveTab} 
                currentUser={currentUser} 
                aiAvatarFeatureEnabled={aiAvatarFeatureEnabled}
                setAiAvatarFeatureEnabled={setAiAvatarFeatureEnabled}
              />
            )}
          </>
        )}

      </main>

      <RecentPurchasePopup />

      {/* 🌐 COMPLETE MULTI-OPTION AUTHENTICATION MODAL */}
      {googleLoginModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 sm:p-8 rounded-[36px] border border-white/20 max-w-md w-full text-center space-y-5 shadow-2xl bg-[#0D0D15]/98 animate-fadeIn max-h-[90vh] overflow-y-auto">
            
            <div className="w-16 h-16 rounded-2xl bg-white mx-auto flex items-center justify-center p-3 shadow-glow-white border-2 border-white/40">
              <svg className="w-full h-full" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-400 text-[10px] font-black uppercase">
                ● HỆ THỐNG ĐĂNG NHẬP & ĐỒNG BỘ CLOUD
              </div>
              <h3 className="text-xl font-black text-white">Đăng Nhập Tài Khoản</h3>
              <p className="text-xs text-gray-400 leading-relaxed max-w-xs mx-auto">
                Đồng bộ tài khoản, Token AI, Điểm thưởng & Quản trị Doanh số Real-time.
              </p>
            </div>

            {/* OPTION 1: GOOGLE OAUTH 1-CLICK */}
            <button
              onClick={handleRealGoogleOAuth}
              className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-gray-100 text-gray-900 font-black text-xs shadow-xl flex items-center justify-center gap-3 transition-all cursor-pointer border border-gray-300 hover:scale-[1.02]"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>ĐĂNG NHẬP BẰNG GOOGLE</span>
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/15" />
              <span className="text-[10px] text-gray-500 font-bold uppercase">HOẶC NHẬP GMAIL TRỰC TIẾP</span>
              <div className="flex-1 h-px bg-white/15" />
            </div>

            {/* OPTION 2: DIRECT GMAIL FORM */}
            <form onSubmit={handleRealGmailSubmit} className="space-y-2.5 text-left">
              <div>
                <label className="text-[10px] font-black text-gray-300 uppercase block mb-1">
                  Địa Chỉ Gmail / Email Của Bạn:
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={realGmailInput}
                    onChange={(e) => setRealGmailInput(e.target.value)}
                    placeholder="ví dụ: quocthiencr90@gmail.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white/5 border border-white/20 text-white text-xs placeholder:text-gray-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-300 uppercase block mb-1">
                  Họ Và Tên / Biệt Danh (Tùy chọn):
                </label>
                <input
                  type="text"
                  value={realNameInput}
                  onChange={(e) => setRealNameInput(e.target.value)}
                  placeholder="ví dụ: Quốc Thiện Admin"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/20 text-white text-xs placeholder:text-gray-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 hover:to-purple-500 text-white font-black text-xs shadow-lg shadow-red-600/30 transition-all cursor-pointer hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>XÁC NHẬN ĐĂNG NHẬP & ĐỒNG BỘ</span>
              </button>
            </form>

            {/* OPTION 3: QUICK PRESET 1-CLICK DEMO / ADMIN */}
            <div className="pt-2 border-t border-white/10 space-y-2">
              <span className="text-[10px] text-gray-500 font-black uppercase block text-center">
                TRUY CẬP NHANH 1-CHẠM:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const adminUser = {
                      name: "Quốc Thiện Admin",
                      email: "quocthiencr90@gmail.com",
                      avatar: "https://lh3.googleusercontent.com/a/default-user",
                      isAdmin: true,
                      plan: "VIP PRO",
                      tokens: 999999
                    };
                    setCurrentUser(adminUser);
                    localStorage.setItem("avalive_current_user", JSON.stringify(adminUser));
                    syncUserToSupabase(adminUser);
                    setGoogleLoginModalOpen(false);
                    setActiveTab("broadcast");
                  }}
                  className="px-2.5 py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 hover:bg-amber-500/25 text-amber-300 text-[10px] font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>👑 Admin VIP</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const memberUser = {
                      name: "Thành Viên VIP",
                      email: "member@avalive.vn",
                      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=member",
                      isAdmin: false,
                      plan: "PRO",
                      tokens: 100000
                    };
                    setCurrentUser(memberUser);
                    localStorage.setItem("avalive_current_user", JSON.stringify(memberUser));
                    syncUserToSupabase(memberUser);
                    setGoogleLoginModalOpen(false);
                    setActiveTab("broadcast");
                  }}
                  className="px-2.5 py-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 hover:bg-cyan-500/25 text-cyan-300 text-[10px] font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>🚀 Thành Viên PRO</span>
                </button>
              </div>
            </div>

            <button
              onClick={() => setGoogleLoginModalOpen(false)}
              className="text-xs text-gray-500 hover:text-gray-300 font-bold pt-1 cursor-pointer block mx-auto"
            >
              Đóng cửa sổ
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

