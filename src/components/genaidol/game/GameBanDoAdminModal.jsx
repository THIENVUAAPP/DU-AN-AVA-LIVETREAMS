import React, { useState, useEffect } from 'react';
import { 
  X, Shield, Play, Pause, RotateCcw, Award, Globe, Music, Volume2, 
  Sparkles, Gift, MapPin, Flag, CheckCircle, Copy, AlertTriangle, 
  Settings, RefreshCw, Zap, Sliders, ExternalLink, Trophy, Type,
  Compass, Sun, Eye, Trash2, Plus, VolumeX, Save, Check, Grid
} from 'lucide-react';
import bandoEngine, { DEFAULT_MAP_GIFTS, COUNTRY_PRESETS } from './bandoGameEngine';
import bandoAudio from './bandoAudioEngine';

export default function GameBanDoAdminModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('operations');
  const [gameState, setGameState] = useState(() => bandoEngine.state);
  const [customTitle, setCustomTitle] = useState(() => bandoEngine.state.settings.customMapTitle || '');
  const [totalCellsInput, setTotalCellsInput] = useState(() => bandoEngine.state.totalCells || 15125);
  const [copiedLink, setCopiedLink] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [brightness, setBrightness] = useState(() => bandoEngine.state.settings.brightness || 1.4);
  const [bgmVolume, setBgmVolume] = useState(() => bandoEngine.state.settings.bgmVolume ?? 0.35);
  const [sfxVolume, setSfxVolume] = useState(() => bandoEngine.state.settings.sfxVolume ?? 0.8);
  const [selectedCountry, setSelectedCountry] = useState(() => bandoEngine.state.selectedCountry || 'vietnam');

  // Form thêm nhãn toạ độ 3D
  const [newTextLabel, setNewTextLabel] = useState('');
  const [newTextColor, setNewTextColor] = useState('#facc15');
  const [newTextWX, setNewTextWX] = useState(0);
  const [newTextWZ, setNewTextWZ] = useState(0);
  const [newTextGlow, setNewTextGlow] = useState(true);

  useEffect(() => {
    const unsub = bandoEngine.subscribe((state) => {
      setGameState({ ...state });
      if (state.settings?.customMapTitle) setCustomTitle(state.settings.customMapTitle);
      if (state.totalCells) setTotalCellsInput(state.totalCells);
      if (state.settings?.brightness) setBrightness(state.settings.brightness);
      if (state.selectedCountry) setSelectedCountry(state.selectedCountry);
    });
    return () => unsub();
  }, []);

  if (!isOpen) return null;

  const handleCopyOverlayUrl = () => {
    const url = `${window.location.origin}${window.location.pathname}?overlay=bando`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSaveAll = () => {
    bandoEngine.updateSettings({
      customMapTitle: customTitle,
      brightness: parseFloat(brightness),
      bgmVolume: parseFloat(bgmVolume),
      sfxVolume: parseFloat(sfxVolume),
    });
    bandoEngine.saveToStorage();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleApplyTotalCells = (e) => {
    e.preventDefault();
    const count = parseInt(totalCellsInput);
    if (count >= 500 && count <= 100000) {
      bandoEngine.setTotalCells(count);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }
  };

  const handleSwitchCountry = (cKey) => {
    setSelectedCountry(cKey);
    bandoEngine.switchCountry(cKey);
  };

  const handleAdd3DMapText = (e) => {
    e.preventDefault();
    if (!newTextLabel.trim()) return;
    bandoEngine.addMapText({
      text: newTextLabel.trim(),
      wx: parseFloat(newTextWX) || 0,
      wy: 3.5,
      wz: parseFloat(newTextWZ) || 0,
      color: newTextColor,
      glow: newTextGlow,
    });
    setNewTextLabel('');
  };

  const handleDeleteMapText = (id) => {
    bandoEngine.removeMapText(id);
  };

  const handleSaveGiftCells = (giftId, newCells) => {
    const updated = (gameState.gifts || DEFAULT_MAP_GIFTS).map(g => 
      g.id === giftId ? { ...g, cells: Math.max(1, parseInt(newCells) || 1) } : g
    );
    bandoEngine.updateGiftConfig(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[92vh] bg-[#11131a] border border-white/15 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-gray-100 font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-black/40 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center shadow-lg shadow-red-500/20 ring-2 ring-yellow-400/40">
              <Shield size={20} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white tracking-wide">
                  ADMIN QUẢN TRỊ — GAME GHÉP CỜ QUỐC GIA & BẢN ĐỒ
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-600 text-white shadow-sm">
                  {gameState.roundId}
                </span>
                <span className="text-xs">{COUNTRY_PRESETS[selectedCountry]?.flag || '🇻🇳'}</span>
              </div>
              <p className="text-xs text-gray-400">
                Độ sáng cao cấp, ghim nhãn toạ độ 3D, số ô cờ, đa quốc gia & lưu cấu hình vĩnh viễn
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveAll}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md ${
                saveSuccess 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-black font-black'
              }`}
            >
              {saveSuccess ? <Check size={14} /> : <Save size={14} />}
              <span>{saveSuccess ? 'Đã Lưu Vĩnh Viễn!' : '💾 Lưu Vĩnh Viễn'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-6 py-2.5 bg-[#161922] border-b border-white/10 overflow-x-auto shrink-0 custom-scrollbar">
          {[
            { id: 'operations', label: '🎮 Vận Hành & Tiêu Đề' },
            { id: 'grid_cells', label: '🔢 Cài Đặt Số Ô Cờ' },
            { id: 'map_texts', label: '📍 Ghim Nhãn Địa Danh 3D' },
            { id: 'countries', label: '🌍 Bản Đồ Quốc Gia' },
            { id: 'gifts', label: '🎁 Cấu Hình Quà Tặng' },
            { id: 'provinces', label: '🗺️ Danh Sách Vùng Miền' },
            { id: 'audio', label: '🎵 Âm Nhạc & SFX' },
            { id: 'checklist', label: '🛠️ Link Live OBS / Studio' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-lg shadow-red-500/20'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-[#0f1118]">
          
          {/* TAB 1: OPERATIONS & TITLE CUSTOMIZATION */}
          {activeTab === 'operations' && (
            <div className="space-y-6">
              
              {/* Live Title Customization */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <Type size={16} className="text-yellow-400" /> Tùy Chỉnh Tiêu Đề Phiên Live Của Bạn
                  </h3>
                  <span className="text-[11px] text-gray-400">Tự động lưu vĩnh viễn trên máy</span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder="Nhập tiêu đề game hiển thị trên màn hình live..."
                    className="flex-1 px-3 py-2 bg-black/60 border border-white/20 rounded-xl text-xs text-yellow-300 font-bold focus:outline-none focus:border-yellow-400"
                  />
                  <button
                    onClick={handleSaveAll}
                    className="px-4 py-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs rounded-xl transition-all shrink-0"
                  >
                    Áp Dụng
                  </button>
                </div>
              </div>

              {/* Stat Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <div className="text-xs font-bold text-gray-400 mb-1">TIẾN ĐỘ GHÉP CỜ</div>
                  <div className="text-lg font-black text-yellow-400 uppercase">{gameState.percent}% ({gameState.claimedCount.toLocaleString()} / {gameState.totalCells.toLocaleString()} ô)</div>
                  <div className="text-xs text-gray-400 mt-2">
                    Còn lại: <strong className="text-white">{gameState.remainingCells.toLocaleString()}</strong> ô cờ
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <div className="text-xs font-bold text-gray-400 mb-1">QUỐC GIA ĐANG CHỌN</div>
                  <div className="text-lg font-black text-emerald-400 flex items-center gap-2">
                    <span>{COUNTRY_PRESETS[selectedCountry]?.flag}</span>
                    <span>{COUNTRY_PRESETS[selectedCountry]?.name}</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-2">
                    MVP: <strong className="text-white">{gameState.leaderboard[0]?.username || 'Chưa có'}</strong>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <div className="text-xs font-bold text-gray-400 mb-1">CHẾ ĐỘ MÀN HÌNH</div>
                  <div className="text-lg font-black text-blue-400">
                    {gameState.isDemoMode ? '🧪 Chế Độ Thử Nghiệm' : '🔴 Livestream Thật (Ẩn Test Bar)'}
                  </div>
                  <div className="text-xs text-gray-400 mt-2">
                    Góc nhìn: <strong className="text-white uppercase">{gameState.cameraPreset}</strong>
                  </div>
                </div>
              </div>

              {/* Display & Brightness Controls */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Sun size={16} className="text-yellow-400" /> Tùy Chỉnh Độ Sáng & Phân Quyền Test Quà
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Demo Mode Toggle */}
                  <div className="flex items-center justify-between p-4 bg-black/40 border border-white/10 rounded-xl">
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>Chế Độ Test Quà (Demo Mode)</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black ${gameState.isDemoMode ? 'bg-emerald-500/20 text-emerald-300' : 'bg-gray-500/20 text-gray-400'}`}>
                          {gameState.isDemoMode ? 'BẬT' : 'TẮT'}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-1">
                        Khi tắt, thanh test quà ở đáy màn hình sẽ ẩn hoàn toàn cho buổi live thật
                      </p>
                    </div>

                    <button
                      onClick={() => bandoEngine.setDemoMode(!gameState.isDemoMode)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        gameState.isDemoMode 
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                          : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      }`}
                    >
                      {gameState.isDemoMode ? 'Tắt Test' : 'Bật Test'}
                    </button>
                  </div>

                  {/* Brightness Slider */}
                  <div className="p-4 bg-black/40 border border-white/10 rounded-xl">
                    <div className="flex justify-between items-center text-xs font-bold text-white mb-2">
                      <span className="flex items-center gap-1.5"><Sun size={14} className="text-yellow-400" /> Độ Sáng 3D Bản Đồ</span>
                      <span className="text-yellow-400 font-mono font-black">{Math.round(brightness * 100)}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0.8" 
                      max="2.2" 
                      step="0.05" 
                      value={brightness}
                      onChange={(e) => {
                        const v = parseFloat(e.target.value);
                        setBrightness(v);
                        bandoEngine.updateSettings({ brightness: v });
                      }}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-400"
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 mt-1.5">
                      <span>Dịu mắt (80%)</span>
                      <span>Mặc định sáng (140%)</span>
                      <span>Rực rỡ (220%)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency Streamer Actions */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Zap size={16} className="text-yellow-400" /> Bảng Điều Khiển Sự Kiện Trực Tiếp
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button
                    onClick={() => bandoEngine.resetRound()}
                    className="p-3 bg-red-950/60 hover:bg-red-900/80 border border-red-500/40 text-red-200 rounded-xl font-bold text-xs flex flex-col items-center gap-1.5 transition-all"
                  >
                    <RotateCcw size={18} className="text-red-400" />
                    <span>Làm Mới Trận Đấu</span>
                  </button>

                  <button
                    onClick={() => bandoEngine.triggerBossEvent()}
                    className="p-3 bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/40 text-purple-200 rounded-xl font-bold text-xs flex flex-col items-center gap-1.5 transition-all"
                  >
                    <Sparkles size={18} className="text-purple-400" />
                    <span>Gọi Boss Thần Long</span>
                  </button>

                  <button
                    onClick={() => bandoEngine.triggerMission()}
                    className="p-3 bg-blue-950/60 hover:bg-blue-900/80 border border-blue-500/40 text-blue-200 rounded-xl font-bold text-xs flex flex-col items-center gap-1.5 transition-all"
                  >
                    <Zap size={18} className="text-blue-400" />
                    <span>Giao Nhiệm Vụ Tỉnh</span>
                  </button>

                  <button
                    onClick={() => bandoEngine.triggerVictory({ username: 'Admin Thử Nghiệm' })}
                    className="p-3 bg-yellow-950/60 hover:bg-yellow-900/80 border border-yellow-500/40 text-yellow-200 rounded-xl font-bold text-xs flex flex-col items-center gap-1.5 transition-all"
                  >
                    <Award size={18} className="text-yellow-400" />
                    <span>Bắn Pháo Hoa Thắng</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: GRID / CELL COUNT CONFIGURATION */}
          {activeTab === 'grid_cells' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-black text-white uppercase flex items-center gap-2">
                  <Grid size={16} className="text-yellow-400" /> Quản Lý & Tùy Chỉnh Số Ô Cờ Trên Bản Đồ
                </h3>
                <p className="text-xs text-gray-400">
                  Tăng hoặc giảm tổng số ô cờ trên bản đồ tùy theo thời lượng và quy mô buổi live của bạn
                </p>
              </div>

              {/* Quick preset selector & custom input */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                <div className="text-xs font-bold text-gray-300">Chọn Nhanh Số Lượng Ô Cờ Chuẩn:</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                  {[
                    { count: 3000, label: '3.000 Ô', desc: 'Live ngắn (15-30p)' },
                    { count: 5000, label: '5.000 Ô', desc: 'Live vừa (45-60p)' },
                    { count: 10000, label: '10.000 Ô', desc: 'Live tiêu chuẩn (1-2h)' },
                    { count: 15125, label: '15.125 Ô', desc: 'Mặc định sắc nét (2-3h)' },
                    { count: 25000, label: '25.000 Ô', desc: 'Live lớn (3-5h)' },
                    { count: 50000, label: '50.000 Ô', desc: 'Sự kiện Siêu Đua Top' },
                  ].map(p => (
                    <button
                      key={p.count}
                      onClick={() => {
                        setTotalCellsInput(p.count);
                        bandoEngine.setTotalCells(p.count);
                      }}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        gameState.totalCells === p.count
                          ? 'bg-gradient-to-r from-red-600 to-amber-600 border-yellow-400 text-white shadow-lg'
                          : 'bg-black/40 border-white/10 hover:bg-white/10 text-gray-300'
                      }`}
                    >
                      <div className="text-sm font-black font-mono">{p.label}</div>
                      <div className="text-[10px] text-gray-400 mt-1">{p.desc}</div>
                    </button>
                  ))}
                </div>

                {/* Custom input */}
                <form onSubmit={handleApplyTotalCells} className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center gap-3">
                  <div className="flex-1 w-full">
                    <label className="text-xs font-bold text-gray-300 block mb-1">Hoặc Nhập Số Ô Tự Do (500 - 100.000 ô):</label>
                    <input
                      type="number"
                      min="500"
                      max="100000"
                      value={totalCellsInput}
                      onChange={(e) => setTotalCellsInput(e.target.value)}
                      className="w-full px-3 py-2 bg-black/60 border border-white/20 rounded-xl text-xs font-mono font-bold text-yellow-400 focus:outline-none focus:border-yellow-400"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs rounded-xl shadow-lg transition-all self-end"
                  >
                    Tạo Lại Lưới Bản Đồ
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 3: TRUE 3D ANCHORED LANDMARKS */}
          {activeTab === 'map_texts' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-black text-white uppercase flex items-center gap-2">
                  <MapPin size={16} className="text-red-400" /> Ghim Nhãn Địa Danh 3D Theo Toạ Độ Thực Tế
                </h3>
                <p className="text-xs text-gray-400">
                  Tất cả nhãn địa danh được ghim trực tiếp vào toạ độ 3D của bản đồ. Khi xoay camera 360° hoặc zoom, nhãn di chuyển chuẩn xác theo vị trí địa lý!
                </p>
              </div>

              {/* Add New 3D Landmark Form */}
              <form onSubmit={handleAdd3DMapText} className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-3">
                <div className="text-xs font-bold text-yellow-400 uppercase flex items-center gap-1.5">
                  <Plus size={14} /> Thêm Địa Danh Mới Lên Bản Đồ
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="md:col-span-2">
                    <label className="text-[11px] text-gray-400 block mb-1">Tên địa danh / Dòng chữ:</label>
                    <input
                      type="text"
                      placeholder="Ví dụ: 🇻🇳 QUẦN ĐẢO HOÀNG SA"
                      value={newTextLabel}
                      onChange={(e) => setNewTextLabel(e.target.value)}
                      className="w-full px-3 py-2 bg-black/50 border border-white/20 rounded-xl text-xs text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-gray-400 block mb-1">Màu sắc:</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={newTextColor}
                        onChange={(e) => setNewTextColor(e.target.value)}
                        className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
                      />
                      <input
                        type="text"
                        value={newTextColor}
                        onChange={(e) => setNewTextColor(e.target.value)}
                        className="w-full px-2 py-1.5 bg-black/50 border border-white/20 rounded-lg text-xs font-mono text-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                    >
                      <Plus size={14} /> Ghim Lên 3D
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-400 pt-1">
                  <div className="flex items-center gap-2">
                    <span>Toạ độ X (Tây ↔ Đông):</span>
                    <input 
                      type="range" min="-120" max="120" value={newTextWX} 
                      onChange={(e) => setNewTextWX(e.target.value)} 
                      className="w-24 accent-yellow-400" 
                    />
                    <span className="font-mono text-white text-[11px]">{newTextWX}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span>Toạ độ Z (Bắc ↔ Nam):</span>
                    <input 
                      type="range" min="-150" max="180" value={newTextWZ} 
                      onChange={(e) => setNewTextWZ(e.target.value)} 
                      className="w-24 accent-yellow-400" 
                    />
                    <span className="font-mono text-white text-[11px]">{newTextWZ}</span>
                  </div>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={newTextGlow} 
                      onChange={(e) => setNewTextGlow(e.target.checked)} 
                      className="accent-yellow-400"
                    />
                    <span>Neon Glow</span>
                  </label>
                </div>
              </form>

              {/* Current Active 3D Labels */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-gray-300 uppercase">
                  Địa Danh Đang Ghim Trên Bản Đồ ({gameState.mapTexts?.length || 0})
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {gameState.mapTexts?.map((item) => (
                    <div key={item.id} className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color || '#facc15' }} />
                        <div>
                          <div className="text-xs font-black text-white">{item.text}</div>
                          <div className="text-[10px] text-gray-400 font-mono">
                            Toạ độ 3D: X={item.wx}, Z={item.wz} • {item.glow ? 'Viền Sáng Neon' : 'Tiêu Chuẩn'}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteMapText(item.id)}
                        className="p-1.5 text-gray-400 hover:text-red-400 bg-white/5 hover:bg-red-500/20 rounded-lg transition-colors"
                        title="Xóa nhãn địa danh này"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MULTI-COUNTRY CONFIGURATION */}
          {activeTab === 'countries' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-black text-white uppercase flex items-center gap-2">
                  <Globe size={16} className="text-blue-400" /> Hệ Thống Bản Đồ Đa Quốc Gia
                </h3>
                <p className="text-xs text-gray-400">
                  Tất cả các quốc gia đều được đồng bộ đầy đủ các chức năng ghép cờ, nhãn địa danh 3D, danh mục vùng miền và lưu trữ vĩnh viễn
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {Object.values(COUNTRY_PRESETS).map(country => (
                  <div
                    key={country.id}
                    onClick={() => handleSwitchCountry(country.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      selectedCountry === country.id
                        ? 'bg-gradient-to-tr from-red-950/70 to-slate-900 border-yellow-400 ring-2 ring-yellow-400/50 shadow-2xl scale-[1.02]'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-3xl">{country.flag}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 font-mono text-gray-300">
                        {country.code}
                      </span>
                    </div>
                    <div className="text-xs font-black text-white mb-1">{country.name}</div>
                    <p className="text-[11px] text-gray-400 truncate mb-3">{country.title}</p>

                    <div className="flex items-center justify-between text-[10px] text-gray-400 pt-2 border-t border-white/10">
                      <span>{country.labels.length} Địa danh 3D</span>
                      <span className="text-yellow-400 font-bold">
                        {selectedCountry === country.id ? 'Đang kích hoạt' : 'Bấm để chuyển'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: GIFTS CONFIGURATION */}
          {activeTab === 'gifts' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-white">DANH MỤC QUÀ TIKTOK & SỐ Ô CỜ QUY ĐỔI</h3>
                  <p className="text-xs text-gray-400">Chỉnh sửa số ô cờ nhận được cho từng món quà TikTok</p>
                </div>
                <button
                  onClick={() => bandoEngine.startAutoTestLoop()}
                  className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-black shadow-lg flex items-center gap-1.5"
                >
                  <Play size={13} /> Chạy Tự Động Test Toàn Bộ Quà
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {(gameState.gifts || DEFAULT_MAP_GIFTS).map((gift) => (
                  <div key={gift.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{gift.icon}</span>
                        <div>
                          <div className="text-xs font-black text-white">{gift.name}</div>
                          <div className="text-[10px] text-gray-400 capitalize">{gift.tier} • {gift.priceToken} xu</div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          bandoAudio.unlock();
                          bandoEngine.processGift(gift.id, 1, { id: 'admin_test', username: 'Admin Test 👑', avatar: '' });
                        }}
                        className="px-2 py-1 rounded bg-white/10 hover:bg-yellow-500 hover:text-black text-gray-300 text-[11px] font-bold transition-all"
                      >
                        Bấm Test
                      </button>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                      <span className="text-xs text-gray-400">Số ô cờ:</span>
                      <input
                        type="number"
                        min="1"
                        max="50000"
                        value={gift.cells}
                        onChange={(e) => handleSaveGiftCells(gift.id, e.target.value)}
                        className="w-24 px-2 py-1 bg-black/50 border border-white/20 rounded-lg text-xs font-mono font-bold text-yellow-400 text-right focus:outline-none focus:border-yellow-400"
                      />
                      <span className="text-xs text-yellow-300 font-bold">ô</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: PROVINCES & REGIONS */}
          {activeTab === 'provinces' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-black text-white uppercase">🗺️ Danh Sách Vùng Miền Của {COUNTRY_PRESETS[selectedCountry]?.name}</h3>
                <p className="text-xs text-gray-400">Theo dõi tiến độ ghép cờ của từng khu vực địa lý</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {Object.values(gameState.provincesStatus).map((prov) => {
                  const pct = Math.min(100, Math.round((prov.claimedCount / (prov.totalCells || 1)) * 100));
                  return (
                    <div key={prov.id} className="bg-white/5 border border-white/10 rounded-2xl p-3.5">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="text-xs font-black text-white flex items-center gap-1.5">
                          <MapPin size={12} className="text-red-400" />
                          <span>{prov.name}</span>
                        </div>
                        <span className={`text-[10px] font-bold font-mono ${prov.isCompleted ? 'text-emerald-400' : 'text-yellow-400'}`}>
                          {pct}%
                        </span>
                      </div>

                      <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden mb-2">
                        <div 
                          className={`h-full transition-all duration-300 ${prov.isCompleted ? 'bg-emerald-500' : 'bg-red-600'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-gray-400">
                        <span>Đã cắm: {prov.claimedCount} / {prov.totalCells} ô</span>
                        <span className="text-yellow-300 font-bold truncate max-w-[100px]">
                          {prov.leader ? `👑 ${prov.leader}` : 'Chưa có'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 7: AUDIO & SFX */}
          {activeTab === 'audio' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-black text-white uppercase">🎵 Âm Nhạc Hào Hùng & Hiệu Ứng SFX</h3>
                <p className="text-xs text-gray-400">Tùy chỉnh âm lượng nhạc nền BGM và tiếng kèn cắm cờ</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-5">
                <div>
                  <div className="flex justify-between items-center text-xs font-bold text-white mb-2">
                    <span className="flex items-center gap-1.5"><Music size={14} className="text-yellow-400" /> Âm Lượng Nhạc Nền (BGM)</span>
                    <span className="font-mono text-yellow-400">{Math.round(bgmVolume * 100)}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="1" step="0.05" value={bgmVolume}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      setBgmVolume(v);
                      bandoAudio.setBgmVolume(v);
                      bandoEngine.updateSettings({ bgmVolume: v });
                    }}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-400"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs font-bold text-white mb-2">
                    <span className="flex items-center gap-1.5"><Volume2 size={14} className="text-emerald-400" /> Âm Lượng Hiệu Ứng (SFX)</span>
                    <span className="font-mono text-emerald-400">{Math.round(sfxVolume * 100)}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="1" step="0.05" value={sfxVolume}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      setSfxVolume(v);
                      bandoAudio.setSfxVolume(v);
                      bandoEngine.updateSettings({ sfxVolume: v });
                    }}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                  />
                </div>

                <div className="pt-3 border-t border-white/10 flex flex-wrap gap-2">
                  <span className="text-xs text-gray-400 self-center mr-2">Bấm nghe thử:</span>
                  <button onClick={() => bandoAudio.playCellPop()} className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-xs rounded-lg">Cắm Cờ</button>
                  <button onClick={() => bandoAudio.playCombo(3)} className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-xs rounded-lg">Combo x3</button>
                  <button onClick={() => bandoAudio.playGiftFanfare('mythic')} className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-xs rounded-lg">Quà Thần Thoại</button>
                  <button onClick={() => bandoAudio.playVictory()} className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-xs rounded-lg">Chiến Thắng</button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: CHECKLIST & LIVE LINK */}
          {activeTab === 'checklist' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-black text-white uppercase">🛠️ Hướng Dẫn Tích Hợp TikTok LIVE Studio & OBS</h3>
                <p className="text-xs text-gray-400">Đường dẫn Overlay Trong Suốt để bắt hình trực tiếp vào phần mềm phát sóng</p>
              </div>

              <div className="bg-gradient-to-r from-red-950/60 via-purple-950/60 to-black border border-white/15 rounded-2xl p-5 space-y-4">
                <div className="text-xs font-bold text-yellow-400 uppercase tracking-wider flex items-center gap-2">
                  <ExternalLink size={16} /> Link Overlay Browser Source Cho OBS / TikTok LIVE Studio
                </div>

                <div className="flex items-center gap-2 bg-black/60 border border-white/20 p-2.5 rounded-xl">
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}${window.location.pathname}?overlay=bando`}
                    className="flex-1 bg-transparent text-xs font-mono text-yellow-300 outline-none truncate"
                  />
                  <button
                    onClick={handleCopyOverlayUrl}
                    className="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-400 text-black font-black text-xs rounded-lg transition-all flex items-center gap-1 shrink-0"
                  >
                    {copiedLink ? <CheckCircle size={13} /> : <Copy size={13} />}
                    <span>{copiedLink ? 'Đã Sao Chép!' : 'Sao Chép'}</span>
                  </button>
                </div>

                <div className="space-y-2 text-xs text-gray-300">
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-yellow-400">1.</span>
                    <span>Mở <strong>TikTok LIVE Studio</strong> hoặc <strong>OBS Studio</strong>.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-yellow-400">2.</span>
                    <span>Thêm nguồn <strong>Trình duyệt (Browser Source)</strong> và dán URL trên vào.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-yellow-400">3.</span>
                    <span>Đặt độ phân giải <strong>1080 x 1920</strong> (Dọc) hoặc <strong>1920 x 1080</strong> (Ngang). Màn hình sẽ tự động trong suốt và nổi bật!</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
