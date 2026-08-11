import React, { useState } from 'react';
import { Settings, Clock, Mic, UserSquare2, Image as ImageIcon, Play, Upload, Check, Zap, Lock, Brain, Sparkles, FileText, ChevronDown } from 'lucide-react';

const MOCK_HISTORY = {
  voice: [
    { id: 'V-001', name: 'Giọng đọc quảng cáo', status: 'completed', time: '10 phút trước' },
    { id: 'V-002', name: 'Kịch bản khai trương', status: 'completed', time: '1 giờ trước' }
  ],
  lipsync: [
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
  const [activeTab, setActiveTab] = useState(defaultTab); // 'voice', 'lipsync', 'image-video'
  const [rightTab, setRightTab] = useState('settings'); // 'settings', 'history'
  const [speed, setSpeed] = useState(1.0);
  const [aiBrain, setAiBrain] = useState('chatgpt');
  const [aiModel, setAiModel] = useState(AI_BRAINS['chatgpt'].models[0]);
  
  const [voiceProvider, setVoiceProvider] = useState('vbee');
  const [selectedVoice, setSelectedVoice] = useState('vbee_f_n_1');
  const [lipsyncModel, setLipsyncModel] = useState('synclabs');

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
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 pb-24">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
         <div>
            <h1 className="text-4xl lg:text-5xl font-black text-slate-800 mb-3 tracking-tight">Workspace Tác vụ</h1>
            <p className="text-sm text-slate-500 font-medium max-w-2xl">
              Tạo ảnh, kịch bản, giọng nói và nhép miệng với sức mạnh của các model AI hàng đầu.
            </p>
         </div>
         <button className="px-5 py-2.5 bg-white border border-slate-200 hover:border-blue-500 text-blue-600 rounded-xl font-bold shadow-sm transition-colors text-sm whitespace-nowrap">
            Quản lý AIDOL
         </button>
      </div>

      {/* Main Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-4 mb-2">
         <button 
           onClick={() => setActiveTab('voice')}
           className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'voice' ? 'bg-blue-500 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
         >
           Kịch bản & Giọng nói
         </button>
         <button 
           onClick={() => setActiveTab('lipsync')}
           className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'lipsync' ? 'bg-blue-500 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
         >
           Tạo video nhép miệng
         </button>
         <button 
           onClick={() => setActiveTab('image-video')}
           className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'image-video' ? 'bg-blue-500 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
         >
           Tạo ảnh & Video
         </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
         {/* LEFT PANEL - CONTENT */}
         <div className="flex-[1.5] bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col min-h-[600px]">
            
            {activeTab === 'voice' && (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-black text-slate-800 mb-1">Bộ não AI & Soạn nội dung</h2>
                  <p className="text-xs text-slate-500 font-medium">Viết kịch bản bằng AI hoặc dán nội dung của bạn vào.</p>
                </div>

                {/* AI Brain Selection */}
                <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                   <label className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-3">
                     <Brain className="w-4 h-4 text-blue-500" /> Chọn Bộ Não Kịch Bản
                   </label>
                   <div className="grid grid-cols-3 gap-2 mb-3">
                      {Object.keys(AI_BRAINS).map(brainKey => (
                         <button 
                           key={brainKey}
                           onClick={() => {
                             setAiBrain(brainKey);
                             setAiModel(AI_BRAINS[brainKey].models[0]);
                           }} 
                           className={`p-3 rounded-lg border text-xs font-bold transition-all ${aiBrain === brainKey ? 'bg-white border-blue-500 text-blue-600 shadow-sm' : 'border-slate-200 text-slate-500 hover:bg-white'}`}
                         >
                           {AI_BRAINS[brainKey].name}
                         </button>
                      ))}
                   </div>
                   
                   {/* Model Selection */}
                   <div className="mb-4">
                     <select 
                       value={aiModel} 
                       onChange={(e) => setAiModel(e.target.value)}
                       className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 outline-none shadow-sm focus:border-blue-500"
                     >
                        {AI_BRAINS[aiBrain].models.map(m => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                     </select>
                   </div>

                   <div className="flex gap-2">
                     <input type="text" placeholder={`Nhập chủ đề để ${AI_BRAINS[aiBrain].name} tự động viết kịch bản...`} className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500" />
                     <button className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-blue-200">
                       <Sparkles className="w-4 h-4"/> Tạo kịch bản
                     </button>
                   </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-xs font-bold text-slate-800 mb-2">Tên job</label>
                  <input type="text" defaultValue="Kịch bản & Giọng nói" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 focus:border-blue-500 outline-none shadow-sm" />
                </div>

                <div className="flex-1 flex flex-col mb-6">
                  <label className="block text-xs font-bold text-slate-800 mb-2">Nội dung (Text to Speech)</label>
                  <textarea 
                    placeholder="Dán nội dung tiếng Việt có dấu hoặc không dấu..." 
                    className="w-full flex-1 min-h-[200px] p-4 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:border-blue-500 outline-none shadow-sm resize-none"
                  ></textarea>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between mt-auto">
                   <div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Chi phí dự kiến</div>
                      <div className="text-xl font-black text-blue-600">0 KOL Coin</div>
                      <div className="text-[10px] text-slate-500 mt-1">Giá giọng đang chọn: Phụ thuộc vào nền tảng API.</div>
                   </div>
                   <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold transition-colors shadow-md">
                     Tạo giọng nói
                   </button>
                </div>
              </>
            )}

            {activeTab === 'lipsync' && (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-black text-slate-800 mb-1">Nhép miệng AI</h2>
                  <p className="text-xs text-slate-500 font-medium">Chọn video DONE hoặc upload video đầu vào rồi ghép với giọng đã chọn.</p>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-[10px] font-black text-blue-500 uppercase tracking-widest">MODEL NHÉP MIỆNG</label>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     {LIPSYNC_MODELS.map(model => (
                       <div 
                         key={model.id}
                         onClick={() => setLipsyncModel(model.id)}
                         className={`border-2 rounded-xl p-4 relative cursor-pointer transition-all ${lipsyncModel === model.id ? 'bg-blue-50 border-blue-500 shadow-sm' : 'bg-white border-slate-200 hover:border-blue-300'}`}
                       >
                          {lipsyncModel === model.id && <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white"><Check className="w-3 h-3" /></div>}
                          <h4 className={`font-bold text-sm mb-1 ${lipsyncModel === model.id ? 'text-blue-700' : 'text-slate-800'}`}>{model.name}</h4>
                          <p className="text-[10px] text-slate-500 font-medium">{model.desc}</p>
                       </div>
                     ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-xs font-bold text-slate-800 mb-2">Tên job</label>
                  <input type="text" defaultValue="KOL LIVE lipsync" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 focus:border-blue-500 outline-none shadow-sm" />
                </div>

                <div className="flex-1 flex flex-col mb-6">
                  <label className="block text-xs font-bold text-slate-800 mb-2">Lời thoại</label>
                  <textarea 
                    placeholder="Nhập lời thoại để nhép môi hoặc dùng kịch bản đã tạo sẵn." 
                    className="w-full flex-1 min-h-[150px] p-4 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:border-blue-500 outline-none shadow-sm resize-none"
                  ></textarea>
                </div>

                <div className="border-t border-slate-100 pt-4 mt-auto">
                   <h4 className="text-xs font-bold text-slate-800 mb-1">Quyền riêng tư</h4>
                   <p className="text-[10px] text-slate-500">Mặc định: Video nhép môi của bạn là riêng tư và chỉ hiện trong thư viện của bạn.</p>
                   <div className="text-right mt-4">
                     <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold transition-colors shadow-md">
                       Tạo video nhép miệng
                     </button>
                   </div>
                </div>
              </>
            )}

            {activeTab === 'image-video' && (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                 <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 mb-4 shadow-sm border border-blue-100">
                   <ImageIcon className="w-8 h-8" />
                 </div>
                 <h2 className="text-xl font-black text-slate-800 mb-2">Công cụ Tạo Ảnh & Video</h2>
                 <p className="text-sm text-slate-500 max-w-md">Khu vực Flow canvas đang được nâng cấp để tích hợp các model tạo hình mới nhất. Lịch sử tạo vẫn được ghi nhận ở Tab bên phải.</p>
              </div>
            )}
         </div>

         {/* RIGHT PANEL */}
         <div className="w-full lg:w-[400px]">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm min-h-[600px] flex flex-col">
               
               {/* Right Panel Tabs */}
               <div className="flex bg-slate-50 rounded-lg border border-slate-200 p-1 mb-6">
                  <button onClick={() => setRightTab('settings')} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded font-bold text-xs shadow-sm transition-colors ${rightTab === 'settings' ? 'bg-white text-blue-600' : 'text-slate-500 hover:bg-slate-100'}`}>
                    <Settings className="w-4 h-4"/> Cài đặt
                  </button>
                  <button onClick={() => setRightTab('history')} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded font-bold text-xs transition-colors ${rightTab === 'history' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}>
                    <Clock className="w-4 h-4"/> Lịch sử <span className="bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full text-[9px]">{MOCK_HISTORY[activeTab]?.length || 0}</span>
                  </button>
               </div>

               {/* SETTINGS VIEW */}
               {rightTab === 'settings' && (
                 <>
                   {activeTab === 'voice' && (
                     <>
                       <div className="mb-6">
                         <h3 className="font-black text-slate-800 text-lg mb-1">Cấu hình API Giọng</h3>
                         <p className="text-[11px] text-slate-500 font-medium leading-relaxed">Chọn các nền tảng TTS: ElevenLabs, VBee, Gemini, và các model API miễn phí.</p>
                       </div>

                       <div className="space-y-6">
                         <div>
                           <label className="block text-[11px] font-bold text-slate-800 mb-2">Nền tảng API</label>
                           <select 
                             value={voiceProvider}
                             onChange={(e) => setVoiceProvider(e.target.value)}
                             className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none shadow-sm focus:border-blue-500"
                           >
                             <option value="vbee">VBee (Việt Nam)</option>
                             <option value="elevenlabs">ElevenLabs (Cao cấp)</option>
                             <option value="gemini">Google Gemini Voice</option>
                             <option value="free">Miễn phí / API Rẻ</option>
                           </select>
                         </div>

                         <div>
                           <label className="block text-[11px] font-bold text-slate-800 mb-2">Chọn Giọng đọc ({VOICES[voiceProvider].reduce((acc, g) => acc + g.options.length, 0)} giọng)</label>
                           <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                             {VOICES[voiceProvider].map((group, idx) => (
                               <div key={idx} className="mb-3 last:mb-0">
                                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-2">{group.group}</div>
                                  <div className="space-y-1">
                                    {group.options.map(voice => (
                                      <button 
                                        key={voice.id} 
                                        onClick={() => setSelectedVoice(voice.id)}
                                        className={`w-full text-left px-3 py-2 rounded-md text-[11px] font-bold transition-colors flex justify-between items-center ${selectedVoice === voice.id ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-200'}`}
                                      >
                                        <span>{voice.name}</span>
                                        {selectedVoice === voice.id && <Check className="w-3 h-3" />}
                                      </button>
                                    ))}
                                  </div>
                               </div>
                             ))}
                           </div>
                           <button className="w-full mt-2 py-2 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg font-bold text-xs shadow-sm hover:bg-blue-100 transition-colors">
                              Nghe thử giọng đang chọn
                           </button>
                         </div>

                         <div>
                           <label className="block text-[11px] font-bold text-slate-800 mb-2">Tốc độ: {speed.toFixed(2)}</label>
                           <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                              <input 
                                type="range" min="0.5" max="2.0" step="0.1" value={speed} 
                                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                                className="w-full accent-slate-800 mb-2 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" 
                              />
                              <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                                <span>Chậm hơn</span>
                                <span>Nhanh hơn</span>
                              </div>
                           </div>
                         </div>
                       </div>
                     </>
                   )}

                   {activeTab === 'lipsync' && (
                     <>
                       <div className="mb-6">
                         <h3 className="font-black text-slate-800 text-lg mb-1">Cấu hình đầu vào</h3>
                         <p className="text-[11px] text-slate-500 font-medium leading-relaxed">Chọn video đã DONE, hoặc upload video mới, rồi chọn giọng KOL Coin.</p>
                       </div>

                       <div className="space-y-6">
                         <div>
                           <label className="block text-[11px] font-bold text-slate-800 mb-2">Video đã DONE</label>
                           <select className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none shadow-sm appearance-none">
                             <option>Upload video mới hoặc chọn video DONE</option>
                           </select>
                         </div>

                         <div>
                           <label className="block text-[11px] font-bold text-slate-800 mb-2">Hoặc upload video đầu vào</label>
                           <div className="flex border border-slate-200 rounded-lg overflow-hidden shadow-sm bg-white">
                             <button className="px-4 py-2.5 bg-slate-100 border-r border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-200">Chọn tệp</button>
                             <div className="px-4 py-2.5 text-xs text-slate-500 font-medium flex-1 flex items-center">Không có tệp nào được chọn</div>
                           </div>
                         </div>
                       </div>
                     </>
                   )}
                   
                   {activeTab === 'image-video' && (
                     <div className="flex-1 flex items-center justify-center">
                       <p className="text-sm text-slate-400 text-center">Cài đặt Flow canvas</p>
                     </div>
                   )}
                 </>
               )}

               {/* HISTORY VIEW */}
               {rightTab === 'history' && (
                 <div className="flex flex-col h-full">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="font-black text-slate-800 text-sm">Lịch sử tác vụ</h3>
                      <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold">
                        {activeTab === 'voice' ? 'Giọng & Kịch bản' : activeTab === 'lipsync' ? 'Nhép môi' : 'Ảnh & Video'}
                      </span>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
                       {MOCK_HISTORY[activeTab]?.map(job => (
                          <div key={job.id} className="p-3 border border-slate-200 rounded-xl hover:border-blue-300 transition-colors bg-slate-50">
                             <div className="flex justify-between items-start mb-2">
                                <div className="font-bold text-slate-700 text-xs truncate mr-2">{job.name}</div>
                                {job.status === 'completed' && <Check className="w-3 h-3 text-emerald-500 flex-shrink-0" />}
                                {job.status === 'processing' && <Clock className="w-3 h-3 text-blue-500 flex-shrink-0" />}
                             </div>
                             <div className="flex justify-between items-center text-[10px]">
                                <span className="text-slate-400 font-medium">{job.time}</span>
                                <span className={`font-bold ${job.status === 'completed' ? 'text-emerald-600' : 'text-blue-600'}`}>
                                   {job.status === 'completed' ? 'Hoàn thành' : 'Đang xử lý'}
                                </span>
                             </div>
                          </div>
                       ))}
                       {(!MOCK_HISTORY[activeTab] || MOCK_HISTORY[activeTab].length === 0) && (
                          <div className="text-center p-8 text-slate-400 text-xs">Không có lịch sử nào.</div>
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
