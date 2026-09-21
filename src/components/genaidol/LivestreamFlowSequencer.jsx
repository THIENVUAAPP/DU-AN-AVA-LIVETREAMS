import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Square, SkipForward, SkipBack, Plus, Trash2, Edit3, Copy, 
  Save, Download, Upload, Sparkles, Clock, Video, Mic, MessageCircle, 
  ShoppingCart, Megaphone, Film, Layers, CheckCircle2, AlertCircle, 
  ChevronUp, ChevronDown, RotateCcw, Bot, Volume2, Users, ShieldCheck, 
  Zap, Star, Tag, Eye, Info, FileText, Image as ImageIcon, Type, Pin, 
  Maximize2, Sliders, Check, X, Palette, Move, Monitor, Wand2,
  FolderOpen, Scaling, UserCheck, RefreshCw, Smartphone, ArrowUpToLine, ArrowDownToLine
} from 'lucide-react';
import UniversalMediaPicker, { SAMPLE_IDOL_VIDEOS } from './UniversalMediaPicker';
import { readUniversalFile } from '../../utils/universalDocumentParser';
import { SvgChromaFilters, SCRIPT_TEMPLATES } from './MultiAvatarStudioModal';
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
  { id: 'avatar_talk', label: '🗣️ AI Avatar Mở Màn & Chia Sẻ', icon: Bot, color: 'text-purple-400', bg: 'bg-purple-500/15 border-purple-500/40', desc: 'Avatar AI xuất hiện nhép miệng đọc kịch bản giới thiệu theo giọng nói AI.' },
  { id: 'tiktok_qa', label: '💬 AI Trả Lời Bình Luận TikTok Live', icon: MessageCircle, color: 'text-blue-400', bg: 'bg-blue-500/15 border-blue-500/40', desc: 'Lắng nghe bình luận TikTok và tự động phản hồi bằng Voice AI hoặc Avatar Lip-sync.' },
  { id: 'product_video', label: '🎬 Phát Video Giới Thiệu Sản Phẩm', icon: Video, color: 'text-emerald-400', bg: 'bg-emerald-500/15 border-emerald-500/40', desc: 'Tự động phát video cận cảnh sản phẩm, tính năng và công dụng.' },
  { id: 'feedback_video', label: '⭐ Phát Video Feedback / Review Khách Hàng', icon: Film, color: 'text-amber-400', bg: 'bg-amber-500/15 border-amber-500/40', desc: 'Phát video cảm nhận, bằng chứng và đánh giá thực tế của người dùng cũ.' },
  { id: 'keyword_consult', label: '🏷️ Avatar Tư Vấn & Bắt Từ Khóa Giỏ Hàng', icon: ShoppingCart, color: 'text-indigo-400', bg: 'bg-indigo-500/15 border-indigo-500/40', desc: 'Bắt từ khóa (giá, mua, size) để tự động ghim sản phẩm và chuyển Avatar tư vấn.' },
  { id: 'cta_sale', label: '🔥 Kêu Gọi Hành Động (CTA) & Chốt Sale', icon: Megaphone, color: 'text-rose-400', bg: 'bg-rose-500/15 border-rose-500/40', desc: 'Đọc thông báo ưu đãi có hạn, đếm ngược thời gian và kêu gọi bấm vào giỏ hàng.' },
  { id: 'custom_video', label: '📹 Phát Video Tùy Chọn Bất Kỳ', icon: Video, color: 'text-cyan-400', bg: 'bg-cyan-500/15 border-cyan-500/40', desc: 'Phát bất kỳ video nào từ máy tính hoặc link kho lưu trữ.' }
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

// 📚 Danh sách các Bộ Preset Mẫu Có Sẵn Chuyên Nghiệp (1 đến 4 người & Theo Ngành Hàng)
export const DEFAULT_PRESETS = [
  {
    id: 'preset_1person_sales',
    name: '👤 Kịch Bản 1 Người: Idol Độc Diễn Bán Hàng & Chốt Deal',
    category: '1 Người (Solo)',
    avatarCount: 1,
    description: 'Quy trình 6 bước tự động từ Idol mở màn, tư vấn, phát video SP, feedback đến chốt sale giỏ hàng.',
    loop: true,
    steps: [
      {
        id: 's1',
        title: 'Bước 1: Avatar AI Chào Khán Giả & Mở Đầu Phiên Live',
        actionType: 'avatar_talk',
        avatarSpeaker: 'avatar_1',
        durationSeconds: 60,
        scriptText: 'Dạ em xin chào tất cả mọi người đã đến với phiên livestream hôm nay nha! Hôm nay bên em có chương trình Flash Sale độc quyền giảm giá đến 50% cho tất cả các mã sản phẩm hot nhất!',
        mediaUrl: '/idols/phong_studio_ngoc_trinh_4k.mp4',
        lipsyncUrl: '/idols/phong_studio_ngoc_trinh_4k.mp4',
        voiceMode: 'avatar_lipsync',
        commentHandling: 'ai_brain',
        overlayText: '🌸 CHÀO MỪNG ĐẾN VỚI PHIÊN LIVE FLASH SALE 50%',
        overlayTextPos: 'top',
        overlayTextStyle: 'banner',
        overlayTextFontSize: 18,
        overlayTextFontFamily: 'be_vietnam',
        overlayImageScale: 100,
        isMediaPinned: true
      },
      {
        id: 's2',
        title: 'Bước 2: AI Tự Động Trả Lời Bình Luận & Tư Vấn Khách Hàng',
        actionType: 'tiktok_qa',
        avatarSpeaker: 'avatar_1',
        durationSeconds: 90,
        scriptText: 'Các bạn cứ thoải mái để lại câu hỏi và comment nhu cầu ở bên dưới, em sẽ tư vấn tận tình chi tiết cho từng người luôn nha!',
        mediaUrl: '/idols/phong_studio_ngoc_trinh_4k.mp4',
        lipsyncUrl: '/idols/phong_studio_ngoc_trinh_4k.mp4',
        voiceMode: 'avatar_lipsync',
        commentHandling: 'ai_brain',
        overlayText: '💬 ĐỂ LẠI BÌNH LUẬN ĐỂ ĐƯỢC TƯ VẤN MIỄN PHÍ',
        overlayTextPos: 'top',
        overlayTextStyle: 'neon_cyber',
        overlayTextFontSize: 18,
        overlayTextFontFamily: 'be_vietnam',
        overlayImageScale: 100,
        isMediaPinned: true
      },
      {
        id: 's3',
        title: 'Bước 3: Chiếu Video Demo Cận Cảnh Sản Phẩm & Công Dụng',
        actionType: 'product_video',
        avatarSpeaker: 'avatar_1',
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
        overlayTextFontSize: 20,
        overlayTextFontFamily: 'montserrat',
        overlayImageScale: 100,
        isMediaPinned: false
      },
      {
        id: 's4',
        title: 'Bước 4: Chiếu Video Feedback Đánh Giá Khách Hàng Cũ',
        actionType: 'feedback_video',
        avatarSpeaker: 'avatar_1',
        durationSeconds: 45,
        mediaUrl: '/idols/phong_studio_linh_ka_4k.mp4',
        voiceMode: 'background_voice',
        commentHandling: 'ai_voice_only',
        overlayText: '⭐ 99% KHÁCH HÀNG HÀI LÒNG SAU 7 NGÀY SỬ DỤNG',
        overlayTextPos: 'top',
        overlayTextStyle: 'banner',
        overlayTextFontSize: 18,
        overlayTextFontFamily: 'be_vietnam',
        overlayImageScale: 100,
        isMediaPinned: false
      },
      {
        id: 's5',
        title: 'Bước 5: Avatar Tư Vấn & Bắt Từ Khóa "Mua / Giá / Giảm Giá"',
        actionType: 'keyword_consult',
        avatarSpeaker: 'avatar_1',
        durationSeconds: 90,
        scriptText: 'Ai muốn nhận ưu đãi đặc biệt hôm nay thì nhanh tay comment MUA hoặc GIÁ để nhận voucher giảm 50% liền tay nha!',
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
        title: 'Bước 6: Kêu Gọi Chốt Sale & Đếm Ngược Flash Sale Giỏ Hàng',
        actionType: 'cta_sale',
        avatarSpeaker: 'avatar_1',
        durationSeconds: 60,
        scriptText: 'Duy nhất trong phiên live hôm nay, giảm ngay 50% kèm quà tặng cao cấp! Mọi người nhấn ngay vào giỏ hàng góc trái màn hình săn liền tay nha!',
        mediaUrl: '/idols/phong_studio_ngoc_trinh_4k.mp4',
        lipsyncUrl: '/idols/phong_studio_ngoc_trinh_4k.mp4',
        voiceMode: 'avatar_lipsync',
        commentHandling: 'ai_brain',
        overlayText: '⏰ CHỈ CÒN 10 SUẤT CUỐI CÙNG - BẤM GIỎ HÀNG SĂN NGAY!',
        overlayTextPos: 'top',
        overlayTextStyle: 'banner',
        overlayTextFontSize: 20,
        overlayTextFontFamily: 'be_vietnam',
        overlayImageScale: 100,
        isMediaPinned: true
      }
    ]
  },
  {
    id: 'preset_2person_sales',
    name: '🔥 Kịch Bản 2 Người: Idol Live + Trợ Lý Thúc Giục Chốt Đơn',
    category: '2 Người (Duo)',
    avatarCount: 2,
    description: 'Avatar 1 (Idol) chia sẻ sản phẩm, Avatar 2 (Trợ lý) liên tục tạo hiệu ứng FOMO chốt sale.',
    loop: true,
    steps: [
      {
        id: 's1',
        title: 'Bước 1: Idol 1 Chào Mừng & Giới Thiệu Phiên Live',
        actionType: 'avatar_talk',
        avatarSpeaker: 'avatar_1',
        durationSeconds: 60,
        scriptText: 'Dạ em xin chào cả nhà mình nha! Hôm nay em mang đến một bất ngờ siêu ngọt ngào cho tất cả mọi người luôn nè!',
        mediaUrl: '/idols/phong_studio_ngoc_trinh_4k.mp4',
        overlayText: '🎉 PHIÊN LIVE ĐẶC BIỆT CÙNG IDOL & TRỢ LÝ KHO',
        overlayTextStyle: 'banner'
      },
      {
        id: 's2',
        title: 'Bước 2: Trợ Lý 2 Thông Báo Số Lượng Tồn Kho Giới Hạn',
        actionType: 'avatar_talk',
        avatarSpeaker: 'avatar_2',
        durationSeconds: 60,
        scriptText: 'Đúng rồi cả nhà ơi! Bộ phận kho vừa báo số lượng chỉ còn đúng 20 suất ưu đãi giảm 50% cho khách chốt ngay trên live thôi ạ!',
        mediaUrl: '/idols/phong_studio_mai_phuong_thuy_4k.mp4',
        overlayText: '⚠️ CẢNH BÁO: KHO CHỈ CÒN ĐÚNG 20 SUẤT ƯU ĐÃI',
        overlayTextStyle: 'neon_cyber'
      },
      {
        id: 's3',
        title: 'Bước 3: Chiếu Video Sản Phẩm & Trải Nghiệm Thực Tế',
        actionType: 'product_video',
        avatarSpeaker: 'avatar_1',
        durationSeconds: 60,
        productName: 'Combo Mỹ Phẩm Trắng Da 5 Trong 1',
        productPrice: '450.000đ',
        productDiscount: '890.000đ',
        mediaUrl: '/idols/phong_studio_linh_ka_4k.mp4',
        overlayText: '✨ COMBO TRẮNG DA CAO CẤP - TẶNG KÈM QUÀ 300K',
        overlayTextStyle: 'gold_luxury'
      },
      {
        id: 's4',
        title: 'Bước 4: Trợ Lý 2 Thúc Giục Chốt Đơn & Tặng Voucher',
        actionType: 'cta_sale',
        avatarSpeaker: 'avatar_2',
        durationSeconds: 60,
        scriptText: '5 khách hàng đầu tiên bấm nút giỏ hàng và thanh toán em sẽ tặng thêm 1 voucher freeship và quà bí mật trị giá 300k liền tay!',
        mediaUrl: '/idols/phong_studio_mai_phuong_thuy_4k.mp4',
        overlayText: '🎁 BẤM GIỎ HÀNG NGAY - TẶNG QUÀ TRỊ GIÁ 300K',
        overlayTextStyle: 'banner'
      }
    ]
  },
  {
    id: 'preset_3person_pk',
    name: '🎮 Kịch Bản 3 Người: Idol + Trợ Lý + BLV Game PK Hoạt Náo',
    category: '3 Người (Trio)',
    avatarCount: 3,
    description: '3 nhân vật phối hợp: Idol tương tác, Trợ lý chăm đơn, BLV Game hô hào tăng tương tác & quà tặng.',
    loop: true,
    steps: [
      {
        id: 's1',
        title: 'Bước 1: Idol 1 Mở Màn & Khuấy Động Phòng Live',
        actionType: 'avatar_talk',
        avatarSpeaker: 'avatar_1',
        durationSeconds: 60,
        scriptText: 'Hello cả nhà iu! Hôm nay phòng live của chúng ta có trận thách đấu PK siêu gay cấn luôn nha!',
        mediaUrl: '/idols/phong_studio_ngoc_trinh_4k.mp4',
        overlayText: '⚔️ TRẬN ĐẤU PK ĐẠI CHIẾN PHÒNG LIVE 2026',
        overlayTextStyle: 'gradient_rose'
      },
      {
        id: 's2',
        title: 'Bước 2: BLV 3 Đếm Ngược & Kêu Gọi Thả Tim Tặng Quà',
        actionType: 'avatar_talk',
        avatarSpeaker: 'avatar_3',
        durationSeconds: 60,
        scriptText: 'Chào mừng 500 anh em đã có mặt! Chuẩn bị đếm ngược 10 giây trước khi trận combat bùng nổ, anh em cùng thả tim triệu view nào!',
        mediaUrl: '/idols/phong_studio_linh_ka_4k.mp4',
        overlayText: '🔥 ĐẾM NGƯỢC PK - THẢ TIM VÀ TẶNG QUÀ BÙNG NỔ',
        overlayTextStyle: 'neon_cyber'
      },
      {
        id: 's3',
        title: 'Bước 3: Trợ Lý 2 Mở Kho Quà Tặng Độc Quyền',
        actionType: 'avatar_talk',
        avatarSpeaker: 'avatar_2',
        durationSeconds: 60,
        scriptText: 'Đội ngũ trợ lý đã sẵn sàng mở kho quà tặng độc quyền cho ai đóng góp điểm số cao nhất trong hiệp đấu này!',
        mediaUrl: '/idols/phong_studio_mai_phuong_thuy_4k.mp4',
        overlayText: '🎁 KHO QUÀ ĐẶC BIỆT DÀNH CHO TOP ĐÓNG GÓP',
        overlayTextStyle: 'gold_luxury'
      },
      {
        id: 's4',
        title: 'Bước 4: Cả 3 Nhân Vật Cùng Hô Hào Chiến Thắng & Chốt Đơn',
        actionType: 'cta_sale',
        avatarSpeaker: 'all',
        durationSeconds: 60,
        scriptText: '3, 2, 1, Bùng nổ nào anh em ơi! Cảm ơn mọi người đã ủng hộ và nhanh tay bấm vào giỏ hàng nhận deal khủng nha!',
        mediaUrl: '/idols/phong_studio_ngoc_trinh_4k.mp4',
        overlayText: '🏆 CHIẾN THẮNG BÙNG NỔ - DEAL KHỦNG CHO TẤT CẢ',
        overlayTextStyle: 'banner'
      }
    ]
  },
  {
    id: 'preset_4person_talkshow',
    name: '🎙️ Kịch Bản 4 Người: Talkshow Đa Chiều & Chuyên Gia Phân Tích',
    category: '4 Người (Quad)',
    avatarCount: 4,
    description: '4 nhân vật phân vai tuần tự: Host dẫn dắt, 2 Chuyên gia tư vấn và 1 Trợ lý tổng hợp ý kiến.',
    loop: true,
    steps: [
      {
        id: 's1',
        title: 'Bước 1: Host 1 Giới Thiệu Khách Mời & Chủ Đề Talkshow',
        actionType: 'avatar_talk',
        avatarSpeaker: 'avatar_1',
        durationSeconds: 60,
        scriptText: 'Chào mừng quý vị khán giả đến với buổi tọa đàm trực tiếp hôm nay về xu hướng làm đẹp và kinh doanh 2026!',
        mediaUrl: '/idols/phong_studio_ngoc_trinh_4k.mp4',
        overlayText: '🎙️ TỌA ĐÀM CHUYÊN GIA 2026 - TRỰC TIẾP 4K',
        overlayTextStyle: 'banner'
      },
      {
        id: 's2',
        title: 'Bước 2: Chuyên Gia 2 Chia Sẻ Kinh Nghiệm & Giải Pháp',
        actionType: 'avatar_talk',
        avatarSpeaker: 'avatar_2',
        durationSeconds: 60,
        scriptText: 'Cảm ơn bạn đã mời tôi, tôi rất vui khi được chia sẻ những kinh nghiệm thực tế và góc nhìn chuyên sâu cùng quý vị.',
        mediaUrl: '/idols/phong_studio_mai_phuong_thuy_4k.mp4',
        overlayText: '💡 GÓC NHÌN CHUYÊN GIA VỀ GIẢI PHÁP TỐI ƯU',
        overlayTextStyle: 'gold_luxury'
      },
      {
        id: 's3',
        title: 'Bước 3: Trợ Lý 3 Tổng Hợp Câu Hỏi Khán Giả Xem Live',
        actionType: 'avatar_talk',
        avatarSpeaker: 'avatar_3',
        durationSeconds: 60,
        scriptText: 'Đã có rất nhiều câu hỏi rất hay gửi về từ phía khán giả đang xem live rồi ạ, xin mời chuyên gia giải đáp!',
        mediaUrl: '/idols/phong_studio_linh_ka_4k.mp4',
        overlayText: '❓ TỔNG HỢP CÂU HỎI TỪ KHÁN GIẢ ĐANG XEM LIVE',
        overlayTextStyle: 'neon_cyber'
      },
      {
        id: 's4',
        title: 'Bước 4: Chuyên Gia 4 Đúc Kết Giải Pháp & Tặng Tài Liệu',
        actionType: 'cta_sale',
        avatarSpeaker: 'avatar_4',
        durationSeconds: 60,
        scriptText: 'Để đồng hành cùng mọi người, chúng tôi xin gửi tặng bộ tài liệu độc quyền và voucher ưu đãi trong giỏ hàng ngay hôm nay!',
        mediaUrl: '/idols/phong_studio_ngoc_trinh_4k.mp4',
        overlayText: '🎁 NHẬN TÀI LIỆU VÀ ƯU ĐÃI NGAY TRONG GIỎ HÀNG',
        overlayTextStyle: 'gradient_rose'
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
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState('mediaUrl');
  const [mediaPickerStepId, setMediaPickerStepId] = useState(null);
  const [mediaPickerAvatarId, setMediaPickerAvatarId] = useState(null);
  const [presetNameInput, setPresetNameInput] = useState('');
  const [showPresetModal, setShowPresetModal] = useState(false);

  // 📡 State Đồng Bộ Ra Sân Khấu Chính Phần Mềm & OBS
  const [isMasterSynced, setIsMasterSynced] = useState(false);

  // 👥 Cấu hình Multi-Avatar 1-4 người đồng bộ từ hệ thống
  const [multiAvatarConfig, setMultiAvatarConfig] = useState(() => {
    try {
      return getMultiAvatarConfig();
    } catch (e) {
      return { enabled: true, activeCount: 1, avatars: [] };
    }
  });

  // State đối tượng Avatar đang được chọn trên Sân khấu để kéo thả / co giãn
  const [selectedAvatarId, setSelectedAvatarId] = useState('avatar_1');
  const [isDraggingAvatar, setIsDraggingAvatar] = useState(false);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [dragStartTransform, setDragStartTransform] = useState({ x: 0, y: 0, width: 45, height: 75 });
  const stageRef = useRef(null);
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

  // ⚡ Lắng nghe sự kiện thông minh chuyển bước từ hệ thống (Smart Jump)
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

  // Đẩy video và dữ liệu phân đoạn của bước hiện tại lên Sân khấu chính (khi đã BẬT đồng bộ)
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
      secondaryMediaUrl: step.secondaryMediaUrl || null,
      secondaryMediaPos: step.secondaryMediaPos || 'top-right',
      secondaryMediaScale: step.secondaryMediaScale || 40,
      secondaryMediaMuted: step.secondaryMediaMuted !== false,
      overlayImage: step.overlayImage || null,
      overlayImagePos: step.overlayImagePos || 'top-left',
      overlayImageScale: step.overlayImageScale || 100,
      overlayText: step.overlayText || null,
      overlayTextPos: step.overlayTextPos || 'top',
      overlayTextStyle: step.overlayTextStyle || 'banner',
      overlayTextFontFamily: step.overlayTextFontFamily || 'be_vietnam',
      overlayTextFontSize: step.overlayTextFontSize || 20,
      overlayTextColor: step.overlayTextColor || '#ffffff',
      avatarSpeaker: step.avatarSpeaker || 'avatar_1',
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

  // 🛑 DỪNG TỨC THÌ 100%
  const handleStopFlow = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsPlayingFlow(false);
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('avalive:stop_flow_sequencer'));
      if (window.speechSynthesis) window.speechSynthesis.cancel();
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

    toast.success('⏹️ ĐÃ DỪNG TOÀN BỘ CHUỖI KỊCH BẢN!');
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
    toast.success('▶️ BẮT ĐẦU PHÁT CHUỖI KỊCH BẢN TỰ ĐỘNG!');
  };

  // 📡 BẬT / TẮT ĐỒNG BỘ RA SÂN KHẤU CHÍNH
  const handleToggleMasterSync = () => {
    if (!isMasterSynced) {
      setIsMasterSynced(true);
      const step = activePreset.steps[currentStepIndex] || activePreset.steps[0];
      const mediaToPlay = step.mediaUrl || step.lipsyncUrl || '/idols/phong_studio_ngoc_trinh_4k.mp4';
      
      const payload = {
        mediaUrl: mediaToPlay,
        title: step.title,
        actionType: step.actionType,
        scriptText: step.scriptText || '',
        durationSeconds: step.durationSeconds || 60,
        stepIndex: currentStepIndex + 1,
        totalSteps: activePreset?.steps?.length || 1,
        presetName: activePreset?.name || 'Kịch bản Sequencer',
        productName: step.productName || null,
        productPrice: step.productPrice || null,
        productDiscount: step.productDiscount || null,
        productImg: step.productImg || null,
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
        avatarSpeaker: step.avatarSpeaker || 'avatar_1',
        isMediaPinned: !!step.isMediaPinned,
        isPlaying: true
      };

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
          isPlaying: true,
          fit: 'cover',
          sound: true,
          updatedAt: Date.now()
        })
      }).catch(() => {});

      toast.success('📡 ĐÃ BẬT ĐỒNG BỘ: Phát trực tiếp ra Sân Khấu Chính, OBS và TikTok Live Studio!');
    } else {
      setIsMasterSynced(false);
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
    toast.success(`👥 Đã chuyển sang chế độ ${count} Avatar AI`);
  };

  // 🔲 Áp dụng bố cục nhanh cho sân khấu (Solo, Bán hàng, Tọa đàm, PK, Chia khung)
  const handleApplyPresetLayout = (layoutKey) => {
    const preset = STUDIO_STAGE_PRESETS[layoutKey];
    if (!preset || !preset.transforms) return;
    const safeAvatarsList = multiAvatarConfig.avatars || [];
    const updated = {
      ...multiAvatarConfig,
      layoutMode: layoutKey,
      avatars: safeAvatarsList.map(av => {
        const trans = preset.transforms[av.id];
        return trans ? { ...av, transform: { ...(av.transform || {}), ...trans } } : av;
      })
    };
    setMultiAvatarConfig(updated);
    saveMultiAvatarConfig(updated);
    toast.success(`📐 Đã áp dụng bố cục: ${preset.name || layoutKey}`);
  };

  // ⚡ Tự động nạp mẫu kịch bản và chia vai theo số lượng người
  const handleApplyScriptTemplate = (template) => {
    if (!template) return;
    
    if (template.avatarCount && template.avatarCount !== multiAvatarConfig.activeCount) {
      handleChangeAvatarCount(template.avatarCount);
    }

    if (template.steps && Array.isArray(template.steps)) {
      const newPreset = {
        id: `preset_custom_${Date.now()}`,
        name: template.name || `Kịch Bản Mẫu: ${template.category || 'Tùy chỉnh'}`,
        category: template.category || 'Mẫu Kịch Bản',
        avatarCount: template.avatarCount || 1,
        description: template.description || '',
        loop: true,
        steps: JSON.parse(JSON.stringify(template.steps))
      };
      setPresets(prev => [newPreset, ...prev]);
      setActivePresetId(newPreset.id);
      setCurrentStepIndex(0);
      setSecondsRemaining(newPreset.steps[0]?.durationSeconds || 60);
      toast.success(`⚡ Đã nạp & tự động chia ${newPreset.steps.length} bước kịch bản cho ${template.avatarCount || 1} nhân vật!`);
      return;
    }

    if (template.script) {
      const lines = template.script.split('\n').filter(l => l.trim().length > 0);
      const generatedSteps = lines.map((line, idx) => {
        let speaker = 'avatar_1';
        let cleanText = line;
        
        if (line.includes('[Trợ Lý]') || line.includes('[Avatar 2]')) {
          speaker = 'avatar_2';
          cleanText = line.replace(/\[.*?\]:\s*/g, '');
        } else if (line.includes('[BLV Game]') || line.includes('[Avatar 3]')) {
          speaker = 'avatar_3';
          cleanText = line.replace(/\[.*?\]:\s*/g, '');
        } else if (line.includes('[Khách Mời]') || line.includes('[Avatar 4]')) {
          speaker = 'avatar_4';
          cleanText = line.replace(/\[.*?\]:\s*/g, '');
        } else {
          speaker = 'avatar_1';
          cleanText = line.replace(/\[.*?\]:\s*/g, '');
        }

        return {
          id: `step_${Date.now()}_${idx}`,
          title: `Bước ${idx + 1}: ${speaker.toUpperCase()} - ${cleanText.substring(0, 30)}...`,
          actionType: idx === 0 ? 'avatar_talk' : idx === lines.length - 1 ? 'cta_sale' : 'avatar_talk',
          avatarSpeaker: speaker,
          durationSeconds: 45,
          scriptText: cleanText,
          mediaUrl: '/idols/phong_studio_ngoc_trinh_4k.mp4',
          overlayText: `✨ BƯỚC ${idx + 1} - ${speaker.toUpperCase()}`,
          overlayTextStyle: idx % 2 === 0 ? 'banner' : 'neon_cyber'
        };
      });

      const newPreset = {
        id: `preset_split_${Date.now()}`,
        name: template.title || `Kịch Bản Chia Vai ${template.count} Người`,
        category: `${template.count} Người`,
        avatarCount: template.count || 1,
        description: template.desc || '',
        loop: true,
        steps: generatedSteps
      };

      setPresets(prev => [newPreset, ...prev]);
      setActivePresetId(newPreset.id);
      setCurrentStepIndex(0);
      setSecondsRemaining(generatedSteps[0]?.durationSeconds || 60);
      toast.success(`⚡ Đã tự động chia kịch bản thành ${generatedSteps.length} bước cho ${template.count} nhân vật!`);
    }
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

  // Thêm một bước mới vào kịch bản
  const handleAddStep = () => {
    const newStep = {
      id: `step_${Date.now()}`,
      title: `Bước ${activePreset.steps.length + 1}: Phân đoạn mới`,
      actionType: 'avatar_talk',
      avatarSpeaker: 'avatar_1',
      durationSeconds: 60,
      scriptText: 'Xin chào quý vị khán giả và các bạn đang theo dõi phiên live...',
      mediaUrl: '/idols/phong_studio_ngoc_trinh_4k.mp4',
      voiceMode: 'avatar_lipsync',
      commentHandling: 'ai_brain',
      overlayText: '',
      overlayTextPos: 'top',
      overlayTextStyle: 'banner',
      overlayTextFontSize: 20,
      overlayTextFontFamily: 'be_vietnam',
      overlayImageScale: 100,
      isMediaPinned: false
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

  // Nạp file kịch bản (.txt, .docx, .pdf, .json, .xlsx)
  const handleFileUpload = async (stepId, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await readUniversalFile(file);
      if (result && result.text) {
        handleUpdateStep(stepId, 'scriptText', result.text);
        toast.success(`📄 Đã nạp thành công ${file.name}!`);
      } else {
        toast.error('Không thể đọc nội dung file văn bản!');
      }
    } catch (err) {
      toast.error(`Lỗi đọc file: ${err.message}`);
    }
    e.target.value = '';
  };

  // Xử lý nạp media từ UniversalMediaPicker
  const handleSelectMediaFromPicker = (item) => {
    const selectedUrl = item.url || item.path || item.videoUrl || item;
    if (mediaPickerAvatarId) {
      const targetAv = multiAvatarConfig.avatars?.find(a => a.id === mediaPickerAvatarId);
      if (targetAv) {
        const updated = {
          ...multiAvatarConfig,
          avatars: multiAvatarConfig.avatars.map(a => a.id === mediaPickerAvatarId ? { ...a, talkVideo: selectedUrl, idleVideo: selectedUrl } : a)
        };
        setMultiAvatarConfig(updated);
        saveMultiAvatarConfig(updated);
        toast.success(`🎬 Đã nạp video cho #${targetAv.name || mediaPickerAvatarId}`);
      }
      setMediaPickerAvatarId(null);
    } else if (mediaPickerStepId) {
      handleUpdateStep(mediaPickerStepId, mediaPickerTarget, selectedUrl);
      toast.success(`🎬 Đã nạp media lên Sân Khấu: ${item.title || 'Tệp mẫu'}`);
    }
    setMediaPickerOpen(false);
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

  // Căn chỉnh nhanh đối tượng Avatar trên sân khấu
  const handleCenterAvatar = (avatarId) => {
    const safeAvatarsList = multiAvatarConfig.avatars || [];
    const updated = {
      ...multiAvatarConfig,
      avatars: safeAvatarsList.map(av => {
        if (av.id === avatarId) {
          const w = av.transform?.width || 45;
          return {
            ...av,
            transform: {
              ...(av.transform || {}),
              x: Math.max(0, Math.round((100 - w) / 2)),
              y: 15
            }
          };
        }
        return av;
      })
    };
    setMultiAvatarConfig(updated);
    saveMultiAvatarConfig(updated);
    toast.success('📐 Đã căn giữa nhân vật!');
  };

  const handleFillAvatar = (avatarId) => {
    const safeAvatarsList = multiAvatarConfig.avatars || [];
    const updated = {
      ...multiAvatarConfig,
      avatars: safeAvatarsList.map(av => {
        if (av.id === avatarId) {
          return {
            ...av,
            transform: {
              ...(av.transform || {}),
              x: 0,
              y: 0,
              width: 100,
              height: 100
            }
          };
        }
        return av;
      })
    };
    setMultiAvatarConfig(updated);
    saveMultiAvatarConfig(updated);
    toast.success('📐 Đã mở rộng tràn khung!');
  };

  const currentStep = activePreset.steps[currentStepIndex] || activePreset.steps[0];
  const safeAvatars = multiAvatarConfig?.avatars || [];
  const activeAvatarCount = multiAvatarConfig?.activeCount || 1;
  const visibleAvatars = safeAvatars.slice(0, activeAvatarCount);

  return (
    <div className="w-full h-full min-h-0 flex flex-col bg-[#0b0d14] text-gray-100 overflow-hidden select-none font-sans">
      <SvgChromaFilters />

      {/* ========================================================================= */}
      {/* 🚀 TOP TOOLBAR: THANH ĐIỀU KHIỂN ĐỈNH CAO TINH GỌN (CAO 45PX) */}
      {/* ========================================================================= */}
      <div className="bg-[#121524] border-b border-indigo-900/50 px-3.5 py-1.5 flex items-center justify-between gap-2.5 shrink-0 z-20 shadow-md">
        
        {/* Nhóm Trái: Logo, Tiêu đề & Chọn Preset */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gradient-to-r from-rose-500/20 via-indigo-500/20 to-cyan-500/20 border border-indigo-500/30">
            <Layers className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="font-black text-xs text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-indigo-200 to-cyan-300 tracking-wide hidden sm:inline">
              STUDIO 1–4 AVATAR & LIVE
            </span>
          </div>

          {/* Bộ Chọn Preset Kịch Bản */}
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
              title="Thêm kịch bản mới"
            >
              <Plus size={13} />
            </button>
          </div>
        </div>

        {/* Nhóm Phải: Nút Đồng Bộ Sân Khấu Chính & Nút Chạy Test Nội Bộ */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* NÚT ĐỒNG BỘ RA SÂN KHẤU CHÍNH */}
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

          {/* NÚT CHẠY TEST NỘI BỘ */}
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
            <span>{isPlayingFlow ? 'DỪNG TEST' : 'CHẠY TEST NỘI BỘ'}</span>
          </button>

          {/* Bộ Điều Hướng Bước Nhanh */}
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
      <div className="flex-1 flex flex-col lg:flex-row p-2.5 gap-2.5 overflow-hidden min-h-0">
        
        {/* ========================================================================= */}
        {/* 📱 CỘT TRÁI (LEFT PANEL - CHIẾM 40%): SÂN KHẤU BIỂU DIỄN 9:16 STUDIO 1-4 AVATAR */}
        {/* ========================================================================= */}
        <div className="w-full lg:w-[40%] xl:w-[40%] flex flex-col h-full bg-[#111422] rounded-2xl border border-indigo-900/40 p-2.5 shadow-2xl shrink-0 overflow-hidden min-h-0">
          
          {/* Header Sân Khấu Preview */}
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-indigo-900/40 shrink-0">
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

          {/* KHUNG SÂN KHẤU CHUẨN 9:16 DỌC (PHONE SCREEN FRAMEWORK - FULL HEIGHT TỪ TRÊN XUỐNG DƯỚI) */}
          <div ref={stageRef} className="flex-1 w-full h-full flex items-center justify-center min-h-0 overflow-hidden relative">
            <div 
              className="relative w-full h-full max-h-full aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-2xl border-2 border-cyan-500/40 flex items-center justify-center mx-auto select-none"
              style={{ maxHeight: '100%' }}
            >
              {/* Dynamic Island / Notch Mockup Top */}
              <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-20 h-3.5 bg-black/90 rounded-full border border-white/10 z-45 flex items-center justify-center pointer-events-none">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>

              {/* Lớp 1: Video / Ảnh Nền Chính (Main Background Media) */}
              {currentStep?.mediaUrl && isImageMedia(currentStep.mediaUrl) ? (
                <img 
                  key={currentStep.mediaUrl}
                  src={currentStep.mediaUrl} 
                  alt="Stage BG"
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                />
              ) : (
                <video 
                  key={currentStep?.mediaUrl || 'default_bg'}
                  src={currentStep?.mediaUrl || multiAvatarConfig?.backgroundUrl || '/idols/phong_studio_ngoc_trinh_4k.mp4'} 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                />
              )}

              {/* Lớp 1.5: Video Phụ PiP (Picture-in-Picture) */}
              {currentStep?.secondaryMediaUrl && (
                <div 
                  className={`absolute z-20 overflow-hidden rounded-xl border-2 border-indigo-400 shadow-xl pointer-events-none transition-all ${
                    currentStep.secondaryMediaPos === 'top-left' ? 'top-6 left-3' :
                    currentStep.secondaryMediaPos === 'bottom-left' ? 'bottom-20 left-3' :
                    currentStep.secondaryMediaPos === 'bottom-right' ? 'bottom-20 right-3' :
                    'top-6 right-3'
                  }`}
                  style={{ width: `${currentStep.secondaryMediaScale || 40}%` }}
                >
                  <div className="relative aspect-video bg-black">
                    <video 
                      src={currentStep.secondaryMediaUrl} 
                      autoPlay 
                      loop 
                      muted 
                      playsInline 
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-1 left-1 bg-indigo-600/90 text-white text-[8px] font-black px-1.5 py-0.2 rounded">
                      🎬 PiP
                    </span>
                  </div>
                </div>
              )}

              {/* Lớp 2: 1 Đến 4 Avatar AI (Interactive Drag & Visual Live) */}
              {visibleAvatars.map((av, avIdx) => {
                const isCurrentSpeaker = (currentStep?.avatarSpeaker === av.id) || (currentStep?.avatarSpeaker === 'all') || (!currentStep?.avatarSpeaker && avIdx === 0);
                const transform = av.transform || { x: 10 + avIdx * 22, y: 15, width: 45, height: 75, zIndex: 1 };
                const vidSrc = isCurrentSpeaker ? (av.talkVideo || av.idleVideo || currentStep?.mediaUrl) : (av.idleVideo || av.talkVideo || currentStep?.mediaUrl);
                const chromaStyle = av.chromaKey?.enabled ? getChromaStyle(av.chromaKey) : {};
                const isSelected = selectedAvatarId === av.id;

                return (
                  <div 
                    key={av.id}
                    onClick={() => setSelectedAvatarId(av.id)}
                    className={`absolute z-10 transition-all duration-200 cursor-pointer ${
                      isCurrentSpeaker 
                        ? 'ring-2 ring-cyan-400 shadow-lg shadow-cyan-500/40' 
                        : isSelected
                        ? 'ring-2 ring-amber-400'
                        : 'opacity-90 hover:opacity-100'
                    }`}
                    style={{
                      left: `${transform.x ?? (10 + avIdx * 22)}%`,
                      top: `${transform.y ?? 15}%`,
                      width: `${transform.width ?? 45}%`,
                      height: `${transform.height ?? 75}%`,
                      zIndex: transform.zIndex || (avIdx + 1),
                      borderRadius: '14px',
                      overflow: 'hidden'
                    }}
                  >
                    {vidSrc && isImageMedia(vidSrc) ? (
                      <img 
                        src={vidSrc} 
                        alt={av.name} 
                        className="w-full h-full object-cover"
                        style={chromaStyle}
                      />
                    ) : (
                      <video 
                        src={vidSrc || '/idols/phong_studio_ngoc_trinh_4k.mp4'} 
                        autoPlay 
                        loop 
                        muted 
                        playsInline 
                        className="w-full h-full object-cover"
                        style={chromaStyle}
                      />
                    )}

                    {/* Badge Tên & Loa Nói Của Avatar */}
                    <div className="absolute top-1 left-1 bg-black/85 backdrop-blur-xs text-white text-[8px] font-black px-1.5 py-0.5 rounded flex items-center gap-1 border border-white/20">
                      <span className={`w-1.5 h-1.5 rounded-full ${isCurrentSpeaker ? 'bg-cyan-400 animate-ping' : 'bg-gray-400'}`} />
                      <span>#{avIdx + 1} {av.name}</span>
                      {isCurrentSpeaker && <Volume2 size={9} className="text-cyan-300 animate-bounce" />}
                    </div>

                    {/* Quick Button Tải Media Trực Tiếp Khi Click Vào Avatar */}
                    <div className="absolute bottom-1 right-1 opacity-0 hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setMediaPickerAvatarId(av.id);
                          setMediaPickerOpen(true);
                        }}
                        className="px-1.5 py-0.5 rounded bg-blue-600 hover:bg-blue-500 text-[8px] font-bold text-white shadow-md cursor-pointer"
                      >
                        Đổi Clip
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Lớp 3: Banner Hình Ảnh / Poster Deal */}
              {currentStep?.overlayImage && (
                <div 
                  className={`absolute z-25 pointer-events-none transition-all ${
                    currentStep.overlayImagePos === 'top-right' ? 'top-6 right-3' :
                    currentStep.overlayImagePos === 'center' ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' :
                    currentStep.overlayImagePos === 'bottom-left' ? 'bottom-20 left-3' :
                    currentStep.overlayImagePos === 'bottom-right' ? 'bottom-20 right-3' :
                    currentStep.overlayImagePos === 'top' ? 'top-6 left-3 right-3' :
                    currentStep.overlayImagePos === 'bottom' ? 'bottom-20 left-3 right-3' :
                    'top-6 left-3'
                  }`}
                  style={{ width: `${Math.min(90, (currentStep.overlayImageScale || 100) * 0.4)}%` }}
                >
                  <img 
                    src={currentStep.overlayImage} 
                    alt="Overlay Banner" 
                    className="w-full h-auto max-h-32 object-contain drop-shadow-xl rounded-lg"
                  />
                </div>
              )}

              {/* Lớp 4: Tiêu Đề Chữ Typography Xếp Chồng */}
              {currentStep?.overlayText && (
                <div 
                  className={`absolute z-30 pointer-events-none px-3 py-1 text-center transition-all ${
                    currentStep.overlayTextPos === 'bottom' ? 'bottom-24 left-3 right-3' :
                    currentStep.overlayTextPos === 'center' ? 'top-1/2 left-3 right-3 -translate-y-1/2' :
                    'top-6 left-3 right-3'
                  }`}
                >
                  <div className={`inline-block px-3 py-1 rounded-xl font-black shadow-2xl tracking-wide ${
                    currentStep.overlayTextStyle === 'neon_cyber' ? 'bg-black/85 text-cyan-300 border-2 border-cyan-400 shadow-cyan-500/50' :
                    currentStep.overlayTextStyle === 'gold_luxury' ? 'bg-gradient-to-r from-amber-500 to-yellow-300 text-slate-950 border border-yellow-200' :
                    currentStep.overlayTextStyle === 'gradient_rose' ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white' :
                    currentStep.overlayTextStyle === 'minimal_dark' ? 'bg-slate-900/90 text-white border border-slate-700' :
                    'bg-gradient-to-r from-rose-600 via-red-500 to-amber-500 text-white border border-yellow-300/40'
                  }`}
                  style={{
                    fontSize: `${Math.max(10, Math.min(18, (currentStep.overlayTextFontSize || 20) * 0.65))}px`,
                    fontFamily: FONT_FAMILIES.find(f => f.id === currentStep.overlayTextFontFamily)?.font || 'inherit'
                  }}
                  >
                    {currentStep.overlayText}
                  </div>
                </div>
              )}

              {/* Lớp 5: Thẻ Ghim Giỏ Hàng TikTok Shop */}
              {currentStep?.productName && (
                <div className="absolute bottom-2 left-2 right-2 z-35 bg-white/95 backdrop-blur-md rounded-xl p-2 border border-rose-200 shadow-2xl flex items-center gap-2 text-slate-900">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0 text-rose-600 font-bold text-xs">
                    <ShoppingCart size={15} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-black text-gray-900 truncate">
                      {currentStep.productName}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-xs font-black text-rose-600">
                        {currentStep.productPrice || '299.000đ'}
                      </span>
                      {currentStep.productDiscount && (
                        <span className="text-[9px] text-gray-400 line-through">
                          {currentStep.productDiscount}
                        </span>
                      )}
                    </div>
                  </div>
                  <button className="px-2.5 py-1 bg-rose-600 text-white font-black text-[9px] rounded-lg shadow-sm shrink-0">
                    Mua Ngay
                  </button>
                </div>
              )}

              {/* Tag Trạng Thái Live Preview */}
              <div className="absolute top-6 left-2 z-40 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-[9px] font-bold text-white border border-white/20 flex items-center gap-1 pointer-events-none">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live 9:16</span>
              </div>
            </div>
          </div>

          {/* THANH THAO TÁC NHANH DƯỚI SÂN KHẤU */}
          <div className="pt-2 mt-2 border-t border-indigo-900/40 space-y-1.5 shrink-0">
            <div className="flex items-center justify-between gap-1">
              
              {/* Bố cục nhanh */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleApplyPresetLayout('sales_duo')}
                  className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-[10px] border border-slate-700 cursor-pointer"
                  title="Bố cục 2 người chốt đơn"
                >
                  🛍️ Bán Hàng
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPresetLayout('game_pk')}
                  className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 font-bold text-[10px] border border-slate-700 cursor-pointer"
                  title="Bố cục PK"
                >
                  ⚔️ PK Đấu
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPresetLayout('grid_split')}
                  className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-[10px] border border-slate-700 cursor-pointer"
                  title="Chia khung đều"
                >
                  🔲 Chia Khung
                </button>
                <button
                  type="button"
                  onClick={() => handleCenterAvatar(selectedAvatarId)}
                  className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 font-bold text-[10px] border border-slate-700 cursor-pointer"
                  title="Căn giữa nhân vật đang chọn"
                >
                  <Scaling size={11} className="inline mr-0.5" /> Giữa
                </button>
                <button
                  type="button"
                  onClick={() => handleFillAvatar(selectedAvatarId)}
                  className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-300 font-bold text-[10px] border border-slate-700 cursor-pointer"
                  title="Tràn toàn khung hình"
                >
                  <Maximize2 size={11} className="inline mr-0.5" /> Tràn
                </button>
              </div>

              {/* Thông tin Avatar đang nói ở bước này */}
              <div className="text-[10px] font-bold text-indigo-300 truncate max-w-[140px] text-right">
                🗣️ Nói: {currentStep?.avatarSpeaker?.toUpperCase() || 'AVATAR_1'}
              </div>
            </div>

            <p className="text-[9px] text-gray-400 text-center font-medium leading-tight">
              💡 Sân khấu 9:16 hiển thị trực quan toàn bộ các lớp (Video, 1–4 Avatar, Banner, Text, TikTok Shop). Bấm <strong>"Đồng Bộ Ra Sân Khấu Chính"</strong> khi phát thật.
            </p>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 📋 CỘT PHẢI (RIGHT PANEL - CHIẾM 60%): BẢNG ĐIỀU KHIỂN & KỊCH BẢN TỪNG BƯỚC */}
        {/* ========================================================================= */}
        <div className="flex-1 flex flex-col h-full bg-[#111422] rounded-2xl border border-indigo-900/40 overflow-hidden shadow-xl min-w-0">
          
          {/* ===================================================================== */}
          {/* 🌟 THANH CẤU HÌNH THÔNG MINH ĐỈNH CỘT PHẢI (AVATAR COUNT & TEMPLATES) */}
          {/* ===================================================================== */}
          <div className="bg-[#161a2e] border-b border-indigo-900/50 p-2.5 space-y-2 shrink-0">
            
            <div className="flex flex-wrap items-center justify-between gap-2">
              
              {/* 1. Bộ Chọn Số Lượng Nhân Vật (1 Đến 4 Avatar) */}
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

              {/* 2. Nút Thêm Bước & Nạp File */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleAddStep}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={13} />
                  <span>+ Thêm Bước</span>
                </button>
              </div>

            </div>

            {/* 3. Bộ Nạp Kịch Bản Mẫu Tự Động Chia Vai (Smart Script Templates) */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-800/80">
              <span className="text-[11px] font-black text-amber-400 flex items-center gap-1 shrink-0">
                <Sparkles size={12} />
                <span>Mẫu Kịch Bản Chia Vai:</span>
              </span>

              <div className="flex items-center gap-1 flex-wrap flex-1">
                {DEFAULT_PRESETS.map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleApplyScriptTemplate(p)}
                    className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-indigo-900/60 text-slate-300 hover:text-white text-[11px] font-bold border border-slate-700/80 transition-all truncate max-w-[210px] cursor-pointer"
                    title={p.description}
                  >
                    {p.name}
                  </button>
                ))}
                
                {SCRIPT_TEMPLATES.map(tpl => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => handleApplyScriptTemplate(tpl)}
                    className="px-2 py-0.5 rounded-lg bg-indigo-950/70 hover:bg-indigo-800 text-indigo-300 hover:text-white text-[11px] font-bold border border-indigo-700/50 transition-all truncate max-w-[200px] cursor-pointer"
                  >
                    ⚡ {tpl.title}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* ===================================================================== */}
          {/* 📋 DANH SÁCH CÁC BƯỚC KỊCH BẢN (STEPS LIST 1 -> 10+) */}
          {/* ===================================================================== */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
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
                  <div className="p-2.5 bg-slate-800/90 border-b border-slate-700/80 flex flex-wrap items-center justify-between gap-2">
                    
                    {/* Cột Trái: Số bước, Tên bước & Phân loại */}
                    <div className="flex items-center gap-2 flex-1 min-w-[220px]">
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
                      
                      {/* Chọn Avatar Nói */}
                      <select
                        value={step.avatarSpeaker || 'avatar_1'}
                        onChange={(e) => handleUpdateStep(step.id, 'avatarSpeaker', e.target.value)}
                        className="bg-slate-900 text-cyan-300 text-[11px] font-bold px-2 py-1 rounded-lg border border-cyan-500/40 outline-none cursor-pointer"
                      >
                        <option value="avatar_1">🗣️ Avatar 1 (Idol)</option>
                        <option value="avatar_2">🗣️ Avatar 2 (Trợ Lý)</option>
                        <option value="avatar_3">🗣️ Avatar 3 (BLV/PK)</option>
                        <option value="avatar_4">🗣️ Avatar 4 (Khách)</option>
                        <option value="all">👥 Cả Nhóm Cùng Nói</option>
                      </select>

                      {/* Thời lượng */}
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

                      {/* Nút Xem Trước Trên Sân Khấu Cột Trái */}
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentStepIndex(idx);
                          setSecondsRemaining(step.durationSeconds || 60);
                          syncStepToServer(step, idx, true);
                          toast.success(`👁️ Đang hiển thị Bước ${idx + 1} trên Sân khấu!`);
                        }}
                        className="px-2 py-1 bg-cyan-600 hover:bg-cyan-500 text-black font-black text-[10px] rounded-lg shadow-xs flex items-center gap-1 cursor-pointer"
                        title="Xem trước bước này trên sân khấu bên trái"
                      >
                        <Eye size={11} />
                        <span>Xem</span>
                      </button>

                      {/* Nút Mở Rộng / Thu Gọn Cấu Hình Chi Tiết */}
                      <button
                        type="button"
                        onClick={() => setExpandedStepId(isExpanded ? null : step.id)}
                        className="p-1 text-gray-400 hover:text-white rounded bg-slate-900 border border-slate-700 cursor-pointer"
                        title="Mở rộng cài đặt"
                      >
                        {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                      </button>

                      {/* Nút Nhân bản */}
                      <button
                        type="button"
                        onClick={() => handleDuplicateStep(step)}
                        className="p-1 text-gray-400 hover:text-indigo-300 rounded bg-slate-900 border border-slate-700 cursor-pointer"
                        title="Nhân bản bước này"
                      >
                        <Copy size={12} />
                      </button>

                      {/* Nút Xóa */}
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

                  {/* NỘI DUNG TÓM TẮT KỊCH BẢN & LỜI THOẠI */}
                  <div className="p-2.5 space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="flex-1">
                        <textarea
                          value={step.scriptText || ''}
                          onChange={(e) => handleUpdateStep(step.id, 'scriptText', e.target.value)}
                          placeholder="Nhập lời thoại của nhân vật / kịch bản AI cho bước này..."
                          rows={isExpanded ? 3 : 1}
                          className="w-full bg-slate-950/80 text-gray-200 text-xs p-2 rounded-xl border border-slate-800 focus:border-cyan-500 outline-none resize-y transition-all"
                        />
                      </div>

                      {/* Nút đọc thử 0ms */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (step.scriptText) {
                            previewVoiceAudio('vi-VN-Standard-A', step.scriptText);
                          }
                        }}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs shrink-0 cursor-pointer"
                        title="Đọc thử lời thoại ngay"
                      >
                        <Volume2 size={14} />
                      </button>
                    </div>

                    {/* CHI TIẾT CẤU HÌNH KHI MỞ RỘNG (EXPANDED) */}
                    {isExpanded && (
                      <div className="pt-2 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs" onClick={(e) => e.stopPropagation()}>
                        
                        {/* Cột Trái: Loại hành động & Media Nền */}
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

                          <div>
                            <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">
                              Video / Ảnh Nền Chính:
                            </label>
                            <div className="flex items-center gap-1.5">
                              <input 
                                type="text"
                                value={step.mediaUrl || ''}
                                onChange={(e) => handleUpdateStep(step.id, 'mediaUrl', e.target.value)}
                                placeholder="Đường link video hoặc ảnh..."
                                className="flex-1 bg-slate-900 text-gray-200 text-[11px] p-1.5 rounded-lg border border-slate-700 truncate"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setMediaPickerStepId(step.id);
                                  setMediaPickerTarget('mediaUrl');
                                  setMediaPickerAvatarId(null);
                                  setMediaPickerOpen(true);
                                }}
                                className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold rounded-lg shrink-0 cursor-pointer"
                              >
                                Tải / Mẫu
                              </button>
                            </div>
                          </div>

                          {/* Video Phụ PiP */}
                          <div>
                            <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">
                              Video Phụ Xếp Chồng (PiP):
                            </label>
                            <div className="flex items-center gap-1.5">
                              <input 
                                type="text"
                                value={step.secondaryMediaUrl || ''}
                                onChange={(e) => handleUpdateStep(step.id, 'secondaryMediaUrl', e.target.value)}
                                placeholder="Link video phụ PiP..."
                                className="flex-1 bg-slate-900 text-gray-200 text-[11px] p-1.5 rounded-lg border border-slate-700 truncate"
                              />
                              <select
                                value={step.secondaryMediaPos || 'top-right'}
                                onChange={(e) => handleUpdateStep(step.id, 'secondaryMediaPos', e.target.value)}
                                className="bg-slate-900 text-white text-[10px] p-1.5 rounded-lg border border-slate-700 cursor-pointer"
                              >
                                <option value="top-right">Góc Phải Trên</option>
                                <option value="top-left">Góc Trái Trên</option>
                                <option value="bottom-right">Góc Phải Dưới</option>
                                <option value="bottom-left">Góc Trái Dưới</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Cột Phải: Tiêu Đề Neon & Ghim TikTok Shop */}
                        <div className="space-y-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                          <div>
                            <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">
                              Tiêu Đề Chữ Nổi Bật (Typography):
                            </label>
                            <div className="flex items-center gap-1.5">
                              <input 
                                type="text"
                                value={step.overlayText || ''}
                                onChange={(e) => handleUpdateStep(step.id, 'overlayText', e.target.value)}
                                placeholder="Nhập chữ tiêu đề neon/gold..."
                                className="flex-1 bg-slate-900 text-gray-200 text-[11px] p-1.5 rounded-lg border border-slate-700"
                              />
                              <select
                                value={step.overlayTextStyle || 'banner'}
                                onChange={(e) => handleUpdateStep(step.id, 'overlayTextStyle', e.target.value)}
                                className="bg-slate-900 text-white text-[10px] p-1.5 rounded-lg border border-slate-700 cursor-pointer"
                              >
                                <option value="banner">Banner Đỏ Vàng</option>
                                <option value="neon_cyber">Neon Cyber Xanh</option>
                                <option value="gold_luxury">Gold Luxury Vàng</option>
                                <option value="gradient_rose">Gradient Hồng Tím</option>
                              </select>
                            </div>
                          </div>

                          {/* Ghim Sản Phẩm TikTok Shop */}
                          <div>
                            <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">
                              Ghim Sản Phẩm TikTok Shop:
                            </label>
                            <div className="grid grid-cols-2 gap-1.5">
                              <input 
                                type="text"
                                value={step.productName || ''}
                                onChange={(e) => handleUpdateStep(step.id, 'productName', e.target.value)}
                                placeholder="Tên sản phẩm..."
                                className="bg-slate-900 text-gray-200 text-[11px] p-1.5 rounded-lg border border-slate-700"
                              />
                              <input 
                                type="text"
                                value={step.productPrice || ''}
                                onChange={(e) => handleUpdateStep(step.id, 'productPrice', e.target.value)}
                                placeholder="Giá (ví dụ: 299.000đ)..."
                                className="bg-slate-900 text-rose-400 font-bold text-[11px] p-1.5 rounded-lg border border-slate-700"
                              />
                            </div>
                          </div>

                          {/* Nạp File Văn Bản */}
                          <div className="pt-1">
                            <label className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-gray-300 font-bold text-[11px] border border-slate-700 cursor-pointer flex items-center justify-center gap-1">
                              <Upload size={12} />
                              <span>Nạp File Kịch Bản (.txt, .docx, .pdf)</span>
                              <input 
                                type="file" 
                                accept=".txt,.docx,.pdf,.json,.xlsx"
                                onChange={(e) => handleFileUpload(step.id, e)}
                                className="hidden"
                              />
                            </label>
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
      {/* 📁 MODAL CHỌN MEDIA TỪ THƯ VIỆN MẪU */}
      {/* ========================================================================= */}
      {mediaPickerOpen && (
        <UniversalMediaPicker
          isOpen={mediaPickerOpen}
          onClose={() => {
            setMediaPickerOpen(false);
            setMediaPickerStepId(null);
            setMediaPickerAvatarId(null);
          }}
          onSelectMedia={handleSelectMediaFromPicker}
          title={mediaPickerAvatarId ? `Chọn Media Cho Avatar: ${mediaPickerAvatarId}` : 'Chọn Video / Media Mẫu Cho Bước Kịch Bản'}
        />
      )}

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
                placeholder="Ví dụ: Kịch Bản Bán Hàng Mỹ Phẩm 10 Bước..."
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
                        scriptText: 'Xin chào mọi người đã đến với phiên live hôm nay...',
                        mediaUrl: '/idols/phong_studio_ngoc_trinh_4k.mp4',
                        overlayText: '🎉 CHÀO MỪNG ĐẾN VỚI PHIÊN LIVE',
                        overlayTextStyle: 'banner'
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
