import React, { useState } from 'react';
import { MessageSquareText, ShieldAlert, Zap, Filter, ThumbsUp, Heart, Bot, Pin } from 'lucide-react';

const MOCK_COMMENTS = [
  { id: 1, user: 'Hoài An', text: 'Cho mình 1 combo B5 nhé', intent: 'CHỐT ĐƠN', sentiment: 'positive', time: 'Vừa xong' },
  { id: 2, user: 'Tuấn Trần', text: 'Giá sao shop ơi?', intent: 'HỎI GIÁ', sentiment: 'neutral', time: '1 phút trước' },
  { id: 3, user: 'Linh Nguyễn', text: 'Hàng fake à mng =)))', intent: 'TIÊU CỰC', sentiment: 'negative', time: '2 phút trước' },
  { id: 4, user: 'Bé Na', text: 'Cho em hỏi da mụn dùng dc k ạ?', intent: 'TƯ VẤN', sentiment: 'neutral', time: '3 phút trước' },
  { id: 5, user: 'Vy Vy', text: 'chốt mã 01', intent: 'CHỐT ĐƠN', sentiment: 'positive', time: '3 phút trước' },
];

export default function CommentsModule() {
  const [autoReply, setAutoReply] = useState(true);

  return (
    <div className="flex flex-col h-full bg-[#0B0B14] text-white">
      <div className="flex-shrink-0 p-6 border-b border-white/10 bg-black/40 backdrop-blur-md flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <MessageSquareText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              AI Comment Engine
            </h1>
            <p className="text-xs text-gray-400">Đọc, Phân loại cảm xúc, Lọc Spam & Tự động trả lời chốt đơn</p>
          </div>
        </div>
        <button 
          onClick={() => setAutoReply(!autoReply)}
          className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 text-sm transition-all ${
            autoReply ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          <Bot className="w-4 h-4" />
          {autoReply ? 'AUTO REPLY: ON' : 'AUTO REPLY: OFF'}
        </button>
      </div>

      <div className="flex-1 overflow-auto p-6 flex gap-6 custom-scrollbar">
        {/* Realtime Stream */}
        <div className="w-2/3 glass-panel p-5 rounded-2xl border border-white/10 bg-black/40 flex flex-col">
          <div className="flex justify-between items-center mb-4">
             <h2 className="text-lg font-bold flex items-center gap-2"><Zap className="w-5 h-5 text-indigo-400" /> Luồng Bình Luận Realtime</h2>
             <div className="flex gap-2">
                <select className="bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-indigo-500">
                  <option>Tất cả bình luận</option>
                  <option>Chỉ hiện CHỐT ĐƠN</option>
                  <option>Cần tư vấn</option>
                </select>
             </div>
          </div>

          <div className="flex-1 overflow-auto space-y-3 custom-scrollbar pr-2">
             {MOCK_COMMENTS.map(c => (
                <div key={c.id} className="p-4 bg-black/60 border border-white/5 rounded-xl hover:border-indigo-500/30 transition-colors group">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-bold text-sm text-gray-200">{c.user} <span className="text-[10px] font-normal text-gray-500 ml-2">{c.time}</span></div>
                    <div className="flex gap-2">
                       <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                         c.intent === 'CHỐT ĐƠN' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                         c.intent === 'TIÊU CỰC' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                         'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                       }`}>
                         {c.intent}
                       </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-300 mb-3">{c.text}</div>
                  <div className="flex items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                    <button className="text-[10px] px-2 py-1 bg-white/10 hover:bg-indigo-500 hover:text-white rounded flex items-center gap-1 transition-colors"><ThumbsUp className="w-3 h-3" /> Like</button>
                    <button className="text-[10px] px-2 py-1 bg-white/10 hover:bg-indigo-500 hover:text-white rounded flex items-center gap-1 transition-colors"><MessageSquareText className="w-3 h-3" /> Reply</button>
                    <button className="text-[10px] px-2 py-1 bg-white/10 hover:bg-orange-500 hover:text-white rounded flex items-center gap-1 transition-colors"><Pin className="w-3 h-3" /> Pin</button>
                    {c.intent === 'TIÊU CỰC' && <button className="text-[10px] px-2 py-1 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded flex items-center gap-1 transition-colors"><ShieldAlert className="w-3 h-3" /> Ban/Hide</button>}
                  </div>
                </div>
             ))}
          </div>
        </div>

        {/* AI Filters & Configs */}
        <div className="w-1/3 flex flex-col gap-4">
           {/* Auto Reply Config */}
           <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-black/20">
             <h3 className="font-bold text-sm mb-4 flex items-center gap-2"><Bot className="w-4 h-4 text-indigo-400" /> Kịch Bản Auto Reply (AI)</h3>
             <div className="space-y-3">
               <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                 <div className="text-xs font-bold text-emerald-400 mb-1">Khi phát hiện: CHỐT ĐƠN</div>
                 <div className="text-xs text-gray-400">AI tự động rep: "Dạ shop đã nhận đơn của bạn [Tên_KH], check inbox để shop hướng dẫn nhé!"</div>
               </div>
               <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                 <div className="text-xs font-bold text-blue-400 mb-1">Khi phát hiện: HỎI GIÁ</div>
                 <div className="text-xs text-gray-400">AI tự động rep: "Dạ sản phẩm đang được Flash Sale giá [Giá_Ghim], [Tên_KH] nhanh tay bấm vào giỏ hàng nhé!"</div>
               </div>
               <button className="w-full py-2 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-400 rounded-lg text-xs font-bold transition-colors">
                 + Thêm Kịch Bản Mới
               </button>
             </div>
           </div>

           {/* Moderation */}
           <div className="glass-panel p-5 rounded-2xl border border-red-500/20 bg-red-500/5 flex-1">
             <h3 className="font-bold text-sm mb-4 flex items-center gap-2 text-red-400"><ShieldAlert className="w-4 h-4" /> Bức Tường Lọc (Moderator)</h3>
             <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-xs">Tự động Ẩn comment chứa từ thô tục</span>
                  <div className="w-8 h-4 rounded-full relative cursor-pointer bg-red-500">
                    <div className="absolute top-0.5 w-3 h-3 rounded-full bg-white left-4.5 right-0.5" style={{ left: '18px' }} />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-xs">Tự động Ẩn comment nhắc tới đối thủ</span>
                  <div className="w-8 h-4 rounded-full relative cursor-pointer bg-red-500">
                    <div className="absolute top-0.5 w-3 h-3 rounded-full bg-white left-4.5 right-0.5" style={{ left: '18px' }} />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="text-[10px] font-bold text-gray-500 block mb-1">Danh sách từ khóa bị cấm (Blacklist)</label>
                  <textarea className="w-full h-16 bg-black/60 border border-white/10 rounded-lg p-2 text-xs outline-none focus:border-red-500 text-gray-300" defaultValue="đắt, fake, lừa đảo, shop khác, kém chất lượng..." />
                </div>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
}
