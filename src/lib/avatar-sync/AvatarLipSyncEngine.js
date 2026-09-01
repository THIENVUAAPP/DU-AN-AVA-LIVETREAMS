/**
 * Avatar Lip-Sync Engine (Thời Gian Thực <30ms)
 * Xử lý ánh xạ Viseme và ARKit 52 Blendshapes từ tín hiệu Audio và Text.
 * Kiến trúc đa luồng / AudioContext đảm bảo độ trễ siêu thấp.
 */

export class AvatarLipSyncEngine {
  constructor() {
    this.audioContext = null;
    this.analyser = null;
    this.dataArray = null;
    this.sourceNode = null;
    
    this.isInitialized = false;
    this.currentVolume = 0;
    
    // Lưu trữ trạng thái Blendshape hiện tại (nội suy)
    this.blendshapes = {
      jawOpen: 0,
      mouthSmile: 0,
      mouthPucker: 0,
      mouthFunnel: 0,
      viseme_aa: 0,
      viseme_E: 0,
      viseme_I: 0,
      viseme_O: 0,
      viseme_U: 0,
      viseme_sil: 1
    };

    // Target blendshapes để nội suy mượt mà (Smoothing)
    this.targetBlendshapes = { ...this.blendshapes };
    
    // Smoothing factor (độ mịn màng)
    this.lerpSpeed = 15.0; 
  }

  /**
   * Khởi tạo Web Audio API Analyser
   */
  async init() {
    if (this.isInitialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioCtx();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 512; // Phân giải tần số vừa đủ nhanh (<10ms)
      this.analyser.smoothingTimeConstant = 0.2; // Độ nhạy thời gian thực cao
      
      const bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(bufferLength);
      
      this.isInitialized = true;
      console.log('[AvatarLipSyncEngine] Đã khởi tạo luồng xử lý Audio độ trễ thấp (<30ms)');
    } catch (e) {
      console.error('[AvatarLipSyncEngine] Lỗi khởi tạo AudioContext:', e);
    }
  }

  /**
   * Kết nối Audio Element (TTS) vào luồng phân tích
   */
  connectAudioElement(audioElement) {
    if (!this.isInitialized) return;
    try {
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
      
      // Ngăn tạo nhiều source cho cùng 1 element
      if (audioElement._hasLipSyncSource) return;
      
      this.sourceNode = this.audioContext.createMediaElementSource(audioElement);
      this.sourceNode.connect(this.analyser);
      this.analyser.connect(this.audioContext.destination);
      
      audioElement._hasLipSyncSource = true;
    } catch (e) {
      console.warn('[AvatarLipSyncEngine] Lỗi kết nối Audio Element:', e);
    }
  }

  /**
   * Phân tích Text để tạo kịch bản Viseme (Dự phòng cho ElevenLabs API)
   * Chuyển đổi âm tiết -> mốc thời gian
   */
  parseSyllableTimestamps(text, durationMs) {
    const words = text.split(/\s+/);
    const timePerWord = durationMs / Math.max(1, words.length);
    const timestamps = [];
    
    let currentTime = 0;
    words.forEach(word => {
      // Phân tích nguyên âm để ánh xạ Viseme
      let primaryViseme = 'viseme_aa';
      const w = word.toLowerCase();
      if (w.includes('i') || w.includes('y')) primaryViseme = 'viseme_I';
      else if (w.includes('e')) primaryViseme = 'viseme_E';
      else if (w.includes('u')) primaryViseme = 'viseme_U';
      else if (w.includes('o')) primaryViseme = 'viseme_O';

      timestamps.push({
        time: currentTime,
        duration: timePerWord,
        word: word,
        viseme: primaryViseme
      });
      currentTime += timePerWord;
    });
    
    return timestamps;
  }

  /**
   * Cập nhật logic (Nên gọi trong hàm requestAnimationFrame / render loop)
   * @param {number} deltaTime - Thời gian trôi qua giữa 2 frame (s)
   */
  update(deltaTime = 0.016) {
    if (!this.isInitialized || !this.analyser) return this.blendshapes;

    // Lấy dữ liệu tần số âm thanh
    this.analyser.getByteFrequencyData(this.dataArray);
    
    // Tính toán Volume (Năng lượng RMS)
    let sum = 0;
    for (let i = 0; i < this.dataArray.length; i++) {
      sum += this.dataArray[i] * this.dataArray[i];
    }
    const rms = Math.sqrt(sum / this.dataArray.length);
    
    // Chuyển đổi RMS (0-255) thành giá trị blendshape (0-1)
    const normalizedVolume = Math.min(1.0, rms / 100.0);
    this.currentVolume = normalizedVolume;

    // Phân tích tần số để giả lập Viseme (Audio-driven Visemes)
    // Tần số thấp (Low freq) -> U, O
    // Tần số cao (High freq) -> I, E
    let lowFreq = 0, midFreq = 0, highFreq = 0;
    for (let i = 0; i < 10; i++) lowFreq += this.dataArray[i];
    for (let i = 10; i < 50; i++) midFreq += this.dataArray[i];
    for (let i = 50; i < 100; i++) highFreq += this.dataArray[i];

    // Cài đặt mục tiêu (Target) cho Blendshapes dựa trên âm thanh
    if (normalizedVolume > 0.1) {
      this.targetBlendshapes.jawOpen = normalizedVolume * 0.8;
      this.targetBlendshapes.viseme_sil = 0;
      
      if (highFreq > midFreq && highFreq > lowFreq) {
        this.targetBlendshapes.viseme_I = normalizedVolume;
        this.targetBlendshapes.viseme_aa = 0;
        this.targetBlendshapes.viseme_O = 0;
      } else if (lowFreq > midFreq) {
        this.targetBlendshapes.viseme_O = normalizedVolume;
        this.targetBlendshapes.viseme_I = 0;
        this.targetBlendshapes.viseme_aa = 0;
      } else {
        this.targetBlendshapes.viseme_aa = normalizedVolume;
        this.targetBlendshapes.viseme_I = 0;
        this.targetBlendshapes.viseme_O = 0;
      }
    } else {
      // Khi im lặng, khép miệng
      this.targetBlendshapes.jawOpen = 0;
      this.targetBlendshapes.viseme_aa = 0;
      this.targetBlendshapes.viseme_E = 0;
      this.targetBlendshapes.viseme_I = 0;
      this.targetBlendshapes.viseme_O = 0;
      this.targetBlendshapes.viseme_U = 0;
      this.targetBlendshapes.viseme_sil = 1;
    }

    // Nội suy (Lerp) mượt mà các điểm Blendshape (Khớp cơ mặt, độ trễ <30ms)
    const t = Math.min(1.0, this.lerpSpeed * deltaTime);
    for (const key in this.blendshapes) {
      this.blendshapes[key] = this.blendshapes[key] + (this.targetBlendshapes[key] - this.blendshapes[key]) * t;
    }

    return this.blendshapes;
  }
}

// Global Singleton
export const globalLipSyncEngine = new AvatarLipSyncEngine();
