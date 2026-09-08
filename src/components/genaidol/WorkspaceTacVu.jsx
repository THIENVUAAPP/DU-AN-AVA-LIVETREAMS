import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, MessageCircle, Plus, Gift, Clock, Megaphone, 
  Hand, ShoppingCart, Share, Sparkles, Mic, Heart, Play, HelpCircle, ChevronDown,
  Download, Upload, ShoppingBag, Trash2, Zap, Bot, Volume2, MessageSquare, FileText,
  BookOpen, Layers, Smile, Flame, Crown, Tag, FileUp, Sparkle, RefreshCw, CheckCircle2
} from 'lucide-react';
import { NEW_AI_PROMPT } from '../../utils/defaultAIPrompt';
import { readUniversalFile } from '../../utils/universalDocumentParser';
import WorkspaceKeywordPanel from './WorkspaceKeywordPanel';
import ShopeeLiveConnectModal from './ShopeeLiveConnectModal';
import EventVoiceTester from './EventVoiceTester';

const EVENTS = [
  { id: 'shopee_live', label: '🟠 Shopee Live (URL & Key)', icon: ShoppingBag, color: 'text-[#EE4D2D]', desc: 'Cấu hình URL máy chủ RTMP và Khóa Luồng (Stream Key) kết nối với Kênh Người Bán Shopee Live để đồng bộ phiên phát trực tiếp.' },
  { id: 'checkout', label: 'Chốt đơn', icon: ShoppingCart, color: 'text-blue-500', desc: 'Aldol sẽ thực hiện các câu kêu gọi mua hàng, chốt đơn khi có người hỏi mua.' },
  { id: 'special_gift', label: 'Quà tặng Đặc biệt', icon: Sparkles, color: 'text-yellow-500', desc: 'Tạo ra các phản ứng độc đáo và ấn tượng cho những món quà giá trị (Sư tử, Du thuyền...) để tri ân những người hâm mộ lớn.' },
  { id: 'gift', label: 'Quà tặng (Thường)', icon: Gift, color: 'text-yellow-500', desc: 'Cấu hình phản ứng chung của Aldol khi nhận được các món quà không được liệt kê trong mục "Quà tặng Đặc biệt".' },
  { id: 'comment', label: 'Bình luận', icon: MessageCircle, color: 'text-gray-400', desc: 'Aldol sẽ tự động đọc và trả lời các bình luận của người xem trên phiên live.' },
  { id: 'follow', label: 'Theo dõi', icon: Plus, color: 'text-purple-600', desc: 'Aldol sẽ gửi lời cảm ơn đặc biệt mỗi khi có người xem mới nhấn theo dõi kênh của bạn, giúp tăng tỷ lệ chuyển đổi người xem thành người theo dõi.' },
  { id: 'share', label: 'Chia sẻ', icon: Share, color: 'text-blue-400', desc: 'Cảm ơn người xem đã chia sẻ phiên live.' },
  { id: 'thanks_heart', label: 'Cảm ơn Tim', icon: Heart, color: 'text-red-500', desc: 'Cảm ơn khi người xem thả tim cho phiên live.' },
  { id: 'welcome', label: 'Chào người mới', icon: Hand, color: 'text-yellow-500', desc: 'Aldol sẽ gom nhóm và chào những người xem mới vào phòng sau một khoảng thời gian nhất định, tạo cảm giác thân thiện và được chào đón.' },
  { id: 'call_to_action', label: 'Kêu gọi tương tác', icon: Megaphone, color: 'text-red-500', desc: 'Aldol chủ động kêu gọi mọi người thả tim, share, follow.' },
  { id: 'talking', label: 'Nói chuyện (AI)', icon: Mic, color: 'text-gray-500', desc: 'Giúp livestream không bị "chết". Aldol sẽ tự động bắt chuyện khi không có sự kiện nào xảy ra trong một khoảng thời gian dài.' },
  { id: 'apology', label: 'Xin lỗi', icon: CheckSquare, color: 'text-green-500', desc: 'Cấu hình phản ứng của Aldol khi nó không hiểu một bình luận hoặc gặp phải lỗi không mong muốn.' },
  { id: 'idle', label: 'Im lặng (Chờ)', icon: Clock, color: 'text-orange-500', desc: 'Cấu hình các hành động của Aldol khi ở trạng thái chờ, không có sự kiện nào cần xử lý.' }
];

const GIFT_OPTIONS = [
  // 1. Phổ biến (1 - 10 xu)
  { id: 'flag_vn', name: 'Cờ Tổ Quốc', icon: '🇻🇳', coins: 1, label: '🇻🇳 Cờ Tổ Quốc (1 xu)' },
  { id: 'rose', name: 'Hoa Hồng', icon: '🌹', coins: 1, label: '🌹 Hoa Hồng (1 xu)' },
  { id: 'heart', name: 'Thả Tim', icon: '🧡', coins: 1, label: '🧡 Thả Tim (1 xu)' },
  { id: 'very_good', name: 'Rất Tốt', icon: '👍', coins: 1, label: '👍 Rất Tốt (1 xu)' },
  { id: 'cake', name: 'Bánh Sinh Nhật', icon: '🍰', coins: 1, label: '🍰 Bánh Sinh Nhật (1 xu)' },
  { id: 'dallah', name: 'Dallah Chào Mừng', icon: '🫖', coins: 1, label: '🫖 Dallah Chào Mừng (1 xu)' },
  { id: 'finger_heart', name: 'Bắn Tim / Finger Heart', icon: '🫰', coins: 1, label: '🫰 Bắn Tim (1 xu)' },
  { id: 'peach', name: 'Quả Đào', icon: '🍑', coins: 5, label: '🍑 Quả Đào (5 xu)' },
  { id: 'icecream', name: 'Bing Chilling / Kem', icon: '🍦', coins: 5, label: '🍦 Bing Chilling (5 xu)' },
  { id: 'spin_ball', name: 'Trái Bóng Xoáy', icon: '⚽', coins: 5, label: '⚽ Trái Bóng Xoáy (5 xu)' },
  { id: 'magic_fingers', name: 'Ngón Tay Thần Thánh', icon: '🤲', coins: 6, label: '🤲 Ngón Tay Thần Thánh (6 xu)' },
  { id: 'cap', name: 'Mũ Cối Yêu Nước', icon: '🪖', coins: 10, label: '🪖 Mũ Cối Yêu Nước (10 xu)' },
  { id: 'flower_bouquet', name: 'Bó Hoa Tươi', icon: '💐', coins: 10, label: '💐 Bó Hoa Tươi (10 xu)' },

  // 2. Hiếm (20 - 499 xu)
  { id: 'coffee', name: 'Trà Đào / Cà Phê', icon: '☕', coins: 20, label: '☕ Trà Đào / Cà Phê (20 xu)' },
  { id: 'perfume', name: 'Nước Hoa Hương Tình Yêu', icon: '🌸', coins: 50, label: '🌸 Nước Hoa (50 xu)' },
  { id: 'tank_390', name: 'Xe Tăng 390', icon: '🎖️', coins: 99, label: '🎖️ Xe Tăng 390 (99 xu)' },
  { id: 'crown', name: 'Vương Miện', icon: '👑', coins: 99, label: '👑 Vương Miện (99 xu)' },
  { id: 'corgi', name: 'Corgi Đáng Yêu', icon: '🐶', coins: 100, label: '🐶 Corgi Đáng Yêu (100 xu)' },
  { id: 'free_music', name: 'Nhạc Tự Do', icon: '🎹', coins: 100, label: '🎹 Nhạc Tự Do (100 xu)' },
  { id: 'confetti', name: 'Pháo Hoa / Confetti', icon: '🎉', coins: 100, label: '🎉 Pháo Hoa / Confetti (100 xu)' },
  { id: 'origami', name: 'Hạc Giấy May Mắn', icon: '🕊️', coins: 199, label: '🕊️ Hạc Giấy May Mắn (199 xu)' },
  { id: 'rhythm_robot', name: 'Robot Nhịp Điệu', icon: '🤖', coins: 199, label: '🤖 Robot Nhịp Điệu (199 xu)' },
  { id: 'drum', name: 'Trống Bùng Nổ', icon: '🥁', coins: 249, label: '🥁 Trống Bùng Nổ (249 xu)' },
  { id: 'romantic_cello', name: 'Cello Lãng Mạn', icon: '🎻', coins: 299, label: '🎻 Cello Lãng Mạn (299 xu)' },
  { id: 'firework_indep', name: 'Pháo Hoa Độc Lập', icon: '🎆', coins: 299, label: '🎆 Pháo Hoa Độc Lập (299 xu)' },
  { id: 'chopin_rain', name: 'Chopin Trong Mưa', icon: '🌂', coins: 349, label: '🌂 Chopin Trong Mưa (349 xu)' },
  { id: 'lead_singer_bear', name: 'Gấu Hát Chính', icon: '🐻', coins: 399, label: '🐻 Gấu Hát Chính (399 xu)' },
  { id: 'sage_pea', name: 'Sage Hạt Đậu Thần Kỳ', icon: '🫐', coins: 399, label: '🫐 Sage Hạt Đậu Thần Kỳ (399 xu)' },
  { id: 'pop_parrot', name: 'Vẹt Ca Sĩ Pop', icon: '🦜', coins: 400, label: '🦜 Vẹt Ca Sĩ Pop (400 xu)' },
  { id: 'cat_trumpet', name: 'Kèn Trumpet Mèo', icon: '🎺', coins: 449, label: '🎺 Kèn Trumpet Mèo (449 xu)' },

  // 3. Sử thi (500 - 2,999 xu)
  { id: 'sportscar', name: 'Siêu Xe Thể Thao', icon: '⚡', coins: 500, label: '⚡ Siêu Xe Thể Thao (500 xu)' },
  { id: 'alluring_sax', name: 'Tiếng Sax Quyến Rũ', icon: '🎷', coins: 700, label: '🎷 Tiếng Sax Quyến Rũ (700 xu)' },
  { id: 'dong_son_drum', name: 'Trống Đồng Đông Sơn', icon: '🏛️', coins: 999, label: '🏛️ Trống Đồng Đông Sơn (999 xu)' },
  { id: 'crystal_rose', name: 'Hoa Hồng Pha Lê', icon: '💎', coins: 1000, label: '💎 Hoa Hồng Pha Lê (1000 xu)' },
  { id: 'colorful_ribbon', name: 'Ruy Băng Khoe Sắc', icon: '✨', coins: 1000, label: '✨ Ruy Băng Khoe Sắc (1000 xu)' },
  { id: 'crystal_shoe', name: 'Giày Thủy Tinh', icon: '👠', coins: 1500, label: '👠 Giày Thủy Tinh (1500 xu)' },
  { id: 'racetrack_launch', name: 'Ra Mắt Đường Đua', icon: '🏎️', coins: 1500, label: '🏎️ Ra Mắt Đường Đua (1500 xu)' },
  { id: 'healing_hug', name: 'Cái Ôm Chữa Lành', icon: '🫂', coins: 1600, label: '🫂 Cái Ôm Chữa Lành (1600 xu)' },
  { id: 'truong_sa_landmark', name: 'Cột Mốc Trường Sa', icon: '⚓', coins: 1999, label: '⚓ Cột Mốc Trường Sa (1999 xu)' },
  { id: 'tanuki_nut', name: 'Hạt Dẻ Tanuki', icon: '🌰', coins: 1999, label: '🌰 Hạt Dẻ Tanuki (1999 xu)' },
  { id: 'rocky_punch', name: 'Cú Đấm Của Rocky', icon: '🥊', coins: 1999, label: '🥊 Cú Đấm Của Rocky (1999 xu)' },
  { id: 'interplanetary', name: 'Thám Hiểm Liên Hành Tinh', icon: '🧑‍🚀', coins: 1999, label: '🧑‍🚀 Thám Hiểm Liên Hành Tinh (1999 xu)' },
  { id: 'heart_land', name: 'Vùng Đất Trái Tim', icon: '🏝️', coins: 2199, label: '🏝️ Vùng Đất Trái Tim (2199 xu)' },
  { id: 'sage_xubot', name: 'XuBot Của Sage', icon: '🪙', coins: 2199, label: '🪙 XuBot Của Sage (2199 xu)' },
  { id: 'honor_star', name: 'Ngôi Sao Danh Dự', icon: '⭐', coins: 2200, label: '⭐ Ngôi Sao Danh Dự (2200 xu)' },
  { id: 'motorcycle', name: 'Xe Máy Siêu Phân Khối', icon: '🏍️', coins: 2988, label: '🏍️ Xe Máy Siêu Phân Khối (2988 xu)' },
  { id: 'icecream_truck', name: 'Xe Tải Bán Kem', icon: '🚚', coins: 2988, label: '🚚 Xe Tải Bán Kem (2988 xu)' },
  { id: 'rhythm_bear', name: 'Gấu Nhịp Điệu', icon: '🧸', coins: 2999, label: '🧸 Gấu Nhịp Điệu (2999 xu)' },
  { id: 'contest_fan', name: 'Tín Đồ Thi Đấu', icon: '🏆', coins: 2999, label: '🏆 Tín Đồ Thi Đấu (2999 xu)' },
  { id: 'party_bus', name: 'Xe Buýt Tiệc Tùng', icon: '🚌', coins: 2999, label: '🚌 Xe Buýt Tiệc Tùng (2999 xu)' },

  // 4. Huyền thoại (3,000 - 15,999 xu)
  { id: 'hiphop_chicken', name: 'Chú Gà Hip-Hop', icon: '🐔', coins: 3200, label: '🐔 Chú Gà Hip-Hop (3200 xu)' },
  { id: 'private_jet', name: 'Chuyên Cơ Hoàng Gia', icon: '✈️', coins: 4888, label: '✈️ Chuyên Cơ Hoàng Gia (4888 xu)' },
  { id: 'hero_spaceship', name: 'Tàu Không Gian Anh Hùng', icon: '🛸', coins: 4999, label: '🛸 Tàu Không Gian Anh Hùng (4999 xu)' },
  { id: 'golden_dragon', name: 'Rồng Vàng Thăng Long', icon: '🐉', coins: 5000, label: '🐉 Rồng Vàng Thăng Long (5000 xu)' },
  { id: 'star_heroes_stage', name: 'Sân Khấu Star Heroes', icon: '🎪', coins: 5999, label: '🎪 Sân Khấu Star Heroes (5999 xu)' },
  { id: 'finish_line', name: 'Vững Vàng Về Đích', icon: '🏁', coins: 6000, label: '🏁 Vững Vàng Về Đích (6000 xu)' },
  { id: 'rust_reborn', name: 'Rust Tái Sinh', icon: '🤖', coins: 6000, label: '🤖 Rust Tái Sinh (6000 xu)' },
  { id: 'work_hard_play_hard', name: 'Làm Hết Sức Chơi Hết Mình', icon: '🎉', coins: 6000, label: '🎉 Làm Hết Sức Chơi Hết Mình (6000 xu)' },
  { id: 'lili_leopard', name: 'Báo Đốm Lili', icon: '🐆', coins: 6599, label: '🐆 Báo Đốm Lili (6599 xu)' },
  { id: 'yacht', name: 'Du Thuyền Hạng Sang / Yacht', icon: '🛥️', coins: 9888, label: '🛥️ Du Thuyền Hạng Sang (9888 xu)' },
  { id: 'rust_vs_world', name: 'Rust vs Thế Giới', icon: '⚔️', coins: 9999, label: '⚔️ Rust vs Thế Giới (9999 xu)' },
  { id: 'sunset_racetrack', name: 'Đường Đua Hoàng Hôn', icon: '🏎️', coins: 10000, label: '🏎️ Đường Đua Hoàng Hôn (10000 xu)' },
  { id: 'superstar', name: 'Siêu Sao', icon: '🌟', coins: 12000, label: '🌟 Siêu Sao (12000 xu)' },
  { id: 'meteor_shower', name: 'Mưa Sao Băng Kìa!', icon: '🌠', coins: 15000, label: '🌠 Mưa Sao Băng Kìa! (15000 xu)' },
  { id: 'space_party', name: 'Tiệc Tùng Không Gian', icon: '👾', coins: 15000, label: '👾 Tiệc Tùng Không Gian (15000 xu)' },
  { id: 'rosary_nebula', name: 'Tinh Vân Mân Khôi', icon: '🌌', coins: 15000, label: '🌌 Tinh Vân Mân Khôi (15000 xu)' },
  { id: 'future_journey', name: 'Hành Trình Tương Lai', icon: '🚀', coins: 15000, label: '🚀 Hành Trình Tương Lai (15000 xu)' },
  { id: 'stadium', name: 'Sân Vận Động', icon: '🏟️', coins: 15999, label: '🏟️ Sân Vận Động (15999 xu)' },

  // 5. Thần thoại & Tuyệt phẩm (17,000 - 44,999 xu)
  { id: 'amusement_park', name: 'Công Viên Giải Trí', icon: '🎡', coins: 17000, label: '🎡 Công Viên Giải Trí (17000 xu)' },
  { id: 'tiktok_shuttle', name: 'Tàu Con Thoi TikTok', icon: '🚀', coins: 20000, label: '🚀 Tàu Con Thoi TikTok (20000 xu)' },
  { id: 'glory_target', name: 'Mục Tiêu Vinh Quang', icon: '🏆', coins: 21500, label: '🏆 Mục Tiêu Vinh Quang (21500 xu)' },
  { id: 'phoenix', name: 'Phoenix Phượng Hoàng', icon: '🦅', coins: 25999, label: '🦅 Phoenix Phượng Hoàng (25999 xu)' },
  { id: 'adam_dream', name: 'Giấc Mơ Của Adam', icon: '💫', coins: 25999, label: '💫 Giấc Mơ Của Adam (25999 xu)' },
  { id: 'dragon_flame', name: 'Ngọn Lửa Rồng Thiêng', icon: '🐲', coins: 26999, label: '🐲 Ngọn Lửa Rồng Thiêng (26999 xu)' },
  { id: 'lion_king', name: 'Sư Tử', icon: '🦁', coins: 29999, label: '🦁 Sư Tử (29999 xu)' },
  { id: 'leon_lion', name: 'Leon và Sư Tử', icon: '👑🦁', coins: 34000, label: '👑🦁 Leon và Sư Tử (34000 xu)' },
  { id: 'tiktok_stars', name: 'TikTok Stars', icon: '✨💫', coins: 39999, label: '✨💫 TikTok Stars (39999 xu)' },
  { id: 'tiktok_universe', name: 'TikTok Universe', icon: '🪐🌌', coins: 44999, label: '🪐🌌 TikTok Universe (44999 xu)' }
];

const getDefaultEventConfigs = () => {
  const defaults = {};
  EVENTS.forEach(ev => {
    defaults[ev.id] = {
      priority: ev.id === 'apology' ? 20 : ev.id === 'comment' ? 50 : ev.id === 'follow' ? 70 : ev.id === 'gift' ? 90 : ev.id === 'welcome' ? 60 : ev.id === 'special_gift' ? 999 : ev.id === 'checkout' ? 100 : ev.id === 'share' ? 50 : ev.id === 'thanks_heart' ? 15 : 50,
      active: ev.id !== 'welcome' && ev.id !== 'share' && ev.id !== 'thanks_heart', 
      useVoice: ev.id !== 'gift' && ev.id !== 'welcome',
      muteSourceVideo: ev.id !== 'gift' && ev.id !== 'welcome',
      videoCategory: ev.id === 'welcome' ? 'join' : ev.id === 'call_to_action' ? 'interaction' : ev.id === 'thanks_heart' ? 'thank_for_likes' : ev.id,
      videoFolder: '',
      supportVideoFolder: '',
      useAi: ev.id !== 'gift',
      aiPrompt: '',
      sampleAnswers: '',
      assistantPrompt: '',
      assistantUseMainVoice: false,
      
      // Comment Mode & Response Format
      commentReplyMode: 'hybrid', // 'keywords_only' | 'ai_only' | 'hybrid'
      commentResponseFormat: 'both', // 'voice_only' | 'text_only' | 'both'

      greetMinutes: ev.id === 'apology' || ev.id === 'welcome' ? 1 : '',
      waitBetweenEvents: ev.id === 'comment' ? 1 : ev.id === 'follow' ? 60 : ev.id === 'gift' ? 0 : '',
      replyRate: ev.id === 'comment' ? 70 : '',
      bannedWords: ev.id === 'comment' ? 'scam\ngiả' : '',
      priorityWords: ev.id === 'comment' ? 'mua\nbán' : '',
      smartSpamFilter: ev.id === 'comment' ? true : false,
      waitBetweenSpam: ev.id === 'comment' ? 3 : '',
      maxRepeatChars: ev.id === 'comment' ? 0.7 : '',
      keywordRules: ev.id === 'comment' ? [] : undefined,
      prompts: ev.id === 'comment' ? [] : undefined,
      speakAfterIdleSeconds: ev.id === 'idle' ? 5 : '',
      likeThreshold: ev.id === 'thanks_heart' ? 10 : '',
      
      // Special gifts slots (unlimited customizable slots)
      specialGiftSlots: ev.id === 'special_gift' ? [
        { id: 1, active: true, giftName: '🇻🇳 Cờ Tổ Quốc (1 xu)', videoFolder: '', supportVideoFolder: '', useTTS: false, muteSourceVideo: false, useAssistant: true, assistantPrompt: '', assistantVideoFolder: '', useMainVoice: true },
        { id: 2, active: true, giftName: '👑 Vương Miện (99 xu)', videoFolder: '', supportVideoFolder: '', useTTS: false, muteSourceVideo: false, useAssistant: false, assistantPrompt: '', assistantVideoFolder: '', useMainVoice: true },
        { id: 3, active: true, giftName: '🦁 Leon & Sư Tử (34000 xu)', videoFolder: '', supportVideoFolder: '', useTTS: false, muteSourceVideo: false, useAssistant: true, assistantPrompt: '', assistantVideoFolder: '', useMainVoice: true },
        { id: 4, active: true, giftName: '🪐 TikTok Universe (44999 xu)', videoFolder: '', supportVideoFolder: '', useTTS: false, muteSourceVideo: false, useAssistant: true, assistantPrompt: '', assistantVideoFolder: '', useMainVoice: true }
      ] : [],

      // Regular gifts multi-slots (unlimited customizable slots)
      giftSlots: ev.id === 'gift' ? [
        { 
          id: 1, 
          active: true, 
          name: 'Slot 1: Quà Tặng Chung (Mặc định)', 
          videoFolder: '', 
          supportVideoFolder: '', 
          useAi: true, 
          useTTS: false, 
          useVoice: true, 
          muteSourceVideo: false, 
          aiPrompt: 'Bạn là streamer AI. Hãy viết lời cảm ơn sáng tạo tới {user} vì đã tặng 1 {gift_name}.',
          sampleAnswers: 'Ôi em cảm ơn bạn {user} đã gửi tặng {gift_name} x{count} cho em nha!\nCảm ơn món quà vô cùng ngọt ngào của bạn {user}!',
          useAssistant: false, 
          assistantPrompt: '', 
          assistantVideoFolder: '', 
          useMainVoice: true 
        },
        { 
          id: 2, 
          active: true, 
          name: 'Slot 2: Quà Xu Nhỏ (1 - 10 xu)', 
          videoFolder: '', 
          supportVideoFolder: '', 
          useAi: false, 
          useTTS: false, 
          useVoice: true, 
          muteSourceVideo: false, 
          aiPrompt: '',
          sampleAnswers: 'Cảm ơn bạn {user} đã tặng {gift_name} nha!\nThả tim và tặng quà yêu thương cho {user} nè!',
          useAssistant: false, 
          assistantPrompt: '', 
          assistantVideoFolder: '', 
          useMainVoice: true 
        }
      ] : [],

      // Checkout Products
      checkoutProducts: ev.id === 'checkout' ? [
        { id: 1, active: true, productName: 'AVA LIVE', keywords: 'ava live;phần mềm;giá;liên hệ;tư vấn;mua;dùng thử;gói;bản quyền', videoFolder: 'bình luận', supportVideoFolder: '', useAi: true, useTTS: false, ttsVoiceRole: 'idol', muteSourceVideo: true, aiPrompt: NEW_AI_PROMPT },
        { id: 2, active: false, productName: '', keywords: '', videoFolder: '', supportVideoFolder: '', useAi: false, useTTS: false, ttsVoiceRole: 'idol', muteSourceVideo: false, aiPrompt: '' },
        { id: 3, active: false, productName: '', keywords: '', videoFolder: '', supportVideoFolder: '', useAi: false, useTTS: false, ttsVoiceRole: 'idol', muteSourceVideo: false, aiPrompt: '' }
      ] : []
    };
  });
  
  defaults['apology'].sampleAnswers = "Cả nhà ơi, đôi khi bình luận và người tham gia mới đông quá em không chào hết được, có bỏ sót ai thì mọi người thông cảm cho em nhé. Yêu mọi người nhiều!\nMọi người thông cảm nha, nếu em có lỡ bỏ qua bình luận của ai thì nhắn lại giúp em với nhé, do nhiều tin nhắn quá em không xem kịp ạ.";
  defaults['comment'].aiPrompt = "### NHIỆM VỤ: Trả lời bình luận của người dùng tên {user} ngắn gọn, thông minh, lịch sự và thu hút.";
  defaults['comment'].sampleAnswers = "Cảm ơn bạn {user} đã bình luận nhé!\nMình đã nhận được bình luận của {user} rồi ạ.";
  defaults['follow'].aiPrompt = "Hãy nói một câu cảm ơn bạn {user} đã theo dõi kênh.";
  defaults['follow'].sampleAnswers = "A, cảm ơn bạn {user} đã theo dõi mình. Yêu bạn!\nCảm ơn {user} đã follow kênh của mình nhé!";
  defaults['talking'].aiPrompt = "Bạn là một streamer AI, đang không có ai tương tác. Hãy chủ động nói một điều gì đó thật thú vị, đặt một câu hỏi mở, nói một cách hài hước...";
  defaults['talking'].sampleAnswers = "xin chào các bn\ncác bạn ơi nói chuyện đi";
  defaults['comment'].assistantPrompt = "A, có bạn {user} vừa mới bình luận là: {comment}";
  defaults['gift'].aiPrompt = "Bạn là streamer AI. Hãy viết lời cảm ơn sáng tạo tới {user} vì đã tặng 1 {gift_name}.";
  defaults['call_to_action'].sampleAnswers = "Mọi người ơi, đừng xem chùa nữa, hãy thả tim và bình luận để mình có thêm động lực nhé!\nCác bạn có câu hỏi nào cho mình không ạ? Đừng ngại hỏi nha!\nNếu thấy buổi live thú vị, mọi người hãy giúp mình một lượt chia sẻ nhé. Yêu mọi người!";
  defaults['welcome'].sampleAnswers = "Chào mừng bạn {user} và {count} người mới đã đến với livestream!\nXin chào {user} và mọi người mới vào xem nhé! Chúc mọi người xem live vui vẻ.\nHelu {user}! Cảm ơn {count} bạn mới đã ghé thăm kênh của mình nha.";
  defaults['share'].aiPrompt = "Hãy cảm ơn người dùng tên {user} vì đã chia sẻ livestream.";
  defaults['share'].sampleAnswers = "Cảm ơn bạn {user} đã chia sẻ live giúp mình nhé!\nMình cảm ơn bạn {user} rất nhiều!";
  defaults['thanks_heart'].sampleAnswers = "Cảm ơn mọi người đã giúp mình đạt mốc {milestone} tim!\nWow, chúng ta đã đạt {milestone} tim rồi! Yêu các bạn nhiều!";

  return defaults;
};

export default function WorkspaceTacVu() {
  const [selectedEventId, setSelectedEventId] = useState('checkout');
  
  // Khởi tạo và nạp bền vững vĩnh viễn dữ liệu người dùng đã cài đặt
  const [eventConfigs, setEventConfigs] = useState(() => {
    const defaults = getDefaultEventConfigs();
    try {
      const saved = localStorage.getItem('aidol_event_configs') || localStorage.getItem('aidol_event_configs_backup');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          const merged = { ...defaults };
          Object.keys(defaults).forEach(key => {
            if (parsed[key]) {
              merged[key] = {
                ...defaults[key],
                ...parsed[key],
                // Giữ nguyên các slot quà tặng đặc biệt
                specialGiftSlots: (Array.isArray(parsed[key]?.specialGiftSlots) && parsed[key].specialGiftSlots.length > 0)
                  ? parsed[key].specialGiftSlots
                  : defaults[key].specialGiftSlots,
                // Giữ nguyên các slot quà tặng thường
                giftSlots: (Array.isArray(parsed[key]?.giftSlots) && parsed[key].giftSlots.length > 0)
                  ? parsed[key].giftSlots
                  : (defaults[key].giftSlots || []),
                checkoutProducts: (Array.isArray(parsed[key]?.checkoutProducts) && parsed[key].checkoutProducts.length > 0)
                  ? parsed[key].checkoutProducts.map(p => {
                      if (p.id === 1) {
                        return {
                          ...p,
                          productName: (!p.productName || p.productName === 'aidol') ? 'AVA LIVE' : p.productName,
                          keywords: (!p.keywords || p.keywords === 'aidol;phần mềm;giá;liên hệ') ? 'ava live;phần mềm;giá;liên hệ;tư vấn;mua;dùng thử;gói;bản quyền' : p.keywords,
                          aiPrompt: (!p.aiPrompt || p.aiPrompt.length < 5000 || p.aiPrompt.includes('\\[BẢN SẮC') || p.aiPrompt.includes('TRong vai là một nhân viên sale') || p.aiPrompt.includes('Bạn đang đóng vai NGỌC NHI')) ? NEW_AI_PROMPT : p.aiPrompt
                        };
                      }
                      return p;
                    })
                  : defaults[key].checkoutProducts,
              };
            }
          });
          return merged;
        }
      }
    } catch (e) {
      console.warn("Lỗi load cấu hình sự kiện đã lưu:", e);
    }
    return defaults;
  });

  const currentConfig = eventConfigs[selectedEventId] || {};

  const handleSave = () => {
    try {
      const json = JSON.stringify(eventConfigs);
      localStorage.setItem('aidol_event_configs', json);
      localStorage.setItem('aidol_event_configs_backup', json);
      alert('✅ Đã bảo lưu toàn bộ cấu hình sự kiện & kịch bản thành công vĩnh viễn!');
    } catch (e) {
      alert('Lỗi lưu cấu hình: ' + e.message);
    }
  };

  const handleExportEvents = () => {
    try {
      const blob = new Blob([JSON.stringify(eventConfigs, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `AvaLive_CauHinh_SuKien_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert('Lỗi xuất file: ' + e.message);
    }
  };

  const handleImportEvents = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result);
        if (imported && typeof imported === 'object') {
          setEventConfigs(imported);
          localStorage.setItem('aidol_event_configs', JSON.stringify(imported));
          localStorage.setItem('aidol_event_configs_backup', JSON.stringify(imported));
          alert('✅ Đã nạp thành công toàn bộ cấu hình sự kiện mới!');
        }
      } catch (err) {
        alert('File không hợp lệ: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const updateEventConfig = (id, partial) => {
    setEventConfigs(prev => ({
      ...prev,
      [id]: { ...prev[id], ...partial }
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    updateEventConfig(selectedEventId, { [name]: type === 'checkbox' ? checked : value });
  };

  // ==================== SPECIAL GIFT SLOTS HANDLERS ====================
  const handleSlotChange = (slotId, name, value, isCheckbox = false) => {
    setEventConfigs(prev => {
      const slots = prev.special_gift?.specialGiftSlots || [];
      const newSlots = slots.map(slot => {
        if (slot.id === slotId) {
          return { ...slot, [name]: isCheckbox ? value : value };
        }
        return slot;
      });
      return {
        ...prev,
        special_gift: {
          ...prev.special_gift,
          specialGiftSlots: newSlots
        }
      };
    });
  };

  const handleAddSpecialGiftSlot = () => {
    setEventConfigs(prev => {
      const currentSlots = prev.special_gift?.specialGiftSlots || [];
      const nextId = currentSlots.length > 0 ? Math.max(...currentSlots.map(s => s.id)) + 1 : 1;
      const newSlot = {
        id: nextId,
        active: true,
        giftName: GIFT_OPTIONS[0]?.label || '🇻🇳 Cờ Tổ Quốc (1 xu)',
        videoFolder: '',
        supportVideoFolder: '',
        useTTS: false,
        muteSourceVideo: false,
        useAssistant: false,
        assistantPrompt: '',
        assistantVideoFolder: '',
        useMainVoice: true
      };
      return {
        ...prev,
        special_gift: {
          ...prev.special_gift,
          specialGiftSlots: [...currentSlots, newSlot]
        }
      };
    });
  };

  const handleDeleteSpecialGiftSlot = (slotId) => {
    if (!window.confirm(`Anh có chắc muốn xóa Slot ${slotId} này không?`)) return;
    setEventConfigs(prev => {
      const currentSlots = prev.special_gift?.specialGiftSlots || [];
      return {
        ...prev,
        special_gift: {
          ...prev.special_gift,
          specialGiftSlots: currentSlots.filter(s => s.id !== slotId)
        }
      };
    });
  };

  const selectSlotFolder = async (slotId, fieldName) => {
    try {
      if (window.showDirectoryPicker) {
        const dirHandle = await window.showDirectoryPicker();
        handleSlotChange(slotId, fieldName, dirHandle.name);
      } else {
        const folderPath = prompt("Hãy nhập đường dẫn thư mục cho Slot này:", "C:/Videos/");
        if (folderPath) {
          handleSlotChange(slotId, fieldName, folderPath);
        }
      }
    } catch (e) {
      console.log('Folder selection cancelled');
    }
  };

  // ==================== REGULAR GIFT SLOTS HANDLERS ====================
  const handleGiftSlotChange = (slotId, name, value, isCheckbox = false) => {
    setEventConfigs(prev => {
      const slots = prev.gift?.giftSlots || [];
      const newSlots = slots.map(slot => {
        if (slot.id === slotId) {
          return { ...slot, [name]: isCheckbox ? value : value };
        }
        return slot;
      });
      return {
        ...prev,
        gift: {
          ...prev.gift,
          giftSlots: newSlots
        }
      };
    });
  };

  const handleAddGiftSlot = () => {
    setEventConfigs(prev => {
      const currentSlots = prev.gift?.giftSlots || [];
      const nextId = currentSlots.length > 0 ? Math.max(...currentSlots.map(s => s.id)) + 1 : 1;
      const newSlot = {
        id: nextId,
        active: true,
        name: `Slot ${nextId}: Quà Thường Tùy Biến`,
        videoFolder: '',
        supportVideoFolder: '',
        useAi: true,
        useTTS: false,
        useVoice: true,
        muteSourceVideo: false,
        aiPrompt: 'Bạn là streamer AI. Hãy cảm ơn {user} vì đã tặng {gift_name}.',
        sampleAnswers: 'Cảm ơn bạn {user} đã gửi tặng {gift_name} x{count} nhé!\nCảm ơn món quà siêu ngọt ngào của {user}!',
        useAssistant: false,
        assistantPrompt: '',
        assistantVideoFolder: '',
        useMainVoice: true
      };
      return {
        ...prev,
        gift: {
          ...prev.gift,
          giftSlots: [...currentSlots, newSlot]
        }
      };
    });
  };

  const handleDeleteGiftSlot = (slotId) => {
    if (!window.confirm(`Anh có chắc muốn xóa Slot Quà Thường ${slotId} này không?`)) return;
    setEventConfigs(prev => {
      const currentSlots = prev.gift?.giftSlots || [];
      return {
        ...prev,
        gift: {
          ...prev.gift,
          giftSlots: currentSlots.filter(s => s.id !== slotId)
        }
      };
    });
  };

  const selectGiftSlotFolder = async (slotId, fieldName) => {
    try {
      if (window.showDirectoryPicker) {
        const dirHandle = await window.showDirectoryPicker();
        handleGiftSlotChange(slotId, fieldName, dirHandle.name);
      } else {
        const folderPath = prompt("Hãy nhập đường dẫn thư mục cho Slot Quà Thường này:", "C:/Videos/");
        if (folderPath) {
          handleGiftSlotChange(slotId, fieldName, folderPath);
        }
      }
    } catch (e) {
      console.log('Folder selection cancelled');
    }
  };

  // ==================== CHECKOUT PRODUCTS HANDLERS ====================
  const handleProductChange = (productId, name, value, isCheckbox = false) => {
    setEventConfigs(prev => {
      const newProducts = prev[selectedEventId].checkoutProducts.map(prod => {
        if (prod.id === productId) {
          return { ...prod, [name]: isCheckbox ? value : value };
        }
        return prod;
      });
      return {
        ...prev,
        [selectedEventId]: {
          ...prev[selectedEventId],
          checkoutProducts: newProducts
        }
      };
    });
  };

  const handleAddProduct = () => {
    setEventConfigs(prev => {
      const currentProducts = prev[selectedEventId].checkoutProducts || [];
      const nextId = currentProducts.length > 0 ? Math.max(...currentProducts.map(p => p.id)) + 1 : 1;
      const newProduct = { 
        id: nextId, 
        active: true, 
        productName: `Sản phẩm mới ${nextId}`, 
        keywords: '', 
        videoFolder: '', 
        supportVideoFolder: '', 
        useAi: true, 
        useTTS: true, 
        ttsVoiceRole: 'idol', 
        muteSourceVideo: true, 
        aiPrompt: '' 
      };
      return {
        ...prev,
        [selectedEventId]: {
          ...prev[selectedEventId],
          checkoutProducts: [...currentProducts, newProduct]
        }
      };
    });
  };

  const handleDeleteProduct = (productId) => {
    setEventConfigs(prev => {
      const currentProducts = prev[selectedEventId].checkoutProducts || [];
      return {
        ...prev,
        [selectedEventId]: {
          ...prev[selectedEventId],
          checkoutProducts: currentProducts.filter(p => p.id !== productId)
        }
      };
    });
  };

  const selectFolder = async (fieldName = 'videoFolder') => {
    try {
      if (window.showDirectoryPicker) {
        const dirHandle = await window.showDirectoryPicker();
        handleChange({ target: { name: fieldName, value: dirHandle.name } });
      } else {
        const folderPath = prompt("Hãy nhập đường dẫn thư mục (Dữ liệu này sẽ được lưu để sử dụng với video tương ứng):", "C:/Videos/");
        if (folderPath) {
          handleChange({ target: { name: fieldName, value: folderPath } });
        }
      }
    } catch (e) {
      console.log('Folder selection cancelled');
    }
  };

  const handleLoadPromptFile = (productId, event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      handleProductChange(productId, 'aiPrompt', content);
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const COSMETICS_MASTER_SCRIPT = `Chào mừng tất cả các tình yêu đã có mặt trong phiên livestream làm đẹp đặc biệt ngày hôm nay của shop em nha!
Các chị đẹp ơi, ai đang lướt qua phiên live thì cho em xin một nút thả tim và một lượt chia sẻ để nhận quà mở bát đầu live nào!
Hôm nay shop em mang đến cho cả nhà một siêu phẩm chăm sóc sắc đẹp và nâng tầm khí chất cực kỳ đỉnh cao luôn ạ!
Đó chính là Bộ Đôi Tinh Chất Serum Tế Bào Gốc Phục Hồi Da Trẻ Hóa và Nước Hoa Pháp Cao Cấp lưu hương suốt 12 giờ đồng hồ!
Chị nào mà da đang bị khô ráp, thâm sạm, không đều màu hoặc bắt đầu xuất hiện nếp nhăn lão hóa thì nhất định không được bỏ qua live này nhé!
Chỉ sau đúng 7 ngày sử dụng, làn da của các chị sẽ căng bóng, mịn màng và mướt như da em bé luôn ạ!
Còn chai nước hoa Pháp với nốt hương đầu ngọt ngào quyến rũ, nốt hương giữa sang trọng và nốt hương cuối ấm áp sẽ giúp các chị tự tin tỏa sáng mọi lúc mọi nơi!
Bình thường giá niêm yết của bộ đôi này tại showroom chính hãng là 1.850.000 VNĐ một set!
Nhưng duy nhất trong phiên livestream ngày hôm nay, em xin phép chơi lớn tri ân cho 20 chị nhanh tay nhất với mức giá giảm sốc 50% chỉ còn 890.000 VNĐ thôi ạ!
Chưa hết đâu cả nhà ơi, chị nào chốt đơn ngay bây giờ còn được tặng kèm thêm 1 tuýp kem dưỡng ẩm trắng da mini và miễn phí giao hàng tận nhà trên toàn quốc!
Bên em cam kết 100% hàng chính hãng có đầy đủ tem chống hàng giả của Bộ Công An và mã QR quét kiểm tra xuất xứ nguồn gốc rõ ràng!
Chính sách bảo hành vàng bên em là 1 đổi 1 trong vòng 30 ngày nếu có bất kỳ lỗi nào, hoặc hoàn tiền 200% nếu phát hiện hàng không chuẩn nhé các chị yêu!
Số lượng ưu đãi Flash Sale này em chỉ có đúng 20 suất được trợ giá từ nhãn hàng thôi ạ!
Hiện tại hệ thống đã ghi nhận 10 chị bấm vào giỏ hàng rồi, chỉ còn đúng 10 suất cuối cùng thôi cả nhà ơi!
Các chị hãy nhìn ngay xuống góc trái màn hình, nhấp vào biểu tượng Giỏ Hàng, chọn mã số 01 và bấm Đặt Hàng ngay để kịp giữ voucher giảm giá 50% nhé!
Chị em nào có câu hỏi về loại da dầu, da khô, da nhạy cảm hay cách sử dụng nước hoa thì cứ để lại bình luận, em sẽ tư vấn chi tiết từng người ngay trên live này luôn ạ!
Nhanh tay lên các chị ơi, đồng hồ đếm ngược Flash Sale chỉ còn 3 phút nữa là kết thúc, em xin chúc mừng các chị đã săn được deal hời ngày hôm nay nha!`;

  const FASHION_MASTER_SCRIPT = `Dạ em chào toàn thể các tình yêu đã ghé thăm phiên livestream thời trang thiết kế cao cấp của shop em ngày hôm nay ạ!
Các nàng ơi, hãy nhanh tay thả tim nhiệt tình lên màn hình giúp em để mở khóa voucher giảm giá sốc 50% cho bộ sưu tập mới nhất nhé!
Hôm nay em lên cho các nàng siêu phẩm đầm thiết kế tiểu thư thanh lịch kết hợp cùng túi xách da cao cấp đang làm mưa làm gió thị trường!
Chất liệu vải lụa tơ tằm nhập khẩu cực kỳ mềm mịn, thoáng mát, đường may chuẩn chỉ từng milimet giúp tôn dáng và che khuyết điểm vòng 2 hoàn hảo luôn ạ!
Bình thường set này bán tại store là 1.200.000đ, nhưng duy nhất trên live hôm nay em giảm chạm đáy chỉ còn 599.000đ thôi nha!
Đặc biệt tặng ngay 1 chiếc thắt lưng da thời thượng và freeship toàn quốc cho 15 nàng đầu tiên bấm vào giỏ hàng!
Bên em cam kết nhận hàng được kiểm tra, mặc thử thoải mái trước khi thanh toán, hỗ trợ đổi size tận nhà trong 7 ngày nếu không vừa vặn ạ!
Nhanh tay bấm vào Giỏ Hàng góc trái màn hình để sở hữu ngay nhé các nàng ơi, số lượng size S và M đang sắp hết rồi ạ!`;

  const TECH_AI_MASTER_SCRIPT = `Chào mừng tất cả các anh chị em doanh chủ, nhà sáng tạo nội dung đang có mặt trong buổi chia sẻ giải pháp Livestream AI hôm nay!
Anh chị nào muốn tăng doanh thu bán hàng tự động 24/7 mà không tốn chi phí thuê idol hàng chục triệu mỗi tháng thì hãy nán lại xem hết phiên live này nhé!
Hôm nay Thiên Vua App giới thiệu giải pháp Phần Mềm AvaLive VIP PRO - Công nghệ Livestream Idol AI siêu thực tế thế hệ mới nhất!
Phần mềm tích hợp bộ não AI đa ngôn ngữ, tự động đồng bộ khẩu hình miệng 60 FPS, tự động trả lời bình luận và chốt đơn thông minh theo thời gian thực!
Bình thường bản quyền 1 năm là 3.500.000đ, duy nhất trong phiên live hôm nay giảm 50% chỉ còn 1.750.000đ trọn gói!
Đặc biệt tặng kèm 100,000 Tokens AI + Khóa đào tạo kỹ thuật xây dựng hệ thống Livestream tự động từ A đến Z!
Bên em hỗ trợ cài đặt từ xa qua Ultraview/AnyDesk 24/7 và cam kết bảo hành nâng cấp tính năng trọn đời!
Anh chị hãy nhấp ngay vào link hoặc giỏ hàng bên dưới để đăng ký nhận bản quyền chính thức nhé!`;

  const handleLoadUniversalScriptFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const parsed = await readUniversalFile(file);
      const text = Array.isArray(parsed) ? parsed.join('\n') : (typeof parsed === 'string' ? parsed : JSON.stringify(parsed));
      if (text) {
        handleSimpleChange('fixedScriptText', text);
      }
    } catch (err) {
      console.error('Error reading script file:', err);
      alert('Không thể đọc file: ' + (err.message || 'Lỗi định dạng'));
    }
    event.target.value = '';
  };

  const handleLoadUniversalKnowledgeFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const parsed = await readUniversalFile(file);
      const text = Array.isArray(parsed) ? parsed.join('\n') : (typeof parsed === 'string' ? parsed : JSON.stringify(parsed));
      if (text) {
        handleSimpleChange('companyKnowledgeText', text);
        handleSimpleChange('companyKnowledgeFileName', file.name);
      }
    } catch (err) {
      console.error('Error reading knowledge file:', err);
      alert('Không thể đọc file tri thức: ' + (err.message || 'Lỗi định dạng'));
    }
    event.target.value = '';
  };

  const applyMasterScript = (type) => {
    if (type === 'cosmetics') {
      handleSimpleChange('fixedScriptText', COSMETICS_MASTER_SCRIPT);
    } else if (type === 'fashion') {
      handleSimpleChange('fixedScriptText', FASHION_MASTER_SCRIPT);
    } else if (type === 'tech') {
      handleSimpleChange('fixedScriptText', TECH_AI_MASTER_SCRIPT);
    }
  };

  const handleGenerateAiScript = () => {
    const company = currentConfig.companyName || 'Shop Mỹ Phẩm & Làm Đẹp Cao Cấp';
    const product = currentConfig.productName || 'Bộ Đôi Serum Tế Bào Gốc & Nước Hoa Pháp';
    const price = currentConfig.productPrice || '1.850.000đ - Flash Sale chỉ còn 890.000đ';
    const promo = currentConfig.promotions || 'Tặng kèm kem dưỡng mini + Freeship toàn quốc';
    const features = currentConfig.keyFeatures || 'Dưỡng da căng bóng mịn màng sau 7 ngày, nước hoa lưu hương 12 giờ';
    const warranty = currentConfig.warrantyPolicy || 'Bảo hành 1 đổi 1 trong 30 ngày, hoàn tiền 200% nếu hàng không chuẩn';
    const style = currentConfig.aiLiveStyle || 'sales_fast';
    
    let generated = '';
    if (style === 'skincare_expert') {
      generated = `Dạ em xin chào tất cả các chị em đang theo dõi phiên tư vấn chăm sóc da chuyên sâu hôm nay của ${company} ạ!\nCác chị có biết tại sao dù dưỡng kem đắt tiền nhưng da vẫn sạm và khô ráp không ạ? Đó là do lớp biểu bì thiếu ẩm và chưa được phục hồi từ gốc rễ tế bào!\nVà giải pháp vàng hôm nay em mang đến cho cả nhà chính là ${product}!\nSản phẩm với ưu điểm nổi bật: ${features.split('\n')[0] || features}!\nHôm nay ${company} trợ giá đặc biệt: ${price}, kèm quà tặng: ${promo}!\nBên em cam kết chính sách: ${warranty}!\nCác chị hãy bấm vào giỏ hàng góc trái màn hình, chọn mã 01 để làn da được tái sinh ngay hôm nay nhé!`;
    } else if (style === 'tiktok_funny') {
      generated = `Ú òa! Em chào 500 anh em đang lướt TikTok lọt ngay vào phiên live siêu cấp vũ trụ của ${company} nha!\nAi mà đi ngang không dừng lại thả tim là tí nữa tiếc hùi hụi luôn á, vì hôm nay có deal sốc chấn động địa cầu!\nEm lên ngay siêu phẩm ${product} đang làm mưa làm gió khắp cõi mạng!\nGiá bình thường tiền triệu, hôm nay trên live chỉ: ${price} thôi cả nhà ơi! Cứ bấm giỏ hàng là có quà: ${promo}!\nCam kết cực kỳ uy tín: ${warranty}!\nTay đâu tay đâu, nhấp liền vào giỏ hàng góc trái góc phải để săn deal nào cả nhà ơi!`;
    } else if (style === 'luxury_elegant') {
      generated = `Kính chào quý khách hàng thượng lưu đang hiện diện trong không gian livestream độc quyền của thương hiệu ${company}.\nĐẳng cấp và khí chất của người phụ nữ hiện đại luôn được tôn vinh qua diện mạo rạng ngời và mùi hương tinh tế.\nHôm nay, chúng tôi trân trọng giới thiệu kiệt tác ${product} - sự kết hợp hoàn hảo giữa công nghệ sinh học và nghệ thuật chế tác hương thơm đỉnh cao.\nƯu đãi độc quyền dành riêng cho khách hàng phiên live: ${price}, cùng bộ quà tặng thượng hạng: ${promo}.\nCam kết chất lượng chuẩn quốc tế: ${warranty}.\nKính mời quý khách chạm vào giỏ hàng góc trái màn hình để sở hữu ngay trải nghiệm làm đẹp đẳng cấp này.`;
    } else {
      generated = `Dạ em chào toàn thể các tình yêu đã có mặt trong phiên livestream săn deal cực khủng của ${company} hôm nay nha!\nCác chị em nhanh tay thả tim và chia sẻ live để em mở bát tung quà tặng siêu to khổng lồ nào!\nHôm nay em mang đến siêu phẩm vạn người mê: ${product}!\nTính năng và công dụng vượt trội: ${features.split('\n')[0] || features}!\nGiá niêm yết tiền triệu, hôm nay giảm 50% chỉ còn: ${price}! Đặc biệt: ${promo} cho 20 chị chốt nhanh nhất!\nChính sách cam kết vàng: ${warranty}!\nChỉ còn đúng 5 suất cuối cùng, các chị nhìn ngay xuống góc trái màn hình bấm vào Giỏ Hàng để chốt đơn ngay nhé!`;
    }
    
    handleSimpleChange('fixedScriptText', generated);
  };

  const selectedEventInfo = EVENTS.find(e => e.id === selectedEventId);

  const HELP_DATA = {
    priority: { title: '⭐ Độ ưu tiên', desc: 'Quyết định sự kiện nào được phát trước khi có nhiều sự kiện xảy ra cùng lúc.', tip: 'Số càng lớn ưu tiên càng cao (VD: Quà đặc biệt 999 > Chốt đơn 100 > Quà thường 90 > Comment 50 > Chờ 10).' },
    active: { title: '✅ Kích hoạt', desc: 'Bật hoặc tắt tính năng xử lý sự kiện này trong suốt phiên livestream.', tip: 'Bỏ chọn nếu bạn tạm thời không muốn Idol phản hồi sự kiện này.' },
    videoCategory: { title: '🎥 Danh mục Video', desc: 'Tên phân nhóm video dùng để ghép khớp với kịch bản hành động của Idol.', tip: 'Ví dụ: comment, gift, checkout, follow, idle...' },
    videoFolder: { title: '📁 Thư mục Video Cục bộ', desc: 'Đường dẫn thư mục chứa các file video (.mp4, .webm) thực tế trên máy của bạn.', tip: 'Bấm nút "Chọn..." để duyệt thư mục chứa clip động tác của Idol.' },
    useAi: { title: '🧠 Dùng AI Trả lời (Bộ não Gemini)', desc: 'Kích hoạt bộ não AI Gemini tự động phân tích ngữ cảnh và sáng tạo câu trả lời tức thì.', tip: 'Giúp câu nói của Idol tự nhiên, thông minh, không bị lặp lại nhàm chán.' },
    useVoice: { title: '🗣️ Dùng Giọng nói (TTS Voice)', desc: 'Bật chuyển văn bản câu trả lời thành giọng đọc AI tự nhiên (ElevenLabs).', tip: 'Nếu tắt, Idol sẽ chỉ diễn video mà không phát âm thanh giọng nói.' },
    useTTS: { title: '🗣️ Dùng TTS (Giọng đọc AI)', desc: 'Tự động phát âm thanh lời thoại được tạo ra bằng giọng nói trí tuệ nhân tạo.', tip: 'Nên bật để người xem nghe rõ tên của họ và thông điệp cá nhân hóa.' },
    muteSourceVideo: { title: '🔇 Tắt âm gốc Video', desc: 'Tự động tắt tiếng sẵn có trong file clip để không bị đè lên giọng đọc AI.', tip: 'Khuyên dùng BẬT để giọng nói của Idol và Trợ lý nghe trong trẻo, rõ nét nhất.' },
    aiPrompt: { title: '✍️ Kịch bản cho AI (System Prompt)', desc: 'Lời chỉ dẫn đóng vai cho AI (tính cách, vai trò, quy tắc trả lời, thông tin sản phẩm).', tip: 'Dùng cú pháp {user}, {comment}, {gift_name} để AI tự điền tên người xem thời gian thực.' },
    sampleAnswers: { title: '📄 Câu trả lời mẫu (Dự phòng)', desc: 'Danh sách các câu thoại soạn sẵn (mỗi câu 1 dòng), hệ thống sẽ chọn ngẫu nhiên khi không dùng AI.', tip: 'Hữu ích khi muốn câu thoại chuẩn chỉnh 100% theo kịch bản có sẵn.' },
    waitBetweenEvents: { title: '⏳ Thời gian chờ giữa các lần (Cooldown)', desc: 'Khoảng thời gian nghỉ (giây) giữa 2 lần kích hoạt sự kiện liên tiếp.', tip: 'Tránh việc Idol nói liên tục dồn dập khi lượng tương tác vào quá đông.' },
    productName: { title: '🏷️ Tên Sản Phẩm', desc: 'Tên định danh của mặt hàng cần tư vấn / bán trong phiên live.', tip: 'Ví dụ: Khóa học, Son môi, Áo thun, Phần mềm AvaLive...' },
    keywords: { title: '🔑 Từ khóa Chốt Đơn', desc: 'Danh sách từ người xem hay gõ khi muốn mua hàng (cách nhau bởi dấu chấm phẩy ;).', tip: 'Ví dụ: mua;giá;tư vấn;bao nhiêu;inbox;chốt đơn;order. Khi comment có từ này, AI sẽ ưu tiên bán sản phẩm này.' },
    giftName: { title: '🎁 Tên Quà Tặng', desc: 'Loại quà tặng đặc biệt trên nền tảng (TikTok/Facebook) cần gán phản ứng độc quyền.', tip: 'Ví dụ: Lion (Sư tử), Yacht (Du thuyền), Finger Heart, Lucky pig...' },
    useAssistant: { title: '👥 Cấu hình Trợ Lý Riêng', desc: 'Bật nhân vật phụ / trợ lý ảo lên tiếng tung hứng, cảm ơn phụ họa cùng Idol chính.', tip: 'Tăng không khí sôi động và chuyên nghiệp như các phiên livestream lớn.' },
    assistantPrompt: { title: '💬 Câu mẫu của Trợ Lý', desc: 'Lời thoại của trợ lý ảo khi sự kiện xảy ra (VD: "Cảm ơn đại gia {user} đã ủng hộ!").', tip: 'Có thể dùng thẻ {user} để gọi tên người xem.' },
    assistantVideoFolder: { title: '🎬 Video của Trợ Lý', desc: 'Thư mục chứa clip hoạt cảnh phản ứng riêng của nhân vật trợ lý.', tip: 'Chọn video có động tác vỗ tay, hoan hô của trợ lý.' },
    assistantUseMainVoice: { title: '🎙️ Dùng giọng nhân vật chính', desc: 'Chọn xem Trợ lý có dùng chung voice AI với Idol chính hay dùng voice riêng biệt.', tip: 'Bật nếu muốn đồng bộ giọng, tắt nếu muốn Trợ lý có âm sắc giọng riêng.' },
    replyRate: { title: '📊 Tỷ lệ Trả lời (%)', desc: 'Tỷ lệ phần trăm bình luận được chọn để phản hồi (từ 0% đến 100%).', tip: 'Khuyên đặt 60% - 80% để Idol chọn lọc comment chất lượng, tránh nói quá tải phiên live.' },
    bannedWords: { title: '🚫 Từ khóa Cấm (Blacklist)', desc: 'Danh sách từ ngữ thô tục, tiêu cực, lừa đảo... (mỗi từ 1 dòng).', tip: 'Khi bình luận chứa từ này, AI sẽ tự động bỏ qua tuyệt đối, không đọc và không phản hồi.' },
    priorityWords: { title: '⭐ Từ khóa Ưu tiên', desc: 'Danh sách từ khóa quan trọng liên quan đến chốt đơn, đặt hàng (mỗi từ 1 dòng).', tip: 'Bình luận chứa các từ này sẽ được ưu tiên xếp lên đầu hàng đợi để Idol trả lời ngay.' },
    smartSpamFilter: { title: '🛡️ Bộ lọc Spam Thông minh', desc: 'Tự động nhận diện và chặn các tài khoản bình luận liên tục hoặc gửi nội dung vô nghĩa.', tip: 'Bảo vệ phiên live khỏi bot spam phá hoại và giữ luồng trò chuyện mượt mà.' },
    waitBetweenSpam: { title: '⏱️ Thời gian chờ phạt Spam (giây)', desc: 'Số giây hệ thống tạm ngưng nhận comment từ tài khoản có hành vi spam liên tục.', tip: 'Khuyên đặt 3 - 5 giây.' },
    maxRepeatChars: { title: '🔤 Tỷ lệ Ký tự lặp lại tối đa (0.0 - 1.0)', desc: 'Ngưỡng phát hiện chuỗi ký tự vô nghĩa bị lặp (VD: aaaaaaaa, 1111111111).', tip: 'Đặt 0.7 nghĩa là nếu trên 70% nội dung là ký tự lặp, comment sẽ tự động bị bỏ qua.' },
    likeThreshold: { title: '❤️ Ngưỡng Tim để Cảm ơn', desc: 'Số lượng lượt thích (tim) tích lũy để Idol kích hoạt 1 lần cảm ơn mốc tim.', tip: 'Ví dụ: Đặt 50 hoặc 100 nghĩa là cứ tăng thêm 50-100 tim thì Idol sẽ cảm ơn 1 lần.' },
    greetMinutes: { title: '⏱️ Số phút Gom nhóm Chào / Xin lỗi', desc: 'Khoảng thời gian định kỳ gom người mới vào phòng để chào một lượt.', tip: 'Giúp không bị ngắt quãng phiên live khi người xem ra vào liên tục.' },
    speakAfterIdleSeconds: { title: '⏱️ Tự nói sau khoảng thời gian Im lặng (giây)', desc: 'Số giây không có tương tác trước khi Idol tự động tìm chủ đề bắt chuyện cứu live.', tip: 'Khuyên đặt 5 - 10 giây để giữ phiên live luôn sôi động, không bị chết thời gian.' }
  };

  const HelpTooltip = ({ helpKey, customText, customTitle, className = "" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const info = HELP_DATA[helpKey] || {
      title: customTitle || 'Hướng dẫn chức năng',
      desc: customText || 'Chức năng hỗ trợ tùy chỉnh hoạt động của Idol trong phiên livestream.',
      tip: 'Nhấp để xem hướng dẫn chi tiết.'
    };

    return (
      <div className={`relative inline-flex items-center ${className}`}>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          className="w-4 h-4 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 flex items-center justify-center text-[10px] font-bold transition-all shadow-xs ml-1 focus:outline-none ring-1 ring-blue-300 hover:scale-110 cursor-pointer"
          title="Bấm hoặc rê chuột để xem hướng dẫn"
        >
          ?
        </button>

        {isOpen && (
          <div 
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
            className="absolute z-50 left-6 -top-2 w-72 p-3 bg-[#1e293b] text-white rounded-lg shadow-2xl border border-blue-500/40 text-left pointer-events-auto backdrop-blur-md animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-1.5 border-b border-gray-700/60 mb-2">
              <span className="font-bold text-xs text-blue-300 flex items-center gap-1.5">
                {info.title}
              </span>
              <span className="text-[10px] bg-blue-900/60 text-blue-200 px-1.5 py-0.5 rounded font-mono border border-blue-400/30">
                HDSD
              </span>
            </div>

            <p className="text-[11.5px] text-gray-200 leading-relaxed mb-2 font-normal">
              {info.desc}
            </p>

            {info.tip && (
              <div className="bg-blue-950/70 p-2 rounded border border-blue-800/50 text-[10.5px] text-cyan-200 flex items-start gap-1.5 leading-snug">
                <span className="text-yellow-400 font-bold shrink-0">💡 Mẹo:</span>
                <span>{info.tip}</span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const FieldLabel = ({ icon, text, helpKey, customHelpText, minW = "min-w-[220px]" }) => (
    <div className={`flex items-center gap-1.5 text-[13px] font-semibold text-gray-700 ${minW}`}>
      {icon && <span className="text-[#a53b3b]">{icon}</span>}
      <span>{text}:</span>
      <HelpTooltip helpKey={helpKey} customText={customHelpText} customTitle={text} />
    </div>
  );

  return (
    <div className="flex w-full h-[95vh] bg-[#f0f2f5] font-sans text-gray-800 overflow-hidden">
      
      {/* SIDEBAR */}
      <div className="w-[240px] bg-[#f0f2f5] border-r border-gray-300 flex flex-col h-full">
        <div className="p-3 border-b border-gray-300">
          <div className="border border-gray-300 rounded bg-white overflow-hidden shadow-sm h-[calc(95vh-24px)]">
            <div className="px-3 py-1.5 bg-[#e0e3e8] border-b border-gray-300 text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Sự kiện có sẵn
            </div>
            <div className="overflow-y-auto h-full pb-8">
              {EVENTS.map(ev => {
                const Icon = ev.icon;
                const isSelected = selectedEventId === ev.id;
                return (
                  <button
                    key={ev.id}
                    onClick={() => setSelectedEventId(ev.id)}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm transition-colors cursor-pointer ${isSelected ? 'bg-[#d5e2f2]' : 'hover:bg-gray-100'}`}
                  >
                    <Icon size={16} className={`${ev.color}`} />
                    <span className={`font-medium ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>{ev.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#f0f2f5] p-3">
        
        {/* Header Info Box */}
        <div className="bg-[#e6f0fa] border border-[#b3d4f5] rounded-md p-3 mb-3">
          <p className="text-[13px] text-gray-800 mb-2">
            <span className="font-bold">{selectedEventInfo?.label}: </span>
            {selectedEventInfo?.desc}
          </p>
          <button className="flex items-center gap-1.5 text-[13px] font-bold text-[#14539a] hover:underline cursor-pointer">
            <Play size={14} fill="currentColor" /> Xem video hướng dẫn cấu hình
          </button>
        </div>

        {selectedEventId === 'thanks_heart' && (
          <div className="bg-[#fdebea] border border-[#f5c2c7] rounded-md p-3 mb-3 text-[13px] text-[#842029]">
             <span className="font-bold">⚠️ Lưu ý Quan trọng:</span> Tính năng này phụ thuộc vào kết nối ổn định tới TikTok. Do các thay đổi gần đây từ phía TikTok, kết nối có thể không ổn định, khiến tính năng hoạt động không như mong đợi. Hãy cân nhắc kỹ khi sử dụng.
          </div>
        )}

        {/* Scrollable Config Area */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          
          {/* ========================================================================= */}
          {/* 1. SHOPEE LIVE */}
          {/* ========================================================================= */}
          {selectedEventId === 'shopee_live' ? (
            <div className="w-full pb-8">
              <ShopeeLiveConnectModal inline={true} isDarkMode={false} />
            </div>
          ) : selectedEventId === 'special_gift' ? (
            /* ========================================================================= */
            /* 2. QUÀ TẶNG ĐẶC BIỆT (MULTI-SLOT KHÔNG GIỚI HẠN - ẢNH 1) */
            /* ========================================================================= */
            <>
              <div className="border border-gray-300 rounded-md bg-white mb-3 shadow-sm px-3 py-4">
                <fieldset className="border border-gray-300 rounded p-4 pt-4 mt-2 relative">
                  <legend className="absolute -top-3 left-3 bg-white px-1 text-sm font-semibold text-gray-700">
                    Cấu hình Logic Chung
                  </legend>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center">
                      <FieldLabel icon="⭐" text="Độ ưu tiên" helpKey="priority" minW="min-w-[150px]" />
                      <input type="number" name="priority" value={currentConfig.priority} onChange={handleChange} className="w-64 border border-gray-300 rounded px-2 py-1 text-[13px] bg-gray-50 focus:bg-white focus:outline-blue-500" />
                    </div>
                    <div className="flex items-center">
                      <FieldLabel icon="✅" text="Kích hoạt" helpKey="active" minW="min-w-[150px]" />
                      <input type="checkbox" name="active" checked={currentConfig.active} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded cursor-pointer" />
                    </div>
                  </div>
                </fieldset>
              </div>

              <div className="border border-gray-300 rounded-md bg-white mb-3 shadow-sm px-3 py-4">
                <fieldset className="border border-gray-300 rounded p-4 pt-4 mt-2 relative">
                  <legend className="absolute -top-3 left-3 bg-white px-1 text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <span>Phản ứng Quà tặng Đặc biệt ({currentConfig.specialGiftSlots?.length || 0} Slots)</span>
                  </legend>
                  
                  <div className="flex flex-col gap-4">
                    {currentConfig.specialGiftSlots?.map((slot, sIdx) => (
                      <div key={slot.id || sIdx} className="border border-gray-300 rounded-xl p-3 bg-[#f8f9fa] shadow-sm relative">
                        {/* Slot Header with Checkbox, Title & Delete button */}
                        <div className="flex items-center justify-between mb-3 border-b border-gray-200 pb-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={slot.active !== false} 
                              onChange={(e) => handleSlotChange(slot.id, 'active', e.target.checked, true)} 
                              className="w-4 h-4 text-blue-600 rounded cursor-pointer" 
                            />
                            <span className="font-black text-gray-800 text-[14px]">Slot {slot.id}</span>
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-bold border border-yellow-300">
                              {slot.giftName?.split('(')[0] || 'Quà Đặc Biệt'}
                            </span>
                          </label>

                          <button 
                            onClick={() => handleDeleteSpecialGiftSlot(slot.id)}
                            className="text-xs text-red-500 hover:text-white hover:bg-red-500 border border-red-400 px-2.5 py-1 rounded-lg transition-all font-bold flex items-center gap-1 cursor-pointer"
                            title="Xóa slot quà đặc biệt này"
                          >
                            <Trash2 size={12} /> Xóa Slot
                          </button>
                        </div>

                        <div className="grid grid-cols-[170px_1fr] gap-y-3 gap-x-4 items-center">
                          
                          <div className="flex items-center gap-1">
                            <label className="text-[13px] font-semibold text-[#a53b3b]">Tên Quà tặng (TikTok):</label>
                            <HelpTooltip helpKey="giftName" />
                          </div>
                          <select 
                            value={slot.giftName} 
                            onChange={(e) => handleSlotChange(slot.id, 'giftName', e.target.value)} 
                            className="border border-gray-300 rounded px-2.5 py-1.5 text-[13px] font-medium bg-white focus:outline-blue-500 max-w-sm text-gray-800 shadow-sm cursor-pointer"
                          >
                            {GIFT_OPTIONS.map(g => (
                              <option key={g.id} value={g.label}>
                                {g.label}
                              </option>
                            ))}
                          </select>

                          <div className="flex items-center gap-1">
                            <label className="text-[13px] font-semibold text-[#a53b3b]">Thư mục Video Chính:</label>
                            <HelpTooltip helpKey="videoFolder" />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[13px] font-medium min-w-[150px] text-gray-700 bg-gray-50 px-2 py-1 rounded border border-gray-200 truncate max-w-xs">{slot.videoFolder || 'Chưa chọn thư mục'}</span>
                            <button onClick={() => selectSlotFolder(slot.id, 'videoFolder')} className="text-[13px] text-blue-600 font-semibold hover:text-blue-800 transition-colors underline decoration-dotted cursor-pointer">Chọn...</button>
                            <div className="ml-auto flex gap-4 flex-wrap">
                              <label className="flex items-center gap-1.5 cursor-pointer">
                                <input type="checkbox" checked={slot.useTTS} onChange={(e) => handleSlotChange(slot.id, 'useTTS', e.target.checked, true)} className="rounded text-blue-600 cursor-pointer" /> 
                                <span className="text-[13px] font-medium">Dùng TTS</span>
                                <HelpTooltip helpKey="useTTS" />
                              </label>
                              <label className="flex items-center gap-1.5 cursor-pointer">
                                <input type="checkbox" checked={slot.muteSourceVideo} onChange={(e) => handleSlotChange(slot.id, 'muteSourceVideo', e.target.checked, true)} className="rounded text-blue-600 cursor-pointer" /> 
                                <span className="text-[13px] font-medium">Tắt âm gốc</span>
                                <HelpTooltip helpKey="muteSourceVideo" />
                              </label>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <label className="text-[13px] font-semibold text-[#1e40af]">🎬 Video Nền Hỗ Trợ:</label>
                            <HelpTooltip helpKey="videoFolder" />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[13px] font-medium min-w-[150px] text-gray-700 bg-gray-50 px-2 py-1 rounded border border-gray-200 truncate max-w-xs">{slot.supportVideoFolder || 'Chưa chọn (Dùng video nền mặc định)'}</span>
                            <button onClick={() => selectSlotFolder(slot.id, 'supportVideoFolder')} className="text-[13px] text-indigo-600 font-semibold hover:text-indigo-800 transition-colors underline decoration-dotted cursor-pointer">Chọn video nền...</button>
                          </div>

                          <div className="col-span-2 border-t border-gray-300 my-1"></div>

                          {/* Assistant Config */}
                          <div className="col-span-2">
                            <div className="flex items-center gap-2 mb-2">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={slot.useAssistant} onChange={(e) => handleSlotChange(slot.id, 'useAssistant', e.target.checked, true)} className="w-4 h-4 text-blue-600 rounded cursor-pointer" />
                                <span className="font-bold text-gray-800 text-[13px]">Cấu hình Trợ lý riêng</span>
                              </label>
                              <HelpTooltip helpKey="useAssistant" />
                            </div>
                            
                            {slot.useAssistant && (
                              <div className="pl-6 grid grid-cols-[150px_1fr] gap-y-3 gap-x-4">
                                <div className="flex items-center gap-1">
                                  <label className="text-[13px] font-semibold text-gray-700">Câu mẫu của Trợ lý:</label>
                                  <HelpTooltip helpKey="assistantPrompt" />
                                </div>
                                <div className="space-y-2">
                                  <textarea value={slot.assistantPrompt} onChange={(e) => handleSlotChange(slot.id, 'assistantPrompt', e.target.value)} placeholder="Ví dụ: Ôi đại gia {user} vừa tặng {gift_name}! Cảm ơn đại gia rất nhiều!" className="w-full h-[60px] border border-gray-300 rounded p-2 text-[13px] resize-none bg-white focus:outline-blue-500" />
                                  <EventVoiceTester 
                                    text={slot.assistantPrompt || `Ôi đại gia {user} vừa tặng ${slot.giftName || 'quà đặc biệt'}! Cảm ơn đại gia rất nhiều!`}
                                    defaultVoiceId="free_vi_female2"
                                    label={`Nghe thử câu thoại Quà đặc biệt (${slot.giftName?.split('(')[0] || 'Slot ' + slot.id})`}
                                    compact={false}
                                  />
                                </div>
                                
                                <div className="flex items-center gap-1">
                                  <label className="text-[13px] font-semibold text-gray-700">Video của Trợ lý:</label>
                                  <HelpTooltip helpKey="assistantVideoFolder" />
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[13px] font-medium min-w-[150px] truncate max-w-xs">{slot.assistantVideoFolder || 'Chưa chọn'}</span>
                                  <button onClick={() => selectSlotFolder(slot.id, 'assistantVideoFolder')} className="text-[13px] text-gray-600 font-medium hover:text-gray-900 transition-colors underline decoration-dotted cursor-pointer">Chọn...</button>
                                </div>

                                <div className="col-span-2 flex justify-center mt-1">
                                  <label className="flex items-center gap-1.5 cursor-pointer">
                                    <input type="checkbox" checked={slot.useMainVoice} onChange={(e) => handleSlotChange(slot.id, 'useMainVoice', e.target.checked, true)} className="cursor-pointer" /> 
                                    <span className="text-[13px] text-gray-600 font-medium">Dùng giọng của nhân vật chính</span>
                                    <HelpTooltip helpKey="assistantUseMainVoice" />
                                  </label>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Button Thêm Slot Quà Tặng Đặc Biệt */}
                    <button 
                      onClick={handleAddSpecialGiftSlot}
                      className="w-full py-3 bg-gradient-to-r from-yellow-50 to-amber-50 hover:from-yellow-100 hover:to-amber-100 border-2 border-dashed border-amber-400 text-amber-800 rounded-xl font-black text-sm flex justify-center items-center gap-2 transition-all shadow-sm cursor-pointer active:scale-98"
                    >
                      <Plus size={18} className="text-amber-600" /> ➕ Thêm Slot Quà Tặng Đặc Biệt Mới
                    </button>
                  </div>

                </fieldset>
              </div>
            </>
          ) : selectedEventId === 'gift' ? (
            /* ========================================================================= */
            /* 3. QUÀ TẶNG THƯỜNG (MULTI-SLOT QUÀ THƯỜNG - ẢNH 2) */
            /* ========================================================================= */
            <>
              <div className="border border-gray-300 rounded-md bg-white mb-3 shadow-sm px-3 py-4">
                <fieldset className="border border-gray-300 rounded p-4 pt-4 mt-2 relative">
                  <legend className="absolute -top-3 left-3 bg-white px-1 text-sm font-semibold text-gray-700">
                    Cấu hình Logic Chung (Ưu tiên, Cooldown)
                  </legend>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center">
                      <FieldLabel icon="⭐" text="Độ ưu tiên" helpKey="priority" minW="min-w-[180px]" />
                      <input type="number" name="priority" value={currentConfig.priority} onChange={handleChange} className="flex-1 border border-gray-300 rounded px-2 py-1 text-[13px] bg-gray-50 focus:bg-white focus:outline-blue-500" />
                    </div>
                    <div className="flex items-center">
                      <FieldLabel icon="✅" text="Kích hoạt" helpKey="active" minW="min-w-[180px]" />
                      <input type="checkbox" name="active" checked={currentConfig.active} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded cursor-pointer" />
                    </div>
                    <div className="flex items-center">
                      <FieldLabel icon="⏳" text="Chờ giữa các quà tặng (giây)" helpKey="waitBetweenEvents" minW="min-w-[180px]" />
                      <input type="number" name="waitBetweenEvents" value={currentConfig.waitBetweenEvents} onChange={handleChange} className="flex-1 border border-gray-300 rounded px-2 py-1 text-[13px] bg-gray-50 focus:bg-white focus:outline-blue-500" />
                    </div>
                  </div>
                </fieldset>
              </div>

              {/* Danh sách các Slot Quà Tặng Thường */}
              <div className="border border-gray-300 rounded-md bg-white mb-3 shadow-sm px-3 py-4">
                <fieldset className="border border-gray-300 rounded p-4 pt-4 mt-2 relative">
                  <legend className="absolute -top-3 left-3 bg-white px-1 text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <span>Cấu hình Các Slot Quản Lý Quà Tặng Thường ({currentConfig.giftSlots?.length || 0} Slots)</span>
                  </legend>

                  <div className="flex flex-col gap-4">
                    {currentConfig.giftSlots?.map((gSlot, gIdx) => (
                      <div key={gSlot.id || gIdx} className="border border-gray-300 rounded-xl p-4 bg-[#f8f9fa] shadow-sm relative space-y-3">
                        {/* Slot Header with Checkbox, Title & Delete button */}
                        <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={gSlot.active !== false} 
                              onChange={(e) => handleGiftSlotChange(gSlot.id, 'active', e.target.checked, true)} 
                              className="w-4 h-4 text-blue-600 rounded cursor-pointer" 
                            />
                            <span className="font-black text-gray-800 text-[14px]">Slot {gSlot.id}:</span>
                            <input 
                              type="text" 
                              value={gSlot.name || ''} 
                              onChange={(e) => handleGiftSlotChange(gSlot.id, 'name', e.target.value)} 
                              placeholder="Tên slot quà thường..." 
                              className="px-2 py-0.5 border border-gray-300 rounded text-xs font-bold bg-white text-gray-800 w-64 focus:outline-blue-500" 
                            />
                          </label>

                          <button 
                            onClick={() => handleDeleteGiftSlot(gSlot.id)}
                            className="text-xs text-red-500 hover:text-white hover:bg-red-500 border border-red-400 px-2.5 py-1 rounded-lg transition-all font-bold flex items-center gap-1 cursor-pointer"
                            title="Xóa slot quà thường này"
                          >
                            <Trash2 size={12} /> Xóa Slot
                          </button>
                        </div>

                        {/* Video Folders Config */}
                        <div className="grid grid-cols-[180px_1fr] gap-y-3 gap-x-4 items-center">
                          <div className="flex items-center gap-1">
                            <label className="text-[13px] font-semibold text-[#a53b3b]">Thư mục video hành động:</label>
                            <HelpTooltip helpKey="videoFolder" />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[13px] font-medium min-w-[150px] text-gray-700 bg-gray-50 px-2 py-1 rounded border border-gray-200 truncate max-w-xs">{gSlot.videoFolder || 'Chưa chọn thư mục'}</span>
                            <button onClick={() => selectGiftSlotFolder(gSlot.id, 'videoFolder')} className="text-[13px] text-blue-600 font-semibold hover:text-blue-800 transition-colors underline decoration-dotted cursor-pointer">Chọn thư mục...</button>
                          </div>

                          <div className="flex items-center gap-1">
                            <label className="text-[13px] font-semibold text-[#1e40af]">🎬 Thư mục video nền hỗ trợ:</label>
                            <HelpTooltip helpKey="videoFolder" />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[13px] font-medium min-w-[150px] text-gray-700 bg-gray-50 px-2 py-1 rounded border border-gray-200 truncate max-w-xs">{gSlot.supportVideoFolder || 'Chưa chọn (Dùng video nền mặc định)'}</span>
                            <button onClick={() => selectGiftSlotFolder(gSlot.id, 'supportVideoFolder')} className="text-[13px] text-indigo-600 font-semibold hover:text-indigo-800 transition-colors underline decoration-dotted cursor-pointer">Chọn video nền...</button>
                          </div>

                          <div className="flex items-start">
                            <label className="text-[13px] font-semibold text-gray-700 mt-1">📄 Câu trả lời mẫu (mỗi câu 1 dòng):</label>
                          </div>
                          <div className="space-y-2">
                            <textarea 
                              value={gSlot.sampleAnswers || ''} 
                              onChange={(e) => handleGiftSlotChange(gSlot.id, 'sampleAnswers', e.target.value)} 
                              placeholder="Cảm ơn bạn {user} đã gửi tặng {gift_name} nha!&#10;Cảm ơn món quà ngọt ngào của {user}!"
                              className="w-full h-[80px] border border-gray-300 rounded p-2 text-[13px] resize-none bg-white focus:outline-blue-500" 
                            />
                            <EventVoiceTester 
                              text={gSlot.sampleAnswers || 'Cảm ơn bạn {user} đã gửi tặng {gift_name} nha! Cảm ơn món quà ngọt ngào của {user}!'}
                              defaultVoiceId="free_vi_female"
                              label={`Nghe thử câu thoại mẫu (${gSlot.name || 'Slot ' + gSlot.id})`}
                              compact={false}
                            />
                          </div>

                          <div className="flex items-start">
                            <label className="text-[13px] font-semibold text-gray-700 mt-1">✍️ Kịch bản cho AI:</label>
                          </div>
                          <textarea 
                            value={gSlot.aiPrompt || ''} 
                            onChange={(e) => handleGiftSlotChange(gSlot.id, 'aiPrompt', e.target.value)} 
                            placeholder="Bạn là streamer AI. Hãy viết lời cảm ơn sáng tạo tới {user} vì đã tặng 1 {gift_name}."
                            className="w-full h-[70px] border border-gray-300 rounded p-2 text-[13px] resize-none bg-white focus:outline-blue-500" 
                          />
                        </div>

                        {/* Options Checkboxes */}
                        <div className="flex items-center gap-6 pt-2 border-t border-gray-200 flex-wrap">
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input type="checkbox" checked={gSlot.useAi} onChange={(e) => handleGiftSlotChange(gSlot.id, 'useAi', e.target.checked, true)} className="rounded text-blue-600 cursor-pointer" /> 
                            <span className="text-[13px] font-medium">🧠 Dùng AI trả lời</span>
                          </label>
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input type="checkbox" checked={gSlot.useVoice} onChange={(e) => handleGiftSlotChange(gSlot.id, 'useVoice', e.target.checked, true)} className="rounded text-blue-600 cursor-pointer" /> 
                            <span className="text-[13px] font-medium">🗣️ Dùng giọng nói</span>
                          </label>
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input type="checkbox" checked={gSlot.useTTS} onChange={(e) => handleGiftSlotChange(gSlot.id, 'useTTS', e.target.checked, true)} className="rounded text-blue-600 cursor-pointer" /> 
                            <span className="text-[13px] font-medium">🗣️ Dùng TTS</span>
                          </label>
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input type="checkbox" checked={gSlot.muteSourceVideo} onChange={(e) => handleGiftSlotChange(gSlot.id, 'muteSourceVideo', e.target.checked, true)} className="rounded text-blue-600 cursor-pointer" /> 
                            <span className="text-[13px] font-medium">🔇 Tắt âm gốc video</span>
                          </label>
                        </div>

                        {/* Assistant for this slot */}
                        <div className="pt-2 border-t border-gray-200">
                          <label className="flex items-center gap-2 cursor-pointer mb-2">
                            <input type="checkbox" checked={gSlot.useAssistant} onChange={(e) => handleGiftSlotChange(gSlot.id, 'useAssistant', e.target.checked, true)} className="w-4 h-4 text-blue-600 rounded cursor-pointer" />
                            <span className="font-bold text-gray-800 text-[13px]">👥 Cài đặt Trợ lý riêng cho slot này</span>
                          </label>

                          {gSlot.useAssistant && (
                            <div className="pl-6 grid grid-cols-[150px_1fr] gap-y-2 gap-x-4">
                              <label className="text-[13px] font-semibold text-gray-700">Câu mẫu Trợ lý:</label>
                              <div className="space-y-2">
                                <textarea value={gSlot.assistantPrompt || ''} onChange={(e) => handleGiftSlotChange(gSlot.id, 'assistantPrompt', e.target.value)} placeholder="Ví dụ: Cảm ơn bạn {user} đã ủng hộ quà cho phòng live nhé!" className="w-full h-[50px] border border-gray-300 rounded p-2 text-[13px] resize-none bg-white focus:outline-blue-500" />
                                <EventVoiceTester 
                                  text={gSlot.assistantPrompt || 'Cảm ơn bạn {user} đã ủng hộ quà cho phòng live nhé!'}
                                  defaultVoiceId="free_vi_female2"
                                  label={`Nghe thử Trợ lý (${gSlot.name || 'Slot ' + gSlot.id})`}
                                  compact={false}
                                />
                              </div>
                              <label className="text-[13px] font-semibold text-gray-700">Video Trợ lý:</label>
                              <div className="flex items-center gap-2">
                                <span className="text-[13px] font-medium min-w-[150px] truncate max-w-xs">{gSlot.assistantVideoFolder || 'Chưa chọn'}</span>
                                <button onClick={() => selectGiftSlotFolder(gSlot.id, 'assistantVideoFolder')} className="text-[13px] text-blue-600 font-medium hover:underline cursor-pointer">Chọn...</button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Button Thêm Slot Quà Thường */}
                    <button 
                      onClick={handleAddGiftSlot}
                      className="w-full py-3 bg-gradient-to-r from-yellow-50 to-amber-50 hover:from-yellow-100 hover:to-amber-100 border-2 border-dashed border-yellow-400 text-yellow-800 rounded-xl font-black text-sm flex justify-center items-center gap-2 transition-all shadow-sm cursor-pointer active:scale-98"
                    >
                      <Plus size={18} className="text-yellow-600" /> ➕ Thêm Slot Quà Tặng (Thường) Mới
                    </button>
                  </div>
                </fieldset>
              </div>
            </>
          ) : selectedEventId === 'checkout' ? (
            /* ========================================================================= */
            /* 4. CHỐT ĐƠN (CHECKOUT & KỊCH BẢN BÁN HÀNG IDOL AI) */
            /* ========================================================================= */
            <>
              <div className="border border-gray-300 rounded-2xl bg-white mb-4 shadow-sm px-4 py-5">
                
                {/* 1. KHỞI CHẠY & ƯU TIÊN */}
                <div className="flex items-center gap-6 mb-5 pb-3 border-b border-gray-100 flex-wrap">
                  <div className="flex items-center">
                    <FieldLabel icon="✅" text="Kích hoạt" helpKey="active" minW="min-w-[120px]" />
                    <input type="checkbox" name="active" checked={currentConfig.active} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded cursor-pointer" />
                  </div>
                  <div className="flex items-center">
                    <FieldLabel icon="⭐" text="Độ ưu tiên" helpKey="priority" minW="min-w-[100px]" />
                    <input type="number" name="priority" value={currentConfig.priority} onChange={handleChange} className="w-28 border border-gray-300 rounded-lg px-2.5 py-1 text-xs bg-gray-50 focus:bg-white focus:outline-blue-500 font-bold" />
                  </div>
                </div>

                {/* ========================================================================= */}
                {/* 🌟 2. BỘ CHỌN CHẾ ĐỘ PHÁT SÓNG KỊCH BẢN (SCRIPT BROADCAST MODE) */}
                {/* ========================================================================= */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-300 mb-6 shadow-xs space-y-3">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-black text-blue-900 flex items-center gap-2 uppercase tracking-wide">
                        <Sparkles size={18} className="text-blue-600 animate-pulse" /> CHẾ ĐỘ PHÁT SÓNG KỊCH BẢN BÁN HÀNG IDOL AI
                      </h3>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Chọn cách Idol AI livestream: Đọc đúng 100% kịch bản đã setup từng câu hoặc Trả lời bằng Bộ Não AI & Kho Tri Thức Doanh Nghiệp.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 p-1 bg-white rounded-xl border border-blue-200 shadow-sm shrink-0">
                      <button
                        type="button"
                        onClick={() => handleSimpleChange('broadcastMode', 'fixed_script')}
                        className={`px-4 py-2 rounded-lg text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          (currentConfig.broadcastMode || 'fixed_script') === 'fixed_script'
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md scale-[1.02]'
                            : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
                        }`}
                      >
                        <FileText size={15} /> 1. Kịch Bản Cài Sẵn
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSimpleChange('broadcastMode', 'ai_brain')}
                        className={`px-4 py-2 rounded-lg text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          currentConfig.broadcastMode === 'ai_brain'
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md scale-[1.02]'
                            : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'
                        }`}
                      >
                        <Bot size={15} /> 2. Bộ Não AI & Tri Thức
                      </button>
                    </div>
                  </div>

                  {/* CẤU HÌNH XEN KẼ BÌNH LUẬN (COMMENT INTERRUPTION & SEAMLESS RESUME) */}
                  <div className="p-3 bg-white/95 rounded-xl border border-blue-200 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-start gap-2.5">
                      <input 
                        type="checkbox" 
                        id="interruptOnComment"
                        checked={currentConfig.interruptOnComment !== false} 
                        onChange={(e) => handleSimpleChange('interruptOnComment', e.target.checked)} 
                        className="w-4 h-4 text-blue-600 rounded cursor-pointer mt-0.5" 
                      />
                      <div>
                        <label htmlFor="interruptOnComment" className="text-xs font-black text-gray-800 cursor-pointer flex items-center gap-1.5">
                          <span>🔄 Tự động tạm dừng kịch bản khi có bình luận &rarr; Trả lời khách &rarr; Đọc tiếp liền mạch</span>
                        </label>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Khi có bình luận từ khán giả, Idol sẽ tạm dừng câu kịch bản bán hàng, trả lời thắc mắc của khách rồi tự động đọc tiếp câu tiếp theo mà không bị lặp lại từ đầu.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 text-xs font-bold text-blue-900">
                      <span>Nguồn trả lời:</span>
                      <select
                        value={currentConfig.commentReplySource || 'knowledge_base'}
                        onChange={(e) => handleSimpleChange('commentReplySource', e.target.value)}
                        className="bg-white border border-blue-300 rounded px-2 py-0.5 text-xs text-blue-900 font-bold focus:outline-none cursor-pointer"
                      >
                        <option value="knowledge_base">🧠 Kho Tri Thức Doanh Nghiệp</option>
                        <option value="keywords">💬 Kịch bản từ khóa</option>
                        <option value="both">🔄 Kết hợp thông minh</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* ========================================================================= */}
                {/* 🛍️ 3. DANH SÁCH SẢN PHẨM / MÃ HÀNG LIVESTREAM (ĐƯỢC ĐƯA LÊN TRÊN ĐẦU) */}
                {/* ========================================================================= */}
                <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <div>
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                        <ShoppingBag size={15} className="text-blue-600" /> DANH SÁCH SẢN PHẨM / MÃ HÀNG LIVESTREAM
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Khai báo các sản phẩm có trong giỏ hàng để AI tự động nhận diện từ khóa và tư vấn chốt đơn cho từng sản phẩm.
                      </p>
                    </div>

                    <button 
                      onClick={handleAddProduct}
                      className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                    >
                      <Plus size={13} /> Thêm Sản Phẩm Mới
                    </button>
                  </div>

                  {(!currentConfig.checkoutProducts || currentConfig.checkoutProducts.length === 0) ? (
                    <div className="text-center py-4 text-xs text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                      Chưa có sản phẩm nào trong danh sách. Bấm <b>"Thêm Sản Phẩm Mới"</b> để bắt đầu khai báo mã hàng!
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {currentConfig.checkoutProducts.map(prod => (
                        <fieldset key={prod.id} className="border border-blue-200 rounded-xl p-3.5 pt-4 relative bg-white shadow-2xs">
                          <legend className="absolute -top-3 left-3 bg-white px-2 text-xs font-bold text-blue-900 flex items-center gap-2 border border-blue-200 rounded-md shadow-2xs">
                            <input 
                              type="checkbox" 
                              checked={prod.active !== false} 
                              onChange={(e) => handleProductChange(prod.id, 'active', e.target.checked, true)} 
                              className="w-3.5 h-3.5 text-blue-600 rounded cursor-pointer" 
                            />
                            <span>Mã Hàng #{prod.id}: <b className="text-blue-700">{prod.productName || 'Chưa đặt tên'}</b></span>
                          </legend>
                          
                          <button 
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="absolute top-2 right-2 text-xs text-red-500 hover:text-white hover:bg-red-500 border border-red-300 px-2 py-0.5 rounded-md transition-colors font-semibold cursor-pointer"
                          >
                            Xóa
                          </button>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1 text-xs">
                            <div>
                              <label className="font-bold text-gray-700 block mb-1">🏷️ Tên sản phẩm:</label>
                              <input 
                                type="text" 
                                value={prod.productName} 
                                onChange={(e) => handleProductChange(prod.id, 'productName', e.target.value)} 
                                placeholder="Ví dụ: Serum Tế Bào Gốc Trẻ Hóa Da, Nước Hoa Pháp..."
                                className="border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-blue-500 w-full" 
                              />
                            </div>

                            <div>
                              <label className="font-bold text-[#a53b3b] block mb-1">🔑 Từ khóa chốt đơn (cách nhau bởi ;):</label>
                              <input 
                                type="text" 
                                value={prod.keywords} 
                                onChange={(e) => handleProductChange(prod.id, 'keywords', e.target.value)} 
                                placeholder="Ví dụ: sp1; mã 01; serum; mua serum; chốt 01"
                                className="border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-blue-500 w-full" 
                              />
                            </div>

                            <div>
                              <label className="font-bold text-gray-700 block mb-1">💰 Giá niêm yết & Giá Flash Sale:</label>
                              <input 
                                type="text" 
                                value={prod.priceInfo || ''} 
                                onChange={(e) => handleProductChange(prod.id, 'priceInfo', e.target.value)} 
                                placeholder="Ví dụ: Giá gốc 1.850.000đ - Giá live 890.000đ"
                                className="border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-blue-500 w-full" 
                              />
                            </div>

                            <div>
                              <label className="font-bold text-gray-700 block mb-1">📁 Thư mục Video Minh Họa:</label>
                              <div className="flex items-center gap-2 w-full">
                                <span className="font-medium text-gray-600 truncate flex-1 bg-gray-50 border border-gray-200 px-2 py-1 rounded-lg">{prod.videoFolder || 'Chưa chọn thư mục'}</span>
                                <button onClick={() => selectProductFolder(prod.id)} className="text-gray-700 font-bold hover:text-gray-900 transition-colors bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-lg cursor-pointer">Chọn...</button>
                              </div>
                            </div>
                          </div>

                          {/* Bộ Nghe Thử Voice Cho Từng Sản Phẩm */}
                          <div className="mt-3 pt-2 border-t border-gray-100">
                            <EventVoiceTester 
                              text={`Dạ em chào bạn {user}! Sản phẩm ${prod.productName || 'này'} đang có ưu đãi cực sốc trong giỏ hàng góc trái màn hình, bạn bấm vào đặt hàng ngay để nhận quà nhé!`}
                              defaultVoiceId="free_vi_female"
                              label={`Nghe thử câu chốt đơn: ${prod.productName || `Mã #${prod.id}`}`}
                              compact={true}
                            />
                          </div>
                        </fieldset>
                      ))}
                    </div>
                  )}
                </div>

                {/* ========================================================================= */}
                {/* 📜 4. NỘI DUNG CHI TIẾT THEO CHẾ ĐỘ ĐANG CHỌN */}
                {/* ========================================================================= */}
                {(currentConfig.broadcastMode || 'fixed_script') === 'fixed_script' ? (
                  /* ========================================================================= */
                  /* CHẾ ĐỘ 1: KỊCH BẢN BÁN HÀNG CÀI SẴN (FIXED SCRIPT) */
                  /* ========================================================================= */
                  <div className="space-y-4 mb-4">
                    <fieldset className="border-2 border-blue-300 rounded-2xl p-4 pt-4 relative bg-blue-50/30 shadow-xs">
                      <legend className="absolute -top-3 left-4 bg-white px-2.5 py-0.5 text-xs font-black text-blue-900 flex items-center gap-1.5 border border-blue-300 rounded-lg shadow-2xs">
                        <FileText size={14} className="text-blue-600" /> KỊCH BẢN BÁN HÀNG PHÁT THEO THỨ TỰ (FIXED SCRIPT)
                      </legend>

                      <div className="flex flex-col gap-3 mt-1">
                        {/* Thanh nút nạp kịch bản mẫu & tải file */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-white rounded-xl border border-blue-100">
                          <div>
                            <div className="text-xs font-black text-blue-900 flex items-center gap-1.5">
                              <Sparkles size={14} className="text-amber-500" /> NẠP KỊCH BẢN MẪU CHUẨN XỊN (30 - 60 PHÚT):
                            </div>
                            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                              <button
                                type="button"
                                onClick={() => applyMasterScript('cosmetics')}
                                className="px-3 py-1 bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-300 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                              >
                                🌸 Mỹ Phẩm & Nước Hoa (Chuẩn 60p)
                              </button>
                              <button
                                type="button"
                                onClick={() => applyMasterScript('fashion')}
                                className="px-3 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-300 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                              >
                                👗 Thời Trang & Phụ Kiện
                              </button>
                              <button
                                type="button"
                                onClick={() => applyMasterScript('tech')}
                                className="px-3 py-1 bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border border-cyan-300 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                              >
                                💻 Công Nghệ & Khóa Học AI
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <input 
                              type="file" 
                              id="upload-fixed-script-file"
                              className="hidden" 
                              accept=".txt,.md,.docx,.doc,.pdf,.csv,.json"
                              onChange={handleLoadUniversalScriptFile}
                            />
                            <label 
                              htmlFor="upload-fixed-script-file"
                              className="text-xs text-blue-700 cursor-pointer hover:bg-blue-100 flex items-center gap-1.5 bg-blue-50 px-3 py-2 rounded-xl border border-blue-300 font-black shadow-2xs transition-all"
                            >
                              <Upload size={14} /> Nạp File Kịch Bản (.docx, .pdf, .txt, .json)
                            </label>
                          </div>
                        </div>

                        {/* Textarea kịch bản */}
                        <div className="relative">
                          <textarea 
                            value={currentConfig.fixedScriptText !== undefined ? currentConfig.fixedScriptText : COSMETICS_MASTER_SCRIPT} 
                            onChange={(e) => handleSimpleChange('fixedScriptText', e.target.value)} 
                            placeholder="Nhập chuỗi các câu thoại kịch bản (mỗi dòng là một câu). Idol sẽ đọc tuần tự từng câu theo đúng kịch bản đã setup..."
                            className="w-full h-[220px] border border-gray-300 rounded-xl p-3.5 text-xs resize-y bg-white focus:outline-blue-500 font-sans leading-relaxed shadow-inner" 
                          />
                          <div className="absolute bottom-3 right-3 text-[11px] text-gray-400 bg-white/80 px-2 py-0.5 rounded-md border border-gray-200">
                            {(currentConfig.fixedScriptText || COSMETICS_MASTER_SCRIPT).split(/\r?\n/).filter(Boolean).length} câu thoại
                          </div>
                        </div>

                        {/* Tùy chỉnh phát kịch bản */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-white rounded-xl border border-gray-200 text-xs">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-gray-700">⏱️ Thời gian nghỉ giữa câu:</span>
                            <div className="flex items-center gap-1">
                              <input 
                                type="number" 
                                min="1" 
                                max="30"
                                value={currentConfig.pauseBetweenSentences || 3} 
                                onChange={(e) => handleSimpleChange('pauseBetweenSentences', Number(e.target.value) || 3)}
                                className="w-14 border border-gray-300 rounded-lg px-2 py-1 text-center font-bold" 
                              />
                              <span className="text-gray-500">giây</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-gray-700">⏳ Thời lượng phát kịch bản:</span>
                            <div className="flex items-center gap-1">
                              <select
                                value={currentConfig.scriptDurationMinutes || 60}
                                onChange={(e) => handleSimpleChange('scriptDurationMinutes', Number(e.target.value) || 60)}
                                className="border border-gray-300 rounded-lg px-2 py-1 text-xs font-bold bg-white cursor-pointer"
                              >
                                <option value="30">30 phút</option>
                                <option value="60">60 phút (1 tiếng)</option>
                                <option value="90">90 phút (1.5 tiếng)</option>
                                <option value="120">120 phút (2 tiếng)</option>
                                <option value="180">180 phút (3 tiếng)</option>
                              </select>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <input 
                              type="checkbox" 
                              id="loopScriptCheckbox"
                              checked={currentConfig.loopScript !== false} 
                              onChange={(e) => handleSimpleChange('loopScript', e.target.checked)}
                              className="w-4 h-4 text-blue-600 rounded cursor-pointer" 
                            />
                            <label htmlFor="loopScriptCheckbox" className="font-bold text-gray-700 cursor-pointer">
                              🔁 Tự động lặp lại kịch bản
                            </label>
                          </div>
                        </div>

                        {/* Bộ Nghe Thử Voice Kịch Bản */}
                        <EventVoiceTester 
                          text={currentConfig.fixedScriptText || COSMETICS_MASTER_SCRIPT}
                          defaultVoiceId="free_vi_female"
                          label="Nghe thử toàn bộ kịch bản bán hàng cài sẵn (Mọi Giọng Đọc AI)"
                          compact={false}
                        />
                      </div>
                    </fieldset>
                  </div>
                ) : (
                  /* ========================================================================= */
                  /* CHẾ ĐỘ 2: BỘ NÃO AI & KHO TRI THỨC DOANH NGHIỆP / SẢN PHẨM */
                  /* ========================================================================= */
                  <div className="space-y-4 mb-4">
                    <fieldset className="border-2 border-purple-300 rounded-2xl p-4 pt-4 relative bg-purple-50/30 shadow-xs">
                      <legend className="absolute -top-3 left-4 bg-white px-2.5 py-0.5 text-xs font-black text-purple-900 flex items-center gap-1.5 border border-purple-300 rounded-lg shadow-2xs">
                        <Bot size={14} className="text-purple-600" /> KHO TRI THỨC DOANH NGHIỆP & SẢN PHẨM (AI KNOWLEDGE BASE)
                      </legend>

                      <div className="space-y-4 mt-1">
                        {/* Thanh nạp file tri thức doanh nghiệp */}
                        <div className="p-3.5 bg-white rounded-xl border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                          <div>
                            <div className="text-xs font-black text-purple-900 flex items-center gap-1.5">
                              <BookOpen size={15} className="text-purple-600" /> TẢI FILE TÀI LIỆU DOANH NGHIỆP / SẢN PHẨM:
                            </div>
                            <p className="text-[11px] text-gray-500 mt-0.5">
                              Hỗ trợ tất cả các định dạng: <b>.docx, .doc, .pdf, .txt, .json, .csv, .md, .xlsx, .xls</b>. AI sẽ tự động học thuộc 100% dữ liệu để trả lời khách.
                            </p>
                            {currentConfig.companyKnowledgeFileName && (
                              <div className="mt-1 text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                                <CheckCircle2 size={12} /> Đã nạp file: {currentConfig.companyKnowledgeFileName}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <input 
                              type="file" 
                              id="upload-knowledge-doc-file"
                              className="hidden" 
                              accept=".txt,.md,.docx,.doc,.pdf,.csv,.json,.xlsx,.xls"
                              onChange={handleLoadUniversalKnowledgeFile}
                            />
                            <label 
                              htmlFor="upload-knowledge-doc-file"
                              className="text-xs text-purple-700 cursor-pointer hover:bg-purple-100 flex items-center gap-1.5 bg-purple-50 px-3 py-2 rounded-xl border border-purple-300 font-black shadow-2xs transition-all"
                            >
                              <Upload size={14} /> Nạp File Tri Thức (.docx, .pdf, .txt...)
                            </label>
                          </div>
                        </div>

                        {/* Form cấu hình Doanh nghiệp & Sản phẩm */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-bold text-gray-700 block mb-1">🏢 Tên Doanh Nghiệp / Thương Hiệu:</label>
                            <input 
                              type="text" 
                              value={currentConfig.companyName || 'CÔNG TY PHẦN MỀM THIÊN VUA APP'} 
                              onChange={(e) => handleSimpleChange('companyName', e.target.value)} 
                              placeholder="Ví dụ: Shop Mỹ Phẩm Ngọc Nhi, Thiên Vua App..."
                              className="w-full border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-purple-500 font-bold" 
                            />
                          </div>

                          <div>
                            <label className="text-xs font-bold text-gray-700 block mb-1">📦 Tên Sản Phẩm / Dịch Vụ Chính:</label>
                            <input 
                              type="text" 
                              value={currentConfig.productName || 'Bộ Đôi Serum Tế Bào Gốc & Nước Hoa Pháp'} 
                              onChange={(e) => handleSimpleChange('productName', e.target.value)} 
                              placeholder="Ví dụ: Serum Tế Bào Gốc, Nước Hoa Pháp, Phần mềm AvaLive..."
                              className="w-full border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-purple-500 font-bold" 
                            />
                          </div>

                          <div>
                            <label className="text-xs font-bold text-gray-700 block mb-1">💰 Giá Niêm Yết & Giá Flash Sale Live:</label>
                            <input 
                              type="text" 
                              value={currentConfig.productPrice || '1.850.000đ - Giảm 50% chỉ còn 890.000đ trên live'} 
                              onChange={(e) => handleSimpleChange('productPrice', e.target.value)} 
                              placeholder="Ví dụ: Giá gốc 1.850.000đ, giá live 890.000đ..."
                              className="w-full border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-purple-500" 
                            />
                          </div>

                          <div>
                            <label className="text-xs font-bold text-gray-700 block mb-1">🎁 Quà Tặng Kèm & Khuyến Mãi:</label>
                            <input 
                              type="text" 
                              value={currentConfig.promotions || 'Tặng kèm tuýp kem dưỡng ẩm mini + Freeship toàn quốc'} 
                              onChange={(e) => handleSimpleChange('promotions', e.target.value)} 
                              placeholder="Ví dụ: Tặng kem dưỡng mini, tặng voucher 50k, freeship..."
                              className="w-full border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-purple-500" 
                            />
                          </div>
                        </div>

                        {/* Điểm nổi bật & Bảo hành */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-bold text-gray-700 block mb-1">✨ Tính Năng, Thành Phần & Công Dụng Nổi Bật:</label>
                            <textarea 
                              value={currentConfig.keyFeatures || `1. Tinh chất Serum tế bào gốc phục hồi làn da căng bóng sau 7 ngày.\n2. Nước hoa Pháp hương thơm ngọt ngào, sang trọng lưu hương suốt 12 tiếng.\n3. Thành phần tự nhiên 100% đạt chuẩn y khoa da liễu, an toàn cho mọi loại da.`} 
                              onChange={(e) => handleSimpleChange('keyFeatures', e.target.value)} 
                              placeholder="Mô tả các đặc điểm nổi bật để AI tư vấn cho khách..."
                              className="w-full h-[80px] border border-gray-300 rounded-lg p-2 text-xs resize-none bg-white focus:outline-purple-500 leading-relaxed" 
                            />
                          </div>

                          <div>
                            <label className="text-xs font-bold text-gray-700 block mb-1">🛡️ Chính Sách Bảo Hành / Đổi Trả / Vận Chuyển:</label>
                            <textarea 
                              value={currentConfig.warrantyPolicy || 'Bảo hành 1 đổi 1 trong 30 ngày, hoàn tiền 200% nếu phát hiện hàng giả, miễn phí vận chuyển tận nhà trên toàn quốc'} 
                              onChange={(e) => handleSimpleChange('warrantyPolicy', e.target.value)} 
                              placeholder="Ví dụ: Đổi trả trong 30 ngày, freeship toàn quốc..."
                              className="w-full h-[80px] border border-gray-300 rounded-lg p-2 text-xs resize-none bg-white focus:outline-purple-500 leading-relaxed" 
                            />
                          </div>
                        </div>

                        {/* TÙY CHỈNH PHONG CÁCH LIVE & THỜI LƯỢNG AI */}
                        <div className="p-3.5 bg-white rounded-xl border border-purple-200 space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs font-bold text-purple-900 block mb-1">🎭 Phong Cách Livestream Của AI:</label>
                              <select
                                value={currentConfig.aiLiveStyle || 'sales_fast'}
                                onChange={(e) => handleSimpleChange('aiLiveStyle', e.target.value)}
                                className="w-full border border-purple-300 rounded-lg px-2.5 py-1.5 text-xs bg-white font-bold text-purple-900 focus:outline-purple-500 cursor-pointer"
                              >
                                <option value="sales_fast">🔥 Hào Hứng - Năng Động - Chốt Sale Thần Tốc</option>
                                <option value="skincare_expert">🌸 Thân Thiện - Dịu Dàng - Chuyên Gia Mỹ Phẩm / Da Liễu</option>
                                <option value="tiktok_funny">😂 Hài Hước - Duyên Dáng - Bắt Trend TikTok</option>
                                <option value="luxury_elegant">💎 Sang Trọng - Quyến Rũ - Đẳng Cấp Thương Hiệu</option>
                              </select>
                            </div>

                            <div>
                              <label className="text-xs font-bold text-purple-900 block mb-1">⏳ Thời Lượng Phiên Live AI:</label>
                              <div className="flex items-center gap-2">
                                <select
                                  value={currentConfig.aiLiveDuration || 60}
                                  onChange={(e) => handleSimpleChange('aiLiveDuration', Number(e.target.value) || 60)}
                                  className="border border-purple-300 rounded-lg px-2.5 py-1.5 text-xs bg-white font-bold text-purple-900 focus:outline-purple-500 cursor-pointer flex-1"
                                >
                                  <option value="30">30 phút</option>
                                  <option value="60">60 phút (1 tiếng)</option>
                                  <option value="90">90 phút (1.5 tiếng)</option>
                                  <option value="120">120 phút (2 tiếng)</option>
                                  <option value="180">180 phút (3 tiếng)</option>
                                </select>

                                <button
                                  type="button"
                                  onClick={handleGenerateAiScript}
                                  className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm transition-all cursor-pointer shrink-0"
                                >
                                  <Sparkles size={13} /> AI Tạo Kịch Bản
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Kho Tri Thức Văn Bản Chi Tiết (Knowledge Base Raw Content) */}
                        <div>
                          <label className="text-xs font-bold text-gray-700 block mb-1">📝 Kho Tri Thức Dữ Liệu Doanh Nghiệp & Tài Liệu Chuyên Sâu:</label>
                          <textarea 
                            value={currentConfig.companyKnowledgeText || ''} 
                            onChange={(e) => handleSimpleChange('companyKnowledgeText', e.target.value)} 
                            placeholder="Dán toàn bộ tài liệu giới thiệu công ty, cẩm nang sản phẩm, bảng giá, hướng dẫn sử dụng, FAQ tại đây..."
                            className="w-full h-[100px] border border-gray-300 rounded-lg p-2.5 text-xs resize-y bg-white focus:outline-purple-500 font-sans leading-relaxed" 
                          />
                        </div>

                        {/* System Prompt Cho Bộ Não AI */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-xs font-bold text-gray-700">🤖 Kịch Bản Chi Tiết & Phong Cách Chốt Đơn Của AI (System Prompt):</label>
                            <label 
                              htmlFor="upload-ai-prompt-file"
                              className="text-xs text-purple-700 cursor-pointer hover:underline flex items-center gap-1 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 font-bold"
                            >
                              <Upload size={11} /> Tải file kịch bản AI
                            </label>
                            <input 
                              type="file" 
                              id="upload-ai-prompt-file"
                              className="hidden" 
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const reader = new FileReader();
                                reader.onload = (ev) => {
                                  const content = ev.target?.result || '';
                                  handleSimpleChange('aiPrompt', content);
                                };
                                reader.readAsText(file);
                              }} 
                            />
                          </div>
                          <textarea 
                            value={currentConfig.aiPrompt || NEW_AI_PROMPT} 
                            onChange={(e) => handleSimpleChange('aiPrompt', e.target.value)} 
                            className="w-full h-[120px] border border-gray-300 rounded-lg p-2.5 text-xs resize-y bg-white focus:outline-purple-500 font-mono" 
                          />
                        </div>

                        {/* Bộ Nghe Thử Voice AI Tri Thức */}
                        <EventVoiceTester 
                          text={`Dạ em chào bạn {user}! Sản phẩm ${currentConfig.productName || 'Bộ Đôi Serum & Nước Hoa'} của ${currentConfig.companyName || 'shop em'} đang có giá Flash Sale ${currentConfig.productPrice || 'chỉ 890k'}, bạn bấm ngay vào giỏ hàng góc trái màn hình để sở hữu nhé!`}
                          defaultVoiceId="free_vi_female"
                          label="Nghe thử câu tư vấn chốt đơn Bộ Não AI (Mọi Giọng Đọc)"
                          compact={false}
                        />
                      </div>
                    </fieldset>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* ========================================================================= */
            /* 5. BÌNH LUẬN (COMMENTS) & CÁC SỰ KIỆN KHÁC */
            /* ========================================================================= */
            <>
              {/* Cấu hình Chung */}
              <div className="border border-gray-300 rounded-md bg-white mb-3 shadow-sm">
                <div className="relative px-3 py-4">
                  <fieldset className="border border-gray-300 rounded p-4 pt-6 mt-2 relative">
                    <legend className="absolute -top-3 left-3 bg-white px-1 text-sm font-semibold text-gray-700 flex items-center gap-1">
                      Cấu hình Chung - <span className="text-[#a53b3b]"><selectedEventInfo.icon size={14} className={selectedEventInfo.color} /></span> {selectedEventInfo?.label}
                    </legend>
                    
                    <div className="flex flex-col gap-3">
                      
                      {/* BỘ CHỌN CHẾ ĐỘ PHẢN HỒI BÌNH LUẬN (CHỈ DÀNH CHO TAB BÌNH LUẬN) */}
                      {selectedEventId === 'comment' && (
                        <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200 mb-2 space-y-3">
                          <h4 className="text-xs font-black text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkles size={14} className="text-blue-600" /> LỰA CHỌN CHẾ ĐỘ & HÌNH THỨC PHẢN HỒI BÌNH LUẬN
                          </h4>

                          {/* 1. Chế độ phản hồi: AI vs Từ khóa vs Kết hợp */}
                          <div>
                            <label className="text-xs font-bold text-gray-700 block mb-1.5">
                              🎯 1. Chế độ xử lý phản hồi bình luận:
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              {[
                                { id: 'keywords_only', label: '1️⃣ Chỉ Dùng Từ Khóa Có Sẵn', desc: 'Chỉ trả lời khi khớp từ khóa cấu hình' },
                                { id: 'ai_only', label: '2️⃣ Chỉ Dùng AI Gemini', desc: 'AI tự động phân tích và tạo câu trả lời' },
                                { id: 'hybrid', label: '3️⃣ Kết Hợp Thông Minh (Khuyên Dùng)', desc: 'Ưu tiên từ khóa có sẵn -> Tự động dùng AI nếu không khớp' },
                              ].map(mode => (
                                <button
                                  key={mode.id}
                                  type="button"
                                  onClick={() => updateEventConfig('comment', { commentReplyMode: mode.id })}
                                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                                    (currentConfig.commentReplyMode || 'hybrid') === mode.id
                                      ? 'bg-blue-600 text-white border-blue-700 shadow-md font-bold'
                                      : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50/50'
                                  }`}
                                >
                                  <div className="text-xs font-black">{mode.label}</div>
                                  <div className={`text-[10.5px] mt-0.5 ${(currentConfig.commentReplyMode || 'hybrid') === mode.id ? 'text-blue-100' : 'text-gray-500'}`}>
                                    {mode.desc}
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* 2. Hình thức phản hồi: Voice vs Text vs Cả 2 */}
                          <div>
                            <label className="text-xs font-bold text-gray-700 block mb-1.5">
                              🔊 2. Hình thức phản hồi:
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              {[
                                { id: 'voice_only', label: '🗣️ Giọng Đọc Voice (TTS / Audio)', icon: Volume2 },
                                { id: 'text_only', label: '💬 Văn Bản Text (Gửi vào ô chat)', icon: MessageSquare },
                                { id: 'both', label: '🔄 Cả Giọng Đọc Voice + Gửi Text', icon: Sparkles },
                              ].map(fmt => (
                                <button
                                  key={fmt.id}
                                  type="button"
                                  onClick={() => updateEventConfig('comment', { commentResponseFormat: fmt.id })}
                                  className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                                    (currentConfig.commentResponseFormat || 'both') === fmt.id
                                      ? 'bg-purple-600 text-white border-purple-700 shadow-md font-bold'
                                      : 'bg-white text-gray-700 border-gray-300 hover:bg-purple-50/50'
                                  }`}
                                >
                                  <fmt.icon size={14} className={(currentConfig.commentResponseFormat || 'both') === fmt.id ? 'text-white' : 'text-purple-600'} />
                                  <span className="text-xs font-bold">{fmt.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {currentConfig.videoCategory !== undefined && (
                        <div className="flex items-center">
                          <FieldLabel icon="🎥" text="Danh mục video" helpKey="videoCategory" />
                          <input type="text" name="videoCategory" value={currentConfig.videoCategory} onChange={handleChange} className="flex-1 border border-gray-300 rounded px-2 py-1 text-[13px] bg-gray-50 focus:bg-white focus:outline-blue-500" />
                        </div>
                      )}

                      {currentConfig.priority !== undefined && (
                        <div className="flex items-center">
                          <FieldLabel icon="⭐" text="Độ ưu tiên" helpKey="priority" />
                          <input type="number" name="priority" value={currentConfig.priority} onChange={handleChange} className="flex-1 border border-gray-300 rounded px-2 py-1 text-[13px] bg-gray-50 focus:bg-white focus:outline-blue-500" />
                        </div>
                      )}
                      
                      {currentConfig.active !== undefined && (
                        <div className="flex items-center">
                          <FieldLabel icon="✅" text="Kích hoạt" helpKey="active" />
                          <input type="checkbox" name="active" checked={currentConfig.active} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded cursor-pointer" />
                        </div>
                      )}

                      {currentConfig.useVoice !== undefined && selectedEventId !== 'talking' && selectedEventId !== 'idle' && (
                        <div className="flex items-center">
                          <FieldLabel icon="🗣️" text="Dùng giọng nói" helpKey="useVoice" />
                          <input type="checkbox" name="useVoice" checked={currentConfig.useVoice} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded cursor-pointer" />
                        </div>
                      )}

                      {currentConfig.muteSourceVideo !== undefined && selectedEventId !== 'talking' && selectedEventId !== 'idle' && (
                        <div className="flex items-center">
                          <FieldLabel icon="🔇" text="Tắt âm gốc video" helpKey="muteSourceVideo" />
                          <input type="checkbox" name="muteSourceVideo" checked={currentConfig.muteSourceVideo} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded cursor-pointer" />
                        </div>
                      )}

                      {currentConfig.useAi !== undefined && selectedEventId !== 'idle' && selectedEventId !== 'apology' && (
                        <div className="flex items-center">
                          <FieldLabel icon="🧠" text="Dùng AI trả lời" helpKey="useAi" />
                          <input type="checkbox" name="useAi" checked={currentConfig.useAi} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded cursor-pointer" />
                        </div>
                      )}
                      
                      {selectedEventId === 'thanks_heart' && (
                        <div className="flex items-center">
                          <FieldLabel icon="❤️" text="Ngưỡng tim để cảm ơn" helpKey="likeThreshold" />
                          <input type="number" name="likeThreshold" value={currentConfig.likeThreshold} onChange={handleChange} className="flex-1 border border-gray-300 rounded px-2 py-1 text-[13px] bg-gray-50 focus:bg-white focus:outline-blue-500" />
                        </div>
                      )}

                      {(selectedEventId === 'apology' || selectedEventId === 'welcome') && (
                        <div className="flex items-center">
                          <FieldLabel icon="⏱️" text="Số phút để chào" helpKey="greetMinutes" />
                          <input type="number" name="greetMinutes" value={currentConfig.greetMinutes} onChange={handleChange} className="flex-1 border border-gray-300 rounded px-2 py-1 text-[13px] bg-gray-50 focus:bg-white focus:outline-blue-500" />
                        </div>
                      )}

                      {(selectedEventId === 'comment' || selectedEventId === 'follow') && (
                        <div className="flex items-center">
                          <FieldLabel icon="⏳" text={`Chờ giữa các ${selectedEventId === 'comment' ? 'comment' : 'follow'} (giây)`} helpKey="waitBetweenEvents" />
                          <input type="number" name="waitBetweenEvents" value={currentConfig.waitBetweenEvents} onChange={handleChange} className="flex-1 border border-gray-300 rounded px-2 py-1 text-[13px] bg-gray-50 focus:bg-white focus:outline-blue-500" />
                        </div>
                      )}

                      {selectedEventId === 'comment' && (
                        <>
                          <div className="flex items-center mt-1">
                            <FieldLabel icon="📊" text="Tỷ lệ trả lời (%)" helpKey="replyRate" />
                            <input type="number" name="replyRate" value={currentConfig.replyRate} onChange={handleChange} className="flex-1 border border-gray-300 rounded px-2 py-1 text-[13px] bg-gray-50 focus:bg-white focus:outline-blue-500" />
                          </div>
                          <div className="flex items-start mt-1">
                            <FieldLabel icon="🚫" text="Từ khóa cấm" helpKey="bannedWords" />
                            <textarea name="bannedWords" value={currentConfig.bannedWords} onChange={handleChange} className="flex-1 h-[60px] border border-gray-300 rounded p-2 text-[13px] resize-none bg-gray-50 focus:bg-white focus:outline-blue-500" />
                          </div>
                          <div className="flex items-start mt-1">
                            <FieldLabel icon="⭐" text="Từ khóa ưu tiên" helpKey="priorityWords" />
                            <textarea name="priorityWords" value={currentConfig.priorityWords} onChange={handleChange} className="flex-1 h-[60px] border border-gray-300 rounded p-2 text-[13px] resize-none bg-gray-50 focus:bg-white focus:outline-blue-500" />
                          </div>
                          <div className="flex items-center mt-1">
                            <FieldLabel icon="🛡️" text="Bật bộ lọc spam thông minh" helpKey="smartSpamFilter" />
                            <input type="checkbox" name="smartSpamFilter" checked={currentConfig.smartSpamFilter} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded cursor-pointer" />
                          </div>
                          <div className="flex items-center">
                            <FieldLabel icon="⏱️" text="Chờ giữa các comment spam (giây)" helpKey="waitBetweenSpam" />
                            <input type="number" name="waitBetweenSpam" value={currentConfig.waitBetweenSpam} onChange={handleChange} className="flex-1 border border-gray-300 rounded px-2 py-1 text-[13px] bg-gray-50 focus:bg-white focus:outline-blue-500" />
                          </div>
                          <div className="flex items-center">
                            <FieldLabel icon="🔤" text="Tỷ lệ ký tự lặp lại tối đa (0.0-1.0)" helpKey="maxRepeatChars" />
                            <input type="number" step="0.1" name="maxRepeatChars" value={currentConfig.maxRepeatChars} onChange={handleChange} className="flex-1 border border-gray-300 rounded px-2 py-1 text-[13px] bg-gray-50 focus:bg-white focus:outline-blue-500" />
                          </div>
                        </>
                      )}

                      {/* TÍCH HỢP WORKSPACE KEYWORD PANEL CHUẨN ẢNH 3 & ẢNH 4 CHO TAB BÌNH LUẬN */}
                      {selectedEventId === 'comment' && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <WorkspaceKeywordPanel 
                            currentConfig={currentConfig}
                            onUpdateConfig={(partial) => {
                              updateEventConfig(selectedEventId, partial);
                            }}
                          />
                        </div>
                      )}

                      {selectedEventId === 'idle' && (
                        <div className="flex items-center">
                          <FieldLabel icon="⏱️" text="Tự nói sau (giây) im lặng" helpKey="speakAfterIdleSeconds" />
                          <input type="number" name="speakAfterIdleSeconds" value={currentConfig.speakAfterIdleSeconds} onChange={handleChange} className="flex-1 border border-gray-300 rounded px-2 py-1 text-[13px] bg-gray-50 focus:bg-white focus:outline-blue-500" />
                        </div>
                      )}

                      {currentConfig.aiPrompt !== undefined && selectedEventId !== 'idle' && selectedEventId !== 'apology' && selectedEventId !== 'welcome' && (
                        <div className="flex items-start mt-2">
                          <FieldLabel icon="✍️" text="Kịch bản cho AI" helpKey="aiPrompt" />
                          <textarea name="aiPrompt" value={currentConfig.aiPrompt} onChange={handleChange} className="flex-1 min-h-[120px] border border-gray-300 rounded p-2 text-[13px] resize-none bg-gray-50 focus:bg-white focus:outline-blue-500" />
                        </div>
                      )}

                      {currentConfig.sampleAnswers !== undefined && selectedEventId !== 'idle' && (
                        <div className="flex flex-col gap-2 mt-2">
                          <div className="flex items-start">
                            <FieldLabel icon="📄" text="Câu trả lời mẫu (mỗi câu 1 dòng)" helpKey="sampleAnswers" />
                            <textarea name="sampleAnswers" value={currentConfig.sampleAnswers} onChange={handleChange} className="flex-1 min-h-[90px] border border-gray-300 rounded p-2 text-[13px] resize-none bg-gray-50 focus:bg-white focus:outline-blue-500" />
                          </div>
                          <div className="ml-0 sm:ml-[220px]">
                            <EventVoiceTester 
                              text={currentConfig.sampleAnswers || 'Xin chào và cảm ơn bạn đã tương tác cùng phiên livestream nhé!'}
                              defaultVoiceId={selectedEventId === 'checkout' ? 'free_vi_female' : selectedEventId === 'follow' ? 'free_vi_female2' : 'free_vi_female'}
                              label={`Nghe thử câu thoại mẫu (${selectedEventInfo?.label || 'Sự kiện'})`}
                              compact={false}
                            />
                          </div>
                        </div>
                      )}
                      
                      {selectedEventId === 'talking' && (
                        <>
                          <div className="flex items-center mt-2">
                            <FieldLabel icon="🗣️" text="Dùng giọng nói" helpKey="useVoice" />
                            <input type="checkbox" name="useVoice" checked={currentConfig.useVoice} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded cursor-pointer" />
                          </div>
                          <div className="flex items-center">
                            <FieldLabel icon="🔇" text="Tắt âm gốc video" helpKey="muteSourceVideo" />
                            <input type="checkbox" name="muteSourceVideo" checked={currentConfig.muteSourceVideo} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded cursor-pointer" />
                          </div>
                        </>
                      )}

                    </div>
                  </fieldset>
                </div>
              </div>

              {/* Cấu hình Video Chung & Video Nền Hỗ Trợ Phiên Live */}
              <div className="border border-gray-300 rounded-md bg-white mb-3 shadow-sm px-3 py-4">
                <fieldset className="border border-gray-300 rounded p-4 pt-4 mt-2 relative">
                  <legend className="absolute -top-3 left-3 bg-white px-1 text-sm font-semibold text-gray-700 flex items-center gap-1">
                    <span>🎬 Cấu hình Video Chính & Video Nền Hỗ Trợ Phiên Live</span>
                    <HelpTooltip helpKey="videoFolder" />
                  </legend>
                  <div className="flex flex-col gap-3.5">
                    <div className="flex items-center gap-4">
                      <span className="text-[13px] text-[#a53b3b] font-semibold min-w-[200px]">Danh mục video cho sự kiện này:</span>
                      <select name="videoCategory" value={currentConfig.videoCategory} onChange={handleChange} className="flex-1 border border-gray-300 rounded px-2 py-1 text-[13px] bg-white focus:outline-blue-500 cursor-pointer">
                        <option value={currentConfig.videoCategory}>{currentConfig.videoCategory}</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center justify-between border-t border-gray-200 pt-3">
                      <div className="flex items-center gap-4">
                        <span className="text-[13px] text-[#a53b3b] font-semibold min-w-[200px]">Thư mục video hành động:</span>
                        <span className="text-[13px] text-gray-800 font-medium truncate max-w-sm bg-gray-50 px-2 py-0.5 rounded border border-gray-200">{currentConfig.videoFolder || 'Chưa chọn thư mục'}</span>
                      </div>
                      <button onClick={() => selectFolder('videoFolder')} className="text-[13px] text-blue-600 font-semibold hover:text-blue-800 transition-colors underline decoration-dotted cursor-pointer">
                        Chọn thư mục...
                      </button>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-200 pt-3">
                      <div className="flex items-center gap-4">
                        <span className="text-[13px] text-[#1e40af] font-semibold min-w-[200px]">Thư mục video nền hỗ trợ:</span>
                        <span className="text-[13px] text-gray-800 font-medium truncate max-w-sm bg-gray-50 px-2 py-0.5 rounded border border-gray-200">{currentConfig.supportVideoFolder || 'Chưa chọn (Dùng video nền mặc định)'}</span>
                      </div>
                      <button onClick={() => selectFolder('supportVideoFolder')} className="text-[13px] text-indigo-600 font-semibold hover:text-indigo-800 transition-colors underline decoration-dotted cursor-pointer">
                        Chọn video nền...
                      </button>
                    </div>
                  </div>
                </fieldset>
              </div>

              {currentConfig.assistantPrompt !== undefined && (
                <div className="border border-gray-300 rounded-md bg-white shadow-sm px-3 py-4 mb-4">
                  <fieldset className="border border-gray-300 rounded p-4 pt-4 mt-2 relative">
                    <legend className="absolute -top-3 left-3 bg-white px-1 text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <input type="checkbox" className="w-3.5 h-3.5" checked readOnly />
                      <span>Cài đặt Trợ lý</span>
                      <HelpTooltip helpKey="useAssistant" />
                    </legend>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-1">
                        <label className="text-[13px] text-gray-700 font-semibold">Câu mẫu của Trợ lý:</label>
                        <HelpTooltip helpKey="assistantPrompt" />
                      </div>
                      <textarea 
                        name="assistantPrompt" value={currentConfig.assistantPrompt} onChange={handleChange}
                        className="w-full h-[80px] border border-gray-300 rounded p-2 text-[13px] resize-none bg-gray-50 focus:bg-white focus:outline-blue-500" 
                      />
                      <EventVoiceTester 
                        text={currentConfig.assistantPrompt || 'Dạ vâng, cảm ơn mọi người đã theo dõi live nha!'}
                        defaultVoiceId="free_vi_female2"
                        label={`Nghe thử câu Trợ lý (${selectedEventInfo?.label || 'Sự kiện'})`}
                        compact={false}
                      />
                      <label className="flex items-center gap-2 justify-center mt-2 cursor-pointer">
                        <input type="checkbox" name="assistantUseMainVoice" checked={currentConfig.assistantUseMainVoice} onChange={handleChange} className="w-4 h-4 rounded cursor-pointer" />
                        <span className="text-[13px] text-gray-600 font-medium">Dùng giọng của nhân vật chính</span>
                        <HelpTooltip helpKey="assistantUseMainVoice" />
                      </label>
                    </div>
                  </fieldset>
                </div>
              )}
            </>
          )}

        </div>

        {/* Footer Save & Export/Import Buttons */}
        <div className="mt-3 flex flex-col sm:flex-row gap-2">
          <button 
            onClick={handleSave}
            className="flex-1 py-3 bg-[#4caf50] hover:bg-[#43a047] text-white font-bold rounded-xl shadow transition-colors text-[14px] uppercase tracking-wide flex justify-center items-center gap-2 cursor-pointer"
          >
            <CheckSquare size={18} /> Lưu cấu hình sự kiện
          </button>
          <button 
            onClick={handleExportEvents}
            title="Lưu cấu hình sự kiện thành file mới để dùng lại bất kỳ lúc nào"
            className="px-4 py-3 bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-200 border border-cyan-500/40 font-bold rounded-xl shadow transition-all text-xs flex justify-center items-center gap-1.5 cursor-pointer"
          >
            <Download size={16} /> Xuất File Mới
          </button>
          <label 
            title="Nạp file cấu hình sự kiện đã lưu trước đó"
            className="px-4 py-3 bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 font-bold rounded-xl shadow transition-all text-xs flex justify-center items-center gap-1.5 cursor-pointer"
          >
            <Upload size={16} /> Nạp File
            <input type="file" accept=".json" className="hidden" onChange={handleImportEvents} />
          </label>
        </div>

      </div>
    </div>
  );
}
