import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Video, X, Settings2, Sparkles, Move, Compass, Sliders, Maximize2, 
  RotateCw, FlipHorizontal, FlipVertical, Eye, EyeOff, Layers, Scissors, Check, 
  ChevronRight, RefreshCw, ZoomIn, ZoomOut, Square, Circle, Smartphone, Monitor,
  Tv, Crosshair, Sun, Contrast, Palette, Grid, CornerDownRight, Minimize2,
  Wand2, Focus, ShieldCheck, Zap, QrCode, Paintbrush, Eraser, Trash2, Undo, Redo,
  Laptop, Armchair, Box, CheckCircle2, Copy, ExternalLink, Link2, Wifi, Power,
  CheckCheck, FastForward, Play, Activity, RotateCcw, Shield, Crop, SplitSquareVertical,
  AlignJustify, AlignHorizontalJustifyCenter, AlignVerticalJustifyCenter, Hash
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

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
  const [activeTab, setActiveTab] = useState('bg'); // 'bg' | 'brush' | 'crop' | 'move8' | 'angles' | 'phone_qr'
  const [videoSource, setVideoSource] = useState('computer'); // 'computer' | 'phone'
  const [moveSpeedStep, setMoveSpeedStep] = useState(20); // 10 | 20 | 35 (%)
  const [autoConfirmed, setAutoConfirmed] = useState(false);
  const [showGhostOverlay, setShowGhostOverlay] = useState(false); // Hiển thị nền mờ để dễ canh chỉnh
  const [showGridGuides, setShowGridGuides] = useState(false); // Hiển thị lưới thước canh ngang dọc
  const [brushAxisLock, setBrushAxisLock] = useState('free'); // 'free' | 'horizontal' | 'vertical' | 'box_rect'
  const [compareMode, setCompareMode] = useState('off'); // 'off' | 'original' | 'split'
  const [compareSplitPos, setCompareSplitPos] = useState(50); // 0 -> 100 (%)

  // Kích thước co giãn 8 hướng của Khung Camera (Width & Height)
  const [cameraDimensions, setCameraDimensions] = useState(() => {
    try {
      const saved = localStorage.getItem('avalive_studio_cam_dims_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return { width: 350, height: 210 };
  });

  const isResizingRef = useRef(false);
  const resizeHandleRef = useRef(null);
  const resizeStartRef = useRef({ x: 0, y: 0, w: 350, h: 210 });
  
  // Tọa độ riêng biệt cho Bảng Điều Khiển Suite (có thể kéo thả độc lập)
  const [panelPos, setPanelPos] = useState(() => {
    try {
      const saved = localStorage.getItem('avalive_studio_panel_pos');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.x < window.innerWidth - 50 && parsed.x > 0 && parsed.y > 0 && parsed.y < window.innerHeight - 50) {
          return parsed;
        }
      }
    } catch (e) {}
    return { x: Math.max(20, window.innerWidth - 425), y: 60 };
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
      panX: 0,
      panY: 0,
      zoom: 1.0,
      rotate: 0,
      tiltX: 0,
      tiltY: 0,
      flipH: false,
      flipV: false,
      aspectRatio: 'custom', // '16/9', '9:16', '4/3', 'circle', 'custom'
      borderRadius: 8
    };
  });

  // ✂️ Cấu hình Cắt Camera / Cắt Góc / Cắt Khung Đa Chiều (Crop 4 cạnh & 4 góc)
  const [cropConfig, setCropConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('avalive_studio_crop_config_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      cropTop: 0,
      cropBottom: 0,
      cropLeft: 0,
      cropRight: 0,
      cornerTL: 0,
      cornerTR: 0,
      cornerBL: 0,
      cornerBR: 0,
      feather: 4
    };
  });

  // 🧹 Cấu hình Xóa Phông Nền AI Siêu Sạch & Bảo Vệ Sản Phẩm
  const [bgRemovalConfig, setBgRemovalConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('avalive_studio_bg_config_v3');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      mode: 'ai_person',
      sensitivity: 58,
      feather: 10,
      spillReduction: 65,
      bgType: 'transparent',
      bgColor: '#00ff00',
      protectProduct: true,
      hybridChroma: false, // Kết hợp cả AI + Phông xanh
      keepObjects: {
        person: true,
        product: true,
        computer: true,
        desk: true,
        chair: true,
        shelf: false
      }
    };
  });

  // 🖌️ Cọ Quét Vuông Vức Đa Góc & Cọ Xóa Nền Chuẩn Kích Thước Ngay Hàng Thẳng Lối
  const [brushMode, setBrushMode] = useState('none'); // 'none' | 'keep' | 'erase'
  const [brushSize, setBrushSize] = useState(35); // 15 | 30 | 50 | 80 | 120px
  const [brushShape, setBrushShape] = useState('square'); // 'square' | 'round'
  const [brushStrokes, setBrushStrokes] = useState([]);
  const isPaintingRef = useRef(false);
  const currentStrokeRef = useRef(null);
  const boxStartPointRef = useRef(null);

  // 🎨 Cân Bằng Ánh Sáng & Tông Màu Khớp Video AI
  const [colorTune, setColorTune] = useState(() => {
    try {
      const saved = localStorage.getItem('avalive_studio_color_tune_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      brightness: 100,
      contrast: 100,
      saturate: 105,
      temperature: 0,
      skinSmooth: 30
    };
  });

  // 📜 HỆ THỐNG LỊCH SỬ THAO TÁC: QUAY LẠI (UNDO) / TIẾN TỚI (REDO) / XÁC NHẬN
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isUndoRedoActionRef = useRef(false);

  // Ghi lại trạng thái vào History khi có thay đổi
  const pushHistorySnapshot = useCallback(() => {
    if (isUndoRedoActionRef.current) {
      isUndoRedoActionRef.current = false;
      return;
    }
    const snapshot = {
      camTransform: { ...camTransform },
      cropConfig: { ...cropConfig },
      bgRemovalConfig: { ...bgRemovalConfig },
      colorTune: { ...colorTune },
      brushStrokes: [...brushStrokes],
      cameraDimensions: { ...cameraDimensions }
    };

    setHistory(prev => {
      const trimmed = prev.slice(0, historyIndex + 1);
      return [...trimmed, snapshot].slice(-30);
    });
    setHistoryIndex(prev => Math.min(29, prev + 1));
  }, [camTransform, cropConfig, bgRemovalConfig, colorTune, brushStrokes, cameraDimensions, historyIndex]);

  // Thao tác Hoàn Tác (Undo)
  const handleUndo = () => {
    if (historyIndex > 0) {
      const targetIndex = historyIndex - 1;
      const targetState = history[targetIndex];
      if (targetState) {
        isUndoRedoActionRef.current = true;
        setCamTransform(targetState.camTransform);
        setCropConfig(targetState.cropConfig);
        setBgRemovalConfig(targetState.bgRemovalConfig);
        setColorTune(targetState.colorTune);
        setBrushStrokes(targetState.brushStrokes);
        if (targetState.cameraDimensions) setCameraDimensions(targetState.cameraDimensions);
        setHistoryIndex(targetIndex);
      }
    }
  };

  // Thao tác Tiến Tới (Redo)
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const targetIndex = historyIndex + 1;
      const targetState = history[targetIndex];
      if (targetState) {
        isUndoRedoActionRef.current = true;
        setCamTransform(targetState.camTransform);
        setCropConfig(targetState.cropConfig);
        setBgRemovalConfig(targetState.bgRemovalConfig);
        setColorTune(targetState.colorTune);
        setBrushStrokes(targetState.brushStrokes);
        if (targetState.cameraDimensions) setCameraDimensions(targetState.cameraDimensions);
        setHistoryIndex(targetIndex);
      }
    }
  };

  // Thao tác Xác Nhận Áp Dụng (Confirm)
  const handleConfirmAction = () => {
    try {
      localStorage.setItem('avalive_studio_cam_transform_v3', JSON.stringify(camTransform));
      localStorage.setItem('avalive_studio_crop_config_v2', JSON.stringify(cropConfig));
      localStorage.setItem('avalive_studio_bg_config_v3', JSON.stringify(bgRemovalConfig));
      localStorage.setItem('avalive_studio_color_tune_v2', JSON.stringify(colorTune));
      localStorage.setItem('avalive_studio_cam_dims_v1', JSON.stringify(cameraDimensions));
    } catch (e) {}
    setAutoConfirmed(true);
    setTimeout(() => setAutoConfirmed(false), 2500);
  };

  // ↺ NÚT KHÔI PHỤC CAMERA GỐC BAN ĐẦU (1-CLICK ORIGINAL CAMERA RESET)
  const handleResetToOriginalCamera = () => {
    const defaultTransform = {
      panX: 0,
      panY: 0,
      zoom: 1.0,
      rotate: 0,
      tiltX: 0,
      tiltY: 0,
      flipH: false,
      flipV: false,
      aspectRatio: '16/9',
      borderRadius: 0
    };
    const defaultCrop = {
      cropTop: 0,
      cropBottom: 0,
      cropLeft: 0,
      cropRight: 0,
      cornerTL: 0,
      cornerTR: 0,
      cornerBL: 0,
      cornerBR: 0,
      feather: 4
    };
    const defaultBgConfig = {
      mode: 'none',
      sensitivity: 58,
      feather: 8,
      spillReduction: 60,
      bgType: 'transparent',
      bgColor: '#00ff00',
      protectProduct: false,
      hybridChroma: false,
      keepObjects: {
        person: true,
        product: true,
        computer: true,
        desk: true,
        chair: true,
        shelf: false
      }
    };
    const defaultColor = {
      brightness: 100,
      contrast: 100,
      saturate: 100,
      temperature: 0,
      skinSmooth: 0
    };
    const defaultDims = { width: 350, height: 210 };

    setCamTransform(defaultTransform);
    setCropConfig(defaultCrop);
    setBgRemovalConfig(defaultBgConfig);
    setColorTune(defaultColor);
    setCameraDimensions(defaultDims);
    setBrushStrokes([]);
    setBrushMode('none');
    setCompareMode('off');
    setShowGhostOverlay(false);
    setShowGridGuides(false);
    setHistory([]);
    setHistoryIndex(-1);

    // Ghi đè trực tiếp các giá trị nguyên bản vào localStorage
    try {
      localStorage.setItem('avalive_studio_cam_transform_v3', JSON.stringify(defaultTransform));
      localStorage.setItem('avalive_studio_crop_config_v2', JSON.stringify(defaultCrop));
      localStorage.setItem('avalive_studio_bg_config_v3', JSON.stringify(defaultBgConfig));
      localStorage.setItem('avalive_studio_color_tune_v2', JSON.stringify(defaultColor));
      localStorage.setItem('avalive_studio_cam_dims_v1', JSON.stringify(defaultDims));
    } catch (e) {}

    if (onPositionChange) {
      onPositionChange({ x: 500, y: 80 });
    }

    setAutoConfirmed(true);
    setTimeout(() => setAutoConfirmed(false), 2500);
  };

  // 🧹 Xóa sạch tất cả các nét cọ vẽ (Clear all brush strokes)
  const handleClearAllBrushes = () => {
    setBrushStrokes([]);
    setBrushMode('none');
    pushHistorySnapshot();
  };

  // ✨ AUTO TÙY CHỈNH THÔNG MINH (AI AUTO OPTIMIZE)
  const handleAutoOptimize = () => {
    setCamTransform(prev => ({
      ...prev,
      zoom: 1.15,
      panX: 0,
      panY: -5,
      tiltX: 0,
      tiltY: 0,
      rotate: 0,
      aspectRatio: '16/9',
      borderRadius: 12
    }));
    setColorTune({
      brightness: 108,
      contrast: 105,
      saturate: 110,
      temperature: 2,
      skinSmooth: 40
    });
    setBgRemovalConfig(prev => ({
      ...prev,
      mode: 'ai_person',
      sensitivity: 58,
      feather: 10,
      protectProduct: true
    }));
    handleConfirmAction();
  };

  // 📱 Quản Lý Kết Nối Camera Điện Thoại (QR Code Realtime Broadcast Stream)
  const [phoneCamSession, setPhoneCamSession] = useState(() => {
    try {
      const saved = localStorage.getItem('avalive_phone_cam_session');
      if (saved) return saved;
    } catch (e) {}
    const newSession = 'AVA_' + Math.random().toString(36).substring(2, 8).toUpperCase();
    try { localStorage.setItem('avalive_phone_cam_session', newSession); } catch(e) {}
    return newSession;
  });

  const [availableDevices, setAvailableDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [phoneConnectStatus, setPhoneConnectStatus] = useState('waiting');
  const phoneImageRef = useRef(new Image());
  const hasPhoneFrameRef = useRef(false);

  const rawVideoRef = useRef(null);
  const canvasRef = useRef(null);
  const animFrameIdRef = useRef(null);
  const cameraContainerRef = useRef(null);

  // Quét danh sách thiết bị camera máy tính
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

  // Gắn stream máy tính vào video tag ẩn
  useEffect(() => {
    if (rawVideoRef.current && stream && videoSource === 'computer') {
      rawVideoRef.current.srcObject = stream;
      rawVideoRef.current.play().catch(() => {});
    }
  }, [stream, isWebcamActive, videoSource]);

  // 📡 Lắng nghe kết nối luồng từ Camera Điện Thoại qua Supabase Realtime
  useEffect(() => {
    if (!phoneCamSession) return;

    const channelName = `phone_cam_${phoneCamSession}`;
    const channel = supabase.channel(channelName, {
      config: { broadcast: { self: false } }
    });

    channel
      .on('broadcast', { event: 'PHONE_JOINED' }, () => {
        setPhoneConnectStatus('connected');
        setVideoSource('phone');
      })
      .on('broadcast', { event: 'PHONE_FRAME' }, ({ payload }) => {
        if (payload?.image) {
          setPhoneConnectStatus('connected');
          phoneImageRef.current.src = payload.image;
          hasPhoneFrameRef.current = true;
        }
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          channel.send({
            type: 'broadcast',
            event: 'DESKTOP_READY',
            payload: { timestamp: Date.now() }
          }).catch(() => {});
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [phoneCamSession]);

  // ↔️ Co giãn 8 hướng trực tiếp trên màn hình camera (8-Way Resize Handles)
  const handleResizeMouseDown = (e, handle) => {
    e.stopPropagation();
    e.preventDefault();
    isResizingRef.current = true;
    resizeHandleRef.current = handle;
    resizeStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      w: cameraDimensions.width,
      h: cameraDimensions.height
    };
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isResizingRef.current && resizeHandleRef.current) {
        const dx = e.clientX - resizeStartRef.current.x;
        const dy = e.clientY - resizeStartRef.current.y;
        const handle = resizeHandleRef.current;
        let newW = resizeStartRef.current.w;
        let newH = resizeStartRef.current.h;

        if (handle.includes('e')) newW += dx;
        if (handle.includes('w')) newW -= dx;
        if (handle.includes('s')) newH += dy;
        if (handle.includes('n')) newH -= dy;

        setCameraDimensions({
          width: Math.max(140, Math.min(1200, newW)),
          height: Math.max(90, Math.min(900, newH))
        });
      }

      if (isDraggingPanel) {
        setPanelPos({
          x: Math.max(10, Math.min(window.innerWidth - 380, e.clientX - panelDragOffset.current.x)),
          y: Math.max(10, Math.min(window.innerHeight - 300, e.clientY - panelDragOffset.current.y))
        });
      }
    };

    const handleMouseUp = () => {
      if (isResizingRef.current) {
        isResizingRef.current = false;
        resizeHandleRef.current = null;
        pushHistorySnapshot();
      }
      if (isDraggingPanel) setIsDraggingPanel(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingPanel, pushHistorySnapshot]);

  // Kéo thả Panel Điều Khiển Suite độc lập
  const handlePanelMouseDown = (e) => {
    setIsDraggingPanel(true);
    panelDragOffset.current = {
      x: e.clientX - panelPos.x,
      y: e.clientY - panelPos.y
    };
  };

  // Xử lý Cọ Vẽ Quét Vuông Vức / Khóa Trục Ngang Dọc trên Canvas
  const handleCanvasMouseDown = (e) => {
    if (brushMode === 'none' || activeTab !== 'brush') {
      if (onDragStart) onDragStart(e);
      return;
    }
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
    boxStartPointRef.current = pt;
    currentStrokeRef.current = {
      mode: brushMode,
      shape: brushShape,
      size: brushSize * scaleX,
      axisLock: brushAxisLock,
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
    let pt = {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };

    // Khóa trục ngang hoặc dọc để quét ngay hàng thẳng lối
    const startPt = boxStartPointRef.current;
    if (brushAxisLock === 'horizontal' && startPt) {
      pt.y = startPt.y;
    } else if (brushAxisLock === 'vertical' && startPt) {
      pt.x = startPt.x;
    }

    currentStrokeRef.current.points.push(pt);
  };

  const handleCanvasMouseUp = () => {
    if (isPaintingRef.current && currentStrokeRef.current) {
      setBrushStrokes(prev => [...prev, currentStrokeRef.current]);
      isPaintingRef.current = false;
      currentStrokeRef.current = null;
      boxStartPointRef.current = null;
      pushHistorySnapshot();
    }
  };

  // =====================================================================
  // MEDIAPIPE SELFIE SEGMENTATION — Nạp engine AI tách nền siêu mượt 60 FPS
  // =====================================================================
  const segmentationRef = useRef(null);
  const segMaskRef = useRef(null);
  const segReadyRef = useRef(false);

  useEffect(() => {
    let destroyed = false;

    const loadMediaPipe = async () => {
      if (!window.SelfieSegmentation) {
        await new Promise((resolve) => {
          const existing = document.querySelector('script[src*="selfie_segmentation"]');
          if (existing) { setTimeout(resolve, 200); return; }
          const s = document.createElement('script');
          s.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/selfie_segmentation.js';
          s.crossOrigin = 'anonymous';
          s.onload = resolve;
          s.onerror = resolve;
          document.head.appendChild(s);
          setTimeout(resolve, 2500);
        });
      }

      if (destroyed || !window.SelfieSegmentation) return;

      try {
        const seg = new window.SelfieSegmentation({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`
        });
        seg.setOptions({ modelSelection: 1, selfieMode: false });

        const maskCanvas = document.createElement('canvas');
        maskCanvas.width = 192;
        maskCanvas.height = 192;
        segMaskRef.current = maskCanvas;

        seg.onResults((results) => {
          if (destroyed) return;
          try {
            const mc = segMaskRef.current;
            if (!mc) return;
            const mCtx = mc.getContext('2d', { willReadFrequently: true });
            mCtx.clearRect(0, 0, mc.width, mc.height);
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

  // =====================================================================
  // REAL-TIME CANVAS RENDERING LOOP 60 FPS SIÊU SẠCH & BẢO VỆ SẢN PHẨM
  // =====================================================================
  useEffect(() => {
    const canvas = canvasRef.current;
    const video = rawVideoRef.current;
    if (!canvas) return;

    const tmpCanvas = document.createElement('canvas');
    const tmpCtx = tmpCanvas.getContext('2d', { willReadFrequently: true });
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    let isRunning = true;
    let segFrameCount = 0;

    const renderFrame = () => {
      if (!isRunning) return;

      const isUsingPhone = videoSource === 'phone' && hasPhoneFrameRef.current;
      const hasVideo = isUsingPhone || (video && video.readyState >= 2);

      if (hasVideo) {
        const sourceElement = isUsingPhone ? phoneImageRef.current : video;
        const vw = isUsingPhone ? (sourceElement.naturalWidth || 640) : (video.videoWidth || 640);
        const vh = isUsingPhone ? (sourceElement.naturalHeight || 480) : (video.videoHeight || 480);

        if (canvas.width !== vw || canvas.height !== vh) {
          canvas.width = vw;
          canvas.height = vh;
          tmpCanvas.width = vw;
          tmpCanvas.height = vh;
        }

        // === BƯỚC 1: Vẽ nguồn hình ảnh với color filters & transform ===
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
        tmpCtx.drawImage(sourceElement, 0, 0, vw, vh);
        tmpCtx.restore();

        // 📷 NẾU ĐANG Ở CHẾ ĐỘ XEM CAMERA GỐC HOÀN TOÀN (TRƯỚC XÓA)
        if (compareMode === 'original') {
          ctx.clearRect(0, 0, vw, vh);
          ctx.drawImage(sourceElement, 0, 0, vw, vh);
          animFrameIdRef.current = requestAnimationFrame(renderFrame);
          return;
        }

        // === BƯỚC 2: Gửi nguồn (khung hình thực tế) tới MediaPipe segmentation ===
        const mode = bgRemovalConfig.mode;
        if (mode !== 'none' && segReadyRef.current && segmentationRef.current) {
          segFrameCount++;
          if (segFrameCount % 2 === 0) {
            try {
              // Gửi tmpCanvas để AI bám theo chính xác 100% vị trí thực tế của người trên khung hình
              segmentationRef.current.send({ image: tmpCanvas }).catch(() => {});
            } catch (e) {}
          }
        }

        // === BƯỚC 3: Áp mask tách nền trong suốt 100% (Real-time dynamic tracking) ===
        ctx.clearRect(0, 0, vw, vh);

        // Chế độ xem trước bóng mờ (Ghost Overlay) để dễ quan sát nền và sản phẩm
        if (showGhostOverlay && mode !== 'none') {
          ctx.save();
          ctx.globalAlpha = 0.28;
          ctx.drawImage(tmpCanvas, 0, 0);
          ctx.restore();
        }

        ctx.drawImage(tmpCanvas, 0, 0);

        if (mode !== 'none') {
          if ((mode === 'ai_person' || mode === 'desk_product') && segMaskRef.current && segReadyRef.current) {
            const imgData = ctx.getImageData(0, 0, vw, vh);
            const data = imgData.data;
            const mc = segMaskRef.current;
            const mCtx = mc.getContext('2d', { willReadFrequently: true });
            const mData = mCtx.getImageData(0, 0, mc.width, mc.height).data;
            const mw = mc.width;
            const mh = mc.height;
            const feather = Math.max(1, bgRemovalConfig.feather);
            const sensitivity = bgRemovalConfig.sensitivity / 100;
            const scaleX = (mw - 1) / Math.max(1, vw - 1);
            const scaleY = (mh - 1) / Math.max(1, vh - 1);
            const threshold = (1 - sensitivity) * 165;
            const featherRange = feather * 4.5;

            // Cấu hình vùng giữ lại theo ý người dùng (Keep Objects)
            const keepDesk = bgRemovalConfig.keepObjects?.desk || mode === 'desk_product';
            const keepProduct = bgRemovalConfig.protectProduct || bgRemovalConfig.keepObjects?.product;
            const keepComputer = bgRemovalConfig.keepObjects?.computer;
            const keepChair = bgRemovalConfig.keepObjects?.chair;
            const keepShelf = bgRemovalConfig.keepObjects?.shelf;

            // Xóa phông bám theo nhân vật theo thời gian thực (Dynamic real-time tracking)
            for (let y = 0; y < vh; y++) {
              const gy = y * scaleY;
              const gyi = Math.floor(gy);
              const fy = gy - gyi;
              const gyi1 = Math.min(mh - 1, gyi + 1);

              const isDeskZone = keepDesk && y > vh * 0.72;
              const isShelfZone = keepShelf && y < vh * 0.35;

              for (let x = 0; x < vw; x++) {
                const idx = (y * vw + x) * 4;
                const gx = x * scaleX;
                const gxi = Math.floor(gx);
                const fx = gx - gxi;
                const gxi1 = Math.min(mw - 1, gxi + 1);

                // Song tuyến tính (Bilinear smoothing) giúp viền siêu mịn màng không răng cưa
                const idx00 = (gyi * mw + gxi) * 4;
                const v00 = Math.max(mData[idx00], mData[idx00 + 1], mData[idx00 + 2], mData[idx00 + 3]);

                const idx10 = (gyi * mw + gxi1) * 4;
                const v10 = Math.max(mData[idx10], mData[idx10 + 1], mData[idx10 + 2], mData[idx10 + 3]);

                const idx01 = (gyi1 * mw + gxi) * 4;
                const v01 = Math.max(mData[idx01], mData[idx01 + 1], mData[idx01 + 2], mData[idx01 + 3]);

                const idx11 = (gyi1 * mw + gxi1) * 4;
                const v11 = Math.max(mData[idx11], mData[idx11 + 1], mData[idx11 + 2], mData[idx11 + 3]);

                let maskVal = (v00 * (1 - fx) + v10 * fx) * (1 - fy) + (v01 * (1 - fx) + v11 * fx) * fy;

                // Giữ lại bàn ghế, sản phẩm, máy tính khi được tích chọn
                if (isDeskZone) {
                  maskVal = Math.max(maskVal, 255);
                } else if (keepProduct && (x > vw * 0.22 && x < vw * 0.78 && y > vh * 0.40 && y < vh * 0.95)) {
                  if (maskVal > 15) maskVal = Math.max(maskVal, 255);
                } else if (keepComputer && (y > vh * 0.55 && ((x > vw * 0.05 && x < vw * 0.42) || (x > vw * 0.58 && x < vw * 0.95)))) {
                  if (maskVal > 20) maskVal = Math.max(maskVal, 255);
                } else if (keepChair && (y > vh * 0.30 && y < vh * 0.85 && (x > vw * 0.15 && x < vw * 0.85))) {
                  if (maskVal > 30) maskVal = Math.min(255, maskVal * 1.5);
                } else if (isShelfZone && (x < vw * 0.30 || x > vw * 0.70)) {
                  if (maskVal > 25) maskVal = Math.max(maskVal, 255);
                }

                if (maskVal < threshold) {
                  data[idx + 3] = 0; // Nền trong suốt 100%
                } else if (maskVal < threshold + featherRange) {
                  const alpha = (maskVal - threshold) / featherRange;
                  data[idx + 3] = Math.round(data[idx + 3] * Math.min(1, Math.max(0, alpha)));
                }
              }
            }
            applyDualCropToPixels(data, vw, vh, cropConfig);
            ctx.putImageData(imgData, 0, 0);

          } else if (mode === 'chroma_green' || mode === 'chroma_blue') {
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
                if (isGreen) data[i+1] = Math.min(g, Math.round(Math.max(r, b2) * (1 - spill * 0.5)));
                else data[i+2] = Math.min(b2, Math.round(Math.max(r, g) * (1 - spill * 0.5)));
              }
            }
            applyDualCropToPixels(data, vw, vh, cropConfig);
            ctx.putImageData(imgData, 0, 0);

          } else {
            const imgData = ctx.getImageData(0, 0, vw, vh);
            applyDualCropToPixels(imgData.data, vw, vh, cropConfig);
            ctx.putImageData(imgData, 0, 0);
          }
        } else {
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

        // === BƯỚC 4: Áp brush strokes với destination-out / source-over ===
        const allStrokes = [...brushStrokes];
        if (isPaintingRef.current && currentStrokeRef.current) {
          allStrokes.push(currentStrokeRef.current);
        }

        if (allStrokes.length > 0) {
          for (const stroke of allStrokes) {
            const radius = stroke.size;
            const isKeep = stroke.mode === 'keep';
            const isSquare = stroke.shape === 'square';

            if (!isKeep) {
              ctx.globalCompositeOperation = 'destination-out';
              ctx.fillStyle = 'rgba(0,0,0,1)';
            } else {
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
                ctx.save();
                ctx.clip();
                ctx.globalCompositeOperation = 'source-over';
                ctx.drawImage(tmpCanvas, 0, 0, vw, vh);
                ctx.restore();
              }
            }
          }
          ctx.globalCompositeOperation = 'source-over';
        }

        // === BƯỚC 5: Chế độ Chia đôi So Sánh (Split Before & After) ===
        if (compareMode === 'split') {
          const splitX = Math.round((vw * compareSplitPos) / 100);
          ctx.save();
          // Vẽ nửa trái là Camera Gốc
          ctx.beginPath();
          ctx.rect(0, 0, splitX, vh);
          ctx.clip();
          ctx.drawImage(sourceElement, 0, 0, vw, vh);
          ctx.restore();

          // Vẽ đường phân chia và nhãn
          ctx.save();
          ctx.strokeStyle = '#06b6d4';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(splitX, 0);
          ctx.lineTo(splitX, vh);
          ctx.stroke();

          // Nhãn Trước / Sau
          ctx.font = 'bold 12px sans-serif';
          ctx.fillStyle = '#06b6d4';
          ctx.fillText('📷 TRƯỚC (GỐC)', Math.max(10, splitX - 110), 22);
          ctx.fillStyle = '#10b981';
          ctx.fillText('✨ SAU (XÓA PHÔNG)', Math.min(vw - 140, splitX + 10), 22);
          ctx.restore();
        }
      }

      animFrameIdRef.current = requestAnimationFrame(renderFrame);
    };

    animFrameIdRef.current = requestAnimationFrame(renderFrame);

    return () => {
      isRunning = false;
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [camTransform, cropConfig, bgRemovalConfig, colorTune, brushStrokes, videoSource, showGhostOverlay, compareMode, compareSplitPos, applyDualCropToPixels]);

  // 🕹️ Di chuyển 8 hướng mượt mà với bước nhảy tùy chọn
  const move8Way = (dx, dy) => {
    setCamTransform(prev => ({
      ...prev,
      panX: Math.max(-150, Math.min(150, prev.panX + dx * moveSpeedStep)),
      panY: Math.max(-150, Math.min(150, prev.panY + dy * moveSpeedStep))
    }));
  };

  // Khôi phục cài đặt gốc
  const resetTransform = () => {
    handleResetToOriginalCamera();
  };

  // Áp dụng Preset Ghép nhanh vào Video AI
  const applyPresetLayout = (presetId) => {
    switch (presetId) {
      case 'desk_screen':
        setCamTransform(prev => ({
          ...prev,
          zoom: 1.2,
          panX: 15,
          panY: -10,
          tiltX: 6,
          tiltY: -12,
          rotate: -2,
          aspectRatio: 'custom',
          borderRadius: 8
        }));
        setCropConfig(prev => ({ ...prev, cornerTL: 8, cornerTR: 8, cropBottom: 10 }));
        setBgRemovalConfig(prev => ({ ...prev, mode: 'desk_product' }));
        break;

      case 'vertical_screen':
        setCamTransform(prev => ({
          ...prev,
          zoom: 1.0,
          panX: 0,
          panY: 0,
          tiltX: 0,
          tiltY: 8,
          rotate: 0,
          aspectRatio: '9/16',
          borderRadius: 16
        }));
        setCropConfig(prev => ({ ...prev, cornerTL: 12, cornerTR: 12, cornerBL: 12, cornerBR: 12 }));
        setBgRemovalConfig(prev => ({ ...prev, mode: 'ai_person' }));
        break;

      case 'floating_pip_circle':
        setCamTransform(prev => ({
          ...prev,
          zoom: 1.3,
          panX: 0,
          panY: -5,
          tiltX: 0,
          tiltY: 0,
          rotate: 0,
          aspectRatio: 'circle',
          borderRadius: 9999
        }));
        setBgRemovalConfig(prev => ({ ...prev, mode: 'ai_person' }));
        break;

      case 'tiktok_portrait_full':
        setCamTransform(prev => ({
          ...prev,
          zoom: 1.0,
          panX: 0,
          panY: 0,
          tiltX: 0,
          tiltY: 0,
          rotate: 0,
          aspectRatio: '9/16',
          borderRadius: 0
        }));
        setBgRemovalConfig(prev => ({ ...prev, mode: 'ai_person' }));
        break;

      case 'product_macro':
        setCamTransform(prev => ({
          ...prev,
          zoom: 2.0,
          panX: 0,
          panY: 15,
          tiltX: 0,
          tiltY: 0,
          rotate: 0,
          aspectRatio: '1/1',
          borderRadius: 16
        }));
        setBgRemovalConfig(prev => ({ ...prev, mode: 'desk_product' }));
        break;

      default:
        resetTransform();
        break;
    }
    handleConfirmAction();
  };

  const copyPhoneCamUrl = () => {
    const url = `https://avalivepro.vercel.app/phone-cam?session=${phoneCamSession}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  if (!isWebcamActive) return null;

  // Tính toán kích thước hiển thị khung camera
  let borderRadiusStyle = `${camTransform.borderRadius}px`;
  if (camTransform.aspectRatio === 'circle') borderRadiusStyle = '9999px';

  const phoneCamUrl = `https://avalivepro.vercel.app/phone-cam?session=${phoneCamSession}`;
  const qrCodeImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(phoneCamUrl)}&margin=10`;

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. KHUNG CAMERA ĐỘC LẬP — CO GIÃN 8 HƯỚNG, 100% TRONG SUỐT THUẦN KHIẾT   */}
      {/* ========================================================================= */}
      <div 
        ref={cameraContainerRef}
        className="absolute z-40 select-none group transition-all duration-75"
        style={{ 
          left: position.x, 
          top: position.y,
          width: `${cameraDimensions.width}px`,
          height: `${cameraDimensions.height}px`
        }}
      >
        <div 
          className="relative w-full h-full overflow-hidden transition-all border-0 bg-transparent"
          style={{ 
            borderRadius: borderRadiusStyle,
            transform: `perspective(600px) rotateX(${camTransform.tiltX}deg) rotateY(${camTransform.tiltY}deg)`,
            cursor: brushMode !== 'none' ? 'crosshair' : 'move'
          }}
          onMouseDown={(e) => {
            if (brushMode === 'none' && onDragStart) {
              onDragStart(e);
            }
          }}
        >
          {/* Lưới Thước Canh Tỉ Lệ (Grid Lines) */}
          {showGridGuides && (
            <div className="absolute inset-0 z-20 pointer-events-none grid grid-cols-3 grid-rows-3 border border-cyan-400/30">
              <div className="border-r border-b border-cyan-400/20" />
              <div className="border-r border-b border-cyan-400/20" />
              <div className="border-b border-cyan-400/20" />
              <div className="border-r border-b border-cyan-400/20" />
              <div className="border-r border-b border-cyan-400/20" />
              <div className="border-b border-cyan-400/20" />
              <div className="border-r border-cyan-400/20" />
              <div className="border-r border-cyan-400/20" />
              <div />
            </div>
          )}

          {/* Hidden Raw Video Stream Source */}
          <video 
            ref={rawVideoRef} 
            autoPlay 
            playsInline 
            muted 
            className="hidden" 
          />

          {/* Canvas Rendering 60 FPS — 100% Trong Suốt Thuần Khiết */}
          <canvas 
            ref={canvasRef} 
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
            className="w-full h-full object-cover block relative z-10"
          />

          {/* Nút Điều Khiển Tinh Tế Trực Tiếp Trên Khung Camera (Hiện khi hover chuột) */}
          <div className="absolute top-2 right-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-black/85 backdrop-blur-md p-1 rounded-xl border border-white/20 shadow-xl" onMouseDown={(e) => e.stopPropagation()}>
            {/* Nút Xem Nhanh Camera Gốc */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCompareMode(prev => prev === 'original' ? 'off' : 'original');
              }}
              className={`px-2 py-1 rounded-lg text-[9px] font-black flex items-center gap-1 transition-all cursor-pointer ${
                compareMode === 'original'
                  ? 'bg-cyan-400 text-slate-950 shadow-md ring-1 ring-cyan-300'
                  : 'bg-white/10 hover:bg-white/20 text-cyan-300'
              }`}
              title="1-Click Xem Camera Gốc Trước Xóa"
            >
              <Eye size={11} />
              <span>{compareMode === 'original' ? 'ĐANG XEM GỐC' : 'GỐC'}</span>
            </button>

            {/* Nút Chia Đôi So Sánh */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCompareMode(prev => prev === 'split' ? 'off' : 'split');
              }}
              className={`px-2 py-1 rounded-lg text-[9px] font-black flex items-center gap-1 transition-all cursor-pointer ${
                compareMode === 'split'
                  ? 'bg-emerald-400 text-slate-950 shadow-md ring-1 ring-emerald-300'
                  : 'bg-white/10 hover:bg-white/20 text-emerald-300'
              }`}
              title="Chia Đôi So Sánh Trước và Sau Xóa"
            >
              <SplitSquareVertical size={11} />
              <span>SO SÁNH</span>
            </button>

            {/* Nút Khôi Phục Camera Gốc */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleResetToOriginalCamera();
              }}
              className="p-1 rounded-lg bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-black transition-all cursor-pointer"
              title="↺ 1-Click Khôi Phục Toàn Diện Camera Gốc Ban Đầu"
            >
              <RotateCcw size={12} />
            </button>

            {/* Nút Mở Bảng Cài Đặt Suite */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowControls(prev => !prev);
              }}
              className="p-1 rounded-lg bg-emerald-500/30 hover:bg-emerald-500 text-emerald-300 hover:text-black transition-all cursor-pointer"
              title="Mở Bảng Cài Đặt Camera Suite"
            >
              <Sliders size={12} />
            </button>

            {/* Nút Đóng Camera */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="p-1 rounded-lg bg-rose-500/30 hover:bg-rose-500 text-rose-300 hover:text-white transition-all cursor-pointer"
              title="Đóng Camera"
            >
              <X size={12} />
            </button>
          </div>

        </div>

        {/* 🌟 8-WAY RESIZE HANDLES (MẮT CO GIÃN 8 HƯỚNG TRỰC QUAN) */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          {/* 4 Góc */}
          <div onMouseDown={(e) => handleResizeMouseDown(e, 'nw')} className="absolute -top-1 -left-1 w-3 h-3 bg-emerald-400 border border-black rounded-sm cursor-nw-resize z-30 shadow-md" />
          <div onMouseDown={(e) => handleResizeMouseDown(e, 'ne')} className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 border border-black rounded-sm cursor-ne-resize z-30 shadow-md" />
          <div onMouseDown={(e) => handleResizeMouseDown(e, 'sw')} className="absolute -bottom-1 -left-1 w-3 h-3 bg-emerald-400 border border-black rounded-sm cursor-sw-resize z-30 shadow-md" />
          <div onMouseDown={(e) => handleResizeMouseDown(e, 'se')} className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 border border-black rounded-sm cursor-se-resize z-30 shadow-md" />
          
          {/* 4 Cạnh */}
          <div onMouseDown={(e) => handleResizeMouseDown(e, 'n')} className="absolute -top-1 left-1/2 -translate-x-1/2 w-5 h-2 bg-emerald-400/80 border border-black rounded-sm cursor-n-resize z-30" />
          <div onMouseDown={(e) => handleResizeMouseDown(e, 's')} className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-2 bg-emerald-400/80 border border-black rounded-sm cursor-s-resize z-30" />
          <div onMouseDown={(e) => handleResizeMouseDown(e, 'w')} className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-5 bg-emerald-400/80 border border-black rounded-sm cursor-w-resize z-30" />
          <div onMouseDown={(e) => handleResizeMouseDown(e, 'e')} className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-5 bg-emerald-400/80 border border-black rounded-sm cursor-e-resize z-30" />
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. BẢNG ĐIỀU KHIỂN CÀI ĐẶT ĐỘC LẬP (STUDIO CAMERA SUITE PANEL)             */}
      {/* ========================================================================= */}
      {showControls && (
        <div 
          className="fixed z-50 select-none w-[405px] bg-slate-950/98 border border-emerald-500/60 rounded-3xl p-4 text-white shadow-[0_0_50px_rgba(16,185,129,0.25)] backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 space-y-3"
          style={{ 
            left: panelPos.x, 
            top: panelPos.y 
          }}
        >
          {/* Header Bảng Cài Đặt */}
          <div 
            onMouseDown={handlePanelMouseDown}
            className="flex items-center justify-between border-b border-white/10 pb-2.5 cursor-move"
          >
            <div className="flex items-center gap-2 pointer-events-none">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/30">
                <Sliders size={16} />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  STUDIO CAMERA SUITE
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">PRO 60FPS</span>
                </h4>
                <p className="text-[9px] text-gray-400">Co giãn 8 hướng • Xóa phông linh hoạt</p>
              </div>
            </div>

            <div className="flex items-center gap-1" onMouseDown={(e) => e.stopPropagation()}>
              {/* Nút Khôi Phục Camera Gốc Ban Đầu */}
              <button
                type="button"
                onClick={handleResetToOriginalCamera}
                className="text-[10px] text-cyan-300 hover:text-white px-2.5 py-1 rounded-xl bg-cyan-950/60 hover:bg-cyan-600/80 border border-cyan-500/50 flex items-center gap-1 transition-all cursor-pointer font-black shadow-sm"
                title="1-Click đưa camera về trạng thái gốc ban đầu (tắt xóa nền, reset góc & zoom)"
              >
                <RotateCcw size={11} /> Camera Gốc
              </button>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-rose-400 p-1.5 hover:bg-rose-500/20 rounded-lg transition-colors cursor-pointer"
                title="Tắt Camera"
              >
                <Power size={13} />
              </button>
            </div>
          </div>

          {/* 🌟 THANH ĐIỀU HƯỚNG NHANH: AUTO TÙY CHỈNH + QUAY LẠI + TIẾN TỚI */}
          <div className="grid grid-cols-4 gap-1.5 bg-black/60 p-1.5 rounded-2xl border border-white/10">
            {/* Nút Auto Tùy Chỉnh Thông Minh */}
            <button
              type="button"
              onClick={handleAutoOptimize}
              className="py-1.5 px-2 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-[10px] rounded-xl flex items-center justify-center gap-1 shadow-md active:scale-95 transition-all cursor-pointer col-span-2"
              title="Tự động nhận diện góc đẹp, zoom chuẩn và cân bằng màu sắc cho livestream"
            >
              <Wand2 size={12} className="animate-spin" />
              <span>AUTO TÙY CHỈNH AI</span>
            </button>

            {/* Nút Quay Lại (Undo) */}
            <button
              type="button"
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="py-1.5 px-2 bg-white/10 hover:bg-white/20 disabled:opacity-30 text-gray-200 font-bold text-[10px] rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer"
              title="Quay lại thao tác trước"
            >
              <Undo size={11} />
              <span>Quay Lại</span>
            </button>

            {/* Nút Tiến Tới (Redo) */}
            <button
              type="button"
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="py-1.5 px-2 bg-white/10 hover:bg-white/20 disabled:opacity-30 text-gray-200 font-bold text-[10px] rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer"
              title="Tiến tới thao tác tiếp theo"
            >
              <Redo size={11} />
              <span>Tiến Tới</span>
            </button>
          </div>

          {/* NÚT XÁC NHẬN ÁP DỤNG */}
          <button
            type="button"
            onClick={handleConfirmAction}
            className={`w-full py-2 rounded-2xl font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg ${
              autoConfirmed
                ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-300'
                : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white shadow-emerald-600/30'
            }`}
          >
            <CheckCheck size={14} />
            <span>{autoConfirmed ? '✓ ĐÃ XÁC NHẬN & LƯU ÁP DỤNG THÀNH CÔNG!' : 'XÁC NHẬN ÁP DỤNG CÀI ĐẶT'}</span>
          </button>

          {/* 🌟 BỘ ĐIỀU KHIỂN SO SÁNH TRƯỚC / SAU & KHÔI PHỤC CAMERA GỐC */}
          <div className="bg-gradient-to-r from-cyan-950/80 via-slate-900 to-emerald-950/80 p-2.5 rounded-2xl border border-cyan-500/40 space-y-2 shadow-md">
            <div className="flex items-center justify-between text-[10px]">
              <span className="font-black text-cyan-300 flex items-center gap-1.5 uppercase">
                <Eye size={13} className="text-cyan-400" />
                So Sánh Trước & Sau Xóa Phông:
              </span>
              <span className="text-[9px] px-2 py-0.5 rounded-md font-bold bg-black/50 text-cyan-300 border border-cyan-500/30">
                {compareMode === 'original' ? '📷 ĐANG XEM GỐC' : compareMode === 'split' ? '🌓 ĐANG CHIA ĐÔI' : '✨ ĐÃ XÓA PHÔNG'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1">
              <button
                type="button"
                onClick={() => setCompareMode('original')}
                className={`py-1.5 px-1 rounded-xl text-[9px] font-black border transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  compareMode === 'original'
                    ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-md ring-1 ring-cyan-200'
                    : 'bg-white/5 border-white/10 text-cyan-300 hover:bg-white/10'
                }`}
                title="Xem toàn bộ Camera Gốc trước khi xóa phông (nguyên bản 100%)"
              >
                <Eye size={11} /> Camera Gốc
              </button>

              <button
                type="button"
                onClick={() => setCompareMode('off')}
                className={`py-1.5 px-1 rounded-xl text-[9px] font-black border transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  compareMode === 'off'
                    ? 'bg-emerald-500 text-slate-950 border-emerald-300 shadow-md ring-1 ring-emerald-200'
                    : 'bg-white/5 border-white/10 text-emerald-300 hover:bg-white/10'
                }`}
                title="Xem kết quả sau khi đã xóa phông AI"
              >
                <Sparkles size={11} /> Sau Xóa Nền
              </button>

              <button
                type="button"
                onClick={() => setCompareMode(prev => prev === 'split' ? 'off' : 'split')}
                className={`py-1.5 px-1 rounded-xl text-[9px] font-black border transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  compareMode === 'split'
                    ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md ring-1 ring-amber-200'
                    : 'bg-white/5 border-white/10 text-amber-300 hover:bg-white/10'
                }`}
                title="Chia đôi màn hình 50/50 để so sánh trực tiếp trước và sau xóa"
              >
                <SplitSquareVertical size={11} /> Chia Đôi 50/50
              </button>
            </div>

            {compareMode === 'split' && (
              <div className="flex items-center justify-between pt-1 text-[9px] bg-black/40 p-1.5 rounded-xl border border-white/10">
                <span className="text-gray-300 font-bold">Vạch Chia So Sánh: {compareSplitPos}%</span>
                <input
                  type="range" min="10" max="90"
                  value={compareSplitPos}
                  onChange={(e) => setCompareSplitPos(Number(e.target.value))}
                  className="w-32 accent-cyan-400 h-1 bg-gray-700 rounded-lg cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* 🌟 NÚT CHỌN NGUỒN CAMERA: MÁY TÍNH vs ĐIỆN THOẠI */}
          <div className="grid grid-cols-2 gap-2 bg-black/60 p-1.5 rounded-2xl border border-white/10">
            <button
              type="button"
              onClick={() => {
                setVideoSource('computer');
                pushHistorySnapshot();
              }}
              className={`py-1.5 px-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                videoSource === 'computer'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-400'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Monitor size={13} />
              <span>Camera Máy Tính</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setVideoSource('phone');
                setActiveTab('phone_qr');
                pushHistorySnapshot();
              }}
              className={`py-1.5 px-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer relative ${
                videoSource === 'phone'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 ring-2 ring-blue-400'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Smartphone size={13} />
              <span>Camera Điện Thoại</span>
              {phoneConnectStatus === 'connected' && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute top-2 right-2" />
              )}
            </button>
          </div>

          {/* THANH 6 TABS CHỨC NĂNG NỔI BẬT */}
          <div className="grid grid-cols-6 gap-1 bg-white/5 p-1 rounded-2xl border border-white/10">
            {[
              { id: 'bg', label: 'Xóa Nền', icon: Sparkles },
              { id: 'brush', label: 'Cọ Thẳng', icon: Paintbrush },
              { id: 'crop', label: 'Cắt Góc', icon: Scissors },
              { id: 'move8', label: '8 Hướng', icon: Compass },
              { id: 'angles', label: 'Đa Góc', icon: Layers },
              { id: 'phone_qr', label: 'Mã QR ĐT', icon: QrCode }
            ].map(tab => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 text-[9px] font-black rounded-xl transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    isActive 
                      ? 'bg-gradient-to-b from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/30 ring-1 ring-emerald-300 scale-105' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <TabIcon size={13} className={isActive ? 'text-white' : 'text-gray-400'} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* ========================================================================= */}
          {/* TAB 1: XÓA PHÔNG NỀN AI (1-CHẠM KẾT HỢP ĐA KIỂU & BẢO VỆ SẢN PHẨM)         */}
          {/* ========================================================================= */}
          {activeTab === 'bg' && (
            <div className="space-y-2.5 animate-in fade-in">
              {/* Thanh Chế Độ Xem Trước Nền Gốc */}
              <div className="flex items-center justify-between bg-black/50 p-2 rounded-2xl border border-white/10">
                <span className="text-[10px] font-bold text-gray-300 flex items-center gap-1.5">
                  <Eye size={12} className="text-cyan-400" /> So Sánh Nền Gốc Mờ (Ghost):
                </span>
                <button
                  type="button"
                  onClick={() => setShowGhostOverlay(prev => !prev)}
                  className={`px-2.5 py-1 rounded-xl text-[9px] font-black border transition-all cursor-pointer ${
                    showGhostOverlay
                      ? 'bg-cyan-500 text-slate-950 border-cyan-300'
                      : 'bg-white/10 text-gray-300 border-white/15 hover:bg-white/20'
                  }`}
                >
                  {showGhostOverlay ? '✓ ĐANG BẬT BÓNG MỜ' : 'TẮT BÓNG MỜ'}
                </button>
              </div>

              {/* Chế Độ Tách Nền */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[10px] uppercase font-black text-gray-400 tracking-wider">Chế Độ Xóa Nền AI Siêu Sạch:</label>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/40">
                    {segStatus === 'ready' ? '⚡ AI MEDIAPIPE SẴN SÀNG' : '⏳ ĐANG TẢI AI'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'ai_person', label: '🪄 AI Tách Đa Phông', desc: 'Xóa mọi loại phòng' },
                    { id: 'desk_product', label: '🪑 Giữ Bàn Ghế & SP', desc: 'Livestream bán hàng' },
                    { id: 'chroma_green', label: '🟢 Phông Xanh Lá', desc: 'Chroma Key 60FPS' },
                    { id: 'chroma_blue', label: '🔵 Phông Xanh Dương', desc: 'Blue Screen Key' },
                    { id: 'none', label: '📷 Nền Gốc (Tắt)', desc: 'Không xóa nền' }
                  ].map(m => {
                    const isSelected = bgRemovalConfig.mode === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          setBgRemovalConfig(prev => ({ ...prev, mode: m.id }));
                          pushHistorySnapshot();
                        }}
                        className={`p-2 rounded-xl text-left border transition-all cursor-pointer relative ${
                          isSelected
                            ? 'bg-emerald-950/80 border-emerald-400 ring-2 ring-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                            : 'bg-white/5 border-white/10 hover:border-white/20 text-gray-300'
                        }`}
                      >
                        <div className="text-[11px] font-black flex items-center justify-between">
                          <span>{m.label}</span>
                          {isSelected && <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />}
                        </div>
                        <div className="text-[9px] text-gray-400 truncate">{m.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* TÙY CHỌN BẢO VỆ SẢN PHẨM & STREAMER */}
              <div className="bg-black/50 p-2.5 rounded-2xl border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-cyan-300 flex items-center gap-1">
                    <ShieldCheck size={12} className="text-cyan-400" /> Bảo Vệ Sản Phẩm Livestream:
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setBgRemovalConfig(prev => ({ ...prev, protectProduct: !prev.protectProduct }));
                      pushHistorySnapshot();
                    }}
                    className={`px-2 py-0.5 rounded-lg text-[9px] font-bold border transition-all cursor-pointer ${
                      bgRemovalConfig.protectProduct
                        ? 'bg-cyan-500 border-cyan-300 text-slate-950 font-black'
                        : 'bg-white/10 border-white/15 text-gray-400'
                    }`}
                  >
                    {bgRemovalConfig.protectProduct ? '✓ ĐANG BẬT BẢO VỆ SP' : 'TẮT BẢO VỆ'}
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                  {[
                    { key: 'product', label: 'Sản Phẩm Live' },
                    { key: 'person', label: 'Streamer' },
                    { key: 'computer', label: 'Máy Tính' },
                    { key: 'desk', label: 'Bàn Live' },
                    { key: 'chair', label: 'Ghế Ngồi' },
                    { key: 'shelf', label: 'Kệ Hàng' }
                  ].map(obj => {
                    const active = bgRemovalConfig.keepObjects[obj.key];
                    return (
                      <button
                        key={obj.key}
                        type="button"
                        onClick={() => {
                          setBgRemovalConfig(prev => ({
                            ...prev,
                            keepObjects: { ...prev.keepObjects, [obj.key]: !active }
                          }));
                          pushHistorySnapshot();
                        }}
                        className={`py-1 px-1.5 rounded-lg border text-center font-bold transition-all cursor-pointer ${
                          active 
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' 
                            : 'bg-white/5 border-white/10 text-gray-400'
                        }`}
                      >
                        {active ? '✓ ' : ''}{obj.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Độ nhạy & Làm mịn viền */}
              <div className="space-y-1.5 bg-white/5 p-2 rounded-2xl border border-white/10">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-gray-300 font-bold">Độ Nhạy Tách Nền: {bgRemovalConfig.sensitivity}%</span>
                  <input 
                    type="range" min="10" max="95" 
                    value={bgRemovalConfig.sensitivity}
                    onChange={(e) => setBgRemovalConfig(prev => ({ ...prev, sensitivity: Number(e.target.value) }))}
                    className="w-32 accent-emerald-400 h-1.5 bg-gray-700 rounded-lg cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-gray-300 font-bold">Khử Viền Tràn Màu: {bgRemovalConfig.spillReduction}%</span>
                  <input 
                    type="range" min="0" max="100" 
                    value={bgRemovalConfig.spillReduction}
                    onChange={(e) => setBgRemovalConfig(prev => ({ ...prev, spillReduction: Number(e.target.value) }))}
                    className="w-32 accent-teal-400 h-1.5 bg-gray-700 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: CỌ QUÉT THẲNG HÀNG NGANG DỌC & CỌ VUÔNG VỨC NGAY HÀNG THẲNG LỐI    */}
          {/* ========================================================================= */}
          {activeTab === 'brush' && (
            <div className="space-y-2.5 animate-in fade-in">
              <div className="bg-black/50 p-2.5 rounded-2xl border border-white/10 space-y-2">
                
                {/* Chế độ Cọ */}
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setBrushMode('erase')}
                    className={`p-2 rounded-xl text-center border font-black text-[11px] transition-all cursor-pointer ${
                      brushMode === 'erase'
                        ? 'bg-rose-600 border-rose-400 text-white ring-2 ring-rose-400 shadow-lg'
                        : 'bg-white/5 border-white/10 text-rose-300 hover:bg-rose-500/20'
                    }`}
                  >
                    🔴 CỌ CÀ XÓA NỀN
                  </button>

                  <button
                    type="button"
                    onClick={() => setBrushMode('keep')}
                    className={`p-2 rounded-xl text-center border font-black text-[11px] transition-all cursor-pointer ${
                      brushMode === 'keep'
                        ? 'bg-emerald-600 border-emerald-400 text-white ring-2 ring-emerald-400 shadow-lg'
                        : 'bg-white/5 border-white/10 text-emerald-300 hover:bg-emerald-500/20'
                    }`}
                  >
                    🟢 CỌ GIỮ SẢN PHẨM
                  </button>

                  <button
                    type="button"
                    onClick={() => setBrushMode('none')}
                    className={`p-2 rounded-xl text-center border font-bold text-[10px] transition-all cursor-pointer ${
                      brushMode === 'none'
                        ? 'bg-slate-700 border-slate-400 text-white ring-2 ring-slate-400'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    ⚪ TẮT CỌ (XEM)
                  </button>
                </div>

                {/* 📏 THANH CANH CỌ THẲNG HÀNG NGANG DỌC (RULER AXIS LOCK & GRID) */}
                <div className="bg-white/5 p-2 rounded-xl border border-white/10 space-y-1.5">
                  <span className="text-[10px] font-black uppercase text-amber-300 flex items-center justify-between">
                    <span>Thanh Canh Ngay Hàng Thẳng Lối:</span>
                    <button
                      type="button"
                      onClick={() => setShowGridGuides(prev => !prev)}
                      className={`px-2 py-0.5 rounded-lg text-[9px] font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                        showGridGuides ? 'bg-cyan-500 text-black border-cyan-300' : 'bg-black/40 text-gray-300 border-white/10'
                      }`}
                    >
                      <Hash size={10} /> Lưới Thước Canh
                    </button>
                  </span>

                  <div className="grid grid-cols-3 gap-1">
                    {[
                      { id: 'free', label: 'Tự Do 360°', icon: Crosshair },
                      { id: 'horizontal', label: '↔️ Khóa Ngang', icon: AlignHorizontalJustifyCenter },
                      { id: 'vertical', label: '↕️ Khóa Dọc', icon: AlignVerticalJustifyCenter }
                    ].map(axis => (
                      <button
                        key={axis.id}
                        type="button"
                        onClick={() => setBrushAxisLock(axis.id)}
                        className={`py-1 text-[9px] font-bold rounded-lg border transition-all cursor-pointer ${
                          brushAxisLock === axis.id 
                            ? 'bg-amber-500 text-slate-950 border-amber-300 font-black' 
                            : 'bg-black/30 border-white/10 text-gray-300'
                        }`}
                      >
                        {axis.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chọn Đầu Cọ Vuông Vức & Tròn */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-gray-300 font-bold">Hình Dạng Đầu Cọ:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setBrushShape('square')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black border transition-all cursor-pointer flex items-center gap-1 ${
                        brushShape === 'square' 
                          ? 'bg-amber-600 border-amber-400 text-white shadow-md' 
                          : 'bg-white/5 border-white/10 text-gray-400'
                      }`}
                    >
                      <Square size={10} /> Cọ Vuông Vức
                    </button>
                    <button
                      type="button"
                      onClick={() => setBrushShape('round')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black border transition-all cursor-pointer flex items-center gap-1 ${
                        brushShape === 'round' 
                          ? 'bg-indigo-600 border-indigo-400 text-white shadow-md' 
                          : 'bg-white/5 border-white/10 text-gray-400'
                      }`}
                    >
                      <Circle size={10} /> Cọ Tròn
                    </button>
                  </div>
                </div>

                {/* Kích thước cọ chuẩn */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[10px] text-gray-300 font-bold">
                    <span>Kích Thước Đầu Cọ:</span>
                    <span className="font-mono text-amber-400 font-bold">{brushSize}px</span>
                  </div>
                  <div className="grid grid-cols-5 gap-1 pt-0.5">
                    {[
                      { s: 15, label: '15px Nhỏ' },
                      { s: 30, label: '30px Vừa' },
                      { s: 50, label: '50px Lớn' },
                      { s: 80, label: '80px To' },
                      { s: 120, label: '120px Khối' }
                    ].map(bs => (
                      <button
                        key={bs.s}
                        type="button"
                        onClick={() => setBrushSize(bs.s)}
                        className={`py-1 text-[9px] font-bold rounded-lg border transition-all cursor-pointer ${
                          brushSize === bs.s 
                            ? 'bg-amber-500 text-slate-950 border-amber-300 font-black' 
                            : 'bg-white/5 border-white/10 text-gray-300'
                        }`}
                      >
                        {bs.label}
                      </button>
                    ))}
                  </div>
                  <input 
                    type="range" min="5" max="150" 
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                    className="w-full accent-amber-500 h-1.5 bg-gray-700 rounded-lg cursor-pointer mt-1"
                  />
                </div>

                {/* Nút Hoàn tác & Xóa sạch nét vẽ */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setBrushStrokes(prev => prev.slice(0, -1));
                      pushHistorySnapshot();
                    }}
                    disabled={brushStrokes.length === 0}
                    className="flex-1 py-1.5 bg-white/10 hover:bg-white/20 disabled:opacity-40 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
                  >
                    <Undo size={11} /> Hoàn Tác ({brushStrokes.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setBrushStrokes([]);
                      pushHistorySnapshot();
                    }}
                    disabled={brushStrokes.length === 0}
                    className="flex-1 py-1.5 bg-rose-600/30 hover:bg-rose-600 disabled:opacity-40 text-rose-200 hover:text-white rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
                  >
                    <Trash2 size={11} /> Xóa Hết Nét
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: CẮT XÉN SIÊU MƯỢT BẤT KỲ CẠNH NÀO GÓC NÀO (CROP ENGINE)            */}
          {/* ========================================================================= */}
          {activeTab === 'crop' && (
            <div className="space-y-2.5 animate-in fade-in">
              <div className="bg-black/50 p-2.5 rounded-2xl border border-white/10 space-y-2">
                <span className="text-[10px] font-black uppercase text-amber-300 block">Cắt Khung 4 Cạnh Đa Hướng:</span>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div>
                    <div className="flex justify-between text-gray-400"><span>Cạnh Trên:</span><span className="font-bold text-amber-400">{cropConfig.cropTop}%</span></div>
                    <input 
                      type="range" min="0" max="70" 
                      value={cropConfig.cropTop}
                      onChange={(e) => setCropConfig(prev => ({ ...prev, cropTop: Number(e.target.value) }))}
                      className="w-full accent-amber-400 h-1.5 bg-gray-700 rounded-lg cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-gray-400"><span>Cạnh Dưới:</span><span className="font-bold text-amber-400">{cropConfig.cropBottom}%</span></div>
                    <input 
                      type="range" min="0" max="70" 
                      value={cropConfig.cropBottom}
                      onChange={(e) => setCropConfig(prev => ({ ...prev, cropBottom: Number(e.target.value) }))}
                      className="w-full accent-amber-400 h-1.5 bg-gray-700 rounded-lg cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-gray-400"><span>Cạnh Trái:</span><span className="font-bold text-amber-400">{cropConfig.cropLeft}%</span></div>
                    <input 
                      type="range" min="0" max="70" 
                      value={cropConfig.cropLeft}
                      onChange={(e) => setCropConfig(prev => ({ ...prev, cropLeft: Number(e.target.value) }))}
                      className="w-full accent-amber-400 h-1.5 bg-gray-700 rounded-lg cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-gray-400"><span>Cạnh Phải:</span><span className="font-bold text-amber-400">{cropConfig.cropRight}%</span></div>
                    <input 
                      type="range" min="0" max="70" 
                      value={cropConfig.cropRight}
                      onChange={(e) => setCropConfig(prev => ({ ...prev, cropRight: Number(e.target.value) }))}
                      className="w-full accent-amber-400 h-1.5 bg-gray-700 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Xóa Vát 4 Góc Tự Do */}
              <div className="bg-black/50 p-2.5 rounded-2xl border border-white/10 space-y-2">
                <span className="text-[10px] font-black uppercase text-cyan-300 block">Xóa Vát 4 Góc Đa Hướng (Corner Eraser):</span>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div>
                    <div className="flex justify-between text-gray-400"><span>Góc Trái Trên:</span><span className="font-bold text-cyan-400">{cropConfig.cornerTL}%</span></div>
                    <input 
                      type="range" min="0" max="50" 
                      value={cropConfig.cornerTL}
                      onChange={(e) => setCropConfig(prev => ({ ...prev, cornerTL: Number(e.target.value) }))}
                      className="w-full accent-cyan-400 h-1 bg-gray-700 rounded-lg cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-gray-400"><span>Góc Phải Trên:</span><span className="font-bold text-cyan-400">{cropConfig.cornerTR}%</span></div>
                    <input 
                      type="range" min="0" max="50" 
                      value={cropConfig.cornerTR}
                      onChange={(e) => setCropConfig(prev => ({ ...prev, cornerTR: Number(e.target.value) }))}
                      className="w-full accent-cyan-400 h-1 bg-gray-700 rounded-lg cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-gray-400"><span>Góc Trái Dưới:</span><span className="font-bold text-cyan-400">{cropConfig.cornerBL}%</span></div>
                    <input 
                      type="range" min="0" max="50" 
                      value={cropConfig.cornerBL}
                      onChange={(e) => setCropConfig(prev => ({ ...prev, cornerBL: Number(e.target.value) }))}
                      className="w-full accent-cyan-400 h-1 bg-gray-700 rounded-lg cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-gray-400"><span>Góc Phải Dưới:</span><span className="font-bold text-cyan-400">{cropConfig.cornerBR}%</span></div>
                    <input 
                      type="range" min="0" max="50" 
                      value={cropConfig.cornerBR}
                      onChange={(e) => setCropConfig(prev => ({ ...prev, cornerBR: Number(e.target.value) }))}
                      className="w-full accent-cyan-400 h-1 bg-gray-700 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: ĐIỀU HƯỚNG 8 HƯỚNG D-PAD SIÊU MƯỢT                                  */}
          {/* ========================================================================= */}
          {activeTab === 'move8' && (
            <div className="space-y-2.5 animate-in fade-in">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] text-gray-300 font-bold">Tốc Độ Bước Nhảy:</span>
                <div className="flex gap-1">
                  {[
                    { s: 10, label: '1x (10%)' },
                    { s: 20, label: '2x (20%)' },
                    { s: 35, label: '⚡ Turbo (35%)' }
                  ].map(sp => (
                    <button
                      key={sp.s}
                      type="button"
                      onClick={() => setMoveSpeedStep(sp.s)}
                      className={`px-2 py-0.5 text-[9px] font-bold rounded-lg border transition-all cursor-pointer ${
                        moveSpeedStep === sp.s 
                          ? 'bg-emerald-600 border-emerald-400 text-white' 
                          : 'bg-white/5 border-white/10 text-gray-400'
                      }`}
                    >
                      {sp.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-center justify-center gap-1.5 bg-black/50 p-3 rounded-2xl border border-white/10">
                <div className="flex items-center gap-1.5">
                  <button type="button" onClick={() => move8Way(-1, -1)} className="w-12 h-10 rounded-xl bg-white/10 hover:bg-emerald-500 hover:text-black font-black text-sm flex items-center justify-center active:scale-90 cursor-pointer">↖️</button>
                  <button type="button" onClick={() => move8Way(0, -1)} className="w-14 h-10 rounded-xl bg-gradient-to-b from-emerald-600 to-teal-700 text-white font-black text-sm flex items-center justify-center active:scale-90 cursor-pointer">⬆️</button>
                  <button type="button" onClick={() => move8Way(1, -1)} className="w-12 h-10 rounded-xl bg-white/10 hover:bg-emerald-500 hover:text-black font-black text-sm flex items-center justify-center active:scale-90 cursor-pointer">↗️</button>
                </div>
                <div className="flex items-center gap-1.5">
                  <button type="button" onClick={() => move8Way(-1, 0)} className="w-12 h-10 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black text-sm flex items-center justify-center active:scale-90 cursor-pointer">⬅️</button>
                  <button type="button" onClick={() => setCamTransform(prev => ({ ...prev, panX: 0, panY: 0 }))} className="w-14 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white font-black text-[10px] flex flex-col items-center justify-center active:scale-90 cursor-pointer"><RefreshCw size={11} /><span>GIỮA</span></button>
                  <button type="button" onClick={() => move8Way(1, 0)} className="w-12 h-10 rounded-xl bg-gradient-to-r from-teal-700 to-emerald-600 text-white font-black text-sm flex items-center justify-center active:scale-90 cursor-pointer">➡️</button>
                </div>
                <div className="flex items-center gap-1.5">
                  <button type="button" onClick={() => move8Way(-1, 1)} className="w-12 h-10 rounded-xl bg-white/10 hover:bg-emerald-500 hover:text-black font-black text-sm flex items-center justify-center active:scale-90 cursor-pointer">↙️</button>
                  <button type="button" onClick={() => move8Way(0, 1)} className="w-14 h-10 rounded-xl bg-gradient-to-t from-emerald-600 to-teal-700 text-white font-black text-sm flex items-center justify-center active:scale-90 cursor-pointer">⬇️</button>
                  <button type="button" onClick={() => move8Way(1, 1)} className="w-12 h-10 rounded-xl bg-white/10 hover:bg-emerald-500 hover:text-black font-black text-sm flex items-center justify-center active:scale-90 cursor-pointer">↘️</button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-white/5 p-2 rounded-xl text-[11px]">
                <div><span className="text-gray-400">Tọa Độ X:</span> <span className="font-mono font-bold text-emerald-400">{camTransform.panX}%</span></div>
                <div><span className="text-gray-400">Tọa Độ Y:</span> <span className="font-mono font-bold text-cyan-400">{camTransform.panY}%</span></div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: ĐA GÓC, ZOOM, XOAY, NGHIÊNG 3D & TỈ LỆ KHUNG                      */}
          {/* ========================================================================= */}
          {activeTab === 'angles' && (
            <div className="space-y-2.5 animate-in fade-in">
              <div className="bg-black/50 p-2.5 rounded-2xl border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-gray-300 font-bold flex items-center gap-1"><ZoomIn size={12} /> Phóng To (Zoom):</span>
                  <span className="font-mono font-bold text-cyan-400">{camTransform.zoom.toFixed(1)}x</span>
                </div>
                <input 
                  type="range" min="5" max="35" step="1"
                  value={Math.round(camTransform.zoom * 10)}
                  onChange={(e) => setCamTransform(prev => ({ ...prev, zoom: Number(e.target.value) / 10 }))}
                  className="w-full accent-cyan-500 h-1.5 bg-gray-700 rounded-lg cursor-pointer"
                />

                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="text-gray-300 font-bold flex items-center gap-1"><RotateCw size={12} /> Xoay Góc:</span>
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
                      <span className="font-mono text-pink-400 font-bold">{camTransform.tiltX}°</span>
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
                      <span className="font-mono text-pink-400 font-bold">{camTransform.tiltY}°</span>
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

              {/* Lật gương & Tỉ lệ khung */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCamTransform(prev => ({ ...prev, flipH: !prev.flipH }))}
                  className={`py-1.5 text-center text-[10px] font-bold rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    camTransform.flipH ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-white/5 border-white/10 text-gray-300'
                  }`}
                >
                  <FlipHorizontal size={12} /> Lật Gương Ngang
                </button>
                <button
                  type="button"
                  onClick={() => setCamTransform(prev => ({ ...prev, flipV: !prev.flipV }))}
                  className={`py-1.5 text-center text-[10px] font-bold rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    camTransform.flipV ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-white/5 border-white/10 text-gray-300'
                  }`}
                >
                  <FlipVertical size={12} /> Lật Gương Dọc
                </button>
              </div>

              <div className="grid grid-cols-4 gap-1">
                {[
                  { r: 'custom', label: 'Tự Do 8 Hướng' },
                  { r: '16/9', label: '16:9 Ngang' },
                  { r: '9/16', label: '9:16 Dọc' },
                  { r: 'circle', label: 'Tròn PiP' }
                ].map(aspect => (
                  <button
                    key={aspect.r}
                    type="button"
                    onClick={() => setCamTransform(prev => ({ ...prev, aspectRatio: aspect.r }))}
                    className={`py-1.5 text-center text-[10px] font-bold rounded-xl border transition-all cursor-pointer ${
                      camTransform.aspectRatio === aspect.r 
                        ? 'bg-emerald-600 border-emerald-400 text-white ring-1 ring-emerald-300' 
                        : 'bg-white/5 border-white/10 text-gray-300'
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
            <div className="space-y-2.5 animate-in fade-in">
              <div className="bg-gradient-to-r from-blue-950/70 to-indigo-950/70 p-3 rounded-3xl border border-blue-500/40 text-center space-y-2">
                <div className="flex items-center justify-center gap-1.5 text-blue-300 font-black text-xs">
                  <Smartphone size={15} className="text-blue-400" /> KẾT NỐI CAMERA IPHONE / ANDROID
                </div>
                
                {/* Trạng thái kết nối */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 border border-white/15 text-[11px] font-bold">
                  {phoneConnectStatus === 'connected' ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      🟢 Điện Thoại Đã Kết Nối Trực Tiếp
                    </span>
                  ) : (
                    <span className="text-amber-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                      ⏳ Đang Chờ Quét Mã QR...
                    </span>
                  )}
                </div>

                {/* Mã QR Code Kết Nối Nhanh */}
                <div className="flex justify-center p-2 bg-white rounded-2xl shadow-xl inline-block mx-auto">
                  <img 
                    src={qrCodeImgUrl} 
                    alt="Quét Mã QR Kết Nối Camera Điện Thoại"
                    className="w-32 h-32 object-contain"
                  />
                </div>

                <div className="space-y-1 text-left bg-black/50 p-2 rounded-2xl text-[10px] text-gray-300">
                  <div className="font-black text-emerald-400">📱 Hướng dẫn kết nối phát một:</div>
                  <div>1. Mở <b>Camera / Zalo</b> trên điện thoại quét mã QR.</div>
                  <div>2. Cho phép truy cập Camera trên điện thoại.</div>
                  <div>3. Hình ảnh từ điện thoại <b>4K 60FPS</b> lập tức truyền vào máy!</div>
                </div>

                {/* Nút Sao Chép Link & Dùng ngay */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={copyPhoneCamUrl}
                    className="flex-1 py-1.5 px-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-black flex items-center justify-center gap-1 transition-all cursor-pointer shadow-md"
                  >
                    {copiedLink ? <Check size={12} className="text-emerald-300" /> : <Copy size={12} />}
                    <span>{copiedLink ? 'Đã Sao Chép!' : 'Sao Chép Link'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setVideoSource('phone');
                      handleConfirmAction();
                    }}
                    className={`py-1.5 px-3 rounded-xl text-[10px] font-black flex items-center gap-1 transition-all cursor-pointer ${
                      videoSource === 'phone'
                        ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
                        : 'bg-white/10 hover:bg-white/20 text-gray-200'
                    }`}
                  >
                    <CheckCircle2 size={12} /> Dùng Ngay
                  </button>
                </div>
              </div>

              {/* Danh sách Camera Thiết Bị Nhận Diện */}
              {availableDevices.length > 0 && (
                <div className="bg-black/50 p-2 rounded-2xl border border-white/10 space-y-1">
                  <span className="text-[10px] text-gray-400 font-bold block">Thiết Bị Camera Máy Tính:</span>
                  <select 
                    value={selectedDeviceId}
                    onChange={(e) => {
                      setSelectedDeviceId(e.target.value);
                      setVideoSource('computer');
                    }}
                    className="w-full bg-slate-900 border border-white/20 text-white text-[10px] rounded-xl p-1.5 outline-none"
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
