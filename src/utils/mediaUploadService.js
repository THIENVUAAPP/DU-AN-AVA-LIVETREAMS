/**
 * 🚀 MEDIA UPLOAD & SERVER SYNC SERVICE (AVALIVE VIP PRO)
 * - Tự động đẩy toàn bộ Video, Hình ảnh từ Sân khấu phụ (Live Idol Avatar, Sequencer), 
 *   14 Sự kiện live và Sân khấu chính vào thư mục uploads của máy chủ.
 * - Chuyển đổi toàn bộ blob: URL / Data URL sang link máy chủ /uploads/... 
 *   để Window Capture OBS và TikTok Live Studio phát 100% mượt mà, không bị đen màn hình.
 */

import { syncMasterLiveState, sendVideoControl } from '../lib/masterLiveSync';

const _blobToServerUrlCache = new Map();
const _uploadingPromises = new Map();

export function getBackendBaseUrl() {
  if (typeof window === 'undefined') return 'http://127.0.0.1:3001';
  const custom = localStorage.getItem('aidol_backend_url');
  if (custom && custom.startsWith('http')) return custom.replace(/\/$/, '');
  
  const currentProto = window.location.protocol || 'http:';
  const currentHost = window.location.hostname || '127.0.0.1';
  const currentPort = window.location.port || '3001';

  if (currentHost === 'localhost' || currentHost === '127.0.0.1' || currentPort === '5173') {
    return `${currentProto}//${currentHost}:3001`;
  }
  return window.location.origin || 'http://127.0.0.1:3001';
}

/**
 * Tải trực tiếp 1 File hoặc Blob lên server /api/upload-media
 */
export async function uploadMediaToServer(fileOrBlob, preferredFilename = null) {
  if (!fileOrBlob) return null;

  try {
    const filename = preferredFilename || (fileOrBlob.name) || `media_${Date.now()}.${fileOrBlob.type?.includes('image') ? 'jpg' : 'mp4'}`;
    const formData = new FormData();
    formData.append('file', fileOrBlob, filename);

    const backendBase = getBackendBaseUrl();
    const candidateEndpoints = [
      `${backendBase}/api/upload-media`,
      '/api/upload-media',
      'http://127.0.0.1:3001/api/upload-media',
      'http://localhost:3001/api/upload-media'
    ];

    let resultData = null;
    for (const ep of candidateEndpoints) {
      try {
        const res = await fetch(ep, {
          method: 'POST',
          body: formData
        });
        if (res.ok) {
          resultData = await res.json();
          if (resultData && resultData.url) {
            break;
          }
        }
      } catch (err) {}
    }

    if (resultData && resultData.url) {
      return resultData.url;
    }
  } catch (e) {
    console.warn('[MediaUploadService] Upload error:', e);
  }
  return null;
}

/**
 * Đảm bảo mọi đường dẫn media (dù là blob:, data: hay file cục bộ) 
 * đều được chuyển thành link máy chủ /uploads/...
 */
export async function ensureServerMediaUrl(sourceUrlOrFile, preferredFilename = null) {
  if (!sourceUrlOrFile) return null;

  // 1. Nếu đã là link server /uploads/... thì dùng luôn
  if (typeof sourceUrlOrFile === 'string') {
    if (sourceUrlOrFile.includes('/uploads/')) {
      const idx = sourceUrlOrFile.indexOf('/uploads/');
      return sourceUrlOrFile.substring(idx);
    }
    // Nếu là link http/https bên ngoài (không phải blob) thì giữ nguyên
    if (!sourceUrlOrFile.startsWith('blob:') && !sourceUrlOrFile.startsWith('data:')) {
      return sourceUrlOrFile;
    }

    // Kiểm tra cache đã upload trước đó
    if (_blobToServerUrlCache.has(sourceUrlOrFile)) {
      return _blobToServerUrlCache.get(sourceUrlOrFile);
    }

    // Đang trong tiến trình upload
    if (_uploadingPromises.has(sourceUrlOrFile)) {
      return await _uploadingPromises.get(sourceUrlOrFile);
    }
  }

  // 2. Chuyển đổi blob: hoặc data: sang Blob object
  const uploadTask = (async () => {
    try {
      let blob = null;
      let filename = preferredFilename;

      if (sourceUrlOrFile instanceof Blob || sourceUrlOrFile instanceof File) {
        blob = sourceUrlOrFile;
        if (!filename && sourceUrlOrFile.name) filename = sourceUrlOrFile.name;
      } else if (typeof sourceUrlOrFile === 'string') {
        if (sourceUrlOrFile.startsWith('blob:')) {
          const res = await fetch(sourceUrlOrFile);
          blob = await res.blob();
        } else if (sourceUrlOrFile.startsWith('data:')) {
          const arr = sourceUrlOrFile.split(',');
          const mime = arr[0].match(/:(.*?);/)?.[1] || 'video/mp4';
          const bstr = atob(arr[1]);
          let n = bstr.length;
          const u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          blob = new Blob([u8arr], { type: mime });
        }
      }

      if (!blob) return typeof sourceUrlOrFile === 'string' ? sourceUrlOrFile : null;

      const isImg = blob.type?.startsWith('image/') || preferredFilename?.match(/\.(png|jpe?g|webp|gif|svg)$/i);
      const ext = isImg ? (blob.type?.split('/')[1] || 'jpg') : (blob.type?.split('/')[1] || 'mp4');
      const safeFilename = filename || `live_sync_${Date.now()}.${ext}`;

      const serverUrl = await uploadMediaToServer(blob, safeFilename);
      if (serverUrl) {
        if (typeof sourceUrlOrFile === 'string') {
          _blobToServerUrlCache.set(sourceUrlOrFile, serverUrl);
        }
        return serverUrl;
      }
    } catch (err) {
      console.warn('[MediaUploadService] Failed to ensure server url:', err);
    } finally {
      if (typeof sourceUrlOrFile === 'string') {
        _uploadingPromises.delete(sourceUrlOrFile);
      }
    }
    return typeof sourceUrlOrFile === 'string' ? sourceUrlOrFile : null;
  })();

  if (typeof sourceUrlOrFile === 'string') {
    _uploadingPromises.set(sourceUrlOrFile, uploadTask);
  }

  return await uploadTask;
}

/**
 * Tự động đẩy media và đồng bộ ngay tức thì sang Sân khấu chính, Window Capture và TikTok Live Studio
 */
export async function pushMediaToStageAndCapture(payload = {}, socket = null) {
  const { 
    mediaUrl, 
    title, 
    stepTitle, 
    overlayText, 
    eventType,
    isVideo = true, 
    isPlaying = true, 
    currentTime = 0 
  } = payload;

  let effectiveUrl = mediaUrl;

  // Nếu là blob:, đẩy ngay lên uploads
  if (effectiveUrl && (effectiveUrl.startsWith('blob:') || effectiveUrl.startsWith('data:'))) {
    const serverUrl = await ensureServerMediaUrl(effectiveUrl, payload.filename);
    if (serverUrl) {
      effectiveUrl = serverUrl;
    }
  }

  const syncData = {
    ...payload,
    stage: 'idol',
    mediaUrl: effectiveUrl,
    title: overlayText || title || stepTitle || null,
    overlayText: overlayText || title || stepTitle || null,
    isVideo: isVideo,
    isPlaying: isPlaying,
    videoPlaybackEvent: isPlaying ? 'play' : 'pause',
    updatedAt: Date.now()
  };

  syncMasterLiveState(syncData, socket);

  try {
    const bc = new BroadcastChannel('avalive_master_live_stream');
    bc.postMessage({
      type: eventType ? 'EVENT_VIDEO_PLAY' : 'GLOBAL_MEDIA_CHANGE',
      mediaUrl: effectiveUrl,
      videoUrl: effectiveUrl,
      title: syncData.title,
      overlayText: syncData.overlayText,
      isPlaying: isPlaying,
      currentTime: currentTime,
      source: 'auto_sync',
      timestamp: Date.now()
    });
    setTimeout(() => bc.close(), 100);
  } catch (e) {}

  return effectiveUrl;
}

/**
 * 🗑️ Xóa vĩnh viễn file upload khỏi máy chủ khi người dùng xóa trên giao diện
 */
export async function deleteServerMedia(fileUrl) {
  if (!fileUrl || typeof fileUrl !== 'string') return;
  try {
    const backendBase = getBackendBaseUrl();
    const candidateEndpoints = [
      `${backendBase}/api/delete-upload`,
      '/api/delete-upload',
      'http://127.0.0.1:3001/api/delete-upload',
      'http://localhost:3001/api/delete-upload'
    ];

    for (const ep of candidateEndpoints) {
      try {
        const res = await fetch(ep, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: fileUrl })
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.success) {
            console.log(`[Media Service] 🗑️ Đã xóa vĩnh viễn file khỏi máy chủ: ${fileUrl}`);
            break;
          }
        }
      } catch (err) {}
    }
  } catch (e) {
    console.warn('[deleteServerMedia error]', e);
  }
}
