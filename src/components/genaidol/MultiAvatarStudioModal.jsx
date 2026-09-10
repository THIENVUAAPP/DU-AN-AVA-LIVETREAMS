import React, { useState, useEffect } from 'react';
import { 
  Users, Sparkles, Video, Mic, Volume2, Gauge, HelpCircle, X, Check, Play, Square, 
  Upload, FolderOpen, Layers, ShieldCheck, Info, MessageSquare, Plus, RefreshCw, Eye
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

export default function MultiAvatarStudioModal({ isOpen, onClose, onApplyScriptTemplate }) {
  const [config, setConfig] = useState(getMultiAvatarConfig());
  const [activeTab, setActiveTab] = useState('avatars'); // 'avatars', 'templates'
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState(null); // { avatarId, type: 'idle' | 'talk' }
  const [previewingVoiceId, setPreviewingVoiceId] = useState(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setConfig(getMultiAvatarConfig());
      setSavedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

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
      onClose();
    }, 800);
  };

  const handleSelectMedia = (mediaItem) => {
    if (!mediaPickerTarget) return;
    const { avatarId, type } = mediaPickerTarget;
    const url = mediaItem.mediaUrl || (mediaItem.fileBlob ? URL.createObjectURL(mediaItem.fileBlob) : '');
    handleAvatarChange(avatarId, type === 'idle' ? 'idleVideo' : 'talkVideo', url);
    setMediaPickerTarget(null);
  };

  const SCRIPT_TEMPLATES = [
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

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-[#11131a] text-white max-w-5xl w-full rounded-3xl shadow-2xl border border-cyan-500/30 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
              <Users size={24} className="text-cyan-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-wide text-white">STUDIO LIVE ĐA NHÂN VẬT (2 – 4 AVATAR)</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-cyan-400/20 text-cyan-300 border border-cyan-400/40">
                  REAL-TIME SYNC
                </span>
              </div>
              <p className="text-xs text-blue-100/80">Phát live cùng lúc 2 đến 4 nhân vật, tự động đổi khẩu hình & voice độc lập theo kịch bản</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHelpModal(true)}
              className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold flex items-center gap-1.5 transition-all border border-white/20 cursor-pointer"
              title="Xem hướng dẫn chi tiết cách sử dụng"
            >
              <HelpCircle size={15} className="text-yellow-300" /> Hướng Dẫn (?)
            </button>
            <button 
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* TABS & NUMBER SELECTOR */}
        <div className="bg-[#161924] px-6 py-3 border-b border-gray-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Số lượng Nhân Vật:</span>
            {[
              { count: 2, label: '2 Nhân Vật (Dual Live)', icon: '👥' },
              { count: 3, label: '3 Nhân Vật (Trio Studio)', icon: '🎭' },
              { count: 4, label: '4 Nhân Vật (Squad 4K)', icon: '👑' }
            ].map(item => (
              <button
                key={item.count}
                onClick={() => handleActiveCountChange(item.count)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  config.activeCount === item.count
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 border border-cyan-400/50 scale-105'
                    : 'bg-[#1f2333] text-gray-400 hover:text-gray-200 border border-gray-700/50 hover:bg-[#252b40]'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('avatars')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'avatars' ? 'bg-blue-600/30 text-cyan-300 border border-cyan-500/40' : 'text-gray-400 hover:text-white'
              }`}
            >
              ⚙️ Cấu Hình Nhân Vật
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'templates' ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40' : 'text-gray-400 hover:text-white'
              }`}
            >
              📝 Kịch Bản Đối Thoại Mẫu
            </button>
          </div>
        </div>

        {/* BODY CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'avatars' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {config.avatars.slice(0, config.activeCount).map((avatar, idx) => {
                const assignedVoice = ALL_SYSTEM_VOICES.find(v => v.id === avatar.voiceId) || ALL_SYSTEM_VOICES[0];
                const isPlaying = previewingVoiceId === avatar.voiceId;

                return (
                  <div 
                    key={avatar.id}
                    className="bg-gradient-to-b from-[#1b1f2e] to-[#141724] border border-cyan-500/20 rounded-2xl p-5 shadow-xl space-y-4 hover:border-cyan-500/40 transition-all relative overflow-hidden"
                  >
                    {/* Character Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm text-white ${
                          idx === 0 ? 'bg-rose-500' : idx === 1 ? 'bg-blue-500' : idx === 2 ? 'bg-amber-500' : 'bg-purple-500'
                        }`}>
                          {idx + 1}
                        </div>
                        <div>
                          <div className="text-sm font-black text-white">{avatar.label}</div>
                          <div className="text-[11px] font-semibold text-cyan-400">Tag kịch bản: <code className="bg-cyan-950/80 px-1.5 py-0.5 rounded text-cyan-300 border border-cyan-500/30">[{avatar.tag}]</code></div>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Sẵn sàng
                      </span>
                    </div>

                    {/* Character Name & Tag */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-gray-400 block mb-1">Tên Nhân Vật:</label>
                        <input 
                          type="text"
                          value={avatar.name}
                          onChange={(e) => handleAvatarChange(avatar.id, 'name', e.target.value)}
                          className="w-full bg-[#10121a] border border-gray-700 rounded-xl px-3 py-1.5 text-xs text-white font-semibold focus:outline-none focus:border-cyan-500"
                          placeholder="Ví dụ: Ngọc Nhi"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-gray-400 block mb-1">Từ Khóa Nhận Diện (Tag):</label>
                        <input 
                          type="text"
                          value={avatar.tag}
                          onChange={(e) => handleAvatarChange(avatar.id, 'tag', e.target.value)}
                          className="w-full bg-[#10121a] border border-gray-700 rounded-xl px-3 py-1.5 text-xs text-cyan-300 font-bold focus:outline-none focus:border-cyan-500"
                          placeholder="Ví dụ: Idol, Trợ Lý..."
                        />
                      </div>
                    </div>

                    {/* Assigned Voice Selector */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold text-gray-400 flex items-center gap-1">
                          <Mic size={13} className="text-cyan-400" /> Giọng Đọc AI Gán Cho Nhân Vật:
                        </label>
                        <button
                          onClick={() => handleVoicePreview(avatar.voiceId, assignedVoice?.sampleText)}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 transition-all cursor-pointer ${
                            isPlaying ? 'bg-amber-500 text-black' : 'bg-blue-600/30 text-cyan-300 hover:bg-blue-600/50'
                          }`}
                        >
                          {isPlaying ? <Square size={10} /> : <Play size={10} />}
                          {isPlaying ? 'Dừng' : 'Nghe Thử'}
                        </button>
                      </div>

                      <select
                        value={avatar.voiceId}
                        onChange={(e) => handleAvatarChange(avatar.id, 'voiceId', e.target.value)}
                        className="w-full bg-[#10121a] border border-gray-700 rounded-xl px-3 py-2 text-xs text-yellow-300 font-bold focus:outline-none focus:border-cyan-500 cursor-pointer"
                      >
                        {ALL_SYSTEM_VOICES.map(v => (
                          <option key={v.id} value={v.id}>
                            {v.name} ({v.gender === 'Female' ? 'Nữ' : 'Nam'})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Video Idle & Video Talk */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      {/* Video Idle */}
                      <div className="bg-[#10121a] p-3 rounded-xl border border-gray-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                            😴 Video Nghỉ (Idle):
                          </span>
                          {avatar.idleVideo ? (
                            <span className="text-[9px] text-emerald-400 font-bold">✓ Đã gán</span>
                          ) : (
                            <span className="text-[9px] text-gray-500">Mặc định</span>
                          )}
                        </div>

                        {avatar.idleVideo ? (
                          <div className="relative h-20 rounded-lg overflow-hidden bg-black border border-gray-800">
                            <video src={avatar.idleVideo} className="w-full h-full object-cover" muted loop autoPlay playsInline />
                            <button
                              onClick={() => handleAvatarChange(avatar.id, 'idleVideo', '')}
                              className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-gray-300 hover:text-white"
                              title="Xóa video gán"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setMediaPickerTarget({ avatarId: avatar.id, type: 'idle' })}
                            className="w-full h-20 rounded-lg border border-dashed border-gray-700 hover:border-cyan-500 flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-cyan-300 transition-all cursor-pointer bg-white/2"
                          >
                            <FolderOpen size={16} />
                            <span className="text-[10px] font-semibold">Chọn Video Idle</span>
                          </button>
                        )}
                      </div>

                      {/* Video Talk */}
                      <div className="bg-[#10121a] p-3 rounded-xl border border-gray-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                            🗣️ Video Nói (Khẩu hình):
                          </span>
                          {avatar.talkVideo ? (
                            <span className="text-[9px] text-emerald-400 font-bold">✓ Đã gán</span>
                          ) : (
                            <span className="text-[9px] text-gray-500">Mặc định</span>
                          )}
                        </div>

                        {avatar.talkVideo ? (
                          <div className="relative h-20 rounded-lg overflow-hidden bg-black border border-gray-800">
                            <video src={avatar.talkVideo} className="w-full h-full object-cover" muted loop autoPlay playsInline />
                            <button
                              onClick={() => handleAvatarChange(avatar.id, 'talkVideo', '')}
                              className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-gray-300 hover:text-white"
                              title="Xóa video gán"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setMediaPickerTarget({ avatarId: avatar.id, type: 'talk' })}
                            className="w-full h-20 rounded-lg border border-dashed border-gray-700 hover:border-cyan-500 flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-cyan-300 transition-all cursor-pointer bg-white/2"
                          >
                            <FolderOpen size={16} />
                            <span className="text-[10px] font-semibold">Chọn Video Talk</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'templates' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-purple-950/40 to-indigo-950/40 border border-purple-500/30 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-purple-300">Kho Kịch Bản Mẫu Tương Tác Sẵn Có</h3>
                  <p className="text-xs text-gray-300">Nhấp vào "Nạp Vào Kịch Bản" để sử dụng ngay lập tức trên phiên live của bạn.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {SCRIPT_TEMPLATES.map(item => (
                  <div key={item.id} className="bg-[#161924] border border-gray-800 rounded-2xl p-5 space-y-3 hover:border-purple-500/40 transition-all">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-black text-white">{item.title}</h4>
                        <p className="text-xs text-gray-400">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => {
                          handleActiveCountChange(item.count);
                          if (onApplyScriptTemplate) {
                            onApplyScriptTemplate(item.script);
                          }
                          handleSave();
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-lg shadow-purple-500/20 transition-all active:scale-95 cursor-pointer shrink-0"
                      >
                        <Sparkles size={14} /> Nạp Vào Kịch Bản
                      </button>
                    </div>

                    <pre className="bg-[#0e1017] p-3 rounded-xl text-xs text-cyan-200 font-mono overflow-x-auto border border-gray-800/80 max-h-36">
                      {item.script}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="bg-[#161924] px-6 py-4 border-t border-gray-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Info size={15} className="text-cyan-400" />
            <span>Kịch bản sẽ tự động chuyển đổi khẩu hình và voice cho từng nhân vật theo tag <code className="text-cyan-300">[{config.avatars[0]?.tag}]</code>, <code className="text-cyan-300">[{config.avatars[1]?.tag}]</code>...</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-xs transition-colors cursor-pointer"
            >
              Đóng
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xs shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              {savedSuccess ? <Check size={16} /> : <Sparkles size={16} />}
              {savedSuccess ? 'Đã Lưu Thành Công!' : 'Lưu Cấu Hình Studio'}
            </button>
          </div>
        </div>
      </div>

      {/* HELP MODAL (?) */}
      {showHelpModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-150">
          <div className="bg-[#121520] text-white max-w-2xl w-full rounded-3xl border border-yellow-500/40 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-yellow-500/20 text-yellow-300 flex items-center justify-center font-black">
                  ?
                </div>
                <h3 className="text-base font-black text-white">Hướng Dẫn Phát Live Đa Nhân Vật (2 - 4 Avatar)</h3>
              </div>
              <button 
                onClick={() => setShowHelpModal(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs text-gray-300 leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
              <div className="bg-white/5 p-3.5 rounded-xl border border-white/10 space-y-1.5">
                <h4 className="font-bold text-cyan-300 text-sm">1. Nguyên tắc hoạt động khẩu hình & voice</h4>
                <p>Mỗi nhân vật được gán 1 giọng đọc AI riêng và 2 video (Video Idle nghỉ ngơi & Video Talk nói chuyện). Khi kịch bản đọc đến lượt nhân vật nào, nhân vật đó sẽ nói và cử động khớp miệng, các nhân vật còn lại sẽ ở trạng thái nghỉ lắng nghe.</p>
              </div>

              <div className="bg-white/5 p-3.5 rounded-xl border border-white/10 space-y-1.5">
                <h4 className="font-bold text-yellow-300 text-sm">2. Cách viết kịch bản đối thoại</h4>
                <p>Đặt tag nhận diện ở đầu mỗi dòng kịch bản. Ví dụ:</p>
                <pre className="bg-black/60 p-2.5 rounded-lg text-[11px] font-mono text-cyan-300 border border-gray-800">
                  {`[Idol]: Chào mừng các bạn đến với phiên live hôm nay!
[Trợ Lý]: Số lượng ưu đãi chỉ còn 10 phần quà thôi ạ!
[BLV Game]: 5 giây đếm ngược chuẩn bị săn sale nào!`}
                </pre>
              </div>

              <div className="bg-white/5 p-3.5 rounded-xl border border-white/10 space-y-1.5">
                <h4 className="font-bold text-emerald-300 text-sm">3. Đưa lên OBS & TikTok Live Studio</h4>
                <p>• <strong>Window Capture (Khuyên dùng):</strong> Bắt trực tiếp cửa sổ phòng Live của phần mềm để đạt 60fps mượt mà nhất.<br/>• <strong>Browser Source:</strong> Dán đường link Overlay vào nguồn trình duyệt của TikTok Live Studio.</p>
              </div>
            </div>

            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2.5 bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-black text-xs rounded-xl shadow-lg hover:from-yellow-400 hover:to-amber-500 cursor-pointer"
            >
              Đã Hiểu & Đóng Hướng Dẫn
            </button>
          </div>
        </div>
      )}

      {/* MEDIA PICKER */}
      {mediaPickerTarget && (
        <UniversalMediaPicker 
          isOpen={true}
          onClose={() => setMediaPickerTarget(null)}
          onSelectMedia={handleSelectMedia}
          category={mediaPickerTarget.type === 'idle' ? 'idle' : 'greeting'}
          title={`Chọn Video ${mediaPickerTarget.type === 'idle' ? 'Nghỉ (Idle)' : 'Nói (Khẩu hình)'} Cho Nhân Vật`}
        />
      )}
    </div>
  );
}
