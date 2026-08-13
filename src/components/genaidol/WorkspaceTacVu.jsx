import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, MessageCircle, Plus, Gift, Clock, Megaphone, 
  Hand, ShoppingCart, Share, Sparkles, Mic, Heart, Play, HelpCircle, ChevronDown
} from 'lucide-react';

const EVENTS = [
  { id: 'checkout', label: 'Chốt đơn', icon: ShoppingCart, color: 'text-blue-500', desc: 'Aldol sẽ thực hiện các câu kêu gọi mua hàng, chốt đơn khi có người hỏi mua.' },
  { id: 'special_gift', label: 'Quà tặng Đặc biệt', icon: Sparkles, color: 'text-yellow-500', desc: 'Tạo ra các phản ứng độc đáo và ấn tượng cho những món quà giá trị (Sư tử, Du thuyền...) để tri ân những người hâm mộ lớn.' },
  { id: 'gift', label: 'Quà tặng (Thường)', icon: Gift, color: 'text-yellow-500', desc: 'Cấu hình phản ứng chung của Aldol khi nhận được các món quà không được liệt kê trong mục "Quà tặng Đặc biệt".' },
  { id: 'comment', label: 'Bình luận', icon: MessageCircle, color: 'text-gray-400', desc: 'Aldol sẽ tự động đọc và trả lời các bình luận của người xem trên phiên live.' },
  { id: 'follow', label: 'Theo dõi', icon: Plus, color: 'text-purple-600', desc: 'Aldol sẽ gửi lời cảm ơn đặc biệt mỗi khi có người xem mới nhấn theo dõi kênh của bạn, giúp tăng tỷ lệ chuyển đổi người xem thành người theo dõi.' },
  { id: 'share', label: 'Chia sẻ', icon: Share, color: 'text-blue-400', desc: 'Cảm ơn người xem đã chia sẻ phiên live.' },
  { id: 'thanks_heart', label: 'Cảm ơn Tim', icon: Heart, color: 'text-red-500', desc: 'Cảm ơn khi người xem thả tim cho phiên live.' },
  { id: 'welcome', label: 'Chào người mới', icon: Hand, color: 'text-yellow-500', desc: 'Aldol sẽ gom nhóm và chào những người xem mới vào phòng sau một khoảng thời gian nhất định, tạo cảm giác thân thiện và được chào đón.' },
  { id: 'call_to_action', label: 'Kêu gọi tương tác', icon: Megaphone, color: 'text-red-500', desc: 'Aldol chủ động kêu gọi mọi người thả tim, share, follow.' },
  { id: 'talking', label: 'Nói chuyện (AI)', icon: Mic, color: 'text-gray-500', desc: 'Giúp livestream không bị "chết". Aldol sẽ tự động bắt chuyện khi không có sự kiện nào xảy ra trong một khoảng thời gian dài.' },
  { id: 'apology', label: 'Xin lỗi', icon: CheckSquare, color: 'text-green-500', desc: 'Cấu hình phản ứng của Aldol khi nó không hiểu một bình luận hoặc gặp phải lỗi không mong muốn.' },
  { id: 'idle', label: 'Im lặng (Chờ)', icon: Clock, color: 'text-orange-500', desc: 'Cấu hình các hành động của Aldol khi ở trạng thái chờ, không có sự kiện nào cần xử lý.' }
];

const GIFT_TYPES = ['Finger Heart', 'Cap', 'Confetti', 'Corgi', 'Crystal Rose', 'Crystal Shoe', "Cupid's Bow", "Don't cry", 'Doughnut', 'Encore Clap', 'Lucky pig', 'Lion', 'Yacht'];

export default function WorkspaceTacVu() {
  const [selectedEventId, setSelectedEventId] = useState('checkout');
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
      const defaults = {};
      EVENTS.forEach(ev => {
        defaults[ev.id] = {
          priority: ev.id === 'apology' ? 20 : ev.id === 'comment' ? 50 : ev.id === 'follow' ? 70 : ev.id === 'gift' ? 90 : ev.id === 'welcome' ? 60 : ev.id === 'special_gift' ? 999 : ev.id === 'checkout' ? 100 : ev.id === 'share' ? 50 : ev.id === 'thanks_heart' ? 15 : 50,
          active: ev.id !== 'welcome' && ev.id !== 'share' && ev.id !== 'thanks_heart', 
          useVoice: ev.id !== 'gift' && ev.id !== 'welcome',
          muteSourceVideo: ev.id !== 'gift' && ev.id !== 'welcome',
          videoCategory: ev.id === 'welcome' ? 'join' : ev.id === 'call_to_action' ? 'interaction' : ev.id === 'thanks_heart' ? 'thank_for_likes' : ev.id,
          videoFolder: '',
          useAi: ev.id !== 'gift',
          aiPrompt: '',
          sampleAnswers: '',
          assistantPrompt: '',
          assistantUseMainVoice: false,
          
          greetMinutes: ev.id === 'apology' || ev.id === 'welcome' ? 1 : '',
          waitBetweenEvents: ev.id === 'comment' ? 1 : ev.id === 'follow' ? 60 : ev.id === 'gift' ? 0 : '',
          replyRate: ev.id === 'comment' ? 70 : '',
          bannedWords: ev.id === 'comment' ? 'scam\ngiả' : '',
          priorityWords: ev.id === 'comment' ? 'mua\nbán' : '',
          smartSpamFilter: ev.id === 'comment' ? true : false,
          waitBetweenSpam: ev.id === 'comment' ? 3 : '',
          maxRepeatChars: ev.id === 'comment' ? 0.7 : '',
          speakAfterIdleSeconds: ev.id === 'idle' ? 5 : '',
          likeThreshold: ev.id === 'thanks_heart' ? 10 : '',
          
          // Special gifts
          specialGiftSlots: ev.id === 'special_gift' ? [
            { id: 1, active: true, giftName: 'Finger Heart', videoFolder: '', useTTS: false, muteSourceVideo: false, useAssistant: true, assistantPrompt: '', assistantVideoFolder: '', useMainVoice: true },
            { id: 2, active: true, giftName: 'Lucky pig', videoFolder: '', useTTS: false, muteSourceVideo: false, useAssistant: false, assistantPrompt: '', assistantVideoFolder: '', useMainVoice: true }
          ] : [],

          // Checkout Products
          checkoutProducts: ev.id === 'checkout' ? [
            { id: 1, active: true, productName: 'aidol', keywords: 'aidol;phần mềm;giá;liên hệ', videoFolder: 'bình luận', useAi: true, useTTS: false, muteSourceVideo: true, aiPrompt: 'TRong vai là một nhân viên sale chuyên nghiệp hãy đọc bình luận và đem ra câu trả lời để chốt đơn, giá phần mềm là 3 triệu rưỡi/1 năm, hoặc gói dùng thử là 500000 đồng trên 1 tháng. Chốt sale hoặc cần tư vấn thêm thì hãy liên hệ với đội ngũ admin' },
            { id: 2, active: false, productName: '', keywords: '', videoFolder: '', useAi: false, useTTS: false, muteSourceVideo: false, aiPrompt: '' },
            { id: 3, active: false, productName: '', keywords: '', videoFolder: '', useAi: false, useTTS: false, muteSourceVideo: false, aiPrompt: '' }
          ] : []
        };
      });
      
      defaults['apology'].sampleAnswers = "Cả nhà ơi, đôi khi bình luận và người tham gia mới đông quá em không chào hết được, có bỏ sót ai thì mọi người thông cảm cho em nhé. Yêu mọi người nhiều!\nMọi người thông cảm nha, nếu em có lỡ bỏ qua bình luận của ai thì nhắn lại giúp em với nhé, do nhiều tin nhắn quá em không xem kịp ạ.";
      defaults['comment'].aiPrompt = "### NHIỆM VỤ: Trả lời bình luận của người dùng tên {user}.";
      defaults['comment'].sampleAnswers = "Cảm ơn bạn {user} đã bình luận nhé!\nMình đã nhận được bình luận của {user} rồi ạ.";
      defaults['follow'].aiPrompt = "Hãy nói một câu cảm ơn bạn {user} đã theo dõi kênh.";
      defaults['follow'].sampleAnswers = "A, cảm ơn bạn {user} đã theo dõi mình. Yêu bạn!\nCảm ơn {user} đã follow kênh của mình nhé!";
      defaults['talking'].aiPrompt = "Bạn là một streamer AI, đang không có ai tương tác. Hãy chủ động nói một điều gì đó thật thú vị, đặt một câu hỏi mở, nói một cách hài hước...";
      defaults['talking'].sampleAnswers = "xin chào các bn\ncác bạn ơi nói chuyện đi";
      defaults['comment'].assistantPrompt = "A, có bạn {user} vừa mới bình luận là: {comment}";
      defaults['gift'].aiPrompt = "Bạn là streamer AI. Hãy viết lời cảm ơn sáng tạo tới {user} vì đã tặng 1 {gift_name}.";
      defaults['call_to_action'].sampleAnswers = "Mọi người ơi, đừng xem chùa nữa, hãy thả tim và bình luận để mình có thêm động lực nhé!\nCác bạn có câu hỏi nào cho mình không ạ? Đừng ngại hỏi nha!\nNếu thấy buổi live thú vị, mọi người hãy giúp mình một lượt chia sẻ nhé. Yêu mọi người!";
      defaults['welcome'].sampleAnswers = "Chào mừng bạn {user} và {count} người mới đã đến với livestream!\nXin chào {user} và mọi người mới vào xem nhé! Chúc mọi người xem live vui vẻ.\nHelu {user}! Cảm ơn {count} bạn mới đã ghé thăm kênh của mình nha.";
      defaults['share'].aiPrompt = "Hãy cảm ơn người dùng tên {user} vì đã chia sẻ livestream.";
      defaults['share'].sampleAnswers = "Cảm ơn bạn {user} đã chia sẻ live giúp mình nhé!\nMình cảm ơn bạn {user} rất nhiều!";
      defaults['thanks_heart'].sampleAnswers = "Cảm ơn mọi người đã giúp mình đạt mốc {milestone} tim!\nWow, chúng ta đã đạt {milestone} tim rồi! Yêu các bạn nhiều!";

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

  const handleSlotChange = (slotId, name, value, isCheckbox = false) => {
    setEventConfigs(prev => {
      const newSlots = prev[selectedEventId].specialGiftSlots.map(slot => {
        if (slot.id === slotId) {
          return { ...slot, [name]: isCheckbox ? value : value };
        }
        return slot;
      });
      return {
        ...prev,
        [selectedEventId]: {
          ...prev[selectedEventId],
          specialGiftSlots: newSlots
        }
      };
    });
  };

  const handleProductChange = (productId, name, value, isCheckbox = false) => {
    setEventConfigs(prev => {
      const newProducts = prev[selectedEventId].checkoutProducts.map(prod => {
        if (prod.id === productId) {
          return { ...prod, [name]: isCheckbox ? value : value };
        }
        return prod;
      });
      return {
        ...prev,
        [selectedEventId]: {
          ...prev[selectedEventId],
          checkoutProducts: newProducts
        }
      };
    });
  };

  const selectFolder = async (fieldName = 'videoFolder') => {
    try {
      if (window.showDirectoryPicker) {
        const dirHandle = await window.showDirectoryPicker();
        handleChange({ target: { name: fieldName, value: dirHandle.name } });
      } else {
        const folderPath = prompt("Hãy nhập đường dẫn thư mục (Dữ liệu này sẽ được giả lập lưu để sử dụng với file zip/unzip sau này):", "C:/Videos/");
        if (folderPath) {
          handleChange({ target: { name: fieldName, value: folderPath } });
        }
      }
    } catch (e) {
      console.log('Folder selection cancelled');
    }
  };

  const selectSlotFolder = async (slotId, fieldName) => {
    try {
      if (window.showDirectoryPicker) {
        const dirHandle = await window.showDirectoryPicker();
        handleSlotChange(slotId, fieldName, dirHandle.name);
      } else {
        const folderPath = prompt("Hãy nhập đường dẫn thư mục cho Slot này:", "C:/Videos/");
        if (folderPath) {
          handleSlotChange(slotId, fieldName, folderPath);
        }
      }
    } catch (e) {
      console.log('Folder selection cancelled');
    }
  };

  const selectProductFolder = async (productId) => {
    try {
      if (window.showDirectoryPicker) {
        const dirHandle = await window.showDirectoryPicker();
        handleProductChange(productId, 'videoFolder', dirHandle.name);
      } else {
        const folderPath = prompt("Hãy nhập đường dẫn thư mục Video cho Sản phẩm này:", "C:/Videos/");
        if (folderPath) {
          handleProductChange(productId, 'videoFolder', folderPath);
        }
      }
    } catch (e) {
      console.log('Folder selection cancelled');
    }
  };

  const selectedEventInfo = EVENTS.find(e => e.id === selectedEventId);

  const FieldLabel = ({ icon, text, hasHelp = true, minW = "min-w-[220px]" }) => (
    <div className={`flex items-center gap-1.5 text-[13px] font-semibold text-gray-700 ${minW}`}>
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

        {selectedEventId === 'thanks_heart' && (
          <div className="bg-[#fdebea] border border-[#f5c2c7] rounded-md p-3 mb-3 text-[13px] text-[#842029]">
             <span className="font-bold">⚠️ Lưu ý Quan trọng:</span> Tính năng này phụ thuộc vào kết nối ổn định tới TikTok. Do các thay đổi gần đây từ phía TikTok, kết nối có thể không ổn định, khiến tính năng hoạt động không như mong đợi. Hãy cân nhắc kỹ khi sử dụng.
          </div>
        )}

        {/* Scrollable Config Area */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          
          {/* SPECIAL GIFT */}
          {selectedEventId === 'special_gift' ? (
            <>
              <div className="border border-gray-300 rounded-md bg-white mb-3 shadow-sm px-3 py-4">
                <fieldset className="border border-gray-300 rounded p-4 pt-4 mt-2 relative">
                  <legend className="absolute -top-3 left-3 bg-white px-1 text-sm font-semibold text-gray-700">
                    Cấu hình Logic Chung
                  </legend>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center">
                      <FieldLabel icon="⭐" text="Độ ưu tiên" minW="min-w-[150px]" />
                      <input type="number" name="priority" value={currentConfig.priority} onChange={handleChange} className="w-64 border border-gray-300 rounded px-2 py-1 text-[13px] bg-gray-50 focus:bg-white focus:outline-blue-500" />
                    </div>
                    <div className="flex items-center">
                      <FieldLabel icon="✅" text="Kích hoạt" minW="min-w-[150px]" />
                      <input type="checkbox" name="active" checked={currentConfig.active} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded" />
                    </div>
                  </div>
                </fieldset>
              </div>

              <div className="border border-gray-300 rounded-md bg-white mb-3 shadow-sm px-3 py-4">
                <fieldset className="border border-gray-300 rounded p-4 pt-4 mt-2 relative">
                  <legend className="absolute -top-3 left-3 bg-white px-1 text-sm font-semibold text-gray-700">
                    Phản ứng Quà tặng Đặc biệt
                  </legend>
                  
                  <div className="flex flex-col gap-4">
                    {currentConfig.specialGiftSlots?.map(slot => (
                      <div key={slot.id} className="border border-gray-300 rounded p-3 bg-[#f8f9fa] shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                          <input type="checkbox" checked={slot.active} onChange={(e) => handleSlotChange(slot.id, 'active', e.target.checked, true)} className="w-4 h-4 text-blue-600 rounded" />
                          <span className="font-bold text-gray-800 text-[13px]">Slot {slot.id}</span>
                        </div>
                        <div className="grid grid-cols-[150px_1fr] gap-y-3 gap-x-4 items-center">
                          
                          <label className="text-[13px] font-semibold text-[#a53b3b]">Tên Quà tặng:</label>
                          <select value={slot.giftName} onChange={(e) => handleSlotChange(slot.id, 'giftName', e.target.value)} className="border border-gray-300 rounded px-2 py-1 text-[13px] bg-white focus:outline-blue-500 max-w-xs">
                            {GIFT_TYPES.map(g => <option key={g} value={g}>{g}</option>)}
                          </select>

                          <label className="text-[13px] font-semibold text-[#a53b3b]">Thư mục Video Chính:</label>
                          <div className="flex items-center gap-2">
                            <span className="text-[13px] font-medium min-w-[150px]">{slot.videoFolder || 'Chưa chọn'}</span>
                            <button onClick={() => selectSlotFolder(slot.id, 'videoFolder')} className="text-[13px] text-gray-600 font-medium hover:text-gray-900 transition-colors underline decoration-dotted">Chọn...</button>
                            <div className="ml-auto flex gap-4">
                              <label className="flex items-center gap-1.5"><input type="checkbox" checked={slot.useTTS} onChange={(e) => handleSlotChange(slot.id, 'useTTS', e.target.checked, true)} /> <span className="text-[13px]">Dùng TTS</span></label>
                              <label className="flex items-center gap-1.5"><input type="checkbox" checked={slot.muteSourceVideo} onChange={(e) => handleSlotChange(slot.id, 'muteSourceVideo', e.target.checked, true)} /> <span className="text-[13px]">Tắt âm gốc video</span></label>
                            </div>
                          </div>

                          <div className="col-span-2 border-t border-gray-300 my-1"></div>

                          <div className="col-span-2">
                            <label className="flex items-center gap-2 mb-2">
                              <input type="checkbox" checked={slot.useAssistant} onChange={(e) => handleSlotChange(slot.id, 'useAssistant', e.target.checked, true)} className="w-4 h-4 text-blue-600 rounded" />
                              <span className="font-bold text-gray-800 text-[13px]">Cấu hình Trợ lý riêng</span>
                            </label>
                            
                            {slot.useAssistant && (
                              <div className="pl-6 grid grid-cols-[130px_1fr] gap-y-3 gap-x-4">
                                <label className="text-[13px] font-semibold text-gray-700">Câu mẫu của Trợ lý:</label>
                                <textarea value={slot.assistantPrompt} onChange={(e) => handleSlotChange(slot.id, 'assistantPrompt', e.target.value)} className="w-full h-[60px] border border-gray-300 rounded p-2 text-[13px] resize-none bg-white focus:outline-blue-500" />
                                
                                <label className="text-[13px] font-semibold text-gray-700">Video của Trợ lý:</label>
                                <div className="flex items-center gap-2">
                                  <span className="text-[13px] font-medium min-w-[150px]">{slot.assistantVideoFolder || 'Chưa chọn'}</span>
                                  <button onClick={() => selectSlotFolder(slot.id, 'assistantVideoFolder')} className="text-[13px] text-gray-600 font-medium hover:text-gray-900 transition-colors underline decoration-dotted">Chọn...</button>
                                </div>

                                <div className="col-span-2 flex justify-center mt-1">
                                  <label className="flex items-center gap-1.5">
                                    <input type="checkbox" checked={slot.useMainVoice} onChange={(e) => handleSlotChange(slot.id, 'useMainVoice', e.target.checked, true)} /> 
                                    <span className="text-[13px] text-gray-600 font-medium">Dùng giọng của nhân vật chính</span>
                                  </label>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                </fieldset>
              </div>
            </>
          ) : selectedEventId === 'checkout' ? (
            // CHECKOUT EVENTS (CHỐT ĐƠN)
            <>
              <div className="border border-gray-300 rounded-md bg-white mb-3 shadow-sm px-3 py-4">
                <div className="flex items-center gap-8 mb-4 ml-4">
                  <div className="flex items-center">
                    <FieldLabel icon="✅" text="Kích hoạt" minW="min-w-[120px]" />
                    <input type="checkbox" name="active" checked={currentConfig.active} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded" />
                  </div>
                  <div className="flex items-center">
                    <FieldLabel icon="⭐" text="Độ ưu tiên" minW="min-w-[100px]" />
                    <input type="number" name="priority" value={currentConfig.priority} onChange={handleChange} className="w-32 border border-gray-300 rounded px-2 py-1 text-[13px] bg-gray-50 focus:bg-white focus:outline-blue-500" />
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  {currentConfig.checkoutProducts?.map(prod => (
                    <fieldset key={prod.id} className="border border-gray-300 rounded p-4 pt-4 relative bg-[#f8f9fa] shadow-sm">
                      <legend className="absolute -top-3 left-3 bg-[#f8f9fa] px-1 text-sm font-bold text-gray-700 flex items-center gap-2">
                        <input type="checkbox" checked={prod.active} onChange={(e) => handleProductChange(prod.id, 'active', e.target.checked, true)} className="w-4 h-4 text-blue-600 rounded" />
                        Sản phẩm {prod.id}
                      </legend>
                      
                      <div className="grid grid-cols-[200px_1fr] gap-y-3 gap-x-4 items-center">
                        <label className="text-[13px] font-semibold text-gray-700">Tên sản phẩm:</label>
                        <input type="text" value={prod.productName} onChange={(e) => handleProductChange(prod.id, 'productName', e.target.value)} className="border border-gray-300 rounded px-2 py-1.5 text-[13px] bg-white focus:outline-blue-500 w-full" />

                        <label className="text-[13px] font-semibold text-[#a53b3b]">Từ khóa <span className="font-normal text-gray-500">(cách nhau bởi ;)</span>:</label>
                        <input type="text" value={prod.keywords} onChange={(e) => handleProductChange(prod.id, 'keywords', e.target.value)} className="border border-gray-300 rounded px-2 py-1.5 text-[13px] bg-white focus:outline-blue-500 w-full" />

                        <label className="text-[13px] font-semibold text-gray-700">Thư mục Video:</label>
                        <div className="flex items-center gap-2 w-full">
                          <span className="text-[13px] font-medium min-w-[200px] flex-1 truncate">{prod.videoFolder || 'Chưa chọn'}</span>
                          <button onClick={() => selectProductFolder(prod.id)} className="text-[13px] text-gray-600 font-medium hover:text-gray-900 transition-colors underline decoration-dotted bg-gray-200 px-3 py-1 rounded">Chọn...</button>
                        </div>

                        <label className="text-[13px] font-semibold text-gray-700 mt-2 self-start">Kịch bản cho AI:</label>
                        <div className="flex flex-col gap-2 mt-2">
                          <textarea value={prod.aiPrompt} onChange={(e) => handleProductChange(prod.id, 'aiPrompt', e.target.value)} className="w-full h-[60px] border border-gray-300 rounded p-2 text-[13px] resize-none bg-white focus:outline-blue-500" />
                          
                          <div className="flex items-center justify-center gap-6 mt-1">
                            <label className="flex items-center gap-1.5"><input type="checkbox" checked={prod.useAi} onChange={(e) => handleProductChange(prod.id, 'useAi', e.target.checked, true)} className="w-4 h-4 text-blue-600 rounded"/> <span className="text-[13px] font-medium">Dùng AI</span></label>
                            <label className="flex items-center gap-1.5"><input type="checkbox" checked={prod.useTTS} onChange={(e) => handleProductChange(prod.id, 'useTTS', e.target.checked, true)} className="w-4 h-4 text-blue-600 rounded"/> <span className="text-[13px] font-medium">Dùng TTS</span></label>
                            <label className="flex items-center gap-1.5"><input type="checkbox" checked={prod.muteSourceVideo} onChange={(e) => handleProductChange(prod.id, 'muteSourceVideo', e.target.checked, true)} className="w-4 h-4 text-blue-600 rounded"/> <span className="text-[13px] font-medium">Tắt âm gốc video</span></label>
                          </div>
                        </div>
                      </div>
                    </fieldset>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* NORMAL EVENTS - Cấu hình Chung */}
              {selectedEventId === 'gift' ? (
                // GIFT (THƯỜNG) has special groupings: "Cấu hình Logic Chung" and "Cấu hình Phản ứng Quà tặng Chung"
                <>
                  <div className="border border-gray-300 rounded-md bg-white mb-3 shadow-sm px-3 py-4">
                    <fieldset className="border border-gray-300 rounded p-4 pt-4 mt-2 relative">
                      <legend className="absolute -top-3 left-3 bg-white px-1 text-sm font-semibold text-gray-700">
                        Cấu hình Logic Chung (Ưu tiên, Cooldown)
                      </legend>
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center">
                          <FieldLabel icon="⭐" text="Độ ưu tiên" minW="min-w-[180px]" />
                          <input type="number" name="priority" value={currentConfig.priority} onChange={handleChange} className="flex-1 border border-gray-300 rounded px-2 py-1 text-[13px] bg-gray-50 focus:bg-white focus:outline-blue-500" />
                        </div>
                        <div className="flex items-center">
                          <FieldLabel icon="✅" text="Kích hoạt" minW="min-w-[180px]" />
                          <input type="checkbox" name="active" checked={currentConfig.active} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded" />
                        </div>
                        <div className="flex items-center">
                          <FieldLabel icon="⏳" text="Chờ giữa các quà tặng (giây)" minW="min-w-[180px]" />
                          <input type="number" name="waitBetweenEvents" value={currentConfig.waitBetweenEvents} onChange={handleChange} className="flex-1 border border-gray-300 rounded px-2 py-1 text-[13px] bg-gray-50 focus:bg-white focus:outline-blue-500" />
                        </div>
                      </div>
                    </fieldset>
                  </div>
                  <div className="border border-gray-300 rounded-md bg-white mb-3 shadow-sm px-3 py-4">
                    <fieldset className="border border-gray-300 rounded p-4 pt-4 mt-2 relative">
                      <legend className="absolute -top-3 left-3 bg-white px-1 text-sm font-semibold text-gray-700">
                        Cấu hình Phản ứng Quà tặng Chung
                      </legend>
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center">
                          <FieldLabel icon="🎥" text="Danh mục video" minW="min-w-[180px]" />
                          <input type="text" name="videoCategory" value={currentConfig.videoCategory} onChange={handleChange} className="flex-1 border border-gray-300 rounded px-2 py-1 text-[13px] bg-gray-50 focus:bg-white focus:outline-blue-500" />
                        </div>
                        <div className="flex items-center">
                          <FieldLabel icon="🧠" text="Dùng AI trả lời" minW="min-w-[180px]" />
                          <input type="checkbox" name="useAi" checked={currentConfig.useAi} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded" />
                        </div>
                        <div className="flex items-center">
                          <FieldLabel icon="🗣️" text="Dùng giọng nói" minW="min-w-[180px]" />
                          <input type="checkbox" name="useVoice" checked={currentConfig.useVoice} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded" />
                        </div>
                        <div className="flex items-center">
                          <FieldLabel icon="🔇" text="Tắt âm gốc video" minW="min-w-[180px]" />
                          <input type="checkbox" name="muteSourceVideo" checked={currentConfig.muteSourceVideo} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded" />
                        </div>
                        <div className="flex items-start mt-2">
                          <FieldLabel icon="✍️" text="Kịch bản cho AI" minW="min-w-[180px]" />
                          <textarea name="aiPrompt" value={currentConfig.aiPrompt} onChange={handleChange} className="flex-1 min-h-[80px] border border-gray-300 rounded p-2 text-[13px] resize-none bg-gray-50 focus:bg-white focus:outline-blue-500" />
                        </div>
                        <div className="flex items-start mt-2">
                          <FieldLabel icon="📄" text="Câu trả lời mẫu (mỗi câu 1 dòng)" minW="min-w-[180px]" />
                          <textarea name="sampleAnswers" value={currentConfig.sampleAnswers} onChange={handleChange} className="flex-1 min-h-[100px] border border-gray-300 rounded p-2 text-[13px] resize-none bg-gray-50 focus:bg-white focus:outline-blue-500" />
                        </div>
                      </div>
                    </fieldset>
                  </div>
                </>
              ) : (
                // STANDARD EVENTS (Bình luận, Xin lỗi, Theo dõi, Kêu gọi, Chào người mới, etc)
                <div className="border border-gray-300 rounded-md bg-white mb-3 shadow-sm">
                  <div className="relative px-3 py-4">
                    <fieldset className="border border-gray-300 rounded p-4 pt-6 mt-2 relative">
                      <legend className="absolute -top-3 left-3 bg-white px-1 text-sm font-semibold text-gray-700 flex items-center gap-1">
                        Cấu hình Chung - <span className="text-[#a53b3b]"><selectedEventInfo.icon size={14} className={selectedEventInfo.color} /></span> {selectedEventInfo?.label}
                      </legend>
                      
                      <div className="flex flex-col gap-3">
                        
                        {/* Common fields for all standard events */}
                        
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
                        
                        {selectedEventId === 'thanks_heart' && (
                          <div className="flex items-center">
                            <FieldLabel icon="❤️" text="Ngưỡng tim để cảm ơn" />
                            <input type="number" name="likeThreshold" value={currentConfig.likeThreshold} onChange={handleChange} className="flex-1 border border-gray-300 rounded px-2 py-1 text-[13px] bg-gray-50 focus:bg-white focus:outline-blue-500" />
                          </div>
                        )}

                        {/* Specific fields */}
                        {(selectedEventId === 'apology' || selectedEventId === 'welcome') && (
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

                        {currentConfig.aiPrompt !== undefined && selectedEventId !== 'idle' && selectedEventId !== 'apology' && selectedEventId !== 'welcome' && (
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
              )}

              {/* Cấu hình Video Chung & Cài đặt Trợ lý cho các Tab còn lại */}
              <div className="border border-gray-300 rounded-md bg-white mb-3 shadow-sm px-3 py-4">
                <fieldset className="border border-gray-300 rounded p-4 pt-4 mt-2 relative">
                  <legend className="absolute -top-3 left-3 bg-white px-1 text-sm font-semibold text-gray-700">
                    Cấu hình Video Chung (Dự phòng)
                  </legend>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-4">
                      <span className="text-[13px] text-[#a53b3b] font-semibold min-w-[200px]">Danh mục video cho sự kiện này:</span>
                      <select name="videoCategory" value={currentConfig.videoCategory} onChange={handleChange} className="flex-1 border border-gray-300 rounded px-2 py-1 text-[13px] bg-white focus:outline-blue-500">
                        <option value={currentConfig.videoCategory}>{currentConfig.videoCategory}</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-200 pt-3">
                      <div className="flex items-center gap-4">
                        <span className="text-[13px] text-[#a53b3b] font-semibold min-w-[200px]">Thư mục video tương ứng:</span>
                        <span className="text-[13px] text-gray-800 font-medium truncate max-w-sm">{currentConfig.videoFolder || 'Chưa chọn thư mục'}</span>
                      </div>
                      <button onClick={() => selectFolder()} className="text-[13px] text-gray-600 font-medium hover:text-gray-900 transition-colors underline decoration-dotted">
                        Chọn thư mục...
                      </button>
                    </div>
                  </div>
                </fieldset>
              </div>

              {currentConfig.assistantPrompt !== undefined && (
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
              )}
            </>
          )}

        </div>

        {/* Footer Save Button */}
        <div className="mt-3">
          <button 
            onClick={handleSave}
            className="w-full py-3 bg-[#4caf50] hover:bg-[#43a047] text-white font-bold rounded shadow transition-colors text-[14px] uppercase tracking-wide flex justify-center items-center gap-2"
          >
            <CheckSquare size={18} /> Lưu thay đổi cho sự kiện này
          </button>
        </div>

      </div>
    </div>
  );
}
