import React, { useState, useRef, useEffect } from 'react';
import { 
  Zap, MessageSquare, Mic, MicOff, Video, Play, Pause, Square, 
  Upload, RefreshCw, Volume2, VolumeX, Sparkles, Send, CheckCircle2, 
  Trash2, Clock, Info, AlertTriangle, X, Music, Film, Radio, Layers
} from 'lucide-react';

export default function QuickResponseModal({
  isOpen,
  onClose,
  isDarkMode = true,
  isConnected = false,
  audioPlayerRef,
  handleLiveEvent,
  onPlayLiveVideo,
  onStopLiveVideo,
  activeQuickVideo,
  showToast,
  addViewerHistory
}) {
  const [activeTab, setActiveTab] = useState('comment'); // 'comment' | 'voice' | 'video' | 'tts' | 'presets'
  
  // 1. STATE BÌNH LUẬN (COMMENT)
  const [commentName, setCommentName] = useState('Khách VIP');
  const [commentText, setCommentText] = useState('');
  const [commentMode, setCommentMode] = useState('ai'); // 'ai' (Gemini auto) | 'manual' (Director TTS)
  const [commentManualReply, setCommentManualReply] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // 2. STATE VOICE & THU ÂM (VOICE)
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedAudioBlob, setRecordedAudioBlob] = useState(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState(null);
  const [uploadedAudioFile, setUploadedAudioFile] = useState(null);
  const [uploadedAudioUrl, setUploadedAudioUrl] = useState(null);
  const [isPlayingAudioPreview, setIsPlayingAudioPreview] = useState(false);
  const [audioPreviewSrc, setAudioPreviewSrc] = useState(null);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);
  const audioPreviewRef = useRef(null);
  const audioFileInputRef = useRef(null);

  const getAudioPreview = () => {
    if (!audioPreviewRef.current && typeof window !== 'undefined' && typeof Audio !== 'undefined') {
      audioPreviewRef.current = new Audio();
    }
    return audioPreviewRef.current;
  };

  // 3. STATE VIDEO
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoName, setVideoName] = useState('');
  const [videoAudioMode, setVideoAudioMode] = useState('original'); // 'original' | 'tts' | 'mute'
  const [videoTtsScript, setVideoTtsScript] = useState('');
  const [videoLoop, setVideoLoop] = useState(false);
  const videoFileInputRef = useRef(null);

  // 4. STATE SOẠN TTS TỨC THÌ
  const [instantTtsText, setInstantTtsText] = useState('');
  const [isImmediatePriority, setIsImmediatePriority] = useState(true);

  // 5. LỊCH SỬ PHẢN HỒI GẦN ĐÂY
  const [recentActions, setRecentActions] = useState(() => {
    try {
      const saved = localStorage.getItem('aidol_quick_recent_actions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const logRecentAction = (action) => {
    const item = {
      id: Date.now(),
      time: new Date().toLocaleTimeString(),
      ...action
    };
    setRecentActions(prev => {
      const updated = [item, ...prev.slice(0, 9)];
      try {
        localStorage.setItem('aidol_quick_recent_actions', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Mẫu Comment gợi ý
  const PRESET_COMMENTS = [
    { label: 'Hỏi giá áo', text: 'Shop ơi mẫu này giá bao nhiêu tiền vậy ạ?' },
    { label: 'Tư vấn Size', text: 'Mình cao 1m65 nặng 58kg mặc size nào vừa vậy idol?' },
    { label: 'Mã Freeship', text: 'Hôm nay trên livestream có mã miễn phí ship không shop?' },
    { label: 'Khen Idol', text: 'Hôm nay idol xinh quá, giọng nói siêu cuốn luôn!' },
    { label: 'Đã chốt đơn', text: 'Em vừa chốt 2 đơn rồi nha shop, gửi sớm giúp em nhé!' },
    { label: 'Chất liệu vải', text: 'Chất vải này giặt máy có bị xù lông hay co giãn không shop?' }
  ];

  // Mẫu Kịch bản phản hồi TTS tức thì
  const PRESET_SCRIPTS = [
    {
      category: '🛍️ Giục Chốt Đơn / Flash Sale',
      items: [
        'Mọi người nhanh tay bấm vào giỏ hàng góc trái màn hình nhé, deal sốc này bên em chỉ còn đúng 5 suất ưu đãi cuối cùng thôi ạ!',
        'Dạ chỉ còn đúng 2 phút cuối cùng trước khi sản phẩm quay trở về giá gốc, các tình yêu tranh thủ chốt ngay nhé!',
        'Anh chị em đặt hàng nhớ bấm áp mã voucher giảm thêm 50k của shop ngay trong giỏ hàng để được giá tốt nhất nha!'
      ]
    },
    {
      category: '🎁 Cảm Ơn Quà Tặng & Follower',
      items: [
        'Em cảm ơn bạn đã gửi tặng hoa hồng cho em nhé! Chúc bạn và gia đình có một ngày thật nhiều niềm vui và may mắn!',
        'Cảm ơn cả nhà đã ghé xem livestream! Mọi người đừng quên nhấn follow kênh và thả tim giúp em lên 50.000 tim nha!',
        'Dạ em cảm ơn anh chị VIP đã ghé thăm phòng live hôm nay, chúc mọi người săn được thật nhiều deal hời ạ!'
      ]
    },
    {
      category: '👋 Chào Đón & Tương Tác',
      items: [
        'Dạ em chào tất cả anh chị mới vừa vào phòng live nha! Hôm nay shop em đang xả kho toàn bộ mã hot với giá sỉ cực sốc đó ạ!',
        'Mọi người đang quan tâm mẫu nào cứ bình luận chiều cao cân nặng xuống dưới, em sẽ tư vấn chọn size chuẩn chỉnh ngay cho mình nhé!'
      ]
    },
    {
      category: '⚠️ Nhắc Nhở & Xử Lý Sự Cố',
      items: [
        'Mọi người tương tác văn minh lịch sự giúp em nha, những bình luận spam hoặc tiêu cực hệ thống bên em sẽ tự động lọc bỏ ạ.',
        'Đường truyền mạng vừa được bên em ổn định lại rồi ạ, cảm ơn mọi người đã kiên nhẫn đồng hành cùng em trong phiên live nha!'
      ]
    }
  ];

  // Mẫu Voice Soundboard ngắn
  const VOICE_SOUNDBOARD = [
    { title: 'Chốt đơn thành công', text: 'Cảm ơn quý khách đã chốt đơn thành công! Shop sẽ đóng gói và gửi đi ngay hôm nay ạ.' },
    { title: 'Tặng kèm quà VIP', text: 'Duy nhất trên phiên live này, khách đặt hàng sẽ được tặng kèm phần quà VIP từ shop nha!' },
    { title: 'Kêu gọi thả tim', text: 'Cả nhà ơi bấm liên tục vào màn hình để thả tim giúp em tăng tương tác nha!' },
    { title: 'Số lượng có hạn', text: 'Mẫu này bên em hiện tại kho chỉ còn đúng 3 chiếc thôi, ai nhanh tay thì còn nha!' }
  ];

  // Dọn dẹp audio preview khi unmount
  useEffect(() => {
    const audioEl = audioPreviewRef.current;
    audioEl.onended = () => setIsPlayingAudioPreview(false);
    return () => {
      audioEl.pause();
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, []);

  if (!isOpen) return null;

  // --- 1. XỬ LÝ GỬI COMMENT ---
  const handleSendComment = async () => {
    if (!commentText.trim()) {
      showToast('Vui lòng nhập nội dung bình luận của người xem!', 'warn');
      return;
    }

    setIsSubmittingComment(true);
    const viewer = commentName.trim() || 'Khách xem live';
    const text = commentText.trim();

    try {
      if (commentMode === 'ai') {
        if (handleLiveEvent) {
          await handleLiveEvent('COMMENT', { name: viewer, text });
          showToast(`Đã gửi bình luận của "${viewer}" cho AI trả lời trực tiếp!`, 'success');
        } else {
          showToast('Chế độ Live chưa được khởi tạo!', 'warn');
        }
      } else {
        // Manual reply mode
        const reply = commentManualReply.trim() || `Dạ em chào ${viewer}, cảm ơn bạn đã quan tâm sản phẩm ạ!`;
        if (audioPlayerRef?.current) {
          audioPlayerRef.current.enqueueItem(reply, 'QUICK_COMMENT_REPLY', true);
        }
        if (addViewerHistory) {
          addViewerHistory({
            time: new Date().toLocaleTimeString(),
            type: 'COMMENT',
            payload: { name: viewer, text },
            ai_reply: reply
          });
        }
        showToast(`Đã phát câu trả lời cho "${viewer}" lên Live!`, 'success');
      }

      logRecentAction({
        type: 'COMMENT',
        title: `Phản hồi comment: ${viewer}`,
        detail: text
      });

      setCommentText('');
      setCommentManualReply('');
    } catch (err) {
      showToast('Lỗi gửi phản hồi comment: ' + err.message, 'error');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // --- 2. XỬ LÝ THU ÂM MICROPHONE ---
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedAudioBlob(blob);
        setRecordedAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } catch (err) {
      showToast('Không thể mở micro để thu âm: ' + err.message, 'error');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    }
  };

  const handleFileUploadAudio = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedAudioFile(file);
      setUploadedAudioUrl(url);
      showToast(`Đã chọn file âm thanh: ${file.name}`, 'info');
    }
  };

  const playAudioPreview = (src) => {
    if (!src) return;
    const aud = getAudioPreview();
    if (!aud) return;
    if (isPlayingAudioPreview) {
      aud.pause();
      setIsPlayingAudioPreview(false);
    } else {
      aud.src = src;
      aud.play().catch(e => console.warn('Audio preview error:', e));
      setAudioPreviewSrc(src);
      setIsPlayingAudioPreview(true);
    }
  };

  const sendVoiceToLive = (src, title) => {
    if (!src) return;
    if (audioPlayerRef?.current) {
      audioPlayerRef.current.playDirectAudio(src, () => {
        showToast('Đã phát xong bản ghi âm lên Live!', 'info');
      });
      showToast(`Đang phát "${title}" trực tiếp lên Live!`, 'success');
      logRecentAction({
        type: 'VOICE',
        title: `Phát Voice Live: ${title}`,
        detail: `Đã kích hoạt phát trực tiếp âm thanh`
      });
    } else {
      showToast('Không tìm thấy Audio Player!', 'error');
    }
  };

  // --- 3. XỬ LÝ VIDEO PHẢN HỒI ---
  const handleFileUploadVideo = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoFile(file);
      setVideoUrl(url);
      setVideoName(file.name);
      showToast(`Đã nạp video: ${file.name}`, 'info');
    }
  };

  const handleSendVideoToLive = () => {
    if (!videoUrl) {
      showToast('Vui lòng chọn video trước khi phát!', 'warn');
      return;
    }

    if (onPlayLiveVideo) {
      onPlayLiveVideo({
        url: videoUrl,
        name: videoName || 'Video Phản Hồi',
        muted: videoAudioMode === 'mute' || videoAudioMode === 'tts',
        loop: videoLoop,
        ttsScript: videoAudioMode === 'tts' ? videoTtsScript : null
      });

      // Nếu có kèm kịch bản TTS đọc đè lên video
      if (videoAudioMode === 'tts' && videoTtsScript.trim() && audioPlayerRef?.current) {
        audioPlayerRef.current.enqueueItem(videoTtsScript.trim(), 'VIDEO_OVERLAY_TTS', true);
      }

      showToast(`🚀 Đã chuyển màn hình Live sang Video: ${videoName}`, 'success');
      logRecentAction({
        type: 'VIDEO',
        title: `Phát Video: ${videoName}`,
        detail: `Chế độ tiếng: ${videoAudioMode === 'original' ? 'Tiếng gốc' : videoAudioMode === 'tts' ? 'Lồng tiếng TTS' : 'Tắt tiếng'}`
      });
    }
  };

  // --- 4. XỬ LÝ SOẠN LỜI NÓI TTS TỨC THÌ ---
  const handleSendInstantTTS = (textToSend = instantTtsText) => {
    const text = textToSend?.trim();
    if (!text) {
      showToast('Vui lòng nhập nội dung câu nói!', 'warn');
      return;
    }

    if (audioPlayerRef?.current) {
      audioPlayerRef.current.enqueueItem(text, 'INSTANT_DIRECTOR_TTS', isImmediatePriority);
      showToast(isImmediatePriority ? '⚡ Đã bắn lời nói chen ngang ngay lập tức!' : '➕ Đã thêm câu nói vào hàng đợi!', 'success');
      logRecentAction({
        type: 'TTS',
        title: 'Lời nói tức thì (TTS)',
        detail: text
      });
      setInstantTtsText('');
    } else {
      showToast('Audio Player chưa sẵn sàng!', 'error');
    }
  };

  // Dừng mọi phản hồi khẩn cấp
  const handleEmergencyStop = () => {
    if (audioPlayerRef?.current) {
      audioPlayerRef.current.stopCurrent();
    }
    if (onStopLiveVideo) {
      onStopLiveVideo();
    }
    if (isPlayingAudioPreview) {
      audioPreviewRef.current.pause();
      setIsPlayingAudioPreview(false);
    }
    showToast('⏹️ Đã dừng khẩn cấp toàn bộ video & âm thanh phản hồi!', 'warn');
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className={`w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl border ${
        isDarkMode ? 'bg-[#16161f] border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
      }`}>
        
        {/* HEADER */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${
          isDarkMode ? 'bg-[#1c1c28] border-gray-800' : 'bg-gray-100 border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-orange-500/20">
              <Zap size={22} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-wide">TRUNG TÂM PHẢN HỒI NHANH TRỰC TIẾP</h2>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 ${
                  isConnected 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                }`}>
                  <Radio size={10} className={isConnected ? 'animate-ping' : ''} />
                  {isConnected ? 'LIVE ACTIVE' : 'CHẾ ĐỘ SẴN SÀNG'}
                </span>
              </div>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Bắn video, phản hồi bình luận, phát giọng nói thu âm & kịch bản tức thì lên phiên Live
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={handleEmergencyStop}
              className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/40 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
              title="Dừng ngay lập tức mọi âm thanh và video phản hồi đang phát"
            >
              <Square size={13} fill="currentColor" /> DỪNG KHẨN CẤP
            </button>
            <button 
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode ? 'hover:bg-gray-800 text-gray-400 hover:text-white' : 'hover:bg-gray-200 text-gray-600'
              }`}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* ACTIVE OVERRIDE BANNER */}
        {activeQuickVideo && (
          <div className="bg-amber-500/10 border-b border-amber-500/30 px-6 py-2 flex items-center justify-between text-xs text-amber-400 font-medium">
            <span className="flex items-center gap-2">
              <Film size={14} className="animate-spin" />
              Đang phát Video đè màn hình Live: <strong>{activeQuickVideo.name}</strong>
            </span>
            <button 
              onClick={onStopLiveVideo}
              className="px-2 py-0.5 bg-amber-500/20 hover:bg-amber-500/40 rounded text-amber-300 font-bold"
            >
              Thu hồi Video
            </button>
          </div>
        )}

        {/* TAB NAVIGATION */}
        <div className={`flex border-b px-6 pt-3 gap-2 shrink-0 ${isDarkMode ? 'border-gray-800 bg-[#121219]' : 'border-gray-200 bg-gray-50'}`}>
          <button
            onClick={() => setActiveTab('comment')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-bold text-xs transition-all border-b-2 ${
              activeTab === 'comment'
                ? 'border-blue-500 text-blue-400 bg-blue-500/10'
                : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-white/5'
            }`}
          >
            <MessageSquare size={15} /> Phản Hồi Comment
          </button>
          <button
            onClick={() => setActiveTab('voice')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-bold text-xs transition-all border-b-2 ${
              activeTab === 'voice'
                ? 'border-purple-500 text-purple-400 bg-purple-500/10'
                : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-white/5'
            }`}
          >
            <Mic size={15} /> Voice & Thu Âm
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-bold text-xs transition-all border-b-2 ${
              activeTab === 'video'
                ? 'border-pink-500 text-pink-400 bg-pink-500/10'
                : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-white/5'
            }`}
          >
            <Video size={15} /> Tải Video Live
          </button>
          <button
            onClick={() => setActiveTab('tts')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-bold text-xs transition-all border-b-2 ${
              activeTab === 'tts'
                ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-white/5'
            }`}
          >
            <Zap size={15} /> Soạn Lời Nói Tức Thì
          </button>
          <button
            onClick={() => setActiveTab('presets')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-bold text-xs transition-all border-b-2 ${
              activeTab === 'presets'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-white/5'
            }`}
          >
            <Layers size={15} /> Mẫu Kịch Bản 1-Chạm
          </button>
        </div>

        {/* TAB BODY CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* ==================== TAB 1: COMMENT ==================== */}
          {activeTab === 'comment' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-400 mb-1.5 block">Tên người xem bình luận:</label>
                  <input
                    type="text"
                    value={commentName}
                    onChange={(e) => setCommentName(e.target.value)}
                    placeholder="VD: Nguyễn Thảo, Khách VIP..."
                    className={`w-full px-3 py-2 rounded-xl text-sm border outline-none ${
                      isDarkMode ? 'bg-[#1e1e2d] border-gray-700 focus:border-blue-500' : 'bg-white border-gray-300'
                    }`}
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {['Mai Trang 🌸', 'Khách VIP 💎', 'Hùng Store 🛒', 'Thanh Nhàn ⭐'].map(n => (
                      <button
                        key={n}
                        onClick={() => setCommentName(n)}
                        className={`text-[11px] px-2 py-0.5 rounded-md border ${
                          isDarkMode ? 'bg-gray-800/60 border-gray-700 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-gray-400 mb-1.5 block">Chế độ phản hồi của Idol:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setCommentMode('ai')}
                      className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                        commentMode === 'ai'
                          ? 'bg-blue-600/20 border-blue-500 text-blue-300 shadow-md shadow-blue-500/10'
                          : isDarkMode ? 'bg-[#1a1a24] border-gray-800 text-gray-400 hover:border-gray-700' : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <Sparkles size={18} className={commentMode === 'ai' ? 'text-blue-400 shrink-0 mt-0.5' : 'text-gray-500 shrink-0 mt-0.5'} />
                      <div>
                        <div className="text-xs font-bold text-white">AI Gemini Tự Trả Lời</div>
                        <div className="text-[10px] text-gray-400 mt-0.5">AI tự phân tích câu hỏi & trả lời bằng giọng nói chuẩn idol</div>
                      </div>
                    </button>

                    <button
                      onClick={() => setCommentMode('manual')}
                      className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                        commentMode === 'manual'
                          ? 'bg-purple-600/20 border-purple-500 text-purple-300 shadow-md shadow-purple-500/10'
                          : isDarkMode ? 'bg-[#1a1a24] border-gray-800 text-gray-400 hover:border-gray-700' : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <MessageSquare size={18} className={commentMode === 'manual' ? 'text-purple-400 shrink-0 mt-0.5' : 'text-gray-500 shrink-0 mt-0.5'} />
                      <div>
                        <div className="text-xs font-bold text-white">Đạo Diễn Soạn Lời Trả Lời</div>
                        <div className="text-[10px] text-gray-400 mt-0.5">Tự tay gõ câu trả lời chính xác để idol đọc lên live</div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-400 mb-1.5 block">Nội dung bình luận của khách hàng:</label>
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Nhập nội dung khách hàng vừa hỏi trên live (VD: Shop ơi mẫu này còn size L không?)..."
                  className={`w-full h-24 p-3 rounded-xl text-sm border outline-none resize-none ${
                    isDarkMode ? 'bg-[#1e1e2d] border-gray-700 focus:border-blue-500' : 'bg-white border-gray-300'
                  }`}
                />
              </div>

              {/* Mẫu comment nhanh */}
              <div>
                <div className="text-[11px] font-semibold text-gray-400 mb-1.5">Mẫu câu hỏi khách thường gặp (Bấm để điền nhanh):</div>
                <div className="flex flex-wrap gap-2">
                  {PRESET_COMMENTS.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCommentText(preset.text)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                        commentText === preset.text
                          ? 'bg-blue-600 text-white border-blue-500 font-bold'
                          : isDarkMode ? 'bg-[#1e1e2d] border-gray-700 text-gray-300 hover:border-gray-600' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {commentMode === 'manual' && (
                <div className="p-4 rounded-xl border border-purple-500/30 bg-purple-950/20 space-y-2">
                  <label className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                    <Mic size={14} /> Câu trả lời Đạo diễn muốn Idol đọc lên live:
                  </label>
                  <textarea
                    value={commentManualReply}
                    onChange={(e) => setCommentManualReply(e.target.value)}
                    placeholder="VD: Dạ em chào bạn, mẫu này bên em chuẩn form, bạn mặc size L là siêu tôn dáng luôn nha!"
                    className={`w-full h-20 p-2.5 rounded-lg text-sm border outline-none resize-none ${
                      isDarkMode ? 'bg-[#12121a] border-purple-800 text-white' : 'bg-white border-purple-300'
                    }`}
                  />
                </div>
              )}

              <button
                disabled={isSubmittingComment}
                onClick={handleSendComment}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isSubmittingComment ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" /> ĐANG XỬ LÝ PHẢN HỒI...
                  </>
                ) : (
                  <>
                    <Send size={16} /> BẮN PHẢN HỒI COMMENT LÊN LIVE NGAY ⚡
                  </>
                )}
              </button>
            </div>
          )}

          {/* ==================== TAB 2: VOICE & THU ÂM ==================== */}
          {activeTab === 'voice' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* 2.1 Thu âm Micro trực tiếp */}
                <div className={`p-5 rounded-2xl border flex flex-col justify-between ${
                  isDarkMode ? 'bg-[#1a1a24] border-gray-800' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`p-2 rounded-lg ${isRecording ? 'bg-red-600 text-white animate-pulse' : 'bg-purple-600/20 text-purple-400'}`}>
                        <Mic size={18} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold">Thu Âm Trực Tiếp Qua Micro</h3>
                        <p className="text-[11px] text-gray-400">Nói trực tiếp để phát giọng của bạn lên phiên Live</p>
                      </div>
                    </div>

                    <div className="my-5 flex flex-col items-center justify-center p-4 rounded-xl bg-black/30 border border-white/5">
                      {isRecording ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-full bg-red-500 animate-ping"></span>
                            <span className="text-lg font-mono font-bold text-red-400">
                              00:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds}
                            </span>
                          </div>
                          <span className="text-xs text-gray-400 animate-pulse">Đang thu âm giọng nói của bạn...</span>
                        </div>
                      ) : recordedAudioUrl ? (
                        <div className="flex flex-col items-center gap-2 w-full">
                          <div className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 size={14} /> Bản thu đã sẵn sàng!
                          </div>
                          <div className="flex items-center gap-2 w-full justify-center">
                            <button
                              onClick={() => playAudioPreview(recordedAudioUrl)}
                              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold flex items-center gap-1.5"
                            >
                              {isPlayingAudioPreview && audioPreviewSrc === recordedAudioUrl ? <Pause size={13} /> : <Play size={13} />}
                              Nghe lại
                            </button>
                            <button
                              onClick={() => { setRecordedAudioBlob(null); setRecordedAudioUrl(null); }}
                              className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-xs font-bold"
                            >
                              Thu lại
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-gray-500 text-center py-2">
                          Bấm nút bên dưới để bắt đầu thu âm
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {isRecording ? (
                      <button
                        onClick={stopRecording}
                        className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
                      >
                        <Square size={14} fill="currentColor" /> DỪNG THU ÂM
                      </button>
                    ) : (
                      <button
                        onClick={startRecording}
                        className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
                      >
                        <Mic size={14} /> BẮT ĐẦU THU ÂM
                      </button>
                    )}

                    {recordedAudioUrl && !isRecording && (
                      <button
                        onClick={() => sendVoiceToLive(recordedAudioUrl, 'Bản thu âm Micro')}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                      >
                        <Send size={14} /> PHÁT BẢN THU LÊN LIVE NGAY 🚀
                      </button>
                    )}
                  </div>
                </div>

                {/* 2.2 Tải file âm thanh có sẵn */}
                <div className={`p-5 rounded-2xl border flex flex-col justify-between ${
                  isDarkMode ? 'bg-[#1a1a24] border-gray-800' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400">
                        <Upload size={18} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold">Tải File Giọng Nói / Audio</h3>
                        <p className="text-[11px] text-gray-400">Hỗ trợ file MP3, WAV, M4A, OGG có sẵn</p>
                      </div>
                    </div>

                    <div 
                      onClick={() => audioFileInputRef.current?.click()}
                      className="my-5 cursor-pointer flex flex-col items-center justify-center p-5 rounded-xl border-2 border-dashed border-gray-700 hover:border-blue-500 bg-black/20 hover:bg-blue-500/5 transition-all text-center"
                    >
                      <Music size={28} className="text-blue-400 mb-2" />
                      <span className="text-xs font-bold text-gray-300">
                        {uploadedAudioFile ? uploadedAudioFile.name : 'Bấm để chọn file âm thanh từ máy'}
                      </span>
                      <span className="text-[10px] text-gray-500 mt-1">
                        {uploadedAudioFile ? `${(uploadedAudioFile.size / 1024 / 1024).toFixed(2)} MB` : 'Dung lượng tối đa 20MB'}
                      </span>
                      <input 
                        ref={audioFileInputRef}
                        type="file" 
                        accept="audio/*" 
                        className="hidden" 
                        onChange={handleFileUploadAudio} 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    {uploadedAudioUrl && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => playAudioPreview(uploadedAudioUrl)}
                          className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                        >
                          {isPlayingAudioPreview && audioPreviewSrc === uploadedAudioUrl ? <Pause size={13} /> : <Play size={13} />}
                          Nghe thử file
                        </button>
                        <button
                          onClick={() => { setUploadedAudioFile(null); setUploadedAudioUrl(null); }}
                          className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}

                    <button
                      disabled={!uploadedAudioUrl}
                      onClick={() => sendVoiceToLive(uploadedAudioUrl, uploadedAudioFile?.name || 'File Audio')}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                    >
                      <Send size={14} /> PHÁT FILE AUDIO NÀY LÊN LIVE ⚡
                    </button>
                  </div>
                </div>

              </div>

              {/* Mẫu Voice Soundboard */}
              <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-[#14141d] border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                <div className="text-xs font-bold text-gray-300 mb-3 flex items-center gap-1.5">
                  <Volume2 size={14} className="text-amber-400" /> Thư viện câu Voice mẫu chốt đơn & tương tác:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {VOICE_SOUNDBOARD.map((item, idx) => (
                    <div 
                      key={idx}
                      className={`p-3 rounded-lg border flex items-center justify-between gap-3 ${
                        isDarkMode ? 'bg-[#1b1b26] border-gray-800 hover:border-gray-700' : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-white truncate">{item.title}</div>
                        <div className="text-[11px] text-gray-400 line-clamp-1">{item.text}</div>
                      </div>
                      <button
                        onClick={() => handleSendInstantTTS(item.text)}
                        className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs rounded-lg shrink-0 flex items-center gap-1"
                        title="Bắn câu nói này lên Live ngay"
                      >
                        <Zap size={12} fill="currentColor" /> Bắn Live
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==================== TAB 3: TẢI VIDEO LIVE ==================== */}
          {activeTab === 'video' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Khu vực Upload & Preview Video */}
                <div>
                  <label className="text-xs font-semibold text-gray-400 mb-1.5 block">File Video phản hồi khẩn cấp:</label>
                  <div
                    onClick={() => videoFileInputRef.current?.click()}
                    className="cursor-pointer border-2 border-dashed border-gray-700 hover:border-pink-500 rounded-2xl p-4 bg-black/30 hover:bg-pink-500/5 transition-all text-center flex flex-col items-center justify-center min-h-[180px]"
                  >
                    {videoUrl ? (
                      <div className="w-full">
                        <video src={videoUrl} className="w-full h-36 object-contain rounded-lg bg-black mb-2" controls />
                        <div className="text-xs font-bold text-pink-400 truncate">{videoName}</div>
                      </div>
                    ) : (
                      <>
                        <Video size={36} className="text-pink-400 mb-2" />
                        <span className="text-xs font-bold text-gray-300">Chọn file Video từ máy tính</span>
                        <span className="text-[10px] text-gray-500 mt-1">Hỗ trợ MP4, WebM, MOV</span>
                      </>
                    )}
                    <input 
                      ref={videoFileInputRef}
                      type="file" 
                      accept="video/*" 
                      className="hidden" 
                      onChange={handleFileUploadVideo} 
                    />
                  </div>
                </div>

                {/* Cấu hình Âm thanh & Lặp lại cho Video */}
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-400 mb-1.5 block">Chế độ âm thanh khi phát Video:</label>
                    <div className="space-y-2">
                      <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        videoAudioMode === 'original'
                          ? 'bg-pink-600/20 border-pink-500 text-white'
                          : isDarkMode ? 'bg-[#1a1a24] border-gray-800 text-gray-400' : 'bg-gray-50 border-gray-200'
                      }`}>
                        <input 
                          type="radio" 
                          name="video_audio" 
                          checked={videoAudioMode === 'original'} 
                          onChange={() => setVideoAudioMode('original')}
                          className="w-4 h-4 text-pink-600"
                        />
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-1.5">
                            <Volume2 size={14} className="text-pink-400" /> Phát âm thanh gốc của Video
                          </div>
                          <div className="text-[10px] text-gray-400">Giữ nguyên tiếng nói / âm thanh trong video tải lên</div>
                        </div>
                      </label>

                      <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        videoAudioMode === 'tts'
                          ? 'bg-purple-600/20 border-purple-500 text-white'
                          : isDarkMode ? 'bg-[#1a1a24] border-gray-800 text-gray-400' : 'bg-gray-50 border-gray-200'
                      }`}>
                        <input 
                          type="radio" 
                          name="video_audio" 
                          checked={videoAudioMode === 'tts'} 
                          onChange={() => setVideoAudioMode('tts')}
                          className="w-4 h-4 text-purple-600"
                        />
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-1.5">
                            <Mic size={14} className="text-purple-400" /> Tắt tiếng video & Cho AI đọc kịch bản lồng tiếng
                          </div>
                          <div className="text-[10px] text-gray-400">Video đóng vai trò hình nền minh hoạ, AI đọc kịch bản bên dưới</div>
                        </div>
                      </label>

                      <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        videoAudioMode === 'mute'
                          ? 'bg-gray-600/20 border-gray-500 text-white'
                          : isDarkMode ? 'bg-[#1a1a24] border-gray-800 text-gray-400' : 'bg-gray-50 border-gray-200'
                      }`}>
                        <input 
                          type="radio" 
                          name="video_audio" 
                          checked={videoAudioMode === 'mute'} 
                          onChange={() => setVideoAudioMode('mute')}
                          className="w-4 h-4 text-gray-400"
                        />
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-1.5">
                            <VolumeX size={14} className="text-gray-400" /> Tắt hoàn toàn âm thanh (Phát hình câm)
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer pt-1">
                    <input 
                      type="checkbox"
                      checked={videoLoop}
                      onChange={(e) => setVideoLoop(e.target.checked)}
                      className="w-4 h-4 rounded text-pink-600"
                    />
                    <span className="text-xs font-semibold text-gray-300">
                      Lặp lại Video liên tục (nếu tắt, video phát xong 1 lần sẽ tự về lại Idol)
                    </span>
                  </label>
                </div>
              </div>

              {videoAudioMode === 'tts' && (
                <div className="p-4 rounded-xl border border-purple-500/30 bg-purple-950/20 space-y-2">
                  <label className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                    <Mic size={14} /> Soạn câu AI đọc khi Video đang phát:
                  </label>
                  <textarea
                    value={videoTtsScript}
                    onChange={(e) => setVideoTtsScript(e.target.value)}
                    placeholder="VD: Mọi người xem cận cảnh chất vải trên video nhé, siêu mềm mịn và co giãn cực tốt luôn ạ..."
                    className={`w-full h-20 p-2.5 rounded-lg text-sm border outline-none resize-none ${
                      isDarkMode ? 'bg-[#12121a] border-purple-800 text-white' : 'bg-white border-purple-300'
                    }`}
                  />
                </div>
              )}

              <div className="flex gap-3">
                <button
                  disabled={!videoUrl}
                  onClick={handleSendVideoToLive}
                  className="flex-1 py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 disabled:opacity-40 text-white rounded-xl font-bold text-sm shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2"
                >
                  <Send size={16} /> PHÁT VIDEO NÀY LÊN MÀN HÌNH LIVE NGAY 🚀
                </button>

                {activeQuickVideo && (
                  <button
                    onClick={onStopLiveVideo}
                    className="px-5 py-3 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/40 rounded-xl font-bold text-sm"
                  >
                    Dừng Video Khẩn Cấp
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ==================== TAB 4: SOẠN LỜI NÓI TỨC THÌ ==================== */}
          {activeTab === 'tts' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-gray-400">
                    Nhập nội dung văn bản để AI nói ngay trên Live:
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-amber-400 cursor-pointer font-bold">
                    <input 
                      type="checkbox"
                      checked={isImmediatePriority}
                      onChange={(e) => setIsImmediatePriority(e.target.checked)}
                      className="w-3.5 h-3.5"
                    />
                    <span>⚡ Chen ngang lập tức (Ưu tiên cao nhất)</span>
                  </label>
                </div>
                <textarea
                  value={instantTtsText}
                  onChange={(e) => setInstantTtsText(e.target.value)}
                  placeholder="Gõ bất kỳ câu thoại nào bạn muốn Idol nói trên phiên live (VD: Cảm ơn bạn Hoàng Long đã chốt đơn 2 áo thun nha!)..."
                  className={`w-full h-36 p-3 rounded-xl text-sm border outline-none resize-none ${
                    isDarkMode ? 'bg-[#1e1e2d] border-gray-700 focus:border-amber-500' : 'bg-white border-gray-300'
                  }`}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleSendInstantTTS(instantTtsText)}
                  className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-extrabold rounded-xl text-sm shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
                >
                  <Zap size={16} fill="currentColor" /> PHÁT LỜI NÓI LÊN LIVE NGAY ⚡
                </button>
                <button
                  onClick={() => {
                    setIsImmediatePriority(false);
                    handleSendInstantTTS(instantTtsText);
                  }}
                  className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-xs"
                >
                  ➕ Thêm vào hàng đợi
                </button>
              </div>
            </div>
          )}

          {/* ==================== TAB 5: MẪU KỊCH BẢN 1-CHẠM ==================== */}
          {activeTab === 'presets' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <p className="text-xs text-gray-400">
                Bấm nút <strong>"Phát Ngay"</strong> tại bất kỳ kịch bản nào bên dưới để Idol lập tức phát biểu câu đó trên Live:
              </p>

              <div className="space-y-4">
                {PRESET_SCRIPTS.map((cat, cIdx) => (
                  <div 
                    key={cIdx}
                    className={`p-4 rounded-xl border ${
                      isDarkMode ? 'bg-[#181822] border-gray-800' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <h4 className="text-xs font-bold text-emerald-400 mb-2.5 uppercase tracking-wider flex items-center gap-1.5">
                      {cat.category}
                    </h4>
                    <div className="space-y-2">
                      {cat.items.map((text, sIdx) => (
                        <div
                          key={sIdx}
                          className={`p-3 rounded-lg border flex items-center justify-between gap-3 ${
                            isDarkMode ? 'bg-[#20202e] border-gray-700/60 hover:border-gray-600' : 'bg-white border-gray-200'
                          }`}
                        >
                          <div className="text-xs text-gray-300 leading-relaxed flex-1">
                            "{text}"
                          </div>
                          <button
                            onClick={() => handleSendInstantTTS(text)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shrink-0 flex items-center gap-1 shadow-md shadow-emerald-600/20"
                          >
                            <Zap size={12} fill="currentColor" /> Phát Ngay
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* FOOTER: NHẬT KÝ PHẢN HỒI GẦN ĐÂY */}
        <div className={`px-6 py-3 border-t flex items-center justify-between ${
          isDarkMode ? 'bg-[#14141d] border-gray-800' : 'bg-gray-100 border-gray-200'
        }`}>
          <div className="flex items-center gap-2 overflow-x-auto text-[11px] text-gray-400 py-1">
            <span className="font-bold text-gray-300 shrink-0 flex items-center gap-1">
              <Clock size={12} /> Vừa gửi gần đây:
            </span>
            {recentActions.length === 0 ? (
              <span className="italic text-gray-500">Chưa có phản hồi nào trong phiên</span>
            ) : (
              recentActions.slice(0, 3).map((act) => (
                <span 
                  key={act.id} 
                  className={`px-2 py-0.5 rounded border shrink-0 ${
                    isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-white border-gray-300 text-gray-700'
                  }`}
                >
                  [{act.time}] {act.title}
                </span>
              ))
            )}
          </div>

          <div className="shrink-0 pl-4">
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs font-bold rounded-lg transition-colors"
            >
              Đóng lại
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
