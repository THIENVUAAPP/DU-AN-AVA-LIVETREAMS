/**
 * Xác thực nhẹ cho trang Admin — không phải hệ thống auth đầy đủ, chỉ 1 lớp
 * bảo vệ tối thiểu (mật khẩu + token phiên trong bộ nhớ) để tránh bảng điều
 * khiển Start/Pause/End trận mở hoàn toàn công khai không cần đăng nhập.
 */

import { randomBytes, timingSafeEqual } from 'node:crypto';
import { logger } from './logger.js';

function safeCompare(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function createAdminAuth(adminPassword) {
  const validTokens = new Set();

  return {
    login(password) {
      if (!password || !safeCompare(password, adminPassword)) return null;
      const token = randomBytes(24).toString('hex');
      validTokens.add(token);
      return token;
    },

    logout(token) {
      validTokens.delete(token);
    },

    requireAuth(req, res, next) {
      const token = req.headers['x-admin-token'];
      if (typeof token === 'string' && validTokens.has(token)) {
        next();
        return;
      }
      logger.warn('Truy cập Admin API không có token hợp lệ', { path: req.path });
      res.status(401).json({ error: 'unauthorized' });
    },
  };
}
