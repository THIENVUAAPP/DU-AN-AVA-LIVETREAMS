import React from 'react';
import CleanLiveOverlay from './CleanLiveOverlay.jsx';

/**
 * 🖥️ CỬA SỔ BẮT HÌNH WINDOW CAPTURE OBS & TIKTOK LIVE STUDIO (9:16)
 * - Render trực tiếp CleanLiveOverlay với đầy đủ 100% các lớp từ Sân Khấu Chính.
 * - ÉP BUỘC ĐÚNG CHUẨN TỈ LỆ 9:16: Dù người dùng mở full màn hình máy tính 16:9,
 *   nó vẫn sẽ giữ đúng 1 khung hình dọc 9:16 ở chính giữa (nền xanh lá chroma key
 *   để dễ dàng lọc nền trong OBS nếu cần, hoặc nền đen tùy thích).
 */
const WindowCapturePlayer = () => {
  return (
    <div className="w-screen h-screen bg-black flex items-center justify-center overflow-hidden">
      <div 
        className="relative shadow-2xl" 
        style={{ 
          aspectRatio: '9/16', 
          height: '100%', 
          maxHeight: '100vh',
          width: 'auto'
        }}
      >
        <CleanLiveOverlay />
      </div>
    </div>
  );
};

export default WindowCapturePlayer;
