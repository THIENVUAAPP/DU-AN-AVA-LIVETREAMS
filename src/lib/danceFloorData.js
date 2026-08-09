// Dữ liệu cấu hình mặc định cho module "Sàn Nhảy TikTok" — config-driven, không hard-code vào engine.
// Admin có thể chỉnh sửa toàn bộ danh sách này qua UI (DanceFloorRuleBuilder / DanceFloorLibraryPanel)
// mà không cần deploy lại code.
//
// Lưu ý về nhóm "Người Nổi Tiếng": để tránh rủi ro sử dụng tên/hình ảnh người thật ngoài đời khi
// chưa có sự cho phép, các nhân vật này dùng danh xưng NGHỀ NGHIỆP chung (vd "Cầu Thủ Ngôi Sao",
// "Diva Nhạc Việt"...) thay vì tên riêng cụ thể. Viewer vẫn có thể "gọi tên" bằng các biệt danh quen
// thuộc qua callNames. Nếu admin muốn gắn đúng tên một người cụ thể, dùng mục "Nhân Vật Tuỳ Chỉnh"
// trong Thư Viện để tự đặt tên theo trách nhiệm của admin.

export const DANCE_CHARACTERS = [
  { id: "girl_neon", name: "Neon Girl", emoji: "💃", gender: "female", style: "cartoon", gradient: "from-pink-500 to-purple-600", personality: "cute", signatureSoundId: "sfx_cute", callNames: ["neon girl", "gai neon"] },
  { id: "boy_street", name: "Street Boy", emoji: "🕺", gender: "male", style: "cartoon", gradient: "from-blue-500 to-cyan-500", personality: "cool", signatureSoundId: "sfx_default", callNames: ["street boy", "trai pho"] },
  { id: "robot", name: "Robot Dancer", emoji: "🤖", gender: "neutral", style: "robot", gradient: "from-gray-500 to-slate-700", personality: "funny", signatureSoundId: "sfx_funny", callNames: ["robot", "robo"] },
  { id: "anime_girl", name: "Anime Star", emoji: "🎀", gender: "female", style: "anime", gradient: "from-fuchsia-500 to-pink-500", personality: "energetic", signatureSoundId: "sfx_energy", callNames: ["anime star", "waifu"] },
  { id: "superhero", name: "Superhero", emoji: "🦸", gender: "male", style: "superhero", gradient: "from-red-500 to-orange-500", personality: "cool", signatureSoundId: "sfx_energy", callNames: ["superhero", "sieu nhan"] },
  { id: "animal_cat", name: "Cat Idol", emoji: "🐱", gender: "neutral", style: "pet", gradient: "from-amber-500 to-yellow-500", personality: "funny", signatureSoundId: "sfx_cute", callNames: ["cat idol", "meo idol"] },
  { id: "fantasy_fairy", name: "Fantasy Fairy", emoji: "🧚", gender: "female", style: "fantasy", gradient: "from-emerald-500 to-teal-500", personality: "cute", signatureSoundId: "sfx_cute", callNames: ["fairy", "tien nu"] },
  { id: "king_gold", name: "Gold King", emoji: "🤴", gender: "male", style: "vip", gradient: "from-yellow-400 to-amber-600", personality: "luxury", signatureSoundId: "sfx_gold", callNames: ["gold king", "vua vang"] },
  { id: "queen_gold", name: "Gold Queen", emoji: "👸", gender: "female", style: "vip", gradient: "from-yellow-300 to-amber-500", personality: "luxury", signatureSoundId: "sfx_gold", callNames: ["gold queen", "nu hoang vang"] },
  { id: "diamond_vip", name: "Diamond VIP", emoji: "💎", gender: "neutral", style: "vip", gradient: "from-cyan-300 to-blue-500", personality: "luxury", signatureSoundId: "sfx_vip", callNames: ["diamond vip", "kim cuong"] },

  // Gái xinh / trai xinh
  { id: "hot_girl", name: "Hot Girl Sành Điệu", emoji: "💅", gender: "female", style: "cute_girl", gradient: "from-pink-400 to-rose-600", personality: "sassy", signatureSoundId: "sfx_energy", callNames: ["hot girl", "gai xinh", "chi dep"] },
  { id: "hot_boy", name: "Trai Xinh Soái Ca", emoji: "😎", gender: "male", style: "handsome_boy", gradient: "from-sky-400 to-indigo-600", personality: "cool", signatureSoundId: "sfx_default", callNames: ["hot boy", "trai xinh", "soai ca"] },

  // Thú cưng
  { id: "pet_dog", name: "Cún Cưng Đáng Yêu", emoji: "🐶", gender: "neutral", style: "pet", gradient: "from-orange-300 to-amber-600", personality: "cute", signatureSoundId: "sfx_cute", callNames: ["cho", "cun", "dog"] },
  { id: "pet_cat2", name: "Mèo Cưng Ngầu Lòi", emoji: "😼", gender: "neutral", style: "pet", gradient: "from-slate-400 to-zinc-600", personality: "funny", signatureSoundId: "sfx_funny", callNames: ["meo", "cat"] },
  { id: "pet_chick", name: "Gà Con Bung Xoã", emoji: "🐥", gender: "neutral", style: "pet", gradient: "from-yellow-300 to-orange-500", personality: "funny", signatureSoundId: "sfx_funny", callNames: ["ga con", "chick"] },
  { id: "pet_bunny", name: "Thỏ Con Nhảy Disco", emoji: "🐰", gender: "neutral", style: "pet", gradient: "from-pink-300 to-fuchsia-500", personality: "cute", signatureSoundId: "sfx_cute", callNames: ["tho", "bunny"] },

  // Người nổi tiếng — danh xưng nghề nghiệp chung, gọi tên qua biệt danh quen thuộc
  { id: "diva_music", name: "Diva Nhạc Việt", emoji: "🎤", gender: "female", style: "celebrity", gradient: "from-purple-400 to-pink-600", personality: "luxury", signatureSoundId: "sfx_gold", callNames: ["diva", "ca si", "nu hoang nhac viet"] },
  { id: "rapper_star", name: "Rapper Underground", emoji: "🎧", gender: "male", style: "celebrity", gradient: "from-neutral-600 to-black", personality: "cool", signatureSoundId: "sfx_funny", callNames: ["rapper", "mc"] },
  { id: "football_star", name: "Cầu Thủ Ngôi Sao", emoji: "⚽", gender: "male", style: "celebrity", gradient: "from-green-500 to-emerald-700", personality: "energetic", signatureSoundId: "sfx_energy", callNames: ["cau thu", "messi", "ronaldo", "vua bong da"] },
  { id: "beauty_queen", name: "Hoa Hậu Hoàn Vũ", emoji: "👑", gender: "female", style: "celebrity", gradient: "from-rose-300 to-amber-500", personality: "luxury", signatureSoundId: "sfx_gold", callNames: ["hoa hau", "hh"] },
  { id: "kpop_idol", name: "Idol Kpop Đa Sắc", emoji: "✨", gender: "neutral", style: "celebrity", gradient: "from-violet-400 to-blue-500", personality: "energetic", signatureSoundId: "sfx_energy", callNames: ["idol", "kpop"] },
  { id: "tech_billionaire", name: "Tỷ Phú Công Nghệ", emoji: "🚀", gender: "male", style: "celebrity", gradient: "from-slate-500 to-cyan-700", personality: "cool", signatureSoundId: "sfx_vip", callNames: ["ty phu", "elon"] },
  { id: "boxing_champion", name: "Võ Sĩ Vô Địch", emoji: "🥊", gender: "male", style: "celebrity", gradient: "from-red-600 to-rose-800", personality: "energetic", signatureSoundId: "sfx_energy", callNames: ["vo si", "boxing"] },
  { id: "mega_streamer", name: "Streamer Triệu View", emoji: "🎮", gender: "neutral", style: "celebrity", gradient: "from-indigo-500 to-purple-700", personality: "funny", signatureSoundId: "sfx_funny", callNames: ["streamer", "trieu view"] },
];

export const DANCE_STYLES = [
  { id: "dance_bounce", name: "Dance Cơ Bản", animationClass: "animate-dance-bounce", durationSeconds: 8 },
  { id: "dance_groove", name: "Hiphop Groove", animationClass: "animate-dance-groove", durationSeconds: 8 },
  { id: "dance_spin", name: "K-pop Xoay Vòng", animationClass: "animate-dance-spin", durationSeconds: 10 },
  { id: "dance_jump", name: "Nhảy Cao (Jump)", animationClass: "animate-dance-jump", durationSeconds: 6 },
  { id: "dance_wave", name: "Sóng Sánh (Wave)", animationClass: "animate-dance-wave", durationSeconds: 8 },
  { id: "dance_victory", name: "Điệu Chiến Thắng", animationClass: "animate-dance-spin", durationSeconds: 12 },
  { id: "dance_shuffle", name: "Shuffle Dance (Trend)", animationClass: "animate-dance-shuffle", durationSeconds: 8 },
  { id: "dance_floss", name: "Floss Dance (Trend)", animationClass: "animate-dance-floss", durationSeconds: 8 },
];

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

// Trang phục dạng "khung màu" phủ lên nhân vật — vì không dựng lại y phục thật trên ảnh/video tải lên
// (cần AI tạo ảnh chuyên biệt, ngoài phạm vi frontend hiện tại), nên biểu thị bằng viền màu + nhãn.
export const OUTFITS = [
  { id: "outfit_red", name: "Đỏ Rực", ringClass: "ring-red-500" },
  { id: "outfit_gold", name: "Vàng Ánh Kim", ringClass: "ring-amber-400" },
  { id: "outfit_blue", name: "Xanh Biển", ringClass: "ring-blue-500" },
  { id: "outfit_purple", name: "Tím Sang", ringClass: "ring-purple-500" },
  { id: "outfit_pink", name: "Hồng Pastel", ringClass: "ring-pink-400" },
  { id: "outfit_black", name: "Đen Huyền Bí", ringClass: "ring-neutral-700" },
  { id: "outfit_white", name: "Trắng Tinh Khôi", ringClass: "ring-white" },
  { id: "outfit_green", name: "Xanh Lá", ringClass: "ring-emerald-500" },
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

// Không có file âm thanh thật (chưa có asset) — dùng Web Audio API sinh tone ngắn, phân biệt theo tần số/dạng sóng.
export const DANCE_SOUNDS = [
  { id: "sfx_default", name: "Nhạc Nền Cơ Bản", frequency: 440, waveform: "sine" },
  { id: "sfx_silver", name: "Nhạc Nền Bạc", frequency: 523, waveform: "triangle" },
  { id: "sfx_gold", name: "Nhạc Nền Vàng", frequency: 659, waveform: "square" },
  { id: "sfx_vip", name: "Nhạc Nền VIP Kim Cương", frequency: 784, waveform: "sawtooth" },
  { id: "sfx_fire", name: "SFX Lửa", frequency: 220, waveform: "sawtooth" },
  { id: "sfx_bell", name: "Chuông Quà Tặng", frequency: 988, waveform: "sine" },
  { id: "sfx_cute", name: "Nhạc Hiệu Dễ Thương", frequency: 880, waveform: "triangle" },
  { id: "sfx_funny", name: "Nhạc Hiệu Hài Hước", frequency: 330, waveform: "square" },
  { id: "sfx_energy", name: "Nhạc Hiệu Sôi Động", frequency: 740, waveform: "sawtooth" },
];

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

// Bảng cấp bậc quà tặng — quy đổi giá trị quà (đã quy về điểm chung nội bộ) sang đặc quyền hiển thị.
// Mỗi cấp có nhóm nhân vật + nhạc hiệu riêng để "quà khác nhau → nhân vật & nhạc khác nhau".
export const GIFT_TIERS = [
  {
    level: 1, name: "Cơ Bản", minPoints: 0,
    characterIds: ["girl_neon", "boy_street", "pet_dog", "pet_chick", "pet_bunny"], danceIds: ["dance_bounce"], effectIds: ["fx_neon"],
    soundId: null, durationSeconds: 15,
    customization: { outfitColor: false, danceStyleChoice: false },
  },
  {
    level: 2, name: "Bạc", minPoints: 100,
    characterIds: ["anime_girl", "robot", "hot_girl", "hot_boy", "pet_cat2"], danceIds: ["dance_bounce", "dance_groove"], effectIds: ["fx_confetti"],
    soundId: null, durationSeconds: 30,
    customization: { outfitColor: true, danceStyleChoice: false },
  },
  {
    level: 3, name: "Vàng", minPoints: 500,
    characterIds: ["king_gold", "queen_gold", "superhero", "diva_music", "rapper_star", "football_star", "kpop_idol", "boxing_champion"], danceIds: ["dance_groove", "dance_spin"], effectIds: ["fx_gold", "fx_fireworks"],
    soundId: null, durationSeconds: 60,
    customization: { outfitColor: true, danceStyleChoice: true, vfxChoice: ["fx_confetti", "fx_gold"] },
  },
  {
    level: 4, name: "Kim Cương / VIP", minPoints: 2000,
    characterIds: ["diamond_vip", "beauty_queen", "tech_billionaire", "mega_streamer"], danceIds: ["dance_victory", "dance_spin"], effectIds: ["fx_explosion", "fx_gold", "fx_magic"],
    soundId: null, durationSeconds: 120,
    customization: { outfitColor: true, danceStyleChoice: true, vfxChoice: ["fx_confetti", "fx_explosion", "fx_gold"], sceneChoice: true, priorityStageSlot: true },
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
  maxSlots: 10,
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
};

// Kho câu bình luận phản hồi theo "giọng" tính cách nhân vật — hài hước, đa dạng, không cần gọi AI
// (đúng khuyến nghị "AI không nằm trên realtime critical path" trong bản kế hoạch gốc).
export const REACTION_LINES = {
  cute: [
    "{username} ơi tớ mắc cỡ quá nè, ra sàn nhảy liền đây! 🥰",
    "Ai gọi tên dễ thương vậy trời, {username} chờ tớ xíu nha!",
    "{username} vừa gọi hả? Tớ nhảy tưng tưng cho coi nè~",
    "Yeee {username} gọi đúng lúc tớ đang buồn chân quá!",
  ],
  cool: [
    "{username} gọi đúng người rồi đó, xem đẳng cấp nè!",
    "Không cần hò hét, {username} nhìn kỹ đây là chất!",
    "{username} vừa mở khoá độ ngầu cấp max luôn á.",
    "Bình tĩnh xem {username} ơi, đẳng cấp không cần vội.",
  ],
  funny: [
    "{username} gọi tên xong là auto bung xoã liền nha 😂",
    "Trời đất, {username} triệu tập tui giữa lúc đang ăn mì gõ!",
    "{username} ơi coi chừng tui nhảy dính luôn cái sàn đó!",
    "Alo alo {username} gọi gì đó, để tui quẩy trước đã!",
  ],
  luxury: [
    "{username} đã triệu hồi đẳng cấp thượng lưu, xin mời chiêm ngưỡng.",
    "Kính thưa quý khách {username}, hào quang đã xuất hiện.",
    "{username} gọi tên sang trọng thế này, sàn nhảy phải dát vàng thôi.",
    "Đẳng cấp không cần giải thích, {username} tự khắc hiểu.",
  ],
  energetic: [
    "{username} bật công tắc năng lượng rồi đó, sạc pin 100% xong bùng nổ luôn!",
    "GO GO GO {username} ơi, sàn nhảy nóng lên nào!",
    "{username} gọi là tới liền, không có chờ đợi gì hết!",
    "Cảm ơn {username} đã nạp năng lượng, quẩy hết mình luôn!",
  ],
  sassy: [
    "{username} gọi đúng gu quá, để chị xử đẹp sàn diễn này.",
    "Hong cần nói nhiều, {username} nhìn outfit chị là mê liền.",
    "{username} ơi đứng dậy xem chị trẩy dáng cái coi!",
    "Chuẩn gu {username} ghê á, mời cả sàn ngắm nhìn.",
  ],
};

// Câu cảm ơn riêng khi được TẶNG QUÀ (khác giọng điệu bình luận thường — mang tính tri ân).
export const GIFT_THANK_LINES = [
  "{username} tặng quà xịn quá, cảm ơn xỉu luôn á! 💖",
  "Ơn trời có {username} bao trọn hôm nay, quẩy hết công suất!",
  "{username} vừa mở khoá siêu năng lực cho tui rồi đó nha!",
  "Cả sàn nhảy vỗ tay cho {username} nàooo! 🎉",
  "{username} chốt đơn quà mượt quá, để em đáp lễ bằng vũ đạo nè!",
];
