import React, { useEffect, useState } from 'react';

const WindowCapturePlayer = () => {
  const [frameUrl, setFrameUrl] = useState('');

  useEffect(() => {
    // Trỏ vào backend (hỗ trợ cả localhost và Cloudflare Tunnel HTTPS)
    const searchParams = window.location.search || '?mode=window_capture&sound=1&autoplay=1';
    setFrameUrl(`/window-capture${searchParams}`);
  }, []);

  if (!frameUrl) return <div style={{ background: '#000', width: '100vw', height: '100vh' }} />;

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#000', margin: 0, padding: 0 }}>
      <iframe
        src={frameUrl}
        title="AvaLive Window Capture"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          display: 'block'
        }}
        allow="autoplay; fullscreen; microphone; camera; display-capture"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      />
    </div>
  );
};

export default WindowCapturePlayer;
