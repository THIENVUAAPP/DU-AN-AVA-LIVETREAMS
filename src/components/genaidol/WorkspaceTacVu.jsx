import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, MessageCircle, Plus, Gift, Clock, Megaphone, 
  Hand, ShoppingCart, Share, Sparkles, Mic, Heart, Play, HelpCircle
} from 'lucide-react';

const EVENTS = [
  { id: 'apology', label: 'Xin lỗi', icon: CheckSquare, color: 'text-green-500', desc: 'Cấu hình phản ứng của Aldol khi nó không hiểu một bình luận hoặc gặp phải lỗi không mong muốn.' },
  { id: 'comment', label: 'Bình luận', icon: MessageCircle, color: 'text-gray-400', desc: 'Aldol sẽ tự động đọc và trả lời các bình luận của người xem trên phiên live.' },
  { id: 'follow', label: 'Theo dõi', icon: Plus, color: 'text-purple-600', desc: 'Aldol sẽ gửi lời cảm ơn đặc biệt mỗi khi có người xem mới nhấn theo dõi kênh của bạn, giúp tăng tỷ lệ chuyển đổi người xem thành người theo dõi.' },
  { id: 'gift', label: 'Quà tặng (Thường)', icon: Gift, color: 'text-yellow-500', desc: 'Aldol gửi lời cảm ơn khi nhận được quà tặng từ người xem.' },
  { id: 'idle', label: 'Im lặng (Chờ)', icon: Clock, color: 'text-orange-500', desc: 'Cấu hình các hành động của Aldol khi ở trạng thái chờ, không có sự kiện nào cần xử lý.' },
  { id: 'call_to_action', label: 'Kêu gọi tương tác', icon: Megaphone, color: 'text-red-500', desc: 'Aldol chủ động kêu gọi mọi người thả tim, share, follow.' },
  { id: 'welcome', label: 'Chào người mới', icon: Hand, color: 'text-yellow-500', desc: 'Chào mừng những người xem mới tham gia vào phiên live.' },
  { id: 'checkout', label: 'Chốt đơn', icon: ShoppingCart, color: 'text-blue-500', desc: 'Aldol sẽ thực hiện các câu kêu gọi mua hàng, chốt đơn khi có người hỏi mua.' },
  { id: 'share', label: 'Chia sẻ', icon: Share, color: 'text-blue-400', desc: 'Cảm ơn người xem đã chia sẻ phiên live.' },
  { id: 'special_gift', label: 'Quà tặng Đặc biệt', icon: Sparkles, color: 'text-yellow-500', desc: 'Phản ứng đặc biệt khi nhận được các món quà có giá trị cao.' },
  { id: 'talking', label: 'Nói chuyện (AI)', icon: Mic, color: 'text-gray-500', desc: 'Giúp livestream không bị "chết". Aldol sẽ tự động bắt chuyện khi không có sự kiện nào xảy ra trong một khoảng thời gian dài.' },
  { id: 'thanks_heart', label: 'Cảm ơn Tim', icon: Heart, color: 'text-red-500', desc: 'Cảm ơn khi người xem thả tim cho phiên live.' }
];

export default function WorkspaceTacVu() {
  const [selectedEventId, setSelectedEventId] = useState('apology');
  
  // State to hold configuration for all events
  const [eventConfigs, setEventConfigs] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem('aidol_event_configs');
    if (saved) {
      try {
        setEventConfigs(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse event configs", e);
      }
    } else {
      // Default initial states
      const defaults = {};
      EVENTS.forEach(ev => {
        defaults[ev.id] = {
          priority: ev.id === 'apology' ? 20 : ev.id === 'comment' ? 50 : ev.id === 'follow' ? 70 : 50,
          active: true,
          useVoice: true,
          muteSourceVideo: true,
          videoCategory: ev.id,
          videoFolder: '',
          useAi: true,
          aiPrompt: '',
          sampleAnswers: '',
          assistantPrompt: '',
          assistantUseMainVoice: false,
          
          // Specific fields
          greetMinutes: ev.id === 'apology' ? 15 : '',
          waitBetweenEvents: ev.id === 'comment' ? 1 : ev.id === 'follow' ? 60 : '',
          replyRate: ev.id === 'comment' ? 70 : '',
          bannedWords: ev.id === 'comment' ? 'scam\ngiả' : '',
          priorityWords: ev.id === 'comment' ? 'mua\nbán' : '',
          smartSpamFilter: ev.id === 'comment' ? true : false,
          waitBetweenSpam: ev.id === 'comment' ? 3 : '',
          maxRepeatChars: ev.id === 'comment' ? 0.7 : '',
          speakAfterIdleSeconds: ev.id === 'idle' ? 5 : ''
        };
      });
      
      // Some hardcoded defaults based on screenshots
      defaults['apology'].sampleAnswers = "Cả nhà ơi, đôi khi bình luận và người tham gia mới đông quá em không chào hết được, có bỏ sót ai thì mọi người thông cảm cho em nhé. Yêu mọi người nhiều!\nMọi người thông cảm nha, nếu em có lỡ bỏ qua bình luận của ai thì nhắn lại giúp em với nhé, do nhiều tin nhắn quá em không xem kịp ạ.";
      defaults['comment'].aiPrompt = "### NHIỆM VỤ: Trả lời bình luận của người dùng tên {user}.";
      defaults['comment'].sampleAnswers = "Cảm ơn bạn {user} đã bình luận nhé!\nMình đã nhận được bình luận của {user} rồi ạ.";
      defaults['follow'].aiPrompt = "Hãy nói một câu cảm ơn bạn {user} đã theo dõi kênh.";
      defaults['follow'].sampleAnswers = "A, cảm ơn bạn {user} đã theo dõi mình. Yêu bạn!\nCảm ơn {user} đã follow kênh của mình nhé!";
      defaults['talking'].aiPrompt = "Bạn là một streamer AI, đang không có ai tương tác. Hãy chủ động nói một điều gì đó thật thú vị, đặt một câu hỏi mở, nói một cách hài hước...";
      defaults['talking'].sampleAnswers = "xin chào các bn\ncác bạn ơi nói chuyện đi";
      defaults['comment'].assistantPrompt = "A, có bạn {user} vừa mới bình luận là: {comment}";

      setEventConfigs(defaults);
    }
  }, []);

  const currentConfig = eventConfigs[selectedEventId] || {};

  const handleSave = () => {
    localStorage.setItem('aidol_event_configs', JSON.stringify(eventConfigs));
    alert('Đã lưu cấu hình sự kiện thành công!');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEventConfigs(prev => ({
      ...prev,
      [selectedEventId]: {
        ...prev[selectedEventId],
        [name]: type === 'checkbox' ? checked : value
      }
    }));
  };

  const selectFolder = async () => {
    try {
      if (window.showDirectoryPicker) {
        const dirHandle = await window.showDirectoryPicker();
        handleChange({ target: { name: 'videoFolder', value: dirHandle.name } });
      } else {
        const folderPath = prompt("Hãy nhập đường dẫn thư mục Video (VD: C:/Videos/):", "C:/Videos/");
        if (folderPath) {
          handleChange({ target: { name: 'videoFolder', value: folderPath } });
        }
      }
    } catch (e) {
      console.log('Folder selection cancelled or failed');
    }
  };

  const selectedEventInfo = EVENTS.find(e => e.id === selectedEventId);

  // Helper component for fields
  const FieldLabel = ({ icon, text, hasHelp = true }) => (
    <div className="flex items-center gap-1.5 text-[13px] font-semibold text-gray-700 min-w-[220px]">
      {icon && <span className="text-[#a53b3b]">{icon}</span>}
      <span>{text}:</span>
      {hasHelp && <HelpCircle size={14} className="text-blue-500 cursor-pointer ml-1" />}
    </div>
  );

  return (
    <div className="flex w-full h-[95vh] bg-[#f0f2f5] font-sans text-gray-800 overflow-hidden">
      
      {/* SIDEBAR */}
      <div className="w-[240px] bg-[#f0f2f5] border-r border-gray-300 flex flex-col h-full">
        <div className="p-3 border-b border-gray-300">
          <div className="border border-gray-300 rounded bg-white overflow-hidden shadow-sm h-[calc(95vh-24px)]">
            <div className="px-3 py-1.5 bg-[#e0e3e8] border-b border-gray-300 text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Sự kiện có sẵn
            </div>
            <div className="overflow-y-auto h-full pb-8">
              {EVENTS.map(ev => {
                const Icon = ev.icon;
                const isSelected = selectedEventId === ev.id;
                return (
                  <button
                    key={ev.id}
                    onClick={() => setSelectedEventId(ev.id)}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm transition-colors ${isSelected ? 'bg-[#d5e2f2]' : 'hover:bg-gray-100'}`}
                  >
                    <Icon size={16} className={`${ev.color}`} />
                    <span className={`font-medium ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>{ev.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#f0f2f5] p-3">
        
        {/* Header Info Box */}
        <div className="bg-[#e6f0fa] border border-[#b3d4f5] rounded-md p-3 mb-3">
          <p className="text-[13px] text-gray-800 mb-2">
            <span className="font-bold">{selectedEventInfo?.label}: </span>
            {selectedEventInfo?.desc}
          </p>
          <button className="flex items-center gap-1.5 text-[13px] font-bold text-[#14539a] hover:underline">
            <Play size={14} fill="currentColor" /> Xem video hướng dẫn cấu hình
          </button>
        </div>

        {/* Scrollable Config Area */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          
          {/* Cấu hình Chung */}
          <div className="border border-gray-300 rounded-md bg-white mb-3 shadow-sm">
            <div className="relative px-3 py-4">
              <fieldset className="border border-gray-300 rounded p-4 pt-6 mt-2 relative">
                <legend className="absolute -top-3 left-3 bg-white px-1 text-sm font-semibold text-gray-700 flex items-center gap-1">
                  Cấu hình Chung - <span className="text-[#a53b3b]"><selectedEventInfo.icon size={14} className={selectedEventInfo.color} /></span> {selectedEventInfo?.label}
                </legend>
                
                <div className="flex flex-col gap-3">
                  
                  {/* Common fields for all events */}
                  {currentConfig.videoCategory !== undefined && (
                    <div className="flex items-center">
                      <FieldLabel icon="🎥" text="Danh mục video" />
                      <input type="text" name="videoCategory" value={currentConfig.videoCategory} onChange={handleChange} className="flex-1 border border-gray-300 rounded px-2 py-1 text-[13px] bg-gray-50 focus:bg-white focus:outline-blue-500" />
                    </div>
                  )}

                  {currentConfig.priority !== undefined && (
                    <div className="flex items-center">
                      <FieldLabel icon="⭐" text="Độ ưu tiên" />
                      <input type="number" name="priority" value={currentConfig.priority} onChange={handleChange} className="flex-1 border border-gray-300 rounded px-2 py-1 text-[13px] bg-gray-50 focus:bg-white focus:outline-blue-500" />
                    </div>
                  )}

                  {currentConfig.active !== undefined && (
                    <div className="flex items-center">
                      <FieldLabel icon="✅" text="Kích hoạt" />
                      <input type="checkbox" name="active" checked={currentConfig.active} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded" />
                    </div>
                  )}

                  {currentConfig.useVoice !== undefined && selectedEventId !== 'talking' && selectedEventId !== 'idle' && (
                    <div className="flex items-center">
                      <FieldLabel icon="🗣️" text="Dùng giọng nói" />
                      <input type="checkbox" name="useVoice" checked={currentConfig.useVoice} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded" />
                    </div>
                  )}

                  {currentConfig.muteSourceVideo !== undefined && selectedEventId !== 'talking' && selectedEventId !== 'idle' && (
                    <div className="flex items-center">
                      <FieldLabel icon="🔇" text="Tắt âm gốc video" />
                      <input type="checkbox" name="muteSourceVideo" checked={currentConfig.muteSourceVideo} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded" />
                    </div>
                  )}

                  {currentConfig.useAi !== undefined && selectedEventId !== 'idle' && selectedEventId !== 'apology' && (
                    <div className="flex items-center">
                      <FieldLabel icon="🧠" text="Dùng AI trả lời" />
                      <input type="checkbox" name="useAi" checked={currentConfig.useAi} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded" />
                    </div>
                  )}

                  {/* Specific fields */}
                  {selectedEventId === 'apology' && (
                    <div className="flex items-center">
                      <FieldLabel icon="⏱️" text="Số phút để chào" />
                      <input type="number" name="greetMinutes" value={currentConfig.greetMinutes} onChange={handleChange} className="flex-1 border border-gray-300 rounded px-2 py-1 text-[13px] bg-gray-50 focus:bg-white focus:outline-blue-500" />
                    </div>
                  )}

                  {(selectedEventId === 'comment' || selectedEventId === 'follow') && (
                    <div className="flex items-center">
                      <FieldLabel icon="⏳" text={`Chờ giữa các ${selectedEventId === 'comment' ? 'comment' : 'follow'} (giây)`} />
                      <input type="number" name="waitBetweenEvents" value={currentConfig.waitBetweenEvents} onChange={handleChange} className="flex-1 border border-gray-300 rounded px-2 py-1 text-[13px] bg-gray-50 focus:bg-white focus:outline-blue-500" />
                    </div>
                  )}

                  {selectedEventId === 'comment' && (
                    <>
                      <div className="flex items-center">
                        <FieldLabel icon="📊" text="Tỷ lệ trả lời (%)" />
                        <input type="number" name="replyRate" value={currentConfig.replyRate} onChange={handleChange} className="flex-1 border border-gray-300 rounded px-2 py-1 text-[13px] bg-gray-50 focus:bg-white focus:outline-blue-500" />
                      </div>
                      <div className="flex items-start mt-1">
                        <FieldLabel icon="🚫" text="Từ khóa cấm" />
                        <textarea name="bannedWords" value={currentConfig.bannedWords} onChange={handleChange} className="flex-1 h-[60px] border border-gray-300 rounded p-2 text-[13px] resize-none bg-gray-50 focus:bg-white focus:outline-blue-500" />
                      </div>
                      <div className="flex items-start mt-1">
                        <FieldLabel icon="⭐" text="Từ khóa ưu tiên" />
                        <textarea name="priorityWords" value={currentConfig.priorityWords} onChange={handleChange} className="flex-1 h-[60px] border border-gray-300 rounded p-2 text-[13px] resize-none bg-gray-50 focus:bg-white focus:outline-blue-500" />
                      </div>
                      <div className="flex items-center mt-1">
                        <FieldLabel icon="🛡️" text="Bật bộ lọc spam thông minh" />
                        <input type="checkbox" name="smartSpamFilter" checked={currentConfig.smartSpamFilter} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded" />
                      </div>
                      <div className="flex items-center">
                        <FieldLabel icon="⏱️" text="Chờ giữa các comment spam (giây)" />
                        <input type="number" name="waitBetweenSpam" value={currentConfig.waitBetweenSpam} onChange={handleChange} className="flex-1 border border-gray-300 rounded px-2 py-1 text-[13px] bg-gray-50 focus:bg-white focus:outline-blue-500" />
                      </div>
                      <div className="flex items-center">
                        <FieldLabel icon="🔤" text="Tỷ lệ ký tự lặp lại tối đa (0.0-1.0)" />
                        <input type="number" step="0.1" name="maxRepeatChars" value={currentConfig.maxRepeatChars} onChange={handleChange} className="flex-1 border border-gray-300 rounded px-2 py-1 text-[13px] bg-gray-50 focus:bg-white focus:outline-blue-500" />
                      </div>
                    </>
                  )}

                  {selectedEventId === 'idle' && (
                    <div className="flex items-center">
                      <FieldLabel icon="⏱️" text="Tự nói sau (giây) im lặng" />
                      <input type="number" name="speakAfterIdleSeconds" value={currentConfig.speakAfterIdleSeconds} onChange={handleChange} className="flex-1 border border-gray-300 rounded px-2 py-1 text-[13px] bg-gray-50 focus:bg-white focus:outline-blue-500" />
                    </div>
                  )}

                  {currentConfig.aiPrompt !== undefined && selectedEventId !== 'idle' && selectedEventId !== 'apology' && (
                    <div className="flex items-start mt-2">
                      <FieldLabel icon="✍️" text="Kịch bản cho AI" />
                      <textarea name="aiPrompt" value={currentConfig.aiPrompt} onChange={handleChange} className="flex-1 min-h-[120px] border border-gray-300 rounded p-2 text-[13px] resize-none bg-gray-50 focus:bg-white focus:outline-blue-500" />
                    </div>
                  )}

                  {currentConfig.sampleAnswers !== undefined && selectedEventId !== 'idle' && (
                    <div className="flex items-start mt-2">
                      <FieldLabel icon="📄" text="Câu trả lời mẫu (mỗi câu 1 dòng)" />
                      <textarea name="sampleAnswers" value={currentConfig.sampleAnswers} onChange={handleChange} className="flex-1 min-h-[100px] border border-gray-300 rounded p-2 text-[13px] resize-none bg-gray-50 focus:bg-white focus:outline-blue-500" />
                    </div>
                  )}
                  
                  {selectedEventId === 'talking' && (
                    <>
                      <div className="flex items-center mt-2">
                        <FieldLabel icon="🗣️" text="Dùng giọng nói" />
                        <input type="checkbox" name="useVoice" checked={currentConfig.useVoice} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded" />
                      </div>
                      <div className="flex items-center">
                        <FieldLabel icon="🔇" text="Tắt âm gốc video" />
                        <input type="checkbox" name="muteSourceVideo" checked={currentConfig.muteSourceVideo} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded" />
                      </div>
                    </>
                  )}

                </div>
              </fieldset>
            </div>
          </div>

          {/* Cấu hình Video Chung */}
          <div className="border border-gray-300 rounded-md bg-white mb-3 shadow-sm px-3 py-4">
            <fieldset className="border border-gray-300 rounded p-4 pt-4 mt-2 relative">
              <legend className="absolute -top-3 left-3 bg-white px-1 text-sm font-semibold text-gray-700">
                Cấu hình Video Chung (Dự phòng)
              </legend>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-4">
                  <span className="text-[13px] text-[#a53b3b] font-semibold min-w-[200px]">Danh mục video cho sự kiện này:</span>
                  <select name="videoCategory" value={currentConfig.videoCategory} onChange={handleChange} className="flex-1 border border-gray-300 rounded px-2 py-1 text-[13px] bg-white focus:outline-blue-500">
                    <option value={selectedEventId}>{selectedEventId}</option>
                  </select>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-3">
                  <div className="flex items-center gap-4">
                    <span className="text-[13px] text-[#a53b3b] font-semibold min-w-[200px]">Thư mục video tương ứng:</span>
                    <span className="text-[13px] text-gray-800 font-medium">{currentConfig.videoFolder || 'Chưa chọn thư mục'}</span>
                  </div>
                  <button onClick={selectFolder} className="text-[13px] text-gray-600 font-medium hover:text-gray-900 transition-colors underline decoration-dotted">
                    Chọn thư mục...
                  </button>
                </div>
              </div>
            </fieldset>
          </div>

          {/* Cài đặt Trợ lý */}
          <div className="border border-gray-300 rounded-md bg-white shadow-sm px-3 py-4 mb-4">
            <fieldset className="border border-gray-300 rounded p-4 pt-4 mt-2 relative">
              <legend className="absolute -top-3 left-3 bg-white px-1 text-sm font-semibold text-gray-700 flex items-center gap-2">
                <input type="checkbox" className="w-3.5 h-3.5" checked readOnly />
                Cài đặt Trợ lý
              </legend>
              <div className="flex flex-col gap-2">
                <label className="text-[13px] text-gray-700 font-semibold">Câu mẫu của Trợ lý:</label>
                <textarea 
                  name="assistantPrompt" value={currentConfig.assistantPrompt} onChange={handleChange}
                  className="w-full h-[80px] border border-gray-300 rounded p-2 text-[13px] resize-none bg-gray-50 focus:bg-white focus:outline-blue-500" 
                />
                <label className="flex items-center gap-2 justify-center mt-2">
                  <input type="checkbox" name="assistantUseMainVoice" checked={currentConfig.assistantUseMainVoice} onChange={handleChange} className="w-4 h-4 rounded" />
                  <span className="text-[13px] text-gray-600 font-medium">Dùng giọng của nhân vật chính</span>
                </label>
              </div>
            </fieldset>
          </div>
        </div>

        {/* Footer Save Button */}
        <div className="mt-3">
          <button 
            onClick={handleSave}
            className="w-full py-3 bg-[#4caf50] hover:bg-[#43a047] text-white font-bold rounded shadow transition-colors text-[14px] uppercase tracking-wide"
          >
            Lưu thay đổi cho sự kiện này
          </button>
        </div>

      </div>
    </div>
  );
}
