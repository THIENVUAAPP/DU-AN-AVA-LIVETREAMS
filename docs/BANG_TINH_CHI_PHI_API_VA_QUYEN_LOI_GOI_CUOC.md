# BẢNG TÍNH TOÁN TOÀN DIỆN CHI PHÍ API & ĐỊNH MỨC TOKEN CHO CÁC GÓI CƯỚC AVALIVE
> **Mục tiêu cốt lõi**: Chi phí API (ElevenLabs TTS + LLM Brain API) **chiếm tối đa 35%** giá bán của gói cước, đảm bảo **biên lợi nhuận gộp $\ge 65\%$** cho nền tảng.

---

## 1. NGUYÊN LÝ TÍNH TOÁN & ĐƠN GIÁ API GỐC (THỰC TẾ)

### A. Đơn Giá API Nhà Cung Cấp
| Dịch vụ API | Đơn giá thị trường (USD) | Quy đổi VNĐ (Tỷ giá 25.500đ) | Chi phí trên 1 đơn vị sử dụng |
| :--- | :--- | :--- | :--- |
| **ElevenLabs TTS (Multilingual v2)** | \$0.15 - \$0.18 / 1.000 ký tự *(Gói Scale/Enterprise)* | ~3.800đ - 4.500đ / 1.000 ký tự | **~3.8đ - 4.5đ / 1 ký tự đọc** |
| **LLM Brain (Google Gemini 1.5 Flash)**<br>*(Mô hình số 1: Tốc độ <400ms, Rẻ nhất & Thông minh nhất)* | \$0.075 / 1.000.000 tokens input<br>\$0.30 / 1.000.000 tokens output | ~1.9đ - 7.6đ / 1.000 tokens LLM | **~0.5đ - 1.5đ / 1 câu hỏi - đáp thông minh** |
| **Server Relay / Duy trì Phiên Live** | Chi phí hạ tầng cloud băng thông | ~500đ / giờ live | **~0.15đ / phút live** |

---

### B. Mức Độ Tiêu Hao Thực Tế Trong 1 Phiên Livestream (2 - 3 Giờ)
Trong 1 phiên livestream thực tế, Idol AI **không nói liên tục 100% thời gian** (để tránh gây cảm giác máy móc, quá tải cho người xem), mà luân phiên:
- **Thời gian Idol nói tương tác / chốt đơn**: Chiếm ~35% thời lượng (~40 - 50 câu nói tương tác / 2 giờ).
- **Độ dài trung bình 1 câu nói tiếng Việt**: 50 - 70 ký tự.
- **Tổng ký tự phát sinh trong 1 phiên live 2 giờ**: $\approx 2.500 - 3.500$ ký tự ElevenLabs.
- **Tổng chi phí API thực tế cho 1 phiên live 2 giờ**:
  - ElevenLabs TTS: $3.000 \times 4.0\text{đ} = 12.000\text{đ}$
  - LLM Brain (100 lượt xử lý chat/prompt): $100 \times 2.5\text{đ} = 250\text{đ}$
  - Hạ tầng phiên live: $1.000\text{đ}$
  - **👉 Tổng chi phí API thực tế: ~13.250đ / phiên live 2 giờ** (~6.600đ / giờ live).

---

## 2. QUY ƯỚC ĐỔI TOKEN HỆ THỐNG & CƠ CHẾ TRỪ TỰ ĐỘNG

| Hành động | Tỷ lệ Trừ Token | Cơ chế trừ | Mục đích |
| :--- | :--- | :--- | :--- |
| **1. Giọng nói ElevenLabs (Idol / Quản lý / Game)** | **1 Token = 1 Ký tự thực đọc** | Real-time theo độ dài câu | Đảm bảo minh bạch 100%, nói bao nhiêu trừ bấy nhiêu |
| **2. Duy trì LLM Brain & Kết nối Phòng Live** | **10 Token / 1 phút live** *(5 Token/30s)* | Định kỳ 30 giây khi phòng live ON | Chi trả cho server & LLM tóm tắt comment real-time |
| **3. Cảnh báo số dư Token thấp** | Khi balance < **500 Token** | Toast cảnh báo màu vàng | Khách hàng chủ động nạp thêm tránh ngắt quãng |
| **4. Tự động dừng an toàn** | Khi balance = **0 Token** | Dừng live, giữ nguyên cấu hình | Tránh âm tài khoản & thất thoát chi phí API |

---

## 3. BẢNG PHÂN TÍCH TÀI CHÍNH CHI TIẾT (NGÂN SÁCH API $\le 35\%$)

### A. GÓI THUÊ BAO BẢN QUYỀN (SUBSCRIPTION)

| Thông số | Gói Khởi Nghiệp (1 Tháng) | Gói Tăng Trưởng (3 Tháng) | Gói Doanh Nghiệp VIP (1 Năm) |
| :--- | :---: | :---: | :---: |
| **Giá Bán Khách Hàng (VNĐ)** | **499.000 VNĐ** | **1.390.000 VNĐ** *(~463k/th)* | **3.500.000 VNĐ** *(~291k/th)* |
| **Trần Chi Phí API Tối Đa (35%)** | **174.650 VNĐ** | **486.500 VNĐ** | **1.225.000 VNĐ** |
| **Token Cấp Cho Khách Hàng** | **12.000 Token** | **40.000 Token** *(Thưởng +15%)* | **120.000 Token** *(Thưởng +25%)* |
| **Chi Phí API Thực Tế Khi Dùng Hết** | **~52.000 VNĐ** | **~168.000 VNĐ** | **~490.000 VNĐ** |
| **Tỷ Lệ Chi Phí API Thực Tế** | **10.4%** *(Rất an toàn $\le 35\%$)* | **12.1%** *(Rất an toàn $\le 35\%$)* | **14.0%** *(Rất an toàn $\le 35\%$)* |
| **Lợi Nhuận Gộp Nền Tảng (Gross Profit)** | **447.000 VNĐ (89.6%)** | **1.222.000 VNĐ (87.9%)** | **3.010.000 VNĐ (86.0%)** |
| **Số Giờ Live Tương Đương** | **200 Giờ Live** | **Không giới hạn** | **Không giới hạn** |
| **Khả năng phục vụ phiên live thực tế** | **~4 - 5 Phiên Live Chuyên Sâu**<br>*(hoặc 200 lượt thoại ElevenLabs)* | **~15 - 18 Phiên Live Chuyên Sâu**<br>*(hoặc 650 lượt thoại ElevenLabs)* | **~50 - 60 Phiên Live Chuyên Sâu**<br>*(hoặc 2.000 lượt thoại ElevenLabs)* |

---

### B. 3 GÓI PHỤ NẠP THÊM TOKEN (ADD-ON PACKAGES - HẠN 90 NGÀY)
Dành cho khách hàng livestream với tần suất cao, cần nạp thêm Token khi đã dùng hết định mức trong tháng:

| Thông số | Gói Token Khởi Nghiệp | Gói Token Tăng Trưởng (x3) | Gói Token Đột Phá VIP (x9) |
| :--- | :---: | :---: | :---: |
| **Giá Bán (VNĐ)** | **499.000 VNĐ** | **1.497.000 VNĐ** | **4.491.000 VNĐ** |
| **Token Gốc** | 10.000 Token | 30.000 Token | 90.000 Token |
| **Tặng Thưởng Khuyến Mãi** | **+10%** (+1.000 Token) | **+15%** (+4.500 Token) | **+20%** (+18.000 Token) |
| **Tổng Token Nhận Được** | **11.000 Token** | **34.500 Token** | **108.000 Token** |
| **Chi Phí API Thực Tế (ElevenLabs + LLM)** | **~48.000 VNĐ** | **~148.000 VNĐ** | **~460.000 VNĐ** |
| **Tỷ Lệ Chi Phí API / Giá Bán** | **9.6%** ($\le 35\%$) | **9.9%** ($\le 35\%$) | **10.2%** ($\le 35\%$) |
| **Lợi Nhuận Gộp Nền Tảng** | **451.000 VNĐ (90.4%)** | **1.349.000 VNĐ (90.1%)** | **4.031.000 VNĐ (89.8%)** |
| **Hạn Sử Dụng** | **90 Ngày (3 Tháng)** | **90 Ngày (3 Tháng)** | **90 Ngày (3 Tháng)** |

---

## 4. BẢNG SO SÁNH QUYỀN LỢI NGƯỜI DÙNG KHI MUA TỪNG GÓI CƯỚC

| Quyền Lợi & Tính Năng | Gói 1 Tháng (499.000đ) | Gói 3 Tháng (1.390.000đ) | Gói 1 Năm VIP (3.500.000đ) | Gói Add-on Token (499k - 4.49tr) |
| :--- | :---: | :---: | :---: | :---: |
| **Số Lượng Idol AI** | 2 Nhân vật | 5 Nhân vật | **Không giới hạn** | Theo gói bản quyền chính |
| **Số Kênh Multistream Đồng Thời** | 3 Nền tảng (TikTok, FB, Shopee) | 5 Nền tảng cùng lúc | **Không giới hạn** luồng | Theo gói bản quyền chính |
| **Chất Lượng Video Livestream** | Full HD 1080p 60fps | 2K / 4K Siêu Nét | **4K Dedicated 60fps** | Theo gói bản quyền chính |
| **Hệ Giọng Đọc 100% ElevenLabs** | 3 Kênh: Idol + Quản Lý + BLV | 3 Kênh + Clone Giọng Riêng | 3 Kênh + Clone Giọng VIP | 3 Kênh đầy đủ |
| **Game PK Chiến Đấu 2 Phe (TikTok)** | Đầy đủ bản đồ & hiệu ứng | Tùy biến quà tặng & âm thanh | Tùy biến toàn diện 3D | Hỗ trợ theo token thực |
| **Tính Năng Tạo Idol Bằng 1 Ảnh** | Không hỗ trợ | Giảm 50% phí tạo | **Miễn phí độc quyền** | Không hỗ trợ |
| **Auto-Trigger Chốt Đơn & Flash Sale** | Cơ bản 1-chạm | Nâng cao theo kịch bản | Tự động hóa thông minh | Không ảnh hưởng |
| **Băng Thông & Tốc Độ Xử Lý AI** | Tiêu chuẩn | Ưu tiên cao | **Tối đa VIP Dedicated** | Ưu tiên theo gói |
| **Hỗ Trợ Kỹ Thuật** | Giờ hành chính qua Chat | Ưu tiên 24/7 | **Kỹ thuật viên 1-1 riêng biệt** | Theo gói bản quyền |

---

## 5. KẾT LUẬN & CAM KẾT HIỆU QUẢ TÀI CHÍNH
1. **An Toàn Tuyệt Đối**: Toàn bộ các gói cước và gói token đều có tỷ lệ chi phí API thực tế dao động từ **9.6% đến 14.0%**, thấp hơn rất nhiều so với ngưỡng trần **35%** mà Ban Giám Đốc đề ra.
2. **Biên Lợi Nhuận Cao ($\ge 85\%$)**: Giúp nền tảng có ngân sách vững chắc để tái đầu tư máy chủ, nâng cấp tính năng và mở rộng đội ngũ chăm sóc khách hàng.
3. **Trải Nghiệm Khách Hàng Xuất Sắc**: Người dùng được tận hưởng giọng đọc ElevenLabs siêu thực hàng đầu thế giới mà không lo chi phí phát sinh ngoài ý muốn.
