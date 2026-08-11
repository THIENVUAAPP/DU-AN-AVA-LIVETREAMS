import React, { useState } from 'react';
import { RefreshCw, Clock, Image as ImageIcon, Video, Mic, Trash2, CheckCircle, Loader2 } from 'lucide-react';

const MOCK_JOBS = [
  { id: 'JOB-902', type: 'image', name: 'Tạo ảnh AIDOL Nữ Doanh Nhân', status: 'completed', time: '10 phút trước', result: 'aidol_avatar_01.png' },
  { id: 'JOB-901', type: 'video', name: 'Render Video Khai Trương', status: 'processing', time: 'Đang xử lý (45%)', result: '-' },
  { id: 'JOB-900', type: 'voice', name: 'Voice Clone - Kịch bản 1', status: 'completed', time: '1 giờ trước', result: 'voice_clone_01.wav' },
  { id: 'JOB-899', type: 'lipsync', name: 'Nhép môi - Lời chào', status: 'failed', time: '2 giờ trước', result: 'Lỗi đồng bộ' },
];

export default function LichSuTao() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false); // Toggle this to test delete button

  if (!isLoggedIn) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-16 text-center max-w-4xl mx-auto mt-8">
        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4 border border-blue-100">
          <Clock className="w-5 h-5 text-blue-500" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Đăng nhập để xem Lịch sử job</h2>
        <p className="text-sm text-slate-500 mb-8 max-w-md mx-auto">
          Bảng này chỉ hiển thị ảnh, video, audio và tiến độ thuộc đúng tài khoản AIDOL của bạn.
        </p>
        <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors text-sm">
          Đăng nhập tài khoản KOL LIVE
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold mb-4 border border-blue-100">
            JOB HISTORY
          </span>
          <h1 className="text-4xl font-black text-slate-800 mb-3 tracking-tight">Lịch sử tạo</h1>
          <p className="text-slate-500 text-sm mb-1">
            Một bảng theo dõi duy nhất cho ảnh, video, giọng và nhép môi. Job chạy nền và tự cập nhật tại đây.
          </p>
          <p className="text-slate-600 text-sm font-bold">
            Đang tạo trong nhóm "Im lặng / không nói". Chọn video có sẵn hoặc AI I2V ở bên dưới.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 hover:border-blue-500 hover:text-blue-600 rounded-lg text-sm font-bold text-slate-700 transition-colors bg-white shadow-sm">
          <RefreshCw className="w-4 h-4" /> Làm mới
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-slate-200 overflow-hidden">
        {/* Toggle Admin View For Demo Purposes */}
        <div className="bg-slate-50 p-2 border-b border-slate-100 flex justify-end">
           <label className="flex items-center gap-2 text-xs text-slate-500 cursor-pointer">
              <input type="checkbox" checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} className="rounded text-blue-500" />
              Chế độ Admin (Quyền xóa)
           </label>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-bold">
              <th className="p-4 pl-6">ID / Loại</th>
              <th className="p-4">Tên tác vụ (Job Name)</th>
              <th className="p-4">Trạng thái</th>
              <th className="p-4">Thời gian / Kết quả</th>
              <th className="p-4 pr-6 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_JOBS.map((job) => (
              <tr key={job.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors group">
                <td className="p-4 pl-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      job.type === 'image' ? 'bg-orange-50 text-orange-500' :
                      job.type === 'video' ? 'bg-cyan-50 text-cyan-500' :
                      job.type === 'voice' ? 'bg-pink-50 text-pink-500' :
                      'bg-emerald-50 text-emerald-500'
                    }`}>
                      {job.type === 'image' && <ImageIcon className="w-4 h-4" />}
                      {job.type === 'video' && <Video className="w-4 h-4" />}
                      {job.type === 'voice' && <Mic className="w-4 h-4" />}
                      {job.type === 'lipsync' && <UserSquare2 className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="font-bold text-slate-700 text-xs">{job.id}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-sm font-bold text-slate-800">{job.name}</td>
                <td className="p-4">
                  {job.status === 'completed' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-bold border border-emerald-100"><CheckCircle className="w-3 h-3" /> Hoàn thành</span>}
                  {job.status === 'processing' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-[11px] font-bold border border-blue-100"><Loader2 className="w-3 h-3 animate-spin" /> Đang xử lý</span>}
                  {job.status === 'failed' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-600 text-[11px] font-bold border border-red-100">Thất bại</span>}
                </td>
                <td className="p-4">
                  <div className="text-xs text-slate-500">{job.time}</div>
                  <div className={`text-xs font-bold mt-1 ${job.status === 'completed' ? 'text-blue-600 cursor-pointer hover:underline' : 'text-slate-400'}`}>
                    {job.result}
                  </div>
                </td>
                <td className="p-4 pr-6 text-right">
                  <div className="flex justify-end gap-2">
                    {job.status === 'completed' && (
                      <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-xs font-bold transition-colors">
                        Tải xuống
                      </button>
                    )}
                    {isAdmin ? (
                      <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors" title="Xóa (Chỉ Admin)">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    ) : (
                      <button className="p-1.5 text-slate-200 cursor-not-allowed rounded" title="Bạn không có quyền xóa dữ liệu">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {MOCK_JOBS.length === 0 && (
          <div className="p-8 text-center text-slate-500 text-sm">Chưa có job nào trong lịch sử.</div>
        )}
      </div>
    </div>
  );
}
