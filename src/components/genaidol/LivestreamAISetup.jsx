import React, { useState } from 'react';
import { 
  Download, Monitor, ArrowRight, UserSquare2, Cpu, Package, Plus, 
  BookOpen, MessageCircle, Music, ShoppingCart, GraduationCap, Gamepad2,
  Settings2, Upload, Video, ListOrdered
} from 'lucide-react';

const BRAIN_PACKS = [
  { id: 'story', name: 'Story Brain', desc: 'Kể chuyện, phân tích nội dung, trả lời câu hỏi liên quan đến câu chuyện.', icon: BookOpen, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
  { id: 'talk', name: 'Talk Brain', desc: 'Giao lưu, trò chuyện, hỏi đáp tự do với người xem.', icon: MessageCircle, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
  { id: 'entertainment', name: 'Entertainment Brain', desc: 'Nhảy, hát, tạo không khí vui vẻ năng động.', icon: Music, color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/30' },
  { id: 'sales', name: 'Sales Brain', desc: 'Giới thiệu sản phẩm, xử lý phản đối, chốt đơn.', icon: ShoppingCart, color: 'text-[#00FF66]', bg: 'bg-[#00FF66]/10', border: 'border-[#00FF66]/30' },
  { id: 'education', name: 'Education Brain', desc: 'Chia sẻ kiến thức, hướng dẫn, đào tạo bài bản.', icon: GraduationCap, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
  { id: 'game', name: 'Game Brain', desc: 'Tổ chức trò chơi, đố vui, tương tác giữ chân người xem.', icon: Gamepad2, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
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
  const [activeStep, setActiveStep] = useState(2); // Default to step 2 for demo purposes
  const [selectedBrain, setSelectedBrain] = useState('sales');
  const [step3Tab, setStep3Tab] = useState('library'); // 'library' | 'priority'
  const [emotion, setEmotion] = useState(70);

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 text-white pb-24">
      
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
            
            {/* STEP 1: NHÂN VẬT */}
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
            
            {/* STEP 2: BỘ NÃO AI */}
            {activeStep === 2 && (
              <div>
                <div className="mb-8">
                  <span className="inline-block px-3 py-1 bg-[#00FF66]/10 text-[#00FF66] rounded-full text-[10px] font-bold mb-3 border border-[#00FF66]/20">Bước 2 • Chủ đề & Tư duy</span>
                  <h3 className="text-2xl font-black text-white mb-2">Hệ thống bộ não theo chủ đề (Brain Pack)</h3>
                  <p className="text-sm text-gray-400 font-medium max-w-2xl">
                    Mỗi phiên Live sẽ nạp một "Brain Pack" riêng biệt để AI biết cách ứng xử, trả lời comment và điều hướng kịch bản. Chọn bộ não phù hợp nhất với mục tiêu của bạn hôm nay.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {BRAIN_PACKS.map(pack => (
                    <button 
                      key={pack.id}
                      onClick={() => setSelectedBrain(pack.id)}
                      className={`text-left p-5 rounded-2xl border transition-all ${
                        selectedBrain === pack.id 
                          ? `bg-black/60 border-[#00FF66] shadow-[0_0_15px_rgba(0,255,102,0.15)]` 
                          : 'bg-black/20 border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl mb-4 flex items-center justify-center ${pack.bg} ${pack.border} border`}>
                        <pack.icon className={`w-5 h-5 ${pack.color}`} />
                      </div>
                      <h4 className="text-base font-bold text-white mb-1.5 flex items-center justify-between">
                        {pack.name}
                        {selectedBrain === pack.id && <span className="w-2 h-2 rounded-full bg-[#00FF66] shadow-glow-green"></span>}
                      </h4>
                      <p className="text-[11px] text-gray-400 leading-relaxed font-medium line-clamp-2">{pack.desc}</p>
                    </button>
                  ))}
                </div>

                <div className="p-6 bg-black/40 rounded-2xl border border-white/10">
                  <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                    <Settings2 className="w-4 h-4 text-[#00FF66]" /> Tuỳ chỉnh Brain Pack
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-300 mb-2">Phong cách nói</label>
                      <select className="w-full bg-[#121216] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#00FF66] outline-none">
                        <option>Vui vẻ, năng động (Mặc định)</option>
                        <option>Trang trọng, chuyên nghiệp</option>
                        <option>Nhẹ nhàng, tâm tình</option>
                        <option>Hài hước, lầy lội</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-300 mb-2">
                        Độ cảm xúc (Emotion: {emotion}%)
                      </label>
                      <input 
                         type="range" min="0" max="100" step="10" value={emotion} 
                         onChange={(e) => setEmotion(parseInt(e.target.value))}
                         className="w-full accent-[#00FF66] mb-2 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer mt-2" 
                       />
                       <div className="flex justify-between text-[10px] text-gray-500 font-bold">
                         <span>Bình tĩnh</span>
                         <span>Cảm xúc mạnh</span>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: NỘI DUNG VÀ KHO VIDEO */}
            {activeStep === 3 && (
              <div>
                <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <span className="inline-block px-3 py-1 bg-[#00FF66]/10 text-[#00FF66] rounded-full text-[10px] font-bold mb-3 border border-[#00FF66]/20">Bước 3 • Thư viện Video & Luật</span>
                    <h3 className="text-2xl font-black text-white mb-2">Video Library & Event Engine</h3>
                    <p className="text-sm text-gray-400 font-medium max-w-2xl">
                      Không phải AI tạo video ngay lúc Live mà sẽ chọn video từ kho chuẩn bị sẵn để ghép mồm (Lip Sync). Vui lòng upload video theo đúng hạng mục.
                    </p>
                  </div>
                  <div className="flex bg-black/40 p-1 rounded-xl border border-white/10">
                    <button onClick={() => setStep3Tab('library')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${step3Tab === 'library' ? 'bg-[#00FF66]/20 text-[#00FF66]' : 'text-gray-400 hover:text-white'}`}>
                      <Video className="w-4 h-4" /> Kho Video
                    </button>
                    <button onClick={() => setStep3Tab('priority')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${step3Tab === 'priority' ? 'bg-[#00FF66]/20 text-[#00FF66]' : 'text-gray-400 hover:text-white'}`}>
                      <ListOrdered className="w-4 h-4" /> Priority
                    </button>
                  </div>
                </div>

                {step3Tab === 'library' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {VIDEO_CATEGORIES.map(cat => (
                      <div key={cat.id} className="bg-black/40 border border-white/10 rounded-2xl p-5 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-bold text-white text-sm">{cat.name}</h4>
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

            {/* STEP 4: CHỐT ĐƠN */}
            {activeStep === 4 && (
              <div className="py-24 text-center">
                 <div className="w-16 h-16 rounded-2xl bg-[#00FF66]/10 border border-[#00FF66]/30 shadow-glow-green flex items-center justify-center mx-auto mb-4">
                    <Package className="w-8 h-8 text-[#00FF66]" />
                 </div>
                 <h3 className="text-xl font-black text-white mb-2">Cấu hình giỏ hàng & Ghim sản phẩm</h3>
                 <p className="text-sm text-gray-400 font-medium max-w-sm mx-auto mb-6">Sử dụng ứng dụng AIDOL AutoPin để tự động ghim sản phẩm khi AI nhắc đến tên hoặc mã sản phẩm.</p>
                 <button className="px-6 py-2.5 bg-white/5 border border-white/10 text-white font-bold rounded-lg hover:bg-white/10 transition-colors">
                   Tải AIDOL AutoPin
                 </button>
              </div>
            )}
         </div>
      </div>
    </div>
  );
}
