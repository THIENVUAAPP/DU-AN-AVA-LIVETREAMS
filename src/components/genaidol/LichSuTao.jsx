import React, { useState } from 'react';
import { RefreshCw, Clock, Image as ImageIcon, Video, Mic, Trash2, CheckCircle, Loader2, UserSquare2 } from 'lucide-react';

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
      <div className="bg-[#121216]/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/10 p-16 text-center max-w-4xl mx-auto mt-8">
        <div className="w-12 h-12 rounded-full bg-[#00FF66]/10 flex items-center justify-center mx-auto mb-4 border border-[#00FF66]/30 shadow-glow-green">
          <Clock className="w-5 h-5 text-[#00FF66]" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Đăng nhập để xem Lịch sử job</h2>
        <p className="text-sm text-gray-400 mb-8 max-w-md mx-auto">
          Bảng này chỉ hiển thị ảnh, video, audio và tiến độ thuộc đúng tài khoản AIDOL của bạn.
        </p>
        <button className="px-6 py-2.5 bg-[#00FF66] hover:bg-[#00CC52] text-black font-bold rounded-lg transition-colors text-sm shadow-glow-green">
          Đăng nhập tài khoản KOL LIVE
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto text-white">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <span className="inline-block px-3 py-1 bg-[#00FF66]/20 text-[#00FF66] rounded-full text-xs font-bold mb-4 border border-[#00FF66]/40 shadow-glow-green">
            JOB HISTORY
          </span>
          <h1 className="text-4xl font-black text-white mb-3 tracking-tight">Lịch sử tạo</h1>
          <p className="text-gray-400 text-sm mb-1">
            Một bảng theo dõi duy nhất cho ảnh, video, giọng và nhép môi. Job chạy nền và tự cập nhật tại đây.
          </p>
          <p className="text-gray-300 text-sm font-bold">
            Đang tạo trong nhóm "Im lặng / không nói". Chọn video có sẵn hoặc AI I2V ở bên dưới.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-white/10 hover:border-[#00FF66] hover:text-[#00FF66] rounded-lg text-sm font-bold text-gray-300 transition-colors bg-white/5 shadow-sm">
          <RefreshCw className="w-4 h-4" /> Làm mới
        </button>
      </div>

      <div className="bg-[#121216]/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/10 overflow-hidden">
        {/* Toggle Admin View For Demo Purposes */}
        <div className="bg-black/40 p-3 border-b border-white/10 flex justify-end">
           <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer hover:text-white transition-colors">
              <input type="checkbox" checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} className="rounded text-[#00FF66] accent-[#00FF66]" />
              Chế độ Admin (Quyền xóa)
           </label>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-black/60 border-b border-white/10 text-gray-400 text-xs uppercase tracking-wider font-bold">
                <th className="p-4 pl-6">ID / Loại</th>
                <th className="p-4">Tên tác vụ (Job Name)</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4">Thời gian / Kết quả</th>
                <th className="p-4 pr-6 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_JOBS.map((job) => (
                <tr key={job.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                        job.type === 'image' ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' :
                        job.type === 'video' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' :
                        job.type === 'voice' ? 'bg-pink-500/10 text-pink-400 border-pink-500/30' :
                        'bg-[#00FF66]/10 text-[#00FF66] border-[#00FF66]/30 shadow-glow-green'
                      }`}>
                        {job.type === 'image' && <ImageIcon className="w-4 h-4" />}
                        {job.type === 'video' && <Video className="w-4 h-4" />}
                        {job.type === 'voice' && <Mic className="w-4 h-4" />}
                        {job.type === 'lipsync' && <UserSquare2 className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="font-bold text-gray-300 text-xs">{job.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm font-bold text-gray-100 group-hover:text-[#00FF66] transition-colors">{job.name}</td>
                  <td className="p-4">
                    {job.status === 'completed' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00FF66]/10 text-[#00FF66] text-[11px] font-bold border border-[#00FF66]/30 shadow-glow-green"><CheckCircle className="w-3 h-3" /> Hoàn thành</span>}
                    {job.status === 'processing' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[11px] font-bold border border-blue-500/30"><Loader2 className="w-3 h-3 animate-spin" /> Đang xử lý</span>}
                    {job.status === 'failed' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 text-[11px] font-bold border border-red-500/30">Thất bại</span>}
                  </td>
                  <td className="p-4">
                    <div className="text-xs text-gray-500">{job.time}</div>
                    <div className={`text-xs font-bold mt-1 ${job.status === 'completed' ? 'text-[#00FF66] cursor-pointer hover:underline' : 'text-gray-600'}`}>
                      {job.result}
                    </div>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex justify-end gap-2">
                      {job.status === 'completed' && (
                        <button className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded text-xs font-bold transition-colors">
                          Tải xuống
                        </button>
                      )}
                      {isAdmin ? (
                        <button className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors" title="Xóa (Chỉ Admin)">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <button className="p-1.5 text-gray-700 cursor-not-allowed rounded" title="Bạn không có quyền xóa dữ liệu">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {MOCK_JOBS.length === 0 && (
          <div className="p-8 text-center text-gray-500 text-sm">Chưa có job nào trong lịch sử.</div>
        )}
      </div>
    </div>
  );
}
