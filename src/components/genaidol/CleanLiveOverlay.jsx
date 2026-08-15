import React, { useState, useEffect } from 'react';

/**
 * Cửa Sổ Overlay Nhân Vật Live Sạch Cho TikTok LIVE Studio & OBS Studio
 * URL: ?overlay=cleanlive hoặc ?overlay=avatar
 * Dùng làm Browser Source hoặc Window Capture độc lập, tự động đồng bộ video/hình ảnh thời gian thực từ Studio
 */
export default function CleanLiveOverlay() {
  const [streamData, setStreamData] = useState(() => {
    try {
      const saved = localStorage.getItem('aidol_clean_stream_state');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      mediaUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
      isVideo: false,
      characterName: 'AI Idol',
      isConnected: true
    };
  });

  useEffect(() => {
    document.title = 'AVA Live Output — TikTok LIVE Studio';
    document.documentElement.style.background = 'transparent';
    document.body.style.background = 'transparent';

    if (typeof BroadcastChannel === 'undefined') return;
    const channel = new BroadcastChannel('avalive_clean_stream_channel');
    
    channel.onmessage = (event) => {
      if (event.data && event.data.type === 'STREAM_MEDIA_UPDATE') {
        setStreamData({
          mediaUrl: event.data.mediaUrl,
          isVideo: event.data.isVideo,
          characterName: event.data.characterName,
          isConnected: event.data.isConnected
        });
      }
    };

    // Storage fallback listener
    const handleStorage = (e) => {
      if (e.key === 'aidol_clean_stream_state' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setStreamData(parsed);
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      channel.close();
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full bg-transparent overflow-hidden flex items-center justify-center">
      {streamData.isVideo ? (
        <video
          key={streamData.mediaUrl}
          src={streamData.mediaUrl}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover select-none"
        />
      ) : (
        <img
          key={streamData.mediaUrl}
          src={streamData.mediaUrl}
          alt={streamData.characterName || 'Live Idol'}
          className="w-full h-full object-cover select-none"
        />
      )}
    </div>
  );
}
