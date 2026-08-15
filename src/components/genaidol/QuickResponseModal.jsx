import React, { useState, useRef, useEffect } from 'react';
import { 
  Zap, MessageSquare, Mic, MicOff, Video, Play, Pause, Square, 
  Upload, RefreshCw, Volume2, VolumeX, Sparkles, Send, CheckCircle2, 
  Trash2, Clock, Info, AlertTriangle, X, Music, Film, Radio, Layers,
  Edit3, Plus, Save, RotateCcw, Copy, Search, Settings2, ShieldCheck,
  UserCheck, UserX, ChevronDown, Check
} from 'lucide-react';
import { 
  getDualVoiceConfig, 
  saveDualVoiceConfig, 
  CURATED_VOICES, 
  previewVoiceAudio 
} from '../../utils/voiceSyncService';

// Mẫu Comment gợi ý gốc
const DEFAULT_COMMENTS = [
  { label: 'Hỏi giá áo', text: 'Shop ơi mẫu này giá bao nhiêu tiền vậy ạ?' },
  { label: 'Tư vấn Size', text: 'Mình cao 1m65 nặng 58kg mặc size nào vừa vậy idol?' },
  { label: 'Mã Freeship', text: 'Hôm nay trên livestream có mã miễn phí ship không shop?' },
  { label: 'Khen Idol', text: 'Hôm nay idol xinh quá, giọng nói siêu cuốn luôn!' },
  { label: 'Đã chốt đơn', text: 'Em vừa chốt 2 đơn rồi nha shop, gửi sớm giúp em nhé!' },
  { label: 'Chất liệu vải', text: 'Chất vải này giặt máy có bị xù lông hay co giãn không shop?' }
];

// Mẫu Kịch bản phản hồi TTS tức thì gốc
const DEFAULT_SCRIPTS = [
  {
    category: '🛍️ Giục Chốt Đơn / Flash Sale',
    items: [
      'Mọi người nhanh tay bấm vào giỏ hàng góc trái màn hình nhé, deal sốc này bên em chỉ còn đúng 5 suất ưu đãi cuối cùng thôi ạ!',
      'Dạ chỉ còn đúng 2 phút cuối cùng trước khi sản phẩm quay trở về giá gốc, các tình yêu tranh thủ chốt ngay nhé!',
      'Anh chị em đặt hàng nhớ bấm áp mã voucher giảm thêm 50k của shop ngay trong giỏ hàng để được giá tốt nhất nha!',
      'Kho vừa báo về chỉ còn đúng 3 bộ duy nhất cho size L, ai bấm mua trước em ưu tiên xuất kho trước nha!'
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
    category: '👋 Chào Đón & Tư Vấn Khách Hàng',
    items: [
      'Dạ em chào tất cả anh chị mới vừa vào phòng live nha! Hôm nay shop em đang xả kho toàn bộ mã hot với giá sỉ cực sốc đó ạ!',
      'Mọi người đang quan tâm mẫu nào cứ bình luận chiều cao cân nặng xuống dưới, em sẽ tư vấn chọn size chuẩn chỉnh ngay cho mình nhé!',
      'Sản phẩm bên em cam kết bảo hành 12 tháng, lỗi 1 đổi 1 tận nhà hoàn toàn miễn phí nên mọi người yên tâm đặt hàng nha!'
    ]
  },
  {
    category: '⚠️ Nhắc Nhở & Xử Lý Khẩn Cấp',
    items: [
      'Mọi người tương tác văn minh lịch sự giúp em nha, những bình luận spam hoặc tiêu cực hệ thống bên em sẽ tự động lọc bỏ ạ.',
      'Đường truyền mạng vừa được bên em ổn định lại rồi ạ, cảm ơn mọi người đã kiên nhẫn đồng hành cùng em trong phiên live nha!',
      'Lưu ý mọi người chỉ đặt hàng qua giỏ hàng chính thức trên livestream để tránh trường hợp bị lừa đảo giả mạo shop ạ!'
    ]
  }
];

// Mẫu Voice Soundboard gốc
const DEFAULT_SOUNDBOARD = [
  { title: 'Chốt đơn thành công', text: 'Cảm ơn quý khách đã chốt đơn thành công! Shop sẽ đóng gói và gửi đi ngay hôm nay ạ.' },
  { title: 'Tặng kèm quà VIP', text: 'Duy nhất trên phiên live này, khách đặt hàng sẽ được tặng kèm phần quà VIP từ shop nha!' },
  { title: 'Kêu gọi thả tim', text: 'Cả nhà ơi bấm liên tục vào màn hình để thả tim giúp em tăng tương tác nha!' },
  { title: 'Số lượng có hạn', text: 'Mẫu này bên em hiện tại kho chỉ còn đúng 3 chiếc thôi, ai nhanh tay thì còn nha!' },
  { title: 'Freeship toàn quốc', text: 'Duy nhất trong 10 phút tới, shop em hỗ trợ miễn phí vận chuyển toàn quốc cho tất cả đơn hàng!' },
  { title: 'Bảo hành 1 đổi 1', text: 'Cam kết hàng chính hãng 100%, nhận hàng kiểm tra ưng ý mới thanh toán ạ!' }
];

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
  
  // ==================== HỆ THỐNG ĐỒNG BỘ 2 GIỌNG VOICE ====================
  // voiceChannel: 'manager' (Voice Quản lý / Thiết bị / Trợ lý) | 'idol' (Voice Idol trực tiếp)
  const [selectedVoiceChannel, setSelectedVoiceChannel] = useState('manager');
  const [voiceConfig, setVoiceConfig] = useState(() => getDualVoiceConfig());
  const [showVoiceConfigModal, setShowVoiceConfigModal] = useState(false);

  // Lắng nghe thay đổi giọng từ các component khác
  useEffect(() => {
    const handleVoiceSync = (e) => {
      if (e.detail) setVoiceConfig(e.detail);
      else setVoiceConfig(getDualVoiceConfig());
    };
    window.addEventListener('aidol_voice_sync_updated', handleVoiceSync);
    return () => window.removeEventListener('aidol_voice_sync_updated', handleVoiceSync);
  }, []);

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

  // 5. ==================== STATE MẪU KỊCH BẢN 1-CHẠM (EDITABLE) ====================
  const [presetScripts, setPresetScripts] = useState(() => {
    try {
      const saved = localStorage.getItem('aidol_custom_preset_scripts');
      return saved ? JSON.parse(saved) : DEFAULT_SCRIPTS;
    } catch {
      return DEFAULT_SCRIPTS;
    }
  });

  const [scriptSearchTerm, setScriptSearchTerm] = useState('');
  const [editingItemLocation, setEditingItemLocation] = useState(null); // { catIdx, itemIdx }
  const [editingItemText, setEditingItemText] = useState('');
  const [editingCategoryIdx, setEditingCategoryIdx] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');
  const [addingToCategoryIdx, setAddingToCategoryIdx] = useState(null);
  const [newScriptText, setNewScriptText] = useState('');
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [newCategoryTitle, setNewCategoryTitle] = useState('');

  // Lưu kịch bản mẫu mỗi khi thay đổi
  const saveScriptsToStorage = (updated) => {
    setPresetScripts(updated);
    try {
      localStorage.setItem('aidol_custom_preset_scripts', JSON.stringify(updated));
    } catch (e) {
      console.warn('Lỗi lưu kịch bản mẫu vào localStorage:', e);
    }
  };

  // 6. ==================== STATE VOICE SOUNDBOARD (EDITABLE) ====================
  const [soundboardList, setSoundboardList] = useState(() => {
    try {
      const saved = localStorage.getItem('aidol_custom_voice_soundboard');
      return saved ? JSON.parse(saved) : DEFAULT_SOUNDBOARD;
    } catch {
      return DEFAULT_SOUNDBOARD;
    }
  });
  const [editingSoundboardIdx, setEditingSoundboardIdx] = useState(null);
  const [editingSoundboardTitle, setEditingSoundboardTitle] = useState('');
  const [editingSoundboardText, setEditingSoundboardText] = useState('');
  const [isAddingSoundboard, setIsAddingSoundboard] = useState(false);
  const [newSoundboardTitle, setNewSoundboardTitle] = useState('');
  const [newSoundboardText, setNewSoundboardText] = useState('');

  const saveSoundboardToStorage = (updated) => {
    setSoundboardList(updated);
    try {
      localStorage.setItem('aidol_custom_voice_soundboard', JSON.stringify(updated));
    } catch (e) {
      console.warn('Lỗi lưu soundboard vào localStorage:', e);
    }
  };

  // 7. LỊCH SỬ PHẢN HỒI GẦN ĐÂY
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
      voiceChannel: selectedVoiceChannel,
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

  // Dọn dẹp audio preview khi unmount
  useEffect(() => {
    return () => {
      const audioEl = audioPreviewRef.current;
      if (audioEl) {
        audioEl.pause();
      }
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
          audioPlayerRef.current.enqueueItem(reply, 'QUICK_COMMENT_REPLY', true, { voiceChannel: selectedVoiceChannel });
        }
        if (addViewerHistory) {
          addViewerHistory({
            time: new Date().toLocaleTimeString(),
            type: 'COMMENT',
            payload: { name: viewer, text },
            ai_reply: reply
          });
        }
        showToast(`Đã phát câu trả lời (${selectedVoiceChannel === 'manager' ? 'Giọng Quản Lý' : 'Giọng Idol'}) cho "${viewer}" lên Live!`, 'success');
      }

      logRecentAction({
        type: 'COMMENT',
        title: `Phản hồi comment: ${viewer} [${selectedVoiceChannel === 'manager' ? 'Quản lý' : 'Idol'}]`,
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
      aud.onended = () => setIsPlayingAudioPreview(false);
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
        audioPlayerRef.current.enqueueItem(videoTtsScript.trim(), 'VIDEO_OVERLAY_TTS', true, { voiceChannel: selectedVoiceChannel });
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
  const handleSendInstantTTS = (textToSend = instantTtsText, channelOverride = selectedVoiceChannel) => {
    const text = textToSend?.trim();
    if (!text) {
      showToast('Vui lòng nhập nội dung câu nói!', 'warn');
      return;
    }

    if (audioPlayerRef?.current) {
      const channel = channelOverride || selectedVoiceChannel;
      audioPlayerRef.current.enqueueItem(text, 'INSTANT_DIRECTOR_TTS', isImmediatePriority, { voiceChannel: channel });
      
      const channelLabel = channel === 'manager' ? 'Giọng Quản Lý / Trợ Lý' : 'Giọng Idol Trực Tiếp';
      showToast(
        isImmediatePriority 
          ? `⚡ Đã bắn lời nói (${channelLabel}) chen ngang ngay lập tức!` 
          : `➕ Đã thêm vào hàng đợi (${channelLabel})!`, 
        'success'
      );
      
      logRecentAction({
        type: 'TTS',
        title: `TTS [${channel === 'manager' ? 'Quản lý' : 'Idol'}]: ${text.slice(0, 30)}...`,
        detail: text
      });
      
      if (textToSend === instantTtsText) {
        setInstantTtsText('');
      }
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

  // --- 5. QUẢN LÝ MẪU KỊCH BẢN 1-CHẠM (CRUD) ---
  const handleStartEditItem = (catIdx, itemIdx, currentText) => {
    setEditingItemLocation({ catIdx, itemIdx });
    setEditingItemText(currentText);
  };

  const handleSaveEditItem = () => {
    if (!editingItemLocation || !editingItemText.trim()) return;
    const { catIdx, itemIdx } = editingItemLocation;
    const updated = [...presetScripts];
    updated[catIdx].items[itemIdx] = editingItemText.trim();
    saveScriptsToStorage(updated);
    setEditingItemLocation(null);
    setEditingItemText('');
    showToast('Đã lưu chỉnh sửa câu mẫu!', 'success');
  };

  const handleDeleteItem = (catIdx, itemIdx) => {
    if (confirm('Bạn có chắc chắn muốn xóa câu mẫu này không?')) {
      const updated = [...presetScripts];
      updated[catIdx].items.splice(itemIdx, 1);
      saveScriptsToStorage(updated);
      showToast('Đã xóa câu mẫu!', 'info');
    }
  };

  const handleAddItemToCategory = (catIdx) => {
    if (!newScriptText.trim()) return;
    const updated = [...presetScripts];
    updated[catIdx].items.push(newScriptText.trim());
    saveScriptsToStorage(updated);
    setAddingToCategoryIdx(null);
    setNewScriptText('');
    showToast('Đã thêm câu kịch bản mới vào danh mục!', 'success');
  };

  const handleSaveCategoryName = (catIdx) => {
    if (!editingCategoryName.trim()) return;
    const updated = [...presetScripts];
    updated[catIdx].category = editingCategoryName.trim();
    saveScriptsToStorage(updated);
    setEditingCategoryIdx(null);
    setEditingCategoryName('');
    showToast('Đã đổi tên danh mục!', 'success');
  };

  const handleDeleteCategory = (catIdx) => {
    if (confirm(`Bạn có chắc muốn xóa toàn bộ danh mục "${presetScripts[catIdx].category}"?`)) {
      const updated = [...presetScripts];
      updated.splice(catIdx, 1);
      saveScriptsToStorage(updated);
      showToast('Đã xóa danh mục!', 'info');
    }
  };

  const handleAddNewCategory = () => {
    if (!newCategoryTitle.trim()) return;
    const updated = [
      ...presetScripts,
      {
        category: newCategoryTitle.trim(),
        items: []
      }
    ];
    saveScriptsToStorage(updated);
    setIsAddingNewCategory(false);
    setNewCategoryTitle('');
    showToast('Đã tạo danh mục kịch bản mới!', 'success');
  };

  const handleResetToDefaults = () => {
    if (confirm('Khôi phục toàn bộ kịch bản 1-chạm về mẫu gốc của AVA Live?')) {
      saveScriptsToStorage(DEFAULT_SCRIPTS);
      showToast('Đã khôi phục kịch bản mặc định thành công!', 'success');
    }
  };

  // --- 6. QUẢN LÝ SOUNDBOARD CRUD ---
  const handleSaveSoundboardEdit = () => {
    if (editingSoundboardIdx === null || !editingSoundboardTitle.trim() || !editingSoundboardText.trim()) return;
    const updated = [...soundboardList];
    updated[editingSoundboardIdx] = {
      title: editingSoundboardTitle.trim(),
      text: editingSoundboardText.trim()
    };
    saveSoundboardToStorage(updated);
    setEditingSoundboardIdx(null);
    showToast('Đã cập nhật câu Voice Soundboard!', 'success');
  };

  const handleDeleteSoundboard = (idx) => {
    if (confirm('Xóa câu Soundboard này?')) {
      const updated = [...soundboardList];
      updated.splice(idx, 1);
      saveSoundboardToStorage(updated);
      showToast('Đã xóa câu Soundboard!', 'info');
    }
  };

  const handleAddSoundboard = () => {
    if (!newSoundboardTitle.trim() || !newSoundboardText.trim()) return;
    const updated = [
      ...soundboardList,
      {
        title: newSoundboardTitle.trim(),
        text: newSoundboardText.trim()
      }
    ];
    saveSoundboardToStorage(updated);
    setIsAddingSoundboard(false);
    setNewSoundboardTitle('');
    setNewSoundboardText('');
    showToast('Đã thêm câu Soundboard mới!', 'success');
  };

  const handleResetSoundboard = () => {
    if (confirm('Khôi phục Soundboard về mặc định?')) {
      saveSoundboardToStorage(DEFAULT_SOUNDBOARD);
      showToast('Đã khôi phục Soundboard mặc định!', 'success');
    }
  };

  // Lọc kịch bản theo từ khóa tìm kiếm
  const filteredScripts = presetScripts.map(cat => {
    if (!scriptSearchTerm.trim()) return cat;
    const matchedItems = cat.items.filter(item => 
      item.toLowerCase().includes(scriptSearchTerm.toLowerCase()) ||
      cat.category.toLowerCase().includes(scriptSearchTerm.toLowerCase())
    );
    return { ...cat, items: matchedItems };
  }).filter(cat => cat.items.length > 0 || !scriptSearchTerm.trim());

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className={`w-full max-w-5xl max-h-[92vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl border ${
        isDarkMode ? 'bg-[#15151f] border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
      }`}>
        
        {/* ==================== 1. HEADER ==================== */}
        <div className={`flex flex-wrap items-center justify-between px-5 py-3.5 border-b gap-3 ${
          isDarkMode ? 'bg-[#1b1b28] border-gray-800' : 'bg-gray-100 border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-orange-500/20">
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
                Bắn kịch bản 1-chạm, chỉnh sửa mẫu linh hoạt & đồng bộ 2 hệ giọng Voice (Quản Lý vs Idol)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowVoiceConfigModal(true)}
              className="px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              title="Cấu hình và đồng bộ 2 hệ giọng Voice Quản lý & Voice Idol"
            >
              <Settings2 size={14} /> Cài Đặt Voice
            </button>
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

        {/* ==================== 2. VOICE CHANNEL SELECTOR BANNER (ĐỒNG BỘ 2 HỆ GIỌNG) ==================== */}
        <div className={`px-5 py-2.5 border-b flex flex-wrap items-center justify-between gap-3 text-xs ${
          isDarkMode ? 'bg-[#101018] border-gray-800' : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-gray-400 flex items-center gap-1.5">
              <Volume2 size={14} className="text-amber-400" /> Kênh Voice phát ra Live:
            </span>

            {/* Toggle 1: Giọng Quản Lý */}
            <button
              onClick={() => setSelectedVoiceChannel('manager')}
              className={`px-3 py-1 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all border ${
                selectedVoiceChannel === 'manager'
                  ? 'bg-amber-500 text-black border-amber-400 shadow-md shadow-amber-500/20 scale-105'
                  : 'bg-white/5 hover:bg-white/10 text-gray-400 border-white/10'
              }`}
              title="Sử dụng giọng của Quản lý / Thiết bị / Trợ lý hậu trường (Bán hàng, Giục chốt đơn, Tư vấn, Chăm sóc, Thông báo)"
            >
              <ShieldCheck size={14} />
              <span>🎙️ VOICE QUẢN LÝ / TRỢ LÝ</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-normal ${selectedVoiceChannel === 'manager' ? 'bg-black/20 text-black' : 'bg-white/10 text-gray-300'}`}>
                {voiceConfig.managerVoice?.name?.split('(')[0]?.trim() || 'Callum'}
              </span>
            </button>

            {/* Toggle 2: Giọng Idol Trực Tiếp */}
            <button
              onClick={() => setSelectedVoiceChannel('idol')}
              className={`px-3 py-1 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all border ${
                selectedVoiceChannel === 'idol'
                  ? 'bg-pink-500 text-white border-pink-400 shadow-md shadow-pink-500/20 scale-105'
                  : 'bg-white/5 hover:bg-white/10 text-gray-400 border-white/10'
              }`}
              title="Sử dụng giọng chính của nhân vật Idol Livestream trực tiếp"
            >
              <Sparkles size={14} />
              <span>✨ VOICE IDOL TRỰC TIẾP</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-normal ${selectedVoiceChannel === 'idol' ? 'bg-black/20 text-white' : 'bg-white/10 text-gray-300'}`}>
                {voiceConfig.idolVoice?.name?.split('(')[0]?.trim() || 'Rachel'}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-gray-400">
            <span>Đang phát qua: <strong className={selectedVoiceChannel === 'manager' ? 'text-amber-400' : 'text-pink-400'}>
              {selectedVoiceChannel === 'manager' ? `[Quản Lý: ${voiceConfig.managerVoice?.name}]` : `[Idol: ${voiceConfig.idolVoice?.name}]`}
            </strong></span>
          </div>
        </div>

        {/* ACTIVE OVERRIDE BANNER NẾU ĐANG PHÁT VIDEO */}
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

        {/* ==================== 3. TAB NAVIGATION ==================== */}
        <div className={`flex overflow-x-auto border-b px-5 pt-2.5 gap-1.5 shrink-0 ${isDarkMode ? 'border-gray-800 bg-[#12121b]' : 'border-gray-200 bg-gray-50'}`}>
          <button
            onClick={() => setActiveTab('presets')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-bold text-xs transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'presets'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-white/5'
            }`}
          >
            <Zap size={15} /> ⚡ Mẫu Kịch Bản 1–Chạm ({presetScripts.reduce((acc, cat) => acc + cat.items.length, 0)})
          </button>
          <button
            onClick={() => setActiveTab('comment')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-bold text-xs transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'comment'
                ? 'border-blue-500 text-blue-400 bg-blue-500/10'
                : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-white/5'
            }`}
          >
            <MessageSquare size={15} /> Phản Hồi Comment
          </button>
          <button
            onClick={() => setActiveTab('voice')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-bold text-xs transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'voice'
                ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-white/5'
            }`}
          >
            <Mic size={15} /> Voice & Soundboard
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-bold text-xs transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'video'
                ? 'border-pink-500 text-pink-400 bg-pink-500/10'
                : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-white/5'
            }`}
          >
            <Video size={15} /> Bắn Video Live
          </button>
          <button
            onClick={() => setActiveTab('tts')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-bold text-xs transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'tts'
                ? 'border-purple-500 text-purple-400 bg-purple-500/10'
                : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-white/5'
            }`}
          >
            <Sparkles size={15} /> Soạn Lời Nói Tức Thì
          </button>
        </div>

        {/* ==================== 4. MAIN CONTENT AREA ==================== */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          
          {/* ==================== TAB 5: MẪU KỊCH BẢN 1-CHẠM (EDITABLE & REPLACEABLE) ==================== */}
          {activeTab === 'presets' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              
              {/* Toolbar: Tìm kiếm, Thêm mới, Khôi phục */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border bg-black/20 border-gray-800">
                <div className="flex items-center gap-2 flex-1 min-w-[220px]">
                  <Search size={16} className="text-gray-400" />
                  <input 
                    type="text"
                    value={scriptSearchTerm}
                    onChange={(e) => setScriptSearchTerm(e.target.value)}
                    placeholder="Tìm kiếm mẫu kịch bản chốt đơn, cảm ơn, sự cố..."
                    className={`w-full bg-transparent text-xs outline-none ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                  />
                  {scriptSearchTerm && (
                    <button onClick={() => setScriptSearchTerm('')} className="text-gray-500 hover:text-white">
                      <X size={14} />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsAddingNewCategory(true)}
                    className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <Plus size={13} /> Thêm Danh Mục Mới
                  </button>
                  <button
                    onClick={handleResetToDefaults}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-gray-200 border border-white/10 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all"
                    title="Khôi phục danh sách mẫu kịch bản gốc của AVA Live"
                  >
                    <RotateCcw size={13} /> Khôi Phục Mẫu Gốc
                  </button>
                </div>
              </div>

              {/* Form thêm danh mục mới */}
              {isAddingNewCategory && (
                <div className="p-3.5 rounded-xl border border-emerald-500/40 bg-emerald-500/5 flex items-center gap-2 animate-in fade-in duration-150">
                  <input 
                    type="text"
                    value={newCategoryTitle}
                    onChange={(e) => setNewCategoryTitle(e.target.value)}
                    placeholder="Nhập tên danh mục mới (VD: 💥 Ưu Đãi VIP Hôm Nay)..."
                    className="flex-1 p-2 rounded-lg bg-black/40 border border-gray-700 text-xs text-white outline-none focus:border-emerald-500"
                    autoFocus
                  />
                  <button
                    onClick={handleAddNewCategory}
                    disabled={!newCategoryTitle.trim()}
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 disabled:opacity-40"
                  >
                    <Save size={13} /> Tạo Danh Mục
                  </button>
                  <button
                    onClick={() => { setIsAddingNewCategory(false); setNewCategoryTitle(''); }}
                    className="px-2.5 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-xs"
                  >
                    Hủy
                  </button>
                </div>
              )}

              {/* Danh sách các nhóm kịch bản */}
              <div className="space-y-4">
                {filteredScripts.length === 0 ? (
                  <div className="p-8 text-center border rounded-xl border-dashed border-gray-700 text-gray-400 text-xs">
                    Không tìm thấy mẫu kịch bản nào khớp với từ khóa "{scriptSearchTerm}".
                  </div>
                ) : (
                  filteredScripts.map((cat, cIdx) => {
                    const originalCatIdx = presetScripts.findIndex(p => p.category === cat.category);
                    const realCatIdx = originalCatIdx !== -1 ? originalCatIdx : cIdx;

                    return (
                      <div 
                        key={realCatIdx}
                        className={`p-4 rounded-xl border transition-all ${
                          isDarkMode ? 'bg-[#181824] border-gray-800' : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        {/* Header Danh Mục */}
                        <div className="flex items-center justify-between mb-3 border-b pb-2.5 border-gray-800/60">
                          {editingCategoryIdx === realCatIdx ? (
                            <div className="flex items-center gap-2 flex-1 mr-3">
                              <input 
                                type="text"
                                value={editingCategoryName}
                                onChange={(e) => setEditingCategoryName(e.target.value)}
                                className="flex-1 p-1.5 rounded bg-black/40 border border-emerald-500 text-xs text-emerald-400 font-bold outline-none"
                                autoFocus
                              />
                              <button 
                                onClick={() => handleSaveCategoryName(realCatIdx)}
                                className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs"
                              >
                                <Save size={13} />
                              </button>
                              <button 
                                onClick={() => setEditingCategoryIdx(null)}
                                className="p-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded text-xs"
                              >
                                <X size={13} />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                                {cat.category}
                              </h4>
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold">
                                {cat.items.length} câu
                              </span>
                            </div>
                          )}

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setAddingToCategoryIdx(realCatIdx);
                                setNewScriptText('');
                              }}
                              className="px-2 py-1 bg-white/5 hover:bg-emerald-500/20 text-gray-300 hover:text-emerald-400 rounded text-[11px] font-medium flex items-center gap-1 transition-colors"
                              title="Thêm câu mẫu mới vào nhóm này"
                            >
                              <Plus size={12} /> Thêm câu
                            </button>
                            <button
                              onClick={() => {
                                setEditingCategoryIdx(realCatIdx);
                                setEditingCategoryName(cat.category);
                              }}
                              className="p-1 hover:bg-white/10 text-gray-400 hover:text-gray-200 rounded"
                              title="Đổi tên danh mục"
                            >
                              <Edit3 size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(realCatIdx)}
                              className="p-1 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded"
                              title="Xóa danh mục này"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>

                        {/* Form thêm câu mới vào nhóm */}
                        {addingToCategoryIdx === realCatIdx && (
                          <div className="mb-3 p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5 space-y-2">
                            <textarea 
                              value={newScriptText}
                              onChange={(e) => setNewScriptText(e.target.value)}
                              placeholder="Nhập nội dung kịch bản 1-chạm mới..."
                              className="w-full h-20 p-2.5 rounded bg-black/40 border border-gray-700 text-xs text-white outline-none focus:border-emerald-500 resize-none"
                              autoFocus
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleAddItemToCategory(realCatIdx)}
                                disabled={!newScriptText.trim()}
                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold flex items-center gap-1 disabled:opacity-40"
                              >
                                <Save size={12} /> Lưu Câu Mẫu
                              </button>
                              <button
                                onClick={() => setAddingToCategoryIdx(null)}
                                className="px-2.5 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-xs"
                              >
                                Hủy
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Danh sách các câu kịch bản trong nhóm */}
                        <div className="space-y-2">
                          {cat.items.map((text, sIdx) => {
                            const isEditing = editingItemLocation?.catIdx === realCatIdx && editingItemLocation?.itemIdx === sIdx;

                            return (
                              <div
                                key={sIdx}
                                className={`p-3 rounded-xl border transition-all ${
                                  isEditing 
                                    ? 'bg-[#1e1e2d] border-amber-500/60 shadow-lg' 
                                    : isDarkMode ? 'bg-[#1e1e2c] border-gray-700/60 hover:border-gray-600' : 'bg-white border-gray-200'
                                }`}
                              >
                                {isEditing ? (
                                  /* Chế độ Sửa câu mẫu */
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between text-[11px] text-amber-400 font-bold">
                                      <span>✏️ Chỉnh sửa nội dung câu kịch bản:</span>
                                      <span>{editingItemText.length} ký tự</span>
                                    </div>
                                    <textarea 
                                      value={editingItemText}
                                      onChange={(e) => setEditingItemText(e.target.value)}
                                      className="w-full h-24 p-2.5 rounded-lg bg-black/40 border border-amber-500/50 text-xs text-white outline-none resize-none focus:border-amber-400"
                                      autoFocus
                                    />
                                    <div className="flex items-center justify-between">
                                      <div className="text-[11px] text-gray-400">
                                        Phát qua: <strong className={selectedVoiceChannel === 'manager' ? 'text-amber-400' : 'text-pink-400'}>{selectedVoiceChannel === 'manager' ? 'Giọng Quản Lý' : 'Giọng Idol'}</strong>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <button
                                          onClick={handleSaveEditItem}
                                          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs rounded-lg flex items-center gap-1 shadow-md shadow-amber-500/20"
                                        >
                                          <Save size={12} /> Lưu Thay Đổi
                                        </button>
                                        <button
                                          onClick={() => setEditingItemLocation(null)}
                                          className="px-2.5 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded-lg"
                                        >
                                          Hủy
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  /* Chế độ Xem & Phát câu mẫu */
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs text-gray-200 leading-relaxed font-normal">
                                        "{text}"
                                      </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-1.5 shrink-0">
                                      {/* Nút Phát Ngay bằng Voice đã chọn */}
                                      <button
                                        onClick={() => handleSendInstantTTS(text)}
                                        className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1 shadow-md transition-all ${
                                          selectedVoiceChannel === 'manager'
                                            ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/20'
                                            : 'bg-pink-600 hover:bg-pink-500 text-white shadow-pink-600/20'
                                        }`}
                                        title={`Bắn câu này lên Live ngay bằng ${selectedVoiceChannel === 'manager' ? 'Giọng Quản Lý' : 'Giọng Idol'}`}
                                      >
                                        <Zap size={12} fill="currentColor" /> Phát Ngay
                                      </button>

                                      {/* Nút Sửa */}
                                      <button
                                        onClick={() => handleStartEditItem(realCatIdx, sIdx, text)}
                                        className="p-1.5 bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white rounded-lg transition-colors"
                                        title="Chỉnh sửa câu mẫu này"
                                      >
                                        <Edit3 size={13} />
                                      </button>

                                      {/* Nút Sao chép sang ô Soạn thảo */}
                                      <button
                                        onClick={() => {
                                          setInstantTtsText(text);
                                          setActiveTab('tts');
                                          showToast('Đã nạp câu nói vào tab Soạn Lời Nói Tức Thì!', 'info');
                                        }}
                                        className="p-1.5 bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white rounded-lg transition-colors"
                                        title="Sao chép câu này sang tab Soạn thảo tức thì"
                                      >
                                        <Copy size={13} />
                                      </button>

                                      {/* Nút Xóa */}
                                      <button
                                        onClick={() => handleDeleteItem(realCatIdx, sIdx)}
                                        className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                                        title="Xóa câu mẫu này"
                                      >
                                        <Trash2 size={13} />
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

            </div>
          )}

          {/* ==================== TAB 1: PHẢN HỒI COMMENT ==================== */}
          {activeTab === 'comment' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Cột trái: Form nhập comment & phản hồi */}
                <div className="md:col-span-2 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-400 mb-1 block">Tên người xem / Viewer:</label>
                      <input 
                        type="text"
                        value={commentName}
                        onChange={(e) => setCommentName(e.target.value)}
                        placeholder="Ví dụ: Hoàng Long, Minh Thư VIP..."
                        className={`w-full p-2.5 rounded-xl text-xs border outline-none ${
                          isDarkMode ? 'bg-[#1e1e2d] border-gray-700 focus:border-blue-500' : 'bg-white border-gray-300'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-400 mb-1 block">Chế độ phản hồi:</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setCommentMode('ai')}
                          className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                            commentMode === 'ai'
                              ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20'
                              : isDarkMode ? 'bg-[#1a1a24] border-gray-800 text-gray-400' : 'bg-gray-100 border-gray-300 text-gray-700'
                          }`}
                        >
                          <Sparkles size={13} /> AI Tự Trả Lời
                        </button>
                        <button
                          type="button"
                          onClick={() => setCommentMode('manual')}
                          className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                            commentMode === 'manual'
                              ? 'bg-amber-600 text-white border-amber-500 shadow-md shadow-amber-500/20'
                              : isDarkMode ? 'bg-[#1a1a24] border-gray-800 text-gray-400' : 'bg-gray-100 border-gray-300 text-gray-700'
                          }`}
                        >
                          <Mic size={13} /> Tự Soạn Lời Trả
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-400 mb-1 block">Nội dung bình luận của khách xem Live:</label>
                    <textarea 
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Nhập câu bình luận cần phản hồi (hoặc bấm chọn gợi ý bên phải)..."
                      className={`w-full h-24 p-3 rounded-xl text-xs border outline-none resize-none ${
                        isDarkMode ? 'bg-[#1e1e2d] border-gray-700 focus:border-blue-500' : 'bg-white border-gray-300'
                      }`}
                    />
                  </div>

                  {commentMode === 'manual' && (
                    <div className="animate-in fade-in duration-150">
                      <label className="text-xs font-semibold text-amber-400 mb-1 block">
                        Câu trả lời trực tiếp của bạn (AI sẽ đọc câu này ngay):
                      </label>
                      <textarea 
                        value={commentManualReply}
                        onChange={(e) => setCommentManualReply(e.target.value)}
                        placeholder="Nhập câu bạn muốn Idol/Quản lý nói để trả lời bình luận này..."
                        className={`w-full h-20 p-3 rounded-xl text-xs border outline-none resize-none ${
                          isDarkMode ? 'bg-[#1e1e2d] border-amber-500/50 focus:border-amber-400' : 'bg-white border-gray-300'
                        }`}
                      />
                    </div>
                  )}

                  <button
                    disabled={isSubmittingComment || !commentText.trim()}
                    onClick={handleSendComment}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-40 text-white font-bold rounded-xl text-xs shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
                  >
                    <Send size={14} /> 
                    {isSubmittingComment 
                      ? 'Đang gửi...' 
                      : commentMode === 'ai' 
                        ? 'GỬI BÌNH LUẬN CHO AI TRẢ LỜI NGAY 🚀' 
                        : `PHÁT CÂU TRẢ LỜI TRỰC TIẾP LÊN LIVE ⚡ (${selectedVoiceChannel === 'manager' ? 'Giọng Quản Lý' : 'Giọng Idol'})`}
                  </button>
                </div>

                {/* Cột phải: Gợi ý bình luận nhanh */}
                <div className={`p-4 rounded-2xl border flex flex-col justify-between ${
                  isDarkMode ? 'bg-[#181822] border-gray-800' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div>
                    <h3 className="text-xs font-bold text-blue-400 mb-2.5 flex items-center gap-1.5">
                      <Zap size={14} /> Bình luận mẫu thường gặp:
                    </h3>
                    <div className="space-y-1.5">
                      {DEFAULT_COMMENTS.map((c, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCommentText(c.text)}
                          className={`w-full text-left p-2 rounded-lg text-xs border transition-all ${
                            isDarkMode 
                              ? 'bg-[#20202e] border-gray-700/60 hover:border-blue-500 hover:text-blue-300 text-gray-300' 
                              : 'bg-white border-gray-200 hover:border-blue-500 text-gray-700'
                          }`}
                        >
                          <div className="font-semibold text-[11px] text-blue-400">{c.label}</div>
                          <div className="line-clamp-1 text-[11px] text-gray-400">{c.text}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-2 italic">
                    Bấm vào gợi ý để tự động điền nhanh vào ô bình luận
                  </p>
                </div>

              </div>
            </div>
          )}

          {/* ==================== TAB 2: VOICE & SOUNDBOARD (EDITABLE) ==================== */}
          {activeTab === 'voice' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* 2.1 Thu âm Micro trực tiếp */}
                <div className={`p-5 rounded-2xl border flex flex-col justify-between ${
                  isDarkMode ? 'bg-[#1a1a24] border-gray-800' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 rounded-lg bg-red-600/20 text-red-400">
                        <Mic size={18} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold">Thu Âm Micro Trực Tiếp</h3>
                        <p className="text-[11px] text-gray-400">Thu giọng nói của bạn từ mic và phát đè lên phiên Live</p>
                      </div>
                    </div>

                    <div className="my-5 flex flex-col items-center justify-center p-6 rounded-xl bg-black/20 border border-gray-800">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-all ${
                        isRecording ? 'bg-red-600 text-white animate-pulse shadow-lg shadow-red-600/40' : 'bg-white/10 text-gray-300'
                      }`}>
                        {isRecording ? <Mic size={28} /> : <MicOff size={28} />}
                      </div>
                      <div className="text-sm font-bold">
                        {isRecording ? `Đang thu âm: ${recordingSeconds}s` : recordedAudioUrl ? 'Bản thu đã sẵn sàng!' : 'Chưa có bản thu'}
                      </div>
                      <div className="text-[11px] text-gray-400 mt-1">
                        {isRecording ? 'Nói vào microphone để thu âm...' : 'Bấm nút bên dưới để bắt đầu thu'}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {!isRecording ? (
                      <button
                        onClick={startRecording}
                        className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-600/20"
                      >
                        <Mic size={14} /> BẮT ĐẦU THU ÂM MICRO
                      </button>
                    ) : (
                      <button
                        onClick={stopRecording}
                        className="w-full py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 animate-pulse"
                      >
                        <Square size={14} fill="currentColor" /> DỪNG VÀ LƯU BẢN THU ({recordingSeconds}s)
                      </button>
                    )}

                    {recordedAudioUrl && !isRecording && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => playAudioPreview(recordedAudioUrl)}
                          className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                        >
                          {isPlayingAudioPreview && audioPreviewSrc === recordedAudioUrl ? <Pause size={13} /> : <Play size={13} />}
                          Nghe thử lại
                        </button>
                        <button
                          onClick={() => { setRecordedAudioBlob(null); setRecordedAudioUrl(null); }}
                          className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
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

              {/* 2.3 Mẫu Voice Soundboard (Tùy chỉnh & Sửa được) */}
              <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-[#14141d] border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                    <Volume2 size={14} className="text-amber-400" /> Thư viện câu Soundboard chốt đơn & tương tác:
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsAddingSoundboard(true)}
                      className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-black rounded text-[11px] font-bold flex items-center gap-1 transition-colors"
                    >
                      <Plus size={12} /> Thêm Soundboard
                    </button>
                    <button
                      onClick={handleResetSoundboard}
                      className="p-1 hover:bg-white/10 text-gray-400 rounded"
                      title="Khôi phục mặc định"
                    >
                      <RotateCcw size={12} />
                    </button>
                  </div>
                </div>

                {/* Form thêm Soundboard mới */}
                {isAddingSoundboard && (
                  <div className="mb-3 p-3 rounded-lg border border-amber-500/40 bg-amber-500/5 space-y-2">
                    <input 
                      type="text"
                      value={newSoundboardTitle}
                      onChange={(e) => setNewSoundboardTitle(e.target.value)}
                      placeholder="Tiêu đề Soundboard (VD: Flash Sale 50%)..."
                      className="w-full p-2 rounded bg-black/40 border border-gray-700 text-xs text-white outline-none focus:border-amber-500"
                    />
                    <textarea 
                      value={newSoundboardText}
                      onChange={(e) => setNewSoundboardText(e.target.value)}
                      placeholder="Nội dung câu nói Soundboard..."
                      className="w-full h-16 p-2 rounded bg-black/40 border border-gray-700 text-xs text-white outline-none focus:border-amber-500 resize-none"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={handleAddSoundboard}
                        className="px-3 py-1 bg-amber-500 text-black font-bold rounded text-xs"
                      >
                        Lưu
                      </button>
                      <button
                        onClick={() => setIsAddingSoundboard(false)}
                        className="px-2.5 py-1 bg-gray-700 text-white rounded text-xs"
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {soundboardList.map((item, idx) => {
                    const isEditing = editingSoundboardIdx === idx;

                    return (
                      <div 
                        key={idx}
                        className={`p-3 rounded-lg border flex flex-col justify-between gap-2 ${
                          isDarkMode ? 'bg-[#1b1b26] border-gray-800 hover:border-gray-700' : 'bg-white border-gray-200'
                        }`}
                      >
                        {isEditing ? (
                          <div className="space-y-2">
                            <input 
                              type="text"
                              value={editingSoundboardTitle}
                              onChange={(e) => setEditingSoundboardTitle(e.target.value)}
                              className="w-full p-1.5 rounded bg-black/40 border border-amber-500 text-xs font-bold text-white outline-none"
                            />
                            <textarea 
                              value={editingSoundboardText}
                              onChange={(e) => setEditingSoundboardText(e.target.value)}
                              className="w-full h-14 p-1.5 rounded bg-black/40 border border-amber-500 text-xs text-white outline-none resize-none"
                            />
                            <div className="flex justify-end gap-1.5">
                              <button
                                onClick={handleSaveSoundboardEdit}
                                className="px-2.5 py-1 bg-amber-500 text-black font-bold rounded text-xs"
                              >
                                Lưu
                              </button>
                              <button
                                onClick={() => setEditingSoundboardIdx(null)}
                                className="px-2 py-1 bg-gray-700 text-white rounded text-xs"
                              >
                                Hủy
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                                {item.title}
                              </div>
                              <div className="text-[11px] text-gray-400 line-clamp-1">"{item.text}"</div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => handleSendInstantTTS(item.text)}
                                className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-lg flex items-center gap-1 shadow-md"
                                title={`Bắn câu nói này lên Live (${selectedVoiceChannel === 'manager' ? 'Giọng Quản Lý' : 'Giọng Idol'})`}
                              >
                                <Zap size={12} fill="currentColor" /> Bắn Live
                              </button>
                              <button
                                onClick={() => {
                                  setEditingSoundboardIdx(idx);
                                  setEditingSoundboardTitle(item.title);
                                  setEditingSoundboardText(item.text);
                                }}
                                className="p-1.5 hover:bg-white/10 text-gray-400 rounded"
                                title="Sửa"
                              >
                                <Edit3 size={12} />
                              </button>
                              <button
                                onClick={() => handleDeleteSoundboard(idx)}
                                className="p-1.5 hover:bg-red-500/20 text-red-400 rounded"
                                title="Xóa"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* ==================== TAB 3: BẮN VIDEO LIVE ==================== */}
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
                            <VolumeX size={14} className="text-gray-400" /> Tắt toàn bộ âm thanh (Mute)
                          </div>
                          <div className="text-[10px] text-gray-400">Video chỉ hiển thị hình ảnh, không phát ra tiếng</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {videoAudioMode === 'tts' && (
                    <div>
                      <label className="text-xs font-semibold text-purple-400 mb-1 block">Kịch bản lồng tiếng TTS đọc đè lên video:</label>
                      <textarea 
                        value={videoTtsScript}
                        onChange={(e) => setVideoTtsScript(e.target.value)}
                        placeholder="Nhập nội dung kịch bản AI sẽ đọc trong khi video đang phát..."
                        className={`w-full h-20 p-2.5 rounded-xl text-xs border outline-none resize-none ${
                          isDarkMode ? 'bg-[#1e1e2d] border-purple-500/50 focus:border-purple-400' : 'bg-white border-gray-300'
                        }`}
                      />
                    </div>
                  )}

                  <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={videoLoop} 
                      onChange={(e) => setVideoLoop(e.target.checked)} 
                      className="w-4 h-4 rounded text-pink-600"
                    />
                    <span>Lặp lại video liên tục (Loop Video)</span>
                  </label>
                </div>

              </div>

              <div className="flex gap-3">
                <button
                  disabled={!videoUrl}
                  onClick={handleSendVideoToLive}
                  className="flex-1 py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 disabled:opacity-40 text-white font-bold rounded-xl text-xs shadow-lg shadow-pink-500/20 flex items-center justify-center gap-2"
                >
                  <Film size={15} /> BẮN VIDEO ĐÈ LÊN MÀN HÌNH LIVE NGAY 🚀
                </button>
                {activeQuickVideo && (
                  <button
                    onClick={onStopLiveVideo}
                    className="px-5 py-3 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/40 rounded-xl font-bold text-xs"
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
                    Nhập nội dung văn bản để phát ngay trên Live:
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
                  placeholder="Gõ bất kỳ câu thoại nào bạn muốn phát trên phiên live (VD: Dạ shop cảm ơn anh Nam đã đặt combo 3 áo nha!)..."
                  className={`w-full h-36 p-3 rounded-xl text-sm border outline-none resize-none ${
                    isDarkMode ? 'bg-[#1e1e2d] border-gray-700 focus:border-amber-500' : 'bg-white border-gray-300'
                  }`}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-gray-800 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Giọng nói áp dụng:</span>
                  <span className={`font-bold px-2 py-0.5 rounded ${selectedVoiceChannel === 'manager' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-pink-500/20 text-pink-300 border border-pink-500/30'}`}>
                    {selectedVoiceChannel === 'manager' ? `🎙️ Quản Lý: ${voiceConfig.managerVoice?.name}` : `✨ Idol: ${voiceConfig.idolVoice?.name}`}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedVoiceChannel(prev => prev === 'manager' ? 'idol' : 'manager')}
                  className="text-blue-400 hover:underline text-[11px]"
                >
                  Đổi sang {selectedVoiceChannel === 'manager' ? 'Giọng Idol' : 'Giọng Quản Lý'}
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleSendInstantTTS(instantTtsText)}
                  className={`flex-1 py-3 font-extrabold rounded-xl text-sm shadow-lg flex items-center justify-center gap-2 ${
                    selectedVoiceChannel === 'manager'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black shadow-orange-500/20'
                      : 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white shadow-pink-500/20'
                  }`}
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

        </div>

        {/* ==================== 5. FOOTER: NHẬT KÝ PHẢN HỒI GẦN ĐÂY ==================== */}
        <div className={`px-6 py-3 border-t flex items-center justify-between gap-3 ${
          isDarkMode ? 'bg-[#12121b] border-gray-800' : 'bg-gray-100 border-gray-200'
        }`}>
          <div className="flex items-center gap-2 overflow-x-auto text-[11px] text-gray-400 py-1 flex-1">
            <span className="font-bold text-gray-300 shrink-0 flex items-center gap-1">
              <Clock size={12} /> Vừa bắn gần đây:
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

          <div className="shrink-0 flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-5 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs font-bold rounded-lg transition-colors"
            >
              Đóng lại
            </button>
          </div>
        </div>

      </div>

      {/* ==================== POPUP CẤU HÌNH & ĐỒNG BỘ 2 HỆ GIỌNG VOICE ==================== */}
      {showVoiceConfigModal && (
        <div className="fixed inset-0 bg-black/85 z-[110] flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className={`w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl border ${
            isDarkMode ? 'bg-[#181824] border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
          }`}>
            
            {/* Header Modal Voice */}
            <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between bg-[#1f1f2e]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                  <Volume2 size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Cấu Hình 2 Hệ Giọng Voice (Đồng Bộ Toàn App)</h3>
                  <p className="text-[11px] text-gray-400">Thiết lập giọng chính thức cho Quản lý & Idol Livestream</p>
                </div>
              </div>
              <button 
                onClick={() => setShowVoiceConfigModal(false)}
                className="p-1.5 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content Modal Voice */}
            <div className="p-5 overflow-y-auto space-y-5">
              
              {/* 1. Giọng Quản Lý / Trợ Lý Bán Hàng */}
              <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-amber-400" />
                    <h4 className="text-xs font-bold text-amber-400 uppercase">1. Giọng Quản Lý / Thiết Bị / Trợ Lý Bán Hàng</h4>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                    Hậu trường & Phụ trợ
                  </span>
                </div>
                <p className="text-[11px] text-gray-400">
                  Dùng cho: Giục chốt đơn, thông báo Flash Sale, tư vấn giá/size, chăm sóc khách hàng, kịch bản phát nhanh 1-chạm.
                </p>

                <div className="space-y-2">
                  <label className="text-[11px] text-gray-400 block font-semibold">Chọn giọng đọc Quản Lý:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {CURATED_VOICES.map(voice => (
                      <div 
                        key={voice.id}
                        onClick={() => {
                          const updated = {
                            ...voiceConfig,
                            managerVoice: {
                              ...voiceConfig.managerVoice,
                              ...voice,
                              role: 'manager'
                            }
                          };
                          setVoiceConfig(updated);
                          saveDualVoiceConfig(updated);
                        }}
                        className={`p-2.5 rounded-lg border cursor-pointer transition-all flex items-center justify-between gap-2 ${
                          voiceConfig.managerVoice?.id === voice.id
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                            : 'bg-black/30 border-gray-800 text-gray-300 hover:border-gray-700'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold truncate flex items-center gap-1">
                            {voice.name}
                            {voiceConfig.managerVoice?.id === voice.id && <Check size={12} className="text-amber-400" />}
                          </div>
                          <div className="text-[10px] text-gray-500 truncate">{voice.desc}</div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            previewVoiceAudio(voice, 'Xin chào! Đây là giọng quản lý bán hàng của AVA Live.');
                          }}
                          className="p-1.5 bg-white/10 hover:bg-white/20 rounded text-gray-300 shrink-0"
                          title="Nghe thử"
                        >
                          <Volume2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2. Giọng Nhân Vật Idol Livestream */}
              <div className="p-4 rounded-xl border border-pink-500/30 bg-pink-500/5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-pink-400" />
                    <h4 className="text-xs font-bold text-pink-400 uppercase">2. Giọng Idol Livestream Trực Tiếp</h4>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 font-bold">
                    Giọng chính Idol
                  </span>
                </div>
                <p className="text-[11px] text-gray-400">
                  Dùng cho: Đọc kịch bản chính của Idol, trả lời bình luận live, nhép miệng Lip-Sync trực tiếp.
                </p>

                <div className="space-y-2">
                  <label className="text-[11px] text-gray-400 block font-semibold">Chọn giọng đọc Idol:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {CURATED_VOICES.map(voice => (
                      <div 
                        key={voice.id}
                        onClick={() => {
                          const updated = {
                            ...voiceConfig,
                            idolVoice: {
                              ...voiceConfig.idolVoice,
                              ...voice,
                              role: 'idol'
                            }
                          };
                          setVoiceConfig(updated);
                          saveDualVoiceConfig(updated);
                        }}
                        className={`p-2.5 rounded-lg border cursor-pointer transition-all flex items-center justify-between gap-2 ${
                          voiceConfig.idolVoice?.id === voice.id
                            ? 'bg-pink-500/20 border-pink-500 text-pink-300'
                            : 'bg-black/30 border-gray-800 text-gray-300 hover:border-gray-700'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold truncate flex items-center gap-1">
                            {voice.name}
                            {voiceConfig.idolVoice?.id === voice.id && <Check size={12} className="text-pink-400" />}
                          </div>
                          <div className="text-[10px] text-gray-500 truncate">{voice.desc}</div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            previewVoiceAudio(voice, 'Dạ em chào cả nhà, cảm ơn mọi người đã theo dõi livestream của em nha!');
                          }}
                          className="p-1.5 bg-white/10 hover:bg-white/20 rounded text-gray-300 shrink-0"
                          title="Nghe thử"
                        >
                          <Volume2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Footer Modal Voice */}
            <div className="px-5 py-3 border-t border-gray-800 flex items-center justify-between bg-[#14141d]">
              <span className="text-[11px] text-gray-400">
                ✨ Mọi thay đổi giọng nói sẽ tự động đồng bộ ngay lập tức tới tất cả phiên live và kịch bản.
              </span>
              <button
                onClick={() => {
                  saveDualVoiceConfig(voiceConfig);
                  setShowVoiceConfigModal(false);
                  showToast('Đã lưu và đồng bộ 2 hệ giọng Voice thành công!', 'success');
                }}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg text-xs"
              >
                Xác Nhận & Đóng
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
