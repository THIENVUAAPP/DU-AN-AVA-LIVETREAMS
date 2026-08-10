import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, Settings, Activity, BrainCircuit, ListTree, 
  MessageSquare, Mic, MonitorPlay, Users, 
  Play, Square, ChevronRight, Wand2, Plus, 
  Save, Sliders, Volume2, Sparkles, AlertCircle, Clock,
  Upload, Trash2, Edit2, Share2, Facebook, Youtube, Radio, Power
} from 'lucide-react';

export default function AIStorytellerDashboard() {
  const [activeTab, setActiveTab] = useState('character');
  const [isRunning, setIsRunning] = useState(false);
  const [currentState, setCurrentState] = useState('IDLE');
  
  // ============================================
  // CHARACTER STATE (CRUD & UPLOAD)
  // ============================================
  const [characters, setCharacters] = useState([
    { 
      id: 1, 
      name: 'Lana', 
      gender: 'Nữ', 
      age: 25, 
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200',
      ttsModel: 'Việt Nam - Nữ (Miền Nam) - Truyền cảm',
      wpm: 145,
      prompt: "Bạn là Lana, một người kể chuyện duyên dáng, bí ẩn và có chút hài hước. Bạn luôn tương tác gần gũi với người xem, gọi họ là 'các bạn' hoặc 'anh chị em'.",
      humor: 70, tension: 85, sale: 30, interact: 90,
      blinkRate: 50, headMovement: 60, gesture: 40, reflexDelay: 2
    }
  ]);
  const [activeCharId, setActiveCharId] = useState(1);
  const activeChar = characters.find(c => c.id === activeCharId) || characters[0];
  const fileInputRef = useRef(null);

  const handleUpdateChar = (key, value) => {
    setCharacters(chars => chars.map(c => c.id === activeCharId ? { ...c, [key]: value } : c));
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      handleUpdateChar('avatar', imageUrl);
    }
  };

  const handleCreateNewChar = () => {
    const newId = Date.now();
    setCharacters([...characters, {
      id: newId, name: 'Nhân Vật Mới', gender: 'Nữ', age: 20,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + newId,
      ttsModel: 'Việt Nam - Nữ (Miền Nam) - Truyền cảm', wpm: 140,
      prompt: '', humor: 50, tension: 50, sale: 50, interact: 50,
      blinkRate: 50, headMovement: 50, gesture: 50, reflexDelay: 1.5
    }]);
    setActiveCharId(newId);
  };

  const handleDeleteChar = (id) => {
    if (characters.length === 1) return alert("Phải có ít nhất 1 nhân vật!");
    const filtered = characters.filter(c => c.id !== id);
    setCharacters(filtered);
    if (activeCharId === id) setActiveCharId(filtered[0].id);
  };

  // ============================================
  // MULTI-PLATFORM STATE
  // ============================================
  const [platforms, setPlatforms] = useState({
    tiktok: true,
    facebook: false,
    youtube: false
  });

  // ============================================
  // TOPIC TREE STATE (CRUD)
  // ============================================
  const [topicInput, setTopicInput] = useState('Kể chuyện ma dân gian');
  const [topicCategories, setTopicCategories] = useState([
    {
      id: 'c1',
      title: 'C01 - MA DÂN GIAN',
      episodes: [
        { id: 'e1', title: 'Ma Trơi Làng Cổ', words: 720, duration: '4m55s' },
        { id: 'e2', title: 'Người Chết Oan Đòi Mạng', words: 745, duration: '5m10s' }
      ]
    },
    {
      id: 'c2',
      title: 'C02 - TRUYỆN MA ĐÔ THỊ',
      episodes: [
        { id: 'e3', title: 'Thang Máy Lúc 3 Giờ Sáng', words: 810, duration: '5m30s' }
      ]
    }
  ]);

  const handleAddEpisode = (catId) => {
    setTopicCategories(cats => cats.map(cat => {
      if (cat.id === catId) {
        return { ...cat, episodes: [...cat.episodes, { id: Date.now().toString(), title: 'Tập Mới (Bản nháp)', words: 500, duration: '3m00s' }] };
      }
      return cat;
    }));
  };

  const handleDeleteEpisode = (catId, epId) => {
    setTopicCategories(cats => cats.map(cat => {
      if (cat.id === catId) {
        return { ...cat, episodes: cat.episodes.filter(ep => ep.id !== epId) };
      }
      return cat;
    }));
  };

  const handleGenerateTopic = () => {
    // Fake generate new category based on topicInput
    const newCat = {
      id: Date.now().toString(),
      title: `CHỦ ĐỀ: ${topicInput.toUpperCase()}`,
      episodes: [
        { id: Date.now() + '1', title: 'Tập 1: Mở đầu', words: 600, duration: '4m00s' },
        { id: Date.now() + '2', title: 'Tập 2: Cao trào', words: 800, duration: '5m20s' }
      ]
    };
    setTopicCategories([newCat, ...topicCategories]);
  };

  // ============================================
  // LIVE MONITOR & COMMENTS
  // ============================================
  const [comments, setComments] = useState([]);
  const [takeover, setTakeover] = useState(false); // Manual Takeover
  
  useEffect(() => {
    if (isRunning && !takeover) {
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
          setTimeout(() => setCurrentState('RESPONDING'), activeChar.reflexDelay * 1000); // Dynamic reflex
          setTimeout(() => setCurrentState('STORYTELLING'), (activeChar.reflexDelay * 1000) + 4000);
        }
      }, 5000);
      return () => clearInterval(interval);
    } else if (takeover) {
      setCurrentState('TAKEOVER');
    } else {
      setCurrentState('IDLE');
    }
  }, [isRunning, takeover, activeChar.reflexDelay]);

  return (
    <div className="animate-fade-in text-left space-y-6 w-full max-w-7xl mx-auto h-full pb-20 flex flex-col">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-2 shrink-0 gap-4">
        <div>
          <h2 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-glow-purple">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            AI Livestream Character Engine
          </h2>
          <p className="text-gray-400 text-sm max-w-2xl">
            Hệ thống AI tự động hóa: Quản lý nhân vật (CRUD), cấu hình hoạt động tự nhiên, kết nối đa nền tảng và tương tác thời gian thực.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center bg-[#141419] border border-white/10 rounded-xl p-1 shrink-0">
             <button onClick={() => setPlatforms({...platforms, tiktok: !platforms.tiktok})} className={`px-3 py-2 rounded-lg flex items-center gap-2 text-xs font-bold transition-all ${platforms.tiktok ? 'bg-black text-white' : 'text-gray-500 hover:text-gray-300'}`}><Radio className="w-3 h-3"/> TikTok</button>
             <button onClick={() => setPlatforms({...platforms, facebook: !platforms.facebook})} className={`px-3 py-2 rounded-lg flex items-center gap-2 text-xs font-bold transition-all ${platforms.facebook ? 'bg-blue-600/20 text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}><Facebook className="w-3 h-3"/> Facebook</button>
             <button onClick={() => setPlatforms({...platforms, youtube: !platforms.youtube})} className={`px-3 py-2 rounded-lg flex items-center gap-2 text-xs font-bold transition-all ${platforms.youtube ? 'bg-red-600/20 text-red-400' : 'text-gray-500 hover:text-gray-300'}`}><Youtube className="w-3 h-3"/> YouTube</button>
          </div>

          <button 
            onClick={() => setIsRunning(!isRunning)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-all shadow-lg shrink-0 ${
              isRunning 
              ? 'bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30' 
              : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-105'
            }`}
          >
            {isRunning ? <Square className="w-4 h-4 fill-current"/> : <Power className="w-4 h-4"/>}
            {isRunning ? 'DỪNG ENGINE' : 'KHỞI ĐỘNG AI BRAIN'}
          </button>
        </div>
      </div>

      {/* Internal Navigation Tabs */}
      <div className="flex items-center gap-2 bg-[#141419] p-1.5 rounded-2xl border border-white/5 shrink-0 overflow-x-auto no-scrollbar">
        {[
          { id: 'character', icon: <Bot className="w-4 h-4" />, label: 'Quản Lý Nhân Vật (CRUD)' },
          { id: 'topic', icon: <ListTree className="w-4 h-4" />, label: 'Quản Lý Kịch Bản (Topic Tree)' },
          { id: 'live', icon: <MonitorPlay className="w-4 h-4" />, label: 'Giám Sát Live & Takeover' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 min-w-[200px] flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
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
        
        {/* =========================================
            CHARACTER TAB (CRUD & UPLOAD & NATURAL AI)
            ========================================= */}
        {activeTab === 'character' && (
          <div className="h-full overflow-y-auto custom-scrollbar space-y-6 pb-10">
            {/* Character Selector */}
            <div className="flex items-center gap-3">
               {characters.map(char => (
                  <button 
                     key={char.id}
                     onClick={() => setActiveCharId(char.id)}
                     className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${activeCharId === char.id ? 'bg-purple-600/20 text-purple-400 border border-purple-500/50' : 'bg-[#141419] border border-white/10 text-gray-400 hover:text-white'}`}
                  >
                     <img src={char.avatar} className="w-5 h-5 rounded-full object-cover" alt="" />
                     {char.name}
                  </button>
               ))}
               <button onClick={handleCreateNewChar} className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 rounded-xl text-sm font-bold flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Thêm Nhân Vật
               </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Col: Basic Info & Upload */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-[#141419] border border-white/5 rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
                  
                  <div className="flex justify-between items-start mb-6 relative z-10">
                     <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Users className="w-4 h-4 text-purple-400" /> Hồ Sơ Nhân Vật
                     </h3>
                     <button onClick={() => handleDeleteChar(activeCharId)} className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                     </button>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center mb-6 relative z-10">
                    <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        ref={fileInputRef} 
                        onChange={handleAvatarUpload}
                     />
                    <div 
                        className="relative group cursor-pointer w-32 h-32 rounded-full border-2 border-dashed border-white/20 overflow-hidden group-hover:border-purple-500 transition-colors"
                        onClick={() => fileInputRef.current.click()}
                     >
                        <img src={activeChar.avatar} alt="Avatar" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                           <Upload className="w-5 h-5 text-white mb-1" />
                           <span className="text-[10px] font-bold text-white uppercase tracking-wider">Đổi Ảnh</span>
                        </div>
                    </div>
                  </div>

                  <div className="space-y-4 relative z-10">
                    <div>
                      <label className="text-xs text-gray-400 font-bold mb-1.5 block">Tên Nhân Vật</label>
                      <input type="text" value={activeChar.name} onChange={(e) => handleUpdateChar('name', e.target.value)} className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-purple-500 focus:outline-none transition-all" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-400 font-bold mb-1.5 block">Giới Tính</label>
                        <select value={activeChar.gender} onChange={(e) => handleUpdateChar('gender', e.target.value)} className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-purple-500 focus:outline-none">
                          <option>Nữ</option>
                          <option>Nam</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 font-bold mb-1.5 block">Độ Tuổi</label>
                        <input type="number" value={activeChar.age} onChange={(e) => handleUpdateChar('age', e.target.value)} className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-purple-500 focus:outline-none" />
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
                        <select value={activeChar.ttsModel} onChange={(e) => handleUpdateChar('ttsModel', e.target.value)} className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-purple-500 focus:outline-none">
                          <option>Việt Nam - Nữ (Miền Nam) - Truyền cảm</option>
                          <option>Việt Nam - Nữ (Miền Bắc) - Chuẩn</option>
                          <option>Việt Nam - Nam (Miền Nam) - Trầm ấm</option>
                        </select>
                     </div>
                     <div>
                        <div className="flex justify-between items-end mb-1.5">
                           <label className="text-xs text-gray-400 font-bold block">Tốc Độ Đọc (WPM)</label>
                           <span className="text-xs text-emerald-400 font-bold">{activeChar.wpm} WPM</span>
                        </div>
                        <input type="range" min="110" max="180" value={activeChar.wpm} onChange={(e) => handleUpdateChar('wpm', parseInt(e.target.value))} className="w-full accent-emerald-500" />
                     </div>
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
                       <textarea rows="3" value={activeChar.prompt} onChange={(e) => handleUpdateChar('prompt', e.target.value)} className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-purple-500 focus:outline-none custom-scrollbar leading-relaxed"></textarea>
                    </div>

                    <div className="space-y-6">
                       <div>
                          <div className="flex justify-between mb-1.5 text-xs font-bold">
                             <span className="text-gray-400">Mức Độ Hài Hước</span>
                             <span className="text-amber-400">{activeChar.humor}%</span>
                          </div>
                          <input type="range" min="0" max="100" value={activeChar.humor} onChange={(e) => handleUpdateChar('humor', parseInt(e.target.value))} className="w-full accent-amber-500" />
                       </div>
                       <div>
                          <div className="flex justify-between mb-1.5 text-xs font-bold">
                             <span className="text-gray-400">Độ Căng Thẳng (Storytelling)</span>
                             <span className="text-purple-400">{activeChar.tension}%</span>
                          </div>
                          <input type="range" min="0" max="100" value={activeChar.tension} onChange={(e) => handleUpdateChar('tension', parseInt(e.target.value))} className="w-full accent-purple-500" />
                       </div>
                    </div>

                    <div className="space-y-6">
                       <div>
                          <div className="flex justify-between mb-1.5 text-xs font-bold">
                             <span className="text-gray-400">Mức Độ Bán Hàng (Sale Focus)</span>
                             <span className="text-emerald-400">{activeChar.sale}%</span>
                          </div>
                          <input type="range" min="0" max="100" value={activeChar.sale} onChange={(e) => handleUpdateChar('sale', parseInt(e.target.value))} className="w-full accent-emerald-500" />
                       </div>
                       <div>
                          <div className="flex justify-between mb-1.5 text-xs font-bold">
                             <span className="text-gray-400">Mức Độ Tương Tác Comment</span>
                             <span className="text-cyan-400">{activeChar.interact}%</span>
                          </div>
                          <input type="range" min="0" max="100" value={activeChar.interact} onChange={(e) => handleUpdateChar('interact', parseInt(e.target.value))} className="w-full accent-cyan-500" />
                       </div>
                    </div>
                  </div>
                </div>

                {/* NEW SECTION: NATURAL BEHAVIOR */}
                <div className="bg-[#141419] border border-white/5 rounded-2xl p-6">
                  <div className="flex justify-between items-center mb-6">
                     <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Activity className="w-4 h-4 text-pink-400" /> Hoạt Động Tự Nhiên (Natural Behavior)
                     </h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-6">
                        <div>
                           <div className="flex justify-between mb-1.5 text-xs font-bold">
                              <span className="text-gray-400">Tần Suất Chớp Mắt (Blinking)</span>
                              <span className="text-pink-400">{activeChar.blinkRate}%</span>
                           </div>
                           <input type="range" min="0" max="100" value={activeChar.blinkRate} onChange={(e) => handleUpdateChar('blinkRate', parseInt(e.target.value))} className="w-full accent-pink-500" />
                        </div>
                        <div>
                           <div className="flex justify-between mb-1.5 text-xs font-bold">
                              <span className="text-gray-400">Giao Tiếp Cơ Thể (Gestures)</span>
                              <span className="text-orange-400">{activeChar.gesture}%</span>
                           </div>
                           <input type="range" min="0" max="100" value={activeChar.gesture} onChange={(e) => handleUpdateChar('gesture', parseInt(e.target.value))} className="w-full accent-orange-500" />
                        </div>
                     </div>
                     <div className="space-y-6">
                        <div>
                           <div className="flex justify-between mb-1.5 text-xs font-bold">
                              <span className="text-gray-400">Cử Động Đầu (Head Movements)</span>
                              <span className="text-indigo-400">{activeChar.headMovement}%</span>
                           </div>
                           <input type="range" min="0" max="100" value={activeChar.headMovement} onChange={(e) => handleUpdateChar('headMovement', parseInt(e.target.value))} className="w-full accent-indigo-500" />
                        </div>
                        <div>
                           <div className="flex justify-between mb-1.5 text-xs font-bold">
                              <span className="text-gray-400">Độ Trễ Phản Xạ (Reflex Delay)</span>
                              <span className="text-blue-400">{activeChar.reflexDelay}s</span>
                           </div>
                           <input type="range" min="0.5" max="5.0" step="0.1" value={activeChar.reflexDelay} onChange={(e) => handleUpdateChar('reflexDelay', parseFloat(e.target.value))} className="w-full accent-blue-500" />
                           <p className="text-[10px] text-gray-500 mt-1">Giả lập thời gian suy nghĩ trước khi trả lời comment (giống người thật).</p>
                        </div>
                     </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                   <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold text-sm rounded-xl transition-all flex items-center gap-2 shadow-glow-purple">
                      <Save className="w-4 h-4" /> LƯU THÔNG TIN NHÂN VẬT
                   </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================
            TOPIC TAB (CRUD TOPIC TREE)
            ========================================= */}
        {activeTab === 'topic' && (
          <div className="h-full flex flex-col">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full pb-10">
               
               {/* Left: Input Topic */}
               <div className="lg:col-span-1 space-y-6 flex flex-col h-full">
                  <div className="bg-[#141419] border border-white/5 rounded-2xl p-6">
                     <h3 className="text-sm font-bold text-white mb-4">Master Topic Input</h3>
                     <div className="space-y-4">
                        <textarea 
                           rows="3" 
                           value={topicInput}
                           onChange={(e) => setTopicInput(e.target.value)}
                           className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-purple-500 focus:outline-none resize-none"
                           placeholder="Nhập chủ đề lớn. VD: Kể chuyện ma, Review sách..."
                        ></textarea>
                        
                        <button onClick={handleGenerateTopic} className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 rounded-xl text-xs font-black text-white shadow-glow-purple flex items-center justify-center gap-2 transition-all hover:scale-[1.02]">
                           <Wand2 className="w-4 h-4" /> TẠO NHANH TOPIC TREE
                        </button>
                     </div>
                  </div>

                  <div className="bg-[#141419] border border-white/5 rounded-2xl p-6 flex-1">
                     <h3 className="text-sm font-bold text-white mb-4">Phân Tích Dữ Liệu</h3>
                     <div className="space-y-4">
                        <div className="p-3 bg-[#0A0A0A] rounded-xl border border-white/5">
                           <span className="text-[10px] text-gray-500 uppercase font-bold">Tổng số danh mục</span>
                           <p className="text-lg font-black text-white mt-1">{topicCategories.length}</p>
                        </div>
                        <div className="p-3 bg-[#0A0A0A] rounded-xl border border-white/5">
                           <span className="text-[10px] text-gray-500 uppercase font-bold">Khán giả Mục Tiêu (Intent)</span>
                           <p className="text-sm font-medium text-emerald-400 mt-1">Giải trí, Kích thích, Tò mò</p>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Right: Topic Tree UI */}
               <div className="lg:col-span-3 bg-[#141419] border border-white/5 rounded-2xl p-6 flex flex-col h-full overflow-hidden relative">
                  
                  <div className="flex justify-between items-center mb-6 shrink-0 z-10">
                     <h3 className="text-lg font-black text-white flex items-center gap-2">
                        <ListTree className="w-5 h-5 text-indigo-400" /> Quản Lý Cấu Trúc Kịch Bản
                     </h3>
                     <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-bold flex items-center gap-2">
                        <Plus className="w-3 h-3" /> Thêm Danh Mục
                     </button>
                  </div>

                  <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-6 z-10">
                     {topicCategories.map((cat, index) => (
                        <div key={cat.id} className="bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden shadow-lg">
                           <div className="px-4 py-3 bg-white/5 border-b border-white/5 flex items-center justify-between">
                              <input 
                                 type="text" 
                                 value={cat.title} 
                                 onChange={(e) => setTopicCategories(cats => cats.map(c => c.id === cat.id ? {...c, title: e.target.value} : c))}
                                 className="bg-transparent border-none text-sm font-bold text-white uppercase focus:outline-none w-1/2"
                              />
                              <div className="flex items-center gap-3">
                                 <span className="text-xs font-medium text-purple-400 bg-purple-500/10 px-2 py-1 rounded">{cat.episodes.length} Episodes</span>
                                 <button onClick={() => setTopicCategories(cats => cats.filter(c => c.id !== cat.id))} className="text-red-400 hover:text-red-300 p-1"><Trash2 className="w-4 h-4" /></button>
                              </div>
                           </div>
                           <div className="p-4 space-y-3">
                              {cat.episodes.map((ep, i) => (
                                 <div key={ep.id} className="flex items-center justify-between p-3 bg-[#141419] border border-white/5 rounded-lg group">
                                    <div className="flex items-center gap-3 flex-1">
                                       <div className="w-6 h-6 rounded bg-purple-500/20 text-purple-400 flex items-center justify-center text-[10px] font-bold shrink-0">EP{i+1}</div>
                                       <input 
                                          type="text" 
                                          value={ep.title}
                                          onChange={(e) => setTopicCategories(cats => cats.map(c => c.id === cat.id ? {...c, episodes: c.episodes.map(eItem => eItem.id === ep.id ? {...eItem, title: e.target.value} : eItem)} : c))}
                                          className="bg-transparent border-none text-sm font-medium text-gray-200 focus:outline-none w-full"
                                       />
                                    </div>
                                    <div className="flex items-center gap-4 text-xs font-mono text-gray-500 shrink-0">
                                       <span>{ep.words} Words</span>
                                       <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {ep.duration}</span>
                                       <button onClick={() => handleDeleteEpisode(cat.id, ep.id)} className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4"/></button>
                                    </div>
                                 </div>
                              ))}
                              
                              <button onClick={() => handleAddEpisode(cat.id)} className="w-full p-3 border border-dashed border-white/20 rounded-lg text-xs font-bold text-gray-400 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all flex items-center justify-center gap-2">
                                 <Plus className="w-3 h-3" /> THÊM EPISODE
                              </button>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* =========================================
            LIVE MONITOR TAB (Takeover Feature)
            ========================================= */}
        {activeTab === 'live' && (
          <div className="h-full flex flex-col gap-6 pb-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 shrink-0">
               {/* Live Brain Stats */}
               <div className="bg-[#141419] border border-white/5 rounded-2xl p-5 flex items-center justify-between">
                  <div>
                     <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">State Machine Status</p>
                     <div className="flex items-center gap-2 text-xl font-black text-white">
                        <Activity className={`w-5 h-5 ${isRunning && !takeover ? 'text-emerald-400 animate-pulse' : takeover ? 'text-amber-500' : 'text-gray-600'}`} />
                        {currentState}
                     </div>
                  </div>
                  <div className={`px-3 py-1.5 rounded-full text-xs font-bold ${isRunning && !takeover ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : takeover ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' : 'bg-gray-800 text-gray-400 border border-gray-700'}`}>
                     {takeover ? 'MANUAL OVERRIDE' : isRunning ? 'ONLINE - AUTO' : 'OFFLINE'}
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
                     
                     <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-400">Memory Context: <span className="text-emerald-400 font-bold">Active</span></span>
                        
                        <button 
                           onClick={() => {
                              if (!isRunning) return alert('Hãy bật AI Brain trước.');
                              setTakeover(!takeover);
                           }}
                           className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${takeover ? 'bg-amber-500 text-black shadow-glow-amber' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                        >
                           {takeover ? 'Đang Can Thiệp Bằng Tay (Stop Takeover)' : 'Can Thiệp Bằng Tay (Takeover)'}
                        </button>
                     </div>
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
                                 <span className="text-xs font-bold text-purple-400">AI Storyteller đang phân tích và chuẩn bị trả lời...</span>
                                 <Activity className="w-3 h-3 text-purple-400 animate-pulse" />
                              </div>
                              <div className="h-6 w-32 bg-white/5 rounded animate-pulse"></div>
                           </div>
                        </div>
                     )}

                     {currentState === 'TAKEOVER' && (
                        <div className="animate-fade-in flex gap-3 mt-4 ml-8">
                           <div className="w-8 h-8 rounded-full border border-amber-500 bg-amber-500/20 flex items-center justify-center text-[10px] font-black text-amber-500 shrink-0">
                              <Settings className="w-4 h-4" />
                           </div>
                           <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                 <span className="text-xs font-bold text-amber-500">Người quản lý đang can thiệp thủ công...</span>
                              </div>
                              <textarea placeholder="Nhập câu trả lời bằng tay cho AI đọc..." className="w-full bg-[#141419] border border-amber-500/50 rounded-xl px-4 py-3 text-white text-sm focus:outline-none"></textarea>
                              <button className="mt-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs rounded-lg shadow-glow-amber">Phát câu này</button>
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
                        src={activeChar.avatar} 
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
                              <div className="flex items-center justify-between mb-1">
                                 <div className="flex items-center gap-2">
                                    <Volume2 className="w-3 h-3 text-emerald-400 animate-pulse" />
                                    <span className="text-[10px] font-bold text-emerald-400">TTS Audio Output</span>
                                 </div>
                                 {/* Platforms Active Indicators */}
                                 <div className="flex gap-1">
                                    {platforms.tiktok && <div className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_5px_white]"></div>}
                                    {platforms.facebook && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_5px_blue]"></div>}
                                    {platforms.youtube && <div className="w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_5px_red]"></div>}
                                 </div>
                              </div>
                              <p className="text-xs text-white font-medium line-clamp-2 leading-relaxed">
                                 {currentState === 'RESPONDING' 
                                    ? `Câu hỏi hay quá, để ${activeChar.name} giải thích cho bạn nghe nhé...` 
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
