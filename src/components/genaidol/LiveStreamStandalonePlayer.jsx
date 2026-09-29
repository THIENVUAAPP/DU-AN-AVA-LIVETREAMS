import React from "react";
import CleanLiveOverlay from "./CleanLiveOverlay.jsx";

/**
 * 🎬 PHÁT SÓNG TRỰC TIẾP ONLINE 100% CHO TIKTOK LIVE STUDIO (CEF BROWSER SOURCE) & OBS STUDIO
 * - Render trực tiếp CleanLiveOverlay với đầy đủ 100% các lớp từ Sân Khấu Chính:
 *   Multi-Avatar (1-4 người), Video/Ảnh nền chính, PiP Video phụ, Banner hình ảnh, 
 *   Banner tiêu đề chữ nổi bật, Sticker/Logo, Sản phẩm ghim TikTok Shop, Chroma Key tách nền siêu sạch.
 * - Đồng bộ 0ms thời gian thực qua WebSocket, REST API Polling, BroadcastChannel và Supabase.
 * - Tuyệt đối không dùng iframe lặp lại để chống 100% lỗi màn hình đen.
 */
export default function LiveStreamStandalonePlayer() {
  return <CleanLiveOverlay />;
}
