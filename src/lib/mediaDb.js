// Lưu bền các file lớn (video nền, nhân vật video, nhạc) bằng IndexedDB — sống sót qua lần tải lại
// trang/chạy lại code, khác với blob URL (URL.createObjectURL) vốn mất hiệu lực ngay khi reload.
// localStorage không dùng được cho việc này vì giới hạn dung lượng quá nhỏ (~5MB) so với file video/nhạc.
const DB_NAME = 'avalive_dancefloor_media';
const DB_VERSION = 1;
const STORE_NAME = 'blobs';

function openDb() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('Trình duyệt không hỗ trợ IndexedDB.'));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// record: { id, category, blob, meta }
export async function saveMediaBlob(record) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(record);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function deleteMediaBlob(id) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function loadMediaBlobsByCategory(category) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).getAll();
    req.onsuccess = () => resolve((req.result || []).filter((r) => r.category === category));
    req.onerror = () => reject(req.error);
  });
}
