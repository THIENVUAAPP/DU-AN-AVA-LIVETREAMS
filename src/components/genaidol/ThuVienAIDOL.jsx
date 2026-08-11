import React, { useState } from 'react';
import { Sparkles, Plus, Search, UserSquare2, PlayCircle, Mic, ChevronDown, ChevronRight, Music, Play, Image as ImageIcon, Check } from 'lucide-react';

export default function ThuVienAIDOL() {
  const [viewMode, setViewMode] = useState('library'); // 'library' | 'create'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Local Storage State for AIDOL Library
  const [libraryItems, setLibraryItems] = useState(() => {
    const saved = localStorage.getItem('aidol_library');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Create Mode States
  const [newAidolName, setNewAidolName] = useState('AIDOL của tôi');
  const [newAidolCategory, setNewAidolCategory] = useState('livestream');
  const [newAidolMedia, setNewAidolMedia] = useState(null);
  
  const [speed, setSpeed] = useState(1.0);

  const CATEGORIES = [
    { id: 'all', name: 'Tất cả' },
    { id: 'livestream', name: 'Chuyên Livestream' },
    { id: 'sales', name: 'Tư Vấn Bán Hàng' },
    { id: 'dance', name: 'Chuyên Nhảy (Dance)' },
    { id: 'story', name: 'Kể Chuyện / Tâm Sự' },
  ];

  const handleSaveAidol = () => {
    if (!newAidolMedia) return alert("Vui lòng tải lên Ảnh tĩnh hoặc Video mẫu!");
    if (!newAidolName.trim()) return alert("Vui lòng nhập tên AIDOL!");
    
    const newItem = {
      id: Date.now().toString(),
      name: newAidolName,
      category: newAidolCategory,
      mediaUrl: newAidolMedia,
      type: newAidolMedia.includes('video') ? 'video' : 'image',
      createdAt: new Date().toISOString()
    };
    
    const updated = [newItem, ...libraryItems];
    setLibraryItems(updated);
    localStorage.setItem('aidol_library', JSON.stringify(updated));
    alert("Lưu AIDOL thành công!");
    setViewMode('library');
  };

  const handleDelete = (id) => {
    if(confirm("Bạn có chắc muốn xóa AIDOL này?")) {
      const updated = libraryItems.filter(item => item.id !== id);
      setLibraryItems(updated);
      localStorage.setItem('aidol_library', JSON.stringify(updated));
    }
  };

  // Lọc danh sách theo Category và Search
  const filteredLibrary = libraryItems.filter(item => {
    const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 text-white pb-24">
      
      {/* Top Banner & Mode Switcher */}
      <div className="bg-[#121216]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-black/40 border border-[#00FF66]/30 shadow-glow-green flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-8 h-8 text-[#00FF66]" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#00FF66] animate-pulse"></span>
              <span className="text-[10px] font-black text-[#00FF66] uppercase tracking-widest">AIDOL HUB</span>
            </div>
            <h1 className="text-3xl font-black text-white mb-2 tracking-tight">AIDOL của tôi</h1>
            <p className="text-sm text-gray-400 font-medium max-w-xl">
              Quản lý nhân vật, giọng mặc định và tạo mới AIDOL ảo cho các phiên Live và Video.
            </p>
          </div>
        </div>

        <div className="flex bg-black/40 p-1.5 rounded-xl border border-white/10">
           <button 
             onClick={() => setViewMode('library')}
             className={`px-6 py-3 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${viewMode === 'library' ? 'bg-[#00FF66]/20 text-[#00FF66] shadow-glow-green border border-[#00FF66]/40' : 'text-gray-400 hover:text-white border border-transparent'}`}
           >
             <UserSquare2 className="w-4 h-4" /> Thư viện
           </button>
           <button 
             onClick={() => setViewMode('create')}
             className={`px-6 py-3 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${viewMode === 'create' ? 'bg-[#00FF66]/20 text-[#00FF66] shadow-glow-green border border-[#00FF66]/40' : 'text-gray-400 hover:text-white border border-transparent'}`}
           >
             <Plus className="w-4 h-4" /> Tạo mới
           </button>
        </div>
      </div>

                <div className="bg-black/40 border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#00FF66]/5 rounded-full blur-[80px] pointer-events-none"></div>
             <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">THỐNG KÊ NETWORK</span>
                </div>
                <h2 className="text-2xl font-black text-white mb-2 tracking-tight">Dung lượng thư viện: <span className="text-[#00FF66]">{libraryItems.length}</span></h2>
                <p className="text-sm text-gray-400 font-medium">
                  Hệ thống lưu trữ AIDOL thực tế trên bộ nhớ trình duyệt (Local Storage).
                </p>
             </div>

             <div className="flex gap-4 relative z-10">
                <div className="bg-[#121216] border border-white/10 rounded-xl p-5 shadow-sm min-w-[120px]">
                   <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Nhân vật</div>
                   <div className="text-3xl font-black text-[#00FF66] mb-1">{libraryItems.length}</div>
                   <div className="text-[10px] font-bold text-gray-500">đang lưu</div>
                </div>
             </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            {CATEGORIES.map(cat => (
               <button 
                 key={cat.id} 
                 onClick={() => setSelectedCategory(cat.id)}
                 className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${selectedCategory === cat.id ? 'bg-[#00FF66] text-black shadow-glow-green' : 'bg-black/60 text-gray-400 hover:text-white border border-white/10'}`}
               >
                 {cat.name}
               </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm theo tên AIDOL..." 
                  className="w-full pl-9 pr-4 py-2 bg-black/60 border border-white/10 rounded-lg text-sm text-white focus:border-[#00FF66] outline-none transition-all shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Library Content */}
          {filteredLibrary.length === 0 ? (
            <div className="py-24 flex flex-col items-center justify-center text-center bg-[#121216]/60 rounded-2xl border border-white/10">
              <h3 className="text-xl font-black text-white mb-3">Chưa có AIDOL nào</h3>
              <p className="text-sm text-gray-400 font-medium max-w-sm mb-6">
                Tạo một hồ sơ AIDOL (từ Ảnh tĩnh hoặc Video mẫu) trước, rồi lưu để dùng lại cho mọi chức năng Lipsync và Livestream.
              </p>
              <button 
                onClick={() => setViewMode('create')}
                className="px-6 py-3 bg-[#00FF66] hover:bg-[#00CC52] text-black font-bold rounded-xl transition-colors flex items-center gap-2 shadow-glow-green"
              >
                <Plus className="w-5 h-5" /> Tạo AIDOL Mới Ngay
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredLibrary.map(item => (
                 <div key={item.id} className="bg-[#121216] border border-white/10 rounded-xl overflow-hidden hover:border-[#00FF66]/50 transition-colors group relative">
                    <div className="aspect-[3/4] bg-black/40 relative">
                       {item.type === 'video' ? (
                          <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-500">
                             <PlayCircle className="w-12 h-12" />
                          </div>
                       ) : (
                          <img src={item.mediaUrl} alt={item.name} className="w-full h-full object-cover" />
                       )}
                       <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                         <span className="text-[10px] font-bold text-[#00FF66] mb-1">{CATEGORIES.find(c => c.id === item.category)?.name}</span>
                         <h3 className="font-bold text-white text-sm truncate">{item.name}</h3>
                       </div>
                    </div>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      X
                    </button>
                 </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* --- CREATE MODE --- */}
      {viewMode === 'create' && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col lg:flex-row gap-6">
             <div className="flex-1 flex flex-col gap-6">
                
                {/* Settings Card */}
                <div className="bg-[#121216]/80 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-lg">
                   <h2 className="text-2xl font-black text-white mb-2">Thêm Mới AIDOL</h2>
                   <p className="text-[11px] text-gray-400 mb-6 font-medium max-w-md">
                      Tải lên Ảnh tĩnh hoặc Video mẫu và phân loại để hệ thống dễ dàng quản lý.
                   </p>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-300 mb-2">Tên AIDOL</label>
                        <input 
                          type="text" 
                          value={newAidolName}
                          onChange={(e) => setNewAidolName(e.target.value)}
                          placeholder="Ví dụ: MC Ngọc Huyền..." 
                          className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-xl text-sm font-bold text-white focus:border-[#00FF66] outline-none shadow-sm" 
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-300 mb-2">Danh mục (Ngành Hàng)</label>
                        <select 
                          value={newAidolCategory}
                          onChange={(e) => setNewAidolCategory(e.target.value)}
                          className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-xl text-sm font-bold text-white focus:border-[#00FF66] outline-none shadow-sm appearance-none"
                        >
                          {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                   </div>
                </div>

                {/* Upload Card */}
                <div className="bg-[#121216]/80 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-lg flex flex-col min-h-[300px]">
                   <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="font-bold text-white text-sm">Tải lên File Media (Ảnh tĩnh hoặc Video)</h3>
                      </div>
                      <label className="flex items-center gap-2 px-4 py-2 border border-[#00FF66]/50 bg-[#00FF66]/10 text-[#00FF66] rounded-lg shadow-sm hover:bg-[#00FF66]/20 transition-colors cursor-pointer">
                         <Plus className="w-4 h-4"/>
                         <div className="text-[10px] font-bold">Chọn File từ máy</div>
                         <input 
                           type="file" 
                           accept="image/*,video/*"
                           onChange={(e) => {
                             if(e.target.files[0]) {
                               const url = URL.createObjectURL(e.target.files[0]);
                               setNewAidolMedia(url);
                             }
                           }}
                           className="hidden" 
                         />
                      </label>
                   </div>

                   <div className="flex-1 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center bg-black/40 relative hover:border-[#00FF66]/30 transition-colors overflow-hidden">
                      {newAidolMedia ? (
                         <div className="w-full h-full p-2 flex justify-center items-center relative">
                           {newAidolMedia.includes('video') ? (
                             <video src={newAidolMedia} className="max-h-[250px] rounded-lg" controls />
                           ) : (
                             <img src={newAidolMedia} className="max-h-[250px] rounded-lg object-contain" />
                           )}
                           <button onClick={() => setNewAidolMedia(null)} className="absolute top-4 right-4 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white">X</button>
                         </div>
                      ) : (
                        <>
                          <div className="w-12 h-12 rounded-full bg-[#00FF66]/10 flex items-center justify-center text-[#00FF66] mb-3 shadow-glow-green border border-[#00FF66]/30">
                            <Sparkles className="w-5 h-5" />
                          </div>
                          <h4 className="font-bold text-white text-sm mb-1">Chưa có File (Ảnh/Video) nào</h4>
                          <p className="text-[11px] text-gray-500 max-w-xs text-center font-medium">
                            Hãy tải lên Ảnh tĩnh hoặc Video mẫu để tạo nhân vật
                          </p>
                        </>
                      )}
                   </div>
                </div>

                <div className="flex justify-end gap-3">
                   <button onClick={() => setViewMode('library')} className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-colors">
                     Hủy bỏ
                   </button>
                   <button onClick={handleSaveAidol} className="px-6 py-3 bg-[#00FF66] hover:bg-[#00CC52] text-black font-bold rounded-xl transition-colors shadow-glow-green">
                     Lưu Nhân Vật
                   </button>
                </div>

             </div>
          </div>
        </div>
      )}

    </div>
  );
}
