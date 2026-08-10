// Dữ liệu cấu hình mặc định cho module "Sàn Nhảy TikTok" — config-driven, không hard-code vào engine.
// Admin có thể chỉnh sửa toàn bộ danh sách này qua UI (DanceFloorRuleBuilder / DanceFloorLibraryPanel)
// mà không cần deploy lại code.
//
// Lưu ý về nhóm "Người Nổi Tiếng": để tránh rủi ro sử dụng tên/hình ảnh người thật ngoài đời khi
// chưa có sự cho phép, các nhân vật này dùng danh xưng NGHỀ NGHIỆP chung (vd "Cầu Thủ Ngôi Sao",
// "Diva Nhạc Việt"...) thay vì tên riêng cụ thể. Viewer vẫn có thể "gọi tên" bằng các biệt danh quen
// thuộc qua callNames. Nếu admin muốn gắn đúng tên một người cụ thể, dùng mục "Nhân Vật Tuỳ Chỉnh"
// trong Thư Viện để tự đặt tên theo trách nhiệm của admin.

export const DANCE_STYLES = [
  { id: "dance_bounce", name: "Dance Cơ Bản", animationClass: "animate-dance-bounce", durationSeconds: 8 },
  { id: "dance_groove", name: "Hiphop Groove", animationClass: "animate-dance-groove", durationSeconds: 8 },
  { id: "dance_spin", name: "K-pop Xoay Vòng", animationClass: "animate-dance-spin", durationSeconds: 10 },
  { id: "dance_jump", name: "Nhảy Cao (Jump)", animationClass: "animate-dance-jump", durationSeconds: 6 },
  { id: "dance_wave", name: "Sóng Sánh (Wave)", animationClass: "animate-dance-wave", durationSeconds: 8 },
  { id: "dance_victory", name: "Điệu Chiến Thắng", animationClass: "animate-dance-spin", durationSeconds: 12 },
  { id: "dance_shuffle", name: "Shuffle Dance (Trend)", animationClass: "animate-dance-shuffle", durationSeconds: 8 },
  { id: "dance_floss", name: "Floss Dance (Trend)", animationClass: "animate-dance-floss", durationSeconds: 8 },
  { id: "dance_lock", name: "Popping & Locking", animationClass: "animate-dance-lock", durationSeconds: 9 },
  { id: "dance_salsa", name: "Salsa Lắc Hông", animationClass: "animate-dance-salsa", durationSeconds: 8 },
  { id: "dance_breakdance", name: "Breakdance Xoay Nhanh", animationClass: "animate-dance-breakdance", durationSeconds: 7 },
  { id: "dance_moonwalk", name: "Moonwalk Trượt Ngầu", animationClass: "animate-dance-moonwalk", durationSeconds: 9 },
  { id: "dance_clap", name: "Nhảy Vỗ Tay Sôi Động", animationClass: "animate-dance-clap", durationSeconds: 6 },
  { id: "dance_wavearms", name: "Sóng Tay Mượt Mà", animationClass: "animate-dance-wavearms", durationSeconds: 8 },
];

// Gợi ý điệu nhảy phù hợp theo từng loại nhạc — dùng cho nút "Auto Gợi Ý Nhảy Theo Nhạc".
// Nhạc chưa có trong bảng (vd nhạc admin tự tải lên) sẽ chọn ngẫu nhiên trong toàn bộ thư viện.
export const SOUND_DANCE_SUGGESTIONS = {

  genre_0: ["dance_auto_1", "dance_auto_2", "dance_auto_3"], // Vinahouse
  genre_1: ["dance_auto_3", "dance_auto_4", "dance_auto_5"], // EDM
  genre_2: ["dance_auto_5", "dance_auto_6", "dance_auto_7"], // Kpop
  genre_3: ["dance_auto_7", "dance_auto_8", "dance_auto_9"], // Vpop
  genre_4: ["dance_auto_9", "dance_auto_10", "dance_auto_11"], // USUK
  genre_5: ["dance_auto_11", "dance_auto_12", "dance_auto_13"], // Bolero Remix
  genre_6: ["dance_auto_13", "dance_auto_14", "dance_auto_15"], // Lofi Chill
  genre_7: ["dance_auto_15", "dance_auto_16", "dance_auto_17"], // Deep House
  genre_8: ["dance_auto_17", "dance_auto_18", "dance_auto_19"], // Trance
  genre_9: ["dance_auto_19", "dance_auto_20", "dance_auto_21"], // Dubstep
  genre_10: ["dance_auto_21", "dance_auto_22", "dance_auto_23"], // Trap
  genre_11: ["dance_auto_23", "dance_auto_24", "dance_auto_25"], // Hip Hop
  genre_12: ["dance_auto_25", "dance_auto_26", "dance_auto_27"], // RnB
  genre_13: ["dance_auto_27", "dance_auto_28", "dance_auto_29"], // Reggaeton
  genre_14: ["dance_auto_29", "dance_auto_30", "dance_auto_31"], // Salsa
  genre_15: ["dance_auto_31", "dance_auto_32", "dance_auto_33"], // Tango
  genre_16: ["dance_auto_33", "dance_auto_34", "dance_auto_35"], // Bachata
  genre_17: ["dance_auto_35", "dance_auto_36", "dance_auto_37"], // Mambo
  genre_18: ["dance_auto_37", "dance_auto_38", "dance_auto_39"], // Cha Cha Cha
  genre_19: ["dance_auto_39", "dance_auto_40", "dance_auto_41"], // Rumba
  genre_20: ["dance_auto_41", "dance_auto_42", "dance_auto_43"], // Jive
  genre_21: ["dance_auto_43", "dance_auto_44", "dance_auto_45"], // Paso Doble
  genre_22: ["dance_auto_45", "dance_auto_46", "dance_auto_47"], // Samba
  genre_23: ["dance_auto_47", "dance_auto_48", "dance_auto_49"], // Quickstep
  genre_24: ["dance_auto_49", "dance_auto_50", "dance_auto_51"], // Waltz
  genre_25: ["dance_auto_51", "dance_auto_52", "dance_auto_53"], // Viennese Waltz
  genre_26: ["dance_auto_53", "dance_auto_54", "dance_auto_55"], // Foxtrot
  genre_27: ["dance_auto_55", "dance_auto_56", "dance_auto_57"], // Tango
  genre_28: ["dance_auto_57", "dance_auto_58", "dance_auto_59"], // Disco
  genre_29: ["dance_auto_59", "dance_auto_60", "dance_auto_61"], // Funk
  genre_30: ["dance_auto_61", "dance_auto_62", "dance_auto_63"], // Soul
  genre_31: ["dance_auto_63", "dance_auto_64", "dance_auto_65"], // Jazz
  genre_32: ["dance_auto_65", "dance_auto_66", "dance_auto_67"], // Blues
  genre_33: ["dance_auto_67", "dance_auto_68", "dance_auto_69"], // Rock
  genre_34: ["dance_auto_69", "dance_auto_70", "dance_auto_71"], // Metal
  genre_35: ["dance_auto_71", "dance_auto_72", "dance_auto_73"], // Punk
  genre_36: ["dance_auto_73", "dance_auto_74", "dance_auto_75"], // Pop
  genre_37: ["dance_auto_75", "dance_auto_76", "dance_auto_77"], // Indie
  genre_38: ["dance_auto_77", "dance_auto_78", "dance_auto_79"], // Folk
  genre_39: ["dance_auto_79", "dance_auto_80", "dance_auto_81"], // Country
  genre_40: ["dance_auto_81", "dance_auto_82", "dance_auto_83"], // Reggae
  genre_41: ["dance_auto_83", "dance_auto_84", "dance_auto_85"], // Ska
  genre_42: ["dance_auto_85", "dance_auto_86", "dance_auto_87"], // Dancehall
  genre_43: ["dance_auto_87", "dance_auto_88", "dance_auto_89"], // Afrobeat
  genre_44: ["dance_auto_89", "dance_auto_90", "dance_auto_91"], // Zouk
  genre_45: ["dance_auto_91", "dance_auto_92", "dance_auto_93"], // Kizomba
  genre_46: ["dance_auto_93", "dance_auto_94", "dance_auto_95"], // Semba
  genre_47: ["dance_auto_95", "dance_auto_96", "dance_auto_97"], // Kuduro
  genre_48: ["dance_auto_97", "dance_auto_98", "dance_auto_99"], // Tarraxinha
  genre_49: ["dance_auto_99", "dance_auto_100", "dance_auto_1"], // Ghetto Zouk
  sfx_default: ["dance_bounce", "dance_groove", "dance_wavearms"],
  sfx_silver: ["dance_groove", "dance_wave", "dance_salsa"],
  sfx_gold: ["dance_victory", "dance_spin", "dance_lock"],
  sfx_vip: ["dance_victory", "dance_lock", "dance_spin"],
  sfx_fire: ["dance_breakdance", "dance_jump", "dance_lock"],
  sfx_bell: ["dance_clap", "dance_bounce"],
  sfx_cute: ["dance_wave", "dance_salsa", "dance_bounce"],
  sfx_funny: ["dance_moonwalk", "dance_lock", "dance_floss"],
  sfx_energy: ["dance_jump", "dance_breakdance", "dance_shuffle"],
};

export const DANCE_EFFECTS = [
  { id: "fx_fireworks", name: "Pháo Hoa", emoji: "🎆", particle: "burst", color: "#EF4444" },
  { id: "fx_confetti", name: "Confetti", emoji: "🎊", particle: "fall", color: "#8B5CF6" },
  { id: "fx_hearts", name: "Trái Tim", emoji: "❤️", particle: "rise", color: "#EC4899" },
  { id: "fx_neon", name: "Đèn Neon", emoji: "✨", particle: "rise", color: "#3B82F6" },
  { id: "fx_gold", name: "Hào Quang Vàng", emoji: "🌟", particle: "burst", color: "#F59E0B" },
  { id: "fx_snow", name: "Tuyết Rơi", emoji: "❄️", particle: "fall", color: "#93C5FD" },
  { id: "fx_rain", name: "Mưa", emoji: "💧", particle: "fall", color: "#60A5FA" },
  { id: "fx_fire", name: "Lửa", emoji: "🔥", particle: "rise", color: "#F97316" },
  { id: "fx_explosion", name: "Nổ Tung", emoji: "💥", particle: "burst", color: "#DC2626" },
  { id: "fx_stars", name: "Ngôi Sao", emoji: "⭐", particle: "rise", color: "#FACC15" },
  { id: "fx_magic", name: "Ma Thuật", emoji: "🪄", particle: "burst", color: "#A855F7" },
  { id: "fx_smoke", name: "Khói", emoji: "💨", particle: "rise", color: "#9CA3AF" },
  { id: "fx_lightning", name: "Sét Đánh", emoji: "⚡", particle: "burst", color: "#FACC15" },
  { id: "fx_bubbles", name: "Bong Bóng", emoji: "🫧", particle: "rise", color: "#38BDF8" },
  { id: "fx_petals", name: "Cánh Hoa Rơi", emoji: "🌸", particle: "fall", color: "#F472B6" },
  { id: "fx_money", name: "Mưa Tiền", emoji: "💵", particle: "fall", color: "#22C55E" },
  { id: "fx_diamond_rain", name: "Mưa Kim Cương", emoji: "💠", particle: "burst", color: "#22D3EE" },
  { id: "fx_laugh", name: "Cười Sảng Khoái", emoji: "😂", particle: "rise", color: "#FBBF24" },
  { id: "fx_clap", name: "Vỗ Tay", emoji: "👏", particle: "rise", color: "#F59E0B" },
  { id: "fx_skull", name: "Hài Hước Đen", emoji: "💀", particle: "burst", color: "#9CA3AF" },
];

// Phong cách bình luận riêng cho từng phiên live — chỉ chi phối "giọng người dẫn" (auto-reply Q&A +
// lời cảm ơn quà tặng), KHÔNG đổi tính cách gốc của từng nhân vật để giữ bản sắc riêng ổn định.
export const COMMENTARY_STYLES = [
  { id: "balanced", name: "Cân Bằng Tự Nhiên", biasPersonalities: null },
  { id: "funny_show", name: "Hài Hước Tấu Hài", biasPersonalities: ["funny", "sassy"] },
  { id: "sweet_cute", name: "Ngọt Ngào Dễ Thương", biasPersonalities: ["cute"] },
  { id: "luxury_high", name: "Sang Chảnh Cao Cấp", biasPersonalities: ["luxury", "cool"] },
  { id: "genz_energetic", name: "Nhí Nhảnh Gen Z", biasPersonalities: ["energetic", "sassy"] },
];

// Tông giọng đọc (Web Speech API) theo tính cách — miễn phí, chạy ngay trong trình duyệt, không cần API key.
export const VOICE_PROFILES = {
  cute: { pitch: 1.7, rate: 1.05 },
  cool: { pitch: 0.75, rate: 0.92 },
  funny: { pitch: 1.5, rate: 1.15 },
  luxury: { pitch: 0.85, rate: 0.85 },
  energetic: { pitch: 1.4, rate: 1.25 },
  sassy: { pitch: 1.25, rate: 1.05 },
};

// Câu trả lời tự động theo mẫu câu hỏi thường gặp — admin thêm/sửa/xoá được qua Auto-Reply Panel,
// không phải luật từ khoá sinh nhân vật mà là lớp "trò chuyện" độc lập, phản hồi MỌI bình luận phù hợp.
export const AUTO_REPLY_RULES = [
  {
    id: "qa_price", matchKeywords: ["gia bao nhieu", "bao nhieu tien", "gia the nao"], enabled: true,
    replyTemplates: [
      "Dạ {username} ơi, giá thì để MC AI xuống sàn tiết lộ sau, spam tim lẹ lên nào! 😄",
      "{username} hỏi giá hả? Rẻ bất ngờ, nhưng phải xem hết clip mới biết nha!",
    ],
  },
  {
    id: "qa_how_to_call", matchKeywords: ["lam sao goi", "goi nhan vat the nao", "cach choi"], enabled: true,
    replyTemplates: [
      "{username} chỉ cần gõ đúng tên nhân vật là gọi được liền, dễ ợt luôn!",
      "Gõ tên nhân vật ra là auto nhảy cho {username} xem ngay!",
    ],
  },
  {
    id: "qa_gift_how", matchKeywords: ["tang qua the nao", "gift la gi", "tang gi"], enabled: true,
    replyTemplates: [
      "{username} tặng quà càng lớn, nhân vật càng xịn xuất hiện lâu hơn đó nha!",
      "Quà nhỏ cũng vui rồi, {username} tặng phát là sàn nhảy nổ tung liền!",
    ],
  },
  {
    id: "qa_greeting", matchKeywords: ["chao ca nha", "hello", "hi ca nha", "chao shop"], enabled: true,
    replyTemplates: [
      "Chào {username} đã ghé sàn nhảy, quẩy cùng tụi mình luôn nha!",
      "{username} đến rồi kìa, mở nhạc lên chào đón nào!",
    ],
  },
  {
    id: "qa_bored", matchKeywords: ["chan qua", "buon ngu", "chan the"], enabled: true,
    replyTemplates: [
      "{username} đang chán hả, để tụi mình quẩy cho hết chán liền!",
      "Buồn gì buồn, {username} gõ tên nhân vật lên là hết chán ngay!",
    ],
  },
];

// Đã xoá bộ "âm thanh demo" (tone bíp tự sinh bằng Web Audio API, không phải nhạc thật) theo yêu cầu —
// chỉ dùng nhạc/âm thanh THẬT do admin tải lên (xem Thư Viện Âm Thanh trong DanceFloorLibraryPanel).

export const SCENE_BACKGROUNDS = [
  { id: "scene_neon_club", name: "Neon Club", gradient: "from-purple-950 via-[#0A0A0A] to-blue-950" },
  { id: "scene_gold_room", name: "Phòng VIP Vàng", gradient: "from-amber-950 via-[#0A0A0A] to-yellow-900" },
  { id: "scene_rain_night", name: "Đêm Mưa", gradient: "from-slate-900 via-[#0A0A0A] to-blue-950" },
  { id: "scene_fire_stage", name: "Sân Khấu Lửa", gradient: "from-red-950 via-[#0A0A0A] to-orange-950" },
  { id: "scene_pink_dream", name: "Mộng Hồng", gradient: "from-pink-900 via-[#0A0A0A] to-fuchsia-950" },
  { id: "scene_cyber_city", name: "Cyber City", gradient: "from-cyan-950 via-[#0A0A0A] to-indigo-950" },
  { id: "scene_beach_sunset", name: "Hoàng Hôn Biển", gradient: "from-orange-900 via-[#0A0A0A] to-rose-950" },
  { id: "scene_starry_night", name: "Đêm Sao Băng", gradient: "from-indigo-950 via-[#0A0A0A] to-slate-950" },
];

// Bảng luật từ khoá mặc định — admin chỉnh sửa được qua Rule Builder, không cần sửa code.
export const DEFAULT_KEYWORD_RULES = [
  { id: "rule_hey", keyword: "hey", platform: "all", characterId: "girl_neon", danceId: "dance_bounce", effectId: "fx_neon", soundId: "sfx_default", spawnsCharacter: true, spawnCount: 1, sceneId: null, duration: 8, priority: 3, cooldownSec: 3, enabled: true },
  { id: "rule_hay", keyword: "hay", platform: "all", characterId: "boy_street", danceId: "dance_groove", effectId: "fx_fireworks", soundId: "sfx_default", spawnsCharacter: true, spawnCount: 1, sceneId: null, duration: 8, priority: 3, cooldownSec: 3, enabled: true },
  { id: "rule_dance", keyword: "dance", platform: "all", characterId: "anime_girl", danceId: "dance_spin", effectId: "fx_confetti", soundId: "sfx_default", spawnsCharacter: true, spawnCount: 3, sceneId: null, duration: 10, priority: 3, cooldownSec: 5, enabled: true },
  { id: "rule_jump", keyword: "jump", platform: "all", characterId: "robot", danceId: "dance_jump", effectId: "fx_stars", soundId: "sfx_default", spawnsCharacter: true, spawnCount: 1, sceneId: null, duration: 6, priority: 2, cooldownSec: 3, enabled: true },
  { id: "rule_fire", keyword: "fire", platform: "all", characterId: null, danceId: null, effectId: "fx_explosion", soundId: "sfx_fire", spawnsCharacter: false, spawnCount: 0, sceneId: "scene_fire_stage", duration: 5, priority: 4, cooldownSec: 4, enabled: true },
  { id: "rule_love", keyword: "love", platform: "all", characterId: "fantasy_fairy", danceId: "dance_wave", effectId: "fx_hearts", soundId: "sfx_default", spawnsCharacter: true, spawnCount: 1, sceneId: null, duration: 8, priority: 2, cooldownSec: 3, enabled: true },
  { id: "rule_wow", keyword: "wow", platform: "all", characterId: "animal_cat", danceId: "dance_bounce", effectId: "fx_magic", soundId: "sfx_default", spawnsCharacter: true, spawnCount: 1, sceneId: null, duration: 6, priority: 2, cooldownSec: 3, enabled: true },
  { id: "rule_go", keyword: "go", platform: "all", characterId: "superhero", danceId: "dance_jump", effectId: "fx_smoke", soundId: "sfx_default", spawnsCharacter: true, spawnCount: 1, sceneId: null, duration: 6, priority: 2, cooldownSec: 3, enabled: true },
  { id: "rule_vip", keyword: "vip", platform: "all", characterId: "diamond_vip", danceId: "dance_victory", effectId: "fx_gold", soundId: "sfx_vip", spawnsCharacter: true, spawnCount: 1, sceneId: "scene_gold_room", duration: 15, priority: 5, cooldownSec: 6, enabled: true },
  { id: "rule_king", keyword: "king", platform: "all", characterId: "king_gold", danceId: "dance_victory", effectId: "fx_gold", soundId: "sfx_gold", spawnsCharacter: true, spawnCount: 1, sceneId: "scene_gold_room", duration: 12, priority: 4, cooldownSec: 5, enabled: true },
  { id: "rule_queen", keyword: "queen", platform: "all", characterId: "queen_gold", danceId: "dance_spin", effectId: "fx_gold", soundId: "sfx_gold", spawnsCharacter: true, spawnCount: 1, sceneId: "scene_gold_room", duration: 12, priority: 4, cooldownSec: 5, enabled: true },
  { id: "rule_lol", keyword: "lol", platform: "all", characterId: "animal_cat", danceId: "dance_wave", effectId: "fx_stars", soundId: "sfx_default", spawnsCharacter: true, spawnCount: 1, sceneId: null, duration: 6, priority: 1, cooldownSec: 3, enabled: true },
  { id: "rule_party", keyword: "party", platform: "all", characterId: "anime_girl", danceId: "dance_groove", effectId: "fx_confetti", soundId: "sfx_default", spawnsCharacter: true, spawnCount: 2, sceneId: null, duration: 10, priority: 3, cooldownSec: 5, enabled: true },
  { id: "rule_win", keyword: "win", platform: "all", characterId: "superhero", danceId: "dance_victory", effectId: "fx_stars", soundId: "sfx_default", spawnsCharacter: true, spawnCount: 1, sceneId: null, duration: 8, priority: 3, cooldownSec: 4, enabled: true },
  { id: "rule_gg", keyword: "gg", platform: "all", characterId: "robot", danceId: "dance_victory", effectId: "fx_smoke", soundId: "sfx_default", spawnsCharacter: true, spawnCount: 1, sceneId: null, duration: 6, priority: 1, cooldownSec: 3, enabled: true },
  { id: "rule_rain", keyword: "rain", platform: "all", characterId: null, danceId: null, effectId: "fx_rain", soundId: "sfx_default", spawnsCharacter: false, spawnCount: 0, sceneId: "scene_rain_night", duration: 10, priority: 2, cooldownSec: 6, enabled: true },
];

// Chế độ nhảy theo số lượng nhân vật cùng lúc — quy đổi số người thật khi 1 lượt quà kích hoạt nhảy
// đôi/3/nhóm (các nhân vật cùng lượt sẽ đứng gần nhau + đồng bộ pha nhảy trên Sàn 3D).
export const DANCE_MODE_SIZES = { solo: 1, duo: 2, trio: 3, group: 5, all: 8 };
export const DANCE_MODE_LABELS = {
  solo: "Nhảy Đơn", duo: "Nhảy Đôi", trio: "Nhảy Bộ 3", group: "Nhảy Nhóm (5)", all: "Cả Sàn Nhảy (8)",
};

// Bảng cấp bậc quà tặng — quy đổi giá trị quà (đã quy về điểm chung nội bộ) sang đặc quyền hiển thị.
// Mỗi cấp có nhóm nhân vật + nhạc hiệu + chế độ nhảy riêng để "quà khác nhau → nhân vật, nhạc & đội
// hình nhảy khác nhau".
export const GIFT_TIERS = [
  {
    level: 1, name: "Cơ Bản", minPoints: 0,
    characterIds: ["girl_neon", "boy_street", "pet_dog", "pet_chick", "pet_bunny"], danceIds: ["dance_bounce"], effectIds: ["fx_neon"],
    soundId: null, durationSeconds: 15, danceMode: "solo",
    customization: { danceStyleChoice: false },
  },
  {
    level: 2, name: "Bạc", minPoints: 100,
    characterIds: ["anime_girl", "robot", "hot_girl", "hot_boy", "pet_cat2"], danceIds: ["dance_bounce", "dance_groove"], effectIds: ["fx_confetti"],
    soundId: null, durationSeconds: 30, danceMode: "duo",
    customization: { danceStyleChoice: false },
  },
  {
    level: 3, name: "Vàng", minPoints: 500,
    characterIds: ["king_gold", "queen_gold", "superhero", "diva_music", "rapper_star", "football_star", "kpop_idol", "boxing_champion", "animal_lion", "dj_master", "singer_tre"], danceIds: ["dance_groove", "dance_spin", "dance_lock"], effectIds: ["fx_gold", "fx_fireworks"],
    soundId: null, durationSeconds: 60, danceMode: "trio",
    customization: { danceStyleChoice: true, vfxChoice: ["fx_confetti", "fx_gold"] },
  },
  {
    level: 4, name: "Kim Cương / VIP", minPoints: 2000,
    characterIds: ["diamond_vip", "beauty_queen", "tech_billionaire", "mega_streamer", "dragon_vip", "unicorn_vip", "phoenix_vip"], danceIds: ["dance_victory", "dance_spin", "dance_breakdance"], effectIds: ["fx_explosion", "fx_gold", "fx_magic", "fx_diamond_rain"],
    soundId: null, durationSeconds: 120, danceMode: "group",
    customization: { danceStyleChoice: true, vfxChoice: ["fx_confetti", "fx_explosion", "fx_gold"], sceneChoice: true, priorityStageSlot: true },
  },
];

// Quy đổi quà từng nền tảng → điểm chung nội bộ (đơn vị: "điểm sàn nhảy").
export const GIFT_POINT_MAPPING = [
  { platform: "tiktok", giftName: "Rose (Hoa Hồng)", pointValue: 10 },
  { platform: "tiktok", giftName: "Perfume (Nước Hoa)", pointValue: 150 },
  { platform: "tiktok", giftName: "Lion (Sư Tử)", pointValue: 2900 },
  { platform: "youtube", giftName: "Super Chat $2", pointValue: 200 },
  { platform: "youtube", giftName: "Super Chat $5", pointValue: 500 },
  { platform: "youtube", giftName: "Super Chat $50", pointValue: 5000 },
  { platform: "facebook", giftName: "Star (Ngôi Sao)", pointValue: 20 },
  { platform: "facebook", giftName: "Gift Box", pointValue: 300 },
];

export const DEFAULT_SETTINGS = {
  // Giới hạn kỹ thuật thật: hàng chục nghìn nhân vật cùng lúc là bất khả thi cho render 3D thời gian
  // thực trên trình duyệt (đã thống nhất với admin ở vòng trước: tối đa 50-80 nhân vật cùng lúc, tránh
  // giật lag) — 60 là mức cân bằng giữa "đông vui" và mượt mà.
  maxSlots: 60,
  maxTriggersPerUserPerMinute: 5,
  cooldownSecondsDefault: 3,
  soundEnabled: true,
  voiceEnabled: true,
  simulationEnabled: true,
  simulationIntervalMs: 2500,
  commentaryStyleId: "balanced",
  scheduleEnabled: false,
  scheduleStartHour: 0,
  scheduleEndHour: 23,
  customBackgroundImage: null,
  disabledCharacterIds: [],
  disabledDanceIds: [],
  disabledEffectIds: [],
  disabledSceneIds: [],
  disabledSoundIds: [],
  autoShuffleIntervalEnabled: false,
  autoShuffleIntervalMinutes: 5,
  characterSizeScale: "medium", // 'small' | 'medium' | 'large' — cỡ hiển thị mặc định cho nhân vật mới lên sàn
  stageAspectRatio: "16:9", // '16:9' (ngang, YouTube/Facebook) | '9:16' (dọc, TikTok/Reels)
  musicLoopMode: "playlist", // 'playlist' (tự qua bài) | 'single' (lặp lại đúng 1 bài đang phát)
  keepCharactersPermanently: true, // giữ nhân vật trên sàn suốt phiên live thay vì tự biến mất
  autoCameraEnabled: true, // Sàn 3D tự xoay vòng các góc máy quay theo chu kỳ
};

// Hệ số phóng to/nhỏ nhân vật dùng chung cho Sàn 2D (kích thước khung ảnh) và Sàn 3D (scale mô hình).
export const CHARACTER_SIZE_SCALE = { small: 0.65, medium: 1, large: 1.5 };

// Kho câu bình luận phản hồi theo "giọng" tính cách nhân vật — hài hước, đa dạng, không cần gọi AI
// (đúng khuyến nghị "AI không nằm trên realtime critical path" trong bản kế hoạch gốc). Câu có dấu
// phẩy/dấu ba chấm để giọng đọc (Web Speech API) ngắt nghỉ tự nhiên hơn, đỡ đều đều máy móc.
export const REACTION_LINES = {
  cute: [
    "{username} ơi... tớ mắc cỡ quá nè, ra sàn nhảy liền đây! 🥰",
    "Ai gọi tên dễ thương vậy trời, {username} chờ tớ xíu nha!",
    "{username} vừa gọi hả? Tớ nhảy tưng tưng, cho coi nè~",
    "Yeee, {username} gọi đúng lúc tớ đang buồn chân quá đi!",
    "Hihi, {username} ơi, tớ chạy ra liền không kịp chải tóc luôn nè!",
    "Ơ kìa, {username} gọi tên ngọt xớt vậy, tớ xỉu ngang rồi!",
    "{username} ơi, tớ nhảy dễ thương nhất sàn cho mà xem nha!",
    "Dạ có tớ đây, {username} ơi, đợi xíu... tớ ra liền á!",
  ],
  cool: [
    "{username} gọi đúng người rồi đó, xem đẳng cấp nè.",
    "Không cần hò hét, {username} nhìn kỹ đây... mới là chất.",
    "{username} vừa mở khoá độ ngầu cấp max luôn á.",
    "Bình tĩnh xem, {username} ơi, đẳng cấp không cần vội.",
    "{username} gọi tên, tôi xuất hiện, đơn giản vậy thôi.",
    "Cả sàn im lặng nhìn {username} triệu hồi huyền thoại kìa.",
    "{username} ơi, đừng chớp mắt... vì sẽ bỏ lỡ khoảnh khắc này đó.",
    "Ngầu không cần cố, {username} nhìn là biết liền hà.",
  ],
  funny: [
    "{username} gọi tên xong là auto bung xoã liền nha 😂",
    "Trời đất, {username} triệu tập tui giữa lúc đang ăn mì gõ!",
    "{username} ơi, coi chừng tui nhảy dính luôn cái sàn đó nha!",
    "Alo alo, {username} gọi gì đó? Để tui quẩy trước đã!",
    "{username} gọi tên là tim tui đập nhanh hơn cả nhịp nhạc luôn!",
    "Ơ, ai gọi vậy? À {username}, để tui chạy ra... vấp cái ghế cái đã!",
    "{username} ơi, tui nhảy dở lắm nha, nhưng mà vui là chính!",
    "Cả nhà ơi coi nè, {username} vừa triệu hồi trò hề chính hiệu!",
  ],
  luxury: [
    "{username} đã triệu hồi đẳng cấp thượng lưu, xin mời chiêm ngưỡng.",
    "Kính thưa quý khách {username}, hào quang đã xuất hiện.",
    "{username} gọi tên sang trọng thế này, sàn nhảy phải dát vàng thôi.",
    "Đẳng cấp không cần giải thích, {username} tự khắc hiểu.",
    "{username} ơi, mời quý vị đứng dậy... vì huyền thoại đã bước ra sàn.",
    "Không phải ai cũng được phục vụ, nhưng {username} thì khác.",
    "{username} gọi tên, và cả căn phòng như sáng bừng lên vậy.",
    "Sang trọng là bản chất, {username} ơi, không phải diễn xuất.",
  ],
  energetic: [
    "{username} bật công tắc năng lượng rồi đó, sạc pin 100% xong bùng nổ luôn!",
    "GO GO GO, {username} ơi, sàn nhảy nóng lên nào!",
    "{username} gọi là tới liền, không có chờ đợi gì hết!",
    "Cảm ơn {username} đã nạp năng lượng, quẩy hết mình luôn!",
    "{username} ơi, tim tui đang đập theo nhịp trống luôn nè, quẩy thôi!",
    "Ba, hai, một... {username} gọi là tui bung hết cỡ liền!",
    "{username} tiếp sức là tui chạy full ga luôn đó nha!",
    "Cả sàn nhảy rung chuyển vì {username} vừa gọi tên đó!",
  ],
  sassy: [
    "{username} gọi đúng gu quá, để chị xử đẹp sàn diễn này.",
    "Hong cần nói nhiều, {username} nhìn outfit chị là mê liền.",
    "{username} ơi, đứng dậy xem chị trẩy dáng cái coi!",
    "Chuẩn gu {username} ghê á, mời cả sàn ngắm nhìn.",
    "{username} gọi tên là chị tự tin catwalk ra liền đó nha.",
    "Xin lỗi mọi người, {username} gọi thì chị phải nổi bật thôi.",
    "{username} ơi, chị không đi nhảy... chị đi trình diễn đó nha!",
    "Gu thẩm mỹ của {username} đỉnh thật, mời xem chị toả sáng.",
  ],
};

// Câu cảm ơn riêng khi được TẶNG QUÀ (khác giọng điệu bình luận thường — mang tính tri ân).
export const GIFT_THANK_LINES = [
  "{username} tặng quà xịn quá, cảm ơn xỉu luôn á! 💖",
  "Ơn trời có {username} bao trọn hôm nay, quẩy hết công suất!",
  "{username} vừa mở khoá siêu năng lực cho tui rồi đó nha!",
  "Cả sàn nhảy vỗ tay cho {username} nàooo! 🎉",
  "{username} chốt đơn quà mượt quá, để em đáp lễ bằng vũ đạo nè!",
  "{username} ơi, quà này quý lắm nha... cảm ơn từ đáy lòng luôn!",
  "Không ngờ {username} lại chịu chi dữ vậy, cả ê-kíp cảm ơn nhiều lắm!",
  "{username} vừa nâng hạng VIP rồi đó, sàn nhảy xin chào đón!",
  "Tim tui đập nhanh vì món quà của {username} nè, quá là dễ thương!",
];

export const DEFAULT_CHARACTERS = [
  {
    id: "dancer_1", name: "Dancer 1", callNames: ["dancer", "bot 1"],
    avatar: "https://api.dicebear.com/7.x/micah/svg?seed=dancer_1",
    isSessionOnly: false, tier: "normal",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    id: "street_2", name: "Street 2", callNames: ["street", "bot 2"],
    avatar: "https://api.dicebear.com/7.x/croodles/svg?seed=street_2",
    isSessionOnly: false, tier: "normal",
    gradient: "from-yellow-400 to-orange-500",
  },
  {
    id: "cyber_3", name: "Cyber 3", callNames: ["cyber", "bot 3"],
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=cyber_3",
    isSessionOnly: false, tier: "normal",
    gradient: "from-cyan-400 to-blue-500",
  },
  {
    id: "animal_4", name: "Animal 4", callNames: ["animal", "bot 4"],
    avatar: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=animal_4",
    isSessionOnly: false, tier: "normal",
    gradient: "from-green-400 to-emerald-600",
  },
  {
    id: "vip_5", name: "VIP 5", callNames: ["vip", "bot 5"],
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=vip_5",
    isSessionOnly: false, tier: "normal",
    gradient: "from-amber-300 to-yellow-600",
  },
  {
    id: "idol_6", name: "Idol 6", callNames: ["idol", "bot 6"],
    avatar: "https://api.dicebear.com/7.x/lorelei/svg?seed=idol_6",
    isSessionOnly: false, tier: "normal",
    gradient: "from-fuchsia-400 to-pink-600",
  },
  {
    id: "rapper_7", name: "Rapper 7", callNames: ["rapper", "bot 7"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rapper_7",
    isSessionOnly: false, tier: "normal",
    gradient: "from-red-500 to-orange-600",
  },
  {
    id: "magic_8", name: "Magic 8", callNames: ["magic", "bot 8"],
    avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=magic_8",
    isSessionOnly: false, tier: "normal",
    gradient: "from-violet-500 to-purple-700",
  },
  {
    id: "ninja_9", name: "Ninja 9", callNames: ["ninja", "bot 9"],
    avatar: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=ninja_9",
    isSessionOnly: false, tier: "normal",
    gradient: "from-slate-600 to-black",
  },
  {
    id: "dj_10", name: "DJ 10", callNames: ["dj", "bot 10"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dj_10",
    isSessionOnly: false, tier: "normal",
    gradient: "from-purple-500 to-indigo-600",
  },
  {
    id: "dancer_11", name: "Dancer 11", callNames: ["dancer", "bot 11"],
    avatar: "https://api.dicebear.com/7.x/micah/svg?seed=dancer_11",
    isSessionOnly: false, tier: "normal",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    id: "street_12", name: "Street 12", callNames: ["street", "bot 12"],
    avatar: "https://api.dicebear.com/7.x/croodles/svg?seed=street_12",
    isSessionOnly: false, tier: "normal",
    gradient: "from-yellow-400 to-orange-500",
  },
  {
    id: "cyber_13", name: "Cyber 13", callNames: ["cyber", "bot 13"],
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=cyber_13",
    isSessionOnly: false, tier: "normal",
    gradient: "from-cyan-400 to-blue-500",
  },
  {
    id: "animal_14", name: "Animal 14", callNames: ["animal", "bot 14"],
    avatar: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=animal_14",
    isSessionOnly: false, tier: "normal",
    gradient: "from-green-400 to-emerald-600",
  },
  {
    id: "vip_15", name: "VIP 15", callNames: ["vip", "bot 15"],
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=vip_15",
    isSessionOnly: false, tier: "vip",
    gradient: "from-amber-300 to-yellow-600",
  },
  {
    id: "idol_16", name: "Idol 16", callNames: ["idol", "bot 16"],
    avatar: "https://api.dicebear.com/7.x/lorelei/svg?seed=idol_16",
    isSessionOnly: false, tier: "normal",
    gradient: "from-fuchsia-400 to-pink-600",
  },
  {
    id: "rapper_17", name: "Rapper 17", callNames: ["rapper", "bot 17"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rapper_17",
    isSessionOnly: false, tier: "normal",
    gradient: "from-red-500 to-orange-600",
  },
  {
    id: "magic_18", name: "Magic 18", callNames: ["magic", "bot 18"],
    avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=magic_18",
    isSessionOnly: false, tier: "normal",
    gradient: "from-violet-500 to-purple-700",
  },
  {
    id: "ninja_19", name: "Ninja 19", callNames: ["ninja", "bot 19"],
    avatar: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=ninja_19",
    isSessionOnly: false, tier: "normal",
    gradient: "from-slate-600 to-black",
  },
  {
    id: "dj_20", name: "DJ 20", callNames: ["dj", "bot 20"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dj_20",
    isSessionOnly: false, tier: "normal",
    gradient: "from-purple-500 to-indigo-600",
  },
  {
    id: "dancer_21", name: "Dancer 21", callNames: ["dancer", "bot 21"],
    avatar: "https://api.dicebear.com/7.x/micah/svg?seed=dancer_21",
    isSessionOnly: false, tier: "normal",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    id: "street_22", name: "Street 22", callNames: ["street", "bot 22"],
    avatar: "https://api.dicebear.com/7.x/croodles/svg?seed=street_22",
    isSessionOnly: false, tier: "normal",
    gradient: "from-yellow-400 to-orange-500",
  },
  {
    id: "cyber_23", name: "Cyber 23", callNames: ["cyber", "bot 23"],
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=cyber_23",
    isSessionOnly: false, tier: "normal",
    gradient: "from-cyan-400 to-blue-500",
  },
  {
    id: "animal_24", name: "Animal 24", callNames: ["animal", "bot 24"],
    avatar: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=animal_24",
    isSessionOnly: false, tier: "normal",
    gradient: "from-green-400 to-emerald-600",
  },
  {
    id: "vip_25", name: "VIP 25", callNames: ["vip", "bot 25"],
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=vip_25",
    isSessionOnly: false, tier: "normal",
    gradient: "from-amber-300 to-yellow-600",
  },
  {
    id: "idol_26", name: "Idol 26", callNames: ["idol", "bot 26"],
    avatar: "https://api.dicebear.com/7.x/lorelei/svg?seed=idol_26",
    isSessionOnly: false, tier: "normal",
    gradient: "from-fuchsia-400 to-pink-600",
  },
  {
    id: "rapper_27", name: "Rapper 27", callNames: ["rapper", "bot 27"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rapper_27",
    isSessionOnly: false, tier: "normal",
    gradient: "from-red-500 to-orange-600",
  },
  {
    id: "magic_28", name: "Magic 28", callNames: ["magic", "bot 28"],
    avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=magic_28",
    isSessionOnly: false, tier: "normal",
    gradient: "from-violet-500 to-purple-700",
  },
  {
    id: "ninja_29", name: "Ninja 29", callNames: ["ninja", "bot 29"],
    avatar: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=ninja_29",
    isSessionOnly: false, tier: "normal",
    gradient: "from-slate-600 to-black",
  },
  {
    id: "dj_30", name: "DJ 30", callNames: ["dj", "bot 30"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dj_30",
    isSessionOnly: false, tier: "vip",
    gradient: "from-purple-500 to-indigo-600",
  },
  {
    id: "dancer_31", name: "Dancer 31", callNames: ["dancer", "bot 31"],
    avatar: "https://api.dicebear.com/7.x/micah/svg?seed=dancer_31",
    isSessionOnly: false, tier: "normal",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    id: "street_32", name: "Street 32", callNames: ["street", "bot 32"],
    avatar: "https://api.dicebear.com/7.x/croodles/svg?seed=street_32",
    isSessionOnly: false, tier: "normal",
    gradient: "from-yellow-400 to-orange-500",
  },
  {
    id: "cyber_33", name: "Cyber 33", callNames: ["cyber", "bot 33"],
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=cyber_33",
    isSessionOnly: false, tier: "normal",
    gradient: "from-cyan-400 to-blue-500",
  },
  {
    id: "animal_34", name: "Animal 34", callNames: ["animal", "bot 34"],
    avatar: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=animal_34",
    isSessionOnly: false, tier: "normal",
    gradient: "from-green-400 to-emerald-600",
  },
  {
    id: "vip_35", name: "VIP 35", callNames: ["vip", "bot 35"],
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=vip_35",
    isSessionOnly: false, tier: "normal",
    gradient: "from-amber-300 to-yellow-600",
  },
  {
    id: "idol_36", name: "Idol 36", callNames: ["idol", "bot 36"],
    avatar: "https://api.dicebear.com/7.x/lorelei/svg?seed=idol_36",
    isSessionOnly: false, tier: "normal",
    gradient: "from-fuchsia-400 to-pink-600",
  },
  {
    id: "rapper_37", name: "Rapper 37", callNames: ["rapper", "bot 37"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rapper_37",
    isSessionOnly: false, tier: "normal",
    gradient: "from-red-500 to-orange-600",
  },
  {
    id: "magic_38", name: "Magic 38", callNames: ["magic", "bot 38"],
    avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=magic_38",
    isSessionOnly: false, tier: "normal",
    gradient: "from-violet-500 to-purple-700",
  },
  {
    id: "ninja_39", name: "Ninja 39", callNames: ["ninja", "bot 39"],
    avatar: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=ninja_39",
    isSessionOnly: false, tier: "normal",
    gradient: "from-slate-600 to-black",
  },
  {
    id: "dj_40", name: "DJ 40", callNames: ["dj", "bot 40"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dj_40",
    isSessionOnly: false, tier: "normal",
    gradient: "from-purple-500 to-indigo-600",
  },
  {
    id: "dancer_41", name: "Dancer 41", callNames: ["dancer", "bot 41"],
    avatar: "https://api.dicebear.com/7.x/micah/svg?seed=dancer_41",
    isSessionOnly: false, tier: "normal",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    id: "street_42", name: "Street 42", callNames: ["street", "bot 42"],
    avatar: "https://api.dicebear.com/7.x/croodles/svg?seed=street_42",
    isSessionOnly: false, tier: "normal",
    gradient: "from-yellow-400 to-orange-500",
  },
  {
    id: "cyber_43", name: "Cyber 43", callNames: ["cyber", "bot 43"],
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=cyber_43",
    isSessionOnly: false, tier: "normal",
    gradient: "from-cyan-400 to-blue-500",
  },
  {
    id: "animal_44", name: "Animal 44", callNames: ["animal", "bot 44"],
    avatar: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=animal_44",
    isSessionOnly: false, tier: "normal",
    gradient: "from-green-400 to-emerald-600",
  },
  {
    id: "vip_45", name: "VIP 45", callNames: ["vip", "bot 45"],
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=vip_45",
    isSessionOnly: false, tier: "vip",
    gradient: "from-amber-300 to-yellow-600",
  },
  {
    id: "idol_46", name: "Idol 46", callNames: ["idol", "bot 46"],
    avatar: "https://api.dicebear.com/7.x/lorelei/svg?seed=idol_46",
    isSessionOnly: false, tier: "normal",
    gradient: "from-fuchsia-400 to-pink-600",
  },
  {
    id: "rapper_47", name: "Rapper 47", callNames: ["rapper", "bot 47"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rapper_47",
    isSessionOnly: false, tier: "normal",
    gradient: "from-red-500 to-orange-600",
  },
  {
    id: "magic_48", name: "Magic 48", callNames: ["magic", "bot 48"],
    avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=magic_48",
    isSessionOnly: false, tier: "normal",
    gradient: "from-violet-500 to-purple-700",
  },
  {
    id: "ninja_49", name: "Ninja 49", callNames: ["ninja", "bot 49"],
    avatar: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=ninja_49",
    isSessionOnly: false, tier: "normal",
    gradient: "from-slate-600 to-black",
  },
  {
    id: "dj_50", name: "DJ 50", callNames: ["dj", "bot 50"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dj_50",
    isSessionOnly: false, tier: "normal",
    gradient: "from-purple-500 to-indigo-600",
  },
  {
    id: "dancer_51", name: "Dancer 51", callNames: ["dancer", "bot 51"],
    avatar: "https://api.dicebear.com/7.x/micah/svg?seed=dancer_51",
    isSessionOnly: false, tier: "normal",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    id: "street_52", name: "Street 52", callNames: ["street", "bot 52"],
    avatar: "https://api.dicebear.com/7.x/croodles/svg?seed=street_52",
    isSessionOnly: false, tier: "normal",
    gradient: "from-yellow-400 to-orange-500",
  },
  {
    id: "cyber_53", name: "Cyber 53", callNames: ["cyber", "bot 53"],
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=cyber_53",
    isSessionOnly: false, tier: "normal",
    gradient: "from-cyan-400 to-blue-500",
  },
  {
    id: "animal_54", name: "Animal 54", callNames: ["animal", "bot 54"],
    avatar: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=animal_54",
    isSessionOnly: false, tier: "normal",
    gradient: "from-green-400 to-emerald-600",
  },
  {
    id: "vip_55", name: "VIP 55", callNames: ["vip", "bot 55"],
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=vip_55",
    isSessionOnly: false, tier: "normal",
    gradient: "from-amber-300 to-yellow-600",
  },
  {
    id: "idol_56", name: "Idol 56", callNames: ["idol", "bot 56"],
    avatar: "https://api.dicebear.com/7.x/lorelei/svg?seed=idol_56",
    isSessionOnly: false, tier: "normal",
    gradient: "from-fuchsia-400 to-pink-600",
  },
  {
    id: "rapper_57", name: "Rapper 57", callNames: ["rapper", "bot 57"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rapper_57",
    isSessionOnly: false, tier: "normal",
    gradient: "from-red-500 to-orange-600",
  },
  {
    id: "magic_58", name: "Magic 58", callNames: ["magic", "bot 58"],
    avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=magic_58",
    isSessionOnly: false, tier: "normal",
    gradient: "from-violet-500 to-purple-700",
  },
  {
    id: "ninja_59", name: "Ninja 59", callNames: ["ninja", "bot 59"],
    avatar: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=ninja_59",
    isSessionOnly: false, tier: "normal",
    gradient: "from-slate-600 to-black",
  },
  {
    id: "dj_60", name: "DJ 60", callNames: ["dj", "bot 60"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dj_60",
    isSessionOnly: false, tier: "vip",
    gradient: "from-purple-500 to-indigo-600",
  },
  {
    id: "dancer_61", name: "Dancer 61", callNames: ["dancer", "bot 61"],
    avatar: "https://api.dicebear.com/7.x/micah/svg?seed=dancer_61",
    isSessionOnly: false, tier: "normal",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    id: "street_62", name: "Street 62", callNames: ["street", "bot 62"],
    avatar: "https://api.dicebear.com/7.x/croodles/svg?seed=street_62",
    isSessionOnly: false, tier: "normal",
    gradient: "from-yellow-400 to-orange-500",
  },
  {
    id: "cyber_63", name: "Cyber 63", callNames: ["cyber", "bot 63"],
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=cyber_63",
    isSessionOnly: false, tier: "normal",
    gradient: "from-cyan-400 to-blue-500",
  },
  {
    id: "animal_64", name: "Animal 64", callNames: ["animal", "bot 64"],
    avatar: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=animal_64",
    isSessionOnly: false, tier: "normal",
    gradient: "from-green-400 to-emerald-600",
  },
  {
    id: "vip_65", name: "VIP 65", callNames: ["vip", "bot 65"],
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=vip_65",
    isSessionOnly: false, tier: "normal",
    gradient: "from-amber-300 to-yellow-600",
  },
  {
    id: "idol_66", name: "Idol 66", callNames: ["idol", "bot 66"],
    avatar: "https://api.dicebear.com/7.x/lorelei/svg?seed=idol_66",
    isSessionOnly: false, tier: "normal",
    gradient: "from-fuchsia-400 to-pink-600",
  },
  {
    id: "rapper_67", name: "Rapper 67", callNames: ["rapper", "bot 67"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rapper_67",
    isSessionOnly: false, tier: "normal",
    gradient: "from-red-500 to-orange-600",
  },
  {
    id: "magic_68", name: "Magic 68", callNames: ["magic", "bot 68"],
    avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=magic_68",
    isSessionOnly: false, tier: "normal",
    gradient: "from-violet-500 to-purple-700",
  },
  {
    id: "ninja_69", name: "Ninja 69", callNames: ["ninja", "bot 69"],
    avatar: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=ninja_69",
    isSessionOnly: false, tier: "normal",
    gradient: "from-slate-600 to-black",
  },
  {
    id: "dj_70", name: "DJ 70", callNames: ["dj", "bot 70"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dj_70",
    isSessionOnly: false, tier: "normal",
    gradient: "from-purple-500 to-indigo-600",
  },
  {
    id: "dancer_71", name: "Dancer 71", callNames: ["dancer", "bot 71"],
    avatar: "https://api.dicebear.com/7.x/micah/svg?seed=dancer_71",
    isSessionOnly: false, tier: "normal",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    id: "street_72", name: "Street 72", callNames: ["street", "bot 72"],
    avatar: "https://api.dicebear.com/7.x/croodles/svg?seed=street_72",
    isSessionOnly: false, tier: "normal",
    gradient: "from-yellow-400 to-orange-500",
  },
  {
    id: "cyber_73", name: "Cyber 73", callNames: ["cyber", "bot 73"],
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=cyber_73",
    isSessionOnly: false, tier: "normal",
    gradient: "from-cyan-400 to-blue-500",
  },
  {
    id: "animal_74", name: "Animal 74", callNames: ["animal", "bot 74"],
    avatar: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=animal_74",
    isSessionOnly: false, tier: "normal",
    gradient: "from-green-400 to-emerald-600",
  },
  {
    id: "vip_75", name: "VIP 75", callNames: ["vip", "bot 75"],
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=vip_75",
    isSessionOnly: false, tier: "vip",
    gradient: "from-amber-300 to-yellow-600",
  },
  {
    id: "idol_76", name: "Idol 76", callNames: ["idol", "bot 76"],
    avatar: "https://api.dicebear.com/7.x/lorelei/svg?seed=idol_76",
    isSessionOnly: false, tier: "normal",
    gradient: "from-fuchsia-400 to-pink-600",
  },
  {
    id: "rapper_77", name: "Rapper 77", callNames: ["rapper", "bot 77"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rapper_77",
    isSessionOnly: false, tier: "normal",
    gradient: "from-red-500 to-orange-600",
  },
  {
    id: "magic_78", name: "Magic 78", callNames: ["magic", "bot 78"],
    avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=magic_78",
    isSessionOnly: false, tier: "normal",
    gradient: "from-violet-500 to-purple-700",
  },
  {
    id: "ninja_79", name: "Ninja 79", callNames: ["ninja", "bot 79"],
    avatar: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=ninja_79",
    isSessionOnly: false, tier: "normal",
    gradient: "from-slate-600 to-black",
  },
  {
    id: "dj_80", name: "DJ 80", callNames: ["dj", "bot 80"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dj_80",
    isSessionOnly: false, tier: "normal",
    gradient: "from-purple-500 to-indigo-600",
  },
  {
    id: "dancer_81", name: "Dancer 81", callNames: ["dancer", "bot 81"],
    avatar: "https://api.dicebear.com/7.x/micah/svg?seed=dancer_81",
    isSessionOnly: false, tier: "normal",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    id: "street_82", name: "Street 82", callNames: ["street", "bot 82"],
    avatar: "https://api.dicebear.com/7.x/croodles/svg?seed=street_82",
    isSessionOnly: false, tier: "normal",
    gradient: "from-yellow-400 to-orange-500",
  },
  {
    id: "cyber_83", name: "Cyber 83", callNames: ["cyber", "bot 83"],
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=cyber_83",
    isSessionOnly: false, tier: "normal",
    gradient: "from-cyan-400 to-blue-500",
  },
  {
    id: "animal_84", name: "Animal 84", callNames: ["animal", "bot 84"],
    avatar: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=animal_84",
    isSessionOnly: false, tier: "normal",
    gradient: "from-green-400 to-emerald-600",
  },
  {
    id: "vip_85", name: "VIP 85", callNames: ["vip", "bot 85"],
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=vip_85",
    isSessionOnly: false, tier: "normal",
    gradient: "from-amber-300 to-yellow-600",
  },
  {
    id: "idol_86", name: "Idol 86", callNames: ["idol", "bot 86"],
    avatar: "https://api.dicebear.com/7.x/lorelei/svg?seed=idol_86",
    isSessionOnly: false, tier: "normal",
    gradient: "from-fuchsia-400 to-pink-600",
  },
  {
    id: "rapper_87", name: "Rapper 87", callNames: ["rapper", "bot 87"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rapper_87",
    isSessionOnly: false, tier: "normal",
    gradient: "from-red-500 to-orange-600",
  },
  {
    id: "magic_88", name: "Magic 88", callNames: ["magic", "bot 88"],
    avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=magic_88",
    isSessionOnly: false, tier: "normal",
    gradient: "from-violet-500 to-purple-700",
  },
  {
    id: "ninja_89", name: "Ninja 89", callNames: ["ninja", "bot 89"],
    avatar: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=ninja_89",
    isSessionOnly: false, tier: "normal",
    gradient: "from-slate-600 to-black",
  },
  {
    id: "dj_90", name: "DJ 90", callNames: ["dj", "bot 90"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dj_90",
    isSessionOnly: false, tier: "vip",
    gradient: "from-purple-500 to-indigo-600",
  },
  {
    id: "dancer_91", name: "Dancer 91", callNames: ["dancer", "bot 91"],
    avatar: "https://api.dicebear.com/7.x/micah/svg?seed=dancer_91",
    isSessionOnly: false, tier: "normal",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    id: "street_92", name: "Street 92", callNames: ["street", "bot 92"],
    avatar: "https://api.dicebear.com/7.x/croodles/svg?seed=street_92",
    isSessionOnly: false, tier: "normal",
    gradient: "from-yellow-400 to-orange-500",
  },
  {
    id: "cyber_93", name: "Cyber 93", callNames: ["cyber", "bot 93"],
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=cyber_93",
    isSessionOnly: false, tier: "normal",
    gradient: "from-cyan-400 to-blue-500",
  },
  {
    id: "animal_94", name: "Animal 94", callNames: ["animal", "bot 94"],
    avatar: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=animal_94",
    isSessionOnly: false, tier: "normal",
    gradient: "from-green-400 to-emerald-600",
  },
  {
    id: "vip_95", name: "VIP 95", callNames: ["vip", "bot 95"],
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=vip_95",
    isSessionOnly: false, tier: "normal",
    gradient: "from-amber-300 to-yellow-600",
  },
  {
    id: "idol_96", name: "Idol 96", callNames: ["idol", "bot 96"],
    avatar: "https://api.dicebear.com/7.x/lorelei/svg?seed=idol_96",
    isSessionOnly: false, tier: "normal",
    gradient: "from-fuchsia-400 to-pink-600",
  },
  {
    id: "rapper_97", name: "Rapper 97", callNames: ["rapper", "bot 97"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rapper_97",
    isSessionOnly: false, tier: "normal",
    gradient: "from-red-500 to-orange-600",
  },
  {
    id: "magic_98", name: "Magic 98", callNames: ["magic", "bot 98"],
    avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=magic_98",
    isSessionOnly: false, tier: "normal",
    gradient: "from-violet-500 to-purple-700",
  },
  {
    id: "ninja_99", name: "Ninja 99", callNames: ["ninja", "bot 99"],
    avatar: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=ninja_99",
    isSessionOnly: false, tier: "normal",
    gradient: "from-slate-600 to-black",
  },
  {
    id: "dj_100", name: "DJ 100", callNames: ["dj", "bot 100"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dj_100",
    isSessionOnly: false, tier: "normal",
    gradient: "from-purple-500 to-indigo-600",
  }
];

export const EXTENDED_DANCE_STYLES = [
  { id: "dance_auto_1", name: "Hiphop Quẩy 1", animationClass: "animate-dance-groove", durationSeconds: 7 },
  { id: "dance_auto_2", name: "Bar Club Quẩy 2", animationClass: "animate-dance-spin", durationSeconds: 8 },
  { id: "dance_auto_3", name: "Pop Quẩy 3", animationClass: "animate-dance-jump", durationSeconds: 9 },
  { id: "dance_auto_4", name: "Breakdance Quẩy 4", animationClass: "animate-dance-wave", durationSeconds: 10 },
  { id: "dance_auto_5", name: "Salsa Quẩy 5", animationClass: "animate-dance-shuffle", durationSeconds: 11 },
  { id: "dance_auto_6", name: "Tiktok Trend Quẩy 6", animationClass: "animate-dance-floss", durationSeconds: 6 },
  { id: "dance_auto_7", name: "Shuffle Quẩy 7", animationClass: "animate-dance-lock", durationSeconds: 7 },
  { id: "dance_auto_8", name: "Kpop Quẩy 8", animationClass: "animate-dance-salsa", durationSeconds: 8 },
  { id: "dance_auto_9", name: "DJ Remix Quẩy 9", animationClass: "animate-dance-breakdance", durationSeconds: 9 },
  { id: "dance_auto_10", name: "Vinahouse Lắc Hông 10", animationClass: "animate-dance-moonwalk", durationSeconds: 10 },
  { id: "dance_auto_11", name: "Hiphop Lắc Hông 11", animationClass: "animate-dance-clap", durationSeconds: 11 },
  { id: "dance_auto_12", name: "Bar Club Lắc Hông 12", animationClass: "animate-dance-wavearms", durationSeconds: 6 },
  { id: "dance_auto_13", name: "Pop Lắc Hông 13", animationClass: "animate-dance-bounce", durationSeconds: 7 },
  { id: "dance_auto_14", name: "Breakdance Lắc Hông 14", animationClass: "animate-dance-groove", durationSeconds: 8 },
  { id: "dance_auto_15", name: "Salsa Lắc Hông 15", animationClass: "animate-dance-spin", durationSeconds: 9 },
  { id: "dance_auto_16", name: "Tiktok Trend Lắc Hông 16", animationClass: "animate-dance-jump", durationSeconds: 10 },
  { id: "dance_auto_17", name: "Shuffle Lắc Hông 17", animationClass: "animate-dance-wave", durationSeconds: 11 },
  { id: "dance_auto_18", name: "Kpop Lắc Hông 18", animationClass: "animate-dance-shuffle", durationSeconds: 6 },
  { id: "dance_auto_19", name: "DJ Remix Lắc Hông 19", animationClass: "animate-dance-floss", durationSeconds: 7 },
  { id: "dance_auto_20", name: "Vinahouse Xoay Vòng 20", animationClass: "animate-dance-lock", durationSeconds: 8 },
  { id: "dance_auto_21", name: "Hiphop Xoay Vòng 21", animationClass: "animate-dance-salsa", durationSeconds: 9 },
  { id: "dance_auto_22", name: "Bar Club Xoay Vòng 22", animationClass: "animate-dance-breakdance", durationSeconds: 10 },
  { id: "dance_auto_23", name: "Pop Xoay Vòng 23", animationClass: "animate-dance-moonwalk", durationSeconds: 11 },
  { id: "dance_auto_24", name: "Breakdance Xoay Vòng 24", animationClass: "animate-dance-clap", durationSeconds: 6 },
  { id: "dance_auto_25", name: "Salsa Xoay Vòng 25", animationClass: "animate-dance-wavearms", durationSeconds: 7 },
  { id: "dance_auto_26", name: "Tiktok Trend Xoay Vòng 26", animationClass: "animate-dance-bounce", durationSeconds: 8 },
  { id: "dance_auto_27", name: "Shuffle Xoay Vòng 27", animationClass: "animate-dance-groove", durationSeconds: 9 },
  { id: "dance_auto_28", name: "Kpop Xoay Vòng 28", animationClass: "animate-dance-spin", durationSeconds: 10 },
  { id: "dance_auto_29", name: "DJ Remix Xoay Vòng 29", animationClass: "animate-dance-jump", durationSeconds: 11 },
  { id: "dance_auto_30", name: "Vinahouse Nhún Nhảy 30", animationClass: "animate-dance-wave", durationSeconds: 6 },
  { id: "dance_auto_31", name: "Hiphop Nhún Nhảy 31", animationClass: "animate-dance-shuffle", durationSeconds: 7 },
  { id: "dance_auto_32", name: "Bar Club Nhún Nhảy 32", animationClass: "animate-dance-floss", durationSeconds: 8 },
  { id: "dance_auto_33", name: "Pop Nhún Nhảy 33", animationClass: "animate-dance-lock", durationSeconds: 9 },
  { id: "dance_auto_34", name: "Breakdance Nhún Nhảy 34", animationClass: "animate-dance-salsa", durationSeconds: 10 },
  { id: "dance_auto_35", name: "Salsa Nhún Nhảy 35", animationClass: "animate-dance-breakdance", durationSeconds: 11 },
  { id: "dance_auto_36", name: "Tiktok Trend Nhún Nhảy 36", animationClass: "animate-dance-moonwalk", durationSeconds: 6 },
  { id: "dance_auto_37", name: "Shuffle Nhún Nhảy 37", animationClass: "animate-dance-clap", durationSeconds: 7 },
  { id: "dance_auto_38", name: "Kpop Nhún Nhảy 38", animationClass: "animate-dance-wavearms", durationSeconds: 8 },
  { id: "dance_auto_39", name: "DJ Remix Nhún Nhảy 39", animationClass: "animate-dance-bounce", durationSeconds: 9 },
  { id: "dance_auto_40", name: "Vinahouse Popping 40", animationClass: "animate-dance-groove", durationSeconds: 10 },
  { id: "dance_auto_41", name: "Hiphop Popping 41", animationClass: "animate-dance-spin", durationSeconds: 11 },
  { id: "dance_auto_42", name: "Bar Club Popping 42", animationClass: "animate-dance-jump", durationSeconds: 6 },
  { id: "dance_auto_43", name: "Pop Popping 43", animationClass: "animate-dance-wave", durationSeconds: 7 },
  { id: "dance_auto_44", name: "Breakdance Popping 44", animationClass: "animate-dance-shuffle", durationSeconds: 8 },
  { id: "dance_auto_45", name: "Salsa Popping 45", animationClass: "animate-dance-floss", durationSeconds: 9 },
  { id: "dance_auto_46", name: "Tiktok Trend Popping 46", animationClass: "animate-dance-lock", durationSeconds: 10 },
  { id: "dance_auto_47", name: "Shuffle Popping 47", animationClass: "animate-dance-salsa", durationSeconds: 11 },
  { id: "dance_auto_48", name: "Kpop Popping 48", animationClass: "animate-dance-breakdance", durationSeconds: 6 },
  { id: "dance_auto_49", name: "DJ Remix Popping 49", animationClass: "animate-dance-moonwalk", durationSeconds: 7 },
  { id: "dance_auto_50", name: "Vinahouse Locking 50", animationClass: "animate-dance-clap", durationSeconds: 8 },
  { id: "dance_auto_51", name: "Hiphop Locking 51", animationClass: "animate-dance-wavearms", durationSeconds: 9 },
  { id: "dance_auto_52", name: "Bar Club Locking 52", animationClass: "animate-dance-bounce", durationSeconds: 10 },
  { id: "dance_auto_53", name: "Pop Locking 53", animationClass: "animate-dance-groove", durationSeconds: 11 },
  { id: "dance_auto_54", name: "Breakdance Locking 54", animationClass: "animate-dance-spin", durationSeconds: 6 },
  { id: "dance_auto_55", name: "Salsa Locking 55", animationClass: "animate-dance-jump", durationSeconds: 7 },
  { id: "dance_auto_56", name: "Tiktok Trend Locking 56", animationClass: "animate-dance-wave", durationSeconds: 8 },
  { id: "dance_auto_57", name: "Shuffle Locking 57", animationClass: "animate-dance-shuffle", durationSeconds: 9 },
  { id: "dance_auto_58", name: "Kpop Locking 58", animationClass: "animate-dance-floss", durationSeconds: 10 },
  { id: "dance_auto_59", name: "DJ Remix Locking 59", animationClass: "animate-dance-lock", durationSeconds: 11 },
  { id: "dance_auto_60", name: "Vinahouse Moonwalk 60", animationClass: "animate-dance-salsa", durationSeconds: 6 },
  { id: "dance_auto_61", name: "Hiphop Moonwalk 61", animationClass: "animate-dance-breakdance", durationSeconds: 7 },
  { id: "dance_auto_62", name: "Bar Club Moonwalk 62", animationClass: "animate-dance-moonwalk", durationSeconds: 8 },
  { id: "dance_auto_63", name: "Pop Moonwalk 63", animationClass: "animate-dance-clap", durationSeconds: 9 },
  { id: "dance_auto_64", name: "Breakdance Moonwalk 64", animationClass: "animate-dance-wavearms", durationSeconds: 10 },
  { id: "dance_auto_65", name: "Salsa Moonwalk 65", animationClass: "animate-dance-bounce", durationSeconds: 11 },
  { id: "dance_auto_66", name: "Tiktok Trend Moonwalk 66", animationClass: "animate-dance-groove", durationSeconds: 6 },
  { id: "dance_auto_67", name: "Shuffle Moonwalk 67", animationClass: "animate-dance-spin", durationSeconds: 7 },
  { id: "dance_auto_68", name: "Kpop Moonwalk 68", animationClass: "animate-dance-jump", durationSeconds: 8 },
  { id: "dance_auto_69", name: "DJ Remix Moonwalk 69", animationClass: "animate-dance-wave", durationSeconds: 9 },
  { id: "dance_auto_70", name: "Vinahouse Vẫy Tay 70", animationClass: "animate-dance-shuffle", durationSeconds: 10 },
  { id: "dance_auto_71", name: "Hiphop Vẫy Tay 71", animationClass: "animate-dance-floss", durationSeconds: 11 },
  { id: "dance_auto_72", name: "Bar Club Vẫy Tay 72", animationClass: "animate-dance-lock", durationSeconds: 6 },
  { id: "dance_auto_73", name: "Pop Vẫy Tay 73", animationClass: "animate-dance-salsa", durationSeconds: 7 },
  { id: "dance_auto_74", name: "Breakdance Vẫy Tay 74", animationClass: "animate-dance-breakdance", durationSeconds: 8 },
  { id: "dance_auto_75", name: "Salsa Vẫy Tay 75", animationClass: "animate-dance-moonwalk", durationSeconds: 9 },
  { id: "dance_auto_76", name: "Tiktok Trend Vẫy Tay 76", animationClass: "animate-dance-clap", durationSeconds: 10 },
  { id: "dance_auto_77", name: "Shuffle Vẫy Tay 77", animationClass: "animate-dance-wavearms", durationSeconds: 11 },
  { id: "dance_auto_78", name: "Kpop Vẫy Tay 78", animationClass: "animate-dance-bounce", durationSeconds: 6 },
  { id: "dance_auto_79", name: "DJ Remix Vẫy Tay 79", animationClass: "animate-dance-groove", durationSeconds: 7 },
  { id: "dance_auto_80", name: "Vinahouse Nhảy Cao 80", animationClass: "animate-dance-spin", durationSeconds: 8 },
  { id: "dance_auto_81", name: "Hiphop Nhảy Cao 81", animationClass: "animate-dance-jump", durationSeconds: 9 },
  { id: "dance_auto_82", name: "Bar Club Nhảy Cao 82", animationClass: "animate-dance-wave", durationSeconds: 10 },
  { id: "dance_auto_83", name: "Pop Nhảy Cao 83", animationClass: "animate-dance-shuffle", durationSeconds: 11 },
  { id: "dance_auto_84", name: "Breakdance Nhảy Cao 84", animationClass: "animate-dance-floss", durationSeconds: 6 },
  { id: "dance_auto_85", name: "Salsa Nhảy Cao 85", animationClass: "animate-dance-lock", durationSeconds: 7 },
  { id: "dance_auto_86", name: "Tiktok Trend Nhảy Cao 86", animationClass: "animate-dance-salsa", durationSeconds: 8 },
  { id: "dance_auto_87", name: "Shuffle Nhảy Cao 87", animationClass: "animate-dance-breakdance", durationSeconds: 9 },
  { id: "dance_auto_88", name: "Kpop Nhảy Cao 88", animationClass: "animate-dance-moonwalk", durationSeconds: 10 },
  { id: "dance_auto_89", name: "DJ Remix Nhảy Cao 89", animationClass: "animate-dance-clap", durationSeconds: 11 },
  { id: "dance_auto_90", name: "Vinahouse Trượt 90", animationClass: "animate-dance-wavearms", durationSeconds: 6 },
  { id: "dance_auto_91", name: "Hiphop Trượt 91", animationClass: "animate-dance-bounce", durationSeconds: 7 },
  { id: "dance_auto_92", name: "Bar Club Trượt 92", animationClass: "animate-dance-groove", durationSeconds: 8 },
  { id: "dance_auto_93", name: "Pop Trượt 93", animationClass: "animate-dance-spin", durationSeconds: 9 },
  { id: "dance_auto_94", name: "Breakdance Trượt 94", animationClass: "animate-dance-jump", durationSeconds: 10 },
  { id: "dance_auto_95", name: "Salsa Trượt 95", animationClass: "animate-dance-wave", durationSeconds: 11 },
  { id: "dance_auto_96", name: "Tiktok Trend Trượt 96", animationClass: "animate-dance-shuffle", durationSeconds: 6 },
  { id: "dance_auto_97", name: "Shuffle Trượt 97", animationClass: "animate-dance-floss", durationSeconds: 7 },
  { id: "dance_auto_98", name: "Kpop Trượt 98", animationClass: "animate-dance-lock", durationSeconds: 8 },
  { id: "dance_auto_99", name: "DJ Remix Trượt 99", animationClass: "animate-dance-salsa", durationSeconds: 9 },
  { id: "dance_auto_100", name: "Vinahouse Quẩy 100", animationClass: "animate-dance-breakdance", durationSeconds: 10 }
];

