import React, { useState, useEffect } from 'react';
import { 
  X, Shield, Play, Pause, RotateCcw, Award, Globe, Music, Volume2, 
  Sparkles, Gift, MapPin, Flag, CheckCircle, Copy, AlertTriangle, 
  Settings, RefreshCw, Zap, Sliders, ExternalLink, Trophy, Type,
  Compass, Sun, Eye, Trash2, Plus, VolumeX
} from 'lucide-react';
import bandoEngine, { DEFAULT_MAP_GIFTS, HONOR_TIERS } from './bandoGameEngine';
import bandoAudio from './bandoAudioEngine';

const COUNTRIES_LIST = [
  { id: 'vietnam', name: 'Việt Nam 🇻🇳', flag: '🇻🇳', code: 'VN', color: '#da251d', desc: 'Bản đồ hình chữ S thiêng liêng và 2 quần đảo Hoàng Sa - Trường Sa' },
  { id: 'japan', name: 'Nhật Bản 🇯🇵', flag: '🇯🇵', code: 'JP', color: '#bc002d', desc: 'Đất nước Mặt Trời Mọc' },
  { id: 'korea', name: 'Hàn Quốc 🇰🇷', flag: '🇰🇷', code: 'KR', color: '#0047a0', desc: 'Xứ sở Kim Chi' },
  { id: 'france', name: 'Pháp 🇫🇷', flag: '🇫🇷', code: 'FR', color: '#0055a4', desc: 'Kinh đô Ánh Sáng' },
  { id: 'germany', name: 'Đức 🇩🇪', flag: '🇩🇪', code: 'DE', color: '#ffcc00', desc: 'Cộng hòa Liên bang Đức' },
  { id: 'usa', name: 'Hoa Kỳ 🇺🇸', flag: '🇺🇸', code: 'US', color: '#b22234', desc: 'Hợp chúng quốc Hoa Kỳ' },
];

export default function GameBanDoAdminModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('operations');
  const [gameState, setGameState] = useState(() => bandoEngine.state);
  const [giftsList, setGiftsList] = useState(() => DEFAULT_MAP_GIFTS);
  const [copiedLink, setCopiedLink] = useState(false);
  const [bgmVolume, setBgmVolume] = useState(0.35);
  const [sfxVolume, setSfxVolume] = useState(0.8);
  const [brightness, setBrightness] = useState(1.4);
  const [selectedCountry, setSelectedCountry] = useState('vietnam');
  const [newTextLabel, setNewTextLabel] = useState('');
  const [newTextColor, setNewTextColor] = useState('#facc15');
  const [newTextX, setNewTextX] = useState(50);
  const [newTextY, setNewTextY] = useState(50);
  const [newTextGlow, setNewTextGlow] = useState(true);

  useEffect(() => {
    const unsub = bandoEngine.subscribe((state) => {
      setGameState({ ...state });
      if (state.settings?.brightness) setBrightness(state.settings.brightness);
      if (state.settings?.bgmVolume !== undefined) setBgmVolume(state.settings.bgmVolume);
      if (state.settings?.sfxVolume !== undefined) setSfxVolume(state.settings.sfxVolume);
      if (state.settings?.selectedCountry) setSelectedCountry(state.settings.selectedCountry);
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

  const handleSaveGiftCells = (giftId, newCells) => {
    const updated = giftsList.map(g => g.id === giftId ? { ...g, cells: Math.max(1, parseInt(newCells) || 1) } : g);
    setGiftsList(updated);
  };

  const handleUpdateBrightness = (val) => {
    const num = parseFloat(val);
    setBrightness(num);
    bandoEngine.updateSettings({ brightness: num });
  };

  const handleToggleDemoMode = () => {
    bandoEngine.setDemoMode(!gameState.isDemoMode);
  };

  const handleAddMapText = (e) => {
    e.preventDefault();
    if (!newTextLabel.trim()) return;
    bandoEngine.addMapText({
      text: newTextLabel.trim(),
      x: parseInt(newTextX) || 50,
      y: parseInt(newTextY) || 50,
      color: newTextColor,
      size: 13,
      glow: newTextGlow,
    });
    setNewTextLabel('');
  };

  const handleDeleteMapText = (id) => {
    bandoEngine.removeMapText(id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[90vh] bg-[#11131a] border border-white/15 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-gray-100 font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-black/40 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center shadow-lg shadow-red-500/20 ring-2 ring-yellow-400/40">
              <Shield size={20} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white tracking-wide">
                  ADMIN QUẢN TRỊ — GAME GHÉP CỜ BẢN ĐỒ VIỆT NAM
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-600 text-white shadow-sm">
                  {gameState.roundId}
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Điều hành độ sáng, nhãn chữ bản đồ, camera zoom, cấu hình quà tặng & link TikTok LIVE Studio
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-6 py-2.5 bg-[#161922] border-b border-white/10 overflow-x-auto shrink-0 custom-scrollbar">
          {[
            { id: 'operations', label: '🎮 Vận Hành & Điều Khiển' },
            { id: 'gifts', label: '🎁 Cấu Hình Quà Tặng' },
            { id: 'map_texts', label: '✍️ Nhãn Chữ & Biển Đảo' },
            { id: 'provinces', label: '🗺️ 34 Tỉnh Thành' },
            { id: 'countries', label: '🌍 Bản Đồ Quốc Gia' },
            { id: 'voice', label: '🎙️ Voice AI & BLV' },
            { id: 'audio', label: '🎵 Âm Nhạc & SFX' },
            { id: 'checklist', label: '🛠️ Hướng Dẫn & Link Live' },
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
          
          {/* TAB 1: OPERATIONS & CONTROLS */}
          {activeTab === 'operations' && (
            <div className="space-y-6">
              
              {/* Stat Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <div className="text-xs font-bold text-gray-400 mb-1">TRẠNG THÁI HIỆN TẠI</div>
                  <div className="text-lg font-black text-yellow-400 uppercase">{gameState.status} ({gameState.roundId})</div>
                  <div className="text-xs text-gray-400 mt-2">
                    Đã ghép: <strong className="text-white">{gameState.claimedCount.toLocaleString()}</strong> / {gameState.totalCells.toLocaleString()} ô ({gameState.percent}%)
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <div className="text-xs font-bold text-gray-400 mb-1">TỔNG ĐẠI GIA ĐÓNG GÓP</div>
                  <div className="text-lg font-black text-emerald-400">{gameState.leaderboard.length} Người Xem</div>
                  <div className="text-xs text-gray-400 mt-2">
                    MVP Hiện Tại: <strong className="text-white">{gameState.leaderboard[0]?.username || 'Chưa có'}</strong>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <div className="text-xs font-bold text-gray-400 mb-1">CHẾ ĐỘ HIỂN THỊ</div>
                  <div className="text-lg font-black text-blue-400">
                    {gameState.isDemoMode ? '🧪 Thử Nghiệm (Test Bar)' : '🔴 Live Thật (Sạch 100%)'}
                  </div>
                  <div className="text-xs text-gray-400 mt-2">
                    Góc nhìn: <strong className="text-white uppercase">{gameState.cameraPreset || 'overview'}</strong>
                  </div>
                </div>
              </div>

              {/* Display & Brightness Controls */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Sun size={16} className="text-yellow-400" /> Tùy Chỉnh Độ Sáng & Chế Độ Màn Hình Live
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Demo Mode Toggle Switch */}
                  <div className="flex items-center justify-between p-4 bg-black/40 border border-white/10 rounded-xl">
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>Chế Độ Test Quà Tặng (Demo Mode)</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black ${gameState.isDemoMode ? 'bg-emerald-500/20 text-emerald-300' : 'bg-gray-500/20 text-gray-400'}`}>
                          {gameState.isDemoMode ? 'ĐANG BẬT' : 'ĐÃ TẮT'}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-1">
                        Khi tắt, thanh bấm test quà ở cạnh dưới sẽ ẩn đi hoàn toàn để livestream TikTok thật
                      </p>
                    </div>

                    <button
                      onClick={handleToggleDemoMode}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        gameState.isDemoMode 
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                          : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      }`}
                    >
                      {gameState.isDemoMode ? 'Tắt Demo' : 'Bật Demo'}
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
                      onChange={(e) => handleUpdateBrightness(e.target.value)}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-400"
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 mt-1.5">
                      <span>Dịu mắt (80%)</span>
                      <span>Mặc định sáng rõ (140%)</span>
                      <span>Rực rỡ neon (220%)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Camera Presets Switcher */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Compass size={16} className="text-blue-400" /> Điều Khiển Camera Zoom Tự Động / Thủ Công
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                  {[
                    { id: 'overview', name: 'Toàn Cảnh', icon: '🌐', desc: 'Trọn chữ S & Biển đảo' },
                    { id: 'north', name: 'Miền Bắc', icon: '🏛️', desc: 'Thủ Đô & Đông Bắc' },
                    { id: 'central', name: 'Miền Trung', icon: '🏖️', desc: 'Huế - Đà Nẵng' },
                    { id: 'south', name: 'Miền Nam', icon: '🏙️', desc: 'TP.HCM & ĐBSCL' },
                    { id: 'islands', name: 'Biển Đảo', icon: '🏝️', desc: 'Hoàng Sa - Trường Sa' },
                    { id: 'macro', name: 'Cận Cảnh', icon: '🔍', desc: 'Zoom sát từng ô cờ' },
                  ].map(p => (
                    <button
                      key={p.id}
                      onClick={() => bandoEngine.setCameraPreset(p.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        gameState.cameraPreset === p.id 
                          ? 'bg-gradient-to-r from-red-600 to-amber-600 border-yellow-400 text-white shadow-lg' 
                          : 'bg-black/30 border-white/10 hover:bg-white/10 text-gray-300'
                      }`}
                    >
                      <div className="text-lg mb-1">{p.icon}</div>
                      <div className="text-xs font-black">{p.name}</div>
                      <div className="text-[10px] text-gray-400">{p.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Emergency Streamer Actions */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Zap size={16} className="text-yellow-400" /> Bảng Điều Khiển Khẩn Cấp Của Streamer
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button
                    onClick={() => bandoEngine.resetRound()}
                    className="p-3 bg-red-950/60 hover:bg-red-900/80 border border-red-500/40 text-red-200 rounded-xl font-bold text-xs flex flex-col items-center gap-1.5 transition-all"
                  >
                    <RotateCcw size={18} className="text-red-400" />
                    <span>Làm Mới Vòng Chơi</span>
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
                    onClick={() => bandoEngine.triggerVictory({ username: 'Admin Thử Nghiệm 🇻🇳' })}
                    className="p-3 bg-yellow-950/60 hover:bg-yellow-900/80 border border-yellow-500/40 text-yellow-200 rounded-xl font-bold text-xs flex flex-col items-center gap-1.5 transition-all"
                  >
                    <Award size={18} className="text-yellow-400" />
                    <span>Bắn Pháo Hoa Thắng</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: GIFTS CONFIGURATION */}
          {activeTab === 'gifts' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-white">DANH MỤC QUÀ TIKTOK & QUY ĐỔI SỐ Ô CỜ</h3>
                  <p className="text-xs text-gray-400">Điều chỉnh số ô cờ cắm được cho từng món quà TikTok</p>
                </div>
                <button
                  onClick={() => bandoEngine.startAutoTestLoop()}
                  className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-black shadow-lg flex items-center gap-1.5"
                >
                  <Play size={13} /> Chạy Tự Động Test Toàn Bộ Quà
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {giftsList.map((gift) => (
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

          {/* TAB 3: MAP TEXT OVERLAY & BIỂN ĐẢO */}
          {activeTab === 'map_texts' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wide">
                    ✍️ Quản Lý Nhãn Chữ Hiển Thị Ngoài Bản Đồ & Quần Đảo Biển Đông
                  </h3>
                  <p className="text-xs text-gray-400">
                    Thêm các slogan, nhãn Hoàng Sa - Trường Sa, Biển Đông, Đảo Phú Quốc, v.v.
                  </p>
                </div>
              </div>

              {/* Add New Map Text Form */}
              <form onSubmit={handleAddMapText} className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-3">
                <div className="text-xs font-bold text-yellow-400 uppercase flex items-center gap-1.5">
                  <Plus size={14} /> Thêm Nhãn Chữ Mới
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="md:col-span-2">
                    <label className="text-[11px] text-gray-400 block mb-1">Nội dung dòng chữ:</label>
                    <input
                      type="text"
                      placeholder="Ví dụ: 🇻🇳 VIỆT NAM THỊNH VƯỢNG"
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
                      <Plus size={14} /> Thêm Lên Bản Đồ
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-400 pt-1">
                  <div className="flex items-center gap-2">
                    <span>Vị trí X:</span>
                    <input 
                      type="range" min="5" max="95" value={newTextX} 
                      onChange={(e) => setNewTextX(e.target.value)} 
                      className="w-20 accent-yellow-400" 
                    />
                    <span className="font-mono text-white text-[11px]">{newTextX}%</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span>Vị trí Y:</span>
                    <input 
                      type="range" min="5" max="95" value={newTextY} 
                      onChange={(e) => setNewTextY(e.target.value)} 
                      className="w-20 accent-yellow-400" 
                    />
                    <span className="font-mono text-white text-[11px]">{newTextY}%</span>
                  </div>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={newTextGlow} 
                      onChange={(e) => setNewTextGlow(e.target.checked)} 
                      className="accent-yellow-400"
                    />
                    <span>Hiệu ứng Neon Glow</span>
                  </label>
                </div>
              </form>

              {/* Current Active Map Texts List */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-gray-300 uppercase">Danh Sách Nhãn Đang Hiển Thị ({gameState.mapTexts?.length || 0})</div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {gameState.mapTexts?.map((item) => (
                    <div key={item.id} className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color || '#facc15' }} />
                        <div>
                          <div className="text-xs font-black text-white">{item.text}</div>
                          <div className="text-[10px] text-gray-400">
                            X: {item.x}% • Y: {item.y}% • {item.glow ? 'Có viền sáng' : 'Mặc định'}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteMapText(item.id)}
                        className="p-1.5 text-gray-400 hover:text-red-400 bg-white/5 hover:bg-red-500/20 rounded-lg transition-colors"
                        title="Xóa nhãn chữ này"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: 34 PROVINCES PROGRESS */}
          {activeTab === 'provinces' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-white">TIẾN ĐỘ 34 TỈNH THÀNH & BIỂN ĐẢO</h3>
                  <p className="text-xs text-gray-400">Theo dõi tỷ lệ hoàn thành cắm cờ và người dẫn đầu từng khu vực</p>
                </div>
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
                        <span className="text-yellow-300 font-bold truncate max-w-[90px]">
                          {prov.leader ? `👑 ${prov.leader}` : 'Chưa có'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: OTHER COUNTRIES */}
          {activeTab === 'countries' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-black text-white uppercase">🌍 Chuyển Đổi Quốc Gia / Quốc Kỳ</h3>
                <p className="text-xs text-gray-400">Hệ thống hỗ trợ chuyển đổi giao diện cắm cờ cho nhiều quốc gia khác</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {COUNTRIES_LIST.map(country => (
                  <div
                    key={country.id}
                    onClick={() => {
                      setSelectedCountry(country.id);
                      bandoEngine.updateSettings({ selectedCountry: country.id });
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      selectedCountry === country.id
                        ? 'bg-gradient-to-tr from-red-950/60 to-slate-900 border-yellow-400 ring-2 ring-yellow-400/40 shadow-xl'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{country.flag}</span>
                      <div>
                        <div className="text-xs font-black text-white">{country.name}</div>
                        <div className="text-[10px] text-gray-400">Mã: {country.code}</div>
                      </div>
                    </div>
                    <p className="text-[11px] text-gray-300">{country.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: VOICE AI & BLV */}
          {activeTab === 'voice' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-black text-white uppercase">🎙️ Bình Luận Viên AI & Thông Báo Giọng Nói</h3>
                <p className="text-xs text-gray-400">Cấu hình đọc tên đại gia cắm cờ và hô vang khẩu hiệu tự động</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Bình Luận Viên AI Tự Động</div>
                    <div className="text-[11px] text-gray-400">Tự động xướng tên khi có quà tặng thần thoại hoặc hoàn thành tỉnh thành</div>
                  </div>
                  <input type="checkbox" defaultChecked className="accent-red-500 w-4 h-4" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-white/10">
                  <div>
                    <label className="text-[11px] text-gray-400 block mb-1">Giọng đọc BLV:</label>
                    <select className="w-full px-3 py-2 bg-black/50 border border-white/20 rounded-xl text-xs text-white">
                      <option value="male_heroic">Nam Hào Hùng — Truyền Cảm Hứng 🇻🇳</option>
                      <option value="female_sweet">Nữ Năng Động — Đáng Yêu ❤️</option>
                      <option value="epic_soldier">Chiến Sĩ Trực Tuyến 🎖️</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-gray-400 block mb-1">Độ trễ thông báo:</label>
                    <select className="w-full px-3 py-2 bg-black/50 border border-white/20 rounded-xl text-xs text-white">
                      <option value="instant">Tức thì (Không chờ)</option>
                      <option value="smart">Thông minh (Xếp hàng không chồng chéo)</option>
                    </select>
                  </div>
                </div>
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
                  <button onClick={() => bandoAudio.playVictory()} className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-xs rounded-lg">Chiến Thắng 🇻🇳</button>
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
