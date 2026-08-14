import React, { useState, useEffect, useRef } from 'react';
import { X, Search, Download, Plus, Star, Upload, Trash2, FolderPlus, User } from 'lucide-react';
import { 
  saveCharacterToIDB, 
  savePersonalTemplateToIDB, 
  loadAllPersonalTemplatesFromIDB, 
  deletePersonalTemplateFromIDB 
} from '../../utils/idbHelper';

const CATEGORIES = [
  'Tất cả',
  'Chuyên Livestream',
  'Tư Vấn Bán Hàng',
  'Kho Video Cảm Ơn',
  'Kho Âm Thanh',
  'Chuyên Nhảy (Dance)',
  'Kể Chuyện / Tâm Sự'
];

// Dữ liệu mẫu trang chủ (Chỉ Admin có quyền xoá/sửa, người dùng không thể xoá)
const MOCK_TEMPLATES = [
  {
    id: 'sys_tpl_1',
    name: 'Cô Giáo Ngân (Trang Chủ)',
    type: 'video',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    category: 'Chuyên Livestream',
    isVIP: true,
    isPersonal: false
  },
  {
    id: 'sys_tpl_2',
    name: 'Mẫu Ảnh Áo Cưới (Trang Chủ)',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800',
    category: 'Tư Vấn Bán Hàng',
    isVIP: false,
    isPersonal: false
  },
  {
    id: 'sys_tpl_3',
    name: 'Idol Nhảy Dance (Trang Chủ)',
    type: 'video',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    category: 'Chuyên Nhảy (Dance)',
    isVIP: true,
    isPersonal: false
  },
  {
    id: 'sys_tpl_4',
    name: 'Cô Gái Tâm Sự (Trang Chủ)',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800',
    category: 'Kể Chuyện / Tâm Sự',
    isVIP: false,
    isPersonal: false
  }
];

export default function TemplateLibraryModal({ isOpen, onClose, onAddTemplate }) {
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');
  const [isVIPUser, setIsVIPUser] = useState(false); // Mô phỏng trạng thái người dùng
  const [toastMsg, setToastMsg] = useState(null);
  const [personalTemplates, setPersonalTemplates] = useState([]);
  const personalFileInputRef = useRef(null);

  // Nạp toàn bộ template cá nhân đã lưu trên máy (IndexedDB)
  useEffect(() => {
    if (isOpen) {
      loadAllPersonalTemplatesFromIDB().then(savedList => {
        const loaded = savedList.map(tpl => ({
          ...tpl,
          url: URL.createObjectURL(tpl.fileData),
          isPersonal: true
        }));
        setPersonalTemplates(loaded);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Upload template cá nhân từ máy
  const handleUploadPersonal = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const tplName = prompt("Nhập tên cho Template / Nhân vật cá nhân:");
    if (!tplName || !tplName.trim()) {
      if (personalFileInputRef.current) personalFileInputRef.current.value = '';
      return;
    }

    const isVideo = file.type.startsWith('video/');
    const chosenCategory = activeCategory === 'Tất cả' ? 'Chuyên Livestream' : activeCategory;
    const newId = `personal_tpl_${Date.now()}`;

    const newTemplateItem = {
      id: newId,
      name: tplName.trim(),
      type: isVideo ? 'video' : 'image',
      category: chosenCategory,
      isVIP: false,
      isPersonal: true,
      fileData: file,
      createdAt: Date.now()
    };

    // Lưu vào IndexedDB (Lưu trên máy này)
    await savePersonalTemplateToIDB(newTemplateItem);

    // Tạo URL hiển thị và cập nhật state
    const createdUrl = URL.createObjectURL(file);
    setPersonalTemplates(prev => [{ ...newTemplateItem, url: createdUrl }, ...prev]);

    showToast(`✅ Đã kết nối và lưu template "${tplName}" vào máy!`);

    if (personalFileInputRef.current) {
      personalFileInputRef.current.value = '';
    }
  };

  // Xoá template cá nhân (chỉ cá nhân mới được xoá)
  const handleDeletePersonalTemplate = async (e, tpl) => {
    e.stopPropagation();
    if (!tpl.isPersonal) {
      showToast('🔒 Template của trang chủ chỉ có Quản trị viên (Admin) mới có quyền xoá!');
      return;
    }

    if (window.confirm(`Bạn có chắc chắn muốn xoá template cá nhân "${tpl.name}" khỏi máy không?`)) {
      await deletePersonalTemplateFromIDB(tpl.id);
      setPersonalTemplates(prev => prev.filter(item => item.id !== tpl.id));
      showToast(`🗑️ Đã xoá template cá nhân "${tpl.name}"!`);
    }
  };

  // Gộp danh sách: Template cá nhân của máy trước, sau đó là Template hệ thống
  const allTemplates = [...personalTemplates, ...MOCK_TEMPLATES];

  const filteredTemplates = allTemplates.filter(tpl => {
    const matchCat = activeCategory === 'Tất cả' || tpl.category === activeCategory;
    const matchSearch = tpl.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleDownload = (tpl) => {
    if (tpl.isVIP && !isVIPUser) {
      showToast('⚠️ Tính năng này yêu cầu MUA GÓI VIP để tải bản gốc về máy!');
      return;
    }
    showToast(`Đang tải file gốc của "${tpl.name}" về máy...`);
    const link = document.createElement('a');
    link.href = tpl.url;
    link.download = `${tpl.name}_Template.${tpl.type === 'video' ? 'mp4' : 'jpg'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddToLive = async (tpl) => {
    showToast(`⏳ Đang xử lý thêm "${tpl.name}" vào Live...`);
    
    try {
      let fileBlob = tpl.fileData;
      if (!fileBlob) {
        // Tải về dạng blob từ URL nếu là system template
        const res = await fetch(tpl.url);
        fileBlob = await res.blob();
      }
      
      const newChar = {
        id: `custom_from_tpl_${Date.now()}`,
        name: tpl.name,
        type: tpl.type,
        fileData: fileBlob
      };

      await saveCharacterToIDB(newChar);
      newChar.url = URL.createObjectURL(fileBlob);
      
      onAddTemplate(newChar);
      showToast(`✅ Đã thêm "${tpl.name}" vào danh sách nhân vật Live!`);
      onClose();
    } catch (e) {
      console.error(e);
      showToast('❌ Có lỗi xảy ra khi thêm Template vào Live!');
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0b0f19] w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl border border-gray-800 flex flex-col overflow-hidden text-gray-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-[#0f1422]">
          <div className="flex items-center gap-3">
            <Star className="text-yellow-500" />
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Thư viện Template VIP
                <span className="text-xs font-normal px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Lưu trữ Cục bộ trên Máy
                </span>
              </h2>
              <p className="text-xs text-gray-400">Template trang chủ được bảo vệ bởi Admin • Template cá nhân lưu trên máy của bạn</p>
            </div>
            {!isVIPUser && (
              <button 
                onClick={() => setIsVIPUser(true)}
                className="ml-3 px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded shadow-lg hover:opacity-90 transition-opacity"
              >
                Nâng cấp VIP (Mock)
              </button>
            )}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Top Controls: Categories, Upload & Search */}
        <div className="p-4 border-b border-gray-800 flex flex-col gap-4 bg-[#111623]">
          {/* Categories & Actions */}
          <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1 scrollbar-thin">
            <div className="flex items-center gap-2">
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
            </div>

            {/* Nút Kết nối File Video / Hình Ảnh Cá Nhân */}
            <div className="shrink-0">
              <button 
                onClick={() => personalFileInputRef.current?.click()}
                className="px-3.5 py-1.5 rounded-lg text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white flex items-center gap-2 shadow-md transition-all shrink-0 hover:scale-105"
                title="Tải lên hình ảnh/video từ máy tính của bạn và lưu trữ cục bộ"
              >
                <Upload size={16} />
                + Kết nối File Cá Nhân
              </button>
              <input 
                type="file" 
                ref={personalFileInputRef} 
                style={{ display: 'none' }} 
                accept="video/*,image/*" 
                onChange={handleUploadPersonal} 
              />
            </div>
          </div>

          {/* Search */}
          <div className="relative w-96 max-w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text"
              placeholder="Tìm theo tên AIDOL hoặc Template..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1c2233] border border-gray-700 text-white pl-9 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:border-green-500 transition-colors"
            />
          </div>
        </div>

        {/* Content: Templates Grid */}
        <div className="flex-1 p-6 overflow-y-auto bg-[#0b0f19]">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredTemplates.map(tpl => (
              <div 
                key={tpl.id} 
                className={`group relative bg-[#151a26] rounded-xl overflow-hidden border transition-all duration-300 ${
                  tpl.isPersonal ? 'border-blue-500/40 hover:border-blue-400' : 'border-gray-800 hover:border-green-500'
                }`}
              >
                {/* Media Preview */}
                <div className="aspect-[3/4] relative bg-black flex items-center justify-center overflow-hidden">
                  {tpl.type === 'video' ? (
                    <video src={tpl.url} className="w-full h-full object-cover" loop muted autoPlay playsInline />
                  ) : (
                    <img src={tpl.url} alt={tpl.name} className="w-full h-full object-cover" />
                  )}
                  
                  {/* Category & Badge overlay */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                    <span className="px-2 py-0.5 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold rounded">
                      {tpl.category}
                    </span>
                    {tpl.isPersonal ? (
                      <span className="px-2 py-0.5 bg-blue-600/90 text-white text-[10px] font-bold rounded flex items-center gap-1 shadow-sm">
                        <User size={10} /> Máy cá nhân
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-purple-600/80 text-white text-[10px] font-bold rounded shadow-sm">
                        ★ Trang chủ
                      </span>
                    )}
                  </div>

                  {/* Nút Xoá - CHỈ HIỂN THỊ TRÊN TEMPLATE CÁ NHÂN */}
                  {tpl.isPersonal && (
                    <button
                      onClick={(e) => handleDeletePersonalTemplate(e, tpl)}
                      className="absolute top-2 right-2 p-1.5 bg-red-600/90 hover:bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-md"
                      title="Xoá template cá nhân này khỏi máy"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>

                {/* Info & Actions */}
                <div className="p-3 absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent pt-12 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
                  <h3 className="font-bold text-white text-sm mb-2 truncate" title={tpl.name}>{tpl.name}</h3>
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
                      title={tpl.isVIP && !isVIPUser ? "Yêu cầu gói VIP để tải" : "Tải file về máy"}
                    >
                      <Download size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredTemplates.length === 0 && (
              <div className="col-span-full py-20 text-center text-gray-500 flex flex-col items-center justify-center gap-2">
                <Search size={32} className="opacity-40" />
                <p>Không tìm thấy Template nào phù hợp.</p>
                <button 
                  onClick={() => personalFileInputRef.current?.click()}
                  className="mt-2 text-xs text-blue-400 underline hover:text-blue-300"
                >
                  Tải lên template của riêng bạn ngay
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Toast */}
        {toastMsg && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-gray-800 border border-gray-600 text-white px-4 py-2.5 rounded-xl shadow-2xl z-50 text-sm flex items-center gap-2 animate-in slide-in-from-bottom-4">
            {toastMsg}
          </div>
        )}
      </div>
    </div>
  );
}
