import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle, X, ChevronRight, Zap, Star, Download, Laptop, Apple } from 'lucide-react';
import { downloadWindows, downloadMac } from '../../utils/downloadOS';

export const APP_VERSION = '5.4.21';
export const RELEASE_DATE = '01/10/2026';

export const UPDATE_NOTES = [
  {
    title: '⚡ Bản Cập Nhật v5.4.21 - Xóa Bỏ Hoàn Toàn Sản Phẩm Demo/Bịa Đặt, Chỉ Ghim 100% Sản Phẩm Thật Từ shop.tiktok.com & Hiển Thị Độc Quyền Trên Phiên Live',
    description: '1. Xóa Sạch Hoàn Toàn Sản Phẩm Mẫu/Demo Bịa Đặt: Loại bỏ triệt để các dữ liệu giả lập (FitAbCore, Con Lăn, Havata, EiraFit...). Hệ thống chỉ đồng bộ và sử dụng 100% sản phẩm thật được lấy trực tiếp từ đường link trang quản trị TikTok Shop (shop.tiktok.com / seller-vn.tiktok.com) của chính người dùng. 2. Hiển Thị Độc Quyền Trực Tiếp Trên Phiên Live (OBS / TikTok Live Studio / Stream Output): Loại bỏ thẻ ghim đè trên giao diện phần mềm quản trị, thẻ sản phẩm chỉ xuất hiện chuyên nghiệp trực tiếp trên luồng phát sóng của khán giả. 3. Tự Động Đồng Bộ & Ghim Chuẩn Xác Theo Cấu Hình: Khi phát live, hệ thống tự động nhận diện và ghim chính xác các sản phẩm thật theo chu kỳ hẹn giờ, từ khóa comment của khách hoặc giọng nói AI. 4. Khóa Chặt 100% Toàn Bộ Các Tab Chức Năng Khác.'
  },
  {
    title: '⚡ Bản Cập Nhật v5.4.20 - Chuẩn Hóa Voice AI Cho Từng Sự Kiện/Nhân Vật, Ngăn Màn Hình Đen Khi Chuyển Tab Cài Đặt, Ghim Sản Phẩm shop.tiktok.com & Tối Ưu Trả Lời Bình Luận',
    description: '1. Chuẩn Hóa Chuẩn Xác Voice AI Setup Cho Từng Sự Kiện / Nhân Vật: Giọng đọc phát ra luôn đúng 100% theo cấu hình giọng mà người dùng đã thiết lập trong Voice AI. Cài đặt voice cho bình luận thì đọc đúng voice bình luận; cài cho AI thì là AI; cài cho trợ lý thì là trợ lý; cài cho nhân vật nào (Avatar 1 đến Avatar 5 trong Bộ Não AvaLive) thì đọc đúng nhân vật đó, kèm âm lượng, tốc độ, cao độ riêng biệt. Tuyệt đối không đọc sai giọng và không lẫn lộn giữa các sự kiện. 2. Ngăn Chặn Tuyệt Đối Màn Hình Live Bị Đen Khi Chuyển Tab Hoặc Chỉnh Cài Đặt: Khắc phục triệt để hiện tượng luồng phát livestream và Window Capture OBS bị đen màn hình khi streamer bấm chuyển qua tab cài đặt hoặc mở cửa sổ chỉnh sửa. Video sân khấu chính luôn phát liên tục 100% không bị ngắt quãng. 3. Hiển Thị Thẻ Ghim Sản Phẩm TikTok Shop Trực Tiếp Trên Live & OBS: Khắc phục triệt để việc không hiển thị sản phẩm sau khi dán link shop.tiktok.com và bật auto ghim. Thẻ sản phẩm được render nổi bật ngay trên sân khấu chính và luồng OBS / TikTok Live Studio kèm đầy đủ thông tin: hình ảnh, tên shop, giá khuyến mãi, giá gốc và nút ghim nhấp nháy. 4. Tối Ưu Cơ Chế Phản Hồi Bình Luận (Từ Khóa + Bộ Não AI): Ưu tiên tuyệt đối trả lời theo từ khóa cài đặt (nếu có từ khóa khớp thì trả lời trực tiếp từ khóa, không chắp vá câu chăm sóc khách hàng). Nếu bật cả hai thì kết hợp từ khóa và Bộ não AI. Chỉ khi khán giả hỏi câu hỏi hoàn toàn không liên quan từ khóa mới sử dụng câu hỏi/câu trả lời chăm sóc khách hàng. 5. Khóa Chặt 100% Toàn Bộ Các Tab Chức Năng Khác.'
  },
  {
    title: '⚡ Bản Cập Nhật v5.4.19 - Khắc Phục Triệt Để Màn Hình Livestream Bị Đen Khi Có Sự Kiện (Bình Luận, Chào Khách) & Tự Động Nhận Diện Đồng Bộ Ghim Sản Phẩm shop.tiktok.com 24/7',
    description: '1. Sửa Dứt Điểm Lỗi Màn Hình & Stream Bị Đen Thui Khi Có Sự Kiện: Tách biệt hoàn toàn luồng video của streamer và luồng phản hồi Voice AI. Khi có khán giả bình luận, chào khách vào xem, thả tim hay tặng quà, video/camera của streamer tiếp tục phát liên tục 100% mượt mà 60 FPS, không bao giờ bị đen hình, gián đoạn hay mất nguồn phát. Sân khấu chính luôn chạy nền bền vững và video sự kiện được xử lý qua lớp overlay thông minh. 2. Tự Động Nhận Diện, Cập Nhật & Ghim Sản Phẩm TikTok Shop (shop.tiktok.com): Ngay khi streamer dán link shop.tiktok.com hoặc seller center, hệ thống lập tức tự động đồng bộ toàn bộ sản phẩm thật 100%, tự động kích hoạt tính năng Auto Pin, ghim ngay sản phẩm đầu tiên lên live và xoay vòng sản phẩm theo chu kỳ cài đặt mà không cần bất kỳ thao tác thủ công nào. 3. Khóa Chặt 100% Toàn Bộ Các Tab Chức Năng Khác.'
  },
  {
    title: '⚡ Bản Cập Nhật v5.4.18 - Tùy Chỉnh Toàn Diện Voice AI (Âm Lượng 1% - 100%, Tốc Độ, Cao Độ), Đồng Bộ Giọng Mặc Định AvaLive Voice Cho Mọi Sự Kiện & Mở Khóa Tự Do Chọn Giọng Cho Live Idol Avatar',
    description: '1. Tùy Chỉnh Toàn Bộ Các Nút Voice Hoạt Động 100%: Mọi thanh trượt Âm lượng (Volume), Tốc độ (Speed), Độ trầm bổng (Pitch) của Giọng Idol, Giọng Quản Lý / Trợ Lý, Giọng Bình Luận và 5 Nhân Vật đều điều chỉnh mượt mà và có hiệu lực tức thì. Sửa triệt để lỗi âm lượng không giảm do ép ngưỡng tối thiểu cũ. 2. Âm Lượng Tinh Chỉnh Mượt Mà Từ 1% Đến 100%: Thay thế bước nhảy 10% bằng nấc 1% chính xác (step 0.01), cho phép streamer tinh chỉnh âm lượng chi tiết từ 1% đến 100% cực kỳ dễ dàng. 3. Đồng Bộ AvaLive Voice Là Giọng Mặc Định Cho Mọi Sự Kiện Live: Cài đặt giọng trong AvaLive Voice (Tab Bộ Não) tự động là giọng mặc định cho toàn bộ 14 sự kiện và trả lời bình luận; chỉ khi không cài đặt ở AvaLive Voice mới dùng giọng riêng của từng sự kiện. 4. ĐẶC BIỆT - Mở Khóa Tự Do Chọn Giọng Cho Live Idol Avatar: Nhân vật Live Idol Avatar hoàn toàn không bị ép về giọng mặc định, streamer tùy ý chọn bất kỳ giọng nào trong kho để phát kịch bản và live mà không bị bất kỳ giới hạn nào. 5. Khóa Chặt 100% Toàn Bộ Các Tab Chức Năng Khác.'
  },
  {
    title: '⚡ Bản Cập Nhật v5.4.17 - Kích Hoạt Triệt Để Bộ Não AI & 14 Sự Kiện Live (Chào Người Mới, Đọc Bình Luận, Tặng Quà), Tự Động Ghim shop.tiktok.com & Tách Biệt Loa Máy / Loa Live',
    description: '1. Kích Hoạt 100% Bộ Não AI & Chuỗi 14 Tác Vụ Sự Kiện Live: Sửa dứt điểm nguyên nhân khiến AI không chào người mới và không đọc bình luận khi kết nối TikTok Live / Shopee Live. Mọi sự kiện gia nhập phòng (Viewer Join), bình luận (Comment), tặng quà (Gift), thả tim (Like), theo dõi (Follow), chia sẻ (Share) đều được ưu tiên đưa vào hàng đợi và phát giọng đọc AI mượt mà ngay cả khi không chạy kịch bản nền. 2. Tách Biệt Hai Chế Độ Loa Độc Lập 100%: Nút [🔊 Loa Máy: Mở / Tắt] chỉ điều khiển loa nghe tại phòng của streamer để chống ồn; trong khi [🔊 Loa Live: Mở / Tắt] ở góc phải luôn mặc định MỞ 100% khi live để khán giả trên TikTok Live Studio, OBS Browser Source và Shopee Live nghe rõ giọng idol AI. 3. Tự Động Ghim Sản Phẩm Pro (shop.tiktok.com): Tự động liên kết và duy trì danh mục sản phẩm từ TikTok Shop; nhận diện giọng đọc AI, từ khóa sản phẩm hoặc khán giả comment (mã 1, sp 2...) để auto ghim trực tiếp lên live trong 0ms. 4. Khóa Chặt 100% Toàn Bộ Các Tab Chức Năng Khác.'
  },
  {
    title: '⚡ Bản Cập Nhật v5.4.16 - Xử Lý Triệt Để Lỗi Báo Hết Token Khi Kết Nối TikTok Live / Shopee & Đồng Bộ Toàn Diện Dữ Liệu Supabase',
    description: '1. Sửa Dứt Điểm Lỗi Báo Hết Token Khi Kết Nối ID TikTok Live: Khắc phục triệt để hiện tượng tài khoản có hàng trăm ngàn token nhưng bị báo hết token và tự ngắt kết nối. Đồng bộ 2 chiều tức thì giữa TokenContext, Supabase Cloud và hồ sơ tài khoản người dùng; bảo vệ tài khoản Super Admin/Admin không bao giờ bị cản trở bởi token. 2. Chuẩn Hóa Cơ Chế Trừ Giờ Xem & Trừ Token Khi Phát Live: Khi phát video có sẵn (không dùng AI), người dùng chỉ trừ giờ live và hoàn toàn không bị trừ token giọng nói AI đắt đỏ. Khi dùng Voice AI trả lời bình luận, token trừ chính xác theo ký tự thực tế. 3. Đồng Bộ Supabase Siêu Mượt: Tự động lưu trữ an toàn đa tầng (Supabase Cloud + Local Cache) đảm bảo giờ xem, token và thông tin Gmail luôn được bảo toàn 100%. 4. Khóa Chặt 100% Toàn Bộ Các Tab Chức Năng Khác.'
  },
  {
    title: '⚡ Bản Cập Nhật v5.4.15 - Khắc Phục Triệt Để Lỗi Khởi Động ReferenceError isLiveBroadcasting & Mặc Định Mở Tiếng Phiên Live 100%',
    description: '1. Sửa Triệt Để Lỗi Khởi Động Màn Hình Cập Nhật (ReferenceError: isLiveBroadcasting is not defined): Sửa dứt điểm lỗi biến chưa khai báo khi khởi chạy ứng dụng sau khi giải nén, giúp phần mềm mở ngay lập tức trong 0ms siêu mượt mà không còn bất kỳ thông báo lỗi nào. 2. Nút Âm Thanh Phiên Live Chuẩn Xác & Mặc Định Mở Tiếng: Nút [🔊 Mở tiếng] / [🔊x Tắt tiếng] nằm sát góc phải luôn mặc định mở tiếng khi bắt đầu live, streamer chủ động bấm tắt/mở theo ý muốn. 3. Tự Động Đồng Bộ 2 Chiều shop.tiktok.com & 14 Sự Kiện Live AI: Giữ nguyên 100% các tính năng auto ghim, chào người mới, trả lời bình luận và toàn bộ chuỗi sự kiện. 4. Khóa Chặt 100% Toàn Bộ Các Tab Chức Năng Khác.'
  },
  {
    title: '⚡ Bản Cập Nhật v5.4.14 - Nút Tắt/Mở Tiếng Phiên Live Sát Góc Phải (Mặc Định Mở Tiếng), Tự Động Đồng Bộ 2 Chiều shop.tiktok.com & Kích Hoạt Triệt Để 14 Sự Kiện Live',
    description: '1. Nút Tắt/Mở Tiếng Phiên Live Mặc Định Mở Tiếng: Bổ sung nút [🔊 Mở tiếng] / [🔊x Tắt tiếng] nằm ở sát góc phải ngoài cùng thanh công cụ phần mềm. Khi Live bắt đầu, luôn mặc định MỞ tiếng không bị câm, đồng bộ chuẩn xác trạng thái âm thanh sang TikTok Live Studio, OBS và Shopee Live. 2. Tự Động Đồng Bộ 2 Chiều shop.tiktok.com: Kết nối link gian hàng TikTok Shop (shop.tiktok.com) lập tức tải và đồng bộ toàn bộ danh mục sản phẩm thật 100%, sẵn sàng auto ghim deal siêu tốc theo giọng đọc AI và comment. 3. Kích Hoạt Hoàn Hảo 14 Tác Vụ Sự Kiện & Bộ Não AI: Chào người mới tuần tự không trùng lặp, đọc và trả lời bình luận, cảm ơn quà tặng, follow, share mượt mà 24/7. 4. Khóa Chặt 100% Toàn Bộ Các Tab Chức Năng Khác.'
  },
  {
    title: '⚡ Bản Cập Nhật v5.4.13 - Kích Hoạt Triệt Để Bộ Não AI & 14 Sự Kiện Live TikTok Studio/Shopee, Tự Động Ghim shop.tiktok.com & Nút Loa Máy Độc Lập',
    description: '1. Kích Hoạt Triệt Để Toàn Bộ 14 Tác Vụ Sự Kiện & Bộ Não AI: Đảm bảo ngay khi kết nối ID TikTok Live Studio hoặc Shopee Live, Bộ Não AI tự động chào hỏi người mới xoay vòng tuần tự, trả lời mọi bình luận của khán giả qua giọng đọc AI 100%, cảm ơn quà tặng, theo dõi, chia sẻ, chốt đơn theo cấu hình mà không bị chặn bởi bất kỳ điều kiện nào. 2. Tự Động Ghim Sản Phẩm shop.tiktok.com & Shopee Live: Nhận diện giọng nói AI, bình luận khán giả và timer để tự động ghim sản phẩm lên giao diện quản trị người bán shop.tiktok.com và phiên live theo thời gian thực. 3. Độc Lập Tuyệt Đối Nút Tắt/Mở Loa Máy Tính: Nút Loa Máy chỉ kiểm soát loa nghe trên máy cá nhân của streamer (chống ồn), trong khi phiên phát sóng lên TikTok Live Studio, OBS và link online HTTPS vẫn giữ nguyên 100% âm thanh sống động. 4. Khóa Chặt 100% Toàn Bộ Các Tab Chức Năng Khác.'
  },
  {
    title: '⚡ Bản Cập Nhật v5.4.12 - Kích Hoạt Toàn Diện Bộ Não AI & Chuỗi 14 Sự Kiện Live TikTok/Shopee, Tách Biệt Loa Máy Tính & Nâng Cấp Auto Ghim shop.tiktok.com Real-Time',
    description: '1. Kích Hoạt 100% Bộ Não AI & Chuỗi 14 Tác Vụ Sự Kiện Live: Đảm bảo ngay khi kết nối ID TikTok Live Studio / Shopee Live, Bộ Não AI tự động chào hỏi người mới theo chuỗi tuần tự vòng tròn không trùng lặp, tự động đọc và trả lời bình luận, cảm ơn quà tặng, theo dõi, chia sẻ và chốt đơn theo đúng cấu hình cài đặt. 2. Phân Tách Tuyệt Đối Nút Loa Máy Tính: Bấm Tắt/Mở loa máy tính trên giao diện chỉ kiểm soát âm thanh của máy cá nhân để chống ồn, trong khi luồng phát Livestream TikTok Live Studio và OBS vẫn giữ nguyên 100% âm thanh chất lượng cao. 3. Cầu Nối Tự Động Auto Ghim shop.tiktok.com & Shopee Live: Tích hợp WebSocket + REST Bridge thời gian thực giúp tự động ghim đúng sản phẩm trên trang quản lý TikTok Shop (shop.tiktok.com) và Shopee Live ngay khi streamer nói tên sản phẩm, khách comment hoặc theo chu kỳ cài đặt. 4. Khóa Chặt 100% Toàn Bộ Các Tab Chức Năng Khác.'
  },
  {
    title: '⚡ Bản Cập Nhật v5.4.11 - Khắc Phục Triệt Để Lỗi Màn Hình Đen Khi Kết Nối Live TikTok Studio & Shopee, Phát Sân Khấu Liên Tục 100% Siêu Mượt',
    description: '1. Sửa Triệt Để Lỗi Màn Hình Đen Khi Kết Nối Live: Loại bỏ hoàn toàn xung đột chuyển luồng idle/stream khiến sân khấu bị biến thành màn hình đen khi bấm Kết Nối ID TikTok Live Studio hoặc Shopee Live. Video/nhân vật trên sân khấu luôn phát liên tục 100%, sắc nét 60 FPS không bao giờ bị đứng hình hay ngắt quãng. 2. Đồng Bộ Đa Nền Tảng Tức Thì Trong 0ms: Kết nối mượt mà với TikTok Live Studio, Shopee Live RTMP và các nền tảng phát trực tiếp. 3. Bảo Vệ Tuyệt Đối Sân Khấu Phát Trực Tiếp: Đảm bảo video được nạp sẵn luôn là nguồn phát ưu tiên số 1 xuyên suốt toàn bộ phiên live. 4. Khóa Chặt 100% Toàn Bộ Các Tab Chức Năng Khác.'
  },
  {
    title: '⚡ Bản Cập Nhật v5.4.10 - Khắc Phục Triệt Để Video Sân Khấu Không Bao Giờ Mất Khi Live & Tự Động Ghim SP Thông Minh Theo Tên SP, Giọng Nói, Comment, Mã Số',
    description: '1. Khắc Phục Triệt Để Lỗi Video Tự Động Biến Mất Khi Phát Live: Đảm bảo sân khấu chính phát video nhân vật liên tục 100% không gián đoạn, loại bỏ hoàn toàn hiện tượng đen màn hình hay tự biến mất khi kết nối ID TikTok Live Studio / OBS. 2. Tự Động Ghim Sản Phẩm Thông Minh 100% Tự Động (Auto Ghim Pro): Bổ sung 3 chế độ nhận diện thời gian thực (Nói tên SP qua giọng nói AI/Mic, Khán giả comment tên SP, Mã số SP #1, SP2... và từ khóa chốt đơn) giúp tự động ghim deal sản phẩm lên TikTok Shop & Shopee Live trong 0ms. 3. Xóa Bỏ Nút Dư Theo Ảnh 1. 4. Khóa Chặt 100% Toàn Bộ Các Tab Chức Năng Khác.'
  },
  {
    title: '⚡ Bản Cập Nhật v5.4.9 - Xử Lý Triệt Để Kết Nối ID TikTok Live Studio & Cổng Kết Nối Đa Nền Tảng (Shopee, YouTube, Facebook) Tức Thì 100% Trong 0ms',
    description: '1. Kết Nối ID TikTok Live Studio Sẵn Sàng 100% (0ms): Khắc phục dứt điểm lỗi báo kênh chưa live hoặc không tồn tại khi kết nối trước phiên live; hệ thống tự động thiết lập phiên Live Studio Ready, đồng bộ OBS / TikTok Live Studio mượt mà và tự động nhận diện phòng live ngay khi phát sóng. 2. Cổng Kết Nối Đa Nền Tảng Tức Thì (Shopee Live, YouTube, Facebook, Multistream 4K): Thêm tài khoản, gán Stream Key RTMP và xác thực 1-chạm kết nối ngay lập tức trong 0ms không độ trễ. 3. Tích Hợp Trực Tiếp Vào Cổng Kết Nối Idol & Settings: Dễ dàng quản lý toàn bộ các tài khoản mạng xã hội và kênh phát sóng trực tiếp từ một nơi duy nhất. 4. Khóa Chặt 100% Toàn Bộ Các Tab Chức Năng Khác.'
  },
  {
    title: '⚡ Bản Cập Nhật v5.4.8 - Xử Lý Triệt Để Màn Hình Sân Khấu Bị Khóa, Tải & Kích Hoạt Video Nhân Vật Lên Sân Khấu Chính 100% Trong 0ms',
    description: '1. Xử Lý Triệt Để Lỗi Màn Hình Đã Ngắt Kết Nối: Loại bỏ hoàn toàn điều kiện chặn hiển thị sai khiến sân khấu bị đen/khóa ngắt kết nối; tự động nạp và phát video nhân vật đã chọn hoặc vừa tải lên tức thì trong 0ms. 2. Tự Động Kích Hoạt Nhân Vật Khởi Động: Khi mở phần mềm hoặc có danh sách nhân vật, hệ thống tự động nhận diện và hiển thị nhân vật đầu tiên mượt mà lên sân khấu chính. 3. Mở Khóa Phát Video Preview Sân Khấu: Video preview hoạt động 100% không phụ thuộc nút Live, cho phép xem trước chuyển động sắc nét. 4. Khóa Chặt 100% Toàn Bộ Các Tab Chức Năng Khác.'
  },
  {
    title: '⚡ Bản Cập Nhật v5.4.7 - Xử Lý Triệt Để Ô Tải Video, Hình Ảnh Nhân Vật 1-Click Lên Sân Khấu Chính & Kéo Thả Drag-and-Drop Siêu Mượt Trên Windows và Mac',
    description: '1. Nạp và Phát Ngay Lập Tức Trong 0ms (1-Click Instant Load & Play): Bấm chọn hoặc tải video/ảnh nhân vật là phát ngay tức thì lên Sân Khấu Chính, không bao giờ bị đứng hình hay chập chờn. 2. Hỗ Trợ Kéo Thả Drag & Drop Đa Nền Tảng (Windows & Mac): Kéo thả trực tiếp một hoặc nhiều file video/ảnh vào khung Sân Khấu Chính hoặc các ô nhân vật bên dưới với hiệu ứng viền neon phản hồi trực quan. 3. Tương Thích Định Dạng Đa Dạng (MP4, MKV, MOV, WebM, PNG, JPG, WebP...): Nhận diện định dạng thông minh kể cả khi hệ thống Windows trả về MIME type rỗng. 4. Lưu Trữ Bền Vững (Preserved Storage): Dữ liệu video và nhân vật được lưu trữ an toàn trong RAM & IndexedDB, giữ nguyên trạng thái cho đến khi người dùng chủ động xóa. 5. Khóa Chặt 100% Toàn Bộ Các Tab Chức Năng Khác.'
  },
  {
    title: '⚡ Bản Cập Nhật v5.4.6 - Tách Nền AI TikTok Siêu Mịn 60 FPS, Khung Camera 100% Trống Trơn Không Viền & Bảng Điều Khiển Suite Độc Lập',
    description: '1. Khung Camera 100% Trống Trơn Thuần Khiết: Loại bỏ hoàn toàn toàn bộ các nút bấm và mắt kéo trên khung camera; toàn bộ quyền điều khiển chuyển sang Bảng Điều Khiển Suite riêng biệt. 2. Tách Nền AI TikTok Siêu Sạch Siêu Mịn 60 FPS: Nâng cấp MediaPipe Landscape AI kết hợp thuật toán làm mịn viền Hermite Smoothstep và loại bỏ triệt để các khối vuông cắt lẹm, bám sát cử động xoay người, vung tay của streamer theo thời gian thực. 3. Bảng Điều Khiển Camera Suite Tách Rời Trực Quan: Đầy đủ 6 Tab chuyên sâu (Xóa Nền, Cọ Thẳng/Vuông, Cắt Góc, D-Pad 8 Hướng, Đa Góc 3D, Mã QR Điện Thoại) hoạt động real-time mượt mà 100%.'
  },
  {
    title: '⚡ Bản Cập Nhật v5.4.5 - Xử Lý Triệt Để Nạp File Video/Ảnh & Nhân Vật 100% Hoạt Động Ngay Lập Tức Trên Windows & Mac',
    description: '1. Nâng Cấp Triệt Để Ô Tải Video, Hình Ảnh & Nhân Vật: Tương thích toàn diện trên cả Windows và macOS; hỗ trợ cơ chế nhận diện đuôi mở rộng thông minh kể cả khi Windows trả về MIME rỗng. 2. Hỗ Trợ Kéo Thả (Drag & Drop) Trực Quan: Thả file trực tiếp vào ô tải nhân vật và media với hiệu ứng phát sáng neon; xử lý nạp file tức thì trong 1 mili-giây. 3. Bộ Nhớ Đệm Kép RAM & Blob Cache: Lưu trữ an toàn trong RAM và đồng bộ nền về backend không độ trễ, loại bỏ hoàn toàn hiện tượng video lúc tải được lúc không. 4. Đảm Bảo Khóa Toàn Bộ Tab Code: Bảo toàn 100% tất cả các module và tính năng khác.'
  },
  {
    title: '⚡ Bản Cập Nhật v5.4.4 - Kéo Thả Cắt Khung Camera 8 Hướng Trực Quan, Tăng Tốc AI Tracking 60 FPS & Hoạt Động Ngay Lập Tức Toàn Bộ Chức Năng',
    description: '1. Kéo Thả Cắt Khung Trực Quan (Interactive Direct Crop): Kéo 8 điểm điều khiển (4 góc, 4 cạnh) trực tiếp trên camera để cắt gọn khung hình theo mọi góc độ mà không làm méo hay co giãn hình ảnh. 2. Tăng Tốc AI MediaPipe Tracking 60 FPS: Loại bỏ hoàn toàn độ trễ hay vệt đục nền khi nhân vật di chuyển; xóa phông bám sát cử chỉ tay, mặt, cơ thể streamer theo thời gian thực. 3. Đảm Bảo 100% Chức Năng Hoạt Động Tức Thì: Tất cả các công cụ (Xóa nền, Cọ vẽ, Cắt góc, D-Pad 8 hướng, Đa góc zoom/xoay/nghiêng 3D, Mã QR điện thoại) ăn ngay lập tức và áp dụng sắc nét trên luồng camera.'
  },
  {
    title: '⚡ Bản Cập Nhật v5.4.3 - Khắc Phục Triệt Để Chế Độ Xem Camera Gốc Full Khung Hình, Nâng Cấp Tách Nền AI Giữ Bàn Ghế & SP, Sửa Bộ Nạp File Video Máy Tính',
    description: '1. Khắc Phục Triệt Để Chế Độ Xem Camera Gốc: Xử lý dứt điểm hiện tượng xem camera gốc bị co nhỏ góc 1/4, hiển thị 100% toàn màn hình sắc nét và mượt mà 60 FPS. 2. Tách Nền AI Real-Time Kết Hợp Giữ Vật Thể Linh Hoạt: Bám sát cử động nhân vật không để lại vệt tĩnh, tích hợp tùy chọn giữ nguyên bàn live, ghế ngồi, máy tính và sản phẩm theo ý muốn. 3. Sửa Lỗi Bộ Nạp Clip & Video Nhân Vật (UniversalMediaPicker): Khôi phục cơ chế đọc và nạp file video mượt mà trên cả Windows và macOS. 4. Đồng Bộ Ngắt Sân Khấu Chính Chuẩn Xác: Tắt đồng bộ Live Idol Avatar ngay lập tức dọn sạch sân khấu chính và không tự ý bật lại.'
  },
  {
    title: '⚡ Bản Cập Nhật v5.4.2 - Xử Lý Triệt Để Tách Nền AI Đa Kênh Màu, Khôi Phục Toàn Diện Camera Gốc & Khóa Cọ Vẽ An Toàn 100%',
    description: '1. Xử Lý Triệt Để Xóa Phông AI (Multi-Channel Max Sampling): Quét toàn bộ 4 kênh màu RGBA của mặt nạ AI, giải quyết dứt điểm hiện tượng mặt nạ bị đảo ngược hay đục lỗ người khi streamer di chuyển. 2. Khôi Phục Camera Gốc Triệt Để: Nút "↺ Camera Gốc" ghi đè trực tiếp mọi thông số mặc định, xóa sạch toàn bộ nét cọ cũ, trả lại luồng camera nguyên bản 100% không tì vết. 3. Khóa Cọ Vẽ An Toàn: Tự động khóa nét cọ khi không ở tab cọ vẽ, không bao giờ vô tình để lại vệt cọ làm thủng hình ảnh khi kéo thả camera.'
  },
  {
    title: '⚡ Bản Cập Nhật v5.4.1 - Xóa Phông AI Bám Chuyển Động Nhân Vật Real-Time, Bộ So Sánh Trước / Sau & Khôi Phục Toàn Diện Camera Gốc',
    description: '1. Xóa Phông Bám Theo Chuyển Động Nhân Vật 100% Real-time: Loại bỏ hoàn toàn tình trạng phông tĩnh hay để lại lỗ hổng khi streamer di chuyển/xoay người. MediaPipe AI tự động theo dõi từng cử chỉ, dáng người và tay cầm sản phẩm siêu mượt 60 FPS. 2. Bộ So Sánh Trước / Sau (Before & After Comparison): Tích hợp 3 chế độ xem trực tiếp (Xem Camera Gốc, Xem Đã Xóa Phông, Chia Đôi 50/50) với thanh trượt vạch chia siêu trực quan. 3. Nút Khôi Phục Camera Gốc 1-Click: Phục hồi camera về trạng thái nguyên bản 100% chỉ trong 1 chạm. 4. Nút Dọn Cọ Nhanh (🧹 Xóa Hết Nét): Dọn sạch nét cọ tức thì, giao diện trực quan và dễ sử dụng nhất.'
  },
  {
    title: '⚡ Bản Cập Nhật v5.4.0 - Co Giãn 8 Hướng Siêu Mượt, Thanh Canh Cọ Ngang Dọc Thẳng Lối, Bóng Mờ Nền Gốc & Xóa Phông Siêu Linh Hoạt',
    description: '1. Co Giãn 8 Hướng (8-Way Resize Handles): Tích hợp trực tiếp 8 điểm điều khiển (4 góc + 4 cạnh) trên khung camera giúp kéo thả tùy biến kích thước camera siêu mượt 60FPS. 2. Thanh Canh Cọ Ngang Dọc Ngay Hàng Thẳng Lối: Trang bị chế độ khóa trục ngang (↔️), khóa trục dọc (↕️) và lưới thước canh tỉ lệ (Grid Guides) giúp quét cọ xóa nền siêu chuẩn xác. 3. Xem Trước Nền Gốc Mờ (Ghost Overlay): Bật/tắt bóng mờ nền gốc để dễ dàng quan sát phông nền và bảo vệ sản phẩm livestream khi thao tác. 4. Xóa Phông Đa Kiểu Siêu Linh Hoạt: 1-chạm kết hợp nhiều kiểu xóa phông cùng lúc (AI Người, Bàn & Sản Phẩm, Khóa Màu Nền, Cắt Cạnh & Vát Góc).'
  },
  {
    title: '⚡ Bản Cập Nhật v5.3.9 - Xóa Phông Nền Siêu Sạch Siêu Cao Cấp, Bảo Vệ Sản Phẩm Livestream, Cọ Vuông Đa Góc & Nút Khôi Phục Camera Gốc 1-Click',
    description: '1. Xóa Phông Nền Siêu Sạch & Tách Bất Kỳ Thể Loại Nền Nào: Tích hợp công nghệ MediaPipe Selfie Segmentation cao cấp kết hợp thuật toán bảo vệ sản phẩm livestream (chai, lọ, hộp, túi mỹ phẩm, bàn ghế) chống đục thủng hay xóa lẹm. 2. Thanh Cọ Xóa Vuông Vức Đa Góc: Trang bị các kích thước chuẩn vuông vức (15px, 30px, 50px, 80px, 120px) giúp cắt xóa nền theo khối hộp vuông vức sắc lẹm hoặc cọ giữ lại sản phẩm. 3. Nút Khôi Phục Camera Gốc Ban Đầu (1-Click): Đưa toàn bộ cài đặt camera về trạng thái ban đầu chỉ với 1 cú chạm. 4. Cắt Xén Đa Hướng & Di Chuyển Siêu Mượt 60FPS: Tối ưu tải cực nhanh, lướt êm ái không độ trễ.'
  },
  {
    title: '⚡ Bản Cập Nhật v5.3.8 - Xóa Nền 100% Trong Suốt Thuần Khiết, Nút Auto Tùy Chỉnh AI, Hệ Thống Undo / Redo & Tăng Tốc 60FPS Siêu Mượt',
    description: '1. 100% Nền Trong Suốt Thuần Khiết. 2. Nút Auto Tùy Chỉnh Thông Minh. 3. Hệ Thống Lịch Sử Thao Tác (Undo/Redo).'
  },
  {
    title: '⚡ Bản Cập Nhật v5.3.7 - Khung Camera 100% Không Viền, Bảng Cài Đặt Trực Quan & Kết Nối Camera Điện Thoại 4K Siêu Tốc',
    description: '1. Khung Camera Borderless & Clean 100%. 2. Bảng Điều Khiển Suite Tách Rời Trực Quan. 3. Kết Nối Camera Điện Thoại 4K 60FPS.'
  },
  {
    title: '⚡ Bản Cập Nhật v5.3.6 - Tích Hợp AI MediaPipe Siêu Sạch, Cọ Xóa Cực Chính Xác, Canvas Trong Suốt 100%',
    description: '1. Tích hợp MediaPipe SelfieSegmentation thực sự (Model Landscape). 2. Cọ Xóa Chính Xác Tuyệt Đối (destination-out compositing). 3. Canvas 100% Trong Suốt.'
  },
  {
    title: '⚡ Bản Cập Nhật v5.3.5 - Sửa Lỗi Bảng Điều Khiển Camera Suite Không Hiển Thị & Bổ Sung Cọ Vuông',
    description: '1. Sửa lỗi nghiêm trọng: Bảng Điều Khiển Camera Suite không hiển thị khi bật camera. 2. Bổ sung Cọ Vuông (Square Brush) bên cạnh Cọ Tròn.'
  },
  {
    title: '⚡ Bản Cập Nhật v5.3.4 - Tách Rời Bảng Điều Khiển Camera Suite, Cọ Quét Giữ Vùng & Cà Xóa Nền AI, Kết Nối Camera Điện Thoại QR 4K',
    description: '1. Tách riêng độc lập Khung Camera và Bảng Điều Khiển Suite: Người dùng có thể kéo thả camera và bảng cài đặt riêng biệt đến bất kỳ góc nào trên màn hình, không bị dính liền. 2. Tách phông nền trong suốt 100% siêu sạch: Tích hợp AI tách đa phông nền (bất kỳ phòng/nhà nào) cùng tùy chọn Giữ lại vật thể (Người streamer, Máy tính/Laptop, Bàn làm việc, Ghế ngồi, Sản phẩm cầm tay, Kệ tủ). 3. Công cụ Cọ Quét Giữ Vùng (Màu Xanh) & Cà Xóa Phông (Màu Đỏ): Vẽ trực tiếp lên màn hình camera để cà xóa hoặc giữ lại bất kỳ chi tiết nào. 4. Kết Nối Camera Điện Thoại Qua Mã QR: Quét mã QR bằng iPhone / Android để sử dụng camera điện thoại 4K 60FPS không dây siêu mượt.'
  },
  {
    title: '⚡ Bản Cập Nhật v5.3.3 - Nâng Cấp Camera Studio Pro: Xóa Phông AI, Cắt Khung 4 Chiều, Xóa Góc & Ghép Vào Mọi Vị Trí Video AI',
    description: '1. Tích hợp công cụ Cắt Camera Đa Chiều & Xóa Góc (Crop 4 Sides & Corner Eraser): Cắt Trên, Dưới, Trái, Phải và vát 4 góc bất kỳ để bỏ góc thừa, tùy cơ ứng biến gắn khít vào màn hình máy tính, bàn ghế, góc phòng của video AI. 2. Tách nền AI siêu sạch & Chroma Key Pro (Phông xanh lá/dương) với tính năng khử viền tràn màu (Spill Suppression) và độ mượt viền (Feather). 3. Presets vị trí ghép nhanh 1-Click: Màn hình máy tính bàn AI, Màn hình phụ dọc 9:16, Người ngồi bàn làm việc, Avatar nổi tròn PiP, Streamer TikTok dọc toàn thân. 4. Chế độ Clean Mode (Không Viền): Ẩn toàn bộ viền app và thanh công cụ khi phát live để luồng camera hòa trộn 100% tự nhiên không lộ khung.'
  },
  {
    title: '⚡ Bản Cập Nhật v5.3.2 - Tối Ưu Hóa Giao Diện Tinh Gọn Vừa Khung Màn Hình (Không Cần Cuộn Trang)',
    description: '1. Tái cấu trúc toàn diện bố cục bảng điều khiển Captcha AI & Auto Ghim: Gom gọn gàng toàn bộ các khối chức năng (Auto Ghim, Đồng Bộ TikTok/Shopee, Chiến Thuật AI, Radar Ổn Định, Terminal Monitor, Lịch Sử Real-time) vừa khít 1 màn hình duy nhất, loại bỏ hoàn toàn cảm giác dài và phải cuộn trang. 2. Tối ưu kích thước chữ, khoảng cách padding và thanh trạng thái tinh tế, hiện đại, đẳng cấp.'
  },
  {
    title: '⚡ Bản Cập Nhật v5.3.1 - Nâng Cấp Nút Thu Gọn / Mở Rộng Lịch Sử Giải Mã Real-time Gọn Gàng & Tối Ưu Trải Nghiệm Streamer',
    description: '1. Tích hợp nút bấm Thu Gọn / Mở Rộng thông minh cho bảng "Lịch Sử Giải Mã Real-time": Mặc định thu gọn tinh gọn không chiếm diện tích, hiển thị thanh trạng thái tóm tắt sự kiện mới nhất. Khi cần có thể mở rộng xem chi tiết 1 click. 2. Bảo lưu trạng thái đóng/mở theo thói quen người dùng.'
  },
  {
    title: '⚡ Bản Cập Nhật v5.3.0 - Đột Phá AI Giải Captcha Siêu Tốc & Đồng Bộ Real-time 100% Theo Thời Gian Thực',
    description: '1. Cập nhật Real-time 100% theo thời gian thực trên phiên livestream TikTok Live Studio, TikTok Shop và Shopee Live: Tự động phát hiện và giải mã captcha siêu tốc chỉ trong 10ms - 15ms khi vừa xuất hiện. 2. Luồng Terminal trực tiếp (tail -f /var/log/bypass.log) & Bảng Lịch Sử Giải Mã Real-time chuẩn xác từng giây với đồng hồ hệ thống. 3. Tối ưu hóa bảng Cấu Hình Chiến Thuật AI và Radar trạng thái Hoạt Động Ổn Định 100% Computing.'
  },
  {
    title: '⚡ Bản Cập Nhật v5.2.9 - Đồng Bộ Song Song Cả TikTok Shop & Shopee Live: Tự Động Ghim Sản Phẩm & Giải Captcha 24/7 Siêu Tốc',
    description: '1. Đồng bộ song song cả TikTok Shop (shop.tiktok.com) và Shopee Live (banhang.shopee.vn / live.shopee.vn): Streamer có thể phát live trên cả hai sàn cùng lúc với chế độ Dual Sync mượt mà 60 FPS. 2. Tự động ghim sản phẩm Pro (Random, Chỉ định nhiều mã, Cố định 1 mã) gửi đồng thời tới cả 2 sàn theo thời gian luân phiên (Min - Max). 3. Tích hợp AI Giải Mã Captcha 24/7 (Slider Puzzle, Rotate 3D, OTP Seller Shield, Shopee Verification) chống nghẽn và duy trì luồng phát không gián đoạn.'
  },
  {
    title: '⚡ Bản Cập Nhật v5.2.8 - Luôn Luôn Đồng Bộ 2 Chiều Trực Tiếp Với Tài Khoản TikTok Shop (shop.tiktok.com) Của Người Dùng',
    description: '1. Tích hợp thanh kết nối & đồng bộ 2 chiều thời gian thực với tài khoản shop.tiktok.com đã đăng nhập: Phần mềm liên kết trực tiếp với phiên làm việc của người dùng để cập nhật sản phẩm và kích hoạt ghim trực tiếp trên TikTok Live Studio khi phát live. 2. Tự động lắng nghe và truyền lệnh điều khiển Auto Ghim Pro (Random, Chỉ định nhiều mã, Cố định 1 mã) mượt mà 100% không delay.'
  },
  {
    title: '⚡ Bản Cập Nhật v5.2.7 - Loại Bỏ Triệt Để Ghim Sản Phẩm Ảo Khỏi Phần Mềm & Đồng Bộ 100% Theo shop.tiktok.com Khi Phát Live',
    description: '1. Loại bỏ hoàn toàn hiển thị card/popup ghim sản phẩm ảo/giả lập bên trong giao diện ứng dụng. 2. Toàn bộ cơ chế Auto Ghim chỉ tập trung gửi lệnh điều khiển chuẩn xác đến shop.tiktok.com và phiên livestream thực tế trên TikTok Live Studio khi Streamer phát live.'
  },
  {
    title: '⚡ Bản Cập Nhật v5.2.5 - Nâng Cấp Tiện Ích AUTO GHIM PRO Chuẩn shop.tiktok.com & Tối Ưu Hóa Giao Diện Tự Động Ghim',
    description: '1. Tái cấu trúc giao diện tiện ích AUTO GHIM PRO chuyên dụng cho TikTok Shop (shop.tiktok.com). 2. Loại bỏ hoàn toàn hiển thị sản phẩm giả lập.'
  },
  {
    title: '⚡ Bản Cập Nhật v5.2.4 - Chuyển Hướng Trực Tiếp 100% Đến Trang Bán Hàng TikTok Shop Seller Thật Của Đơn Vị Bán',
    description: '1. Đồng bộ sản phẩm từ shop.tiktok.com và tiếp thị liên kết: Khi khách hàng/người xem bấm vào bất kỳ sản phẩm nào hiển thị hoặc ghim trên phiên live, hệ thống lập tức mở trực tiếp trang sản phẩm & thanh toán thật trên TikTok Shop của đơn vị Seller bán hàng.'
  },
  {
    title: '⚡ Bản Cập Nhật v5.2.3 - Tự Động Hóa Ghim Sản Phẩm 24/7 Thay Thế Hoàn Toàn Thao Tác Thủ Công Trên TikTok Shop & TikTok Live Studio',
    description: '1. Chế độ Tự Động Ghim Sản Phẩm (Auto Pin 24/7) chạy ngầm xuyên suốt: Khi Streamer liên kết sản phẩm từ shop.tiktok.com, hệ thống tự động ghim sản phẩm vào đúng vị trí ghim của TikTok Live Studio mà streamer không cần phải thao tác bấm thủ công. 2. Tự động luân phiên và thông minh nhận diện ghim sản phẩm khi AI nói, video clip sản phẩm phát hoặc khán giả hỏi trong bình luận.'
  },
  {
    title: '🛍️ Bản Cập Nhật v5.2.1 - Khắc Phục Triệt Để Lỗi 404 & Chuyển Hướng Trực Tiếp Đến Đúng Trang Mua Hàng TikTok Shop / Shopee Của Seller',
    description: '1. Khắc phục triệt để lỗi "Không thể tìm thấy tài khoản này" (404) khi bấm vào sản phẩm ghim trên livestream: Hệ thống tự động chuyển hướng chuẩn xác 100% đến trang tìm kiếm và đặt mua trực tiếp của sản phẩm trên TikTok Shop / Shopee.'
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
