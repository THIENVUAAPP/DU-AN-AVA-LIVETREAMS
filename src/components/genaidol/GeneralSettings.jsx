import React, { useState, useEffect } from 'react';
import { Key, User, Mic, Settings2, Download, Save, X } from 'lucide-react';

export default function GeneralSettings({ onClose }) {
  const [activeTab, setActiveTab] = useState('prompt');
  
  // State for settings
  const [settings, setSettings] = useState({
    openaiKey: '',
    googleKey: '',
    elevenlabsKey: '',
    minimaxGroupId: '',
    minimaxKey: '',
    queueTimeout: '1',
    systemPrompt: '',
    backgroundContext: ''
  });

  // Load from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('aidol_general_settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    } else {
      // Default dummy data matching screenshot
      setSettings(prev => ({
        ...prev,
        systemPrompt: "Bạn là một nhân vật ảo AI tên là 'Lan Hương', bạn nữ, thân thiện, hài hước và thông minh. Bạn là một nhân viên live stream siêu đáng yêu, đang bán phần mềm AIDOL live stream bằng trí tuệ nhân tạo. Bạn có một ông chủ tên là Tun Tử Tế rất giỏi trong lĩnh vực trí tuệ nhân tạo, thỉnh thoảng có thể trêu trọc ông chủ.",
        backgroundContext: "Bối cảnh: Bạn đang livestream bán phần mềm AIDOL một phần mềm dùng để live stream bằng trí tuệ nhân tạo. Người dùng có thể tự tạo ra nhân vật của chính họ bằng các chỉ từ 1 ảnh, tạo ra video, cho video đó vào phần mềm AIDOL thì phần mềm AIDOL sẽ tự đóng gói lại và tạo thành 1 nhân vật live stream đồng nhất, có thể dùng nhân vật đó live stream kiếm xu nhận quà trên tiktok, bán hàng tiếp thị liên kết, hoặc xuất hiện trên live cùng với người thật. Giá phần mềm là 3 triệu 5 trăm ngàn đồng / 1 năm hoặc có thể dùng gói dùng thử 500000 trên 1 tháng.\nKĩ thuật phần mềm: Công dụng: dùng để live stream bằng nhân vật ảo hoặc nhân bản chính bản thân mình, live stream phản hồi theo thời gian thực tất cả các sự kiện trong khi live tiktok. Phần mềm có hơn 500 giọng nói khác nhau. Nhân vật live stream có thể là bất cứ ai tùy vào người dùng tự tạo và tưởng tượng ra.\nChốt đơn bằng cách khuyến khích mọi người nhấn tin vào link bio."
      }));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('aidol_general_settings', JSON.stringify(settings));
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col h-full bg-[#f0f2f5] text-[#333] font-sans overflow-hidden">
      
      {/* TABS */}
      <div className="flex bg-white border-b border-gray-300">
        <button 
          onClick={() => setActiveTab('prompt')}
          className={`flex items-center gap-2 px-6 py-3 font-semibold text-sm transition-colors border-b-2 ${activeTab === 'prompt' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-blue-500'}`}
        >
          <Key size={16} /> API Prompt
        </button>
        <button 
          onClick={() => setActiveTab('main-character')}
          className={`flex items-center gap-2 px-6 py-3 font-semibold text-sm transition-colors border-b-2 ${activeTab === 'main-character' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-blue-500'}`}
        >
          <User size={16} /> Nhân vật Chính
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
          <Settings2 size={16} /> Cấu hình Nhanh
        </button>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 overflow-y-auto p-4 bg-[#f8f9fa]">
        
        {activeTab === 'prompt' && (
          <div className="max-w-4xl mx-auto space-y-4">
            
            {/* Box 1: API Keys */}
            <div className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
              <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 font-bold text-gray-800 text-sm">
                API Keys Cá nhân (Nhập vào nếu bạn chọn chế độ 'Dùng API Key Cá nhân')
              </div>
              <div className="p-4 space-y-3">
                
                <div className="flex items-center gap-4">
                  <label className="w-40 text-sm font-medium text-gray-700">OpenAI API Key:</label>
                  <input type="text" name="openaiKey" value={settings.openaiKey} onChange={handleChange} placeholder="Nhập API Key nếu muốn dùng ChatGPT hoặc giọng nói OpenAI" className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500" />
                </div>

                <div className="flex items-center gap-4">
                  <label className="w-40 text-sm font-medium text-gray-700">Google AI API Key:</label>
                  <input type="text" name="googleKey" value={settings.googleKey} onChange={handleChange} placeholder="Nhập API Key nếu muốn dùng các model Gemini của Google" className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500" />
                </div>

                <div className="flex items-center gap-4">
                  <label className="w-40 text-sm font-medium text-gray-700">ElevenLabs API Key:</label>
                  <input type="password" name="elevenlabsKey" value={settings.elevenlabsKey} onChange={handleChange} placeholder="Nhập API Key của bạn từ ElevenLabs" className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 font-mono tracking-widest" />
                </div>

                <div className="flex items-center gap-4">
                  <label className="w-40 text-sm font-medium text-gray-700">Minimax Group ID:</label>
                  <input type="text" name="minimaxGroupId" value={settings.minimaxGroupId} onChange={handleChange} placeholder="Nhập Group ID của bạn từ Minimax" className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500" />
                </div>

                <div className="flex items-center gap-4">
                  <label className="w-40 text-sm font-medium text-gray-700">Minimax API Key:</label>
                  <input type="password" name="minimaxKey" value={settings.minimaxKey} onChange={handleChange} placeholder="Nhập API Key của bạn từ Minimax" className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 font-mono tracking-widest" />
                </div>

                <button className="w-full mt-2 flex items-center justify-center gap-2 bg-[#1a73e8] hover:bg-blue-700 text-white font-medium py-2 rounded shadow-sm text-sm transition-colors">
                  <Download size={16} /> Tải danh sách giọng nói từ API Keys đã nhập
                </button>
              </div>
            </div>

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
                    name="systemPrompt"
                    value={settings.systemPrompt}
                    onChange={handleChange}
                    className="w-full flex-1 min-h-[120px] border border-gray-300 rounded p-3 text-sm focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-sm font-semibold text-[#a53b3b]">Kiến thức nền / Bối cảnh:</label>
                  <textarea 
                    name="backgroundContext"
                    value={settings.backgroundContext}
                    onChange={handleChange}
                    className="w-full flex-1 min-h-[120px] border border-gray-300 rounded p-3 text-sm focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>

              </div>
            </div>

          </div>
        )}

        {activeTab !== 'prompt' && (
          <div className="flex items-center justify-center h-full text-gray-500 font-medium text-lg">
            (Tính năng {activeTab} đang được phát triển...)
          </div>
        )}

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

    </div>
  );
}
