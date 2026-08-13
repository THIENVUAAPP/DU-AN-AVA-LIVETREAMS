import React, { useState, useRef, useEffect } from 'react';
import { Settings, Clock, Mic, Mic2, CheckCircle, UserSquare2, Image as ImageIcon, Play, Upload, Check, Zap, Lock, Brain, Sparkles, FileText, ChevronDown, Monitor, Video, Search, FileAudio, Plus, Trash2, Film, X } from 'lucide-react';

const DEFAULT_BRAINS = [
  { id: 'sales', name: 'Product/Sales Mode', icon: '🛒', isDefault: true, desc: 'Giới thiệu sản phẩm, chốt sale' },
  { id: 'talk', name: 'Talk Mode', icon: '💬', isDefault: true, desc: 'Giao lưu, trò chuyện, hỏi đáp' },
  { id: 'dance', name: 'Dance Mode', icon: '💃', isDefault: true, desc: 'Vũ đạo, nhảy theo quà tặng' },
  { id: 'sing', name: 'Music Mode', icon: '🎤', isDefault: true, desc: 'Hát, chọn bài theo yêu cầu' }
];

const EVENTS_LIST = [
  { id: 'xin_loi', name: 'Xin lỗi' },
  { id: 'binh_luan', name: 'Bình luận' },
  { id: 'theo_doi', name: 'Theo dõi' },
  { id: 'qua_tang', name: 'Quà tặng (Thường)' },
  { id: 'im_lang', name: 'Im lặng (Chờ)' },
  { id: 'keu_goi', name: 'Kêu gọi tương tác' },
  { id: 'chao_moi', name: 'Chào người mới' },
  { id: 'chot_don', name: 'Chốt đơn' },
  { id: 'chia_se', name: 'Chia sẻ' },
  { id: 'qua_dac_biet', name: 'Quà tặng Đặc biệt' },
  { id: 'noi_chuyen', name: 'Nói chuyện (AI)' },
  { id: 'cam_on_tim', name: 'Cảm ơn Tim' }
];

const DEFAULT_EVENT_CONFIG = {
  videoCategory: 'talking',
  enabled: true,
  useAI: true,
  prompt: 'Bạn là một streamer AI. Hãy phản hồi thật tự nhiên.',
  sample: '',
  useVoice: true,
  muteVideo: true
};

export default function WorkspaceTacVu({ defaultTab = 'voice' }) {
  const [rightTab, setRightTab] = useState('settings'); 
  
  // States for Custom Brains
  const [customBrains, setCustomBrains] = useState([]);
  const [selectedBrainId, setSelectedBrainId] = useState('sales');
  
  // Event Manager State
  const [selectedEventId, setSelectedEventId] = useState('noi_chuyen');
  const [eventsConfig, setEventsConfig] = useState({}); // { [eventId]: config }
  
  // Voice Settings (Per Brain)
  const [voiceProvider, setVoiceProvider] = useState('vbee');
  const [selectedVoice, setSelectedVoice] = useState('vbee_f_n_1');
  const [speed, setSpeed] = useState(1.0);

  // Video Library State
  const [showVideoLibrary, setShowVideoLibrary] = useState(false);
  const [videoCategories, setVideoCategories] = useState(['talking', 'dancing', 'waiting', 'sad', 'happy']);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('aidol_custom_brains');
    if (saved) {
      try { setCustomBrains(JSON.parse(saved)); } catch(e) {}
    }
    const savedVideos = localStorage.getItem('aidol_video_library');
    if (savedVideos) {
      try { setVideos(JSON.parse(savedVideos)); } catch(e) {}
    }
  }, []);

  const allBrains = [...DEFAULT_BRAINS, ...customBrains];
  const activeBrain = allBrains.find(b => b.id === selectedBrainId) || DEFAULT_BRAINS[0];

  useEffect(() => {
    // Load config when brain changes
    const savedPrompt = localStorage.getItem(`aidol_prompt_${selectedBrainId}`);
    if (savedPrompt) {
      try {
        const parsed = JSON.parse(savedPrompt);
        if (typeof parsed === 'object') {
           setEventsConfig(parsed);
        } else {
           // Fallback for old string prompt
           setEventsConfig({ 'noi_chuyen': { ...DEFAULT_EVENT_CONFIG, prompt: savedPrompt } });
        }
      } catch(e) {
        setEventsConfig({ 'noi_chuyen': { ...DEFAULT_EVENT_CONFIG, prompt: savedPrompt } });
      }
    } else {
      setEventsConfig({}); 
    }

    const savedVoice = localStorage.getItem(`aidol_voice_${selectedBrainId}`);
    if (savedVoice) {
      try {
        const parsed = JSON.parse(savedVoice);
        setVoiceProvider(parsed.voiceProvider || 'vbee');
        setSelectedVoice(parsed.selectedVoice || 'vbee_f_n_1');
        setSpeed(parsed.speed || 1.0);
      } catch(e) {}
    }
  }, [selectedBrainId]);

  const handleAddCustomBrain = () => {
    const newId = 'custom_' + Date.now();
    const newBrain = { id: newId, name: 'Chế độ mới ' + (customBrains.length + 1), icon: '🧠', isDefault: false, desc: 'Mô tả cấu hình AI mới' };
    const updated = [...customBrains, newBrain];
    setCustomBrains(updated);
    localStorage.setItem('aidol_custom_brains', JSON.stringify(updated));
    setSelectedBrainId(newId);
  };

  const handleDeleteCustomBrain = (id, e) => {
    e.stopPropagation();
    if (!confirm('Bạn có chắc chắn muốn xóa bộ não này?')) return;
    const updated = customBrains.filter(b => b.id !== id);
    setCustomBrains(updated);
    localStorage.setItem('aidol_custom_brains', JSON.stringify(updated));
    localStorage.removeItem(`aidol_prompt_${id}`);
    localStorage.removeItem(`aidol_voice_${id}`);
    if (selectedBrainId === id) setSelectedBrainId('sales');
  };

  const handleUpdateBrainName = (e) => {
    const newName = e.target.value;
    const updated = customBrains.map(b => b.id === selectedBrainId ? { ...b, name: newName } : b);
    setCustomBrains(updated);
    localStorage.setItem('aidol_custom_brains', JSON.stringify(updated));
  };

  const handleSaveJob = () => {
    localStorage.setItem(`aidol_prompt_${selectedBrainId}`, JSON.stringify(eventsConfig));
    const jobData = {
      voiceProvider,
      selectedVoice,
      speed
    };
    localStorage.setItem(`aidol_voice_${selectedBrainId}`, JSON.stringify(jobData));
    alert(`Đã lưu cấu hình Bộ não [${activeBrain.name}] thành công!`);
  };

  const updateEventConfig = (key, value) => {
    setEventsConfig(prev => ({
      ...prev,
      [selectedEventId]: {
        ...(prev[selectedEventId] || DEFAULT_EVENT_CONFIG),
        [key]: value
      }
    }));
  };

  const currentEventConfig = eventsConfig[selectedEventId] || DEFAULT_EVENT_CONFIG;
  const currentEventName = EVENTS_LIST.find(e => e.id === selectedEventId)?.name;

  const handleVideoUpload = (e) => {
     const files = Array.from(e.target.files);
     if (files.length === 0) return;
     const newVideos = files.map(f => ({
        id: Date.now() + Math.random().toString(),
        name: f.name,
        category: 'talking',
        url: URL.createObjectURL(f)
     }));
     const updated = [...videos, ...newVideos];
     setVideos(updated);
     // Note: URL.createObjectURL is temporary, in real app upload to server
     alert('Tải lên ' + files.length + ' video thành công!');
  };

  const VOICES = {
    vbee: [
      { group: 'Nữ Miền Bắc', options: [
        { id: 'vbee_f_n_1', name: 'Ngọc Huyền (MC, Truyền cảm)' },
        { id: 'vbee_f_n_2', name: 'Mai Phương (Trẻ trung, Sôi động)' }
      ]},
      { group: 'Nam Miền Bắc', options: [
        { id: 'vbee_m_n_1', name: 'Mạnh Dũng (Mạnh mẽ, Dứt khoát)' }
      ]}
    ],
    elevenlabs: [
      { group: 'Tiếng Anh', options: [
        { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel (Nữ, Bình tĩnh)' }
      ]}
    ]
  };

  return (
    <div className="w-full h-[calc(100vh-80px)] overflow-hidden flex flex-col gap-4 text-white">
      
      {/* Header */}
      <div className="flex justify-between items-end gap-4 pb-2 border-b border-white/10 shrink-0">
         <div>
             <h1 className="text-xl font-black text-white flex items-center gap-2">
                <Brain className="w-6 h-6 text-[#00FF66]" />
                Hệ thống Quản lý Live Modes (Bộ Não AI)
             </h1>
             <p className="text-xs text-gray-400 font-medium mt-1">
                Tạo và tùy chỉnh cấu hình cho từng sự kiện, thiết lập kịch bản và giọng nói.
             </p>
         </div>
         <div className="flex items-center gap-3">
             <button onClick={() => setShowVideoLibrary(true)} className="px-5 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl font-bold transition-all text-sm flex items-center gap-2">
                <Film className="w-4 h-4 text-blue-400" />
                Kho Video
             </button>
             <button onClick={handleSaveJob} className="px-6 py-2.5 bg-[#00FF66] text-black hover:bg-[#00CC52] rounded-xl font-black shadow-glow-green transition-all text-sm whitespace-nowrap">
                Lưu Cấu Hình
             </button>
         </div>
      </div>

      <div className="flex flex-1 gap-4 overflow-hidden">
         {/* LEFT PANEL - MODES LIST */}
         <div className="w-[260px] bg-[#121216]/80 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg p-4 flex flex-col relative overflow-hidden shrink-0">
             <div className="flex items-center justify-between mb-4">
                 <h2 className="text-sm font-black text-white uppercase tracking-wide">Live Modes</h2>
                 <button onClick={handleAddCustomBrain} className="p-1.5 bg-[#00FF66]/20 text-[#00FF66] rounded hover:bg-[#00FF66]/40 transition-colors" title="Thêm Chế độ mới">
                     <Plus className="w-4 h-4" />
                 </button>
             </div>
             <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
                {allBrains.map(brain => (
                    <div 
                      key={brain.id} 
                      onClick={() => setSelectedBrainId(brain.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer group flex items-center justify-between ${selectedBrainId === brain.id ? 'bg-[#00FF66]/10 border-[#00FF66]/50 text-[#00FF66] shadow-glow-green' : 'bg-black/40 border-white/5 text-gray-300 hover:bg-white/5'}`}
                    >
                        <div className="flex items-center gap-3 overflow-hidden">
                           <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                              <span className="text-base">{brain.icon}</span>
                           </div>
                           <div className="truncate">
                               <div className={`text-xs font-bold truncate ${selectedBrainId === brain.id ? 'text-[#00FF66]' : 'text-white'}`}>{brain.name}</div>
                               <div className="text-[9px] text-gray-500 truncate">{brain.desc}</div>
                           </div>
                        </div>
                        {!brain.isDefault && (
                            <button onClick={(e) => handleDeleteCustomBrain(brain.id, e)} className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-500 transition-all shrink-0">
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                ))}
             </div>
         </div>

         {/* MIDDLE PANEL - EVENT MANAGER */}
         <div className="flex-1 bg-[#121216]/80 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg flex flex-col relative overflow-hidden min-w-[500px]">
             <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-black/20">
                 {activeBrain.isDefault ? (
                     <h2 className="text-base font-black text-white">{activeBrain.name} - Trình quản lý Sự kiện & Video</h2>
                 ) : (
                     <input 
                       type="text" 
                       value={activeBrain.name} 
                       onChange={handleUpdateBrainName}
                       className="text-base font-black text-white bg-transparent outline-none border-b border-transparent focus:border-[#00FF66] w-64"
                       placeholder="Nhập tên chế độ..."
                     />
                 )}
             </div>

             <div className="flex flex-1 overflow-hidden">
                 {/* Events List */}
                 <div className="w-[180px] border-r border-white/10 bg-black/20 overflow-y-auto custom-scrollbar p-2">
                     <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-2 mt-2">Sự kiện có sẵn</div>
                     <div className="space-y-0.5">
                         {EVENTS_LIST.map(ev => (
                             <button
                                key={ev.id}
                                onClick={() => setSelectedEventId(ev.id)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-colors ${selectedEventId === ev.id ? 'bg-[#00FF66]/20 text-[#00FF66]' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}
                             >
                                 <span className="flex items-center gap-2">
                                     {eventsConfig[ev.id]?.enabled ? <CheckCircle className="w-3 h-3 text-[#00FF66]" /> : <div className="w-3 h-3 rounded-full border border-gray-500" />}
                                     {ev.name}
                                 </span>
                             </button>
                         ))}
                     </div>
                 </div>

                 {/* Event Configuration */}
                 <div className="flex-1 overflow-y-auto custom-scrollbar p-5">
                    <div className="bg-blue-500/10 border border-blue-500/20 text-blue-200 text-xs p-3 rounded-lg mb-5 flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                        <div>
                           <strong>{currentEventName}:</strong> Tùy chỉnh cách Idol AI phản ứng khi sự kiện này xảy ra. 
                           Nếu chọn "Dùng AI trả lời", AI sẽ đọc Kịch bản bên dưới để tạo ra phản hồi thông minh.
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                           <span className="text-sm font-bold text-white">Kích hoạt sự kiện này</span>
                           <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" checked={currentEventConfig.enabled} onChange={(e) => updateEventConfig('enabled', e.target.checked)} />
                              <div className="w-9 h-5 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#00FF66]"></div>
                           </label>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[11px] font-bold text-gray-400 mb-2">Danh mục video (Kho Video)</label>
                                <select 
                                  value={currentEventConfig.videoCategory}
                                  onChange={(e) => updateEventConfig('videoCategory', e.target.value)}
                                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs font-bold text-white outline-none focus:border-[#00FF66]"
                                >
                                   {videoCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                            <div className="flex flex-col gap-3 pt-6">
                                <label className="flex items-center gap-3 cursor-pointer">
                                  <input type="checkbox" checked={currentEventConfig.useAI} onChange={(e) => updateEventConfig('useAI', e.target.checked)} className="w-4 h-4 accent-[#00FF66]" />
                                  <span className="text-xs font-bold text-gray-200">Dùng AI sinh câu trả lời</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                  <input type="checkbox" checked={currentEventConfig.useVoice} onChange={(e) => updateEventConfig('useVoice', e.target.checked)} className="w-4 h-4 accent-[#00FF66]" />
                                  <span className="text-xs font-bold text-gray-200">Phát giọng nói (TTS)</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                  <input type="checkbox" checked={currentEventConfig.muteVideo} onChange={(e) => updateEventConfig('muteVideo', e.target.checked)} className="w-4 h-4 accent-[#00FF66]" />
                                  <span className="text-xs font-bold text-gray-200">Tắt âm thanh gốc của Video</span>
                                </label>
                            </div>
                        </div>

                        {currentEventConfig.useAI && (
                            <div>
                                <label className="block text-[11px] font-bold text-gray-400 mb-2">Kịch bản cho AI (System Prompt) - Dành riêng cho sự kiện này</label>
                                <textarea 
                                  value={currentEventConfig.prompt}
                                  onChange={(e) => updateEventConfig('prompt', e.target.value)}
                                  placeholder="Nhập hướng dẫn cho AI khi sự kiện này xảy ra..."
                                  className="w-full h-32 p-3 bg-black/40 border border-white/10 rounded-lg text-xs text-gray-200 focus:border-[#00FF66] outline-none resize-none custom-scrollbar"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-[11px] font-bold text-gray-400 mb-2">Câu trả lời mẫu (mỗi câu 1 dòng)</label>
                            <textarea 
                              value={currentEventConfig.sample}
                              onChange={(e) => updateEventConfig('sample', e.target.value)}
                              placeholder="Xin chào các bạn
Cảm ơn bạn đã theo dõi..."
                              className="w-full h-24 p-3 bg-black/40 border border-white/10 rounded-lg text-xs text-gray-200 focus:border-[#00FF66] outline-none resize-none custom-scrollbar"
                            />
                        </div>

                        <button onClick={handleSaveJob} className="w-full py-3 bg-[#00FF66]/10 text-[#00FF66] hover:bg-[#00FF66]/20 border border-[#00FF66]/30 rounded-xl font-black transition-colors text-sm">
                           Lưu thay đổi cho sự kiện này
                        </button>
                    </div>
                 </div>
             </div>
         </div>

         {/* RIGHT PANEL - VOICE */}
         <div className="w-[280px] bg-[#121216]/80 backdrop-blur-md rounded-2xl border border-white/10 p-5 shadow-lg flex flex-col relative overflow-hidden shrink-0">
            <div className="relative z-10 flex-1 flex flex-col min-h-0">
                <div className="mb-4">
                  <h3 className="font-black text-white text-sm mb-1">Cấu hình Giọng nói</h3>
                  <p className="text-[9px] text-gray-400 font-medium">Áp dụng chung cho bộ não này.</p>
                </div>

                <div className="space-y-4 flex-1 flex flex-col min-h-0">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-300 mb-1.5">Nền tảng API</label>
                    <select 
                      value={voiceProvider}
                      onChange={(e) => setVoiceProvider(e.target.value)}
                      className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-lg text-xs font-bold text-gray-200 outline-none focus:border-[#00FF66]"
                    >
                      <option value="vbee">VBee (Việt Nam)</option>
                      <option value="elevenlabs">ElevenLabs (Cao cấp)</option>
                    </select>
                  </div>

                  <div className="flex-1 flex flex-col min-h-0">
                    <label className="block text-[10px] font-bold text-gray-300 mb-1.5">Chọn Giọng đọc</label>
                    <div className="bg-black/40 border border-white/10 rounded-lg p-2 flex-1 overflow-y-auto custom-scrollbar">
                      {(VOICES[voiceProvider] || []).map((group, idx) => (
                        <div key={idx} className="mb-2 last:mb-0">
                           <div className="text-[9px] font-bold text-[#00FF66] uppercase tracking-wider mb-1 px-2">{group.group}</div>
                           <div className="space-y-1">
                             {group.options.map(voice => (
                               <button 
                                 key={voice.id} 
                                 onClick={() => setSelectedVoice(voice.id)}
                                 className={`w-full text-left px-2 py-1.5 rounded-md text-[10px] font-bold transition-colors flex justify-between items-center ${selectedVoice === voice.id ? 'bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/30' : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'}`}
                               >
                                 <span className="truncate pr-2">{voice.name}</span>
                                 {selectedVoice === voice.id && <Check className="w-3 h-3 flex-shrink-0" />}
                               </button>
                             ))}
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="shrink-0 mt-2">
                    <label className="block text-[10px] font-bold text-gray-300 mb-1">Mức độ Cảm xúc: {speed.toFixed(1)}</label>
                    <div className="bg-black/40 border border-white/10 rounded-lg p-3">
                       <input 
                         type="range" min="0.5" max="2.0" step="0.1" value={speed} 
                         onChange={(e) => setSpeed(parseFloat(e.target.value))}
                         className="w-full accent-[#00FF66] mb-1.5 h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer" 
                       />
                       <div className="flex justify-between text-[9px] text-gray-500 font-bold">
                         <span>Bình tĩnh</span>
                         <span>Sôi nổi</span>
                       </div>
                    </div>
                  </div>
                </div>
            </div>
         </div>
      </div>

      {/* VIDEO LIBRARY MODAL */}
      {showVideoLibrary && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
             <div className="bg-[#121216] border border-white/10 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden">
                 <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                     <h2 className="text-lg font-black text-white flex items-center gap-2">
                        <Film className="w-5 h-5 text-blue-400" /> Quản lý Kho Video
                     </h2>
                     <button onClick={() => setShowVideoLibrary(false)} className="text-gray-400 hover:text-white p-1"><X className="w-5 h-5"/></button>
                 </div>
                 
                 <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
                     <div className="flex items-center justify-between mb-6">
                         <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg p-1">
                             {videoCategories.map(cat => (
                                 <button key={cat} className="px-4 py-1.5 text-xs font-bold rounded-md bg-white/10 text-white hover:bg-white/20 transition-colors">
                                     {cat}
                                 </button>
                             ))}
                         </div>
                         <div className="flex items-center gap-2">
                             <input type="file" multiple accept="video/*" className="hidden" id="video-upload" onChange={handleVideoUpload} />
                             <label htmlFor="video-upload" className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold text-xs cursor-pointer flex items-center gap-2 transition-colors">
                                <Upload className="w-4 h-4" /> Tải Video Lên
                             </label>
                         </div>
                     </div>

                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                         {videos.map(vid => (
                             <div key={vid.id} className="group relative bg-black/60 border border-white/10 rounded-xl overflow-hidden aspect-[9/16]">
                                 <video src={vid.url} className="w-full h-full object-cover" />
                                 <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                                     <div className="flex justify-end">
                                         <button onClick={() => setVideos(videos.filter(v => v.id !== vid.id))} className="w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors">
                                             <Trash2 className="w-3 h-3" />
                                         </button>
                                     </div>
                                     <div>
                                         <div className="text-[10px] font-bold bg-blue-500 text-white px-2 py-0.5 rounded inline-block mb-1">{vid.category}</div>
                                         <div className="text-xs font-bold text-white truncate">{vid.name}</div>
                                     </div>
                                 </div>
                             </div>
                         ))}
                         {videos.length === 0 && (
                             <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-500">
                                 <Film className="w-12 h-12 mb-3 opacity-20" />
                                 <p className="text-sm font-bold">Kho video đang trống</p>
                                 <p className="text-xs mt-1">Bấm "Tải Video Lên" để thêm các video nền (nhảy, nói chuyện...)</p>
                             </div>
                         )}
                     </div>
                 </div>
                 <div className="px-6 py-4 border-t border-white/10 flex justify-end">
                     <button onClick={() => {
                        localStorage.setItem('aidol_video_library', JSON.stringify(videos));
                        setShowVideoLibrary(false);
                     }} className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold text-sm transition-colors">
                         Lưu & Đóng
                     </button>
                 </div>
             </div>
         </div>
      )}
    </div>
  );
}
