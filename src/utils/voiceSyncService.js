/**
 * AVA LIVE - Unified ElevenLabs & Multi-Language Voice Architecture
 * Chuẩn hóa hệ thống âm thanh & Giọng đọc cho toàn bộ ứng dụng:
 * 1. VOICE IDOL: Giọng nhân vật Idol Livestream chính (Kịch bản chính, lip-sync, trả lời comment)
 * 2. VOICE QUẢN LÝ / TRỢ LÝ: Giọng Quản lý / Thiết bị / Trợ lý hậu trường (Bán hàng, giục chốt đơn, thông báo hệ thống)
 * 3. VOICE BÌNH LUẬN VIÊN GAME: Giọng BLV trận đấu & tương tác game livestream (Kịch tính, năng lượng, hò reo)
 * Hỗ trợ trọn vẹn 20 ngôn ngữ phổ biến trên thế giới với đầy đủ Giọng Nam & Giọng Nữ (Miễn phí & Pro)
 */

import { globalLipSyncEngine } from '../lib/avatar-sync/AvatarLipSyncEngine';

export const ELEVENLABS_VOICES = [
  // ==================== 1. 20 GIỌNG NỮ PRO (ElevenLabs & MiniMax AI) ====================
  { id: 'el_rachel', name: 'Rachel 💎 (Nữ - Idol Ngọt Ngào, Tự Nhiên)', provider: 'elevenlabs', voiceId: '21m00Tcm4TlvDq8ikWAM', gender: 'Female', lang: 'vi-VN', category: 'Idol Live & Giao Lưu', pitch: 1.15, rate: 1.0, recommendedFor: 'idol', desc: 'Giọng nữ trẻ trung, ấm áp, cực kỳ hợp cho Idol Livestream chính.' },
  { id: 'el_bella', name: 'Bella 💎 (Nữ - Dịu Dàng, Truyền Cảm)', provider: 'elevenlabs', voiceId: 'EXAVITQu4vr4xnSDxMaL', gender: 'Female', lang: 'vi-VN', category: 'Tâm Sự & Kể Chuyện', pitch: 1.08, rate: 0.96, recommendedFor: 'idol', desc: 'Giọng nữ êm dịu, nhẹ nhàng, lắng đọng, phù hợp kể chuyện và tâm sự.' },
  { id: 'el_domi', name: 'Domi 💎 (Nữ - Năng Động, Hoạt Náo Gen Z)', provider: 'elevenlabs', voiceId: 'AZnzlk1XvdvUeBnXmlld', gender: 'Female', lang: 'vi-VN', category: 'Sự Kiện & Minigame', pitch: 1.22, rate: 1.08, recommendedFor: 'both', desc: 'Giọng nữ hoạt náo, tươi vui, kích thích tương tác và minigame.' },
  { id: 'el_elli', name: 'Elli 💎 (Nữ - Cảm Xúc Sâu Lắng, Đọc Thơ)', provider: 'elevenlabs', voiceId: 'MF3mGyEYCl7XYWbV9V6O', gender: 'Female', lang: 'vi-VN', category: 'Kể Chuyện & Đọc Thơ', pitch: 1.04, rate: 0.94, recommendedFor: 'idol', desc: 'Giọng nữ giàu cảm xúc nghệ thuật, đọc sách, podcast và tâm tình.' },
  { id: 'el_emily', name: 'Emily 💎 (Nữ - MC Truyền Hình VTV Sang Trọng)', provider: 'elevenlabs', voiceId: 'LcfcDJNigL5wcJAoLJq7', gender: 'Female', lang: 'vi-VN', category: 'MC Truyền Hình & Sự Kiện', pitch: 1.10, rate: 1.02, recommendedFor: 'both', desc: 'Giọng nữ chuẩn mực, đĩnh đạc, âm sắc chuẩn phát thanh viên truyền hình.' },
  { id: 'el_charlotte', name: 'Charlotte 💎 (Nữ - Biên Tập Viên Thời Sự)', provider: 'elevenlabs', voiceId: 'XB0fDUnXU5ikFXcvcxZs', gender: 'Female', lang: 'vi-VN', category: 'Biên Tập Viên & Phóng Sự', pitch: 1.06, rate: 1.04, recommendedFor: 'both', desc: 'Giọng nữ nghiêm túc, rõ ràng, dứt khoát chuẩn bản tin thời sự.' },
  { id: 'el_serena', name: 'Serena 💎 (Nữ - Bán Hàng Chốt Sale Đỉnh Cao)', provider: 'elevenlabs', voiceId: 'pMsXgVXv3BLzUgSXRplE', gender: 'Female', lang: 'vi-VN', category: 'Bán Hàng & Chốt Đơn', pitch: 1.18, rate: 1.10, recommendedFor: 'manager', desc: 'Giọng nữ chốt đơn bán hàng tốc độ, kích thích người mua bấm vào giỏ hàng.' },
  { id: 'el_nicole', name: 'Nicole 💎 (Nữ - Quảng Cáo TVC & Giục Flash Sale)', provider: 'elevenlabs', voiceId: 'piTKgcLEGmPE4e6mEKli', gender: 'Female', lang: 'vi-VN', category: 'Quảng Cáo & Giục Đơn', pitch: 1.20, rate: 1.12, recommendedFor: 'manager', desc: 'Giọng nữ hào hứng, dồn dập, đẩy mạnh doanh số những phút cuối sale.' },
  { id: 'el_freya', name: 'Freya 💎 (Nữ - Quý Bà Trung Niên Đĩnh Đạc)', provider: 'elevenlabs', voiceId: 'jsCqWAovK2LkecY7zXl4', gender: 'Female', lang: 'vi-VN', category: 'Trung Niên & Doanh Nhân', pitch: 0.98, rate: 0.96, recommendedFor: 'manager', desc: 'Giọng nữ trung niên uy tín, sang trọng của nữ giám đốc/doanh nhân.' },
  { id: 'el_gigi', name: 'Gigi 💎 (Nữ - Anime / VTuber Nhí Nhảnh)', provider: 'elevenlabs', voiceId: 'jBpfuIE2acCO8z3wKNLl', gender: 'Female', lang: 'vi-VN', category: 'Anime & VTuber', pitch: 1.35, rate: 1.08, recommendedFor: 'idol', desc: 'Giọng nữ anime nhí nhảnh, đáng yêu chuẩn phong cách idol ảo Nhật Bản.' },
  { id: 'el_glinda', name: 'Glinda 💎 (Nữ - Nữ Hoàng Quyền Lực BLV)', provider: 'elevenlabs', voiceId: 'z9fAnlkOXvlPwwBMtIwu', gender: 'Female', lang: 'vi-VN', category: 'BLV & Chiến Trận', pitch: 1.05, rate: 1.06, recommendedFor: 'game', desc: 'Giọng nữ tướng quân đanh thép, thông báo sự kiện và chiến thắng game.' },
  { id: 'el_grace', name: 'Grace 💎 (Nữ - Đọc Sách, Chữa Lành Tâm Hồn)', provider: 'elevenlabs', voiceId: 'oWAxZDx7w5VEj9dCyTzz', gender: 'Female', lang: 'vi-VN', category: 'Đọc Sách & Chữa Lành', pitch: 1.06, rate: 0.92, recommendedFor: 'idol', desc: 'Giọng nữ êm ái như dòng suối, mang lại cảm giác bình yên, thư thái.' },
  { id: 'el_alice', name: 'Alice 💎 (Nữ - Trợ Lý Thông Minh & Tận Tâm)', provider: 'elevenlabs', voiceId: 'Xb7hH8MSUJpSbSDYk0k2', gender: 'Female', lang: 'vi-VN', category: 'Trợ Lý & CSKH', pitch: 1.12, rate: 1.0, recommendedFor: 'manager', desc: 'Giọng nữ trợ lý AI lịch sự, ân cần giải đáp mọi thắc mắc của khán giả.' },
  { id: 'el_lily', name: 'Lily 💎 (Nữ - Thân Thiện Gần Gũi KOC)', provider: 'elevenlabs', voiceId: 'pFZP5JQG7iQjIQuC4Bku', gender: 'Female', lang: 'vi-VN', category: 'KOC & Reviewer', pitch: 1.16, rate: 1.02, recommendedFor: 'idol', desc: 'Giọng nữ trẻ review sản phẩm chân thật, tạo độ tin cậy tuyệt đối.' },
  { id: 'el_jessica', name: 'Jessica 💎 (Nữ - BLV Năng Lượng Đỉnh Nóc)', provider: 'elevenlabs', voiceId: 'cgSgspJ2msm6clMCkdW9', gender: 'Female', lang: 'vi-VN', category: 'BLV Game & Thể Thao', pitch: 1.25, rate: 1.12, recommendedFor: 'game', desc: 'Giọng nữ bình luận viên thể thao/game sôi động, bốc lửa từng pha combat.' },
  { id: 'el_matilda', name: 'Matilda 💎 (Nữ - Chuyên Gia Y Tế & Sức Khỏe)', provider: 'elevenlabs', voiceId: 'XrExE9yKIg1WjnnlVkGX', gender: 'Female', lang: 'vi-VN', category: 'Chuyên Gia & Y Tế', pitch: 1.02, rate: 0.98, recommendedFor: 'manager', desc: 'Giọng nữ dày dặn kinh nghiệm, tư vấn chuyên môn sâu sắc và tin cậy.' },
  { id: 'el_hannah', name: 'Hannah 💎 (Nữ - Tâm Sự Đêm Khuya Sâu Lắng)', provider: 'elevenlabs', voiceId: 'ThT5KcBeYPX3keUQqHPh', gender: 'Female', lang: 'vi-VN', category: 'Tâm Sự & Kể Chuyện', pitch: 1.04, rate: 0.93, recommendedFor: 'idol', desc: 'Giọng nữ ấm áp thì thầm, thích hợp livestream acoustic và đêm muộn.' },
  { id: 'mm_thuha', name: 'Thu Hà ⚡ (Nữ - MiniMax Bán Hàng Tiktok Top 1)', provider: 'minimax', voiceId: 'speech-01-turbo-thuha', gender: 'Female', lang: 'vi-VN', category: 'MiniMax Chốt Đơn Siêu Tốc', pitch: 1.16, rate: 1.08, recommendedFor: 'manager', desc: 'Giọng MiniMax AI chuyên biệt chốt đơn livestream TikTok Shop không góc chết.' },
  { id: 'mm_lananh', name: 'Lan Anh ⚡ (Nữ - MiniMax MC Thời Sự VTV)', provider: 'minimax', voiceId: 'speech-01-turbo-lananh', gender: 'Female', lang: 'vi-VN', category: 'MiniMax MC & Thời Sự', pitch: 1.08, rate: 1.02, recommendedFor: 'both', desc: 'Giọng MiniMax AI chuẩn biên tập viên truyền hình quốc gia, tròn vành rõ chữ.' },
  { id: 'mm_anhduong', name: 'Ánh Dương ⚡ (Nữ - MiniMax Kể Chuyện Cảm Xúc)', provider: 'minimax', voiceId: 'speech-01-turbo-anhduong', gender: 'Female', lang: 'vi-VN', category: 'MiniMax Kể Chuyện Cổ Tích', pitch: 1.12, rate: 0.95, recommendedFor: 'idol', desc: 'Giọng MiniMax AI truyền cảm vô tận, đưa người nghe vào câu chuyện lôi cuốn.' },

  // ==================== 2. 20 GIỌNG NAM PRO (ElevenLabs & MiniMax AI) ====================
  { id: 'el_josh', name: 'Josh 💎 (Nam - BLV Game Siêu Tốc, Bùng Nổ)', provider: 'elevenlabs', voiceId: 'TxGEqnHWrfWFTfGW9XjX', gender: 'Male', lang: 'vi-VN', category: 'BLV Game Sôi Động', pitch: 0.95, rate: 1.12, recommendedFor: 'game', desc: 'Giọng BLV game bùng nổ, tốc độ cực nhanh khi combat nghẹt thở.' },
  { id: 'el_clyde', name: 'Clyde 💎 (Nam - Chiến Binh Hùng Tráng, Hào Sảng)', provider: 'elevenlabs', voiceId: '2EiwWnXFnvU5JabPnv8n', gender: 'Male', lang: 'vi-VN', category: 'Chiến Trận & Hào Hùng', pitch: 0.72, rate: 1.0, recommendedFor: 'game', desc: 'Giọng nam tướng quân uy nghi, hào sảng, vang dội như tiếng sấm.' },
  { id: 'el_adam', name: 'Adam 💎 (Nam - Giọng Quốc Dân, Điềm Tĩnh Bán Hàng)', provider: 'elevenlabs', voiceId: 'pNInz6obpgDQGcFmaJgB', gender: 'Male', lang: 'vi-VN', category: 'Thương Mại & Bán Hàng', pitch: 0.88, rate: 1.0, recommendedFor: 'both', desc: 'Giọng nam biểu tượng của ElevenLabs, ấm áp, điềm đạm, cực kỳ thuyết phục.' },
  { id: 'el_callum', name: 'Callum 💎 (Nam - Quản Lý Giục Chốt Đơn Uy Lực)', provider: 'elevenlabs', voiceId: 'N2lVS1w4EtoT3dr4eOWO', gender: 'Male', lang: 'vi-VN', category: 'Giục Đơn & Cảnh Báo', pitch: 0.85, rate: 1.08, recommendedFor: 'manager', desc: 'Giọng quản lý bán hàng uy quyền, thúc giục khán giả đặt hàng ngay.' },
  { id: 'el_antoni', name: 'Antoni 💎 (Nam - MC Hoạt Náo Sự Kiện Rộn Ràng)', provider: 'elevenlabs', voiceId: 'ErXwobaYiN019PkySvjV', gender: 'Male', lang: 'vi-VN', category: 'MC Sự Kiện & Hội Trường', pitch: 0.92, rate: 1.05, recommendedFor: 'both', desc: 'Giọng MC dẫn chương trình cuốn hút, hoạt náo, kích thích tặng quà.' },
  { id: 'el_charlie', name: 'Charlie 💎 (Nam - Giọng Trầm Ấm Kể Chuyện Đêm Khuya)', provider: 'elevenlabs', voiceId: 'IKne3meq5aSn9XLyUdCD', gender: 'Male', lang: 'vi-VN', category: 'Kể Chuyện & Tâm Sự', pitch: 0.80, rate: 0.92, recommendedFor: 'idol', desc: 'Giọng nam trầm ấm, truyền cảm, thích hợp đọc sách, podcast tâm sự.' },
  { id: 'el_george', name: 'George 💎 (Nam - Phóng Sự VTV Đĩnh Đạc)', provider: 'elevenlabs', voiceId: 'JBFqnCBsd6RMkjVDRZzb', gender: 'Male', lang: 'vi-VN', category: 'Phóng Sự & Truyền Hình', pitch: 0.84, rate: 1.0, recommendedFor: 'both', desc: 'Giọng nam chuẩn phóng sự tài liệu, chín chắn và đáng tin cậy.' },
  { id: 'el_thomas', name: 'Thomas 💎 (Nam - Bản Tin & Thời Sự Quốc Tế)', provider: 'elevenlabs', voiceId: 'GBv7mTt0atIp3Br8iCZE', gender: 'Male', lang: 'vi-VN', category: 'Bản Tin & Thời Sự', pitch: 0.86, rate: 1.02, recommendedFor: 'both', desc: 'Giọng đọc bản tin nhịp nhàng, thông tin rõ ràng, chuẩn phong cách quốc tế.' },
  { id: 'el_brian', name: 'Brian 💎 (Nam - BLV Thể Thao Đỉnh Cao)', provider: 'elevenlabs', voiceId: 'nPczCjzI2devNBz1zQrb', gender: 'Male', lang: 'vi-VN', category: 'BLV Thể Thao', pitch: 0.90, rate: 1.10, recommendedFor: 'game', desc: 'Giọng bình luận viên bóng đá/eSports hừng hực lửa, truyền lửa người xem.' },
  { id: 'el_daniel', name: 'Daniel 💎 (Nam - Doanh Nhân Trung Niên Uy Quyền)', provider: 'elevenlabs', voiceId: 'onwK4e9ZLuTAKqWW03F9', gender: 'Male', lang: 'vi-VN', category: 'Trung Niên & Giám Đốc', pitch: 0.78, rate: 0.98, recommendedFor: 'manager', desc: 'Giọng giám đốc điều hành, doanh nhân thành đạt, đĩnh đạc và quyết đoán.' },
  { id: 'el_liam', name: 'Liam 💎 (Nam - Streamer Gen Z Năng Động)', provider: 'elevenlabs', voiceId: 'TX3LPaxmHKxFdv7VOQHJ', gender: 'Male', lang: 'vi-VN', category: 'Streamer & Gen Z', pitch: 0.98, rate: 1.06, recommendedFor: 'idol', desc: 'Giọng nam trẻ phong cách streamer TikTok, dí dỏm và gần gũi.' },
  { id: 'el_marcus', name: 'Marcus 💎 (Nam - Bậc Thầy Trí Tuệ Cao Tuổi)', provider: 'elevenlabs', voiceId: 'bIHbv24MWmeRgasZH58o', gender: 'Male', lang: 'vi-VN', category: 'Cao Tuổi & Tri Thức', pitch: 0.74, rate: 0.90, recommendedFor: 'both', desc: 'Giọng nam cao tuổi thông thái, trải đời, đưa ra những lời khuyên sâu sắc.' },
  { id: 'el_bill', name: 'Bill 💎 (Nam - Thuyết Minh Phim Điện Ảnh)', provider: 'elevenlabs', voiceId: 'pqHfZKP75CvOlQylNhV4', gender: 'Male', lang: 'vi-VN', category: 'Thuyết Minh Điện Ảnh', pitch: 0.82, rate: 0.95, recommendedFor: 'idol', desc: 'Giọng thuyết minh phim bom tấn, điện ảnh Hollywood đầy kịch tính.' },
  { id: 'el_harry', name: 'Harry 💎 (Nam - Kịch Tính Hồi Hộp Bất Ngờ)', provider: 'elevenlabs', voiceId: 'SOYHLrjzK2X1ezoPC6cr', gender: 'Male', lang: 'vi-VN', category: 'Game Kịch Tính', pitch: 0.87, rate: 1.05, recommendedFor: 'game', desc: 'Giọng tạo không khí hồi hộp, nghẹt thở cho các khoảnh khắc gay cấn.' },
  { id: 'el_arthur_gentle', name: 'Arthur 💎 (Nam - Quý Ông Lịch Lãm Đẳng Cấp)', provider: 'elevenlabs', voiceId: 'wViXBPUzp2ZZixvn1xQG', gender: 'Male', lang: 'vi-VN', category: 'Sang Trọng & Thương Hiệu', pitch: 0.83, rate: 0.97, recommendedFor: 'idol', desc: 'Giọng nam quý phái, thanh lịch, phù hợp các sản phẩm cao cấp xa xỉ.' },
  { id: 'el_ryan', name: 'Ryan 💎 (Nam - Chuyên Viên Tư Vấn Tận Tụy)', provider: 'elevenlabs', voiceId: 'wViXBPUzp2ZZixvn1xQG_2', gender: 'Male', lang: 'vi-VN', category: 'Tư Vấn Khách Hàng', pitch: 0.89, rate: 1.0, recommendedFor: 'manager', desc: 'Giọng nam tư vấn nhẹ nhàng, nhiệt tình hỗ trợ giải đáp mọi thắc mắc.' },
  { id: 'el_paul', name: 'Paul 💎 (Nam - Thầy Giáo Giảng Bài Khoa Học)', provider: 'elevenlabs', voiceId: '5Q0t7uMcjvnagumLfvZi', gender: 'Male', lang: 'vi-VN', category: 'Giảng Dạy & Tri Thức', pitch: 0.86, rate: 0.98, recommendedFor: 'both', desc: 'Giọng giảng viên rõ ràng, mạch lạc, dễ tiếp thu kiến thức.' },
  { id: 'mm_quocbao', name: 'Quốc Bảo ⚡ (Nam - MiniMax Bán Hàng Flash Sale)', provider: 'minimax', voiceId: 'speech-01-turbo-quocbao', gender: 'Male', lang: 'vi-VN', category: 'MiniMax Bán Hàng & Chốt Đơn', pitch: 0.90, rate: 1.08, recommendedFor: 'manager', desc: 'Giọng MiniMax AI nam bán hàng chốt sale thần tốc, tạo hiệu ứng đám đông.' },
  { id: 'mm_hainam', name: 'Hải Nam ⚡ (Nam - MiniMax BLV Game PK)', provider: 'minimax', voiceId: 'speech-01-turbo-hainam', gender: 'Male', lang: 'vi-VN', category: 'MiniMax BLV Game & Trận Đấu', pitch: 0.94, rate: 1.10, recommendedFor: 'game', desc: 'Giọng MiniMax AI bình luận trận đấu cuồng nhiệt, hò hét kích thích tặng quà.' },
  { id: 'mm_minhtuan', name: 'Minh Tuấn ⚡ (Nam - MiniMax MC Thời Sự VTV)', provider: 'minimax', voiceId: 'speech-01-turbo-minhtuan', gender: 'Male', lang: 'vi-VN', category: 'MiniMax MC & Thời Sự', pitch: 0.85, rate: 1.02, recommendedFor: 'both', desc: 'Giọng MiniMax AI nam MC thời sự VTV hào sảng, tròn vành, đẳng cấp quốc gia.' },

  // ==================== 3. GIỌNG QUỐC TẾ PRO ====================
  { id: 'el_us_female', name: 'Sarah 🇺🇸 (Nữ - US English Native)', provider: 'elevenlabs', voiceId: 'EXAVITQu4vr4xnSDxMaL', gender: 'Female', lang: 'en-US', category: 'Quốc Tế Song Ngữ', pitch: 1.10, rate: 1.0, recommendedFor: 'idol', desc: 'Giọng nữ bản xứ Mỹ truyền cảm chuẩn quốc tế.' },
  { id: 'el_uk_male', name: 'Arthur 🇬🇧 (Nam - UK British Gentleman)', provider: 'elevenlabs', voiceId: 'JBFqnCBsd6RMkjVDRZzb', gender: 'Male', lang: 'en-GB', category: 'Quốc Tế Song Ngữ', pitch: 0.85, rate: 1.0, recommendedFor: 'game', desc: 'Giọng nam quý ông Anh Quốc lịch lãm.' },
  { id: 'el_cn_female', name: 'Mei-Ling 🇨🇳 (Nữ - 中文普通话)', provider: 'elevenlabs', voiceId: 'piTKgcLEGmPE4e6mEKli', gender: 'Female', lang: 'zh-CN', category: 'Quốc Tế Song Ngữ', pitch: 1.12, rate: 1.0, recommendedFor: 'idol', desc: 'Giọng nữ livestream bán hàng thương mại điện tử Trung Quốc.' },
  { id: 'el_jp_female', name: 'Sakura 🇯🇵 (Nữ - 日本語 Anime Kawaii)', provider: 'elevenlabs', voiceId: 'jBpfuIE2acCO8z3wKNLl', gender: 'Female', lang: 'ja-JP', category: 'Quốc Tế Song Ngữ', pitch: 1.30, rate: 1.05, recommendedFor: 'idol', desc: 'Giọng nữ Nhật Bản ngọt ngào chuẩn Anime VTuber.' },
  { id: 'el_kr_female', name: 'Min-ji 🇰🇷 (Nữ - 한국어 K-Pop Idol)', provider: 'elevenlabs', voiceId: '21m00Tcm4TlvDq8ikWAM', gender: 'Female', lang: 'ko-KR', category: 'Quốc Tế Song Ngữ', pitch: 1.18, rate: 1.0, recommendedFor: 'idol', desc: 'Giọng nữ idol K-Pop thanh thoát, trẻ trung.' },
  { id: 'el_th_female', name: 'Premwadee 🇹🇭 (Nữ - ภาษาไทย)', provider: 'elevenlabs', voiceId: 'XrExE9yKIg1WjnnlVkGX', gender: 'Female', lang: 'th-TH', category: 'Quốc Tế Song Ngữ', pitch: 1.15, rate: 1.0, recommendedFor: 'idol', desc: 'Giọng nữ Thái Lan dịu dàng, trong trẻo.' }
].map(v => ({ ...v, tier: 'pro', icon: v.provider === 'minimax' ? '⚡' : '💎', badge: v.provider === 'minimax' ? '⚡ MiniMax Pro' : '💎 ElevenLabs Pro' }));

// ==================== 4. GIỌNG ĐỌC MIỄN PHÍ VIỆT NAM (DUY NHẤT HOÀI MY) ====================
export const FREE_VOICES = [
  // Duy nhất Hoài My ở vị trí đầu tiên chuẩn theo yêu cầu
  { id: 'free_vi_female', name: 'Hoài My 🇻🇳 (Nữ - Chuẩn Tiếng Việt)', provider: 'system', tier: 'free', icon: '🎤', badge: '🇻🇳 Miễn Phí', gender: 'Female', lang: 'vi-VN', category: 'Chuẩn Tiếng Việt', pitch: 1.08, rate: 1.0, recommendedFor: 'idol', desc: 'Giọng nữ chuẩn tiếng Việt truyền cảm, phát âm mượt mà, cảm xúc tự nhiên, miễn phí 100%.' }
];

export const ALL_SYSTEM_VOICES = [...FREE_VOICES, ...ELEVENLABS_VOICES];
export const CURATED_VOICES = ALL_SYSTEM_VOICES;

export const DEFAULT_VOICE_CONFIG = {
  idolVoice: {
    id: 'free_vi_female',
    name: 'Hoài My 🇻🇳 (Nữ - Chuẩn Tiếng Việt)',
    provider: 'system',
    tier: 'free',
    gender: 'Female',
    role: 'idol',
    pitch: 1.0,
    rate: 1.0,
    volume: 1.0,
    enabled: true
  },
  managerVoice: {
    id: 'el_callum',
    name: 'Callum 💎 (Nam - Quản Lý Giục Chốt Đơn Uy Lực)',
    provider: 'elevenlabs',
    tier: 'pro',
    gender: 'Male',
    role: 'manager',
    pitch: 1.0,
    rate: 1.05,
    volume: 1.0,
    enabled: true
  },
  commentVoice: {
    id: 'free_vi_female',
    name: 'Hoài My 🇻🇳 (Nữ - Chuẩn Tiếng Việt)',
    provider: 'system',
    tier: 'free',
    gender: 'Female',
    role: 'comment',
    pitch: 1.05,
    rate: 1.0,
    volume: 1.0,
    enabled: true
  },
  gameBlvVoice: {
    id: 'el_josh',
    name: 'Josh 💎 (Nam - BLV Game Siêu Tốc, Bùng Nổ)',
    provider: 'elevenlabs',
    tier: 'pro',
    gender: 'Male',
    role: 'game',
    pitch: 1.0,
    rate: 1.1,
    volume: 1.0,
    enabled: true
  },
  generalVoice: {
    id: 'free_vi_female',
    name: 'Hoài My 🇻🇳 (Nữ - Chuẩn Tiếng Việt)',
    provider: 'system',
    tier: 'free',
    gender: 'Female',
    role: 'both',
    pitch: 1.0,
    rate: 1.0,
    volume: 1.0,
    enabled: true
  },
  selectedLanguage: 'vi',
  elevenLabsApiKey: '',
  openaiApiKey: '',
  geminiApiKey: ''
};

// ==================== STORAGE & CONFIG HELPERS ====================
export function getSavedVoiceConfig() {
  if (typeof window === 'undefined') return DEFAULT_VOICE_CONFIG;
  try {
    const saved = localStorage.getItem('ava_live_voice_config_v2');
    if (saved) {
      return { ...DEFAULT_VOICE_CONFIG, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.warn('Lỗi đọc voice config:', e);
  }
  return DEFAULT_VOICE_CONFIG;
}

export function saveVoiceConfig(config) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('ava_live_voice_config_v2', JSON.stringify(config));
    window.dispatchEvent(new CustomEvent('ava_voice_config_updated', { detail: config }));
    window.dispatchEvent(new CustomEvent('aidol_voice_sync_updated', { detail: config }));
  } catch (e) {
    console.warn('Lỗi lưu voice config:', e);
  }
}

export function getElevenLabsApiKey() {
  if (typeof window === 'undefined') return '';
  const config = getSavedVoiceConfig();
  if (config.elevenLabsApiKey) return config.elevenLabsApiKey;
  return localStorage.getItem('elevenlabs_api_key') || localStorage.getItem('VITE_ELEVENLABS_API_KEY') || '';
}

// Global active audio & utterance references
let activePreviewAudio = null;
let activeUtterance = null;
let preloadedVoices = [];

// Initialize & keep voices ready in background
if (typeof window !== 'undefined') {
  window._activeVoiceSet = window._activeVoiceSet || new Set();
  
  const refreshVoices = () => {
    if ('speechSynthesis' in window) {
      try {
        const v = window.speechSynthesis.getVoices();
        if (v && v.length > 0) {
          preloadedVoices = v;
        }
      } catch (e) {}
    }
  };

  if ('speechSynthesis' in window) {
    refreshVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = refreshVoices;
    }
  }
}

export function stopVoiceAudio() {
  if (activePreviewAudio) {
    try {
      activePreviewAudio.pause();
      activePreviewAudio.currentTime = 0;
    } catch (e) {}
    activePreviewAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {}
  }
  if (typeof window !== 'undefined' && window._activeVoiceSet) {
    window._activeVoiceSet.clear();
  }
  activeUtterance = null;
  isGlobalSpeaking = false;
}
/**
 * 🧹 Bộ lọc làm sạch văn bản thông minh trước khi đưa vào Voice Engine / TTS:
 * - Loại bỏ 100% tất cả các thẻ cử chỉ / chỉ dẫn sân khấu trong ngoặc vuông: [Vỗ tay], [Cười tươi], [Chỉ tay vào giỏ hàng], [Đếm ngược 3 2 1], [user], v.v.
 * - Loại bỏ các ghi chú trong ngoặc đơn: (cười), (cười tươi), (vỗ tay), (nháy mắt), (chỉ giỏ hàng), (hành động...)
 * - Loại bỏ ký tự Markdown, bullet points, số thứ tự đầu dòng
 * - Đảm bảo nhân vật AI CHỈ đọc đúng nội dung câu thoại chính của phiên live!
 */
export function cleanTextForVoiceSpeech(rawText) {
  if (!rawText || typeof rawText !== 'string') return '';
  
  let cleaned = rawText;

  // 1. Loại bỏ tất cả các chỉ dẫn hành động / ghi chú trong ngoặc vuông
  cleaned = cleaned.replace(/\[[^\]]*\]/g, ' ');

  // 2. Loại bỏ các chỉ dẫn biểu cảm trong ngoặc đơn
  cleaned = cleaned.replace(/\((?:cười|cười tươi|vỗ tay|hành động|chỉ tay|nháy mắt|nói to|nói nhỏ|thì thầm|hào hứng|nhấn mạnh|chỉ giỏ hàng|chốt đơn|đếm ngược|action|smile|clap)[^\)]*\)/gi, ' ');

  // 3. Loại bỏ Markdown formatting
  cleaned = cleaned.replace(/[*_#`~>]/g, ' ');
  cleaned = cleaned.replace(/^\s*[-*+]\s+/gm, ''); // bullet points
  cleaned = cleaned.replace(/^\s*\d+[\.\)]\s+/gm, ''); // numbering at start of line: "1. ", "2) "

  // 4. Chuẩn hóa biến đại diện còn sót lại
  cleaned = cleaned
    .replace(/\{user\}/gi, 'bạn')
    .replace(/\{comment\}/gi, 'câu hỏi của bạn')
    .replace(/\{gift_name\}/gi, 'món quà')
    .replace(/\{count\}/gi, 'nhiều')
    .replace(/\{product\}/gi, 'sản phẩm')
    .replace(/\{item\}/gi, 'sản phẩm');

  // 5. Loại bỏ emoji gây ngắt quãng hoặc đọc mã unicode
  cleaned = cleaned.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, ' ');

  // 6. Rút gọn khoảng trắng thừa và dấu chấm lặp
  cleaned = cleaned.replace(/\s+/g, ' ').replace(/\.{2,}/g, '.').trim();

  return cleaned;
}

/**
 * ⚡ CẬP NHẬT TỨC THÌ ÂM LƯỢNG (0% - 100%) VÀ TỐC ĐỘ ĐỌC (0.75x - 1.5x) KHI ĐANG PHÁT (REAL-TIME 0ms LAG)
 * Hỗ trợ cả 2 cách gọi: updateActiveVoiceAudio({ volume, rate }) HOẶC updateActiveVoiceAudio(volume, rate, pitch)
 */
export function updateActiveVoiceAudio(param1, param2, param3) {
  let volume, rate;
  if (typeof param1 === 'object' && param1 !== null) {
    volume = param1.volume;
    rate = param1.rate;
  } else {
    volume = param1;
    rate = param2;
  }

  if (volume !== undefined) {
    const clampedVol = Math.max(0, Math.min(1.0, Number(volume)));
    if (activePreviewAudio) {
      try {
        activePreviewAudio.volume = clampedVol;
        activePreviewAudio.muted = clampedVol === 0;
      } catch (e) {}
    }
    if (activeUtterance) {
      try {
        activeUtterance.volume = clampedVol;
      } catch (e) {}
    }
  }
  if (rate !== undefined) {
    const clampedRate = Math.max(0.5, Math.min(2.0, Number(rate)));
    if (activePreviewAudio) {
      try {
        activePreviewAudio.playbackRate = clampedRate;
      } catch (e) {}
    }
  }
}

// ==================== GLOBAL SPEECH QUEUE & MUTUAL EXCLUSION LOCK ====================
// Tuyệt đối không cho 2 giọng nói / bình luận đọc cùng lúc. Mỗi câu đọc xong sẽ nghỉ 0.6s trước khi đọc câu tiếp theo.
let isGlobalSpeaking = false;
const globalSpeechQueue = [];
let isProcessingGlobalQueue = false;

export function isSpeechActive() {
  return isGlobalSpeaking || globalSpeechQueue.length > 0;
}

export function clearGlobalSpeechQueue() {
  globalSpeechQueue.length = 0;
  isProcessingGlobalQueue = false;
  isGlobalSpeaking = false;
  stopVoiceAudio();
}

/**
 * Tạo âm thanh phản hồi bằng Web Audio API phòng trường hợp trình duyệt không hỗ trợ Web Speech
 */
function playFallbackHarmonicChime(gender = 'Female') {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') ctx.resume();

    const isFemale = gender === 'Female' || gender === 'Nữ';
    const freqs = isFemale ? [523.25, 659.25, 783.99, 1046.5] : [261.63, 329.63, 392.0, 523.25];
    
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = isFemale ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
      
      gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.35);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(ctx.currentTime + idx * 0.08);
      osc.stop(ctx.currentTime + idx * 0.08 + 0.4);
    });
  } catch (e) {
    console.warn('Fallback harmonic chime error:', e);
  }
}

/**
 * Phát Voice AI Âm Thanh Cho Mọi Mục Đích (Preview, Idol nói, Game BLV, Trợ lý)
 * Đồng bộ qua Global Queue để không bao giờ bị nói đè, nói chồng chéo.
 * Hỗ trợ đa hình: previewVoiceAudio(voice, text, onEnd, priority) HOẶC previewVoiceAudio(voice, text, options, onEnd)
 */
export async function previewVoiceAudio(voiceOrId, sampleText = null, optionsOrOnEnd = null, onEndOrPriority = null) {
  if (typeof window === 'undefined') {
    if (typeof optionsOrOnEnd === 'function') optionsOrOnEnd();
    if (typeof onEndOrPriority === 'function') onEndOrPriority();
    return true;
  }

  // Chuẩn hóa voice object từ string ID hoặc role nếu cần
  let voiceObj = voiceOrId;
  if (typeof voiceOrId === 'string') {
    voiceObj = ALL_SYSTEM_VOICES.find(v => v.id === voiceOrId) ||
      (voiceOrId === 'idol' ? ALL_SYSTEM_VOICES.find(v => v.recommendedFor === 'idol') :
       voiceOrId === 'manager' || voiceOrId === 'assistant' ? ALL_SYSTEM_VOICES.find(v => v.recommendedFor === 'manager' || v.id === 'el_callum') :
       voiceOrId === 'game' ? ALL_SYSTEM_VOICES.find(v => v.recommendedFor === 'game' || v.id === 'el_josh') :
       ALL_SYSTEM_VOICES.find(v => v.id === 'free_vi_female'));
  }
  voiceObj = voiceObj || { id: 'free_vi_female', name: 'Hoài My 🇻🇳 (Nữ - Chuẩn Tiếng Việt)', lang: 'vi-VN', provider: 'system', gender: 'Female' };

  // Chuẩn hóa callback onEnd và options
  let onEnd = null;
  let priority = false;
  let isTest = false;
  let customOptions = {};

  if (typeof optionsOrOnEnd === 'function') {
    onEnd = optionsOrOnEnd;
    if (typeof onEndOrPriority === 'boolean') {
      priority = onEndOrPriority;
      isTest = onEndOrPriority;
    } else if (typeof onEndOrPriority === 'object' && onEndOrPriority !== null) {
      priority = !!onEndOrPriority.priority;
      isTest = !!onEndOrPriority.isTest;
    }
  } else if (typeof optionsOrOnEnd === 'object' && optionsOrOnEnd !== null) {
    customOptions = optionsOrOnEnd;
    onEnd = typeof onEndOrPriority === 'function' ? onEndOrPriority : optionsOrOnEnd.onEnd;
    priority = !!optionsOrOnEnd.priority;
    isTest = !!optionsOrOnEnd.isTest;
  } else if (typeof onEndOrPriority === 'function') {
    onEnd = onEndOrPriority;
  }

  const mergedVoice = {
    ...voiceObj,
    isTest: isTest || priority || voiceObj.isTest,
    priority: priority || voiceObj.priority,
    volume: customOptions.volume !== undefined ? customOptions.volume : (voiceObj.volume !== undefined ? voiceObj.volume : 1.0),
    rate: customOptions.rate !== undefined ? customOptions.rate : (voiceObj.rate !== undefined ? voiceObj.rate : 1.0),
    pitch: customOptions.pitch !== undefined ? customOptions.pitch : (voiceObj.pitch !== undefined ? voiceObj.pitch : 1.0),
    apiKey: customOptions.apiKey || voiceObj.apiKey || getElevenLabsApiKey()
  };

  // Kiểm tra nếu kênh giọng này bị tắt hoặc âm lượng về 0 (trừ khi đang nghe thử isTest)
  if (!mergedVoice.isTest && (mergedVoice?.enabled === false || mergedVoice?.isMuted === true || (mergedVoice?.volume !== undefined && mergedVoice.volume <= 0.001))) {
    if (onEnd) onEnd();
    return true;
  }

  if (priority || isTest) {
    clearGlobalSpeechQueue();
    return executeSingleSpeech(mergedVoice, sampleText, onEnd, true);
  }

  return new Promise((resolve) => {
    // Giới hạn hàng đợi tối đa 10 câu để tránh tràn bộ nhớ khi livestream quá đông
    if (globalSpeechQueue.length > 10) {
      globalSpeechQueue.shift();
    }

    globalSpeechQueue.push({
      voice: mergedVoice,
      sampleText,
      onEnd,
      resolve
    });

    processGlobalSpeechQueue();
  });
}

async function processGlobalSpeechQueue() {
  if (isProcessingGlobalQueue) return;
  isProcessingGlobalQueue = true;

  while (globalSpeechQueue.length > 0) {
    const item = globalSpeechQueue.shift();
    if (!item) continue;

    try {
      isGlobalSpeaking = true;
      await executeSingleSpeech(item.voice, item.sampleText, item.onEnd, false);
      if (item.resolve) item.resolve(true);
    } catch (err) {
      console.warn('[voiceSyncService] Queue execution error:', err);
      if (item.resolve) item.resolve(false);
    } finally {
      isGlobalSpeaking = false;
    }

    // Khoảng cách thời gian nghỉ giữa 2 lần đọc / trả lời (0.6 giây) để mượt mà không bị ngắt quãng
    await new Promise((r) => setTimeout(r, 600));
  }

  isProcessingGlobalQueue = false;
}

async function executeSingleSpeech(voice, sampleText = null, onEnd = null, isTest = false) {
  stopVoiceAudio();

  const isTestingMode = isTest === true || voice?.isTest === true || voice?.priority === true;

  const isUserPaused = typeof localStorage !== 'undefined' && (
    localStorage.getItem('avalive_user_paused') === 'true' || 
    localStorage.getItem('avalive_window_capture_paused') === 'true'
  );
  if (!isTestingMode && isUserPaused) {
    if (onEnd) onEnd();
    return true;
  }

  const rawLang = voice?.lang || (
    voice?.id?.includes('_us_') || voice?.id?.includes('_en_') ? 'en-US' :
    voice?.id?.includes('_zh_') ? 'zh-CN' :
    voice?.id?.includes('_ja_') ? 'ja-JP' :
    voice?.id?.includes('_ko_') ? 'ko-KR' :
    voice?.id?.includes('_fr_') ? 'fr-FR' :
    voice?.id?.includes('_es_') ? 'es-ES' :
    voice?.id?.includes('_th_') ? 'th-TH' :
    voice?.id?.includes('_pt_') ? 'pt-BR' :
    voice?.id?.includes('_de_') ? 'de-DE' :
    voice?.id?.includes('_it_') ? 'it-IT' :
    voice?.id?.includes('_ru_') ? 'ru-RU' :
    voice?.id?.includes('_ar_') ? 'ar-SA' :
    voice?.id?.includes('_id_') ? 'id-ID' :
    voice?.id?.includes('_hi_') ? 'hi-IN' :
    voice?.id?.includes('_tr_') ? 'tr-TR' :
    voice?.id?.includes('_pl_') ? 'pl-PL' :
    voice?.id?.includes('_nl_') ? 'nl-NL' :
    voice?.id?.includes('_tl_') ? 'tl-PH' :
    voice?.id?.includes('_ms_') ? 'ms-MY' : 'vi-VN'
  );
  const langCode = rawLang || 'vi-VN';
  const shortLang = langCode.split('-')[0].toLowerCase() || 'vi';

  const defaultSamples = {
    vi: (voice?.gender === 'Male' || voice?.gender === 'Nam') 
      ? 'Chào mừng tất cả các bạn đến với livestream! Trận chiến đang cực kỳ sôi động, hãy cùng cắm cờ Tổ Quốc nhé!' 
      : 'Dạ em chào bạn đang theo dõi live nha! Em là Trợ Lý AI của phiên live, chúc bạn xem live thật vui ạ!',
    en: (voice?.gender === 'Male' || voice?.gender === 'Nam') 
      ? 'Welcome to our live broadcast! Get ready for an epic interactive battle!' 
      : 'Hello everyone! Thank you for joining our livestream today! Have a wonderful time!',
    zh: '各位直播间的朋友们大家好！欢迎来到我们的互动直播间！',
    ja: 'みなさん、こんにちは！ライブ配信へようこそ！一緒に盛り上がりましょう！',
    ko: '안녕하세요 여러분! 라이브 방송에 오신 것을 진심으로 환영합니다!',
    fr: 'Bonjour à tous et bienvenue sur notre diffusion en direct !',
    es: '¡Hola a todos! ¡Bienvenidos a nuestra transmisión en vivo!',
    th: 'สวัสดีค่ะทุกคน ยินดีต้อนรับสู่การถ่ายทอดสดของเราค่ะ!',
    pt: 'Olá a todos! Sejam muito bem-vindos à nossa transmissão ao vivo!',
    de: 'Hallo zusammen! Herzlich willkommen zu unserem Livestream!',
    it: 'Ciao a tutti e benvenuti nella nostra diretta live!',
    ru: 'Всем привет! Добро пожаловать на наш прямой эфир!',
    ar: 'مرحبًا بالجميع! أهلاً بكم في البث المباشر التفاعلي!',
    id: 'Halo semuanya! Selamat datang di siaran langsung kami!',
    hi: 'नमस्ते दोस्तों! हमारे लाइव प्रसारण में आप सभी का स्वागत है!',
    tr: 'Herkese merhaba! Canlı yayınımıza hoş geldiniz!',
    pl: 'Cześć wszystkim! Witamy na naszej transmisji na żywo!',
    nl: 'Hallo allemaal! Welkom bij onze livestream uitzending!',
    tl: 'Kumusta sa lahat! Maligayang pagdating sa ating livestream!',
    ms: 'Hai semua! Selamat datang ke siaran langsung kami!'
  };

  const rawCandidate = (sampleText || defaultSamples[shortLang] || defaultSamples.vi).trim();
  const textToSpeak = cleanTextForVoiceSpeech(rawCandidate) || rawCandidate;
  const apiKey = getElevenLabsApiKey();
  const voiceId = voice?.voiceId || '21m00Tcm4TlvDq8ikWAM';
  
  const savedGlobalVol = typeof localStorage !== 'undefined' && localStorage.getItem('avalive_global_volume') 
    ? parseFloat(localStorage.getItem('avalive_global_volume')) 
    : (typeof localStorage !== 'undefined' && localStorage.getItem('avalive_video_volume') ? parseFloat(localStorage.getItem('avalive_video_volume')) : 1.0);
  const isLocalSpeakerMuted = typeof localStorage !== 'undefined' && (
    localStorage.getItem('avalive_local_speaker_muted') === 'true' ||
    localStorage.getItem('avalive_audio_muted') === 'true'
  );

  const requestedVolume = voice?.volume !== undefined ? Math.max(0, Math.min(1.0, Number(voice.volume))) : 1.0;
  const requestedRate = voice?.rate !== undefined ? Math.max(0.5, Math.min(2.0, Number(voice.rate))) : 1.0;
  const effectiveVoiceVolume = isTestingMode 
    ? requestedVolume 
    : (isLocalSpeakerMuted ? 0 : Math.max(0, Math.min(1.0, requestedVolume * (savedGlobalVol !== null && !isNaN(savedGlobalVol) ? savedGlobalVol : 1.0))));

  // =========================================================================
  // TIER 1: ElevenLabs API (Chỉ khi cấu hình ElevenLabs và có API Key hợp lệ)
  // =========================================================================
  if (voice?.provider === 'elevenlabs' && apiKey && apiKey.length > 10) {
    try {
      const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
          'Accept': 'audio/mpeg'
        },
        body: JSON.stringify({
          text: textToSpeak,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true
          }
        })
      });

      if (res.ok) {
        const blob = await res.blob();
        const audioUrl = URL.createObjectURL(blob);
        const audio = new Audio(audioUrl);
        audio.volume = effectiveVoiceVolume;
        audio.playbackRate = requestedRate;
        audio.muted = effectiveVoiceVolume === 0;
        
        // Kết nối Audio vào Avatar Lip Sync Engine khi không phải test
        if (!isTestingMode) {
          try { globalLipSyncEngine.connectAudioElement(audio); } catch(e) {}
        }
        
        activePreviewAudio = audio;
        return new Promise((resolve) => {
          let finished = false;
          const finish = () => {
            if (finished) return;
            finished = true;
            activePreviewAudio = null;
            try { URL.revokeObjectURL(audioUrl); } catch {}
            if (onEnd) onEnd();
            resolve(true);
          };
          audio.onended = finish;
          audio.onerror = finish;
          audio.play().catch(finish);
        });
      }
    } catch (e) {
      console.warn('ElevenLabs API direct fetch error, falling back to instant Web Speech:', e);
    }
  }

  // =========================================================================
  // TIER 2: Ultra-Reliable Streaming Audio TTS (Server / Cloud Proxy / Direct)
  // =========================================================================
  const isOverlayPage = typeof window !== 'undefined' && (
    window.location.search.includes('overlay=') ||
    window.location.pathname.includes('/overlay') ||
    window.location.pathname.includes('/cleanlive') ||
    window.location.pathname.includes('/idol') ||
    window.location.pathname.includes('/battle') ||
    window.location.pathname.includes('/bando')
  );

  // Danh sách các endpoints TTS thử nghiệm tuần tự để đảm bảo 100% phát được âm thanh
  const ttsCandidateUrls = [];
  
  // 1. Endpoint /api/tts tương đối (hoạt động trên Vite dev server, Vercel và backend cùng origin)
  ttsCandidateUrls.push(`/api/tts?text=${encodeURIComponent(textToSpeak)}&lang=${encodeURIComponent(shortLang || 'vi')}`);
  
  // 2. Endpoint backend trực tiếp port 3001
  if (typeof window !== 'undefined' && window.location.hostname) {
    ttsCandidateUrls.push(`http://${window.location.hostname}:3001/api/tts?text=${encodeURIComponent(textToSpeak)}&lang=${encodeURIComponent(shortLang || 'vi')}`);
  }
  ttsCandidateUrls.push(`http://127.0.0.1:3001/api/tts?text=${encodeURIComponent(textToSpeak)}&lang=${encodeURIComponent(shortLang || 'vi')}`);
  
  // 3. Google Translate TTS trực tiếp (giới hạn 200 ký tự chuẩn URL Google TTS)
  ttsCandidateUrls.push(`https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${encodeURIComponent(shortLang || 'vi')}&q=${encodeURIComponent(textToSpeak.slice(0, 200))}`);

  for (const ttsUrl of ttsCandidateUrls) {
    try {
      const streamAudio = new Audio(ttsUrl);
      streamAudio.volume = effectiveVoiceVolume;
      streamAudio.playbackRate = requestedRate;
      streamAudio.muted = effectiveVoiceVolume === 0;
      
      // Không gán MediaElementSource khi đang test để tránh AudioContext bị mute
      if (!isTestingMode) {
        try { globalLipSyncEngine.connectAudioElement(streamAudio); } catch(e) {}
      }
      
      activePreviewAudio = streamAudio;

      const playPromise = new Promise((resolve) => {
        let isDone = false;
        const cleanup = (success) => {
          if (isDone) return;
          isDone = true;
          activePreviewAudio = null;
          if (success && onEnd) onEnd();
          resolve(success);
        };

        streamAudio.onended = () => cleanup(true);
        streamAudio.onerror = () => cleanup(false);
        
        const playAttempt = streamAudio.play();
        if (playAttempt && typeof playAttempt.catch === 'function') {
          playAttempt.catch(() => {
            cleanup(false);
          });
        }
      });

      const isSuccess = await playPromise;
      if (isSuccess) return true;
    } catch (audioStreamErr) {
      // Thử URL tiếp theo
    }
  }

  // =========================================================================
  // TIER 3: Instant Client Web Speech API (Đồng bộ, tối ưu hoá mọi trình duyệt)
  // =========================================================================
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    return new Promise((resolve) => {
      try {
        window.speechSynthesis.cancel();
        window.speechSynthesis.resume();

        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        activeUtterance = utterance;
        
        // Lưu vào Set toàn cục để tránh bị Garbage Collector dọn dẹp giữa chừng
        window._activeVoiceSet = window._activeVoiceSet || new Set();
        window._activeVoiceSet.add(utterance);

        utterance.lang = langCode;

        const isMale = voice?.gender === 'Male' || voice?.gender === 'Nam';
        const isFemale = !isMale;

        // Tôn trọng 100% tốc độ đọc (rate), cao độ (pitch) và âm lượng (volume) người dùng tùy chỉnh
        utterance.rate = requestedRate;
        utterance.pitch = voice?.pitch !== undefined ? Number(voice.pitch) : (isFemale ? 1.12 : 0.88);
        utterance.volume = effectiveVoiceVolume;

        let hasEnded = false;
        const finish = (ok) => {
          if (hasEnded) return;
          hasEnded = true;
          if (window._activeVoiceSet) {
            window._activeVoiceSet.delete(utterance);
          }
          activeUtterance = null;
          if (onEnd) onEnd();
          resolve(ok);
        };

        utterance.onend = () => finish(true);
        utterance.onerror = (e) => {
          console.warn('Web Speech synthesis error:', e);
          playFallbackHarmonicChime(voice?.gender);
          finish(false);
        };

        // Safety watchdog: tự động kết thúc nếu trình duyệt bị đơ
        const maxDurationMs = Math.max(5000, textToSpeak.length * 160);
        const watchdog = setTimeout(() => finish(true), maxDurationMs);
        utterance.addEventListener('end', () => clearTimeout(watchdog));

        // Lấy danh sách giọng từ Web Speech API
        const availableVoices = (preloadedVoices.length > 0 ? preloadedVoices : window.speechSynthesis.getVoices()) || [];
        if (availableVoices.length > 0) {
          // Tìm giọng chuẩn theo ngôn ngữ và giới tính
          let matched = availableVoices.find(v => {
            const vLang = (v.lang || '').toLowerCase().replace('_', '-');
            const matchesLang = vLang.startsWith(shortLang) || vLang.includes(shortLang);
            const vName = (v.name || '').toLowerCase();
            if (isMale) {
              return matchesLang && (vName.includes('male') || vName.includes('nam') || vName.includes('david') || vName.includes('george'));
            } else {
              return matchesLang && (vName.includes('female') || vName.includes('nữ') || vName.includes('linh') || vName.includes('mai') || vName.includes('zira') || vName.includes('samantha'));
            }
          });

          if (!matched) {
            matched = availableVoices.find(v => {
              const vLang = (v.lang || '').toLowerCase().replace('_', '-');
              return vLang.startsWith(shortLang) || vLang.includes(shortLang);
            });
          }

          if (!matched && availableVoices.length > 0) {
            matched = availableVoices[0];
          }

          if (matched) {
            utterance.voice = matched;
          }
        }

        setTimeout(() => {
          try {
            window.speechSynthesis.speak(utterance);
          } catch (spkErr) {
            finish(false);
          }
        }, 15);
      } catch (synthErr) {
        console.warn('Web Speech API execution catch:', synthErr);
        playFallbackHarmonicChime(voice?.gender);
        if (onEnd) onEnd();
        resolve(false);
      }
    });
  }

  // =========================================================================
  // TIER 4: Web Audio API Tone Fallback
  // =========================================================================
  playFallbackHarmonicChime(voice?.gender);
  if (onEnd) setTimeout(onEnd, 1200);
  return true;
}

export const speakVoiceAudio = previewVoiceAudio;
export const getDualVoiceConfig = getSavedVoiceConfig;
export const saveDualVoiceConfig = saveVoiceConfig;

export default {
  ELEVENLABS_VOICES,
  FREE_VOICES,
  ALL_SYSTEM_VOICES,
  CURATED_VOICES,
  DEFAULT_VOICE_CONFIG,
  getSavedVoiceConfig,
  saveVoiceConfig,
  getDualVoiceConfig,
  saveDualVoiceConfig,
  getElevenLabsApiKey,
  stopVoiceAudio,
  previewVoiceAudio,
  speakVoiceAudio,
  updateActiveVoiceAudio
};


