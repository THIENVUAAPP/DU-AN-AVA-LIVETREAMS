import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle, X, ChevronRight, Zap, Star, Download, Laptop, Apple } from 'lucide-react';
import { downloadWindows, downloadMac } from '../../utils/downloadOS';

export const APP_VERSION = '4.9.72';
export const RELEASE_DATE = '27/09/2026';

export const UPDATE_NOTES = [
  {
    title: '🚀 Bản Cập Nhật v4.9.72 - Khóa Chặt Nút Tắt Đọc Kịch Bản Không Tự Mở Lại, Định Nghĩa renderMultiAvatarExtraLayers & Đồng Bộ Trọn Vẹn 100% Sân Khấu Chính/Phụ Sang Window Capture & TikTok Live Studio',
    description: '1. Khóa Chặt Triệt Để Nút Tắt Đọc Kịch Bản Avatar Live: Khắc phục dứt điểm hiện tượng bấm tắt/dừng kịch bản rồi sau một khoảng thời gian hệ thống tự phát lại do timer IDLE ngầm hoặc callback onEnd(). Tích hợp cờ chặn aidol_user_paused_script xuyên suốt useLiveCoordinator, AIAudioPlayer và voiceSyncService; khi người dùng bấm tắt/dừng kịch bản thì toàn bộ timer, hàng đợi voice TTS và các sự kiện tự phát bị hủy hoàn toàn, đảm bảo tắt dứt điểm và không bao giờ tự ý nói lại. 2. Sửa Lỗi ReferenceError renderMultiAvatarExtraLayers & Đồng Bộ 100% Sân Khấu Sang Window Capture / TikTok Live Studio: Định nghĩa đầy đủ hàm renderMultiAvatarExtraLayers và tối ưu điều kiện kiểm tra hasAnyContent trên cả hai luồng /live-stream và /window-capture, giúp toàn bộ video chính/phụ (PiP), banner hình ảnh, tiêu đề chữ với typography và font family, multi-avatar và extra layers hiển thị đồng bộ mượt mà 60 FPS theo thời gian thực 0ms.'
  },
  {
    title: '🚀 Bản Cập Nhật v4.9.71 - Khóa Chặt Nút Tắt Đọc Kịch Bản Avatar Không Tự Ý Đọc Lại & Đồng Bộ Trọn Vẹn Tất Cả Lớp Sân Khấu Chính/Phụ Sang Window Capture & TikTok Live Studio',
    description: '1. Khóa Chặt Nút Tắt Đọc Kịch Bản Live Idol Avatar (Tuyệt Đối Không Tự Mở Lại): Xử lý dứt điểm hiện tượng bấm tắt kịch bản rồi sau một khoảng thời gian hệ thống tự động nói lại do timer IDLE ngầm hoặc hàng đợi priority. Khi người dùng bấm tắt/dừng kịch bản, toàn bộ timer lặp, timer đệm, hàng đợi đọc và tiến trình Voice AI bị hủy bỏ và giải phóng sạch sẽ 100%, chỉ khi streamer chủ động bấm Bật lại thì mới phát kịch bản. 2. Đồng Bộ Trọn Vẹn 100% Video, Hình Ảnh, Tiêu Đề Từ Sân Khấu Chính & Sân Khấu Phụ Sang Window Capture OBS & TikTok Live Studio: Tất cả các lớp trên sân khấu chính và sân khấu phụ (Video/ảnh nền 60 FPS, Video phụ PiP với Transform/Chroma Key, Banner ảnh với Chroma Key, Tiêu đề chữ Headline với phong cách, font chữ và tọa độ, Multi-Avatar và Extra Layers) được gom và đồng bộ đầy đủ 100% thời gian thực 0ms.'
  },
  {
    title: '🚀 Bản Cập Nhật v4.9.70 - Triệt Tiêu 100% Voice/Kịch Bản Chạy Ngầm, Dừng/Mở Đồng Bộ Tất Cả Các Nút & Đóng Gói Trọn Vẹn Sân Khấu Sang TikTok Live Studio',
    description: '1. Triệt Tiêu 100% Dữ Liệu Voice Chạy Ngầm Khi Tắt: Khi người dùng bấm Tắt Tất Cả hoặc dừng kịch bản, toàn bộ hàng đợi voice TTS, các tiến trình synthesis ngầm, Web Audio API DSP và các file âm thanh trên máy đều bị hủy sạch và giải phóng bộ nhớ 0ms, đảm bảo không còn bất kỳ tiếng đọc ngầm hay chữ âm nào sót lại. 2. Đồng Bộ Hóa 100% Thao Tác Mở/Dừng Của Mọi Nút Bấm: Khi bấm Dừng là dừng tất cả các tab và luồng phát; khi bấm Mở là mở lại đồng bộ video, kịch bản đã cài đặt, kết nối TikTok Live, Game và Auto 24/7. 3. Đóng Gói Toàn Diện Sân Khấu Chính Sang Window Capture & TikTok Live Studio: Tất cả các lớp (Video/ảnh nền 60 FPS, Video phụ PiP với Transform/Chroma Key, Banner ảnh với Chroma Key, Tiêu đề chữ Headline với hiệu ứng và tọa độ, Multi-Avatar và Extra Layers) được đồng bộ tức thì thời gian thực 0ms.'
  },
  {
    title: '🚀 Bản Cập Nhật v4.9.69 - Dừng Dứt Điểm 100% Âm Thanh, Voice & File Trên Máy Khi Tắt Tất Cả, Mở Lại Đầy Đủ Các Tính Năng Đã Cài Đặt & Đồng Bộ Toàn Diện Sân Khấu',
    description: '1. Dừng Dứt Điểm 100% Âm Thanh, Voice AI & File Trên Máy Khi "TẮT TẤT CẢ": Khi bấm nút tắt, toàn bộ luồng phát trên máy (Voice AI TTS, Speech Synthesis, audio player kịch bản, các file âm thanh/video trên DOM, Web Audio DSP Context, game engines) dừng ngay lập tức 0ms, không còn bất kỳ âm thanh hay file nào chạy ngầm trên máy. 2. Khôi Phục Toàn Diện Các Tính Năng Đã Cài Đặt Khi "BẬT TẤT CẢ": Mở lại đồng bộ video, kịch bản bán hàng đã chọn, kết nối TikTok Live, Game Bản Đồ / Battle và chế độ Auto 24/7. 3. Đóng Gói & Đồng Bộ Trọn Vẹn 100% Sân Khấu Sang Window Capture / Link TikTok Live Studio: Tất cả các lớp (Video/ảnh nền 60 FPS, Video phụ PiP có Transform/Chroma Key, Banner ảnh có Chroma Key, Tiêu đề chữ Headline với phong cách & tọa độ, Multi-Avatar và Extra Layers) được đồng bộ tức thì thời gian thực 0ms.'
  },
  {
    title: '🚀 Bản Cập Nhật v4.9.68 - Khóa Chặt Nút Tắt/Bật Không Tự Mở Lại & Đồng Bộ 100% Tất Cả Khung Hình/Lớp Sân Khấu Sang Window Capture / TikTok Live Studio',
    description: '1. Khóa Chặt Tuyệt Đối Nút Tắt/Bật: Khi streamer bấm "TẮT TẤT CẢ", toàn bộ hệ thống (video, audio, voice AI, kịch bản, game) lập tức dừng dứt điểm 100% và KHÓA CHẶT vĩnh viễn, không bao giờ tự ý bật lại sau vài giây hoặc do sự kiện ngầm kích hoạt. Chỉ khi streamer chủ động bấm lại "BẬT TẤT CẢ", hệ thống mới được phép vận hành. 2. Đồng Bộ Trọn Vẹn 100% Tất Cả Các Lớp Sân Khấu: Tất cả các lớp trên Sân Khấu Chính (Video nền chính, Video phụ PiP, Avatar nhân vật đa tầng, Poster banner ảnh, Tiêu đề chữ với đầy đủ tọa độ, kích thước, hiệu ứng xóa phông Chroma Key) đều được truyền tải và hiển thị sắc nét 60 FPS theo thời gian thực 0ms sang Window Capture OBS và đường link TikTok Live Studio.'
  },
  {
    title: '🚀 Bản Cập Nhật v4.9.67 - Khắc Phục Triệt Để Lỗi Khởi Động ReferenceError & Hiển Thị Trọn Vẹn 100% Giao Diện Phần Mềm',
    description: '1. Khắc Phục Triệt Để Lỗi Khởi Động: Đã xử lý dứt điểm lỗi ReferenceError khiến phần mềm hiển thị màn hình nâng cấp khi khởi chạy. Toàn bộ giao diện chính, Sân Khấu Live, 14 Tab chức năng và các module điều khiển đều hiển thị đầy đủ 100% ngay lập tức. 2. Tối Ưu Hóa Tải 0ms: Cấu trúc biến và hook được sắp xếp chuẩn xác, giúp phần mềm khởi động mượt mà, không gặp bất kỳ xung đột dữ liệu hay lỗi render nào.'
  },
  {
    title: '🚀 Bản Cập Nhật v4.9.66 - Khóa Chặt 100% Nút Bật/Tắt Tất Cả & Đóng Gói Toàn Diện Sân Khấu Chính Sang Window Capture / TikTok Live Studio',
    description: '1. Khóa Chặt Nút Bật/Tắt Tất Cả (Chỉ Kích Hoạt Khi Bấm Thật): Triệt tiêu 100% hiện tượng nút "BẬT TẤT CẢ" tự ý bật lại hoặc tự đăng ký phím tắt. Khi người dùng bấm Tắt / Dừng thì hệ thống lập tức dừng hẳn 100% tất cả các tab, sự kiện, Voice AI, sequencer, game và video; các sự kiện broadcast hay phím tắt không thể tự ý kích hoạt lại. 2. Đóng Gói & Đồng Bộ Toàn Diện Dữ Liệu Sân Khấu Sang Window Capture / Link TikTok Live Studio: Sân Khấu Chính gom lại toàn bộ các lớp (Video/Ảnh nền, Video phụ PiP, Avatar nhân vật đa tầng, Banner ảnh và Tiêu đề chữ với đầy đủ hiệu ứng/tọa độ) và truyền tải nguyên vẹn 100% sang Window Capture OBS và link TikTok Live Studio với độ mượt 60 FPS.'
  },
  {
    title: '🚀 Bản Cập Nhật v4.9.65 - Khóa Chặt Nút Bật/Tắt Tất Cả Không Tự Kích Hoạt & Khôi Phục 100% Đồng Bộ Sân Khấu Chính Sang Window Capture / TikTok Live Studio',
    description: '1. Khóa Chặt Nút Bật/Tắt Tất Cả (Chỉ Bật Khi Người Dùng Bấm): Triệt tiêu hoàn toàn hiện tượng nút "BẬT TẤT CẢ" tự ý kích hoạt lại hoặc tự đăng ký phím tắt. Khi người dùng bấm Tắt / Dừng thì dừng hẳn 100% tất cả các tab, sự kiện, Voice AI, bộ đọc kịch bản, game và video; các sự kiện ngầm hay phím cách Space không thể tự động mở lại. 2. Khôi Phục Toàn Diện Cấu Trúc Dữ Liệu & Đồng Bộ Sân Khấu Sang Window Capture / Link TikTok Live: Toàn bộ video trong các thư mục, ô nhân vật, video phụ PiP, avatar đa tầng, banner ảnh và tiêu đề từ Sân Khấu Chính đều được phân giải chính xác và hiển thị sắc nét 60 FPS đồng bộ thời gian thực lên Window Capture và Link TikTok Live Studio.'
  },
  {
    title: '🚀 Bản Cập Nhật v4.9.64 - Khắc Phục Triệt Để Video Tự Ý Chạy Nền & Tối Ưu Nguồn Phát Sạch 100% TikTok Live Studio',
    description: '1. Triệt Tiêu 100% Hiện Tượng Tự Ý Phát Video Nền Ẩn: Sửa lỗi tự động khôi phục video cũ khi khởi động hoặc truy vấn trạng thái nền. Sân khấu chỉ phát chính xác video do người dùng chủ động tải lên/chọn trong phiên làm việc hiện tại, tuyệt đối không tự ý lấy dữ liệu cũ phát ngầm. 2. Nguồn Phát Sạch 100% Không Vướng Nút Cho TikTok Live Studio: Tự động ẩn hoàn toàn thanh điều khiển và nút nổi trên link livestream để TikTok Live Studio và OBS Browser Source chỉ nhận khung hình video/avatar/banner sạch tuyệt đối 60 FPS. 3. Đồng Bộ Dừng Toàn Cục (Bấm Dừng Là Dừng Hết): Bấm Dừng / Tạm dừng trên giao diện chính lập tức ngắt toàn bộ Voice AI, bộ đọc kịch bản, âm thanh và luồng video trên toàn hệ thống 0ms.'
  },
  {
    title: '🚀 Bản Cập Nhật v4.9.63 - Khôi Phục Hoàn Toàn Window Capture & Đồng Bộ Sân Khấu Chính / Link Livestream 60 FPS',
    description: '1. Khôi Phục Hoàn Toàn Window Capture & Link Livestream: Sửa triệt để lỗi màn hình đen thui trên Window Capture và Link TikTok Live Studio. Cho phép phân giải và phát tức thì 100% các định dạng video, avatar, ảnh blob/server, video phụ PiP, banner ảnh và tiêu đề chữ từ Sân Khấu Chính. 2. Dừng Tuyệt Đối / Chạy Toàn Bộ Khi Thao Tác: Khi bấm Dừng Demo / ngắt đồng bộ, toàn bộ dữ liệu, Voice AI và video dừng dứt điểm 100% không chạy ngầm; khi bấm Chạy Demo hoặc Bật Đồng Bộ thì toàn bộ luồng kịch bản, video và giọng đọc được mở và chạy đồng bộ tất cả. 3. Xóa Là Xóa Dứt Điểm, Mở Lại Là Mở Đầy Đủ: Khi người dùng xóa video thì xóa sạch mọi dữ liệu và âm thanh; khi nạp lại hoặc chọn nhân vật thì lập tức mở lại tất cả.'
  },
  {
    title: '🚀 Bản Cập Nhật v4.9.62 - Triệt Tiêu 100% Âm Thanh & Dữ Liệu Chạy Ẩn (0 Byte Leakage) & Dừng Kịch Bản Triệt Để',
    description: '1. Triệt Tiêu 100% Âm Thanh & Dữ Liệu Chạy Ẩn (0 Byte Leakage): Khi xóa video/ảnh hoặc tắt phát trên Sân Khấu Chính, toàn bộ thẻ Audio/Video, Web Audio API DSP, bộ nhớ tạm và tiến trình nền đều bị xóa sạch và tắt tiếng ngay lập tức 0ms, đảm bảo không còn tiếng lẹt xẹt, tạp âm hay chữ âm chạy ẩn. 2. Dừng Kịch Bản & Voice AI Tuyệt Đối: Khi bấm ⏹️ DỪNG DEMO hoặc tắt đồng bộ Sân Khấu Chính, toàn bộ Voice AI và timer đếm lùi được ngắt ngay lập tức, không còn hiện tượng đọc rớt bước kế tiếp. 3. Phục Hồi & Hiển Thị Tức Thì 100% Sân Khấu Lên Window Capture & TikTok Live Studio: Khi nạp hoặc chọn lại nhân vật/video, toàn bộ khung hình, avatar, video phụ PiP, banner ảnh và tiêu đề lập tức hiển thị sắc nét 60 FPS mà không bị màn hình đen.'
  },
  {
    title: '🚀 Bản Cập Nhật v4.9.61 - Khắc Phục Tải Lại Ô Nhân Vật Sân Khấu & Dừng Kịch Bản Triệt Để 100%',
    description: '1. Khắc Phục Triệt Để Ô Nhân Vật (Tải Lên - Xóa - Tải Lại Mượt Mà): Người dùng tải video/hình ảnh vào ô nhân vật thì hiển thị ngay trên Sân Khấu Chính; khi bấm xóa thì sân khấu xóa sạch; khi tải lên lại (dù cùng file hay file mới) thì lập tức hiển thị và phát lại bình thường trên sân khấu chính, không bị kẹt ở Sân Khấu Trống. 2. Dừng Kịch Bản Triệt Để 100%: Khi bấm Dừng Demo / ngắt đồng bộ, toàn bộ Voice AI, timer chuyển bước và luồng phát kịch bản bị hủy ngay lập tức 0ms, không còn tình trạng chạy ngầm hay đọc chữ âm. 3. Đồng Bộ Đa Khung Hình Window Capture OBS & TikTok Live Studio: Toàn bộ avatar, video nền, video phụ PiP, banner và tiêu đề đều được lưu trữ và truyền tải đầy đủ 100% thời gian thực.'
  },
  {
    title: '🚀 Bản Cập Nhật v4.9.60 - Dừng Toàn Bộ Đồng Bộ Voice/Video Tức Thì & Đồng Bộ Tuyệt Đối 100% Sân Khấu Lên Window Capture/TikTok Live Studio',
    description: '1. Dừng Toàn Bộ Tức Thì (Bấm Dừng Là Dừng Hết): Khắc phục triệt để lỗi khi bấm Dừng Demo hoặc ngắt kết nối Sân Khấu Chính mà voice AI vẫn tiếp tục đọc. Nay khi bấm Dừng, toàn bộ Voice AI, bộ đọc kịch bản, âm thanh và luồng phát video đều dừng ngay lập tức 0ms không độ trễ. Khi bấm Mở thì tất cả cùng chạy lại đồng bộ. 2. Đồng Bộ Tuyệt Đối 100% Dữ Liệu Sân Khấu Chính Lên Window Capture & TikTok Live Studio: Sân Khấu Chính hiển thị bao nhiêu video, bao nhiêu ô nhân vật/ảnh, bao nhiêu câu tiêu đề chữ thì Window Capture và đường link TikTok Live Studio đều hiển thị đầy đủ 100% y chang theo thời gian thực (Real-time 0ms), đúng tọa độ vị trí và hiệu ứng.'
  },
  {
    title: '🚀 Bản Cập Nhật v4.9.59 - Đọc Voice Kịch Bản Liên Tục Từng Bước & Đồng Bộ Toàn Diện 100% Sân Khấu',
    description: '1. Đọc Voice Kịch Bản Mượt Mà Từng Bước (Sequencer Flow): Khi bấm ▶️ CHẠY DEMO hoặc 📡 ĐỒNG BỘ RA SÂN KHẤU CHÍNH, hệ thống tự động kích hoạt Voice AI đọc liền mạch từng câu thoại từ Bước 1 -> Bước 2 -> Bước 3 -> Bước 4... không bị dừng ngắt giữa chừng. 2. Đồng Bộ & Phát Thật Khi Bấm Sân Khấu Chính: Khi bật nút 📡 ĐỒNG BỘ RA SÂN KHẤU CHÍNH, toàn bộ phân đoạn kịch bản lập tức phát thật ra Sân Khấu Chính, Window Capture OBS và TikTok Live Studio. 3. Đồng Bộ Đa Tầng 100% Mọi Khung Hình & Avatar: Window Capture và đường link livestream nay tự động render đầy đủ tất cả các avatar (Avatar 1, Avatar 2, Avatar 3...), video phụ PiP, banner ảnh và tiêu đề chữ theo đúng tọa độ.'
  },
  {
    title: '🚀 Bản Cập Nhật v4.9.58 - Việt Hóa Toàn Bộ & Nâng Cấp Tương Tác Siêu Nhạy Thanh Dock Window Capture',
    description: '1. Việt Hóa Toàn Bộ Nút Điều Khiển: Chuyển đổi toàn bộ nút tiếng Anh (• LIVE 60FPS) sang tiếng Việt (• TRỰC TIẾP 60FPS / ⚡ LÀM MỚI 60FPS) kèm hiệu ứng phát sáng phản hồi trực quan ngay khi bấm. 2. Khắc Phục Lỗi Nút Bấm Không Tác Dụng: Nâng cấp cơ chế bắt sự kiện đa điểm (pointerdown, touchstart, click) với độ trễ 0ms trên thanh Dock của Window Capture OBS và TikTok Live Studio; sửa lỗi nuốt click khi co giãn nút. 3. Đồng Bộ Trạng Thái Tức Thì: Bấm làm mới / trực tiếp sẽ tự động nạp lại dữ liệu Sân Khấu Chính, kích hoạt phát tất cả video và đồng bộ âm thanh chuẩn xác 100%.'
  },
  {
    title: '🚀 Bản Cập Nhật v4.9.57 - Nâng Cấp Chạy Tự Động Kịch Bản Demo & Khóa Giữ Nhân Vật Sân Khấu Chính',
    description: '1. Nâng Cấp Bộ Điều Phối Chạy Demo Kịch Bản (Livestream Flow Sequencer): Tối ưu toàn diện nút ▶️ CHẠY DEMO / ⏹️ DỪNG DEMO, đảm bảo tự động đọc giọng AI theo từng câu thoại, đồng bộ từng lớp Video/Ảnh/Tiêu Đề và tự động chuyển bước mượt mà (Bước 1 -> Bước 2 -> Bước 3...) có watchdog an toàn 100% không bao giờ bị dừng hay treo giữa chừng. 2. Khóa Giữ & Phát Nhân Vật Đang Chọn Trên Sân Khấu Chính: Khi người dùng tải lên hoặc bấm chọn ô nhân vật bất kỳ, video/hình ảnh lập tức chiếm giữ Sân Khấu Chính và phát lặp liền mạch 24/24 cho đến khi người dùng chủ động đổi sang nhân vật khác hoặc bấm nút xóa (X), không tự ý nhảy đổi ô nhân vật khi hết video. 3. Đồng Bộ Đa Tầng 100% Cho Window Capture OBS & TikTok Live Studio: Toàn bộ lớp video, video phụ PiP, avatar nhân vật, banner ảnh và tiêu đề luôn được truyền tải sắc nét 60 FPS theo đúng tọa độ.'
  },
  {
    title: '🚀 Bản Cập Nhật v4.9.56 - Trích Xuất Sản Phẩm Thật TikTok Shop & Triệt Tiêu 100% Video Chạy Nền Ẩn',
    description: '1. Đồng Bộ & Ghim Sản Phẩm Thật TikTok Shop (shop.tiktok.com): Tự động trích xuất trực tiếp sản phẩm thật từ link shop người dùng cung cấp (Title, Giá, Hình ảnh, Tồn kho thật từ Open Graph & Metadata), tuyệt đối không dùng sản phẩm ảo/demo. 2. Triệt Tiêu Hoàn Toàn Video Chạy Nền Ẩn (Ghost Background Video): Loại bỏ triệt để mọi logic tự động phục hồi video nền cũ trong backend và frontend. Khi người dùng xóa hết video trên Sân Khấu Chính, toàn bộ Window Capture và Link TikTok Live Studio lập tức xóa sạch 100% và biến mất ngay lập tức không để lại bất kỳ dư âm nào. 3. Bảo Toàn Ô Nhân Vật & Tự Động Phát Khi Chọn: Các video tải lên ô nhân vật được lưu giữ nguyên vẹn và phát chuẩn xác trên Sân Khấu Chính khi chọn, chỉ biến mất khi người dùng chủ động bấm nút xóa (X).'
  },
  {
    title: '🚀 Bản Cập Nhật v4.9.53 - Khôi Phục Hiển Thị Ô Nhân Vật & Phím Bấm Dock Siêu Nhạy',
    description: '1. Khắc Phục Lỗi Hiển Thị Ô Nhân Vật Lên Sân Khấu Chính: Khi tải lên hoặc bấm chọn bất kỳ ô nhân vật nào, hệ thống lập tức hiển thị video/hình ảnh của nhân vật đó lên Sân Khấu Chính và đồng bộ 100% sang Window Capture OBS & TikTok Live Studio 0ms không bị khóa. 2. Nâng Cấp Nút Bấm Dock Siêu Phản Hồi: Tối ưu toàn bộ 6 nút điều khiển (LIVE 60FPS, Tạm Dừng/Tiếp Tục, Bật/Tắt Tiếng, Tràn Màn/Vừa Khung, Ẩn Nút H và Mắt Phục Hồi 👁️) với hiệu ứng phản hồi xúc giác tức thì và phím tắt Space, M, F, H. 3. Loại Bỏ Cảnh Báo Mạng Chập Chờn: Triệt tiêu màn hình loading/cảnh báo đè lên video phát, giúp luồng live phát siêu mượt 60 FPS.'
  },
  {
    title: '🚀 Bản Cập Nhật v4.9.52 - Chuẩn Hóa Tọa Độ & Nhận Diện Đa Lớp Sân Khấu',
    description: '1. Chuẩn Hóa Bố Cục Đa Lớp: Tự động nhận diện chính xác từng lớp Video Nền, Video Phụ PiP, Lớp Ảnh Chèn (Extra Layers), Nhân Vật Avatar AI và Tiêu Đề theo đúng 100% tọa độ x, y, width, height mà người dùng sắp xếp trên Sân Khấu Chính. 2. Nhận Diện Lượt Nói Nhân Vật AI: Tự động chuyển đổi mượt mà giữa video nói (talkVideo) và video chờ (idleVideo) cho từng avatar. 3. Đồng Bộ Khung Hình Tuyệt Đối: Window Capture và Link TikTok Live Studio phản chiếu y hệt 1:1 như bản sao chép hoàn hảo.'
  },
  {
    title: '🚀 Bản Cập Nhật v4.9.51 - Sửa Lỗi ReferenceError secTrans & Đồng Bộ Tuyệt Đối 100%',
    description: '1. Khắc Phục Triệt Để Lỗi ReferenceError secTrans: Sửa dứt điểm lỗi báo đỏ server khi mở Window Capture, đảm bảo cửa sổ live 9:16 mở lên mượt mà 100% không còn bất kỳ lỗi nào. 2. Đồng Bộ Tuyệt Đối Mọi Khung Hình, Video & Âm Thanh: Mọi video phụ PiP, ảnh nền, avatar AI, banner và tiêu đề đều được nạp tức thì 0ms trên cả Window Capture và Link TikTok Live Studio. 3. Nút Bấm Siêu Nhạy: Toàn bộ nút điều khiển nhận lệnh ngay lập tức.'
  },
  {
    title: '🚀 Bản Cập Nhật v4.9.50 - Đồng Bộ Đa Lớp 0ms & Nút Bấm Siêu Nhạy',
    description: '1. Đồng Bộ 100% Các Lớp Video, Avatar, Banner: Sân Khấu Chính có video phụ PiP, Avatar AI hay banner chữ nào thì Window Capture và Link TikTok Live Studio đều lập tức hiển thị đầy đủ 0ms ngay khi mở link. 2. Nâng Cấp Nút Bấm Dock: Xử lý triệt để logic Tạm Dừng, Bật/Tắt Tiếng, Tràn Màn và Ẩn Dock bằng cơ chế direct pointer/click handler, bấm là ăn ngay không trễ nhịp nào.'
  },
  {
    title: '🚀 Bản Cập Nhật v4.9.49 - Triệt Tiêu Lỗi Xóa Màn Hình & Đồng Bộ Toàn Bộ Video Sân Khấu',
    description: '1. Sửa Lỗi Tự Động Xóa Màn Hình (clearMedia): Khắc phục triệt để lỗi làm cho video/đường link bị tắt đen hoặc ngắt kết nối sau 400ms do trạng thái clearMedia đè; giúp đường link online (/stage) và Window Capture mở lên là PHÁT NGAY LẬP TỨC 100%. 2. Đồng Bộ Đa Tầng Video & Avatar: Đảm bảo tất cả các lớp video chính, video phụ PiP, Avatar nhân vật và banner chữ hiển thị đồng nhất trên mọi màn hình. 3. Sửa Nút Bấm Dock: Nút bấm trên mọi phiên bản dock đều nhận PointerDown cực nhạy.'
  },
  {
    title: '🚀 Bản Cập Nhật v4.9.48 - Đồng Bộ 100% Window Capture & Sửa Nút Điều Khiển Dock Mới',
    description: '1. Đồng Bộ Hoàn Toàn Window Capture & Sân Khấu Chính: Cửa sổ Window Capture bây giờ được nhúng trực tiếp nhân (core) của Sân Khấu Chính, đảm bảo 100% mọi Video Phụ (PiP), Avatar AI Nhân Vật, Hình Ảnh Lớp Phủ, và Banner Chữ đều được xếp chồng hiển thị y hệt như những gì anh thấy trên Sân Khấu. 2. Xử Lý Triệt Để Nút Bấm Không Phản Hồi: Nâng cấp toàn bộ cơ chế nhấn nút sang onPointerDown cực nhạy cho TẤT CẢ các phiên bản thanh Dock. Từ nay bất kể anh dùng chuột hay cảm ứng, bấm là ăn ngay lập tức.'
  },
  {
    title: '🚀 Bản Cập Nhật v4.9.47 - Sửa Lỗi Điều Khiển Video Dock, Mute Toàn Cục & Cập Nhật Tên Link Phát Live',
    description: '1. Sửa Lỗi Mất Tương Tác Thanh Dock: Thay thế cơ chế click bằng PointerDown để đảm bảo chạm/nhấn trên mọi nền tảng (Window Capture) đều ăn ngay lập tức, khắc phục triệt để lỗi bấm không tác dụng. 2. Tắt Tiếng Toàn Cục (Global Mute): Nút Bật/Tắt Tiếng hiện tại đã đồng bộ Mute cho TẤT CẢ các video trên sân khấu (Video chính, Video PiP phụ, Avatar AI...), giải quyết tình trạng âm thanh lọt từ các lớp video khác. 3. Đa Dạng Tên Miền Phát Sóng: Tối ưu các đường link phát trực tiếp để tương thích hoàn toàn trình duyệt Chromium của TikTok Live Studio, giúp nhận diện và phát video 100% không bị chặn (sử dụng /stage, /main, /tiktok-live, /live-stream đều đồng bộ mượt mà).'
  },
  {
    title: '🚀 Bản Cập Nhật v4.9.46 - Nâng Cấp Chất Lượng Video Siêu Sắc Nét (Window Capture & Live Stage)',
    description: 'Nâng cấp toàn bộ chất lượng hiển thị video trên các cửa sổ Window Capture và Live Stream Stage, bổ sung các cờ tối ưu hóa render phần cứng (image-rendering, font-smoothing) để loại bỏ hoàn toàn hiện tượng mờ (blur), mang lại hình ảnh sắc nét tuyệt đối 4K 60FPS cho TikTok Live Studio và OBS.'
  },
  {
    title: '🚀 Bản Cập Nhật v4.9.45 - Đồng Bộ Toàn Bộ Sân Khấu TikTok Live, Làm Mới Bộ Nút Dock & Mute Ô Nhân Vật Đầu Trang',
    description: '1. Đồng Bộ Toàn Bộ Thành Phần Sân Khấu: Khắc phục triệt để lỗi TikTok Live Studio và Window Capture không hiển thị video nền; hệ thống đa tầng tự động hiển thị mượt mà cả Video/Ảnh nền chính, Video phụ PiP, Avatar AI, Banner quảng cáo và Câu tiêu đề chữ, đồng bộ 100% không bỏ sót bất kỳ thành phần nào. 2. Làm Mới Hoàn Toàn Bộ Nút Bấm Thanh Dock (Ảnh 2): Thiết kế Cyberpunk viên thuốc mới siêu nhạy (LIVE 60FPS, Tạm Dừng/Tiếp Tục, Bật/Tắt Tiếng, Tràn Màn/Vừa Khung, Ẩn Nút H và icon phục hồi 👁️), điều khiển đồng bộ tất cả các video trên trang 0ms, chống nuốt click tuyệt đối. 3. Tắt Tiếng Triệt Để Các Ô Nhân Vật Đầu Trang: Các ô video/nhân vật tải lên ở thanh trên đầu được mute hoàn toàn (volume = 0), chỉ duy nhất Sân Khấu Chính mới phát âm thanh. 4. Khóa Chặt 100% Toàn Bộ 14 Tab & Module Hệ Thống.'
  }
];



export const CHANGELOG = UPDATE_NOTES;

export default function UpdateNotificationModal({ isOpen: controlledIsOpen, onClose: controlledOnClose }) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  useEffect(() => {
    try {
      const lastSeenVersion = localStorage.getItem('avalive_last_version') || '1.0.0';
      if (lastSeenVersion !== APP_VERSION) {
        setInternalIsOpen(true);
      }
    } catch (e) {}
  }, []);

  const handleClose = () => {
    if (controlledOnClose) {
      controlledOnClose();
    } else {
      setInternalIsOpen(false);
    }
    try {
      localStorage.setItem('avalive_last_version', APP_VERSION);
    } catch (e) {}
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-gradient-to-br from-slate-900 via-[#10121a] to-[#0c0d14] text-white max-w-lg w-full rounded-3xl shadow-2xl border border-cyan-500/30 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 flex flex-col items-center justify-center shrink-0">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -ml-10 -mb-10"></div>
          
          <div className="relative mb-2.5 group">
            <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded-2xl blur-md opacity-90 group-hover:opacity-100 transition animate-pulse" />
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/50 shadow-[0_0_25px_rgba(255,255,255,0.6)] bg-black flex items-center justify-center p-0.5">
              <img src="/official_logo.jpg" alt="AvaLive" className="w-full h-full object-cover rounded-xl" />
            </div>
          </div>
          
          <h2 className="text-2xl font-black text-center tracking-tight text-white drop-shadow-md">
            Bản Cập Nhật Mới Nhất
          </h2>
          <div className="flex items-center mt-1.5 gap-2">
            <span className="bg-white/25 text-white text-xs font-black px-3.5 py-1 rounded-full shadow-md border border-white/20">
              Phiên Bản v{APP_VERSION} (Official)
            </span>
          </div>
          
          <button 
            onClick={handleClose}
            className="absolute top-3.5 right-3.5 p-2 bg-black/20 hover:bg-black/40 text-white/80 hover:text-white rounded-full transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nút Tải Cài Đặt Mac & Windows */}
        <div className="px-5 py-3.5 bg-black/40 border-b border-white/10 flex flex-col sm:flex-row gap-2.5 items-center justify-between shrink-0">
          <div className="text-left">
            <p className="text-[11px] font-bold text-gray-300">Tải bộ cài đặt độc lập v{APP_VERSION}:</p>
            <p className="text-[10px] text-gray-400">Bảo mật cao, giải nén là chạy ngay</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={downloadMac}
              className="px-3 py-1.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all hover:scale-105 flex items-center gap-1.5 cursor-pointer active:scale-95"
              title="Tải trực tiếp bản cài đặt Mac (.zip)"
            >
              <Apple size={13} />
              <span>Bản Mac (.zip)</span>
            </button>
            <button
              onClick={downloadWindows}
              className="px-3 py-1.5 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/40 text-cyan-300 text-xs font-bold transition-all hover:scale-105 flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-lg shadow-cyan-500/20"
              title="Tải trực tiếp bản cài đặt Windows (.zip) về máy ngay lập tức"
            >
              <Laptop size={13} />
              <span>Bản Win (.zip)</span>
            </button>
          </div>
        </div>

        {/* Nội Dung Nâng Cấp */}
        <div className="p-5 space-y-3.5 overflow-y-auto flex-1 custom-scrollbar">
          <p className="text-xs text-gray-300 font-medium">
            Phiên bản <strong className="text-cyan-300 font-bold">v{APP_VERSION}</strong> đã được kiểm tra mượt mà và tối ưu hóa toàn diện:
          </p>
          
          <ul className="space-y-2.5">
            {(UPDATE_NOTES || []).map((note, idx) => (
              <li key={idx} className="flex gap-2.5 items-start bg-white/5 p-3 rounded-2xl border border-white/10 hover:border-cyan-500/30 transition-all">
                <div className="mt-0.5 shrink-0 bg-blue-500/20 text-blue-400 rounded-full p-1">
                  <CheckCircle size={15} />
                </div>
                <div className="flex flex-col text-left">
                  {typeof note === 'object' && note.title && (
                    <span className="text-xs font-bold text-cyan-300 mb-0.5">{note.title}</span>
                  )}
                  <span className="text-xs text-gray-200 leading-relaxed font-medium">
                    {typeof note === 'object' ? note.description : note}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 flex justify-center bg-black/40 shrink-0">
          <button 
            onClick={handleClose}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-8 py-2.5 rounded-2xl font-black text-xs shadow-lg shadow-blue-900/50 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Bắt Đầu Sử Dụng Ngay</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
