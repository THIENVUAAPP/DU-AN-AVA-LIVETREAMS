import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  Play, Square, SkipForward, SkipBack, Plus, Trash2, Edit3, Copy, 
  Save, Download, Upload, Sparkles, Clock, Video, Mic, MessageCircle, 
  ShoppingCart, Megaphone, Film, Layers, CheckCircle2, AlertCircle, 
  ChevronUp, ChevronDown, RotateCcw, Bot, Volume2, Users, ShieldCheck, 
  Zap, Star, Tag, Eye, Info, FileText, Image as ImageIcon, Type, Pin, 
  Maximize2, Sliders, Check, X, Palette, Move, Monitor, Wand2,
  FolderOpen, Scaling, UserCheck, RefreshCw, Smartphone, ArrowUpToLine, 
  ArrowDownToLine, ArrowUp, ArrowDown, Lock, Unlock, EyeOff, LayoutGrid, Radio, Scissors
} from 'lucide-react';
import UniversalMediaPicker from './UniversalMediaPicker';
import { readUniversalFile } from '../../utils/universalDocumentParser';
import { SvgChromaFilters } from './MultiAvatarStudioModal';
import { 
  getMultiAvatarConfig, 
  saveMultiAvatarConfig, 
  DEFAULT_MULTI_AVATAR_CONFIG,
  getChromaStyle, 
  removeImageBackgroundCanvas,
  isImageMedia,
  STUDIO_STAGE_PRESETS,
  ALL_SYSTEM_VOICES,
  getSavedVoiceConfig,
  previewVoiceAudio,
  stopVoiceAudio
} from '../../utils/voiceSyncService';

// 🎙️ Danh sách các Giọng Đọc AI Tiếng Việt Top 1 & Đồng Bộ Bộ Não Voice AI Brain
export const CURATED_STUDIO_VOICES = [
  { id: 'brain_auto', name: '🧠 Giọng Bộ Não Voice AI (Tự Động Theo Nhân Vật)' },
  { id: 'free_vi_female', name: 'Hoài My 👑 (Nữ Trong Trẻo - Bán Hàng/MC)' },
  { id: 'vi_female_south_1', name: 'Hà My 🌸 (Nữ Miền Nam Dễ Thương)' },
  { id: 'free_vi_male', name: 'Tuấn Kiệt 🎙️ (Nam Trầm Ấm - MC Livestream)' },
  { id: 'vi_male_south_1', name: 'Nam Phong ⚡ (Nam Miền Nam Năng Động)' },
  { id: 'vi_female_north_1', name: 'Lan Phương 💎 (Nữ Hà Nội Chuẩn Mực)' },
  { id: 'vi-VN-Standard-A', name: 'Ngọc Trinh ✨ (Nữ Thanh Lịch Pro)' },
  { id: 'vi-VN-Standard-B', name: 'Minh Quân 🚀 (Nam Chững Chạc)' }
];

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
        mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        lipsyncUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
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
  const [speakingStepId, setSpeakingStepId] = useState(null);
  const [showPresetModal, setShowPresetModal] = useState(false);
  const [presetNameInput, setPresetNameInput] = useState('');
  const [isStageMediaPaused, setIsStageMediaPaused] = useState(false);

  // 📡 State Đồng Bộ Ra Sân Khấu Chính (OBS / TikTok Live Studio)
  const [isMasterSynced, setIsMasterSynced] = useState(() => {
    try {
      return localStorage.getItem('aidol_master_live_synced') === 'true';
    } catch (e) {
      return false;
    }
  });

  // 🔊 State Bật/Tắt Voice AI Quyền Lực Nhất (Master Voice Control)
  const [isMasterVoiceEnabled, setIsMasterVoiceEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem('avalive_master_voice_enabled');
      return saved !== 'false';
    } catch (e) {
      return true;
    }
  });

  // Lưu trạng thái Master Voice
  useEffect(() => {
    try {
      localStorage.setItem('avalive_master_voice_enabled', isMasterVoiceEnabled ? 'true' : 'false');
    } catch (e) {}
  }, [isMasterVoiceEnabled]);

  // 🛑 LẮNG NGHE LỆNH DỪNG KHẨN CẤP / TẮT TẤT CẢ TỪ BÊN NGOÀI PHẦN MỀM
  useEffect(() => {
    const handleEmergencyStop = () => {
      setIsPlayingFlow(false);
      stopVoiceAudio();
      setIsSpeakingPreview(false);
      setSpeakingStepId(null);
      if (timerRef.current) clearInterval(timerRef.current);
    };

    window.addEventListener('avalive_emergency_stop_all', handleEmergencyStop);
    window.addEventListener('avalive:stop_all_audio_and_voice', handleEmergencyStop);
    window.addEventListener('global-stop-demo', handleEmergencyStop);

    let bc = null;
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        bc = new BroadcastChannel('avalive_master_live_stream');
        bc.onmessage = (e) => {
          if (e.data?.type === 'EMERGENCY_STOP_ALL' || (e.data?.type === 'GLOBAL_PLAYBACK_CHANGE' && !e.data.isPlaying)) {
            handleEmergencyStop();
          }
        };
      } catch (e) {}
    }

    return () => {
      window.removeEventListener('avalive_emergency_stop_all', handleEmergencyStop);
      window.removeEventListener('avalive:stop_all_audio_and_voice', handleEmergencyStop);
      window.removeEventListener('global-stop-demo', handleEmergencyStop);
      if (bc) bc.close();
    };
  }, []);

  // 🎯 State Layer Tương Tác Kéo Thả & Co Giãn 8 Điểm Trên Sân Khấu
  const [selectedLayer, setSelectedLayer] = useState({ type: 'avatar', id: 'avatar_1' });
  const [dragState, setDragState] = useState(null);

  // ↩️ BỘ NHỚ LỊCH SỬ THAO TÁC (UNDO / REDO SYSTEM)
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  // Hàm lưu snapshot trước khi thực hiện thay đổi (Push state to Undo)
  const pushUndoSnapshot = useCallback(() => {
    if (!activePreset) return;
    setUndoStack(prev => {
      const snap = {
        presets: JSON.parse(JSON.stringify(presets)),
        activePresetId,
        multiAvatarConfig: JSON.parse(JSON.stringify(multiAvatarConfig))
      };
      return [...prev.slice(-30), snap];
    });
    setRedoStack([]); // Làm mới redo khi có hành động mới
  }, [presets, activePresetId, activePreset, multiAvatarConfig]);

  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) {
      toast.info('↩️ Không có thao tác nào để quay lại!');
      return;
    }
    const currentSnap = {
      presets: JSON.parse(JSON.stringify(presets)),
      activePresetId,
      multiAvatarConfig: JSON.parse(JSON.stringify(multiAvatarConfig))
    };
    const previousSnap = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, -1));
    setRedoStack(prev => [...prev.slice(-30), currentSnap]);

    if (previousSnap?.presets) {
      setPresets(previousSnap.presets);
      savePresetsToStorage(previousSnap.presets);
    }
    if (previousSnap?.multiAvatarConfig) {
      setMultiAvatarConfig(previousSnap.multiAvatarConfig);
      saveMultiAvatarConfig(previousSnap.multiAvatarConfig);
    }
    toast.success('↩️ ĐÃ QUAY LẠI TRẠNG THÁI TRƯỚC (Hoàn tác thành công)!');
  }, [undoStack, presets, activePresetId, multiAvatarConfig]);

  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) {
      toast.info('↪️ Không có thao tác nào để tiến tới!');
      return;
    }
    const currentSnap = {
      presets: JSON.parse(JSON.stringify(presets)),
      activePresetId,
      multiAvatarConfig: JSON.parse(JSON.stringify(multiAvatarConfig))
    };
    const nextSnap = redoStack[redoStack.length - 1];
    setRedoStack(prev => prev.slice(0, -1));
    setUndoStack(prev => [...prev.slice(-30), currentSnap]);

    if (nextSnap?.presets) {
      setPresets(nextSnap.presets);
      savePresetsToStorage(nextSnap.presets);
    }
    if (nextSnap?.multiAvatarConfig) {
      setMultiAvatarConfig(nextSnap.multiAvatarConfig);
      saveMultiAvatarConfig(nextSnap.multiAvatarConfig);
    }
    toast.success('↪️ ĐÃ TIẾN TỚI THAO TÁC TIẾP THEO (Làm lại thành công)!');
  }, [redoStack, presets, activePresetId, multiAvatarConfig]);

  // Phím tắt Ctrl+Z / Cmd+Z và Ctrl+Y / Cmd+Shift+Z
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target?.tagName)) return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

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

  // 🔍 HÀM GIẢI QUYẾT MEDIA & TỌA ĐỘ BỐ CỤC GHIM XUYÊN SUỐT TỪ ĐẦU ĐẾN CUỐI KỊCH BẢN (100% BẢO TOÀN HIỆN TRẠNG)
  const resolveStepMedia = useCallback((stepIndex) => {
    const steps = activePreset?.steps || [];
    if (steps.length === 0) {
      return {
        mediaUrl: multiAvatarConfig?.backgroundUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        mainMediaTransform: null,
        mainMediaChromaKey: null,
        secondaryMediaUrl: null,
        secondaryMediaTransform: null,
        secondaryMediaChromaKey: null,
        overlayImage: null,
        overlayImageTransform: null,
        overlayImageChromaKey: null,
        overlayText: null,
        overlayTextTransform: null,
        overlayTextStyle: 'fire_sale',
        overlayTextFontFamily: 'be_vietnam',
        overlayTextFontSize: 20,
        overlayTextColor: '#ffffff',
        avatarTransforms: null
      };
    }
    const safeIdx = Math.max(0, Math.min(stepIndex, steps.length - 1));
    const targetStep = steps[safeIdx] || steps[0];

    // 1. Video / Ảnh Nền Chính
    let mediaUrl = targetStep?.mediaUrl;
    let mainMediaTransform = targetStep?.mainMediaTransform || null;
    let mainMediaChromaKey = targetStep?.mainMediaChromaKey || null;
    if (!mediaUrl || !mediaUrl.trim()) {
      // Tìm ngược lại từ bước hiện tại về bước 0 để tìm bước gần nhất được Ghim
      const pinnedStep = steps.slice(0, safeIdx + 1).reverse().find(s => s.isMediaPinned && s.mediaUrl && s.mediaUrl.trim());
      if (pinnedStep) {
        mediaUrl = pinnedStep.mediaUrl;
        if (!mainMediaTransform) mainMediaTransform = pinnedStep.mainMediaTransform || null;
        if (!mainMediaChromaKey) mainMediaChromaKey = pinnedStep.mainMediaChromaKey || null;
      } else {
        const anyPinned = steps.find(s => s.isMediaPinned && s.mediaUrl && s.mediaUrl.trim());
        if (anyPinned) {
          mediaUrl = anyPinned.mediaUrl;
          if (!mainMediaTransform) mainMediaTransform = anyPinned.mainMediaTransform || null;
          if (!mainMediaChromaKey) mainMediaChromaKey = anyPinned.mainMediaChromaKey || null;
        }
      }
    }
    if (!mediaUrl || !mediaUrl.trim()) {
      mediaUrl = multiAvatarConfig?.backgroundUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
    }

    // 2. Video Phụ PiP (Picture-in-Picture)
    let secondaryMediaUrl = targetStep?.secondaryMediaUrl;
    let secondaryMediaTransform = targetStep?.secondaryMediaTransform || null;
    let secondaryMediaChromaKey = targetStep?.secondaryMediaChromaKey || null;
    if (!secondaryMediaUrl || !secondaryMediaUrl.trim()) {
      const pinnedStep = steps.slice(0, safeIdx + 1).reverse().find(s => s.isSecondaryMediaPinned && s.secondaryMediaUrl && s.secondaryMediaUrl.trim());
      if (pinnedStep) {
        secondaryMediaUrl = pinnedStep.secondaryMediaUrl;
        if (!secondaryMediaTransform) secondaryMediaTransform = pinnedStep.secondaryMediaTransform || null;
        if (!secondaryMediaChromaKey) secondaryMediaChromaKey = pinnedStep.secondaryMediaChromaKey || null;
      }
    }

    // 3. Banner / Poster Hình Ảnh
    let overlayImage = targetStep?.overlayImage;
    let overlayImageTransform = targetStep?.overlayImageTransform || null;
    let overlayImageChromaKey = targetStep?.overlayImageChromaKey || null;
    if (!overlayImage || !overlayImage.trim()) {
      const pinnedStep = steps.slice(0, safeIdx + 1).reverse().find(s => s.isOverlayImagePinned && s.overlayImage && s.overlayImage.trim());
      if (pinnedStep) {
        overlayImage = pinnedStep.overlayImage;
        if (!overlayImageTransform) overlayImageTransform = pinnedStep.overlayImageTransform || null;
        if (!overlayImageChromaKey) overlayImageChromaKey = pinnedStep.overlayImageChromaKey || null;
      }
    }

    // 4. Tiêu Đề Chữ Typography
    let overlayText = targetStep?.overlayText;
    let overlayTextTransform = targetStep?.overlayTextTransform || null;
    let overlayTextStyle = targetStep?.overlayTextStyle || 'fire_sale';
    let overlayTextFontFamily = targetStep?.overlayTextFontFamily || 'be_vietnam';
    let overlayTextFontSize = targetStep?.overlayTextFontSize || 20;
    let overlayTextColor = targetStep?.overlayTextColor || '#ffffff';
    if (!overlayText || !overlayText.trim()) {
      const pinnedStep = steps.slice(0, safeIdx + 1).reverse().find(s => s.isOverlayTextPinned && s.overlayText && s.overlayText.trim());
      if (pinnedStep) {
        overlayText = pinnedStep.overlayText;
        if (!overlayTextTransform) overlayTextTransform = pinnedStep.overlayTextTransform || null;
        overlayTextStyle = pinnedStep.overlayTextStyle || overlayTextStyle;
        overlayTextFontFamily = pinnedStep.overlayTextFontFamily || overlayTextFontFamily;
        overlayTextFontSize = pinnedStep.overlayTextFontSize || overlayTextFontSize;
        overlayTextColor = pinnedStep.overlayTextColor || overlayTextColor;
      }
    }

    // 5. Bố Cục Vị Trí Các Avatar (Avatar Transforms)
    let avatarTransforms = targetStep?.avatarTransforms || null;
    if (!avatarTransforms) {
      const pinnedStep = steps.slice(0, safeIdx + 1).reverse().find(s => s.avatarTransforms && Object.keys(s.avatarTransforms).length > 0);
      if (pinnedStep) {
        avatarTransforms = pinnedStep.avatarTransforms;
      }
    }

    return { 
      mediaUrl, 
      mainMediaTransform, 
      mainMediaChromaKey,
      secondaryMediaUrl, 
      secondaryMediaTransform, 
      secondaryMediaChromaKey,
      overlayImage, 
      overlayImageTransform, 
      overlayImageChromaKey,
      overlayText, 
      overlayTextTransform, 
      overlayTextStyle, 
      overlayTextFontFamily, 
      overlayTextFontSize, 
      overlayTextColor,
      avatarTransforms
    };
  }, [activePreset, multiAvatarConfig]);

  // 📡 Đẩy video và dữ liệu phân đoạn của bước hiện tại lên Sân khấu chính (OBS / TikTok Live / Master)
  const syncStepToServer = (step, index = 0, isLivePlaying = true) => {
    if (!step) return;
    
    const resolved = resolveStepMedia(index);
    const mediaToPlay = resolved.mediaUrl;
    const secondaryToPlay = resolved.secondaryMediaUrl;
    const overlayImgToPlay = resolved.overlayImage;
    const overlayTxtToPlay = resolved.overlayText;

    const payload = {
      mediaUrl: mediaToPlay,
      blobUrl: mediaToPlay,
      title: step.title,
      actionType: step.actionType,
      scriptText: step.scriptText || '',
      voiceId: step.voiceId || 'brain_auto',
      durationSeconds: step.durationSeconds || 60,
      stepIndex: index + 1,
      totalSteps: activePreset?.steps?.length || 1,
      presetName: activePreset?.name || 'Kịch bản Sequencer',
      mainMediaTransform: resolved.mainMediaTransform || step.mainMediaTransform || null,
      mainMediaChromaKey: resolved.mainMediaChromaKey || step.mainMediaChromaKey || null,
      secondaryMediaUrl: secondaryToPlay || null,
      secondaryMediaTransform: resolved.secondaryMediaTransform || step.secondaryMediaTransform || null,
      secondaryMediaChromaKey: resolved.secondaryMediaChromaKey || step.secondaryMediaChromaKey || null,
      overlayImage: overlayImgToPlay || null,
      overlayImageTransform: resolved.overlayImageTransform || step.overlayImageTransform || null,
      overlayImageChromaKey: resolved.overlayImageChromaKey || step.overlayImageChromaKey || null,
      overlayText: overlayTxtToPlay || null,
      overlayTextStyle: resolved.overlayTextStyle || step.overlayTextStyle || 'fire_sale',
      overlayTextFontFamily: resolved.overlayTextFontFamily || step.overlayTextFontFamily || 'be_vietnam',
      overlayTextFontSize: resolved.overlayTextFontSize || step.overlayTextFontSize || 20,
      overlayTextColor: resolved.overlayTextColor || step.overlayTextColor || '#ffffff',
      overlayTextTransform: resolved.overlayTextTransform || step.overlayTextTransform || null,
      avatarSpeaker: step.avatarSpeaker || 'avatar_1',
      avatarTransforms: resolved.avatarTransforms || step.avatarTransforms || null,
      isMediaPinned: !!step.isMediaPinned,
      isPlaying: isLivePlaying
    };

    // 1. BroadcastChannel trực tiếp cho Window Capture OBS & TikTok Live Studio
    try {
      const bc = new BroadcastChannel('avalive_master_live_stream');
      bc.postMessage({
        type: 'GLOBAL_MEDIA_CHANGE',
        mediaUrl: mediaToPlay,
        blobUrl: mediaToPlay,
        isVideo: !isImageMedia(mediaToPlay),
        isPlaying: isLivePlaying,
        currentTime: 0,
        source: 'sequencer',
        secondaryMediaUrl: secondaryToPlay || null,
        secondaryMediaTransform: resolved.secondaryMediaTransform || null,
        secondaryMediaChromaKey: resolved.secondaryMediaChromaKey || null,
        overlayImage: overlayImgToPlay || null,
        overlayImageTransform: resolved.overlayImageTransform || null,
        overlayImageChromaKey: resolved.overlayImageChromaKey || null,
        overlayText: overlayTxtToPlay || null,
        overlayTextStyle: resolved.overlayTextStyle || step.overlayTextStyle || 'fire_sale',
        overlayTextFontFamily: resolved.overlayTextFontFamily || step.overlayTextFontFamily || 'be_vietnam',
        overlayTextFontSize: resolved.overlayTextFontSize || step.overlayTextFontSize || 20,
        overlayTextTransform: resolved.overlayTextTransform || null,
        avatarSpeaker: step.avatarSpeaker || 'avatar_1',
        avatarTransforms: resolved.avatarTransforms || null,
        timestamp: Date.now()
      });
    } catch (e) {}

    // 2. Custom Events nội bộ
    window.dispatchEvent(new CustomEvent('avalive:update_master_media', { detail: payload }));
    window.dispatchEvent(new CustomEvent('avalive_flow_step_changed', { detail: payload }));
    if (step.avatarSpeaker) {
      window.dispatchEvent(new CustomEvent('avalive:speaker_change', { detail: { speakerId: step.avatarSpeaker, avatarId: step.avatarSpeaker, isSpeaking: isLivePlaying } }));
      window.dispatchEvent(new CustomEvent('avalive_active_speaker_changed', { detail: { speakerId: step.avatarSpeaker, avatarId: step.avatarSpeaker, isSpeaking: isLivePlaying } }));
    }
    if (multiAvatarConfig && multiAvatarConfig.enabled) {
      window.dispatchEvent(new CustomEvent('avalive_multi_avatar_changed', {
        detail: {
          ...multiAvatarConfig,
          activeSpeakerId: step.avatarSpeaker || 'avatar_1'
        }
      }));
    }

    // 3. Gửi sang Backend API Live State
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
        voiceId: step.voiceId || 'brain_auto',
        avatarSpeaker: step.avatarSpeaker || 'avatar_1',
        secondaryMediaUrl: secondaryToPlay || null,
        secondaryMediaTransform: resolved.secondaryMediaTransform || null,
        overlayImage: overlayImgToPlay || null,
        overlayImageTransform: resolved.overlayImageTransform || null,
        overlayText: overlayTxtToPlay || null,
        overlayTextStyle: resolved.overlayTextStyle || step.overlayTextStyle || 'fire_sale',
        overlayTextFontFamily: resolved.overlayTextFontFamily || step.overlayTextFontFamily || 'be_vietnam',
        overlayTextFontSize: resolved.overlayTextFontSize || step.overlayTextFontSize || 20,
        overlayTextTransform: resolved.overlayTextTransform || null,
        isMediaPinned: !!step.isMediaPinned,
        isPlaying: isLivePlaying,
        fit: 'cover',
        sound: true,
        updatedAt: Date.now()
      })
    }).catch(() => {});
  };

  // Khởi động hoặc chuyển bước trong chuỗi kịch bản (chỉ đọc kịch bản khi được yêu cầu, Master Voice BẬT và Bước BẬT Voice)
  const startStep = (index, shouldPlay = false) => {
    if (!activePreset || !activePreset.steps || activePreset.steps.length === 0) {
      toast.error('Kịch bản chưa có phân đoạn nào!');
      return;
    }
    const safeIndex = (index >= 0 && index < activePreset.steps.length) ? index : 0;
    const step = activePreset.steps[safeIndex];
    setCurrentStepIndex(safeIndex);

    const isAutoScript = step.isScriptDuration || step.durationMode === 'auto_script';
    // Ước lượng số giây theo độ dài kịch bản (~2.6 từ/giây, tối thiểu 5s)
    const wordsCount = (step.scriptText || '').trim().split(/\s+/).filter(Boolean).length;
    const estimatedSeconds = isAutoScript 
      ? Math.max(5, Math.ceil(wordsCount / 2.6)) 
      : (step.durationSeconds || 60);

    setSecondsRemaining(estimatedSeconds);
    syncStepToServer(step, safeIndex, shouldPlay);

    // 🎙️ CHỈ PHÁT GIỌNG ĐỌC KHI ĐƯỢC PHÉP, MASTER VOICE BẬT VÀ BƯỚC ĐÓ BẬT VOICE
    const isStepVoiceOn = step.voiceEnabled !== false;
    if (shouldPlay && isMasterVoiceEnabled && isStepVoiceOn && step.scriptText && step.scriptText.trim()) {
      const effectiveVoiceId = (!step.voiceId || step.voiceId === 'brain_auto')
        ? getBrainVoiceForSpeaker(step.avatarSpeaker)
        : step.voiceId;
      
      stopVoiceAudio();
      setSpeakingStepId(step.id);
      setIsSpeakingPreview(true);

      previewVoiceAudio(effectiveVoiceId, step.scriptText.trim(), () => {
        setSpeakingStepId(null);
        setIsSpeakingPreview(false);

        // NẾU LÀ CHẾ ĐỘ MẶC ĐỊNH THEO KỊCH BẢN & ĐANG CHẠY LIVE -> TỰ ĐỘNG CHUYỂN BƯỚC TIẾP THEO KHI ĐỌC XONG
        if (isAutoScript) {
          const nextIndex = safeIndex + 1;
          if (nextIndex < activePreset.steps.length) {
            startStep(nextIndex, true);
          } else if (activePreset.loop) {
            startStep(0, true);
          } else {
            setIsPlayingFlow(false);
            toast.success('🎉 Đã đọc xong toàn bộ kịch bản!');
          }
        }
      });
    } else {
      stopVoiceAudio();
      setSpeakingStepId(null);
      setIsSpeakingPreview(false);
    }
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
          const currentStepObj = activePreset.steps[currentStepIndex];
          const isAutoScript = currentStepObj?.isScriptDuration || currentStepObj?.durationMode === 'auto_script';
          
          // Nếu là chế độ kịch bản và đang có audio nói thì chờ onEnd, nếu không có audio thì tự chuyển
          if (isAutoScript && isSpeakingPreview) {
            return 1; // Giữ ở 1s cho đến khi giọng đọc kết thúc
          }

          const nextIndex = currentStepIndex + 1;
          if (nextIndex < activePreset.steps.length) {
            startStep(nextIndex, true);
          } else {
            if (activePreset.loop) {
              startStep(0, true);
            } else {
              setIsPlayingFlow(false);
              toast.success('🎉 Đã hoàn thành kịch bản!');
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
  }, [isPlayingFlow, currentStepIndex, activePreset, isSpeakingPreview]);

  // 🛑 DỪNG TỨC THÌ 100% VÀ TẮT MỌI ÂM THANH / GIỌNG NÓI
  const handleStopFlow = () => {
    setIsPlayingFlow(false);
    stopVoiceAudio();
    setIsSpeakingPreview(false);
    setSpeakingStepId(null);
    if (timerRef.current) clearInterval(timerRef.current);
    toast.info('⏹️ Đã tạm dừng kịch bản & tắt toàn bộ âm thanh');
  };

  // ▶️ BẮT ĐẦU CHẠY LIVE
  const handleStartFlow = () => {
    if (!activePreset || !activePreset.steps || activePreset.steps.length === 0) {
      toast.error('Chưa có kịch bản hoặc phân đoạn nào để chạy!');
      return;
    }
    setIsPlayingFlow(true);
    startStep(currentStepIndex, true);
    toast.success(`🎬 Bắt đầu chạy kịch bản: ${activePreset.name}`);
  };

  // 📡 BẬT / TẮT ĐỒNG BỘ RA SÂN KHẤU CHÍNH (ẢNH 3 & ẢNH 4)
  const handleToggleMasterSync = () => {
    const nextSync = !isMasterSynced;
    setIsMasterSynced(nextSync);
    try {
      if (nextSync) {
        localStorage.setItem('avalive_master_sync_active', 'true');
      } else {
        localStorage.removeItem('avalive_master_sync_active');
      }
    } catch (e) {}

    window.dispatchEvent(new CustomEvent('avalive:master_sync_state_changed', { 
      detail: { isSynced: nextSync } 
    }));

    if (nextSync) {
      toast.success('📡 ĐÃ BẬT ĐỒNG BỘ: Toàn bộ Sân Khấu Phụ (Ảnh 4) đang phát ra Sân Khấu Chính!');
      if (activePreset?.steps?.[currentStepIndex]) {
        syncStepToServer(activePreset.steps[currentStepIndex], currentStepIndex, isPlayingFlow);
      }
    } else {
      window.dispatchEvent(new CustomEvent('avalive:stop_flow_sequencer'));
      toast.info('📴 Đã ngắt đồng bộ ra Sân Khấu Chính (Trở về giao diện độc lập)');
    }
  };

  // 👥 Thay đổi số lượng Avatar (1, 2, 3, 4 người)
  const handleChangeAvatarCount = (count) => {
    const updated = {
      ...multiAvatarConfig,
      enabled: true,
      activeCount: count
    };
    setMultiAvatarConfig(updated);
    saveMultiAvatarConfig(updated);
    window.dispatchEvent(new CustomEvent('avalive_multi_avatar_changed', { detail: updated }));
    toast.success(`👥 Đã chuyển sân khấu sang chế độ: ${count} Nhân vật!`);
  };

  // 🔼 DI CHUYỂN LỚP LÊN TRÊN (Bring Forward)
  const handleLayerBringForward = () => {
    if (!currentStep || !selectedLayer) return;
    const curTrans = getLayerCurrentTransform(selectedLayer.type, selectedLayer.id);
    const updated = { ...curTrans, zIndex: (curTrans.zIndex || 10) + 5 };
    handleUpdateStepTransform(currentStep.id, selectedLayer.type, updated, selectedLayer.id);
    toast.success(`🔼 Đã đưa lớp ${selectedLayer.type.toUpperCase()} lên trên! (Z: ${updated.zIndex})`);
  };

  // 🔽 DI CHUYỂN LỚP XUỐNG DƯỚI (Send Backward)
  const handleLayerSendBackward = () => {
    if (!currentStep || !selectedLayer) return;
    const curTrans = getLayerCurrentTransform(selectedLayer.type, selectedLayer.id);
    const updated = { ...curTrans, zIndex: Math.max(1, (curTrans.zIndex || 10) - 5) };
    handleUpdateStepTransform(currentStep.id, selectedLayer.type, updated, selectedLayer.id);
    toast.success(`🔽 Đã đưa lớp ${selectedLayer.type.toUpperCase()} xuống dưới! (Z: ${updated.zIndex})`);
  };

  // 🔝 ĐƯA LÊN ĐỈNH (Bring to Front)
  const handleLayerBringToFront = () => {
    if (!currentStep || !selectedLayer) return;
    const curTrans = getLayerCurrentTransform(selectedLayer.type, selectedLayer.id);
    const updated = { ...curTrans, zIndex: 60 };
    handleUpdateStepTransform(currentStep.id, selectedLayer.type, updated, selectedLayer.id);
    toast.success(`🔝 Đã đưa lớp ${selectedLayer.type.toUpperCase()} lên đỉnh cao nhất!`);
  };

  // 🔻 ĐƯA XUỐNG ĐÁY (Send to Back)
  const handleLayerSendToBack = () => {
    if (!currentStep || !selectedLayer) return;
    const curTrans = getLayerCurrentTransform(selectedLayer.type, selectedLayer.id);
    const updated = { ...curTrans, zIndex: 1 };
    handleUpdateStepTransform(currentStep.id, selectedLayer.type, updated, selectedLayer.id);
    toast.success(`🔻 Đã đưa lớp ${selectedLayer.type.toUpperCase()} xuống dưới cùng!`);
  };

  // Cập nhật thông tin bước
  const handleUpdateStep = (stepId, field, value) => {
    setPresets(prev => prev.map(p => {
      if (p.id !== activePresetId) return p;
      return {
        ...p,
        steps: p.steps.map(s => s.id === stepId ? { ...s, [field]: value } : s)
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
          } else if (layerType === 'main_media') {
            return { ...s, mainMediaTransform: transformData };
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
          mainMediaTransform: currentStepObj.mainMediaTransform ? { ...currentStepObj.mainMediaTransform } : s.mainMediaTransform,
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

  // Thêm một bước mới vào kịch bản (Kế thừa nguyên hiện trạng các layer đã ghim & bố cục)
  const handleAddStep = () => {
    const prevStep = activePreset.steps[activePreset.steps.length - 1];
    const newStep = {
      id: `step_${Date.now()}`,
      title: `Bước ${activePreset.steps.length + 1}: Phân đoạn mới`,
      actionType: prevStep?.actionType || 'avatar_talk',
      avatarSpeaker: prevStep?.avatarSpeaker || 'avatar_1',
      voiceId: prevStep?.voiceId || 'free_vi_female',
      durationSeconds: 60,
      scriptText: 'Xin chào quý vị khán giả và các bạn đang theo dõi phiên livestream...',
      mediaUrl: prevStep?.isMediaPinned ? (prevStep.mediaUrl || '') : '',
      mainMediaTransform: prevStep?.mainMediaTransform ? { ...prevStep.mainMediaTransform } : { x: 0, y: 0, width: 100, height: 100, zIndex: 1 },
      mainMediaChromaKey: prevStep?.mainMediaChromaKey ? { ...prevStep.mainMediaChromaKey } : null,
      secondaryMediaUrl: prevStep?.isSecondaryMediaPinned ? (prevStep.secondaryMediaUrl || '') : '',
      secondaryMediaTransform: prevStep?.secondaryMediaTransform ? { ...prevStep.secondaryMediaTransform } : null,
      secondaryMediaChromaKey: prevStep?.secondaryMediaChromaKey ? { ...prevStep.secondaryMediaChromaKey } : null,
      overlayImage: prevStep?.isOverlayImagePinned ? (prevStep.overlayImage || '') : '',
      overlayImageTransform: prevStep?.overlayImageTransform ? { ...prevStep.overlayImageTransform } : null,
      overlayImageChromaKey: prevStep?.overlayImageChromaKey ? { ...prevStep.overlayImageChromaKey } : null,
      overlayText: prevStep?.isOverlayTextPinned ? (prevStep.overlayText || '') : '',
      overlayTextTransform: prevStep?.overlayTextTransform ? { ...prevStep.overlayTextTransform } : null,
      overlayTextStyle: prevStep?.overlayTextStyle || 'fire_sale',
      overlayTextFontSize: prevStep?.overlayTextFontSize || 20,
      overlayTextFontFamily: prevStep?.overlayTextFontFamily || 'be_vietnam',
      overlayTextColor: prevStep?.overlayTextColor || '#ffffff',
      avatarTransforms: prevStep?.avatarTransforms ? JSON.parse(JSON.stringify(prevStep.avatarTransforms)) : null,
      isMediaPinned: !!prevStep?.isMediaPinned,
      isSecondaryMediaPinned: !!prevStep?.isSecondaryMediaPinned,
      isOverlayImagePinned: !!prevStep?.isOverlayImagePinned,
      isOverlayTextPinned: !!prevStep?.isOverlayTextPinned
    };

    setPresets(prev => prev.map(p => {
      if (p.id !== activePresetId) return p;
      return {
        ...p,
        steps: [...p.steps, newStep]
      };
    }));
    toast.success(`➕ Đã thêm Bước ${activePreset.steps.length + 1} (Kế thừa hiện trạng ghim)`);
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

  // 🎭 Tải Media Trực Tiếp Từ Máy Tính Gán Vào Avatar Đang Chọn Trên Sân Khấu
  const handleDirectAvatarMediaUpload = (avatarId, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const objectUrl = URL.createObjectURL(file);
      const updated = {
        ...multiAvatarConfig,
        avatars: (multiAvatarConfig?.avatars || []).map(a => {
          if (a.id === avatarId) {
            return {
              ...a,
              talkVideo: objectUrl,
              idleVideo: objectUrl
            };
          }
          return a;
        })
      };
      setMultiAvatarConfig(updated);
      saveMultiAvatarConfig(updated);
      toast.success(`🎭 Đã nạp "${file.name}" cho Avatar ${avatarId.toUpperCase()}!`);
    } catch (err) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result;
        const updated = {
          ...multiAvatarConfig,
          avatars: (multiAvatarConfig?.avatars || []).map(a => {
            if (a.id === avatarId) {
              return { ...a, talkVideo: dataUrl, idleVideo: dataUrl };
            }
            return a;
          })
        };
        setMultiAvatarConfig(updated);
        saveMultiAvatarConfig(updated);
        toast.success(`🎭 Đã nạp "${file.name}" cho Avatar ${avatarId.toUpperCase()}!`);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  // 📂 TẢI MEDIA TRỰC TIẾP TỪ MÁY TÍNH (VIDEO / ẢNH) -> NẠP NGAY LÊN SÂN KHẤU 9:16
  const handleDirectMediaUpload = (stepId, targetField, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Tự động chuyển ngay sang bước này để hiển thị trên Sân Khấu 9:16
    const stepIdx = activePreset?.steps?.findIndex(s => s.id === stepId);
    if (stepIdx !== undefined && stepIdx >= 0) {
      setCurrentStepIndex(stepIdx);
      const stepObj = activePreset.steps[stepIdx];
      if (stepObj) {
        setSecondsRemaining(stepObj.durationSeconds || 60);
      }
    }

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

  // 📁 Tải Media Trực Tiếp Cho Lớp Đang Chọn (Avatar, Nền Chính, PiP, Banner)
  const handleDirectLayerUpload = (layerType, layerId, e) => {
    if (!currentStep) return;
    if (layerType === 'avatar') {
      handleDirectAvatarMediaUpload(layerId, e);
    } else if (layerType === 'main_media') {
      handleDirectMediaUpload(currentStep.id, 'mediaUrl', e);
    } else if (layerType === 'pip') {
      handleDirectMediaUpload(currentStep.id, 'secondaryMediaUrl', e);
    } else if (layerType === 'banner') {
      handleDirectMediaUpload(currentStep.id, 'overlayImage', e);
    }
  };

  // ✂️ CẬP NHẬT CHẾ ĐỘ XÓA PHÔNG XANH / NỀN ĐEN / NỀN TRẮNG CHO AVATAR ĐANG CHỌN
  const handleAvatarChromaUpdate = (avatarId, updates) => {
    const updated = {
      ...multiAvatarConfig,
      avatars: (multiAvatarConfig?.avatars || []).map(a => {
        if (a.id === avatarId) {
          const currentChroma = a.chromaKey || { enabled: false, color: '#00ff00', mode: 'green' };
          return {
            ...a,
            chromaKey: {
              ...currentChroma,
              ...updates
            }
          };
        }
        return a;
      })
    };
    setMultiAvatarConfig(updated);
    saveMultiAvatarConfig(updated);
    toast.success(`✨ Đã cập nhật Xóa Phông cho Avatar ${avatarId.toUpperCase()}!`);
  };

  // 🧠 Ánh xạ giọng đọc từ BỘ NÃO VOICE AI BRAIN cho từng nhân vật 1 - 5
  const getBrainVoiceForSpeaker = useCallback((speakerId) => {
    try {
      const voiceCfg = getSavedVoiceConfig();
      if (speakerId === 'avatar_1') return voiceCfg.avatar1Voice?.id || voiceCfg.idolVoice?.id || 'free_vi_female';
      if (speakerId === 'avatar_2') return voiceCfg.avatar2Voice?.id || voiceCfg.managerVoice?.id || 'vn_nam_quanly_uyquyen';
      if (speakerId === 'avatar_3') return voiceCfg.avatar3Voice?.id || voiceCfg.gameBlvVoice?.id || 'vn_nam_blv_bungno';
      if (speakerId === 'avatar_4') return voiceCfg.avatar4Voice?.id || voiceCfg.commentVoice?.id || 'vi_female_south_1';
      if (speakerId === 'avatar_5') return voiceCfg.avatar5Voice?.id || 'vi_female_north_1';
      return voiceCfg.avatar1Voice?.id || voiceCfg.idolVoice?.id || 'free_vi_female';
    } catch (e) {
      return 'free_vi_female';
    }
  }, []);

  // 🧠 Lấy tên hiển thị giọng đọc từ Bộ Não Voice AI Brain
  const getBrainVoiceNameForSpeaker = useCallback((speakerId) => {
    const vId = getBrainVoiceForSpeaker(speakerId);
    const found = ALL_SYSTEM_VOICES.find(v => v.id === vId) || CURATED_STUDIO_VOICES.find(v => v.id === vId);
    return found?.name || 'Hoài My 👑 (Nữ Chuẩn Mực)';
  }, [getBrainVoiceForSpeaker]);

  // 🎙️ Toàn bộ danh sách Giọng Đọc AI Phân Nhóm từ Bộ Não Voice AI
  const categorizedVoiceList = useMemo(() => {
    const vipVoices = ALL_SYSTEM_VOICES.filter(v => v.tier === 'pro' || v.badge?.includes('VIP') || v.id.startsWith('free_') || v.id.startsWith('vn_'));
    const femaleVoices = ALL_SYSTEM_VOICES.filter(v => v.gender === 'Female' && !vipVoices.some(vip => vip.id === v.id) && (v.lang?.startsWith('vi') || v.region === 'vi'));
    const maleVoices = ALL_SYSTEM_VOICES.filter(v => v.gender === 'Male' && !vipVoices.some(vip => vip.id === v.id) && (v.lang?.startsWith('vi') || v.region === 'vi'));
    const otherVoices = ALL_SYSTEM_VOICES.filter(v => !vipVoices.some(vip => vip.id === v.id) && !femaleVoices.some(f => f.id === v.id) && !maleVoices.some(m => m.id === v.id));

    return {
      vipVoices,
      femaleVoices,
      maleVoices,
      otherVoices
    };
  }, []);

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

  // 🗑️ XÓA TRỰC TIẾP Ô NHÂN VẬT KHỎI SÂN KHẤU
  const handleDeleteAvatarLayer = (avatarId) => {
    const existingAvatars = (multiAvatarConfig?.avatars && multiAvatarConfig.avatars.length > 0)
      ? [...multiAvatarConfig.avatars]
      : [
          { id: 'avatar_1', name: 'Nhân Vật 1', talkVideo: '', idleVideo: '', voiceId: 'vi-VN-Standard-A', chromaKey: { enabled: false, mode: 'green', color: '#00ff00' } },
          { id: 'avatar_2', name: 'Nhân Vật 2', talkVideo: '', idleVideo: '', voiceId: 'vi-VN-Standard-B', chromaKey: { enabled: false, mode: 'green', color: '#00ff00' } },
          { id: 'avatar_3', name: 'Nhân Vật 3', talkVideo: '', idleVideo: '', voiceId: 'vi-VN-Standard-C', chromaKey: { enabled: false, mode: 'green', color: '#00ff00' } },
          { id: 'avatar_4', name: 'Nhân Vật 4', talkVideo: '', idleVideo: '', voiceId: 'vi-VN-Standard-D', chromaKey: { enabled: false, mode: 'green', color: '#00ff00' } }
        ];

    const targetIdx = existingAvatars.findIndex(a => a.id === avatarId);
    let updatedAvatars = [...existingAvatars];
    if (targetIdx >= 0) {
      const [removed] = updatedAvatars.splice(targetIdx, 1);
      updatedAvatars.push({
        ...removed,
        name: `Nhân Vật ${updatedAvatars.length + 1}`,
        talkVideo: '',
        idleVideo: '',
        chromaKey: { enabled: false, mode: 'green', color: '#00ff00' }
      });
      updatedAvatars = updatedAvatars.map((a, idx) => ({
        ...a,
        id: `avatar_${idx + 1}`,
        name: a.name.startsWith('Nhân Vật') ? `Nhân Vật ${idx + 1}` : a.name
      }));
    }

    const currentCount = multiAvatarConfig?.activeCount || 1;
    const newCount = Math.max(1, currentCount - 1);

    const updated = {
      ...multiAvatarConfig,
      activeCount: newCount,
      avatars: updatedAvatars
    };
    setMultiAvatarConfig(updated);
    saveMultiAvatarConfig(updated);
    setSelectedLayer({ type: 'avatar', id: 'avatar_1' });
    toast.info(`🗑️ Đã xóa ô Avatar khỏi Sân Khấu!`);
  };

  const currentStep = activePreset.steps[currentStepIndex] || activePreset.steps[0];
  const safeAvatars = (multiAvatarConfig?.avatars && multiAvatarConfig.avatars.length > 0)
    ? multiAvatarConfig.avatars
    : DEFAULT_MULTI_AVATAR_CONFIG.avatars;
  const activeAvatarCount = multiAvatarConfig?.activeCount || 1;
  const visibleAvatars = safeAvatars.slice(0, activeAvatarCount);

  // ✂️ LẤY STYLE CHROMA KEY / XÓA NỀN CHO BẤT KỲ LỚP NÀO
  const getLayerChromaStyle = useCallback((layerType, avatarId = null) => {
    if (layerType === 'avatar' && avatarId) {
      const av = safeAvatars.find(a => a.id === avatarId);
      if (av?.chromaKey?.enabled) {
        return getChromaStyle(av.chromaKey);
      }
      return {};
    }
    const resolved = resolveStepMedia(currentStepIndex);
    if (layerType === 'main_media') {
      const chroma = currentStep?.mainMediaChromaKey || resolved.mainMediaChromaKey;
      if (chroma?.enabled) return getChromaStyle(chroma);
    }
    if (layerType === 'pip') {
      const chroma = currentStep?.secondaryMediaChromaKey || resolved.secondaryMediaChromaKey;
      if (chroma?.enabled) return getChromaStyle(chroma);
    }
    if (layerType === 'banner') {
      const chroma = currentStep?.overlayImageChromaKey || resolved.overlayImageChromaKey;
      if (chroma?.enabled) return getChromaStyle(chroma);
    }
    return {};
  }, [safeAvatars, currentStep, currentStepIndex, resolveStepMedia]);

  // ✂️ CẬP NHẬT CHROMA KEY / XÓA NỀN CHO BẤT KỲ LỚP NÀO
  const handleLayerChromaUpdate = (layerType, targetId, updates) => {
    if (layerType === 'avatar' && targetId) {
      handleAvatarChromaUpdate(targetId, updates);
    } else if (layerType === 'main_media') {
      const current = currentStep?.mainMediaChromaKey || { enabled: false, mode: 'green', color: '#00ff00' };
      handleUpdateStep(currentStep.id, 'mainMediaChromaKey', { ...current, ...updates });
      toast.success('✨ Đã cập nhật Tách Phông cho Video/Ảnh Nền!');
    } else if (layerType === 'pip') {
      const current = currentStep?.secondaryMediaChromaKey || { enabled: false, mode: 'green', color: '#00ff00' };
      handleUpdateStep(currentStep.id, 'secondaryMediaChromaKey', { ...current, ...updates });
      toast.success('✨ Đã cập nhật Tách Phông cho Video PiP!');
    } else if (layerType === 'banner') {
      const current = currentStep?.overlayImageChromaKey || { enabled: false, mode: 'green', color: '#00ff00' };
      handleUpdateStep(currentStep.id, 'overlayImageChromaKey', { ...current, ...updates });
      toast.success('✨ Đã cập nhật Tách Phông cho Ảnh Banner!');
    }
  };

  // ✂️ TÁCH NỀN TỨC THÌ (CANVAS REALTIME 0MS) CHO HÌNH ẢNH HOẶC VIDEO
  const handleInstantCanvasBgRemoval = async (layerType, targetId = null, mode = 'green') => {
    let targetImg = null;
    if (layerType === 'avatar' && targetId) {
      const av = safeAvatars.find(a => a.id === targetId);
      targetImg = av?.talkVideo || av?.idleVideo;
    } else if (layerType === 'main_media') {
      targetImg = currentStep?.mediaUrl;
    } else if (layerType === 'pip') {
      targetImg = currentStep?.secondaryMediaUrl;
    } else if (layerType === 'banner') {
      targetImg = currentStep?.overlayImage;
    }

    if (!targetImg || !isImageMedia(targetImg)) {
      // Đối với Video: Kích hoạt bộ lọc Chroma Key tương ứng
      handleLayerChromaUpdate(layerType, targetId, { enabled: true, mode });
      toast.info(`✨ Đã kích hoạt bộ lọc Tách Nền (${mode.toUpperCase()}) cho Video!`);
      return;
    }

    toast.info('⏳ Đang xử lý tách nền hình ảnh siêu sạch...');
    try {
      const transparentDataUrl = await removeImageBackgroundCanvas(targetImg, mode);
      if (layerType === 'avatar' && targetId) {
        handleAvatarMediaUpload(targetId, 'talkVideo', transparentDataUrl);
      } else if (layerType === 'main_media') {
        handleUpdateStep(currentStep.id, 'mediaUrl', transparentDataUrl);
      } else if (layerType === 'pip') {
        handleUpdateStep(currentStep.id, 'secondaryMediaUrl', transparentDataUrl);
      } else if (layerType === 'banner') {
        handleUpdateStep(currentStep.id, 'overlayImage', transparentDataUrl);
      }
      toast.success('🎉 Đã tách sạch sẽ 100% nền hình ảnh trong suốt!');
    } catch (err) {
      handleLayerChromaUpdate(layerType, targetId, { enabled: true, mode });
      toast.success('✨ Đã bật bộ lọc Tách Phông Xanh!');
    }
  };

  // 📺 NHÚNG VIDEO / ẢNH VÀO KHUNG PHÔNG XANH (GREEN SCREEN FRAME EMBEDDING)
  const handleEmbedGreenScreenFrame = (frameImgUrl, contentMediaUrl) => {
    if (!currentStep) return;
    const currentSteps = [...activePreset.steps];
    const stepIdx = currentSteps.findIndex(s => s.id === currentStep.id);
    if (stepIdx === -1) return;

    const updated = {
      ...currentSteps[stepIdx],
      overlayImage: frameImgUrl,
      overlayImageChromaKey: { enabled: true, mode: 'green', color: '#00ff00' },
      overlayImageTransform: { x: 5, y: 10, width: 90, height: 80, zIndex: 30 },
      secondaryMediaUrl: contentMediaUrl,
      secondaryMediaChromaKey: { enabled: false, mode: 'green', color: '#00ff00' },
      secondaryMediaTransform: { x: 12, y: 18, width: 76, height: 60, zIndex: 10 }
    };
    currentSteps[stepIdx] = updated;

    const updatedPresets = presets.map(p => {
      if (p.id === activePreset.id) return { ...p, steps: currentSteps };
      return p;
    });
    setPresets(updatedPresets);
    toast.success('📺 Đã nhúng Video/Ảnh vào Khung Phông Xanh chuẩn 100%!');
  };

  // Tính toán Media hiển thị trên sân khấu (kèm logic ghim xuyên suốt 100%)
  const resolvedMedia = resolveStepMedia(currentStepIndex);
  const activeMediaUrl = resolvedMedia.mediaUrl;
  const activeSecondaryMediaUrl = resolvedMedia.secondaryMediaUrl;
  const activeOverlayImage = resolvedMedia.overlayImage;
  const activeOverlayText = resolvedMedia.overlayText;

  // =========================================================================
  // 🖐️ BỘ XỬ LÝ KÉO THẢ & CO GIÃN 8 ĐIỂM TRỰC TIẾP TRÊN SÂN KHẤU 9:16
  // =========================================================================
  const getLayerCurrentTransform = useCallback((layerType, avatarId = null) => {
    if (!currentStep) return { x: 10, y: 15, width: 45, height: 75, zIndex: 10 };
    
    if (layerType === 'avatar' && avatarId) {
      if (currentStep.avatarTransforms && currentStep.avatarTransforms[avatarId]) {
        return currentStep.avatarTransforms[avatarId];
      }
      const steps = activePreset?.steps || [];
      const safeIdx = Math.max(0, Math.min(currentStepIndex, steps.length - 1));
      const prevWithAvatarTransform = steps.slice(0, safeIdx).reverse().find(s => s.avatarTransforms && s.avatarTransforms[avatarId]);
      if (prevWithAvatarTransform) {
        return prevWithAvatarTransform.avatarTransforms[avatarId];
      }
      const avObj = safeAvatars.find(a => a.id === avatarId);
      if (avObj && avObj.transform) return avObj.transform;
      const avIdx = safeAvatars.findIndex(a => a.id === avatarId);
      const safeIdxAv = avIdx >= 0 ? avIdx : 0;
      return { x: 5 + safeIdxAv * 24, y: 15, width: 45, height: 75, zIndex: 10 + safeIdxAv };
    }

    const resolved = resolveStepMedia(currentStepIndex);

    if (layerType === 'main_media') {
      return currentStep.mainMediaTransform || resolved.mainMediaTransform || { x: 0, y: 0, width: 100, height: 100, zIndex: 1 };
    }

    if (layerType === 'pip') {
      return currentStep.secondaryMediaTransform || resolved.secondaryMediaTransform || { x: 55, y: 8, width: 40, height: 25, zIndex: 20 };
    }

    if (layerType === 'banner') {
      return currentStep.overlayImageTransform || resolved.overlayImageTransform || { x: 10, y: 12, width: 80, height: 20, zIndex: 25 };
    }

    if (layerType === 'text') {
      return currentStep.overlayTextTransform || resolved.overlayTextTransform || { x: 5, y: 5, width: 90, height: 12, zIndex: 30 };
    }

    return { x: 10, y: 10, width: 80, height: 20, zIndex: 10 };
  }, [currentStep, currentStepIndex, activePreset, safeAvatars, resolveStepMedia]);

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
        if (layerType === 'text' && handle) {
          const calculatedFontSize = Math.max(12, Math.min(64, Math.round(newTransform.width * 0.32 + (newTransform.height || 10) * 0.45)));
          handleUpdateStep(currentStep.id, 'overlayTextFontSize', calculatedFontSize);
        }
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

  // 🎙️ ĐỌC THỬ GIỌNG AI BỘ NÃO (VOICE AI BRAIN) 0MS THỜI GIAN THỰC
  const handleTestVoiceSpeech = (stepId, text, voiceId = 'brain_auto', speakerId = 'avatar_1') => {
    if (!text || !text.trim()) {
      toast.error('Chưa có lời thoại để đọc thử!');
      return;
    }
    if (speakingStepId === stepId || isSpeakingPreview) {
      stopVoiceAudio();
      setIsSpeakingPreview(false);
      setSpeakingStepId(null);
      toast.info('⏹️ Đã dừng giọng đọc');
      return;
    }
    
    const effectiveVoiceId = (!voiceId || voiceId === 'brain_auto') 
      ? getBrainVoiceForSpeaker(speakerId) 
      : voiceId;

    setIsSpeakingPreview(true);
    setSpeakingStepId(stepId);

    previewVoiceAudio(effectiveVoiceId, text, () => {
      setIsSpeakingPreview(false);
      setSpeakingStepId(null);
    });
  };

  return (
    <div className="w-full h-full min-h-0 flex flex-col bg-[#080a10] text-gray-100 overflow-hidden select-none font-sans">
      <SvgChromaFilters />

      {/* ========================================================================= */}
      {/* 🚀 TOP TOOLBAR: THANH ĐIỀU KHIỂN ĐỈNH CAO TINH GỌN (CAO 44PX) */}
      {/* ========================================================================= */}
      <div className="bg-[#101322] border-b border-indigo-900/50 px-3 py-1.5 flex items-center justify-between gap-2.5 shrink-0 z-20 shadow-md">
        
        {/* Nhóm Trái: Tiêu Đề Gọn & Chọn Kịch Bản (Ảnh số 2) */}
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-slate-900 border border-slate-700">
            <Layers className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="font-black text-xs text-cyan-300 tracking-tight">
              🎬 Kịch Bản Live
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
              className="bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded-lg border border-slate-700 outline-none focus:border-indigo-500 max-w-[150px] sm:max-w-[200px] truncate cursor-pointer"
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

          {/* ↩️ NÚT HOÀN TÁC (UNDO) & TIẾN TỚI (REDO) CHỐNG XÓA NHẦM */}
          <div className="flex items-center gap-1 bg-slate-900/90 px-1.5 py-1 rounded-xl border border-slate-700 shadow-sm shrink-0">
            <button
              type="button"
              onClick={handleUndo}
              disabled={undoStack.length === 0}
              className={`px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-black transition-all cursor-pointer ${
                undoStack.length > 0 
                  ? 'bg-slate-800 hover:bg-cyan-600 text-cyan-300 hover:text-white border border-cyan-500/40 shadow-sm active:scale-95' 
                  : 'text-gray-600 cursor-not-allowed opacity-35'
              }`}
              title="Quay lại thao tác trước đó (Ctrl + Z)"
            >
              <RotateCcw size={12} />
              <span className="hidden sm:inline text-[10.5px]">Quay Lại</span>
            </button>
            <button
              type="button"
              onClick={handleRedo}
              disabled={redoStack.length === 0}
              className={`px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-black transition-all cursor-pointer ${
                redoStack.length > 0 
                  ? 'bg-slate-800 hover:bg-amber-600 text-amber-300 hover:text-white border border-amber-500/40 shadow-sm active:scale-95' 
                  : 'text-gray-600 cursor-not-allowed opacity-35'
              }`}
              title="Tiến tới thao tác tiếp theo (Ctrl + Y)"
            >
              <RotateCcw size={12} className="rotate-180 -scale-y-100" />
              <span className="hidden sm:inline text-[10.5px]">Tiến Tới</span>
            </button>
          </div>
        </div>

        {/* Nhóm Phải: Công Tắc Master Voice AI, Đồng Bộ Sân Khấu Chính, Chạy Test & Điều Hướng Bước */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* NÚT QUYỀN LỰC: BẬT / TẮT TẤT CẢ GIỌNG ĐỌC VOICE AI */}
          <button
            type="button"
            onClick={() => {
              const nextVoice = !isMasterVoiceEnabled;
              setIsMasterVoiceEnabled(nextVoice);
              if (!nextVoice) {
                stopVoiceAudio();
                setIsSpeakingPreview(false);
                setSpeakingStepId(null);
                toast.info('🔇 Đã TẮT TẤT CẢ Voice & Giọng Đọc AI');
              } else {
                toast.success('🔊 Đã BẬT Voice AI & Giọng Đọc AI');
              }
            }}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-md cursor-pointer border ${
              isMasterVoiceEnabled 
                ? 'bg-emerald-950/90 hover:bg-emerald-900 text-emerald-300 border-emerald-500/50' 
                : 'bg-rose-950/90 hover:bg-rose-900 text-rose-300 border-rose-500/50'
            }`}
            title={isMasterVoiceEnabled ? 'Bấm để TẮT TẤT CẢ âm thanh / giọng đọc AI' : 'Bấm để BẬT âm thanh / giọng đọc AI'}
          >
            {isMasterVoiceEnabled ? <Volume2 size={13} className="text-emerald-400" /> : <Volume2 size={13} className="text-rose-400 opacity-60" />}
            <span className="hidden sm:inline">{isMasterVoiceEnabled ? 'VOICE AI: BẬT' : 'VOICE AI: TẮT'}</span>
          </button>

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
        {/* 📱 CỘT TRÁI (LEFT PANEL - 30%): SÂN KHẤU LIVE 9:16 & THANH CÔNG CỤ LỚP HÀNG NGANG TRÊN CÙNG */}
        {/* ========================================================================= */}
        <div className="w-full lg:w-[32%] xl:w-[30%] flex flex-col h-full bg-[#0d101e] rounded-2xl border border-indigo-900/40 p-2 shadow-2xl shrink-0 overflow-hidden min-h-0 relative">
          
          {/* 🌟 THANH CÔNG CỤ LỚP XẾP HÀNG NGANG GỌN GÀNG NẰM TRONG KHUNG SÂN KHẤU (Ảnh số 1) */}
          {selectedLayer.type ? (
            <div 
              className="w-full flex items-center justify-between gap-1 bg-slate-950/95 backdrop-blur-md px-1.5 py-1 rounded-xl border border-cyan-400 shadow-xl mb-1.5 shrink-0 animate-in fade-in slide-in-from-top-1 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="px-1.5 py-0.5 rounded-md bg-cyan-950 text-[9px] font-black text-cyan-300 border border-cyan-500/40 uppercase shrink-0" title={`Lớp: ${selectedLayer.type}`}>
                {selectedLayer.type === 'avatar' ? `AV${selectedLayer.id}` : selectedLayer.type === 'main_media' ? 'NỀN' : selectedLayer.type === 'pip' ? 'PIP' : selectedLayer.type === 'banner' ? 'ẢNH' : 'CHỮ'}
              </span>

              <div className="flex items-center gap-0.5 shrink-0">
                {/* 📁 Nút Tải Video/Ảnh (Ảnh 4) */}
                {selectedLayer.type !== 'text' && (
                  <label className="px-1.5 py-0.5 rounded-md text-[8.5px] font-black bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-0.5 cursor-pointer shadow-xs whitespace-nowrap" title="Tải Video/Ảnh từ máy tính lên">
                    <Upload size={9} />
                    <span>Tải Lên</span>
                    <input 
                      type="file" 
                      accept="video/*,image/*" 
                      onChange={(e) => handleDirectLayerUpload(selectedLayer.type, selectedLayer.id, e)}
                      className="hidden" 
                    />
                  </label>
                )}

                {/* 🪄 Xóa Nền AI */}
                {selectedLayer.type !== 'text' && (
                  <button
                    type="button"
                    onClick={() => handleInstantCanvasBgRemoval(selectedLayer.type, selectedLayer.id, 'auto')}
                    className="px-1.5 py-0.5 rounded-md text-[8.5px] font-black bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white flex items-center gap-0.5 cursor-pointer shadow-xs whitespace-nowrap"
                    title="Tự động tách mọi loại nền"
                  >
                    <Wand2 size={9} />
                    <span>Xóa Nền</span>
                  </button>
                )}

                {/* Lên Lớp / Xuống Lớp */}
                <button
                  type="button"
                  onClick={handleLayerBringForward}
                  className="px-1 py-0.5 rounded text-[8.5px] font-bold bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 flex items-center gap-0.5 cursor-pointer"
                  title="Đưa lên trên 1 lớp"
                >
                  <ArrowUp size={8.5} />
                  <span>Lên</span>
                </button>
                <button
                  type="button"
                  onClick={handleLayerSendBackward}
                  className="px-1 py-0.5 rounded text-[8.5px] font-bold bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-700 flex items-center gap-0.5 cursor-pointer"
                  title="Đưa xuống dưới 1 lớp"
                >
                  <ArrowDown size={8.5} />
                  <span>Xuống</span>
                </button>

                {/* Xóa Lớp */}
                <button
                  type="button"
                  onClick={() => handleDeleteLayerFromStep(currentStep.id, selectedLayer.type, selectedLayer.id)}
                  className="px-1.5 py-0.5 rounded-md text-[8.5px] font-black bg-rose-950/80 hover:bg-rose-900 text-rose-300 hover:text-white border border-rose-600/40 flex items-center gap-0.5 cursor-pointer"
                  title="Xóa lớp này"
                >
                  <Trash2 size={8.5} />
                  <span>Xóa</span>
                </button>

                {/* Đóng Chọn */}
                <button
                  type="button"
                  onClick={() => setSelectedLayer({ type: null, id: null })}
                  className="p-0.5 rounded text-gray-400 hover:text-white cursor-pointer"
                  title="Đóng chọn"
                >
                  <X size={10} />
                </button>
              </div>
            </div>
          ) : (
            /* Badge Trạng Thái Nhỏ Gọn Khi Không Chọn Lớp */
            <div className="w-full flex items-center justify-between pb-1 mb-1 border-b border-indigo-900/40 shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black text-cyan-300 flex items-center gap-1">
                  <Smartphone size={12} className="text-cyan-400" />
                  <span>SÂN KHẤU 9:16</span>
                </span>
                {/* ⏯️ Nút Bật/Tắt Dừng Tất Cả Video Trên Sân Khấu Phụ */}
                <button
                  type="button"
                  onClick={() => {
                    const next = !isStageMediaPaused;
                    setIsStageMediaPaused(next);
                    toast.info(next ? '⏸️ Đã DỪNG tất cả video trên Sân Khấu' : '▶️ Đã TIẾP TỤC phát tất cả video');
                  }}
                  className={`px-1.5 py-0.5 rounded-md text-[8.5px] font-black transition-all flex items-center gap-0.5 cursor-pointer border ${
                    isStageMediaPaused 
                      ? 'bg-amber-950/90 hover:bg-amber-900 text-amber-300 border-amber-500/60 shadow-xs animate-pulse' 
                      : 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border-slate-700'
                  }`}
                  title="Bật/Tắt (Dừng/Phát) tất cả video trên Sân Khấu Phụ"
                >
                  {isStageMediaPaused ? <Play size={8.5} className="fill-amber-300" /> : <Square size={8.5} className="fill-cyan-300" />}
                  <span>{isStageMediaPaused ? 'Phát Video' : 'Dừng Video'}</span>
                </button>
              </div>
              <div className="flex items-center gap-1">
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-black bg-indigo-950 text-amber-300 border border-indigo-500/40">
                  {currentStepIndex + 1}/{activePreset.steps.length}
                </span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                  {Math.floor(secondsRemaining / 60)}:{(secondsRemaining % 60).toString().padStart(2, '0')}s
                </span>
              </div>
            </div>
          )}

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

              {/* Lớp 1: Video / Ảnh Nền Chính (Kéo thả & Co giãn 8 hướng & Xóa Trực Tiếp Góc Trái & Tách Nền) */}
              {activeMediaUrl && (() => {
                const mediaTrans = getLayerCurrentTransform('main_media');
                const isSelected = selectedLayer.type === 'main_media';
                const chromaStyle = getLayerChromaStyle('main_media');
                const chromaKey = currentStep?.mainMediaChromaKey;

                return (
                  <div
                    onMouseDown={(e) => handlePointerDown(e, 'main_media', null, null)}
                    onTouchStart={(e) => handlePointerDown(e, 'main_media', null, null)}
                    className={`absolute transition-shadow cursor-move select-none ${
                      isSelected ? 'ring-2 ring-cyan-400 shadow-2xl z-20' : 'z-0'
                    }`}
                    style={{
                      left: `${mediaTrans.x}%`,
                      top: `${mediaTrans.y}%`,
                      width: `${mediaTrans.width}%`,
                      height: `${mediaTrans.height}%`,
                      zIndex: mediaTrans.zIndex || 1,
                      overflow: 'visible'
                    }}
                  >
                    <div 
                      className="relative w-full h-full overflow-hidden rounded-lg"
                      style={{ background: chromaKey?.enabled ? 'transparent' : '#000000' }}
                    >
                      {isImageMedia(activeMediaUrl) ? (
                        <img 
                          key={activeMediaUrl}
                          src={activeMediaUrl} 
                          alt="Stage BG"
                          className="w-full h-full object-cover pointer-events-none"
                          style={chromaStyle}
                        />
                      ) : (
                        <video 
                          key={activeMediaUrl || 'default_bg'}
                          ref={el => {
                            if (el) {
                              if (isStageMediaPaused) el.pause();
                              else el.play().catch(() => {});
                            }
                          }}
                          src={activeMediaUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'} 
                          autoPlay={!isStageMediaPaused} 
                          loop 
                          muted 
                          playsInline 
                          onCanPlay={(e) => { if (!isStageMediaPaused) e.target.play().catch(() => {}); }}
                          className="w-full h-full object-cover pointer-events-none"
                          style={chromaStyle}
                        />
                      )}

                      {isSelected && (
                        <span className="absolute bottom-1 right-1 bg-black/80 text-cyan-300 text-[8px] font-black px-1.5 py-0.2 rounded border border-cyan-500/40 pointer-events-none">
                          🎥 Nền Chính
                        </span>
                      )}
                    </div>

                    {/* Nút Xóa Khung, Tách Nền AI và Tải Cho Nền Chính */}
                    {isSelected && (
                      <div className="absolute -top-3.5 left-0 right-0 flex items-center justify-between px-1 z-50 pointer-events-auto">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              pushUndoSnapshot();
                              handleDeleteLayerFromStep(currentStep.id, 'main_media');
                            }}
                            className="px-2 py-0.5 bg-rose-600 hover:bg-rose-500 text-white rounded-full shadow-2xl cursor-pointer flex items-center gap-1 border border-white text-[9px] font-black active:scale-95"
                            title="Xóa Khung Video/Ảnh Nền Chính (Ctrl + Z để hoàn tác)"
                          >
                            <Trash2 size={10} />
                            <span>Xóa Khung</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              pushUndoSnapshot();
                              handleInstantCanvasBgRemoval('main_media', null, 'auto');
                            }}
                            className="px-2 py-0.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white rounded-full shadow-2xl cursor-pointer flex items-center gap-1 border border-white text-[9px] font-black active:scale-95"
                            title="Tách sạch sẽ phông nền AI (giữ nguyên chủ thể 100%)"
                          >
                            <Wand2 size={10} />
                            <span>Tách Nền AI</span>
                          </button>
                        </div>

                        <label 
                          onClick={(e) => e.stopPropagation()}
                          className="px-2 py-0.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-2xl cursor-pointer flex items-center gap-1 border border-white text-[9px] font-black active:scale-95" 
                          title="Tải Video hoặc Ảnh Nền từ máy tính"
                        >
                          <Upload size={9} />
                          <span>Tải Nền</span>
                          <input 
                            type="file" 
                            accept="video/*,image/*" 
                            onChange={(e) => {
                              pushUndoSnapshot();
                              handleDirectMediaUpload(currentStep.id, 'mediaUrl', e);
                            }}
                            className="hidden" 
                          />
                        </label>
                      </div>
                    )}

                    {/* 8 Điểm Resize Handles Khi Được Chọn */}
                    {isSelected && (
                      <>
                        <div onMouseDown={(e) => handlePointerDown(e, 'main_media', null, 'nw')} onTouchStart={(e) => handlePointerDown(e, 'main_media', null, 'nw')} className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-cyan-400 rounded-full cursor-nw-resize z-50 shadow-md border border-white" />
                        <div onMouseDown={(e) => handlePointerDown(e, 'main_media', null, 'ne')} onTouchStart={(e) => handlePointerDown(e, 'main_media', null, 'ne')} className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-cyan-400 rounded-full cursor-ne-resize z-50 shadow-md border border-white" />
                        <div onMouseDown={(e) => handlePointerDown(e, 'main_media', null, 'sw')} onTouchStart={(e) => handlePointerDown(e, 'main_media', null, 'sw')} className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-cyan-400 rounded-full cursor-sw-resize z-50 shadow-md border border-white" />
                        <div onMouseDown={(e) => handlePointerDown(e, 'main_media', null, 'se')} onTouchStart={(e) => handlePointerDown(e, 'main_media', null, 'se')} className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-cyan-400 rounded-full cursor-se-resize z-50 shadow-md border border-white" />
                        <div onMouseDown={(e) => handlePointerDown(e, 'main_media', null, 'n')} onTouchStart={(e) => handlePointerDown(e, 'main_media', null, 'n')} className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-cyan-400 rounded-full cursor-n-resize z-50 shadow-md border border-white" />
                        <div onMouseDown={(e) => handlePointerDown(e, 'main_media', null, 's')} onTouchStart={(e) => handlePointerDown(e, 'main_media', null, 's')} className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-cyan-400 rounded-full cursor-s-resize z-50 shadow-md border border-white" />
                        <div onMouseDown={(e) => handlePointerDown(e, 'main_media', null, 'w')} onTouchStart={(e) => handlePointerDown(e, 'main_media', null, 'w')} className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 bg-cyan-400 rounded-full cursor-w-resize z-50 shadow-md border border-white" />
                        <div onMouseDown={(e) => handlePointerDown(e, 'main_media', null, 'e')} onTouchStart={(e) => handlePointerDown(e, 'main_media', null, 'e')} className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-cyan-400 rounded-full cursor-e-resize z-50 shadow-md border border-white" />
                      </>
                    )}
                  </div>
                );
              })()}

              {/* Lớp 1.5: Video Phụ PiP (Picture-in-Picture) - Có Nút Xóa Khung, Tách Nền & Tải PiP */}
              {activeSecondaryMediaUrl && (() => {
                const pipTrans = getLayerCurrentTransform('pip');
                const isSelected = selectedLayer.type === 'pip';
                const chromaStyle = getLayerChromaStyle('pip');
                const chromaKey = currentStep?.secondaryMediaChromaKey;

                return (
                  <div 
                    onMouseDown={(e) => handlePointerDown(e, 'pip', null, null)}
                    onTouchStart={(e) => handlePointerDown(e, 'pip', null, null)}
                    className={`absolute rounded-xl shadow-2xl transition-shadow cursor-move ${
                      isSelected ? 'ring-2 ring-indigo-400 border-2 border-indigo-400 z-20' : 'border border-indigo-500/50'
                    }`}
                    style={{
                      left: `${pipTrans.x}%`,
                      top: `${pipTrans.y}%`,
                      width: `${pipTrans.width}%`,
                      height: `${pipTrans.height}%`,
                      zIndex: pipTrans.zIndex || 20,
                      overflow: 'visible'
                    }}
                  >
                    <div 
                      className="relative w-full h-full rounded-xl overflow-hidden"
                      style={{ background: chromaKey?.enabled ? 'transparent' : '#000000' }}
                    >
                      {isImageMedia(activeSecondaryMediaUrl) ? (
                        <img 
                          src={activeSecondaryMediaUrl} 
                          alt="PiP Media" 
                          className="w-full h-full object-cover pointer-events-none"
                          style={chromaStyle}
                        />
                      ) : (
                        <video 
                          ref={el => {
                            if (el) {
                              if (isStageMediaPaused) el.pause();
                              else el.play().catch(() => {});
                            }
                          }}
                          src={activeSecondaryMediaUrl} 
                          autoPlay={!isStageMediaPaused} 
                          loop 
                          muted 
                          playsInline 
                          onCanPlay={(e) => { if (!isStageMediaPaused) e.target.play().catch(() => {}); }}
                          className="w-full h-full object-cover pointer-events-none"
                          style={chromaStyle}
                        />
                      )}
                      <span className="absolute bottom-1 right-1 bg-indigo-600/90 text-white text-[8px] font-black px-1.5 py-0.2 rounded">
                        🎬 PiP
                      </span>
                    </div>

                    {/* Nút Xóa Khung, Tách Nền AI và Tải Cho PiP */}
                    {isSelected && (
                      <div className="absolute -top-3.5 left-0 right-0 flex items-center justify-between px-1 z-50 pointer-events-auto">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              pushUndoSnapshot();
                              handleDeleteLayerFromStep(currentStep.id, 'pip');
                            }}
                            className="px-2 py-0.5 bg-rose-600 hover:bg-rose-500 text-white rounded-full shadow-2xl cursor-pointer flex items-center gap-1 border border-white text-[9px] font-black active:scale-95"
                            title="Xóa Khung Video/Ảnh PiP (Ctrl + Z để hoàn tác)"
                          >
                            <Trash2 size={10} />
                            <span>Xóa Khung</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              pushUndoSnapshot();
                              handleInstantCanvasBgRemoval('pip', null, 'auto');
                            }}
                            className="px-2 py-0.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white rounded-full shadow-2xl cursor-pointer flex items-center gap-1 border border-white text-[9px] font-black active:scale-95"
                            title="Tách sạch sẽ phông nền AI của PiP"
                          >
                            <Wand2 size={10} />
                            <span>Tách Nền AI</span>
                          </button>
                        </div>

                        <label 
                          onClick={(e) => e.stopPropagation()}
                          className="px-2 py-0.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-2xl cursor-pointer flex items-center gap-1 border border-white text-[9px] font-black active:scale-95" 
                          title="Tải Video hoặc Ảnh PiP từ máy tính"
                        >
                          <Upload size={9} />
                          <span>Tải PiP</span>
                          <input 
                            type="file" 
                            accept="video/*,image/*" 
                            onChange={(e) => {
                              pushUndoSnapshot();
                              handleDirectMediaUpload(currentStep.id, 'secondaryMediaUrl', e);
                            }}
                            className="hidden" 
                          />
                        </label>
                      </div>
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

              {/* Lớp 2: 1 Đến 4 Avatar AI (Interactive Drag & 8-Point Resize Handles & Direct Stage Upload & Xóa Khung / Tách Nền AI) */}
              {visibleAvatars.map((av, avIdx) => {
                const isCurrentSpeaker = (currentStep?.avatarSpeaker === av.id) || (currentStep?.avatarSpeaker === 'all') || (!currentStep?.avatarSpeaker && avIdx === 0);
                const transform = getLayerCurrentTransform('avatar', av.id);
                const vidSrc = isCurrentSpeaker ? (av.talkVideo || av.idleVideo || activeMediaUrl) : (av.idleVideo || av.talkVideo || activeMediaUrl);
                const chromaStyle = getLayerChromaStyle('avatar', av.id);
                const isSelected = selectedLayer.type === 'avatar' && selectedLayer.id === av.id;

                return (
                  <div 
                    key={av.id}
                    onMouseDown={(e) => handlePointerDown(e, 'avatar', av.id, null)}
                    onTouchStart={(e) => handlePointerDown(e, 'avatar', av.id, null)}
                    className={`absolute transition-shadow cursor-move ${
                      isSelected 
                        ? 'ring-2 ring-cyan-400 shadow-xl shadow-cyan-500/30 z-20' 
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
                    <div 
                      className="relative w-full h-full rounded-[16px] overflow-hidden"
                      style={{ background: av?.chromaKey?.enabled ? 'transparent' : '#000000' }}
                    >
                      {vidSrc && isImageMedia(vidSrc) ? (
                        <img 
                          src={vidSrc} 
                          alt={av.name} 
                          className="w-full h-full object-cover pointer-events-none"
                          style={chromaStyle}
                        />
                      ) : (
                        <video 
                          ref={el => {
                            if (el) {
                              if (isStageMediaPaused) el.pause();
                              else el.play().catch(() => {});
                            }
                          }}
                          src={vidSrc || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'} 
                          autoPlay={!isStageMediaPaused} 
                          loop 
                          muted 
                          playsInline 
                          onCanPlay={(e) => { if (!isStageMediaPaused) e.target.play().catch(() => {}); }}
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

                    {/* Nút Xóa Khung, Tách Nền AI và Tải Cho Avatar */}
                    {isSelected && (
                      <div className="absolute -top-3.5 left-0 right-0 flex items-center justify-between px-1 z-50 pointer-events-auto">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              pushUndoSnapshot();
                              handleDeleteAvatarLayer(av.id);
                            }}
                            className="px-2 py-0.5 bg-rose-600 hover:bg-rose-500 text-white rounded-full shadow-2xl cursor-pointer flex items-center gap-1 border border-white text-[9px] font-black active:scale-95"
                            title="Xóa Khung Nhân Vật Khỏi Sân Khấu (Ctrl + Z để hoàn tác)"
                          >
                            <Trash2 size={10} />
                            <span>Xóa Khung</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              pushUndoSnapshot();
                              handleInstantCanvasBgRemoval('avatar', av.id, 'auto');
                            }}
                            className="px-2 py-0.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white rounded-full shadow-2xl cursor-pointer flex items-center gap-1 border border-white text-[9px] font-black active:scale-95"
                            title="Tách sạch sẽ phông nền AI của Avatar (giữ nguyên người 100%)"
                          >
                            <Wand2 size={10} />
                            <span>Tách Nền AI</span>
                          </button>
                        </div>

                        <label 
                          onClick={(e) => e.stopPropagation()}
                          className="px-2 py-0.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-2xl cursor-pointer flex items-center gap-1 border border-white text-[9px] font-black active:scale-95" 
                          title="Tải Video hoặc Ảnh cho Avatar này"
                        >
                          <Upload size={9} />
                          <span>Tải Avatar</span>
                          <input 
                            type="file" 
                            accept="video/*,image/*" 
                            onChange={(e) => {
                              pushUndoSnapshot();
                              handleDirectAvatarMediaUpload(av.id, e);
                            }}
                            className="hidden" 
                          />
                        </label>
                      </div>
                    )}

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

              {/* Lớp 3: Banner Hình Ảnh / Poster Deal - Có Nút Xóa Khung, Tách Nền & Tải Banner */}
              {activeOverlayImage && (() => {
                const bannerTrans = getLayerCurrentTransform('banner');
                const isSelected = selectedLayer.type === 'banner';
                const chromaStyle = getLayerChromaStyle('banner');
                const chromaKey = currentStep?.overlayImageChromaKey;

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
                      zIndex: bannerTrans.zIndex || 25,
                      overflow: 'visible'
                    }}
                  >
                    <img 
                      src={activeOverlayImage} 
                      alt="Overlay Banner" 
                      className="w-full h-full object-contain drop-shadow-xl pointer-events-none rounded-lg"
                      style={chromaStyle}
                    />

                    {/* Nút Xóa Khung, Tách Nền AI và Tải Cho Banner */}
                    {isSelected && (
                      <div className="absolute -top-3.5 left-0 right-0 flex items-center justify-between px-1 z-50 pointer-events-auto">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              pushUndoSnapshot();
                              handleDeleteLayerFromStep(currentStep.id, 'banner');
                            }}
                            className="px-2 py-0.5 bg-rose-600 hover:bg-rose-500 text-white rounded-full shadow-2xl cursor-pointer flex items-center gap-1 border border-white text-[9px] font-black active:scale-95"
                            title="Xóa Khung Ảnh Banner (Ctrl + Z để hoàn tác)"
                          >
                            <Trash2 size={10} />
                            <span>Xóa Khung</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              pushUndoSnapshot();
                              handleInstantCanvasBgRemoval('banner', null, 'auto');
                            }}
                            className="px-2 py-0.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white rounded-full shadow-2xl cursor-pointer flex items-center gap-1 border border-white text-[9px] font-black active:scale-95"
                            title="Tách sạch sẽ phông nền AI của Banner"
                          >
                            <Wand2 size={10} />
                            <span>Tách Nền AI</span>
                          </button>
                        </div>

                        <label 
                          onClick={(e) => e.stopPropagation()}
                          className="px-2 py-0.5 bg-amber-600 hover:bg-amber-500 text-white rounded-full shadow-2xl cursor-pointer flex items-center gap-1 border border-white text-[9px] font-black active:scale-95" 
                          title="Tải Ảnh mới cho Banner này"
                        >
                          <Upload size={9} />
                          <span>Tải Banner</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => {
                              pushUndoSnapshot();
                              handleDirectLayerUpload('banner', null, e);
                            }}
                            className="hidden" 
                          />
                        </label>
                      </div>
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

              {/* Lớp 4: Tiêu Đề Chữ Typography Xếp Chồng - Có Nút Xóa Khung */}
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

                    {/* Nút Xóa Khung Chữ Khi Chọn */}
                    {isSelected && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          pushUndoSnapshot();
                          handleDeleteLayerFromStep(currentStep.id, 'text');
                        }}
                        className="absolute -top-3 left-1 px-2 py-0.5 bg-rose-600 hover:bg-rose-500 text-white rounded-full shadow-2xl z-50 cursor-pointer flex items-center gap-1 border border-white text-[9px] font-black active:scale-95"
                        title="Xóa Khung Chữ Tiêu Đề (Ctrl + Z để hoàn tác)"
                      >
                        <Trash2 size={10} />
                        <span>Xóa Khung</span>
                      </button>
                    )}

                    {/* Floating Toolbar Cho Text: Sắp Xếp Lớp Lên / Xuống & Cỡ Chữ */}
                    {isSelected && (
                      <div 
                        className="absolute -bottom-11 left-1/2 -translate-x-1/2 flex items-center gap-1 z-50 bg-slate-950/95 backdrop-blur-md px-2 py-1 rounded-xl border border-rose-400 shadow-2xl whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={handleLayerBringForward}
                          className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-slate-800 hover:bg-slate-700 text-cyan-300 cursor-pointer"
                          title="Đưa lớp chữ lên trên 1 tầng"
                        >
                          🔼 Lên
                        </button>
                        <button
                          type="button"
                          onClick={handleLayerSendBackward}
                          className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-slate-800 hover:bg-slate-700 text-amber-300 cursor-pointer"
                          title="Đưa lớp chữ xuống dưới 1 tầng"
                        >
                          🔽 Xuống
                        </button>
                        <button
                          type="button"
                          onClick={handleLayerBringToFront}
                          className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-slate-800 hover:bg-slate-700 text-purple-300 cursor-pointer"
                          title="Đưa lớp chữ lên đỉnh cao nhất"
                        >
                          🔝 Đỉnh
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteLayerFromStep(currentStep.id, 'text')}
                          className="px-1.5 py-0.5 rounded-lg text-[9px] font-black bg-rose-950/80 hover:bg-rose-900 text-rose-300 hover:text-white border border-rose-600/40 flex items-center gap-0.5 cursor-pointer"
                        >
                          <Trash2 size={10} />
                          <span>Xóa</span>
                        </button>
                      </div>
                    )}

                    {/* 8 Điểm Resize Handles Co Giãn 4 Chiều (8 Hướng) Khi Chọn Text */}
                    {isSelected && (
                      <>
                        <div onMouseDown={(e) => handlePointerDown(e, 'text', null, 'nw')} onTouchStart={(e) => handlePointerDown(e, 'text', null, 'nw')} className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-rose-400 rounded-full cursor-nw-resize z-50 shadow-md border border-white" />
                        <div onMouseDown={(e) => handlePointerDown(e, 'text', null, 'ne')} onTouchStart={(e) => handlePointerDown(e, 'text', null, 'ne')} className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-rose-400 rounded-full cursor-ne-resize z-50 shadow-md border border-white" />
                        <div onMouseDown={(e) => handlePointerDown(e, 'text', null, 'sw')} onTouchStart={(e) => handlePointerDown(e, 'text', null, 'sw')} className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-rose-400 rounded-full cursor-sw-resize z-50 shadow-md border border-white" />
                        <div onMouseDown={(e) => handlePointerDown(e, 'text', null, 'se')} onTouchStart={(e) => handlePointerDown(e, 'text', null, 'se')} className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-rose-400 rounded-full cursor-se-resize z-50 shadow-md border border-white" />
                        <div onMouseDown={(e) => handlePointerDown(e, 'text', null, 'n')} onTouchStart={(e) => handlePointerDown(e, 'text', null, 'n')} className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-rose-400 rounded-full cursor-n-resize z-50 shadow-md border border-white" />
                        <div onMouseDown={(e) => handlePointerDown(e, 'text', null, 's')} onTouchStart={(e) => handlePointerDown(e, 'text', null, 's')} className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-rose-400 rounded-full cursor-s-resize z-50 shadow-md border border-white" />
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

          {/* 🌟 THANH THAO TÁC CĂN CHỈNH VỊ TRÍ GỌN GÀNG ĐÚNG 1 HÀNG DUY NHẤT (ẢNH 2 & ẢNH 5) */}
          <div className="pt-1 mt-1 border-t border-indigo-900/40 shrink-0">
            <div className="flex items-center justify-between gap-0.5 py-0.5 w-full">
              
              {/* 5 Nút Thao Tác Chuẩn 1 Hàng */}
              <div className="flex items-center gap-0.5 flex-1 min-w-0">
                <button
                  type="button"
                  onClick={() => handleApplyPresetLayout('sales_duo')}
                  className="px-1.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-cyan-300 font-black text-[9px] border border-slate-700 cursor-pointer flex items-center justify-center gap-0.5 whitespace-nowrap shadow-xs"
                  title="Bố cục 2 người bán hàng"
                >
                  🛍️ Bán
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPresetLayout('game_pk')}
                  className="px-1.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-purple-300 font-black text-[9px] border border-slate-700 cursor-pointer flex items-center justify-center gap-0.5 whitespace-nowrap shadow-xs"
                  title="Bố cục PK đối kháng"
                >
                  ⚔️ PK
                </button>
                <button
                  type="button"
                  onClick={handleCenterSelectedLayer}
                  className="px-1.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-emerald-300 font-black text-[9px] border border-slate-700 cursor-pointer flex items-center justify-center gap-0.5 whitespace-nowrap shadow-xs"
                  title="Căn giữa đối tượng đang chọn"
                >
                  <Scaling size={9.5} /> Giữa
                </button>
                <button
                  type="button"
                  onClick={handleFillSelectedLayer}
                  className="px-1.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-blue-300 font-black text-[9px] border border-slate-700 cursor-pointer flex items-center justify-center gap-0.5 whitespace-nowrap shadow-xs"
                  title="Tràn toàn khung hình sân khấu"
                >
                  <Maximize2 size={9.5} /> Tràn
                </button>
                <button
                  type="button"
                  onClick={handleApplyLayoutToAllSteps}
                  className="px-1.5 py-1 rounded-md bg-indigo-900/90 hover:bg-indigo-800 text-amber-300 font-black text-[9px] border border-amber-400/40 cursor-pointer flex items-center justify-center gap-0.5 whitespace-nowrap shadow-xs"
                  title="Khóa và áp dụng vị trí hiện tại cho toàn bộ các bước"
                >
                  <Lock size={9.5} /> Khóa
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const next = !isStageMediaPaused;
                    setIsStageMediaPaused(next);
                    toast.info(next ? '⏸️ Đã DỪNG tất cả video trên Sân Khấu' : '▶️ Đã TIẾP TỤC phát tất cả video');
                  }}
                  className={`px-1.5 py-1 rounded-md font-black text-[9px] border cursor-pointer flex items-center justify-center gap-0.5 whitespace-nowrap shadow-xs ${
                    isStageMediaPaused 
                      ? 'bg-amber-950 hover:bg-amber-900 text-amber-300 border-amber-500/60 animate-pulse' 
                      : 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border-slate-700'
                  }`}
                  title="Tắt/Mở (Dừng/Phát) tất cả video trên Sân Khấu"
                >
                  {isStageMediaPaused ? <Play size={9.5} className="fill-amber-300" /> : <Square size={9.5} className="fill-cyan-300" />}
                  <span>{isStageMediaPaused ? 'Phát' : 'Dừng'}</span>
                </button>
              </div>

              {/* Thông tin Avatar đang nói (Rút gọn) */}
              <div className="text-[9px] font-black text-indigo-300 truncate shrink-0 bg-slate-900/90 px-1.5 py-1 rounded-md border border-slate-800" title={`Nhân vật nói: ${currentStep?.avatarSpeaker?.toUpperCase() || 'AVATAR_1'}`}>
                🗣️ AV{currentStep?.avatarSpeaker?.replace(/[^0-9]/g, '') || '1'}
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
                      ? 'bg-blue-950/60 border-blue-400 shadow-2xl ring-2 ring-blue-400/50' 
                      : isSelected
                      ? 'bg-slate-900/95 border-cyan-400 shadow-2xl ring-2 ring-cyan-500/40'
                      : 'bg-slate-800/40 border-slate-700/70 hover:border-slate-600 shadow-xs'
                  }`}
                >
                  {/* HEADER CỦA BƯỚC: BỐ CỤC CHUẨN ĐẸP, TÁCH BIỆT 100%, KHÔNG BỊ CHỒNG CHÉO */}
                  <div className={`p-2.5 border-b flex flex-col xl:flex-row xl:items-center xl:justify-between gap-2.5 transition-colors ${
                    isSelected ? 'bg-cyan-950/50 border-cyan-500/40' : 'bg-slate-800/90 border-slate-700/80'
                  }`}>
                    
                    {/* Hàng 1 / Nhóm Trái: Số bước, Tiêu đề, Phân loại tác vụ & Badge Sân Khấu 9:16 */}
                    <div className="flex items-center gap-2 flex-1 min-w-0 flex-wrap">
                      <div className={`w-6 h-6 rounded-lg font-black text-xs flex items-center justify-center shrink-0 ${
                        isCurrentExecuting 
                          ? 'bg-cyan-400 text-black animate-bounce' 
                          : isSelected
                          ? 'bg-cyan-500 text-black font-black'
                          : 'bg-indigo-600 text-white shadow-xs'
                      }`}>
                        {idx + 1}
                      </div>

                      <input 
                        type="text"
                        value={step.title}
                        onChange={(e) => handleUpdateStep(step.id, 'title', e.target.value)}
                        className="font-black text-xs text-white bg-transparent border-b border-transparent hover:border-slate-500 focus:border-cyan-500 focus:bg-slate-900 px-1 py-0.5 rounded outline-none transition-all flex-1 min-w-[120px]"
                      />

                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${actionConfig.bg} ${actionConfig.color} shrink-0`}>
                        <ActionIcon size={10} />
                        <span>{actionConfig.label.split(' ')[1] || 'Tác vụ'}</span>
                      </span>

                      {isSelected && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                          <span>SÂN KHẤU 9:16</span>
                        </span>
                      )}
                    </div>

                    {/* Hàng 2 / Nhóm Phải: Phân Vai Avatar Nói, Thời lượng, Xem & Nút Thao Tác */}
                    <div className="flex items-center gap-1.5 flex-wrap shrink-0 justify-start xl:justify-end" onClick={(e) => e.stopPropagation()}>
                      
                      <select
                        value={step.avatarSpeaker || 'avatar_1'}
                        onChange={(e) => handleUpdateStep(step.id, 'avatarSpeaker', e.target.value)}
                        className="bg-slate-900 text-cyan-300 text-[11px] font-bold px-2 py-1 rounded-lg border border-cyan-500/40 outline-none cursor-pointer shrink-0"
                        title="Chọn nhân vật đọc lời thoại và xuất hiện ở bước này"
                      >
                        <option value="avatar_1">🗣️ Nhân Vật 1 (Idol)</option>
                        <option value="avatar_2">🗣️ Nhân Vật 2 (Quản Lý)</option>
                        <option value="avatar_3">🗣️ Nhân Vật 3 (BLV Game)</option>
                        <option value="avatar_4">🗣️ Nhân Vật 4 (Khán Giả)</option>
                        <option value="avatar_5">🗣️ Nhân Vật 5 (Cố Vấn / Khách Mời)</option>
                        <option value="all">👥 Cả Nhóm Cùng Nói</option>
                      </select>

                      {/* Chức năng Thời Lượng: Mặc Định (Theo Kịch Bản) vs Cố Định Số Giây */}
                      <div className="flex items-center gap-1.5 bg-slate-900 px-2 py-1 rounded-lg border border-slate-700 text-[11px] shrink-0">
                        <label className="flex items-center gap-1 cursor-pointer select-none" title="Mặc định: Tự động chuyển bước khi AI đọc hết kịch bản (không dựa vào số giây)">
                          <input 
                            type="checkbox"
                            checked={step.isScriptDuration || step.durationMode === 'auto_script'}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              handleUpdateStep(step.id, 'isScriptDuration', checked);
                              handleUpdateStep(step.id, 'durationMode', checked ? 'auto_script' : 'fixed_seconds');
                              toast.info(checked ? `🎙️ Bước ${idx + 1}: MẶC ĐỊNH THEO KỊCH BẢN (Hết lời thoại sẽ tự chuyển bước)` : `⏱️ Bước ${idx + 1}: CỐ ĐỊNH SỐ GIÂY`);
                            }}
                            className="w-3.5 h-3.5 rounded accent-cyan-400 cursor-pointer"
                          />
                          <span className={`text-[10px] font-black ${ (step.isScriptDuration || step.durationMode === 'auto_script') ? 'text-cyan-300' : 'text-gray-400' }`}>
                            Mặc định
                          </span>
                        </label>

                        {!(step.isScriptDuration || step.durationMode === 'auto_script') && (
                          <div className="flex items-center gap-1 border-l border-slate-700 pl-1.5">
                            <Clock size={11} className="text-amber-400" />
                            <input 
                              type="number"
                              value={step.durationSeconds || 60}
                              onChange={(e) => handleUpdateStep(step.id, 'durationSeconds', parseInt(e.target.value) || 30)}
                              className="w-8 bg-transparent text-white font-mono font-bold text-center outline-none"
                              min="3"
                              max="3600"
                            />
                            <span className="text-gray-400 text-[10px]">s</span>
                          </div>
                        )}
                      </div>

                      {/* Nút Xem Bước Này */}
                      <button
                        type="button"
                        onClick={() => {
                          stopVoiceAudio();
                          setIsSpeakingPreview(false);
                          setSpeakingStepId(null);
                          setCurrentStepIndex(idx);
                          setSecondsRemaining(step.durationSeconds || 60);
                          syncStepToServer(step, idx, false);
                          toast.success(`👁️ Đang hiển thị Bước ${idx + 1} trên Sân khấu 9:16! (Chỉ hiển thị hình ảnh/video, không tự phát giọng)`);
                        }}
                        className={`px-2.5 py-1 text-white font-black text-[10px] rounded-lg shadow-xs flex items-center gap-1 cursor-pointer transition-all ${
                          isSelected 
                            ? 'bg-cyan-500 text-black font-black ring-1 ring-white' 
                            : 'bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500'
                        }`}
                        title="Xem trước bố cục & media bước này trên Sân Khấu 9:16 (Không phát voice)"
                      >
                        <Eye size={12} />
                        <span>{isSelected ? 'Đang Xem' : 'Xem Bước Này'}</span>
                      </button>

                      {/* Nút Cài Đặt Chi Tiết */}
                      <button
                        type="button"
                        onClick={() => setExpandedStepId(isExpanded ? null : step.id)}
                        className={`px-2.5 py-1 text-[11px] font-black rounded-lg border flex items-center gap-1 cursor-pointer transition-all ${
                          isExpanded 
                            ? 'bg-indigo-600 text-white border-indigo-400 shadow-md' 
                            : 'bg-slate-900 hover:bg-slate-800 text-cyan-300 border-slate-700'
                        }`}
                        title="Mở rộng / Thu gọn cấu hình chi tiết của bước này"
                      >
                        <Sliders size={12} />
                        <span>Cài Đặt</span>
                        {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      </button>

                      {/* Nút Nhân Bản */}
                      <button
                        type="button"
                        onClick={() => handleDuplicateStep(step)}
                        className="p-1 text-gray-400 hover:text-indigo-300 rounded bg-slate-900 border border-slate-700 cursor-pointer"
                        title="Nhân bản bước này"
                      >
                        <Copy size={12} />
                      </button>

                      {/* Nút Xóa Bước Này (Màu đỏ nổi bật, hiển thị 100%) */}
                      <button
                        type="button"
                        onClick={() => handleDeleteStep(step.id)}
                        className="px-2 py-1 text-rose-300 hover:text-white rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-600/50 flex items-center gap-1 cursor-pointer font-bold text-[10px] transition-all shadow-xs"
                        title="Xóa bước này khỏi kịch bản"
                      >
                        <Trash2 size={12} className="text-rose-400" />
                        <span>Xóa</span>
                      </button>
                    </div>

                  </div>

                  {/* NỘI DUNG CHÍNH: KHUNG KỊCH BẢN & LỜI THOẠI AI NẰM RIÊNG (TO GẤP 3 LẦN) */}
                  <div className="p-3 space-y-2">
                    
                    <div className="bg-slate-950/80 p-3 rounded-xl border border-indigo-900/50 space-y-2">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="text-xs font-black uppercase text-cyan-300 flex items-center gap-1.5">
                          <FileText size={13} className="text-cyan-400" />
                          <span>Lời Thoại & Giọng Đọc AI (Kịch Bản):</span>
                        </span>

                        <div className="flex items-center gap-2 flex-wrap" onClick={(e) => e.stopPropagation()}>
                          
                          {/* Bộ Chọn Giọng Đọc Voice AI Brain */}
                          <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-lg border border-purple-500/40">
                            <Mic size={12} className="text-purple-400 shrink-0" />
                            <select
                              value={step.voiceId || 'brain_auto'}
                              onChange={(e) => handleUpdateStep(step.id, 'voiceId', e.target.value)}
                              className="bg-transparent text-purple-300 text-xs font-bold outline-none cursor-pointer max-w-[160px] sm:max-w-[240px] truncate"
                              title="Chọn giọng đọc AI cho nhân vật ở bước này"
                            >
                              <option value="brain_auto" className="bg-slate-900 text-amber-300 font-bold">
                                🧠 Giọng Bộ Não Voice AI (Tự Động Theo Nhân Vật)
                              </option>

                              {categorizedVoiceList.vipVoices.length > 0 && (
                                <optgroup label="👑 Top Bán Hàng & MC Livestream VIP" className="bg-slate-900 text-amber-400 font-bold">
                                  {categorizedVoiceList.vipVoices.map(v => (
                                    <option key={v.id} value={v.id} className="bg-slate-900 text-white font-normal">
                                      {v.name}
                                    </option>
                                  ))}
                                </optgroup>
                              )}

                              {categorizedVoiceList.femaleVoices.length > 0 && (
                                <optgroup label="🌸 Giọng Nữ Tiếng Việt (Bắc - Trung - Nam)" className="bg-slate-900 text-pink-400 font-bold">
                                  {categorizedVoiceList.femaleVoices.map(v => (
                                    <option key={v.id} value={v.id} className="bg-slate-900 text-white font-normal">
                                      {v.name}
                                    </option>
                                  ))}
                                </optgroup>
                              )}

                              {categorizedVoiceList.maleVoices.length > 0 && (
                                <optgroup label="🎙️ Giọng Nam Tiếng Việt (Bắc - Trung - Nam)" className="bg-slate-900 text-cyan-400 font-bold">
                                  {categorizedVoiceList.maleVoices.map(v => (
                                    <option key={v.id} value={v.id} className="bg-slate-900 text-white font-normal">
                                      {v.name}
                                    </option>
                                  ))}
                                </optgroup>
                              )}

                              {categorizedVoiceList.otherVoices.length > 0 && (
                                <optgroup label="🌐 Giọng Đa Ngôn Ngữ & Quốc Tế" className="bg-slate-900 text-indigo-400 font-bold">
                                  {categorizedVoiceList.otherVoices.map(v => (
                                    <option key={v.id} value={v.id} className="bg-slate-900 text-white font-normal">
                                      {v.name}
                                    </option>
                                  ))}
                                </optgroup>
                              )}
                            </select>
                          </div>

                          {/* Badge Giọng Bộ Não */}
                          {(!step.voiceId || step.voiceId === 'brain_auto') && (
                            <span className="text-[10px] font-bold text-amber-300 bg-amber-950/70 px-2 py-1 rounded-md border border-amber-500/30 truncate max-w-[150px]" title="Giọng mặc định lấy trực tiếp từ Cấu hình Bộ Não Voice AI">
                              🧠 {(getBrainVoiceNameForSpeaker(step.avatarSpeaker) || 'Hoài My').split(' ')[0]}
                            </span>
                          )}

                          {/* 🔊 1 NÚT DUY NHẤT: ĐỌC THỬ VOICE / DỪNG ĐỌC */}
                          <button
                            type="button"
                            onClick={() => handleTestVoiceSpeech(step.id, step.scriptText, step.voiceId, step.avatarSpeaker)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-md transition-all ${
                              speakingStepId === step.id 
                                ? 'bg-rose-600 text-white animate-pulse ring-2 ring-rose-300' 
                                : 'bg-gradient-to-r from-indigo-700 to-cyan-700 hover:from-indigo-600 hover:to-cyan-600 text-white border border-cyan-500/40'
                            }`}
                            title="Nghe thử giọng đọc AI cho đoạn này từ Bộ Não Voice AI"
                          >
                            {speakingStepId === step.id ? (
                              <>
                                <Square size={12} className="fill-white" />
                                <span>Dừng Đọc</span>
                                <span className="text-xs text-yellow-300 animate-bounce"> ▂▃▅</span>
                              </>
                            ) : (
                              <>
                                <Volume2 size={13} />
                                <span>Nghe Thử Voice</span>
                              </>
                            )}
                          </button>

                          <label className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer">
                            <Upload size={12} />
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

                      {/* KHUNG KỊCH BẢN TO GẤP 3 LẦN HIỆN TẠI (DỄ ĐỌC & DỄ NHẬP LIỆU) */}
                      <textarea
                        value={step.scriptText || ''}
                        onChange={(e) => handleUpdateStep(step.id, 'scriptText', e.target.value)}
                        placeholder="Nhập lời thoại của nhân vật / kịch bản AI chi tiết cho bước này hoặc bấm nút Nạp File (.md, .docx, .txt, .pdf)..."
                        rows={6}
                        className="w-full min-h-[140px] bg-slate-900 text-gray-100 text-[13px] p-3 rounded-xl border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none resize-y transition-all font-medium leading-relaxed shadow-inner"
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
