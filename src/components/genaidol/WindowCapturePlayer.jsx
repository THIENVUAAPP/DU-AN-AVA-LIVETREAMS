import React from 'react';
import CleanLiveOverlay from './CleanLiveOverlay.jsx';

/**
 * 🖥️ CỬA SỔ BẮT HÌNH WINDOW CAPTURE OBS & TIKTOK LIVE STUDIO (9:16)
 * - Render trực tiếp CleanLiveOverlay với đầy đủ 100% các lớp từ Sân Khấu Chính:
 *   Multi-Avatar (1-4 người), Video/Ảnh nền, PiP Video phụ, Banner hình ảnh, 
 *   Banner tiêu đề chữ nổi bật, Sticker/Logo, Sản phẩm ghim TikTok Shop, Chroma Key tách nền siêu sạch.
 * - Đồng bộ 0ms thời gian thực qua BroadcastChannel, Socket.io, Supabase và LocalStorage.
 * - Điều khiển âm thanh độc lập, phím tắt 'H' ẩn/hiện dock mượt mà.
 */
const WindowCapturePlayer = () => {
  return <CleanLiveOverlay />;
};

export default WindowCapturePlayer;

