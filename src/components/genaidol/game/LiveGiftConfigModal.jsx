import React, { useState, useEffect } from 'react';
import { 
  X, Gift, Sparkles, Plus, Trash2, Edit3, Save, RotateCcw, 
  Check, Search, Sliders, Play, Square, Eye, EyeOff, Shield,
  Flag, Award, Flame, Zap, Layers, RefreshCw
} from 'lucide-react';
import { 
  getGiftConfig, 
  saveGiftConfig, 
  resetGiftConfigToDefault,
  REGIONAL_FLAG_GIFTS,
  DEFAULT_STANDARD_GIFTS,
  DEFAULT_GIFT_MARQUEE_SETTINGS
} from '../../../utils/giftSyncService';

export default function LiveGiftConfigModal({
  isOpen,
  onClose,
  mode = 'map', // 'map' | 'battle' | 'shared'
  onTestGift
}) {
  const [config, setConfig] = useState(() => getGiftConfig(mode));
  const [activeSubTab, setActiveSubTab] = useState('regional'); // 'regional' | 'standard' | 'marquee'
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // State cho Form Thêm Quà Mới
  const [newGift, setNewGift] = useState({
    name: '',
    shortName: '',
    icon: '🎁',
    priceToken: 10,
    cells: 10,
    hpBuff: 50,
    tier: 'common',
    color: '#f59e0b'
  });

  // State cho Sửa quà trực tiếp
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({});

  useEffect(() => {
    if (isOpen) {
      setConfig(getGiftConfig(mode));
    }
  }, [isOpen, mode]);

  if (!isOpen) return null;

  // Xử lý lưu cấu hình vĩnh viễn
  const handleSaveAll = () => {
    const success = saveGiftConfig(mode, config);
    if (success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }
  };

  // Khôi phục mặc định
  const handleReset = () => {
    if (window.confirm('Bạn có chắc chắn muốn khôi phục danh mục quà tặng về mặc định ban đầu không?')) {
      const fresh = resetGiftConfigToDefault(mode);
      setConfig(fresh);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }
  };

  // Cập nhật cài đặt Marquee
  const handleMarqueeChange = (key, value) => {
    setConfig(prev => ({
      ...prev,
      marquee: {
        ...(prev.marquee || DEFAULT_GIFT_MARQUEE_SETTINGS),
        [key]: value
      }
    }));
  };

  // Bật/Tắt Quà 3 Miền
  const handleToggleRegionalGift = (index) => {
    setConfig(prev => {
      const list = [...(prev.regionalGifts || REGIONAL_FLAG_GIFTS)];
      list[index] = { ...list[index], enabled: list[index].enabled === false ? true : false };
      return { ...prev, regionalGifts: list };
    });
  };

  // Cập nhật giá/ô của Quà 3 Miền
  const handleUpdateRegionalGift = (index, field, value) => {
    setConfig(prev => {
      const list = [...(prev.regionalGifts || REGIONAL_FLAG_GIFTS)];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, regionalGifts: list };
    });
  };

  // Bật/Tắt Quà Tiêu Chuẩn
  const handleToggleStandardGift = (id) => {
    setConfig(prev => {
      const list = (prev.gifts || DEFAULT_STANDARD_GIFTS).map(g => {
        if (g.id === id) {
          return { ...g, enabled: g.enabled === false ? true : false };
        }
        return g;
      });
      return { ...prev, gifts: list };
    });
  };

  // Xóa món quà tiêu chuẩn
  const handleDeleteStandardGift = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa món quà này khỏi danh sách?')) {
      setConfig(prev => ({
        ...prev,
        gifts: (prev.gifts || []).filter(g => g.id !== id)
      }));
    }
  };

  // Bắt đầu sửa quà tiêu chuẩn
  const handleStartEdit = (gift) => {
    setEditingId(gift.id);
    setEditingData({ ...gift });
  };

  // Lưu sửa đổi món quà
  const handleSaveEdit = () => {
    if (!editingId) return;
    setConfig(prev => ({
      ...prev,
      gifts: (prev.gifts || []).map(g => g.id === editingId ? { ...editingData } : g)
    }));
    setEditingId(null);
    setEditingData({});
  };

  // Thêm quà mới
  const handleAddNewGift = (e) => {
    e.preventDefault();
    if (!newGift.name.trim()) return;

    const createdGift = {
      id: `custom_gift_${Date.now()}`,
      name: newGift.name.trim(),
      shortName: newGift.shortName?.trim() || newGift.name.trim(),
      icon: newGift.icon || '🎁',
      priceToken: parseInt(newGift.priceToken) || 1,
      cells: parseInt(newGift.cells) || 1,
      hpBuff: parseInt(newGift.hpBuff) || 50,
      tier: newGift.tier || 'common',
      color: newGift.color || '#f59e0b',
      enabled: true
    };

    setConfig(prev => ({
      ...prev,
      gifts: [createdGift, ...(prev.gifts || [])]
    }));

    setIsAddingNew(false);
    setNewGift({
      name: '',
      shortName: '',
      icon: '🎁',
      priceToken: 10,
      cells: 10,
      hpBuff: 50,
      tier: 'common',
      color: '#f59e0b'
    });
  };

  // Lọc danh sách quà chuẩn
  const filteredStandardGifts = (config.gifts || []).filter(g => {
    const matchSearch = !searchTerm.trim() || 
      g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.priceToken.toString().includes(searchTerm);
    const matchTier = tierFilter === 'all' || g.tier === tierFilter;
    return matchSearch && matchTier;
  });

  const marquee = config.marquee || DEFAULT_GIFT_MARQUEE_SETTINGS;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-gray-900 via-gray-950 to-black border border-amber-500/30 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-white">
        
        {/* MODAL HEADER */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-black/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-red-600 flex items-center justify-center shadow-lg shadow-red-600/30 text-xl">
              🎁
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-300 to-red-400 flex items-center gap-2">
                Cài Đặt Bảng Điện Cuộn Quà Tặng & Cắm Cờ
              </h2>
              <p className="text-xs text-gray-400">
                Tùy chỉnh 3 Quà Cắm Cờ 3 Miền, Kho quà TikTok Live và Bảng điện LED cuộn ngang trong suốt 100%
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {saveSuccess && (
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1.5 rounded-xl flex items-center gap-1.5 animate-pulse">
                <Check size={14} /> Đã lưu vĩnh viễn!
              </span>
            )}

            <button
              onClick={handleSaveAll}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-lg shadow-emerald-900/40 flex items-center gap-1.5 transition-all"
            >
              <Save size={14} /> Lưu Cấu Hình
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* SUB-TABS NAVIGATION */}
        <div className="px-4 pt-3 border-b border-white/10 bg-black/20 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('regional')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0 ${
              activeSubTab === 'regional'
                ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-lg'
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            <Flag size={14} /> 🚩 3 Quà Cắm Cờ 3 Miền (5 Xu)
          </button>

          <button
            onClick={() => setActiveSubTab('standard')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0 ${
              activeSubTab === 'standard'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            <Gift size={14} /> 🎁 Toàn Bộ Kho Quà ({config.gifts?.length || 0})
          </button>

          <button
            onClick={() => setActiveSubTab('marquee')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0 ${
              activeSubTab === 'marquee'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg'
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            <Sliders size={14} /> ⚡ Cấu Hình Bảng Điện Cuộn (Marquee)
          </button>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={handleReset}
              className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-gray-400 hover:text-gray-200 text-[11px] font-bold flex items-center gap-1"
              title="Khôi phục toàn bộ về gốc"
            >
              <RotateCcw size={12} /> Khôi Phục Gốc
            </button>
          </div>
        </div>

        {/* MODAL BODY */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar">
          
          {/* TAB 1: 3 QUÀ CẮM CỜ 3 MIỀN */}
          {activeSubTab === 'regional' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/40 via-amber-950/40 to-emerald-950/40 border border-yellow-500/30">
                <h3 className="text-sm font-black text-yellow-300 uppercase flex items-center gap-2 mb-1">
                  <Sparkles size={16} className="text-yellow-400 animate-spin" />
                  3 Món Quà Cắm Cờ Phân Vùng Miền Bắc - Miền Trung - Miền Nam
                </h3>
                <p className="text-xs text-gray-300">
                  Khi khán giả tặng các món quà này, hệ thống sẽ tự động định vị và cắm cờ chính xác vào các tỉnh thành thuộc khu vực tương ứng trên bản đồ 3D!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(config.regionalGifts || REGIONAL_FLAG_GIFTS).map((rg, idx) => {
                  let regionTheme = {
                    title: 'MIỀN BẮC',
                    border: 'border-red-500/40',
                    bg: 'from-red-950/60 to-black/80',
                    color: 'text-red-300',
                    tag: 'bg-red-500/20 text-red-300'
                  };
                  if (rg.regionTarget === 'central') {
                    regionTheme = {
                      title: 'MIỀN TRUNG',
                      border: 'border-amber-500/40',
                      bg: 'from-amber-950/60 to-black/80',
                      color: 'text-amber-300',
                      tag: 'bg-amber-500/20 text-amber-300'
                    };
                  } else if (rg.regionTarget === 'south') {
                    regionTheme = {
                      title: 'MIỀN NAM',
                      border: 'border-emerald-500/40',
                      bg: 'from-emerald-950/60 to-black/80',
                      color: 'text-emerald-300',
                      tag: 'bg-emerald-500/20 text-emerald-300'
                    };
                  }

                  return (
                    <div 
                      key={rg.id || idx}
                      className={`p-4 rounded-2xl bg-gradient-to-b ${regionTheme.bg} border ${regionTheme.border} flex flex-col justify-between space-y-3 shadow-xl relative overflow-hidden`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${regionTheme.tag}`}>
                          🚩 {regionTheme.title}
                        </span>
                        <button
                          onClick={() => handleToggleRegionalGift(idx)}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${
                            rg.enabled !== false ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40' : 'bg-white/10 text-gray-500'
                          }`}
                        >
                          {rg.enabled !== false ? 'BẬT' : 'TẮT'}
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <input
                          type="text"
                          value={rg.icon || '🎁'}
                          onChange={(e) => handleUpdateRegionalGift(idx, 'icon', e.target.value)}
                          className="w-12 h-12 rounded-xl bg-black/60 border border-white/20 text-2xl text-center outline-none focus:border-yellow-400"
                          title="Đổi emoji món quà"
                        />
                        <div className="flex-1 space-y-1">
                          <label className="text-[10px] text-gray-400 block font-bold">Tên Món Quà:</label>
                          <input
                            type="text"
                            value={rg.name || ''}
                            onChange={(e) => handleUpdateRegionalGift(idx, 'name', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-black/60 border border-white/20 text-xs text-white outline-none focus:border-yellow-400 font-bold"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/10">
                        <div>
                          <label className="text-[10px] text-gray-400 block font-mono">Giá Xu (Coins):</label>
                          <input
                            type="number"
                            min="1"
                            max="50000"
                            value={rg.priceToken || 5}
                            onChange={(e) => handleUpdateRegionalGift(idx, 'priceToken', parseInt(e.target.value) || 1)}
                            className="w-full px-2 py-1 rounded bg-black/60 border border-white/20 text-xs font-mono text-yellow-300 outline-none focus:border-yellow-400"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-400 block font-mono">Số Ô Cờ (+Ô):</label>
                          <input
                            type="number"
                            min="1"
                            max="50000"
                            value={rg.cells || 5}
                            onChange={(e) => handleUpdateRegionalGift(idx, 'cells', parseInt(e.target.value) || 1)}
                            className="w-full px-2 py-1 rounded bg-black/60 border border-white/20 text-xs font-mono text-emerald-400 outline-none focus:border-yellow-400"
                          />
                        </div>
                      </div>

                      {onTestGift && (
                        <button
                          onClick={() => onTestGift(rg)}
                          className="w-full py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-yellow-300 text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                        >
                          <Play size={11} fill="currentColor" /> Test Cắm Cờ {regionTheme.title}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: TOÀN BỘ KHO QUÀ TIÊU CHUẨN */}
          {activeSubTab === 'standard' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-1 max-w-md">
                  <div className="relative flex-1">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Tìm theo tên quà hoặc giá xu..."
                      className="w-full pl-8 pr-3 py-2 bg-black/50 border border-white/15 rounded-xl text-xs text-white placeholder-gray-500 outline-none focus:border-purple-400"
                    />
                  </div>

                  <select
                    value={tierFilter}
                    onChange={(e) => setTierFilter(e.target.value)}
                    className="px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-xs text-gray-300 outline-none focus:border-purple-400"
                  >
                    <option value="all">Tất cả hạng</option>
                    <option value="common">Phổ biến (1 - 10 xu)</option>
                    <option value="rare">Hiếm (20 - 499 xu)</option>
                    <option value="epic">Sử thi (500 - 2,999 xu)</option>
                    <option value="legendary">Huyền thoại (3,000+ xu)</option>
                  </select>
                </div>

                <button
                  onClick={() => setIsAddingNew(!isAddingNew)}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-black shadow-lg flex items-center gap-1.5 shrink-0"
                >
                  <Plus size={14} /> {isAddingNew ? 'Đóng Form' : '➕ Thêm Quà Mới'}
                </button>
              </div>

              {/* FORM THÊM QUÀ MỚI */}
              {isAddingNew && (
                <form onSubmit={handleAddNewGift} className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/40 space-y-3 animate-in fade-in duration-200">
                  <div className="text-xs font-black text-purple-300 uppercase flex items-center gap-1.5">
                    <Sparkles size={14} className="text-purple-400" />
                    <span>Thêm Món Quà Tặng Mới Vào Hệ Thống</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                    <div>
                      <label className="text-[10px] text-gray-400 block mb-1 font-bold">Emoji / Icon:</label>
                      <input
                        type="text"
                        value={newGift.icon}
                        onChange={(e) => setNewGift({ ...newGift, icon: e.target.value })}
                        className="w-full px-3 py-1.5 bg-black/60 border border-white/20 rounded-xl text-center text-lg text-white outline-none focus:border-purple-400"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-[10px] text-gray-400 block mb-1 font-bold">Tên Món Quà:</label>
                      <input
                        type="text"
                        value={newGift.name}
                        onChange={(e) => setNewGift({ ...newGift, name: e.target.value })}
                        placeholder="Ví dụ: Rồng Thần 3D, Cúp Vàng..."
                        className="w-full px-3 py-1.5 bg-black/60 border border-white/20 rounded-xl text-xs text-white outline-none focus:border-purple-400"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400 block mb-1 font-bold">Giá Xu (Coins):</label>
                      <input
                        type="number"
                        min="1"
                        value={newGift.priceToken}
                        onChange={(e) => setNewGift({ ...newGift, priceToken: e.target.value })}
                        className="w-full px-3 py-1.5 bg-black/60 border border-white/20 rounded-xl text-xs font-mono text-yellow-300 outline-none focus:border-purple-400"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400 block mb-1 font-bold">Số Ô Cờ (+Ô):</label>
                      <input
                        type="number"
                        min="1"
                        value={newGift.cells}
                        onChange={(e) => setNewGift({ ...newGift, cells: e.target.value })}
                        className="w-full px-3 py-1.5 bg-black/60 border border-white/20 rounded-xl text-xs font-mono text-emerald-400 outline-none focus:border-purple-400"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingNew(false)}
                      className="px-3 py-1.5 rounded-lg bg-white/10 text-gray-300 text-xs font-bold"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-black"
                    >
                      Thêm Món Quà Này
                    </button>
                  </div>
                </form>
              )}

              {/* DANH SÁCH THẺ QUÀ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-96 overflow-y-auto custom-scrollbar p-1">
                {filteredStandardGifts.map((gift) => {
                  const isEditing = editingId === gift.id;

                  if (isEditing) {
                    return (
                      <div key={gift.id} className="p-3 rounded-2xl bg-amber-950/40 border border-amber-500/50 space-y-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editingData.icon || ''}
                            onChange={(e) => setEditingData({ ...editingData, icon: e.target.value })}
                            className="w-10 h-10 rounded-lg bg-black/60 border border-white/20 text-center text-xl text-white outline-none"
                          />
                          <input
                            type="text"
                            value={editingData.name || ''}
                            onChange={(e) => setEditingData({ ...editingData, name: e.target.value })}
                            className="flex-1 px-2 py-1 rounded-lg bg-black/60 border border-white/20 text-xs text-white font-bold outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[9px] text-gray-400">Xu:</label>
                            <input
                              type="number"
                              value={editingData.priceToken || 1}
                              onChange={(e) => setEditingData({ ...editingData, priceToken: parseInt(e.target.value) || 1 })}
                              className="w-full px-2 py-1 rounded bg-black/60 border border-white/20 text-xs font-mono text-yellow-300 outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] text-gray-400">Ô Cờ (+Ô):</label>
                            <input
                              type="number"
                              value={editingData.cells || 1}
                              onChange={(e) => setEditingData({ ...editingData, cells: parseInt(e.target.value) || 1 })}
                              className="w-full px-2 py-1 rounded bg-black/60 border border-white/20 text-xs font-mono text-emerald-400 outline-none"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-1.5 pt-1">
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-2.5 py-1 rounded bg-white/10 text-gray-300 text-xs font-bold"
                          >
                            Hủy
                          </button>
                          <button
                            onClick={handleSaveEdit}
                            className="px-3 py-1 rounded bg-emerald-600 text-white text-xs font-black flex items-center gap-1"
                          >
                            <Check size={12} /> Lưu
                          </button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div 
                      key={gift.id}
                      className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                        gift.enabled !== false 
                          ? 'bg-black/40 border-white/10 hover:border-yellow-400/40' 
                          : 'bg-black/20 border-white/5 opacity-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xl shrink-0">{gift.icon}</span>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white truncate">{gift.name}</div>
                          <div className="flex items-center gap-1.5 text-[10px] font-mono">
                            <span className="text-yellow-300 font-bold">{gift.priceToken} xu</span>
                            <span className="text-gray-500">•</span>
                            <span className="text-emerald-400 font-bold">+{gift.cells} ô</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleToggleStandardGift(gift.id)}
                          className={`px-2 py-0.8 rounded text-[9.5px] font-black ${
                            gift.enabled !== false ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-white/10 text-gray-500'
                          }`}
                        >
                          {gift.enabled !== false ? 'BẬT' : 'TẮT'}
                        </button>
                        <button
                          onClick={() => handleStartEdit(gift)}
                          className="p-1 rounded bg-white/5 hover:bg-white/15 text-amber-300"
                          title="Sửa món quà này"
                        >
                          <Edit3 size={12} />
                        </button>
                        <button
                          onClick={() => handleDeleteStandardGift(gift.id)}
                          className="p-1 rounded bg-white/5 hover:bg-red-500/30 text-gray-400 hover:text-red-400"
                          title="Xóa món quà này"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: CẤU HÌNH BẢNG ĐIỆN CUỘN MARQUEE */}
          {activeSubTab === 'marquee' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/40">
                <h3 className="text-sm font-black text-cyan-300 uppercase flex items-center gap-2 mb-1">
                  <Sparkles size={16} className="text-cyan-400" />
                  Tùy Chỉnh Hiệu Ứng Bảng Điện LED Cuộn Ngang (Marquee Ticker)
                </h3>
                <p className="text-xs text-gray-300">
                  Bảng điện chạy ngang hiển thị các phần quà và số ô cờ cắm tương ứng, thiết kế nền trong suốt tinh tế không làm che khuất đồ họa game!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* BẬT / TẮT BẢNG ĐIỆN */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                  <label className="text-xs font-black text-gray-200 block uppercase">
                    Trạng Thái Hiển Thị Bảng Điện:
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleMarqueeChange('enabled', true)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
                        marquee.enabled !== false 
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg' 
                          : 'bg-white/5 text-gray-400'
                      }`}
                    >
                      <Eye size={14} /> Đang Bật Bảng Điện
                    </button>
                    <button
                      onClick={() => handleMarqueeChange('enabled', false)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
                        marquee.enabled === false 
                          ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-lg' 
                          : 'bg-white/5 text-gray-400'
                      }`}
                    >
                      <EyeOff size={14} /> Tắt Ẩn Bảng Điện
                    </button>
                  </div>
                </div>

                {/* TỐC ĐỘ CUỘN */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                  <label className="text-xs font-black text-gray-200 block uppercase">
                    Tốc Độ Cuộn Bảng Điện:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'slow', label: '🐢 Chậm (50s)' },
                      { id: 'normal', label: '🚶 Vừa (30s)' },
                      { id: 'fast', label: '⚡ Nhanh (18s)' }
                    ].map(spd => (
                      <button
                        key={spd.id}
                        onClick={() => handleMarqueeChange('speed', spd.id)}
                        className={`py-2 rounded-xl text-xs font-bold transition-all ${
                          marquee.speed === spd.id 
                            ? 'bg-cyan-600 text-white shadow-md' 
                            : 'bg-white/5 text-gray-400 hover:text-white'
                        }`}
                      >
                        {spd.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ĐỘ TRONG SUỐT CỦA NỀN */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                  <label className="text-xs font-black text-gray-200 block uppercase">
                    Độ Trong Suốt Nền (Không Che Màn Hình):
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'ultra_transparent', label: '✨ Trong suốt 100%' },
                      { id: 'glassmorphism', label: '🪟 Kính Mờ (Glass)' },
                      { id: 'semi_dark', label: '⬛ Nền Tối Đậm' }
                    ].map(op => (
                      <button
                        key={op.id}
                        onClick={() => handleMarqueeChange('opacityMode', op.id)}
                        className={`py-2 rounded-xl text-[11px] font-bold transition-all ${
                          (marquee.opacityMode || 'ultra_transparent') === op.id 
                            ? 'bg-amber-600 text-white shadow-md' 
                            : 'bg-white/5 text-gray-400 hover:text-white'
                        }`}
                      >
                        {op.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* VỊ TRÍ BẢNG ĐIỆN */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                  <label className="text-xs font-black text-gray-200 block uppercase">
                    Vị Trí Hiển Thị Trên Live:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'bottom', label: '⬇️ Dưới Đáy Màn Hình' },
                      { id: 'top', label: '⬆️ Trên Đỉnh' },
                      { id: 'floating', label: '🖱️ Tự Do Kéo Thả' }
                    ].map(pos => (
                      <button
                        key={pos.id}
                        onClick={() => handleMarqueeChange('position', pos.id)}
                        className={`py-2 rounded-xl text-[11px] font-bold transition-all ${
                          (marquee.position || 'bottom') === pos.id 
                            ? 'bg-purple-600 text-white shadow-md' 
                            : 'bg-white/5 text-gray-400 hover:text-white'
                        }`}
                      >
                        {pos.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* TIÊU ĐỀ BẢNG ĐIỆN */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2 md:col-span-2">
                  <label className="text-xs font-black text-gray-200 block uppercase">
                    Tiêu Đề Bảng Điện LED:
                  </label>
                  <input
                    type="text"
                    value={marquee.tickerTitle || '🎁 QUÀ TẶNG & CẮM CỜ:'}
                    onChange={(e) => handleMarqueeChange('tickerTitle', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-white/20 text-xs text-yellow-300 font-black outline-none focus:border-yellow-400"
                  />
                </div>

              </div>
            </div>
          )}

        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 border-t border-white/10 bg-black/50 flex items-center justify-between">
          <span className="text-xs text-gray-400 flex items-center gap-1.5">
            <Sparkles size={14} className="text-yellow-400" />
            Cấu hình sẽ được lưu vào bộ nhớ máy và tự động đồng bộ trên toàn bộ phiên live.
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 text-xs font-bold"
            >
              Đóng Lại
            </button>
            <button
              onClick={handleSaveAll}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-lg shadow-emerald-900/40 flex items-center gap-1.5"
            >
              <Save size={14} /> 💾 LƯU CẤU HÌNH VĨNH VIỄN
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
