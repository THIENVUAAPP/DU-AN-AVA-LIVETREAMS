import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Square, SkipForward, SkipBack, Plus, Trash2, Edit3, Copy, 
  Save, Download, Upload, Sparkles, Clock, Video, Mic, MessageCircle, 
  ShoppingCart, Megaphone, Film, Layers, CheckCircle2, AlertCircle, 
  ChevronUp, ChevronDown, RotateCcw, Bot, Volume2, Users, ShieldCheck, 
  Zap, Star, Tag, Eye, Info, FileText, Image as ImageIcon, Type, Pin, 
  Maximize2, Sliders, Check, X, Palette, Move, Monitor
} from 'lucide-react';
import UniversalMediaPicker, { SAMPLE_IDOL_VIDEOS } from './UniversalMediaPicker';
import { readUniversalFile } from '../../utils/universalDocumentParser';

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

// 🎯 Danh mục các loại hành động trong kịch bản
export const ACTION_TYPES = [
  { id: 'avatar_talk', label: '🗣️ AI Avatar Mở Màn & Chia Sẻ', icon: Bot, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200', desc: 'Avatar AI xuất hiện nhép miệng đọc kịch bản giới thiệu theo giọng nói AI.' },
  { id: 'tiktok_qa', label: '💬 AI Trả Lời Bình Luận TikTok Live', icon: MessageCircle, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200', desc: 'Lắng nghe bình luận TikTok và tự động phản hồi bằng Voice AI hoặc Avatar Lip-sync.' },
  { id: 'product_video', label: '🎬 Phát Video Giới Thiệu Sản Phẩm', icon: Video, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', desc: 'Tự động phát video cận cảnh sản phẩm, tính năng và công dụng.' },
  { id: 'feedback_video', label: '⭐ Phát Video Feedback / Review Khách Hàng', icon: Film, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200', desc: 'Phát video cảm nhận, bằng chứng và đánh giá thực tế của người dùng cũ.' },
  { id: 'keyword_consult', label: '🏷️ Avatar Tư Vấn & Bắt Từ Khóa Giỏ Hàng', icon: ShoppingCart, color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-200', desc: 'Bắt từ khóa (giá, mua, size) để tự động ghim sản phẩm và chuyển Avatar tư vấn.' },
  { id: 'cta_sale', label: '🔥 Kêu Gọi Hành Động (CTA) & Chốt Sale', icon: Megaphone, color: 'text-rose-600', bg: 'bg-rose-50 border-rose-200', desc: 'Đọc thông báo ưu đãi có hạn, đếm ngược thời gian và kêu gọi bấm vào giỏ hàng.' },
  { id: 'custom_video', label: '📹 Phát Video Tùy Chọn Bất Kỳ', icon: Video, color: 'text-cyan-600', bg: 'bg-cyan-50 border-cyan-200', desc: 'Phát bất kỳ video nào từ máy tính hoặc link kho lưu trữ.' }
];

// 🔤 Danh sách Phông Chữ hỗ trợ
export const FONT_FAMILIES = [
  { id: 'system', name: 'Mặc định (Inter / Sans)', font: 'Inter, sans-serif' },
  { id: 'be_vietnam', name: 'Be Vietnam Pro (Chuẩn Việt Nam)', font: '"Be Vietnam Pro", sans-serif' },
  { id: 'montserrat', name: 'Montserrat (Sang Trọng / Hiện Đại)', font: 'Montserrat, sans-serif' },
  { id: 'roboto', name: 'Roboto (Rõ Nét Dễ Đọc)', font: 'Roboto, sans-serif' },
  { id: 'oswald', name: 'Oswald (In Hoa Mạnh Mẽ)', font: 'Oswald, sans-serif' },
  { id: 'playfair', name: 'Playfair Display (Quý Phái)', font: '"Playfair Display", serif' }
];

// 📚 Danh sách các Bộ Preset Mẫu Có Sẵn Chuyên Nghiệp
export const DEFAULT_PRESETS = [
  {
    id: 'preset_mypham',
    name: '💄 Preset: Bán Hàng Mỹ Phẩm & Chăm Sóc Da Chuyên Sâu',
    category: 'Mỹ Phẩm / Skincare',
    description: 'Chuỗi 6 bước tự động tối ưu tỷ lệ chuyển đổi cho ngành mỹ phẩm, skincare và thực phẩm chức năng.',
    loop: true,
    steps: [
      {
        id: 's1',
        title: 'Bước 1: Avatar AI Chào Khán Giả & Chia Sẻ Kiến Thức Da',
        actionType: 'avatar_talk',
        durationSeconds: 90,
        scriptText: 'Chào mừng tất cả các chị đẹp đã đến với phiên livestream đặc biệt hôm nay! Hôm nay em sẽ chia sẻ bí quyết phục hồi làn da căng bóng chuẩn Hàn chỉ sau 7 ngày nha...',
        mediaUrl: '/idols/phong_studio_ngoc_trinh_4k.mp4',
        lipsyncUrl: '/idols/phong_studio_ngoc_trinh_4k.mp4',
        voiceMode: 'avatar_lipsync',
        commentHandling: 'ai_brain',
        overlayText: '🌸 CHÀO MỪNG ĐẾN VỚI PHIÊN LIVE LÀN DA CĂNG BÓNG',
        overlayTextPos: 'top',
        overlayTextStyle: 'banner',
        overlayTextFontSize: 20,
        overlayTextFontFamily: 'be_vietnam',
        overlayImageScale: 100,
        isMediaPinned: true
      },
      {
        id: 's2',
        title: 'Bước 2: AI Tự Động Trả Lời Bình Luận & Tư Vấn Loại Da',
        actionType: 'tiktok_qa',
        durationSeconds: 120,
        scriptText: 'Các chị em cứ thoải mái để lại comment loại da (da dầu, da khô, da nhạy cảm) để em tư vấn routine chuẩn y khoa nha!',
        mediaUrl: '/idols/phong_studio_ngoc_trinh_4k.mp4',
        lipsyncUrl: '/idols/phong_studio_ngoc_trinh_4k.mp4',
        voiceMode: 'avatar_lipsync',
        commentHandling: 'ai_brain',
        overlayText: '💬 ĐỂ LẠI BÌNH LUẬN ĐỂ ĐƯỢC TƯ VẤN ROUTINE MIỄN PHÍ',
        overlayTextPos: 'top',
        overlayTextStyle: 'neon_cyber',
        overlayTextFontSize: 18,
        overlayTextFontFamily: 'be_vietnam',
        overlayImageScale: 100,
        isMediaPinned: true
      },
      {
        id: 's3',
        title: 'Bước 3: Chiếu Video Demo Cận Cảnh Serum Phục Hồi',
        actionType: 'product_video',
        durationSeconds: 60,
        productName: 'Serum Tinh Chất Căng Bóng 30ml',
        productPrice: '299.000đ',
        productDiscount: '599.000đ',
        mediaUrl: '/idols/phong_studio_mai_phuong_thuy_4k.mp4',
        voiceMode: 'background_voice',
        commentHandling: 'ai_voice_only',
        overlayText: '🔥 SERUM PHỤC HỒI CHUYÊN SÂU - FLASH SALE 50%',
        overlayTextPos: 'top',
        overlayTextStyle: 'gold_luxury',
        overlayTextFontSize: 22,
        overlayTextFontFamily: 'montserrat',
        overlayImageScale: 100,
        isMediaPinned: false
      },
      {
        id: 's4',
        title: 'Bước 4: Chiếu Video Feedback Khách Hàng Da Cải Thiện',
        actionType: 'feedback_video',
        durationSeconds: 45,
        mediaUrl: '/idols/phong_studio_linh_ka_4k.mp4',
        voiceMode: 'background_voice',
        commentHandling: 'ai_voice_only',
        overlayText: '⭐ 99% KHÁCH HÀNG HÀI LÒNG SAU 7 NGÀY SỬ DỤNG',
        overlayTextPos: 'top',
        overlayTextStyle: 'banner',
        overlayTextFontSize: 20,
        overlayTextFontFamily: 'be_vietnam',
        overlayImageScale: 100,
        isMediaPinned: false
      },
      {
        id: 's5',
        title: 'Bước 5: Avatar Tư Vấn & Bắt Từ Khóa "Mua / Giá / Da Dầu"',
        actionType: 'keyword_consult',
        durationSeconds: 90,
        scriptText: 'Chị nào da dầu hay nhạy cảm cứ để lại bình luận em tư vấn liền tay nha! Serum này thấm cực nhanh không hề bết rít ạ.',
        mediaUrl: '/idols/phong_studio_ngoc_trinh_4k.mp4',
        lipsyncUrl: '/idols/phong_studio_ngoc_trinh_4k.mp4',
        voiceMode: 'avatar_lipsync',
        commentHandling: 'ai_brain',
        overlayText: '⚡ COMMENT "MUA" HOẶC "GIÁ" ĐỂ NHẬN ƯU ĐÃI NGAY',
        overlayTextPos: 'top',
        overlayTextStyle: 'neon_cyber',
        overlayTextFontSize: 18,
        overlayTextFontFamily: 'be_vietnam',
        overlayImageScale: 100,
        isMediaPinned: true
      },
      {
        id: 's6',
        title: 'Bước 6: Kêu Gọi Chốt Sale & Đếm Ngược Flash Sale 50%',
        actionType: 'cta_sale',
        durationSeconds: 60,
        scriptText: 'Duy nhất trong phiên live hôm nay, giảm ngay 50% chỉ còn 299k kèm quà tặng mặt nạ cao cấp! Mọi người nhấn vào giỏ hàng góc trái màn hình săn ngay kẻo hết suất nha!',
        mediaUrl: '/idols/phong_studio_ngoc_trinh_4k.mp4',
        lipsyncUrl: '/idols/phong_studio_ngoc_trinh_4k.mp4',
        voiceMode: 'avatar_lipsync',
        commentHandling: 'ai_brain',
        overlayText: '⏰ CHỈ CÒN 10 SUẤT CUỐI CÙNG - BẤM GIỎ HÀNG SĂN NGAY!',
        overlayTextPos: 'top',
        overlayTextStyle: 'banner',
        overlayTextFontSize: 22,
        overlayTextFontFamily: 'be_vietnam',
        overlayImageScale: 100,
        isMediaPinned: true
      }
    ]
  },
  {
    id: 'preset_thoitrang',
    name: '👗 Preset: Thời Trang Nữ & Quần Áo Thiết Kế Cao Cấp',
    category: 'Thời Trang',
    description: 'Quy trình tư vấn size, phối đồ và chiếu video người mẫu mặc thực tế.',
    loop: true,
    steps: [
      {
        id: 's1',
        title: 'Bước 1: Avatar Giới Thiệu Bộ Sưu Tập Mới',
        actionType: 'avatar_talk',
        durationSeconds: 90,
        scriptText: 'Hôm nay shop em ra mắt bộ sưu tập váy đầm thiết kế mùa hè cực kỳ sang chảnh và tôn dáng cho các nàng...',
        mediaUrl: '/idols/phong_studio_mai_phuong_thuy_4k.mp4',
        lipsyncUrl: '/idols/phong_studio_mai_phuong_thuy_4k.mp4',
        voiceMode: 'avatar_lipsync',
        commentHandling: 'ai_brain',
        overlayText: '👗 BST VÁY ĐẦM THIẾT KẾ MỚI NHẤT 2026',
        overlayTextPos: 'top',
        overlayTextStyle: 'gradient_rose',
        overlayTextFontSize: 20,
        overlayTextFontFamily: 'be_vietnam',
        overlayImageScale: 100,
        isMediaPinned: true
      },
      {
        id: 's2',
        title: 'Bước 2: Chiếu Video Người Mẫu Thử Đồ & Xoay Dáng 360',
        actionType: 'product_video',
        durationSeconds: 75,
        productName: 'Đầm Lụa Thiết Kế Sang Trọng',
        productPrice: '389.000đ',
        productDiscount: '690.000đ',
        mediaUrl: '/idols/phong_studio_linh_ka_4k.mp4',
        voiceMode: 'background_voice',
        commentHandling: 'ai_voice_only',
        overlayText: '✨ FORM DÁNG CHUẨN TÔN EO - TẶNG KÈM DÂY NỊT CAO CẤP',
        overlayTextPos: 'top',
        overlayTextStyle: 'gold_luxury',
        overlayTextFontSize: 20,
        overlayTextFontFamily: 'montserrat',
        overlayImageScale: 100,
        isMediaPinned: false
      },
      {
        id: 's3',
        title: 'Bước 3: AI Bắt Từ Khóa Tư Vấn Size (45kg - 65kg)',
        actionType: 'keyword_consult',
        durationSeconds: 90,
        scriptText: 'Mọi người comment chiều cao cân nặng để em tư vấn size chuẩn xác nhất nha! Mẫu này có đủ size từ S đến XL form chuẩn che khuyết điểm cực tốt.',
        mediaUrl: '/idols/phong_studio_mai_phuong_thuy_4k.mp4',
        lipsyncUrl: '/idols/phong_studio_mai_phuong_thuy_4k.mp4',
        voiceMode: 'avatar_lipsync',
        commentHandling: 'ai_brain',
        overlayText: '📏 COMMENT CHIỀU CAO + CÂN NẶNG ĐỂ TƯ VẤN SIZE CHUẨN',
        overlayTextPos: 'top',
        overlayTextStyle: 'neon_cyber',
        overlayTextFontSize: 18,
        overlayTextFontFamily: 'be_vietnam',
        overlayImageScale: 100,
        isMediaPinned: true
      },
      {
        id: 's4',
        title: 'Bước 4: Chiếu Video Feedback Khách Nhận Đồ Thực Tế',
        actionType: 'feedback_video',
        durationSeconds: 45,
        mediaUrl: '/idols/phong_studio_ngoc_trinh_4k.mp4',
        voiceMode: 'background_voice',
        commentHandling: 'ai_voice_only',
        overlayText: '❤️ REVIEW KHÁCH YÊU NHẬN HÀNG THỰC TẾ SIÊU ĐẸP',
        overlayTextPos: 'top',
        overlayTextStyle: 'banner',
        overlayTextFontSize: 20,
        overlayTextFontFamily: 'be_vietnam',
        overlayImageScale: 100,
        isMediaPinned: false
      },
      {
        id: 's5',
        title: 'Bước 5: Kêu Gọi Chốt Đơn & Tặng Voucher Freeship',
        actionType: 'cta_sale',
        durationSeconds: 60,
        scriptText: 'Số lượng chỉ còn 15 chiếc cuối cùng! Chị nào bấm vào giỏ hàng ngay bây giờ sẽ được áp mã freeship toàn quốc nha!',
        mediaUrl: '/idols/phong_studio_mai_phuong_thuy_4k.mp4',
        lipsyncUrl: '/idols/phong_studio_mai_phuong_thuy_4k.mp4',
        voiceMode: 'avatar_lipsync',
        commentHandling: 'ai_brain',
        overlayText: '🎁 MIỄN PHÍ GIAO HÀNG TOÀN QUỐC CHO 20 ĐƠN ĐẦU TIÊN',
        overlayTextPos: 'top',
        overlayTextStyle: 'banner',
        overlayTextFontSize: 20,
        overlayTextFontFamily: 'be_vietnam',
        overlayImageScale: 100,
        isMediaPinned: true
      }
    ]
  }
];

export default function LivestreamFlowSequencer() {
  // 💾 State quản lý danh sách Preset kịch bản
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
      return localStorage.getItem('avalive_active_flow_preset_id') || DEFAULT_PRESETS[0].id;
    } catch (e) {
      return DEFAULT_PRESETS[0].id;
    }
  });

  const activePreset = presets.find(p => p.id === activePresetId) || presets[0] || DEFAULT_PRESETS[0];

  // ⏱️ State điều khiển tiến trình phát sóng trực tiếp (Execution Engine)
  const [isPlayingFlow, setIsPlayingFlow] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [expandedStepId, setExpandedStepId] = useState(null);
  const [editingStep, setEditingStep] = useState(null);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState('mediaUrl'); // 'mediaUrl', 'secondaryMediaUrl', or 'overlayImage'
  const [presetNameInput, setPresetNameInput] = useState('');
  const [showPresetModal, setShowPresetModal] = useState(false);

  const timerRef = useRef(null);
  const fileInputRefMap = useRef({});

  // Lưu presets vào localStorage khi có thay đổi
  useEffect(() => {
    try {
      localStorage.setItem('avalive_flow_presets', JSON.stringify(presets));
      localStorage.setItem('avalive_active_flow_preset_id', activePresetId);
    } catch (e) {}
  }, [presets, activePresetId]);

  // ⚡ Lắng nghe sự kiện thông minh chuyển bước từ hệ thống (Smart Jump) khi có bình luận khớp sản phẩm
  useEffect(() => {
    const handleSmartJump = (e) => {
      const targetQuery = (e.detail?.query || '').toLowerCase().trim();
      const targetStepIdx = e.detail?.stepIndex;
      
      if (typeof targetStepIdx === 'number' && targetStepIdx >= 0 && targetStepIdx < activePreset.steps.length) {
        startStep(targetStepIdx, isPlayingFlow);
        toast.success(`⚡ AI Smart Jump: Nhảy đến bước ${targetStepIdx + 1}`);
        return;
      }

      if (targetQuery && activePreset?.steps) {
        const foundIdx = activePreset.steps.findIndex(s => 
          (s.productName && s.productName.toLowerCase().includes(targetQuery)) ||
          (s.title && s.title.toLowerCase().includes(targetQuery)) ||
          (s.scriptText && s.scriptText.toLowerCase().includes(targetQuery))
        );
        if (foundIdx !== -1 && foundIdx !== currentStepIndex) {
          startStep(foundIdx, isPlayingFlow);
          toast.success(`⚡ AI Smart Jump: Chuyển sang bước ${foundIdx + 1} (${activePreset.steps[foundIdx].title})`);
        }
      }
    };

    window.addEventListener('avalive:sequencer_smart_jump', handleSmartJump);
    return () => window.removeEventListener('avalive:sequencer_smart_jump', handleSmartJump);
  }, [activePreset, currentStepIndex, isPlayingFlow]);

  // Đẩy video và dữ liệu phân đoạn của bước hiện tại lên Sân khấu chính, Window Capture và Backend
  const syncStepToServer = (step, index = 0, isLivePlaying = true) => {
    if (!step) return;
    const mediaToPlay = step.mediaUrl || step.lipsyncUrl || '/idols/phong_studio_ngoc_trinh_4k.mp4';
    
    const payload = {
      mediaUrl: mediaToPlay,
      title: step.title,
      actionType: step.actionType,
      scriptText: step.scriptText || '',
      durationSeconds: step.durationSeconds || 60,
      stepIndex: index + 1,
      totalSteps: activePreset?.steps?.length || 1,
      presetName: activePreset?.name || 'Kịch bản Sequencer',
      productName: step.productName || null,
      productPrice: step.productPrice || null,
      productDiscount: step.productDiscount || null,
      productImg: step.productImg || null,
      // Lớp 1.5: Video Phụ PiP Xếp Chồng
      secondaryMediaUrl: step.secondaryMediaUrl || null,
      secondaryMediaPos: step.secondaryMediaPos || 'top-right',
      secondaryMediaScale: step.secondaryMediaScale || 40,
      secondaryMediaMuted: step.secondaryMediaMuted !== false,
      // Lớp 2: Hình ảnh Banner Xếp Chồng
      overlayImage: step.overlayImage || null,
      overlayImagePos: step.overlayImagePos || 'top-left',
      overlayImageScale: step.overlayImageScale || 100,
      // Lớp 3: Tiêu đề Chữ Nổi Bật Tùy Chỉnh
      overlayText: step.overlayText || null,
      overlayTextPos: step.overlayTextPos || 'top',
      overlayTextStyle: step.overlayTextStyle || 'banner',
      overlayTextFontFamily: step.overlayTextFontFamily || 'be_vietnam',
      overlayTextFontSize: step.overlayTextFontSize || 20,
      overlayTextColor: step.overlayTextColor || '#ffffff',
      isMediaPinned: !!step.isMediaPinned,
      isPlaying: isLivePlaying
    };

    // 1. Phát event đồng bộ toàn cục cho Màn hình chính (DesktopAppUI)
    window.dispatchEvent(new CustomEvent('avalive:update_master_media', {
      detail: payload
    }));

    // 2. Gửi request đồng bộ tức thì tới backend server
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
        productName: step.productName || null,
        productPrice: step.productPrice || null,
        secondaryMediaUrl: step.secondaryMediaUrl || null,
        secondaryMediaPos: step.secondaryMediaPos || 'top-right',
        secondaryMediaScale: step.secondaryMediaScale || 40,
        overlayImage: step.overlayImage || null,
        overlayImagePos: step.overlayImagePos || 'top-left',
        overlayImageScale: step.overlayImageScale || 100,
        overlayText: step.overlayText || null,
        overlayTextPos: step.overlayTextPos || 'top',
        overlayTextStyle: step.overlayTextStyle || 'banner',
        overlayTextFontFamily: step.overlayTextFontFamily || 'be_vietnam',
        overlayTextFontSize: step.overlayTextFontSize || 20,
        overlayTextColor: step.overlayTextColor || '#ffffff',
        isMediaPinned: !!step.isMediaPinned,
        isPlaying: isLivePlaying,
        fit: 'cover',
        sound: true,
        updatedAt: Date.now()
      })
    }).catch(() => {});
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
          // Khi hết thời gian phân đoạn hiện tại -> chuyển sang phân đoạn tiếp theo
          const nextIndex = currentStepIndex + 1;
          if (nextIndex < activePreset.steps.length) {
            startStep(nextIndex, true);
            toast.success(`🎬 Tự động chuyển sang: ${activePreset.steps[nextIndex].title}`);
          } else {
            if (activePreset.loop) {
              startStep(0, true);
              toast.success(`🔄 Đã lặp lại vòng kịch bản: ${activePreset.name}`);
            } else {
              handleStopFlow();
              toast.success('🎉 Đã hoàn thành toàn bộ chuỗi kịch bản livestream!');
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

  // 🛑 DỪNG TỨC THÌ 100%: Dừng timer, dừng voice AI, dừng media, đồng bộ dừng toàn hệ thống
  const handleStopFlow = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsPlayingFlow(false);
    
    // Ngắt toàn bộ âm thanh đọc kịch bản AI ngay lập tức
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('avalive:stop_flow_sequencer'));
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      window.__isScriptLiveRunning = false;
      try { localStorage.setItem('aidol_is_script_live_running', 'false'); } catch (e) {}
    }

    // Gửi tín hiệu dừng tới server và stage
    fetch('/api/live-state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        activeTab: 'flow_sequencer',
        isPlaying: false,
        updatedAt: Date.now()
      })
    }).catch(() => {});

    toast.success('⏹️ ĐÃ DỪNG TOÀN BỘ CHUỖI KỊCH BẢN & ÂM THANH!');
  };

  // ▶️ BẮT ĐẦU CHẠY LIVE TỰ ĐỘNG
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
    toast.success('▶️ BẮT ĐẦU PHÁT CHUỖI KỊCH BẢN PHÂN ĐOẠN TỰ ĐỘNG!');
  };

  // 👁️ CHẠY LIVE TEST TRỰC TIẾP TRÊN SÂN KHẤU (XEM TRƯỚC TOÀN BỘ CÁC LỚP)
  const handleLiveTestStep = (step, idx) => {
    setCurrentStepIndex(idx);
    setSecondsRemaining(step.durationSeconds || 60);
    syncStepToServer(step, idx, true);
    toast.success(`👁️ Đang Live Test trên Sân Khấu: ${step.title}`);
  };

  const handleNextStep = () => {
    const nextIndex = (currentStepIndex + 1) % activePreset.steps.length;
    startStep(nextIndex, isPlayingFlow);
    toast.success(`⏭️ Chuyển nhanh sang bước ${nextIndex + 1}`);
  };

  const handlePrevStep = () => {
    const prevIndex = currentStepIndex === 0 ? activePreset.steps.length - 1 : currentStepIndex - 1;
    startStep(prevIndex, isPlayingFlow);
    toast.success(`⏮️ Quay lại bước ${prevIndex + 1}`);
  };

  // Thao tác chỉnh sửa Preset & Steps
  const handleCreatePreset = () => {
    const name = presetNameInput.trim() || `Kịch Bản Mới #${presets.length + 1}`;
    const newPreset = {
      id: 'preset_' + Date.now(),
      name: name,
      category: 'Tùy Chỉnh',
      description: 'Kịch bản do người dùng tùy biến thiết lập.',
      loop: true,
      steps: [
        {
          id: 's_' + Date.now(),
          title: 'Bước 1: Avatar Chào Mở Màn',
          actionType: 'avatar_talk',
          durationSeconds: 60,
          scriptText: 'Chào mừng quý khách đến với phiên livestream!',
          mediaUrl: '/idols/phong_studio_ngoc_trinh_4k.mp4',
          lipsyncUrl: '/idols/phong_studio_ngoc_trinh_4k.mp4',
          voiceMode: 'avatar_lipsync',
          commentHandling: 'ai_brain',
          overlayText: '🎉 CHÀO MỪNG ĐẾN VỚI PHIÊN LIVE',
          overlayTextPos: 'top',
          overlayTextStyle: 'banner',
          overlayTextFontSize: 20,
          overlayTextFontFamily: 'be_vietnam',
          overlayImageScale: 100,
          isMediaPinned: true
        }
      ]
    };
    setPresets([...presets, newPreset]);
    setActivePresetId(newPreset.id);
    setPresetNameInput('');
    setShowPresetModal(false);
    toast.success(`Đã tạo kịch bản mới: ${name}`);
  };

  const handleDuplicatePreset = () => {
    const copy = {
      ...activePreset,
      id: 'preset_' + Date.now(),
      name: `${activePreset.name} (Bản sao)`
    };
    setPresets([...presets, copy]);
    setActivePresetId(copy.id);
    toast.success('Đã nhân bản kịch bản thành công!');
  };

  const handleDeletePreset = () => {
    if (presets.length <= 1) {
      toast.error('Phải giữ lại ít nhất 1 kịch bản!');
      return;
    }
    const filtered = presets.filter(p => p.id !== activePresetId);
    setPresets(filtered);
    setActivePresetId(filtered[0].id);
    toast.success('Đã xóa kịch bản.');
  };

  const handleAddStep = () => {
    const newStep = {
      id: 's_' + Date.now(),
      title: `Bước ${activePreset.steps.length + 1}: Phân đoạn mới`,
      actionType: 'product_video',
      durationSeconds: 60,
      scriptText: '',
      mediaUrl: '/idols/phong_studio_ngoc_trinh_4k.mp4',
      lipsyncUrl: '/idols/phong_studio_ngoc_trinh_4k.mp4',
      voiceMode: 'avatar_lipsync',
      commentHandling: 'ai_brain',
      secondaryMediaUrl: '',
      secondaryMediaPos: 'top-right',
      secondaryMediaScale: 40,
      overlayImage: '',
      overlayImagePos: 'top-left',
      overlayImageScale: 100,
      overlayText: '',
      overlayTextPos: 'top',
      overlayTextStyle: 'banner',
      overlayTextFontSize: 20,
      overlayTextFontFamily: 'be_vietnam',
      overlayTextColor: '#ffffff',
      isMediaPinned: false
    };
    const updated = { ...activePreset, steps: [...activePreset.steps, newStep] };
    setPresets(presets.map(p => p.id === activePreset.id ? updated : p));
    setExpandedStepId(newStep.id);
    toast.success('Đã thêm phân đoạn mới vào kịch bản!');
  };

  const handleUpdateStep = (stepId, key, value) => {
    const updatedSteps = activePreset.steps.map(s => s.id === stepId ? { ...s, [key]: value } : s);
    const updatedPreset = { ...activePreset, steps: updatedSteps };
    setPresets(presets.map(p => p.id === activePreset.id ? updatedPreset : p));
  };

  const handleDeleteStep = (stepId) => {
    if (activePreset.steps.length <= 1) {
      toast.error('Kịch bản phải có ít nhất 1 phân đoạn!');
      return;
    }
    const updatedSteps = activePreset.steps.filter(s => s.id !== stepId);
    const updatedPreset = { ...activePreset, steps: updatedSteps };
    setPresets(presets.map(p => p.id === activePreset.id ? updatedPreset : p));
    toast.success('Đã xóa phân đoạn.');
  };

  const handleMoveStep = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= activePreset.steps.length) return;
    const newSteps = [...activePreset.steps];
    const temp = newSteps[index];
    newSteps[index] = newSteps[targetIndex];
    newSteps[targetIndex] = temp;
    const updatedPreset = { ...activePreset, steps: newSteps };
    setPresets(presets.map(p => p.id === activePreset.id ? updatedPreset : p));
  };

  // Đọc file kịch bản đa định dạng (.txt, .docx, .pdf, .json, .xlsx, .csv, .md)
  const handleScriptFileUpload = async (stepId, e) => {
    const file = e.target?.files?.[0];
    if (!file) return;
    try {
      toast.success(`Đang đọc file: ${file.name}...`);
      const parsed = await readUniversalFile(file);
      const content = Array.isArray(parsed) ? parsed.join('\n') : String(parsed || '');
      if (content.trim()) {
        handleUpdateStep(stepId, 'scriptText', content.trim());
        toast.success(`✅ Đã nạp thành công ${content.trim().length} ký tự vào kịch bản bước!`);
      } else {
        toast.error('Không tìm thấy nội dung văn bản hợp lệ trong file!');
      }
    } catch (err) {
      console.error('Lỗi nạp file kịch bản:', err);
      toast.error('Không thể đọc file: ' + (err.message || ''));
    }
    e.target.value = '';
  };

  const currentStep = activePreset.steps[currentStepIndex] || activePreset.steps[0];
  const totalDuration = activePreset.steps.reduce((sum, s) => sum + (Number(s.durationSeconds) || 0), 0);

  return (
    <div className="flex flex-col h-full bg-slate-50/60 rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
      
      {/* 🌟 1. TOOLBAR ĐIỀU KHIỂN DUY NHẤT & SIÊU TINH GỌN (CHỈ 1 DÒNG DUY NHẤT - TIẾT KIỆM 80% KHÔNG GIAN) */}
      <div className="px-3.5 py-2.5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-wrap items-center justify-between gap-2.5 border-b border-indigo-800/40 shrink-0">
        
        {/* Nhóm Trái: Icon Tiêu đề gọn + Chọn Preset + Thao tác Preset */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 pr-2 border-r border-indigo-800/50">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-rose-500 to-indigo-500 flex items-center justify-center shadow-xs">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-black tracking-wide text-white uppercase">
              SEQUENCER 24/7
            </span>
          </div>

          <select 
            value={activePresetId}
            onChange={(e) => {
              setActivePresetId(e.target.value);
              setCurrentStepIndex(0);
              if (isPlayingFlow) handleStopFlow();
            }}
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-2.5 py-1.5 rounded-lg border border-indigo-500/40 shadow-inner outline-none cursor-pointer max-w-[210px] truncate"
          >
            {presets.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <button
            onClick={() => setShowPresetModal(true)}
            title="Tạo kịch bản mới"
            className="p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-xs transition-all cursor-pointer"
          >
            <Plus size={14} />
          </button>

          <button
            onClick={handleDuplicatePreset}
            title="Nhân bản kịch bản này"
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-gray-300 hover:text-white rounded-lg border border-slate-700 transition-all cursor-pointer"
          >
            <Copy size={13} />
          </button>

          <button
            onClick={handleDeletePreset}
            title="Xóa kịch bản này"
            className="p-1.5 bg-rose-900/40 hover:bg-rose-600 text-rose-300 hover:text-white rounded-lg border border-rose-800/40 transition-all cursor-pointer"
          >
            <Trash2 size={13} />
          </button>
        </div>

        {/* Nhóm Giữa: Nút BẬT / DỪNG TỨC THÌ + Điều hướng + Trạng thái bước */}
        <div className="flex items-center gap-2">
          {/* NÚT BẬT / DỪNG LIVE: Bật là chạy, Dừng là ngắt triệt để 100% */}
          {isPlayingFlow ? (
            <button
              onClick={handleStopFlow}
              className="px-4 py-1.5 rounded-xl font-black text-xs bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 flex items-center gap-1.5 cursor-pointer animate-pulse"
              title="Dừng chuỗi kịch bản & ngắt âm thanh thoại ngay lập tức"
            >
              <Square size={13} className="fill-white" />
              <span>DỪNG LẠI NGAY</span>
            </button>
          ) : (
            <button
              onClick={handleStartFlow}
              className="px-4 py-1.5 rounded-xl font-black text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105 active:scale-95"
              title="Bắt đầu chạy chuỗi kịch bản phân đoạn tự động"
            >
              <Play size={13} className="fill-white" />
              <span>BẮT ĐẦU CHẠY LIVE</span>
            </button>
          )}

          {/* Nút Điều Hướng Bước */}
          <button
            onClick={handlePrevStep}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-gray-200 rounded-lg border border-slate-700 transition-all cursor-pointer"
            title="Về bước trước"
          >
            <SkipBack size={13} />
          </button>

          <button
            onClick={handleNextStep}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-gray-200 rounded-lg border border-slate-700 transition-all cursor-pointer"
            title="Sang bước tiếp theo"
          >
            <SkipForward size={13} />
          </button>

          {/* Badge Bước & Đếm ngược */}
          <div className="hidden sm:flex items-center gap-2 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-indigo-500/30 text-xs">
            <span className="font-bold text-indigo-300">
              Bước {currentStepIndex + 1}/{activePreset.steps.length}
            </span>
            <span className="text-gray-500">•</span>
            <span className="font-mono font-black text-rose-400">
              {Math.floor(secondsRemaining / 60)}:{(secondsRemaining % 60).toString().padStart(2, '0')}s
            </span>
          </div>
        </div>

        {/* Nhóm Phải: Nút Thêm Bước Mới & Nút Live Test Sân Khấu */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleLiveTestStep(currentStep, currentStepIndex)}
            className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/40 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Bấm để đưa toàn bộ các lớp (Video, Ảnh, Chữ, Ghim SP) lên sân khấu live 9:16 để kiểm tra trực quan"
          >
            <Eye size={13} />
            <span>LIVE TEST SÂN KHẤU</span>
          </button>

          <button
            onClick={handleAddStep}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95"
          >
            <Plus size={14} /> <span>+ Thêm Bước</span>
          </button>
        </div>

      </div>

      {/* 📋 2. KHU VỰC THIẾT LẬP CÁC BƯỚC KỊCH BẢN (CHIẾM TOÀN BỘ 85% DIỆN TÍCH MÀN HÌNH CÒN LẠI) */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
        {activePreset.steps.map((step, idx) => {
          const actionConfig = ACTION_TYPES.find(a => a.id === step.actionType) || ACTION_TYPES[0];
          const ActionIcon = actionConfig.icon;
          const isCurrentExecuting = isPlayingFlow && currentStepIndex === idx;
          const isExpanded = expandedStepId === step.id;

          return (
            <div 
              key={step.id}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isCurrentExecuting 
                  ? 'bg-blue-50/90 border-blue-500 shadow-md ring-2 ring-blue-400/30' 
                  : 'bg-white border-gray-200 hover:border-gray-300 shadow-2xs'
              }`}
            >
              {/* Header của Bước */}
              <div className="p-3 bg-gray-50/90 border-b border-gray-200 flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
                
                {/* Cột Trái: Thứ tự bước, Tiêu đề & Loại hành động */}
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <div className={`w-7 h-7 rounded-lg font-black text-xs flex items-center justify-center shrink-0 ${
                    isCurrentExecuting 
                      ? 'bg-blue-600 text-white animate-bounce' 
                      : 'bg-indigo-600 text-white shadow-2xs'
                  }`}>
                    {idx + 1}
                  </div>

                  <input 
                    type="text"
                    value={step.title}
                    onChange={(e) => handleUpdateStep(step.id, 'title', e.target.value)}
                    className="font-black text-xs sm:text-sm text-gray-900 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:bg-white px-1.5 py-0.5 rounded outline-none transition-all flex-1 min-w-[140px]"
                  />

                  <span className={`hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${actionConfig.bg} ${actionConfig.color} shrink-0`}>
                    <ActionIcon size={11} />
                    <span>{actionConfig.label}</span>
                  </span>
                </div>

                {/* Cột Phải: Cấu hình thời gian, Chọn Video Nền, Live Test Bước, Mở rộng */}
                <div className="flex items-center gap-1.5 shrink-0 self-end lg:self-center flex-wrap">
                  
                  {/* Thời lượng */}
                  <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-gray-300 text-[11px] shadow-2xs">
                    <Clock size={12} className="text-gray-500" />
                    <input 
                      type="number"
                      min="5"
                      max="3600"
                      value={step.durationSeconds}
                      onChange={(e) => handleUpdateStep(step.id, 'durationSeconds', Number(e.target.value))}
                      className="w-10 text-center font-bold text-gray-800 bg-gray-50 border border-gray-300 rounded px-1 py-0.2 outline-none focus:border-blue-500"
                    />
                    <span className="text-gray-500 font-medium">s</span>
                  </div>

                  {/* Nút Chọn Loại Hành Động */}
                  <select
                    value={step.actionType}
                    onChange={(e) => handleUpdateStep(step.id, 'actionType', e.target.value)}
                    className="text-[11px] font-bold text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg px-2 py-1 outline-none cursor-pointer shadow-2xs"
                  >
                    {ACTION_TYPES.map(a => (
                      <option key={a.id} value={a.id}>{a.label}</option>
                    ))}
                  </select>

                  {/* Nút Chọn Video Nền của Bước Này (Độc lập từng bước) */}
                  <button
                    onClick={() => {
                      setEditingStep(step);
                      setMediaPickerTarget('mediaUrl');
                      setMediaPickerOpen(true);
                    }}
                    className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                    title="Chọn hoặc tải video nền riêng biệt cho bước này"
                  >
                    <Video size={12} />
                    <span className="truncate max-w-[80px]">
                      {step.mediaUrl ? 'Đổi Video' : 'Chọn Video'}
                    </span>
                  </button>

                  {/* Nút Live Test Riêng Bước Này */}
                  <button
                    onClick={() => handleLiveTestStep(step, idx)}
                    className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-300 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                    title="Xem trước trực tiếp bước này trên Sân Khấu Live 9:16"
                  >
                    <Eye size={12} />
                    <span>Test Bước</span>
                  </button>

                  {/* Nút Mở Rộng / Thu Gọn Cấu Hình Đa Lớp (Layer Stacking & Styles) */}
                  <button
                    onClick={() => setExpandedStepId(isExpanded ? null : step.id)}
                    className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer border ${
                      isExpanded 
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs' 
                        : 'bg-white hover:bg-gray-100 text-gray-700 border-gray-300'
                    }`}
                    title="Tùy chỉnh phông chữ, kích thước, ảnh banner và video phụ PiP"
                  >
                    <Sliders size={12} />
                    <span>{isExpanded ? 'Đóng Lớp' : 'Tùy Chỉnh Đa Lớp'}</span>
                  </button>

                  {/* Nút Di Chuyển Lên/Xuống */}
                  <div className="flex items-center gap-0.5 bg-white border border-gray-300 rounded-lg px-0.5">
                    <button
                      disabled={idx === 0}
                      onClick={() => handleMoveStep(idx, -1)}
                      className="p-1 text-gray-500 hover:text-gray-900 disabled:opacity-30 cursor-pointer"
                      title="Chuyển lên trên"
                    >
                      <ChevronUp size={12} />
                    </button>
                    <button
                      disabled={idx === activePreset.steps.length - 1}
                      onClick={() => handleMoveStep(idx, 1)}
                      className="p-1 text-gray-500 hover:text-gray-900 disabled:opacity-30 cursor-pointer"
                      title="Chuyển xuống dưới"
                    >
                      <ChevronDown size={12} />
                    </button>
                  </div>

                  {/* Nút Xóa Bước */}
                  <button
                    onClick={() => handleDeleteStep(step.id)}
                    className="p-1 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Xóa bước này"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Phần Thân Bước: Kịch Bản Thoại Rộng Rãi & Nạp File Kịch Bản (Luôn hiển thị) */}
              <div className="p-3.5 space-y-2.5 bg-white">
                
                {/* 1. KHU VỰC KỊCH BẢN THOẠI RỘNG RÃI & TẢI FILE UNIVERSAL */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-black text-gray-800 flex items-center gap-1.5">
                      <FileText size={13} className="text-indigo-600" />
                      <span>Kịch Bản Thoại (AI Voice & Avatar Đọc Tự Động):</span>
                    </label>

                    {/* NÚT TẢI FILE KỊCH BẢN ĐA ĐỊNH DẠNG */}
                    <div className="flex items-center gap-2">
                      <input 
                        type="file"
                        ref={el => fileInputRefMap.current[step.id] = el}
                        accept=".txt,.docx,.doc,.pdf,.json,.xlsx,.csv,.md"
                        className="hidden"
                        onChange={(e) => handleScriptFileUpload(step.id, e)}
                      />
                      <button
                        onClick={() => fileInputRefMap.current[step.id]?.click()}
                        className="px-2 py-0.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-md text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                        title="Tải tệp Word (.docx), PDF (.pdf), Text (.txt), JSON để nạp kịch bản vào bước này"
                      >
                        <Upload size={11} />
                        <span>Nạp File (.docx, .pdf, .txt)</span>
                      </button>
                    </div>
                  </div>

                  {/* TEXTAREA THOẠI RỘNG RÃI & DỄ ĐỌC */}
                  <textarea
                    rows={2}
                    value={step.scriptText || ''}
                    onChange={(e) => handleUpdateStep(step.id, 'scriptText', e.target.value)}
                    placeholder="Nhập nội dung kịch bản cho bước này (AI sẽ tự động đọc diễn cảm và ưu tiên trả lời khi có comment bán hàng)..."
                    className="w-full px-3 py-2 text-xs sm:text-sm font-medium text-gray-800 bg-slate-50/70 border border-gray-300 rounded-xl outline-none focus:border-indigo-500 focus:bg-white transition-all resize-y leading-relaxed shadow-inner"
                  />
                </div>

                {/* 2. KHU VỰC CẤU HÌNH XẾP CHỒNG ĐA LỚP TRÊN SÂN KHẤU (HIỂN THỊ KHI MỞ RỘNG) */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-gray-200 space-y-3 bg-indigo-50/40 -mx-3.5 -mb-3.5 p-3.5 rounded-b-2xl animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-indigo-950 flex items-center gap-1.5">
                        <Layers size={13} className="text-indigo-600" />
                        <span>Cấu Hình Xếp Chồng Đa Lớp (Video PiP, Banner Ảnh, Chữ Font/Size, Deal SP)</span>
                      </h4>
                      <span className="text-[10px] text-indigo-600 font-bold">
                        Đồng bộ 0ms lên Sân khấu 9:16 & OBS Window Capture
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      
                      {/* LỚP 1: VIDEO NỀN CHÍNH */}
                      <div className="p-2.5 bg-white rounded-xl border border-indigo-100 shadow-2xs space-y-2">
                        <span className="text-[11px] font-black text-gray-700 flex items-center gap-1">
                          <Video size={12} className="text-blue-500" /> Lớp 1: Video Nền Chính
                        </span>
                        <button
                          onClick={() => {
                            setEditingStep(step);
                            setMediaPickerTarget('mediaUrl');
                            setMediaPickerOpen(true);
                          }}
                          className="w-full py-1.5 px-2 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-lg text-[11px] font-bold text-gray-700 truncate text-left"
                        >
                          {step.mediaUrl ? '📹 ' + step.mediaUrl.split('/').pop() : 'Chọn Video...'}
                        </button>
                        <label className="flex items-center gap-1.5 cursor-pointer pt-0.5">
                          <input 
                            type="checkbox"
                            checked={!!step.isMediaPinned}
                            onChange={(e) => handleUpdateStep(step.id, 'isMediaPinned', e.target.checked)}
                            className="w-3.5 h-3.5 text-indigo-600 rounded border-gray-300 cursor-pointer"
                          />
                          <span className="text-[10px] font-bold text-gray-700 flex items-center gap-1">
                            <Pin size={10} className="text-amber-500" /> Ghim phát liên tục
                          </span>
                        </label>
                      </div>

                      {/* LỚP 1.5: VIDEO PHỤ / VIDEO PIP XẾP CHỒNG (PICTURE-IN-PICTURE) */}
                      <div className="p-2.5 bg-white rounded-xl border border-indigo-100 shadow-2xs space-y-2">
                        <span className="text-[11px] font-black text-gray-700 flex items-center gap-1">
                          <Film size={12} className="text-purple-500" /> Lớp 1.5: Video Phụ PiP
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setEditingStep(step);
                              setMediaPickerTarget('secondaryMediaUrl');
                              setMediaPickerOpen(true);
                            }}
                            className="flex-1 py-1 px-2 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-lg text-[10px] font-bold text-gray-700 truncate text-left"
                          >
                            {step.secondaryMediaUrl ? '🎬 ' + step.secondaryMediaUrl.split('/').pop() : 'Chọn Video PiP...'}
                          </button>
                          {step.secondaryMediaUrl && (
                            <button
                              onClick={() => handleUpdateStep(step.id, 'secondaryMediaUrl', '')}
                              className="p-1 text-gray-400 hover:text-rose-600"
                              title="Xóa video phụ"
                            >
                              <X size={12} />
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-1 text-[10px]">
                          <div>
                            <span className="text-gray-500 font-bold">Vị trí:</span>
                            <select
                              value={step.secondaryMediaPos || 'top-right'}
                              onChange={(e) => handleUpdateStep(step.id, 'secondaryMediaPos', e.target.value)}
                              className="w-full bg-gray-50 border border-gray-300 rounded px-1 py-0.5 font-bold text-gray-700 outline-none"
                            >
                              <option value="top-right">Góc Trên Phải</option>
                              <option value="top-left">Góc Trên Trái</option>
                              <option value="bottom-right">Góc Dưới Phải</option>
                              <option value="bottom-left">Góc Dưới Trái</option>
                              <option value="center">Chính Giữa</option>
                            </select>
                          </div>
                          <div>
                            <span className="text-gray-500 font-bold">Kích cỡ:</span>
                            <select
                              value={step.secondaryMediaScale || 40}
                              onChange={(e) => handleUpdateStep(step.id, 'secondaryMediaScale', Number(e.target.value))}
                              className="w-full bg-gray-50 border border-gray-300 rounded px-1 py-0.5 font-bold text-gray-700 outline-none"
                            >
                              <option value="30">30% (Nhỏ)</option>
                              <option value="40">40% (Vừa)</option>
                              <option value="50">50% (Lớn)</option>
                              <option value="60">60% (Rộng)</option>
                              <option value="75">75% (Chiếm 3/4)</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* LỚP 2: HÌNH ẢNH / BANNER / POSTER VỚI SCALE KÍCH THƯỚC */}
                      <div className="p-2.5 bg-white rounded-xl border border-indigo-100 shadow-2xs space-y-2">
                        <span className="text-[11px] font-black text-gray-700 flex items-center gap-1">
                          <ImageIcon size={12} className="text-emerald-500" /> Lớp 2: Hình Ảnh / Poster
                        </span>
                        <div className="flex items-center gap-1">
                          <input 
                            type="text"
                            placeholder="URL ảnh hoặc chọn..."
                            value={step.overlayImage || ''}
                            onChange={(e) => handleUpdateStep(step.id, 'overlayImage', e.target.value)}
                            className="flex-1 px-2 py-1 bg-gray-50 border border-gray-300 rounded-lg text-[10px] font-medium outline-none"
                          />
                          {step.overlayImage && (
                            <button
                              onClick={() => handleUpdateStep(step.id, 'overlayImage', '')}
                              className="p-1 text-gray-400 hover:text-rose-600"
                              title="Xóa ảnh"
                            >
                              <X size={12} />
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-1 text-[10px]">
                          <div>
                            <span className="text-gray-500 font-bold">Vị trí:</span>
                            <select
                              value={step.overlayImagePos || 'top-left'}
                              onChange={(e) => handleUpdateStep(step.id, 'overlayImagePos', e.target.value)}
                              className="w-full bg-gray-50 border border-gray-300 rounded px-1 py-0.5 font-bold text-gray-700 outline-none"
                            >
                              <option value="top-left">Góc Trên Trái</option>
                              <option value="top-right">Góc Trên Phải</option>
                              <option value="center">Chính Giữa</option>
                              <option value="bottom-left">Góc Dưới Trái</option>
                              <option value="bottom-right">Góc Dưới Phải</option>
                              <option value="top">Toàn Chiều Trên</option>
                              <option value="bottom">Toàn Chiều Dưới</option>
                            </select>
                          </div>
                          <div>
                            <span className="text-gray-500 font-bold">Kích cỡ ảnh:</span>
                            <select
                              value={step.overlayImageScale || 100}
                              onChange={(e) => handleUpdateStep(step.id, 'overlayImageScale', Number(e.target.value))}
                              className="w-full bg-gray-50 border border-gray-300 rounded px-1 py-0.5 font-bold text-gray-700 outline-none"
                            >
                              <option value="50">50% (Rất nhỏ)</option>
                              <option value="75">75% (Nhỏ gọn)</option>
                              <option value="100">100% (Chuẩn)</option>
                              <option value="125">125% (Lớn)</option>
                              <option value="150">150% (Cực đại)</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* LỚP 3: TIÊU ĐỀ CHỮ VỚI CHỈNH PHÔNG CHỮ & KÍCH THƯỚC */}
                      <div className="p-2.5 bg-white rounded-xl border border-indigo-100 shadow-2xs space-y-2">
                        <span className="text-[11px] font-black text-gray-700 flex items-center gap-1">
                          <Type size={12} className="text-rose-500" /> Lớp 3: Tiêu Đề & Phông Chữ
                        </span>
                        <input 
                          type="text"
                          placeholder="Ví dụ: 🔥 FLASH SALE 50%..."
                          value={step.overlayText || ''}
                          onChange={(e) => handleUpdateStep(step.id, 'overlayText', e.target.value)}
                          className="w-full px-2 py-1 bg-gray-50 border border-gray-300 rounded-lg text-[10px] font-bold outline-none"
                        />
                        <div className="grid grid-cols-3 gap-1 text-[10px]">
                          <div>
                            <span className="text-gray-500 font-bold">Phông chữ:</span>
                            <select
                              value={step.overlayTextFontFamily || 'be_vietnam'}
                              onChange={(e) => handleUpdateStep(step.id, 'overlayTextFontFamily', e.target.value)}
                              className="w-full bg-gray-50 border border-gray-300 rounded px-1 py-0.5 font-bold text-gray-700 outline-none mt-0.5"
                            >
                              {FONT_FAMILIES.map(f => (
                                <option key={f.id} value={f.id}>{f.name.split(' ')[0]}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <span className="text-gray-500 font-bold">Cỡ chữ:</span>
                            <select
                              value={step.overlayTextFontSize || 20}
                              onChange={(e) => handleUpdateStep(step.id, 'overlayTextFontSize', Number(e.target.value))}
                              className="w-full bg-gray-50 border border-gray-300 rounded px-1 py-0.5 font-bold text-gray-700 outline-none mt-0.5"
                            >
                              <option value="14">14px</option>
                              <option value="16">16px</option>
                              <option value="18">18px</option>
                              <option value="20">20px</option>
                              <option value="24">24px</option>
                              <option value="28">28px</option>
                              <option value="32">32px</option>
                              <option value="40">40px</option>
                            </select>
                          </div>
                          <div>
                            <span className="text-gray-500 font-bold">Kiểu mẫu:</span>
                            <select
                              value={step.overlayTextStyle || 'banner'}
                              onChange={(e) => handleUpdateStep(step.id, 'overlayTextStyle', e.target.value)}
                              className="w-full bg-gray-50 border border-gray-300 rounded px-1 py-0.5 font-bold text-gray-700 outline-none mt-0.5"
                            >
                              <option value="banner">🔥 Vàng Đỏ</option>
                              <option value="neon_cyber">⚡ Cyber</option>
                              <option value="gold_luxury">👑 Gold</option>
                              <option value="gradient_rose">🌸 Pastel</option>
                              <option value="minimal_dark">🖤 Dark</option>
                            </select>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* LỚP 4: THÔNG TIN SẢN PHẨM GHIM DEAL TRÊN LIVE */}
                    <div className="p-2.5 bg-white rounded-xl border border-indigo-100 shadow-2xs">
                      <span className="text-[11px] font-black text-gray-700 flex items-center gap-1 mb-1.5">
                        <ShoppingCart size={12} className="text-indigo-600" /> Lớp 4: Ghim Sản Phẩm & Giá Flash Sale Theo Bước
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input 
                          type="text"
                          placeholder="Tên sản phẩm (VD: Serum Căng Bóng 30ml)..."
                          value={step.productName || ''}
                          onChange={(e) => handleUpdateStep(step.id, 'productName', e.target.value)}
                          className="px-2 py-1 bg-gray-50 border border-gray-300 rounded-lg text-xs font-medium outline-none focus:border-indigo-500"
                        />
                        <input 
                          type="text"
                          placeholder="Giá bán live (VD: 299.000đ)..."
                          value={step.productPrice || ''}
                          onChange={(e) => handleUpdateStep(step.id, 'productPrice', e.target.value)}
                          className="px-2 py-1 bg-gray-50 border border-gray-300 rounded-lg text-xs font-bold text-rose-600 outline-none focus:border-indigo-500"
                        />
                        <input 
                          type="text"
                          placeholder="Giá gốc gạch ngang (VD: 599.000đ)..."
                          value={step.productDiscount || ''}
                          onChange={(e) => handleUpdateStep(step.id, 'productDiscount', e.target.value)}
                          className="px-2 py-1 bg-gray-50 border border-gray-300 rounded-lg text-xs text-gray-500 line-through outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                  </div>
                )}

              </div>
            </div>
          );
        })}
      </div>

      {/* 3. MODAL TẠO MỚI PRESET */}
      {showPresetModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-200 space-y-4">
            <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <span>Tạo Bộ Kịch Bản Mới</span>
            </h3>
            <p className="text-xs text-gray-500">
              Nhập tên kịch bản (ví dụ: Livestream Quần Áo Mùa Hè, Flash Sale Cuối Tuần...)
            </p>
            <input 
              type="text"
              placeholder="Nhập tên kịch bản..."
              value={presetNameInput}
              onChange={(e) => setPresetNameInput(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-bold text-sm outline-none focus:border-indigo-500"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowPresetModal(false)}
                className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={handleCreatePreset}
                className="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md cursor-pointer"
              >
                Tạo Kịch Bản
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. MODAL CHỌN VIDEO KHO MEDIA CHO PHÂN ĐOẠN */}
      {mediaPickerOpen && editingStep && (
        <UniversalMediaPicker
          isOpen={mediaPickerOpen}
          onClose={() => setMediaPickerOpen(false)}
          onSelectMedia={(url) => {
            handleUpdateStep(editingStep.id, mediaPickerTarget, url);
            setMediaPickerOpen(false);
            toast.success(`Đã cập nhật ${mediaPickerTarget === 'secondaryMediaUrl' ? 'video phụ PiP' : 'video nền'} cho phân đoạn!`);
          }}
        />
      )}

    </div>
  );
}
