import React, { useRef, useState } from 'react';
import { Video, Loader2, UploadCloud } from 'lucide-react';
import { captureMotionFromVideo } from '../../lib/dance3d/motionCapture';

// Tải video nhảy mẫu → trích chuyển động thật bằng AI Pose (chạy ngay trên trình duyệt, KHÔNG upload
// server nào) → lưu thành 1 điệu nhảy mới để nhân vật 3D "sao chép" theo khi phát trên Sàn 3D.
export default function DanceFloorMotionCaptureUploader({ onCaptured }) {
  const inputRef = useRef(null);
  const [status, setStatus] = useState('idle'); // idle | processing | done | error
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus('processing');
    setProgress(0);
    setErrorMessage('');
    try {
      const { frames, durationSeconds } = await captureMotionFromVideo(file, setProgress);
      onCaptured({
        id: `mocap_${Date.now()}`,
        name: `Sao Chép: ${file.name.replace(/\.[^.]+$/, '').slice(0, 24)}`,
        type: 'mocap',
        frames,
        durationSeconds,
        isSessionOnly: true,
      });
      setStatus('done');
    } catch (err) {
      console.error('captureMotionFromVideo lỗi:', err);
      setErrorMessage(err.message || 'Trích chuyển động thất bại.');
      setStatus('error');
    } finally {
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="glass-panel p-3 rounded-2xl border border-dashed border-white/20 mt-3">
      <div className="flex items-center gap-2 mb-2">
        <Video className="w-4 h-4 text-fuchsia-400" />
        <p className="text-xs font-black text-white">Tải Video Nhảy Mẫu — Nhân Vật Sao Chép Chuyển Động</p>
      </div>
      <p className="text-[9px] text-gray-500 mb-2">
        AI phân tích dáng người trong video (tối đa 12 giây đầu) để nhân vật 3D nhảy theo gần giống động
        tác gốc. Xử lý ngay trên trình duyệt, không gửi video lên server nào. Vì chỉ đọc được từ 1 góc
        camera phẳng (không có chiều sâu thật) nên chuyển động là ước lượng gần giống, không tuyệt đối
        khớp 100% video gốc.
      </p>
      <label className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-fuchsia-500/20 border border-fuchsia-500/40 text-fuchsia-300 text-xs font-black cursor-pointer hover:bg-fuchsia-500/30">
        {status === 'processing' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UploadCloud className="w-3.5 h-3.5" />}
        {status === 'processing' ? `Đang phân tích... ${progress}%` : 'Chọn Video Nhảy Mẫu'}
        <input ref={inputRef} type="file" accept="video/*" onChange={handleFile} disabled={status === 'processing'} className="hidden" />
      </label>
      {status === 'done' && (
        <p className="text-[10px] text-emerald-400 font-bold mt-2">✓ Đã lưu điệu nhảy mới — chọn trong Tổ Hợp Thủ Công hoặc gán vào luật từ khoá.</p>
      )}
      {status === 'error' && <p className="text-[10px] text-red-400 font-bold mt-2">{errorMessage}</p>}
    </div>
  );
}
