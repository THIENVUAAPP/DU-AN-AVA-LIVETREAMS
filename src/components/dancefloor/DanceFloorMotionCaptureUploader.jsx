import React, { useRef, useState } from 'react';
import { Video, Loader2, UploadCloud, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { captureMotionFromVideo } from '../../lib/dance3d/motionCapture';

// Tải video nhảy mẫu (chọn được NHIỀU video cùng lúc) → trích chuyển động thật bằng AI Pose (chạy ngay
// trên trình duyệt, KHÔNG upload server nào) → mỗi video lưu thành 1 điệu nhảy mới để nhân vật 3D
// "sao chép" theo khi phát trên Sàn 3D. Xử lý tuần tự từng video (mỗi video tốn vài giây phân tích AI).
export default function DanceFloorMotionCaptureUploader({ onCaptured }) {
  const inputRef = useRef(null);
  const [queue, setQueue] = useState([]); // [{id, name, status, progress}]
  const [processing, setProcessing] = useState(false);

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const items = files.map((file) => ({
      id: `mocapq_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name: file.name,
      status: 'pending',
      progress: 0,
      file,
    }));
    setQueue(items);
    setProcessing(true);

    for (const item of items) {
      setQueue((prev) => prev.map((q) => (q.id === item.id ? { ...q, status: 'processing' } : q)));
      try {
        // eslint-disable-next-line no-await-in-loop
        const { frames, durationSeconds } = await captureMotionFromVideo(item.file, (pct) => {
          setQueue((prev) => prev.map((q) => (q.id === item.id ? { ...q, progress: pct } : q)));
        });
        onCaptured({
          id: `mocap_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          name: `Sao Chép: ${item.name.replace(/\.[^.]+$/, '').slice(0, 24)}`,
          type: 'mocap',
          frames,
          durationSeconds,
          isSessionOnly: true,
        });
        setQueue((prev) => prev.map((q) => (q.id === item.id ? { ...q, status: 'done' } : q)));
      } catch (err) {
        console.error(`captureMotionFromVideo("${item.name}") lỗi:`, err);
        setQueue((prev) => prev.map((q) => (q.id === item.id ? { ...q, status: 'error' } : q)));
      }
    }
    setProcessing(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  const doneCount = queue.filter((q) => q.status === 'done').length;

  return (
    <div className="glass-panel p-3 rounded-2xl border border-dashed border-white/20 mt-3">
      <div className="flex items-center gap-2 mb-2">
        <Video className="w-4 h-4 text-fuchsia-400" />
        <p className="text-xs font-black text-white">Tải Video Nhảy Mẫu — Nhân Vật Sao Chép Chuyển Động</p>
      </div>
      <p className="text-[9px] text-gray-500 mb-2">
        AI phân tích dáng người trong từng video (tối đa 12 giây đầu mỗi video) để nhân vật 3D nhảy theo
        gần giống động tác gốc. Chọn được nhiều video cùng lúc, xử lý lần lượt. Xử lý ngay trên trình
        duyệt, không gửi video lên server nào. Vì chỉ đọc được từ 1 góc camera phẳng (không có chiều sâu
        thật) nên chuyển động là ước lượng gần giống, không tuyệt đối khớp 100% video gốc.
      </p>
      <label className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-fuchsia-500/20 border border-fuchsia-500/40 text-fuchsia-300 text-xs font-black cursor-pointer hover:bg-fuchsia-500/30">
        {processing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UploadCloud className="w-3.5 h-3.5" />}
        {processing ? `Đang phân tích ${doneCount}/${queue.length}...` : 'Chọn Video Nhảy Mẫu (chọn nhiều được)'}
        <input ref={inputRef} type="file" accept="video/*" multiple onChange={handleFiles} disabled={processing} className="hidden" />
      </label>

      {queue.length > 0 && (
        <div className="mt-2 space-y-1 max-h-40 overflow-y-auto">
          {queue.map((q) => (
            <div key={q.id} className="flex items-center justify-between gap-2 px-2 py-1 rounded-lg bg-black/30 text-[10px] text-gray-300">
              <span className="truncate flex-1">{q.name}</span>
              {q.status === 'pending' && <Clock className="w-3.5 h-3.5 text-gray-500 shrink-0" />}
              {q.status === 'processing' && <span className="text-fuchsia-300 font-bold shrink-0">{q.progress}%</span>}
              {q.status === 'done' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
              {q.status === 'error' && <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />}
            </div>
          ))}
        </div>
      )}
      {!processing && doneCount > 0 && (
        <p className="text-[10px] text-emerald-400 font-bold mt-2">✓ Đã lưu {doneCount} điệu nhảy mới — chọn trong Tổ Hợp Thủ Công hoặc gán vào luật từ khoá.</p>
      )}
    </div>
  );
}
