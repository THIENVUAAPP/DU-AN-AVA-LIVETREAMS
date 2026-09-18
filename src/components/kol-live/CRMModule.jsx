import React, { useState } from 'react';
import { Users, Search, Filter, Star, MessageCircle, MoreVertical, Send, UserCheck, Activity, Award } from 'lucide-react';

const MOCK_CUSTOMERS = [
  { id: 'C01', name: 'Nguyễn Thị Hương', phone: '0987***123', totalSpent: '12,500,000đ', orders: 15, rank: 'VIP', platform: 'TikTok' },
  { id: 'C02', name: 'Trần Văn Mạnh', phone: '0912***456', totalSpent: '4,200,000đ', orders: 3, rank: 'Member', platform: 'Facebook' },
  { id: 'C03', name: 'Lê Hoa', phone: '0903***789', totalSpent: '850,000đ', orders: 1, rank: 'New', platform: 'TikTok' },
  { id: 'C04', name: 'Hoàng Long', phone: '0933***111', totalSpent: '35,000,000đ', orders: 42, rank: 'VVIP', platform: 'YouTube' },
];

export default function CRMModule() {
  const [activeTab, setActiveTab] = useState('customers');

  return (
    <div className="flex flex-col h-full bg-[#0B0B14] text-white">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-white/10 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-500 to-pink-600 flex items-center justify-center shadow-lg shadow-fuchsia-500/20">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              CRM & Chatbot Hub
            </h1>
            <p className="text-xs text-gray-400">Quản lý Khách hàng, Hạng thành viên, Remarketing & Hộp thư tự động</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 flex gap-6 custom-scrollbar">
        {/* Left: Customer Data */}
        <div className="w-2/3 glass-panel p-5 rounded-2xl border border-white/10 bg-black/40 flex flex-col">
           <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold">Dữ liệu Khách hàng</h2>
              <span className="px-2 py-0.5 rounded bg-fuchsia-500/20 text-fuchsia-400 text-xs font-bold">12,453 Khách</span>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-500" />
                <input type="text" placeholder="Tìm tên, SĐT..." className="pl-9 pr-4 py-2 bg-black/60 border border-white/10 rounded-lg text-xs outline-none focus:border-fuchsia-500 text-white" />
              </div>
              <button className="p-2 rounded-lg bg-black/60 border border-white/10 hover:bg-white/10">
                <Filter className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto custom-scrollbar">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="text-gray-500 border-b border-white/10 uppercase text-[10px] tracking-wider">
                  <th className="pb-3 px-2">Khách hàng</th>
                  <th className="pb-3 px-2">Liên hệ</th>
                  <th className="pb-3 px-2">Nền tảng</th>
                  <th className="pb-3 px-2">Đã chi tiêu</th>
                  <th className="pb-3 px-2">Số đơn</th>
                  <th className="pb-3 px-2">Hạng (Rank)</th>
                  <th className="pb-3 px-2 text-right">Tương tác</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_CUSTOMERS.map((cus) => (
                  <tr key={cus.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                    <td className="py-3 px-2 font-bold text-gray-200">{cus.name}</td>
                    <td className="py-3 px-2 text-gray-400 text-xs">{cus.phone}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-1 rounded text-[10px] ${
                        cus.platform === 'TikTok' ? 'bg-black text-white border border-gray-600' :
                        cus.platform === 'Facebook' ? 'bg-blue-600/20 text-blue-400' : 'bg-red-600/20 text-red-400'
                      }`}>{cus.platform}</span>
                    </td>
                    <td className="py-3 px-2 text-emerald-400 font-bold">{cus.totalSpent}</td>
                    <td className="py-3 px-2 text-gray-300">{cus.orders} đơn</td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-1 flex w-fit items-center gap-1 rounded text-[10px] font-bold ${
                        cus.rank === 'VVIP' ? 'bg-fuchsia-500/20 text-fuchsia-400' : 
                        cus.rank === 'VIP' ? 'bg-yellow-500/20 text-yellow-400' : 
                        'bg-gray-700/50 text-gray-300'
                      }`}>
                         {cus.rank === 'VVIP' || cus.rank === 'VIP' ? <Crown className="w-3 h-3" /> : ''}
                         {cus.rank}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <button className="p-1.5 text-blue-400 hover:text-white transition-colors bg-blue-500/10 rounded mr-2"><MessageCircle className="w-4 h-4" /></button>
                      <button className="p-1.5 text-gray-500 hover:text-white transition-colors"><MoreVertical className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Broadcast & Automation */}
        <div className="w-1/3 flex flex-col gap-4">
           {/* Quick Broadcast */}
           <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-black/20">
             <h3 className="font-bold text-sm mb-4 flex items-center gap-2"><Send className="w-4 h-4 text-fuchsia-400" /> Gửi Tin Nhắn Hàng Loạt (Broadcast)</h3>
             <div className="space-y-3">
               <div>
                 <label className="text-xs text-gray-400 block mb-1">Đối tượng nhận (Segment)</label>
                 <select className="w-full p-2 bg-black/60 border border-white/10 rounded-lg outline-none focus:border-fuchsia-500 text-sm">
                   <option>Tất cả Khách VIP & VVIP</option>
                   <option>Khách hàng mới (30 ngày)</option>
                   <option>Khách mua Combo Skincare</option>
                 </select>
               </div>
               <div>
                 <label className="text-xs text-gray-400 block mb-1">Nội dung tin nhắn (Hỗ trợ Cá nhân hóa)</label>
                 <textarea className="w-full h-24 p-2 bg-black/60 border border-white/10 rounded-lg outline-none focus:border-fuchsia-500 text-sm resize-none" defaultValue="Chào [Tên_KH], tối nay lúc 20:00 shop có Livestream thanh lý kho sale 50% dành riêng cho Khách VIP. Nhớ vào xem nhé!" />
               </div>
               <button className="w-full py-2 bg-fuchsia-600 hover:bg-fuchsia-500 rounded-lg text-sm font-bold shadow-[0_0_15px_rgba(192,38,211,0.3)] transition-colors">
                 Gửi Tin Nhắn (Dự kiến: 1,200 người)
               </button>
             </div>
           </div>

           {/* Workflow Status */}
           <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-black/20 flex-1">
             <h3 className="font-bold text-sm mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-emerald-400" /> Luồng Follow-up Đang Chạy</h3>
             <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
                  <div>
                    <div className="text-xs font-bold text-gray-200">Nhắc giỏ hàng bị bỏ quên (Sau 2h)</div>
                    <div className="text-[10px] text-emerald-400 flex items-center gap-1"><UserCheck className="w-3 h-3" /> Đã khôi phục 145 đơn</div>
                  </div>
                  <div className="w-8 h-4 rounded-full relative cursor-pointer bg-emerald-500">
                    <div className="absolute top-0.5 w-3 h-3 rounded-full bg-white left-4.5 right-0.5" style={{ left: '18px' }} />
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
                  <div>
                    <div className="text-xs font-bold text-gray-200">Xin đánh giá sau khi nhận hàng</div>
                    <div className="text-[10px] text-emerald-400 flex items-center gap-1"><Star className="w-3 h-3" /> Tỷ lệ phản hồi: 68%</div>
                  </div>
                  <div className="w-8 h-4 rounded-full relative cursor-pointer bg-emerald-500">
                    <div className="absolute top-0.5 w-3 h-3 rounded-full bg-white left-4.5 right-0.5" style={{ left: '18px' }} />
                  </div>
                </div>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
}
// Placeholder SVG Crown for inline use
const Crown = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/>
  </svg>
);
