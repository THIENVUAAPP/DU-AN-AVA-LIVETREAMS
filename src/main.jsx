import React, { Component } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import DesktopAppUI from './components/genaidol/DesktopAppUI.jsx';
import { TokenProvider } from './components/genaidol/TokenContext.jsx';
import { sanitizeAllLocalStorage, safeRemoveItem } from './utils/safeStorage.js';
import { APP_VERSION } from './components/genaidol/UpdateNotificationModal';
import './index.css';

// 🛡️ TỰ ĐỘNG DỌN DẸP & BẢO VỆ LOCALSTORAGE NGAY KHI KHỞI ĐỘNG
sanitizeAllLocalStorage();

const CURRENT_APP_VERSION = APP_VERSION;
try {
  const savedVer = localStorage.getItem('avalive_installed_version');
  if (savedVer && savedVer !== CURRENT_APP_VERSION) {
    console.log(`[AvaLive] Nâng cấp từ ${savedVer} lên ${CURRENT_APP_VERSION}. Tự động tối ưu cache phiên bản mới...`);
    ['aidol_active_job', 'aidol_quick_recent_actions', 'avalive_temp_cache'].forEach(k => {
      safeRemoveItem(k);
    });
    localStorage.setItem('avalive_installed_version', CURRENT_APP_VERSION);
    if ('caches' in window) {
      caches.keys().then(keys => keys.forEach(k => caches.delete(k))).catch(() => {});
    }
  } else if (!savedVer) {
    localStorage.setItem('avalive_installed_version', CURRENT_APP_VERSION);
  }
} catch (e) {}

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Application Render Error:", error, errorInfo);
    
    // ⚡ TỰ ĐỘNG TỰ PHỤC HỒI 1 LẦN (AUTO-SELF-HEALING)
    // Nếu phát hiện xung đột dữ liệu phiên bản cũ, tự động dọn dẹp và nạp lại an toàn mà không làm phiền người dùng
    try {
      const autoHealKey = 'avalive_auto_healed_' + CURRENT_APP_VERSION;
      if (sessionStorage.getItem(autoHealKey) !== 'true') {
        sessionStorage.setItem(autoHealKey, 'true');
        sanitizeAllLocalStorage();
        ['aidol_active_job', 'aidol_quick_recent_actions', 'avalive_temp_cache', 'avalive_user_locked_media'].forEach(k => {
          safeRemoveItem(k);
        });
        setTimeout(() => {
          this.setState({ hasError: false, error: null });
        }, 100);
      }
    } catch(e) {}
  }

  handleFullRecovery = async () => {
    try {
      // Giữ lại email đăng nhập và token của người dùng, dọn dẹp các cache giao diện cũ
      const savedEmail = localStorage.getItem('avalive_saved_gmail');
      const currentUser = localStorage.getItem('avalive_current_user');
      
      sanitizeAllLocalStorage();
      
      ['aidol_active_job', 'aidol_quick_recent_actions', 'avalive_temp_cache', 'avalive_user_locked_media', 'avalive_master_live_running'].forEach(k => {
        safeRemoveItem(k);
      });

      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map(k => caches.delete(k)));
      }
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        for (let reg of regs) await reg.unregister();
      }

      if (savedEmail) localStorage.setItem('avalive_saved_gmail', savedEmail);
      if (currentUser) localStorage.setItem('avalive_current_user', currentUser);
    } catch(e) {}

    // Reset error state trực tiếp hoặc reload
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0f', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, -apple-system, sans-serif', padding: '24px', textAlign: 'center' }}>
          <div style={{ padding: '32px 28px', background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.6), rgba(15, 23, 42, 0.9))', border: '1px solid rgba(6, 182, 212, 0.4)', borderRadius: '24px', maxWidth: '520px', width: '100%', boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(6, 182, 212, 0.2)' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>✨</div>
            <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#38bdf8', marginBottom: '8px', letterSpacing: '-0.5px' }}>Tự Động Nâng Cấp AvaLive Studio</h2>
            <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '20px', lineHeight: '1.6' }}>
              Hệ thống đang đồng bộ hóa dữ liệu phiên bản mới <strong style={{ color: '#fff' }}>v{CURRENT_APP_VERSION}</strong> để đạt hiệu năng 60 FPS cao nhất.
            </p>
            {this.state.error && (
              <pre style={{ fontSize: '11px', color: '#f87171', background: 'rgba(0,0,0,0.6)', padding: '10px 12px', borderRadius: '12px', overflowX: 'auto', marginBottom: '20px', textAlign: 'left', border: '1px solid rgba(248, 113, 113, 0.2)' }}>
                {this.state.error.toString()}
              </pre>
            )}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button 
                onClick={this.handleFullRecovery}
                style={{ background: 'linear-gradient(135deg, #06b6d4, #2563eb)', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '14px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', boxShadow: '0 8px 20px rgba(6, 182, 212, 0.4)', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                🚀 Mở Phần Mềm Ngay (1-Click)
              </button>
              <button 
                onClick={() => {
                  try {
                    localStorage.clear();
                    sessionStorage.clear();
                  } catch(e) {}
                  window.location.reload();
                }}
                style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.15)', padding: '12px 18px', borderRadius: '14px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}
              >
                🧹 Xóa Cache Cũ
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const pathname = typeof window !== 'undefined' ? window.location.pathname.toLowerCase() : '';
const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
const hostname = typeof window !== 'undefined' ? window.location.hostname.toLowerCase() : '';

const hasOverlayParam = 
  searchParams.has('overlay') || 
  pathname.includes('/live') || 
  pathname.includes('/battle') || 
  pathname.includes('/bando') || 
  pathname.includes('/overlay') || 
  pathname.includes('/idol') || 
  pathname.includes('/studio');

const isLocalHost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('127.0.0.1.nip.io') || hostname.startsWith('192.168.');

const isDesktopMode = 
  !hasOverlayParam && (
    isLocalHost ||
    pathname === '/desktop' || 
    pathname.startsWith('/desktop') || 
    window.location.hash.includes('desktop') || 
    searchParams.get('mode') === 'desktop' ||
    window.location.port === '5173' ||
    window.location.port === '3000' ||
    window.location.port === '3001'
  );

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <TokenProvider>
        {isDesktopMode ? <DesktopAppUI /> : <App />}
      </TokenProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
