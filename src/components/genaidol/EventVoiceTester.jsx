import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Square, Sparkles, ChevronDown, Check, Gauge, Sliders, Star, Timer, Wand2 } from 'lucide-react';
import { 
  ALL_SYSTEM_VOICES, 
  MASTER_DNA_FEMALE_VIETNAMESE_40_VOICES,
  MASTER_DNA_MALE_VIETNAMESE_40_VOICES,
  VIETNAMESE_HOTTREND_VOICES,
  VIETNAMESE_SALES_VOICES,
  VIETNAMESE_FEMALE_VOICES,
  VIETNAMESE_MALE_VOICES,
  INTERNATIONAL_VOICES,
  previewVoiceAudio, 
  stopVoiceAudio, 
  setRealtimeAudioParams, 
  cleanTextForVoiceSpeech,
  isVoiceFavorite,
  getFavoriteVoiceIds,
  getDualVoiceConfig,
  getMultiAvatarConfig,
  polishAndOptimizeScript,
  formatTextForRegionalSpeech,
  prefetchTTSAudio,
  unlockAudioContext
} from '../../utils/voiceSyncService';

export const SPEED_OPTIONS = [
  { value: 0.75, label: '0.75x' },
  { value: 0.85, label: '0.85x' },
  { value: 0.90, label: '0.9x' },
  { value: 1.00, label: '1.0x (Chuẩn)' },
  { value: 1.10, label: '1.1x' },
  { value: 1.15, label: '1.15x' },
  { value: 1.20, label: '1.2x' },
  { value: 1.25, label: '1.25x' },
  { value: 1.50, label: '1.5x' },
  { value: 1.75, label: '1.75x' },
  { value: 2.00, label: '2.0x' }
];

export const PAUSE_OPTIONS = [
  { value: 0.00, label: '0.0s (Liền mạch 0ms - Không dừng)' },
  { value: 0.05, label: '0.05s' },
  { value: 0.10, label: '0.1s (Siêu ngắn)' },
  { value: 0.15, label: '0.15s' },
  { value: 0.20, label: '0.2s' },
  { value: 0.25, label: '0.25s (Chuẩn)' },
  { value: 0.30, label: '0.3s' },
  { value: 0.50, label: '0.5s' },
  { value: 0.75, label: '0.75s' },
  { value: 1.00, label: '1.0s (Nghỉ 1s)' }
];

/**
 * Universal Voice Selector & Tester Component
 * - Đồng bộ 100% toàn bộ hệ thống giọng đọc chuẩn: Giọng Ava Live, Giọng Hot Trend, Giọng Bán Hàng, Giọng Nữ 4 Vùng Miền, Giọng Nam, Giọng Quốc Tế
 * - Ưu tiên hiển thị trên cùng các giọng đọc đã được gắn dấu sao (⭐ Star Favorites)
 * - Tốc độ đọc (Speed Rate 0.75x - 2.0x) chọn ăn ngay 100% tức thì (kể cả 1.15x, 1.25x, 2.0x...)
 * - Tùy chỉnh khoảng nghỉ giữa các câu từ 0.0s đến 1.0s mượt mà, không khựng
 * - Khi đang nghe thử kịch bản, đổi giọng nào là nhảy qua phát ngay giọng đó tại câu hiện tại
 * - Đọc trọn vẹn 100% kịch bản xuyên suốt từ câu đầu đến câu cuối với cảm xúc nhấn nhá lấy hơi
 */
export default function EventVoiceTester({
  text = '',
  defaultVoiceId = 'free_vi_female',
  pauseBetweenSentences = 0.0,
  onPauseChange = null,
  onVoiceChange = null,
  onScriptOptimized = null,
  label = 'Nghe thử câu thoại',
  theme = 'light', // 'light' | 'dark'
  compact = false,
  className = ''
}) {
  // Tự động khôi phục giọng đọc đã chọn gần nhất từ bộ nhớ máy tính
  const getInitialVoice = () => {
    try {
      const saved = localStorage.getItem('avalive_tester_selected_voice');
      if (saved && ALL_SYSTEM_VOICES.some(v => v.id === saved)) {
        return saved;
      }
    } catch (e) {}
    return defaultVoiceId || 'free_vi_female';
  };

  const getInitialPause = () => {
    if (pauseBetweenSentences !== undefined && !isNaN(Number(pauseBetweenSentences))) {
      return Number(pauseBetweenSentences);
    }
    try {
      const saved = localStorage.getItem('avalive_pause_between_sentences');
      if (saved !== null && !isNaN(Number(saved))) return Number(saved);
    } catch (e) {}
    return 0.0; // Mặc định 0.0s đọc liên tục, không ngắt quãng kiểu cà nhấp
  };

  const [selectedVoiceId, setSelectedVoiceId] = useState(getInitialVoice);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState(0);
  const [totalSentences, setTotalSentences] = useState(0);
  const [volume, setVolume] = useState(1.0); // 0.0 to 1.0
  const [speed, setSpeed] = useState(1.0); // 0.75 to 2.0
  const [pauseDuration, setPauseDuration] = useState(getInitialPause); // 0.0 to 1.0s
  const [favoriteIds, setFavoriteIds] = useState(getFavoriteVoiceIds());

  const isPlayingRef = useRef(false);
  const queueTimeoutRef = useRef(null);
  const volumeRef = useRef(1.0);
  const speedRef = useRef(1.0);
  const pauseDurationRef = useRef(getInitialPause());
  const selectedVoiceRef = useRef(getInitialVoice());
  const currentSentenceIdxRef = useRef(0);
  const sentencesRef = useRef([]);

  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    pauseDurationRef.current = pauseDuration;
  }, [pauseDuration]);

  // Đồng bộ pause từ prop từ tab kịch bản
  useEffect(() => {
    if (pauseBetweenSentences !== undefined && !isNaN(Number(pauseBetweenSentences))) {
      const p = Number(pauseBetweenSentences);
      setPauseDuration(p);
      pauseDurationRef.current = p;
    }
  }, [pauseBetweenSentences]);

  // Lắng nghe sự kiện toàn cục khi người dùng đổi khoảng dừng ở bất kỳ nơi nào
  useEffect(() => {
    const handleGlobalPause = (e) => {
      const p = typeof e.detail === 'number' ? e.detail : (e.detail?.pause !== undefined ? e.detail.pause : Number(e.detail));
      if (p !== undefined && !isNaN(Number(p))) {
        const val = Math.max(0, Number(p));
        setPauseDuration(val);
        pauseDurationRef.current = val;
      }
    };
    window.addEventListener('avalive_pause_between_sentences_updated', handleGlobalPause);
    return () => window.removeEventListener('avalive_pause_between_sentences_updated', handleGlobalPause);
  }, []);

  useEffect(() => {
    if (defaultVoiceId) {
      setSelectedVoiceId(defaultVoiceId);
      selectedVoiceRef.current = defaultVoiceId;
    }
  }, [defaultVoiceId]);

  // Lắng nghe cập nhật danh sách yêu thích & cấu hình voice
  useEffect(() => {
    const handleFavUpdate = () => {
      setFavoriteIds(getFavoriteVoiceIds());
    };
    window.addEventListener('aidol_favorite_voices_updated', handleFavUpdate);
    window.addEventListener('aidol_voice_sync_updated', handleFavUpdate);
    return () => {
      window.removeEventListener('aidol_favorite_voices_updated', handleFavUpdate);
      window.removeEventListener('aidol_voice_sync_updated', handleFavUpdate);
    };
  }, []);

  // Cập nhật âm lượng tức thì khi kéo thanh trượt (0ms phản hồi)
  const handleVolumeChange = (newVol) => {
    const val = parseFloat(newVol);
    setVolume(val);
    volumeRef.current = val;
    setRealtimeAudioParams({ volume: val });
  };

  // Cập nhật tốc độ đọc tức thì khi chọn dropdown (0ms phản hồi ăn ngay)
  const handleSpeedChange = (newSpeed) => {
    const rate = Number(newSpeed);
    setSpeed(rate);
    speedRef.current = rate;
    setRealtimeAudioParams({ rate });
  };

  // Dọn dẹp khi unmount
  useEffect(() => {
    return () => {
      isPlayingRef.current = false;
      if (queueTimeoutRef.current) clearTimeout(queueTimeoutRef.current);
      stopVoiceAudio();
    };
  }, []);

  /**
   * Helper phân giải câu thoại: bóc tách speaker tag ([Idol]:, [Trợ Lý]:...) và xác định đúng giọng đọc
   */
  const parseScriptSentence = (rawSentenceText, fallbackVoice = null) => {
    if (!rawSentenceText || !rawSentenceText.trim()) {
      return { cleanText: '', voiceObj: null, activeSpeakerId: 'idol', matchedSpeakerAvatar: null };
    }

    const multiConfig = getMultiAvatarConfig();
    let matchedSpeakerAvatar = null;
    let cleanSentenceText = rawSentenceText;

    if (multiConfig && multiConfig.avatars) {
      for (const av of multiConfig.avatars) {
        if (!av.enabled) continue;
        const tagClean = (av.tag || '').replace(/[\[\]]/g, '').trim().toLowerCase();
        if (!tagClean) continue;
        const regex = new RegExp(`^(\\[?${tagClean}\\]?|${tagClean})\\s*:\\s*(.*)$`, 'i');
        const m = rawSentenceText.match(regex);
        if (m) {
          matchedSpeakerAvatar = av;
          cleanSentenceText = m[2].trim();
          break;
        }
      }
    }

    // Nếu không khớp trực tiếp từ tag avatar tùy chỉnh, kiểm tra các tag phổ biến
    if (!matchedSpeakerAvatar) {
      if (/^(\[?idol\]?|idol)\s*:\s*(.*)$/i.test(rawSentenceText)) {
        matchedSpeakerAvatar = multiConfig?.avatars?.find(a => a.id === 'avatar_1' || a.role === 'idol') || { id: 'avatar_1', role: 'idol', voiceId: 'free_vi_female', name: 'Idol Chính' };
        cleanSentenceText = rawSentenceText.replace(/^(\[?idol\]?|idol)\s*:\s*/i, '').trim();
      } else if (/^(\[?trợ lý\]?|\[?tro ly\]?|\[?troly\]?|\[?quản lý\]?|\[?quan ly\]?|trợ lý|tro ly|quản lý|quan ly)\s*:\s*(.*)$/i.test(rawSentenceText)) {
        matchedSpeakerAvatar = multiConfig?.avatars?.find(a => a.id === 'avatar_2' || a.role === 'assistant' || a.role === 'manager') || { id: 'avatar_2', role: 'assistant', voiceId: 'vn_nam_quanly_uyquyen', name: 'Trợ Lý' };
        cleanSentenceText = rawSentenceText.replace(/^(\[?trợ lý\]?|\[?tro ly\]?|\[?troly\]?|\[?quản lý\]?|\[?quan ly\]?|trợ lý|tro ly|quản lý|quan ly)\s*:\s*/i, '').trim();
      } else if (/^(\[?blv game\]?|\[?game\]?|\[?blv\]?|\[?pk\]?|blv game|game|blv|pk)\s*:\s*(.*)$/i.test(rawSentenceText)) {
        matchedSpeakerAvatar = multiConfig?.avatars?.find(a => a.id === 'avatar_3' || a.role === 'game') || { id: 'avatar_3', role: 'game', voiceId: 'vn_nam_bando_chienbinh', name: 'BLV Game PK' };
        cleanSentenceText = rawSentenceText.replace(/^(\[?blv game\]?|\[?game\]?|\[?blv\]?|\[?pk\]?|blv game|game|blv|pk)\s*:\s*/i, '').trim();
      } else if (/^(\[?khách mời\]?|\[?khach moi\]?|\[?khach\]?|khách mời|khach moi|khach)\s*:\s*(.*)$/i.test(rawSentenceText)) {
        matchedSpeakerAvatar = multiConfig?.avatars?.find(a => a.id === 'avatar_4' || a.role === 'guest') || { id: 'avatar_4', role: 'guest', voiceId: 'vn_nu_jessica_sangchanh', name: 'Khách Mời' };
        cleanSentenceText = rawSentenceText.replace(/^(\[?khách mời\]?|\[?khach moi\]?|\[?khach\]?|khách mời|khach moi|khach)\s*:\s*/i, '').trim();
      }
    }

    const activeSpeakerId = matchedSpeakerAvatar ? matchedSpeakerAvatar.id : 'avatar_1';
    let voiceObj = null;
    if (matchedSpeakerAvatar) {
      voiceObj = resolveEffectiveVoice(matchedSpeakerAvatar.role || 'idol', matchedSpeakerAvatar.voiceId, matchedSpeakerAvatar.id);
    } else {
      const activeVoiceId = fallbackVoice ? (fallbackVoice.id || fallbackVoice) : selectedVoiceRef.current;
      voiceObj = resolveEffectiveVoice('idol', activeVoiceId, 'avatar_1');
    }

    // Chuẩn hóa phát âm và làm sạch emoji/ký tự đặc biệt cho câu thoại để khớp 100% cache key
    const normalizedText = cleanTextForVoiceSpeech(cleanSentenceText);

    return {
      cleanText: normalizedText,
      voiceObj,
      activeSpeakerId,
      matchedSpeakerAvatar
    };
  };

  /**
   * Phân tách kịch bản dài thành các câu thoại hoàn chỉnh chuẩn ngữ nghĩa (theo từng dòng riêng biệt)
   * Giữ trọn vẹn 100% cấu trúc các dòng kịch bản của người dùng, không bao giờ gộp hay xé nát câu
   */
  const splitIntoSentences = (raw) => {
    if (!raw || !raw.trim()) return [];
    
    let decoded = String(raw)
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&quot;/gi, '"')
      .replace(/&apos;/gi, "'")
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/\\"/g, '"')
      .replace(/\\'/g, "'")
      .replace(/\\n/g, '\n')
      .replace(/\[user\]|\{user\}/gi, 'Quốc Thiện')
      .replace(/\{comment\}|\[comment\]/gi, 'Sản phẩm này giá bao nhiêu shop?')
      .replace(/\{gift_name\}|\[gift_name\]/gi, 'Cờ Tổ Quốc')
      .replace(/\{count\}|\[count\]/gi, '5')
      .replace(/\{milestone\}|\[milestone\]/gi, '10,000')
      .replace(/\{item\}|\[item\]/gi, 'Bánh gạo lứt')
      .replace(/\{product\}|\[product\]/gi, 'Bánh gạo lứt')
      .replace(/\{price\}|\[price\]/gi, '89.000đ');

    // Tách theo từng dòng kịch bản gốc của người dùng TRƯỚC HẾT (1 DÒNG = 1 CÂU THOẠI NGUYÊN VẸN, KHÔNG TÁCH CÂU)
    const rawLines = decoded.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const finalSentences = [];

    for (const line of rawLines) {
      let speakerPrefix = '';
      let body = line;
      const tagMatch = line.match(/^(\[?[a-zA-Z0-9_\u00C0-\u1EF9\s]+\]?\s*:\s*)(.*)$/);
      if (tagMatch) {
        speakerPrefix = tagMatch[1];
        body = tagMatch[2];
      }

      // Làm sạch ký tự lạ, emoji, ngoặc kép trên từng dòng
      const cleanBody = cleanTextForVoiceSpeech(body);
      if (!cleanBody || !cleanBody.trim()) continue;

      // Giữ trọn vẹn 100% dòng kịch bản làm một câu thoại duy nhất, tuyệt đối không tách câu
      finalSentences.push(speakerPrefix ? `${speakerPrefix}${cleanBody}` : cleanBody);
    }

    return finalSentences.length > 0 ? finalSentences : [decoded];
  };

  /**
   * ⚡ TẢI TRƯỚC TOÀN BỘ KỊCH BẢN VÀO RAM AUDIOBUFFER (PARALLEL PREFETCH 0MS DELAY)
   * Nạp ngầm toàn bộ các câu thoại vào RAM cache để khi đọc đến câu nào là có sẵn buffer ngay lập tức 0ms
   */
  const prefetchAllSentences = async (sentenceList, customVoice = null) => {
    if (!sentenceList || sentenceList.length === 0) return;
    const curVoice = customVoice || selectedVoiceRef.current || defaultVoiceId || 'free_vi_female';
    for (let i = 0; i < sentenceList.length; i++) {
      try {
        const parsed = parseScriptSentence(sentenceList[i], curVoice);
        if (parsed.cleanText) {
          const rate = (parsed.matchedSpeakerAvatar?.rate ?? 1.0) * (speedRef.current || 1.0);
          const pitch = parsed.matchedSpeakerAvatar?.pitch;
          await prefetchTTSAudio(parsed.cleanText, parsed.voiceObj, { rate, pitch });
        }
      } catch (e) {}
    }
  };

  // Đổi giọng: Ngay lập tức lưu và PHÁT NGAY LẬP TỨC kịch bản với giọng mới được chọn (0ms)
  const handleVoiceSelect = (voiceId) => {
    if (!voiceId) return;
    try { unlockAudioContext(); } catch (e) {}
    setSelectedVoiceId(voiceId);
    selectedVoiceRef.current = voiceId;

    if (onVoiceChange) {
      onVoiceChange(voiceId);
    }

    const newVoiceObj = ALL_SYSTEM_VOICES.find(v => v.id === voiceId) || { id: voiceId, lang: 'vi-VN', gender: 'Female' };

    // Dừng âm thanh cũ sạch sẽ và hủy mọi timer chờ
    if (queueTimeoutRef.current) {
      clearTimeout(queueTimeoutRef.current);
      queueTimeoutRef.current = null;
    }
    stopVoiceAudio();

    if (!text || !text.trim()) return;

    const sentences = splitIntoSentences(text);
    if (!sentences || sentences.length === 0) return;

    sentencesRef.current = sentences;
    isPlayingRef.current = true;
    setIsPlaying(true);
    setTotalSentences(sentences.length);
    setCurrentSentenceIdx(0);
    currentSentenceIdxRef.current = 0;

    // Bật cờ chạy thử kịch bản
    if (typeof window !== 'undefined') {
      window.__isScriptTestingRunning = true;
      try { localStorage.setItem('avalive_script_testing_active', 'true'); } catch(e) {}
      window.dispatchEvent(new CustomEvent('avalive_script_testing_state_change', { detail: { isTesting: true } }));
    }

    // Tải trước ngầm TOÀN BỘ kịch bản với giọng mới vào RAM Cache
    prefetchAllSentences(sentences, newVoiceObj);

    // Phát ngay lập tức 0ms câu đầu tiên với giọng mới
    playSentenceAtIndex(0, newVoiceObj);
  };

  const handleStop = () => {
    isPlayingRef.current = false;
    if (queueTimeoutRef.current) {
      clearTimeout(queueTimeoutRef.current);
      queueTimeoutRef.current = null;
    }
    stopVoiceAudio();
    setIsPlaying(false);
    setCurrentSentenceIdx(0);
    currentSentenceIdxRef.current = 0;

    // Tắt cờ chạy thử kịch bản
    if (typeof window !== 'undefined') {
      window.__isScriptTestingRunning = false;
      try { localStorage.removeItem('avalive_script_testing_active'); } catch(e) {}
      window.dispatchEvent(new CustomEvent('avalive_script_testing_state_change', { detail: { isTesting: false } }));
    }

    try {
      window.dispatchEvent(new CustomEvent('avalive_active_speaker_changed', {
        detail: { isSpeaking: false }
      }));
    } catch (e) {}
  };

  const playSentenceAtIndex = (index, customVoice = null) => {
    if (!isPlayingRef.current) return;
    try { unlockAudioContext(); } catch (e) {}

    if (queueTimeoutRef.current) {
      clearTimeout(queueTimeoutRef.current);
      queueTimeoutRef.current = null;
    }

    const sentences = sentencesRef.current;
    if (!sentences || index >= sentences.length) {
      // 🔄 ĐÃ ĐỌC HẾT KỊCH BẢN: TỰ ĐỘNG LẶP LẠI TUẦN HOÀN LIÊN TỤC TỪ ĐẦU (LOOP) CHO ĐẾN KHI NGƯỜI DÙNG BẤM DỪNG
      if (sentences && sentences.length > 0 && isPlayingRef.current) {
        setCurrentSentenceIdx(0);
        currentSentenceIdxRef.current = 0;
        const pauseSec = pauseDurationRef.current !== undefined ? Number(pauseDurationRef.current) : 0.0;
        const loopPauseMs = pauseSec <= 0.01 ? 0 : Math.round(pauseSec * 1000);
        if (loopPauseMs <= 0) {
          if (isPlayingRef.current) {
            playSentenceAtIndex(0, customVoice);
          }
        } else {
          setTimeout(() => {
            if (isPlayingRef.current) {
              playSentenceAtIndex(0, customVoice);
            }
          }, loopPauseMs);
        }
      } else {
        handleStop();
      }
      return;
    }

    setCurrentSentenceIdx(index);
    currentSentenceIdxRef.current = index;
    const rawSentenceText = sentences[index];

    // 🎭 Phân giải câu thoại hiện tại
    const { cleanText: cleanSentenceText, voiceObj, activeSpeakerId, matchedSpeakerAvatar } = parseScriptSentence(rawSentenceText, customVoice);

    if (!cleanSentenceText || !cleanSentenceText.trim()) {
      playSentenceAtIndex(index + 1, customVoice);
      return;
    }

    // Bắn sự kiện chuyển đổi nhân vật phát biểu (Active Speaker) cho màn hình Live Overlay / Desktop OBS
    try {
      window.dispatchEvent(new CustomEvent('avalive_active_speaker_changed', {
        detail: { 
          avatarId: activeSpeakerId, 
          speakerName: matchedSpeakerAvatar?.name || 'Idol', 
          isSpeaking: true, 
          speechText: cleanSentenceText 
        }
      }));
    } catch (e) {}

    // 🚀 LOOKAHEAD PIPELINE VƯỢT TRỘI: Pre-fetch các câu tiếp theo (N+1 -> N+5) với CHÍNH XÁC cleanText, rate & pitch
    for (let offset = 1; offset <= 5; offset++) {
      const nextIdx = index + offset;
      if (nextIdx < sentences.length) {
        const nextParsed = parseScriptSentence(sentences[nextIdx], customVoice);
        if (nextParsed.cleanText) {
          const nextRate = (nextParsed.matchedSpeakerAvatar?.rate ?? 1.0) * (speedRef.current || 1.0);
          const nextPitch = nextParsed.matchedSpeakerAvatar?.pitch;
          prefetchTTSAudio(nextParsed.cleanText, nextParsed.voiceObj, { rate: nextRate, pitch: nextPitch });
        }
      }
    }

    const speakerRate = (matchedSpeakerAvatar?.rate ?? 1.0) * (speedRef.current || 1.0);
    const speakerVolume = (matchedSpeakerAvatar?.volume ?? 1.0) * (volumeRef.current || 1.0);

    let hasHandledStep = false;
    let watchdogTimer = null;

    const advanceToNextSentence = () => {
      if (hasHandledStep) return;
      hasHandledStep = true;
      if (watchdogTimer) {
        clearTimeout(watchdogTimer);
        watchdogTimer = null;
      }
      if (!isPlayingRef.current) return;
      if (queueTimeoutRef.current) {
        clearTimeout(queueTimeoutRef.current);
        queueTimeoutRef.current = null;
      }

      // Thông báo nhân vật đã nói xong câu hiện tại
      try {
        window.dispatchEvent(new CustomEvent('avalive_active_speaker_changed', {
          detail: { avatarId: activeSpeakerId, isSpeaking: false }
        }));
      } catch (e) {}

      const pauseSec = pauseDurationRef.current !== undefined ? Number(pauseDurationRef.current) : 0.0;
      
      // Phát câu tiếp theo: nếu người dùng không cài khoảng dừng (<= 0.01s) thì ĐỌC LIÊN TỤC KHÔNG DỪNG (0ms)
      if (pauseSec <= 0.01) {
        if (isPlayingRef.current) playSentenceAtIndex(index + 1, customVoice);
      } else {
        const pauseMs = Math.round(pauseSec * 1000);
        queueTimeoutRef.current = setTimeout(() => {
          if (isPlayingRef.current) {
            playSentenceAtIndex(index + 1, customVoice);
          }
        }, pauseMs);
      }
    };

    // Watchdog an toàn: Thời gian tối đa cho 1 câu đọc (chỉ kích hoạt khi mạng lỗi hoàn toàn, không bao giờ ngắt ngang tiếng)
    const cleanLen = (cleanSentenceText || '').length;
    const dynamicTimeoutMs = Math.max(20000, Math.ceil((cleanLen / 4) + 12) * 1000);
    watchdogTimer = setTimeout(() => {
      if (isPlayingRef.current && currentSentenceIdxRef.current === index && !hasHandledStep) {
        console.warn(`[EventVoiceTester] Watchdog safety timeout for sentence ${index} (len: ${cleanLen}), advancing.`);
        stopVoiceAudio();
        advanceToNextSentence();
      }
    }, dynamicTimeoutMs);

    previewVoiceAudio(
      voiceObj,
      cleanSentenceText,
      () => {
        advanceToNextSentence();
      },
      {
        priority: true,
        isTest: true,
        volume: speakerVolume,
        rate: speakerRate,
        sentencePauseSeconds: pauseDurationRef.current !== undefined ? pauseDurationRef.current : 0
      }
    );
  };

  const handlePauseChange = (newPause) => {
    const val = Number(newPause);
    setPauseDuration(val);
    pauseDurationRef.current = val;
    try {
      localStorage.setItem('avalive_pause_between_sentences', String(val));
      window.dispatchEvent(new CustomEvent('avalive_pause_between_sentences_updated', { detail: { pause: val } }));
    } catch (e) {}
    if (onPauseChange) {
      onPauseChange(val);
    }
  };

  const handleOptimizeClick = () => {
    if (!text || !text.trim()) {
      alert('Chưa có nội dung câu thoại hoặc kịch bản để tối ưu!');
      return;
    }
    const optimized = polishAndOptimizeScript(text);
    if (onScriptOptimized) {
      onScriptOptimized(optimized);
    }
  };

  // ⚡ TỰ ĐỘNG TẢI TRƯỚC VÀO BỘ NHỚ RAM (PRE-WARM CACHE TOÀN BỘ KỊCH BẢN) NGAY KHI NHẬP TEXT / ĐỔI GIỌNG
  // Giúp khi bấm Play, âm thanh phát ra NGAY TỨC THÌ 0.000s, không cần đợi tải mạng!
  useEffect(() => {
    if (!text || !text.trim()) return;
    const timer = setTimeout(() => {
      try {
        const sentences = splitIntoSentences(text);
        if (sentences && sentences.length > 0) {
          prefetchAllSentences(sentences, selectedVoiceRef.current);
        }
      } catch (e) {}
    }, 150);

    return () => clearTimeout(timer);
  }, [text, selectedVoiceId, speed]);

  const handleTogglePlay = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    try { unlockAudioContext(); } catch (e) {}

    if (isPlaying) {
      handleStop();
      return;
    }

    if (!text || !text.trim()) {
      alert('Chưa có nội dung câu thoại hoặc kịch bản để nghe thử. Vui lòng nhập nội dung trước!');
      return;
    }

    const sentences = splitIntoSentences(text);
    if (sentences.length === 0) return;

    sentencesRef.current = sentences;
    isPlayingRef.current = true;
    setIsPlaying(true);
    setTotalSentences(sentences.length);
    setCurrentSentenceIdx(0);
    currentSentenceIdxRef.current = 0;

    // Bật cờ chạy thử kịch bản: KHÔNG ĐƯỢC LỒNG BÌNH LUẬN VÀO TRONG LÚC CHẠY THỬ
    if (typeof window !== 'undefined') {
      window.__isScriptTestingRunning = true;
      try { localStorage.setItem('avalive_script_testing_active', 'true'); } catch(e) {}
      window.dispatchEvent(new CustomEvent('avalive_script_testing_state_change', { detail: { isTesting: true } }));
    }

    const curVoiceId = selectedVoiceRef.current || defaultVoiceId || 'free_vi_female';
    const parsed0 = parseScriptSentence(sentences[0], curVoiceId);

    // Tải trước ngầm TOÀN BỘ kịch bản song song vào RAM Cache ngay lập tức
    prefetchAllSentences(sentences, curVoiceId);

    playSentenceAtIndex(0, parsed0.voiceObj);
  };

  const isDark = theme === 'dark';

  // Lọc các nhóm giọng chuẩn đồng bộ 100% với kho giọng hệ thống
  const favoriteVoices = ALL_SYSTEM_VOICES.filter(v => (favoriteIds || []).includes(v.id));
  const dualConfig = getDualVoiceConfig();
  const currentIdolVoice = ALL_SYSTEM_VOICES.find(v => v.id === dualConfig?.idolVoice?.id);
  const currentManagerVoice = ALL_SYSTEM_VOICES.find(v => v.id === dualConfig?.managerVoice?.id);
  const currentGameVoice = ALL_SYSTEM_VOICES.find(v => v.id === dualConfig?.gameBlvVoice?.id);

  const cleanVoiceName = (name) => {
    if (!name) return '';
    return name.replace(/[👑💎⚡🔥♀♂★☆]/gu, '').replace(/\s+/g, ' ').trim();
  };

  const renderVoiceOptions = () => (
    <>
      {/* 1. GIỌNG ĐỌC YÊU THÍCH ĐÃ CHỌN */}
      {favoriteVoices.length > 0 && (
        <optgroup label={`⭐ GIỌNG YÊU THÍCH (${favoriteVoices.length} Giọng)`}>
          {favoriteVoices.map(v => (
            <option key={`fav_${v.id}`} value={v.id}>
              ⭐ {cleanVoiceName(v.name)}
            </option>
          ))}
        </optgroup>
      )}

      {/* 2. CÁC GIỌNG ĐANG GÁN TRỰC TIẾP CHO PHIÊN LIVE */}
      <optgroup label="🎙️ VAI TRÒ GÁN TRÊN PHIÊN LIVE">
        {currentIdolVoice && (
          <option value={currentIdolVoice.id}>
            🎤 [Idol Live] {cleanVoiceName(currentIdolVoice.name)}
          </option>
        )}
        {currentManagerVoice && currentManagerVoice.id !== currentIdolVoice?.id && (
          <option value={currentManagerVoice.id}>
            💼 [Trợ Lý Live] {cleanVoiceName(currentManagerVoice.name)}
          </option>
        )}
        {currentGameVoice && currentGameVoice.id !== currentIdolVoice?.id && currentGameVoice.id !== currentManagerVoice?.id && (
          <option value={currentGameVoice.id}>
            🎮 [BLV Game PK] {cleanVoiceName(currentGameVoice.name)}
          </option>
        )}
      </optgroup>

      {/* 3. 🌸 GIỌNG NỮ VIỆT NAM (THEO ĐỘ TUỔI & PHONG CÁCH) */}
      <optgroup label="── 👩 NỮ TRẺ 20–24t (Hot Trend & Bán Hàng) ──">
        {MASTER_DNA_FEMALE_VIETNAMESE_40_VOICES.filter(v => v.ageRange === '20-24').map(v => (
          <option key={`fem_20_24_${v.id}`} value={v.id}>
            {cleanVoiceName(v.name)}
          </option>
        ))}
      </optgroup>

      <optgroup label="── 👩 NỮ TRẺ 20–28t (Idol Live, Creator & Đa Miền) ──">
        {VIETNAMESE_FEMALE_VOICES.filter(v => v.ageGroup === 'young').map(v => (
          <option key={`fem_young_${v.id}`} value={v.id}>
            {cleanVoiceName(v.name)}
          </option>
        ))}
      </optgroup>

      <optgroup label="── 👩 NỮ TRƯỞNG THÀNH 24–28t (Sang Trọng & Quyến Rũ) ──">
        {MASTER_DNA_FEMALE_VIETNAMESE_40_VOICES.filter(v => v.ageRange === '24-28').map(v => (
          <option key={`fem_24_28_${v.id}`} value={v.id}>
            {cleanVoiceName(v.name)}
          </option>
        ))}
      </optgroup>

      <optgroup label="── 👩 NỮ TRƯỞNG THÀNH 28–40t (Thời Sự VTV, Diễn Giả, Doanh Nhân) ──">
        {VIETNAMESE_FEMALE_VOICES.filter(v => v.ageGroup === 'middle').map(v => (
          <option key={`fem_mid_${v.id}`} value={v.id}>
            {cleanVoiceName(v.name)}
          </option>
        ))}
      </optgroup>

      <optgroup label="── 👵 NỮ TRUNG & LÃO NIÊN 40–70t (Chữa Lành & Dân Gian) ──">
        {VIETNAMESE_FEMALE_VOICES.filter(v => v.ageGroup === 'elder' || v.ageGroup === 'senior').map(v => (
          <option key={`fem_eld_${v.id}`} value={v.id}>
            {cleanVoiceName(v.name)}
          </option>
        ))}
      </optgroup>

      {/* 4. 👔 GIỌNG NAM VIỆT NAM (THEO 4 ĐỘ TUỔI & PHONG CÁCH ĐỘC BẢN) */}
      <optgroup label="── 👨 NAM TRẺ 18–24t (GenZ Bắt Trend, BLV Game & TikTok Viral) ──">
        {MASTER_DNA_MALE_VIETNAMESE_40_VOICES.filter(v => v.ageRange === '18-24').map(v => (
          <option key={`male_18_24_${v.id}`} value={v.id}>
            {cleanVoiceName(v.name)}
          </option>
        ))}
      </optgroup>

      <optgroup label="── 👨 NAM TRƯỞNG THÀNH 25–34t (Chốt Deal, MC Sự Kiện & Doanh Nhân) ──">
        {MASTER_DNA_MALE_VIETNAMESE_40_VOICES.filter(v => v.ageRange === '25-34').map(v => (
          <option key={`male_25_34_${v.id}`} value={v.id}>
            {cleanVoiceName(v.name)}
          </option>
        ))}
      </optgroup>

      <optgroup label="── 👔 NAM TRUNG NIÊN 35–45t (BTV Thời Sự VTV, Doanh Nhân & Phim Bom Tấn) ──">
        {MASTER_DNA_MALE_VIETNAMESE_40_VOICES.filter(v => v.ageRange === '35-45').map(v => (
          <option key={`male_35_45_${v.id}`} value={v.id}>
            {cleanVoiceName(v.name)}
          </option>
        ))}
      </optgroup>

      <optgroup label="── 👴 NAM CAO NIÊN 46–65+t (Lão Thành, Lương Y & Phong Trần Từng Trải) ──">
        {MASTER_DNA_MALE_VIETNAMESE_40_VOICES.filter(v => v.ageRange === '46-65+').map(v => (
          <option key={`male_46_65_${v.id}`} value={v.id}>
            {cleanVoiceName(v.name)}
          </option>
        ))}
      </optgroup>

      {/* 5. 🛍️ GIỌNG BÁN HÀNG & DỊCH VỤ ĐA NGÀNH */}
      <optgroup label="── 🛍️ BÁN HÀNG SẢN PHẨM & NÔNG SẢN ĐẶC SẢN ──">
        {VIETNAMESE_SALES_VOICES.map(v => (
          <option key={`sales_${v.id}`} value={v.id}>
            {cleanVoiceName(v.name)}
          </option>
        ))}
      </optgroup>

      {/* 6. 🌐 GIỌNG ĐỌC QUỐC TẾ ĐA NGÔN NGỮ (ĐẦY ĐỦ 20 NGÔN NGỮ TOÀN CẦU) */}
      <optgroup label="── 🇺🇸 🇬🇧 TIẾNG ANH (Mỹ, Anh, Úc, Canada) ──">
        {INTERNATIONAL_VOICES.filter(v => v.lang?.startsWith('en')).map(v => (
          <option key={`intl_en_${v.id}`} value={v.id}>
            {cleanVoiceName(v.name)}
          </option>
        ))}
      </optgroup>

      <optgroup label="── 🇯🇵 TIẾNG NHẬT (Japanese) ──">
        {INTERNATIONAL_VOICES.filter(v => v.lang?.startsWith('ja')).map(v => (
          <option key={`intl_ja_${v.id}`} value={v.id}>
            {cleanVoiceName(v.name)}
          </option>
        ))}
      </optgroup>

      <optgroup label="── 🇨🇳 TIẾNG TRUNG (Chinese) ──">
        {INTERNATIONAL_VOICES.filter(v => v.lang?.startsWith('zh')).map(v => (
          <option key={`intl_zh_${v.id}`} value={v.id}>
            {cleanVoiceName(v.name)}
          </option>
        ))}
      </optgroup>

      <optgroup label="── 🇰🇷 TIẾNG HÀN (Korean) ──">
        {INTERNATIONAL_VOICES.filter(v => v.lang?.startsWith('ko')).map(v => (
          <option key={`intl_ko_${v.id}`} value={v.id}>
            {cleanVoiceName(v.name)}
          </option>
        ))}
      </optgroup>

      <optgroup label="── 🇹🇭 TIẾNG THÁI (Thai) ──">
        {INTERNATIONAL_VOICES.filter(v => v.lang?.startsWith('th')).map(v => (
          <option key={`intl_th_${v.id}`} value={v.id}>
            {cleanVoiceName(v.name)}
          </option>
        ))}
      </optgroup>

      <optgroup label="── 🇮🇩 TIẾNG INDONESIA (Indonesian) ──">
        {INTERNATIONAL_VOICES.filter(v => v.lang?.startsWith('id')).map(v => (
          <option key={`intl_id_${v.id}`} value={v.id}>
            {cleanVoiceName(v.name)}
          </option>
        ))}
      </optgroup>

      <optgroup label="── 🇲🇾 TIẾNG MALAYSIA (Malay) ──">
        {INTERNATIONAL_VOICES.filter(v => v.lang?.startsWith('ms')).map(v => (
          <option key={`intl_ms_${v.id}`} value={v.id}>
            {cleanVoiceName(v.name)}
          </option>
        ))}
      </optgroup>

      <optgroup label="── 🇵🇭 TIẾNG PHILIPPINES (Tagalog/Filipino) ──">
        {INTERNATIONAL_VOICES.filter(v => v.lang?.startsWith('fil') || v.lang?.startsWith('tl')).map(v => (
          <option key={`intl_fil_${v.id}`} value={v.id}>
            {cleanVoiceName(v.name)}
          </option>
        ))}
      </optgroup>

      <optgroup label="── 🇮🇳 TIẾNG HINDI (Ấn Độ) ──">
        {INTERNATIONAL_VOICES.filter(v => v.lang?.startsWith('hi')).map(v => (
          <option key={`intl_hi_${v.id}`} value={v.id}>
            {cleanVoiceName(v.name)}
          </option>
        ))}
      </optgroup>

      <optgroup label="── 🇸🇦 TIẾNG Ả RẬP (Arabic) ──">
        {INTERNATIONAL_VOICES.filter(v => v.lang?.startsWith('ar')).map(v => (
          <option key={`intl_ar_${v.id}`} value={v.id}>
            {cleanVoiceName(v.name)}
          </option>
        ))}
      </optgroup>

      <optgroup label="── 🇫🇷 TIẾNG PHÁP (French) ──">
        {INTERNATIONAL_VOICES.filter(v => v.lang?.startsWith('fr')).map(v => (
          <option key={`intl_fr_${v.id}`} value={v.id}>
            {cleanVoiceName(v.name)}
          </option>
        ))}
      </optgroup>

      <optgroup label="── 🇩🇪 TIẾNG ĐỨC (German) ──">
        {INTERNATIONAL_VOICES.filter(v => v.lang?.startsWith('de')).map(v => (
          <option key={`intl_de_${v.id}`} value={v.id}>
            {cleanVoiceName(v.name)}
          </option>
        ))}
      </optgroup>

      <optgroup label="── 🇪🇸 TIẾNG TÂY BAN NHA (Spanish) ──">
        {INTERNATIONAL_VOICES.filter(v => v.lang?.startsWith('es')).map(v => (
          <option key={`intl_es_${v.id}`} value={v.id}>
            {cleanVoiceName(v.name)}
          </option>
        ))}
      </optgroup>

      <optgroup label="── 🇮🇹 TIẾNG Ý (Italian) ──">
        {INTERNATIONAL_VOICES.filter(v => v.lang?.startsWith('it')).map(v => (
          <option key={`intl_it_${v.id}`} value={v.id}>
            {cleanVoiceName(v.name)}
          </option>
        ))}
      </optgroup>

      <optgroup label="── 🇷🇺 TIẾNG NGA (Russian) ──">
        {INTERNATIONAL_VOICES.filter(v => v.lang?.startsWith('ru')).map(v => (
          <option key={`intl_ru_${v.id}`} value={v.id}>
            {cleanVoiceName(v.name)}
          </option>
        ))}
      </optgroup>

      <optgroup label="── 🇧🇷 🇵🇹 TIẾNG BỒ ĐÀO NHA (Portuguese) ──">
        {INTERNATIONAL_VOICES.filter(v => v.lang?.startsWith('pt')).map(v => (
          <option key={`intl_pt_${v.id}`} value={v.id}>
            {cleanVoiceName(v.name)}
          </option>
        ))}
      </optgroup>

      <optgroup label="── 🇹🇷 TIẾNG THỔ NHĨ KỲ (Turkish) ──">
        {INTERNATIONAL_VOICES.filter(v => v.lang?.startsWith('tr')).map(v => (
          <option key={`intl_tr_${v.id}`} value={v.id}>
            {cleanVoiceName(v.name)}
          </option>
        ))}
      </optgroup>

      <optgroup label="── 🇵🇱 TIẾNG BA LAN (Polish) ──">
        {INTERNATIONAL_VOICES.filter(v => v.lang?.startsWith('pl')).map(v => (
          <option key={`intl_pl_${v.id}`} value={v.id}>
            {cleanVoiceName(v.name)}
          </option>
        ))}
      </optgroup>

      <optgroup label="── 🇳🇱 TIẾNG HÀ LAN (Dutch) ──">
        {INTERNATIONAL_VOICES.filter(v => v.lang?.startsWith('nl')).map(v => (
          <option key={`intl_nl_${v.id}`} value={v.id}>
            {cleanVoiceName(v.name)}
          </option>
        ))}
      </optgroup>
    </>
  );

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1.5 flex-wrap ${className}`}>
        {/* Voice Selector */}
        <select
          value={selectedVoiceId}
          onChange={(e) => handleVoiceSelect(e.target.value)}
          className={`text-[11px] font-bold rounded-lg px-2 py-1 border transition-all cursor-pointer focus:outline-none ${
            isDark 
              ? 'bg-[#1e2230] text-amber-300 border-white/10 hover:border-amber-500/50' 
              : 'bg-white text-gray-800 border-gray-300 hover:border-blue-400 shadow-2xs'
          }`}
          title="Chọn giọng đọc để nghe thử"
        >
          {renderVoiceOptions()}
        </select>

        {/* Speed Selector */}
        <select
          value={speed}
          onChange={(e) => handleSpeedChange(Number(e.target.value))}
          className={`text-[11px] font-bold rounded-lg px-1.5 py-1 border transition-all cursor-pointer focus:outline-none ${
            isDark ? 'bg-[#1e2230] text-blue-300 border-white/10' : 'bg-white text-blue-700 border-gray-300'
          }`}
          title="Tốc độ đọc của AI"
        >
          {SPEED_OPTIONS.map(opt => (
            <option key={`opt_spd_${opt.value}`} value={opt.value}>⚡ {opt.label}</option>
          ))}
        </select>

        {/* Pause Duration Selector */}
        <select
          value={pauseDuration}
          onChange={(e) => handlePauseChange(Number(e.target.value))}
          className={`text-[11px] font-bold rounded-lg px-1.5 py-1 border transition-all cursor-pointer focus:outline-none ${
            isDark ? 'bg-[#1e2230] text-emerald-300 border-white/10' : 'bg-white text-emerald-700 border-gray-300'
          }`}
          title="Thời gian nghỉ giữa các câu thoại"
        >
          {PAUSE_OPTIONS.map(opt => (
            <option key={`opt_pause_${opt.value}`} value={opt.value}>⏳ {opt.label}</option>
          ))}
        </select>

        {/* Play/Stop Button */}
        <button
          type="button"
          onClick={handleTogglePlay}
          className={`px-2.5 py-1 rounded-lg text-xs font-black flex items-center gap-1 transition-all cursor-pointer shadow-xs active:scale-95 ${
            isPlaying
              ? 'bg-purple-600 text-white animate-pulse shadow-md ring-2 ring-purple-400'
              : isDark
                ? 'bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40'
                : 'bg-purple-100 hover:bg-purple-200 text-purple-800 border border-purple-300'
          }`}
          title={isPlaying ? 'Dừng phát âm thanh' : 'Nghe thử toàn bộ câu thoại này'}
        >
          {isPlaying ? <Square size={11} className="fill-current" /> : <Volume2 size={12} />}
          <span>{isPlaying ? `DỪNG (${currentSentenceIdx + 1}/${totalSentences || 1})` : 'NGHE THỬ'}</span>
        </button>
      </div>
    );
  }

  return (
    <div className={`p-3 rounded-2xl border flex flex-col lg:flex-row lg:items-center justify-between gap-3 transition-all ${
      isDark 
        ? 'bg-[#161a24] border-white/10 text-white shadow-sm' 
        : 'bg-gradient-to-r from-blue-50/80 via-indigo-50/60 to-purple-50/80 border-blue-200 text-gray-800 shadow-2xs'
    } ${className}`}>
      
      {/* Label & Progress Status */}
      <div className="flex items-center gap-2.5 min-w-0">
        <span className={`p-2 rounded-xl shrink-0 ${isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700'}`}>
          <Volume2 size={16} />
        </span>
        <div className="min-w-0">
          <div className="text-xs font-black truncate flex items-center gap-2 flex-wrap">
            <span>{label}</span>
            {isPlaying && (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/20 text-emerald-700 text-[10.5px] rounded-full font-bold animate-pulse border border-emerald-400/40">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>Đang đọc: <b>Câu {currentSentenceIdx + 1}/{totalSentences}</b></span>
              </span>
            )}
          </div>
          <div className={`text-[11px] truncate max-w-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Đọc chuẩn cảm xúc, có lấy hơi, nhấn nhá cao trào, mượt mà suôn sẻ không khựng.
          </div>
        </div>
      </div>

      {/* Voice Dropdown + Speed Selector + Pause Duration + Volume Slider + Play Button */}
      <div className="flex items-center gap-2 flex-wrap shrink-0 justify-start lg:justify-end">
        
        {/* 1. Chọn giọng */}
        <div className="flex items-center gap-1.5">
          <span className={`text-[11px] font-bold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Giọng:
          </span>
          <select
            value={selectedVoiceId}
            onChange={(e) => handleVoiceSelect(e.target.value)}
            className={`text-xs font-bold rounded-xl px-2.5 py-1.5 border transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-purple-500 max-w-[240px] truncate ${
              isDark 
                ? 'bg-[#1e2230] text-amber-300 border-white/10 hover:border-amber-500/50' 
                : 'bg-white text-gray-800 border-gray-300 hover:border-purple-400 shadow-xs'
            }`}
          >
            {renderVoiceOptions()}
          </select>
        </div>

        {/* 2. Tốc độ đọc (Speed Rate) */}
        <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-xl border border-gray-300 shadow-2xs">
          <Gauge size={13} className="text-blue-600 shrink-0" />
          <select
            value={speed}
            onChange={(e) => handleSpeedChange(Number(e.target.value))}
            className="text-xs font-bold bg-transparent text-blue-900 focus:outline-none cursor-pointer"
            title="Tốc độ đọc của AI (Rate)"
          >
            {SPEED_OPTIONS.map(opt => (
              <option key={`main_spd_${opt.value}`} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* 3. Nghỉ giữa câu (Pause Duration) */}
        <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-xl border border-gray-300 shadow-2xs">
          <Timer size={13} className="text-emerald-600 shrink-0" />
          <select
            value={pauseDuration}
            onChange={(e) => handlePauseChange(Number(e.target.value))}
            className="text-xs font-bold bg-transparent text-emerald-900 focus:outline-none cursor-pointer"
            title="Thời gian nghỉ giữa các câu thoại (0s đến 1s)"
          >
            {PAUSE_OPTIONS.map(opt => (
              <option key={`main_pause_${opt.value}`} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* 4. Âm lượng (Volume Slider: 0% - 100%) */}
        <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-xl border border-gray-300 shadow-2xs">
          {volume === 0 ? <VolumeX size={13} className="text-gray-400 shrink-0" /> : <Volume2 size={13} className="text-purple-600 shrink-0" />}
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.05"
            value={volume}
            onChange={(e) => handleVolumeChange(e.target.value)}
            className="w-14 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            title={`Âm lượng giọng đọc: ${Math.round(volume * 100)}%`}
          />
          <span className="text-[10px] font-bold text-gray-600 min-w-[28px] text-right">
            {Math.round(volume * 100)}%
          </span>
        </div>

        {/* 5. Nút Nghe Thử Voice / Dừng Lại */}
        {(() => {
          const currentVoiceObj = ALL_SYSTEM_VOICES.find(v => v.id === selectedVoiceId);
          const shortVoiceName = currentVoiceObj?.name?.split('(')[0]?.replace(/ 👑| ⭐| 💎/g, '')?.trim() || 'AI';
          return (
            <button
              type="button"
              onClick={handleTogglePlay}
              className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95 ${
                isPlaying
                  ? 'bg-rose-600 text-white animate-pulse shadow-lg ring-2 ring-rose-400'
                  : isDark
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md'
              }`}
              title={isPlaying ? 'Dừng phát âm thanh kịch bản' : `Nghe thử toàn bộ kịch bản này với giọng ${shortVoiceName}`}
            >
              {isPlaying ? <Square size={13} className="fill-current" /> : <Play size={13} className="fill-current" />}
              <span>{isPlaying ? `DỪNG (${shortVoiceName} - ${currentSentenceIdx + 1}/${totalSentences || 1})` : `NGHE THỬ (${shortVoiceName})`}</span>
            </button>
          );
        })()}
      </div>

    </div>
  );
}
