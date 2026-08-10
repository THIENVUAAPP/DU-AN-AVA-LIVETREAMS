import React, { useState, useEffect } from 'react';
import { 
  Bot, Settings, Activity, BrainCircuit, ListTree, 
  MessageSquare, Mic, MonitorPlay, Users, 
  Play, Square, ChevronRight, Wand2, Plus, 
  Save, Sliders, Volume2, Sparkles, AlertCircle, Clock
} from 'lucide-react';

export default function AIStorytellerDashboard() {
  const [activeTab, setActiveTab] = useState('character');
  const [isRunning, setIsRunning] = useState(false);
  const [currentState, setCurrentState] = useState('IDLE');
  const [topic, setTopic] = useState('Kể chuyện ma dân gian');
  
  // Mock Comments
  const [comments, setComments] = useState([]);
  
  useEffect(() => {
    if (isRunning) {
      setCurrentState('STORYTELLING');
      const interval = setInterval(() => {
        const mockComments = [
          { id: 1, user: 'Hoang123', text: 'Chuyện có thật không chị?', intent: 'QUESTION', priority: 6, time: new Date() },
          { id: 2, user: 'LinhXinh', text: 'Sợ quá', intent: 'REACTION', priority: 3, time: new Date() },
          { id: 3, user: 'AnhTu', text: 'Kể tiếp đi chị ơi', intent: 'CONTINUE', priority: 8, time: new Date() },
        ];
        
        const randomComment = mockComments[Math.floor(Math.random() * mockComments.length)];
        randomComment.id = Date.now();
        randomComment.time = new Date();
        
        setComments(prev => [...prev.slice(-10), randomComment]);
        
        if (randomComment.intent === 'QUESTION' || randomComment.intent === 'CONTINUE') {
          setCurrentState('THINKING');
          setTimeout(() => setCurrentState('RESPONDING'), 1000);
          setTimeout(() => setCurrentState('STORYTELLING'), 4000);
        }
      }, 5000);
      return () => clearInterval(interval);
    } else {
      setCurrentState('IDLE');
    }
  }, [isRunning]);

  return (
    <div className="animate-fade-in text-left space-y-6 w-full max-w-7xl mx-auto h-full pb-20 flex flex-col">
      {/* Header Section */}
      <div className="flex justify-between items-end mb-2 shrink-0">
        <div>
          <h2 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-glow-purple">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            AI Livestream Character Engine
          </h2>
          <p className="text-gray-400 text-sm max-w-2xl">
            Hệ thống AI đa năng tự động lên kịch bản, tự kể chuyện, đọc và phản hồi bình luận theo cảm xúc thời gian thực (Real-time).
          </p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => setIsRunning(!isRunning)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-all shadow-lg ${
              isRunning 
              ? 'bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30' 
              : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-105'
            }`}
          >
            {isRunning ? <Square className="w-4 h-4 fill-current"/> : <Play className="w-4 h-4 fill-current"/>}
            {isRunning ? 'DỪNG ENGINE' : 'KHỞI ĐỘNG AI BRAIN'}
          </button>
        </div>
      </div>

      {/* Internal Navigation Tabs */}
      <div className="flex items-center gap-2 bg-[#141419] p-1.5 rounded-2xl border border-white/5 shrink-0">
        {[
          { id: 'character', icon: <Bot className="w-4 h-4" />, label: 'Nhân Vật & AI' },
          { id: 'topic', icon: <ListTree className="w-4 h-4" />, label: 'Cấu Trúc Kịch Bản' },
          { id: 'live', icon: <MonitorPlay className="w-4 h-4" />, label: 'Giám Sát Livestream' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab.id 
                ? 'bg-[#1A1A24] text-purple-400 border border-white/10 shadow-lg' 
                : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        
        {/* CHARACTER TAB */}
        {activeTab === 'character' && (
          <div className="h-full overflow-y-auto custom-scrollbar space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Col: Basic Info */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-[#141419] border border-white/5 rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
                  <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-400" /> Hồ Sơ Nhân Vật
                  </h3>
                  
                  <div className="flex justify-center mb-6">
                    <div className="relative group cursor-pointer">
                      <div className="w-32 h-32 rounded-full border-2 border-dashed border-white/20 flex flex-col items-center justify-center text-gray-500 bg-[#0A0A0A] overflow-hidden group-hover:border-purple-500 transition-colors">
                         <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200" alt="Avatar" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                         <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-xs font-bold text-white">Thay ảnh</span>
                         </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-gray-400 font-bold mb-1.5 block">Tên Nhân Vật</label>
                      <input type="text" defaultValue="Lana" className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-400 font-bold mb-1.5 block">Giới Tính</label>
                        <select className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-purple-500 focus:outline-none">
                          <option>Nữ</option>
                          <option>Nam</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 font-bold mb-1.5 block">Độ Tuổi</label>
                        <input type="number" defaultValue="25" className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-purple-500 focus:outline-none" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#141419] border border-white/5 rounded-2xl p-6">
                   <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                    <Mic className="w-4 h-4 text-emerald-400" /> Cấu Hình Giọng Nói (TTS)
                  </h3>
                  <div className="space-y-4">
                     <div>
                        <label className="text-xs text-gray-400 font-bold mb-1.5 block">Model Giọng Nói</label>
                        <select className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-purple-500 focus:outline-none">
                          <option>Việt Nam - Nữ (Miền Nam) - Truyền cảm</option>
                          <option>Việt Nam - Nữ (Miền Bắc) - Chuẩn</option>
                        </select>
                     </div>
                     <div>
                        <div className="flex justify-between items-end mb-1.5">
                           <label className="text-xs text-gray-400 font-bold block">Tốc Độ Đọc (WPM)</label>
                           <span className="text-xs text-emerald-400 font-bold">145 WPM (Vừa phải)</span>
                        </div>
                        <input type="range" min="110" max="180" defaultValue="145" className="w-full accent-emerald-500" />
                        <div className="flex justify-between text-[10px] text-gray-600 mt-1 font-mono">
                           <span>110 (Chậm)</span>
                           <span>180 (Nhanh)</span>
                        </div>
                     </div>
                     <button className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 transition-colors">
                        <Volume2 className="w-4 h-4" /> Nghe Thử Giọng
                     </button>
                  </div>
                </div>
              </div>

              {/* Right Col: Personality & Behavior */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-[#141419] border border-white/5 rounded-2xl p-6">
                  <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" /> AI Personality Engine
                  </h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2">
                       <label className="text-xs text-gray-400 font-bold mb-1.5 block">Định Hình Tính Cách (System Prompt Base)</label>
                       <textarea rows="3" defaultValue="Bạn là Lana, một người kể chuyện duyên dáng, bí ẩn và có chút hài hước. Bạn luôn tương tác gần gũi với người xem, gọi họ là 'các bạn' hoặc 'anh chị em'." className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-purple-500 focus:outline-none custom-scrollbar leading-relaxed"></textarea>
                    </div>

                    <div className="space-y-6">
                       <div>
                          <div className="flex justify-between mb-1.5 text-xs font-bold">
                             <span className="text-gray-400">Mức Độ Hài Hước</span>
                             <span className="text-amber-400">70%</span>
                          </div>
                          <div className="h-2 w-full bg-[#0A0A0A] rounded-full overflow-hidden border border-white/5"><div className="h-full bg-amber-500 w-[70%] rounded-full"></div></div>
                       </div>
                       <div>
                          <div className="flex justify-between mb-1.5 text-xs font-bold">
                             <span className="text-gray-400">Độ Căng Thẳng (Kể chuyện ma/trinh thám)</span>
                             <span className="text-purple-400">85%</span>
                          </div>
                          <div className="h-2 w-full bg-[#0A0A0A] rounded-full overflow-hidden border border-white/5"><div className="h-full bg-purple-500 w-[85%] rounded-full"></div></div>
                       </div>
                    </div>

                    <div className="space-y-6">
                       <div>
                          <div className="flex justify-between mb-1.5 text-xs font-bold">
                             <span className="text-gray-400">Mức Độ Bán Hàng (Sale Focus)</span>
                             <span className="text-emerald-400">30%</span>
                          </div>
                          <div className="h-2 w-full bg-[#0A0A0A] rounded-full overflow-hidden border border-white/5"><div className="h-full bg-emerald-500 w-[30%] rounded-full"></div></div>
                       </div>
                       <div>
                          <div className="flex justify-between mb-1.5 text-xs font-bold">
                             <span className="text-gray-400">Mức Độ Tương Tác Comment</span>
                             <span className="text-cyan-400">90%</span>
                          </div>
                          <div className="h-2 w-full bg-[#0A0A0A] rounded-full overflow-hidden border border-white/5"><div className="h-full bg-cyan-500 w-[90%] rounded-full"></div></div>
                       </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#141419] border border-white/5 rounded-2xl p-6">
                  <div className="flex justify-between items-center mb-6">
                     <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-pink-400" /> Tùy Chỉnh Kịch Bản Tương Tác
                     </h3>
                     <button className="text-xs text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1">
                        Thêm Kịch Bản <Plus className="w-3 h-3" />
                     </button>
                  </div>
                  
                  <div className="space-y-3">
                     {[
                        { title: 'Call To Action (Chốt Sale)', desc: 'Thỉnh thoảng nhắc nhở mua hàng ở góc màn hình' },
                        { title: 'Tương tác quà tặng (Gifts)', desc: 'Cảm ơn khi có người tặng quà trên TikTok/Facebook' },
                        { title: 'Nhắc nhở thả tim', desc: 'Khi lượt tương tác giảm, kêu gọi người xem tap màn hình' },
                     ].map((item, i) => (
                        <div key={i} className="flex items-start gap-4 p-3 bg-[#0A0A0A] border border-white/5 rounded-xl">
                           <input type="checkbox" defaultChecked className="mt-1 rounded bg-white/5 border-white/10 text-purple-500 focus:ring-purple-500/50" />
                           <div>
                              <p className="text-sm font-bold text-white mb-0.5">{item.title}</p>
                              <p className="text-xs text-gray-500">{item.desc}</p>
                           </div>
                        </div>
                     ))}
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                   <button className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-xl transition-colors flex items-center gap-2">
                      <Save className="w-4 h-4" /> LƯU NHÂN VẬT
                   </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TOPIC TAB */}
        {activeTab === 'topic' && (
          <div className="h-full flex flex-col">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
               
               {/* Left: Input Topic */}
               <div className="lg:col-span-1 space-y-6 flex flex-col h-full">
                  <div className="bg-[#141419] border border-white/5 rounded-2xl p-6">
                     <h3 className="text-sm font-bold text-white mb-4">Master Topic Input</h3>
                     <div className="space-y-4">
                        <textarea 
                           rows="3" 
                           value={topic}
                           onChange={(e) => setTopic(e.target.value)}
                           className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-purple-500 focus:outline-none resize-none"
                           placeholder="Nhập chủ đề lớn. VD: Kể chuyện ma, Review sách..."
                        ></textarea>
                        
                        <div className="grid grid-cols-2 gap-3">
                           <div>
                              <label className="text-[10px] text-gray-500 font-bold block mb-1 uppercase">Thời Lượng (Tập)</label>
                              <select className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-2 py-1.5 text-gray-300 text-xs">
                                 <option>5 Phút</option>
                                 <option>10 Phút</option>
                                 <option>15 Phút</option>
                              </select>
                           </div>
                           <div>
                              <label className="text-[10px] text-gray-500 font-bold block mb-1 uppercase">Số lượng Subtopics</label>
                              <input type="number" defaultValue="10" className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-2 py-1.5 text-gray-300 text-xs" />
                           </div>
                        </div>

                        <button className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 rounded-xl text-xs font-black text-white shadow-glow-purple flex items-center justify-center gap-2 transition-all hover:scale-[1.02]">
                           <Wand2 className="w-4 h-4" /> TẠO TOPIC TREE
                        </button>
                     </div>
                  </div>

                  <div className="bg-[#141419] border border-white/5 rounded-2xl p-6 flex-1">
                     <h3 className="text-sm font-bold text-white mb-4">Topic Intelligence Analysis</h3>
                     <div className="space-y-4">
                        <div className="p-3 bg-[#0A0A0A] rounded-xl border border-white/5">
                           <span className="text-[10px] text-gray-500 uppercase font-bold">Danh Mục Phân Tích</span>
                           <p className="text-sm font-medium text-white mt-1">Horror Storytelling</p>
                        </div>
                        <div className="p-3 bg-[#0A0A0A] rounded-xl border border-white/5">
                           <span className="text-[10px] text-gray-500 uppercase font-bold">Khán giả Mục Tiêu (Intent)</span>
                           <p className="text-sm font-medium text-emerald-400 mt-1">Giải trí, Kích thích, Tò mò</p>
                        </div>
                        <div className="p-3 bg-[#0A0A0A] rounded-xl border border-white/5">
                           <span className="text-[10px] text-gray-500 uppercase font-bold">Đánh giá Content Deduplication</span>
                           <div className="flex items-center gap-2 mt-1">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981]"></span>
                              <p className="text-xs font-medium text-gray-300">Nội dung 100% Unique</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Right: Topic Tree UI */}
               <div className="lg:col-span-3 bg-[#141419] border border-white/5 rounded-2xl p-6 flex flex-col h-full overflow-hidden relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none"></div>
                  
                  <div className="flex justify-between items-center mb-6 shrink-0">
                     <h3 className="text-lg font-black text-white flex items-center gap-2">
                        <ListTree className="w-5 h-5 text-indigo-400" /> Cấu Trúc Topic Tree Generated
                     </h3>
                     <div className="text-xs text-gray-400">Tổng thời lượng ước tính: <span className="font-bold text-white">~50 phút</span></div>
                  </div>

                  <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
                     {/* Category 1 */}
                     <div className="bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden">
                        <div className="px-4 py-3 bg-white/5 border-b border-white/5 flex items-center justify-between">
                           <h4 className="text-sm font-bold text-white uppercase">C01 - MA DÂN GIAN</h4>
                           <span className="text-xs font-medium text-purple-400 bg-purple-500/10 px-2 py-1 rounded">5 Episodes</span>
                        </div>
                        <div className="p-4 space-y-3">
                           {[
                              { title: 'Ma Trơi Làng Cổ', words: 720, duration: '4m55s' },
                              { title: 'Người Chết Oan Đòi Mạng', words: 745, duration: '5m10s' },
                              { title: 'Tiếng Gọi Chó Sủa Đêm Khuya', words: 680, duration: '4m40s' },
                           ].map((ep, i) => (
                              <div key={i} className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-white/10">
                                 <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded bg-purple-500/20 text-purple-400 flex items-center justify-center text-[10px] font-bold">EP{i+1}</div>
                                    <span className="text-sm font-medium text-gray-200">{ep.title}</span>
                                 </div>
                                 <div className="flex items-center gap-4 text-xs font-mono text-gray-500">
                                    <span>{ep.words} Words</span>
                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {ep.duration}</span>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>

                     {/* Category 2 */}
                     <div className="bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden">
                        <div className="px-4 py-3 bg-white/5 border-b border-white/5 flex items-center justify-between">
                           <h4 className="text-sm font-bold text-white uppercase">C02 - TRUYỆN MA ĐÔ THỊ</h4>
                           <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">3 Episodes</span>
                        </div>
                        <div className="p-4 space-y-3">
                           {[
                              { title: 'Thang Máy Lúc 3 Giờ Sáng', words: 810, duration: '5m30s' },
                              { title: 'Căn Hộ Chung Cư Tầng 13', words: 750, duration: '5m00s' },
                           ].map((ep, i) => (
                              <div key={i} className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-white/10">
                                 <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold">EP{i+1}</div>
                                    <span className="text-sm font-medium text-gray-200">{ep.title}</span>
                                 </div>
                                 <div className="flex items-center gap-4 text-xs font-mono text-gray-500">
                                    <span>{ep.words} Words</span>
                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {ep.duration}</span>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* LIVE MONITOR TAB */}
        {activeTab === 'live' && (
          <div className="h-full flex flex-col gap-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 shrink-0">
               {/* Live Brain Stats */}
               <div className="bg-[#141419] border border-white/5 rounded-2xl p-5 flex items-center justify-between">
                  <div>
                     <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">State Machine Status</p>
                     <div className="flex items-center gap-2 text-xl font-black text-white">
                        <Activity className={`w-5 h-5 ${isRunning ? 'text-emerald-400 animate-pulse' : 'text-gray-600'}`} />
                        {currentState}
                     </div>
                  </div>
                  <div className={`px-3 py-1.5 rounded-full text-xs font-bold ${isRunning ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-gray-800 text-gray-400 border border-gray-700'}`}>
                     {isRunning ? 'ONLINE - ENGINE ACTIVE' : 'OFFLINE'}
                  </div>
               </div>

               <div className="bg-[#141419] border border-white/5 rounded-2xl p-5 flex items-center justify-between">
                  <div>
                     <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Current Episode</p>
                     <div className="text-lg font-bold text-white truncate max-w-[200px]">EP1: Ma Trơi Làng Cổ</div>
                  </div>
                  <div className="text-right">
                     <div className="text-xs font-mono text-emerald-400">02:15 / 04:55</div>
                     <div className="w-24 h-1 bg-white/10 rounded-full mt-1.5 overflow-hidden">
                        <div className="h-full bg-emerald-500 w-[45%]"></div>
                     </div>
                  </div>
               </div>

               <div className="bg-[#141419] border border-white/5 rounded-2xl p-5 flex items-center justify-between">
                  <div>
                     <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Comment Ingestion Rate</p>
                     <div className="text-xl font-black text-white">{isRunning ? '12.4' : '0'} <span className="text-xs text-gray-500 font-medium">msg/s</span></div>
                  </div>
                  <div className="h-8 w-16 bg-[#0A0A0A] rounded overflow-hidden flex items-end gap-0.5 p-1">
                     {[30, 50, 40, 80, 60, 90, 70].map((h, i) => (
                        <div key={i} className="w-full bg-purple-500 rounded-t-sm" style={{height: isRunning ? `${h}%` : '10%'}}></div>
                     ))}
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
               {/* Left: Comment Interactive Simulator */}
               <div className="lg:col-span-2 bg-[#141419] border border-white/5 rounded-2xl flex flex-col overflow-hidden">
                  <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between bg-black/20">
                     <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-cyan-400" /> Real-time Comment Engine
                     </h3>
                     <span className="text-xs text-gray-400">Memory Context: <span className="text-emerald-400 font-bold">Active</span></span>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar bg-[#0A0A0E] relative">
                     {!isRunning && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-10">
                           <div className="text-center">
                              <AlertCircle className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                              <p className="text-sm text-gray-400 font-medium">Bật AI Brain để xem giả lập bình luận</p>
                           </div>
                        </div>
                     )}
                     
                     {comments.map((cmd) => (
                        <div key={cmd.id} className="animate-fade-in flex gap-3">
                           <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-cyan-500 flex items-center justify-center text-[10px] font-black text-white shrink-0">
                              {cmd.user.charAt(0)}
                           </div>
                           <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                 <span className="text-xs font-bold text-gray-300">{cmd.user}</span>
                                 <span className="text-[9px] font-mono text-gray-600">{cmd.time.toLocaleTimeString()}</span>
                                 <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                                    cmd.intent === 'QUESTION' ? 'bg-amber-500/20 text-amber-400' :
                                    cmd.intent === 'CONTINUE' ? 'bg-purple-500/20 text-purple-400' :
                                    'bg-blue-500/20 text-blue-400'
                                 }`}>Intent: {cmd.intent}</span>
                                 {cmd.priority >= 7 && <span className="text-[9px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded font-bold">HIGH PRIORITY</span>}
                              </div>
                              <p className="text-sm text-white bg-white/5 inline-block px-3 py-2 rounded-lg rounded-tl-none">{cmd.text}</p>
                           </div>
                        </div>
                     ))}
                     
                     {currentState === 'RESPONDING' && (
                        <div className="animate-fade-in flex gap-3 mt-4 ml-8">
                           <div className="w-8 h-8 rounded-full border border-purple-500 bg-purple-500/20 flex items-center justify-center text-[10px] font-black text-purple-400 shrink-0">
                              AI
                           </div>
                           <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                 <span className="text-xs font-bold text-purple-400">AI Storyteller đang trả lời...</span>
                                 <Activity className="w-3 h-3 text-purple-400 animate-pulse" />
                              </div>
                              <div className="h-6 w-32 bg-white/5 rounded animate-pulse"></div>
                           </div>
                        </div>
                     )}
                  </div>
               </div>

               {/* Right: Avatar Stream Preview */}
               <div className="lg:col-span-1 bg-[#141419] border border-white/5 rounded-2xl flex flex-col overflow-hidden relative">
                  <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between bg-black/20 z-10 relative">
                     <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <MonitorPlay className="w-4 h-4 text-red-500" /> Livestream Output View
                     </h3>
                     <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  </div>
                  
                  <div className="flex-1 relative bg-[#050505] flex items-center justify-center overflow-hidden">
                     {/* Fake Video Feed */}
                     <img 
                        src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&h=800" 
                        alt="Avatar Stream"
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${!isRunning ? 'opacity-30 grayscale' : 'opacity-90'}`}
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                     
                     {!isRunning ? (
                        <div className="relative z-10 text-center">
                           <MonitorPlay className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                           <p className="text-sm font-bold text-gray-500">Stream Offline</p>
                        </div>
                     ) : (
                        <div className="absolute bottom-4 left-4 right-4 z-10">
                           <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-3">
                              <div className="flex items-center gap-2 mb-1">
                                 <Volume2 className="w-3 h-3 text-emerald-400 animate-pulse" />
                                 <span className="text-[10px] font-bold text-emerald-400">TTS Audio Output</span>
                              </div>
                              <p className="text-xs text-white font-medium line-clamp-2 leading-relaxed">
                                 {currentState === 'RESPONDING' 
                                    ? "Câu hỏi hay quá, để Lana giải thích cho bạn nghe nhé..." 
                                    : "Đêm đó trăng sáng vằng vặc, ánh trăng chiếu xuyên qua kẽ lá rọi xuống khu mộ cổ. Gió thổi qua từng cơn lạnh buốt..."}
                              </p>
                           </div>
                        </div>
                     )}
                  </div>
               </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
