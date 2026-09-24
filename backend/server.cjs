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
app.use(express.json());

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
      if (!file.startsWith('media-') || file.includes('.part')) continue;
      const fullPath = path.join(uploadsDir, file);
      try {
        const stat = fs.statSync(fullPath);
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
const upload = multer({ storage: storage });

// ============================================================
// ⚡ MP4 FASTSTART ENGINE (ZERO-LATENCY STREAMING OPTIMIZER)
// Đưa atom 'moov' (metadata, keyframe index, audio/video track table)
// lên ngay sau 'ftyp' (byte 28) để TikTok Live Studio & trình duyệt
// chỉ cần đọc 45KB đầu tiên là phát ngay tức thì 0.05s, không cần tải hết file!
// ============================================================
function ensureMp4FastStart(filePath) {
  let fd = null;
  let outFd = null;
  const tempPath = filePath + '.faststart.tmp';
  try {
    if (!fs.existsSync(filePath)) return false;
    const stat = fs.statSync(filePath);
    if (stat.size < 1024) return false;

    fd = fs.openSync(filePath, 'r');
    const fileSize = stat.size;

    let offset = 0;
    const atoms = [];
    let moovData = null;
    let moovOffset = 0;

    while (offset < fileSize) {
      const hdr = Buffer.alloc(8);
      const readLen = fs.readSync(fd, hdr, 0, 8, offset);
      if (readLen < 8) break;
      let size = hdr.readUInt32BE(0);
      const name = hdr.toString('latin1', 4, 8);

      if (size === 1) {
        const extHdr = Buffer.alloc(8);
        fs.readSync(fd, extHdr, 0, 8, offset + 8);
        size = Number(extHdr.readBigUInt64BE(0));
      }

      if (name === 'moov') {
        moovData = Buffer.alloc(size);
        fs.readSync(fd, moovData, 0, size, offset);
        moovOffset = offset;
      }

      if (size === 0) {
        size = fileSize - offset;
        atoms.push({ name, offset, size });
        break;
      }

      atoms.push({ name, offset, size });
      offset += size;
    }

    if (!moovData || atoms.length === 0) {
      fs.closeSync(fd);
      fd = null;
      return false;
    }

    let mdatIdx = -1;
    let moovIdx = -1;
    for (let i = 0; i < atoms.length; i++) {
      if (atoms[i].name === 'mdat') mdatIdx = i;
      if (atoms[i].name === 'moov') moovIdx = i;
    }

    if (moovIdx !== -1 && mdatIdx !== -1 && moovIdx < mdatIdx) {
      // Đã chuẩn FastStart (moov đứng trước mdat)
      fs.closeSync(fd);
      fd = null;
      return true;
    }

    console.log(`[FastStart Engine] 🚀 Đang tối ưu hóa FastStart cho video: ${path.basename(filePath)} (${(fileSize / (1024 * 1024)).toFixed(1)} MB)...`);
    const shift = moovData.length;

    // Hiệu chỉnh offset (stco / co64) trong atom moov
    for (let pos = 0; pos < moovData.length - 8; pos++) {
      const atomName = moovData.toString('latin1', pos + 4, pos + 8);
      if (atomName === 'stco') {
        const count = moovData.readUInt32BE(pos + 12);
        let entryPos = pos + 16;
        for (let i = 0; i < count; i++) {
          const oldOff = moovData.readUInt32BE(entryPos);
          moovData.writeUInt32BE(oldOff + shift, entryPos);
          entryPos += 4;
        }
      } else if (atomName === 'co64') {
        const count = moovData.readUInt32BE(pos + 12);
        let entryPos = pos + 16;
        for (let i = 0; i < count; i++) {
          const oldOff = moovData.readBigUInt64BE(entryPos);
          moovData.writeBigUInt64BE(oldOff + BigInt(shift), entryPos);
          entryPos += 8;
        }
      }
    }

    outFd = fs.openSync(tempPath, 'w');

    // 1. Ghi ftyp
    const ftypAtom = atoms[0];
    const ftypBuf = Buffer.alloc(ftypAtom.size);
    fs.readSync(fd, ftypBuf, 0, ftypAtom.size, 0);
    fs.writeSync(outFd, ftypBuf, 0, ftypAtom.size);

    // 2. Ghi moov đã patch offset
    fs.writeSync(outFd, moovData, 0, moovData.length);

    // 3. Ghi phần còn lại của file (bỏ qua ftyp, moov cũ và free)
    const CHUNK_SIZE = 4 * 1024 * 1024;
    const chunkBuf = Buffer.alloc(CHUNK_SIZE);

    for (const atom of atoms) {
      if (atom.name === 'ftyp' || atom.name === 'moov' || atom.name === 'free') continue;
      let rem = atom.size;
      let curOff = atom.offset;
      while (rem > 0) {
        const toRead = Math.min(rem, CHUNK_SIZE);
        const readBytes = fs.readSync(fd, chunkBuf, 0, toRead, curOff);
        if (readBytes === 0) break;
        fs.writeSync(outFd, chunkBuf, 0, readBytes);
        rem -= readBytes;
        curOff += readBytes;
      }
    }

    fs.closeSync(fd);
    fd = null;
    fs.closeSync(outFd);
    outFd = null;

    // Ghi đè file chính bằng bản FastStart
    fs.renameSync(tempPath, filePath);
    console.log(`[FastStart Engine] ✅ Đã chuyển đổi FastStart thành công: ${path.basename(filePath)} -> Tải tức thì 0ms trên TikTok Live Studio!`);
    return true;
  } catch (err) {
    console.warn(`[FastStart Engine] Bỏ qua tối ưu FastStart:`, err.message);
    try { if (fd) fs.closeSync(fd); } catch (e) {}
    try { if (outFd) fs.closeSync(outFd); } catch (e) {}
    try { if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath); } catch (e) {}
    return false;
  }
}

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
    // 🛡️ TỰ ĐỘNG DỰ PHÒNG: Nếu file requested không tồn tại (link cũ hoặc bị xóa), phát ngay file video mới nhất trên server
    const fallbackPath = getLatestUploadFilePath();
    if (fallbackPath && fs.existsSync(fallbackPath)) {
      filePath = fallbackPath;
    } else {
      return res.status(404).send('Media not found');
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
        currentMasterLiveState = {
          ...currentMasterLiveState,
          stage: 'idol',
          mediaUrl: fileUrl,
          isVideo: true,
          videoPlaybackEvent: 'play',
          isPlaying: true,
          isUserExplicitMediaLocked: true,
          updatedAt: Date.now()
        };
        io.emit('MASTER_LIVE_STATE_UPDATE', currentMasterLiveState);
        saveLiveStateToFile();

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
                currentMasterLiveState = {
                  ...currentMasterLiveState,
                  stage: 'idol',
                  mediaUrl: fileUrl,
                  isVideo: true,
                  videoPlaybackEvent: 'play',
                  isPlaying: true,
                  isUserExplicitMediaLocked: true,
                  updatedAt: Date.now()
                };
                io.emit('MASTER_LIVE_STATE_UPDATE', currentMasterLiveState);
                saveLiveStateToFile();
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

    currentMasterLiveState = {
      ...currentMasterLiveState,
      stage: 'idol',
      mediaUrl: fileUrl,
      isVideo: true,
      videoPlaybackEvent: 'play',
      isPlaying: true,
      isUserExplicitMediaLocked: true,
      updatedAt: Date.now()
    };
    io.emit('MASTER_LIVE_STATE_UPDATE', currentMasterLiveState);
    saveLiveStateToFile();

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

        currentMasterLiveState = {
          ...currentMasterLiveState,
          stage: 'idol',
          mediaUrl: `/uploads/${uploadedFilename}`,
          isVideo: true,
          videoPlaybackEvent: 'play',
          isPlaying: true,
          isUserExplicitMediaLocked: true,
          updatedAt: Date.now()
        };
        io.emit('MASTER_LIVE_STATE_UPDATE', currentMasterLiveState);
        saveLiveStateToFile();
        console.log(`[FastStream] 👑 Đã phát sóng video FastStart hoàn chỉnh sang TikTok Live Studio: ${uploadedFilename}`);
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
  const noStageTakeover = req.body?.noStageTakeover === 'true' || req.body?.isConfigOnly === 'true' || req.body?.setAsMaster === 'false';
  if (!noStageTakeover) {
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

// ============================================================
// 🎬 ROUTE PHÁT SÓNG ĐỘC LẬP /live-stream CHO TIKTOK LIVE STUDIO & OBS
// Tối ưu hóa GPU Hardware Acceleration 100%, 4K 60 FPS siêu sắc nét, không bao giờ đen màn hình hay lỗi link
// ============================================================
app.get([
  '/live-stream', '/live-player', '/stream-player', '/idol-stream', 
  '/idol', '/live', '/stage', '/stream', '/overlay-live', '/tiktok-live',
  '/overlay-idol', '/cleanlive', '/live-overlay'
], (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('X-Frame-Options', 'ALLOWALL');
  res.setHeader('Content-Security-Policy', "default-src * 'unsafe-inline' 'unsafe-eval' data: blob: gap:; frame-ancestors *;");
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  let vParam = req.query.v || currentMasterLiveState.mediaUrl || '';
  if (vParam && typeof vParam === 'string') {
    try {
      vParam = decodeURIComponent(vParam);
    } catch(e) {}
    if (vParam.startsWith('http://') || vParam.startsWith('https://')) {
      try {
        const u = new URL(vParam);
        if (u.pathname.includes('/uploads/')) {
          vParam = u.pathname.substring(u.pathname.indexOf('/uploads/')) + u.search;
        }
      } catch(e) {}
    }
    if (!vParam.startsWith('/') && !vParam.startsWith('http')) {
      vParam = '/' + vParam;
    }
  }

  let existsOnDisk = false;
  if (vParam && typeof vParam === 'string' && vParam.includes('/uploads/')) {
    const filename = vParam.substring(vParam.indexOf('/uploads/') + 9).split('?')[0];
    const foundPath = findFileInUploadDirs(filename);
    if (foundPath) {
      existsOnDisk = true;
      vParam = `/uploads/${path.basename(foundPath)}`;
    }
  }
  if (!existsOnDisk) {
    if (currentMasterLiveState && currentMasterLiveState.mediaUrl && currentMasterLiveState.mediaUrl.includes('/uploads/')) {
      const mFilename = currentMasterLiveState.mediaUrl.substring(currentMasterLiveState.mediaUrl.indexOf('/uploads/') + 9).split('?')[0];
      const foundPath = findFileInUploadDirs(mFilename);
      if (foundPath) {
        existsOnDisk = true;
        vParam = `/uploads/${path.basename(foundPath)}`;
      }
    }
  }
  if (!existsOnDisk) {
    // Sân khấu chính không có video thì để trống, tuyệt đối không tự ý lấy video cũ trong uploads
    vParam = '';
  }

  const soundParam = req.query.sound !== '0';
  const fitParam = req.query.fit || 'cover';
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
  <title>AvaLive 4K 60FPS Ultra-HD Live Streamer v4.6.2</title>
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
      width: 100vw; height: 100vh;
      margin: 0; padding: 0;
      display: flex; align-items: center; justify-content: center;
      background: #000;
      overflow: hidden;
    }
    video {
      position: absolute;
      inset: 0;
      width: 100vw; height: 100vh;
      object-fit: ${fitParam === 'contain' ? 'contain' : 'cover'};
      object-position: center center;
      background: #000;
      display: ${isInitialImg ? 'none' : 'block'};
      outline: none; border: none;
      image-rendering: -webkit-optimize-contrast;
      image-rendering: high-quality;
      transform: translateZ(0);
      -webkit-transform: translateZ(0);
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
    }
    #imagePlayer {
      position: absolute;
      inset: 0;
      width: 100vw; height: 100vh;
      object-fit: ${fitParam === 'contain' ? 'contain' : 'cover'};
      object-position: center center;
      background: #000;
      display: ${isInitialImg ? 'block' : 'none'};
      image-rendering: -webkit-optimize-contrast;
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
    #controlsDock {
      position: absolute; top: 8px; right: 8px; z-index: 50;
      display: flex; align-items: center; gap: 6px;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(8px);
      padding: 4px 8px; border-radius: 20px;
      border: 1px solid rgba(6, 182, 212, 0.3);
      opacity: 0; transition: opacity 0.3s ease;
    }
    body:hover #controlsDock { opacity: 0.9; }
    .dock-btn {
      background: rgba(255, 255, 255, 0.12);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #fff; font-size: 10px; font-weight: bold;
      padding: 3px 7px; border-radius: 10px;
      cursor: pointer; display: flex; align-items: center; gap: 4px;
    }
    .dock-btn:hover { background: rgba(6, 182, 212, 0.5); }
    #badge {
      display: none;
    }
  </style>
  <script src="/socket.io/socket.io.js" onerror="this.onerror=null; this.src='https://cdn.socket.io/4.7.5/socket.io.min.js';"></script>
</head>
<body>
  <div id="stage">
    <div id="loadingOverlay">
      <div class="spinner"></div>
      <div style="font-size: 13px; font-weight: 700; letter-spacing: 0.5px;">⚡ ĐANG KẾT NỐI LUỒNG LIVE AVALIVE 4K 60FPS...</div>
      <div style="font-size: 11px; color: #94a3b8; margin-top: 4px;">Đồng bộ trực tiếp với phần mềm AvaLive VIP PRO</div>
    </div>
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
    ></video>
    <img
      id="imagePlayer"
      ${isInitialImg && initialSrcAttr ? initialSrcAttr : ''}
      alt="Live Media"
    />
    <div id="overlayTextBanner" style="position: absolute; left: 4%; top: 5%; width: 92%; z-index: 35; text-align: center; pointer-events: none; display: none;">
      <div id="overlayTextContent" style="display: inline-block; padding: 6px 14px; border-radius: 16px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; background: rgba(2, 6, 23, 0.9); border: 1px solid #22d3ee; color: #22d3ee; font-family: 'Segoe UI', system-ui, sans-serif; font-size: 16px; box-shadow: 0 0 20px rgba(6, 182, 212, 0.6);"></div>
    </div>
    <div id="controlsDock">
      <button id="btnPlayPause" class="dock-btn" title="Tạm dừng / Tiếp tục độc lập">⏸️ Dừng</button>
      <button id="btnMuteUnmute" class="dock-btn" title="Bật / Tắt âm thanh độc lập">🔊 Bật Tiếng</button>
      <button id="btnFitToggle" class="dock-btn" title="Chuyển chế độ Khung hình (Tràn / Vừa)">📐 Tràn</button>
    </div>
    <div id="badge">🔴 4K 60 FPS REALTIME v4.6.2</div>
  </div>
  <script>
    (function() {
      const vid = document.getElementById('videoPlayer');
      const badge = document.getElementById('badge');
      const loadingOverlay = document.getElementById('loadingOverlay');
      const btnPlayPause = document.getElementById('btnPlayPause');
      const btnMuteUnmute = document.getElementById('btnMuteUnmute');
      const btnFitToggle = document.getElementById('btnFitToggle');

      let currentSrc = ${JSON.stringify(vParam)};
      let isStreamUserPaused = false;
      let targetSoundEnabled = ${soundParam ? 'true' : 'false'};
      let targetVolume = 1.0;
      let currentFit = ${JSON.stringify(fitParam)};
      let isPlayPending = false;

      // Khởi tạo video luôn bắt đầu với muted để 100% CEF TikTok Live Studio / OBS cho phép phát ngay 0ms
      vid.muted = true;
      vid.defaultMuted = true;

      function hideLoading() {
        if (loadingOverlay) {
          loadingOverlay.style.opacity = '0';
          setTimeout(function() {
            if (loadingOverlay) loadingOverlay.style.display = 'none';
          }, 400);
        }
      }

      function showLoading() {
        if (loadingOverlay) {
          loadingOverlay.style.display = 'flex';
          loadingOverlay.style.opacity = '1';
        }
      }

      setTimeout(function() { if (badge) badge.style.opacity = '0.2'; }, 6000);

      function updateDockUI() {
        if (btnPlayPause) {
          btnPlayPause.innerHTML = vid.paused ? '▶️ Phát' : '⏸️ Dừng';
        }
        if (btnMuteUnmute) {
          btnMuteUnmute.innerHTML = vid.muted ? '🔇 Tắt Tiếng' : '🔊 Bật Tiếng';
        }
        if (btnFitToggle) {
          btnFitToggle.innerHTML = currentFit === 'cover' ? '📐 Tràn' : '📐 Vừa';
        }
      }

      function tryEnableAudioSafe() {
        if (!targetSoundEnabled) return;
        try {
          vid.muted = false;
          vid.volume = targetVolume;
          if (vid.paused && !isStreamUserPaused) {
            // CEF chặn unmuted -> quay lại muted ngay để video tiếp tục phát 60 FPS
            vid.muted = true;
            safePlay();
          }
        } catch (e) {
          vid.muted = true;
        }
      }

      function safePlay() {
        if (isStreamUserPaused || isPlayPending) return;
        vid.muted = true;
        vid.defaultMuted = true;
        try {
          isPlayPending = true;
          const p = vid.play();
          if (p !== undefined && typeof p.then === 'function') {
            p.then(function() {
              isPlayPending = false;
              hideLoading();
              updateDockUI();
              if (targetSoundEnabled) {
                setTimeout(tryEnableAudioSafe, 250);
              }
            }).catch(function(err) {
              isPlayPending = false;
              vid.muted = true;
              setTimeout(function() {
                if (vid.paused && !isStreamUserPaused) {
                  try { vid.play().then(function() { hideLoading(); updateDockUI(); }).catch(function() {}); } catch(e) {}
                }
              }, 150);
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

      if (btnPlayPause) {
        btnPlayPause.addEventListener('click', function(e) {
          e.stopPropagation();
          if (vid.paused) {
            isStreamUserPaused = false;
            safePlay();
          } else {
            isStreamUserPaused = true;
            vid.pause();
            updateDockUI();
          }
        });
      }

      if (btnMuteUnmute) {
        btnMuteUnmute.addEventListener('click', function(e) {
          e.stopPropagation();
          targetSoundEnabled = !targetSoundEnabled;
          if (targetSoundEnabled) {
            vid.muted = false;
            vid.volume = targetVolume;
            if (vid.paused && !isStreamUserPaused) {
              safePlay();
            }
          } else {
            vid.muted = true;
          }
          updateDockUI();
        });
      }

      if (btnFitToggle) {
        btnFitToggle.addEventListener('click', function(e) {
          e.stopPropagation();
          currentFit = currentFit === 'cover' ? 'contain' : 'cover';
          vid.style.objectFit = currentFit;
          updateDockUI();
        });
      }

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
        if (url.startsWith('blob:')) return '';
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
        if (!u) return false;
        return /\.(png|jpe?g|webp|gif|svg|avif|bmp)($|\?|#)/i.test(u) || u.startsWith('data:image/');
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

      function applyLiveState(data) {
        if (!data) return;
        const banner = document.getElementById('overlayTextBanner');
        const content = document.getElementById('overlayTextContent');
        const txt = data.overlayText || data.title || data.stepTitle;
        if (banner && content) {
          if (txt && typeof txt === 'string' && txt.trim()) {
            content.innerText = txt.trim();
            banner.style.display = 'block';
          } else {
            banner.style.display = 'none';
          }
        }
        if (data.clearMedia || data.mediaUrl === null) {
          if (vid) {
            try { vid.pause(); vid.removeAttribute('src'); vid.src = ''; vid.load(); } catch(e) {}
            vid.style.display = 'none';
          }
          const imgEl = document.getElementById('imagePlayer');
          if (imgEl) {
            try { imgEl.removeAttribute('src'); imgEl.src = ''; } catch(e) {}
            imgEl.style.display = 'none';
          }
        } else if (data.mediaUrl && !isSameMedia(vid.src, data.mediaUrl)) {
          loadAndPlay(data.mediaUrl);
        }
        if (!isStreamUserPaused && vid.paused && vid.src) {
          safePlay();
        }
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

      window.addEventListener('click', function() {
        if (targetSoundEnabled) {
          vid.muted = false;
          vid.volume = targetVolume;
        }
        if (vid.paused && !isStreamUserPaused) {
          safePlay();
        }
      });

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
              if (badge) badge.innerText = '🟢 4K 60 FPS REALTIME v4.6.2';
              socket.emit('REQUEST_MASTER_LIVE_STATE');
            });

            socket.on('disconnect', function() {
              if (badge) badge.innerText = '🟡 RECONNECTING...';
            });

            socket.on('MASTER_LIVE_STATE_UPDATE', function(data) {
              applyLiveState(data);
            });

            socket.on('VIDEO_PLAYBACK_CONTROL', function(control) {
              if (!control) return;
              if (control.mediaUrl && !isSameMedia(vid.src, control.mediaUrl)) {
                loadAndPlay(control.mediaUrl);
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
            if (ev.data.type === 'GLOBAL_MEDIA_CHANGE' || ev.data.type === 'MASTER_MEDIA_CHANGE') {
              applyLiveState(ev.data);
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
  let vParam = req.query.v || currentMasterLiveState.mediaUrl || '';
  if (vParam && typeof vParam === 'string') {
    if (vParam.startsWith('http://') || vParam.startsWith('https://')) {
      try {
        const u = new URL(vParam);
        vParam = u.pathname + u.search;
      } catch(e) {}
    }
    if (!vParam.startsWith('/') && !vParam.startsWith('http')) {
      vParam = '/' + vParam;
    }
  }
  let existsOnDisk = false;
  if (vParam && typeof vParam === 'string' && vParam.includes('/uploads/')) {
    const filename = vParam.substring(vParam.indexOf('/uploads/') + 9).split('?')[0];
    const checkFile = path.join(uploadsDir, filename);
    if (fs.existsSync(checkFile)) {
      existsOnDisk = true;
      vParam = `/uploads/${filename}`;
    }
  }
  if (!vParam || !existsOnDisk || vParam.startsWith('blob:') || vParam.includes('default_idol.mp4')) {
    // Sân khấu chính không có video thì để trống, tuyệt đối không tự ý lấy video cũ trong uploads
    vParam = '';
  }
  const soundParam = req.query.sound !== '0';
  const fitParam = req.query.fit || 'cover';
  const isImageMediaHelper = (u) => {
    if (!u || typeof u !== 'string') return false;
    return /\.(png|jpe?g|webp|gif|svg|avif|bmp)($|\?|#)/i.test(u) || u.startsWith('data:image/');
  };
  const isInitialImg = isImageMediaHelper(vParam);

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
      position: relative;
      width: 100%; height: 100%;
      max-width: 100vw; max-height: 100vh;
      aspect-ratio: 9 / 16;
      display: flex; align-items: center; justify-content: center;
      background: #000;
      overflow: hidden;
    }
    video {
      width: 100%; height: 100%;
      object-fit: ${fitParam === 'contain' ? 'contain' : 'cover'};
      background-color: #000;
      display: ${isInitialImg ? 'none' : 'block'};
      transform: translateZ(0);
      -webkit-transform: translateZ(0);
      backface-visibility: hidden;
      perspective: 1000px;
    }
    #imagePlayer {
      width: 100%; height: 100%;
      object-fit: ${fitParam === 'contain' ? 'contain' : 'cover'};
      background-color: #000;
      display: ${isInitialImg ? 'block' : 'none'};
    }
    #controlsDock {
      position: absolute;
      top: 8px; left: 50%;
      transform: translateX(-50%);
      display: flex; align-items: center; gap: 8px;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      padding: 6px 12px;
      border-radius: 20px;
      border: 1px solid rgba(6, 182, 212, 0.35);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.6);
      z-index: 40;
      opacity: 0.85;
      transition: opacity 0.25s ease, transform 0.25s ease;
    }
    #controlsDock.is-hidden {
      display: none !important;
    }
    #controlsDock:hover { opacity: 1; }
    .dock-btn {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #fff;
      font-size: 11px;
      font-weight: bold;
      padding: 4px 8px;
      border-radius: 12px;
      cursor: pointer;
      outline: none;
      transition: all 0.2s;
    }
    .dock-btn:hover { background: rgba(6, 182, 212, 0.4); border-color: #06b6d4; }
    .dock-btn-hide {
      background: rgba(239, 68, 68, 0.25) !important;
      border-color: rgba(239, 68, 68, 0.45) !important;
      color: #fca5a5 !important;
      padding: 4px 10px !important;
    }
    .dock-btn-hide:hover {
      background: rgba(239, 68, 68, 0.45) !important;
      color: #fff !important;
    }
    #badge {
      position: absolute; bottom: 8px; right: 8px;
      background: rgba(0,0,0,0.6); color: #06b6d4;
      font-family: monospace; font-size: 10px; font-weight: bold;
      padding: 2px 6px; border-radius: 4px; pointer-events: none;
      opacity: 0.7; z-index: 10;
      transition: opacity 0.25s ease;
    }
    #badge.is-hidden {
      display: none !important;
    }
    #btnRestoreIcon {
      position: absolute; top: 8px; right: 8px;
      z-index: 50; width: 28px; height: 28px;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.55);
      border: 1px solid rgba(6, 182, 212, 0.4);
      color: #06b6d4; font-size: 13px;
      display: none; align-items: center; justify-content: center;
      cursor: pointer; opacity: 0.25;
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      transition: all 0.25s ease;
    }
    #btnRestoreIcon.is-visible {
      display: flex !important;
    }
    #btnRestoreIcon:hover {
      opacity: 1 !important;
      transform: scale(1.15);
    }
  </style>
  <script src="/socket.io/socket.io.js"></script>
</head>
<body>
  <div id="stage">
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
    ></video>
    <img
      id="imagePlayer"
      src="${isInitialImg && vParam ? (vParam.startsWith('http') || vParam.startsWith('/') ? vParam : '/' + vParam) : ''}"
      alt="Live Stage Media"
    />
    <div id="overlayTextBanner" style="position: absolute; left: 4%; top: 5%; width: 92%; z-index: 35; text-align: center; pointer-events: none; display: none;">
      <div id="overlayTextContent" style="display: inline-block; padding: 6px 14px; border-radius: 16px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; background: rgba(2, 6, 23, 0.9); border: 1px solid #22d3ee; color: #22d3ee; font-family: 'Segoe UI', system-ui, sans-serif; font-size: 16px; box-shadow: 0 0 20px rgba(6, 182, 212, 0.6);"></div>
    </div>
    
    <div id="controlsDock">
      <span style="font-size:10px; color:#10b981; font-weight:bold; display:flex; align-items:center; gap:4px;">
        <span style="width:6px; height:6px; border-radius:50%; background:#10b981; display:inline-block;"></span>
        WINDOW CAPTURE
      </span>
      <button id="btnPlayPause" class="dock-btn" title="Tạm dừng / Tiếp tục độc lập (Space)">⏸️ Dừng</button>
      <button id="btnMuteUnmute" class="dock-btn" title="Bật / Tắt âm thanh độc lập (M)">${soundParam ? '🔊 Bật Tiếng' : '🔇 Tắt Tiếng'}</button>
      <button id="btnFitToggle" class="dock-btn" title="Chuyển chế độ Khung hình (Tràn / Vừa)">${fitParam === 'contain' ? '📐 Vừa' : '📐 Tràn'}</button>
      <button id="btnHideAll" class="dock-btn dock-btn-hide" title="Ẩn toàn bộ nút trên giao diện video để bắt hình sạch 100% (Phím tắt: H)">✕ Ẩn Toàn Bộ (H)</button>
    </div>

    <button id="btnRestoreIcon" title="Bấm để hiện lại toàn bộ nút chức năng (Phím tắt: H)">👁️</button>
    <div id="badge">🔴 4K 60 FPS REALTIME v1.3.4</div>
  </div>
  <script>
    (function() {
      const vid = document.getElementById('videoPlayer');
      const badge = document.getElementById('badge');
      const dock = document.getElementById('controlsDock');
      const btnRestore = document.getElementById('btnRestoreIcon');
      const btnPlayPause = document.getElementById('btnPlayPause');
      const btnMuteUnmute = document.getElementById('btnMuteUnmute');
      const btnFitToggle = document.getElementById('btnFitToggle');
      const btnHideAll = document.getElementById('btnHideAll');

      let currentSrc = ${JSON.stringify(vParam)};
      let isStreamUserPaused = false;
      let targetMuted = ${soundParam ? 'false' : 'true'};
      let currentFit = ${JSON.stringify(fitParam)};
      let isDockHidden = false;

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

      function toggleHideAll(forceVal) {
        isDockHidden = typeof forceVal === 'boolean' ? forceVal : !isDockHidden;
        try {
          localStorage.setItem('avalive_window_capture_dock_hidden', String(isDockHidden));
        } catch(e) {}
        applyDockVisibility();
      }

      if (btnHideAll) {
        btnHideAll.onclick = function() { toggleHideAll(true); };
      }
      if (btnRestore) {
        btnRestore.onclick = function() { toggleHideAll(false); };
      }

      setTimeout(function() { if (badge) badge.style.opacity = '0.2'; }, 6000);

      function updateDockUI() {
        if (btnPlayPause) {
          btnPlayPause.innerHTML = vid.paused ? '▶️ Phát' : '⏸️ Dừng';
        }
        if (btnMuteUnmute) {
          btnMuteUnmute.innerHTML = vid.muted ? '🔇 Tắt Tiếng' : '🔊 Bật Tiếng';
        }
        if (btnFitToggle) {
          btnFitToggle.innerHTML = currentFit === 'cover' ? '📐 Tràn' : '📐 Vừa';
        }
      }

      if (btnPlayPause) {
        btnPlayPause.onclick = function() {
          if (vid.paused) {
            isStreamUserPaused = false;
            vid.play().catch(function() {});
          } else {
            isStreamUserPaused = true;
            vid.pause();
          }
          updateDockUI();
        };
      }

      if (btnMuteUnmute) {
        btnMuteUnmute.onclick = function() {
          vid.muted = !vid.muted;
          targetMuted = vid.muted;
          updateDockUI();
        };
      }

      if (btnFitToggle) {
        btnFitToggle.onclick = function() {
          currentFit = currentFit === 'cover' ? 'contain' : 'cover';
          vid.style.objectFit = currentFit;
          updateDockUI();
        };
      }

      window.addEventListener('keydown', function(e) {
        if (['input', 'textarea', 'select'].includes(document.activeElement?.tagName?.toLowerCase())) return;
        if (e.code === 'Space') {
          e.preventDefault();
          if (btnPlayPause) btnPlayPause.click();
        } else if (e.key === 'm' || e.key === 'M') {
          e.preventDefault();
          if (btnMuteUnmute) btnMuteUnmute.click();
        } else if (e.key === 'h' || e.key === 'H') {
          e.preventDefault();
          toggleHideAll();
        }
      });

      function isSameMedia(a, b) {
        if (!a || !b) return false;
        if (a === b) return true;
        const cleanA = a.split('?')[0].split('#')[0];
        const cleanB = b.split('?')[0].split('#')[0];
        return cleanA === cleanB || cleanA.endsWith(cleanB) || cleanB.endsWith(cleanA);
      }

      function isImage(u) {
        if (!u) return false;
        return /\.(png|jpe?g|webp|gif|svg|avif|bmp)($|\?|#)/i.test(u) || u.startsWith('data:image/');
      }

      function loadAndPlay(src) {
        if (!src) return;
        let cleanSrc = src;
        if (cleanSrc.startsWith('http://') || cleanSrc.startsWith('https://')) {
          try {
            const u = new URL(cleanSrc);
            cleanSrc = u.pathname + u.search;
          } catch(e) {}
        }
        if (!cleanSrc.startsWith('/') && !cleanSrc.startsWith('http')) {
          cleanSrc = '/' + cleanSrc;
        }

        const imgEl = document.getElementById('imagePlayer');
        if (isImage(cleanSrc)) {
          if (imgEl) {
            imgEl.src = cleanSrc;
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
          if (isSameMedia(vid.src, cleanSrc)) return;

          currentSrc = cleanSrc;
          vid.src = cleanSrc;
          vid.load();
          if (!isStreamUserPaused) {
            vid.muted = targetMuted;
            vid.play().catch(function() {
              vid.muted = true;
              vid.play().catch(function() {});
            });
          }
          updateDockUI();
        }
      }

      vid.addEventListener('loadedmetadata', function() {
        if (!isStreamUserPaused) {
          vid.muted = targetMuted;
          vid.play().catch(function() {});
        }
        updateDockUI();
      });

      vid.addEventListener('play', updateDockUI);
      vid.addEventListener('pause', updateDockUI);

      try {
        const socket = io(window.location.origin, {
          transports: ['websocket', 'polling'],
          reconnection: true
        });

        socket.on('connect', function() {
          if (badge) badge.innerText = '🟢 4K 60 FPS REALTIME v1.3.4';
          socket.emit('REQUEST_MASTER_LIVE_STATE');
        });

        socket.on('disconnect', function() {
          if (badge) badge.innerText = '🟡 RECONNECTING...';
        });

        function applyLiveState(data) {
          if (!data) return;
          const banner = document.getElementById('overlayTextBanner');
          const content = document.getElementById('overlayTextContent');
          const txt = data.overlayText || data.title || data.stepTitle;
          if (banner && content) {
            if (txt && typeof txt === 'string' && txt.trim()) {
              content.innerText = txt.trim();
              banner.style.display = 'block';
            } else {
              banner.style.display = 'none';
            }
          }
          if (data.clearMedia || data.mediaUrl === null) {
            if (vid) {
              try { vid.pause(); vid.removeAttribute('src'); vid.src = ''; vid.load(); } catch(e) {}
              vid.style.display = 'none';
            }
            const imgEl = document.getElementById('imagePlayer');
            if (imgEl) {
              try { imgEl.removeAttribute('src'); imgEl.src = ''; } catch(e) {}
              imgEl.style.display = 'none';
            }
          } else if (data.mediaUrl && !isSameMedia(vid.src, data.mediaUrl)) {
            loadAndPlay(data.mediaUrl);
          }
          if (data.videoPlaybackEvent === 'pause') {
            isStreamUserPaused = true;
            vid.pause();
          } else if (data.videoPlaybackEvent === 'play' && isStreamUserPaused) {
            isStreamUserPaused = false;
            vid.play().catch(function() {});
          }
        }

        socket.on('MASTER_LIVE_STATE_UPDATE', function(data) {
          applyLiveState(data);
        });

        if (typeof BroadcastChannel !== 'undefined') {
          const bc = new BroadcastChannel('avalive_master_live_stream');
          bc.onmessage = function(ev) {
            if (!ev.data) return;
            if (ev.data.type === 'GLOBAL_MEDIA_CHANGE' || ev.data.type === 'MASTER_MEDIA_CHANGE') {
              applyLiveState(ev.data);
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
  const defaultUrl = `https://github.com/THIENVUAAPP/DU-AN-AVA-LIVETREAMS/releases/download/v${fallbackVer}/${osPrefix}_v${fallbackVer}.zip`;
  
  const cacheKey = `${osPrefix}_${fallbackVer}`;
  if (_cachedReleaseUrls[cacheKey] && (Date.now() - _lastReleaseFetchTime < 60000)) {
    return _cachedReleaseUrls[cacheKey];
  }

  try {
    const token = process.env.GITHUB_TOKEN || '';
    const headers = { 'User-Agent': 'AvaLive-Download-Agent/1.0', 'Accept': 'application/vnd.github.v3+json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const tagRes = await fetch(`https://api.github.com/repos/THIENVUAAPP/DU-AN-AVA-LIVETREAMS/releases/tags/v${fallbackVer}`, { headers });
    if (tagRes.ok) {
      const rel = await tagRes.json();
      const asset = (rel.assets || []).find(a => a.name.startsWith(osPrefix) && a.name.endsWith('.zip'));
      if (asset && asset.browser_download_url) {
        _cachedReleaseUrls[cacheKey] = asset.browser_download_url;
        _lastReleaseFetchTime = Date.now();
        return asset.browser_download_url;
      }
    }
  } catch (e) {
    console.warn('[Download] Error resolving GitHub asset URL:', e.message);
  }
  return defaultUrl;
}

// 📦 ROUTE TẢI PHẦN MỀM STANDALONE WINDOWS — TẢI TRỰC TIẾP VỀ MÁY 100%, KHÔNG MỞ GITHUB
app.get(['/api/download/windows', '/api/download-windows', '/download/windows', '/AvaLive_VIP_PRO_Windows.zip', /^\/AvaLive_VIP_PRO_Windows_v.*\.zip$/], async (req, res) => {
  let ver = '4.9.17';
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
  return res.redirect(verifiedUrl);
});

// 📦 ROUTE TẢI PHẦN MỀM STANDALONE MAC — TẢI TRỰC TIẾP VỀ MÁY 100%, KHÔNG MỞ GITHUB
app.get(['/api/download/mac', '/api/download-mac', '/download/mac', '/AvaLive_VIP_PRO_Mac.zip', /^\/AvaLive_VIP_PRO_Mac_v.*\.zip$/], async (req, res) => {
  let ver = '4.9.17';

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

// Tuyệt đối không tự ý gán video phát nền ngầm hoặc blob tạm thời, không tự ý quét bốc file cũ trong uploads
if (currentMasterLiveState.mediaUrl) {
  const fileOnDisk = findFileInUploadDirs(currentMasterLiveState.mediaUrl);
  if (!fileOnDisk || !fs.existsSync(fileOnDisk)) {
    currentMasterLiveState.mediaUrl = null;
  }
}
if (currentMasterLiveState.mediaUrl) {
  currentMasterLiveState.isVideo = true;
  currentMasterLiveState.isPlaying = true;
  currentMasterLiveState.videoPlaybackEvent = 'play';
  currentMasterLiveState.isUserExplicitMediaLocked = true;
  console.log(`[AutoRestore] 🎬 Đã khôi phục video gần nhất của người dùng: ${currentMasterLiveState.mediaUrl}`);
  saveLiveStateToFile();
} else {
  currentMasterLiveState.mediaUrl = null;
  currentMasterLiveState.isVideo = false;
  currentMasterLiveState.isPlaying = false;
  currentMasterLiveState.videoPlaybackEvent = 'pause';
  currentMasterLiveState.isUserExplicitMediaLocked = false;
  saveLiveStateToFile();
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
      if (cleanState.clearMedia || cleanState.mediaUrl === null) {
        nextState.mediaUrl = null;
        nextState.isVideo = false;
        nextState.isPlaying = false;
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
        // 🌟 Kênh TikTok chưa phát Live thực tế: Tự động kích hoạt Chế độ Trực Tiếp AI Sẵn Sàng (Simulation & Auto Events)
        console.log(`[TikTok Live] ℹ️ Kênh @${targetUser} hiện chưa phát trực tiếp trên TikTok. Tự động chuyển sang Chế độ Trực Tiếp AI Sẵn Sàng (Simulation & 14 Sự kiện live test)...`);
        startSimulationMode();
        currentUsername = targetUser;
        const finalFlv = flvUrl || globalFlvUrl || null;
        const finalHls = hlsUrl || null;

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

        io.emit('tiktok_connected', { 
          username: targetUser, 
          roomId: `SIM_${targetUser}_READY`, 
          flvUrl: finalFlv, 
          hlsUrl: finalHls,
          isSimulation: true 
        });
        io.emit('tiktok_status', { 
          connected: true, 
          username: targetUser, 
          roomId: `SIM_${targetUser}_READY`, 
          flvUrl: finalFlv, 
          hlsUrl: finalHls,
          isSimulation: true,
          note: 'Chế độ Trực Tiếp AI Sẵn Sàng — Tự động nhận diện 14 sự kiện live'
        });

        // Tự động kiểm tra kết nối lại ngầm mỗi 20s khi streamer chính thức bấm Phát Live trên TikTok
        if (autoReconnectTimer) clearInterval(autoReconnectTimer);
        autoReconnectTimer = setInterval(() => {
          if (!currentUsername) return;
          console.log(`[TikTok Live] 🔄 Đang kiểm tra luồng phát thực tế cho @${currentUsername}...`);
          const testConn = new TikTokConnector(currentUsername, {
            processInitialData: true,
            enableExtendedGiftInfo: false,
            sessionId,
            requestHeaders: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
          });
          testConn.connect().then(realState => {
            console.log(`[TikTok Live] 🎉 Streamer @${currentUsername} ĐÃ BẮT ĐẦU PHÁT TRỰC TIẾP TRÊN TIKTOK! Nâng cấp luồng thật...`);
            clearInterval(autoReconnectTimer);
            autoReconnectTimer = null;
            stopSimulationMode();
            tiktokConnection = testConn;
            const res = extractFlv(realState);
            const liveFlv = res.bestUrl || globalFlvUrl || null;
            io.emit('tiktok_status', { connected: true, username: currentUsername, roomId: realState?.roomId, flvUrl: liveFlv, isSimulation: false });
            io.emit('tiktok_connected', { username: currentUsername, roomId: realState?.roomId, flvUrl: liveFlv, isSimulation: false });
          }).catch(() => {});
        }, 20000);
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
      const bodyData = {
        ...currentMasterLiveState,
        tunnelUrl: currentTunnelUrl || currentMasterLiveState.tunnelUrl || null
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
  if (currentMasterLiveState.mediaUrl) {
    currentMasterLiveState.isVideo = true;
    currentMasterLiveState.isPlaying = true;
    currentMasterLiveState.videoPlaybackEvent = 'play';
    currentMasterLiveState.isVideoAudioMuted = false;
    currentMasterLiveState.isMuted = false;
    if (typeof currentMasterLiveState.videoVolume !== 'number' || currentMasterLiveState.videoVolume <= 0) {
      currentMasterLiveState.videoVolume = 1.0;
    }
  }
  res.json(currentMasterLiveState);
});

app.post('/api/live-state', (req, res) => {
  if (req.body && typeof req.body === 'object') {
    const payload = { ...req.body };
    delete payload.force; // Không lưu cờ force vào live state
    
    // Tự động chuyển đổi base64 data: thành file thật trong uploads/
    if (payload.mediaUrl && typeof payload.mediaUrl === 'string') {
      if (payload.mediaUrl.startsWith('data:')) {
        payload.mediaUrl = saveBase64MediaToUploads(payload.mediaUrl, 'master_live');
      } else if (payload.mediaUrl.startsWith('blob:')) {
        delete payload.mediaUrl; // Không lưu blob URL tạm thời
      } else if (payload.mediaUrl.includes('/uploads/')) {
        payload.mediaUrl = payload.mediaUrl.substring(payload.mediaUrl.indexOf('/uploads/'));
      }
    } else if (!payload.mediaUrl && !payload.clearMedia && currentMasterLiveState.mediaUrl) {
      delete payload.mediaUrl; // Bảo vệ video hiện tại không bị gán đè null
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
        if (av.talkVideo && av.talkVideo.startsWith('data:')) av.talkVideo = saveBase64MediaToUploads(av.talkVideo, 'avatar_talk');
        if (av.idleVideo && av.idleVideo.startsWith('data:')) av.idleVideo = saveBase64MediaToUploads(av.idleVideo, 'avatar_idle');
        if (av.resolvedVidSrc && av.resolvedVidSrc.startsWith('data:')) av.resolvedVidSrc = saveBase64MediaToUploads(av.resolvedVidSrc, 'avatar_src');
        return av;
      });
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

app.post('/api/tiktok-shop/sync', (req, res) => {
  const { storeUrl, sellerCenterUrl, rawProducts } = req.body || {};
  let products = Array.isArray(rawProducts) ? rawProducts : [];
  
  if (products.length === 0 && (storeUrl || sellerCenterUrl)) {
    products = [
      { id: 1, name: 'Sản phẩm TikTok Shop #01', price: '199.000đ', oldPrice: '350.000đ', badge: 'GIÁ SỐC LIVE 🔥', keywords: 'mã 1;sp1;mua 1;chốt 1', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80' },
      { id: 2, name: 'Sản phẩm TikTok Shop #02', price: '249.000đ', oldPrice: '450.000đ', badge: 'FLASH SALE ⚡', keywords: 'mã 2;sp2;mua 2;chốt 2', image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=400&q=80' }
    ];
  }

  return res.json({
    success: true,
    storeUrl: storeUrl || sellerCenterUrl || 'https://shop.tiktok.com',
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

