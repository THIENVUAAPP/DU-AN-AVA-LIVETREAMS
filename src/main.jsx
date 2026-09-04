import React, { Component } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import DesktopAppUI from './components/genaidol/DesktopAppUI.jsx';
import { TokenProvider } from './components/genaidol/TokenContext.jsx';
import './index.css';

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
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', backgroundColor: '#0f0f13', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', padding: '24px', textAlign: 'center' }}>
          <div style={{ padding: '24px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '16px', maxWidth: '500px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#ef4444', marginBottom: '8px' }}>Khôi phục giao diện AvaLive</h2>
            <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '16px' }}>Đã phát hiện xung đột dữ liệu phiên cũ. Bấm nút bên dưới để khôi phục ngay.</p>
            {this.state.error && (
              <pre style={{ fontSize: '11px', color: '#f87171', background: 'rgba(0,0,0,0.5)', padding: '8px', borderRadius: '8px', overflowX: 'auto', marginBottom: '12px', textAlign: 'left' }}>
                {this.state.error.toString()}
              </pre>
            )}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <button 
                onClick={async () => {
                  try {
                    localStorage.removeItem('aidol_active_job');
                    localStorage.removeItem('aidol_quick_recent_actions');
                    if ('caches' in window) {
                      const keys = await caches.keys();
                      await Promise.all(keys.map(k => caches.delete(k)));
                    }
                    if ('serviceWorker' in navigator) {
                      const regs = await navigator.serviceWorker.getRegistrations();
                      for (let reg of regs) await reg.unregister();
                    }
                  } catch(e) {}
                  window.location.reload();
                }}
                style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', boxShadow: '0 4px 12px rgba(37,99,235,0.4)' }}
              >
                🔄 Khôi Phục & Làm Mới (Xóa Cache)
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
// 🧹 TỰ ĐỘNG DỌN DẸP DỮ LIỆU CŨ & CACHE KHI CẬP NHẬT PHIÊN BẢN MỚI
const CURRENT_APP_VERSION = '1.3.8';
try {
  const savedVer = localStorage.getItem('avalive_installed_version');
  if (savedVer && savedVer !== CURRENT_APP_VERSION) {
    console.log(`[AvaLive] Nâng cấp từ ${savedVer} lên ${CURRENT_APP_VERSION}. Đang dọn dẹp cache cũ...`);
    const preserved = {};
    ['avalive_real_user', 'avalive_current_user', 'supabase.auth.token'].forEach(k => {
      const v = localStorage.getItem(k);
      if (v) preserved[k] = v;
    });
    localStorage.clear();
    Object.keys(preserved).forEach(k => localStorage.setItem(k, preserved[k]));
    localStorage.setItem('avalive_installed_version', CURRENT_APP_VERSION);
    if ('caches' in window) {
      caches.keys().then(keys => keys.forEach(k => caches.delete(k)));
    }
  } else if (!savedVer) {
    localStorage.setItem('avalive_installed_version', CURRENT_APP_VERSION);
  }
} catch (e) {}

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
  pathname.includes('/studio') || 
  pathname.includes('/dance');

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
