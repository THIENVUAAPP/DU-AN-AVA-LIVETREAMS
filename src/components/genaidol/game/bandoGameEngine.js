import { io } from 'socket.io-client';
import bandoAudio from './bandoAudioEngine';
import { mapVoiceEngine } from './gameVoiceEngine';
import { WORLD_COUNTRIES, COUNTRIES_BY_ID, CONTINENTS } from './worldCountriesData';
import { BannerFlagCellsEngine } from './bannerFlagCellsEngine';
import { getGiftConfig, saveGiftConfig, REGIONAL_FLAG_GIFTS, DEFAULT_STANDARD_GIFTS } from '../../../utils/giftSyncService';
import defaultVietnamMask from '../../../data/vietnamMask.json';
import defaultProvincesData from '../../../data/provinces.json';

// Phân loại ô cờ theo 3 miền Bắc - Trung - Nam dựa trên danh sách tỉnh thành hoặc toạ độ Y
export const NORTH_PROVINCES = new Set([
  'ha-noi', 'hai-phong', 'lai-chau', 'dien-bien', 'son-la', 'hoa-binh', 'lao-cai', 'yen-bai',
  'phu-tho', 'tuyen-quang', 'ha-giang', 'cao-bang', 'bac-kan', 'lang-son', 'quang-ninh',
  'thai-nguyen', 'bac-giang', 'bac-ninh', 'hung-yen', 'hai-duong', 'nam-dinh', 'thai-binh',
  'ha-nam', 'ninh-binh', 'vinh-phuc'
]);

export const CENTRAL_PROVINCES = new Set([
  'thanh-hoa', 'nghe-an', 'ha-tinh', 'quang-binh', 'quang-tri', 'hue', 'thua-thien-hue',
  'da-nang', 'quang-nam', 'quang-ngai', 'binh-dinh', 'phu-yen', 'khanh-hoa', 'ninh-thuan',
  'binh-thuan', 'kon-tum', 'gia-lai', 'dak-lak', 'dak-nong', 'lam-dong', 'hoang-sa'
]);

export const SOUTH_PROVINCES = new Set([
  'ho-chi-minh', 'binh-phuoc', 'binh-duong', 'dong-nai', 'tay-ninh', 'ba-ria-vung-tau',
  'long-an', 'dong-thap', 'tien-giang', 'an-giang', 'ben-tre', 'vinh-long', 'tra-vinh',
  'hau-giang', 'kien-giang', 'soc-trang', 'bac-lieu', 'ca-mau', 'can-tho', 'truong-sa', 'phu-quoc'
]);

export function getRegionForCell(cell) {
  if (!cell) return 'central';
  const pid = (cell.provinceId || '').toLowerCase();
  if (NORTH_PROVINCES.has(pid)) return 'north';
  if (CENTRAL_PROVINCES.has(pid)) return 'central';
  if (SOUTH_PROVINCES.has(pid)) return 'south';
  if (cell.y < 165) return 'north';
  if (cell.y < 280) return 'central';
  return 'south';
}

// Tọa độ tâm điểm và tỉnh thành cốt lõi cho 3 Miền (Bắc - Trung - Nam)
export const REGION_CONFIG = {
  north: {
    id: 'north',
    name: 'Miền Bắc',
    icon: '🏔️',
    centerGrid: { x: 97.3, y: 67.3 },     // Trung tâm Thủ Đô Hà Nội
    centerWorld: { wx: -52.7, wz: -127.2 },
    preferredProvinces: ['ha-noi', 'hai-phong', 'bac-ninh', 'hai-duong', 'hung-yen', 'vinh-phuc', 'phu-tho', 'nam-dinh', 'ninh-binh']
  },
  central: {
    id: 'central',
    name: 'Miền Trung',
    icon: '🌊',
    centerGrid: { x: 145.3, y: 199.0 },   // Trung tâm Đà Nẵng / Huế
    centerWorld: { wx: -4.7, wz: 4.5 },
    preferredProvinces: ['da-nang', 'hue', 'thua-thien-hue', 'quang-nam', 'quang-ngai', 'binh-dinh', 'phu-yen', 'khanh-hoa']
  },
  south: {
    id: 'south',
    name: 'Miền Nam',
    icon: '🌴',
    centerGrid: { x: 122.4, y: 320.9 },   // Trung tâm TP. Hồ Chí Minh & Đất liền Đông Nam Bộ
    centerWorld: { wx: -27.6, wz: 126.4 },
    preferredProvinces: ['ho-chi-minh', 'binh-duong', 'dong-nai', 'long-an', 'ba-ria-vung-tau', 'tien-giang', 'tay-ninh', 'can-tho']
  }
};

// Danh mục quà TikTok chuẩn quy đổi số ô cờ từ Kho Quà TikTok Live
export const DEFAULT_MAP_GIFTS = [
  // 1. Quà 5 Xu Riêng Biệt Cho 3 Vùng Miền (Bắc - Trung - Nam)
  { id: 'gift_region_north', name: 'Ngón Tay Tim (Miền Bắc)', icon: '🫰', cells: 5, color: '#ef4444', tier: 'common', priceToken: 5, regionTarget: 'north', desc: 'Tặng 5 xu cắm cờ khu vực Miền Bắc' },
  { id: 'gift_region_central', name: 'Bánh Donut (Miền Trung)', icon: '🍩', cells: 5, color: '#f59e0b', tier: 'common', priceToken: 5, regionTarget: 'central', desc: 'Tặng 5 xu cắm cờ khu vực Miền Trung' },
  { id: 'gift_region_south', name: 'Gấu Con (Miền Nam)', icon: '🧸', cells: 5, color: '#10b981', tier: 'common', priceToken: 5, regionTarget: 'south', desc: 'Tặng 5 xu cắm cờ khu vực Miền Nam' },

  // 2. Phổ biến (1 - 10 xu)
  { id: 'flag_vn', name: 'Cờ Tổ Quốc', icon: '🇻🇳', cells: 1, color: '#dc2626', tier: 'common', priceToken: 1 },
  { id: 'rose', name: 'Hoa Hồng', icon: '🌹', cells: 1, color: '#f43f5e', tier: 'common', priceToken: 1 },
  { id: 'very_good', name: 'Rất Tốt', icon: '👍', cells: 1, color: '#f59e0b', tier: 'common', priceToken: 1 },
  { id: 'birthday_cake', name: 'Bánh Sinh Nhật', icon: '🍰', cells: 1, color: '#ec4899', tier: 'common', priceToken: 1 },
  { id: 'dallah', name: 'Dallah Chào Mừng', icon: '🫖', cells: 1, color: '#06b6d4', tier: 'common', priceToken: 1 },
  { id: 'heart_tap', name: 'Thả Tim', icon: '🧡', cells: 1, color: '#f97316', tier: 'common', priceToken: 1 },
  { id: 'heart_shot', name: 'Bắn Tim', icon: '🫰', cells: 1, color: '#ef4444', tier: 'common', priceToken: 1 },
  { id: 'peach', name: 'Quả Đào', icon: '🍑', cells: 5, color: '#fb7185', tier: 'common', priceToken: 5 },
  { id: 'bing_chilling', name: 'Bing Chilling', icon: '🍦', cells: 5, color: '#38bdf8', tier: 'common', priceToken: 5 },
  { id: 'spin_ball', name: 'Trái Bóng Xoáy', icon: '⚽', cells: 5, color: '#10b981', tier: 'common', priceToken: 5 },
  { id: 'magic_fingers', name: 'Ngón Tay Thần Thánh', icon: '🤲', cells: 6, color: '#8b5cf6', tier: 'common', priceToken: 6 },
  { id: 'helmet', name: 'Mũ Cối Yêu Nước', icon: '🪖', cells: 10, color: '#15803d', tier: 'common', priceToken: 10 },
  { id: 'flower_bouquet', name: 'Bó Hoa', icon: '💐', cells: 10, color: '#f43f5e', tier: 'common', priceToken: 10 },

  // 2. Hiếm (20 - 499 xu)
  { id: 'tea', name: 'Trà Đào', icon: '☕', cells: 20, color: '#f59e0b', tier: 'rare', priceToken: 20 },
  { id: 'perfume', name: 'Nước Hoa Hương Tình Yêu', icon: '🌸', cells: 50, color: '#d946ef', tier: 'rare', priceToken: 50 },
  { id: 'tank_390', name: 'Xe Tăng 390', icon: '🎖️', cells: 99, color: '#ca8a04', tier: 'rare', priceToken: 99 },
  { id: 'crown', name: 'Vương Miện', icon: '👑', cells: 99, color: '#f59e0b', tier: 'rare', priceToken: 99 },
  { id: 'corgi', name: 'Corgi Đáng Yêu', icon: '🐶', cells: 100, color: '#eab308', tier: 'rare', priceToken: 100 },
  { id: 'free_music', name: 'Nhạc Tự Do', icon: '🎹', cells: 100, color: '#14b8a6', tier: 'rare', priceToken: 100 },
  { id: 'rhythm_robot', name: 'Robot Nhịp Điệu', icon: '🤖', cells: 199, color: '#06b6d4', tier: 'rare', priceToken: 199 },
  { id: 'boom_drum', name: 'Trống Bùng Nổ', icon: '🥁', cells: 249, color: '#eab308', tier: 'rare', priceToken: 249 },
  { id: 'romantic_cello', name: 'Cello Lãng Mạn', icon: '🎻', cells: 299, color: '#e11d48', tier: 'rare', priceToken: 299 },
  { id: 'firework_indep', name: 'Pháo Hoa Độc Lập', icon: '🎆', cells: 299, color: '#f43f5e', tier: 'rare', priceToken: 299 },
  { id: 'chopin_rain', name: 'Chopin Trong Mưa', icon: '🌂', cells: 349, color: '#64748b', tier: 'rare', priceToken: 349 },
  { id: 'lead_singer_bear', name: 'Gấu Hát Chính', icon: '🐻', cells: 399, color: '#f59e0b', tier: 'rare', priceToken: 399 },
  { id: 'sage_pea', name: 'Sage Hạt Đậu Thần Kỳ', icon: '🫐', cells: 399, color: '#3b82f6', tier: 'rare', priceToken: 399 },
  { id: 'pop_parrot', name: 'Vẹt Ca Sĩ Pop', icon: '🦜', cells: 400, color: '#06b6d4', tier: 'rare', priceToken: 400 },
  { id: 'cat_trumpet', name: 'Kèn Trumpet Mèo', icon: '🎺', cells: 449, color: '#ec4899', tier: 'rare', priceToken: 449 },

  // 3. Sử thi (500 - 2,999 xu)
  { id: 'alluring_sax', name: 'Tiếng Sax Quyến Rũ', icon: '🎷', cells: 700, color: '#a855f7', tier: 'epic', priceToken: 700 },
  { id: 'dong_son_drum', name: 'Trống Đồng Đông Sơn', icon: '🏛️', cells: 999, color: '#eab308', tier: 'epic', priceToken: 999 },
  { id: 'colorful_ribbon', name: 'Ruy Băng Khoe Sắc', icon: '✨', cells: 1000, color: '#fbbf24', tier: 'epic', priceToken: 1000 },
  { id: 'racetrack_launch', name: 'Ra Mắt Đường Đua', icon: '🏎️', cells: 1500, color: '#ef4444', tier: 'epic', priceToken: 1500 },
  { id: 'healing_hug', name: 'Cái Ôm Chữa Lành', icon: '🫂', cells: 1600, color: '#c084fc', tier: 'epic', priceToken: 1600 },
  { id: 'truong_sa_landmark', name: 'Cột Mốc Trường Sa', icon: '⚓', cells: 1999, color: '#0284c7', tier: 'epic', priceToken: 1999 },
  { id: 'tanuki_nut', name: 'Hạt Dẻ Tanuki', icon: '🌰', cells: 1999, color: '#d97706', tier: 'epic', priceToken: 1999 },
  { id: 'rocky_punch', name: 'Cú Đấm Của Rocky', icon: '🥊', cells: 1999, color: '#dc2626', tier: 'epic', priceToken: 1999 },
  { id: 'interplanetary', name: 'Thám Hiểm Liên Hành Tinh', icon: '🧑‍🚀', cells: 1999, color: '#38bdf8', tier: 'epic', priceToken: 1999 },
  { id: 'heart_land', name: 'Vùng Đất Trái Tim', icon: '🏝️', cells: 2199, color: '#f43f5e', tier: 'epic', priceToken: 2199 },
  { id: 'sage_xubot', name: 'XuBot Của Sage', icon: '🪙', cells: 2199, color: '#0ea5e9', tier: 'epic', priceToken: 2199 },
  { id: 'honor_star', name: 'Ngôi Sao Danh Dự', icon: '⭐', cells: 2200, color: '#8b5cf6', tier: 'epic', priceToken: 2200 },
  { id: 'motorcycle', name: 'Xe Máy', icon: '🏍️', cells: 2988, color: '#10b981', tier: 'epic', priceToken: 2988 },
  { id: 'icecream_truck', name: 'Xe Tải Bán Kem', icon: '🚚', cells: 2988, color: '#06b6d4', tier: 'epic', priceToken: 2988 },
  { id: 'rhythm_bear', name: 'Gấu Nhịp Điệu', icon: '🧸', cells: 2999, color: '#b45309', tier: 'epic', priceToken: 2999 },
  { id: 'contest_fan', name: 'Tín Đồ Thi Đấu', icon: '🏆', cells: 2999, color: '#e11d48', tier: 'epic', priceToken: 2999 },
  { id: 'party_bus', name: 'Xe Buýt Tiệc Tùng', icon: '🚌', cells: 2999, color: '#f59e0b', tier: 'epic', priceToken: 2999 },

  // 4. Huyền thoại (3,000 - 15,999 xu)
  { id: 'hiphop_chicken', name: 'Chú Gà Hip-Hop', icon: '🐔', cells: 3200, color: '#ec4899', tier: 'legendary', priceToken: 3200 },
  { id: 'private_jet', name: 'Chuyên Cơ', icon: '✈️', cells: 4888, color: '#facc15', tier: 'legendary', priceToken: 4888 },
  { id: 'hero_spaceship', name: 'Tàu Không Gian Anh Hùng', icon: '🛸', cells: 4999, color: '#06b6d4', tier: 'legendary', priceToken: 4999 },
  { id: 'golden_dragon', name: 'Rồng Vàng Thăng Long', icon: '🐉', cells: 5000, color: '#eab308', tier: 'legendary', priceToken: 5000 },
  { id: 'star_heroes_stage', name: 'Sân Khấu Star Heroes', icon: '🎪', cells: 5999, color: '#f59e0b', tier: 'legendary', priceToken: 5999 },
  { id: 'solid_finish', name: 'Vững Vàng Về Đích', icon: '🏁', cells: 6000, color: '#3b82f6', tier: 'legendary', priceToken: 6000 },
  { id: 'rust_reborn', name: 'Rust Tái Sinh', icon: '🤖', cells: 6000, color: '#64748b', tier: 'legendary', priceToken: 6000 },
  { id: 'work_hard_play_hard', name: 'Làm Hết Sức Chơi Hết Mình', icon: '🎉', cells: 6000, color: '#8b5cf6', tier: 'legendary', priceToken: 6000 },
  { id: 'lili_leopard', name: 'Báo Đốm Lili', icon: '🐆', cells: 6599, color: '#f43f5e', tier: 'legendary', priceToken: 6599 },
  { id: 'rust_vs_world', name: 'Rust vs Thế Giới', icon: '⚔️', cells: 9999, color: '#dc2626', tier: 'legendary', priceToken: 9999 },
  { id: 'sunset_racetrack', name: 'Đường Đua Hoàng Hôn', icon: '🏎️', cells: 10000, color: '#f97316', tier: 'legendary', priceToken: 10000 },
  { id: 'superstar', name: 'Siêu Sao', icon: '🌟', cells: 12000, color: '#eab308', tier: 'legendary', priceToken: 12000 },
  { id: 'meteor_shower', name: 'Mưa Sao Băng Kìa!', icon: '🌠', cells: 15000, color: '#6366f1', tier: 'legendary', priceToken: 15000 },
  { id: 'space_party', name: 'Tiệc Tùng Không Gian', icon: '👾', cells: 15000, color: '#a855f7', tier: 'legendary', priceToken: 15000 },
  { id: 'rosary_nebula', name: 'Tinh Vân Mân Khôi', icon: '🌌', cells: 15000, color: '#ec4899', tier: 'legendary', priceToken: 15000 },
  { id: 'future_journey', name: 'Hành Trình Tương Lai', icon: '🚀', cells: 15000, color: '#06b6d4', tier: 'legendary', priceToken: 15000 },
  { id: 'stadium', name: 'Sân Vận Động', icon: '🏟️', cells: 15999, color: '#0ea5e9', tier: 'legendary', priceToken: 15999 },

  // 5. Thần thoại & Tuyệt phẩm (17,000 - 44,999 xu)
  { id: 'amusement_park', name: 'Công Viên Giải Trí', icon: '🎡', cells: 17000, color: '#ec4899', tier: 'mythic', priceToken: 17000 },
  { id: 'tiktok_shuttle', name: 'Tàu Con Thoi TikTok', icon: '🚀', cells: 20000, color: '#f43f5e', tier: 'mythic', priceToken: 20000 },
  { id: 'glory_target', name: 'Mục Tiêu Vinh Quang', icon: '🏆', cells: 21500, color: '#eab308', tier: 'mythic', priceToken: 21500 },
  { id: 'phoenix', name: 'Phoenix Phượng Hoàng', icon: '🦅', cells: 25999, color: '#ea580c', tier: 'mythic', priceToken: 25999 },
  { id: 'adam_dream', name: 'Giấc Mơ Của Adam', icon: '💫', cells: 25999, color: '#38bdf8', tier: 'mythic', priceToken: 25999 },
  { id: 'holy_dragon_flame', name: 'Ngọn Lửa Rồng Thiêng', icon: '🐲', cells: 26999, color: '#dc2626', tier: 'divine', priceToken: 26999 },
  { id: 'lion_king', name: 'Sư Tử', icon: '🦁', cells: 29999, color: '#f59e0b', tier: 'divine', priceToken: 29999 },
  { id: 'leon_and_lion', name: 'Leon và Sư Tử', icon: '👑🦁', cells: 34000, color: '#eab308', tier: 'divine', priceToken: 34000 },
  { id: 'tiktok_stars', name: 'TikTok Stars', icon: '✨💫', cells: 39999, color: '#ec4899', tier: 'divine', priceToken: 39999 },
  { id: 'tiktok_universe', name: 'TikTok Universe', icon: '🪐🌌', cells: 44999, color: '#8b5cf6', tier: 'divine', priceToken: 44999 },
];

export const MOCK_WARRIORS_POOL = [
  { id: '@vietnam_vo_dich', username: 'Chiến Binh Áo Đỏ 🇻🇳', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
  { id: '@hanoi_pho_co', username: 'Thủ Đô Trái Tim 🏛️', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100' },
  { id: '@danang_song_han', username: 'Rồng Vàng Miền Trung 🌊', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100' },
  { id: '@saigon_pho_hoa', username: 'Thành Phố Bác 🏙️', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100' },
  { id: '@cantho_song_nuoc', username: 'Chín Rồng Miền Tây 🌾', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
  { id: '@hoang_sa_truong_sa', username: 'Hải Quân Biển Đảo ⚓', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' },
  { id: '@dong_a_hao_khi', username: 'Hào Khí Đông A ⚔️', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100' },
  { id: '@lac_hong_bat_diet', username: 'Dòng Máu Lạc Hồng 🦅', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100' },
  { id: '@tay_nguyen_hung_vi', username: 'Đại Ngàn Tây Nguyên 🐘', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100' },
  { id: '@ha_long_ky_quan', username: 'Vịnh Rồng Hạ Long 🐉', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100' },
  { id: '@fansipan_noc_nha', username: 'Đỉnh Fansipan 3143m 🏔️', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100' },
  { id: '@phu_quoc_ngoc_bien', username: 'Đảo Ngọc Phú Quốc 🏝️', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
  { id: '@nam_quoc_son_ha', username: 'Nam Quốc Sơn Hà 📜', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100' },
  { id: '@bach_dang_giang', username: 'Sóng Bạch Đằng Giang 🚩', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' },
  { id: '@phu_dong_thien_vuong', username: 'Phù Đổng Thiên Vương ⚡', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
  { id: '@nguyen_hue_ao_vai', username: 'Chiến Tướng Tây Sơn 🐎', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100' },
  { id: '@hai_ba_trung', username: 'Nữ Tướng Trưng Vương 🌸', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100' },
  { id: '@tran_hung_dao', username: 'Quốc Công Tiết Chế 🛡️', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100' },
  { id: '@dien_bien_phu', username: 'Lừng Lẫy Điện Biên 🌟', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100' },
  { id: '@co_do_hue', username: 'Cố Đô Sông Hương 🏮', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100' },
  { id: '@ca_mau_mui_dat', username: 'Đất Mũi Cà Mau 🧭', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100' },
  { id: '@lung_cu_ha_giang', username: 'Cột Cờ Lũng Cú 🚩', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100' },
  { id: '@truong_son_dong', username: 'Huyền Thoại Trường Sơn 🌲', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' },
  { id: '@non_nuoc_cao_bang', username: 'Non Nước Cao Bằng 🌄', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
  { id: '@lang_sen_nghe_an', username: 'Làng Sen Quê Bác 🪷', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100' },
  { id: '@bac_ninh_quan_ho', username: 'Quan Họ Kinh Bắc 🎭', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100' },
  { id: '@hoi_an_hoai_pho', username: 'Phố Cổ Hội An 🪔', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
  { id: '@mui_ne_phan_thiet', username: 'Đồi Cát Bay 🏜️', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100' },
  { id: '@nha_trang_bien_xanh', username: 'Vịnh Nha Trang 🐬', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100' },
  { id: '@da_lat_ngan_hoa', username: 'Đà Lạt Ngàn Hoa 🌹', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100' },
  { id: '@an_giang_that_son', username: 'Thất Sơn Bảy Núi ⛰️', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100' },
  { id: '@kien_giang_ha_tien', username: 'Thập Cảnh Hà Tiên 🌴', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100' },
  { id: '@quang_ninh_than_vang', username: 'Đất Mỏ Quảng Ninh 💎', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100' },
  { id: '@vinh_phuc_tam_dao', username: 'Sương Mờ Tam Đảo ☁️', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100' },
  { id: '@son_la_tay_bac', username: 'Hoa Ban Tây Bắc 🌸', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' },
];

export const HONOR_TIERS = [
  { id: 'novice', name: 'Tân Thủ Cắm Cờ', minCells: 1, icon: '🌱', color: '#94a3b8' },
  { id: 'bronze', name: 'Chiến Binh Đồng', minCells: 50, icon: '🥉', color: '#cd7f32' },
  { id: 'silver', name: 'Hiệp Sĩ Bạc', minCells: 200, icon: '🥈', color: '#94a3b8' },
  { id: 'gold', name: 'Tướng Quân Vàng', minCells: 500, icon: '🥇', color: '#eab308' },
  { id: 'diamond', name: 'Chủ Soái Kim Cương', minCells: 1500, icon: '💎', color: '#38bdf8' },
  { id: 'supreme', name: 'Đại Thần Quốc Gia', minCells: 5000, icon: '👑', color: '#f43f5e' },
];

export function getHonorTier(cells) {
  let matched = HONOR_TIERS[0];
  for (const tier of HONOR_TIERS) {
    if (cells >= tier.minCells) matched = tier;
  }
  return matched;
}

export const COUNTRY_PRESETS = COUNTRIES_BY_ID;
export { WORLD_COUNTRIES, CONTINENTS };

const STORAGE_KEY_CONFIG = 'aidol_bando_custom_config_v4';
const STORAGE_KEY_COUNTRIES = 'aidol_bando_countries_custom_v4';

// Helper khử trùng lặp nhãn địa danh & hiệu chỉnh toạ độ chính xác
function sanitizeMapLabels(labels) {
  if (!Array.isArray(labels)) return [];
  const seenTexts = new Set();
  const result = [];
  for (const item of labels) {
    if (!item || !item.text) continue;
    const norm = item.text.trim().toLowerCase();
    if (!seenTexts.has(norm)) {
      seenTexts.add(norm);

      let targetWx = item.wx ?? 0;
      let targetWy = item.wy ?? 4.0;
      let targetWz = item.wz ?? 0;

      // Tự động định vị chuẩn xác Hà Nội ngay trung tâm tỉnh thành trên đất liền
      if (norm.includes('hà nội')) {
        targetWx = -49.2;
        targetWy = 4.0;
        targetWz = -123.0;
      }

      result.push({
        id: item.id || `lbl_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        text: item.text.trim(),
        wx: targetWx,
        wy: targetWy,
        wz: targetWz,
        color: item.color || '#facc15',
        glow: item.glow !== false
      });
    }
  }
  return result;
}

class BanDoGameEngine {
  constructor() {
    this.maskData = null;
    this.provincesData = [];
    this.isLoaded = false;
    this.listeners = new Set();
    this.broadcastChannel = null;
    this.socket = null;
    this._lastSyncTimestamp = 0;
    this._isApplyingRemoteSync = false;
    
    this.cellRenderQueue = [];
    this.reservedCellIds = new Set();
    this.queueTimer = null;
    this.processedGiftSignatures = new Map();
    this.processedCommentSignatures = new Map();

    // 1. KẾT NỐI SOCKET.IO ĐỒNG BỘ THỜI GIAN THỰC (Cho OBS Studio, TikTok LIVE Studio, Browser Sources)
    if (typeof window !== 'undefined') {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const customBackend = urlParams.get('backend') || localStorage.getItem('aidol_backend_url');
        let backendUrl = '';
        const hostname = (window.location.hostname || '').toLowerCase();
        const isTunnelOrCloud = hostname.includes('trycloudflare.com') || hostname.includes('vercel.app') || hostname.includes('loca.lt') || hostname.includes('ngrok') || hostname.includes('serveo.net');
        if (customBackend && customBackend.startsWith('http')) {
          backendUrl = customBackend;
        } else if (isTunnelOrCloud) {
          backendUrl = window.location.origin;
        } else {
          backendUrl = `${window.location.protocol}//${window.location.hostname}:3001`;
        }

        this.socket = io(backendUrl, {
          transports: ['websocket', 'polling'],
          reconnection: true,
          reconnectionAttempts: Infinity,
          reconnectionDelay: 1000,
          timeout: 10000
        });

        this.socket.on('bando_sync', (remoteState) => {
          if (remoteState && !this._isApplyingRemoteSync) {
            this.applyRemoteState(remoteState);
          }
        });

        this.socket.on('tiktok_gift', (giftData) => {
          if (giftData) {
            this.processGift(giftData);
          }
        });

        this.socket.on('tiktok_chat', (chatData) => {
          if (chatData) {
            this.processComment(chatData.comment || chatData.text, {
              id: chatData.userId || chatData.uniqueId || 'chat_user',
              username: chatData.nickname || chatData.username || 'Khán Giả',
              avatar: chatData.profilePictureUrl || chatData.avatar || ''
            });
          }
        });
      } catch (err) {
        console.warn('[bandoGameEngine] Socket.io init warning:', err);
      }
    }

    if (typeof BroadcastChannel !== 'undefined') {
      try {
        this.broadcastChannel = new BroadcastChannel('avalive_bando_stage');
        this.broadcastChannel.onmessage = (e) => {
          if (!e.data) return;
          if (e.data.type === 'BANDO_STATE_UPDATE' && e.data.state) {
            this.applyRemoteState(e.data.state, e.data.lastEvent);
          } else if (e.data.type === 'REQUEST_BANDO_STATE') {
            if (this.broadcastChannel && !this._isApplyingRemoteSync) {
              this.broadcastChannel.postMessage({
                type: 'BANDO_STATE_UPDATE',
                state: this.state,
                lastEvent: null,
                ts: Date.now()
              });
            }
          }
        };

        // Gửi yêu cầu xin state từ tab host nếu đây là tab overlay vừa mở
        this.broadcastChannel.postMessage({ type: 'REQUEST_BANDO_STATE' });
      } catch (e) {}
    }

    if (typeof window !== 'undefined') {
      // 1. Storage event listener (cho các tab khác)
      window.addEventListener('storage', (e) => {
        if (e.key === 'avalive_bando_realtime_sync' && e.newValue) {
          try {
            const parsed = JSON.parse(e.newValue);
            if (parsed.state && parsed.ts && parsed.ts !== this._lastSyncTimestamp) {
              this._lastSyncTimestamp = parsed.ts;
              this.applyRemoteState(parsed.state, parsed.lastEvent);
            }
          } catch (err) {}
        }
      });

      // 2. Heartbeat polling 150ms cho Chromium Embedded Framework (TikTok LIVE Studio / OBS Browser Source)
      setInterval(() => {
        try {
          const raw = localStorage.getItem('avalive_bando_realtime_sync');
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed.state && parsed.ts && parsed.ts !== this._lastSyncTimestamp) {
              this._lastSyncTimestamp = parsed.ts;
              this.applyRemoteState(parsed.state, parsed.lastEvent);
            }
          }
        } catch (err) {}
      }, 150);
    }

    // Load persisted configurations from local machine
    const savedCustomConfig = this.loadFromStorage(STORAGE_KEY_CONFIG, {});
    const savedCountries = this.loadFromStorage(STORAGE_KEY_COUNTRIES, {});
    this.countries = { ...COUNTRIES_BY_ID, ...savedCountries };

    const initialCountryKey = savedCustomConfig.selectedCountry || 'vietnam';
    const currentPreset = this.countries[initialCountryKey] || this.countries.vietnam || WORLD_COUNTRIES[0];

    // Khởi tạo Khối Lưới Ô Cờ Tiêu Đề 3D (Banner Flag Cells) - Tách biệt hoàn toàn khỏi đất liền phía Bắc
    const initialBannerText = savedCustomConfig.bannerText || (initialCountryKey === 'vietnam' ? 'VIỆT NAM MUÔN NĂM' : currentPreset.name.toUpperCase());
    const initialBannerPos = (savedCustomConfig.bannerPos && savedCustomConfig.bannerPos.z <= -200)
      ? savedCustomConfig.bannerPos
      : { x: 0, y: 4.0, z: -210 };
    const initialBannerClaimedColor = savedCustomConfig.bannerClaimedColor || currentPreset.claimedCellColor || '#DA251D';
    const initialBannerUnclaimedColor = savedCustomConfig.bannerUnclaimedColor || currentPreset.emptyCellColor || '#334155';
    const initialBannerVoxelScale = savedCustomConfig.bannerVoxelScale || 1.5;

    this.bannerEngine = new BannerFlagCellsEngine({
      text: initialBannerText,
      posX: initialBannerPos.x,
      posY: initialBannerPos.y,
      posZ: initialBannerPos.z,
      claimedColor: initialBannerClaimedColor,
      unclaimedColor: initialBannerUnclaimedColor,
      starColor: currentPreset.starColor || '#FFD700'
    });

    const rawLabels = savedCustomConfig.mapTexts && savedCustomConfig.mapTexts.length > 0
      ? savedCustomConfig.mapTexts
      : (currentPreset.labels || []);
    const sanitizedLabels = sanitizeMapLabels(rawLabels);

    // Game state
    this.state = {
      roundId: 'ROUND-1',
      status: 'playing', // playing | victory | paused
      maskLoaded: true,
      totalCells: savedCustomConfig.totalCells || currentPreset.totalCells || 15125,
      claimedCount: 0,
      remainingCells: savedCustomConfig.totalCells || currentPreset.totalCells || 15125,
      percent: 0,
      cellsById: {}, // cellId -> { id, x, y, provinceId, user, color, placedAt }
      provincesStatus: {}, // provinceId -> { id, name, totalCells, claimedCount, isCompleted, leader }
      leaderboard: [], // Array<{ userId, username, avatar, totalCells, totalGifts, tier }>
      combo: {
        userId: null,
        username: null,
        count: 0,
        level: 1,
        multiplier: 1,
        active: false,
        expiresAt: 0,
      },
      boss: {
        active: false,
        name: 'Thử Thách Thần Long 🐉',
        targetCells: 1000,
        currentCells: 0,
        remainingSec: 0,
        reward: 'x2 Tốc Độ Cắm Cờ',
      },
      activeMission: null,
      victory: null,
      feed: [],
      lastFocalTarget: null, // { wx, wz, username, giftName, count }
      activeFlagPoles: [], // Array<{ id, wx, wz, username, avatar, giftName, giftIcon, count, claimedAt }>
      isDemoMode: savedCustomConfig.isDemoMode !== undefined ? savedCustomConfig.isDemoMode : true,
      cameraPreset: 'overview',
      selectedCountry: initialCountryKey,
      mapTexts: sanitizedLabels,
      gifts: (() => {
        const saved = savedCustomConfig.gifts;
        if (Array.isArray(saved) && saved.length > 0) return saved;
        return [...DEFAULT_MAP_GIFTS];
      })(),
      
      // Banner Flag Cells Matrix State
      bannerText: initialBannerText,
      bannerPos: initialBannerPos,
      bannerCells: this.bannerEngine.cells,
      bannerClaimedCount: 0,
      showBannerCells: savedCustomConfig.showBannerCells !== undefined ? savedCustomConfig.showBannerCells : true,
      bannerClaimedColor: initialBannerClaimedColor,
      bannerUnclaimedColor: initialBannerUnclaimedColor,
      bannerVoxelScale: initialBannerVoxelScale,

      // Auto 24/7 Mode Configuration
      autoLoop247: savedCustomConfig.autoLoop247 !== undefined ? savedCustomConfig.autoLoop247 : true,
      autoNewRoundDelaySec: savedCustomConfig.autoNewRoundDelaySec !== undefined ? savedCustomConfig.autoNewRoundDelaySec : 4,
      victoryCountdown: 0,
      isAuto247Running: false,

      settings: {
        theme: savedCustomConfig.theme || 'dark',
        brightness: savedCustomConfig.brightness || 1.2,
        emptyCellColor: savedCustomConfig.emptyCellColor || currentPreset.emptyCellColor || '#475569',
        claimedCellColor: savedCustomConfig.claimedCellColor || currentPreset.claimedCellColor || '#DA251D',
        starColor: savedCustomConfig.starColor || currentPreset.starColor || '#FFD700',
        autoRotate: false,
        autoRotateSpeed: 0,
        showProvinceLabels: true,
        showMapTexts: true,
        voiceAnnouncer: true,
        bgmVolume: savedCustomConfig.bgmVolume !== undefined ? savedCustomConfig.bgmVolume : 0.45,
        sfxVolume: savedCustomConfig.sfxVolume !== undefined ? savedCustomConfig.sfxVolume : 0.85,
        customMapTitle: savedCustomConfig.customMapTitle || currentPreset.title,
        selectedCountry: initialCountryKey,
      }
    };

    this.comboTimer = null;
    this.missionTimer = null;
    this.bossTimer = null;
    this.autoTestTimer = null;
    this.auto247Timer = null;
    this.victoryCountdownTimer = null;
    this.isAutoTesting = false;
    this.isAuto247Running = false;

    // Lắng nghe sự kiện Dừng Demo Toàn Cục để dừng tức thì mọi vòng lặp
    if (typeof window !== 'undefined') {
      window.addEventListener('global-stop-demo', () => {
        this.stopAutoTestLoop();
        this.stopAuto247Loop();
      });
    }

    // Load static data
    this.maskData = defaultVietnamMask;
    this.provincesData = defaultProvincesData.provinces || [];
    this.isLoaded = true;
    this.state.maskLoaded = true;
    this._originalVietnamCells = defaultVietnamMask.cells;
    this.buildGridForCurrentCountry();
    this.initData();
  }

  loadFromStorage(key, fallback) {
    if (typeof localStorage === 'undefined') return fallback;
    try {
      // Thử đọc từ key hiện tại, nếu chưa có thì tìm lại ở các key cũ để không bao giờ mất cài đặt của người dùng
      const keysToCheck = [key, 'aidol_bando_custom_config_v4', 'aidol_bando_custom_config_v3', 'aidol_bando_custom_config_v2', 'aidol_bando_custom_config'];
      for (const k of keysToCheck) {
        const item = localStorage.getItem(k);
        if (item) {
          const parsed = JSON.parse(item);
          if (parsed && typeof parsed === 'object') {
            return { ...fallback, ...parsed };
          }
        }
      }
      return fallback;
    } catch (e) {
      return fallback;
    }
  }

  saveToStorage() {
    if (typeof localStorage === 'undefined') return;
    try {
      const configToSave = {
        selectedCountry: this.state.selectedCountry,
        totalCells: this.state.totalCells,
        isDemoMode: this.state.isDemoMode,
        theme: this.state.settings.theme,
        brightness: this.state.settings.brightness,
        emptyCellColor: this.state.settings.emptyCellColor,
        claimedCellColor: this.state.settings.claimedCellColor,
        starColor: this.state.settings.starColor,
        customMapTitle: this.state.settings.customMapTitle,
        bgmVolume: this.state.settings.bgmVolume,
        sfxVolume: this.state.settings.sfxVolume,
        mapTexts: this.state.mapTexts,
        gifts: this.state.gifts,
        bannerText: this.state.bannerText,
        bannerPos: this.state.bannerPos,
        showBannerCells: this.state.showBannerCells,
        bannerClaimedColor: this.state.bannerClaimedColor,
        bannerUnclaimedColor: this.state.bannerUnclaimedColor,
        bannerVoxelScale: this.state.bannerVoxelScale,
      };
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(configToSave));
      localStorage.setItem(STORAGE_KEY_COUNTRIES, JSON.stringify(this.countries));
    } catch (e) {}
  }

  async initData() {
    try {
      if (!this.maskData || !this.maskData.cells || this.maskData.cells.length === 0) {
        this.maskData = defaultVietnamMask;
        this.provincesData = defaultProvincesData.provinces || [];
        this._originalVietnamCells = defaultVietnamMask.cells;
        this.buildGridForCurrentCountry();
      }
      this.isLoaded = true;
      this.state.maskLoaded = true;
      this.notify();
    } catch (e) {
      console.warn('Fallback loading built-in map grid for BanDoGameEngine', e);
      this.generateFallbackGrid();
      this.isLoaded = true;
      this.state.maskLoaded = true;
      this.notify();
    }
  }

  /**
   * Thuật toán lấp đầy 100% mọi lỗ thủng / khoảng trống bên trong lãnh thổ và hải đảo
   */
  fillMapHolesAndGaps(rawCells, cols = 300, rows = 389) {
    if (!rawCells || rawCells.length === 0) return [];
    
    // Tạo 2D Spatial Map
    const gridMap = new Map();
    const cellLookup = new Map();
    let maxId = 0;

    rawCells.forEach(c => {
      const k = `${c.x},${c.y}`;
      gridMap.set(k, true);
      cellLookup.set(k, c);
      if (c.id > maxId) maxId = c.id;
    });

    const filledCells = [...rawCells];

    // Quét từng hàng và từng cột để lấp các lỗ thủng 1-pixel và 2-pixel được bao quanh bởi đất liền
    for (let y = 5; y < rows - 5; y++) {
      let rowMinX = 9999, rowMaxX = -9999;
      for (let x = 5; x < cols - 5; x++) {
        if (gridMap.has(`${x},${y}`)) {
          if (x < rowMinX) rowMinX = x;
          if (x > rowMaxX) rowMaxX = x;
        }
      }

      if (rowMinX < rowMaxX) {
        for (let x = rowMinX + 1; x < rowMaxX; x++) {
          const key = `${x},${y}`;
          if (!gridMap.has(key)) {
            // Kiểm tra xem có phải lỗ thủng bên trong (có lân cận 4 hướng là đất liền)
            const leftLand = gridMap.has(`${x - 1},${y}`) || gridMap.has(`${x - 2},${y}`);
            const rightLand = gridMap.has(`${x + 1},${y}`) || gridMap.has(`${x + 2},${y}`);
            const topLand = gridMap.has(`${x},${y - 1}`) || gridMap.has(`${x},${y - 2}`);
            const bottomLand = gridMap.has(`${x},${y + 1}`) || gridMap.has(`${x},${y + 2}`);

            if ((leftLand && rightLand) || (topLand && bottomLand) || (leftLand && topLand && bottomLand)) {
              maxId++;
              const neighbor = cellLookup.get(`${x - 1},${y}`) || 
                               cellLookup.get(`${x + 1},${y}`) || 
                               cellLookup.get(`${x},${y - 1}`) || 
                               cellLookup.get(`${x},${y + 1}`) || 
                               rawCells[0];
              const newCell = {
                id: maxId,
                x: x,
                y: y,
                region: neighbor.region || 'mainland',
                provinceId: neighbor.provinceId || 'hanoi'
              };
              gridMap.set(key, true);
              cellLookup.set(key, newCell);
              filledCells.push(newCell);
            }
          }
        }
      }
    }

    return filledCells;
  }

  buildGridForCurrentCountry() {
    const preset = this.countries[this.state.selectedCountry] || this.countries.vietnam || WORLD_COUNTRIES[0];
    const targetCount = this.state.totalCells || 15125;

    // Cache original Vietnam cells và lấp đầy 100% lỗ trống
    if (!this._originalVietnamCells && defaultVietnamMask?.cells) {
      this._originalVietnamCells = this.fillMapHolesAndGaps(defaultVietnamMask.cells, 300, 389);
    }

    let baseCells = [];
    if (this.state.selectedCountry === 'vietnam') {
      baseCells = this._originalVietnamCells || this.fillMapHolesAndGaps(this.maskData?.cells || defaultVietnamMask?.cells || [], 300, 389);
    } else {
      baseCells = this.generateCountryGeometry(this.state.selectedCountry, targetCount);
    }

    // Tái phân bổ lưới 2D liền mạch theo targetCount: Tuyệt đối không để lỗ trống/lỗ thủng
    let finalCells = [];
    if (baseCells.length === targetCount) {
      finalCells = baseCells;
    } else if (baseCells.length > targetCount) {
      // Downsampling 2D bằng cách gom cụm ô (Grid Binning) thay vì bỏ bước nhảy 1D để tránh tạo lỗ hổng
      const scale = Math.sqrt(baseCells.length / targetCount);
      const binnedMap = new Map();

      baseCells.forEach(c => {
        const bx = Math.round(c.x / scale);
        const by = Math.round(c.y / scale);
        const bkey = `${bx},${by}`;
        if (!binnedMap.has(bkey)) {
          binnedMap.set(bkey, {
            id: binnedMap.size + 1,
            x: bx * scale,
            y: by * scale,
            region: c.region || 'mainland',
            provinceId: c.provinceId || 'vietnam_all',
          });
        }
      });

      const binnedArr = Array.from(binnedMap.values());
      if (binnedArr.length >= targetCount) {
        finalCells = binnedArr.slice(0, targetCount);
      } else {
        finalCells = binnedArr;
        // Bổ sung thêm các ô viền tiếp giáp nếu thiếu để đạt đúng targetCount mà vẫn phủ kín 100%
        let pIdx = 0;
        while (finalCells.length < targetCount && pIdx < baseCells.length) {
          const bc = baseCells[pIdx];
          finalCells.push({
            ...bc,
            id: finalCells.length + 1,
          });
          pIdx++;
        }
      }
    } else {
      // Phóng to / Chia nhỏ ô (Subdivide) với offset chuẩn xác, lấp đầy 100% không gian
      finalCells = [...baseCells];
      const subOffsets = [
        { dx: -0.28, dy: -0.28 },
        { dx: 0.28, dy: -0.28 },
        { dx: -0.28, dy: 0.28 },
        { dx: 0.28, dy: 0.28 },
        { dx: 0, dy: -0.38 },
        { dx: 0, dy: 0.38 },
        { dx: -0.38, dy: 0 },
        { dx: 0.38, dy: 0 }
      ];

      let idx = 0;
      let offsetIdx = 0;
      while (finalCells.length < targetCount) {
        const c = baseCells[idx % baseCells.length];
        const off = subOffsets[offsetIdx % subOffsets.length];
        finalCells.push({
          ...c,
          id: finalCells.length + 1,
          x: c.x + off.dx,
          y: c.y + off.dy,
        });
        idx++;
        if (idx % baseCells.length === 0) offsetIdx++;
      }
    }

    this.maskData = {
      gridCols: 300,
      gridRows: 389,
      playableCellCount: finalCells.length,
      cells: finalCells,
    };

    // Update Provinces Status
    const provs = preset.provinces || this.provincesData || [];
    const provStatus = {};
    const cellsPerProv = Math.floor(finalCells.length / Math.max(1, provs.length));

    provs.forEach((p) => {
      provStatus[p.id] = {
        id: p.id,
        name: p.name,
        totalCells: p.totalCells || cellsPerProv,
        claimedCount: 0,
        isCompleted: false,
        leader: null,
      };
    });

    this.state.provincesStatus = provStatus;
    this.state.totalCells = finalCells.length;
    this.state.remainingCells = finalCells.length;
    this.isLoaded = true;
    this.notify();
  }

  generateCountryGeometry(countryKey, count = 15000) {
    if (countryKey === 'custom_upload' && this._customUploadedCells && this._customUploadedCells.length > 0) {
      return this._customUploadedCells;
    }

    const cells = [];
    let cid = 1;

    for (let i = 0; i < count; i++) {
      let x = 150;
      let y = 190;

      if (countryKey === 'japan') {
        // Japanese Archipelago
        if (i % 8 === 0) {
          x = 80 + (Math.random() - 0.5) * 20;
          y = 320 + (Math.random() - 0.5) * 20;
        } else if (i % 6 === 0) {
          x = 210 + (Math.random() - 0.5) * 45;
          y = 70 + (Math.random() - 0.5) * 35;
        } else {
          const prog = (i % (count * 0.8)) / (count * 0.8);
          x = 100 + Math.pow(prog, 1.2) * 110 + (Math.random() - 0.5) * 28;
          y = 260 - prog * 160 + (Math.random() - 0.5) * 25;
        }
      } else if (countryKey === 'korea') {
        if (i % 12 === 0) {
          x = 120 + (Math.random() - 0.5) * 16;
          y = 310 + (Math.random() - 0.5) * 16;
        } else {
          x = 145 + (Math.random() - 0.5) * 40;
          y = 110 + (i / count) * 160 + (Math.random() - 0.5) * 15;
        }
      } else if (countryKey === 'usa') {
        if (i % 15 === 0) {
          x = 60 + (Math.random() - 0.5) * 18;
          y = 290 + (Math.random() - 0.5) * 18;
        } else {
          x = 70 + Math.random() * 160;
          y = 120 + Math.random() * 140;
        }
      } else if (countryKey === 'france') {
        if (i % 15 === 0) {
          x = 220 + (Math.random() - 0.5) * 15;
          y = 280 + (Math.random() - 0.5) * 25;
        } else {
          const angle = Math.random() * Math.PI * 2;
          const rad = Math.sqrt(Math.random()) * 65;
          x = 150 + Math.cos(angle) * rad;
          y = 190 + Math.sin(angle) * rad * 0.9;
        }
      } else {
        // Generic continental organic shape
        const angle = Math.random() * Math.PI * 2;
        const rad = Math.sqrt(Math.random()) * 75;
        x = 150 + Math.cos(angle) * rad * 1.1;
        y = 190 + Math.sin(angle) * rad * 1.25;
      }

      cells.push({
        id: cid++,
        x: Math.floor(Math.max(10, Math.min(290, x))),
        y: Math.floor(Math.max(10, Math.min(380, y))),
        provinceId: `prov_${(i % 8) + 1}`,
        region: 'mainland'
      });
    }
    return cells;
  }

  /**
   * Tải ảnh mẫu bản đồ bất kỳ (PNG/JPG/WebP/SVG) -> Chuyển thành ma trận ô cờ 3D chuẩn xác 100%
   */
  async loadCustomMapFromImage(imageDataUrl, countryName = 'Bản Đồ Mẫu Tùy Chỉnh', targetCellCount = 15000) {
    if (typeof window === 'undefined' || typeof document === 'undefined') return false;

    return new Promise((resolve) => {
      const img = new window.Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        try {
          const cols = 300;
          const rows = 389;
          const canvas = document.createElement('canvas');
          canvas.width = cols;
          canvas.height = rows;
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          
          // Vẽ ảnh phủ vừa vặn khung 300x389 giữ tỉ lệ
          ctx.clearRect(0, 0, cols, rows);
          const aspect = img.width / img.height;
          const targetAspect = cols / rows;
          let drawW = cols;
          let drawH = rows;
          let offX = 0;
          let offY = 0;
          if (aspect > targetAspect) {
            drawH = cols / aspect;
            offY = (rows - drawH) / 2;
          } else {
            drawW = rows * aspect;
            offX = (cols - drawW) / 2;
          }
          ctx.drawImage(img, offX, offY, drawW, drawH);

          const imgData = ctx.getImageData(0, 0, cols, rows).data;
          const rawCells = [];
          let cid = 1;

          for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
              const idx = (y * cols + x) * 4;
              const r = imgData[idx];
              const g = imgData[idx + 1];
              const b = imgData[idx + 2];
              const a = imgData[idx + 3];

              // Pixel được tính là đất liền nếu alpha > 30 và không phải màu nền trắng tinh/đen tuyền
              const isTransparent = a < 35;
              const isPureWhiteBg = (r > 245 && g > 245 && b > 245 && a > 200);
              const isDarkVoid = (r < 10 && g < 10 && b < 10 && a < 50);

              if (!isTransparent && !isPureWhiteBg && !isDarkVoid) {
                rawCells.push({
                  id: cid++,
                  x: x,
                  y: y,
                  region: 'mainland',
                  provinceId: 'custom_zone'
                });
              }
            }
          }

          // Lấp kín 100% các lỗ hổng
          const solidCells = this.fillMapHolesAndGaps(rawCells, cols, rows);

          this._customUploadedCells = solidCells.length > 300 ? solidCells : rawCells;
          
          const customPreset = {
            id: 'custom_upload',
            name: countryName,
            code: 'MAP',
            title: `Bản đồ ${countryName} (Từ Ảnh Mẫu)`,
            continent: 'custom',
            flag: '🗺️',
            claimedCellColor: '#dc2626',
            starColor: '#f59e0b',
            emptyCellColor: '#475569',
            referenceImageUrl: imageDataUrl,
            labels: [
              { text: `★ ${countryName.toUpperCase()}`, wx: 0, wz: 0, color: '#facc15' },
              { text: '★ THỦ ĐÔ TRUNG TÂM', wx: 0, wz: -20, color: '#38bdf8' }
            ],
            provinces: [
              { id: 'zone_1', name: 'Khu Vực 1 (Phía Bắc)', totalCells: Math.floor(targetCellCount * 0.33) },
              { id: 'zone_2', name: 'Khu Vực 2 (Trung Tâm)', totalCells: Math.floor(targetCellCount * 0.34) },
              { id: 'zone_3', name: 'Khu Vực 3 (Phía Nam)', totalCells: Math.floor(targetCellCount * 0.33) },
            ]
          };

          this.countries['custom_upload'] = customPreset;
          this.state.selectedCountry = 'custom_upload';
          this.state.settings.customMapTitle = customPreset.title;
          this.state.totalCells = targetCellCount;
          this.setBannerText(countryName.toUpperCase() + ' VÔ ĐỊCH');
          this.buildGridForCurrentCountry();
          this.saveToStorage();
          this.notify({ type: 'CUSTOM_MAP_LOADED', countryKey: 'custom_upload', countryName });
          resolve(true);
        } catch (err) {
          console.error('Error processing custom map image:', err);
          resolve(false);
        }
      };
      img.onerror = () => resolve(false);
      img.src = imageDataUrl;
    });
  }

  generateFallbackGrid() {
    this.buildGridForCurrentCountry();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  applyRemoteState(remoteState, lastEvent = null) {
    if (!remoteState) return;
    this._isApplyingRemoteSync = true;
    try {
      this.state = {
        ...this.state,
        ...remoteState,
        cellsById: remoteState.cellsById ? { ...remoteState.cellsById } : this.state.cellsById,
        provincesStatus: remoteState.provincesStatus ? { ...remoteState.provincesStatus } : this.state.provincesStatus,
        leaderboard: remoteState.leaderboard ? [...remoteState.leaderboard] : this.state.leaderboard,
        combo: remoteState.combo ? { ...remoteState.combo } : this.state.combo,
        boss: remoteState.boss ? { ...remoteState.boss } : this.state.boss,
        activeMission: remoteState.activeMission ? { ...remoteState.activeMission } : this.state.activeMission
      };

      this.listeners.forEach(cb => {
        try { cb(this.state, lastEvent); } catch(e) {}
      });
    } finally {
      this._isApplyingRemoteSync = false;
    }
  }

  syncFromRemote(remoteState, lastEvent = null) {
    this.applyRemoteState(remoteState, lastEvent);
  }

  notify(lastEvent = null) {
    if (this._isApplyingRemoteSync) return;
    // Tạo bản sao cellsById MỚI để React detect change qua === reference comparison
    this.state.cellsById = { ...this.state.cellsById };
    // Tăng sequence number đảm bảo React useEffect LUÔN trigger khi có thay đổi
    if (!this.state._stateSeq) this.state._stateSeq = 0;
    this.state._stateSeq += 1;
    this.listeners.forEach(cb => {
      try { cb(this.state, lastEvent); } catch(e) {}
    });

    const now = Date.now();
    this._lastSyncTimestamp = now;

    // 1. Đồng bộ qua Socket.io (Hỗ trợ OBS Studio / TikTok LIVE Studio xuyên Domain)
    if (this.socket && this.socket.connected) {
      try {
        this.socket.emit('bando_sync', this.state);
      } catch (e) {}
    }

    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage({
          type: 'BANDO_STATE_UPDATE',
          state: this.state,
          lastEvent,
          ts: now
        });
      } catch (e) {}
    }

    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('avalive_bando_realtime_sync', JSON.stringify({
          state: this.state,
          lastEvent,
          ts: now
        }));
      } catch (e) {}
    }
  }

  // ==================== QUẢN TRỊ 200 QUỐC GIA ====================
  switchCountry(countryKey) {
    const preset = this.countries[countryKey] || this.countries.vietnam || WORLD_COUNTRIES[0];
    this.state.selectedCountry = countryKey;
    this.state.mapTexts = sanitizeMapLabels(preset.labels || []);
    this.state.settings.customMapTitle = preset.title;
    this.state.settings.claimedCellColor = preset.claimedCellColor;
    this.state.settings.starColor = preset.starColor;
    this.state.settings.emptyCellColor = preset.emptyCellColor;
    this.state.settings.selectedCountry = countryKey;

    // Cập nhật Banner Text tương ứng quốc gia nếu chưa đặt riêng
    const newBannerText = countryKey === 'vietnam' ? 'VIỆT NAM MUÔN NĂM' : (preset.name.split(' ')[0] + ' VÔ ĐỊCH').toUpperCase();
    this.setBannerText(newBannerText);

    this.resetRound();
    this.buildGridForCurrentCountry();
    this.saveToStorage();
    this.notify({ type: 'COUNTRY_CHANGED', countryKey });
  }

  // ==================== QUẢN LÝ CHỮ Ô CỜ TIÊU ĐỀ 3D (BANNER CELLS) ====================
  setBannerText(text) {
    const clean = (text || 'VIỆT NAM MUÔN NĂM').trim();
    this.bannerEngine.setText(clean);
    this.state.bannerText = clean;
    this.state.bannerCells = [...this.bannerEngine.cells];
    this.state.bannerClaimedCount = this.bannerEngine.claimedCount;
    this.saveToStorage();
    this.notify({ type: 'BANNER_TEXT_UPDATED', bannerText: clean });
  }

  setBannerPosition(x, y, z) {
    this.bannerEngine.setPosition(x, y, z);
    this.state.bannerPos = { x: this.bannerEngine.posX, y: this.bannerEngine.posY, z: this.bannerEngine.posZ };
    this.state.bannerCells = [...this.bannerEngine.cells];
    this.saveToStorage();
    this.notify({ type: 'BANNER_POS_UPDATED', bannerPos: this.state.bannerPos });
  }

  toggleShowBannerCells(show) {
    this.state.showBannerCells = !!show;
    this.saveToStorage();
    this.notify({ type: 'BANNER_VISIBILITY_UPDATED', showBannerCells: this.state.showBannerCells });
  }

  setBannerColors(claimedColor, unclaimedColor, voxelScale) {
    if (claimedColor) {
      this.bannerEngine.claimedColor = claimedColor;
      this.state.bannerClaimedColor = claimedColor;
    }
    if (unclaimedColor) {
      this.bannerEngine.unclaimedColor = unclaimedColor;
      this.state.bannerUnclaimedColor = unclaimedColor;
    }
    if (voxelScale !== undefined) {
      this.state.bannerVoxelScale = parseFloat(voxelScale) || 1.5;
    }
    this.bannerEngine.setColors(this.state.bannerClaimedColor, this.state.bannerUnclaimedColor);
    this.state.bannerCells = [...this.bannerEngine.cells];
    this.saveToStorage();
    this.notify({
      type: 'BANNER_STYLE_UPDATED',
      claimedColor: this.state.bannerClaimedColor,
      unclaimedColor: this.state.bannerUnclaimedColor,
      voxelScale: this.state.bannerVoxelScale
    });
  }

  // Cài đặt tổng số ô cờ
  setTotalCells(newCount) {
    const val = Math.max(500, Math.min(100000, parseInt(newCount) || 15125));
    this.state.totalCells = val;
    this.state.remainingCells = val;
    this.buildGridForCurrentCountry();
    this.resetRound();
    this.saveToStorage();
    this.saveSettings();
    this.notify({ type: 'TOTAL_CELLS_CHANGED', totalCells: val });
  }

  // Tương thích cả cú pháp handleGift({ giftId, count, userId, username, avatar }) lẫn processGift
  handleGift(giftEvent) {
    if (!giftEvent) return;
    if (typeof giftEvent === 'string') {
      return this.processGift(giftEvent, 1);
    }
    return this.processGift(giftEvent);
  }

  // Xử lý sự kiện tặng quà và cắm cờ
  processGift(giftId, count = 1, user = { id: 'guest_1', username: 'Chiến Binh Áo Đỏ', avatar: '' }) {
    if (this.state.status === 'victory') {
      this.resetRound();
    }
    if (!this.maskData || !this.maskData.cells || this.maskData.cells.length === 0) {
      this.maskData = defaultVietnamMask;
    }

    let explicitRegionTarget = null;
    let giftNameInput = '';
    let diamondCountInput = 1;

    if (typeof giftId === 'object' && giftId !== null) {
      const obj = giftId;
      giftNameInput = obj.giftName || obj.name || '';
      diamondCountInput = Number(obj.diamondCount) || 1;
      giftId = obj.giftId || obj.id || giftNameInput || 'flag_vn';
      count = Number(obj.count || obj.repeatCount) || count || 1;
      user = {
        id: obj.userId || obj.id || user.id || 'guest_1',
        username: obj.username || obj.nickname || user.username || 'Chiến Binh Áo Đỏ',
        avatar: obj.avatar || obj.profilePictureUrl || user.avatar || ''
      };
      if (obj.regionTarget) {
        explicitRegionTarget = obj.regionTarget;
      }
    }

    const now = Date.now();

    // Luôn kích hoạt audio context ngay khi có quà tặng
    bandoAudio.unlock();

    let savedGifts = [];
    try {
      const savedCfg = getGiftConfig('map');
      if (savedCfg) {
        savedGifts = [...(savedCfg.regionalGifts || []), ...(savedCfg.gifts || [])];
      }
    } catch (e) {}

    const allKnownGifts = [...savedGifts, ...(this.state.gifts || DEFAULT_MAP_GIFTS), ...REGIONAL_FLAG_GIFTS, ...DEFAULT_STANDARD_GIFTS];
    
    const targetKey = String(giftId || '').toLowerCase().trim();
    const targetName = String(giftNameInput || '').toLowerCase().trim();

    const hasRealMsgId = typeof giftId === 'object' && Boolean(giftId?.msgId);
    if (hasRealMsgId) {
      const giftSig = `msg_${giftId.msgId}`;
      const lastGiftTime = this.processedGiftSignatures?.get(giftSig) || 0;
      if (now - lastGiftTime < 1500) {
        return; // Bỏ qua trùng lặp gói tin mạng thực từ TikTok Webcast
      }
      if (!this.processedGiftSignatures) this.processedGiftSignatures = new Map();
      this.processedGiftSignatures.set(giftSig, now);
      if (this.processedGiftSignatures.size > 500) {
        const first = this.processedGiftSignatures.keys().next().value;
        this.processedGiftSignatures.delete(first);
      }
    }

    let giftDef = allKnownGifts.find(g => {
      const gId = String(g.id || '').toLowerCase();
      const gName = String(g.name || '').toLowerCase();
      const gShort = String(g.shortName || '').toLowerCase();
      return gId === targetKey || gName === targetKey || gName === targetName || 
             (targetName && (gName.includes(targetName) || targetName.includes(gName) || (gShort && targetName.includes(gShort)))) ||
             (targetKey && (gName.includes(targetKey) || targetKey.includes(gName)));
    });

    // Nếu không tìm thấy quà định nghĩa sẵn, mặc định chỉ là 1 ô
    if (!giftDef) {
      giftDef = {
        id: targetKey || 'custom_gift',
        name: giftNameInput || giftId || 'Quà TikTok',
        cells: diamondCountInput || 1, // Cập nhật: Tính số ô theo số xu đối với quà lạ
        priceToken: diamondCountInput,
        icon: diamondCountInput >= 1000 ? '👑' : diamondCountInput >= 100 ? '💎' : diamondCountInput >= 10 ? '🎁' : '🌹',
        color: '#dc2626',
        tier: diamondCountInput >= 1000 ? 'legendary' : diamondCountInput >= 200 ? 'epic' : diamondCountInput >= 20 ? 'rare' : 'common'
      };
    }

    // Số lượng ô cờ thực tế = Số ô của quà (mặc định 1) * số lượng quà tặng (repeatCount)
    // CHUẨN XÁC 100%: Tuyệt đối không dùng combo multiplier nhân đôi ô để không tạo dư ô cờ
    const cellValue = Number(giftDef.cells) || 1;
    const effectiveCells = Math.max(1, (cellValue * count) || 1);
    
    // Combo level chỉ dùng cho hiệu ứng âm thanh, không nhân số ô
    if (this.state.combo.userId === user.id && this.state.combo.expiresAt > now) {
      this.state.combo.count += 1;
      this.state.combo.level = Math.min(10, Math.floor(this.state.combo.count / 3) + 1);
      this.state.combo.expiresAt = now + 5000;
      bandoAudio.playCombo(this.state.combo.level);
    } else {
      this.state.combo = {
        userId: user.id,
        username: user.username,
        count: 1,
        level: 1,
        multiplier: 1,
        active: true,
        expiresAt: now + 5000,
      };
    }

    // Xác định vùng miền chỉ định (nếu có: 'north' | 'central' | 'south')
    let regionTarget = explicitRegionTarget || giftDef.regionTarget || null;
    const gId = (giftId || '').toLowerCase();
    const gName = (giftDef.name || giftNameInput || '').toLowerCase();
    if (!regionTarget) {
      if (gId.includes('north') || gId.includes('bac') || gName.includes('bắc') || gId === 'peach' || gId === 'finger_heart' || gName.includes('ngón tay tim') || gName.includes('finger heart')) {
        regionTarget = 'north';
      } else if (gId.includes('central') || gId.includes('trung') || gName.includes('trung') || gId === 'spin_ball' || gId === 'doughnut' || gId === 'donut' || gName.includes('donut') || gName.includes('bánh')) {
        regionTarget = 'central';
      } else if (gId.includes('south') || gId.includes('nam') || gName.includes('nam') || gId === 'bing_chilling' || gId === 'hi_bear' || gId === 'bear' || gName.includes('gấu con') || gName.includes('gấu') || gName.includes('bear')) {
        regionTarget = 'south';
      }
    }

    // Allocate unclaimed cells (ưu tiên phân bổ chính xác vào vùng miền chỉ định và tâm điểm thành phố)
    const allCells = this.maskData.cells || [];
    const unallocated = allCells.filter(c => !this.state.cellsById[c.id] && !this.reservedCellIds.has(c.id));

    let toClaim = [];
    if (regionTarget) {
      const targetConfig = REGION_CONFIG[regionTarget];
      const regionalUnallocated = unallocated.filter(c => getRegionForCell(c) === regionTarget);

      if (targetConfig) {
        regionalUnallocated.sort((a, b) => {
          const aPref = targetConfig.preferredProvinces.includes(a.provinceId) ? 0 : 1;
          const bPref = targetConfig.preferredProvinces.includes(b.provinceId) ? 0 : 1;
          if (aPref !== bPref) return aPref - bPref;

          const distA = Math.hypot(a.x - targetConfig.centerGrid.x, a.y - targetConfig.centerGrid.y);
          const distB = Math.hypot(b.x - targetConfig.centerGrid.x, b.y - targetConfig.centerGrid.y);
          return distA - distB;
        });
      }

      if (regionalUnallocated.length >= effectiveCells) {
        toClaim = regionalUnallocated.slice(0, effectiveCells);
      } else {
        const otherUnallocated = unallocated.filter(c => getRegionForCell(c) !== regionTarget);
        toClaim = [...regionalUnallocated, ...otherUnallocated].slice(0, effectiveCells);
      }
    } else {
      toClaim = unallocated.slice(0, effectiveCells);
    }

    if (toClaim.length === 0 && unallocated.length === 0) {
      this.resetRound();
      const freshUnallocated = (this.maskData.cells || []).filter(c => !this.state.cellsById[c.id] && !this.reservedCellIds.has(c.id));
      toClaim = freshUnallocated.slice(0, effectiveCells);
    }

    const placedColor = this.state.settings.claimedCellColor || '#DA251D';
    
    // CẬP NHẬT CẮM CỜ NGAY LẬP TỨC (Instant Claim) - Không bị delay, không bị giật lag
    const provinceUpdated = new Set();
    toClaim.forEach(cell => {
      this.state.cellsById[cell.id] = {
        id: cell.id,
        x: cell.x,
        y: cell.y,
        provinceId: cell.provinceId,
        user: { id: user.id, username: user.username },
        color: placedColor,
        placedAt: now,
      };
      this.reservedCellIds.delete(cell.id);

      if (this.state.provincesStatus[cell.provinceId]) {
        this.state.provincesStatus[cell.provinceId].claimedCount += 1;
        provinceUpdated.add(cell.provinceId);
      }
    });

    this.state.claimedCount = Object.keys(this.state.cellsById).length;
    this.state.remainingCells = Math.max(0, this.state.totalCells - this.state.claimedCount);
    this.state.percent = Math.min(100, Math.round((this.state.claimedCount / this.state.totalCells) * 1000) / 10);

    this.bannerEngine.syncWithMapPercent(this.state.percent);
    this.state.bannerCells = [...this.bannerEngine.cells];
    this.state.bannerClaimedCount = this.bannerEngine.claimedCount;

    // Leaderboard update
    let userEntry = this.state.leaderboard.find(l => l.userId === user.id);
    if (!userEntry) {
      userEntry = {
        userId: user.id,
        username: user.username,
        avatar: user.avatar || '',
        totalCells: 0,
        totalGifts: 0,
        tier: 'Đồng 🟤'
      };
      this.state.leaderboard.push(userEntry);
    }
    userEntry.totalCells += toClaim.length;
    userEntry.totalGifts += count;
    
    const getHonorTierLocal = (cells) => {
      if (cells >= 100000) return 'Kim Cương 💎';
      if (cells >= 50000) return 'Bạch Kim 💍';
      if (cells >= 10000) return 'Vàng 🥇';
      if (cells >= 2000) return 'Bạc 🥈';
      return 'Đồng 🟤';
    };
    userEntry.tier = getHonorTierLocal(userEntry.totalCells);
    this.state.leaderboard.sort((a, b) => b.totalCells - a.totalCells);

    // Cập nhật Cột Cờ 3D & Điểm Tiêu Điểm Tức Thì
    const focalCell = toClaim[toClaim.length - 1];
    if (focalCell) {
      const wx = (focalCell.x - (this.maskData.gridCols || 300) / 2) * 1.0;
      const wz = (focalCell.y - (this.maskData.gridRows || 389) / 2) * 1.0;
      this.state.lastFocalTarget = {
        x: focalCell.x,
        y: focalCell.y,
        wx,
        wz,
        username: user.username,
        giftName: giftDef.name,
        count: toClaim.length,
        regionTarget,
        seq: now,
      };

      if (!this.state.activeFlagPoles) this.state.activeFlagPoles = [];
      this.state.activeFlagPoles.push({
        id: `pole_${now}_${Math.random().toString(36).substr(2, 5)}`,
        wx,
        wz,
        userId: user.id || '',
        username: user.username,
        avatar: user.avatar || '',
        giftName: giftDef.name,
        giftIcon: giftDef.icon,
        count: toClaim.length,
        regionTarget,
        claimedAt: now,
      });
      if (this.state.activeFlagPoles.length > 100) {
        this.state.activeFlagPoles.shift();
      }
    }

    const regionNameVi = regionTarget === 'north' ? 'Miền Bắc 🏔️' : regionTarget === 'central' ? 'Miền Trung 🌊' : regionTarget === 'south' ? 'Miền Nam 🌴' : '';
    const regionText = regionNameVi ? ` [Khu vực ${regionNameVi}]` : '';
    this.addFeedItem('GIFT', `${user.username} đã gửi [${giftDef.icon} ${giftDef.name} x${count}]${regionText} → Cắm +${toClaim.length} Ô Cờ!`);

    // Âm thanh
    if (giftDef.tier === 'mythic' || giftDef.tier === 'divine') {
      bandoAudio.playThunderStrike();
    } else if (giftDef.tier === 'legendary') {
      bandoAudio.playWarHorn();
    } else if (giftDef.tier === 'epic') {
      bandoAudio.playWarDrums(1);
    } else {
      bandoAudio.playCellPop();
    }

    provinceUpdated.forEach(pid => {
      const p = this.state.provincesStatus[pid];
      if (p && !p.isCompleted && p.claimedCount >= p.totalCells) {
        p.isCompleted = true;
        p.leader = user.username;
        bandoAudio.playProvinceComplete(p.name);
        this.addFeedItem('PROVINCE_COMPLETE', `⭐ Vùng/Tỉnh [${p.name}] đã hoàn thành 100% cắm cờ bởi ${user.username}!`);
      }
    });

    this.notify({ type: 'GIFT_PROCESSED_INSTANT', batchSize: toClaim.length, user, giftDef });

    if (this.state.remainingCells <= 0 && this.state.status === 'playing') {
      this.triggerVictory(user);
    }
  }

  handleUserComment(commentText, userNameOrUser = 'Khán Giả Live') {
    let user = { id: 'guest_cm', username: 'Khán Giả Live', avatar: '' };
    if (typeof userNameOrUser === 'string') {
      user.username = userNameOrUser;
    } else if (typeof userNameOrUser === 'object' && userNameOrUser !== null) {
      user = { ...user, ...userNameOrUser };
    }
    return this.processComment(commentText, user);
  }

  processComment(commentText, user = { id: 'guest_cm', username: 'Khán Giả Live', avatar: '' }) {
    if (!commentText || this.state.status === 'victory') return;
    const clean = commentText.toString().trim().toLowerCase();
    const now = Date.now();

    // Khử trùng lặp bình luận (Deduplication) - Không đọc lặp lại cùng 1 bình luận trong 4 giây
    const commentSig = `${user.id || user.username}_${clean}`;
    const lastCommentTime = this.processedCommentSignatures?.get(commentSig) || 0;
    if (now - lastCommentTime < 4000) {
      return;
    }
    if (!this.processedCommentSignatures) this.processedCommentSignatures = new Map();
    this.processedCommentSignatures.set(commentSig, now);
    if (this.processedCommentSignatures.size > 300) {
      const first = this.processedCommentSignatures.keys().next().value;
      this.processedCommentSignatures.delete(first);
    }
    
    // Bỏ qua tin nhắn quà tặng hoặc thông báo hệ thống của TikTok lọt vào luồng chat để tuyệt đối không bị cắm thừa ô
    if (clean.includes('gifted the host') || clean.includes('đã gửi cho chủ phòng') || clean.includes('đã tặng') || clean.includes('rose') || clean.includes('hoa hồng')) {
      return;
    }

    // Kích hoạt Hệ Thống Voice AI & Từ Khóa Trả Lời Tự Động
    try {
      mapVoiceEngine.handleUserComment(commentText, user?.username || 'Bạn');
    } catch (e) {}

    // Chỉ cắm cờ tương tác khi người dùng chủ động gõ lệnh số 1 hoặc số 2
    if (clean === '1' || clean === 'cm 1' || clean === 'số 1' || clean === 'so 1') {
      this.processGift('flag_vn', 1, user);
    } else if (clean === '2' || clean === 'cm 2' || clean === 'số 2' || clean === 'so 2') {
      this.processGift('flag_vn', 2, user);
    }
  }

  addFeedItem(type, text) {
    const item = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      time: new Date().toLocaleTimeString(),
      type,
      text,
    };
    this.state.feed = [item, ...this.state.feed.slice(0, 49)];
  }

  triggerBossEvent() {
    this.state.boss = {
      active: true,
      name: '🐉 THỬ THÁCH THẦN LONG TRẤN QUỐC 🐉',
      targetCells: 1500,
      currentCells: 0,
      remainingSec: 90,
      reward: 'Tặng Thưởng Huân Chương VIP Toàn Server',
    };
    bandoAudio.playBossAlert();
    this.addFeedItem('BOSS', '🔥 CẢNH BÁO: Thử Thách Thần Long Xuất Hiện! Cùng chung tay cắm 1.500 ô cờ!');

    if (this.bossTimer) clearInterval(this.bossTimer);
    this.bossTimer = setInterval(() => {
      if (this.state.boss.remainingSec > 0 && this.state.boss.active) {
        this.state.boss.remainingSec -= 1;
        this.notify();
      } else {
        this.state.boss.active = false;
        clearInterval(this.bossTimer);
        this.notify();
      }
    }, 1000);
    this.notify();
  }

  triggerMission() {
    const provs = Object.values(this.state.provincesStatus).filter(p => !p.isCompleted);
    const targetProv = provs[Math.floor(Math.random() * provs.length)] || { name: 'Thủ Đô' };
    this.state.activeMission = {
      id: `m_${Date.now()}`,
      title: `⚡ NHIỆM VỤ ĐỘT KÍCH: Cắm 100 ô tại [${targetProv.name}]`,
      target: 100,
      current: 0,
      remainingSec: 60,
      reward: 'Nhận x2 Điểm Vinh Danh',
    };
    bandoAudio.playBossAlert();
    this.addFeedItem('MISSION', `🎯 Nhiệm vụ mới: Hoàn thành nhanh 100 ô tại [${targetProv.name}]!`);
    this.notify();
  }

  triggerVictory(winnerUser = { username: 'Đoàn Kết Dân Tộc' }) {
    if (this.state.status === 'victory') return;

    this.state.status = 'victory';
    this.state.percent = 100;
    this.state.remainingCells = 0;
    this.bannerEngine.syncWithMapPercent(100);
    this.state.bannerCells = [...this.bannerEngine.cells];
    this.state.bannerClaimedCount = this.bannerEngine.claimedCount;

    // Sắp xếp Bảng Xếp Hạng hoàn chỉnh
    this.state.leaderboard.sort((a, b) => b.totalCells - a.totalCells);

    // Xác định TOP 1 CHIẾN THẦN QUỐC GIA (MVP Champion)
    const top1Champion = this.state.leaderboard[0] || {
      userId: '@dai_tuong_quan',
      username: winnerUser.username || 'Chiến Binh Áo Đỏ 🇻🇳',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
      totalCells: this.state.claimedCount || 1,
      totalGifts: 25,
      tier: 'supreme'
    };

    // Thu thập BẢNG VINH DANH TOP 30 CHIẾN BINH
    let top30 = [...this.state.leaderboard];
    if (top30.length === 0) {
      top30.push(top1Champion);
    }
    top30 = top30.slice(0, 30);

    this.state.victory = {
      roundId: this.state.roundId,
      winner: top1Champion.username,
      totalCells: this.state.totalCells,
      mvpUser: top1Champion,
      top1Champion: top1Champion,
      topContributors: top30.slice(0, 5),
      top30: top30,
      completedAt: new Date().toLocaleTimeString(),
    };

    // Kích hoạt Nhạc Khải Hoàn Ca Hào Hùng & Pháo Hoa
    bandoAudio.playVictoryEpic();
    this.addFeedItem('VICTORY', `🎉 CHÚC MỪNG CHIẾN THẮNG: Toàn bộ Bản Đồ đã rực rỡ sắc cờ quốc kỳ!`);
    
    // Tự động lưu trữ Snapshot phiên live vào bộ nhớ vĩnh viễn (Session Persistence)
    this.saveSessionSnapshot();

    this.notify({ type: 'VICTORY' });

    // HỆ THỐNG ĐẾM NGƯỢC 4 GIÂY CHO Ô CHÚC MỪNG / LỄ VINH DANH (AUTO LOOP HOẶC ĐÓNG VINH DANH)
    if (this.victoryCountdownTimer) {
      clearInterval(this.victoryCountdownTimer);
      this.victoryCountdownTimer = null;
    }

    this.state.victoryCountdown = 4;
    this.notify({ type: 'VICTORY' });
    this.notify({ type: 'VICTORY_COUNTDOWN', seconds: 4 });

    this.victoryCountdownTimer = setInterval(() => {
      if (this.state.status !== 'victory') {
        clearInterval(this.victoryCountdownTimer);
        this.victoryCountdownTimer = null;
        return;
      }

      this.state.victoryCountdown = Math.max(0, (this.state.victoryCountdown ?? 4) - 1);
      this.notify({ type: 'VICTORY_COUNTDOWN', seconds: this.state.victoryCountdown });

      if (this.state.victoryCountdown <= 0) {
        clearInterval(this.victoryCountdownTimer);
        this.victoryCountdownTimer = null;

        const wasAuto247 = this.isAuto247Running;
        const wasAutoTesting = this.isAutoTesting;
        const isAutoLoop = this.state.autoLoop247;

        this.resetRound();

        // Nếu đang bật chế độ Auto 24/7 hoặc Auto Test thì tiếp tục chạy vòng mới ngay lập tức
        if (wasAuto247 || isAutoLoop) {
          setTimeout(() => {
            if (this.state.status === 'playing') {
              this.startAuto247Loop();
            }
          }, 300);
        } else if (wasAutoTesting) {
          setTimeout(() => {
            if (this.state.status === 'playing') {
              this.startAutoTestLoop();
            }
          }, 300);
        }
      }
    }, 1000);
  }

  resetRound() {
    if (this.victoryCountdownTimer) {
      clearInterval(this.victoryCountdownTimer);
      this.victoryCountdownTimer = null;
    }

    // Lưu lại session trước khi reset nếu có người cắm cờ
    if (this.state.claimedCount > 0 && this.state.status !== 'victory') {
      this.saveSessionSnapshot();
    }

    this.state.status = 'playing';
    this.state.roundId = `RD-${Date.now().toString().slice(-4)}`;
    this.state.claimedCount = 0;
    this.state.remainingCells = this.state.totalCells;
    this.state.percent = 0;
    this.state.cellsById = {};
    
    this.cellRenderQueue = [];
    this.reservedCellIds.clear();
    if (this.queueTimer) {
      clearInterval(this.queueTimer);
      this.queueTimer = null;
    }

    this.state.victory = null;
    this.state.victoryCountdown = 0;
    this.state.leaderboard = [];
    this.state.activeFlagPoles = [];
    this.state.lastFocalTarget = null;
    this.state.combo = { userId: null, username: null, count: 0, level: 1, multiplier: 1, active: false, expiresAt: 0 };
    this.state.boss.active = false;
    this.state.activeMission = null;

    this.bannerEngine.reset();
    this.state.bannerCells = [...this.bannerEngine.cells];
    this.state.bannerClaimedCount = 0;

    Object.values(this.state.provincesStatus).forEach(p => {
      p.claimedCount = 0;
      p.isCompleted = false;
      p.leader = null;
    });

    try {
      localStorage.removeItem('avalive_bando_leaderboard');
    } catch (e) {}

    this.emitState();
  }

  resetLeaderboard() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('avalive_bando_leaderboard');
    }
  }

  // ==========================================
  // LƯU TRỮ & TÁI SỬ DỤNG PHIÊN LIVE (SESSION PERSISTENCE)
  // ==========================================
  saveSessionSnapshot() {
    if (typeof localStorage === 'undefined') return;
    try {
      const sessionData = {
        id: `session_${Date.now()}`,
        roundId: this.state.roundId,
        countryId: this.currentCountry?.id || 'vietnam',
        countryName: this.currentCountry?.name || 'Việt Nam',
        totalCells: this.state.totalCells,
        claimedCount: this.state.claimedCount,
        percent: this.state.percent,
        leaderboard: [...(this.state.leaderboard || [])],
        mvp: this.state.victory?.mvpUser || this.state.leaderboard[0] || null,
        top30: this.state.victory?.top30 || (this.state.leaderboard || []).slice(0, 30),
        status: this.state.status,
        savedAt: new Date().toISOString(),
        savedAtText: new Date().toLocaleString('vi-VN')
      };

      const existingSessions = JSON.parse(localStorage.getItem('avalive_bando_history_sessions') || '[]');
      const updated = [sessionData, ...existingSessions.filter(s => s.roundId !== this.state.roundId || Math.abs(new Date(s.savedAt).getTime() - Date.now()) > 60000)].slice(0, 50);
      localStorage.setItem('avalive_bando_history_sessions', JSON.stringify(updated));
      
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('avalive_bando_session_saved', { detail: sessionData }));
      }
      return sessionData;
    } catch (e) {
      console.warn('[BandoEngine] Failed to save session snapshot:', e);
    }
  }

  getSessionHistory() {
    if (typeof localStorage === 'undefined') return [];
    try {
      return JSON.parse(localStorage.getItem('avalive_bando_history_sessions') || '[]');
    } catch (e) {
      return [];
    }
  }

  restoreSessionSnapshot(sessionOrId) {
    let session = typeof sessionOrId === 'string' 
      ? this.getSessionHistory().find(s => s.id === sessionOrId || s.roundId === sessionOrId)
      : sessionOrId;

    if (!session) return false;
    
    if (Array.isArray(session.leaderboard) && session.leaderboard.length > 0) {
      this.state.leaderboard = [...session.leaderboard];
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('avalive_bando_leaderboard', JSON.stringify(this.state.leaderboard));
      }
    }
    
    this.addEventLog(`♻️ Đã khôi phục dữ liệu phiên live: ${session.roundId} (${session.savedAtText || ''})`, 'system');
    this.notify({ type: 'SESSION_RESTORED', session });
    return true;
  }

  clearSessionHistory() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('avalive_bando_history_sessions');
    }
    this.notify({ type: 'SESSION_HISTORY_CLEARED' });
  }

  resetGame() {
    this.resetRound();
  }

  // ==================== HỆ THỐNG AUTO 24/7 TOÀN DIỆN (CHẠY THẬT LIVE TIKTOK) ====================
  setAutoLoop247(enabled) {
    this.state.autoLoop247 = !!enabled;
    this.saveSettings();
    this.notify({ type: 'AUTO_LOOP_CHANGED', autoLoop247: this.state.autoLoop247 });
  }

  // Bật chế độ VẬN HÀNH THẬT 24/7: Tự động chạy live, phát nhạc nền & BLV, nhận quà thật từ TikTok để cắm cờ, tự động qua màn mới
  startAuto247Loop() {
    this.stopAuto247Loop();
    this.stopAutoTestLoop();
    this.isAuto247Running = true;
    this.state.isAuto247Running = true;

    // 1. Mở khóa và phát Nhạc Nền BGM tự động 24/24
    bandoAudio.unlock();
    if (!bandoAudio.bgmPlaying) {
      bandoAudio.startSyntheticBgm();
    }

    // 2. Kích hoạt giọng bình luận viên AI (BLV) định kỳ
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('bando-auto-247-started', { detail: { running: true } }));
    }

    this.notify({ type: 'AUTO_247_STATUS', running: true });
  }

  stopAuto247Loop() {
    this.isAuto247Running = false;
    this.state.isAuto247Running = false;
    if (this.auto247Timer) {
      clearInterval(this.auto247Timer);
      this.auto247Timer = null;
    }
    this.notify({ type: 'AUTO_247_STATUS', running: false });
  }

  toggleAuto247() {
    if (this.isAuto247Running) {
      this.stopAuto247Loop();
    } else {
      this.startAuto247Loop();
    }
  }

  // Chạy Test Tự Động Toàn Bộ Danh Mục Quà (Demo Test Loop như chạy thật 100%)
  startAutoTestLoop(onProgress = null) {
    if (this.isAutoTesting) {
      this.stopAutoTestLoop();
      return;
    }
    this.isAutoTesting = true;
    bandoAudio.unlock();

    let step = 0;
    const runStep = () => {
      if (!this.isAutoTesting) {
        this.stopAutoTestLoop();
        return;
      }
      if (this.state.status === 'victory') {
        this.resetGame();
      }

      const gifts = this.state.gifts || DEFAULT_MAP_GIFTS;
      const gift = gifts[step % gifts.length];
      const user = MOCK_WARRIORS_POOL[step % MOCK_WARRIORS_POOL.length];
      const count = (step % 4 === 0 && gift.cells <= 10) ? 5 : (step % 6 === 0 ? 2 : 1);

      this.processGift(gift.id, count, user);

      if (step === 8) this.triggerMission();
      if (step === 15) this.triggerBossEvent();

      step++;
      if (onProgress) onProgress(step, gift.name);
    };

    // Bắn phát quà đầu tiên ngay lập tức, sau đó lặp đều 3.5 giây mỗi món quà để quan sát trọn vẹn chu kỳ zoom cắm cờ và bảng tên ID
    runStep();
    this.autoTestTimer = setInterval(runStep, 3500);
    this.notify({ type: 'AUTO_TEST_STATUS', running: true });
  }

  stopAutoTestLoop() {
    this.isAutoTesting = false;
    if (this.autoTestTimer) {
      clearInterval(this.autoTestTimer);
      this.autoTestTimer = null;
    }
    this.notify({ type: 'AUTO_TEST_STATUS', running: false });
  }

  setDemoMode(enabled) {
    this.state.isDemoMode = !!enabled;
    this.saveToStorage();
    this.notify({ type: 'DEMO_MODE_CHANGED', isDemoMode: this.state.isDemoMode });
  }

  setCameraPreset(preset) {
    this.state.cameraPreset = preset;
    this.notify({ type: 'CAMERA_PRESET_CHANGED', preset });
  }

  updateSettings(newSettings) {
    this.state.settings = { ...this.state.settings, ...newSettings };
    this.saveToStorage();
    this.notify({ type: 'SETTINGS_UPDATED', settings: this.state.settings });
  }

  setTheme(theme) {
    const validTheme = theme === 'light' ? 'light' : 'dark';
    this.updateSettings({ theme: validTheme });
  }

  updateMapTexts(newTexts) {
    this.state.mapTexts = newTexts;
    if (this.countries[this.state.selectedCountry]) {
      this.countries[this.state.selectedCountry].labels = newTexts;
    }
    this.saveToStorage();
    this.notify({ type: 'MAP_TEXTS_UPDATED', mapTexts: newTexts });
  }

  addMapText(textObj) {
    const item = {
      id: textObj.id || `text_${Date.now()}`,
      text: textObj.text || 'Nhãn Địa Danh',
      wx: textObj.wx ?? 0,
      wy: textObj.wy ?? 3.5,
      wz: textObj.wz ?? 0,
      color: textObj.color || '#facc15',
      glow: !!textObj.glow,
    };
    this.state.mapTexts = [...this.state.mapTexts, item];
    if (this.countries[this.state.selectedCountry]) {
      this.countries[this.state.selectedCountry].labels = this.state.mapTexts;
    }
    this.saveToStorage();
    this.notify({ type: 'MAP_TEXTS_UPDATED', mapTexts: this.state.mapTexts });
  }

  removeMapText(textId) {
    this.state.mapTexts = this.state.mapTexts.filter(t => t.id !== textId);
    if (this.countries[this.state.selectedCountry]) {
      this.countries[this.state.selectedCountry].labels = this.state.mapTexts;
    }
    this.saveToStorage();
    this.notify({ type: 'MAP_TEXTS_UPDATED', mapTexts: this.state.mapTexts });
  }

  updateGiftConfig(newGifts) {
    this.state.gifts = newGifts;
    this.saveToStorage();
    try {
      saveGiftConfig('map', { gifts: newGifts });
    } catch (e) {}
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('avalive_gift_config_updated', {
        detail: { mode: 'map', gifts: newGifts }
      }));
    }
    this.notify({ type: 'GIFTS_UPDATED', gifts: newGifts });
  }

  addGift(newGift) {
    if (!newGift || !newGift.name) return;
    const gifts = this.state.gifts || DEFAULT_MAP_GIFTS;
    const id = newGift.id || `gift_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const gift = {
      id,
      name: newGift.name,
      icon: newGift.icon || '🎁',
      cells: Math.max(1, parseInt(newGift.cells) || 1),
      color: newGift.color || '#f59e0b',
      tier: newGift.tier || 'common',
      priceToken: Math.max(1, parseInt(newGift.priceToken) || parseInt(newGift.cells) || 1),
    };
    const updated = [gift, ...gifts];
    this.updateGiftConfig(updated);
    return gift;
  }

  removeGift(giftId) {
    const gifts = this.state.gifts || DEFAULT_MAP_GIFTS;
    const updated = gifts.filter(g => g.id !== giftId);
    this.updateGiftConfig(updated);
  }

  updateGift(giftId, fields) {
    const gifts = this.state.gifts || DEFAULT_MAP_GIFTS;
    const updated = gifts.map(g => {
      if (g.id === giftId) {
        return {
          ...g,
          ...fields,
          cells: fields.cells !== undefined ? Math.max(1, parseInt(fields.cells) || 1) : g.cells,
          priceToken: fields.priceToken !== undefined ? Math.max(1, parseInt(fields.priceToken) || 1) : g.priceToken,
        };
      }
      return g;
    });
    this.updateGiftConfig(updated);
  }

  resetDefaultGifts() {
    this.updateGiftConfig([...DEFAULT_MAP_GIFTS]);
  }

  setAutoRotate(enabled) {
    this.state.autoRotate = !!enabled;
    this.saveToStorage();
    this.notify({ type: 'AUTO_ROTATE_CHANGED', autoRotate: this.state.autoRotate });
  }

  toggleAutoRotate() {
    this.setAutoRotate(!this.state.autoRotate);
    return this.state.autoRotate;
  }

  addCustomProvince(countryKey, prov) {
    const targetKey = countryKey || this.state.selectedCountry;
    const country = this.countries[targetKey] || COUNTRIES_BY_ID[targetKey];
    if (!country) return;

    if (!country.provinces) country.provinces = [];
    const newProv = {
      id: prov.id || `${targetKey}_custom_${Date.now()}`,
      name: prov.name || 'Vùng Miền Mới',
      totalCells: Number(prov.totalCells) || 500,
    };

    country.provinces.push(newProv);

    // If currently playing this country, update provincesStatus
    if (this.state.selectedCountry === targetKey) {
      if (!this.state.provincesStatus) this.state.provincesStatus = {};
      this.state.provincesStatus[newProv.id] = {
        id: newProv.id,
        name: newProv.name,
        totalCells: newProv.totalCells,
        claimedCount: 0,
        isCompleted: false,
        leader: null
      };
    }

    this.saveToStorage();
    this.notify({ type: 'PROVINCES_UPDATED', countryKey: targetKey, provinces: country.provinces });
  }

  removeCustomProvince(countryKey, provId) {
    const targetKey = countryKey || this.state.selectedCountry;
    const country = this.countries[targetKey] || COUNTRIES_BY_ID[targetKey];
    if (!country || !country.provinces) return;

    country.provinces = country.provinces.filter(p => p.id !== provId);
    if (this.state.selectedCountry === targetKey && this.state.provincesStatus) {
      delete this.state.provincesStatus[provId];
    }

    this.saveToStorage();
    this.notify({ type: 'PROVINCES_UPDATED', countryKey: targetKey, provinces: country.provinces });
  }

  restoreDefaultCountryConfig(countryKey) {
    const defaultPreset = COUNTRIES_BY_ID[countryKey] || WORLD_COUNTRIES[0];
    this.countries[countryKey] = JSON.parse(JSON.stringify(defaultPreset));
    if (this.state.selectedCountry === countryKey) {
      this.switchCountry(countryKey);
    }
    this.saveToStorage();
  }

  destroy() {
    this.stopAutoTest();
    this.stopAuto247();
    if (this.bossTimer) {
      clearInterval(this.bossTimer);
      this.bossTimer = null;
    }
    if (this.victoryCountdownTimer) {
      clearInterval(this.victoryCountdownTimer);
      this.victoryCountdownTimer = null;
    }
    this.listeners = [];
  }
}

export const bandoEngine = new BanDoGameEngine();
export default bandoEngine;
