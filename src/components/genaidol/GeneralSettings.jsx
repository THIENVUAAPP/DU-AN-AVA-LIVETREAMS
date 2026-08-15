import React, { useState, useEffect, useRef } from 'react';
import { Key, User, Mic, Settings2, Download, Save, X, Volume2, Search, CheckCircle2, FolderOpen, Brain, Upload } from 'lucide-react';
import { getLiveMediaByCategory } from '../../lib/liveKhoDB';
import { saveDualVoiceConfig, CURATED_VOICES } from '../../utils/voiceSyncService';

const ELEVENLABS_VOICES = [
  { id: 'el_rachel', name: 'Rachel (Trầm ấm, Tự tin)', type: 'ElevenLabs', gender: 'Female', cost: '1 token/ký tự' },
  { id: 'el_drew', name: 'Drew (Tin tức, Trịnh trọng)', type: 'ElevenLabs', gender: 'Male', cost: '1 token/ký tự' },
  { id: 'el_clyde', name: 'Clyde (Chiến binh, Trầm)', type: 'ElevenLabs', gender: 'Male', cost: '1 token/ký tự' },
  { id: 'el_paul', name: 'Paul (Phóng viên, Ấm áp)', type: 'ElevenLabs', gender: 'Male', cost: '1 token/ký tự' },
  { id: 'el_domi', name: 'Domi (Trẻ trung, Năng động)', type: 'ElevenLabs', gender: 'Female', cost: '1 token/ký tự' },
  { id: 'el_fin', name: 'Fin (Lão thành, Thông thái)', type: 'ElevenLabs', gender: 'Male', cost: '1 token/ký tự' },
  { id: 'el_bella', name: 'Bella (Nhẹ nhàng, Mềm mại)', type: 'ElevenLabs', gender: 'Female', cost: '1 token/ký tự' },
  { id: 'el_antoni', name: 'Antoni (Chuyên nghiệp, Rõ ràng)', type: 'ElevenLabs', gender: 'Male', cost: '1 token/ký tự' },
  { id: 'el_thomas', name: 'Thomas (Kể chuyện, Cuốn hút)', type: 'ElevenLabs', gender: 'Male', cost: '1 token/ký tự' },
  { id: 'el_charlie', name: 'Charlie (Tự nhiên, Thân thiện)', type: 'ElevenLabs', gender: 'Male', cost: '1 token/ký tự' },
  { id: 'el_emily', name: 'Emily (Trong trẻo, Thanh lịch)', type: 'ElevenLabs', gender: 'Female', cost: '1 token/ký tự' },
  { id: 'el_elli', name: 'Elli (Cảm xúc, Truyền cảm)', type: 'ElevenLabs', gender: 'Female', cost: '1 token/ký tự' },
  { id: 'el_callum', name: 'Callum (Nam tính, Mạnh mẽ)', type: 'ElevenLabs', gender: 'Male', cost: '1 token/ký tự' },
  { id: 'el_patrick', name: 'Patrick (Thuyết phục, Uy lực)', type: 'ElevenLabs', gender: 'Male', cost: '1 token/ký tự' },
  { id: 'el_harry', name: 'Harry (Hồi hộp, Kịch tính)', type: 'ElevenLabs', gender: 'Male', cost: '1 token/ký tự' },
  { id: 'el_liam', name: 'Liam (Gần gũi, Hài hước)', type: 'ElevenLabs', gender: 'Male', cost: '1 token/ký tự' },
  { id: 'el_dorothy', name: 'Dorothy (Người kể chuyện nhí)', type: 'ElevenLabs', gender: 'Female', cost: '1 token/ký tự' },
  { id: 'el_josh', name: 'Josh (Năng lượng, Nhanh nhẹn)', type: 'ElevenLabs', gender: 'Male', cost: '1 token/ký tự' },
  { id: 'el_arnold', name: 'Arnold (Cứng rắn, Uy nghiêm)', type: 'ElevenLabs', gender: 'Male', cost: '1 token/ký tự' },
  { id: 'el_charlotte', name: 'Charlotte (Duyên dáng, Tinh tế)', type: 'ElevenLabs', gender: 'Female', cost: '1 token/ký tự' },
  { id: 'el_matilda', name: 'Matilda (Ấm áp, Chân thành)', type: 'ElevenLabs', gender: 'Female', cost: '1 token/ký tự' },
  { id: 'el_matthew', name: 'Matthew (Điềm tĩnh, Đáng tin)', type: 'ElevenLabs', gender: 'Male', cost: '1 token/ký tự' },
  { id: 'el_james', name: 'James (Phát thanh viên)', type: 'ElevenLabs', gender: 'Male', cost: '1 token/ký tự' },
  { id: 'el_joseph', name: 'Joseph (Kể chuyện cổ tích)', type: 'ElevenLabs', gender: 'Male', cost: '1 token/ký tự' },
  { id: 'el_jeremy', name: 'Jeremy (Sôi nổi, Hoạt náo)', type: 'ElevenLabs', gender: 'Male', cost: '1 token/ký tự' },
  { id: 'el_michael', name: 'Michael (Giáo sư, Thông thái)', type: 'ElevenLabs', gender: 'Male', cost: '1 token/ký tự' },
  { id: 'el_ethan', name: 'Ethan (Bí ẩn, Trầm tĩnh)', type: 'ElevenLabs', gender: 'Male', cost: '1 token/ký tự' },
  { id: 'el_gigi', name: 'Gigi (Hoạt hình, Dễ thương)', type: 'ElevenLabs', gender: 'Female', cost: '1 token/ký tự' },
  { id: 'el_freya', name: 'Freya (Phép thuật, Lôi cuốn)', type: 'ElevenLabs', gender: 'Female', cost: '1 token/ký tự' },
  { id: 'el_grace', name: 'Grace (Sang trọng, Nhã nhặn)', type: 'ElevenLabs', gender: 'Female', cost: '1 token/ký tự' },
  { id: 'el_daniel', name: 'Daniel (Quyết đoán, Mạnh mẽ)', type: 'ElevenLabs', gender: 'Male', cost: '1 token/ký tự' },
  { id: 'el_lily', name: 'Lily (Hồn nhiên, Trong sáng)', type: 'ElevenLabs', gender: 'Female', cost: '1 token/ký tự' },
  { id: 'el_serena', name: 'Serena (Quyến rũ, Mượt mà)', type: 'ElevenLabs', gender: 'Female', cost: '1 token/ký tự' },
  { id: 'el_adam', name: 'Adam (Mộc mạc, Giản dị)', type: 'ElevenLabs', gender: 'Male', cost: '1 token/ký tự' },
  { id: 'el_nicole', name: 'Nicole (Năng động, Hiện đại)', type: 'ElevenLabs', gender: 'Female', cost: '1 token/ký tự' }
];

const MAIN_VOICES = [...ELEVENLABS_VOICES];

const ASSISTANT_VOICES = [
  { id: '1', name: 'Giọng Google (Miễn phí)', type: 'Miễn phí', gender: 'Female', cost: '0 token' },
  ...ELEVENLABS_VOICES
];

export default function GeneralSettings({ onClose }) {
  const [activeTab, setActiveTab] = useState('prompt');
  const [idleVideoCount, setIdleVideoCount] = useState(0);
  const fileInputRef = useRef(null);
  
  // State for all settings
  const [settings, setSettings] = useState({
    // Tab 1: BỘ NÃO IDOL
    queueTimeout: '1',
    systemPrompt: "Bạn là một nhân vật ảo AI tên là 'Lan Hương', bạn nữ, thân thiện, hài hước và thông minh. Bạn là một nhân viên live stream siêu đáng yêu, đang bán phần mềm AIDOL live stream bằng trí tuệ nhân tạo. Bạn có một ông chủ tên là Tun Tử Tế rất giỏi trong lĩnh vực trí tuệ nhân tạo, thỉnh thoảng có thể trêu trọc ông chủ.",
    backgroundContext: "Bối cảnh: Bạn đang livestream bán phần mềm AIDOL một phần mềm dùng để live stream bằng trí tuệ nhân tạo. Người dùng có thể tự tạo ra nhân vật của chính họ bằng các chỉ từ 1 ảnh, tạo ra video, cho video đó vào phần mềm AIDOL thì phần mềm AIDOL sẽ tự đóng gói lại và tạo thành 1 nhân vật live stream đồng nhất, có thể dùng nhân vật đó live stream kiếm xu nhận quà trên tiktok, bán hàng tiếp thị liên kết, hoặc xuất hiện trên live cùng với người thật. Giá phần mềm là 3 triệu 5 trăm ngàn đồng / 1 năm hoặc có thể dùng gói dùng thử 500000 trên 1 tháng.\nKĩ thuật phần mềm: Công dụng: dùng để live stream bằng nhân vật ảo hoặc nhân bản chính bản thân mình, live stream phản hồi theo thời gian thực tất cả các sự kiện trong khi live tiktok. Phần mềm có hơn 500 giọng nói khác nhau. Nhân vật live stream có thể là bất cứ ai tùy vào người dùng tự tạo và tưởng tượng ra.\nChốt đơn bằng cách khuyến khích mọi người nhấn tin vào link bio.",
    
    // Tab 2: Nhân vật Chính
    llmChoice: 'avalive', 
    apiModel: 'Model AvaLive',
    mainVoiceFilter: 'all', // 'all' | 'male' | 'female'
    mainVoiceId: 'el_rachel',
    
    // Tab 3: Trợ lý
    assistantEnabled: true,
    assistantVideoFolder: 'im lặng (2 video)',
    assistantVoiceFilter: 'all',
    assistantVoiceId: '1',
    
    // Tab 4: Cấu hình Nhanh
    selectedPreset: 'fast', // 'fast' | 'notification' | 'custom_LanHuong'
    userPresets: [],
    newPresetName: '',
    
    // Custom Voices
    customVoices: []
  });

  // Load from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('aidol_general_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        if (parsed.userPresets) {
          parsed.userPresets = parsed.userPresets.filter(p => p.id !== 'custom_LanHuong');
        }
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
    // Fetch count of idle videos
    getLiveMediaByCategory('idle').then(items => {
      setIdleVideoCount(items.length);
    }).catch(console.error);
  }, []);

  const handleSave = () => {
    localStorage.setItem('aidol_general_settings', JSON.stringify(settings));

    // Đồng bộ vào hệ thống Dual Voice của AVA Live
    const idolMatch = CURATED_VOICES.find(v => v.id === settings.mainVoiceId);
    const managerMatch = CURATED_VOICES.find(v => v.id === settings.assistantVoiceId);
    
    saveDualVoiceConfig({
      idolVoice: idolMatch ? { ...idolMatch, role: 'idol' } : undefined,
      managerVoice: managerMatch ? { ...managerMatch, role: 'manager' } : undefined
    });

    onClose();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleMainVoiceFilter = (filter) => setSettings(prev => ({ ...prev, mainVoiceFilter: filter }));
  const handleAssistantVoiceFilter = (filter) => setSettings(prev => ({ ...prev, assistantVoiceFilter: filter }));

  const selectFolder = async () => {
    try {
      // Dùng window.showDirectoryPicker nếu hỗ trợ (Chromium)
      if (window.showDirectoryPicker) {
        const dirHandle = await window.showDirectoryPicker();
        setSettings(prev => ({ ...prev, assistantVideoFolder: dirHandle.name }));
      } else {
        // Fallback giả lập chọn thư mục
        const folderPath = prompt("Hãy nhập đường dẫn thư mục Video Trợ lý (VD: C:/Videos/ImLang/):", "C:/Videos/ImLang/");
        if (folderPath) {
          setSettings(prev => ({ ...prev, assistantVideoFolder: folderPath }));
        }
      }
    } catch (e) {
      console.log('Folder selection cancelled or failed:', e);
    }
  };

  const savePreset = () => {
    if (!settings.newPresetName.trim()) return;
    const newPreset = {
      id: `custom_${Date.now()}`,
      name: settings.newPresetName,
      desc: 'Cấu hình tùy chỉnh do bạn lưu.'
    };
    setSettings(prev => ({
      ...prev,
      userPresets: [...prev.userPresets, newPreset],
      selectedPreset: newPreset.id,
      newPresetName: ''
    }));
  };

  const handleUploadVoiceClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleVoiceFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const voiceName = prompt("Nhập tên cho giọng đọc mới của bạn:", "Giọng cá nhân " + (settings.customVoices.length + 1));
    if (voiceName) {
      const newVoice = {
        id: `custom_${Date.now()}`,
        name: voiceName,
        type: 'Custom Clone',
        gender: 'Bản sao',
        cost: '1 token/ký tự'
      };
      setSettings(prev => ({
        ...prev,
        customVoices: [newVoice, ...prev.customVoices],
        mainVoiceId: newVoice.id
      }));
      alert(`Đã tải lên và tạo bản sao giọng đọc "${voiceName}" thành công!`);
    }
    e.target.value = null; // reset
  };

  // Helper renderers for Tables
  const renderVoiceTable = (voices, currentFilter, selectedId, onSelect) => {
    const filtered = voices.filter(v => {
      if (currentFilter === 'male') return v.gender === 'Male';
      if (currentFilter === 'female') return v.gender === 'Female';
      return true;
    });

    return (
      <div className="border border-gray-300 rounded overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 font-semibold border-b border-gray-300">
            <tr>
              <th className="px-4 py-2 w-12 text-center">ID</th>
              <th className="px-4 py-2">Tên Giọng Nói</th>
              <th className="px-4 py-2">Loại</th>
              <th className="px-4 py-2">Giới Tính</th>
              <th className="px-4 py-2">Chi Phí</th>
              <th className="px-4 py-2 w-16 text-center"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filtered.map((v, i) => {
              const isSelected = selectedId === v.id;
              return (
                <tr 
                  key={v.id} 
                  onClick={() => onSelect(v.id)}
                  className={`cursor-pointer hover:bg-green-50 transition-colors ${isSelected ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-white text-gray-800'}`}
                >
                  <td className="px-4 py-2 text-center font-medium">{v.id}</td>
                  <td className="px-4 py-2 font-medium">{v.name}</td>
                  <td className={`px-4 py-2 ${isSelected ? 'text-white' : 'text-blue-600'}`}>{v.type}</td>
                  <td className="px-4 py-2">{v.gender}</td>
                  <td className="px-4 py-2">{v.cost}</td>
                  <td className="px-4 py-2 text-center">
                    <button className={`p-1.5 rounded-full ${isSelected ? 'bg-green-400 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'} transition-colors`}>
                      <Volume2 size={14} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#f0f2f5] text-[#333] font-sans overflow-hidden">
      
      {/* TABS */}
      <div className="flex bg-white border-b border-gray-300">
        <button 
          onClick={() => setActiveTab('prompt')}
          className={`flex items-center gap-2 px-6 py-3 font-semibold text-sm transition-colors border-b-2 ${activeTab === 'prompt' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-blue-500'}`}
        >
          <Brain size={16} /> BỘ NÃO IDOL
        </button>
        <button 
          onClick={() => setActiveTab('main-character')}
          className={`flex items-center gap-2 px-6 py-3 font-semibold text-sm transition-colors border-b-2 ${activeTab === 'main-character' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-blue-500'}`}
        >
          <User size={16} className={activeTab === 'main-character' ? 'text-blue-600' : 'text-blue-500'} /> Nhân vật Chính
        </button>
        <button 
          onClick={() => setActiveTab('assistant')}
          className={`flex items-center gap-2 px-6 py-3 font-semibold text-sm transition-colors border-b-2 ${activeTab === 'assistant' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-blue-500'}`}
        >
          <Mic size={16} className="text-red-500" /> Trợ lý
        </button>
        <button 
          onClick={() => setActiveTab('quick-config')}
          className={`flex items-center gap-2 px-6 py-3 font-semibold text-sm transition-colors border-b-2 ${activeTab === 'quick-config' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-blue-500'}`}
        >
          <Settings2 size={16} className="text-gray-400" /> Cấu hình Nhanh
        </button>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 overflow-y-auto p-4 bg-[#f8f9fa] scroll-smooth overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' }}>
        <div className="max-w-5xl mx-auto space-y-4 pb-10">
          
          {/* TAB 1: BỘ NÃO IDOL */}
          {activeTab === 'prompt' && (
            <>
              {/* Box 2: Queue Settings */}
              <div className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
                <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 font-bold text-gray-800 text-sm">
                  Cài đặt Hàng đợi
                </div>
                <div className="p-4 flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700">Tự động xóa sự kiện sau (phút):</label>
                  <input type="number" name="queueTimeout" value={settings.queueTimeout} onChange={handleChange} className="w-24 border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:border-blue-500 text-center text-red-500 font-medium" />
                </div>
              </div>

              {/* Box 3: Prompt Config */}
              <div className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden flex flex-col min-h-[400px]">
                <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 font-bold text-gray-800 text-sm">
                  Cấu hình Prompt
                </div>
                <div className="p-4 flex-1 flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5 flex-1">
                    <label className="text-sm font-semibold text-[#a53b3b]">Tính cách (System Prompt):</label>
                    <textarea 
                      name="systemPrompt" value={settings.systemPrompt} onChange={handleChange}
                      className="w-full flex-1 min-h-[120px] border border-gray-300 rounded p-3 text-sm focus:outline-none focus:border-blue-500 resize-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 flex-1">
                    <label className="text-sm font-semibold text-[#a53b3b]">Kiến thức nền / Bối cảnh:</label>
                    <textarea 
                      name="backgroundContext" value={settings.backgroundContext} onChange={handleChange}
                      className="w-full flex-1 min-h-[120px] border border-gray-300 rounded p-3 text-sm focus:outline-none focus:border-blue-500 resize-none"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: NHÂN VẬT CHÍNH */}
          {activeTab === 'main-character' && (
            <>
              {/* Thiết lập LLM */}
              <div className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
                <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 font-bold text-gray-800 text-sm">
                  Thiết lập AI (LLM - 'Bộ Não')
                </div>
                <div className="p-4 space-y-4">
                  <p className="text-sm font-semibold text-gray-800">Cấu hình Bộ não AI cho Nhân vật:</p>
                  
                  <div className="flex items-center gap-4 mt-2">
                    <label className="text-sm font-semibold text-[#a53b3b]">Chọn Model AI:</label>
                    <select 
                      name="apiModel" value={settings.apiModel} onChange={handleChange}
                      className="flex-1 max-w-md border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 text-gray-700"
                    >
                      <option value="Model AvaLive">Model AvaLive</option>
                    </select>
                  </div>
                  <p className="text-xs text-gray-500 italic flex items-center gap-1">
                    ⓘ Việc tạo ra câu trả lời sẽ trừ token từ tài khoản của bạn.
                  </p>
                </div>
              </div>

              {/* Bảng Giọng nói */}
              <div className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden flex flex-col h-[480px]">
                <div className="px-4 py-3 border-b border-gray-300 bg-white">
                  <h3 className="font-bold text-gray-800 text-sm mb-2">Chọn Giọng Nói Cho Nhân vật Chính</h3>
                  <div className="flex items-center gap-6">
                    <span className="text-sm font-semibold text-[#a53b3b]">Lọc theo:</span>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="radio" checked={settings.mainVoiceFilter === 'all'} onChange={() => handleMainVoiceFilter('all')} className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">Tất cả</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="radio" checked={settings.mainVoiceFilter === 'male'} onChange={() => handleMainVoiceFilter('male')} className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">Giọng Nam</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="radio" checked={settings.mainVoiceFilter === 'female'} onChange={() => handleMainVoiceFilter('female')} className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">Giọng Nữ</span>
                    </label>
                  </div>
                  <button 
                    onClick={handleUploadVoiceClick}
                    className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 rounded text-sm font-medium transition-colors"
                  >
                    <Upload size={16} /> Tải lên Giọng đọc (Clone)
                  </button>
                </div>
                
                <div className="flex-1 overflow-auto p-4">
                  {renderVoiceTable([...settings.customVoices, ...MAIN_VOICES], settings.mainVoiceFilter, settings.mainVoiceId, (id) => setSettings(prev => ({...prev, mainVoiceId: id})))}
                </div>
                
                <div className="px-4 py-2 bg-gray-50 border-t border-gray-300 text-xs text-gray-500 italic">
                  ⓘ Vui lòng bấm vào nút 'Nghe thử' 🔊 để kiểm tra giọng nói trước khi chọn để tránh lỗi giọng nói từ server.
                </div>
              </div>
            </>
          )}

          {/* TAB 3: TRỢ LÝ */}
          {activeTab === 'assistant' && (
            <>
              {/* Cài đặt chung cho Trợ lý */}
              <div className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
                <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 font-bold text-gray-800 text-sm">
                  Cài đặt chung cho Trợ lý
                </div>
                <div className="p-4 space-y-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" name="assistantEnabled" 
                      checked={settings.assistantEnabled} onChange={handleChange}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" 
                    />
                    <span className="text-sm font-bold text-gray-800">Bật Trợ lý</span>
                  </label>

                  <div className="flex items-center justify-between border-t border-gray-200 pt-3">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <span>Thư mục Video Trợ lý (cho video 'listening'):</span>
                      <span className="font-semibold text-gray-900">{idleVideoCount === 0 ? 'im lặng (0 video)' : `im lặng (${idleVideoCount} video)`}</span>
                    </div>
                    <button 
                      onClick={selectFolder}
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-100 text-sm font-medium transition-colors"
                    >
                      <FolderOpen size={16} /> Chọn thư mục...
                    </button>
                  </div>
                </div>
              </div>

              {/* Bảng Giọng nói Trợ lý */}
              <div className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden flex flex-col h-[480px]">
                <div className="px-4 py-3 border-b border-gray-300 bg-white">
                  <h3 className="font-bold text-gray-800 text-sm mb-2">Chọn Giọng Nói cho Trợ lý</h3>
                  <div className="flex items-center gap-6">
                    <span className="text-sm font-semibold text-gray-700">Lọc theo:</span>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="radio" checked={settings.assistantVoiceFilter === 'all'} onChange={() => handleAssistantVoiceFilter('all')} className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">Tất cả</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="radio" checked={settings.assistantVoiceFilter === 'male'} onChange={() => handleAssistantVoiceFilter('male')} className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">Giọng Nam</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="radio" checked={settings.assistantVoiceFilter === 'female'} onChange={() => handleAssistantVoiceFilter('female')} className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">Giọng Nữ</span>
                    </label>
                  </div>
                  <button 
                    onClick={handleUploadVoiceClick}
                    className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 rounded text-sm font-medium transition-colors"
                  >
                    <Upload size={16} /> Tải lên Giọng đọc (Clone)
                  </button>
                </div>
                
                <div className="flex-1 overflow-auto p-4">
                  {renderVoiceTable([...settings.customVoices, ...ASSISTANT_VOICES], settings.assistantVoiceFilter, settings.assistantVoiceId, (id) => setSettings(prev => ({...prev, assistantVoiceId: id})))}
                </div>

                <div className="px-4 py-2 bg-gray-50 border-t border-gray-300 text-xs text-gray-500 italic">
                  ⓘ Vui lòng bấm vào nút 'Nghe thử' 🔊 để kiểm tra giọng nói trước khi chọn để tránh lỗi giọng nói từ server.
                </div>
              </div>
            </>
          )}

          {/* TAB 4: CẤU HÌNH NHANH */}
          {activeTab === 'quick-config' && (
            <div className="space-y-4 max-w-4xl mx-auto">
              {/* Chọn cấu hình có sẵn */}
              <div className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
                <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 font-bold text-gray-800 text-sm">
                  Chọn một cấu hình có sẵn để áp dụng
                </div>
                <div className="p-4 space-y-4">
                  
                  <label className="flex flex-col gap-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <input type="radio" name="selectedPreset" value="fast" checked={settings.selectedPreset === 'fast'} onChange={handleChange} className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
                      <span className="text-sm font-bold text-gray-800">AI Phản ứng Nhanh (Khuyên dùng)</span>
                    </div>
                    <span className="text-sm text-gray-600 ml-6">AI sẽ chủ động giao lưu, trả lời bình luận và quà tặng một cách sáng tạo.</span>
                  </label>

                  <label className="flex flex-col gap-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <input type="radio" name="selectedPreset" value="notification" checked={settings.selectedPreset === 'notification'} onChange={handleChange} className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
                      <span className="text-sm font-bold text-gray-800">Trợ lý Thông báo (Không dùng AI)</span>
                    </div>
                    <span className="text-sm text-gray-600 ml-6">Nhân vật chỉ đọc các thông báo có sẵn. Tiết kiệm chi phí API.</span>
                  </label>

                  {/* User Presets */}
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-800 mb-3">Preset của bạn:</h4>
                    <div className="space-y-3">
                      {settings.userPresets.map(preset => (
                        <label key={preset.id} className="flex flex-col gap-1 cursor-pointer">
                          <div className="flex items-center gap-2">
                            <input type="radio" name="selectedPreset" value={preset.id} checked={settings.selectedPreset === preset.id} onChange={handleChange} className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
                            <span className="text-sm font-bold text-[#a53b3b]">{preset.name}</span>
                          </div>
                          <span className="text-sm text-gray-600 ml-6">{preset.desc}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              {/* Áp dụng button */}
              <button className="w-full py-3 bg-[#6ab04c] hover:bg-green-600 text-white font-bold rounded-lg shadow-md transition-colors flex items-center justify-center gap-2 text-lg">
                ✨ Áp dụng Cấu hình đã chọn
              </button>

              {/* Lưu Cài đặt Hiện tại */}
              <div className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
                <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 font-bold text-gray-800 text-sm">
                  Lưu Cài đặt Hiện tại thành Preset mới
                </div>
                <div className="p-4 flex items-center gap-4">
                  <label className="text-sm font-bold text-gray-800 w-32">Đặt tên cho Preset:</label>
                  <div className="flex-1 flex flex-col gap-2">
                    <input 
                      type="text" name="newPresetName" value={settings.newPresetName} onChange={handleChange}
                      placeholder="Ví dụ: Cấu hình livestream bán hàng"
                      className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500"
                    />
                    <button 
                      onClick={savePreset}
                      disabled={!settings.newPresetName.trim()}
                      className="w-full py-1.5 border border-[#a53b3b] text-[#a53b3b] hover:bg-[#a53b3b] hover:text-white rounded font-medium text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save size={16} /> Lưu Preset
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="flex items-center justify-end gap-3 px-6 py-4 bg-white border-t border-gray-300">
        <button 
          onClick={handleSave}
          className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium shadow-sm transition-colors text-sm"
        >
          Save
        </button>
        <button 
          onClick={onClose}
          className="px-6 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded font-medium shadow-sm transition-colors text-sm"
        >
          Cancel
        </button>
      </div>

      {/* Ẩn thẻ input file */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleVoiceFileChange} 
        accept="audio/mp3, audio/wav, audio/m4a" 
        className="hidden" 
      />
    </div>
  );
}
