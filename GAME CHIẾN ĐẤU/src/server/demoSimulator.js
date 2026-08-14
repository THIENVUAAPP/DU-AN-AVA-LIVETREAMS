/**
 * Bộ giả lập sự kiện TikTok LIVE (chỉ dùng khi DEMO_MODE=true) — cùng
 * interface (start/stop/isConnected + event 'connected'/'chat'/'gift') như
 * TikTokConnector, để test toàn luồng game mà không cần phòng live thật.
 * Công cụ dev/test, KHÔNG dùng khi chạy live thật.
 */

import { EventEmitter } from 'node:events';
import { logger } from './logger.js';

const FAKE_VIEWERS = ['vien_gamer', 'minh_tiktok', 'an_nguyen', 'hoa_le', 'duc_pham', 'linh_vu', 'trang_do', 'huy_tran'];

const FAKE_SIDE_COMMENTS = ['xanh', 'do', 'đỏ', 'blue', 'red'];
const FAKE_CHIT_CHAT = ['hay qua', 'co len nha', 'xem vui ghe', 'game dep qua'];

// diamondCount đặt sẵn để rơi đúng vào 3 tier trong config/gifts.json
const FAKE_GIFTS = [
  { giftId: 5655, giftName: 'Rose', diamondCount: 1, giftType: 0 },
  { giftId: 5827, giftName: 'Finger Heart', diamondCount: 5, giftType: 0 },
  { giftId: 6091, giftName: 'GG', diamondCount: 1, giftType: 1 }, // streakable, tier nhỏ
  { giftId: 5269, giftName: 'Confetti', diamondCount: 100, giftType: 0 },
  { giftId: 5488, giftName: 'Sunglasses', diamondCount: 500, giftType: 1 }, // streakable, tier trung
  { giftId: 5487, giftName: 'Lion', diamondCount: 10000, giftType: 0 },
  { giftId: 6247, giftName: 'Universe', diamondCount: 34999, giftType: 0 },
];

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

export class DemoSimulator extends EventEmitter {
  constructor(options = {}) {
    super();
    this.heartbeatIntervalMs = options.heartbeatIntervalMs ?? 1200;
    this.streakTickIntervalMs = options.streakTickIntervalMs ?? 150;
    this.heartbeatTimer = null;
    this.activeStreakTimers = new Set();
    this.running = false;
  }

  start() {
    if (this.running) return;
    this.running = true;
    logger.info('DemoSimulator khởi động — KHÔNG dùng chế độ này khi live thật', {});
    this.emit('connected', { roomId: 'DEMO-ROOM' });

    this.heartbeatTimer = setInterval(() => {
      try {
        if (Math.random() < 0.65) {
          this._emitRandomChat();
        } else {
          this._emitRandomGift();
        }
      } catch (error) {
        logger.error('Lỗi khi DemoSimulator sinh sự kiện giả lập', error, {});
      }
    }, this.heartbeatIntervalMs);
  }

  stop() {
    this.running = false;
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
    for (const timer of this.activeStreakTimers) {
      clearInterval(timer);
    }
    this.activeStreakTimers.clear();
  }

  isConnected() {
    return this.running;
  }

  _makeFakeUser(username) {
    return { userId: `demo-${username}`, uniqueId: username, nickname: username, profilePictureUrl: null };
  }

  _emitRandomChat() {
    const username = pickRandom(FAKE_VIEWERS);
    const wantsSide = Math.random() < 0.6;
    const comment = wantsSide ? pickRandom(FAKE_SIDE_COMMENTS) : pickRandom(FAKE_CHIT_CHAT);
    this.emit('chat', { comment, user: this._makeFakeUser(username) });
  }

  _emitRandomGift() {
    const username = pickRandom(FAKE_VIEWERS);
    const user = this._makeFakeUser(username);
    const gift = pickRandom(FAKE_GIFTS);

    if (gift.giftType === 1) {
      this._emitStreakedGift(user, gift);
    } else {
      this._emitGiftEvent(user, gift, { repeatCount: 1, repeatEnd: true });
    }
  }

  _emitStreakedGift(user, gift) {
    const totalTicks = 1 + Math.floor(Math.random() * 5);
    let tick = 0;

    const timer = setInterval(() => {
      tick += 1;
      const isFinal = tick >= totalTicks;
      this._emitGiftEvent(user, gift, { repeatCount: tick, repeatEnd: isFinal });
      if (isFinal) {
        clearInterval(timer);
        this.activeStreakTimers.delete(timer);
      }
    }, this.streakTickIntervalMs);

    this.activeStreakTimers.add(timer);
  }

  _emitGiftEvent(user, gift, { repeatCount, repeatEnd }) {
    this.emit('gift', {
      user,
      giftId: gift.giftId,
      repeatCount,
      repeatEnd,
      giftDetails: {
        giftType: gift.giftType,
        diamondCount: gift.diamondCount,
        giftName: gift.giftName,
      },
    });
  }
}
