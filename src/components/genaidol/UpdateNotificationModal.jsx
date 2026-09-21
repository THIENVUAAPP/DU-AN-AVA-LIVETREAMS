import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle, X, ChevronRight, Zap, Star, Download, Laptop, Apple } from 'lucide-react';
import { downloadWindows, downloadMac } from '../../utils/downloadOS';

export const APP_VERSION = '4.5.1';
export const RELEASE_DATE = '21/09/2026';

export const UPDATE_NOTES = [
  {
    title: '⚡ Bản Cập Nhật v4.5.1 - Khắc Phục Triệt Để Lỗi ReferenceError: useMemo is not defined & Mở Tab Mượt Mà 100%',
    description: '1. Sửa Dứt Điểm Lỗi useMemo: Bổ sung khai báo useMemo chuẩn React trong LivestreamFlowSequencer, triệt tiêu 100% màn hình lỗi ReferenceError, giúp bấm mở Luồng Live Idol 1-4 Avatar hoạt động tức thì; 2. Khóa Chặt 100% Toàn Bộ Hệ Thống: Bảo toàn nguyên vẹn Window Capture OBS Zero-Copy, Voice AI Brain, Game Battle PK, Game Bản Đồ 3D, Luồng phát online HTTPS Cloudflare Tunnel.'
  },
  {
    title: '⚡ Bản Cập Nhật v4.5.0 - Sửa Triệt Để Lỗi Bấm Mở Tab Luồng Live Idol 1-4 Avatar Chuyên Biệt Mượt Mà 60FPS',
    description: '1. Sửa Dứt Điểm 100% Lỗi Mở Tab: Nâng cấp nút "🎬 Luồng Live Idol 1-4 Avatar" trong menu dropdown mở ngay tức thì bảng điều khiển chuyên biệt Full-screen Studio Sequencer 60FPS không bị kẹt hay giật lag; 2. Cấu Trúc Modal Riêng Biệt: Tách riêng giao diện Luồng Live Idol 1-4 Avatar độc lập, giúp hiển thị trọn vẹn 100% không gian làm việc; 3. Khóa Chặt 100% Toàn Bộ Hệ Thống: Bảo toàn nguyên vẹn Window Capture OBS Zero-Copy, Voice AI Brain, Game Battle PK, Game Bản Đồ 3D, Luồng phát online HTTPS Cloudflare Tunnel.'
  },
  {
    title: '⚡ Bản Cập Nhật v4.4.9 - Loại Bỏ Nút Trùng Lặp Trên Menu & Tối Ưu Mở Ngay Tab Luồng Live Idol 1-4 Avatar',
    description: '1. Loại Bỏ Nút Trùng Lặp: Đã dọn dẹp và xóa bỏ hoàn toàn nút bấm dư thừa trên Menu Dropdown theo đúng yêu cầu; 2. Sửa Triệt Để Lỗi Mở Tab: Tối ưu nút "🎬 Luồng Live Idol 1-4 Avatar" mở thẳng vào Sequencer đa avatar; 3. Khóa chặt 100% tất cả các module hệ thống.'
  },
  {
    title: '⚡ Bản Cập Nhật v4.4.6 - Khắc Phục Triệt Để Lỗi Bấm Luồng Avatar & Thống Nhất Truy Cập Luồng Live Idol 1-4 Avatar',
    description: '1. Khắc Phục Triệt Để Lỗi Luồng Avatar: Sửa hoàn toàn hiện tượng không bấm được hoặc bị đơ tab Luồng Avatar/Sequencer, cho phép chuyển đổi tự do, mượt mà giữa Luồng Live Idol 1-4 Avatar và các sự kiện mà không bị reset trạng thái; 2. Thống Nhất Nút Menu Dropdown: Đồng bộ toàn bộ các nút chức năng Avatar trong menu dẫn trực tiếp đến subview Luồng Live Idol 1-4 Avatar đầy đủ tính năng; 3. Khóa Chặt 100% Toàn Bộ Hệ Thống: Bảo toàn nguyên vẹn Window Capture OBS Zero-Copy, Voice AI Brain, Game Battle PK, Game Bản Đồ 3D, Luồng phát 60 FPS 4K.'
  },
  {
    title: '⚡ Bản Cập Nhật v4.4.5 - Đổi Tên Tab "Luồng Live Idol 1-4 Avatar", Tự Động Phát Video Khớp 100% Khung Sân Khấu Khi Có Sự Kiện & Sửa Triệt Để Lỗi Truy Cập Kịch Bản / Kết Nối Idol',
    description: '1. Đổi Tên Tab Thống Nhất: Đổi tên tab chức năng thành "🎬 Luồng Live Idol 1-4 Avatar" trực quan, dễ nhớ, giữ nguyên 100% tính năng phân đoạn và bố cục 1-4 avatar; 2. Luồng Sự Kiện Tự Động Phát Video Khớp 100% Khung Sân Khấu: Khi có sự kiện (chào người mới, bình luận, quà tặng đặc biệt/thường, theo dõi, chia sẻ, cảm ơn tim, chốt đơn, nói chuyện AI, xin lỗi, im lặng/chờ...), video được tải lên từ ô sự kiện tương ứng sẽ tự động chuyển và phát trực tiếp lên Sân Khấu Chính full-frame (object-cover 100%), không hở viền; khi kết thúc sự kiện tự động trả về video nền; 3. Sửa Triệt Để Lỗi Truy Cập "Chuỗi Kịch Bản" & "Kết Nối Idol": Điều hướng chính xác và tức thì tới subview kịch bản hoặc sự kiện mà không bị báo lỗi runtime; 4. Khóa Chặt 100% Toàn Bộ Hệ Thống: Bảo toàn nguyên vẹn Window Capture OBS Zero-Copy, Voice AI Brain, Game Battle PK, Game Bản Đồ 3D, Luồng phát 60 FPS 4K.'
  },
  {
    title: '⚡ Bản Cập Nhật v4.4.4 - Đồng Bộ Sân Khấu Chính 100% Khung Hình & Sạch Rác, Đọc Trọn Bộ Kịch Bản Không Bị Ngắt & Đầy Đủ Danh Sách Giọng Đọc Voice AI Brain',
    description: '1. Sân Khấu Chính Đồng Bộ Chuẩn 100% Khung Hình (Full-Screen 100%): Khi đồng bộ từ Sân Khấu Phụ (Sequencer), video và hình ảnh chính tự động phủ kín 100% màn hình, không bị lệch hoặc bó hẹp trong khung 48%; 2. Sạch Rác 100% Sân Khấu Live: Triệt tiêu hoàn toàn tất cả các tag rác (🟢 Nhân Vật 1, Nhân Vật 2, Đang nói) trên màn hình phát live, đảm bảo khung hình sạch sẽ chuyên nghiệp; 3. Đọc Trọn Bộ Toàn Bộ Kịch Bản: Nâng cấp động cơ Voice AI đọc hết toàn bộ câu chữ trong kịch bản dài không bị dừng/ngắt giữa chừng, tự động chuyển mượt sang bước tiếp theo khi đọc xong; 4. Đầy Đủ Danh Sách Giọng Đọc Voice AI: Dropdown phân nhóm rõ ràng tất cả các giọng trong Bộ Não Voice AI Brain (Top Bán Hàng VIP, Nữ Bắc/Trung/Nam, Nam Bắc/Trung/Nam, Đa Ngôn Ngữ); 5. Khóa Chặt 100% Toàn Bộ Hệ Thống: Bảo toàn nguyên vẹn Window Capture OBS Zero-Copy, Voice AI Brain, Game Battle PK, Game Bản Đồ 3D, Luồng phát 60 FPS 4K.'
  },
  {
    title: '⚡ Bản Cập Nhật v4.4.3 - Khắc Phục Triệt Để Lỗi Truy Cập Chuỗi Kịch Bản (Sequencer)',
    description: '1. Khắc Phục Triệt Để Lỗi Chuỗi Kịch Bản: Sửa lỗi crash khi mở tab Chuỗi Kịch Bản (Sequencer), đảm bảo mở mượt mà 100%; 2. Nút Bật/Tắt Dừng & Phát Tất Cả Video trên Sân Khấu Phụ: Cho phép tạm dừng hoặc tiếp tục phát toàn bộ luồng video trên sân khấu phụ tức thì; 3. Sân Khấu Chính Độc Lập 100%: Triệt tiêu hoàn toàn ô trống hoặc tag "Nhân vật 2", tự do phát video/ảnh độc lập toàn màn hình; 4. Giữ Nguyên Hiện Trạng Layer Ghim: Khi chuyển giữa các bước kịch bản, các layer được ghim giữ nguyên 100% toạ độ x/y, kích thước scale và tách nền AI chromaKey; 5. Khóa Chặt 100% Các Module Khác: Bảo toàn nguyên vẹn Window Capture OBS Zero-Copy, Voice AI Brain, Game Battle PK và Game Bản Đồ 3D.'
  },
  {
    title: '⚡ Bản Cập Nhật v4.4.1 - Sân Khấu Chính Độc Lập 100% (Loại Bỏ Ô Nhân Vật 2 Khi Chưa Đồng Bộ) & Đồng Bộ Toàn Diện Sân Khấu Phụ Ra Sân Khấu Chính',
    description: '1. Sân Khấu Chính Độc Lập 100%: Mặc định khi chưa bấm Đồng Bộ từ Chuỗi Kịch Bản, Sân Khấu Chính bên ngoài hoạt động độc lập hoàn toàn, phát video/ảnh do người dùng đưa lên full màn hình, loại bỏ triệt để ô đen hoặc khung lưới "🟢 Nhân Vật 2 / Nhân Vật 3"; 2. Đồng Bộ Toàn Diện Sân Khấu Phụ Ra Sân Khấu Chính: Khi bấm "📡 ĐỒNG BỘ RA SÂN KHẤU CHÍNH" trong Chuỗi Kịch Bản, toàn bộ nội dung Sân Khấu Phụ (video nền chính, video PiP, Avatar 1–4, Banner deal, Tiêu đề chữ, Vị trí Transform và Tách nền AI Chroma Key) lập tức hiển thị đồng bộ 100% ra Sân Khấu Chính; 3. Chạy Kịch Bản Tự Động Chuyển Cảnh & Phát Voice: Khi bấm Chạy Kịch Bản, Sân Khấu Chính tự động phát khớp từng bước theo phân đoạn kịch bản và đồng bộ âm thanh Voice AI; 4. Khóa Chặt Đọc Bình Luận & Sự Kiện Chỉ Khi Phát Live: Khóa chặt toàn bộ tiến trình đọc bình luận, chào người mới, chốt sale... chỉ cho phép thực thi khi người dùng chính thức phát Live; 5. Khóa Chặt 100% Hệ Thống: Bảo toàn nguyên vẹn Window Capture OBS Zero-Copy, Voice AI Brain, Game Battle PK, Game Bản Đồ 3D, Luồng phát 60 FPS 4K.'
  },
  {
    title: '⚡ Bản Cập Nhật v4.4.0 - Bảo Vệ Sự Kiện & Bình Luận Chỉ Đọc Khi Phát Live, Gom Gọn Thanh Công Cụ Nằm Trong Khung Sân Khấu, Chống Chồng Chéo Nút & Đồng Bộ Sân Khấu Chính 100%',
    description: '1. Chỉ Đọc Bình Luận & Kích Hoạt Sự Kiện Khi Phát Live: Khóa chặt toàn bộ tiến trình đọc bình luận, chào người mới, chốt sale... chỉ cho phép thực thi khi người dùng chính thức phát Live hoặc Test thủ công; 2. Gom Gọn Thanh Công Cụ Ngang Nằm Trọn Trong Khung Sân Khấu (Ảnh 1): Bỏ chữ Avatar dài dòng, thu nhỏ gọn nhãn lớp và các nút thao tác để hiển thị đầy đủ 100% bên trong khung, triệt tiêu hoàn toàn tràn viền; 3. Tinh Gọn Thanh Điều Khiển Dưới Sân Khấu Chống Chồng Chéo (Ảnh 2): Rút gọn 5 nút bấm và nhãn Avatar nói, loại bỏ 100% tình trạng đè chữ hay tràn lề mé bên phải; 4. Đồng Bộ Toàn Diện Từ Studio 1–4 Avatar Ra Sân Khấu Chính: Khi bấm Đồng Bộ hoặc Bấm Chạy kịch bản trong Studio 1–4 Avatar / Sequencer, toàn bộ video, hình ảnh, nhân vật, tiêu đề sẽ lập tức hiển thị đồng bộ ra Sân Khấu Chính, OBS Window Capture và Link Online HTTPS; 5. Khóa Chặt 100% Toàn Bộ Hệ Thống: Bảo toàn nguyên vẹn Window Capture OBS Zero-Copy, Voice AI Brain, Game Battle PK, Game Bản Đồ 3D, Luồng phát 60 FPS 4K.'
  },
  {
    title: '⚡ Bản Cập Nhật v4.3.9 - Xếp Thanh Công Cụ Ngang Trên Sân Khấu, Rút Gọn Tiêu Đề Gọn Gàng, Nút Tải Video/Ảnh Trên Bounding Box & Tinh Gọn 1 Hàng Nút Dưới',
    description: '1. Thanh Công Cụ Lớp Xếp Ngang Trên Sân Khấu (Ảnh 1 & 3): Dời toàn bộ công cụ lớp (Xóa Nền AI, Lên, Xuống, Xóa Lớp, Đóng) thành hàng ngang nằm phía trên khung Sân khấu, xóa bỏ thanh tiêu đề cồng kềnh giúp giao diện thoáng đãng và dễ thao tác; 2. Rút Gọn Tiêu Đề Kịch Bản Cực Kỳ Tinh Gọn (Ảnh 2): Thu gọn phần tiêu đề trên cùng chỉ còn "🎬 Kịch Bản Live" kèm dropdown chọn kịch bản nhỏ gọn, xóa sạch các ô chữ dư thừa; 3. Nút Tải Video/Ảnh Trực Tiếp Trên Bounding Box (Ảnh 4): Bổ sung nút 📁 Tải Video/Ảnh trực tiếp trên khung bao (Bounding Box) khi chọn bất kỳ Avatar, Video Chính, Video PiP hay Banner nào để thay thế media ngay tức thì; 4. Tinh Gọn Thanh Nút Điều Khiển 1 Hàng Duy Nhất (Ảnh 5): Bố trí chuẩn xác 5 nút chức năng (🛍️ Bán Hàng, ⚔️ PK Đấu, 🎯 Giữa, 🔲 Tràn, 🔒 Khóa) nằm gọn gàng trên 1 hàng duy nhất không bị cuộn ngang; 5. Khóa Chặt 100% Hệ Thống: Bảo toàn nguyên vẹn Window Capture OBS Zero-Copy, Voice AI Brain, Game Battle PK, Game Bản Đồ 3D, Luồng phát 60 FPS 4K.'
  },
  {
    title: '⚡ Bản Cập Nhật v4.3.8 - Sửa Triệt Để Lỗi Mở Tab Chuỗi Kịch Bản (Sequencer), Đảm Bảo Mở Tức Thì 100% & Hoạt Động Trơn Tru Mọi Nền Tảng',
    description: '1. Khắc Phục Triệt Để Lỗi Mở Tab Chuỗi Kịch Bản: Bổ sung đầy đủ các thành phần điều hướng lớp, xử lý dứt điểm lỗi runtime khiến tab không vào được, đảm bảo bấm vào mở tức thì 100% mượt mà; 2. Mở Tab Tự Do Cho Mọi Người Dùng: Bỏ chặn điều kiện tài khoản khi truy cập Chuỗi Kịch Bản từ thanh menu và Header; 3. Giữ Nguyên Toàn Bộ Giao Diện v4.3.7: 1 Nút Xóa Nền AI ngoài khung hình video, Tỷ lệ 7/3 ô Lời Thoại kịch bản to gấp 3 lần, Hiển thị rõ ràng nút Cài Đặt & Xóa Bước, Tinh gọn 1 nút Nghe Thử Voice; 4. Khóa Chặt 100% Hệ Thống: Bảo toàn nguyên vẹn Window Capture OBS Zero-Copy, Voice AI Brain, Game Battle PK, Game Bản Đồ 3D, Luồng phát 60 FPS 4K.'
  },
  {
    title: '⚡ Bản Cập Nhật v4.3.7 - Gom 1 Nút Xóa Nền AI Ngoài Khung Video, Tỷ Lệ 7/3 Kịch Bản To Gấp 3 Lần, Hiện Rõ Ô Cài Đặt & Nút Xóa Bước, Đồng Bộ Studio 1–4 Avatar 100%',
    description: '1. Gom 1 Nút Xóa Nền AI Ngoài Khung Video: Xóa bỏ tất cả các nút phông xanh rườm rà trong video, tích hợp 1 nút duy nhất "🪄 Xóa Nền AI" tự động tách mọi loại nền (xanh lá, xanh dương, nền đen, nền trắng, tường phòng) nằm ở thanh công cụ nổi bên ngoài khung hình; 2. Tinh Chỉnh Tỷ Lệ 7/3 & Khung Kịch Bản To Gấp 3 Lần: Thu gọn Sân khấu còn 30%, nhường 70% không gian cho Bảng Kịch Bản với khung nhập lời thoại rộng rãi gấp 3 lần, dễ đọc và dễ biên tập; 3. Hiển Thị 100% Nút Cài Đặt & Nút Xóa Bước Màu Đỏ: Tối ưu hàng nút điều khiển, đảm bảo nút Cài Đặt và Xóa bước luôn hiển thị rõ ràng, không bị che khuất; 4. Rút Gọn 1 Nút Nghe Thử Voice Duy Nhất: Tinh gọn chỉ 1 nút "Nghe Thử Voice" theo yêu cầu, khi chạy kịch bản thì từng phân đoạn tự động đọc thoại; 5. Đồng Bộ Sân Khấu Studio 1–4 Avatar Chuẩn Tuyệt Đối: Mọi thay đổi về nhân vật, nền, layer, vị trí trong Studio 1-4 Avatar đều được đồng bộ tức thì 100% ra Sân Khấu Chính, OBS Window Capture và Link Online HTTPS; 6. Khóa Chặt 100% Hệ Thống: Bảo toàn nguyên vẹn Window Capture OBS Zero-Copy, Voice AI Brain, Game Battle PK, Game Bản Đồ 3D.'
  },
  {
    title: '⚡ Bản Cập Nhật v4.3.6 - Đồng Bộ Sân Khấu Chính 1–4 Avatar Chuẩn Xác 100% & Triệt Tiêu Hoàn Toàn Âm Thanh Chồng Chéo (Single Active Voice)',
    description: '1. Đồng Bộ Sân Khấu Chính 1–4 Avatar Chuẩn Xác 100%: Mở rộng cơ chế đồng bộ sân khấu đa nhân vật hỗ trợ đầy đủ từ 1 đến 4 Avatar, đồng bộ tức thì toàn bộ bố cục, nền, nhân vật, video phụ PiP, banner deal và tiêu đề chữ sang Sân Khấu Chính, OBS Window Capture Zero-Copy và Link Online HTTPS; 2. Triệt Tiêu Hoàn Toàn Âm Thanh Chồng Chéo (Single Active Audio Stream): Loại bỏ hoàn toàn xung đột phát trùng 2 luồng giọng đọc cùng lúc khi chuyển bước, bấm Chạy Test hoặc Đọc thử AI; 3. Nút "Xem Bước Này" Ngắt Âm Thanh Tức Thì: Chỉ xem bố cục hình ảnh/video trực quan, tự động dừng triệt để mọi luồng voice đang phát trước đó; 4. Khóa Chặt 100% Hệ Thống: Bảo toàn nguyên vẹn Window Capture OBS Zero-Copy, Voice AI Brain, Game Battle PK, Game Bản Đồ 3D, Luồng phát 60 FPS 4K.'
  },
  {
    title: '⚡ Bản Cập Nhật v4.3.5 - Chức Năng Mặc Định Theo Lời Thoại Kịch Bản, Bật/Tắt Voice Từng Bước Chuẩn 100%, Sắp Xếp Lớp Z-Index, Kéo Co Giãn Chữ 4 Chiều & Tách Nền AI Auto 4K',
    description: '1. Thời Lượng Mặc Định Dựa Vào Lời Thoại Kịch Bản: Tự động tính toán và chuyển bước ngay khi Voice AI đọc xong kịch bản, không phụ thuộc số giây cố định; 2. Nút Bật/Tắt Voice Từng Bước Chuẩn 100%: Tắt là ngắt sạch sẽ âm thanh lập tức, mở mới được đọc; tuân thủ tuyệt đối Master Voice; 3. Sắp Xếp Lớp (Z-Index Layer Ordering): Bộ nút 🔼 Lên Lớp / 🔽 Xuống Lớp / 🔝 Lên Đỉnh / 🔻 Xuống Đáy giúp di chuyển mọi lớp video/hình ảnh/avatar/chữ linh hoạt; 4. Kéo Co Giãn Tiêu Đề Chữ 4 Chiều (8 Hướng): Bounding box 8 điểm co giãn mượt mà, tự động phóng to thu nhỏ cỡ chữ trực quan; 5. Tách Nền AI Auto & Khử Nền Sạch Sẽ 100%: Khử nền ảnh phòng/tường sáng, phông xanh lá/lam, nền đen/trắng với viền mượt khử răng cưa; 6. Khóa Chặt 100% Hệ Thống: Bảo toàn nguyên vẹn OBS Window Capture Zero-Copy, Game Battle PK, Game Bản Đồ 3D.'
  },
  {
    title: '⚡ Bản Cập Nhật v4.3.4 - Bổ Sung Bộ Chọn Voice Riêng Cho Nhân Vật 1 Đến 5 Trong Bộ Não AI & Sửa Triệt Để Lỗi Mở Tab Chuỗi Kịch Bản',
    description: '1. Tùy Chọn Voice Riêng Cho Nhân Vật 1 Đến Nhân Vật 5 Trong Bộ Não AI: Bổ sung cấu hình 5 thẻ Voice chi tiết cho Nhân vật 1 (Idol / Host), Nhân vật 2 (Quản lý / Chốt đơn), Nhân vật 3 (BLV / Hoạt náo PK), Nhân vật 4 (Khán giả / Khách mời), Nhân vật 5 (Cố vấn chuyên môn); tùy biến riêng biệt âm lượng, tốc độ, cao độ và nút nghe thử 0ms; 2. Sửa Triệt Để Lỗi Mở Tab Chuỗi Kịch Bản (Sequencer): Khắc phục dứt điểm lỗi biến runtime khiến tab không hiển thị, đảm bảo mở tức thì 100% mượt mà; 3. Đồng Bộ Tự Động Voice AI Cho Chuỗi Kịch Bản: Khi phân vai nhân vật nào đọc thoại, hệ thống tự động nạp chính xác Voice cấu hình từ Bộ Não tương ứng; 4. Khóa Chặt 100% Hệ Thống: Bảo toàn nguyên vẹn Window Capture OBS Zero-Copy, Voice AI Brain, Game Battle PK, Game Bản Đồ 3D, Luồng phát 60 FPS 4K.'
  },
  {
    title: '⚡ Bản Cập Nhật v4.3.3 - Nút Master Bật/Tắt Voice & Video Quyền Lực Nhất, Nút Xóa Đỏ Góc Trái Cho Mọi Ô, Tách Nền Canvas 0ms & Nhúng Khung Phông Xanh',
    description: '1. Nút Master Bật/Tắt Voice AI Quyền Lực Nhất: Kiểm soát tuyệt đối 100% âm thanh và giọng đọc, khi TẮT là ngắt lập tức mọi âm thanh và voice, không tự ý phát giọng khi chuyển bước; 2. Nút Xóa (Red Trash) Ở Góc Trái Trên Cùng: Bấm chọn bất kỳ ô/lớp nào trên sân khấu 9:16 (Video chính, PiP, Avatar 1-4, Banner, Text) là xuất hiện ngay nút xóa màu đỏ góc trái để xóa tức thì 1 chạm; 3. Tách Nền Siêu Sạch Canvas 0ms Cho Cả Ảnh & Video: Tách phông xanh lá, phông lam, nền đen (Screen), nền trắng (Multiply) sạch sẽ 100%, không viền đục; 4. Nhúng Video/Ảnh Vào Khung Phông Xanh: Tự động lồng ghép video và hình ảnh vào đúng khung mockup phông xanh chuẩn xác; 5. Khóa Chặt 100% Hệ Thống: Bảo toàn nguyên vẹn Window Capture OBS Zero-Copy, Voice AI Brain, Game Battle PK, Game Bản Đồ 3D.'
  },
  {
    title: '⚡ Bản Cập Nhật v4.3.2 - Xóa Phông Xanh & Tách Nền Cực Sạch Cho Cả Video và Hình Ảnh, Ghim Chạy Xuyên Suốt 100%, Xóa Ô Nhân Vật Trực Tiếp & Tự Động Đọc Thoại Voice AI Brain',
    description: '1. Xóa Sạch Phông Xanh & Nền Cho CẢ HÌNH ẢNH VÀ VIDEO: Bộ lọc tách phông (Chroma Green 🟢, Chroma Blue 🔵, Nền đen Screen ⚫, Nền trắng Multiply ⚪) áp dụng triệt để cho toàn bộ 4 lớp: Video/Ảnh nền chính, Video/Ảnh PiP, Avatar AI và Banner hình ảnh; 2. Cơ Chế Ghim Chạy Xuyên Suốt 100%: Bất kỳ video nền, video phụ PiP, banner ảnh hay chữ tiêu đề nào được ghim từ bước 1 sẽ tự động kế thừa và phát liên tục xuyên suốt từ bước đầu tiên đến bước cuối cùng mà không bị mất hay gián đoạn; 3. Xóa Ô Nhân Vật Trực Tiếp Trên Sân Khấu: Bấm chọn nhân vật là có ngay nút Xóa (Trash) trực tiếp và trên thanh công cụ, tự động thu gọn số lượng nhân vật và làm sạch sân khấu 100%; 4. Tự Động Đọc Kịch Bản Bằng Voice AI Brain (Bộ Não): Khi bấm chạy kịch bản Sequencer hoặc Chạy Test, hệ thống tự động phát giọng đọc của từng nhân vật theo cấu hình trong Bộ Não với độ trễ 0ms; 5. Đồng Bộ Sân Khấu Chính Tuyệt Đối 100%: Truyền phát mượt mà 60 FPS 4K sang OBS Window Capture, TikTok Live Studio và Link Online HTTPS; 6. Khóa Chặt 100% Hệ Thống: Bảo toàn nguyên vẹn Window Capture OBS Zero-Copy, Voice AI Brain, Game Battle PK, Game Bản Đồ 3D.'
  },
  {
    title: '⚡ Bản Cập Nhật v4.3.1 - Xóa Phông Xanh & Phông Nền Cực Sạch 4K, Tự Động Đồng Bộ Giọng Đọc Bộ Não (Voice AI Brain), Nạp Media Trực Tiếp & Làm Nổi Bật Bước Đang Chiếu',
    description: '1. Xóa Sạch Phông Xanh / Nền Cực Kỳ Sạch: Tích hợp bộ lọc Chroma Key chuyên nghiệp trực tiếp cho từng Avatar trên Sân khấu 9:16 (Xanh lá cây, Xanh dương, Nền đen Screen, Nền trắng Multiply), quét sạch triệt để không bị lem hay ám viền tóc; 2. Đồng Bộ Giọng Đọc Bộ Não (Voice AI Brain) Tự Động Theo Nhân Vật: Tự động ánh xạ giọng đọc từ cấu hình Bộ Não cho Avatar 1 (Idol), Avatar 2 (Quản lý), Avatar 3 (BLV Game PK), Avatar 4 (Khán giả); 3. Nút Đọc Thử AI 0ms Với Sóng Âm Trực Quan: Bấm là nghe ngay giọng đọc thật từ Bộ Não với hiệu ứng sóng âm đang đọc và nút Dừng tức thì; 4. Nạp Media Trực Tiếp Nhảy Ngay Lên Sân Khấu 9:16: Tải bất kỳ video/ảnh nào từ máy tính là hệ thống chuyển ngay sang bước đó và hiển thị trực tiếp trên Sân Khấu Cột Trái; 5. Làm Nổi Bật Bước Đang Chiếu Rõ Ràng: Viền sáng phát quang kèm badge "🟢 ĐANG HIỂN THỊ SÂN KHẤU 9:16" giúp người dùng kiểm soát chính xác phân đoạn đang phát; 6. Khóa Chặt 100% Hệ Thống: Bảo toàn nguyên vẹn Window Capture OBS Zero-Copy, Voice AI Brain, Game Battle PK, Game Bản Đồ 3D.'
  },
  {
    title: '⚡ Bản Cập Nhật v4.3.0 - Co Giãn 8 Hướng Video Nền Chính, Nạp Video/Ảnh Trực Tiếp Cho Nhân Vật Trên Sân Khấu, Bộ Chọn Voice AI Brain Từng Bước & Hiển Thị Đa Lớp 100%',
    description: '1. Video Nền Chính Co Giãn 8 Hướng & Kéo Thả: Video/ảnh nền chính có thể kéo thả di chuyển tự do, thu nhỏ, mở rộng tràn khung và co giãn 8 điểm trực quan; 2. Nạp Video/Ảnh Trực Tiếp Cho Nhân Vật Ngay Trên Sân Khấu: Bấm chọn bất kỳ Avatar nào trên Sân Khấu 9:16 sẽ có nút tải file trực tiếp từ máy tính gán ngay cho nhân vật đó; 3. Bộ Chọn Giọng Đọc AI (Voice AI Brain) Từng Bước: Tích hợp trực tiếp danh sách giọng đọc AI Tiếng Việt Top 1 cho từng phân đoạn kịch bản và nhân vật, nút Đọc Thử AI 0ms; 4. Hiển Thị 100% Media Tải Lên: Xử lý an toàn thẻ video/hình ảnh, loại bỏ hoàn toàn hiện tượng viền rỗng hoặc màn hình đen khi tải từ máy tính; 5. Nút "👁️ Xem Bước Này" Nạp Ngay Lên Sân Khấu: Bấm là hiển thị ngay toàn bộ bố cục, layer và video của bước đó lên màn hình 9:16; 6. Khóa Chặt 100% Hệ Thống: Bảo toàn nguyên vẹn Window Capture OBS Zero-Copy, Voice AI Brain, Game Battle PK, Game Bản Đồ 3D.'
  },
  {
    title: '⚡ Bản Cập Nhật v4.2.9 - Sân Khấu Sạch 100% Không Dữ Liệu Rác, Xóa Layer Trực Tiếp 8 Điểm, 20 Font & 20 Typography Sang Trọng, Ghim Xuyên Suốt & Toolbar 1 Hàng',
    description: '1. Sân Khấu Sạch 100% Không Dữ Liệu Rác: Loại bỏ triệt để mọi dữ liệu placeholder, thẻ giỏ hàng hay text rác; chỉ hiển thị chính xác những gì người dùng thêm vào; 2. Nút Xóa Layer Trực Tiếp Trên Sân Khấu: Bấm chọn bất kỳ layer nào (Avatar, Video PiP, Banner ảnh, Text chữ) sẽ hiển thị nút Xóa tức thì khỏi bước; 3. 20 Phông Chữ & 20 Màu Sắc Typography: Thư viện 20 font chữ Việt hóa & 20 preset màu sắc (Neon Cyber, Gold Hoàng Gia, Flash Sale Đỏ Lửa, v.v.); 4. Chức Năng Ghim Layer Xuyên Suốt: Nút ghim 📌 cho từng layer (Video chính, PiP, Banner, Text) giúp chạy liên tục từ đầu đến cuối phiên live hoặc chỉ trong bước; 5. Tinh Gọn Bảng Điều Khiển: Xóa bỏ thanh mẫu kịch bản có sẵn, nạp 100% file từ máy tính, rút gọn thanh căn chỉnh sân khấu còn đúng 1 hàng duy nhất và khóa bố cục 100% hoạt động.'
  },
  {
    title: '⚡ Bản Cập Nhật v4.2.8 - Sân Khấu 9:16 Kéo Dài Toàn Chiều Cao, Kéo Thả & Co Giãn 8 Điểm Cố Định Theo Bước, Nạp File Trực Tiếp & Kịch Bản .MD',
    description: '1. Sân Khấu Live 9:16 Dọc Chuẩn Smartphone Toàn Chiều Cao: Chuẩn hóa khung hình dọc điện thoại 9:16 kéo dài từ trên xuống dưới, không bị vuông ngắn; 2. Kéo Thả & Co Giãn 8 Điểm Đa Lớp (8-Point Resize & Drag): Bấm vào bất kỳ lớp nào (Avatar AI, Video phụ PiP, Banner Deal, Tiêu đề chữ neon) trên sân khấu để kéo thả và co giãn linh hoạt; 3. Tự Động Lưu Cố Định Vị Trí Từng Bước (Per-Step Persistence): Vị trí và kích thước các lớp được lưu cố định theo từng bước, không bị nhảy lệch khi chuyển bước; 4. Tải Media Trực Tiếp Từ Máy Tính (Không Cần Link): Tải video/ảnh trực tiếp từ máy tính nạp thẳng 100% lên sân khấu 9:16 tức thì 0ms; 5. Tách Khung Kịch Bản Riêng & Đọc File .MD: Ô kịch bản AI rộng rãi, hỗ trợ nạp file .md, .docx, .txt, .pdf và nghe thử giọng đọc AI 0ms; 6. Khóa Chặt 100% Hệ Thống: Bảo toàn tuyệt đối mọi module khác.'
  },
  {
    title: '⚡ Bản Cập Nhật v4.2.7 - Chuẩn Hóa Sân Khấu Điện Thoại 9:16 Kéo Dài Toàn Màn Hình & Tự Động Nạp Video/Layer Lên Sân Khấu',
    description: '1. Sân Khấu Điện Thoại 9:16 Toàn Chiều Cao: Chuẩn hóa khung hình dọc điện thoại kéo dài từ trên đỉnh xuống đáy màn hình với viền bo góc kim loại và Dynamic Island; 2. Nạp Video & Media Trực Tiếp 100% Lên Sân Khấu: Bấm chọn/tải bất kỳ clip video nào là lập tức nhảy lên hiển thị trên Sân Khấu 9:16 và tự động xếp chồng theo lớp (Lớp nền chính, Video phụ PiP, Avatar AI 1-4, Banner Deal, Text Neon, TikTok Shop); 3. Căn Chỉnh & Co Giãn Linh Hoạt: Tích hợp nút Căn giữa, Tràn khung hình, Bố cục nhanh trực tiếp dưới sân khấu; 4. Sắp Xếp & Lặp Lại Timeline 24/7: Cứ chạy hoàn thành một bước là tự động hiển thị bước tiếp theo và lặp lại liên tục; 5. Khóa Chặt 100% Toàn Bộ Module Khác.'
  },
  {
    title: '⚡ Bản Cập Nhật v4.2.6 - Hợp Nhất 1 Tab Duy Nhất: Sân Khấu 9:16 Cột Trái 40% & Bảng Kịch Bản Tự Động Chia Vai 1–4 Người Cột Phải 60%',
    description: '1. Sân Khấu Live 9:16 Cột Trái (Chiếm 40% Màn Hình): Khung hình dọc điện thoại chuẩn 9:16 tích hợp trọn vẹn sức mạnh Studio 1-4 Avatar và Preview kịch bản từng bước (Video nền, Avatar nói/chờ, video phụ PiP, banner ảnh deal, tiêu đề chữ neon, giỏ hàng TikTok Shop); 2. Hợp Nhất 1 Tab Duy Nhất Cột Phải (Chiếm 60% Màn Hình): Xóa bỏ tab rời rạc, tích hợp Bộ chọn 1-4 người, Bố cục nhanh và Kho mẫu kịch bản tự động chia vai trực tiếp trên đầu bảng điều khiển; 3. Tự Động Chia Kịch Bản Cho Từng Nhân Vật: Chọn số lượng người hoặc mẫu kịch bản là hệ thống tự động sinh các bước và phân vai (Avatar 1, Avatar 2, Avatar 3, Avatar 4) đọc thoại tương ứng; 4. Đồng Bộ 0ms Chuẩn 4K 60 FPS: Nút "Đồng Bộ Ra Sân Khấu Chính" tách biệt hoàn toàn giữa Test nội bộ và Phát sóng thật; 5. Khóa Chặt 100% Hệ Thống: Bảo toàn nguyên vẹn mọi module khác.'
  },
  {
    title: '⚡ Bản Cập Nhật v4.2.5 - Bố Cục Sân Khấu Trình Chiếu Cột Trái, Bảng Điều Khiển Cột Phải & Nút Đồng Bộ Sân Khấu Riêng Biệt',
    description: '1. Thiết Kế 2 Cột Trực Quan (Split 2-Column Stage & Control): Toàn bộ Sân khấu trình chiếu Mock Live Stage 9:16 nằm cố định ở Cột Trái, nhường toàn bộ Cột Phải cho Bảng điều khiển kịch bản từng bước và cấu hình Studio 1-4 Avatar; 2. Nút "📡 ĐỒNG BỘ RA SÂN KHẤU CHÍNH" Riêng Biệt: Tách biệt hoàn toàn giữa việc Căn chỉnh / Test nội bộ và Phát trực tiếp ra màn hình chính, OBS Window Capture và Link TikTok Live Studio; 3. Đồng Bộ Đa Lớp Trực Quan: Click vào bất kỳ bước nào ở cột phải, sân khấu cột trái lập tức chuyển video nền chính, video phụ PiP, avatar đọc thoại, hiệu ứng glow nói, banner chữ neon và sản phẩm TikTok Shop; 4. Khóa Chặt 100% Hệ Thống: Bảo toàn nguyên vẹn Window Capture OBS Zero-Copy, Voice AI Brain, Game Battle, Game Bản Đồ 3D; 5. 60 FPS 4K Không Độ Trễ: Đảm bảo độ mượt mà cao nhất trên mọi nền tảng.'
  },
  {
    title: '⚡ Bản Cập Nhật v4.2.4 - Hợp Nhất Hoàn Hảo Studio 1–4 Avatar & Chuỗi Kịch Bản Live Đa Phân Đoạn (Pro)',
    description: '1. Hợp Nhất 1 Tab Duy Nhất "🎬 Studio 1–4 Avatar & Kịch Bản Live": Tích hợp trọn vẹn sức mạnh Studio 1-4 nhân vật và Chuỗi kịch bản phân đoạn 24/7 trong một giao diện tinh gọn, thông minh, dễ dùng bậc nhất; 2. Hỗ Trợ Đầy Đủ 1 Đến 4 Avatar AI: Tùy biến linh hoạt số lượng từ 1 người bán hàng độc diễn, 2 người chốt đơn, 3 người hoạt náo PK đến 4 người talkshow; 3. Thanh Điều Hướng 3 Phân Hệ (Subview Switcher): Chuyển đổi 1 chạm mượt mà giữa [🎬 Kịch Bản Từng Bước], [👥 Bố Cục Studio 1-4 Avatar] và [📚 Kho Mẫu Kịch Bản 1-4 Người]; 4. Chọn Avatar Đọc Thoại Riêng Cho Từng Bước: Từng phân đoạn kịch bản cho phép chỉ định chính xác Avatar nào đọc thoại và nhép miệng (Avatar 1, Avatar 2, Avatar 3, Avatar 4 hoặc Cả nhóm); 5. Kho Mẫu Kịch Bản Có Sẵn "Nạp 1 Click": Thư viện kịch bản đa dạng ngành nghề với nút nạp nhanh tự động chuyển thành chuỗi kịch bản phân đoạn; 6. Đồng Bộ 0ms 4K 60 FPS Trực Tiếp: Bật/Dừng tức thì 100%, đồng bộ tuyệt đối với Sân khấu live 9:16, OBS Window Capture và Link TikTok Live Studio.'
  },
  {
    title: '⚡ Bản Cập Nhật v4.2.3 - Tinh Gọn Header Kịch Bản, Nút Dừng Tức Thì, Video Phụ PiP & Tùy Chỉnh Font/Cỡ Chữ Đa Lớp',
    description: '1. Tối Ưu Toolbar Sequencer Siêu Gọn Gàng: Thu gọn thanh điều khiển còn 1 hàng duy nhất cao 45px, nhường 85% không gian màn hình cho cấu hình các bước kịch bản; 2. Nút Bật / Dừng Tức Thì: Bấm Bật chạy ngay, bấm Dừng ngắt tức khắc toàn bộ timer, giọng đọc AI và video đồng bộ 0ms; 3. Lớp Video Phụ PiP (Picture-in-Picture): Mỗi bước kịch bản hỗ trợ video phụ xếp chồng lên video nền chính với tùy chọn vị trí và kích thước; 4. Tùy Biến Typography & Kích Thước: Tự do đổi font chữ tiếng Việt (Montserrat, Be Vietnam, Lexend, Impact...), cỡ chữ, màu chữ và độ phóng to ảnh banner; 5. AI Smart Jump & Trả Lời Bình Luận: Đọc hết câu rồi tạm dừng trả lời câu hỏi bán hàng quan trọng, chèn câu dẫn mượt mà và tự động nhảy đúng bước kịch bản khi khán giả hỏi; 6. Nút Live Test Sân Khấu: Xem trước trực tiếp toàn bộ các lớp xếp chồng lên Sân Khấu Live 9:16 và OBS.'
  },
  {
    title: '⚡ Bản Cập Nhật v4.2.2 - Tự Động Liên Kết Giỏ Hàng TikTok Shop (shop.tiktok.com) & Ghim Live Thông Minh 24/7',
    description: '1. Tự Động Kết Nối & Lấy Sản Phẩm TikTok Shop: Dán đường link shop.tiktok.com để tự động đồng bộ 100% danh mục sản phẩm lên hệ thống với đầy đủ mã số (Mã #01, #02...); 2. Tự Động Ghim Theo Video Phát & Kịch Bản: Khi video hoặc kịch bản nhắc đến sản phẩm/mã số, hệ thống tự động ghim sản phẩm đó lên màn hình live; 3. Tự Động Ghim Theo Bình Luận Khán Giả: Khán giả comment hỏi mã số (mã 1, sp 2, chốt 3...) AI lập tức bắt từ khóa và ghim đúng sản phẩm lên sân khấu; 4. Đồng Bộ 0ms 4K 60 FPS: Sân khấu chính, OBS Window Capture và Link TikTok Live Studio hiển thị đồng bộ 100% thẻ ghim TikTok Shop; 5. Khóa Chặt 100% Hệ Thống: Bảo toàn nguyên vẹn mọi tab chức năng.'
  },
  {
    title: '⚡ Bản Cập Nhật v4.2.1 - Xếp Chồng Đa Lớp Sân Khấu Live, Nạp File Kịch Bản Đa Định Dạng & Sequencer Nâng Cao',
    description: '1. Xếp Chồng Đa Lớp Sân Khấu (Multi-Layer Overlay Live Stage): Mỗi bước kịch bản hỗ trợ Video nền ghim liên tục, Lớp hình ảnh banner/poster/deal và Lớp tiêu đề chữ nổi bật với hiệu ứng neon đa phong cách; 2. Nạp File Kịch Bản Trực Tiếp (.txt, .docx, .pdf, .json, .xlsx): Tải trực tiếp tài liệu kịch bản vào từng phân đoạn chỉ với 1 click cùng khung soạn thảo thoại siêu rộng rãi; 3. Đồng Bộ 0ms 60 FPS Chuẩn 9:16: Hiển thị đồng bộ tuyệt đối trên Sân khấu chính, OBS Window Capture và Link TikTok Live Studio; 4. Khóa Chặt 100% Hệ Thống: Bảo toàn nguyên vẹn toàn bộ module.'
  },
  {
    title: '⚡ Bản Cập Nhật v4.2.0 - Tự Động Kích Hoạt Đa Năng Phân Đoạn Sequencer: Video, Avatar, Giọng Đọc & Ghim Giỏ Hàng',
    description: '1. Tự Động Hóa Vận Hành Toàn Diện: Mỗi phân đoạn kịch bản tự động kích hoạt chuyển video, đổi cảnh, đọc thuyết minh AI và ghim sản phẩm giỏ hàng lên sân khấu theo đúng thời lượng cài đặt; 2. Đồng Bộ Tức Thì 0ms: Sân khấu phần mềm hiển thị trực tiếp và truyền thẳng sang OBS Window Capture cùng Link Online TikTok Live Studio (/live-stream); 3. Chuẩn Tỷ Lệ 9:16 Không Viền Đen: Tự động căn chỉnh vừa khít khung live; 4. Khóa Chặt 100% Hệ Thống: Bảo toàn tuyệt đối mọi tính năng khác.'
  },
  {
    title: '⚡ Bản Cập Nhật v4.1.9 - Đồng Bộ Hoàn Hảo Chuỗi Kịch Bản Sequencer Với Màn Hình Live, Window Capture & Link TikTok Studio',
    description: '1. Đồng Bộ Trực Tiếp Màn Hình Chính: Khi chuỗi kịch bản phân đoạn chạy, video trên Màn hình chính (Ảnh 3) tự động chuyển đổi theo đúng mốc thời gian cài đặt; 2. Phát Tức Thì Sang Window Capture & Link TikTok Live: OBS Window Capture và Link Online HTTPS (/live-stream) tự động nhận video chuyển cảnh 0ms vừa khít khung hình 9:16; 3. Thuyết Minh Giọng Đọc AI Đồng Thời: Nhân vật/MC AI đọc thuyết minh liên tục theo kịch bản trong khi phát video sản phẩm và review; 4. Khóa Chặt 100% Hệ Thống: Bảo toàn nguyên vẹn Window Capture OBS Zero-Copy, Voice AI Brain, Game Battle, Game Bản Đồ 3D.'
  },
  {
    title: '⚡ Bản Cập Nhật v4.1.8 - Tinh Gọn Giao Diện, Loại Bỏ Nút Bấm Trùng Lặp & Giữ Menu Chuỗi Kịch Bản Chuẩn',
    description: '1. Tinh Gọn Giao Diện Desktop: Loại bỏ nút bấm thừa trên Top Control Bar để giao diện gọn gàng, chuyển toàn quyền truy cập Sequencer vào Menu chính; 2. Truy Cập Thuận Tiện: Duy trì tab "🎬 Chuỗi Kịch Bản Live" trong Menu chức năng và Header Navigation; 3. Khóa Chặt 100% Toàn Bộ Module: Bảo toàn tuyệt đối mọi tính năng đang vận hành (Window Capture OBS Zero-Copy, Voice AI Brain, Game Battle, Game Bản Đồ 3D).'
  },
  {
    title: '⚡ Bản Cập Nhật v4.1.7 - Hiển Thị Tab Chuỗi Kịch Bản Live (Sequencer) Trực Quan Trên Menu Chính & Header',
    description: '1. Tab Menu Chính Thức: Đặt tab "🎬 Chuỗi Kịch Bản Live" trực tiếp trên Header Navbar và Menu Dropdown tài khoản giúp truy cập 1 chạm tức thì; 2. Tương Thích Hoàn Hảo Web & Máy Tính (Mac & Windows): Hiển thị đồng bộ trên mọi nền tảng; 3. Khóa Chặt 100% Hệ Thống: Bảo toàn nguyên vẹn Window Capture OBS Zero-Copy, Voice AI Brain, Game Battle, Game Bản Đồ 3D, Multi-Avatar.'
  },
  {
    title: '⚡ Bản Cập Nhật v4.1.6 - Hiển Thị Trực Quan Nút Bấm Chuỗi Kịch Bản (Sequencer) & Mở Mặc Định 100%',
    description: '1. Hiển Thị Nổi Bật Trên Thanh Điều Khiển: Bổ sung nút bấm trực tiếp "🎬 CHUỖI KỊCH BẢN" ngay trên thanh công cụ chính và menu ứng dụng giúp người dùng nhìn thấy và mở ngay lập tức; 2. Nạp Mặc Định Chuỗi Kịch Bản: Mở trực tiếp giao diện Sequencer với đầy đủ Preset mẫu khi mở Cài đặt Sự kiện; 3. Đồng Bộ Hoàn Hảo 60 FPS 4K: Giữ nguyên vẹn 100% tất cả các tab chức năng đã khóa.'
  },
  {
    title: '⚡ Bản Cập Nhật v4.1.5 - Tích Hợp Chính Thức Trình Điều Phối Chuỗi Kịch Bản Phân Đoạn & Quản Lý Preset Đa Dạng',
    description: '1. Trình Điều Phối Chuỗi Kịch Bản Trực Quan: Bổ sung module Điều Phối Chuỗi Kịch Bản (Sequencer) ngay trong Workspace Tác Vụ, cho phép lưu trữ và chuyển đổi linh hoạt giữa nhiều Preset bán hàng (Mỹ phẩm, Thời trang, Gia dụng...); 2. Tự Động Hóa Vận Hành 24/7: Tự động điều phối chuyển bước từ AI Avatar mở màn, Q&A bình luận TikTok Live, phát video sản phẩm, video feedback đến CTA chốt sale; 3. Đồng Bộ 0ms Chuẩn 60 FPS 4K: Chuyển đổi mượt mà không độ trễ trên TikTok Live Studio và OBS; 4. Khóa Chặt 100% Toàn Bộ Module: Bảo toàn tuyệt đối mọi tab chức năng hiện có.'
  },
  {
    title: '⚡ Bản Cập Nhật v4.1.4 - Chuẩn Hóa Chuỗi Kịch Bản Livestream Tự Động Đa Phân Đoạn & Vòng Lặp Bán Hàng 24/7',
    description: '1. Quy Chuẩn Vận Hành Đa Phân Đoạn (Multi-Section Sequencer): Hỗ trợ thiết lập chuỗi sự kiện tự động tuần tự từ AI Avatar mở màn, phản hồi bình luận TikTok Live bằng Voice/Lip-sync, phát video sản phẩm, video feedback cho đến CTA chốt sale; 2. Tự Động Định Giờ & Chuyển Đoạn: Điều phối thời lượng phát từng video và tác vụ chính xác theo từng giây; 3. Khóa Chặt 100% Hệ Thống: Bảo toàn tuyệt đối mọi tab chức năng, subview và module không bị ảnh hưởng chéo.'
  },
  {
    title: '⚡ Bản Cập Nhật v4.1.3 - Khóa Chặt Toàn Diện Các Tab Chức Năng, Subview & Cách Ly Tuyệt Đối Luồng Dữ Liệu',
    description: '1. Khóa Chặt Toàn Diện Các Tab & Subview: Cách ly hoàn toàn tất cả các tab chức năng (Idol AI, Window Capture, Game Battle, Game Bản Đồ 3D, Voice AI Brain, Livestream Studio) đảm bảo không có bất kỳ lệnh ngoài luồng nào tác động chéo; 2. Điều Hướng & Thực Thi Chuẩn Xác: Chỉ kích hoạt xử lý khi nhận đúng yêu cầu mục tiêu từ người dùng và đường link tương ứng; 3. Bảo Toàn Mã Nguồn & Trạng Thái: Đảm bảo độ ổn định 100% cho mọi module đang vận hành; 4. Tốc Độ & Độ Sắc Nét Cao Cấp: Duy trì 60 FPS 4K cho toàn bộ luồng phát TikTok Live Studio và OBS.'
  },
  {
    title: '⚡ Bản Cập Nhật v4.1.2 - Khung Hình Pristine 9:16 Tràn Viền Tinh Khiết Cho TikTok Live Studio & Tối Ưu Tải Trực Tiếp',
    description: '1. Khung Hình Pristine 9:16 Tràn Viền: Tối ưu 100% tỷ lệ dọc 1080x1920 không viền đen, ẩn thanh điều khiển thừa giúp khung hình phát livestream sạch sẽ hoàn hảo; 2. Link Tải Trực Tiếp Tối Ưu: Phục vụ trực tiếp binary cài đặt mới nhất từ GitHub Releases/Vercel Edge, triệt tiêu hoàn toàn lỗi bot verification; 3. Đồng Bộ Tức Thì 0ms: Mọi thao tác đổi video từ phần mềm phản hồi tức thì với tốc độ 60 FPS 4K; 4. Khóa Chặt 100% Toàn Bộ Hệ Thống: Bảo toàn nguyên vẹn Window Capture OBS Zero-Copy, Voice AI Brain, Game Battle, Game Bản Đồ 3D.'
  },
  {
    title: '⚡ Bản Cập Nhật v4.1.1 - Tích Hợp Đầy Đủ Cloudflare Tunnel Cho Windows Standalone & Nhúng Video Tự Động 100%',
    description: '1. Đóng Gói Binary Cloudflare Windows: Tích hợp sẵn cloudflared.exe chính thức vào gói cài đặt Windows Standalone ZIP giúp mọi máy tính tự động tạo link HTTPS ngay khi mở app; 2. Tự Động Đẩy Video Sang Luồng Live: Video chọn trong app tự động nạp thẳng vào link TikTok Live Studio với tốc độ 60 FPS 4K; 3. Đồng Bộ Trực Tiếp Thời Gian Thực: Không cần thiết lập phức tạp, dán link là phát ngay tức thì; 4. Khóa Chặt 100% Toàn Bộ Hệ Thống: Bảo toàn nguyên vẹn Window Capture OBS, Voice AI Brain, Game Battle, Game Bản Đồ.'
  },
  {
    title: '⚡ Bản Cập Nhật v4.1.0 - Khắc Phục Triệt Để Link Live TikTok Live Studio & Nhúng Sẵn Video Source Tức Thì 0ms',
    description: '1. Nhúng Trực Tiếp Video Source: Server tự động nạp thẻ video src vào trang live ngay từ lần tải đầu tiên, TikTok Live Studio phát video ngay tức khắc trong 0ms; 2. Tối Ưu Hóa CORS & CSP Toàn Diện: Bổ sung cấu hình đa phương thức GET/HEAD/OPTIONS giúp TikTok Studio xác thực URL 100% hợp lệ không báo lỗi đỏ; 3. Đồng Bộ Tức Thì Thời Gian Thực: Phần mềm phát bất kỳ video nào thì luồng live chuyển đổi mượt mà 60 FPS 4K; 4. Khóa Chặt 100% Hệ Thống: Bảo toàn nguyên vẹn Window Capture OBS, Voice AI Brain, Game Battle, Game Bản Đồ.'
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
