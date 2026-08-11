import React, { useState, useEffect, useRef } from 'react';
import { 
  Download, Monitor, ArrowRight, UserSquare2, Cpu, Package, Plus, 
  BookOpen, MessageCircle, Music, ShoppingCart, GraduationCap, Gamepad2,
  Settings2, Upload, Video, ListOrdered, Radio, FileText,
  PlaySquare, Heart, Mic2, Tv, Headphones,
  Camera, Zap, Smile, Info, Search, Brain, FileAudio, Play, Image as ImageIcon
} from 'lucide-react';

const SYSTEM_PROMPT_TEMPLATE = `Bạn là AI Director điều khiển toàn bộ idol AI trong một phiên livestream đa nền tảng.
Nhiệm vụ của bạn không chỉ là trả lời bình luận, mà còn là đạo diễn chương trình.
Bạn phải điều khiển: Bộ não AI, Avatar, Giọng nói, Biểu cảm, Chuyển động, Video dựng sẵn, Hiệu ứng, Nội dung.

[MỤC TIÊU]
- Giữ không khí sôi động, tương tác tự nhiên.
- Tăng thời gian xem, bình luận, follow, share, quà tặng.

`;

const BRAIN_PACKS = [
  { id: 'story', name: 'Story Mode', desc: 'Kể chuyện theo chương (Cổ tích, ma, ngôn tình...)', icon: BookOpen, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30', prompt: 'AI đọc truyện theo từng chương. Điều chỉnh cảm xúc. Khi có bình luận liên quan: Tạm dừng -> Trả lời -> Quay lại đúng đoạn đang kể. Không làm mất mạch câu chuyện.' },
  { id: 'talk', name: 'Talk Mode', desc: 'Giao lưu, trò chuyện, hỏi đáp tự do với người xem', icon: MessageCircle, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30', prompt: 'Không có kịch bản cố định. Đọc comment -> Hiểu -> Trả lời -> Hỏi ngược. Nếu không có comment: Chủ động đặt câu hỏi, mời người xem chia sẻ, nhắc follow kênh.' },
  { id: 'knowledge', name: 'Knowledge Mode', desc: 'Chia sẻ kiến thức chuyên môn (AI, Marketing, Tài chính)', icon: FileText, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/30', prompt: 'Đọc bài -> Giải thích ngắn gọn, dễ hiểu, có ví dụ -> Viewer hỏi -> AI trả lời -> Tiếp tục bài học.' },
  { id: 'sales', name: 'Product/Sales Mode', desc: 'Giới thiệu sản phẩm, xử lý phản đối, chốt đơn', icon: ShoppingCart, color: 'text-[#00FF66]', bg: 'bg-[#00FF66]/10', border: 'border-[#00FF66]/30', prompt: 'Giới thiệu sản phẩm -> Công dụng -> Trả lời câu hỏi -> CTA -> Pin sản phẩm -> Nhắc Voucher -> Chốt đơn. Dừng để cảm ơn quà nếu cần.' },
  { id: 'game', name: 'Game Mode', desc: 'Đố vui, đoán số, đuổi hình bắt chữ', icon: Gamepad2, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', prompt: 'AI hỏi -> Viewer trả lời -> AI chấm đúng/sai -> Trao thưởng (Video Happy/Funny) -> Tiếp tục Game mới.' },
  { id: 'music', name: 'Music Mode', desc: 'Hát, chọn bài theo yêu cầu của viewer', icon: Music, color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/30', prompt: 'AI Hát -> Viewer yêu cầu bài -> AI chọn bài hát tiếp theo -> Tiếp tục.' },
  { id: 'dance', name: 'Dance Mode', desc: 'Thực hiện vũ đạo, nhảy theo quà tặng', icon: Zap, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30', prompt: 'Thực hiện điệu nhảy (Idle Dance). Có Gift -> Chuyển Dance khác. Có Gift lớn -> Dance VIP. Không nói nhiều.' },
  { id: 'news', name: 'News Mode', desc: 'Đọc tin tức, phân tích sự kiện', icon: Radio, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', prompt: 'Đọc tin -> Giải thích/Phân tích -> Viewer hỏi -> Phân tích sâu hơn -> Tin tiếp theo.' },
  { id: 'review', name: 'Review Mode', desc: 'Đánh giá phim, game, sản phẩm công nghệ', icon: PlaySquare, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', prompt: 'Review chi tiết từng phần -> Viewer hỏi -> Trả lời khách quan -> Tiếp tục Review.' },
  { id: 'podcast', name: 'Podcast Mode', desc: 'Nói chuyện triết lý, tâm sự sâu lắng', icon: Mic2, color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10', border: 'border-fuchsia-500/30', prompt: 'Nói chuyện chậm rãi, tâm sự triết lý -> Đọc comment -> Trò chuyện sâu sắc -> Tiếp tục tâm sự.' },
  { id: 'education', name: 'Education Mode', desc: 'Dạy học chuyên ngành, hướng dẫn step-by-step', icon: GraduationCap, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', prompt: 'Dạy học bài bản (Toán, Tiếng Anh, Lập trình). Hướng dẫn từng bước. Yêu cầu viewer tương tác để kiểm tra bài.' },
  { id: 'meditation', name: 'Meditation Mode', desc: 'Đọc lời thiền định, nhạc thư giãn', icon: Heart, color: 'text-teal-400', bg: 'bg-teal-500/10', border: 'border-teal-500/30', prompt: 'Giọng nói nhẹ nhàng, chậm rãi. Đọc lời dẫn thiền định -> Nhạc thư giãn -> Trả lời nhẹ nhàng nếu có người hỏi.' },
  { id: 'horror', name: 'Horror Mode', desc: 'Kể truyện ma giật gân, hiệu ứng kinh dị', icon: Camera, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30', prompt: 'Kể truyện ma. Gọi hiệu ứng âm thanh/hình ảnh tối. Khi có người comment sợ hãi -> AI phản hồi rùng rợn hoặc trấn an -> Tiếp tục.' },
  { id: 'motivation', name: 'Motivation Mode', desc: 'Truyền động lực, đọc Quote, kể chuyện thành công', icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', prompt: 'Đọc Quote truyền cảm hứng -> Kể chuyện thành công vượt khó -> Truyền động lực mạnh mẽ -> Trả lời câu hỏi của Viewer.' },
  { id: 'qa', name: 'Q&A Mode', desc: 'Chỉ tập trung trả lời câu hỏi của viewer', icon: Info, color: 'text-lime-400', bg: 'bg-lime-500/10', border: 'border-lime-500/30', prompt: 'Chế độ Hỏi-Đáp liên tục. Đọc comment -> Trả lời. Không có kịch bản chính.' },
  { id: 'roleplay', name: 'Roleplay Mode', desc: 'Nhập vai (Bác sĩ, giáo viên, nhân viên...)', icon: Smile, color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/30', prompt: 'Nhập vai hoàn toàn vào nhân vật (Ví dụ: Bác sĩ). Xưng hô và giao tiếp chuẩn theo vai trò được giao trong suốt phiên Live.' },
];

const VIDEO_CATEGORIES = [
  { id: 'greeting', name: 'Greeting', desc: 'Chào hỏi khi có Follow/Comment' },
  { id: 'gift', name: 'Gift', desc: 'Video cảm ơn khi nhận quà' },
  { id: 'dance', name: 'Dance', desc: 'Nhảy khi đạt target/quà lớn' },
  { id: 'story', name: 'Story/Content', desc: 'Video nội dung chính (kể chuyện, chia sẻ)' },
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

export default function LivestreamAISetup() {
  const [activeStep, setActiveStep] = useState(2); // Default to step 2
  const [selectedBrain, setSelectedBrain] = useState('story');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [step3Tab, setStep3Tab] = useState('lipsync'); // 'lipsync', 'library', 'priority'
  const [emotion, setEmotion] = useState(70);

  // Lipsync states (Migrated from WorkspaceTacVu)
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

  // Update System Prompt when selected brain changes
  useEffect(() => {
    const pack = BRAIN_PACKS.find(p => p.id === selectedBrain);
    if (pack) {
      setSystemPrompt(SYSTEM_PROMPT_TEMPLATE + `\n[LUỒNG HOẠT ĐỘNG: ${pack.name}]\n` + pack.prompt);
    }
  }, [selectedBrain]);

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
            <div className="inline-block px-3 py-1 bg-white/5 text-white rounded-full text-[10px] font-bold mb-3 border border-white/10">
              Live Setup
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight">
              Setup phiên <span className="text-[#00FF66]">Live</span>
            </h1>
            <p className="text-sm text-gray-400 font-medium max-w-lg leading-relaxed mb-8">
              Chuẩn bị nhân vật, bộ não và kịch bản trên web. Khi đã sẵn sàng, tải file import để đưa vào phần mềm điều khiển — không cần API token ở bước này.
            </p>
         </div>

         <div className="w-full md:w-[380px] relative z-10 flex flex-col gap-3">
            <div className="flex justify-between items-center mb-1">
               <span className="text-xs font-bold text-white">Ứng dụng desktop</span>
               <span className="text-[10px] text-gray-400">Windows • tải từ trang chính thức</span>
            </div>
            
            <button className="flex items-center gap-4 p-4 rounded-xl bg-black/40 border border-white/10 hover:bg-white/5 hover:border-[#00FF66]/50 transition-all group text-left">
               <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                 <Monitor className="w-5 h-5 text-white" />
               </div>
               <div className="flex-1">
                 <div className="text-sm font-bold text-white mb-0.5 group-hover:text-blue-400 transition-colors">Tải AIDOL Live</div>
                 <div className="text-[10px] text-gray-400">Phát nhân vật và nội dung đã đồng bộ</div>
               </div>
               <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-gray-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                 <Download className="w-3 h-3" />
               </div>
            </button>
         </div>
      </div>

      {/* Stepper Console */}
      <div>
         <div className="flex justify-between items-center mb-3 px-2">
           <div>
             <div className="text-[10px] font-black text-[#00FF66] uppercase tracking-widest mb-1">LIVE SETUP CONSOLE</div>
             <h2 className="text-lg font-bold text-white">Thiết lập phiên theo từng lớp</h2>
           </div>
           <span className="text-[10px] font-bold text-gray-400">Lưu tự động theo AIDOL đang chọn</span>
         </div>

         <div className="bg-[#121216]/80 rounded-2xl border border-white/10 shadow-lg p-2 flex flex-col md:flex-row gap-2 mb-6">
            <button onClick={() => setActiveStep(1)} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${activeStep === 1 ? 'bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/30 shadow-glow-green' : 'text-gray-400 hover:bg-white/5 border border-transparent'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${activeStep === 1 ? 'bg-[#00FF66] text-black' : 'bg-white/5 text-gray-400'}`}>01</div>
              Nhân vật
            </button>
            <button onClick={() => setActiveStep(2)} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${activeStep === 2 ? 'bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/30 shadow-glow-green' : 'text-gray-400 hover:bg-white/5 border border-transparent'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${activeStep === 2 ? 'bg-[#00FF66] text-black' : 'bg-white/5 text-gray-400'}`}>02</div>
              Bộ não AI
            </button>
            <button onClick={() => setActiveStep(3)} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${activeStep === 3 ? 'bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/30 shadow-glow-green' : 'text-gray-400 hover:bg-white/5 border border-transparent'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${activeStep === 3 ? 'bg-[#00FF66] text-black' : 'bg-white/5 text-gray-400'}`}>03</div>
              Nội dung & Kho
            </button>
            <button onClick={() => setActiveStep(4)} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${activeStep === 4 ? 'bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/30 shadow-glow-green' : 'text-gray-400 hover:bg-white/5 border border-transparent'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${activeStep === 4 ? 'bg-[#00FF66] text-black' : 'bg-white/5 text-gray-400'}`}>04</div>
              Chốt đơn & Ghim
            </button>
         </div>

         {/* Step Content */}
         <div className="bg-[#121216]/60 backdrop-blur-md rounded-2xl border border-white/10 p-6 md:p-8 shadow-lg">
            
            {/* STEP 1 */}
            {activeStep === 1 && (
              <div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                  <div>
                    <span className="inline-block px-3 py-1 bg-[#00FF66]/10 text-[#00FF66] rounded-full text-[10px] font-bold mb-3 border border-[#00FF66]/20">Bước 1 • Nhân vật của phiên</span>
                    <h3 className="text-2xl font-black text-white mb-2">Chọn AIDOL tham gia phiên Live</h3>
                    <p className="text-sm text-gray-400 font-medium max-w-xl">AIDOL là hồ sơ gốc của phiên bao gồm ngoại hình và giọng mặc định. Bạn cần chọn AIDOL đã tạo từ thư viện.</p>
                  </div>
                </div>
                <div className="py-16 text-center border-2 border-dashed border-white/10 rounded-xl bg-black/40">
                  <UserSquare2 className="w-12 h-12 text-[#00FF66] mx-auto mb-3" />
                  <h3 className="text-xl font-black text-white mb-2">Đã chọn: Ngọc Huyền (AIDOL)</h3>
                  <p className="text-sm text-gray-500 font-medium mb-6">Nhân vật đã sẵn sàng. Chuyển sang Bước 2 để cấu hình não bộ AI.</p>
                  <button onClick={() => setActiveStep(2)} className="px-6 py-2.5 bg-[#00FF66] text-black font-bold rounded-lg shadow-glow-green hover:bg-[#00CC52] transition-colors">
                    Tiếp tục: Bộ não AI
                  </button>
                </div>
              </div>
            )}
            
            {/* STEP 2: BỘ NÃO AI VÀ MASTER PROMPT */}
            {activeStep === 2 && (
              <div className="flex flex-col xl:flex-row gap-8">
                {/* Left Side: Mode Selection (Grid) */}
                <div className="flex-1">
                  <div className="mb-6">
                    <span className="inline-block px-3 py-1 bg-[#00FF66]/10 text-[#00FF66] rounded-full text-[10px] font-bold mb-3 border border-[#00FF66]/20">Bước 2 • Chủ đề & Master Prompt</span>
                    <h3 className="text-2xl font-black text-white mb-2">Hệ thống 16 Live Modes</h3>
                    <p className="text-sm text-gray-400 font-medium max-w-2xl">
                      Chọn chế độ phù hợp. AI sẽ tự động load kịch bản (Master Prompt) để điều hướng toàn bộ hành động, biểu cảm, video và ưu tiên trả lời comment trong suốt phiên.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8 h-[500px] overflow-y-auto custom-scrollbar pr-2 pb-4">
                    {BRAIN_PACKS.map(pack => (
                      <button 
                        key={pack.id}
                        onClick={() => setSelectedBrain(pack.id)}
                        className={`text-left p-4 rounded-xl border transition-all ${
                          selectedBrain === pack.id 
                            ? `bg-black/60 border-[#00FF66] shadow-[0_0_15px_rgba(0,255,102,0.15)]` 
                            : 'bg-black/20 border-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className="flex gap-4 items-center">
                          <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${pack.bg} ${pack.border} border`}>
                            <pack.icon className={`w-5 h-5 ${pack.color}`} />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white flex items-center gap-2">
                              {pack.name}
                              {selectedBrain === pack.id && <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66] shadow-glow-green"></span>}
                            </h4>
                            <p className="text-[10px] text-gray-400 mt-1 line-clamp-1">{pack.desc}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right Side: System Prompt Editor & Options */}
                <div className="w-full xl:w-[450px] flex flex-col gap-4">
                  <div className="bg-black/40 rounded-2xl border border-white/10 p-5 flex flex-col h-[400px]">
                     <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                       <FileText className="w-4 h-4 text-[#00FF66]" /> System Prompt (Chỉnh sửa)
                     </h4>
                     <p className="text-[10px] text-gray-400 mb-3">
                       Khung này chứa "Master Prompt" điều khiển não bộ AI. Bạn có thể tự do thêm thắt quy tắc, thông tin hoặc luật cấm ngôn tùy ý.
                     </p>
                     <textarea 
                       value={systemPrompt}
                       onChange={(e) => setSystemPrompt(e.target.value)}
                       className="w-full flex-1 bg-[#121216] border border-white/10 rounded-xl p-4 text-xs font-mono text-gray-300 focus:border-[#00FF66] outline-none resize-none custom-scrollbar leading-relaxed"
                     ></textarea>
                  </div>

                  <div className="p-5 bg-black/40 rounded-2xl border border-white/10">
                    <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                      <Settings2 className="w-4 h-4 text-[#00FF66]" /> Tuỳ chỉnh Mở rộng
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-300 mb-2">Phong cách giao tiếp bổ sung</label>
                        <select className="w-full bg-[#121216] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#00FF66] outline-none">
                          <option>Chuẩn theo Master Prompt</option>
                          <option>Trang trọng, lịch sự hơn</option>
                          <option>Lầy lội, hài hước hơn</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-300 mb-2">
                          Mức độ Cảm xúc (Emotion: {emotion}%)
                        </label>
                        <input 
                           type="range" min="0" max="100" step="10" value={emotion} 
                           onChange={(e) => setEmotion(parseInt(e.target.value))}
                           className="w-full accent-[#00FF66] mb-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer mt-1" 
                         />
                         <div className="flex justify-between text-[10px] text-gray-500 font-bold mt-1">
                           <span>Bình tĩnh tĩnh tâm</span>
                           <span>Sôi nổi năng động</span>
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: TẠO VIDEO NHÉP MÔI (LIPSYNC) */}
            {activeStep === 3 && (
              <div className="flex flex-col h-full">
                <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <span className="inline-block px-3 py-1 bg-[#00FF66]/10 text-[#00FF66] rounded-full text-[10px] font-bold mb-3 border border-[#00FF66]/20">Bước 3 • Tạo Video & Phát Live</span>
                    <h3 className="text-2xl font-black text-white mb-2">Ghép Video Nhép Môi (Lipsync)</h3>
                    <p className="text-sm text-gray-400 font-medium max-w-2xl">
                      Lồng ghép video mẫu và lời thoại/âm thanh để tạo thành video hoàn chỉnh sẵn sàng cho Livestream.
                    </p>
                  </div>
                  <div className="flex bg-black/40 p-1 rounded-xl border border-white/10">
                    <button onClick={() => setStep3Tab('lipsync')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${step3Tab === 'lipsync' ? 'bg-[#00FF66]/20 text-[#00FF66]' : 'text-gray-400 hover:text-white'}`}>
                      <Video className="w-4 h-4" /> Tạo Video
                    </button>
                    <button onClick={() => setStep3Tab('library')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${step3Tab === 'library' ? 'bg-[#00FF66]/20 text-[#00FF66]' : 'text-gray-400 hover:text-white'}`}>
                      <ImageIcon className="w-4 h-4" /> Kho Lưu Trữ
                    </button>
                    <button onClick={() => setStep3Tab('priority')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${step3Tab === 'priority' ? 'bg-[#00FF66]/20 text-[#00FF66]' : 'text-gray-400 hover:text-white'}`}>
                      <ListOrdered className="w-4 h-4" /> Luật Event
                    </button>
                  </div>
                </div>

                {step3Tab === 'lipsync' && (
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
                             <Mic2 className="w-4 h-4 text-[#00FF66]" /> 2. Âm thanh đầu vào
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

                           {lipsyncAudioType === 'text' && (
                              <div className="text-[10px] text-gray-500 font-medium px-1 mt-2">
                                 Giọng đọc đang chọn: <span className="text-[#00FF66] font-bold">VBee - Miền Bắc (Nữ)</span>
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
                        
                        <div className="flex-1 border border-white/10 rounded-xl overflow-hidden bg-black/40 flex flex-col min-h-[250px]">
                           {showPreviewPlayer ? (
                              <>
                                 <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden group">
                                   {/* Mock Video Element */}
                                   <div className="absolute inset-0 bg-cover bg-center opacity-80" style={{backgroundImage: `url('https://images.unsplash.com/photo-1594751543129-6701ad444259?w=800&q=80')`}}></div>
                                   <div className="w-16 h-16 rounded-full bg-[#00FF66]/20 backdrop-blur-md flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-glow-green relative z-10 group-hover:bg-[#00FF66]/90 group-hover:text-black text-[#00FF66]">
                                     <Play className="w-6 h-6 ml-1" />
                                   </div>
                                 </div>
                                 <div className="p-3 bg-[#0B0E14] border-t border-white/10 flex justify-between items-center">
                                    <div className="text-[10px] text-gray-400 font-mono">00:00 / 00:15</div>
                                    <button className="text-[10px] font-bold px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-white transition-colors flex items-center gap-2">
                                       <Download className="w-3 h-3" /> Tải MP4
                                    </button>
                                 </div>
                              </>
                           ) : (
                              <div className="text-center p-6 flex-1 flex flex-col items-center justify-center">
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
                           <button onClick={() => setActiveStep(4)} className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                             Bước tiếp theo: Phát Live <ArrowRight className="w-4 h-4" />
                           </button>
                        </div>
                     </div>
                  </div>
                )}

                {step3Tab === 'library' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {VIDEO_CATEGORIES.map(cat => (
                      <div key={cat.id} className="bg-black/40 border border-white/10 rounded-2xl p-5 flex flex-col h-full hover:border-[#00FF66]/30 transition-colors group">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-bold text-white text-sm group-hover:text-[#00FF66] transition-colors">{cat.name}</h4>
                            <p className="text-[10px] text-gray-500 mt-1">{cat.desc}</p>
                          </div>
                          <span className="text-[10px] font-black bg-white/10 text-white px-2 py-1 rounded">0 video</span>
                        </div>
                        <div className="mt-auto pt-4 border-t border-white/5">
                          <button className="w-full py-2.5 rounded-lg border border-dashed border-white/20 text-gray-400 text-xs font-bold hover:border-[#00FF66] hover:text-[#00FF66] hover:bg-[#00FF66]/5 transition-all flex items-center justify-center gap-2">
                            <Upload className="w-4 h-4" /> Tải lên thư mục này
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {step3Tab === 'priority' && (
                  <div className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden">
                    <div className="p-5 border-b border-white/10 bg-black/60">
                      <h4 className="font-bold text-white text-sm">Event Priority Queue</h4>
                      <p className="text-[11px] text-gray-400 mt-1">Mọi sự kiện được xếp hàng theo mức ưu tiên để tránh nói chồng lên nhau.</p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead>
                          <tr className="bg-white/5 text-gray-400 text-[10px] uppercase tracking-wider">
                            <th className="p-4 font-bold w-20 text-center">Ưu tiên</th>
                            <th className="p-4 font-bold">Sự kiện (Event)</th>
                            <th className="p-4 font-bold">Hành động của AI</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {EVENT_PRIORITIES.map((item, i) => (
                            <tr key={i} className="hover:bg-white/5 transition-colors">
                              <td className="p-4 text-center">
                                <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-black ${item.p === 1 ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-gray-400'}`}>
                                  {item.p}
                                </span>
                              </td>
                              <td className="p-4 font-bold text-gray-300">{item.event}</td>
                              <td className="p-4 text-gray-400">{item.action}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 4: PHÁT LIVE & BÁN HÀNG */}
            {activeStep === 4 && (
              <div className="py-12 flex flex-col items-center">
                 <div className="w-20 h-20 rounded-3xl bg-purple-500/10 border border-purple-500/30 shadow-glow-purple flex items-center justify-center mb-6 relative group cursor-pointer" onClick={() => setShowBroadcastModal(true)}>
                    <Monitor className="w-10 h-10 text-purple-400 group-hover:scale-110 transition-transform" />
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-bold px-2 py-1 rounded-full animate-pulse">LIVE</div>
                 </div>
                 
                 <h3 className="text-2xl font-black text-white mb-3">Truyền luồng sang Live Studio</h3>
                 <p className="text-sm text-gray-400 font-medium max-w-md text-center mb-8">
                   Video nhép môi của bạn đã sẵn sàng. Hãy bấm nút Truyền Broadcast để mở cửa sổ Sạch (Clean Window) dùng cho OBS hoặc TikTok Live Studio.
                 </p>
                 
                 <div className="flex gap-4 mb-12">
                   <button onClick={() => setShowBroadcastModal(true)} className="px-8 py-3 bg-purple-500 hover:bg-purple-600 text-white font-black rounded-xl shadow-glow-purple flex items-center gap-2 transition-colors">
                     <Monitor className="w-5 h-5" /> Mở cửa sổ Broadcast
                   </button>
                 </div>

                 <div className="w-full max-w-2xl border-t border-white/10 pt-10 text-left flex gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-[#00FF66]/10 border border-[#00FF66]/30 shadow-glow-green flex items-center justify-center flex-shrink-0">
                       <Package className="w-6 h-6 text-[#00FF66]" />
                    </div>
                    <div>
                       <h4 className="text-lg font-black text-white mb-2">Cấu hình giỏ hàng & Ghim sản phẩm (Auto Pin)</h4>
                       <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                         Để AI tự động ghim sản phẩm khi nhắc đến tên hoặc mã sản phẩm trong kịch bản, bạn cần kết nối ứng dụng AIDOL AutoPin.
                       </p>
                       <button className="px-5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-lg transition-colors text-xs">
                         Tải AIDOL AutoPin
                       </button>
                    </div>
                 </div>
              </div>
            )}
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
                 <div className="text-xs text-gray-400 font-mono">Trạng thái: <span className="text-[#00FF66] font-bold">Sẵn sàng phát video...</span></div>
                 <div className="flex gap-2">
                   <button className="px-4 py-2 bg-white/5 text-gray-300 hover:text-white rounded-lg text-xs font-bold transition-colors">Tải MP4</button>
                   <button className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-xs font-black shadow-glow-purple flex items-center gap-2">
                      <Play className="w-4 h-4" /> Bắt đầu Auto Phát
                   </button>
                 </div>
              </div>
           </div>
        </div>
      )}

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
                     <p className="text-[10px] text-gray-400">Chọn kịch bản / audio đã được Gen bằng ChatGPT hoặc Gemini</p>
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
                   { id: 2, name: 'Bản tin Crypto cập nhật tối', type: 'text', chars: '1200 từ', ai: 'Gemini 1.5 Pro', time: '1 giờ trước' },
                   { id: 3, name: 'Review Son môi Mac 2026', type: 'audio', duration: '00:45', ai: 'Gemini 1.5 Flash', time: 'Hôm qua' },
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
