import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, Sparkles, Video, Mic, Volume2, Gauge, HelpCircle, X, Check, Play, Square, 
  Upload, FolderOpen, Layers, ShieldCheck, Info, MessageSquare, Plus, RefreshCw, Eye, BookOpen,
  Move, Maximize2, Palette, Sliders, Image as ImageIcon, Monitor, Smartphone, ChevronRight, LayoutGrid, CheckCircle2,
  Crop, Wand2, ArrowUp, ArrowDown, ArrowUpToLine, ArrowDownToLine, Scaling, ZoomIn, FileVideo, UserCheck
} from 'lucide-react';
import { 
  ALL_SYSTEM_VOICES, 
  getMultiAvatarConfig, 
  saveMultiAvatarConfig, 
  DEFAULT_MULTI_AVATAR_CONFIG,
  STUDIO_BACKGROUND_PRESETS,
  STUDIO_STAGE_PRESETS,
  previewVoiceAudio,
  stopVoiceAudio,
  isImageMedia,
  getChromaStyle
} from '../../utils/voiceSyncService';
import UniversalMediaPicker from './UniversalMediaPicker';

export const SvgChromaFilters = () => (
  <svg width="0" height="0" className="absolute pointer-events-none opacity-0" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
    <defs>
      <filter id="avalive-chroma-green" colorInterpolationFilters="sRGB">
        <feColorMatrix
          type="matrix"
          values="
            1.05  0.00  0.00  0.00  0.00
            0.00  1.00  0.00  0.00  0.00
            0.00  0.00  1.05  0.00  0.00
            1.80 -2.20  1.80  1.00  0.00"
        />
      </filter>
      <filter id="avalive-chroma-blue" colorInterpolationFilters="sRGB">
        <feColorMatrix
          type="matrix"
          values="
            1.05  0.00  0.00  0.00  0.00
            0.00  1.05  0.00  0.00  0.00
            0.00  0.00  1.00  0.00  0.00
            1.80  1.80 -2.20  1.00  0.00"
        />
      </filter>
    </defs>
  </svg>
);

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
  const [activeTab, setActiveTab] = useState('canvas'); // 'canvas', 'templates'
  const [selectedAvatarId, setSelectedAvatarId] = useState('avatar_1');
  const [inspectorTab, setInspectorTab] = useState('media_transform'); // 'media_transform', 'chroma', 'voice', 'background'
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState(null); // { avatarId, type: 'idle' | 'talk' }
  const [previewingVoiceId, setPreviewingVoiceId] = useState(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [canvasAspectRatio, setCanvasAspectRatio] = useState('9:16'); // '9:16' | '16:9'

  const [dragOperation, setDragOperation] = useState(null);
  const canvasRef = useRef(null);
  const dragStartPosRef = useRef({ mouseX: 0, mouseY: 0, startX: 0, startY: 0, startW: 50, startH: 50 });

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

  const handleDirectAvatarFileUpload = (avatarId, field, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    handleAvatarChange(avatarId, field, objectUrl);
  };

  const handleApplyPosePreset = (avatarId, poseType) => {
    const poseConfigs = {
      stand: { y: 8, height: 88, width: 50, pose: 'stand' },
      sit_chair: { y: 22, height: 75, width: 55, pose: 'sit' },
      sit_table: { y: 32, height: 66, width: 60, pose: 'sit_desk' },
      half_body: { y: 18, height: 80, width: 62, pose: 'half' },
      close_up: { y: 5, height: 92, width: 78, pose: 'close_up' }
    };

    const targetPose = poseConfigs[poseType];
    if (!targetPose) return;

    const updated = {
      ...config,
      layoutMode: 'custom_canvas',
      avatars: config.avatars.map(av => {
        if (av.id === avatarId) {
          return {
            ...av,
            transform: {
              ...(av.transform || {}),
              ...targetPose
            }
          };
        }
        return av;
      })
    };
    setConfig(updated);
    saveMultiAvatarConfig(updated);
  };

  const handleFillScreen = (avatarId) => {
    const updated = {
      ...config,
      layoutMode: 'custom_canvas',
      avatars: config.avatars.map(av => av.id === avatarId ? { ...av, transform: { ...(av.transform || {}), x: 0, y: 0, width: 100, height: 100 } } : av)
    };
    setConfig(updated);
    saveMultiAvatarConfig(updated);
  };

  const handleCenterAvatar = (avatarId) => {
    const av = config.avatars.find(a => a.id === avatarId);
    const w = av?.transform?.width || 50;
    const h = av?.transform?.height || 50;
    const updated = {
      ...config,
      layoutMode: 'custom_canvas',
      avatars: config.avatars.map(a => a.id === avatarId ? { ...a, transform: { ...(a.transform || {}), x: Math.max(0, Math.round((100 - w) / 2)), y: Math.max(0, Math.round((100 - h) / 2)) } } : a)
    };
    setConfig(updated);
    saveMultiAvatarConfig(updated);
  };

  const handleBringToFront = (avatarId) => handleAvatarTransformChange(avatarId, 'zIndex', 50);
  const handleSendToBack = (avatarId) => handleAvatarTransformChange(avatarId, 'zIndex', 1);

  const handleAvatarTransformChange = (avatarId, field, value) => {
    const updated = {
      ...config,
      layoutMode: 'custom_canvas',
      avatars: config.avatars.map(av => av.id === avatarId ? { ...av, transform: { ...(av.transform || { x: 0, y: 0, width: 50, height: 50, zIndex: 1, pose: 'stand', objectFit: 'cover', borderRadius: 16 }), [field]: value } } : av)
    };
    setConfig(updated);
    saveMultiAvatarConfig(updated);
  };

  const handleAvatarChromaChange = (avatarId, field, value) => {
    const updated = {
      ...config,
      avatars: config.avatars.map(av => av.id === avatarId ? { ...av, chromaKey: { ...(av.chromaKey || { enabled: false, color: '#00ff00', similarity: 0.45, smoothness: 0.15, spill: 0.15, mode: 'green' }), [field]: value } } : av)
    };
    setConfig(updated);
    saveMultiAvatarConfig(updated);
  };

  const handleApplyPresetLayout = (presetKey) => {
    const preset = STUDIO_STAGE_PRESETS[presetKey];
    if (!preset || !preset.transforms) return;
    const updated = { ...config, layoutMode: presetKey, avatars: config.avatars.map(av => ({ ...av, transform: { ...(av.transform || {}), ...(preset.transforms[av.id] || {}) } })) };
    setConfig(updated);
    saveMultiAvatarConfig(updated);
  };

  const handleSelectBackground = (preset) => {
    const updated = { ...config, backgroundUrl: preset.url || '', backgroundColor: preset.color || '#0a0c14' };
    setConfig(updated);
    saveMultiAvatarConfig(updated);
  };

  const handleCustomBackgroundUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setConfig({ ...config, backgroundUrl: URL.createObjectURL(file) });
  };

  const handleVoicePreview = (voiceId) => {
    if (previewingVoiceId === voiceId) { stopVoiceAudio(); setPreviewingVoiceId(null); return; }
    const voiceObj = ALL_SYSTEM_VOICES.find(v => v.id === voiceId);
    if (!voiceObj) return;
    setPreviewingVoiceId(voiceId);
    previewVoiceAudio(voiceObj, voiceObj.sampleText || 'Xin chào cả nhà!', { onEnd: () => setPreviewingVoiceId(null) });
  };

  const handleSave = () => {
    saveMultiAvatarConfig(config);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 800);
  };

  const handleSelectMedia = (mediaItem) => {
    if (!mediaPickerTarget) return;
    const { avatarId, type } = mediaPickerTarget;
    const url = mediaItem.mediaUrl || (mediaItem.fileBlob ? URL.createObjectURL(mediaItem.fileBlob) : '');
    handleAvatarChange(avatarId, type === 'idle' ? 'idleVideo' : 'talkVideo', url);
    setMediaPickerTarget(null);
  };

  const handleMouseDownOnAvatar = (e, avatarId) => {
    e.preventDefault(); e.stopPropagation();
    setSelectedAvatarId(avatarId);
    setDragOperation({ avatarId, mode: 'move' });
    const avatar = config.avatars.find(a => a.id === avatarId);
    const tf = avatar?.transform || { x: 0, y: 0, width: 50, height: 50 };
    dragStartPosRef.current = { mouseX: e.clientX, mouseY: e.clientY, startX: tf.x ?? 0, startY: tf.y ?? 0, startW: tf.width ?? 50, startH: tf.height ?? 50 };
  };

  const handleMouseDownOnHandle = (e, avatarId, mode) => {
    e.preventDefault(); e.stopPropagation();
    setDragOperation({ avatarId, mode });
    const avatar = config.avatars.find(a => a.id === avatarId);
    const tf = avatar?.transform || { x: 0, y: 0, width: 50, height: 50 };
    dragStartPosRef.current = { mouseX: e.clientX, mouseY: e.clientY, startX: tf.x ?? 0, startY: tf.y ?? 0, startW: tf.width ?? 50, startH: tf.height ?? 50 };
  };

  const handleMouseMove = (e) => {
    if (!dragOperation || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const deltaX = ((e.clientX - dragStartPosRef.current.mouseX) / rect.width) * 100;
    const deltaY = ((e.clientY - dragStartPosRef.current.mouseY) / rect.height) * 100;
    const { avatarId, mode } = dragOperation;
    const { startX, startY, startW, startH } = dragStartPosRef.current;

    if (mode === 'move') {
      handleAvatarTransformChange(avatarId, 'x', Math.max(0, Math.min(100 - startW, Math.round(startX + deltaX))));
      handleAvatarTransformChange(avatarId, 'y', Math.max(0, Math.min(100 - startH, Math.round(startY + deltaY))));
    } else if (mode === 'se') {
      handleAvatarTransformChange(avatarId, 'width', Math.max(15, Math.min(100 - startX, Math.round(startW + deltaX))));
      handleAvatarTransformChange(avatarId, 'height', Math.max(15, Math.min(100 - startY, Math.round(startH + deltaY))));
    }
  };

  const handleMouseUp = () => setDragOperation(null);

  useEffect(() => {
    if (dragOperation) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => { window.removeEventListener('mousemove', handleMouseMove); window.removeEventListener('mouseup', handleMouseUp); };
    }
  }, [dragOperation]);

  const activeAvatars = (config.avatars || []).slice(0, config.activeCount);
  const selectedAvatar = config.avatars.find(a => a.id === selectedAvatarId) || config.avatars[0] || {};

  return (
    <div className={`flex flex-col h-full ${isEmbedded ? 'bg-transparent text-gray-800' : 'bg-[#11131a] text-white'}`}>
      <SvgChromaFilters />
      
      <div className={`p-3 border-b flex flex-wrap items-center justify-between gap-2.5 shrink-0 ${isEmbedded ? 'bg-white rounded-2xl shadow-xs mb-3' : 'bg-[#161822] border-gray-800'}`}>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-black text-gray-500 uppercase">Nhân vật:</span>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-black/40 p-1 rounded-xl border border-gray-300 dark:border-gray-700">
              {[2, 3, 4].map(num => (
                <button key={num} type="button" onClick={() => handleActiveCountChange(num)} className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all ${config.activeCount === num ? 'bg-blue-600 text-white shadow-xs scale-102' : 'text-gray-600 dark:text-gray-300 hover:text-blue-600'}`}>{num === 2 ? '👥 2 Người' : num === 3 ? '👨‍👩‍👦 3 Người' : '🌟 4 Người'}</button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-black text-gray-500 uppercase">Khung hình:</span>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-black/40 p-1 rounded-xl border border-gray-300 dark:border-gray-700">
              <button type="button" onClick={() => setCanvasAspectRatio('9:16')} className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1 ${canvasAspectRatio === '9:16' ? 'bg-blue-600 text-white shadow-xs scale-102' : 'text-gray-600 dark:text-gray-300'}`}><Smartphone size={13} /> 9:16</button>
              <button type="button" onClick={() => setCanvasAspectRatio('16:9')} className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1 ${canvasAspectRatio === '16:9' ? 'bg-blue-600 text-white shadow-xs scale-102' : 'text-gray-600 dark:text-gray-300'}`}><Monitor size={13} /> 16:9</button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-black/40 p-1 rounded-xl border border-gray-300 dark:border-gray-700">
          <button type="button" onClick={() => setActiveTab('canvas')} className={`px-3 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 ${activeTab === 'canvas' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 dark:text-gray-400'}`}><Move size={13} /> Sân Khấu</button>
          <button type="button" onClick={() => setActiveTab('templates')} className={`px-3 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 ${activeTab === 'templates' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-600 dark:text-gray-400'}`}><MessageSquare size={13} /> Kịch Bản</button>
        </div>

        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setShowHelpModal(true)} className="px-2.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300"><HelpCircle size={14} /> (?) HD</button>
          <button type="button" onClick={handleSave} className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs shadow-md flex items-center gap-1.5">{savedSuccess ? <Check size={14} /> : <Sparkles size={14} />} {savedSuccess ? 'Đã Lưu!' : 'Lưu Sân Khấu'}</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'canvas' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 p-4 items-start">
            <div className="lg:col-span-7 flex flex-col items-center justify-start p-4 rounded-3xl bg-[#0a0c13] border border-gray-800 shadow-2xl relative select-none">
              <div className="w-full flex items-center justify-between pb-2.5 mb-2.5 border-b border-gray-800 text-xs flex-wrap gap-1.5">
                <span className="font-bold text-gray-400 flex items-center gap-1.5"><Palette size={13} className="text-cyan-400" /> Bố Cục Sẵn:</span>
                <div className="flex items-center gap-1 flex-wrap">
                  {Object.entries(STUDIO_STAGE_PRESETS).filter(([k]) => k !== 'custom_canvas').map(([key, preset]) => (
                    <button key={key} type="button" onClick={() => handleApplyPresetLayout(key)} className={`px-2 py-1 rounded-lg text-[11px] font-black ${config.layoutMode === key ? 'bg-cyan-500 text-black shadow-xs' : 'bg-white/10 text-gray-300'}`}>{preset.name.split(' ')[0]}</button>
                  ))}
                </div>
              </div>

              <div ref={canvasRef} className="relative overflow-hidden rounded-2xl border-2 border-cyan-500/50 transition-all bg-cover bg-center my-1" style={{ width: canvasAspectRatio === '9:16' ? '330px' : '560px', height: canvasAspectRatio === '9:16' ? '586px' : '315px', backgroundColor: config.backgroundColor || '#0a0c14', backgroundImage: config.backgroundUrl ? `url(${config.backgroundUrl})` : 'none' }}>
                {activeAvatars.map((avatar, idx) => {
                  const transform = avatar.transform || { x: idx * 20, y: 10, width: 40, height: 70, zIndex: 5, pose: 'stand', objectFit: 'cover', borderRadius: 16 };
                  const mediaSrc = avatar.talkVideo || avatar.idleVideo;
                  const chromaStyle = getChromaStyle(avatar.chromaKey || config.chromaKey);
                  return (
                    <div key={avatar.id} onMouseDown={(e) => handleMouseDownOnAvatar(e, avatar.id)} className={`absolute cursor-move border ${selectedAvatarId === avatar.id ? 'ring-2 ring-cyan-400' : 'ring-1 ring-white/20'}`} style={{ left: `${transform.x}%`, top: `${transform.y}%`, width: `${transform.width}%`, height: `${transform.height}%`, zIndex: transform.zIndex || 5, borderRadius: `${transform.borderRadius ?? 16}px` }}>
                      <div className="w-full h-full overflow-hidden rounded-[inherit] relative group" style={chromaStyle}>
                        {mediaSrc ? (
                          <>
                            {isImageMedia(mediaSrc) ? <img src={mediaSrc} className="w-full h-full" style={{ objectFit: transform.objectFit }} /> : <video src={mediaSrc} autoPlay loop muted className="w-full h-full" style={{ objectFit: transform.objectFit }} />}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1.5 p-1">
                                <label className="px-2 py-1 rounded bg-blue-600 text-[10px] text-white cursor-pointer"><Upload size={10} /><input type="file" accept="video/*,image/*" onChange={(e) => handleDirectAvatarFileUpload(avatar.id, 'talkVideo', e)} className="hidden" /></label>
                                <button type="button" onClick={() => setMediaPickerTarget({ avatarId: avatar.id, type: 'talk' })} className="px-2 py-1 rounded bg-purple-600 text-[10px] text-white"><FolderOpen size={10} /></button>
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full bg-slate-900/95 flex flex-col items-center justify-center border-2 border-dashed border-cyan-500/40 rounded-[inherit]">
                            <span className="text-xl">{transform.pose === 'sit' ? '🪑' : '🧍'}</span>
                            <span className="text-[10px] text-cyan-300 font-black">{avatar.name}</span>
                          </div>
                        )}
                      </div>
                      {selectedAvatarId === avatar.id && (
                        <div onMouseDown={(e) => handleMouseDownOnHandle(e, avatar.id, 'se')} className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-cyan-400 border-2 border-black rounded-sm cursor-nwse-resize z-40" />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-1.5 mt-2 flex-wrap justify-center text-xs">
                <button type="button" onClick={() => handleFillScreen(selectedAvatar.id)} className="px-2.5 py-1 rounded-lg bg-white/10 text-cyan-300 font-bold flex items-center gap-1 border border-cyan-500/30"><Maximize2 size={12} /> Full Màn Hình</button>
                <button type="button" onClick={() => handleCenterAvatar(selectedAvatar.id)} className="px-2.5 py-1 rounded-lg bg-white/10 text-yellow-300 font-bold flex items-center gap-1 border border-yellow-500/30"><Scaling size={12} /> Căn Giữa</button>
                <button type="button" onClick={() => handleBringToFront(selectedAvatar.id)} className="px-2.5 py-1 rounded-lg bg-white/10 text-white font-bold flex items-center gap-1 border border-white/20"><ArrowUpToLine size={12} /> Lên Đầu</button>
                <button type="button" onClick={() => handleSendToBack(selectedAvatar.id)} className="px-2.5 py-1 rounded-lg bg-white/10 text-white font-bold flex items-center gap-1 border border-white/20"><ArrowDownToLine size={12} /> Xuống Đáy</button>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-2.5">
              <div className={`p-3 rounded-2xl border ${isEmbedded ? 'bg-white' : 'bg-[#171922] border-gray-800'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-black uppercase text-gray-500">Nhân vật đang chọn:</span>
                  <div className="flex items-center gap-1.5">
                    <input type="text" value={selectedAvatar.name || ''} onChange={(e) => handleAvatarChange(selectedAvatar.id, 'name', e.target.value)} className="font-black text-xs text-cyan-400 bg-transparent border-b border-dashed border-gray-400 text-right" />
                    <span className="text-[10px] text-gray-400">({selectedAvatar.role})</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {activeAvatars.map((av, idx) => (
                    <button key={av.id} type="button" onClick={() => setSelectedAvatarId(av.id)} className={`p-2 rounded-xl text-xs font-black border ${selectedAvatarId === av.id ? 'bg-cyan-500 text-black' : 'bg-slate-100 dark:bg-black/30 text-gray-300 border-gray-800'}`}>
                      <div>#{idx + 1}</div>
                      <div className="truncate text-[11px]">{av.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className={`p-3 rounded-2xl border ${isEmbedded ? 'bg-white' : 'bg-[#171922] border-gray-800'}`}>
                <div className="flex items-center justify-between border-b pb-1.5 border-gray-800">
                  <h4 className="text-xs font-black uppercase text-cyan-600 flex items-center gap-1.5"><FileVideo size={14} /> Video / Hình Ảnh: {selectedAvatar.name}</h4>
                </div>
                <div className="space-y-2 mt-2">
                  <label className="text-[11px] font-bold text-gray-300">Video/Ảnh Nói (Khẩu Hình):</label>
                  <div className="flex items-center gap-1.5">
                    <label className="flex-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500/10 border border-amber-500/30 flex items-center justify-center gap-1.5 cursor-pointer"><Upload size={13} /> <span>Tải từ máy</span><input type="file" accept="video/*,image/*" onChange={(e) => handleDirectAvatarFileUpload(selectedAvatar.id, 'talkVideo', e)} className="hidden" /></label>
                    <button type="button" onClick={() => setMediaPickerTarget({ avatarId: selectedAvatar.id, type: 'talk' })} className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-white/10 flex items-center gap-1"><FolderOpen size={13} /> Thư Viện</button>
                    {selectedAvatar.talkVideo && <button type="button" onClick={() => handleAvatarChange(selectedAvatar.id, 'talkVideo', '')} className="p-1.5 rounded-xl border border-red-900 text-red-500"><X size={13} /></button>}
                  </div>
                </div>
                <div className="space-y-2 mt-3">
                  <label className="text-[11px] font-bold text-gray-300">Video/Ảnh Nghỉ / Lắng Nghe:</label>
                  <div className="flex items-center gap-1.5">
                    <label className="flex-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-blue-500/10 border border-blue-500/30 flex items-center justify-center gap-1.5 cursor-pointer"><Upload size={13} /> <span>Tải từ máy</span><input type="file" accept="video/*,image/*" onChange={(e) => handleDirectAvatarFileUpload(selectedAvatar.id, 'idleVideo', e)} className="hidden" /></label>
                    <button type="button" onClick={() => setMediaPickerTarget({ avatarId: selectedAvatar.id, type: 'idle' })} className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-white/10 flex items-center gap-1"><FolderOpen size={13} /> Thư Viện</button>
                    {selectedAvatar.idleVideo && <button type="button" onClick={() => handleAvatarChange(selectedAvatar.id, 'idleVideo', '')} className="p-1.5 rounded-xl border border-red-900 text-red-500"><X size={13} /></button>}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-gray-800">
                {[
                  { id: 'media_transform', label: '📐 Vị Trí' },
                  { id: 'chroma', label: '🟢 Xóa Phông' },
                  { id: 'voice', label: '🎙️ Giọng AI' },
                  { id: 'background', label: '🖼️ Nền' }
                ].map(tab => (
                  <button key={tab.id} type="button" onClick={() => setInspectorTab(tab.id)} className={`flex-1 py-1.5 text-[11px] font-black rounded-lg ${inspectorTab === tab.id ? 'bg-[#1f222e] text-cyan-300' : 'text-gray-400'}`}>{tab.label}</button>
                ))}
              </div>

              {inspectorTab === 'media_transform' && (
                <div className={`p-3.5 rounded-2xl border ${isEmbedded ? 'bg-white' : 'bg-[#171922] border-gray-800'}`}>
                    <div className="space-y-1">
                        <label className="text-[11px] font-bold text-gray-300">Tư thế sân khấu 1-Click:</label>
                        <div className="grid grid-cols-5 gap-1">
                          {['stand', 'sit_chair', 'sit_table', 'half_body', 'close_up'].map(p => (
                            <button key={p} type="button" onClick={() => handleApplyPosePreset(selectedAvatar.id, p)} className={`py-1.5 px-1 rounded-xl text-[10px] font-bold border ${selectedAvatar.transform?.pose === p ? 'bg-blue-600 text-white' : 'bg-black/30 text-gray-300'}`}>{p.replace('_', ' ')}</button>
                          ))}
                        </div>
                    </div>
                </div>
              )}

              {inspectorTab === 'chroma' && (
                <div className={`p-3.5 rounded-2xl border ${isEmbedded ? 'bg-white' : 'bg-[#171922] border-gray-800'}`}>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-[11px] font-bold text-gray-300">Bật Xóa Phông:</label>
                            <input type="checkbox" checked={!!selectedAvatar.chromaKey?.enabled} onChange={(e) => handleAvatarChromaChange(selectedAvatar.id, 'enabled', e.target.checked)} />
                        </div>
                        <input type="range" min="0.1" max="0.9" step="0.05" value={selectedAvatar.chromaKey?.similarity ?? 0.45} onChange={(e) => handleAvatarChromaChange(selectedAvatar.id, 'similarity', parseFloat(e.target.value))} className="w-full accent-emerald-500" />
                    </div>
                </div>
              )}

              {inspectorTab === 'voice' && (
                <div className={`p-3.5 rounded-2xl border ${isEmbedded ? 'bg-white' : 'bg-[#171922] border-gray-800'}`}>
                    <div className="space-y-2">
                        <select value={selectedAvatar.voiceId} onChange={(e) => handleAvatarChange(selectedAvatar.id, 'voiceId', e.target.value)} className="w-full p-2 text-xs bg-black/40 text-white rounded-xl">
                          {ALL_SYSTEM_VOICES.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                        </select>
                        <div className="flex items-center justify-between text-[11px] font-bold text-gray-500">
                            <label><Gauge size={12} className="inline"/> Tốc độ:</label>
                            <input type="range" min="0.8" max="1.5" step="0.05" value={selectedAvatar.rate ?? 1.0} onChange={(e) => handleAvatarChange(selectedAvatar.id, 'rate', parseFloat(e.target.value))} className="w-24 accent-rose-600" />
                            <span className="w-8 text-right font-mono font-bold">{(selectedAvatar.rate ?? 1.0).toFixed(2)}x</span>
                        </div>
                    </div>
                </div>
              )}

              {inspectorTab === 'background' && (
                <div className={`p-3.5 rounded-2xl border ${isEmbedded ? 'bg-white' : 'bg-[#171922] border-gray-800'}`}>
                    <div className="grid grid-cols-2 gap-2">
                      {STUDIO_BACKGROUND_PRESETS.map(bg => (
                        <button key={bg.id} type="button" onClick={() => handleSelectBackground(bg)} className={`p-2 rounded-xl text-xs font-bold border text-left ${config.backgroundUrl === bg.url ? 'bg-purple-600' : 'bg-black/30'}`}>{bg.name}</button>
                      ))}
                    </div>
                </div>
              )}
            </div>
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
                <h3 className="text-base font-black text-white">Hướng Dẫn Sử Dụng Video Nghỉ (Idle), Video Nói (Talk) & Phát Live TikTok Studio</h3>
              </div>
              <button 
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs text-gray-300 leading-relaxed max-h-[65vh] overflow-y-auto pr-2">
              <div className="bg-blue-950/40 p-3.5 rounded-xl border border-blue-500/30 space-y-1.5">
                <h4 className="font-bold text-blue-300 text-sm flex items-center gap-1.5">
                  <Video size={15} /> 1. Video Lắng Nghe (Idle Video) là gì và khi nào sử dụng?
                </h4>
                <p>• <strong>Bản chất:</strong> Là video nhân vật ở trạng thái tự nhiên (thở nhẹ, chớp mắt, mỉm cười, cử động thân người) nhưng <strong>KHÔNG mở miệng nói</strong>.<br/>• <strong>Khi nào phát:</strong> Video này tự động chạy lặp vô tận (loop) khi nhân vật đang <strong>nghỉ</strong>, hoặc đang <strong>chú ý lắng nghe nhân vật khác nói</strong> trong buổi livestream.<br/>• <strong>Tác dụng:</strong> Giúp các nhân vật luôn sống động 100% như người thật trên màn hình livestream, không bao giờ bị đứng hình hay đơ cứng.</p>
              </div>

              <div className="bg-amber-950/40 p-3.5 rounded-xl border border-amber-500/30 space-y-1.5">
                <h4 className="font-bold text-amber-300 text-sm flex items-center gap-1.5">
                  <Sparkles size={15} /> 2. Video Khẩu Hình Nói (Talk Video) là gì và khi nào sử dụng?
                </h4>
                <p>• <strong>Bản chất:</strong> Là video nhân vật đang cử động khẩu hình miệng nhép theo giọng nói.<br/>• <strong>Khi nào phát:</strong> Hệ thống tự động kích hoạt video này <strong>chỉ khi kịch bản livestream đến lượt nhân vật này nói thoại</strong> (theo tag kịch bản ví dụ <code className="text-amber-300 font-mono">[Idol]: ...</code> hay <code className="text-amber-300 font-mono">[Trợ Lý]: ...</code>).<br/>• <strong>Tự động hóa hoàn toàn:</strong> Khi đọc xong câu thoại, hệ thống sẽ <strong>tự động chuyển mượt mà về lại Video Lắng Nghe (Idle)</strong> mà bạn không cần bấm chuyển video thủ công.</p>
              </div>

              <div className="bg-purple-950/40 p-3.5 rounded-xl border border-purple-500/30 space-y-1.5">
                <h4 className="font-bold text-purple-300 text-sm flex items-center gap-1.5">
                  <LayoutGrid size={15} /> 3. Video hiển thị ở đâu trên màn hình?
                </h4>
                <p>• <strong>Sân Khấu Kéo Thả:</strong> Bạn vào tab <em>"Sân Khấu Kéo Thả"</em> để kéo nhân vật đặt vào bất kỳ vị trí nào trên màn hình (đứng bên trái/phải, ngồi cạnh bàn, ngồi ghế sofa, phóng to/thu nhỏ).<br/>• <strong>Màn Hình Live Clean Overlay:</strong> Cả 2–4 nhân vật sẽ cùng xuất hiện trên màn hình nền Studio theo đúng tọa độ và tỷ lệ bạn đã sắp xếp.</p>
              </div>

              <div className="bg-emerald-950/40 p-3.5 rounded-xl border border-emerald-500/30 space-y-1.5">
                <h4 className="font-bold text-emerald-300 text-sm flex items-center gap-1.5">
                  <Monitor size={15} /> 4. Cách đưa lên TikTok Live Studio / OBS hiệu quả nhất
                </h4>
                <p>• <strong>Cách 1 - Window Capture (Khuyên dùng - Chuẩn 60fps):</strong> Trong TikTok Live Studio hoặc OBS, thêm nguồn <em>Quay Cửa Sổ (Window Capture)</em> và chọn cửa sổ ứng dụng AvaLive. Mọi chuyển động đan xen đối thoại của các nhân vật sẽ hiển thị mượt mà không độ trễ.<br/>• <strong>Cách 2 - Browser Source (Đường Link Overlay):</strong> Thêm nguồn <em>Trình duyệt (Browser)</em> với đường dẫn <code className="text-cyan-300 font-mono">http://localhost:5173/?overlay=live</code> ở kích thước 1080x1920 (cho TikTok Live dọc) hoặc 1920x1080 (cho livestream ngang).</p>
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
