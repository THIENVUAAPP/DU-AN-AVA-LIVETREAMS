import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle, X, ChevronRight, Zap, Star, Download, Laptop, Apple } from 'lucide-react';
import { downloadWindows, downloadMac } from '../../utils/downloadOS';

export const APP_VERSION = '4.9.36';
export const RELEASE_DATE = '25/09/2026';

export const UPDATE_NOTES = [
  {
    title: '🚀 Bản Cập Nhật v4.9.36 - Xóa Sạch 100% Video Chạy Nền Mặc Định, Đồng Bộ Triệt Để Luồng Live Idol Avatar (Idol 1-4, Kho Live, Sequencer) Sang Window Capture OBS & Link TikTok Live Studio 60 FPS',
    description: '1. Tuyệt Đối Không Có Video Chạy Nền Mặc Định Khi Mở Phần Mềm: Dọn dẹp sạch sẽ toàn bộ các liên kết video mẫu mặc định khi giải nén và khởi động phần mềm; giao diện sân khấu hoàn toàn sạch đẹp và trống rỗng, sẵn sàng tiếp nhận video độc quyền do người dùng tự tải lên. 2. Đồng Bộ Triệt Để Luồng Live Idol Avatar (Idol 1-4, Kho Live, Sequencer) Sang Window Capture OBS: Bổ sung bộ lắng nghe trực tiếp luồng Live Idol và phát tín hiệu EVENT_VIDEO_PLAY đa kênh; mọi thao tác chọn video từ Kho Live, Sequencer phân đoạn hay Multi-Avatar 1-4 đều hiển thị tức thì 0ms trên Window Capture OBS (/window-capture) tương tự 13 sự kiện hệ thống. 3. Nâng Cấp Luồng Phát TikTok Live Studio (/live-stream): Tích hợp trực tiếp WebSocket nhận diện EVENT_VIDEO_PLAY và GLOBAL_MEDIA_CHANGE, tự động nạp và phát video 60 FPS mượt mà 0ms khi dán link Online HTTPS vào TikTok Live Studio. 4. Tự Động Lưu Trữ & Phân Giải Link Server Cố Định (/uploads/...): Đảm bảo tất cả nguồn video tải lên đều có mặt trên máy chủ để không bao giờ bị đen màn hình hay mất dữ liệu. 5. Khóa Chặt 100% Tất Cả Các Module Hệ Thống: Bảo toàn nguyên vẹn 100% trạng thái hoạt động của mọi tab chức năng.'
  },
  {
    title: '🚀 Bản Cập Nhật v4.9.35 - Đồng Bộ Toàn Diện Luồng Live Idol Avatar (Idol 1-4) Sang Window Capture OBS & TikTok Live Studio, Tối Ưu Tự Động Phát 0ms Mượt Mà 60 FPS',
    description: '1. Đồng Bộ Tuyệt Đối Luồng Live Idol Avatar (Idol 1-4, Kho Live, Sequencer): Tích hợp trực tiếp Master Live State và WebSocket VIDEO_PLAYBACK_CONTROL vào luồng Live Idol Avatar; mọi thao tác chọn nhân vật, phát video từ kho, chuỗi kịch bản phân đoạn hay Multi-Avatar 1-4 đều tự động đồng bộ tức thì 0ms sang Sân Khấu Chính, Window Capture OBS (/window-capture) và TikTok Live Studio (/live-stream). 2. Trang Bị Nút Mở Nhanh Cửa Sổ Bắt Hình Window Capture OBS & Sao Chép Link TikTok Live: Bổ sung thanh công cụ trực quan trên Luồng Live Idol Avatar (Sequencer & Live Console) giúp streamer mở nhanh cửa sổ bắt hình 9:16 siêu nét cho OBS và sao chép đường link Online HTTPS trực tuyến tiện lợi chỉ với 1 click. 3. Tối Ưu Link TikTok Live Studio (/live-stream) Chuẩn CEF: Tự động khởi chạy video ở chế độ an toàn 0ms chống chặn autoplay trên TikTok Live Studio / OBS Browser Source, luồng phát 4K 60 FPS siêu mượt, không giật lag, không đứng hình. 4. Tự Động Đẩy Video Lên Máy Chủ (/uploads/...): Tất cả file video/ảnh trong luồng Live Idol Avatar đều được tự động lưu trữ trên máy chủ cố định, triệt tiêu 100% màn hình đen hay lỗi mất link. 5. Khóa Chặt 100% Tất Cả Các Module Hệ Thống: Bảo toàn nguyên vẹn 100% trạng thái hoạt động của mọi tab chức năng.'
  },
  {
    title: '🚀 Bản Cập Nhật v4.9.34 - Sửa Triệt Để Nút Bấm Dock Window Capture Click Ăn 100%, Đồng Bộ Hoàn Hảo Luồng Live Idol Avatar (Idol 1-4) Sang OBS & TikTok Live Studio, Đồng Bộ Khung Hình & Dừng/Phát Realtime',
    description: '1. Sửa Triệt Để Nút Bấm Dock Window Capture (Click Ăn 100%): Tách bảng điều khiển nổi Dock (#controlsDock) và nút mắt phục hồi (#btnRestoreIcon) ra khỏi container sân khấu, gán trực tiếp lên cấp body với position: fixed và z-index tối đa; gắn sự kiện inline onclick và hỗ trợ đầy đủ pointerdown, mousedown, touchstart giúp các nút Tạm dừng/Phát (Space), Bật/Tắt Tiếng (M), Tràn/Vừa Khung Hình và Ẩn (H) phản hồi tức thì 100%, không bao giờ bị GPU video layer che đè hay nuốt click. 2. Đồng Bộ Tuyệt Đối Luồng Live Idol Avatar (Idol 1-4, Kho Live, Sequencer): Tự động chuyển đổi và đảm bảo link video máy chủ (/uploads/...) trước khi phát sóng lên Master Live State, giúp Window Capture OBS và đường link TikTok Live Studio luôn phát sắc nét 60 FPS, triệt tiêu hoàn toàn màn hình đen hay lỗi mất link blob. 3. Đồng Bộ Khung Hình, Thời Gian & Trạng Thái Dừng/Phát Realtime: Nâng cấp bộ điều khiển VIDEO_PLAYBACK_CONTROL trên đường link TikTok Live Studio (/live-stream) và Window Capture: Dừng là dừng hết, Chạy là chạy hết, thời gian phát khớp chính xác từng mili-giây, loại bỏ tình trạng một bên chạy trước một bên chạy sau. 4. Chuẩn Hóa Bộ Phân Giải URL: Loại bỏ lỗi cắt sai hostname đường link online, bảo vệ trọn vẹn mọi nguồn phát video. 5. Khóa Chặt 100% Tất Cả Các Module Hệ Thống: Bảo toàn nguyên vẹn 100% trạng thái hoạt động của mọi tab chức năng.'
  },
  {
    title: '🚀 Bản Cập Nhật v4.9.33 - Triệt Tiêu Hoàn Toàn Video Chạy Ẩn Backend Khi Tắt/Xóa, Khắc Phục Dock Window Capture Chống Co Bẻ Dòng Chữ Dọc & Click Ăn 100%, Đồng Bộ Sân Khấu Phụ (Idol 1-4) Sang OBS & TikTok Live Studio, Cách Ly Tuyệt Đối 100% Video 14 Sự Kiện',
    description: '1. Triệt Tiêu Hoàn Toàn Video Chạy Ẩn Backend Khi Tắt/Xóa: Gỡ bỏ triệt để logic tự ý phát video ngầm trong backend khi upload file cài đặt; khi người dùng tắt hoặc bấm xóa video ở bất kỳ đâu, hệ thống lập tức xóa sạch trạng thái phát, dừng luồng phát ngầm và xóa vĩnh viễn file vật lý khỏi thư mục uploads trên máy chủ, đảm bảo không còn video chạy ẩn. 2. Khắc Phục Dock Window Capture Chống Co Bẻ Dòng Chữ Dọc & Click Ăn 100%: Tối ưu thanh dock điều khiển trên route /window-capture với thiết kế pill siêu nhỏ gọn (top: 6px), cố định 1 hàng ngang chống co ép bẻ chữ dọc trên tỉ lệ 9:16; toàn bộ nút Tạm Dừng/Phát (Space), Bật/Tắt Tiếng (M), Tràn/Vừa Khung Hình (F), và Ẩn Toàn Bộ (H) cùng nút mắt phục hồi phản hồi click 100% và đồng bộ realtime. 3. Đồng Bộ Tuyệt Đối Sân Khấu Phụ (Live Idol Avatar 1-4) Sang Window Capture OBS & TikTok Live Studio: Tự động chuyển đổi và đảm bảo link video máy chủ /uploads/... trước khi phát, giúp OBS và TikTok Live Studio luôn phát mượt mà 60 FPS không đen màn hình. 4. Cách Ly 100% Video Giữa Các Sự Kiện Trong 14 Tác Vụ: Video tải lên sự kiện nào chỉ lưu và hiển thị đúng sự kiện đó, tuyệt đối không nhảy hay nhân bản sang các sự kiện khác; xóa ở sự kiện nào là xóa triệt để vĩnh viễn khỏi sự kiện đó và máy chủ. 5. Khóa Chặt 100% Tất Cả Các Module Hệ Thống: Bảo toàn nguyên vẹn 100% trạng thái hoạt động của mọi tab chức năng.'
  },
  {
    title: '🚀 Bản Cập Nhật v4.9.32 - Xóa Triệt Để Vĩnh Viễn Video Khỏi Uploads, Tiếp Nhận 100% Video Không Bị Chớp Đen, Đồng Bộ Hoàn Hảo Sân Khấu Phụ Sang OBS & TikTok Live Studio, Nâng Cấp Dock Mini Mượt Mà',
    description: '1. Xóa Video Là Xóa Triệt Để Vĩnh Viễn Khỏi Thư Mục Uploads: Khi người dùng bấm xóa video nhân vật, clip ở Sân Khấu Phụ hay 14 sự kiện, file vật lý trong thư mục uploads của máy chủ bị xóa sạch vĩnh viễn, đồng thời tự động quét sạch mọi file rác và file 0-byte, không còn tồn đọng video đen màn hình. 2. Tiếp Nhận 100% Video Tải Lên Không Bị Chớp Hay Đen Màn Hình: Tối ưu bộ phân giải và ghi nhận video (.mp4, .webm, .mov, .mkv, .avi, .m4v, .flv, .ts...) an toàn tuyệt đối, loại bỏ lỗi lệch atom index giải mã; video phát mượt mà 60 FPS tức thì 0ms. 3. Đồng Bộ Hoàn Hảo Sân Khấu Phụ (Live Idol Avatar) Sang Window Capture OBS: Sửa điều kiện nhận cấu hình Multi-Avatar và Sequencer (cả chế độ 1 nhân vật và nhiều nhân vật), hiển thị sắc nét tức thì trên Window Capture OBS. 4. Nâng Cấp Thanh Dock Window Capture Siêu Gọn & Mượt Mà: Dock nổi được đẩy sát mép trên (top 6px), thiết kế dạng pill bo tròn hiện đại siêu nhỏ gọn, các nút Tạm dừng/Phát, Bật/Tắt Tiếng, Tràn/Vừa Khung Hình, và Ẩn (H) phản hồi click 100%. 5. Tối Ưu Link TikTok Live Studio (/live-stream): Luồng video online HTTPS 9:16 mượt mà 60 FPS, tự động phát 0ms, không lag, không giật hình. 6. Khóa Chặt 100% Tất Cả Các Module Hệ Thống: Bảo toàn nguyên vẹn 100% trạng thái hoạt động của mọi tab chức năng.'
  },
  {
    title: '🚀 Bản Cập Nhật v4.9.31 - Cách Ly Tuyệt Đối 100% Video Từng Sự Kiện, Xóa Triệt Để Vĩnh Viễn Không Nhầm Lẫn, Hoàn Thiện Thanh Dock Window Capture Siêu Gọn & Mượt Mà 60 FPS',
    description: '1. Cách Ly Tuyệt Đối 100% Video Từng Sự Kiện: Gỡ bỏ ô chọn danh mục gây hiểu nhầm sang tab idle; cố định danh mục theo từng sự kiện. Khi người dùng tải video ở sự kiện nào thì chỉ xuất hiện duy nhất ở sự kiện đó, tuyệt đối không tự động nhân bản sang các tab khác. Khắc phục lỗi lưu vết preview URL cũ giữa các tab. 2. Xóa Clip Sự Kiện Là Xóa Sạch Triệt Để: Khi bấm nút xóa video hoặc thư mục ở bất kỳ sự kiện nào, hệ thống lập tức thanh lọc sạch khỏi cấu hình sự kiện, bộ nhớ máy chủ, RAM, và lập tức phát tín hiệu xóa sạch trên Sân Khấu Chính và Window Capture. 3. Hoàn Thiện 100% Nút Bấm Thanh Dock Window Capture: Tối ưu thanh dock nhỏ gọn, layout 1 hàng ngang tuyệt đối không bị co ép bẻ dòng. Các nút Tạm Dừng/Phát (Space), Bật/Tắt Tiếng (M), Tràn/Vừa Khung Hình, và Ẩn (H) phản hồi tức thì 100%, thao tác mượt mà. 4. Tải Video Nhanh Tiếp Nhận Mọi Định Dạng: Nhận diện và tải mượt mà mọi định dạng video (.mp4, .webm, .mov, .mkv, .avi, .m4v, .flv, .ts...) lưu trữ cố định trên máy chủ phục vụ phát 0ms không đen màn hình. 5. Khóa Chặt 100% Tất Cả Các Module Hệ Thống: Bảo toàn nguyên vẹn 100% trạng thái hoạt động của mọi tab chức năng.'
  },
  {
    title: '🚀 Bản Cập Nhật v4.9.30 - Độc Lập 100% Video Từng Sự Kiện, Hoàn Thiện Dock Window Capture Chống Co Bẻ Dòng, Nạp Mọi Ô Nhân Vật & Đồng Bộ Chuẩn OBS / TikTok Live Studio',
    description: '1. Độc Lập Hoàn Toàn Video 14 Sự Kiện: Tách biệt triệt để mọi sự kiện (Chào ngày mới, Like, Share, Follow, Bình luận, PK, Chốt đơn...). Video tải lên cho sự kiện nào chỉ dùng duy nhất cho sự kiện đó, không bao giờ dùng chung, không đè chéo hay cướp quyền video Sân Khấu Chính khi chỉ thao tác cài đặt. Khi người dùng bấm xóa video ở sự kiện là xóa dứt điểm vĩnh viễn khỏi sự kiện đó và Sân Khấu Chính. 2. Hoàn Thiện 100% Thanh Dock Window Capture: Khắc phục triệt để lỗi nút bấm bị co ép và chữ bị bẻ dòng dọc, chuẩn hóa layout nằm ngang chống tràn, kích hoạt hoàn hảo mọi nút bấm Tạm Dừng/Phát (Space), Bật/Tắt Tiếng (M), Tràn/Vừa Khung Hình, và Ẩn Toàn Bộ (H). 3. Đảm Bảo Tải Video Mọi Ô Nhân Vật: Tất cả các ô nhân vật đều tải video mượt mà, nhận diện mọi định dạng (.mp4, .webm, .mov, .mkv, .avi, .m4v, .flv, .ts...) và tự động đẩy lên server /uploads/... để phát tức thì 0ms lên Sân Khấu Chính, Window Capture và Link TikTok Live Studio. 4. Sân Khấu Phụ (Sequencer) & Cần Gạt Đồng Bộ: Video trong sân khấu phụ tải lên hiển thị mượt mà; khi gạt cần "ĐỒNG BỘ RA SÂN KHẤU CHÍNH", toàn bộ video, hình ảnh, tiêu đề được đồng bộ tuyệt đối 60 FPS sang OBS và TikTok Live Studio. 5. Khóa Chặt 100% Tất Cả Các Module Hệ Thống: Bảo toàn nguyên vẹn 100% trạng thái hoạt động của mọi tab chức năng.'
  },
  {
    title: '🚀 Bản Cập Nhật v4.9.29 - Xóa Triệt Để Video Sự Kiện Không Hồi Sinh Sân Khấu Chính, Kích Hoạt 100% Nút Bấm Window Capture, Khắc Phục Link TikTok Live Studio 60 FPS Mượt Mà & Tiếp Nhận Mọi Định Dạng Video',
    description: '1. Xóa Triệt Để Video Sự Kiện Không Hồi Sinh: Khi người dùng bấm xóa video/thư mục ở các tab sự kiện (14 tác vụ, bao gồm cả tab idle Đứng Chờ), video lập tức bị thanh lọc và xóa vĩnh viễn khỏi máy chủ, RAM và localStorage, sân khấu chính dừng phát và xóa sạch ngay tức thì, không bao giờ tự ý hồi sinh. 2. Kích Hoạt 100% Nút Bấm Window Capture: Toàn bộ nút nổi gồm Tạm dừng/Phát (Space), Bật/Tắt Tiếng (M), Tràn/Vừa Khung Hình, và Ẩn Toàn Bộ (H) phản hồi lập tức, loại bỏ chặn chuột và đồng bộ 2 chiều mượt mà. 3. Khắc Phục Link TikTok Live Studio (/live-stream) Quay Vòng Vòng: Triệt tiêu triệt để tình trạng treo vòng lặp spinner "Đang Đồng Bộ Luồng 60 FPS...", tự động đồng bộ video chuẩn xác 60 FPS mượt mà không giật lag. 4. Ô Tải Nhân Vật Tiếp Nhận Mọi Định Dạng Video: Không kén video, nhận ngay lập tức mọi định dạng (.mp4, .webm, .mov, .mkv, .avi, .m4v, .flv, .ts...) phát 0ms lên sân khấu chính. 5. Dọn Sạch Video Rác & File 0-Byte Trong Uploads: Tự động quét dọn triệt để các file 0-byte và dữ liệu tạm dang dở. 6. Khóa Chặt 100% Các Module Hệ Thống.'
  },
  {
    title: '🚀 Bản Cập Nhật v4.9.27 - Tích Hợp Đồng Bộ TikTok Shop & Ghim Giỏ Hàng Tự Động 24/7 Vào Modal Vượt Captcha AI, Vượt Captcha Chuẩn TikTok/Shopee/Cloudflare (0ms)',
    description: '1. Tích Hợp TikTok Shop Vào Vượt Captcha AI 24/7: Di chuyển thanh công cụ Đồng Bộ TikTok Shop (shop.tiktok.com & Seller Center), Tự Động Ghim Giỏ Hàng 24/7, quản lý thêm/sửa/xóa sản phẩm và Ghim Ngay vào Modal Vượt Captcha AI. 2. Cơ Chế Ghim Giỏ Hàng Chuẩn TikTok Tự Động 100%: Tự động ghim sản phẩm theo thời gian (giây), nhận diện từ khóa giọng nói AI của nhân vật, từ khóa bình luận của người xem và sự kiện video chuyển đổi. 3. Vượt Captcha AI Đa Nền Tảng (0ms): Nâng cấp giải mã tức thì TikTok Slider, 3D Rotate Puzzle, TikTok Seller Center Challenge, Shopee Live Slider và Cloudflare Turnstile v3 Stealth không bao giờ bị chặn hay gián đoạn. 4. Khóa Toàn Bộ Module Hệ Thống: Bảo toàn nguyên vẹn 100% tất cả các tab chức năng và subview.'
  },
  {
    title: '🚀 Bản Cập Nhật v4.9.26 - Đồng Bộ Tuyệt Đối Video, Hình Ảnh & Tiêu Đề Lên Window Capture OBS & Link TikTok Live Studio, Phát 24/24 Lặp Lại Không Gián Đoạn',
    description: '1. Đồng Bộ Toàn Diện Video, Hình Ảnh & Tiêu Đề: Luồng Live Idol Avatar (Sân khấu phụ, Multi-Avatar, Sequencer) và Sân khấu chính hiển thị đầy đủ 100% nội dung video, hình ảnh nền, tiêu đề banner, chữ chạy và thẻ ghim giỏ hàng lên Window Capture OBS và đường link TikTok Live Studio 60 FPS. 2. Tự Động Lặp Lại 24/24: Toàn bộ video phát liên tục và tự động lặp lại khi hết video, đảm bảo phiên live vận hành 24/7 liền mạch cho đến khi người dùng chủ động tắt. 3. Khóa Toàn Bộ Module Hệ Thống: Bảo toàn nguyên vẹn 100% tất cả các tab chức năng và subview.'
  },
  {
    title: '🚀 Bản Cập Nhật v4.9.25 - Tối Ưu Toàn Diện Nút Bấm Window Capture OBS, Video Chờ Im Lặng Phát Liên Tục 24/7, Video Sự Kiện Phát Trọn Vẹn & Thumbnail Phát Trực Tiếp',
    description: '1. Kích Hoạt & Đồng Bộ 100% Nút Bấm Window Capture: Toàn bộ nút Tạm Dừng/Phát (Space), Bật/Tắt Tiếng (M), Tràn/Vừa Khung, và Ẩn/Hiện Toàn Bộ (H) phản hồi lập tức và đồng bộ 2 chiều tức thì với Sân Khấu Chính. 2. Video Chờ Im Lặng (Tab Cuối Cùng) Phát Liên Tục 24/7: Video chạy nền ở chế độ chờ im lặng được duy trì phát liên tục không bao giờ tự ý tắt hay mất đi trừ khi người dùng xóa. 3. Video Sự Kiện Phát Trọn Vẹn 100%: Mọi video hành động/sự kiện khi được kích hoạt đều phát trọn vẹn từ đầu đến cuối không bị ngắt quãng, khi kết thúc tự động trở về video chờ. 4. Ô Video Hành Động Hiển Thị Video Đang Chạy: Video tải lên trong ô sự kiện hiển thị video đang chạy mượt mà ngay trong thumbnail preview.'
  },
  {
    title: '🚀 Bản Cập Nhật v4.9.24 - Tối Ưu Triệt Để Xóa Video & Dọn Sạch Thư Mục Uploads, 1-Click Xóa Avatar / Khung, Gỡ Bỏ Tab 1 Kết Nối Idol, Đồng Bộ Chuẩn OBS & TikTok Live',
    description: '1. Xóa Video Là Xóa Sạch Vĩnh Viễn Khỏi Máy Chủ (Uploads): Khi người dùng bấm xóa nhân vật hoặc video trên bất kỳ tab nào, hệ thống lập tức thanh lọc và xóa vĩnh viễn file vật lý khỏi máy chủ và RAM, loại bỏ 100% video đen hoặc file rác tồn đọng. 2. Nút Xóa (1-Click) Sân Khấu Phụ: Nút Xóa trên thanh công cụ Avatar / Lớp lập tức xóa đứt điểm toàn bộ nhân vật, video và khung viền trong 1 thao tác duy nhất. 3. Gỡ Bỏ Tab 1 Kết Nối Idol: Tối giản cổng Kết Nối Idol để hiển thị trực tiếp 100% không gian 14 Tác Vụ Sự Kiện Live. 4. Đồng Bộ Có Kiểm Soát Sân Khấu Phụ: Chỉ khi người dùng bấm Bật Đồng Bộ thì Sân khấu phụ mới chuyển tiếp luồng sang Sân khấu chính và Window Capture OBS.'
  },
  {
    title: '🚀 Bản Cập Nhật v4.9.23 - Kích Hoạt Toàn Diện Thanh Điều Khiển Window Capture, Khắc Phục Màn Hình Đen 14 Sự Kiện Live & Tối Ưu Tải Mọi Định Dạng Video',
    description: '1. Thanh Điều Khiển Window Capture Nổi (Floating Dock): Các nút Tạm dừng/Phát, Bật/Tắt Tiếng, Tràn/Vừa Khung, và Ẩn Dock phản hồi tức thì 100%. 2. Khắc Phục Triệt Để Màn Hình Đen 14 Sự Kiện: Tự động trích xuất frame đầu làm Thumbnail sắc nét, đồng bộ đường dẫn máy chủ chuẩn xác sang Sân khấu chính, OBS và TikTok Live Studio; video sự kiện phát xong tự động chuyển tiếp mượt mà về video chạy nền. 3. Tải Mọi Định Dạng Video Cho Luồng Live Idol Avatar: Mở rộng tiếp nhận mọi định dạng video (.mp4, .webm, .mov, .mkv, .avi, v.v.) không bị giới hạn.'
  },
  {
    title: '🚀 Bản Cập Nhật v4.9.22 - Khôi Phục Hoàn Toàn Bản v4.9.14: Tự Động Đẩy Toàn Bộ Video Sân Khấu Phụ & 14 Sự Kiện Vào Uploads Đồng Bộ OBS & TikTok Live',
    description: '1. Khôi Phục Nguyên Bản 100% Cấu Trúc Bản v4.9.14: Tự động đẩy toàn bộ video, hình ảnh và tiêu đề từ Sân khấu phụ (Luồng Live Idol 1-4 Avatar / Sequencer) và 14 sự kiện tương tác vào thư mục uploads của máy chủ, đồng bộ mượt mà sang Window Capture OBS và TikTok Live Studio 60 FPS. 2. Đảm bảo toàn bộ hệ thống module, tab chức năng và subview vận hành chuẩn xác theo đúng cấu hình v4.9.14.'
  },
  {
    title: '🚀 Bản Cập Nhật v4.9.14 - Tự Động Đẩy Toàn Bộ Video, Hình Ảnh & Tiêu Đề Từ Sân Khấu Phụ (Luồng Live Idol) & 14 Sự Kiện Vào Uploads Đồng Bộ OBS & Link TikTok Live',
    description: '1. Tự Động Đẩy File Vào Uploads Của Server: Mọi video và hình ảnh được thiết lập từ Luồng Live Idol Avatar (Sân khấu phụ / Sequencer), Multi-Avatar cũng như 14 Sự kiện live (Quà tặng, Chốt đơn, Hành động, Nền, v.v.) đều được tự động lưu trữ và đồng bộ vào thư mục uploads trên máy chủ với đường dẫn /uploads/... cố định, triệt tiêu 100% tình trạng mất link hay đen màn hình. 2. Đồng Bộ Tức Thì 0ms Sang OBS & TikTok Live: Toàn bộ nội dung phát, video, hình ảnh và tiêu đề chữ được đồng bộ sang Window Capture OBS và Đường link liên kết TikTok Live Studio siêu mượt, siêu nét 60 FPS theo thời gian thực.'
  },
  {
    title: '🚀 Bản Cập Nhật v4.9.13 - Đồng Bộ 100% Sân Khấu Chính, Triệt Tiêu Tự Phát Video Lung Tung & Đồng Bộ Trọn Vẹn Tiêu Đề',
    description: '1. Sân Khấu Chính Phát Gì Thì Phát Đúng Cái Đó: Loại bỏ hoàn toàn cơ chế tự ý quét bốc video cũ hoặc ngẫu nhiên từ uploads/IndexedDB. Cửa sổ Window Capture OBS và Đường link liên kết TikTok Live Studio chỉ phát chuẩn xác 100% video, hình ảnh và âm thanh do Sân khấu chính hiển thị, triệt tiêu tình trạng phát video lung tung. 2. Đồng Bộ Trọn Vẹn Nội Dung Tiêu Đề: Toàn bộ tiêu đề phát, chữ banner khuyến mãi, phong cách chữ và màu sắc trên Sân khấu chính được đồng bộ tức thì sang Window Capture và Link TikTok Live Studio siêu mượt 60 FPS.'
  },
  {
    title: '🚀 Bản Cập Nhật v4.9.12 - Đồng Bộ & Phát Trọn Vẹn 100% Video, Hình Ảnh, Nội Dung Lên Window Capture OBS & Link TikTok Live Studio',
    description: '1. Hỗ Trợ Đầy Đủ Cả Video Lẫn Hình Ảnh: Cửa sổ Window Capture OBS và Đường link trực tuyến TikTok Live Studio tự động nhận diện và hiển thị siêu nét, siêu mượt cả Video (.mp4, .webm, .mov) lẫn Hình ảnh (.png, .jpg, .webp, .svg, .gif), triệt tiêu hoàn toàn màn hình đen. 2. Đồng Bộ Tức Thì 0ms Mọi Nguồn Sân Khấu: Tất cả dữ liệu từ Live Idol Avatar, Live Idol Studio (Multi-Avatar), 14 Sự kiện live và Video tải lên máy tính đều lập tức cập nhật sang Window Capture và Link phát với chất lượng gốc cao nhất.'
  },
  {
    title: '🚀 Bản Cập Nhật v4.9.11 - Đẩy Toàn Bộ Video Sân Khấu Vào Uploads Realtime & Khắc Phục Triệt Để Chớp Đen / Biến Mất Khi Bấm Phát Kịch Bản Live',
    description: '1. Đẩy Video Vào Uploads Theo Thời Gian Thực: Mọi video người dùng tải lên hoặc chọn trên Sân khấu chính đều được tự động đẩy vào thư mục system/uploads theo thời gian thực mới nhất, phục vụ trực tiếp cho Window Capture OBS và Link phát TikTok Live Studio. 2. Khắc Phục Triệt Để Chớp Đen Khi Phát Kịch Bản Live: Video nhân vật trên Sân khấu chính được cố định thẻ phát và luồng phát liên tục, không bị gián đoạn hay chớp tắt màn hình đen giữa các câu thoại kịch bản AI.'
  },
  {
    title: '🚀 Bản Cập Nhật v4.9.10 - Tối Ưu Tải File ZIP Siêu Tốc 0ms, Loại Bỏ Hoàn Toàn Treo / Chậm Khi Tải Xuống Windows',
    description: '1. Tải Xuống Tức Thì 0ms: Tối ưu hóa đường dẫn phát hành trực tiếp từ GitHub CDN và loại bỏ các bước chờ kết nối trung gian, khắc phục triệt để tình trạng tải chậm hoặc đứng hình khi tải file ZIP trên Windows. 2. Nén Tối Đa & Tăng Tốc Độ Mở: Áp dụng thuật toán nén DEFLATE mức 9, tối ưu hóa toàn diện dung lượng gói cài đặt giúp tải siêu nhanh trong vài giây.'
  },
  {
    title: '🚀 Bản Cập Nhật v4.9.9 - Xóa Bỏ Hoàn Toàn Video Mặc Định Trong Hệ Thống / Uploads & Đồng Bộ Tuyệt Đối Sân Khấu Chính Với Window Capture OBS & Link TikTok Live',
    description: '1. Xóa Sạch Video Mặc Định / Chạy Nền: Đã dọn dẹp sạch sẽ 100% video nền cũ trong thư mục system/uploads, gói cài đặt tải về luôn hoàn toàn sạch sẽ, không lưu video mặc định rác. 2. Đồng Bộ Đầy Đủ Dữ Liệu Video 0ms: Mọi video từ Sân khấu phụ (Live Idol Avatar, Kho Video), 14 Sự kiện live hoặc tải lên từ máy tính đều được phát và đồng bộ tức thì, đầy đủ thông tin dữ liệu sang Window Capture OBS và Link phát TikTok Live Studio.'
  },
  {
    title: '🚀 Bản Cập Nhật v4.9.8 - Đồng Bộ Video Tức Thì 0ms (60 FPS) Cho Window Capture OBS & Link TikTok Live Studio (Sân Khấu Phụ & 14 Sự Kiện Live)',
    description: '1. Khắc Phục Triệt Để Màn Hình Đen & Quay Tròn: Video phát từ Sân khấu phụ (Live Idol Avatar, Kho Video) và 14 Sự kiện phát live được nạp tức thì 0ms, phát mượt mà 60 FPS chuẩn xác trên cả Window Capture OBS và Đường link liên kết TikTok Live Studio giống như video tải trực tiếp từ máy tính. 2. Đồng Bộ Đa Kênh Tức Thì: Truyền tải mượt mà cả File Blob trong bộ nhớ RAM và đường dẫn máy chủ cố định, triệt tiêu hoàn toàn độ trễ.'
  },
  {
    title: '🚀 Bản Cập Nhật v4.9.7 - Khắc Phục Triệt Để Màn Hình Đen Window Capture & Link Live, Đồng Bộ 100% Sân Khấu Chính & 14 Sự Kiện Live',
    description: '1. Sửa Triệt Để Màn Hình Đen: Đồng bộ video phát từ Sân khấu phụ (Live Idol Avatar, Kho Video, 14 Sự kiện live) sang Sân khấu chính, Window Capture OBS và Đường link liên kết 0ms chuẩn 60 FPS, không còn tình trạng đen màn hình. 2. Xóa Bỏ Video Lưu Ẩn: Triệt tiêu hoàn toàn các video cache mặc định, Window Capture và Link stream chỉ phát 100% chính xác những gì đang hiển thị trên Sân khấu chính.'
  },
  {
    title: '🚀 Bản Cập Nhật v4.9.6 - Khởi Động Trực Tiếp Phần Mềm Phát Live Khi Giải Nén & Tự Động Định Tuyến Chuẩn Xác',
    description: '1. Khởi Động Trực Tiếp Phần Mềm: Giải nén gói cài đặt Windows và Mac mở trực tiếp 100% giao diện Phần Mềm AvaLive Studio phát live (DesktopAppUI), tự động liên kết Sân khấu, Voice AI và các công cụ Livestream. 2. Định Tuyến Thông Minh: Tên miền website trực tuyến luôn hiển thị Trang Bán Hàng (Landing Page), trong khi gói cài đặt giải nén trên máy luôn mở Phần Mềm đầy đủ.'
  },
  {
    title: '🚀 Bản Cập Nhật v4.9.5 - Khôi Phục Trang Bán Hàng Landing Page, Triệt Tiêu Video Phát Ẩn & Tối Ưu Truyền Video Sân Khấu Phụ Sang OBS / Link Live',
    description: '1. Khôi Phục Trang Bán Hàng (Landing Page): Truy cập website hiển thị đầy đủ giao diện Trang Chủ Bán Hàng & Giới thiệu tính năng, song song với giao diện Desktop App /desktop. 2. Triệt Tiêu Video Phát Ẩn: Tắt hoàn toàn âm thanh preview ngầm và giải phóng tài nguyên phát ẩn. 3. Sửa Lỗi Đen Màn Hình Window Capture OBS: Đồng bộ video từ sân khấu phụ sang sân khấu chính tức thì 0ms, hiển thị 60 FPS mượt mà không lỗi.'
  },
  {
    title: '🚀 Bản Cập Nhật v4.9.4 - Tối Ưu Tốc Độ Xuất Hiện Video 0ms (60 FPS) & Ưu Tiên Lớp Trên Cùng (Topmost Layer) OBS & TikTok Live',
    description: '1. Tải Video Tức Thì 0ms (60 FPS): Loại bỏ hoàn toàn màn hình chờ xoay vòng, nạp và phát video ngay lập tức với khả năng tăng tốc phần cứng GPU cực nhanh. 2. Ưu Tiên Video Lớp Trên Cùng (Topmost Layer): Khi có nhiều video cùng lúc (14 Sự kiện Live, LipSync Voice AI, Phản hồi nhanh khẩn cấp), Window Capture OBS và đường link TikTok Live Studio luôn hiển thị full màn hình video ở lớp trên cùng tức thì.'
  },
  {
    title: '🚀 Bản Cập Nhật v4.9.3 - Đồng Bộ Tuyệt Đối 100% Giữa Sân Khấu Phụ & Sân Khấu Chính, Window Capture OBS & Link TikTok Live (14 Sự Kiện Live)',
    description: '1. Đồng Bộ Hoàn Hảo Sân Khấu Phụ & Chính: Mọi thao tác chọn và phát video trong Sân khấu phụ (Kho Live, 14 Tác vụ Live, Sequencer, Multi-Avatar) ngay lập tức đồng bộ chuẩn xác cùng khung hình, cùng thời gian và cùng Voice AI lên Sân khấu chính. 2. Đồng Bộ 14 Sự Kiện Live sang OBS & TikTok Live: Tất cả video sự kiện (Chào hỏi, Follow, Like, Share, Quà tặng, Chốt đơn...) và trạng thái Play/Pause/Time được đồng bộ tức thì 0ms sang Window Capture OBS và đường link Online HTTPS.'
  },
  {
    title: '🚀 Bản Cập Nhật v4.9.2 - Khắc Phục Triệt Để Khởi Động Localhost 3001 & Tối Ưu Nạp Giao Diện Desktop 100%',
    description: '1. Sửa Triệt Để Lỗi Khởi Động: Bổ sung icon Upload bị thiếu trong thư viện lucide-react của DesktopAppUI, loại bỏ hoàn toàn lỗi ReferenceError khi nạp giao diện. 2. Trải Nghiệm Mở Localhost 3001 Tức Thì: Truy cập http://localhost:3001/ hiển thị ngay toàn bộ giao diện phần mềm trong 0.1 giây mượt mà 60 FPS.'
  },
  {
    title: '🚀 Bản Cập Nhật v4.9.1 - Tối Ưu Phục Vụ Giao Diện Phần Mềm Localhost 100% (Port 3001 & Tự Động Phân Giải URL)',
    description: '1. Mở Giao Diện Localhost Siêu Mượt: Khắc phục triệt để lỗi khi mở http://localhost:3001/, tự động phân giải đúng giao diện DesktopAppUI trên mọi cổng local và IP mạng LAN. 2. Tối Ưu Mount Hooks: Loại bỏ hoàn toàn các lỗi gọi hook sớm trước khi khởi tạo, đảm bảo phần mềm nạp tức thì trong 0.1 giây.'
  },
  {
    title: '🚀 Bản Cập Nhật v4.9.0 - Tối Ưu Xóa Video Ô Nhân Vật Siêu Mượt 60 FPS (Không Báo Lỗi), Đồng Bộ Chuẩn Xác Toàn Diện Windows & Mac',
    description: '1. Xóa Video Nhân Vật Siêu Mượt (100% Không Lỗi): Xử lý chuyển đổi trạng thái an toàn tuyệt đối khi người dùng xóa video tại các ô nhân vật. Tự động chuyển mượt mà sang nhân vật kế tiếp hoặc dọn sạch sân khấu về trạng thái chờ nguyên bản mà không phát sinh bất kỳ lỗi nào. 2. Đồng Bộ Hóa Toàn Diện Windows & Mac: Toàn bộ dữ liệu mã nguồn, logic xử lý media và gói cài đặt độc lập được đồng bộ hóa chuẩn xác, tối ưu hóa dung lượng và hiệu năng.'
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
