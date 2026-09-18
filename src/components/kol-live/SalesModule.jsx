import React, { useState } from 'react';
import { ShoppingCart, Zap, Clock, Ticket, Gift, MousePointerClick, Play, Megaphone, Target, Pin } from 'lucide-react';

export default function SalesModule() {
  const [activePromo, setActivePromo] = useState('flashsale');

  return (
    <div className="flex flex-col h-full bg-[#0B0B14] text-white">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-white/10 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <ShoppingCart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Live Sales Engine
            </h1>
            <p className="text-xs text-gray-400">Điều khiển kích sale: Flash Sale, Voucher, Countdown, Auto CTA, Ghim sản phẩm</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 flex gap-6 custom-scrollbar">
        
        {/* Left: Active Promotions & Tools */}
        <div className="w-2/3 flex flex-col gap-6">
          <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-black/40">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Zap className="w-5 h-5 text-orange-400" /> Công Cụ Kích Sale Trực Tiếp</h2>
            
            <div className="grid grid-cols-3 gap-4">
              <button 
                onClick={() => setActivePromo('flashsale')}
                className={`p-4 rounded-xl border transition-all ${activePromo === 'flashsale' ? 'bg-orange-500/20 border-orange-500 text-orange-400' : 'bg-black/60 border-white/5 hover:border-white/20'}`}
              >
                <Clock className="w-6 h-6 mb-2" />
                <div className="font-bold text-sm">Flash Sale</div>
                <div className="text-[10px] text-gray-400 mt-1 text-left">Tạo deal sốc có đồng hồ đếm ngược</div>
              </button>

              <button 
                onClick={() => setActivePromo('voucher')}
                className={`p-4 rounded-xl border transition-all ${activePromo === 'voucher' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-black/60 border-white/5 hover:border-white/20'}`}
              >
                <Ticket className="w-6 h-6 mb-2" />
                <div className="font-bold text-sm">Tung Voucher</div>
                <div className="text-[10px] text-gray-400 mt-1 text-left">Thả mã giảm giá chớp nhoáng (Mưa Voucher)</div>
              </button>

              <button 
                onClick={() => setActivePromo('combo')}
                className={`p-4 rounded-xl border transition-all ${activePromo === 'combo' ? 'bg-purple-500/20 border-purple-500 text-purple-400' : 'bg-black/60 border-white/5 hover:border-white/20'}`}
              >
                <Gift className="w-6 h-6 mb-2" />
                <div className="font-bold text-sm">Tạo Combo</div>
                <div className="text-[10px] text-gray-400 mt-1 text-left">Upsell bằng cách gộp nhiều sản phẩm</div>
              </button>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-black/40 flex-1">
            {activePromo === 'flashsale' && (
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-orange-400 flex items-center gap-2"><Clock className="w-4 h-4" /> Cấu hình Flash Sale Đang Live</h3>
                
                <div className="flex gap-4">
                  <div className="flex-1 space-y-3">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Chọn Sản Phẩm Flash Sale</label>
                      <select className="w-full p-2 bg-black/60 border border-white/10 rounded-lg outline-none focus:border-orange-500 text-sm">
                        <option>Combo Skincare Sáng Da (Hiện tại: 450k)</option>
                        <option>Serum Phục Hồi B5 (Hiện tại: 280k)</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">Giá Flash Sale (VNĐ)</label>
                        <input type="text" className="w-full p-2 bg-black/60 border border-white/10 rounded-lg outline-none text-orange-400 font-bold" defaultValue="199,000" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">Số lượng giới hạn</label>
                        <input type="number" className="w-full p-2 bg-black/60 border border-white/10 rounded-lg outline-none" defaultValue="50" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Thời gian đếm ngược (Phút)</label>
                      <input type="number" className="w-full p-2 bg-black/60 border border-white/10 rounded-lg outline-none" defaultValue="5" />
                    </div>
                  </div>
                  
                  <div className="w-1/3 bg-black/60 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                    <div className="text-xs text-gray-400 mb-2">Preview hiển thị trên Live</div>
                    <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white w-full py-3 rounded-lg font-black text-2xl shadow-lg shadow-orange-500/40">
                      05:00
                    </div>
                    <div className="mt-2 text-sm font-bold text-orange-400">CHỈ 199K! ĐANG MỞ BÁN!</div>
                  </div>
                </div>

                <button className="w-full py-3 bg-orange-600 hover:bg-orange-500 rounded-xl font-bold flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all">
                  <Play className="w-4 h-4 fill-current" /> BẮT ĐẦU FLASH SALE NGAY TRÊN LIVE
                </button>
              </div>
            )}

            {activePromo === 'voucher' && (
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-emerald-400 flex items-center gap-2"><Ticket className="w-4 h-4" /> Tung Voucher</h3>
                <p className="text-xs text-gray-400">Rải mã giảm giá lên màn hình, khách xem click để lưu ngay.</p>
                {/* ... existing logic mock ... */}
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                  Bảng điều khiển cấu hình Voucher đang được tải...
                </div>
              </div>
            )}

            {activePromo === 'combo' && (
               <div className="space-y-4">
                <h3 className="font-bold text-sm text-purple-400 flex items-center gap-2"><Gift className="w-4 h-4" /> Tạo Combo Tức Thì</h3>
                <p className="text-xs text-gray-400">Gộp nhanh 2-3 sản phẩm đang có để tạo combo Upsell ngay trên phiên Live.</p>
                <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                  Bảng chọn sản phẩm gộp Combo đang được tải...
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Automation & Live Controls */}
        <div className="w-1/3 flex flex-col gap-4">
          
          {/* Ghim Sản phẩm */}
          <div className="glass-panel p-4 rounded-xl border border-white/10 bg-black/40">
            <h3 className="font-bold text-sm mb-3 flex items-center gap-2"><Pin className="w-4 h-4 text-blue-400" /> Ghim Sản Phẩm (Pin)</h3>
            <div className="flex gap-2">
              <select className="flex-1 p-2 bg-black/60 border border-white/10 rounded-lg text-xs outline-none focus:border-blue-500">
                <option>SP02: Serum Phục Hồi B5</option>
                <option>SP01: Combo Skincare</option>
              </select>
              <button className="px-3 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-bold transition-colors">GHIM</button>
            </div>
            <div className="mt-2 text-[10px] text-gray-500">Avatar AI sẽ tự động nhắc tên sản phẩm này khi được ghim.</div>
          </div>

          {/* Auto CTA */}
          <div className="glass-panel p-4 rounded-xl border border-white/10 bg-black/40 flex-1 overflow-auto">
            <h3 className="font-bold text-sm mb-3 flex items-center gap-2"><Megaphone className="w-4 h-4 text-pink-400" /> Tự động Kêu Gọi (Auto CTA)</h3>
            
            <div className="space-y-3">
               {[
                 { name: 'Kêu gọi Follow kênh', freq: 'Mỗi 10 phút', active: true },
                 { name: 'Nhắc chốt đơn góc trái', freq: 'Mỗi 5 phút', active: true },
                 { name: 'Nhắc khách mới Share Live', freq: 'Mỗi 15 phút', active: false },
                 { name: 'Cảm ơn khi có đơn mới (Realtime)', freq: 'Ngay lập tức', active: true },
               ].map((cta, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
                    <div>
                      <div className="text-xs font-bold text-gray-200">{cta.name}</div>
                      <div className="text-[10px] text-gray-500">{cta.freq}</div>
                    </div>
                    <div className={`w-8 h-4 rounded-full relative cursor-pointer ${cta.active ? 'bg-pink-500' : 'bg-gray-700'}`}>
                      <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${cta.active ? 'left-4.5 right-0.5' : 'left-0.5'}`} style={{ left: cta.active ? '18px' : '2px' }} />
                    </div>
                  </div>
               ))}
            </div>
          </div>
          
        </div>

      </div>
    </div>
  );
}
