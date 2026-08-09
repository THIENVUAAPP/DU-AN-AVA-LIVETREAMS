import { useState, useRef, useCallback, useEffect } from 'react';
import { buildUnifiedEvent } from '../lib/danceFloorEngine';

// Cầu nối YouTube Live Chat API thật — REST công khai (chỉ cần API Key) gọi trực tiếp từ trình duyệt,
// không cần backend. Tách khỏi useDanceFloorEngine.js để giữ mỗi file dưới 500 dòng.
export function useYouTubeLiveChatBridge(processEvent) {
  const [ytBridge, setYtBridge] = useState({ connected: false, connecting: false, liveChatId: '', lastError: null });
  const ytTimeoutRef = useRef(null);

  const pollYouTubeChat = useCallback(
    async (apiKey, liveChatId, pageToken) => {
      try {
        const url = new URL('https://www.googleapis.com/youtube/v3/liveChat/messages');
        url.searchParams.set('liveChatId', liveChatId);
        url.searchParams.set('part', 'snippet,authorDetails');
        url.searchParams.set('key', apiKey);
        if (pageToken) url.searchParams.set('pageToken', pageToken);

        const res = await fetch(url.toString());
        if (!res.ok) {
          const errBody = await res.json().catch(() => ({}));
          throw new Error(errBody?.error?.message || `Lỗi HTTP ${res.status}`);
        }
        const data = await res.json();

        (data.items || []).forEach((item) => {
          const snippet = item.snippet;
          const author = item.authorDetails;
          if (snippet.superChatDetails) {
            processEvent(buildUnifiedEvent({
              platform: 'youtube', type: 'gift', userId: author.channelId, username: author.displayName,
              avatar: author.profileImageUrl, message: `Super Chat ${snippet.superChatDetails.amountDisplayString || ''}`,
              value: Math.round((snippet.superChatDetails.amountMicros || 0) / 10000), timestamp: Date.parse(snippet.publishedAt),
            }));
          } else if (snippet.displayMessage) {
            processEvent(buildUnifiedEvent({
              platform: 'youtube', type: 'comment', userId: author.channelId, username: author.displayName,
              avatar: author.profileImageUrl, message: snippet.displayMessage, timestamp: Date.parse(snippet.publishedAt),
            }));
          }
        });

        setYtBridge({ connected: true, connecting: false, liveChatId, lastError: null });
        ytTimeoutRef.current = setTimeout(
          () => pollYouTubeChat(apiKey, liveChatId, data.nextPageToken),
          Math.max(data.pollingIntervalMillis || 5000, 3000)
        );
      } catch (err) {
        console.error('pollYouTubeChat lỗi:', err);
        setYtBridge({ connected: false, connecting: false, liveChatId, lastError: err.message || 'Không thể kết nối YouTube Live Chat.' });
      }
    },
    [processEvent]
  );

  const handleYtConnect = useCallback((apiKey, liveChatId) => {
    setYtBridge({ connected: false, connecting: true, liveChatId, lastError: null });
    pollYouTubeChat(apiKey, liveChatId, null);
  }, [pollYouTubeChat]);

  const handleYtDisconnect = useCallback(() => {
    if (ytTimeoutRef.current) clearTimeout(ytTimeoutRef.current);
    setYtBridge({ connected: false, connecting: false, liveChatId: '', lastError: null });
  }, []);

  useEffect(() => () => { if (ytTimeoutRef.current) clearTimeout(ytTimeoutRef.current); }, []);

  return { ytBridge, handleYtConnect, handleYtDisconnect };
}
