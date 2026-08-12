import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LIVE_CATEGORIES, addLiveMedia, getAllLiveMedia, deleteLiveMedia } from '../../lib/liveKhoDB';
import { 
  Download, Monitor, ArrowRight, UserSquare2, Cpu, Package, Plus, 
  BookOpen, MessageCircle, Music, ShoppingCart, GraduationCap, Gamepad2,
  Settings2, Upload, Video, ListOrdered, Radio, FileText,
  PlaySquare, Heart, Mic2, Tv, Headphones,
  Camera, Zap, Smile, Info, Search, Brain, FileAudio, Play, Image as ImageIcon,
  Volume2, CheckCircle, AlertCircle, ExternalLink
} from 'lucide-react';

const SYSTEM_PROMPT_TEMPLATE = `Bạn là AI Director điều khiển toàn bộ idol AI trong một phiên livestream đa nền tảng.
Bạn phải điều khiển: Bộ não AI, Avatar, Giọng nói, Biểu cảm, Chuyển động, Video dựng sẵn, Hiệu ứng, Nội dung.
[MỤC TIÊU]
- Giữ không khí sôi động, tương tác tự nhiên.
- Tăng thời gian xem, bình luận, follow, share, quà tặng.
`;

const BRAIN_PACKS = [
  { id: 'story', name: 'Story Mode', desc: 'Kể chuyện theo chương (Cổ tích, ma, ngôn tình...)', icon: BookOpen, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30', prompt: 'AI đọc truyện theo từng chương. Tạm dừng -> Trả lời -> Quay lại đúng đoạn đang kể.' },
  { id: 'talk', name: 'Talk Mode', desc: 'Giao lưu, trò chuyện, hỏi đáp tự do với người xem', icon: MessageCircle, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30', prompt: 'Đọc comment -> Trả lời -> Hỏi ngược. Nếu không có comment: Chủ động đặt câu hỏi.' },
  { id: 'knowledge', name: 'Knowledge Mode', desc: 'Chia sẻ kiến thức chuyên môn (AI, Marketing, Tài chính)', icon: FileText, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/30', prompt: 'Đọc bài -> Giải thích -> Viewer hỏi -> AI trả lời -> Tiếp tục bài học.' },
  { id: 'sales', name: 'Product/Sales Mode', desc: 'Giới thiệu sản phẩm, xử lý phản đối, chốt đơn', icon: ShoppingCart, color: 'text-[#00FF66]', bg: 'bg-[#00FF66]/10', border: 'border-[#00FF66]/30', prompt: 'Giới thiệu sản phẩm -> Công dụng -> Trả lời câu hỏi -> CTA -> Pin sản phẩm -> Chốt đơn.' },
  { id: 'game', name: 'Game Mode', desc: 'Đố vui, đoán số, đuổi hình bắt chữ', icon: Gamepad2, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', prompt: 'AI hỏi -> Viewer trả lời -> AI chấm đúng/sai -> Tiếp tục Game mới.' },
  { id: 'music', name: 'Music Mode', desc: 'Hát, chọn bài theo yêu cầu của viewer', icon: Music, color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/30', prompt: 'AI Hát -> Viewer yêu cầu bài -> AI chọn bài hát tiếp theo -> Tiếp tục.' },
  { id: 'dance', name: 'Dance Mode', desc: 'Thực hiện vũ đạo, nhảy theo quà tặng', icon: Zap, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30', prompt: 'Thực hiện điệu nhảy. Có Gift -> Chuyển Dance khác. Không nói nhiều.' },
  { id: 'news', name: 'News Mode', desc: 'Đọc tin tức, phân tích sự kiện', icon: Radio, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', prompt: 'Đọc tin -> Giải thích/Phân tích -> Tin tiếp theo.' },
  { id: 'review', name: 'Review Mode', desc: 'Đánh giá phim, game, sản phẩm công nghệ', icon: PlaySquare, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', prompt: 'Review chi tiết từng phần -> Viewer hỏi -> Trả lời khách quan.' },
  { id: 'podcast', name: 'Podcast Mode', desc: 'Nói chuyện triết lý, tâm sự sâu lắng', icon: Mic2, color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10', border: 'border-fuchsia-500/30', prompt: 'Nói chuyện chậm rãi, tâm sự triết lý -> Đọc comment -> Tiếp tục tâm sự.' },
  { id: 'education', name: 'Education Mode', desc: 'Dạy học chuyên ngành, hướng dẫn step-by-step', icon: GraduationCap, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', prompt: 'Dạy học bài bản. Hướng dẫn từng bước. Yêu cầu viewer tương tác.' },
  { id: 'meditation', name: 'Meditation Mode', desc: 'Đọc lời thiền định, nhạc thư giãn', icon: Heart, color: 'text-teal-400', bg: 'bg-teal-500/10', border: 'border-teal-500/30', prompt: 'Giọng nói nhẹ nhàng, chậm rãi. Đọc lời dẫn thiền định.' },
  { id: 'horror', name: 'Horror Mode', desc: 'Kể truyện ma giật gân, hiệu ứng kinh dị', icon: Camera, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30', prompt: 'Kể truyện ma. Khi có người comment sợ hãi -> AI phản hồi rùng rợn.' },
  { id: 'motivation', name: 'Motivation Mode', desc: 'Truyền động lực, đọc Quote, kể chuyện thành công', icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', prompt: 'Đọc Quote -> Kể chuyện thành công -> Truyền động lực.' },
  { id: 'qa', name: 'Q&A Mode', desc: 'Chỉ tập trung trả lời câu hỏi của viewer', icon: Info, color: 'text-lime-400', bg: 'bg-lime-500/10', border: 'border-lime-500/30', prompt: 'Chế độ Hỏi-Đáp liên tục. Đọc comment -> Trả lời.' },
  { id: 'roleplay', name: 'Roleplay Mode', desc: 'Nhập vai (Bác sĩ, giáo viên, nhân viên...)', icon: Smile, color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/30', prompt: 'Nhập vai hoàn toàn vào nhân vật trong suốt phiên Live.' },
];

const VIDEO_CATEGORIES = [
  { id: 'greeting', name: 'Greeting', desc: 'Chào hỏi khi có Follow/Comment' },
  { id: 'gift', name: 'Gift', desc: 'Video cảm ơn khi nhận quà' },
  { id: 'dance', name: 'Dance', desc: 'Nhảy khi đạt target/quà lớn' },
  { id: 'story', name: 'Story/Content', desc: 'Video nội dung chính' },
  { id: 'reaction', name: 'Reaction', desc: 'Laugh, Cry, Happy, Thinking, Waiting' },
  { id: 'idle', name: 'Idle', desc: 'Trạng thái nghỉ khi không có tương tác' }
];

const EVENT_PRIORITIES = [
  { p: 1, event: 'Gift lớn', action: 'Dừng mọi thứ để cảm ơn' },
  { p: 2, event: 'Follow', action: 'Chào nhanh' },
  { p: 3, event: 'Share', action: 'Cảm ơn' },
  { p: 4, event: 'Comment có @AI', action: 'Trả lời' },
  { p: 5, event: 'Comment thường', action: 'Đưa vào hàng đợi' },
  { p: 6, event: 'Không sự kiện', action: 'Tiếp tục nội dung chính (Idle/Story)' },
];

const DB_NAME = 'AIDOL_DB';
const STORE_NAME = 'library_items';
const initDB = () => new Promise((resolve, reject) => {
  const req = indexedDB.open(DB_NAME, 1);
  req.onupgradeneeded = (e) => {
    const db = e.target.result;
    if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME, { keyPath: 'id' });
  };
  req.onsuccess = () => resolve(req.result);
  req.onerror = () => reject(req.error);
});

const CATEGORY_LABELS = {
  all: 'Tất cả', livestream: 'Livestream', sales: 'Bán Hàng',
  thankyou: 'Cảm Ơn', audio: 'Âm Thanh', dance: 'Nhảy', story: 'Kể Chuyện'
};

export default function LivestreamAISetup() {
  const [activeStep, setActiveStep] = useState(2);
  const [selectedBrain, setSelectedBrain] = useState('story');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [step3Tab, setStep3Tab] = useState('lipsync');
  const [emotion, setEmotion] = useState(70);

  const videoInputRef = useRef(null);
  const audioInputRef = useRef(null);
  const [selectedVideoFile, setSelectedVideoFile] = useState(null);
  const [selectedAudioFile, setSelectedAudioFile] = useState(null);
  const [selectedVideoLibraryInfo, setSelectedVideoLibraryInfo] = useState(null);
  const [selectedAILibraryInfo, setSelectedAILibraryInfo] = useState(null);
  const [showVideoLibraryModal, setShowVideoLibraryModal] = useState(false);
  const [showAILibraryModal, setShowAILibraryModal] = useState(false);
  const [lipsyncAudioType, setLipsyncAudioType] = useState('text');
  const [showPreviewPlayer, setShowPreviewPlayer] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);

  const [libraryItems, setLibraryItems] = useState([]);
  const [libraryLoaded, setLibraryLoaded] = useState(false);
  const [videoSearchTerm, setVideoSearchTerm] = useState('');
  const [videoSelectedCategory, setVideoSelectedCategory] = useState('all');

  const [savedJobs, setSavedJobs] = useState([]);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [selectedVoicePlatform, setSelectedVoicePlatform] = useState('browser');
  const [testText, setTestText] = useState('Xin chào! Đây là giọng đọc thử nghiệm cho hệ thống AVA Live.');
  const [isTesting, setIsTesting] = useState(false);
  const [browserVoices, setBrowserVoices] = useState([]);
  const [selectedBrowserVoice, setSelectedBrowserVoice] = useState('');

  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      setBrowserVoices(voices);
      const viVoice = voices.find(v => v.lang.includes('vi') || v.name.toLowerCase().includes('viet'));
      if (viVoice) setSelectedBrowserVoice(viVoice.name);
      else if (voices.length > 0) setSelectedBrowserVoice(voices[0].name);
    };
    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  useEffect(() => {
    const pack = BRAIN_PACKS.find(p => p.id === selectedBrain);
    if (pack) setSystemPrompt(SYSTEM_PROMPT_TEMPLATE + '\n[LUỒNG HOẠT ĐỘNG: ' + pack.name + ']\n' + pack.prompt);
  }, [selectedBrain]);

  useEffect(() => {
    if (showVideoLibraryModal && !libraryLoaded) {
      initDB().then(db => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const req = tx.objectStore(STORE_NAME).getAll();
        req.onsuccess = () => {
          const items = req.result.map(item => ({
            ...item,
            mediaUrl: item.fileBlob ? URL.createObjectURL(item.fileBlob) : item.mediaUrl
          }));
          setLibraryItems(items.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
          setLibraryLoaded(true);
        };
      }).catch(err => console.error('IndexedDB error:', err));
    }
  }, [showVideoLibraryModal, libraryLoaded]);

  useEffect(() => {
    if (showAILibraryModal) {
      const jobs = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('aidol_')) {
          try { jobs.push({ key, ...JSON.parse(localStorage.getItem(key)) }); } catch(e) {}
        }
      }
      jobs.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      setSavedJobs(jobs);
    }
  }, [showAILibraryModal]);

  const handleTestVoice = () => {
    if (isTesting) { speechSynthesis.cancel(); setIsTesting(false); return; }
    const utter = new SpeechSynthesisUtterance(testText);
    const voice = browserVoices.find(v => v.name === selectedBrowserVoice);
    if (voice) utter.voice = voice;
    utter.lang = 'vi-VN';
    utter.onstart = () => setIsTesting(true);
    utter.onend = () => setIsTesting(false);
    utter.onerror = () => setIsTesting(false);
    speechSynthesis.speak(utter);
  };

  const filteredVideoItems = libraryItems.filter(item => {
    const matchCat = videoSelectedCategory === 'all' || item.category === videoSelectedCategory;
    const matchSearch = item.name.toLowerCase().includes(videoSearchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 text-white pb-24">

      {/* Hero Banner */}
      <div className="bg-[#121216]/80 backdrop-blur-md rounded-2xl p-8 flex flex-col md:flex-row gap-8 justify-between relative overflow-hidden border border-white/10 shadow-lg">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00FF66]/5 rounded-full blur-[100px] pointer-events-none"></div>
         <div className="flex-1 relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#00FF66] animate-pulse"></span>
              <span className="text-[10px] font-black text-[#00FF66] uppercase tracking-widest">LIVE PRODUCTION HUB</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight">Setup phiên <span className="text-[#00FF66]">Live</span></h1>
            <p className="text-sm text-gray-400 font-medium max-w-lg leading-relaxed mb-4">Chuẩn bị nhân vật, bộ não và kịch bản. Kho video kết nối trực tiếp với AIDOL của bạn.</p>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-lg">
                <CheckCircle className="w-3 h-3 text-green-400"/>
                <span className="text-[10px] font-bold text-green-400">Gemini AI ✓ Miễn phí (15 req/phút)</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <CheckCircle className="w-3 h-3 text-blue-400"/>
                <span className="text-[10px] font-bold text-blue-400">ChatGPT ✓ Cần nạp tiền ($0.15/1M token)</span>
              </div>
              <button onClick={() => setShowVoiceModal(true)} className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 border border-purple-500/30 rounded-lg hover:bg-purple-500/20 transition-colors cursor-pointer">
                <Volume2 className="w-3 h-3 text-purple-400"/>
                <span className="text-[10px] font-bold text-purple-400">🎙️ Test Voice ngay (Miễn phí)</span>
              </button>
            </div>
         </div>
         <div className="w-full md:w-[320px] relative z-10 flex flex-col gap-3">
            <span className="text-xs font-bold text-white">Ứng dụng desktop</span>
            <button className="flex items-center gap-4 p-4 rounded-xl bg-black/40 border border-white/10 hover:border-[#00FF66]/50 transition-all group text-left">
               <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg"><Monitor className="w-5 h-5 text-white" /></div>
               <div className="flex-1">
                 <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">Tải AIDOL Live</div>
                 <div className="text-[10px] text-gray-400">Phát nhân vật và nội dung đã đồng bộ</div>
               </div>
               <Download className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
            </button>
         </div>
      </div>

      {/* Stepper */}
      <div>
         <div className="flex justify-between items-center mb-3 px-2">
           <div>
             <div className="text-[10px] font-black text-[#00FF66] uppercase tracking-widest mb-1">LIVE SETUP CONSOLE</div>
             <h2 className="text-lg font-bold text-white">Thiết lập phiên theo từng lớp</h2>
           </div>
         </div>

         <div className="bg-[#121216]/80 rounded-2xl border border-white/10 shadow-lg p-2 flex flex-col md:flex-row gap-2 mb-6">
            {[['01','Nhân vật',1],['02','Bộ não AI',2],['03','Nội dung & Kho',3],['04','Chốt đơn & Ghim',4]].map(([num,label,step]) => (
              <button key={step} onClick={() => setActiveStep(step)} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${activeStep === step ? 'bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/30 shadow-glow-green' : 'text-gray-400 hover:bg-white/5 border border-transparent'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${activeStep === step ? 'bg-[#00FF66] text-black' : 'bg-white/5 text-gray-400'}`}>{num}</div>
                {label}
              </button>
            ))}
         </div>

         <div className="bg-[#121216]/60 backdrop-blur-md rounded-2xl border border-white/10 p-6 md:p-8 shadow-lg">

            {/* STEP 1 */}
            {activeStep === 1 && (
              <div>
                <span className="inline-block px-3 py-1 bg-[#00FF66]/10 text-[#00FF66] rounded-full text-[10px] font-bold mb-4 border border-[#00FF66]/20">Bước 1 • Nhân vật của phiên</span>
                <h3 className="text-2xl font-black text-white mb-2">Chọn AIDOL tham gia phiên Live</h3>
                <p className="text-sm text-gray-400 mb-6">AIDOL là hồ sơ gốc của phiên. Tạo AIDOL trong tab "AIDOL của tôi" trước.</p>
                <div className="py-16 text-center border-2 border-dashed border-white/10 rounded-xl bg-black/40">
                  <UserSquare2 className="w-12 h-12 text-[#00FF66] mx-auto mb-3" />
                  <h3 className="text-xl font-black text-white mb-2">Chọn từ Kho AIDOL</h3>
                  <p className="text-sm text-gray-500 mb-6">Tạo nhân vật trong tab "AIDOL của tôi" → quay lại đây chọn.</p>
                  <button onClick={() => setActiveStep(2)} className="px-6 py-2.5 bg-[#00FF66] text-black font-bold rounded-lg">Tiếp tục: Bộ não AI →</button>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {activeStep === 2 && (
              <div className="flex flex-col xl:flex-row gap-8">
                <div className="flex-1">
                  <span className="inline-block px-3 py-1 bg-[#00FF66]/10 text-[#00FF66] rounded-full text-[10px] font-bold mb-3 border border-[#00FF66]/20">Bước 2 • Chủ đề & Master Prompt</span>
                  <h3 className="text-2xl font-black text-white mb-2">Hệ thống 16 Live Modes</h3>
                  <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                    <div className="text-[10px] font-black text-amber-400 uppercase mb-1">📋 Thông tin API (quan trọng)</div>
                    <div className="text-[10px] text-gray-300 leading-relaxed">
                      <b className="text-green-400">✅ Gemini Flash (Miễn phí):</b> 15 req/phút, 1M token/ngày — Dùng được NGAY không cần thẻ<br/>
                      <b className="text-blue-400">💳 ChatGPT GPT-4o-mini:</b> $0.15/1M token — Rất rẻ, cần nạp tiền vào OpenAI<br/>
                      <b className="text-purple-400">🎙️ Voice:</b> Bấm "Test Voice ngay" ở trên để dùng giọng miễn phí ngay lập tức
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 h-[450px] overflow-y-auto custom-scrollbar pr-2 pb-4">
                    {BRAIN_PACKS.map(pack => (
                      <button key={pack.id} onClick={() => setSelectedBrain(pack.id)}
                        className={`text-left p-4 rounded-xl border transition-all ${selectedBrain === pack.id ? 'bg-black/60 border-[#00FF66] shadow-[0_0_15px_rgba(0,255,102,0.15)]' : 'bg-black/20 border-white/5 hover:border-white/20'}`}>
                        <div className="flex gap-4 items-center">
                          <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${pack.bg} ${pack.border} border`}>
                            <pack.icon className={`w-5 h-5 ${pack.color}`} />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white flex items-center gap-2">{pack.name} {selectedBrain === pack.id && <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66]"></span>}</h4>
                            <p className="text-[10px] text-gray-400 mt-1 line-clamp-1">{pack.desc}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="w-full xl:w-[450px] flex flex-col gap-4">
                  <div className="bg-black/40 rounded-2xl border border-white/10 p-5 flex flex-col h-[350px]">
                     <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2"><FileText className="w-4 h-4 text-[#00FF66]" /> System Prompt</h4>
                     <textarea value={systemPrompt} onChange={(e) => setSystemPrompt(e.target.value)}
                       className="w-full flex-1 bg-[#121216] border border-white/10 rounded-xl p-4 text-xs font-mono text-gray-300 focus:border-[#00FF66] outline-none resize-none custom-scrollbar leading-relaxed"></textarea>
                  </div>
                  <div className="p-5 bg-black/40 rounded-2xl border border-white/10">
                    <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><Settings2 className="w-4 h-4 text-[#00FF66]" /> Tuỳ chỉnh Mở rộng</h4>
                    <div className="space-y-4">
                      <select className="w-full bg-[#121216] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#00FF66] outline-none">
                        <option>Chuẩn theo Master Prompt</option>
                        <option>Trang trọng, lịch sự hơn</option>
                        <option>Lầy lội, hài hước hơn</option>
                      </select>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-300 mb-2">Mức độ Cảm xúc ({emotion}%)</label>
                        <input type="range" min="0" max="100" step="10" value={emotion} onChange={(e) => setEmotion(parseInt(e.target.value))} className="w-full accent-[#00FF66] h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"/>
                        <div className="flex justify-between text-[10px] text-gray-500 font-bold mt-1"><span>Bình tĩnh</span><span>Sôi nổi</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {activeStep === 3 && (
              <div className="flex flex-col h-full">
                <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <span className="inline-block px-3 py-1 bg-[#00FF66]/10 text-[#00FF66] rounded-full text-[10px] font-bold mb-3 border border-[#00FF66]/20">Bước 3 • Tạo Video & Phát Live</span>
                    <h3 className="text-2xl font-black text-white mb-1">Ghép Video Nhép Môi (Lipsync)</h3>
                    <p className="text-sm text-gray-400">Lồng ghép video từ Kho AIDOL với âm thanh AI để tạo video hoàn chỉnh.</p>
                  </div>
                  <div className="flex bg-black/40 p-1 rounded-xl border border-white/10">
                    {[['lipsync','Tạo Video'],['library','Kho Lưu Trữ'],['priority','Luật Event']].map(([id, label]) => (
                      <button key={id} onClick={() => setStep3Tab(id)} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${step3Tab === id ? 'bg-[#00FF66]/20 text-[#00FF66]' : 'text-gray-400 hover:text-white'}`}>{label}</button>
                    ))}
                  </div>
                </div>

                {step3Tab === 'lipsync' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 mb-6">
                     <div className="flex flex-col gap-5 border-r border-white/10 pr-6">
                        <div>
                           <label className="block text-xs font-bold text-gray-300 mb-2 flex items-center gap-2"><Video className="w-4 h-4 text-[#00FF66]" /> 1. Video Gốc (Từ Kho AIDOL)</label>
                           <div className="flex bg-black/40 rounded-lg border border-white/10 p-1 mb-3">
                              <button onClick={() => { setSelectedVideoLibraryInfo(null); videoInputRef.current?.click(); }}
                                className={`flex-1 py-2 rounded text-xs font-bold transition-all ${!selectedVideoLibraryInfo ? 'bg-[#00FF66]/20 text-[#00FF66]' : 'text-gray-400 hover:text-white'}`}>Tải từ máy</button>
                              <button onClick={() => setShowVideoLibraryModal(true)}
                                className={`flex-1 py-2 rounded text-xs font-bold transition-all ${selectedVideoLibraryInfo ? 'bg-[#00FF66]/20 text-[#00FF66]' : 'text-gray-400 hover:text-white'}`}>Chọn từ Kho AIDOL</button>
                           </div>
                           <div className="flex border border-white/10 rounded-lg overflow-hidden bg-black/40 hover:border-[#00FF66]/50 transition-colors cursor-pointer" onClick={() => !selectedVideoLibraryInfo && videoInputRef.current?.click()}>
                             <div className="px-4 py-2.5 bg-white/5 border-r border-white/10 text-xs font-bold text-gray-300 whitespace-nowrap">{selectedVideoLibraryInfo ? 'Thay đổi' : 'Chọn Tệp'}</div>
                             <div className="px-4 py-2.5 text-xs text-[#00FF66] font-medium flex-1 truncate">{selectedVideoLibraryInfo || (selectedVideoFile ? selectedVideoFile.name : 'Chưa chọn video...')}</div>
                           </div>
                           <input type="file" accept="video/*" className="hidden" ref={videoInputRef} onChange={(e) => { if(e.target.files[0]) { setSelectedVideoFile(e.target.files[0]); setSelectedVideoLibraryInfo(null); } }} />
                        </div>

                        <div className="flex-1 flex flex-col">
                           <label className="block text-xs font-bold text-gray-300 mb-2 flex items-center gap-2"><Mic2 className="w-4 h-4 text-[#00FF66]" /> 2. Âm thanh / Kịch bản AI</label>
                           <div className="flex bg-black/40 rounded-lg border border-white/10 p-1 mb-3">
                              <button onClick={() => { setLipsyncAudioType('voice'); setSelectedAILibraryInfo(null); audioInputRef.current?.click(); }}
                                className={`flex-1 py-2 rounded text-xs font-bold transition-all ${lipsyncAudioType === 'voice' && !selectedAILibraryInfo ? 'bg-[#00FF66]/20 text-[#00FF66]' : 'text-gray-400 hover:text-white'}`}>Tải từ máy</button>
                              <button onClick={() => { setLipsyncAudioType('text'); setShowAILibraryModal(true); }}
                                className={`flex-1 py-2 rounded text-xs font-bold transition-all ${lipsyncAudioType === 'text' || selectedAILibraryInfo ? 'bg-[#00FF66]/20 text-[#00FF66]' : 'text-gray-400 hover:text-white'}`}>Từ Kịch Bản AI đã lưu</button>
                           </div>
                           <input type="text" placeholder="Tiêu đề video..." className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs text-white focus:border-[#00FF66] outline-none mb-3" />
                           {lipsyncAudioType === 'text' || selectedAILibraryInfo ? (
                              <div className="flex-1 bg-black/40 border border-[#00FF66]/30 rounded-lg p-4 flex flex-col justify-center items-center text-center cursor-pointer hover:bg-black/60 transition-colors" onClick={() => setShowAILibraryModal(true)}>
                                 <Brain className="w-8 h-8 text-[#00FF66] mb-2 opacity-80" />
                                 {selectedAILibraryInfo ? (
                                    <><div className="text-xs font-bold text-white mb-1">✅ {selectedAILibraryInfo}</div><div className="text-[10px] text-gray-400">Click để đổi kịch bản khác</div></>
                                 ) : (
                                    <><div className="text-xs font-bold text-white mb-1">Chưa chọn Kịch Bản AI</div><div className="text-[10px] text-[#00FF66]">Nhấn vào để mở Kho Kịch Bản</div></>
                                 )}
                              </div>
                           ) : (
                              <div onClick={() => audioInputRef.current?.click()} className="flex-1 border-2 border-dashed border-white/10 rounded-lg flex flex-col items-center justify-center p-4 bg-black/20 hover:border-[#00FF66]/50 transition-all cursor-pointer">
                                 <Upload className={`w-6 h-6 mb-2 ${selectedAudioFile ? 'text-[#00FF66]' : 'text-gray-400'}`} />
                                 <span className={`text-xs font-bold ${selectedAudioFile ? 'text-[#00FF66]' : 'text-gray-400'}`}>{selectedAudioFile ? '✅ ' + selectedAudioFile.name : 'Kéo thả hoặc click chọn audio'}</span>
                              </div>
                           )}
                           <input type="file" accept="audio/*" className="hidden" ref={audioInputRef} onChange={(e) => { if(e.target.files[0]) { setSelectedAudioFile(e.target.files[0]); setSelectedAILibraryInfo(null); } }} />
                           <div className="mt-2 flex items-center justify-between">
                             <div className="text-[10px] text-gray-500">Giọng: <span className="text-[#00FF66] font-bold">Web Speech API</span></div>
                             <button onClick={() => setShowVoiceModal(true)} className="text-[10px] text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1 cursor-pointer"><Volume2 className="w-3 h-3"/> Thay đổi giọng</button>
                           </div>
                        </div>
                     </div>

                     <div className="flex flex-col">
                        <label className="block text-[10px] font-black text-[#00FF66] uppercase tracking-widest mb-3">TRÌNH XEM TRƯỚC</label>
                        <div className="flex-1 border border-white/10 rounded-xl overflow-hidden bg-black/40 flex flex-col min-h-[250px]">
                           {showPreviewPlayer ? (
                              <>
                                 <div className="flex-1 bg-black relative flex items-center justify-center">
                                   {selectedVideoFile ? (
                                     <video src={URL.createObjectURL(selectedVideoFile)} className="w-full h-full object-contain max-h-[280px]" controls muted/>
                                   ) : (
                                     <div className="text-center"><div className="text-[#00FF66] text-sm font-bold mb-1">{selectedVideoLibraryInfo || 'Video mẫu'}</div><div className="text-gray-400 text-xs">Sẵn sàng phát</div></div>
                                   )}
                                 </div>
                                 <div className="p-3 bg-[#0B0E14] border-t border-white/10 flex justify-between items-center">
                                    <div className="text-[10px] text-gray-400 font-mono">00:00 / 00:15</div>
                                    <button className="text-[10px] font-bold px-3 py-1 bg-white/10 rounded text-white flex items-center gap-1"><Download className="w-3 h-3" /> Tải MP4</button>
                                 </div>
                              </>
                           ) : (
                              <div className="text-center p-6 flex-1 flex flex-col items-center justify-center">
                                <ImageIcon className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                                <p className="text-xs text-gray-500">Chọn video gốc + âm thanh rồi bấm Tạo Video.</p>
                              </div>
                           )}
                        </div>
                        <div className="mt-4 flex flex-col gap-3">
                           <button onClick={() => setShowPreviewPlayer(true)} className="w-full py-3 bg-[#00FF66] hover:bg-[#00CC52] text-black rounded-xl font-black transition-all shadow-glow-green flex items-center justify-center gap-2">
                             <Zap className="w-4 h-4" /> Bắt đầu Ghép (Tạo Video)
                           </button>
                           <button onClick={() => setActiveStep(4)} className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                             Bước tiếp theo: Phát Live <ArrowRight className="w-4 h-4" />
                           </button>
                        </div>
                     </div>
                  </div>
                )}

                {step3Tab === 'library' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {LIVE_CATEGORIES.map(cat => {
                      const catItems = liveMedia.filter(i => i.category === cat.id);
                      return (
                        <div key={cat.id} className={`bg-black/40 border rounded-2xl p-5 flex flex-col hover:border-[#00FF66]/30 transition-colors group ${cat.border} border-opacity-30`}>
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className={`font-bold text-white text-sm group-hover:text-[#00FF66] transition-colors flex items-center gap-1.5`}>
                                {cat.emoji} {cat.name}
                              </h4>
                              <p className="text-[10px] text-gray-500 mt-1">{cat.desc}</p>
                            </div>
                            <span className={`text-[10px] font-black px-2 py-1 rounded ${cat.bg} ${cat.color}`}>
                              {catItems.length} file
                            </span>
                          </div>

                          {/* File list preview */}
                          <div className="flex-1 min-h-[70px] space-y-1 mb-3 max-h-[100px] overflow-y-auto custom-scrollbar">
                            {catItems.slice(0, 5).map(item => (
                              <div key={item.id} className="flex items-center justify-between text-[10px] text-gray-400 px-2 py-1 bg-white/5 rounded group/item hover:bg-white/10">
                                <span className="truncate flex-1">{item.type === 'video' ? '🎬' : item.type === 'audio' ? '🎵' : '🖼️'} {item.name}</span>
                                <button onClick={() => deleteLiveMedia(item.id).then(loadLiveMedia)}
                                  className="ml-2 text-red-400/50 hover:text-red-400 opacity-0 group-hover/item:opacity-100 transition-all flex-shrink-0">
                                  ✕
                                </button>
                              </div>
                            ))}
                            {catItems.length === 0 && (
                              <div className="text-[10px] text-gray-600 text-center py-3">Chưa có file nào — hãy tải lên bên dưới</div>
                            )}
                          </div>

                          {/* Upload button */}
                          <label className={`w-full py-2.5 rounded-lg border border-dashed text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${uploadingCat === cat.id ? 'opacity-50 pointer-events-none border-white/20 text-gray-400' : 'border-white/20 text-gray-400 hover:border-[#00FF66] hover:text-[#00FF66] hover:bg-[#00FF66]/5'}`}>
                            {uploadingCat === cat.id
                              ? <><span className="animate-spin">⟳</span> Đang upload...</>
                              : <><Upload className="w-4 h-4" /> Tải lên thư mục này</>}
                            <input type="file" multiple accept="video/*,audio/*,image/*" className="hidden"
                              onChange={(e) => handleUploadToKho(e, cat.id)} />
                          </label>
                        </div>
                      );
                    })}
                  </div>
                )}

                {step3Tab === 'priority' && (
                  <div className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden">
                    <div className="p-5 border-b border-white/10 bg-black/60">
                      <h4 className="font-bold text-white text-sm">Event Priority Queue</h4>
                      <p className="text-[11px] text-gray-400 mt-1">Mọi sự kiện được xếp hàng theo mức ưu tiên để tránh nói chồng lên nhau.</p>
                    </div>
                    <table className="w-full text-left text-sm">
                      <thead><tr className="bg-white/5 text-gray-400 text-[10px] uppercase tracking-wider">
                        <th className="p-4 w-20 text-center">Ưu tiên</th><th className="p-4">Sự kiện</th><th className="p-4">Hành động AI</th>
                      </tr></thead>
                      <tbody className="divide-y divide-white/5">
                        {EVENT_PRIORITIES.map((item, i) => (
                          <tr key={i} className="hover:bg-white/5">
                            <td className="p-4 text-center"><span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-black ${item.p === 1 ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-gray-400'}`}>{item.p}</span></td>
                            <td className="p-4 font-bold text-gray-300">{item.event}</td>
                            <td className="p-4 text-gray-400">{item.action}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* STEP 4 */}
            {activeStep === 4 && (
              <div className="py-12 flex flex-col items-center">
                 <div className="w-20 h-20 rounded-3xl bg-purple-500/10 border border-purple-500/30 shadow-glow-purple flex items-center justify-center mb-6 relative cursor-pointer" onClick={() => setShowBroadcastModal(true)}>
                    <Monitor className="w-10 h-10 text-purple-400" />
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-bold px-2 py-1 rounded-full animate-pulse">LIVE</div>
                 </div>
                 <h3 className="text-2xl font-black text-white mb-3">Truyền luồng sang Live Studio</h3>
                 <p className="text-sm text-gray-400 max-w-md text-center mb-8">Video nhép miệng đã sẵn sàng. Bấm Truyền Broadcast để mở cửa sổ cho OBS hoặc TikTok Live Studio.</p>
                 <button onClick={() => setShowBroadcastModal(true)} className="px-8 py-3 bg-purple-500 hover:bg-purple-600 text-white font-black rounded-xl flex items-center gap-2">
                   <Monitor className="w-5 h-5" /> Mở cửa sổ Broadcast
                 </button>
              </div>
            )}
         </div>
      </div>

      {/* ── MODAL 1: KHO VIDEO AIDOL THẬT ── */}
      {showVideoLibraryModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
           <div className="bg-[#121216] border border-white/10 rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col h-[85vh]">
              <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#0B0E14]">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-[#00FF66]/20 border border-[#00FF66]/50 flex items-center justify-center"><Video className="w-4 h-4 text-[#00FF66]" /></div>
                   <div>
                     <h3 className="text-sm font-black text-white">Kho Video & Media từ AIDOL của tôi</h3>
                     <p className="text-[10px] text-gray-400">{libraryItems.length} file • Kết nối IndexedDB trực tiếp</p>
                   </div>
                 </div>
                 <button onClick={() => setShowVideoLibraryModal(false)} className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-lg">Đóng</button>
              </div>
              <div className="p-4 bg-[#0B0E14] border-b border-white/10 flex gap-3 flex-wrap">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input type="text" placeholder="Tìm kiếm file..." value={videoSearchTerm} onChange={e => setVideoSearchTerm(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:border-[#00FF66] outline-none" />
                </div>
                <div className="flex gap-1 flex-wrap">
                  {Object.entries(CATEGORY_LABELS).map(([cat, label]) => (
                    <button key={cat} onClick={() => setVideoSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-colors ${videoSelectedCategory === cat ? 'bg-[#00FF66] text-black' : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                {filteredVideoItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-16">
                    <Video className="w-16 h-16 text-gray-600 mb-4" />
                    <h3 className="text-lg font-black text-white mb-2">Kho chưa có file nào</h3>
                    <p className="text-sm text-gray-400 mb-4 max-w-sm">Vào tab "AIDOL của tôi" → "Tạo mới" để tải lên video, ảnh hoặc audio vào kho.</p>
                    <button onClick={() => setShowVideoLibraryModal(false)} className="px-5 py-2 bg-[#00FF66] text-black font-bold rounded-lg text-sm">Đóng & Vào Kho AIDOL</button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {filteredVideoItems.map(item => (
                      <div key={item.id} onClick={() => { setSelectedVideoLibraryInfo(item.name + ' (' + (CATEGORY_LABELS[item.category] || item.category) + ')'); setSelectedVideoFile(null); setShowVideoLibraryModal(false); }}
                        className="group cursor-pointer bg-black/40 border border-white/10 rounded-xl overflow-hidden hover:border-[#00FF66] transition-all hover:shadow-[0_0_15px_rgba(0,255,102,0.2)]">
                        <div className="aspect-[3/4] bg-gray-900 relative flex items-center justify-center overflow-hidden">
                          {item.type === 'video' ? (<video src={item.mediaUrl} className="w-full h-full object-cover" muted/>)
                          : item.type === 'audio' ? (
                            <div className="flex flex-col items-center justify-center p-4 bg-purple-500/10 w-full h-full">
                              <Mic2 className="w-10 h-10 text-purple-400 mb-2" /><span className="text-[10px] text-purple-400 font-bold">Audio</span>
                            </div>
                          ) : (<img src={item.mediaUrl} alt={item.name} className="w-full h-full object-cover" />)}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-all w-10 h-10 rounded-full bg-[#00FF66] flex items-center justify-center"><Play className="w-4 h-4 text-black ml-0.5" /></div>
                          </div>
                          <div className="absolute top-2 left-2"><span className="text-[9px] font-bold text-[#00FF66] bg-black/70 px-1.5 py-0.5 rounded-full">{CATEGORY_LABELS[item.category]}</span></div>
                        </div>
                        <div className="p-2">
                          <h4 className="text-xs font-bold text-white truncate group-hover:text-[#00FF66] transition-colors">{item.name}</h4>
                          <p className="text-[10px] text-gray-500 capitalize">{item.type}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
           </div>
        </div>
      )}

      {/* ── MODAL 2: KHO KỊCH BẢN AI ── */}
      {showAILibraryModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
           <div className="bg-[#121216] border border-white/10 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
              <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#0B0E14]">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center"><Brain className="w-4 h-4 text-blue-400" /></div>
                   <div>
                     <h3 className="text-sm font-black text-white">Kịch Bản đã lưu từ Não Bộ AI</h3>
                     <p className="text-[10px] text-gray-400">{savedJobs.length} kịch bản từ ChatGPT / Gemini</p>
                   </div>
                 </div>
                 <button onClick={() => setShowAILibraryModal(false)} className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-lg">Đóng</button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {savedJobs.length === 0 ? (
                  <div className="text-center py-16">
                    <Brain className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <h3 className="text-lg font-black text-white mb-2">Chưa có kịch bản nào</h3>
                    <p className="text-sm text-gray-400 max-w-sm mx-auto">Vào tab "Giọng nói" → Soạn kịch bản AI → Bấm "Lưu Kịch Bản & Giọng (Đẩy lên Live)"</p>
                  </div>
                ) : (
                  savedJobs.map((job, idx) => (
                    <div key={idx} onClick={() => { setSelectedAILibraryInfo((job.jobName || 'Kịch bản AI') + ' (' + (job.voiceProvider || 'TTS') + ')'); setSelectedAudioFile(null); setLipsyncAudioType('text'); setShowAILibraryModal(false); }}
                      className="flex items-center p-4 bg-black/40 border border-white/5 rounded-xl hover:bg-white/5 hover:border-[#00FF66]/50 cursor-pointer transition-all group">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center mr-4 flex-shrink-0"><Brain className="w-5 h-5" /></div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-white text-sm truncate group-hover:text-[#00FF66] transition-colors">{job.jobName || 'Kịch bản AI'}</div>
                        <div className="text-[10px] text-gray-400 mt-0.5">🎙️ {job.voiceProvider || 'TTS'} • {job.createdAt ? new Date(job.createdAt).toLocaleDateString('vi-VN') : ''}</div>
                        {job.scriptContent && <p className="text-[10px] text-gray-500 mt-1 line-clamp-1">{job.scriptContent.slice(0, 100)}...</p>}
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#00FF66] opacity-0 group-hover:opacity-100 transition-opacity ml-4" />
                    </div>
                  ))
                )}
              </div>
           </div>
        </div>
      )}

      {/* ── MODAL 3: VOICE HUB ── */}
      {showVoiceModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
           <div className="bg-[#121216] border border-white/10 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#0B0E14]">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/50 flex items-center justify-center"><Volume2 className="w-4 h-4 text-purple-400" /></div>
                   <div>
                     <h3 className="text-sm font-black text-white">🎙️ Trung Tâm Giọng Nói (TTS Voice Hub)</h3>
                     <p className="text-[10px] text-gray-400">Test ngay hoặc kết nối các nền tảng TTS hàng đầu</p>
                   </div>
                 </div>
                 <button onClick={() => { speechSynthesis.cancel(); setIsTesting(false); setShowVoiceModal(false); }} className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-lg">Đóng</button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
                <div className="flex flex-wrap gap-2 mb-5">
                  {[['browser','🌐 Trình duyệt (Miễn phí)'],['vbee','🇻🇳 VBee (VN)'],['elevenlabs','⭐ ElevenLabs'],['zalo','💙 Zalo AI'],['google','🔵 Google TTS'],['minimax','🟣 MiniMax'],['openai_tts','🤖 OpenAI TTS']].map(([p, label]) => (
                    <button key={p} onClick={() => setSelectedVoicePlatform(p)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${selectedVoicePlatform === p ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40' : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'}`}>{label}</button>
                  ))}
                </div>

                {selectedVoicePlatform === 'browser' && (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                      <div className="text-xs font-black text-green-400 mb-1">✅ SẴN SÀNG — Web Speech API (Miễn phí 100%)</div>
                      <div className="text-[11px] text-gray-300">Sử dụng giọng đọc có sẵn trong trình duyệt Chrome/Edge. Chạy NGAY không cần API key.</div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-2">Chọn giọng ({browserVoices.length} giọng có sẵn):</label>
                      <select value={selectedBrowserVoice} onChange={e => setSelectedBrowserVoice(e.target.value)}
                        className="w-full bg-black/60 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:border-purple-400 outline-none">
                        {browserVoices.filter(v => v.lang.includes('vi')).length > 0 && (
                          <optgroup label="🇻🇳 Tiếng Việt">
                            {browserVoices.filter(v => v.lang.includes('vi')).map(v => <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>)}
                          </optgroup>
                        )}
                        <optgroup label="🌐 Ngôn ngữ khác">
                          {browserVoices.filter(v => !v.lang.includes('vi')).slice(0,30).map(v => <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>)}
                        </optgroup>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-2">Văn bản thử:</label>
                      <textarea value={testText} onChange={e => setTestText(e.target.value)} rows={3}
                        className="w-full bg-black/60 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-purple-400 outline-none resize-none"/>
                    </div>
                    <button onClick={handleTestVoice}
                      className={`w-full py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all ${isTesting ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-purple-500 hover:bg-purple-600 text-white'}`}>
                      {isTesting ? <><Volume2 className="w-4 h-4 animate-pulse"/> Đang đọc... (Click để dừng)</> : <><Volume2 className="w-4 h-4"/> Nghe thử giọng này</>}
                    </button>
                  </div>
                )}

                {selectedVoicePlatform === 'vbee' && (
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                      <div className="text-xs font-black text-blue-400 mb-1">🇻🇳 VBee — Giọng Việt chuyên nghiệp nhất (VNPT)</div>
                      <div className="text-[11px] text-gray-300 mb-2">Giọng tự nhiên nhất cho Tiếng Việt. <b className="text-yellow-400">Cần đăng ký API key tại vbee.vn.</b> Có gói dùng thử miễn phí.</div>
                      <a href="https://vbee.vn" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-blue-400 text-[11px] font-bold"><ExternalLink className="w-3 h-3"/> vbee.vn</a>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {['Ngọc Huyền — Nữ Bắc, MC Truyền cảm','Mai Phương — Nữ Bắc, Trẻ trung Sôi động','Thu Hương — Nữ Bắc, Bản tin Nghiêm túc','Thanh Mai — Nữ Bắc, Thân thiện Giao tiếp','Mạnh Dũng — Nam Bắc, Mạnh mẽ Dứt khoát','Hoàng Bách — Nam Bắc, Trầm ấm Kể chuyện','Minh Đức — Nam Bắc, Chuyên nghiệp','Tuấn Anh — Nam Bắc, Trầm sâu Nghiêm trang','Thảo Chi — Nữ Nam, Nhí nhảnh Dễ thương','Lan Trinh — Nữ Nam, Tự nhiên Bán hàng','Khánh Linh — Nữ Nam, Livestream Năng động','Minh Hoàng — Nam Nam, Reviewer Hiện đại','Trúc Quỳnh — Nữ Trung, Ngọt ngào Nhẹ nhàng','Bảo Trân — Nữ Trung, Ấm áp Tâm sự'].map((v,i) => (
                        <div key={i} className="p-3 bg-black/40 border border-white/10 rounded-lg text-[11px] text-gray-300 hover:border-blue-500/40 hover:text-white transition-colors">{v}</div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedVoicePlatform === 'elevenlabs' && (
                  <div className="space-y-4">
                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                      <div className="text-xs font-black text-yellow-400 mb-1">⭐ ElevenLabs — Giọng AI siêu thực hàng đầu thế giới</div>
                      <div className="text-[11px] text-gray-300 mb-2"><b className="text-green-400">Gói miễn phí: 10,000 ký tự/tháng.</b> Gói trả phí từ $5/tháng. Hỗ trợ Tiếng Việt qua Multilingual v2.</div>
                      <a href="https://elevenlabs.io" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-yellow-400 text-[11px] font-bold"><ExternalLink className="w-3 h-3"/> elevenlabs.io — Đăng ký miễn phí</a>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {['Rachel — Calm, Soft (Kể chuyện)','Drew — News, Authoritative (Tin tức)','Clyde — War veteran, Husky (Hào hùng)','Paul — Documentary, Deep (Phim tài liệu)','Domi — Strong, Narrative (Tường thuật)','Bella — Soft, ASMR (Thư giãn)','Antoni — Friendly, Bright (Giao tiếp)','Charlie — Conversational (Tự nhiên)','Emily — Calm, Warm (Coaching)','Elli — Young, Emotional (Cảm xúc)','Fin — Irish, Friendly (Tự nhiên vui)','Harry — Anxious, Urgent (Khẩn cấp)','Vietnamese Multilingual Nữ — Tiếng Việt tốt nhất','Vietnamese Multilingual Nam — Tiếng Việt tự nhiên'].map((v,i) => (
                        <div key={i} className="p-3 bg-black/40 border border-white/10 rounded-lg text-[11px] text-gray-300 hover:border-yellow-500/40 hover:text-white transition-colors">{v}</div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedVoicePlatform === 'google' && (
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                      <div className="text-xs font-black text-blue-400 mb-1">🔵 Google Cloud Text-to-Speech</div>
                      <div className="text-[11px] text-gray-300 mb-2"><b className="text-green-400">Miễn phí: 1 triệu ký tự/tháng</b> (Standard), 4 triệu ký tự (WaveNet/Neural2). Cần Google Cloud account.</div>
                      <a href="https://cloud.google.com/text-to-speech" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-blue-400 text-[11px] font-bold"><ExternalLink className="w-3 h-3"/> Google Cloud TTS</a>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {['vi-VN-Standard-A — Nữ Tiêu chuẩn','vi-VN-Standard-B — Nam Tiêu chuẩn','vi-VN-Standard-C — Nữ Tiêu chuẩn 2','vi-VN-Standard-D — Nam Tiêu chuẩn 2','vi-VN-Neural2-A — Nữ Neural2 (Tự nhiên)','vi-VN-Neural2-D — Nam Neural2 (Tự nhiên)','vi-VN-Wavenet-A — Nữ WaveNet (Cao cấp)','vi-VN-Wavenet-B — Nam WaveNet (Cao cấp)','vi-VN-Wavenet-C — Nữ WaveNet 2 (Cao cấp)','vi-VN-Wavenet-D — Nam WaveNet 2 (Cao cấp)'].map((v,i) => (
                        <div key={i} className="p-2.5 bg-black/40 border border-white/10 rounded-lg text-[11px] text-gray-300 hover:border-blue-500/40 hover:text-white transition-colors">{v}</div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedVoicePlatform === 'minimax' && (
                  <div className="space-y-4">
                    <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                      <div className="text-xs font-black text-purple-400 mb-1">🟣 MiniMax TTS — Giọng AI Trung Quốc siêu thực</div>
                      <div className="text-[11px] text-gray-300 mb-2"><b className="text-green-400">Miễn phí: 6 triệu ký tự cho tài khoản mới.</b> Hỗ trợ Tiếng Việt, Anh, Trung, Nhật, Hàn.</div>
                      <a href="https://platform.minimaxi.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-purple-400 text-[11px] font-bold"><ExternalLink className="w-3 h-3"/> platform.minimaxi.com</a>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {['Nữ Thanh Niên VN — Ngọt ngào, tươi trẻ','Nữ Trưởng Thành VN — Chuyên nghiệp','Nữ ASMR VN — Thì thầm, êm dịu','Bé Gái Anime — Đáng yêu, vui vẻ','Nam Thanh Niên VN — Năng động','Nam Trung Niên VN — Trầm ấm đáng tin','Nam Nghiêm Túc — Trang trọng chuyên môn','Bé Trai — Hồn nhiên vui vẻ'].map((v,i) => (
                        <div key={i} className="p-3 bg-black/40 border border-white/10 rounded-lg text-[11px] text-gray-300 hover:border-purple-500/40 hover:text-white transition-colors">{v}</div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedVoicePlatform === 'zalo' && (
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-400/10 border border-blue-400/30 rounded-xl">
                      <div className="text-xs font-black text-blue-300 mb-1">💙 Zalo AI TTS — Made in Vietnam</div>
                      <div className="text-[11px] text-gray-300 mb-2"><b className="text-green-400">Có gói miễn phí cho lập trình viên.</b> Giọng Việt tự nhiên, phát triển bởi Zalo/VNG.</div>
                      <a href="https://zalo.ai" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-blue-300 text-[11px] font-bold"><ExternalLink className="w-3 h-3"/> zalo.ai</a>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {['Nữ Bắc — Tự nhiên giao tiếp','Nam Bắc — Tự nhiên nghiêm túc','Nữ Nam — Nhẹ nhàng dễ thương','Nam Nam — Trầm ấm thân thiện','Nữ Trung — Ngọt ngào','Nam Nghiêm Túc — Chuyên nghiệp','Nữ ASMR Việt — Thư giãn','Nam Trẻ Trung — Năng động'].map((v,i) => (
                        <div key={i} className="p-3 bg-black/40 border border-white/10 rounded-lg text-[11px] text-white hover:border-blue-400/40 transition-colors">{v}</div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedVoicePlatform === 'openai_tts' && (
                  <div className="space-y-4">
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                      <div className="text-xs font-black text-emerald-400 mb-1">🤖 OpenAI TTS — Từ ChatGPT</div>
                      <div className="text-[11px] text-gray-300 mb-2"><b className="text-yellow-400">Trả phí: $15/1M ký tự (tts-1), $30/1M ký tự (tts-1-hd).</b> API key đã được cài, dùng được ngay.</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {['Alloy — Trung tính, cân bằng','Echo — Nam ấm áp tự nhiên','Fable — Kể chuyện, dễ chịu','Onyx — Nam sâu, trầm','Nova — Nữ trẻ, sôi nổi','Shimmer — Nữ mềm mại, dịu dàng','Alloy HD — Chất lượng cao nhất','Echo HD — Nam HD premium'].map((v,i) => (
                        <div key={i} className="p-3 bg-black/40 border border-white/10 rounded-lg text-[11px] text-gray-300 hover:border-emerald-500/40 hover:text-white transition-colors">{v}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-white/10 bg-[#0B0E14] flex justify-end">
                <button onClick={() => { speechSynthesis.cancel(); setIsTesting(false); setShowVoiceModal(false); }}
                  className="px-6 py-2.5 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-lg text-sm cursor-pointer">Xong</button>
              </div>
           </div>
        </div>
      )}

      {/* BROADCAST MODAL */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
           <div className="bg-[#121216] border border-white/10 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col">
              <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#0B0E14]">
                 <div className="flex items-center gap-3">
                   <Monitor className="w-5 h-5 text-purple-400 animate-pulse" />
                   <div>
                     <h3 className="text-sm font-black text-white">Chế độ Truyền (Broadcast Mode)</h3>
                     <p className="text-[10px] text-gray-400">Capture cửa sổ này trong OBS hoặc TikTok Live Studio.</p>
                   </div>
                 </div>
                 <button onClick={() => setShowBroadcastModal(false)} className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-lg">Đóng</button>
              </div>
              <div className="flex-1 bg-[#00FF00] relative aspect-video flex items-center justify-center">
                 <div className="w-64 h-64 border-2 border-dashed border-black/20 flex flex-col items-center justify-center text-black/50 rounded-xl">
                    <Video className="w-12 h-12 mb-2" /><span className="font-bold text-sm">Video Nhép Miệng 1080p</span><span className="text-xs">Sẵn sàng capture</span>
                 </div>
              </div>
              <div className="p-4 bg-[#0B0E14] border-t border-white/10 flex justify-between items-center">
                 <div className="text-xs text-gray-400 font-mono">Trạng thái: <span className="text-[#00FF66] font-bold">Sẵn sàng phát video...</span></div>
                 <div className="flex gap-2">
                   <button className="px-4 py-2 bg-white/5 text-gray-300 rounded-lg text-xs font-bold">Tải MP4</button>
                   <button className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-xs font-black flex items-center gap-2"><Play className="w-4 h-4" /> Bắt đầu Auto Phát</button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
