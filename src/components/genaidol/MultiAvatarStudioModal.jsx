import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, Sparkles, Video, Mic, Volume2, Gauge, HelpCircle, X, Check, Play, Square, 
  Upload, FolderOpen, Layers, ShieldCheck, Info, MessageSquare, Plus, RefreshCw, Eye, BookOpen,
  Move, Maximize2, Palette, Sliders, Image, Monitor, Smartphone, ChevronRight, LayoutGrid, CheckCircle2
} from 'lucide-react';
import { 
  ALL_SYSTEM_VOICES, 
  getMultiAvatarConfig, 
  saveMultiAvatarConfig, 
  DEFAULT_MULTI_AVATAR_CONFIG,
  STUDIO_BACKGROUND_PRESETS,
  STUDIO_STAGE_PRESETS,
  previewVoiceAudio,
  stopVoiceAudio
} from '../../utils/voiceSyncService';
import UniversalMediaPicker from './UniversalMediaPicker';

export const SCRIPT_TEMPLATES = [
  {
    id: 'dual_sales',
    title: '🔥 Kịch Bản 2 Người: Idol Live + Trợ Lý Thúc Giục Chốt Đơn',
    count: 2,
    desc: 'Idol giới thiệu sản phẩm và chia sẻ trải nghiệm, Trợ lý liên tục cập nhật tồn kho và tạo hiệu ứng FOMO giục khách bấm giỏ hàng.',
    script: `[Idol]: Dạ em xin chào cả nhà mình nha! Hôm nay em mang đến một bất ngờ siêu ngọt ngào luôn nè!
[Trợ Lý]: Đúng rồi cả nhà ơi! Bộ phận kho vừa báo số lượng chỉ còn đúng 20 suất ưu đãi giảm 50% cho khách chốt ngay trên live!
[Idol]: Mọi người nhanh tay nhấn ngay vào nút giỏ hàng bên dưới góc trái màn hình nha, hết suất là tiếc lắm đó ạ!
[Trợ Lý]: 5 khách hàng đầu tiên hoàn tất đơn hàng em sẽ tặng thêm 1 phần quà bí mật trị giá 300 ngàn đồng liền tay!`
  },
  {
    id: 'trio_entertainment',
    title: '🎮 Kịch Bản 3 Người: Idol + Trợ Lý + BLV Game PK Hoạt Náo',
    count: 3,
    desc: 'Idol tương tác dễ thương, Trợ lý chăm sóc đơn hàng và BLV Game bùng nổ năng lượng khuấy động không khí livestream.',
    script: `[Idol]: Hello cả nhà iu! Hôm nay phòng live của chúng ta có trận thách đấu PK siêu gay cấn luôn nha!
[BLV Game]: Chào mừng 500 anh em đã có mặt! Chuẩn bị đếm ngược 10 giây trước khi trận combat bùng nổ, anh em cùng thả tim triệu view nào!
[Trợ Lý]: Đội ngũ trợ lý đã sẵn sàng mở kho quà tặng độc quyền cho ai đóng góp điểm số cao nhất trong hiệp đấu này!
[Idol]: Mọi người cùng chung tay giúp em giành chiến thắng nha, yêu cả nhà mình nhiều lắm!
[BLV Game]: 3, 2, 1, Bùng nổ nào anh em ơi!`
  },
  {
    id: 'squad_talkshow',
    title: '🎙️ Kịch Bản 4 Người: Talkshow Đa Chiều & Khách Mời Chuyên Gia',
    count: 4,
    desc: 'Idol dẫn dắt chương trình, Chuyên gia phân tích giải pháp, Trợ lý tổng hợp ý kiến và Khách mời chia sẻ trải nghiệm thực tế.',
    script: `[Idol]: Chào mừng quý vị khán giả đến với buổi tọa đàm trực tiếp hôm nay!
[Khách Mời]: Cảm ơn bạn đã mời tôi, tôi rất vui khi được chia sẻ những kinh nghiệm thực tế cùng quý vị.
[Trợ Lý]: Đã có rất nhiều câu hỏi gửi về từ phía khán giả đang xem live rồi ạ!
[BLV Game]: Không để quý vị chờ lâu nữa, chúng ta hãy cùng bắt đầu chủ đề thảo luận siêu hấp dẫn ngày hôm nay ngay bây giờ!`
  }
];

export function MultiAvatarStudioPanel({ onApplyScriptTemplate, isEmbedded = false, onClose = null }) {
  const [config, setConfig] = useState(getMultiAvatarConfig());
  const [activeTab, setActiveTab] = useState('canvas'); // 'canvas', 'avatars', 'templates'
  const [selectedAvatarId, setSelectedAvatarId] = useState('avatar_1');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState(null); // { avatarId, type: 'idle' | 'talk' }
  const [previewingVoiceId, setPreviewingVoiceId] = useState(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [canvasAspectRatio, setCanvasAspectRatio] = useState('9:16'); // '9:16' | '16:9'

  // Dragging state
  const [draggingAvatarId, setDraggingAvatarId] = useState(null);
  const canvasRef = useRef(null);
  const dragStartPosRef = useRef({ mouseX: 0, mouseY: 0, startX: 0, startY: 0 });

  useEffect(() => {
    setConfig(getMultiAvatarConfig());
  }, []);

  const handleActiveCountChange = (count) => {
    const updated = {
      ...config,
      activeCount: count,
      avatars: config.avatars.map((av, idx) => ({
        ...av,
        enabled: idx < count
      }))
    };
    setConfig(updated);
    saveMultiAvatarConfig(updated);
  };

  const handleAvatarChange = (avatarId, field, value) => {
    const updated = {
      ...config,
      avatars: config.avatars.map(av => av.id === avatarId ? { ...av, [field]: value } : av)
    };
    setConfig(updated);
    saveMultiAvatarConfig(updated);
  };

  const handleAvatarTransformChange = (avatarId, field, value) => {
    const updated = {
      ...config,
      layoutMode: 'custom_canvas',
      avatars: config.avatars.map(av => {
        if (av.id === avatarId) {
          return {
            ...av,
            transform: {
              ...(av.transform || { x: 0, y: 0, width: 50, height: 50, zIndex: 1, pose: 'stand', objectFit: 'cover' }),
              [field]: value
            }
          };
        }
        return av;
      })
    };
    setConfig(updated);
    saveMultiAvatarConfig(updated);
  };

  const handleApplyPresetLayout = (presetKey) => {
    const preset = STUDIO_STAGE_PRESETS[presetKey];
    if (!preset || !preset.transforms) return;

    const updated = {
      ...config,
      layoutMode: presetKey,
      avatars: config.avatars.map(av => {
        const trans = preset.transforms[av.id];
        return trans ? { ...av, transform: { ...(av.transform || {}), ...trans } } : av;
      })
    };
    setConfig(updated);
    saveMultiAvatarConfig(updated);
  };

  const handleSelectBackground = (preset) => {
    const updated = {
      ...config,
      backgroundUrl: preset.url || '',
      backgroundColor: preset.color || '#0a0c14'
    };
    setConfig(updated);
    saveMultiAvatarConfig(updated);
  };

  const handleCustomBackgroundUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    const updated = {
      ...config,
      backgroundUrl: objectUrl
    };
    setConfig(updated);
    saveMultiAvatarConfig(updated);
  };

  const handleVoicePreview = (voiceId, sampleText) => {
    if (previewingVoiceId === voiceId) {
      stopVoiceAudio();
      setPreviewingVoiceId(null);
      return;
    }
    const voiceObj = ALL_SYSTEM_VOICES.find(v => v.id === voiceId);
    if (!voiceObj) return;

    setPreviewingVoiceId(voiceId);
    previewVoiceAudio(
      voiceObj, 
      sampleText || voiceObj.sampleText || 'Xin chào cả nhà! Đây là giọng đọc mẫu của nhân vật.', 
      {
        onEnd: () => setPreviewingVoiceId(null)
      }
    );
  };

  const handleSave = () => {
    saveMultiAvatarConfig(config);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      if (onClose) onClose();
    }, 800);
  };

  const handleSelectMedia = (mediaItem) => {
    if (!mediaPickerTarget) return;
    const { avatarId, type } = mediaPickerTarget;
    const url = mediaItem.mediaUrl || (mediaItem.fileBlob ? URL.createObjectURL(mediaItem.fileBlob) : '');
    handleAvatarChange(avatarId, type === 'idle' ? 'idleVideo' : 'talkVideo', url);
    setMediaPickerTarget(null);
  };

  // Drag and drop handlers on visual stage canvas
  const handleMouseDownOnAvatar = (e, avatarId) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedAvatarId(avatarId);
    setDraggingAvatarId(avatarId);

    const avatar = config.avatars.find(a => a.id === avatarId);
    dragStartPosRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: avatar?.transform?.x ?? 0,
      startY: avatar?.transform?.y ?? 0
    };
  };

  const handleMouseMove = (e) => {
    if (!draggingAvatarId || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    const deltaX = ((e.clientX - dragStartPosRef.current.mouseX) / rect.width) * 100;
    const deltaY = ((e.clientY - dragStartPosRef.current.mouseY) / rect.height) * 100;

    let newX = Math.round(dragStartPosRef.current.startX + deltaX);
    let newY = Math.round(dragStartPosRef.current.startY + deltaY);

    newX = Math.max(0, Math.min(85, newX));
    newY = Math.max(0, Math.min(85, newY));

    handleAvatarTransformChange(draggingAvatarId, 'x', newX);
    handleAvatarTransformChange(draggingAvatarId, 'y', newY);
  };

  const handleMouseUp = () => {
    setDraggingAvatarId(null);
  };

  useEffect(() => {
    if (draggingAvatarId) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggingAvatarId]);

  const activeAvatars = (config.avatars || []).slice(0, config.activeCount);
  const selectedAvatar = config.avatars.find(a => a.id === selectedAvatarId) || config.avatars[0];

  return (
    <div className={`flex flex-col h-full ${isEmbedded ? 'bg-transparent text-gray-800' : 'bg-[#11131a] text-white'}`}>
      
      {/* 1. TOP HEADER & MAIN CONTROLS */}
      <div className={`p-4 border-b flex flex-wrap items-center justify-between gap-3 shrink-0 ${isEmbedded ? 'bg-white border-gray-200 rounded-2xl shadow-xs mb-3' : 'bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white'}`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-inner ${isEmbedded ? 'bg-indigo-50 text-indigo-600 border border-indigo-200' : 'bg-white/10 text-cyan-300 border border-white/20'}`}>
            <Users size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black tracking-wide">STUDIO SÂN KHẤU ĐA NHÂN VẬT (2 – 4 AVATAR)</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-400/40">
                DRAG & DROP SÂN KHẤU
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Tự do kéo thả, sắp xếp vị trí đứng / ngồi, lồng ghép phông nền và chuyển đổi khẩu hình nói theo kịch bản.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setShowHelpModal(true)}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
              isEmbedded 
                ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300' 
                : 'bg-white/10 hover:bg-white/20 text-yellow-300 border border-yellow-400/30'
            }`}
            title="Xem hướng dẫn chi tiết cách kết nối TikTok Live Studio / OBS"
          >
            <HelpCircle size={15} />
            <span>(?) Hướng Dẫn Kéo Thả & OBS</span>
          </button>
          
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-xs shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            {savedSuccess ? <Check size={14} /> : <Sparkles size={14} />}
            <span>{savedSuccess ? 'Đã Lưu Thành Công!' : 'Lưu Sân Khấu'}</span>
          </button>
        </div>
      </div>

      {/* 2. SUB HEADER: TABS & QUICK PRESET LAYOUTS */}
      <div className={`px-4 py-2.5 border-b flex flex-wrap items-center justify-between gap-3 shrink-0 ${isEmbedded ? 'bg-white border-gray-200 rounded-xl mb-3' : 'bg-[#161822] border-gray-800'}`}>
        {/* Số Lượng Nhân Vật */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Số nhân vật:</span>
          <div className="flex items-center bg-slate-100 dark:bg-black/40 p-1 rounded-xl border border-gray-300 dark:border-gray-800 gap-1">
            {[
              { count: 2, label: '2 Người', icon: '👥' },
              { count: 3, label: '3 Người', icon: '🎭' },
              { count: 4, label: '4 Người', icon: '🌟' }
            ].map(item => (
              <button
                key={item.count}
                type="button"
                onClick={() => handleActiveCountChange(item.count)}
                className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1 cursor-pointer ${
                  config.activeCount === item.count
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm scale-102'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tỷ Lệ Màn Hình Live */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tỷ lệ:</span>
          <div className="flex items-center bg-slate-100 dark:bg-black/40 p-0.5 rounded-lg border border-gray-300 dark:border-gray-800 text-xs font-bold">
            <button
              type="button"
              onClick={() => setCanvasAspectRatio('9:16')}
              className={`px-2 py-1 rounded flex items-center gap-1 cursor-pointer ${canvasAspectRatio === '9:16' ? 'bg-blue-600 text-white shadow-xs' : 'text-gray-600 dark:text-gray-400'}`}
            >
              <Smartphone size={12} /> 9:16 (TikTok Dọc)
            </button>
            <button
              type="button"
              onClick={() => setCanvasAspectRatio('16:9')}
              className={`px-2 py-1 rounded flex items-center gap-1 cursor-pointer ${canvasAspectRatio === '16:9' ? 'bg-blue-600 text-white shadow-xs' : 'text-gray-600 dark:text-gray-400'}`}
            >
              <Monitor size={12} /> 16:9 (OBS Ngang)
            </button>
          </div>
        </div>

        {/* Tabs Điều Khiển */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('canvas')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'canvas' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-blue-600'
            }`}
          >
            <Move size={13} /> Sân Khấu Kéo Thả
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('avatars')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'avatars' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-indigo-600'
            }`}
          >
            <Video size={13} /> Cấu Hình Video & Voice
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('templates')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'templates' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-purple-600'
            }`}
          >
            <MessageSquare size={13} /> Kịch Bản Đối Thoại
          </button>
        </div>
      </div>

      {/* 3. MAIN WORKSPACE CONTENT */}
      <div className="flex-1 overflow-y-auto p-3">
        {activeTab === 'canvas' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full min-h-[560px]">
            
            {/* CỘT TRÁI: VISUAL CANVAS TRỰC QUAN (7 CỘT) */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center p-3 rounded-2xl bg-[#090b10] border border-gray-800 shadow-inner relative select-none">
              
              {/* TOP BAR TRONG CANVAS: PRESET NÚT BẤM NHANH */}
              <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-gray-800/80 text-xs">
                <span className="font-bold text-gray-400 flex items-center gap-1.5">
                  <Palette size={13} className="text-cyan-400" /> Bố Cục Sân Khấu Sẵn:
                </span>
                <div className="flex items-center gap-1 flex-wrap">
                  {Object.entries(STUDIO_STAGE_PRESETS).filter(([k]) => k !== 'custom_canvas').map(([key, preset]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleApplyPresetLayout(key)}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                        config.layoutMode === key
                          ? 'bg-cyan-500 text-black shadow-xs font-black'
                          : 'bg-white/10 hover:bg-white/20 text-gray-300'
                      }`}
                    >
                      {preset.name.split(' ')[0]} {preset.name.split(' ')[1]}
                    </button>
                  ))}
                </div>
              </div>

              {/* KHUNG CANVAS STREAMING SỐNG ĐỘNG */}
              <div 
                ref={canvasRef}
                className={`relative overflow-hidden rounded-2xl border-2 border-cyan-500/40 shadow-2xl transition-all duration-300 bg-cover bg-center`}
                style={{
                  width: canvasAspectRatio === '9:16' ? '320px' : '520px',
                  height: canvasAspectRatio === '9:16' ? '568px' : '292px',
                  backgroundColor: config.backgroundColor || '#0a0c14',
                  backgroundImage: config.backgroundUrl ? `url(${config.backgroundUrl})` : 'none'
                }}
              >
                {/* GRID LINES HELPER */}
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-10">
                  <div className="border-r border-b border-white" />
                  <div className="border-r border-b border-white" />
                  <div className="border-b border-white" />
                  <div className="border-r border-b border-white" />
                  <div className="border-r border-b border-white" />
                  <div className="border-b border-white" />
                  <div className="border-r border-white" />
                  <div className="border-r border-white" />
                  <div />
                </div>

                {/* RENDER ACTIVE AVATARS ON CANVAS */}
                {activeAvatars.map((avatar, idx) => {
                  const transform = avatar.transform || { x: idx * 25, y: 10, width: 45, height: 75, zIndex: 5, pose: 'stand', objectFit: 'cover' };
                  const isSelected = selectedAvatarId === avatar.id;
                  const isDragging = draggingAvatarId === avatar.id;

                  return (
                    <div
                      key={avatar.id}
                      onMouseDown={(e) => handleMouseDownOnAvatar(e, avatar.id)}
                      className={`absolute rounded-xl overflow-hidden cursor-move transition-shadow duration-150 flex flex-col justify-between ${
                        isSelected 
                          ? 'ring-2 ring-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.6)]' 
                          : 'ring-1 ring-white/30 hover:ring-white/60'
                      }`}
                      style={{
                        left: `${transform.x}%`,
                        top: `${transform.y}%`,
                        width: `${transform.width}%`,
                        height: `${transform.height}%`,
                        zIndex: transform.zIndex || 5
                      }}
                    >
                      {/* VIDEO HOẶC PLACEHOLDER AVATAR */}
                      {avatar.idleVideo || avatar.talkVideo ? (
                        <video
                          src={avatar.talkVideo || avatar.idleVideo}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-full pointer-events-none"
                          style={{ objectFit: transform.objectFit || 'cover' }}
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-900/90 flex flex-col items-center justify-center p-2 text-center text-white border border-white/10">
                          <span className="text-2xl mb-1">{transform.pose === 'sit' ? '🪑' : '🧍'}</span>
                          <span className="text-[11px] font-black">{avatar.name}</span>
                          <span className="text-[9px] text-cyan-300 font-mono">[{avatar.tag}]</span>
                        </div>
                      )}

                      {/* BADGE TÊN & VAI TRÒ */}
                      <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm text-[10px] font-black text-white border border-white/20 flex items-center gap-1 pointer-events-none">
                        <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-cyan-400 animate-ping' : 'bg-emerald-400'}`} />
                        <span>#{idx + 1} {avatar.name}</span>
                        <span className="text-yellow-300 text-[9px]">({transform.pose === 'sit' ? 'Ngồi' : 'Đứng'})</span>
                      </div>

                      {/* DRAG HANDLE INDICATOR */}
                      <div className="absolute bottom-1 right-1 p-1 bg-black/60 rounded text-[9px] text-white/70 pointer-events-none">
                        <Move size={10} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="text-[11px] text-gray-500 mt-2 font-mono">
                💡 Bấm và giữ chuột vào từng nhân vật để kéo thả vị trí (X, Y) trực tiếp trên sân khấu
              </p>
            </div>

            {/* CỘT PHẢI: BẢNG TINH CHỈNH VỊ TRÍ, TƯ THẾ & BACKGROUND (5 CỘT) */}
            <div className="lg:col-span-5 space-y-3.5">
              
              {/* CHỌN NHÂN VẬT ĐANG TINH CHỈNH */}
              <div className={`p-3.5 rounded-2xl border ${isEmbedded ? 'bg-white border-gray-200 shadow-xs' : 'bg-[#171922] border-gray-800'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black uppercase text-gray-500 tracking-wider">
                    Đang chọn chỉnh nhân vật:
                  </span>
                  <span className="text-xs font-bold text-cyan-500">
                    {selectedAvatar.name} ({selectedAvatar.role})
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {activeAvatars.map((av, idx) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setSelectedAvatarId(av.id)}
                      className={`p-2 rounded-xl text-xs font-black transition-all text-center cursor-pointer border ${
                        selectedAvatarId === av.id
                          ? 'bg-cyan-500 text-black border-cyan-400 shadow-sm scale-102'
                          : 'bg-slate-100 dark:bg-black/30 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-800'
                      }`}
                    >
                      <div>#{idx + 1}</div>
                      <div className="truncate text-[11px]">{av.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* TÙY CHỈNH TỌA ĐỘ, KÍCH THƯỚC, TƯ THẾ NHÂN VẬT ĐANG CHỌN */}
              <div className={`p-4 rounded-2xl border space-y-3 ${isEmbedded ? 'bg-white border-gray-200 shadow-xs' : 'bg-[#171922] border-gray-800'}`}>
                <div className="flex items-center justify-between border-b pb-2 border-gray-200 dark:border-gray-800">
                  <h4 className="text-xs font-black uppercase text-blue-600 flex items-center gap-1.5">
                    <Sliders size={14} /> Tọa Độ & Kích Thước: {selectedAvatar.name}
                  </h4>
                  <span className="text-[11px] font-mono text-gray-500">[{selectedAvatar.tag}]</span>
                </div>

                {/* TƯ THẾ: ĐỨNG / NGỒI / NỬA NGƯỜI */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-300 flex items-center justify-between">
                    <span>Tư thế trên sân khấu:</span>
                    <span className="text-cyan-500 font-bold">{selectedAvatar.transform?.pose === 'sit' ? '🪑 Ngồi Ghế / Bàn' : selectedAvatar.transform?.pose === 'half' ? '👤 Nửa Người' : '🧍 Đứng Thẳng'}</span>
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { pose: 'stand', label: '🧍 Đứng', desc: 'Đứng Livestream' },
                      { pose: 'sit', label: '🪑 Ngồi', desc: 'Ngồi Ghế / Bàn' },
                      { pose: 'half', label: '👤 Nửa Người', desc: 'Cận Cảnh' }
                    ].map(p => (
                      <button
                        key={p.pose}
                        type="button"
                        onClick={() => handleAvatarTransformChange(selectedAvatar.id, 'pose', p.pose)}
                        className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          selectedAvatar.transform?.pose === p.pose
                            ? 'bg-blue-600 text-white border-blue-500 shadow-xs'
                            : 'bg-slate-50 dark:bg-black/30 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800'
                        }`}
                      >
                        <div>{p.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* SLIDERS TỌA ĐỘ VÀ KÍCH THƯỚC */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[11px] font-bold text-gray-500 block mb-1">
                      Kích Thước (Width): {selectedAvatar.transform?.width || 50}%
                    </label>
                    <input 
                      type="range" 
                      min="20" 
                      max="100" 
                      value={selectedAvatar.transform?.width || 50} 
                      onChange={(e) => handleAvatarTransformChange(selectedAvatar.id, 'width', Number(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-500 block mb-1">
                      Chiều Cao (Height): {selectedAvatar.transform?.height || 50}%
                    </label>
                    <input 
                      type="range" 
                      min="20" 
                      max="100" 
                      value={selectedAvatar.transform?.height || 50} 
                      onChange={(e) => handleAvatarTransformChange(selectedAvatar.id, 'height', Number(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-500 block mb-1">
                      Vị trí Ngang (X): {selectedAvatar.transform?.x || 0}%
                    </label>
                    <input 
                      type="range" 
                      min="0" 
                      max="85" 
                      value={selectedAvatar.transform?.x || 0} 
                      onChange={(e) => handleAvatarTransformChange(selectedAvatar.id, 'x', Number(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-500 block mb-1">
                      Vị trí Dọc (Y): {selectedAvatar.transform?.y || 0}%
                    </label>
                    <input 
                      type="range" 
                      min="0" 
                      max="85" 
                      value={selectedAvatar.transform?.y || 0} 
                      onChange={(e) => handleAvatarTransformChange(selectedAvatar.id, 'y', Number(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                  </div>
                </div>

                {/* THỨ TỰ LỚP (Z-INDEX) & TỶ LỆ OBJECT FIT */}
                <div className="flex items-center justify-between pt-1 border-t border-gray-100 dark:border-gray-800 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-gray-500">Lớp hiển thị:</span>
                    <button
                      type="button"
                      onClick={() => handleAvatarTransformChange(selectedAvatar.id, 'zIndex', (selectedAvatar.transform?.zIndex || 5) + 1)}
                      className="px-2 py-0.5 rounded bg-slate-100 dark:bg-black/30 border border-gray-300 dark:border-gray-800 text-xs font-bold cursor-pointer"
                      title="Đưa nhân vật lên phía trước"
                    >
                      ⬆ Lên Trước ({selectedAvatar.transform?.zIndex || 5})
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAvatarTransformChange(selectedAvatar.id, 'zIndex', Math.max(1, (selectedAvatar.transform?.zIndex || 5) - 1))}
                      className="px-2 py-0.5 rounded bg-slate-100 dark:bg-black/30 border border-gray-300 dark:border-gray-800 text-xs font-bold cursor-pointer"
                      title="Đưa nhân vật ra phía sau"
                    >
                      ⬇ Xuống Sau
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAvatarTransformChange(selectedAvatar.id, 'objectFit', selectedAvatar.transform?.objectFit === 'contain' ? 'cover' : 'contain')}
                    className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-600 text-xs font-bold border border-blue-200 dark:border-blue-800 cursor-pointer"
                  >
                    Fit: {selectedAvatar.transform?.objectFit || 'cover'}
                  </button>
                </div>
              </div>

              {/* CHỌN PHÔNG NỀN PHÒNG LIVE (STUDIO BACKGROUND) */}
              <div className={`p-4 rounded-2xl border space-y-2.5 ${isEmbedded ? 'bg-white border-gray-200 shadow-xs' : 'bg-[#171922] border-gray-800'}`}>
                <div className="flex items-center justify-between border-b pb-2 border-gray-200 dark:border-gray-800">
                  <h4 className="text-xs font-black uppercase text-purple-600 flex items-center gap-1.5">
                    <Image size={14} /> Phông Nền Phòng Live (Studio Background)
                  </h4>
                  <label className="text-[11px] font-bold text-purple-600 hover:underline flex items-center gap-1 cursor-pointer">
                    <Upload size={12} /> Tải Nền Riêng
                    <input type="file" accept="image/*,video/*" onChange={handleCustomBackgroundUpload} className="hidden" />
                  </label>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {STUDIO_BACKGROUND_PRESETS.map(bg => (
                    <button
                      key={bg.id}
                      type="button"
                      onClick={() => handleSelectBackground(bg)}
                      className={`p-2 rounded-xl text-xs font-bold border text-left flex items-center gap-2 transition-all cursor-pointer ${
                        config.backgroundUrl === bg.url && config.backgroundColor === bg.color
                          ? 'bg-purple-600 text-white border-purple-500 shadow-xs'
                          : 'bg-slate-50 dark:bg-black/30 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:border-purple-300'
                      }`}
                    >
                      <span className="text-base">{bg.preview}</span>
                      <span className="truncate text-[11px]">{bg.name}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

          </div>
        ) : activeTab === 'avatars' ? (
          /* TAB 2: CẤU HÌNH CHI TIẾT VIDEO VÀ VOICE CHO TỪNG NHÂN VẬT */
          <div className={`grid grid-cols-1 gap-4 ${config.activeCount === 2 ? 'md:grid-cols-2' : config.activeCount === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4'}`}>
            {activeAvatars.map((avatar, idx) => {
              const isVoicePlaying = previewingVoiceId === avatar.voiceId;

              return (
                <div 
                  key={avatar.id} 
                  className={`border-2 rounded-2xl p-4 flex flex-col justify-between shadow-xs transition-all ${
                    isEmbedded 
                      ? 'bg-white border-blue-200/80 hover:border-blue-400' 
                      : 'bg-[#171922] border-gray-800 hover:border-cyan-500/50 text-white'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b pb-2.5 border-gray-200 dark:border-gray-800">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-blue-600 text-white text-xs font-black flex items-center justify-center">
                          #{idx + 1}
                        </span>
                        <div>
                          <input 
                            type="text" 
                            value={avatar.name} 
                            onChange={(e) => handleAvatarChange(avatar.id, 'name', e.target.value)}
                            className="font-black text-sm bg-transparent border-b border-dashed border-gray-400 focus:border-blue-500 focus:outline-none px-1"
                            title="Bấm để đổi tên hiển thị"
                          />
                          <div className="text-[10px] text-gray-500 font-bold uppercase">
                            Vai trò: {avatar.role}
                          </div>
                        </div>
                      </div>

                      <div className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-mono text-[11px] font-bold border border-indigo-200 dark:border-indigo-800">
                        {avatar.tag}
                      </div>
                    </div>

                    {/* GIỌNG ĐỌC AI */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 dark:text-gray-300 flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Mic size={13} className="text-rose-500" /> Giọng Đọc AI:
                        </span>
                        <button
                          type="button"
                          onClick={() => handleVoicePreview(avatar.voiceId)}
                          className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          {isVoicePlaying ? <Square size={11} className="text-red-500" /> : <Play size={11} />}
                          <span>{isVoicePlaying ? 'Dừng' : 'Nghe Thử'}</span>
                        </button>
                      </label>
                      <select
                        value={avatar.voiceId}
                        onChange={(e) => handleAvatarChange(avatar.id, 'voiceId', e.target.value)}
                        className="w-full text-xs font-bold p-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1f222e] text-gray-800 dark:text-white cursor-pointer shadow-inner"
                      >
                        {ALL_SYSTEM_VOICES.map(v => (
                          <option key={v.id} value={v.id}>
                            {v.name} ({v.gender === 'Female' ? 'Nữ' : 'Nam'} - {v.region || 'Việt Nam'})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* VIDEO LẮNG NGHE (IDLE) */}
                    <div className="space-y-1.5 pt-1">
                      <label className="text-xs font-bold text-gray-600 dark:text-gray-300 flex items-center gap-1">
                        <Video size={13} className="text-blue-500" /> Video Lắng Nghe (Idle Video):
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setMediaPickerTarget({ avatarId: avatar.id, type: 'idle' })}
                          className="flex-1 px-3 py-2 rounded-xl text-xs font-bold bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 truncate text-left flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          <FolderOpen size={13} />
                          <span className="truncate">{avatar.idleVideo ? 'Đã gán video nghỉ' : 'Chọn video Idle'}</span>
                        </button>
                        {avatar.idleVideo && (
                          <button
                            type="button"
                            onClick={() => handleAvatarChange(avatar.id, 'idleVideo', '')}
                            className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900 cursor-pointer"
                            title="Xóa video"
                          >
                            <X size={13} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* VIDEO NÓI / KHẨU HÌNH (TALK) */}
                    <div className="space-y-1.5 pt-1">
                      <label className="text-xs font-bold text-gray-600 dark:text-gray-300 flex items-center gap-1">
                        <Sparkles size={13} className="text-amber-500" /> Video Khẩu Hình Nói (Talk Video):
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setMediaPickerTarget({ avatarId: avatar.id, type: 'talk' })}
                          className="flex-1 px-3 py-2 rounded-xl text-xs font-bold bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 truncate text-left flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          <FolderOpen size={13} />
                          <span className="truncate">{avatar.talkVideo ? 'Đã gán video khẩu hình' : 'Chọn video Talk'}</span>
                        </button>
                        {avatar.talkVideo && (
                          <button
                            type="button"
                            onClick={() => handleAvatarChange(avatar.id, 'talkVideo', '')}
                            className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900 cursor-pointer"
                            title="Xóa video"
                          >
                            <X size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-gray-200 dark:border-gray-800 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-gray-500">
                      <span className="flex items-center gap-1"><Gauge size={12} /> Tốc độ đọc:</span>
                      <div className="flex items-center gap-1">
                        <input 
                          type="range" 
                          min="0.8" 
                          max="1.5" 
                          step="0.05" 
                          value={avatar.rate ?? 1.0}
                          onChange={(e) => handleAvatarChange(avatar.id, 'rate', parseFloat(e.target.value))}
                          className="w-16 accent-blue-600"
                        />
                        <span className="w-8 text-right">{(avatar.rate ?? 1.0).toFixed(2)}x</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* TAB 3: KỊCH BẢN ĐỐI THOẠI MẪU */
          <div className="space-y-3 p-2">
            {SCRIPT_TEMPLATES.map(item => (
              <div 
                key={item.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isEmbedded 
                    ? 'bg-white border-purple-200 shadow-xs hover:border-purple-400' 
                    : 'bg-[#171922] border-gray-800 text-white hover:border-purple-500/50'
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div>
                    <h4 className="font-black text-sm text-purple-700 dark:text-purple-300">{item.title}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (onApplyScriptTemplate) {
                        onApplyScriptTemplate(item.script, item.count);
                      } else {
                        try {
                          const evConfigsRaw = localStorage.getItem('aidol_event_configs');
                          if (evConfigsRaw) {
                            const parsed = JSON.parse(evConfigsRaw);
                            if (parsed.script_broadcast) {
                              parsed.script_broadcast.fixedScriptText = item.script;
                              localStorage.setItem('aidol_event_configs', JSON.stringify(parsed));
                            }
                          }
                          handleActiveCountChange(item.count);
                          alert('✨ Đã nạp kịch bản mẫu thành công vào tab Kịch Bản!');
                        } catch (e) {}
                      }
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs shrink-0 shadow-sm cursor-pointer"
                  >
                    Nạp Kịch Bản Này
                  </button>
                </div>
                <pre className="p-3 bg-gray-50 dark:bg-black/40 rounded-xl text-xs font-mono text-gray-700 dark:text-cyan-200 overflow-x-auto border border-gray-200 dark:border-gray-800 max-h-36">
                  {item.script}
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. HELP MODAL (?) */}
      {showHelpModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-150">
          <div className="bg-[#121520] text-white max-w-2xl w-full rounded-3xl border border-yellow-500/40 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-yellow-500/20 text-yellow-300 flex items-center justify-center font-black">
                  ?
                </div>
                <h3 className="text-base font-black text-white">Hướng Dẫn Sắp Xếp Sân Khấu & Phát Live OBS / TikTok Studio</h3>
              </div>
              <button 
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs text-gray-300 leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
              <div className="bg-white/5 p-3.5 rounded-xl border border-white/10 space-y-1.5">
                <h4 className="font-bold text-cyan-300 text-sm">1. 🎨 Kéo thả & Thay đổi vị trí nhân vật (Đứng / Ngồi)</h4>
                <p>• Trong tab <strong>Sân Khấu Kéo Thả</strong>: Bạn có thể bấm giữ chuột vào bất kỳ nhân vật nào để di chuyển đến vị trí mong muốn (Đứng giữa, Ngồi bên cạnh bàn, Ngồi ghế sofa...).<br/>• Chỉnh thanh trượt <strong>Kích thước (Width, Height)</strong> và <strong>Tư thế (Đứng / Ngồi)</strong> để nhân vật hiển thị tự nhiên và cân đối nhất trên sân khấu.</p>
              </div>

              <div className="bg-white/5 p-3.5 rounded-xl border border-white/10 space-y-1.5">
                <h4 className="font-bold text-yellow-300 text-sm">2. 🖼️ Lồng ghép phông nền phòng live (Studio Background)</h4>
                <p>• Chọn các phông nền 4K chất lượng cao có sẵn (Phòng Studio Neon, Showroom Bán Hàng, Sân Khấu Talkshow, Đấu Trường PK) hoặc tải ảnh/video phông nền tùy ý từ máy tính.<br/>• Các nhân vật sẽ được đặt nổi bật trên nền phòng live đã chọn.</p>
              </div>

              <div className="bg-white/5 p-3.5 rounded-xl border border-white/10 space-y-1.5">
                <h4 className="font-bold text-emerald-300 text-sm">3. 📺 Đưa lên TikTok Live Studio & OBS (Window Capture / Browser Source)</h4>
                <p>• <strong>Window Capture (Khuyên dùng):</strong> Bắt cửa sổ phần mềm AvaLive để đạt 60fps mượt mà nhất. Khung sân khấu kéo thả sẽ hiển thị 100% chính xác từng vị trí nhân vật.<br/>• <strong>Browser Source (Đường Link):</strong> Dán link Overlay <code className="text-cyan-300">http://localhost:5173/?overlay=live</code> vào nguồn Trình duyệt. Luồng phát tự động đồng bộ thời gian thực.</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2.5 bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-black text-xs rounded-xl shadow-lg hover:from-yellow-400 hover:to-amber-500 cursor-pointer"
            >
              Đã Hiểu & Đóng Hướng Dẫn
            </button>
          </div>
        </div>
      )}

      {/* 5. MEDIA PICKER MODAL */}
      {mediaPickerTarget && (
        <UniversalMediaPicker 
          isOpen={true}
          onClose={() => setMediaPickerTarget(null)}
          onSelectMedia={handleSelectMedia}
          category={mediaPickerTarget.type === 'idle' ? 'idle' : 'greeting'}
          title={`Chọn Video ${mediaPickerTarget.type === 'idle' ? 'Nghỉ (Idle)' : 'Nói (Khẩu hình Lip-sync)'} Cho Nhân Vật`}
        />
      )}
    </div>
  );
}

export default function MultiAvatarStudioModal({ isOpen, onClose, onApplyScriptTemplate }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-[#11131a] text-white max-w-6xl w-full rounded-3xl shadow-2xl border border-cyan-500/30 overflow-hidden flex flex-col max-h-[94vh]">
        <div className="flex-1 overflow-hidden">
          <MultiAvatarStudioPanel 
            isEmbedded={false} 
            onClose={onClose} 
            onApplyScriptTemplate={onApplyScriptTemplate} 
          />
        </div>
      </div>
    </div>
  );
}
