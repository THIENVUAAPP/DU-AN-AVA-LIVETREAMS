// ========================================================
// UNIFIED AIDOL DB - Cơ sở dữ liệu dùng chung 100% giữa Web & Desktop Studio
// DB: AIDOL_DB | Store: library_items
// ========================================================

const DB_NAME = 'AIDOL_DB';
const STORE_NAME = 'library_items';
const DB_VERSION = 1;

let dbPromise = null;

export const initAidolDB = () => {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };

      request.onsuccess = (event) => {
        resolve(event.target.result);
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  }
  return dbPromise;
};

// --- CRUD Operations trên Unified Store ---
export const saveAidolItem = async (item) => {
  try {
    const db = await initAidolDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      const record = {
        id: item.id || `aidol_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        name: item.name || 'AIDOL của tôi',
        category: item.category || 'livestream',
        type: item.type || (item.fileBlob?.type?.includes('video') ? 'video' : 'image'),
        fileBlob: item.fileBlob || item.fileData || null,
        mediaUrl: item.mediaUrl || item.url || '',
        createdAt: item.createdAt || new Date().toISOString(),
        isPersonal: true
      };

      const request = store.put(record);

      request.onsuccess = () => {
        // Dispatch custom event để đồng bộ ngay lập tức các component đang mở
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('aidol_db_updated', { detail: { action: 'save', item: record } }));
        }
        resolve(record);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Failed to save to AIDOL_DB:', error);
    return null;
  }
};

export const loadAllAidolItems = async () => {
  try {
    const db = await initAidolDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const rawItems = request.result || [];
        const items = rawItems.map(item => ({
          ...item,
          url: item.fileBlob ? URL.createObjectURL(item.fileBlob) : (item.mediaUrl || item.url),
          mediaUrl: item.fileBlob ? URL.createObjectURL(item.fileBlob) : (item.mediaUrl || item.url),
          isPersonal: true
        }));
        resolve(items.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')));
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Failed to load from AIDOL_DB:', error);
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
    mediaUrl: char.url
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

// Danh sách Template / Nhân vật Mẫu Hệ thống Trang chủ
export const DEFAULT_SYSTEM_TEMPLATES = [
  {
    id: 'sys_aidol_1',
    name: 'AIDOL Livestream 01 (GreenScreen)',
    type: 'video',
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-green-dress-41315-large.mp4',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-green-dress-41315-large.mp4',
    category: 'livestream',
    isVIP: false,
    isPersonal: false
  },
  {
    id: 'sys_aidol_2',
    name: 'AIDOL Tư Vấn Bán Hàng 02',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
    category: 'sales',
    isVIP: false,
    isPersonal: false
  },
  {
    id: 'sys_aidol_3',
    name: 'AIDOL Vũ Đạo Dance 03',
    type: 'video',
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-dancing-in-front-of-a-camera-40742-large.mp4',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-girl-dancing-in-front-of-a-camera-40742-large.mp4',
    category: 'dance',
    isVIP: true,
    isPersonal: false
  },
  {
    id: 'sys_aidol_4',
    name: 'AIDOL Tâm Sự & Kể Chuyện 04',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80',
    category: 'story',
    isVIP: false,
    isPersonal: false
  }
];

