import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Shield, CheckCircle2, RotateCcw, 
  Volume2, VolumeX, Sliders, Play, Pause, Swords, Flame, 
  Zap, Trophy, AlertCircle, X, Sparkles, UserCheck, PlayCircle, StopCircle, 
  Minimize2, Maximize2, Gift, Plus, Trash2, Move, Mic, Radio, Copy, Upload, Music, Music2, ExternalLink, Key, Filter
} from 'lucide-react';
import { battleAudio } from './battleAudioEngine';
import { battleCommentary } from './battleCommentaryEngine';
import { ELEVENLABS_VOICES, FREE_VOICES, ALL_SYSTEM_VOICES, previewVoiceAudio, stopVoiceAudio } from '../../../utils/voiceSyncService';
import { getGiftConfig, saveGiftConfig, DEFAULT_GIFT_MARQUEE_SETTINGS } from '../../../utils/giftSyncService';
import GameVoiceConfigPanel from './GameVoiceConfigPanel';
import { battleVoiceEngine } from './gameVoiceEngine';


const SIMULATED_USERS = [
  'Nguyễn Hùng', 'Trần Mai', 'Hoàng Long', 'Minh Quân', 
  'Hồng Hạnh', 'Tuấn Kiệt', 'Bảo Trâm', 'Quang Huy', 
  'Khánh Linh', 'Gia Bảo', 'Phương Thảo', 'Đức Anh', 
  'Hải Yến', 'Thành Đạt', 'Ngọc Ánh', 'Việt Hoàng',
  'Thanh Tùng', 'Mỹ Duyên', 'Quốc Bảo', 'Lan Anh'
];

export const DEFAULT_GIFTS = [
  // 1. Phổ biến (1 - 10 xu)
  { id: 'flag_vn', name: 'Cờ Tổ Quốc 🇻🇳', icon: '🇻🇳', coins: 1, tier: 'Tân Binh', buff: '+10 HP Xung Trận', skill: 'Vào Trận' },
  { id: 'rose', name: 'Hoa Hồng 🌹', icon: '🌹', coins: 1, tier: 'Tân Binh', buff: '+10 HP Tăng Tốc', skill: 'Bắn Tim' },
  { id: 'heart_tap', name: 'Thả Tim 🧡', icon: '🧡', coins: 1, tier: 'Tân Binh', buff: '+10 HP Tiếp Lực', skill: 'Thả Tim' },
  { id: 'very_good', name: 'Rất Tốt 👍', icon: '👍', coins: 1, tier: 'Tân Binh', buff: '+10 HP Khích Lệ', skill: 'Khích Lệ' },
  { id: 'birthday_cake', name: 'Bánh Sinh Nhật 🍰', icon: '🍰', coins: 1, tier: 'Tân Binh', buff: '+15 HP Hồi Phục', skill: 'Hồi Máu' },
  { id: 'dallah', name: 'Dallah Chào Mừng 🫖', icon: '🫖', coins: 1, tier: 'Tân Binh', buff: '+15 HP Tiếp Sức', skill: 'Trà Đạo' },
  { id: 'heart_shot', name: 'Bắn Tim 🫰', icon: '🫰', coins: 1, tier: 'Tân Binh', buff: '+15 HP Nạp Năng Lượng', skill: 'Bắn Tim' },
  { id: 'bing_chilling', name: 'Bing Chilling 🍦', icon: '🍦', coins: 5, tier: 'Tập Sự', buff: '+25 HP Làm Chậm', skill: 'Đóng Băng' },
  { id: 'peach', name: 'Quả Đào 🍑', icon: '🍑', coins: 5, tier: 'Tập Sự', buff: '+25 HP Sinh Lực', skill: 'Tăng Lực' },
  { id: 'spin_ball', name: 'Trái Bóng Xoáy ⚽', icon: '⚽', coins: 5, tier: 'Tập Sự', buff: '+30 HP Tốc Biến', skill: 'Xoáy Gió' },
  { id: 'magic_fingers', name: 'Ngón Tay Thần Thánh 🤲', icon: '🤲', coins: 6, tier: 'Tập Sự', buff: '+35 HP Phù Phép', skill: 'Thần Lực' },
  { id: 'helmet', name: 'Mũ Cối Yêu Nước 🪖', icon: '🪖', coins: 10, tier: 'Dũng Sĩ', buff: '+50 HP Khiên Thép', skill: 'Hộ Thể' },
  { id: 'flower_bouquet', name: 'Bó Hoa Tươi 💐', icon: '💐', coins: 10, tier: 'Dũng Sĩ', buff: '+50 HP Cổ Vũ', skill: 'Sức Mạnh' },

  // 2. Hiếm (20 - 499 xu)
  { id: 'tea', name: 'Trà Đào ☕', icon: '☕', coins: 20, tier: 'Hiệp Khách', buff: '+80 HP Thư Giãn', skill: 'Dưỡng Lực' },
  { id: 'perfume', name: 'Nước Hoa Hương Tình Yêu 🌸', icon: '🌸', coins: 50, tier: 'Hiệp Khách', buff: '+150 HP + Giáp Bạc', skill: 'Hương Thơm' },
  { id: 'crown', name: 'Vương Miện Hoàng Gia 👑', icon: '👑', coins: 99, tier: 'Hoàng Gia', buff: '+300 HP + Cánh Vàng', skill: 'Thái Cực Trận' },
  { id: 'tank_390', name: 'Xe Tăng 390 🎖️', icon: '🎖️', coins: 99, tier: 'Chiến Binh Thép', buff: '+350 HP Giáp Sắt', skill: 'Pháo Kích' },
  { id: 'corgi', name: 'Corgi Đáng Yêu 🐶', icon: '🐶', coins: 100, tier: 'Linh Thú', buff: '+400 HP Linh Hoạt', skill: 'Corgi Nhảy' },
  { id: 'free_music', name: 'Nhạc Tự Do 🎹', icon: '🎹', coins: 100, tier: 'Linh Thú', buff: '+450 HP Tấu Khúc', skill: 'Phím Nhạc' },
  { id: 'rhythm_robot', name: 'Robot Nhịp Điệu 🤖', icon: '🤖', coins: 199, tier: 'Cơ Giáp', buff: '+600 HP Tấn Công', skill: 'Robot Vũ Đạo' },
  { id: 'boom_drum', name: 'Trống Bùng Nổ 🥁', icon: '🥁', coins: 249, tier: 'Âm Ba Thần Khí', buff: '+800 HP + Sóng Âm', skill: 'Sóng Thần' },
  { id: 'romantic_cello', name: 'Cello Lãng Mạn 🎻', icon: '🎻', coins: 299, tier: 'Âm Ba Thần Khí', buff: '+900 HP Hồi Phục', skill: 'Cello Thần' },
  { id: 'firework_indep', name: 'Pháo Hoa Độc Lập 🎆', icon: '🎆', coins: 299, tier: 'Hào Khí', buff: '+1000 HP Bắn Pháo', skill: 'Pháo Hoa Rực Rỡ' },
  { id: 'chopin_rain', name: 'Chopin Trong Mưa 🌂', icon: '🌂', coins: 349, tier: 'Hào Khí', buff: '+1100 HP Mưa Bão', skill: 'Mưa Rào' },
  { id: 'lead_singer_bear', name: 'Gấu Hát Chính 🐻', icon: '🐻', coins: 399, tier: 'Ca Vương', buff: '+1200 HP Hát Vang', skill: 'Tiếng Hát Thần' },
  { id: 'sage_pea', name: 'Sage Hạt Đậu Thần Kỳ 🫐', icon: '🫐', coins: 399, tier: 'Ca Vương', buff: '+1300 HP Đột Phá', skill: 'Đậu Thần' },
  { id: 'pop_parrot', name: 'Vẹt Ca Sĩ Pop 🦜', icon: '🦜', coins: 400, tier: 'Ca Vương', buff: '+1350 HP Âm Lực', skill: 'Vẹt Ca' },
  { id: 'cat_trumpet', name: 'Kèn Trumpet Mèo 🎺', icon: '🎺', coins: 449, tier: 'Nhạc Sĩ', buff: '+1400 HP Kèn Xung Trận', skill: 'Kèn Lệnh' },

  // 3. Sử thi (500 - 2,999 xu)
  { id: 'alluring_sax', name: 'Tiếng Sax Quyến Rũ 🎷', icon: '🎷', coins: 700, tier: 'Bảo Vật Quốc Gia', buff: '+2200 HP Mê Hoặc', skill: 'Kèn Quyến Rũ' },
  { id: 'dong_son_drum', name: 'Trống Đồng Đông Sơn 🏛️', icon: '🏛️', coins: 999, tier: 'Bảo Vật Quốc Gia', buff: '+3000 HP Trận Đồ', skill: 'Đông Sơn Nộ' },
  { id: 'colorful_ribbon', name: 'Ruy Băng Khoe Sắc ✨', icon: '✨', coins: 1000, tier: 'Bảo Vật Quốc Gia', buff: '+3200 HP Hào Quang', skill: 'Ruy Băng' },
  { id: 'racetrack_launch', name: 'Ra Mắt Đường Đua 🏎️', icon: '🏎️', coins: 1500, tier: 'Siêu Tốc Độ', buff: '+4500 HP Tăng Tốc', skill: 'Bão Táp Xa Lộ' },
  { id: 'healing_hug', name: 'Cái Ôm Chữa Lành 🫂', icon: '🫂', coins: 1600, tier: 'Siêu Tốc Độ', buff: '+5000 HP Hồi Phục Toàn Quân', skill: 'Chữa Lành' },
  { id: 'truong_sa_landmark', name: 'Cột Mốc Trường Sa ⚓', icon: '⚓', coins: 1999, tier: 'Chủ Quyền Thiêng Liêng', buff: '+6000 HP Biển Đảo', skill: 'Sóng Thần Hải Quân' },
  { id: 'tanuki_nut', name: 'Hạt Dẻ Tanuki 🌰', icon: '🌰', coins: 1999, tier: 'Võ Thần', buff: '+6200 HP Thiết Giáp', skill: 'Hạt Dẻ Thần' },
  { id: 'rocky_punch', name: 'Cú Đấm Của Rocky 🥊', icon: '🥊', coins: 1999, tier: 'Võ Thần', buff: '+6500 HP Trực Diện', skill: 'Thiết Quyền' },
  { id: 'interplanetary', name: 'Thám Hiểm Liên Hành Tinh 🧑‍🚀', icon: '🧑‍🚀', coins: 1999, tier: 'Vũ Trụ', buff: '+6800 HP Khám Phá', skill: 'Phi Hành Gia' },
  { id: 'heart_land', name: 'Vùng Đất Trái Tim 🏝️', icon: '🏝️', coins: 2199, tier: 'Kỳ Quan', buff: '+7500 HP Đảo Thần', skill: 'Vùng Đất Vàng' },
  { id: 'sage_xubot', name: 'XuBot Của Sage 🪙', icon: '🪙', coins: 2199, tier: 'Kỳ Quan', buff: '+7600 HP Bắn Tiền', skill: 'XuBot' },
  { id: 'honor_star', name: 'Ngôi Sao Danh Dự ⭐', icon: '⭐', coins: 2200, tier: 'Kỳ Quan', buff: '+7800 HP Hào Quang Sao', skill: 'Sao Vinh Quang' },
  { id: 'motorcycle', name: 'Xe Máy Siêu Phân Khối 🏍️', icon: '🏍️', coins: 2988, tier: 'Phi Đội Tốc Độ', buff: '+9000 HP Đột Kích', skill: 'Phi Mã Trận' },
  { id: 'icecream_truck', name: 'Xe Tải Bán Kem 🚚', icon: '🚚', coins: 2988, tier: 'Phi Đội Tốc Độ', buff: '+9500 HP Cung Cấp', skill: 'Xe Kem Thần' },
  { id: 'rhythm_bear', name: 'Gấu Nhịp Điệu 🧸', icon: '🧸', coins: 2999, tier: 'Thần Thú Nhịp Điệu', buff: '+10000 HP Hộ Thể', skill: 'Gấu Cuồng Nộ' },
  { id: 'contest_fan', name: 'Tín Đồ Thi Đấu 🏆', icon: '🏆', coins: 2999, tier: 'Vinh Quang', buff: '+10500 HP Chiến Thắng', skill: 'Cúp Vàng' },
  { id: 'party_bus', name: 'Xe Buýt Tiệc Tùng 🚌', icon: '🚌', coins: 2999, tier: 'Vinh Quang', buff: '+11000 HP Tiệc Tùng', skill: 'Party Bus' },

  // 4. Huyền thoại (3,000 - 15,999 xu)
  { id: 'hiphop_chicken', name: 'Chú Gà Hip-Hop 🐔', icon: '🐔', coins: 3200, tier: 'Huyền Thoại', buff: '+12000 HP Nhảy Múa', skill: 'Gà Nhảy' },
  { id: 'private_jet', name: 'Chuyên Cơ Hoàng Gia ✈️', icon: '✈️', coins: 4888, tier: 'Phi Thuyền VIP', buff: '+15000 HP Không Kích', skill: 'Oanh Tạc' },
  { id: 'hero_spaceship', name: 'Tàu Không Gian Anh Hùng 🛸', icon: '🛸', coins: 4999, tier: 'Phi Thuyền VIP', buff: '+16000 HP Đột Kích Vũ Trụ', skill: 'UFO Oanh Tạc' },
  { id: 'golden_dragon', name: 'Rồng Vàng Thăng Long 🐉', icon: '🐉', coins: 5000, tier: 'Kim Long Thăng Thiên', buff: '+18000 HP Long Uy', skill: 'Long Trảo Thủ' },
  { id: 'star_heroes_stage', name: 'Sân Khấu Star Heroes 🎪', icon: '🎪', coins: 5999, tier: 'Sân Khấu Chí Tôn', buff: '+20000 HP Tỏa Sáng', skill: 'Đại Sân Khấu' },
  { id: 'solid_finish', name: 'Vững Vàng Về Đích 🏁', icon: '🏁', coins: 6000, tier: 'Chiến Thần', buff: '+21000 HP Quyết Thắng', skill: 'Cán Đích' },
  { id: 'rust_reborn', name: 'Rust Tái Sinh 🤖', icon: '🤖', coins: 6000, tier: 'Cơ Giáp Tối Thượng', buff: '+22000 HP + Tia Lazer', skill: 'Laze Hủy Diệt' },
  { id: 'work_hard_play_hard', name: 'Làm Hết Sức Chơi Hết Mình 🎉', icon: '🎉', coins: 6000, tier: 'Đại Tiệc', buff: '+23000 HP Bùng Nổ', skill: 'Pháo Hoa Tiệc' },
  { id: 'lili_leopard', name: 'Báo Đốm Lili 🐆', icon: '🐆', coins: 6599, tier: 'Thần Thú', buff: '+24000 HP Thần Tốc', skill: 'Báo Đột Kích' },
  { id: 'rust_vs_world', name: 'Rust vs Thế Giới ⚔️', icon: '⚔️', coins: 9999, tier: 'Chí Tôn Đại Chiến', buff: '+32000 HP Trận Thế', skill: 'Đại Chiến' },
  { id: 'sunset_racetrack', name: 'Đường Đua Hoàng Hôn 🏎️', icon: '🏎️', coins: 10000, tier: 'Siêu Xa Lộ', buff: '+35000 HP Siêu Tốc', skill: 'Xa Lộ Hoàng Hôn' },
  { id: 'superstar', name: 'Siêu Sao 🌟', icon: '🌟', coins: 12000, tier: 'Chí Tôn Sao Sáng', buff: '+40000 HP Tỏa Sáng', skill: 'Sao Kim Cương' },
  { id: 'meteor_shower', name: 'Mưa Sao Băng Kìa! 🌠', icon: '🌠', coins: 15000, tier: 'Thiên Thạch Tinh Hà', buff: '+45000 HP + Mưa Sao', skill: 'Mưa Sao Băng' },
  { id: 'space_party', name: 'Tiệc Tùng Không Gian 👾', icon: '👾', coins: 15000, tier: 'Tinh Cầu', buff: '+46000 HP Bão Điện', skill: 'Laser Party' },
  { id: 'rosary_nebula', name: 'Tinh Vân Mân Khôi 🌌', icon: '🌌', coins: 15000, tier: 'Vũ Trụ Cổ Đại', buff: '+48000 HP Sương Mù Tinh Vân', skill: 'Bão Tinh Vân' },
  { id: 'future_journey', name: 'Hành Trình Tương Lai 🚀', icon: '🚀', coins: 15000, tier: 'Du Hành', buff: '+50000 HP Tên Lửa Vượt Thời Gian', skill: 'Tên Lửa Tương Lai' },
  { id: 'stadium', name: 'Sân Vận Động 🏟️', icon: '🏟️', coins: 15999, tier: 'Đấu Trường La Mã', buff: '+52000 HP Tiếng Hò Reo', skill: 'Đấu Trường' },

  // 5. Thần thoại & Tuyệt phẩm (17,000 - 44,999 xu)
  { id: 'amusement_park', name: 'Công Viên Giải Trí 🎡', icon: '🎡', coins: 17000, tier: 'Ảo Ảnh Kỳ Quan', buff: '+55000 HP Kết Giới', skill: 'Vòng Xoay Thần' },
  { id: 'tiktok_shuttle', name: 'Tàu Con Thoi TikTok 🚀', icon: '🚀', coins: 20000, tier: 'Du Hành Vũ Trụ', buff: '+65000 HP Đột Phá Không Gian', skill: 'Phi Thuyền Tối Cao' },
  { id: 'glory_target', name: 'Mục Tiêu Vinh Quang 🏆', icon: '🏆', coins: 21500, tier: 'Chí Tôn Vinh Quang', buff: '+70000 HP Vương Quyền', skill: 'Đỉnh Vinh Quang' },
  { id: 'phoenix', name: 'Phoenix Phượng Hoàng 🦅', icon: '🦅', coins: 25999, tier: 'Bất Tử Phượng Hoàng', buff: '+80000 HP + Bão Lửa', skill: 'Hỏa Phụng Liêu Nguyên' },
  { id: 'adam_dream', name: 'Giấc Mơ Của Adam 💫', icon: '💫', coins: 25999, tier: 'Hư Ảo Thần Giới', buff: '+85000 HP Mộng Cảnh', skill: 'Ảo Mộng Thiên Thần' },
  { id: 'holy_dragon_flame', name: 'Ngọn Lửa Rồng Thiêng 🐲', icon: '🐲', coins: 26999, tier: 'Thánh Long Tối Thượng', buff: '+90000 HP + Hơi Thở Rồng', skill: 'Long Thần Nộ' },
  { id: 'lion_king', name: 'Sư Tử 🦁', icon: '🦁', coins: 29999, tier: 'Chúa Sơn Lâm', buff: '+100000 HP Gầm Vang', skill: 'Sư Tử Gầm' },
  { id: 'leon_and_lion', name: 'Leon và Sư Tử 👑🦁', icon: '👑🦁', coins: 34000, tier: 'Chí Tôn Vạn Thú', buff: '+110000 HP Vương Giả', skill: 'Sư Tử Hống' },
  { id: 'tiktok_stars', name: 'TikTok Stars ✨💫', icon: '✨💫', coins: 39999, tier: 'Chí Tôn Thiên Hà', buff: '+130000 HP Ánh Sáng Tinh Tú', skill: 'Vũ Trụ Vạn Năng' },
  { id: 'tiktok_universe', name: 'TikTok Universe 🪐🌌', icon: '🪐🌌', coins: 44999, tier: 'Chí Tôn Vạn Giới', buff: '+150000 HP + Toàn Năng', skill: 'Vũ Trụ Thần Chưởng' }
];

export default function GameChienDauAdminModal({ 
  isOpen, 
  onClose,
  onApplyConfig,
  onTriggerRefereeAction
}) {
  const [activeTab, setActiveTab] = useState('commentary'); // 'commentary' | 'bgm' | 'referee' | 'gifts' | 'settings' | 'match' | 'tiktok'
  const [modalWidthMode, setModalWidthMode] = useState('medium'); // 'compact' | 'medium' | 'wide'
  const [isMinimized, setIsMinimized] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [newPromptText, setNewPromptText] = useState('');
  const [isBgmPlayingState, setIsBgmPlayingState] = useState(() => battleAudio.isBgmActive());
  const [isSfxMutedState, setIsSfxMutedState] = useState(() => battleAudio.isSfxMutedState());
  const [isVoiceMutedState, setIsVoiceMutedState] = useState(() => battleAudio.isVoiceMutedState());
  const [availableVoices, setAvailableVoices] = useState([]);
  const [previewingVoiceId, setPreviewingVoiceId] = useState(null);
  const [voiceTierFilter, setVoiceTierFilter] = useState('all'); // 'all', 'pro', 'free'
  const [voiceGenderFilter, setVoiceGenderFilter] = useState('all');
  const [voiceRoleFilter, setVoiceRoleFilter] = useState('all');
  const [activeTestingSfx, setActiveTestingSfx] = useState(null);
  const bgmFileInputRef = useRef(null);

  useEffect(() => {
    const handleAudioStatus = (e) => {
      if (e.detail) {
        if (e.detail.isBgmPlaying !== undefined) setIsBgmPlayingState(e.detail.isBgmPlaying);
        if (e.detail.isSfxMuted !== undefined) setIsSfxMutedState(e.detail.isSfxMuted);
        if (e.detail.isVoiceMuted !== undefined) setIsVoiceMutedState(e.detail.isVoiceMuted);
        if (e.detail.bgmVolume !== undefined) setConfig(c => ({ ...c, bgmVolume: e.detail.bgmVolume }));
        if (e.detail.sfxVolume !== undefined) setConfig(c => ({ ...c, sfxVolume: e.detail.sfxVolume }));
        if (e.detail.voiceVolume !== undefined) setConfig(c => ({ ...c, commentaryVolume: e.detail.voiceVolume }));
      }
    };
    window.addEventListener('battle-audio-status', handleAudioStatus);
    return () => window.removeEventListener('battle-audio-status', handleAudioStatus);
  }, []);

  const handlePreviewVoice = (voice, sampleText = null) => {
    if (previewingVoiceId === voice.id) {
      stopVoiceAudio();
      setPreviewingVoiceId(null);
      return;
    }
    setPreviewingVoiceId(voice.id);
    previewVoiceAudio(voice, sampleText, () => {
      setPreviewingVoiceId(null);
    });
  };

  // Draggable floating modal position state
  const [position, setPosition] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedPos = localStorage.getItem('GAME_ADMIN_MODAL_POS');
      if (savedPos) {
        try { return JSON.parse(savedPos); } catch (e) {}
      }
      return { x: Math.max(16, window.innerWidth - 560), y: 16 };
    }
    return { x: 40, y: 40 };
  });

  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, posX: 0, posY: 0 });
  const modalRef = useRef(null);

  // Auto simulation state
  const [isSimulating, setIsSimulating] = useState(false);
  const simTimerRef = useRef(null);

  // Dragging Handlers
  const handleDragStart = useCallback((e) => {
    if (e.target.closest('button') || e.target.closest('input') || e.target.closest('select') || e.target.closest('textarea')) return;
    
    setIsDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    dragRef.current = {
      startX: clientX,
      startY: clientY,
      posX: position.x,
      posY: position.y
    };
  }, [position]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      
      const dx = clientX - dragRef.current.startX;
      const dy = clientY - dragRef.current.startY;

      const modalWidth = isMinimized ? 320 : (modalRef.current?.offsetWidth || 650);
      const modalHeight = isMinimized ? 60 : (modalRef.current?.offsetHeight || 550);

      const maxX = Math.max(0, window.innerWidth - modalWidth - 10);
      const maxY = Math.max(0, window.innerHeight - modalHeight - 10);

      const newX = Math.max(10, Math.min(maxX, dragRef.current.posX + dx));
      const newY = Math.max(10, Math.min(maxY, dragRef.current.posY + dy));

      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setPosition(prev => {
        localStorage.setItem('GAME_ADMIN_MODAL_POS', JSON.stringify(prev));
        return prev;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleMouseMove);
    window.addEventListener('touchend', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, isMinimized]);

  // Editable config state
  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem('GAME_BATTLE_CONFIG');
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        const gifts = (parsed.gifts && Array.isArray(parsed.gifts) && parsed.gifts.length >= 25) ? parsed.gifts : DEFAULT_GIFTS;
        return {
          ...parsed,
          gifts,
          showGiftHud: parsed.showGiftHud !== undefined ? parsed.showGiftHud : true,
          tiktokUsername: parsed.tiktokUsername || '',
          bgmTrack: parsed.bgmTrack || 'epic_synth',
          bgmVolume: parsed.bgmVolume !== undefined ? parsed.bgmVolume : 0.4,
          sfxVolume: parsed.sfxVolume !== undefined ? parsed.sfxVolume : 0.7,
          commentaryVolume: parsed.commentaryVolume !== undefined ? parsed.commentaryVolume : 0.9,
          commentaryInterval: parsed.commentaryInterval !== undefined ? parsed.commentaryInterval : 15,
          commentaryEnabled: parsed.commentaryEnabled !== undefined ? parsed.commentaryEnabled : true,
          customBgmName: parsed.customBgmName || '',
          customBgmUrl: parsed.customBgmUrl || null
        };
      } catch (e) {}
    }
    return {
      title: 'Kingdom Clash: Ultimate War',
      blueName: 'Rồng Xanh',
      blueColor: '#2f6bff',
      redName: 'Hổ Đỏ',
      redColor: '#ff3b4e',
      maxHp: 1000,
      comebackThreshold: 30,
      charScale: 1.0,
      bgmTrack: 'epic_synth',
      bgmVolume: 0.4,
      sfxVolume: 0.7,
      commentaryVolume: 0.9,
      commentaryInterval: 15,
      commentaryEnabled: true,
      soundEnabled: true,
      showGiftHud: true,
      tiktokUsername: '',
      customBgmName: '',
      customBgmUrl: null,
      gifts: DEFAULT_GIFTS
    };
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const voices = battleCommentary.getAvailableVoices();
      setAvailableVoices(voices);

      const saved = localStorage.getItem('GAME_BATTLE_CONFIG');
      if (saved) {
        try { 
          const parsed = JSON.parse(saved);
          const gifts = (parsed.gifts && Array.isArray(parsed.gifts) && parsed.gifts.length >= 25) ? parsed.gifts : DEFAULT_GIFTS;
          setConfig(prev => ({
            ...prev,
            ...parsed,
            gifts,
            showGiftHud: parsed.showGiftHud !== undefined ? parsed.showGiftHud : true
          }));
        } catch (e) {}
      }
    }
  }, [isOpen]);

  const handleResetDefaultGifts = () => {
    if (window.confirm('Bạn có chắc muốn khôi phục lại toàn bộ danh mục 35 món quà TikTok & cấp bậc trang bị chuẩn không?')) {
      const updated = { ...config, gifts: DEFAULT_GIFTS };
      setConfig(updated);
      localStorage.setItem('GAME_BATTLE_CONFIG', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('GAME_BATTLE_CONFIG_UPDATE', { detail: updated }));
      if (onApplyConfig) onApplyConfig(updated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    }
  };

  // Clean up auto simulation timer when unmounting
  useEffect(() => {
    return () => {
      if (simTimerRef.current) clearInterval(simTimerRef.current);
    };
  }, []);

  const toggleSimulation = () => {
    if (isSimulating) {
      if (simTimerRef.current) clearInterval(simTimerRef.current);
      setIsSimulating(false);
    } else {
      setIsSimulating(true);
      simTimerRef.current = setInterval(() => {
        const isBlue = Math.random() < 0.5;
        const randChoice = Math.random();

        if (randChoice < 0.45) {
          if (onTriggerRefereeAction) {
            onTriggerRefereeAction(isBlue ? 'ADD_BLUE_20' : 'ADD_RED_20');
          }
        } else if (randChoice < 0.60) {
          if (onTriggerRefereeAction) {
            onTriggerRefereeAction(isBlue ? 'TRIGGER_DANCE_BLUE' : 'TRIGGER_DANCE_RED');
          }
        } else if (randChoice < 0.75) {
          if (onTriggerRefereeAction) {
            onTriggerRefereeAction(isBlue ? 'TRIGGER_VAN_KIEM_BLUE' : 'TRIGGER_VAN_KIEM_RED');
          }
        } else if (randChoice < 0.88) {
          if (onTriggerRefereeAction) {
            onTriggerRefereeAction(isBlue ? 'UPGRADE_HERO_BLUE' : 'UPGRADE_HERO_RED');
            onTriggerRefereeAction(isBlue ? 'TRIGGER_THAI_CUC_BLUE' : 'TRIGGER_THAI_CUC_RED');
          }
        } else {
          if (onTriggerRefereeAction) {
            onTriggerRefereeAction(isBlue ? 'TRIGGER_GIANG_LONG_BLUE' : 'TRIGGER_GIANG_LONG_RED');
          }
        }
      }, 1400);
    }
  };

  const handleSaveConfig = () => {
    localStorage.setItem('GAME_BATTLE_CONFIG', JSON.stringify(config));
    
    // Sync commentary engine settings
    battleCommentary.isEnabled = config.commentaryEnabled !== false;
    battleCommentary.intervalSeconds = config.commentaryInterval || 15;
    battleCommentary.volume = config.commentaryVolume !== undefined ? config.commentaryVolume : 0.9;
    battleCommentary.saveSettings();

    // Sync audio engine volume
    battleAudio.setBgmVolume(config.bgmVolume !== undefined ? config.bgmVolume : 0.4);

    window.dispatchEvent(new CustomEvent('GAME_BATTLE_CONFIG_UPDATE', { detail: config }));
    if (onApplyConfig) {
      onApplyConfig(config);
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleCopyOverlayLink = () => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin.replace('localhost', '127.0.0.1.nip.io').replace('127.0.0.1', '127.0.0.1.nip.io')}/?overlay=live`;
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleCustomBgmUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      const updated = {
        ...config,
        bgmTrack: 'custom_upload',
        customBgmName: file.name,
        customBgmUrl: dataUrl
      };
      setConfig(updated);
      localStorage.setItem('GAME_BATTLE_CONFIG', JSON.stringify(updated));
      battleAudio.startBgm('custom_upload', updated.bgmVolume, dataUrl);
      setIsBgmPlayingState(true);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    };
    reader.readAsDataURL(file);
  };

  const toggleBgmPlayback = () => {
    if (isBgmPlayingState) {
      battleAudio.stopBgm();
      setIsBgmPlayingState(false);
    } else {
      battleAudio.startBgm(config.bgmTrack || 'epic_synth', config.bgmVolume || 0.4, config.customBgmUrl);
      setIsBgmPlayingState(true);
    }
  };

  const addPromptScript = () => {
    if (!newPromptText.trim()) return;
    battleCommentary.customPrompts.push(newPromptText.trim());
    battleCommentary.saveSettings();
    setNewPromptText('');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const removePromptScript = (index) => {
    battleCommentary.customPrompts.splice(index, 1);
    battleCommentary.saveSettings();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const testVoiceSpeech = (text) => {
    battleCommentary.speak(text || "Xin chào quý khán giả! Trận chiến PK đỉnh cao của Phe Xanh và Phe Đỏ chính thức bắt đầu!", true);
  };

  const addGiftItem = () => {
    const nextId = Date.now();
    const newGifts = [
      ...(config.gifts || DEFAULT_GIFTS),
      { id: nextId, name: 'Vật phẩm mới', icon: '🎁', coins: 100, tier: 'Hiệp Sĩ', buff: '+300 HP' }
    ];
    setConfig({ ...config, gifts: newGifts });
  };

  const updateGiftItem = (index, field, value) => {
    const updated = [...(config.gifts || DEFAULT_GIFTS)];
    updated[index] = { ...updated[index], [field]: value };
    setConfig({ ...config, gifts: updated });
  };

  const deleteGiftItem = (index) => {
    const updated = (config.gifts || DEFAULT_GIFTS).filter((_, i) => i !== index);
    setConfig({ ...config, gifts: updated });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-start justify-start">
      <div 
        ref={modalRef}
        style={{ 
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          transition: isDragging ? 'none' : 'box-shadow 0.2s ease',
          width: isMinimized 
            ? '320px' 
            : modalWidthMode === 'compact' 
              ? '400px' 
              : modalWidthMode === 'medium' 
                ? '560px' 
                : 'min(94vw, 760px)'
        }}
        className={`pointer-events-auto bg-[#0d0f17]/98 backdrop-blur-2xl border border-purple-500/50 rounded-2xl shadow-2xl shadow-purple-950/60 overflow-hidden flex flex-col ${
          isDragging ? 'cursor-grabbing select-none opacity-95 ring-2 ring-purple-400' : ''
        }`}
      >
        {/* DRAGGABLE HEADER */}
        <div 
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
          className="px-4 py-3 bg-gradient-to-r from-purple-950/90 via-indigo-950/90 to-purple-950/90 border-b border-purple-500/40 flex items-center justify-between cursor-grab select-none"
          title="Nhấn giữ và kéo để di chuyển bảng Quản trị Admin tới bất kỳ đâu"
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-400/30 flex items-center justify-center shrink-0">
              <Move size={14} className="animate-pulse text-purple-300" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xs font-black text-white flex items-center gap-1.5 truncate">
                ADMIN GAME CHIẾN ĐẤU 3D
                {isSimulating && (
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
                )}
                <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30 shrink-0">
                  VIP
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Width Size Switcher */}
            {!isMinimized && (
              <div className="hidden sm:flex items-center bg-black/50 border border-white/10 rounded-lg p-0.5 text-[10px]">
                <button
                  onClick={() => setModalWidthMode('compact')}
                  className={`px-1.5 py-0.5 rounded transition-colors ${modalWidthMode === 'compact' ? 'bg-purple-600 text-white font-bold' : 'text-gray-400 hover:text-white'}`}
                  title="Khung Gọn (400px)"
                >
                  Gọn
                </button>
                <button
                  onClick={() => setModalWidthMode('medium')}
                  className={`px-1.5 py-0.5 rounded transition-colors ${modalWidthMode === 'medium' ? 'bg-purple-600 text-white font-bold' : 'text-gray-400 hover:text-white'}`}
                  title="Khung Vừa (560px)"
                >
                  Vừa
                </button>
                <button
                  onClick={() => setModalWidthMode('wide')}
                  className={`px-1.5 py-0.5 rounded transition-colors ${modalWidthMode === 'wide' ? 'bg-purple-600 text-white font-bold' : 'text-gray-400 hover:text-white'}`}
                  title="Khung Rộng (760px)"
                >
                  Rộng
                </button>
              </div>
            )}

            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              title={isMinimized ? "Mở rộng cửa sổ Admin" : "Thu nhỏ gọn (để xem toàn cảnh trận đấu)"}
            >
              {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
            </button>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Đóng bảng Admin"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Minimized Quick Bar */}
        {isMinimized && (
          <div className="p-3 bg-black/60 flex items-center justify-between gap-2">
            <button
              onClick={toggleSimulation}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                isSimulating 
                  ? 'bg-rose-600 text-white animate-pulse' 
                  : 'bg-emerald-600 text-white'
              }`}
            >
              {isSimulating ? <><StopCircle size={13} /> Dừng Chạy Thử</> : <><PlayCircle size={13} /> Chạy Thử Tự Động</>}
            </button>
            <button
              onClick={() => onTriggerRefereeAction && onTriggerRefereeAction('RESET_MATCH')}
              className="p-1.5 bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 border border-blue-500/40 rounded-lg text-xs font-bold"
              title="Reset Trận"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        )}

        {/* Full Modal Content (PASSWORDLESS) */}
        {!isMinimized && (
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Tabs Bar */}
            <div className="flex border-b border-white/10 bg-black/40 px-3 pt-2 gap-1 overflow-x-auto">
              <button
                onClick={() => setActiveTab('commentary')}
                className={`flex items-center gap-1.5 px-2.5 py-2 rounded-t-lg text-xs font-bold transition-all border-t border-x shrink-0 ${
                  activeTab === 'commentary'
                    ? 'bg-[#11131c] border-purple-500/40 text-purple-300'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                <Mic size={13} className="text-pink-400" /> Voice AI & BLV
              </button>
              <button
                onClick={() => setActiveTab('bgm')}
                className={`flex items-center gap-1.5 px-2.5 py-2 rounded-t-lg text-xs font-bold transition-all border-t border-x shrink-0 ${
                  activeTab === 'bgm'
                    ? 'bg-[#11131c] border-purple-500/40 text-purple-300'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                <Music size={13} className="text-amber-400" /> Nhạc Nền (BGM)
              </button>
              <button
                onClick={() => setActiveTab('tiktok')}
                className={`flex items-center gap-1.5 px-2.5 py-2 rounded-t-lg text-xs font-bold transition-all border-t border-x shrink-0 ${
                  activeTab === 'tiktok'
                    ? 'bg-[#11131c] border-purple-500/40 text-purple-300'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                <Radio size={13} className="text-cyan-400" /> TikTok Live Studio
              </button>
              <button
                onClick={() => setActiveTab('referee')}
                className={`flex items-center gap-1.5 px-2.5 py-2 rounded-t-lg text-xs font-bold transition-all border-t border-x shrink-0 ${
                  activeTab === 'referee'
                    ? 'bg-[#11131c] border-purple-500/40 text-purple-300'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                <Flame size={13} className="text-orange-400" /> Trọng Tài
              </button>
              <button
                onClick={() => setActiveTab('gifts')}
                className={`flex items-center gap-1.5 px-2.5 py-2 rounded-t-lg text-xs font-bold transition-all border-t border-x shrink-0 ${
                  activeTab === 'gifts'
                    ? 'bg-[#11131c] border-purple-500/40 text-purple-300'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                <Gift size={13} className="text-emerald-400" /> Quà & Cây Đồ
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-1.5 px-2.5 py-2 rounded-t-lg text-xs font-bold transition-all border-t border-x shrink-0 ${
                  activeTab === 'settings'
                    ? 'bg-[#11131c] border-purple-500/40 text-purple-300'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                <Sliders size={13} className="text-blue-400" /> Cấu Hình Máu
              </button>
              <button
                onClick={() => setActiveTab('match')}
                className={`flex items-center gap-1.5 px-2.5 py-2 rounded-t-lg text-xs font-bold transition-all border-t border-x shrink-0 ${
                  activeTab === 'match'
                    ? 'bg-[#11131c] border-purple-500/40 text-purple-300'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                <Swords size={13} className="text-red-400" /> Điều Khiển Trận
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-4 overflow-y-auto max-h-[56vh] space-y-4">
              
              {/* ============================================================== */}
              {/* TAB: VOICE AI & BÌNH LUẬN VIÊN TRỰC TIẾP */}
              {/* ============================================================== */}
              {activeTab === 'commentary' && (
                <GameVoiceConfigPanel
                  engine={battleVoiceEngine}
                  gameType="battle"
                />
              )}

              {/* ============================================================== */}
              {/* TAB: ÂM THANH BGM, HIỆU ỨNG SFX & GIỌNG ĐỌC AI */}
              {/* ============================================================== */}
              {activeTab === 'bgm' && (
                <div className="space-y-4">
                  {/* 3 KÊNH ÂM THANH ĐỘC LẬP */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Kênh 1: BGM */}
                    <div className="p-3.5 bg-gradient-to-tr from-amber-950/60 via-black/70 to-amber-950/30 border border-amber-500/50 rounded-xl space-y-2.5 shadow-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-amber-300 uppercase flex items-center gap-1.5">
                          <Music2 size={14} className="text-amber-400" /> Nhạc Nền (BGM)
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-amber-500/20 text-amber-300">
                          {isBgmPlayingState ? '▶ ĐANG PHÁT' : '⏸ ĐÃ TẮT'}
                        </span>
                      </div>
                      <button
                        onClick={toggleBgmPlayback}
                        className={`w-full py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95 ${
                          isBgmPlayingState 
                            ? 'bg-rose-600 hover:bg-rose-500 text-white ring-2 ring-rose-400/50 shadow-rose-900/40 animate-pulse' 
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white ring-2 ring-emerald-400/40 shadow-emerald-900/40'
                        }`}
                      >
                        {isBgmPlayingState ? <><Pause size={13} /> ⏹ TẮT NHẠC NỀN</> : <><Play size={13} /> ▶ BẬT NHẠC NỀN</>}
                      </button>
                      <div className="p-2 bg-black/50 border border-amber-500/20 rounded-lg space-y-1">
                        <div className="flex justify-between text-[11px] font-bold text-gray-300">
                          <span>Âm lượng BGM:</span>
                          <span className="font-mono text-amber-400">{Math.round((config.bgmVolume !== undefined ? config.bgmVolume : 0.4) * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={config.bgmVolume !== undefined ? config.bgmVolume : 0.4}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setConfig({ ...config, bgmVolume: val });
                            battleAudio.setBgmVolume(val);
                          }}
                          className="w-full h-1.5 accent-amber-500"
                        />
                      </div>
                    </div>

                    {/* Kênh 2: SFX Võ Công */}
                    <div className="p-3.5 bg-gradient-to-tr from-purple-950/60 via-black/70 to-purple-950/30 border border-purple-500/50 rounded-xl space-y-2.5 shadow-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-purple-300 uppercase flex items-center gap-1.5">
                          <Zap size={14} className="text-purple-400" /> SFX Võ Công
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-purple-500/20 text-purple-300">
                          {!isSfxMutedState ? '🔊 ĐANG BẬT' : '🔇 ĐÃ TẮT'}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          const next = battleAudio.toggleSfx();
                          setIsSfxMutedState(!next);
                        }}
                        className={`w-full py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95 ${
                          !isSfxMutedState
                            ? 'bg-yellow-500 hover:bg-yellow-400 text-black ring-2 ring-yellow-300/40 shadow-yellow-500/20'
                            : 'bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40'
                        }`}
                      >
                        {!isSfxMutedState ? <Volume2 size={13} /> : <VolumeX size={13} />}
                        <span>{!isSfxMutedState ? '🔊 SFX: ĐANG BẬT' : '🔇 SFX: ĐÃ TẮT'}</span>
                      </button>
                      <div className="p-2 bg-black/50 border border-purple-500/20 rounded-lg space-y-1">
                        <div className="flex justify-between text-[11px] font-bold text-gray-300">
                          <span>Âm lượng SFX:</span>
                          <span className="font-mono text-purple-400">{Math.round((config.sfxVolume !== undefined ? config.sfxVolume : 0.85) * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={config.sfxVolume !== undefined ? config.sfxVolume : 0.85}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setConfig({ ...config, sfxVolume: val });
                            battleAudio.setSfxVolume(val);
                          }}
                          className="w-full h-1.5 accent-purple-500"
                        />
                      </div>
                    </div>

                    {/* Kênh 3: Voice AI */}
                    <div className="p-3.5 bg-gradient-to-tr from-cyan-950/60 via-black/70 to-cyan-950/30 border border-cyan-500/50 rounded-xl space-y-2.5 shadow-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-cyan-300 uppercase flex items-center gap-1.5">
                          <Mic size={14} className="text-cyan-400" /> Giọng Đọc BLV
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-cyan-500/20 text-cyan-300">
                          {!isVoiceMutedState ? '🎙️ ĐANG BẬT' : '🔇 ĐÃ TẮT'}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          const next = battleAudio.toggleVoice();
                          setIsVoiceMutedState(!next);
                          battleVoiceEngine.setMuted(!next);
                        }}
                        className={`w-full py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95 ${
                          !isVoiceMutedState
                            ? 'bg-cyan-500 hover:bg-cyan-400 text-black ring-2 ring-cyan-300/40 shadow-cyan-500/20'
                            : 'bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40'
                        }`}
                      >
                        {!isVoiceMutedState ? <Volume2 size={13} /> : <VolumeX size={13} />}
                        <span>{!isVoiceMutedState ? '🎙️ VOICE: ĐANG BẬT' : '🔇 VOICE: ĐÃ TẮT'}</span>
                      </button>
                      <div className="p-2 bg-black/50 border border-cyan-500/20 rounded-lg space-y-1">
                        <div className="flex justify-between text-[11px] font-bold text-gray-300">
                          <span>Âm lượng Voice:</span>
                          <span className="font-mono text-cyan-400">{Math.round((config.commentaryVolume !== undefined ? config.commentaryVolume : 1.0) * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={config.commentaryVolume !== undefined ? config.commentaryVolume : 1.0}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setConfig({ ...config, commentaryVolume: val });
                            battleAudio.setVoiceVolume(val);
                            battleVoiceEngine.setVolume(val);
                          }}
                          className="w-full h-1.5 accent-cyan-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* BGM Player Controller */}
                  <div className="p-3.5 bg-black/40 border border-amber-500/40 rounded-xl space-y-3">
                    {/* Track Selection */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-gray-200 block">Chọn bài nhạc nền PK:</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {[
                          { id: 'epic_synth', name: '⚔️ Kiếm Hiệp Hùng Tráng (Epic Synth)', desc: 'Giai điệu ngũ cung hào sảng' },
                          { id: 'war_horns', name: '📯 Chiến Trường Rực Lửa (War Chords)', desc: 'Âm hưởng hành khúc thúc giục' },
                          { id: 'edm_live', name: '⚡ Vũ Điệu TikTok Live (Upbeat EDM)', desc: 'Nhịp beat sôi động kéo view' },
                          { id: 'custom_upload', name: '📁 Nhạc MP3 Của Bạn', desc: config.customBgmName || 'Chưa tải file lên' }
                        ].map(t => (
                          <div 
                            key={t.id}
                            onClick={() => {
                              setConfig({ ...config, bgmTrack: t.id });
                              if (isBgmPlayingState) {
                                battleAudio.startBgm(t.id, config.bgmVolume, config.customBgmUrl);
                              }
                            }}
                            className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                              config.bgmTrack === t.id 
                                ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-md' 
                                : 'bg-black/40 border-white/10 text-gray-300 hover:bg-white/5'
                            }`}
                          >
                            <div className="text-xs font-bold flex items-center justify-between">
                              <span>{t.name}</span>
                              {config.bgmTrack === t.id && <span className="text-[9px] bg-amber-400 text-black px-1.5 py-0.2 rounded font-black">CHỌN</span>}
                            </div>
                            <div className="text-[10px] text-gray-400 mt-0.5 truncate">{t.desc}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Custom MP3 File Upload */}
                    <div className="p-3 bg-black/50 border border-white/10 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-gray-200 block">Tải Nhạc Nền MP3 Từ Máy Tính:</span>
                          <span className="text-[10px] text-gray-400">Hỗ trợ file MP3, WAV lưu trực tiếp vào máy</span>
                        </div>
                        <input
                          type="file"
                          ref={bgmFileInputRef}
                          accept="audio/*"
                          onChange={handleCustomBgmUpload}
                          className="hidden"
                        />
                        <button
                          onClick={() => bgmFileInputRef.current?.click()}
                          className="px-3 py-1.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-lg text-xs font-bold shadow flex items-center gap-1.5"
                        >
                          <Upload size={13} /> Tải MP3 Lên
                        </button>
                      </div>
                      {config.customBgmName && (
                        <div className="text-[11px] text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded flex items-center justify-between">
                          <span>🎵 Đang sử dụng: <strong>{config.customBgmName}</strong></span>
                          <button
                            onClick={() => {
                              setConfig({ ...config, customBgmName: '', customBgmUrl: null, bgmTrack: 'epic_synth' });
                              battleAudio.startBgm('epic_synth', config.bgmVolume);
                            }}
                            className="text-red-400 hover:underline text-[10px]"
                          >
                            Xóa file
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* THƯ VIỆN 8 CHIÊU THỨC SFX NGHE THỬ */}
                  <div className="p-3.5 bg-purple-950/20 border border-purple-500/30 rounded-xl space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                        <Zap size={14} className="text-purple-400" /> Thư Viện Hiệu Ứng Tuyệt Kỹ Võ Công (SFX):
                      </span>
                      <span className="text-[10px] text-gray-400">Bấm nút để nghe thử âm thanh</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'vankiem', name: '🗡️ Vạn Kiếm Quy Tông', fn: () => battleAudio.playVanKiemQuyTong() },
                        { id: 'gianglong', name: '🐉 Giáng Long Chưởng', fn: () => battleAudio.playGiangLongChuong() },
                        { id: 'lucmach', name: '⚡ Lục Mạch Thần Kiếm', fn: () => battleAudio.playLucMachThanKiem() },
                        { id: 'thaicuc', name: '☯️ Thái Cực Kiếm Trận', fn: () => battleAudio.playThaiCucKiemTran() },
                        { id: 'docco', name: '🌪️ Độc Cô Cửu Kiếm', fn: () => battleAudio.playDocCoCuuKiem() },
                        { id: 'nhulai', name: '✋ Như Lai Thần Chưởng', fn: () => battleAudio.playNhuLaiThanChuong() },
                        { id: 'thienngoai', name: '❄️ Thiên Ngoại Phi Tiên', fn: () => battleAudio.playThienNgoaiPhiTien() },
                        { id: 'kimcang', name: '🔔 Kim Cang Bất Hoại', fn: () => battleAudio.playKimCangBatHoai() },
                      ].map(s => (
                        <button
                          key={s.id}
                          onClick={() => {
                            setActiveTestingSfx(s.id);
                            s.fn();
                            setTimeout(() => setActiveTestingSfx(null), 1000);
                          }}
                          className={`p-2 rounded-lg text-left text-xs font-bold transition-all border ${
                            activeTestingSfx === s.id
                              ? 'bg-purple-600 text-white border-purple-300 ring-2 ring-purple-400 animate-pulse'
                              : 'bg-black/40 hover:bg-white/10 text-gray-200 border-white/10'
                          }`}
                        >
                          <div className="truncate">{s.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* TAB: KẾT NỐI TIKTOK LIVE STUDIO & ĐA NỀN TẢNG */}
              {/* ============================================================== */}
              {activeTab === 'tiktok' && (
                <div className="space-y-3">
                  <div className="p-3.5 bg-gradient-to-r from-cyan-950/40 to-blue-950/40 border border-cyan-500/40 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-black text-cyan-300 uppercase flex items-center gap-1.5">
                          <Radio size={14} className="text-cyan-400" /> Kết Nối TikTok Live Studio & OBS
                        </h4>
                        <p className="text-[10px] text-gray-300 mt-0.5">
                          Đưa trận đấu vào TikTok LIVE Studio dạng Nguồn Trình Duyệt (Browser Source) hoặc Cửa Sổ Trong Suốt.
                        </p>
                      </div>
                    </div>

                    {/* TikTok ID Input */}
                    <div className="p-3 bg-black/50 border border-white/10 rounded-xl space-y-2">
                      <label className="text-xs font-bold text-gray-200 block">TikTok Username / ID Live:</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={config.tiktokUsername || ''}
                          onChange={(e) => setConfig({ ...config, tiktokUsername: e.target.value })}
                          placeholder="Nhập @username của bạn trên TikTok (Ví dụ: @avalive.vip)..."
                          className="flex-1 px-3 py-1.5 bg-black/60 border border-cyan-500/30 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                        />
                        <button
                          onClick={handleSaveConfig}
                          className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold shrink-0 shadow"
                        >
                          Kết Nối
                        </button>
                      </div>
                    </div>

                    {/* Global Overlay Banner */}
                    <div className="p-3 bg-cyan-950/30 border border-cyan-500/20 rounded-xl space-y-1.5 text-[11px] text-gray-300">
                      <div className="font-bold text-cyan-300 text-xs flex items-center gap-1.5">
                        <Radio size={13} className="text-yellow-400" /> Xuất Hình Sang TikTok Live Studio / OBS Studio:
                      </div>
                      <div>
                        Đường dẫn Overlay sạch 100% cho mọi chế độ hiện đã được tích hợp tập trung tại nút <span className="font-bold text-yellow-300 bg-black/50 px-1.5 py-0.5 rounded border border-yellow-500/30">📡 Link Live</span> trên thanh Menu chính (Header) của phần mềm.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* TAB: TRỌNG TÀI & CHẠY THỬ TỰ ĐỘNG */}
              {/* ============================================================== */}
              {activeTab === 'referee' && (
                <div className="space-y-3">
                  <div className="p-3.5 bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-500/40 rounded-xl space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-purple-300 uppercase flex items-center gap-1.5">
                          <PlayCircle size={14} className="text-purple-400" /> Chế độ Chạy Thử Tự Động
                        </h4>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          Giả lập tương tác khán giả dồn dập, tung Vạn Kiếm Quy Tông & Giáng Long Chưởng
                        </p>
                      </div>
                      <button
                        onClick={toggleSimulation}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all shadow-md ${
                          isSimulating
                            ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/40 animate-pulse'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40'
                        }`}
                      >
                        {isSimulating ? <><StopCircle size={14} /> DỪNG CHẠY THỬ</> : <><PlayCircle size={14} /> BẮT ĐẦU CHẠY THỬ</>}
                      </button>
                    </div>
                  </div>

                  {/* Skills trigger - 8 Tuyệt Kỹ Kiếm Hiệp Đỉnh Cao */}
                  <div className="p-3.5 bg-gradient-to-br from-purple-950/30 to-pink-950/30 border border-purple-500/30 rounded-xl space-y-2.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-purple-300 uppercase flex items-center gap-1.5">
                        <Zap size={13} className="text-yellow-400" /> 8 Tuyệt Kỹ Kiếm Hiệp & Tiên Hiệp Đỉnh Cao
                      </h4>
                      <span className="text-[9px] text-pink-300 bg-pink-950/80 px-2 py-0.5 rounded border border-pink-500/30">
                        Hiệu ứng 3D & Âm thanh độc quyền
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
                      {/* 1. Lục Mạch Thần Kiếm */}
                      <button
                        onClick={() => {
                          if (onTriggerRefereeAction) onTriggerRefereeAction('TRIGGER_LUC_MACH_BLUE');
                          battleCommentary.triggerSkillCommentary('luc_mach', 'blue');
                        }}
                        className="py-2 px-2.5 bg-sky-600/20 hover:bg-sky-600/40 text-sky-300 border border-sky-500/30 rounded-lg text-xs font-bold transition-all text-left flex items-center justify-between"
                      >
                        <div className="truncate">
                          <span className="block font-black truncate">🌈 Lục Mạch Kiếm (Xanh)</span>
                          <span className="text-[8px] text-sky-400">Laser kiếm khí 6 màu</span>
                        </div>
                        <span className="text-[9px] bg-sky-500/30 px-1 py-0.5 rounded text-sky-200 shrink-0">+250 HP</span>
                      </button>
                      <button
                        onClick={() => {
                          if (onTriggerRefereeAction) onTriggerRefereeAction('TRIGGER_LUC_MACH_RED');
                          battleCommentary.triggerSkillCommentary('luc_mach', 'red');
                        }}
                        className="py-2 px-2.5 bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-bold transition-all text-left flex items-center justify-between"
                      >
                        <div className="truncate">
                          <span className="block font-black truncate">🌈 Lục Mạch Kiếm (Đỏ)</span>
                          <span className="text-[8px] text-rose-400">Laser kiếm khí 6 màu</span>
                        </div>
                        <span className="text-[9px] bg-rose-500/30 px-1 py-0.5 rounded text-rose-200 shrink-0">+250 HP</span>
                      </button>

                      {/* 2. Độc Cô Cửu Kiếm */}
                      <button
                        onClick={() => {
                          if (onTriggerRefereeAction) onTriggerRefereeAction('TRIGGER_DOC_CO_BLUE');
                          battleCommentary.triggerSkillCommentary('doc_co', 'blue');
                        }}
                        className="py-2 px-2.5 bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-300 border border-cyan-500/30 rounded-lg text-xs font-bold transition-all text-left flex items-center justify-between"
                      >
                        <div className="truncate">
                          <span className="block font-black truncate">🌪️ Độc Cô Cửu Kiếm (Xanh)</span>
                          <span className="text-[8px] text-cyan-400">Bão lốc xoáy vô chiêu</span>
                        </div>
                        <span className="text-[9px] bg-cyan-500/30 px-1 py-0.5 rounded text-cyan-200 shrink-0">+300 HP</span>
                      </button>
                      <button
                        onClick={() => {
                          if (onTriggerRefereeAction) onTriggerRefereeAction('TRIGGER_DOC_CO_RED');
                          battleCommentary.triggerSkillCommentary('doc_co', 'red');
                        }}
                        className="py-2 px-2.5 bg-orange-600/20 hover:bg-orange-600/40 text-orange-300 border border-orange-500/30 rounded-lg text-xs font-bold transition-all text-left flex items-center justify-between"
                      >
                        <div className="truncate">
                          <span className="block font-black truncate">🌪️ Độc Cô Cửu Kiếm (Đỏ)</span>
                          <span className="text-[8px] text-orange-400">Bão lốc xoáy vô chiêu</span>
                        </div>
                        <span className="text-[9px] bg-orange-500/30 px-1 py-0.5 rounded text-orange-200 shrink-0">+300 HP</span>
                      </button>

                      {/* 3. Như Lai Thần Chưởng */}
                      <button
                        onClick={() => {
                          if (onTriggerRefereeAction) onTriggerRefereeAction('TRIGGER_NHU_LAI_BLUE');
                          battleCommentary.triggerSkillCommentary('nhu_lai', 'blue');
                        }}
                        className="py-2 px-2.5 bg-amber-600/20 hover:bg-amber-600/40 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-bold transition-all text-left flex items-center justify-between"
                      >
                        <div className="truncate">
                          <span className="block font-black truncate">✋ Như Lai Thần Chưởng (Xanh)</span>
                          <span className="text-[8px] text-amber-400">Phật quang thái dương</span>
                        </div>
                        <span className="text-[9px] bg-amber-500/30 px-1 py-0.5 rounded text-amber-200 shrink-0">+500 HP</span>
                      </button>
                      <button
                        onClick={() => {
                          if (onTriggerRefereeAction) onTriggerRefereeAction('TRIGGER_NHU_LAI_RED');
                          battleCommentary.triggerSkillCommentary('nhu_lai', 'red');
                        }}
                        className="py-2 px-2.5 bg-yellow-600/20 hover:bg-yellow-600/40 text-yellow-300 border border-yellow-500/30 rounded-lg text-xs font-bold transition-all text-left flex items-center justify-between"
                      >
                        <div className="truncate">
                          <span className="block font-black truncate">✋ Như Lai Thần Chưởng (Đỏ)</span>
                          <span className="text-[8px] text-yellow-400">Phật quang thái dương</span>
                        </div>
                        <span className="text-[9px] bg-yellow-500/30 px-1 py-0.5 rounded text-yellow-200 shrink-0">+500 HP</span>
                      </button>

                      {/* 4. Thiên Ngoại Phi Tiên */}
                      <button
                        onClick={() => {
                          if (onTriggerRefereeAction) onTriggerRefereeAction('TRIGGER_THIEN_NGOAI_BLUE');
                          battleCommentary.triggerSkillCommentary('thien_ngoai', 'blue');
                        }}
                        className="py-2 px-2.5 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-bold transition-all text-left flex items-center justify-between"
                      >
                        <div className="truncate">
                          <span className="block font-black truncate">❄️ Thiên Ngoại Phi Tiên (Xanh)</span>
                          <span className="text-[8px] text-indigo-400">Băng vũ kiếm chém chớp</span>
                        </div>
                        <span className="text-[9px] bg-indigo-500/30 px-1 py-0.5 rounded text-indigo-200 shrink-0">+350 HP</span>
                      </button>
                      <button
                        onClick={() => {
                          if (onTriggerRefereeAction) onTriggerRefereeAction('TRIGGER_THIEN_NGOAI_RED');
                          battleCommentary.triggerSkillCommentary('thien_ngoai', 'red');
                        }}
                        className="py-2 px-2.5 bg-fuchsia-600/20 hover:bg-fuchsia-600/40 text-fuchsia-300 border border-fuchsia-500/30 rounded-lg text-xs font-bold transition-all text-left flex items-center justify-between"
                      >
                        <div className="truncate">
                          <span className="block font-black truncate">❄️ Thiên Ngoại Phi Tiên (Đỏ)</span>
                          <span className="text-[8px] text-fuchsia-400">Băng vũ kiếm chém chớp</span>
                        </div>
                        <span className="text-[9px] bg-fuchsia-500/30 px-1 py-0.5 rounded text-fuchsia-200 shrink-0">+350 HP</span>
                      </button>

                      {/* 5. Kim Cang Bất Hoại */}
                      <button
                        onClick={() => {
                          if (onTriggerRefereeAction) onTriggerRefereeAction('TRIGGER_KIM_CANG_BLUE');
                          battleCommentary.triggerSkillCommentary('kim_cang', 'blue');
                        }}
                        className="py-2 px-2.5 bg-yellow-600/20 hover:bg-yellow-600/40 text-yellow-300 border border-yellow-500/30 rounded-lg text-xs font-bold transition-all text-left flex items-center justify-between"
                      >
                        <div className="truncate">
                          <span className="block font-black truncate">🔔 Kim Cang Bất Hoại (Xanh)</span>
                          <span className="text-[8px] text-yellow-400">Chuông vàng bất tử phản đòn</span>
                        </div>
                        <span className="text-[9px] bg-yellow-500/30 px-1 py-0.5 rounded text-yellow-200 shrink-0">+400 HP</span>
                      </button>
                      <button
                        onClick={() => {
                          if (onTriggerRefereeAction) onTriggerRefereeAction('TRIGGER_KIM_CANG_RED');
                          battleCommentary.triggerSkillCommentary('kim_cang', 'red');
                        }}
                        className="py-2 px-2.5 bg-amber-600/20 hover:bg-amber-600/40 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-bold transition-all text-left flex items-center justify-between"
                      >
                        <div className="truncate">
                          <span className="block font-black truncate">🔔 Kim Cang Bất Hoại (Đỏ)</span>
                          <span className="text-[8px] text-amber-400">Chuông vàng bất tử phản đòn</span>
                        </div>
                        <span className="text-[9px] bg-amber-500/30 px-1 py-0.5 rounded text-amber-200 shrink-0">+400 HP</span>
                      </button>

                      {/* 6. Vạn Kiếm Quy Tông */}
                      <button
                        onClick={() => {
                          if (onTriggerRefereeAction) onTriggerRefereeAction('TRIGGER_VAN_KIEM_BLUE');
                          battleCommentary.triggerSkillCommentary('van_kiem', 'blue');
                        }}
                        className="py-2 px-2.5 bg-sky-600/20 hover:bg-sky-600/40 text-sky-300 border border-sky-500/30 rounded-lg text-xs font-bold transition-all text-left flex items-center justify-between"
                      >
                        <div className="truncate">
                          <span className="block font-black truncate">⚔️ Vạn Kiếm Quy Tông (Xanh)</span>
                          <span className="text-[8px] text-sky-400">Bão kiếm liên hoàn</span>
                        </div>
                        <span className="text-[9px] bg-sky-500/30 px-1 py-0.5 rounded text-sky-200 shrink-0">+150 HP</span>
                      </button>
                      <button
                        onClick={() => {
                          if (onTriggerRefereeAction) onTriggerRefereeAction('TRIGGER_VAN_KIEM_RED');
                          battleCommentary.triggerSkillCommentary('van_kiem', 'red');
                        }}
                        className="py-2 px-2.5 bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-bold transition-all text-left flex items-center justify-between"
                      >
                        <div className="truncate">
                          <span className="block font-black truncate">⚔️ Vạn Kiếm Quy Tông (Đỏ)</span>
                          <span className="text-[8px] text-rose-400">Bão kiếm liên hoàn</span>
                        </div>
                        <span className="text-[9px] bg-rose-500/30 px-1 py-0.5 rounded text-rose-200 shrink-0">+150 HP</span>
                      </button>

                      {/* 7. Giáng Long Thập Bát Chưởng */}
                      <button
                        onClick={() => {
                          if (onTriggerRefereeAction) onTriggerRefereeAction('TRIGGER_GIANG_LONG_BLUE');
                          battleCommentary.triggerSkillCommentary('giang_long', 'blue');
                        }}
                        className="py-2 px-2.5 bg-amber-600/20 hover:bg-amber-600/40 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-bold transition-all text-left flex items-center justify-between"
                      >
                        <div className="truncate">
                          <span className="block font-black truncate">🐉 Giáng Long Chưởng (Xanh)</span>
                          <span className="text-[8px] text-amber-400">Thần long quét sạch</span>
                        </div>
                        <span className="text-[9px] bg-amber-500/30 px-1 py-0.5 rounded text-amber-200 shrink-0">+350 HP</span>
                      </button>
                      <button
                        onClick={() => {
                          if (onTriggerRefereeAction) onTriggerRefereeAction('TRIGGER_GIANG_LONG_RED');
                          battleCommentary.triggerSkillCommentary('giang_long', 'red');
                        }}
                        className="py-2 px-2.5 bg-orange-600/20 hover:bg-orange-600/40 text-orange-300 border border-orange-500/30 rounded-lg text-xs font-bold transition-all text-left flex items-center justify-between"
                      >
                        <div className="truncate">
                          <span className="block font-black truncate">🐉 Giáng Long Chưởng (Đỏ)</span>
                          <span className="text-[8px] text-orange-400">Thần long quét sạch</span>
                        </div>
                        <span className="text-[9px] bg-orange-500/30 px-1 py-0.5 rounded text-orange-200 shrink-0">+350 HP</span>
                      </button>

                      {/* 8. Thái Cực Kiếm Trận */}
                      <button
                        onClick={() => {
                          if (onTriggerRefereeAction) onTriggerRefereeAction('TRIGGER_THAI_CUC_BLUE');
                          battleCommentary.triggerSkillCommentary('thai_cuc', 'blue');
                        }}
                        className="py-2 px-2.5 bg-teal-600/20 hover:bg-teal-600/40 text-teal-300 border border-teal-500/30 rounded-lg text-xs font-bold transition-all text-left flex items-center justify-between"
                      >
                        <div className="truncate">
                          <span className="block font-black truncate">☯️ Thái Cực Kiếm Trận (Xanh)</span>
                          <span className="text-[8px] text-teal-400">Âm dương hộ thân</span>
                        </div>
                        <span className="text-[9px] bg-teal-500/30 px-1 py-0.5 rounded text-teal-200 shrink-0">+200 HP</span>
                      </button>
                      <button
                        onClick={() => {
                          if (onTriggerRefereeAction) onTriggerRefereeAction('TRIGGER_THAI_CUC_RED');
                          battleCommentary.triggerSkillCommentary('thai_cuc', 'red');
                        }}
                        className="py-2 px-2.5 bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-bold transition-all text-left flex items-center justify-between"
                      >
                        <div className="truncate">
                          <span className="block font-black truncate">☯️ Thái Cực Kiếm Trận (Đỏ)</span>
                          <span className="text-[8px] text-rose-400">Âm dương hộ thân</span>
                        </div>
                        <span className="text-[9px] bg-rose-500/30 px-1 py-0.5 rounded text-rose-200 shrink-0">+200 HP</span>
                      </button>
                    </div>
                  </div>

                  {/* Reinforcements - Đa cấp bậc quân lực */}
                  <div className="p-3.5 bg-gradient-to-br from-amber-950/20 to-orange-950/20 border border-amber-500/30 rounded-xl space-y-2.5">
                    <h4 className="text-xs font-bold text-amber-400 uppercase flex items-center gap-1.5">
                      <Flame size={13} /> Tiếp Viện Quân Lực & Đại Binh
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onTriggerRefereeAction && onTriggerRefereeAction('ADD_BLUE_20')}
                        className="py-1.5 px-2.5 bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-500/30 rounded-lg text-xs font-bold transition-all text-left flex items-center justify-between"
                      >
                        <span>🛡️ +20 Quân Xanh</span>
                        <span className="text-[9px] bg-blue-500/30 px-1 py-0.5 rounded text-blue-200">+20 HP</span>
                      </button>
                      <button
                        onClick={() => onTriggerRefereeAction && onTriggerRefereeAction('ADD_RED_20')}
                        className="py-1.5 px-2.5 bg-red-600/20 hover:bg-red-600/40 text-red-300 border border-red-500/30 rounded-lg text-xs font-bold transition-all text-left flex items-center justify-between"
                      >
                        <span>🗡️ +20 Quân Đỏ</span>
                        <span className="text-[9px] bg-red-500/30 px-1 py-0.5 rounded text-red-200">+20 HP</span>
                      </button>

                      <button
                        onClick={() => onTriggerRefereeAction && onTriggerRefereeAction('ADD_BLUE_50')}
                        className="py-1.5 px-2.5 bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 border border-blue-400/40 rounded-lg text-xs font-black transition-all text-left flex items-center justify-between"
                      >
                        <span>⚡ +50 Đại Binh Xanh</span>
                        <span className="text-[9px] bg-blue-400/40 px-1 py-0.5 rounded text-white">+50 HP</span>
                      </button>
                      <button
                        onClick={() => onTriggerRefereeAction && onTriggerRefereeAction('ADD_RED_50')}
                        className="py-1.5 px-2.5 bg-red-600/30 hover:bg-red-600/50 text-red-200 border border-red-400/40 rounded-lg text-xs font-black transition-all text-left flex items-center justify-between"
                      >
                        <span>🔥 +50 Đại Binh Đỏ</span>
                        <span className="text-[9px] bg-red-400/40 px-1 py-0.5 rounded text-white">+50 HP</span>
                      </button>

                      <button
                        onClick={() => onTriggerRefereeAction && onTriggerRefereeAction('ADD_BLUE_100')}
                        className="py-1.5 px-2.5 bg-gradient-to-r from-blue-600/40 to-indigo-600/40 hover:from-blue-500/50 hover:to-indigo-500/50 text-white border border-blue-300/50 rounded-lg text-xs font-black transition-all text-left flex items-center justify-between shadow-md shadow-blue-500/20"
                      >
                        <span>👑 +100 Thiết Kỵ Xanh</span>
                        <span className="text-[9px] bg-yellow-400 text-black px-1.5 py-0.5 rounded font-black">+100 HP</span>
                      </button>
                      <button
                        onClick={() => onTriggerRefereeAction && onTriggerRefereeAction('ADD_RED_100')}
                        className="py-1.5 px-2.5 bg-gradient-to-r from-red-600/40 to-rose-600/40 hover:from-red-500/50 hover:to-rose-500/50 text-white border border-red-300/50 rounded-lg text-xs font-black transition-all text-left flex items-center justify-between shadow-md shadow-red-500/20"
                      >
                        <span>👑 +100 Thiết Kỵ Đỏ</span>
                        <span className="text-[9px] bg-yellow-400 text-black px-1.5 py-0.5 rounded font-black">+100 HP</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* TAB: QUẢN LÝ QUÀ & BẢNG ĐIỆN CUỘN */}
              {/* ============================================================== */}
              {activeTab === 'gifts' && (
                <div className="space-y-4">
                  
                  {/* BẢNG ĐIỆN CUỘN QUÀ TẶNG CHIẾN ĐẤU */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-pink-950/30 to-black/60 border border-purple-500/40 shadow-xl space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                      <div className="flex items-center gap-2">
                        <Sparkles size={16} className="text-purple-400 animate-spin" style={{ animationDuration: '6s' }} />
                        <h4 className="text-xs sm:text-sm font-black text-purple-300 uppercase tracking-wider">
                          ⚡ Bảng Điện Cuộn Quà Tặng (LED Marquee Ticker)
                        </h4>
                      </div>
                      <span className="text-[11px] text-gray-300 font-medium">
                        Nền trong suốt nhìn xuyên thấu đấu trường, không che nhân vật
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-300 uppercase">Hiển Thị Bảng Điện:</label>
                        <button
                          type="button"
                          onClick={() => {
                            const cur = getGiftConfig('battle').marquee;
                            const updated = { ...cur, enabled: cur.enabled === false ? true : false };
                            saveGiftConfig('battle', { marquee: updated });
                          }}
                          className="w-full py-2 rounded-xl text-xs font-black bg-purple-600 hover:bg-purple-500 text-white transition-all shadow-md"
                        >
                          🟢 BẬT / TẮT BẢNG ĐIỆN
                        </button>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-300 uppercase">Tốc Độ Cuộn:</label>
                        <select
                          defaultValue={getGiftConfig('battle').marquee?.speed || 'normal'}
                          onChange={(e) => {
                            const cur = getGiftConfig('battle').marquee;
                            saveGiftConfig('battle', { marquee: { ...cur, speed: e.target.value } });
                          }}
                          className="w-full px-2.5 py-2 rounded-xl bg-black/60 border border-white/20 text-xs text-white outline-none focus:border-purple-400 font-bold"
                        >
                          <option value="slow">🐢 Chậm (50s)</option>
                          <option value="normal">🚶 Vừa (30s)</option>
                          <option value="fast">⚡ Nhanh (18s)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-300 uppercase">Độ Trong Suốt:</label>
                        <select
                          defaultValue={getGiftConfig('battle').marquee?.opacityMode || 'ultra_transparent'}
                          onChange={(e) => {
                            const cur = getGiftConfig('battle').marquee;
                            saveGiftConfig('battle', { marquee: { ...cur, opacityMode: e.target.value } });
                          }}
                          className="w-full px-2.5 py-2 rounded-xl bg-black/60 border border-white/20 text-xs text-white outline-none focus:border-purple-400 font-bold"
                        >
                          <option value="ultra_transparent">✨ Trong suốt 100% (Khuyên dùng)</option>
                          <option value="glassmorphism">🪟 Kính Mờ (Glass)</option>
                          <option value="semi_dark">⬛ Nền Tối Đậm</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-300 uppercase">Vị Trí Hiển Thị:</label>
                        <select
                          defaultValue={getGiftConfig('battle').marquee?.position || 'bottom'}
                          onChange={(e) => {
                            const cur = getGiftConfig('battle').marquee;
                            saveGiftConfig('battle', { marquee: { ...cur, position: e.target.value } });
                          }}
                          className="w-full px-2.5 py-2 rounded-xl bg-black/60 border border-white/20 text-xs text-white outline-none focus:border-purple-400 font-bold"
                        >
                          <option value="bottom">⬇️ Dưới Đáy Màn Hình</option>
                          <option value="top">⬆️ Trên Đỉnh</option>
                          <option value="floating">🖱️ Tự Do Kéo Thả</option>
                        </select>
                      </div>
                    </div>
                  </div>


                  <div className="p-3.5 bg-purple-950/20 border border-purple-500/30 rounded-xl space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-bold text-purple-300 uppercase flex items-center gap-1.5">
                          <Gift size={13} /> Danh Sách Cấp Bậc Quà & Trang Bị TikTok ({config.gifts?.length || DEFAULT_GIFTS.length} món)
                        </h4>
                        <p className="text-[10px] text-gray-400">Đồng bộ hoàn toàn với Game Bản Đồ Cắm Cờ và Kho Quà TikTok Live</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleResetDefaultGifts}
                          className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] font-bold flex items-center gap-1 shadow transition-all"
                          title="Khôi phục lại toàn bộ danh mục quà 35 món TikTok chuẩn"
                        >
                          <RotateCcw size={11} /> Khôi Phục Quà Chuẩn TikTok
                        </button>
                        <button
                          onClick={addGiftItem}
                          className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold flex items-center gap-1 shadow transition-all"
                        >
                          <Plus size={12} /> Thêm Quà Mới
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {(config.gifts || DEFAULT_GIFTS).map((gift, idx) => (
                        <div key={gift.id || idx} className="p-2.5 bg-black/60 border border-white/10 hover:border-amber-500/30 rounded-xl flex flex-wrap sm:flex-nowrap items-center gap-2 text-xs transition-all">
                          <input
                            type="text"
                            value={gift.icon}
                            onChange={(e) => updateGiftItem(idx, 'icon', e.target.value)}
                            className="w-10 text-center py-1 bg-black/80 border border-white/20 rounded-lg text-base"
                            title="Icon vật phẩm"
                          />
                          <input
                            type="text"
                            value={gift.tier}
                            onChange={(e) => updateGiftItem(idx, 'tier', e.target.value)}
                            placeholder="Cấp bậc..."
                            className="w-28 px-2 py-1 bg-black/80 border border-white/20 rounded-lg font-black text-amber-300 text-xs"
                          />
                          <input
                            type="text"
                            value={gift.buff}
                            onChange={(e) => updateGiftItem(idx, 'buff', e.target.value)}
                            placeholder="Hiệu ứng buff..."
                            className="flex-1 min-w-[120px] px-2 py-1 bg-black/80 border border-white/20 rounded-lg text-gray-300 text-[11px]"
                          />
                          <div className="flex items-center gap-1.5 shrink-0">
                            <div className="flex items-center gap-1 bg-amber-500/20 border border-amber-400/40 px-2 py-0.5 rounded-lg">
                              <span className="text-xs">🪙</span>
                              <input
                                type="number"
                                value={gift.coins}
                                onChange={(e) => updateGiftItem(idx, 'coins', parseInt(e.target.value) || 0)}
                                className="w-14 bg-transparent text-amber-300 font-mono font-black text-right text-xs outline-none"
                              />
                              <span className="text-[10px] text-amber-400 font-bold">xu</span>
                            </div>
                            <button
                              onClick={() => deleteGiftItem(idx)}
                              className="p-1 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
                              title="Xóa quà"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* TAB: CẤU HÌNH PHE & MÁU */}
              {/* ============================================================== */}
              {activeTab === 'settings' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-blue-950/30 border border-blue-500/30 rounded-xl space-y-2">
                      <label className="text-xs font-bold text-blue-400 uppercase block">Phe Xanh (Trái)</label>
                      <div>
                        <span className="text-[10px] text-gray-400 block mb-1">Tên hiển thị</span>
                        <input
                          type="text"
                          value={config.blueName}
                          onChange={(e) => setConfig({ ...config, blueName: e.target.value })}
                          className="w-full px-2.5 py-1.5 bg-black/50 border border-blue-500/30 rounded-lg text-white text-xs font-bold"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 block mb-1">Mã màu</span>
                        <input
                          type="color"
                          value={config.blueColor}
                          onChange={(e) => setConfig({ ...config, blueColor: e.target.value })}
                          className="w-full h-7 bg-transparent cursor-pointer rounded"
                        />
                      </div>
                    </div>

                    <div className="p-3 bg-red-950/30 border border-red-500/30 rounded-xl space-y-2">
                      <label className="text-xs font-bold text-red-400 uppercase block">Phe Đỏ (Phải)</label>
                      <div>
                        <span className="text-[10px] text-gray-400 block mb-1">Tên hiển thị</span>
                        <input
                          type="text"
                          value={config.redName}
                          onChange={(e) => setConfig({ ...config, redName: e.target.value })}
                          className="w-full px-2.5 py-1.5 bg-black/50 border border-red-500/30 rounded-lg text-white text-xs font-bold"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 block mb-1">Mã màu</span>
                        <input
                          type="color"
                          value={config.redColor}
                          onChange={(e) => setConfig({ ...config, redColor: e.target.value })}
                          className="w-full h-7 bg-transparent cursor-pointer rounded"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-black/40 border border-white/10 rounded-xl space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-300">Máu tối đa mỗi phe (Max HP):</span>
                      <input
                        type="number"
                        min="100"
                        max="50000"
                        step="100"
                        value={config.maxHp}
                        onChange={(e) => setConfig({ ...config, maxHp: parseInt(e.target.value) || 1000 })}
                        className="w-28 px-2.5 py-1 bg-black/60 border border-white/20 rounded-lg text-amber-400 text-xs font-mono font-bold text-right"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* TAB: ĐIỀU KHIỂN TRẬN ĐẤU */}
              {/* ============================================================== */}
              {activeTab === 'match' && (
                <div className="space-y-3">
                  <div className="p-3 bg-purple-900/20 border border-purple-500/30 rounded-xl">
                    <h4 className="text-xs font-bold text-purple-300 uppercase mb-2.5 flex items-center gap-1.5">
                      <Swords size={13} /> Thao tác Trận đấu Trực tiếp
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onTriggerRefereeAction && onTriggerRefereeAction('RESET_MATCH')}
                        className="py-2.5 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-all"
                      >
                        <RotateCcw size={13} /> Bắt đầu Trận Mới
                      </button>
                      <button
                        onClick={() => onTriggerRefereeAction && onTriggerRefereeAction('TOGGLE_PAUSE')}
                        className="py-2.5 px-3 bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 border border-amber-500/40 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                      >
                        <Pause size={13} /> Tạm dừng / Tiếp tục
                      </button>
                      <button
                        onClick={() => {
                          if (onTriggerRefereeAction) onTriggerRefereeAction('FINISH_MATCH_BLUE');
                          battleCommentary.triggerVictoryCommentary(config.blueName);
                        }}
                        className="py-2.5 px-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-all"
                      >
                        <Trophy size={13} /> Phe Xanh Thắng
                      </button>
                      <button
                        onClick={() => {
                          if (onTriggerRefereeAction) onTriggerRefereeAction('FINISH_MATCH_RED');
                          battleCommentary.triggerVictoryCommentary(config.redName);
                        }}
                        className="py-2.5 px-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-all"
                      >
                        <Trophy size={13} /> Phe Đỏ Thắng
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Bar */}
            <div className="px-4 py-3 bg-black/60 border-t border-white/10 flex items-center justify-between">
              <span className="text-[10px] text-gray-400 flex items-center gap-1">
                <Shield size={12} className="text-emerald-400" />
                Cấu hình tự động lưu bộ nhớ cục bộ
              </span>

              <div className="flex items-center gap-2">
                {savedSuccess && (
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 animate-in fade-in">
                    <CheckCircle2 size={13} /> Đã lưu thành công!
                  </span>
                )}
                <button
                  onClick={handleSaveConfig}
                  className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all flex items-center gap-1"
                >
                  <CheckCircle2 size={13} /> Lưu & Áp Dụng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
