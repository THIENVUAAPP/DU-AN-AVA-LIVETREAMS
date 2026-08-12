import React, { useState, useEffect } from 'react';
import { Sparkles, Plus, Search, UserSquare2, PlayCircle, Mic, ChevronDown, ChevronRight, Music, Play, Image as ImageIcon, Check } from 'lucide-react';

// Cấu hình IndexedDB để lưu trữ Video/Audio (Local Storage giới hạn 5MB)
const DB_NAME = 'AIDOL_DB';
const STORE_NAME = 'library_items';

const initDB = () => {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
};

export default function ThuVienAIDOL() {
  const [viewMode, setViewMode] = useState('library'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const [libraryItems, setLibraryItems] = useState([]);
  
  // Tải dữ liệu từ IndexedDB khi component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const db = await initDB();
        const tx = db.transaction(STORE_NAME, 'readonly');
        const req = tx.objectStore(STORE_NAME).getAll();
        req.onsuccess = () => {
          const items = req.result.map(item => ({
            ...item,
            // Tạo lại URL cho file Blob khi tải lại trang
            mediaUrl: item.fileBlob ? URL.createObjectURL(item.fileBlob) : item.mediaUrl
          }));
          // Sắp xếp mới nhất lên đầu
          setLibraryItems(items.sort((a,b) => b.createdAt.localeCompare(a.createdAt)));
        };
      } catch (err) {
        console.error("Lỗi tải IndexedDB:", err);
      }
    };
    loadData();
  }, []);
  
  const [newAidolName, setNewAidolName] = useState('AIDOL của tôi');
  const [newAidolCategory, setNewAidolCategory] = useState('livestream');
  const [newAidolMedia, setNewAidolMedia] = useState(null);
  const [newAidolFile, setNewAidolFile] = useState(null);
  
  const [speed, setSpeed] = useState(1.0);

  const CATEGORIES = [
    { id: 'all', name: 'Tất cả' },
    { id: 'livestream', name: 'Chuyên Livestream' },
    { id: 'sales', name: 'Tư Vấn Bán Hàng' },
    { id: 'thankyou', name: 'Kho Video Cảm Ơn' },
    { id: 'audio', name: 'Kho Âm Thanh' },
    { id: 'dance', name: 'Chuyên Nhảy (Dance)' },
    { id: 'story', name: 'Kể Chuyện / Tâm Sự' },
  ];

  const handleSaveAidol = async () => {
    if (!newAidolMedia || !newAidolFile) return alert("Vui lòng tải lên Ảnh tĩnh, Video hoặc Âm thanh!");
    if (!newAidolName.trim()) return alert("Vui lòng nhập tên AIDOL!");
    
    const newItem = {
      id: Date.now().toString(),
      name: newAidolName,
      category: newAidolCategory,
      type: newAidolMedia.type,
      fileBlob: newAidolFile, // Lưu trực tiếp File (Blob) vào IndexedDB
      createdAt: new Date().toISOString()
    };
    
    try {
      const db = await initDB();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).put(newItem);
      tx.oncomplete = () => {
        // Cập nhật State để hiển thị liền
        newItem.mediaUrl = newAidolMedia.url;
        setLibraryItems(prev => [newItem, ...prev]);
        setNewAidolName('');
        setNewAidolMedia(null);
        setNewAidolFile(null);
        setViewMode('library');
        alert("Lưu AIDOL/File thành công vào Kho!");
      };
    } catch (err) {
      alert("Lỗi khi lưu vào cơ sở dữ liệu: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if(confirm("Bạn có chắc muốn xóa File này khỏi Kho?")) {
      try {
        const db = await initDB();
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).delete(id);
        tx.oncomplete = () => {
          setLibraryItems(prev => prev.filter(item => item.id !== id));
        };
      } catch (err) {
        alert("Lỗi khi xóa: " + err.message);
      }
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
      {/* --- LIBRARY MODE --- */}
      {viewMode === 'library' && (
        <div className="flex flex-col gap-6">
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
                 <div key={item.id} className="bg-[#121216] border border-white/10 rounded-xl overflow-hidden hover:border-[#00FF66]/50 transition-colors group relative flex flex-col">
                    <div className="aspect-[3/4] bg-black/40 relative flex items-center justify-center">
                       {item.type === 'video' ? (
                          <video src={item.mediaUrl} className="w-full h-full object-contain" controls />
                       ) : item.type === 'audio' ? (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 p-4">
                            <Mic className="w-12 h-12 text-[#00FF66] mb-4" />
                            <audio src={item.mediaUrl} controls className="w-full h-10" />
                          </div>
                       ) : (
                          <img src={item.mediaUrl} alt={item.name} className="w-full h-full object-cover" />
                       )}
                       <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
                         <span className="text-[10px] font-bold text-[#00FF66] bg-black/50 px-2 py-1 rounded-full">{CATEGORIES.find(c => c.id === item.category)?.name}</span>
                       </div>
                       <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent pointer-events-none">
                         <h3 className="font-bold text-white text-sm truncate">{item.name}</h3>
                       </div>
                    </div>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10 shadow-lg"
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
                        <h3 className="font-bold text-white text-sm">Tải lên File Media (Ảnh, Video, Âm thanh)</h3>
                      </div>
                      <label className="flex items-center gap-2 px-4 py-2 border border-[#00FF66]/50 bg-[#00FF66]/10 text-[#00FF66] rounded-lg shadow-sm hover:bg-[#00FF66]/20 transition-colors cursor-pointer">
                         <Plus className="w-4 h-4"/>
                         <div className="text-[10px] font-bold">Chọn File từ máy</div>
                         <input 
                           type="file" 
                           accept="image/*,video/*,audio/*"
                           onChange={(e) => {
                             if(e.target.files[0]) {
                               const file = e.target.files[0];
                               const url = URL.createObjectURL(file);
                               let type = 'image';
                               if (file.type.includes('video')) type = 'video';
                               else if (file.type.includes('audio')) type = 'audio';
                               setNewAidolMedia({ url, type });
                               setNewAidolFile(file);
                             }
                           }}
                           className="hidden" 
                         />
                      </label>
                   </div>

                   <div className="flex-1 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center bg-black/40 relative hover:border-[#00FF66]/30 transition-colors overflow-hidden">
                      {newAidolMedia ? (
                         <div className="w-full h-full p-4 flex justify-center items-center relative">
                           {newAidolMedia.type === 'video' ? (
                             <video src={newAidolMedia.url} className="max-h-[250px] rounded-lg shadow-lg" controls autoPlay />
                           ) : newAidolMedia.type === 'audio' ? (
                             <div className="flex flex-col items-center">
                                <Mic className="w-16 h-16 text-[#00FF66] mb-4" />
                                <audio src={newAidolMedia.url} controls className="w-full max-w-[300px]" autoPlay />
                             </div>
                           ) : (
                             <img src={newAidolMedia.url} className="max-h-[250px] rounded-lg object-contain shadow-lg" />
                           )}
                           <button onClick={() => {
                             setNewAidolMedia(null);
                             setNewAidolFile(null);
                           }} className="absolute top-4 right-4 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold hover:bg-red-600 shadow-lg z-20">X</button>
                         </div>
                      ) : (
                        <React.Fragment>
                          <div className="w-12 h-12 rounded-full bg-[#00FF66]/10 flex items-center justify-center text-[#00FF66] mb-3 shadow-glow-green border border-[#00FF66]/30">
                            <Sparkles className="w-5 h-5" />
                          </div>
                          <h4 className="font-bold text-white text-sm mb-1">Chưa có File (Ảnh/Video) nào</h4>
                          <p className="text-[11px] text-gray-500 max-w-xs text-center font-medium">
                            Hãy tải lên Ảnh tĩnh hoặc Video mẫu để tạo nhân vật
                          </p>
                        </React.Fragment>
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
