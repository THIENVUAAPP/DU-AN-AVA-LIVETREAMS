/**
 * Gọi ElevenLabs Text-to-Speech để xướng tên người tặng quà bằng giọng AI.
 * Dùng model "eleven_flash_v2_5" — model duy nhất của ElevenLabs hỗ trợ
 * tiếng Việt (đã tra docs chính thức, "eleven_multilingual_v2" KHÔNG hỗ trợ
 * tiếng Việt dù tên nghe có vẻ đa ngôn ngữ).
 *
 * Không có API key → trả về null, không throw, không chặn luồng game chính.
 */

import { logger } from './logger.js';

const TTS_MODEL_ID = 'eleven_flash_v2_5';
const REQUEST_TIMEOUT_MS = 8000;

export function createTtsService({ apiKey, voiceId, enabled, fetchImpl = fetch }) {
  return {
    isEnabled() {
      return Boolean(enabled && apiKey);
    },

    /** Trả về Buffer audio mp3, hoặc null nếu tắt/lỗi (không throw). */
    async synthesizeSpeech(text) {
      if (!enabled || !apiKey) return null;
      const trimmedText = String(text || '').trim().slice(0, 200);
      if (!trimmedText) return null;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

      try {
        const response = await fetchImpl(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
          method: 'POST',
          headers: {
            'xi-api-key': apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: trimmedText, model_id: TTS_MODEL_ID }),
          signal: controller.signal,
        });

        if (!response.ok) {
          logger.warn('ElevenLabs TTS trả về lỗi', { status: response.status });
          return null;
        }

        const arrayBuffer = await response.arrayBuffer();
        return Buffer.from(arrayBuffer);
      } catch (error) {
        logger.error('Lỗi khi gọi ElevenLabs TTS', error, {});
        return null;
      } finally {
        clearTimeout(timeout);
      }
    },
  };
}
