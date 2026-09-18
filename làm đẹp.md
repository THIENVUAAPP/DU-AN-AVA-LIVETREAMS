# 🚀 BẢN ĐẶC TẢ KỸ THUẬT & HỆ THỐNG PROMPT AI CAO CẤP
## DỰ ÁN: XÂY DỰNG LÕI HIỆU ỨNG (ENGINE) CHUẨN CAPCUT / BYTEPLUS
---

**Mục tiêu:** Bản tài liệu này được thiết kế như một "bản vẽ thi công" chi tiết nhất để anh giao cho đội ngũ Developer hoặc dùng trực tiếp với các AI lập trình (như Claude 3.5 Sonnet, GPT-4o, Cursor). Nó sẽ tạo ra một Core Engine xử lý AR, Làm đẹp, VFX, Audio bằng công nghệ Open-source (C++, OpenGL, MediaPipe), có thể dễ dàng nhúng (embed) vào phần mềm Livestream và phần mềm Edit Video hiện tại của anh.

---

## PHẦN 1: TỔNG QUAN KIẾN TRÚC HỆ THỐNG (TECH STACK)
Để đạt sức mạnh như CapCut, hệ thống KHÔNG xử lý bằng CPU (sẽ rất giật lag). Tất cả phải được đẩy xuống GPU.
*   **Ngôn ngữ lõi (Core Engine):** `C++` (Bắt buộc để đảm bảo tốc độ Real-time 60FPS).
*   **Xử lý đồ họa & Hiệu ứng:** `OpenGL` (hoặc Vulkan/Metal tùy nền tảng). Sử dụng `GLSL Shaders` để làm mượt da, bóp mặt, áp màu.
*   **AI Models (Face/Body/Matting):** `Google MediaPipe` (C++ API). Nhanh, nhẹ, miễn phí, chính xác cao.
*   **Xử lý Audio:** `SoLoud` (C++) để phát SFX độ trễ thấp hoặc `RtAudio` để mix luồng âm thanh Livestream.
*   **Xử lý Video (VOD):** `FFmpeg` (C API) để giải mã (decode) và đóng gói (encode) video.

---

## PHẦN 2: BỘ CÂU LỆNH (PROMPT) CHO CLAUDE ĐỂ CODE HOÀN CHỈNH

*Hướng dẫn sử dụng: Anh hãy copy từng hộp Prompt dưới đây, gửi cho Claude 3.5 Sonnet (hoặc Cursor AI). Đợi AI code xong và chạy thử thành công Module 1 mới tiếp tục gửi Prompt Module 2.*

### 🟩 MODULE 1: CORE TRACKING (NHẬN DIỆN KHUÔN MẶT CẤP ĐỘ CAO)
**Chức năng:** Lấy tọa độ 468 điểm trên khuôn mặt theo thời gian thực (Real-time). Đây là nền tảng bắt buộc để làm tính năng trang điểm và bóp mặt.

> **Prompt cho Claude:**
> "Đóng vai một chuyên gia C++ và Computer Vision. Hãy viết cho tôi một Module C++ sử dụng Google MediaPipe (C++ API) để thực hiện Face Tracking. 
> Yêu cầu chi tiết:
> 1. Input: Luồng video/camera (cv::Mat từ OpenCV).
> 2. Quá trình: Đưa frame vào MediaPipe Face Mesh model.
> 3. Output: Trả về một struct/class chứa tọa độ (x, y, z) của 468 landmarks trên khuôn mặt.
> 4. Tối ưu hóa: Phải chạy luồng bất đồng bộ (Asynchronous/Multi-threading) để không block main thread, đảm bảo đạt 60FPS. 
> 5. Cung cấp mã nguồn CMakeLists.txt đầy đủ để tôi có thể build được trên môi trường Windows/Mac. Viết code theo chuẩn OOP, dễ dàng tích hợp vào dự án C++ có sẵn."

---

### 🟩 MODULE 2: BEAUTY & FACE RESHAPE (LÀM ĐẸP VÀ BÓP MẶT NHƯ CAPCUT)
**Chức năng:** Làm mịn da đỉnh cao không lẹm vào tóc/mắt; bóp cằm, gọt mặt, làm to mắt.

> **Prompt cho Claude:**
> "Bây giờ, hãy viết hệ thống Làm đẹp (Beauty Engine) bằng OpenGL (GLSL Shaders) tích hợp với C++. 
> Tôi đã có tọa độ 468 điểm từ MediaPipe. Hãy thực hiện 2 tính năng sau:
> 
> 1. Tính năng Skin Smoothing (Làm mịn da): Viết một Fragment Shader sử dụng thuật toán 'Bilateral Filter' hoặc 'Edge-Preserving Blur'. Sử dụng mask (mặt nạ) từ tọa độ khuôn mặt để CHỈ làm mịn vùng da, giữ nguyên độ nét của mắt, lông mày, môi và phông nền.
> 2. Tính năng Face Reshaping (Bóp mặt, to mắt): Viết một Vertex Shader / Fragment Shader thực hiện 'Image Warping' (Biến dạng lưới). Sử dụng thuật toán Local Translation / Liquify:
> - Thuật toán kéo giãn ảnh ở tọa độ điểm mắt (để làm to mắt).
> - Thuật toán bóp ảnh ở mảng tọa độ cằm/má (gọt mặt V-line).
> - Thêm các tham số Uniform (float level_smooth, float level_eye_enlarge, float level_v_line) từ 0.0 đến 1.0 để tôi có thể làm thanh trượt (slider) trên UI cho người dùng điều chỉnh.
> Cung cấp toàn bộ mã nguồn GLSL và C++ OpenGL wrapper để load các shader này."

---

### 🟩 MODULE 3: AI BACKGROUND MATTING (TÁCH NỀN/THAY PHÔNG ẢO)
**Chức năng:** Tách người ra khỏi nền không cần phông xanh (Green Screen) như chức năng Remove Background của CapCut.

> **Prompt cho Claude:**
> "Viết một module C++ thực hiện tính năng Real-time Background Matting (Tách nền).
> Yêu cầu:
> 1. Sử dụng MediaPipe Selfie Segmentation (C++ API) để tạo ra Alpha Mask (Mặt nạ trong suốt) của người.
> 2. Viết một OpenGL Shader nhận 2 texture: Texture Camera (chứa người) và Texture Background (Ảnh/Video nền ảo do người dùng chọn), cùng với Alpha Mask.
> 3. Shader thực hiện trộn (Alpha Blending): Nếu Alpha = 1 (Người) thì lấy pixel từ Camera, nếu Alpha = 0 (Nền) thì lấy pixel từ Texture Background. Cần có Feather (làm mờ viền) ở mép Alpha Mask để tóc và viền cơ thể trông tự nhiên, không bị răng cưa.
> 4. Hãy đảm bảo code C++ quản lý tối ưu bộ nhớ Texture trên GPU (VRAM) để tránh Memory Leak."

---

### 🟩 MODULE 4: DYNAMIC VFX & COLOR GRADING (HIỆU ỨNG VÀ MÀU SẮC)
**Chức năng:** Các hiệu ứng chuyển động thời thượng (Glitch, Shake, Flash) và bộ lọc màu (LUTs).

> **Prompt cho Claude:**
> "Viết một thư viện OpenGL C++ quản lý Pipeline Hiệu ứng (Video Effects) theo chuỗi. 
> 1. Tính năng LUT (Color Grading): Viết một Fragment Shader đọc file 3D LUT (.cube đã chuyển sang 3D Texture) để áp màu nghệ thuật cho khung hình. Khai báo tham số Uniform intensity (0.0 - 1.0) để chỉnh độ đậm nhạt của màu.
> 2. Tính năng Motion VFX: Viết 3 Shaders cơ bản của CapCut:
> - RGB Glitch: Tách kênh màu R, G, B và dịch chuyển tọa độ X theo hàm Sine và Time.
> - Camera Shake/Zoom: Scale matrix kết hợp hàm dao động (Perlin Noise hoặc Sine) tác động lên Vertex Shader để tạo hiệu ứng rung bóp khung hình.
> - Flash/Strobe: Blend màu trắng với khung hình theo chu kỳ thời gian (Time).
> 3. Trình quản lý C++ (Effect Manager): Cho phép tôi truyền vào danh sách các hiệu ứng (ví dụ: áp LUT trước -> rồi đến Glitch -> rồi mới xuất ra màn hình). Code cần linh hoạt để tôi thêm hàng trăm Shader khác sau này."

---

### 🟩 MODULE 5: REAL-TIME SOUNDBOARD (CHO LIVESTREAM) & AUDIO MIXING
**Chức năng:** Bảng điều khiển âm thanh meme (SFX), bấm phím tắt là phát, tự động mix vào luồng Mic để Livestream.

> **Prompt cho Claude:**
> "Viết một hệ thống Audio Manager bằng C++ sử dụng thư viện SoLoud hoặc RtAudio dành cho phần mềm Livestream.
> Chức năng yêu cầu:
> 1. Lấy luồng Microphone hiện tại của hệ điều hành.
> 2. Quản lý một Soundboard (Kho SFX): Có thể load nhiều file âm thanh ngắn (.wav, .mp3) vào RAM để chờ sẵn (Cache).
> 3. Chức năng Global Hotkey (Phím tắt toàn cục): Lắng nghe sự kiện bàn phím. Ví dụ người dùng bấm Numpad 1, lập tức Play(file_sfx_1).
> 4. Audio Mixing (Trộn âm): Trộn tín hiệu âm thanh của SFX đang phát vào chung với luồng Microphone (tính toán PCM data) để tạo ra một Virtual Audio Device (Thiết bị âm thanh ảo) xuất ra cho các phần mềm khác, hoặc đẩy trực tiếp lên luồng RTMP/WebRTC của phần mềm Livestream đang có.
> 5. Có hàm SetVolume() độc lập cho Mic và SFX."

---

### 🟩 MODULE 6: HỆ THỐNG CLOUD ASSETS (TẢI TÀI NGUYÊN ĐỘNG)
**Chức năng:** Hệ thống tải Effect, Sticker từ Server về, không làm nặng file cài đặt gốc.

> **Prompt cho Claude:**
> "Viết một module C++ (hoặc Node.js/C# tùy thuộc vào backend của app) để xử lý việc Dynamic Asset Download (Tải tài nguyên động) giống CapCut.
> 1. Có một hàm gọi API (REST/JSON) về Server để lấy danh sách các Effect/Filter mới nhất (gồm ID, Tên, URL ảnh Thumbnail, URL file .zip của Effect, Phiên bản).
> 2. Lưu danh sách này vào SQLite hoặc JSON local. Hiển thị Thumbnail lên UI.
> 3. Khi người dùng click vào một Effect chưa được tải, thực hiện tải file .zip bất đồng bộ, hiển thị % Progress. Tải xong thì giải nén vào thư mục %AppData%/MyStudio/Effects/ID_Effect.
> 4. Quản lý Cache: Nếu file đã tải, lần sau click vào sẽ lập tức load từ thư mục Local lên Effect Manager (của Module 4). Xử lý an toàn các lỗi rớt mạng khi đang tải."

---

## PHẦN 3: HƯỚNG DẪN TÍCH HỢP CHO ĐỘI NGŨ CỦA ANH
Sau khi Claude viết xong 6 Module trên, anh sẽ có một tập hợp các thư viện `.dll` (Windows) hoặc `.so`/`.dylib` (Mac/Linux), cùng với các file `Header (.h)`.
Đội ngũ Dev đang quản lý app Edit và Livestream của anh chỉ cần làm các bước sau:

1. **Khởi tạo Engine:** Đặt hàm `BeautyEngine::Init()` vào đầu vòng đời phần mềm của anh.
2. **Chèn luồng Video (Livestream):** Trước khi đưa hình ảnh từ Camera lên màn hình preview hoặc đẩy lên RTMP, hãy chèn hàm `Frame = BeautyEngine::Process(Frame, configs)` vào giữa. `configs` là các thông số do người dùng kéo trên màn hình (mịn da 50%, to mắt 30%).
3. **Chèn luồng Video (Edit VOD):** Khi Render Timeline, lấy từng frame của Video gốc chèn qua Engine để áp Shader, sau đó đẩy ngược lại FFmpeg để xuất file MP4.
4. **Tuyển dụng & Vận hành:** Phần khó nhất đã được giải quyết bằng AI. Tiền vốn tiết kiệm được (đáng lẽ phải mua CapCut SDK), anh hãy đập vào việc thuê 2-3 bạn **Motion Designer** chuyên làm hiệu ứng 3D, Shader và file âm thanh Meme (cắt ghép file hot trend trên Tiktok). Hệ sinh thái của anh có sống được hay không nằm ở kho Content (tài nguyên) này cập nhật nhanh hay chậm.

Chúc anh triển khai dự án bùng nổ và thành công rực rỡ!
