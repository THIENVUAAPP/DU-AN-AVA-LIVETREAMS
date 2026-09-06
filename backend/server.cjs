// ============================================================
// CRASH GUARDS: Đảm bảo server không bao giờ bị tắt bởi unhandled errors
// ============================================================
process.on('uncaughtException', (err) => {
  console.warn('[AvaLive Crash Guard] Uncaught Exception caught safely:', err?.message || err);
});
process.on('unhandledRejection', (reason) => {
  console.warn('[AvaLive Crash Guard] Unhandled Rejection caught safely:', reason);
});

require('dotenv').config();
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');
const fs = require('fs');
const https = require('https');
const dns = require('dns');
const cors = require('cors');

// ============================================================
// AVALIVE VIP PRO — BACKEND SERVER
// Hỗ trợ: TikTok Live (WebcastPushConnection) + Simulation Mode
// ============================================================

let TikTokConnector = null;
(async () => {
  try {
    const legacy = await import('tiktok-live-connector/legacy');
    TikTokConnector = legacy.WebcastPushConnection || legacy.default?.WebcastPushConnection;
    console.log('[TikTok Connector] ✅ Loaded WebcastPushConnection (Legacy JSON stream engine)');
  } catch (e) {
    try {
      const mod = await import('tiktok-live-connector');
      TikTokConnector = mod.TikTokLiveConnection || mod.WebcastPushConnection || mod.default?.TikTokLiveConnection;
      console.log('[TikTok Connector] ✅ Loaded TikTokLiveConnection (New engine)');
    } catch (err) {
      console.error('[TikTok Connector] ❌ Failed to load connector module:', err);
    }
  }
})();

const app = express();
app.use(cors());
app.use(express.json());

// Phục vụ frontend từ thư mục app hoặc dist
const distPath = fs.existsSync(path.join(__dirname, 'app'))
  ? path.join(__dirname, 'app')
  : fs.existsSync(path.join(__dirname, '../app'))
  ? path.join(__dirname, '../app')
  : fs.existsSync(path.join(__dirname, '../dist'))
  ? path.join(__dirname, '../dist')
  : fs.existsSync(path.join(__dirname, './dist'))
  ? path.join(__dirname, './dist')
  : null;

if (distPath) {
  console.log(`[AvaLive] ✅ Phục vụ Frontend Static từ: ${distPath}`);
  app.use(express.static(distPath));
}

const multer = require('multer');

// ============================================================
// UPLOAD FILE CONFIGURATION
// ============================================================
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname) || '.mp4';
    cb(null, 'media-' + uniqueSuffix + ext);
  }
});
const upload = multer({ storage: storage });

// ⚡ HIGH-PERFORMANCE VIDEO STREAMING ENGINE (HTTP 206 Byte-Range Partial Content)
// Giúp video MP4/WebM load ngay lập tức 0ms, không lag, không giật, hỗ trợ video 5-10 tiếng siêu mượt trên TikTok Live Studio & OBS
app.all('/uploads/:filename', (req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD' && req.method !== 'OPTIONS') return next();

  const filePath = path.join(uploadsDir, req.params.filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).send('Media not found');
  }

  try {
    const stat = fs.statSync(filePath);
    const activeUpload = Object.values(activeStreamUploads).find(s => s && s.filename === req.params.filename);
    const declaredFileSize = (activeUpload && activeUpload.fileSize > 0) ? activeUpload.fileSize : stat.size;
    const currentOnDiskSize = stat.size;
    const range = req.headers.range;

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Cache-Control', 'public, max-age=86400, immutable');
    res.setHeader('Accept-Ranges', 'bytes');

    if (req.method === 'OPTIONS') {
      res.statusCode = 204;
      return res.end();
    }

    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.mp4': 'video/mp4',
      '.webm': 'video/webm',
      '.mov': 'video/quicktime',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
      '.gif': 'image/gif'
    };
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    if (range && (ext === '.mp4' || ext === '.webm' || ext === '.mov')) {
      const parts = range.replace(/bytes=/, "").split("-");
      let start = 0;
      let end = currentOnDiskSize - 1;

      // 1. Hỗ trợ Suffix Range: bytes=-N (Đọc N byte cuối file để lấy moov atom cho video dài 5-10 tiếng)
      if (parts[0] === '' && parts[1]) {
        const suffix = parseInt(parts[1], 10);
        if (!isNaN(suffix) && suffix > 0) {
          start = Math.max(0, currentOnDiskSize - suffix);
          end = currentOnDiskSize - 1;
        }
      } else {
        start = parseInt(parts[0], 10);
        // Kiểm tra phạm vi hợp lệ: Tuyệt đối không đọc vượt quá dung lượng hiện có trên đĩa
        if (isNaN(start) || start < 0 || start >= currentOnDiskSize) {
          res.status(416).set('Content-Range', `bytes */${currentOnDiskSize}`).end();
          return;
        }

        if (parts[1] && parts[1].trim() !== '') {
          // Range cụ thể: bytes=START-END
          end = parseInt(parts[1], 10);
          if (isNaN(end) || end >= currentOnDiskSize) end = currentOnDiskSize - 1;
        } else {
          // Open Range: bytes=START-
          // 🚀 8MB CHUNK STREAMING CHO VIDEO DÀI 5-10 TIẾNG & TIKTOK LIVE STUDIO:
          // Trả về chunk 8MB để nạp khung hình đầu tiên tức thì, chống giật lag, hỗ trợ video hàng chục GB 24/24.
          const CHUNK_SIZE = 8 * 1024 * 1024;
          end = Math.min(start + CHUNK_SIZE - 1, currentOnDiskSize - 1);
        }
      }

      if (end < start) {
        res.status(416).set('Content-Range', `bytes */${currentOnDiskSize}`).end();
        return;
      }

      const chunksize = (end - start) + 1;
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${declaredFileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': contentType,
      });

      if (req.method === 'HEAD') {
        return res.end();
      }

      const stream = fs.createReadStream(filePath, { start, end });
      req.on('close', () => {
        try { stream.destroy(); } catch (e) {}
      });
      stream.on('error', () => {
        try { stream.destroy(); } catch (e) {}
      });
      stream.pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': currentOnDiskSize,
        'Content-Type': contentType,
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=86400, immutable'
      });
      if (req.method === 'HEAD') {
        return res.end();
      }
      const stream = fs.createReadStream(filePath);
      req.on('close', () => {
        try { stream.destroy(); } catch (e) {}
      });
      stream.on('error', () => {
        try { stream.destroy(); } catch (e) {}
      });
      stream.pipe(res);
    }
  } catch (err) {
    next(err);
  }
});

// Static fallback cho thư mục uploads
app.use('/uploads', express.static(uploadsDir, { maxAge: '1d', acceptRanges: true }));

// Tự động tối ưu hoá Moov Atom lên đầu file (FastStart) nếu có ffmpeg trên máy
function tryApplyFaststart(filePath) {
  try {
    const { exec } = require('child_process');
    exec('ffmpeg -version', (err) => {
      if (err) return; // Không có ffmpeg, bỏ qua (Range handler đã xử lý mượt)
      const tempPath = filePath + '.faststart.mp4';
      exec(`ffmpeg -y -i "${filePath}" -c copy -movflags +faststart "${tempPath}"`, (err2) => {
        if (!err2 && fs.existsSync(tempPath) && fs.statSync(tempPath).size > 1000) {
          try {
            fs.renameSync(tempPath, filePath);
            console.log(`[FastStart] ✅ Đã tối ưu moov atom lên đầu cho video: ${path.basename(filePath)}`);
          } catch(e) {}
        } else if (fs.existsSync(tempPath)) {
          try { fs.unlinkSync(tempPath); } catch(e) {}
        }
      });
    });
  } catch(e) {}
}

// ============================================================
// ⚡ FAST-STREAM CHUNKED PIPELINE (TRUYỀN TẢI TỪNG PHẦN PHÁT NGAY LẬP TỨC 0MS)
// Dành riêng cho video dài 1-2 tiếng / dung lượng lớn: Phát luồng ngay lập tức mà không cần đợi nạp hết cả GB!
// ============================================================
const activeStreamUploads = {};

app.post('/api/upload-stream-init', (req, res) => {
  try {
    const { originalName, fileSize, fileType, filePath: clientFilePath } = req.body || {};
    
    // Nếu có đường dẫn file nội bộ trên máy (chạy native hoặc app wrapper)
    if (clientFilePath && fs.existsSync(clientFilePath)) {
      const ext = path.extname(clientFilePath) || '.mp4';
      const targetFilename = 'media-' + Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
      const targetPath = path.join(uploadsDir, targetFilename);
      
      try {
        fs.copyFileSync(clientFilePath, targetPath);
        const fileUrl = `/uploads/${targetFilename}`;
        currentMasterLiveState = {
          ...currentMasterLiveState,
          stage: 'idol',
          mediaUrl: fileUrl,
          isVideo: true,
          videoPlaybackEvent: 'play',
          isPlaying: true,
          updatedAt: Date.now()
        };
        io.emit('MASTER_LIVE_STATE_UPDATE', currentMasterLiveState);
        saveLiveStateToFile();
        return res.json({ success: true, instant: true, fileUrl });
      } catch (copyErr) {}
    }

    const ext = path.extname(originalName || '') || '.mp4';
    const filename = 'media-' + Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
    const filePath = path.join(uploadsDir, filename);
    const uploadId = 'up_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    const totalSize = parseInt(fileSize, 10) || 0;
    
    // Mở file ghi sẵn sàng (w+) ghi tuần tự liền mạch, không tạo sparse hole byte 0
    const fd = fs.openSync(filePath, 'w+');

    activeStreamUploads[uploadId] = {
      uploadId,
      filename,
      filePath,
      fileSize: totalSize,
      fd,
      writtenBytes: 0,
      chunksCount: 0,
      isHeadReady: false,
      createdAt: Date.now(),
      timer: setTimeout(() => {
        try { if (activeStreamUploads[uploadId]?.fd) fs.closeSync(activeStreamUploads[uploadId].fd); } catch(e) {}
        delete activeStreamUploads[uploadId];
      }, 3600000) // 60 phút timeout hỗ trợ video 5-10 tiếng dung lượng lớn
    };

    const fileUrl = `/uploads/${filename}`;

    res.json({
      success: true,
      uploadId,
      filename,
      fileUrl,
      message: 'Fast-stream session initialized'
    });
  } catch (err) {
    console.error('[StreamInit error]', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/upload-chunk', (req, res) => {
  const uploadId = req.headers['x-upload-id'];
  const offset = parseInt(req.headers['x-chunk-offset'], 10);
  const totalChunks = parseInt(req.headers['x-total-chunks'], 10);

  const session = activeStreamUploads[uploadId];
  if (!session || !session.fd) {
    return res.status(404).json({ error: 'Phiên stream chunk không tồn tại hoặc đã kết thúc' });
  }

  // Reset timeout timer (60 phút)
  if (session.timer) clearTimeout(session.timer);
  session.timer = setTimeout(() => {
    try { if (session.fd) fs.closeSync(session.fd); } catch(e) {}
    delete activeStreamUploads[uploadId];
  }, 3600000);

  const chunks = [];
  req.on('data', (c) => chunks.push(c));
  req.on('end', () => {
    const buffer = Buffer.concat(chunks);
    try {
      if (typeof offset === 'number' && !isNaN(offset) && offset >= 0) {
        fs.writeSync(session.fd, buffer, 0, buffer.length, offset);
      }
      session.writtenBytes += buffer.length;
      session.chunksCount++;

      // 🚀 KHI KHỐI ĐẦU TIÊN (OFFSET 0) ĐÃ GHI XONG:
      // File đã có header MP4 hợp lệ, server lập tức phát sóng sang TikTok Live Studio!
      if (offset === 0 && !session.isHeadReady) {
        session.isHeadReady = true;
        currentMasterLiveState = {
          ...currentMasterLiveState,
          stage: 'idol',
          mediaUrl: `/uploads/${session.filename}`,
          isVideo: true,
          videoPlaybackEvent: 'play',
          isPlaying: true,
          isUserExplicitMediaLocked: true,
          updatedAt: Date.now()
        };
        io.emit('MASTER_LIVE_STATE_UPDATE', currentMasterLiveState);
        saveLiveStateToFile();
        console.log(`[FastStream] 🚀 Chunk 0 đã sẵn sàng! Bắn phát sóng tức thì sang TikTok Live Studio: ${session.filename}`);
      }

      // Nếu đã ghi đủ tất cả các chunks
      if (!isNaN(totalChunks) && totalChunks > 0 && session.chunksCount >= totalChunks) {
        if (session.timer) clearTimeout(session.timer);
        try { fs.closeSync(session.fd); } catch(e) {}
        session.fd = null;
        delete activeStreamUploads[uploadId];
        console.log(`[FastStream] ✅ Đã hoàn tất nạp 100% video: ${session.filename} (${session.writtenBytes} bytes)`);
        tryApplyFaststart(session.filePath);
      }

      res.json({ success: true, written: buffer.length, offset });
    } catch(err) {
      console.error('[FastStream chunk error]', err);
      res.status(500).json({ error: err.message });
    }
  });
});

app.post('/api/upload-media', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  const savedFilePath = path.join(uploadsDir, req.file.filename);
  tryApplyFaststart(savedFilePath);

  const fileUrl = `/uploads/${req.file.filename}`;
  currentMasterLiveState = {
    ...currentMasterLiveState,
    stage: 'idol',
    mediaUrl: fileUrl,
    isVideo: true,
    videoPlaybackEvent: 'play',
    isPlaying: true,
    updatedAt: Date.now()
  };
  io.emit('MASTER_LIVE_STATE_UPDATE', currentMasterLiveState);
  saveLiveStateToFile();
  res.json({ url: fileUrl, filename: req.file.filename, success: true });
});

// 🌐 API KIỂM TRA TRẠNG THÁI SERVER & PHIÊN BẢN ĐỒNG BỘ
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'AvaLive VIP PRO',
    version: '2.3.4-PRO',
    cloudSync: true,
    supabaseConnected: true,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/version', (req, res) => {
  res.json({
    version: '2.3.4-PRO',
    latestVersion: '2.3.4-PRO',
    isLatest: true,
    updateAvailable: false,
    buildTime: new Date().toISOString(),
    releaseNotes: 'Phiên bản Đồng Bộ Đám Mây Real-Time: Hồ Sơ Người Dùng, Tiếp Thị Liên Kết 30%, Phân Quyền Đội Ngũ, Quản Lý Doanh Số & Token AI Trực Tuyến.'
  });
});

app.get('/api/check-update', (req, res) => {
  res.json({
    hasUpdate: false,
    currentVersion: '2.3.4-PRO',
    latestVersion: '2.3.4-PRO',
    downloadUrl: '/api/download-software',
    message: 'Bạn đang sử dụng phiên bản phần mềm mới nhất đã đồng bộ hóa tài khoản.'
  });
});


// 📦 ROUTE TẢI PHẦN MỀM STANDALONE WINDOWS — TẢI TRỰC TIẾP VỀ MÁY 100%, KHÔNG MỞ GITHUB
app.get(['/api/download/windows', '/api/download-windows', '/download/windows', '/AvaLive_VIP_PRO_Windows.zip', '/AvaLive_VIP_PRO_Windows_v1.7.0.zip', '/AvaLive_VIP_PRO_Windows_v1.6.9.zip', '/AvaLive_VIP_PRO_Windows_v1.6.8.zip', '/AvaLive_VIP_PRO_Windows_v1.6.7.zip', '/AvaLive_VIP_PRO_Windows_v1.6.6.zip', '/AvaLive_VIP_PRO_Windows_v1.6.5.zip', '/AvaLive_VIP_PRO_Windows_v1.6.4.zip', '/AvaLive_VIP_PRO_Windows_v1.6.3.zip', '/AvaLive_VIP_PRO_Windows_v1.6.2.zip', '/AvaLive_VIP_PRO_Windows_v1.5.0.zip'], (req, res) => {
  const releaseDir = path.join(__dirname, '..', 'release_zips');
  let targetFile = null;
  let ver = '1.7.0';
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
    if (pkg.version) ver = pkg.version;
  } catch (e) {}

  if (fs.existsSync(releaseDir)) {
    const exactFile = path.join(releaseDir, `AvaLive_VIP_PRO_Windows_v${ver}.zip`);
    if (fs.existsSync(exactFile)) {
      targetFile = exactFile;
    } else {
      const files = fs.readdirSync(releaseDir).filter(f => f.startsWith('AvaLive_VIP_PRO_Windows') && f.endsWith('.zip'));
      if (files.length > 0) {
        files.sort().reverse();
        targetFile = path.join(releaseDir, files[0]);
      }
    }
  }

  if (targetFile && fs.existsSync(targetFile)) {
    const fileName = path.basename(targetFile);
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    return res.sendFile(targetFile);
  }

  // Fallback nếu chạy trên cloud không có local zip -> redirect thẳng đến asset GitHub release
  res.redirect(`https://github.com/THIENVUAAPP/DU-AN-AVA-LIVETREAMS/releases/download/v${ver}/AvaLive_VIP_PRO_Windows_v${ver}.zip`);
});

// 📦 ROUTE TẢI PHẦN MỀM STANDALONE MAC — TẢI TRỰC TIẾP VỀ MÁY 100%, KHÔNG MỞ GITHUB
app.get(['/api/download/mac', '/api/download-mac', '/download/mac', '/AvaLive_VIP_PRO_Mac.zip', '/AvaLive_VIP_PRO_Mac_v1.7.0.zip', '/AvaLive_VIP_PRO_Mac_v1.6.9.zip', '/AvaLive_VIP_PRO_Mac_v1.6.8.zip', '/AvaLive_VIP_PRO_Mac_v1.6.7.zip', '/AvaLive_VIP_PRO_Mac_v1.6.6.zip', '/AvaLive_VIP_PRO_Mac_v1.6.5.zip', '/AvaLive_VIP_PRO_Mac_v1.6.4.zip', '/AvaLive_VIP_PRO_Mac_v1.6.3.zip', '/AvaLive_VIP_PRO_Mac_v1.6.2.zip', '/AvaLive_VIP_PRO_Mac_v1.5.0.zip'], (req, res) => {
  const releaseDir = path.join(__dirname, '..', 'release_zips');
  let targetFile = null;
  let ver = '1.7.0';
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
    if (pkg.version) ver = pkg.version;
  } catch (e) {}

  if (fs.existsSync(releaseDir)) {
    const exactFile = path.join(releaseDir, `AvaLive_VIP_PRO_Mac_v${ver}.zip`);
    if (fs.existsSync(exactFile)) {
      targetFile = exactFile;
    } else {
      const files = fs.readdirSync(releaseDir).filter(f => f.startsWith('AvaLive_VIP_PRO_Mac') && f.endsWith('.zip'));
      if (files.length > 0) {
        files.sort().reverse();
        targetFile = path.join(releaseDir, files[0]);
      }
    }
  }

  if (targetFile && fs.existsSync(targetFile)) {
    const fileName = path.basename(targetFile);
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    return res.sendFile(targetFile);
  }

  // Fallback nếu chạy trên cloud không có local zip -> redirect thẳng đến asset GitHub release
  res.redirect(`https://github.com/THIENVUAAPP/DU-AN-AVA-LIVETREAMS/releases/download/v${ver}/AvaLive_VIP_PRO_Mac_v${ver}.zip`);
});

// 📦 ROUTE TẢI PHẦN MỀM STANDALONE (Mac & Windows) — Kích hoạt download ngay, không mở trong trình duyệt
app.get('/api/download-software', (req, res) => {
  const userAgent = (req.headers['user-agent'] || '').toLowerCase();
  const isMac = userAgent.includes('mac');
  if (isMac) {
    return res.redirect('/api/download/mac');
  }
  return res.redirect('/api/download/windows');
});

// Alias trực tiếp: /Livestream_AI_Software.zip -> download với đúng tên file
app.get('/Livestream_AI_Software.zip', (req, res) => {
  return res.redirect('/api/download/windows');
});

// 🚀 PROXY STREAM TIÊU CHUẨN: Vượt qua hoàn toàn rào cản CORS & Xử lý tự động chuyển hướng (Redirect 302) của TikTok CDN
app.get('/api/stream-proxy', (req, res) => {
  const streamUrl = req.query.url || globalFlvUrl;
  if (!streamUrl) {
    return res.status(400).send('Missing stream URL');
  }

  const isHls = streamUrl.includes('.m3u8') || streamUrl.includes('/hls');
  const isTs = streamUrl.includes('.ts');
  let contentType = 'video/x-flv';
  if (isHls) contentType = 'application/vnd.apple.mpegurl';
  else if (isTs) contentType = 'video/mp2t';

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Content-Type', contentType);

  const fetchStream = (targetUrl) => {
    try {
      const parsedUrl = new URL(targetUrl);
      const clientLib = parsedUrl.protocol === 'http:' ? require('http') : require('https');

      const proxyReq = clientLib.get(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Referer': 'https://www.tiktok.com/',
          'Origin': 'https://www.tiktok.com'
        }
      }, (proxyRes) => {
        if (proxyRes.statusCode === 301 || proxyRes.statusCode === 302) {
          const redirectUrl = proxyRes.headers.location;
          if (redirectUrl) {
            return fetchStream(redirectUrl);
          }
        }

        proxyRes.pipe(res);
        proxyRes.on('error', (err) => {
          console.warn('[Stream Proxy stream error]:', err.message);
          res.end();
        });
      });

      proxyReq.on('error', (err) => {
        console.warn('[Stream Proxy req error]:', err.message);
        if (!res.headersSent) res.status(500).send('Proxy error');
        else res.end();
      });

      req.on('close', () => {
        proxyReq.destroy();
      });
    } catch (e) {
      console.warn('[Stream Proxy URL error]:', e.message);
      if (!res.headersSent) res.status(500).send('Proxy error');
    }
  };

  fetchStream(streamUrl);
});

// Dùng HTTPS khi có sẵn cert dev (certs/dev-cert.pem, certs/dev-key.pem) — bắt buộc phải cùng
const useHttpsEnv = process.env.USE_HTTPS === 'true';
const devCertPath = path.join(__dirname, '../certs/dev-cert.pem');
const devKeyPath = path.join(__dirname, '../certs/dev-key.pem');
const usingHttps = useHttpsEnv && fs.existsSync(devCertPath) && fs.existsSync(devKeyPath);
const httpServer = usingHttps
  ? https.createServer({ cert: fs.readFileSync(devCertPath), key: fs.readFileSync(devKeyPath) }, app)
  : createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

// ============================================================
// TRẠNG THÁI TOÀN CỤC
// ============================================================
let tiktokConnection = null;
let tiktokVideoConnection = null;
let currentUsername = null;
let currentVideoUsername = null;
let globalFlvUrl = null;
let autoReconnectTimer = null;
let isSimulationMode = false;
let simulationTimer = null;
let isConnectingTikTok = false; // 🔒 Connection Lock — Ngăn race condition

const stateFilePath = path.join(__dirname, 'live_state.json');

let saveFileTimeout = null;
function saveLiveStateToFile(immediate = false) {
  if (saveFileTimeout) {
    clearTimeout(saveFileTimeout);
    saveFileTimeout = null;
  }
  const doSave = () => {
    try {
      fs.writeFile(stateFilePath, JSON.stringify(currentMasterLiveState, null, 2), 'utf8', () => {});
    } catch (err) {}
  };
  if (immediate) {
    doSave();
  } else {
    saveFileTimeout = setTimeout(doSave, 800);
  }
}

function loadLiveStateFromFile() {
  try {
    if (fs.existsSync(stateFilePath)) {
      const data = JSON.parse(fs.readFileSync(stateFilePath, 'utf8'));
      if (data && typeof data === 'object') {
        if (typeof data.mediaUrl === 'string' && (data.mediaUrl.includes('nhep_mieng.mp4') || data.mediaUrl.includes('demo_dancer.mp4'))) {
          data.mediaUrl = null;
        }
        return data;
      }
    }
  } catch (err) {}
  return null;
}

let savedState = loadLiveStateFromFile();
let currentMasterLiveState = savedState || {
  stage: 'idol',
  aspectRatio: '9:16',
  characterId: 'linhanh_4k',
  characterName: 'AvaLive VIP PRO',
  mediaUrl: null,
  isVideo: true,
  videoPlaybackEvent: 'play',
  isPlaying: true,
  isAudioMuted: false,
  isDarkMode: true,
  updatedAt: Date.now()
};

// Tuyệt đối không tự ý gán video phát nền ngầm (chỉ phát khi người dùng chủ động tải lên / chọn video)
if (currentMasterLiveState.mediaUrl && currentMasterLiveState.mediaUrl.includes('default_idol.mp4')) {
  currentMasterLiveState.mediaUrl = null;
}

// 🎬 TỰ ĐỘNG KHÔI PHỤC VIDEO GẦN NHẤT CỦA NGƯỜI DÙNG:
// Nếu mediaUrl bị null hoặc file không tồn tại, tự động lấy video mới nhất mà người dùng đã tải lên trong uploads/
if (!currentMasterLiveState.mediaUrl || !fs.existsSync(path.join(uploadsDir, path.basename(currentMasterLiveState.mediaUrl)))) {
  try {
    const files = fs.readdirSync(uploadsDir)
      .filter(f => f.endsWith('.mp4') || f.endsWith('.webm') || f.endsWith('.mov'))
      .map(f => ({ name: f, time: fs.statSync(path.join(uploadsDir, f)).mtimeMs }))
      .sort((a, b) => b.time - a.time);
    if (files.length > 0) {
      currentMasterLiveState.mediaUrl = `/uploads/${files[0].name}`;
      currentMasterLiveState.isVideo = true;
      currentMasterLiveState.isPlaying = true;
      currentMasterLiveState.isUserExplicitMediaLocked = true;
      console.log(`[AutoRestore] 🎬 Đã khôi phục video gần nhất của người dùng: ${files[0].name}`);
      saveLiveStateToFile();
    }
  } catch (err) {}
}
let currentBandoGameState = null;
let currentBattleGameState = null;
let globalLatestStudioCamFrame = null;

// Pool tên thật TikTok cho simulation
const SIMULATION_USERS = [
  { id: 'user_101', name: 'Minh Hiếu 🇻🇳', avatar: 'https://i.pravatar.cc/100?img=1' },
  { id: 'user_102', name: 'Thùy Dương', avatar: 'https://i.pravatar.cc/100?img=5' },
  { id: 'user_103', name: 'Quốc Toàn', avatar: 'https://i.pravatar.cc/100?img=3' },
  { id: 'user_104', name: 'Hương Giang ❤️', avatar: 'https://i.pravatar.cc/100?img=9' },
  { id: 'user_105', name: 'Văn Nam', avatar: 'https://i.pravatar.cc/100?img=11' },
  { id: 'user_106', name: 'Bảo Châu', avatar: 'https://i.pravatar.cc/100?img=20' },
  { id: 'user_107', name: 'Duy Khánh 🏆', avatar: 'https://i.pravatar.cc/100?img=15' },
  { id: 'user_108', name: 'Thu Hà', avatar: 'https://i.pravatar.cc/100?img=25' },
];

const SIMULATION_COMMENTS = [
  'Chào shop ơi!', 'Xin chào mọi người!', 'Luật chơi thế nào ạ?',
  'Hà Nội ơi!', 'Sài Gòn cố lên!', 'Việt Nam vô địch!',
  'Cắm cờ Miền Nam nào!', 'Tim tim tim!', '1', '2',
  'Hướng dẫn em với ạ', 'Ủng hộ phe đỏ!', 'Cờ về Hà Nội nào!',
  'Tặng quà cắm cờ!', 'Hoa hồng cho anh/chị!', 'Yêu Việt Nam!',
];

const SIMULATION_GIFTS = [
  { id: 'rose', name: 'Hoa Hồng', diamonds: 1, count: 1 },
  { id: 'heart_tap', name: 'Thả Tim', diamonds: 1, count: 1 },
  { id: 'flag_vn', name: 'Cờ Tổ Quốc', diamonds: 1, count: 1 },
  { id: 'peach', name: 'Quả Đào', diamonds: 5, count: 1 },
  { id: 'helmet', name: 'Mũ Cối Yêu Nước', diamonds: 10, count: 1 },
  { id: 'tank_390', name: 'Xe Tăng 390', diamonds: 99, count: 1 },
  { id: 'dong_son_drum', name: 'Trống Đồng Đông Sơn', diamonds: 999, count: 1 },
  { id: 'rose', name: 'Hoa Hồng', diamonds: 1, count: 5 },
  { id: 'rose', name: 'Hoa Hồng', diamonds: 1, count: 10 },
  { id: 'flag_vn', name: 'Cờ Tổ Quốc', diamonds: 1, count: 3 },
];

// Hàm phát sự kiện TikTok (dùng chung cho real + simulation) - Chuẩn hóa 1 luồng duy nhất
function emitTikTokGift(giftData) {
  io.emit('tiktok_gift', giftData);
}

function emitTikTokChat(chatData) {
  io.emit('tiktok_chat', chatData);
}

// ============================================================
// SIMULATION MODE: Tự động phát quà + comment giả lập
// ============================================================
function startSimulationMode() {
  if (simulationTimer) clearInterval(simulationTimer);
  isSimulationMode = true;
  console.log('[Simulation] 🎭 Bắt đầu Simulation Mode — Giả lập TikTok Live events...');

  let tickCount = 0;
  simulationTimer = setInterval(() => {
    tickCount++;
    const user = SIMULATION_USERS[tickCount % SIMULATION_USERS.length];

    // Mỗi 3 giây: Phát 1 comment
    const comment = SIMULATION_COMMENTS[tickCount % SIMULATION_COMMENTS.length];
    const chatPayload = {
      userId: user.id,
      uniqueId: user.id,
      nickname: user.name,
      username: user.name,
      comment,
      text: comment,
      profilePictureUrl: user.avatar,
      avatar: user.avatar
    };
    emitTikTokChat(chatPayload);
    console.log(`[Simulation] 💬 ${user.name}: "${comment}"`);

    // Mỗi 9 giây (tick chia hết 3): Phát 1 món quà
    if (tickCount % 3 === 0) {
      const gift = SIMULATION_GIFTS[Math.floor(tickCount / 3) % SIMULATION_GIFTS.length];
      const giftUser = SIMULATION_USERS[(tickCount + 2) % SIMULATION_USERS.length];
      const giftPayload = {
        userId: giftUser.id,
        uniqueId: giftUser.id,
        nickname: giftUser.name,
        username: giftUser.name,
        giftId: gift.id,
        giftName: gift.name,
        diamondCount: gift.diamonds,
        count: gift.count,
        repeatCount: gift.count,
        totalRepeatCount: gift.count,
        profilePictureUrl: giftUser.avatar,
        avatar: giftUser.avatar
      };
      emitTikTokGift(giftPayload);
      console.log(`[Simulation] 🎁 ${giftUser.name} tặng: ${gift.name} x${gift.count} (${gift.diamonds * gift.count} xu)`);
    }
  }, 3000);
}

function stopSimulationMode() {
  if (simulationTimer) { clearInterval(simulationTimer); simulationTimer = null; }
  isSimulationMode = false;
  console.log('[Simulation] 🛑 Dừng Simulation Mode');
}

// ============================================================
// SOCKET.IO CONNECTION HANDLER
// ============================================================
io.on('connection', (socket) => {
  console.log('Client connected to Live Hub:', socket.id);

  socket.emit('MASTER_LIVE_STATE_UPDATE', currentMasterLiveState);
  if (currentBandoGameState) socket.emit('bando_sync', currentBandoGameState);
  if (currentBattleGameState) socket.emit('battle_sync', currentBattleGameState);

  // Gửi trạng thái kết nối TikTok hiện tại ngay
  socket.emit('tiktok_status', {
    connected: !!tiktokConnection && !!currentUsername,
    username: currentUsername,
    roomId: tiktokConnection?.roomId || null,
    simulationMode: isSimulationMode
  });

  const handleMasterStateUpdate = (state) => {
    if (state && typeof state === 'object') {
      const cleanState = { ...state };
      delete cleanState.force; // Không lưu cờ force vào file state vĩnh viễn
      const nextState = { ...currentMasterLiveState, ...cleanState, updatedAt: Date.now() };
      delete nextState.force;
      // BẢO VỆ TUYỆT ĐỐI VIDEO ĐANG PHÁT: Không bao giờ tự ý xoá mediaUrl hiện tại nếu client gửi null/undefined
      // Chỉ xoá khi người dùng bấm xoá với cờ rõ ràng clearMedia: true
      if (!cleanState.mediaUrl && !cleanState.clearMedia && currentMasterLiveState.mediaUrl) {
        nextState.mediaUrl = currentMasterLiveState.mediaUrl;
        nextState.isVideo = currentMasterLiveState.isVideo;
      }
      currentMasterLiveState = nextState;
      io.emit('MASTER_LIVE_STATE_UPDATE', currentMasterLiveState);
      // CHỈ PHÁT SỰ KIỆN ĐIỀU KHIỂN VIDEO KHI LÀ LỆNH PLAY HOẶC PAUSE RÕ RÀNG (TRÁNH LẶP VIDEO VÀ TUA VỀ ĐẦU)
      if (cleanState.videoPlaybackEvent === 'play' || cleanState.videoPlaybackEvent === 'pause') {
        io.emit('VIDEO_PLAYBACK_CONTROL', {
          action: cleanState.videoPlaybackEvent,
          isPlaying: cleanState.isPlaying,
          mediaUrl: currentMasterLiveState.mediaUrl,
          timestamp: Date.now()
        });
      }
      saveLiveStateToFile();
    }
  };

  socket.on('MASTER_LIVE_STATE_UPDATE', handleMasterStateUpdate);
  socket.on('UPDATE_MASTER_LIVE_STATE', handleMasterStateUpdate);

  socket.on('REQUEST_MASTER_LIVE_STATE', () => {
    socket.emit('MASTER_LIVE_STATE_UPDATE', currentMasterLiveState);
  });

  // ⚡ ĐỒNG BỘ VIDEO REALTIME 0MS CHO TIKTOK LIVE STUDIO & OBS
  socket.on('VIDEO_PLAYBACK_CONTROL', (control) => {
    if (control && typeof control === 'object') {
      if (typeof control.isPlaying === 'boolean') {
        currentMasterLiveState.isPlaying = control.isPlaying;
      }
      if (control.action) {
        currentMasterLiveState.videoPlaybackEvent = control.action;
      }
      if (typeof control.currentTime === 'number') {
        currentMasterLiveState.videoCurrentTime = control.currentTime;
      }
      if (control.mediaUrl && typeof control.mediaUrl === 'string') {
        currentMasterLiveState.mediaUrl = control.mediaUrl;
        currentMasterLiveState.isVideo = true;
      }
      if (typeof control.isMuted === 'boolean') {
        currentMasterLiveState.isVideoAudioMuted = control.isMuted;
      }
      if (typeof control.volume === 'number') {
        currentMasterLiveState.videoVolume = control.volume;
      }
      currentMasterLiveState.updatedAt = Date.now();

      // Broadcast ngay lập tức tới TẤT CẢ các client khác (Overlay Browser Source, OBS, TikTok Studio)
      socket.broadcast.emit('VIDEO_PLAYBACK_CONTROL', {
        ...control,
        timestamp: control.timestamp || Date.now()
      });

      // Nếu là sự kiện play, pause, seek thì emit MASTER_LIVE_STATE_UPDATE
      if (control.action === 'play' || control.action === 'pause' || control.action === 'seek') {
        io.emit('MASTER_LIVE_STATE_UPDATE', currentMasterLiveState);
        saveLiveStateToFile(false);
      }
    }
  });

  socket.on('bando_sync', (state) => {
    currentBandoGameState = state;
    socket.broadcast.emit('bando_sync', state);
  });

  let latestStudioCamFrame = null;

  socket.on('STUDIO_CAM_FRAME', (frameData) => {
    latestStudioCamFrame = frameData;
    globalLatestStudioCamFrame = frameData;
    socket.broadcast.emit('STUDIO_CAM_FRAME', frameData);
  });

  socket.on('battle_sync', (state) => {
    currentBattleGameState = state;
    socket.broadcast.emit('battle_sync', state);
  });

  socket.on('bando_event', (evt) => {
    io.emit('bando_event', evt);
    io.emit('LIVE_EVENT', evt);
  });

  socket.on('bando_action', (action) => {
    socket.broadcast.emit('bando_action', action);
  });

  socket.on('battle_trigger_demo', (data) => {
    socket.broadcast.emit('battle_trigger_demo', data);
  });

  socket.on('battle_event', (evt) => {
    io.emit('battle_event', evt);
    io.emit('LIVE_EVENT', evt);
  });

  socket.on('LIVE_EVENT', (evt) => { io.emit('LIVE_EVENT', evt); });

  // ---- TikTok Status ----
  socket.on('get_tiktok_status', () => {
    socket.emit('tiktok_status', {
      connected: (!!tiktokConnection && !!currentUsername) || (!!tiktokVideoConnection && !!currentVideoUsername) || !!globalFlvUrl,
      username: currentUsername || currentVideoUsername || '',
      roomId: tiktokConnection?.roomId || tiktokVideoConnection?.roomId || null,
      flvUrl: globalFlvUrl,
      simulationMode: isSimulationMode
    });
  });

  // ---- Ngắt kết nối TikTok ----
  socket.on('disconnect_tiktok', () => {
    if (tiktokConnection) {
      try { tiktokConnection.disconnect(); } catch (e) {}
      tiktokConnection = null;
    }
    if (tiktokVideoConnection) {
      try { tiktokVideoConnection.disconnect(); } catch (e) {}
      tiktokVideoConnection = null;
    }
    if (autoReconnectTimer) clearTimeout(autoReconnectTimer);
    currentUsername = '';
    currentVideoUsername = '';
    globalFlvUrl = null;
    io.emit('tiktok_disconnected', { message: 'Đã ngắt kết nối TikTok Live' });
    io.emit('tiktok_status', { connected: false, username: '', roomId: null, flvUrl: null });
  });

  // ---- Chế độ Simulation ----
  socket.on('toggle_simulation', (enable) => {
    if (enable) {
      startSimulationMode();
    } else {
      stopSimulationMode();
    }
    io.emit('tiktok_status', {
      connected: (!!tiktokConnection && !!currentUsername) || (!!tiktokVideoConnection && !!currentVideoUsername) || !!globalFlvUrl,
      username: currentUsername || currentVideoUsername || '',
      roomId: tiktokConnection?.roomId || tiktokVideoConnection?.roomId || null,
      flvUrl: globalFlvUrl,
      simulationMode: isSimulationMode
    });
  });

  // ---- Kết nối TikTok Live ----
  socket.on('connect_tiktok', async (payload, options = {}) => {
    // 🔒 CONNECTION LOCK — Chỉ cho phép 1 kết nối chạy tại một thời điểm
    if (isConnectingTikTok) {
      console.log('[TikTok Live] ⚠️ Đang có kết nối đang xử lý, bỏ qua yêu cầu trùng lặp.');
      socket.emit('tiktok_status', { connected: false, username: '', connecting: true });
      return;
    }
    isConnectingTikTok = true;

    const cleanTikTokUsername = (str) => {
      if (!str || typeof str !== 'string') return '';
      let clean = str.trim();
      // Match tiktok.com/@username/live or tiktok.com/@username
      const match = clean.match(/tiktok\.com\/@([a-zA-Z0-9_.-]+)/i);
      if (match) return match[1];
      // Remove @ prefix
      if (clean.startsWith('@')) clean = clean.substring(1);
      // Remove https:// or http:// if prefix remained
      clean = clean.replace(/^https?:\/\//i, '').replace(/^www\./i, '');
      // If it contains slashes, take the first part
      clean = clean.split('?')[0].split('/')[0].trim();
      return clean;
    };

    try {
      if (typeof payload === 'string') {
        targetUser = cleanTikTokUsername(payload);
      } else if (payload && typeof payload === 'object') {
        targetUser = cleanTikTokUsername(payload.chatId);
        targetVideoUser = cleanTikTokUsername(payload.videoId);
      }

      // Nếu người dùng nhập trùng 1 kênh cho cả 2 ô, thì gom về 1 kết nối duy nhất để tránh bị kick
      if (targetUser && targetUser === targetVideoUser) {
        targetVideoUser = '';
      }

      if (!targetUser && !targetVideoUser) {
        isConnectingTikTok = false;
        return;
      }

      // Ngắt kết nối cũ
      if (tiktokConnection) {
        try { await tiktokConnection.disconnect(); } catch (e) {}
        tiktokConnection = null;
      }
      if (tiktokVideoConnection) {
        try { await tiktokVideoConnection.disconnect(); } catch (e) {}
        tiktokVideoConnection = null;
      }
      if (autoReconnectTimer) { clearTimeout(autoReconnectTimer); clearInterval(autoReconnectTimer); autoReconnectTimer = null; }

      if (!TikTokConnector) {
        try {
          const legacy = await import('tiktok-live-connector/legacy');
          TikTokConnector = legacy.WebcastPushConnection || legacy.default?.WebcastPushConnection;
        } catch (e) {
          const mod = await import('tiktok-live-connector');
          TikTokConnector = mod.TikTokLiveConnection || mod.WebcastPushConnection;
        }
      }

      if (!TikTokConnector) {
        io.emit('tiktok_error', 'Không tải được module TikTok Connector! Hãy chạy npm install trong thư mục dự án.');
        isConnectingTikTok = false;
        return;
      }

      currentUsername = targetUser;
      currentVideoUsername = targetVideoUser;

      if (targetUser) console.log(`[TikTok Live] 🚀 Đang kết nối tới kênh TikTok Chat: ${targetUser}`);
      if (targetVideoUser) console.log(`[TikTok Live] 🚀 Đang kết nối tới kênh TikTok Video: ${targetVideoUser}`);

      // Gửi tên hiển thị là targetUser, nếu không có thì là targetVideoUser
      const displayUser = targetUser || targetVideoUser;
      io.emit('tiktok_status', { connected: false, username: displayUser, connecting: true });

      // Lấy sessionId từ options, .env, hoặc localStorage gửi lên
      const sessionId = options.sessionId || process.env.TIKTOK_SESSION_ID || undefined;

    const extractFlv = (rootObj) => {
      if (!rootObj) return { flv: null, hls: null, bestUrl: null };
      
      let foundFlv = null;
      let foundHls = null;
      let foundAny = null;

      // 1. Kiểm tra cấu trúc stream_data cao cấp của TikTok (UHD / Origin / HD)
      try {
        let streamDataStr = null;
        if (rootObj?.live_core_sdk_data?.pull_data?.stream_data) {
          streamDataStr = rootObj.live_core_sdk_data.pull_data.stream_data;
        } else if (rootObj?.data?.stream_url?.live_core_sdk_data?.pull_data?.stream_data) {
          streamDataStr = rootObj.data.stream_url.live_core_sdk_data.pull_data.stream_data;
        }
        if (streamDataStr) {
          const parsed = typeof streamDataStr === 'string' ? JSON.parse(streamDataStr) : streamDataStr;
          const dataNode = parsed.data || {};
          const qualityTiers = ['origin', 'uhd', 'full_hd', 'hd', 'sd', 'ld'];
          for (const q of qualityTiers) {
            if (dataNode[q]?.main) {
              const node = dataNode[q].main;
              if (node.flv && !foundFlv) foundFlv = node.flv;
              if (node.hls && !foundHls) foundHls = node.hls;
              if (foundFlv || foundHls) break;
            }
          }
        }
      } catch (e) {}

      // 2. Quét đệ quy toàn bộ cây đối tượng nếu chưa tìm thấy chất lượng cao nhất
      const scan = (val) => {
        if (!val) return;
        if (typeof val === 'string') {
          let s = val.trim();
          if (s.startsWith('{') && (s.includes('flv') || s.includes('hls') || s.includes('http'))) {
            try {
              const parsed = JSON.parse(s);
              scan(parsed);
              return;
            } catch (e) {}
          }
          if (s.startsWith('http://') || s.startsWith('https://')) {
            if (s.includes('.flv') || s.includes('pull-flv') || s.includes('/game/') || s.includes('/stage/')) {
              if (!foundFlv) foundFlv = s;
            } else if (s.includes('.m3u8') || s.includes('pull-hls')) {
              if (!foundHls) foundHls = s;
            } else if (s.includes('tiktokcdn.com') || s.includes('stream-')) {
              if (!foundAny) foundAny = s;
            }
          }
          return;
        }
        if (typeof val === 'object') {
          // Priority search for Full HD / HD
          const priority = ['FULL_HD1', 'FULL_HD', 'ORIGIN', 'ORIGINAL', 'HD1', 'HD', 'SD1', 'SD', 'LD'];
          for (const p of priority) {
            for (const [k, v] of Object.entries(val)) {
              if (k.toUpperCase().includes(p)) {
                scan(v);
              }
            }
          }
          for (const v of Object.values(val)) {
            scan(v);
          }
        }
      };

      if (!foundFlv && !foundHls) {
        scan(rootObj);
      }
      const bestUrl = foundFlv || foundHls || foundAny;
      return { flv: foundFlv, hls: foundHls, bestUrl };
    };

    let streamResult = { flv: null, hls: null, bestUrl: null };
    let videoConnected = false;

    // 1. Kết nối Video (nếu có targetVideoUser)
    if (targetVideoUser) {
      try {
        tiktokVideoConnection = new TikTokConnector(targetVideoUser, {
          processInitialData: true,
          enableExtendedGiftInfo: false,
          sessionId,
          requestHeaders: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
        });
        const vidPromise = tiktokVideoConnection.connect();
        const vidTimeout = new Promise((_, r) => setTimeout(() => r(new Error('Video Timeout')), 15000));
        try {
          const vidState = await Promise.race([vidPromise, vidTimeout]);
          console.log(`[TikTok Live] ✅ Đã kết nối Video Room ID: ${vidState?.roomId || 'ACTIVE'} (${targetVideoUser})`);
          streamResult = extractFlv(vidState);
          console.log(`[TikTok Live] Universal Stream Result: FLV=${streamResult.flv ? 'YES' : 'NO'}, HLS=${streamResult.hls ? 'YES' : 'NO'}, Best=${streamResult.bestUrl ? 'YES' : 'NO'}`);
          if (streamResult.bestUrl) globalFlvUrl = streamResult.bestUrl;
          videoConnected = true;
        } catch (err) {
          console.error(`[TikTok Live] ❌ Lỗi kết nối Video ${targetVideoUser}:`, err.message);
          io.emit('tiktok_error', `Không thể lấy Video từ ${targetVideoUser}: Kênh chưa live.`);
        }
      } catch(e) {}
    }

    const flvUrl = streamResult.flv || streamResult.bestUrl;
    const hlsUrl = streamResult.hls;

    // Nếu không có Chat ID, kết thúc ở đây và chỉ phát Video
    if (!targetUser) {
      if (videoConnected && (flvUrl || hlsUrl)) {
        io.emit('tiktok_connected', { username: targetVideoUser, roomId: 'VIDEO_ONLY', flvUrl, hlsUrl });
        io.emit('tiktok_status', { connected: true, username: targetVideoUser, roomId: 'VIDEO_ONLY', flvUrl, hlsUrl });
      } else {
        io.emit('tiktok_error', `Kênh Video ${targetVideoUser} chưa live hoặc ID không tồn tại!`);
        io.emit('tiktok_status', { connected: false, username: targetVideoUser });
      }
      return;
    }

    // 2. Kết nối Chat
    try {
      tiktokConnection = new TikTokConnector(targetUser, {
        processInitialData: true,
        enableExtendedGiftInfo: false,
        sessionId,
        requestHeaders: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
      });
    } catch (e) {
      console.error('[TikTok Live] Lỗi khởi tạo kết nối Chat:', e);
      io.emit('tiktok_error', `Lỗi khởi tạo: ${e.message || e}`);
      return;
    }

    const connectPromise = tiktokConnection.connect();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Connection timeout')), 15000)
    );

    Promise.race([connectPromise, timeoutPromise]).then(state => {
      console.log(`[TikTok Live] ✅ Đã kết nối Chat Room ID: ${state?.roomId || 'ACTIVE'} (${targetUser})`);
      stopSimulationMode();
      
      if (!targetVideoUser) {
        if (state?.roomInfo?.stream_url) {
          const res = extractFlv(state.roomInfo.stream_url);
          if (res.bestUrl) globalFlvUrl = res.bestUrl;
        }
        if (!globalFlvUrl && state?.roomInfo?.data?.stream_url) {
          const res = extractFlv(state.roomInfo.data.stream_url);
          if (res.bestUrl) globalFlvUrl = res.bestUrl;
        }
      }
      
      const finalFlv = flvUrl || globalFlvUrl;
      const finalHls = hlsUrl;
      
      currentMasterLiveState = {
        ...currentMasterLiveState,
        flvUrl: finalFlv,
        hlsUrl: finalHls,
        mediaUrl: finalFlv || currentMasterLiveState.mediaUrl,
        isVideo: true,
        isConnected: true,
        stage: currentMasterLiveState.stage || 'idol',
        updatedAt: Date.now()
      };
      io.emit('MASTER_LIVE_STATE_UPDATE', currentMasterLiveState);
      
      io.emit('tiktok_connected', { username: targetUser, roomId: state?.roomId, flvUrl: finalFlv, hlsUrl: finalHls });
      io.emit('tiktok_status', { connected: true, username: targetUser, roomId: state?.roomId, flvUrl: finalFlv, hlsUrl: finalHls });
    }).catch(err => {
      console.error(`[TikTok Live] ❌ Không thể kết nối Chat ${targetUser}: ${err.message || err}`);
      
      if (targetVideoUser && videoConnected) {
        // NẾU Chat thất bại (chưa live), NHƯNG Video đã thành công -> Vẫn cho phép hiển thị Video!
        console.log(`[TikTok Live] ⚠️ Chat chưa live nhưng Video đã có. Phát video trước.`);
        const finalFlv = flvUrl || globalFlvUrl;
        const finalHls = hlsUrl;
        
        currentMasterLiveState = {
          ...currentMasterLiveState,
          flvUrl: finalFlv,
          hlsUrl: finalHls,
          mediaUrl: finalFlv || currentMasterLiveState.mediaUrl,
          isVideo: true,
          isConnected: true,
          stage: currentMasterLiveState.stage || 'idol',
          updatedAt: Date.now()
        };
        io.emit('MASTER_LIVE_STATE_UPDATE', currentMasterLiveState);
        
        io.emit('tiktok_connected', { username: targetVideoUser, roomId: videoState?.roomId, flvUrl: finalFlv, hlsUrl: finalHls });
        io.emit('tiktok_status', { connected: true, username: targetVideoUser, roomId: videoState?.roomId, flvUrl: finalFlv, hlsUrl: finalHls });
        io.emit('tiktok_error', `Kênh Chat ${targetUser} chưa live, tạm thời chỉ phát Video.`);
        
        // Thử kết nối lại Chat ngầm mỗi 15 giây
        if (autoReconnectTimer) clearInterval(autoReconnectTimer);
        autoReconnectTimer = setInterval(() => {
          console.log(`[TikTok Live] 🔄 Đang thử kết nối lại Chat: ${targetUser}...`);
          tiktokConnection.connect().then(chatState => {
            console.log(`[TikTok Live] ✅ Kênh Chat đã online!`);
            clearInterval(autoReconnectTimer);
            autoReconnectTimer = null;
            io.emit('tiktok_status', { connected: true, username: targetUser, roomId: chatState?.roomId, flvUrl: finalFlv });
            io.emit('tiktok_connected', { username: targetUser, roomId: chatState?.roomId, flvUrl: finalFlv });
          }).catch(e => {});
        }, 15000);
      } else {
        // Cả hai đều thất bại
        let userFriendlyError = 'Kênh chưa phát Live hoặc ID không tồn tại!';
        io.emit('tiktok_error', userFriendlyError);
        io.emit('tiktok_status', { connected: false, username: targetUser });
        tiktokConnection = null;
      }
    });

    // ---- Lắng nghe sự kiện TikTok ----
    tiktokConnection.on('chat', data => {
      const chatPayload = {
        userId: String(data.userId || data.userDetails?.userId || data.uniqueId || ''),
        uniqueId: String(data.uniqueId || data.userDetails?.uniqueId || ''),
        nickname: String(data.nickname || data.userDetails?.nickname || data.uniqueId || 'Khán Giả'),
        username: String(data.nickname || data.uniqueId || 'Khán Giả'),
        comment: String(data.comment || ''),
        text: String(data.comment || ''),
        profilePictureUrl: String(data.profilePictureUrl || data.userDetails?.profilePictureUrls?.[0] || ''),
        avatar: String(data.profilePictureUrl || '')
      };
      console.log(`[TikTok Chat] 💬 ${chatPayload.nickname}: "${chatPayload.comment}"`);
      emitTikTokChat(chatPayload);
    });

    const streakMap = new Map();
    tiktokConnection.on('gift', data => {
      try {
        const giftId = String(data.giftId || data.gift?.id || data.extendedGiftInfo?.id || 'rose');
        const giftName = String(data.giftName || data.gift?.name || data.extendedGiftInfo?.name || data.describe || 'Quà TikTok');
        const diamondCount = Number(data.diamondCount || data.extendedGiftInfo?.diamond_count || data.gift?.diamond_count || 1) || 1;
        const userId = String(data.userId || data.userDetails?.userId || data.uniqueId || 'tiktok_viewer');
        const uniqueId = String(data.uniqueId || data.userDetails?.uniqueId || '');
        const nickname = String(data.nickname || data.userDetails?.nickname || data.uniqueId || 'Khán Giả');
        const avatar = String(data.profilePictureUrl || data.userDetails?.profilePictureUrls?.[0] || '');

        const streakKey = `${userId}_${giftId}`;
        const currentRepeatCount = Number(data.repeatCount) || 1;
        const prevCount = streakMap.get(streakKey) || 0;
        let count = 1;

        // Tính delta chính xác cho mọi loại quà (cả streak và non-streak)
        if (data.repeatCount !== undefined || data.giftType === 1) {
          count = currentRepeatCount - prevCount;
          if (data.repeatEnd) {
            streakMap.delete(streakKey);
          } else {
            streakMap.set(streakKey, currentRepeatCount);
          }
          if (count <= 0) {
            return; // Đã xử lý ở tick trước, bỏ qua tick repeatEnd trùng lặp!
          }
        } else {
          count = Number(data.repeatCount) || 1;
        }

        const giftPayload = {
          userId, uniqueId, nickname, username: nickname || uniqueId || 'Khán Giả',
          giftId, giftName, diamondCount, count, repeatCount: count,
          totalRepeatCount: data.repeatCount || count,
          profilePictureUrl: avatar, avatar,
          msgId: data.msgId || `${Date.now()}_${Math.random()}`,
          timestamp: data.timestamp || Date.now()
        };

        console.log(`[TikTok Gift] 🎁 ${nickname} tặng: ${giftName} x${count} (${diamondCount} xu)`);
        emitTikTokGift(giftPayload);
      } catch (err) {
        console.error('[TikTok Gift Error]:', err);
      }
    });

    tiktokConnection.on('like', data => {
      io.emit('tiktok_like', {
        userId: data.userId, uniqueId: data.uniqueId, nickname: data.nickname,
        likeCount: data.likeCount, totalLikeCount: data.totalLikeCount,
        profilePictureUrl: data.profilePictureUrl
      });
    });

    tiktokConnection.on('member', data => {
      io.emit('tiktok_member', {
        userId: data.userId, uniqueId: data.uniqueId,
        nickname: data.nickname, profilePictureUrl: data.profilePictureUrl
      });
    });

    tiktokConnection.on('streamEnd', () => {
      console.log(`[TikTok Live] 🛑 Stream kết thúc ${targetUser}`);
      tiktokConnection = null;
      io.emit('tiktok_stream_ended', { username: targetUser });
      io.emit('tiktok_status', { connected: false, username: targetUser, ended: true });
      // Auto-retry sau 60 giây
      if (currentUsername) {
        autoReconnectTimer = setTimeout(() => {
          if (currentUsername === targetUser && !tiktokConnection) {
            io.emit('REQUEST_RECONNECT_TIKTOK', { username: targetUser });
          }
        }, 60000);
      }
    });

    tiktokConnection.on('disconnected', () => {
      console.log(`[TikTok Live] ⚠️ Mất kết nối với ${targetUser}`);
      tiktokConnection = null;
      io.emit('tiktok_status', { connected: false, username: targetUser });
    });

    tiktokConnection.on('error', (err) => {
      console.error(`[TikTok Live] Error:`, err?.message || err);
    });

    } catch (unexpectedErr) {
      console.error('[TikTok Live] ❌ Lỗi ngoài dự kiến trong connect_tiktok:', unexpectedErr);
      io.emit('tiktok_error', `Lỗi server: ${unexpectedErr.message || unexpectedErr}`);
      io.emit('tiktok_status', { connected: false, username: targetUser || targetVideoUser });
    } finally {
      // 🔓 Luôn giải phóng khóa sau khi hoàn tất (dù thành công hay thất bại)
      isConnectingTikTok = false;
    }
  });

  // ---- Simulation Mode Control ----
  socket.on('start_simulation', () => {
    startSimulationMode();
    io.emit('tiktok_status', { connected: false, username: currentUsername || 'Simulation', simulationMode: true });
  });

  socket.on('stop_simulation', () => {
    stopSimulationMode();
    io.emit('tiktok_status', { connected: false, username: currentUsername, simulationMode: false });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// ============================================================
// REST API ENDPOINTS
// ============================================================

app.get('/api/tiktok/status', (req, res) => {
  res.json({
    connected: !!tiktokConnection && !!currentUsername,
    username: currentUsername,
    roomId: tiktokConnection?.roomId || null,
    simulationMode: isSimulationMode
  });
});

// Kết nối TikTok qua REST
app.post('/api/tiktok/connect', async (req, res) => {
  const { username, sessionId } = req.body || {};
  if (!username) return res.status(400).json({ error: 'Missing username' });
  // Trigger qua socket event
  io.emit('_server_connect_tiktok', { username: username.trim().replace(/^@/, ''), sessionId });
  res.json({ success: true, message: `Đang kết nối tới ${username}...` });
});

// Bật/tắt Simulation Mode qua REST
app.post('/api/simulation/start', (req, res) => {
  startSimulationMode();
  res.json({ success: true, message: 'Simulation Mode đã bật — Đang phát sự kiện test' });
});

app.post('/api/simulation/stop', (req, res) => {
  stopSimulationMode();
  res.json({ success: true, message: 'Simulation Mode đã tắt' });
});

// Test Gift qua REST (Manual)
app.post('/api/tiktok/test-gift', (req, res) => {
  const { giftId, giftName, count, diamondCount, username, avatar, regionTarget } = req.body || {};
  const deltaCount = Number(count) || 1;
  const diaCount = Number(diamondCount) || 1;
  const name = username || 'Chiến Binh Áo Đỏ 🇻🇳';
  const gName = giftName || 'Hoa Hồng';
  const gId = giftId || 'rose';

  const giftPayload = {
    userId: 'test_user_' + Date.now(), uniqueId: 'test_user',
    nickname: name, username: name,
    giftId: String(gId), giftName: gName,
    diamondCount: diaCount, count: deltaCount,
    repeatCount: deltaCount, totalRepeatCount: deltaCount,
    profilePictureUrl: avatar || '', avatar: avatar || '',
    regionTarget: regionTarget || null
  };

  console.log(`[Test Gift] 🎁 ${name} tặng: ${gName} x${deltaCount} (${diaCount} xu)`);
  emitTikTokGift(giftPayload);
  res.json({ success: true, gift: giftPayload });
});

// Test Comment qua REST (Manual)
app.post('/api/tiktok/test-chat', (req, res) => {
  const { username, comment } = req.body || {};
  const chatPayload = {
    userId: 'test_chat_' + Date.now(), uniqueId: 'test_chat',
    nickname: username || 'Khán Giả Test', username: username || 'Khán Giả Test',
    comment: comment || 'Chào shop!', text: comment || 'Chào shop!',
    profilePictureUrl: '', avatar: ''
  };
  console.log(`[Test Chat] 💬 ${chatPayload.nickname}: "${chatPayload.comment}"`);
  emitTikTokChat(chatPayload);
  res.json({ success: true, chat: chatPayload });
});

// Shopee Live Bridge State & APIs
let shopeeLiveState = {
  connected: false,
  rtmpUrl: 'rtmp://live.shopee.vn/live/',
  streamKey: '',
  roomUrl: '',
  shopName: 'Gian Hàng Shopee Mall',
  connectedAt: null
};

app.post('/api/shopee/connect', (req, res) => {
  const { rtmpUrl, streamKey, roomUrl, shopName } = req.body || {};
  shopeeLiveState = {
    connected: true,
    rtmpUrl: rtmpUrl || shopeeLiveState.rtmpUrl,
    streamKey: streamKey || shopeeLiveState.streamKey,
    roomUrl: roomUrl || '',
    shopName: shopName || shopeeLiveState.shopName,
    connectedAt: Date.now()
  };
  io.emit('shopee_live_status', shopeeLiveState);
  res.json({ success: true, state: shopeeLiveState });
});

app.post('/api/shopee/disconnect', (req, res) => {
  shopeeLiveState.connected = false;
  io.emit('shopee_live_status', shopeeLiveState);
  res.json({ success: true, message: 'Đã ngắt kết nối Shopee Live' });
});

app.get('/api/shopee/status', (req, res) => {
  res.json({ success: true, state: shopeeLiveState });
});

app.post('/api/shopee/test-order', (req, res) => {
  const { customerName, productName, price } = req.body || {};
  const orderEvent = {
    name: customerName || 'Khách Shopee VIP',
    item: productName || 'Combo Váy Thiết Kế Shopee Mall',
    price: price || '399.000đ',
    platform: 'Shopee Live'
  };
  io.emit('shopee_order_event', orderEvent);
  res.json({ success: true, order: orderEvent });
});

// Live State APIs
app.get('/api/live-state', (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  if (currentTunnelUrl) {
    currentMasterLiveState.tunnelUrl = currentTunnelUrl;
  }
  res.json(currentMasterLiveState);
});

app.post('/api/live-state', (req, res) => {
  if (req.body && typeof req.body === 'object') {
    const payload = { ...req.body };
    delete payload.force; // Không lưu cờ force vào live state
    
    // Nếu payload có chứa mediaUrl hợp lệ thì mới cập nhật, ngược lại giữ nguyên mediaUrl hiện tại
    if (payload.mediaUrl && typeof payload.mediaUrl === 'string') {
      if (payload.mediaUrl.startsWith('blob:')) {
        delete payload.mediaUrl; // Không lưu blob URL tạm thời
      } else if (payload.mediaUrl.includes('/uploads/')) {
        payload.mediaUrl = payload.mediaUrl.substring(payload.mediaUrl.indexOf('/uploads/'));
      }
    } else if (!payload.mediaUrl && !payload.clearMedia && currentMasterLiveState.mediaUrl) {
      delete payload.mediaUrl; // Bảo vệ video hiện tại không bị gán đè null
    }

    if (currentTunnelUrl && !payload.tunnelUrl) {
      payload.tunnelUrl = currentTunnelUrl;
    }

    currentMasterLiveState = { 
      ...currentMasterLiveState, 
      ...payload, 
      tunnelUrl: payload.tunnelUrl || currentTunnelUrl || currentMasterLiveState.tunnelUrl || null,
      updatedAt: Date.now() 
    };
    delete currentMasterLiveState.force;

    io.emit('MASTER_LIVE_STATE_UPDATE', currentMasterLiveState);
    // CHỈ BẮN VIDEO_PLAYBACK_CONTROL KHI CÓ SỰ KIỆN PLAY HOẶC PAUSE RÕ RÀNG (TRÁNH LẶP VIDEO VÀ TUA VỀ ĐẦU)
    if (payload.videoPlaybackEvent === 'play' || payload.videoPlaybackEvent === 'pause') {
      io.emit('VIDEO_PLAYBACK_CONTROL', {
        action: payload.videoPlaybackEvent,
        isPlaying: payload.isPlaying,
        mediaUrl: currentMasterLiveState.mediaUrl,
        timestamp: Date.now()
      });
    }
    saveLiveStateToFile(false);
  }
  res.json({ success: true, state: currentMasterLiveState });
});

// Endpoint điều khiển video thời gian thực siêu tốc 0ms cho OBS & TikTok Live Studio
app.post('/api/video-control', (req, res) => {
  const control = req.body;
  if (control && typeof control === 'object') {
    if (typeof control.isPlaying === 'boolean') {
      currentMasterLiveState.isPlaying = control.isPlaying;
    }
    if (control.action) {
      currentMasterLiveState.videoPlaybackEvent = control.action;
    }
    if (typeof control.currentTime === 'number') {
      currentMasterLiveState.videoCurrentTime = control.currentTime;
    }
    if (control.mediaUrl && typeof control.mediaUrl === 'string') {
      currentMasterLiveState.mediaUrl = control.mediaUrl;
      currentMasterLiveState.isVideo = true;
    }
    if (typeof control.isMuted === 'boolean') {
      currentMasterLiveState.isVideoAudioMuted = control.isMuted;
    }
    if (typeof control.volume === 'number') {
      currentMasterLiveState.videoVolume = control.volume;
    }
    const broadcastPayload = {
      ...control,
      timestamp: control.timestamp || Date.now()
    };
    io.emit('VIDEO_PLAYBACK_CONTROL', broadcastPayload);

    // Chỉ cập nhật và phát MASTER_LIVE_STATE_UPDATE khi không phải nhịp tim time_sync
    if (control.action !== 'time_sync') {
      currentMasterLiveState.updatedAt = Date.now();
      io.emit('MASTER_LIVE_STATE_UPDATE', currentMasterLiveState);
      saveLiveStateToFile(false);
    }
  }
  res.json({ success: true, state: currentMasterLiveState });
});

// Endpoint cho phép xóa/dừng video rõ ràng khi người dùng bấm nút xóa
app.post('/api/clear-media', (req, res) => {
  currentMasterLiveState = {
    ...currentMasterLiveState,
    mediaUrl: null,
    clearMedia: true,
    isUserExplicitMediaLocked: false,
    updatedAt: Date.now()
  };
  io.emit('MASTER_LIVE_STATE_UPDATE', currentMasterLiveState);
  saveLiveStateToFile();
  res.json({ success: true, message: 'Đã xóa video phát trực tiếp theo yêu cầu người dùng' });
});

app.get('/api/studio-frame', (req, res) => {
  res.json({ frame: globalLatestStudioCamFrame, timestamp: Date.now() });
});

app.post('/api/studio-frame', (req, res) => {
  if (req.body && req.body.frame) {
    globalLatestStudioCamFrame = req.body.frame;
    io.emit('STUDIO_CAM_FRAME', globalLatestStudioCamFrame);
  }
  res.json({ success: true });
});

app.get('/api/bando-state', (req, res) => { res.json(currentBandoGameState || {}); });
app.post('/api/bando-state', (req, res) => {
  if (req.body) { currentBandoGameState = req.body; io.emit('bando_sync', req.body); }
  res.json({ success: true });
});

app.get('/api/battle-state', (req, res) => { res.json(currentBattleGameState || {}); });
app.post('/api/battle-state', (req, res) => {
  if (req.body) { currentBattleGameState = req.body; io.emit('battle_sync', req.body); }
  res.json({ success: true });
});

// TTS Proxy
app.get('/api/tts', (req, res) => {
  const text = (req.query.text || '').toString().trim();
  const lang = (req.query.lang || 'vi').toString().trim();
  if (!text) return res.status(400).send('Missing text parameter');

  const encodedText = encodeURIComponent(text.slice(0, 200));
  const encodedLang = encodeURIComponent(lang.toLowerCase().startsWith('vi') ? 'vi' : (lang || 'vi'));
  const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=${encodedLang}&client=tw-ob`;

  https.get(ttsUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'audio/mpeg'
    }
  }, (proxyRes) => {
    if (proxyRes.statusCode !== 200) return res.status(proxyRes.statusCode).send('Failed TTS');
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    proxyRes.pipe(res);
  }).on('error', (err) => {
    console.warn('TTS proxy error:', err);
    res.status(500).send('TTS error');
  });
});

// AI Script Generation
app.post('/api/generate-script', async (req, res) => {
  try {
    const { brain, model, duration, topic } = req.body;
    if (!topic) return res.status(400).json({ error: 'Missing topic' });
    const prompt = `Viết kịch bản livestream bán hàng khoảng ${duration} phút về chủ đề: "${topic}".\nYêu cầu: Viết tự nhiên, cuốn hút, kích thích chốt đơn, có phần chào hỏi và tương tác với người xem. Không cần ghi chú hành động phức tạp.`;
    let generatedText = '';
    if (brain === 'gemini') {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY is not set' });
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error.message || 'Gemini API Error');
      generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } else if (brain === 'chatgpt') {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) return res.status(500).json({ error: 'OPENAI_API_KEY is not set' });
      let apiModel = 'gpt-4o-mini';
      if (model?.includes('GPT-4o (')) apiModel = 'gpt-4o';
      if (model?.toLowerCase().includes('gpt-3.5')) apiModel = 'gpt-3.5-turbo';
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({ model: apiModel, messages: [{ role: 'user', content: prompt }] })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error.message || 'OpenAI API Error');
      generatedText = data.choices?.[0]?.message?.content || '';
    } else {
      return res.status(400).json({ error: 'Unsupported AI Brain' });
    }
    res.json({ script: generatedText });
  } catch (error) {
    console.error('AI Gen Error:', error);
    res.status(500).json({ error: error.message || 'Server Error' });
  }
});

// SPA Fallback & Tuyến đường chuyên dụng cho TikTok LIVE Studio & OBS Studio
if (distPath) {
  const assetsDir = path.join(distPath, 'assets');
  if (fs.existsSync(assetsDir)) {
    app.use(['/assets', '/idol/assets', '/bando/assets', '/battle/assets', '/live/assets'], express.static(assetsDir, { maxAge: '1d' }));
  }

  app.get(['/idol', '/bando', '/battle', '/live', '/overlay-idol', '/overlay-bando', '/overlay-battle'], (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.sendFile(path.join(distPath, 'index.html'));
  });

  app.use((req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next();
    if (req.url.startsWith('/api') || req.url.startsWith('/socket.io')) return next();
    if (req.url.includes('.') && !req.url.includes('.html')) return next();
    if (req.method === 'HEAD') {
      return res.status(200).type('text/html').end();
    }
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 3001;
const scheme = usingHttps ? 'https' : 'http';

// ============================================================
// TUNNEL URL — Lưu URL công khai do localtunnel cấp
// ============================================================
let currentTunnelUrl = null;
let tunnelStatus = 'connecting'; // 'connecting' | 'active' | 'error'

// API: Cho phép frontend lấy tunnel URL để dán vào TikTok Studio
app.get('/api/tunnel-url', (req, res) => {
  res.json({
    tunnelUrl: currentTunnelUrl,
    status: tunnelStatus,
    localUrl: `http://localhost:${PORT}`,
    projects: {
      idol:   currentTunnelUrl ? `${currentTunnelUrl}/idol`   : null,
      bando:  currentTunnelUrl ? `${currentTunnelUrl}/bando`  : null,
      battle: currentTunnelUrl ? `${currentTunnelUrl}/battle` : null,
    }
  });
});

httpServer.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n⚠️  Cảnh báo: Cổng ${PORT} đang được sử dụng bởi phiên khác.`);
    console.error(`💡 Đang tự động chuyển sang cổng ${Number(PORT) + 1}...`);
    httpServer.listen(Number(PORT) + 1, () => {
      console.log(`🌐 Màn Hình Chính: ${scheme}://localhost:${Number(PORT) + 1}`);
    });
  } else {
    console.error('Server error:', err);
  }
});

httpServer.timeout = 300000; // 5 phút (hỗ trợ upload & stream video 1-2 tiếng dung lượng lớn)
httpServer.keepAliveTimeout = 65000;

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`\n===========================================================`);
  console.log(`🚀 HỆ THỐNG AVALIVE LIVESTREAM VIP PRO ĐANG HOẠT ĐỘNG!`);
  console.log(`🌐 Màn Hình Chính: ${scheme}://localhost:${PORT}`);
  console.log(`🌐 Màn Hình Local IP: ${scheme}://127.0.0.1:${PORT}`);
  console.log(`🗺️ Overlay Bản Đồ: ${scheme}://localhost:${PORT}/?overlay=bando`);
  console.log(`⚔️ Overlay Chiến Đấu: ${scheme}://localhost:${PORT}/?overlay=battle`);
  console.log(`🎭 Test Gift: POST ${scheme}://localhost:${PORT}/api/tiktok/test-gift`);
  console.log(`💬 Test Chat: POST ${scheme}://localhost:${PORT}/api/tiktok/test-chat`);
  console.log(`🎬 Simulation: POST ${scheme}://localhost:${PORT}/api/simulation/start`);
  if (usingHttps) {
    console.log(`⚠️  Lần đầu mở trên trình duyệt sẽ hiện cảnh báo bảo mật (chứng chỉ tự ký) — bấm "Nâng cao" → "Tiếp tục truy cập" là dùng được.`);
  }
  console.log(`===========================================================\n`);
});

// Hỗ trợ song song cả cổng 5173 để dù người dùng nhập 127.0.0.1:5173 hay 3001 đều chạy 100%
try {
  const http5173 = http.createServer(app);
  http5173.on('error', () => {}); // Tự động bỏ qua nếu Vite dev đang chiếm cổng 5173
  http5173.listen(5173, '0.0.0.0', () => {
    console.log(`🌐 Hỗ trợ kết nối song song qua cổng 5173: ${scheme}://127.0.0.1:5173`);
  });
} catch (e) {}

// ============================================================
// 🌐 CLOUDFLARE QUICK TUNNEL — Cross-platform (Windows + Mac + Linux)
// ✅ Dùng npm package 'cloudflared' — tự tải đúng binary cho mỗi OS
// ✅ Không có trang cảnh báo IP như localtunnel
// ✅ TikTok Studio chấp nhận *.trycloudflare.com ngay lập tức
// ✅ User tải phần mềm về, npm install, chạy là xong — không cần cài thêm gì
// ============================================================
const { spawn } = require('child_process');

let activeCloudflaredProc = null;
let healthCheckTimer = null;

// API: Làm mới tunnel thủ công khi cần
app.post('/api/refresh-tunnel', (req, res) => {
  console.log('🔄 [Tunnel] Yêu cầu cấp lại đường link tunnel mới...');
  if (activeCloudflaredProc) {
    try { activeCloudflaredProc.kill('SIGKILL'); } catch (e) {}
    activeCloudflaredProc = null;
  }
  currentTunnelUrl = null;
  tunnelStatus = 'connecting';
  io.emit('TUNNEL_URL_UPDATE', {
    status: 'connecting',
    tunnelUrl: null,
    projects: {}
  });
  setTimeout(() => startCloudflaredTunnel(PORT), 800);
  res.json({ success: true, message: 'Đang khởi tạo đường link Cloudflare mới...' });
});

async function startCloudflaredTunnel(port) {
  console.log('\n🔗 [Tunnel] Khởi động Cloudflare Quick Tunnel...');
  tunnelStatus = 'connecting';

  if (activeCloudflaredProc) {
    try { activeCloudflaredProc.kill('SIGKILL'); } catch (e) {}
    activeCloudflaredProc = null;
  }

  let cloudflaredBin = null;

  // 1. Thử kiểm tra binary từ npm cloudflared nếu file tồn tại
  try {
    const cloudflaredPkg = require('cloudflared');
    if (cloudflaredPkg && cloudflaredPkg.bin && fs.existsSync(cloudflaredPkg.bin)) {
      cloudflaredBin = cloudflaredPkg.bin;
    }
  } catch (e) {}

  // 2. Kiểm tra các thư mục chứa binary (hỗ trợ Windows và Mac)
  if (!cloudflaredBin) {
    const isWin = process.platform === 'win32';
    const candidatePaths = isWin ? [
      path.join(process.cwd(), 'cloudflared.exe'),
      path.join(__dirname, 'cloudflared.exe'),
      path.join(process.cwd(), 'system', 'cloudflared.exe'),
      path.join(__dirname, 'system', 'cloudflared.exe'),
      path.join(__dirname, '..', 'system', 'cloudflared.exe'),
      path.join(process.cwd(), '..', 'system', 'cloudflared.exe'),
      path.join(process.cwd(), '..', 'cloudflared.exe'),
      path.join(__dirname, '..', 'cloudflared.exe'),
      path.join(__dirname, '..', 'scripts', 'bin', 'cloudflared.exe'),
      path.join(process.cwd(), 'scripts', 'bin', 'cloudflared.exe'),
      'cloudflared.exe'
    ] : [
      path.join(process.cwd(), 'system', 'cloudflared'),
      path.join(__dirname, '..', 'system', 'cloudflared'),
      path.join(process.cwd(), 'bin', 'cloudflared'),
      path.join(__dirname, '..', 'bin', 'cloudflared'),
      path.join(__dirname, 'cloudflared'),
      path.join(__dirname, '..', 'cloudflared'),
      path.join(process.cwd(), 'cloudflared'),
      path.join(__dirname, '..', 'node_modules', 'cloudflared', 'bin', 'cloudflared'),
      path.join(process.cwd(), 'node_modules', 'cloudflared', 'bin', 'cloudflared'),
      '/usr/local/bin/cloudflared',
      '/opt/homebrew/bin/cloudflared',
      '/tmp/cloudflared',
      'cloudflared'
    ];
    for (const p of candidatePaths) {
      try {
        if (fs.existsSync(p)) {
          cloudflaredBin = p;
          break;
        }
      } catch (err) {}
    }
  }

  // 3. Khởi chạy binary an toàn 100% không bao giờ gây crash
  if (cloudflaredBin) {
    if (process.platform !== 'win32' && fs.existsSync(cloudflaredBin)) {
      try { fs.chmodSync(cloudflaredBin, 0o755); } catch (e) {}
    }
    console.log(`📎 [Tunnel] Sử dụng binary: ${cloudflaredBin}`);
    try {
      const proc = spawn(cloudflaredBin, [
        'tunnel', '--url', `http://127.0.0.1:${port}`,
        '--no-autoupdate'
      ], { stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true });
      activeCloudflaredProc = proc;

      proc.on('error', (err) => {
        console.warn('❌ [Tunnel] Lỗi spawn binary:', err.message);
        tunnelStatus = 'error';
        startLocaltunnelFallback(port);
      });

      const parseUrl = (data) => {
        try {
          const str = data.toString();
          const match = str.match(/https:\/\/[a-z0-9\-]+\.trycloudflare\.com/);
          if (match && !currentTunnelUrl) {
            currentTunnelUrl = match[0];
            tunnelStatus = 'active';
            currentMasterLiveState.tunnelUrl = currentTunnelUrl;
            printTunnelReady(currentTunnelUrl);
            io.emit('TUNNEL_URL_UPDATE', {
              status: 'active',
              tunnelUrl: currentTunnelUrl,
              projects: {
                idol: `${currentTunnelUrl}/idol`,
                bando: `${currentTunnelUrl}/bando`,
                battle: `${currentTunnelUrl}/battle`
              }
            });
            io.emit('MASTER_LIVE_STATE_UPDATE', currentMasterLiveState);
            saveLiveStateToFile(false);
            startTunnelLivenessMonitor(currentTunnelUrl, port);
          }
        } catch (e) {}
      };

      if (proc.stdout) proc.stdout.on('data', parseUrl);
      if (proc.stderr) proc.stderr.on('data', parseUrl);

      proc.on('exit', (code) => {
        console.log(`\n⚠️  [Tunnel] Cloudflared thoát (code ${code}). Đang khởi động lại...`);
        currentTunnelUrl = null;
        tunnelStatus = 'connecting';
        activeCloudflaredProc = null;
        setTimeout(() => startCloudflaredTunnel(port), 3000);
      });

      return;
    } catch (spawnErr) {
      console.warn('❌ [Tunnel Exception caught]:', spawnErr.message);
      tunnelStatus = 'error';
    }
  }

  // Cách 3: Fallback localtunnel
  console.warn('\n⚠️  [Tunnel] Không tìm thấy cloudflared. Thử localtunnel dự phòng...');
  startLocaltunnelFallback(port);
}

function printTunnelReady(tunnelUrl) {
  console.log('\n╔══════════════════════════════════════════════════════╗');
  console.log('║  🎉 CLOUDFLARE TUNNEL ĐÃ SẴN SÀNG (KHÔNG CẦN IP)!   ║');
  console.log('╠══════════════════════════════════════════════════════╣');
  console.log(`║  🌐 Base URL:  ${tunnelUrl.padEnd(38)}║`);
  console.log(`║  👑 AI Idol:   ${(tunnelUrl + '/idol').padEnd(38)}║`);
  console.log(`║  🗺️  Bản Đồ:   ${(tunnelUrl + '/bando').padEnd(38)}║`);
  console.log(`║  ⚔️  Battle:   ${(tunnelUrl + '/battle').padEnd(38)}║`);
  console.log('╠══════════════════════════════════════════════════════╣');
  console.log('║  ✅ Dán link trên vào TikTok Live Studio - 100% OK!  ║');
  console.log('╚══════════════════════════════════════════════════════╝\n');
}

// Fallback: localtunnel nếu cloudflared không hoạt động
async function startLocaltunnelFallback(port) {
  try {
    const localtunnel = require('localtunnel');
    console.log('🔗 [Tunnel Fallback] Thử localtunnel...');
    const tunnel = await localtunnel({ port });
    currentTunnelUrl = tunnel.url;
    tunnelStatus = 'active';
    console.log(`🌐 [Tunnel Fallback] URL: ${tunnel.url} (lưu ý: cần nhập IP khi lần đầu truy cập)`);
    tunnel.on('close', () => {
      currentTunnelUrl = null;
      tunnelStatus = 'connecting';
      setTimeout(() => startLocaltunnelFallback(port), 3000);
    });
  } catch (err) {
    console.error('❌ [Tunnel] Tất cả phương thức tunnel đều thất bại:', err.message);
    tunnelStatus = 'error';
    setTimeout(() => startCloudflaredTunnel(port), 15000);
  }
}

let consecutiveTunnelFailures = 0;
function startTunnelLivenessMonitor(tunnelUrl, port) {
  if (healthCheckTimer) clearInterval(healthCheckTimer);
  consecutiveTunnelFailures = 0;
  console.log(`🛡️  [Tunnel] Khởi động giám sát tự phục hồi 24/7 cho: ${tunnelUrl}`);

  healthCheckTimer = setInterval(() => {
    if (!currentTunnelUrl || currentTunnelUrl !== tunnelUrl) return;

    try {
      const parsed = new URL(tunnelUrl);
      const hostname = parsed.hostname;
      dns.lookup(hostname, (err) => {
        if (err && (err.code === 'ENOTFOUND' || err.code === 'EAI_AGAIN')) {
          consecutiveTunnelFailures++;
          console.warn(`⚠️ [Tunnel Watchdog] DNS lookup thất bại cho ${hostname} (${consecutiveTunnelFailures}/3): ${err.code}`);
          if (consecutiveTunnelFailures >= 3) {
            console.warn(`🚨 [Tunnel Watchdog] Tên miền tunnel đã hết hạn trên Cloudflare Edge! Đang cấp link mới...`);
            consecutiveTunnelFailures = 0;
            clearInterval(healthCheckTimer);
            if (activeCloudflaredProc) {
              try { activeCloudflaredProc.kill('SIGKILL'); } catch (e) {}
              activeCloudflaredProc = null;
            }
            currentTunnelUrl = null;
            tunnelStatus = 'connecting';
            io.emit('TUNNEL_URL_UPDATE', { status: 'connecting', tunnelUrl: null, projects: {} });
            setTimeout(() => startCloudflaredTunnel(port), 1000);
          }
        } else {
          consecutiveTunnelFailures = 0;
        }
      });
    } catch (e) {}
  }, 25000);
}

// Khởi động tunnel ngay sau khi server chạy
setTimeout(() => startCloudflaredTunnel(Number(PORT)), 500);

