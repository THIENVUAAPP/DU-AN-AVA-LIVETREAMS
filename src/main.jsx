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
            <button 
              onClick={() => {
                try {
                  localStorage.removeItem('aidol_active_job');
                  localStorage.removeItem('aidol_quick_recent_actions');
                } catch(e) {}
                window.location.reload();
              }}
              style={{ backgroundColor: '#3b82f6', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
            >
              🔄 Khôi Phục & Làm Mới
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const pathname = window.location.pathname.toLowerCase();
const isDesktopMode = pathname === '/desktop' || pathname.startsWith('/desktop') || window.location.hash.includes('desktop') || new URLSearchParams(window.location.search).get('mode') === 'desktop';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <TokenProvider>
        {isDesktopMode ? <DesktopAppUI /> : <App />}
      </TokenProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
