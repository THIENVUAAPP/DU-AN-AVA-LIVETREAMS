// ========================================================
// LIVE KHO DB - IndexedDB cho Kho Video/Audio Live
// Lưu trữ video/audio theo từng loại: greeting, gift, dance, story, reaction, idle
// ========================================================

const DB_NAME = 'LIVE_KHO_DB';
const DB_VERSION = 1;
const STORE_NAME = 'live_media';

export const LIVE_CATEGORIES = [
  { id: 'greeting', name: 'Greeting', desc: 'Chào hỏi khi có Follow/Comment', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30', emoji: '👋' },
  { id: 'gift', name: 'Gift', desc: 'Cảm ơn khi nhận quà tặng', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', emoji: '🎁' },
  { id: 'dance', name: 'Dance', desc: 'Nhảy khi đạt target/quà lớn', color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/30', emoji: '💃' },
  { id: 'story', name: 'Story/Content', desc: 'Video nội dung chính (kể chuyện, bán hàng)', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30', emoji: '📖' },
  { id: 'reaction', name: 'Reaction', desc: 'Laugh, Cry, Happy, Thinking, Waiting', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30', emoji: '😄' },
  { id: 'idle', name: 'Idle', desc: 'Trạng thái nghỉ khi không có tương tác', color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/30', emoji: '😴' },
];

export const initLiveDB = () => new Promise((resolve, reject) => {
  const req = indexedDB.open(DB_NAME, DB_VERSION);
  req.onupgradeneeded = (e) => {
    const db = e.target.result;
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      store.createIndex('category', 'category', { unique: false });
    }
  };
  req.onsuccess = () => resolve(req.result);
  req.onerror = () => reject(req.error);
});

export const addLiveMedia = async (item) => {
  const db = await initLiveDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(item);
    tx.oncomplete = () => resolve(item);
    tx.onerror = () => reject(tx.error);
  });
};

export const getAllLiveMedia = async () => {
  const db = await initLiveDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).getAll();
    req.onsuccess = () => {
      const items = req.result.map(item => ({
        ...item,
        mediaUrl: item.fileBlob ? URL.createObjectURL(item.fileBlob) : item.mediaUrl
      }));
      resolve(items.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
    };
    req.onerror = () => reject(req.error);
  });
};

export const getLiveMediaByCategory = async (category) => {
  const all = await getAllLiveMedia();
  return all.filter(item => item.category === category);
};

export const deleteLiveMedia = async (id) => {
  const db = await initLiveDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};

// Import từ AIDOL_DB sang LIVE_KHO_DB
export const importFromAIDOLDB = async (aidolItem, liveCategory) => {
  const newItem = {
    id: 'live_' + Date.now() + '_' + Math.random().toString(36).slice(2),
    name: aidolItem.name,
    category: liveCategory,
    type: aidolItem.type,
    fileBlob: aidolItem.fileBlob,
    mediaUrl: aidolItem.mediaUrl,
    sourceId: aidolItem.id,
    createdAt: new Date().toISOString()
  };
  return addLiveMedia(newItem);
};
