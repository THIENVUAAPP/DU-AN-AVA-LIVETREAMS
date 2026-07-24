import React, { useState } from 'react';
import Header from './components/Header';
import LandingHero from './components/LandingHero';
import ProductionStudio from './components/ProductionStudio';
import AIAvatarStudio from './components/AIAvatarStudio';
import LiveCommerceStudio from './components/LiveCommerceStudio';
import MultistreamStudio from './components/MultistreamStudio';
import UnifiedChatHub from './components/UnifiedChatHub';
import MultiAccountManager from './components/MultiAccountManager';
import AISellerOps from './components/AISellerOps';
import EnterprisePayment from './components/EnterprisePayment';
import AdminDashboard from './components/AdminDashboard';
import UserProfile from './components/UserProfile';
import AffiliateLanding from './components/AffiliateLanding';
import AffiliateDashboard from './components/AffiliateDashboard';
import TeamPermissionsManager from './components/TeamPermissionsManager';
import SalesAnalyticsManager from './components/SalesAnalyticsManager';
import { Lock, Sparkles, ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('broadcast'); // Default to Studio Workspace
  const [isLive, setIsLive] = useState(false);

  // Master Admin Switch for AI Avatar Feature (Default FALSE / LOCKED as requested by user)
  const [aiAvatarFeatureEnabled, setAiAvatarFeatureEnabled] = useState(false);

  // Google Authentication State (Default logged in as Admin)
  const [currentUser, setCurrentUser] = useState({
    name: 'Quốc Thiên Admin',
    email: 'quocthiencr90@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    isAdmin: true,
  });

  const [googleLoginModalOpen, setGoogleLoginModalOpen] = useState(false);

  const handleSimulateGoogleLogin = (isAdminRole) => {
    if (isAdminRole) {
      setCurrentUser({
        name: 'Quốc Thiên Admin',
        email: 'quocthiencr90@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        isAdmin: true,
      });
      setActiveTab('avatars'); // Instantly move into Avatars Studio Workspace
      alert("Đã kết nối thành công tài khoản Google Admin: quocthiencr90@gmail.com! Đã mở khóa trọn bộ Workspace Studio.");
    } else {
      setCurrentUser({
        name: 'Trần Thị Mai',
        email: 'mai.tran@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
        isAdmin: false,
      });
      setActiveTab('avatars'); // Instantly move into Avatars Studio Workspace
      alert("Đã kết nối thành công tài khoản Google: mai.tran@gmail.com! Đã mở khóa Workspace Studio.");
    }
    setGoogleLoginModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-gray-100 flex flex-col font-sans selection:bg-[#EF4444] selection:text-white">
      
      {/* Navigation Header */}
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        
        {/* PUBLIC TABS & GENERAL TABS */}
        {activeTab === 'overview' && (
          <LandingHero setActiveTab={setActiveTab} setGoogleLoginModalOpen={setGoogleLoginModalOpen} />
        )}

        {activeTab === 'affiliate-landing' && (
          <AffiliateLanding 
            currentUser={currentUser} 
            setGoogleLoginModalOpen={setGoogleLoginModalOpen} 
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'enterprise' && (
          <EnterprisePayment />
        )}

        {/* WORKSPACE VIP STUDIO MODE (When User IS Logged In) */}
        {currentUser && (
          <>
            {activeTab === 'broadcast' && (
              <ProductionStudio isLive={isLive} aiAvatarFeatureEnabled={aiAvatarFeatureEnabled} setActiveTab={setActiveTab} />
            )}

            {activeTab === 'avatars' && (
              <AIAvatarStudio isLive={isLive} aiAvatarFeatureEnabled={aiAvatarFeatureEnabled} />
            )}

            {activeTab === 'commerce' && (
              <LiveCommerceStudio isLive={isLive} />
            )}

            {activeTab === 'multistream' && (
              <MultistreamStudio isLive={isLive} setIsLive={setIsLive} />
            )}

            {activeTab === 'chat-hub' && (
              <UnifiedChatHub isLive={isLive} />
            )}

            {activeTab === 'team' && (
              <TeamPermissionsManager currentUser={currentUser} setCurrentUser={setCurrentUser} setActiveTab={setActiveTab} />
            )}

            {activeTab === 'sales-analytics' && (
              <SalesAnalyticsManager currentUser={currentUser} />
            )}

            {activeTab === 'accounts' && (
              <MultiAccountManager />
            )}

            {activeTab === 'affiliate-dashboard' && (
              <AffiliateDashboard currentUser={currentUser} />
            )}

            {activeTab === 'profile' && (
              <UserProfile 
                currentUser={currentUser} 
                aiAvatarFeatureEnabled={aiAvatarFeatureEnabled}
                setAiAvatarFeatureEnabled={setAiAvatarFeatureEnabled}
              />
            )}

            {activeTab === 'admin' && currentUser?.isAdmin && (
              <AdminDashboard 
                currentUser={currentUser} 
                aiAvatarFeatureEnabled={aiAvatarFeatureEnabled}
                setAiAvatarFeatureEnabled={setAiAvatarFeatureEnabled}
              />
            )}
          </>
        )}

      </main>

      {/* Google Login Modal Popup */}
      {googleLoginModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl border border-white/20 max-w-md w-full text-center space-y-4 shadow-2xl shadow-glow-purple">
            <div className="w-14 h-14 rounded-full bg-white mx-auto flex items-center justify-center p-3 shadow-lg">
              <svg className="w-full h-full" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
            </div>

            <div>
              <h3 className="text-xl font-black text-white">Đăng Nhập Tài Khoản Google</h3>
              <p className="text-xs text-gray-400 mt-1">Đăng nhập 1-Chạm bằng Google Auth để mở khóa Bàn Dựng Studio.</p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => handleSimulateGoogleLogin(true)}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#8B5CF6] via-[#EF4444] to-[#3B82F6] text-white font-black text-xs shadow-glow-purple flex items-center justify-center gap-2 hover:opacity-95 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>ĐĂNG NHẬP ADMIN GMAIL (quocthiencr90@gmail.com)</span>
              </button>

              <button
                onClick={() => handleSimulateGoogleLogin(false)}
                className="w-full py-3 px-4 rounded-2xl bg-white/10 text-gray-200 font-bold text-xs hover:bg-white/20 transition-all cursor-pointer"
              >
                Đăng nhập User Gmail (mai.tran@gmail.com)
              </button>
            </div>

            <button
              onClick={() => setGoogleLoginModalOpen(false)}
              className="text-xs text-gray-500 hover:text-gray-300 font-bold pt-2 cursor-pointer"
            >
              Hủy bỏ
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
