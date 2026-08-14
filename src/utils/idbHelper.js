const DB_NAME = 'AvaliveDB';
const STORE_CUSTOM_CHARS = 'custom_characters';
const STORE_PERSONAL_TEMPLATES = 'personal_templates';
const DB_VERSION = 2;

let dbPromise = null;

const initDB = () => {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_CUSTOM_CHARS)) {
          db.createObjectStore(STORE_CUSTOM_CHARS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORE_PERSONAL_TEMPLATES)) {
          db.createObjectStore(STORE_PERSONAL_TEMPLATES, { keyPath: 'id' });
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

// --- Custom Characters Helpers ---
export const saveCharacterToIDB = async (character) => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_CUSTOM_CHARS], 'readwrite');
      const store = transaction.objectStore(STORE_CUSTOM_CHARS);
      const request = store.put(character);

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Failed to save character to IDB:', error);
    return false;
  }
};

export const loadAllCharactersFromIDB = async () => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_CUSTOM_CHARS], 'readonly');
      const store = transaction.objectStore(STORE_CUSTOM_CHARS);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Failed to load characters from IDB:', error);
    return [];
  }
};

export const deleteCharacterFromIDB = async (id) => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_CUSTOM_CHARS], 'readwrite');
      const store = transaction.objectStore(STORE_CUSTOM_CHARS);
      const request = store.delete(id);

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Failed to delete character from IDB:', error);
    return false;
  }
};

// --- Personal Templates Helpers ---
export const savePersonalTemplateToIDB = async (template) => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_PERSONAL_TEMPLATES], 'readwrite');
      const store = transaction.objectStore(STORE_PERSONAL_TEMPLATES);
      const request = store.put(template);

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Failed to save personal template to IDB:', error);
    return false;
  }
};

export const loadAllPersonalTemplatesFromIDB = async () => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_PERSONAL_TEMPLATES], 'readonly');
      const store = transaction.objectStore(STORE_PERSONAL_TEMPLATES);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Failed to load personal templates from IDB:', error);
    return [];
  }
};

export const deletePersonalTemplateFromIDB = async (id) => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_PERSONAL_TEMPLATES], 'readwrite');
      const store = transaction.objectStore(STORE_PERSONAL_TEMPLATES);
      const request = store.delete(id);

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Failed to delete personal template from IDB:', error);
    return false;
  }
};
