import { 
  CheckSquare, MessageCircle, Plus, Gift, Clock, Megaphone, 
  Hand, ShoppingCart, Share, Sparkles, Mic, Heart, Play, HelpCircle, ChevronDown,
  Download, Upload, ShoppingBag, Trash2, Zap, Bot, Volume2, MessageSquare, FileText,
  BookOpen, Layers, Smile, Flame, Crown, Tag, FileUp, Sparkle, RefreshCw, CheckCircle2,
  Video, Film, AlertCircle, Copy, Check, Edit3, Star, Users
} from 'lucide-react';
import { NEW_AI_PROMPT } from '../../utils/defaultAIPrompt';
import { readUniversalFile } from '../../utils/universalDocumentParser';
import { polishAndOptimizeScript } from '../../utils/voiceSyncService';
import WorkspaceKeywordPanel from './WorkspaceKeywordPanel';
import EventVoiceTester from './EventVoiceTester';
import UniversalMediaPicker, { SAMPLE_IDOL_VIDEOS } from './UniversalMediaPicker';
import MultiAvatarStudioModal from './MultiAvatarStudioModal';

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

function UniversalFileUploadButton({ 
  onLoaded, 
  label = "Nạp File", 
  accept = ".txt,.md,.docx,.doc,.pdf,.csv,.json,.xlsx,.xls", 
  title = "Tải file lên (Word, PDF, Excel, TXT, JSON...)" 
}) {
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const parsed = await readUniversalFile(file);
      let text = '';
      if (Array.isArray(parsed)) {
        text = parsed.join('\n');
      } else if (typeof parsed === 'string') {
        text = parsed;
      } else if (parsed && typeof parsed === 'object') {
        text = JSON.stringify(parsed, null, 2);
      }
      if (text !== undefined && text !== null) {
        onLoaded(text, file.name);
        toast.success(`Đã nạp file thành công: ${file.name}`);
      }
    } catch (err) {
      console.error('Lỗi đọc file:', err);
      toast.error('Không thể đọc file: ' + (err.message || 'Lỗi định dạng'));
    } finally {
      setLoading(false);
      if (e.target) e.target.value = '';
    }
  };

  return (
    <label 
      title={title}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50/90 hover:bg-blue-100 text-blue-700 hover:text-blue-900 border border-blue-200 rounded-lg text-[11px] font-bold shadow-2xs transition-all cursor-pointer active:scale-95 shrink-0"
    >
      {loading ? (
        <span className="inline-block animate-spin text-[10px]">⏳</span>
      ) : (
        <Upload size={12} className="text-blue-600" />
      )}
      <span>{loading ? 'Đang đọc...' : label}</span>
      <input
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFileChange}
      />
    </label>
  );
}

const EVENTS = [
  { id: 'script_broadcast', label: '📜 Kịch bản Idol', icon: FileText, color: 'text-indigo-600', desc: 'Thiết lập kịch bản bán hàng tuần tự (Fixed Script) hoặc bộ não AI tư vấn từ Kho Tri Thức Doanh Nghiệp.' },
  { id: 'checkout', label: '🛒 Chốt đơn', icon: ShoppingCart, color: 'text-blue-500', desc: 'Khai báo các sản phẩm có trong giỏ hàng để AI tự động nhận diện từ khóa, phát video minh họa và tư vấn chốt đơn cho từng sản phẩm.' },
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
];


// ==================== 10 MẪU KỊCH BẢN BÁN HÀNG 60 PHÚT CHUẨN XỊN THEO TỪNG PHONG CÁCH & NGÀNH HÀNG ====================
const MASTER_SCRIPTS = {
  // --- 10 PHONG CÁCH LIVESTREAM AI ---
  sales_fast: `LOA LOA LOA! 500 anh chị em ơi, cơn bão Flash Sale Xả Kho Cháy Hàng Giờ Vàng chính thức bắt đầu rồi cả nhà ơi!
Duy nhất trong phiên livestream hôm nay, nhãn hàng trợ giá kịch sàn giảm sâu 50% trọn bộ sản phẩm cao cấp độc quyền!
Không giới hạn số lượng nhưng mỗi mã chỉ có đúng 20 suất vàng dành riêng cho ai nhanh tay nhất phiên live!
Cam kết hàng chính hãng 100% nguyên đai nguyên kiện, phát hiện hàng không chuẩn bên em đền gấp 10 lần giá trị!
Tất cả các đơn hàng chốt ngay trên live hôm nay đều được tự động áp mã Giảm Thêm 50K + Miễn Phí Giao Hàng Toàn Quốc!
Cả nhà hãy nhìn ngay xuống Giỏ Hàng góc trái màn hình, chuẩn bị sẵn sàng, em bắt đầu đếm ngược 3 2 1 là xả hàng liền tay nha!`,

  skincare_expert: `Dạ em xin kính chào tất cả các chị em đang theo dõi phiên tư vấn chăm sóc da chuyên sâu hôm nay ạ!
Các chị có biết tại sao dù mình dưỡng kem rất đắt tiền nhưng làn da vẫn bị sạm và khô ráp không ạ? Đó là vì tầng biểu bì thiếu ẩm sâu và chưa được phục hồi từ gốc rễ tế bào!
Và giải pháp phục hồi da chuẩn y khoa hôm nay em mang đến chính là Bộ Đôi Tinh Chất Tế Bào Gốc & Phục Hồi Chuyên Sâu!
Tinh chất thẩm thấu cực nhanh, chỉ sau đúng 7 ngày là các chị sẽ cảm nhận làn da căng bóng mịn màng và mướt mát rõ rệt!
Duy nhất trong phiên live hôm nay, nhãn hàng trợ giá đặc quyền giảm 50% chỉ còn 890.000đ, kèm quà tặng kem dưỡng mini và freeship toàn quốc!
Bên em cam kết bảo hành vàng 1 đổi 1 trong 30 ngày và tư vấn 1-1 suốt quá trình chăm sóc da cho các chị yêu nhé!`,

  tiktok_funny: `Ú òa! Em chào 500 anh chị em đang lướt TikTok lọt ngay vào phiên live siêu cấp vũ trụ ngày hôm nay nha!
Ai mà đi ngang lướt qua không dừng lại thả tim là tí nữa tiếc hùi hụi đứt ruột luôn á, vì hôm nay có cơn bão deal sốc chấn động địa cầu!
Em lên sàn ngay siêu phẩm cực hot đang làm mưa làm gió khắp cõi mạng, vừa đẹp vừa sang mà giá lại hạt dẻ như cho không luôn!
Bình thường giá ở store tiền triệu, hôm nay em xin phép cắt lỗ chơi lớn xả sốc chỉ bằng vài cốc trà sữa thôi cả nhà ơi!
Bấm ngay vào giỏ hàng góc trái màn hình, múc liền tay kẻo 1 nốt nhạc là bay sạch kho hàng nha cả nhà ơi!`,

  luxury_elegant: `Kính chào toàn thể quý vị khách quý đang hiện diện trong không gian phong cách sống thượng lưu hôm nay!
Đẳng cấp và khí chất của một người thành đạt luôn được thể hiện qua những chi tiết tinh tế và giá trị trường tồn theo thời gian!
Hôm nay, chúng tôi trân trọng giới thiệu Bộ Sưu Tập Giới Hạn được chế tác tinh xảo từ những nguyên liệu thượng hạng bậc nhất thế giới!
Từng đường nét, từng chi tiết đều là tuyệt tác nghệ thuật mang lại sự tự tin và vị thế vượt trội cho chủ nhân sở hữu!
Đặc quyền tri ân dành riêng cho quý khách theo dõi trực tiếp: Trợ giá 40% cùng hộp quà sang trọng dát vàng và dịch vụ chăm sóc VIP trọn đời!
Kính mời quý vị chọn ngay biểu tượng Giỏ Hàng để ghi danh nhận suất ưu đãi đặc quyền hôm nay!`,

  tech_expert: `Chào mừng tất cả các anh chị em doanh chủ, nhà sáng tạo nội dung đang có mặt trong buổi chia sẻ giải pháp công nghệ AI hôm nay!
Anh chị nào muốn tăng doanh thu bán hàng tự động 24/7 mà không tốn chi phí thuê nhân sự hàng chục triệu mỗi tháng thì hãy xem hết phiên live này nhé!
Hôm nay Thiên Vua App giới thiệu giải pháp Phần Mềm AvaLive VIP PRO - Công nghệ Livestream Idol AI siêu thực tế thế hệ mới nhất!
Phần mềm tích hợp bộ não AI đa ngôn ngữ, tự động đồng bộ khẩu hình miệng 60 FPS, tự động trả lời bình luận và chốt đơn thông minh theo thời gian thực!
Duy nhất trong phiên live hôm nay giảm 50% chỉ còn 1.750.000đ trọn gói bản quyền 1 năm kèm 100,000 Tokens AI và hỗ trợ kỹ thuật 24/7!
Anh chị hãy nhấp ngay vào giỏ hàng bên dưới để kích hoạt bản quyền chính thức nhé!`,

  countdown_urgent: `ĐỒNG HỒ ĐANG ĐẾM NGƯỢC RỒI CẢ NHÀ ƠI! Chỉ còn đúng 120 giây cuối cùng cho phiên trợ giá không tưởng này thôi!
Hệ thống báo về kho chỉ còn đúng 5 suất quà tặng độc quyền cuối cùng cho 5 người nhanh tay nhất!
Ai chậm tay 1 giây thôi là giá sẽ tự động nhảy về giá gốc ban đầu, không ai có thể can thiệp được nữa đâu ạ!
Nhìn ngay xuống góc trái màn hình, nhấp vào Giỏ Hàng, chọn mã ưu đãi và bấm ĐẶT HÀNG NGAY LẬP TỨC!
3... 2... 1... Em xin chúc mừng các anh chị đã kịp giữ suất flash sale thành công hôm nay nha!`,

  emotional_story: `Thực sự chia sẻ với cả nhà, để có được phiên live ngày hôm nay là cả một hành trình dài đầy tâm huyết của em và toàn bộ đội ngũ!
Em hiểu rằng mỗi đồng tiền anh chị bỏ ra đều là mồ hôi công sức, nên sản phẩm em đưa lên live phải là thứ tốt nhất, chất lượng nhất mà em dám cam kết bằng cả uy tín của mình!
Khi anh chị nhận hàng về, mở hộp ra và thấy sự thay đổi tích cực của bản thân, đó chính là niềm hạnh phúc lớn nhất của em!
Hôm nay em xin gửi trọn tấm lòng tri ân với mức giá hữu duyên nhất, bao kiểm tra hàng và đồng hành trọn đời cùng anh chị!
Cảm ơn mọi người đã luôn yêu thương và ủng hộ em trong suốt thời gian qua!`,

  motivational_fire: `Chào mừng những chiến binh xuất chúng đang có mặt trong phiên phát sóng bùng nổ năng lượng ngày hôm nay!
Cuộc đời này không có chỗ cho sự do dự! Người thành công là người nhìn thấy cơ hội và nắm bắt nó ngay trong tích tắc!
Hôm nay chính là thời khắc để bạn nâng tầm bản thân, bứt phá mọi giới hạn với giải pháp tối tân nhất mà chúng tôi mang lại!
Đừng chờ đợi ngày mai, hãy hành động ngay bây giờ, bấm vào giỏ hàng và tạo nên bước ngoặt vượt trội cho chính bạn!
Chúng tôi tin bạn làm được, và chúng tôi cam kết sẽ là bệ phóng vững chắc nhất đưa bạn đến đỉnh cao thành công!`,

  gen_z_vibes: `Hello cả nhà iu của kem! Hôm nay lên sóng set đồ và phụ kiện siêu slay chuẩn vibe Gen Z cho mấy bồ đây nha!
Ai muốn hóa thân thành idol TikTok hay flex phong cách chất chơi người dơi thì bơi ngay vào đây với tui nào!
Item này phối với gì cũng đỉnh chóp, mặc đi học, đi chơi hay đi quẩy đều thu hút trọn vẹn mọi ánh nhìn luôn á!
Giá hôm nay tui xin hãng deal hời tụt quần, lại còn áp mã freeship extra nữa chứ, không chốt là hơi bị có lỗi với bản thân đó nhen!
Nhấn liền vô giỏ hàng góc trái lẹ lẹ nè mấy bồ ơi!`,

  vip_master: `Kính chào toàn thể quý khán giả và các khách hàng VIP thân thiết đang theo dõi phiên phát sóng đặc biệt hôm nay!
Với tư cách là Chuyên Gia & Master Streamer, tôi khẳng định đây là cơ hội đầu tư và sở hữu sản phẩm tuyệt vời nhất trong năm của quý vị!
Sự kết hợp hoàn hảo giữa công nghệ đột phá, chất lượng chuẩn quốc tế và chính sách bảo hành thượng hạng tạo nên giá trị độc bản không thể so sánh!
Chúng tôi chỉ mở bán số lượng giới hạn cho những khách hàng thực sự thấu hiểu giá trị của sản phẩm!
Hãy đưa ra quyết định thông thái ngay lúc này bằng cách nhấn vào giỏ hàng góc trái màn hình để sở hữu ngay hôm nay!`,

  // --- 10 MẪU NGÀNH HÀNG CÀI SẴN ---
  cosmetics: `Chào mừng tất cả các tình yêu đã có mặt trong phiên livestream làm đẹp đặc biệt ngày hôm nay của shop em nha!
Các chị đẹp ơi, ai đang lướt qua phiên live thì cho em xin một nút thả tim và một lượt chia sẻ để nhận quà mở bát đầu live nào!
Hôm nay shop em mang đến cho cả nhà một siêu phẩm chăm sóc sắc đẹp và nâng tầm khí chất cực kỳ đỉnh cao luôn ạ!
Đó chính là Bộ Đôi Tinh Chất Serum Tế Bào Gốc Phục Hồi Da Trẻ Hóa và Nước Hoa Pháp Cao Cấp lưu hương suốt 12 giờ đồng hồ!
Chị nào mà da đang bị khô ráp, thâm sạm, không đều màu hoặc bắt đầu xuất hiện nếp nhăn lão hóa thì nhất định không được bỏ qua live này nhé!
Chỉ sau đúng 7 ngày sử dụng, làn da của các chị sẽ căng bóng, mịn màng và mướt như da em bé luôn ạ!
Duy nhất trong phiên livestream ngày hôm nay, giảm sốc 50% chỉ còn 890.000đ tặng kèm kem dưỡng ẩm mini và freeship toàn quốc!
Bên em cam kết 100% hàng chính hãng, bảo hành 1 đổi 1 trong 30 ngày, bấm vào Giỏ Hàng góc trái săn ngay nhé!`,

  perfume: `Kính chào toàn thể quý vị và các bạn đam mê nghệ thuật mùi hương đang hiện diện trong buổi livestream độc quyền hôm nay!
Mùi hương chính là danh thiếp vô hình tinh tế nhất của mỗi người, thể hiện đẳng cấp và sự quyến rũ khác biệt!
Hôm nay, em xin giới thiệu Bộ Sưu Tập Nước Hoa Niche Cao Cấp nhập khẩu trực tiếp từ kinh đô Grasse nước Pháp!
Từng giọt tinh dầu nước hoa được chưng cất tỉ mỉ từ hoa hồng de Mai, gỗ tuyết tùng và hổ phách tự nhiên quý hiếm!
Khả năng lưu hương vượt trội từ 12 đến 24 tiếng, tỏa hương xa tới 2 mét khiến ai lướt qua cũng phải ngoái nhìn trầm trồ!
Phiên bản 100ml chính hãng hôm nay được hãng trợ giá độc quyền giảm từ 2.400.000đ xuống chỉ còn 1.190.000đ trọn bộ!
Đặc biệt tặng ngay set 3 ống chiết nước hoa du lịch 10ml trị giá 450.000đ, bấm vào Giỏ Hàng góc trái nhận ngay nhé!`,

  women_fashion: `Dạ em chào toàn thể các tình yêu đã ghé thăm phiên livestream thời trang thiết kế cao cấp của shop em ngày hôm nay ạ!
Hôm nay em lên cho các nàng siêu phẩm đầm thiết kế tiểu thư thanh lịch kết hợp cùng túi xách da cao cấp đang làm mưa làm gió thị trường!
Chất liệu vải lụa tơ tằm nhập khẩu cực kỳ mềm mịn, thoáng mát, đường may chuẩn chỉ từng milimet giúp tôn dáng và che khuyết điểm vòng 2 hoàn hảo luôn ạ!
Bình thường set này bán tại store là 1.200.000đ, nhưng duy nhất trên live hôm nay em giảm chạm đáy chỉ còn 599.000đ thôi nha!
Tặng ngay 1 thắt lưng da thời thượng và freeship toàn quốc, nhận hàng kiểm tra thử đồ thoải mái trước khi thanh toán ạ!`,

  men_fashion: `Chào mừng toàn thể các quý ông lịch lãm và các chị em đang săn đồ hiệu cho chồng và người yêu vào phiên live hôm nay!
Hôm nay shop em ra mắt Bộ Sưu Tập Áo Polo Nam Dệt Kim Cao Cấp và Quần Âu Co Giãn 4 Chiều Chuẩn Form Quý Ông!
Chất vải sợi tre Bamboo kháng khuẩn, thấm hút mồ hôi tuyệt đối, chống nhăn xù và giữ màu bền đẹp sau hàng trăm lần giặt máy!
Giá niêm yết tại showroom là 850.000đ/áo, duy nhất hôm nay trên live combo 2 áo chỉ còn 499.000đ trọn gói kèm ví da cao cấp!
Anh em nhanh tay bấm vào giỏ hàng chọn size từ 50kg đến 90kg ngay nhé, số lượng ưu đãi có hạn!`,

  tech_ai: `Chào mừng tất cả các anh chị em doanh chủ, nhà sáng tạo nội dung đang có mặt trong buổi chia sẻ giải pháp Livestream AI hôm nay!
Hôm nay Thiên Vua App giới thiệu giải pháp Phần Mềm AvaLive VIP PRO - Công nghệ Livestream Idol AI siêu thực tế thế hệ mới nhất!
Phần mềm tích hợp bộ não AI đa ngôn ngữ, tự động đồng bộ khẩu hình miệng 60 FPS, tự động trả lời bình luận và chốt đơn thông minh theo thời gian thực!
Bình thường bản quyền 1 năm là 3.500.000đ, duy nhất trong phiên live hôm nay giảm 50% chỉ còn 1.750.000đ trọn gói tặng kèm 100,000 Tokens AI!
Bên em hỗ trợ cài đặt từ xa qua Ultraview/AnyDesk 24/7 và cam kết bảo hành nâng cấp trọn đời, nhấp vào giỏ hàng bên dưới để kích hoạt ngay nhé!`,

  smart_home: `Dạ em chào cả nhà yêu gia dụng thông minh! Ai muốn công việc nội trợ thảnh thơi, nhà cửa thơm tho sạch bóng thì vào ngay live em nha!
Hôm nay em mang đến Nồi Chiên Không Dầu Hơi Nước 15 Lít và Robot Hút Bụi Lau Nhà Tự Giặt Giẻ Thông Minh thế hệ mới!
Nồi chiên công nghệ kép đối lưu 360 độ giúp thực phẩm giòn rụm bên ngoài mọng nước bên trong, giảm 95% lượng dầu mỡ thừa có hại!
Giá niêm yết 6.800.000đ, duy nhất trên live hôm nay em giảm sốc 45% chỉ còn 3.790.000đ cho cả combo tặng kèm bộ phụ kiện 5 món và bảo hành 2 năm đổi mới!`,

  health_wellness: `Xin kính chào toàn thể quý khán giả đang theo dõi phiên livestream Chăm Sóc Sức Khỏe Chủ Động hôm nay!
Sức khỏe chính là tài sản vô giá nhất. Đầu tư cho sức khỏe của bản thân và cha mẹ là khoản đầu tư sinh lời bền vững nhất!
Hôm nay em xin giới thiệu Hộp Quà Đông Trùng Hạ Thảo Thượng Hạng kết hợp Collagen Yến Tươi Trẻ Hóa Tế Bào!
Hàm lượng Cordycepin và Adenosine nguyên chất giúp tăng cường hệ miễn dịch, ngủ sâu giấc, bồi bổ khí huyết và chống suy nhược cơ thể!
Hộp quà biếu cao cấp giá niêm yết 1.950.000đ, ưu đãi tri ân khách hàng live chỉ còn 990.000đ/hộp tặng kèm hộp trà thảo mộc hoàng gia và freeship toàn quốc!`,

  jewelry_fengshui: `Chào đón toàn thể các quý khách hữu duyên đã ghé vào không gian Trang Sức Phong Thủy Chiêu Tài Tấn Lộc hôm nay!
Hôm nay em xin thỉnh gửi tới cả nhà Vòng Tay Trầm Hương Tự Nhiên Bọc Vàng 10K và Nhẫn Tỳ Hưu Thạch Anh Tóc Vàng Linh Ứng!
Trầm hương tự nhiên mang linh khí đất trời, xua tan năng lượng tiêu cực, mang lại bình an, may mắn và vượng khí cho gia chủ!
Hôm nay trên live trợ giá hữu duyên giảm 50% từ 2.200.000đ chỉ còn 1.100.000đ/set trọn bộ tặng kèm hộp gấm nhung và chứng thư kiểm định đá quý!`,

  food_specialty: `Ú òa! Chào mừng các tín đồ ẩm thực đã có mặt trong phiên live Đặc Sản 3 Miền thơm ngon khó cưỡng hôm nay nha!
Hôm nay em lên kệ Bò Khô Miếng Mềm Tây Bắc Thượng Hạng và Hạt Điều Rang Củi Bình Phước loại 1 hạt tròn mẩy giòn rụm!
Bò khô làm từ 100% thịt bắp bò tươi nguyên chất tẩm ướp mắc khén rừng cay ngọt đậm đà, hạt điều loại A béo ngậy giòn rụm!
Combo 1kg bò khô + 500g hạt điều giá thị trường 750.000đ, hôm nay trên live xả sốc chỉ còn 399.000đ bao ăn thử không ngon hoàn tiền 100%!`,

  flash_sale: `LOA LOA LOA! 500 anh chị em ơi, cơn bão Flash Sale Xả Kho Cháy Hàng Giờ Vàng chính thức bắt đầu rồi cả nhà ơi!
Duy nhất trong 60 phút phiên livestream hôm nay, kho bên em xả toàn bộ hàng nghìn mã hàng hot với giá đồng giá từ 99k!
Hàng hiệu giá chợ, cam kết mới 100% nguyên đai nguyên kiện, phát hiện hàng kém chất lượng đền tiền gấp 10 lần!
Tất cả các đơn hàng chốt trong 15 phút đầu tiên đều được tự động áp mã Giảm 30K + Miễn Phí Vận Chuyển Toàn Quốc!
Cả nhà hãy nhìn ngay xuống Giỏ Hàng góc trái màn hình, chuẩn bị sẵn sàng, em bắt đầu đếm ngược 3 2 1 là xả hàng liền tay nha!`
};

const getDefaultEventConfigs = () => {
  const defaults = {};
  EVENTS.forEach(ev => {
    defaults[ev.id] = {
      priority: ev.id === 'apology' ? 20 : ev.id === 'comment' ? 50 : ev.id === 'follow' ? 70 : ev.id === 'gift' ? 90 : ev.id === 'welcome' ? 60 : ev.id === 'special_gift' ? 999 : ev.id === 'checkout' ? 100 : ev.id === 'script_broadcast' ? 80 : ev.id === 'share' ? 50 : ev.id === 'thanks_heart' ? 15 : 50,
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
      useAssistant: true,
      assistantUseMainVoice: false,
      
      // Comment Mode & Response Format
      commentReplyMode: 'hybrid', // 'keywords_only' | 'ai_only' | 'hybrid'
      commentResponseFormat: 'both', // 'voice_only' | 'text_only' | 'both'

      // Cấu hình quy trình 4 bước trả lời bình luận thông minh
      repeatCommentFirst: ev.id === 'comment' ? true : undefined,
      repeatCommentPrefix: ev.id === 'comment' ? 'Dạ bạn {user} vừa hỏi là: "{comment}". ' : undefined,
      unknownFallbackReply: ev.id === 'comment' ? 'Dạ bạn {user} ơi, câu hỏi này em là trợ lý live nên xin phép ghi nhận lại để hỏi lại shop và phản hồi chi tiết cho mình sau nha! Bạn có thể nhắn tin (inbox) trực tiếp cho shop để nhận hỗ trợ nhanh nhất ạ!' : undefined,
      appendFollowUpQuestion: ev.id === 'comment' ? true : undefined,
      followUpQuestionText: ev.id === 'comment' ? ' Dạ không biết bạn {user} có cần em hỗ trợ thêm điều gì nữa không ạ? Bạn có thể nhắn tin trực tiếp cho shop để nhận tư vấn chi tiết và nhiều ưu đãi nha!' : undefined,

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
      
      // Script Broadcast settings & Multiple Script Tabs
      broadcastMode: ev.id === 'script_broadcast' ? 'fixed_script' : undefined,
      interruptOnComment: ev.id === 'script_broadcast' ? true : undefined,
      commentReplySource: ev.id === 'script_broadcast' ? 'knowledge_base' : undefined,
      activeScriptTabId: ev.id === 'script_broadcast' ? 'tab_1' : undefined,
      scriptTabs: ev.id === 'script_broadcast' ? [
        {
          id: 'tab_1',
          name: 'Kịch bản 1: Mỹ Phẩm & Skincare',
          active: true,
          fixedScriptText: MASTER_SCRIPTS.cosmetics,
          aiLiveStyle: 'sales_fast',
          scriptDurationMinutes: 60,
          pauseBetweenSentences: 0.1,
          loopScript: true,
          voiceId: 'free_vi_female'
        }
      ] : undefined,
      fixedScriptText: ev.id === 'script_broadcast' ? MASTER_SCRIPTS.cosmetics : undefined,
      pauseBetweenSentences: ev.id === 'script_broadcast' ? 0.1 : undefined,
      scriptDurationMinutes: ev.id === 'script_broadcast' ? 60 : undefined,
      loopScript: ev.id === 'script_broadcast' ? true : undefined,
      aiLiveStyle: ev.id === 'script_broadcast' ? 'sales_fast' : undefined,
      aiLiveDuration: ev.id === 'script_broadcast' ? 60 : undefined,
      companyName: ev.id === 'script_broadcast' ? 'Shop Mỹ Phẩm & Làm Đẹp Cao Cấp' : undefined,
      productName: ev.id === 'script_broadcast' ? 'Bộ Đôi Serum Tế Bào Gốc & Nước Hoa Pháp' : undefined,
      productPrice: ev.id === 'script_broadcast' ? '1.850.000đ - Flash Sale chỉ còn 890.000đ' : undefined,
      promotions: ev.id === 'script_broadcast' ? 'Tặng kèm kem dưỡng ẩm mini + Freeship toàn quốc' : undefined,
      keyFeatures: ev.id === 'script_broadcast' ? '1. Dưỡng da căng bóng mịn màng sau 7 ngày.\n2. Nước hoa lưu hương 12 giờ.\n3. An toàn lành tính cho mọi loại da.' : undefined,
      warrantyPolicy: ev.id === 'script_broadcast' ? 'Bảo hành 1 đổi 1 trong 30 ngày, hoàn tiền 200% nếu phát hiện hàng không chuẩn' : undefined,
      companyKnowledgeText: ev.id === 'script_broadcast' ? '' : undefined,
      companyKnowledgeFileName: ev.id === 'script_broadcast' ? '' : undefined,

      // Special gifts slots (unlimited customizable slots)
      specialGiftSlots: ev.id === 'special_gift' ? [
        { 
          id: 1, 
          active: true, 
          giftName: '🇻🇳 Cờ Tổ Quốc (1 xu)', 
          sampleAnswers: 'Cảm ơn bạn {user} đã gửi tặng Cờ Tổ Quốc cho em nha!\nÔi yêu bạn {user} quá, cảm ơn món quà ý nghĩa của bạn!',
          videoFolder: '', 
          videoFileName: '',
          videoUrl: '',
          supportVideoFolder: '', 
          useTTS: true, 
          muteSourceVideo: false, 
          useAssistant: true, 
          assistantPrompt: '', 
          assistantVideoFolder: '', 
          useMainVoice: true 
        },
        { 
          id: 2, 
          active: true, 
          giftName: '👑 Vương Miện (99 xu)', 
          sampleAnswers: 'Wow, cảm ơn bạn {user} đã tặng Vương Miện siêu lấp lánh cho em!\nĐội vương miện cảm ơn {user} yêu quý nhiều nha!',
          videoFolder: '', 
          videoFileName: '',
          videoUrl: '',
          supportVideoFolder: '', 
          useTTS: true, 
          muteSourceVideo: false, 
          useAssistant: false, 
          assistantPrompt: '', 
          assistantVideoFolder: '', 
          useMainVoice: true 
        },
        { 
          id: 3, 
          active: true, 
          giftName: '🦁 Leon & Sư Tử (34000 xu)', 
          sampleAnswers: 'Trời ơi đại gia {user} xuất hiện! Em xin gửi ngàn lời cảm ơn tới bạn {user} đã tặng Sư Tử siêu khủng nha!\nQuá đỉnh luôn {user} ơi, cảm ơn anh/chị rất nhiều!',
          videoFolder: '', 
          videoFileName: '',
          videoUrl: '',
          supportVideoFolder: '', 
          useTTS: true, 
          muteSourceVideo: false, 
          useAssistant: true, 
          assistantPrompt: '', 
          assistantVideoFolder: '', 
          useMainVoice: true 
        },
        { 
          id: 4, 
          active: true, 
          giftName: '🪐 TikTok Universe (44999 xu)', 
          sampleAnswers: 'Tuyệt tác vũ trụ! Em cảm ơn bạn {user} đã kích hoạt TikTok Universe cho phòng live hôm nay nha!\nĐỉnh nóc kịch trần luôn bạn {user} ơi!',
          videoFolder: '', 
          videoFileName: '',
          videoUrl: '',
          supportVideoFolder: '', 
          useTTS: true, 
          muteSourceVideo: false, 
          useAssistant: true, 
          assistantPrompt: '', 
          assistantVideoFolder: '', 
          useMainVoice: true 
        }
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
        { id: 1, active: true, productName: 'AVA LIVE', keywords: 'ava live;phần mềm;giá;liên hệ;tư vấn;mua;dùng thử;gói;bản quyền', priceInfo: 'Giá gốc 3.500.000đ - Giá live 1.750.000đ', videoFolder: 'bình luận', videoUrl: '', useAi: true, useTTS: true, ttsVoiceRole: 'idol', muteSourceVideo: true, aiPrompt: NEW_AI_PROMPT },
        { id: 2, active: false, productName: '', keywords: '', priceInfo: '', videoFolder: '', videoUrl: '', useAi: false, useTTS: false, ttsVoiceRole: 'idol', muteSourceVideo: false, aiPrompt: '' },
        { id: 3, active: false, productName: '', keywords: '', priceInfo: '', videoFolder: '', videoUrl: '', useAi: false, useTTS: false, ttsVoiceRole: 'idol', muteSourceVideo: false, aiPrompt: '' }
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
  const [selectedEventId, setSelectedEventId] = useState('script_broadcast');
  const [showMultiAvatarModal, setShowMultiAvatarModal] = useState(false);
  
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
                specialGiftSlots: (Array.isArray(parsed[key]?.specialGiftSlots) && parsed[key].specialGiftSlots.length > 0)
                  ? parsed[key].specialGiftSlots.map((s, idx) => ({
                      ...s,
                      sampleAnswers: s.sampleAnswers || defaults[key]?.specialGiftSlots?.[idx]?.sampleAnswers || 'Cảm ơn bạn {user} đã gửi tặng món quà đặc biệt {gift_name} cho em nha!\nÔi yêu bạn {user} quá, cảm ơn món quà của bạn!',
                      useTTS: s.useTTS !== undefined ? s.useTTS : true,
                    }))
                  : defaults[key].specialGiftSlots,
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
                scriptTabs: key === 'script_broadcast'
                  ? (Array.isArray(parsed[key]?.scriptTabs) && parsed[key].scriptTabs.length > 0
                      ? parsed[key].scriptTabs
                      : [
                          {
                            id: 'tab_1',
                            name: 'Kịch bản 1: Mặc Định',
                            active: true,
                            fixedScriptText: parsed[key]?.fixedScriptText || defaults[key]?.fixedScriptText || MASTER_SCRIPTS.cosmetics,
                            aiLiveStyle: parsed[key]?.aiLiveStyle || defaults[key]?.aiLiveStyle || 'sales_fast',
                            scriptDurationMinutes: parsed[key]?.scriptDurationMinutes || defaults[key]?.scriptDurationMinutes || 60,
                            pauseBetweenSentences: parsed[key]?.pauseBetweenSentences !== undefined ? parsed[key].pauseBetweenSentences : 0.1,
                            loopScript: parsed[key]?.loopScript !== false,
                            voiceId: parsed[key]?.voiceId || 'free_vi_female'
                          }
                        ])
                  : defaults[key]?.scriptTabs,
                activeScriptTabId: key === 'script_broadcast'
                  ? (parsed[key]?.activeScriptTabId || (Array.isArray(parsed[key]?.scriptTabs) && parsed[key].scriptTabs.find(t => t.active)?.id) || 'tab_1')
                  : defaults[key]?.activeScriptTabId,
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

  const handleSimpleChange = (field, value) => {
    updateEventConfig(selectedEventId, { [field]: value });
  };

  // ==================== MULTIPLE SCRIPT TABS LOGIC ====================
  const scriptBroadcastConfig = eventConfigs.script_broadcast || {};
  const currentScriptTabs = (Array.isArray(scriptBroadcastConfig.scriptTabs) && scriptBroadcastConfig.scriptTabs.length > 0)
    ? scriptBroadcastConfig.scriptTabs
    : [
        {
          id: 'tab_1',
          name: 'Kịch bản 1: Mỹ Phẩm & Skincare',
          active: true,
          fixedScriptText: scriptBroadcastConfig.fixedScriptText || MASTER_SCRIPTS.cosmetics,
          aiLiveStyle: scriptBroadcastConfig.aiLiveStyle || 'sales_fast',
          scriptDurationMinutes: scriptBroadcastConfig.scriptDurationMinutes || 60,
          pauseBetweenSentences: scriptBroadcastConfig.pauseBetweenSentences !== undefined ? scriptBroadcastConfig.pauseBetweenSentences : 0.1,
          loopScript: scriptBroadcastConfig.loopScript !== false,
          voiceId: scriptBroadcastConfig.voiceId || 'free_vi_female'
        }
      ];

  const [currentEditingScriptTabId, setCurrentEditingScriptTabId] = useState(
    scriptBroadcastConfig.activeScriptTabId || currentScriptTabs.find(t => t.active)?.id || currentScriptTabs[0]?.id || 'tab_1'
  );

  // Lấy ra tab đang được chọn chỉnh sửa trong giao diện
  const activeEditingTab = currentScriptTabs.find(t => t.id === currentEditingScriptTabId) || currentScriptTabs[0] || {
    id: 'tab_1',
    name: 'Kịch bản 1',
    active: true,
    fixedScriptText: MASTER_SCRIPTS.cosmetics,
    aiLiveStyle: 'sales_fast',
    scriptDurationMinutes: 60,
    pauseBetweenSentences: 0.1,
    loopScript: true,
    voiceId: 'free_vi_female'
  };

  const handleAddScriptTab = () => {
    const newId = `script_tab_${Date.now()}`;
    const nextNum = currentScriptTabs.length + 1;
    const newTab = {
      id: newId,
      name: `Kịch bản ${nextNum}: Mới`,
      active: true, // Kích hoạt ngay kịch bản mới vừa tạo
      fixedScriptText: '',
      aiLiveStyle: 'sales_fast',
      scriptDurationMinutes: 60,
      pauseBetweenSentences: 0.1,
      loopScript: true,
      voiceId: scriptBroadcastConfig.voiceId || 'free_vi_female'
    };
    const updated = currentScriptTabs.map(t => ({ ...t, active: false })).concat([newTab]);
    updateEventConfig('script_broadcast', { 
      scriptTabs: updated,
      activeScriptTabId: newId,
      fixedScriptText: '',
      aiLiveStyle: 'sales_fast'
    });
    localStorage.setItem('aidol_user_script_tabs_persistent', JSON.stringify(updated));
    setCurrentEditingScriptTabId(newId);
    window.dispatchEvent(new CustomEvent('aidol_script_updated', {
      detail: { activeScriptTabId: newId, scriptTabs: updated, fixedScriptText: '' }
    }));
    toast.success(`➕ Đã mở thêm Kịch bản ${nextNum} và kích hoạt phát Live! Hãy nhập nội dung bán hàng.`);
  };

  const handleDuplicateScriptTab = (tabId) => {
    const target = currentScriptTabs.find(t => t.id === tabId);
    if (!target) return;
    const newId = `script_tab_${Date.now()}`;
    const newTab = {
      ...target,
      id: newId,
      name: `${target.name} (Bản sao)`,
      active: true
    };
    const updated = currentScriptTabs.map(t => ({ ...t, active: false })).concat([newTab]);
    updateEventConfig('script_broadcast', { 
      scriptTabs: updated,
      activeScriptTabId: newId,
      fixedScriptText: newTab.fixedScriptText,
      aiLiveStyle: newTab.aiLiveStyle
    });
    localStorage.setItem('aidol_user_script_tabs_persistent', JSON.stringify(updated));
    setCurrentEditingScriptTabId(newId);
    window.dispatchEvent(new CustomEvent('aidol_script_updated', {
      detail: { activeScriptTabId: newId, scriptTabs: updated, fixedScriptText: newTab.fixedScriptText }
    }));
    toast.success(`📋 Đã nhân bản "${target.name}" và kích hoạt phát Live!`);
  };

  const handleDeleteScriptTab = (tabId) => {
    if (currentScriptTabs.length <= 1) {
      toast.error('Phải giữ lại ít nhất 1 kịch bản trong danh sách!');
      return;
    }
    const remaining = currentScriptTabs.filter(t => t.id !== tabId);
    let newActiveId = scriptBroadcastConfig.activeScriptTabId;
    if (!remaining.some(t => t.active)) {
      remaining[0].active = true;
      newActiveId = remaining[0].id;
    }
    const activeTab = remaining.find(t => t.active) || remaining[0];
    updateEventConfig('script_broadcast', {
      scriptTabs: remaining,
      activeScriptTabId: activeTab.id,
      fixedScriptText: activeTab.fixedScriptText,
      aiLiveStyle: activeTab.aiLiveStyle,
      scriptDurationMinutes: activeTab.scriptDurationMinutes,
      pauseBetweenSentences: activeTab.pauseBetweenSentences,
      loopScript: activeTab.loopScript
    });
    localStorage.setItem('aidol_user_script_tabs_persistent', JSON.stringify(remaining));
    if (currentEditingScriptTabId === tabId) {
      setCurrentEditingScriptTabId(activeTab.id);
    }
    window.dispatchEvent(new CustomEvent('aidol_script_updated', {
      detail: { activeScriptTabId: activeTab.id, scriptTabs: remaining, fixedScriptText: activeTab.fixedScriptText }
    }));
    toast.success('🗑️ Đã xóa kịch bản thành công.');
  };

  const handleSelectActiveScriptForLive = (tabId) => {
    const updated = currentScriptTabs.map(t => ({
      ...t,
      active: t.id === tabId
    }));
    const chosen = updated.find(t => t.id === tabId);
    if (!chosen) return;
    setCurrentEditingScriptTabId(tabId);
    updateEventConfig('script_broadcast', {
      scriptTabs: updated,
      activeScriptTabId: tabId,
      fixedScriptText: chosen.fixedScriptText,
      aiLiveStyle: chosen.aiLiveStyle,
      scriptDurationMinutes: chosen.scriptDurationMinutes,
      pauseBetweenSentences: chosen.pauseBetweenSentences,
      loopScript: chosen.loopScript
    });
    localStorage.setItem('aidol_user_script_tabs_persistent', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('aidol_script_updated', {
      detail: { activeScriptTabId: tabId, scriptTabs: updated, fixedScriptText: chosen.fixedScriptText, activeTab: chosen }
    }));
    toast.success(`🎯 Đã kích hoạt "${chosen.name}" làm kịch bản phát sóng chính khi Live!`);
  };

  const handleUpdateActiveScriptTab = (field, value) => {
    const updated = currentScriptTabs.map(t => {
      if (t.id === activeEditingTab.id) {
        return { ...t, [field]: value };
      }
      return t;
    });
    const partial = { scriptTabs: updated };
    if (activeEditingTab.active) {
      partial[field] = value;
    }
    updateEventConfig('script_broadcast', partial);
    localStorage.setItem('aidol_user_script_tabs_persistent', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('aidol_script_updated', {
      detail: { activeScriptTabId: activeEditingTab.id, scriptTabs: updated, [field]: value }
    }));
  };

  const applyMasterScriptToTab = (type) => {
    if (MASTER_SCRIPTS[type]) {
      handleUpdateActiveScriptTab('fixedScriptText', MASTER_SCRIPTS[type]);
      toast.success('✨ Đã nạp mẫu kịch bản bán hàng vào kịch bản này!');
    }
  };

  const handleStyleChangeForTab = (styleKey) => {
    handleUpdateActiveScriptTab('aiLiveStyle', styleKey);
    if (MASTER_SCRIPTS[styleKey]) {
      handleUpdateActiveScriptTab('fixedScriptText', MASTER_SCRIPTS[styleKey]);
      toast.success(`✨ Đã nạp kịch bản phong cách: ${styleKey}`);
    }
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
        giftName: '🌹 Hoa Hồng (1 xu)',
        sampleAnswers: 'Cảm ơn bạn {user} đã gửi tặng món quà đặc biệt {gift_name} cho em nha!\nÔi yêu bạn {user} quá, cảm ơn món quà của bạn!',
        videoFolder: '',
        videoFileName: '',
        videoUrl: '',
        supportVideoFolder: '',
        useTTS: true,
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
    if (!window.confirm(`Anh có chắc muốn xóa Slot quà ${slotId} này không?`)) return;
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

  const selectSpecialGiftSlotFolder = async (slotId, fieldName) => {
    try {
      if (window.showDirectoryPicker) {
        const dirHandle = await window.showDirectoryPicker();
        handleSlotChange(slotId, fieldName, dirHandle.name);
      } else {
        const folderPath = prompt("Hãy nhập đường dẫn thư mục cho Slot quà này:", "C:/Videos/");
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
        name: `Slot ${nextId}: Quà Tặng Mới`,
        videoFolder: '',
        supportVideoFolder: '',
        useAi: true,
        useTTS: false,
        useVoice: true,
        muteSourceVideo: false,
        aiPrompt: 'Bạn là streamer AI. Hãy viết lời cảm ơn ngọt ngào và hài hước khi người xem tặng quà.',
        sampleAnswers: 'Cảm ơn bạn {user} đã gửi tặng món quà tuyệt vời này cho em nhé!',
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
      const targetEvent = 'checkout';
      const newProducts = (prev[targetEvent]?.checkoutProducts || []).map(prod => {
        if (prod.id === productId) {
          return { ...prod, [name]: isCheckbox ? value : value };
        }
        return prod;
      });
      return {
        ...prev,
        [targetEvent]: {
          ...prev[targetEvent],
          checkoutProducts: newProducts
        }
      };
    });
  };

  const handleAddProduct = () => {
    setEventConfigs(prev => {
      const targetEvent = 'checkout';
      const currentProducts = prev[targetEvent]?.checkoutProducts || [];
      const nextId = currentProducts.length > 0 ? Math.max(...currentProducts.map(p => p.id)) + 1 : 1;
      const newProduct = { 
        id: nextId, 
        active: true, 
        productName: `Sản phẩm mới ${nextId}`, 
        keywords: '', 
        priceInfo: '',
        videoFolder: '', 
        videoUrl: '',
        supportVideoFolder: '', 
        useAi: true, 
        useTTS: true, 
        ttsVoiceRole: 'idol', 
        muteSourceVideo: true, 
        aiPrompt: '' 
      };
      return {
        ...prev,
        [targetEvent]: {
          ...prev[targetEvent],
          checkoutProducts: [...currentProducts, newProduct]
        }
      };
    });
  };

  const handleDeleteProduct = (productId) => {
    setEventConfigs(prev => {
      const targetEvent = 'checkout';
      const currentProducts = prev[targetEvent]?.checkoutProducts || [];
      return {
        ...prev,
        [targetEvent]: {
          ...prev[targetEvent],
          checkoutProducts: currentProducts.filter(p => p.id !== productId)
        }
      };
    });
  };

  const selectProductFolder = async (productId) => {
    try {
      if (window.showDirectoryPicker) {
        const dirHandle = await window.showDirectoryPicker();
        handleProductChange(productId, 'videoFolder', dirHandle.name);
      } else {
        const folderPath = prompt("Hãy nhập đường dẫn thư mục video cho sản phẩm này:", "C:/Videos/");
        if (folderPath) {
          handleProductChange(productId, 'videoFolder', folderPath);
        }
      }
    } catch (e) {
      console.log('Folder selection cancelled');
    }
  };

  const handleProductVideoUpload = (productId, event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    handleProductChange(productId, 'videoUrl', objectUrl);
    handleProductChange(productId, 'videoFileName', file.name);
    const existingFolder = currentConfig.checkoutProducts?.find(p => p.id === productId)?.videoFolder;
    if (!existingFolder) {
      handleProductChange(productId, 'videoFolder', file.name);
    }
    event.target.value = '';
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

  const handleLoadFreeKnowledgeFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const parsed = await readUniversalFile(file);
      const text = Array.isArray(parsed) ? parsed.join('\n') : (typeof parsed === 'string' ? parsed : JSON.stringify(parsed));
      if (text) {
        handleSimpleChange('companyKnowledgeText', text);
      }
    } catch (err) {
      console.error('Error reading free knowledge file:', err);
      alert('Không thể đọc file tri thức: ' + (err.message || 'Lỗi định dạng'));
    }
    event.target.value = '';
  };

  const handleLoadKeyFeaturesFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const parsed = await readUniversalFile(file);
      const lines = Array.isArray(parsed) ? parsed : (typeof parsed === 'string' ? parsed.split(/\r?\n/) : []);
      const validLines = lines.map(l => l.trim()).filter(Boolean);
      const formatted = validLines.map((l, idx) => {
        const cleanText = l.replace(/^\d+[\.\/\:\-\)\s\]]+/, '').trim();
        return `${idx + 1}. ${cleanText}`;
      }).join('\n');
      if (formatted) {
        handleSimpleChange('keyFeatures', formatted);
      }
    } catch (err) {
      console.error('Error reading key features file:', err);
      alert('Không thể đọc file tính năng: ' + (err.message || 'Lỗi định dạng'));
    }
    event.target.value = '';
  };

  const handleLoadWarrantyPolicyFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const parsed = await readUniversalFile(file);
      const text = Array.isArray(parsed) ? parsed.join('\n') : (typeof parsed === 'string' ? parsed : JSON.stringify(parsed));
      if (text) {
        handleSimpleChange('warrantyPolicy', text);
      }
    } catch (err) {
      console.error('Error reading warranty file:', err);
      alert('Không thể đọc file chính sách: ' + (err.message || 'Lỗi định dạng'));
    }
    event.target.value = '';
  };

  const handleLoadAiPromptUniversalFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const parsed = await readUniversalFile(file);
      const text = Array.isArray(parsed) ? parsed.join('\n') : (typeof parsed === 'string' ? parsed : JSON.stringify(parsed));
      if (text) {
        handleSimpleChange('aiPrompt', text);
      }
    } catch (err) {
      console.error('Error reading AI prompt file:', err);
      alert('Không thể đọc file prompt: ' + (err.message || 'Lỗi định dạng'));
    }
    event.target.value = '';
  };

  const applyMasterScript = (type) => {
    if (MASTER_SCRIPTS[type]) {
      handleSimpleChange('fixedScriptText', MASTER_SCRIPTS[type]);
      toast.success('Đã nạp mẫu kịch bản bán hàng thành công!');
    }
  };

  const handleStyleChange = (styleKey) => {
    handleSimpleChange('aiLiveStyle', styleKey);
    if (MASTER_SCRIPTS[styleKey]) {
      handleSimpleChange('fixedScriptText', MASTER_SCRIPTS[styleKey]);
      toast.success(`Đã nạp kịch bản phong cách: ${styleKey}`);
    }
  };

  const handleAddExtraVideoSlot = () => {
    const currentSlots = currentConfig.extraVideoSlots || [];
    const newSlot = {
      id: Date.now(),
      name: `Clip Chen Ngang #${currentSlots.length + 1}`,
      folder: '',
      url: ''
    };
    updateEventConfig(selectedEventId, { extraVideoSlots: [...currentSlots, newSlot] });
    toast.success('Đã thêm ô video bổ trợ cho sự kiện!');
  };

  const handleUpdateExtraVideoSlot = (index, partial) => {
    const currentSlots = [...(currentConfig.extraVideoSlots || [])];
    if (currentSlots[index]) {
      currentSlots[index] = { ...currentSlots[index], ...partial };
      updateEventConfig(selectedEventId, { extraVideoSlots: currentSlots });
    }
  };

  const handleRemoveExtraVideoSlot = (index) => {
    const currentSlots = (currentConfig.extraVideoSlots || []).filter((_, i) => i !== index);
    updateEventConfig(selectedEventId, { extraVideoSlots: currentSlots });
    toast.success('Đã xóa ô video bổ trợ');
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
      generated = `[Cười tươi dịu dàng, chắp tay chào người xem] Dạ em xin kính chào tất cả các chị em đang theo dõi phiên tư vấn chăm sóc da chuyên sâu hôm nay của ${company} ạ!
Các chị có biết tại sao dù mình dưỡng kem rất đắt tiền nhưng làn da vẫn bị sạm và khô ráp không ạ? Đó là vì tầng biểu bì thiếu ẩm sâu và chưa được tái sinh từ gốc rễ tế bào!
[Giơ sản phẩm lên trước camera, ánh mắt chân thành] Và giải pháp phục hồi da chuẩn y khoa hôm nay em mang đến chính là siêu phẩm ${product}!
Sản phẩm với ưu điểm nổi bật: ${features.split('\n')[0] || features}!
[Nhấn mạnh, hạ giọng chia sẻ bí quyết] Tinh chất thẩm thấu cực nhanh, chỉ sau đúng 7 ngày là các chị sẽ cảm nhận làn da căng bóng mịn màng và mướt mát rõ rệt!
[Vỗ tay nhẹ, hào hứng giới thiệu ưu đãi] Duy nhất trong phiên live hôm nay, ${company} trợ giá đặc quyền: ${price}, kèm theo phần quà tri ân thượng hạng: ${promo}!
[Chỉ tay vào góc trái màn hình] Bên em cam kết vàng: ${warranty}!
Chỉ có 15 suất quà tặng giới hạn, các chị hãy nhanh tay chạm vào Giỏ Hàng góc trái màn hình, chọn mã 01 để làn da được tái sinh ngay hôm nay nhé!`;
    } else if (style === 'tiktok_funny') {
      generated = `[Mở to mắt ngạc nhiên, vẫy tay cực kỳ hào hứng] Ú òa! Em chào 500 anh chị em đang lướt TikTok lọt ngay vào phiên live siêu cấp vũ trụ của ${company} nha!
Ai mà đi ngang lướt qua không dừng lại thả tim là tí nữa tiếc hùi hụi đứt ruột luôn á, vì hôm nay có cơn bão deal sốc chấn động địa cầu!
[Cầm sản phẩm lên lắc nhẹ, cười tươi rạng rỡ] Em lên sàn ngay siêu phẩm ${product} đang làm mưa làm gió khắp cõi mạng đây ạ!
Công dụng xịn mịn hết nước chấm: ${features.split('\n')[0] || features}!
[Hạ giọng bí mật, ghé sát camera] Bình thường giá tiền triệu ngoài store, duy nhất trên live hôm nay giảm chạm đáy chỉ còn: ${price}! Lại còn được tặng kèm: ${promo}!
[Vỗ tay giục giã, chỉ tay liên tục vào giỏ hàng] Cam kết uy tín 100 điểm không có nhưng: ${warranty}!
Tay đâu tay đâu cả nhà ơi! Nhấp liền tay vào Giỏ Hàng góc trái góc phải để săn deal kẻo hết hàng là em không chịu trách nhiệm đâu nha!`;
    } else if (style === 'luxury_elegant') {
      generated = `[Nụ cười quý phái, phong thái sang trọng điềm tĩnh] Kính chào quý khách hàng thượng lưu đang hiện diện trong không gian livestream độc quyền của thương hiệu ${company}.
Đẳng cấp và khí chất của người phụ nữ hiện đại luôn được tôn vinh qua diện mạo rạng ngời và mùi hương tinh tế, quyến rũ.
[Nâng sản phẩm bằng hai tay trân trọng] Hôm nay, chúng tôi vinh dự giới thiệu kiệt tác nghệ thuật ${product} - sự giao thoa hoàn hảo giữa công nghệ sinh học đỉnh cao và hương sắc quý tộc.
Giá trị vượt trội: ${features.split('\n')[0] || features}.
[Ánh mắt tự tin, ngữ điệu truyền cảm] Đặc quyền tri ân dành riêng cho quý khách trong khung giờ vàng hôm nay: ${price}, cùng gói quà tặng cao cấp: ${promo}.
Chính sách bảo chứng chất lượng hoàng gia: ${warranty}.
[Đưa tay nhẹ nhàng hướng về giỏ hàng] Kính mời quý khách chạm vào Giỏ Hàng góc trái màn hình để sở hữu ngay trải nghiệm làm đẹp đẳng cấp này.`;
    } else if (style === 'tech_expert') {
      generated = `[Phong thái chuyên gia tự tin, ánh mắt quyết đoán] Chào mừng toàn thể các anh chị em doanh chủ và nhà sáng tạo nội dung đang theo dõi buổi chia sẻ công nghệ đột phá của ${company}!
Trong kỷ nguyên trí tuệ nhân tạo, việc tối ưu hóa quy trình và tự động hóa bán hàng 24/7 chính là chìa khóa then chốt để nhân bản doanh thu vượt bậc!
[Trình chiếu tính năng sản phẩm] Hôm nay ${company} trân trọng giới thiệu siêu phẩm ${product} - giải pháp tiên phong dẫn đầu thị trường!
Tính năng công nghệ vượt trội: ${features.split('\n')[0] || features}!
[Nhấn mạnh hiệu quả đầu tư ROI] Mức chi phí đầu tư cực kỳ ưu đãi chỉ có trên phiên live: ${price}, tặng kèm gói tài nguyên đặc quyền: ${promo}!
Cam kết đồng hành kỹ thuật và bảo hành trọn đời: ${warranty}!
[Chỉ tay vào nút đặt hàng] Anh chị hãy nhấp ngay vào Giỏ Hàng bên dưới để nắm bắt công nghệ dẫn đầu ngay hôm nay!`;
    } else if (style === 'countdown_urgent') {
      generated = `[Giọng dồn dập, đếm ngược khẩn cấp] KHẨN CẤP KHẨN CẤP CẢ NHÀ ƠI! Đồng hồ đếm ngược Flash Sale của ${company} chỉ còn đúng 3 phút cuối cùng!
[Giơ sản phẩm lên lắc mạnh, ánh mắt gấp gáp] Siêu phẩm ${product} đang cháy hàng liên tục, hệ thống báo chỉ còn 5 suất cuối cùng!
Giá gốc tiền triệu ngoài showroom, duy nhất trên live hôm nay giảm kịch sàn chỉ còn: ${price}!
[Vỗ tay đếm 3 2 1] Tặng ngay bộ quà tặng độc quyền cho ai bấm chốt nhanh nhất: ${promo}!
Cam kết vàng chính hãng 100%: ${warranty}!
Nhanh tay các bác ơi, nhìn ngay xuống Giỏ Hàng góc trái màn hình, bấm Chọn Mã và bấm Đặt Hàng trước khi đồng hồ về số 0 và hệ thống đóng cổng ưu đãi nhé!`;
    } else if (style === 'emotional_story') {
      generated = `[Ánh mắt ấm áp, giọng nói nhẹ nhàng truyền cảm] Dạ em xin chào mọi người. Hôm nay ngồi lại trên phiên live này, em muốn tâm sự chân thành với cả nhà một chút.
Là phụ nữ, ai trong chúng ta cũng xứng đáng được yêu thương, tự tin và rạng rỡ mỗi khi bước ra ngoài.
[Đặt tay lên ngực áo, nhìn vào sản phẩm] Và đó cũng chính là tất cả tâm huyết mà ${company} gửi gắm vào từng sản phẩm ${product}.
Không chỉ là ${features.split('\n')[0] || features}, mà đây là món quà nuôi dưỡng sự tự tin và hạnh phúc cho chính bạn.
[Nụ cười ấm áp, hạ giọng yêu thương] Hôm nay em xin phép tri ân mức giá yêu thương nhất: ${price}, cùng món quà chăm sóc: ${promo}.
Cam kết đổi trả và bảo hành chân tình: ${warranty}.
Hãy yêu thương và trân quý bản thân mình bằng cách bấm vào Giỏ Hàng và mang món quà này về nhà nhé!`;
    } else if (style === 'motivational_fire') {
      generated = `[Nắm chặt tay truyền năng lượng, giọng nói vang dội hùng biện] CHÀO TẤT CẢ CÁC CHIẾN BINH NĂNG LƯỢNG ĐỈNH CAO CỦA PHIÊN LIVE ${company}!
Hôm nay chúng ta hội tụ ở đây để cùng nhau bứt phá mọi rào cản và chinh phục những đỉnh cao thành công mới!
[Giơ cao sản phẩm, ánh mắt bừng sáng] Siêu phẩm ${product} chính là vũ khí chiến lược giúp bạn nâng tầm vị thế và tỏa sáng rực rỡ!
Sức mạnh vượt trội đã được chứng minh: ${features.split('\n')[0] || features}!
[Vỗ tay mạnh mẽ dứt khoát] Cơ hội duy nhất trong năm được trợ giá kỷ lục: ${price}, đi kèm gói quà tặng đỉnh chóp: ${promo}!
Cam kết vững chắc như kiềng ba chân: ${warranty}!
Hành động tạo nên kết quả! Hãy chạm ngay vào Giỏ Hàng và bứt phá thành công ngay bây giờ nào!`;
    } else if (style === 'gen_z_vibes') {
      generated = `[Nháy mắt tinh nghịch, tạo dáng vui nhộn] Hế lô các keo lì, các đồng boi đang lướt trúng live của ${company} nha!
Hôm nay shop em drop một siêu phẩm đỉnh nóc kịch trần bay phấp phới luôn á cả nhà ơi!
[Cầm sản phẩm tạo dáng cute] Đó chính là em ${product} bao mượt mà bao cháy phố!
Công dụng xịn mịn hết nước chấm: ${features.split('\n')[0] || features}!
[Cười tươi, chỉ tay vào giỏ hàng] Giá rẻ hú hồn chim én: ${price}, lại còn được tặng kèm thêm: ${promo}!
Bảo hành uy tín 100 điểm không có nhưng: ${warranty}!
Mấy bồ nhấp liền tay vào Giỏ Hàng góc trái góc phải để múc liền tay kẻo sold out là tiếc xỉu up xỉu down nha!`;
    } else if (style === 'vip_master') {
      generated = `[Tác phong chuyên nghiệp đỉnh cao, giọng điệu cuốn hút đầy thuyết phục] Chào mừng quý khách hàng VIP đã tham gia phiên trình diễn và mở bán đặc quyền của thương hiệu ${company}.
Chúng tôi tự hào là đơn vị tiên phong kiến tạo nên chuẩn mực hoàn mỹ với siêu phẩm ${product}.
[Phân tích chuyên sâu từng chi tiết sản phẩm] Sản phẩm hội tụ tinh hoa công nghệ và giá trị thực chứng: ${features.split('\n')[0] || features}.
Trong khung giờ vàng hôm nay, chúng tôi dành tặng mức trợ giá độc quyền: ${price}, cùng bộ quà tặng thượng lưu: ${promo}.
Chính sách bảo chứng chất lượng và chăm sóc khách hàng trọn đời: ${warranty}.
[Nụ cười tự tin, cúi chào lịch thiệp] Kính mời quý vị bấm vào Giỏ Hàng để hoàn tất đăng ký đặc quyền ngay hôm nay.`;
    } else {
      generated = `[Cười tươi rạng rỡ, vẫy tay chào người xem] Dạ em chào toàn thể các tình yêu đã có mặt trong phiên livestream săn deal cực khủng của ${company} hôm nay nha!
Các chị em nhanh tay thả tim và chia sẻ live để em mở bát tung quà tặng siêu to khổng lồ nào!
[Giơ sản phẩm lên trước camera] Hôm nay em mang đến siêu phẩm vạn người mê: ${product}!
Tính năng và công dụng vượt trội: ${features.split('\n')[0] || features}!
[Nhấn mạnh ưu đãi, vỗ tay hào hứng] Giá niêm yết tiền triệu, hôm nay giảm 50% chỉ còn: ${price}! Đặc biệt tặng kèm: ${promo} cho 20 chị chốt nhanh nhất!
Chính sách cam kết vàng: ${warranty}!
Chỉ còn đúng 5 suất cuối cùng, các chị nhìn ngay xuống góc trái màn hình bấm vào Giỏ Hàng để chốt đơn ngay nhé!`;
    }
    
    handleSimpleChange('fixedScriptText', generated);
  };

  const selectedEventInfo = EVENTS.find(e => e.id === selectedEventId);

  const HELP_DATA = {
    broadcastMode: { title: '🎙️ Chế Độ Phát Sóng Idol AI', desc: 'Lựa chọn phát theo Kịch bản bán hàng cài sẵn (Fixed Script) hoặc để Bộ Não AI tự động điều phối từ Kho Tri Thức.', tip: 'Chế độ 1 đọc chuẩn 100% từng câu có sẵn, Chế độ 2 cho phép AI tự sáng tạo kịch bản linh hoạt.' },
    fixedScriptText: { title: '📜 Kịch Bản Bán Hàng Tuần Tự (Fixed Script)', desc: 'Chuỗi các câu thoại được Idol đọc lần lượt từ đầu đến cuối theo đúng thời gian và thứ tự.', tip: 'Mỗi dòng là một câu thoại riêng biệt. Idol sẽ tự động ngắt nghỉ câu tự nhiên và đồng bộ khẩu hình 60 FPS.' },
    presetScript: { title: '🎁 10 Mẫu Kịch Bản Bán Hàng 60 Phút', desc: '10 mẫu kịch bản chuyên sâu cho 10 ngành hàng hot nhất (Mỹ phẩm, Nước hoa, Thời trang, AI, Gia dụng, Sức khỏe, Phong thủy, Đặc sản, Flash Sale).', tip: 'Nhấp 1-Click vào ngành hàng để nạp kịch bản hoàn chỉnh.' },
    aiLiveStyle: { title: '🎭 10 Phong Cách Livestream Của AI', desc: 'Định hình phong thái, ngữ điệu, tốc độ nói và sắc thái biểu cảm của Idol khi dẫn live.', tip: 'Ví dụ: Hào hứng chốt sale, Chuyên gia Da liễu, Bắt trend TikTok, Sang trọng quý phái, Giục giã đếm ngược...' },
    aiLiveDuration: { title: '⏳ Thời Lượng Phiên Live AI', desc: 'Thời gian dự kiến cho 1 phiên livestream tự động (từ 30 phút đến 180 phút).', tip: 'AI sẽ tự cân đối độ dài kịch bản và tần suất chốt sale tương ứng.' },
    generateAiScript: { title: '⚡ Nút Tạo Kịch Bản Bằng AI', desc: 'Bộ não AI tự động tổng hợp tên sản phẩm, giá bán, ưu đãi, tính năng và chính sách để sinh kịch bản bán hàng đỉnh cao.', tip: 'Bấm nút này để AI viết kịch bản phù hợp với phong cách live đã chọn.' },
    companyKnowledgeText: { title: '📚 Nội Dung Tri Thức Tự Do', desc: 'Nơi lưu trữ bảng giá chi tiết, thông số kỹ thuật, hướng dẫn sử dụng, feedback khách hàng...', tip: 'Có thể gõ trực tiếp hoặc bấm nút "Nạp File" hỗ trợ tất cả định dạng (.docx, .pdf, .txt, .xlsx...).' },
    keyFeatures: { title: '✨ Tính Năng, Thành Phần & Công Dụng Nổi Bật', desc: 'Các điểm mạnh đắt giá nhất của sản phẩm giúp thuyết phục khách hàng mua ngay.', tip: 'Hỗ trợ nạp file tự động chia tách thành danh sách 1. 2. 3. chuẩn chỉnh.' },
    warrantyPolicy: { title: '🛡️ Chính Sách Bảo Hành & Đổi Trả', desc: 'Cam kết chất lượng, bảo hành 1 đổi 1, miễn phí ship để gia tăng uy tín và giảm tỉ lệ hủy đơn.', tip: 'AI sẽ viện dẫn chính sách này khi khách hỏi về độ uy tín hoặc cách thức đổi trả.' },
    interruptOnComment: { title: '🔄 Tự Động Tạm Dừng Khi Có Bình Luận', desc: 'Idol sẽ tạm dừng kịch bản bán hàng đang nói để trả lời thắc mắc của khách, sau đó đọc tiếp câu kế tiếp liền mạch.', tip: 'Giúp phiên live chân thực như người thật đang livestream.' },
    commentReplySource: { title: '🎯 Nguồn Trả Lời Bình Luận', desc: 'Chọn dữ liệu để AI trả lời khách: từ Kho Tri Thức Doanh Nghiệp, Kịch bản từ khóa cố định, hoặc Kết hợp thông minh cả hai.', tip: 'Chọn "Kịch bản từ khóa" hoặc "Kết hợp thông minh" sẽ mở Bảng Từ Khóa ngay bên dưới.' },
    companyName: { title: '🏢 Tên Doanh Nghiệp / Thương Hiệu', desc: 'Tên shop hoặc thương hiệu của bạn để AI xưng hô chuyên nghiệp.', tip: 'Ví dụ: Shop Mỹ Phẩm Ngọc Nhi, Thiên Vua App...' },
    productPrice: { title: '💰 Giá Niêm Yết & Giá Live', desc: 'Giá gốc và mức giá ưu đãi đặc biệt trong phiên livestream.', tip: 'Ví dụ: Giá gốc 1.850.000đ, Flash Sale chỉ còn 890.000đ.' },
    promotions: { title: '🎁 Quà Tặng Kèm & Khuyến Mãi', desc: 'Các phần quà tri ân và ưu đãi freeship để kích cầu người mua.', tip: 'Ví dụ: Tặng tuýp kem dưỡng ẩm mini + Freeship toàn quốc.' },
    checkoutProducts: { title: '🛒 Danh Sách Sản Phẩm / Mã Hàng Livestream', desc: 'Khai báo các sản phẩm có trong giỏ hàng (kèm từ khóa, giá bán, kịch bản chốt đơn và video clip minh họa riêng).', tip: 'Bấm "+ Thêm sản phẩm mới" hoặc nạp video clip cho từng mã hàng.' },
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
      tip: 'Thiết lập đúng để phiên live mượt mà và tự nhiên nhất.'
    };

    return (
      <div className={`relative inline-flex items-center ml-1.5 ${className}`}>
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsOpen(!isOpen); }}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          className="text-gray-400 hover:text-blue-600 focus:outline-none transition-colors p-0.5 rounded-full hover:bg-blue-50 cursor-pointer"
        >
          <HelpCircle size={14} className="opacity-70 hover:opacity-100" />
        </button>

        {isOpen && (
          <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-72 p-3 bg-gray-900 text-white text-xs rounded-xl shadow-2xl border border-gray-700 pointer-events-none backdrop-blur-md animate-in fade-in duration-200">
            <div className="font-bold text-amber-300 flex items-center gap-1.5 mb-1 text-[13px]">
              {info.title}
            </div>
            <div className="text-gray-200 leading-relaxed mb-1.5">
              {info.desc}
            </div>
            {info.tip && (
              <div className="text-[11px] text-emerald-300 bg-emerald-950/60 p-1.5 rounded border border-emerald-800/50 mt-1 flex items-start gap-1">
                <span>💡</span>
                <span>{info.tip}</span>
              </div>
            )}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
          </div>
        )}
      </div>
    );
  };

  const FieldLabel = ({ icon, text, helpKey, customText, minW = "min-w-[170px]", htmlFor, onClick }) => (
    <label htmlFor={htmlFor} onClick={onClick} className={`flex items-center text-[13px] text-gray-700 font-semibold cursor-pointer select-none ${minW}`}>
      <span className="mr-1.5">{icon}</span>
      <span>{text}</span>
      <HelpTooltip helpKey={helpKey} customText={customText} />
    </label>
  );

  return (
    <div className="h-full flex flex-col md:flex-row bg-[#f0f2f5] text-gray-800 text-[13px] overflow-hidden">
      
      {/* 1. Sidebar Danh Sách Sự Kiện (Bên trái) */}
      <div className="w-full md:w-64 bg-white border-r border-gray-300 flex flex-col shrink-0">
        <div className="p-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <span className="font-bold text-gray-700 text-sm flex items-center gap-2">
            <span>⚙️</span> Cài đặt Sự kiện
          </span>
          <span className="text-[11px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">
            {EVENTS.length} Tác vụ
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {EVENTS.map((ev) => {
            const Icon = ev.icon;
            const isSelected = selectedEventId === ev.id;
            return (
              <button
                key={ev.id}
                onClick={() => setSelectedEventId(ev.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                  isSelected 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 translate-x-1' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon size={16} className={isSelected ? 'text-white' : ev.color} />
                  <span className="truncate">{ev.label}</span>
                </div>
                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></div>}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Nội dung Chi tiết Cài đặt Sự Kiện (Bên phải) */}
      <div className="flex-1 flex flex-col h-full overflow-hidden p-4">
        
        {/* Header Sự Kiện Hiện Tại */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs mb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              {selectedEventInfo && <selectedEventInfo.icon size={22} />}
            </div>
            <div>
              <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
                {selectedEventInfo?.label}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {selectedEventInfo?.desc}
              </p>
            </div>
          </div>
        </div>

        {/* Scroll Body */}
        <div className="flex-1 overflow-y-auto pr-1">

          {/* ========================================================================= */}
          {/* 1. QUÀ TẶNG ĐẶC BIỆT (SPECIAL GIFT SLOTS) */}
          {/* ========================================================================= */}
          {selectedEventId === 'special_gift' ? (
            /* ========================================================================= */
            /* 2. QUÀ TẶNG ĐẶC BIỆT (SPECIAL GIFT SLOTS) */
            /* ========================================================================= */
            <>
              <div className="border border-gray-300 rounded-2xl bg-white mb-4 shadow-sm px-4 py-5">
                <div className="flex items-center gap-6 mb-5 pb-3 border-b border-gray-100 flex-wrap">
                  <div className="flex items-center">
                    <FieldLabel icon="✅" text="Kích hoạt chung" helpKey="active" minW="min-w-[130px]" htmlFor="active-special-gift" />
                    <input type="checkbox" id="active-special-gift" name="active" checked={currentConfig.active} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded cursor-pointer accent-blue-600" />
                  </div>
                  <div className="flex items-center">
                    <FieldLabel icon="⭐" text="Độ ưu tiên" helpKey="priority" minW="min-w-[100px]" />
                    <input type="number" name="priority" value={currentConfig.priority} onChange={handleChange} className="w-28 border border-gray-300 rounded-lg px-2.5 py-1 text-xs bg-gray-50 focus:bg-white focus:outline-blue-500 font-bold" />
                  </div>
                </div>

                <fieldset className="border-2 border-yellow-300 rounded-2xl p-4 pt-4 relative bg-yellow-50/20 shadow-xs">
                  <legend className="absolute -top-3 left-4 bg-white px-2.5 py-0.5 text-xs font-black text-yellow-800 flex items-center gap-1.5 border border-yellow-300 rounded-lg shadow-2xs">
                    <Sparkles size={14} className="text-yellow-600" /> CÁC SLOT QUÀ TẶNG ĐẶC BIỆT TÙY BIẾN
                  </legend>

                  <div className="space-y-4 mt-2">
                    {currentConfig.specialGiftSlots?.map((slot) => (
                      <fieldset key={slot.id} className="border border-yellow-200 rounded-xl p-3.5 pt-4 relative bg-white shadow-2xs">
                        <legend className="absolute -top-3 left-3 bg-white px-2 text-xs font-bold text-yellow-900 flex items-center gap-2 border border-yellow-200 rounded-md shadow-2xs">
                          <input 
                            type="checkbox" 
                            checked={slot.active} 
                            onChange={(e) => handleSlotChange(slot.id, 'active', e.target.checked, true)} 
                            className="w-3.5 h-3.5 text-yellow-600 rounded cursor-pointer" 
                          />
                          <span>Slot #{slot.id}: <b className="text-amber-700">{slot.giftName}</b></span>
                        </legend>
                        
                        <button 
                          onClick={() => handleDeleteSpecialGiftSlot(slot.id)}
                          className="absolute top-2 right-2 text-xs text-red-500 hover:text-white hover:bg-red-500 border border-red-300 px-2 py-0.5 rounded-md transition-colors font-semibold cursor-pointer"
                        >
                          Xóa
                        </button>

                        <div className="space-y-3 mt-1 text-xs">
                          {/* 1. Chọn Quà Tặng */}
                          <div>
                            <label className="font-bold text-gray-700 block mb-1">🎁 Chọn Quà Tặng:</label>
                            <select 
                              value={slot.giftName} 
                              onChange={(e) => handleSlotChange(slot.id, 'giftName', e.target.value)} 
                              className="border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-blue-500 w-full font-bold text-amber-900 cursor-pointer"
                            >
                              {GIFT_OPTIONS.map(g => (
                                <option key={g.id} value={g.label}>{g.label}</option>
                              ))}
                            </select>
                          </div>

                          {/* 2. Câu cảm ơn mẫu (Mỗi câu 1 dòng) */}
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="text-xs font-bold text-gray-700">📄 Câu cảm ơn mẫu (Mỗi câu 1 dòng):</label>
                              <UniversalFileUploadButton 
                                onLoaded={(text) => handleSlotChange(slot.id, 'sampleAnswers', text)} 
                                label="Nạp File" 
                              />
                            </div>
                            <textarea 
                              value={slot.sampleAnswers || ''} 
                              onChange={(e) => handleSlotChange(slot.id, 'sampleAnswers', e.target.value)} 
                              placeholder="Cảm ơn bạn {user} đã tặng món quà đặc biệt {gift_name} cho em nha!"
                              className="w-full h-[60px] border border-gray-300 rounded-lg p-2 text-xs resize-none bg-white focus:outline-blue-500 font-medium" 
                            />
                          </div>

                          {/* 3. Universal Media Picker cho Video Idol */}
                          <div>
                            <UniversalMediaPicker
                              label="Video Idol Diễn / Clip Cảm Ơn Quà"
                              currentPath={slot.videoFileName ? `🎬 ${slot.videoFileName}` : (slot.videoFolder || '')}
                              videoUrl={slot.videoUrl || ''}
                              defaultText="Chưa chọn video / thư mục"
                              onSelectFile={(file, objectUrl) => {
                                handleSlotChange(slot.id, 'videoFolder', file.name);
                                handleSlotChange(slot.id, 'videoFileName', file.name);
                                handleSlotChange(slot.id, 'videoUrl', objectUrl);
                              }}
                              onSelectFolder={(folderName) => {
                                handleSlotChange(slot.id, 'videoFolder', folderName);
                                handleSlotChange(slot.id, 'videoFileName', '');
                              }}
                              onSelectSample={(sample) => {
                                handleSlotChange(slot.id, 'videoFolder', sample.name);
                                handleSlotChange(slot.id, 'videoFileName', sample.name);
                                handleSlotChange(slot.id, 'videoUrl', sample.url);
                              }}
                              onClear={() => {
                                handleSlotChange(slot.id, 'videoFolder', '');
                                handleSlotChange(slot.id, 'videoFileName', '');
                                handleSlotChange(slot.id, 'videoUrl', '');
                              }}
                              inputId={`upload-special-gift-${slot.id}`}
                            />
                          </div>

                          {/* 4. Event Voice Tester (Đầy đủ Giọng đọc, Tốc độ, Nút Nghe thử giống Ảnh 2) */}
                          <EventVoiceTester 
                            text={slot.sampleAnswers || `Cảm ơn bạn {user} đã tặng ${slot.giftName} cho em nha!`}
                            defaultVoiceId="free_vi_female"
                            label={`Nghe thử Voice (${slot.giftName})`}
                            compact={true}
                          />

                          {/* 5. Checkboxes slot */}
                          <div className="flex items-center gap-4 pt-2 border-t border-gray-100 text-xs">
                            <label className="flex items-center gap-1.5 cursor-pointer font-medium text-gray-700">
                              <input type="checkbox" checked={slot.useTTS !== false} onChange={(e) => handleSlotChange(slot.id, 'useTTS', e.target.checked, true)} className="rounded text-blue-600" />
                              <span>🗣️ Dùng TTS</span>
                            </label>
                            <label className="flex items-center gap-1.5 cursor-pointer font-medium text-gray-700">
                              <input type="checkbox" checked={slot.muteSourceVideo} onChange={(e) => handleSlotChange(slot.id, 'muteSourceVideo', e.target.checked, true)} className="rounded text-blue-600" />
                              <span>🔇 Tắt âm video gốc</span>
                            </label>
                            <label className="flex items-center gap-1.5 cursor-pointer font-medium text-gray-700">
                              <input type="checkbox" checked={slot.useAssistant} onChange={(e) => handleSlotChange(slot.id, 'useAssistant', e.target.checked, true)} className="rounded text-blue-600" />
                              <span>👥 Trợ lý phụ họa</span>
                            </label>
                          </div>
                        </div>
                      </fieldset>
                    ))}

                    <button 
                      onClick={handleAddSpecialGiftSlot}
                      className="w-full py-3 bg-gradient-to-r from-yellow-50 to-amber-50 hover:from-yellow-100 hover:to-amber-100 border-2 border-dashed border-yellow-400 text-yellow-800 rounded-xl font-black text-xs flex justify-center items-center gap-2 transition-all shadow-sm cursor-pointer active:scale-98"
                    >
                      <Plus size={16} className="text-yellow-600" /> ➕ Thêm Slot Quà Tặng Đặc Biệt Mới
                    </button>
                  </div>
                </fieldset>
              </div>
            </>
          ) : selectedEventId === 'gift' ? (
            /* ========================================================================= */
            /* 3. QUÀ TẶNG THƯỜNG (REGULAR GIFT SLOTS) */
            /* ========================================================================= */
            <>
              <div className="border border-gray-300 rounded-2xl bg-white mb-4 shadow-sm px-4 py-5">
                <div className="flex items-center gap-6 mb-5 pb-3 border-b border-gray-100 flex-wrap">
                  <div className="flex items-center">
                    <FieldLabel icon="✅" text="Kích hoạt chung" helpKey="active" minW="min-w-[130px]" htmlFor="active-gift" />
                    <input type="checkbox" id="active-gift" name="active" checked={currentConfig.active} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded cursor-pointer accent-blue-600" />
                  </div>
                  <div className="flex items-center">
                    <FieldLabel icon="⭐" text="Độ ưu tiên" helpKey="priority" minW="min-w-[100px]" />
                    <input type="number" name="priority" value={currentConfig.priority} onChange={handleChange} className="w-28 border border-gray-300 rounded-lg px-2.5 py-1 text-xs bg-gray-50 focus:bg-white focus:outline-blue-500 font-bold" />
                  </div>
                </div>

                <fieldset className="border-2 border-yellow-300 rounded-2xl p-4 pt-4 relative bg-yellow-50/20 shadow-xs">
                  <legend className="absolute -top-3 left-4 bg-white px-2.5 py-0.5 text-xs font-black text-yellow-800 flex items-center gap-1.5 border border-yellow-300 rounded-lg shadow-2xs">
                    <Gift size={14} className="text-yellow-600" /> CÁC SLOT QUÀ TẶNG THƯỜNG (MULTI-SLOT)
                  </legend>

                  <div className="space-y-4 mt-2">
                    {currentConfig.giftSlots?.map((gSlot) => (
                      <div key={gSlot.id} className="border border-yellow-200 rounded-xl p-3.5 bg-white space-y-3 relative shadow-2xs">
                        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                          <div className="flex items-center gap-2">
                            <input type="checkbox" checked={gSlot.active} onChange={(e) => handleGiftSlotChange(gSlot.id, 'active', e.target.checked, true)} className="w-4 h-4 text-blue-600 rounded cursor-pointer" />
                            <input 
                              type="text" 
                              value={gSlot.name} 
                              onChange={(e) => handleGiftSlotChange(gSlot.id, 'name', e.target.value)} 
                              className="font-bold text-gray-800 text-xs border border-gray-300 rounded px-2 py-0.5 focus:outline-blue-500 min-w-[220px]" 
                            />
                          </div>
                          <button onClick={() => handleDeleteGiftSlot(gSlot.id)} className="text-xs text-red-500 hover:underline cursor-pointer">Xóa Slot</button>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-xs font-bold text-gray-700">📄 Câu cảm ơn mẫu (Mỗi câu 1 dòng):</label>
                            <UniversalFileUploadButton 
                              onLoaded={(text) => handleGiftSlotChange(gSlot.id, 'sampleAnswers', text)} 
                              label="Nạp File" 
                            />
                          </div>
                          <textarea 
                            value={gSlot.sampleAnswers || ''} 
                            onChange={(e) => handleGiftSlotChange(gSlot.id, 'sampleAnswers', e.target.value)} 
                            placeholder="Cảm ơn bạn {user} đã tặng {gift_name} nha!"
                            className="w-full h-[60px] border border-gray-300 rounded-lg p-2 text-xs resize-none bg-white focus:outline-blue-500 font-medium" 
                          />
                        </div>

                        {/* Tải Video Idol cho Slot quà thường */}
                        <div>
                          <UniversalMediaPicker
                            label="Video Idol Diễn / Clip Cảm Ơn Quà"
                            currentPath={gSlot.videoFileName ? `🎬 ${gSlot.videoFileName}` : (gSlot.videoFolder || '')}
                            videoUrl={gSlot.videoUrl || ''}
                            defaultText="Chưa chọn video / thư mục"
                            onSelectFile={(file, objectUrl) => {
                              handleGiftSlotChange(gSlot.id, 'videoFolder', file.name);
                              handleGiftSlotChange(gSlot.id, 'videoFileName', file.name);
                              handleGiftSlotChange(gSlot.id, 'videoUrl', objectUrl);
                            }}
                            onSelectFolder={(folderName) => {
                              handleGiftSlotChange(gSlot.id, 'videoFolder', folderName);
                              handleGiftSlotChange(gSlot.id, 'videoFileName', '');
                            }}
                            onSelectSample={(sample) => {
                              handleGiftSlotChange(gSlot.id, 'videoFolder', sample.name);
                              handleGiftSlotChange(gSlot.id, 'videoFileName', sample.name);
                              handleGiftSlotChange(gSlot.id, 'videoUrl', sample.url);
                            }}
                            onClear={() => {
                              handleGiftSlotChange(gSlot.id, 'videoFolder', '');
                              handleGiftSlotChange(gSlot.id, 'videoFileName', '');
                              handleGiftSlotChange(gSlot.id, 'videoUrl', '');
                            }}
                            inputId={`upload-gift-slot-${gSlot.id}`}
                          />
                        </div>

                        <EventVoiceTester 
                          text={gSlot.sampleAnswers || 'Cảm ơn bạn {user} đã tặng quà cho em nha!'}
                          defaultVoiceId="free_vi_female"
                          label={`Nghe thử Voice (${gSlot.name || 'Slot ' + gSlot.id})`}
                          compact={true}
                        />
                      </div>
                    ))}

                    <button 
                      onClick={handleAddGiftSlot}
                      className="w-full py-3 bg-gradient-to-r from-yellow-50 to-amber-50 hover:from-yellow-100 hover:to-amber-100 border-2 border-dashed border-yellow-400 text-yellow-800 rounded-xl font-black text-xs flex justify-center items-center gap-2 transition-all shadow-sm cursor-pointer active:scale-98"
                    >
                      <Plus size={16} className="text-yellow-600" /> ➕ Thêm Slot Quà Tặng (Thường) Mới
                    </button>
                  </div>
                </fieldset>
              </div>
            </>
          ) : selectedEventId === 'script_broadcast' ? (
            /* ========================================================================= */
            /* 4. TAB 1: 📜 KỊCH BẢN IDOL (BÁN HÀNG TUẦN TỰ & BỘ NÃO AI DOANH NGHIỆP) */
            /* ========================================================================= */
            <>
              <div className="border border-gray-300 rounded-2xl bg-white mb-4 shadow-sm px-4 py-5">
                
                {/* 1. KHỞI CHẠY & ƯU TIÊN */}
                <div className="flex items-center gap-6 mb-5 pb-3 border-b border-gray-100 flex-wrap">
                  <div className="flex items-center">
                    <FieldLabel icon="✅" text="Kích hoạt phát kịch bản" helpKey="active" minW="min-w-[160px]" htmlFor="active-script-broadcast" />
                    <input type="checkbox" id="active-script-broadcast" name="active" checked={currentConfig.active} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded cursor-pointer accent-blue-600" />
                  </div>
                  <div className="flex items-center">
                    <FieldLabel icon="⭐" text="Độ ưu tiên" helpKey="priority" minW="min-w-[100px]" />
                    <input type="number" name="priority" value={currentConfig.priority} onChange={handleChange} className="w-28 border border-gray-300 rounded-lg px-2.5 py-1 text-xs bg-gray-50 focus:bg-white focus:outline-blue-500 font-bold" />
                  </div>
                </div>

                {/* 🌟 2. BỘ CHỌN CHẾ ĐỘ PHÁT SÓNG (MODE SWITCHER) */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-300 mb-6 shadow-xs space-y-3">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-black text-blue-900 flex items-center gap-2 uppercase tracking-wide">
                        <Sparkles size={18} className="text-blue-600 animate-pulse" /> CHẾ ĐỘ PHÁT SÓNG KỊCH BẢN IDOL AI
                      </h3>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Chọn cách thức Idol vận hành: Phát đúng 100% kịch bản mẫu soạn sẵn hoặc Sử dụng Bộ Não AI & Kho Tri Thức Doanh Nghiệp.
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
                        <FileText size={15} /> 1. Kịch Bản Bán Hàng Cài Sẵn
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

                  {/* CẤU HÌNH TỰ ĐỘNG TẠM DỪNG VÀ TIẾP TỤC */}
                  <div className="p-3 bg-white/95 rounded-xl border border-blue-200 shadow-2xs space-y-3">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
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
                            Khi có bình luận từ người xem, Idol sẽ tạm dừng kịch bản bán hàng, trả lời khách rồi tiếp tục câu tiếp theo mà không bị lặp lại từ đầu.
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

                    {/* BẢNG QUẢN LÝ KỊCH BẢN TỪ KHÓA TRỰC TIẾP KHI CHỌN NGUỒN TỪ KHÓA */}
                    {(currentConfig.commentReplySource === 'keywords' || currentConfig.commentReplySource === 'both') && (
                      <div className="pt-3 border-t border-blue-100">
                        <div className="mb-2 text-xs font-black text-blue-900 flex items-center gap-1.5">
                          <MessageSquare size={14} className="text-blue-600" /> BẢNG KỊCH BẢN TỪ KHÓA & CÂU TRẢ LỜI MẪU (NẠP FILE ĐA ĐỊNH DẠNG):
                        </div>
                        <WorkspaceKeywordPanel 
                          currentConfig={currentConfig}
                          onUpdateConfig={(partial) => {
                            updateEventConfig(selectedEventId, partial);
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* 📜 3. NỘI DUNG THEO CHẾ ĐỘ ĐANG CHỌN */}
                {(currentConfig.broadcastMode || 'fixed_script') === 'fixed_script' ? (
                  /* ========================================================================= */
                  /* CHẾ ĐỘ 1: KỊCH BẢN BÁN HÀNG CÀI SẴN (FIXED SCRIPT - NHIỀU TAB KỊCH BẢN) */
                  /* ========================================================================= */
                  <div className="space-y-4 mb-4">
                    <fieldset className="border-2 border-blue-300 rounded-2xl p-4 pt-4 relative bg-blue-50/30 shadow-xs">
                      <legend className="absolute -top-3 left-4 bg-white px-2.5 py-0.5 text-xs font-black text-blue-900 flex items-center gap-1.5 border border-blue-300 rounded-lg shadow-2xs">
                        <FileText size={14} className="text-blue-600" /> KỊCH BẢN BÁN HÀNG PHÁT THEO THỨ TỰ (FIXED SCRIPT)
                        <HelpTooltip helpKey="fixedScriptText" />
                      </legend>

                      <div className="flex flex-col gap-4 mt-1">
                        
                        {/* 🌟 1. THANH QUẢN LÝ NHIỀU TAB KỊCH BẢN (MULTIPLE SCRIPT TABS) */}
                        <div className="p-3.5 bg-white rounded-xl border border-blue-200 shadow-2xs space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-blue-100">
                            <div>
                              <div className="text-xs font-black text-blue-900 flex items-center gap-1.5 uppercase tracking-wide">
                                <Layers size={15} className="text-blue-600" /> DANH SÁCH CÁC TAB KỊCH BẢN BÁN HÀNG ({currentScriptTabs.length} Kịch Bản):
                              </div>
                              <p className="text-[11px] text-gray-500 mt-0.5">
                                Mở nhiều kịch bản khác nhau để chuyển đổi nhanh khi Live. Tích chọn kịch bản bạn muốn sử dụng để phát sóng trực tiếp.
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={handleAddScriptTab}
                              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm hover:scale-[1.02] active:scale-98 shrink-0"
                            >
                              <Plus size={15} /> ➕ Thêm Kịch Bản Mới
                            </button>
                          </div>

                          {/* DANH SÁCH TAB PILLS */}
                          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
                            {currentScriptTabs.map((tab, idx) => {
                              const isEditing = tab.id === activeEditingTab.id;
                              const isLiveActive = tab.active === true;
                              const sentenceCount = (tab.fixedScriptText || '').split(/\r?\n/).filter(Boolean).length;

                              return (
                                <div
                                  key={tab.id}
                                  onClick={() => handleSelectActiveScriptForLive(tab.id)}
                                  className={`group relative flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border shrink-0 select-none shadow-sm ${
                                    isLiveActive
                                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-700 shadow-md ring-2 ring-blue-400 font-black'
                                      : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400 hover:bg-blue-50/60'
                                  }`}
                                >
                                  <div className="flex items-center gap-1.5">
                                    <FileText size={14} className={isLiveActive ? 'text-blue-100' : 'text-blue-600'} />
                                    <span className="max-w-[150px] sm:max-w-[200px] truncate">
                                      {tab.name || `Kịch bản ${idx + 1}`}
                                    </span>
                                  </div>

                                  {/* BADGE ACTIVE FOR LIVE */}
                                  {isLiveActive ? (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 bg-emerald-400 text-emerald-950 shadow-xs animate-pulse">
                                      <Check size={11} strokeWidth={3.5} /> ĐANG PHÁT LIVE
                                    </span>
                                  ) : (
                                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold text-gray-500 bg-gray-100 border border-gray-200 group-hover:border-blue-300 group-hover:text-blue-600">
                                      Click để Live
                                    </span>
                                  )}

                                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                                    isLiveActive ? 'bg-blue-800/80 text-blue-100' : 'bg-gray-100 text-gray-500'
                                  }`}>
                                    {sentenceCount} câu
                                  </span>

                                  {/* QUICK DELETE IF > 1 */}
                                  {currentScriptTabs.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteScriptTab(tab.id);
                                      }}
                                      className={`p-1 rounded-md transition-all cursor-pointer ml-1 ${
                                        isEditing 
                                          ? 'hover:bg-red-500 text-blue-200 hover:text-white' 
                                          : 'hover:bg-red-50 text-gray-400 hover:text-red-600'
                                      }`}
                                      title="Xóa kịch bản này"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* 🌟 2. CẤU HÌNH & CHỈNH SỬA KỊCH BẢN ĐANG CHỌN */}
                        <div className="p-4 bg-white rounded-xl border-2 border-blue-200 space-y-3.5 shadow-xs">
                          {/* HEADER TAB ĐANG CHỌN: TÊN, CHECKBOX CHỌN PHÁT LIVE, NÚT NHÂN BẢN / XÓA */}
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-gray-200">
                            <div className="flex items-center gap-2 flex-1">
                              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 shrink-0">
                                <Edit3 size={14} className="text-blue-600" />
                                <span>Tên Kịch Bản:</span>
                              </div>
                              <input
                                type="text"
                                value={activeEditingTab.name || ''}
                                onChange={(e) => handleUpdateActiveScriptTab('name', e.target.value)}
                                placeholder="Nhập tên gợi nhớ cho kịch bản..."
                                className="flex-1 min-w-[180px] max-w-[320px] border border-blue-300 rounded-lg px-2.5 py-1 text-xs font-bold text-blue-900 bg-blue-50/40 focus:bg-white focus:outline-blue-500 shadow-inner"
                              />
                            </div>

                            <div className="flex items-center gap-2 flex-wrap">
                              {/* RADIO / CHECKBOX SỬ DỤNG KỊCH BẢN NÀY ĐỂ PHÁT SÓNG */}
                              <button
                                type="button"
                                onClick={() => handleSelectActiveScriptForLive(activeEditingTab.id)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                                  activeEditingTab.active
                                    ? 'bg-emerald-600 text-white shadow-emerald-200 ring-2 ring-emerald-400'
                                    : 'bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 border border-gray-300'
                                }`}
                              >
                                {activeEditingTab.active ? (
                                  <>
                                    <CheckCircle2 size={15} className="text-white" />
                                    <span>🎯 Kịch Bản Này Đang Được Chọn Phát Live</span>
                                  </>
                                ) : (
                                  <>
                                    <CheckSquare size={15} className="text-gray-400" />
                                    <span>🎯 Tích Chọn Kịch Bản Này Để Phát Live</span>
                                  </>
                                )}
                              </button>

                              {/* NHÂN BẢN */}
                              <button
                                type="button"
                                onClick={() => handleDuplicateScriptTab(activeEditingTab.id)}
                                className="px-2.5 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer border border-gray-300 shadow-2xs"
                                title="Tạo một bản sao từ kịch bản này"
                              >
                                <Copy size={13} />
                                <span>Nhân Bản</span>
                              </button>

                              {/* XÓA */}
                              {currentScriptTabs.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteScriptTab(activeEditingTab.id)}
                                  className="px-2.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer border border-red-200 shadow-2xs"
                                  title="Xóa kịch bản này"
                                >
                                  <Trash2 size={13} />
                                  <span>Xóa</span>
                                </button>
                              )}
                            </div>
                          </div>

                          {/* 10 PHONG CÁCH LIVESTREAM AI & THỜI LƯỢNG CỦA TAB NÀY */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2 border-b border-blue-100">
                            <div>
                              <div className="flex items-center text-xs font-bold text-blue-900 mb-1">
                                <span>🎭 10 Phong Cách Livestream Của AI:</span>
                                <HelpTooltip helpKey="aiLiveStyle" />
                              </div>
                              <select
                                value={activeEditingTab.aiLiveStyle || 'sales_fast'}
                                onChange={(e) => handleStyleChangeForTab(e.target.value)}
                                className="w-full border border-blue-300 rounded-lg px-2.5 py-1.5 text-xs bg-white font-bold text-blue-900 focus:outline-blue-500 cursor-pointer shadow-2xs"
                              >
                                <option value="sales_fast">🔥 1. Hào Hứng - Năng Động - Chốt Sale Thần Tốc</option>
                                <option value="skincare_expert">🌸 2. Thân Thiện - Dịu Dàng - Chuyên Gia Da Liễu</option>
                                <option value="tiktok_funny">😂 3. Hài Hước - Duyên Dáng - Bắt Trend TikTok</option>
                                <option value="luxury_elegant">💎 4. Sang Trọng - Quyến Rũ - Đẳng Cấp Thượng Lưu</option>
                                <option value="tech_expert">🎓 5. Giáo Dục - Chia Sẻ Giá Trị - Chuyên Gia Công Nghệ</option>
                                <option value="countdown_urgent">⏳ 6. Giục Giã - Đếm Ngược Khẩn Cấp - Flash Sale</option>
                                <option value="emotional_story">💖 7. Tâm Sự - Chân Thành - Chia Sẻ Cảm Xúc</option>
                                <option value="motivational_fire">📢 8. Hùng Biện - Năng Lượng Đỉnh Cao - Truyền Lửa</option>
                                <option value="gen_z_vibes">🛹 9. Gen Z Năng Động - Trẻ Trung - Phá Cách</option>
                                <option value="vip_master">👑 10. VIP Master Streamer - Đỉnh Cao Thuyết Phục</option>
                              </select>
                            </div>

                            <div>
                              <div className="flex items-center text-xs font-bold text-blue-900 mb-1">
                                <span>⏳ Thời Lượng Phiên Live AI:</span>
                                <HelpTooltip helpKey="aiLiveDuration" />
                              </div>
                              <select
                                value={activeEditingTab.scriptDurationMinutes || 60}
                                onChange={(e) => handleUpdateActiveScriptTab('scriptDurationMinutes', Number(e.target.value) || 60)}
                                className="w-full border border-blue-300 rounded-lg px-2.5 py-1.5 text-xs bg-white font-bold text-blue-900 focus:outline-blue-500 cursor-pointer shadow-2xs"
                              >
                                <option value="15">⏱️ 15 phút (Phiên ngắn)</option>
                                <option value="30">⏱️ 30 phút</option>
                                <option value="45">⏱️ 45 phút</option>
                                <option value="60">⏱️ 60 phút (1 tiếng chuẩn)</option>
                                <option value="90">⏱️ 90 phút (1.5 tiếng)</option>
                                <option value="120">⏱️ 120 phút (2 tiếng)</option>
                                <option value="180">⏱️ 180 phút (3 tiếng)</option>
                              </select>
                            </div>
                          </div>

                          {/* 10 MẪU KỊCH BẢN CHUẨN XỊN 60 PHÚT */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="text-xs font-black text-blue-900 flex items-center gap-1.5">
                              <Sparkles size={15} className="text-amber-500 animate-bounce" /> NẠP NHANH 10 MẪU KỊCH BẢN BÁN HÀNG 60 PHÚT (10 NGÀNH NGHỀ HOT):
                              <HelpTooltip helpKey="presetScript" />
                            </div>

                            <div className="shrink-0">
                              <UniversalFileUploadButton 
                                onLoaded={(text) => handleUpdateActiveScriptTab('fixedScriptText', text)}
                                label="Nạp File (.docx, .pdf, .txt, .json)"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 pt-1">
                            {[
                              { id: 'cosmetics', label: '🌸 Mỹ Phẩm & Skincare', color: 'bg-pink-50 hover:bg-pink-100 text-pink-700 border-pink-300' },
                              { id: 'perfume', label: '🌹 Nước Hoa Cao Cấp', color: 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-300' },
                              { id: 'women_fashion', label: '👗 Thời Trang Nữ', color: 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-300' },
                              { id: 'men_fashion', label: '👔 Thời Trang Nam', color: 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-300' },
                              { id: 'tech_ai', label: '💻 Công Nghệ & Khóa Học AI', color: 'bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border-cyan-300' },
                              { id: 'smart_home', label: '🏠 Gia Dụng Thông Minh', color: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-300' },
                              { id: 'health_wellness', label: '🌿 Thực Phẩm Sức Khỏe', color: 'bg-green-50 hover:bg-green-100 text-green-700 border-green-300' },
                              { id: 'jewelry_fengshui', label: '🔮 Trang Sức Phong Thủy', color: 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-300' },
                              { id: 'food_specialty', label: '🍜 Đặc Sản Vùng Miền', color: 'bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-300' },
                              { id: 'flash_sale', label: '⚡ Flash Sale Xả Kho', color: 'bg-red-50 hover:bg-red-100 text-red-700 border-red-300' },
                            ].map(item => (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => applyMasterScriptToTab(item.id)}
                                className={`p-2 border rounded-xl text-xs font-bold transition-all text-left truncate cursor-pointer shadow-2xs hover:scale-[1.02] active:scale-98 ${item.color}`}
                              >
                                {item.label}
                              </button>
                            ))}
                          </div>

                          {/* TEXTAREA KỊCH BẢN */}
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                                <FileText size={13} className="text-blue-600" />
                                <span>Nội dung câu thoại của kịch bản <b className="text-blue-900">"{activeEditingTab.name || 'Kịch bản'}"</b>:</span>
                              </span>
                              <div className="flex items-center gap-2 flex-wrap">
                                <button
                                  type="button"
                                  onClick={() => setShowMultiAvatarModal(true)}
                                  className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border border-indigo-400 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95 animate-pulse"
                                  title="Mở Studio thiết lập 2, 3 hoặc 4 Avatar (Đa Nhân Vật) đối thoại tương tác trực tiếp"
                                >
                                  <Users size={13} className="text-yellow-300" />
                                  <span>👥 Studio 2–4 Avatar</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const currentText = activeEditingTab.fixedScriptText !== undefined ? activeEditingTab.fixedScriptText : MASTER_SCRIPTS.cosmetics;
                                    const optimized = polishAndOptimizeScript(currentText);
                                    handleUpdateActiveScriptTab('fixedScriptText', optimized);
                                    toast.success('✨ Đã tối ưu kịch bản cảm xúc, nhấn nhá và chốt đơn thành công!');
                                  }}
                                  className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-900 border border-amber-400/50 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                                  title="Tự động sắp xếp lại câu từ, lấy hơi, ngữ điệu cảm xúc và tăng sức hút chốt đơn"
                                >
                                  <Sparkles size={13} className="text-amber-600" />
                                  <span>Tối Ưu Kịch Bản</span>
                                </button>
                                <UniversalFileUploadButton 
                                  onLoaded={(text) => handleUpdateActiveScriptTab('fixedScriptText', text)}
                                  label="Nạp File Kịch Bản"
                                />
                              </div>
                            </div>

                            {/* MULTI-AVATAR SPEAKER TAG QUICK-INSERT BAR */}
                            <div className="flex items-center gap-1.5 flex-wrap bg-slate-100/90 p-1.5 rounded-lg border border-slate-200">
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider pl-1 flex items-center gap-1">
                                <Tag size={11} className="text-indigo-600" /> Chèn vai đọc:
                              </span>
                              {[
                                { tag: '[Idol]: ', label: '+ [Idol]', color: 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200' },
                                { tag: '[Trợ Lý]: ', label: '+ [Trợ Lý]', color: 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200' },
                                { tag: '[BLV Game]: ', label: '+ [BLV Game]', color: 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200' },
                                { tag: '[Khách Mời]: ', label: '+ [Khách Mời]', color: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200' },
                              ].map((chip) => (
                                <button
                                  key={chip.tag}
                                  type="button"
                                  onClick={() => {
                                    const currentText = activeEditingTab.fixedScriptText !== undefined ? activeEditingTab.fixedScriptText : MASTER_SCRIPTS.cosmetics;
                                    const newText = currentText ? `${currentText.trimEnd()}\n${chip.tag}` : chip.tag;
                                    handleUpdateActiveScriptTab('fixedScriptText', newText);
                                    toast.success(`Đã thêm ${chip.label}`);
                                  }}
                                  className={`px-2 py-0.5 rounded-md border text-[11px] font-bold cursor-pointer transition-all active:scale-95 shadow-2xs ${chip.color}`}
                                >
                                  {chip.label}
                                </button>
                              ))}
                            </div>

                            <div className="relative">
                              <textarea 
                                value={activeEditingTab.fixedScriptText !== undefined ? activeEditingTab.fixedScriptText : MASTER_SCRIPTS.cosmetics} 
                                onChange={(e) => handleUpdateActiveScriptTab('fixedScriptText', e.target.value)} 
                                placeholder="Nhập hoặc dán chuỗi các câu thoại kịch bản (ví dụ: [Idol]: Chào các tình yêu! \n[Trợ Lý]: Dạ đúng rồi chốt đơn liền nha!)..."
                                className="w-full h-[240px] border border-gray-300 rounded-xl p-3.5 text-xs resize-y bg-white focus:outline-blue-500 font-sans leading-relaxed shadow-inner" 
                              />
                              <div className="absolute bottom-3 right-3 text-[11px] text-gray-500 bg-white/90 px-2 py-0.5 rounded-md border border-gray-200 font-bold shadow-2xs">
                                {(activeEditingTab.fixedScriptText || '').split(/\r?\n/).filter(Boolean).length} câu thoại
                              </div>
                            </div>
                          </div>

                          {/* CÀI ĐẶT THỜI GIAN VÀ THỜI LƯỢNG */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-blue-50/40 rounded-xl border border-blue-200 text-xs">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-bold text-gray-700">⏱️ Thời gian nghỉ giữa câu:</span>
                              <div className="flex items-center gap-1">
                                <input 
                                  type="number" 
                                  min="0" 
                                  max="30"
                                  step="0.1"
                                  value={activeEditingTab.pauseBetweenSentences !== undefined ? activeEditingTab.pauseBetweenSentences : 0.1} 
                                  onChange={(e) => handleUpdateActiveScriptTab('pauseBetweenSentences', Number(e.target.value))}
                                  className="w-16 border border-gray-300 rounded-lg px-2 py-1 text-center font-bold bg-white" 
                                />
                                <span className="text-gray-500">giây</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between gap-2">
                              <span className="font-bold text-gray-700">⏳ Thời lượng phát kịch bản:</span>
                              <div className="flex items-center gap-1">
                                <select
                                  value={activeEditingTab.scriptDurationMinutes || 60}
                                  onChange={(e) => handleUpdateActiveScriptTab('scriptDurationMinutes', Number(e.target.value) || 60)}
                                  className="border border-gray-300 rounded-lg px-2 py-1 text-xs font-bold bg-white cursor-pointer"
                                >
                                  <option value="30">30 phút</option>
                                  <option value="45">45 phút</option>
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
                                id={`loopScriptCheckbox_${activeEditingTab.id}`}
                                checked={activeEditingTab.loopScript !== false} 
                                onChange={(e) => handleUpdateActiveScriptTab('loopScript', e.target.checked)}
                                className="w-4 h-4 text-blue-600 rounded cursor-pointer" 
                              />
                              <label htmlFor={`loopScriptCheckbox_${activeEditingTab.id}`} className="font-bold text-gray-700 cursor-pointer">
                                🔁 Tự động lặp lại kịch bản
                              </label>
                            </div>
                          </div>

                          {/* NGHE THỬ VOICE TOÀN BỘ KỊCH BẢN */}
                          <EventVoiceTester 
                            text={activeEditingTab.fixedScriptText || MASTER_SCRIPTS.cosmetics}
                            defaultVoiceId={activeEditingTab.voiceId || currentConfig.voiceId || "free_vi_female"}
                            onVoiceChange={(vid) => {
                              handleUpdateActiveScriptTab('voiceId', vid);
                              handleSimpleChange('voiceId', vid);
                            }}
                            onScriptOptimized={(optText) => {
                              handleUpdateActiveScriptTab('fixedScriptText', optText);
                              toast.success('✨ Đã cập nhật kịch bản tối ưu thành công!');
                            }}
                            label={`Nghe thử toàn bộ kịch bản "${activeEditingTab.name || 'này'}" (Mọi Giọng Đọc AI)`}
                            compact={false}
                          />
                        </div>
                      </div>
                    </fieldset>
                  </div>
                ) : (
                  /* ========================================================================= */
                  /* CHẾ ĐỘ 2: BỘ NÃO AI & KHO TRI THỨC DOANH NGHIỆP (AI BRAIN & KNOWLEDGE) */
                  /* ========================================================================= */
                  <div className="space-y-4 mb-4">
                    <fieldset className="border-2 border-purple-300 rounded-2xl p-4 pt-4 relative bg-purple-50/30 shadow-xs">
                      <legend className="absolute -top-3 left-4 bg-white px-2.5 py-0.5 text-xs font-black text-purple-900 flex items-center gap-1.5 border border-purple-300 rounded-lg shadow-2xs">
                        <Bot size={14} className="text-purple-600" /> KHO TRI THỨC DOANH NGHIỆP & SẢN PHẨM (AI KNOWLEDGE BASE)
                      </legend>

                      <div className="space-y-4 mt-1">
                        {/* NẠP FILE TÀI LIỆU DOANH NGHIỆP */}
                        <div className="p-3.5 bg-white rounded-xl border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                          <div>
                            <div className="text-xs font-black text-purple-900 flex items-center gap-1.5">
                              <BookOpen size={15} className="text-purple-600" /> TẢI FILE TÀI LIỆU TRI THỨC DOANH NGHIỆP / SẢN PHẨM:
                            </div>
                            <p className="text-[11px] text-gray-500 mt-0.5">
                              Hỗ trợ tất cả các định dạng: <b>.docx, .doc, .pdf, .txt, .json, .csv, .md, .xlsx, .xls</b>. AI sẽ tự động học thuộc 100% dữ liệu để trả lời khách trực tiếp.
                            </p>
                            {currentConfig.companyKnowledgeFileName && (
                              <div className="mt-1 text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                                <CheckCircle2 size={12} /> Đã nạp file: {currentConfig.companyKnowledgeFileName}
                              </div>
                            )}
                          </div>

                          <div className="shrink-0">
                            <UniversalFileUploadButton 
                              onLoaded={(text, fileName) => {
                                handleSimpleChange('companyKnowledgeText', text);
                                if (fileName) handleSimpleChange('companyKnowledgeFileName', fileName);
                              }}
                              label="Nạp File Tri Thức (.docx, .pdf, .txt...)"
                            />
                          </div>
                        </div>

                        {/* FORM CẤU HÌNH THÔNG TIN DOANH NGHIỆP */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <div className="flex items-center text-xs font-bold text-gray-700 mb-1">
                              <span>🏢 Tên Doanh Nghiệp / Thương Hiệu:</span>
                              <HelpTooltip helpKey="companyName" />
                            </div>
                            <input 
                              type="text" 
                              value={currentConfig.companyName || 'CÔNG TY PHẦN MỀM THIÊN VUA APP'} 
                              onChange={(e) => handleSimpleChange('companyName', e.target.value)} 
                              placeholder="Ví dụ: Shop Mỹ Phẩm Ngọc Nhi, Thiên Vua App..."
                              className="w-full border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-purple-500 font-bold" 
                            />
                          </div>

                          <div>
                            <div className="flex items-center text-xs font-bold text-gray-700 mb-1">
                              <span>📦 Tên Sản Phẩm / Dịch Vụ Chính:</span>
                              <HelpTooltip helpKey="productName" />
                            </div>
                            <input 
                              type="text" 
                              value={currentConfig.productName || 'Bộ Đôi Serum Tế Bào Gốc & Nước Hoa Pháp'} 
                              onChange={(e) => handleSimpleChange('productName', e.target.value)} 
                              placeholder="Ví dụ: Serum Tế Bào Gốc, Nước Hoa Pháp, Phần mềm AvaLive..."
                              className="w-full border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-purple-500 font-bold" 
                            />
                          </div>

                          <div>
                            <div className="flex items-center text-xs font-bold text-gray-700 mb-1">
                              <span>💰 Giá Niêm Yết & Giá Flash Sale Live:</span>
                              <HelpTooltip helpKey="productPrice" />
                            </div>
                            <input 
                              type="text" 
                              value={currentConfig.productPrice || '1.850.000đ - Giảm 50% chỉ còn 890.000đ trên live'} 
                              onChange={(e) => handleSimpleChange('productPrice', e.target.value)} 
                              placeholder="Ví dụ: Giá gốc 1.850.000đ, giá live 890.000đ..."
                              className="w-full border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-purple-500" 
                            />
                          </div>

                          <div>
                            <div className="flex items-center justify-between text-xs font-bold text-gray-700 mb-1">
                              <div className="flex items-center">
                                <span>🎁 Quà Tặng Kèm & Khuyến Mãi:</span>
                                <HelpTooltip helpKey="promotions" />
                              </div>
                              <UniversalFileUploadButton 
                                onLoaded={(text) => handleSimpleChange('promotions', text)}
                                label="Nạp File"
                              />
                            </div>
                            <input 
                              type="text" 
                              value={currentConfig.promotions || 'Tặng kèm tuýp kem dưỡng ẩm mini + Freeship toàn quốc'} 
                              onChange={(e) => handleSimpleChange('promotions', e.target.value)} 
                              placeholder="Ví dụ: Tặng kem dưỡng mini, tặng voucher 50k, freeship..."
                              className="w-full border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-purple-500" 
                            />
                          </div>
                        </div>

                        {/* ĐIỂM NỔI BẬT & BẢO HÀNH */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center text-xs font-bold text-gray-700">
                                <span>✨ Tính Năng, Thành Phần & Công Dụng:</span>
                                <HelpTooltip helpKey="keyFeatures" />
                              </div>
                              <UniversalFileUploadButton 
                                onLoaded={(text) => handleSimpleChange('keyFeatures', text)}
                                label="Nạp File (.docx, .pdf, .txt...)"
                              />
                            </div>
                            <textarea 
                              value={currentConfig.keyFeatures || `1. Tinh chất Serum tế bào gốc phục hồi làn da căng bóng sau 7 ngày.\n2. Nước hoa Pháp hương thơm ngọt ngào, sang trọng lưu hương suốt 12 tiếng.\n3. Thành phần tự nhiên 100% đạt chuẩn y khoa da liễu, an toàn cho mọi loại da.`} 
                              onChange={(e) => handleSimpleChange('keyFeatures', e.target.value)} 
                              placeholder="Mô tả các đặc điểm nổi bật để AI tư vấn cho khách..."
                              className="w-full h-[80px] border border-gray-300 rounded-lg p-2 text-xs resize-none bg-white focus:outline-purple-500 leading-relaxed" 
                            />
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center text-xs font-bold text-gray-700">
                                <span>🛡️ Chính Sách Bảo Hành / Đổi Trả / Vận Chuyển:</span>
                                <HelpTooltip helpKey="warrantyPolicy" />
                              </div>
                              <UniversalFileUploadButton 
                                onLoaded={(text) => handleSimpleChange('warrantyPolicy', text)}
                                label="Nạp File (.docx, .pdf, .txt...)"
                              />
                            </div>
                            <textarea 
                              value={currentConfig.warrantyPolicy || 'Bảo hành 1 đổi 1 trong 30 ngày, hoàn tiền 200% nếu phát hiện hàng giả, miễn phí vận chuyển tận nhà trên toàn quốc'} 
                              onChange={(e) => handleSimpleChange('warrantyPolicy', e.target.value)} 
                              placeholder="Ví dụ: Đổi trả trong 30 ngày, freeship toàn quốc..."
                              className="w-full h-[80px] border border-gray-300 rounded-lg p-2 text-xs resize-none bg-white focus:outline-purple-500 leading-relaxed" 
                            />
                          </div>
                        </div>

                        {/* 10 PHONG CÁCH LIVESTREAM AI & THỜI LƯỢNG */}
                        <div className="p-3.5 bg-white rounded-xl border border-purple-200 space-y-3 shadow-2xs">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <div className="flex items-center text-xs font-bold text-purple-900 mb-1">
                                <span>🎭 10 Phong Cách Livestream Của AI:</span>
                                <HelpTooltip helpKey="aiLiveStyle" />
                              </div>
                              <select
                                value={currentConfig.aiLiveStyle || 'sales_fast'}
                                onChange={(e) => handleStyleChange(e.target.value)}
                                className="w-full border border-purple-300 rounded-lg px-2.5 py-1.5 text-xs bg-white font-bold text-purple-900 focus:outline-purple-500 cursor-pointer"
                              >
                                <option value="sales_fast">🔥 1. Hào Hứng - Năng Động - Chốt Sale Thần Tốc</option>
                                <option value="skincare_expert">🌸 2. Thân Thiện - Dịu Dàng - Chuyên Gia Da Liễu</option>
                                <option value="tiktok_funny">😂 3. Hài Hước - Duyên Dáng - Bắt Trend TikTok</option>
                                <option value="luxury_elegant">💎 4. Sang Trọng - Quyến Rũ - Đẳng Cấp Thượng Lưu</option>
                                <option value="tech_expert">🎓 5. Giáo Dục - Chia Sẻ Giá Trị - Chuyên Gia Công Nghệ</option>
                                <option value="countdown_urgent">⏳ 6. Giục Giã - Đếm Ngược Khẩn Cấp - Flash Sale</option>
                                <option value="emotional_story">💖 7. Tâm Sự - Chân Thành - Chia Sẻ Cảm Xúc</option>
                                <option value="motivational_fire">📢 8. Hùng Biện - Năng Lượng Đỉnh Cao - Truyền Lửa</option>
                                <option value="gen_z_vibes">🛹 9. Gen Z Năng Động - Trẻ Trung - Phá Cách</option>
                                <option value="vip_master">👑 10. VIP Master Streamer - Đỉnh Cao Thuyết Phục</option>
                              </select>
                            </div>

                            <div>
                              <div className="flex items-center text-xs font-bold text-purple-900 mb-1">
                                <span>⏳ Thời Lượng Phiên Live AI:</span>
                                <HelpTooltip helpKey="aiLiveDuration" />
                              </div>
                              <div className="flex items-center gap-2">
                                <select
                                  value={currentConfig.aiLiveDuration || 60}
                                  onChange={(e) => handleSimpleChange('aiLiveDuration', Number(e.target.value) || 60)}
                                  className="flex-1 border border-purple-300 rounded-lg px-2.5 py-1.5 text-xs bg-white font-bold text-purple-900 focus:outline-purple-500 cursor-pointer"
                                >
                                  <option value="30">30 phút</option>
                                  <option value="45">45 phút</option>
                                  <option value="60">60 phút (1 tiếng)</option>
                                  <option value="90">90 phút (1.5 tiếng)</option>
                                  <option value="120">120 phút (2 tiếng)</option>
                                  <option value="180">180 phút (3 tiếng)</option>
                                </select>

                                <button
                                  type="button"
                                  onClick={handleGenerateAiScript}
                                  className="px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
                                >
                                  <Sparkles size={14} /> Tạo Kịch Bản Bằng AI
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Ô NHẬP VĂN BẢN TRI THỨC TỰ DO */}
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center text-xs font-bold text-gray-700">
                                <span>📚 Nội Dung Tri Thức Doanh Nghiệp Tự Do (Tùy chọn):</span>
                                <HelpTooltip helpKey="companyKnowledgeText" />
                              </div>
                              <UniversalFileUploadButton 
                                onLoaded={(text) => handleSimpleChange('companyKnowledgeText', text)}
                                label="Nạp File Tri Thức (.docx, .pdf, .txt...)"
                              />
                            </div>
                            <textarea 
                              value={currentConfig.companyKnowledgeText || ''} 
                              onChange={(e) => handleSimpleChange('companyKnowledgeText', e.target.value)} 
                              placeholder="Dán thêm thông tin bảng giá, quy định bảo hành, feedback khách hàng vào đây. AI sẽ dùng toàn bộ dữ liệu này để tư vấn chốt đơn cho khách..."
                              className="w-full h-[90px] border border-gray-300 rounded-lg p-2.5 text-xs resize-y bg-white focus:outline-purple-500 font-sans leading-relaxed" 
                            />
                          </div>

                          {/* SYSTEM PROMPT CHO AI */}
                          <div className="pt-2 border-t border-purple-100">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center text-xs font-bold text-purple-900 gap-1">
                                <span>🧠 System Prompt Kịch Bản Đóng Vai AI:</span>
                                <HelpTooltip helpKey="aiPrompt" />
                              </div>
                              <UniversalFileUploadButton 
                                onLoaded={(text) => handleSimpleChange('aiPrompt', text)}
                                label="Nạp Prompt (.docx, .pdf, .txt, .json)"
                              />
                            </div>

                            <textarea 
                              value={currentConfig.aiPrompt !== undefined ? currentConfig.aiPrompt : NEW_AI_PROMPT} 
                              onChange={(e) => handleSimpleChange('aiPrompt', e.target.value)} 
                              placeholder="Prompt chỉ đạo hành vi cho AI khi livestream..."
                              className="w-full h-[100px] border border-purple-200 rounded-lg p-2 text-[11px] font-mono bg-purple-50/20 focus:bg-white focus:outline-purple-500 resize-y" 
                            />
                          </div>

                          {/* NGHE THỬ VOICE BỘ NÃO AI */}
                          <EventVoiceTester 
                            text={currentConfig.fixedScriptText || MASTER_SCRIPTS.cosmetics}
                            defaultVoiceId="free_vi_female"
                            label="Nghe thử Voice câu thoại AI tạo ra"
                            compact={false}
                          />
                        </div>
                      </div>
                    </fieldset>
                  </div>
                )}

              </div>
            </>
          ) : selectedEventId === 'checkout' ? (
            /* ========================================================================= */
            /* 5. TAB 2: 🛒 CHỐT ĐƠN (GIỎ HÀNG & DANH SÁCH MÃ HÀNG LIVESTREAM) */
            /* ========================================================================= */
            <>
              <div className="border border-gray-300 rounded-2xl bg-white mb-4 shadow-sm px-4 py-5">
                
                {/* 1. KHỞI CHẠY & ƯU TIÊN */}
                <div className="flex items-center gap-6 mb-5 pb-3 border-b border-gray-100 flex-wrap">
                  <div className="flex items-center">
                    <FieldLabel icon="✅" text="Kích hoạt chốt đơn" helpKey="active" minW="min-w-[150px]" htmlFor="active-checkout" />
                    <input type="checkbox" id="active-checkout" name="active" checked={currentConfig.active} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded cursor-pointer accent-blue-600" />
                  </div>
                  <div className="flex items-center">
                    <FieldLabel icon="⭐" text="Độ ưu tiên" helpKey="priority" minW="min-w-[100px]" />
                    <input type="number" name="priority" value={currentConfig.priority} onChange={handleChange} className="w-28 border border-gray-300 rounded-lg px-2.5 py-1 text-xs bg-gray-50 focus:bg-white focus:outline-blue-500 font-bold" />
                  </div>
                </div>

                {/* 🛍️ DANH SÁCH SẢN PHẨM / MÃ HÀNG LIVESTREAM */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div>
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <ShoppingBag size={16} className="text-blue-600" />
                        <span>DANH SÁCH SẢN PHẨM / MÃ HÀNG LIVESTREAM</span>
                        <HelpTooltip helpKey="checkoutProducts" />
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Khai báo các sản phẩm có trong giỏ hàng để AI tự động nhận diện từ khóa, phát video minh họa và tư vấn chốt đơn cho từng sản phẩm.
                      </p>
                    </div>

                    <button 
                      onClick={handleAddProduct}
                      className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                    >
                      <Plus size={14} /> Thêm Sản Phẩm Mới
                    </button>
                  </div>

                  {(!currentConfig.checkoutProducts || currentConfig.checkoutProducts.length === 0) ? (
                    <div className="text-center py-6 text-xs text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                      Chưa có sản phẩm nào trong danh sách. Bấm <b>"Thêm Sản Phẩm Mới"</b> để bắt đầu khai báo mã hàng!
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {currentConfig.checkoutProducts.map(prod => (
                        <fieldset key={prod.id} className="border border-blue-200 rounded-xl p-4 pt-4 relative bg-white shadow-2xs">
                          <legend className="absolute -top-3 left-3 bg-white px-2.5 py-0.5 text-xs font-bold text-blue-900 flex items-center gap-2 border border-blue-200 rounded-md shadow-2xs">
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

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-1 text-xs">
                            <div>
                              <div className="flex items-center text-xs font-bold text-gray-700 mb-1">
                                <span>🏷️ Tên sản phẩm:</span>
                                <HelpTooltip helpKey="productName" />
                              </div>
                              <input 
                                type="text" 
                                value={prod.productName} 
                                onChange={(e) => handleProductChange(prod.id, 'productName', e.target.value)} 
                                placeholder="Ví dụ: Serum Tế Bào Gốc Trẻ Hóa Da, Nước Hoa Pháp..."
                                className="border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-blue-500 w-full font-bold text-blue-900" 
                              />
                            </div>

                            <div>
                              <div className="flex items-center justify-between text-xs font-bold text-[#a53b3b] mb-1">
                                <div className="flex items-center">
                                  <span>🔑 Từ khóa chốt đơn (cách nhau bởi ;):</span>
                                  <HelpTooltip helpKey="keywords" />
                                </div>
                                <UniversalFileUploadButton 
                                  onLoaded={(text) => {
                                    const cleaned = text.split(/\r?\n/).map(s => s.trim()).filter(Boolean).join('; ');
                                    handleProductChange(prod.id, 'keywords', cleaned || text);
                                  }}
                                  label="Nạp File Từ Khóa"
                                />
                              </div>
                              <input 
                                type="text" 
                                value={prod.keywords} 
                                onChange={(e) => handleProductChange(prod.id, 'keywords', e.target.value)} 
                                placeholder="Ví dụ: sp1; mã 01; serum; mua serum; chốt 01; giá"
                                className="border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-blue-500 w-full" 
                              />
                            </div>

                            <div>
                              <div className="flex items-center text-xs font-bold text-gray-700 mb-1">
                                <span>💰 Giá niêm yết & Giá Flash Sale:</span>
                                <HelpTooltip helpKey="productPrice" />
                              </div>
                              <input 
                                type="text" 
                                value={prod.priceInfo || ''} 
                                onChange={(e) => handleProductChange(prod.id, 'priceInfo', e.target.value)} 
                                placeholder="Ví dụ: Giá gốc 1.850.000đ - Giá live 890.000đ"
                                className="border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-blue-500 w-full" 
                              />
                            </div>

                            {/* CHỌN THƯ MỤC HOẶC TẢI VIDEO MINH HỌA TRỰC TIẾP HOẶC CHỌN MẪU */}
                            <div className="col-span-1 md:col-span-2">
                              <UniversalMediaPicker 
                                label="Thư mục / File Video Minh Họa Sản Phẩm"
                                currentPath={prod.videoFileName ? `🎬 ${prod.videoFileName}` : (prod.videoFolder || '')}
                                defaultText="Chưa chọn video minh họa (Dùng video Idol mặc định)"
                                onSelectFile={(file) => {
                                  const localUrl = URL.createObjectURL(file);
                                  handleProductChange(prod.id, 'videoFile', localUrl);
                                  handleProductChange(prod.id, 'videoFileName', file.name);
                                  handleProductChange(prod.id, 'videoFolder', file.name);
                                  toast.success(`Đã nạp video minh họa: ${file.name}`);
                                }}
                                onSelectFolder={(folderPath) => {
                                  handleProductChange(prod.id, 'videoFolder', folderPath);
                                  handleProductChange(prod.id, 'videoFileName', '');
                                  toast.success(`Đã chọn thư mục: ${folderPath}`);
                                }}
                                onSelectSample={(sample) => {
                                  handleProductChange(prod.id, 'videoFolder', sample.label);
                                  handleProductChange(prod.id, 'videoFileName', sample.label);
                                  handleProductChange(prod.id, 'videoFile', sample.url);
                                  toast.success(`Đã chọn video mẫu: ${sample.label}`);
                                }}
                                onClear={() => {
                                  handleProductChange(prod.id, 'videoFolder', '');
                                  handleProductChange(prod.id, 'videoFileName', '');
                                  handleProductChange(prod.id, 'videoFile', null);
                                  toast.success('Đã xóa video minh họa sản phẩm');
                                }}
                                inputId={`upload-video-prod-${prod.id}`}
                              />
                            </div>
                          </div>

                          {/* BỘ NGHE THỬ VOICE CHO TỪNG SẢN PHẨM */}
                          <div className="mt-3 pt-2.5 border-t border-gray-100">
                            <EventVoiceTester 
                              text={`Dạ em chào bạn {user}! Sản phẩm ${prod.productName || 'này'} đang có ưu đãi cực sốc trong giỏ hàng góc trái màn hình, giá chỉ ${prod.priceInfo || 'rất tốt'}, bạn bấm vào đặt hàng ngay để nhận voucher quà tặng nhé!`}
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

              </div>
            </>
          ) : (
            /* ========================================================================= */
            /* 6. CÁC TAB SỰ KIỆN KHÁC (BÌNH LUẬN, THEO DÕI, QUÀ, CHIA SẺ, TIM, CHÀO...) */
            /* ========================================================================= */
            <>
              <div className="border border-gray-300 rounded-md bg-white mb-3 shadow-sm px-3 py-4">
                <div className="flex flex-col gap-3">
                  
                  <fieldset className="border border-gray-300 rounded p-4 pt-4 relative">
                    <legend className="absolute -top-3 left-3 bg-white px-1 text-sm font-semibold text-gray-700 flex items-center gap-1">
                      <span>⚙️ Cài đặt Sự kiện: {selectedEventInfo?.label}</span>
                    </legend>
                    
                    <div className="flex flex-col gap-3">
                      
                      {/* Cấu hình tương tác Bình luận Thông minh 4 bước Đỉnh Cao */}
                      {selectedEventId === 'comment' && (
                        <div className="p-3.5 rounded-xl bg-gradient-to-br from-purple-50 via-indigo-50/70 to-blue-50 border border-purple-200 mb-3 space-y-4 shadow-sm">
                          
                          {/* BƯỚC 1: ĐỌC LẠI BÌNH LUẬN TRƯỚC KHI TRẢ LỜI */}
                          <div className="bg-white/90 p-3 rounded-xl border border-indigo-100 shadow-xs space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="text-xs font-black text-indigo-950 flex items-center gap-1.5 cursor-pointer" htmlFor="repeatCommentFirst-toggle">
                                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">1</span>
                                <span>ĐỌC LẠI CÂU HỎI / BÌNH LUẬN TRƯỚC KHI TRẢ LỜI</span>
                              </label>
                              <div className="flex items-center gap-2">
                                <input 
                                  type="checkbox" 
                                  id="repeatCommentFirst-toggle" 
                                  name="repeatCommentFirst" 
                                  checked={currentConfig.repeatCommentFirst !== false} 
                                  onChange={(e) => updateEventConfig('comment', { repeatCommentFirst: e.target.checked })} 
                                  className="w-4 h-4 text-indigo-600 rounded cursor-pointer accent-indigo-600" 
                                />
                                <span className="text-[11px] font-bold text-indigo-700">{currentConfig.repeatCommentFirst !== false ? 'Đang Bật' : 'Tắt'}</span>
                              </div>
                            </div>
                            
                            {currentConfig.repeatCommentFirst !== false && (
                              <div className="space-y-1.5 pt-1">
                                <div className="flex items-center justify-between text-[11px] text-gray-500">
                                  <span>Mẫu câu đọc lại (Biến: <code className="text-indigo-600 font-bold">{'{user}'}</code> = tên khách, <code className="text-indigo-600 font-bold">{'{comment}'}</code> = nội dung hỏi):</span>
                                  <UniversalFileUploadButton 
                                    onLoaded={(text) => updateEventConfig('comment', { repeatCommentPrefix: text })} 
                                    label="Nạp File Mẫu" 
                                  />
                                </div>
                                <input 
                                  type="text" 
                                  name="repeatCommentPrefix" 
                                  value={currentConfig.repeatCommentPrefix ?? 'Dạ bạn {user} vừa hỏi là: "{comment}". '} 
                                  onChange={(e) => updateEventConfig('comment', { repeatCommentPrefix: e.target.value })} 
                                  placeholder='Dạ bạn {user} vừa hỏi là: "{comment}". '
                                  className="w-full border border-indigo-200 rounded-lg px-2.5 py-1.5 text-xs bg-indigo-50/30 focus:bg-white focus:outline-indigo-500 font-medium text-gray-800"
                                />
                              </div>
                            )}
                          </div>

                          {/* BƯỚC 2: CHẾ ĐỘ TRẢ LỜI & NGUỒN TRI THỨC AI */}
                          <div className="bg-white/90 p-3 rounded-xl border border-purple-100 shadow-xs space-y-2.5">
                            <div className="text-xs font-black text-purple-950 flex items-center gap-1.5">
                              <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] font-bold">2</span>
                              <span>CHẾ ĐỘ TRẢ LỜI & BỘ NÃO AI SÁNG TẠO</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              {[
                                { id: 'keywords_only', label: '1. Chỉ Kịch Bản Từ Khóa', desc: 'Chỉ trả lời khi khớp từ khóa cài sẵn, bỏ qua câu khác' },
                                { id: 'ai_only', label: '2. Chỉ Bộ Não AI', desc: 'AI tự động đọc thông tin sản phẩm / hồ sơ & sáng tạo câu trả lời' },
                                { id: 'hybrid', label: '3. Kết Hợp Thông Minh', desc: 'Ưu tiên kịch bản từ khóa, nếu không khớp AI sẽ phân tích trả lời' },
                              ].map(mode => (
                                <button
                                  key={mode.id}
                                  type="button"
                                  onClick={() => updateEventConfig('comment', { commentReplyMode: mode.id })}
                                  className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                                    (currentConfig.commentReplyMode || 'hybrid') === mode.id
                                      ? 'bg-purple-600 text-white border-purple-700 shadow-md font-bold'
                                      : 'bg-white text-gray-700 border-gray-300 hover:bg-purple-50/50'
                                  }`}
                                >
                                  <div className="text-xs font-black flex items-center justify-between">
                                    <span>{mode.label}</span>
                                    {(currentConfig.commentReplyMode || 'hybrid') === mode.id && <CheckSquare size={13} />}
                                  </div>
                                  <div className={`text-[10.5px] mt-0.5 line-clamp-2 ${(currentConfig.commentReplyMode || 'hybrid') === mode.id ? 'text-purple-100' : 'text-gray-500'}`}>
                                    {mode.desc}
                                  </div>
                                </button>
                              ))}
                            </div>

                            {/* HÌNH THỨC PHẢN HỒI */}
                            <div className="pt-2 border-t border-purple-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <span className="text-[11.5px] font-bold text-gray-700 flex items-center gap-1">
                                <Volume2 size={13} className="text-purple-600" /> Hình thức phát:
                              </span>
                              <div className="flex items-center gap-1.5">
                                {[
                                  { id: 'voice_only', label: '🗣️ Giọng Đọc Voice' },
                                  { id: 'text_only', label: '💬 Chat Text' },
                                  { id: 'both', label: '🔄 Voice + Chat' },
                                ].map(fmt => (
                                  <button
                                    key={fmt.id}
                                    type="button"
                                    onClick={() => updateEventConfig('comment', { commentResponseFormat: fmt.id })}
                                    className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold transition-all cursor-pointer ${
                                      (currentConfig.commentResponseFormat || 'both') === fmt.id
                                        ? 'bg-purple-700 text-white border-purple-800 shadow-xs'
                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                                    }`}
                                  >
                                    {fmt.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* BƯỚC 3: Ô CẤU HÌNH XỬ LÝ KHI AI KHÔNG BIẾT / KHÔNG HIỂU CÂU HỎI (FALLBACK KHÉO LÉO) */}
                          <div className="bg-white/90 p-3 rounded-xl border border-amber-200 shadow-xs space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                                <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px] font-bold">3</span>
                                <span>XỬ LÝ KHI AI KHÔNG BIẾT / KHÔNG HIỂU CÂU HỎI (KHÉO LÉO & CHUYÊN NGHIỆP)</span>
                              </label>
                              <UniversalFileUploadButton 
                                onLoaded={(text) => updateEventConfig('comment', { unknownFallbackReply: text })} 
                                label="Nạp File" 
                              />
                            </div>
                            <p className="text-[11px] text-amber-800 leading-snug">
                              Khi khách hỏi câu hỏi nằm ngoài kho tri thức hoặc AI chưa rõ, trợ lý AI sẽ tự động trả lời khéo léo thông báo là trợ lý live, sẽ ghi nhận lại hỏi shop và mời khách inbox trực tiếp:
                            </p>
                            <textarea 
                              name="unknownFallbackReply" 
                              value={currentConfig.unknownFallbackReply ?? 'Dạ bạn {user} ơi, câu hỏi này em là trợ lý live nên xin phép ghi nhận lại để hỏi lại shop và phản hồi chi tiết cho mình sau nha! Bạn có thể nhắn tin (inbox) trực tiếp cho shop để nhận hỗ trợ nhanh nhất ạ!'} 
                              onChange={(e) => updateEventConfig('comment', { unknownFallbackReply: e.target.value })} 
                              placeholder="Dạ bạn {user} ơi, câu hỏi này em là trợ lý live nên xin phép ghi nhận lại để hỏi lại shop..."
                              className="w-full h-[65px] border border-amber-200 rounded-lg p-2 text-xs resize-none bg-amber-50/30 focus:bg-white focus:outline-amber-500 font-medium text-gray-800" 
                            />
                            <div className="flex items-center justify-between text-[10.5px] text-gray-500">
                              <span>Hỗ trợ biến: <code className="text-amber-700 font-bold">{'{user}'}</code>, <code className="text-amber-700 font-bold">{'{comment}'}</code></span>
                              <button 
                                type="button" 
                                onClick={() => updateEventConfig('comment', { 
                                  unknownFallbackReply: 'Dạ bạn {user} ơi, câu hỏi này em là trợ lý live nên xin phép ghi nhận lại để hỏi lại shop và phản hồi chi tiết cho mình sau nha! Bạn có thể nhắn tin (inbox) trực tiếp cho shop để nhận hỗ trợ nhanh nhất ạ!' 
                                })}
                                className="text-amber-700 hover:text-amber-900 font-bold underline cursor-pointer"
                              >
                                Khôi phục câu chuẩn khéo léo
                              </button>
                            </div>
                          </div>

                          {/* BƯỚC 4: THÊM CÂU HỎI GỢI MỞ CHĂM SÓC KHÁCH HÀNG & CẢM ƠN SAU KHI TRẢ LỜI */}
                          <div className="bg-white/90 p-3 rounded-xl border border-emerald-100 shadow-xs space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="text-xs font-black text-emerald-950 flex items-center gap-1.5 cursor-pointer" htmlFor="appendFollowUpQuestion-toggle">
                                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">4</span>
                                <span>CÂU HỎI GỢI MỞ CHĂM SÓC KHÁCH HÀNG & CẢM ƠN (INBOX SHOP)</span>
                              </label>
                              <div className="flex items-center gap-2">
                                <input 
                                  type="checkbox" 
                                  id="appendFollowUpQuestion-toggle" 
                                  name="appendFollowUpQuestion" 
                                  checked={currentConfig.appendFollowUpQuestion !== false} 
                                  onChange={(e) => updateEventConfig('comment', { appendFollowUpQuestion: e.target.checked })} 
                                  className="w-4 h-4 text-emerald-600 rounded cursor-pointer accent-emerald-600" 
                                />
                                <span className="text-[11px] font-bold text-emerald-700">{currentConfig.appendFollowUpQuestion !== false ? 'Đang Bật' : 'Tắt'}</span>
                              </div>
                            </div>

                            {currentConfig.appendFollowUpQuestion !== false && (
                              <div className="space-y-1.5 pt-1">
                                <div className="flex items-center justify-between text-[11px] text-gray-500">
                                  <span>Tự động ghép vào cuối sau khi trả lời xong câu hỏi:</span>
                                  <UniversalFileUploadButton 
                                    onLoaded={(text) => updateEventConfig('comment', { followUpQuestionText: text })} 
                                    label="Nạp File" 
                                  />
                                </div>
                                <input 
                                  type="text" 
                                  name="followUpQuestionText" 
                                  value={currentConfig.followUpQuestionText ?? ' Dạ không biết bạn {user} có cần em hỗ trợ thêm điều gì nữa không ạ? Bạn có thể nhắn tin trực tiếp cho shop để nhận tư vấn chi tiết và nhiều ưu đãi nha!'} 
                                  onChange={(e) => updateEventConfig('comment', { followUpQuestionText: e.target.value })} 
                                  placeholder=' Dạ không biết bạn {user} có cần em hỗ trợ thêm điều gì nữa không ạ?...'
                                  className="w-full border border-emerald-200 rounded-lg px-2.5 py-1.5 text-xs bg-emerald-50/30 focus:bg-white focus:outline-emerald-500 font-medium text-gray-800" 
                                />
                              </div>
                            )}
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
                          <FieldLabel icon="✅" text="Kích hoạt" helpKey="active" htmlFor={`active-${selectedEventId}`} />
                          <input type="checkbox" id={`active-${selectedEventId}`} name="active" checked={currentConfig.active} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded cursor-pointer accent-blue-600" />
                        </div>
                      )}

                      {currentConfig.useVoice !== undefined && selectedEventId !== 'talking' && selectedEventId !== 'idle' && (
                        <div className="flex items-center">
                          <FieldLabel icon="🗣️" text="Dùng giọng nói" helpKey="useVoice" htmlFor={`useVoice-${selectedEventId}`} />
                          <input type="checkbox" id={`useVoice-${selectedEventId}`} name="useVoice" checked={currentConfig.useVoice} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded cursor-pointer accent-blue-600" />
                        </div>
                      )}

                      {currentConfig.muteSourceVideo !== undefined && selectedEventId !== 'talking' && selectedEventId !== 'idle' && (
                        <div className="flex items-center">
                          <FieldLabel icon="🔇" text="Tắt âm gốc video" helpKey="muteSourceVideo" htmlFor={`muteSourceVideo-${selectedEventId}`} />
                          <input type="checkbox" id={`muteSourceVideo-${selectedEventId}`} name="muteSourceVideo" checked={currentConfig.muteSourceVideo} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded cursor-pointer accent-blue-600" />
                        </div>
                      )}

                      {currentConfig.useAi !== undefined && selectedEventId !== 'idle' && selectedEventId !== 'apology' && (
                        <div className="flex items-center">
                          <FieldLabel icon="🧠" text="Dùng AI trả lời" helpKey="useAi" htmlFor={`useAi-${selectedEventId}`} />
                          <input type="checkbox" id={`useAi-${selectedEventId}`} name="useAi" checked={currentConfig.useAi} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded cursor-pointer accent-blue-600" />
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
                          
                          {/* Từ khóa cấm */}
                          <div className="flex flex-col sm:flex-row sm:items-start gap-2 mt-1">
                            <div className="flex items-center justify-between sm:justify-start sm:min-w-[170px]">
                              <FieldLabel icon="🚫" text="Từ khóa cấm" helpKey="bannedWords" />
                              <div className="sm:hidden">
                                <UniversalFileUploadButton 
                                  onLoaded={(text) => handleSimpleChange('bannedWords', text)} 
                                  label="Nạp File" 
                                />
                              </div>
                            </div>
                            <div className="flex-1 flex flex-col gap-1">
                              <div className="hidden sm:flex justify-end">
                                <UniversalFileUploadButton 
                                  onLoaded={(text) => handleSimpleChange('bannedWords', text)} 
                                  label="Nạp File Từ Khóa Cấm (.docx, .pdf, .txt, .json, .xlsx)" 
                                />
                              </div>
                              <textarea 
                                name="bannedWords" 
                                value={currentConfig.bannedWords} 
                                onChange={handleChange} 
                                placeholder="Nhập hoặc nạp danh sách từ khóa cấm (mỗi dòng 1 từ hoặc cách nhau bởi dấu phẩy)..."
                                className="w-full h-[65px] border border-gray-300 rounded-lg p-2 text-xs resize-none bg-gray-50 focus:bg-white focus:outline-blue-500 font-medium" 
                              />
                            </div>
                          </div>

                          {/* Từ khóa ưu tiên */}
                          <div className="flex flex-col sm:flex-row sm:items-start gap-2 mt-1">
                            <div className="flex items-center justify-between sm:justify-start sm:min-w-[170px]">
                              <FieldLabel icon="⭐" text="Từ khóa ưu tiên" helpKey="priorityWords" />
                              <div className="sm:hidden">
                                <UniversalFileUploadButton 
                                  onLoaded={(text) => handleSimpleChange('priorityWords', text)} 
                                  label="Nạp File" 
                                />
                              </div>
                            </div>
                            <div className="flex-1 flex flex-col gap-1">
                              <div className="hidden sm:flex justify-end">
                                <UniversalFileUploadButton 
                                  onLoaded={(text) => handleSimpleChange('priorityWords', text)} 
                                  label="Nạp File Từ Khóa Ưu Tiên (.docx, .pdf, .txt, .json, .xlsx)" 
                                />
                              </div>
                              <textarea 
                                name="priorityWords" 
                                value={currentConfig.priorityWords} 
                                onChange={handleChange} 
                                placeholder="Nhập hoặc nạp danh sách từ khóa ưu tiên trả lời trước..."
                                className="w-full h-[65px] border border-gray-300 rounded-lg p-2 text-xs resize-none bg-gray-50 focus:bg-white focus:outline-blue-500 font-medium" 
                              />
                            </div>
                          </div>

                          <div className="flex items-center mt-1">
                            <FieldLabel icon="🛡️" text="Bật bộ lọc spam thông minh" helpKey="smartSpamFilter" htmlFor="smartSpamFilter-comment" />
                            <input type="checkbox" id="smartSpamFilter-comment" name="smartSpamFilter" checked={currentConfig.smartSpamFilter} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded cursor-pointer accent-blue-600" />
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

                      {/* TÍCH HỢP WORKSPACE KEYWORD PANEL CHO TAB BÌNH LUẬN */}
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
                        <div className="flex flex-col sm:flex-row sm:items-start gap-2 mt-2">
                          <div className="flex items-center justify-between sm:justify-start sm:min-w-[170px]">
                            <FieldLabel icon="✍️" text="Kịch bản cho AI" helpKey="aiPrompt" />
                            <div className="sm:hidden">
                              <UniversalFileUploadButton 
                                onLoaded={(text) => handleSimpleChange('aiPrompt', text)} 
                                label="Nạp File" 
                              />
                            </div>
                          </div>
                          <div className="flex-1 flex flex-col gap-1">
                            <div className="hidden sm:flex justify-end">
                              <UniversalFileUploadButton 
                                onLoaded={(text) => handleSimpleChange('aiPrompt', text)} 
                                label="Nạp File Kịch Bản / Prompt (.docx, .pdf, .txt, .json)" 
                              />
                            </div>
                            <textarea 
                              name="aiPrompt" 
                              value={currentConfig.aiPrompt} 
                              onChange={handleChange} 
                              placeholder="Nhập hoặc nạp file kịch bản chỉ đạo AI phản hồi..."
                              className="w-full min-h-[110px] border border-gray-300 rounded-lg p-2.5 text-xs resize-y bg-gray-50 focus:bg-white focus:outline-blue-500 font-medium leading-relaxed" 
                            />
                          </div>
                        </div>
                      )}

                      {currentConfig.sampleAnswers !== undefined && selectedEventId !== 'idle' && (
                        <div className="flex flex-col gap-2 mt-2">
                          <div className="flex flex-col sm:flex-row sm:items-start gap-2">
                            <div className="flex items-center justify-between sm:justify-start sm:min-w-[170px]">
                              <FieldLabel icon="📄" text="Câu trả lời mẫu (mỗi câu 1 dòng)" helpKey="sampleAnswers" />
                              <div className="sm:hidden">
                              <UniversalFileUploadButton 
                                onLoaded={(text) => handleSimpleChange('sampleAnswers', text)} 
                                label="Nạp File" 
                              />
                            </div>
                          </div>
                          <div className="flex-1 flex flex-col gap-1">
                            <div className="hidden sm:flex justify-end">
                              <UniversalFileUploadButton 
                                onLoaded={(text) => handleSimpleChange('sampleAnswers', text)} 
                                label="Nạp File Câu Thoại Mẫu (.docx, .pdf, .txt, .json, .xlsx)" 
                              />
                            </div>
                            <textarea 
                              name="sampleAnswers" 
                              value={currentConfig.sampleAnswers} 
                              onChange={handleChange} 
                              placeholder="Nhập hoặc nạp file các câu trả lời mẫu (mỗi dòng 1 câu)..."
                              className="w-full min-h-[90px] border border-gray-300 rounded-lg p-2.5 text-xs resize-y bg-gray-50 focus:bg-white focus:outline-blue-500 font-medium leading-relaxed" 
                            />
                          </div>
                        </div>
                        <div className="ml-0 sm:ml-[170px]">
                          <EventVoiceTester 
                            text={currentConfig.sampleAnswers || 'Xin chào và cảm ơn bạn đã tương tác cùng phiên livestream nhé!'}
                            defaultVoiceId="free_vi_female"
                            label={`Nghe thử câu thoại mẫu (${selectedEventInfo?.label || 'Sự kiện'})`}
                            compact={false}
                          />
                        </div>
                      </div>
                    )}
                    
                    {selectedEventId === 'talking' && (
                      <>
                        <div className="flex items-center mt-2">
                          <FieldLabel icon="🗣️" text="Dùng giọng nói" helpKey="useVoice" htmlFor="useVoice-talking" />
                          <input type="checkbox" id="useVoice-talking" name="useVoice" checked={currentConfig.useVoice} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded cursor-pointer accent-blue-600" />
                        </div>
                        <div className="flex items-center">
                          <FieldLabel icon="🔇" text="Tắt âm gốc video" helpKey="muteSourceVideo" htmlFor="muteSourceVideo-talking" />
                          <input type="checkbox" id="muteSourceVideo-talking" name="muteSourceVideo" checked={currentConfig.muteSourceVideo} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded cursor-pointer accent-blue-600" />
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
                    <span>🎬 Cấu hình Video Chính, Video Nền & Video Bổ Trợ Phiên Live</span>
                    <HelpTooltip helpKey="videoFolder" />
                  </legend>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <span className="text-[13px] text-[#a53b3b] font-semibold min-w-[200px]">Danh mục video cho sự kiện này:</span>
                      <select 
                        name="videoCategory" 
                        value={currentConfig.videoCategory || selectedEventId} 
                        onChange={handleChange} 
                        className="flex-1 border border-gray-300 rounded px-2.5 py-1.5 text-xs bg-white font-bold text-blue-900 focus:outline-blue-500 cursor-pointer shadow-2xs"
                      >
                        <option value="comment">💬 comment - Trả Lời Bình Luận Khách Hàng</option>
                        <option value="talking">🗣️ talking - Nhân Vật Nói Chuyện / Dẫn Live</option>
                        <option value="idle">⏱️ idle - Đứng Chờ / Nghỉ Giữa Hiệp (Loop)</option>
                        <option value="follow">➕ follow - Cảm Ơn Người Theo Dõi Kênh</option>
                        <option value="gift">🎁 gift - Cảm Ơn Quà Tặng (Thường)</option>
                        <option value="special_gift">🌟 special_gift - Cảm Ơn Quà Tặng Đặc Biệt</option>
                        <option value="share">🔄 share - Cảm Ơn Chia Sẻ Phiên Live</option>
                        <option value="thanks_heart">❤️ thanks_heart - Cảm Ơn Thả Tim Nhiều</option>
                        <option value="welcome">👋 welcome - Chào Người Mới Vào Phòng</option>
                        <option value="apology">🙏 apology - Xin Lỗi & Phản Hồi Khi Lỗi</option>
                        <option value="call_to_action">📢 call_to_action - Kêu Gọi Tương Tác Giờ Vàng</option>
                        <option value="custom_action">🎬 custom_action - Động Tác / Sự Kiện Tùy Chỉnh</option>
                      </select>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-3">
                      <UniversalMediaPicker 
                        label="Thư mục Video Hành Động / File Clip Sự Kiện"
                        currentPath={currentConfig.videoFolder || ''}
                        videoUrl={currentConfig.videoFile || ''}
                        defaultText="Chưa chọn thư mục (Dùng video mặc định theo danh mục)"
                        onSelectFile={(file, objectUrl) => {
                          handleChange({ target: { name: 'videoFolder', value: file.name } });
                          handleChange({ target: { name: 'videoFile', value: objectUrl } });
                          toast.success(`Đã chọn clip hành động: ${file.name}`);
                        }}
                        onSelectFolder={(folderPath) => {
                          handleChange({ target: { name: 'videoFolder', value: folderPath } });
                          handleChange({ target: { name: 'videoFile', value: '' } });
                          toast.success(`Đã chọn thư mục: ${folderPath}`);
                        }}
                        onSelectSample={(sample) => {
                          handleChange({ target: { name: 'videoFolder', value: sample.name } });
                          handleChange({ target: { name: 'videoFile', value: sample.url } });
                          toast.success(`Đã nạp video mẫu: ${sample.name}`);
                        }}
                        onClear={() => {
                          handleChange({ target: { name: 'videoFolder', value: '' } });
                          handleChange({ target: { name: 'videoFile', value: null } });
                          toast.success('Đã đặt lại video hành động');
                        }}
                        inputId={`upload-action-video-${selectedEventId}`}
                      />
                    </div>

                    <div className="border-t border-gray-200 pt-3">
                      <UniversalMediaPicker 
                        label="Thư mục Video Nền Hỗ Trợ / File Nền Studio"
                        currentPath={currentConfig.supportVideoFolder || ''}
                        videoUrl={currentConfig.supportVideoFile || ''}
                        defaultText="Chưa chọn (Dùng video nền mặc định)"
                        onSelectFile={(file, objectUrl) => {
                          handleChange({ target: { name: 'supportVideoFolder', value: file.name } });
                          handleChange({ target: { name: 'supportVideoFile', value: objectUrl } });
                          toast.success(`Đã chọn clip nền: ${file.name}`);
                        }}
                        onSelectFolder={(folderPath) => {
                          handleChange({ target: { name: 'supportVideoFolder', value: folderPath } });
                          handleChange({ target: { name: 'supportVideoFile', value: '' } });
                          toast.success(`Đã chọn thư mục nền: ${folderPath}`);
                        }}
                        onSelectSample={(sample) => {
                          handleChange({ target: { name: 'supportVideoFolder', value: sample.name } });
                          handleChange({ target: { name: 'supportVideoFile', value: sample.url } });
                          toast.success(`Đã nạp video nền mẫu: ${sample.name}`);
                        }}
                        onClear={() => {
                          handleChange({ target: { name: 'supportVideoFolder', value: '' } });
                          handleChange({ target: { name: 'supportVideoFile', value: null } });
                          toast.success('Đã đặt lại video nền');
                        }}
                        inputId={`upload-support-video-${selectedEventId}`}
                      />
                    </div>

                    {/* Danh mục video mở rộng / Video bổ trợ */}
                    {currentConfig.extraVideoSlots && currentConfig.extraVideoSlots.map((eSlot, idx) => (
                      <div key={eSlot.id || idx} className="border-t border-gray-200 pt-3 bg-purple-50/30 p-2.5 rounded-xl">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-bold text-purple-900">🎬 Video Bổ Trợ #{idx + 1}: {eSlot.name || 'Clip Chen Ngang'}</span>
                          <button 
                            type="button"
                            onClick={() => handleRemoveExtraVideoSlot(idx)}
                            className="text-xs text-red-500 hover:text-red-700 font-semibold cursor-pointer"
                          >
                            Xóa
                          </button>
                        </div>
                        <UniversalMediaPicker 
                          label={`Video Bổ Trợ / Clip Chen Ngang #${idx + 1}`}
                          currentPath={eSlot.folder || ''}
                          videoUrl={eSlot.url || ''}
                          defaultText="Chưa chọn video bổ trợ"
                          onSelectFile={(file, objectUrl) => handleUpdateExtraVideoSlot(idx, { folder: file.name, url: objectUrl })}
                          onSelectFolder={(folderName) => handleUpdateExtraVideoSlot(idx, { folder: folderName, url: '' })}
                          onSelectSample={(sample) => handleUpdateExtraVideoSlot(idx, { folder: sample.name, url: sample.url })}
                          onClear={() => handleUpdateExtraVideoSlot(idx, { folder: '', url: '' })}
                          inputId={`upload-extra-video-${idx}`}
                        />
                      </div>
                    ))}

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleAddExtraVideoSlot}
                        className="px-3.5 py-2 bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 text-purple-800 border border-dashed border-purple-300 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 shadow-2xs"
                      >
                        <Plus size={14} className="text-purple-600" /> ➕ Mở Rộng Thêm Ô Video Bổ Trợ / Clip Chen Ngang Cho Sự Kiện Này
                      </button>
                    </div>
                  </div>
                </fieldset>
              </div>

              {currentConfig.assistantPrompt !== undefined && (
                <div className="border border-gray-300 rounded-md bg-white shadow-sm px-3 py-4 mb-4">
                  <fieldset className="border border-gray-300 rounded p-4 pt-4 mt-2 relative">
                    <legend className="absolute -top-3 left-3 bg-white px-1 text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        id={`useAssistant-${selectedEventId}`}
                        name="useAssistant" 
                        checked={currentConfig.useAssistant !== false} 
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600 rounded cursor-pointer accent-blue-600" 
                      />
                      <label htmlFor={`useAssistant-${selectedEventId}`} className="cursor-pointer select-none">Cài đặt Trợ lý</label>
                      <HelpTooltip helpKey="useAssistant" />
                    </legend>
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div className="flex items-center gap-1">
                          <label className="text-[13px] text-gray-700 font-semibold">Câu mẫu của Trợ lý:</label>
                          <HelpTooltip helpKey="assistantPrompt" />
                        </div>
                        <UniversalFileUploadButton 
                          onLoaded={(text) => handleChange({ target: { name: 'assistantPrompt', value: text } })}
                          label="Nạp File Câu Mẫu (.docx, .pdf, .txt, .json, .xlsx)"
                        />
                      </div>
                      <textarea 
                        name="assistantPrompt" value={currentConfig.assistantPrompt} onChange={handleChange}
                        className="w-full h-[80px] border border-gray-300 rounded p-2 text-[13px] resize-none bg-gray-50 focus:bg-white focus:outline-blue-500" 
                      />
                      <EventVoiceTester 
                        text={currentConfig.assistantPrompt || 'Dạ vâng, cảm ơn mọi người đã theo dõi live nha!'}
                        defaultVoiceId="free_vi_female"
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

        {/* Modal Cấu Hình Studio 2-4 Avatar (Đa Nhân Vật) */}
        <MultiAvatarStudioModal 
          isOpen={showMultiAvatarModal} 
          onClose={() => setShowMultiAvatarModal(false)} 
        />

      </div>
    </div>
  );
}
