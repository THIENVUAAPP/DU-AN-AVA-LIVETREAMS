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

  // 📡 State Đồng Bộ Ra Sân Khấu Chính (OBS / TikTok Live Studio) — Mặc định luôn TẮT (FALSE), chỉ chạy khi người dùng bấm
  const [isMasterSynced, setIsMasterSynced] = useState(false);

  // Luôn đồng bộ trạng thái nút Sync với event hệ thống khi người dùng bấm bật/tắt
  useEffect(() => {
    const handleSyncStateChange = (e) => {
      if (e.detail && typeof e.detail.isSynced === 'boolean') {
        setIsMasterSynced(e.detail.isSynced);
      }
    };
    window.addEventListener('avalive:master_sync_state_changed', handleSyncStateChange);
    window.addEventListener('avalive:sequencer_sync_disconnected', () => setIsMasterSynced(false));
    return () => {
      window.removeEventListener('avalive:master_sync_state_changed', handleSyncStateChange);
      window.removeEventListener('avalive:sequencer_sync_disconnected', () => setIsMasterSynced(false));
    };
  }, []);


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

  // 🔒 State Khóa / Mở Khóa Sân Khấu (Lock/Unlock Stage Controls)
  const [isStageLocked, setIsStageLocked] = useState(false);

  // ↩️ BỘ NHỚ LỊCH SỬ THAO TÁC (UNDO / REDO SYSTEM)
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  // Refs theo dõi state mới nhất để snapshot và hoàn tác không bị stale closures
  const presetsRef = useRef(presets);
  presetsRef.current = presets;
  const activePresetIdRef = useRef(activePresetId);
  activePresetIdRef.current = activePresetId;
  const multiAvatarConfigRef = useRef(multiAvatarConfig);
  multiAvatarConfigRef.current = multiAvatarConfig;
  const currentStepIndexRef = useRef(currentStepIndex);
  currentStepIndexRef.current = currentStepIndex;
  const isPlayingFlowRef = useRef(isPlayingFlow);
  isPlayingFlowRef.current = isPlayingFlow;
  const isMasterSyncedRef = useRef(isMasterSynced);
  isMasterSyncedRef.current = isMasterSynced;
  const hasPushedDragUndoRef = useRef(false);
  const syncStepToServerRef = useRef(null);
  const activePresetRef = useRef(activePreset);
  activePresetRef.current = activePreset;
  const startStepRef = useRef(null);
  // Refs cho undo/redo stack để tránh stale closure trong useCallback
  const undoStackRef = useRef([]);
  const redoStackRef = useRef([]);
  undoStackRef.current = undoStack;
  redoStackRef.current = redoStack;


  // Hàm lưu snapshot trước khi thực hiện thay đổi (Push state to Undo)
  const pushUndoSnapshot = useCallback(() => {
    const currentPresets = presetsRef.current;
    if (!currentPresets || currentPresets.length === 0) return;
    const snap = {
      presets: JSON.parse(JSON.stringify(currentPresets)),
      activePresetId: activePresetIdRef.current,
      multiAvatarConfig: JSON.parse(JSON.stringify(multiAvatarConfigRef.current || {})),
      currentStepIndex: currentStepIndexRef.current
    };
    setUndoStack(prev => [...prev.slice(-40), snap]);
    setRedoStack([]); // Làm mới redo khi có hành động mới
  }, []);

  const handleUndo = useCallback(() => {
    const stack = undoStackRef.current;
    if (stack.length === 0) {
      toast.info('↩️ Không có thao tác nào để quay lại!');
      return;
    }
    const currentSnap = {
      presets: JSON.parse(JSON.stringify(presetsRef.current || [])),
      activePresetId: activePresetIdRef.current,
      multiAvatarConfig: JSON.parse(JSON.stringify(multiAvatarConfigRef.current || {})),
      currentStepIndex: currentStepIndexRef.current
    };
    const previousSnap = stack[stack.length - 1];
    setUndoStack(prev => prev.slice(0, -1));
    setRedoStack(prev => [...prev.slice(-40), currentSnap]);

    if (previousSnap?.presets) {
      setPresets(previousSnap.presets);
      savePresetsToStorage(previousSnap.presets);
      presetsRef.current = previousSnap.presets;
    }
    if (previousSnap?.multiAvatarConfig) {
      setMultiAvatarConfig(previousSnap.multiAvatarConfig);
      saveMultiAvatarConfig(previousSnap.multiAvatarConfig);
      multiAvatarConfigRef.current = previousSnap.multiAvatarConfig;
    }
    if (previousSnap?.activePresetId) {
      setActivePresetId(previousSnap.activePresetId);
      activePresetIdRef.current = previousSnap.activePresetId;
    }
    if (typeof previousSnap?.currentStepIndex === 'number') {
      setCurrentStepIndex(previousSnap.currentStepIndex);
      currentStepIndexRef.current = previousSnap.currentStepIndex;
    }
    toast.success('↩️ ĐÃ QUAY LẠI THAO TÁC TRƯỚC ĐÓ (Khôi phục thành công)!');

    // Đồng bộ lại ngay lập tức Sân Khấu & Master
    const pr = previousSnap?.presets?.find(x => x.id === (previousSnap?.activePresetId || activePresetIdRef.current));
    const targetIdx = previousSnap?.currentStepIndex ?? currentStepIndexRef.current;
    const st = pr?.steps?.[targetIdx];
    
    window.dispatchEvent(new CustomEvent('avalive:sequencer_undo_redo', {
      detail: {
        presets: previousSnap?.presets,
        activePresetId: previousSnap?.activePresetId,
        currentStepIndex: targetIdx,
        multiAvatarConfig: previousSnap?.multiAvatarConfig,
        step: st
      }
    }));
    
    if (syncStepToServerRef.current && st) {
      syncStepToServerRef.current(st, targetIdx, isPlayingFlowRef.current);
    }
  }, []);

  const handleRedo = useCallback(() => {
    const stack = redoStackRef.current;
    if (stack.length === 0) {
      toast.info('↪️ Không có thao tác nào để tiến tới!');
      return;
    }
    const currentSnap = {
      presets: JSON.parse(JSON.stringify(presetsRef.current || [])),
      activePresetId: activePresetIdRef.current,
      multiAvatarConfig: JSON.parse(JSON.stringify(multiAvatarConfigRef.current || {})),
      currentStepIndex: currentStepIndexRef.current
    };
    const nextSnap = stack[stack.length - 1];
    setRedoStack(prev => prev.slice(0, -1));
    setUndoStack(prev => [...prev.slice(-40), currentSnap]);

    if (nextSnap?.presets) {
      setPresets(nextSnap.presets);
      savePresetsToStorage(nextSnap.presets);
      presetsRef.current = nextSnap.presets;
    }
    if (nextSnap?.multiAvatarConfig) {
      setMultiAvatarConfig(nextSnap.multiAvatarConfig);
      saveMultiAvatarConfig(nextSnap.multiAvatarConfig);
      multiAvatarConfigRef.current = nextSnap.multiAvatarConfig;
    }
    if (nextSnap?.activePresetId) {
      setActivePresetId(nextSnap.activePresetId);
      activePresetIdRef.current = nextSnap.activePresetId;
    }
    if (typeof nextSnap?.currentStepIndex === 'number') {
      setCurrentStepIndex(nextSnap.currentStepIndex);
      currentStepIndexRef.current = nextSnap.currentStepIndex;
    }
    toast.success('↪️ ĐÃ TIẾN TỚI THAO TÁC TIẾP THEO (Khôi phục thành công)!');

    // Đồng bộ lại ngay lập tức Sân Khấu & Master
    const pr = nextSnap?.presets?.find(x => x.id === (nextSnap?.activePresetId || activePresetIdRef.current));
    const targetIdx = nextSnap?.currentStepIndex ?? currentStepIndexRef.current;
    const st = pr?.steps?.[targetIdx];

    window.dispatchEvent(new CustomEvent('avalive:sequencer_undo_redo', {
      detail: {
        presets: nextSnap?.presets,
        activePresetId: nextSnap?.activePresetId,
        currentStepIndex: targetIdx,
        multiAvatarConfig: nextSnap?.multiAvatarConfig,
        step: st
      }
    }));

    if (syncStepToServerRef.current && st) {
      syncStepToServerRef.current(st, targetIdx, isPlayingFlowRef.current);
    }
  }, []);


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
    let mediaUrl = targetStep?.isMainMediaDeleted ? '' : targetStep?.mediaUrl;
    let mainMediaTransform = targetStep?.mainMediaTransform || null;
    let mainMediaChromaKey = targetStep?.mainMediaChromaKey || null;
    if (!targetStep?.isMainMediaDeleted && (!mediaUrl || !mediaUrl.trim())) {
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
    if (!targetStep?.isMainMediaDeleted && (!mediaUrl || !mediaUrl.trim())) {
      mediaUrl = multiAvatarConfig?.backgroundUrl || '';
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
    // 🛡️ CHỈ ĐỒNG BỘ RA SÂN KHẤU CHÍNH KHI NGƯỜI DÙNG BẬT ĐỒNG BỘ (ẢNH 2) HOẶC ĐANG CHẠY KỊCH BẢN
    // TUYỆT ĐỐI KHÔNG TỰ Ý CHẠY HOẶC ĐẨY MEDIA RA SÂN KHẤU CHÍNH KHI NGƯỜI DÙNG CHƯA BẤM!
    if (!isMasterSynced && !isPlayingFlow && !isLivePlaying) {
      return;
    }
    
    const resolved = resolveStepMedia(index);
    const mediaToPlay = resolved.mediaUrl;
    const secondaryToPlay = resolved.secondaryMediaUrl;
    const overlayImgToPlay = resolved.overlayImage;
    const overlayTxtToPlay = resolved.overlayText;

    // 👥 Tạo danh sách Avatar đã phân giải đầy đủ Media, Toạ độ Transform & Trạng thái phát chuẩn 100%
    const safeAvatarsList = (multiAvatarConfig?.avatars && multiAvatarConfig.avatars.length > 0)
      ? multiAvatarConfig.avatars
      : DEFAULT_MULTI_AVATAR_CONFIG.avatars;
    const activeCount = typeof multiAvatarConfig?.activeCount === 'number' ? multiAvatarConfig.activeCount : 1;
    const avatarsList = safeAvatarsList.slice(0, activeCount);

    const syncedAvatars = avatarsList.map((av, avIdx) => {
      const isCurrentSpeaker = (step.avatarSpeaker === av.id) || (step.avatarSpeaker === 'all') || (!step.avatarSpeaker && avIdx === 0);
      const transform = (resolved.avatarTransforms && resolved.avatarTransforms[av.id])
        || (step.avatarTransforms && step.avatarTransforms[av.id]) 
        || av.transform 
        || { x: 5 + avIdx * 24, y: 15, width: 45, height: 75, zIndex: 10 + avIdx };
      const vidSrc = isCurrentSpeaker 
        ? (av.talkVideo || av.idleVideo || mediaToPlay) 
        : (av.idleVideo || av.talkVideo || mediaToPlay);
      return {
        ...av,
        id: av.id,
        name: av.name || `Nhân Vật ${avIdx + 1}`,
        resolvedVidSrc: vidSrc,
        transform,
        chromaKey: (av.chromaKey && av.chromaKey.enabled) ? av.chromaKey : null,
        isSpeakingNow: isCurrentSpeaker && isLivePlaying
      };
    });

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
      syncedAvatars: syncedAvatars,
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
        mainMediaTransform: resolved.mainMediaTransform || null,
        mainMediaChromaKey: resolved.mainMediaChromaKey || null,
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
        syncedAvatars: syncedAvatars,
        timestamp: Date.now()
      });
    } catch (e) {}

    // 2. Custom Events nội bộ — GỬI TOÀN BỘ multiAvatarConfig & syncedAvatars
    // ⚡ Tái hiện 100% nguyên vẹn toàn bộ 5 lớp từ Sân Khấu Phụ sang Sân Khấu Chính
    const syncedConfig = {
      ...(multiAvatarConfig || {}),
      enabled: true,
      activeCount: avatarsList.length,
      avatars: syncedAvatars,
      activeSpeakerId: step.avatarSpeaker || 'avatar_1',
      fromSequencer: true,
      syncedAt: Date.now()
    };

    const fullSyncPayload = {
      ...payload,
      isMainMediaDeleted: !!step.isMainMediaDeleted,
      syncedAvatars: syncedAvatars,
      multiAvatarConfig: syncedConfig
    };

    // Lưu vào localStorage khi người dùng bật đồng bộ
    try {
      if (isMasterSynced) {
        localStorage.setItem('avalive_master_sync_active', 'true');
      }
      if (mediaToPlay && !step.isMainMediaDeleted) {
        localStorage.setItem('avalive_user_locked_media', mediaToPlay);
      } else {
        localStorage.removeItem('avalive_user_locked_media');
      }
      localStorage.setItem('avalive_sequencer_overlay', JSON.stringify({
        mainMediaUrl: step.isMainMediaDeleted ? '' : mediaToPlay,
        isMainMediaDeleted: !!step.isMainMediaDeleted,
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
        syncedAvatars: syncedAvatars,
        isMediaPinned: !!step.isMediaPinned
      }));
    } catch (e) {}

    window.dispatchEvent(new CustomEvent('avalive:update_master_media', { detail: fullSyncPayload }));
    window.dispatchEvent(new CustomEvent('avalive_flow_step_changed', { detail: fullSyncPayload }));
    if (step.avatarSpeaker) {
      window.dispatchEvent(new CustomEvent('avalive:speaker_change', { detail: { speakerId: step.avatarSpeaker, avatarId: step.avatarSpeaker, isSpeaking: isLivePlaying } }));
      window.dispatchEvent(new CustomEvent('avalive_active_speaker_changed', { detail: { speakerId: step.avatarSpeaker, avatarId: step.avatarSpeaker, isSpeaking: isLivePlaying } }));
    }
    // Luôn dispatch multiAvatarConfig đã đồng bộ để các listener nhận ngay
    window.dispatchEvent(new CustomEvent('avalive_multi_avatar_changed', {
      detail: syncedConfig
    }));

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
  // Gán syncStepToServerRef để undo/redo có thể gọi mà không bị stale closure
  syncStepToServerRef.current = syncStepToServer;

  // Khởi động hoặc chuyển bước trong chuỗi kịch bản (chỉ đọc kịch bản khi được yêu cầu, Master Voice BẬT và Bước BẬT Voice)
  const startStep = (index, shouldPlay = false) => {
    startStepRef.current = startStep;
    const preset = activePresetRef.current || activePreset;
    if (!preset || !preset.steps || preset.steps.length === 0) {
      toast.error('Kịch bản chưa có phân đoạn nào!');
      return;
    }
    const safeIndex = (index >= 0 && index < preset.steps.length) ? index : 0;
    const step = preset.steps[safeIndex];
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

        // 🎙️ ĐỌC KỊCH BẢN LIÊN TỤC XUYÊN SUỐT: Tự động chuyển ngay sang bước tiếp theo khi đọc xong (0ms delay)
        // Chỉ dừng nghỉ khi người dùng cài đặt dừng nghỉ (step.pauseSeconds > 0), bình thường đọc liên tục 100%!
        const pauseDelay = (typeof step.pauseSeconds === 'number' && step.pauseSeconds > 0)
          ? step.pauseSeconds * 1000
          : 0;

        const advanceNext = () => {
          const currentPres = activePresetRef.current || preset;
          const nextIndex = safeIndex + 1;
          const runStep = startStepRef.current || startStep;
          if (nextIndex < currentPres.steps.length) {
            runStep(nextIndex, true);
          } else if (currentPres.loop !== false) {
            runStep(0, true);
          } else {
            setIsPlayingFlow(false);
            toast.success('🎉 Đã đọc xong toàn bộ kịch bản!');
          }
        };

        if (pauseDelay > 0) {
          setTimeout(advanceNext, pauseDelay);
        } else {
          advanceNext();
        }
      }, { 
        priority: true, 
        isTest: true, 
        volume: 1.0, 
        rate: step.voiceRate || 1.0,
        sentencePauseSeconds: step.sentencePauseSeconds !== undefined ? step.sentencePauseSeconds : 0
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
        const curStep = activePreset?.steps?.[currentStepIndex];
        const isVoiceDriven = isSpeakingPreview || (curStep?.voiceEnabled !== false && curStep?.scriptText && curStep?.scriptText.trim());

        // Nếu bước hiện tại đang có giọng đọc AI điều phối:
        // Đếm ngược trực quan hiển thị thời gian, nhưng GIỮ Ở 1s và TUYỆT ĐỐI KHÔNG TỰ TIỆN GỌI startStep!
        // Duy nhất previewVoiceAudio.onEnd sẽ điều phối chuyển bước khi đọc xong để không bao giờ bị ngắt quãng!
        if (isVoiceDriven) {
          return prev > 1 ? prev - 1 : 1;
        }

        if (prev <= 1) {
          const nextIndex = currentStepIndex + 1;
          const currentPres = activePresetRef.current || activePreset;
          const runStep = startStepRef.current || startStep;
          if (nextIndex < currentPres.steps.length) {
            runStep(nextIndex, true);
          } else {
            if (currentPres.loop !== false) {
              runStep(0, true);
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

  // 🛑 TẠM DỪNG CHẠY LIVE
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
    const preset = activePresetRef.current || activePreset;
    if (!preset || !preset.steps || preset.steps.length === 0) {
      toast.error('Chưa có kịch bản hoặc phân đoạn nào để chạy!');
      return;
    }
    setIsPlayingFlow(true);
    startStep(currentStepIndex, true);
    toast.success(`🎬 Bắt đầu chạy kịch bản: ${preset.name}`);
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
        localStorage.removeItem('avalive_sequencer_overlay');
        localStorage.removeItem('avalive_user_locked_media');
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
      // 🔌 Ngắt kết nối đồng bộ — fire event và broadcast CLEAR_STAGE để Sân Khấu Chính xóa sạch lớp phủ
      window.dispatchEvent(new CustomEvent('avalive:sequencer_sync_disconnected', {
        detail: { isSynced: false, source: 'user_toggle' }
      }));
      try {
        const bc = new BroadcastChannel('avalive_master_live_stream');
        bc.postMessage({
          type: 'CLEAR_STAGE',
          source: 'sequencer_disconnect',
          timestamp: Date.now()
        });
        setTimeout(() => bc.close(), 100);
      } catch (err) {}
      toast.info('📴 Đã ngắt đồng bộ — Sân Khấu Chính đã ngắt toàn bộ kết nối với Sân Khấu Phụ');
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
    if (!currentStep || !selectedLayer?.type) return;
    pushUndoSnapshot();
    const curTrans = getLayerCurrentTransform(selectedLayer.type, selectedLayer.id);
    const updated = { ...curTrans, zIndex: (curTrans.zIndex || 10) + 5 };
    handleUpdateStepTransform(currentStep.id, selectedLayer.type, updated, selectedLayer.id);
    toast.success(`🔼 Đã đưa lớp ${selectedLayer.type.toUpperCase()} lên trên! (Z: ${updated.zIndex})`);
  };

  // 🔽 DI CHUYỂN LỚP XUỐNG DƯỚI (Send Backward)
  const handleLayerSendBackward = () => {
    if (!currentStep || !selectedLayer?.type) return;
    pushUndoSnapshot();
    const curTrans = getLayerCurrentTransform(selectedLayer.type, selectedLayer.id);
    const updated = { ...curTrans, zIndex: Math.max(1, (curTrans.zIndex || 10) - 5) };
    handleUpdateStepTransform(currentStep.id, selectedLayer.type, updated, selectedLayer.id);
    toast.success(`🔽 Đã đưa lớp ${selectedLayer.type.toUpperCase()} xuống dưới! (Z: ${updated.zIndex})`);
  };

  // 🔝 ĐƯA LÊN ĐỈNH (Bring to Front)
  const handleLayerBringToFront = () => {
    if (!currentStep || !selectedLayer?.type) return;
    pushUndoSnapshot();
    const curTrans = getLayerCurrentTransform(selectedLayer.type, selectedLayer.id);
    const updated = { ...curTrans, zIndex: 60 };
    handleUpdateStepTransform(currentStep.id, selectedLayer.type, updated, selectedLayer.id);
    toast.success(`🔝 Đã đưa lớp ${selectedLayer.type.toUpperCase()} lên đỉnh cao nhất!`);
  };

  // 🔻 ĐƯA XUỐNG ĐÁY (Send to Back)
  const handleLayerSendToBack = () => {
    if (!currentStep || !selectedLayer?.type) return;
    pushUndoSnapshot();
    const curTrans = getLayerCurrentTransform(selectedLayer.type, selectedLayer.id);
    const updated = { ...curTrans, zIndex: 1 };
    handleUpdateStepTransform(currentStep.id, selectedLayer.type, updated, selectedLayer.id);
    toast.success(`🔻 Đã đưa lớp ${selectedLayer.type.toUpperCase()} xuống dưới cùng!`);
  };

  // Cập nhật thông tin bước
  const handleUpdateStep = (stepId, field, value) => {
    if (['mediaUrl', 'isMainMediaDeleted', 'secondaryMediaUrl', 'overlayImage', 'voiceId', 'avatarSpeaker', 'isMediaPinned', 'isSecondaryMediaPinned', 'isOverlayImagePinned', 'durationSeconds', 'title'].includes(field)) {
      pushUndoSnapshot();
    }
    setPresets(prev => prev.map(p => {
      if (p.id !== activePresetId) return p;
      return {
        ...p,
        steps: p.steps.map(s => s.id === stepId ? { ...s, [field]: value } : s)
      };
    }));
  };

  // 🗑️ XÓA TRỰC TIẾP Ô NHÂN VẬT KHỎI SÂN KHẤU
  const handleDeleteAvatarLayer = (avatarId, skipUndo = false) => {
    if (!skipUndo) pushUndoSnapshot();
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

    const currentCount = typeof multiAvatarConfig?.activeCount === 'number' ? multiAvatarConfig.activeCount : 1;
    const newCount = Math.max(0, currentCount - 1);

    const updated = {
      ...multiAvatarConfig,
      activeCount: newCount,
      avatars: updatedAvatars
    };
    setMultiAvatarConfig(updated);
    saveMultiAvatarConfig(updated);
    setSelectedLayer(null);
    if (!skipUndo) {
      toast.info(`🗑️ Đã xóa ô Avatar khỏi Sân Khấu!`);
      if (isMasterSynced && currentStep) {
        setTimeout(() => syncStepToServer(currentStep, currentStepIndex, isPlayingFlow), 50);
      }
    }
  };

  // 🗑️ XÓA LAYER KHỎI BƯỚC: LOGIC 2 BƯỚC (BƯỚC 1: XÓA NỘI DUNG GIỮ KHUNG -> BƯỚC 2: XÓA HẲN KHUNG)
  const handleDeleteLayerFromStep = (stepId, layerType, avatarId = null) => {
    pushUndoSnapshot();

    if (layerType === 'avatar') {
      const targetId = avatarId || selectedLayer?.id || 'avatar_1';
      const targetAv = (multiAvatarConfig?.avatars || []).find(a => a.id === targetId);
      const hasMedia = Boolean(targetAv && (targetAv.talkVideo || targetAv.idleVideo || targetAv.mediaUrl));

      if (hasMedia) {
        // LẦN 1: Xóa nội dung video/ảnh bên trong, GIỮ NGUYÊN KHUNG trên sân khấu
        const updatedAvatars = (multiAvatarConfig?.avatars || []).map(a => {
          if (a.id === targetId) {
            return {
              ...a,
              talkVideo: '',
              idleVideo: '',
              mediaUrl: ''
            };
          }
          return a;
        });
        const updated = {
          ...multiAvatarConfig,
          avatars: updatedAvatars
        };
        setMultiAvatarConfig(updated);
        saveMultiAvatarConfig(updated);
        // Giữ selectedLayer để khung viền và 8 điểm co giãn vẫn hiển thị cho phép bấm Tải Lên hoặc Xóa lần 2
        setSelectedLayer({ type: 'avatar', id: targetId });
        toast.info('🗑️ Đã xóa video/ảnh của Avatar! (Khung viền vẫn giữ nguyên, bấm Xóa lần nữa để xóa hẳn khung)');
        if (isMasterSynced && currentStep) {
          setTimeout(() => syncStepToServer(currentStep, currentStepIndex, isPlayingFlow), 50);
        }
        return;
      } else {
        // LẦN 2: Khung đã trống -> XÓA HOÀN TOÀN KHUNG khỏi sân khấu
        handleDeleteAvatarLayer(targetId, true);
        setPresets(prev => prev.map(p => {
          if (p.id !== activePresetId) return p;
          return {
            ...p,
            steps: p.steps.map(s => {
              if (s.id !== stepId) return s;
              const newTransforms = { ...(s.avatarTransforms || {}) };
              delete newTransforms[targetId];
              return { ...s, avatarTransforms: newTransforms };
            })
          };
        }));
        setSelectedLayer(null);
        toast.info('🗑️ Đã xóa hoàn toàn khung Avatar khỏi sân khấu!');
        if (isMasterSynced && currentStep) {
          setTimeout(() => syncStepToServer(currentStep, currentStepIndex, isPlayingFlow), 50);
        }
        return;
      }
    }

    if (layerType === 'main_media') {
      const hasMedia = Boolean(currentStep?.mediaUrl) && !currentStep?.isMainMediaDeleted;
      if (hasMedia) {
        // LẦN 1: Xóa nội dung video/ảnh nền chính, giữ khung
        setPresets(prev => prev.map(p => {
          if (p.id !== activePresetId) return p;
          return {
            ...p,
            steps: p.steps.map(s => {
              if (s.id !== stepId) return s;
              return {
                ...s,
                mediaUrl: '',
                isMainMediaDeleted: false,
                mainMediaTransform: s.mainMediaTransform || { x: 0, y: 0, width: 100, height: 100, zIndex: 1 }
              };
            })
          };
        }));
        setSelectedLayer({ type: 'main_media', id: null });
        toast.info('🗑️ Đã xóa video/ảnh Nền Chính! (Khung vẫn giữ nguyên, bấm Xóa lần nữa để xóa hẳn khung)');
        if (isMasterSynced && currentStep) {
          setTimeout(() => syncStepToServer(currentStep, currentStepIndex, isPlayingFlow), 50);
        }
        return;
      } else {
        // LẦN 2: Xóa hoàn toàn khung nền chính
        setPresets(prev => prev.map(p => {
          if (p.id !== activePresetId) return p;
          return {
            ...p,
            steps: p.steps.map(s => {
              if (s.id !== stepId) return s;
              return { ...s, mediaUrl: '', isMainMediaDeleted: true, mainMediaTransform: null };
            })
          };
        }));
        setSelectedLayer(null);
        toast.info('🗑️ Đã xóa hoàn toàn khung Nền Chính khỏi sân khấu!');
        if (isMasterSynced && currentStep) {
          setTimeout(() => syncStepToServer(currentStep, currentStepIndex, isPlayingFlow), 50);
        }
        return;
      }
    }

    if (layerType === 'pip') {
      const hasMedia = Boolean(currentStep?.secondaryMediaUrl);
      if (hasMedia) {
        // LẦN 1: Xóa video/ảnh PiP, giữ khung
        setPresets(prev => prev.map(p => {
          if (p.id !== activePresetId) return p;
          return {
            ...p,
            steps: p.steps.map(s => {
              if (s.id !== stepId) return s;
              return {
                ...s,
                secondaryMediaUrl: '',
                secondaryMediaTransform: s.secondaryMediaTransform || { x: 55, y: 8, width: 40, height: 25, zIndex: 20 }
              };
            })
          };
        }));
        setSelectedLayer({ type: 'pip', id: null });
        toast.info('🗑️ Đã xóa video/ảnh PiP! (Khung vẫn giữ nguyên, bấm Xóa lần nữa để xóa hẳn khung)');
        if (isMasterSynced && currentStep) {
          setTimeout(() => syncStepToServer(currentStep, currentStepIndex, isPlayingFlow), 50);
        }
        return;
      } else {
        // LẦN 2: Xóa hoàn toàn khung PiP
        setPresets(prev => prev.map(p => {
          if (p.id !== activePresetId) return p;
          return {
            ...p,
            steps: p.steps.map(s => {
              if (s.id !== stepId) return s;
              return { ...s, secondaryMediaUrl: '', secondaryMediaTransform: null };
            })
          };
        }));
        setSelectedLayer(null);
        toast.info('🗑️ Đã xóa hoàn toàn khung PiP khỏi sân khấu!');
        if (isMasterSynced && currentStep) {
          setTimeout(() => syncStepToServer(currentStep, currentStepIndex, isPlayingFlow), 50);
        }
        return;
      }
    }

    if (layerType === 'banner') {
      const hasMedia = Boolean(currentStep?.overlayImage);
      if (hasMedia) {
        // LẦN 1: Xóa ảnh Banner, giữ khung
        setPresets(prev => prev.map(p => {
          if (p.id !== activePresetId) return p;
          return {
            ...p,
            steps: p.steps.map(s => {
              if (s.id !== stepId) return s;
              return {
                ...s,
                overlayImage: '',
                overlayImageTransform: s.overlayImageTransform || { x: 10, y: 12, width: 80, height: 20, zIndex: 25 }
              };
            })
          };
        }));
        setSelectedLayer({ type: 'banner', id: null });
        toast.info('🗑️ Đã xóa ảnh Banner! (Khung vẫn giữ nguyên, bấm Xóa lần nữa để xóa hẳn khung)');
        if (isMasterSynced && currentStep) {
          setTimeout(() => syncStepToServer(currentStep, currentStepIndex, isPlayingFlow), 50);
        }
        return;
      } else {
        // LẦN 2: Xóa hoàn toàn khung Banner
        setPresets(prev => prev.map(p => {
          if (p.id !== activePresetId) return p;
          return {
            ...p,
            steps: p.steps.map(s => {
              if (s.id !== stepId) return s;
              return { ...s, overlayImage: '', overlayImageTransform: null };
            })
          };
        }));
        setSelectedLayer(null);
        toast.info('🗑️ Đã xóa hoàn toàn khung Banner khỏi sân khấu!');
        if (isMasterSynced && currentStep) {
          setTimeout(() => syncStepToServer(currentStep, currentStepIndex, isPlayingFlow), 50);
        }
        return;
      }
    }

    if (layerType === 'text') {
      const hasText = Boolean(currentStep?.overlayText);
      if (hasText) {
        // LẦN 1: Xóa nội dung chữ, giữ khung
        setPresets(prev => prev.map(p => {
          if (p.id !== activePresetId) return p;
          return {
            ...p,
            steps: p.steps.map(s => {
              if (s.id !== stepId) return s;
              return {
                ...s,
                overlayText: '',
                overlayTextTransform: s.overlayTextTransform || { x: 5, y: 5, width: 90, height: 12, zIndex: 30 }
              };
            })
          };
        }));
        setSelectedLayer({ type: 'text', id: null });
        toast.info('🗑️ Đã xóa chữ tiêu đề! (Khung vẫn giữ nguyên, bấm Xóa lần nữa để xóa hẳn khung)');
        if (isMasterSynced && currentStep) {
          setTimeout(() => syncStepToServer(currentStep, currentStepIndex, isPlayingFlow), 50);
        }
        return;
      } else {
        // LẦN 2: Xóa hoàn toàn khung Chữ
        setPresets(prev => prev.map(p => {
          if (p.id !== activePresetId) return p;
          return {
            ...p,
            steps: p.steps.map(s => {
              if (s.id !== stepId) return s;
              return { ...s, overlayText: '', overlayTextTransform: null };
            })
          };
        }));
        setSelectedLayer(null);
        toast.info('🗑️ Đã xóa hoàn toàn khung Chữ khỏi sân khấu!');
        if (isMasterSynced && currentStep) {
          setTimeout(() => syncStepToServer(currentStep, currentStepIndex, isPlayingFlow), 50);
        }
        return;
      }
    }
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
    pushUndoSnapshot();
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
    pushUndoSnapshot();
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
    pushUndoSnapshot();
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

  // 🎭 Tải Media Trực Tiếp Từ Máy Tính Gán Vào Avatar Đang Chọn Trên Sân Khấu (Hỗ trợ Nhiều File, Cả Video & Hình Ảnh)
  const handleDirectAvatarMediaUpload = (avatarId, e) => {
    const rawFiles = Array.from(e.target.files || []);
    if (rawFiles.length === 0) return;

    const getFileUrl = (file) => {
      const isImg = file.type.startsWith('image/') || file.name.match(/\.(png|jpe?g|webp|gif|svg|avif|bmp)$/i);
      if (isImg) {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => resolve(ev.target?.result || '');
          reader.onerror = () => resolve('');
          reader.readAsDataURL(file);
        });
      } else {
        try {
          return Promise.resolve(URL.createObjectURL(file) + '#type=video');
        } catch {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (ev) => resolve(ev.target?.result || '');
            reader.onerror = () => resolve('');
            reader.readAsDataURL(file);
          });
        }
      }
    };

    Promise.all(rawFiles.map(f => getFileUrl(f))).then((loadedUrls) => {
      pushUndoSnapshot();
      const currentAvatars = (multiAvatarConfig?.avatars && multiAvatarConfig.avatars.length > 0)
        ? multiAvatarConfig.avatars
        : DEFAULT_MULTI_AVATAR_CONFIG.avatars;

      const curNum = parseInt(String(avatarId).replace(/\D/g, '') || '1', 10);

      // Gán lần lượt các file cho avatarId, avatar tiếp theo...
      const updatedAvatars = currentAvatars.map(a => {
        const aNum = parseInt(String(a.id).replace(/\D/g, '') || '1', 10);
        const fileOffset = aNum - curNum;
        if (fileOffset >= 0 && fileOffset < loadedUrls.length) {
          const mediaUrl = loadedUrls[fileOffset];
          return {
            ...a,
            talkVideo: mediaUrl,
            idleVideo: mediaUrl,
            mediaUrl: mediaUrl,
            chromaKey: { enabled: false, mode: 'green', color: '#00ff00' }
          };
        }
        return a;
      });

      const maxAffectedAvatar = Math.min(5, curNum + loadedUrls.length - 1);
      const targetCount = Math.max(multiAvatarConfig?.activeCount || 1, maxAffectedAvatar);

      const updated = {
        ...multiAvatarConfig,
        enabled: true,
        activeCount: targetCount,
        avatars: updatedAvatars
      };
      setMultiAvatarConfig(updated);
      saveMultiAvatarConfig(updated);

      if (loadedUrls.length > 1) {
        toast.success(`👥 Đã nạp thành công ${loadedUrls.length} Avatar (từ Nhân Vật ${curNum} đến Nhân Vật ${maxAffectedAvatar})!`);
      } else {
        toast.success(`🎭 Đã nạp Avatar ${String(avatarId).toUpperCase()} (Giữ nguyên phông gốc)!`);
      }

      if (isMasterSynced && currentStep) {
        setTimeout(() => syncStepToServer(currentStep, currentStepIndex, isPlayingFlow), 50);
      }
    });

    e.target.value = '';
  };

  // 📂 TẢI MEDIA TRỰC TIẾP TỪ MÁY TÍNH (HỖ TRỢ TẢI NHIỀU FILE VIDEO / ẢNH -> TỰ ĐỘNG TẠO BƯỚC NỐI TIẾP)
  const handleDirectMediaUpload = (stepId, targetField, e) => {
    const rawFiles = Array.from(e.target.files || []);
    if (rawFiles.length === 0) return;

    // Tự động chuyển ngay sang bước này để hiển thị trên Sân Khấu 9:16
    const stepIdx = activePreset?.steps?.findIndex(s => s.id === stepId);
    if (stepIdx !== undefined && stepIdx >= 0) {
      setCurrentStepIndex(stepIdx);
      const stepObj = activePreset.steps[stepIdx];
      if (stepObj) {
        setSecondsRemaining(stepObj.durationSeconds || 60);
      }
    }

    const firstFile = rawFiles[0];
    const isImgFirst = firstFile.type.startsWith('image/') || firstFile.name.match(/\.(png|jpe?g|webp|gif|svg|avif|bmp)$/i);

    const getFileUrl = (file) => {
      const isImg = file.type.startsWith('image/') || file.name.match(/\.(png|jpe?g|webp|gif|svg|avif|bmp)$/i);
      if (isImg) {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => resolve(ev.target?.result || '');
          reader.onerror = () => resolve('');
          reader.readAsDataURL(file);
        });
      } else {
        try {
          return Promise.resolve(URL.createObjectURL(file) + '#type=video');
        } catch {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (ev) => resolve(ev.target?.result || '');
            reader.onerror = () => resolve('');
            reader.readAsDataURL(file);
          });
        }
      }
    };

    Promise.all(rawFiles.map(f => getFileUrl(f))).then((loadedUrls) => {
      pushUndoSnapshot();
      let updatedCurrentStep = null;

      setPresets(prev => prev.map(p => {
        if (p.id !== activePresetId) return p;
        const curIdx = p.steps.findIndex(s => s.id === stepId);
        if (curIdx === -1) return p;

        const baseStep = p.steps[curIdx];
        const firstUrl = loadedUrls[0];

        // Cập nhật bước hiện tại với file đầu tiên
        const updatedFirstStep = {
          ...baseStep,
          [targetField]: firstUrl
        };
        if (targetField === 'mediaUrl') {
          updatedFirstStep.isMainMediaDeleted = false;
          updatedFirstStep.mainMediaChromaKey = { enabled: false, mode: 'green', color: '#00ff00' };
        } else if (targetField === 'secondaryMediaUrl') {
          updatedFirstStep.secondaryMediaChromaKey = { enabled: false, mode: 'green', color: '#00ff00' };
        } else if (targetField === 'overlayImage') {
          updatedFirstStep.overlayImageChromaKey = { enabled: false, mode: 'green', color: '#00ff00' };
        }

        if (baseStep.id === currentStep?.id) {
          updatedCurrentStep = updatedFirstStep;
        }

        const newSteps = [...p.steps];
        newSteps[curIdx] = updatedFirstStep;

        // Nếu có nhiều file (> 1): Tự động tạo thêm các bước kịch bản tiếp nối
        if (loadedUrls.length > 1) {
          const extraSteps = [];
          for (let i = 1; i < loadedUrls.length; i++) {
            const extraFile = rawFiles[i];
            const extraUrl = loadedUrls[i];
            const cleanTitle = extraFile.name.replace(/\.[^/.]+$/, "");
            const newStep = {
              ...baseStep,
              id: `step_${Date.now()}_${i}_${Math.random().toString(36).substring(2, 6)}`,
              title: cleanTitle ? `Bước: ${cleanTitle}` : `${baseStep.title} (${i + 1})`,
              [targetField]: extraUrl,
              isMainMediaDeleted: false,
              mainMediaChromaKey: { enabled: false, mode: 'green', color: '#00ff00' },
              secondaryMediaChromaKey: { enabled: false, mode: 'green', color: '#00ff00' },
              overlayImageChromaKey: { enabled: false, mode: 'green', color: '#00ff00' }
            };
            extraSteps.push(newStep);
          }
          newSteps.splice(curIdx + 1, 0, ...extraSteps);
        }

        return { ...p, steps: newSteps };
      }));

      if (rawFiles.length > 1) {
        toast.success(`🎉 Đã tải lên thành công ${rawFiles.length} tệp! 1 tệp vào bước hiện tại và ${rawFiles.length - 1} bước kịch bản tiếp theo đã tự động được tạo!`);
      } else {
        toast.success(`🎬 Đã nạp ${isImgFirst ? 'ảnh' : 'video'} "${firstFile.name}" lên Sân Khấu 9:16 (Giữ nguyên phông gốc)!`);
      }

      if (isMasterSynced) {
        setTimeout(() => {
          const sToSync = updatedCurrentStep || currentStep;
          if (sToSync) syncStepToServer(sToSync, currentStepIndex, isPlayingFlow);
        }, 50);
      }
    });

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

  // 📋 NHÂN BẢN SAO CHÉP LỚP ĐANG CHỌN TRỰC TIẾP TRÊN SÂN KHẤU PHỤ (Avatar, Video Nền, Video PiP, Ảnh Banner, Tiêu Đề)
  const handleDuplicateSelectedLayer = () => {
    if (!selectedLayer?.type) {
      toast.info('💡 Vui lòng bấm chọn một lớp trên Sân Khấu (Avatar, Video, Ảnh, hoặc Chữ) để nhân bản!');
      return;
    }
    pushUndoSnapshot();

    if (selectedLayer.type === 'avatar') {
      const curId = selectedLayer.id || 'avatar_1';
      const currentAvatars = (multiAvatarConfig?.avatars && multiAvatarConfig.avatars.length > 0)
        ? multiAvatarConfig.avatars
        : DEFAULT_MULTI_AVATAR_CONFIG.avatars;
      const sourceAvatar = currentAvatars.find(a => a.id === curId) || currentAvatars[0];

      // Tìm slot avatar tiếp theo (avatar_1 -> avatar_2 -> avatar_3 -> avatar_4 -> avatar_5)
      const curNum = parseInt(String(curId).replace(/\D/g, '') || '1', 10);
      const nextNum = curNum >= 5 ? 1 : curNum + 1;
      const nextId = `avatar_${nextNum}`;

      // Sao chép thuộc tính từ sourceAvatar sang targetAvatar
      const updatedAvatars = currentAvatars.map(a => {
        if (a.id === nextId) {
          return {
            ...a,
            talkVideo: sourceAvatar?.talkVideo || '',
            idleVideo: sourceAvatar?.idleVideo || '',
            mediaUrl: sourceAvatar?.mediaUrl || sourceAvatar?.talkVideo || '',
            chromaKey: sourceAvatar?.chromaKey ? { ...sourceAvatar.chromaKey } : { enabled: false, mode: 'green', color: '#00ff00' }
          };
        }
        return a;
      });

      const updatedConfig = {
        ...multiAvatarConfig,
        enabled: true,
        activeCount: Math.max(multiAvatarConfig?.activeCount || 1, nextNum),
        avatars: updatedAvatars
      };
      setMultiAvatarConfig(updatedConfig);
      saveMultiAvatarConfig(updatedConfig);

      // Cập nhật transform cho avatar mới trong bước hiện tại (dịch chuyển vị trí nhẹ để không che nhau)
      if (currentStep) {
        const existingTrans = currentStep.avatarTransforms?.[curId] || { x: 50, y: 50, scale: 1, rotate: 0 };
        const newTrans = {
          ...existingTrans,
          x: Math.min(85, Math.max(15, (existingTrans.x || 50) + 12)),
          y: Math.min(85, Math.max(15, (existingTrans.y || 50) + 5))
        };
        handleUpdateStepTransform(currentStep.id, 'avatar', newTrans, nextId);
      }

      setSelectedLayer({ type: 'avatar', id: nextId });
      toast.success(`👥 Đã nhân bản Avatar ${curNum} sang Avatar ${nextNum} thành công!`);
      if (isMasterSynced && currentStep) {
        setTimeout(() => syncStepToServer(currentStep, currentStepIndex, isPlayingFlow), 50);
      }
      return;
    }

    if (selectedLayer.type === 'main_media') {
      if (!currentStep) return;
      if (!currentStep.mediaUrl) {
        toast.info('💡 Chưa có Video/Ảnh nền chính để nhân bản!');
        return;
      }
      // Nếu PiP chưa có video, nhân bản ngay sang PiP để hiển thị 2 video đồng thời trên sân khấu!
      if (!currentStep.secondaryMediaUrl) {
        const currentMainTrans = currentStep.mainMediaTransform || { x: 50, y: 50, scale: 1, rotate: 0 };
        const pipTrans = {
          x: Math.min(80, Math.max(20, (currentMainTrans.x || 50) + 10)),
          y: Math.min(80, Math.max(20, (currentMainTrans.y || 50) + 10)),
          width: 35,
          height: 35,
          scale: 0.6,
          rotate: currentMainTrans.rotate || 0
        };
        setPresets(prev => prev.map(p => {
          if (p.id !== activePresetId) return p;
          return {
            ...p,
            steps: p.steps.map(s => {
              if (s.id !== currentStep.id) return s;
              return {
                ...s,
                secondaryMediaUrl: currentStep.mediaUrl,
                secondaryMediaTransform: pipTrans,
                secondaryMediaChromaKey: currentStep.mainMediaChromaKey ? { ...currentStep.mainMediaChromaKey } : { enabled: false, mode: 'green', color: '#00ff00' }
              };
            })
          };
        }));
        setSelectedLayer({ type: 'pip', id: 'pip' });
        toast.success('🎬 Đã nhân bản Video nền sang lớp Video PiP trên Sân Khấu!');
        if (isMasterSynced) {
          setTimeout(() => syncStepToServer({
            ...currentStep,
            secondaryMediaUrl: currentStep.mediaUrl,
            secondaryMediaTransform: pipTrans
          }, currentStepIndex, isPlayingFlow), 50);
        }
      } else {
        // Nếu PiP đã có video, nhân bản trực tiếp sang 1 slot Avatar AI để hiển thị đồng thời nhiều video trên sân khấu!
        const currentAvatars = (multiAvatarConfig?.avatars && multiAvatarConfig.avatars.length > 0)
          ? multiAvatarConfig.avatars
          : DEFAULT_MULTI_AVATAR_CONFIG.avatars;
        const emptySlot = currentAvatars.find(a => !a.talkVideo && !a.idleVideo && !a.mediaUrl) || currentAvatars[1] || currentAvatars[0];
        const targetId = emptySlot?.id || 'avatar_2';
        const targetNum = parseInt(String(targetId).replace(/\D/g, '') || '2', 10);

        const updatedAvatars = currentAvatars.map(a => {
          if (a.id === targetId) {
            return {
              ...a,
              talkVideo: currentStep.mediaUrl,
              idleVideo: currentStep.mediaUrl,
              mediaUrl: currentStep.mediaUrl,
              chromaKey: currentStep.mainMediaChromaKey ? { ...currentStep.mainMediaChromaKey } : { enabled: false, mode: 'green', color: '#00ff00' }
            };
          }
          return a;
        });
        const updatedConfig = {
          ...multiAvatarConfig,
          enabled: true,
          activeCount: Math.max(multiAvatarConfig?.activeCount || 1, targetNum),
          avatars: updatedAvatars
        };
        setMultiAvatarConfig(updatedConfig);
        saveMultiAvatarConfig(updatedConfig);

        const newTrans = { x: 55, y: 55, width: 35, height: 35, scale: 0.8, rotate: 0 };
        handleUpdateStepTransform(currentStep.id, 'avatar', newTrans, targetId);
        setSelectedLayer({ type: 'avatar', id: targetId });
        toast.success(`🎬 Đã nhân bản thêm Video sang lớp ${emptySlot?.name || `Avatar ${targetNum}`} trên Sân Khấu!`);
        if (isMasterSynced) {
          setTimeout(() => syncStepToServer(currentStep, currentStepIndex, isPlayingFlow), 50);
        }
      }
      return;
    }

    if (selectedLayer.type === 'pip') {
      if (!currentStep || !currentStep.secondaryMediaUrl) {
        toast.info('💡 Chưa có Video PiP để nhân bản!');
        return;
      }
      if (!currentStep.mediaUrl) {
        handleUpdateStep(currentStep.id, 'mediaUrl', currentStep.secondaryMediaUrl);
        if (currentStep.secondaryMediaChromaKey) {
          handleUpdateStep(currentStep.id, 'mainMediaChromaKey', { ...currentStep.secondaryMediaChromaKey });
        }
        setSelectedLayer({ type: 'main_media', id: 'main' });
        toast.success('🎬 Đã nhân bản Video PiP sang Video Nền Chính trên Sân Khấu!');
      } else {
        const currentAvatars = (multiAvatarConfig?.avatars && multiAvatarConfig.avatars.length > 0)
          ? multiAvatarConfig.avatars
          : DEFAULT_MULTI_AVATAR_CONFIG.avatars;
        const emptySlot = currentAvatars.find(a => !a.talkVideo && !a.idleVideo && !a.mediaUrl) || currentAvatars[1] || currentAvatars[0];
        const targetId = emptySlot?.id || 'avatar_2';
        const targetNum = parseInt(String(targetId).replace(/\D/g, '') || '2', 10);

        const updatedAvatars = currentAvatars.map(a => {
          if (a.id === targetId) {
            return {
              ...a,
              talkVideo: currentStep.secondaryMediaUrl,
              idleVideo: currentStep.secondaryMediaUrl,
              mediaUrl: currentStep.secondaryMediaUrl,
              chromaKey: currentStep.secondaryMediaChromaKey ? { ...currentStep.secondaryMediaChromaKey } : { enabled: false, mode: 'green', color: '#00ff00' }
            };
          }
          return a;
        });
        const updatedConfig = {
          ...multiAvatarConfig,
          enabled: true,
          activeCount: Math.max(multiAvatarConfig?.activeCount || 1, targetNum),
          avatars: updatedAvatars
        };
        setMultiAvatarConfig(updatedConfig);
        saveMultiAvatarConfig(updatedConfig);

        const pipTrans = currentStep.secondaryMediaTransform || { x: 50, y: 50 };
        const newTrans = {
          x: Math.min(80, Math.max(15, (pipTrans.x || 50) + 12)),
          y: Math.min(80, Math.max(15, (pipTrans.y || 50) + 5)),
          width: 35,
          height: 35,
          scale: 0.8,
          rotate: 0
        };
        handleUpdateStepTransform(currentStep.id, 'avatar', newTrans, targetId);
        setSelectedLayer({ type: 'avatar', id: targetId });
        toast.success(`🎬 Đã nhân bản Video PiP sang lớp ${emptySlot?.name || `Avatar ${targetNum}`} trên Sân Khấu!`);
        if (isMasterSynced) {
          setTimeout(() => syncStepToServer(currentStep, currentStepIndex, isPlayingFlow), 50);
        }
      }
      return;
    }

    if (selectedLayer.type === 'banner') {
      if (!currentStep || !currentStep.overlayImage) {
        toast.info('💡 Chưa có Banner/Ảnh để nhân bản!');
        return;
      }
      if (!currentStep.secondaryMediaUrl) {
        const bannerTrans = currentStep.overlayImageTransform || { x: 50, y: 50 };
        const pipTrans = {
          x: Math.min(80, Math.max(15, (bannerTrans.x || 50) + 10)),
          y: Math.min(80, Math.max(15, (bannerTrans.y || 50) + 10)),
          width: 35,
          height: 35,
          scale: 0.6,
          rotate: 0
        };
        handleUpdateStep(currentStep.id, 'secondaryMediaUrl', currentStep.overlayImage);
        handleUpdateStepTransform(currentStep.id, 'pip', pipTrans);
        setSelectedLayer({ type: 'pip', id: 'pip' });
        toast.success('🖼️ Đã nhân bản Banner/Ảnh sang lớp hiển thị thứ 2 trên Sân Khấu!');
      } else {
        const currentAvatars = (multiAvatarConfig?.avatars && multiAvatarConfig.avatars.length > 0)
          ? multiAvatarConfig.avatars
          : DEFAULT_MULTI_AVATAR_CONFIG.avatars;
        const emptySlot = currentAvatars.find(a => !a.talkVideo && !a.idleVideo && !a.mediaUrl) || currentAvatars[1] || currentAvatars[0];
        const targetId = emptySlot?.id || 'avatar_2';
        const targetNum = parseInt(String(targetId).replace(/\D/g, '') || '2', 10);

        const updatedAvatars = currentAvatars.map(a => {
          if (a.id === targetId) {
            return {
              ...a,
              talkVideo: currentStep.overlayImage,
              idleVideo: currentStep.overlayImage,
              mediaUrl: currentStep.overlayImage,
              chromaKey: { enabled: false, mode: 'green', color: '#00ff00' }
            };
          }
          return a;
        });
        const updatedConfig = {
          ...multiAvatarConfig,
          enabled: true,
          activeCount: Math.max(multiAvatarConfig?.activeCount || 1, targetNum),
          avatars: updatedAvatars
        };
        setMultiAvatarConfig(updatedConfig);
        saveMultiAvatarConfig(updatedConfig);

        const newTrans = { x: 55, y: 55, width: 35, height: 35, scale: 0.8, rotate: 0 };
        handleUpdateStepTransform(currentStep.id, 'avatar', newTrans, targetId);
        setSelectedLayer({ type: 'avatar', id: targetId });
        toast.success(`🖼️ Đã nhân bản Banner/Ảnh sang lớp ${emptySlot?.name || `Avatar ${targetNum}`} trên Sân Khấu!`);
      }
      return;
    }

    if (selectedLayer.type === 'text') {
      if (!currentStep || !currentStep.overlayText) {
        toast.info('💡 Chưa có Tiêu đề chữ để nhân bản!');
        return;
      }
      const currentTrans = currentStep.overlayTextTransform || { x: 50, y: 85 };
      handleUpdateStepTransform(currentStep.id, 'text', {
        ...currentTrans,
        y: Math.min(92, (currentTrans.y || 85) + 5)
      });
      toast.success('✍️ Đã nhân bản vị trí tiêu đề chữ trên Sân Khấu!');
      return;
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
    if (isMasterSynced && currentStep) {
      setTimeout(() => {
        syncStepToServer(currentStep, currentStepIndex, isPlayingFlow);
      }, 50);
    }
    toast.success(`✨ Đã cập nhật Xóa Phông cho Avatar ${avatarId.toUpperCase()}!`);
  };

  // 🧠 Ánh xạ giọng đọc từ BỘ NÃO VOICE AI BRAIN cho từng nhân vật 1 - 5
  const getBrainVoiceForSpeaker = useCallback((speakerId) => {
    try {
      const generalSettings = JSON.parse(localStorage.getItem('aidol_general_settings') || '{}');
      if (speakerId === 'avatar_1' && (generalSettings.avatar1VoiceId || generalSettings.mainVoiceId)) return generalSettings.avatar1VoiceId || generalSettings.mainVoiceId;
      if (speakerId === 'avatar_2' && (generalSettings.avatar2VoiceId || generalSettings.assistantVoiceId)) return generalSettings.avatar2VoiceId || generalSettings.assistantVoiceId;
      if (speakerId === 'avatar_3' && (generalSettings.avatar3VoiceId || generalSettings.gameVoiceId)) return generalSettings.avatar3VoiceId || generalSettings.gameVoiceId;
      if (speakerId === 'avatar_4' && (generalSettings.avatar4VoiceId || generalSettings.commentVoiceId)) return generalSettings.avatar4VoiceId || generalSettings.commentVoiceId;
      if (speakerId === 'avatar_5' && generalSettings.avatar5VoiceId) return generalSettings.avatar5VoiceId;

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
    let elevenLabsVoices = [];
    try {
      const stored = localStorage.getItem('elevenlabs_user_voices');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          elevenLabsVoices = parsed.map(v => ({
            id: v.voice_id || v.id,
            name: `🎙️ ${v.name || 'ElevenLabs Voice'} (Tùy Chỉnh)`,
            tier: 'pro',
            provider: 'elevenlabs'
          }));
        }
      }
    } catch(e) {}

    const vipVoices = ALL_SYSTEM_VOICES.filter(v => v.tier === 'pro' || v.badge?.includes('VIP') || v.id.startsWith('free_') || v.id.startsWith('vn_'));
    const femaleVoices = ALL_SYSTEM_VOICES.filter(v => v.gender === 'Female' && !vipVoices.some(vip => vip.id === v.id) && (v.lang?.startsWith('vi') || v.region === 'vi'));
    const maleVoices = ALL_SYSTEM_VOICES.filter(v => v.gender === 'Male' && !vipVoices.some(vip => vip.id === v.id) && (v.lang?.startsWith('vi') || v.region === 'vi'));
    const otherVoices = ALL_SYSTEM_VOICES.filter(v => !vipVoices.some(vip => vip.id === v.id) && !femaleVoices.some(f => f.id === v.id) && !maleVoices.some(m => m.id === v.id));

    return {
      elevenLabsVoices,
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

  const currentStep = activePreset.steps[currentStepIndex] || activePreset.steps[0];
  const safeAvatars = (multiAvatarConfig?.avatars && multiAvatarConfig.avatars.length > 0)
    ? multiAvatarConfig.avatars
    : DEFAULT_MULTI_AVATAR_CONFIG.avatars;
  const activeAvatarCount = typeof multiAvatarConfig?.activeCount === 'number' ? multiAvatarConfig.activeCount : 1;
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
    if (layerType === 'main_media' || layerType === 'mainMedia') {
      const chroma = currentStep?.mainMediaChromaKey || resolved.mainMediaChromaKey;
      if (chroma?.enabled) return getChromaStyle(chroma);
    }
    if (layerType === 'pip' || layerType === 'secondaryMedia') {
      const chroma = currentStep?.secondaryMediaChromaKey || resolved.secondaryMediaChromaKey;
      if (chroma?.enabled) return getChromaStyle(chroma);
    }
    if (layerType === 'banner' || layerType === 'overlayImage') {
      const chroma = currentStep?.overlayImageChromaKey || resolved.overlayImageChromaKey;
      if (chroma?.enabled) return getChromaStyle(chroma);
    }
    return {};
  }, [safeAvatars, currentStep, currentStepIndex, resolveStepMedia]);

  // ✂️ CẬP NHẬT CHROMA KEY / XÓA NỀN CHO BẤT KỲ LỚP NÀO
  const handleLayerChromaUpdate = (layerType, targetId, updates) => {
    let updatedStep = { ...currentStep };
    if (layerType === 'avatar' && targetId) {
      handleAvatarChromaUpdate(targetId, updates);
    } else if (layerType === 'main_media' || layerType === 'mainMedia') {
      const current = currentStep?.mainMediaChromaKey || { enabled: false, mode: 'green', color: '#00ff00' };
      const nextVal = { ...current, ...updates };
      handleUpdateStep(currentStep.id, 'mainMediaChromaKey', nextVal);
      updatedStep.mainMediaChromaKey = nextVal;
      toast.success('✨ Đã cập nhật Tách Phông cho Video/Ảnh Nền!');
    } else if (layerType === 'pip' || layerType === 'secondaryMedia') {
      const current = currentStep?.secondaryMediaChromaKey || { enabled: false, mode: 'green', color: '#00ff00' };
      const nextVal = { ...current, ...updates };
      handleUpdateStep(currentStep.id, 'secondaryMediaChromaKey', nextVal);
      updatedStep.secondaryMediaChromaKey = nextVal;
      toast.success('✨ Đã cập nhật Tách Phông cho Video PiP!');
    } else if (layerType === 'banner' || layerType === 'overlayImage') {
      const current = currentStep?.overlayImageChromaKey || { enabled: false, mode: 'green', color: '#00ff00' };
      const nextVal = { ...current, ...updates };
      handleUpdateStep(currentStep.id, 'overlayImageChromaKey', nextVal);
      updatedStep.overlayImageChromaKey = nextVal;
      toast.success('✨ Đã cập nhật Tách Phông cho Ảnh Banner!');
    }

    if (isMasterSynced && currentStep) {
      setTimeout(() => {
        syncStepToServer(updatedStep, currentStepIndex, isPlayingFlow);
      }, 50);
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

    pushUndoSnapshot();
    toast.info('⏳ Đang xử lý tách nền hình ảnh siêu sạch...');
    try {
      const transparentDataUrl = await removeImageBackgroundCanvas(targetImg, mode);
      if (layerType === 'avatar' && targetId) {
        const currentAvs = (multiAvatarConfig?.avatars && multiAvatarConfig.avatars.length > 0)
          ? [...multiAvatarConfig.avatars]
          : [{ id: targetId, name: 'MC', talkVideo: '', idleVideo: '', mediaUrl: '' }];
        const updatedAvatars = currentAvs.map(a => {
          if (a.id === targetId) {
            return {
              ...a,
              talkVideo: transparentDataUrl,
              idleVideo: transparentDataUrl,
              mediaUrl: transparentDataUrl,
              chromaKey: { enabled: false, mode: 'green', color: '#00ff00' }
            };
          }
          return a;
        });
        const updated = {
          ...multiAvatarConfig,
          avatars: updatedAvatars
        };
        setMultiAvatarConfig(updated);
        saveMultiAvatarConfig(updated);
        try {
          window.dispatchEvent(new CustomEvent('avalive:multi_avatar_config_changed', { detail: updated }));
        } catch (e) {}
      } else if (layerType === 'main_media') {
        handleUpdateStep(currentStep.id, 'mediaUrl', transparentDataUrl);
      } else if (layerType === 'pip') {
        handleUpdateStep(currentStep.id, 'secondaryMediaUrl', transparentDataUrl);
      } else if (layerType === 'banner') {
        handleUpdateStep(currentStep.id, 'overlayImage', transparentDataUrl);
      }
      toast.success('🎉 Đã tách sạch sẽ 100% nền hình ảnh trong suốt!');
      if (isMasterSynced && currentStep) {
        setTimeout(() => {
          syncStepToServer(activePreset.steps[currentStepIndex] || currentStep, currentStepIndex, isPlayingFlow);
        }, 100);
      }
    } catch (err) {
      handleLayerChromaUpdate(layerType, targetId, { enabled: true, mode });
      toast.success('✨ Đã bật bộ lọc Tách Phông Xanh!');
    }
  };

  // 📺 NHÚNG VIDEO / ẢNH VÀO KHUNG PHÔNG XANH (GREEN SCREEN FRAME EMBEDDING)
  const handleEmbedGreenScreenFrame = (frameImgUrl, contentMediaUrl) => {
    if (!currentStep) return;
    pushUndoSnapshot();
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

    setPresets(prev => prev.map(p => {
      if (p.id !== activePresetId) return p;
      return { ...p, steps: currentSteps };
    }));
    toast.success('📺 Đã nhúng Video/Ảnh vào Khung Phông Xanh thành công!');
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
    if (isStageLocked) return;
    e.stopPropagation();
    e.preventDefault();

    hasPushedDragUndoRef.current = false;
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

      // Đẩy snapshot Undo một lần duy nhất khi bắt đầu thao tác kéo thực tế
      if (!hasPushedDragUndoRef.current && (Math.abs(curX - dragState.startX) > 3 || Math.abs(curY - dragState.startY) > 3)) {
        pushUndoSnapshot();
        hasPushedDragUndoRef.current = true;
      }

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
      if (hasPushedDragUndoRef.current && isMasterSynced && currentStep) {
        setTimeout(() => syncStepToServer(currentStep, currentStepIndex, isPlayingFlow), 50);
      }
      hasPushedDragUndoRef.current = false;
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
    if (isStageLocked || !currentStep || !selectedLayer?.type) return;
    pushUndoSnapshot();
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
    if (isStageLocked || !currentStep || !selectedLayer?.type) return;
    pushUndoSnapshot();
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
  const handleTestVoiceSpeech = (stepId, text, voiceId = 'brain_auto', speakerId = 'avatar_1', options = {}) => {
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

    const stepObj = activePreset?.steps?.find(s => s.id === stepId);
    const sentencePauseSeconds = options.sentencePauseSeconds !== undefined 
      ? options.sentencePauseSeconds 
      : (stepObj?.sentencePauseSeconds !== undefined ? stepObj.sentencePauseSeconds : 0);
    const voiceRate = options.voiceRate !== undefined 
      ? options.voiceRate 
      : (stepObj?.voiceRate || 1.0);

    previewVoiceAudio(effectiveVoiceId, text, () => {
      setIsSpeakingPreview(false);
      setSpeakingStepId(null);
    }, {
      priority: true,
      isTest: true,
      rate: voiceRate,
      sentencePauseSeconds
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
          {selectedLayer?.type ? (
            <div 
              className="w-full flex items-center justify-between gap-1 bg-slate-950/95 backdrop-blur-md px-1.5 py-1 rounded-xl border border-cyan-400 shadow-xl mb-1.5 shrink-0 animate-in fade-in slide-in-from-top-1 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="px-1.5 py-0.5 rounded-md bg-cyan-950 text-[9px] font-black text-cyan-300 border border-cyan-500/40 uppercase shrink-0" title={`Lớp: ${selectedLayer.type}`}>
                {selectedLayer.type === 'avatar' ? `AV${selectedLayer.id || '1'}` : selectedLayer.type === 'main_media' ? 'NỀN' : selectedLayer.type === 'pip' ? 'PIP' : selectedLayer.type === 'banner' ? 'ẢNH' : 'CHỮ'}
              </span>

              <div className="flex items-center gap-0.5 shrink-0">
                {/* 📁 Nút Tải Video/Ảnh (Ảnh 4) */}
                {selectedLayer.type !== 'text' && (
                  <label className="px-1.5 py-0.5 rounded-md text-[8.5px] font-black bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-0.5 cursor-pointer shadow-xs whitespace-nowrap" title="Tải Video/Ảnh từ máy tính lên (chọn 1 hoặc nhiều tệp)">
                    <Upload size={9} />
                    <span>Tải Lên</span>
                    <input 
                      type="file" 
                      accept="video/*,image/*" 
                      multiple
                      onChange={(e) => handleDirectLayerUpload(selectedLayer.type, selectedLayer.id, e)}
                      className="hidden" 
                    />
                  </label>
                )}

                {/* 📋 Nút Nhân Bản Sao Chép (Video / Avatar / Lớp) */}
                <button
                  type="button"
                  onClick={handleDuplicateSelectedLayer}
                  className="px-1.5 py-0.5 rounded-md text-[8.5px] font-black bg-amber-600 hover:bg-amber-500 text-white flex items-center gap-0.5 cursor-pointer shadow-xs whitespace-nowrap"
                  title={`Nhân bản sao chép ${selectedLayer.type === 'avatar' ? `Avatar ${selectedLayer.id || '1'}` : selectedLayer.type === 'main_media' ? 'Video nền chính' : selectedLayer.type === 'pip' ? 'Video PiP' : selectedLayer.type === 'banner' ? 'Ảnh banner' : 'Tiêu đề chữ'}`}
                >
                  <Copy size={9} />
                  <span>Nhân Bản</span>
                </button>

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
                  onClick={() => setSelectedLayer(null)}
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
                {/* 👁️ Nút Ẩn / Bỏ Chọn Khung Viền Xanh (Xem Sạch 100%) */}
                {selectedLayer && (
                  <button
                    type="button"
                    onClick={() => setSelectedLayer(null)}
                    className="px-1.5 py-0.5 rounded-md text-[8.5px] font-black transition-all flex items-center gap-0.5 cursor-pointer border bg-slate-800 hover:bg-slate-700 text-rose-300 border-slate-700"
                    title="Bỏ chọn để ẩn hoàn toàn khung viền xanh và 8 điểm co giãn trên sân khấu"
                  >
                    <EyeOff size={8.5} />
                    <span>Bỏ chọn khung</span>
                  </button>
                )}
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
              onClick={(e) => {
                if (e.target === stageInnerRef.current) {
                  setSelectedLayer(null);
                }
              }}
              className="relative h-full max-h-full aspect-[9/16] bg-black rounded-[28px] border-[3.5px] border-slate-700/80 ring-2 ring-cyan-500/40 shadow-2xl overflow-hidden flex flex-col mx-auto select-none"
              style={{ maxHeight: '100%' }}
            >
              {/* Dynamic Island / Notch Mockup Top */}
              <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-20 h-3.5 bg-black/95 rounded-full border border-white/10 z-50 flex items-center justify-between px-2 pointer-events-none">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              </div>

              {/* Lớp 1: Video / Ảnh Nền Chính (Kéo thả & Co giãn 8 hướng & Tách Nền & Khung Trống) */}
              {!currentStep?.isMainMediaDeleted && (activeMediaUrl || currentStep?.mainMediaTransform || (!isStageLocked && selectedLayer?.type === 'main_media')) && (() => {
                const mediaTrans = getLayerCurrentTransform('main_media');
                const isSelected = !isStageLocked && selectedLayer?.type === 'main_media';
                const chromaStyle = getLayerChromaStyle('main_media');
                const chromaKey = currentStep?.mainMediaChromaKey;
                const isBgRemoved = Boolean(chromaKey?.enabled || (activeMediaUrl && (activeMediaUrl.startsWith('data:image/png') || activeMediaUrl.includes('transparent'))));

                return (
                  <div
                    onMouseDown={(e) => handlePointerDown(e, 'main_media', null, null)}
                    onTouchStart={(e) => handlePointerDown(e, 'main_media', null, null)}
                    className={`absolute transition-shadow cursor-move select-none ${
                      isSelected 
                        ? (isBgRemoved ? 'z-20' : 'ring-2 ring-cyan-400 shadow-2xl z-20 rounded-lg') 
                        : 'z-0'
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
                    {activeMediaUrl ? (
                      <div 
                        className={`relative w-full h-full overflow-hidden ${isBgRemoved ? '' : 'rounded-lg'}`}
                        style={{ background: isBgRemoved ? 'transparent' : '#000000' }}
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
                            src={activeMediaUrl} 
                            autoPlay={!isStageMediaPaused} 
                            loop 
                            muted 
                            playsInline 
                            onCanPlay={(e) => { if (!isStageMediaPaused) e.target.play().catch(() => {}); }}
                            className="w-full h-full object-cover pointer-events-none"
                            style={chromaStyle}
                          />
                        )}

                        {isSelected && !isBgRemoved && (
                          <span className="absolute bottom-1 right-1 bg-black/80 text-cyan-300 text-[8px] font-black px-1.5 py-0.2 rounded border border-cyan-500/40 pointer-events-none">
                            🎥 Nền Chính
                          </span>
                        )}
                      </div>
                    ) : (
                      /* Khung Trống Nền Chính Khi Đã Xóa Media */
                      <div className="relative w-full h-full overflow-hidden rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-cyan-400/80 bg-slate-950/85 text-center p-2">
                        <span className="text-xl mb-1">🎥</span>
                        <span className="text-[10px] font-black text-cyan-300 uppercase">Khung Nền Chính (Trống)</span>
                        <span className="text-[8px] text-slate-400 mt-0.5">Bấm "Tải Lên" ở thanh trên để nạp Video/Ảnh</span>
                        {isSelected && (
                          <span className="absolute bottom-1 right-1 bg-black/80 text-cyan-300 text-[8px] font-black px-1.5 py-0.2 rounded border border-cyan-500/40 pointer-events-none">
                            🎥 Nền Chính
                          </span>
                        )}
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

              {/* Lớp 1.5: Video Phụ PiP (Picture-in-Picture) - Khung Trống & 8 Điểm Resize Handles */}
              {(activeSecondaryMediaUrl || currentStep?.secondaryMediaTransform || (!isStageLocked && selectedLayer?.type === 'pip')) && (() => {
                const pipTrans = getLayerCurrentTransform('pip');
                const isSelected = !isStageLocked && selectedLayer?.type === 'pip';
                const chromaStyle = getLayerChromaStyle('pip');
                const chromaKey = currentStep?.secondaryMediaChromaKey;
                const isBgRemoved = Boolean(chromaKey?.enabled || (activeSecondaryMediaUrl && (activeSecondaryMediaUrl.startsWith('data:image/png') || activeSecondaryMediaUrl.includes('transparent'))));

                return (
                  <div 
                    onMouseDown={(e) => handlePointerDown(e, 'pip', null, null)}
                    onTouchStart={(e) => handlePointerDown(e, 'pip', null, null)}
                    className={`absolute transition-shadow cursor-move ${
                      isSelected 
                        ? (isBgRemoved ? 'z-20' : 'ring-2 ring-indigo-400 border-2 border-indigo-400 rounded-xl z-20') 
                        : (isBgRemoved ? 'border-none ring-0 shadow-none' : 'border border-indigo-500/50 rounded-xl shadow-2xl')
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
                    {activeSecondaryMediaUrl ? (
                      <div 
                        className={`relative w-full h-full overflow-hidden ${isBgRemoved ? '' : 'rounded-xl'}`}
                        style={{ background: isBgRemoved ? 'transparent' : '#000000' }}
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
                        {!isBgRemoved && (
                          <span className="absolute bottom-1 right-1 bg-indigo-600/90 text-white text-[8px] font-black px-1.5 py-0.2 rounded pointer-events-none">
                            🎬 PiP
                          </span>
                        )}
                      </div>
                    ) : (
                      /* Khung Trống PiP Khi Đã Xóa Media */
                      <div className="relative w-full h-full rounded-xl overflow-hidden flex flex-col items-center justify-center border-2 border-dashed border-indigo-400/80 bg-slate-950/85 text-center p-2">
                        <span className="text-lg mb-1">🎬</span>
                        <span className="text-[10px] font-black text-indigo-300 uppercase">Khung PiP (Trống)</span>
                        <span className="text-[8px] text-slate-400 mt-0.5">Bấm "Tải Lên" ở thanh trên để nạp Video/Ảnh</span>
                        <span className="absolute bottom-1 right-1 bg-indigo-600/90 text-white text-[8px] font-black px-1.5 py-0.2 rounded">
                          🎬 PiP
                        </span>
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

              {/* Lớp 2: 1 Đến 4 Avatar AI (Interactive Drag & 8-Point Resize Handles & Khung Trống Khi Xóa Media) */}
              {visibleAvatars.map((av, avIdx) => {
                const isCurrentSpeaker = (currentStep?.avatarSpeaker === av.id) || (currentStep?.avatarSpeaker === 'all') || (!currentStep?.avatarSpeaker && avIdx === 0);
                const transform = getLayerCurrentTransform('avatar', av.id);
                const rawVidSrc = isCurrentSpeaker ? (av.talkVideo || av.idleVideo || av.mediaUrl) : (av.idleVideo || av.talkVideo || av.mediaUrl);
                const vidSrc = rawVidSrc || '';
                const chromaStyle = getLayerChromaStyle('avatar', av.id);
                const isSelected = !isStageLocked && selectedLayer?.type === 'avatar' && selectedLayer?.id === av.id;
                const isBgRemoved = Boolean(av?.chromaKey?.enabled || (vidSrc && (vidSrc.startsWith('data:image/png') || vidSrc.includes('transparent'))));

                return (
                  <div 
                    key={av.id}
                    onMouseDown={(e) => handlePointerDown(e, 'avatar', av.id, null)}
                    onTouchStart={(e) => handlePointerDown(e, 'avatar', av.id, null)}
                    className={`absolute transition-shadow cursor-move ${
                      isSelected 
                        ? (isBgRemoved ? 'z-20' : 'ring-2 ring-cyan-400 shadow-xl shadow-cyan-500/30 z-20 rounded-[16px]') 
                        : isCurrentSpeaker
                        ? (isBgRemoved ? '' : 'ring-1.5 ring-emerald-400/80 shadow-md rounded-[16px]')
                        : (isBgRemoved ? '' : 'hover:ring-1 hover:ring-white/40 rounded-[16px]')
                    }`}
                    style={{
                      left: `${transform.x}%`,
                      top: `${transform.y}%`,
                      width: `${transform.width}%`,
                      height: `${transform.height}%`,
                      zIndex: transform.zIndex || (10 + avIdx),
                      borderRadius: isBgRemoved ? '0px' : '16px',
                      overflow: 'visible'
                    }}
                  >
                    {vidSrc ? (
                      <div 
                        className={`relative w-full h-full overflow-hidden ${isBgRemoved ? '' : 'rounded-[16px]'}`}
                        style={{ background: isBgRemoved ? 'transparent' : '#000000' }}
                      >
                        {isImageMedia(vidSrc) ? (
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
                            src={vidSrc} 
                            autoPlay={!isStageMediaPaused} 
                            loop 
                            muted 
                            playsInline 
                            onCanPlay={(e) => { if (!isStageMediaPaused) e.target.play().catch(() => {}); }}
                            className="w-full h-full object-cover pointer-events-none"
                            style={chromaStyle}
                          />
                        )}
                      </div>
                    ) : (
                      /* Khung Trống Avatar (Ảnh 4: Khung viền và 8 điểm co giãn hiển thị để nạp media mới hoặc xóa lần 2) */
                      <div className="relative w-full h-full rounded-[16px] overflow-hidden flex flex-col items-center justify-center border-2 border-dashed border-cyan-400/80 bg-slate-950/90 text-center p-2">
                        <span className="text-xl mb-1 drop-shadow">🎭</span>
                        <span className="text-[10px] font-black text-cyan-300 uppercase tracking-wide">{av.name || `Avatar ${avIdx + 1}`} (Trống)</span>
                        <span className="text-[8px] text-slate-400 mt-0.5 leading-tight">Bấm "Tải Lên" ở thanh trên để thêm Video/Ảnh</span>
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

              {/* Lớp 3: Banner Hình Ảnh / Poster Deal */}
              {(activeOverlayImage || currentStep?.overlayImageTransform || (!isStageLocked && selectedLayer?.type === 'banner')) && (() => {
                const bannerTrans = getLayerCurrentTransform('banner');
                const isSelected = !isStageLocked && selectedLayer?.type === 'banner';
                const chromaStyle = getLayerChromaStyle('banner');
                const isBgRemoved = Boolean(currentStep?.overlayImageChromaKey?.enabled || (activeOverlayImage && (activeOverlayImage.startsWith('data:image/png') || activeOverlayImage.includes('transparent'))));

                return (
                  <div 
                    onMouseDown={(e) => handlePointerDown(e, 'banner', null, null)}
                    onTouchStart={(e) => handlePointerDown(e, 'banner', null, null)}
                    className={`absolute transition-shadow cursor-move ${
                      isSelected 
                        ? (isBgRemoved ? 'z-20' : 'ring-2 ring-amber-400 rounded-xl z-20') 
                        : ''
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
                    {activeOverlayImage ? (
                      <img 
                        src={activeOverlayImage} 
                        alt="Overlay Banner" 
                        className={`w-full h-full object-contain pointer-events-none ${isBgRemoved ? '' : 'drop-shadow-xl rounded-lg'}`}
                        style={chromaStyle}
                      />
                    ) : (
                      /* Khung Trống Banner Khi Đã Xóa Media */
                      <div className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-amber-400/80 bg-slate-950/85 rounded-xl text-center p-2">
                        <span className="text-lg mb-1">🖼️</span>
                        <span className="text-[10px] font-black text-amber-300 uppercase">Khung Banner (Trống)</span>
                        <span className="text-[8px] text-slate-400 mt-0.5">Bấm "Tải Lên" ở thanh trên để thêm Ảnh</span>
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

              {/* Lớp 4: Tiêu Đề Chữ Typography Xếp Chồng */}
              {(activeOverlayText || currentStep?.overlayTextTransform || (!isStageLocked && selectedLayer?.type === 'text')) && (() => {
                const textTrans = getLayerCurrentTransform('text');
                const isSelected = !isStageLocked && selectedLayer?.type === 'text';
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
                    {activeOverlayText ? (
                      <div className={`inline-block w-full px-2.5 py-1 rounded-xl font-black shadow-2xl tracking-wide ${styleConfig.className}`}
                        style={{
                          fontSize: `${Math.max(10, Math.min(22, (currentStep.overlayTextFontSize || 20) * 0.65))}px`,
                          fontFamily: fontConfig.font
                        }}
                      >
                        {activeOverlayText}
                      </div>
                    ) : (
                      /* Khung Trống Chữ */
                      <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-rose-400/80 bg-slate-950/85 rounded-xl text-center px-2 py-1">
                        <span className="text-[10px] font-black text-rose-300 uppercase">Khung Chữ (Trống - Nhập nội dung ở thanh trên)</span>
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
                  onClick={() => {
                    const nextLocked = !isStageLocked;
                    setIsStageLocked(nextLocked);
                    if (nextLocked) {
                      setSelectedLayer(null);
                      toast.success('🔒 ĐÃ KHÓA SÂN KHẤU: Toàn bộ khung & layer được cố định, ẩn viền thao tác!');
                    } else {
                      toast.info('🔓 ĐÃ MỞ KHÓA SÂN KHẤU: Sẵn sàng kéo thả và tinh chỉnh layer!');
                    }
                  }}
                  className={`px-1.5 py-1 rounded-md font-black text-[9px] border cursor-pointer flex items-center justify-center gap-0.5 whitespace-nowrap shadow-xs transition-all ${
                    isStageLocked 
                      ? 'bg-amber-950/90 hover:bg-amber-900 text-amber-300 border-amber-500/60 animate-pulse ring-1 ring-amber-400' 
                      : 'bg-indigo-900/90 hover:bg-indigo-800 text-slate-200 border-indigo-500/40'
                  }`}
                  title={isStageLocked ? "Bấm để Mở Khóa sân khấu (cho phép chỉnh sửa)" : "Bấm để Khóa sân khấu (cố định tất cả layer)"}
                >
                  {isStageLocked ? <Lock size={9.5} className="text-amber-400" /> : <Unlock size={9.5} className="text-slate-300" />}
                  <span>{isStageLocked ? 'Đã Khóa' : 'Khóa'}</span>
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
                      stopVoiceAudio();
                      setIsSpeakingPreview(false);
                      setSpeakingStepId(null);
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

                              {categorizedVoiceList.elevenLabsVoices?.length > 0 && (
                                <optgroup label="⚡ Giọng ElevenLabs Tùy Chỉnh (API Key)" className="bg-slate-900 text-emerald-400 font-bold">
                                  {categorizedVoiceList.elevenLabsVoices.map(v => (
                                    <option key={v.id} value={v.id} className="bg-slate-900 text-white font-normal">
                                      {v.name}
                                    </option>
                                  ))}
                                </optgroup>
                              )}

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

                      {/* 🎛️ THANH CÀI ĐẶT NHỊP ĐIỆU ĐỌC, KHOẢNG NGHỈ & TỐC ĐỘ (XUYÊN SUỐT HOẶC CÓ KHOẢNG NGHỈ THEO CÀI ĐẶT) */}
                      <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-slate-800/80 text-[11px]" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-black text-amber-300 flex items-center gap-1">
                            <Clock size={11} className="text-amber-400" />
                            <span>Nghỉ Ngắt Câu / Dấu Chấm:</span>
                          </span>
                          <select
                            value={step.sentencePauseSeconds !== undefined ? step.sentencePauseSeconds : 0}
                            onChange={(e) => handleUpdateStep(step.id, 'sentencePauseSeconds', parseFloat(e.target.value))}
                            className="bg-slate-900 border border-slate-700 text-cyan-300 rounded px-1.5 py-0.5 text-[11px] font-bold outline-none cursor-pointer"
                            title="Cài đặt khoảng dừng khi gặp dấu chấm hoặc ngắt câu. Mặc định 0s: Đọc xuyên suốt không ngắt quãng!"
                          >
                            <option value={0}>⚡ 0s (Đọc Xuyên Suốt - Mặc Định)</option>
                            <option value={0.2}>⏱️ 0.2s (Nghỉ micro 0.2s)</option>
                            <option value={0.5}>⏱️ 0.5s (Nghỉ nhẹ 0.5s)</option>
                            <option value={1.0}>⏱️ 1.0s (Nghỉ 1 giây)</option>
                            <option value={2.0}>⏱️ 2.0s (Nghỉ 2 giây)</option>
                          </select>
                        </div>

                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-black text-emerald-300 flex items-center gap-1">
                            <Clock size={11} className="text-emerald-400" />
                            <span>Nghỉ Chuyển Bước:</span>
                          </span>
                          <select
                            value={step.pauseSeconds !== undefined ? step.pauseSeconds : 0}
                            onChange={(e) => handleUpdateStep(step.id, 'pauseSeconds', parseFloat(e.target.value))}
                            className="bg-slate-900 border border-slate-700 text-emerald-300 rounded px-1.5 py-0.5 text-[11px] font-bold outline-none cursor-pointer"
                            title="Khoảng thời gian dừng nghỉ giữa bước này và bước tiếp theo. Mặc định 0s: Chuyển tiếp tức thì!"
                          >
                            <option value={0}>⚡ 0s (Chuyển Tiếp Tức Thì)</option>
                            <option value={0.5}>⏱️ 0.5s (Nghỉ 0.5 giây)</option>
                            <option value={1.0}>⏱️ 1.0s (Nghỉ 1 giây)</option>
                            <option value={2.0}>⏱️ 2.0s (Nghỉ 2 giây)</option>
                            <option value={3.0}>⏱️ 3.0s (Nghỉ 3 giây)</option>
                            <option value={5.0}>⏱️ 5.0s (Nghỉ 5 giây)</option>
                          </select>
                        </div>

                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-black text-indigo-300 flex items-center gap-1">
                            <Zap size={11} className="text-indigo-400" />
                            <span>Tốc Độ Voice:</span>
                          </span>
                          <select
                            value={step.voiceRate || 1.0}
                            onChange={(e) => handleUpdateStep(step.id, 'voiceRate', parseFloat(e.target.value))}
                            className="bg-slate-900 border border-slate-700 text-indigo-300 rounded px-1.5 py-0.5 text-[11px] font-bold outline-none cursor-pointer"
                            title="Tốc độ nói của giọng đọc AI"
                          >
                            <option value={0.9}>🐢 0.9x (Chậm rãi, truyền cảm)</option>
                            <option value={1.0}>🎯 1.0x (Chuẩn mực tự nhiên)</option>
                            <option value={1.05}>🔥 1.05x (Linh hoạt, hấp dẫn)</option>
                            <option value={1.1}>⚡ 1.1x (Sôi nổi, chốt đơn)</option>
                            <option value={1.2}>🚀 1.2x (Siêu nhanh)</option>
                          </select>
                        </div>
                      </div>
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

                            {/* 🎭 NẠP AVATAR / NHÂN VẬT NÓI (TỪ MÁY TÍNH - HỖ TRỢ NHIỀU TỆP) */}
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="text-[10px] font-black uppercase text-gray-400">
                                  Avatar / Nhân Vật Nói:
                                </label>
                                <span className="text-[10px] text-cyan-300 font-bold">
                                  {step.avatarSpeaker ? `Đang chọn: ${step.avatarSpeaker.toUpperCase()}` : 'AVATAR_1'}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5 flex-wrap">
                                <label className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-black rounded-lg cursor-pointer flex items-center gap-1 shadow-sm" title="Tải Video/Ảnh cho Avatar từ máy tính (chọn 1 hoặc nhiều tệp)">
                                  <Upload size={12} />
                                  <span>Tải Avatar Từ Máy</span>
                                  <input 
                                    type="file" 
                                    accept="video/*,image/*" 
                                    multiple
                                    onChange={(e) => handleDirectAvatarMediaUpload(step.avatarSpeaker || 'avatar_1', e)} 
                                    className="hidden" 
                                  />
                                </label>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedLayer({ type: 'avatar', id: step.avatarSpeaker || 'avatar_1' });
                                    handleDuplicateSelectedLayer();
                                  }}
                                  className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-black rounded-lg cursor-pointer flex items-center gap-1 shadow-sm"
                                  title="Nhân bản avatar này sang slot tiếp theo trên sân khấu"
                                >
                                  <Copy size={12} />
                                  <span>Nhân Bản</span>
                                </button>
                              </div>
                            </div>

                            {/* 📂 NẠP VIDEO NỀN CHÍNH (TỪ MÁY TÍNH + NÚT GHIM + NHÂN BẢN) */}
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
                                <label className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-black text-[11px] font-black rounded-lg cursor-pointer flex items-center gap-1 shadow-sm" title="Tải Video/Ảnh từ máy tính lên (chọn 1 hoặc nhiều tệp)">
                                  <Upload size={12} />
                                  <span>Tải Video Từ Máy Tính</span>
                                  <input 
                                    type="file" 
                                    accept="video/*,image/*" 
                                    multiple
                                    onChange={(e) => handleDirectMediaUpload(step.id, 'mediaUrl', e)} 
                                    className="hidden" 
                                  />
                                </label>

                                {step.mediaUrl && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedLayer({ type: 'main_media', id: 'main' });
                                      handleDuplicateSelectedLayer();
                                    }}
                                    className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-black rounded-lg cursor-pointer flex items-center gap-1 shadow-sm"
                                    title="Nhân bản video này sang lớp PiP hoặc bước mới"
                                  >
                                    <Copy size={12} />
                                    <span>Nhân Bản Video</span>
                                  </button>
                                )}

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
                                <label className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-bold rounded-lg cursor-pointer flex items-center gap-1 border border-slate-700" title="Tải Video PiP từ máy (chọn 1 hoặc nhiều tệp)">
                                  <Upload size={12} />
                                  <span>Tải Video PiP Từ Máy</span>
                                  <input 
                                    type="file" 
                                    accept="video/*,image/*" 
                                    multiple
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
                                <label className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 text-[11px] font-bold rounded-lg cursor-pointer flex items-center gap-1 border border-slate-700" title="Tải Ảnh Banner từ máy (chọn 1 hoặc nhiều tệp)">
                                  <Upload size={12} />
                                  <span>Tải Ảnh Banner Từ Máy</span>
                                  <input 
                                    type="file" 
                                    accept="image/*,video/*" 
                                    multiple
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
