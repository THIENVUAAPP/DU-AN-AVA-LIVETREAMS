import React, { useState } from 'react';
import { Sparkles, Plus, Search, UserSquare2, PlayCircle, Mic, ChevronDown } from 'lucide-react';

export default function ThuVienAIDOL() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6">
      
      {/* Top Banner - Library Capacity */}
      <div className="bg-gradient-to-r from-blue-50/50 to-white border border-blue-100 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white border border-blue-100 shadow-sm flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-8 h-8 text-blue-500" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">AIDOL LIBRARY</span>
            </div>
            <h1 className="text-3xl font-black text-slate-800 mb-2 tracking-tight">AIDOL của tôi</h1>
            <p className="text-sm text-slate-500 font-medium max-w-xl">
              Thư viện nhân vật, giọng mặc định và chuyển động dùng lại cho mọi video, nhép môi và AIDOL Live.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-white border border-slate-200 rounded-xl px-5 py-3 shadow-sm text-center">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Dung lượng thư viện</div>
            <div className="text-2xl font-black text-slate-800 flex items-baseline justify-center gap-1">
              <span className="text-blue-600">—</span> / 5
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Tối đa 5 nhân vật đang lưu.</div>
          </div>
          <button className="flex items-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-md shadow-blue-600/20">
            <Plus className="w-5 h-5" /> Tạo AIDOL mới
          </button>
        </div>
      </div>

      {/* Stats Banner */}
      <div className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 border border-purple-100/50 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
         <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest">AIDOL NETWORK</span>
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">Nhân vật, chuyển động và Live <br/>luôn liên kết cùng một hệ thống.</h2>
            <p className="text-sm text-slate-500 font-medium">
              Di chuột vào thẻ để xem motion. Khi nhép môi, chọn đúng video DONE để giữ đúng góc máy và chuyển động.
            </p>
         </div>

         <div className="flex gap-4">
            <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm min-w-[120px]">
               <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Nhân vật</div>
               <div className="text-3xl font-black text-blue-600 mb-1">0</div>
               <div className="text-[10px] font-bold text-slate-500">đang lưu</div>
            </div>
            <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm min-w-[120px]">
               <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Sẵn sàng Live</div>
               <div className="text-3xl font-black text-blue-600 mb-1">0</div>
               <div className="text-[10px] font-bold text-slate-500">có video DONE</div>
            </div>
            <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm min-w-[120px]">
               <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Motion done</div>
               <div className="text-3xl font-black text-blue-600 mb-1">0</div>
               <div className="text-[10px] font-bold text-slate-500">nguồn nhép môi</div>
            </div>
         </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-[11px] font-bold text-slate-800 mb-1.5">Tìm kiếm</label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Tìm theo tên, vai trò, job..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all shadow-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-[11px] font-bold text-slate-800 mb-1.5">Trạng thái</label>
          <div className="relative">
            <select className="w-full appearance-none pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all shadow-sm font-bold">
              <option>Tất cả</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-2.5 text-slate-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="block text-[11px] font-bold text-slate-800 mb-1.5">Ngành hàng</label>
          <div className="relative">
            <select className="w-full appearance-none pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all shadow-sm font-bold">
              <option>Tất cả ngành hàng</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-2.5 text-slate-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="block text-[11px] font-bold text-slate-800 mb-1.5">Sắp xếp</label>
          <div className="relative">
            <select className="w-full appearance-none pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all shadow-sm font-bold">
              <option>Mới nhất</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-2.5 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Empty State */}
      <div className="py-24 flex flex-col items-center justify-center text-center">
        <h3 className="text-xl font-black text-slate-700 mb-3">Chưa có AIDOL nào</h3>
        <p className="text-sm text-slate-500 font-medium max-w-sm">
          Tạo một ảnh AIDOL trước, rồi lưu thành hồ sơ nhân vật để dùng lại cho video, giọng và lipsync.
        </p>
      </div>

    </div>
  );
}
