import React, { useState, useRef } from 'react';
import { Settings, Clock, Mic, Mic2, CheckCircle, UserSquare2, Image as ImageIcon, Play, Upload, Check, Zap, Lock, Brain, Sparkles, FileText, ChevronDown, Monitor, Video, Search, FileAudio } from 'lucide-react';

const MOCK_HISTORY = {
  voice: [
    { id: 'V-001', name: 'Giọng đọc quảng cáo', status: 'completed', time: '10 phút trước' },
    { id: 'V-002', name: 'Kịch bản khai trương', status: 'completed', time: '1 giờ trước' }
  ],
  lipsync: [
    { id: 'L-002', name: 'Video Lipsync Demo 1', status: 'completed', time: '10 phút trước', hasBroadcast: true },
    { id: 'L-001', name: 'Nhép môi lời chào', status: 'processing', time: 'Đang xử lý' }
  ],
  'image-video': [
    { id: 'I-001', name: 'Tạo hình nhân vật', status: 'completed', time: 'Hôm qua' },
    { id: 'V-001', name: 'Video giới thiệu', status: 'completed', time: 'Hôm qua' }
  ]
};

const AI_BRAINS = {
  chatgpt: {
    name: 'OpenAI ChatGPT',
    models: ['GPT-4o-mini (Siêu rẻ, Tối ưu)', 'GPT-4o (Siêu mạnh, Đắt)']
  },
  gemini: {
    name: 'Google Gemini',
    models: ['Gemini 1.5 Flash (Miễn phí, Nhanh)', 'Gemini 1.5 Pro (Nâng cao)']
  }
};

const LIPSYNC_MODELS = [
  { id: 'synclabs', name: 'SyncLabs AI (Ultra Realistic)', desc: 'Chất lượng cao nhất, siêu thực' },
  { id: 'sadtalker', name: 'SadTalker (Tiêu chuẩn)', desc: 'Nhép môi từ ảnh tĩnh tiêu chuẩn' },
  { id: 'wav2lip', name: 'Wav2Lip (Nhanh)', desc: 'Xử lý video nhép môi cực nhanh' },
];

export default function WorkspaceTacVu({ defaultTab = 'voice' }) {
  const [rightTab, setRightTab] = useState('settings'); // 'settings', 'history'
  const [speed, setSpeed] = useState(1.0);
  const [aiBrain, setAiBrain] = useState('chatgpt');
  const [scriptDuration, setScriptDuration] = useState('1'); // Phút
  const [scriptTopic, setScriptTopic] = useState('');
  const [scriptContent, setScriptContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  // Audio Generation
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState(null);

  const [aiModel, setAiModel] = useState(AI_BRAINS[aiBrain].models[0]);
  
  // Update model when brain changes
  React.useEffect(() => {
    setAiModel(AI_BRAINS[aiBrain].models[0]);
  }, [aiBrain]);
  
  const handleGenerateScript = async () => {
    if (!scriptTopic) return alert("Vui lòng nhập chủ đề kịch bản!");
    setIsGenerating(true);
    
    try {
      let apiKey = '';
      if (aiBrain === 'gemini') {
        apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
      } else if (aiBrain === 'chatgpt') {
        apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
      }

      const res = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brain: aiBrain,
          model: aiModel,
          duration: scriptDuration,
          topic: scriptTopic,
          apiKey
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setScriptContent(`[Kịch bản Livestream ${scriptDuration} Phút - Sinh bởi ${AI_BRAINS[aiBrain].name}]\n[Model: ${aiModel}]\n[Chủ đề: ${scriptTopic}]\n\n${data.script}`);
    } catch (err) {
      alert("Lỗi khi tạo kịch bản: " + err.message);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const [voiceProvider, setVoiceProvider] = useState('vbee');
  const [selectedVoice, setSelectedVoice] = useState('vbee_f_n_1');
  const [lipsyncModel, setLipsyncModel] = useState('synclabs');
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [lipsyncAudioType, setLipsyncAudioType] = useState('text'); // 'text' or 'voice'
  const [showPreviewPlayer, setShowPreviewPlayer] = useState(false);
  const [jobName, setJobName] = useState('Kịch bản & Giọng nói');
  
  const handleSaveJob = () => {
    if (!scriptContent.trim()) {
      alert('Vui lòng tạo hoặc nhập kịch bản trước khi lưu Job!');
      return;
    }
    const jobData = {
      id: Date.now().toString(),
      name: jobName,
      scriptContent,
      voiceProvider,
      selectedVoice,
      lipsyncModel,
      generatedAudioUrl,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('aidol_active_job', JSON.stringify(jobData));
    alert('Đã đẩy Job kịch bản sang Đạo Diễn AI (Phiên Live) thành công!');
  };
  
  const handleGenerateAudio = async () => {
    if (!scriptContent) return alert("Vui lòng nhập kịch bản trước khi tạo giọng đọc!");
    setIsGeneratingAudio(true);
    try {
      let apiKey = '';
      let groupId = '';
      if (voiceProvider === 'elevenlabs') {
        apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY || '';
      } else if (voiceProvider === 'minimax') {
        apiKey = import.meta.env.VITE_MINIMAX_API_KEY || '';
        groupId = import.meta.env.VITE_MINIMAX_GROUP_ID || '';
      }

      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: scriptContent,
          platform: voiceProvider,
          voiceId: selectedVoice,
          apiKey,
          groupId,
          speed,
          volume: 1.0,
          pitch: 0
        })
      });
      
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Lỗi không xác định từ API TTS');
      if (data.audioBase64) {
        setGeneratedAudioUrl(`data:audio/mpeg;base64,${data.audioBase64}`);
      }
    } catch (err) {
      alert("Lỗi khi tạo giọng đọc: " + err.message);
    } finally {
      setIsGeneratingAudio(false);
    }
  };
  
  // File References & Selection states
  const videoInputRef = useRef(null);
  const audioInputRef = useRef(null);
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
    reader.readAsDataURL(file); // This gives us a base64 Data URL string
  };

  const [selectedVideoFile, setSelectedVideoFile] = useState(null);
  const [selectedAudioFile, setSelectedAudioFile] = useState(null);
  const [selectedVideoLibraryInfo, setSelectedVideoLibraryInfo] = useState(null);
  const [selectedAILibraryInfo, setSelectedAILibraryInfo] = useState(null);

  // Modals state
  const [showVideoLibraryModal, setShowVideoLibraryModal] = useState(false);
  const [showAILibraryModal, setShowAILibraryModal] = useState(false);

  // Generate Mock Voices
  const generateVoices = (region, prefix) => {
    return Array(10).fill(0).map((_, i) => ({ id: `${prefix}_${i+1}`, name: `${region} - Giọng ${i+1}` }));
  };
  const generateLangs = (prefix) => {
    return Array(50).fill(0).map((_, i) => ({ id: `${prefix}_${i+1}`, name: `Ngôn ngữ Quốc tế ${i+1}` }));
  };

  const VOICES = {
    vbee: [
      { group: 'Nữ Miền Bắc', options: [
        { id: 'vbee_f_n_1', name: 'Ngọc Huyền (MC, Truyền cảm)' },
        { id: 'vbee_f_n_2', name: 'Mai Phương (Trẻ trung, Sôi động)' },
        { id: 'vbee_f_n_3', name: 'Thu Hương (Bản tin, Nghiêm túc)' }
      ]},
      { group: 'Nam Miền Bắc', options: [
        { id: 'vbee_m_n_1', name: 'Mạnh Dũng (Mạnh mẽ, Dứt khoát)' },
        { id: 'vbee_m_n_2', name: 'Hoàng Bách (Trầm ấm, Kể chuyện)' }
      ]},
      { group: 'Nữ Miền Nam', options: [
        { id: 'vbee_f_s_1', name: 'Thảo Chi (Nhí nhảnh, Dễ thương)' },
        { id: 'vbee_f_s_2', name: 'Lan Trinh (Tự nhiên, Bán hàng)' }
      ]},
      { group: 'Nam Miền Nam', options: [
        { id: 'vbee_m_s_1', name: 'Minh Hoàng (Reviewer, Hiện đại)' }
      ]},
      { group: 'Nữ Miền Trung', options: [
        { id: 'vbee_f_c_1', name: 'Trúc Quỳnh (Ngọt ngào, Nhẹ nhàng)' }
      ]}
    ],
    elevenlabs: [
      { group: 'Tiếng Anh (Bản ngữ & Siêu thực)', options: [
        { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel (Nữ, Bình tĩnh, Mềm mại)' },
        { id: '29vD33N1CtxCmqQRPOHJ', name: 'Drew (Nam, Thời sự, Nghiêm túc)' },
        { id: '2EiwWnXFnvU5JabPnv8n', name: 'Clyde (Nam, Phong trần, Khàn)' },
        { id: '5Q0t7uMcjvnagumLfvZi', name: 'Paul (Nam, Phóng sự, Sâu lắng)' },
        { id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi (Nữ, Mạnh mẽ, Kể chuyện)' },
        { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah (Nữ, Tự nhiên, Mềm mại)' },
        { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni (Nam, Thân thiện, Sáng sủa)' },
        { id: 'GBv7mTt0atIp3Br8iCZE', name: 'Thomas (Nam, Kể chuyện, Truyền cảm)' },
        { id: 'IKne3meq5aSn9XLyUdCD', name: 'Charlie (Nam, Tự nhiên, Giao tiếp)' },
        { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George (Nam, Ấm áp, Rõ ràng)' },
        { id: 'LcfcDJNUP1GQjkvn1xUw', name: 'Emily (Nữ, Trẻ trung, Năng động)' },
        { id: 'MF3mGyEYCl7XYWbV9V6O', name: 'Elli (Nữ, Truyền cảm, Nhẹ nhàng)' },
        { id: 'N2lVS1w4EtoT3dr4eOWO', name: 'Callum (Nam, Kể chuyện, Anh)' },
        { id: 'ODq5zmih8GrVes3RoWEZ', name: 'Patrick (Nam, Quyền lực, Trang trọng)' },
        { id: 'SOYHL32BrMac43zF2B5G', name: 'Harry (Nam, Sôi động, Lôi cuốn)' }
      ]}
    ],
    gemini: [
      { group: 'Google Cloud TTS (Tiếng Việt)', options: [
        { id: 'vi-VN-Standard-A', name: 'vi-VN-Standard-A (Nữ - Tiêu chuẩn)' },
        { id: 'vi-VN-Standard-B', name: 'vi-VN-Standard-B (Nam - Tiêu chuẩn)' },
        { id: 'vi-VN-Standard-C', name: 'vi-VN-Standard-C (Nữ - Tiêu chuẩn)' },
        { id: 'vi-VN-Standard-D', name: 'vi-VN-Standard-D (Nam - Tiêu chuẩn)' },
        { id: 'vi-VN-Neural2-A', name: 'vi-VN-Neural2-A (Nữ - Cao cấp)' },
        { id: 'vi-VN-Neural2-D', name: 'vi-VN-Neural2-D (Nam - Cao cấp)' },
        { id: 'vi-VN-Wavenet-A', name: 'vi-VN-Wavenet-A (Nữ - Tự nhiên)' },
        { id: 'vi-VN-Wavenet-B', name: 'vi-VN-Wavenet-B (Nam - Tự nhiên)' },
        { id: 'vi-VN-Wavenet-C', name: 'vi-VN-Wavenet-C (Nữ - Tự nhiên)' },
        { id: 'vi-VN-Wavenet-D', name: 'vi-VN-Wavenet-D (Nam - Tự nhiên)' }
      ]}
    ],
    minimax: [
      { group: 'Giọng Nam MiniMax', options: [
        { id: 'male-qn-qingse', name: 'Thanh Niên (Năng động, Thanh xuân)' },
        { id: 'male-qn-jingying', name: 'Trung Niên (Doanh nhân, Tự tin)' },
        { id: 'male-qn-badao', name: 'Tổng Tài (Trầm ấm, Quyền lực)' },
        { id: 'male-qn-daxuesheng', name: 'Sinh Viên (Vui vẻ, Thân thiện)' }
      ]},
      { group: 'Giọng Nữ MiniMax', options: [
        { id: 'female-shaonv', name: 'Thiếu Nữ (Nhí nhảnh, Đáng yêu)' },
        { id: 'female-yujie', name: 'Ngự Tỷ (Quyến rũ, Sắc sảo)' },
        { id: 'female-chengshu', name: 'Trưởng Thành (Chuyên nghiệp, MC)' },
        { id: 'female-tianmei', name: 'Ngọt Ngào (Bán hàng, Dịu dàng)' },
        { id: 'female-zhixing', name: 'Trí Thức (Bản tin, Rõ ràng)' }
      ]}
    ]
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 pb-24 text-white">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
         <div className="flex items-center gap-3 mb-6 bg-black/40 p-4 rounded-2xl border border-white/10 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-[#00FF66]/10 rounded-full blur-[40px] pointer-events-none group-hover:bg-[#00FF66]/20 transition-all"></div>
           <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00FF66]/20 to-[#00CC52]/20 flex items-center justify-center border border-[#00FF66]/30 shadow-glow-green relative z-10">
              <Mic className="w-6 h-6 text-[#00FF66]" />
           </div>
           <div className="relative z-10">
               <h1 className="text-lg font-black text-white">
                  Cấu hình Nội dung & Giọng Nói
               </h1>
               <p className="text-xs text-gray-400 font-medium mt-0.5">
                  Nạp nội dung Bán Hàng (Knowledge Base) và chọn Giọng Đọc cho AI.
               </p>
           </div>
        </div>
         <button className="px-5 py-2.5 bg-[#121216] border border-white/10 hover:border-[#00FF66] text-[#00FF66] rounded-xl font-bold shadow-glow-green transition-all text-sm whitespace-nowrap">
            Quản lý AIDOL
         </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
         {/* LEFT PANEL - CONTENT */}
         <div className="flex-[1.5] bg-[#121216]/80 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg p-6 sm:p-8 flex flex-col min-h-[600px] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00FF66]/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="relative z-10 flex flex-col h-full">
                <div className="mb-6">
                  <h2 className="text-xl font-black text-white mb-1">Nạp nội dung Bán Hàng (Knowledge Base)</h2>
                  <p className="text-xs text-gray-400 font-medium">Dán nội dung sản phẩm hoặc tải lên file .txt để AI học và trả lời siêu thông minh trên Live.</p>
                </div>

                <div className="flex-1 flex flex-col mb-6 relative">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-gray-300">Nội dung sản phẩm / Kịch bản nền</label>
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
                    placeholder="Dán nội dung tiếng Việt có dấu hoặc không dấu, hoặc tải lên từ file .txt..." 
                    className="w-full flex-1 min-h-[200px] p-4 bg-black/40 border border-white/10 rounded-lg text-sm text-gray-300 focus:border-[#00FF66] outline-none resize-none custom-scrollbar"
                  ></textarea>
                </div>

                <div className="bg-[#00FF66]/5 border border-[#00FF66]/20 rounded-xl p-4 flex items-center justify-between mt-auto">
                   <div>
                      <div className="text-[10px] font-bold text-[#00FF66] uppercase tracking-wider mb-1">Chi phí dự kiến</div>
                      <div className="text-xl font-black text-white">0 KOL Coin</div>
                      <div className="text-[10px] text-gray-400 mt-1">Giá giọng đang chọn: Phụ thuộc vào nền tảng API.</div>
                   </div>
                   <button onClick={handleSaveJob} className="px-6 py-3 bg-[#00FF66] text-black hover:bg-[#00CC52] rounded-xl font-black transition-colors shadow-glow-green">
                     Lưu Cấu Hình (Đẩy lên Live)
                   </button>
                </div>
              </div>
         </div>

         {/* RIGHT PANEL */}
         <div className="w-full lg:w-[400px]">
            <div className="bg-[#121216]/80 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-lg min-h-[600px] flex flex-col relative overflow-hidden">
               
               <div className="flex bg-black/40 rounded-lg border border-white/10 p-1 mb-6">
                  <button onClick={() => setRightTab('settings')} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded font-bold text-xs transition-colors ${rightTab === 'settings' ? 'bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/30 shadow-glow-green' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                    <Settings className="w-4 h-4"/> Cài đặt
                  </button>
                  <button onClick={() => setRightTab('history')} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded font-bold text-xs transition-colors ${rightTab === 'history' ? 'bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/30 shadow-glow-green' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                    <Clock className="w-4 h-4"/> Lịch sử <span className="bg-[#00FF66] text-black px-1.5 py-0.5 rounded-full text-[9px]">{MOCK_HISTORY[defaultTab]?.length || 0}</span>
                  </button>
               </div>

               {rightTab === 'settings' && (
                 <div className="relative z-10 flex-1 flex flex-col">
                     <>
                       <div className="mb-6">
                         <h3 className="font-black text-white text-lg mb-1">Cấu hình API Giọng</h3>
                         <p className="text-[11px] text-gray-400 font-medium leading-relaxed">Chọn các nền tảng TTS: ElevenLabs, VBee, Gemini, và các model API miễn phí.</p>
                       </div>

                       <div className="space-y-6 flex-1 flex flex-col">
                         <div>
                           <label className="block text-[11px] font-bold text-gray-300 mb-2">Nền tảng API</label>
                           <select 
                             value={voiceProvider}
                             onChange={(e) => setVoiceProvider(e.target.value)}
                             className="w-full px-4 py-2.5 bg-black/60 border border-white/10 rounded-lg text-sm font-bold text-gray-200 outline-none focus:border-[#00FF66]"
                           >
                             <option value="vbee">VBee (Việt Nam)</option>
                             <option value="elevenlabs">ElevenLabs (Cao cấp)</option>
                             <option value="gemini">Google Gemini Voice</option>
                             <option value="minimax">MiniMax (Giọng tự nhiên)</option>
                           </select>
                         </div>

                         <div className="flex-1 flex flex-col min-h-[250px]">
                           <label className="block text-[11px] font-bold text-gray-300 mb-2">Chọn Giọng đọc ({VOICES[voiceProvider].reduce((acc, g) => acc + g.options.length, 0)} giọng)</label>
                           <div className="bg-black/40 border border-white/10 rounded-lg p-2 flex-1 overflow-y-auto custom-scrollbar">
                             {VOICES[voiceProvider].map((group, idx) => (
                               <div key={idx} className="mb-3 last:mb-0">
                                  <div className="text-[10px] font-bold text-[#00FF66] uppercase tracking-wider mb-1 px-2">{group.group}</div>
                                  <div className="space-y-1">
                                    {group.options.map(voice => (
                                      <button 
                                        key={voice.id} 
                                        onClick={() => setSelectedVoice(voice.id)}
                                        className={`w-full text-left px-3 py-2 rounded-md text-[11px] font-bold transition-colors flex justify-between items-center ${selectedVoice === voice.id ? 'bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/30' : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'}`}
                                      >
                                        <span>{voice.name}</span>
                                        {selectedVoice === voice.id && <Check className="w-3 h-3" />}
                                      </button>
                                    ))}
                                  </div>
                               </div>
                             ))}
                           </div>
                            <div className="flex flex-col gap-2 mt-3">
                              <button 
                                onClick={handleGenerateAudio}
                                disabled={isGeneratingAudio || !scriptContent || (voiceProvider !== 'elevenlabs' && voiceProvider !== 'minimax' && voiceProvider !== 'gemini')}
                                className="w-full py-2.5 bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/30 hover:bg-[#00FF66]/30 shadow-glow-green rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isGeneratingAudio ? <div className="w-4 h-4 border-2 border-t-[#00FF66] border-[#00FF66]/30 rounded-full animate-spin"></div> : <Mic2 className="w-4 h-4"/>}
                                {isGeneratingAudio ? 'Đang tạo âm thanh...' : 'Tạo Giọng Đọc (TTS API)'}
                              </button>
                              
                              <div className="flex items-center gap-2">
                                <div className="h-px bg-white/10 flex-1"></div>
                                <span className="text-[10px] text-gray-500 font-bold uppercase">Hoặc</span>
                                <div className="h-px bg-white/10 flex-1"></div>
                              </div>
                              
                              <button 
                                onClick={() => audioFileInputRef.current?.click()}
                                className="w-full py-2.5 bg-white/5 text-white border border-white/10 hover:bg-white/10 rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-2"
                              >
                                <Upload className="w-4 h-4"/> Tải file Audio của bạn (.mp3, .wav)
                              </button>
                              <input type="file" ref={audioFileInputRef} accept="audio/*" className="hidden" onChange={handleAudioFileUpload} />
                            </div>

                            {generatedAudioUrl && (
                              <div className="mt-3 p-3 bg-white/5 border border-white/10 rounded-lg">
                                <p className="text-[10px] text-gray-400 mb-2 font-bold flex items-center gap-1"><CheckCircle className="w-3 h-3 text-[#00FF66]" /> Xem trước Audio</p>
                                <audio controls src={generatedAudioUrl} className="w-full h-8" />
                              </div>
                            )}
                          </div>

                         <div className="mt-auto">
                           <label className="block text-[11px] font-bold text-gray-300 mb-2">Tốc độ: {speed.toFixed(2)}</label>
                           <div className="bg-black/40 border border-white/10 rounded-xl p-4">
                              <input 
                                type="range" min="0.5" max="2.0" step="0.1" value={speed} 
                                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                                className="w-full accent-[#00FF66] mb-2 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer" 
                              />
                              <div className="flex justify-between text-[10px] text-gray-500 font-bold">
                                <span>Chậm hơn</span>
                                <span>Nhanh hơn</span>
                              </div>
                           </div>
                         </div>
                       </div>
                     </>
                 </div>
               )}

               {rightTab === 'history' && (
                 <div className="flex flex-col h-full relative z-10">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="font-black text-white text-sm">Lịch sử tác vụ</h3>
                      <span className="text-[10px] bg-white/10 text-gray-300 px-2 py-0.5 rounded font-bold border border-white/5">
                        Giọng & Kịch bản
                      </span>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
                       {MOCK_HISTORY[defaultTab]?.map(job => (
                          <div key={job.id} className="p-4 border border-white/10 rounded-xl hover:border-[#00FF66]/50 transition-colors bg-black/40 group cursor-pointer">
                             <div className="flex justify-between items-start mb-2">
                                <div className="font-bold text-white text-xs truncate mr-2 group-hover:text-[#00FF66] transition-colors">{job.name}</div>
                                {job.status === 'completed' && <Check className="w-3 h-3 text-[#00FF66] flex-shrink-0" />}
                                {job.status === 'processing' && <Clock className="w-3 h-3 text-blue-400 flex-shrink-0" />}
                             </div>
                             <div className="flex justify-between items-center text-[10px]">
                                <span className="text-gray-500 font-medium">{job.time}</span>
                                <span className={`font-bold ${job.status === 'completed' ? 'text-[#00FF66]' : 'text-blue-400'}`}>
                                   {job.status === 'completed' ? 'Hoàn thành' : 'Đang xử lý'}
                                </span>
                             </div>
                           </div>
                       ))}
                       {(!MOCK_HISTORY[defaultTab] || MOCK_HISTORY[defaultTab].length === 0) && (
                          <div className="text-center p-8 text-gray-500 text-xs">Không có lịch sử nào.</div>
                       )}
                    </div>
                 </div>
               )}
            </div>
         </div>
      </div>

    </div>
  );
}
