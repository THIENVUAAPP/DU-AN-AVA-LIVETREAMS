import test from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { setTimeout as sleep } from 'node:timers/promises';
import { TikTokConnector, computeBackoffDelayMs } from '../src/server/tiktokConnector.js';

test('computeBackoffDelayMs tăng gấp đôi theo cấp số nhân và giới hạn ở maxMs', () => {
  assert.equal(computeBackoffDelayMs(1, { baseMs: 5000, maxMs: 60000 }), 5000);
  assert.equal(computeBackoffDelayMs(2, { baseMs: 5000, maxMs: 60000 }), 10000);
  assert.equal(computeBackoffDelayMs(3, { baseMs: 5000, maxMs: 60000 }), 20000);
  assert.equal(computeBackoffDelayMs(4, { baseMs: 5000, maxMs: 60000 }), 40000);
  assert.equal(computeBackoffDelayMs(5, { baseMs: 5000, maxMs: 60000 }), 60000); // clamp ở max
  assert.equal(computeBackoffDelayMs(20, { baseMs: 5000, maxMs: 60000 }), 60000);
});

test('computeBackoffDelayMs với attempt <= 0 vẫn trả về baseMs, không throw', () => {
  assert.equal(computeBackoffDelayMs(0, { baseMs: 5000, maxMs: 60000 }), 5000);
  assert.equal(computeBackoffDelayMs(-3, { baseMs: 5000, maxMs: 60000 }), 5000);
});

class FakeConnection extends EventEmitter {
  constructor() {
    super();
    this.isConnected = false;
    this.connectCallCount = 0;
    this.waitUntilLiveCallCount = 0;
  }

  async connect() {
    this.connectCallCount += 1;
    this.isConnected = true;
    return { roomId: 'fake-room-123' };
  }

  async disconnect() {
    this.isConnected = false;
  }

  async waitUntilLive() {
    this.waitUntilLiveCallCount += 1;
  }
}

test('forward đúng sự kiện chat/gift từ connection sang connector', async () => {
  const fakeConnections = [];
  const connector = new TikTokConnector('demo-user', {
    connectionFactory: () => {
      const conn = new FakeConnection();
      fakeConnections.push(conn);
      return conn;
    },
  });

  const receivedChat = [];
  const receivedGift = [];
  connector.on('chat', (data) => receivedChat.push(data));
  connector.on('gift', (data) => receivedGift.push(data));

  connector.start();
  await sleep(20); // đợi connect() (async) resolve

  const conn = fakeConnections[0];
  conn.emit('chat', { comment: 'xanh' });
  conn.emit('gift', { giftId: 1 });

  assert.equal(receivedChat.length, 1);
  assert.equal(receivedChat[0].comment, 'xanh');
  assert.equal(receivedGift.length, 1);
  connector.stop();
});

test('mất kết nối vì lý do thường (không phải streamer dừng live) -> lên lịch reconnect với backoff tăng dần', async () => {
  const fakeConnections = [];
  const connector = new TikTokConnector('demo-user', {
    baseBackoffMs: 10,
    maxBackoffMs: 100,
    jitterMaxMs: 5,
    connectionFactory: () => {
      const conn = new FakeConnection();
      fakeConnections.push(conn);
      return conn;
    },
  });

  connector.start();
  await sleep(20);
  assert.equal(fakeConnections.length, 1);

  fakeConnections[0].emit('disconnected', { code: 1006, reason: 'network' });
  await sleep(60); // đợi qua backoff ~10ms + jitter để reconnect lần 2

  assert.equal(fakeConnections.length, 2, 'phải tạo connection mới để reconnect');
  assert.equal(connector.reconnectAttempt, 0, 'reconnectAttempt reset về 0 sau khi kết nối lại thành công');
  connector.stop();
});

test('mất kết nối vì streamer dừng live (STREAM_ENDED) -> gọi waitUntilLive, KHÔNG tính vào reconnectAttempt backoff', async () => {
  const fakeConnections = [];
  const connector = new TikTokConnector('demo-user', {
    baseBackoffMs: 10,
    maxBackoffMs: 100,
    jitterMaxMs: 5,
    connectionFactory: () => {
      const conn = new FakeConnection();
      fakeConnections.push(conn);
      return conn;
    },
  });

  connector.start();
  await sleep(20);
  const firstConn = fakeConnections[0];

  firstConn.emit('disconnected', { action: 3 }); // ControlAction.CONTROL_ACTION_STREAM_ENDED = 3
  await sleep(20);

  assert.equal(firstConn.waitUntilLiveCallCount, 1);
  assert.equal(fakeConnections.length, 2, 'sau khi waitUntilLive resolve, phải kết nối lại');
  connector.stop();
});

test('không tạo 2 chuỗi reconnect chồng chéo khi disconnected bắn nhiều lần liên tiếp', async () => {
  const fakeConnections = [];
  const connector = new TikTokConnector('demo-user', {
    baseBackoffMs: 30,
    maxBackoffMs: 200,
    jitterMaxMs: 5,
    connectionFactory: () => {
      const conn = new FakeConnection();
      fakeConnections.push(conn);
      return conn;
    },
  });

  connector.start();
  await sleep(20);
  const firstConn = fakeConnections[0];

  // bắn disconnected nhiều lần liên tiếp trước khi backoff kịp chạy xong
  firstConn.emit('disconnected', { code: 1006 });
  firstConn.emit('disconnected', { code: 1006 });
  firstConn.emit('disconnected', { code: 1006 });

  await sleep(80);

  // dù bắn 3 lần, chỉ có đúng 1 lần reconnect thực sự xảy ra (guard bởi isReconnecting)
  assert.equal(fakeConnections.length, 2);
  connector.stop();
});
