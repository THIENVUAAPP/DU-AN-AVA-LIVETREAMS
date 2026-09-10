import React, { useState, useRef, useEffect } from 'react';
import { Video, FolderOpen, Sparkles, X, ChevronDown, Play, Eye, CheckCircle2, Film } from 'lucide-react';
const toast = {
  success: (message) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('avalive_toast', { detail: { type: 'success', message } }));
    }
  },
  error: (message) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('avalive_toast', { detail: { type: 'error', message } }));
    }
  }
};

// 5 Video Mẫu Idol AI Dựng Sẵn Chuẩn 9:16
export const SAMPLE_IDOL_VIDEOS = [
  { 
    id: 'sample_idle', 
    name: '🎬 Idol Đứng Chờ (Idle Loop 60fps)', 
    desc: 'Nhân vật đứng thở nhẹ, mỉm cười tự nhiên khi chưa có thoại', 
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 
    folder: 'video_mau_idol_idle',
    badge: 'Idle Loop'
  },
  { 
    id: 'sample_talking', 
    name: '🎬 Idol Đang Nói & Bán Hàng (Talk 60fps)', 
    desc: 'Khớp khẩu hình miệng 60 FPS khi đọc kịch bản hoặc trả lời khách', 
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', 
    folder: 'video_mau_idol_talking',
    badge: 'Talking 60fps'
  },
  { 
    id: 'sample_thanks', 
    name: '🎬 Idol Cảm Ơn Quà / Follow (Thanking)', 
    desc: 'Cử chỉ vỗ tay, thả tim, cúi chào tri ân người xem', 
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', 
    folder: 'video_mau_idol_thanks',
    badge: 'Thanking'
  },
  { 
    id: 'sample_selling', 
    name: '🎬 Idol Chốt Đơn & Flash Sale (Selling Deal)', 
    desc: 'Chỉ tay vào giỏ hàng góc trái, đếm ngược deal nóng', 
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4', 
    folder: 'video_mau_idol_selling',
    badge: 'Flash Deal'
  },
  { 
    id: 'sample_bg', 
    name: '🎬 Video Nền Studio 4K Sang Trọng', 
    desc: 'Phông nền livestream chuẩn phòng thu thương mại', 
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', 
    folder: 'video_mau_studio_bg',
    badge: 'Studio 4K'
  }
];

export default function UniversalMediaPicker({
  label = 'Thư mục / File Video',
  subLabel = '',
  currentPath = '',
  videoUrl = '',
  defaultText = 'Chưa chọn video / thư mục',
  onSelectFile,
  onSelectFolder,
  onSelectSample,
  onClear,
  inputId,
  badgeText = '',
  className = '',
  accept = 'video/*,image/*,video/mp4,video/webm,video/quicktime,image/png,image/jpeg,image/webp,image/gif'
}) {
  const [showSamples, setShowSamples] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [localPreviewUrl, setLocalPreviewUrl] = useState(videoUrl || '');
  const fileInputRef = useRef(null);
  const previewVideoRef = useRef(null);
  const uniqueInputId = inputId || `universal-media-${Math.random().toString(36).substr(2, 9)}`;

  // Đồng bộ preview URL khi prop videoUrl hoặc currentPath thay đổi
  useEffect(() => {
    if (videoUrl) {
      setLocalPreviewUrl(videoUrl);
    } else if (currentPath && (currentPath.startsWith('http') || currentPath.startsWith('blob:') || currentPath.startsWith('data:'))) {
      setLocalPreviewUrl(currentPath);
    }
  }, [videoUrl, currentPath]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setLocalPreviewUrl(objectUrl);

    if (onSelectFile) {
      onSelectFile(file, objectUrl);
    }
    toast.success(`Đã tải lên video: ${file.name}`);
    e.target.value = '';
  };

  const handleFolderPick = async () => {
    try {
      if (window.showDirectoryPicker) {
        const dirHandle = await window.showDirectoryPicker();
        if (onSelectFolder) {
          onSelectFolder(dirHandle.name);
        }
        toast.success(`Đã chọn thư mục: ${dirHandle.name}`);
      } else {
        const folderPath = prompt("Nhập đường dẫn thư mục video trên máy tính:", "C:/Videos/");
        if (folderPath && onSelectFolder) {
          onSelectFolder(folderPath);
          toast.success(`Đã chọn thư mục: ${folderPath}`);
        }
      }
    } catch (err) {
      console.log('Hủy chọn thư mục');
    }
  };

  const handlePickSample = (sample) => {
    setLocalPreviewUrl(sample.url);
    if (onSelectSample) {
      onSelectSample(sample);
    }
    setShowSamples(false);
    toast.success(`Đã nạp video mẫu: ${sample.name}`);
  };

  const handleClear = () => {
    setLocalPreviewUrl('');
    if (onClear) {
      onClear();
    }
    toast.success('Đã đặt lại ô video');
  };

  const hasValue = !!(currentPath || localPreviewUrl);
  const isVideoUrlAvailable = !!(localPreviewUrl && (localPreviewUrl.startsWith('http') || localPreviewUrl.startsWith('blob:') || localPreviewUrl.startsWith('data:')));

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {/* Tiêu đề rõ ràng với icon & badge */}
      {label && (
        <div className="flex items-center justify-between gap-2">
          <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
            <Video size={14} className="text-blue-600 shrink-0" />
            <span>{label}</span>
            {badgeText && (
              <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">
                {badgeText}
              </span>
            )}
          </label>
          {subLabel && <span className="text-[11px] text-gray-500">{subLabel}</span>}
        </div>
      )}

      {/* Khung tương tác chính */}
      <div className="flex items-center gap-2.5 bg-gray-50/70 hover:bg-gray-50 border border-gray-200 rounded-xl p-2 transition-all shadow-2xs">
        
        {/* 🎬 1. Ô THUMBNAIL PREVIEW NHỎ (HIỂN THỊ TRỰC QUAN VIDEO ĐÃ NẠP) */}
        <div className="relative shrink-0 w-[54px] h-[54px] rounded-lg overflow-hidden bg-slate-900 border border-slate-300 shadow-inner flex items-center justify-center group">
          {isVideoUrlAvailable ? (
            <>
              <video 
                ref={previewVideoRef}
                src={localPreviewUrl} 
                className="w-full h-full object-cover cursor-pointer"
                muted 
                playsInline
                loop
                onMouseEnter={(e) => {
                  try { e.target.play(); } catch (err) {}
                }}
                onMouseLeave={(e) => {
                  try { 
                    e.target.pause(); 
                    e.target.currentTime = 0; 
                  } catch (err) {}
                }}
                onClick={() => setPreviewModalOpen(true)}
              />
              <div 
                onClick={() => setPreviewModalOpen(true)}
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                title="Bấm để xem video phóng to"
              >
                <Eye size={16} className="text-white drop-shadow-md" />
              </div>
              <div className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-emerald-500 border border-white rounded-full"></div>
            </>
          ) : hasValue ? (
            <div className="flex flex-col items-center justify-center p-1 text-center" title={currentPath}>
              <Film size={20} className="text-blue-400 mb-0.5" />
              <span className="text-[8px] text-blue-200 font-bold line-clamp-1">FOLDER</span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-1 text-center opacity-40">
              <Video size={18} className="text-slate-400" />
              <span className="text-[8px] text-slate-400 font-bold">TRỐNG</span>
            </div>
          )}
        </div>

        {/* 📝 2. Ô HIỂN THỊ TÊN FILE / ĐƯỜNG DẪN / TRẠNG THÁI */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className={`text-xs font-semibold truncate block ${hasValue ? 'text-blue-950 font-bold' : 'text-gray-400'}`}>
              {currentPath || defaultText}
            </span>
            {hasValue && (
              <span className="shrink-0 text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                <CheckCircle2 size={10} className="text-emerald-600" /> Đã Nạp
              </span>
            )}
          </div>
          <div className="text-[10.5px] text-gray-400 truncate mt-0.5">
            {isVideoUrlAvailable 
              ? '▶ Di chuột vào ảnh nhỏ để xem trước hoặc bấm vào để phóng to' 
              : hasValue 
                ? '📁 Đang liên kết với thư mục chứa video trên máy tính' 
                : 'Chấp nhận file .mp4, .webm, .mov, .mkv hoặc thư mục'}
          </div>
        </div>

        {/* 🎛️ 3. CÁC NÚT THAO TÁC */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Nút ẩn file input */}
          <input 
            ref={fileInputRef}
            id={uniqueInputId}
            type="file" 
            className="hidden" 
            accept={accept}
            onChange={handleFileChange}
          />

          {/* Nút Tải Clip Trực Tiếp */}
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Tải trực tiếp file video clip từ máy tính"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1 cursor-pointer transition-all shadow-2xs active:scale-95 shrink-0"
          >
            <Video size={13} /> Tải Clip...
          </button>

          {/* Nút Chọn Thư Mục */}
          <button 
            type="button"
            onClick={handleFolderPick}
            title="Chọn thư mục chứa video trên máy tính"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1 cursor-pointer transition-all shrink-0"
          >
            <FolderOpen size={13} /> Thư Mục...
          </button>

          {/* Nút Nạp Video Mẫu Idol AI */}
          <div className="relative shrink-0">
            <button 
              type="button"
              onClick={() => setShowSamples(!showSamples)}
              title="Chọn nhanh video mẫu Idol AI dựng sẵn chuẩn 9:16"
              className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 font-bold px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1 cursor-pointer transition-all shadow-2xs shrink-0"
            >
              <Sparkles size={13} className="text-amber-600" /> Video Mẫu <ChevronDown size={11} />
            </button>

            {showSamples && (
              <div className="absolute right-0 top-full mt-1.5 w-72 bg-white rounded-xl shadow-2xl border border-amber-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="text-[11px] font-black text-amber-900 px-2 py-1 mb-1 border-b border-amber-100 flex items-center justify-between">
                  <span>🌟 5 VIDEO MẪU IDOL AI CHUẨN 9:16:</span>
                  <span className="text-[9px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-bold">60fps</span>
                </div>
                <div className="space-y-1 max-h-60 overflow-y-auto">
                  {SAMPLE_IDOL_VIDEOS.map(sample => (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => handlePickSample(sample)}
                      className="w-full text-left p-2 rounded-lg hover:bg-amber-50 text-xs transition-colors cursor-pointer group"
                    >
                      <div className="font-bold text-gray-800 group-hover:text-amber-800 flex items-center justify-between">
                        <span>{sample.name}</span>
                        <span className="text-[9px] bg-blue-100 text-blue-700 px-1.5 py-0.2 rounded font-semibold">{sample.badge}</span>
                      </div>
                      <div className="text-[10.5px] text-gray-500 line-clamp-1 mt-0.5">{sample.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Nút Xóa / Reset */}
          {hasValue && (
            <button 
              type="button"
              onClick={handleClear}
              title="Xóa / đặt lại ô video này"
              className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors cursor-pointer shrink-0"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {/* 🔍 MODAL XEM TRƯỚC VIDEO PHÓNG TO KHI BẤM VÀO THUMBNAIL */}
      {previewModalOpen && isVideoUrlAvailable && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-slate-900 text-white rounded-2xl max-w-lg w-full overflow-hidden border border-cyan-500/30 shadow-2xl">
            <div className="p-3 border-b border-slate-700 flex items-center justify-between">
              <div className="font-bold text-sm text-cyan-300 flex items-center gap-2">
                <Play size={16} /> Xem Thử Video: {currentPath || 'Video Idol AI'}
              </div>
              <button 
                onClick={() => setPreviewModalOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>
            <div className="relative aspect-[9/16] max-h-[65vh] w-full bg-black flex items-center justify-center mx-auto overflow-hidden">
              <video 
                src={localPreviewUrl} 
                controls 
                autoPlay 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-3 bg-slate-800 text-center text-xs text-gray-300">
              Khung hình chuẩn 9:16 - Sẵn sàng phát sóng trên TikTok Live Studio / OBS
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
