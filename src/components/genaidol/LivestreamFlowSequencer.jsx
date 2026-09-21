import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, Square, SkipForward, SkipBack, Plus, Trash2, Edit3, Copy, 
  Save, Download, Upload, Sparkles, Clock, Video, Mic, MessageCircle, 
  ShoppingCart, Megaphone, Film, Layers, CheckCircle2, AlertCircle, 
  ChevronUp, ChevronDown, RotateCcw, Bot, Volume2, Users, ShieldCheck, 
  Zap, Star, Tag, Eye, Info, FileText, Image as ImageIcon, Type, Pin, 
  Maximize2, Sliders, Check, X, Palette, Move, Monitor, Wand2,
  FolderOpen, Scaling, UserCheck, RefreshCw, Smartphone, ArrowUpToLine, 
  ArrowDownToLine, Lock, Unlock, EyeOff, LayoutGrid, Radio
} from 'lucide-react';
import UniversalMediaPicker from './UniversalMediaPicker';
import { readUniversalFile } from '../../utils/universalDocumentParser';
import { SvgChromaFilters } from './MultiAvatarStudioModal';
import { 
  getMultiAvatarConfig, 
  saveMultiAvatarConfig, 
  getChromaStyle, 
  isImageMedia,
  STUDIO_STAGE_PRESETS,
  previewVoiceAudio,
  stopVoiceAudio
} from '../../utils/voiceSyncService';

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
  },
  info: (message) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('avalive_toast', { detail: { type: 'info', message } }));
    }
  }
};

// 🎯 Danh mục các loại hành động trong kịch bản
export const ACTION_TYPES = [
  { id: 'avatar_talk', label: '🗣️ AI Avatar Mở Màn & Chia Sẻ', icon: Bot, color: 'text-purple-400', bg: 'bg-purple-500/15 border-purple-500/40', desc: 'Avatar AI xuất hiện nhép miệng đọc kịch bản theo giọng nói AI.' },
  { id: 'tiktok_qa', label: '💬 AI Trả Lời Bình Luận TikTok Live', icon: MessageCircle, color: 'text-blue-400', bg: 'bg-blue-500/15 border-blue-500/40', desc: 'Lắng nghe bình luận TikTok và tự động phản hồi bằng Voice AI.' },
  { id: 'product_video', label: '🎬 Phát Video Giới Thiệu Sản Phẩm', icon: Video, color: 'text-emerald-400', bg: 'bg-emerald-500/15 border-emerald-500/40', desc: 'Tự động phát video sản phẩm, tính năng và công dụng.' },
  { id: 'feedback_video', label: '⭐ Phát Video Feedback / Review Khách', icon: Film, color: 'text-amber-400', bg: 'bg-amber-500/15 border-amber-500/40', desc: 'Phát video cảm nhận, bằng chứng và đánh giá thực tế.' },
  { id: 'cta_sale', label: '🔥 Kêu Gọi Hành Động (CTA) & Chốt Sale', icon: Megaphone, color: 'text-rose-400', bg: 'bg-rose-500/15 border-rose-500/40', desc: 'Đọc thông báo ưu đãi có hạn, đếm ngược thời gian và kêu gọi giỏ hàng.' },
  { id: 'custom_video', label: '📹 Phát Video Tùy Chọn Bất Kỳ', icon: Video, color: 'text-cyan-400', bg: 'bg-cyan-500/15 border-cyan-500/40', desc: 'Phát bất kỳ video nào từ máy tính.' }
];

// 🔤 20 Phông Chữ Độc Đáo Chuyên Nghiệp
export const FONT_FAMILIES = [
  { id: 'be_vietnam', name: '1. Be Vietnam Pro (Chuẩn Việt)', font: '"Be Vietnam Pro", sans-serif' },
  { id: 'montserrat', name: '2. Montserrat (Hiện Đại VIP)', font: 'Montserrat, sans-serif' },
  { id: 'roboto', name: '3. Roboto (Rõ Ràng Dễ Đọc)', font: 'Roboto, sans-serif' },
  { id: 'oswald', name: '4. Oswald (In Hoa Mạnh Mẽ)', font: 'Oswald, sans-serif' },
  { id: 'playfair', name: '5. Playfair (Quý Phái Serif)', font: '"Playfair Display", serif' },
  { id: 'nunito', name: '6. Nunito (Bo Tròn Trẻ Trung)', font: 'Nunito, sans-serif' },
  { id: 'anton', name: '7. Anton (Đậm Nét Chốt Deal)', font: 'Anton, sans-serif' },
  { id: 'dancing_script', name: '8. Dancing Script (Nghệ Thuật)', font: '"Dancing Script", cursive' },
  { id: 'pacifico', name: '9. Pacifico (Mềm Mại Cổ Điển)', font: 'Pacifico, cursive' },
  { id: 'bangers', name: '10. Bangers (Truyện Tranh Sôi Động)', font: 'Bangers, cursive' },
  { id: 'lobster', name: '11. Lobster (Nổi Bật Ấn Tượng)', font: 'Lobster, cursive' },
  { id: 'comfortaa', name: '12. Comfortaa (Công Nghệ Tương Lai)', font: 'Comfortaa, cursive' },
  { id: 'caveat', name: '13. Caveat (Viết Tay Tự Nhiên)', font: 'Caveat, cursive' },
  { id: 'kanit', name: '14. Kanit (Thể Thao Năng Động)', font: 'Kanit, sans-serif' },
  { id: 'merriweather', name: '15. Merriweather (Trang Nhã)', font: 'Merriweather, serif' },
  { id: 'poppins', name: '16. Poppins (Hình Học Chuẩn)', font: 'Poppins, sans-serif' },
  { id: 'chakra_petch', name: '17. Chakra Petch (Cyberpunk)', font: '"Chakra Petch", sans-serif' },
  { id: 'orbitron', name: '18. Orbitron (Sci-Fi Tương Lai)', font: 'Orbitron, sans-serif' },
  { id: 'russo_one', name: '19. Russo One (Dứt Khoát)', font: '"Russo One", sans-serif' },
  { id: 'system', name: '20. Inter / Hệ Thống', font: 'Inter, system-ui, sans-serif' }
];

// 🎨 20 Gợi Ý Màu Sắc & Typography Sang Trọng Cho Chữ Sân Khấu
export const TEXT_STYLE_PRESETS = [
  { id: 'neon_cyber', name: '1. Neon Cyber Xanh', className: 'bg-black/85 text-cyan-300 border-2 border-cyan-400 shadow-cyan-500/50' },
  { id: 'gold_luxury', name: '2. Gold Hoàng Gia VIP', className: 'bg-gradient-to-r from-amber-500 to-yellow-300 text-slate-950 border border-yellow-200 shadow-amber-500/30' },
  { id: 'fire_sale', name: '3. Flash Sale Đỏ Lửa', className: 'bg-gradient-to-r from-rose-600 via-red-500 to-amber-500 text-white border border-yellow-300/40 shadow-red-500/40' },
  { id: 'rose_pink', name: '4. Gradient Hồng Phấn', className: 'bg-gradient-to-r from-rose-500 to-pink-500 text-white border border-pink-300/40' },
  { id: 'purple_hologram', name: '5. Tím Hologram Thần Bí', className: 'bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-600 text-cyan-200 border border-indigo-400/50' },
  { id: 'minimal_white', name: '6. Trắng Tối Giản Viền Đen', className: 'bg-white/95 text-slate-950 border-2 border-slate-900 shadow-lg' },
  { id: 'lime_neon', name: '7. Vàng Chanh Neon Tươi Mát', className: 'bg-lime-400 text-slate-950 border-2 border-lime-200 font-black shadow-lime-500/40' },
  { id: 'sunset_orange', name: '8. Cam Hoàng Hôn Rực Rỡ', className: 'bg-gradient-to-r from-orange-500 to-amber-400 text-white border border-orange-300/50' },
  { id: 'emerald_mint', name: '9. Xanh Ngọc Lục Bảo', className: 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white border border-emerald-300/50' },
  { id: 'ice_diamond', name: '10. Kim Cương Băng Giá', className: 'bg-gradient-to-r from-sky-400 via-cyan-300 to-blue-400 text-slate-950 border-2 border-cyan-100' },
  { id: 'titanium_silver', name: '11. Bạc Titan Ánh Kim', className: 'bg-gradient-to-r from-slate-200 via-gray-300 to-slate-400 text-slate-950 border border-white' },
  { id: 'ruby_glamour', name: '12. Đỏ Ruby Quyến Rũ', className: 'bg-gradient-to-r from-rose-700 to-red-600 text-yellow-300 border border-yellow-400/50' },
  { id: 'royal_velvet', name: '13. Hoàng Gia Cung Đình', className: 'bg-gradient-to-r from-violet-900 via-purple-800 to-fuchsia-800 text-amber-200 border border-amber-400/60' },
  { id: 'cyberpunk_yellow', name: '14. Cyberpunk Đen Vàng', className: 'bg-black/90 text-yellow-400 border-2 border-yellow-400 shadow-yellow-500/40' },
  { id: 'rainbow_holo', name: '15. Hologram Đa Sắc', className: 'bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white border border-white/50' },
  { id: 'ocean_blue', name: '16. Gradient Biển Sâu', className: 'bg-gradient-to-r from-blue-700 via-indigo-600 to-cyan-500 text-white border border-cyan-300/40' },
  { id: 'matrix_laser', name: '17. Laser Matrix Xanh Lá', className: 'bg-black/90 text-green-400 border-2 border-green-500 shadow-green-500/40' },
  { id: 'sweet_candy', name: '18. Hồng Kẹo Ngọt', className: 'bg-gradient-to-r from-fuchsia-400 to-pink-300 text-slate-900 border border-white/60' },
  { id: 'caramel_warm', name: '19. Trà Sữa Caramel', className: 'bg-gradient-to-r from-amber-700 to-yellow-600 text-white border border-amber-300/40' },
  { id: 'dark_neon', name: '20. Đen Huyền Bí Viền Neon', className: 'bg-slate-950/95 text-white border-2 border-purple-500 shadow-purple-500/50' }
];

// 📚 Kịch bản mặc định sạch sẽ cho người dùng tự biên soạn
export const DEFAULT_PRESETS = [
  {
    id: 'preset_custom_flow',
    name: '🎬 Kịch Bản Live Tùy Chỉnh Của Bạn',
    category: 'Tùy Chỉnh',
    avatarCount: 1,
    description: 'Kịch bản do bạn tự biên soạn, tải file văn bản hoặc thêm các bước linh hoạt.',
    loop: true,
    steps: [
      {
        id: 's1',
        title: 'Bước 1: Avatar AI Chào Khán Giả & Mở Đầu Live',
        actionType: 'avatar_talk',
        avatarSpeaker: 'avatar_1',
        durationSeconds: 60,
        scriptText: 'Dạ em xin chào tất cả mọi người đã vào xem phiên livestream hôm nay nha! Các bạn bấm thả tim và bình luận để nhận ưu đãi đặc biệt nhé!',
        mediaUrl: '/idols/phong_studio_ngoc_trinh_4k.mp4',
        lipsyncUrl: '/idols/phong_studio_ngoc_trinh_4k.mp4',
        voiceMode: 'avatar_lipsync',
        commentHandling: 'ai_brain',
        overlayText: '🌸 CHÀO MỪNG ĐẾN VỚI PHIÊN LIVESTREAM',
        overlayTextStyle: 'fire_sale',
        overlayTextFontSize: 20,
        overlayTextFontFamily: 'be_vietnam',
        isMediaPinned: false,
        isOverlayImagePinned: false,
        isOverlayTextPinned: false
      }
    ]
  }
];

export default function LivestreamFlowSequencer() {
  // Cấu hình Studio 1-4 Avatar
  const [multiAvatarConfig, setMultiAvatarConfig] = useState(() => {
    try {
      return getMultiAvatarConfig();
    } catch (e) {
      return { enabled: true, activeCount: 1, avatars: [] };
    }
  });

  // State Quản lý Kịch Bản & Các Bước
  const [presets, setPresets] = useState(() => {
    try {
      const saved = localStorage.getItem('avalive_flow_presets');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return DEFAULT_PRESETS;
  });

  const [activePresetId, setActivePresetId] = useState(() => {
    try {
      const savedId = localStorage.getItem('avalive_active_flow_preset_id');
      if (savedId) return savedId;
    } catch (e) {}
    return DEFAULT_PRESETS[0].id;
  });

  const activePreset = presets.find(p => p.id === activePresetId) || presets[0] || DEFAULT_PRESETS[0];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlayingFlow, setIsPlayingFlow] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(60);
  const [expandedStepId, setExpandedStepId] = useState(null);
  const [isSpeakingPreview, setIsSpeakingPreview] = useState(false);
  const [showPresetModal, setShowPresetModal] = useState(false);
  const [presetNameInput, setPresetNameInput] = useState('');

  // 📡 State Đồng Bộ Ra Sân Khấu Chính (OBS / TikTok Live Studio)
  const [isMasterSynced, setIsMasterSynced] = useState(() => {
    try {
      return localStorage.getItem('aidol_master_live_synced') === 'true';
    } catch (e) {
      return false;
    }
  });

  // 🎯 State Layer Tương Tác Kéo Thả & Co Giãn 8 Điểm Trên Sân Khấu
  const [selectedLayer, setSelectedLayer] = useState({ type: 'avatar', id: 'avatar_1' });
  const [dragState, setDragState] = useState(null);

  const stageInnerRef = useRef(null);
  const timerRef = useRef(null);

  // Lắng nghe thay đổi cấu hình avatar từ hệ thống
  useEffect(() => {
    const handleConfigChange = (e) => {
      if (e.detail) {
        setMultiAvatarConfig(e.detail);
      } else {
        try {
          setMultiAvatarConfig(getMultiAvatarConfig());
        } catch (err) {}
      }
    };
    window.addEventListener('avalive_multi_avatar_changed', handleConfigChange);
    return () => window.removeEventListener('avalive_multi_avatar_changed', handleConfigChange);
  }, []);

  // Lưu presets vào localStorage khi có thay đổi
  useEffect(() => {
    try {
      localStorage.setItem('avalive_flow_presets', JSON.stringify(presets));
      localStorage.setItem('avalive_active_flow_preset_id', activePresetId);
    } catch (e) {}
  }, [presets, activePresetId]);

  // Đẩy video và dữ liệu phân đoạn của bước hiện tại lên Sân khấu chính (khi đã BẬT đồng bộ)
  const syncStepToServer = (step, index = 0, isLivePlaying = true) => {
    if (!step) return;
    
    // Kiểm tra media ghim từ các bước trước nếu bước hiện tại để trống
    let mediaToPlay = step.mediaUrl;
    let overlayImgToPlay = step.overlayImage;
    let overlayTxtToPlay = step.overlayText;
    let secondaryToPlay = step.secondaryMediaUrl;

    if (!mediaToPlay && activePreset?.steps) {
      const pinnedStep = activePreset.steps.slice(0, index + 1).reverse().find(s => s.isMediaPinned && s.mediaUrl);
      if (pinnedStep) mediaToPlay = pinnedStep.mediaUrl;
    }
    if (!overlayImgToPlay && activePreset?.steps) {
      const pinnedStep = activePreset.steps.slice(0, index + 1).reverse().find(s => s.isOverlayImagePinned && s.overlayImage);
      if (pinnedStep) overlayImgToPlay = pinnedStep.overlayImage;
    }
    if (!overlayTxtToPlay && activePreset?.steps) {
      const pinnedStep = activePreset.steps.slice(0, index + 1).reverse().find(s => s.isOverlayTextPinned && s.overlayText);
      if (pinnedStep) overlayTxtToPlay = pinnedStep.overlayText;
    }
    if (!secondaryToPlay && activePreset?.steps) {
      const pinnedStep = activePreset.steps.slice(0, index + 1).reverse().find(s => s.isSecondaryMediaPinned && s.secondaryMediaUrl);
      if (pinnedStep) secondaryToPlay = pinnedStep.secondaryMediaUrl;
    }

    if (!mediaToPlay) {
      mediaToPlay = multiAvatarConfig?.backgroundUrl || '/idols/phong_studio_ngoc_trinh_4k.mp4';
    }
    
    const payload = {
      mediaUrl: mediaToPlay,
      title: step.title,
      actionType: step.actionType,
      scriptText: step.scriptText || '',
      durationSeconds: step.durationSeconds || 60,
      stepIndex: index + 1,
      totalSteps: activePreset?.steps?.length || 1,
      presetName: activePreset?.name || 'Kịch bản Sequencer',
      secondaryMediaUrl: secondaryToPlay || null,
      secondaryMediaTransform: step.secondaryMediaTransform || null,
      overlayImage: overlayImgToPlay || null,
      overlayImageTransform: step.overlayImageTransform || null,
      overlayText: overlayTxtToPlay || null,
      overlayTextStyle: step.overlayTextStyle || 'fire_sale',
      overlayTextFontFamily: step.overlayTextFontFamily || 'be_vietnam',
      overlayTextFontSize: step.overlayTextFontSize || 20,
      overlayTextTransform: step.overlayTextTransform || null,
      avatarSpeaker: step.avatarSpeaker || 'avatar_1',
      avatarTransforms: step.avatarTransforms || null,
      isMediaPinned: !!step.isMediaPinned,
      isPlaying: isLivePlaying
    };

    if (isMasterSynced) {
      window.dispatchEvent(new CustomEvent('avalive:update_master_media', { detail: payload }));
      if (step.avatarSpeaker) {
        window.dispatchEvent(new CustomEvent('avalive:speaker_change', { detail: { speakerId: step.avatarSpeaker } }));
      }
      fetch('/api/live-state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mediaUrl: mediaToPlay,
          currentMedia: mediaToPlay,
          activeTab: 'flow_sequencer',
          stepTitle: step.title,
          actionType: step.actionType,
          scriptText: step.scriptText,
          avatarSpeaker: step.avatarSpeaker || 'avatar_1',
          secondaryMediaUrl: secondaryToPlay || null,
          overlayImage: overlayImgToPlay || null,
          overlayText: overlayTxtToPlay || null,
          overlayTextStyle: step.overlayTextStyle || 'fire_sale',
          overlayTextFontFamily: step.overlayTextFontFamily || 'be_vietnam',
          overlayTextFontSize: step.overlayTextFontSize || 20,
          isMediaPinned: !!step.isMediaPinned,
          isPlaying: isLivePlaying,
          fit: 'cover',
          sound: true,
          updatedAt: Date.now()
        })
      }).catch(() => {});
    }
  };

  // Khởi động hoặc chuyển bước trong chuỗi kịch bản
  const startStep = (index, shouldPlay = true) => {
    if (!activePreset || !activePreset.steps || activePreset.steps.length === 0) {
      toast.error('Kịch bản chưa có phân đoạn nào!');
      return;
    }
    const safeIndex = (index >= 0 && index < activePreset.steps.length) ? index : 0;
    const step = activePreset.steps[safeIndex];
    setCurrentStepIndex(safeIndex);
    setSecondsRemaining(step.durationSeconds || 60);
    syncStepToServer(step, safeIndex, shouldPlay);
  };

  // Timer điều phối chuỗi phân đoạn tự động
  useEffect(() => {
    if (!isPlayingFlow) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          const nextIndex = currentStepIndex + 1;
          if (nextIndex < activePreset.steps.length) {
            startStep(nextIndex, true);
            toast.success(`🎬 Chuyển sang bước ${nextIndex + 1}: ${activePreset.steps[nextIndex].title}`);
          } else {
            if (activePreset.loop) {
              startStep(0, true);
              toast.success(`🔄 Lặp lại kịch bản: ${activePreset.name}`);
            } else {
              handleStopFlow();
              toast.success('🎉 Đã hoàn thành chuỗi kịch bản!');
            }
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlayingFlow, currentStepIndex, activePreset]);

  // 🛑 DỪNG TỨC THÌ 100% VÀ TẮT MỌI ÂM THANH / GIỌNG NÓI
  const handleStopFlow = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsPlayingFlow(false);
    setIsSpeakingPreview(false);
    stopVoiceAudio();
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('avalive:stop_flow_sequencer'));
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      window.__isScriptLiveRunning = false;
      try { localStorage.setItem('aidol_is_script_live_running', 'false'); } catch (e) {}
    }

    fetch('/api/live-state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        activeTab: 'flow_sequencer',
        isPlaying: false,
        updatedAt: Date.now()
      })
    }).catch(() => {});

    toast.success('⏹️ ĐÃ DỪNG TOÀN BỘ CHUỖI KỊCH BẢN & GIỌNG NÓI!');
  };

  // ▶️ BẮT ĐẦU CHẠY LIVE
  const handleStartFlow = () => {
    setIsPlayingFlow(true);
    if (typeof window !== 'undefined') {
      window.__isScriptLiveRunning = true;
      try { localStorage.setItem('aidol_is_script_live_running', 'true'); } catch (e) {}
    }
    if (secondsRemaining <= 0) {
      startStep(currentStepIndex, true);
    } else {
      syncStepToServer(activePreset.steps[currentStepIndex], currentStepIndex, true);
    }
    toast.success('▶️ BẮT ĐẦU PHÁT CHUỖI KỊCH BẢN!');
  };

  // 📡 BẬT / TẮT ĐỒNG BỘ RA SÂN KHẤU CHÍNH
  const handleToggleMasterSync = () => {
    if (!isMasterSynced) {
      setIsMasterSynced(true);
      try { localStorage.setItem('aidol_master_live_synced', 'true'); } catch (e) {}
      const step = activePreset.steps[currentStepIndex] || activePreset.steps[0];
      syncStepToServer(step, currentStepIndex, true);
      toast.success('📡 ĐÃ BẬT ĐỒNG BỘ: Phát trực tiếp ra Sân Khấu Chính, OBS và TikTok Live Studio!');
    } else {
      setIsMasterSynced(false);
      try { localStorage.setItem('aidol_master_live_synced', 'false'); } catch (e) {}
      toast.info('🔒 ĐÃ TẮT ĐỒNG BỘ: Quay lại chế độ Căn chỉnh & Chạy test nội bộ.');
    }
  };

  // 👥 Thay đổi số lượng Avatar (1, 2, 3, 4 người)
  const handleChangeAvatarCount = (count) => {
    const updated = {
      ...multiAvatarConfig,
      activeCount: count,
      enabled: true
    };
    setMultiAvatarConfig(updated);
    saveMultiAvatarConfig(updated);
    toast.success(`👥 Đã chọn chế độ ${count} Nhân Vật`);
  };

  // Cập nhật thông tin bước
  const handleUpdateStep = (stepId, field, value) => {
    setPresets(prev => prev.map(p => {
      if (p.id !== activePresetId) return p;
      return {
        ...p,
        steps: p.steps.map(s => {
          if (s.id !== stepId) return s;
          return { ...s, [field]: value };
        })
      };
    }));
  };

  // Xóa trực tiếp 1 layer khỏi bước hiện tại
  const handleDeleteLayerFromStep = (stepId, layerType, avatarId = null) => {
    setPresets(prev => prev.map(p => {
      if (p.id !== activePresetId) return p;
      return {
        ...p,
        steps: p.steps.map(s => {
          if (s.id !== stepId) return s;
          if (layerType === 'text') return { ...s, overlayText: '' };
          if (layerType === 'banner') return { ...s, overlayImage: '' };
          if (layerType === 'pip') return { ...s, secondaryMediaUrl: '' };
          if (layerType === 'main_media') return { ...s, mediaUrl: '' };
          return s;
        })
      };
    }));
    toast.info(`🗑️ Đã xóa lớp ${layerType.toUpperCase()} khỏi bước!`);
  };

  // Cập nhật tọa độ transform riêng của một layer trong bước hiện tại (Persistence per step)
  const handleUpdateStepTransform = (stepId, layerType, transformData, avatarId = null) => {
    setPresets(prev => prev.map(p => {
      if (p.id !== activePresetId) return p;
      return {
        ...p,
        steps: p.steps.map(s => {
          if (s.id !== stepId) return s;
          if (layerType === 'avatar' && avatarId) {
            return {
              ...s,
              avatarTransforms: {
                ...(s.avatarTransforms || {}),
                [avatarId]: transformData
              }
            };
          } else if (layerType === 'pip') {
            return { ...s, secondaryMediaTransform: transformData };
          } else if (layerType === 'banner') {
            return { ...s, overlayImageTransform: transformData };
          } else if (layerType === 'text') {
            return { ...s, overlayTextTransform: transformData };
          }
          return s;
        })
      };
    }));
  };

  // 🔒 Áp dụng vị trí các lớp hiện tại cho toàn bộ các bước trong kịch bản (100% Hoạt động)
  const handleApplyLayoutToAllSteps = () => {
    const currentStepObj = activePreset.steps[currentStepIndex];
    if (!currentStepObj) return;

    setPresets(prev => prev.map(p => {
      if (p.id !== activePresetId) return p;
      return {
        ...p,
        steps: p.steps.map(s => ({
          ...s,
          avatarTransforms: currentStepObj.avatarTransforms ? JSON.parse(JSON.stringify(currentStepObj.avatarTransforms)) : s.avatarTransforms,
          secondaryMediaTransform: currentStepObj.secondaryMediaTransform ? { ...currentStepObj.secondaryMediaTransform } : s.secondaryMediaTransform,
          overlayImageTransform: currentStepObj.overlayImageTransform ? { ...currentStepObj.overlayImageTransform } : s.overlayImageTransform,
          overlayTextTransform: currentStepObj.overlayTextTransform ? { ...currentStepObj.overlayTextTransform } : s.overlayTextTransform
        }))
      };
    }));
    toast.success('🔒 ĐÃ KHÓA & ÁP DỤNG BỐ CỤC CHO TOÀN BỘ CÁC BƯỚC!');
  };

  // 🔲 Áp dụng bố cục nhanh cho sân khấu (Solo, Bán hàng, PK)
  const handleApplyPresetLayout = (layoutKey) => {
    const preset = STUDIO_STAGE_PRESETS[layoutKey];
    if (!preset || !preset.transforms) return;
    const currentStepObj = activePreset.steps[currentStepIndex];
    if (!currentStepObj) return;

    const newTransforms = {};
    Object.keys(preset.transforms).forEach(avKey => {
      newTransforms[avKey] = { ...preset.transforms[avKey], zIndex: 10 };
    });

    handleUpdateStep(currentStepObj.id, 'avatarTransforms', newTransforms);
    toast.success(`📐 Đã áp dụng bố cục: ${preset.name || layoutKey}`);
  };

  // Thêm một bước mới vào kịch bản
  const handleAddStep = () => {
    const newStep = {
      id: `step_${Date.now()}`,
      title: `Bước ${activePreset.steps.length + 1}: Phân đoạn mới`,
      actionType: 'avatar_talk',
      avatarSpeaker: 'avatar_1',
      durationSeconds: 60,
      scriptText: 'Xin chào quý vị khán giả và các bạn đang theo dõi phiên livestream...',
      mediaUrl: '',
      secondaryMediaUrl: '',
      overlayImage: '',
      overlayText: '',
      overlayTextStyle: 'fire_sale',
      overlayTextFontSize: 20,
      overlayTextFontFamily: 'be_vietnam',
      isMediaPinned: false,
      isOverlayImagePinned: false,
      isOverlayTextPinned: false,
      isSecondaryMediaPinned: false
    };

    setPresets(prev => prev.map(p => {
      if (p.id !== activePresetId) return p;
      return {
        ...p,
        steps: [...p.steps, newStep]
      };
    }));
    toast.success(`➕ Đã thêm Bước ${activePreset.steps.length + 1}`);
  };

  // Xóa bước
  const handleDeleteStep = (stepId) => {
    if (activePreset.steps.length <= 1) {
      toast.error('Kịch bản phải có tối thiểu 1 bước!');
      return;
    }
    setPresets(prev => prev.map(p => {
      if (p.id !== activePresetId) return p;
      return {
        ...p,
        steps: p.steps.filter(s => s.id !== stepId)
      };
    }));
    toast.info('🗑️ Đã xóa bước');
  };

  // Nhân bản bước
  const handleDuplicateStep = (step) => {
    const cloned = {
      ...step,
      id: `step_${Date.now()}`,
      title: `${step.title} (Bản sao)`
    };
    setPresets(prev => prev.map(p => {
      if (p.id !== activePresetId) return p;
      const idx = p.steps.findIndex(s => s.id === step.id);
      const newSteps = [...p.steps];
      newSteps.splice(idx + 1, 0, cloned);
      return { ...p, steps: newSteps };
    }));
    toast.success('📋 Đã nhân bản bước!');
  };

  // 📂 TẢI MEDIA TRỰC TIẾP TỪ MÁY TÍNH (VIDEO / ẢNH) -> NẠP NGAY LÊN SÂN KHẤU 9:16
  const handleDirectMediaUpload = (stepId, targetField, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const objectUrl = URL.createObjectURL(file);
      handleUpdateStep(stepId, targetField, objectUrl);
      toast.success(`🎬 Đã nạp "${file.name}" lên Sân Khấu 9:16!`);
    } catch (err) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        handleUpdateStep(stepId, targetField, uploadEvent.target?.result);
        toast.success(`🎬 Đã nạp "${file.name}" lên Sân Khấu 9:16!`);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  // 📄 Nạp file kịch bản đa định dạng (.md, .txt, .docx, .pdf, .json, .xlsx)
  const handleFileUpload = async (stepId, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await readUniversalFile(file);
      if (result && result.text) {
        handleUpdateStep(stepId, 'scriptText', result.text);
        toast.success(`📄 Đã nạp kịch bản từ ${file.name}!`);
      } else {
        toast.error('Không thể đọc nội dung file văn bản!');
      }
    } catch (err) {
      toast.error(`Lỗi đọc file: ${err.message}`);
    }
    e.target.value = '';
  };

  // Chuyển bước nhanh
  const handlePrevStep = () => {
    const prev = currentStepIndex > 0 ? currentStepIndex - 1 : activePreset.steps.length - 1;
    startStep(prev, isPlayingFlow);
  };

  const handleNextStep = () => {
    const next = currentStepIndex < activePreset.steps.length - 1 ? currentStepIndex + 1 : 0;
    startStep(next, isPlayingFlow);
  };

  const currentStep = activePreset.steps[currentStepIndex] || activePreset.steps[0];
  const safeAvatars = multiAvatarConfig?.avatars || [];
  const activeAvatarCount = multiAvatarConfig?.activeCount || 1;
  const visibleAvatars = safeAvatars.slice(0, activeAvatarCount);

  // Tính toán Media hiển thị trên sân khấu (kèm logic ghim nếu bước hiện tại không nạp)
  const activeMediaUrl = currentStep?.mediaUrl || (() => {
    const pinnedStep = activePreset?.steps?.slice(0, currentStepIndex + 1).reverse().find(s => s.isMediaPinned && s.mediaUrl);
    return pinnedStep?.mediaUrl || multiAvatarConfig?.backgroundUrl || '/idols/phong_studio_ngoc_trinh_4k.mp4';
  })();

  const activeSecondaryMediaUrl = currentStep?.secondaryMediaUrl || (() => {
    const pinnedStep = activePreset?.steps?.slice(0, currentStepIndex + 1).reverse().find(s => s.isSecondaryMediaPinned && s.secondaryMediaUrl);
    return pinnedStep?.secondaryMediaUrl || null;
  })();

  const activeOverlayImage = currentStep?.overlayImage || (() => {
    const pinnedStep = activePreset?.steps?.slice(0, currentStepIndex + 1).reverse().find(s => s.isOverlayImagePinned && s.overlayImage);
    return pinnedStep?.overlayImage || null;
  })();

  const activeOverlayText = currentStep?.overlayText || (() => {
    const pinnedStep = activePreset?.steps?.slice(0, currentStepIndex + 1).reverse().find(s => s.isOverlayTextPinned && s.overlayText);
    return pinnedStep?.overlayText || null;
  })();

  // =========================================================================
  // 🖐️ BỘ XỬ LÝ KÉO THẢ & CO GIÃN 8 ĐIỂM TRỰC TIẾP TRÊN SÂN KHẤU 9:16
  // =========================================================================
  const getLayerCurrentTransform = useCallback((layerType, avatarId = null) => {
    if (!currentStep) return { x: 10, y: 15, width: 45, height: 75, zIndex: 10 };
    
    if (layerType === 'avatar' && avatarId) {
      if (currentStep.avatarTransforms && currentStep.avatarTransforms[avatarId]) {
        return currentStep.avatarTransforms[avatarId];
      }
      const avObj = safeAvatars.find(a => a.id === avatarId);
      if (avObj && avObj.transform) return avObj.transform;
      const avIdx = safeAvatars.findIndex(a => a.id === avatarId);
      const safeIdx = avIdx >= 0 ? avIdx : 0;
      return { x: 5 + safeIdx * 24, y: 15, width: 45, height: 75, zIndex: 10 + safeIdx };
    }

    if (layerType === 'pip') {
      return currentStep.secondaryMediaTransform || { x: 55, y: 8, width: 40, height: 25, zIndex: 20 };
    }

    if (layerType === 'banner') {
      return currentStep.overlayImageTransform || { x: 10, y: 12, width: 80, height: 20, zIndex: 25 };
    }

    if (layerType === 'text') {
      return currentStep.overlayTextTransform || { x: 5, y: 5, width: 90, height: 12, zIndex: 30 };
    }

    return { x: 10, y: 10, width: 80, height: 20, zIndex: 10 };
  }, [currentStep, safeAvatars]);

  const handlePointerDown = (e, layerType, avatarId = null, handle = null) => {
    e.stopPropagation();
    e.preventDefault();

    setSelectedLayer({ type: layerType, id: avatarId });
    const initialTransform = getLayerCurrentTransform(layerType, avatarId);

    setDragState({
      handle,
      startX: e.clientX || e.touches?.[0]?.clientX || 0,
      startY: e.clientY || e.touches?.[0]?.clientY || 0,
      initialTransform: { ...initialTransform },
      layerType,
      avatarId
    });
  };

  useEffect(() => {
    if (!dragState) return;

    const handlePointerMove = (e) => {
      if (!stageInnerRef.current) return;
      const stageRect = stageInnerRef.current.getBoundingClientRect();
      const curX = e.clientX || e.touches?.[0]?.clientX || 0;
      const curY = e.clientY || e.touches?.[0]?.clientY || 0;

      const deltaXPercent = ((curX - dragState.startX) / stageRect.width) * 100;
      const deltaYPercent = ((curY - dragState.startY) / stageRect.height) * 100;

      const { initialTransform, handle, layerType, avatarId } = dragState;
      let newTransform = { ...initialTransform };

      if (!handle) {
        newTransform.x = Math.round(Math.max(-50, Math.min(100, initialTransform.x + deltaXPercent)));
        newTransform.y = Math.round(Math.max(-50, Math.min(100, initialTransform.y + deltaYPercent)));
      } else {
        if (handle.includes('e')) {
          newTransform.width = Math.round(Math.max(10, Math.min(100, initialTransform.width + deltaXPercent)));
        }
        if (handle.includes('s')) {
          newTransform.height = Math.round(Math.max(5, Math.min(100, initialTransform.height + deltaYPercent)));
        }
        if (handle.includes('w')) {
          const clampedDelta = Math.min(initialTransform.width - 10, deltaXPercent);
          newTransform.x = Math.round(initialTransform.x + clampedDelta);
          newTransform.width = Math.round(initialTransform.width - clampedDelta);
        }
        if (handle.includes('n')) {
          const clampedDelta = Math.min(initialTransform.height - 5, deltaYPercent);
          newTransform.y = Math.round(initialTransform.y + clampedDelta);
          newTransform.height = Math.round(initialTransform.height - clampedDelta);
        }
      }

      if (currentStep) {
        handleUpdateStepTransform(currentStep.id, layerType, newTransform, avatarId);
      }
    };

    const handlePointerUp = () => {
      setDragState(null);
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchmove', handlePointerMove, { passive: false });
    window.addEventListener('touchend', handlePointerUp);

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [dragState, currentStep]);

  // Căn giữa nhanh đối tượng đang chọn
  const handleCenterSelectedLayer = () => {
    if (!currentStep || !selectedLayer) return;
    const curTrans = getLayerCurrentTransform(selectedLayer.type, selectedLayer.id);
    const w = curTrans.width || 50;
    const updated = {
      ...curTrans,
      x: Math.max(0, Math.round((100 - w) / 2))
    };
    handleUpdateStepTransform(currentStep.id, selectedLayer.type, updated, selectedLayer.id);
    toast.success('📐 Đã căn giữa đối tượng!');
  };

  // Tràn toàn bộ khung đối tượng đang chọn
  const handleFillSelectedLayer = () => {
    if (!currentStep || !selectedLayer) return;
    const updated = {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      zIndex: 10
    };
    handleUpdateStepTransform(currentStep.id, selectedLayer.type, updated, selectedLayer.id);
    toast.success('📏 Đã mở rộng tràn khung!');
  };

  // Đọc thử giọng AI 0ms
  const handleTestVoiceSpeech = (text) => {
    if (!text || !text.trim()) {
      toast.error('Chưa có lời thoại để đọc thử!');
      return;
    }
    if (isSpeakingPreview) {
      stopVoiceAudio();
      setIsSpeakingPreview(false);
      return;
    }
    setIsSpeakingPreview(true);
    previewVoiceAudio('vi-VN-Standard-A', text);
    setTimeout(() => {
      setIsSpeakingPreview(false);
    }, 8000);
  };

  return (
    <div className="w-full h-full min-h-0 flex flex-col bg-[#080a10] text-gray-100 overflow-hidden select-none font-sans">
      <SvgChromaFilters />

      {/* ========================================================================= */}
      {/* 🚀 TOP TOOLBAR: THANH ĐIỀU KHIỂN ĐỈNH CAO TINH GỌN (CAO 44PX) */}
      {/* ========================================================================= */}
      <div className="bg-[#101322] border-b border-indigo-900/50 px-3 py-1.5 flex items-center justify-between gap-2.5 shrink-0 z-20 shadow-md">
        
        {/* Nhóm Trái: Logo & Tiêu đề & Chọn Preset */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gradient-to-r from-rose-500/20 via-indigo-500/20 to-cyan-500/20 border border-indigo-500/30">
            <Layers className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="font-black text-xs text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-indigo-200 to-rose-300 tracking-wide hidden sm:inline">
              STUDIO 1–4 NHÂN VẬT & PHÂN ĐOẠN LIVE
            </span>
          </div>

          <div className="flex items-center gap-1">
            <select
              value={activePresetId}
              onChange={(e) => {
                setActivePresetId(e.target.value);
                setCurrentStepIndex(0);
                const target = presets.find(p => p.id === e.target.value);
                if (target?.steps?.[0]) setSecondsRemaining(target.steps[0].durationSeconds || 60);
              }}
              className="bg-slate-800 text-white text-xs font-bold px-2.5 py-1 rounded-lg border border-slate-700 outline-none focus:border-indigo-500 max-w-[190px] sm:max-w-[260px] truncate cursor-pointer"
            >
              {presets.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>

            <button
              onClick={() => setShowPresetModal(true)}
              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-gray-300 border border-slate-700 text-xs font-bold cursor-pointer"
              title="Tạo bộ kịch bản mới"
            >
              <Plus size={13} />
            </button>
          </div>
        </div>

        {/* Nhóm Phải: Đồng Bộ Sân Khấu Chính, Chạy Test & Điều Hướng Bước */}
        <div className="flex items-center gap-2 shrink-0">
          
          <button
            onClick={handleToggleMasterSync}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-md cursor-pointer ${
              isMasterSynced 
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white ring-2 ring-emerald-400 animate-pulse' 
                : 'bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-700/60'
            }`}
            title={isMasterSynced ? 'Đang phát trực tiếp ra Sân Khấu Chính / OBS / TikTok Live' : 'Bấm để phát dữ liệu ra Sân Khấu Chính / OBS / TikTok Live'}
          >
            <Monitor size={13} />
            <span className="hidden md:inline">
              {isMasterSynced ? '🟢 ĐANG PHÁT RA SÂN KHẤU CHÍNH' : '📡 ĐỒNG BỘ RA SÂN KHẤU CHÍNH'}
            </span>
          </button>

          <button
            onClick={() => {
              if (isPlayingFlow) {
                handleStopFlow();
              } else {
                handleStartFlow();
              }
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-md cursor-pointer ${
              isPlayingFlow 
                ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse' 
                : 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white'
            }`}
          >
            {isPlayingFlow ? <Square size={13} className="fill-white" /> : <Play size={13} className="fill-white" />}
            <span>{isPlayingFlow ? 'DỪNG' : 'CHẠY TEST'}</span>
          </button>

          <div className="hidden sm:flex items-center gap-1 bg-slate-800/90 px-1.5 py-0.5 rounded-lg border border-slate-700">
            <button onClick={handlePrevStep} className="p-1 hover:text-cyan-400 cursor-pointer" title="Bước trước">
              <SkipBack size={12} />
            </button>
            <span className="text-[11px] font-mono font-bold text-cyan-300 px-1">
              {currentStepIndex + 1}/{activePreset.steps.length}
            </span>
            <button onClick={handleNextStep} className="p-1 hover:text-cyan-400 cursor-pointer" title="Bước sau">
              <SkipForward size={12} />
            </button>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 🌟 BODY CHÍNH 2 CỘT: CỘT TRÁI 40% SÂN KHẤU 9:16 + CỘT PHẢI 60% BẢNG ĐIỀU KHIỂN */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col lg:flex-row p-2 gap-2 overflow-hidden min-h-0">
        
        {/* ========================================================================= */}
        {/* 📱 CỘT TRÁI (LEFT PANEL - 40%): SÂN KHẤU LIVE 9:16 SẠCH 100% & XÓA TRỰC TIẾP */}
        {/* ========================================================================= */}
        <div className="w-full lg:w-[42%] xl:w-[40%] flex flex-col h-full bg-[#0d101e] rounded-2xl border border-indigo-900/40 p-2 shadow-2xl shrink-0 overflow-hidden min-h-0">
          
          {/* Header Sân Khấu Preview */}
          <div className="flex items-center justify-between pb-1.5 mb-1 border-b border-indigo-900/40 shrink-0">
            <div className="flex items-center gap-1.5">
              <Smartphone size={14} className="text-cyan-400" />
              <span className="text-xs font-black text-white tracking-wide">
                SÂN KHẤU LIVE 9:16 ĐIỆN THOẠI
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-black bg-indigo-950 text-amber-300 border border-indigo-500/40">
                Bước {currentStepIndex + 1}/{activePreset.steps.length}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                {Math.floor(secondsRemaining / 60)}:{(secondsRemaining % 60).toString().padStart(2, '0')}s
              </span>
            </div>
          </div>

          {/* KHUNG SÂN KHẤU CHUẨN 9:16 DỌC ĐIỆN THOẠI (FULL HEIGHT) */}
          <div className="flex-1 w-full h-full min-h-0 flex items-center justify-center relative overflow-hidden py-0.5">
            <div 
              ref={stageInnerRef}
              className="relative h-full max-h-full aspect-[9/16] bg-black rounded-[28px] border-[3.5px] border-slate-700/80 ring-2 ring-cyan-500/40 shadow-2xl overflow-hidden flex flex-col mx-auto select-none"
              style={{ maxHeight: '100%' }}
            >
              {/* Dynamic Island / Notch Mockup Top */}
              <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-20 h-3.5 bg-black/95 rounded-full border border-white/10 z-50 flex items-center justify-between px-2 pointer-events-none">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              </div>

              {/* Lớp 1: Video / Ảnh Nền Chính */}
              {activeMediaUrl && isImageMedia(activeMediaUrl) ? (
                <img 
                  key={activeMediaUrl}
                  src={activeMediaUrl} 
                  alt="Stage BG"
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
                />
              ) : (
                <video 
                  key={activeMediaUrl || 'default_bg'}
                  src={activeMediaUrl || '/idols/phong_studio_ngoc_trinh_4k.mp4'} 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
                />
              )}

              {/* Lớp 1.5: Video Phụ PiP (Picture-in-Picture) - Có Nút Xóa Trực Tiếp */}
              {activeSecondaryMediaUrl && (() => {
                const pipTrans = getLayerCurrentTransform('pip');
                const isSelected = selectedLayer.type === 'pip';

                return (
                  <div 
                    onMouseDown={(e) => handlePointerDown(e, 'pip', null, null)}
                    onTouchStart={(e) => handlePointerDown(e, 'pip', null, null)}
                    className={`absolute overflow-hidden rounded-xl shadow-2xl transition-shadow cursor-move ${
                      isSelected ? 'ring-2 ring-indigo-400 border-2 border-indigo-400' : 'border border-indigo-500/50'
                    }`}
                    style={{
                      left: `${pipTrans.x}%`,
                      top: `${pipTrans.y}%`,
                      width: `${pipTrans.width}%`,
                      height: `${pipTrans.height}%`,
                      zIndex: pipTrans.zIndex || 20
                    }}
                  >
                    <div className="relative w-full h-full bg-black">
                      <video 
                        src={activeSecondaryMediaUrl} 
                        autoPlay 
                        loop 
                        muted 
                        playsInline 
                        className="w-full h-full object-cover pointer-events-none"
                      />
                      <span className="absolute top-1 left-1 bg-indigo-600/90 text-white text-[8px] font-black px-1.5 py-0.2 rounded">
                        🎬 PiP
                      </span>
                    </div>

                    {/* Nút Xóa Trực Tiếp Trên Sân Khấu Khi Chọn */}
                    {isSelected && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteLayerFromStep(currentStep.id, 'pip');
                        }}
                        className="absolute top-1 right-1 p-1 bg-rose-600 hover:bg-rose-500 text-white rounded-full shadow-lg z-50 cursor-pointer"
                        title="Xóa Video PiP"
                      >
                        <Trash2 size={10} />
                      </button>
                    )}

                    {/* 8 Điểm Resize Handles Khi Được Chọn */}
                    {isSelected && (
                      <>
                        <div onMouseDown={(e) => handlePointerDown(e, 'pip', null, 'nw')} onTouchStart={(e) => handlePointerDown(e, 'pip', null, 'nw')} className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-indigo-400 rounded-full cursor-nw-resize z-50 shadow-md border border-white" />
                        <div onMouseDown={(e) => handlePointerDown(e, 'pip', null, 'ne')} onTouchStart={(e) => handlePointerDown(e, 'pip', null, 'ne')} className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-indigo-400 rounded-full cursor-ne-resize z-50 shadow-md border border-white" />
                        <div onMouseDown={(e) => handlePointerDown(e, 'pip', null, 'sw')} onTouchStart={(e) => handlePointerDown(e, 'pip', null, 'sw')} className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-indigo-400 rounded-full cursor-sw-resize z-50 shadow-md border border-white" />
                        <div onMouseDown={(e) => handlePointerDown(e, 'pip', null, 'se')} onTouchStart={(e) => handlePointerDown(e, 'pip', null, 'se')} className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-indigo-400 rounded-full cursor-se-resize z-50 shadow-md border border-white" />
                        <div onMouseDown={(e) => handlePointerDown(e, 'pip', null, 'n')} onTouchStart={(e) => handlePointerDown(e, 'pip', null, 'n')} className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-indigo-400 rounded-full cursor-n-resize z-50 shadow-md border border-white" />
                        <div onMouseDown={(e) => handlePointerDown(e, 'pip', null, 's')} onTouchStart={(e) => handlePointerDown(e, 'pip', null, 's')} className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-indigo-400 rounded-full cursor-s-resize z-50 shadow-md border border-white" />
                        <div onMouseDown={(e) => handlePointerDown(e, 'pip', null, 'w')} onTouchStart={(e) => handlePointerDown(e, 'pip', null, 'w')} className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 bg-indigo-400 rounded-full cursor-w-resize z-50 shadow-md border border-white" />
                        <div onMouseDown={(e) => handlePointerDown(e, 'pip', null, 'e')} onTouchStart={(e) => handlePointerDown(e, 'pip', null, 'e')} className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-indigo-400 rounded-full cursor-e-resize z-50 shadow-md border border-white" />
                      </>
                    )}
                  </div>
                );
              })()}

              {/* Lớp 2: 1 Đến 4 Avatar AI (Interactive Drag & 8-Point Resize Handles) */}
              {visibleAvatars.map((av, avIdx) => {
                const isCurrentSpeaker = (currentStep?.avatarSpeaker === av.id) || (currentStep?.avatarSpeaker === 'all') || (!currentStep?.avatarSpeaker && avIdx === 0);
                const transform = getLayerCurrentTransform('avatar', av.id);
                const vidSrc = isCurrentSpeaker ? (av.talkVideo || av.idleVideo || activeMediaUrl) : (av.idleVideo || av.talkVideo || activeMediaUrl);
                const chromaStyle = av.chromaKey?.enabled ? getChromaStyle(av.chromaKey) : {};
                const isSelected = selectedLayer.type === 'avatar' && selectedLayer.id === av.id;

                return (
                  <div 
                    key={av.id}
                    onMouseDown={(e) => handlePointerDown(e, 'avatar', av.id, null)}
                    onTouchStart={(e) => handlePointerDown(e, 'avatar', av.id, null)}
                    className={`absolute transition-shadow cursor-move ${
                      isSelected 
                        ? 'ring-2 ring-cyan-400 shadow-xl shadow-cyan-500/30' 
                        : isCurrentSpeaker
                        ? 'ring-1.5 ring-emerald-400/80 shadow-md'
                        : 'hover:ring-1 hover:ring-white/40'
                    }`}
                    style={{
                      left: `${transform.x}%`,
                      top: `${transform.y}%`,
                      width: `${transform.width}%`,
                      height: `${transform.height}%`,
                      zIndex: transform.zIndex || (10 + avIdx),
                      borderRadius: '16px',
                      overflow: 'visible'
                    }}
                  >
                    <div className="relative w-full h-full rounded-[16px] overflow-hidden">
                      {vidSrc && isImageMedia(vidSrc) ? (
                        <img 
                          src={vidSrc} 
                          alt={av.name} 
                          className="w-full h-full object-cover pointer-events-none"
                          style={chromaStyle}
                        />
                      ) : (
                        <video 
                          src={vidSrc || '/idols/phong_studio_ngoc_trinh_4k.mp4'} 
                          autoPlay 
                          loop 
                          muted 
                          playsInline 
                          className="w-full h-full object-cover pointer-events-none"
                          style={chromaStyle}
                        />
                      )}

                      {/* Badge Tên & Loa Nói Của Avatar */}
                      <div className="absolute top-1 left-1 bg-black/85 backdrop-blur-xs text-white text-[8px] font-black px-1.5 py-0.5 rounded flex items-center gap-1 border border-white/20 pointer-events-none">
                        <span className={`w-1.5 h-1.5 rounded-full ${isCurrentSpeaker ? 'bg-cyan-400 animate-ping' : 'bg-gray-400'}`} />
                        <span>#{avIdx + 1} {av.name}</span>
                        {isCurrentSpeaker && <Volume2 size={9} className="text-cyan-300 animate-bounce" />}
                      </div>
                    </div>

                    {/* 8 Điểm Resize Handles Khi Được Chọn */}
                    {isSelected && (
                      <>
                        <div onMouseDown={(e) => handlePointerDown(e, 'avatar', av.id, 'nw')} onTouchStart={(e) => handlePointerDown(e, 'avatar', av.id, 'nw')} className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-cyan-400 rounded-full cursor-nw-resize z-50 shadow-md border-2 border-white" />
                        <div onMouseDown={(e) => handlePointerDown(e, 'avatar', av.id, 'ne')} onTouchStart={(e) => handlePointerDown(e, 'avatar', av.id, 'ne')} className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-cyan-400 rounded-full cursor-ne-resize z-50 shadow-md border-2 border-white" />
                        <div onMouseDown={(e) => handlePointerDown(e, 'avatar', av.id, 'sw')} onTouchStart={(e) => handlePointerDown(e, 'avatar', av.id, 'sw')} className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 bg-cyan-400 rounded-full cursor-sw-resize z-50 shadow-md border-2 border-white" />
                        <div onMouseDown={(e) => handlePointerDown(e, 'avatar', av.id, 'se')} onTouchStart={(e) => handlePointerDown(e, 'avatar', av.id, 'se')} className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-cyan-400 rounded-full cursor-se-resize z-50 shadow-md border-2 border-white" />
                        <div onMouseDown={(e) => handlePointerDown(e, 'avatar', av.id, 'n')} onTouchStart={(e) => handlePointerDown(e, 'avatar', av.id, 'n')} className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-cyan-400 rounded-full cursor-n-resize z-50 shadow-md border-2 border-white" />
                        <div onMouseDown={(e) => handlePointerDown(e, 'avatar', av.id, 's')} onTouchStart={(e) => handlePointerDown(e, 'avatar', av.id, 's')} className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-cyan-400 rounded-full cursor-s-resize z-50 shadow-md border-2 border-white" />
                        <div onMouseDown={(e) => handlePointerDown(e, 'avatar', av.id, 'w')} onTouchStart={(e) => handlePointerDown(e, 'avatar', av.id, 'w')} className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3.5 h-3.5 bg-cyan-400 rounded-full cursor-w-resize z-50 shadow-md border-2 border-white" />
                        <div onMouseDown={(e) => handlePointerDown(e, 'avatar', av.id, 'e')} onTouchStart={(e) => handlePointerDown(e, 'avatar', av.id, 'e')} className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3.5 h-3.5 bg-cyan-400 rounded-full cursor-e-resize z-50 shadow-md border-2 border-white" />
                      </>
                    )}
                  </div>
                );
              })}

              {/* Lớp 3: Banner Hình Ảnh / Poster Deal - Có Nút Xóa Trực Tiếp */}
              {activeOverlayImage && (() => {
                const bannerTrans = getLayerCurrentTransform('banner');
                const isSelected = selectedLayer.type === 'banner';

                return (
                  <div 
                    onMouseDown={(e) => handlePointerDown(e, 'banner', null, null)}
                    onTouchStart={(e) => handlePointerDown(e, 'banner', null, null)}
                    className={`absolute transition-shadow cursor-move ${
                      isSelected ? 'ring-2 ring-amber-400 rounded-xl' : ''
                    }`}
                    style={{
                      left: `${bannerTrans.x}%`,
                      top: `${bannerTrans.y}%`,
                      width: `${bannerTrans.width}%`,
                      height: `${bannerTrans.height}%`,
                      zIndex: bannerTrans.zIndex || 25
                    }}
                  >
                    <img 
                      src={activeOverlayImage} 
                      alt="Overlay Banner" 
                      className="w-full h-full object-contain drop-shadow-xl pointer-events-none rounded-lg"
                    />

                    {/* Nút Xóa Trực Tiếp Trên Sân Khấu Khi Chọn */}
                    {isSelected && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteLayerFromStep(currentStep.id, 'banner');
                        }}
                        className="absolute -top-2 -right-2 p-1 bg-rose-600 hover:bg-rose-500 text-white rounded-full shadow-lg z-50 cursor-pointer"
                        title="Xóa Ảnh Banner"
                      >
                        <Trash2 size={10} />
                      </button>
                    )}

                    {/* 8 Điểm Resize Handles Khi Được Chọn */}
                    {isSelected && (
                      <>
                        <div onMouseDown={(e) => handlePointerDown(e, 'banner', null, 'nw')} onTouchStart={(e) => handlePointerDown(e, 'banner', null, 'nw')} className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-amber-400 rounded-full cursor-nw-resize z-50 shadow-md border border-white" />
                        <div onMouseDown={(e) => handlePointerDown(e, 'banner', null, 'ne')} onTouchStart={(e) => handlePointerDown(e, 'banner', null, 'ne')} className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-amber-400 rounded-full cursor-ne-resize z-50 shadow-md border border-white" />
                        <div onMouseDown={(e) => handlePointerDown(e, 'banner', null, 'sw')} onTouchStart={(e) => handlePointerDown(e, 'banner', null, 'sw')} className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-amber-400 rounded-full cursor-sw-resize z-50 shadow-md border border-white" />
                        <div onMouseDown={(e) => handlePointerDown(e, 'banner', null, 'se')} onTouchStart={(e) => handlePointerDown(e, 'banner', null, 'se')} className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-amber-400 rounded-full cursor-se-resize z-50 shadow-md border border-white" />
                      </>
                    )}
                  </div>
                );
              })()}

              {/* Lớp 4: Tiêu Đề Chữ Typography Xếp Chồng - Có Nút Xóa Trực Tiếp */}
              {activeOverlayText && (() => {
                const textTrans = getLayerCurrentTransform('text');
                const isSelected = selectedLayer.type === 'text';
                const styleConfig = TEXT_STYLE_PRESETS.find(s => s.id === currentStep?.overlayTextStyle) || TEXT_STYLE_PRESETS[0];
                const fontConfig = FONT_FAMILIES.find(f => f.id === currentStep?.overlayTextFontFamily) || FONT_FAMILIES[0];

                return (
                  <div 
                    onMouseDown={(e) => handlePointerDown(e, 'text', null, null)}
                    onTouchStart={(e) => handlePointerDown(e, 'text', null, null)}
                    className={`absolute text-center cursor-move transition-shadow ${
                      isSelected ? 'ring-2 ring-rose-400 rounded-xl' : ''
                    }`}
                    style={{
                      left: `${textTrans.x}%`,
                      top: `${textTrans.y}%`,
                      width: `${textTrans.width}%`,
                      zIndex: textTrans.zIndex || 30
                    }}
                  >
                    <div className={`inline-block w-full px-2.5 py-1 rounded-xl font-black shadow-2xl tracking-wide ${styleConfig.className}`}
                      style={{
                        fontSize: `${Math.max(10, Math.min(22, (currentStep.overlayTextFontSize || 20) * 0.65))}px`,
                        fontFamily: fontConfig.font
                      }}
                    >
                      {activeOverlayText}
                    </div>

                    {/* Nút Xóa Trực Tiếp Trên Sân Khấu Khi Chọn */}
                    {isSelected && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteLayerFromStep(currentStep.id, 'text');
                        }}
                        className="absolute -top-2 -right-2 p-1 bg-rose-600 hover:bg-rose-500 text-white rounded-full shadow-lg z-50 cursor-pointer"
                        title="Xóa Chữ Tiêu Đề"
                      >
                        <Trash2 size={10} />
                      </button>
                    )}

                    {/* Resize Handles khi chọn Text */}
                    {isSelected && (
                      <>
                        <div onMouseDown={(e) => handlePointerDown(e, 'text', null, 'w')} onTouchStart={(e) => handlePointerDown(e, 'text', null, 'w')} className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 bg-rose-400 rounded-full cursor-w-resize z-50 shadow-md border border-white" />
                        <div onMouseDown={(e) => handlePointerDown(e, 'text', null, 'e')} onTouchStart={(e) => handlePointerDown(e, 'text', null, 'e')} className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-rose-400 rounded-full cursor-e-resize z-50 shadow-md border border-white" />
                      </>
                    )}
                  </div>
                );
              })()}

              {/* Tag Trạng Thái Live Preview */}
              <div className="absolute top-5 left-2 z-40 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-[9px] font-bold text-white border border-white/20 flex items-center gap-1 pointer-events-none">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live 9:16</span>
              </div>

              {/* Bottom Home Indicator Bar */}
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-20 h-1 bg-white/30 rounded-full z-50 pointer-events-none" />
            </div>
          </div>

          {/* 🌟 THANH THAO TÁC CĂN CHỈNH VỊ TRÍ NHANH: GỌN GÀNG ĐÚNG 1 HÀNG DUY NHẤT */}
          <div className="pt-1 mt-1 border-t border-indigo-900/40 shrink-0">
            <div className="flex items-center justify-between gap-1 overflow-x-auto py-0.5">
              
              {/* Các nút bấm căn chỉnh 1 hàng */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => handleApplyPresetLayout('sales_duo')}
                  className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-black text-[10px] border border-slate-700 cursor-pointer flex items-center gap-0.5"
                  title="Bố cục 2 người bán hàng"
                >
                  🛍️ Bán Hàng
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPresetLayout('game_pk')}
                  className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 font-black text-[10px] border border-slate-700 cursor-pointer flex items-center gap-0.5"
                  title="Bố cục PK"
                >
                  ⚔️ PK Đấu
                </button>
                <button
                  type="button"
                  onClick={handleCenterSelectedLayer}
                  className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 font-black text-[10px] border border-slate-700 cursor-pointer flex items-center gap-0.5"
                  title="Căn giữa đối tượng đang chọn"
                >
                  <Scaling size={11} /> Giữa
                </button>
                <button
                  type="button"
                  onClick={handleFillSelectedLayer}
                  className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-300 font-black text-[10px] border border-slate-700 cursor-pointer flex items-center gap-0.5"
                  title="Tràn toàn khung hình"
                >
                  <Maximize2 size={11} /> Tràn
                </button>
                <button
                  type="button"
                  onClick={handleApplyLayoutToAllSteps}
                  className="px-2.5 py-1 rounded-lg bg-indigo-900 hover:bg-indigo-800 text-amber-300 font-black text-[10px] border border-amber-400/50 cursor-pointer flex items-center gap-1 shadow-sm"
                  title="Khóa và áp dụng vị trí hiện tại cho toàn bộ các bước"
                >
                  <Lock size={11} /> Khóa Tất Cả
                </button>
              </div>

              {/* Thông tin Avatar đang nói */}
              <div className="text-[10px] font-black text-indigo-300 truncate shrink-0 bg-slate-900/90 px-2 py-1 rounded-lg border border-slate-800">
                🗣️ Nói: {currentStep?.avatarSpeaker?.toUpperCase() || 'AVATAR_1'}
              </div>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 📋 CỘT PHẢI (RIGHT PANEL - 60%): BẢNG ĐIỀU KHIỂN & KỊCH BẢN TỪNG BƯỚC */}
        {/* ========================================================================= */}
        <div className="flex-1 flex flex-col h-full bg-[#0d101e] rounded-2xl border border-indigo-900/40 overflow-hidden shadow-xl min-w-0">
          
          {/* ===================================================================== */}
          {/* 🌟 THANH CẤU HÌNH ĐỈNH CỘT PHẢI: CHỌN SỐ LƯỢNG NHÂN VẬT & THÊM BƯỚC */}
          {/* ===================================================================== */}
          <div className="bg-[#13172c] border-b border-indigo-900/50 p-2 shrink-0">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              
              {/* Bộ Chọn Số Lượng Nhân Vật (1 Đến 4 Avatar) */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-white flex items-center gap-1">
                  <Users size={13} className="text-cyan-400" />
                  <span>Số Lượng Nhân Vật:</span>
                </span>
                
                <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-xl border border-slate-800">
                  {[1, 2, 3, 4].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleChangeAvatarCount(num)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                        activeAvatarCount === num 
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm ring-1 ring-white/20' 
                          : 'text-gray-400 hover:text-gray-200 hover:bg-slate-800'
                      }`}
                    >
                      {num === 1 ? '👤 1 Người' : num === 2 ? '👥 2 Người' : num === 3 ? '🎮 3 Người' : '🎙️ 4 Người'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Nút Thêm Bước Mới */}
              <button
                type="button"
                onClick={handleAddStep}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1 cursor-pointer"
              >
                <Plus size={13} />
                <span>+ Thêm Bước Mới</span>
              </button>

            </div>
          </div>

          {/* ===================================================================== */}
          {/* 📋 DANH SÁCH CÁC BƯỚC KỊCH BẢN (STEPS LIST) */}
          {/* ===================================================================== */}
          <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5">
            {activePreset.steps.map((step, idx) => {
              const actionConfig = ACTION_TYPES.find(a => a.id === step.actionType) || ACTION_TYPES[0];
              const ActionIcon = actionConfig.icon;
              const isCurrentExecuting = isPlayingFlow && currentStepIndex === idx;
              const isSelected = currentStepIndex === idx;
              const isExpanded = expandedStepId === step.id;

              return (
                <div 
                  key={step.id}
                  onClick={() => {
                    if (currentStepIndex !== idx) {
                      setCurrentStepIndex(idx);
                      setSecondsRemaining(step.durationSeconds || 60);
                      syncStepToServer(step, idx, isPlayingFlow);
                    }
                  }}
                  className={`rounded-2xl border transition-all overflow-hidden cursor-pointer ${
                    isCurrentExecuting 
                      ? 'bg-blue-950/40 border-blue-500 shadow-lg ring-2 ring-blue-400/40' 
                      : isSelected
                      ? 'bg-slate-800/90 border-cyan-500 shadow-md ring-1 ring-cyan-400/40'
                      : 'bg-slate-800/40 border-slate-700/70 hover:border-slate-600 shadow-xs'
                  }`}
                >
                  {/* HEADER CỦA BƯỚC */}
                  <div className="p-2 bg-slate-800/90 border-b border-slate-700/80 flex flex-wrap items-center justify-between gap-2">
                    
                    {/* Cột Trái: Số bước, Tên bước & Phân loại */}
                    <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                      <div className={`w-6 h-6 rounded-lg font-black text-xs flex items-center justify-center shrink-0 ${
                        isCurrentExecuting 
                          ? 'bg-cyan-500 text-black animate-bounce' 
                          : 'bg-indigo-600 text-white shadow-xs'
                      }`}>
                        {idx + 1}
                      </div>

                      <input 
                        type="text"
                        value={step.title}
                        onChange={(e) => handleUpdateStep(step.id, 'title', e.target.value)}
                        className="font-black text-xs text-white bg-transparent border-b border-transparent hover:border-slate-500 focus:border-cyan-500 focus:bg-slate-900 px-1 py-0.5 rounded outline-none transition-all flex-1 min-w-[140px]"
                      />

                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${actionConfig.bg} ${actionConfig.color} shrink-0`}>
                        <ActionIcon size={10} />
                        <span>{actionConfig.label.split(' ')[1] || 'Tác vụ'}</span>
                      </span>
                    </div>

                    {/* Cột Phải: Phân Vai Avatar Nói, Thời lượng & Nút Thao Tác */}
                    <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                      
                      <select
                        value={step.avatarSpeaker || 'avatar_1'}
                        onChange={(e) => handleUpdateStep(step.id, 'avatarSpeaker', e.target.value)}
                        className="bg-slate-900 text-cyan-300 text-[11px] font-bold px-2 py-1 rounded-lg border border-cyan-500/40 outline-none cursor-pointer"
                      >
                        <option value="avatar_1">🗣️ Nhân Vật 1</option>
                        <option value="avatar_2">🗣️ Nhân Vật 2</option>
                        <option value="avatar_3">🗣️ Nhân Vật 3</option>
                        <option value="avatar_4">🗣️ Nhân Vật 4</option>
                        <option value="all">👥 Cả Nhóm Cùng Nói</option>
                      </select>

                      <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-700 text-[11px]">
                        <Clock size={11} className="text-amber-400" />
                        <input 
                          type="number"
                          value={step.durationSeconds || 60}
                          onChange={(e) => handleUpdateStep(step.id, 'durationSeconds', parseInt(e.target.value) || 30)}
                          className="w-8 bg-transparent text-white font-mono font-bold text-center outline-none"
                          min="5"
                          max="3600"
                        />
                        <span className="text-gray-400 text-[10px]">s</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setCurrentStepIndex(idx);
                          setSecondsRemaining(step.durationSeconds || 60);
                          syncStepToServer(step, idx, true);
                          toast.success(`👁️ Đang hiển thị Bước ${idx + 1} trên Sân khấu!`);
                        }}
                        className="px-2 py-1 bg-cyan-600 hover:bg-cyan-500 text-black font-black text-[10px] rounded-lg shadow-xs flex items-center gap-1 cursor-pointer"
                        title="Xem trước bước này trên sân khấu"
                      >
                        <Eye size={11} />
                        <span>Xem</span>
                      </button>

                      {/* Mũi tên Mở Rộng / Thu Gọn kèm Badge Tên Tab */}
                      <button
                        type="button"
                        onClick={() => setExpandedStepId(isExpanded ? null : step.id)}
                        className="px-2 py-1 text-xs font-bold text-gray-300 hover:text-white rounded-lg bg-slate-900 border border-slate-700 flex items-center gap-1 cursor-pointer"
                        title="Mở rộng / Thu gọn cấu hình chi tiết của bước này"
                      >
                        <span>Cài Đặt</span>
                        {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDuplicateStep(step)}
                        className="p-1 text-gray-400 hover:text-indigo-300 rounded bg-slate-900 border border-slate-700 cursor-pointer"
                        title="Nhân bản bước này"
                      >
                        <Copy size={12} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteStep(step.id)}
                        className="p-1 text-gray-400 hover:text-rose-400 rounded bg-slate-900 border border-slate-700 cursor-pointer"
                        title="Xóa bước này"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>

                  </div>

                  {/* NỘI DUNG CHÍNH: KHUNG KỊCH BẢN & LỜI THOẠI AI NẰM RIÊNG */}
                  <div className="p-2.5 space-y-2">
                    
                    <div className="bg-slate-950/70 p-2.5 rounded-xl border border-indigo-900/40 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-cyan-300 flex items-center gap-1">
                          <FileText size={11} />
                          <span>Lời Thoại & Kịch Bản AI Bước Này:</span>
                        </span>

                        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => handleTestVoiceSpeech(step.scriptText)}
                            className="px-2 py-0.5 rounded-lg bg-indigo-900/60 hover:bg-indigo-800 text-cyan-300 border border-indigo-700/50 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                            title="Nghe thử giọng đọc AI cho đoạn này"
                          >
                            <Volume2 size={11} />
                            <span>Đọc Thử AI</span>
                          </button>

                          <label className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-[10px] font-bold flex items-center gap-1 cursor-pointer">
                            <Upload size={11} />
                            <span>Nạp File (.md, .txt, .docx, .pdf)</span>
                            <input 
                              type="file" 
                              accept=".md,.txt,.docx,.pdf,.json,.xlsx"
                              onChange={(e) => handleFileUpload(step.id, e)}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>

                      <textarea
                        value={step.scriptText || ''}
                        onChange={(e) => handleUpdateStep(step.id, 'scriptText', e.target.value)}
                        placeholder="Nhập lời thoại của nhân vật / kịch bản AI cho bước này hoặc bấm nút Nạp File (.md, .docx, .txt, .pdf)..."
                        rows={isExpanded ? 3 : 2}
                        className="w-full bg-slate-900 text-gray-100 text-xs p-2 rounded-lg border border-slate-800 focus:border-cyan-500 outline-none resize-y transition-all font-medium leading-relaxed"
                      />
                    </div>

                    {/* CHI TIẾT CẤU HÌNH KHI MỞ RỘNG (EXPANDED) */}
                    {isExpanded && (
                      <div className="pt-2 border-t border-slate-800 space-y-2.5 text-xs" onClick={(e) => e.stopPropagation()}>
                        
                        {/* Tiêu đề Tab Rõ Ràng Khi Mở Rộng */}
                        <div className="px-2.5 py-1 rounded-lg bg-indigo-950/70 border border-indigo-500/30 flex items-center justify-between">
                          <span className="text-[11px] font-black text-cyan-300 flex items-center gap-1.5">
                            <Sliders size={13} />
                            <span>⚙️ CẤU HÌNH LAYER & MEDIA BƯỚC {idx + 1}: {step.title}</span>
                          </span>
                          <span className="text-[10px] text-gray-400">
                            100% Nạp Từ Máy Tính & Có Nút Ghim
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                          
                          {/* Cột 1: Video Nền Chính & Video Phụ PiP */}
                          <div className="space-y-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                            
                            <div>
                              <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">
                                Loại Tác Vụ:
                              </label>
                              <select
                                value={step.actionType}
                                onChange={(e) => handleUpdateStep(step.id, 'actionType', e.target.value)}
                                className="w-full bg-slate-900 text-white text-xs p-1.5 rounded-lg border border-slate-700 outline-none"
                              >
                                {ACTION_TYPES.map(a => (
                                  <option key={a.id} value={a.id}>{a.label}</option>
                                ))}
                              </select>
                            </div>

                            {/* 📂 NẠP VIDEO NỀN CHÍNH (TỪ MÁY TÍNH + NÚT GHIM) */}
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="text-[10px] font-black uppercase text-gray-400">
                                  Video / Ảnh Nền Chính:
                                </label>
                                <label className="flex items-center gap-1 text-[10px] text-amber-300 font-bold cursor-pointer">
                                  <input 
                                    type="checkbox"
                                    checked={!!step.isMediaPinned}
                                    onChange={(e) => handleUpdateStep(step.id, 'isMediaPinned', e.target.checked)}
                                    className="rounded border-slate-700 text-amber-500"
                                  />
                                  <span>📌 Ghim Xuyên Suốt</span>
                                </label>
                              </div>

                              <div className="flex items-center gap-1.5 flex-wrap">
                                <label className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-black text-[11px] font-black rounded-lg cursor-pointer flex items-center gap-1 shadow-sm">
                                  <Upload size={12} />
                                  <span>Tải Video Từ Máy Tính</span>
                                  <input 
                                    type="file" 
                                    accept="video/*,image/*" 
                                    onChange={(e) => handleDirectMediaUpload(step.id, 'mediaUrl', e)} 
                                    className="hidden" 
                                  />
                                </label>

                                {step.mediaUrl && (
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateStep(step.id, 'mediaUrl', '')}
                                    className="p-1.5 bg-slate-800 hover:bg-rose-900/60 text-rose-300 rounded-lg text-[10px] font-bold"
                                    title="Gỡ bỏ media này"
                                  >
                                    <X size={12} />
                                  </button>
                                )}
                              </div>
                              {step.mediaUrl && (
                                <div className="text-[10px] text-cyan-300 font-mono truncate mt-1 bg-slate-900 p-1 rounded border border-slate-800">
                                  📁 Tệp: {step.mediaUrl.startsWith('blob:') ? 'Đã tải từ máy tính' : step.mediaUrl}
                                </div>
                              )}
                            </div>

                            {/* 🎬 VIDEO PHỤ XẾP CHỒNG (PiP) (TỪ MÁY TÍNH + NÚT GHIM) */}
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="text-[10px] font-black uppercase text-gray-400">
                                  Video Phụ Xếp Chồng (PiP):
                                </label>
                                <label className="flex items-center gap-1 text-[10px] text-indigo-300 font-bold cursor-pointer">
                                  <input 
                                    type="checkbox"
                                    checked={!!step.isSecondaryMediaPinned}
                                    onChange={(e) => handleUpdateStep(step.id, 'isSecondaryMediaPinned', e.target.checked)}
                                    className="rounded border-slate-700 text-indigo-500"
                                  />
                                  <span>📌 Ghim Xuyên Suốt</span>
                                </label>
                              </div>

                              <div className="flex items-center gap-1.5 flex-wrap">
                                <label className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-bold rounded-lg cursor-pointer flex items-center gap-1 border border-slate-700">
                                  <Upload size={12} />
                                  <span>Tải Video PiP Từ Máy</span>
                                  <input 
                                    type="file" 
                                    accept="video/*" 
                                    onChange={(e) => handleDirectMediaUpload(step.id, 'secondaryMediaUrl', e)} 
                                    className="hidden" 
                                  />
                                </label>

                                {step.secondaryMediaUrl && (
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateStep(step.id, 'secondaryMediaUrl', '')}
                                    className="p-1.5 bg-slate-800 hover:bg-rose-900/60 text-rose-300 rounded-lg text-[10px]"
                                    title="Gỡ video PiP"
                                  >
                                    <X size={12} />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Cột 2: Tiêu Đề Typography (20 Màu + 20 Font) & Banner Từ Máy */}
                          <div className="space-y-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                            
                            {/* TIÊU ĐỀ CHỮ NỔI BẬT + 20 MÀU + 20 FONT + GHIM */}
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="text-[10px] font-black uppercase text-gray-400">
                                  Tiêu Đề Chữ Typography:
                                </label>
                                <label className="flex items-center gap-1 text-[10px] text-rose-300 font-bold cursor-pointer">
                                  <input 
                                    type="checkbox"
                                    checked={!!step.isOverlayTextPinned}
                                    onChange={(e) => handleUpdateStep(step.id, 'isOverlayTextPinned', e.target.checked)}
                                    className="rounded border-slate-700 text-rose-500"
                                  />
                                  <span>📌 Ghim Xuyên Suốt</span>
                                </label>
                              </div>

                              <input 
                                type="text"
                                value={step.overlayText || ''}
                                onChange={(e) => handleUpdateStep(step.id, 'overlayText', e.target.value)}
                                placeholder="Nhập chữ hiển thị trên sân khấu (hoặc để trống)..."
                                className="w-full bg-slate-900 text-gray-200 text-[11px] p-1.5 rounded-lg border border-slate-700 mb-1.5 outline-none focus:border-rose-500"
                              />

                              <div className="grid grid-cols-2 gap-1.5">
                                {/* 20 Gợi Ý Màu Chữ Typography */}
                                <div>
                                  <label className="text-[9px] text-gray-400 block mb-0.5 font-bold">20 Màu Sắc:</label>
                                  <select
                                    value={step.overlayTextStyle || 'fire_sale'}
                                    onChange={(e) => handleUpdateStep(step.id, 'overlayTextStyle', e.target.value)}
                                    className="w-full bg-slate-900 text-white text-[10px] p-1.5 rounded-lg border border-slate-700 cursor-pointer"
                                  >
                                    {TEXT_STYLE_PRESETS.map(preset => (
                                      <option key={preset.id} value={preset.id}>{preset.name}</option>
                                    ))}
                                  </select>
                                </div>

                                {/* 20 Phông Chữ Độc Đáo */}
                                <div>
                                  <label className="text-[9px] text-gray-400 block mb-0.5 font-bold">20 Font Chữ:</label>
                                  <select
                                    value={step.overlayTextFontFamily || 'be_vietnam'}
                                    onChange={(e) => handleUpdateStep(step.id, 'overlayTextFontFamily', e.target.value)}
                                    className="w-full bg-slate-900 text-white text-[10px] p-1.5 rounded-lg border border-slate-700 cursor-pointer"
                                  >
                                    {FONT_FAMILIES.map(font => (
                                      <option key={font.id} value={font.id}>{font.name}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </div>

                            {/* 🖼️ TẢI BANNER / POSTER DEAL TRỰC TIẾP TỪ MÁY (+ GHIM) */}
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="text-[10px] font-black uppercase text-gray-400">
                                  Banner / Poster Hình Ảnh:
                                </label>
                                <label className="flex items-center gap-1 text-[10px] text-amber-300 font-bold cursor-pointer">
                                  <input 
                                    type="checkbox"
                                    checked={!!step.isOverlayImagePinned}
                                    onChange={(e) => handleUpdateStep(step.id, 'isOverlayImagePinned', e.target.checked)}
                                    className="rounded border-slate-700 text-amber-500"
                                  />
                                  <span>📌 Ghim Xuyên Suốt</span>
                                </label>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <label className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 text-[11px] font-bold rounded-lg cursor-pointer flex items-center gap-1 border border-slate-700">
                                  <Upload size={12} />
                                  <span>Tải Ảnh Banner Từ Máy</span>
                                  <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={(e) => handleDirectMediaUpload(step.id, 'overlayImage', e)} 
                                    className="hidden" 
                                  />
                                </label>

                                {step.overlayImage && (
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateStep(step.id, 'overlayImage', '')}
                                    className="p-1.5 bg-slate-800 hover:bg-rose-900/60 text-rose-300 rounded text-[10px]"
                                    title="Gỡ ảnh banner"
                                  >
                                    <X size={12} />
                                  </button>
                                )}
                              </div>
                            </div>

                          </div>

                        </div>

                      </div>
                    )}

                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 💾 MODAL TẠO MỚI PRESET */}
      {/* ========================================================================= */}
      {showPresetModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Plus className="text-cyan-400" />
              <span>Tạo Bộ Kịch Bản Mới</span>
            </h3>
            
            <div>
              <label className="text-xs text-gray-400 block mb-1 font-bold">Tên Kịch Bản:</label>
              <input 
                type="text"
                value={presetNameInput}
                onChange={(e) => setPresetNameInput(e.target.value)}
                placeholder="Ví dụ: Kịch Bản Bán Hàng 10 Bước..."
                className="w-full bg-slate-950 text-white p-2.5 rounded-xl border border-slate-800 focus:border-cyan-500 outline-none text-sm font-bold"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setShowPresetModal(false);
                  setPresetNameInput('');
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-gray-300 text-xs font-bold cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!presetNameInput.trim()) {
                    toast.error('Vui lòng nhập tên kịch bản!');
                    return;
                  }
                  const newPreset = {
                    id: `preset_custom_${Date.now()}`,
                    name: `🎬 ${presetNameInput.trim()}`,
                    category: 'Tự Tạo',
                    avatarCount: multiAvatarConfig.activeCount || 1,
                    description: 'Bộ kịch bản do bạn tự thiết lập.',
                    loop: true,
                    steps: [
                      {
                        id: `s_${Date.now()}_1`,
                        title: 'Bước 1: Avatar AI Chào Khán Giả',
                        actionType: 'avatar_talk',
                        avatarSpeaker: 'avatar_1',
                        durationSeconds: 60,
                        scriptText: 'Xin chào mọi người đã đến với phiên livestream hôm nay...',
                        mediaUrl: '',
                        overlayText: '',
                        overlayTextStyle: 'fire_sale'
                      }
                    ]
                  };
                  setPresets(prev => [newPreset, ...prev]);
                  setActivePresetId(newPreset.id);
                  setCurrentStepIndex(0);
                  setShowPresetModal(false);
                  setPresetNameInput('');
                  toast.success(`✨ Đã tạo kịch bản: ${newPreset.name}`);
                }}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-black cursor-pointer"
              >
                Tạo Ngay
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
