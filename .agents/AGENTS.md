
## Workflow Rule
1. Every time a task is finished and reviewed with the user, ALWAYS commit and push the code to Github immediately. This is the most important requirement.
2. Mỗi lần hoàn thành một task là BẮT BUỘC tăng 1 bậc phiên bản cập nhật (version bump ví dụ: 1.6.3 -> 1.6.4 -> 1.6.5...) duy trì xuyên suốt quá trình code, để không bao giờ bị trùng lặp bản cập nhật và luôn kích hoạt UpdateNotificationModal cho người dùng.
3. TUYỆT ĐỐI KHÔNG SỬ DỤNG ĐƯỜNG LINK CHẠY TRÊN LOCAL (localhost, 127.0.0.1) CHO LUỒNG PHÁT LIVESTREAM (TikTok Live Studio, OBS Browser Source). TikTok Live Studio chặn localhost hoàn toàn. Mọi link live phát video, game, idol BẮT BUỘC là đường link ONLINE HTTPS (https://...trycloudflare.com hoặc https://avalivepro.vercel.app), đảm bảo mượt mà 60 FPS, không giật lag, không đứng hình.
4. LUÔN LUÔN ĐẢM BẢO TẤT CẢ CÁC FILE CÀI ĐẶT TẢI VỀ PHẢI LÀ BẢN CẬP NHẬT MỚI NHẤT: Mọi endpoint tải file (`/api/download-windows`, `/api/download-mac`, `api/download.js`, `backend/server.cjs`, `downloadOS.js`) BẮT BUỘC luôn tự động phân giải và phục vụ đúng gói cài đặt ZIP của phiên bản mới nhất (`package.json` và GitHub Latest Release), tuyệt đối KHÔNG hardcode hoặc phục vụ phiên bản cũ cho người dùng.


