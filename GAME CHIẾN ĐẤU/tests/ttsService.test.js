import test from 'node:test';
import assert from 'node:assert/strict';
import { createTtsService } from '../src/server/ttsService.js';

function fakeFetchOk() {
  const calls = [];
  const fetchImpl = async (url, options) => {
    calls.push({ url, options });
    return {
      ok: true,
      arrayBuffer: async () => new TextEncoder().encode('fake-mp3-bytes').buffer,
    };
  };
  return { fetchImpl, calls };
}

test('isEnabled() false khi thiếu apiKey hoặc bị tắt', () => {
  const { fetchImpl } = fakeFetchOk();
  const svc1 = createTtsService({ apiKey: '', voiceId: 'v1', enabled: true, fetchImpl });
  assert.equal(svc1.isEnabled(), false);

  const svc2 = createTtsService({ apiKey: 'key123', voiceId: 'v1', enabled: false, fetchImpl });
  assert.equal(svc2.isEnabled(), false);

  const svc3 = createTtsService({ apiKey: 'key123', voiceId: 'v1', enabled: true, fetchImpl });
  assert.equal(svc3.isEnabled(), true);
});

test('synthesizeSpeech trả về null ngay nếu thiếu apiKey, KHÔNG gọi fetch', async () => {
  const { fetchImpl, calls } = fakeFetchOk();
  const svc = createTtsService({ apiKey: '', voiceId: 'v1', enabled: true, fetchImpl });
  const result = await svc.synthesizeSpeech('Cảm ơn bạn A');
  assert.equal(result, null);
  assert.equal(calls.length, 0);
});

test('synthesizeSpeech gọi đúng endpoint, header xi-api-key, model_id hỗ trợ tiếng Việt', async () => {
  const { fetchImpl, calls } = fakeFetchOk();
  const svc = createTtsService({ apiKey: 'secret-key', voiceId: 'voice-abc', enabled: true, fetchImpl });
  const result = await svc.synthesizeSpeech('Cảm ơn trang_do đã tặng quà!');

  assert.ok(Buffer.isBuffer(result));
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://api.elevenlabs.io/v1/text-to-speech/voice-abc');
  assert.equal(calls[0].options.headers['xi-api-key'], 'secret-key');

  const body = JSON.parse(calls[0].options.body);
  assert.equal(body.model_id, 'eleven_flash_v2_5'); // model hỗ trợ tiếng Việt, KHÔNG phải multilingual_v2
  assert.equal(body.text, 'Cảm ơn trang_do đã tặng quà!');
});

test('synthesizeSpeech trả về null khi API trả lỗi (không throw)', async () => {
  const fetchImpl = async () => ({ ok: false, status: 401 });
  const svc = createTtsService({ apiKey: 'bad-key', voiceId: 'v1', enabled: true, fetchImpl });
  const result = await svc.synthesizeSpeech('test');
  assert.equal(result, null);
});

test('synthesizeSpeech trả về null khi fetch throw network error (không throw)', async () => {
  const fetchImpl = async () => { throw new Error('network down'); };
  const svc = createTtsService({ apiKey: 'key', voiceId: 'v1', enabled: true, fetchImpl });
  const result = await svc.synthesizeSpeech('test');
  assert.equal(result, null);
});

test('synthesizeSpeech trả về null với text rỗng, không gọi fetch', async () => {
  const { fetchImpl, calls } = fakeFetchOk();
  const svc = createTtsService({ apiKey: 'key', voiceId: 'v1', enabled: true, fetchImpl });
  assert.equal(await svc.synthesizeSpeech(''), null);
  assert.equal(await svc.synthesizeSpeech('   '), null);
  assert.equal(calls.length, 0);
});
