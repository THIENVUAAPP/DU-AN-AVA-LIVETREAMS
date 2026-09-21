import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, SkipForward, SkipBack, Plus, Trash2, Edit3, Copy, 
  Save, Download, Upload, Sparkles, Clock, Video, Mic, MessageCircle, 
  ShoppingCart, Megaphone, Film, Layers, CheckCircle2, AlertCircle, 
  ChevronUp, ChevronDown, RotateCcw, Bot, Volume2, Users, ShieldCheck, 
  Zap, Star, Tag, Eye, Info
} from 'lucide-react';
import UniversalMediaPicker, { SAMPLE_IDOL_VIDEOS } from './UniversalMediaPicker';

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
        commentHandling: 'ai_brain'
      },
      {
        id: 's2',
        title: 'Bước 2: AI Tự Động Trả Lời Bình Luận & Tư Vấn Loại Da',
        actionType: 'tiktok_qa',
        durationSeconds: 120,
        scriptText: '',
        mediaUrl: '/idols/phong_studio_ngoc_trinh_4k.mp4',
        lipsyncUrl: '/idols/phong_studio_ngoc_trinh_4k.mp4',
        voiceMode: 'avatar_lipsync',
        commentHandling: 'ai_brain'
      },
      {
        id: 's3',
        title: 'Bước 3: Chiếu Video Demo Cận Cảnh Serum Phục Hồi',
        actionType: 'product_video',
        durationSeconds: 60,
        productName: 'Serum Tinh Chất Căng Bóng 30ml',
        productPrice: '299.000đ',
        mediaUrl: '/idols/phong_studio_mai_phuong_thuy_4k.mp4',
        voiceMode: 'background_voice',
        commentHandling: 'ai_voice_only'
      },
      {
        id: 's4',
        title: 'Bước 4: Chiếu Video Feedback Khách Hàng Da Cải Thiện',
        actionType: 'feedback_video',
        durationSeconds: 45,
        mediaUrl: '/idols/phong_studio_linh_ka_4k.mp4',
        voiceMode: 'background_voice',
        commentHandling: 'ai_voice_only'
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
        commentHandling: 'ai_brain'
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
        commentHandling: 'ai_brain'
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
        commentHandling: 'ai_brain'
      },
      {
        id: 's2',
        title: 'Bước 2: Chiếu Video Người Mẫu Thử Đồ & Xoay Dáng 360',
        actionType: 'product_video',
        durationSeconds: 75,
        productName: 'Đầm Lụa Thiết Kế Sang Trọng',
        productPrice: '389.000đ',
        mediaUrl: '/idols/phong_studio_linh_ka_4k.mp4',
        voiceMode: 'background_voice',
        commentHandling: 'ai_voice_only'
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
        commentHandling: 'ai_brain'
      },
      {
        id: 's4',
        title: 'Bước 4: Chiếu Video Feedback Khách Nhận Đồ Thực Tế',
        actionType: 'feedback_video',
        durationSeconds: 45,
        mediaUrl: '/idols/phong_studio_ngoc_trinh_4k.mp4',
        voiceMode: 'background_voice',
        commentHandling: 'ai_voice_only'
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
        commentHandling: 'ai_brain'
      }
    ]
  },
  {
    id: 'preset_giadung',
    name: '🍳 Preset: Đồ Gia Dụng Thông Minh & Tiện Ích Nhà Cửa',
    category: 'Gia Dụng / Công Nghệ',
    description: 'Quy trình giải thích tính năng, đập hộp sản phẩm và tạo sự tin tưởng tuyệt đối.',
    loop: true,
    steps: [
      {
        id: 's1',
        title: 'Bước 1: Avatar AI Chào Mở Màn & Giới Thiệu Tiện Ích',
        actionType: 'avatar_talk',
        durationSeconds: 60,
        scriptText: 'Xin chào mọi người! Hôm nay em mang đến một giải pháp siêu tiện lợi giúp căn bếp của gia đình luôn gọn gàng sạch đẹp...',
        mediaUrl: '/idols/phong_studio_linh_ka_4k.mp4',
        lipsyncUrl: '/idols/phong_studio_linh_ka_4k.mp4',
        voiceMode: 'avatar_lipsync',
        commentHandling: 'ai_brain'
      },
      {
        id: 's2',
        title: 'Bước 2: Chiếu Video Thử Nghiệm Độ Bền & Tính Năng Thực Tế',
        actionType: 'product_video',
        durationSeconds: 90,
        productName: 'Máy Hút Bụi Cầm Tay Đa Năng Không Dây',
        productPrice: '450.000đ',
        mediaUrl: '/idols/phong_studio_ngoc_trinh_4k.mp4',
        voiceMode: 'background_voice',
        commentHandling: 'ai_voice_only'
      },
      {
        id: 's3',
        title: 'Bước 3: Chiếu Video Feedback Khách Hàng Sử Dụng Hài Lòng',
        actionType: 'feedback_video',
        durationSeconds: 45,
        mediaUrl: '/idols/phong_studio_mai_phuong_thuy_4k.mp4',
        voiceMode: 'background_voice',
        commentHandling: 'ai_voice_only'
      },
      {
        id: 's4',
        title: 'Bước 4: Avatar Giải Đáp Về Bảo Hành & Hướng Dẫn Mua Hàng',
        actionType: 'cta_sale',
        durationSeconds: 60,
        scriptText: 'Sản phẩm được bảo hành chính hãng 12 tháng, lỗi 1 đổi 1 trong 30 ngày đầu! Giá ưu đãi chỉ áp dụng trong phiên live này thôi ạ, các bác nhanh tay bấm giỏ hàng nhé!',
        mediaUrl: '/idols/phong_studio_linh_ka_4k.mp4',
        lipsyncUrl: '/idols/phong_studio_linh_ka_4k.mp4',
        voiceMode: 'avatar_lipsync',
        commentHandling: 'ai_brain'
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
  const [editingStep, setEditingStep] = useState(null);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState('mediaUrl'); // 'mediaUrl' or 'lipsyncUrl'
  const [presetNameInput, setPresetNameInput] = useState('');
  const [showPresetModal, setShowPresetModal] = useState(false);

  const timerRef = useRef(null);

  // Lưu presets vào localStorage khi có thay đổi
  useEffect(() => {
    try {
      localStorage.setItem('avalive_flow_presets', JSON.stringify(presets));
      localStorage.setItem('avalive_active_flow_preset_id', activePresetId);
    } catch (e) {}
  }, [presets, activePresetId]);

  // Đẩy video và dữ liệu phân đoạn của bước hiện tại lên Server Live State để đồng bộ TikTok Live Studio & OBS
  const syncStepToServer = (step, index = 0) => {
    if (!step) return;
    const mediaToPlay = step.mediaUrl || step.lipsyncUrl || '/idols/phong_studio_ngoc_trinh_4k.mp4';
    
    // Phát event đồng bộ toàn cục cho Màn hình chính (DesktopAppUI), Window Capture và Audio Voice
    window.dispatchEvent(new CustomEvent('avalive:update_master_media', {
      detail: {
        mediaUrl: mediaToPlay,
        title: step.title,
        actionType: step.actionType,
        scriptText: step.scriptText,
        durationSeconds: step.durationSeconds || 60,
        stepIndex: index + 1,
        totalSteps: activePreset?.steps?.length || 1,
        presetName: activePreset?.name || 'Kịch bản Sequencer',
        productName: step.productName || null,
        productPrice: step.productPrice || null,
        productDiscount: step.productDiscount || null,
        productImg: step.productImg || null
      }
    }));

    // Gửi request đồng bộ tức thì tới backend server
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
        fit: 'cover',
        sound: true,
        updatedAt: Date.now()
      })
    }).catch(() => {});
  };

  // Khởi động hoặc chuyển bước trong chuỗi kịch bản
  const startStep = (index) => {
    if (!activePreset || !activePreset.steps || activePreset.steps.length === 0) {
      toast.error('Kịch bản chưa có phân đoạn nào!');
      return;
    }
    const safeIndex = (index >= 0 && index < activePreset.steps.length) ? index : 0;
    const step = activePreset.steps[safeIndex];
    setCurrentStepIndex(safeIndex);
    setSecondsRemaining(step.durationSeconds || 60);
    syncStepToServer(step, safeIndex);
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
            startStep(nextIndex);
            toast.success(`🎬 Tự động chuyển sang: ${activePreset.steps[nextIndex].title}`);
          } else {
            if (activePreset.loop) {
              startStep(0);
              toast.success(`🔄 Đã lặp lại vòng kịch bản: ${activePreset.name}`);
            } else {
              setIsPlayingFlow(false);
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

  // Bắt đầu / Tạm dừng chuỗi kịch bản
  const handleTogglePlay = () => {
    if (!isPlayingFlow) {
      setIsPlayingFlow(true);
      if (secondsRemaining <= 0) {
        startStep(currentStepIndex);
      } else {
        syncStepToServer(activePreset.steps[currentStepIndex]);
      }
      toast.success('▶️ Đã bắt đầu chạy chuỗi kịch bản phân đoạn tự động!');
    } else {
      setIsPlayingFlow(false);
      toast.success('⏸️ Đã tạm dừng chuỗi kịch bản.');
    }
  };

  const handleNextStep = () => {
    const nextIndex = (currentStepIndex + 1) % activePreset.steps.length;
    startStep(nextIndex);
    toast.success(`⏭️ Chuyển nhanh sang bước ${nextIndex + 1}`);
  };

  const handlePrevStep = () => {
    const prevIndex = currentStepIndex === 0 ? activePreset.steps.length - 1 : currentStepIndex - 1;
    startStep(prevIndex);
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
          commentHandling: 'ai_brain'
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
      commentHandling: 'ai_brain'
    };
    const updated = { ...activePreset, steps: [...activePreset.steps, newStep] };
    setPresets(presets.map(p => p.id === activePreset.id ? updated : p));
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

  const currentStep = activePreset.steps[currentStepIndex] || activePreset.steps[0];
  const totalDuration = activePreset.steps.reduce((sum, s) => sum + (Number(s.durationSeconds) || 0), 0);

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
      
      {/* 1. THANH ĐIỀU KHIỂN PRESET & THAO TÁC LUỒNG */}
      <div className="p-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-wrap items-center justify-between gap-3 border-b border-indigo-800/40 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-rose-500/20">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black text-white">ĐIỀU PHỐI CHUỖI KỊCH BẢN PHÂN ĐOẠN (SEQUENCER)</h2>
              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/30 uppercase tracking-wider">
                ● TỰ ĐỘNG 24/7
              </span>
            </div>
            <p className="text-xs text-gray-300">
              Lưu trữ nhiều phong cách bán hàng, tự động chuyển phân đoạn theo thời gian trên TikTok Live Studio & OBS
            </p>
          </div>
        </div>

        {/* Chọn Preset & Nút Thao Tác Preset */}
        <div className="flex items-center gap-2">
          <select 
            value={activePresetId}
            onChange={(e) => {
              setActivePresetId(e.target.value);
              setCurrentStepIndex(0);
              setIsPlayingFlow(false);
            }}
            className="bg-slate-800/90 hover:bg-slate-800 text-white font-bold text-xs px-3 py-2 rounded-xl border border-indigo-500/40 shadow-inner outline-none cursor-pointer max-w-[260px] truncate"
          >
            {presets.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <button
            onClick={() => setShowPresetModal(true)}
            title="Tạo kịch bản mới"
            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={14} /> <span>Tạo Mới</span>
          </button>

          <button
            onClick={handleDuplicatePreset}
            title="Nhân bản kịch bản này"
            className="p-2 bg-slate-800 hover:bg-slate-700 text-gray-300 hover:text-white rounded-xl border border-slate-700 transition-all cursor-pointer"
          >
            <Copy size={14} />
          </button>

          <button
            onClick={handleDeletePreset}
            title="Xóa kịch bản này"
            className="p-2 bg-rose-900/40 hover:bg-rose-600 text-rose-300 hover:text-white rounded-xl border border-rose-800/40 transition-all cursor-pointer"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* 2. DOCK BẢNG ĐIỀU KHIỂN LIVE ENGINE (ĐANG PHÁT / THỜI GIAN CÒN LẠI) */}
      <div className="p-4 bg-indigo-50/70 border-b border-indigo-100 flex flex-wrap items-center justify-between gap-4 shrink-0">
        
        {/* Nút Play/Pause & Điều hướng bước */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleTogglePlay}
            className={`px-5 py-2.5 rounded-xl font-black text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer ${
              isPlayingFlow
                ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20 animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20'
            }`}
          >
            {isPlayingFlow ? <Pause size={16} /> : <Play size={16} />}
            <span>{isPlayingFlow ? 'TẠM DỪNG CHUỖI' : 'BẮT ĐẦU CHẠY LIVE'}</span>
          </button>

          <button
            onClick={handlePrevStep}
            className="p-2.5 bg-white hover:bg-gray-100 text-gray-700 rounded-xl border border-gray-200 shadow-2xs transition-all cursor-pointer"
            title="Về bước trước"
          >
            <SkipBack size={14} />
          </button>

          <button
            onClick={handleNextStep}
            className="p-2.5 bg-white hover:bg-gray-100 text-gray-700 rounded-xl border border-gray-200 shadow-2xs transition-all cursor-pointer"
            title="Sang bước tiếp theo"
          >
            <SkipForward size={14} />
          </button>
        </div>

        {/* Trạng thái đếm ngược & Bước hiện tại */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-gray-200 shadow-2xs">
            <span className="text-gray-500 font-bold">Đang ở:</span>
            <span className="font-black text-blue-600">
              Bước {currentStepIndex + 1}/{activePreset.steps.length}: {currentStep?.title}
            </span>
          </div>

          <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-gray-200 shadow-2xs">
            <Clock size={14} className={isPlayingFlow ? 'text-rose-500 animate-spin' : 'text-gray-400'} />
            <span className="text-gray-500 font-bold">Thời gian còn:</span>
            <span className="font-mono font-black text-rose-600 text-sm">
              {Math.floor(secondsRemaining / 60)}:{(secondsRemaining % 60).toString().padStart(2, '0')}s
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-gray-500 font-medium">
            <span>Tổng chu kỳ:</span>
            <span className="font-bold text-gray-800">{Math.ceil(totalDuration / 60)} phút</span>
            {activePreset.loop && (
              <span className="text-indigo-600 font-bold ml-1 flex items-center gap-0.5">
                <RotateCcw size={11} /> Lặp vô tận
              </span>
            )}
          </div>
        </div>

        {/* Nút Thêm Bước Mới */}
        <button
          onClick={handleAddStep}
          className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus size={14} /> <span>Thêm Bước Mới</span>
        </button>
      </div>

      {/* 3. DANH SÁCH CÁC BƯỚC PHÂN ĐOẠN TRONG KỊCH BẢN */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {activePreset.steps.map((step, idx) => {
          const actionConfig = ACTION_TYPES.find(a => a.id === step.actionType) || ACTION_TYPES[0];
          const ActionIcon = actionConfig.icon;
          const isCurrentExecuting = isPlayingFlow && currentStepIndex === idx;

          return (
            <div 
              key={step.id}
              className={`p-4 rounded-2xl border transition-all ${
                isCurrentExecuting 
                  ? 'bg-blue-50/80 border-blue-500 shadow-md ring-2 ring-blue-400/30' 
                  : 'bg-white border-gray-200 hover:border-gray-300 shadow-2xs'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                
                {/* Cột Trái: Thứ tự bước, Tiêu đề & Loại hành động */}
                <div className="flex items-start gap-3 flex-1">
                  <div className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center shrink-0 ${
                    isCurrentExecuting 
                      ? 'bg-blue-600 text-white animate-bounce' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {idx + 1}
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <input 
                        type="text"
                        value={step.title}
                        onChange={(e) => handleUpdateStep(step.id, 'title', e.target.value)}
                        className="font-bold text-sm text-gray-900 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:bg-white px-1.5 py-0.5 rounded outline-none transition-all w-full sm:w-auto"
                      />
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${actionConfig.bg} ${actionConfig.color}`}>
                        <ActionIcon size={12} />
                        <span>{actionConfig.label}</span>
                      </span>
                    </div>

                    <p className="text-xs text-gray-500">
                      {actionConfig.desc}
                    </p>

                    {/* Kịch bản văn bản hoặc ghi chú */}
                    {step.scriptText && (
                      <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-700 italic flex items-start gap-2 mt-2">
                        <span className="text-blue-500 font-bold shrink-0">Thoại:</span>
                        <p className="line-clamp-2">{step.scriptText}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Cột Phải: Cấu hình thời gian, Video, và Nút thao tác */}
                <div className="flex items-center gap-3 shrink-0 self-end lg:self-center">
                  
                  {/* Cài đặt thời lượng (giây) */}
                  <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1.5 rounded-xl border border-gray-200 text-xs">
                    <Clock size={13} className="text-gray-500" />
                    <input 
                      type="number"
                      min="5"
                      max="3600"
                      value={step.durationSeconds}
                      onChange={(e) => handleUpdateStep(step.id, 'durationSeconds', Number(e.target.value))}
                      className="w-12 text-center font-bold text-gray-800 bg-white border border-gray-300 rounded px-1 py-0.5 outline-none focus:border-blue-500"
                    />
                    <span className="text-gray-500 font-medium">giây</span>
                  </div>

                  {/* Nút Chọn Loại Hành Động */}
                  <select
                    value={step.actionType}
                    onChange={(e) => handleUpdateStep(step.id, 'actionType', e.target.value)}
                    className="text-xs font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-xl px-2.5 py-1.5 outline-none cursor-pointer"
                  >
                    {ACTION_TYPES.map(a => (
                      <option key={a.id} value={a.id}>{a.label}</option>
                    ))}
                  </select>

                  {/* Nút Chọn Video Cho Phân Đoạn */}
                  <button
                    onClick={() => {
                      setEditingStep(step);
                      setMediaPickerTarget('mediaUrl');
                      setMediaPickerOpen(true);
                    }}
                    className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                    title="Chọn Video cho bước này"
                  >
                    <Video size={13} />
                    <span className="truncate max-w-[80px]">
                      {step.mediaUrl ? 'Đổi Video' : 'Chọn Video'}
                    </span>
                  </button>

                  {/* Nút Di Chuyển Lên/Xuống */}
                  <div className="flex flex-col gap-0.5">
                    <button
                      disabled={idx === 0}
                      onClick={() => handleMoveStep(idx, -1)}
                      className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 cursor-pointer"
                      title="Chuyển lên trên"
                    >
                      <ChevronUp size={13} />
                    </button>
                    <button
                      disabled={idx === activePreset.steps.length - 1}
                      onClick={() => handleMoveStep(idx, 1)}
                      className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 cursor-pointer"
                      title="Chuyển xuống dưới"
                    >
                      <ChevronDown size={13} />
                    </button>
                  </div>

                  {/* Nút Xóa Bước */}
                  <button
                    onClick={() => handleDeleteStep(step.id)}
                    className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Xóa bước này"
                  >
                    <Trash2 size={14} />
                  </button>

                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. MODAL TẠO MỚI PRESET */}
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
                className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl"
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

      {/* 5. MODAL CHỌN VIDEO KHO MEDIA CHO PHÂN ĐOẠN */}
      {mediaPickerOpen && editingStep && (
        <UniversalMediaPicker
          isOpen={mediaPickerOpen}
          onClose={() => setMediaPickerOpen(false)}
          onSelectMedia={(url) => {
            handleUpdateStep(editingStep.id, mediaPickerTarget, url);
            setMediaPickerOpen(false);
            toast.success('Đã cập nhật video cho phân đoạn!');
          }}
        />
      )}

    </div>
  );
}
