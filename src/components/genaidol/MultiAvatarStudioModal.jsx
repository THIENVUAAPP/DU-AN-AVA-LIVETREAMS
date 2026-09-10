import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, Sparkles, Video, Mic, Volume2, Gauge, HelpCircle, X, Check, Play, Square, 
  Upload, FolderOpen, Layers, ShieldCheck, Info, MessageSquare, Plus, RefreshCw, Eye, EyeOff, BookOpen,
  Move, Maximize2, Palette, Sliders, Image as ImageIcon, Monitor, Smartphone, ChevronRight, LayoutGrid, CheckCircle2,
  Crop, Wand2, ArrowUp, ArrowDown, ArrowUpToLine, ArrowDownToLine, Scaling, ZoomIn, FileVideo, UserCheck, RotateCcw,
  Star, Copy, ExternalLink, Trash2, Share2, MonitorPlay
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
  const [activeTab, setActiveTab] = useState('canvas'); // 'canvas', 'templates', 'broadcast'
  const [selectedAvatarId, setSelectedAvatarId] = useState('avatar_1'); // 'avatar_1' | 'avatar_2' | ... | 'studio_background' | 'layer_...'
  const [inspectorTab, setInspectorTab] = useState('media_transform'); // 'media_transform', 'chroma', 'voice', 'background', 'image_layer', 'broadcast'
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

  useEffect(() => {
    const loaded = getMultiAvatarConfig();
    setConfig(loaded);
  }, []);

  const safeAvatars = (config.avatars && config.avatars.length > 0) ? config.avatars : DEFAULT_MULTI_AVATAR_CONFIG.avatars;
  const activeCount = Math.min(4, Math.max(2, config.activeCount || 2));
  const activeAvatars = safeAvatars.slice(0, activeCount);
  const extraImageLayers = Array.isArray(config.extraImageLayers) ? config.extraImageLayers : [];
  
  const isBgSelected = selectedAvatarId === 'studio_background';
  const isImageLayerSelected = typeof selectedAvatarId === 'string' && selectedAvatarId.startsWith('layer_');
  const selectedImageLayer = extraImageLayers.find(l => l.id === selectedAvatarId);
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

  // BACKGROUND TRANSFORM HANDLERS
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

  // =========================================================================
  // 🖼️ EXTRA CUSTOM IMAGE LAYERS HANDLERS (Tải nhiều ảnh cùng lúc, sắp xếp, kéo thả)
  // =========================================================================
  const handleMultiImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const currentLayers = config.extraImageLayers || [];
    let countAdded = 0;

    files.forEach((file, index) => {
      const isVid = file.type.startsWith('video/');
      const layerId = `layer_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const cleanName = file.name.replace(/\.[^/.]+$/, "") || `Ảnh ${currentLayers.length + index + 1}`;

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (loadEvt) => {
          const dataUrl = loadEvt.target?.result;
          if (dataUrl) {
            const newLayer = {
              id: layerId,
              name: cleanName,
              type: 'image',
              url: dataUrl,
              x: Math.min(60, 15 + ((currentLayers.length + index) * 6) % 50),
              y: Math.min(60, 15 + ((currentLayers.length + index) * 6) % 50),
              width: 35,
              height: 35,
              scale: 100,
              opacity: 100,
              zIndex: 10 + currentLayers.length + index,
              borderRadius: 8,
              objectFit: 'contain',
              chromaKey: { enabled: false, color: '#00ff00', mode: 'green' }
            };
            setConfig(prev => {
              const updated = {
                ...prev,
                extraImageLayers: [...(prev.extraImageLayers || []), newLayer]
              };
              saveMultiAvatarConfig(updated);
              return updated;
            });
            setSelectedAvatarId(layerId);
            setInspectorTab('image_layer');
          }
        };
        reader.readAsDataURL(file);
        countAdded++;
      } else if (isVid) {
        const objUrl = URL.createObjectURL(file);
        const newLayer = {
          id: layerId,
          name: cleanName,
          type: 'video',
          url: objUrl,
          x: Math.min(60, 15 + ((currentLayers.length + index) * 6) % 50),
          y: Math.min(60, 15 + ((currentLayers.length + index) * 6) % 50),
          width: 35,
          height: 35,
          scale: 100,
          opacity: 100,
          zIndex: 10 + currentLayers.length + index,
          borderRadius: 8,
          objectFit: 'contain',
          chromaKey: { enabled: false, color: '#00ff00', mode: 'green' }
        };
        setConfig(prev => {
          const updated = {
            ...prev,
            extraImageLayers: [...(prev.extraImageLayers || []), newLayer]
          };
          saveMultiAvatarConfig(updated);
          return updated;
        });
        setSelectedAvatarId(layerId);
        setInspectorTab('image_layer');
        countAdded++;
      }
    });

    toast.success(`🖼️ Đã nạp thành công ${files.length} tệp hình ảnh vào Sân Khấu Studio!`);
    e.target.value = '';
  };

  const handleUpdateImageLayer = (layerId, changes) => {
    setConfig(prev => {
      const currentLayers = prev.extraImageLayers || [];
      const updated = {
        ...prev,
        extraImageLayers: currentLayers.map(l => l.id === layerId ? { ...l, ...changes } : l)
      };
      saveMultiAvatarConfig(updated);
      return updated;
    });
  };

  const handleDeleteImageLayer = (layerId) => {
    setConfig(prev => {
      const currentLayers = prev.extraImageLayers || [];
      const updated = {
        ...prev,
        extraImageLayers: currentLayers.filter(l => l.id !== layerId)
      };
      saveMultiAvatarConfig(updated);
      return updated;
    });
    if (selectedAvatarId === layerId) {
      setSelectedAvatarId('avatar_1');
      setInspectorTab('media_transform');
    }
    toast.info('🗑️ Đã xóa lớp ảnh!');
  };

  const handleDuplicateImageLayer = (layerId) => {
    const target = extraImageLayers.find(l => l.id === layerId);
    if (!target) return;
    const newId = `layer_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const clone = {
      ...target,
      id: newId,
      name: `${target.name} (Bản sao)`,
      x: Math.min(80, (target.x ?? 20) + 5),
      y: Math.min(80, (target.y ?? 20) + 5),
      zIndex: (target.zIndex || 10) + 1
    };
    setConfig(prev => {
      const updated = {
        ...prev,
        extraImageLayers: [...(prev.extraImageLayers || []), clone]
      };
      saveMultiAvatarConfig(updated);
      return updated;
    });
    setSelectedAvatarId(newId);
    toast.success('📋 Đã nhân bản lớp ảnh!');
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
          toast.success(`🖼️ Đã nạp ảnh nhân vật thành công!`);
        }
      };
      reader.readAsDataURL(file);
    } else {
      const objectUrl = URL.createObjectURL(file);
      handleAvatarChange(avatarId, field, objectUrl);
      toast.success(`🎬 Đã nạp video nhân vật thành công!`);
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

  const handleFillScreen = (targetId) => {
    if (targetId === 'studio_background') {
      handleBackgroundTransformBatch({ x: 0, y: 0, width: 100, height: 100, scale: 100, objectFit: 'cover' });
    } else if (typeof targetId === 'string' && targetId.startsWith('layer_')) {
      handleUpdateImageLayer(targetId, { x: 0, y: 0, width: 100, height: 100, scale: 100, objectFit: 'cover' });
    } else {
      handleAvatarTransformBatch(targetId, { x: 0, y: 0, width: 100, height: 100 });
    }
  };

  const handleCenterAvatar = (targetId) => {
    if (targetId === 'studio_background') {
      handleBackgroundTransformBatch({ x: 0, y: 0 });
    } else if (typeof targetId === 'string' && targetId.startsWith('layer_')) {
      const layer = extraImageLayers.find(l => l.id === targetId);
      const w = layer?.width || 35;
      const h = layer?.height || 35;
      handleUpdateImageLayer(targetId, {
        x: Math.max(0, Math.round((100 - w) / 2)),
        y: Math.max(0, Math.round((100 - h) / 2))
      });
    } else {
      const av = safeAvatars.find(a => a.id === targetId);
      const w = av?.transform?.width || 50;
      const h = av?.transform?.height || 50;
      handleAvatarTransformBatch(targetId, {
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

  const handleBringToFront = (targetId) => {
    if (typeof targetId === 'string' && targetId.startsWith('layer_')) {
      handleUpdateImageLayer(targetId, { zIndex: 50 });
    } else {
      handleAvatarTransformChange(targetId, 'zIndex', 50);
    }
  };

  const handleSendToBack = (targetId) => {
    if (typeof targetId === 'string' && targetId.startsWith('layer_')) {
      handleUpdateImageLayer(targetId, { zIndex: 2 });
    } else {
      handleAvatarTransformChange(targetId, 'zIndex', 1);
    }
  };

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
          toast.success('🖼️ Đã nạp ảnh nền Studio thành công!');
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
      toast.success('🎬 Đã nạp video nền Studio thành công!');
    }
    e.target.value = '';
  };

  const handleVoicePreview = (voiceId) => {
    if (previewingVoiceId === voiceId) { stopVoiceAudio(); setPreviewingVoiceId(null); return; }
    const voiceObj = ALL_SYSTEM_VOICES.find(v => v.id === voiceId);
    if (!voiceObj) return;
    setPreviewingVoiceId(voiceId);
    previewVoiceAudio(voiceObj, voiceObj.sampleText || 'Xin chào cả nhà! Đây là giọng đọc mẫu của nhân vật.', { onEnd: () => setPreviewingVoiceId(null) });
  };

  // =========================================================================
  // 📜 ÁP DỤNG KỊCH BẢN ĐA NHÂN VẬT VÀO TOÀN BỘ PHÒNG LIVE
  // =========================================================================
  const handleApplyScript = (scriptText, count = activeCount) => {
    if (!scriptText || !scriptText.trim()) {
      toast.error('Vui lòng nhập hoặc chọn kịch bản trước khi áp dụng!');
      return;
    }

    const targetCount = count || activeCount;

    // 1. Lưu vào persistent user tabs
    try {
      const persistentRaw = localStorage.getItem('aidol_user_script_tabs_persistent');
      let pTabs = persistentRaw ? JSON.parse(persistentRaw) : [];
      if (!Array.isArray(pTabs) || pTabs.length === 0) {
        pTabs = [{ id: 'tab_default', name: 'Kịch Bản Bán Hàng', fixedScriptText: scriptText, active: true }];
      } else {
        const activeIdx = pTabs.findIndex(t => t.active);
        if (activeIdx >= 0) {
          pTabs[activeIdx].fixedScriptText = scriptText;
        } else {
          pTabs[0].fixedScriptText = scriptText;
          pTabs[0].active = true;
        }
      }
      localStorage.setItem('aidol_user_script_tabs_persistent', JSON.stringify(pTabs));
    } catch (e) {}

    // 2. Lưu vào aidol_event_configs
    try {
      const evRaw = localStorage.getItem('aidol_event_configs');
      let evConf = evRaw ? JSON.parse(evRaw) : {};
      if (!evConf.script_broadcast) evConf.script_broadcast = {};
      evConf.script_broadcast.fixedScriptText = scriptText;
      localStorage.setItem('aidol_event_configs', JSON.stringify(evConf));
    } catch (e) {}

    // 3. Lưu vào aidol_active_job
    try {
      const jobRaw = localStorage.getItem('aidol_active_job');
      let jobObj = jobRaw ? JSON.parse(jobRaw) : {};
      jobObj.scriptContent = scriptText;
      localStorage.setItem('aidol_active_job', JSON.stringify(jobObj));
    } catch (e) {}

    // 4. Kích hoạt BẬT chế độ Studio 2-4 Avatar
    const updatedConf = {
      ...config,
      enabled: true,
      activeCount: Math.min(4, Math.max(2, targetCount))
    };
    setConfig(updatedConf);
    saveMultiAvatarConfig(updatedConf);

    // 5. Phát sự kiện toàn cục để AIAudioPlayer, WorkspaceTacVu, DesktopAppUI nhận ngay lập tức
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('aidol_script_updated', {
        detail: {
          fixedScriptText: scriptText,
          scriptContent: scriptText,
          count: targetCount
        }
      }));
    }

    if (onApplyScriptTemplate) {
      onApplyScriptTemplate(scriptText, targetCount);
    }

    toast.success(`✨ Đã nạp kịch bản ${targetCount} nhân vật & kích hoạt phát Live thành công!`);
    if (onClose) onClose();
  };

  const handleScriptFileUpload = (e, templateTarget = null) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      const content = loadEvt.target?.result || '';
      if (content) {
        if (templateTarget) {
          handleApplyScript(content, templateTarget.count || activeCount);
        } else {
          setCustomScriptText(content);
          toast.success(`📁 Đã nạp file "${file.name}" vào trình soạn thảo kịch bản!`);
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
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

  const handleSelectMedia = (mediaItem) => {
    if (!mediaPickerTarget) return;
    const { avatarId, type } = mediaPickerTarget;
    const url = mediaItem.mediaUrl || (mediaItem.fileBlob ? URL.createObjectURL(mediaItem.fileBlob) : '');
    handleAvatarChange(avatarId, type === 'idle' ? 'idleVideo' : 'talkVideo', url);
    setMediaPickerTarget(null);
  };

  // UNIFIED MOUSE DOWN HANDLER FOR LAYERS (BACKGROUND, AVATARS, CUSTOM IMAGES)
  const handleMouseDownOnLayer = (e, targetId) => {
    e.preventDefault(); e.stopPropagation();
    setSelectedAvatarId(targetId);
    
    if (targetId === 'studio_background') {
      setInspectorTab('background');
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
    } else if (typeof targetId === 'string' && targetId.startsWith('layer_')) {
      setInspectorTab('image_layer');
      const layer = extraImageLayers.find(l => l.id === targetId);
      dragStartPosRef.current = {
        mouseX: e.clientX,
        mouseY: e.clientY,
        startX: layer?.x ?? 20,
        startY: layer?.y ?? 20,
        startW: layer?.width ?? 35,
        startH: layer?.height ?? 35,
        startScale: layer?.scale ?? 100
      };
    } else {
      if (inspectorTab === 'background' || inspectorTab === 'image_layer') {
        setInspectorTab('media_transform');
      }
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

    setDragOperation({ targetId, mode: 'move' });
  };

  // UNIFIED 8-POINT RESIZE HANDLE MOUSE DOWN HANDLER
  const handleMouseDownOnHandle = (e, targetId, mode) => {
    e.preventDefault(); e.stopPropagation();
    setSelectedAvatarId(targetId);
    setDragOperation({ targetId, mode });

    if (targetId === 'studio_background') {
      setInspectorTab('background');
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
    } else if (typeof targetId === 'string' && targetId.startsWith('layer_')) {
      setInspectorTab('image_layer');
      const layer = extraImageLayers.find(l => l.id === targetId);
      dragStartPosRef.current = {
        mouseX: e.clientX,
        mouseY: e.clientY,
        startX: layer?.x ?? 20,
        startY: layer?.y ?? 20,
        startW: layer?.width ?? 35,
        startH: layer?.height ?? 35,
        startScale: layer?.scale ?? 100
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
        newW = Math.max(8, Math.round(startW + deltaX));
        newH = Math.max(8, Math.round(startH + deltaY));
        break;
      case 's': // bottom-center
        newH = Math.max(8, Math.round(startH + deltaY));
        break;
      case 'e': // right-center
        newW = Math.max(8, Math.round(startW + deltaX));
        break;
      case 'sw': // bottom-left
        newX = Math.round(startX + deltaX);
        newW = Math.max(8, Math.round(startW - deltaX));
        newH = Math.max(8, Math.round(startH + deltaY));
        break;
      case 'w': // left-center
        newX = Math.round(startX + deltaX);
        newW = Math.max(8, Math.round(startW - deltaX));
        break;
      case 'ne': // top-right
        newY = Math.round(startY + deltaY);
        newW = Math.max(8, Math.round(startW + deltaX));
        newH = Math.max(8, Math.round(startH - deltaY));
        break;
      case 'n': // top-center
        newY = Math.round(startY + deltaY);
        newH = Math.max(8, Math.round(startH - deltaY));
        break;
      case 'nw': // top-left
        newX = Math.round(startX + deltaX);
        newY = Math.round(startY + deltaY);
        newW = Math.max(8, Math.round(startW - deltaX));
        newH = Math.max(8, Math.round(startH - deltaY));
        break;
      default:
        break;
    }

    if (targetId === 'studio_background') {
      handleBackgroundTransformBatch({ x: newX, y: newY, width: newW, height: newH });
    } else if (typeof targetId === 'string' && targetId.startsWith('layer_')) {
      handleUpdateImageLayer(targetId, { x: newX, y: newY, width: newW, height: newH });
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

  // KEYBOARD ARROW NUDGING
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
      } else if (typeof selectedAvatarId === 'string' && selectedAvatarId.startsWith('layer_')) {
        const layer = extraImageLayers.find(l => l.id === selectedAvatarId);
        if (layer) {
          handleUpdateImageLayer(selectedAvatarId, {
            x: (layer.x ?? 20) + deltaX,
            y: (layer.y ?? 20) + deltaY
          });
        }
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
  }, [selectedAvatarId, config, safeAvatars, extraImageLayers]);

  const liveOverlayUrl = typeof window !== 'undefined' ? `${window.location.origin}/?overlay=studio` : 'http://localhost:5173/?overlay=studio';

  const handleCopyOverlayLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(liveOverlayUrl);
      toast.success('📋 Đã sao chép Link Browser Source cho TikTok Live Studio & OBS!');
    }
  };

  const handleOpenCleanWindow = () => {
    if (typeof window !== 'undefined') {
      window.open(liveOverlayUrl + '&window_capture=true', 'AvaLiveStudioClean', 'width=1080,height=1920,menubar=no,toolbar=no,location=no,status=no');
      toast.success('🖥️ Đã mở Cửa sổ Livestream Sạch 1080p cho Window Capture!');
    }
  };

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

        {/* Chuyển Tabs Chính: Sân Khấu / Kịch Bản / Phát Live TikTok */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-black/40 p-0.5 rounded-xl border border-gray-300 dark:border-gray-700">
          <button
            type="button"
            onClick={() => setActiveTab('canvas')}
            className={`px-3 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'canvas' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-blue-600'
            }`}
          >
            <Move size={13} /> Sân Khấu & Ảnh
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('templates')}
            className={`px-3 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'templates' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-purple-600'
            }`}
          >
            <MessageSquare size={13} /> Kịch Bản ({SCRIPT_TEMPLATES.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('broadcast')}
            className={`px-3 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'broadcast' ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-pink-400'
            }`}
          >
            <MonitorPlay size={13} /> TikTok Live / OBS
          </button>
        </div>

        {/* Nút Action Lưu, Trợ Giúp, Tải Nhiều Ảnh & NÚT ĐÓNG TO RÕ GÓC PHẢI */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Nút Tải Lên Nhiều Hình Ảnh Cùng Lúc */}
          <label 
            className="px-2.5 py-1.5 rounded-xl text-xs font-black bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-200 border border-cyan-400/40 flex items-center gap-1.5 cursor-pointer shadow-xs transition-all hover:scale-102"
            title="Tải lên cùng lúc nhiều hình ảnh, logo, banner để trang trí phòng Live"
          >
            <ImageIcon size={14} className="text-cyan-400" />
            <span className="hidden sm:inline">+ Tải Nhiều Ảnh (Logo/Banner)</span>
            <span className="sm:hidden">+ Thêm Ảnh</span>
            <input 
              type="file" 
              multiple 
              accept="image/*,video/*" 
              onChange={handleMultiImageUpload} 
              className="hidden" 
            />
          </label>

          {/* Nút Nạp Nhanh Video 2-4 Avatar */}
          <label 
            className="px-2.5 py-1.5 rounded-xl text-xs font-black bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-400/40 flex items-center gap-1 cursor-pointer shadow-xs transition-all hover:scale-102"
            title="Chọn đồng thời 2-4 file video để tự động gán vào các nhân vật"
          >
            <Upload size={13} />
            <span className="hidden sm:inline">Nạp 2–4 Video</span>
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

      {/* 2. MAIN WORKSPACE CONTENT */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'canvas' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 p-2 items-start">
            
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

                {/* Dải nút Chọn Lớp (Background, Avatars, Extra Image Layers) */}
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
                    <span>🖼️ Nền Studio</span>
                  </button>

                  {activeAvatars.map((av, idx) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => { setSelectedAvatarId(av.id); if (inspectorTab === 'background' || inspectorTab === 'image_layer') setInspectorTab('media_transform'); }}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-black transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
                        selectedAvatarId === av.id
                          ? 'bg-cyan-500 text-black shadow-xs scale-102 ring-1 ring-cyan-200'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                    >
                      <span>#{idx + 1} {av.name}</span>
                    </button>
                  ))}

                  {extraImageLayers.map((layer, idx) => (
                    <button
                      key={layer.id}
                      type="button"
                      onClick={() => { setSelectedAvatarId(layer.id); setInspectorTab('image_layer'); }}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-black transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
                        selectedAvatarId === layer.id
                          ? 'bg-amber-400 text-black shadow-xs scale-102 ring-1 ring-amber-200'
                          : 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
                      }`}
                    >
                      <span>🎨 {layer.name || `Ảnh ${idx + 1}`}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* KHUNG CANVAS LIVE - TỶ LỆ CHUẨN THIẾT KẾ VỪA VẶN VIEWPORT */}
              <div 
                ref={canvasRef}
                onClick={() => { if (!isBgSelected && !isImageLayerSelected && !dragOperation) { setSelectedAvatarId('studio_background'); setInspectorTab('background'); } }}
                className="relative overflow-hidden rounded-2xl border-2 border-cyan-500/60 shadow-[0_0_35px_rgba(6,182,212,0.3)] transition-all duration-200 bg-cover bg-center my-1"
                style={{
                  width: canvasAspectRatio === '9:16' ? '290px' : '510px',
                  height: canvasAspectRatio === '9:16' ? '515px' : '288px',
                  backgroundColor: config.backgroundColor || '#0a0c14'
                }}
              >
                {/* 1. LAYER ẢNH NỀN STUDIO */}
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
                        <span>🖼️ Nền Studio: {bgTransform.width}% × {bgTransform.height}%</span>
                      </div>
                      <div onMouseDown={(e) => handleMouseDownOnHandle(e, 'studio_background', 'nw')} className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-purple-400 border border-black rounded-xs cursor-nwse-resize z-40 hover:scale-130" />
                      <div onMouseDown={(e) => handleMouseDownOnHandle(e, 'studio_background', 'ne')} className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-purple-400 border border-black rounded-xs cursor-nesw-resize z-40 hover:scale-130" />
                      <div onMouseDown={(e) => handleMouseDownOnHandle(e, 'studio_background', 'sw')} className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 bg-purple-400 border border-black rounded-xs cursor-nesw-resize z-40 hover:scale-130" />
                      <div onMouseDown={(e) => handleMouseDownOnHandle(e, 'studio_background', 'se')} className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-purple-400 border border-black rounded-xs cursor-nwse-resize z-40 hover:scale-130" />
                      <div onMouseDown={(e) => handleMouseDownOnHandle(e, 'studio_background', 'n')} className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-4 h-2.5 bg-purple-400 border border-black rounded-xs cursor-ns-resize z-40 hover:scale-130" />
                      <div onMouseDown={(e) => handleMouseDownOnHandle(e, 'studio_background', 's')} className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-2.5 bg-purple-400 border border-black rounded-xs cursor-ns-resize z-40 hover:scale-130" />
                      <div onMouseDown={(e) => handleMouseDownOnHandle(e, 'studio_background', 'w')} className="absolute top-1/2 -translate-y-1/2 -left-1.5 w-2.5 h-4 bg-purple-400 border border-black rounded-xs cursor-ew-resize z-40 hover:scale-130" />
                      <div onMouseDown={(e) => handleMouseDownOnHandle(e, 'studio_background', 'e')} className="absolute top-1/2 -translate-y-1/2 -right-1.5 w-2.5 h-4 bg-purple-400 border border-black rounded-xs cursor-ew-resize z-40 hover:scale-130" />
                    </>
                  )}
                </div>

                {/* 2. RENDER TẤT CẢ CÁC LỚP ẢNH TÙY BIẾN (EXTRA IMAGE LAYERS - KÉO THẢ TÙY Ý) */}
                {extraImageLayers.map((layer) => {
                  const isSelected = selectedAvatarId === layer.id;
                  const isImg = layer.type !== 'video' && (isImageMedia(layer.url) || !layer.type);
                  const chromaStyle = getChromaStyle(layer.chromaKey);

                  return (
                    <div
                      key={layer.id}
                      onMouseDown={(e) => handleMouseDownOnLayer(e, layer.id)}
                      className={`absolute overflow-visible cursor-move transition-shadow duration-100 flex flex-col justify-between ${
                        isSelected 
                          ? 'ring-2 ring-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.8)] z-35' 
                          : 'ring-1 ring-amber-400/40 hover:ring-amber-300 z-15'
                      }`}
                      style={{
                        left: `${layer.x ?? 20}%`,
                        top: `${layer.y ?? 20}%`,
                        width: `${layer.width ?? 35}%`,
                        height: `${layer.height ?? 35}%`,
                        zIndex: isSelected ? 40 : (layer.zIndex || 10),
                        borderRadius: `${layer.borderRadius ?? 8}px`,
                        opacity: (layer.opacity !== undefined ? layer.opacity : 100) / 100
                      }}
                    >
                      <div 
                        className="w-full h-full overflow-hidden rounded-[inherit] relative bg-transparent"
                        style={chromaStyle}
                      >
                        {isImg ? (
                          <img
                            src={layer.url}
                            alt={layer.name || 'Image Layer'}
                            className="w-full h-full pointer-events-none select-none bg-transparent"
                            style={{ 
                              objectFit: layer.objectFit || 'contain',
                              ...chromaStyle
                            }}
                          />
                        ) : (
                          <video
                            src={layer.url}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full pointer-events-none select-none bg-transparent"
                            style={{ 
                              objectFit: layer.objectFit || 'contain',
                              ...chromaStyle
                            }}
                          />
                        )}
                      </div>

                      {/* BADGE TÊN ẢNH */}
                      <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/85 backdrop-blur-sm text-[9px] font-black text-amber-300 border border-amber-400/30 flex items-center gap-1 pointer-events-none z-30 shadow-md">
                        <span>🎨 {layer.name || 'Lớp Ảnh'}</span>
                      </div>

                      {/* 8-POINT RESIZE HANDLES CHO LỚP ẢNH */}
                      {isSelected && (
                        <>
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-amber-400 text-black text-[9px] font-black shadow-lg pointer-events-none whitespace-nowrap z-50">
                            W:{layer.width}% × H:{layer.height}%
                          </div>
                          <div onMouseDown={(e) => handleMouseDownOnHandle(e, layer.id, 'nw')} className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-amber-400 border border-black rounded-xs cursor-nwse-resize z-40 hover:scale-130" />
                          <div onMouseDown={(e) => handleMouseDownOnHandle(e, layer.id, 'ne')} className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-amber-400 border border-black rounded-xs cursor-nesw-resize z-40 hover:scale-130" />
                          <div onMouseDown={(e) => handleMouseDownOnHandle(e, layer.id, 'sw')} className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 bg-amber-400 border border-black rounded-xs cursor-nesw-resize z-40 hover:scale-130" />
                          <div onMouseDown={(e) => handleMouseDownOnHandle(e, layer.id, 'se')} className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-amber-400 border border-black rounded-xs cursor-nwse-resize z-40 hover:scale-130" />
                          <div onMouseDown={(e) => handleMouseDownOnHandle(e, layer.id, 'n')} className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-4 h-2.5 bg-amber-400 border border-black rounded-xs cursor-ns-resize z-40 hover:scale-130" />
                          <div onMouseDown={(e) => handleMouseDownOnHandle(e, layer.id, 's')} className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-2.5 bg-amber-400 border border-black rounded-xs cursor-ns-resize z-40 hover:scale-130" />
                          <div onMouseDown={(e) => handleMouseDownOnHandle(e, layer.id, 'w')} className="absolute top-1/2 -translate-y-1/2 -left-1.5 w-2.5 h-4 bg-amber-400 border border-black rounded-xs cursor-ew-resize z-40 hover:scale-130" />
                          <div onMouseDown={(e) => handleMouseDownOnHandle(e, layer.id, 'e')} className="absolute top-1/2 -translate-y-1/2 -right-1.5 w-2.5 h-4 bg-amber-400 border border-black rounded-xs cursor-ew-resize z-40 hover:scale-130" />
                        </>
                      )}
                    </div>
                  );
                })}

                {/* 3. RENDER TẤT CẢ AVATARS TRÊN SÂN KHẤU */}
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
                          <div onMouseDown={(e) => handleMouseDownOnHandle(e, avatar.id, 'nw')} className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-cyan-400 border border-black rounded-xs cursor-nwse-resize z-40 hover:scale-130" />
                          <div onMouseDown={(e) => handleMouseDownOnHandle(e, avatar.id, 'ne')} className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-cyan-400 border border-black rounded-xs cursor-nesw-resize z-40 hover:scale-130" />
                          <div onMouseDown={(e) => handleMouseDownOnHandle(e, avatar.id, 'sw')} className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 bg-cyan-400 border border-black rounded-xs cursor-nesw-resize z-40 hover:scale-130" />
                          <div onMouseDown={(e) => handleMouseDownOnHandle(e, avatar.id, 'se')} className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-cyan-400 border border-black rounded-xs cursor-nwse-resize z-40 hover:scale-130" />
                          <div onMouseDown={(e) => handleMouseDownOnHandle(e, avatar.id, 'n')} className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-4 h-2.5 bg-cyan-400 border border-black rounded-xs cursor-ns-resize z-40 hover:scale-130" />
                          <div onMouseDown={(e) => handleMouseDownOnHandle(e, avatar.id, 's')} className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-2.5 bg-cyan-400 border border-black rounded-xs cursor-ns-resize z-40 hover:scale-130" />
                          <div onMouseDown={(e) => handleMouseDownOnHandle(e, avatar.id, 'w')} className="absolute top-1/2 -translate-y-1/2 -left-1.5 w-2.5 h-4 bg-cyan-400 border border-black rounded-xs cursor-ew-resize z-40 hover:scale-130" />
                          <div onMouseDown={(e) => handleMouseDownOnHandle(e, avatar.id, 'e')} className="absolute top-1/2 -translate-y-1/2 -right-1.5 w-2.5 h-4 bg-cyan-400 border border-black rounded-xs cursor-ew-resize z-40 hover:scale-130" />
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
                      onClick={handleResetBackground}
                      className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 font-bold flex items-center gap-1 cursor-pointer border border-white/20 text-[11px]"
                    >
                      <RotateCcw size={11} /> Đặt Lại Nền
                    </button>
                  </>
                ) : isImageLayerSelected ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleFillScreen(selectedAvatarId)}
                      className="px-2 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold flex items-center gap-1 cursor-pointer border border-amber-500/40 text-[11px]"
                    >
                      <Maximize2 size={11} /> Full Ảnh
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCenterAvatar(selectedAvatarId)}
                      className="px-2 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold flex items-center gap-1 cursor-pointer border border-amber-500/40 text-[11px]"
                    >
                      <Scaling size={11} /> Căn Giữa
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDuplicateImageLayer(selectedAvatarId)}
                      className="px-2 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold flex items-center gap-1 cursor-pointer border border-cyan-500/40 text-[11px]"
                    >
                      <Copy size={11} /> Nhân Bản
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteImageLayer(selectedAvatarId)}
                      className="px-2 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold flex items-center gap-1 cursor-pointer border border-red-500/40 text-[11px]"
                    >
                      <Trash2 size={11} /> Xóa Ảnh
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
                💡 Kéo thả tự do bất kỳ hình ảnh/nhân vật nào • Co giãn 8 góc cạnh • Mũi tên (↑↓←→) dịch 1% • Shift+Mũi tên dịch 5%
              </p>
            </div>

            {/* CỘT PHẢI: TOÀN BỘ CÀI ĐẶT ĐA NHÂN VẬT & LỚP ẢNH TINH CHỈNH */}
            <div className="lg:col-span-5 space-y-2">
              
              {/* 1. THANH CHỌN ĐỐI TƯỢNG */}
              <div className={`p-2.5 rounded-2xl border ${isEmbedded ? 'bg-white border-gray-200 shadow-xs' : 'bg-[#171922] border-gray-800'}`}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-black uppercase text-gray-500">
                    Đối tượng đang chọn:
                  </span>
                  <div className="flex items-center gap-1">
                    {isBgSelected ? (
                      <span className="font-black text-xs text-purple-600 dark:text-purple-400">🖼️ Ảnh Nền Studio 4K</span>
                    ) : isImageLayerSelected ? (
                      <input 
                        type="text" 
                        value={selectedImageLayer?.name || ''} 
                        onChange={(e) => handleUpdateImageLayer(selectedAvatarId, { name: e.target.value })}
                        className="font-black text-xs text-amber-500 dark:text-amber-400 bg-transparent border-b border-dashed border-amber-400 focus:outline-none px-1 text-right"
                        title="Bấm để đổi tên lớp ảnh"
                      />
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
                    <div className="truncate text-[9px]">Studio</div>
                  </button>

                  {activeAvatars.map((av, idx) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => { setSelectedAvatarId(av.id); if (inspectorTab === 'background' || inspectorTab === 'image_layer') setInspectorTab('media_transform'); }}
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

              {/* 2. THANH CHỌN TAB INSPECTOR */}
              <div className="flex items-center gap-1 bg-slate-200 dark:bg-black/40 p-1 rounded-xl border border-gray-300 dark:border-gray-800 overflow-x-auto">
                {!isBgSelected && !isImageLayerSelected && (
                  <>
                    <button
                      type="button"
                      onClick={() => setInspectorTab('media_transform')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
                        inspectorTab === 'media_transform' ? 'bg-cyan-500 text-black shadow-xs' : 'text-gray-600 dark:text-gray-400 hover:text-cyan-400'
                      }`}
                    >
                      <Sliders size={12} /> Video & Vị Trí
                    </button>
                    <button
                      type="button"
                      onClick={() => setInspectorTab('chroma')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
                        inspectorTab === 'chroma' ? 'bg-emerald-500 text-black shadow-xs' : 'text-gray-600 dark:text-gray-400 hover:text-emerald-400'
                      }`}
                    >
                      <Wand2 size={12} /> Tách Phông Xanh
                    </button>
                    <button
                      type="button"
                      onClick={() => setInspectorTab('voice')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
                        inspectorTab === 'voice' ? 'bg-indigo-500 text-white shadow-xs' : 'text-gray-600 dark:text-gray-400 hover:text-indigo-400'
                      }`}
                    >
                      <Mic size={12} /> Giọng Đọc
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => setInspectorTab('image_layer')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
                    inspectorTab === 'image_layer' ? 'bg-amber-400 text-black shadow-xs' : 'text-gray-600 dark:text-gray-400 hover:text-amber-400'
                  }`}
                >
                  <ImageIcon size={12} /> Lớp Ảnh ({extraImageLayers.length})
                </button>

                <button
                  type="button"
                  onClick={() => setInspectorTab('background')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
                    inspectorTab === 'background' ? 'bg-purple-600 text-white shadow-xs' : 'text-gray-600 dark:text-gray-400 hover:text-purple-400'
                  }`}
                >
                  <Palette size={12} /> Nền Studio
                </button>
              </div>

              {/* 3. NỘI DUNG INSPECTOR: TAB LỚP ẢNH (QUẢN LÝ NHIỀU HÌNH ẢNH / BANNER / LOGO) */}
              {inspectorTab === 'image_layer' && (
                <div className={`p-3 rounded-2xl border space-y-3 ${isEmbedded ? 'bg-white border-amber-200' : 'bg-[#151722] border-amber-500/30'}`}>
                  <div className="flex items-center justify-between">
                    <h4 className="font-black text-xs text-amber-400 uppercase flex items-center gap-1">
                      <ImageIcon size={14} /> Danh Sách Lớp Ảnh ({extraImageLayers.length})
                    </h4>
                    <label className="px-2 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-[11px] font-black flex items-center gap-1 cursor-pointer shadow-xs">
                      <Plus size={12} /> Thêm Ảnh Khác
                      <input 
                        type="file" 
                        multiple 
                        accept="image/*,video/*" 
                        onChange={handleMultiImageUpload} 
                        className="hidden" 
                      />
                    </label>
                  </div>

                  {extraImageLayers.length === 0 ? (
                    <div className="p-4 rounded-xl border border-dashed border-gray-700 text-center space-y-2">
                      <p className="text-xs text-gray-400">Chưa có ảnh nào được thêm vào sân khấu.</p>
                      <label className="inline-flex px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black items-center gap-1.5 cursor-pointer shadow-md">
                        <Upload size={13} /> Tải Nhiều Ảnh Ngay
                        <input 
                          type="file" 
                          multiple 
                          accept="image/*,video/*" 
                          onChange={handleMultiImageUpload} 
                          className="hidden" 
                        />
                      </label>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {extraImageLayers.map((layer, idx) => (
                        <div 
                          key={layer.id}
                          onClick={() => setSelectedAvatarId(layer.id)}
                          className={`p-2 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition-all ${
                            selectedAvatarId === layer.id
                              ? 'bg-amber-500/20 border-amber-400 shadow-xs'
                              : 'bg-black/30 border-gray-800 hover:border-gray-700'
                          }`}
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <img 
                              src={layer.url} 
                              alt={layer.name} 
                              className="w-9 h-9 rounded-lg object-contain bg-black/40 border border-white/10 shrink-0" 
                            />
                            <div className="overflow-hidden">
                              <span className="font-bold text-xs text-white block truncate">{layer.name || `Ảnh ${idx + 1}`}</span>
                              <span className="text-[10px] text-gray-400">X:{layer.x}% Y:{layer.y}% | {layer.width}×{layer.height}%</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); handleDuplicateImageLayer(layer.id); }}
                              className="p-1 rounded bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white text-[10px]"
                              title="Nhân bản"
                            >
                              <Copy size={12} />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); handleDeleteImageLayer(layer.id); }}
                              className="p-1 rounded bg-red-600/30 hover:bg-red-600 text-red-300 hover:text-white text-[10px]"
                              title="Xóa"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedImageLayer && (
                    <div className="p-2.5 rounded-xl bg-black/40 border border-amber-400/30 space-y-2">
                      <span className="text-[11px] font-black text-amber-300 block uppercase">
                        ⚙️ Tùy Chỉnh: {selectedImageLayer.name}
                      </span>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <label className="text-[10px] text-gray-400 block mb-0.5">Vị trí X ({selectedImageLayer.x ?? 20}%)</label>
                          <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={selectedImageLayer.x ?? 20} 
                            onChange={(e) => handleUpdateImageLayer(selectedImageLayer.id, { x: Number(e.target.value) })}
                            className="w-full accent-amber-400"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-400 block mb-0.5">Vị trí Y ({selectedImageLayer.y ?? 20}%)</label>
                          <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={selectedImageLayer.y ?? 20} 
                            onChange={(e) => handleUpdateImageLayer(selectedImageLayer.id, { y: Number(e.target.value) })}
                            className="w-full accent-amber-400"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-400 block mb-0.5">Chiều rộng ({selectedImageLayer.width ?? 35}%)</label>
                          <input 
                            type="range" 
                            min="5" 
                            max="100" 
                            value={selectedImageLayer.width ?? 35} 
                            onChange={(e) => handleUpdateImageLayer(selectedImageLayer.id, { width: Number(e.target.value) })}
                            className="w-full accent-amber-400"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-400 block mb-0.5">Chiều cao ({selectedImageLayer.height ?? 35}%)</label>
                          <input 
                            type="range" 
                            min="5" 
                            max="100" 
                            value={selectedImageLayer.height ?? 35} 
                            onChange={(e) => handleUpdateImageLayer(selectedImageLayer.id, { height: Number(e.target.value) })}
                            className="w-full accent-amber-400"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-400 block mb-0.5">Độ mờ / Opacity ({selectedImageLayer.opacity ?? 100}%)</label>
                          <input 
                            type="range" 
                            min="10" 
                            max="100" 
                            value={selectedImageLayer.opacity ?? 100} 
                            onChange={(e) => handleUpdateImageLayer(selectedImageLayer.id, { opacity: Number(e.target.value) })}
                            className="w-full accent-amber-400"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-400 block mb-0.5">Bo góc ({selectedImageLayer.borderRadius ?? 8}px)</label>
                          <input 
                            type="range" 
                            min="0" 
                            max="50" 
                            value={selectedImageLayer.borderRadius ?? 8} 
                            onChange={(e) => handleUpdateImageLayer(selectedImageLayer.id, { borderRadius: Number(e.target.value) })}
                            className="w-full accent-amber-400"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1 border-t border-gray-800">
                        <label className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={selectedImageLayer.chromaKey?.enabled || false}
                            onChange={(e) => handleUpdateImageLayer(selectedImageLayer.id, {
                              chromaKey: {
                                ...(selectedImageLayer.chromaKey || { color: '#00ff00', mode: 'green' }),
                                enabled: e.target.checked
                              }
                            })}
                            className="rounded accent-emerald-500 cursor-pointer"
                          />
                          <span>Tách nền xanh lá (Chroma)</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 4. NỘI DUNG INSPECTOR: TAB VIDEO & VỊ TRÍ NHÂN VẬT */}
              {inspectorTab === 'media_transform' && (
                <div className={`p-3 rounded-2xl border space-y-3 ${isEmbedded ? 'bg-white border-gray-200' : 'bg-[#151722] border-gray-800'}`}>
                  {/* Quản lý Media Video / Ảnh cho nhân vật */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-cyan-400 uppercase tracking-wider block">
                      🎬 Tải Video / Ảnh Cho #{selectedAvatar.id.replace('avatar_', '')} ({selectedAvatar.name})
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <label className="p-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors text-center">
                        <Upload size={16} />
                        <span className="text-[11px] font-black">Tải Từ Máy Tính</span>
                        <span className="text-[9px] text-gray-400">MP4, WebM, PNG, JPG</span>
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
                        className="p-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors text-center"
                      >
                        <FolderOpen size={16} />
                        <span className="text-[11px] font-black">Thư Viện Mẫu Có Sẵn</span>
                        <span className="text-[9px] text-gray-400">Chọn Avatar chuẩn HD</span>
                      </button>
                    </div>
                  </div>

                  {/* Tư thế mẫu 1-Click */}
                  <div className="space-y-1.5 pt-1 border-t border-gray-800">
                    <span className="text-[10px] font-black text-gray-400 uppercase block">
                      📐 Tư Thế Chuẩn Sân Khấu (1-Click):
                    </span>
                    <div className="grid grid-cols-5 gap-1 text-[10px]">
                      {[
                        { id: 'stand', icon: '🧍', label: 'Đứng' },
                        { id: 'sit_chair', icon: '🪑', label: 'Ghế' },
                        { id: 'sit_table', icon: '🛋️', label: 'Bàn Live' },
                        { id: 'half_body', icon: '👤', label: 'Nửa Thân' },
                        { id: 'close_up', icon: '🔍', label: 'Cận Cảnh' }
                      ].map(p => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => handleApplyPosePreset(selectedAvatar.id, p.id)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-gray-200 border border-white/10 flex flex-col items-center justify-center gap-0.5 cursor-pointer hover:border-cyan-400"
                        >
                          <span className="text-sm">{p.icon}</span>
                          <span className="font-bold">{p.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Thanh trượt điều chỉnh vị trí chi tiết */}
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-gray-800">
                    <div>
                      <label className="text-[10px] text-gray-400 block mb-0.5">Vị trí X ({selectedAvatar.transform?.x ?? 0}%)</label>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={selectedAvatar.transform?.x ?? 0} 
                        onChange={(e) => handleAvatarTransformChange(selectedAvatar.id, 'x', Number(e.target.value))}
                        className="w-full accent-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400 block mb-0.5">Vị trí Y ({selectedAvatar.transform?.y ?? 0}%)</label>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={selectedAvatar.transform?.y ?? 0} 
                        onChange={(e) => handleAvatarTransformChange(selectedAvatar.id, 'y', Number(e.target.value))}
                        className="w-full accent-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400 block mb-0.5">Rộng ({selectedAvatar.transform?.width ?? 45}%)</label>
                      <input 
                        type="range" 
                        min="10" 
                        max="100" 
                        value={selectedAvatar.transform?.width ?? 45} 
                        onChange={(e) => handleAvatarTransformChange(selectedAvatar.id, 'width', Number(e.target.value))}
                        className="w-full accent-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400 block mb-0.5">Cao ({selectedAvatar.transform?.height ?? 75}%)</label>
                      <input 
                        type="range" 
                        min="10" 
                        max="100" 
                        value={selectedAvatar.transform?.height ?? 75} 
                        onChange={(e) => handleAvatarTransformChange(selectedAvatar.id, 'height', Number(e.target.value))}
                        className="w-full accent-cyan-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 5. NỘI DUNG INSPECTOR: TAB TÁCH PHÔNG XANH (CHROMA KEY) */}
              {inspectorTab === 'chroma' && (
                <div className={`p-3 rounded-2xl border space-y-3 ${isEmbedded ? 'bg-white border-emerald-200' : 'bg-[#151722] border-emerald-500/30'}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs text-emerald-400 uppercase flex items-center gap-1">
                      <Wand2 size={14} /> Tách Nền Siêu Sạch 4K
                    </span>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={selectedAvatar.chromaKey?.enabled || false}
                        onChange={(e) => handleAvatarChromaChange(selectedAvatar.id, 'enabled', e.target.checked)}
                        className="rounded accent-emerald-500 w-4 h-4 cursor-pointer"
                      />
                      <span className="text-xs font-bold text-white">Kích Hoạt Tách Nền</span>
                    </label>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] text-gray-400 block font-bold">Màu phông nền cần tách:</span>
                    <div className="grid grid-cols-4 gap-1 text-[11px] font-black">
                      {[
                        { id: 'green', color: '#00ff00', label: 'Xanh Lá' },
                        { id: 'blue', color: '#0000ff', label: 'Xanh Dương' },
                        { id: 'black', color: '#000000', label: 'Nền Đen' },
                        { id: 'white', color: '#ffffff', label: 'Nền Trắng' }
                      ].map(m => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => handleAvatarChromaBatch(selectedAvatar.id, { mode: m.id, color: m.color, enabled: true })}
                          className={`p-1.5 rounded-xl border flex items-center justify-center gap-1 cursor-pointer transition-all ${
                            selectedAvatar.chromaKey?.mode === m.id
                              ? 'bg-emerald-600 text-white border-emerald-400 shadow-sm font-black'
                              : 'bg-black/40 text-gray-300 border-gray-800 hover:border-gray-600'
                          }`}
                        >
                          <span className="w-2.5 h-2.5 rounded-full border border-black/40" style={{ backgroundColor: m.color }} />
                          <span>{m.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 6. NỘI DUNG INSPECTOR: TAB GIỌNG NÓI */}
              {inspectorTab === 'voice' && (
                <div className={`p-3 rounded-2xl border space-y-3 ${isEmbedded ? 'bg-white border-indigo-200' : 'bg-[#151722] border-indigo-500/30'}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs text-indigo-400 uppercase flex items-center gap-1">
                      <Mic size={14} /> Giọng Đọc Cho #{selectedAvatar.id.replace('avatar_', '')} ({selectedAvatar.name})
                    </span>
                  </div>

                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {ALL_SYSTEM_VOICES.slice(0, 16).map(v => (
                      <div 
                        key={v.id}
                        onClick={() => handleAvatarChange(selectedAvatar.id, 'voiceId', v.id)}
                        className={`p-2 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition-all ${
                          selectedAvatar.voiceId === v.id
                            ? 'bg-indigo-600/30 border-indigo-400 text-white font-bold'
                            : 'bg-black/30 border-gray-800 text-gray-300 hover:border-gray-700'
                        }`}
                      >
                        <div className="overflow-hidden">
                          <span className="text-xs block truncate">{v.name}</span>
                          <span className="text-[10px] text-gray-400">{v.gender === 'Female' ? 'Nữ' : 'Nam'} • {v.style || 'Tự nhiên'}</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleVoicePreview(v.id); }}
                          className="px-2 py-1 rounded bg-indigo-500/20 hover:bg-indigo-500 text-indigo-300 hover:text-white text-[10px] font-black shrink-0"
                        >
                          {previewingVoiceId === v.id ? '⏹️ Dừng' : '▶️ Thử'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 7. NỘI DUNG INSPECTOR: TAB NỀN STUDIO */}
              {inspectorTab === 'background' && (
                <div className={`p-3 rounded-2xl border space-y-3 ${isEmbedded ? 'bg-white border-purple-200' : 'bg-[#151722] border-purple-500/30'}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs text-purple-400 uppercase flex items-center gap-1">
                      <Palette size={14} /> Tải Ảnh Nền Hoặc Chọn Mẫu 4K
                    </span>
                    <label className="px-2 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-black flex items-center gap-1 cursor-pointer shadow-xs">
                      <Upload size={12} /> Tải Ảnh Nền Từ Máy
                      <input 
                        type="file" 
                        accept="image/*,video/*" 
                        onChange={handleCustomBackgroundUpload} 
                        className="hidden" 
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 max-h-48 overflow-y-auto pr-1">
                    {STUDIO_BACKGROUND_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectBackground(preset)}
                        className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                          config.backgroundUrl === preset.url
                            ? 'bg-purple-600/40 border-purple-400 text-white font-black scale-102'
                            : 'bg-black/30 border-gray-800 text-gray-300 hover:border-gray-700'
                        }`}
                      >
                        <span className="text-xl">{preset.preview}</span>
                        <span className="text-[10px] truncate max-w-[80px]">{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        ) : activeTab === 'templates' ? (
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

            {/* 2. KHUNG SOẠN THẢO & NHẬP KỊCH BẢN TÙY CHỈNH */}
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
                  {activeAvatars.map((av) => (
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
                    onClick={() => handleApplyScript(customScriptText, activeCount)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs shadow-md flex items-center gap-1.5 cursor-pointer hover:scale-102 transition-all"
                  >
                    <Check size={14} /> Áp Dụng Kịch Bản Này Vào Phòng Live Ngay
                  </button>
                </div>
              )}
            </div>

            {/* 3. BỘ SƯU TẬP CÁC MẪU KỊCH BẢN ĐỐI THOẠI */}
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
                        
                        <pre className="p-3.5 rounded-2xl bg-black/60 text-xs text-gray-200 font-mono whitespace-pre-wrap h-64 sm:h-72 overflow-y-auto border border-gray-700/60 shadow-inner">
                          {tmpl.script}
                        </pre>
                      </div>

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
                            <Copy size={12} /> Copy
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleApplyScript(tmpl.script, tmpl.count)}
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
        ) : (
          /* TAB 3: KẾT NỐI TIKTOK LIVE STUDIO & OBS */
          <div className="space-y-4 p-4 max-w-5xl mx-auto">
            <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950/60 via-[#131520] to-[#0c0d14] border border-cyan-500/40 shadow-2xl space-y-5">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-black shadow-lg">
                  <MonitorPlay size={24} />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    Kết Nối TikTok Live Studio & OBS Studio
                  </h3>
                  <p className="text-xs text-gray-400">
                    Phát sóng luồng video siêu nét 1080p chứa toàn bộ 2–4 nhân vật, ảnh nền, logo banner và âm thanh nhép môi đồng bộ.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Cách 1: Browser Source Link */}
                <div className="p-5 rounded-2xl bg-black/50 border border-cyan-500/30 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="px-2 py-0.5 rounded-lg bg-cyan-500/20 text-cyan-300 text-[10px] font-black uppercase">
                      Cách 1 (Khuyên Dùng)
                    </span>
                    <h4 className="font-bold text-sm text-white">Browser Source URL</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Dán link này vào nguồn <strong>Browser Source</strong> trong TikTok Live Studio hoặc OBS Studio (Kích thước: 1080×1920 cho live dọc hoặc 1920×1080 cho live ngang).
                    </p>
                    <div className="p-2.5 rounded-xl bg-black/80 border border-gray-700 text-xs font-mono text-cyan-300 truncate select-all">
                      {liveOverlayUrl}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyOverlayLink}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-black text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-102"
                  >
                    <Copy size={14} /> Sao Chép Link Browser Source
                  </button>
                </div>

                {/* Cách 2: Window Capture */}
                <div className="p-5 rounded-2xl bg-black/50 border border-purple-500/30 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="px-2 py-0.5 rounded-lg bg-purple-500/20 text-purple-300 text-[10px] font-black uppercase">
                      Cách 2 (Quay Cửa Sổ)
                    </span>
                    <h4 className="font-bold text-sm text-white">Window Capture 1080p</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Mở một cửa sổ phụ sạch 100% không nút bấm, sau đó trong TikTok Studio hoặc OBS chọn <strong>Quay Cửa Sổ (Window Capture)</strong> để quay cửa sổ này.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleOpenCleanWindow}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-102"
                  >
                    <ExternalLink size={14} /> Mở Cửa Sổ Sạch (Window Capture)
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-950/40 border border-blue-800/40 text-xs text-gray-300 leading-relaxed flex items-start gap-2">
                <Info size={16} className="text-blue-400 shrink-0 mt-0.5" />
                <span>
                  💡 <strong>Ghi chú phát sóng:</strong> Khi bạn đã BẬT chế độ 2–4 Avatar và bắt đầu chạy kịch bản hoặc nhận sự kiện bình luận, tất cả chuyển động nhép miệng, highlight nhân vật và lớp hình ảnh sẽ tự động hiển thị mượt mà 60 FPS trên TikTok Live Studio.
                </span>
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

              <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-800/50">
                <strong className="text-amber-300 block mb-1">🖼️ Tải Nhiều Lớp Ảnh (Logo/Banner):</strong>
                Bấm nút <strong>+ Tải Nhiều Ảnh</strong> ở thanh công cụ trên cùng để nạp cùng lúc hoặc nhiều lần bất kỳ ảnh nào bạn muốn. Bạn có thể kéo thả tự do, co giãn 8 góc cạnh và xếp lớp tùy thích.
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/50">
                <strong className="text-emerald-300 block mb-1">🟢 Tách Nền / Xóa Phông Xanh (Chroma Key):</strong>
                Tự động lọc trong suốt phông xanh lá, xanh dương hoặc màu tùy ý để nhân vật hòa quyện hoàn hảo vào không gian phòng Live Studio.
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
