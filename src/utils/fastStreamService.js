/**
 * ⚡ FAST-STREAM CHUNKED SERVICE (AVALIVE VIP PRO)
 * Giải pháp phát luồng video dài 1-2 tiếng / nhiều GB tức thì (0ms latency).
 * - Gửi khối đầu (Head 4MB) & khối đuôi (Tail 4MB chứa moov atom) trong 100ms.
 * - TikTok Live Studio / OBS nhận luồng và phát ngay lập tức.
 * - Các khối tiếp theo được nạp từng phần liên tục trong nền (Progressive Background Streaming).
 */

export async function fastStreamUpload(file, options = {}) {
  const { onInit, onProgress, onError } = options;
  
  // ⚡ Tối ưu chunk size siêu tốc cho video nặng 100MB - 50GB
  const isUltraHd = file.size > 100 * 1024 * 1024;
  const isSuperLarge = file.size > 500 * 1024 * 1024;
  
  const HEAD_CHUNK_SIZE = isSuperLarge ? 16 * 1024 * 1024 : (isUltraHd ? 8 * 1024 * 1024 : 4 * 1024 * 1024);
  const TAIL_CHUNK_SIZE = isSuperLarge ? 16 * 1024 * 1024 : (isUltraHd ? 8 * 1024 * 1024 : 4 * 1024 * 1024);
  const BODY_CHUNK_SIZE = isSuperLarge ? 64 * 1024 * 1024 : (isUltraHd ? 32 * 1024 * 1024 : 16 * 1024 * 1024);
  
  const getBackendUrl = () => {
    if (typeof window === 'undefined') return 'http://127.0.0.1:3001';
    const custom = localStorage.getItem('aidol_backend_url');
    if (custom && custom.startsWith('http')) return custom;
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.port === '5173') {
      return `${window.location.protocol}//${window.location.hostname}:3001`;
    }
    return window.location.origin || 'http://127.0.0.1:3001';
  };

  const backendBase = getBackendUrl();

  try {
    // ⚡ KIỂM TRA ĐƯỜNG DẪN NATIVE CỤC BỘ TRONG ELECTRON (0MS FAST-START)
    let nativeFilePath = null;
    try {
      if (typeof window !== 'undefined' && window.electronAPI && typeof window.electronAPI.getPathForFile === 'function') {
        nativeFilePath = window.electronAPI.getPathForFile(file);
      }
    } catch (e) {}
    if (!nativeFilePath && file.path) {
      nativeFilePath = file.path;
    }

    // BƯỚC 1: Khởi tạo phiên stream tức thì (10-30ms)
    const initRes = await fetch(`${backendBase}/api/upload-stream-init`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        originalName: file.name,
        fileSize: file.size,
        fileType: file.type,
        fileSignature: file.fileSignature || `${file.name}_${file.size}_${file.lastModified}`,
        filePath: nativeFilePath || null
      })
    });

    if (!initRes.ok) throw new Error('Không thể khởi tạo luồng fast-stream');
    const initData = await initRes.json();
    const fileUrl = initData.fileUrl;
    const uploadId = initData.uploadId;

    if (initData.instant || !uploadId) {
      if (onInit) onInit({ fileUrl, uploadId, totalChunks: 1, instant: true, reused: !!initData.reused });
      if (onProgress) onProgress(100);
      return { success: true, fileUrl, reused: !!initData.reused };
    }

    const sendChunk = async (chunkBlob, offset, chunkIndex, total) => {
      const arrayBuf = await chunkBlob.arrayBuffer();
      return fetch(`${backendBase}/api/upload-chunk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/octet-stream',
          'X-Upload-Id': uploadId,
          'X-Chunk-Offset': String(offset),
          'X-Chunk-Index': String(chunkIndex),
          'X-Total-Chunks': String(total || 1)
        },
        body: arrayBuf
      });
    };

    // BƯỚC 2: Xử lý video nhỏ <= HEAD_CHUNK_SIZE
    if (file.size <= HEAD_CHUNK_SIZE) {
      const chunk0 = file.slice(0, file.size);
      await sendChunk(chunk0, 0, 0, 1);
      if (onInit) onInit({ fileUrl, uploadId, totalChunks: 1 });
      if (onProgress) onProgress(100);
      return { success: true, fileUrl };
    }

    // BƯỚC 3: Video lớn - Gửi đồng thời HEAD CHUNK (đầu file) & TAIL CHUNK (đuôi file chứa moov atom) trong 50-100ms
    const headSize = Math.min(HEAD_CHUNK_SIZE, file.size);
    const tailSize = Math.min(TAIL_CHUNK_SIZE, Math.max(0, file.size - headSize));
    const tailOffset = file.size - tailSize;

    const middleSize = Math.max(0, tailOffset - headSize);
    const bodyChunksCount = Math.ceil(middleSize / BODY_CHUNK_SIZE);
    const totalChunks = 1 + (tailSize > 0 ? 1 : 0) + bodyChunksCount;

    const headBlob = file.slice(0, headSize);
    const initPromises = [sendChunk(headBlob, 0, 0, totalChunks)];

    if (tailSize > 0) {
      const tailBlob = file.slice(tailOffset, file.size);
      initPromises.push(sendChunk(tailBlob, tailOffset, 'tail', totalChunks));
    }

    // Chờ cả HEAD & TAIL ghi thành công vào server (chỉ mất ~50-100ms)
    await Promise.all(initPromises);

    // 🚀 BÁO SẴN SÀNG PHÁT TỨC THÌ 0MS: TikTok Live Studio & Window Capture có đầy đủ cả Header và Moov Atom
    if (onInit) {
      onInit({ fileUrl, uploadId, totalChunks });
    }

    if (bodyChunksCount <= 0) {
      if (onProgress) onProgress(100);
      return { success: true, fileUrl };
    }

    let uploadedChunks = 1 + (tailSize > 0 ? 1 : 0);
    if (onProgress) onProgress(Math.round((uploadedChunks / totalChunks) * 100) || 5);

    // BƯỚC 4: Nạp các khối Body ở giữa song song trong nền (6 workers đồng thời)
    (async () => {
      const CONCURRENCY = 6;
      let bodyIdx = 0;

      const worker = async () => {
        while (bodyIdx < bodyChunksCount) {
          const currentBodyIdx = bodyIdx++;
          const start = headSize + currentBodyIdx * BODY_CHUNK_SIZE;
          const end = Math.min(start + BODY_CHUNK_SIZE, tailOffset);
          if (start >= tailOffset) break;

          const chunkBlob = file.slice(start, end);
          try {
            await sendChunk(chunkBlob, start, 1 + currentBodyIdx, totalChunks);
            uploadedChunks++;
            if (onProgress) onProgress(Math.round((uploadedChunks / totalChunks) * 100));
          } catch (e) {
            console.warn('[FastStream Body Chunk error]', currentBodyIdx, e);
          }
        }
      };

      await Promise.all(Array.from({ length: Math.min(CONCURRENCY, bodyChunksCount) }, () => worker()));
      if (onProgress) onProgress(100);
    })();

    return { success: true, fileUrl };
  } catch (err) {
    if (onError) onError(err);
    throw err;
  }
}
