import React, { useState } from 'react';
import { Settings, Clock, Mic, UserSquare2, Image as ImageIcon, Play, Upload, Check, Zap, Lock, Brain, Sparkles, FileText, ChevronDown, Monitor, Video } from 'lucide-react';

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
               {defaultTab === 'lipsync' && 'Nhép Môi & Truyền Live'}
               {defaultTab === 'image-video' && 'Tạo Video Bằng AIDOL'}
            </h1>
            <p className="text-sm text-gray-400 font-medium max-w-2xl">
               {defaultTab === 'voice' && 'Tạo kịch bản với bộ não AI và chuyển đổi thành giọng nói mượt mà.'}
               {defaultTab === 'lipsync' && 'Chọn video, ghép giọng và truyền thẳng sang nền tảng Live.'}
               {defaultTab === 'image-video' && 'Xử lý video chuyên nghiệp với các AI model hàng đầu.'}
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
                    <h2 className="text-xl font-black text-white mb-1">Nhép miệng AI & Phát Live</h2>
                    <p className="text-xs text-gray-400 font-medium">Chọn video, ghép giọng và có thể truyền thẳng sang TikTok Live Studio / OBS.</p>
                  </div>
                  <button 
                    onClick={() => setShowBroadcastModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-400 border border-purple-500/50 rounded-lg text-xs font-bold hover:bg-purple-500/30 transition-all shadow-glow-purple animate-pulse"
                  >
                    <Monitor className="w-4 h-4" /> Truyền Live Studio
                  </button>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-[10px] font-black text-[#00FF66] uppercase tracking-widest">MODEL NHÉP MIỆNG</label>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     {LIPSYNC_MODELS.map(model => (
                       <div 
                         key={model.id}
                         onClick={() => setLipsyncModel(model.id)}
                         className={`border border-white/10 rounded-xl p-4 relative cursor-pointer transition-all ${lipsyncModel === model.id ? 'bg-[#00FF66]/10 border-[#00FF66]/50 shadow-glow-green' : 'bg-black/40 hover:border-white/20'}`}
                       >
                          {lipsyncModel === model.id && <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-[#00FF66] flex items-center justify-center text-black"><Check className="w-3 h-3" /></div>}
                          <h4 className={`font-bold text-sm mb-1 ${lipsyncModel === model.id ? 'text-[#00FF66]' : 'text-gray-200'}`}>{model.name}</h4>
                          <p className="text-[10px] text-gray-400 font-medium">{model.desc}</p>
                       </div>
                     ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-xs font-bold text-gray-300 mb-2">Tên job</label>
                  <input type="text" defaultValue="KOL LIVE lipsync" className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-sm font-bold text-white focus:border-[#00FF66] outline-none" />
                </div>

                <div className="flex-1 flex flex-col mb-6">
                  <label className="block text-xs font-bold text-gray-300 mb-2">Lời thoại</label>
                  <textarea 
                    placeholder="Nhập lời thoại để nhép môi hoặc dùng kịch bản đã tạo sẵn." 
                    className="w-full flex-1 min-h-[150px] p-4 bg-black/40 border border-white/10 rounded-lg text-sm text-gray-300 focus:border-[#00FF66] outline-none resize-none custom-scrollbar"
                  ></textarea>
                </div>

                <div className="border-t border-white/10 pt-4 mt-auto flex justify-between items-end">
                   <div>
                     <h4 className="text-xs font-bold text-gray-300 mb-1">Quyền riêng tư</h4>
                     <p className="text-[10px] text-gray-500">Video nhép môi của bạn là riêng tư và chỉ hiện trong thư viện của bạn.</p>
                   </div>
                   <button className="px-6 py-3 bg-[#00FF66] hover:bg-[#00CC52] text-black rounded-xl font-black transition-colors shadow-glow-green">
                     Tạo video nhép miệng
                   </button>
                </div>
              </div>
            )}

            {defaultTab === 'image-video' && (
              <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10">
                 <div className="w-16 h-16 rounded-full bg-[#00FF66]/10 border border-[#00FF66]/30 flex items-center justify-center text-[#00FF66] mb-4 shadow-glow-green">
                   <ImageIcon className="w-8 h-8" />
                 </div>
                 <h2 className="text-xl font-black text-white mb-2">Công cụ Tạo Ảnh & Video</h2>
                 <p className="text-sm text-gray-400 max-w-md">Khu vực Flow canvas đang được nâng cấp để tích hợp các model tạo hình mới nhất. Lịch sử tạo vẫn được ghi nhận ở Tab bên phải.</p>
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
                         <h3 className="font-black text-white text-lg mb-1">Cấu hình đầu vào</h3>
                         <p className="text-[11px] text-gray-400 font-medium leading-relaxed">Chọn video đã DONE, hoặc upload video mới, rồi chọn giọng KOL Coin.</p>
                       </div>

                       <div className="space-y-6">
                         <div>
                           <label className="block text-[11px] font-bold text-gray-300 mb-2">Video đã DONE</label>
                           <select className="w-full px-4 py-2.5 bg-black/60 border border-white/10 rounded-lg text-sm font-bold text-gray-200 outline-none focus:border-[#00FF66]">
                             <option>Upload video mới hoặc chọn video DONE</option>
                           </select>
                         </div>

                         <div>
                           <label className="block text-[11px] font-bold text-gray-300 mb-2">Hoặc upload video đầu vào</label>
                           <div className="flex border border-white/10 rounded-lg overflow-hidden bg-black/40 focus-within:border-[#00FF66]">
                             <button className="px-4 py-2.5 bg-white/5 border-r border-white/10 text-xs font-bold text-gray-300 hover:bg-white/10">Chọn tệp</button>
                             <div className="px-4 py-2.5 text-xs text-gray-500 font-medium flex-1 flex items-center">Không có tệp nào được chọn</div>
                           </div>
                         </div>
                       </div>
                     </>
                   )}
                   
                   {defaultTab === 'image-video' && (
                     <div className="flex-1 flex items-center justify-center">
                       <p className="text-sm text-gray-500 text-center">Cài đặt Flow canvas</p>
                     </div>
                   )}
                 </div>
               )}

               {/* HISTORY VIEW */}
               {rightTab === 'history' && (
                 <div className="flex flex-col h-full relative z-10">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="font-black text-white text-sm">Lịch sử tác vụ</h3>
                      <span className="text-[10px] bg-white/10 text-gray-300 px-2 py-0.5 rounded font-bold border border-white/5">
                        {defaultTab === 'voice' ? 'Giọng & Kịch bản' : defaultTab === 'lipsync' ? 'Nhép môi' : 'Ảnh & Video'}
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
      )}
    </div>
  );
}
