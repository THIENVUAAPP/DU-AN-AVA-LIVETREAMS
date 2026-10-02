const fs = require('fs');
const file = 'src/components/genaidol/UpdateNotificationModal.jsx';
let code = fs.readFileSync(file, 'utf-8');
code = code.replace(/const APP_VERSION = '5.4.38';/, "const APP_VERSION = '5.4.39';");
code = code.replace(/<li className="flex items-start gap-2">[\s\S]*?<\/ul>/, `<li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-1">✔</span>
                <span><b>Fix Mac App Localhost:</b> Bổ sung kiểm tra và yêu cầu bắt buộc Node.js v18+ để khắc phục lỗi không thể khởi động Server trên macOS.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-1">✔</span>
                <span><b>Fix Kích thước TikTok Live Studio:</b> Ép khung 9:16 chính giữa màn hình (aspect-ratio chuẩn) cho Window Capture để video không bị méo/kéo dãn. Tắt sạch hiệu ứng giật lag CEF.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-1">✔</span>
                <span><b>Fix Chào khách (Welcome):</b> Gỡ bỏ lỗi tự chào chính mình (kênh chủ) khi vừa kết nối. Đọc đủ nội dung khách comment trước khi trả lời. Giãn cách đọc comment hợp lý hơn (5-8s) chống lặp.</span>
              </li>
            </ul>`);
fs.writeFileSync(file, code);
console.log('UpdateNotificationModal updated!');
