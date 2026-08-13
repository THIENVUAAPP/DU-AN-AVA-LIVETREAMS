import json

code = """import React, { useState, useRef, useEffect } from 'react';
import { Settings, Clock, Mic, Mic2, CheckCircle, UserSquare2, Image as ImageIcon, Play, Upload, Check, Zap, Lock, Brain, Sparkles, FileText, ChevronDown, Monitor, Video, Search, FileAudio, Plus, Trash2 } from 'lucide-react';

const DEFAULT_BRAINS = [
  { id: 'sales', name: 'Product/Sales Mode', icon: '🛒', isDefault: true, desc: 'Giới thiệu sản phẩm, chốt sale' },
  { id: 'talk', name: 'Talk Mode', icon: '💬', isDefault: true, desc: 'Giao lưu, trò chuyện, hỏi đáp' },
  { id: 'dance', name: 'Dance Mode', icon: '💃', isDefault: true, desc: 'Vũ đạo, nhảy theo quà tặng' },
  { id: 'sing', name: 'Music Mode', icon: '🎤', isDefault: true, desc: 'Hát, chọn bài theo yêu cầu' }
];

const MOCK_HISTORY = {
  voice: [
    { id: 'V-001', name: 'Giọng đọc quảng cáo', status: 'completed', time: '10 phút trước' }
  ]
};

export default function WorkspaceTacVu({ defaultTab = 'voice' }) {
  const [rightTab, setRightTab] = useState('settings'); // 'settings', 'history'
  
  // States for Custom Brains
  const [customBrains, setCustomBrains] = useState([]);
  const [selectedBrainId, setSelectedBrainId] = useState('sales');
  const [scriptContent, setScriptContent] = useState('');
  
  // Voice Settings (Per Brain)
  const [voiceProvider, setVoiceProvider] = useState('vbee');
  const [selectedVoice, setSelectedVoice] = useState('vbee_f_n_1');
  const [speed, setSpeed] = useState(1.0);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('aidol_custom_brains');
    if (saved) {
      try {
        setCustomBrains(JSON.parse(saved));
      } catch(e) {}
    }
  }, []);

  const allBrains = [...DEFAULT_BRAINS, ...customBrains];
  const activeBrain = allBrains.find(b => b.id === selectedBrainId) || DEFAULT_BRAINS[0];

  useEffect(() => {
    // Load config when brain changes
    const savedPrompt = localStorage.getItem(`aidol_prompt_${selectedBrainId}`);
    if (savedPrompt) {
      setScriptContent(savedPrompt);
    } else {
      setScriptContent(''); // clear if no saved prompt
    }

    const savedVoice = localStorage.getItem(`aidol_voice_${selectedBrainId}`);
    if (savedVoice) {
      try {
        const parsed = JSON.parse(savedVoice);
        setVoiceProvider(parsed.voiceProvider || 'vbee');
        setSelectedVoice(parsed.selectedVoice || 'vbee_f_n_1');
        setSpeed(parsed.speed || 1.0);
        setGeneratedAudioUrl(parsed.generatedAudioUrl || null);
      } catch(e) {}
    } else {
        setVoiceProvider('vbee');
        setSelectedVoice('vbee_f_n_1');
        setSpeed(1.0);
        setGeneratedAudioUrl(null);
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
    localStorage.setItem(`aidol_prompt_${selectedBrainId}`, scriptContent);
    const jobData = {
      voiceProvider,
      selectedVoice,
      speed,
      generatedAudioUrl
    };
    localStorage.setItem(`aidol_voice_${selectedBrainId}`, JSON.stringify(jobData));
    alert(`Đã lưu cấu hình Bộ não [${activeBrain.name}] thành công!`);
  };

  const handleGenerateAudio = async () => {
    // Mock for TTS API
    if (!scriptContent) return alert("Vui lòng nhập kịch bản trước khi tạo giọng đọc!");
    setIsGeneratingAudio(true);
    setTimeout(() => {
        setIsGeneratingAudio(false);
        setGeneratedAudioUrl("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3");
        alert("Đã mô phỏng tạo giọng thành công!");
    }, 2000);
  };

  const scriptFileInputRef = useRef(null);
  const audioFileInputRef = useRef(null);

  const handleScriptFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setScriptContent(event.target.result);
      alert('Tải file kịch bản thành công!');
    };
    reader.onerror = () => alert('Không thể đọc file. Vui lòng thử lại với định dạng .txt.');
    reader.readAsText(file);
  };

  const handleAudioFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setGeneratedAudioUrl(event.target.result);
      alert('Tải file âm thanh thành công!');
    };
    reader.onerror = () => alert('Không thể đọc file âm thanh.');
    reader.readAsDataURL(file); 
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
                Tạo và tùy chỉnh cấu hình cho từng chế độ, thiết lập kịch bản và giọng nói.
             </p>
         </div>
         <button onClick={handleSaveJob} className="px-6 py-2.5 bg-[#00FF66] text-black hover:bg-[#00CC52] rounded-xl font-black shadow-glow-green transition-all text-sm whitespace-nowrap">
            Lưu Cấu Hình (Đẩy lên Live)
         </button>
      </div>

      <div className="flex flex-1 gap-4 overflow-hidden">
         {/* LEFT PANEL - MODES LIST */}
         <div className="w-[300px] bg-[#121216]/80 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg p-4 flex flex-col relative overflow-hidden shrink-0">
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

         {/* MIDDLE PANEL - MASTER PROMPT EDITOR */}
         <div className="flex-1 bg-[#121216]/80 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg p-6 flex flex-col min-h-0 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-[#00FF66]/5 rounded-full blur-[100px] pointer-events-none"></div>

             <div className="relative z-10 flex flex-col h-full">
                 <div className="mb-4">
                   {activeBrain.isDefault ? (
                       <h2 className="text-xl font-black text-white mb-1">{activeBrain.name}</h2>
                   ) : (
                       <input 
                         type="text" 
                         value={activeBrain.name} 
                         onChange={handleUpdateBrainName}
                         className="text-xl font-black text-white bg-transparent outline-none border-b border-transparent focus:border-[#00FF66] w-full"
                         placeholder="Nhập tên chế độ..."
                       />
                   )}
                   <p className="text-xs text-gray-400 font-medium mt-1">
                     Soạn System Prompt / Cấu hình kiến thức cho bộ não này.
                   </p>
                 </div>

                 <div className="flex-1 flex flex-col relative min-h-0">
                   <div className="flex items-center justify-between mb-2">
                     <label className="block text-xs font-bold text-gray-300">System Prompt & Nội Dung</label>
                     <button 
                       onClick={() => scriptFileInputRef.current?.click()}
                       className="text-[11px] px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded font-bold transition-colors flex items-center gap-1 border border-white/10"
                     >
                       <Upload className="w-3 h-3"/> Tải lên file (.txt)
                     </button>
                     <input type="file" ref={scriptFileInputRef} accept=".txt" className="hidden" onChange={handleScriptFileUpload} />
                   </div>
                   <textarea 
                     value={scriptContent}
                     onChange={(e) => setScriptContent(e.target.value)}
                     placeholder="Dán Prompt điều khiển AI hoặc nội dung kiến thức vào đây..." 
                     className="w-full flex-1 p-4 bg-black/40 border border-white/10 rounded-lg text-sm text-gray-300 focus:border-[#00FF66] outline-none resize-none custom-scrollbar"
                   ></textarea>
                 </div>
              </div>
         </div>

         {/* RIGHT PANEL - VOICE */}
         <div className="w-[320px] bg-[#121216]/80 backdrop-blur-md rounded-2xl border border-white/10 p-5 shadow-lg flex flex-col relative overflow-hidden shrink-0">
            <div className="relative z-10 flex-1 flex flex-col min-h-0">
                <div className="mb-4">
                  <h3 className="font-black text-white text-base mb-1">Cấu hình Giọng nói</h3>
                  <p className="text-[10px] text-gray-400 font-medium leading-relaxed">Áp dụng riêng cho chế độ này.</p>
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
    </div>
  );
}
"""

with open("src/components/genaidol/WorkspaceTacVu.jsx", "w") as f:
    f.write(code)
