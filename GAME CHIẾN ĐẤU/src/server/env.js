import 'dotenv/config';
import { randomBytes } from 'node:crypto';

const DEMO_MODE = String(process.env.DEMO_MODE || 'false').toLowerCase() === 'true';
const TIKTOK_USERNAME = (process.env.TIKTOK_USERNAME || '').trim();

if (!DEMO_MODE && !TIKTOK_USERNAME) {
  throw new Error(
    'Thiếu cấu hình bắt buộc: TIKTOK_USERNAME trống trong .env. ' +
    'Điền username TikTok LIVE (không có dấu @), hoặc đặt DEMO_MODE=true để chạy thử không cần phòng live thật.'
  );
}

const PORT = Number(process.env.PORT) || 8080;
if (!Number.isInteger(PORT) || PORT <= 0) {
  throw new Error(`PORT trong .env không hợp lệ: "${process.env.PORT}" — phải là số nguyên dương.`);
}

const LANG_DEFAULT = ['vi', 'en'].includes(process.env.LANG_DEFAULT)
  ? process.env.LANG_DEFAULT
  : 'vi';

const configuredAdminPassword = (process.env.ADMIN_PASSWORD || '').trim();
const ADMIN_PASSWORD_AUTO_GENERATED = !configuredAdminPassword;
const ADMIN_PASSWORD = configuredAdminPassword || randomBytes(6).toString('hex');

if (ADMIN_PASSWORD_AUTO_GENERATED) {
  // In ra console vì chưa có ADMIN_PASSWORD trong .env — không để trang Admin
  // mở hoàn toàn không mật khẩu theo mặc định.
  console.log('='.repeat(60));
  console.log(`[ADMIN] Chưa đặt ADMIN_PASSWORD trong .env — mật khẩu Admin tạm: ${ADMIN_PASSWORD}`);
  console.log('[ADMIN] Đặt ADMIN_PASSWORD trong .env để dùng mật khẩu cố định.');
  console.log('='.repeat(60));
}

const ELEVENLABS_API_KEY = (process.env.ELEVENLABS_API_KEY || '').trim();
const ELEVENLABS_VOICE_ID = (process.env.ELEVENLABS_VOICE_ID || '').trim() || '21m00Tcm4TlvDq8ikWAM';
const TTS_ENABLED = Boolean(ELEVENLABS_API_KEY);

if (!TTS_ENABLED) {
  console.log('[TTS] Chưa đặt ELEVENLABS_API_KEY trong .env — bỏ qua tính năng xướng tên bằng giọng AI (không lỗi, chỉ tắt tính năng này).');
}

export const env = Object.freeze({
  DEMO_MODE,
  TIKTOK_USERNAME,
  PORT,
  LANG_DEFAULT,
  ADMIN_PASSWORD,
  ELEVENLABS_API_KEY,
  ELEVENLABS_VOICE_ID,
  TTS_ENABLED,
});
