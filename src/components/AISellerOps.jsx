import React, { useState } from 'react';
import { 
  Bot, 
  Scissors, 
  UserCheck, 
  Sparkles, 
  Download, 
  Play,
  Star,
  Zap
} from 'lucide-react';

export default function AISellerOps() {
  const highlights = [
    { id: 1, title: 'Chốt 150 Áo Chống Nước Phút 24:10', sales: '84 đơn / 2 phút', duration: '0:45', gmv: '125.160.000₫' },
    { id: 2, title: 'Demo Chống Nước Tai Nghe AI Phút 48:05', sales: '52 đơn / 3 phút', duration: '1:12', gmv: '155.480.000₫' },
    { id: 3, title: 'Flash Sale Đồng Hồ Quantum Phút 72:30', sales: '38 đơn / 1 phút', duration: '0:30', gmv: '223.820.000₫' },
  ];

  const matchedCreators = [
    { id: 1, name: 'Linh Bi Review', followers: '480K', matchScore: '98%', style: 'Thời Trang & Công Nghệ', estGmv: '250M - 400M' },
    { id: 2, name: 'Hoàng Tech Review', followers: '1.2M', matchScore: '94%', style: 'Đồ Gia Dụng Thông Minh', estGmv: '500M - 800M' },
    { id: 3, name: 'Trinh Live Queen', followers: '850K', matchScore: '91%', style: 'Chuyên Gia Livestream', estGmv: '300M - 600M' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-panel p-5 rounded-2xl border-l-4 border-l-[#8B5CF6]">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            🤖 Tự Động Hóa Vận Hành AI & Cắt Clip Ngắn
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            AI tự động phát hiện điểm nóng đơn hàng để cắt clip ngắn đăng lại, gợi ý kết nối KOL/KOC và tự động duyệt mẫu.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#121216] px-3 py-2 rounded-xl border border-white/10 text-xs font-bold">
          <Zap className="w-4 h-4 text-[#EF4444]" />
          <span className="text-gray-300">Tự Động Cắt Clip:</span>
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-400">ĐÃ BẬT</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Auto Clip Generator */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Scissors className="w-4 h-4 text-[#EF4444]" /> TỰ ĐỘNG CẮT CLIP HIGHLIGHT
            </h3>
            <span className="text-xs text-gray-400">Tự Động Phát Hiện Đơn Hàng</span>
          </div>

          <p className="text-xs text-gray-300">
            AI tự động theo dõi biến động đơn hàng trong lúc live để cắt thành các video ngắn 30s - 1 phút đăng lên TikTok / Reels.
          </p>

          <div className="space-y-3">
            {highlights.map((clip) => (
              <div key={clip.id} className="p-3.5 rounded-xl bg-[#121216] border border-white/5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#EF4444]/10 text-[#EF4444] flex items-center justify-center font-bold">
                    <Play className="w-5 h-5 fill-[#EF4444]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{clip.title}</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      Thời lượng: {clip.duration} • <span className="text-emerald-400 font-bold">{clip.sales}</span>
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => alert(`Đã tải clip "${clip.title}"!`)}
                  className="px-3 py-1.5 bg-[#EF4444] text-white hover:bg-red-600 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> TẢI CLIP
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Creator Matching */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#3B82F6]" /> GỢI Ý KẾT NỐI KOL / KOC
            </h3>
            <span className="text-xs text-gray-400">Thuật Toán AI Matching</span>
          </div>

          <p className="text-xs text-gray-300">
            Đề xuất Creator phù hợp với sản phẩm dựa trên lịch sử chuyển đổi đơn hàng thực tế.
          </p>

          <div className="space-y-3">
            {matchedCreators.map((creator) => (
              <div key={creator.id} className="p-3.5 rounded-xl bg-[#121216] border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#3B82F6]/20 text-[#3B82F6] flex items-center justify-center font-bold">
                    <Star className="w-5 h-5 fill-[#3B82F6]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white">{creator.name}</h4>
                      <span className="px-1.5 py-0.2 bg-[#3B82F6] text-white text-[9px] font-bold rounded">
                        {creator.matchScore} KHỚP
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400">
                      Followers: {creator.followers} • Phong cách: {creator.style}
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => alert(`Đã gửi lời mời hợp tác cho ${creator.name}!`)}
                  className="px-3 py-1.5 bg-[#3B82F6] text-white hover:bg-blue-600 font-bold text-xs rounded-lg transition-all"
                >
                  MỜI HỢP TÁC
                </button>
              </div>
            ))}
          </div>

          {/* Auto sample shipping rule */}
          <div className="p-3 rounded-xl bg-[#0A0A0A] border border-white/10 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-white block">Tự động duyệt gửi mẫu cho KOL:</span>
              <span className="text-[10px] text-gray-400">Điều kiện: &gt; 50.000 Followers & Lịch sử đơn tốt</span>
            </div>
            <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 font-bold rounded-md">
              ĐÃ BẬT
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
