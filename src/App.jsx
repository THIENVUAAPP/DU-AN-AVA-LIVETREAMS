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
  const [activeTab, setActiveTab] = useState(() => { 
    try {
      const saved = localStorage.getItem("avalive_current_user"); 
      return saved ? "broadcast" : "overview"; 
    } catch (e) {
      return "overview";
    }
  });
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
    setActiveTab("overview");

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
      
      {/* Navigation Header (Chỉ hiển thị trong Giao Diện Chính Thức khi đã đăng nhập) */}
      {currentUser && activeTab !== 'overview' && activeTab !== 'affiliate-landing' && (
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
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        
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
              (currentUser?.plan === 'FREE' || currentUser?.plan === 'STARTER')
                ? <UpgradePrompt featureName="Quản Lý Phân Quyền Đội Ngũ" requiredPlan="Gói PRO" setActiveTab={setActiveTab} />
                : <TeamPermissionsManager currentUser={currentUser} setCurrentUser={setCurrentUser} setActiveTab={setActiveTab} />
            )}

            {activeTab === "sales-analytics" && (
              (currentUser?.plan === 'FREE' || currentUser?.plan === 'STARTER')
                ? <UpgradePrompt featureName="Phân Tích Bán Hàng & Chuyển Đổi" requiredPlan="Gói PRO" setActiveTab={setActiveTab} />
                : <SalesAnalyticsManager currentUser={currentUser} />
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

            {activeTab === "admin" && currentUser?.isAdmin && (
              <AdminDashboard setActiveTab={setActiveTab} 
                currentUser={currentUser} 
                aiAvatarFeatureEnabled={aiAvatarFeatureEnabled}
                setAiAvatarFeatureEnabled={setAiAvatarFeatureEnabled}
              />
            )}
          </>
        )}

      </main>

      {/* 🌐 OFFICIAL GOOGLE OAUTH AUTHENTICATION MODAL (CLEAN 1-BUTTON ONLY) */}
      <RecentPurchasePopup />

      {/* 🌐 OFFICIAL GOOGLE OAUTH AUTHENTICATION MODAL (CLEAN 1-BUTTON ONLY) */}
      {googleLoginModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-8 rounded-[36px] border border-white/20 max-w-md w-full text-center space-y-6 shadow-2xl bg-[#0D0D15]/98 animate-fadeIn">
            
            <div className="w-20 h-20 rounded-3xl bg-white mx-auto flex items-center justify-center p-4 shadow-glow-white border-2 border-white/40">
              <svg className="w-full h-full" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
            </div>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-400 text-[10px] font-black uppercase">
                ● GOOGLE OAUTH 2.0 AUTHENTICATION
              </div>
              <h3 className="text-2xl font-black text-white">Xác Thực Đăng Nhập Google</h3>
              <p className="text-xs text-gray-300 leading-relaxed max-w-xs mx-auto">
                Bấm nút bên dưới để đăng nhập chính thức bằng tài khoản Google của bạn.
              </p>
            </div>

            {/* CLEAN OFFICIAL GOOGLE OAUTH BUTTON ONLY */}
            <div className="pt-2">
              <button
                onClick={handleRealGoogleOAuth}
                className="w-full py-4 px-5 rounded-2xl bg-white hover:bg-gray-100 text-gray-900 font-black text-sm shadow-xl flex items-center justify-center gap-3 transition-all cursor-pointer border border-gray-300 hover:scale-[1.02]"
              >
                <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>🌐 KẾT NỐI TÀI KHOẢN GOOGLE</span>
              </button>
            </div>

            <button
              onClick={() => setGoogleLoginModalOpen(false)}
              className="text-xs text-gray-500 hover:text-gray-300 font-bold pt-2 cursor-pointer block mx-auto"
            >
              Hủy bỏ
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
