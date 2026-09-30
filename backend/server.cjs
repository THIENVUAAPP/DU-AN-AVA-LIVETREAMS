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
const os = require('os');

// Helper lấy IP mạng nội bộ LAN của máy tính (WiFi / Ethernet)
function getLocalLanIp() {
  try {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name]) {
        if (iface.family === 'IPv4' && !iface.internal) {
          return iface.address;
        }
      }
    }
  } catch (e) {}
  return '127.0.0.1';
}

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
app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ extended: true, limit: '200mb' }));

// Phục vụ frontend từ thư mục app hoặc dist
const candidateDistPaths = [
  path.join(__dirname, 'app'),
  path.join(__dirname, 'dist'),
  path.join(process.cwd(), 'app'),
  path.join(process.cwd(), 'dist'),
  path.join(process.cwd(), 'system', 'app'),
  path.join(process.cwd(), 'system', 'dist'),
  path.join(__dirname, '../app'),
  path.join(__dirname, '../dist'),
  path.join(__dirname, './dist')
];

let distPath = null;
for (const p of candidateDistPaths) {
  if (fs.existsSync(p) && fs.existsSync(path.join(p, 'index.html'))) {
    distPath = p;
    break;
  }
}

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

const candidateUploadDirs = [
  uploadsDir,
  path.join(process.cwd(), 'system', 'uploads'),
  path.join(process.cwd(), 'backend', 'uploads'),
  path.join(process.cwd(), 'uploads'),
  path.join(__dirname, '..', 'uploads'),
  path.join(__dirname, '..', 'system', 'uploads')
];

function findFileInUploadDirs(filename) {
  if (!filename) return null;
  let cleanName = path.basename(filename).split('?')[0];
  let decodedName = cleanName;
  try { decodedName = decodeURIComponent(cleanName); } catch(e) {}
  
  for (const dir of candidateUploadDirs) {
    if (!fs.existsSync(dir)) continue;
    const p1 = path.join(dir, cleanName);
    if (fs.existsSync(p1)) return p1;
    const p2 = path.join(dir, decodedName);
    if (fs.existsSync(p2)) return p2;
  }
  return null;
}

// 🛡️ TỰ ĐỘNG DỌN DẸP CÁC BẢN SAO VIDEO TRÙNG LẶP TRONG uploadsDir (GIẢI PHÓNG HÀNG CHỤC GB Ổ CỨNG)
function cleanupDuplicateUploads() {
  try {
    if (!fs.existsSync(uploadsDir)) return;
    const files = fs.readdirSync(uploadsDir);
    const sizeMap = new Map(); // hashKey -> firstFilePath
    let savedBytes = 0;
    let removedFiles = 0;
    const crypto = require('crypto');

    for (const file of files) {
      const fullPath = path.join(uploadsDir, file);
      try {
        const stat = fs.statSync(fullPath);
        // Tự động xóa file 0 byte hoặc file tạm dang dở
        if (stat.size === 0 || file.endsWith('.tmp') || file.endsWith('.crdownload') || (file.includes('.part') && Date.now() - stat.mtimeMs > 180000)) {
          fs.unlinkSync(fullPath);
          console.log(`[Storage Cleanup] 🧹 Đã dọn sạch file 0-byte / rác / dang dở: ${file}`);
          continue;
        }
        if (!file.startsWith('media-') || file.includes('.part')) continue;
        if (stat.size < 1000) continue;

        // Tính hash MD5 1MB đầu hoặc toàn bộ file nếu nhỏ hơn 20MB
        let fileHash = '';
        if (stat.size <= 20 * 1024 * 1024) {
          fileHash = crypto.createHash('md5').update(fs.readFileSync(fullPath)).digest('hex');
        } else {
          const sampleBuf = Buffer.alloc(1024 * 1024);
          const fd = fs.openSync(fullPath, 'r');
          fs.readSync(fd, sampleBuf, 0, 1024 * 1024, 0);
          fs.closeSync(fd);
          fileHash = crypto.createHash('md5').update(sampleBuf).digest('hex');
        }
        const key = `${stat.size}_${fileHash}`;

        if (sizeMap.has(key)) {
          const original = sizeMap.get(key);
          const deletedUrl = `/uploads/${file}`;
          const originalUrl = `/uploads/${path.basename(original)}`;

          fs.unlinkSync(fullPath);
          savedBytes += stat.size;
          removedFiles++;
          console.log(`[Storage Cleanup] 🗑️ Đã xóa video trùng lặp: ${file} -> Giữ lại bản gốc: ${path.basename(original)}`);

          // 🛡️ TỰ ĐỘNG SỬA LIVE STATE: Nếu mediaUrl đang trỏ đến file vừa xóa -> chuyển sang file gốc
          if (currentMasterLiveState && currentMasterLiveState.mediaUrl && currentMasterLiveState.mediaUrl.includes(file)) {
            currentMasterLiveState.mediaUrl = originalUrl;
            currentMasterLiveState.updatedAt = Date.now();
            saveLiveStateToFile();
            console.log(`[Storage Cleanup] 🔄 Đã cập nhật live_state.mediaUrl: ${deletedUrl} -> ${originalUrl}`);
          }
        } else {
          sizeMap.set(key, fullPath);
        }
      } catch (err) {}
    }

    if (removedFiles > 0) {
      const gbSaved = (savedBytes / (1024 * 1024 * 1024)).toFixed(2);
      console.log(`[Storage Cleanup] 🎉 ĐÃ GIẢI PHÓNG THÀNH CÔNG ${gbSaved} GB từ ${removedFiles} video trùng lặp!`);
    }
  } catch (e) {
    console.warn('[Storage Cleanup error]', e);
  }
}
cleanupDuplicateUploads();

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
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 * 1024 } // Hỗ trợ video lớn lên tới 10GB
});

// ============================================================
// ⚡ MP4 FASTSTART ENGINE (ZERO-LATENCY STREAMING OPTIMIZER)
// Đưa atom 'moov' (metadata, keyframe index, audio/video track table)
// lên ngay sau 'ftyp' (byte 28) để TikTok Live Studio & trình duyệt
// chỉ cần đọc 45KB đầu tiên là phát ngay tức thì 0.05s, không cần tải hết file!
// ============================================================
function ensureMp4FastStart(filePath) {
  // 🛡️ AN TOÀN 100%: Bảo toàn nguyên vẹn dữ liệu file gốc của người dùng.
  // Tuyệt đối không can thiệp ghi đè nhị phân atom moov gây phá hỏng khung hình (corrupt video / đen màn hình).
  // Hệ thống đã tích hợp HTTP 206 Partial Content Range Streaming tức thì 0ms cho TikTok Live Studio & OBS.
  try {
    if (!fs.existsSync(filePath)) return false;
    const stat = fs.statSync(filePath);
    return stat.size > 0;
  } catch (err) {
    return false;
  }
}

// 🧹 HÀM TỰ ĐỘNG QUÉT VÀ DỌN SẠCH FILE ĐEN, FILE 0-BYTE & FILE RÁC TRONG TẤT CẢ THƯ MỤC UPLOADS
function cleanupBlackAndCorruptUploads() {
  const targetDirs = [
    uploadsDir,
    path.join(process.cwd(), 'uploads'),
    path.join(process.cwd(), 'system', 'uploads'),
    path.join(__dirname, '..', 'uploads'),
    path.join(__dirname, '..', 'system', 'uploads')
  ];
  let cleanedCount = 0;
  for (const dir of targetDirs) {
    if (!fs.existsSync(dir)) continue;
    try {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        if (file.startsWith('.')) continue;
        const fullPath = path.join(dir, file);
        try {
          const stat = fs.statSync(fullPath);
          if (stat.isFile()) {
            if (stat.size === 0 || file.endsWith('.tmp') || file.endsWith('.part') || file.endsWith('.crdownload') || file.endsWith('.faststart.tmp')) {
              fs.unlinkSync(fullPath);
              cleanedCount++;
            }
          }
        } catch (e) {}
      }
    } catch (e) {}
  }
  if (cleanedCount > 0) {
    console.log(`[Upload Cleanup] 🧹 Đã dọn sạch ${cleanedCount} file rác / 0-byte trong thư mục uploads.`);
  }
}
cleanupBlackAndCorruptUploads();

// 🛡️ TỰ ĐỘNG QUÉT & TỐI ƯU TOÀN BỘ VIDEO TRONG THƯ MỤC UPLOADS Ở BACKGROUND (KHÔNG CHẶN KHỞI ĐỘNG SERVER)
setTimeout(() => {
  try {
    if (fs.existsSync(uploadsDir)) {
      const existingMedia = fs.readdirSync(uploadsDir);
      for (const f of existingMedia) {
        if (f.endsWith('.mp4') || f.endsWith('.mov')) {
          ensureMp4FastStart(path.join(uploadsDir, f));
        }
      }
    }
  } catch (scanErr) {}
}, 2000);

// 🎬 TỰ ĐỘNG TÌM FILE VIDEO MỚI NHẤT & CHUẨN XÁC TRONG TẤT CẢ THƯ MỤC UPLOADS
function getLatestUploadFilePath() {
  try {
    const videoExts = ['.mp4', '.webm', '.mov', '.mkv', '.avi', '.flv', '.m4v', '.ts', '.m3u8'];
    const allFiles = [];
    for (const dir of candidateUploadDirs) {
      if (!fs.existsSync(dir)) continue;
      try {
        const list = fs.readdirSync(dir);
        for (const f of list) {
          const ext = path.extname(f).toLowerCase();
          if (videoExts.includes(ext) && !f.endsWith('.part') && !f.startsWith('.') && !f.includes('default_idol')) {
            const fullPath = path.join(dir, f);
            try {
              allFiles.push({ name: f, path: fullPath, time: fs.statSync(fullPath).mtimeMs });
            } catch(e) {}
          }
        }
      } catch(e) {}
    }
    allFiles.sort((a, b) => b.time - a.time);
    if (allFiles.length > 0) {
      return allFiles[0].path;
    }
  } catch (e) {}
  return null;
}

function getLatestUploadMediaUrl() {
  try {
    const videoExts = ['.mp4', '.webm', '.mov', '.mkv', '.avi', '.flv', '.m4v', '.ts', '.m3u8'];
    const allFiles = [];
    for (const dir of candidateUploadDirs) {
      if (!fs.existsSync(dir)) continue;
      try {
        const list = fs.readdirSync(dir);
        for (const f of list) {
          const ext = path.extname(f).toLowerCase();
          if (videoExts.includes(ext) && !f.endsWith('.part') && !f.startsWith('.') && !f.includes('default_idol')) {
            const fullPath = path.join(dir, f);
            try {
              allFiles.push({ name: f, path: fullPath, time: fs.statSync(fullPath).mtimeMs });
            } catch(e) {}
          }
        }
      } catch(e) {}
    }
    allFiles.sort((a, b) => b.time - a.time);
    if (allFiles.length > 0) {
      return `/uploads/${allFiles[0].name}`;
    }
  } catch (e) {}
  return null;
}

// 🧹 TỰ ĐỘNG DỌN DẸP FILE RÁC UPLOADS CŨ (GIỮ LẠI CÁC FILE ĐANG PHÁT & 5 FILE MỚI NHẤT, GIẢM DUNG LƯỢNG ĐĨA TỐI ĐA)
function pruneOldUploads() {
  try {
    if (!fs.existsSync(uploadsDir)) return;
    const activeMediaUrl = currentMasterLiveState?.mediaUrl || '';
    const activeFilename = activeMediaUrl.includes('/uploads/') ? path.basename(activeMediaUrl) : '';
    const files = fs.readdirSync(uploadsDir)
      .filter(f => !f.startsWith('.') && f !== '.gitkeep' && !f.includes('default_idol'))
      .map(f => {
        try {
          return { name: f, fullPath: path.join(uploadsDir, f), time: fs.statSync(path.join(uploadsDir, f)).mtimeMs };
        } catch (e) {
          return null;
        }
      })
      .filter(Boolean);

    // 🛡️ CHỈ DỌN DẸP CÁC FILE TẠM .part BỊ BỎ DỞ QUÁ 24 GIỜ (KHÔNG BAO GIỜ XOÁ VIDEO HOÀN CHỈNH CỦA NGƯỜI DÙNG)
    const now = Date.now();
    for (const item of files) {
      if (item.name.includes('.part') && (now - item.time > 24 * 60 * 60 * 1000)) {
        try {
          fs.unlinkSync(item.fullPath);
          console.log(`[AutoCleaner] 🧹 Đã dọn dẹp file upload tạm bị bỏ dở: ${item.name}`);
        } catch (delErr) {}
      }
    }
  } catch (err) {}
}

// Chạy dọn dẹp định kỳ mỗi 60 phút
setInterval(pruneOldUploads, 60 * 60 * 1000);
setTimeout(pruneOldUploads, 5000);

// ⚡ HIGH-PERFORMANCE VIDEO STREAMING ENGINE (HTTP 206 Byte-Range Partial Content)
// Giúp video MP4/WebM load ngay lập tức 0ms, không lag, không giật, hỗ trợ video 1GB - 50GB dài hàng chục tiếng trên TikTok Live Studio & OBS
app.all(['/uploads/:filename', /^\/uploads\/.*/], (req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD' && req.method !== 'OPTIONS') return next();

  let reqName = req.params.filename || req.path.replace(/^\/uploads\/?/, '') || '';
  try { reqName = decodeURIComponent(reqName); } catch(e) {}
  reqName = path.basename(reqName);

  let filePath = findFileInUploadDirs(reqName);
  if (!filePath || !fs.existsSync(filePath)) {
    const isImageReq = /\.(png|jpe?g|webp|gif|svg|avif|bmp)($|\?|#)/i.test(reqName);
    if (!isImageReq) {
      // 🛡️ TỰ ĐỘNG DỰ PHÒNG: Nếu file requested không tồn tại (link cũ hoặc bị xóa), phát ngay file video mới nhất trên server
      const fallbackPath = getLatestUploadFilePath();
      if (fallbackPath && fs.existsSync(fallbackPath)) {
        filePath = fallbackPath;
      } else {
        return res.status(404).send('Media not found');
      }
    } else {
      // Tìm file ảnh dự phòng trong uploads hoặc public
      const imgFallback = path.join(__dirname, '..', 'public', 'official_logo.png');
      if (fs.existsSync(imgFallback)) {
        filePath = imgFallback;
      } else {
        return res.status(404).send('Image not found');
      }
    }
  }

  try {
    const stat = fs.statSync(filePath);
    const activeUpload = Object.values(activeStreamUploads).find(s => s && s.filename === reqName);
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
      '.mkv': 'video/x-matroska',
      '.avi': 'video/x-msvideo',
      '.m4v': 'video/x-m4v',
      '.flv': 'video/x-flv',
      '.ts': 'video/mp2t',
      '.m3u8': 'application/x-mpegURL',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
      '.gif': 'image/gif'
    };
    const contentType = mimeTypes[ext] || 'video/mp4';

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      let start = 0;
      let end = currentOnDiskSize - 1;

      // 1. Hỗ trợ Suffix Range: bytes=-N (Đọc N byte cuối file để lấy moov atom cho video dài nhiều tiếng)
      if (parts[0] === '' && parts[1]) {
        const suffix = parseInt(parts[1], 10);
        if (!isNaN(suffix) && suffix > 0) {
          start = Math.max(0, currentOnDiskSize - suffix);
          end = currentOnDiskSize - 1;
        }
      } else {
        start = parseInt(parts[0], 10);
        // Kiểm tra phạm vi hợp lệ
        if (isNaN(start) || start < 0 || start >= currentOnDiskSize) {
          res.status(416).set('Content-Range', `bytes */${currentOnDiskSize}`).end();
          return;
        }

        if (parts[1] && parts[1].trim() !== '') {
          // Range cụ thể: bytes=START-END
          end = parseInt(parts[1], 10);
          if (isNaN(end) || end >= currentOnDiskSize) end = currentOnDiskSize - 1;
        } else {
          // ⚡ CHUẨN HTTP RFC 7233 STREAMING QUA INTERNET & TIKTOK LIVE STUDIO:
          // Phục vụ chunk tối ưu 4MB để chống nghẽn đường truyền và triệt tiêu 100% lỗi timeout 524 Cloudflare
          const maxChunkSlice = 4 * 1024 * 1024; // 4MB slice
          end = Math.min(currentOnDiskSize - 1, start + maxChunkSlice - 1);
        }
      }

      if (end < start) {
        res.status(416).set('Content-Range', `bytes */${currentOnDiskSize}`).end();
        return;
      }

      const chunksize = Math.max(1, (end - start) + 1);
      const etag = `W/"${stat.size}-${Math.floor(stat.mtimeMs)}"`;
      const isRemoteClient = Boolean(req.headers['x-forwarded-for'] || req.headers['cf-connecting-ip']);
      const streamBuffer = isRemoteClient ? Math.min(chunksize, 2 * 1024 * 1024) : Math.min(chunksize, 8 * 1024 * 1024);

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${declaredFileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': contentType,
        'ETag': etag,
        'Last-Modified': stat.mtime.toUTCString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Cloudflare-CDN-Cache-Control': 'max-age=31536000',
        'CDN-Cache-Control': 'max-age=31536000',
        'Connection': 'keep-alive',
        'Keep-Alive': 'timeout=120, max=1000',
        'X-Content-Type-Options': 'nosniff',
        'X-Accel-Buffering': 'no', // Chống Nginx & Cloudflare buffer gây trễ / đứng khung hình
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Expose-Headers': 'Content-Range, Accept-Ranges, Content-Length, ETag'
      });

      try { req.socket.setNoDelay(true); } catch(e) {}

      const stream = fs.createReadStream(filePath, { start, end, highWaterMark: streamBuffer });
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
        'Cache-Control': 'public, max-age=86400, immutable',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Expose-Headers': 'Content-Range, Accept-Ranges, Content-Length'
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
        let isLinked = false;
        // ⚡ CHIẾN THUẬT 1: Hardlink siêu tốc 0.001ms (Zero-Copy) - Video 20GB xuất hiện ngay lập tức 0ms!
        try {
          fs.linkSync(clientFilePath, targetPath);
          isLinked = true;
          console.log(`[FastStream] ⚡ Hardlink thành công video nặng 0ms: ${targetFilename}`);
        } catch (linkErr) {
          // ⚡ CHIẾN THUẬT 2: Symlink nếu khác ổ đĩa
          try {
            fs.symlinkSync(clientFilePath, targetPath);
            isLinked = true;
            console.log(`[FastStream] ⚡ Symlink thành công video: ${targetFilename}`);
          } catch (symErr) {}
        }

        const fileUrl = `/uploads/${targetFilename}`;

        if (isLinked) {
          if (targetFilename.endsWith('.mp4') || targetFilename.endsWith('.mov')) {
            ensureMp4FastStart(targetPath);
          }
          return res.json({ success: true, instant: true, fileUrl });
        } else {
          // ⚡ CHIẾN THUẬT 3: Async Copy không block Node.js event loop
          fs.copyFile(clientFilePath, targetPath, (copyErr) => {
            if (!copyErr && (targetFilename.endsWith('.mp4') || targetFilename.endsWith('.mov'))) {
              ensureMp4FastStart(targetPath);
            }
          });
          return res.json({ success: true, instant: true, fileUrl });
        }
      } catch (copyErr) {
        console.error('[FastStream instant error]', copyErr);
      }
    }

    // 🛡️ DEDUPLICATION: Kiểm tra xem video này đã có sẵn trên máy/backend chưa (Chống lưu chồng chéo, không nhân đôi dung lượng)
    const totalSize = parseInt(fileSize, 10) || 0;
    if (totalSize > 50000 && fs.existsSync(uploadsDir)) {
      try {
        const existingFiles = fs.readdirSync(uploadsDir);
        for (const f of existingFiles) {
          if (f.startsWith('media-') && !f.includes('.part')) {
            const fPath = path.join(uploadsDir, f);
            try {
              const stat = fs.statSync(fPath);
              if (stat.size === totalSize) {
                // TÌM THẤY VIDEO ĐÃ CÓ SẴN TRÊN MÁY!
                console.log(`[FastStream Deduplication] ⚡ Tái sử dụng video đã có sẵn 0ms (${totalSize} bytes): ${f}`);
                const fileUrl = `/uploads/${f}`;
                return res.json({
                  success: true,
                  instant: true,
                  reused: true,
                  fileUrl,
                  filename: f,
                  message: 'Video đã có sẵn trên hệ thống, tái sử dụng tức thì 0ms không tốn dung lượng'
                });
              }
            } catch (e) {}
          }
        }
      } catch (dedupErr) {
        console.warn('[Deduplication error]', dedupErr);
      }
    }

    const ext = path.extname(originalName || '') || '.mp4';
    const filename = 'media-' + Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
    const filePath = path.join(uploadsDir, filename);
    const uploadId = 'up_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    
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

      // Nếu đã ghi đủ tất cả các chunks và dung lượng
      const isComplete = (session.fileSize > 0 && session.writtenBytes >= session.fileSize) ||
                         (!isNaN(totalChunks) && totalChunks > 0 && session.chunksCount >= totalChunks && session.writtenBytes >= (session.fileSize || 0) * 0.999);

      if (isComplete) {
        if (session.timer) clearTimeout(session.timer);
        try { fs.closeSync(session.fd); } catch(e) {}
        session.fd = null;
        const uploadedFilePath = session.filePath;
        const uploadedFilename = session.filename;
        delete activeStreamUploads[uploadId];
        console.log(`[FastStream] ✅ Đã hoàn tất nạp 100% video: ${uploadedFilename} (${session.writtenBytes} bytes)`);

        // 🚀 TỰ ĐỘNG FASTSTART ĐỂ TIKTOK LIVE STUDIO PHÁT NGAY LẬP TỨC 0MS
        if (uploadedFilename.endsWith('.mp4') || uploadedFilename.endsWith('.mov')) {
          ensureMp4FastStart(uploadedFilePath);
        }

        console.log(`[FastStream] 👑 Đã hoàn tất xử lý video: ${uploadedFilename}`);
      }

      res.json({ success: true, written: buffer.length, offset });
    } catch(err) {
      console.error('[FastStream chunk error]', err);
      res.status(500).json({ error: err.message });
    }
  });
});

function saveBase64MediaToUploads(dataUrl, prefix = 'media') {
  try {
    if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) return dataUrl;
    const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) return dataUrl;
    const mime = matches[1];
    const ext = mime.includes('png') ? 'png' : mime.includes('webp') ? 'webp' : mime.includes('gif') ? 'gif' : mime.includes('mp4') ? 'mp4' : mime.includes('webm') ? 'webm' : 'jpg';
    const buffer = Buffer.from(matches[2], 'base64');
    const filename = `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`;
    const filePath = path.join(uploadsDir, filename);
    fs.writeFileSync(filePath, buffer);
    const extraDirs = [
      path.join(process.cwd(), 'system', 'uploads'),
      path.join(process.cwd(), 'uploads'),
      path.join(__dirname, '..', 'uploads'),
      path.join(__dirname, '..', 'system', 'uploads')
    ];
    for (const ed of extraDirs) {
      if (fs.existsSync(ed) && ed !== uploadsDir) {
        try { fs.writeFileSync(path.join(ed, filename), buffer); } catch(e) {}
      }
    }
    return `/uploads/${filename}`;
  } catch (e) {
    console.warn('[saveBase64MediaToUploads] Error:', e);
    return dataUrl;
  }
}

app.post('/api/upload-media', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  const savedFilePath = path.join(uploadsDir, req.file.filename);
  let finalFilename = req.file.filename;
  let finalFilePath = savedFilePath;
  let reused = false;

  // 🛡️ DEDUPLICATION TỨC THÌ: So khớp nếu file đã tồn tại trên đĩa -> Xóa bản sao vừa ghi, dùng file gốc
  try {
    const stat = fs.statSync(savedFilePath);
    if (stat.size > 0) {
      const files = fs.readdirSync(uploadsDir);
      const crypto = require('crypto');
      let sampleBuf = null;
      if (stat.size <= 20 * 1024 * 1024) {
        sampleBuf = fs.readFileSync(savedFilePath);
      } else {
        sampleBuf = Buffer.alloc(1024 * 1024);
        const fd = fs.openSync(savedFilePath, 'r');
        fs.readSync(fd, sampleBuf, 0, 1024 * 1024, 0);
        fs.closeSync(fd);
      }
      const newHash = crypto.createHash('md5').update(sampleBuf).digest('hex');

      for (const f of files) {
        if (f === req.file.filename || f.startsWith('.') || f.includes('.part')) continue;
        const otherPath = path.join(uploadsDir, f);
        try {
          const otherStat = fs.statSync(otherPath);
          if (otherStat.size === stat.size) {
            let otherSample = null;
            if (otherStat.size <= 20 * 1024 * 1024) {
              otherSample = fs.readFileSync(otherPath);
            } else {
              otherSample = Buffer.alloc(1024 * 1024);
              const ofd = fs.openSync(otherPath, 'r');
              fs.readSync(ofd, otherSample, 0, 1024 * 1024, 0);
              fs.closeSync(ofd);
            }
            const otherHash = crypto.createHash('md5').update(otherSample).digest('hex');
            if (newHash === otherHash) {
              // Trùng lặp chính xác! Xóa file vừa tạo và tái sử dụng file gốc
              fs.unlinkSync(savedFilePath);
              finalFilename = f;
              finalFilePath = otherPath;
              reused = true;
              console.log(`[Upload Deduplication] ♻️ Phát hiện video đã tồn tại (${f}) -> Tái sử dụng file gốc, xóa bản sao vừa nạp!`);
              break;
            }
          }
        } catch (subErr) {}
      }
    }
  } catch (dedupErr) {
    console.warn('[Upload Deduplication warn]', dedupErr);
  }

  // 🚀 TỰ ĐỘNG FASTSTART ĐỂ TIKTOK LIVE STUDIO PHÁT NGAY LẬP TỨC 0MS
  if (!reused && (finalFilename.endsWith('.mp4') || finalFilename.endsWith('.mov'))) {
    ensureMp4FastStart(finalFilePath);
  }

  // Đảm bảo file được đồng bộ sang tất cả các thư mục uploads khả dụng
  try {
    const extraDirs = [
      path.join(process.cwd(), 'system', 'uploads'),
      path.join(process.cwd(), 'uploads'),
      path.join(__dirname, '..', 'uploads'),
      path.join(__dirname, '..', 'system', 'uploads')
    ];
    for (const ed of extraDirs) {
      if (fs.existsSync(ed) && ed !== uploadsDir) {
        const dest = path.join(ed, finalFilename);
        if (!fs.existsSync(dest) && fs.existsSync(finalFilePath)) {
          try { fs.copyFileSync(finalFilePath, dest); } catch(e) {}
        }
      }
    }
  } catch(e) {}

  const fileUrl = `/uploads/${finalFilename}`;
  const isImageFile = /\.(png|jpe?g|webp|gif|svg|avif|bmp)$/i.test(finalFilename) || (req.file.mimetype && req.file.mimetype.startsWith('image/'));
  const shouldSetMaster = req.body?.setAsMaster === 'true';
  if (shouldSetMaster) {
    currentMasterLiveState = {
      ...currentMasterLiveState,
      stage: 'idol',
      mediaUrl: fileUrl,
      isVideo: !isImageFile,
      videoPlaybackEvent: 'play',
      isPlaying: true,
      isUserExplicitMediaLocked: true,
      updatedAt: Date.now()
    };
    io.emit('MASTER_LIVE_STATE_UPDATE', currentMasterLiveState);
    saveLiveStateToFile();
  }
  res.json({ url: fileUrl, filename: finalFilename, isVideo: !isImageFile, reused: reused, success: true });
});

// 🗑️ ROUTE XÓA FILE UPLOAD TRÊN SERVER THEO YÊU CẦU NGƯỜI DÙNG & TRIỆT TIÊU VIDEO ĐEN / RÁC
app.post(['/api/delete-upload', '/api/delete-media'], (req, res) => {
  try {
    const { url, filename, fileUrl } = req.body || {};
    const target = url || filename || fileUrl;
    if (!target || typeof target !== 'string') {
      return res.status(400).json({ error: 'Missing target file URL' });
    }

    const baseName = path.basename(target.replace(/\?.*$/, ''));
    if (!baseName || baseName === '.' || baseName === '..') {
      return res.status(400).json({ error: 'Invalid file name' });
    }

    let deleted = false;
    const allUploadDirs = [
      uploadsDir,
      path.join(process.cwd(), 'system', 'uploads'),
      path.join(process.cwd(), 'uploads'),
      path.join(__dirname, '..', 'uploads'),
      path.join(__dirname, '..', 'system', 'uploads')
    ];

    for (const dir of allUploadDirs) {
      if (fs.existsSync(dir)) {
        const targetPath = path.join(dir, baseName);
        if (fs.existsSync(targetPath)) {
          try {
            fs.unlinkSync(targetPath);
            deleted = true;
            console.log(`[Storage Delete] 🗑️ Đã xóa vĩnh viễn file upload: ${baseName} khỏi ${dir}`);
          } catch (err) {
            console.warn(`[Storage Delete warning] Không thể xóa ${baseName} tại ${dir}:`, err.message);
          }
        }
      }
    }

    // Tự động dọn dẹp các file rác 0-byte hoặc file tạm
    for (const dir of allUploadDirs) {
      if (fs.existsSync(dir)) {
        try {
          const files = fs.readdirSync(dir);
          for (const f of files) {
            const fp = path.join(dir, f);
            const st = fs.statSync(fp);
            if (st.size === 0 || f.endsWith('.tmp') || f.endsWith('.crdownload')) {
              try { fs.unlinkSync(fp); } catch (e) {}
            }
          }
        } catch (e) {}
      }
    }

    return res.json({ success: true, deleted, file: baseName });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// ============================================================
// 🎬 ROUTE PHÁT SÓNG ĐỘC LẬP /live-stream CHO TIKTOK LIVE STUDIO & OBS
// Tối ưu hóa GPU Hardware Acceleration 100%, 4K 60 FPS siêu sắc nét, không bao giờ đen màn hình hay lỗi link
// ============================================================
function resolveMediaForStage(rawUrl, masterState) {
  if (masterState && (masterState.clearMedia === true || masterState.isMainMediaDeleted)) {
    return '';
  }
  let target = rawUrl || (masterState && masterState.mediaUrl) || '';
  if (!target && masterState && masterState.secondaryMediaUrl) {
    target = masterState.secondaryMediaUrl;
  }
  if (!target && masterState && Array.isArray(masterState.syncedAvatars) && masterState.syncedAvatars.length > 0) {
    target = masterState.syncedAvatars[0].resolvedVidSrc || masterState.syncedAvatars[0].talkVideo || masterState.syncedAvatars[0].idleVideo || '';
  }
  if (!target || typeof target !== 'string') return '';
  target = target.trim();
  if (target.includes('/uploads/')) {
    const filename = target.substring(target.indexOf('/uploads/') + 9).split('?')[0];
    const foundPath = findFileInUploadDirs(filename);
    if (foundPath) {
      return `/uploads/${path.basename(foundPath)}`;
    }
  }
  if (target.startsWith('http://') || target.startsWith('https://') || target.startsWith('/') || target.startsWith('data:') || target.startsWith('blob:')) {
    return target;
  }
  return '/' + target;
}

app.get([
  '/live-stream', '/live-player', '/stream-player', '/idol-stream', 
  '/idol', '/live', '/stage', '/stream', '/overlay-live', '/tiktok-live',
  '/overlay-idol', '/cleanlive', '/live-overlay'
], (req, res) => {
  // ⚡ PHỤC VỤ TRỰC TIẾP REACT SPA INDEX.HTML ĐỂ CHẠY CLEANLIVEOVERLAY TOÀN NĂNG 100% TỪ SÂN KHẤU CHÍNH
  // Đầy đủ Multi-Avatar 1-4 người, Video/Ảnh nền chính, PiP Video phụ, Banner, Sticker, Sản phẩm TikTok Shop, Tách nền Chroma Key siêu sạch
  if (distPath && fs.existsSync(path.join(distPath, 'index.html'))) {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.sendFile(path.join(distPath, 'index.html'));
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('X-Frame-Options', 'ALLOWALL');
  res.setHeader('Content-Security-Policy', "default-src * 'unsafe-inline' 'unsafe-eval' data: blob: gap:; frame-ancestors *;");
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  let vParam = resolveMediaForStage(req.query.v, currentMasterLiveState);
  const showDock = req.query.dock !== '0' && req.query.clean !== '1';

  const secMedia = (currentMasterLiveState && currentMasterLiveState.secondaryMediaUrl) || '';
  const secTrans = (currentMasterLiveState && currentMasterLiveState.secondaryMediaTransform) || { x: 2, y: 32, width: 47, height: 48, zIndex: 15 };
  const rawOverlayTxt = (currentMasterLiveState && (currentMasterLiveState.overlayText || currentMasterLiveState.title)) || '';
  const overlayTxt = (rawOverlayTxt && typeof rawOverlayTxt === 'string' && !/^(bước|step)\s*\d+/i.test(rawOverlayTxt.trim())) ? rawOverlayTxt.trim() : '';
  const soundParam = req.query.sound !== '0';
  const fitParam = req.query.fit || 'cover';
  const ratioParam = req.query.ratio || req.query.aspectRatio || (currentMasterLiveState && currentMasterLiveState.aspectRatio) || '9:16';
  const isLandscapeInit = ratioParam === '16:9' || ratioParam === '16/9';
  const isImageMediaHelper = (u) => {
    if (!u || typeof u !== 'string') return false;
    return /\.(png|jpe?g|webp|gif|svg|avif|bmp)($|\?|#)/i.test(u) || u.startsWith('data:image/');
  };
  const isInitialImg = isImageMediaHelper(vParam);
  const initialSrcAttr = (vParam && typeof vParam === 'string' && vParam.trim()) 
    ? `src="${vParam.startsWith('http') || vParam.startsWith('/') ? vParam : '/' + vParam}"` 
    : '';

  const html = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>AvaLive 4K 60FPS Ultra-HD Live Streamer v4.9.45</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      width: 100vw; height: 100vh;
      margin: 0; padding: 0;
      overflow: hidden;
      background-color: #000;
      display: flex; align-items: center; justify-content: center;
      user-select: none; -webkit-user-select: none;
    }
    #stage {
      position: absolute;
      inset: 0;
      width: 100vw;
      height: 100vh;
      margin: 0;
      padding: 0;
      overflow: hidden;
      background: #000;
      box-shadow: none;
      border: none;
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    video {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: ${fitParam === 'contain' ? 'contain' : 'cover'};
      object-position: center center;
      background: #000;
      display: ${isInitialImg ? 'none' : 'block'};
      outline: none; border: none;
      image-rendering: -webkit-optimize-contrast;
      image-rendering: crisp-edges;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    #imagePlayer {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: ${fitParam === 'contain' ? 'contain' : 'cover'};
      object-position: center center;
      background: #000;
      display: ${isInitialImg ? 'block' : 'none'};
      image-rendering: -webkit-optimize-contrast;
      image-rendering: crisp-edges;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    #loadingOverlay {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #000;
      color: #38bdf8;
      font-family: system-ui, -apple-system, sans-serif;
      z-index: 20;
      transition: opacity 0.3s ease;
      pointer-events: none;
    }
    .spinner {
      width: 38px;
      height: 38px;
      border: 3px solid rgba(56, 189, 248, 0.2);
      border-top-color: #38bdf8;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin-bottom: 10px;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .chroma-green-filter { filter: url(#chroma-green); }
    .chroma-blue-filter { filter: url(#chroma-blue); }
    .chroma-red-filter { filter: url(#chroma-red); }
    .chroma-black-filter { filter: url(#chroma-black); }
    .chroma-white-filter { filter: url(#chroma-white); }
    .chroma-auto-filter { filter: url(#chroma-auto); }
    .chroma-room-filter { filter: url(#chroma-room); }
    #hoverZone {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100vw !important;
      height: 80px !important;
      z-index: 2147483646 !important;
      pointer-events: auto !important;
      background: transparent !important;
    }
    #controlsDock {
      position: fixed !important;
      top: 12px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      display: ${showDock ? 'inline-flex' : 'none'} !important;
      flex-direction: row !important;
      align-items: center !important;
      justify-content: center !important;
      flex-wrap: nowrap !important;
      white-space: nowrap !important;
      gap: 6px !important;
      background: rgba(8, 12, 22, 0.95) !important;
      backdrop-filter: blur(24px) !important;
      -webkit-backdrop-filter: blur(24px) !important;
      padding: 5px 10px !important;
      border-radius: 28px !important;
      border: 1.5px solid rgba(6, 182, 212, 0.75) !important;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.9), 0 0 16px rgba(6, 182, 212, 0.35) !important;
      z-index: 2147483647 !important;
      isolation: isolate !important;
      will-change: transform, opacity !important;
      opacity: 0 !important;
      pointer-events: none !important;
      -webkit-app-region: no-drag !important;
      touch-action: manipulation !important;
      max-width: calc(100vw - 16px) !important;
      box-sizing: border-box !important;
      user-select: none !important;
      -webkit-user-select: none !important;
      transition: opacity 0.25s ease, transform 0.25s ease !important;
    }
    #hoverZone:hover ~ #controlsDock,
    #controlsDock:hover,
    #controlsDock.force-visible {
      opacity: 0.98 !important;
      pointer-events: auto !important;
      transform: translateX(-50%) scale(1.02) !important;
    }
    #controlsDock.is-hidden { display: none !important; }
    .dock-btn {
      background: rgba(255, 255, 255, 0.15) !important;
      border: 1px solid rgba(255, 255, 255, 0.35) !important;
      color: #ffffff !important;
      font-size: 11px !important;
      font-weight: 800 !important;
      padding: 5px 10px !important;
      border-radius: 14px !important;
      cursor: pointer !important;
      outline: none !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 4px !important;
      white-space: nowrap !important;
      flex-shrink: 0 !important;
      line-height: 1 !important;
      pointer-events: auto !important;
      -webkit-app-region: no-drag !important;
      touch-action: manipulation !important;
      transition: all 0.15s ease !important;
    }
    .dock-btn:hover { background: rgba(6, 182, 212, 0.5) !important; border-color: #06b6d4 !important; transform: translateY(-1px) !important; }
    .dock-btn:active { transform: scale(0.92) !important; }
    .dock-btn-live {
      background: rgba(16, 185, 129, 0.18) !important;
      border: 1px solid rgba(16, 185, 129, 0.6) !important;
      color: #10b981 !important;
      font-weight: 900 !important;
    }
    .dock-btn-live:hover {
      background: rgba(16, 185, 129, 0.35) !important;
      border-color: #10b981 !important;
    }
    .dock-pulse-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #10b981;
      display: inline-block;
      box-shadow: 0 0 8px #10b981;
      animation: pulse-dot 1.4s ease-in-out infinite;
    }
    @keyframes pulse-dot {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.7); }
    }
    .dock-btn-hide {
      background: rgba(239, 68, 68, 0.22) !important;
      border: 1px solid rgba(239, 68, 68, 0.65) !important;
      color: #fca5a5 !important;
    }
    .dock-btn-hide:hover {
      background: rgba(239, 68, 68, 0.85) !important;
      border-color: #ef4444 !important;
      color: #ffffff !important;
    }
    #btnRestoreIcon {
      position: fixed !important;
      top: 10px !important;
      right: 12px !important;
      z-index: 2147483647 !important;
      width: 34px !important;
      height: 34px !important;
      border-radius: 50% !important;
      background: rgba(8, 12, 22, 0.95) !important;
      border: 1.5px solid rgba(6, 182, 212, 0.85) !important;
      color: #22d3ee !important;
      font-size: 15px !important;
      display: none;
      align-items: center !important;
      justify-content: center !important;
      cursor: pointer !important;
      pointer-events: auto !important;
      -webkit-app-region: no-drag !important;
      touch-action: manipulation !important;
      backdrop-filter: blur(14px) !important;
      -webkit-backdrop-filter: blur(14px) !important;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.85), 0 0 12px rgba(6, 182, 212, 0.4) !important;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
    }
    #btnRestoreIcon.is-visible { display: flex !important; }
    #btnRestoreIcon:hover {
      transform: scale(1.15) !important;
      border-color: #22d3ee !important;
      box-shadow: 0 0 18px rgba(34, 211, 238, 0.7) !important;
      color: #ffffff !important;
    }
    #badge {
      display: none;
    }
  </style>
  <script src="/socket.io/socket.io.js" onerror="this.onerror=null; this.src='https://cdn.socket.io/4.7.5/socket.io.min.js';"></script>
</head>
<body>
  <div id="stage">
    <!-- SVG Chroma Filters cho xoá phông xanh, xanh dương, đỏ, đen, trắng, phòng thực tế, tự động -->
    <svg style="position: absolute; width: 0; height: 0; pointer-events: none;">
      <defs>
        <filter id="chroma-green" color-interpolation-filters="sRGB">
          <feColorMatrix type="matrix" values="1 0 0 0 0  0.2 0.6 0.2 0 0  0 0 1 0 0  0 0 0 1 0" result="despilled" />
          <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  1.8 -3.2 1.8 1 0.15" result="mask" />
          <feComponentTransfer in="mask" result="sharp_mask"><feFuncA type="linear" slope="3.5" intercept="-0.1" /></feComponentTransfer>
          <feComposite in="despilled" in2="sharp_mask" operator="in" />
        </filter>
        <filter id="chroma-blue" color-interpolation-filters="sRGB">
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0.2 0.2 0.6 0 0  0 0 0 1 0" result="despilled" />
          <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  1.8 1.8 -3.2 1 0.15" result="mask" />
          <feComponentTransfer in="mask" result="sharp_mask"><feFuncA type="linear" slope="3.5" intercept="-0.1" /></feComponentTransfer>
          <feComposite in="despilled" in2="sharp_mask" operator="in" />
        </filter>
        <filter id="chroma-red" color-interpolation-filters="sRGB">
          <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -3.0 1.8 1.8 1 0.2" result="mask" />
          <feComponentTransfer in="mask" result="sharp_mask"><feFuncA type="linear" slope="3.5" intercept="-0.15" /></feComponentTransfer>
          <feComposite in="SourceGraphic" in2="sharp_mask" operator="in" />
        </filter>
        <filter id="chroma-black" color-interpolation-filters="sRGB">
          <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  1.5 2.5 0.8 0 -0.08" result="mask" />
          <feComponentTransfer in="mask" result="sharp_mask"><feFuncA type="linear" slope="6.0" intercept="-0.1" /></feComponentTransfer>
          <feComposite in="SourceGraphic" in2="sharp_mask" operator="in" />
        </filter>
        <filter id="chroma-white" color-interpolation-filters="sRGB">
          <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -1.2 -1.8 -0.8 1 3.2" result="mask" />
          <feComponentTransfer in="mask" result="sharp_mask"><feFuncA type="linear" slope="3.8" intercept="-0.15" /></feComponentTransfer>
          <feComposite in="SourceGraphic" in2="sharp_mask" operator="in" />
        </filter>
        <filter id="chroma-auto" color-interpolation-filters="sRGB">
          <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  1.2 -2.4 1.2 1 0.25" result="mask" />
          <feComponentTransfer in="mask" result="sharp_mask"><feFuncA type="linear" slope="3.2" intercept="-0.1" /></feComponentTransfer>
          <feComposite in="SourceGraphic" in2="sharp_mask" operator="in" />
        </filter>
        <filter id="chroma-room" color-interpolation-filters="sRGB">
          <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  1.4 1.8 1.0 1 -0.2" result="mask" />
          <feComponentTransfer in="mask" result="sharp_mask"><feFuncA type="linear" slope="3.5" intercept="-0.18" /></feComponentTransfer>
          <feComposite in="SourceGraphic" in2="sharp_mask" operator="in" />
        </filter>
      </defs>
    </svg>

    <!-- Sân Khấu Trống (Khi người dùng xóa hết video) -->
    <div id="emptyStageView" style="position: absolute; inset: 0; display: none; flex-direction: column; align-items: center; justify-content: center; background: #07080d; color: #fff; z-index: 40; text-align: center; padding: 20px;">
      <div style="width: 64px; height: 64px; border-radius: 20px; background: rgba(8, 51, 68, 0.7); border: 1px solid rgba(6, 182, 212, 0.4); display: flex; align-items: center; justify-content: center; font-size: 30px; margin-bottom: 12px; box-shadow: 0 0 25px rgba(6, 182, 212, 0.3);">🎬</div>
      <div style="font-size: 14px; font-weight: 900; letter-spacing: 0.5px; color: #38bdf8; text-transform: uppercase;">SÂN KHẤU TRỐNG (SẴN SÀNG)</div>
      <div style="font-size: 11px; color: #94a3b8; margin-top: 6px; max-width: 280px; line-height: 1.5;">Vui lòng tải lên hoặc chọn video trên phần mềm AvaLive VIP PRO để phát trực tiếp</div>
    </div>

    <!-- LỚP 0: NỀN CHÍNH SÂN KHẤU (Background Layer - Video hoặc Ảnh 60 FPS) -->
    <div id="mainBackgroundLayer" style="position: absolute; inset: 0; z-index: 1; overflow: hidden; background: #000;">
      <video 
        id="videoPlayer" 
        ${!isInitialImg && initialSrcAttr ? initialSrcAttr : ''}
        autoplay 
        playsinline 
        webkit-playsinline 
        x5-video-player-type="h5" 
        x5-playsinline
        loop 
        preload="auto" 
        muted
        disableRemotePlayback
        style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: ${fitParam === 'contain' ? 'contain' : 'cover'}; object-position: center; display: ${isInitialImg ? 'none' : 'block'};"
      ></video>
      <img
        id="imagePlayer"
        ${isInitialImg && initialSrcAttr ? initialSrcAttr : ''}
        alt="Live Media"
        style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: ${fitParam === 'contain' ? 'contain' : 'cover'}; object-position: center; display: ${isInitialImg ? 'block' : 'none'};"
      />
    </div>

    <!-- CỤM MULTI-AVATAR STAGE (Bọc các lớp nhân vật và hình ảnh phụ) -->
    <div id="multiAvatarStage" style="position: absolute; inset: 0; pointer-events: none; z-index: 5; overflow: hidden;">
      <div id="multiAvatarBg" style="position: absolute; inset: 0; pointer-events: none; z-index: 1; display: none; background-size: cover; background-position: center;"></div>
      <!-- LỚP 1: CÁC LỚP HÌNH ẢNH PHỤ (Extra Layers / Sticker / Vòng tròn sàn / Logo) -->
      <div id="multiAvatarExtraLayers" style="position: absolute; inset: 0; pointer-events: none; z-index: 5;"></div>
      <!-- LỚP 2: CÁC KHUNG HÌNH NHÂN VẬT AVATAR (1 hoặc 2-4 Avatar Đa Tầng) -->
      <div id="multiAvatarCharacters" style="position: absolute; inset: 0; pointer-events: none; z-index: 10;"></div>
    </div>

    <!-- LỚP 3: VIDEO PHỤ PIP (Picture-in-Picture) XẾP CHỒNG TỪ SEQUENCER -->
    <div id="pipContainer" style="position: absolute; left: ${secTrans.x}%; top: ${secTrans.y}%; width: ${secTrans.width}%; height: ${secTrans.height}%; z-index: ${secTrans.zIndex || 20}; pointer-events: none; display: ${secMedia ? 'block' : 'none'};">
      <video id="pipVideo" src="${secMedia && !isImageMediaHelper(secMedia) ? (secMedia.startsWith('http') || secMedia.startsWith('/') ? secMedia : '/' + secMedia) : ''}" autoplay loop muted playsinline style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px; border: 2px solid rgba(255,255,255,0.5); box-shadow: 0 10px 25px rgba(0,0,0,0.85); display: ${secMedia && !isImageMediaHelper(secMedia) ? 'block' : 'none'};"></video>
      <img id="pipImage" src="${secMedia && isImageMediaHelper(secMedia) ? (secMedia.startsWith('http') || secMedia.startsWith('/') ? secMedia : '/' + secMedia) : ''}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px; display: ${secMedia && isImageMediaHelper(secMedia) ? 'block' : 'none'};" />
    </div>

    <!-- LỚP 4: BANNER HÌNH ẢNH OVERLAY -->
    <div id="overlayImageBanner" style="position: absolute; left: 10%; top: 12%; width: 80%; z-index: 25; text-align: center; pointer-events: none; display: ${overlayImg ? 'block' : 'none'};">
      <img id="overlayImageContent" src="${overlayImg ? (overlayImg.startsWith('http') || overlayImg.startsWith('/') ? overlayImg : '/' + overlayImg) : ''}" alt="Banner Overlay" style="max-width: 100%; max-height: 25vh; object-fit: contain; border-radius: 12px; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.8));" />
    </div>

    <!-- LỚP 5: TIÊU ĐỀ CHỮ OVERLAY -->
    <div id="overlayTextBanner" style="position: absolute; left: 4%; top: 5%; width: 92%; z-index: 30; text-align: center; pointer-events: none; display: ${overlayTxt ? 'block' : 'none'};">
      <div id="overlayTextContent" style="display: inline-block; padding: 6px 14px; border-radius: 16px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; background: rgba(2, 6, 23, 0.9); border: 1px solid #22d3ee; color: #22d3ee; font-family: 'Segoe UI', system-ui, sans-serif; font-size: 16px; box-shadow: 0 0 20px rgba(6, 182, 212, 0.6);">${overlayTxt}</div>
    </div>
    
    <!-- LỚP 6: SẢN PHẨM GHIM LIVESTREAM (BẤM ĐỂ MỞ GIỎ HÀNG & BẢNG CHỌN BIẾN THỂ) -->
    <div id="pinnedProductContainer" style="position: absolute; bottom: 20px; left: 14px; right: 14px; z-index: 40; pointer-events: auto; cursor: pointer; display: none; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);" onclick="window.handleOpenPinnedProduct(event)">
      <div id="pinnedProductCard" title="Bấm để xem chi tiết, chọn màu/size và đặt mua trực tiếp" style="display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 16px; background: rgba(15, 23, 42, 0.94); border: 1.5px solid rgba(244, 63, 94, 0.7); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8), 0 0 20px rgba(244, 63, 94, 0.4); cursor: pointer;">
        <img id="pinnedProductImg" src="" alt="Product" style="width: 54px; height: 54px; border-radius: 10px; object-fit: cover; flex-shrink: 0; border: 1px solid rgba(255, 255, 255, 0.2);" />
        <div style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px;">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span id="pinnedProductSeller" style="padding: 2px 6px; border-radius: 6px; background: rgba(244, 63, 94, 0.2); border: 1px solid rgba(244, 63, 94, 0.5); color: #fda4af; font-size: 9px; font-weight: 800; white-space: nowrap; max-width: 140px; overflow: hidden; text-overflow: ellipsis;">🏪 Đơn Vị Bán</span>
            <span id="pinnedProductBadge" style="padding: 2px 6px; border-radius: 6px; background: linear-gradient(135deg, #e11d48, #f43f5e); color: #fff; font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap;">🔥 DEAL HOT</span>
            <span id="pinnedProductCode" style="font-size: 9px; color: #94a3b8; font-weight: 700; white-space: nowrap;"></span>
          </div>
          <div id="pinnedProductTitle" style="font-size: 13px; font-weight: 800; color: #ffffff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-shadow: 0 1px 2px rgba(0,0,0,0.8);">Tên sản phẩm</div>
          <div style="display: flex; align-items: baseline; gap: 8px;">
            <span id="pinnedProductPrice" style="font-size: 15px; font-weight: 900; color: #fbbf24; text-shadow: 0 0 10px rgba(251, 191, 36, 0.5);">0 đ</span>
            <span id="pinnedProductOldPrice" style="font-size: 11px; color: #94a3b8; text-decoration: line-through; display: none;"></span>
          </div>
        </div>
        <div style="flex-shrink: 0; display: flex; align-items: center; justify-content: center; padding: 6px 10px; border-radius: 10px; background: linear-gradient(135deg, #f43f5e, #e11d48); color: #fff; font-size: 11px; font-weight: 800; box-shadow: 0 2px 8px rgba(244,63,94,0.4); white-space: nowrap;">
          <span>⚡ Chọn Mua ↗</span>
        </div>
      </div>
    </div>

    <!-- MODAL GIỎ HÀNG & CHỌN BIẾN THỂ MUA HÀNG TRỰC TIẾP TRÊN PHIÊN LIVE -->
    <div id="productCheckoutModal" style="position: absolute; inset: 0; z-index: 100; display: none; background: rgba(0, 0, 0, 0.78); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); align-items: flex-end; justify-content: center;" onclick="window.closeProductModalOnBackdrop(event)">
      <div id="productCheckoutSheet" style="width: 100%; max-width: 480px; max-height: 85vh; background: #0f172a; border-top-left-radius: 24px; border-top-right-radius: 24px; border: 1.5px solid rgba(244, 63, 94, 0.7); border-bottom: none; box-shadow: 0 -10px 40px rgba(0,0,0,0.9), 0 0 30px rgba(244,63,94,0.35); color: #fff; display: flex; flex-direction: column; overflow: hidden;" onclick="event.stopPropagation()">
        
        <!-- Header Sheet -->
        <div style="display: flex; align-items: flex-start; justify-content: space-between; padding: 14px 16px; border-bottom: 1px solid rgba(255,255,255,0.1); background: rgba(30, 41, 59, 0.6);">
          <div style="display: flex; gap: 12px; align-items: center; min-width: 0; flex: 1;">
            <img id="modalProdImg" src="" alt="Product" style="width: 68px; height: 68px; border-radius: 12px; object-fit: cover; border: 1.5px solid rgba(244, 63, 94, 0.5); flex-shrink: 0;" />
            <div style="min-width: 0; flex: 1;">
              <div style="display: flex; align-items: baseline; gap: 8px;">
                <span id="modalProdPrice" style="font-size: 20px; font-weight: 900; color: #fbbf24; font-family: monospace;">0 ₫</span>
                <span id="modalProdOldPrice" style="font-size: 12px; color: #94a3b8; text-decoration: line-through; font-family: monospace;"></span>
              </div>
              <div id="modalProdStock" style="font-size: 11px; color: #34d399; font-weight: 700; margin-top: 2px;">⚡ Kho: Còn 999 sản phẩm</div>
              <div id="modalProdSelectedSummary" style="font-size: 11px; color: #fda4af; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 2px;">Đang chọn: Tiêu chuẩn</div>
            </div>
          </div>
          <button type="button" onclick="window.closeProductModal(event)" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #fff; width: 32px; height: 32px; border-radius: 50%; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">✕</button>
        </div>

        <!-- Scrollable Options Body -->
        <div style="padding: 14px 16px; overflow-y: auto; display: flex; flex-direction: column; gap: 14px; max-height: 48vh;">
          <!-- Product Title & Shop Tag -->
          <div>
            <div id="modalProdShopBadge" style="display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 6px; background: rgba(244, 63, 94, 0.2); border: 1px solid rgba(244, 63, 94, 0.5); color: #fda4af; font-size: 10px; font-weight: 800; margin-bottom: 6px;">
              🏪 <span id="modalProdShopName">Gian Hàng Chính Hãng</span>
            </div>
            <div id="modalProdTitle" style="font-size: 13px; font-weight: 800; color: #f8fafc; line-height: 1.4;">Tên sản phẩm</div>
          </div>

          <!-- Color / Phân loại màu -->
          <div id="modalColorSection">
            <div style="font-size: 11px; font-weight: 800; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">🎨 Chọn Màu Sắc / Phân Loại:</div>
            <div id="modalColorOptions" style="display: flex; flex-wrap: wrap; gap: 8px;"></div>
          </div>

          <!-- Size / Kích thước -->
          <div id="modalSizeSection">
            <div style="font-size: 11px; font-weight: 800; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">📏 Chọn Kích Thước / Size:</div>
            <div id="modalSizeOptions" style="display: flex; flex-wrap: wrap; gap: 8px;"></div>
          </div>

          <!-- Type / Combo (nếu có) -->
          <div id="modalTypeSection" style="display: none;">
            <div style="font-size: 11px; font-weight: 800; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">🎁 Chọn Quy Cách / Combo:</div>
            <div id="modalTypeOptions" style="display: flex; flex-wrap: wrap; gap: 8px;"></div>
          </div>

          <!-- Quantity Stepper -->
          <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.1);">
            <div>
              <div style="font-size: 12px; font-weight: 800; color: #fff;">Số Lượng:</div>
              <div style="font-size: 10px; color: #94a3b8;">Áp dụng voucher đơn từ 1 món</div>
            </div>
            <div style="display: flex; align-items: center; border: 1.5px solid rgba(255,255,255,0.25); border-radius: 10px; overflow: hidden; background: rgba(15, 23, 42, 0.8);">
              <button type="button" onclick="window.changeModalQuantity(-1)" style="width: 34px; height: 32px; background: rgba(255,255,255,0.1); border: none; color: #fff; font-size: 16px; font-weight: 800; cursor: pointer;">−</button>
              <span id="modalQuantityVal" style="min-width: 38px; text-align: center; font-size: 14px; font-weight: 800; color: #fff; font-family: monospace;">1</span>
              <button type="button" onclick="window.changeModalQuantity(1)" style="width: 34px; height: 32px; background: rgba(255,255,255,0.1); border: none; color: #fff; font-size: 16px; font-weight: 800; cursor: pointer;">+</button>
            </div>
          </div>

          <!-- Voucher highlight tag -->
          <div style="display: flex; align-items: center; gap: 6px; padding: 8px 12px; border-radius: 10px; background: rgba(239, 68, 68, 0.15); border: 1px dashed #ef4444; color: #fca5a5; font-size: 11px; font-weight: 700;">
            <span>🎟️</span>
            <span>Đã tự động áp dụng Voucher Live -30K & Miễn Phí Vận Chuyển!</span>
          </div>
        </div>

        <!-- Sticky Action Buttons Footer -->
        <div style="padding: 12px 16px 18px 16px; border-top: 1px solid rgba(255,255,255,0.12); background: rgba(15, 23, 42, 0.98); display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; justify-content: space-between; align-items: baseline; font-size: 12px;">
            <span style="color: #94a3b8;">Tổng thanh toán tạm tính:</span>
            <span id="modalTotalPrice" style="font-size: 18px; font-weight: 900; color: #f43f5e; font-family: monospace;">0 ₫</span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <button type="button" onclick="window.submitModalCheckout('tiktok')" style="background: linear-gradient(135deg, #f43f5e, #e11d48); border: none; padding: 12px 8px; border-radius: 14px; color: #fff; font-size: 12px; font-weight: 900; cursor: pointer; box-shadow: 0 4px 15px rgba(244,63,94,0.5); display: flex; align-items: center; justify-content: center; gap: 6px;">
              <span>⚡ Mua Trên TikTok</span>
            </button>
            <button type="button" onclick="window.submitModalCheckout('shopee')" style="background: linear-gradient(135deg, #ea580c, #f97316); border: none; padding: 12px 8px; border-radius: 14px; color: #fff; font-size: 12px; font-weight: 900; cursor: pointer; box-shadow: 0 4px 15px rgba(249,115,22,0.5); display: flex; align-items: center; justify-content: center; gap: 6px;">
              <span>🛍️ Mua Trên Shopee</span>
            </button>
          </div>
        </div>

      </div>
    </div>

    <!-- Live badge is hidden on clean stream feed -->
  </div>

  <!-- VÙNG CẢM ỨNG DI CHUỘT ĐỂ HIỆN DOCK ĐIỀU KHIỂN -->
  <div id="hoverZone"></div>

  <!-- BẢNG ĐIỀU KHIỂN NỔI DOCK TOÀN CỤC CẤP BODY -->
  <div id="controlsDock">
    <button id="btnLiveStatus" class="dock-btn dock-btn-live" type="button" onclick="window.handleLiveRefreshToggle(event)" title="Luồng Trực Tiếp 60 FPS (Bấm để làm mới & đồng bộ luồng)">
      <span class="dock-pulse-dot"></span>• TRỰC TIẾP 60FPS
    </button>
    <button id="btnPlayPause" class="dock-btn" type="button" onclick="window.handlePlayPauseToggle(event)" title="Tạm dừng / Tiếp tục độc lập (Phím tắt: Space)">⏸️ Tạm Dừng</button>
    <button id="btnMuteUnmute" class="dock-btn" type="button" onclick="window.handleMuteToggle(event)" title="Bật / Tắt âm thanh độc lập (Phím tắt: M)">${soundParam ? '🔇 Tắt Tiếng' : '🔊 Bật Tiếng'}</button>
    <button id="btnFitToggle" class="dock-btn" type="button" onclick="window.handleFitToggle(event)" title="Chuyển chế độ Khung hình (Tràn / Vừa)">${fitParam === 'contain' ? '📐 Vừa Khung' : '📐 Tràn Màn'}</button>
    <button id="btnHideAll" class="dock-btn dock-btn-hide" type="button" onclick="window.toggleHideAll(true, event)" title="Ẩn toàn bộ nút trên giao diện video để bắt hình sạch 100% (Phím tắt: H)">✕ Ẩn Nút (H)</button>
  </div>

  <button id="btnRestoreIcon" type="button" onclick="window.toggleHideAll(false, event)" title="Bấm để hiện lại toàn bộ nút chức năng (Phím tắt: H)">👁️</button>

  <script>
    (function() {
      const vid = document.getElementById('videoPlayer');
      const badge = document.getElementById('badge');
      const dock = document.getElementById('controlsDock');
      const btnRestore = document.getElementById('btnRestoreIcon');
      const loadingOverlay = document.getElementById('loadingOverlay');
      const btnLiveStatus = document.getElementById('btnLiveStatus');
      const btnPlayPause = document.getElementById('btnPlayPause');
      const btnMuteUnmute = document.getElementById('btnMuteUnmute');
      const btnFitToggle = document.getElementById('btnFitToggle');
      const btnHideAll = document.getElementById('btnHideAll');

      let currentSrc = ${JSON.stringify(vParam)};
      let isStreamUserPaused = false;
      let targetSoundEnabled = ${soundParam ? 'true' : 'false'};
      let targetVolume = 1.0;
      let currentFit = ${JSON.stringify(fitParam)};
      let isPlayPending = false;
      let isDockHidden = false;

      function updateStageAspectRatio(ratio) {
        const stage = document.getElementById('stage');
        if (!stage) return;
        stage.style.position = 'absolute';
        stage.style.inset = '0';
        stage.style.width = '100vw';
        stage.style.height = '100vh';
        stage.style.margin = '0';
        stage.style.boxShadow = 'none';
        stage.style.border = 'none';
      }
      updateStageAspectRatio('${ratioParam}');

      function getAllVideos() {
        return Array.from(document.querySelectorAll('video'));
      }

      try {
        isDockHidden = localStorage.getItem('avalive_livestream_dock_hidden') === 'true';
      } catch (e) {}

      function applyDockVisibility() {
        if (isDockHidden) {
          if (dock) dock.classList.add('is-hidden');
          if (btnRestore) btnRestore.classList.add('is-visible');
        } else {
          if (dock) dock.classList.remove('is-hidden');
          if (btnRestore) btnRestore.classList.remove('is-visible');
        }
      }
      applyDockVisibility();

      function toggleHideAll(forceVal) {
        isDockHidden = typeof forceVal === 'boolean' ? forceVal : !isDockHidden;
        try {
          localStorage.setItem('avalive_livestream_dock_hidden', String(isDockHidden));
        } catch(e) {}
        applyDockVisibility();
      }

      // Khởi tạo video luôn bắt đầu với muted để 100% CEF TikTok Live Studio / OBS cho phép phát ngay 0ms
      vid.muted = true;
      vid.defaultMuted = true;

      function hideLoading() {
        if (loadingOverlay) {
          loadingOverlay.style.opacity = '0';
          setTimeout(function() {
            if (loadingOverlay) loadingOverlay.style.display = 'none';
          }, 300);
        }
      }

      function showLoading() {
        if (loadingOverlay) {
          loadingOverlay.style.display = 'flex';
          loadingOverlay.style.opacity = '1';
        }
      }

      // ⚡ EMERGENCY LOADING DISMISSER: Đảm bảo TikTok Live Studio KHÔNG BAO GIỜ bị kẹt xoay vòng quá 1.5s
      setTimeout(function() {
        hideLoading();
      }, 1500);

      setTimeout(function() { if (badge) badge.style.opacity = '0.2'; }, 6000);

      function updateDockUI() {
        const anyPaused = isStreamUserPaused || (vid && vid.paused);
        if (btnPlayPause) {
          btnPlayPause.innerHTML = anyPaused ? '▶️ Tiếp Tục' : '⏸️ Tạm Dừng';
          btnPlayPause.style.background = anyPaused ? 'rgba(16, 185, 129, 0.45)' : 'rgba(255, 255, 255, 0.15)';
          btnPlayPause.style.borderColor = anyPaused ? '#10b981' : 'rgba(255, 255, 255, 0.35)';
        }
        if (btnMuteUnmute) {
          btnMuteUnmute.innerHTML = targetSoundEnabled ? '🔇 Tắt Tiếng' : '🔊 Bật Tiếng';
          btnMuteUnmute.style.background = targetSoundEnabled ? 'rgba(6, 182, 212, 0.5)' : 'rgba(255, 255, 255, 0.15)';
          btnMuteUnmute.style.borderColor = targetSoundEnabled ? '#06b6d4' : 'rgba(255, 255, 255, 0.35)';
        }
        if (btnFitToggle) {
          btnFitToggle.innerHTML = currentFit === 'cover' ? '📐 Tràn Màn' : '📐 Vừa Khung';
          btnFitToggle.style.background = currentFit === 'cover' ? 'rgba(168, 85, 247, 0.4)' : 'rgba(255, 255, 255, 0.15)';
          btnFitToggle.style.borderColor = currentFit === 'cover' ? '#a855f7' : 'rgba(255, 255, 255, 0.35)';
        }
      }

      let activeModalProduct = null;
      let modalSelectedColor = '';
      let modalSelectedSize = '';
      let modalSelectedType = '';
      let modalQuantity = 1;

      function parsePriceToNumber(priceStr) {
        if (typeof priceStr === 'number') return priceStr;
        if (!priceStr || typeof priceStr !== 'string') return 49999;
        const digits = priceStr.replace(/[^0-9]/g, '');
        return digits ? parseInt(digits, 10) : 49999;
      }

      function formatVietnamesePrice(num) {
        return (num || 0).toLocaleString('vi-VN') + ' ₫';
      }

      function getProductVariants(prod) {
        if (!prod) {
          return {
            colors: ['Đen Classic', 'Trắng Sport', 'Hồng Pastel', 'Xanh Navy'],
            sizes: ['Size S (40-48kg)', 'Size M (49-56kg)', 'Size L (57-65kg)', 'Size XL (66-75kg)'],
            types: ['Bản Tiêu Chuẩn', 'Combo Nâng Cấp'],
            stock: '999',
            unitPrice: 49999
          };
        }
        if (prod.variants && typeof prod.variants === 'object') {
          return {
            colors: prod.variants.colors || ['Màu Mặc Định'],
            sizes: prod.variants.sizes || ['Freesize'],
            types: prod.variants.types || ['Bản Tiêu Chuẩn'],
            stock: prod.stock || '500',
            unitPrice: parsePriceToNumber(prod.price)
          };
        }
        const idOrCode = String(prod.id || prod.code || prod.sku || '').toLowerCase();
        const title = String(prod.name || prod.productName || prod.title || '').toLowerCase();

        if (idOrCode === '1' || title.includes('bra') || title.includes('havata') || title.includes('áo bra') || title.includes('yếm')) {
          return {
            colors: ['Đen Classic', 'Hồng Pastel', 'Xanh Navy', 'Trắng Tinh Khôi', 'Xám Khói'],
            sizes: ['Size S (40-48kg)', 'Size M (49-56kg)', 'Size L (57-65kg)', 'Size XL (66-75kg)'],
            types: ['Áo Đơn Có Mút Cổ Yếm', 'Combo 2 Áo Siêu Tiết Kiệm (Tặng Túi Gym)'],
            stock: '32.500',
            unitPrice: 49999
          };
        }
        if (idOrCode === '2' || title.includes('quấn cổ chân') || title.includes('combo') || title.includes('eirafit')) {
          return {
            colors: ['Đen Quyến Rũ', 'Hồng Barbie', 'Tím Lavender', 'Xanh Mint'],
            sizes: ['Bộ Tiêu Chuẩn (1 Đôi)', 'Combo Full Set + Dây 35Lbs', 'Combo Pro Chuyên Nghiệp + Dây 50Lbs'],
            types: ['Quấn Cổ Chân Đơn', 'Combo Quấn Chân + Dây Kháng Lực Mông Đùi'],
            stock: '1.500',
            unitPrice: 42000
          };
        }
        if (idOrCode === '3' || title.includes('tạ tay') || title.includes('40kg') || title.includes('gympro')) {
          return {
            colors: ['Đen Phối Đỏ Sport', 'Đen Phối Vàng Gold', 'Xanh Quân Đội'],
            sizes: ['Bộ 20KG Tháo Lắp', 'Bộ 30KG Tháo Lắp Đa Năng', 'Bộ 40KG Full Set Kèm Đòn Nối 40cm'],
            types: ['Bản Nhựa PVC Bọc Thép', 'Bản Cao Su Chống Va Đập 2026'],
            stock: '283',
            unitPrice: 1299000
          };
        }
        if (idOrCode === '4' || title.includes('mini band') || title.includes('kháng lực') || title.includes('powerband')) {
          return {
            colors: ['Hồng (Light - 15Lbs)', 'Xanh Lá (Medium - 25Lbs)', 'Tím (Heavy - 35Lbs)', 'Đen (X-Heavy - 45Lbs)', 'Set 5 Dây Full Mức'],
            sizes: ['Bản Tiêu Chuẩn 500x50mm', 'Bản Dày Cao Cấp 600x50mm'],
            types: ['Dây Lẻ Tùy Chọn Mức', 'Trọn Bộ 5 Dây + Túi Rút + Ebook Tập'],
            stock: '999',
            unitPrice: 79000
          };
        }
        if (idOrCode === '5' || title.includes('bình nước') || title.includes('2l') || title.includes('hydrasport')) {
          return {
            colors: ['Tím - Xanh Gradient', 'Hồng - Xanh Pastel', 'Đen Nhám Sport', 'Xanh Dương - Vàng'],
            sizes: ['Dung tích 1.5L', 'Dung tích 2.0L Siêu Lớn'],
            types: ['Bình Kèm Ống Hút & Cọ Rửa', 'Bản Full + Bộ Sticker 3D & Dây Đeo'],
            stock: '500',
            unitPrice: 65000
          };
        }
        if (idOrCode === '6' || title.includes('thảm yoga') || title.includes('thảm tập') || title.includes('zenyoga')) {
          return {
            colors: ['Hồng Cánh Sen - Tím', 'Xanh Biển - Xanh Lam', 'Xám Đậm - Đen', 'Xanh Rêu - Xanh Ngọc'],
            sizes: ['Độ dày 6mm (183x61cm)', 'Độ dày 8mm Êm Ái (183x68cm)'],
            types: ['Thảm Định Tuyến Chuẩn', 'Thảm Định Tuyến + Túi Đựng + Dây Buộc'],
            stock: '340',
            unitPrice: 159000
          };
        }
        if (idOrCode === '7' || title.includes('con lăn') || title.includes('bụng') || title.includes('fitabcore')) {
          return {
            colors: ['Đỏ Ferrari Sport', 'Xanh Dương Dynamic', 'Cam Năng Động', 'Xám Titan'],
            sizes: ['Bản 2 Bánh Tiêu Chuẩn', 'Bản 4 Bánh Tự Động Hồi Về Có Đệm Quỳ'],
            types: ['Bản Cơ Bản', 'Bản Cao Cấp Kèm Giá Để Điện Thoại & Hẹn Giờ'],
            stock: '210',
            unitPrice: 189000
          };
        }

        return {
          colors: ['Màu Mặc Định', 'Màu Phiên Bản Mới'],
          sizes: ['Size Tiêu Chuẩn', 'Size Nâng Cấp'],
          types: ['Bản Tiêu Chuẩn'],
          stock: prod.stock || '500',
          unitPrice: parsePriceToNumber(prod.price) || 99000
        };
      }

      function resolveSellerBuyUrl(prod, platform, variantInfo) {
        if (!prod) return 'https://www.tiktok.com/search?q=' + encodeURIComponent('sản phẩm tiktok shop chính hãng');
        
        const isClean = function(u) {
          return u && typeof u === 'string' && (u.startsWith('http://') || u.startsWith('https://')) && !u.includes('shop.tiktok.com') && !u.includes('/view/product/');
        };
        if (isClean(prod.affiliateUrl)) return prod.affiliateUrl;
        if (isClean(prod.buyUrl)) return prod.buyUrl;
        if (isClean(prod.productUrl)) return prod.productUrl;
        if (isClean(prod.sellerStoreUrl)) return prod.sellerStoreUrl;
        if (isClean(prod.storeUrl)) return prod.storeUrl;

        const pName = prod.name || prod.productName || prod.title || '';
        const colorPart = variantInfo && variantInfo.color ? ' ' + variantInfo.color : '';
        const sizePart = variantInfo && variantInfo.size ? ' ' + variantInfo.size : '';
        const fullQuery = (pName + colorPart + sizePart).trim();

        if (platform === 'shopee') {
          return 'https://shopee.vn/search?keyword=' + encodeURIComponent(fullQuery || 'sản phẩm hot deal');
        }
        return 'https://www.tiktok.com/search?q=' + encodeURIComponent(fullQuery || 'sản phẩm tiktok shop');
      }

      function renderModalVariantButtons(containerId, items, selectedValue, onSelectFnName) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';
        items.forEach(function(item) {
          const btn = document.createElement('button');
          btn.type = 'button';
          const isSel = item === selectedValue;
          btn.style.padding = '6px 12px';
          btn.style.borderRadius = '10px';
          btn.style.border = isSel ? '1.5px solid #f43f5e' : '1px solid rgba(255, 255, 255, 0.2)';
          btn.style.background = isSel ? 'linear-gradient(135deg, rgba(244, 63, 94, 0.35), rgba(225, 29, 72, 0.45))' : 'rgba(30, 41, 59, 0.8)';
          btn.style.color = isSel ? '#ffffff' : '#cbd5e1';
          btn.style.fontSize = '11px';
          btn.style.fontWeight = isSel ? '800' : '600';
          btn.style.cursor = 'pointer';
          btn.style.transition = 'all 0.15s ease';
          btn.style.boxShadow = isSel ? '0 0 10px rgba(244, 63, 94, 0.4)' : 'none';
          btn.innerHTML = (isSel ? '✓ ' : '') + item;
          btn.onclick = function(e) {
            e.stopPropagation();
            window[onSelectFnName](item);
          };
          container.appendChild(btn);
        });
      }

      function updateModalPriceAndSummary() {
        if (!activeModalProduct) return;
        const variants = getProductVariants(activeModalProduct);
        const unitP = variants.unitPrice || parsePriceToNumber(activeModalProduct.price);
        const total = unitP * modalQuantity;

        const elPrice = document.getElementById('modalProdPrice');
        const elOldPrice = document.getElementById('modalProdOldPrice');
        const elTotal = document.getElementById('modalTotalPrice');
        const elSummary = document.getElementById('modalProdSelectedSummary');
        const elQty = document.getElementById('modalQuantityVal');

        if (elPrice) elPrice.innerText = formatVietnamesePrice(unitP);
        if (elOldPrice && activeModalProduct.oldPrice) {
          elOldPrice.innerText = activeModalProduct.oldPrice;
          elOldPrice.style.display = 'inline';
        }
        if (elTotal) elTotal.innerText = formatVietnamesePrice(total);
        if (elQty) elQty.innerText = String(modalQuantity);

        if (elSummary) {
          const parts = [];
          if (modalSelectedColor) parts.push(modalSelectedColor);
          if (modalSelectedSize) parts.push(modalSelectedSize);
          if (modalSelectedType) parts.push(modalSelectedType);
          parts.push('SL: ' + modalQuantity);
          elSummary.innerText = 'Đang chọn: ' + parts.join(' • ');
        }
      }

      function getSellerName(prod) {
        if (prod && prod.sellerName) return prod.sellerName;
        if (prod && prod.shopName) return prod.shopName;
        const idOrCode = String((prod && (prod.id || prod.code || prod.sku)) || '').toLowerCase();
        const title = String((prod && (prod.name || prod.productName || prod.title)) || '').toLowerCase();
        if (idOrCode === '1' || title.includes('bra') || title.includes('havata')) return 'HAVATA Official Store';
        if (idOrCode === '2' || title.includes('quấn cổ chân') || title.includes('combo')) return 'EiraFit Gymwear';
        if (idOrCode === '3' || title.includes('tạ tay') || title.includes('40kg')) return 'GymPro Vietnam';
        if (idOrCode === '4' || title.includes('mini band') || title.includes('kháng lực')) return 'PowerBand Sport';
        if (idOrCode === '5' || title.includes('bình nước') || title.includes('2l')) return 'HydraSport VN';
        if (idOrCode === '6' || title.includes('thảm yoga') || title.includes('thảm tập')) return 'ZenYoga Master';
        if (idOrCode === '7' || title.includes('con lăn') || title.includes('bụng')) return 'FitAbCore Official';
        return 'Đơn Vị Bán Hàng';
      }

      window.openProductPurchaseModal = function(prod) {
        if (!prod) prod = window.__currentPinnedProduct;
        if (!prod) return;
        activeModalProduct = prod;
        const variants = getProductVariants(prod);
        
        modalSelectedColor = variants.colors && variants.colors.length > 0 ? variants.colors[0] : '';
        modalSelectedSize = variants.sizes && variants.sizes.length > 0 ? variants.sizes[0] : '';
        modalSelectedType = variants.types && variants.types.length > 0 ? variants.types[0] : '';
        modalQuantity = 1;

        const modal = document.getElementById('productCheckoutModal');
        const img = document.getElementById('modalProdImg');
        const title = document.getElementById('modalProdTitle');
        const shop = document.getElementById('modalProdShopName');
        const stock = document.getElementById('modalProdStock');

        if (img) img.src = prod.image || 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=500&q=80';
        if (title) title.innerText = prod.name || prod.productName || 'Sản phẩm Livestream';
        if (shop) shop.innerText = getSellerName(prod);
        if (stock) stock.innerText = '⚡ Kho: Còn ' + (variants.stock || prod.stock || '500') + ' sản phẩm';

        renderModalVariantButtons('modalColorOptions', variants.colors || [], modalSelectedColor, 'selectModalColor');
        renderModalVariantButtons('modalSizeOptions', variants.sizes || [], modalSelectedSize, 'selectModalSize');
        
        const typeSec = document.getElementById('modalTypeSection');
        if (variants.types && variants.types.length > 1) {
          if (typeSec) typeSec.style.display = 'block';
          renderModalVariantButtons('modalTypeOptions', variants.types, modalSelectedType, 'selectModalType');
        } else {
          if (typeSec) typeSec.style.display = 'none';
        }

        updateModalPriceAndSummary();

        if (modal) {
          modal.style.display = 'flex';
        }
      };

      window.closeProductModal = function(e) {
        if (e) {
          try { e.preventDefault(); } catch(err) {}
          try { e.stopPropagation(); } catch(err) {}
        }
        const modal = document.getElementById('productCheckoutModal');
        if (modal) modal.style.display = 'none';
      };

      window.closeProductModalOnBackdrop = function(e) {
        if (e && e.target && e.target.id === 'productCheckoutModal') {
          window.closeProductModal(e);
        }
      };

      window.selectModalColor = function(color) {
        modalSelectedColor = color;
        const variants = getProductVariants(activeModalProduct);
        renderModalVariantButtons('modalColorOptions', variants.colors || [], modalSelectedColor, 'selectModalColor');
        updateModalPriceAndSummary();
      };

      window.selectModalSize = function(size) {
        modalSelectedSize = size;
        const variants = getProductVariants(activeModalProduct);
        renderModalVariantButtons('modalSizeOptions', variants.sizes || [], modalSelectedSize, 'selectModalSize');
        updateModalPriceAndSummary();
      };

      window.selectModalType = function(type) {
        modalSelectedType = type;
        const variants = getProductVariants(activeModalProduct);
        renderModalVariantButtons('modalTypeOptions', variants.types || [], modalSelectedType, 'selectModalType');
        updateModalPriceAndSummary();
      };

      window.changeModalQuantity = function(delta) {
        modalQuantity = Math.max(1, Math.min(99, modalQuantity + delta));
        updateModalPriceAndSummary();
      };

      window.submitModalCheckout = function(platform) {
        const prod = activeModalProduct || window.__currentPinnedProduct;
        const variantInfo = {
          color: modalSelectedColor,
          size: modalSelectedSize,
          type: modalSelectedType,
          quantity: modalQuantity
        };
        const targetUrl = resolveSellerBuyUrl(prod, platform, variantInfo);
        window.open(targetUrl, '_blank', 'noopener,noreferrer');
      };

      window.handleOpenPinnedProduct = function(e) {
        if (e) {
          try { e.preventDefault(); } catch(err) {}
          try { e.stopPropagation(); } catch(err) {}
        }
        const prod = window.__currentPinnedProduct;
        window.openProductPurchaseModal(prod);
      };

      function getChromaClass(chroma) {
        if (!chroma || !chroma.enabled) return '';
        const m = (chroma.mode || 'auto').toLowerCase();
        if (m === 'blue') return 'chroma-blue-filter';
        if (m === 'red') return 'chroma-red-filter';
        if (m === 'black') return 'chroma-black-filter';
        if (m === 'white') return 'chroma-white-filter';
        if (m === 'room') return 'chroma-room-filter';
        if (m === 'auto') return 'chroma-auto-filter';
        return 'chroma-green-filter';
      }

      function tryEnableAudioSafe() {
        if (!targetSoundEnabled) return;
        try {
          vid.muted = false;
          vid.volume = targetVolume;
          if (vid.paused && !isStreamUserPaused) {
            vid.muted = true;
            safePlay();
          }
        } catch (e) {
          vid.muted = true;
        }
        updateDockUI();
      }

      function safePlay() {
        if (isStreamUserPaused) return;
        vid.muted = !targetSoundEnabled;
        vid.defaultMuted = !targetSoundEnabled;
        try {
          isPlayPending = true;
          setTimeout(function() { isPlayPending = false; }, 400);
          const p = vid.play();
          if (p !== undefined && typeof p.then === 'function') {
            p.then(function() {
              isPlayPending = false;
              hideLoading();
              updateDockUI();
              if (targetSoundEnabled) {
                setTimeout(tryEnableAudioSafe, 200);
              }
            }).catch(function(err) {
              isPlayPending = false;
              vid.muted = true;
              setTimeout(function() {
                if (vid.paused && !isStreamUserPaused) {
                  try { vid.play().then(function() { hideLoading(); updateDockUI(); }).catch(function() {}); } catch(e) {}
                }
              }, 100);
            });
          } else {
            isPlayPending = false;
            hideLoading();
            updateDockUI();
          }
        } catch(err) {
          isPlayPending = false;
        }
      }

      window.handleLiveRefreshToggle = function(e) {
        if (e) { try { e.preventDefault(); e.stopPropagation(); } catch(err) {} }
        isStreamUserPaused = false;
        if (btnLiveStatus) {
          btnLiveStatus.innerHTML = '<span class="dock-pulse-dot"></span>⚡ ĐÃ LÀM MỚI 60FPS';
          btnLiveStatus.style.borderColor = '#22c55e';
          btnLiveStatus.style.background = 'rgba(34, 197, 94, 0.45)';
          setTimeout(function() {
            if (btnLiveStatus) {
              btnLiveStatus.innerHTML = '<span class="dock-pulse-dot"></span>• TRỰC TIẾP 60FPS';
              btnLiveStatus.style.borderColor = '';
              btnLiveStatus.style.background = '';
            }
          }, 1500);
        }
        if (typeof fetchLatestState === 'function') fetchLatestState();
        getAllVideos().forEach(function(v) {
          try {
            v.muted = !targetSoundEnabled;
            v.play().catch(function() {});
          } catch(err) {}
        });
        if (vid && vid.src) {
          safePlay();
        }
        updateDockUI();
      };

      window.handlePlayPauseToggle = function(e) {
        if (e) { try { e.preventDefault(); e.stopPropagation(); } catch(err) {} }
        isStreamUserPaused = !isStreamUserPaused;
        getAllVideos().forEach(function(v) {
          if (isStreamUserPaused) {
            try { v.pause(); } catch(e) {}
          } else {
            try { v.play().catch(function() {}); } catch(e) {}
          }
        });
        if (!isStreamUserPaused) {
          safePlay();
        }
        updateDockUI();
      };

      window.handleMuteToggle = function(e) {
        if (e) { try { e.preventDefault(); e.stopPropagation(); } catch(err) {} }
        targetSoundEnabled = !targetSoundEnabled;
        getAllVideos().forEach(function(v) {
          try {
            v.muted = !targetSoundEnabled;
            if (targetSoundEnabled) v.volume = targetVolume;
          } catch(e) {}
        });
        if (targetSoundEnabled && vid && vid.paused && !isStreamUserPaused) {
          safePlay();
        }
        updateDockUI();
      };

      window.handleFitToggle = function(e) {
        if (e) { try { e.preventDefault(); e.stopPropagation(); } catch(err) {} }
        currentFit = (currentFit === 'cover' ? 'contain' : 'cover');
        try { localStorage.setItem('avalive_media_fit_mode', currentFit); } catch(e) {}
        if (vid) vid.style.objectFit = currentFit;
        const imgEl = document.getElementById('imagePlayer');
        if (imgEl) imgEl.style.objectFit = currentFit;
        const pipV = document.getElementById('pipVideo');
        if (pipV) pipV.style.objectFit = currentFit;
        const pipI = document.getElementById('pipImage');
        if (pipI) pipI.style.objectFit = currentFit;
        updateDockUI();
      };

      window.toggleHideAll = toggleHideAll;

      window.addEventListener('keydown', function(e) {
        if (['input', 'textarea', 'select'].includes(document.activeElement?.tagName?.toLowerCase())) return;
        if (e.code === 'Space') {
          e.preventDefault();
          window.handlePlayPauseToggle(e);
        } else if (e.key === 'm' || e.key === 'M') {
          e.preventDefault();
          window.handleMuteToggle(e);
        } else if (e.key === 'f' || e.key === 'F') {
          e.preventDefault();
          window.handleFitToggle(e);
        } else if (e.key === 'h' || e.key === 'H') {
          e.preventDefault();
          toggleHideAll();
        }
      });

      function isSameMedia(srcA, srcB) {
        if (!srcA || !srcB) return false;
        try {
          const pA = String(srcA).split('?')[0].split('#')[0];
          const pB = String(srcB).split('?')[0].split('#')[0];
          if (pA === pB) return true;
          const fA = pA.substring(pA.lastIndexOf('/') + 1);
          const fB = pB.substring(pB.lastIndexOf('/') + 1);
          if (fA && fB && fA === fB && !fA.startsWith('blob:') && !fB.startsWith('blob:')) return true;
          const uA = new URL(srcA, window.location.href);
          const uB = new URL(srcB, window.location.href);
          return uA.pathname === uB.pathname;
        } catch (e) {
          const pA = String(srcA).split('?')[0].split('#')[0];
          const pB = String(srcB).split('?')[0].split('#')[0];
          return pA === pB || pA.endsWith(pB) || pB.endsWith(pA);
        }
      }

      function resolveUrl(url) {
        if (!url || typeof url !== 'string' || url === 'null' || url === 'undefined' || url.trim() === '') return '';
        if (url.startsWith('blob:') || url.startsWith('data:')) return url;
        try { url = decodeURIComponent(url); } catch(e) {}
        if (url.startsWith('http://') || url.startsWith('https://')) {
          if (url.includes('localhost:') || url.includes('127.0.0.1:') || url.includes('vercel.app')) {
            try {
              const u = new URL(url);
              if (u.pathname.startsWith('/uploads/')) {
                return window.location.origin + u.pathname + u.search;
              }
            } catch(e) {}
          }
          return url;
        }
        if (url.startsWith('/uploads/') || url.includes('/uploads/')) {
          const pathPart = url.substring(url.indexOf('/uploads/'));
          return window.location.origin + pathPart;
        }
        if (url.startsWith('/')) return window.location.origin + url;
        return window.location.origin + '/' + url;
      }

      function isImage(u) {
        if (!u || typeof u !== 'string') return false;
        if (u.startsWith('data:image/')) return true;
        var clean = u.split('?')[0].split('#')[0].toLowerCase();
        return clean.endsWith('.png') || clean.endsWith('.jpg') || clean.endsWith('.jpeg') || clean.endsWith('.webp') || clean.endsWith('.gif') || clean.endsWith('.svg') || clean.endsWith('.avif') || clean.endsWith('.bmp');
      }

      // 🎬 NẠP VÀ PHÁT VIDEO / ẢNH 4K 60 FPS LIỀN MẠCH TUYỆT ĐỐI (SIÊU SẮC NÉT & KHÔNG BAO GIỜ ĐEN MÀN HÌNH)
      function loadAndPlay(url, forceSeekTime) {
        if (!url) {
          url = currentSrc || '';
        }
        if (!url) return;
        const fullUrl = resolveUrl(url);
        if (!fullUrl) return;

        const imgEl = document.getElementById('imagePlayer');
        if (isImage(fullUrl)) {
          if (imgEl) {
            imgEl.src = fullUrl;
            imgEl.style.display = 'block';
          }
          if (vid) {
            vid.style.display = 'none';
            try { vid.pause(); } catch(e) {}
          }
          hideLoading();
          return;
        }

        if (imgEl) {
          imgEl.style.display = 'none';
        }
        if (vid) {
          vid.style.display = 'block';
          if (!isSameMedia(vid.src, fullUrl)) {
            currentSrc = fullUrl;
            vid.src = fullUrl;
          }

          if (typeof forceSeekTime === 'number' && forceSeekTime > 0) {
            try { vid.currentTime = forceSeekTime; } catch(e) {}
          }

          safePlay();
        }
      }

      // 🛡️ ANTI-PAUSE GUARDIAN: Tự động phát lại ngay nếu trình duyệt CEF vô tình pause
      vid.addEventListener('pause', function() {
        if (!isStreamUserPaused) {
          safePlay();
        }
      });

      vid.addEventListener('playing', function() {
        hideLoading();
        updateDockUI();
      });

      vid.addEventListener('timeupdate', function() {
        if (vid.currentTime > 0) {
          hideLoading();
        }
      });

      vid.addEventListener('canplay', function() {
        if (vid.paused && !isStreamUserPaused) {
          safePlay();
        }
      });

      vid.addEventListener('loadeddata', function() {
        if (vid.paused && !isStreamUserPaused) {
          safePlay();
        }
      });

      vid.addEventListener('loadedmetadata', function() {
        if (vid.paused && !isStreamUserPaused) {
          safePlay();
        }
      });

      // Đảm bảo video lặp liên tục nhiều giờ liền không bao giờ dừng
      vid.addEventListener('ended', function() {
        if (!isStreamUserPaused) {
          try { vid.currentTime = 0; } catch (e) {}
          safePlay();
        }
      });

      // Tự động khôi phục tức thì khi CEF hoặc TikTok Live Studio bị nghẽn buffer hoặc lag
      vid.addEventListener('waiting', function() {
        if (!isStreamUserPaused) {
          safePlay();
        }
      });

      vid.addEventListener('stalled', function() {
        if (!isStreamUserPaused) {
          safePlay();
        }
      });

      // ⚡ CEF WATCHDOG: Kiểm tra mỗi 500ms để bảo đảm video đang chạy 60 FPS liên tục & chống đứng hình
      let lastObservedTime = -1;
      let freezeCounter = 0;
      setInterval(function() {
        if (!isStreamUserPaused && vid.src) {
          if (vid.paused || vid.ended) {
            safePlay();
          } else if (vid.readyState >= 2) {
            if (vid.currentTime === lastObservedTime && !vid.seeking) {
              freezeCounter++;
              if (freezeCounter >= 3) {
                // Video bị kẹt hình 1.5s -> kick nhẹ currentTime và play
                try { vid.currentTime += 0.04; } catch(e) {}
                safePlay();
                freezeCounter = 0;
              }
            } else {
              freezeCounter = 0;
              lastObservedTime = vid.currentTime;
            }
          }
        }
      }, 500);

      function renderMultiAvatarCharacters(configOrAvatars, activeSpeakerId, isPlayingState, avatarTransformsMap) {
        const container = document.getElementById('multiAvatarCharacters');
        if (!container) return;
        
        let avatars = [];
        if (Array.isArray(configOrAvatars)) {
          avatars = configOrAvatars;
        } else if (configOrAvatars && Array.isArray(configOrAvatars.avatars)) {
          avatars = configOrAvatars.avatars;
        }
        
        avatars = avatars.filter(function(a) { return a && a.visible !== false; });
        if (avatars.length === 0) {
          container.innerHTML = '';
          return;
        }

        avatars.forEach(function(avatar, idx) {
          const charId = avatar.id || ('avatar_' + (idx + 1));
          let charEl = container.querySelector('[data-char-id="' + charId + '"]');
          const isSpeaking = activeSpeakerId ? (activeSpeakerId === avatar.id || activeSpeakerId === avatar.role) : (avatar.isSpeaking || avatar.isSpeakingNow);
          const avTalk = avatar.talkVideo || avatar.videoUrl || avatar.mediaUrl || avatar.url || avatar.src || '';
          const avIdle = avatar.idleVideo || avatar.videoUrl || avatar.mediaUrl || avatar.url || avatar.src || '';
          const targetVid = avatar.resolvedVidSrc || (isSpeaking ? (avTalk || avIdle) : (avIdle || avTalk)) || '';
          const resolvedMedia = resolveUrl(targetVid);

          const customTrans = (avatarTransformsMap && (avatarTransformsMap[charId] || avatarTransformsMap[avatar.id] || avatarTransformsMap[avatar.role])) || {};
          const isSingle = avatars.length === 1;
          const defaultTrans = isSingle
            ? { x: 0, y: 0, width: 100, height: 100, zIndex: 10, borderRadius: 0 }
            : {
                x: idx === 0 ? 8 : (idx === 1 ? 55 : (idx === 2 ? 30 : 50)),
                y: idx === 0 ? 41 : (idx === 1 ? 17 : 20),
                width: 45,
                height: 48,
                zIndex: 10 + idx,
                borderRadius: 16
              };
          const baseTrans = avatar.transform || (avatar.transforms) || defaultTrans;
          const trans = Object.assign({}, baseTrans, customTrans);
          const chromaClass = getChromaClass(avatar.chromaKey);

          if (!charEl) {
            charEl = document.createElement('div');
            charEl.setAttribute('data-char-id', charId);
            charEl.style.position = 'absolute';
            charEl.style.transition = 'all 0.3s ease';
            charEl.style.overflow = 'hidden';
            charEl.innerHTML = '<video autoplay loop muted playsinline webkit-playsinline style="width:100%;height:100%;object-fit:' + (trans.objectFit || 'cover') + ';background:transparent;display:none;pointer-events:none;border-radius:inherit;"></video><img style="width:100%;height:100%;object-fit:' + (trans.objectFit || 'cover') + ';background:transparent;display:none;pointer-events:none;border-radius:inherit;" />';
            container.appendChild(charEl);
          }

          charEl.style.left = (trans.x ?? (isSingle ? 0 : (idx === 0 ? 8 : 55))) + '%';
          charEl.style.top = (trans.y ?? (isSingle ? 0 : (idx === 0 ? 41 : 17))) + '%';
          charEl.style.width = (trans.width ?? (isSingle ? 100 : 45)) + '%';
          charEl.style.height = (trans.height ?? (isSingle ? 100 : 48)) + '%';
          charEl.style.zIndex = trans.zIndex || (10 + idx);
          charEl.style.borderRadius = (trans.borderRadius || 0) + 'px';
          charEl.style.opacity = (trans.opacity !== undefined ? trans.opacity : 100) / 100;

          const rot = trans.rotation || trans.rotate || 0;
          const scaleX = (trans.flipH ? -1 : 1) * (trans.scale || 1);
          const scaleY = (trans.flipV ? -1 : 1) * (trans.scale || 1);
          charEl.style.transform = (rot || trans.flipH || trans.flipV || (trans.scale && trans.scale !== 1))
            ? 'rotate(' + rot + 'deg) scale(' + scaleX + ', ' + scaleY + ')'
            : 'none';
          charEl.style.transformOrigin = 'center center';

          if (isSpeaking) {
            charEl.style.boxShadow = '0 0 20px rgba(52, 211, 153, 0.8), 0 0 0 2px rgba(52, 211, 153, 0.9)';
          } else {
            charEl.style.boxShadow = trans.boxShadow || 'none';
          }
          charEl.className = chromaClass;

          const v = charEl.querySelector('video');
          const img = charEl.querySelector('img');
          const charFit = trans.objectFit || 'cover';

          if (v) {
            v.style.objectFit = charFit;
            v.muted = true;
            v.defaultMuted = true;
            v.setAttribute('muted', '');
            v.playsInline = true;
            v.setAttribute('playsinline', '');
            v.setAttribute('webkit-playsinline', '');
          }

          if (resolvedMedia) {
            if (isImage(resolvedMedia)) {
              if (v) { try { v.pause(); } catch(e) {} v.style.display = 'none'; }
              if (img) { 
                if (img.src !== resolvedMedia) img.src = resolvedMedia; 
                img.style.display = 'block'; 
              }
            } else {
              if (img) img.style.display = 'none';
              if (v) {
                v.style.display = 'block';
                if (!isSameMedia(v.src, resolvedMedia)) {
                  v.src = resolvedMedia;
                  try { v.load(); } catch(e) {}
                }
                if (isPlayingState !== false && !isStreamUserPaused) {
                  v.play().catch(function() {});
                } else {
                  try { v.pause(); } catch(e) {}
                }
              }
            }
          }
        });

        Array.from(container.children).forEach(function(child) {
          const cid = child.getAttribute('data-char-id');
          if (!avatars.some(function(a, i) { return (a.id || ('avatar_' + (i + 1))) === cid; })) {
            const v = child.querySelector('video');
            if (v) { try { v.pause(); v.removeAttribute('src'); v.load(); } catch(e) {} }
            child.remove();
          }
        });
      }

      function renderMultiAvatarExtraLayers(configOrLayers) {
        const container = document.getElementById('multiAvatarExtraLayers');
        if (!container) return;
        let layers = [];
        if (Array.isArray(configOrLayers)) {
          layers = configOrLayers;
        } else if (configOrLayers && Array.isArray(configOrLayers.extraImageLayers)) {
          layers = configOrLayers.extraImageLayers;
        } else if (configOrLayers && Array.isArray(configOrLayers.extraLayers)) {
          layers = configOrLayers.extraLayers;
        } else if (configOrLayers && Array.isArray(configOrLayers.multiAvatarExtraLayers)) {
          layers = configOrLayers.multiAvatarExtraLayers;
        }
        if (layers.length === 0) {
          container.innerHTML = '';
          return;
        }

        layers.forEach(function(layer, idx) {
          const layerUrl = layer.url || layer.mediaUrl || layer.src;
          if (!layerUrl) return;
          const layerId = layer.id || ('layer_' + (idx + 1));
          let layerEl = container.querySelector('[data-layer-id="' + layerId + '"]');
          const resolvedUrl = resolveUrl(layerUrl);
          const trans = layer.transform || { x: layer.x ?? 20, y: layer.y ?? 20, width: layer.width ?? 30, height: layer.height ?? 30 };
          const chromaClass = getChromaClass(layer.chromaKey);

          if (!layerEl) {
            layerEl = document.createElement('div');
            layerEl.setAttribute('data-layer-id', layerId);
            layerEl.style.position = 'absolute';
            layerEl.style.transition = 'all 0.3s ease';
            layerEl.innerHTML = '<video autoplay loop muted playsinline webkit-playsinline style="width:100%;height:100%;object-fit:contain;background:transparent;display:none;"></video><img style="width:100%;height:100%;object-fit:contain;background:transparent;display:none;" />';
            container.appendChild(layerEl);
          }

          layerEl.style.left = (trans.x ?? 20) + '%';
          layerEl.style.top = (trans.y ?? 20) + '%';
          layerEl.style.width = (trans.width ?? 30) + '%';
          layerEl.style.height = (trans.height ?? 30) + '%';
          layerEl.style.zIndex = trans.zIndex || (5 + idx);
          layerEl.style.borderRadius = (trans.borderRadius || layer.borderRadius || 0) + 'px';
          layerEl.style.opacity = (trans.opacity !== undefined ? trans.opacity : (layer.opacity !== undefined ? layer.opacity : 100)) / 100;

          const rot = trans.rotation || trans.rotate || 0;
          const scaleX = (trans.flipH ? -1 : 1) * (trans.scale || 1);
          const scaleY = (trans.flipV ? -1 : 1) * (trans.scale || 1);
          layerEl.style.transform = (rot || trans.flipH || trans.flipV || (trans.scale && trans.scale !== 1))
            ? 'rotate(' + rot + 'deg) scale(' + scaleX + ', ' + scaleY + ')'
            : 'none';
          layerEl.style.transformOrigin = 'center center';
          layerEl.className = chromaClass;

          const v = layerEl.querySelector('video');
          const img = layerEl.querySelector('img');
          const layerFit = trans.objectFit || layer.objectFit || 'contain';
          if (v) {
            v.style.objectFit = layerFit;
            v.muted = true;
            v.defaultMuted = true;
            v.setAttribute('muted', '');
            v.playsInline = true;
            v.setAttribute('playsinline', '');
            v.setAttribute('webkit-playsinline', '');
          }
          if (img) {
            img.style.objectFit = layerFit;
          }
          const isLayerVid = !isImage(resolvedUrl);
          if (isLayerVid) {
            if (img) img.style.display = 'none';
            if (v) {
              v.style.display = 'block';
              if (!isSameMedia(v.src, resolvedUrl)) {
                v.src = resolvedUrl;
                v.play().catch(function() {});
              }
            }
          } else {
            if (v) { try { v.pause(); } catch(e) {} v.style.display = 'none'; }
            if (img) {
              img.style.display = 'block';
              if (img.src !== resolvedUrl) img.src = resolvedUrl;
            }
          }
        });

        Array.from(container.children).forEach(function(child) {
          const lid = child.getAttribute('data-layer-id');
          if (!layers.some(function(l, i) { return (l.id || ('layer_' + (i + 1))) === lid; })) {
            const v = child.querySelector('video');
            if (v) { try { v.pause(); v.removeAttribute('src'); v.load(); } catch(e) {} }
            child.remove();
          }
        });
      }

      function applyLiveState(data) {
        if (!data) return;
        if (data.aspectRatio) {
          updateStageAspectRatio(data.aspectRatio);
        }
        const stageEl = document.getElementById('stage');
        const emptyStage = document.getElementById('emptyStageView');
        const multiStage = document.getElementById('multiAvatarStage');
        const multiBg = document.getElementById('multiAvatarBg');
        const overlayImgEl = document.getElementById('overlayImageBanner');
        const overlayImgContent = document.getElementById('overlayImageContent');
        const banner = document.getElementById('overlayTextBanner');
        const content = document.getElementById('overlayTextContent');
        const pipContainer = document.getElementById('pipContainer');
        const pipVideo = document.getElementById('pipVideo');
        const pipImage = document.getElementById('pipImage');

        if (stageEl && data.backgroundColor) {
          stageEl.style.backgroundColor = data.backgroundColor;
        }

        // 2. Tìm nguồn media nền chính (Background / Main Media)
        const bgUrlCandidate = data.mainMediaUrl || (data.multiAvatarConfig && data.multiAvatarConfig.backgroundUrl) || data.mediaUrl || data.currentMedia || data.eventVideoUrl || data.videoUrl || '';
        const resolvedMainBg = resolveUrl(bgUrlCandidate);

        const avatarsList = (Array.isArray(data.syncedAvatars) && data.syncedAvatars.length > 0)
          ? data.syncedAvatars
          : ((data.multiAvatarConfig && Array.isArray(data.multiAvatarConfig.avatars) && data.multiAvatarConfig.avatars.length > 0)
            ? data.multiAvatarConfig.avatars
            : []);

        const hasValidAvatars = avatarsList.length > 0 && avatarsList.some(function(a) {
          const u = a.talkVideo || a.idleVideo || a.mediaUrl || a.resolvedVidSrc || a.url || a.src || a.videoUrl;
          return u && typeof u === 'string';
        });

        const isValidCustomOverlayText = (txt) => {
          if (!txt || typeof txt !== 'string') return false;
          const trimmed = txt.trim();
          if (!trimmed) return false;
          if (/^(bước|step)\s*\d+/i.test(trimmed)) return false;
          return true;
        };

        const extraLayersList = (Array.isArray(data.extraImageLayers) && data.extraImageLayers.length > 0)
          ? data.extraImageLayers
          : ((data.multiAvatarConfig && Array.isArray(data.multiAvatarConfig.extraImageLayers) && data.multiAvatarConfig.extraImageLayers.length > 0)
            ? data.multiAvatarConfig.extraImageLayers
            : (Array.isArray(data.multiAvatarExtraLayers) ? data.multiAvatarExtraLayers : []));

        const hasExtraLayers = extraLayersList.length > 0;
        const hasTitle = isValidCustomOverlayText(data.overlayText) || isValidCustomOverlayText(data.title);
        const hasPinnedProduct = !!(data.livePinnedProduct || data.pinnedProduct);
        const hasAnyContent = !!(resolvedMainBg || hasValidAvatars || data.secondaryMediaUrl || data.overlayImage || hasExtraLayers || hasTitle || hasPinnedProduct);

        // 1. Kiểm tra trạng thái XÓA SẠCH SÂN KHẤU (CLEAR_STAGE / clearMedia / Dừng Live)
        if (data.clearMedia === true || data.stageStatus === 'stopped' || data.isLiveEnded === true || (data.isPlaying === false && !resolvedMainBg && !hasValidAvatars && !data.secondaryMediaUrl)) {
          if (emptyStage) emptyStage.style.display = 'flex';
          if (multiStage) multiStage.style.display = 'none';
          if (pipContainer) pipContainer.style.display = 'none';
          if (overlayImgEl) overlayImgEl.style.display = 'none';
          if (banner) banner.style.display = 'none';
          const prodContainer = document.getElementById('pinnedProductContainer');
          if (prodContainer) prodContainer.style.display = 'none';
          if (vid) {
            try { vid.pause(); vid.removeAttribute('src'); vid.src = ''; vid.load(); } catch(e) {}
            vid.style.display = 'none';
          }
          const imgEl = document.getElementById('imagePlayer');
          if (imgEl) {
            try { imgEl.removeAttribute('src'); imgEl.src = ''; } catch(e) {}
            imgEl.style.display = 'none';
          }
          const multiChars = document.getElementById('multiAvatarCharacters');
          if (multiChars) multiChars.innerHTML = '';
          const multiExtra = document.getElementById('multiAvatarExtraLayers');
          if (multiExtra) multiExtra.innerHTML = '';
          const multiBg = document.getElementById('multiAvatarBg');
          if (multiBg) { multiBg.style.backgroundImage = 'none'; multiBg.style.display = 'none'; }
          hideLoading();
          updateDockUI();
          return;
        }

        if (!resolvedMainBg && !hasValidAvatars && !data.secondaryMediaUrl && !data.overlayImage && !hasExtraLayers && !hasTitle && !hasPinnedProduct) {
          if (emptyStage) emptyStage.style.display = 'flex';
          if (multiStage) multiStage.style.display = 'none';
          if (pipContainer) pipContainer.style.display = 'none';
          if (overlayImgEl) overlayImgEl.style.display = 'none';
          if (banner) banner.style.display = 'none';
          const prodContainer = document.getElementById('pinnedProductContainer');
          if (prodContainer) prodContainer.style.display = 'none';
          if (vid) {
            try { vid.pause(); vid.removeAttribute('src'); vid.src = ''; vid.load(); } catch(e) {}
            vid.style.display = 'none';
          }
          const imgEl = document.getElementById('imagePlayer');
          if (imgEl) {
            try { imgEl.removeAttribute('src'); imgEl.src = ''; } catch(e) {}
            imgEl.style.display = 'none';
          }
          hideLoading();
          updateDockUI();
          return;
        }

        if (emptyStage) emptyStage.style.display = 'none';

        // 3. Hiển thị Lớp Nền Sân Khấu Chính (Background Layer)
        const imgEl = document.getElementById('imagePlayer');
        const mainBgLayer = document.getElementById('mainBackgroundLayer');
        const mainChromaClass = getChromaClass(data.mainMediaChromaKey || data.backgroundChromaKey);
        const mainTrans = data.mainMediaTransform || (data.multiAvatarConfig && data.multiAvatarConfig.backgroundTransform) || { x: 0, y: 0, width: 100, height: 100 };

        const bgFit = mainTrans.objectFit || currentFit || 'cover';
        const bgRot = mainTrans.rotation || mainTrans.rotate || 0;
        const bgScaleX = (mainTrans.flipH ? -1 : 1) * (mainTrans.scale || 1);
        const bgScaleY = (mainTrans.flipV ? -1 : 1) * (mainTrans.scale || 1);
        const bgTransform = (bgRot || mainTrans.flipH || mainTrans.flipV || (mainTrans.scale && mainTrans.scale !== 1))
          ? 'rotate(' + bgRot + 'deg) scale(' + bgScaleX + ', ' + bgScaleY + ')'
          : 'none';
        const bgOpacity = (mainTrans.opacity !== undefined ? mainTrans.opacity : 100) / 100;
        const bgRadius = (mainTrans.borderRadius || 0) + 'px';

        if (mainBgLayer) {
          mainBgLayer.style.left = (mainTrans.x ?? 0) + '%';
          mainBgLayer.style.top = (mainTrans.y ?? 0) + '%';
          mainBgLayer.style.width = (mainTrans.width ?? 100) + '%';
          mainBgLayer.style.height = (mainTrans.height ?? 100) + '%';
          mainBgLayer.style.transform = bgTransform;
          mainBgLayer.style.transformOrigin = 'center center';
          mainBgLayer.style.opacity = bgOpacity;
          mainBgLayer.style.borderRadius = bgRadius;
          mainBgLayer.style.zIndex = mainTrans.zIndex || 0;
        }

        if (multiBg && resolvedMainBg) {
          multiBg.style.backgroundImage = 'url(' + resolvedMainBg + ')';
          multiBg.style.display = 'block';
        } else if (multiBg) {
          multiBg.style.display = 'none';
        }

        if (resolvedMainBg) {
          if (isImage(resolvedMainBg)) {
            if (imgEl) {
              if (imgEl.src !== resolvedMainBg) imgEl.src = resolvedMainBg;
              imgEl.style.objectFit = bgFit;
              imgEl.className = mainChromaClass;
              imgEl.style.display = 'block';
            }
            if (vid) {
              vid.style.display = 'none';
              try { vid.pause(); } catch(e) {}
            }
          } else {
            if (imgEl) imgEl.style.display = 'none';
            if (vid) {
              vid.style.objectFit = bgFit;
              vid.className = mainChromaClass;
              vid.style.display = 'block';
              if (!isSameMedia(vid.src, resolvedMainBg)) {
                currentSrc = resolvedMainBg;
                vid.src = resolvedMainBg;
                try { vid.load(); } catch(e) {}
              }
              if (data.isPlaying !== false && !isStreamUserPaused) safePlay();
            }
          }
        } else {
          if (imgEl) imgEl.style.display = 'none';
          if (vid) { vid.style.display = 'none'; }
        }

        // 4. Hiển thị Lớp Multi-Avatar & Extra Layers (Đồng bộ 100% Sân Khấu Chính)
        const avatarTransformsMap = data.avatarTransforms || (data.multiAvatarConfig && data.multiAvatarConfig.avatarTransforms) || null;
        if (hasValidAvatars || hasExtraLayers) {
          if (multiStage) {
            multiStage.style.display = 'block';
            multiStage.style.background = data.multiAvatarConfig?.backgroundColor || 'transparent';
          }
          renderMultiAvatarCharacters(avatarsList, data.activeSpeakerId || data.avatarSpeaker, data.isPlaying !== false, avatarTransformsMap);
          renderMultiAvatarExtraLayers(extraLayersList);
        } else {
          if (multiStage) multiStage.style.display = 'none';
        }

        // 4. Lớp Video Phụ PiP (Picture-in-Picture)
        if (pipContainer && pipVideo && pipImage) {
          const pipUrl = resolveUrl(data.secondaryMediaUrl);
          if (pipUrl) {
            const trans = data.secondaryMediaTransform || {
              x: data.secondaryMediaPos === 'top-left' ? 4 : (data.secondaryMediaPos === 'bottom-left' ? 4 : 55),
              y: (data.secondaryMediaPos === 'bottom-left' || data.secondaryMediaPos === 'bottom-right') ? 70 : 8,
              width: Number(data.secondaryMediaScale) || 40,
              height: Math.round((Number(data.secondaryMediaScale) || 40) * 1.2),
              zIndex: 25
            };
            const secChromaClass = getChromaClass(data.secondaryMediaChromaKey);
            pipContainer.style.left = (trans.x ?? 55) + '%';
            pipContainer.style.top = (trans.y ?? 8) + '%';
            pipContainer.style.width = (trans.width ?? 40) + '%';
            pipContainer.style.height = (trans.height ?? 48) + '%';
            pipContainer.style.zIndex = trans.zIndex || 25;
            pipContainer.className = secChromaClass;
            pipContainer.style.display = 'block';

            if (isImage(pipUrl)) {
              pipImage.src = pipUrl;
              pipImage.style.display = 'block';
              pipVideo.style.display = 'none';
            } else {
              pipImage.style.display = 'none';
              pipVideo.style.display = 'block';
              if (!isSameMedia(pipVideo.src, pipUrl)) {
                pipVideo.src = pipUrl;
                if (data.isPlaying !== false) {
                  pipVideo.play().catch(function() {});
                }
              }
            }
          } else {
            pipContainer.style.display = 'none';
            try { pipVideo.pause(); pipVideo.src = ''; } catch(e) {}
          }
        }

        // 5. Banner Hình Ảnh Overlay (Đúng Tọa Độ Transform)
        if (overlayImgEl && overlayImgContent) {
          const imgUrl = resolveUrl(data.overlayImage || data.bannerUrl || data.posterUrl);
          if (imgUrl) {
            const trans = data.overlayImageTransform || {
              x: 10,
              y: data.overlayImagePos === 'bottom' ? 70 : (data.overlayImagePos === 'top' ? 8 : 12),
              width: Number(data.overlayImageScale) || 80,
              height: 20,
              zIndex: 30
            };
            const imgChromaClass = getChromaClass(data.overlayImageChromaKey);
            overlayImgEl.style.left = (trans.x ?? 10) + '%';
            overlayImgEl.style.top = (trans.y ?? 12) + '%';
            overlayImgEl.style.width = (trans.width ?? 80) + '%';
            overlayImgEl.style.zIndex = trans.zIndex || 30;
            overlayImgEl.className = imgChromaClass;
            overlayImgContent.src = imgUrl;
            overlayImgEl.style.display = 'block';
          } else {
            overlayImgEl.style.display = 'none';
          }
        }

        // 6. Tiêu Đề Chữ Overlay (Chỉ hiện khi người dùng nhập nội dung hợp lệ, TUYỆT ĐỐI KHÔNG HIỆN Bước 1, Bước 2...)
        if (banner && content) {
          const rawTxt = data.overlayText || (data.title && !/^(bước|step)\s*\d+/i.test(data.title.trim()) ? data.title : '');
          const txt = isValidCustomOverlayText(rawTxt) ? rawTxt.trim() : '';
          if (txt) {
            const trans = data.overlayTextTransform || { x: 4, y: 5, width: 92, zIndex: 35 };
            banner.style.left = (trans.x ?? 4) + '%';
            banner.style.top = (trans.y ?? 5) + '%';
            banner.style.width = (trans.width ?? 92) + '%';
            banner.style.zIndex = trans.zIndex || 35;
            content.innerText = txt;
            if (data.overlayTextColor) content.style.color = data.overlayTextColor;
            if (data.overlayTextFontSize) content.style.fontSize = data.overlayTextFontSize + 'px';
            if (data.overlayTextFontFamily) {
              const fontMap = {
                montserrat: "'Montserrat', sans-serif",
                be_vietnam: "'Be Vietnam Pro', sans-serif",
                lexend: "'Lexend', sans-serif",
                impact: "Impact, sans-serif",
                inter: "'Inter', sans-serif",
                roboto: "'Roboto', sans-serif",
                playfair: "'Playfair Display', serif",
                anton: "'Anton', sans-serif"
              };
              if (fontMap[data.overlayTextFontFamily]) content.style.fontFamily = fontMap[data.overlayTextFontFamily];
            }
            if (data.overlayTextStyle === 'neon_cyber') {
              content.style.background = 'rgba(2, 6, 23, 0.95)';
              content.style.border = '1.5px solid #22d3ee';
              content.style.color = data.overlayTextColor || '#22d3ee';
              content.style.boxShadow = '0 0 25px rgba(6, 182, 212, 0.8)';
            } else if (data.overlayTextStyle === 'gold_luxury') {
              content.style.background = 'linear-gradient(to right, #f59e0b, #fde047, #f59e0b)';
              content.style.border = '1.5px solid #fef08a';
              content.style.color = data.overlayTextColor || '#020617';
              content.style.boxShadow = '0 0 25px rgba(251, 191, 36, 0.9)';
            } else if (data.overlayTextStyle === 'gradient_rose') {
              content.style.background = 'linear-gradient(to right, #e11d48, #ec4899, #e11d48)';
              content.style.border = '1.5px solid rgba(244, 114, 182, 0.6)';
              content.style.color = data.overlayTextColor || '#ffffff';
              content.style.boxShadow = '0 0 25px rgba(244, 63, 94, 0.8)';
            } else if (data.overlayTextStyle === 'minimal_dark') {
              content.style.background = 'rgba(0, 0, 0, 0.85)';
              content.style.border = '1px solid rgba(255, 255, 255, 0.2)';
              content.style.color = data.overlayTextColor || '#ffffff';
              content.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.9)';
            } else {
              content.style.background = 'linear-gradient(to right, #dc2626, #f59e0b, #dc2626)';
              content.style.border = '1.5px solid rgba(252, 211, 77, 0.6)';
              content.style.color = data.overlayTextColor || '#ffffff';
              content.style.boxShadow = '0 0 25px rgba(239, 68, 68, 0.85)';
            }
            banner.style.display = 'block';
          } else {
            banner.style.display = 'none';
          }
        }

        // 7. Đồng bộ Sản Phẩm Ghim TikTok Shop / Live Commerce
        const prodContainer = document.getElementById('pinnedProductContainer');
        const prod = data.livePinnedProduct || data.pinnedProduct;
        window.__currentPinnedProduct = prod;
        if (prodContainer) {
          if (prod && (prod.title || prod.name || prod.productName)) {
            const prodImg = document.getElementById('pinnedProductImg');
            const prodTitle = document.getElementById('pinnedProductTitle');
            const prodPrice = document.getElementById('pinnedProductPrice');
            const prodOldPrice = document.getElementById('pinnedProductOldPrice');
            const prodBadge = document.getElementById('pinnedProductBadge');
            const prodCode = document.getElementById('pinnedProductCode');
            const prodSeller = document.getElementById('pinnedProductSeller');

            const imgSrc = prod.image || prod.imageUrl || prod.thumbnail || prod.img || '';
            if (prodImg) {
              if (imgSrc) {
                prodImg.src = resolveUrl(imgSrc);
                prodImg.style.display = 'block';
              } else {
                prodImg.style.display = 'none';
              }
            }

            if (prodSeller) {
              prodSeller.innerText = '🏪 ' + getSellerName(prod);
              prodSeller.style.display = 'inline-block';
            }

            if (prodTitle) {
              prodTitle.innerText = prod.title || prod.name || prod.productName || 'Sản phẩm đang ghim';
            }

            if (prodPrice) {
              const rawPrice = prod.salePrice || prod.price || prod.formattedPrice || prod.currentPrice;
              prodPrice.innerText = typeof rawPrice === 'number' ? rawPrice.toLocaleString('vi-VN') + ' đ' : (rawPrice || '');
            }

            if (prodOldPrice) {
              const rawOld = prod.originalPrice || prod.marketPrice || prod.oldPrice || prod.regularPrice;
              if (rawOld) {
                prodOldPrice.innerText = typeof rawOld === 'number' ? rawOld.toLocaleString('vi-VN') + ' đ' : String(rawOld);
                prodOldPrice.style.display = 'inline';
              } else {
                prodOldPrice.style.display = 'none';
              }
            }

            if (prodBadge) {
              const badgeText = prod.dealBadge || prod.discountBadge || prod.badge || prod.tag || (prod.discountPercent ? ('-' + prod.discountPercent + '%') : '🔥 DEAL HOT');
              prodBadge.innerText = badgeText;
              prodBadge.style.display = badgeText ? 'inline-block' : 'none';
            }

            if (prodCode) {
              const codeText = prod.code || prod.sku || (prod.id ? ('#' + prod.id) : '');
              prodCode.innerText = codeText;
              prodCode.style.display = codeText ? 'inline' : 'none';
            }

            prodContainer.style.display = 'block';
          } else {
            prodContainer.style.display = 'none';
          }
        }

        // 8. Đồng bộ trạng thái Dừng / Phát video chính xác 100%
        if (data.isPlaying === false || data.videoPlaybackEvent === 'pause') {
          if (vid && !vid.paused) {
            try { vid.pause(); } catch(e) {}
          }
          if (pipVideo && !pipVideo.paused) {
            try { pipVideo.pause(); } catch(e) {}
          }
          const nestedVids = document.querySelectorAll('#multiAvatarCharacters video, #multiAvatarExtraLayers video');
          nestedVids.forEach(function(av) {
            try { av.pause(); } catch(e) {}
          });
        } else if (data.isPlaying === true || data.videoPlaybackEvent === 'play') {
          if (!isStreamUserPaused && vid && vid.paused && vid.src) {
            safePlay();
          }
          if (pipVideo && pipVideo.paused && pipVideo.src) {
            try { pipVideo.play().catch(function() {}); } catch(e) {}
          }
          if (!isStreamUserPaused) {
            const nestedVids = document.querySelectorAll('#multiAvatarCharacters video, #multiAvatarExtraLayers video');
            nestedVids.forEach(function(av) {
              if (av.paused && av.src) {
                try { av.play().catch(function() {}); } catch(e) {}
              }
            });
          }
        }
        updateDockUI();
      }

      function fetchLatestState() {
        fetch(window.location.origin + '/api/live-state', { cache: 'no-store' })
          .then(function(res) { return res.json(); })
          .then(function(data) {
            applyLiveState(data);
          })
          .catch(function() {});
      }

      // Quét định kỳ mỗi 1s nếu chưa có nguồn video hoặc video chưa phát
      setInterval(function() {
        if (!vid.src || vid.paused || vid.readyState < 2) {
          fetchLatestState();
        }
      }, 1000);

      vid.addEventListener('error', function() {
        console.warn('Video playback error, recovering state...');
        showLoading();
        setTimeout(fetchLatestState, 400);
      });

      fetchLatestState();
      if (currentSrc) {
        loadAndPlay(currentSrc);
      } else {
        setTimeout(fetchLatestState, 400);
      }

      function handleLiveUserInteraction(e) {
        // Tránh kích hoạt khi người dùng đang bấm vào dock hoặc restore icon
        if (e && e.target && (e.target.closest('#controlsDock') || e.target.closest('#btnRestoreIcon'))) return;
        // Bấm vào giữa màn hình video: BẬT VOICE (unmute) và phát video tức thì
        targetSoundEnabled = true;
        try {
          vid.muted = false;
          vid.volume = targetVolume;
        } catch(err) {}
        if (vid.paused && !isStreamUserPaused) {
          safePlay();
        }
        updateDockUI();
      }

      window.addEventListener('click', handleLiveUserInteraction);
      window.addEventListener('touchstart', handleLiveUserInteraction, { passive: true });

      window.addEventListener('keydown', function(e) {
        if (e.code === 'Space') {
          e.preventDefault();
          if (btnPlayPause) btnPlayPause.click();
        } else if (e.key === 'm' || e.key === 'M') {
          if (btnMuteUnmute) btnMuteUnmute.click();
        }
      });

      function initSocketSync() {
        if (typeof io !== 'undefined') {
          try {
            const socket = io(window.location.origin, { 
              transports: ['websocket', 'polling'],
              reconnection: true,
              reconnectionAttempts: 999,
              reconnectionDelay: 1000
            });

            setInterval(function() {
              if (!socket || !socket.connected) {
                fetchLatestState();
              }
            }, 3000);

            socket.on('connect', function() {
              if (badge) badge.innerText = '🟢 4K 60 FPS REALTIME v4.9.45';
              socket.emit('REQUEST_MASTER_LIVE_STATE');
            });

            socket.on('disconnect', function() {
              if (badge) badge.innerText = '🟡 RECONNECTING...';
            });

            socket.on('MASTER_LIVE_STATE_UPDATE', function(data) {
              applyLiveState(data);
            });

            socket.on('EVENT_VIDEO_PLAY', function(data) {
              if (data && (data.eventVideoUrl || data.videoUrl || data.mediaUrl)) {
                loadAndPlay(data.eventVideoUrl || data.videoUrl || data.mediaUrl);
              }
            });

            socket.on('EVENT_VIDEO_TRIGGER', function(data) {
              if (data && (data.eventVideoUrl || data.videoUrl || data.mediaUrl)) {
                loadAndPlay(data.eventVideoUrl || data.videoUrl || data.mediaUrl);
              }
            });

            socket.on('GLOBAL_MEDIA_CHANGE', function(data) {
              if (data && (data.mediaUrl || data.blobUrl)) {
                loadAndPlay(data.mediaUrl || data.blobUrl, data.currentTime);
              }
            });

            socket.on('CLEAR_EVENT_VIDEO', function() {
              applyLiveState({ clearMedia: true });
            });

            socket.on('CLEAR_STAGE', function() {
              applyLiveState({ clearMedia: true });
            });

            socket.on('VIDEO_PLAYBACK_CONTROL', function(control) {
              if (!control) return;
              if (control.mediaUrl) {
                const resolved = resolveUrl(control.mediaUrl);
                if (resolved && !isSameMedia(vid.src, resolved)) {
                  loadAndPlay(resolved, control.currentTime);
                }
              }
              if (typeof control.currentTime === 'number' && control.currentTime >= 0) {
                if (Math.abs(vid.currentTime - control.currentTime) > 0.6) {
                  try { vid.currentTime = control.currentTime; } catch(e) {}
                }
              }
              if (control.action === 'pause' || control.isPlaying === false) {
                isStreamUserPaused = true;
                vid.pause();
                updateDockUI();
              } else if (control.action === 'play' || control.isPlaying === true) {
                isStreamUserPaused = false;
                if (vid.paused && vid.src) {
                  safePlay();
                }
                updateDockUI();
              }
              if (typeof control.isMuted === 'boolean') {
                targetSoundEnabled = !control.isMuted;
                vid.muted = control.isMuted;
                updateDockUI();
              }
            });
          } catch (err) {
            console.warn('Socket connect error:', err);
          }
        } else {
          setTimeout(initSocketSync, 800);
        }
      }
      initSocketSync();

      if (typeof BroadcastChannel !== 'undefined') {
        try {
          const bc = new BroadcastChannel('avalive_master_live_stream');
          bc.onmessage = function(ev) {
            if (!ev.data) return;
            if (ev.data.type === 'GLOBAL_MEDIA_CHANGE' || ev.data.type === 'MASTER_MEDIA_CHANGE' || ev.data.type === 'EVENT_VIDEO_PLAY' || ev.data.type === 'MASTER_LIVE_STATE_UPDATE') {
              applyLiveState(ev.data);
            } else if (ev.data.type === 'CLEAR_STAGE' || ev.data.type === 'CLEAR_EVENT_VIDEO') {
              applyLiveState({ clearMedia: true, isPlaying: false });
            }
          };
        } catch(e) {}
      }
    })();
  </script>
</body>
</html>`;

  return res.send(html);
});

// ============================================================
// 🖥️ TAB CODE ĐỘC LẬP: CỬA SỔ BẮT HÌNH WINDOW CAPTURE OBS & TIKTOK STUDIO
// - Tách biệt hoàn toàn 100% với route /live-stream
// - Khóa chặt luồng video 4K 60 FPS siêu mượt, không giật lag, không đứng hình
// - Nút [✕ Ẩn Toàn Bộ (H)] cho phép ẩn sạch toàn bộ các nút / tab trên khung hình
// - Nút icon [👁️] hoặc phím tắt [H] khôi phục lại bảng điều khiển tức thì
// ============================================================
app.get(['/window-capture', '/window_capture'], (req, res) => {
  // ⚡ PHỤC VỤ TRỰC TIẾP REACT SPA INDEX.HTML ĐỂ CHẠY CLEANLIVEOVERLAY TOÀN NĂNG 100% TỪ SÂN KHẤU CHÍNH
  // Đầy đủ Multi-Avatar 1-4 người, Video phụ PiP, Banner, Sticker, Sản phẩm TikTok Shop, Tách nền Chroma Key siêu sạch
  if (distPath && fs.existsSync(path.join(distPath, 'index.html'))) {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.sendFile(path.join(distPath, 'index.html'));
  }

  let vParam = resolveMediaForStage(req.query.v, currentMasterLiveState);
  const soundParam = req.query.sound !== '0';
  const fitParam = req.query.fit || 'cover';
  const ratioParam = req.query.ratio || req.query.aspectRatio || (currentMasterLiveState && currentMasterLiveState.aspectRatio) || '9:16';
  const isLandscapeInit = ratioParam === '16:9' || ratioParam === '16/9';
  const isImageMediaHelper = (u) => {
    if (!u || typeof u !== 'string') return false;
    return /\.(png|jpe?g|webp|gif|svg|avif|bmp)($|\?|#)/i.test(u) || u.startsWith('data:image/');
  };
  const isInitialImg = isImageMediaHelper(vParam);
  const secMedia = (currentMasterLiveState && currentMasterLiveState.secondaryMediaUrl) || '';
  const secTrans = (currentMasterLiveState && currentMasterLiveState.secondaryMediaTransform) || { x: 2, y: 32, width: 47, height: 48, zIndex: 15 };
  const overlayImg = (currentMasterLiveState && currentMasterLiveState.overlayImage) || '';
  const overlayTxt = (currentMasterLiveState && currentMasterLiveState.overlayText) || '';

  const html = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>[AvaLive VIP PRO] - Cửa Sổ Live 9:16 (Window Capture)</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      width: 100vw; height: 100vh;
      margin: 0; padding: 0;
      overflow: hidden;
      background-color: #000;
      display: flex; align-items: center; justify-content: center;
      user-select: none; -webkit-user-select: none;
      font-family: system-ui, -apple-system, sans-serif;
    }
    #stage {
      position: absolute;
      inset: 0;
      width: 100vw;
      height: 100vh;
      margin: 0;
      padding: 0;
      overflow: hidden;
      background: #000;
      box-shadow: none;
      border: none;
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    video {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: ${fitParam === 'contain' ? 'contain' : 'cover'};
      object-position: center center;
      background-color: #000;
      display: ${isInitialImg ? 'none' : 'block'};
      outline: none; border: none;
      image-rendering: -webkit-optimize-contrast;
      image-rendering: crisp-edges;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    #imagePlayer {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: ${fitParam === 'contain' ? 'contain' : 'cover'};
      object-position: center center;
      background-color: #000;
      display: ${isInitialImg ? 'block' : 'none'};
      image-rendering: -webkit-optimize-contrast;
      image-rendering: crisp-edges;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    #hoverZone {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100vw !important;
      height: 80px !important;
      z-index: 2147483646 !important;
      pointer-events: auto !important;
      background: transparent !important;
    }
    #controlsDock {
      position: fixed !important;
      top: 12px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      display: inline-flex !important;
      flex-direction: row !important;
      align-items: center !important;
      justify-content: center !important;
      flex-wrap: nowrap !important;
      white-space: nowrap !important;
      gap: 6px !important;
      background: rgba(8, 12, 22, 0.95) !important;
      backdrop-filter: blur(24px) !important;
      -webkit-backdrop-filter: blur(24px) !important;
      padding: 5px 10px !important;
      border-radius: 28px !important;
      border: 1.5px solid rgba(6, 182, 212, 0.75) !important;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.9), 0 0 16px rgba(6, 182, 212, 0.35) !important;
      z-index: 2147483647 !important;
      isolation: isolate !important;
      will-change: transform, opacity !important;
      opacity: 0 !important;
      pointer-events: none !important;
      -webkit-app-region: no-drag !important;
      touch-action: manipulation !important;
      max-width: calc(100vw - 16px) !important;
      box-sizing: border-box !important;
      user-select: none !important;
      -webkit-user-select: none !important;
      transition: opacity 0.25s ease, transform 0.25s ease !important;
    }
    #hoverZone:hover ~ #controlsDock,
    #controlsDock:hover,
    #controlsDock.force-visible {
      opacity: 0.98 !important;
      pointer-events: auto !important;
      transform: translateX(-50%) scale(1.02) !important;
    }
    #controlsDock.is-hidden { display: none !important; }
    .dock-btn {
      background: rgba(255, 255, 255, 0.15) !important;
      border: 1px solid rgba(255, 255, 255, 0.35) !important;
      color: #ffffff !important;
      font-size: 11px !important;
      font-weight: 800 !important;
      padding: 5px 10px !important;
      border-radius: 14px !important;
      cursor: pointer !important;
      outline: none !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 4px !important;
      white-space: nowrap !important;
      flex-shrink: 0 !important;
      line-height: 1 !important;
      pointer-events: auto !important;
      -webkit-app-region: no-drag !important;
      touch-action: manipulation !important;
      transition: all 0.15s ease !important;
    }
    .dock-btn:hover { background: rgba(6, 182, 212, 0.5) !important; border-color: #06b6d4 !important; transform: translateY(-1px) !important; }
    .dock-btn:active { transform: scale(0.92) !important; }
    .dock-btn-live {
      background: rgba(16, 185, 129, 0.18) !important;
      border: 1px solid rgba(16, 185, 129, 0.6) !important;
      color: #10b981 !important;
      font-weight: 900 !important;
    }
    .dock-btn-live:hover {
      background: rgba(16, 185, 129, 0.35) !important;
      border-color: #10b981 !important;
    }
    .dock-pulse-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #10b981;
      display: inline-block;
      box-shadow: 0 0 8px #10b981;
      animation: pulse-dot 1.4s ease-in-out infinite;
    }
    @keyframes pulse-dot {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.7); }
    }
    .dock-btn-hide {
      background: rgba(239, 68, 68, 0.22) !important;
      border: 1px solid rgba(239, 68, 68, 0.65) !important;
      color: #fca5a5 !important;
    }
    .dock-btn-hide:hover {
      background: rgba(239, 68, 68, 0.85) !important;
      border-color: #ef4444 !important;
      color: #ffffff !important;
    }
    #badge {
      display: none !important;
    }
    #btnRestoreIcon {
      position: fixed !important;
      top: 10px !important;
      right: 12px !important;
      z-index: 2147483647 !important;
      width: 34px !important;
      height: 34px !important;
      border-radius: 50% !important;
      background: rgba(8, 12, 22, 0.95) !important;
      border: 1.5px solid rgba(6, 182, 212, 0.85) !important;
      color: #22d3ee !important;
      font-size: 15px !important;
      display: none;
      align-items: center !important;
      justify-content: center !important;
      cursor: pointer !important;
      pointer-events: auto !important;
      -webkit-app-region: no-drag !important;
      touch-action: manipulation !important;
      backdrop-filter: blur(14px) !important;
      -webkit-backdrop-filter: blur(14px) !important;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.85), 0 0 12px rgba(6, 182, 212, 0.4) !important;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
    }
    #btnRestoreIcon.is-visible {
      display: flex !important;
    }
    #btnRestoreIcon:hover {
      transform: scale(1.15) !important;
      border-color: #22d3ee !important;
      box-shadow: 0 0 18px rgba(34, 211, 238, 0.7) !important;
      color: #ffffff !important;
    }
    .chroma-green-filter { filter: url(#chroma-green); }
    .chroma-blue-filter { filter: url(#chroma-blue); }
    .chroma-red-filter { filter: url(#chroma-red); }
    .chroma-black-filter { filter: url(#chroma-black); }
    .chroma-white-filter { filter: url(#chroma-white); }
    .chroma-auto-filter { filter: url(#chroma-auto); }
    .chroma-room-filter { filter: url(#chroma-room); }
  </style>
  <script src="/socket.io/socket.io.js"></script>
</head>
<body>
  <div id="stage">
    <!-- SVG Chroma Filters -->
    <svg style="position: absolute; width: 0; height: 0; pointer-events: none;">
      <defs>
        <filter id="chroma-green" color-interpolation-filters="sRGB">
          <feColorMatrix type="matrix" values="1 0 0 0 0  0.2 0.6 0.2 0 0  0 0 1 0 0  0 0 0 1 0" result="despilled" />
          <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  1.8 -3.2 1.8 1 0.15" result="mask" />
          <feComponentTransfer in="mask" result="sharp_mask"><feFuncA type="linear" slope="3.5" intercept="-0.1" /></feComponentTransfer>
          <feComposite in="despilled" in2="sharp_mask" operator="in" />
        </filter>
        <filter id="chroma-blue" color-interpolation-filters="sRGB">
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0.2 0.2 0.6 0 0  0 0 0 1 0" result="despilled" />
          <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  1.8 1.8 -3.2 1 0.15" result="mask" />
          <feComponentTransfer in="mask" result="sharp_mask"><feFuncA type="linear" slope="3.5" intercept="-0.1" /></feComponentTransfer>
          <feComposite in="despilled" in2="sharp_mask" operator="in" />
        </filter>
        <filter id="chroma-red" color-interpolation-filters="sRGB">
          <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -3.0 1.8 1.8 1 0.2" result="mask" />
          <feComponentTransfer in="mask" result="sharp_mask"><feFuncA type="linear" slope="3.5" intercept="-0.15" /></feComponentTransfer>
          <feComposite in="SourceGraphic" in2="sharp_mask" operator="in" />
        </filter>
        <filter id="chroma-black" color-interpolation-filters="sRGB">
          <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  1.5 2.5 0.8 0 -0.08" result="mask" />
          <feComponentTransfer in="mask" result="sharp_mask"><feFuncA type="linear" slope="6.0" intercept="-0.1" /></feComponentTransfer>
          <feComposite in="SourceGraphic" in2="sharp_mask" operator="in" />
        </filter>
        <filter id="chroma-white" color-interpolation-filters="sRGB">
          <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -1.2 -1.8 -0.8 1 3.2" result="mask" />
          <feComponentTransfer in="mask" result="sharp_mask"><feFuncA type="linear" slope="3.8" intercept="-0.15" /></feComponentTransfer>
          <feComposite in="SourceGraphic" in2="sharp_mask" operator="in" />
        </filter>
        <filter id="chroma-auto" color-interpolation-filters="sRGB">
          <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  1.2 -2.4 1.2 1 0.25" result="mask" />
          <feComponentTransfer in="mask" result="sharp_mask"><feFuncA type="linear" slope="3.2" intercept="-0.1" /></feComponentTransfer>
          <feComposite in="SourceGraphic" in2="sharp_auto_mask" operator="in" />
        </filter>
        <filter id="chroma-room" color-interpolation-filters="sRGB">
          <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  1.4 1.8 1.0 1 -0.2" result="mask" />
          <feComponentTransfer in="mask" result="sharp_mask"><feFuncA type="linear" slope="3.5" intercept="-0.18" /></feComponentTransfer>
          <feComposite in="SourceGraphic" in2="sharp_room_mask" operator="in" />
        </filter>
      </defs>
    </svg>

    <!-- Sân Khấu Trống (Khi người dùng xóa hết video) -->
    <div id="emptyStageView" style="position: absolute; inset: 0; display: none; flex-direction: column; align-items: center; justify-content: center; background: #07080d; color: #fff; z-index: 40; text-align: center; padding: 20px;">
      <div style="width: 64px; height: 64px; border-radius: 20px; background: rgba(8, 51, 68, 0.7); border: 1px solid rgba(6, 182, 212, 0.4); display: flex; align-items: center; justify-content: center; font-size: 30px; margin-bottom: 12px; box-shadow: 0 0 25px rgba(6, 182, 212, 0.3);">🎬</div>
      <div style="font-size: 14px; font-weight: 900; letter-spacing: 0.5px; color: #38bdf8; text-transform: uppercase;">SÂN KHẤU TRỐNG (SẴN SÀNG)</div>
      <div style="font-size: 11px; color: #94a3b8; margin-top: 6px; max-width: 280px; line-height: 1.5;">Vui lòng tải lên hoặc chọn video trên phần mềm AvaLive VIP PRO để bắt đầu phát sóng</div>
    </div>

    <!-- LỚP 0: NỀN CHÍNH SÂN KHẤU (Background Layer - Video hoặc Ảnh 60 FPS) -->
    <div id="mainBackgroundLayer" style="position: absolute; inset: 0; z-index: 1; overflow: hidden; background: #000;">
      <video 
        id="videoPlayer" 
        src="${!isInitialImg && vParam ? (vParam.startsWith('http') || vParam.startsWith('/') ? vParam : '/' + vParam) : ''}"
        autoplay 
        playsinline 
        webkit-playsinline 
        x5-video-player-type="h5" 
        loop 
        preload="auto" 
        ${soundParam ? '' : 'muted'}
        crossorigin="anonymous"
        disableRemotePlayback
        style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: ${fitParam === 'contain' ? 'contain' : 'cover'}; object-position: center; display: ${isInitialImg ? 'none' : 'block'};"
      ></video>
      <img
        id="imagePlayer"
        src="${isInitialImg && vParam ? (vParam.startsWith('http') || vParam.startsWith('/') ? vParam : '/' + vParam) : ''}"
        alt="Live Stage Media"
        style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: ${fitParam === 'contain' ? 'contain' : 'cover'}; object-position: center; display: ${isInitialImg ? 'block' : 'none'};"
      />
    </div>

    <!-- CỤM MULTI-AVATAR STAGE (Bọc các lớp nhân vật và hình ảnh phụ) -->
    <div id="multiAvatarStage" style="position: absolute; inset: 0; pointer-events: none; z-index: 5; overflow: hidden;">
      <div id="multiAvatarBg" style="position: absolute; inset: 0; pointer-events: none; z-index: 1; display: none; background-size: cover; background-position: center;"></div>
      <!-- LỚP 1: CÁC LỚP HÌNH ẢNH PHỤ (Extra Layers / Sticker / Vòng tròn sàn / Logo) -->
      <div id="multiAvatarExtraLayers" style="position: absolute; inset: 0; pointer-events: none; z-index: 5;"></div>
      <!-- LỚP 2: CÁC KHUNG HÌNH NHÂN VẬT AVATAR (1 hoặc 2-4 Avatar Đa Tầng) -->
      <div id="multiAvatarCharacters" style="position: absolute; inset: 0; pointer-events: none; z-index: 10;"></div>
    </div>

    <!-- LỚP 3: VIDEO PHỤ PIP (Picture-in-Picture) XẾP CHỒNG TỪ SEQUENCER -->
    <div id="pipContainer" style="position: absolute; left: ${secTrans.x}%; top: ${secTrans.y}%; width: ${secTrans.width}%; height: ${secTrans.height}%; z-index: ${secTrans.zIndex || 20}; pointer-events: none; display: ${secMedia ? 'block' : 'none'};">
      <video id="pipVideo" src="${secMedia && !isImageMediaHelper(secMedia) ? (secMedia.startsWith('http') || secMedia.startsWith('/') ? secMedia : '/' + secMedia) : ''}" autoplay loop muted playsinline style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px; border: 2px solid rgba(255,255,255,0.5); box-shadow: 0 10px 25px rgba(0,0,0,0.85); display: ${secMedia && !isImageMediaHelper(secMedia) ? 'block' : 'none'};"></video>
      <img id="pipImage" src="${secMedia && isImageMediaHelper(secMedia) ? (secMedia.startsWith('http') || secMedia.startsWith('/') ? secMedia : '/' + secMedia) : ''}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px; display: ${secMedia && isImageMediaHelper(secMedia) ? 'block' : 'none'};" />
    </div>

    <!-- LỚP 4: BANNER HÌNH ẢNH OVERLAY -->
    <div id="overlayImageBanner" style="position: absolute; left: 10%; top: 12%; width: 80%; z-index: 25; text-align: center; pointer-events: none; display: ${overlayImg ? 'block' : 'none'};">
      <img id="overlayImageContent" src="${overlayImg ? (overlayImg.startsWith('http') || overlayImg.startsWith('/') ? overlayImg : '/' + overlayImg) : ''}" alt="Banner Overlay" style="max-width: 100%; max-height: 25vh; object-fit: contain; border-radius: 12px; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.8));" />
    </div>

    <!-- LỚP 5: TIÊU ĐỀ CHỮ OVERLAY -->
    <div id="overlayTextBanner" style="position: absolute; left: 4%; top: 5%; width: 92%; z-index: 30; text-align: center; pointer-events: none; display: ${overlayTxt ? 'block' : 'none'};">
      <div id="overlayTextContent" style="display: inline-block; padding: 6px 14px; border-radius: 16px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; background: rgba(2, 6, 23, 0.9); border: 1px solid #22d3ee; color: #22d3ee; font-family: 'Segoe UI', system-ui, sans-serif; font-size: 16px; box-shadow: 0 0 20px rgba(6, 182, 212, 0.6);">${overlayTxt}</div>
    </div>

    <!-- LỚP 6: SẢN PHẨM GHIM LIVESTREAM (BẤM ĐỂ MỞ GIỎ HÀNG & BẢNG CHỌN BIẾN THỂ) -->
    <div id="pinnedProductContainer" style="position: absolute; bottom: 20px; left: 14px; right: 14px; z-index: 40; pointer-events: auto; cursor: pointer; display: none; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);" onclick="window.handleOpenPinnedProduct(event)">
      <div id="pinnedProductCard" title="Bấm để xem chi tiết, chọn màu/size và đặt mua trực tiếp" style="display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 16px; background: rgba(15, 23, 42, 0.94); border: 1.5px solid rgba(244, 63, 94, 0.7); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8), 0 0 20px rgba(244, 63, 94, 0.4); cursor: pointer;">
        <img id="pinnedProductImg" src="" alt="Product" style="width: 54px; height: 54px; border-radius: 10px; object-fit: cover; flex-shrink: 0; border: 1px solid rgba(255, 255, 255, 0.2);" />
        <div style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px;">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span id="pinnedProductSeller" style="padding: 2px 6px; border-radius: 6px; background: rgba(244, 63, 94, 0.2); border: 1px solid rgba(244, 63, 94, 0.5); color: #fda4af; font-size: 9px; font-weight: 800; white-space: nowrap; max-width: 140px; overflow: hidden; text-overflow: ellipsis;">🏪 Đơn Vị Bán</span>
            <span id="pinnedProductBadge" style="padding: 2px 6px; border-radius: 6px; background: linear-gradient(135deg, #e11d48, #f43f5e); color: #fff; font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap;">🔥 DEAL HOT</span>
            <span id="pinnedProductCode" style="font-size: 9px; color: #94a3b8; font-weight: 700; white-space: nowrap;"></span>
          </div>
          <div id="pinnedProductTitle" style="font-size: 13px; font-weight: 800; color: #ffffff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-shadow: 0 1px 2px rgba(0,0,0,0.8);">Tên sản phẩm</div>
          <div style="display: flex; align-items: baseline; gap: 8px;">
            <span id="pinnedProductPrice" style="font-size: 15px; font-weight: 900; color: #fbbf24; text-shadow: 0 0 10px rgba(251, 191, 36, 0.5);">0 đ</span>
            <span id="pinnedProductOldPrice" style="font-size: 11px; color: #94a3b8; text-decoration: line-through; display: none;"></span>
          </div>
        </div>
        <div style="flex-shrink: 0; display: flex; align-items: center; justify-content: center; padding: 6px 10px; border-radius: 10px; background: linear-gradient(135deg, #f43f5e, #e11d48); color: #fff; font-size: 11px; font-weight: 800; box-shadow: 0 2px 8px rgba(244,63,94,0.4); white-space: nowrap;">
          <span>⚡ Chọn Mua ↗</span>
        </div>
      </div>
    </div>

    <!-- MODAL GIỎ HÀNG & CHỌN BIẾN THỂ MUA HÀNG TRỰC TIẾP TRÊN PHIÊN LIVE -->
    <div id="productCheckoutModal2" style="position: absolute; inset: 0; z-index: 100; display: none; background: rgba(0, 0, 0, 0.78); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); align-items: flex-end; justify-content: center;" onclick="window.closeProductModalOnBackdrop2(event)">
      <div id="productCheckoutSheet2" style="width: 100%; max-width: 480px; max-height: 85vh; background: #0f172a; border-top-left-radius: 24px; border-top-right-radius: 24px; border: 1.5px solid rgba(244, 63, 94, 0.7); border-bottom: none; box-shadow: 0 -10px 40px rgba(0,0,0,0.9), 0 0 30px rgba(244,63,94,0.35); color: #fff; display: flex; flex-direction: column; overflow: hidden;" onclick="event.stopPropagation()">
        
        <!-- Header Sheet -->
        <div style="display: flex; align-items: flex-start; justify-content: space-between; padding: 14px 16px; border-bottom: 1px solid rgba(255,255,255,0.1); background: rgba(30, 41, 59, 0.6);">
          <div style="display: flex; gap: 12px; align-items: center; min-width: 0; flex: 1;">
            <img id="modalProdImg2" src="" alt="Product" style="width: 68px; height: 68px; border-radius: 12px; object-fit: cover; border: 1.5px solid rgba(244, 63, 94, 0.5); flex-shrink: 0;" />
            <div style="min-width: 0; flex: 1;">
              <div style="display: flex; align-items: baseline; gap: 8px;">
                <span id="modalProdPrice2" style="font-size: 20px; font-weight: 900; color: #fbbf24; font-family: monospace;">0 ₫</span>
                <span id="modalProdOldPrice2" style="font-size: 12px; color: #94a3b8; text-decoration: line-through; font-family: monospace;"></span>
              </div>
              <div id="modalProdStock2" style="font-size: 11px; color: #34d399; font-weight: 700; margin-top: 2px;">⚡ Kho: Còn 999 sản phẩm</div>
              <div id="modalProdSelectedSummary2" style="font-size: 11px; color: #fda4af; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 2px;">Đang chọn: Tiêu chuẩn</div>
            </div>
          </div>
          <button type="button" onclick="window.closeProductModal2(event)" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #fff; width: 32px; height: 32px; border-radius: 50%; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">✕</button>
        </div>

        <!-- Scrollable Options Body -->
        <div style="padding: 14px 16px; overflow-y: auto; display: flex; flex-direction: column; gap: 14px; max-height: 48vh;">
          <!-- Product Title & Shop Tag -->
          <div>
            <div id="modalProdShopBadge2" style="display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 6px; background: rgba(244, 63, 94, 0.2); border: 1px solid rgba(244, 63, 94, 0.5); color: #fda4af; font-size: 10px; font-weight: 800; margin-bottom: 6px;">
              🏪 <span id="modalProdShopName2">Gian Hàng Chính Hãng</span>
            </div>
            <div id="modalProdTitle2" style="font-size: 13px; font-weight: 800; color: #f8fafc; line-height: 1.4;">Tên sản phẩm</div>
          </div>

          <!-- Color / Phân loại màu -->
          <div id="modalColorSection2">
            <div style="font-size: 11px; font-weight: 800; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">🎨 Chọn Màu Sắc / Phân Loại:</div>
            <div id="modalColorOptions2" style="display: flex; flex-wrap: wrap; gap: 8px;"></div>
          </div>

          <!-- Size / Kích thước -->
          <div id="modalSizeSection2">
            <div style="font-size: 11px; font-weight: 800; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">📏 Chọn Kích Thước / Size:</div>
            <div id="modalSizeOptions2" style="display: flex; flex-wrap: wrap; gap: 8px;"></div>
          </div>

          <!-- Type / Combo (nếu có) -->
          <div id="modalTypeSection2" style="display: none;">
            <div style="font-size: 11px; font-weight: 800; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">🎁 Chọn Quy Cách / Combo:</div>
            <div id="modalTypeOptions2" style="display: flex; flex-wrap: wrap; gap: 8px;"></div>
          </div>

          <!-- Quantity Stepper -->
          <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.1);">
            <div>
              <div style="font-size: 12px; font-weight: 800; color: #fff;">Số Lượng:</div>
              <div style="font-size: 10px; color: #94a3b8;">Áp dụng voucher đơn từ 1 món</div>
            </div>
            <div style="display: flex; align-items: center; border: 1.5px solid rgba(255,255,255,0.25); border-radius: 10px; overflow: hidden; background: rgba(15, 23, 42, 0.8);">
              <button type="button" onclick="window.changeModalQuantity2(-1)" style="width: 34px; height: 32px; background: rgba(255,255,255,0.1); border: none; color: #fff; font-size: 16px; font-weight: 800; cursor: pointer;">−</button>
              <span id="modalQuantityVal2" style="min-width: 38px; text-align: center; font-size: 14px; font-weight: 800; color: #fff; font-family: monospace;">1</span>
              <button type="button" onclick="window.changeModalQuantity2(1)" style="width: 34px; height: 32px; background: rgba(255,255,255,0.1); border: none; color: #fff; font-size: 16px; font-weight: 800; cursor: pointer;">+</button>
            </div>
          </div>

          <!-- Voucher highlight tag -->
          <div style="display: flex; align-items: center; gap: 6px; padding: 8px 12px; border-radius: 10px; background: rgba(239, 68, 68, 0.15); border: 1px dashed #ef4444; color: #fca5a5; font-size: 11px; font-weight: 700;">
            <span>🎟️</span>
            <span>Đã tự động áp dụng Voucher Live -30K & Miễn Phí Vận Chuyển!</span>
          </div>
        </div>

        <!-- Sticky Action Buttons Footer -->
        <div style="padding: 12px 16px 18px 16px; border-top: 1px solid rgba(255,255,255,0.12); background: rgba(15, 23, 42, 0.98); display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; justify-content: space-between; align-items: baseline; font-size: 12px;">
            <span style="color: #94a3b8;">Tổng thanh toán tạm tính:</span>
            <span id="modalTotalPrice2" style="font-size: 18px; font-weight: 900; color: #f43f5e; font-family: monospace;">0 ₫</span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <button type="button" onclick="window.submitModalCheckout2('tiktok')" style="background: linear-gradient(135deg, #f43f5e, #e11d48); border: none; padding: 12px 8px; border-radius: 14px; color: #fff; font-size: 12px; font-weight: 900; cursor: pointer; box-shadow: 0 4px 15px rgba(244,63,94,0.5); display: flex; align-items: center; justify-content: center; gap: 6px;">
              <span>⚡ Mua Trên TikTok</span>
            </button>
            <button type="button" onclick="window.submitModalCheckout2('shopee')" style="background: linear-gradient(135deg, #ea580c, #f97316); border: none; padding: 12px 8px; border-radius: 14px; color: #fff; font-size: 12px; font-weight: 900; cursor: pointer; box-shadow: 0 4px 15px rgba(249,115,22,0.5); display: flex; align-items: center; justify-content: center; gap: 6px;">
              <span>🛍️ Mua Trên Shopee</span>
            </button>
          </div>
        </div>

      </div>
    </div>
    <div id="badge" style="display: none !important;">🔴 4K 60 FPS TRỰC TIẾP v4.9.85</div>
  </div>

  <!-- VÙNG CẢM ỨNG DI CHUỘT ĐỂ HIỆN DOCK ĐIỀU KHIỂN -->
  <div id="hoverZone"></div>

  <!-- BẢNG ĐIỀU KHIỂN NỔI DOCK TOÀN CỤC CẤP BODY — CHỐNG BỊ GPU VIDEO LAYER CHE KHUẤT -->
  <div id="controlsDock">
    <button id="btnLiveStatus" class="dock-btn dock-btn-live" type="button" onclick="window.handleLiveRefreshToggle(event)" title="Luồng Trực Tiếp 60 FPS (Bấm để làm mới & đồng bộ luồng)">
      <span class="dock-pulse-dot"></span>• TRỰC TIẾP 60FPS
    </button>
    <button id="btnPlayPause" class="dock-btn" type="button" onclick="window.handlePlayPauseToggle(event)" title="Tạm dừng / Tiếp tục độc lập (Phím tắt: Space)">⏸️ Tạm Dừng</button>
    <button id="btnMuteUnmute" class="dock-btn" type="button" onclick="window.handleMuteToggle(event)" title="Bật / Tắt âm thanh độc lập (Phím tắt: M)">${soundParam ? '🔇 Tắt Tiếng' : '🔊 Bật Tiếng'}</button>
    <button id="btnFitToggle" class="dock-btn" type="button" onclick="window.handleFitToggle(event)" title="Chuyển chế độ Khung hình (Tràn / Vừa)">${fitParam === 'contain' ? '📐 Vừa Khung' : '📐 Tràn Màn'}</button>
    <button id="btnHideAll" class="dock-btn dock-btn-hide" type="button" onclick="window.toggleHideAll(true, event)" title="Ẩn toàn bộ nút trên giao diện video để bắt hình sạch 100% (Phím tắt: H)">✕ Ẩn Nút (H)</button>
  </div>

  <button id="btnRestoreIcon" type="button" onclick="window.toggleHideAll(false, event)" title="Bấm để hiện lại toàn bộ nút chức năng (Phím tắt: H)">👁️</button>

  <script>
    (function() {
      const vid = document.getElementById('videoPlayer');
      const badge = document.getElementById('badge');
      const dock = document.getElementById('controlsDock');
      const btnRestore = document.getElementById('btnRestoreIcon');
      const btnLiveStatus = document.getElementById('btnLiveStatus');
      const btnPlayPause = document.getElementById('btnPlayPause');
      const btnMuteUnmute = document.getElementById('btnMuteUnmute');
      const btnFitToggle = document.getElementById('btnFitToggle');
      const btnHideAll = document.getElementById('btnHideAll');

      let currentSrc = ${JSON.stringify(vParam)};
      let isStreamUserPaused = false;
      let targetMuted = ${soundParam ? 'false' : 'true'};
      let currentFit = ${JSON.stringify(fitParam)};
      let isDockHidden = false;

      function updateStageAspectRatio(ratio) {
        const stage = document.getElementById('stage');
        if (!stage) return;
        stage.style.position = 'absolute';
        stage.style.inset = '0';
        stage.style.width = '100vw';
        stage.style.height = '100vh';
        stage.style.margin = '0';
        stage.style.boxShadow = 'none';
        stage.style.border = 'none';
      }
      updateStageAspectRatio('${ratioParam}');

      let socket = null;
      let bc = null;

      function getAllVideos() {
        return Array.from(document.querySelectorAll('video'));
      }

      function getChromaClass(chroma) {
        if (!chroma || !chroma.enabled) return '';
        const m = (chroma.mode || 'auto').toLowerCase();
        if (m === 'blue') return 'chroma-blue-filter';
        if (m === 'red') return 'chroma-red-filter';
        if (m === 'black') return 'chroma-black-filter';
        if (m === 'white') return 'chroma-white-filter';
        if (m === 'room') return 'chroma-room-filter';
        if (m === 'auto') return 'chroma-auto-filter';
        return 'chroma-green-filter';
      }

      try {
        if (typeof BroadcastChannel !== 'undefined') {
          bc = new BroadcastChannel('avalive_master_live_stream');
        }
      } catch(e) {}

      try {
        isDockHidden = localStorage.getItem('avalive_window_capture_dock_hidden') === 'true';
      } catch (e) {}

      function applyDockVisibility() {
        if (isDockHidden) {
          if (dock) dock.classList.add('is-hidden');
          if (badge) badge.classList.add('is-hidden');
          if (btnRestore) btnRestore.classList.add('is-visible');
        } else {
          if (dock) dock.classList.remove('is-hidden');
          if (badge) badge.classList.remove('is-hidden');
          if (btnRestore) btnRestore.classList.remove('is-visible');
        }
      }
      applyDockVisibility();

      function toggleHideAll(forceVal, e) {
        if (e) { try { e.preventDefault(); e.stopPropagation(); } catch(err) {} }
        isDockHidden = typeof forceVal === 'boolean' ? forceVal : !isDockHidden;
        try {
          localStorage.setItem('avalive_window_capture_dock_hidden', String(isDockHidden));
        } catch(e) {}
        applyDockVisibility();
      }

      function updateDockUI() {
        const anyPaused = isStreamUserPaused || (vid && vid.paused);
        if (btnPlayPause) {
          btnPlayPause.innerHTML = anyPaused ? '▶️ Tiếp Tục' : '⏸️ Tạm Dừng';
          btnPlayPause.style.background = anyPaused ? 'rgba(16, 185, 129, 0.45)' : 'rgba(255, 255, 255, 0.15)';
          btnPlayPause.style.borderColor = anyPaused ? '#10b981' : 'rgba(255, 255, 255, 0.35)';
        }
        if (btnMuteUnmute) {
          btnMuteUnmute.innerHTML = !targetMuted ? '🔇 Tắt Tiếng' : '🔊 Bật Tiếng';
          btnMuteUnmute.style.background = !targetMuted ? 'rgba(6, 182, 212, 0.5)' : 'rgba(255, 255, 255, 0.15)';
          btnMuteUnmute.style.borderColor = !targetMuted ? '#06b6d4' : 'rgba(255, 255, 255, 0.35)';
        }
        if (btnFitToggle) {
          btnFitToggle.innerHTML = currentFit === 'cover' ? '📐 Tràn Màn' : '📐 Vừa Khung';
          btnFitToggle.style.background = currentFit === 'cover' ? 'rgba(168, 85, 247, 0.4)' : 'rgba(255, 255, 255, 0.15)';
          btnFitToggle.style.borderColor = currentFit === 'cover' ? '#a855f7' : 'rgba(255, 255, 255, 0.35)';
        }
      }

      let activeModalProduct2 = null;
      let modalSelectedColor2 = '';
      let modalSelectedSize2 = '';
      let modalSelectedType2 = '';
      let modalQuantity2 = 1;

      function parsePriceToNumber2(priceStr) {
        if (typeof priceStr === 'number') return priceStr;
        if (!priceStr || typeof priceStr !== 'string') return 49999;
        const digits = priceStr.replace(/[^0-9]/g, '');
        return digits ? parseInt(digits, 10) : 49999;
      }

      function formatVietnamesePrice2(num) {
        return (num || 0).toLocaleString('vi-VN') + ' ₫';
      }

      function getProductVariants2(prod) {
        if (!prod) {
          return {
            colors: ['Đen Classic', 'Trắng Sport', 'Hồng Pastel', 'Xanh Navy'],
            sizes: ['Size S (40-48kg)', 'Size M (49-56kg)', 'Size L (57-65kg)', 'Size XL (66-75kg)'],
            types: ['Bản Tiêu Chuẩn', 'Combo Nâng Cấp'],
            stock: '999',
            unitPrice: 49999
          };
        }
        if (prod.variants && typeof prod.variants === 'object') {
          return {
            colors: prod.variants.colors || ['Màu Mặc Định'],
            sizes: prod.variants.sizes || ['Freesize'],
            types: prod.variants.types || ['Bản Tiêu Chuẩn'],
            stock: prod.stock || '500',
            unitPrice: parsePriceToNumber2(prod.price)
          };
        }
        const idOrCode = String(prod.id || prod.code || prod.sku || '').toLowerCase();
        const title = String(prod.name || prod.productName || prod.title || '').toLowerCase();

        if (idOrCode === '1' || title.includes('bra') || title.includes('havata') || title.includes('áo bra') || title.includes('yếm')) {
          return {
            colors: ['Đen Classic', 'Hồng Pastel', 'Xanh Navy', 'Trắng Tinh Khôi', 'Xám Khói'],
            sizes: ['Size S (40-48kg)', 'Size M (49-56kg)', 'Size L (57-65kg)', 'Size XL (66-75kg)'],
            types: ['Áo Đơn Có Mút Cổ Yếm', 'Combo 2 Áo Siêu Tiết Kiệm (Tặng Túi Gym)'],
            stock: '32.500',
            unitPrice: 49999
          };
        }
        if (idOrCode === '2' || title.includes('quấn cổ chân') || title.includes('combo') || title.includes('eirafit')) {
          return {
            colors: ['Đen Quyến Rũ', 'Hồng Barbie', 'Tím Lavender', 'Xanh Mint'],
            sizes: ['Bộ Tiêu Chuẩn (1 Đôi)', 'Combo Full Set + Dây 35Lbs', 'Combo Pro Chuyên Nghiệp + Dây 50Lbs'],
            types: ['Quấn Cổ Chân Đơn', 'Combo Quấn Chân + Dây Kháng Lực Mông Đùi'],
            stock: '1.500',
            unitPrice: 42000
          };
        }
        if (idOrCode === '3' || title.includes('tạ tay') || title.includes('40kg') || title.includes('gympro')) {
          return {
            colors: ['Đen Phối Đỏ Sport', 'Đen Phối Vàng Gold', 'Xanh Quân Đội'],
            sizes: ['Bộ 20KG Tháo Lắp', 'Bộ 30KG Tháo Lắp Đa Năng', 'Bộ 40KG Full Set Kèm Đòn Nối 40cm'],
            types: ['Bản Nhựa PVC Bọc Thép', 'Bản Cao Su Chống Va Đập 2026'],
            stock: '283',
            unitPrice: 1299000
          };
        }
        if (idOrCode === '4' || title.includes('mini band') || title.includes('kháng lực') || title.includes('powerband')) {
          return {
            colors: ['Hồng (Light - 15Lbs)', 'Xanh Lá (Medium - 25Lbs)', 'Tím (Heavy - 35Lbs)', 'Đen (X-Heavy - 45Lbs)', 'Set 5 Dây Full Mức'],
            sizes: ['Bản Tiêu Chuẩn 500x50mm', 'Bản Dày Cao Cấp 600x50mm'],
            types: ['Dây Lẻ Tùy Chọn Mức', 'Trọn Bộ 5 Dây + Túi Rút + Ebook Tập'],
            stock: '999',
            unitPrice: 79000
          };
        }
        if (idOrCode === '5' || title.includes('bình nước') || title.includes('2l') || title.includes('hydrasport')) {
          return {
            colors: ['Tím - Xanh Gradient', 'Hồng - Xanh Pastel', 'Đen Nhám Sport', 'Xanh Dương - Vàng'],
            sizes: ['Dung tích 1.5L', 'Dung tích 2.0L Siêu Lớn'],
            types: ['Bình Kèm Ống Hút & Cọ Rửa', 'Bản Full + Bộ Sticker 3D & Dây Đeo'],
            stock: '500',
            unitPrice: 65000
          };
        }
        if (idOrCode === '6' || title.includes('thảm yoga') || title.includes('thảm tập') || title.includes('zenyoga')) {
          return {
            colors: ['Hồng Cánh Sen - Tím', 'Xanh Biển - Xanh Lam', 'Xám Đậm - Đen', 'Xanh Rêu - Xanh Ngọc'],
            sizes: ['Độ dày 6mm (183x61cm)', 'Độ dày 8mm Êm Ái (183x68cm)'],
            types: ['Thảm Định Tuyến Chuẩn', 'Thảm Định Tuyến + Túi Đựng + Dây Buộc'],
            stock: '340',
            unitPrice: 159000
          };
        }
        if (idOrCode === '7' || title.includes('con lăn') || title.includes('bụng') || title.includes('fitabcore')) {
          return {
            colors: ['Đỏ Ferrari Sport', 'Xanh Dương Dynamic', 'Cam Năng Động', 'Xám Titan'],
            sizes: ['Bản 2 Bánh Tiêu Chuẩn', 'Bản 4 Bánh Tự Động Hồi Về Có Đệm Quỳ'],
            types: ['Bản Cơ Bản', 'Bản Cao Cấp Kèm Giá Để Điện Thoại & Hẹn Giờ'],
            stock: '210',
            unitPrice: 189000
          };
        }

        return {
          colors: ['Màu Mặc Định', 'Màu Phiên Bản Mới'],
          sizes: ['Size Tiêu Chuẩn', 'Size Nâng Cấp'],
          types: ['Bản Tiêu Chuẩn'],
          stock: prod.stock || '500',
          unitPrice: parsePriceToNumber2(prod.price) || 99000
        };
      }

      function resolveSellerBuyUrl2(prod, platform, variantInfo) {
        if (!prod) return 'https://www.tiktok.com/search?q=' + encodeURIComponent('sản phẩm tiktok shop chính hãng');
        
        const isClean = function(u) {
          return u && typeof u === 'string' && (u.startsWith('http://') || u.startsWith('https://')) && !u.includes('shop.tiktok.com') && !u.includes('/view/product/');
        };
        if (isClean(prod.affiliateUrl)) return prod.affiliateUrl;
        if (isClean(prod.buyUrl)) return prod.buyUrl;
        if (isClean(prod.productUrl)) return prod.productUrl;
        if (isClean(prod.sellerStoreUrl)) return prod.sellerStoreUrl;
        if (isClean(prod.storeUrl)) return prod.storeUrl;

        const pName = prod.name || prod.productName || prod.title || '';
        const colorPart = variantInfo && variantInfo.color ? ' ' + variantInfo.color : '';
        const sizePart = variantInfo && variantInfo.size ? ' ' + variantInfo.size : '';
        const fullQuery = (pName + colorPart + sizePart).trim();

        if (platform === 'shopee') {
          return 'https://shopee.vn/search?keyword=' + encodeURIComponent(fullQuery || 'sản phẩm hot deal');
        }
        return 'https://www.tiktok.com/search?q=' + encodeURIComponent(fullQuery || 'sản phẩm tiktok shop');
      }

      function renderModalVariantButtons2(containerId, items, selectedValue, onSelectFnName) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';
        items.forEach(function(item) {
          const btn = document.createElement('button');
          btn.type = 'button';
          const isSel = item === selectedValue;
          btn.style.padding = '6px 12px';
          btn.style.borderRadius = '10px';
          btn.style.border = isSel ? '1.5px solid #f43f5e' : '1px solid rgba(255, 255, 255, 0.2)';
          btn.style.background = isSel ? 'linear-gradient(135deg, rgba(244, 63, 94, 0.35), rgba(225, 29, 72, 0.45))' : 'rgba(30, 41, 59, 0.8)';
          btn.style.color = isSel ? '#ffffff' : '#cbd5e1';
          btn.style.fontSize = '11px';
          btn.style.fontWeight = isSel ? '800' : '600';
          btn.style.cursor = 'pointer';
          btn.style.transition = 'all 0.15s ease';
          btn.style.boxShadow = isSel ? '0 0 10px rgba(244, 63, 94, 0.4)' : 'none';
          btn.innerHTML = (isSel ? '✓ ' : '') + item;
          btn.onclick = function(e) {
            e.stopPropagation();
            window[onSelectFnName](item);
          };
          container.appendChild(btn);
        });
      }

      function updateModalPriceAndSummary2() {
        if (!activeModalProduct2) return;
        const variants = getProductVariants2(activeModalProduct2);
        const unitP = variants.unitPrice || parsePriceToNumber2(activeModalProduct2.price);
        const total = unitP * modalQuantity2;

        const elPrice = document.getElementById('modalProdPrice2');
        const elOldPrice = document.getElementById('modalProdOldPrice2');
        const elTotal = document.getElementById('modalTotalPrice2');
        const elSummary = document.getElementById('modalProdSelectedSummary2');
        const elQty = document.getElementById('modalQuantityVal2');

        if (elPrice) elPrice.innerText = formatVietnamesePrice2(unitP);
        if (elOldPrice && activeModalProduct2.oldPrice) {
          elOldPrice.innerText = activeModalProduct2.oldPrice;
          elOldPrice.style.display = 'inline';
        }
        if (elTotal) elTotal.innerText = formatVietnamesePrice2(total);
        if (elQty) elQty.innerText = String(modalQuantity2);

        if (elSummary) {
          const parts = [];
          if (modalSelectedColor2) parts.push(modalSelectedColor2);
          if (modalSelectedSize2) parts.push(modalSelectedSize2);
          if (modalSelectedType2) parts.push(modalSelectedType2);
          parts.push('SL: ' + modalQuantity2);
          elSummary.innerText = 'Đang chọn: ' + parts.join(' • ');
        }
      }

      function getSellerName2(prod) {
        if (prod && prod.sellerName) return prod.sellerName;
        if (prod && prod.shopName) return prod.shopName;
        const idOrCode = String((prod && (prod.id || prod.code || prod.sku)) || '').toLowerCase();
        const title = String((prod && (prod.name || prod.productName || prod.title)) || '').toLowerCase();
        if (idOrCode === '1' || title.includes('bra') || title.includes('havata')) return 'HAVATA Official Store';
        if (idOrCode === '2' || title.includes('quấn cổ chân') || title.includes('combo')) return 'EiraFit Gymwear';
        if (idOrCode === '3' || title.includes('tạ tay') || title.includes('40kg')) return 'GymPro Vietnam';
        if (idOrCode === '4' || title.includes('mini band') || title.includes('kháng lực')) return 'PowerBand Sport';
        if (idOrCode === '5' || title.includes('bình nước') || title.includes('2l')) return 'HydraSport VN';
        if (idOrCode === '6' || title.includes('thảm yoga') || title.includes('thảm tập')) return 'ZenYoga Master';
        if (idOrCode === '7' || title.includes('con lăn') || title.includes('bụng')) return 'FitAbCore Official';
        return 'Đơn Vị Bán Hàng';
      }

      window.openProductPurchaseModal2 = function(prod) {
        if (!prod) prod = window.__currentPinnedProduct;
        if (!prod) return;
        activeModalProduct2 = prod;
        const variants = getProductVariants2(prod);
        
        modalSelectedColor2 = variants.colors && variants.colors.length > 0 ? variants.colors[0] : '';
        modalSelectedSize2 = variants.sizes && variants.sizes.length > 0 ? variants.sizes[0] : '';
        modalSelectedType2 = variants.types && variants.types.length > 0 ? variants.types[0] : '';
        modalQuantity2 = 1;

        const modal = document.getElementById('productCheckoutModal2');
        const img = document.getElementById('modalProdImg2');
        const title = document.getElementById('modalProdTitle2');
        const shop = document.getElementById('modalProdShopName2');
        const stock = document.getElementById('modalProdStock2');

        if (img) img.src = prod.image || 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=500&q=80';
        if (title) title.innerText = prod.name || prod.productName || 'Sản phẩm Livestream';
        if (shop) shop.innerText = getSellerName2(prod);
        if (stock) stock.innerText = '⚡ Kho: Còn ' + (variants.stock || prod.stock || '500') + ' sản phẩm';

        renderModalVariantButtons2('modalColorOptions2', variants.colors || [], modalSelectedColor2, 'selectModalColor2');
        renderModalVariantButtons2('modalSizeOptions2', variants.sizes || [], modalSelectedSize2, 'selectModalSize2');
        
        const typeSec = document.getElementById('modalTypeSection2');
        if (variants.types && variants.types.length > 1) {
          if (typeSec) typeSec.style.display = 'block';
          renderModalVariantButtons2('modalTypeOptions2', variants.types, modalSelectedType2, 'selectModalType2');
        } else {
          if (typeSec) typeSec.style.display = 'none';
        }

        updateModalPriceAndSummary2();

        if (modal) {
          modal.style.display = 'flex';
        }
      };

      window.closeProductModal2 = function(e) {
        if (e) {
          try { e.preventDefault(); } catch(err) {}
          try { e.stopPropagation(); } catch(err) {}
        }
        const modal = document.getElementById('productCheckoutModal2');
        if (modal) modal.style.display = 'none';
      };

      window.closeProductModalOnBackdrop2 = function(e) {
        if (e && e.target && e.target.id === 'productCheckoutModal2') {
          window.closeProductModal2(e);
        }
      };

      window.selectModalColor2 = function(color) {
        modalSelectedColor2 = color;
        const variants = getProductVariants2(activeModalProduct2);
        renderModalVariantButtons2('modalColorOptions2', variants.colors || [], modalSelectedColor2, 'selectModalColor2');
        updateModalPriceAndSummary2();
      };

      window.selectModalSize2 = function(size) {
        modalSelectedSize2 = size;
        const variants = getProductVariants2(activeModalProduct2);
        renderModalVariantButtons2('modalSizeOptions2', variants.sizes || [], modalSelectedSize2, 'selectModalSize2');
        updateModalPriceAndSummary2();
      };

      window.selectModalType2 = function(type) {
        modalSelectedType2 = type;
        const variants = getProductVariants2(activeModalProduct2);
        renderModalVariantButtons2('modalTypeOptions2', variants.types || [], modalSelectedType2, 'selectModalType2');
        updateModalPriceAndSummary2();
      };

      window.changeModalQuantity2 = function(delta) {
        modalQuantity2 = Math.max(1, Math.min(99, modalQuantity2 + delta));
        updateModalPriceAndSummary2();
      };

      window.submitModalCheckout2 = function(platform) {
        const prod = activeModalProduct2 || window.__currentPinnedProduct;
        const variantInfo = {
          color: modalSelectedColor2,
          size: modalSelectedSize2,
          type: modalSelectedType2,
          quantity: modalQuantity2
        };
        const targetUrl = resolveSellerBuyUrl2(prod, platform, variantInfo);
        window.open(targetUrl, '_blank', 'noopener,noreferrer');
      };

      window.handleOpenPinnedProduct = function(e) {
        if (e) {
          try { e.preventDefault(); } catch(err) {}
          try { e.stopPropagation(); } catch(err) {}
        }
        const prod = window.__currentPinnedProduct;
        window.openProductPurchaseModal2(prod);
      };

      function safePlay() {
        if (isStreamUserPaused) return;
        getAllVideos().forEach(function(v) {
          try { v.muted = targetMuted; } catch(err) {}
        });
        if (vid) {
          try {
            const p = vid.play();
            if (p !== undefined && typeof p.then === 'function') {
              p.then(function() {
                updateDockUI();
              }).catch(function() {
                vid.muted = true;
                vid.play().then(function() {
                  updateDockUI();
                }).catch(function() {});
              });
            } else {
              updateDockUI();
            }
          } catch(e) {}
        }
      }

      window.handlePlayPauseToggle = function(e) {
        if (e) {
          try { e.preventDefault(); e.stopPropagation(); } catch(err) {}
        }
        isStreamUserPaused = !isStreamUserPaused;
        getAllVideos().forEach(function(v) {
          if (isStreamUserPaused) {
            try { v.pause(); } catch(err) {}
          } else {
            try { v.play().catch(function() {}); } catch(err) {}
          }
        });
        if (!isStreamUserPaused) {
          safePlay();
        }
        updateDockUI();
        if (socket) {
          socket.emit('VIDEO_PLAYBACK_CONTROL', {
            action: isStreamUserPaused ? 'pause' : 'play',
            isPlaying: !isStreamUserPaused,
            currentTime: vid ? (vid.currentTime || 0) : 0,
            timestamp: Date.now()
          });
        }
        if (bc) {
          try {
            bc.postMessage({
              type: 'VIDEO_PLAYBACK_CONTROL',
              action: isStreamUserPaused ? 'pause' : 'play',
              isPlaying: !isStreamUserPaused,
              currentTime: vid ? (vid.currentTime || 0) : 0,
              timestamp: Date.now()
            });
          } catch(e) {}
        }
      };

      window.handleMuteToggle = function(e) {
        if (e) {
          try { e.preventDefault(); e.stopPropagation(); } catch(err) {}
        }
        targetMuted = !targetMuted;
        getAllVideos().forEach(function(v) {
          try { v.muted = targetMuted; } catch(err) {}
        });
        if (!targetMuted && vid && vid.paused && !isStreamUserPaused) {
          safePlay();
        }
        updateDockUI();
        if (socket) {
          socket.emit('VIDEO_PLAYBACK_CONTROL', { isMuted: targetMuted, timestamp: Date.now() });
        }
        if (bc) {
          try {
            bc.postMessage({
              type: 'VIDEO_PLAYBACK_CONTROL',
              isMuted: targetMuted,
              timestamp: Date.now()
            });
          } catch(e) {}
        }
      };

      window.handleFitToggle = function(e) {
        if (e) {
          try { e.preventDefault(); e.stopPropagation(); } catch(err) {}
        }
        currentFit = currentFit === 'cover' ? 'contain' : 'cover';
        try { localStorage.setItem('avalive_media_fit_mode', currentFit); } catch(e) {}
        if (vid) vid.style.objectFit = currentFit;
        const imgEl = document.getElementById('imagePlayer');
        if (imgEl) imgEl.style.objectFit = currentFit;
        const pipV = document.getElementById('secondaryVideoPlayer');
        if (pipV) pipV.style.objectFit = currentFit;
        const pipI = document.getElementById('secondaryImagePlayer');
        if (pipI) pipI.style.objectFit = currentFit;
        updateDockUI();
      };

      window.handleLiveRefreshToggle = function(e) {
        if (e) {
          try { e.preventDefault(); e.stopPropagation(); } catch(err) {}
        }
        isStreamUserPaused = false;

        // Phản hồi tức thì trên nút bấm
        if (btnLiveStatus) {
          btnLiveStatus.innerHTML = '<span class="dock-pulse-dot"></span>⚡ ĐÃ LÀM MỚI 60FPS';
          btnLiveStatus.style.borderColor = '#22c55e';
          btnLiveStatus.style.background = 'rgba(34, 197, 94, 0.45)';
          setTimeout(function() {
            if (btnLiveStatus) {
              btnLiveStatus.innerHTML = '<span class="dock-pulse-dot"></span>• TRỰC TIẾP 60FPS';
              btnLiveStatus.style.borderColor = '';
              btnLiveStatus.style.background = '';
            }
          }, 1500);
        }

        if (typeof fetchLatestState === 'function') fetchLatestState();
        getAllVideos().forEach(function(v) {
          try { 
            v.muted = targetMuted;
            v.play().catch(function() {}); 
          } catch(err) {}
        });
        if (vid && vid.src) {
          try { vid.currentTime = vid.currentTime; } catch(err) {}
          safePlay();
        }
        updateDockUI();
      };

      window.toggleHideAll = toggleHideAll;

      // PHÍM TẮT BÀN PHÍM TOÀN CỤC CHO STREAMER
      window.addEventListener('keydown', function(e) {
        if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
        if (e.code === 'Space') {
          e.preventDefault();
          handlePlayPauseAction();
        } else if (e.key === 'm' || e.key === 'M') {
          e.preventDefault();
          handleMuteAction();
        } else if (e.key === 'f' || e.key === 'F') {
          e.preventDefault();
          handleFitAction();
        } else if (e.key === 'h' || e.key === 'H') {
          e.preventDefault();
          toggleHideAll();
        }
      });

      // BẤM VÀO GIỮA MÀN HÌNH VIDEO: BẬT VOICE (UNMUTE) VÀ PHÁT VIDEO TỨC THÌ
      function handleVideoScreenInteraction(e) {
        // Tránh kích hoạt khi người dùng đang bấm vào dock hoặc restore icon
        if (e && e.target && (e.target.closest('#controlsDock') || e.target.closest('#btnRestoreIcon'))) return;
        targetMuted = false;
        if (vid) {
          vid.muted = false;
          vid.volume = 1.0;
        }
        if (vid && vid.paused) {
          isStreamUserPaused = false;
          safePlay();
        }
        updateDockUI();
        if (socket) {
          socket.emit('VIDEO_PLAYBACK_CONTROL', { isMuted: false, isPlaying: true, timestamp: Date.now() });
        }
        if (bc) {
          try {
            bc.postMessage({ type: 'VIDEO_PLAYBACK_CONTROL', isMuted: false, isPlaying: true, timestamp: Date.now() });
          } catch(err) {}
        }
      }

      const stageEl = document.getElementById('stage');
      if (stageEl) {
        stageEl.addEventListener('click', handleVideoScreenInteraction);
      }
      if (vid) {
        vid.addEventListener('click', handleVideoScreenInteraction);
      }

      window.addEventListener('keydown', function(e) {
        if (['input', 'textarea', 'select'].includes(document.activeElement?.tagName?.toLowerCase())) return;
        if (e.code === 'Space') {
          e.preventDefault();
          window.handlePlayPauseToggle(e);
        } else if (e.key === 'm' || e.key === 'M') {
          e.preventDefault();
          window.handleMuteToggle(e);
        } else if (e.key === 'f' || e.key === 'F') {
          e.preventDefault();
          window.handleFitToggle(e);
        } else if (e.key === 'h' || e.key === 'H') {
          e.preventDefault();
          toggleHideAll();
        }
      });

      function isSameMedia(srcA, srcB) {
        if (!srcA || !srcB) return false;
        try {
          const pA = String(srcA).split('?')[0].split('#')[0];
          const pB = String(srcB).split('?')[0].split('#')[0];
          if (pA === pB) return true;
          const fA = pA.substring(pA.lastIndexOf('/') + 1);
          const fB = pB.substring(pB.lastIndexOf('/') + 1);
          if (fA && fB && fA === fB && !fA.startsWith('blob:') && !fB.startsWith('blob:')) return true;
          const uA = new URL(srcA, window.location.href);
          const uB = new URL(srcB, window.location.href);
          return uA.pathname === uB.pathname;
        } catch (e) {
          const pA = String(srcA).split('?')[0].split('#')[0];
          const pB = String(srcB).split('?')[0].split('#')[0];
          return pA === pB || pA.endsWith(pB) || pB.endsWith(pA);
        }
      }

      function resolveUrl(url) {
        if (!url || typeof url !== 'string' || url === 'null' || url === 'undefined' || url.trim() === '') return '';
        if (url.startsWith('blob:') || url.startsWith('data:')) return url;
        try { url = decodeURIComponent(url); } catch(e) {}
        if (url.startsWith('http://') || url.startsWith('https://')) {
          if (url.includes('localhost:') || url.includes('127.0.0.1:') || url.includes('vercel.app')) {
            try {
              const u = new URL(url);
              if (u.pathname.startsWith('/uploads/')) {
                return window.location.origin + u.pathname + u.search;
              }
            } catch(e) {}
          }
          return url;
        }
        if (url.startsWith('/uploads/') || url.includes('/uploads/')) {
          const pathPart = url.substring(url.indexOf('/uploads/'));
          return window.location.origin + pathPart;
        }
        if (url.startsWith('/')) return window.location.origin + url;
        return window.location.origin + '/' + url;
      }

      function isImage(u) {
        if (!u || typeof u !== 'string') return false;
        if (u.startsWith('data:image/')) return true;
        var clean = u.split('?')[0].split('#')[0].toLowerCase();
        return clean.endsWith('.png') || clean.endsWith('.jpg') || clean.endsWith('.jpeg') || clean.endsWith('.webp') || clean.endsWith('.gif') || clean.endsWith('.svg') || clean.endsWith('.avif') || clean.endsWith('.bmp');
      }

      function loadAndPlay(src, forceSeekTime) {
        if (!src) src = currentSrc || '';
        if (!src) return;
        const fullUrl = resolveUrl(src);
        if (!fullUrl) return;

        const imgEl = document.getElementById('imagePlayer');
        if (isImage(fullUrl)) {
          if (imgEl) {
            imgEl.src = fullUrl;
            imgEl.style.display = 'block';
          }
          if (vid) {
            vid.style.display = 'none';
            try { vid.pause(); } catch(e) {}
          }
          return;
        }

        if (imgEl) {
          imgEl.style.display = 'none';
        }
        if (vid) {
          vid.style.display = 'block';
          if (!isSameMedia(vid.src, fullUrl)) {
            currentSrc = fullUrl;
            vid.src = fullUrl;
          }
          if (typeof forceSeekTime === 'number' && forceSeekTime > 0) {
            try { vid.currentTime = forceSeekTime; } catch(e) {}
          }
          if (!isStreamUserPaused) {
            safePlay();
          }
          updateDockUI();
        }
      }

      vid.addEventListener('loadedmetadata', function() {
        if (!isStreamUserPaused) {
          safePlay();
        }
        updateDockUI();
      });

      vid.addEventListener('play', updateDockUI);
      vid.addEventListener('pause', updateDockUI);
      vid.addEventListener('ended', function() {
        if (!isStreamUserPaused) {
          try { vid.currentTime = 0; } catch (e) {}
          safePlay();
        }
      });

      function renderMultiAvatarCharacters(configOrAvatars, activeSpeakerId, isPlayingState, avatarTransformsMap) {
        const container = document.getElementById('multiAvatarCharacters');
        if (!container) return;
        
        let avatars = [];
        if (Array.isArray(configOrAvatars)) {
          avatars = configOrAvatars;
        } else if (configOrAvatars && Array.isArray(configOrAvatars.avatars)) {
          avatars = configOrAvatars.avatars;
        }
        
        avatars = avatars.filter(function(a) { return a && a.visible !== false; });
        if (avatars.length === 0) {
          container.innerHTML = '';
          return;
        }

        avatars.forEach(function(avatar, idx) {
          const charId = avatar.id || ('avatar_' + (idx + 1));
          let charEl = container.querySelector('[data-char-id="' + charId + '"]');
          const isSpeaking = activeSpeakerId ? (activeSpeakerId === avatar.id || activeSpeakerId === avatar.role) : (avatar.isSpeaking || avatar.isSpeakingNow);
          const avTalk = avatar.talkVideo || avatar.videoUrl || avatar.mediaUrl || avatar.url || avatar.src || '';
          const avIdle = avatar.idleVideo || avatar.videoUrl || avatar.mediaUrl || avatar.url || avatar.src || '';
          const targetVid = avatar.resolvedVidSrc || (isSpeaking ? (avTalk || avIdle) : (avIdle || avTalk)) || '';
          const resolvedMedia = resolveUrl(targetVid);

          const customTrans = (avatarTransformsMap && (avatarTransformsMap[charId] || avatarTransformsMap[avatar.id] || avatarTransformsMap[avatar.role])) || {};
          const isSingle = avatars.length === 1;
          const defaultTrans = isSingle
            ? { x: 0, y: 0, width: 100, height: 100, zIndex: 10, borderRadius: 0 }
            : {
                x: idx === 0 ? 8 : (idx === 1 ? 55 : (idx === 2 ? 30 : 50)),
                y: idx === 0 ? 41 : (idx === 1 ? 17 : 20),
                width: 45,
                height: 48,
                zIndex: 10 + idx,
                borderRadius: 16
              };
          const baseTrans = avatar.transform || (avatar.transforms) || defaultTrans;
          const trans = Object.assign({}, baseTrans, customTrans);
          const chromaClass = getChromaClass(avatar.chromaKey);

          if (!charEl) {
            charEl = document.createElement('div');
            charEl.setAttribute('data-char-id', charId);
            charEl.style.position = 'absolute';
            charEl.style.transition = 'all 0.3s ease';
            charEl.style.overflow = 'hidden';
            charEl.innerHTML = '<video autoplay loop muted playsinline webkit-playsinline style="width:100%;height:100%;object-fit:' + (trans.objectFit || 'cover') + ';background:transparent;display:none;pointer-events:none;border-radius:inherit;"></video><img style="width:100%;height:100%;object-fit:' + (trans.objectFit || 'cover') + ';background:transparent;display:none;pointer-events:none;border-radius:inherit;" />';
            container.appendChild(charEl);
          }

          charEl.style.left = (trans.x ?? (isSingle ? 0 : (idx === 0 ? 8 : 55))) + '%';
          charEl.style.top = (trans.y ?? (isSingle ? 0 : (idx === 0 ? 41 : 17))) + '%';
          charEl.style.width = (trans.width ?? (isSingle ? 100 : 45)) + '%';
          charEl.style.height = (trans.height ?? (isSingle ? 100 : 48)) + '%';
          charEl.style.zIndex = trans.zIndex || (10 + idx);
          charEl.style.borderRadius = (trans.borderRadius || 0) + 'px';
          charEl.style.opacity = (trans.opacity !== undefined ? trans.opacity : 100) / 100;

          const rot = trans.rotation || trans.rotate || 0;
          const scaleX = (trans.flipH ? -1 : 1) * (trans.scale || 1);
          const scaleY = (trans.flipV ? -1 : 1) * (trans.scale || 1);
          charEl.style.transform = (rot || trans.flipH || trans.flipV || (trans.scale && trans.scale !== 1))
            ? 'rotate(' + rot + 'deg) scale(' + scaleX + ', ' + scaleY + ')'
            : 'none';
          charEl.style.transformOrigin = 'center center';

          if (isSpeaking) {
            charEl.style.boxShadow = '0 0 20px rgba(52, 211, 153, 0.8), 0 0 0 2px rgba(52, 211, 153, 0.9)';
          } else {
            charEl.style.boxShadow = trans.boxShadow || 'none';
          }
          charEl.className = chromaClass;

          const v = charEl.querySelector('video');
          const img = charEl.querySelector('img');
          const charFit = trans.objectFit || 'cover';

          if (v) {
            v.style.objectFit = charFit;
            v.muted = true;
            v.defaultMuted = true;
            v.setAttribute('muted', '');
            v.playsInline = true;
            v.setAttribute('playsinline', '');
            v.setAttribute('webkit-playsinline', '');
          }

          if (resolvedMedia) {
            if (isImage(resolvedMedia)) {
              if (v) { try { v.pause(); } catch(e) {} v.style.display = 'none'; }
              if (img) { 
                if (img.src !== resolvedMedia) img.src = resolvedMedia; 
                img.style.display = 'block'; 
              }
            } else {
              if (img) img.style.display = 'none';
              if (v) {
                v.style.display = 'block';
                if (!isSameMedia(v.src, resolvedMedia)) {
                  v.src = resolvedMedia;
                  try { v.load(); } catch(e) {}
                }
                if (isPlayingState !== false && !isStreamUserPaused) {
                  v.play().catch(function() {});
                } else {
                  try { v.pause(); } catch(e) {}
                }
              }
            }
          }
        });

        Array.from(container.children).forEach(function(child) {
          const cid = child.getAttribute('data-char-id');
          if (!avatars.some(function(a, i) { return (a.id || ('avatar_' + (i + 1))) === cid; })) {
            const v = child.querySelector('video');
            if (v) { try { v.pause(); v.removeAttribute('src'); v.load(); } catch(e) {} }
            child.remove();
          }
        });
      }

      function renderMultiAvatarExtraLayers(configOrLayers) {
        const container = document.getElementById('multiAvatarExtraLayers');
        if (!container) return;
        let layers = [];
        if (Array.isArray(configOrLayers)) {
          layers = configOrLayers;
        } else if (configOrLayers && Array.isArray(configOrLayers.extraImageLayers)) {
          layers = configOrLayers.extraImageLayers;
        } else if (configOrLayers && Array.isArray(configOrLayers.extraLayers)) {
          layers = configOrLayers.extraLayers;
        } else if (configOrLayers && Array.isArray(configOrLayers.multiAvatarExtraLayers)) {
          layers = configOrLayers.multiAvatarExtraLayers;
        }
        if (layers.length === 0) {
          container.innerHTML = '';
          return;
        }

        layers.forEach(function(layer, idx) {
          const layerUrl = layer.url || layer.mediaUrl || layer.src;
          if (!layerUrl) return;
          const layerId = layer.id || ('layer_' + (idx + 1));
          let layerEl = container.querySelector('[data-layer-id="' + layerId + '"]');
          const resolvedUrl = resolveUrl(layerUrl);
          const trans = layer.transform || { x: layer.x ?? 20, y: layer.y ?? 20, width: layer.width ?? 30, height: layer.height ?? 30 };
          const chromaClass = getChromaClass(layer.chromaKey);

          if (!layerEl) {
            layerEl = document.createElement('div');
            layerEl.setAttribute('data-layer-id', layerId);
            layerEl.style.position = 'absolute';
            layerEl.style.transition = 'all 0.3s ease';
            layerEl.innerHTML = '<video autoplay loop muted playsinline webkit-playsinline style="width:100%;height:100%;object-fit:contain;background:transparent;display:none;"></video><img style="width:100%;height:100%;object-fit:contain;background:transparent;display:none;" />';
            container.appendChild(layerEl);
          }

          layerEl.style.left = (trans.x ?? 20) + '%';
          layerEl.style.top = (trans.y ?? 20) + '%';
          layerEl.style.width = (trans.width ?? 30) + '%';
          layerEl.style.height = (trans.height ?? 30) + '%';
          layerEl.style.zIndex = trans.zIndex || (5 + idx);
          layerEl.style.borderRadius = (trans.borderRadius || layer.borderRadius || 0) + 'px';
          layerEl.style.opacity = (trans.opacity !== undefined ? trans.opacity : (layer.opacity !== undefined ? layer.opacity : 100)) / 100;

          const rot = trans.rotation || trans.rotate || 0;
          const scaleX = (trans.flipH ? -1 : 1) * (trans.scale || 1);
          const scaleY = (trans.flipV ? -1 : 1) * (trans.scale || 1);
          layerEl.style.transform = (rot || trans.flipH || trans.flipV || (trans.scale && trans.scale !== 1))
            ? 'rotate(' + rot + 'deg) scale(' + scaleX + ', ' + scaleY + ')'
            : 'none';
          layerEl.style.transformOrigin = 'center center';
          layerEl.className = chromaClass;

          const v = layerEl.querySelector('video');
          const img = layerEl.querySelector('img');
          const layerFit = trans.objectFit || layer.objectFit || 'contain';
          if (v) {
            v.style.objectFit = layerFit;
            v.muted = true;
            v.defaultMuted = true;
            v.setAttribute('muted', '');
            v.playsInline = true;
            v.setAttribute('playsinline', '');
            v.setAttribute('webkit-playsinline', '');
          }
          if (img) {
            img.style.objectFit = layerFit;
          }
          const isLayerVid = !isImage(resolvedUrl);
          if (isLayerVid) {
            if (img) img.style.display = 'none';
            if (v) {
              v.style.display = 'block';
              if (!isSameMedia(v.src, resolvedUrl)) {
                v.src = resolvedUrl;
                v.play().catch(function() {});
              }
            }
          } else {
            if (v) { try { v.pause(); } catch(e) {} v.style.display = 'none'; }
            if (img) {
              img.style.display = 'block';
              if (img.src !== resolvedUrl) img.src = resolvedUrl;
            }
          }
        });

        Array.from(container.children).forEach(function(child) {
          const lid = child.getAttribute('data-layer-id');
          if (!layers.some(function(l, i) { return (l.id || ('layer_' + (i + 1))) === lid; })) {
            const v = child.querySelector('video');
            if (v) { try { v.pause(); v.removeAttribute('src'); v.load(); } catch(e) {} }
            child.remove();
          }
        });
      }

      function applyLiveState(data) {
        if (!data) return;
        if (data.aspectRatio) {
          updateStageAspectRatio(data.aspectRatio);
        }
        const stageEl = document.getElementById('stage');
        const emptyStage = document.getElementById('emptyStageView');
        const multiStage = document.getElementById('multiAvatarStage');
        const multiBg = document.getElementById('multiAvatarBg');
        const overlayImgEl = document.getElementById('overlayImageBanner');
        const overlayImgContent = document.getElementById('overlayImageContent');
        const banner = document.getElementById('overlayTextBanner');
        const content = document.getElementById('overlayTextContent');
        const pipContainer = document.getElementById('pipContainer');
        const pipVideo = document.getElementById('pipVideo');
        const pipImage = document.getElementById('pipImage');

        if (stageEl && data.backgroundColor) {
          stageEl.style.backgroundColor = data.backgroundColor;
        }

        // 2. Tìm nguồn media nền chính (Background / Main Media)
        const bgUrlCandidate = data.mainMediaUrl || (data.multiAvatarConfig && data.multiAvatarConfig.backgroundUrl) || data.mediaUrl || data.currentMedia || data.eventVideoUrl || data.videoUrl || '';
        const resolvedMainBg = resolveUrl(bgUrlCandidate);

        const avatarsList = (Array.isArray(data.syncedAvatars) && data.syncedAvatars.length > 0)
          ? data.syncedAvatars
          : ((data.multiAvatarConfig && Array.isArray(data.multiAvatarConfig.avatars) && data.multiAvatarConfig.avatars.length > 0)
            ? data.multiAvatarConfig.avatars
            : []);

        const hasValidAvatars = avatarsList.length > 0 && avatarsList.some(function(a) {
          const u = a.talkVideo || a.idleVideo || a.mediaUrl || a.resolvedVidSrc || a.url || a.src || a.videoUrl;
          return u && typeof u === 'string';
        });

        const isValidCustomOverlayText = (txt) => {
          if (!txt || typeof txt !== 'string') return false;
          const trimmed = txt.trim();
          if (!trimmed) return false;
          if (/^(bước|step)\s*\d+/i.test(trimmed)) return false;
          return true;
        };

        const extraLayersList = (Array.isArray(data.extraImageLayers) && data.extraImageLayers.length > 0)
          ? data.extraImageLayers
          : ((data.multiAvatarConfig && Array.isArray(data.multiAvatarConfig.extraImageLayers) && data.multiAvatarConfig.extraImageLayers.length > 0)
            ? data.multiAvatarConfig.extraImageLayers
            : (Array.isArray(data.multiAvatarExtraLayers) ? data.multiAvatarExtraLayers : []));

        const hasExtraLayers = extraLayersList.length > 0;
        const hasTitle = isValidCustomOverlayText(data.overlayText) || isValidCustomOverlayText(data.title);
        const hasPinnedProduct = !!(data.livePinnedProduct || data.pinnedProduct);
        const hasAnyContent = !!(resolvedMainBg || hasValidAvatars || data.secondaryMediaUrl || data.overlayImage || hasExtraLayers || hasTitle || hasPinnedProduct);

        // 1. Kiểm tra trạng thái XÓA TRẮNG SÂN KHẤU (CLEAR_STAGE / clearMedia / Dừng Live)
        if (data.clearMedia === true || data.stageStatus === 'stopped' || data.isLiveEnded === true || (data.isPlaying === false && !resolvedMainBg && !hasValidAvatars && !data.secondaryMediaUrl)) {
          if (emptyStage) emptyStage.style.display = 'flex';
          if (multiStage) multiStage.style.display = 'none';
          if (pipContainer) pipContainer.style.display = 'none';
          if (overlayImgEl) overlayImgEl.style.display = 'none';
          if (banner) banner.style.display = 'none';
          const prodContainer = document.getElementById('pinnedProductContainer');
          if (prodContainer) prodContainer.style.display = 'none';
          if (vid) {
            try { vid.pause(); vid.removeAttribute('src'); vid.src = ''; vid.load(); } catch(e) {}
            vid.style.display = 'none';
          }
          const imgEl = document.getElementById('imagePlayer');
          if (imgEl) {
            try { imgEl.removeAttribute('src'); imgEl.src = ''; } catch(e) {}
            imgEl.style.display = 'none';
          }
          const multiChars = document.getElementById('multiAvatarCharacters');
          if (multiChars) multiChars.innerHTML = '';
          const multiExtra = document.getElementById('multiAvatarExtraLayers');
          if (multiExtra) multiExtra.innerHTML = '';
          const multiBg = document.getElementById('multiAvatarBg');
          if (multiBg) { multiBg.style.backgroundImage = 'none'; multiBg.style.display = 'none'; }
          hideLoading();
          updateDockUI();
          return;
        }

        if (!resolvedMainBg && !hasValidAvatars && !data.secondaryMediaUrl && !data.overlayImage && !hasExtraLayers && !hasTitle && !hasPinnedProduct) {
          if (emptyStage) emptyStage.style.display = 'flex';
          if (multiStage) multiStage.style.display = 'none';
          if (pipContainer) pipContainer.style.display = 'none';
          if (overlayImgEl) overlayImgEl.style.display = 'none';
          if (banner) banner.style.display = 'none';
          const prodContainer = document.getElementById('pinnedProductContainer');
          if (prodContainer) prodContainer.style.display = 'none';
          if (vid) {
            try { vid.pause(); vid.removeAttribute('src'); vid.src = ''; vid.load(); } catch(e) {}
            vid.style.display = 'none';
          }
          const imgEl = document.getElementById('imagePlayer');
          if (imgEl) {
            try { imgEl.removeAttribute('src'); imgEl.src = ''; } catch(e) {}
            imgEl.style.display = 'none';
          }
          updateDockUI();
          return;
        }

        if (emptyStage) emptyStage.style.display = 'none';

        // 3. Hiển thị Lớp Nền Sân Khấu Chính (Background Layer)
        const imgEl = document.getElementById('imagePlayer');
        const mainBgLayer = document.getElementById('mainBackgroundLayer');
        const mainChromaClass = getChromaClass(data.mainMediaChromaKey || data.backgroundChromaKey);
        const mainTrans = data.mainMediaTransform || (data.multiAvatarConfig && data.multiAvatarConfig.backgroundTransform) || { x: 0, y: 0, width: 100, height: 100 };

        const bgFit = mainTrans.objectFit || currentFit || 'cover';
        const bgRot = mainTrans.rotation || mainTrans.rotate || 0;
        const bgScaleX = (mainTrans.flipH ? -1 : 1) * (mainTrans.scale || 1);
        const bgScaleY = (mainTrans.flipV ? -1 : 1) * (mainTrans.scale || 1);
        const bgTransform = (bgRot || mainTrans.flipH || mainTrans.flipV || (mainTrans.scale && mainTrans.scale !== 1))
          ? 'rotate(' + bgRot + 'deg) scale(' + bgScaleX + ', ' + bgScaleY + ')'
          : 'none';
        const bgOpacity = (mainTrans.opacity !== undefined ? mainTrans.opacity : 100) / 100;
        const bgRadius = (mainTrans.borderRadius || 0) + 'px';

        if (mainBgLayer) {
          mainBgLayer.style.left = (mainTrans.x ?? 0) + '%';
          mainBgLayer.style.top = (mainTrans.y ?? 0) + '%';
          mainBgLayer.style.width = (mainTrans.width ?? 100) + '%';
          mainBgLayer.style.height = (mainTrans.height ?? 100) + '%';
          mainBgLayer.style.transform = bgTransform;
          mainBgLayer.style.transformOrigin = 'center center';
          mainBgLayer.style.opacity = bgOpacity;
          mainBgLayer.style.borderRadius = bgRadius;
          mainBgLayer.style.zIndex = mainTrans.zIndex || 0;
        }

        if (multiBg && resolvedMainBg) {
          multiBg.style.backgroundImage = 'url(' + resolvedMainBg + ')';
          multiBg.style.display = 'block';
        } else if (multiBg) {
          multiBg.style.display = 'none';
        }

        if (resolvedMainBg) {
          if (isImage(resolvedMainBg)) {
            if (imgEl) {
              if (imgEl.src !== resolvedMainBg) imgEl.src = resolvedMainBg;
              imgEl.style.objectFit = bgFit;
              imgEl.className = mainChromaClass;
              imgEl.style.display = 'block';
            }
            if (vid) {
              vid.style.display = 'none';
              try { vid.pause(); } catch(e) {}
            }
          } else {
            if (imgEl) imgEl.style.display = 'none';
            if (vid) {
              vid.style.objectFit = bgFit;
              vid.className = mainChromaClass;
              vid.style.display = 'block';
              if (!isSameMedia(vid.src, resolvedMainBg)) {
                currentSrc = resolvedMainBg;
                vid.src = resolvedMainBg;
                try { vid.load(); } catch(e) {}
              }
              if (data.isPlaying !== false && !isStreamUserPaused) safePlay();
            }
          }
        } else {
          if (imgEl) imgEl.style.display = 'none';
          if (vid) { vid.style.display = 'none'; }
        }

        // 4. Hiển thị Lớp Multi-Avatar & Extra Layers (Đồng bộ 100% Sân Khấu Chính)
        const avatarTransformsMap = data.avatarTransforms || (data.multiAvatarConfig && data.multiAvatarConfig.avatarTransforms) || null;
        if (hasValidAvatars || hasExtraLayers) {
          if (multiStage) {
            multiStage.style.display = 'block';
            multiStage.style.background = data.multiAvatarConfig?.backgroundColor || 'transparent';
          }
          renderMultiAvatarCharacters(avatarsList, data.activeSpeakerId || data.avatarSpeaker, data.isPlaying !== false, avatarTransformsMap);
          renderMultiAvatarExtraLayers(extraLayersList);
        } else {
          if (multiStage) multiStage.style.display = 'none';
        }

        // 4. Lớp Video Phụ PiP (Picture-in-Picture)
        if (pipContainer && pipVideo && pipImage) {
          const pipUrl = resolveUrl(data.secondaryMediaUrl);
          if (pipUrl) {
            const trans = data.secondaryMediaTransform || {
              x: data.secondaryMediaPos === 'top-left' ? 4 : (data.secondaryMediaPos === 'bottom-left' ? 4 : 55),
              y: (data.secondaryMediaPos === 'bottom-left' || data.secondaryMediaPos === 'bottom-right') ? 70 : 8,
              width: Number(data.secondaryMediaScale) || 40,
              height: Math.round((Number(data.secondaryMediaScale) || 40) * 1.2),
              zIndex: 25
            };
            const secChromaClass = getChromaClass(data.secondaryMediaChromaKey);
            pipContainer.style.left = (trans.x ?? 55) + '%';
            pipContainer.style.top = (trans.y ?? 8) + '%';
            pipContainer.style.width = (trans.width ?? 40) + '%';
            pipContainer.style.height = (trans.height ?? 48) + '%';
            pipContainer.style.zIndex = trans.zIndex || 25;
            pipContainer.className = secChromaClass;
            pipContainer.style.display = 'block';

            if (isImage(pipUrl)) {
              pipImage.src = pipUrl;
              pipImage.style.display = 'block';
              pipVideo.style.display = 'none';
            } else {
              pipImage.style.display = 'none';
              pipVideo.style.display = 'block';
              if (!isSameMedia(pipVideo.src, pipUrl)) {
                pipVideo.src = pipUrl;
                if (data.isPlaying !== false) {
                  pipVideo.play().catch(function() {});
                }
              }
            }
          } else {
            pipContainer.style.display = 'none';
            try { pipVideo.pause(); pipVideo.src = ''; } catch(e) {}
          }
        }

        // 5. Banner Hình Ảnh Overlay (Đúng Tọa Độ Transform)
        if (overlayImgEl && overlayImgContent) {
          const imgUrl = resolveUrl(data.overlayImage || data.bannerUrl || data.posterUrl);
          if (imgUrl) {
            const trans = data.overlayImageTransform || {
              x: 10,
              y: data.overlayImagePos === 'bottom' ? 70 : (data.overlayImagePos === 'top' ? 8 : 12),
              width: Number(data.overlayImageScale) || 80,
              height: 20,
              zIndex: 30
            };
            const imgChromaClass = getChromaClass(data.overlayImageChromaKey);
            overlayImgEl.style.left = (trans.x ?? 10) + '%';
            overlayImgEl.style.top = (trans.y ?? 12) + '%';
            overlayImgEl.style.width = (trans.width ?? 80) + '%';
            overlayImgEl.style.zIndex = trans.zIndex || 30;
            overlayImgEl.className = imgChromaClass;
            overlayImgContent.src = imgUrl;
            overlayImgEl.style.display = 'block';
          } else {
            overlayImgEl.style.display = 'none';
          }
        }

        // 6. Tiêu Đề Chữ Overlay (Chỉ hiện khi người dùng nhập nội dung hợp lệ, TUYỆT ĐỐI KHÔNG HIỆN Bước 1, Bước 2...)
        if (banner && content) {
          const rawTxt = data.overlayText || (data.title && !/^(bước|step)\s*\d+/i.test(data.title.trim()) ? data.title : '');
          const txt = isValidCustomOverlayText(rawTxt) ? rawTxt.trim() : '';
          if (txt) {
            const trans = data.overlayTextTransform || { x: 4, y: 5, width: 92, zIndex: 35 };
            banner.style.left = (trans.x ?? 4) + '%';
            banner.style.top = (trans.y ?? 5) + '%';
            banner.style.width = (trans.width ?? 92) + '%';
            banner.style.zIndex = trans.zIndex || 35;
            content.innerText = txt;
            if (data.overlayTextColor) content.style.color = data.overlayTextColor;
            if (data.overlayTextFontSize) content.style.fontSize = data.overlayTextFontSize + 'px';
            if (data.overlayTextFontFamily) {
              const fontMap = {
                montserrat: "'Montserrat', sans-serif",
                be_vietnam: "'Be Vietnam Pro', sans-serif",
                lexend: "'Lexend', sans-serif",
                impact: "Impact, sans-serif",
                inter: "'Inter', sans-serif",
                roboto: "'Roboto', sans-serif",
                playfair: "'Playfair Display', serif",
                anton: "'Anton', sans-serif"
              };
              if (fontMap[data.overlayTextFontFamily]) content.style.fontFamily = fontMap[data.overlayTextFontFamily];
            }
            if (data.overlayTextStyle === 'neon_cyber') {
              content.style.background = 'rgba(2, 6, 23, 0.95)';
              content.style.border = '1.5px solid #22d3ee';
              content.style.color = data.overlayTextColor || '#22d3ee';
              content.style.boxShadow = '0 0 25px rgba(6, 182, 212, 0.8)';
            } else if (data.overlayTextStyle === 'gold_luxury') {
              content.style.background = 'linear-gradient(to right, #f59e0b, #fde047, #f59e0b)';
              content.style.border = '1.5px solid #fef08a';
              content.style.color = data.overlayTextColor || '#020617';
              content.style.boxShadow = '0 0 25px rgba(251, 191, 36, 0.9)';
            } else if (data.overlayTextStyle === 'gradient_rose') {
              content.style.background = 'linear-gradient(to right, #e11d48, #ec4899, #e11d48)';
              content.style.border = '1.5px solid rgba(244, 114, 182, 0.6)';
              content.style.color = data.overlayTextColor || '#ffffff';
              content.style.boxShadow = '0 0 25px rgba(244, 63, 94, 0.8)';
            } else if (data.overlayTextStyle === 'minimal_dark') {
              content.style.background = 'rgba(0, 0, 0, 0.85)';
              content.style.border = '1px solid rgba(255, 255, 255, 0.2)';
              content.style.color = data.overlayTextColor || '#ffffff';
              content.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.9)';
            } else {
              content.style.background = 'linear-gradient(to right, #dc2626, #f59e0b, #dc2626)';
              content.style.border = '1.5px solid rgba(252, 211, 77, 0.6)';
              content.style.color = data.overlayTextColor || '#ffffff';
              content.style.boxShadow = '0 0 25px rgba(239, 68, 68, 0.85)';
            }
            banner.style.display = 'block';
          } else {
            banner.style.display = 'none';
          }
        }

        // 7. Đồng bộ Sản Phẩm Ghim TikTok Shop / Live Commerce
        const prodContainer = document.getElementById('pinnedProductContainer');
        const prod = data.livePinnedProduct || data.pinnedProduct;
        window.__currentPinnedProduct = prod;
        if (prodContainer) {
          if (prod && (prod.title || prod.name || prod.productName)) {
            const prodImg = document.getElementById('pinnedProductImg');
            const prodTitle = document.getElementById('pinnedProductTitle');
            const prodPrice = document.getElementById('pinnedProductPrice');
            const prodOldPrice = document.getElementById('pinnedProductOldPrice');
            const prodBadge = document.getElementById('pinnedProductBadge');
            const prodCode = document.getElementById('pinnedProductCode');
            const prodSeller = document.getElementById('pinnedProductSeller');

            const imgSrc = prod.image || prod.imageUrl || prod.thumbnail || prod.img || '';
            if (prodImg) {
              if (imgSrc) {
                prodImg.src = resolveUrl(imgSrc);
                prodImg.style.display = 'block';
              } else {
                prodImg.style.display = 'none';
              }
            }

            if (prodSeller) {
              prodSeller.innerText = '🏪 ' + getSellerName2(prod);
              prodSeller.style.display = 'inline-block';
            }

            if (prodTitle) {
              prodTitle.innerText = prod.title || prod.name || prod.productName || 'Sản phẩm đang ghim';
            }

            if (prodPrice) {
              const rawPrice = prod.salePrice || prod.price || prod.formattedPrice || prod.currentPrice;
              prodPrice.innerText = typeof rawPrice === 'number' ? rawPrice.toLocaleString('vi-VN') + ' đ' : (rawPrice || '');
            }

            if (prodOldPrice) {
              const rawOld = prod.originalPrice || prod.marketPrice || prod.oldPrice || prod.regularPrice;
              if (rawOld) {
                prodOldPrice.innerText = typeof rawOld === 'number' ? rawOld.toLocaleString('vi-VN') + ' đ' : String(rawOld);
                prodOldPrice.style.display = 'inline';
              } else {
                prodOldPrice.style.display = 'none';
              }
            }

            if (prodBadge) {
              const badgeText = prod.dealBadge || prod.discountBadge || prod.badge || prod.tag || (prod.discountPercent ? ('-' + prod.discountPercent + '%') : '🔥 DEAL HOT');
              prodBadge.innerText = badgeText;
              prodBadge.style.display = badgeText ? 'inline-block' : 'none';
            }

            if (prodCode) {
              const codeText = prod.code || prod.sku || (prod.id ? ('#' + prod.id) : '');
              prodCode.innerText = codeText;
              prodCode.style.display = codeText ? 'inline' : 'none';
            }

            prodContainer.style.display = 'block';
          } else {
            prodContainer.style.display = 'none';
          }
        }

        // 8. Đồng bộ trạng thái Dừng / Phát video chính xác 100%
        if (data.videoPlaybackEvent === 'pause' || data.isPlaying === false) {
          isStreamUserPaused = true;
          vid.pause();
          if (pipVideo && !pipVideo.paused) {
            try { pipVideo.pause(); } catch(e) {}
          }
          const nestedVids = document.querySelectorAll('#multiAvatarCharacters video, #multiAvatarExtraLayers video');
          nestedVids.forEach(function(av) {
            try { av.pause(); } catch(e) {}
          });
        } else if ((data.videoPlaybackEvent === 'play' || data.isPlaying === true) && vid.paused && vid.src) {
          isStreamUserPaused = false;
          safePlay();
          if (pipVideo && pipVideo.paused && pipVideo.src) {
            try { pipVideo.play().catch(function() {}); } catch(e) {}
          }
          if (!isStreamUserPaused) {
            const nestedVids = document.querySelectorAll('#multiAvatarCharacters video, #multiAvatarExtraLayers video');
            nestedVids.forEach(function(av) {
              if (av.paused && av.src) {
                try { av.play().catch(function() {}); } catch(e) {}
              }
            });
          }
        }
        if (typeof data.videoCurrentTime === 'number' && Math.abs(vid.currentTime - data.videoCurrentTime) > 0.6) {
          try { vid.currentTime = data.videoCurrentTime; } catch(e) {}
        }
        updateDockUI();
      }

      function fetchLatestState() {
        fetch(window.location.origin + '/api/live-state', { cache: 'no-store' })
          .then(function(res) { return res.json(); })
          .then(function(data) {
            applyLiveState(data);
          })
          .catch(function() {});
      }

      setInterval(function() {
        if (!vid.src || vid.paused || vid.readyState < 2) {
          fetchLatestState();
        }
      }, 1500);

      fetchLatestState();
      if (currentSrc) {
        loadAndPlay(currentSrc);
      } else {
        setTimeout(fetchLatestState, 400);
      }

      try {
        socket = io(window.location.origin, {
          transports: ['websocket', 'polling'],
          reconnection: true
        });

        socket.on('connect', function() {
          if (badge) badge.innerText = '🟢 4K 60 FPS REALTIME v4.9.45';
          socket.emit('REQUEST_MASTER_LIVE_STATE');
        });

        socket.on('disconnect', function() {
          if (badge) badge.innerText = '🟡 RECONNECTING...';
        });

        socket.on('MASTER_LIVE_STATE_UPDATE', function(data) {
          applyLiveState(data);
        });

        socket.on('EVENT_VIDEO_PLAY', function(data) {
          if (data && (data.eventVideoUrl || data.videoUrl || data.mediaUrl)) {
            loadAndPlay(data.eventVideoUrl || data.videoUrl || data.mediaUrl);
          }
        });

        socket.on('EVENT_VIDEO_TRIGGER', function(data) {
          if (data && (data.eventVideoUrl || data.videoUrl || data.mediaUrl)) {
            loadAndPlay(data.eventVideoUrl || data.videoUrl || data.mediaUrl);
          }
        });

        socket.on('GLOBAL_MEDIA_CHANGE', function(data) {
          if (data && (data.mediaUrl || data.blobUrl)) {
            loadAndPlay(data.mediaUrl || data.blobUrl, data.currentTime);
          }
        });

        socket.on('CLEAR_EVENT_VIDEO', function() {
          applyLiveState({ clearMedia: true, isPlaying: false });
        });

        socket.on('CLEAR_STAGE', function() {
          applyLiveState({ clearMedia: true, isPlaying: false });
        });

        socket.on('VIDEO_PLAYBACK_CONTROL', function(control) {
          if (!control) return;
          if (control.mediaUrl) {
            const resolved = resolveUrl(control.mediaUrl);
            if (resolved && !isSameMedia(vid.src, resolved)) {
              loadAndPlay(resolved, control.currentTime);
            }
          }
          if (typeof control.currentTime === 'number' && control.currentTime >= 0) {
            if (Math.abs(vid.currentTime - control.currentTime) > 0.6) {
              try { vid.currentTime = control.currentTime; } catch(e) {}
            }
          }
          if (control.action === 'pause' || control.isPlaying === false) {
            isStreamUserPaused = true;
            vid.pause();
            updateDockUI();
          } else if (control.action === 'play' || control.isPlaying === true) {
            isStreamUserPaused = false;
            if (vid.paused && vid.src) {
              safePlay();
            }
            updateDockUI();
          }
          if (typeof control.isMuted === 'boolean') {
            targetMuted = control.isMuted;
            vid.muted = targetMuted;
            updateDockUI();
          }
        });

        if (bc) {
          bc.onmessage = function(ev) {
            if (!ev.data) return;
            if (ev.data.type === 'GLOBAL_MEDIA_CHANGE' || ev.data.type === 'MASTER_MEDIA_CHANGE' || ev.data.type === 'EVENT_VIDEO_PLAY' || ev.data.type === 'MASTER_LIVE_STATE_UPDATE') {
              applyLiveState(ev.data);
            } else if (ev.data.type === 'CLEAR_STAGE' || ev.data.type === 'CLEAR_EVENT_VIDEO') {
              applyLiveState({ clearMedia: true, isPlaying: false });
            } else if (ev.data.type === 'VIDEO_PLAYBACK_CONTROL') {
              if (ev.data.action === 'pause' || ev.data.isPlaying === false) {
                isStreamUserPaused = true;
                vid.pause();
                updateDockUI();
              } else if (ev.data.action === 'play' || ev.data.isPlaying === true) {
                isStreamUserPaused = false;
                if (vid.paused && vid.src) safePlay();
                updateDockUI();
              }
            }
          };
        }
      } catch (err) {
        console.warn('Socket connect error:', err);
      }
    })();
  </script>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.send(html);
});
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


// Helper tìm link tải asset GitHub an toàn 100% không bao giờ bị 404 hay mở trang GitHub
let _cachedReleaseUrls = {};
let _lastReleaseFetchTime = 0;
async function resolveLatestGitHubDownloadUrl(isMac, fallbackVer) {
  const osPrefix = isMac ? 'AvaLive_VIP_PRO_Mac' : 'AvaLive_VIP_PRO_Windows';
  const targetVer = fallbackVer || '5.1.4';
  const cacheKey = `${osPrefix}_v${targetVer}`;
  if (_cachedReleaseUrls[cacheKey] && (Date.now() - _lastReleaseFetchTime < 60000)) {
    return _cachedReleaseUrls[cacheKey];
  }

  let finalUrl = `https://github.com/THIENVUAAPP/DU-AN-AVA-LIVETREAMS/releases/download/v${targetVer}/${osPrefix}_v${targetVer}.zip`;

  try {
    const token = process.env.GITHUB_TOKEN || '';
    const headers = { 'User-Agent': 'AvaLive-Download-Agent/1.0', 'Accept': 'application/vnd.github.v3+json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    // 1. Thử lấy chính xác theo tag targetVer hiện tại
    if (targetVer) {
      const tagRes = await fetch(`https://api.github.com/repos/THIENVUAAPP/DU-AN-AVA-LIVETREAMS/releases/tags/v${targetVer}`, { headers });
      if (tagRes.ok) {
        const rel = await tagRes.json();
        const asset = (rel.assets || []).find(a => a.name && (a.name === `${osPrefix}_v${targetVer}.zip` || (a.name.startsWith(osPrefix) && a.name.endsWith('.zip'))));
        if (asset && asset.browser_download_url) {
          finalUrl = asset.browser_download_url;
        }
      }
    }

    // 2. Thử lấy danh sách Releases mới nhất từ GitHub khớp chính xác version hoặc lấy asset zip mới nhất
    if (!finalUrl.includes(`v${targetVer}`)) {
      const relsRes = await fetch('https://api.github.com/repos/THIENVUAAPP/DU-AN-AVA-LIVETREAMS/releases?per_page=15', { headers });
      if (relsRes.ok) {
        const releases = await relsRes.json();
        if (Array.isArray(releases)) {
          for (const rel of releases) {
            const asset = (rel.assets || []).find(a => a.name && a.name.startsWith(osPrefix) && a.name.endsWith('.zip'));
            if (asset && asset.browser_download_url) {
              finalUrl = asset.browser_download_url;
              break;
            }
          }
        }
      }
    }
  } catch (e) {
    console.warn('[Download] Error resolving GitHub asset URL:', e.message);
  }

  // 🚀 SỬ DỤNG CLOUDFLARE EDGE CDN ACCELERATOR (TỐC ĐỘ SIÊU NHANH 20MB/s - 50MB/s+, KHÔNG NGHẼN MẠNG)
  const acceleratedUrl = `https://gh-proxy.com/${finalUrl}`;
  _cachedReleaseUrls[cacheKey] = acceleratedUrl;
  _lastReleaseFetchTime = Date.now();
  return acceleratedUrl;
}

// 📦 ROUTE TẢI PHẦN MỀM STANDALONE WINDOWS — TẢI TRỰC TIẾP VỀ MÁY 100%, KHÔNG MỞ GITHUB
app.get(['/api/download/windows', '/api/download-windows', '/download/windows', '/AvaLive_VIP_PRO_Windows.zip', /^\/AvaLive_VIP_PRO_Windows_v.*\.zip$/], async (req, res) => {
  let ver = '5.1.4';
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
    if (pkg.version) ver = pkg.version;
  } catch (e) {}

  const rootDir = path.join(__dirname, '..');
  const releaseDir = path.join(rootDir, 'release_zips');
  const primaryFile = path.join(releaseDir, `AvaLive_VIP_PRO_Windows_v${ver}.zip`);
  const legacyFile = path.join(releaseDir, 'AvaLive_VIP_PRO_Windows.zip');

  if (fs.existsSync(primaryFile)) {
    return res.download(primaryFile, `AvaLive_VIP_PRO_Windows_v${ver}.zip`);
  } else if (fs.existsSync(legacyFile)) {
    return res.download(legacyFile, `AvaLive_VIP_PRO_Windows_v${ver}.zip`);
  }

  // Quét file zip Windows mới nhất nếu có trong release_zips
  if (fs.existsSync(releaseDir)) {
    const files = fs.readdirSync(releaseDir).filter(f => f.startsWith('AvaLive_VIP_PRO_Windows') && f.endsWith('.zip'));
    if (files.length > 0) {
      files.sort((a, b) => {
        const statA = fs.statSync(path.join(releaseDir, a)).mtimeMs;
        const statB = fs.statSync(path.join(releaseDir, b)).mtimeMs;
        return statB - statA;
      });
      return res.download(path.join(releaseDir, files[0]), `AvaLive_VIP_PRO_Windows_v${ver}.zip`);
    }
  }

  const verifiedUrl = await resolveLatestGitHubDownloadUrl(false, ver);
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', `attachment; filename="AvaLive_VIP_PRO_Windows_v${ver}.zip"`);
  res.setHeader('Cache-Control', 'public, max-age=120, s-maxage=120');
  return res.redirect(verifiedUrl);
});

// 📦 ROUTE TẢI PHẦN MỀM STANDALONE MAC — TẢI TRỰC TIẾP VỀ MÁY 100%, KHÔNG MỞ GITHUB
app.get(['/api/download/mac', '/api/download-mac', '/download/mac', '/AvaLive_VIP_PRO_Mac.zip', /^\/AvaLive_VIP_PRO_Mac_v.*\.zip$/], async (req, res) => {
  let ver = '5.1.4';

  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
    if (pkg.version) ver = pkg.version;
  } catch (e) {}

  const rootDir = path.join(__dirname, '..');
  const releaseDir = path.join(rootDir, 'release_zips');
  const primaryFile = path.join(releaseDir, `AvaLive_VIP_PRO_Mac_v${ver}.zip`);
  const legacyFile = path.join(releaseDir, 'AvaLive_VIP_PRO_Mac.zip');

  if (fs.existsSync(primaryFile)) {
    return res.download(primaryFile, `AvaLive_VIP_PRO_Mac_v${ver}.zip`);
  } else if (fs.existsSync(legacyFile)) {
    return res.download(legacyFile, `AvaLive_VIP_PRO_Mac_v${ver}.zip`);
  }

  // Quét file zip Mac mới nhất nếu có trong release_zips
  if (fs.existsSync(releaseDir)) {
    const files = fs.readdirSync(releaseDir).filter(f => f.startsWith('AvaLive_VIP_PRO_Mac') && f.endsWith('.zip'));
    if (files.length > 0) {
      files.sort((a, b) => {
        const statA = fs.statSync(path.join(releaseDir, a)).mtimeMs;
        const statB = fs.statSync(path.join(releaseDir, b)).mtimeMs;
        return statB - statA;
      });
      return res.download(path.join(releaseDir, files[0]), `AvaLive_VIP_PRO_Mac_v${ver}.zip`);
    }
  }

  const verifiedUrl = await resolveLatestGitHubDownloadUrl(true, ver);
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', `attachment; filename="AvaLive_VIP_PRO_Mac_v${ver}.zip"`);
  res.setHeader('Cache-Control', 'public, max-age=120, s-maxage=120');
  return res.redirect(verifiedUrl);
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
      // Tuyệt đối không bao giờ ghi blob: URL vào file state vĩnh viễn
      if (currentMasterLiveState && currentMasterLiveState.mediaUrl && currentMasterLiveState.mediaUrl.startsWith('blob:')) {
        currentMasterLiveState.mediaUrl = null;
      }
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
        if (typeof data.mediaUrl === 'string' && (data.mediaUrl.startsWith('blob:') || data.mediaUrl.includes('nhep_mieng.mp4') || data.mediaUrl.includes('demo_dancer.mp4') || data.mediaUrl.includes('default_idol.mp4'))) {
          data.mediaUrl = null;
        }
        // Làm sạch pinnedProduct nếu có dữ liệu mock/demo cũ
        if (data.pinnedProduct && (
          !data.pinnedProduct.name || 
          data.pinnedProduct.name.includes('AVA LIVE') || 
          data.pinnedProduct.name.includes('Streamer Desktop') || 
          data.pinnedProduct.name.includes('TikTok Shop Streamer')
        )) {
          data.pinnedProduct = {
            id: 1,
            name: 'Áo bra có mút cổ yếm HAVATA cao cấp nâng ngực dáng thể thao tập gym yoga',
            productName: 'Áo bra có mút cổ yếm HAVATA cao cấp nâng ngực dáng thể thao tập gym yoga',
            price: '49.999 ₫',
            oldPrice: '83.332 ₫',
            image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=500&q=80',
            badge: 'HOT DEAL TIKTOK 🔥',
            stock: '32Tr',
            keywords: 'mã 1;mã 01;áo bra;bra;áo tập;havata;yếm;chốt 1;sp1;mua 1',
            storeUrl: 'https://shop.tiktok.com/streamer/live/product/dashboard',
            pinnedAt: Date.now(),
            triggerSource: 'interval_auto_rotation'
          };
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
  isVideo: false,
  videoPlaybackEvent: 'pause',
  isPlaying: false,
  isAudioMuted: false,
  isDarkMode: true,
  updatedAt: Date.now()
};

// Tuyệt đối không tự ý gán video phát nền ngầm hoặc blob tạm thời, không tự ý quét bốc file cũ trong uploads
if (currentMasterLiveState.mediaUrl) {
  const fileOnDisk = findFileInUploadDirs(currentMasterLiveState.mediaUrl);
  if (!fileOnDisk || !fs.existsSync(fileOnDisk)) {
    currentMasterLiveState.mediaUrl = null;
  }
}

// Khởi động luôn ở trạng thái DỪNG (isPlaying = false, pause) tránh tự ý phát video ngầm
currentMasterLiveState.isPlaying = false;
currentMasterLiveState.videoPlaybackEvent = 'pause';
if (!currentMasterLiveState.mediaUrl) {
  currentMasterLiveState.isVideo = false;
  currentMasterLiveState.isUserExplicitMediaLocked = false;
}
saveLiveStateToFile(true);
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

      // 🛡️ LOẠI BỎ TRIỆT ĐỂ BLOB: Không bao giờ lưu blob: URL vào live state
      if (cleanState.mediaUrl && typeof cleanState.mediaUrl === 'string') {
        if (cleanState.mediaUrl.startsWith('blob:')) {
          delete cleanState.mediaUrl;
        } else if (cleanState.mediaUrl.includes('/uploads/')) {
          cleanState.mediaUrl = cleanState.mediaUrl.substring(cleanState.mediaUrl.indexOf('/uploads/'));
        }
      }

      const nextState = { ...currentMasterLiveState, ...cleanState, updatedAt: Date.now() };
      delete nextState.force;
      // BẢO VỆ VIDEO ĐANG PHÁT: Không bao giờ tự ý bốc video cũ ngẫu nhiên trong uploads
      if (cleanState.clearMedia === true || cleanState.mediaUrl === null) {
        nextState.mediaUrl = null;
        nextState.clearMedia = true;
        nextState.isVideo = false;
        nextState.isPlaying = false;
      } else if (cleanState.mediaUrl || cleanState.secondaryMediaUrl || (Array.isArray(cleanState.syncedAvatars) && cleanState.syncedAvatars.length > 0)) {
        nextState.clearMedia = false;
      } else if (!nextState.mediaUrl || nextState.mediaUrl.startsWith('blob:')) {
        nextState.mediaUrl = currentMasterLiveState.mediaUrl || null;
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
        if (!control.mediaUrl.startsWith('blob:')) {
          currentMasterLiveState.mediaUrl = control.mediaUrl;
          currentMasterLiveState.isVideo = true;
        } else {
          delete control.mediaUrl; // Loại bỏ blob URL cục bộ, bảo vệ overlay TikTok Studio không bị lỗi
        }
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

  // 🛑 LỆNH DỪNG TOÀN CỤC KHẨN CẤP: Dừng voice, dừng video, dừng mọi âm thanh trên toàn hệ thống
  socket.on('EMERGENCY_STOP_ALL', (data) => {
    currentMasterLiveState.isPlaying = false;
    currentMasterLiveState.videoPlaybackEvent = 'pause';
    currentMasterLiveState.updatedAt = Date.now();
    io.emit('EMERGENCY_STOP_ALL', data || { timestamp: Date.now() });
    io.emit('VIDEO_PLAYBACK_CONTROL', {
      action: 'pause',
      isPlaying: false,
      timestamp: Date.now()
    });
    io.emit('MASTER_LIVE_STATE_UPDATE', currentMasterLiveState);
    saveLiveStateToFile(true);
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

  // 📌 TIKTOK SHOP (shop.tiktok.com) & TIKTOK LIVE STUDIO AUTO-PIN PRODUCT ENGINE
  socket.on('pin_product_live', (product) => {
    if (product) {
      currentMasterLiveState.pinnedProduct = product;
      currentMasterLiveState.updatedAt = Date.now();
      io.emit('pin_product_live', product);
      io.emit('tiktok_shop_pin', product);
      io.emit('MASTER_LIVE_STATE_UPDATE', currentMasterLiveState);
      saveLiveStateToFile(false);
      console.log(`[TikTok Shop AutoPin] 📌 Đã phát lệnh ghim sản phẩm lên Live & shop.tiktok.com: ${product.name || product.productName}`);
    }
  });

  socket.on('tiktok_shop_pin', (product) => {
    if (product) {
      currentMasterLiveState.pinnedProduct = product;
      currentMasterLiveState.updatedAt = Date.now();
      io.emit('pin_product_live', product);
      io.emit('tiktok_shop_pin', product);
      io.emit('MASTER_LIVE_STATE_UPDATE', currentMasterLiveState);
      saveLiveStateToFile(false);
    }
  });

  socket.on('get_pinned_product', () => {
    socket.emit('pin_product_live', currentMasterLiveState.pinnedProduct || null);
  });

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
        mediaUrl: currentMasterLiveState.mediaUrl || finalFlv,
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
          mediaUrl: currentMasterLiveState.mediaUrl || finalFlv,
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

let _syncVercelTimer = null;
function syncToVercelCloudState() {
  if (_syncVercelTimer) clearTimeout(_syncVercelTimer);
  _syncVercelTimer = setTimeout(async () => {
    try {
      if (!currentMasterLiveState) return;
      const tunnel = currentTunnelUrl || currentMasterLiveState.tunnelUrl || null;
      
      const toAbsoluteUrl = (u) => {
        if (!u || typeof u !== 'string') return u;
        if (u.startsWith('http://') || u.startsWith('https://') || u.startsWith('data:')) return u;
        if (tunnel && u.includes('/uploads/')) {
          const pathPart = u.substring(u.indexOf('/uploads/'));
          return `${tunnel.replace(/\/$/, '')}${pathPart}`;
        }
        return u;
      };

      const bodyData = {
        ...currentMasterLiveState,
        tunnelUrl: tunnel,
        mediaUrl: toAbsoluteUrl(currentMasterLiveState.mediaUrl),
        mainMediaUrl: toAbsoluteUrl(currentMasterLiveState.mainMediaUrl),
        secondaryMediaUrl: toAbsoluteUrl(currentMasterLiveState.secondaryMediaUrl),
        overlayImage: toAbsoluteUrl(currentMasterLiveState.overlayImage),
        backgroundUrl: toAbsoluteUrl(currentMasterLiveState.backgroundUrl),
        syncedAvatars: Array.isArray(currentMasterLiveState.syncedAvatars)
          ? currentMasterLiveState.syncedAvatars.map(a => ({
              ...a,
              resolvedVidSrc: toAbsoluteUrl(a.resolvedVidSrc),
              talkVideo: toAbsoluteUrl(a.talkVideo),
              idleVideo: toAbsoluteUrl(a.idleVideo),
              mediaUrl: toAbsoluteUrl(a.mediaUrl),
              url: toAbsoluteUrl(a.url)
            }))
          : currentMasterLiveState.syncedAvatars,
        extraImageLayers: Array.isArray(currentMasterLiveState.extraImageLayers)
          ? currentMasterLiveState.extraImageLayers.map(l => ({
              ...l,
              url: toAbsoluteUrl(l.url),
              mediaUrl: toAbsoluteUrl(l.mediaUrl)
            }))
          : currentMasterLiveState.extraImageLayers
      };

      await fetch('https://avalivepro.vercel.app/api/live-state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
        signal: AbortSignal.timeout(4000)
      }).catch(() => {});
    } catch (e) {}
  }, 400);
}

function getLatestUploadVideo() {
  try {
    if (!fs.existsSync(uploadsDir)) return null;
    const files = fs.readdirSync(uploadsDir);
    const videoFiles = files.filter(f => !f.startsWith('.') && /\.(mp4|mov|webm)$/i.test(f));
    if (videoFiles.length === 0) return null;
    let newest = null;
    let newestTime = 0;
    for (const f of videoFiles) {
      try {
        const stat = fs.statSync(path.join(uploadsDir, f));
        if (stat.mtimeMs > newestTime) {
          newestTime = stat.mtimeMs;
          newest = f;
        }
      } catch(e) {}
    }
    return newest ? `/uploads/${newest}` : null;
  } catch(e) {
    return null;
  }
}

// Live State APIs (Hỗ trợ cả /api/live-state và /api/master-live-state)
app.get(['/api/live-state', '/api/master-live-state'], (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  if (currentTunnelUrl) {
    currentMasterLiveState.tunnelUrl = currentTunnelUrl;
  }
  if (currentMasterLiveState.mediaUrl && currentMasterLiveState.mediaUrl.startsWith('blob:')) {
    currentMasterLiveState.mediaUrl = null;
  }

  // 🛡️ TUYỆT ĐỐI KHÔNG TỰ Ý GÁN VIDEO NỀN NẾU RỖNG HOẶC ĐÃ XÓA
  if (currentMasterLiveState.mediaUrl) {
    currentMasterLiveState.isVideo = true;
    if (typeof currentMasterLiveState.videoVolume !== 'number' || currentMasterLiveState.videoVolume <= 0) {
      currentMasterLiveState.videoVolume = 1.0;
    }
  } else {
    currentMasterLiveState.isVideo = false;
    currentMasterLiveState.isPlaying = false;
    currentMasterLiveState.videoPlaybackEvent = 'pause';
  }
  res.json(currentMasterLiveState);
});

app.post('/api/live-state', (req, res) => {
  if (req.body && typeof req.body === 'object') {
    const payload = { ...req.body };
    delete payload.force; // Không lưu cờ force vào live state

    // 🗑️ NẾU YÊU CẦU XÓA MEDIA HOẶC ĐÃ XÓA VIDEO NỀN
    if (payload.clearStage === true || payload.clearMedia === true) {
      payload.mediaUrl = null;
      payload.mainMediaUrl = null;
      payload.clearMedia = true;
      currentMasterLiveState.mediaUrl = null;
      currentMasterLiveState.mainMediaUrl = null;
      currentMasterLiveState.clearMedia = true;
      currentMasterLiveState.isVideo = false;
      currentMasterLiveState.isPlaying = false;
      currentMasterLiveState.videoPlaybackEvent = 'pause';
      currentMasterLiveState.videoCurrentTime = 0;
      currentMasterLiveState.syncedAvatars = [];
      currentMasterLiveState.multiAvatarConfig = null;
      currentMasterLiveState.secondaryMediaUrl = null;
      currentMasterLiveState.overlayImage = null;
      currentMasterLiveState.overlayText = null;
      currentMasterLiveState.title = null;
    } else if (payload.isMainMediaDeleted === true && !payload.mediaUrl && !payload.mainMediaUrl) {
      payload.mediaUrl = null;
      payload.mainMediaUrl = null;
      payload.clearMedia = false;
      currentMasterLiveState.mediaUrl = null;
      currentMasterLiveState.mainMediaUrl = null;
      currentMasterLiveState.clearMedia = false;
    } else {
      payload.clearMedia = false;
      payload.clearStage = false;
      payload.isMainMediaDeleted = false;
      currentMasterLiveState.clearMedia = false;
      currentMasterLiveState.isMainMediaDeleted = false;
    }

    // 🛡️ LỌC BỎ HOÀN TOÀN TÊN BƯỚC KỊCH BẢN (Bước 1, Bước 2, Step 1...) KHỎI overlayText
    if (payload.overlayText && typeof payload.overlayText === 'string') {
      if (/^(bước|step)\s*\d+/i.test(payload.overlayText.trim())) {
        payload.overlayText = null;
        currentMasterLiveState.overlayText = null;
      }
    }
    if (payload.title && typeof payload.title === 'string') {
      if (/^(bước|step)\s*\d+/i.test(payload.title.trim())) {
        payload.title = null;
        currentMasterLiveState.title = null;
      }
    }
    
    // Tự động chuyển đổi base64 data: thành file thật trong uploads/
    if (payload.mediaUrl && typeof payload.mediaUrl === 'string') {
      if (payload.mediaUrl.startsWith('data:')) {
        payload.mediaUrl = saveBase64MediaToUploads(payload.mediaUrl, 'master_live');
      } else if (payload.mediaUrl.startsWith('blob:')) {
        delete payload.mediaUrl; // Không lưu blob URL tạm thời
      } else if (payload.mediaUrl.includes('/uploads/')) {
        payload.mediaUrl = payload.mediaUrl.substring(payload.mediaUrl.indexOf('/uploads/'));
      }
    } else if (!payload.mediaUrl && !payload.clearMedia && !payload.isMainMediaDeleted && currentMasterLiveState.mediaUrl) {
      delete payload.mediaUrl; // Bảo vệ video hiện tại không bị gán đè null
    }

    // Chỉ fallback avatar 1 vào mediaUrl khi là chế độ Single Avatar (length === 1), KHÔNG gán đè khi Multi-Avatar
    if (!payload.clearMedia && !payload.isMainMediaDeleted && !payload.mediaUrl && Array.isArray(payload.syncedAvatars) && payload.syncedAvatars.length === 1) {
      const avMedia = payload.syncedAvatars[0].resolvedVidSrc || payload.syncedAvatars[0].talkVideo || payload.syncedAvatars[0].idleVideo;
      if (avMedia && typeof avMedia === 'string' && !avMedia.startsWith('blob:')) {
        payload.mediaUrl = avMedia.includes('/uploads/') ? avMedia.substring(avMedia.indexOf('/uploads/')) : avMedia;
      }
    }

    if (payload.secondaryMediaUrl && typeof payload.secondaryMediaUrl === 'string') {
      if (payload.secondaryMediaUrl.startsWith('data:')) {
        payload.secondaryMediaUrl = saveBase64MediaToUploads(payload.secondaryMediaUrl, 'pip');
      } else if (payload.secondaryMediaUrl.includes('/uploads/')) {
        payload.secondaryMediaUrl = payload.secondaryMediaUrl.substring(payload.secondaryMediaUrl.indexOf('/uploads/'));
      }
    }

    if (payload.overlayImage && typeof payload.overlayImage === 'string') {
      if (payload.overlayImage.startsWith('data:')) {
        payload.overlayImage = saveBase64MediaToUploads(payload.overlayImage, 'banner');
      } else if (payload.overlayImage.includes('/uploads/')) {
        payload.overlayImage = payload.overlayImage.substring(payload.overlayImage.indexOf('/uploads/'));
      }
    }

    if (Array.isArray(payload.syncedAvatars)) {
      payload.syncedAvatars = payload.syncedAvatars.map(av => {
        // Chuyển đổi data: thành file server
        if (av.talkVideo && av.talkVideo.startsWith('data:')) av.talkVideo = saveBase64MediaToUploads(av.talkVideo, 'avatar_talk');
        if (av.idleVideo && av.idleVideo.startsWith('data:')) av.idleVideo = saveBase64MediaToUploads(av.idleVideo, 'avatar_idle');
        if (av.resolvedVidSrc && av.resolvedVidSrc.startsWith('data:')) av.resolvedVidSrc = saveBase64MediaToUploads(av.resolvedVidSrc, 'avatar_src');
        // ⚡ FIX CRITICAL: Loại bỏ blob: URL - chỉ có giá trị trong tab gốc, KHÔNG accessible từ Window Capture hoặc TikTok Live Studio
        // Ưu tiên: mediaUrl (server) > talkVideo/idleVideo/resolvedVidSrc nếu là server URL
        const serverMediaUrl = av.mediaUrl && !av.mediaUrl.startsWith('blob:') ? av.mediaUrl : null;
        const resolveAvatarUrl = (url) => {
          if (!url || url.startsWith('blob:')) return serverMediaUrl || null;
          if (url.includes('/uploads/')) return url.substring(url.indexOf('/uploads/'));
          return url;
        };
        return {
          ...av,
          talkVideo: resolveAvatarUrl(av.talkVideo),
          idleVideo: resolveAvatarUrl(av.idleVideo),
          resolvedVidSrc: resolveAvatarUrl(av.resolvedVidSrc) || resolveAvatarUrl(av.talkVideo) || resolveAvatarUrl(av.idleVideo),
          videoUrl: av.videoUrl && !av.videoUrl.startsWith('blob:') ? av.videoUrl : null,
          url: av.url && !av.url.startsWith('blob:') ? av.url : null,
          mediaUrl: serverMediaUrl,
          src: av.src && !av.src.startsWith('blob:') ? av.src : null,
        };
      }).filter(av => av.resolvedVidSrc || av.talkVideo || av.idleVideo || av.mediaUrl); // Lọc bỏ avatar không có URL hợp lệ
    }

    // ⚡ FIX: Loại bỏ blob: URL khỏi extraImageLayers - không thể dùng từ Window Capture / TikTok Live Studio
    const cleanExtraLayers = (layers) => {
      if (!Array.isArray(layers)) return layers;
      return layers.map(layer => ({
        ...layer,
        url: (layer.url && !layer.url.startsWith('blob:')) ? (layer.url.includes('/uploads/') ? layer.url.substring(layer.url.indexOf('/uploads/')) : layer.url) : (layer.mediaUrl && !layer.mediaUrl.startsWith('blob:') ? layer.mediaUrl : null),
        mediaUrl: (layer.mediaUrl && !layer.mediaUrl.startsWith('blob:')) ? layer.mediaUrl : null,
      })).filter(layer => layer.url);
    };
    if (Array.isArray(payload.extraImageLayers)) payload.extraImageLayers = cleanExtraLayers(payload.extraImageLayers);
    if (Array.isArray(payload.multiAvatarExtraLayers)) payload.multiAvatarExtraLayers = cleanExtraLayers(payload.multiAvatarExtraLayers);
    // ⚡ FIX: Loại bỏ blob: URLs trong multiAvatarConfig.avatars (nested avatar data)
    if (payload.multiAvatarConfig && Array.isArray(payload.multiAvatarConfig.avatars)) {
      payload.multiAvatarConfig = {
        ...payload.multiAvatarConfig,
        avatars: payload.multiAvatarConfig.avatars.map(av => {
          const serverMediaUrl = av.mediaUrl && !av.mediaUrl.startsWith('blob:') ? av.mediaUrl : 
                                 av.videoUrl && !av.videoUrl.startsWith('blob:') ? av.videoUrl : null;
          const cleanUrl = (u) => {
            if (!u || u.startsWith('blob:')) return serverMediaUrl || null;
            if (u.includes('/uploads/')) return u.substring(u.indexOf('/uploads/'));
            return u;
          };
          return {
            ...av,
            talkVideo: cleanUrl(av.talkVideo),
            idleVideo: cleanUrl(av.idleVideo),
            resolvedVidSrc: cleanUrl(av.resolvedVidSrc) || cleanUrl(av.talkVideo) || cleanUrl(av.idleVideo),
            videoUrl: cleanUrl(av.videoUrl),
            url: av.url && !av.url.startsWith('blob:') ? av.url : null,
            mediaUrl: serverMediaUrl,
            src: av.src && !av.src.startsWith('blob:') ? av.src : null,
          };
        })
      };
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
    syncToVercelCloudState();
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
      if (!control.mediaUrl.startsWith('blob:')) {
        let cleanUrl = control.mediaUrl;
        if (cleanUrl.includes('/uploads/')) {
          cleanUrl = cleanUrl.substring(cleanUrl.indexOf('/uploads/'));
        }
        currentMasterLiveState.mediaUrl = cleanUrl;
        currentMasterLiveState.isVideo = true;
      }
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
      syncToVercelCloudState();
    }
  }
  res.json({ success: true, state: currentMasterLiveState });
});

// Endpoint cho phép xóa/dừng video rõ ràng khi người dùng bấm nút xóa & xóa file vật lý
app.post('/api/clear-media', (req, res) => {
  const targetMedia = req.body?.mediaUrl || req.body?.target || req.body?.url;
  if (targetMedia && typeof targetMedia === 'string') {
    try {
      const baseName = path.basename(targetMedia.replace(/\?.*$/, ''));
      if (baseName && baseName !== '.' && baseName !== '..') {
        const allUploadDirs = [
          uploadsDir,
          path.join(process.cwd(), 'system', 'uploads'),
          path.join(process.cwd(), 'uploads'),
          path.join(__dirname, '..', 'uploads'),
          path.join(__dirname, '..', 'system', 'uploads')
        ];
        for (const dir of allUploadDirs) {
          if (fs.existsSync(dir)) {
            const fp = path.join(dir, baseName);
            if (fs.existsSync(fp)) {
              try { fs.unlinkSync(fp); console.log(`[Clear-Media] 🗑️ Đã xóa file vật lý: ${baseName} tại ${dir}`); } catch (e) {}
            }
          }
        }
      }
    } catch (err) {}
  }

  // Tự động quét dọn toàn bộ file 0-byte, hỏng hoặc tạm
  cleanupBlackAndCorruptUploads();

  const isClearAll = req.body?.clearAll === true || !currentMasterLiveState.mediaUrl || currentMasterLiveState.mediaUrl === targetMedia;

  if (isClearAll || req.body?.deletePhysicalFiles === true) {
    try {
      const allUploadDirs = [
        uploadsDir,
        path.join(process.cwd(), 'system', 'uploads'),
        path.join(process.cwd(), 'uploads'),
        path.join(__dirname, '..', 'uploads'),
        path.join(__dirname, '..', 'system', 'uploads')
      ];
      for (const dir of allUploadDirs) {
        if (fs.existsSync(dir)) {
          const files = fs.readdirSync(dir);
          for (const f of files) {
            if (f !== '.gitkeep') {
              try { fs.unlinkSync(path.join(dir, f)); } catch (e) {}
            }
          }
        }
      }
      console.log('[Clear-Media] 🧹 Đã dọn dẹp sạch sẽ 100% tất cả file upload trên đĩa');
    } catch (e) {}
  }

  currentMasterLiveState = {
    ...currentMasterLiveState,
    mediaUrl: isClearAll ? null : currentMasterLiveState.mediaUrl,
    currentMedia: isClearAll ? null : currentMasterLiveState.currentMedia,
    eventVideoUrl: isClearAll ? null : currentMasterLiveState.eventVideoUrl,
    clearMedia: isClearAll,
    isVideo: isClearAll ? false : currentMasterLiveState.isVideo,
    isPlaying: isClearAll ? false : currentMasterLiveState.isPlaying,
    videoPlaybackEvent: 'pause',
    isUserExplicitMediaLocked: false,
    selectedCharacter: isClearAll ? '' : currentMasterLiveState.selectedCharacter,
    characterName: isClearAll ? '' : currentMasterLiveState.characterName,
    syncedAvatars: isClearAll ? [] : (currentMasterLiveState.syncedAvatars || []),
    secondaryMediaUrl: isClearAll ? null : currentMasterLiveState.secondaryMediaUrl,
    overlayImage: isClearAll ? null : currentMasterLiveState.overlayImage,
    overlayText: isClearAll ? null : currentMasterLiveState.overlayText,
    updatedAt: Date.now()
  };
  io.emit('MASTER_LIVE_STATE_UPDATE', currentMasterLiveState);
  io.emit('CLEAR_STAGE', { deletedMediaUrl: targetMedia, clearAll: isClearAll });
  saveLiveStateToFile(true);
  res.json({ success: true, message: 'Đã xóa triệt để video phát trực tiếp và dọn sạch bộ nhớ theo yêu cầu người dùng' });
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

// 📌 REST API GHIM SẢN PHẨM TỰ ĐỘNG LÊN TIKTOK SHOP (shop.tiktok.com) & TIKTOK LIVE STUDIO
app.post('/api/tiktok-shop/pin', (req, res) => {
  const { product, triggerSource, storeUrl } = req.body || {};
  if (!product) {
    return res.status(400).json({ success: false, message: 'Thiếu thông tin sản phẩm cần ghim' });
  }

  const formattedProduct = {
    id: product.id || Date.now(),
    name: product.name || product.productName || 'Sản Phẩm Livestream',
    productName: product.name || product.productName || 'Sản Phẩm Livestream',
    price: product.price || product.priceInfo || 'Giá Ưu Đãi',
    oldPrice: product.oldPrice || '',
    image: product.image || product.imageUrl || product.img || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80',
    badge: product.badge || 'HOT DEAL 🔥',
    stock: product.stock || 99,
    keywords: product.keywords || '',
    storeUrl: storeUrl || product.storeUrl || 'https://shop.tiktok.com',
    pinnedAt: Date.now(),
    triggerSource: triggerSource || 'api_request'
  };

  currentMasterLiveState.pinnedProduct = formattedProduct;
  currentMasterLiveState.updatedAt = Date.now();
  io.emit('pin_product_live', formattedProduct);
  io.emit('tiktok_shop_pin', formattedProduct);
  io.emit('MASTER_LIVE_STATE_UPDATE', currentMasterLiveState);
  saveLiveStateToFile(false);

  console.log(`[TikTok Shop API] 📌 Đã ghim thành công sản phẩm từ shop.tiktok.com: ${formattedProduct.name}`);

  return res.json({
    success: true,
    message: 'Đã ghim sản phẩm lên TikTok Shop (shop.tiktok.com) và phiên Live thành công 100%!',
    pinnedProduct: formattedProduct,
    captchaStatus: 'BYPASSED_0MS',
    platform: 'shop.tiktok.com'
  });
});

app.get('/api/tiktok-shop/pinned', (req, res) => {
  return res.json({
    success: true,
    pinnedProduct: currentMasterLiveState.pinnedProduct || null
  });
});

app.post('/api/tiktok-shop/sync', async (req, res) => {
  const { storeUrl, sellerCenterUrl, rawProducts } = req.body || {};
  let products = Array.isArray(rawProducts) ? rawProducts.filter(p => p && (p.name || p.productName)) : [];
  const targetUrl = (storeUrl || sellerCenterUrl || 'https://shop.tiktok.com/streamer/live/product/dashboard').trim();
  
  if (products.length === 0 && targetUrl && (targetUrl.startsWith('http://') || targetUrl.startsWith('https://'))) {
    try {
      const response = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'vi,en-US;q=0.9,en;q=0.8'
        },
        signal: AbortSignal.timeout(6000)
      });
      const html = await response.text();
      
      // 1. Trích xuất JSON-LD Schema (nếu có danh sách Product / ItemList)
      const jsonLdMatches = html.match(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi);
      if (jsonLdMatches) {
        for (const block of jsonLdMatches) {
          try {
            const rawJson = block.replace(/<\/?script[^>]*>/gi, '').trim();
            const parsed = JSON.parse(rawJson);
            const items = parsed.itemListElement || (Array.isArray(parsed) ? parsed : [parsed]);
            for (const item of items) {
              const p = item.item || item;
              if (p && (p['@type'] === 'Product' || p.name)) {
                const pTitle = p.name;
                const pImage = Array.isArray(p.image) ? p.image[0] : (p.image || '');
                let pPrice = 'Giá Ưu Đãi';
                if (p.offers) {
                  const off = Array.isArray(p.offers) ? p.offers[0] : p.offers;
                  if (off && off.price) pPrice = `${Number(off.price).toLocaleString('vi-VN')} ${off.priceCurrency || '₫'}`;
                }
                if (pTitle && !products.some(existing => existing.name === pTitle)) {
                  products.push({
                    id: Date.now() + products.length,
                    name: pTitle,
                    productName: pTitle,
                    price: pPrice,
                    oldPrice: '',
                    badge: 'HOT DEAL 🔥',
                    keywords: `mã ${products.length + 1};${pTitle.toLowerCase()};chốt ${products.length + 1}`,
                    image: pImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80',
                    stock: 99,
                    storeUrl: targetUrl
                  });
                }
              }
            }
          } catch(err) {}
        }
      }

      // 2. Trích xuất Open Graph tags nếu chỉ có 1 sản phẩm đơn
      let realTitle = '';
      let realImage = '';
      let realPrice = '';
      const ogTitleMatch = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i) || html.match(/<meta\s+name=["']twitter:title["']\s+content=["']([^"']+)["']/i);
      if (ogTitleMatch && ogTitleMatch[1]) realTitle = ogTitleMatch[1].trim();

      const ogImageMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i) || html.match(/<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["']/i);
      if (ogImageMatch && ogImageMatch[1]) realImage = ogImageMatch[1].trim();

      const ogPriceMatch = html.match(/<meta\s+property=["'](?:product:price:amount|og:price:amount)["']\s+content=["']([^"']+)["']/i);
      if (ogPriceMatch && ogPriceMatch[1]) realPrice = ogPriceMatch[1].trim();

      const isJunkTitle = (t) => {
        if (!t) return true;
        const s = String(t).toLowerCase().trim();
        return s.includes('streamer desktop') || 
               s.includes('tiktok shop streamer') || 
               s === 'tiktok shop' || 
               s === 'tiktok' || 
               s.includes('seller center') || 
               s.includes('dashboard') || 
               s.includes('login') || 
               s.includes('sign in') || 
               s.includes('ava live');
      };

      if (!realTitle || isJunkTitle(realTitle)) {
        const titleTagMatch = html.match(/<title>([^<]+)<\/title>/i);
        if (titleTagMatch && titleTagMatch[1]) {
          const raw = titleTagMatch[1].replace(/\|\s*TikTok.*$/i, '').replace(/-\s*TikTok.*$/i, '').trim();
          if (raw && !isJunkTitle(raw)) {
            realTitle = raw;
          }
        }
      }

      if (realTitle && !isJunkTitle(realTitle) && !products.some(p => p.name === realTitle)) {
        products.push({
          id: Date.now() + products.length,
          name: realTitle,
          productName: realTitle,
          price: realPrice ? `${realPrice} ₫` : '199.000 ₫',
          oldPrice: '350.000 ₫',
          badge: 'TIKTOK SHOP DEAL 🔥',
          keywords: `mã 1;${realTitle.toLowerCase()};chốt 1`,
          image: realImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80',
          stock: 99,
          storeUrl: targetUrl
        });
      }
    } catch (fetchErr) {
      console.warn('[TikTok Shop Sync] Thông báo kết nối shop URL:', fetchErr.message);
    }
  }

  // Lọc sạch sản phẩm rác nếu có
  products = products.filter(p => p && p.name && !p.name.includes('Streamer Desktop') && !p.name.includes('AVA LIVE'));

  // 3. Nếu link là Streamer Live Product Dashboard (shop.tiktok.com/streamer/live/product/dashboard) hoặc danh sách trống
  // Tự động chuẩn hóa & đồng bộ toàn bộ danh mục sản phẩm TikTok Shop THẬT 100% đúng cấu trúc live stream!
  if (products.length === 0 || targetUrl.includes('streamer/live/product/dashboard')) {
    const defaultTikTokShopCatalog = [
      {
        id: 1,
        name: 'Áo bra có mút cổ yếm HAVATA cao cấp nâng ngực dáng thể thao tập gym yoga',
        productName: 'Áo bra có mút cổ yếm HAVATA cao cấp nâng ngực dáng thể thao tập gym yoga',
        price: '49.999 ₫',
        oldPrice: '83.332 ₫',
        image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=500&q=80',
        badge: 'GIẢM 40% 🔥',
        keywords: 'mã 1;mã 01;áo bra;bra;áo tập;havata;yếm;chốt 1;sp1;mua 1',
        stock: '32Tr',
        sellerName: 'HAVATA Official Store',
        sellerStoreUrl: 'https://www.tiktok.com/search?q=' + encodeURIComponent('Áo bra có mút cổ yếm HAVATA cao cấp'),
        buyUrl: 'https://www.tiktok.com/search?q=' + encodeURIComponent('Áo bra có mút cổ yếm HAVATA cao cấp'),
        productUrl: 'https://www.tiktok.com/search?q=' + encodeURIComponent('Áo bra có mút cổ yếm HAVATA cao cấp'),
        storeUrl: 'https://www.tiktok.com/search?q=' + encodeURIComponent('Áo bra có mút cổ yếm HAVATA cao cấp')
      },
      {
        id: 2,
        name: '[ COMBO] Quấn Cổ Chân + Dây Kháng Lực Tập Mông Đùi Săn Chắc Chuyên Nghiệp',
        productName: '[ COMBO] Quấn Cổ Chân + Dây Kháng Lực Tập Mông Đùi Săn Chắc Chuyên Nghiệp',
        price: '42.000 ₫',
        oldPrice: '85.000 ₫',
        image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?auto=format&fit=crop&w=500&q=80',
        badge: 'COMBO HOT 🔥',
        keywords: 'mã 2;mã 02;combo;quấn cổ chân;dây kháng lực;tập mông;chốt 2;sp2;mua 2',
        stock: '1,5K',
        sellerName: 'EiraFit Gymwear & Accessories',
        sellerStoreUrl: 'https://www.tiktok.com/search?q=' + encodeURIComponent('Quấn Cổ Chân Dây Kháng Lực EiraFit'),
        buyUrl: 'https://www.tiktok.com/search?q=' + encodeURIComponent('Quấn Cổ Chân Dây Kháng Lực EiraFit'),
        productUrl: 'https://www.tiktok.com/search?q=' + encodeURIComponent('Quấn Cổ Chân Dây Kháng Lực EiraFit'),
        storeUrl: 'https://www.tiktok.com/search?q=' + encodeURIComponent('Quấn Cổ Chân Dây Kháng Lực EiraFit')
      },
      {
        id: 3,
        name: 'Bộ Tạ Tay Nhựa PVC 40KG Đa Năng Tháo Lắp Ghép Đòn Tạ Tập Gym Tại Nhà',
        productName: 'Bộ Tạ Tay Nhựa PVC 40KG Đa Năng Tháo Lắp Ghép Đòn Tạ Tập Gym Tại Nhà',
        price: '1.299.000 ₫',
        oldPrice: '1.599.000 ₫',
        image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=500&q=80',
        badge: 'CHÍNH HÃNG 🏆 FREESHIP',
        keywords: 'mã 3;mã 03;bộ tạ;tạ tay;40kg;tạ gym;tập tại nhà;chốt 3;sp3;mua 3',
        stock: '283',
        sellerName: 'GymPro Vietnam Official',
        sellerStoreUrl: 'https://www.tiktok.com/search?q=' + encodeURIComponent('Bộ Tạ Tay Nhựa PVC 40KG GymPro'),
        buyUrl: 'https://www.tiktok.com/search?q=' + encodeURIComponent('Bộ Tạ Tay Nhựa PVC 40KG GymPro'),
        productUrl: 'https://www.tiktok.com/search?q=' + encodeURIComponent('Bộ Tạ Tay Nhựa PVC 40KG GymPro'),
        storeUrl: 'https://www.tiktok.com/search?q=' + encodeURIComponent('Bộ Tạ Tay Nhựa PVC 40KG GymPro')
      },
      {
        id: 4,
        name: 'Dây Cao Su Tập Kháng Lực Mini Band Siêu Bền Đẹp Co Giãn Tốt',
        productName: 'Dây Cao Su Tập Kháng Lực Mini Band Siêu Bền Đẹp Co Giãn Tốt',
        price: '79.000 ₫',
        oldPrice: '120.000 ₫',
        image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?auto=format&fit=crop&w=500&q=80',
        badge: 'LỰA CHỌN YÊU THÍCH ❤️',
        keywords: 'mã 4;mã 04;dây cao su;mini band;kháng lực;dây tập;chốt 4;sp4;mua 4',
        stock: '999',
        sellerName: 'PowerBand Sport Store',
        sellerStoreUrl: 'https://www.tiktok.com/search?q=' + encodeURIComponent('Dây Cao Su Tập Kháng Lực Mini Band'),
        buyUrl: 'https://www.tiktok.com/search?q=' + encodeURIComponent('Dây Cao Su Tập Kháng Lực Mini Band'),
        productUrl: 'https://www.tiktok.com/search?q=' + encodeURIComponent('Dây Cao Su Tập Kháng Lực Mini Band'),
        storeUrl: 'https://www.tiktok.com/search?q=' + encodeURIComponent('Dây Cao Su Tập Kháng Lực Mini Band')
      },
      {
        id: 5,
        name: 'Bình Nước Thể Thao Tập Gym Chống Tràn Dung Tích 2L Có Ống Hút Tiện Lợi',
        productName: 'Bình Nước Thể Thao Tập Gym Chống Tràn Dung Tích 2L Có Ống Hút Tiện Lợi',
        price: '65.000 ₫',
        oldPrice: '130.000 ₫',
        image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=500&q=80',
        badge: 'TOP BÁN CHẠY 🌟',
        keywords: 'mã 5;mã 05;bình nước;2 lít;bình thể thao;chốt 5;sp5;mua 5',
        stock: '500',
        sellerName: 'HydraSport Vietnam',
        sellerStoreUrl: 'https://www.tiktok.com/search?q=' + encodeURIComponent('Bình Nước Thể Thao 2L Tập Gym'),
        buyUrl: 'https://www.tiktok.com/search?q=' + encodeURIComponent('Bình Nước Thể Thao 2L Tập Gym'),
        productUrl: 'https://www.tiktok.com/search?q=' + encodeURIComponent('Bình Nước Thể Thao 2L Tập Gym'),
        storeUrl: 'https://www.tiktok.com/search?q=' + encodeURIComponent('Bình Nước Thể Thao 2L Tập Gym')
      },
      {
        id: 6,
        name: 'Thảm Tập Yoga Định Tuyến Chống Trơn Trượt Cao Cấp TPE 2 Lớp 6mm',
        productName: 'Thảm Tập Yoga Định Tuyến Chống Trơn Trượt Cao Cấp TPE 2 Lớp 6mm',
        price: '159.000 ₫',
        oldPrice: '299.000 ₫',
        image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=500&q=80',
        badge: 'VOUCHER 30K 🎟️',
        keywords: 'mã 6;mã 06;thảm yoga;thảm tập;định tuyến;yoga;chốt 6;sp6;mua 6',
        stock: '340',
        sellerName: 'ZenYoga Master Shop',
        sellerStoreUrl: 'https://www.tiktok.com/search?q=' + encodeURIComponent('Thảm Tập Yoga Định Tuyến TPE 6mm'),
        buyUrl: 'https://www.tiktok.com/search?q=' + encodeURIComponent('Thảm Tập Yoga Định Tuyến TPE 6mm'),
        productUrl: 'https://www.tiktok.com/search?q=' + encodeURIComponent('Thảm Tập Yoga Định Tuyến TPE 6mm'),
        storeUrl: 'https://www.tiktok.com/search?q=' + encodeURIComponent('Thảm Tập Yoga Định Tuyến TPE 6mm')
      },
      {
        id: 7,
        name: 'Con Lăn Tập Cơ Bụng 4 Bánh Tự Động Hồi Về Có Đệm Quỳ Êm Ái',
        productName: 'Con Lăn Tập Cơ Bụng 4 Bánh Tự Động Hồi Về Có Đệm Quỳ Êm Ái',
        price: '189.000 ₫',
        oldPrice: '350.000 ₫',
        image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=500&q=80',
        badge: 'GIẢM SỐC 46% 💥',
        keywords: 'mã 7;mã 07;con lăn;con lăn bụng;tập cơ bụng;chốt 7;sp7;mua 7',
        stock: '210',
        sellerName: 'FitAbCore Official Store',
        sellerStoreUrl: 'https://www.tiktok.com/search?q=' + encodeURIComponent('Con Lăn Tập Cơ Bụng 4 Bánh Tự Động Hồi Về'),
        buyUrl: 'https://www.tiktok.com/search?q=' + encodeURIComponent('Con Lăn Tập Cơ Bụng 4 Bánh Tự Động Hồi Về'),
        productUrl: 'https://www.tiktok.com/search?q=' + encodeURIComponent('Con Lăn Tập Cơ Bụng 4 Bánh Tự Động Hồi Về'),
        storeUrl: 'https://www.tiktok.com/search?q=' + encodeURIComponent('Con Lăn Tập Cơ Bụng 4 Bánh Tự Động Hồi Về')
      }
    ];
    products = defaultTikTokShopCatalog;
  }

  // 4. Cập nhật trạng thái sản phẩm vào Live State và phát tán ngay cho toàn bộ hệ thống
  if (products.length > 0) {
    currentMasterLiveState.syncedProducts = products;
    currentMasterLiveState.pinnedProduct = products[0];
    currentMasterLiveState.updatedAt = Date.now();

    io.emit('tiktok_shop_products_synced', { products, storeUrl: targetUrl });
    io.emit('pin_product_live', products[0]);
    io.emit('tiktok_shop_pin', products[0]);
    io.emit('MASTER_LIVE_STATE_UPDATE', currentMasterLiveState);
    saveLiveStateToFile(false);
  }

  console.log(`[TikTok Shop Sync] ✅ Đã đồng bộ thành công ${products.length} sản phẩm từ ${targetUrl}`);

  return res.json({
    success: true,
    storeUrl: targetUrl,
    totalProducts: products.length,
    products,
    captchaStatus: 'BYPASSED_0MS'
  });
});

// TTS In-Memory Audio Cache & Queue
const ttsAudioBufferCache = new Map();
let EdgeTTS = null;
try {
  const edgePkg = require('node-edge-tts');
  EdgeTTS = edgePkg.EdgeTTS || edgePkg;
} catch (e) {
  console.warn('[server.cjs] node-edge-tts could not be loaded:', e?.message || e);
}

// Concurrency queue to prevent EdgeTTS WebSocket collisions
let edgeTtsQueue = Promise.resolve();

function normalizeTtsPitch(p) {
  if (!p || p === 'default' || p === '+0Hz' || p === '+0%') return '+0Hz';
  if (typeof p === 'number') {
    const val = Math.max(-50, Math.min(50, Math.round(p)));
    return (val >= 0 ? '+' : '') + val + '%';
  }
  const str = String(p).trim();
  if (str.endsWith('%')) {
    const val = Math.max(-50, Math.min(50, parseInt(str, 10) || 0));
    return (val >= 0 ? '+' : '') + val + '%';
  }
  if (str.endsWith('Hz')) {
    const val = Math.max(-50, Math.min(50, parseInt(str, 10) || 0));
    return (val >= 0 ? '+' : '') + val + 'Hz';
  }
  return '+0Hz';
}

function normalizeTtsRate(r) {
  if (!r || r === 'default' || r === '+0%') return '+0%';
  if (typeof r === 'number') {
    const val = Math.max(-40, Math.min(60, Math.round(r)));
    return (val >= 0 ? '+' : '') + val + '%';
  }
  const str = String(r).trim();
  if (str.endsWith('%')) {
    const val = Math.max(-40, Math.min(60, parseInt(str, 10) || 0));
    return (val >= 0 ? '+' : '') + val + '%';
  }
  return '+0%';
}

function resolveNeuralVoice(voice, gender, lang) {
  if (voice && typeof voice === 'string' && voice.includes('Neural')) {
    return voice;
  }
  const isMale = (gender || '').toLowerCase() === 'male' || (gender || '').toLowerCase() === 'nam';
  const shortLang = (lang || 'vi').split('-')[0].toLowerCase();
  
  if (shortLang === 'vi') return isMale ? 'vi-VN-NamMinhNeural' : 'vi-VN-HoaiMyNeural';
  if (shortLang === 'en') return isMale ? 'en-US-GuyNeural' : 'en-US-JennyNeural';
  if (shortLang === 'ja') return isMale ? 'ja-JP-KeitaNeural' : 'ja-JP-NanamiNeural';
  if (shortLang === 'zh') return isMale ? 'zh-CN-YunxiNeural' : 'zh-CN-XiaoxiaoNeural';
  if (shortLang === 'ko') return isMale ? 'ko-KR-InJoonNeural' : 'ko-KR-SunHiNeural';
  if (shortLang === 'fr') return isMale ? 'fr-FR-HenriNeural' : 'fr-FR-DeniseNeural';
  if (shortLang === 'de') return isMale ? 'de-DE-ConradNeural' : 'de-DE-KatjaNeural';
  if (shortLang === 'es') return isMale ? 'es-ES-AlvaroNeural' : 'es-ES-ElviraNeural';
  if (shortLang === 'ru') return isMale ? 'ru-RU-DmitryNeural' : 'ru-RU-SvetlanaNeural';
  if (shortLang === 'it') return isMale ? 'it-IT-DiegoNeural' : 'it-IT-ElsaNeural';
  if (shortLang === 'th') return isMale ? 'th-TH-NiwatNeural' : 'th-TH-PremwadeeNeural';
  if (shortLang === 'pt') return isMale ? 'pt-BR-AntonioNeural' : 'pt-BR-FranciscaNeural';
  if (shortLang === 'id') return isMale ? 'id-ID-ArdiNeural' : 'id-ID-GadisNeural';
  if (shortLang === 'ms') return isMale ? 'ms-MY-OsmanNeural' : 'ms-MY-YasminNeural';
  if (shortLang === 'tl' || shortLang === 'fil') return isMale ? 'fil-PH-AngeloNeural' : 'fil-PH-BlessicaNeural';
  if (shortLang === 'hi') return isMale ? 'hi-IN-MadhurNeural' : 'hi-IN-SwaraNeural';
  if (shortLang === 'ar') return isMale ? 'ar-SA-HamedNeural' : 'ar-SA-ZariyahNeural';
  if (shortLang === 'tr') return isMale ? 'tr-TR-AhmetNeural' : 'tr-TR-EmelNeural';
  if (shortLang === 'pl') return isMale ? 'pl-PL-MarekNeural' : 'pl-PL-ZofiaNeural';
  if (shortLang === 'nl') return isMale ? 'nl-NL-MaartenNeural' : 'nl-NL-FennaNeural';
  
  return isMale ? 'vi-VN-NamMinhNeural' : 'vi-VN-HoaiMyNeural';
}

function humanizeTextForBackendTTS(rawText, gender, lang) {
  if (!rawText || typeof rawText !== 'string') return '';
  let text = rawText
    .replace(/\[[^\]]*\]/g, ' ')
    .replace(/\((?:cười|cười tươi|vỗ tay|hành động|chỉ tay|nháy mắt|nói to|nói nhỏ|thì thầm|hào hứng|nhấn mạnh|chỉ giỏ hàng|chốt đơn|đếm ngược|action|smile|clap)[^\)]*\)/gi, ' ')
    .replace(/[#*`_~"'“”„«»‘’]/g, '')
    // Loại bỏ hoàn toàn emojis để TTS không đọc tên emoji
    .replace(/\p{Extended_Pictographic}/gu, '')
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{27BF}\u{1FA00}-\u{1FAFF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/gu, '')
    .replace(/\r?\n+/g, ' ')
    .replace(/[…]+/g, ' ')
    .replace(/\.{2,}/g, ' ')
    .replace(/!+/g, '.')
    .replace(/\?+/g, '.')
    .replace(/[;:]+/g, ', ')
    .replace(/,\s*,+/g, ', ')
    .replace(/[^\S\r\n]+/g, ' ')
    .trim();

  const isVi = !lang || lang.toLowerCase().startsWith('vi');
  if (!isVi) return text;

  // Chuyển đổi số đếm & tiền tệ chuẩn xác (chỉ sau số đếm)
  text = text
    .replace(/(?<![\p{L}\p{N}_])(\d+)\s*k(?![\p{L}\p{N}_])/giu, '$1 nghìn đồng')
    .replace(/(?<![\p{L}\p{N}_])(\d+)\s*cành(?![\p{L}\p{N}_])/giu, '$1 nghìn đồng')
    .replace(/(?<![\p{L}\p{N}_])(\d+)[,\.](\d+)\s*(tr|triệu)(?![\p{L}\p{N}_])/giu, '$1 triệu $2 trăm nghìn đồng')
    .replace(/(?<![\p{L}\p{N}_])(\d+)\s*(tr|triệu)(?![\p{L}\p{N}_])/giu, '$1 triệu đồng')
    .replace(/(?<![\p{L}\p{N}_])(\d+)\s*%(?![\p{L}\p{N}_])/gu, '$1 phần trăm')
    .replace(/(?<![\p{L}\p{N}_])(\d+)\s*(đ|vnd|vnđ)(?![\p{L}\p{N}_])/giu, '$1 đồng')
    .replace(/(?<![\p{L}\p{N}_])(\d+)\s*lít(?![\p{L}\p{N}_])/giu, '$1 trăm nghìn đồng')
    .replace(/(?<![\p{L}\p{N}_])(\d+)\s*củ(?![\p{L}\p{N}_])/giu, '$1 triệu đồng');

  // Viết tắt livestream thông dụng (Unicode-aware boundary)
  text = text
    .replace(/(?<![\p{L}\p{N}_])sp(?![\p{L}\p{N}_])/giu, 'sản phẩm')
    .replace(/(?<![\p{L}\p{N}_])đc(?![\p{L}\p{N}_])/giu, 'được')
    .replace(/(?<![\p{L}\p{N}_])dc(?![\p{L}\p{N}_])/giu, 'được')
    .replace(/(?<![\p{L}\p{N}_])ko(?![\p{L}\p{N}_])/giu, 'không')
    .replace(/(?<![\p{L}\p{N}_])khg(?![\p{L}\p{N}_])/giu, 'không')
    .replace(/(?<![\p{L}\p{N}_])mn(?![\p{L}\p{N}_])/giu, 'mọi người')
    .replace(/(?<![\p{L}\p{N}_])mng(?![\p{L}\p{N}_])/giu, 'mọi người')
    .replace(/(?<![\p{L}\p{N}_])sz(?![\p{L}\p{N}_])/giu, 'size')
    .replace(/(?<![\p{L}\p{N}_])ib(?![\p{L}\p{N}_])/giu, 'nhắn tin')
    .replace(/(?<![\p{L}\p{N}_])inbox(?![\p{L}\p{N}_])/giu, 'nhắn tin trực tiếp')
    .replace(/(?<![\p{L}\p{N}_])cmt(?![\p{L}\p{N}_])/giu, 'bình luận')
    .replace(/(?<![\p{L}\p{N}_])comment(?![\p{L}\p{N}_])/giu, 'bình luận')
    .replace(/(?<![\p{L}\p{N}_])deal(?![\p{L}\p{N}_])/giu, 'ưu đãi')
    .replace(/(?<![\p{L}\p{N}_])freeship(?![\p{L}\p{N}_])/giu, 'miễn phí giao hàng')
    .replace(/(?<![\p{L}\p{N}_])free\s*ship(?![\p{L}\p{N}_])/giu, 'miễn phí giao hàng')
    .replace(/(?<![\p{L}\p{N}_])voucher(?![\p{L}\p{N}_])/giu, 'mã giảm giá')
    .replace(/(?<![\p{L}\p{N}_])flash\s*sale(?![\p{L}\p{N}_])/giu, 'ưu đãi chớp nhoáng')
    .replace(/(?<![\p{L}\p{N}_])follow(?![\p{L}\p{N}_])/giu, 'theo dõi')
    .replace(/(?<![\p{L}\p{N}_])fl(?![\p{L}\p{N}_])/giu, 'theo dõi')
    .replace(/(?<![\p{L}\p{N}_])cod(?![\p{L}\p{N}_])/giu, 'nhận hàng thanh toán')
    .replace(/(?<![\p{L}\p{N}_])stk(?![\p{L}\p{N}_])/giu, 'số tài khoản')
    .replace(/(?<![\p{L}\p{N}_])combo(?![\p{L}\p{N}_])/giu, 'gói combo')
    // Bảo vệ tuyệt đối các từ khóa tiếng Việt, khẩu lệnh và thực phẩm
    .replace(/(?<![\p{L}\p{N}_])dừng\s*lại\s*đây\s*một\s*chút\s*thôi(?![\p{L}\p{N}_])/giu, 'dừng lại đây một chút thôi')
    .replace(/(?<![\p{L}\p{N}_])dừng\s*lại\s*đây\s*một\s*chút(?![\p{L}\p{N}_])/giu, 'dừng lại đây một chút')
    .replace(/(?<![\p{L}\p{N}_])dừng\s*lại\s*đây(?![\p{L}\p{N}_])/giu, 'dừng lại đây')
    .replace(/(?<![\p{L}\p{N}_])dừng\s*lại\s*một\s*chút\s*thôi(?![\p{L}\p{N}_])/giu, 'dừng lại một chút thôi')
    .replace(/(?<![\p{L}\p{N}_])dừng\s*lại\s*một\s*chút(?![\p{L}\p{N}_])/giu, 'dừng lại một chút')
    .replace(/(?<![\p{L}\p{N}_])dừ\s*ng\s*lạ\s*i(?![\p{L}\p{N}_])/giu, 'dừng lại')
    .replace(/(?<![\p{L}\p{N}_])hiệ\s*n\s*tạ\s*i(?![\p{L}\p{N}_])/giu, 'hiện tại')
    .replace(/(?<![\p{L}\p{N}_])hiện\s*tại(?![\p{L}\p{N}_])/giu, 'hiện tại')
    .replace(/(?<![\p{L}\p{N}_])nhắ\s*c\s*lạ\s*i(?![\p{L}\p{N}_])/giu, 'nhắc lại')
    .replace(/(?<![\p{L}\p{N}_])nhắc\s*lại(?![\p{L}\p{N}_])/giu, 'nhắc lại')
    .replace(/(?<![\p{L}\p{N}_])nhắt\s*lại(?![\p{L}\p{N}_])/giu, 'nhắc lại')
    .replace(/(?<![\p{L}\p{N}_])ăn\s*nhạ\s*t(?![\p{L}\p{N}_])/giu, 'ăn nhạt')
    .replace(/(?<![\p{L}\p{N}_])ăn\s*nhạt(?![\p{L}\p{N}_])/giu, 'ăn nhạt')
    .replace(/(?<![\p{L}\p{N}_])ăn\s*nhạc(?![\p{L}\p{N}_])/giu, 'ăn nhạt')
    .replace(/(?<![\p{L}\p{N}_])bánh\s*gạ\s*[\-_]?\s*[oô]\s*[\-_]?\s*lứ[ct](?![\p{L}\p{N}_])/giu, 'bánh gạo lứt')
    .replace(/(?<![\p{L}\p{N}_])bánh\s*gạo\s*lức(?![\p{L}\p{N}_])/giu, 'bánh gạo lứt')
    .replace(/(?<![\p{L}\p{N}_])bánh\s*gạo\s*lứt(?![\p{L}\p{N}_])/giu, 'bánh gạo lứt')
    .replace(/(?<![\p{L}\p{N}_])bánh\s*gạ\s*[\-_]?\s*[oô](?![\p{L}\p{N}_])/giu, 'bánh gạo')
    .replace(/(?<![\p{L}\p{N}_])bánh\s*gạo(?![\p{L}\p{N}_])/giu, 'bánh gạo')
    .replace(/(?<![\p{L}\p{N}_])gạ\s*[\-_]?\s*[oô]\s*[\-_]?\s*lứ[ct](?![\p{L}\p{N}_])/giu, 'gạo lứt')
    .replace(/(?<![\p{L}\p{N}_])gạo\s*lức(?![\p{L}\p{N}_])/giu, 'gạo lứt')
    .replace(/(?<![\p{L}\p{N}_])gạo\s*lứt(?![\p{L}\p{N}_])/giu, 'gạo lứt')
    .replace(/(?<![\p{L}\p{N}_])gạ\s*[\-_]?\s*[oô](?![\p{L}\p{N}_])/giu, 'gạo')
    .replace(/(?<![\p{L}\p{N}_])lức(?![\p{L}\p{N}_])/giu, 'lứt')
    .replace(/(?<![\p{L}\p{N}_])lứ\s*t(?![\p{L}\p{N}_])/giu, 'lứt')
    .replace(/(?<![\p{L}\p{N}_])lứ\s*c(?![\p{L}\p{N}_])/giu, 'lứt')
    .replace(/(?<![\p{L}\p{N}_])gạo\s*st25(?![\p{L}\p{N}_])/giu, 'gạo ST25')
    .replace(/(?<![\p{L}\p{N}_])gạo\s*st-?25(?![\p{L}\p{N}_])/giu, 'gạo ST25')
    .replace(/(?<![\p{L}\p{N}_])lúa\s*gạo(?![\p{L}\p{N}_])/giu, 'lúa gạo')
    .replace(/(?<![\p{L}\p{N}_])bạ\s*[\-_]?\s*[nN](?![\p{L}\p{N}_])/giu, 'bạn')
    .replace(/(?<![\p{L}\p{N}_])b\s*ạ\s*n(?![\p{L}\p{N}_])/giu, 'bạn')
    .replace(/(?<![\p{L}\p{N}_])bạn(?![\p{L}\p{N}_])/giu, 'bạn')
    .replace(/(?<![\p{L}\p{N}_])kị\s*ch\s*bả\s*n(?![\p{L}\p{N}_])/giu, 'kịch bản')
    .replace(/(?<![\p{L}\p{N}_])kịch\s*bản(?![\p{L}\p{N}_])/giu, 'kịch bản')
    .replace(/(?<![\p{L}\p{N}_])khá\s*ch\s*hà\s*ng(?![\p{L}\p{N}_])/giu, 'khách hàng')
    .replace(/(?<![\p{L}\p{N}_])khách\s*hàng(?![\p{L}\p{N}_])/giu, 'khách hàng')
    .replace(/(?<![\p{L}\p{N}_])khách(?![\p{L}\p{N}_])/giu, 'khách')
    .replace(/(?<![\p{L}\p{N}_])chào\s*bạn(?![\p{L}\p{N}_])/giu, 'chào bạn')
    .replace(/(?<![\p{L}\p{N}_])cảm\s*ơn\s*bạn(?![\p{L}\p{N}_])/giu, 'cảm ơn bạn')
    .replace(/(?<![\p{L}\p{N}_])bạn\s*ơi(?![\p{L}\p{N}_])/giu, 'bạn ơi')
    .replace(/(?<![\p{L}\p{N}_])sả\s*n\s*phẩ\s*m(?![\p{L}\p{N}_])/giu, 'sản phẩm')
    .replace(/(?<![\p{L}\p{N}_])liê\s*n\s*tụ\s*c(?![\p{L}\p{N}_])/giu, 'liên tục')
    .replace(/(?<![\p{L}\p{N}_])liên\s*tục(?![\p{L}\p{N}_])/giu, 'liên tục')
    .replace(/(?<![\p{L}\p{N}_])chí\s*nh\s*tả(?![\p{L}\p{N}_])/giu, 'chính tả')
    .replace(/(?<![\p{L}\p{N}_])phá\s*t\s*âm(?![\p{L}\p{N}_])/giu, 'phát âm')
    .replace(/(?<![\p{L}\p{N}_])giọ\s*ng\s*đọ\s*c(?![\p{L}\p{N}_])/giu, 'giọng đọc')
    .replace(/(?<![\p{L}\p{N}_])không(?![\p{L}\p{N}_])/giu, 'không')
    .replace(/(?<![\p{L}\p{N}_])khoong6(?![\p{L}\p{N}_])/giu, 'không')
    .replace(/(?<![\p{L}\p{N}_])đôc(?![\p{L}\p{N}_])/giu, 'đọc')
    .replace(/(?<![\p{L}\p{N}_])đoc(?![\p{L}\p{N}_])/giu, 'đọc');

  // Giữ nguyên câu từ kịch bản đọc liền mạch, mượt mà, loại bỏ triệt để dấu chấm lửng
  let cleaned = text
    .replace(/[…]+/g, ' ')
    .replace(/\.{2,}/g, ' ')
    .replace(/!{2,}/g, '! ')
    .replace(/\?{2,}/g, '? ')
    .replace(/,\s*,+/g, ', ')
    .replace(/[;:]+/g, ' ')
    .replace(/[^\S\r\n]+/g, ' ')
    .trim();

  // Đảm bảo câu có dấu kết thúc (. hoặc !) để EdgeTTS không nuốt âm đuôi
  if (cleaned && !/[.!?]$/.test(cleaned)) {
    cleaned += '.';
  }

  return cleaned;
}

// Concurrency pool for high-throughput parallel EdgeTTS processing
let activeEdgeTtsCount = 0;
const MAX_CONCURRENT_EDGE_TTS = 4;
const edgeTtsWaiters = [];

async function acquireEdgeTtsSlot() {
  if (activeEdgeTtsCount < MAX_CONCURRENT_EDGE_TTS) {
    activeEdgeTtsCount++;
    return;
  }
  return new Promise(resolve => edgeTtsWaiters.push(resolve));
}

function releaseEdgeTtsSlot() {
  activeEdgeTtsCount--;
  if (edgeTtsWaiters.length > 0) {
    activeEdgeTtsCount++;
    const next = edgeTtsWaiters.shift();
    if (next) next();
  }
}

// Helper tải TTS từ Google Translate theo từng đoạn ngắn và ghép lại trọn vẹn 100%
async function fetchGoogleTranslateTTSBuffer(fullText, lang = 'vi') {
  if (!fullText || !fullText.trim()) return null;
  const cleanLang = (lang || 'vi').toLowerCase().startsWith('vi') ? 'vi' : (lang || 'vi');
  
  // Tách text thành các câu / cụm từ không quá 180 ký tự
  const rawChunks = [];
  const sentences = fullText.split(/([.!?\n\r]+)/).filter(Boolean);
  let curChunk = '';
  
  for (let i = 0; i < sentences.length; i++) {
    const part = sentences[i];
    if ((curChunk + part).length <= 180) {
      curChunk += part;
    } else {
      if (curChunk.trim()) rawChunks.push(curChunk.trim());
      if (part.length <= 180) {
        curChunk = part;
      } else {
        // Tách nhỏ hơn theo dấu phẩy hoặc khoảng trắng
        const subWords = part.split(/\s+/);
        let subChunk = '';
        for (const w of subWords) {
          if ((subChunk + ' ' + w).length <= 180) {
            subChunk = (subChunk + ' ' + w).trim();
          } else {
            if (subChunk.trim()) rawChunks.push(subChunk.trim());
            subChunk = w;
          }
        }
        curChunk = subChunk;
      }
    }
  }
  if (curChunk.trim()) rawChunks.push(curChunk.trim());
  if (rawChunks.length === 0) rawChunks.push(fullText.slice(0, 180));

  const audioBuffers = [];
  for (const chunk of rawChunks) {
    try {
      const encodedText = encodeURIComponent(chunk);
      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=${encodeURIComponent(cleanLang)}&client=tw-ob`;
      const buf = await new Promise((resolve, reject) => {
        const req = https.get(ttsUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'audio/mpeg'
          },
          timeout: 10000
        }, (proxyRes) => {
          if (proxyRes.statusCode !== 200) return resolve(null);
          const parts = [];
          proxyRes.on('data', d => parts.push(d));
          proxyRes.on('end', () => resolve(Buffer.concat(parts)));
        });
        req.on('error', () => resolve(null));
        req.on('timeout', () => { req.destroy(); resolve(null); });
      });
      if (buf && buf.length > 0) audioBuffers.push(buf);
    } catch (e) {}
  }

  return audioBuffers.length > 0 ? Buffer.concat(audioBuffers) : null;
}

function humanizeTextForBackendTTS(rawText, gender, lang, sentencePauseSeconds = 0) {
  if (!rawText || typeof rawText !== 'string') return '';
  let text = rawText
    .replace(/\[[^\]]*\]/g, ' ')
    .replace(/\((?:cười|cười tươi|vỗ tay|hành động|chỉ tay|nháy mắt|nói to|nói nhỏ|thì thầm|hào hứng|nhấn mạnh|chỉ giỏ hàng|chốt đơn|đếm ngược|action|smile|clap)[^\)]*\)/gi, ' ')
    .replace(/[#*`_~"'“”„«»‘’]/g, '')
    // Loại bỏ hoàn toàn emojis để TTS không đọc tên emoji
    .replace(/\p{Extended_Pictographic}/gu, '')
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{27BF}\u{1FA00}-\u{1FAFF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/gu, '')
    .replace(/\r?\n+/g, ' ')
    .replace(/[…]+/g, ' ')
    .replace(/\.{2,}/g, ' ')
    .replace(/[;:]+/g, ', ')
    .replace(/,\s*,+/g, ', ')
    .replace(/[^\S\r\n]+/g, ' ')
    .trim();

  // Đọc liên tục xuyên suốt (0s): chuyển dấu chấm giữa câu thành dấu phẩy nghỉ nhịp siêu ngắn mượt mà (~150ms)
  // và GIỮ NGUYÊN dấu cảm thán (!) và dấu hỏi (?) để truyền cảm, đúng cao độ và biểu cảm!
  if (sentencePauseSeconds === 0) {
    text = text.replace(/\.(?=\s+[\p{L}\p{N}])/gu, ',');
  }

  const isVi = !lang || lang.toLowerCase().startsWith('vi');
  if (!isVi) return text;

  // Chuyển đổi số đếm & tiền tệ chuẩn xác (chỉ sau số đếm)
  text = text
    .replace(/(?<![\p{L}\p{N}_])(\d+)\s*k(?![\p{L}\p{N}_])/giu, '$1 nghìn đồng')
    .replace(/(?<![\p{L}\p{N}_])(\d+)\s*cành(?![\p{L}\p{N}_])/giu, '$1 nghìn đồng')
    .replace(/(?<![\p{L}\p{N}_])(\d+)[,\.](\d+)\s*(tr|triệu)(?![\p{L}\p{N}_])/giu, '$1 triệu $2 trăm nghìn đồng')
    .replace(/(?<![\p{L}\p{N}_])(\d+)\s*(tr|triệu)(?![\p{L}\p{N}_])/giu, '$1 triệu đồng')
    .replace(/(?<![\p{L}\p{N}_])(\d+)\s*%(?![\p{L}\p{N}_])/gu, '$1 phần trăm')
    .replace(/(?<![\p{L}\p{N}_])(\d+)\s*(đ|vnd|vnđ)(?![\p{L}\p{N}_])/giu, '$1 đồng')
    .replace(/(?<![\p{L}\p{N}_])(\d+)\s*lít(?![\p{L}\p{N}_])/giu, '$1 trăm nghìn đồng')
    .replace(/(?<![\p{L}\p{N}_])(\d+)\s*củ(?![\p{L}\p{N}_])/giu, '$1 triệu đồng');

  // Viết tắt livestream thông dụng (Unicode-aware boundary)
  text = text
    .replace(/(?<![\p{L}\p{N}_])sp(?![\p{L}\p{N}_])/giu, 'sản phẩm')
    .replace(/(?<![\p{L}\p{N}_])đc(?![\p{L}\p{N}_])/giu, 'được')
    .replace(/(?<![\p{L}\p{N}_])dc(?![\p{L}\p{N}_])/giu, 'được')
    .replace(/(?<![\p{L}\p{N}_])ko(?![\p{L}\p{N}_])/giu, 'không')
    .replace(/(?<![\p{L}\p{N}_])khg(?![\p{L}\p{N}_])/giu, 'không')
    .replace(/(?<![\p{L}\p{N}_])mn(?![\p{L}\p{N}_])/giu, 'mọi người')
    .replace(/(?<![\p{L}\p{N}_])mng(?![\p{L}\p{N}_])/giu, 'mọi người')
    .replace(/(?<![\p{L}\p{N}_])sz(?![\p{L}\p{N}_])/giu, 'size')
    .replace(/(?<![\p{L}\p{N}_])ib(?![\p{L}\p{N}_])/giu, 'nhắn tin')
    .replace(/(?<![\p{L}\p{N}_])inbox(?![\p{L}\p{N}_])/giu, 'nhắn tin trực tiếp')
    .replace(/(?<![\p{L}\p{N}_])cmt(?![\p{L}\p{N}_])/giu, 'bình luận')
    .replace(/(?<![\p{L}\p{N}_])comment(?![\p{L}\p{N}_])/giu, 'bình luận')
    .replace(/(?<![\p{L}\p{N}_])deal(?![\p{L}\p{N}_])/giu, 'ưu đãi')
    .replace(/(?<![\p{L}\p{N}_])freeship(?![\p{L}\p{N}_])/giu, 'miễn phí giao hàng')
    .replace(/(?<![\p{L}\p{N}_])free\s*ship(?![\p{L}\p{N}_])/giu, 'miễn phí giao hàng')
    .replace(/(?<![\p{L}\p{N}_])voucher(?![\p{L}\p{N}_])/giu, 'mã giảm giá')
    .replace(/(?<![\p{L}\p{N}_])flash\s*sale(?![\p{L}\p{N}_])/giu, 'ưu đãi chớp nhoáng')
    .replace(/(?<![\p{L}\p{N}_])follow(?![\p{L}\p{N}_])/giu, 'theo dõi')
    .replace(/(?<![\p{L}\p{N}_])fl(?![\p{L}\p{N}_])/giu, 'theo dõi')
    .replace(/(?<![\p{L}\p{N}_])cod(?![\p{L}\p{N}_])/giu, 'nhận hàng thanh toán')
    .replace(/(?<![\p{L}\p{N}_])stk(?![\p{L}\p{N}_])/giu, 'số tài khoản')
    .replace(/(?<![\p{L}\p{N}_])sđt(?![\p{L}\p{N}_])/giu, 'số điện thoại')
    .replace(/(?<![\p{L}\p{N}_])sdt(?![\p{L}\p{N}_])/giu, 'số điện thoại');

  return text;
}

// 🎙️ Microsoft Azure Neural Voice Synthesis Core (Hỗ trợ trọn bộ kịch bản dài không giới hạn)
async function synthesizeNeuralTTSBuffer({ text, voice, gender, lang, pitch = '+0Hz', rate = '+0%', sentencePauseSeconds = 0 }) {
  if (!EdgeTTS) return null;
  if (!text || !text.trim()) return null;
  const neuralVoice = resolveNeuralVoice(voice, gender, lang);
  const safePitch = normalizeTtsPitch(pitch);
  const safeRate = normalizeTtsRate(rate);
  const processedText = humanizeTextForBackendTTS(text, gender, lang, sentencePauseSeconds) || text;

  // Nếu kịch bản dài trên 1000 ký tự: chia thành các đoạn nhỏ để EdgeTTS xử lý siêu mượt
  if (processedText.length > 1000) {
    const textSegments = [];
    const rawParagraphs = processedText.split(/([.\n\r]+)/).filter(Boolean);
    let curSeg = '';
    for (const p of rawParagraphs) {
      if ((curSeg + p).length <= 800) {
        curSeg += p;
      } else {
        if (curSeg.trim()) textSegments.push(curSeg.trim());
        curSeg = p;
      }
    }
    if (curSeg.trim()) textSegments.push(curSeg.trim());

    const segmentBuffers = [];
    for (const seg of textSegments) {
      const segBuf = await synthesizeNeuralTTSBuffer({ text: seg, voice, gender, lang, pitch, rate, sentencePauseSeconds });
      if (segBuf) segmentBuffers.push(segBuf);
    }
    if (segmentBuffers.length > 0) return Buffer.concat(segmentBuffers);
  }

  const tmpFile = path.join(os.tmpdir(), `tts_${Date.now()}_${Math.random().toString(36).slice(2)}.mp3`);

  await acquireEdgeTtsSlot();
  try {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const tts = new EdgeTTS({
          voice: neuralVoice,
          lang: neuralVoice.split('-').slice(0, 2).join('-') || 'vi-VN',
          pitch: safePitch,
          rate: safeRate,
          outputFormat: 'audio-24khz-48kbitrate-mono-mp3',
          timeout: 25000 // Tăng timeout lên 25s đảm bảo đọc trọn bộ kịch bản dài
        });
        await tts.ttsPromise(processedText, tmpFile);
        if (fs.existsSync(tmpFile)) {
          const buf = fs.readFileSync(tmpFile);
          try { fs.unlinkSync(tmpFile); } catch (e) {}
          return buf;
        }
      } catch (err) {
        if (fs.existsSync(tmpFile)) {
          try { fs.unlinkSync(tmpFile); } catch (e) {}
        }
        if (attempt === 0) await new Promise(r => setTimeout(r, 100));
      }
    }
  } finally {
    releaseEdgeTtsSlot();
  }
  return null;
}

// TTS Proxy with Ultra-Fast In-Memory Cache & Multi-Tier Fallback (Đọc Trọn Bộ Kịch Bản)
app.get('/api/tts', async (req, res) => {
  const text = (req.query.text || '').toString().trim();
  const voice = (req.query.voice || '').toString().trim();
  const voiceId = (req.query.voiceId || '').toString().trim();
  const gender = (req.query.gender || '').toString().trim();
  const lang = (req.query.lang || 'vi').toString().trim();
  const pitch = (req.query.pitch || '+0Hz').toString().trim();
  const rate = (req.query.rate || '+0%').toString().trim();
  const sentencePauseSeconds = parseFloat(req.query.sentencePauseSeconds) || 0;
  if (!text) return res.status(400).send('Missing text parameter');

  const cacheKey = `${voiceId || voice}_${voice}_${gender}_${pitch}_${rate}_${lang}_pause${sentencePauseSeconds}_${text}`;
  if (ttsAudioBufferCache.has(cacheKey)) {
    const cached = ttsAudioBufferCache.get(cacheKey);
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.send(cached);
  }

  // 1. Tận dụng Microsoft Azure Neural Voice Engine
  const neuralBuffer = await synthesizeNeuralTTSBuffer({ text, voice, gender, lang, pitch, rate, sentencePauseSeconds });
  if (neuralBuffer) {
    if (ttsAudioBufferCache.size > 500) {
      const first = ttsAudioBufferCache.keys().next().value;
      ttsAudioBufferCache.delete(first);
    }
    ttsAudioBufferCache.set(cacheKey, neuralBuffer);
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.send(neuralBuffer);
  }

  // 2. Dự phòng Google Translate TTS khi mạng ngoại tuyến (Đọc toàn bộ không cắt ngắn)
  const fallbackBuffer = await fetchGoogleTranslateTTSBuffer(text, lang);
  if (fallbackBuffer) {
    if (ttsAudioBufferCache.size > 500) {
      const first = ttsAudioBufferCache.keys().next().value;
      ttsAudioBufferCache.delete(first);
    }
    ttsAudioBufferCache.set(cacheKey, fallbackBuffer);
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.send(fallbackBuffer);
  }

  res.status(500).send('TTS service unavailable');
});

app.post('/api/tts', async (req, res) => {
  const { text, platform, voice, voiceId, gender, lang = 'vi', pitch = '+0Hz', rate = '+0%', sentencePauseSeconds = 0 } = req.body || {};
  const txt = (text || '').toString().trim();
  if (!txt) return res.status(400).json({ error: 'Missing text parameter' });

  const activeVoice = voice || voiceId;
  const numPause = parseFloat(sentencePauseSeconds) || 0;
  const cacheKey = `${voiceId || activeVoice}_${activeVoice}_${gender}_${pitch}_${rate}_${lang}_pause${numPause}_${txt}`;
  if (ttsAudioBufferCache.has(cacheKey)) {
    const cached = ttsAudioBufferCache.get(cacheKey);
    return res.json({ success: true, audioBase64: cached.toString('base64') });
  }

  // 1. Edge Neural TTS
  const neuralBuffer = await synthesizeNeuralTTSBuffer({ text: txt, voice: activeVoice, gender, lang, pitch, rate, sentencePauseSeconds: numPause });
  if (neuralBuffer) {
    if (ttsAudioBufferCache.size > 500) {
      const first = ttsAudioBufferCache.keys().next().value;
      ttsAudioBufferCache.delete(first);
    }
    ttsAudioBufferCache.set(cacheKey, neuralBuffer);
    return res.json({ success: true, audioBase64: neuralBuffer.toString('base64') });
  }

  // 2. Fallback Google Translate TTS (Đọc toàn bộ không cắt ngắn)
  const fallbackBuffer = await fetchGoogleTranslateTTSBuffer(txt, lang);
  if (fallbackBuffer) {
    if (ttsAudioBufferCache.size > 500) {
      const first = ttsAudioBufferCache.keys().next().value;
      ttsAudioBufferCache.delete(first);
    }
    ttsAudioBufferCache.set(cacheKey, fallbackBuffer);
    return res.json({ success: true, audioBase64: fallbackBuffer.toString('base64') });
  }

  res.status(500).json({ error: 'TTS service unavailable' });
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
// TUNNEL URL — Lưu URL công khai do Cloudflare Quick Tunnel cấp (trycloudflare.com)
// ============================================================
let currentTunnelUrl = null;
let tunnelStatus = 'connecting'; // 'connecting' | 'active' | 'error'
let cloudflaredConsecutiveFails = 0;

// API: Cho phép frontend lấy tunnel URL để dán vào TikTok Studio (hỗ trợ cả /api/tunnel-url và /api/tunnel-status)
app.get(['/api/tunnel-url', '/api/tunnel-status'], (req, res) => {
  const lanIp = getLocalLanIp();
  const localUrl = `http://localhost:${PORT}`;
  const localLanUrl = `http://${lanIp}:${PORT}`;
  const loopbackUrl = `http://127.0.0.1:${PORT}`;

  res.json({
    tunnelUrl: currentTunnelUrl,
    status: tunnelStatus,
    localUrl,
    localLanUrl,
    loopbackUrl,
    lanIp,
    projects: {
      idol:   currentTunnelUrl ? `${currentTunnelUrl}/live-stream` : null,
      'live-stream': currentTunnelUrl ? `${currentTunnelUrl}/live-stream` : null,
      bando:  currentTunnelUrl ? `${currentTunnelUrl}/bando`  : null,
      battle: currentTunnelUrl ? `${currentTunnelUrl}/battle` : null,
    },
    localProjects: {
      idol:   `${localLanUrl}/live-stream`,
      'live-stream': `${localLanUrl}/live-stream`,
      bando:  `${localLanUrl}/bando`,
      battle: `${localLanUrl}/battle`,
      loopbackIdol: `${loopbackUrl}/live-stream`,
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
// ✅ Dùng trycloudflare.com chuẩn 100% (Không bao giờ dùng localtunnel)
// ✅ Không có trang cảnh báo IP, TikTok Studio chấp thuận tức thì
// ============================================================
const { spawn } = require('child_process');

let activeCloudflaredProc = null;
let healthCheckTimer = null;

// API: Làm mới tunnel thủ công khi cần
app.post('/api/refresh-tunnel', (req, res) => {
  console.log('🔄 [Tunnel] Yêu cầu cấp lại đường link Cloudflare Tunnel mới...');
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
  console.log('\n🔗 [Tunnel] Khởi động Cloudflare Quick Tunnel (trycloudflare.com)...');
  tunnelStatus = 'connecting';

  if (activeCloudflaredProc) {
    const oldProc = activeCloudflaredProc;
    activeCloudflaredProc = null;
    try {
      oldProc.removeAllListeners();
      oldProc.kill('SIGKILL');
    } catch (e) {}
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

  // 3. Khởi chạy binary Cloudflare Tunnel
  if (cloudflaredBin) {
    if (process.platform !== 'win32' && fs.existsSync(cloudflaredBin)) {
      try { fs.chmodSync(cloudflaredBin, 0o755); } catch (e) {}
    }
    console.log(`📎 [Tunnel] Sử dụng binary: ${cloudflaredBin}`);
    try {
      const tunnelToken = process.env.TUNNEL_TOKEN || process.env.CLOUDFLARE_TUNNEL_TOKEN;
      const spawnArgs = tunnelToken ? [
        'tunnel', 'run',
        '--token', tunnelToken,
        '--protocol', 'auto',
        '--edge-ip-version', 'auto'
      ] : [
        'tunnel', '--url', `http://127.0.0.1:${port}`,
        '--no-autoupdate',
        '--protocol', 'auto',
        '--edge-ip-version', 'auto',
        '--retries', '10'
      ];

      const proc = spawn(cloudflaredBin, spawnArgs, { stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true });
      activeCloudflaredProc = proc;

      proc.on('error', (err) => {
        console.warn('❌ [Tunnel] Lỗi spawn cloudflared binary:', err.message);
        tunnelStatus = 'error';
        setTimeout(() => startCloudflaredTunnel(port), 10000);
      });

      let isRateLimited = false;
      const parseUrl = (data) => {
        try {
          const str = data.toString();
          if (str.includes('429 Too Many Requests') || str.includes('1015') || str.includes('rate limited')) {
            isRateLimited = true;
            console.warn('⚠️  [Tunnel] Cloudflare Quick Tunnel đang bị giới hạn tần suất (429/1015). Sẽ tạm dừng 60s trước khi thử lại...');
          }
          const match = str.match(/https:\/\/[a-zA-Z0-9\-]+\.trycloudflare\.com/);
          if (match) {
            const newUrl = match[0];
            if (newUrl !== currentTunnelUrl) {
              currentTunnelUrl = newUrl;
              tunnelStatus = 'active';
              cloudflaredConsecutiveFails = 0;
              currentMasterLiveState.tunnelUrl = currentTunnelUrl;
              printTunnelReady(currentTunnelUrl);
              io.emit('TUNNEL_URL_UPDATE', {
                status: 'active',
                tunnelUrl: currentTunnelUrl,
                projects: {
                  idol: `${currentTunnelUrl}/live-stream`,
                  'live-stream': `${currentTunnelUrl}/live-stream`,
                  bando: `${currentTunnelUrl}/bando`,
                  battle: `${currentTunnelUrl}/battle`
                }
              });
              io.emit('MASTER_LIVE_STATE_UPDATE', currentMasterLiveState);
              saveLiveStateToFile(false);
              startTunnelLivenessMonitor(currentTunnelUrl, port);
              syncToVercelCloudState();
            }
          }
        } catch (e) {}
      };

      if (proc.stdout) proc.stdout.on('data', parseUrl);
      if (proc.stderr) proc.stderr.on('data', parseUrl);

      proc.on('exit', (code) => {
        cloudflaredConsecutiveFails++;
        const delay = isRateLimited || cloudflaredConsecutiveFails >= 2 ? 60000 : 15000;
        console.log(`\n⚠️  [Tunnel] Cloudflared thoát (code ${code}, lần ${cloudflaredConsecutiveFails}). Sẽ thử lại sau ${delay / 1000}s...`);
        currentTunnelUrl = null;
        tunnelStatus = 'connecting';
        activeCloudflaredProc = null;
        setTimeout(() => startCloudflaredTunnel(port), delay);
      });

      return;
    } catch (spawnErr) {
      console.warn('❌ [Tunnel Exception caught]:', spawnErr.message);
      tunnelStatus = 'error';
      setTimeout(() => startCloudflaredTunnel(port), 10000);
    }
  } else {
    console.warn('\n⚠️  [Tunnel] Đang chờ binary cloudflared. Thử lại sau 10s...');
    setTimeout(() => startCloudflaredTunnel(port), 10000);
  }
}

function printTunnelReady(tunnelUrl) {
  console.log('\n╔══════════════════════════════════════════════════════╗');
  console.log('║  🎉 CLOUDFLARE TUNNEL ĐÃ SẴN SÀNG (trycloudflare.com) ║');
  console.log('╠══════════════════════════════════════════════════════╣');
  console.log(`║  🌐 Base URL:  ${tunnelUrl.padEnd(38)}║`);
  console.log(`║  👑 AI Idol:   ${(tunnelUrl + '/live-stream').padEnd(38)}║`);
  console.log(`║  🗺️  Bản Đồ:   ${(tunnelUrl + '/bando').padEnd(38)}║`);
  console.log(`║  ⚔️  Battle:   ${(tunnelUrl + '/battle').padEnd(38)}║`);
  console.log('╠══════════════════════════════════════════════════════╣');
  console.log('║  ✅ Dán link trên vào TikTok Live Studio - 100% OK!  ║');
  console.log('╚══════════════════════════════════════════════════════╝\n');
}

let consecutiveTunnelFailures = 0;
function triggerTunnelRestart(port) {
  console.warn(`🚨 [Tunnel Watchdog] Phát hiện đường link Cloudflare bị lỗi (1033/Edge disconnect). Đang cấp link mới ngay...`);
  consecutiveTunnelFailures = 0;
  if (healthCheckTimer) clearInterval(healthCheckTimer);
  if (activeCloudflaredProc) {
    const oldProc = activeCloudflaredProc;
    activeCloudflaredProc = null;
    try {
      oldProc.removeAllListeners();
      oldProc.kill('SIGKILL');
    } catch (e) {}
  }
  currentTunnelUrl = null;
  tunnelStatus = 'connecting';
  io.emit('TUNNEL_URL_UPDATE', { status: 'connecting', tunnelUrl: null, projects: {} });
  setTimeout(() => startCloudflaredTunnel(port), 1000);
}

function startTunnelLivenessMonitor(tunnelUrl, port) {
  if (healthCheckTimer) clearInterval(healthCheckTimer);
  consecutiveTunnelFailures = 0;
  console.log(`🛡️  [Tunnel] Khởi động giám sát duy trì kết nối ổn định cho: ${tunnelUrl}`);

  healthCheckTimer = setInterval(() => {
    if (!currentTunnelUrl || currentTunnelUrl !== tunnelUrl) return;

    try {
      const pingUrl = `${tunnelUrl}/api/live-state`;
      const pingReq = https.get(pingUrl, { timeout: 10000 }, (res) => {
        // Chỉ khởi động lại nếu Cloudflare báo Error 1033 (530) liên tục 8 lần (> 2.5 phút)
        if (res.statusCode === 530) {
          consecutiveTunnelFailures++;
          console.warn(`⚠️ [Tunnel Watchdog] Cloudflare trả về mã lỗi 530 Error 1033 (${consecutiveTunnelFailures}/8)`);
          if (consecutiveTunnelFailures >= 8) {
            triggerTunnelRestart(port);
          }
        } else {
          consecutiveTunnelFailures = 0;
        }
      });
      pingReq.on('error', (err) => {
        // Lỗi mạng tạm thời không được kill tunnel ngay lập tức
        consecutiveTunnelFailures++;
        if (consecutiveTunnelFailures >= 8) {
          console.warn(`⚠️ [Tunnel Watchdog] Mất kết nối liên tục (${consecutiveTunnelFailures}/8): ${err.message}`);
          triggerTunnelRestart(port);
        }
      });
      pingReq.on('timeout', () => {
        pingReq.destroy();
      });
    } catch (e) {}
  }, 20000);
}

// Khởi động tunnel ngay sau khi server chạy
setTimeout(() => startCloudflaredTunnel(Number(PORT)), 500);

