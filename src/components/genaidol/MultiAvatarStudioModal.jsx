import React, { useState, useEffect } from 'react';
import { 
  Users, Sparkles, Video, Mic, Volume2, Gauge, HelpCircle, X, Check, Play, Square, 
  Upload, FolderOpen, Layers, ShieldCheck, Info, MessageSquare, Plus, RefreshCw, Eye, BookOpen
} from 'lucide-react';
import { 
  ALL_SYSTEM_VOICES, 
  getMultiAvatarConfig, 
  saveMultiAvatarConfig, 
  DEFAULT_MULTI_AVATAR_CONFIG,
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
  const [activeTab, setActiveTab] = useState('avatars'); // 'avatars', 'templates'
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState(null); // { avatarId, type: 'idle' | 'talk' }
  const [previewingVoiceId, setPreviewingVoiceId] = useState(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

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

  return (
    <div className={`flex flex-col h-full ${isEmbedded ? 'bg-transparent text-gray-800' : 'bg-[#11131a] text-white'}`}>
      {/* TOP HEADER CONTROLS */}
      <div className={`p-4 border-b flex flex-wrap items-center justify-between gap-3 shrink-0 ${isEmbedded ? 'bg-white border-gray-200 rounded-2xl shadow-xs mb-3' : 'bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white'}`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${isEmbedded ? 'bg-indigo-50 text-indigo-600' : 'bg-white/10 text-cyan-300'}`}>
            <Users size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black tracking-wide">STUDIO ĐA NHÂN VẬT (2 – 4 AVATAR CÙNG LÚC)</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-cyan-500/20 text-cyan-700 border border-cyan-400/40">
                LIP-SYNC TỰ ĐỘNG
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Chạy đồng thời 2, 3 hoặc 4 nhân vật trên 1 khung hình. Kịch bản đọc tới ai, người đó tự động nhép miệng nói.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
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
            <span>(?) Hướng Dẫn Chi Tiết</span>
          </button>
          
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-xs shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            {savedSuccess ? <Check size={14} /> : <Sparkles size={14} />}
            <span>{savedSuccess ? 'Đã Lưu!' : 'Lưu Cấu Hình'}</span>
          </button>
        </div>
      </div>

      {/* TABS & MODE SELECTOR */}
      <div className={`px-4 py-3 border-b flex flex-wrap items-center justify-between gap-3 shrink-0 ${isEmbedded ? 'bg-white border-gray-200 rounded-xl mb-3' : 'bg-[#181a24] border-gray-800'}`}>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Số lượng nhân vật:</span>
          <div className="flex items-center bg-slate-100 dark:bg-black/40 p-1 rounded-xl border border-gray-300 dark:border-gray-800 gap-1">
            {[
              { count: 2, label: '2 Nhân Vật (Dual Live)', icon: '👥' },
              { count: 3, label: '3 Nhân Vật (Trio Live)', icon: '🎭' },
              { count: 4, label: '4 Nhân Vật (Squad Live)', icon: '🌟' }
            ].map(item => (
              <button
                key={item.count}
                type="button"
                onClick={() => handleActiveCountChange(item.count)}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
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

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('avatars')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'avatars'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-500 hover:text-blue-600'
            }`}
          >
            🎛️ Thiết Lập Video & Voice
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('templates')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'templates'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-gray-500 hover:text-purple-600'
            }`}
          >
            📜 Kịch Bản Mẫu Đối Thoại
          </button>
        </div>
      </div>

      {/* CONTENT BODY */}
      <div className="flex-1 overflow-y-auto p-2 space-y-4">
        {activeTab === 'avatars' ? (
          <div className={`grid grid-cols-1 gap-4 ${config.activeCount === 2 ? 'md:grid-cols-2' : config.activeCount === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4'}`}>
            {config.avatars.slice(0, config.activeCount).map((avatar, idx) => {
              const currentVoice = ALL_SYSTEM_VOICES.find(v => v.id === avatar.voiceId);
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
                  {/* CARD HEADER */}
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

                    {/* 1. GIỌNG ĐỌC AI (VOICE SELECTOR) */}
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

                    {/* 2. VIDEO LẮNG NGHE (IDLE VIDEO) */}
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

                    {/* 3. VIDEO NÓI / NHÉP MIỆNG (TALK VIDEO LIP-SYNC) */}
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

                  {/* CARD FOOTER (TỐC ĐỘ & ÂM LƯỢNG) */}
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
          /* TEMPLATES TAB */
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
                        // Lưu trực tiếp vào kịch bản chính của hệ thống
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

      {/* HELP MODAL */}
      {showHelpModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-150">
          <div className="bg-[#121520] text-white max-w-2xl w-full rounded-3xl border border-yellow-500/40 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-yellow-500/20 text-yellow-300 flex items-center justify-center font-black">
                  ?
                </div>
                <h3 className="text-base font-black text-white">Hướng Dẫn Vận Hành Studio 2–4 Nhân Vật (TikTok / OBS)</h3>
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
                <h4 className="font-bold text-cyan-300 text-sm">1. 🖥️ Phát Live Qua Window Capture (Khuyên dùng - 60fps mượt nhất)</h4>
                <p>• Trong phần mềm AvaLive: Bật chế độ Studio 2, 3 hoặc 4 nhân vật. Hệ thống tự động chia khung hình (2 cột, 3 cột hoặc 4 ô lưới) trên cùng 1 màn hình phát.<br/>• Trong TikTok Live Studio hoặc OBS: Thêm nguồn <strong>Window Capture (Quay cửa sổ)</strong> và chọn cửa sổ <strong>Phòng Live AvaLive</strong>. Toàn bộ 2-4 nhân vật sẽ hiển thị sắc nét trên 1 luồng duy nhất.</p>
              </div>

              <div className="bg-white/5 p-3.5 rounded-xl border border-white/10 space-y-1.5">
                <h4 className="font-bold text-amber-300 text-sm">2. 🌐 Phát Live Qua Browser Source (Đường Link Overlay)</h4>
                <p>• Dán đường link Overlay sạch (ví dụ: <code className="text-amber-200 font-mono">http://localhost:5173/?overlay=live</code>) vào nguồn Trình duyệt (Browser Source) của TikTok Live Studio hoặc OBS Studio.<br/>• Toàn bộ các nhân vật và chuyển đổi khẩu hình nói / nghỉ sẽ tự động đồng bộ thời gian thực 0ms.</p>
              </div>

              <div className="bg-white/5 p-3.5 rounded-xl border border-white/10 space-y-1.5">
                <h4 className="font-bold text-emerald-300 text-sm">3. 🎭 Cách Viết Kịch Bản Đối Thoại</h4>
                <p>Thêm tiền tố thẻ vai ở đầu mỗi câu thoại:</p>
                <pre className="bg-black/60 p-2.5 rounded-lg text-[11px] font-mono text-cyan-300 border border-gray-800">
                  {`[Idol]: Chào mừng các bạn đến với phiên live hôm nay!
[Trợ Lý]: Số lượng ưu đãi chỉ còn đúng 10 phần quà thôi ạ!
[BLV Game]: 5 giây đếm ngược chuẩn bị săn sale nào!
[Khách Mời]: Trải nghiệm thực tế sản phẩm này rất tuyệt vời!`}
                </pre>
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

      {/* MEDIA PICKER MODAL */}
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
      <div className="bg-[#11131a] text-white max-w-5xl w-full rounded-3xl shadow-2xl border border-cyan-500/30 overflow-hidden flex flex-col max-h-[92vh]">
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
