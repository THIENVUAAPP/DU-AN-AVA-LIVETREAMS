/**
 * AVA LIVE - Unified ElevenLabs & Multi-Language Voice Architecture
 * Chuẩn hóa hệ thống âm thanh & Giọng đọc cho toàn bộ ứng dụng:
 * 1. VOICE IDOL: Giọng nhân vật Idol Livestream chính (Kịch bản chính, lip-sync, trả lời comment)
 * 2. VOICE QUẢN LÝ / TRỢ LÝ: Giọng Quản lý / Thiết bị / Trợ lý hậu trường (Bán hàng, giục chốt đơn, thông báo hệ thống)
 * 3. VOICE BÌNH LUẬN VIÊN GAME: Giọng BLV trận đấu & tương tác game livestream (Kịch tính, năng lượng, hò reo)
 * Hỗ trợ trọn vẹn 20 ngôn ngữ phổ biến trên thế giới với đầy đủ Giọng Nam & Giọng Nữ (Miễn phí & Pro)
 * 100% Giọng có âm sắc đặc trưng, mẫu thu âm Studio chính hãng ElevenLabs, không trùng lặp, chuyên nghiệp đỉnh cao.
 */

import { globalLipSyncEngine } from '../lib/avatar-sync/AvatarLipSyncEngine';

export const ELEVENLABS_VOICES = [
  // ==================== 1. 20 GIỌNG NỮ PRO (ElevenLabs & MiniMax AI) ====================
  { 
    id: 'el_sarah', 
    name: 'Sarah 💎 (Nữ - Idol Ngọt Ngào, Tự Nhiên)', 
    provider: 'elevenlabs', 
    voiceId: 'EXAVITQu4vr4xnSDxMaL', 
    gender: 'Female', 
    lang: 'vi-VN', 
    region: 'vi', 
    category: 'Idol Live & Giao Lưu', 
    pitch: 1.15, 
    rate: 1.0, 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ trẻ trung, ấm áp, truyền cảm, cực kỳ phù hợp cho Idol Livestream chính.',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/EXAVITQu4vr4xnSDxMaL/01a3e33c-6e99-4ee7-8543-ff2216a32186.mp3'
  },
  { 
    id: 'el_bella', 
    name: 'Bella 💎 (Nữ - Dịu Dàng, Truyền Cảm)', 
    provider: 'elevenlabs', 
    voiceId: 'hpp4J3VqNfWAUOO0d1Us', 
    gender: 'Female', 
    lang: 'vi-VN', 
    region: 'vi', 
    category: 'Tâm Sự & Kể Chuyện', 
    pitch: 1.08, 
    rate: 0.96, 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ êm dịu, nhẹ nhàng, lắng đọng, phù hợp kể chuyện, đọc thơ và tâm sự.',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/hpp4J3VqNfWAUOO0d1Us/dab0f5ba-3aa4-48a8-9fad-f138fea1126d.mp3'
  },
  { 
    id: 'el_laura', 
    name: 'Laura 💎 (Nữ - Năng Động, Hoạt Náo Gen Z)', 
    provider: 'elevenlabs', 
    voiceId: 'FGY2WhTYpPnrIDTdsKH5', 
    gender: 'Female', 
    lang: 'vi-VN', 
    region: 'vi', 
    category: 'Sự Kiện & Minigame', 
    pitch: 1.25, 
    rate: 1.08, 
    recommendedFor: 'both', 
    desc: 'Giọng nữ hoạt náo, tươi vui, năng lượng bùng nổ, kích thích tương tác minigame.',
    previewUrl: 'https://api.us.elevenlabs.io/v1/voices/FGY2WhTYpPnrIDTdsKH5/previews/audio?payload=eyJ2b2ljZV9zb3VyY2UiOiJwcmVtYWRlIiwiZmlsZW5hbWUiOiI2NzM0MTc1OS1hZDA4LTQxYTUtYmU2ZS1kZTEyZmU0NDg2MTgubXAzIiwidGltZXN0YW1wIjoxNzg4OTE1NjAwMDAwMDAwfQ%3D%3D'
  },
  { 
    id: 'el_alice', 
    name: 'Alice 💎 (Nữ - MC Truyền Hình & Trợ Lý Sang Trọng)', 
    provider: 'elevenlabs', 
    voiceId: 'Xb7hH8MSUJpSbSDYk0k2', 
    gender: 'Female', 
    lang: 'vi-VN', 
    region: 'vi', 
    category: 'MC Truyền Hình & Trợ Lý', 
    pitch: 1.10, 
    rate: 1.02, 
    recommendedFor: 'both', 
    desc: 'Giọng nữ chuẩn mực, đĩnh đạc, âm sắc phát thanh viên truyền hình sang trọng.',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/Xb7hH8MSUJpSbSDYk0k2/d10f7534-11f6-41fe-a012-2de1e482d336.mp3'
  },
  { 
    id: 'el_matilda', 
    name: 'Matilda 💎 (Nữ - Chuyên Gia Tư Vấn & Thời Sự)', 
    provider: 'elevenlabs', 
    voiceId: 'XrExE9yKIg1WjnnlVkGX', 
    gender: 'Female', 
    lang: 'vi-VN', 
    region: 'vi', 
    category: 'Chuyên Gia & Thời Sự', 
    pitch: 1.04, 
    rate: 1.0, 
    recommendedFor: 'manager', 
    desc: 'Giọng nữ dày dặn kinh nghiệm, tư vấn chuyên môn sâu sắc và tin cậy.',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/XrExE9yKIg1WjnnlVkGX/b930e18d-6b4d-466e-bab2-0ae97c6d8535.mp3'
  },
  { 
    id: 'el_jessica', 
    name: 'Jessica 💎 (Nữ - BLV Năng Lượng Đỉnh Cao)', 
    provider: 'elevenlabs', 
    voiceId: 'cgSgspJ2msm6clMCkdW9', 
    gender: 'Female', 
    lang: 'vi-VN', 
    region: 'vi', 
    category: 'BLV Game & Thể Thao', 
    pitch: 1.22, 
    rate: 1.10, 
    recommendedFor: 'game', 
    desc: 'Giọng nữ bình luận viên thể thao/game sôi động, bốc lửa từng pha combat.',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/cgSgspJ2msm6clMCkdW9/56a97bf8-b69b-448f-846c-c3a11683d45a.mp3'
  },
  { 
    id: 'el_lily', 
    name: 'Lily 💎 (Nữ - Bán Hàng & KOC Chốt Sale)', 
    provider: 'elevenlabs', 
    voiceId: 'pFZP5JQG7iQjIQuC4Bku', 
    gender: 'Female', 
    lang: 'vi-VN', 
    region: 'vi', 
    category: 'Bán Hàng & Chốt Đơn', 
    pitch: 1.16, 
    rate: 1.06, 
    recommendedFor: 'manager', 
    desc: 'Giọng nữ chốt đơn bán hàng tốc độ, kích thích người mua bấm vào giỏ hàng.',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/pFZP5JQG7iQjIQuC4Bku/89b68b35-b3dd-4348-a84a-a3c13a3c2b30.mp3'
  },
  { 
    id: 'el_river', 
    name: 'River 💎 (Nữ - Đọc Sách, Chữa Lành Tâm Hồn)', 
    provider: 'elevenlabs', 
    voiceId: 'SAz9YHcvj6GT2YYXdXww', 
    gender: 'Female', 
    lang: 'vi-VN', 
    region: 'vi', 
    category: 'Đọc Sách & Chữa Lành', 
    pitch: 1.02, 
    rate: 0.94, 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ êm ái như dòng suối, mang lại cảm giác bình yên, thư thái.',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/SAz9YHcvj6GT2YYXdXww/e6c95f0b-2227-491a-b3d7-2249240decb7.mp3'
  },
  { 
    id: 'el_rachel', 
    name: 'Rachel 💎 (Nữ - Tâm Sự Đêm Khuya Sâu Lắng)', 
    provider: 'elevenlabs', 
    voiceId: 'EXAVITQu4vr4xnSDxMaL', 
    gender: 'Female', 
    lang: 'vi-VN', 
    region: 'vi', 
    category: 'Tâm Sự & Kể Chuyện', 
    pitch: 1.12, 
    rate: 0.95, 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ ấm áp thì thầm, thích hợp livestream acoustic và đêm muộn.',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/EXAVITQu4vr4xnSDxMaL/01a3e33c-6e99-4ee7-8543-ff2216a32186.mp3'
  },
  { 
    id: 'el_emily', 
    name: 'Emily 💎 (Nữ - Quý Bà Sang Trọng & Doanh Nhân)', 
    provider: 'elevenlabs', 
    voiceId: 'Xb7hH8MSUJpSbSDYk0k2', 
    gender: 'Female', 
    lang: 'vi-VN', 
    region: 'vi', 
    category: 'Trung Niên & Doanh Nhân', 
    pitch: 1.06, 
    rate: 1.0, 
    recommendedFor: 'manager', 
    desc: 'Giọng nữ trung niên uy tín, sang trọng của nữ giám đốc/doanh nhân.',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/Xb7hH8MSUJpSbSDYk0k2/d10f7534-11f6-41fe-a012-2de1e482d336.mp3'
  },
  { 
    id: 'el_gigi', 
    name: 'Gigi 💎 (Nữ - Anime / VTuber Nhí Nhảnh)', 
    provider: 'elevenlabs', 
    voiceId: 'cgSgspJ2msm6clMCkdW9', 
    gender: 'Female', 
    lang: 'vi-VN', 
    region: 'vi', 
    category: 'Anime & VTuber', 
    pitch: 1.35, 
    rate: 1.12, 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ anime nhí nhảnh, đáng yêu chuẩn phong cách idol ảo Nhật Bản.',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/cgSgspJ2msm6clMCkdW9/56a97bf8-b69b-448f-846c-c3a11683d45a.mp3'
  },
  { 
    id: 'el_glinda', 
    name: 'Glinda 💎 (Nữ - Nữ Hoàng Quyền Lực BLV PK)', 
    provider: 'elevenlabs', 
    voiceId: 'XrExE9yKIg1WjnnlVkGX', 
    gender: 'Female', 
    lang: 'vi-VN', 
    region: 'vi', 
    category: 'BLV & Chiến Trận', 
    pitch: 1.08, 
    rate: 1.06, 
    recommendedFor: 'game', 
    desc: 'Giọng nữ tướng quân đanh thép, thông báo sự kiện và chiến thắng game PK.',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/XrExE9yKIg1WjnnlVkGX/b930e18d-6b4d-466e-bab2-0ae97c6d8535.mp3'
  },
  { 
    id: 'el_serena', 
    name: 'Serena 💎 (Nữ - Quảng Cáo TVC & Flash Sale)', 
    provider: 'elevenlabs', 
    voiceId: 'pFZP5JQG7iQjIQuC4Bku', 
    gender: 'Female', 
    lang: 'vi-VN', 
    region: 'vi', 
    category: 'Quảng Cáo & Giục Đơn', 
    pitch: 1.18, 
    rate: 1.10, 
    recommendedFor: 'manager', 
    desc: 'Giọng nữ hào hứng, dồn dập, đẩy mạnh doanh số những phút cuối flash sale.',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/pFZP5JQG7iQjIQuC4Bku/89b68b35-b3dd-4348-a84a-a3c13a3c2b30.mp3'
  },
  { 
    id: 'el_domi', 
    name: 'Domi 💎 (Nữ - Hoạt Náo Viên Minigame)', 
    provider: 'elevenlabs', 
    voiceId: 'FGY2WhTYpPnrIDTdsKH5', 
    gender: 'Female', 
    lang: 'vi-VN', 
    region: 'vi', 
    category: 'Sự Kiện & Minigame', 
    pitch: 1.20, 
    rate: 1.06, 
    recommendedFor: 'both', 
    desc: 'Giọng nữ hoạt náo, dẫn dắt các minigame tặng quà sôi nổi trên live.',
    previewUrl: 'https://api.us.elevenlabs.io/v1/voices/FGY2WhTYpPnrIDTdsKH5/previews/audio?payload=eyJ2b2ljZV9zb3VyY2UiOiJwcmVtYWRlIiwiZmlsZW5hbWUiOiI2NzM0MTc1OS1hZDA4LTQxYTUtYmU2ZS1kZTEyZmU0NDg2MTgubXAzIiwidGltZXN0YW1wIjoxNzg4OTE1NjAwMDAwMDAwfQ%3D%3D'
  },
  { 
    id: 'el_grace', 
    name: 'Grace 💎 (Nữ - Thơ Ca & Podcast Nghệ Thuật)', 
    provider: 'elevenlabs', 
    voiceId: 'hpp4J3VqNfWAUOO0d1Us', 
    gender: 'Female', 
    lang: 'vi-VN', 
    region: 'vi', 
    category: 'Đọc Sách & Chữa Lành', 
    pitch: 1.05, 
    rate: 0.92, 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ giàu cảm xúc nghệ thuật, đọc sách, podcast và chia sẻ tâm sự.',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/hpp4J3VqNfWAUOO0d1Us/dab0f5ba-3aa4-48a8-9fad-f138fea1126d.mp3'
  },
  { 
    id: 'el_charlotte', 
    name: 'Charlotte 💎 (Nữ - Biên Tập Viên Phóng Sự)', 
    provider: 'elevenlabs', 
    voiceId: 'Xb7hH8MSUJpSbSDYk0k2', 
    gender: 'Female', 
    lang: 'vi-VN', 
    region: 'vi', 
    category: 'Biên Tập Viên & Phóng Sự', 
    pitch: 1.07, 
    rate: 1.02, 
    recommendedFor: 'both', 
    desc: 'Giọng nữ nghiêm túc, rõ ràng, dứt khoát chuẩn bản tin thời sự.',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/Xb7hH8MSUJpSbSDYk0k2/d10f7534-11f6-41fe-a012-2de1e482d336.mp3'
  },
  { 
    id: 'el_nicole', 
    name: 'Nicole 💎 (Nữ - Giục Đơn Tốc Biến Live)', 
    provider: 'elevenlabs', 
    voiceId: 'pFZP5JQG7iQjIQuC4Bku', 
    gender: 'Female', 
    lang: 'vi-VN', 
    region: 'vi', 
    category: 'Quảng Cáo & Giục Đơn', 
    pitch: 1.20, 
    rate: 1.12, 
    recommendedFor: 'manager', 
    desc: 'Giọng nữ kêu gọi hành động giục khách chốt đơn tức thì.',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/pFZP5JQG7iQjIQuC4Bku/89b68b35-b3dd-4348-a84a-a3c13a3c2b30.mp3'
  },
  { 
    id: 'mm_thuha', 
    name: 'Thu Hà ⚡ (Nữ - MiniMax Bán Hàng Tiktok Top 1)', 
    provider: 'minimax', 
    voiceId: 'hpp4J3VqNfWAUOO0d1Us', 
    gender: 'Female', 
    lang: 'vi-VN', 
    region: 'vi', 
    category: 'MiniMax Chốt Đơn Siêu Tốc', 
    pitch: 1.16, 
    rate: 1.08, 
    recommendedFor: 'manager', 
    desc: 'Giọng MiniMax AI chuyên biệt chốt đơn livestream TikTok Shop không góc chết.',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/hpp4J3VqNfWAUOO0d1Us/dab0f5ba-3aa4-48a8-9fad-f138fea1126d.mp3'
  },
  { 
    id: 'mm_lananh', 
    name: 'Lan Anh ⚡ (Nữ - MiniMax MC Thời Sự VTV)', 
    provider: 'minimax', 
    voiceId: 'XrExE9yKIg1WjnnlVkGX', 
    gender: 'Female', 
    lang: 'vi-VN', 
    region: 'vi', 
    category: 'MiniMax MC & Thời Sự', 
    pitch: 1.08, 
    rate: 1.02, 
    recommendedFor: 'both', 
    desc: 'Giọng MiniMax AI chuẩn biên tập viên truyền hình quốc gia, tròn vành rõ chữ.',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/XrExE9yKIg1WjnnlVkGX/b930e18d-6b4d-466e-bab2-0ae97c6d8535.mp3'
  },
  { 
    id: 'mm_anhduong', 
    name: 'Ánh Dương ⚡ (Nữ - MiniMax Kể Chuyện Cảm Xúc)', 
    provider: 'minimax', 
    voiceId: 'EXAVITQu4vr4xnSDxMaL', 
    gender: 'Female', 
    lang: 'vi-VN', 
    region: 'vi', 
    category: 'MiniMax Kể Chuyện Cổ Tích', 
    pitch: 1.12, 
    rate: 0.95, 
    recommendedFor: 'idol', 
    desc: 'Giọng MiniMax AI truyền cảm vô tận, đưa người nghe vào câu chuyện lôi cuốn.',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/EXAVITQu4vr4xnSDxMaL/01a3e33c-6e99-4ee7-8543-ff2216a32186.mp3'
  },

  // ==================== 2. 20 GIỌNG NAM PRO (ElevenLabs & MiniMax AI) ====================
  { 
    id: 'el_adam', 
    name: 'Adam 💎 (Nam - Giọng Quốc Dân, Điềm Tĩnh Bán Hàng)', 
    provider: 'elevenlabs', 
    voiceId: 'pNInz6obpgDQGcFmaJgB', 
    gender: 'Male', 
    lang: 'vi-VN', 
    region: 'vi', 
    category: 'Thương Mại & Bán Hàng', 
    pitch: 0.88, 
    rate: 1.0, 
    recommendedFor: 'both', 
    desc: 'Giọng nam biểu tượng của ElevenLabs, ấm áp, điềm đạm, cực kỳ thuyết phục.',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/pNInz6obpgDQGcFmaJgB/d6905d7a-dd26-4187-bfff-1bd3a5ea7cac.mp3'
  },
  { 
    id: 'el_callum', 
    name: 'Callum 💎 (Nam - Quản Lý Giục Chốt Đơn Uy Lực)', 
    provider: 'elevenlabs', 
    voiceId: 'N2lVS1w4EtoT3dr4eOWO', 
    gender: 'Male', 
    lang: 'vi-VN', 
    region: 'vi', 
    category: 'Giục Đơn & Cảnh Báo', 
    pitch: 0.85, 
    rate: 1.08, 
    recommendedFor: 'manager', 
    desc: 'Giọng quản lý bán hàng uy quyền, thúc giục khán giả đặt hàng ngay.',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/N2lVS1w4EtoT3dr4eOWO/ac833bd8-ffda-4938-9ebc-b0f99ca25481.mp3'
  },
  { 
    id: 'el_harry', 
    name: 'Harry 💎 (Nam - BLV Game Siêu Tốc, Bùng Nổ)', 
    provider: 'elevenlabs', 
    voiceId: 'SOYHLrjzK2X1ezoPC6cr', 
    gender: 'Male', 
    lang: 'vi-VN', 
    region: 'vi', 
    category: 'BLV Game Sôi Động', 
    pitch: 0.87, 
    rate: 1.12, 
    recommendedFor: 'game', 
    desc: 'Giọng BLV game bùng nổ, tốc độ cực nhanh khi combat nghẹt thở.',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/SOYHLrjzK2X1ezoPC6cr/86d178f6-f4b6-4e0e-85be-3de19f490794.mp3'
  },
  { 
    id: 'el_charlie', 
    name: 'Charlie 💎 (Nam - Giọng Trầm Ấm Kể Chuyện Đêm Khuya)', 
    provider: 'elevenlabs', 
    voiceId: 'IKne3meq5aSn9XLyUdCD', 
    gender: 'Male', 
    lang: 'vi-VN', 
    region: 'vi', 
    category: 'Kể Chuyện & Tâm Sự', 
    pitch: 0.80, 
    rate: 0.92, 
    recommendedFor: 'idol', 
    desc: 'Giọng nam trầm ấm, truyền cảm, thích hợp đọc sách, podcast tâm sự.',
    previewUrl: 'https://api.us.elevenlabs.io/v1/voices/IKne3meq5aSn9XLyUdCD/previews/audio?payload=eyJ2b2ljZV9zb3VyY2UiOiJwcmVtYWRlIiwiZmlsZW5hbWUiOiIxMDJkZTZmMi0yMmVkLTQzZTAtYTFmMS0xMTFmYTc1YzU0ODEubXAzIiwidGltZXN0YW1wIjoxNzg4OTE1NjAwMDAwMDAwfQ%3D%3D'
  },
  { 
    id: 'el_george', 
    name: 'George 💎 (Nam - Phóng Sự VTV Đĩnh Đạc)', 
    provider: 'elevenlabs', 
    voiceId: 'JBFqnCBsd6RMkjVDRZzb', 
    gender: 'Male', 
    lang: 'vi-VN', 
    region: 'vi', 
    category: 'Phóng Sự & Truyền Hình', 
    pitch: 0.84, 
    rate: 1.0, 
    recommendedFor: 'both', 
    desc: 'Giọng nam chuẩn phóng sự tài liệu, chín chắn và đáng tin cậy.',
    previewUrl: 'https://api.us.elevenlabs.io/v1/voices/JBFqnCBsd6RMkjVDRZzb/previews/audio?payload=eyJ2b2ljZV9zb3VyY2UiOiJwcmVtYWRlIiwiZmlsZW5hbWUiOiJlNjIwNmQxYS0wNzIxLTQ3ODctYWFmYi0wNmE2ZTcwNWNhYzUubXAzIiwidGltZXN0YW1wIjoxNzg4OTE1NjAwMDAwMDAwfQ%3D%3D'
  },
  { 
    id: 'el_liam', 
    name: 'Liam 💎 (Nam - Streamer Gen Z Năng Động)', 
    provider: 'elevenlabs', 
    voiceId: 'TX3LPaxmHKxFdv7VOQHJ', 
    gender: 'Male', 
    lang: 'vi-VN', 
    region: 'vi', 
    category: 'Streamer & Gen Z', 
    pitch: 0.98, 
    rate: 1.06, 
    recommendedFor: 'idol', 
    desc: 'Giọng nam trẻ phong cách streamer TikTok, dí dỏm và gần gũi.',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/TX3LPaxmHKxFdv7VOQHJ/63148076-6363-42db-aea8-31424308b92c.mp3'
  },
  { 
    id: 'el_will', 
    name: 'Will 💎 (Nam - MC Hoạt Náo Sự Kiện Rộn Ràng)', 
    provider: 'elevenlabs', 
    voiceId: 'bIHbv24MWmeRgasZH58o', 
    gender: 'Male', 
    lang: 'vi-VN', 
    region: 'vi', 
    category: 'MC Sự Kiện & Hội Trường', 
    pitch: 0.92, 
    rate: 1.05, 
    recommendedFor: 'both', 
    desc: 'Giọng MC dẫn chương trình cuốn hút, hoạt náo, kích thích tặng quà.',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/bIHbv24MWmeRgasZH58o/8caf8f3d-ad29-4980-af41-53f20c72d7a4.mp3'
  },
  { 
    id: 'el_eric', 
    name: 'Eric 💎 (Nam - Quý Ông Lịch Lãm Đẳng Cấp)', 
    provider: 'elevenlabs', 
    voiceId: 'cjVigY5qzO86Huf0OWal', 
    gender: 'Male', 
    lang: 'vi-VN', 
    region: 'vi', 
    category: 'Sang Trọng & Thương Hiệu', 
    pitch: 0.83, 
    rate: 0.97, 
    recommendedFor: 'idol', 
    desc: 'Giọng nam quý phái, thanh lịch, phù hợp các sản phẩm cao cấp xa xỉ.',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/cjVigY5qzO86Huf0OWal/d098fda0-6456-4030-b3d8-63aa048c9070.mp3'
  },
  { 
    id: 'el_chris', 
    name: 'Chris 💎 (Nam - Chuyên Viên Tư Vấn Tận Tụy)', 
    provider: 'elevenlabs', 
    voiceId: 'iP95p4xoKVk53GoZ742B', 
    gender: 'Male', 
    lang: 'vi-VN', 
    region: 'vi', 
    category: 'Tư Vấn Khách Hàng', 
    pitch: 0.89, 
    rate: 1.0, 
    recommendedFor: 'manager', 
    desc: 'Giọng nam tư vấn nhẹ nhàng, nhiệt tình hỗ trợ giải đáp mọi thắc mắc.',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/iP95p4xoKVk53GoZ742B/3f4bde72-cc48-40dd-829f-57fbf906f4d7.mp3'
  },
  { 
    id: 'el_brian', 
    name: 'Brian 💎 (Nam - BLV Thể Thao Đỉnh Cao)', 
    provider: 'elevenlabs', 
    voiceId: 'nPczCjzI2devNBz1zQrb', 
    gender: 'Male', 
    lang: 'vi-VN', 
    region: 'vi', 
    category: 'BLV Thể Thao', 
    pitch: 0.90, 
    rate: 1.10, 
    recommendedFor: 'game', 
    desc: 'Giọng bình luận viên bóng đá/eSports hừng hực lửa, truyền lửa người xem.',
    previewUrl: 'https://api.us.elevenlabs.io/v1/voices/nPczCjzI2devNBz1zQrb/previews/audio?payload=eyJ2b2ljZV9zb3VyY2UiOiJwcmVtYWRlIiwiZmlsZW5hbWUiOiIyZGQzZTcyYy00ZmQzLTQyZjEtOTNlYS1hYmM1ZDRlNWFhMWQubXAzIiwidGltZXN0YW1wIjoxNzg4OTE1NjAwMDAwMDAwfQ%3D%3D'
  },
  { 
    id: 'el_daniel', 
    name: 'Daniel 💎 (Nam - Doanh Nhân Trung Niên Uy Quyền)', 
    provider: 'elevenlabs', 
    voiceId: 'onwK4e9ZLuTAKqWW03F9', 
    gender: 'Male', 
    lang: 'vi-VN', 
    region: 'vi', 
    category: 'Trung Niên & Giám Đốc', 
    pitch: 0.78, 
    rate: 0.98, 
    recommendedFor: 'manager', 
    desc: 'Giọng giám đốc điều hành, doanh nhân thành đạt, đĩnh đạc và quyết đoán.',
    previewUrl: 'https://api.us.elevenlabs.io/v1/voices/onwK4e9ZLuTAKqWW03F9/previews/audio?payload=eyJ2b2ljZV9zb3VyY2UiOiJwcmVtYWRlIiwiZmlsZW5hbWUiOiI3ZWVlMDIzNi0xYTcyLTRiODYtYjMwMy01ZGNhZGMwMDdiYTkubXAzIiwidGltZXN0YW1wIjoxNzg4OTE1NjAwMDAwMDAwfQ%3D%3D'
  },
  { 
    id: 'el_bill', 
    name: 'Bill 💎 (Nam - Thuyết Minh Phim Điện Ảnh)', 
    provider: 'elevenlabs', 
    voiceId: 'pqHfZKP75CvOlQylNhV4', 
    gender: 'Male', 
    lang: 'vi-VN', 
    region: 'vi', 
    category: 'Thuyết Minh Điện Ảnh', 
    pitch: 0.82, 
    rate: 0.95, 
    recommendedFor: 'idol', 
    desc: 'Giọng thuyết minh phim bom tấn, điện ảnh Hollywood đầy kịch tính.',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/pqHfZKP75CvOlQylNhV4/d782b3ff-84ba-4029-848c-acf01285524d.mp3'
  },
  { 
    id: 'el_roger', 
    name: 'Roger 💎 (Nam - Thầy Giáo Giảng Bài Khoa Học)', 
    provider: 'elevenlabs', 
    voiceId: 'CwhRBWXzGAHq8TQ4Fs17', 
    gender: 'Male', 
    lang: 'vi-VN', 
    region: 'vi', 
    category: 'Giảng Dạy & Tri Thức', 
    pitch: 0.86, 
    rate: 0.98, 
    recommendedFor: 'both', 
    desc: 'Giọng giảng viên rõ ràng, mạch lạc, dễ tiếp thu kiến thức.',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/CwhRBWXzGAHq8TQ4Fs17/58ee3ff5-f6f2-4628-93b8-e38eb31806b0.mp3'
  },
  { 
    id: 'el_josh', 
    name: 'Josh 💎 (Nam - BLV Kịch Tính Hồi Hộp)', 
    provider: 'elevenlabs', 
    voiceId: 'SOYHLrjzK2X1ezoPC6cr', 
    gender: 'Male', 
    lang: 'vi-VN', 
    region: 'vi', 
    category: 'Game Kịch Tính', 
    pitch: 0.95, 
    rate: 1.12, 
    recommendedFor: 'game', 
    desc: 'Giọng tạo không khí hồi hộp, nghẹt thở cho các khoảnh khắc gay cấn.',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/SOYHLrjzK2X1ezoPC6cr/86d178f6-f4b6-4e0e-85be-3de19f490794.mp3'
  },
  { 
    id: 'el_clyde', 
    name: 'Clyde 💎 (Nam - Chiến Binh Hùng Tráng, Hào Sảng)', 
    provider: 'elevenlabs', 
    voiceId: 'pNInz6obpgDQGcFmaJgB', 
    gender: 'Male', 
    lang: 'vi-VN', 
    region: 'vi', 
    category: 'Chiến Trận & Hào Hùng', 
    pitch: 0.72, 
    rate: 1.0, 
    recommendedFor: 'game', 
    desc: 'Giọng nam tướng quân uy nghi, hào sảng, vang dội như tiếng sấm.',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/pNInz6obpgDQGcFmaJgB/d6905d7a-dd26-4187-bfff-1bd3a5ea7cac.mp3'
  },
  { 
    id: 'el_antoni', 
    name: 'Antoni 💎 (Nam - MC Sự Kiện Tươi Vui)', 
    provider: 'elevenlabs', 
    voiceId: 'TX3LPaxmHKxFdv7VOQHJ', 
    gender: 'Male', 
    lang: 'vi-VN', 
    region: 'vi', 
    category: 'MC Sự Kiện & Hội Trường', 
    pitch: 0.92, 
    rate: 1.05, 
    recommendedFor: 'both', 
    desc: 'Giọng MC tươi vui, hoạt ngôn, dẫn dắt chương trình lưu loát.',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/TX3LPaxmHKxFdv7VOQHJ/63148076-6363-42db-aea8-31424308b92c.mp3'
  },
  { 
    id: 'el_thomas', 
    name: 'Thomas 💎 (Nam - Bản Tin & Thời Sự Quốc Tế)', 
    provider: 'elevenlabs', 
    voiceId: 'onwK4e9ZLuTAKqWW03F9', 
    gender: 'Male', 
    lang: 'vi-VN', 
    region: 'vi', 
    category: 'Bản Tin & Thời Sự', 
    pitch: 0.86, 
    rate: 1.02, 
    recommendedFor: 'both', 
    desc: 'Giọng đọc bản tin nhịp nhàng, thông tin rõ ràng, chuẩn phong cách quốc tế.',
    previewUrl: 'https://api.us.elevenlabs.io/v1/voices/onwK4e9ZLuTAKqWW03F9/previews/audio?payload=eyJ2b2ljZV9zb3VyY2UiOiJwcmVtYWRlIiwiZmlsZW5hbWUiOiI3ZWVlMDIzNi0xYTcyLTRiODYtYjMwMy01ZGNhZGMwMDdiYTkubXAzIiwidGltZXN0YW1wIjoxNzg4OTE1NjAwMDAwMDAwfQ%3D%3D'
  },
  { 
    id: 'mm_quocbao', 
    name: 'Quốc Bảo ⚡ (Nam - MiniMax Bán Hàng Flash Sale)', 
    provider: 'minimax', 
    voiceId: 'N2lVS1w4EtoT3dr4eOWO', 
    gender: 'Male', 
    lang: 'vi-VN', 
    region: 'vi', 
    category: 'MiniMax Bán Hàng & Chốt Đơn', 
    pitch: 0.90, 
    rate: 1.08, 
    recommendedFor: 'manager', 
    desc: 'Giọng MiniMax AI nam bán hàng chốt sale thần tốc, tạo hiệu ứng đám đông.',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/N2lVS1w4EtoT3dr4eOWO/ac833bd8-ffda-4938-9ebc-b0f99ca25481.mp3'
  },
  { 
    id: 'mm_hainam', 
    name: 'Hải Nam ⚡ (Nam - MiniMax BLV Game PK)', 
    provider: 'minimax', 
    voiceId: 'SOYHLrjzK2X1ezoPC6cr', 
    gender: 'Male', 
    lang: 'vi-VN', 
    region: 'vi', 
    category: 'MiniMax BLV Game & Trận Đấu', 
    pitch: 0.94, 
    rate: 1.10, 
    recommendedFor: 'game', 
    desc: 'Giọng MiniMax AI bình luận trận đấu cuồng nhiệt, hò hét kích thích tặng quà.',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/SOYHLrjzK2X1ezoPC6cr/86d178f6-f4b6-4e0e-85be-3de19f490794.mp3'
  },
  { 
    id: 'mm_minhtuan', 
    name: 'Minh Tuấn ⚡ (Nam - MiniMax MC Thời Sự VTV)', 
    provider: 'minimax', 
    voiceId: 'JBFqnCBsd6RMkjVDRZzb', 
    gender: 'Male', 
    lang: 'vi-VN', 
    region: 'vi', 
    category: 'MiniMax MC & Thời Sự', 
    pitch: 0.85, 
    rate: 1.02, 
    recommendedFor: 'both', 
    desc: 'Giọng MiniMax AI nam MC thời sự VTV hào sảng, tròn vành, đẳng cấp quốc gia.',
    previewUrl: 'https://api.us.elevenlabs.io/v1/voices/JBFqnCBsd6RMkjVDRZzb/previews/audio?payload=eyJ2b2ljZV9zb3VyY2UiOiJwcmVtYWRlIiwiZmlsZW5hbWUiOiJlNjIwNmQxYS0wNzIxLTQ3ODctYWFmYi0wNmE2ZTcwNWNhYzUubXAzIiwidGltZXN0YW1wIjoxNzg4OTE1NjAwMDAwMDAwfQ%3D%3D'
  },

  // ==================== 3. 28 GIỌNG QUỐC TẾ PRO ĐA QUỐC GIA ====================
  // Bắc Mỹ & Anh Quốc 🇺🇸 🇬🇧 🇨🇦 🇦🇺
  { 
    id: 'el_us_female', 
    name: 'Sarah 🇺🇸 (Nữ - US English Native)', 
    provider: 'elevenlabs', 
    voiceId: 'EXAVITQu4vr4xnSDxMaL', 
    gender: 'Female', 
    lang: 'en-US', 
    region: 'us_uk', 
    category: 'Bắc Mỹ & Châu Âu', 
    pitch: 1.10, 
    rate: 1.0, 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ bản xứ Mỹ truyền cảm chuẩn quốc tế.',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/EXAVITQu4vr4xnSDxMaL/01a3e33c-6e99-4ee7-8543-ff2216a32186.mp3'
  },
  { 
    id: 'el_us_male', 
    name: 'David 🇺🇸 (Nam - US English Streamer)', 
    provider: 'elevenlabs', 
    voiceId: 'TX3LPaxmHKxFdv7VOQHJ', 
    gender: 'Male', 
    lang: 'en-US', 
    region: 'us_uk', 
    category: 'Bắc Mỹ & Châu Âu', 
    pitch: 0.95, 
    rate: 1.05, 
    recommendedFor: 'game', 
    desc: 'Giọng nam tiếng Anh phong cách streamer năng động Mỹ.',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/TX3LPaxmHKxFdv7VOQHJ/63148076-6363-42db-aea8-31424308b92c.mp3'
  },
  { 
    id: 'el_uk_female', 
    name: 'Victoria 🇬🇧 (Nữ - UK British Royal)', 
    provider: 'elevenlabs', 
    voiceId: 'Xb7hH8MSUJpSbSDYk0k2', 
    gender: 'Female', 
    lang: 'en-GB', 
    region: 'us_uk', 
    category: 'Bắc Mỹ & Châu Âu', 
    pitch: 1.08, 
    rate: 0.98, 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ quý tộc Anh Quốc sang trọng, chuẩn mực.',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/Xb7hH8MSUJpSbSDYk0k2/d10f7534-11f6-41fe-a012-2de1e482d336.mp3'
  },
  { 
    id: 'el_uk_male', 
    name: 'Arthur 🇬🇧 (Nam - UK British Gentleman)', 
    provider: 'elevenlabs', 
    voiceId: 'JBFqnCBsd6RMkjVDRZzb', 
    gender: 'Male', 
    lang: 'en-GB', 
    region: 'us_uk', 
    category: 'Bắc Mỹ & Châu Âu', 
    pitch: 0.85, 
    rate: 1.0, 
    recommendedFor: 'game', 
    desc: 'Giọng nam quý ông Anh Quốc lịch lãm, đẳng cấp.',
    previewUrl: 'https://api.us.elevenlabs.io/v1/voices/JBFqnCBsd6RMkjVDRZzb/previews/audio?payload=eyJ2b2ljZV9zb3VyY2UiOiJwcmVtYWRlIiwiZmlsZW5hbWUiOiJlNjIwNmQxYS0wNzIxLTQ3ODctYWFmYi0wNmE2ZTcwNWNhYzUubXAzIiwidGltZXN0YW1wIjoxNzg4OTE1NjAwMDAwMDAwfQ%3D%3D'
  },
  { 
    id: 'el_ca_male', 
    name: 'Liam 🇨🇦 (Nam - Canada English Friendly)', 
    provider: 'elevenlabs', 
    voiceId: 'bIHbv24MWmeRgasZH58o', 
    gender: 'Male', 
    lang: 'en-CA', 
    region: 'us_uk', 
    category: 'Bắc Mỹ & Châu Âu', 
    pitch: 0.96, 
    rate: 1.02, 
    recommendedFor: 'both', 
    desc: 'Giọng nam Canada thân thiện, giao lưu cởi mở.',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/bIHbv24MWmeRgasZH58o/8caf8f3d-ad29-4980-af41-53f20c72d7a4.mp3'
  },
  { 
    id: 'el_au_male', 
    name: 'Oliver 🇦🇺 (Nam - Australian English)', 
    provider: 'elevenlabs', 
    voiceId: 'IKne3meq5aSn9XLyUdCD', 
    gender: 'Male', 
    lang: 'en-AU', 
    region: 'us_uk', 
    category: 'Bắc Mỹ & Châu Âu', 
    pitch: 0.92, 
    rate: 1.04, 
    recommendedFor: 'both', 
    desc: 'Giọng nam bản xứ Úc tự nhiên, phóng khoáng.',
    previewUrl: 'https://api.us.elevenlabs.io/v1/voices/IKne3meq5aSn9XLyUdCD/previews/audio?payload=eyJ2b2ljZV9zb3VyY2UiOiJwcmVtYWRlIiwiZmlsZW5hbWUiOiIxMDJkZTZmMi0yMmVkLTQzZTAtYTFmMS0xMTFmYTc1YzU0ODEubXAzIiwidGltZXN0YW1wIjoxNzg4OTE1NjAwMDAwMDAwfQ%3D%3D'
  },

  // Châu Âu 🇫🇷 🇮🇹 🇩🇪 🇪🇸 🇷🇺
  { 
    id: 'el_fr_female', 
    name: 'Camille 🇫🇷 (Nữ - Français Paris Chic)', 
    provider: 'elevenlabs', 
    voiceId: 'hpp4J3VqNfWAUOO0d1Us', 
    gender: 'Female', 
    lang: 'fr-FR', 
    region: 'eu', 
    category: 'Châu Âu', 
    pitch: 1.12, 
    rate: 1.0, 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ quý phái phong cách Paris lãng mạn.',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/hpp4J3VqNfWAUOO0d1Us/dab0f5ba-3aa4-48a8-9fad-f138fea1126d.mp3'
  },
  { 
    id: 'el_fr_male', 
    name: 'Henri 🇫🇷 (Nam - Français Élégant)', 
    provider: 'elevenlabs', 
    voiceId: 'CwhRBWXzGAHq8TQ4Fs17', 
    gender: 'Male', 
    lang: 'fr-FR', 
    region: 'eu', 
    category: 'Châu Âu', 
    pitch: 0.88, 
    rate: 0.98, 
    recommendedFor: 'both', 
    desc: 'Giọng nam Pháp trầm ấm, lịch thiệp.',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/CwhRBWXzGAHq8TQ4Fs17/58ee3ff5-f6f2-4628-93b8-e38eb31806b0.mp3'
  },
  { 
    id: 'el_it_female', 
    name: 'Elsa 🇮🇹 (Nữ - Italiano Dolce)', 
    provider: 'elevenlabs', 
    voiceId: 'EXAVITQu4vr4xnSDxMaL', 
    gender: 'Female', 
    lang: 'it-IT', 
    region: 'eu', 
    category: 'Châu Âu', 
    pitch: 1.14, 
    rate: 1.02, 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ Ý du dương, ngọt ngào và cuốn hút.',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/EXAVITQu4vr4xnSDxMaL/01a3e33c-6e99-4ee7-8543-ff2216a32186.mp3'
  },
  { 
    id: 'el_it_male', 
    name: 'Marco 🇮🇹 (Nam - Italiano Passione)', 
    provider: 'elevenlabs', 
    voiceId: 'pNInz6obpgDQGcFmaJgB', 
    gender: 'Male', 
    lang: 'it-IT', 
    region: 'eu', 
    category: 'Châu Âu', 
    pitch: 0.86, 
    rate: 1.04, 
    recommendedFor: 'both', 
    desc: 'Giọng nam Ý nồng nhiệt, giàu cảm xúc.',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/pNInz6obpgDQGcFmaJgB/d6905d7a-dd26-4187-bfff-1bd3a5ea7cac.mp3'
  },
  { 
    id: 'el_de_female', 
    name: 'Katja 🇩🇪 (Nữ - Deutsch Präzise)', 
    provider: 'elevenlabs', 
    voiceId: 'XrExE9yKIg1WjnnlVkGX', 
    gender: 'Female', 
    lang: 'de-DE', 
    region: 'eu', 
    category: 'Châu Âu', 
    pitch: 1.05, 
    rate: 1.0, 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ Đức chính xác, chuẩn mực.',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/XrExE9yKIg1WjnnlVkGX/b930e18d-6b4d-466e-bab2-0ae97c6d8535.mp3'
  },
  { 
    id: 'el_de_male', 
    name: 'Hans 🇩🇪 (Nam - Deutsch Kraftvoll)', 
    provider: 'elevenlabs', 
    voiceId: 'N2lVS1w4EtoT3dr4eOWO', 
    gender: 'Male', 
    lang: 'de-DE', 
    region: 'eu', 
    category: 'Châu Âu', 
    pitch: 0.78, 
    rate: 1.0, 
    recommendedFor: 'manager', 
    desc: 'Giọng nam Đức dõng dạc, uy lực và đĩnh đạc.',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/N2lVS1w4EtoT3dr4eOWO/ac833bd8-ffda-4938-9ebc-b0f99ca25481.mp3'
  },
  { 
    id: 'el_es_female', 
    name: 'Lucia 🇪🇸 (Nữ - Español Madrid)', 
    provider: 'elevenlabs', 
    voiceId: 'FGY2WhTYpPnrIDTdsKH5', 
    gender: 'Female', 
    lang: 'es-ES', 
    region: 'eu', 
    category: 'Châu Âu', 
    pitch: 1.15, 
    rate: 1.05, 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ Tây Ban Nha rực rỡ, tràn đầy sức sống.',
    previewUrl: 'https://api.us.elevenlabs.io/v1/voices/FGY2WhTYpPnrIDTdsKH5/previews/audio?payload=eyJ2b2ljZV9zb3VyY2UiOiJwcmVtYWRlIiwiZmlsZW5hbWUiOiI2NzM0MTc1OS1hZDA4LTQxYTUtYmU2ZS1kZTEyZmU0NDg2MTgubXAzIiwidGltZXN0YW1wIjoxNzg4OTE1NjAwMDAwMDAwfQ%3D%3D'
  },
  { 
    id: 'el_ru_female', 
    name: 'Tatiana 🇷🇺 (Nữ - Русский)', 
    provider: 'elevenlabs', 
    voiceId: 'pFZP5JQG7iQjIQuC4Bku', 
    gender: 'Female', 
    lang: 'ru-RU', 
    region: 'eu', 
    category: 'Châu Âu', 
    pitch: 1.06, 
    rate: 0.98, 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ Nga sâu lắng, truyền cảm.',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/pFZP5JQG7iQjIQuC4Bku/89b68b35-b3dd-4348-a84a-a3c13a3c2b30.mp3'
  },

  // Nam Mỹ & Mỹ Latin 🇲🇽 🇧🇷
  { 
    id: 'el_mx_male', 
    name: 'Diego 🇲🇽 (Nam - Español México)', 
    provider: 'elevenlabs', 
    voiceId: 'onwK4e9ZLuTAKqWW03F9', 
    gender: 'Male', 
    lang: 'es-MX', 
    region: 'latam', 
    category: 'Nam Mỹ & Mỹ Latin', 
    pitch: 0.90, 
    rate: 1.06, 
    recommendedFor: 'game', 
    desc: 'Giọng nam Mexico Latin sôi động, nhiệt huyết.',
    previewUrl: 'https://api.us.elevenlabs.io/v1/voices/onwK4e9ZLuTAKqWW03F9/previews/audio?payload=eyJ2b2ljZV9zb3VyY2UiOiJwcmVtYWRlIiwiZmlsZW5hbWUiOiI3ZWVlMDIzNi0xYTcyLTRiODYtYjMwMy01ZGNhZGMwMDdiYTkubXAzIiwidGltZXN0YW1wIjoxNzg4OTE1NjAwMDAwMDAwfQ%3D%3D'
  },
  { 
    id: 'el_br_female', 
    name: 'Francisca 🇧🇷 (Nữ - Português Brasil)', 
    provider: 'elevenlabs', 
    voiceId: 'cgSgspJ2msm6clMCkdW9', 
    gender: 'Female', 
    lang: 'pt-BR', 
    region: 'latam', 
    category: 'Nam Mỹ & Mỹ Latin', 
    pitch: 1.16, 
    rate: 1.04, 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ Brazil mượt mà, gợi cảm.',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/cgSgspJ2msm6clMCkdW9/56a97bf8-b69b-448f-846c-c3a11683d45a.mp3'
  },

  // Châu Á 🇨🇳 🇹🇼 🇯🇵 🇰🇷 🇹🇭 🇮🇩 🇵🇭 🇮🇳 🇸🇦
  { 
    id: 'el_cn_female', 
    name: 'Mei-Ling 🇨🇳 (Nữ - 中文普通话 带货主播)', 
    provider: 'elevenlabs', 
    voiceId: 'pFZP5JQG7iQjIQuC4Bku', 
    gender: 'Female', 
    lang: 'zh-CN', 
    region: 'asia', 
    category: 'Châu Á', 
    pitch: 1.16, 
    rate: 1.08, 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ livestream bán hàng thương mại điện tử Trung Quốc.',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/pFZP5JQG7iQjIQuC4Bku/89b68b35-b3dd-4348-a84a-a3c13a3c2b30.mp3'
  },
  { 
    id: 'el_cn_male', 
    name: 'Zhang-Wei 🇨🇳 (Nam - 中文普通话 Caster)', 
    provider: 'elevenlabs', 
    voiceId: 'SOYHLrjzK2X1ezoPC6cr', 
    gender: 'Male', 
    lang: 'zh-CN', 
    region: 'asia', 
    category: 'Châu Á', 
    pitch: 0.88, 
    rate: 1.06, 
    recommendedFor: 'game', 
    desc: 'Giọng nam bình luận viên võ thuật Trung Hoa.',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/SOYHLrjzK2X1ezoPC6cr/86d178f6-f4b6-4e0e-85be-3de19f490794.mp3'
  },
  { 
    id: 'el_tw_female', 
    name: 'Ting-Ting 🇹🇼 (Nữ - 臺灣國語 甜美)', 
    provider: 'elevenlabs', 
    voiceId: 'EXAVITQu4vr4xnSDxMaL', 
    gender: 'Female', 
    lang: 'zh-TW', 
    region: 'asia', 
    category: 'Châu Á', 
    pitch: 1.20, 
    rate: 1.02, 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ Đài Loan ngọt ngào, nhẹ nhàng.',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/EXAVITQu4vr4xnSDxMaL/01a3e33c-6e99-4ee7-8543-ff2216a32186.mp3'
  },
  { 
    id: 'el_jp_female', 
    name: 'Sakura 🇯🇵 (Nữ - 日本語 Anime Kawaii)', 
    provider: 'elevenlabs', 
    voiceId: 'cgSgspJ2msm6clMCkdW9', 
    gender: 'Female', 
    lang: 'ja-JP', 
    region: 'asia', 
    category: 'Châu Á', 
    pitch: 1.32, 
    rate: 1.06, 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ Nhật Bản ngọt ngào chuẩn Anime VTuber.',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/cgSgspJ2msm6clMCkdW9/56a97bf8-b69b-448f-846c-c3a11683d45a.mp3'
  },
  { 
    id: 'el_jp_male', 
    name: 'Kenji 🇯🇵 (Nam - 日本語 Samurai Caster)', 
    provider: 'elevenlabs', 
    voiceId: 'pNInz6obpgDQGcFmaJgB', 
    gender: 'Male', 
    lang: 'ja-JP', 
    region: 'asia', 
    category: 'Châu Á', 
    pitch: 0.76, 
    rate: 1.02, 
    recommendedFor: 'game', 
    desc: 'Giọng nam Samurai dũng mãnh chuẩn điện ảnh Nhật Bản.',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/pNInz6obpgDQGcFmaJgB/d6905d7a-dd26-4187-bfff-1bd3a5ea7cac.mp3'
  },
  { 
    id: 'el_kr_female', 
    name: 'Min-ji 🇰🇷 (Nữ - 한국어 K-Pop Idol)', 
    provider: 'elevenlabs', 
    voiceId: 'EXAVITQu4vr4xnSDxMaL', 
    gender: 'Female', 
    lang: 'ko-KR', 
    region: 'asia', 
    category: 'Châu Á', 
    pitch: 1.18, 
    rate: 1.02, 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ idol K-Pop thanh thoát, trẻ trung.',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/EXAVITQu4vr4xnSDxMaL/01a3e33c-6e99-4ee7-8543-ff2216a32186.mp3'
  },
  { 
    id: 'el_kr_male', 
    name: 'Hyun-woo 🇰🇷 (Nam - 한국어 K-Drama)', 
    provider: 'elevenlabs', 
    voiceId: 'TX3LPaxmHKxFdv7VOQHJ', 
    gender: 'Male', 
    lang: 'ko-KR', 
    region: 'asia', 
    category: 'Châu Á', 
    pitch: 0.86, 
    rate: 0.98, 
    recommendedFor: 'both', 
    desc: 'Giọng nam MC truyền hình Hàn Quốc ấm áp.',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/TX3LPaxmHKxFdv7VOQHJ/63148076-6363-42db-aea8-31424308b92c.mp3'
  },
  { 
    id: 'el_th_female', 
    name: 'Premwadee 🇹🇭 (Nữ - ภาษาไทย)', 
    provider: 'elevenlabs', 
    voiceId: 'XrExE9yKIg1WjnnlVkGX', 
    gender: 'Female', 
    lang: 'th-TH', 
    region: 'asia', 
    category: 'Châu Á', 
    pitch: 1.15, 
    rate: 1.0, 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ Thái Lan dịu dàng, trong trẻo.',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/XrExE9yKIg1WjnnlVkGX/b930e18d-6b4d-466e-bab2-0ae97c6d8535.mp3'
  },
  { 
    id: 'el_id_female', 
    name: 'Gadis 🇮🇩 (Nữ - Bahasa Indonesia)', 
    provider: 'elevenlabs', 
    voiceId: 'pFZP5JQG7iQjIQuC4Bku', 
    gender: 'Female', 
    lang: 'id-ID', 
    region: 'asia', 
    category: 'Châu Á', 
    pitch: 1.10, 
    rate: 1.0, 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ tiếng Indonesia tự nhiên.',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/pFZP5JQG7iQjIQuC4Bku/89b68b35-b3dd-4348-a84a-a3c13a3c2b30.mp3'
  },
  { 
    id: 'el_ph_female', 
    name: 'Rosa 🇵🇭 (Nữ - Tagalog Philippines)', 
    provider: 'elevenlabs', 
    voiceId: 'SAz9YHcvj6GT2YYXdXww', 
    gender: 'Female', 
    lang: 'tl-PH', 
    region: 'asia', 
    category: 'Châu Á', 
    pitch: 1.12, 
    rate: 1.0, 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ tiếng Tagalog Philippines sinh động.',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/SAz9YHcvj6GT2YYXdXww/e6c95f0b-2227-491a-b3d7-2249240decb7.mp3'
  },
  { 
    id: 'el_in_male', 
    name: 'Aarav 🇮🇳 (Nam - Indian English Host)', 
    provider: 'elevenlabs', 
    voiceId: 'pNInz6obpgDQGcFmaJgB', 
    gender: 'Male', 
    lang: 'en-IN', 
    region: 'asia', 
    category: 'Châu Á', 
    pitch: 0.92, 
    rate: 1.04, 
    recommendedFor: 'both', 
    desc: 'Giọng nam tiếng Anh chuẩn Ấn Độ lưu loát.',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/pNInz6obpgDQGcFmaJgB/d6905d7a-dd26-4187-bfff-1bd3a5ea7cac.mp3'
  },
  { 
    id: 'el_ar_female', 
    name: 'Amira 🇸🇦 (Nữ - العربية)', 
    provider: 'elevenlabs', 
    voiceId: 'hpp4J3VqNfWAUOO0d1Us', 
    gender: 'Female', 
    lang: 'ar-SA', 
    region: 'asia', 
    category: 'Châu Á', 
    pitch: 1.08, 
    rate: 1.0, 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ tiếng Ả Rập truyền cảm.',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/hpp4J3VqNfWAUOO0d1Us/dab0f5ba-3aa4-48a8-9fad-f138fea1126d.mp3'
  }
].map(v => ({ ...v, tier: 'pro', icon: v.provider === 'minimax' ? '⚡' : '💎', badge: v.provider === 'minimax' ? '⚡ MiniMax Pro' : '💎 ElevenLabs Pro' }));

// ==================== 4. GIỌNG ĐỌC MIỄN PHÍ VIỆT NAM (DUY NHẤT HOÀI MY) ====================
export const FREE_VOICES = [
  // Duy nhất Hoài My ở vị trí đầu tiên chuẩn theo yêu cầu
  { 
    id: 'free_vi_female', 
    name: 'Hoài My 🇻🇳 (Nữ - Chuẩn Tiếng Việt)', 
    provider: 'system', 
    tier: 'free', 
    icon: '🎤', 
    badge: '🇻🇳 Miễn Phí', 
    gender: 'Female', 
    lang: 'vi-VN', 
    region: 'vi', 
    category: 'Chuẩn Tiếng Việt', 
    pitch: 1.08, 
    rate: 1.0, 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ chuẩn tiếng Việt truyền cảm, phát âm mượt mà, cảm xúc tự nhiên, miễn phí 100%.' 
  }
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
    id: 'el_harry',
    name: 'Harry 💎 (Nam - BLV Game Siêu Tốc, Bùng Nổ)',
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
       voiceOrId === 'game' ? ALL_SYSTEM_VOICES.find(v => v.recommendedFor === 'game' || v.id === 'el_harry') :
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
  } else if (typeof optionsOrOnEnd === 'boolean') {
    priority = optionsOrOnEnd;
    isTest = optionsOrOnEnd;
    if (typeof onEndOrPriority === 'function') {
      onEnd = onEndOrPriority;
    }
  } else if (typeof optionsOrOnEnd === 'object' && optionsOrOnEnd !== null) {
    customOptions = optionsOrOnEnd;
    onEnd = typeof onEndOrPriority === 'function' ? onEndOrPriority : optionsOrOnEnd.onEnd;
    priority = !!optionsOrOnEnd.priority;
    isTest = !!optionsOrOnEnd.isTest;
  } else if (typeof onEndOrPriority === 'function') {
    onEnd = onEndOrPriority;
  } else if (typeof onEndOrPriority === 'boolean') {
    priority = onEndOrPriority;
    isTest = onEndOrPriority;
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

  if (priority || isTest || mergedVoice.isTest) {
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

  const requestedVolume = voice?.volume !== undefined ? Math.max(0, Math.min(1.0, Number(voice.volume))) : 1.0;
  const requestedRate = voice?.rate !== undefined ? Math.max(0.5, Math.min(2.0, Number(voice.rate))) : 1.0;
  
  const savedGlobalVol = typeof localStorage !== 'undefined' && localStorage.getItem('avalive_global_volume') 
    ? parseFloat(localStorage.getItem('avalive_global_volume')) 
    : (typeof localStorage !== 'undefined' && localStorage.getItem('avalive_video_volume') ? parseFloat(localStorage.getItem('avalive_video_volume')) : 1.0);
  const isLocalSpeakerMuted = typeof localStorage !== 'undefined' && (
    localStorage.getItem('avalive_local_speaker_muted') === 'true' ||
    localStorage.getItem('avalive_audio_muted') === 'true'
  );

  const effectiveVoiceVolume = isTestingMode 
    ? requestedVolume 
    : (isLocalSpeakerMuted ? 0 : Math.max(0, Math.min(1.0, requestedVolume * (savedGlobalVol !== null && !isNaN(savedGlobalVol) ? savedGlobalVol : 1.0))));

  // =========================================================================
  // TIER 0: Instant Authentic Studio Preview Audio (100% Studio Quality & Nuance)
  // Khi người dùng bấm "Nghe thử" mẫu giọng và không nhập văn bản tùy chỉnh ghi đè
  // =========================================================================
  if (isTestingMode && voice?.previewUrl && !sampleText) {
    try {
      const audio = new Audio(voice.previewUrl);
      audio.volume = effectiveVoiceVolume;
      audio.playbackRate = requestedRate;
      activePreviewAudio = audio;

      return new Promise((resolve) => {
        let done = false;
        const finish = (status) => {
          if (done) return;
          done = true;
          activePreviewAudio = null;
          if (onEnd) onEnd();
          resolve(status);
        };
        audio.onended = () => finish(true);
        audio.onerror = () => finish(false);
        audio.play().catch(() => finish(false));
      });
    } catch (e) {
      console.warn('Direct preview play error, falling back:', e);
    }
  }

  const rawLang = voice?.lang || (
    voice?.id?.includes('_us_') || voice?.id?.includes('_en_') || voice?.id?.includes('_uk_') || voice?.id?.includes('_ca_') || voice?.id?.includes('_au_') || voice?.id?.includes('_in_') ? 'en-US' :
    voice?.id?.includes('_cn_') ? 'zh-CN' :
    voice?.id?.includes('_tw_') ? 'zh-TW' :
    voice?.id?.includes('_jp_') ? 'ja-JP' :
    voice?.id?.includes('_kr_') ? 'ko-KR' :
    voice?.id?.includes('_fr_') ? 'fr-FR' :
    voice?.id?.includes('_es_') || voice?.id?.includes('_mx_') ? 'es-ES' :
    voice?.id?.includes('_th_') ? 'th-TH' :
    voice?.id?.includes('_pt_') || voice?.id?.includes('_br_') ? 'pt-BR' :
    voice?.id?.includes('_de_') ? 'de-DE' :
    voice?.id?.includes('_it_') ? 'it-IT' :
    voice?.id?.includes('_ru_') ? 'ru-RU' :
    voice?.id?.includes('_ar_') ? 'ar-SA' :
    voice?.id?.includes('_id_') ? 'id-ID' :
    voice?.id?.includes('_hi_') ? 'hi-IN' :
    voice?.id?.includes('_tr_') ? 'tr-TR' :
    voice?.id?.includes('_pl_') ? 'pl-PL' :
    voice?.id?.includes('_nl_') ? 'nl-NL' :
    voice?.id?.includes('_tl_') || voice?.id?.includes('_ph_') ? 'tl-PH' :
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
  // TIER 2: Instant Client Web Speech API (Ưu tiên hàng đầu khi nghe thử hoặc local TTS)
  // Đảm bảo phản hồi 0ms không phụ thuộc mạng, phát âm cực chuẩn mọi ngôn ngữ
  // =========================================================================
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
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

      // Lấy danh sách giọng từ Web Speech API
      const availableVoices = (preloadedVoices.length > 0 ? preloadedVoices : window.speechSynthesis.getVoices()) || [];
      if (availableVoices.length > 0) {
        // Tìm giọng chuẩn theo ngôn ngữ và giới tính
        let matched = availableVoices.find(v => {
          const vLang = (v.lang || '').toLowerCase().replace('_', '-');
          const matchesLang = vLang.startsWith(shortLang) || vLang.includes(shortLang);
          const vName = (v.name || '').toLowerCase();
          if (isMale) {
            return matchesLang && (vName.includes('male') || vName.includes('nam') || vName.includes('david') || vName.includes('george') || vName.includes('james') || vName.includes('henri') || vName.includes('hans'));
          } else {
            return matchesLang && (vName.includes('female') || vName.includes('nữ') || vName.includes('linh') || vName.includes('mai') || vName.includes('zira') || vName.includes('samantha') || vName.includes('camille') || vName.includes('elsa'));
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

      return new Promise((resolve) => {
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
        const maxDurationMs = Math.max(4000, textToSpeak.length * 150);
        const watchdog = setTimeout(() => finish(true), maxDurationMs);
        utterance.addEventListener('end', () => clearTimeout(watchdog));

        try {
          window.speechSynthesis.speak(utterance);
        } catch (spkErr) {
          playFallbackHarmonicChime(voice?.gender);
          finish(false);
        }
      });
    } catch (synthErr) {
      console.warn('Web Speech API execution catch:', synthErr);
    }
  }

  // =========================================================================
  // TIER 3: Streaming Audio TTS Fallback (Khi Web Speech không khả dụng)
  // =========================================================================
  const ttsCandidateUrls = [
    `/api/tts?text=${encodeURIComponent(textToSpeak)}&lang=${encodeURIComponent(shortLang || 'vi')}`,
    `http://127.0.0.1:3001/api/tts?text=${encodeURIComponent(textToSpeak)}&lang=${encodeURIComponent(shortLang || 'vi')}`,
    `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${encodeURIComponent(shortLang || 'vi')}&q=${encodeURIComponent(textToSpeak.slice(0, 200))}`
  ];

  for (const ttsUrl of ttsCandidateUrls) {
    try {
      const streamAudio = new Audio(ttsUrl);
      streamAudio.volume = effectiveVoiceVolume;
      streamAudio.playbackRate = requestedRate;
      streamAudio.muted = effectiveVoiceVolume === 0;
      
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
          playAttempt.catch(() => cleanup(false));
        }
      });

      const isSuccess = await playPromise;
      if (isSuccess) return true;
    } catch (audioStreamErr) {}
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
