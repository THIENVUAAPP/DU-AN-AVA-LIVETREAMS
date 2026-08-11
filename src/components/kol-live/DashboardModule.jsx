import React from 'react';
import { LayoutDashboard, Users, DollarSign, ShoppingCart, TrendingUp, Activity, Box, Eye, MessageSquareText } from 'lucide-react';

export default function DashboardModule() {
  return (
    <div className="flex flex-col h-full bg-[#0B0B14] text-white">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-white/10 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Live Dashboard
            </h1>
            <p className="text-xs text-gray-400">Tổng quan hệ thống, doanh thu, lượt xem và hiệu suất chốt đơn</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 flex flex-col gap-6 custom-scrollbar">
        {/* Top Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl border border-white/10 bg-gradient-to-br from-blue-900/20 to-black relative overflow-hidden group hover:border-blue-500/50 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px]" />
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400"><DollarSign className="w-5 h-5" /></div>
              <span className="text-[10px] font-bold px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +15.2%</span>
            </div>
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1 relative z-10">Doanh thu Live</h3>
            <p className="text-3xl font-black text-white relative z-10">45,230,000đ</p>
          </div>

          <div className="p-5 rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-900/20 to-black relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px]" />
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400"><ShoppingCart className="w-5 h-5" /></div>
            </div>
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1 relative z-10">Đơn hàng (Hôm nay)</h3>
            <p className="text-3xl font-black text-white relative z-10">1,243</p>
          </div>

          <div className="p-5 rounded-2xl border border-white/10 bg-gradient-to-br from-purple-900/20 to-black relative overflow-hidden group hover:border-purple-500/50 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[50px]" />
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400"><Eye className="w-5 h-5" /></div>
              <span className="text-[10px] font-bold px-2 py-1 bg-red-500/20 text-red-400 rounded-full flex items-center gap-1 animate-pulse"><Activity className="w-3 h-3" /> LIVE</span>
            </div>
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1 relative z-10">Mắt xem hiện tại</h3>
            <p className="text-3xl font-black text-white relative z-10">15.2K</p>
          </div>

          <div className="p-5 rounded-2xl border border-white/10 bg-gradient-to-br from-pink-900/20 to-black relative overflow-hidden group hover:border-pink-500/50 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 blur-[50px]" />
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-2 rounded-lg bg-pink-500/20 text-pink-400"><MessageSquareText className="w-5 h-5" /></div>
            </div>
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1 relative z-10">Tương tác AI (Chat)</h3>
            <p className="text-3xl font-black text-white relative z-10">8,932</p>
          </div>
        </div>

        {/* Charts & Lists Area */}
        <div className="flex gap-6 flex-1">
          <div className="w-2/3 glass-panel p-5 rounded-2xl border border-white/10 bg-black/20 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold flex items-center gap-2"><TrendingUp className="w-4 h-4 text-blue-400" /> Biểu đồ Doanh thu (Mock)</h3>
              <select className="bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-blue-500">
                <option>Hôm nay</option>
                <option>7 ngày qua</option>
              </select>
            </div>
            <div className="flex-1 border border-white/5 rounded-xl bg-black/40 flex items-center justify-center relative overflow-hidden">
               {/* Decorative Fake Chart */}
               <div className="absolute bottom-0 w-full flex items-end justify-between px-4 opacity-50">
                 {[40, 70, 45, 90, 60, 110, 85, 120, 95, 140, 110, 160].map((h, i) => (
                    <div key={i} className="w-8 bg-gradient-to-t from-blue-600 to-indigo-400 rounded-t-sm" style={{ height: `${h}px` }} />
                 ))}
               </div>
               <span className="text-gray-500 font-bold z-10 bg-black/60 px-4 py-2 rounded-lg">Biểu đồ Đang Cập Nhật Dữ Liệu Thực...</span>
            </div>
          </div>

          <div className="w-1/3 glass-panel p-5 rounded-2xl border border-white/10 bg-black/20 flex flex-col">
            <h3 className="text-sm font-bold flex items-center gap-2 mb-6"><Box className="w-4 h-4 text-emerald-400" /> Top Sản Phẩm (Live)</h3>
            <div className="space-y-4 flex-1 overflow-auto custom-scrollbar pr-2">
              {[
                { name: 'Combo Dưỡng Da Collagen', sales: 450, rev: '12,500,000đ' },
                { name: 'Nước hoa Hồng Pháp', sales: 320, rev: '8,200,000đ' },
                { name: 'Set Trang Điểm Cơ Bản', sales: 210, rev: '5,100,000đ' },
                { name: 'Son Dưỡng Ẩm Môi', sales: 185, rev: '2,400,000đ' },
                { name: 'Kem Chống Nắng', sales: 150, rev: '1,800,000đ' },
              ].map((p, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-black/40 border border-white/5 rounded-xl">
                   <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 flex items-center justify-center font-bold text-gray-400">
                     #{i + 1}
                   </div>
                   <div className="flex-1">
                     <h4 className="text-xs font-bold line-clamp-1">{p.name}</h4>
                     <p className="text-[10px] text-gray-500">{p.sales} đã bán</p>
                   </div>
                   <div className="text-right">
                     <span className="text-xs font-bold text-emerald-400">{p.rev}</span>
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
