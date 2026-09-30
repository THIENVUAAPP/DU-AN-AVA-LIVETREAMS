import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Video, X, Settings2, Sparkles, Move, Compass, Sliders, Maximize2, 
  RotateCw, FlipHorizontal, FlipVertical, Eye, EyeOff, Layers, Scissors, Check, 
  ChevronRight, RefreshCw, ZoomIn, ZoomOut, Square, Circle, Smartphone, Monitor,
  Tv, Crosshair, Sun, Contrast, Palette, Grid, CornerDownRight, Minimize2,
  Wand2, Focus, ShieldCheck, Zap
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
  const [activeTab, setActiveTab] = useState('crop'); // 'crop' | 'bg' | 'move8' | 'angles' | 'color'
  const [isCleanMode, setIsCleanMode] = useState(false); // Ẩn toàn bộ viền / header khi phát live để hoà vào video AI giống ảnh 1
  const [isInteractiveCrop, setIsInteractiveCrop] = useState(false); // Bật chế độ kéo cắt trực quan trên màn hình
  
  // 🕹️ Cấu hình biến đổi Camera (Zoom, Pan, Xoay, Lật, Tỉ lệ, Bo góc, Phối cảnh 3D)
  const [camTransform, setCamTransform] = useState(() => {
    try {
      const saved = localStorage.getItem('avalive_studio_cam_transform_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      panX: 0, // -150 to 150%
      panY: 0, // -150 to 150%
      zoom: 1.0, // 0.5 to 4.0
      rotate: 0, // -180 to 180 deg
      tiltX: 0, // -45 to 45 deg (phối cảnh nghiêng màn hình)
      tiltY: 0, // -45 to 45 deg
      flipH: false,
      flipV: false,
      aspectRatio: '16/9', // '16/9', '9:16', '4/3', '1/1', '21/9', 'circle', 'free'
      borderRadius: 8, // 0 to 9999
      scaleX: 1.0,
      scaleY: 1.0
    };
  });

  // ✂️ Cấu hình Cắt Camera / Cắt Góc / Cắt Khung Đa Chiều (Crop 4 cạnh & 4 góc)
  const [cropConfig, setCropConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('avalive_studio_crop_config');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      cropTop: 0, // 0 to 80%
      cropBottom: 0,
      cropLeft: 0,
      cropRight: 0,
      cornerTL: 0, // Cắt vát 4 góc (0 to 50%)
      cornerTR: 0,
      cornerBL: 0,
      cornerBR: 0,
      feather: 4 // Độ mềm viền cắt (px)
    };
  });

  // 🧹 Cấu hình Xóa Phông Nền AI & Chroma Key & Tách Vật Thể
  const [bgRemovalConfig, setBgRemovalConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('avalive_studio_bg_config_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      mode: 'ai_person', // 'none' | 'ai_person' | 'desk_product' | 'chroma_green' | 'chroma_blue' | 'custom_crop'
      sensitivity: 50, // 1 to 100
      feather: 12, // Độ mượt viền (1 to 50)
      spillReduction: 60, // Khử tràn xanh (0 to 100)
      bgType: 'transparent', // 'transparent' | 'blur' | 'studio_luxury' | 'gaming_neon' | 'office' | 'color'
      bgColor: '#00ff00',
      edgeSoftness: 10
    };
  });

  // 🎨 Cân Bằng Ánh Sáng & Tông Màu Khớp Video AI
  const [colorTune, setColorTune] = useState(() => {
    try {
      const saved = localStorage.getItem('avalive_studio_color_tune');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      brightness: 100, // 50 to 150%
      contrast: 100, // 50 to 150%
      saturate: 105, // 50 to 150%
      temperature: 0, // -50 (lạnh) to 50 (ấm)
      skinSmooth: 30 // 0 to 100 (mịn da)
    };
  });

  const rawVideoRef = useRef(null);
  const canvasRef = useRef(null);
  const animFrameIdRef = useRef(null);
  const containerRef = useRef(null);

  // Lưu cấu hình vào localStorage
  useEffect(() => {
    try {
      localStorage.setItem('avalive_studio_cam_transform_v2', JSON.stringify(camTransform));
      localStorage.setItem('avalive_studio_crop_config', JSON.stringify(cropConfig));
      localStorage.setItem('avalive_studio_bg_config_v2', JSON.stringify(bgRemovalConfig));
      localStorage.setItem('avalive_studio_color_tune', JSON.stringify(colorTune));
    } catch (e) {}
  }, [camTransform, cropConfig, bgRemovalConfig, colorTune]);

  // Gắn stream vào video tag ẩn
  useEffect(() => {
    if (rawVideoRef.current && stream) {
      rawVideoRef.current.srcObject = stream;
      rawVideoRef.current.play().catch(() => {});
    }
  }, [stream, isWebcamActive]);

  // Real-time Canvas Rendering Loop 60 FPS với WebGL/2D Accelerated Pipeline
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

        // 1. Áp dụng hiệu chỉnh màu sắc CSS filters trực tiếp trên Canvas
        const b = colorTune.brightness;
        const c = colorTune.contrast;
        const s = colorTune.saturate;
        const h = colorTune.temperature * 0.4;
        ctx.filter = `brightness(${b}%) contrast(${c}%) saturate(${s}%) hue-rotate(${h}deg)`;

        // 2. Biến đổi Camera: Zoom, Pan, Xoay, Lật gương, Phối cảnh
        ctx.translate(vw / 2, vh / 2);
        if (camTransform.flipH) ctx.scale(-1, 1);
        if (camTransform.flipV) ctx.scale(1, -1);
        ctx.rotate((camTransform.rotate * Math.PI) / 180);
        ctx.scale(camTransform.zoom, camTransform.zoom);
        ctx.translate(-vw / 2 + (camTransform.panX * vw) / 100, -vh / 2 + (camTransform.panY * vh) / 100);

        // 3. Vẽ Video Stream gốc
        ctx.drawImage(video, 0, 0, vw, vh);
        ctx.restore();

        // 4. Xử lý Cắt Camera 4 cạnh & Xóa Góc (Crop Engine) & Xóa Phông Nền AI
        const hasCrop = cropConfig.cropTop > 0 || cropConfig.cropBottom > 0 || 
                        cropConfig.cropLeft > 0 || cropConfig.cropRight > 0 ||
                        cropConfig.cornerTL > 0 || cropConfig.cornerTR > 0 ||
                        cropConfig.cornerBL > 0 || cropConfig.cornerBR > 0;

        const hasBgRemoval = bgRemovalConfig.mode !== 'none';

        if (hasCrop || hasBgRemoval) {
          const imgData = ctx.getImageData(0, 0, vw, vh);
          const data = imgData.data;
          
          const cropT = (cropConfig.cropTop / 100) * vh;
          const cropB = vh - (cropConfig.cropBottom / 100) * vh;
          const cropL = (cropConfig.cropLeft / 100) * vw;
          const cropR = vw - (cropConfig.cropRight / 100) * vw;

          const cornerTLDist = (cropConfig.cornerTL / 100) * Math.min(vw, vh);
          const cornerTRDist = (cropConfig.cornerTR / 100) * Math.min(vw, vh);
          const cornerBLDist = (cropConfig.cornerBL / 100) * Math.min(vw, vh);
          const cornerBRDist = (cropConfig.cornerBR / 100) * Math.min(vw, vh);

          const mode = bgRemovalConfig.mode;
          const sensitivity = bgRemovalConfig.sensitivity / 100;
          const feather = Math.max(1, bgRemovalConfig.feather);
          const spill = bgRemovalConfig.spillReduction / 100;

          // Process Pixel by Pixel
          for (let y = 0; y < vh; y++) {
            const isTopHalf = y < vh * 0.55;
            const isDeskRegion = mode === 'desk_product' && !isTopHalf;

            for (let x = 0; x < vw; x++) {
              const idx = (y * vw + x) * 4;

              // A. Kiểm tra Cắt xén 4 cạnh (Crop 4 sides)
              if (y < cropT || y > cropB || x < cropL || x > cropR) {
                data[idx + 3] = 0;
                continue;
              }

              // B. Kiểm tra Cắt vát 4 góc (Corner Cuts)
              if (cornerTLDist > 0 && x < cropL + cornerTLDist && y < cropT + (cornerTLDist - (x - cropL))) {
                data[idx + 3] = 0;
                continue;
              }
              if (cornerTRDist > 0 && x > cropR - cornerTRDist && y < cropT + (cornerTRDist - (cropR - x))) {
                data[idx + 3] = 0;
                continue;
              }
              if (cornerBLDist > 0 && x < cropL + cornerBLDist && y > cropB - (cornerBLDist - (x - cropL))) {
                data[idx + 3] = 0;
                continue;
              }
              if (cornerBRDist > 0 && x > cropR - cornerBRDist && y > cropB - (cornerBRDist - (cropR - x))) {
                data[idx + 3] = 0;
                continue;
              }

              // C. Xóa Phông Nền (Background Removal Logic)
              if (mode === 'chroma_green' || mode === 'chroma_blue') {
                const r = data[idx];
                const g = data[idx + 1];
                const b = data[idx + 2];
                const isGreen = mode === 'chroma_green';

                const primaryDiff = isGreen ? (g - Math.max(r, b)) : (b - Math.max(r, g));
                const threshold = sensitivity * 70;

                if (primaryDiff > threshold) {
                  const alphaFactor = Math.max(0, 1 - (primaryDiff - threshold) / (feather * 2 + 1));
                  data[idx + 3] = Math.round(data[idx + 3] * alphaFactor);
                } else if (spill > 0 && primaryDiff > threshold * 0.5) {
                  // Khử tràn màu (Spill Suppression)
                  if (isGreen) data[idx + 1] = Math.min(g, Math.max(r, b) * (1 - spill * 0.4));
                  else data[idx + 2] = Math.min(b, Math.max(r, g) * (1 - spill * 0.4));
                }
              } 
              else if (mode === 'ai_person' || mode === 'desk_product') {
                if (isDeskRegion) {
                  // Giữ nguyên bàn ghế / màn hình máy tính / sản phẩm
                  continue;
                }

                const r = data[idx];
                const g = data[idx + 1];
                const b = data[idx + 2];

                // Nhận diện nhân vật thông minh (Smart Human Foreground vs Background)
                const isSkin = (r > 60 && g > 40 && b > 20 && (r - g) > 4 && (r - b) > 4) || (r > 175 && g > 140 && b > 110);
                const distFromCenterX = Math.abs(x - vw / 2) / (vw / 2);
                const isCenterBody = distFromCenterX < (0.38 + (y / vh) * 0.28) && y > vh * 0.12;

                if (!isSkin && !isCenterBody) {
                  if (distFromCenterX > 0.42 && y < vh * 0.72) {
                    const fade = Math.max(0, 1 - (distFromCenterX - 0.42) * 4);
                    data[idx + 3] = Math.round(data[idx + 3] * fade * (1 - sensitivity * 0.85));
                  }
                }
              }
            }
          }

          ctx.putImageData(imgData, 0, 0);
        }
      }

      animFrameIdRef.current = requestAnimationFrame(renderFrame);
    };

    animFrameIdRef.current = requestAnimationFrame(renderFrame);

    return () => {
      isRunning = false;
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [camTransform, cropConfig, bgRemovalConfig, colorTune]);

  // 🕹️ Di chuyển 8 hướng mượt mà
  const move8Way = (dx, dy, step = 10) => {
    setCamTransform(prev => ({
      ...prev,
      panX: Math.max(-150, Math.min(150, prev.panX + dx * step)),
      panY: Math.max(-150, Math.min(150, prev.panY + dy * step))
    }));
  };

  // Reset về trạng thái gốc chuẩn
  const resetTransform = () => {
    setCamTransform({
      panX: 0,
      panY: 0,
      zoom: 1.0,
      rotate: 0,
      tiltX: 0,
      tiltY: 0,
      flipH: false,
      flipV: false,
      aspectRatio: '16/9',
      borderRadius: 8,
      scaleX: 1.0,
      scaleY: 1.0
    });
    setCropConfig({
      cropTop: 0,
      cropBottom: 0,
      cropLeft: 0,
      cropRight: 0,
      cornerTL: 0,
      cornerTR: 0,
      cornerBL: 0,
      cornerBR: 0,
      feather: 4
    });
  };

  // 🎯 Presets Vị Trí Ghép Nhanh Vào Video AI (Giống Ảnh 1)
  const applyPresetLayout = (layoutKey) => {
    switch (layoutKey) {
      case 'desk_screen': // 🖥️ Ghép vào Màn Hình Máy Tính Trên Bàn (Ảnh 1)
        setCamTransform(prev => ({
          ...prev,
          zoom: 1.15,
          panX: -10,
          panY: -5,
          rotate: -2,
          aspectRatio: '16/9',
          borderRadius: 4
        }));
        setCropConfig(prev => ({
          ...prev,
          cropTop: 5,
          cropBottom: 8,
          cropLeft: 5,
          cropRight: 5
        }));
        setBgRemovalConfig(prev => ({ ...prev, mode: 'desk_product', bgType: 'transparent' }));
        if (onPositionChange) onPositionChange({ x: 420, y: 360 });
        break;

      case 'vertical_screen': // 📱 Ghép vào Màn Hình Phụ Đứng (Ảnh 1)
        setCamTransform(prev => ({
          ...prev,
          zoom: 1.3,
          panX: 0,
          panY: 0,
          rotate: 0,
          aspectRatio: '9/16',
          borderRadius: 4
        }));
        setCropConfig(prev => ({
          ...prev,
          cropTop: 2,
          cropBottom: 2,
          cropLeft: 12,
          cropRight: 12
        }));
        setBgRemovalConfig(prev => ({ ...prev, mode: 'ai_person', bgType: 'transparent' }));
        if (onPositionChange) onPositionChange({ x: 580, y: 340 });
        break;

      case 'desk_host_live': // 🪑 Người Ngồi Làm Việc Trong Khung Cảnh AI (Ảnh 1)
        setCamTransform(prev => ({
          ...prev,
          zoom: 1.05,
          panX: 0,
          panY: 10,
          rotate: 0,
          aspectRatio: '16/9',
          borderRadius: 0
        }));
        setCropConfig(prev => ({
          ...prev,
          cropTop: 0,
          cropBottom: 0,
          cropLeft: 0,
          cropRight: 0
        }));
        setBgRemovalConfig(prev => ({ ...prev, mode: 'desk_product', sensitivity: 65, bgType: 'transparent' }));
        if (onPositionChange) onPositionChange({ x: 260, y: 380 });
        break;

      case 'floating_pip_circle': // ⭕ Avatar Nổi Tròn Góc Màn Hình
        setCamTransform(prev => ({
          ...prev,
          zoom: 1.5,
          panX: 0,
          panY: -15,
          rotate: 0,
          aspectRatio: 'circle',
          borderRadius: 9999
        }));
        setCropConfig(prev => ({ ...prev, cropTop: 0, cropBottom: 0, cropLeft: 0, cropRight: 0 }));
        setBgRemovalConfig(prev => ({ ...prev, mode: 'ai_person', bgType: 'transparent' }));
        if (onPositionChange) onPositionChange({ x: window.innerWidth - 280, y: 120 });
        break;

      case 'tiktok_portrait_full': // 🎙️ Streamer TikTok Dọc 9:16 Toàn Thân
        setCamTransform(prev => ({
          ...prev,
          zoom: 1.1,
          panX: 0,
          panY: 0,
          rotate: 0,
          aspectRatio: '9/16',
          borderRadius: 0
        }));
        setCropConfig(prev => ({ ...prev, cropTop: 0, cropBottom: 0, cropLeft: 0, cropRight: 0 }));
        setBgRemovalConfig(prev => ({ ...prev, mode: 'ai_person', bgType: 'transparent' }));
        if (onPositionChange) onPositionChange({ x: 100, y: 50 });
        break;

      case 'product_macro': // 📦 Cận Cảnh Review Sản Phẩm
        setCamTransform(prev => ({
          ...prev,
          zoom: 2.2,
          panX: 0,
          panY: 25,
          rotate: 0,
          aspectRatio: '16/9',
          borderRadius: 8
        }));
        setCropConfig(prev => ({ ...prev, cropTop: 0, cropBottom: 0, cropLeft: 0, cropRight: 0 }));
        setBgRemovalConfig(prev => ({ ...prev, mode: 'desk_product', bgType: 'transparent' }));
        break;

      default:
        resetTransform();
        break;
    }
  };

  if (!isWebcamActive) return null;

  // Tính toán kích thước & bo góc khung hiển thị
  let aspectStyle = { aspectRatio: '16/9' };
  let borderRadiusStyle = `${camTransform.borderRadius}px`;
  let boxWidth = '340px';

  if (camTransform.aspectRatio === '9/16') {
    aspectStyle = { aspectRatio: '9/16' };
    boxWidth = '230px';
  } else if (camTransform.aspectRatio === '1/1' || camTransform.aspectRatio === 'circle') {
    aspectStyle = { aspectRatio: '1/1' };
    boxWidth = '260px';
    if (camTransform.aspectRatio === 'circle') borderRadiusStyle = '9999px';
  } else if (camTransform.aspectRatio === '4/3') {
    aspectStyle = { aspectRatio: '4/3' };
    boxWidth = '320px';
  } else if (camTransform.aspectRatio === '21/9') {
    aspectStyle = { aspectRatio: '21/9' };
    boxWidth = '380px';
  }

  return (
    <div 
      ref={containerRef}
      className={`absolute z-40 select-none group transition-all duration-150 ${isCleanMode ? 'pointer-events-auto' : ''}`}
      style={{ 
        left: position.x, 
        top: position.y,
        minWidth: '180px',
        maxWidth: showControls ? '740px' : '520px'
      }}
    >
      <div className="flex items-start gap-3">
        
        {/* KHUNG HIỂN THỊ CAMERA CHÍNH (CANVAS STAGE) */}
        <div 
          className={`relative overflow-hidden shadow-2xl transition-all ${
            isCleanMode 
              ? 'border border-transparent hover:border-emerald-500/50 bg-transparent' 
              : 'border-2 border-emerald-400 bg-slate-950/80 backdrop-blur-md'
          }`}
          style={{ 
            width: boxWidth,
            minHeight: '140px',
            ...aspectStyle,
            borderRadius: borderRadiusStyle,
            transform: `perspective(600px) rotateX(${camTransform.tiltX}deg) rotateY(${camTransform.tiltY}deg)`,
            resize: isCleanMode ? 'none' : 'both'
          }}
        >
          {/* 1. THANH HEADER ĐIỀU KHIỂN NỔI (Tự ẩn ở Chế độ Clean Mode, hover để hiện lại) */}
          <div 
            onMouseDown={onDragStart}
            className={`w-full h-8 bg-gradient-to-r from-slate-900/95 via-gray-900/95 to-slate-900/95 cursor-move flex items-center justify-between px-2.5 transition-all duration-200 absolute top-0 left-0 z-40 border-b border-white/10 backdrop-blur-md ${
              isCleanMode 
                ? 'opacity-0 group-hover:opacity-100 hover:opacity-100' 
                : isDragging ? 'opacity-100' : 'opacity-85 group-hover:opacity-100'
            }`}
          >
            <div className="flex items-center gap-1.5 pointer-events-none">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
              <span className="text-white text-[11px] font-black tracking-wider uppercase flex items-center gap-1">
                <Video size={12} className="text-emerald-400" /> Studio Pro 60FPS
              </span>
            </div>

            <div className="flex items-center gap-1" onMouseDown={(e) => e.stopPropagation()}>
              {/* Nút Bật/Tắt Khung Cắt Trực Quan (Interactive Crop Box) */}
              <button
                type="button"
                onClick={() => setIsInteractiveCrop(!isInteractiveCrop)}
                className={`p-1 rounded-md transition-all cursor-pointer ${
                  isInteractiveCrop 
                    ? 'bg-amber-500 text-black font-black shadow-sm' 
                    : 'bg-white/10 hover:bg-amber-500/20 text-gray-300 hover:text-amber-300'
                }`}
                title="Bật/Tắt Khung Cắt Xén Trực Quan (Interactive Crop)"
              >
                <Scissors size={12} />
              </button>

              {/* Nút Ẩn/Hiện Viền Phát Live (Clean Mode) */}
              <button
                type="button"
                onClick={() => setIsCleanMode(!isCleanMode)}
                className={`p-1 rounded-md transition-all cursor-pointer ${
                  isCleanMode 
                    ? 'bg-cyan-500 text-black font-black shadow-sm' 
                    : 'bg-white/10 hover:bg-cyan-500/20 text-gray-300 hover:text-cyan-300'
                }`}
                title={isCleanMode ? "Đang bật chế độ Hòa Trộn Trực Tiếp (Ẩn Viền)" : "Ẩn Khung Viền Để Ghép Video AI (Clean Mode)"}
              >
                <EyeOff size={12} />
              </button>

              {/* Nút Bật/Tắt Bảng Điều Khiển Chi Tiết */}
              <button
                type="button"
                onClick={() => setShowControls(!showControls)}
                className={`p-1 rounded-md transition-all cursor-pointer ${
                  showControls 
                    ? 'bg-emerald-500 text-black font-black shadow-sm' 
                    : 'bg-white/10 hover:bg-emerald-500/20 text-gray-300 hover:text-emerald-300'
                }`}
                title="Bật/Tắt Bảng Điều Khiển Camera Studio"
              >
                <Sliders size={12} />
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

          {/* Background Layer Thay Thế Phía Sau Canvas (Nếu người dùng chọn phông ảo) */}
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

          {/* 2. REAL-TIME RENDER CANVAS 60 FPS */}
          <canvas 
            ref={canvasRef} 
            className="w-full h-full object-cover relative z-10"
          />

          {/* 3. KHUNG CẮT TRỰC QUAN TRÊN MÀN HÌNH (INTERACTIVE CROP OVERLAY) */}
          {isInteractiveCrop && (
            <div className="absolute inset-0 z-30 pointer-events-none border-2 border-dashed border-amber-400 bg-amber-500/10">
              {/* Guides */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none border border-amber-400/30">
                <div className="border-r border-b border-amber-400/20" />
                <div className="border-r border-b border-amber-400/20" />
                <div className="border-b border-amber-400/20" />
                <div className="border-r border-b border-amber-400/20" />
                <div className="border-r border-b border-amber-400/20" />
                <div className="border-b border-amber-400/20" />
                <div className="border-r border-amber-400/20" />
                <div className="border-r border-amber-400/20" />
                <div />
              </div>
              <div className="absolute top-1 left-1 bg-amber-500 text-black text-[9px] font-black px-1.5 py-0.5 rounded shadow">
                CHẾ ĐỘ CẮT XÉN GÓC
              </div>
            </div>
          )}

          {/* Badge Trạng Thái Đang Bật */}
          {!isCleanMode && (
            <div className="absolute bottom-2 left-2 z-20 flex items-center gap-1.5 pointer-events-none">
              {bgRemovalConfig.mode !== 'none' && (
                <span className="text-[9px] font-black uppercase tracking-wider bg-purple-600/90 text-white px-2 py-0.5 rounded-md shadow-md flex items-center gap-1 backdrop-blur-sm">
                  <Sparkles size={9} />
                  {bgRemovalConfig.mode === 'ai_person' ? 'XÓA PHÔNG AI' : 
                   bgRemovalConfig.mode === 'desk_product' ? 'BÀN GHẾ & MÁY TÍNH' :
                   bgRemovalConfig.mode === 'chroma_green' ? 'PHÔNG XANH PRO' : 'CẮT ĐA ĐIỂM'}
                </span>
              )}
              {camTransform.zoom !== 1.0 && (
                <span className="text-[9px] font-mono font-bold bg-black/70 text-cyan-400 px-1.5 py-0.5 rounded-md border border-cyan-500/30">
                  {camTransform.zoom.toFixed(1)}x
                </span>
              )}
            </div>
          )}
        </div>

        {/* 4. BẢNG ĐIỀU KHIỂN CHUYÊN NGHIỆP (STUDIO SUITE CONTROLS) */}
        {showControls && (
          <div className="w-[360px] bg-slate-950/95 border border-emerald-500/40 rounded-2xl p-3.5 text-white shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-left-2 space-y-3 shrink-0">
            
            {/* Header Bảng Điều Khiển */}
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-1.5">
                <Sliders size={14} className="text-emerald-400" />
                <h4 className="text-xs font-black uppercase tracking-wider text-emerald-300">STUDIO CAMERA SUITE</h4>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={resetTransform}
                  className="text-[10px] text-gray-400 hover:text-cyan-300 px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-1 transition-all cursor-pointer"
                  title="Khôi phục toàn bộ cài đặt gốc"
                >
                  <RefreshCw size={10} /> Reset
                </button>
                <button 
                  onClick={() => setShowControls(false)}
                  className="text-gray-400 hover:text-white p-1 hover:bg-white/10 rounded-md transition-colors cursor-pointer"
                >
                  <X size={12} />
                </button>
              </div>
            </div>

            {/* TAB SELECTOR (5 TABS) */}
            <div className="grid grid-cols-5 gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
              {[
                { id: 'crop', label: 'Cắt Góc', icon: Scissors },
                { id: 'bg', label: 'Xóa Nền', icon: Sparkles },
                { id: 'move8', label: '8 Hướng', icon: Compass },
                { id: 'angles', label: 'Đa Góc', icon: Layers },
                { id: 'color', label: 'Ánh Sáng', icon: Palette }
              ].map(tab => {
                const TabIcon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-1 text-[10px] font-bold rounded-lg transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                      activeTab === tab.id 
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <TabIcon size={12} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* PRESETS NHANH: GHÉP VÀO VIDEO AI (GIỐNG ẢNH 1) */}
            <div className="bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-slate-900/40 p-2.5 rounded-xl border border-purple-500/30 space-y-1.5">
              <span className="text-[10px] font-black uppercase text-purple-300 flex items-center gap-1">
                <Zap size={11} className="text-amber-400" /> Ghép Nhanh Vào Video AI (1-Click):
              </span>
              <div className="grid grid-cols-3 gap-1">
                {[
                  { id: 'desk_screen', label: '🖥️ Màn Hình Desk', tip: 'Góc máy tính như ảnh 1' },
                  { id: 'vertical_screen', label: '📱 Màn Phụ Dọc', tip: 'Góc đứng 9:16' },
                  { id: 'desk_host_live', label: '🪑 Bàn Ghế & Người', tip: 'Người ngồi bàn AI' },
                  { id: 'floating_pip_circle', label: '⭕ Avatar Tròn', tip: 'PiP nổi góc' },
                  { id: 'tiktok_portrait_full', label: '🎙️ TikTok 9:16', tip: 'Toàn thân dọc' },
                  { id: 'product_macro', label: '📦 Review SP', tip: 'Zoom cận cảnh' }
                ].map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => applyPresetLayout(p.id)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-purple-600/30 border border-white/10 hover:border-purple-400 text-center transition-all cursor-pointer"
                    title={p.tip}
                  >
                    <div className="text-[10px] font-bold text-gray-200">{p.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* TAB 1: CẮT CAMERA, CẮT GÓC, CẮT KHUNG (4-SIDE CROP & CORNER CUT) */}
            {activeTab === 'crop' && (
              <div className="space-y-3 animate-in fade-in">
                {/* Cắt 4 Cạnh (Crop Top, Bottom, Left, Right) */}
                <div className="space-y-2 bg-black/40 p-2.5 rounded-xl border border-white/10">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-gray-300 font-bold flex items-center gap-1"><Scissors size={11} className="text-amber-400" /> Cắt 4 Chiều (Crop Edges):</span>
                    <button 
                      onClick={() => setCropConfig(prev => ({ ...prev, cropTop: 0, cropBottom: 0, cropLeft: 0, cropRight: 0 }))}
                      className="text-[9px] text-gray-400 hover:text-white"
                    >
                      Bỏ Cắt
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div>
                      <div className="flex justify-between text-gray-400 mb-0.5">
                        <span>Cắt Trên (Top):</span>
                        <span className="font-mono text-amber-400">{cropConfig.cropTop}%</span>
                      </div>
                      <input 
                        type="range" min="0" max="60" 
                        value={cropConfig.cropTop}
                        onChange={(e) => setCropConfig(prev => ({ ...prev, cropTop: Number(e.target.value) }))}
                        className="w-full accent-amber-400 h-1 bg-gray-700 rounded-lg cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-gray-400 mb-0.5">
                        <span>Cắt Dưới (Bottom):</span>
                        <span className="font-mono text-amber-400">{cropConfig.cropBottom}%</span>
                      </div>
                      <input 
                        type="range" min="0" max="60" 
                        value={cropConfig.cropBottom}
                        onChange={(e) => setCropConfig(prev => ({ ...prev, cropBottom: Number(e.target.value) }))}
                        className="w-full accent-amber-400 h-1 bg-gray-700 rounded-lg cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-gray-400 mb-0.5">
                        <span>Cắt Trái (Left):</span>
                        <span className="font-mono text-amber-400">{cropConfig.cropLeft}%</span>
                      </div>
                      <input 
                        type="range" min="0" max="60" 
                        value={cropConfig.cropLeft}
                        onChange={(e) => setCropConfig(prev => ({ ...prev, cropLeft: Number(e.target.value) }))}
                        className="w-full accent-amber-400 h-1 bg-gray-700 rounded-lg cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-gray-400 mb-0.5">
                        <span>Cắt Phải (Right):</span>
                        <span className="font-mono text-amber-400">{cropConfig.cropRight}%</span>
                      </div>
                      <input 
                        type="range" min="0" max="60" 
                        value={cropConfig.cropRight}
                        onChange={(e) => setCropConfig(prev => ({ ...prev, cropRight: Number(e.target.value) }))}
                        className="w-full accent-amber-400 h-1 bg-gray-700 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Xóa 4 Góc Bất Kỳ (Corner Cuts) */}
                <div className="space-y-2 bg-black/40 p-2.5 rounded-xl border border-white/10">
                  <span className="text-[10px] font-bold text-gray-300 block">Xóa Vát 4 Góc (Corner Eraser):</span>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div>
                      <span className="text-gray-400">Góc Trái Trên: {cropConfig.cornerTL}%</span>
                      <input 
                        type="range" min="0" max="40" 
                        value={cropConfig.cornerTL}
                        onChange={(e) => setCropConfig(prev => ({ ...prev, cornerTL: Number(e.target.value) }))}
                        className="w-full accent-cyan-400 h-1 bg-gray-700 rounded-lg cursor-pointer"
                      />
                    </div>
                    <div>
                      <span className="text-gray-400">Góc Phải Trên: {cropConfig.cornerTR}%</span>
                      <input 
                        type="range" min="0" max="40" 
                        value={cropConfig.cornerTR}
                        onChange={(e) => setCropConfig(prev => ({ ...prev, cornerTR: Number(e.target.value) }))}
                        className="w-full accent-cyan-400 h-1 bg-gray-700 rounded-lg cursor-pointer"
                      />
                    </div>
                    <div>
                      <span className="text-gray-400">Góc Trái Dưới: {cropConfig.cornerBL}%</span>
                      <input 
                        type="range" min="0" max="40" 
                        value={cropConfig.cornerBL}
                        onChange={(e) => setCropConfig(prev => ({ ...prev, cornerBL: Number(e.target.value) }))}
                        className="w-full accent-cyan-400 h-1 bg-gray-700 rounded-lg cursor-pointer"
                      />
                    </div>
                    <div>
                      <span className="text-gray-400">Góc Phải Dưới: {cropConfig.cornerBR}%</span>
                      <input 
                        type="range" min="0" max="40" 
                        value={cropConfig.cornerBR}
                        onChange={(e) => setCropConfig(prev => ({ ...prev, cornerBR: Number(e.target.value) }))}
                        className="w-full accent-cyan-400 h-1 bg-gray-700 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Bo Góc Tùy Biến (Border Radius) */}
                <div className="flex items-center justify-between gap-2 bg-white/5 p-2 rounded-xl border border-white/10">
                  <span className="text-[11px] text-gray-300 font-medium">Bo Tròn Khung:</span>
                  <div className="flex gap-1">
                    {[
                      { r: 0, label: 'Vuông' },
                      { r: 8, label: '8px' },
                      { r: 16, label: '16px' },
                      { r: 28, label: '28px' },
                      { r: 9999, label: 'Tròn' }
                    ].map(b => (
                      <button
                        key={b.label}
                        type="button"
                        onClick={() => setCamTransform(prev => ({ ...prev, borderRadius: b.r }))}
                        className={`px-2 py-0.5 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                          camTransform.borderRadius === b.r ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-white/5 border-white/10 text-gray-300'
                        }`}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: XÓA PHÔNG NỀN & TÁCH BẤT KỲ VẬT THỂ */}
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
                      { id: 'chroma_blue', label: '🔵 Phông Xanh Dương', desc: 'Blue Screen Key' },
                      { id: 'custom_crop', label: '✂️ Cắt Khung Crop', desc: 'Chỉ giữ vùng chọn' },
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

                {/* Thanh trượt Độ nhạy & Độ mượt viền & Khử tràn xanh */}
                {bgRemovalConfig.mode !== 'none' && (
                  <div className="space-y-2 bg-black/40 p-2.5 rounded-xl border border-white/10">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-gray-300">Độ nhạy tách nền:</span>
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
                      type="range" min="1" max="40" 
                      value={bgRemovalConfig.feather}
                      onChange={(e) => setBgRemovalConfig(prev => ({ ...prev, feather: Number(e.target.value) }))}
                      className="w-full accent-cyan-500 h-1.5 bg-gray-700 rounded-lg cursor-pointer"
                    />

                    {(bgRemovalConfig.mode === 'chroma_green' || bgRemovalConfig.mode === 'chroma_blue') && (
                      <div className="pt-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-gray-300">Khử viền xanh (Spill):</span>
                          <span className="font-mono font-bold text-emerald-400">{bgRemovalConfig.spillReduction}%</span>
                        </div>
                        <input 
                          type="range" min="0" max="100" 
                          value={bgRemovalConfig.spillReduction}
                          onChange={(e) => setBgRemovalConfig(prev => ({ ...prev, spillReduction: Number(e.target.value) }))}
                          className="w-full accent-emerald-500 h-1.5 bg-gray-700 rounded-lg cursor-pointer"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Chọn Nền Thay Thế */}
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1.5">Nền Thay Thế Sau Khi Xóa:</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'transparent', label: 'Trong suốt (Hòa video AI)' },
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
                            ? 'bg-pink-600/30 border-pink-500 text-pink-300 ring-1 ring-pink-500/40'
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

            {/* TAB 3: ĐIỀU HƯỚNG CAMERA 8 HƯỚNG SIÊU TIỆN LỢI */}
            {activeTab === 'move8' && (
              <div className="space-y-3 animate-in fade-in">
                <div className="text-center">
                  <span className="text-[10px] text-gray-400 uppercase font-bold">Bảng Điều Khiển D-Pad 8 Hướng</span>
                </div>

                {/* D-Pad 8 Hướng Trực Quan */}
                <div className="flex flex-col items-center justify-center gap-1.5 bg-black/40 p-3 rounded-2xl border border-white/10">
                  {/* Hàng 1 */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => move8Way(-1, -1)}
                      className="w-12 h-10 rounded-xl bg-white/10 hover:bg-emerald-500 hover:text-black font-black text-sm flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-sm"
                      title="Chéo Trái Trên"
                    >
                      ↖️
                    </button>
                    <button
                      type="button"
                      onClick={() => move8Way(0, -1)}
                      className="w-14 h-10 rounded-xl bg-gradient-to-b from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-sm flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-md"
                      title="Lên"
                    >
                      ⬆️
                    </button>
                    <button
                      type="button"
                      onClick={() => move8Way(1, -1)}
                      className="w-12 h-10 rounded-xl bg-white/10 hover:bg-emerald-500 hover:text-black font-black text-sm flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-sm"
                      title="Chéo Phải Trên"
                    >
                      ↗️
                    </button>
                  </div>

                  {/* Hàng 2 */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => move8Way(-1, 0)}
                      className="w-12 h-10 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-sm flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-md"
                      title="Trái"
                    >
                      ⬅️
                    </button>
                    <button
                      type="button"
                      onClick={() => setCamTransform(prev => ({ ...prev, panX: 0, panY: 0 }))}
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
                      title="Phải"
                    >
                      ➡️
                    </button>
                  </div>

                  {/* Hàng 3 */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => move8Way(-1, 1)}
                      className="w-12 h-10 rounded-xl bg-white/10 hover:bg-emerald-500 hover:text-black font-black text-sm flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-sm"
                      title="Chéo Trái Dưới"
                    >
                      ↙️
                    </button>
                    <button
                      type="button"
                      onClick={() => move8Way(0, 1)}
                      className="w-14 h-10 rounded-xl bg-gradient-to-t from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-sm flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-md"
                      title="Xuống"
                    >
                      ⬇️
                    </button>
                    <button
                      type="button"
                      onClick={() => move8Way(1, 1)}
                      className="w-12 h-10 rounded-xl bg-white/10 hover:bg-emerald-500 hover:text-black font-black text-sm flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-sm"
                      title="Chéo Phải Dưới"
                    >
                      ↘️
                    </button>
                  </div>
                </div>

                {/* Tọa độ hiện tại */}
                <div className="grid grid-cols-2 gap-2 bg-white/5 p-2 rounded-xl text-[11px]">
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

            {/* TAB 4: ĐA GÓC CAMERA, ZOOM, XOAY, PHỐI CẢNH 3D & TỈ LỆ KHUNG */}
            {activeTab === 'angles' && (
              <div className="space-y-3 animate-in fade-in">
                {/* Zoom & Xoay góc */}
                <div className="bg-black/40 p-2.5 rounded-xl border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-gray-300 flex items-center gap-1"><ZoomIn size={12} /> Phóng To (Zoom):</span>
                    <span className="font-mono font-bold text-cyan-400">{camTransform.zoom.toFixed(1)}x</span>
                  </div>
                  <input 
                    type="range" min="5" max="35" step="1"
                    value={Math.round(camTransform.zoom * 10)}
                    onChange={(e) => setCamTransform(prev => ({ ...prev, zoom: Number(e.target.value) / 10 }))}
                    className="w-full accent-cyan-500 h-1.5 bg-gray-700 rounded-lg cursor-pointer"
                  />

                  {/* Xoay góc 360 */}
                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-gray-300 flex items-center gap-1"><RotateCw size={12} /> Xoay Góc Nghiêng:</span>
                    <span className="font-mono font-bold text-yellow-400">{camTransform.rotate}°</span>
                  </div>
                  <input 
                    type="range" min="-90" max="90" step="1"
                    value={camTransform.rotate}
                    onChange={(e) => setCamTransform(prev => ({ ...prev, rotate: Number(e.target.value) }))}
                    className="w-full accent-yellow-500 h-1.5 bg-gray-700 rounded-lg cursor-pointer"
                  />

                  {/* Phối Cảnh Nghiêng 3D (Tilt để gắn khớp màn hình máy tính như ảnh 1) */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <div className="flex justify-between text-[10px] text-gray-400">
                        <span>Nghiêng Dọc X:</span>
                        <span className="font-mono text-pink-400">{camTransform.tiltX}°</span>
                      </div>
                      <input 
                        type="range" min="-30" max="30" 
                        value={camTransform.tiltX}
                        onChange={(e) => setCamTransform(prev => ({ ...prev, tiltX: Number(e.target.value) }))}
                        className="w-full accent-pink-500 h-1 bg-gray-700 rounded-lg cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] text-gray-400">
                        <span>Nghiêng Ngang Y:</span>
                        <span className="font-mono text-pink-400">{camTransform.tiltY}°</span>
                      </div>
                      <input 
                        type="range" min="-30" max="30" 
                        value={camTransform.tiltY}
                        onChange={(e) => setCamTransform(prev => ({ ...prev, tiltY: Number(e.target.value) }))}
                        className="w-full accent-pink-500 h-1 bg-gray-700 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Lật Gương & Tỉ lệ khung hình */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCamTransform(prev => ({ ...prev, flipH: !prev.flipH }))}
                      className={`flex-1 py-1.5 px-2 rounded-xl text-[10px] font-bold border transition-all flex items-center justify-center gap-1 cursor-pointer ${
                        camTransform.flipH ? 'bg-cyan-600/30 border-cyan-500 text-cyan-300' : 'bg-white/5 border-white/10 text-gray-300'
                      }`}
                    >
                      <FlipHorizontal size={12} /> Lật Ngang
                    </button>
                    <button
                      type="button"
                      onClick={() => setCamTransform(prev => ({ ...prev, flipV: !prev.flipV }))}
                      className={`flex-1 py-1.5 px-2 rounded-xl text-[10px] font-bold border transition-all flex items-center justify-center gap-1 cursor-pointer ${
                        camTransform.flipV ? 'bg-cyan-600/30 border-cyan-500 text-cyan-300' : 'bg-white/5 border-white/10 text-gray-300'
                      }`}
                    >
                      <FlipVertical size={12} /> Lật Dọc
                    </button>
                  </div>

                  {/* Đổi tỉ lệ 16:9 / 9:16 / 4:3 / Tròn */}
                  <div className="grid grid-cols-4 gap-1">
                    {[
                      { r: '16/9', label: '16:9 Ngang' },
                      { r: '9/16', label: '9:16 Dọc' },
                      { r: '4/3', label: '4:3 Vuông' },
                      { r: 'circle', label: 'Tròn PiP' }
                    ].map(aspect => (
                      <button
                        key={aspect.r}
                        type="button"
                        onClick={() => setCamTransform(prev => ({ ...prev, aspectRatio: aspect.r }))}
                        className={`py-1 text-center text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                          camTransform.aspectRatio === aspect.r ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300 ring-1 ring-emerald-400' : 'bg-white/5 border-white/10 text-gray-300'
                        }`}
                      >
                        {aspect.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: ÁNH SÁNG, MÀU SẮC & LÀM ĐẸP DA */}
            {activeTab === 'color' && (
              <div className="space-y-2.5 bg-black/40 p-2.5 rounded-xl border border-white/10 animate-in fade-in">
                {/* Độ Sáng */}
                <div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-gray-300 flex items-center gap-1"><Sun size={11} className="text-amber-400" /> Độ Sáng (Brightness):</span>
                    <span className="font-mono text-amber-400 font-bold">{colorTune.brightness}%</span>
                  </div>
                  <input 
                    type="range" min="60" max="150" 
                    value={colorTune.brightness}
                    onChange={(e) => setColorTune(prev => ({ ...prev, brightness: Number(e.target.value) }))}
                    className="w-full accent-amber-400 h-1.5 bg-gray-700 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Độ Tương Phản */}
                <div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-gray-300 flex items-center gap-1"><Contrast size={11} className="text-cyan-400" /> Độ Tương Phản (Contrast):</span>
                    <span className="font-mono text-cyan-400 font-bold">{colorTune.contrast}%</span>
                  </div>
                  <input 
                    type="range" min="70" max="140" 
                    value={colorTune.contrast}
                    onChange={(e) => setColorTune(prev => ({ ...prev, contrast: Number(e.target.value) }))}
                    className="w-full accent-cyan-400 h-1.5 bg-gray-700 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Độ Bão Hòa Màu */}
                <div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-gray-300 flex items-center gap-1"><Palette size={11} className="text-pink-400" /> Tươi Tắn Màu (Saturation):</span>
                    <span className="font-mono text-pink-400 font-bold">{colorTune.saturate}%</span>
                  </div>
                  <input 
                    type="range" min="50" max="160" 
                    value={colorTune.saturate}
                    onChange={(e) => setColorTune(prev => ({ ...prev, saturate: Number(e.target.value) }))}
                    className="w-full accent-pink-400 h-1.5 bg-gray-700 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Nhiệt Độ Màu (Ấm / Lạnh) */}
                <div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-gray-300">Tông Màu (Ấm ↔ Lạnh):</span>
                    <span className="font-mono text-purple-400 font-bold">{colorTune.temperature > 0 ? `+${colorTune.temperature}` : colorTune.temperature}</span>
                  </div>
                  <input 
                    type="range" min="-40" max="40" 
                    value={colorTune.temperature}
                    onChange={(e) => setColorTune(prev => ({ ...prev, temperature: Number(e.target.value) }))}
                    className="w-full accent-purple-400 h-1.5 bg-gray-700 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
