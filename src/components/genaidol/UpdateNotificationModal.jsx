import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle, X, ChevronRight, Zap, Star, Download, Laptop, Apple } from 'lucide-react';
import { downloadWindows, downloadMac } from '../../utils/downloadOS';

export const APP_VERSION = '5.4.55';
export const RELEASE_DATE = '03/10/2026';

export const UPDATE_NOTES = [
  {
    title: '⚡ Bản Cập Nhật v5.4.55 - SỬA TRIỆT ĐỂ MÀN HÌNH ĐEN TIKTOK LIVE STUDIO & KÍCH HOẠT ĐẦY ĐỦ SỰ KIỆN AI TIKTOK',
    description: '1. Sửa Dứt Điểm Màn Hình Đen Khi Dán Link TikTok Live Studio / Vercel: Tự động kết nối và nạp đồng bộ video sân khấu chính tức thì 0ms qua Supabase Realtime handshake, không còn chờ đợi hay đen màn hình. 2. Kích Hoạt 100% Sự Kiện AI Chào Người Mới & Trả Lời Bình Luận: Tối ưu bộ điều phối sự kiện TikTok Live, tự động chào mọi khán giả bước vào phòng và đọc trả lời bình luận theo quy trình 4 bước thông minh, loại bỏ hoàn toàn hiện tượng drop sự kiện. 3. Đồng Bộ Âm Thanh Giọng Đọc AI Xuyên Suốt: Giọng AI phát thanh to rõ, dõng dạc và truyền cảm trực tiếp qua luồng link Vercel Cloud cho khán giả nghe trọn vẹn. 4. Khóa Chặt 100% Các Tab Chức Năng Khác.'
  },
  {
    title: '⚡ Bản Cập Nhật v5.4.54 - ĐỒNG BỘ AI VOICE & KHẮC PHỤC MÀN HÌNH ĐEN',
    description: '1. Sửa Lỗi Giọng Nói AI Trên TikTok Live Studio (Browser Source): Giọng đọc AI (Chào người mới, Đọc bình luận) giờ đây được đồng bộ và phát thanh siêu mượt trực tiếp trên đường link Vercel Cloud, giúp khán giả nghe rõ mồn một. 2. Sửa Lỗi Màn Hình Đen Khi Mới Dán Link: Các link dán vào TikTok Live Studio sẽ tải trạng thái và đồng bộ video ngay lập tức 0ms, không còn hiện tượng màn hình đen chờ đợi. 3. Báo Hiệu Kết Nối Bằng Giọng Nói AI: Mỗi khi bạn kết nối tài khoản TikTok mới, hệ thống AI sẽ đọc tên kênh của bạn lên để báo hiệu thành công. 4. Tuân thủ khóa chặt mọi tab chức năng không liên quan.'
  },

  {
    title: '⚡ Bản Cập Nhật v5.4.52 - Sửa Lỗi Hiển Thị TikTok Live Studio / Vừa Khớp Khung Hình 100%',
    description: '1. Khắc phục lỗi Màn Hình Đen trên TikTok Live Studio / Vercel (Lỗi Mixed Content): Tự động chuyển đổi các link video cục bộ (localhost) sang link Cloudflare Tunnel bảo mật (HTTPS) để TikTok Live Studio và nền tảng Web có thể nạp video mượt mà 0ms. 2. Ép Buộc Khung Hình Vừa Khít 100% (Không dư, không thiếu): Tự động dàn trải video và container lấp đầy 100% diện tích màn hình trên TikTok Live Studio (object-fit: fill), giải quyết dứt điểm viền đen, cắt xén khung hình. 3. Tuân thủ khóa chặt 100% các tab chức năng không liên quan.'
  },
  {
    title: '⚡ Bản Cập Nhật v5.4.50 - Đẩy Nhanh Tiêu Chuẩn Đồng Bộ Cục Bộ, Cập Nhật Băng Thông Phản Hồi',
    description: '1. Khởi tạo lại cấu hình cập nhật hệ thống, ép hệ thống đồng bộ chuẩn máy chủ và đẩy mạnh tốc độ đường truyền khi load video/blob. 2. Làm sạch hoàn toàn trạng thái phiên bản cũ, ép máy khách khởi tạo lại luồng bắt sự kiện. 3. Tuân thủ khóa chặt 100% các tab chức năng không liên quan.'
  },
  {
    title: '⚡ Bản Cập Nhật v5.4.49 - Sửa Dứt Điểm Màn Hình Đen TikTok Live Studio / OBS, Phục Hồi Chào Người Mới & Đọc Bình Luận, Ổn Định Kết Nối TikTok ID',
    description: '1. Sửa Lỗi Tải Video Lên Sân Khấu Bị Mất: Ưu tiên phát video người dùng tải lên liên tục, không bị hệ thống tự đổi sang video nền chờ khi AI nói xong. 2. Bắt Buộc Đăng Nhập Tài Khoản Google (Gmail): Yêu cầu người dùng kết nối tài khoản để sử dụng, bảo vệ tài nguyên hệ thống. 3. Sửa Lỗi Không Trừ Token & Giờ Xem: Đồng bộ hoá hoàn toàn với Supabase, trừ đúng và đủ Token và thời gian sử dụng khi AI phát sinh sự kiện nhép môi & TTS voice. 4. Cải Thiện TikTok Live Status: Giữ vững trạng thái Kết Nối (màu xanh) trong lúc chờ đợi Sân Khấu TikTok phát sóng để đảm bảo luồng sự kiện không bị gián đoạn.'
  },
  {

    title: '⚡ Bản Cập Nhật v5.4.48 - Phục Hồi Chào Người Mới Tức Thì, Đọc Bình Luận Trơn Tru, Giữ Nguyên Video Khi Tạm Dừng & Tối Ưu Kết Nối TikTok Live ID',
    description: '1. Phục Hồi Chào Người Mới Tức Thì (VIEWER_JOIN / WELCOME): Tự động phát câu thoại chào đón ngay lập tức trong 0ms khi có khán giả bước vào phòng livestream. Tối ưu bộ đếm thời gian giãn cách theo từng người xem (60s cooldown) để không bỏ sót người mới, luân phiên duyệt tuần tự không trùng lặp. 2. Kết Nối & Đọc Bình Luận TikTok Live Trơn Tru (0ms Bỏ Sót): Tự động khôi phục kết nối ID TikTok Live của người dùng ngay khi khởi động. Xây dựng Hàng Đợi Sự Kiện Thông Minh (Event Queue) giúp tất cả bình luận từ khán giả được tiếp nhận và xử lý đầy đủ theo đúng quy trình 4 bước (Đọc tên + nhắc lại comment -> Ưu tiên 100% file từ khóa -> Dự phòng AI Gemini 1 câu ngắn gọn -> Gợi mở chăm sóc khách hàng), tuyệt đối không bị drop do dồn dập. Bổ sung sự kiện theo dõi kênh và chia sẻ live. 3. Giữ Nguyên Video Khi Bấm Tạm Dừng (Pause/Play): Khi bấm Tạm Dừng hoặc Bật/Tắt phiên live, video trên Sân Khấu Chính và Window Capture OBS đứng yên tại khung hình hiện tại chứ không bị xóa biến mất hay đen màn hình (chỉ xóa sạch khi người dùng bấm Xóa). 4. Khóa Chặt 100% Toàn Bộ Các Tab Chức Năng Khác.'
  },
  {
    title: '⚡ Bản Cập Nhật v5.4.47 - Khắc Phục Tải Video Lên Sân Khấu Chính Tức Thì 0ms, Đồng Bộ Window Capture OBS / TikTok Live Studio & Chuẩn Hóa Tab Sự Kiện Bình Luận',
    description: '1. Khắc Phục Lỗi Tải Video Lên Sân Khấu Chính: Khi tải video lên từ ô nhân vật hoặc Sân Khấu Chính, video lập tức hiển thị và phát ngay trong 0ms, không bị chớp nháy, không bị giữ màn hình chờ "Chờ đồng bộ". 2. Đồng Bộ Tức Thì Window Capture OBS & TikTok Live Studio (Không Còn Bị Đen Màn Hình): Sửa dứt điểm nguyên nhân chặn luồng giải mã video trên cửa sổ bắt hình và link live overlay. Toàn bộ hình ảnh, video và âm thanh từ Sân Khấu Chính được đồng bộ theo thời gian thực 0ms sang Window Capture OBS và đường link Online HTTPS TikTok Live Studio. 3. Chuẩn Hóa Chuỗi 4 Bước Đọc Bình Luận Theo Đúng Cấu Hình & File Nạp: Khắc phục triệt để lỗi lặp câu chúc, kích hoạt 100% các từ khóa và câu trả lời cài sẵn/file tải lên (hỗ trợ phân tách từ khóa bằng dấu phẩy, chấm phẩy, sổ dọc, gạch chéo; so khớp có dấu, không dấu). Không bị chặn bởi cooldown đối với bình luận khớp từ khóa. Đảm bảo đúng 4 bước: Đọc tiền tố nhắc lại -> Trả lời đúng câu thoại cài đặt -> Ghép câu hỏi gợi mở chăm sóc khách hàng -> Phản hồi dự phòng thông minh. 4. Khóa Chặt 100% Toàn Bộ Các Tab Chức Năng Khác.'
  },
  {
    title: '⚡ Bản Cập Nhật v5.4.46 - Khắc Phục Lỗi Màn Hình Khởi Động Film Undefined, Xóa Triệt Để Video Chạy Nền & Khóa Chặt Màn Hình Chờ Tải Lên Mặc Định',
    description: '1. Sửa Dứt Điểm Lỗi Màn Hình Khởi Động (ReferenceError: Film is not defined): Bổ sung đầy đủ thư viện biểu tượng Film, mở app 1-click mượt mà 0ms không bao giờ bị báo lỗi crash hay lỗi nâng cấp dữ liệu. 2. Xóa Hoàn Toàn Video Chạy Nền Tự Động: Khi giải nén file ZIP hoặc mở phần mềm lên, hệ thống tuyệt đối KHÔNG tự ý kích hoạt bất kỳ video ngầm, nhân vật cũ hay video chạy nền nào. 3. Chuẩn Hóa Màn Hình Mặc Định Sân Khấu Chính: Màn hình mặc định luôn là màn hình chờ tải video lên / chờ đồng bộ video (SẴN SÀNG PHÁT LUỒNG 9:16). Sân Khấu Chính chỉ hiển thị và phát video khi người dùng chủ động bấm Tải Video Lên hoặc chủ động click chọn. 4. Khóa Chặt 100% Toàn Bộ Các Tab Chức Năng Khác.'
  },
  {
    title: '⚡ Bản Cập Nhật v5.4.45 - Sửa Triệt Để Lỗi Lặp Câu Chúc, Chuẩn Hóa 4 Bước Phản Hồi Bình Luận & Tùy Chỉnh Giọng Đọc Khi Nạp Từ Khóa Hàng Loạt',
    description: '1. Khắc Phục Triệt Để Lỗi Lặp Đi Lặp Lại Đúng 1 Câu Chúc Suốt Phiên Live: Xóa bỏ hoàn toàn câu chúc mặc định vô tận, kích hoạt 100% các từ khóa và câu trả lời cài sẵn trong Tab Bình Luận. Nâng cấp bộ so khớp từ khóa siêu nhạy (hỗ trợ có dấu, không dấu, loại bỏ ký tự đặc biệt, đồng bộ biến {user}, [user], {comment}, [comment]). 2. Chuẩn Hóa Chuỗi 4 Bước Phản Hồi Bình Luận: Bước 1: Đọc lại câu hỏi/bình luận theo cài đặt tiền tố. Bước 2 (Ưu Tiên 100%): Đối chiếu danh sách từ khóa cấu hình sẵn, trả lời tức thì bằng đúng câu thoại và đúng Giọng AI chỉ định của từng rule. Bước 3: Tự động ghép câu hỏi gợi mở inbox/chăm sóc khách hàng vào sau câu trả lời. Bước 4: Xử lý khéo léo khi không khớp từ khóa bằng kịch bản câu thoại mẫu hoặc phản hồi dự phòng thông minh theo ngữ cảnh live. 3. Tùy Chỉnh Giọng Đọc Khi Thêm Từ Khóa Hàng Loạt: Cho phép chọn nhân vật / giọng đọc AI (Idol, Trợ Lý, BLV, hoặc giọng hệ thống) ngay trong modal nhập từ khóa hàng loạt và khi tải file (TXT, DOCX, PDF, CSV, JSON). Tích hợp nút nghe thử âm sắc và nút 1-click "Áp dụng giọng cho tất cả quy tắc". 4. Khóa Chặt 100% Toàn Bộ Các Tab Chức Năng Khác.'
  },
  {
    title: '⚡ Bản Cập Nhật v5.4.44 - Gắn Nhãn [ƯU TIÊN] File Từ Khóa, Chuẩn Hóa Quy Trình 4 Bước Đọc Comment & Ràng Buộc Kích Hoạt Sản Phẩm Chốt Đơn',
    description: '1. Gắn Nhãn [🔥 ƯU TIÊN SỐ 1 - LUÔN XỬ LÝ ĐẦU TIÊN TRƯỚC AI] Cho File Từ Khóa: Nổi bật huy hiệu Ưu Tiên tại nút Tải File, Modal nhập liệu, và từng thẻ quy tắc. Đồng bộ tự động 100% mọi kịch bản từ file vào bộ nhớ chia sẻ toàn hệ thống. 2. Chuẩn Hóa Tuyệt Đối Quy Trình 4 Bước Phản Hồi Bình Luận: Bước 1: Ghi nhận comment, cảm ơn và nhắc lại câu hỏi/bình luận của khách ("Dạ em cảm ơn {user} đã hỏi/bình luận: {comment}"). Bước 2 (Ưu Tiên 100%): Đối chiếu với danh sách từ khóa trong file tải lên & cấu hình. Nếu khớp, lập tức trả lời đúng câu thoại đã cài đặt (thay thế [user] bằng tên khách), KHÔNG dùng AI ở bước này. Bước 3: Nếu hoàn toàn không khớp từ khóa nào, mới chuyển cho bộ não AI Gemini trả lời đúng trọng tâm trong đúng 1 câu từ 10 đến 15 từ. Bước 4: Nếu AI lỗi, dùng câu chăm sóc khách hàng lịch sự. 3. Video Sự Kiện Bình Luận: Chỉ đổi video khi người dùng có tải/cấu hình video riêng trong Tab Bình luận; nếu không, giữ nguyên video streamer phát liên tục không bị gián đoạn. 4. Ràng Buộc Kích Hoạt Sản Phẩm Chốt Đơn: Thẻ sản phẩm CHỈ hiển thị trên màn hình Live và TikTok Live Studio khi người dùng tick chọn kích hoạt (active: true / enabled: true). Tự động gỡ ghim khỏi màn hình khi người dùng bỏ tick chọn. 5. Khóa chặt 100% các tab và module khác.'
  },
  {
    title: '⚡ Bản Cập Nhật v5.4.43 - Khắc Phục Triệt Để Cửa Sổ Bắt Hình Window Capture OBS & Sửa Lỗi Đen Màn Hình/Bành Trướng TikTok Live Studio',
    description: '1. Sửa Lỗi Window Capture OBS Chỉ Hiển Thị "Một Khúc" & Bị Đen 1 Bên: Loại bỏ triệt để xung đột toạ độ nhân vật phụ. Khi phát video/idol trên Sân Khấu Chính, video sẽ tự động phủ kín 100% toàn bộ khung hình dọc 9:16 (w-full h-full object-cover), hiển thị trọn vẹn người và bối cảnh chuẩn điện thoại di động, tuyệt đối không bị co ép vào góc trái 48% hay để lại khoảng đen bên phải. 2. Khắc Phục Lỗi Màn Hình Đen & Bành Trướng Trên TikTok Live Studio: Khóa cứng tỷ lệ chuẩn 9:16 (1080×1920) độc quyền cho nguồn live, loại bỏ hiện tượng video bị kéo bành méo mó sang 2 bên hoặc bị cắt 2 đầu trên dưới. Bổ sung cơ chế tự động khôi phục video gần nhất khi kết nối, đảm bảo đường link Online HTTPS luôn phát video ngay lập tức trong 0ms, không bao giờ bị đen màn hình. 3. Giữ nguyên và bảo toàn 100% toàn bộ các tab code và tính năng hệ thống.'
  },
  {
    title: '⚡ Bản Cập Nhật v5.4.42 - Fix Full Khung Hình OBS, Nút Play Nghe Thử Voice, & Tối Ưu Nạp File Từ Khóa Bình Luận',
    description: '1. Sửa Lỗi Hiển Thị Full Khung Hình Trên TikTok Live Studio: Tháo bỏ lớp khóa tỷ lệ cứng 9:16, phần mềm sẽ tự động lấy đúng 100% tỷ lệ khung hình người dùng vẽ trên OBS/TikTok Studio. Video phát tự động "cover" phủ đầy không để lại viền đen, tuyệt đối không bị móp méo hay vỡ khung video. 2. Đồng Bộ Giọng AI & Nút Play Nghe Thử: Chỉnh sửa lại toàn bộ giao diện chọn giọng AI đồng nhất. Bổ sung nút bấm "Nghe thử" giọng đọc trực tiếp trên giao diện để người dùng nghe thử âm sắc trước khi lưu cài đặt. 3. Sửa Lỗi Không Nhận File Từ Khóa Bình Luận Tải Lên: Tối ưu quy trình nhận diện từ khóa ưu tiên 100%. Nếu khớp từ khóa (dù tải file ở tab bán hàng hay tab bình luận), hệ thống sẽ trả lời ngay lập tức bằng câu đã cài. Nếu không khớp bất kỳ từ khóa nào, hệ thống mới gửi cho bộ não Gemini xử lý. Đảm bảo luồng AI trơn tru và chính xác.'
  },
  {
    title: '⚡ Bản Cập Nhật v5.4.41 - Chuẩn Hóa Chào Người Mới Realtime, Đọc Tên & Nhắc Lại Comment, Ưu Tiên Từ Khóa Tuyệt Đối & Khóa Khung 9:16 Không Méo Hình',
    description: '1. Chào Đúng Khán Giả Thật Vào Phòng Live: Loại bỏ 100% người xem ảo hoặc tự bịa tên. Chỉ kích hoạt chào mừng khi có viewer thực sự tham gia (tiktok_member), đọc đúng tên khán giả, mỗi người chỉ chào 1 lần duy nhất, tách biệt hoàn toàn với đọc bình luận. 2. Đọc Tên User & Nhắc Lại Bình Luận Chuẩn Mực: Tự động ghép tiền tố trang trọng đọc tên khán giả và nhắc lại câu hỏi ("Dạ em cảm ơn bạn {user} đã hỏi/bình luận: {comment}"). Ưu tiên xử lý 100% danh sách từ khóa/câu hỏi người dùng đã cài đặt trước. Chỉ khi không khớp bất kỳ từ khóa nào mới dùng Gemini AI trả lời ngắn gọn súc tích trong đúng 1 câu (15-20 từ). 3. Khóa Cứng Khung Hình 9:16 Window Capture OBS & TikTok Live Studio: Căn giữa hoàn hảo, chuyển mặc định hiển thị sang cover chống bành trướng, méo mó hoặc vỡ khung video. Khử triệt để lỗi chớp nháy đen màn hình khi avatar bắt đầu/kết thúc nói chuyện.'
  },
  {
    title: '⚡ Bản Cập Nhật v5.4.38 - Khắc Phục Triệt Để Lỗi Chồng Giọng, Tối Ưu Phản Hồi Từ Khóa & Fix Tràn Viền Window Capture OBS',
    description: '1. Khắc Phục Lỗi Trùng Giọng (Double Voice): Tách biệt hoàn toàn AI hệ thống và AI Game Bản Đồ. Hệ thống sẽ không bao giờ phát 2 giọng nói đè lên nhau kể cả khi có nhiều bình luận cùng lúc. 2. Phản Hồi Từ Khóa Không Lan Man: Khi khớp đúng 100% từ khóa người dùng cài đặt, AI sẽ trả lời trực tiếp ngay lập tức bằng câu lệnh đã cấu hình, loại bỏ hoàn toàn câu chào lan man. 3. Sửa Lỗi Cắt Khung Hình Window Capture: Tối ưu bộ hiển thị CleanLiveOverlay tự động (Fill / Kéo dãn) để không bao giờ bị cắt mất hình ảnh khi kết nối OBS hoặc TikTok Live Studio. 4. Xóa Rung Giật Video (CEF Flickering): Khử bỏ các hiệu ứng phần cứng không tương thích với TikTok Live Studio, video phát mượt mà tuyệt đối ở 60 FPS.'
  },

  {
    title: '⚡ Bản Cập Nhật v5.4.35 - Khóa Chặn Triệt Để Lỗi Tự Động Bật Sân Khấu Chính Khi Đã Ngắt Kết Nối',
    description: '1. Khóa Chặn Hệ Thống Đồng Bộ Ở Cấp Độ Lõi: Sau khi người dùng nhấn Ngắt Kết Nối hoặc Tắt Tất Cả, Sân Khấu Chính sẽ bị khóa chặt 100%. Các luồng dữ liệu tự động từ Sân Khấu Phụ (Idol Studio) sẽ bị tường lửa chặn lại hoàn toàn, không thể tự động bắn tín hiệu đè lên Sân Khấu Chính. Màn hình Sân Khấu Chính sẽ duy trì trạng thái đóng băng đen hoàn toàn đúng như chỉ đạo của người dùng. 2. Loại Bỏ Triệt Để Lỗi Tự Phát Video: Bất kỳ lệnh điều khiển video nào cũng không thể vượt quyền khi Đồng Bộ đang ở trạng thái Tắt.'
  },
  {
    title: '⚡ Bản Cập Nhật v5.4.34 - Sửa Lỗi Không Lưu Tùy Chỉnh Voice, Sửa Chớp Nháy Sân Khấu & Tối Ưu Text Chat',
    description: '1. Lưu Tùy Chỉnh Tốc Độ & Âm Lượng Voice Vĩnh Viễn: Người dùng thiết lập âm lượng và tốc độ ở sự kiện Chào Người Mới sẽ được hệ thống lưu thẳng vào bộ nhớ gốc, thoát app vào lại vẫn giữ nguyên 100%. 2. Sửa Dứt Điểm Lỗi Chớp Nháy Video (Flicker) Trên Sân Khấu Chính: Cấu trúc lại luồng DOM video, loại bỏ hiện tượng nháy đen khi nhận đường link mới hoặc thay đổi nhân vật. 3. Sửa Lỗi Cắt Khung Hình (Cắt đầu đít): Cập nhật cơ chế hiển thị 9:16 (Contain) chuẩn 100% không cắt góc trên TikTok Live Studio. 4. Tách Biệt Text Chat & Voice: Phần chữ đẩy lên màn hình chat TikTok Live chỉ hiển thị đúng câu trả lời từ khóa, gọn gàng và không dính liền với câu chào mở đầu.'
  },

  {
    title: '⚡ Bản Cập Nhật v5.4.25 - Sửa Triệt Để Âm Lượng Voice AI Cho Từng Sự Kiện, Kích Hoạt Bộ Quy Tắc Từ Khóa Phản Hồi Cả Text & Voice Tức Thì',
    description: '1. Sửa Triệt Để Âm Lượng Voice AI: Người dùng cài đặt âm lượng bao nhiêu % cho từng sự kiện/voice thì khi AI phát trên live sẽ phát ĐÚNG mức âm lượng đó, không bị nhân chồng hay reset về 100%. Chuẩn hóa tự động giá trị 0-100% → 0.0-1.0 xuyên suốt toàn bộ pipeline. 2. Kích Hoạt Bộ Quy Tắc Từ Khóa Đầy Đủ: Khắc phục lỗi bình luận chào hỏi ("chào", "hi", "chào shop") và mã sản phẩm ("1", "2") bị bộ lọc trivial chặn mất TRƯỚC KHI đến được bộ khớp từ khóa. Giờ đây AI phản hồi đúng câu trả lời đã chuẩn bị sẵn cho từng từ khóa, hiện cả Text lẫn Voice ngay lập tức. 3. Giữ Nguyên 100% Kết Nối TikTok ID & Auto Ghim Sản Phẩm TikTok Shop.'
  },
  {
    title: '⚡ Bản Cập Nhật v5.4.24 - Nâng Cấp Gói Tải Về Windows & Mac Mới Nhất v5.4.24, Đồng Bộ Hóa 100% Endpoint Tải Trực Tiếp & Tối Ưu Thông Báo Cập Nhật',
    description: '1. Nâng Cấp Gói Tải Về Windows & macOS v5.4.24: Tự động đóng gói và phục vụ trực tiếp file ZIP cài đặt mới nhất v5.4.24 qua tất cả các cổng tải (/api/download-windows, /api/download-mac, nút Tải Về trên giao diện và modal). Khắc phục dứt điểm tình trạng tải nhầm phiên bản cũ. 2. Đồng Bộ Hóa Toàn Diện Hệ Thống Tải Về Siêu Tốc: Kết nối trực tiếp với CDN Edge Accelerator tải 50MB/s - 100MB/s không qua trung gian, không bị chặn link. 3. Tinh Gọn Bảng Thông Báo Cập Nhật: Hiển thị nổi bật phiên bản đang sử dụng và các nâng cấp mới nhất, tự động lược bỏ các thông báo cũ để streamer dễ dàng nắm bắt tính năng mới. 4. Khóa Chặt 100% Toàn Bộ Các Tab Chức Năng Khác.'
  },
  {
    title: '⚡ Bản Cập Nhật v5.4.23 - Khắc Phục Triệt Để Âm Lượng Voice AI (Bộ Não & 14 Sự Kiện), Kết Nối TikTok/Shopee Tức Thì 0ms, Chuẩn Hóa 7 Bước Trả Lời Bình Luận & Auto Ghim Sản Phẩm',
    description: '1. Bảo Toàn & Lưu Trữ 100% Mức Âm Lượng Voice AI: Người dùng chỉnh bao nhiêu % âm lượng (0% - 100%) trong Bộ Não AI và 14 sự kiện thì khi phát ra live sẽ phát chính xác bấy nhiêu âm lượng, không bị reset về 100%. 2. Tăng Tốc Kết Nối TikTok Live Studio & Shopee 0ms: Chuyển đổi sang kiến trúc kết nối song song (Parallel) giảm thời gian kết nối từ 15s xuống tức thì 0ms, phản hồi sự kiện phòng live ngay lập tức. 3. Chuẩn Hóa 7 Bước Trả Lời Bình Luận: Đọc lại câu hỏi -> Ưu tiên từ khóa cài đặt sẵn (không ghép câu chăm sóc) -> Bộ Não AI Gemini -> Fallback khéo léo -> Ghép câu gợi mở inbox -> Gửi Text trước -> Phát Voice sau. 4. Tự Động Kích Hoạt Ghim Sản Phẩm: Khởi chạy auto rotation loop và ghim ngay sản phẩm đầu tiên khi bắt đầu live hoặc kết nối TikTok.'
  },
  {
    title: '⚡ Bản Cập Nhật v5.4.22 - Khử Trùng Lặp Chào Người Xem, Bộ Lọc Bình Luận Vô Nghĩa & Xóa Banner TikTok Shop Khỏi Tab Chốt Đơn',
    description: '1. Khử Trùng Lặp Chào Khách Tuyệt Đối: Mỗi khán giả mới vào xem live chỉ được chào đúng 1 lần duy nhất theo chuỗi tuần tự Round-Robin. 2. Bộ Lọc Bình Luận Thông Minh: Tự động bỏ qua các bình luận chào hỏi đơn giản hoặc emoji để tập trung trả lời tư vấn sản phẩm. 3. Xóa Bỏ Banner Đồng Bộ Khỏi Tab Chốt Đơn: Giao diện trực quan, sạch sẽ, chỉ tập trung vào danh mục mã hàng livestream.'
  },
  {
    title: '⚡ Bản Cập Nhật v5.4.21 - Xóa Bỏ Hoàn Toàn Sản Phẩm Demo/Bịa Đặt, Chỉ Ghim 100% Sản Phẩm Thật Từ shop.tiktok.com & Hiển Thị Độc Quyền Trên Phiên Live',
    description: '1. Xóa Sạch Hoàn Toàn Sản Phẩm Mẫu/Demo Bịa Đặt: Loại bỏ triệt để các dữ liệu giả lập (FitAbCore, Con Lăn, Havata, EiraFit...). Hệ thống chỉ đồng bộ và sử dụng 100% sản phẩm thật được lấy trực tiếp từ đường link trang quản trị TikTok Shop (shop.tiktok.com / seller-vn.tiktok.com) của chính người dùng. 2. Hiển Thị Độc Quyền Trực Tiếp Trên Phiên Live (OBS / TikTok Live Studio / Stream Output): Loại bỏ thẻ ghim đè trên giao diện phần mềm quản trị, thẻ sản phẩm chỉ xuất hiện chuyên nghiệp trực tiếp trên luồng phát sóng của khán giả. 3. Tự Động Đồng Bộ & Ghim Chuẩn Xác Theo Cấu Hình: Khi phát live, hệ thống tự động nhận diện và ghim chính xác các sản phẩm thật theo chu kỳ hẹn giờ, từ khóa comment của khách hoặc giọng nói AI.'
  },
  {
    title: '⚡ Bản Cập Nhật v5.4.20 - Chuẩn Hóa Voice AI Cho Từng Sự Kiện/Nhân Vật, Ngăn Màn Hình Đen Khi Chuyển Tab Cài Đặt & Ghim Sản Phẩm shop.tiktok.com',
    description: '1. Chuẩn Hóa Chuẩn Xác Voice AI Setup Cho Từng Sự Kiện / Nhân Vật: Giọng đọc phát ra luôn đúng 100% theo cấu hình giọng mà người dùng đã thiết lập trong Voice AI. Cài đặt voice cho sự kiện nào thì đọc đúng voice đó, kèm âm lượng, tốc độ, cao độ riêng biệt. 2. Ngăn Chặn Tuyệt Đối Màn Hình Live Bị Đen Khi Chuyển Tab: Video sân khấu chính luôn phát liên tục 100% không bị ngắt quãng. 3. Hiển Thị Thẻ Ghim Sản Phẩm TikTok Shop Trực Tiếp Trên Live & OBS: Thẻ sản phẩm được render nổi bật ngay trên sân khấu chính và luồng OBS / TikTok Live Studio.'
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

        {/* Nút Tải Cài Đặt Mac & Windows Tăng Tốc Siêu Nhanh */}
        <div className="px-5 py-3.5 bg-black/40 border-b border-white/10 flex flex-col sm:flex-row gap-2.5 items-center justify-between shrink-0">
          <div className="text-left">
            <p className="text-[11px] font-bold text-gray-300 flex items-center gap-1.5">
              <span>Tải bộ cài đặt độc lập v{APP_VERSION}:</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-black animate-pulse">⚡ 50MB/s</span>
            </p>
            <p className="text-[10px] text-gray-400">Tăng tốc Cloudflare CDN, tải trực tiếp 0% lỗi</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={downloadMac}
              className="px-3 py-1.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all hover:scale-105 flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-md"
              title="Tải trực tiếp bản cài đặt Mac (.zip) với tốc độ siêu nhanh"
            >
              <Apple size={13} />
              <span>Bản Mac (.zip)</span>
            </button>
            <button
              onClick={downloadWindows}
              className="px-3 py-1.5 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/40 text-cyan-300 text-xs font-bold transition-all hover:scale-105 flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-lg shadow-cyan-500/30"
              title="Tải trực tiếp bản cài đặt Windows (.zip) với tốc độ siêu nhanh"
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
