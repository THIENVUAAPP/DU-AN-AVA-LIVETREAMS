import React, { useState, useRef, useEffect } from 'react';
import { Video, FolderOpen, Sparkles, X, ChevronDown, Play, Eye, CheckCircle2, Film } from 'lucide-react';
import { uploadMediaToServer, deleteServerMedia } from '../../utils/mediaUploadService';
import { fastStreamUpload } from '../../utils/fastStreamService';
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

// Danh sách Video Mẫu (Để trống để phần mềm không tự nạp bất kỳ video chạy nền nào)
export const SAMPLE_IDOL_VIDEOS = [];

// Helper trích xuất Thumbnail ảnh trực quan từ video trong 50ms (Chống hoàn toàn đen màn hình)
function extractVideoThumbnail(urlOrFile) {
  return new Promise((resolve) => {
    try {
      if (!urlOrFile) return resolve(null);
      const isImg = typeof urlOrFile === 'string' 
        ? (urlOrFile.match(/\.(png|jpg|jpeg|webp|gif|svg)(\?.*)?$/i) || urlOrFile.startsWith('data:image/'))
        : (urlOrFile.type && urlOrFile.type.startsWith('image/'));
      if (isImg) {
        if (typeof urlOrFile === 'string') return resolve(urlOrFile);
        return resolve(URL.createObjectURL(urlOrFile));
      }

      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.muted = true;
      video.playsInline = true;
      video.preload = 'auto';
      const src = typeof urlOrFile === 'string' ? urlOrFile : URL.createObjectURL(urlOrFile);
      video.src = src;

      let resolved = false;
      const capture = () => {
        if (resolved) return;
        try {
          if (video.videoWidth > 0 && video.videoHeight > 0) {
            const canvas = document.createElement('canvas');
            canvas.width = Math.min(video.videoWidth, 320);
            canvas.height = Math.min(video.videoHeight, 240);
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
              resolved = true;
              if (typeof urlOrFile !== 'string') {
                try { URL.revokeObjectURL(src); } catch (e) {}
              }
              resolve(dataUrl);
              return;
            }
          }
        } catch (e) {}
      };

      video.onloadeddata = () => {
        try { video.currentTime = 0.1; } catch (e) { capture(); }
      };
      video.onseeked = capture;
      video.onerror = () => resolve(null);
      setTimeout(() => {
        capture();
        if (!resolved) resolve(null);
      }, 1200);
    } catch (err) {
      resolve(null);
    }
  });
}

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
  accept = 'video/*,image/*,.mp4,.webm,.mov,.mkv,.avi,.m4v,.flv,.wmv,.png,.jpg,.jpeg,.webp,.gif'
}) {
  const [showSamples, setShowSamples] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [localPreviewUrl, setLocalPreviewUrl] = useState(videoUrl || '');
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const fileInputRef = useRef(null);
  const previewVideoRef = useRef(null);
  const uniqueInputId = inputId || `universal-media-${Math.random().toString(36).substr(2, 9)}`;

  // Đồng bộ preview URL & Thumbnail tự động khi prop videoUrl hoặc currentPath thay đổi
  useEffect(() => {
    const targetUrl = videoUrl || (currentPath && (currentPath.startsWith('http') || currentPath.startsWith('blob:') || currentPath.startsWith('data:') || currentPath.startsWith('/uploads') || currentPath.startsWith('/')) ? currentPath : '');
    if (targetUrl) {
      setLocalPreviewUrl(targetUrl);
      extractVideoThumbnail(targetUrl).then(thumb => {
        if (thumb) setThumbnailUrl(thumb);
      });
    } else {
      setLocalPreviewUrl('');
      setThumbnailUrl(null);
    }
  }, [videoUrl, currentPath]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ⚡ 1. TẠO NGAY OBJECT URL PHỤC VỤ SÂN KHẤU TRONG 0MS (KHÔNG BAO GIỜ BỊ ĐỨNG HÌNH HOẶC CHỜ MẠNG)
    const objectUrl = URL.createObjectURL(file);
    setLocalPreviewUrl(objectUrl);
    
    // Đăng ký file vào RAM và global map
    try {
      registerFileInRAM(file, file.name);
      if (typeof window !== 'undefined') {
        window.__activeMediaBlobMap = window.__activeMediaBlobMap || new Map();
        window.__activeMediaBlobMap.set(file.name, file);
        window.__activeMediaBlobMap.set(objectUrl, file);
        window.__activeMediaBlobMap.set('latest', file);
      }
    } catch (e) {}

    // Kích hoạt ngay lập tức cho caller để hiển thị ngay trên sân khấu
    if (onSelectFile) {
      onSelectFile(file, objectUrl);
    }

    // 🖼️ Trích xuất thumbnail tức thì từ file tải lên (0ms)
    extractVideoThumbnail(file).then(thumb => {
      if (thumb) setThumbnailUrl(thumb);
    });

    toast.success(`🎬 Đã nạp thành công: ${file.name}`);

    // ⚡ 2. TỰ ĐỘNG ĐẨY FILE VÀO THƯ MỤC UPLOADS CỦA SERVER TRONG NỀN (CHO OBS & TIKTOK LIVE STUDIO)
    uploadMediaToServer(file, file.name).then(serverUrl => {
      if (serverUrl && onSelectFile) {
        onSelectFile(file, serverUrl);
        setLocalPreviewUrl(serverUrl);
      }
    }).catch(() => {
      fastStreamUpload(file).then(res => {
        if (res && res.fileUrl && onSelectFile) {
          onSelectFile(file, res.fileUrl);
          setLocalPreviewUrl(res.fileUrl);
        }
      }).catch(() => {});
    });

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
    extractVideoThumbnail(sample.url).then(thumb => {
      if (thumb) setThumbnailUrl(thumb);
    });
    if (onSelectSample) {
      onSelectSample(sample);
    }
    setShowSamples(false);
    toast.success(`Đã nạp video mẫu: ${sample.name}`);
  };

  const handleClear = () => {
    if (localPreviewUrl && typeof localPreviewUrl === 'string' && (localPreviewUrl.includes('/uploads/') || localPreviewUrl.includes('media-'))) {
      deleteServerMedia(localPreviewUrl).catch(() => {});
    }
    setLocalPreviewUrl('');
    setThumbnailUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onClear) {
      onClear();
    }
    toast.success('Đã xóa clip thành công');
  };

  const isMediaAvailable = !!(localPreviewUrl && (
    localPreviewUrl.startsWith('http') || 
    localPreviewUrl.startsWith('blob:') || 
    localPreviewUrl.startsWith('data:') || 
    localPreviewUrl.startsWith('/uploads') || 
    localPreviewUrl.startsWith('/') ||
    /\.(mp4|webm|mov|mkv|avi|png|jpg|jpeg|webp|gif)/i.test(localPreviewUrl)
  ));

  const isImage = typeof localPreviewUrl === 'string' && (
    localPreviewUrl.match(/\.(png|jpg|jpeg|webp|gif|svg)(\?.*)?$/i) || 
    localPreviewUrl.startsWith('data:image/')
  );

  const hasValue = !!(currentPath || localPreviewUrl);

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
        
        {/* 🎬 1. Ô THUMBNAIL PREVIEW (HIỂN THỊ VIDEO ĐANG CHẠY LIÊN TỤC 100% - KHÔNG BAO GIỜ ĐEN) */}
        <div className="relative shrink-0 w-[58px] h-[58px] rounded-lg overflow-hidden bg-slate-900 border border-slate-300 shadow-inner flex items-center justify-center group">
          {isMediaAvailable ? (
            <>
              {isImage ? (
                <img 
                  src={thumbnailUrl || localPreviewUrl} 
                  alt="Preview" 
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => setPreviewModalOpen(true)}
                />
              ) : (
                <video 
                  ref={previewVideoRef}
                  src={localPreviewUrl} 
                  className="w-full h-full object-cover cursor-pointer"
                  muted 
                  autoPlay
                  loop
                  playsInline
                  preload="auto"
                  onClick={() => setPreviewModalOpen(true)}
                />
              )}
              <div 
                onClick={() => setPreviewModalOpen(true)}
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                title="Bấm để xem video phóng to"
              >
                <Eye size={18} className="text-white drop-shadow-md" />
              </div>
              <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-500 border border-white rounded-full shadow-xs animate-pulse"></div>
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
            {isMediaAvailable 
              ? '▶ Video đang phát liên tục — Bấm vào ảnh để phóng to xem thử' 
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

          {/* Nút Nạp Video Mẫu Idol AI (Chỉ hiện khi có mẫu) */}
          {SAMPLE_IDOL_VIDEOS.length > 0 && (
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
                    <span>🌟 VIDEO MẪU IDOL AI CHUẨN 9:16:</span>
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
          )}

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
      {previewModalOpen && isMediaAvailable && (
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

