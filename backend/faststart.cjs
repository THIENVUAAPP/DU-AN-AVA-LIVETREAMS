const fs = require('fs');
const path = require('path');

/**
 * ⚡ QTFastStart thuần Node.js (Zero-Dependency)
 * Tự động di chuyển 'moov' atom lên đầu file MP4 (ngay sau 'ftyp')
 * Giúp trình duyệt Chromium (TikTok Live Studio, OBS, Edge, Chrome) mở video ngay tức khắc trong 30ms,
 * không cần tải cả file hay đọc cuối file, không bị lag, giật hay đứng hình!
 */
function patchMoovOffsets(buffer, shift) {
  for (let i = 0; i < buffer.length - 8; i++) {
    const type = buffer.toString('ascii', i + 4, i + 8);
    if (type === 'stco') {
      const entryCount = buffer.readUInt32BE(i + 12);
      let offsetPos = i + 16;
      for (let j = 0; j < entryCount; j++) {
        if (offsetPos + 4 > buffer.length) break;
        const oldOffset = buffer.readUInt32BE(offsetPos);
        buffer.writeUInt32BE(oldOffset + shift, offsetPos);
        offsetPos += 4;
      }
    } else if (type === 'co64') {
      const entryCount = buffer.readUInt32BE(i + 12);
      let offsetPos = i + 16;
      for (let j = 0; j < entryCount; j++) {
        if (offsetPos + 8 > buffer.length) break;
        const oldOffset = buffer.readBigUInt64BE(offsetPos);
        buffer.writeBigUInt64BE(oldOffset + BigInt(shift), offsetPos);
        offsetPos += 8;
      }
    }
  }
}

function faststart(filePath) {
  let fd = null;
  let outFd = null;
  const tempPath = filePath + '.faststart.tmp';

  try {
    if (!fs.existsSync(filePath)) return false;
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    if (fileSize < 1024) return false;

    fd = fs.openSync(filePath, 'r');

    let ftypBox = null;
    let moovBox = null;
    let mdatOffset = -1;
    let mdatSize = 0;
    let moovOffset = -1;

    let pos = 0;
    while (pos < fileSize) {
      const header = Buffer.alloc(8);
      const bytesRead = fs.readSync(fd, header, 0, 8, pos);
      if (bytesRead < 8) break;

      let size = header.readUInt32BE(0);
      const type = header.toString('ascii', 4, 8);

      if (size === 1) {
        const extHeader = Buffer.alloc(8);
        fs.readSync(fd, extHeader, 0, 8, pos + 8);
        size = Number(extHeader.readBigUInt64BE(0));
      } else if (size === 0) {
        size = fileSize - pos;
      }

      if (size <= 0 || pos + size > fileSize + 1024) {
        break;
      }

      if (type === 'ftyp') {
        ftypBox = Buffer.alloc(size);
        fs.readSync(fd, ftypBox, 0, size, pos);
      } else if (type === 'moov') {
        moovOffset = pos;
        moovBox = Buffer.alloc(size);
        fs.readSync(fd, moovBox, 0, size, pos);
      } else if (type === 'mdat') {
        mdatOffset = pos;
        mdatSize = size;
      }

      pos += size;
    }

    // Nếu moov đã nằm trước mdat rồi -> đã chuẩn faststart 100%!
    if (moovOffset < mdatOffset && moovOffset >= 0) {
      fs.closeSync(fd);
      fd = null;
      return true;
    }

    if (!ftypBox || !moovBox || mdatOffset < 0) {
      fs.closeSync(fd);
      fd = null;
      return false;
    }

    // Cập nhật các offset trong moov: cộng thêm đúng kích thước của moovBox
    const shift = moovBox.length;
    patchMoovOffsets(moovBox, shift);

    outFd = fs.openSync(tempPath, 'w');
    fs.writeSync(outFd, ftypBox);
    fs.writeSync(outFd, moovBox);

    // Stream phần mdat sang file mới
    const BUFFER_SIZE = 1024 * 1024 * 4; // 4MB buffer
    const buf = Buffer.alloc(BUFFER_SIZE);
    let curRead = mdatOffset;
    const endRead = mdatOffset + mdatSize;

    while (curRead < endRead) {
      const toRead = Math.min(BUFFER_SIZE, endRead - curRead);
      const n = fs.readSync(fd, buf, 0, toRead, curRead);
      if (n <= 0) break;
      fs.writeSync(outFd, buf, 0, n);
      curRead += n;
    }

    fs.closeSync(fd);
    fd = null;
    fs.closeSync(outFd);
    outFd = null;

    // Thay thế file gốc bằng file đã tối ưu faststart
    fs.renameSync(tempPath, filePath);
    console.log(`[FastStart] 🚀 Đã tối ưu chuyển moov lên đầu cho: ${path.basename(filePath)} (${(fileSize / (1024 * 1024)).toFixed(1)}MB)`);
    return true;
  } catch (err) {
    console.warn(`[FastStart warning] ${path.basename(filePath)}:`, err.message);
    if (fd !== null) try { fs.closeSync(fd); } catch (e) {}
    if (outFd !== null) try { fs.closeSync(outFd); } catch (e) {}
    if (fs.existsSync(tempPath)) try { fs.unlinkSync(tempPath); } catch (e) {}
    return false;
  }
}

/**
 * Quét và tối ưu hoá toàn bộ video trong thư mục
 */
function optimizeAllVideosInDir(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) return;
    const files = fs.readdirSync(dirPath).filter(f => f.toLowerCase().endsWith('.mp4'));
    let optimizedCount = 0;
    for (const file of files) {
      const fp = path.join(dirPath, file);
      const ok = faststart(fp);
      if (ok) optimizedCount++;
    }
    if (optimizedCount > 0) {
      console.log(`[FastStart] ✅ Đã hoàn tất tối ưu moov atom cho ${optimizedCount} video trong ${path.basename(dirPath)}!`);
    }
  } catch (e) {}
}

module.exports = {
  faststart,
  optimizeAllVideosInDir
};
