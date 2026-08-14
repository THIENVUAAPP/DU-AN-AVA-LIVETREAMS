import React, { useState } from 'react';
import { X, Search, Download, Plus, Star } from 'lucide-react';
import { saveCharacterToIDB } from '../../utils/idbHelper';

const CATEGORIES = [
  'Tất cả',
  'Chuyên Livestream',
  'Tư Vấn Bán Hàng',
  'Kho Video Cảm Ơn',
  'Kho Âm Thanh',
  'Chuyên Nhảy (Dance)',
  'Kể Chuyện / Tâm Sự'
];

// Dữ liệu mẫu (mock) cho thư viện Template
const MOCK_TEMPLATES = [
  {
    id: 'tpl_1',
    name: 'Cô Giáo Ngân',
    type: 'video',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    category: 'Chuyên Livestream',
    isVIP: true
  },
  {
    id: 'tpl_2',
    name: 'Mẫu Ảnh Áo Cưới',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800',
    category: 'Tư Vấn Bán Hàng',
    isVIP: false
  },
  {
    id: 'tpl_3',
    name: 'Idol Nhảy Dance',
    type: 'video',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    category: 'Chuyên Nhảy (Dance)',
    isVIP: true
  },
  {
    id: 'tpl_4',
    name: 'Cô Gái Tâm Sự',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800',
    category: 'Kể Chuyện / Tâm Sự',
    isVIP: false
  }
];

export default function TemplateLibraryModal({ isOpen, onClose, onAddTemplate }) {
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');
  const [isVIPUser, setIsVIPUser] = useState(false); // Mô phỏng trạng thái người dùng (false = chưa mua gói)
  const [toastMsg, setToastMsg] = useState(null);

  if (!isOpen) return null;

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const filteredTemplates = MOCK_TEMPLATES.filter(tpl => {
    const matchCat = activeCategory === 'Tất cả' || tpl.category === activeCategory;
    const matchSearch = tpl.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleDownload = (tpl) => {
    if (tpl.isVIP && !isVIPUser) {
      showToast('⚠️ Tính năng này yêu cầu MUA GÓI VIP để tải bản gốc về máy!');
      return;
    }
    // Giả lập tải xuống
    showToast(`Đang tải file gốc của "${tpl.name}" về máy...`);
    const link = document.createElement('a');
    link.href = tpl.url;
    link.download = `${tpl.name}_Template.${tpl.type === 'video' ? 'mp4' : 'jpg'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddToLive = async (tpl) => {
    // Để thêm vào danh sách CustomCharacters, ta cần tải file về dạng Blob và lưu vào IndexedDB
    showToast(`⏳ Đang xử lý thêm "${tpl.name}" vào Live...`);
    
    try {
      const res = await fetch(tpl.url);
      const blob = await res.blob();
      
      const newChar = {
        id: `custom_tpl_${Date.now()}`,
        name: tpl.name,
        type: tpl.type,
        fileData: blob
      };

      await saveCharacterToIDB(newChar);
      
      // Tạo Object URL cho bộ nhớ tạm thời của trình duyệt
      newChar.url = URL.createObjectURL(blob);
      
      onAddTemplate(newChar);
      showToast(`✅ Đã thêm "${tpl.name}" thành công!`);
      onClose(); // Đóng thư viện
    } catch (e) {
      console.error(e);
      showToast('❌ Có lỗi xảy ra khi thêm Template!');
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0b0f19] w-full max-w-5xl h-[80vh] rounded-2xl shadow-2xl border border-gray-800 flex flex-col overflow-hidden text-gray-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <Star className="text-yellow-500" />
            <h2 className="text-xl font-bold text-white">Thư viện Template VIP</h2>
            {!isVIPUser && (
              <button 
                onClick={() => setIsVIPUser(true)}
                className="ml-4 px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded shadow-lg hover:opacity-90 transition-opacity"
              >
                Nâng cấp VIP (Mock)
              </button>
            )}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Top Controls: Categories & Search */}
        <div className="p-4 border-b border-gray-800 flex flex-col gap-4 bg-[#111623]">
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeCategory === cat 
                    ? 'bg-green-500 text-white shadow-[0_0_10px_rgba(34,197,94,0.4)]' 
                    : 'bg-transparent border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500'
                }`}
              >
                {cat}
              </button>
            ))}
            <button className="px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap bg-gray-800/50 text-gray-400 border border-gray-700 hover:text-white flex items-center gap-1">
              <Plus size={14} /> Thêm chủ đề
            </button>
          </div>

          {/* Search */}
          <div className="relative w-96 max-w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text"
              placeholder="Tìm theo tên AIDOL..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1c2233] border border-gray-700 text-white pl-9 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:border-green-500 transition-colors"
            />
          </div>
        </div>

        {/* Content: Templates Grid */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredTemplates.map(tpl => (
              <div key={tpl.id} className="group relative bg-[#151a26] rounded-xl overflow-hidden border border-gray-800 hover:border-green-500 transition-all duration-300">
                {/* Media Preview */}
                <div className="aspect-[3/4] relative bg-black">
                  {tpl.type === 'video' ? (
                    <video src={tpl.url} className="w-full h-full object-cover" loop muted autoPlay playsInline />
                  ) : (
                    <img src={tpl.url} alt={tpl.name} className="w-full h-full object-cover" />
                  )}
                  {/* Category Badge overlay */}
                  <div className="absolute top-2 left-2 px-2 py-1 bg-green-500/80 backdrop-blur-sm text-white text-[10px] font-bold rounded">
                    {tpl.category}
                  </div>
                </div>

                {/* Info & Actions */}
                <div className="p-3 absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-12 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="font-bold text-white text-sm mb-2 truncate">{tpl.name}</h3>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleAddToLive(tpl)}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-2 px-2 rounded transition-colors text-center"
                    >
                      Thêm vào Live
                    </button>
                    <button 
                      onClick={() => handleDownload(tpl)}
                      className="w-8 h-8 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                      title="Tải về máy"
                    >
                      <Download size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredTemplates.length === 0 && (
              <div className="col-span-full py-20 text-center text-gray-500">
                Không tìm thấy kết quả nào phù hợp.
              </div>
            )}
          </div>
        </div>

        {/* Toast */}
        {toastMsg && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-gray-800 border border-gray-600 text-white px-4 py-2 rounded shadow-2xl z-50 text-sm flex items-center gap-2 animate-in slide-in-from-bottom-4">
            {toastMsg}
          </div>
        )}
      </div>
    </div>
  );
}
