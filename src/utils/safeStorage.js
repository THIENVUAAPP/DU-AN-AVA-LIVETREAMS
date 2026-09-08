/**
 * 🛡️ SAFE STORAGE UTILITIES FOR AVALIVE STUDIO
 * Tuyệt đối bảo vệ ứng dụng không bao giờ bị crash do dữ liệu localStorage lỗi hoặc xung đột phiên bản.
 */

export const safeJsonParse = (str, fallback = null) => {
  if (!str || typeof str !== 'string') return fallback;
  try {
    const res = JSON.parse(str);
    return res !== null && res !== undefined ? res : fallback;
  } catch (err) {
    console.warn('[SafeStorage] Invalid JSON data sanitized:', err.message);
    return fallback;
  }
};

export const safeGetItem = (key, fallback = null) => {
  if (typeof window === 'undefined' || !window.localStorage) return fallback;
  try {
    const val = localStorage.getItem(key);
    return val !== null ? val : fallback;
  } catch {
    return fallback;
  }
};

export const safeGetJson = (key, fallback = null) => {
  if (typeof window === 'undefined' || !window.localStorage) return fallback;
  try {
    const raw = localStorage.getItem(key);
    return safeJsonParse(raw, fallback);
  } catch {
    return fallback;
  }
};

export const safeSetItem = (key, value) => {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    if (typeof value === 'object' && value !== null) {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.setItem(key, String(value));
    }
  } catch (err) {
    console.warn(`[SafeStorage] Could not save key "${key}":`, err.message);
  }
};

export const safeRemoveItem = (key) => {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    localStorage.removeItem(key);
  } catch {}
};

/**
 * 🧹 Tự động quét và dọn dẹp các key localStorage bị lỗi hoặc chứa chuỗi hỏng
 */
export const sanitizeAllLocalStorage = () => {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    const keysToCheck = [
      'avalive_current_user',
      'avalive_system_configs',
      'avalive_user_overrides',
      'avalive_token_data',
      'avalive_master_live_state',
      'aidol_custom_brains',
      'aidol_custom_preset_scripts',
      'aidol_custom_voice_soundboard',
      'aidol_event_configs',
      'ava_live_voice_config_v2',
      'avalive_custom_characters',
      'aidol_hidden_builtins',
      'avalive_bando_history_sessions'
    ];

    keysToCheck.forEach(key => {
      try {
        const val = localStorage.getItem(key);
        if (val) {
          if (val === '[object Object]' || val === 'undefined' || val === 'null' || val === 'NaN') {
            localStorage.removeItem(key);
          } else {
            try {
              JSON.parse(val);
            } catch {
              console.warn(`[SafeStorage] Corrupt key "${key}" removed.`);
              localStorage.removeItem(key);
            }
          }
        }
      } catch {}
    });
  } catch (e) {
    console.warn('[SafeStorage] Sanitation error:', e);
  }
};
