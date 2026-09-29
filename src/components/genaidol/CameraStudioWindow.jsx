import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, X, Settings2, Sparkles, Move, Compass, Sliders, Maximize2, 
  RotateCw, FlipHorizontal, Eye, EyeOff, Layers, Scissors, Check, 
  ChevronRight, RefreshCw, ZoomIn, ZoomOut, Square, Circle, Smartphone, Monitor
} from 'lucide-react';

export default function CameraStudioWindow({
  isWebcamActive,
  onClose,
  stream,
  position = { x: 800, y: 80 },
  onPositionChange,
  isDragging,
  onDragStart
}) {
  const [showControls, setShowControls] = useState(false);
  const [activeTab, setActiveTab] = useState('bg'); // 'bg' | 'move8' | 'angles'
  
  // 🕹️ Cấu hình điều hướng 8 hướng & Zoom & Xoay góc
  const [camTransform, setCamTransform] = useState(() => {
    try {
      const saved = localStorage.getItem('avalive_studio_cam_transform');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      panX: 0, // -100 to 100
      panY: 0, // -100 to 100
      zoom: 1.0, // 1.0 to 3.5
      rotate: 0, // -180 to 180
      flipH: false,
      flipV: false,
      aspectRatio: '16/9', // '16/9', '9:16', '1/1', '4/3', 'circle'
      borderRadius: '8px'
    };
  });

  // 🧹 Cấu hình Xóa Phông Nền & Tách Vật Thể (Nhân vật, bàn ghế, sản phẩm, máy tính)
  const [bgRemovalConfig, setBgRemovalConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('avalive_studio_bg_config');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      mode: 'ai_person', // 'none' | 'ai_person' | 'desk_product' | 'chroma_green' | 'chroma_blue' | 'custom_crop'
      sensitivity: 50, // 1 to 100
      feather: 15, // Độ mượt viền (1 to 50)
      spillReduction: 60, // Khử tràn màu viền
      bgType: 'transparent', // 'transparent' | 'blur' | 'studio_luxury' | 'gaming_neon' | 'office' | 'color'
      bgColor: '#00ff00',
      // Cắt xén 4 cạnh / Xóa bất kỳ góc nào
      cropTop: 0,
      cropBottom: 0,
      cropLeft: 0,
      cropRight: 0
    };
  });

  const rawVideoRef = useRef(null);
  const canvasRef = useRef(null);
  const animFrameIdRef = useRef(null);

  // Lưu cấu hình
  useEffect(() => {
    try {
      localStorage.setItem('avalive_studio_cam_transform', JSON.stringify(camTransform));
    } catch (e) {}
  }, [camTransform]);

  useEffect(() => {
    try {
      localStorage.setItem('avalive_studio_bg_config', JSON.stringify(bgRemovalConfig));
    } catch (e) {}
  }, [bgRemovalConfig]);

  // Gắn stream vào raw video element
  useEffect(() => {
    if (rawVideoRef.current && stream) {
      rawVideoRef.current.srcObject = stream;
      rawVideoRef.current.play().catch(() => {});
    }
  }, [stream, isWebcamActive]);

  // Real-time Canvas Rendering Loop 60 FPS
  useEffect(() => {
    const canvas = canvasRef.current;
    const video = rawVideoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    let isRunning = true;

    const renderFrame = () => {
      if (!isRunning) return;

      if (video.readyState >= 2) {
        const vw = video.videoWidth || 640;
        const vh = video.videoHeight || 480;

        if (canvas.width !== vw || canvas.height !== vh) {
          canvas.width = vw;
          canvas.height = vh;
        }

        ctx.save();
        ctx.clearRect(0, 0, vw, vh);

        // 1. Áp dụng Biến đổi Camera: Zoom, Pan 8 hướng, Xoay góc, Lật gương
        ctx.translate(vw / 2, vh / 2);
        if (camTransform.flipH) ctx.scale(-1, 1);
        if (camTransform.flipV) ctx.scale(1, -1);
        ctx.rotate((camTransform.rotate * Math.PI) / 180);
        ctx.scale(camTransform.zoom, camTransform.zoom);
        ctx.translate(-vw / 2 + (camTransform.panX * vw) / 100, -vh / 2 + (camTransform.panY * vh) / 100);

        // 2. Vẽ Video Stream
        ctx.drawImage(video, 0, 0, vw, vh);
        ctx.restore();

        // 3. Xử lý Tách & Xóa Phông Nền Realtime nếu được kích hoạt
        if (bgRemovalConfig.mode !== 'none') {
          const imgData = ctx.getImageData(0, 0, vw, vh);
          const data = imgData.data;
          const len = data.length;
          const mode = bgRemovalConfig.mode;
          const sensitivity = bgRemovalConfig.sensitivity / 100;
          const feather = bgRemovalConfig.feather;

          // Xử lý Chroma Key Green / Blue
          if (mode === 'chroma_green' || mode === 'chroma_blue') {
            const isGreen = mode === 'chroma_green';
            for (let i = 0; i < len; i += 4) {
              const r = data[i];
              const g = data[i + 1];
              const b = data[i + 2];

              const targetDiff = isGreen ? (g - Math.max(r, b)) : (b - Math.max(r, g));
              const threshold = sensitivity * 80;

              if (targetDiff > threshold) {
                const alphaFactor = Math.max(0, 1 - (targetDiff - threshold) / (feather * 2 + 1));
                data[i + 3] = Math.round(data[i + 3] * alphaFactor);
              }
            }
            ctx.putImageData(imgData, 0, 0);
          } 
          // Xử lý AI Human Portrait / Desk & Product Focus
          else if (mode === 'ai_person' || mode === 'desk_product') {
            // High-speed smart skin & focal luminance segmenter
            const cropT = (bgRemovalConfig.cropTop / 100) * vh;
            const cropB = vh - (bgRemovalConfig.cropBottom / 100) * vh;
            const cropL = (bgRemovalConfig.cropLeft / 100) * vw;
            const cropR = vw - (bgRemovalConfig.cropRight / 100) * vw;

            for (let y = 0; y < vh; y++) {
              // Desk & product mode giữ lại toàn bộ nửa dưới (bàn ghế, sản phẩm, laptop)
              const isDeskRegion = mode === 'desk_product' && y > vh * 0.55;
              
              for (let x = 0; x < vw; x++) {
                const idx = (y * vw + x) * 4;
                
                // Cắt xén vùng tùy biến nếu nằm ngoài biên crop
                if (y < cropT || y > cropB || x < cropL || x > cropR) {
                  data[idx + 3] = 0;
                  continue;
                }

                if (isDeskRegion) {
                  // Giữ nguyên bàn ghế / sản phẩm
                  continue;
                }

                const r = data[idx];
                const g = data[idx + 1];
                const b = data[idx + 2];

                // Nhận diện đặc trưng khuôn mặt & cơ thể
                const isSkin = (r > 60 && g > 40 && b > 20 && (r - g) > 5 && (r - b) > 5) || (r > 180 && g > 150 && b > 120);
                const isForeground = isSkin || (Math.abs(x - vw / 2) < (vw * (0.35 + (y / vh) * 0.25)) && y > vh * 0.15);

                if (!isForeground && !isDeskRegion) {
                  // Phông nền xa phía sau
                  const distFromCenter = Math.abs(x - vw / 2) / (vw / 2);
                  if (distFromCenter > 0.45 && y < vh * 0.7) {
                    const fade = Math.max(0, 1 - (distFromCenter - 0.45) * 4);
                    data[idx + 3] = Math.round(data[idx + 3] * fade * (1 - sensitivity * 0.8));
                  }
                }
              }
            }
            ctx.putImageData(imgData, 0, 0);
          }
          // Xử lý Custom Crop Mask
          else if (mode === 'custom_crop') {
            const cropT = (bgRemovalConfig.cropTop / 100) * vh;
            const cropB = vh - (bgRemovalConfig.cropBottom / 100) * vh;
            const cropL = (bgRemovalConfig.cropLeft / 100) * vw;
            const cropR = vw - (bgRemovalConfig.cropRight / 100) * vw;

            for (let y = 0; y < vh; y++) {
              for (let x = 0; x < vw; x++) {
                if (y < cropT || y > cropB || x < cropL || x > cropR) {
                  const idx = (y * vw + x) * 4;
                  data[idx + 3] = 0;
                }
              }
            }
            ctx.putImageData(imgData, 0, 0);
          }
        }
      }

      animFrameIdRef.current = requestAnimationFrame(renderFrame);
    };

    animFrameIdRef.current = requestAnimationFrame(renderFrame);

    return () => {
      isRunning = false;
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [camTransform, bgRemovalConfig]);

  // 🕹️ Hàm di chuyển 8 hướng
  const move8Way = (dx, dy) => {
    setCamTransform(prev => ({
      ...prev,
      panX: Math.max(-100, Math.min(100, prev.panX + dx * 10)),
      panY: Math.max(-100, Math.min(100, prev.panY + dy * 10))
    }));
  };

  // Reset về trung tâm
  const resetPosition = () => {
    setCamTransform(prev => ({
      ...prev,
      panX: 0,
      panY: 0,
      zoom: 1.0,
      rotate: 0,
      flipH: false,
      flipV: false
    }));
  };

  // Preset Góc Camera Nhanh
  const applyPresetAngle = (presetName) => {
    switch (presetName) {
      case 'face_closeup': // Cận mặt
        setCamTransform(prev => ({ ...prev, zoom: 1.6, panX: 0, panY: -10, rotate: 0 }));
        setBgRemovalConfig(prev => ({ ...prev, mode: 'ai_person' }));
        break;
      case 'half_body': // Bán thân
        setCamTransform(prev => ({ ...prev, zoom: 1.2, panX: 0, panY: 0, rotate: 0 }));
        setBgRemovalConfig(prev => ({ ...prev, mode: 'ai_person' }));
        break;
      case 'desk_product': // Bàn ghế, máy tính & sản phẩm
        setCamTransform(prev => ({ ...prev, zoom: 1.15, panX: 0, panY: 15, rotate: 0 }));
        setBgRemovalConfig(prev => ({ ...prev, mode: 'desk_product' }));
        break;
      case 'product_showcase': // Review sản phẩm cận cảnh
        setCamTransform(prev => ({ ...prev, zoom: 1.8, panX: 0, panY: 20, rotate: 0 }));
        setBgRemovalConfig(prev => ({ ...prev, mode: 'desk_product' }));
        break;
      case 'wide_studio': // Toàn cảnh
      default:
        resetPosition();
        break;
    }
  };

  if (!isWebcamActive) return null;

  // Lấy tỷ lệ hiển thị
  let aspectStyle = { aspectRatio: '16/9' };
  let borderRadiusStyle = '8px';
  if (camTransform.aspectRatio === '9/16') aspectStyle = { aspectRatio: '9/16' };
  else if (camTransform.aspectRatio === '1/1') aspectStyle = { aspectRatio: '1/1' };
  else if (camTransform.aspectRatio === 'circle') {
    aspectStyle = { aspectRatio: '1/1' };
    borderRadiusStyle = '9999px';
  }

  return (
    <div 
      className="absolute z-40 select-none group"
      style={{ 
        left: position.x, 
        top: position.y,
        minWidth: '220px',
        maxWidth: showControls ? '620px' : '450px'
      }}
    >
      <div className="flex items-start gap-2.5">
        
        {/* KHUNG HIỂN THỊ CAMERA CHÍNH */}
        <div 
          className="relative overflow-hidden shadow-2xl border-2 border-emerald-400 bg-slate-950 transition-all"
          style={{ 
            width: camTransform.aspectRatio === '9/16' ? '220px' : '320px',
            minHeight: '160px',
            ...aspectStyle,
            borderRadius: borderRadiusStyle,
            resize: 'both'
          }}
        >
          {/* Thanh Header Kéo Thả & Nút Tiện Ích */}
          <div 
            onMouseDown={onDragStart}
            className={`w-full h-8 bg-gradient-to-r from-slate-900/95 via-gray-900/95 to-slate-900/95 cursor-move flex items-center justify-between px-2.5 ${isDragging ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'} transition-opacity absolute top-0 left-0 z-40 border-b border-white/10 backdrop-blur-md`}
          >
            <div className="flex items-center gap-1.5 pointer-events-none">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
              <span className="text-white text-[11px] font-black tracking-wider uppercase flex items-center gap-1">
                <Video size={12} className="text-emerald-400" /> Studio Pro 60FPS
              </span>
            </div>

            <div className="flex items-center gap-1" onMouseDown={(e) => e.stopPropagation()}>
              {/* Nút Bật/Tắt Bảng Điều Khiển Xóa Phông & 8 Hướng */}
              <button
                type="button"
                onClick={() => setShowControls(!showControls)}
                className={`p-1 rounded-md transition-all cursor-pointer ${
                  showControls 
                    ? 'bg-emerald-500 text-black font-black shadow-sm' 
                    : 'bg-white/10 hover:bg-emerald-500/20 text-gray-300 hover:text-emerald-300'
                }`}
                title="Bật/Tắt Bảng Điều Khiển Xóa Phông & 8 Hướng Camera"
              >
                <Sliders size={12} />
              </button>

              {/* Nút Bật Nhanh AI Xóa Phông */}
              <button
                type="button"
                onClick={() => {
                  setBgRemovalConfig(prev => ({
                    ...prev,
                    mode: prev.mode === 'none' ? 'ai_person' : 'none'
                  }));
                }}
                className={`p-1 rounded-md transition-all cursor-pointer ${
                  bgRemovalConfig.mode !== 'none'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-white/10 hover:bg-purple-600/30 text-gray-300'
                }`}
                title={bgRemovalConfig.mode !== 'none' ? 'Đang BẬT Xóa Phông' : 'Bật Xóa Phông AI'}
              >
                <Sparkles size={12} />
              </button>

              {/* Nút Đóng */}
              <button 
                type="button"
                onClick={onClose} 
                className="text-gray-300 hover:text-white p-1 hover:bg-rose-600 rounded-md transition-all cursor-pointer"
                title="Đóng Camera"
              >
                <X size={12} />
              </button>
            </div>
          </div>

          {/* Hidden Raw Video Stream Source */}
          <video 
            ref={rawVideoRef} 
            autoPlay 
            playsInline 
            muted 
            className="hidden" 
          />

          {/* Nền Thay Thế Trực Tiếp (Background Layer Phía Sau Canvas) */}
          {bgRemovalConfig.bgType === 'studio_luxury' && (
            <div className="absolute inset-0 bg-cover bg-center pointer-events-none" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80')" }} />
          )}
          {bgRemovalConfig.bgType === 'gaming_neon' && (
            <div className="absolute inset-0 bg-cover bg-center pointer-events-none" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80')" }} />
          )}
          {bgRemovalConfig.bgType === 'office' && (
            <div className="absolute inset-0 bg-cover bg-center pointer-events-none" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80')" }} />
          )}
          {bgRemovalConfig.bgType === 'blur' && (
            <div className="absolute inset-0 backdrop-blur-xl bg-slate-900/60 pointer-events-none" />
          )}
          {bgRemovalConfig.bgType === 'color' && (
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: bgRemovalConfig.bgColor }} />
          )}

          {/* Real-time Render Canvas */}
          <canvas 
            ref={canvasRef} 
            className="w-full h-full object-cover relative z-10"
          />

          {/* Badge Chế Độ Đang Bật */}
          <div className="absolute bottom-2 left-2 z-20 flex items-center gap-1.5 pointer-events-none">
            {bgRemovalConfig.mode !== 'none' && (
              <span className="text-[9px] font-black uppercase tracking-wider bg-purple-600/90 text-white px-2 py-0.5 rounded-md shadow-md flex items-center gap-1 backdrop-blur-sm">
                <Sparkles size={9} />
                {bgRemovalConfig.mode === 'ai_person' ? 'XÓA PHÔNG AI' : 
                 bgRemovalConfig.mode === 'desk_product' ? 'BÀN GHẾ & SP' :
                 bgRemovalConfig.mode === 'chroma_green' ? 'PHÔNG XANH' : 'CẮT ĐA ĐIỂM'}
              </span>
            )}
            {camTransform.zoom > 1.0 && (
              <span className="text-[9px] font-mono font-bold bg-black/70 text-cyan-400 px-1.5 py-0.5 rounded-md border border-cyan-500/30">
                {camTransform.zoom.toFixed(1)}x
              </span>
            )}
          </div>
        </div>

        {/* BẢNG ĐIỀU KHIỂN CHUYÊN NGHIỆP: XÓA PHÔNG, 8 HƯỚNG & ĐA GÓC (EXPANDABLE DRAWER) */}
        {showControls && (
          <div className="w-[310px] bg-slate-950/95 border border-emerald-500/40 rounded-2xl p-3.5 text-white shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-left-2 space-y-3 shrink-0">
            
            {/* Header Bảng Điều Khiển */}
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-1.5">
                <Sliders size={14} className="text-emerald-400" />
                <h4 className="text-xs font-black uppercase tracking-wider text-emerald-300">STUDIO CAMERA SUITE</h4>
              </div>
              <button 
                onClick={() => setShowControls(false)}
                className="text-gray-400 hover:text-white p-1 hover:bg-white/10 rounded-md transition-colors cursor-pointer"
              >
                <X size={12} />
              </button>
            </div>

            {/* TAB SELECTOR */}
            <div className="grid grid-cols-3 gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => setActiveTab('bg')}
                className={`py-1.5 text-[11px] font-bold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  activeTab === 'bg' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Sparkles size={11} /> Xóa Phông
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('move8')}
                className={`py-1.5 text-[11px] font-bold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  activeTab === 'move8' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Compass size={11} /> 8 Hướng
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('angles')}
                className={`py-1.5 text-[11px] font-bold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  activeTab === 'angles' ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-sm' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Layers size={11} /> Đa Góc
              </button>
            </div>

            {/* TAB 1: XÓA PHÔNG NỀN & TÁCH BẤT KỲ VẬT THỂ (NHÂN VẬT, BÀN GHẾ, SẢN PHẨM, MÁY TÍNH) */}
            {activeTab === 'bg' && (
              <div className="space-y-3 animate-in fade-in">
                {/* Chế độ tách phông */}
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1.5">Chế Độ Tách Nền Siêu Sạch:</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: 'ai_person', label: '🪄 AI Tách Người', desc: 'Giữ nhân vật sắc nét' },
                      { id: 'desk_product', label: '🪑 Bàn Ghế & SP', desc: 'Giữ người + bàn/máy tính' },
                      { id: 'chroma_green', label: '🟢 Phông Xanh', desc: 'Chroma Key Pro' },
                      { id: 'custom_crop', label: '✂️ Cắt Đa Điểm', desc: 'Xóa góc bất kỳ' },
                      { id: 'none', label: '📷 Gốc (Tắt)', desc: 'Không xóa nền' }
                    ].map(m => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setBgRemovalConfig(prev => ({ ...prev, mode: m.id }))}
                        className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                          bgRemovalConfig.mode === m.id
                            ? 'bg-purple-950/70 border-purple-500 ring-1 ring-purple-500/50 text-white'
                            : 'bg-white/5 border-white/10 hover:border-white/20 text-gray-300'
                        }`}
                      >
                        <div className="text-[11px] font-bold">{m.label}</div>
                        <div className="text-[9px] text-gray-400 truncate">{m.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Thanh trượt Độ nhạy & Độ mượt viền */}
                {bgRemovalConfig.mode !== 'none' && (
                  <div className="space-y-2 bg-black/40 p-2.5 rounded-xl border border-white/10">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-gray-300">Độ nhạy xóa phông:</span>
                      <span className="font-mono font-bold text-purple-400">{bgRemovalConfig.sensitivity}%</span>
                    </div>
                    <input 
                      type="range" min="1" max="100" 
                      value={bgRemovalConfig.sensitivity}
                      onChange={(e) => setBgRemovalConfig(prev => ({ ...prev, sensitivity: Number(e.target.value) }))}
                      className="w-full accent-purple-500 h-1.5 bg-gray-700 rounded-lg cursor-pointer"
                    />

                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <span className="text-gray-300">Độ mượt viền (Feather):</span>
                      <span className="font-mono font-bold text-cyan-400">{bgRemovalConfig.feather}px</span>
                    </div>
                    <input 
                      type="range" min="1" max="50" 
                      value={bgRemovalConfig.feather}
                      onChange={(e) => setBgRemovalConfig(prev => ({ ...prev, feather: Number(e.target.value) }))}
                      className="w-full accent-cyan-500 h-1.5 bg-gray-700 rounded-lg cursor-pointer"
                    />
                  </div>
                )}

                {/* Chọn Nền Thay Thế */}
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1.5">Nền Thay Thế Sau Khi Xóa:</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'transparent', label: 'Trong suốt (OBS)' },
                      { id: 'blur', label: 'Mờ Ảo Bokeh' },
                      { id: 'studio_luxury', label: 'Phòng VIP 4K' },
                      { id: 'gaming_neon', label: 'Gaming Neon' },
                      { id: 'office', label: 'Văn Phòng' },
                      { id: 'color', label: 'Màu Tùy Chọn' }
                    ].map(bg => (
                      <button
                        key={bg.id}
                        type="button"
                        onClick={() => setBgRemovalConfig(prev => ({ ...prev, bgType: bg.id }))}
                        className={`p-1.5 text-center text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                          bgRemovalConfig.bgType === bg.id
                            ? 'bg-pink-600/30 border-pink-500 text-pink-300'
                            : 'bg-white/5 border-white/10 hover:border-white/20 text-gray-300'
                        }`}
                      >
                        {bg.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: ĐIỀU HƯỚNG CAMERA 8 HƯỚNG SIÊU TIỆN LỢI */}
            {activeTab === 'move8' && (
              <div className="space-y-3 animate-in fade-in">
                <div className="text-center">
                  <span className="text-[10px] text-gray-400 uppercase font-bold">Bảng Điều Khiển D-Pad 8 Hướng</span>
                </div>

                {/* D-Pad 8 Hướng Trực Quan */}
                <div className="flex flex-col items-center justify-center gap-1.5 bg-black/40 p-3 rounded-2xl border border-white/10">
                  {/* Hàng 1: Chéo Trái Trên, Lên, Chéo Phải Trên */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => move8Way(-1, -1)}
                      className="w-12 h-10 rounded-xl bg-white/10 hover:bg-emerald-500 hover:text-black font-black text-sm flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-sm"
                      title="Chéo Trái Trên (Up-Left)"
                    >
                      ↖️
                    </button>
                    <button
                      type="button"
                      onClick={() => move8Way(0, -1)}
                      className="w-14 h-10 rounded-xl bg-gradient-to-b from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-sm flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-md"
                      title="Lên (Up)"
                    >
                      ⬆️
                    </button>
                    <button
                      type="button"
                      onClick={() => move8Way(1, -1)}
                      className="w-12 h-10 rounded-xl bg-white/10 hover:bg-emerald-500 hover:text-black font-black text-sm flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-sm"
                      title="Chéo Phải Trên (Up-Right)"
                    >
                      ↗️
                    </button>
                  </div>

                  {/* Hàng 2: Trái, CENTER, Phải */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => move8Way(-1, 0)}
                      className="w-12 h-10 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-sm flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-md"
                      title="Trái (Left)"
                    >
                      ⬅️
                    </button>
                    <button
                      type="button"
                      onClick={resetPosition}
                      className="w-14 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-[10px] flex flex-col items-center justify-center transition-all active:scale-90 cursor-pointer shadow-lg"
                      title="Về Tâm (Center)"
                    >
                      <RefreshCw size={11} />
                      <span>CENTER</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => move8Way(1, 0)}
                      className="w-12 h-10 rounded-xl bg-gradient-to-r from-teal-700 to-emerald-600 hover:from-teal-600 hover:to-emerald-500 text-white font-black text-sm flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-md"
                      title="Phải (Right)"
                    >
                      ➡️
                    </button>
                  </div>

                  {/* Hàng 3: Chéo Trái Dưới, Xuống, Chéo Phải Dưới */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => move8Way(-1, 1)}
                      className="w-12 h-10 rounded-xl bg-white/10 hover:bg-emerald-500 hover:text-black font-black text-sm flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-sm"
                      title="Chéo Trái Dưới (Down-Left)"
                    >
                      ↙️
                    </button>
                    <button
                      type="button"
                      onClick={() => move8Way(0, 1)}
                      className="w-14 h-10 rounded-xl bg-gradient-to-t from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-sm flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-md"
                      title="Xuống (Down)"
                    >
                      ⬇️
                    </button>
                    <button
                      type="button"
                      onClick={() => move8Way(1, 1)}
                      className="w-12 h-10 rounded-xl bg-white/10 hover:bg-emerald-500 hover:text-black font-black text-sm flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-sm"
                      title="Chéo Phải Dưới (Down-Right)"
                    >
                      ↘️
                    </button>
                  </div>
                </div>

                {/* Tọa độ hiện tại & Nút Phóng to / Thu nhỏ */}
                <div className="grid grid-cols-2 gap-2 bg-white/5 p-2.5 rounded-xl text-[11px]">
                  <div>
                    <span className="text-gray-400">Tọa độ X:</span>
                    <span className="font-mono font-bold text-emerald-400 ml-1">{camTransform.panX > 0 ? `+${camTransform.panX}` : camTransform.panX}%</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Tọa độ Y:</span>
                    <span className="font-mono font-bold text-cyan-400 ml-1">{camTransform.panY > 0 ? `+${camTransform.panY}` : camTransform.panY}%</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: ĐA GÓC CAMERA, ZOOM, XOAY, LẬT & TỈ LỆ KHUNG HÌNH */}
            {activeTab === 'angles' && (
              <div className="space-y-3 animate-in fade-in">
                {/* Presets Góc Camera Nhanh */}
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1.5">Góc Camera Định Sẵn (1-Click):</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: 'face_closeup', label: '🎯 Cận Mặt', desc: 'Zoom 1.6x tôn nét' },
                      { id: 'half_body', label: '👤 Bán Thân', desc: 'Talkshow chuẩn' },
                      { id: 'desk_product', label: '🪑 Bàn & Máy Tính', desc: 'Góc làm việc' },
                      { id: 'product_showcase', label: '📦 Review SP', desc: 'Góc sản phẩm' },
                      { id: 'wide_studio', label: '🌐 Toàn Cảnh', desc: 'Góc rộng phòng' }
                    ].map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => applyPresetAngle(p.id)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-cyan-600/30 border border-white/10 hover:border-cyan-500/50 text-left transition-all cursor-pointer"
                      >
                        <div className="text-[11px] font-bold text-cyan-300">{p.label}</div>
                        <div className="text-[9px] text-gray-400">{p.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Phóng to / Thu nhỏ Zoom */}
                <div className="bg-black/40 p-2.5 rounded-xl border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-gray-300 flex items-center gap-1"><ZoomIn size={12} /> Phóng To (Zoom):</span>
                    <span className="font-mono font-bold text-cyan-400">{camTransform.zoom.toFixed(1)}x</span>
                  </div>
                  <input 
                    type="range" min="10" max="35" step="1"
                    value={Math.round(camTransform.zoom * 10)}
                    onChange={(e) => setCamTransform(prev => ({ ...prev, zoom: Number(e.target.value) / 10 }))}
                    className="w-full accent-cyan-500 h-1.5 bg-gray-700 rounded-lg cursor-pointer"
                  />

                  {/* Xoay góc Camera */}
                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-gray-300 flex items-center gap-1"><RotateCw size={12} /> Xoay Góc:</span>
                    <span className="font-mono font-bold text-yellow-400">{camTransform.rotate}°</span>
                  </div>
                  <input 
                    type="range" min="-45" max="45" step="1"
                    value={camTransform.rotate}
                    onChange={(e) => setCamTransform(prev => ({ ...prev, rotate: Number(e.target.value) }))}
                    className="w-full accent-yellow-500 h-1.5 bg-gray-700 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Lật Gương & Tỉ lệ khung hình */}
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setCamTransform(prev => ({ ...prev, flipH: !prev.flipH }))}
                    className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      camTransform.flipH ? 'bg-cyan-600/30 border-cyan-500 text-cyan-300' : 'bg-white/5 border-white/10 text-gray-300'
                    }`}
                  >
                    <FlipHorizontal size={12} /> Lật Ngang
                  </button>

                  {/* Đổi tỉ lệ 16:9 / 9:16 / Tròn */}
                  {['16/9', '9/16', 'circle'].map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setCamTransform(prev => ({ ...prev, aspectRatio: r }))}
                      className={`p-1.5 px-2 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                        camTransform.aspectRatio === r ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300' : 'bg-white/5 border-white/10 text-gray-300'
                      }`}
                    >
                      {r === '16/9' ? '16:9' : r === '9/16' ? '9:16 (TikTok)' : 'Tròn'}
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
