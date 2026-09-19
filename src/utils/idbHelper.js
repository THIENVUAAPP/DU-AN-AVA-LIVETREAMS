// ========================================================
// UNIFIED AIDOL DB - Cơ sở dữ liệu dùng chung 100% giữa Web & Desktop Studio
// DB: AIDOL_DB | Store: library_items
// ========================================================
import { generateFileSignature } from './mediaDeduplication';

const DB_NAME = 'AIDOL_DB';
const STORE_NAME = 'library_items';
const DB_VERSION = 1;

let dbPromise = null;

export const initAidolDB = () => {
  if (typeof window === 'undefined' || typeof indexedDB === 'undefined') {
    return Promise.resolve(null);
  }
  if (!dbPromise) {
    dbPromise = new Promise((resolve) => {
      try {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
          try {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
              db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
          } catch (e) {}
        };

        request.onsuccess = (event) => {
          resolve(event.target.result);
        };

        request.onerror = () => {
          resolve(null);
        };
      } catch (err) {
        resolve(null);
      }
    });
  }
  return dbPromise;
};

// Bộ nhớ đệm RAM toàn cục cho Blob video lớn (tránh làm sập IndexedDB và tràn bộ nhớ)
if (typeof window !== 'undefined') {
  window.__activeMediaBlobMap = window.__activeMediaBlobMap || new Map();
}
export const getBlobMemoryCache = () => {
  if (typeof window !== 'undefined') {
    window.__activeMediaBlobMap = window.__activeMediaBlobMap || new Map();
    return window.__activeMediaBlobMap;
  }
  return new Map();
};

export const getActiveBlobForMedia = (key) => {
  if (!key || typeof window === 'undefined') return null;
  const memCache = getBlobMemoryCache();
  if (memCache.has(key)) return memCache.get(key);
  if (window.opener && window.opener.__activeMediaBlobMap && window.opener.__activeMediaBlobMap.has(key)) {
    return window.opener.__activeMediaBlobMap.get(key);
  }
  if (window.opener && window.opener.__activeMediaBlob && (window.opener.__activeMediaBlob instanceof Blob || window.opener.__activeMediaBlob instanceof File)) {
    return window.opener.__activeMediaBlob;
  }
  if (window.__activeMediaBlob && (window.__activeMediaBlob instanceof Blob || window.__activeMediaBlob instanceof File)) {
    return window.__activeMediaBlob;
  }
  return null;
};

// --- Tìm kiếm item video đã tồn tại dựa trên file signature hoặc kích thước byte ---
export const findExistingAidolByFile = async (file) => {
  if (!file) return null;
  try {
    const db = await initAidolDB();
    if (!db) return null;
    const sig = generateFileSignature(file);
    const fileSize = Number(file.size || 0);
    const fileName = String(file.name || '').trim().toLowerCase();

    return new Promise((resolve) => {
      try {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const req = store.getAll();
        req.onsuccess = () => {
          const items = req.result || [];
          const found = items.find(it => {
            if (it.fileSignature && it.fileSignature === sig) return true;
            if (fileSize > 50000 && it.fileSize && Number(it.fileSize) === fileSize) {
              const itName = String(it.name || '').trim().toLowerCase();
              if (itName && fileName && (itName === fileName || fileName.includes(itName) || itName.includes(fileName))) {
                return true;
              }
            }
            return false;
          });
          resolve(found || null);
        };
        req.onerror = () => resolve(null);
      } catch (e) {
        resolve(null);
      }
    });
  } catch (e) {
    return null;
  }
};

// --- Dọn dẹp triệt để các bản ghi video trùng lặp trong IndexedDB (Giải phóng bộ nhớ máy) ---
export const cleanupDuplicateAidolItems = async () => {
  try {
    const db = await initAidolDB();
    if (!db) return { removedCount: 0, keptCount: 0 };

    return new Promise((resolve) => {
      try {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const req = store.getAll();
        req.onsuccess = () => {
          const items = req.result || [];
          const seenSignatures = new Set();
          const seenSizes = new Map(); // size -> firstItemId
          let removedCount = 0;
          let keptCount = 0;

          for (const it of items) {
            const sig = it.fileSignature || (it.fileBlob ? generateFileSignature(it.fileBlob) : '');
            const size = Number(it.fileSize || (it.fileBlob?.size) || 0);
            const name = String(it.name || '').trim().toLowerCase();
            const key = sig || (size > 100000 ? `${name}__${size}` : null);

            if (key) {
              if (seenSignatures.has(key)) {
                // Trùng lặp! Xóa bản ghi thừa để giải phóng dung lượng đĩa
                store.delete(it.id);
                removedCount++;
                continue;
              }
              seenSignatures.add(key);
            }
            keptCount++;
          }
          console.log(`[IndexedDB Deduplication] Đã dọn dẹp ${removedCount} video trùng lặp, giữ lại ${keptCount} video gốc!`);
          resolve({ removedCount, keptCount });
        };
        req.onerror = () => resolve({ removedCount: 0, keptCount: 0 });
      } catch (e) {
        resolve({ removedCount: 0, keptCount: 0 });
      }
    });
  } catch (e) {
    return { removedCount: 0, keptCount: 0 };
  }
};

// --- CRUD Operations trên Unified Store (Tự động chống trùng lặp & tái sử dụng dữ liệu gốc 100%) ---
export const saveAidolItem = async (item) => {
  try {
    const db = await initAidolDB();
    if (!db) return null;

    const rawBlob = item.fileBlob || item.fileData || null;
    const fileSignature = item.fileSignature || (rawBlob ? generateFileSignature(rawBlob) : '');
    const fileSize = rawBlob ? rawBlob.size : (item.fileSize || 0);
    const itemId = item.id || `aidol_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

    // Lưu ngay vào bộ nhớ RAM toàn cục siêu tốc 0ms
    if (rawBlob) {
      try {
        const memCache = getBlobMemoryCache();
        memCache.set(itemId, rawBlob);
        if (fileSignature) memCache.set(fileSignature, rawBlob);
        if (item.url) memCache.set(item.url, rawBlob);
        if (item.mediaUrl) memCache.set(item.mediaUrl, rawBlob);
        if (typeof window !== 'undefined') {
          window.__activeMediaBlob = rawBlob;
          window.__activeMediaBlobMap = window.__activeMediaBlobMap || new Map();
          window.__activeMediaBlobMap.set(itemId, rawBlob);
          if (fileSignature) window.__activeMediaBlobMap.set(fileSignature, rawBlob);
          if (item.mediaUrl) window.__activeMediaBlobMap.set(item.mediaUrl, rawBlob);
          if (item.url && item.url.startsWith('blob:')) window.__activeMediaBlobUrl = item.url;
        }
      } catch (e) {}
    }

    return new Promise((resolve) => {
      try {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        
        // ⚡ KIỂM TRA TRÙNG LẶP: Quét nhanh xem đã có video này trong Database chưa
        const getAllReq = store.getAll();
        getAllReq.onsuccess = () => {
          const allItems = getAllReq.result || [];
          
          // Tìm video trùng lặp theo ID, Signature hoặc Size byte chính xác
          let existingRecord = allItems.find(r => {
            if (r.id === itemId) return true;
            if (fileSignature && r.fileSignature === fileSignature) return true;
            if (fileSize > 50000 && r.fileSize && Number(r.fileSize) === fileSize) {
              const rName = String(r.name || '').trim().toLowerCase();
              const itName = String(item.name || '').trim().toLowerCase();
              if (rName && itName && (rName === itName || rName.includes(itName) || itName.includes(rName))) {
                return true;
              }
            }
            return false;
          });

          // 🛡️ NẾU ĐÃ TỒN TẠI: TÁI SỬ DỤNG 100% BẢN GHI ĐÃ CÓ, TUYỆT ĐỐI KHÔNG TẠO BẢN GHI MỚI
          if (existingRecord) {
            const finalBlob = rawBlob || existingRecord.fileBlob || null;
            const targetId = existingRecord.id;

            if (finalBlob) {
              try {
                const memCache = getBlobMemoryCache();
                memCache.set(targetId, finalBlob);
                if (fileSignature) memCache.set(fileSignature, finalBlob);
                if (existingRecord.url) memCache.set(existingRecord.url, finalBlob);
                if (existingRecord.mediaUrl) memCache.set(existingRecord.mediaUrl, finalBlob);
              } catch (e) {}
            }

            const updatedRecord = {
              ...existingRecord,
              name: item.name || existingRecord.name,
              fileBlob: finalBlob,
              fileSize: finalBlob ? finalBlob.size : (existingRecord.fileSize || fileSize),
              fileSignature: fileSignature || existingRecord.fileSignature || '',
              mediaUrl: (item.mediaUrl && !item.mediaUrl.startsWith('blob:')) ? item.mediaUrl : (existingRecord.mediaUrl || item.url || ''),
              url: (item.url && item.url.startsWith('blob:')) ? item.url : (existingRecord.url || item.mediaUrl || ''),
              updatedAt: new Date().toISOString(),
              isLiveReady: true
            };

            const putReq = store.put(updatedRecord);
            putReq.onsuccess = () => {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('aidol_db_updated', { detail: { action: 'reuse', item: updatedRecord } }));
              }
              resolve(updatedRecord);
            };
            putReq.onerror = () => resolve(existingRecord);
            return;
          }

          // 🆕 NẾU LÀ VIDEO HOÀN TOÀN MỚI: LƯU DUY NHẤT 1 LẦN
          const finalBlob = rawBlob || null;
          const record = {
            id: itemId,
            name: item.name || 'Chưa đặt tên',
            type: item.type || 'video',
            fileBlob: finalBlob,
            fileSize: finalBlob ? finalBlob.size : fileSize,
            fileSignature: fileSignature,
            mediaUrl: item.mediaUrl || item.url || '',
            url: item.url || item.mediaUrl || '',
            tags: item.tags || [],
            aspectRatio: item.aspectRatio || '9:16',
            isLiveReady: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          const putReq = store.put(record);
          putReq.onsuccess = () => {
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('aidol_db_updated', { detail: { action: 'save', item: record } }));
            }
            resolve(record);
          };
          putReq.onerror = () => resolve(null);
        };

        getAllReq.onerror = () => {
          // Fallback lưu trực tiếp nếu getAll lỗi
          const record = {
            id: itemId,
            name: item.name || 'Chưa đặt tên',
            type: item.type || 'video',
            fileBlob: rawBlob,
            fileSize: rawBlob ? rawBlob.size : fileSize,
            fileSignature: fileSignature,
            mediaUrl: item.mediaUrl || item.url || '',
            url: item.url || item.mediaUrl || '',
            tags: item.tags || [],
            aspectRatio: item.aspectRatio || '9:16',
            isLiveReady: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          const putReq = store.put(record);
          putReq.onsuccess = () => resolve(record);
          putReq.onerror = () => resolve(null);
        };
      } catch (err) {
        resolve(null);
      }
    });
  } catch (error) {
    console.error('Failed to save to AIDOL_DB:', error);
    return null;
  }
};

export const loadAllAidolItems = async () => {
  try {
    const db = await initAidolDB();
    if (!db) return [];
    return new Promise((resolve) => {
      try {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => {
          const rawItems = request.result || [];
          const memCache = getBlobMemoryCache();
          const openerCache = (typeof window !== 'undefined' && window.opener && window.opener.__activeMediaBlobMap) ? window.opener.__activeMediaBlobMap : null;

          const items = rawItems.map(item => {
            let finalUrl = item.mediaUrl || item.url;
            let finalBlob = item.fileBlob || memCache.get(item.id) || memCache.get(item.url) || memCache.get(item.mediaUrl);
            if (!finalBlob && openerCache) {
              finalBlob = openerCache.get(item.id) || openerCache.get(item.url) || openerCache.get(item.mediaUrl);
            }
            if (!finalBlob && typeof window !== 'undefined' && window.__activeMediaBlob) {
              finalBlob = window.__activeMediaBlob;
            }

            if (finalBlob && (!finalUrl || finalUrl.startsWith('blob:'))) {
               try {
                 finalUrl = URL.createObjectURL(finalBlob);
               } catch(e) {}
            }
            return {
              ...item,
              fileBlob: finalBlob || null,
              url: finalUrl,
              mediaUrl: finalUrl,
              isPersonal: true
            };
          });
          resolve(items.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')));
        };
        request.onerror = () => resolve([]);
      } catch (e) {
        resolve([]);
      }
    });
  } catch (error) {
    return [];
  }
};

export const deleteAidolItem = async (id) => {
  try {
    const db = await initAidolDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('aidol_db_updated', { detail: { action: 'delete', id } }));
        }
        resolve(true);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Failed to delete from AIDOL_DB:', error);
    return false;
  }
};

// --- Backwards Compatibility Wrappers để không phá vỡ các file khác ---
export const saveCharacterToIDB = async (char) => {
  return saveAidolItem({
    id: char.id,
    name: char.name,
    type: char.type,
    fileBlob: char.fileData || char.fileBlob,
    mediaUrl: char.mediaUrl || char.url
  });
};

export const loadAllCharactersFromIDB = async () => {
  const items = await loadAllAidolItems();
  return items.map(item => ({
    id: item.id,
    name: item.name,
    type: item.type,
    fileData: item.fileBlob,
    url: item.url,
    mediaUrl: item.mediaUrl
  }));
};

export const deleteCharacterFromIDB = async (id) => {
  return deleteAidolItem(id);
};

export const savePersonalTemplateToIDB = async (tpl) => {
  return saveAidolItem(tpl);
};

export const loadAllPersonalTemplatesFromIDB = async () => {
  return loadAllAidolItems();
};

export const deletePersonalTemplateFromIDB = async (id) => {
  return deleteAidolItem(id);
};

// Danh mục chuẩn chung
export const DEFAULT_AIDOL_CATEGORIES = [
  { id: 'all', name: 'Tất cả' },
  { id: 'livestream', name: 'Chuyên Livestream' },
  { id: 'sales', name: 'Tư Vấn Bán Hàng' },
  { id: 'thankyou', name: 'Kho Video Cảm Ơn' },
  { id: 'audio', name: 'Kho Âm Thanh' },
  { id: 'dance', name: 'Chuyên Nhảy (Dance)' },
  { id: 'story', name: 'Kể Chuyện / Tâm Sự' }
];

// Danh sách Template / Nhân vật Mẫu Hệ thống (Do Admin tải lên trực tiếp, không dùng mẫu cứng)
export const DEFAULT_SYSTEM_TEMPLATES = [];

