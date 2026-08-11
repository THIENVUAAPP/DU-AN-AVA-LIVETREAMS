import React, { useState } from 'react';
import { Check, Coins, ShieldCheck, Zap, AlertCircle } from 'lucide-react';

export default function ThanhToanCoin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('gia-han');

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#E8F2FA] to-[#F1F5F9] w-full rounded-2xl overflow-hidden mb-8 border border-slate-200">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 p-8 lg:p-12">
          
          <div className="flex-1">
            <span className="inline-block px-3 py-1 bg-white text-blue-600 rounded-full text-[10px] font-bold mb-6 border border-blue-100 uppercase tracking-widest shadow-sm">
              Thanh toán an toàn • Kích hoạt tự động
            </span>
            <h1 className="text-4xl lg:text-5xl font-black text-slate-800 mb-6 tracking-tight leading-tight">
              Sẵn sàng để AIDOL Live <br className="hidden lg:block"/>bán hàng cùng bạn?
            </h1>
            <p className="text-slate-600 font-medium mb-8 max-w-xl text-lg leading-relaxed">
              Chọn gói phù hợp để mở lại đầy đủ công cụ livestream, phản hồi khách và hỗ trợ chốt đơn. Sau khi thanh toán xác nhận, hệ thống tự kích hoạt cho đúng tài khoản của bạn.
            </p>
            
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
                <Check className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-bold text-slate-700">Thanh toán qua cổng bảo mật</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
                <Check className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-bold text-slate-700">Tự cộng KOL Coin / thời hạn</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
                <Check className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-bold text-slate-700">Dùng ngay sau khi xác nhận</span>
              </div>
            </div>
          </div>

          {/* Coin Balance Card */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl shadow-blue-900/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl"></div>
              
              <div className="relative z-10">
                <h3 className="text-sm font-bold text-blue-100 mb-2">Số dư KOL Coin hiện có</h3>
                <div className="text-6xl font-black mb-4 flex items-center gap-3">
                  0 <Coins className="w-8 h-8 text-amber-400" />
                </div>
                <p className="text-xs text-blue-100/80 leading-relaxed font-medium">
                  KOL Coin cộng dồn, không bị đặt lại mỗi tháng và dùng chung cho toàn bộ hệ sinh thái KOL LIVE.
                </p>
              </div>
            </div>
          </div>
          
        </div>
      </div>

      {/* Pricing Section */}
      <div className="max-w-4xl mx-auto px-4">
        <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold mb-4 border border-blue-100 uppercase tracking-widest">
          Chọn gói phù hợp
        </span>
        
        <div className="flex flex-col lg:flex-row justify-between items-end gap-6 mb-8">
          <div>
            <h2 className="text-3xl font-black text-slate-800 mb-2">Đầu tư đúng công cụ để phiên live chốt đơn mượt hơn</h2>
            <p className="text-sm text-slate-500 font-medium">Chọn một gói bên dưới. Bạn chỉ chuyển sang PayOS sau khi bấm nút thanh toán an toàn.</p>
          </div>
          
          <div className="bg-white p-1 rounded-xl border border-slate-200 flex shadow-sm flex-shrink-0">
            <button 
              onClick={() => setActiveTab('gia-han')}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'gia-han' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              Gia hạn AIDOL Live
            </button>
            <button 
              onClick={() => setActiveTab('nap-coin')}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'nap-coin' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              Nạp KOL Coin
            </button>
          </div>
        </div>

        {!isLoggedIn && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-full bg-red-100 text-red-500 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-4 h-4" />
            </div>
            <p className="text-sm text-red-700 font-medium">
              Đăng nhập để xem đúng gói và thanh toán cho tài khoản KOL LIVE của bạn.
            </p>
          </div>
        )}

        {/* Pricing Cards Placeholder based on tab */}
        {activeTab === 'gia-han' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
               <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">PHỔ BIẾN</div>
               <h3 className="text-lg font-black text-slate-800 mb-1">Gói Pro 1 Tháng</h3>
               <div className="text-3xl font-black text-blue-600 mb-4">499.000đ</div>
               <ul className="space-y-3 mb-6">
                 <li className="flex items-center gap-2 text-sm text-slate-600"><Check className="w-4 h-4 text-emerald-500" /> Không giới hạn thời gian Live</li>
                 <li className="flex items-center gap-2 text-sm text-slate-600"><Check className="w-4 h-4 text-emerald-500" /> Kịch bản AI Auto-reply</li>
                 <li className="flex items-center gap-2 text-sm text-slate-600"><Check className="w-4 h-4 text-emerald-500" /> Tặng kèm 100 KOL Coin</li>
               </ul>
               <button className="w-full py-3 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl font-bold transition-colors">Chọn gói này</button>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
               <h3 className="text-lg font-black text-slate-800 mb-1">Gói VIP 6 Tháng</h3>
               <div className="text-3xl font-black text-blue-600 mb-4">2.490.000đ</div>
               <ul className="space-y-3 mb-6">
                 <li className="flex items-center gap-2 text-sm text-slate-600"><Check className="w-4 h-4 text-emerald-500" /> Tất cả tính năng của gói Pro</li>
                 <li className="flex items-center gap-2 text-sm text-slate-600"><Check className="w-4 h-4 text-emerald-500" /> Nhân bản giọng nói miễn phí</li>
                 <li className="flex items-center gap-2 text-sm text-slate-600"><Check className="w-4 h-4 text-emerald-500" /> Hỗ trợ kỹ thuật 24/7</li>
               </ul>
               <button className="w-full py-3 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl font-bold transition-colors">Chọn gói này</button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[100, 500, 1000].map(amount => (
              <div key={amount} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center hover:border-blue-300 transition-colors cursor-pointer group">
                <Coins className="w-12 h-12 text-amber-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <div className="text-2xl font-black text-slate-800 mb-1">{amount} Coin</div>
                <div className="text-sm font-bold text-blue-600 mb-4">{amount * 10}.000đ</div>
                <button className="w-full py-2 bg-slate-100 text-slate-700 group-hover:bg-blue-600 group-hover:text-white rounded-lg font-bold transition-colors">Mua ngay</button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
