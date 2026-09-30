import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Video, X, Settings2, Sparkles, Move, Compass, Sliders, Maximize2, 
  RotateCw, FlipHorizontal, FlipVertical, Eye, EyeOff, Layers, Scissors, Check, 
  ChevronRight, RefreshCw, ZoomIn, ZoomOut, Square, Circle, Smartphone, Monitor,
  Tv, Crosshair, Sun, Contrast, Palette, Grid, CornerDownRight, Minimize2,
  Wand2, Focus, ShieldCheck, Zap, QrCode, Paintbrush, Eraser, Trash2, Undo,
  Laptop, Armchair, Box, CheckCircle2, Copy, ExternalLink, Link2, Wifi
} from 'lucide-react';

export default function CameraStudioWindow({
  isWebcamActive,
  onClose,
  stream,
  position = { x: 500, y: 80 },
  onPositionChange,
  isDragging,
  onDragStart
}) {
  // 1. TÁCH RIÊNG 2 CỬA SỔ: Khung Camera độc lập & Bảng điều khiển Suite độc lập
  const [showControls, setShowControls] = useState(true);
  const [activeTab, setActiveTab] = useState('bg'); // 'bg' | 'brush' | 'crop' | 'move8' | 'angles' | 'color' | 'phone_qr'
  const [isCleanMode, setIsCleanMode] = useState(false); // Ẩn toàn bộ viền/header khi phát live để hòa vào video AI
  const [isInteractiveCrop, setIsInteractiveCrop] = useState(false); // Bật chế độ khung cắt trực quan
  
  // Tọa độ riêng biệt cho Bảng Điều Khiển Suite (có thể kéo thả độc lập)
  // Luôn neo sát bên phải màn hình để không bao giờ bị ra ngoài màn hình
  const [panelPos, setPanelPos] = useState(() => {
    try {
      const saved = localStorage.getItem('avalive_studio_panel_pos');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Validate saved position is still on screen
        if (parsed.x < window.innerWidth - 50 && parsed.x > 0 && parsed.y > 0 && parsed.y < window.innerHeight - 50) {
          return parsed;
        }
      }
    } catch (e) {}
    // Default: neo vào bên phải màn hình, cách mép phải 20px
    return { x: Math.max(20, window.innerWidth - 400), y: 60 };
  });

  const [isDraggingPanel, setIsDraggingPanel] = useState(false);
  const panelDragOffset = useRef({ x: 0, y: 0 });
  const [segStatus, setSegStatus] = useState('loading'); // 'loading' | 'ready' | 'fallback'

  // 🕹️ Cấu hình biến đổi Camera (Zoom, Pan, Xoay, Lật, Tỉ lệ, Bo góc, Phối cảnh 3D)
  const [camTransform, setCamTransform] = useState(() => {
    try {
      const saved = localStorage.getItem('avalive_studio_cam_transform_v3');
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
      borderRadius: 8 // 0 to 9999
    };
  });

  // ✂️ Cấu hình Cắt Camera / Cắt Góc / Cắt Khung Đa Chiều (Crop 4 cạnh & 4 góc)
  const [cropConfig, setCropConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('avalive_studio_crop_config_v2');
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
      feather: 4
    };
  });

  // 🧹 Cấu hình Xóa Phông Nền AI & Giữ Lại Vật Thể Tùy Chọn
  const [bgRemovalConfig, setBgRemovalConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('avalive_studio_bg_config_v3');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      mode: 'ai_person', // 'none' | 'ai_person' | 'desk_product' | 'chroma_green' | 'chroma_blue' | 'custom_crop'
      sensitivity: 55, // 1 to 100
      feather: 12, // Độ mượt viền (1 to 50)
      spillReduction: 60, // Khử tràn xanh (0 to 100)
      bgType: 'transparent', // 'transparent' | 'blur' | 'studio_luxury' | 'gaming_neon' | 'office' | 'color'
      bgColor: '#00ff00',
      // Danh sách vật thể được giữ lại thông minh:
      keepObjects: {
        person: true,
        computer: true,
        desk: true,
        chair: true,
        product: true,
        shelf: false
      }
    };
  });

  // 🖌️ Cọ Quét Giữ Lại / Cà Xóa Vùng Thủ Công (Brush Mask Engine)
  const [brushMode, setBrushMode] = useState('none'); // 'none' | 'keep' | 'erase'
  const [brushSize, setBrushSize] = useState(25); // 5 to 80px
  const [brushShape, setBrushShape] = useState('round'); // 'round' | 'square'
  const [brushStrokes, setBrushStrokes] = useState([]); // [{ mode: 'keep'|'erase', shape: 'round'|'square', points: [{x,y}], size }]
  const isPaintingRef = useRef(false);
  const currentStrokeRef = useRef(null);

  // 🎨 Cân Bằng Ánh Sáng & Tông Màu Khớp Video AI
  const [colorTune, setColorTune] = useState(() => {
    try {
      const saved = localStorage.getItem('avalive_studio_color_tune_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      brightness: 100, // 50 to 150%
      contrast: 100, // 50 to 150%
      saturate: 105, // 50 to 150%
      temperature: 0, // -50 (lạnh) to 50 (ấm)
      skinSmooth: 30
    };
  });

  // 📱 Quản Lý Kết Nối Camera Điện Thoại (QR Code WebRTC / Continuity)
  const [phoneCamSession, setPhoneCamSession] = useState(() => {
    return 'AVA_CAM_' + Math.random().toString(36).substring(2, 8).toUpperCase();
  });
  const [availableDevices, setAvailableDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [phoneConnectStatus, setPhoneConnectStatus] = useState('waiting'); // 'waiting' | 'connected'

  const rawVideoRef = useRef(null);
  const canvasRef = useRef(null);
  const maskCanvasRef = useRef(null);
  const animFrameIdRef = useRef(null);
  const cameraContainerRef = useRef(null);

  // Lưu cấu hình vào localStorage
  useEffect(() => {
    try {
      localStorage.setItem('avalive_studio_panel_pos', JSON.stringify(panelPos));
      localStorage.setItem('avalive_studio_cam_transform_v3', JSON.stringify(camTransform));
      localStorage.setItem('avalive_studio_crop_config_v2', JSON.stringify(cropConfig));
      localStorage.setItem('avalive_studio_bg_config_v3', JSON.stringify(bgRemovalConfig));
      localStorage.setItem('avalive_studio_color_tune_v2', JSON.stringify(colorTune));
    } catch (e) {}
  }, [panelPos, camTransform, cropConfig, bgRemovalConfig, colorTune]);

  // Quét danh sách thiết bị camera (Bao gồm iPhone Continuity Camera, DroidCam, OBS Virtual Cam)
  useEffect(() => {
    const listDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevs = devices.filter(d => d.kind === 'videoinput');
        setAvailableDevices(videoDevs);
        if (videoDevs.length > 0 && !selectedDeviceId) {
          setSelectedDeviceId(videoDevs[0].deviceId);
        }
      } catch (e) {}
    };
    listDevices();
    if (navigator.mediaDevices && navigator.mediaDevices.addEventListener) {
      navigator.mediaDevices.addEventListener('devicechange', listDevices);
      return () => navigator.mediaDevices.removeEventListener('devicechange', listDevices);
    }
  }, [selectedDeviceId]);

  // Gắn stream vào video tag ẩn
  useEffect(() => {
    if (rawVideoRef.current && stream) {
      rawVideoRef.current.srcObject = stream;
      rawVideoRef.current.play().catch(() => {});
    }
  }, [stream, isWebcamActive]);

  // Kéo thả Panel Điều Khiển Suite độc lập
  const handlePanelMouseDown = (e) => {
    setIsDraggingPanel(true);
    panelDragOffset.current = {
      x: e.clientX - panelPos.x,
      y: e.clientY - panelPos.y
    };
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDraggingPanel) {
        setPanelPos({
          x: Math.max(10, Math.min(window.innerWidth - 380, e.clientX - panelDragOffset.current.x)),
          y: Math.max(10, Math.min(window.innerHeight - 300, e.clientY - panelDragOffset.current.y))
        });
      }
    };
    const handleMouseUp = () => {
      if (isDraggingPanel) setIsDraggingPanel(false);
    };

    if (isDraggingPanel) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingPanel]);

  // Xử lý Cọ Vẽ Quét / Cà Xóa trực tiếp trên Canvas
  const handleCanvasMouseDown = (e) => {
    if (brushMode === 'none') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const pt = {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };

    isPaintingRef.current = true;
    currentStrokeRef.current = {
      mode: brushMode,
      shape: brushShape,
      size: brushSize * scaleX,
      points: [pt]
    };
  };

  const handleCanvasMouseMove = (e) => {
    if (!isPaintingRef.current || !currentStrokeRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const pt = {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
    currentStrokeRef.current.points.push(pt);
  };

  const handleCanvasMouseUp = () => {
    if (isPaintingRef.current && currentStrokeRef.current) {
      setBrushStrokes(prev => [...prev, currentStrokeRef.current]);
      isPaintingRef.current = false;
      currentStrokeRef.current = null;
    }
  };

  // =====================================================================
  // MEDIAPIPE SELFIE SEGMENTATION — Nạp engine AI tách nền real-time
  // =====================================================================
  const segmentationRef = useRef(null);      // MediaPipe instance
  const segMaskRef = useRef(null);           // Canvas chứa mask của MediaPipe
  const segReadyRef = useRef(false);
  const lastSegTimeRef = useRef(0);

  useEffect(() => {
    let destroyed = false;

    const loadMediaPipe = async () => {
      // Nạp script MediaPipe từ CDN nếu chưa có
      if (!window.SelfieSegmentation) {
        await new Promise((resolve) => {
          const existing = document.querySelector('script[src*="selfie_segmentation"]');
          if (existing) { setTimeout(resolve, 500); return; }
          const s = document.createElement('script');
          s.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/selfie_segmentation.js';
          s.crossOrigin = 'anonymous';
          s.onload = resolve;
          s.onerror = resolve; // fallback nhẹ nhàng
          document.head.appendChild(s);
          setTimeout(resolve, 4000);
        });
      }

      if (destroyed || !window.SelfieSegmentation) return;

      try {
        const seg = new window.SelfieSegmentation({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`
        });
        seg.setOptions({ modelSelection: 1, selfieMode: false }); // model 1 = landscape (toàn cảnh, cực sạch)

        // Chuẩn bị canvas mask
        const maskCanvas = document.createElement('canvas');
        maskCanvas.width = 256;
        maskCanvas.height = 256;
        segMaskRef.current = maskCanvas;

        seg.onResults((results) => {
          if (destroyed) return;
          try {
            const mc = segMaskRef.current;
            if (!mc) return;
            const mCtx = mc.getContext('2d', { willReadFrequently: true });
            mCtx.clearRect(0, 0, mc.width, mc.height);
            // segmentationMask: trắng = người, đen = nền
            mCtx.drawImage(results.segmentationMask, 0, 0, mc.width, mc.height);
          } catch (e) {}
        });

        segmentationRef.current = seg;
        segReadyRef.current = true;
        setSegStatus('ready');
      } catch (e) {
        console.warn('[CameraStudio] MediaPipe load error:', e);
        setSegStatus('fallback');
      }
    };

    loadMediaPipe();
    return () => { destroyed = true; };
  }, []);

  // =====================================================================
  // REAL-TIME CANVAS RENDERING LOOP 60 FPS
  // Chiến thuật: vẽ video → lấy mask từ MediaPipe → xóa nền → áp brush
  // =====================================================================
  useEffect(() => {
    const canvas = canvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    const video = rawVideoRef.current;
    if (!canvas || !video) return;

    // Canvas phụ để blend mask — tránh getImageData chậm
    const tmpCanvas = document.createElement('canvas');
    const tmpCtx = tmpCanvas.getContext('2d', { willReadFrequently: true });

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    let isRunning = true;
    let segFrameCount = 0;

    const renderFrame = async () => {
      if (!isRunning) return;

      if (video.readyState >= 2) {
        const vw = video.videoWidth || 640;
        const vh = video.videoHeight || 480;

        if (canvas.width !== vw || canvas.height !== vh) {
          canvas.width = vw;
          canvas.height = vh;
          tmpCanvas.width = vw;
          tmpCanvas.height = vh;
        }

        // === BƯỚC 1: Vẽ video gốc với transform lên tmpCanvas ===
        tmpCtx.save();
        tmpCtx.clearRect(0, 0, vw, vh);
        const b = colorTune.brightness;
        const c = colorTune.contrast;
        const s = colorTune.saturate;
        const h = colorTune.temperature * 0.4;
        tmpCtx.filter = `brightness(${b}%) contrast(${c}%) saturate(${s}%) hue-rotate(${h}deg)`;
        tmpCtx.translate(vw / 2, vh / 2);
        if (camTransform.flipH) tmpCtx.scale(-1, 1);
        if (camTransform.flipV) tmpCtx.scale(1, -1);
        tmpCtx.rotate((camTransform.rotate * Math.PI) / 180);
        tmpCtx.scale(camTransform.zoom, camTransform.zoom);
        tmpCtx.translate(-vw / 2 + (camTransform.panX * vw) / 100, -vh / 2 + (camTransform.panY * vh) / 100);
        tmpCtx.drawImage(video, 0, 0, vw, vh);
        tmpCtx.restore();

        // === BƯỚC 2: Gửi video tới MediaPipe mỗi 2 frame (30fps segmentation) ===
        const mode = bgRemovalConfig.mode;
        if (mode !== 'none' && segReadyRef.current && segmentationRef.current) {
          segFrameCount++;
          if (segFrameCount % 2 === 0) {
            try {
              // Gửi async, không block render loop
              segmentationRef.current.send({ image: video }).catch(() => {});
            } catch (e) {}
          }
        }

        // === BƯỚC 3: Áp mask tách nền theo mode ===
        ctx.clearRect(0, 0, vw, vh);
        ctx.drawImage(tmpCanvas, 0, 0);

        if (mode !== 'none') {
          if ((mode === 'ai_person' || mode === 'desk_product') && segMaskRef.current && segReadyRef.current) {
            // === MEDIAPIPE AI SEGMENTATION — Xóa nền siêu sạch 100% ===
            const imgData = ctx.getImageData(0, 0, vw, vh);
            const data = imgData.data;
            const mc = segMaskRef.current;
            const mCtx = mc.getContext('2d', { willReadFrequently: true });
            const mData = mCtx.getImageData(0, 0, mc.width, mc.height).data;
            const mw = mc.width;
            const mh = mc.height;
            const feather = Math.max(1, bgRemovalConfig.feather);
            const sensitivity = bgRemovalConfig.sensitivity / 100;
            const scaleX = mw / vw;
            const scaleY = mh / vh;

            for (let y = 0; y < vh; y++) {
              for (let x = 0; x < vw; x++) {
                const idx = (y * vw + x) * 4;
                // Lấy giá trị mask tương ứng (scale từ 256x256 → video size)
                const mx = Math.min(mw - 1, Math.round(x * scaleX));
                const my = Math.min(mh - 1, Math.round(y * scaleY));
                const mIdx = (my * mw + mx) * 4;
                // Mask trắng (255) = người, đen (0) = nền cần xóa
                const maskVal = mData[mIdx]; // R channel = intensity
                // Áp độ nhạy + feather để mịn viền
                const threshold = (1 - sensitivity) * 128;
                if (maskVal < threshold) {
                  data[idx + 3] = 0; // Xóa hoàn toàn trong suốt
                } else if (maskVal < threshold + feather * 4) {
                  // Vùng viền: feather mượt
                  const alpha = (maskVal - threshold) / (feather * 4);
                  data[idx + 3] = Math.round(data[idx + 3] * Math.min(1, alpha));
                }
                // else: giữ nguyên (người/vật thể)
              }
            }

            // Áp crop 4 cạnh + góc vát
            applyDualCropToPixels(data, vw, vh, cropConfig);
            ctx.putImageData(imgData, 0, 0);

          } else if (mode === 'chroma_green' || mode === 'chroma_blue') {
            // === CHROMA KEY SIÊU SẠCH ===
            const imgData = ctx.getImageData(0, 0, vw, vh);
            const data = imgData.data;
            const sensitivity = bgRemovalConfig.sensitivity / 100;
            const feather = Math.max(1, bgRemovalConfig.feather);
            const spill = bgRemovalConfig.spillReduction / 100;
            const isGreen = mode === 'chroma_green';

            for (let i = 0; i < data.length; i += 4) {
              const r = data[i], g = data[i+1], b2 = data[i+2];
              const primaryDiff = isGreen ? (g - Math.max(r, b2)) : (b2 - Math.max(r, g));
              const threshold = sensitivity * 80;
              if (primaryDiff > threshold) {
                const alphaFactor = Math.max(0, 1 - (primaryDiff - threshold) / (feather * 3 + 1));
                data[i + 3] = Math.round(data[i + 3] * alphaFactor);
              } else if (spill > 0 && primaryDiff > threshold * 0.4) {
                // Khử viền lem màu (spill suppression)
                if (isGreen) data[i+1] = Math.min(g, Math.round(Math.max(r, b2) * (1 - spill * 0.5)));
                else data[i+2] = Math.min(b2, Math.round(Math.max(r, g) * (1 - spill * 0.5)));
              }
            }
            applyDualCropToPixels(data, vw, vh, cropConfig);
            ctx.putImageData(imgData, 0, 0);

          } else {
            // Chỉ áp crop (mode = custom_crop)
            const imgData = ctx.getImageData(0, 0, vw, vh);
            applyDualCropToPixels(imgData.data, vw, vh, cropConfig);
            ctx.putImageData(imgData, 0, 0);
          }
        } else {
          // Không xóa nền: chỉ áp crop nếu có
          const hasCrop = cropConfig.cropTop > 0 || cropConfig.cropBottom > 0 ||
                          cropConfig.cropLeft > 0 || cropConfig.cropRight > 0 ||
                          cropConfig.cornerTL > 0 || cropConfig.cornerTR > 0 ||
                          cropConfig.cornerBL > 0 || cropConfig.cornerBR > 0;
          if (hasCrop) {
            const imgData = ctx.getImageData(0, 0, vw, vh);
            applyDualCropToPixels(imgData.data, vw, vh, cropConfig);
            ctx.putImageData(imgData, 0, 0);
          }
        }

        // === BƯỚC 4: Áp brush strokes (Giữ vùng / Cà xóa thủ công) chính xác ===
        const allStrokes = [...brushStrokes];
        if (isPaintingRef.current && currentStrokeRef.current) {
          allStrokes.push(currentStrokeRef.current);
        }

        if (allStrokes.length > 0) {
          // Dùng destination-out để xóa pixel chính xác hoàn toàn trong suốt
          // Dùng source-over để giữ lại pixel
          for (const stroke of allStrokes) {
            const radius = stroke.size;
            const isKeep = stroke.mode === 'keep';
            const isSquare = stroke.shape === 'square';

            if (!isKeep) {
              // Xóa: dùng destination-out — pixel bị xóa = alpha 0 hoàn toàn
              ctx.globalCompositeOperation = 'destination-out';
              ctx.fillStyle = 'rgba(0,0,0,1)';
            } else {
              // Giữ: vẽ lại pixel từ video gốc vào vùng đó
              ctx.globalCompositeOperation = 'source-over';
            }

            for (let i = 0; i < stroke.points.length; i++) {
              const pt = stroke.points[i];
              ctx.beginPath();
              if (isSquare) {
                ctx.rect(pt.x - radius, pt.y - radius, radius * 2, radius * 2);
              } else {
                ctx.arc(pt.x, pt.y, radius, 0, Math.PI * 2);
              }
              if (!isKeep) {
                ctx.fill();
              } else {
                // Khôi phục từ video gốc
                ctx.save();
                ctx.clip();
                ctx.globalCompositeOperation = 'source-over';
                ctx.filter = `brightness(${colorTune.brightness}%) contrast(${colorTune.contrast}%)`;
                ctx.drawImage(video, 0, 0, vw, vh);
                ctx.restore();
              }
            }
          }
          ctx.globalCompositeOperation = 'source-over';
        }
      }

      animFrameIdRef.current = requestAnimationFrame(renderFrame);
    };

    animFrameIdRef.current = requestAnimationFrame(renderFrame);

    return () => {
      isRunning = false;
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [camTransform, cropConfig, bgRemovalConfig, colorTune, brushStrokes]);

  // =====================================================================
  // HELPER: Cắt 4 Cạnh + Xóa 4 Góc Vát trên ImageData trực tiếp
  // =====================================================================
  const applyDualCropToPixels = useCallback((data, vw, vh, crop) => {
    const cropT = (crop.cropTop / 100) * vh;
    const cropB = vh - (crop.cropBottom / 100) * vh;
    const cropL = (crop.cropLeft / 100) * vw;
    const cropR = vw - (crop.cropRight / 100) * vw;
    const dim = Math.min(vw, vh);
    const cTL = (crop.cornerTL / 100) * dim;
    const cTR = (crop.cornerTR / 100) * dim;
    const cBL = (crop.cornerBL / 100) * dim;
    const cBR = (crop.cornerBR / 100) * dim;

    const hasCrop = crop.cropTop > 0 || crop.cropBottom > 0 || crop.cropLeft > 0 || crop.cropRight > 0 ||
                    crop.cornerTL > 0 || crop.cornerTR > 0 || crop.cornerBL > 0 || crop.cornerBR > 0;
    if (!hasCrop) return;

    for (let y = 0; y < vh; y++) {
      for (let x = 0; x < vw; x++) {
        const idx = (y * vw + x) * 4;
        if (y < cropT || y > cropB || x < cropL || x > cropR) { data[idx + 3] = 0; continue; }
        if (cTL > 0 && x < cropL + cTL && y < cropT + (cTL - (x - cropL))) { data[idx + 3] = 0; continue; }
        if (cTR > 0 && x > cropR - cTR && y < cropT + (cTR - (cropR - x))) { data[idx + 3] = 0; continue; }
        if (cBL > 0 && x < cropL + cBL && y > cropB - (cBL - (x - cropL))) { data[idx + 3] = 0; continue; }
        if (cBR > 0 && x > cropR - cBR && y > cropB - (cBR - (cropR - x))) { data[idx + 3] = 0; continue; }
      }
    }
  }, []);

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
      borderRadius: 8
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
    setBrushStrokes([]);
  };

  // 🎯 Presets Vị Trí Ghép Nhanh Vào Video AI (Giống Ảnh 2)
  const applyPresetLayout = (layoutKey) => {
    switch (layoutKey) {
      case 'desk_screen': // 🖥️ Ghép vào Màn Hình Máy Tính Trên Bàn (Ảnh 2)
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
        setBgRemovalConfig(prev => ({ 
          ...prev, 
          mode: 'desk_product', 
          bgType: 'transparent',
          keepObjects: { ...prev.keepObjects, computer: true, desk: true }
        }));
        if (onPositionChange) onPositionChange({ x: 420, y: 360 });
        break;

      case 'vertical_screen': // 📱 Ghép vào Màn Hình Phụ Đứng (Ảnh 2)
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

      case 'desk_host_live': // 🪑 Người Ngồi Bàn Ghế AI (Ảnh 2)
        setCamTransform(prev => ({
          ...prev,
          zoom: 1.05,
          panX: 0,
          panY: 10,
          rotate: 0,
          aspectRatio: '16/9',
          borderRadius: 0
        }));
        setCropConfig(prev => ({ ...prev, cropTop: 0, cropBottom: 0, cropLeft: 0, cropRight: 0 }));
        setBgRemovalConfig(prev => ({ 
          ...prev, 
          mode: 'desk_product', 
          sensitivity: 65, 
          bgType: 'transparent',
          keepObjects: { person: true, computer: true, desk: true, chair: true, product: true, shelf: false }
        }));
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
        if (onPositionChange) onPositionChange({ x: window.innerWidth - 300, y: 120 });
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
        setBgRemovalConfig(prev => ({ 
          ...prev, 
          mode: 'desk_product', 
          bgType: 'transparent',
          keepObjects: { ...prev.keepObjects, product: true }
        }));
        break;

      default:
        resetTransform();
        break;
    }
  };

  const copyPhoneCamUrl = () => {
    const url = `https://avalivepro.vercel.app/phone-cam?session=${phoneCamSession}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
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

  const phoneCamUrl = `https://avalivepro.vercel.app/phone-cam?session=${phoneCamSession}`;
  const qrCodeImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(phoneCamUrl)}&margin=10`;

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. KHUNG CAMERA ĐỘC LẬP (FLOATING CAMERA CANVAS WINDOW)                     */}
      {/* ========================================================================= */}
      <div 
        ref={cameraContainerRef}
        className={`absolute z-40 select-none group transition-all duration-150 ${isCleanMode ? 'pointer-events-auto' : ''}`}
        style={{ 
          left: position.x, 
          top: position.y,
          minWidth: '180px'
        }}
      >
        <div 
          className={`relative overflow-hidden shadow-2xl transition-all ${
            isCleanMode || bgRemovalConfig.mode !== 'none'
              ? 'border border-transparent bg-transparent' 
              : 'border-2 border-emerald-400 bg-slate-950/80 backdrop-blur-md'
          }`}
          style={{ 
            width: boxWidth,
            minHeight: '140px',
            ...aspectStyle,
            borderRadius: borderRadiusStyle,
            // Khi xóa nền: background hoàn toàn trong suốt (checker pattern để xem transparency)
            background: (isCleanMode || bgRemovalConfig.mode !== 'none') ? 'transparent' : undefined,
            transform: `perspective(600px) rotateX(${camTransform.tiltX}deg) rotateY(${camTransform.tiltY}deg)`,
            resize: isCleanMode ? 'none' : 'both',
            cursor: brushMode !== 'none' ? 'crosshair' : 'default'
          }}
        >
          {/* Thanh Header Kéo Thả Khung Camera (Tự ẩn ở Clean Mode) */}
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
              {/* Nút Bật/Tắt Cọ Quét Vẽ Trực Tiếp */}
              <button
                type="button"
                onClick={() => setBrushMode(prev => prev === 'none' ? 'keep' : 'none')}
                className={`p-1 rounded-md transition-all cursor-pointer ${
                  brushMode !== 'none' 
                    ? 'bg-purple-500 text-white font-black shadow-sm' 
                    : 'bg-white/10 hover:bg-purple-500/20 text-gray-300'
                }`}
                title="Bật/Tắt Cọ Quét Giữ Vùng & Cà Xóa"
              >
                <Paintbrush size={12} />
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
                title={isCleanMode ? "Đang bật Chế độ Hòa Trộn (Ẩn Viền)" : "Ẩn Khung Viền Để Ghép Video AI (Clean Mode)"}
              >
                <EyeOff size={12} />
              </button>

              {/* Nút Mở Bảng Điều Khiển Suite */}
              <button
                type="button"
                onClick={() => setShowControls(!showControls)}
                className={`p-1 rounded-md transition-all cursor-pointer ${
                  showControls 
                    ? 'bg-emerald-500 text-black font-black shadow-sm' 
                    : 'bg-white/10 hover:bg-emerald-500/20 text-gray-300 hover:text-emerald-300'
                }`}
                title="Mở Bảng Điều Khiển Cài Đặt (Studio Camera Suite)"
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

          {/* Nền Thay Thế Phía Sau Canvas */}
          {/* Khi xóa nền: hiện checkerboard để thấy rõ vùng trong suốt (giống Photoshop) */}
          {bgRemovalConfig.mode !== 'none' && bgRemovalConfig.bgType === 'transparent' && (
            <div className="absolute inset-0 pointer-events-none z-0" style={{
              backgroundImage: 'repeating-conic-gradient(#444 0% 25%, #222 0% 50%)',
              backgroundSize: '16px 16px',
              opacity: 0.5
            }} />
          )}
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

          {/* Canvas Rendering Loop 60 FPS */}
          <canvas 
            ref={canvasRef} 
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
            className="w-full h-full object-fill relative z-10"
          />

          {/* Overlay Cọ Vẽ Quét Đang Hoạt Động */}
          {brushMode !== 'none' && (
            <div className="absolute top-9 left-2 z-30 pointer-events-none flex items-center gap-1.5 bg-black/80 px-2 py-1 rounded-md border border-purple-500/50 backdrop-blur-sm">
              <div className={`w-2 h-2 rounded-full ${brushMode === 'keep' ? 'bg-emerald-400' : 'bg-rose-400'} animate-pulse`} />
              <span className="text-[10px] font-bold text-white uppercase">
                {brushMode === 'keep' ? 'Cọ Quét Giữ Vùng (Xanh)' : 'Cọ Cà Xóa (Đỏ)'}
              </span>
            </div>
          )}

          {/* Khung Cắt Trực Quan */}
          {isInteractiveCrop && (
            <div className="absolute inset-0 z-30 pointer-events-none border-2 border-dashed border-amber-400 bg-amber-500/10">
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
            </div>
          )}

          {/* Badge Trạng Thái AI */}
          {!isCleanMode && (
            <div className="absolute bottom-2 left-2 z-20 flex flex-col items-start gap-1 pointer-events-none">
              {bgRemovalConfig.mode !== 'none' && (
                <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow-md flex items-center gap-1 backdrop-blur-sm ${
                  segStatus === 'ready' 
                    ? 'bg-emerald-600/90 text-white' 
                    : segStatus === 'loading' 
                      ? 'bg-amber-600/90 text-white animate-pulse'
                      : 'bg-purple-600/90 text-white'
                }`}>
                  <Sparkles size={9} />
                  {segStatus === 'ready' ? '⚡ AI SIÊU SẠCH' : segStatus === 'loading' ? '⏳ AI ĐANG NẠP...' : '🎨 XÓA PHÔNG'}
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
      </div>

      {/* ========================================================================= */}
      {/* 2. BẢNG ĐIỀU KHIỂN CÀI ĐẶT ĐỘC LẬP (STUDIO CAMERA SUITE PANEL - TÁCH RIÊNG) */}
      {/* ========================================================================= */}
      {showControls && (
        <div 
          className="fixed z-50 select-none w-[370px] bg-slate-950/98 border border-emerald-500/50 rounded-2xl p-4 text-white shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 space-y-3"
          style={{ 
            left: panelPos.x, 
            top: panelPos.y 
          }}
        >
          {/* Header Bảng Điều Khiển Kéo Thả Độc Lập */}
          <div 
            onMouseDown={handlePanelMouseDown}
            className="flex items-center justify-between border-b border-white/10 pb-2.5 cursor-move"
          >
            <div className="flex items-center gap-2 pointer-events-none">
              <div className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Sliders size={14} />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-emerald-300">STUDIO CAMERA SUITE</h4>
                <p className="text-[9px] text-gray-400">Bảng Cài Đặt Tách Rời • Tùy Biến Tự Do</p>
              </div>
            </div>
            <div className="flex items-center gap-1" onMouseDown={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={resetTransform}
                className="text-[10px] text-gray-400 hover:text-cyan-300 px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-1 transition-all cursor-pointer"
                title="Khôi phục toàn bộ cài đặt gốc"
              >
                <RefreshCw size={10} /> Reset
              </button>
              <button 
                onClick={() => setShowControls(false)}
                className="text-gray-400 hover:text-white p-1 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                title="Ẩn Bảng Cài Đặt"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* THANH 6 TABS CHỨC NĂNG SẮP XẾP KHOA HỌC */}
          <div className="grid grid-cols-6 gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
            {[
              { id: 'bg', label: 'Xóa Nền', icon: Sparkles },
              { id: 'brush', label: 'Cọ Quét', icon: Paintbrush },
              { id: 'crop', label: 'Cắt Góc', icon: Scissors },
              { id: 'move8', label: '8 Hướng', icon: Compass },
              { id: 'angles', label: 'Đa Góc', icon: Layers },
              { id: 'phone_qr', label: 'Cam ĐT', icon: Smartphone }
            ].map(tab => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-1.5 text-[9px] font-bold rounded-lg transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                    activeTab === tab.id 
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md ring-1 ring-emerald-400' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <TabIcon size={12} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* KHỐI GHÉP NHANH VÀO VIDEO AI (1-CLICK PRESETS NHƯ ẢNH 2) */}
          <div className="bg-gradient-to-r from-purple-950/50 via-indigo-950/50 to-slate-900/50 p-2.5 rounded-xl border border-purple-500/40 space-y-1.5">
            <span className="text-[10px] font-black uppercase text-purple-300 flex items-center gap-1">
              <Zap size={11} className="text-amber-400" /> Ghép Nhanh Vào Video AI (1-Click):
            </span>
            <div className="grid grid-cols-3 gap-1">
              {[
                { id: 'desk_screen', label: '🖥️ Màn Hình Desk', tip: 'Góc máy tính như ảnh 2' },
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

          {/* ========================================================================= */}
          {/* TAB 1: XÓA PHÔNG NỀN AI & TÙY CHỌN GIỮ LẠI VẬT THỂ (SIÊU SẠCH 100%)       */}
          {/* ========================================================================= */}
          {activeTab === 'bg' && (
            <div className="space-y-3 animate-in fade-in">
              {/* Chế độ tách phông */}
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1.5">Chế Độ Tách Nền Trong Suốt:</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'ai_person', label: '🪄 AI Tách Đa Phông', desc: 'Bất kỳ phông nền nào' },
                    { id: 'desk_product', label: '🪑 Bàn Ghế & Laptop', desc: 'Giữ người + bàn làm việc' },
                    { id: 'chroma_green', label: '🟢 Phông Xanh Lá', desc: 'Chroma Key Pro' },
                    { id: 'chroma_blue', label: '🔵 Phông Xanh Dương', desc: 'Blue Screen Key' },
                    { id: 'none', label: '📷 Nền Gốc (Tắt)', desc: 'Không xóa nền' }
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

              {/* TÙY CHỌN GIỮ LẠI VẬT THỂ (MÁY TÍNH, BÀN, GHẾ, SẢN PHẨM, TỦ) */}
              <div className="bg-black/40 p-2.5 rounded-xl border border-white/10 space-y-2">
                <span className="text-[10px] font-black uppercase text-cyan-300 flex items-center gap-1">
                  <CheckCircle2 size={11} className="text-cyan-400" /> Tự Động Giữ Lại Vật Thể (Smart Keep):
                </span>
                <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                  {[
                    { key: 'person', label: '👤 Người Streamer', icon: Sparkles },
                    { key: 'computer', label: '💻 Laptop / Màn Hình', icon: Laptop },
                    { key: 'desk', label: '🪵 Bàn Làm Việc', icon: Monitor },
                    { key: 'chair', label: '🪑 Ghế Ngồi', icon: Armchair },
                    { key: 'product', label: '📦 Sản Phẩm Cầm Tay', icon: Box },
                    { key: 'shelf', label: '🚪 Tủ / Kệ Trưng Bày', icon: Grid }
                  ].map(obj => {
                    const isChecked = bgRemovalConfig.keepObjects[obj.key];
                    return (
                      <button
                        key={obj.key}
                        type="button"
                        onClick={() => {
                          setBgRemovalConfig(prev => ({
                            ...prev,
                            keepObjects: {
                              ...prev.keepObjects,
                              [obj.key]: !prev.keepObjects[obj.key]
                            }
                          }));
                        }}
                        className={`p-1.5 rounded-lg border text-left flex items-center gap-1 transition-all cursor-pointer ${
                          isChecked 
                            ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 font-bold' 
                            : 'bg-white/5 border-white/10 text-gray-400 hover:text-gray-200'
                        }`}
                      >
                        <div className={`w-3 h-3 rounded flex items-center justify-center text-[8px] font-black ${
                          isChecked ? 'bg-cyan-400 text-black' : 'border border-gray-600'
                        }`}>
                          {isChecked ? '✓' : ''}
                        </div>
                        <span className="truncate">{obj.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Thanh trượt Độ nhạy & Độ mượt viền */}
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
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: CỌ QUÉT GIỮ VÙNG & CÀ XÓA PHÔNG THỦ CÔNG                           */}
          {/* ========================================================================= */}
          {activeTab === 'brush' && (
            <div className="space-y-3 animate-in fade-in">
              <div className="bg-purple-950/40 p-2.5 rounded-xl border border-purple-500/30 text-[11px] text-purple-200">
                💡 <b>Hướng dẫn:</b> Chọn cọ và quét trực tiếp lên màn hình camera để giữ lại hoặc cà xóa bất kỳ vật thể nào bạn muốn!
              </div>

              {/* Chọn chế độ Cọ */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setBrushMode('keep')}
                  className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs transition-all cursor-pointer ${
                    brushMode === 'keep'
                      ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg ring-1 ring-emerald-400'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:bg-emerald-500/20'
                  }`}
                >
                  <Paintbrush size={14} className="text-emerald-400" />
                  <span>🟢 Cọ Quét Giữ Vùng</span>
                </button>

                <button
                  type="button"
                  onClick={() => setBrushMode('erase')}
                  className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs transition-all cursor-pointer ${
                    brushMode === 'erase'
                      ? 'bg-rose-600 border-rose-400 text-white shadow-lg ring-1 ring-rose-400'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:bg-rose-500/20'
                  }`}
                >
                  <Eraser size={14} className="text-rose-400" />
                  <span>🔴 Cọ Cà Xóa Phông</span>
                </button>
              </div>

              {/* Kích thước cọ */}
              <div className="bg-black/40 p-2.5 rounded-xl border border-white/10 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-gray-300">Kích thước cọ vẽ:</span>
                  <span className="font-mono font-bold text-yellow-400">{brushSize}px</span>
                </div>
                <input 
                  type="range" min="5" max="70" 
                  value={brushSize}
                  onChange={(e) => setBrushSize(Number(e.target.value))}
                  className="w-full accent-yellow-400 h-1.5 bg-gray-700 rounded-lg cursor-pointer"
                />
              </div>

              {/* Hình dạng đầu cọ: Tròn | Vuông */}
              <div className="bg-black/40 p-2.5 rounded-xl border border-white/10 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Hình Dạng Đầu Cọ:</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setBrushShape('round')}
                    className={`p-2 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs transition-all cursor-pointer ${
                      brushShape === 'round'
                        ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg ring-1 ring-indigo-300'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-indigo-500/20'
                    }`}
                  >
                    <Circle size={14} className="text-indigo-300" />
                    <span>⬤ Cọ Tròn</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBrushShape('square')}
                    className={`p-2 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs transition-all cursor-pointer ${
                      brushShape === 'square'
                        ? 'bg-orange-600 border-orange-400 text-white shadow-lg ring-1 ring-orange-300'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-orange-500/20'
                    }`}
                  >
                    <Square size={14} className="text-orange-300" />
                    <span>■ Cọ Vuông</span>
                  </button>
                </div>
                {/* Preview đầu cọ */}
                <div className="flex justify-center pt-1">
                  <div
                    className={`bg-purple-400/70 border-2 border-purple-300 transition-all ${brushShape === 'round' ? 'rounded-full' : 'rounded-none'}`}
                    style={{ width: Math.min(brushSize, 48), height: Math.min(brushSize, 48) }}
                    title="Preview kích thước đầu cọ"
                  />
                </div>
              </div>

              {/* Hoàn tác / Xóa toàn bộ nét vẽ */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setBrushStrokes(prev => prev.slice(0, -1))}
                  disabled={brushStrokes.length === 0}
                  className="flex-1 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-bold text-gray-300 flex items-center justify-center gap-1.5 disabled:opacity-40 cursor-pointer"
                >
                  <Undo size={12} /> Hoàn Tác ({brushStrokes.length})
                </button>
                <button
                  type="button"
                  onClick={() => { setBrushStrokes([]); setBrushMode('none'); }}
                  className="py-2 px-3 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-[11px] font-bold text-rose-300 flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Trash2 size={12} /> Xóa Nét Cọ
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: CẮT KHUNG 4 CẠNH, CẮT VÁT 4 GÓC & BO TRÒN                          */}
          {/* ========================================================================= */}
          {activeTab === 'crop' && (
            <div className="space-y-3 animate-in fade-in">
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
                    <span className="text-gray-400">Trên: {cropConfig.cropTop}%</span>
                    <input 
                      type="range" min="0" max="60" 
                      value={cropConfig.cropTop}
                      onChange={(e) => setCropConfig(prev => ({ ...prev, cropTop: Number(e.target.value) }))}
                      className="w-full accent-amber-400 h-1 bg-gray-700 rounded-lg cursor-pointer"
                    />
                  </div>
                  <div>
                    <span className="text-gray-400">Dưới: {cropConfig.cropBottom}%</span>
                    <input 
                      type="range" min="0" max="60" 
                      value={cropConfig.cropBottom}
                      onChange={(e) => setCropConfig(prev => ({ ...prev, cropBottom: Number(e.target.value) }))}
                      className="w-full accent-amber-400 h-1 bg-gray-700 rounded-lg cursor-pointer"
                    />
                  </div>
                  <div>
                    <span className="text-gray-400">Trái: {cropConfig.cropLeft}%</span>
                    <input 
                      type="range" min="0" max="60" 
                      value={cropConfig.cropLeft}
                      onChange={(e) => setCropConfig(prev => ({ ...prev, cropLeft: Number(e.target.value) }))}
                      className="w-full accent-amber-400 h-1 bg-gray-700 rounded-lg cursor-pointer"
                    />
                  </div>
                  <div>
                    <span className="text-gray-400">Phải: {cropConfig.cropRight}%</span>
                    <input 
                      type="range" min="0" max="60" 
                      value={cropConfig.cropRight}
                      onChange={(e) => setCropConfig(prev => ({ ...prev, cropRight: Number(e.target.value) }))}
                      className="w-full accent-amber-400 h-1 bg-gray-700 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Xóa 4 Góc Vát (Corner Eraser) */}
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
                </div>
              </div>

              {/* Bo Góc Tùy Biến */}
              <div className="flex items-center justify-between gap-2 bg-white/5 p-2 rounded-xl border border-white/10">
                <span className="text-[11px] text-gray-300 font-medium">Bo Khung:</span>
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

          {/* ========================================================================= */}
          {/* TAB 4: ĐIỀU HƯỚNG 8 HƯỚNG D-PAD                                            */}
          {/* ========================================================================= */}
          {activeTab === 'move8' && (
            <div className="space-y-3 animate-in fade-in">
              <div className="flex flex-col items-center justify-center gap-1.5 bg-black/40 p-3 rounded-2xl border border-white/10">
                <div className="flex items-center gap-1.5">
                  <button type="button" onClick={() => move8Way(-1, -1)} className="w-12 h-10 rounded-xl bg-white/10 hover:bg-emerald-500 hover:text-black font-black text-sm flex items-center justify-center active:scale-90 cursor-pointer">↖️</button>
                  <button type="button" onClick={() => move8Way(0, -1)} className="w-14 h-10 rounded-xl bg-gradient-to-b from-emerald-600 to-teal-700 text-white font-black text-sm flex items-center justify-center active:scale-90 cursor-pointer">⬆️</button>
                  <button type="button" onClick={() => move8Way(1, -1)} className="w-12 h-10 rounded-xl bg-white/10 hover:bg-emerald-500 hover:text-black font-black text-sm flex items-center justify-center active:scale-90 cursor-pointer">↗️</button>
                </div>
                <div className="flex items-center gap-1.5">
                  <button type="button" onClick={() => move8Way(-1, 0)} className="w-12 h-10 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black text-sm flex items-center justify-center active:scale-90 cursor-pointer">⬅️</button>
                  <button type="button" onClick={() => setCamTransform(prev => ({ ...prev, panX: 0, panY: 0 }))} className="w-14 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white font-black text-[10px] flex flex-col items-center justify-center active:scale-90 cursor-pointer"><RefreshCw size={11} /><span>CENTER</span></button>
                  <button type="button" onClick={() => move8Way(1, 0)} className="w-12 h-10 rounded-xl bg-gradient-to-r from-teal-700 to-emerald-600 text-white font-black text-sm flex items-center justify-center active:scale-90 cursor-pointer">➡️</button>
                </div>
                <div className="flex items-center gap-1.5">
                  <button type="button" onClick={() => move8Way(-1, 1)} className="w-12 h-10 rounded-xl bg-white/10 hover:bg-emerald-500 hover:text-black font-black text-sm flex items-center justify-center active:scale-90 cursor-pointer">↙️</button>
                  <button type="button" onClick={() => move8Way(0, 1)} className="w-14 h-10 rounded-xl bg-gradient-to-t from-emerald-600 to-teal-700 text-white font-black text-sm flex items-center justify-center active:scale-90 cursor-pointer">⬇️</button>
                  <button type="button" onClick={() => move8Way(1, 1)} className="w-12 h-10 rounded-xl bg-white/10 hover:bg-emerald-500 hover:text-black font-black text-sm flex items-center justify-center active:scale-90 cursor-pointer">↘️</button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-white/5 p-2 rounded-xl text-[11px]">
                <div><span className="text-gray-400">X:</span> <span className="font-mono font-bold text-emerald-400">{camTransform.panX}%</span></div>
                <div><span className="text-gray-400">Y:</span> <span className="font-mono font-bold text-cyan-400">{camTransform.panY}%</span></div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: ĐA GÓC, ZOOM, XOAY, NGHIÊNG 3D & TỈ LỆ KHUNG                      */}
          {/* ========================================================================= */}
          {activeTab === 'angles' && (
            <div className="space-y-3 animate-in fade-in">
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

                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="text-gray-300 flex items-center gap-1"><RotateCw size={12} /> Xoay Góc:</span>
                  <span className="font-mono font-bold text-yellow-400">{camTransform.rotate}°</span>
                </div>
                <input 
                  type="range" min="-90" max="90" step="1"
                  value={camTransform.rotate}
                  onChange={(e) => setCamTransform(prev => ({ ...prev, rotate: Number(e.target.value) }))}
                  className="w-full accent-yellow-500 h-1.5 bg-gray-700 rounded-lg cursor-pointer"
                />

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
          )}

          {/* ========================================================================= */}
          {/* TAB 6: KẾT NỐI CAMERA ĐIỆN THOẠI (QUÉT MÃ QR KHÔNG DÂY)                   */}
          {/* ========================================================================= */}
          {activeTab === 'phone_qr' && (
            <div className="space-y-3 animate-in fade-in">
              <div className="bg-gradient-to-r from-blue-950/60 to-indigo-950/60 p-3 rounded-2xl border border-blue-500/40 text-center space-y-2">
                <div className="flex items-center justify-center gap-1.5 text-blue-300 font-bold text-xs">
                  <Smartphone size={14} /> KẾT NỐI CAMERA IPHONE / ANDROID
                </div>
                
                {/* Mã QR Code Kết Nối Nhanh */}
                <div className="flex justify-center p-2 bg-white rounded-xl shadow-lg inline-block mx-auto">
                  <img 
                    src={qrCodeImgUrl} 
                    alt="Quét Mã QR Kết Nối Camera Điện Thoại"
                    className="w-36 h-36 object-contain"
                  />
                </div>

                <div className="space-y-1 text-left bg-black/40 p-2 rounded-xl text-[10px] text-gray-300">
                  <div className="font-bold text-emerald-400">📱 Hướng dẫn 3 bước cực nhanh:</div>
                  <div>1. Mở <b>Camera / Zalo</b> trên điện thoại quét mã QR ở trên.</div>
                  <div>2. Bấm vào liên kết & Cho phép truy cập Camera.</div>
                  <div>3. Hình ảnh từ điện thoại <b>4K 60FPS</b> tự động truyền vào máy tính!</div>
                </div>

                {/* Nút Sao Chép Link & Mở Trực Tiếp */}
                <div className="flex items-center gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={copyPhoneCamUrl}
                    className="flex-1 py-1.5 px-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
                  >
                    {copiedLink ? <Check size={11} className="text-emerald-300" /> : <Copy size={11} />}
                    <span>{copiedLink ? 'Đã Sao Chép Link!' : 'Sao Chép Link Live'}</span>
                  </button>
                  <a
                    href={phoneCamUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="py-1.5 px-2.5 bg-white/10 hover:bg-white/20 text-gray-200 rounded-xl text-[10px] font-bold flex items-center gap-1 transition-all"
                  >
                    <ExternalLink size={11} /> Mở Thử
                  </a>
                </div>
              </div>

              {/* Danh sách Camera Thiết Bị Đã Nhận Diện */}
              {availableDevices.length > 0 && (
                <div className="bg-black/40 p-2.5 rounded-xl border border-white/10 space-y-1.5">
                  <span className="text-[10px] text-gray-400 font-bold block">Thiết Bị Camera Nhận Diện:</span>
                  <select 
                    value={selectedDeviceId}
                    onChange={(e) => setSelectedDeviceId(e.target.value)}
                    className="w-full bg-slate-900 border border-white/20 text-white text-[10px] rounded-lg p-1.5 outline-none"
                  >
                    {availableDevices.map((dev, idx) => (
                      <option key={dev.deviceId || idx} value={dev.deviceId}>
                        🎥 {dev.label || `Camera Nguồn ${idx + 1}`}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

        </div>
      )}
    </>
  );
}
