// ========================================================
// UNIFIED AIDOL DB - Cơ sở dữ liệu dùng chung 100% giữa Web & Desktop Studio
// DB: AIDOL_DB | Store: library_items
// ========================================================

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

// --- CRUD Operations trên Unified Store ---
export const saveAidolItem = async (item) => {
  try {
    const db = await initAidolDB();
    if (!db) return null;
    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        
        const record = {
          id: item.id || `aidol_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          name: item.name || 'Chưa đặt tên',
          type: item.type || 'image',
          fileBlob: item.fileBlob || item.fileData || null,
          mediaUrl: item.mediaUrl || item.url || '',
          url: item.url || item.mediaUrl || '',
          tags: item.tags || [],
          aspectRatio: item.aspectRatio || '9:16',
          isLiveReady: true,
          createdAt: new Date().toISOString()
        };

        const request = store.put(record);
        request.onsuccess = () => {
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('aidol_db_updated', { detail: { action: 'save', item: record } }));
          }
          resolve(record);
        };
        request.onerror = () => resolve(null);
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
          const items = rawItems.map(item => {
            let finalUrl = item.mediaUrl || item.url;
            if (!finalUrl && item.fileBlob) {
               try {
                 finalUrl = URL.createObjectURL(item.fileBlob);
               } catch(e) {}
            }
            return {
              ...item,
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
    name: 'AIDOL Vũ Đạo Hot Trend 01',
    type: 'video',
    poster: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80',
    mediaUrl: '/demo_dancer.mp4',
    url: '/demo_dancer.mp4',
    category: 'dance',
    isVIP: false,
    isPersonal: false
  },
  {
    id: 'sys_aidol_2',
    name: 'AIDOL Tư Vấn Bán Hàng & Chốt Đơn 02',
    type: 'image',
    poster: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
    category: 'sales',
    isVIP: false,
    isPersonal: false
  },
  {
    id: 'sys_aidol_3',
    name: 'AIDOL Livestream Duyên Dáng 03',
    type: 'video',
    poster: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
    mediaUrl: '/demo_dancer.mp4',
    url: '/demo_dancer.mp4',
    category: 'livestream',
    isVIP: true,
    isPersonal: false
  },
  {
    id: 'sys_aidol_4',
    name: 'AIDOL Tâm Sự & Kể Chuyện Đêm 04',
    type: 'image',
    poster: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80',
    category: 'story',
    isVIP: false,
    isPersonal: false
  },
  {
    id: 'sys_aidol_5',
    name: 'AIDOL Cảm Ơn Quà Tặng & Follower 05',
    type: 'image',
    poster: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80',
    category: 'thankyou',
    isVIP: false,
    isPersonal: false
  }
];

