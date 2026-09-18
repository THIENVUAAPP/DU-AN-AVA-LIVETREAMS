// Nguồn dữ liệu dùng chung cho danh sách kênh live đã kết nối (TikTok/YouTube/Facebook/Shopee/Instagram).
// Được MultistreamStudio.jsx (Restream Đa Nền Tảng) ghi/đọc, và DanceFloorStudio.jsx (Sàn Nhảy TikTok)
// đọc lại để biết kênh nào đang "kết nối" — tránh khai báo trùng danh sách kênh ở 2 nơi khác nhau.

export const DEFAULT_LIVE_CHANNELS = [
  { id: 'tiktok_1', name: 'TikTok Live Pro (Kênh 01)', icon: '🎵', status: 'connected', quality: '1080p60', viewers: '1,840', rtmpUrl: 'rtmp://live-upload.tiktok.com/app/stream-key-848', streamKey: 'live_stream_tk_99812401', token: 'act_tk_sec_881293', bg: 'from-[#EF4444]/20 via-[#121216] to-[#0A0A0A]' },
  { id: 'tiktok_2', name: 'TikTok Shop Mall (Kênh 02)', icon: '🎵', status: 'connected', quality: '1080p60', viewers: '3,290', rtmpUrl: 'rtmp://live-upload.tiktok.com/app/stream-key-991', streamKey: 'live_stream_tk_7761829', token: 'act_tk_sec_991823', bg: 'from-pink-900/30 via-[#121216] to-black' },
  { id: 'facebook_1', name: 'Facebook Fanpage VIP 01', icon: '📘', status: 'connected', quality: '1080p60', viewers: '4,120', rtmpUrl: 'rtmps://live-api-s.facebook.com:443/rtmp/', streamKey: 'FB-1928301923091', token: 'EAAG192038102381290312093', bg: 'from-[#3B82F6]/20 via-[#121216] to-black' },
  { id: 'facebook_2', name: 'Facebook Trang Cá Nhân', icon: '📘', status: 'connected', quality: '1080p60', viewers: '1,150', rtmpUrl: 'rtmps://live-api-s.facebook.com:443/rtmp/', streamKey: 'FB-889123019283', token: 'EAAG889123819203810293', bg: 'from-blue-900/20 via-[#121216] to-black' },
  { id: 'youtube_1', name: 'YouTube Channel 4K', icon: '🔴', status: 'connected', quality: '4K Ultra HD', viewers: '890', rtmpUrl: 'rtmp://a.rtmp.youtube.com/live2', streamKey: 'abcd-1234-efgh-5678-ijkl', token: 'yt_oauth_token_991823', bg: 'from-red-950/30 via-[#121216] to-black' },
  { id: 'shopee_1', name: 'Shopee Live Mall', icon: '🛍️', status: 'connected', quality: '1080p', viewers: '2,450', rtmpUrl: 'rtmp://live.shopee.vn/live/app', streamKey: 'shopee_live_key_77123', token: 'shopee_token_88129', bg: 'from-amber-950/30 via-[#121216] to-black' },
  { id: 'instagram_1', name: 'Instagram Live Pro', icon: '📸', status: 'connected', quality: '1080p', viewers: '620', rtmpUrl: 'rtmps://live-upload.instagram.com:443/rtmp/', streamKey: 'ig_live_key_99812', token: 'ig_access_token_66128', bg: 'from-purple-950/30 via-[#121216] to-black' },
];

const STORAGE_KEY = 'avalive_live_channels';

export function loadLiveChannels() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('loadLiveChannels: lỗi đọc localStorage', e);
  }
  return DEFAULT_LIVE_CHANNELS;
}

export function saveLiveChannels(channels) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(channels));
  } catch (e) {
    console.error('saveLiveChannels: lỗi ghi localStorage', e);
  }
}
