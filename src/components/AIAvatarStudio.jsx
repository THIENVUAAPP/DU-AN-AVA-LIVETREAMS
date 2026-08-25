import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Sparkles, 
  Volume2, 
  Radio, 
  Play, 
  Upload, 
  Check, 
  Trash2,
  Image as ImageIcon,
  Video,
  Film,
  X,
  Lock,
  Power
} from 'lucide-react';
import UniversalFileUploader from './UniversalFileUploader';

const DEFAULT_AVATARS = [
  { id: 'd1', name: 'Linh Anh', gender: 'female', style: 'Thời Trang & Xu Hướng', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', voice: 'Nữ Hà Nội Chuẩn', tag: 'TOP SELLER', isDefault: true },
  { id: 'd2', name: 'Mai Phương', gender: 'female', style: 'Mỹ Phẩm & Skincare', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80', voice: 'Nữ Sài Gòn Ngọt Ngào', tag: 'HOT', isDefault: true },
  { id: 'd3', name: 'Thu Trang', gender: 'female', style: 'Gia Dụng & Mẹ Bé', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80', voice: 'Nữ Miền Trung Ấm Áp', tag: 'RECOMMENDED', isDefault: true },
  { id: 'd4', name: 'Thanh Hằng', gender: 'female', style: 'Doanh Nhân & Đẳng Cấp', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80', voice: 'Nữ Hà Nội Sang Trọng', tag: 'LUXURY', isDefault: true },
  { id: 'd5', name: 'Bảo Ngọc', gender: 'female', style: 'GenZ Năng Động', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80', voice: 'Nữ Trẻ Năng Lượng', tag: 'GENZ', isDefault: true },
  { id: 'd6', name: 'Yến Nhi', gender: 'female', style: 'Trợ Lý Công Nghệ', image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80', voice: 'Nữ AI Thông Minh', tag: 'TECH', isDefault: true },
  { id: 'd7', name: 'Sophia Chen', gender: 'female', style: 'English Global Host', image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=400&q=80', voice: 'English US Female', tag: 'GLOBAL', isDefault: true },
  { id: 'd8', name: 'Yumi Takahashi', gender: 'female', style: 'Japanese Anime/Beauty', image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=400&q=80', voice: 'Japanese Female', tag: 'JAPAN', isDefault: true },
  { id: 'd9', name: 'Lin Lin', gender: 'female', style: 'Chinese E-Commerce', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80', voice: 'Mandarin Female', tag: 'CHINA', isDefault: true },
  { id: 'd10', name: 'Elena Rossi', gender: 'female', style: 'European Luxury', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80', voice: 'Italian/Spanish Female', tag: 'EUROPE', isDefault: true },
  { id: 'd11', name: 'Minh Đức', gender: 'male', style: 'Nam Thần Công Nghệ', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80', voice: 'Nam Hà Nội Chuẩn', tag: 'TOP MALE', isDefault: true },
  { id: 'd12', name: 'Hoàng Nam', gender: 'male', style: 'Doanh Nhân Lịch Lãm', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80', voice: 'Nam Sài Gòn Ấm Áp', tag: 'PREMIUM', isDefault: true },
  { id: 'd13', name: 'Tuấn Kiệt', gender: 'male', style: 'Thời Trang Nam Năng Động', image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80', voice: 'Nam Trẻ Trẻ Trung', tag: 'SPORT', isDefault: true },
  { id: 'd14', name: 'Hải Đăng', gender: 'male', style: 'Đời Sống & Gia Dụng', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', voice: 'Nam Miền Trung Truyền Cảm', tag: 'HOME', isDefault: true },
  { id: 'd15', name: 'Bảo Long', gender: 'male', style: 'Streamer Game & Tech', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80', voice: 'Nam Hào Hùng', tag: 'STREAMER', isDefault: true },
  { id: 'd16', name: 'Quốc Anh', gender: 'male', style: 'Mỹ Phẩm & Care Nam', image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80', voice: 'Nam Sài Gòn Nhẹ Nhàng', tag: 'GROOMING', isDefault: true },
  { id: 'd17', name: 'Alex Rivera', gender: 'male', style: 'English Global Host', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80', voice: 'English US Male', tag: 'GLOBAL', isDefault: true },
  { id: 'd18', name: 'Kenji Tanaka', gender: 'male', style: 'Japanese Tech Male', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80', voice: 'Japanese Male', tag: 'JAPAN', isDefault: true },
  { id: 'd19', name: 'Chen Wei', gender: 'male', style: 'Chinese Streamer Male', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80', voice: 'Mandarin Male', tag: 'CHINA', isDefault: true },
  { id: 'd20', name: 'David Miller', gender: 'male', style: 'European Fashion Male', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', voice: 'German/English Male', tag: 'EUROPE', isDefault: true },
];

export default function AIAvatarStudio({ isLive, aiAvatarFeatureEnabled }) {
  // If AI Avatar is locked by Admin, default to 'videos' tab
  const [activeTab, setActiveTab] = useState(aiAvatarFeatureEnabled ? 'avatars' : 'videos');
  const [selectedGender, setSelectedGender] = useState('all');
  const [activeAvatarId, setActiveAvatarId] = useState('d1');
  const [customAvatars, setCustomAvatars] = useState([]);
  const [showGuideModal, setShowGuideModal] = useState(false);

  // Sync activeTab when aiAvatarFeatureEnabled changes
  useEffect(() => {
    if (!aiAvatarFeatureEnabled && activeTab === 'avatars') {
      setActiveTab('videos');
    }
  }, [aiAvatarFeatureEnabled, activeTab]);
  
  // Custom Uploaded Videos
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const [activeVideoId, setActiveVideoId] = useState(null);

  const [scriptText, setScriptText] = useState('Xin chào tất cả mọi người đang xem livestream! Hôm nay em có deal siêu hời giảm ngay 50%! Nhanh tay ấn vào nút MUA NGAY dưới màn hình nhé!');
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Combine custom avatars (newest first) and default avatars
  const allAvatars = [...customAvatars, ...DEFAULT_AVATARS];

  const filteredAvatars = allAvatars.filter(a => {
    if (selectedGender === 'custom') return !a.isDefault;
    if (selectedGender === 'female') return a.gender === 'female';
    if (selectedGender === 'male') return a.gender === 'male';
    return true;
  });

  const activeAvatar = allAvatars.find(a => a.id === activeAvatarId) || allAvatars[0];
  const activeVideo = uploadedVideos.find(v => v.id === activeVideoId);

  // --- THÊM LOGIC ĐỒNG BỘ MEDIA SANG OBS OVERLAY (CleanLiveOverlay) ---
  useEffect(() => {
    let currentMediaUrl = '';
    let isVideo = false;
    let characterName = 'AI Idol';

    if (activeTab === 'videos' && activeVideo) {
      currentMediaUrl = activeVideo.url;
      isVideo = true;
      characterName = activeVideo.name || 'Video Phát Lại';
    } else if (activeAvatar) {
      currentMediaUrl = activeAvatar.image;
      isVideo = false;
      characterName = activeAvatar.name || 'AI Idol';
    }

    const payload = {
      type: 'STREAM_MEDIA_UPDATE',
      mediaUrl: currentMediaUrl,
      isVideo: isVideo,
      characterName: characterName,
      isConnected: isLive
    };

    if (typeof BroadcastChannel !== 'undefined') {
      try {
        const cleanChannel = new BroadcastChannel('avalive_clean_stream_channel');
        cleanChannel.postMessage(payload);
        setTimeout(() => cleanChannel.close(), 100);
      } catch (e) {}
    }

    try {
      localStorage.setItem('aidol_clean_stream_state', JSON.stringify(payload));
      // Đồng thời lưu vào master state để overlay đọc khi khởi động
      const masterRaw = localStorage.getItem('avalive_master_live_state');
      let masterState = masterRaw ? JSON.parse(masterRaw) : {};
      masterState = { ...masterState, mediaUrl: currentMediaUrl, isVideo, characterName };
      localStorage.setItem('avalive_master_live_state', JSON.stringify(masterState));
    } catch (e) {}
  }, [activeAvatarId, activeVideoId, activeTab, isLive, activeAvatar, activeVideo]);

  // Callback when UniversalFileUploader processes an image
  const handleImageUploaded = (fileObj) => {
    const newItem = {
      id: fileObj.id,
      name: fileObj.name,
      gender: 'custom',
      style: 'Mẫu Tùy Chỉnh Nạp Lên',
      image: fileObj.url,
      voice: 'Voice Clone AI Gốc',
      tag: 'CUSTOM 3D',
      isDefault: false
    };

    setCustomAvatars(prev => [newItem, ...prev]);
    setSelectedGender('custom');
    setActiveAvatarId(newItem.id);
    if (aiAvatarFeatureEnabled) {
      setActiveTab('avatars');
    }
  };

  // Callback when UniversalFileUploader processes a video
  const handleVideoUploaded = (fileObj) => {
    const newVid = {
      id: fileObj.id,
      name: fileObj.name,
      url: fileObj.url,
      size: fileObj.size
    };

    setUploadedVideos(prev => [newVid, ...prev]);
    setActiveVideoId(newVid.id);
    setActiveTab('videos');
  };

  // Single Custom Avatar Delete
  const handleDeleteAvatar = (e, id) => {
    e.stopPropagation();
    const remaining = customAvatars.filter(a => a.id !== id);
    setCustomAvatars(remaining);
    if (activeAvatarId === id && remaining.length > 0) {
      setActiveAvatarId(remaining[0].id);
    } else if (remaining.length === 0) {
      setActiveAvatarId('d1');
      setSelectedGender('all');
    }
  };

  // Delete All Custom Avatars
  const handleDeleteAllAvatars = () => {
    if (customAvatars.length === 0) {
      alert("Chưa có mẫu ảnh tùy chỉnh nào để xóa!");
      return;
    }
    if (window.confirm(`Bạn có chắc muốn xóa tất cả ${customAvatars.length} mẫu ảnh tùy chỉnh?`)) {
      setCustomAvatars([]);
      setActiveAvatarId('d1');
      setSelectedGender('all');
    }
  };

  // Single Video Delete
  const handleDeleteVideo = (e, id) => {
    e.stopPropagation();
    const remaining = uploadedVideos.filter(v => v.id !== id);
    setUploadedVideos(remaining);
    if (activeVideoId === id && remaining.length > 0) {
      setActiveVideoId(remaining[0].id);
    } else if (remaining.length === 0) {
      setActiveVideoId(null);
    }
  };

  // Delete All Uploaded Videos
  const handleDeleteAllVideos = () => {
    if (uploadedVideos.length === 0) {
      alert("Chưa có video nào để xóa!");
      return;
    }
    if (window.confirm(`Bạn có chắc muốn xóa tất cả ${uploadedVideos.length} video?`)) {
      setUploadedVideos([]);
      setActiveVideoId(null);
    }
  };

  const handleSpeakScript = () => {
    if (!scriptText.trim()) return;
    setIsSpeaking(true);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(scriptText);
      utterance.lang = 'vi-VN';
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsSpeaking(false), 3000);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Sleek Executive Header Bar */}
      <div className="glass-panel p-4 lg:p-5 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-r from-[#121218] via-[#0A0A0A] to-[#141018]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EF4444]/20 border border-[#EF4444]/40 text-[#EF4444] text-xs font-black mb-1.5">
            <Bot className="w-3.5 h-3.5 animate-pulse" /> 
            {aiAvatarFeatureEnabled ? 'QUẢN LÝ AVATAR & VIDEO LIVE 4K' : 'BÀN PHÁT REPLAY VIDEO & LINK RESTREAM 24/7'}
          </div>
          <h2 className="text-xl font-black text-white">
            {aiAvatarFeatureEnabled ? 'Bàn Điều Khiển AI Avatar & Video Live Stream' : 'Phát Replay & Restream'}
          </h2>
        </div>

        {/* Top Header Buttons: Guide Toggle & Delete All */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowGuideModal(!showGuideModal)}
            className="px-3.5 py-2 rounded-2xl bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 border border-purple-500/40 text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-glow-purple"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>📖 HƯỚNG DẪN</span>
          </button>

          {customAvatars.length > 0 && activeTab === 'avatars' && (
            <button
              onClick={handleDeleteAllAvatars}
              className="px-4 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs transition-all shadow-glow-red cursor-pointer flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              <span>XÓA HẾT ẢNH ({customAvatars.length})</span>
            </button>
          )}

          {uploadedVideos.length > 0 && activeTab === 'videos' && (
            <button
              onClick={handleDeleteAllVideos}
              className="px-4 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs transition-all shadow-glow-red cursor-pointer flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              <span>XÓA HẾT VIDEO ({uploadedVideos.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* POPUP MODAL HƯỚNG DẪN SỬ DỤNG MC AI AVATAR */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl border border-purple-500/40 max-w-2xl w-full text-left space-y-4 shadow-2xl bg-[#0A0A0A]/95">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                📖 HƯỚNG DẪN SỬ DỤNG MC AI AVATAR & NGUYÊN LÝ HOẠT ĐỘNG
              </h3>
              <button onClick={() => setShowGuideModal(false)} className="text-gray-400 hover:text-white font-bold text-lg cursor-pointer">✕</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-300">
              <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 space-y-1">
                <span className="font-black text-purple-400 block text-xs">Bước 1: Chọn hoặc Nạp Ảnh</span>
                <p className="text-[11px] text-gray-400">Chọn 1 trong 20 mẫu MC AI sẵn có (10 Nam, 10 Nữ) hoặc bấm <strong>"TẢI ẢNH AVATAR LÊN"</strong> để nạp ảnh chân dung riêng của anh.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 space-y-1">
                <span className="font-black text-blue-400 block text-xs">Bước 2: Soạn Kịch Bản Thoại</span>
                <p className="text-[11px] text-gray-400">Nhập kịch bản lời nói cho MC AI đọc livestream bán hàng vào ô text box (Ví dụ: *"Giảm giá 50% hôm nay..."*).</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 space-y-1">
                <span className="font-black text-emerald-400 block text-xs">Bước 3: Phát Giọng Đọc AI</span>
                <p className="text-[11px] text-gray-400">Nhấp nút <strong>"PHÁT GIỌNG ĐỌC MC AI THẬT"</strong>. Công nghệ AI sẽ đồng bộ cử động môi tự động.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 space-y-1">
                <span className="font-black text-red-400 block text-xs">Bước 4: Đẩy Luồng Live 4K</span>
                <p className="text-[11px] text-gray-400">Sang tab <strong>"Kết Nối Đa Nền Tảng"</strong> ➔ Bấm <strong>"Phát Tất Cả Kênh"</strong> để đẩy luồng live sang đa nền tảng.</p>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setShowGuideModal(false)}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Đã Hiểu & Đóng Lại
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EMBED UNIVERSAL FILE UPLOADER COMPONENT */}
      <UniversalFileUploader 
        onImageUploaded={handleImageUploaded}
        onVideoUploaded={handleVideoUploaded}
        title="BÀN NẠP FILE TỔNG HỢP (ẢNH AVATAR & VIDEO LIVESTREAM)"
      />

      {/* Main Tab Selector: Avatars vs Videos */}
      <div className="flex items-center gap-3">
        {aiAvatarFeatureEnabled ? (
          <button
            onClick={() => setActiveTab('avatars')}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black tracking-wide transition-all cursor-pointer ${
              activeTab === 'avatars'
                ? 'bg-[#EF4444] text-white shadow-glow-red scale-105'
                : 'glass-panel text-gray-400 border border-white/10 hover:text-white'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>🤖 MC AI 3D ({allAvatars.length})</span>
          </button>
        ) : (
          <div className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Chức năng MC AI Avatar đang tạm ẩn/khóa bởi Admin</span>
          </div>
        )}

        <button
          onClick={() => setActiveTab('videos')}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black tracking-wide transition-all cursor-pointer ${
            activeTab === 'videos'
              ? 'bg-[#8B5CF6] text-white shadow-glow-purple scale-105'
              : 'glass-panel text-gray-400 border border-white/10 hover:text-white'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>🎬 RESTREAM 24/7 ({uploadedVideos.length})</span>
        </button>
      </div>

      {/* TAB 1: AVATARS STUDIO GRID */}
      {activeTab === 'avatars' && aiAvatarFeatureEnabled && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Avatars Selection Grid */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Filter Buttons */}
            <div className="flex flex-wrap items-center justify-between glass-panel p-3 rounded-2xl border border-white/10 gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setSelectedGender('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedGender === 'all'
                      ? 'bg-[#EF4444] text-white shadow-glow-red'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  TẤT CẢ ({allAvatars.length})
                </button>

                <button
                  onClick={() => setSelectedGender('custom')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                    selectedGender === 'custom'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-glow-purple scale-105'
                      : 'text-purple-300 hover:text-white hover:bg-purple-500/10'
                  }`}
                >
                  MẪU TÙY CHỈNH NẠP LÊN ({customAvatars.length})
                </button>

                <button
                  onClick={() => setSelectedGender('female')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedGender === 'female'
                      ? 'bg-[#EF4444] text-white shadow-glow-red'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  10 MC NỮ
                </button>

                <button
                  onClick={() => setSelectedGender('male')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedGender === 'male'
                      ? 'bg-[#EF4444] text-white shadow-glow-red'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  10 MC NAM
                </button>
              </div>

              <span className="text-xs text-gray-400 font-mono hidden sm:block font-bold">
                ● LIP SYNC ACTIVE
              </span>
            </div>

            {/* Avatar Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filteredAvatars.map((avatar) => {
                const isSelected = avatar.id === activeAvatarId;
                return (
                  <div
                    key={avatar.id}
                    onClick={() => setActiveAvatarId(avatar.id)}
                    className={`glass-panel p-2.5 rounded-2xl border transition-all cursor-pointer relative group ${
                      isSelected
                        ? 'border-[#EF4444] bg-[#EF4444]/15 shadow-glow-red scale-105 z-10'
                        : 'border-white/10 hover:border-white/30 hover:bg-white/5'
                    }`}
                  >
                    <div className="relative aspect-square rounded-xl overflow-hidden mb-2 bg-[#121216]">
                      <img 
                        src={avatar.image} 
                        alt={avatar.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      <span className={`absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[9px] font-black ${
                        !avatar.isDefault 
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md' 
                          : 'bg-black/70 text-white'
                      }`}>
                        {avatar.tag}
                      </span>

                      {/* Delete Custom Image Button */}
                      {!avatar.isDefault && (
                        <button
                          onClick={(e) => handleDeleteAvatar(e, avatar.id)}
                          className="absolute bottom-1.5 right-1.5 p-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-lg transition-all cursor-pointer z-40 flex items-center gap-1 text-[10px] font-black"
                          title="Xóa mẫu ảnh này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>XÓA</span>
                        </button>
                      )}

                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#EF4444] text-white flex items-center justify-center p-1 shadow-md z-30">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="text-xs font-bold text-white line-clamp-1 truncate">
                        {avatar.name}
                      </h3>
                      <p className="text-[10px] text-gray-400 font-mono mt-0.5 line-clamp-1">{avatar.style}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Active Avatar Stage */}
          <div className="space-y-4">
            <div className="glass-panel p-5 rounded-3xl border border-white/15 space-y-4 relative overflow-hidden bg-black/60">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 bg-[#121216]">
                <img 
                  src={activeAvatar.image} 
                  alt={activeAvatar.name}
                  className={`w-full h-full object-cover transition-all ${isSpeaking ? 'scale-105 brightness-110' : ''}`}
                />

                <div className="absolute top-3 right-3 z-30">
                  <button
                    onClick={() => {
                      if (document.documentElement.requestFullscreen) {
                        document.documentElement.requestFullscreen();
                      } else {
                        alert("Mở chế độ Fullscreen 4K!");
                      }
                    }}
                    className="px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:opacity-95 text-white font-black text-xs border-2 border-amber-300 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xl animate-pulse"
                    title="Xem Full Khung Hình Studio MC AI"
                  >
                    <span>🔍 XEM FULL MÀN HÌNH 4K</span>
                  </button>
                </div>

                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-white text-[10px] font-black flex items-center gap-1.5">
                    <Radio className={`w-3 h-3 ${isLive ? 'text-red-500 animate-spin' : 'text-emerald-400'}`} />
                    {isSpeaking ? '🔴 AI ĐANG NÓI...' : 'READY TO LIVE'}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 flex items-center justify-between text-xs text-white">
                  <div>
                    <span className="font-bold block text-white truncate max-w-[160px]">{activeAvatar.name}</span>
                    <span className="text-[10px] text-gray-400 font-mono">{activeAvatar.voice}</span>
                  </div>
                  <Volume2 className={`w-4 h-4 ${isSpeaking ? 'text-[#EF4444] animate-bounce' : 'text-gray-400'}`} />
                </div>
              </div>

              {/* Speech Script Box */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-300 block">KỊCH BẢN PHÁT LỜI THOẠI MC AI:</label>
                <textarea
                  value={scriptText}
                  onChange={(e) => setScriptText(e.target.value)}
                  rows={3}
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#EF4444] transition-all resize-none"
                  placeholder="Nhập nội dung cho MC AI đọc livestream..."
                />

                <button
                  onClick={handleSpeakScript}
                  disabled={isSpeaking}
                  className="w-full py-3 bg-gradient-to-r from-[#EF4444] to-[#8B5CF6] text-white font-extrabold text-xs rounded-xl shadow-glow-red hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play className={`w-4 h-4 ${isSpeaking ? 'animate-spin' : ''}`} />
                  <span>{isSpeaking ? '🔴 MC AI ĐANG ĐỌC KỊCH BẢN...' : '⚡ PHÁT GIỌNG ĐỌC MC AI THẬT'}</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: VIDEOS LIVESTREAM LIST */}
      {(activeTab === 'videos' || !aiAvatarFeatureEnabled) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Video Items List */}
          <div className="lg:col-span-2 space-y-4">
            {uploadedVideos.length === 0 ? (
              <div className="glass-panel p-12 rounded-3xl border border-dashed border-[#3B82F6]/30 text-center space-y-4">
                <Film className="w-14 h-14 text-gray-600 mx-auto" />
                <h3 className="text-base font-black text-white">CHƯA CÓ VIDEO LỰA CHỌN PHÁT LIVESTREAM</h3>
                <p className="text-xs text-gray-400">Dùng bàn nạp phía trên để chọn file video từ máy tính của bạn.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {uploadedVideos.map((vid, idx) => {
                  const isActive = vid.id === activeVideoId;
                  const isLiveOn = vid.isLiveActive !== false;
                  return (
                    <div
                      key={vid.id}
                      onClick={() => setActiveVideoId(vid.id)}
                      className={`glass-panel p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                        isActive
                          ? 'border-[#3B82F6] bg-[#3B82F6]/10 shadow-glow-blue'
                          : 'border-white/10 hover:border-white/30 bg-[#121218]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${
                            isLiveOn ? 'bg-[#3B82F6]/20 border border-[#3B82F6]/40 text-[#3B82F6]' : 'bg-gray-800 text-gray-400'
                          }`}>
                            🎬
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-white line-clamp-1">{vid.name}</h4>
                            <span className="text-xs text-gray-400 font-mono">Dung lượng: {vid.size} • Định dạng MP4 4K</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          {isActive && (
                            <span className="px-3 py-1 rounded-full bg-[#3B82F6]/20 text-[#3B82F6] text-xs font-black border border-[#3B82F6]/40 flex items-center gap-1">
                              <Radio className="w-3 h-3 animate-pulse" /> CHỌN PHÁT
                            </span>
                          )}

                          <button
                            onClick={(e) => handleDeleteVideo(e, vid.id)}
                            className="p-2 rounded-xl bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-500/30 transition-all cursor-pointer"
                            title="Xóa video này"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* 1-CLICK DEDICATED LIVE POWER SWITCH FOR THIS SPECIFIC LINK / VIDEO */}
                      <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${isLiveOn ? 'bg-emerald-400 animate-ping' : 'bg-red-500'}`} />
                          <span className={`text-[11px] font-black ${isLiveOn ? 'text-emerald-400' : 'text-gray-400'}`}>
                            {isLiveOn ? '🔴 ĐANG MỞ PHÁT LIVE 24/7' : '⚪ ĐÃ TẮT PHÁT LIVE'}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const updated = uploadedVideos.map(v => 
                              v.id === vid.id ? { ...v, isLiveActive: !isLiveOn } : v
                            );
                            setUploadedVideos(updated);
                            alert(!isLiveOn 
                              ? `🟢 ĐÃ MỞ PHÁT LIVE TỨC THÌ PHIÊN: [${vid.name}]!` 
                              : `🔴 ĐÃ TẮT PHÁT LIVE PHIÊN: [${vid.name}]!`
                            );
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition-all flex items-center gap-1.5 border select-none ${
                            isLiveOn
                              ? 'bg-red-600/20 text-red-300 border-red-500/40 hover:bg-red-600/40'
                              : 'bg-emerald-600 text-white border-emerald-500 shadow-glow-emerald hover:bg-emerald-700'
                          }`}
                        >
                          <Power className="w-3.5 h-3.5" />
                          <span>{isLiveOn ? 'TẮT LIVE PHIÊN NÀY' : 'MỞ LIVE PHIÊN NÀY'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Video Preview Player & Multi-Camera Switcher */}
          <div className="space-y-4">
            <div className="glass-panel p-5 rounded-3xl border border-white/15 space-y-4 bg-black/60">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Video className="w-4 h-4 text-[#3B82F6]" /> PLAYER PREVIEW LIVE GIÁN TIẾP 4K
                </h3>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black border border-emerald-500/40">
                  MULTICAM READY
                </span>
              </div>

              {activeVideo ? (
                <div className="space-y-3">
                  <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black">
                    <video
                      key={activeVideo.id}
                      src={activeVideo.url}
                      controls
                      autoPlay
                      loop
                      muted
                      preload="auto"
                      playsInline
                      className="w-full h-full object-contain transform-gpu"
                    />

                    {/* Camera Angle Badge Overlay */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-white/20 text-white text-[10px] font-mono font-bold flex items-center gap-1.5">
                      <Radio className="w-3 h-3 text-red-500 animate-pulse" />
                      <span>GÓC MÁY MULTICAM PHIÊN LIVE</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-white">{activeVideo.name}</h4>
                    <p className="text-[10px] text-gray-400 font-mono mt-0.5">Vòng lặp phát tự động 24/7 (Loop Active)</p>
                  </div>
                </div>
              ) : (
                <div className="aspect-video rounded-2xl bg-[#0A0A0A] border border-white/10 flex flex-col items-center justify-center text-center p-6 space-y-2">
                  <Film className="w-10 h-10 text-gray-600" />
                  <p className="text-xs text-gray-400">Chọn 1 video trong danh sách bên trái để mở player phát xem trước.</p>
                </div>
              )}

              {/* BỘ CHUYỂN GÓC MÁY MULTICAM DÀNH CHO LIVE GIÁN TIẾP */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <span className="text-[11px] font-bold text-gray-300 block">🎥 Chuyển Góc Máy Camera Phiên Live Gián Tiếp:</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button className="p-2 rounded-xl bg-purple-600/30 border border-purple-500/50 text-white font-bold flex items-center justify-center gap-1.5 hover:bg-purple-600/50 transition-all cursor-pointer">
                    <span>🎥 Cam 1: Mặt Host</span>
                  </button>
                  <button className="p-2 rounded-xl bg-black/40 border border-white/10 text-gray-300 font-bold flex items-center justify-center gap-1.5 hover:border-white/30 transition-all cursor-pointer">
                    <span>🔍 Cam 2: Cận Cảnh SP</span>
                  </button>
                  <button className="p-2 rounded-xl bg-black/40 border border-white/10 text-gray-300 font-bold flex items-center justify-center gap-1.5 hover:border-white/30 transition-all cursor-pointer">
                    <span>🏢 Cam 3: Studio Rộng</span>
                  </button>
                  <button className="p-2 rounded-xl bg-black/40 border border-white/10 text-gray-300 font-bold flex items-center justify-center gap-1.5 hover:border-white/30 transition-all cursor-pointer">
                    <span>🖼️ Cam 4: PIP Hỗn Hợp</span>
                  </button>
                </div>
              </div>

              {/* MULTISTREAM STREAMING CHANNELS STATUS */}
              <div className="p-3 rounded-2xl bg-black/80 border border-emerald-500/30 space-y-2 text-left">
                <span className="text-[10px] font-black text-emerald-400 block uppercase tracking-wider">
                  🌐 KÊNH ĐẨY LUỒNG PHÁT LIVE TỰ ĐỘNG ĐA KÊNH:
                </span>
                <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">● TikTok Shop (ACTIVE)</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">● FB Fanpage (ACTIVE)</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">● Shopee Live (ACTIVE)</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">● YouTube (ACTIVE)</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
}
