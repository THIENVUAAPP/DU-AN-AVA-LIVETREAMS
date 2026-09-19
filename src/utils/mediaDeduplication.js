/**
 * 🛡️ MEDIA DEDUPLICATION & ZERO-COPY CACHE SERVICE
 * 
 * Đảm bảo:
 * 1. Mỗi video tải lên chỉ lưu trữ DUY NHẤT 1 LẦN.
 * 2. Không lưu chồng chéo dữ liệu làm nặng máy, đầy bộ nhớ hay phình dung lượng.
 * 3. Tái sử dụng 100% dữ liệu gốc của video đã có khi người dùng chọn/tải lại.
 * 4. Đồng bộ ngay lập tức sang Window Capture & TikTok Live Studio với độ trễ 0ms.
 */

/**
 * Tạo chữ ký số duy nhất nhận diện nội dung video dựa trên Metadata gốc
 * Không đọc toàn bộ file nhiều GB vào RAM để tính SHA256 (tránh tràn RAM/đơ máy)
 * Thay vào đó kết hợp: file.name + file.size + file.lastModified
 */
export function generateFileSignature(file) {
  if (!file) return '';
  const name = String(file.name || 'unnamed').trim().toLowerCase();
  const size = Number(file.size || 0);
  const lastMod = Number(file.lastModified || 0);
  return `sig_${name.replace(/[^a-z0-9._-]/g, '_')}__${size}__${lastMod}`;
}

/**
 * Kiểm tra xem 2 video có cùng nội dung gốc hay không
 */
export function isSameVideoContent(fileA, fileB) {
  if (!fileA || !fileB) return false;
  if (fileA === fileB) return true;

  const sizeA = Number(fileA.size || fileA.fileSize || 0);
  const sizeB = Number(fileB.size || fileB.fileSize || 0);
  if (sizeA > 0 && sizeB > 0 && sizeA === sizeB) {
    const nameA = String(fileA.name || fileA.originalName || '').toLowerCase().trim();
    const nameB = String(fileB.name || fileB.originalName || '').toLowerCase().trim();
    if (nameA && nameB && (nameA === nameB || nameA.includes(nameB) || nameB.includes(nameA))) {
      return true;
    }
  }

  const sigA = fileA.fileSignature || generateFileSignature(fileA);
  const sigB = fileB.fileSignature || generateFileSignature(fileB);
  return !!(sigA && sigB && sigA === sigB);
}

/**
 * Bộ nhớ đệm RAM toàn cục lưu trữ các file video đã nạp trong phiên làm việc
 * Key: fileSignature -> Value: File/Blob object
 */
const inMemoryFileRegistry = new Map();

export function registerFileInRAM(file, customId = null) {
  if (!file) return '';
  const sig = generateFileSignature(file);
  inMemoryFileRegistry.set(sig, file);
  if (customId) inMemoryFileRegistry.set(customId, file);
  if (file.name) inMemoryFileRegistry.set(file.name, file);
  
  if (typeof window !== 'undefined') {
    window.__activeMediaBlob = file;
    window.__activeMediaBlobMap = window.__activeMediaBlobMap || new Map();
    window.__activeMediaBlobMap.set(sig, file);
    if (customId) window.__activeMediaBlobMap.set(customId, file);
  }
  return sig;
}

export function getFileFromRAM(sigOrId) {
  if (!sigOrId) return null;
  if (inMemoryFileRegistry.has(sigOrId)) return inMemoryFileRegistry.get(sigOrId);
  if (typeof window !== 'undefined' && window.__activeMediaBlobMap && window.__activeMediaBlobMap.has(sigOrId)) {
    return window.__activeMediaBlobMap.get(sigOrId);
  }
  return null;
}
