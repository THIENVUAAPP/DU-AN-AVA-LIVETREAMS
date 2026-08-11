import React, { useState, useRef } from 'react';
import { Settings, Clock, Mic, UserSquare2, Image as ImageIcon, Play, Upload, Check, Zap, Lock, Brain, Sparkles, FileText, ChevronDown, Monitor, Video, Search, FileAudio } from 'lucide-react';

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
    models: ['GPT-4o (Khuyên dùng)', 'GPT-4 Turbo', 'GPT-3.5']
  },
  claude: {
    name: 'Claude AI',
    models: ['Claude 3.5 Sonnet (Mạnh nhất)', 'Claude 3 Opus', 'Claude 3 Haiku']
  },
  gemini: {
    name: 'Google Gemini',
    models: ['Gemini 1.5 Pro', 'Gemini 1.5 Flash']
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
  // aiModel is now automatically inferred from the selected brain platform as the first element (the strongest)
  const aiModel = AI_BRAINS[aiBrain].models[0];
  
  const [voiceProvider, setVoiceProvider] = useState('vbee');
  const [selectedVoice, setSelectedVoice] = useState('vbee_f_n_1');
  const [lipsyncModel, setLipsyncModel] = useState('synclabs');
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [lipsyncAudioType, setLipsyncAudioType] = useState('text'); // 'text' or 'voice'
  const [showPreviewPlayer, setShowPreviewPlayer] = useState(false);
  
  // File References & Selection states
  const videoInputRef = useRef(null);
  const audioInputRef = useRef(null);
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
      { group: 'Nữ Miền Bắc', options: generateVoices('Nữ HN', 'vbee_f_n') },
      { group: 'Nam Miền Bắc', options: generateVoices('Nam HN', 'vbee_m_n') },
      { group: 'Nữ Miền Trung', options: generateVoices('Nữ Huế', 'vbee_f_c') },
      { group: 'Nam Miền Trung', options: generateVoices('Nam Đà Nẵng', 'vbee_m_c') },
      { group: 'Nữ Miền Nam', options: generateVoices('Nữ HCM', 'vbee_f_s') },
      { group: 'Nam Miền Nam', options: generateVoices('Nam HCM', 'vbee_m_s') },
      { group: 'Nữ Miền Tây', options: generateVoices('Nữ Cần Thơ', 'vbee_f_w') },
      { group: 'Nam Miền Tây', options: generateVoices('Nam Cần Thơ', 'vbee_m_w') },
    ],
    elevenlabs: [
      { group: 'English (US)', options: generateVoices('US English', 'el_us') },
      { group: 'English (UK)', options: generateVoices('UK English', 'el_uk') },
      { group: 'Other Languages (50+)', options: generateLangs('el_multi') }
    ],
    gemini: [
      { group: 'Giọng đọc Google Nữ', options: generateVoices('Google Nữ', 'gg_f') },
      { group: 'Giọng đọc Google Nam', options: generateVoices('Google Nam', 'gg_m') },
    ],
    free: [
      { group: 'API Miễn phí Nữ', options: generateVoices('Free Nữ', 'fr_f') },
      { group: 'API Miễn phí Nam', options: generateVoices('Free Nam', 'fr_m') },
    ]
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 pb-24 text-white">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
         <div>
            <h1 className="text-4xl lg:text-5xl font-black text-white mb-3 tracking-tight">
               {defaultTab === 'voice' && 'Soạn Kịch Bản & Giọng Nói'}
               {defaultTab === 'lipsync' && 'Tạo Video & Truyền Live'}
            </h1>
            <p className="text-sm text-gray-400 font-medium max-w-2xl">
               {defaultTab === 'voice' && 'Tạo kịch bản với bộ não AI và chuyển đổi thành giọng nói mượt mà.'}
               {defaultTab === 'lipsync' && 'Lồng ghép video mẫu và lời thoại/âm thanh để tạo thành video hoàn chỉnh.'}
            </p>
         </div>
         <button className="px-5 py-2.5 bg-[#121216] border border-white/10 hover:border-[#00FF66] text-[#00FF66] rounded-xl font-bold shadow-glow-green transition-all text-sm whitespace-nowrap">
            Quản lý AIDOL
         </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
         {/* LEFT PANEL - CONTENT */}
         <div className="flex-[1.5] bg-[#121216]/80 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg p-6 sm:p-8 flex flex-col min-h-[600px] relative overflow-hidden">
            {/* Subtle glow effect behind */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00FF66]/5 rounded-full blur-[100px] pointer-events-none"></div>

            {defaultTab === 'voice' && (
              <div className="relative z-10 flex flex-col h-full">
                <div className="mb-6">
                  <h2 className="text-xl font-black text-white mb-1">Bộ não AI & Soạn nội dung</h2>
                  <p className="text-xs text-gray-400 font-medium">Viết kịch bản bằng AI hoặc dán nội dung của bạn vào.</p>
                </div>

                {/* AI Brain Selection */}
                <div className="mb-6 p-4 bg-black/40 rounded-xl border border-white/5">
                   <label className="flex items-center gap-2 text-xs font-bold text-gray-200 mb-3">
                     <Brain className="w-4 h-4 text-[#00FF66]" /> Chọn Bộ Não Kịch Bản
                   </label>
                   <div className="grid grid-cols-3 gap-2 mb-3">
                      {Object.keys(AI_BRAINS).map(brainKey => (
                         <button 
                           key={brainKey}
                           onClick={() => setAiBrain(brainKey)} 
                           className={`p-3 rounded-lg border text-xs font-bold transition-all ${aiBrain === brainKey ? 'bg-[#00FF66]/10 border-[#00FF66]/50 text-[#00FF66] shadow-glow-green' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'}`}
                         >
                           {AI_BRAINS[brainKey].name}
                         </button>
                      ))}
                   </div>
                   
                   {/* Model Info (Hidden explicit selection, shows strongest default) */}
                   <div className="mb-4 text-[11px] font-bold text-gray-400 bg-white/5 py-1.5 px-3 rounded-md inline-flex items-center gap-2 border border-white/5">
                      <Sparkles className="w-3 h-3 text-[#00FF66]" />
                      Model thông minh: <span className="text-white">{aiModel}</span> (Mặc định cấu hình cao nhất)
                   </div>

                   <div className="flex gap-2">
                     <input type="text" placeholder={`Nhập chủ đề để ${AI_BRAINS[aiBrain].name} tự động viết kịch bản...`} className="flex-1 px-4 py-2 bg-black/60 border border-white/10 rounded-lg text-sm text-white outline-none focus:border-[#00FF66]" />
                     <button className="px-4 py-2 bg-[#00FF66]/20 border border-[#00FF66]/50 text-[#00FF66] rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-[#00FF66]/30 shadow-glow-green">
                       <Sparkles className="w-4 h-4"/> Tạo kịch bản
                     </button>
                   </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-xs font-bold text-gray-300 mb-2">Tên job</label>
                  <input type="text" defaultValue="Kịch bản & Giọng nói" className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-sm font-bold text-white focus:border-[#00FF66] outline-none" />
                </div>

                <div className="flex-1 flex flex-col mb-6">
                  <label className="block text-xs font-bold text-gray-300 mb-2">Nội dung (Text to Speech)</label>
                  <textarea 
                    placeholder="Dán nội dung tiếng Việt có dấu hoặc không dấu..." 
                    className="w-full flex-1 min-h-[200px] p-4 bg-black/40 border border-white/10 rounded-lg text-sm text-gray-300 focus:border-[#00FF66] outline-none resize-none custom-scrollbar"
                  ></textarea>
                </div>

                <div className="bg-[#00FF66]/5 border border-[#00FF66]/20 rounded-xl p-4 flex items-center justify-between mt-auto">
                   <div>
                      <div className="text-[10px] font-bold text-[#00FF66] uppercase tracking-wider mb-1">Chi phí dự kiến</div>
                      <div className="text-xl font-black text-white">0 KOL Coin</div>
                      <div className="text-[10px] text-gray-400 mt-1">Giá giọng đang chọn: Phụ thuộc vào nền tảng API.</div>
                   </div>
                   <button className="px-6 py-3 bg-[#00FF66] text-black hover:bg-[#00CC52] rounded-xl font-black transition-colors shadow-glow-green">
                     Tạo giọng nói
                   </button>
                </div>
              </div>
            )}

            {defaultTab === 'lipsync' && (
              <div className="relative z-10 flex flex-col h-full">
                <div className="mb-6 flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-black text-white mb-1">Tạo Video & Phát Live</h2>
                    <p className="text-xs text-gray-400 font-medium">Ghép lời thoại hoặc âm thanh vào video mẫu, xem trước và phát trực tiếp.</p>
                  </div>
                  <button 
                    onClick={() => setShowBroadcastModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-400 border border-purple-500/50 rounded-lg text-xs font-bold hover:bg-purple-500/30 transition-all shadow-glow-purple animate-pulse"
                  >
                    <Monitor className="w-4 h-4" /> Truyền Live Studio
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 mb-6">
                   {/* LEFT COLUMN: Input settings */}
                   <div className="flex flex-col gap-5 border-r border-white/10 pr-6">
                      
                      {/* 1. Source Video Selection */}
                      <div>
                         <label className="block text-xs font-bold text-gray-300 mb-2 flex items-center gap-2">
                           <Video className="w-4 h-4 text-[#00FF66]" /> 1. Video Gốc (Mẫu)
                         </label>
                         <div className="flex bg-black/40 rounded-lg border border-white/10 p-1 mb-3">
                            <button onClick={() => { setSelectedVideoLibraryInfo(null); videoInputRef.current?.click(); }} className={`flex-1 py-2 rounded text-xs font-bold transition-all ${!selectedVideoLibraryInfo ? 'bg-[#00FF66]/20 text-[#00FF66]' : 'text-gray-400 hover:text-white'}`}>
                              Tải từ máy lên
                            </button>
                            <button onClick={() => setShowVideoLibraryModal(true)} className={`flex-1 py-2 rounded text-xs font-bold transition-all ${selectedVideoLibraryInfo ? 'bg-[#00FF66]/20 text-[#00FF66]' : 'text-gray-400 hover:text-white'}`}>
                              Chọn theo chủ đề
                            </button>
                         </div>
                         <div onClick={() => !selectedVideoLibraryInfo && videoInputRef.current?.click()} className="flex border border-white/10 rounded-lg overflow-hidden bg-black/40 hover:border-[#00FF66]/50 transition-colors cursor-pointer">
                           <button className="px-4 py-2.5 bg-white/5 border-r border-white/10 text-xs font-bold text-gray-300 hover:bg-white/10 flex-shrink-0">
                              {selectedVideoLibraryInfo ? 'Thay đổi từ Kho' : 'Chọn Tệp'}
                           </button>
                           <div className="px-4 py-2.5 text-xs text-[#00FF66] font-medium flex-1 flex items-center truncate">
                              {selectedVideoLibraryInfo ? selectedVideoLibraryInfo : (selectedVideoFile ? selectedVideoFile.name : 'Chưa có file hoặc chưa chọn từ Kho...')}
                           </div>
                         </div>
                         <input type="file" accept="video/*" className="hidden" ref={videoInputRef} onChange={(e) => { if(e.target.files[0]) { setSelectedVideoFile(e.target.files[0]); setSelectedVideoLibraryInfo(null); } }} />
                      </div>

                      {/* 2. Audio Source (Text / Voice) */}
                      <div className="flex-1 flex flex-col">
                         <label className="block text-xs font-bold text-gray-300 mb-2 flex items-center gap-2">
                           <Mic className="w-4 h-4 text-[#00FF66]" /> 2. Âm thanh đầu vào
                         </label>
                         <div className="flex bg-black/40 rounded-lg border border-white/10 p-1 mb-3">
                            <button 
                              onClick={() => { setLipsyncAudioType('voice'); setSelectedAILibraryInfo(null); audioInputRef.current?.click(); }} 
                              className={`flex-1 py-2 rounded text-xs font-bold transition-all ${lipsyncAudioType === 'voice' && !selectedAILibraryInfo ? 'bg-[#00FF66]/20 text-[#00FF66]' : 'text-gray-400 hover:text-white'}`}
                            >
                              Tải từ máy lên
                            </button>
                            <button 
                              onClick={() => { setLipsyncAudioType('text'); setShowAILibraryModal(true); }} 
                              className={`flex-1 py-2 rounded text-xs font-bold transition-all ${lipsyncAudioType === 'text' || selectedAILibraryInfo ? 'bg-[#00FF66]/20 text-[#00FF66]' : 'text-gray-400 hover:text-white'}`}
                            >
                              Tải từ Kịch Bản AI
                            </button>
                         </div>

                         <div className="mb-2">
                           <label className="block text-[10px] font-bold text-gray-400 mb-1">Tiêu đề Video</label>
                           <input type="text" placeholder="Nhập tiêu đề..." className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs text-white focus:border-[#00FF66] outline-none" />
                         </div>

                         {lipsyncAudioType === 'text' || selectedAILibraryInfo ? (
                            <div className="flex-1 bg-black/40 border border-[#00FF66]/30 rounded-lg p-4 flex flex-col justify-center items-center text-center cursor-pointer hover:bg-black/60 transition-colors" onClick={() => setShowAILibraryModal(true)}>
                               <Brain className="w-8 h-8 text-[#00FF66] mb-2 opacity-80" />
                               {selectedAILibraryInfo ? (
                                  <>
                                    <div className="text-xs font-bold text-white mb-1">Đã chọn: {selectedAILibraryInfo}</div>
                                    <div className="text-[10px] text-gray-400">Click để đổi kịch bản AI khác</div>
                                  </>
                               ) : (
                                  <>
                                    <div className="text-xs font-bold text-white mb-1">Chưa chọn Kịch Bản từ Não Bộ AI</div>
                                    <div className="text-[10px] text-[#00FF66]">Nhấn vào đây để mở Kho kịch bản AI</div>
                                  </>
                               )}
                            </div>
                         ) : (
                            <div onClick={() => audioInputRef.current?.click()} className="flex-1 border-2 border-dashed border-white/10 rounded-lg flex flex-col items-center justify-center p-4 bg-black/20 hover:border-[#00FF66]/50 hover:bg-[#00FF66]/5 transition-all mb-2 cursor-pointer relative overflow-hidden group">
                               <Upload className={`w-6 h-6 mb-2 ${selectedAudioFile ? 'text-[#00FF66]' : 'text-gray-400'} group-hover:text-[#00FF66] transition-colors`} />
                               <span className={`text-xs font-bold truncate px-4 text-center max-w-full ${selectedAudioFile ? 'text-[#00FF66]' : 'text-gray-400'}`}>
                                  {selectedAudioFile ? `Đã chọn: ${selectedAudioFile.name}` : 'Kéo thả file âm thanh (hoặc Click)'}
                               </span>
                               {selectedAudioFile && <div className="absolute top-2 right-2 bg-black/60 rounded px-2 py-1 text-[9px] text-gray-300">Nhấp để thay đổi</div>}
                            </div>
                         )}
                         <input type="file" accept="audio/*" className="hidden" ref={audioInputRef} onChange={(e) => { if(e.target.files[0]) { setSelectedAudioFile(e.target.files[0]); setSelectedAILibraryInfo(null); } }} />
                      </div>

                         {lipsyncAudioType === 'text' && (
                            <div className="text-[10px] text-gray-500 font-medium px-1">
                               Giọng đọc đang chọn: <span className="text-[#00FF66] font-bold">VBee - Miền Bắc (Nữ)</span> (Đổi ở tab Cài đặt)
                            </div>
                         )}
                      </div>

                   </div>

                   {/* RIGHT COLUMN: Output / Preview */}
                   <div className="flex flex-col">
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-[10px] font-black text-[#00FF66] uppercase tracking-widest">TRÌNH XEM TRƯỚC (PREVIEW)</label>
                        {showPreviewPlayer && (
                          <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded font-bold border border-green-500/30">
                            Đã Render xong
                          </span>
                        )}
                      </div>

                      <div className="w-full aspect-video bg-black/60 border border-white/10 rounded-xl overflow-hidden flex flex-col items-center justify-center relative shadow-lg group">
                        {showPreviewPlayer ? (
                           <>
                             {/* Mock Preview Video Player */}
                             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center opacity-50 mix-blend-luminosity"></div>
                             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                             
                             <button className="w-12 h-12 rounded-full bg-[#00FF66]/20 border border-[#00FF66]/50 flex items-center justify-center text-[#00FF66] hover:bg-[#00FF66] hover:text-black hover:scale-110 transition-all z-10 shadow-glow-green">
                               <Play className="w-5 h-5 ml-1" />
                             </button>
                             
                             <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-between items-center z-10">
                               <div className="text-[10px] font-bold text-white bg-black/40 px-2 py-1 rounded">00:00 / 00:30</div>
                               <button className="text-[10px] font-bold bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded transition-colors border border-white/10">Tải về máy</button>
                             </div>
                           </>
                        ) : (
                           <div className="text-center p-6">
                             <ImageIcon className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                             <p className="text-xs text-gray-500 font-medium">Bản xem trước video nhép miệng sẽ hiển thị tại đây.</p>
                           </div>
                        )}
                      </div>

                      <div className="mt-auto pt-6 flex flex-col gap-3">
                         <button 
                           onClick={() => setShowPreviewPlayer(true)}
                           className="w-full py-3 bg-[#00FF66] hover:bg-[#00CC52] text-black rounded-xl font-black transition-all shadow-glow-green flex items-center justify-center gap-2"
                         >
                           <Zap className="w-4 h-4" /> Bắt đầu Ghép (Tạo Video)
                         </button>
                      </div>
                   </div>
                </div>

              </div>
            )}
         </div>

         {/* RIGHT PANEL */}
         <div className="w-full lg:w-[400px]">
            <div className="bg-[#121216]/80 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-lg min-h-[600px] flex flex-col relative overflow-hidden">
               
               {/* Right Panel Tabs */}
               <div className="flex bg-black/40 rounded-lg border border-white/10 p-1 mb-6">
                  <button onClick={() => setRightTab('settings')} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded font-bold text-xs transition-colors ${rightTab === 'settings' ? 'bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/30 shadow-glow-green' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                    <Settings className="w-4 h-4"/> Cài đặt
                  </button>
                  <button onClick={() => setRightTab('history')} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded font-bold text-xs transition-colors ${rightTab === 'history' ? 'bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/30 shadow-glow-green' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                    <Clock className="w-4 h-4"/> Lịch sử <span className="bg-[#00FF66] text-black px-1.5 py-0.5 rounded-full text-[9px]">{MOCK_HISTORY[defaultTab]?.length || 0}</span>
                  </button>
               </div>

               {/* SETTINGS VIEW */}
               {rightTab === 'settings' && (
                 <div className="relative z-10 flex-1 flex flex-col">
                   {defaultTab === 'voice' && (
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
                             <option value="free">Miễn phí / API Rẻ</option>
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
                           <button className="w-full mt-3 py-2.5 bg-white/5 text-white hover:bg-white/10 border border-white/10 rounded-lg font-bold text-xs transition-colors">
                              Nghe thử giọng đang chọn
                           </button>
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
                   )}

                   {defaultTab === 'lipsync' && (
                     <>
                       <div className="mb-6">
                         <h3 className="font-black text-white text-lg mb-1">Cài đặt Model</h3>
                         <p className="text-[11px] text-gray-400 font-medium leading-relaxed">Chọn Model AI xử lý nhép môi theo nhu cầu: Cao cấp nhất (SyncLabs) hoặc nhanh nhất (Wav2Lip).</p>
                       </div>

                       <div className="space-y-6">
                         <div>
                            <label className="block text-[11px] font-bold text-gray-300 mb-2">Chọn thuật toán (Model)</label>
                            <div className="space-y-2">
                               {LIPSYNC_MODELS.map(model => (
                                 <button 
                                   key={model.id}
                                   onClick={() => setLipsyncModel(model.id)}
                                   className={`w-full text-left p-3 rounded-lg border transition-all ${lipsyncModel === model.id ? 'bg-[#00FF66]/10 border-[#00FF66]/50 shadow-glow-green' : 'bg-black/40 border-white/10 hover:border-white/30'}`}
                                 >
                                    <h4 className={`font-bold text-xs mb-1 flex items-center justify-between ${lipsyncModel === model.id ? 'text-[#00FF66]' : 'text-gray-200'}`}>
                                      {model.name}
                                      {lipsyncModel === model.id && <Check className="w-3 h-3" />}
                                    </h4>
                                    <p className="text-[10px] text-gray-400 font-medium">{model.desc}</p>
                                 </button>
                               ))}
                            </div>
                         </div>
                       </div>
                     </>
                   )}
                 </div>
               )}

               {rightTab === 'history' && (
                 <div className="flex flex-col h-full relative z-10">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="font-black text-white text-sm">Lịch sử tác vụ</h3>
                      <span className="text-[10px] bg-white/10 text-gray-300 px-2 py-0.5 rounded font-bold border border-white/5">
                        {defaultTab === 'voice' ? 'Giọng & Kịch bản' : 'Video & Nhép môi'}
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
                             {defaultTab === 'lipsync' && job.status === 'completed' && (
                                <div className="mt-3 pt-3 border-t border-white/10">
                                   <button 
                                      onClick={() => setShowBroadcastModal(true)}
                                      className="w-full py-2 bg-purple-500/20 hover:bg-purple-500/40 text-purple-400 border border-purple-500/30 rounded-lg text-xs font-bold transition-all shadow-glow-purple flex items-center justify-center gap-2"
                                   >
                                      <Monitor className="w-3 h-3" /> Truyền sang Live Studio
                                   </button>
                                </div>
                             )}
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

      {/* BROADCAST MODAL (Clean Window for OBS/TikTok Studio) */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
           <div className="bg-[#121216] border border-white/10 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col">
              <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#0B0E14]">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/50 shadow-glow-purple">
                     <Monitor className="w-4 h-4 text-purple-400 animate-pulse" />
                   </div>
                   <div>
                     <h3 className="text-sm font-black text-white">Chế độ Truyền (Broadcast Mode)</h3>
                     <p className="text-[10px] text-gray-400">Capture cửa sổ này trong OBS hoặc TikTok Live Studio.</p>
                   </div>
                 </div>
                 <button onClick={() => setShowBroadcastModal(false)} className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-lg">Đóng</button>
              </div>
              
              <div className="flex-1 bg-[#00FF00] relative aspect-video flex items-center justify-center group overflow-hidden">
                 {/* Green screen background / Clean video area */}
                 <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 text-white text-[10px] font-mono group-hover:opacity-100 opacity-0 transition-opacity">
                    Chế độ Green Screen Đang bật
                 </div>
                 
                 {/* Placeholder for actual Video Player */}
                 <div className="w-64 h-64 border-2 border-dashed border-black/20 flex flex-col items-center justify-center text-black/50 rounded-xl">
                    <Video className="w-12 h-12 mb-2" />
                    <span className="font-bold text-sm">Video Nhép Miệng 1080p</span>
                    <span className="text-xs">Sẵn sàng capture</span>
                 </div>
              </div>

              <div className="p-4 bg-[#0B0E14] border-t border-white/10 flex justify-between items-center">
                 <div className="text-xs text-gray-400 font-mono">Trạng thái: <span className="text-[#00FF66] font-bold">Chờ chạy kịch bản...</span></div>
                 <div className="flex gap-2">
                   <button className="px-4 py-2 bg-white/5 text-gray-300 hover:text-white rounded-lg text-xs font-bold transition-colors">Tải xuống Video</button>
                   <button className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-xs font-black shadow-glow-purple flex items-center gap-2">
                      <Play className="w-4 h-4" /> Bắt đầu Auto Phát
                   </button>
                 </div>
              </div>
           </div>
        </div>
      {/* VIDEO LIBRARY MODAL (Chọn theo chủ đề) */}
      {showVideoLibraryModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
           <div className="bg-[#121216] border border-white/10 rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col h-[80vh]">
              <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#0B0E14]">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-[#00FF66]/20 flex items-center justify-center border border-[#00FF66]/50">
                     <Video className="w-4 h-4 text-[#00FF66]" />
                   </div>
                   <div>
                     <h3 className="text-sm font-black text-white">Kho Video Mẫu Nhép Miệng</h3>
                     <p className="text-[10px] text-gray-400">Chọn một video mẫu từ các chủ đề hot nhất</p>
                   </div>
                 </div>
                 <button onClick={() => setShowVideoLibraryModal(false)} className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-lg">Đóng</button>
              </div>
              
              <div className="flex-1 flex overflow-hidden">
                {/* Categories Sidebar */}
                <div className="w-48 bg-black/30 border-r border-white/10 flex flex-col">
                  <div className="p-3 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-white/10">Chủ Đề</div>
                  <div className="overflow-y-auto flex-1 p-2 space-y-1">
                    {['Bán hàng TikTok', 'Livestream Game', 'Bản tin AI', 'Kể chuyện / Podcast', 'Giải trí / Hài', 'Review sản phẩm'].map((cat, idx) => (
                      <button key={idx} className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg transition-colors ${idx === 0 ? 'bg-[#00FF66]/20 text-[#00FF66]' : 'text-gray-300 hover:bg-white/5'}`}>
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Video Grid */}
                <div className="flex-1 overflow-y-auto p-6 bg-black/20">
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                     {[1,2,3,4,5,6,7,8,9,10,11,12].map(item => (
                       <div 
                         key={item} 
                         onClick={() => {
                           setSelectedVideoLibraryInfo(`Mẫu bán hàng ${item} - 1080p`);
                           setSelectedVideoFile(null); // Clear local file if any
                           setShowVideoLibraryModal(false);
                         }}
                         className="group cursor-pointer"
                       >
                         <div className="aspect-[9/16] bg-gray-800 rounded-xl overflow-hidden mb-2 relative border-2 border-transparent group-hover:border-[#00FF66] transition-all">
                            <div className="absolute inset-0 bg-cover bg-center opacity-70 group-hover:opacity-100 transition-opacity" style={{backgroundImage: `url('https://images.unsplash.com/photo-1594751543129-6701ad444259?w=300&q=80')`}}></div>
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all flex items-center justify-center">
                              <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                                <Play className="w-4 h-4 text-white ml-1" />
                              </div>
                            </div>
                            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">00:15</div>
                         </div>
                         <h4 className="text-xs font-bold text-gray-200 group-hover:text-[#00FF66] truncate">Video Bán Hàng {item}</h4>
                         <p className="text-[10px] text-gray-500">Người thật - Đứng</p>
                       </div>
                     ))}
                  </div>
                </div>
              </div>
           </div>
        </div>
      )}

      {/* AI BRAIN SCRIPT/AUDIO MODAL (Từ Bộ Não AI) */}
      {showAILibraryModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
           <div className="bg-[#121216] border border-white/10 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
              <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#0B0E14]">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/50">
                     <Brain className="w-4 h-4 text-blue-400" />
                   </div>
                   <div>
                     <h3 className="text-sm font-black text-white">Lựa chọn Kịch Bản từ Não Bộ AI</h3>
                     <p className="text-[10px] text-gray-400">Chọn kịch bản / audio đã được Gen bằng ChatGPT, Claude hoặc Gemini</p>
                   </div>
                 </div>
                 <button onClick={() => setShowAILibraryModal(false)} className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-lg">Đóng</button>
              </div>
              
              <div className="p-4 flex gap-2">
                 <div className="flex-1 relative">
                    <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="text" placeholder="Tìm kiếm kịch bản, âm thanh đã tạo..." className="w-full bg-black/60 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:border-[#00FF66] outline-none" />
                 </div>
                 <select className="bg-black/60 border border-white/10 rounded-lg px-4 py-2 text-sm text-gray-300 outline-none">
                    <option>Mới nhất</option>
                    <option>Kịch bản Bán hàng</option>
                    <option>Kịch bản Tin tức</option>
                 </select>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                 {[
                   { id: 1, name: 'Kịch bản khai trương cửa hàng', type: 'audio', duration: '01:20', ai: 'ChatGPT 4o', time: '10 phút trước' },
                   { id: 2, name: 'Bản tin Crypto cập nhật tối', type: 'text', chars: '1200 từ', ai: 'Claude 3.5 Sonnet', time: '1 giờ trước' },
                   { id: 3, name: 'Review Son môi Mac 2026', type: 'audio', duration: '00:45', ai: 'Gemini 1.5 Pro', time: 'Hôm qua' },
                   { id: 4, name: 'Livestream kể chuyện ma', type: 'text', chars: '4500 từ', ai: 'ChatGPT 4o', time: '2 ngày trước' },
                 ].map(item => (
                   <div 
                     key={item.id} 
                     onClick={() => {
                        setSelectedAILibraryInfo(`${item.name} (${item.type === 'audio' ? 'File Âm thanh AI' : 'Kịch bản Chữ'})`);
                        setSelectedAudioFile(null); // Clear local file if any
                        setShowAILibraryModal(false);
                     }}
                     className="flex items-center p-4 bg-black/40 border border-white/5 rounded-xl hover:bg-white/5 hover:border-[#00FF66]/50 cursor-pointer transition-all group"
                   >
                     <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${item.type === 'audio' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                        {item.type === 'audio' ? <FileAudio className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                     </div>
                     <div className="flex-1">
                        <h4 className="font-bold text-white text-sm group-hover:text-[#00FF66] transition-colors">{item.name}</h4>
                        <div className="flex items-center gap-3 mt-1 text-[11px] text-gray-400">
                           <span className="flex items-center gap-1"><Brain className="w-3 h-3" /> {item.ai}</span>
                           <span>•</span>
                           <span>{item.type === 'audio' ? item.duration : item.chars}</span>
                           <span>•</span>
                           <span>{item.time}</span>
                        </div>
                     </div>
                     <button className="px-4 py-1.5 bg-[#00FF66]/10 text-[#00FF66] rounded text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">Chọn</button>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
