import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, Sparkles, Video, Mic, Volume2, Gauge, HelpCircle, X, Check, Play, Square, 
  Upload, FolderOpen, Layers, ShieldCheck, Info, MessageSquare, Plus, RefreshCw, Eye, BookOpen,
  Move, Maximize2, Palette, Sliders, Image as ImageIcon, Monitor, Smartphone, ChevronRight, LayoutGrid, CheckCircle2,
  Crop, Wand2, ArrowUp, ArrowDown, ArrowUpToLine, ArrowDownToLine, Scaling, ZoomIn, FileVideo, UserCheck, RotateCcw
} from 'lucide-react';
import { 
  ALL_SYSTEM_VOICES, 
  getMultiAvatarConfig, 
  saveMultiAvatarConfig, 
  DEFAULT_MULTI_AVATAR_CONFIG,
  STUDIO_BACKGROUND_PRESETS,
  STUDIO_STAGE_PRESETS,
  previewVoiceAudio,
  stopVoiceAudio,
  isImageMedia,
  getChromaStyle
} from '../../utils/voiceSyncService';
import UniversalMediaPicker from './UniversalMediaPicker';

export const SvgChromaFilters = () => (
  <svg width="0" height="0" className="absolute pointer-events-none opacity-0" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
    <defs>
      {/* 🟢 TÁCH NỀN XANH LÁ SIÊU SẠCH 4K (KHỬ SẠCH ÁM XANH TÓC & VIỀN NGƯỜI) */}
      <filter id="avalive-chroma-green" colorInterpolationFilters="sRGB" x="0%" y="0%" width="100%" height="100%">
        {/* Khử ám xanh (Despill) */}
        <feColorMatrix
          type="matrix"
          values="
            1.00  0.00  0.00  0.00  0.00
            0.35  0.30  0.35  0.00  0.00
            0.00  0.00  1.00  0.00  0.00
            0.00  0.00  0.00  1.00  0.00"
          result="despilled_green"
        />
        {/* Alpha Key Mask (Tách triệt để phông xanh) */}
        <feColorMatrix
          in="SourceGraphic"
          type="matrix"
          values="
            1.00  0.00  0.00  0.00  0.00
            0.00  1.00  0.00  0.00  0.00
            0.00  0.00  1.00  0.00  0.00
            2.60 -3.80  2.60  1.00 -0.10"
          result="alpha_mask_green"
        />
        <feComposite in="despilled_green" in2="alpha_mask_green" operator="in" />
      </filter>

      {/* 🔵 TÁCH NỀN XANH DƯƠNG SIÊU SẠCH 4K */}
      <filter id="avalive-chroma-blue" colorInterpolationFilters="sRGB" x="0%" y="0%" width="100%" height="100%">
        <feColorMatrix
          type="matrix"
          values="
            1.00  0.00  0.00  0.00  0.00
            0.00  1.00  0.00  0.00  0.00
            0.35  0.35  0.30  0.00  0.00
            0.00  0.00  0.00  1.00  0.00"
          result="despilled_blue"
        />
        <feColorMatrix
          in="SourceGraphic"
          type="matrix"
          values="
            1.00  0.00  0.00  0.00  0.00
            0.00  1.00  0.00  0.00  0.00
            0.00  0.00  1.00  0.00  0.00
            2.60  2.60 -3.80  1.00 -0.10"
          result="alpha_mask_blue"
        />
        <feComposite in="despilled_blue" in2="alpha_mask_blue" operator="in" />
      </filter>
    </defs>
  </svg>
);

export const SCRIPT_TEMPLATES = [
  {
    id: 'dual_sales',
    title: '🔥 Kịch Bản 2 Người: Idol Live + Trợ Lý Thúc Giục Chốt Đơn',
    count: 2,
    desc: 'Idol giới thiệu sản phẩm và chia sẻ trải nghiệm, Trợ lý liên tục cập nhật tồn kho và tạo hiệu ứng FOMO giục khách bấm giỏ hàng.',
    script: `[Idol]: Dạ em xin chào cả nhà mình nha! Hôm nay em mang đến một bất ngờ siêu ngọt ngào luôn nè!
[Trợ Lý]: Đúng rồi cả nhà ơi! Bộ phận kho vừa báo số lượng chỉ còn đúng 20 suất ưu đãi giảm 50% cho khách chốt ngay trên live!
[Idol]: Mọi người nhanh tay nhấn ngay vào nút giỏ hàng bên dưới góc trái màn hình nha, hết suất là tiếc lắm đó ạ!
[Trợ Lý]: 5 khách hàng đầu tiên hoàn tất đơn hàng em sẽ tặng thêm 1 phần quà bí mật trị giá 300 ngàn đồng liền tay!`
  },
  {
    id: 'trio_entertainment',
    title: '🎮 Kịch Bản 3 Người: Idol + Trợ Lý + BLV Game PK Hoạt Náo',
    count: 3,
    desc: 'Idol tương tác dễ thương, Trợ lý chăm sóc đơn hàng và BLV Game bùng nổ năng lượng khuấy động không khí livestream.',
    script: `[Idol]: Hello cả nhà iu! Hôm nay phòng live của chúng ta có trận thách đấu PK siêu gay cấn luôn nha!
[BLV Game]: Chào mừng 500 anh em đã có mặt! Chuẩn bị đếm ngược 10 giây trước khi trận combat bùng nổ, anh em cùng thả tim triệu view nào!
[Trợ Lý]: Đội ngũ trợ lý đã sẵn sàng mở kho quà tặng độc quyền cho ai đóng góp điểm số cao nhất trong hiệp đấu này!
[Idol]: Mọi người cùng chung tay giúp em giành chiến thắng nha, yêu cả nhà mình nhiều lắm!
[BLV Game]: 3, 2, 1, Bùng nổ nào anh em ơi!`
  },
  {
    id: 'squad_talkshow',
    title: '🎙️ Kịch Bản 4 Người: Talkshow Đa Chiều & Khách Mời Chuyên Gia',
    count: 4,
    desc: 'Idol dẫn dắt chương trình, Chuyên gia phân tích giải pháp, Trợ lý tổng hợp ý kiến và Khách mời chia sẻ trải nghiệm thực tế.',
    script: `[Idol]: Chào mừng quý vị khán giả đến với buổi tọa đàm trực tiếp hôm nay!
[Khách Mời]: Cảm ơn bạn đã mời tôi, tôi rất vui khi được chia sẻ những kinh nghiệm thực tế cùng quý vị.
[Trợ Lý]: Đã có rất nhiều câu hỏi gửi về từ phía khán giả đang xem live rồi ạ!
[BLV Game]: Không để quý vị chờ lâu nữa, chúng ta hãy cùng bắt đầu chủ đề thảo luận siêu hấp dẫn ngày hôm nay ngay bây giờ!`
  }
];

const toast = {
  success: (msg) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('avalive_toast', { detail: { type: 'success', message: msg } }));
    }
  },
  error: (msg) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('avalive_toast', { detail: { type: 'error', message: msg } }));
    }
  },
  info: (msg) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('avalive_toast', { detail: { type: 'info', message: msg } }));
    }
  }
};

export function MultiAvatarStudioPanel({ onApplyScriptTemplate, isEmbedded = false, onClose = null }) {
  const [config, setConfig] = useState(() => getMultiAvatarConfig());
  const [activeTab, setActiveTab] = useState('canvas'); // 'canvas', 'templates'
  const [selectedAvatarId, setSelectedAvatarId] = useState('avatar_1'); // 'avatar_1' | 'avatar_2' | ... | 'studio_background'
  const [inspectorTab, setInspectorTab] = useState('media_transform'); // 'media_transform', 'chroma', 'voice', 'background'
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState(null); // { avatarId, type: 'idle' | 'talk' }
  const [previewingVoiceId, setPreviewingVoiceId] = useState(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [canvasAspectRatio, setCanvasAspectRatio] = useState('9:16'); // '9:16' | '16:9'
  const [customScriptText, setCustomScriptText] = useState('');
  const [scriptFilterCount, setScriptFilterCount] = useState('all'); // 'all' | 2 | 3 | 4

  // Drag & Resize state (Canva / TikTok Live Studio Style)
  const [dragOperation, setDragOperation] = useState(null); // { targetId, mode: 'move' | 'nw' | 'ne' | 'se' | 'sw' | 'n' | 's' | 'w' | 'e' }
  const canvasRef = useRef(null);
  const dragStartPosRef = useRef({ mouseX: 0, mouseY: 0, startX: 0, startY: 0, startW: 50, startH: 50, startScale: 100 });

  const handleScriptFileUpload = (e, templateTarget = null) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      const content = loadEvt.target?.result || '';
      if (content) {
        if (templateTarget) {
          if (onApplyScriptTemplate) {
            onApplyScriptTemplate(content, templateTarget.count || activeCount);
          }
          toast.success(`📁 Đã nạp file "${file.name}" và áp dụng kịch bản thành công!`);
          if (onClose) onClose();
        } else {
          setCustomScriptText(content);
          toast.success(`📁 Đã nạp file "${file.name}" vào trình soạn thảo kịch bản!`);
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  useEffect(() => {
    const loaded = getMultiAvatarConfig();
    setConfig(loaded);
  }, []);

  const safeAvatars = (config.avatars && config.avatars.length > 0) ? config.avatars : DEFAULT_MULTI_AVATAR_CONFIG.avatars;
  const activeCount = Math.min(4, Math.max(2, config.activeCount || 2));
  const activeAvatars = safeAvatars.slice(0, activeCount);
  const isBgSelected = selectedAvatarId === 'studio_background';
  const selectedAvatar = safeAvatars.find(a => a.id === selectedAvatarId) || safeAvatars[0] || DEFAULT_MULTI_AVATAR_CONFIG.avatars[0];
  const bgTransform = config.backgroundTransform || DEFAULT_MULTI_AVATAR_CONFIG.backgroundTransform;

  const handleToggleEnabled = (forceVal) => {
    const nextVal = typeof forceVal === 'boolean' ? forceVal : !config.enabled;
    const updated = { ...config, enabled: nextVal };
    setConfig(updated);
    saveMultiAvatarConfig(updated);
    if (nextVal) {
      toast.success('✅ Đã BẬT chế độ Studio 2–4 Avatar cho phòng Live!');
    } else {
      toast.info('⏹️ Đã TẮT Studio 2–4 Avatar, phòng Live trở về 1 Avatar tiêu chuẩn.');
    }
  };

  const handleActiveCountChange = (count) => {
    const updated = {
      ...config,
      activeCount: count,
      avatars: safeAvatars.map((av, idx) => ({
        ...av,
        enabled: idx < count
      }))
    };
    setConfig(updated);
    saveMultiAvatarConfig(updated);
  };

  const handleAvatarChange = (avatarId, field, value) => {
    setConfig(prev => {
      const currentAvatars = prev.avatars || DEFAULT_MULTI_AVATAR_CONFIG.avatars;
      const updatedAvatars = currentAvatars.map(av => {
        if (av.id === avatarId) {
          const updated = { ...av, [field]: value };
          // Tự động đồng bộ video nói <-> video lắng nghe nếu người dùng mới nạp 1 file
          if (field === 'talkVideo' && value && !av.idleVideo) {
            updated.idleVideo = value;
          } else if (field === 'idleVideo' && value && !av.talkVideo) {
            updated.talkVideo = value;
          }
          return updated;
        }
        return av;
      });
      const updatedConfig = {
        ...prev,
        avatars: updatedAvatars
      };
      saveMultiAvatarConfig(updatedConfig);
      return updatedConfig;
    });
  };

  const handleAvatarChromaBatch = (avatarId, changes) => {
    setConfig(prev => {
      const currentAvatars = prev.avatars || DEFAULT_MULTI_AVATAR_CONFIG.avatars;
      const updated = {
        ...prev,
        avatars: currentAvatars.map(av => {
          if (av.id === avatarId) {
            const currentChroma = av.chromaKey || { enabled: false, color: '#00ff00', similarity: 0.45, smoothness: 0.15, spill: 0.15, mode: 'green' };
            return {
              ...av,
              chromaKey: {
                ...currentChroma,
                ...changes
              }
            };
          }
          return av;
        })
      };
      saveMultiAvatarConfig(updated);
      return updated;
    });
  };

  const handleAvatarChromaChange = (avatarId, field, value) => {
    handleAvatarChromaBatch(avatarId, { [field]: value });
  };

  const handleAvatarTransformBatch = (avatarId, changes) => {
    setConfig(prev => {
      const currentAvatars = prev.avatars || DEFAULT_MULTI_AVATAR_CONFIG.avatars;
      const updated = {
        ...prev,
        layoutMode: 'custom_canvas',
        avatars: currentAvatars.map(av => {
          if (av.id === avatarId) {
            return {
              ...av,
              transform: {
                ...(av.transform || { x: 10, y: 10, width: 45, height: 75, zIndex: 1, pose: 'stand', objectFit: 'cover', borderRadius: 16 }),
                ...changes
              }
            };
          }
          return av;
        })
      };
      saveMultiAvatarConfig(updated);
      return updated;
    });
  };

  const handleAvatarTransformChange = (avatarId, field, value) => {
    handleAvatarTransformBatch(avatarId, { [field]: value });
  };

  // BACKGROUND TRANSFORM HANDLERS (Canh chỉnh, kéo thả, co giãn ảnh nền Studio)
  const handleBackgroundTransformBatch = (changes) => {
    setConfig(prev => {
      const currentBg = prev.backgroundTransform || DEFAULT_MULTI_AVATAR_CONFIG.backgroundTransform;
      const updated = {
        ...prev,
        backgroundTransform: {
          ...currentBg,
          ...changes
        }
      };
      saveMultiAvatarConfig(updated);
      return updated;
    });
  };

  const handleBackgroundTransformChange = (field, value) => {
    handleBackgroundTransformBatch({ [field]: value });
  };

  const handleResetBackground = () => {
    handleBackgroundTransformBatch({
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      scale: 100,
      objectFit: 'cover',
      blur: 0,
      brightness: 100
    });
  };

  const handleDirectAvatarFileUpload = (avatarId, field, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        const dataUrl = loadEvt.target?.result;
        if (dataUrl) {
          handleAvatarChange(avatarId, field, dataUrl);
          toast.success(`🖼️ Đã nạp ảnh thành công!`);
        }
      };
      reader.readAsDataURL(file);
    } else {
      const objectUrl = URL.createObjectURL(file);
      handleAvatarChange(avatarId, field, objectUrl);
      toast.success(`🎬 Đã nạp video thành công!`);
    }
    e.target.value = '';
  };

  const handleMultiFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    files.forEach((file, index) => {
      if (index >= 4) return;
      const targetAvatarId = `avatar_${index + 1}`;
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (loadEvt) => {
          const dataUrl = loadEvt.target?.result;
          if (dataUrl) {
            handleAvatarChange(targetAvatarId, 'talkVideo', dataUrl);
            handleAvatarChange(targetAvatarId, 'idleVideo', dataUrl);
          }
        };
        reader.readAsDataURL(file);
      } else {
        const objectUrl = URL.createObjectURL(file);
        handleAvatarChange(targetAvatarId, 'talkVideo', objectUrl);
        handleAvatarChange(targetAvatarId, 'idleVideo', objectUrl);
      }
    });

    toast.success(`⚡ Đã nạp đồng loạt ${files.length} tệp cho các nhân vật!`);
    e.target.value = '';
  };

  const handleApplyPosePreset = (avatarId, poseType) => {
    const poseConfigs = {
      stand: { y: 8, height: 86, width: 48, pose: 'stand' },
      sit_chair: { y: 24, height: 72, width: 52, pose: 'sit' },
      sit_table: { y: 34, height: 62, width: 56, pose: 'sit_desk' },
      half_body: { y: 16, height: 78, width: 58, pose: 'half' },
      close_up: { y: 6, height: 90, width: 75, pose: 'close_up' }
    };

    const targetPose = poseConfigs[poseType];
    if (!targetPose) return;

    handleAvatarTransformBatch(avatarId, targetPose);
  };

  const handleFillScreen = (avatarId) => {
    if (avatarId === 'studio_background') {
      handleBackgroundTransformBatch({ x: 0, y: 0, width: 100, height: 100, scale: 100, objectFit: 'cover' });
    } else {
      handleAvatarTransformBatch(avatarId, { x: 0, y: 0, width: 100, height: 100 });
    }
  };

  const handleCenterAvatar = (avatarId) => {
    if (avatarId === 'studio_background') {
      handleBackgroundTransformBatch({ x: 0, y: 0 });
    } else {
      const av = safeAvatars.find(a => a.id === avatarId);
      const w = av?.transform?.width || 50;
      const h = av?.transform?.height || 50;
      handleAvatarTransformBatch(avatarId, {
        x: Math.max(0, Math.round((100 - w) / 2)),
        y: Math.max(0, Math.round((100 - h) / 2))
      });
    }
  };

  const handleResetLayout = () => {
    const updated = {
      ...config,
      layoutMode: 'custom_canvas',
      avatars: DEFAULT_MULTI_AVATAR_CONFIG.avatars
    };
    setConfig(updated);
    saveMultiAvatarConfig(updated);
  };

  const handleBringToFront = (avatarId) => handleAvatarTransformChange(avatarId, 'zIndex', 50);
  const handleSendToBack = (avatarId) => handleAvatarTransformChange(avatarId, 'zIndex', 1);

  const handleApplyPresetLayout = (presetKey) => {
    const preset = STUDIO_STAGE_PRESETS[presetKey];
    if (!preset || !preset.transforms) return;
    const updated = {
      ...config,
      layoutMode: presetKey,
      avatars: safeAvatars.map(av => {
        const trans = preset.transforms[av.id];
        return trans ? { ...av, transform: { ...(av.transform || {}), ...trans } } : av;
      })
    };
    setConfig(updated);
    saveMultiAvatarConfig(updated);
  };

  const handleSelectBackground = (preset) => {
    const updated = { ...config, backgroundUrl: preset.url || '', backgroundColor: preset.color || '#0a0c14' };
    setConfig(updated);
    saveMultiAvatarConfig(updated);
  };

  const handleCustomBackgroundUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        const dataUrl = loadEvt.target?.result;
        if (dataUrl) {
          setConfig(prev => {
            const updated = { ...prev, backgroundUrl: dataUrl };
            saveMultiAvatarConfig(updated);
            return updated;
          });
        }
      };
      reader.readAsDataURL(file);
    } else {
      const objectUrl = URL.createObjectURL(file);
      setConfig(prev => {
        const updated = { ...prev, backgroundUrl: objectUrl };
        saveMultiAvatarConfig(updated);
        return updated;
      });
    }
  };

  const handleVoicePreview = (voiceId) => {
    if (previewingVoiceId === voiceId) { stopVoiceAudio(); setPreviewingVoiceId(null); return; }
    const voiceObj = ALL_SYSTEM_VOICES.find(v => v.id === voiceId);
    if (!voiceObj) return;
    setPreviewingVoiceId(voiceId);
    previewVoiceAudio(voiceObj, voiceObj.sampleText || 'Xin chào cả nhà! Đây là giọng đọc mẫu của nhân vật.', { onEnd: () => setPreviewingVoiceId(null) });
  };

  const handleSaveAndApply = () => {
    const updated = { ...config, enabled: true };
    setConfig(updated);
    saveMultiAvatarConfig(updated);
    setSavedSuccess(true);
    toast.success('✨ Đã lưu và kích hoạt chế độ Studio 2–4 Avatar cho phòng Live!');
    setTimeout(() => {
      setSavedSuccess(false);
      if (onClose) onClose();
    }, 600);
  };

  const handleSave = () => {
    saveMultiAvatarConfig(config);
    setSavedSuccess(true);
    toast.success('💾 Đã lưu cấu hình Studio 2–4 Avatar!');
    setTimeout(() => {
      setSavedSuccess(false);
      if (onClose) onClose();
    }, 600);
  };

  const handleSelectMedia = (mediaItem) => {
    if (!mediaPickerTarget) return;
    const { avatarId, type } = mediaPickerTarget;
    const url = mediaItem.mediaUrl || (mediaItem.fileBlob ? URL.createObjectURL(mediaItem.fileBlob) : '');
    handleAvatarChange(avatarId, type === 'idle' ? 'idleVideo' : 'talkVideo', url);
    setMediaPickerTarget(null);
  };

  // UNIFIED MOUSE DOWN HANDLER FOR LAYERS (BACKGROUND & AVATARS)
  const handleMouseDownOnLayer = (e, targetId) => {
    e.preventDefault(); e.stopPropagation();
    setSelectedAvatarId(targetId);
    if (targetId === 'studio_background') {
      setInspectorTab('background');
    }
    setDragOperation({ targetId, mode: 'move' });

    if (targetId === 'studio_background') {
      const bg = config.backgroundTransform || DEFAULT_MULTI_AVATAR_CONFIG.backgroundTransform;
      dragStartPosRef.current = {
        mouseX: e.clientX,
        mouseY: e.clientY,
        startX: bg.x ?? 0,
        startY: bg.y ?? 0,
        startW: bg.width ?? 100,
        startH: bg.height ?? 100,
        startScale: bg.scale ?? 100
      };
    } else {
      const avatar = safeAvatars.find(a => a.id === targetId);
      const tf = avatar?.transform || { x: 0, y: 0, width: 50, height: 50 };
      dragStartPosRef.current = {
        mouseX: e.clientX,
        mouseY: e.clientY,
        startX: tf.x ?? 0,
        startY: tf.y ?? 0,
        startW: tf.width ?? 50,
        startH: tf.height ?? 50,
        startScale: 100
      };
    }
  };

  // UNIFIED 8-POINT RESIZE HANDLE MOUSE DOWN HANDLER
  const handleMouseDownOnHandle = (e, targetId, mode) => {
    e.preventDefault(); e.stopPropagation();
    setSelectedAvatarId(targetId);
    if (targetId === 'studio_background') {
      setInspectorTab('background');
    }
    setDragOperation({ targetId, mode });

    if (targetId === 'studio_background') {
      const bg = config.backgroundTransform || DEFAULT_MULTI_AVATAR_CONFIG.backgroundTransform;
      dragStartPosRef.current = {
        mouseX: e.clientX,
        mouseY: e.clientY,
        startX: bg.x ?? 0,
        startY: bg.y ?? 0,
        startW: bg.width ?? 100,
        startH: bg.height ?? 100,
        startScale: bg.scale ?? 100
      };
    } else {
      const avatar = safeAvatars.find(a => a.id === targetId);
      const tf = avatar?.transform || { x: 0, y: 0, width: 50, height: 50 };
      dragStartPosRef.current = {
        mouseX: e.clientX,
        mouseY: e.clientY,
        startX: tf.x ?? 0,
        startY: tf.y ?? 0,
        startW: tf.width ?? 50,
        startH: tf.height ?? 50,
        startScale: 100
      };
    }
  };

  const handleMouseMove = (e) => {
    if (!dragOperation || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const deltaX = ((e.clientX - dragStartPosRef.current.mouseX) / rect.width) * 100;
    const deltaY = ((e.clientY - dragStartPosRef.current.mouseY) / rect.height) * 100;
    const { targetId, mode } = dragOperation;
    const { startX, startY, startW, startH } = dragStartPosRef.current;

    let newX = startX;
    let newY = startY;
    let newW = startW;
    let newH = startH;

    switch (mode) {
      case 'move':
        newX = Math.round(startX + deltaX);
        newY = Math.round(startY + deltaY);
        break;
      case 'se': // bottom-right
        newW = Math.max(10, Math.round(startW + deltaX));
        newH = Math.max(10, Math.round(startH + deltaY));
        break;
      case 's': // bottom-center
        newH = Math.max(10, Math.round(startH + deltaY));
        break;
      case 'e': // right-center
        newW = Math.max(10, Math.round(startW + deltaX));
        break;
      case 'sw': // bottom-left
        newX = Math.round(startX + deltaX);
        newW = Math.max(10, Math.round(startW - deltaX));
        newH = Math.max(10, Math.round(startH + deltaY));
        break;
      case 'w': // left-center
        newX = Math.round(startX + deltaX);
        newW = Math.max(10, Math.round(startW - deltaX));
        break;
      case 'ne': // top-right
        newY = Math.round(startY + deltaY);
        newW = Math.max(10, Math.round(startW + deltaX));
        newH = Math.max(10, Math.round(startH - deltaY));
        break;
      case 'n': // top-center
        newY = Math.round(startY + deltaY);
        newH = Math.max(10, Math.round(startH - deltaY));
        break;
      case 'nw': // top-left
        newX = Math.round(startX + deltaX);
        newY = Math.round(startY + deltaY);
        newW = Math.max(10, Math.round(startW - deltaX));
        newH = Math.max(10, Math.round(startH - deltaY));
        break;
      default:
        break;
    }

    if (targetId === 'studio_background') {
      handleBackgroundTransformBatch({ x: newX, y: newY, width: newW, height: newH });
    } else {
      handleAvatarTransformBatch(targetId, { x: newX, y: newY, width: newW, height: newH });
    }
  };

  const handleMouseUp = () => setDragOperation(null);

  useEffect(() => {
    if (dragOperation) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragOperation]);

  // KEYBOARD ARROW NUDGING (TikTok LIVE Studio style: Arrow keys move 1%, Shift+Arrow moves 5%)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedAvatarId) return;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;

      const step = e.shiftKey ? 5 : 1;
      let deltaX = 0;
      let deltaY = 0;

      if (e.key === 'ArrowLeft') deltaX = -step;
      else if (e.key === 'ArrowRight') deltaX = step;
      else if (e.key === 'ArrowUp') deltaY = -step;
      else if (e.key === 'ArrowDown') deltaY = step;
      else return;

      e.preventDefault();

      if (selectedAvatarId === 'studio_background') {
        const bg = config.backgroundTransform || DEFAULT_MULTI_AVATAR_CONFIG.backgroundTransform;
        handleBackgroundTransformBatch({
          x: (bg.x ?? 0) + deltaX,
          y: (bg.y ?? 0) + deltaY
        });
      } else {
        const av = safeAvatars.find(a => a.id === selectedAvatarId);
        if (!av) return;
        const tf = av.transform || { x: 0, y: 0, width: 50, height: 50 };
        handleAvatarTransformBatch(selectedAvatarId, {
          x: (tf.x ?? 0) + deltaX,
          y: (tf.y ?? 0) + deltaY
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedAvatarId, config, safeAvatars]);

  return (
    <div className={`flex flex-col h-full ${isEmbedded ? 'bg-transparent text-gray-800' : 'bg-[#11131a] text-white'}`}>
      <SvgChromaFilters />
      
      {/* 1. TOP HEADER & MAIN CONTROLS */}
      <div className={`p-2.5 border-b flex flex-wrap items-center justify-between gap-2 shrink-0 ${
        isEmbedded 
          ? 'bg-white dark:bg-[#161822] border-gray-200 dark:border-gray-800 rounded-2xl shadow-xs mb-2.5' 
          : 'bg-[#171924] border-gray-800'
      }`}>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Nút BẬT / TẮT Kích Hoạt Studio 2-4 Avatar */}
          <button
            type="button"
            onClick={() => handleToggleEnabled()}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
              config.enabled
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white ring-2 ring-emerald-400 shadow-emerald-500/20'
                : 'bg-slate-700/70 hover:bg-slate-700 text-gray-300 border border-gray-600 hover:text-white'
            }`}
            title="Bật/Tắt chế độ Studio Đa Nhân Vật khi phát Live"
          >
            {config.enabled ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-300"></span>
                </span>
                <span>✅ BẬT 2-4 AVATAR</span>
              </>
            ) : (
              <>
                <span className="inline-flex rounded-full h-2 w-2 bg-gray-400"></span>
                <span>⏹️ TẮT (1 AVATAR CHUẨN)</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-1">
            <span className="text-[11px] font-black text-gray-500 uppercase">Nhân vật:</span>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-black/40 p-0.5 rounded-xl border border-gray-300 dark:border-gray-700">
              {[2, 3, 4].map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleActiveCountChange(num)}
                  className={`px-2 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                    activeCount === num
                      ? 'bg-blue-600 text-white shadow-xs scale-102'
                      : 'text-gray-600 dark:text-gray-300 hover:text-blue-600'
                  }`}
                >
                  {num === 2 ? '👥 2 Người' : num === 3 ? '👨‍👩‍👦 3 Người' : '🌟 4 Người'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[11px] font-black text-gray-500 uppercase">Khung hình:</span>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-black/40 p-0.5 rounded-xl border border-gray-300 dark:border-gray-700">
              <button
                type="button"
                onClick={() => setCanvasAspectRatio('9:16')}
                className={`px-2 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1 cursor-pointer ${
                  canvasAspectRatio === '9:16'
                    ? 'bg-blue-600 text-white shadow-xs scale-102'
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-600'
                }`}
              >
                <Smartphone size={13} /> 9:16 (Dọc)
              </button>
              <button
                type="button"
                onClick={() => setCanvasAspectRatio('16:9')}
                className={`px-2 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1 cursor-pointer ${
                  canvasAspectRatio === '16:9'
                    ? 'bg-blue-600 text-white shadow-xs scale-102'
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-600'
                }`}
              >
                <Monitor size={13} /> 16:9 (Ngang)
              </button>
            </div>
          </div>
        </div>

        {/* Chuyển Tabs Chính: Sân Khấu / Kịch Bản */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-black/40 p-0.5 rounded-xl border border-gray-300 dark:border-gray-700">
          <button
            type="button"
            onClick={() => setActiveTab('canvas')}
            className={`px-3 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'canvas' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-blue-600'
            }`}
          >
            <Move size={13} /> Sân Khấu
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('templates')}
            className={`px-3 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'templates' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-purple-600'
            }`}
          >
            <MessageSquare size={13} /> Kịch Bản
          </button>
        </div>

        {/* Nút Action Lưu, Trợ Giúp, Tải Nhiều File & NÚT ĐÓNG TO RÕ GÓC PHẢI */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Nút Nạp Nhanh Nhiều File */}
          <label 
            className="px-2.5 py-1.5 rounded-xl text-xs font-black bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-400/40 flex items-center gap-1 cursor-pointer shadow-xs transition-all hover:scale-102"
            title="Chọn đồng thời 2-4 ảnh hoặc video để tự động gán vào các nhân vật"
          >
            <Upload size={13} />
            <span className="hidden sm:inline">Nạp 2–4 File Cùng Lúc</span>
            <span className="sm:hidden">Nạp Nhiều</span>
            <input 
              type="file" 
              multiple 
              accept="video/*,image/*" 
              onChange={handleMultiFileUpload} 
              className="hidden" 
            />
          </label>

          <button
            type="button"
            onClick={() => setShowHelpModal(true)}
            className="px-2.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all cursor-pointer bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 shadow-2xs"
            title="Hướng dẫn & Phím tắt"
          >
            <HelpCircle size={14} /> Trợ Giúp
          </button>
          
          <button
            type="button"
            onClick={handleSaveAndApply}
            className="px-3.5 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md hover:shadow-lg hover:scale-102"
            title="Lưu tất cả thay đổi và kích hoạt ngay vào phòng Live"
          >
            <Check size={14} /> {config.enabled ? 'Đã Bật • Áp Dụng' : 'Bật & Áp Dụng Live'}
          </button>
          
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-red-600/80 hover:bg-red-600 text-white border border-red-500 transition-all font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md hover:scale-105"
              title="Đóng cửa sổ Studio (Góc phải màn hình)"
            >
              <X size={16} />
              <span>ĐÓNG</span>
            </button>
          )}
        </div>
      </div>

      {/* Thông báo trạng thái BẬT/TẮT */}
      {!config.enabled && (
        <div className={`mx-2 mb-2 p-2 rounded-xl text-xs flex items-center justify-between gap-2 ${
          isEmbedded ? 'bg-amber-50 border border-amber-200 text-amber-900' : 'bg-amber-500/15 border border-amber-500/30 text-amber-300'
        }`}>
          <div className="flex items-center gap-2">
            <Info size={15} className="text-amber-500 shrink-0" />
            <span>Chế độ <strong>Studio 2–4 Avatar hiện đang TẮT</strong>. Phòng Live sẽ chạy <strong>1 Avatar đơn tiêu chuẩn</strong>.</span>
          </div>
          <button
            type="button"
            onClick={() => handleToggleEnabled(true)}
            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-black rounded-lg shrink-0 cursor-pointer shadow-xs transition-transform hover:scale-105"
          >
            Bật Chế Độ 2–4 Avatar 🚀
          </button>
        </div>
      )}

      {/* 2. MAIN WORKSPACE CONTENT */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'canvas' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 p-1 items-start">
            
            {/* CỘT TRÁI: SÂN KHẤU CANVAS TO RÕ NÉT VÀ NẰM TRỌN TRONG TẦM MẮT */}
            <div className="lg:col-span-7 flex flex-col items-center justify-start p-3 rounded-2xl bg-[#0a0c13] border border-gray-800 shadow-2xl relative select-none">
              
              {/* TOP BAR TRONG CANVAS: BỐ CỤC MẪU 1-CLICK & CHỌN LỚP NHANH */}
              <div className="w-full flex flex-col gap-2 pb-2 mb-2 border-b border-gray-800 text-xs">
                {/* Dải nút Bố Cục Sẵn */}
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <span className="font-bold text-gray-400 flex items-center gap-1 text-[11px]">
                    <Palette size={13} className="text-cyan-400" /> Bố Cục Sẵn:
                  </span>
                  <div className="flex items-center gap-1 flex-wrap">
                    {Object.entries(STUDIO_STAGE_PRESETS).filter(([k]) => k !== 'custom_canvas').map(([key, preset]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleApplyPresetLayout(key)}
                        className={`px-2 py-0.5 rounded-lg text-[11px] font-black transition-all cursor-pointer ${
                          config.layoutMode === key
                            ? 'bg-cyan-500 text-black shadow-xs font-black'
                            : 'bg-white/10 hover:bg-white/20 text-gray-300'
                        }`}
                      >
                        {preset.name.split(' ')[0]} {preset.name.split(' ')[1]}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={handleResetLayout}
                      className="px-2 py-0.5 rounded-lg text-[10px] font-bold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 flex items-center gap-0.5 cursor-pointer"
                      title="Đặt lại toàn bộ vị trí nhân vật"
                    >
                      <RotateCcw size={11} /> Đặt Lại
                    </button>
                  </div>
                </div>

                {/* Dải nút Chọn Lớp (Background & Từng Avatar) */}
                <div className="flex items-center gap-1 p-1 bg-black/60 rounded-xl border border-white/10 overflow-x-auto">
                  <span className="text-[10px] font-black text-gray-400 uppercase shrink-0 px-1">Lớp:</span>
                  <button
                    type="button"
                    onClick={() => { setSelectedAvatarId('studio_background'); setInspectorTab('background'); }}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-black transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
                      isBgSelected
                        ? 'bg-purple-600 text-white shadow-xs scale-102 ring-1 ring-purple-300'
                        : 'bg-white/10 text-purple-300 hover:bg-white/20'
                    }`}
                  >
                    <span>🖼️ Nền Studio {bgTransform.scale && bgTransform.scale !== 100 ? `(${bgTransform.scale}%)` : ''}</span>
                  </button>
                  {activeAvatars.map((av, idx) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => { setSelectedAvatarId(av.id); if (inspectorTab === 'background') setInspectorTab('media_transform'); }}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-black transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
                        selectedAvatarId === av.id
                          ? 'bg-cyan-500 text-black shadow-xs scale-102 ring-1 ring-cyan-200'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                    >
                      <span>#{idx + 1} {av.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* KHUNG CANVAS LIVE - TỶ LỆ CHUẨN THIẾT KẾ VỪA VẶN VIEWPORT */}
              <div 
                ref={canvasRef}
                onClick={() => { if (!isBgSelected && !dragOperation) { setSelectedAvatarId('studio_background'); setInspectorTab('background'); } }}
                className="relative overflow-hidden rounded-2xl border-2 border-cyan-500/60 shadow-[0_0_35px_rgba(6,182,212,0.3)] transition-all duration-200 bg-cover bg-center my-1"
                style={{
                  width: canvasAspectRatio === '9:16' ? '280px' : '490px',
                  height: canvasAspectRatio === '9:16' ? '498px' : '276px',
                  backgroundColor: config.backgroundColor || '#0a0c14'
                }}
              >
                {/* 1. LAYER ẢNH NỀN STUDIO (CO GIÃN, KÉO THẢ, ZOOM, XOAY CHUYỂN SIÊU MƯỢT) */}
                <div
                  onMouseDown={(e) => handleMouseDownOnLayer(e, 'studio_background')}
                  className={`absolute transition-shadow duration-100 select-none ${
                    isBgSelected 
                      ? 'ring-2 ring-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.7)] cursor-move z-1' 
                      : 'cursor-pointer hover:ring-1 hover:ring-purple-300/40 z-0'
                  }`}
                  style={{
                    left: `${bgTransform.x ?? 0}%`,
                    top: `${bgTransform.y ?? 0}%`,
                    width: `${bgTransform.width ?? 100}%`,
                    height: `${bgTransform.height ?? 100}%`,
                    transform: bgTransform.scale && bgTransform.scale !== 100 ? `scale(${bgTransform.scale / 100})` : 'none',
                    transformOrigin: 'center center'
                  }}
                >
                  {config.backgroundUrl ? (
                    <img 
                      src={config.backgroundUrl}
                      alt="Studio Background"
                      className="w-full h-full select-none pointer-events-none"
                      style={{
                        objectFit: bgTransform.objectFit || 'cover',
                        filter: `${bgTransform.blur ? `blur(${bgTransform.blur}px)` : ''} ${bgTransform.brightness ? `brightness(${bgTransform.brightness}%)` : ''}`.trim() || 'none'
                      }}
                    />
                  ) : (
                    <div 
                      className="w-full h-full"
                      style={{ backgroundColor: config.backgroundColor || '#0a0c14' }}
                    />
                  )}

                  {/* 8-POINT RESIZE HANDLES CHO ẢNH NỀN */}
                  {isBgSelected && (
                    <>
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-purple-500 text-white text-[9px] font-black shadow-lg pointer-events-none whitespace-nowrap z-50 flex items-center gap-1">
                        <span>🖼️ Nền Studio: {bgTransform.width}% × {bgTransform.height}% ({bgTransform.scale || 100}%)</span>
                      </div>

                      {/* 4 Góc */}
                      <div onMouseDown={(e) => handleMouseDownOnHandle(e, 'studio_background', 'nw')} className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-purple-400 border border-black rounded-xs cursor-nwse-resize z-40 hover:scale-130 transition-transform" />
                      <div onMouseDown={(e) => handleMouseDownOnHandle(e, 'studio_background', 'ne')} className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-purple-400 border border-black rounded-xs cursor-nesw-resize z-40 hover:scale-130 transition-transform" />
                      <div onMouseDown={(e) => handleMouseDownOnHandle(e, 'studio_background', 'sw')} className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 bg-purple-400 border border-black rounded-xs cursor-nesw-resize z-40 hover:scale-130 transition-transform" />
                      <div onMouseDown={(e) => handleMouseDownOnHandle(e, 'studio_background', 'se')} className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-purple-400 border border-black rounded-xs cursor-nwse-resize z-40 hover:scale-130 transition-transform" />

                      {/* 4 Cạnh */}
                      <div onMouseDown={(e) => handleMouseDownOnHandle(e, 'studio_background', 'n')} className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-4 h-2.5 bg-purple-400 border border-black rounded-xs cursor-ns-resize z-40 hover:scale-130 transition-transform" />
                      <div onMouseDown={(e) => handleMouseDownOnHandle(e, 'studio_background', 's')} className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-2.5 bg-purple-400 border border-black rounded-xs cursor-ns-resize z-40 hover:scale-130 transition-transform" />
                      <div onMouseDown={(e) => handleMouseDownOnHandle(e, 'studio_background', 'w')} className="absolute top-1/2 -translate-y-1/2 -left-1.5 w-2.5 h-4 bg-purple-400 border border-black rounded-xs cursor-ew-resize z-40 hover:scale-130 transition-transform" />
                      <div onMouseDown={(e) => handleMouseDownOnHandle(e, 'studio_background', 'e')} className="absolute top-1/2 -translate-y-1/2 -right-1.5 w-2.5 h-4 bg-purple-400 border border-black rounded-xs cursor-ew-resize z-40 hover:scale-130 transition-transform" />
                    </>
                  )}
                </div>

                {/* GRID LINES HELPER */}
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-20 z-2">
                  <div className="border-r border-b border-white/40" />
                  <div className="border-r border-b border-white/40" />
                  <div className="border-b border-white/40" />
                  <div className="border-r border-b border-white/40" />
                  <div className="border-r border-b border-white/40" />
                  <div className="border-b border-white/40" />
                  <div className="border-r border-b border-white/40" />
                  <div className="border-r border-b border-white/40" />
                  <div />
                </div>

                {/* 2. RENDER TẤT CẢ AVATARS TRÊN SÂN KHẤU */}
                {activeAvatars.map((avatar, idx) => {
                  const transform = avatar.transform || { x: idx * 25, y: 10, width: 45, height: 75, zIndex: 5, pose: 'stand', objectFit: 'cover', borderRadius: 16 };
                  const isSelected = selectedAvatarId === avatar.id;
                  const mediaSrc = avatar.talkVideo || avatar.idleVideo;
                  const isImg = isImageMedia(mediaSrc);
                  const chromaStyle = getChromaStyle(avatar.chromaKey || config.chromaKey);

                  return (
                    <div
                      key={avatar.id}
                      onMouseDown={(e) => handleMouseDownOnLayer(e, avatar.id)}
                      className={`absolute overflow-visible cursor-move transition-shadow duration-100 flex flex-col justify-between ${
                        isSelected 
                          ? 'ring-2 ring-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.8)] z-30' 
                          : 'ring-1 ring-white/40 hover:ring-cyan-300/70 z-10'
                      }`}
                      style={{
                        left: `${transform.x ?? 0}%`,
                        top: `${transform.y ?? 0}%`,
                        width: `${transform.width ?? 45}%`,
                        height: `${transform.height ?? 75}%`,
                        zIndex: isSelected ? 35 : (transform.zIndex || 5),
                        borderRadius: `${transform.borderRadius ?? 16}px`
                      }}
                    >
                      {/* MEDIA CONTAINER */}
                      <div 
                        className="w-full h-full overflow-hidden rounded-[inherit] relative group bg-transparent"
                        style={chromaStyle}
                      >
                        {mediaSrc ? (
                          <>
                            {isImg ? (
                              <img
                                src={mediaSrc}
                                alt={avatar.name}
                                className="w-full h-full pointer-events-none select-none bg-transparent"
                                style={{ 
                                  objectFit: transform.objectFit || 'cover',
                                  ...chromaStyle
                                }}
                              />
                            ) : (
                              <video
                                src={mediaSrc}
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-full pointer-events-none select-none bg-transparent"
                                style={{ 
                                  objectFit: transform.objectFit || 'cover',
                                  ...chromaStyle
                                }}
                              />
                            )}
                            {/* Hover Quick Action Buttons */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 p-1">
                              <label 
                                className="px-2 py-1 rounded bg-blue-600 hover:bg-blue-500 text-[9px] font-black text-white shadow-md cursor-pointer flex items-center gap-0.5"
                                title="Đổi video/ảnh từ máy tính"
                              >
                                <Upload size={10} /> Đổi File
                                <input 
                                  type="file" 
                                  accept="video/*,image/*" 
                                  onChange={(e) => handleDirectAvatarFileUpload(avatar.id, 'talkVideo', e)} 
                                  className="hidden" 
                                />
                              </label>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setMediaPickerTarget({ avatarId: avatar.id, type: 'talk' });
                                }}
                                className="px-2 py-1 rounded bg-purple-600 hover:bg-purple-500 text-[9px] font-black text-white shadow-md cursor-pointer flex items-center gap-0.5"
                                title="Chọn từ thư viện"
                              >
                                <FolderOpen size={10} /> Mẫu
                              </button>
                            </div>
                          </>
                        ) : (
                          /* RÕ RÀNG TRỰC QUAN KHI CHƯA GÁN MEDIA: DROPZONE TRỰC TIẾP */
                          <div className="w-full h-full bg-gradient-to-b from-slate-900/95 via-indigo-950/80 to-slate-900/95 flex flex-col items-center justify-center p-1.5 text-center text-white border-2 border-dashed border-cyan-400/50 rounded-[inherit]">
                            <span className="text-xl mb-0.5">
                              {transform.pose === 'sit' ? '🪑' : transform.pose === 'sit_desk' ? '🛋️' : '🧍'}
                            </span>
                            <span className="text-[10px] font-black text-cyan-300 leading-tight">#{idx + 1} {avatar.name}</span>
                            <span className="text-[8px] text-gray-400 font-mono mb-1">[{avatar.tag}]</span>
                            
                            <div className="flex flex-col gap-1 w-full max-w-[120px]" onClick={(e) => e.stopPropagation()}>
                              <label className="w-full px-1.5 py-0.5 rounded bg-blue-600 hover:bg-blue-500 text-[9px] font-bold text-white cursor-pointer flex items-center justify-center gap-1 shadow-sm">
                                <Upload size={10} />
                                <span>Tải Video/Ảnh</span>
                                <input 
                                  type="file" 
                                  accept="video/*,image/*" 
                                  onChange={(e) => handleDirectAvatarFileUpload(avatar.id, 'talkVideo', e)} 
                                  className="hidden" 
                                />
                              </label>
                              <button
                                type="button"
                                onClick={() => setMediaPickerTarget({ avatarId: avatar.id, type: 'talk' })}
                                className="w-full px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[8px] font-bold text-gray-300 cursor-pointer flex items-center justify-center gap-0.5"
                              >
                                <FolderOpen size={9} /> Thư Viện
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* BADGE TÊN & THÔNG TIN */}
                      <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/85 backdrop-blur-sm text-[9px] font-black text-white border border-white/20 flex items-center gap-1 pointer-events-none z-30 shadow-md">
                        <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-cyan-400 animate-ping' : 'bg-emerald-400'}`} />
                        <span>#{idx + 1} {avatar.name}</span>
                      </div>

                      {/* 8-POINT RESIZE HANDLES CHO AVATAR */}
                      {isSelected && (
                        <>
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-cyan-500 text-black text-[9px] font-black shadow-lg pointer-events-none whitespace-nowrap z-50">
                            W:{transform.width}% × H:{transform.height}%
                          </div>

                          {/* 4 Góc */}
                          <div onMouseDown={(e) => handleMouseDownOnHandle(e, avatar.id, 'nw')} className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-cyan-400 border border-black rounded-xs cursor-nwse-resize z-40 hover:scale-130 transition-transform" />
                          <div onMouseDown={(e) => handleMouseDownOnHandle(e, avatar.id, 'ne')} className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-cyan-400 border border-black rounded-xs cursor-nesw-resize z-40 hover:scale-130 transition-transform" />
                          <div onMouseDown={(e) => handleMouseDownOnHandle(e, avatar.id, 'sw')} className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 bg-cyan-400 border border-black rounded-xs cursor-nesw-resize z-40 hover:scale-130 transition-transform" />
                          <div onMouseDown={(e) => handleMouseDownOnHandle(e, avatar.id, 'se')} className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-cyan-400 border border-black rounded-xs cursor-nwse-resize z-40 hover:scale-130 transition-transform" />

                          {/* 4 Cạnh */}
                          <div onMouseDown={(e) => handleMouseDownOnHandle(e, avatar.id, 'n')} className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-4 h-2.5 bg-cyan-400 border border-black rounded-xs cursor-ns-resize z-40 hover:scale-130 transition-transform" />
                          <div onMouseDown={(e) => handleMouseDownOnHandle(e, avatar.id, 's')} className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-2.5 bg-cyan-400 border border-black rounded-xs cursor-ns-resize z-40 hover:scale-130 transition-transform" />
                          <div onMouseDown={(e) => handleMouseDownOnHandle(e, avatar.id, 'w')} className="absolute top-1/2 -translate-y-1/2 -left-1.5 w-2.5 h-4 bg-cyan-400 border border-black rounded-xs cursor-ew-resize z-40 hover:scale-130 transition-transform" />
                          <div onMouseDown={(e) => handleMouseDownOnHandle(e, avatar.id, 'e')} className="absolute top-1/2 -translate-y-1/2 -right-1.5 w-2.5 h-4 bg-cyan-400 border border-black rounded-xs cursor-ew-resize z-40 hover:scale-130 transition-transform" />
                        </>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* TOOLBAR THAO TÁC NHANH DƯỚI CANVAS */}
              <div className="flex items-center gap-1.5 mt-2 flex-wrap justify-center text-xs">
                {isBgSelected ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleFillScreen('studio_background')}
                      className="px-2 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-bold flex items-center gap-1 cursor-pointer border border-purple-500/40 text-[11px]"
                    >
                      <Maximize2 size={11} /> Full Màn Hình Nền
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCenterAvatar('studio_background')}
                      className="px-2 py-1 rounded-lg bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 font-bold flex items-center gap-1 cursor-pointer border border-yellow-500/40 text-[11px]"
                    >
                      <Scaling size={11} /> Căn Giữa Nền
                    </button>
                    <button
                      type="button"
                      onClick={() => handleBackgroundTransformChange('scale', 100)}
                      className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold flex items-center gap-1 cursor-pointer border border-white/20 text-[11px]"
                    >
                      <ZoomIn size={11} /> Zoom 100%
                    </button>
                    <button
                      type="button"
                      onClick={handleResetBackground}
                      className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 font-bold flex items-center gap-1 cursor-pointer border border-white/20 text-[11px]"
                    >
                      <RotateCcw size={11} /> Đặt Lại Nền
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => handleFillScreen(selectedAvatar.id)}
                      className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-cyan-300 font-bold flex items-center gap-1 cursor-pointer border border-cyan-500/30 text-[11px]"
                    >
                      <Maximize2 size={11} /> Full Màn Hình
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCenterAvatar(selectedAvatar.id)}
                      className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-yellow-300 font-bold flex items-center gap-1 cursor-pointer border border-yellow-500/30 text-[11px]"
                    >
                      <Scaling size={11} /> Căn Giữa
                    </button>
                    <button
                      type="button"
                      onClick={() => handleBringToFront(selectedAvatar.id)}
                      className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold flex items-center gap-1 cursor-pointer border border-white/20 text-[11px]"
                    >
                      <ArrowUpToLine size={11} /> Lên Đầu
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSendToBack(selectedAvatar.id)}
                      className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold flex items-center gap-1 cursor-pointer border border-white/20 text-[11px]"
                    >
                      <ArrowDownToLine size={11} /> Xuống Đáy
                    </button>
                  </>
                )}
              </div>

              <p className="text-[10px] text-gray-400 mt-1 font-mono text-center">
                💡 Bấm chọn Nền hoặc Nhân vật để kéo thả (X, Y) • Kéo 8 góc/cạnh để co giãn • Phím mũi tên (↑↓←→) dịch chuyển 1%
              </p>
            </div>

            {/* CỘT PHẢI: TOÀN BỘ CÀI ĐẶT ĐA NHÂN VẬT & NỀN STUDIO GỌN GÀNG TINH TẾ */}
            <div className="lg:col-span-5 space-y-2">
              
              {/* 1. CHỌN NHÂN VẬT HOẶC NỀN STUDIO ĐANG TINH CHỈNH */}
              <div className={`p-2.5 rounded-2xl border ${isEmbedded ? 'bg-white border-gray-200 shadow-xs' : 'bg-[#171922] border-gray-800'}`}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-black uppercase text-gray-500">
                    Đối tượng đang chọn:
                  </span>
                  <div className="flex items-center gap-1">
                    {isBgSelected ? (
                      <span className="font-black text-xs text-purple-600 dark:text-purple-400">🖼️ Ảnh Nền Studio 4K</span>
                    ) : (
                      <>
                        <input 
                          type="text" 
                          value={selectedAvatar.name || ''} 
                          onChange={(e) => handleAvatarChange(selectedAvatar.id, 'name', e.target.value)}
                          className="font-black text-xs text-cyan-600 dark:text-cyan-400 bg-transparent border-b border-dashed border-gray-400 focus:border-cyan-500 focus:outline-none px-1 text-right"
                          title="Bấm để đổi tên"
                        />
                        <span className="text-[10px] text-gray-400">({selectedAvatar.role})</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-1">
                  <button
                    type="button"
                    onClick={() => { setSelectedAvatarId('studio_background'); setInspectorTab('background'); }}
                    className={`p-1.5 rounded-xl text-xs font-black transition-all text-center cursor-pointer border ${
                      isBgSelected
                        ? 'bg-purple-600 text-white border-purple-400 shadow-sm scale-102 font-black'
                        : 'bg-slate-100 dark:bg-black/30 text-purple-600 dark:text-purple-300 border-gray-300 dark:border-gray-800'
                    }`}
                  >
                    <div className="text-[11px]">🖼️ Nền</div>
                    <div className="truncate text-[9px]">{bgTransform.scale || 100}%</div>
                  </button>

                  {activeAvatars.map((av, idx) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => { setSelectedAvatarId(av.id); if (inspectorTab === 'background') setInspectorTab('media_transform'); }}
                      className={`p-1.5 rounded-xl text-xs font-black transition-all text-center cursor-pointer border ${
                        selectedAvatarId === av.id
                          ? 'bg-cyan-500 text-black border-cyan-400 shadow-sm scale-102 font-black'
                          : 'bg-slate-100 dark:bg-black/30 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-800'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>#{idx + 1}</span>
                        {av.talkVideo || av.idleVideo ? <span className="text-emerald-500 text-[10px]">●</span> : <span className="text-amber-500 text-[10px]">○</span>}
                      </div>
                      <div className="truncate text-[10px]">{av.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. KHU VỰC TẢI & GÁN MEDIA CHO NHÂN VẬT ĐANG CHỌN (NẾU CHỌN AVATAR) */}
              {!isBgSelected && (
                <div className={`p-2.5 rounded-2xl border ${isEmbedded ? 'bg-white border-gray-200 shadow-xs' : 'bg-[#171922] border-gray-800'} space-y-2`}>
                  <div className="flex items-center justify-between border-b pb-1 border-gray-200 dark:border-gray-800">
                    <h4 className="text-[11px] font-black uppercase text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
                      <FileVideo size={13} /> Video / Hình Ảnh: {selectedAvatar.name}
                    </h4>
                    <span className="text-[9px] font-mono text-gray-500">[{selectedAvatar.tag}]</span>
                  </div>

                  {/* 2.1 VIDEO NÓI / KHẨU HÌNH */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                        <Sparkles size={11} className="text-amber-500" /> Video/Ảnh Nói (Khẩu Hình):
                      </span>
                      {selectedAvatar.talkVideo && (
                        <span className="text-emerald-500 font-bold flex items-center gap-0.5">
                          <CheckCircle2 size={10} /> Đã có file
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <label className="flex-1 px-2 py-1 rounded-xl text-[11px] font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 flex items-center justify-center gap-1 cursor-pointer shadow-2xs">
                        <Upload size={12} />
                        <span className="truncate">Tải từ máy tính (MP4/PNG)</span>
                        <input 
                          type="file" 
                          accept="video/*,image/*" 
                          onChange={(e) => handleDirectAvatarFileUpload(selectedAvatar.id, 'talkVideo', e)} 
                          className="hidden" 
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() => setMediaPickerTarget({ avatarId: selectedAvatar.id, type: 'talk' })}
                        className="px-2 py-1 rounded-xl text-[11px] font-bold bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700 flex items-center gap-0.5 cursor-pointer"
                        title="Chọn từ Thư Viện Media"
                      >
                        <FolderOpen size={12} /> Thư Viện
                      </button>

                      {selectedAvatar.talkVideo && (
                        <button
                          type="button"
                          onClick={() => handleAvatarChange(selectedAvatar.id, 'talkVideo', '')}
                          className="p-1 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900 cursor-pointer"
                          title="Xóa video khẩu hình"
                        >
                          <X size={12} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 2.2 VIDEO NGHỈ / LẮNG NGHE */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                        <Video size={11} className="text-blue-500" /> Video/Ảnh Nghỉ & Lắng Nghe:
                      </span>
                      {selectedAvatar.idleVideo && (
                        <span className="text-emerald-500 font-bold flex items-center gap-0.5">
                          <CheckCircle2 size={10} /> Đã có file
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <label className="flex-1 px-2 py-1 rounded-xl text-[11px] font-bold bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30 flex items-center justify-center gap-1 cursor-pointer shadow-2xs">
                        <Upload size={12} />
                        <span className="truncate">Tải từ máy tính (MP4/PNG)</span>
                        <input 
                          type="file" 
                          accept="video/*,image/*" 
                          onChange={(e) => handleDirectAvatarFileUpload(selectedAvatar.id, 'idleVideo', e)} 
                          className="hidden" 
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() => setMediaPickerTarget({ avatarId: selectedAvatar.id, type: 'idle' })}
                        className="px-2 py-1 rounded-xl text-[11px] font-bold bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700 flex items-center gap-0.5 cursor-pointer"
                        title="Chọn từ Thư Viện Media"
                      >
                        <FolderOpen size={12} /> Thư Viện
                      </button>

                      {selectedAvatar.idleVideo && (
                        <button
                          type="button"
                          onClick={() => handleAvatarChange(selectedAvatar.id, 'idleVideo', '')}
                          className="p-1 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900 cursor-pointer"
                          title="Xóa video nghỉ"
                        >
                          <X size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 3. SUB-TAB SELECTOR */}
              <div className="flex items-center gap-1 bg-slate-200/80 dark:bg-black/50 p-0.5 rounded-xl border border-gray-300 dark:border-gray-800">
                {[
                  { id: 'media_transform', label: '📐 Vị Trí' },
                  { id: 'chroma', label: '🟢 Tách Nền' },
                  { id: 'voice', label: '🎙️ Giọng Đọc' },
                  { id: 'background', label: '🖼️ Nền Studio' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setInspectorTab(tab.id)}
                    className={`flex-1 py-1 text-[11px] font-black rounded-lg transition-all text-center cursor-pointer ${
                      inspectorTab === tab.id
                        ? 'bg-white dark:bg-[#1f222e] text-blue-600 dark:text-cyan-300 shadow-xs border border-gray-200 dark:border-gray-700 scale-102'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* 4. SUB-TAB CONTENT */}
              {inspectorTab === 'media_transform' && (
                <div className={`p-3 rounded-2xl border space-y-2 animate-in fade-in duration-150 ${isEmbedded ? 'bg-white border-gray-200 shadow-xs' : 'bg-[#171922] border-gray-800'}`}>
                  {/* 5 TƯ THẾ NHANH 1-CLICK */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-600 dark:text-gray-300 flex items-center justify-between">
                      <span>Tư thế sân khấu 1-Click:</span>
                      <span className="text-cyan-500 font-bold">
                        {selectedAvatar.transform?.pose === 'sit' ? '🪑 Ngồi Ghế' : 
                         selectedAvatar.transform?.pose === 'sit_desk' ? '🛋️ Ngồi Bàn' : 
                         selectedAvatar.transform?.pose === 'half' ? '👤 Nửa Người' : 
                         selectedAvatar.transform?.pose === 'close_up' ? '🔍 Cận Cảnh' : '🧍 Đứng'}
                      </span>
                    </label>
                    <div className="grid grid-cols-5 gap-1">
                      {[
                        { type: 'stand', label: '🧍 Đứng' },
                        { type: 'sit_chair', label: '🪑 Ghế' },
                        { type: 'sit_table', label: '🛋️ Bàn' },
                        { type: 'half_body', label: '👤 Nửa người' },
                        { type: 'close_up', label: '🔍 Cận cảnh' }
                      ].map(p => (
                        <button
                          key={p.type}
                          type="button"
                          onClick={() => handleApplyPosePreset(selectedAvatar.id, p.type)}
                          className={`py-1 px-0.5 rounded-xl text-[10px] font-bold border transition-all cursor-pointer text-center ${
                            selectedAvatar.transform?.pose === p.type || (p.type === 'stand' && (!selectedAvatar.transform?.pose || selectedAvatar.transform?.pose === 'stand'))
                              ? 'bg-blue-600 text-white border-blue-500 shadow-xs'
                              : 'bg-slate-50 dark:bg-black/30 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800'
                          }`}
                        >
                          <div>{p.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* SLIDERS TỌA ĐỘ VÀ KÍCH THƯỚC */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 block mb-0.5">
                        Rộng (Width): {selectedAvatar.transform?.width || 45}%
                      </label>
                      <input 
                        type="range" 
                        min="15" 
                        max="100" 
                        value={selectedAvatar.transform?.width || 45} 
                        onChange={(e) => handleAvatarTransformChange(selectedAvatar.id, 'width', Number(e.target.value))}
                        className="w-full accent-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-gray-500 block mb-0.5">
                        Cao (Height): {selectedAvatar.transform?.height || 75}%
                      </label>
                      <input 
                        type="range" 
                        min="15" 
                        max="100" 
                        value={selectedAvatar.transform?.height || 75} 
                        onChange={(e) => handleAvatarTransformChange(selectedAvatar.id, 'height', Number(e.target.value))}
                        className="w-full accent-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-gray-500 block mb-0.5">
                        Vị trí Ngang (X): {selectedAvatar.transform?.x || 0}%
                      </label>
                      <input 
                        type="range" 
                        min="0" 
                        max="85" 
                        value={selectedAvatar.transform?.x || 0} 
                        onChange={(e) => handleAvatarTransformChange(selectedAvatar.id, 'x', Number(e.target.value))}
                        className="w-full accent-blue-600"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-gray-500 block mb-0.5">
                        Vị trí Dọc (Y): {selectedAvatar.transform?.y || 0}%
                      </label>
                      <input 
                        type="range" 
                        min="0" 
                        max="85" 
                        value={selectedAvatar.transform?.y || 0} 
                        onChange={(e) => handleAvatarTransformChange(selectedAvatar.id, 'y', Number(e.target.value))}
                        className="w-full accent-blue-600"
                      />
                    </div>
                  </div>

                  {/* LỚP & CẮT XÉN */}
                  <div className="flex items-center justify-between pt-1 border-t border-gray-100 dark:border-gray-800 text-[11px] flex-wrap gap-1.5">
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-gray-500">Lớp:</span>
                      <button
                        type="button"
                        onClick={() => handleAvatarTransformChange(selectedAvatar.id, 'zIndex', (selectedAvatar.transform?.zIndex || 5) + 1)}
                        className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-black/30 border border-gray-300 dark:border-gray-800 text-[10px] font-bold cursor-pointer"
                      >
                        <ArrowUp size={10} className="inline" /> Lên ({selectedAvatar.transform?.zIndex || 5})
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAvatarTransformChange(selectedAvatar.id, 'zIndex', Math.max(1, (selectedAvatar.transform?.zIndex || 5) - 1))}
                        className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-black/30 border border-gray-300 dark:border-gray-800 text-[10px] font-bold cursor-pointer"
                      >
                        <ArrowDown size={10} className="inline" /> Xuống
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleAvatarTransformChange(selectedAvatar.id, 'objectFit', selectedAvatar.transform?.objectFit === 'contain' ? 'cover' : selectedAvatar.transform?.objectFit === 'fill' ? 'contain' : 'fill')}
                        className="px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-600 text-[10px] font-bold border border-blue-200 dark:border-blue-800 cursor-pointer"
                      >
                        Fit: {selectedAvatar.transform?.objectFit || 'cover'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAvatarTransformChange(selectedAvatar.id, 'borderRadius', selectedAvatar.transform?.borderRadius === 0 ? 16 : selectedAvatar.transform?.borderRadius === 16 ? 9999 : 0)}
                        className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-black/30 text-gray-700 dark:text-gray-300 text-[10px] font-bold border border-gray-300 dark:border-gray-800 cursor-pointer"
                      >
                        Góc: {selectedAvatar.transform?.borderRadius === 9999 ? 'Tròn' : selectedAvatar.transform?.borderRadius === 0 ? 'Vuông' : 'Bo'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {inspectorTab === 'chroma' && (
                <div className={`p-3 rounded-2xl border space-y-2 animate-in fade-in duration-150 ${isEmbedded ? 'bg-white border-gray-200 shadow-xs' : 'bg-[#171922] border-gray-800'}`}>
                  <div className="flex items-center justify-between border-b pb-2 border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-1">
                      <Wand2 size={13} className="text-emerald-500" />
                      <h4 className="text-[11px] font-black uppercase text-emerald-600 dark:text-emerald-400">
                        Xóa Phông Nền (Chroma Key)
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const nextVal = !selectedAvatar.chromaKey?.enabled;
                        handleAvatarChromaChange(selectedAvatar.id, 'enabled', nextVal);
                        if (nextVal) {
                          toast.success('🟢 Đã bật xóa phông nền!');
                        } else {
                          toast.info('⚪ Đã tắt xóa phông nền.');
                        }
                      }}
                      className={`px-3 py-1 rounded-xl text-[11px] font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                        selectedAvatar.chromaKey?.enabled
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30 ring-2 ring-emerald-300'
                          : 'bg-slate-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-700'
                      }`}
                    >
                      {selectedAvatar.chromaKey?.enabled ? (
                        <>
                          <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                          <span>Đang Bật Tách Nền</span>
                        </>
                      ) : (
                        <>
                          <span className="w-2 h-2 rounded-full bg-gray-400" />
                          <span>Đang Tắt</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="space-y-0.5">
                      <label className="text-[10px] font-bold text-gray-500">Màu Nền Cần Tách (Bấm để Tách Ngay):</label>
                      <div className="grid grid-cols-4 gap-1">
                        {[
                          { mode: 'green', color: '#00ff00', label: '🟢 Xanh Lá' },
                          { mode: 'blue', color: '#0000ff', label: '🔵 Xanh Dương' },
                          { mode: 'black', color: '#000000', label: '⚫ Nền Đen' },
                          { mode: 'white', color: '#ffffff', label: '⚪ Nền Trắng' }
                        ].map(c => (
                          <button
                            key={c.mode}
                            type="button"
                            onClick={() => {
                              handleAvatarChromaBatch(selectedAvatar.id, {
                                enabled: true,
                                mode: c.mode,
                                color: c.color
                              });
                              toast.success(`✨ Đã bật tách ${c.label}!`);
                            }}
                            className={`py-1.5 px-1 rounded-xl font-black text-[10px] border transition-all cursor-pointer text-center ${
                              selectedAvatar.chromaKey?.enabled && (selectedAvatar.chromaKey?.mode === c.mode || selectedAvatar.chromaKey?.color === c.color)
                                ? 'bg-emerald-600 text-white border-emerald-400 shadow-xs ring-1 ring-emerald-300 scale-102'
                                : 'bg-slate-50 dark:bg-black/30 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:border-emerald-300'
                            }`}
                          >
                            {c.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-gray-500 block mb-0.5">
                          Độ Nhạy: {Math.round((selectedAvatar.chromaKey?.similarity ?? 0.45) * 100)}%
                        </label>
                        <input 
                          type="range" 
                          min="0.1" 
                          max="0.9" 
                          step="0.05" 
                          value={selectedAvatar.chromaKey?.similarity ?? 0.45} 
                          onChange={(e) => handleAvatarChromaChange(selectedAvatar.id, 'similarity', parseFloat(e.target.value))}
                          className="w-full accent-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-500 block mb-0.5">
                          Độ Mịn: {Math.round((selectedAvatar.chromaKey?.smoothness ?? 0.15) * 100)}%
                        </label>
                        <input 
                          type="range" 
                          min="0.01" 
                          max="0.4" 
                          step="0.02" 
                          value={selectedAvatar.chromaKey?.smoothness ?? 0.15} 
                          onChange={(e) => handleAvatarChromaChange(selectedAvatar.id, 'smoothness', parseFloat(e.target.value))}
                          className="w-full accent-emerald-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {inspectorTab === 'voice' && (
                <div className={`p-3 rounded-2xl border space-y-2 animate-in fade-in duration-150 ${isEmbedded ? 'bg-white border-gray-200 shadow-xs' : 'bg-[#171922] border-gray-800'}`}>
                  <div className="flex items-center justify-between border-b pb-1.5 border-gray-200 dark:border-gray-800">
                    <h4 className="text-[11px] font-black uppercase text-rose-600 flex items-center gap-1">
                      <Mic size={13} /> Giọng Đọc AI: {selectedAvatar.name}
                    </h4>
                    <button
                      type="button"
                      onClick={() => handleVoicePreview(selectedAvatar.voiceId)}
                      className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {previewingVoiceId === selectedAvatar.voiceId ? <Square size={11} className="text-red-500" /> : <Play size={11} />}
                      <span>{previewingVoiceId === selectedAvatar.voiceId ? 'Dừng' : 'Nghe Thử'}</span>
                    </button>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 block mb-0.5">Chọn Giọng:</label>
                      <select
                        value={selectedAvatar.voiceId}
                        onChange={(e) => handleAvatarChange(selectedAvatar.id, 'voiceId', e.target.value)}
                        className="w-full text-xs font-bold p-1.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1f222e] text-gray-800 dark:text-white cursor-pointer shadow-inner"
                      >
                        {ALL_SYSTEM_VOICES.map(v => (
                          <option key={v.id} value={v.id}>
                            {v.name} ({v.gender === 'Female' ? 'Nữ' : 'Nam'} - {v.region || 'Việt Nam'})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <label className="text-[10px] font-bold text-gray-500 flex items-center gap-1">
                        <Gauge size={11} /> Tốc độ đọc:
                      </label>
                      <div className="flex items-center gap-1.5">
                        <input 
                          type="range" 
                          min="0.8" 
                          max="1.5" 
                          step="0.05" 
                          value={selectedAvatar.rate ?? 1.0}
                          onChange={(e) => handleAvatarChange(selectedAvatar.id, 'rate', parseFloat(e.target.value))}
                          className="w-20 accent-rose-600"
                        />
                        <span className="w-8 text-right font-mono font-bold text-[11px]">{(selectedAvatar.rate ?? 1.0).toFixed(2)}x</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB NỀN STUDIO - FULL ĐIỀU CHỈNH CO GIÃN, VỊ TRÍ, ZOOM, BLUR, BRIGHTNESS */}
              {inspectorTab === 'background' && (
                <div className={`p-3 rounded-2xl border space-y-3 animate-in fade-in duration-150 ${isEmbedded ? 'bg-white border-gray-200 shadow-xs' : 'bg-[#171922] border-gray-800'}`}>
                  <div className="flex items-center justify-between border-b pb-1.5 border-gray-200 dark:border-gray-800">
                    <h4 className="text-[11px] font-black uppercase text-purple-600 flex items-center gap-1">
                      <ImageIcon size={13} /> Canh Chỉnh & Co Giãn Ảnh Nền Studio
                    </h4>
                    <label className="text-[10px] font-bold text-purple-600 hover:underline flex items-center gap-0.5 cursor-pointer">
                      <Upload size={11} /> Tải Nền Riêng
                      <input type="file" accept="image/*,video/*" onChange={handleCustomBackgroundUpload} className="hidden" />
                    </label>
                  </div>

                  {/* CÁC NÚT THAO TÁC NHANH CHO NỀN */}
                  <div className="grid grid-cols-4 gap-1 text-[10px]">
                    <button
                      type="button"
                      onClick={() => handleBackgroundTransformBatch({ x: 0, y: 0, width: 100, height: 100, scale: 100, objectFit: 'cover' })}
                      className="py-1 px-1 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800 font-bold hover:bg-purple-100 text-center cursor-pointer"
                      title="Phủ kín màn hình"
                    >
                      📺 Full Màn
                    </button>
                    <button
                      type="button"
                      onClick={() => handleBackgroundTransformBatch({ x: 0, y: 0 })}
                      className="py-1 px-1 rounded-lg bg-yellow-50 dark:bg-yellow-950/40 text-yellow-700 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-800 font-bold hover:bg-yellow-100 text-center cursor-pointer"
                      title="Căn giữa khung"
                    >
                      🎯 Căn Giữa
                    </button>
                    <button
                      type="button"
                      onClick={() => handleBackgroundTransformChange('objectFit', bgTransform.objectFit === 'contain' ? 'cover' : 'contain')}
                      className="py-1 px-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800 font-bold hover:bg-blue-100 text-center cursor-pointer"
                    >
                      Fit: {bgTransform.objectFit || 'cover'}
                    </button>
                    <button
                      type="button"
                      onClick={handleResetBackground}
                      className="py-1 px-1 rounded-lg bg-slate-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 font-bold hover:bg-slate-200 text-center cursor-pointer"
                      title="Đặt lại các thông số nền"
                    >
                      🔄 Đặt Lại
                    </button>
                  </div>

                  {/* THANH TRƯỢT ZOOM / SCALE % */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                        <ZoomIn size={11} className="text-purple-500" /> Phóng To / Thu Nhỏ Nền (Zoom Scale):
                      </span>
                      <span className="font-mono font-bold text-purple-600 dark:text-purple-400">{bgTransform.scale ?? 100}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="50" 
                      max="300" 
                      step="5"
                      value={bgTransform.scale ?? 100}
                      onChange={(e) => handleBackgroundTransformChange('scale', Number(e.target.value))}
                      className="w-full accent-purple-600"
                    />
                  </div>

                  {/* THANH TRƯỢT VỊ TRÍ X & Y */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 block mb-0.5">
                        Dịch Ngang (X): {bgTransform.x ?? 0}%
                      </label>
                      <input 
                        type="range" 
                        min="-100" 
                        max="100" 
                        value={bgTransform.x ?? 0} 
                        onChange={(e) => handleBackgroundTransformChange('x', Number(e.target.value))}
                        className="w-full accent-purple-500"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-gray-500 block mb-0.5">
                        Dịch Dọc (Y): {bgTransform.y ?? 0}%
                      </label>
                      <input 
                        type="range" 
                        min="-100" 
                        max="100" 
                        value={bgTransform.y ?? 0} 
                        onChange={(e) => handleBackgroundTransformChange('y', Number(e.target.value))}
                        className="w-full accent-purple-500"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-gray-500 block mb-0.5">
                        Rộng (W): {bgTransform.width ?? 100}%
                      </label>
                      <input 
                        type="range" 
                        min="20" 
                        max="300" 
                        value={bgTransform.width ?? 100} 
                        onChange={(e) => handleBackgroundTransformChange('width', Number(e.target.value))}
                        className="w-full accent-purple-500"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-gray-500 block mb-0.5">
                        Cao (H): {bgTransform.height ?? 100}%
                      </label>
                      <input 
                        type="range" 
                        min="20" 
                        max="300" 
                        value={bgTransform.height ?? 100} 
                        onChange={(e) => handleBackgroundTransformChange('height', Number(e.target.value))}
                        className="w-full accent-purple-500"
                      />
                    </div>
                  </div>

                  {/* HIỆU ỨNG ĐỘ MỜ BLUR & ĐỘ SÁNG BRIGHTNESS */}
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-gray-100 dark:border-gray-800">
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 block mb-0.5">
                        Độ Mờ Nền: {bgTransform.blur ?? 0}px
                      </label>
                      <input 
                        type="range" 
                        min="0" 
                        max="20" 
                        value={bgTransform.blur ?? 0} 
                        onChange={(e) => handleBackgroundTransformChange('blur', Number(e.target.value))}
                        className="w-full accent-purple-500"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-gray-500 block mb-0.5">
                        Độ Sáng Nền: {bgTransform.brightness ?? 100}%
                      </label>
                      <input 
                        type="range" 
                        min="50" 
                        max="150" 
                        value={bgTransform.brightness ?? 100} 
                        onChange={(e) => handleBackgroundTransformChange('brightness', Number(e.target.value))}
                        className="w-full accent-purple-500"
                      />
                    </div>
                  </div>

                  {/* BỘ SƯU TẬP MẪU NỀN 4K */}
                  <div className="space-y-1 pt-1 border-t border-gray-100 dark:border-gray-800">
                    <label className="text-[10px] font-bold text-gray-500 block">Chọn Mẫu Nền Sẵn Có:</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                      {STUDIO_BACKGROUND_PRESETS.map(bg => (
                        <button
                          key={bg.id}
                          type="button"
                          onClick={() => handleSelectBackground(bg)}
                          className={`p-1.5 rounded-xl text-xs font-bold border text-left flex items-center gap-1.5 transition-all cursor-pointer ${
                            config.backgroundUrl === bg.url && config.backgroundColor === bg.color
                              ? 'bg-purple-600 text-white border-purple-500 shadow-xs scale-102'
                              : 'bg-slate-50 dark:bg-black/30 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:border-purple-300'
                          }`}
                        >
                          <span className="text-sm">{bg.preview}</span>
                          <span className="truncate text-[10px]">{bg.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>
        ) : (
          /* TAB 2: KỊCH BẢN ĐỐI THOẠI MẪU & TẢI TỆP TOÀN DIỆN */
          <div className="space-y-4 p-3 sm:p-4 max-w-7xl mx-auto">
            {/* 1. TOP CONTROLS & FILTER & NẠP FILE TỔNG HỢP */}
            <div className={`p-4 rounded-3xl border flex flex-wrap items-center justify-between gap-3 shadow-md ${
              isEmbedded ? 'bg-white border-purple-200' : 'bg-[#151722] border-purple-500/30 text-white'
            }`}>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black uppercase text-purple-400 flex items-center gap-1">
                  <MessageSquare size={15} /> Lọc Kịch Bản:
                </span>
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-black/40 p-1 rounded-2xl border border-gray-300 dark:border-gray-700">
                  {[
                    { id: 'all', label: '🌟 Tất Cả' },
                    { id: 2, label: '👥 2 Nhân Vật' },
                    { id: 3, label: '👨‍👩‍👦 3 Nhân Vật' },
                    { id: 4, label: '👑 4 Nhân Vật' }
                  ].map(f => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setScriptFilterCount(f.id)}
                      className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        scriptFilterCount === f.id
                          ? 'bg-purple-600 text-white shadow-md scale-102'
                          : 'text-gray-600 dark:text-gray-400 hover:text-purple-400'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Nút Tải File Kịch Bản Mọi Định Dạng */}
              <div className="flex items-center gap-2">
                <label className="px-4 py-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-black shadow-lg flex items-center gap-2 cursor-pointer transition-all hover:scale-102">
                  <Upload size={15} />
                  <span>📁 Tải Tệp Kịch Bản (.TXT, .DOCX, .PDF, .MD, .JSON)</span>
                  <input 
                    type="file" 
                    accept=".txt,.docx,.doc,.pdf,.md,.json,.csv" 
                    onChange={(e) => handleScriptFileUpload(e, null)} 
                    className="hidden" 
                  />
                </label>
              </div>
            </div>

            {/* 2. KHUNG SOẠN THẢO & NHẬP KỊCH BẢN TÙY CHỈNH (EXPANDED FULL HEIGHT) */}
            <div className={`p-4 rounded-3xl border shadow-xl space-y-3 ${
              isEmbedded ? 'bg-white border-blue-200' : 'bg-[#141620] border-blue-500/30 text-white'
            }`}>
              <div className="flex items-center justify-between flex-wrap gap-2 border-b pb-2.5 border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-cyan-400" />
                  <h3 className="text-sm font-black text-cyan-400 uppercase tracking-wide">
                    Trình Soạn Thảo & Tự Do Nhập Kịch Bản Đa Nhân Vật
                  </h3>
                </div>
                
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-bold text-gray-400">Thẻ nhân vật:</span>
                  {activeAvatars.map((av, idx) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => {
                        const tag = `[${av.name}]: `;
                        setCustomScriptText(prev => prev ? `${prev}\n${tag}` : tag);
                      }}
                      className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 cursor-pointer"
                      title={`Thêm câu thoại cho ${av.name}`}
                    >
                      +{av.name}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={customScriptText}
                onChange={(e) => setCustomScriptText(e.target.value)}
                placeholder={`Nhập hoặc tải file kịch bản phân vai đối thoại tại đây...\nVí dụ:\n[#1 ${safeAvatars[0]?.name || 'Ngọc Nhi'}]: Dạ em xin chào cả nhà đang xem livestream!\n[#2 ${safeAvatars[1]?.name || 'Quốc Cường'}]: Chào mọi người, hôm nay chúng ta có ưu đãi khủng nha!`}
                className="w-full h-44 sm:h-56 p-3.5 rounded-2xl bg-black/40 text-xs font-mono leading-relaxed text-gray-200 border border-gray-300 dark:border-gray-700 focus:border-cyan-400 focus:outline-none resize-y"
              />

              {customScriptText && customScriptText.trim() && (
                <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
                  <span className="text-xs text-emerald-400 font-bold">
                    ✓ Đã nhận diện kịch bản ({customScriptText.split('\n').filter(Boolean).length} câu thoại)
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (onApplyScriptTemplate) {
                        onApplyScriptTemplate(customScriptText, activeCount);
                      }
                      toast.success('🚀 Đã áp dụng kịch bản tùy chỉnh vào phòng Live!');
                      if (onClose) onClose();
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs shadow-md flex items-center gap-1.5 cursor-pointer hover:scale-102 transition-all"
                  >
                    <Check size={14} /> Áp Dụng Kịch Bản Này Vào Phòng Live Ngay
                  </button>
                </div>
              )}
            </div>

            {/* 3. BỘ SƯU TẬP CÁC MẪU KỊCH BẢN ĐỐI THOẠI (TO RỘNG DÀI XUỐNG DƯỚI) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase text-purple-400 flex items-center gap-1.5">
                  <Star size={14} /> Mẫu Kịch Bản Chuẩn Đóng Vai Sẵn Có ({
                    scriptFilterCount === 'all' 
                      ? SCRIPT_TEMPLATES.length 
                      : SCRIPT_TEMPLATES.filter(t => t.count === scriptFilterCount).length
                  } Kịch Bản)
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {SCRIPT_TEMPLATES
                  .filter(tmpl => scriptFilterCount === 'all' || tmpl.count === scriptFilterCount)
                  .map(tmpl => (
                    <div 
                      key={tmpl.id} 
                      className={`p-5 rounded-3xl border flex flex-col justify-between space-y-3 shadow-xl transition-all hover:border-purple-400/80 ${
                        isEmbedded 
                          ? 'bg-white border-purple-200 hover:shadow-2xl' 
                          : 'bg-[#151722] border-gray-800 text-white hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]'
                      }`}
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-1 rounded-xl bg-purple-500/20 text-purple-300 font-black text-xs border border-purple-500/30">
                            👥 {tmpl.count} Nhân Vật
                          </span>
                          <span className="text-[11px] text-gray-400 font-bold">
                            {tmpl.script.split('\n').filter(Boolean).length} câu thoại
                          </span>
                        </div>
                        
                        <h4 className="font-black text-sm text-purple-300 leading-snug">
                          {tmpl.title}
                        </h4>
                        
                        <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                          {tmpl.desc}
                        </p>
                        
                        {/* Khung Script to rộng dài xuống dưới */}
                        <pre className="p-3.5 rounded-2xl bg-black/60 text-xs text-gray-200 font-mono whitespace-pre-wrap h-64 sm:h-72 overflow-y-auto border border-gray-700/60 shadow-inner">
                          {tmpl.script}
                        </pre>
                      </div>

                      {/* Các nút hành động trên từng thẻ kịch bản */}
                      <div className="space-y-2 pt-2 border-t border-gray-800">
                        <div className="flex items-center gap-2">
                          <label className="flex-1 py-1.5 px-2 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/30 text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors">
                            <Upload size={12} />
                            <span>Tải File Cho Mẫu Này</span>
                            <input 
                              type="file" 
                              accept=".txt,.docx,.doc,.pdf,.md,.json,.csv" 
                              onChange={(e) => handleScriptFileUpload(e, tmpl)} 
                              className="hidden" 
                            />
                          </label>

                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(tmpl.script);
                              toast.success('📋 Đã sao chép kịch bản!');
                            }}
                            className="p-1.5 rounded-xl bg-gray-700/60 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-600 text-[11px] font-bold cursor-pointer"
                            title="Sao chép kịch bản"
                          >
                            📋 Copy
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (onApplyScriptTemplate) {
                              onApplyScriptTemplate(tmpl.script, tmpl.count);
                            }
                            toast.success(`✨ Đã áp dụng "${tmpl.title}" vào phòng Live!`);
                            if (onClose) onClose();
                          }}
                          className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-black shadow-lg flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                        >
                          <Sparkles size={14} /> Áp Dụng Kịch Bản Này Ngay 🚀
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. HELP MODAL */}
      {showHelpModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-[#181a24] text-white max-w-lg w-full rounded-2xl p-5 border border-cyan-500/40 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="font-black text-base text-cyan-400 flex items-center gap-2">
                <HelpCircle size={18} /> Hướng Dẫn Sân Khấu Đa Nhân Vật & Tải Video
              </h3>
              <button 
                type="button" 
                onClick={() => setShowHelpModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-gray-300">
              <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-800/50">
                <strong className="text-cyan-300 block mb-1">🎬 Tải Video / Ảnh Trực Tiếp:</strong>
                Bạn có thể tải trực tiếp file video (MP4, WebM) hoặc hình ảnh (PNG, JPG) từ máy tính cho từng nhân vật bằng cách bấm nút <strong>Tải từ máy tính</strong> hoặc bấm trực tiếp vào ô nhân vật trên Sân Khấu.
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/50">
                <strong className="text-emerald-300 block mb-1">🟢 Tách Nền / Xóa Phông Xanh (Chroma Key):</strong>
                Tự động lọc trong suốt phông xanh lá, xanh dương hoặc màu tùy ý để nhân vật hòa quyện hoàn hảo vào không gian phòng Live Studio.
              </div>

              <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-800/50">
                <strong className="text-purple-300 block mb-1">📐 Kéo Thả & Điều Chỉnh Tư Thế (Canva Style):</strong>
                Kéo chuột ở giữa nhân vật để di chuyển vị trí (X, Y). Kéo 4 góc để thay đổi kích thước to nhỏ. Sử dụng 5 nút tư thế mẫu (Đứng, Ngồi ghế, Ngồi bàn, Nửa người, Cận cảnh) để định hình nhanh chóng.
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs cursor-pointer shadow-md"
            >
              Đã Hiểu
            </button>
          </div>
        </div>
      )}

      {/* 4. MEDIA PICKER MODAL */}
      {mediaPickerTarget && (
        <UniversalMediaPicker 
          isOpen={true}
          onClose={() => setMediaPickerTarget(null)}
          onSelectMedia={handleSelectMedia}
          category={mediaPickerTarget.type === 'idle' ? 'idle' : 'greeting'}
          title={`Chọn Video ${mediaPickerTarget.type === 'idle' ? 'Nghỉ (Idle)' : 'Nói (Khẩu hình Lip-sync)'} Cho Nhân Vật`}
        />
      )}
    </div>
  );
}

export default function MultiAvatarStudioModal({ isOpen, onClose, onApplyScriptTemplate }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-1 sm:p-3 animate-in fade-in duration-200">
      <div className="bg-[#0f1118] text-white w-full h-full max-w-[1700px] max-h-[98vh] rounded-3xl shadow-2xl border border-cyan-500/40 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-hidden">
          <MultiAvatarStudioPanel 
            isEmbedded={false} 
            onClose={onClose} 
            onApplyScriptTemplate={onApplyScriptTemplate} 
          />
        </div>
      </div>
    </div>
  );
}
