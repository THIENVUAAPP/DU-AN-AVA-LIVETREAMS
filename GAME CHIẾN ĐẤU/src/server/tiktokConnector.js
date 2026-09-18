/**
 * Bọc TikTokLiveConnection: forward sự kiện Chat/Gift/Like/Follow/Share qua
 * EventEmitter nội bộ (tách rời Socket.IO để test được không cần phòng live
 * thật), tự động reconnect với exponential backoff khi mất mạng, và chờ
 * streamer live lại (không hot-loop) khi họ dừng live/bị suspend.
 */

import { EventEmitter } from 'node:events';
import {
  TikTokLiveConnection,
  WebcastEvent,
  ControlEvent,
  ControlAction,
} from 'tiktok-live-connector';
import { logger } from './logger.js';

const DEFAULT_BASE_BACKOFF_MS = 5000;
const DEFAULT_MAX_BACKOFF_MS = 60000;
const DEFAULT_WAIT_UNTIL_LIVE_INTERVAL_SECONDS = 30;

export function computeBackoffDelayMs(attempt, { baseMs = DEFAULT_BASE_BACKOFF_MS, maxMs = DEFAULT_MAX_BACKOFF_MS } = {}) {
  const safeAttempt = Math.max(attempt, 1);
  return Math.min(baseMs * 2 ** (safeAttempt - 1), maxMs);
}

function defaultConnectionFactory(username, options) {
  return new TikTokLiveConnection(username, options);
}

export class TikTokConnector extends EventEmitter {
  constructor(username, options = {}) {
    super();
    this.username = username;
    this.baseBackoffMs = options.baseBackoffMs ?? DEFAULT_BASE_BACKOFF_MS;
    this.maxBackoffMs = options.maxBackoffMs ?? DEFAULT_MAX_BACKOFF_MS;
    this.waitUntilLiveIntervalSeconds = options.waitUntilLiveIntervalSeconds ?? DEFAULT_WAIT_UNTIL_LIVE_INTERVAL_SECONDS;
    this.jitterMaxMs = options.jitterMaxMs ?? 1000;
    this.connectionFactory = options.connectionFactory ?? defaultConnectionFactory;

    this.connection = null;
    this.isReconnecting = false;
    this.reconnectAttempt = 0;
    this.reconnectTimer = null;
    this.stopped = true;
  }

  start() {
    this.stopped = false;
    this._connectOnce();
  }

  stop() {
    this.stopped = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.connection) {
      Promise.resolve(this.connection.disconnect()).catch((error) => {
        logger.error('Lỗi khi ngắt kết nối TikTokConnector', error, { username: this.username });
      });
    }
  }

  isConnected() {
    return Boolean(this.connection?.isConnected);
  }

  async _connectOnce() {
    if (this.stopped) return;
    try {
      this.connection = this.connectionFactory(this.username, { enableExtendedGiftInfo: true });
      this._bindEvents(this.connection);
      const state = await this.connection.connect();

      this.reconnectAttempt = 0;
      this.isReconnecting = false;
      logger.info('Đã kết nối TikTok LIVE', { username: this.username, roomId: state?.roomId });
      this.emit('connected', state);
    } catch (error) {
      if (error?.name === 'UserOfflineError') {
        logger.warn('Streamer chưa live — chờ đến khi live để tự kết nối', { username: this.username });
        this._waitThenReconnect();
        return;
      }
      logger.error('Kết nối TikTok LIVE thất bại', error, { username: this.username, attempt: this.reconnectAttempt });
      this._scheduleReconnect();
    }
  }

  _bindEvents(connection) {
    connection.on(ControlEvent.DISCONNECTED, (payload) => this._handleDisconnected(payload));
    connection.on(ControlEvent.ERROR, (error) => {
      logger.error('Lỗi runtime từ TikTok LIVE connection', error, { username: this.username });
      this.emit('connectionError', error);
    });

    connection.on(WebcastEvent.CHAT, (data) => this._safeEmit('chat', data));
    connection.on(WebcastEvent.GIFT, (data) => this._safeEmit('gift', data));
    connection.on(WebcastEvent.LIKE, (data) => this._safeEmit('like', data));
    connection.on(WebcastEvent.FOLLOW, (data) => this._safeEmit('follow', data));
    connection.on(WebcastEvent.SHARE, (data) => this._safeEmit('share', data));
    connection.on(WebcastEvent.STREAM_END, (data) => this._safeEmit('streamEnd', data));
  }

  _safeEmit(eventName, data) {
    try {
      this.emit(eventName, data);
    } catch (error) {
      logger.error(`Lỗi khi xử lý event "${eventName}" từ TikTok LIVE`, error, { username: this.username });
    }
  }

  _handleDisconnected(payload) {
    if (this.stopped) return;
    logger.warn('Mất kết nối TikTok LIVE', { username: this.username, payload });
    this.emit('disconnected', payload);

    const action = payload?.action;
    const isStreamOffline =
      action === ControlAction.CONTROL_ACTION_STREAM_ENDED ||
      action === ControlAction.CONTROL_ACTION_STREAM_SUSPENDED;

    if (isStreamOffline) {
      this._waitThenReconnect();
    } else {
      this._scheduleReconnect();
    }
  }

  async _waitThenReconnect() {
    if (this.isReconnecting || this.stopped) return;
    this.isReconnecting = true;
    try {
      await this.connection.waitUntilLive(this.waitUntilLiveIntervalSeconds);
      this.isReconnecting = false;
      this._connectOnce();
    } catch (error) {
      logger.error('Lỗi khi chờ streamer live lại', error, { username: this.username });
      this.isReconnecting = false;
      this._scheduleReconnect();
    }
  }

  _scheduleReconnect() {
    if (this.isReconnecting || this.stopped) return;
    this.isReconnecting = true;
    this.reconnectAttempt += 1;
    const backoff = computeBackoffDelayMs(this.reconnectAttempt, { baseMs: this.baseBackoffMs, maxMs: this.maxBackoffMs });
    const jitter = Math.floor(Math.random() * this.jitterMaxMs);
    const delay = backoff + jitter;

    logger.info('Lên lịch kết nối lại TikTok LIVE', {
      username: this.username,
      attempt: this.reconnectAttempt,
      delayMs: delay,
    });

    this.reconnectTimer = setTimeout(() => {
      this.isReconnecting = false;
      this._connectOnce();
    }, delay);
  }
}
