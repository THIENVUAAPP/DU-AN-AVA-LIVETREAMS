import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Square, Sparkles, ChevronDown, Check, Gauge, Sliders, Star, Timer, Wand2 } from 'lucide-react';
import { 
  ALL_SYSTEM_VOICES, 
  MASTER_DNA_FEMALE_VIETNAMESE_40_VOICES,
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
  polishAndOptimizeScript,
  formatTextForRegionalSpeech,
  prefetchTTSAudio
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
  { value: 0.00, label: '0.0s (Liền mạch)' },
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
    try {
      const saved = localStorage.getItem('avalive_pause_between_sentences');
      if (saved !== null && !isNaN(Number(saved))) return Number(saved);
    } catch (e) {}
    return 0.10;
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

  // Đổi giọng: Ngay lập tức lưu và PHÁT NGAY LẬP TỨC kịch bản với giọng mới được chọn (0ms)
  const handleVoiceSelect = (voiceId) => {
    if (!voiceId) return;
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

    // Lookahead prefetch chỉ câu tiếp theo (câu 1) để không làm nghẽn băng thông của câu 0
    if (sentences.length > 1) {
      prefetchTTSAudio(sentences[1], newVoiceObj, { rate: speedRef.current });
    }

    // Phát ngay lập tức 0ms câu đầu tiên với giọng mới
    playSentenceAtIndex(0, newVoiceObj);
  };

  /**
   * Phân tách kịch bản dài thành các câu thoại hoàn chỉnh chuẩn ngữ nghĩa (theo từng dòng)
   * Tự động thay thế placeholder và ngắt câu thông minh để TTS phản hồi ngay lập tức
   */
  const splitIntoSentences = (raw) => {
    if (!raw || !raw.trim()) return [];
    
    let processed = String(raw)
      .replace(/\[user\]|\{user\}/gi, 'Quốc Thiện')
      .replace(/\{comment\}|\[comment\]/gi, 'Sản phẩm này giá bao nhiêu shop?')
      .replace(/\{gift_name\}|\[gift_name\]/gi, 'Cờ Tổ Quốc')
      .replace(/\{count\}|\[count\]/gi, '5')
      .replace(/\{milestone\}|\[milestone\]/gi, '10,000')
      .replace(/\{item\}|\[item\]/gi, 'Bộ Đôi Serum Tế Bào Gốc')
      .replace(/\{product\}|\[product\]/gi, 'Bộ Đôi Serum Tế Bào Gốc')
      .replace(/\{price\}|\[price\]/gi, '890.000đ');

    processed = cleanTextForVoiceSpeech(processed);

    // Tách theo từng dòng (mỗi dòng là một đoạn/câu thoại hoàn chỉnh)
    const lines = processed.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    
    // Nếu có dòng nào quá dài (>250 ký tự), tự động phân tách thêm theo dấu chấm ngắt câu
    const finalSentences = [];
    for (const line of lines) {
      if (line.length > 250) {
        const subParts = line.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [line];
        for (const sub of subParts) {
          const s = sub.trim();
          if (s) finalSentences.push(s);
        }
      } else {
        finalSentences.push(line);
      }
    }

    return finalSentences.length > 0 ? finalSentences : [processed];
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
  };

  const playSentenceAtIndex = (index, customVoice = null) => {
    if (!isPlayingRef.current) return;

    if (queueTimeoutRef.current) {
      clearTimeout(queueTimeoutRef.current);
      queueTimeoutRef.current = null;
    }

    const sentences = sentencesRef.current;
    if (!sentences || index >= sentences.length) {
      handleStop();
      return;
    }

    setCurrentSentenceIdx(index);
    currentSentenceIdxRef.current = index;
    const sentenceText = sentences[index];

    const curVoiceId = customVoice ? (customVoice.id || customVoice) : selectedVoiceRef.current;
    let voiceObj = customVoice && typeof customVoice === 'object' ? customVoice : null;
    if (!voiceObj) {
      voiceObj = ALL_SYSTEM_VOICES.find(v => v.id === curVoiceId) || 
        (curVoiceId === 'idol' ? ALL_SYSTEM_VOICES.find(v => v.recommendedFor === 'idol') :
         curVoiceId === 'manager' || curVoiceId === 'assistant' ? ALL_SYSTEM_VOICES.find(v => v.recommendedFor === 'manager') :
         curVoiceId === 'game' ? ALL_SYSTEM_VOICES.find(v => v.recommendedFor === 'game') :
         ALL_SYSTEM_VOICES.find(v => v.id === 'free_vi_female')) || { id: 'free_vi_female', lang: 'vi-VN', provider: 'system', gender: 'Female' };
    }

    // 🚀 LOOKAHEAD PIPELINE: Ngay khi câu hiện tại bắt đầu phát, tải trước & giải mã câu N+1 và N+2 vào RAM
    if (index + 1 < sentences.length) {
      prefetchTTSAudio(sentences[index + 1], voiceObj, { rate: speedRef.current });
    }
    if (index + 2 < sentences.length) {
      prefetchTTSAudio(sentences[index + 2], voiceObj, { rate: speedRef.current });
    }

    previewVoiceAudio(
      voiceObj,
      sentenceText,
      {
        priority: true,
        isTest: true,
        volume: volumeRef.current,
        rate: speedRef.current,
        onEnd: () => {
          if (!isPlayingRef.current) return;
          if (queueTimeoutRef.current) {
            clearTimeout(queueTimeoutRef.current);
            queueTimeoutRef.current = null;
          }

          const pauseSec = pauseDurationRef.current !== undefined ? Number(pauseDurationRef.current) : 0.1;
          
          // Nếu chọn 0.0s (Liền mạch): Phát câu tiếp theo NGAY LẬP TỨC 0ms không qua bất kỳ timer delay nào!
          if (pauseSec <= 0.02) {
            playSentenceAtIndex(index + 1, voiceObj);
          } else {
            const pauseMs = Math.max(0, Math.round(pauseSec * 1000));
            queueTimeoutRef.current = setTimeout(() => {
              if (isPlayingRef.current) {
                playSentenceAtIndex(index + 1, voiceObj);
              }
            }, pauseMs);
          }
        }
      }
    );
  };

  const handlePauseChange = (newPause) => {
    const val = Number(newPause);
    setPauseDuration(val);
    pauseDurationRef.current = val;
    try {
      localStorage.setItem('avalive_pause_between_sentences', String(val));
    } catch (e) {}
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

  // ⚡ TỰ ĐỘNG TẢI TRƯỚC VÀO BỘ NHỚ RAM (PRE-WARM CACHE) NGAY KHI NHẬP TEXT / ĐỔI GIỌNG
  // Giúp khi bấm Play, âm thanh phát ra NGAY TỨC THÌ 0.000s, không cần đợi tải mạng!
  useEffect(() => {
    if (!text || !text.trim()) return;
    const timer = setTimeout(() => {
      try {
        const sentences = splitIntoSentences(text);
        if (sentences && sentences.length > 0) {
          const curVoiceId = selectedVoiceRef.current || defaultVoiceId || 'free_vi_female';
          const voiceObj = ALL_SYSTEM_VOICES.find(v => v.id === curVoiceId) || { id: curVoiceId, lang: 'vi-VN', gender: 'Female' };
          // Pre-warm câu đầu tiên và câu thứ hai vào RAM Cache
          prefetchTTSAudio(sentences[0], voiceObj, { rate: speedRef.current });
          if (sentences.length > 1) {
            prefetchTTSAudio(sentences[1], voiceObj, { rate: speedRef.current });
          }
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

    const curVoiceId = selectedVoiceRef.current || defaultVoiceId || 'free_vi_female';
    const voiceObj = ALL_SYSTEM_VOICES.find(v => v.id === curVoiceId) || { id: curVoiceId, lang: 'vi-VN', gender: 'Female' };

    // 🚀 PIPELINE PRE-FETCH: Ngay khi bấm Play, nạp trước toàn bộ kịch bản vào RAM cache ở chế độ nền
    sentences.forEach((s) => {
      prefetchTTSAudio(s, voiceObj, { rate: speedRef.current });
    });

    playSentenceAtIndex(0, voiceObj);
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

      {/* 4. 👔 GIỌNG NAM VIỆT NAM (THEO ĐỘ TUỔI & PHONG CÁCH) */}
      <optgroup label="── 👨 NAM TRẺ 20–28t (BLV Game PK, Creator & TikTok) ──">
        {VIETNAMESE_MALE_VOICES.filter(v => v.ageGroup === 'young').map(v => (
          <option key={`male_young_${v.id}`} value={v.id}>
            {cleanVoiceName(v.name)}
          </option>
        ))}
      </optgroup>

      <optgroup label="── 👨 NAM TRƯỞNG THÀNH 28–40t (MC Sự Kiện, Phóng Sự VTV & Doanh Nhân) ──">
        {VIETNAMESE_MALE_VOICES.filter(v => v.ageGroup === 'middle').map(v => (
          <option key={`male_mid_${v.id}`} value={v.id}>
            {cleanVoiceName(v.name)}
          </option>
        ))}
      </optgroup>

      <optgroup label="── 👴 NAM TRUNG & LÃO NIÊN 40–70t (Bác Sĩ, Lão Nông & Thầy Lang) ──">
        {VIETNAMESE_MALE_VOICES.filter(v => v.ageGroup === 'elder' || v.ageGroup === 'senior').map(v => (
          <option key={`male_eld_${v.id}`} value={v.id}>
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

      {/* 6. 🌐 GIỌNG ĐỌC QUỐC TẾ ĐA NGÔN NGỮ */}
      <optgroup label="── 🇺🇸 🇬🇧 TIẾNG ANH (Mỹ, Anh, Úc, Canada) ──">
        {INTERNATIONAL_VOICES.filter(v => v.lang?.startsWith('en')).map(v => (
          <option key={`intl_en_${v.id}`} value={v.id}>
            {cleanVoiceName(v.name)}
          </option>
        ))}
      </optgroup>

      <optgroup label="── 🌏 TIẾNG CHÂU Á (Nhật, Hàn, Trung, Thái) ──">
        {INTERNATIONAL_VOICES.filter(v => v.lang?.startsWith('ja') || v.lang?.startsWith('ko') || v.lang?.startsWith('zh') || v.lang?.startsWith('th')).map(v => (
          <option key={`intl_asia_${v.id}`} value={v.id}>
            {cleanVoiceName(v.name)}
          </option>
        ))}
      </optgroup>

      <optgroup label="── 🌍 TIẾNG CHÂU ÂU (Pháp, Đức, Ý, TBN, Nga) ──">
        {INTERNATIONAL_VOICES.filter(v => v.lang?.startsWith('fr') || v.lang?.startsWith('de') || v.lang?.startsWith('it') || v.lang?.startsWith('es') || v.lang?.startsWith('ru')).map(v => (
          <option key={`intl_eu_${v.id}`} value={v.id}>
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
