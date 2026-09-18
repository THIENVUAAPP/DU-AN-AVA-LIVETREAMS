const fs = require('fs');
const file = 'src/components/LivestreamClonerStudio.jsx';
let content = fs.readFileSync(file, 'utf8');

const target1 = `                      ) : (
                        <iframe 
                          src={getEmbedUrl(stream.url)}
                          title="Real-time Livestream Player"
                          className="w-full h-full border-none absolute inset-0"
                          allowFullScreen
                          allow="autoplay; encrypted-media; fullscreen"
                        />
                      )`;

const replacement = `                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white p-4 text-center">
                          <svg className="w-12 h-12 text-red-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                          </svg>
                          <h3 className="text-sm font-bold uppercase mb-1">LỖI KẾT NỐI (BỊ TIKTOK CHẶN CAPTCHA)</h3>
                          <p className="text-xs text-gray-400">
                            Hệ thống mạng của bạn vừa bị TikTok yêu cầu giải Captcha.<br/>
                            Vui lòng đổi IP mạng (Tắt bật lại Wifi/4G) rồi tải lại trang!
                          </p>
                        </div>
                      )`;

if (content.includes(target1)) {
    content = content.replace(target1, replacement);
    content = content.replace(target1, replacement); // Replace both occurrences
    fs.writeFileSync(file, content);
    console.log("Successfully patched!");
} else {
    console.log("Target not found!");
}
