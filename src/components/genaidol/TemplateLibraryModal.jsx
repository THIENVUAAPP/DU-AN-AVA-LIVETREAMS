import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Search, Download, Plus, Star, Upload, Trash2, User, 
  Sparkles, Play, Pause, Volume2, VolumeX, Maximize, Check
} from 'lucide-react';
import { 
  saveAidolItem, 
  loadAllAidolItems, 
  deleteAidolItem,
  DEFAULT_AIDOL_CATEGORIES,
  DEFAULT_SYSTEM_TEMPLATES
} from '../../utils/idbHelper';

export default function TemplateLibraryModal({ isOpen, onClose, onAddTemplate }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isVIPUser, setIsVIPUser] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);
  const [personalTemplates, setPersonalTemplates] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_AIDOL_CATEGORIES);
  const personalFileInputRef = useRef(null);

  // Nạp danh mục tuỳ chỉnh từ localStorage (chia sẻ chung với Web AIDOL)
  const refreshCategories = () => {
    try {
      const saved = localStorage.getItem('aidol_custom_categories');
      if (saved) {
        const parsed = JSON.parse(saved);
        setCategories([...DEFAULT_AIDOL_CATEGORIES, ...parsed]);
      } else {
        setCategories(DEFAULT_AIDOL_CATEGORIES);
      }
    } catch (e) {
      setCategories(DEFAULT_AIDOL_CATEGORIES);
    }
  };

  // Nạp toàn bộ dữ liệu từ AIDOL_DB
  const refreshItems = async () => {
    const savedList = await loadAllAidolItems();
    setPersonalTemplates(savedList);
  };

  useEffect(() => {
    if (isOpen) {
      refreshCategories();
      refreshItems();

      // Lắng nghe sự kiện đồng bộ tự động giữa các tab / modal
      const handleDBUpdate = () => {
        refreshItems();
      };
      window.addEventListener('aidol_db_updated', handleDBUpdate);
      return () => {
        window.removeEventListener('aidol_db_updated', handleDBUpdate);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Thêm chủ đề mới (đồng bộ cả web và app)
  const handleAddCategory = () => {
    const name = window.prompt("Nhập tên chủ đề mới:");
    if (!name || !name.trim()) return;
    
    const newCat = {
      id: 'custom_' + Date.now(),
      name: name.trim()
    };
    
    try {
      const saved = localStorage.getItem('aidol_custom_categories');
      let parsed = [];
      if (saved) {
        parsed = JSON.parse(saved);
      }
      parsed.push(newCat);
      localStorage.setItem('aidol_custom_categories', JSON.stringify(parsed));
      setCategories([...DEFAULT_AIDOL_CATEGORIES, ...parsed]);
      setActiveCategory(newCat.id);
      showToast(`✅ Đã tạo thêm chủ đề "${name.trim()}"!`);
    } catch (e) {
      console.error(e);
    }
  };

  // Upload template / AIDOL từ máy cá nhân (lưu vào AIDOL_DB dùng chung)
  const handleUploadPersonal = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const tplName = prompt("Nhập tên cho AIDOL / Nhân vật mẫu:", "AIDOL của tôi");
    if (!tplName || !tplName.trim()) {
      if (personalFileInputRef.current) personalFileInputRef.current.value = '';
      return;
    }

    const isVideo = file.type.startsWith('video/');
    const isAudio = file.type.startsWith('audio/');
    let chosenType = 'image';
    if (isVideo) chosenType = 'video';
    else if (isAudio) chosenType = 'audio';

    const chosenCategory = activeCategory === 'all' ? 'livestream' : activeCategory;

    const newItem = {
      id: `aidol_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      name: tplName.trim(),
      category: chosenCategory,
      type: chosenType,
      fileBlob: file,
      createdAt: new Date().toISOString(),
      isPersonal: true
    };

    // Lưu vào Unified AIDOL_DB
    await saveAidolItem(newItem);
    await refreshItems();

    showToast(`✅ Đã tải lên và lưu "${tplName.trim()}" vào Thư viện dùng chung!`);

    if (personalFileInputRef.current) {
      personalFileInputRef.current.value = '';
    }
  };

  // Xoá AIDOL cá nhân
  const handleDeleteItem = async (e, tpl) => {
    e.stopPropagation();
    if (!tpl.isPersonal) {
      showToast('🔒 Template trang chủ chỉ có Quản trị viên (Admin) mới có quyền xoá!');
      return;
    }

    if (window.confirm(`Bạn có chắc muốn xoá "${tpl.name}" khỏi Kho AIDOL?`)) {
      await deleteAidolItem(tpl.id);
      await refreshItems();
      showToast(`🗑️ Đã xoá "${tpl.name}" khỏi Kho!`);
    }
  };

  // Gộp danh sách: Template cá nhân (tải từ web/app) + Template mẫu mặc định hệ thống
  const allTemplates = [...personalTemplates, ...DEFAULT_SYSTEM_TEMPLATES];

  const filteredTemplates = allTemplates.filter(tpl => {
    const matchCat = activeCategory === 'all' || tpl.category === activeCategory;
    const matchSearch = (tpl.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleDownload = (tpl) => {
    if (tpl.isVIP && !isVIPUser) {
      showToast('⚠️ Tính năng này yêu cầu MUA GÓI VIP để tải bản gốc về máy!');
      return;
    }
    showToast(`Đang tải file gốc của "${tpl.name}" về máy...`);
    const link = document.createElement('a');
    link.href = tpl.mediaUrl || tpl.url;
    link.download = `${tpl.name}_AIDOL.${tpl.type === 'video' ? 'mp4' : 'jpg'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddToLive = (tpl) => {
    showToast(`⏳ Đang đưa "${tpl.name}" vào Live Studio...`);
    
    const charData = {
      id: tpl.id,
      name: tpl.name,
      type: tpl.type || 'image',
      url: tpl.mediaUrl || tpl.url
    };

    onAddTemplate(charData);
    showToast(`✅ Đã đồng bộ "${tpl.name}" vào luồng Live!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0b0f19] w-full max-w-6xl h-[88vh] rounded-2xl shadow-2xl border border-gray-800 flex flex-col overflow-hidden text-gray-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-[#0f1422]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 border border-green-500/40 flex items-center justify-center text-green-400">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                Kho Thư Viện AIDOL & Template VIP
                <span className="text-xs font-normal px-2.5 py-0.5 rounded-full bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/40 font-mono">
                  Đồng bộ 100% Web & App
                </span>
              </h2>
              <p className="text-xs text-gray-400">
                Tất cả hình ảnh & video mẫu đồng bộ trực tiếp giữa trang web và phần mềm Live Studio
              </p>
            </div>
            {!isVIPUser && (
              <button 
                onClick={() => setIsVIPUser(true)}
                className="ml-3 px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded-lg shadow-lg hover:opacity-90 transition-opacity"
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
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                    activeCategory === cat.id 
                      ? 'bg-[#00FF66] text-black shadow-[0_0_15px_rgba(0,255,102,0.4)]' 
                      : 'bg-[#1a202c] border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500'
                  }`}
                >
                  {cat.name}
                </button>
              ))}

              <button 
                onClick={handleAddCategory}
                className="px-3.5 py-1.5 rounded-full text-sm font-bold whitespace-nowrap bg-white/5 text-gray-300 hover:text-white border border-gray-700 border-dashed hover:border-[#00FF66]/50 flex items-center gap-1 transition-colors"
              >
                <Plus size={14} /> Thêm chủ đề
              </button>
            </div>

            {/* Nút Tải Lên / Kết Nối File Cá Nhân */}
            <div className="shrink-0">
              <button 
                onClick={() => personalFileInputRef.current?.click()}
                className="px-4 py-2 rounded-xl text-sm font-black bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-black flex items-center gap-2 shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all shrink-0 hover:scale-105"
                title="Tải lên hình ảnh hoặc video mẫu từ máy của bạn"
              >
                <Upload size={16} />
                + Tải Lên Video/Ảnh Mẫu
              </button>
              <input 
                type="file" 
                ref={personalFileInputRef} 
                style={{ display: 'none' }} 
                accept="video/*,image/*,audio/*" 
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
              className="w-full bg-[#1c2233] border border-gray-700 text-white pl-9 pr-4 py-2 rounded-xl text-sm focus:outline-none focus:border-[#00FF66] transition-colors"
            />
          </div>
        </div>

        {/* Content: Templates Grid matching Image 2 style */}
        <div className="flex-1 p-6 overflow-y-auto bg-[#0b0f19]">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredTemplates.map(tpl => {
              const catObj = categories.find(c => c.id === tpl.category) || { name: tpl.category || 'Chuyên Livestream' };
              const isVideo = tpl.type === 'video';

              return (
                <div 
                  key={tpl.id} 
                  className={`group relative bg-[#121622] rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col ${
                    tpl.isPersonal ? 'border-emerald-500/30 hover:border-emerald-400' : 'border-gray-800 hover:border-[#00FF66]/60'
                  }`}
                >
                  {/* Media Container with realistic Video/Image Preview */}
                  <div className="aspect-[3/4] relative bg-black/60 flex items-center justify-center overflow-hidden">
                    {isVideo ? (
                      <video 
                        src={tpl.mediaUrl || tpl.url} 
                        className="w-full h-full object-cover" 
                        controls 
                        playsInline 
                        preload="metadata"
                      />
                    ) : (
                      <img 
                        src={tpl.mediaUrl || tpl.url} 
                        alt={tpl.name} 
                        className="w-full h-full object-cover" 
                      />
                    )}
                    
                    {/* Category Overlay Tag (Top-Left) */}
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
                      <span className="px-2.5 py-0.5 bg-black/80 backdrop-blur-md text-[#00FF66] border border-[#00FF66]/30 text-[11px] font-bold rounded-md">
                        {catObj.name}
                      </span>
                    </div>

                    {/* Delete button (Top-Right) only for personal uploads */}
                    {tpl.isPersonal && (
                      <button
                        onClick={(e) => handleDeleteItem(e, tpl)}
                        className="absolute top-2.5 right-2.5 w-7 h-7 bg-red-600/90 hover:bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-20 flex items-center justify-center shadow-lg"
                        title="Xoá khỏi Kho"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}

                    {/* Bottom Title Label overlay (matching Image 2) */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none z-10">
                      <h3 className="font-bold text-white text-sm truncate tracking-tight">{tpl.name}</h3>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="p-3 bg-[#111624] border-t border-gray-800/80 flex items-center gap-2">
                    <button 
                      onClick={() => handleAddToLive(tpl)}
                      className="flex-1 bg-[#00FF66] hover:bg-[#00e65c] text-black text-xs font-black py-2 px-3 rounded-xl transition-colors text-center shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <Check size={14} />
                      Chọn Live
                    </button>
                    <button 
                      onClick={() => handleDownload(tpl)}
                      className="w-8 h-8 flex items-center justify-center bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-xl border border-gray-700 transition-colors"
                      title={tpl.isVIP && !isVIPUser ? "Yêu cầu Mua Gói VIP để tải về" : "Tải video/ảnh mẫu về máy"}
                    >
                      <Download size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
            
            {filteredTemplates.length === 0 && (
              <div className="col-span-full py-20 text-center text-gray-500 flex flex-col items-center justify-center gap-3">
                <Search size={36} className="opacity-40" />
                <p className="text-sm font-medium">Chưa có AIDOL hoặc Video nào trong chủ đề này.</p>
                <button 
                  onClick={() => personalFileInputRef.current?.click()}
                  className="px-4 py-2 bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/40 text-xs font-bold rounded-xl hover:bg-[#00FF66]/30 transition-colors"
                >
                  + Tải Lên Video/Ảnh Mới Ngay
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Toast */}
        {toastMsg && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 border border-emerald-500/50 text-white px-5 py-2.5 rounded-xl shadow-2xl z-50 text-sm font-bold flex items-center gap-2 animate-in slide-in-from-bottom-4">
            {toastMsg}
          </div>
        )}
      </div>
    </div>
  );
}
