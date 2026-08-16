import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Shield, Play, Pause, RotateCcw, Award, Globe, Music, Volume2, 
  Sparkles, Gift, MapPin, Flag, CheckCircle, Copy, AlertTriangle, 
  Settings, RefreshCw, Zap, Sliders, ExternalLink, Trophy, Type,
  Compass, Sun, Eye, Trash2, Plus, PlusCircle, VolumeX, Save, Check, Grid,
  Upload, Search, Mic, Radio, Volume1, FileAudio
} from 'lucide-react';
import bandoEngine, { DEFAULT_MAP_GIFTS, COUNTRY_PRESETS, WORLD_COUNTRIES, CONTINENTS } from './bandoGameEngine';
import bandoAudio from './bandoAudioEngine';
import { ELEVENLABS_VOICES, previewVoiceAudio, stopVoiceAudio, getDualVoiceConfig, saveDualVoiceConfig } from '../../../utils/voiceSyncService';

export default function GameBanDoAdminModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('operations');
  const [gameState, setGameState] = useState(() => bandoEngine.state);
  const [customTitle, setCustomTitle] = useState(() => bandoEngine.state.settings.customMapTitle || '');
  const [totalCellsInput, setTotalCellsInput] = useState(() => bandoEngine.state.totalCells || 15125);
  const [copiedLink, setCopiedLink] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [theme, setTheme] = useState(() => bandoEngine.state.settings.theme || 'dark');
  const [brightness, setBrightness] = useState(() => bandoEngine.state.settings.brightness || 1.2);
  const [bgmVolume, setBgmVolume] = useState(() => bandoEngine.state.settings.bgmVolume ?? 0.45);
  const [sfxVolume, setSfxVolume] = useState(() => bandoEngine.state.settings.sfxVolume ?? 0.85);
  const [selectedCountry, setSelectedCountry] = useState(() => bandoEngine.state.selectedCountry || 'vietnam');

  // Khối Lưới Ô Cờ Tiêu Đề (Banner Flag Cells)
  const [bannerTextInput, setBannerTextInput] = useState(() => bandoEngine.state.bannerText || 'VIỆT NAM MUÔN NĂM');
  const [bannerPosX, setBannerPosX] = useState(() => bandoEngine.state.bannerPos?.x ?? 0);
  const [bannerPosY, setBannerPosY] = useState(() => bandoEngine.state.bannerPos?.y ?? 3.5);
  const [bannerPosZ, setBannerPosZ] = useState(() => bandoEngine.state.bannerPos?.z ?? -155);
  const [showBannerCells, setShowBannerCells] = useState(() => bandoEngine.state.showBannerCells !== false);

  // 200 Quốc Gia: Tìm kiếm & Lọc theo châu lục
  const [countrySearch, setCountrySearch] = useState('');
  const [selectedContinent, setSelectedContinent] = useState('all');

  // Quản lý tải lên âm nhạc BGM / SFX
  const [uploadedBgmName, setUploadedBgmName] = useState(() => bandoAudio.customBgmName || '');
  const [uploadedSfxName, setUploadedSfxName] = useState(() => bandoAudio.customSfxName || '');
  const [isBgmPlaying, setIsBgmPlaying] = useState(() => bandoAudio.bgmPlaying);
  const bgmFileInputRef = useRef(null);
  const sfxFileInputRef = useRef(null);

  // Form thêm nhãn toạ độ 3D
  const [newTextLabel, setNewTextLabel] = useState('');
  const [newTextColor, setNewTextColor] = useState('#facc15');
  const [newTextWX, setNewTextWX] = useState(0);
  const [newTextWZ, setNewTextWZ] = useState(0);
  const [newTextGlow, setNewTextGlow] = useState(true);

  // Form thêm vùng miền tùy ý
  const [newProvName, setNewProvName] = useState('');
  const [newProvCells, setNewProvCells] = useState(500);
  const [provSearch, setProvSearch] = useState('');

  // Voice AI & Bình Luận ElevenLabs
  const [voiceConfig, setVoiceConfig] = useState(() => getDualVoiceConfig());
  const [selectedGameVoiceId, setSelectedGameVoiceId] = useState(() => getDualVoiceConfig().gameVoice?.id || 'el_josh');
  const [voiceCategory, setVoiceCategory] = useState('all');
  const [previewingVoiceId, setPreviewingVoiceId] = useState(null);

  useEffect(() => {
    const unsub = bandoEngine.subscribe((state) => {
      setGameState({ ...state });
      if (state.settings?.theme) setTheme(state.settings.theme);
      if (state.settings?.customMapTitle) setCustomTitle(state.settings.customMapTitle);
      if (state.totalCells) setTotalCellsInput(state.totalCells);
      if (state.settings?.brightness) setBrightness(state.settings.brightness);
      if (state.selectedCountry) setSelectedCountry(state.selectedCountry);
      if (state.bannerText) setBannerTextInput(state.bannerText);
      if (state.bannerPos) {
        setBannerPosX(state.bannerPos.x);
        setBannerPosY(state.bannerPos.y);
        setBannerPosZ(state.bannerPos.z);
      }
      if (state.showBannerCells !== undefined) setShowBannerCells(state.showBannerCells);
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
      theme: theme,
      customMapTitle: customTitle,
      brightness: parseFloat(brightness),
      bgmVolume: parseFloat(bgmVolume),
      sfxVolume: parseFloat(sfxVolume),
    });
    bandoEngine.setBannerText(bannerTextInput);
    bandoEngine.setBannerPosition(bannerPosX, bannerPosY, bannerPosZ);
    bandoEngine.toggleShowBannerCells(showBannerCells);
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

  const handleAddCustomProvince = (e) => {
    e.preventDefault();
    if (!newProvName.trim()) return;
    bandoEngine.addCustomProvince(selectedCountry, {
      name: newProvName.trim(),
      totalCells: parseInt(newProvCells) || 500,
    });
    setNewProvName('');
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleRemoveCustomProvince = (provId) => {
    bandoEngine.removeCustomProvince(selectedCountry, provId);
  };

  const handleSaveGiftCells = (giftId, newCells) => {
    const updated = (gameState.gifts || DEFAULT_MAP_GIFTS).map(g => 
      g.id === giftId ? { ...g, cells: Math.max(1, parseInt(newCells) || 1) } : g
    );
    bandoEngine.updateGiftConfig(updated);
  };

  // Upload BGM File Handler
  const handleUploadBgm = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await bandoAudio.uploadCustomBgmFile(file);
      if (result) {
        setUploadedBgmName(result.name);
        bandoAudio.playCustomBgm();
        setIsBgmPlaying(true);
      }
    } catch (err) {
      console.error('Lỗi tải file nhạc BGM:', err);
    }
  };

  // Upload SFX File Handler
  const handleUploadSfx = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await bandoAudio.uploadCustomSfxFile(file);
      if (result) {
        setUploadedSfxName(result.name);
        bandoAudio.playCustomSfx();
      }
    } catch (err) {
      console.error('Lỗi tải file SFX:', err);
    }
  };

  // Preview & Stop Voice AI TTS ngay lập tức
  const handleTogglePreviewVoice = async (voice) => {
    if (previewingVoiceId === voice.id) {
      stopVoiceAudio();
      setPreviewingVoiceId(null);
      return;
    }
    stopVoiceAudio();
    setPreviewingVoiceId(voice.id);
    let sampleText = `Chào bạn! Đây là giọng đọc trí tuệ nhân tạo ${voice.name} trên hệ thống AVA Live!`;
    if (voice.role === 'game' || voice.recommendedFor === 'game') {
      sampleText = `Kịch tính quá cả nhà ơi! Cắm cờ dồn dập, rượt đuổi tỷ số nghẹt thở trên bản đồ AVA Live!`;
    } else if (voice.role === 'idol' || voice.gender === 'Female') {
      sampleText = `Dạ em chào cả nhà yêu nha! Mọi người thả tim và tặng quà ủng hộ cắm cờ cho phiên live của em nhé!`;
    } else if (voice.role === 'manager') {
      sampleText = `Thông báo từ trợ lý hệ thống: Chỉ còn 5 ô cờ cuối cùng, anh em đại gia nhanh tay chốt hạ chiến thắng ngay!`;
    }
    await previewVoiceAudio(voice, sampleText, () => {
      setPreviewingVoiceId(null);
    });
  };

  // Gán Giọng Đọc Cho Từng Vai Trò Cụ Thể (BLV Game / Nữ Idol / Nam Trợ Lý)
  const handleAssignVoiceToRole = (voice, roleKey) => {
    const updated = {
      ...voiceConfig,
      [roleKey]: {
        ...voiceConfig[roleKey],
        id: voice.id,
        name: voice.name,
        voiceId: voice.voiceId,
        gender: voice.gender,
        provider: 'elevenlabs'
      }
    };
    if (roleKey === 'gameVoice') setSelectedGameVoiceId(voice.id);
    setVoiceConfig(updated);
    saveDualVoiceConfig(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  // Lọc danh sách 200 quốc gia
  const filteredCountries = WORLD_COUNTRIES.filter(c => {
    const matchContinent = selectedContinent === 'all' || c.continent === selectedContinent;
    const matchQuery = countrySearch.trim() === '' || 
      c.name.toLowerCase().includes(countrySearch.toLowerCase()) || 
      c.code.toLowerCase().includes(countrySearch.toLowerCase()) ||
      c.title.toLowerCase().includes(countrySearch.toLowerCase());
    return matchContinent && matchQuery;
  });

  // Lọc danh sách Giọng ElevenLabs
  const filteredVoices = ELEVENLABS_VOICES.filter(v => {
    if (voiceCategory === 'all') return true;
    if (voiceCategory === 'game') return v.recommendedFor === 'game' || v.recommendedFor === 'both';
    if (voiceCategory === 'female') return v.gender === 'Female';
    if (voiceCategory === 'male') return v.gender === 'Male';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[94vh] bg-[#11131a] border border-white/15 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-gray-100 font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-black/50 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 via-amber-500 to-yellow-400 flex items-center justify-center shadow-lg shadow-red-500/20 ring-2 ring-yellow-400/40">
              <Shield size={20} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm md:text-base font-black text-white tracking-wide">
                  ADMIN QUẢN TRỊ — GAME GHÉP CỜ 200 QUỐC GIA & VOICE AI
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-600 text-white shadow-sm">
                  {gameState.roundId}
                </span>
                <span className="text-xs">{COUNTRY_PRESETS[selectedCountry]?.flag || '🇻🇳'}</span>
              </div>
              <p className="text-xs text-gray-400">
                200 Quốc gia, Khối chữ Ô Cờ 3D, Tải nhạc BGM/SFX, 30+ Voice AI ElevenLabs & Lưu vĩnh viễn
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveAll}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md ${
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
            { id: 'operations', label: '🎮 Vận Hành & Khối Chữ Ô Cờ' },
            { id: 'countries', label: '🌍 200 Quốc Gia & Quần Đảo' },
            { id: 'voices', label: '🎙️ Voice AI & Bình Luận (30+ Giọng)' },
            { id: 'audio', label: '🎵 Tải Nhạc BGM & Kho SFX' },
            { id: 'grid_cells', label: '🔢 Cài Đặt Số Ô Cờ' },
            { id: 'map_texts', label: '📍 Ghim Nhãn Địa Danh 3D' },
            { id: 'gifts', label: '🎁 Cấu Hình Quà Tặng' },
            { id: 'provinces', label: '🗺️ Danh Sách Vùng Miền' },
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
          
          {/* TAB 1: OPERATIONS & BANNER FLAG CELLS 3D */}
          {activeTab === 'operations' && (
            <div className="space-y-6">
              
              {/* BANNER FLAG CELLS MATRIX CONFIGURATION */}
              <div className="bg-gradient-to-r from-red-950/40 via-purple-950/40 to-black/60 border border-yellow-500/40 rounded-2xl p-5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-yellow-300 uppercase tracking-wider flex items-center gap-2">
                    <Grid size={18} className="text-yellow-400" /> Khối Lưới Chữ Ô Cờ 3D Trên Đầu Bản Đồ
                  </h3>
                  <label className="flex items-center gap-2 cursor-pointer bg-black/40 px-3 py-1 rounded-xl border border-white/10">
                    <input
                      type="checkbox"
                      checked={showBannerCells}
                      onChange={(e) => {
                        setShowBannerCells(e.target.checked);
                        bandoEngine.toggleShowBannerCells(e.target.checked);
                      }}
                      className="accent-yellow-400"
                    />
                    <span className="text-xs font-bold text-gray-200">Hiển Thị Khối Chữ Ô Cờ</span>
                  </label>
                </div>

                <p className="text-xs text-gray-300">
                  Dòng chữ biểu ngữ được cấu tạo từ các <strong>Ô CỜ 3D thực tế</strong>. Khi viewer tặng quà, các ô trên từng nét chữ sẽ tự động được cắm cờ quốc kỳ rực sáng!
                </p>

                {/* Input Text & Position 3D */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1">Nội Dung Chữ Biểu Ngữ:</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={bannerTextInput}
                        onChange={(e) => setBannerTextInput(e.target.value)}
                        placeholder="Ví dụ: VIỆT NAM MUÔN NĂM..."
                        className="flex-1 px-3 py-2 bg-black/60 border border-white/20 rounded-xl text-xs font-bold text-yellow-300 focus:outline-none focus:border-yellow-400 uppercase"
                      />
                      <button
                        onClick={() => bandoEngine.setBannerText(bannerTextInput)}
                        className="px-3 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl"
                      >
                        Áp Dụng Chữ
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1">Tiến Độ Cắm Cờ Khối Chữ:</label>
                    <div className="p-2.5 bg-black/50 border border-white/10 rounded-xl flex items-center justify-between">
                      <div className="text-xs text-gray-300">
                        Đã lắp: <strong className="text-yellow-400 font-mono">{gameState.bannerClaimedCount || 0}</strong> / {(gameState.bannerCells || []).length} ô chữ
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        {Math.round(((gameState.bannerClaimedCount || 0) / Math.max(1, (gameState.bannerCells || []).length)) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3D Coordinate Sliders */}
                <div className="p-4 bg-black/40 border border-white/10 rounded-xl space-y-3">
                  <div className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                    <Compass size={14} className="text-yellow-400" /> Di Chuyển Vị Trí Đặt Khối Chữ Ô Cờ (3D Space):
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-400">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Toạ độ X (Ngang):</span>
                        <span className="font-mono text-yellow-300 font-bold">{bannerPosX}</span>
                      </div>
                      <input
                        type="range" min="-100" max="100" step="1"
                        value={bannerPosX}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setBannerPosX(val);
                          bandoEngine.setBannerPosition(val, bannerPosY, bannerPosZ);
                        }}
                        className="w-full h-1.5 bg-gray-700 rounded-lg accent-yellow-400 cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Toạ độ Y (Độ Cao):</span>
                        <span className="font-mono text-yellow-300 font-bold">{bannerPosY}</span>
                      </div>
                      <input
                        type="range" min="0" max="40" step="0.5"
                        value={bannerPosY}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setBannerPosY(val);
                          bandoEngine.setBannerPosition(bannerPosX, val, bannerPosZ);
                        }}
                        className="w-full h-1.5 bg-gray-700 rounded-lg accent-yellow-400 cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Toạ độ Z (Bắc - Nam):</span>
                        <span className="font-mono text-yellow-300 font-bold">{bannerPosZ}</span>
                      </div>
                      <input
                        type="range" min="-220" max="0" step="1"
                        value={bannerPosZ}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setBannerPosZ(val);
                          bandoEngine.setBannerPosition(bannerPosX, bannerPosY, val);
                        }}
                        className="w-full h-1.5 bg-gray-700 rounded-lg accent-yellow-400 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Theme & Visual Lighting Customization */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <Sun size={16} className="text-yellow-400" /> Tùy Chỉnh Nền Sáng / Tối & Độ Sáng Bản Đồ 3D
                  </h3>
                  <span className="text-[11px] text-gray-400">Bảo lưu vĩnh viễn</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Theme Switcher */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-300 block">Chế Độ Màu Sắc Giao Diện & Nền:</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setTheme('dark');
                          bandoEngine.setTheme('dark');
                        }}
                        className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs transition-all ${
                          theme === 'dark'
                            ? 'bg-slate-900 border-yellow-400 text-yellow-300 shadow-md ring-2 ring-yellow-400/40'
                            : 'bg-black/40 border-white/10 text-gray-400 hover:bg-white/5'
                        }`}
                      >
                        <span>🌙 Nền Tối (Vũ Trụ)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setTheme('light');
                          bandoEngine.setTheme('light');
                        }}
                        className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs transition-all ${
                          theme === 'light'
                            ? 'bg-white border-amber-500 text-slate-900 shadow-md ring-2 ring-amber-400/50'
                            : 'bg-black/40 border-white/10 text-gray-400 hover:bg-white/5'
                        }`}
                      >
                        <span>☀️ Nền Sáng (Studio)</span>
                      </button>
                    </div>
                  </div>

                  {/* Brightness slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-bold text-gray-300">
                      <span>Độ Sáng Ánh Sáng 3D:</span>
                      <span className="font-mono text-yellow-400 font-bold">{Math.round(brightness * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.6"
                      max="2.0"
                      step="0.05"
                      value={brightness}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setBrightness(val);
                        bandoEngine.updateSettings({ brightness: val });
                      }}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-400 mt-2"
                    />
                  </div>
                </div>
              </div>

              {/* Live Title Customization */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <Type size={16} className="text-yellow-400" /> Tùy Chỉnh Tiêu Đề Phụ Màn Hình Live
                  </h3>
                  <span className="text-[11px] text-gray-400">Tự động lưu vĩnh viễn</span>
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
                    {gameState.isDemoMode ? '🧪 Chế Độ Thử Nghiệm' : '🔴 Livestream Thật'}
                  </div>
                  <div className="text-xs text-gray-400 mt-2">
                    Độ sáng 3D: <strong className="text-white">{Math.round(brightness * 100)}%</strong>
                  </div>
                </div>
              </div>

              {/* Emergency Streamer & Automation 24/7 Actions */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <Zap size={16} className="text-yellow-400" /> Hệ Thống Vận Hành Tự Động 24/24 & Sự Kiện Trực Tiếp
                  </h3>
                  <span className="text-[11px] text-emerald-400 font-mono">
                    {gameState.autoLoop247 ? '● Chế Độ Auto 24/7: ĐANG BẬT' : '○ Chế Độ Auto 24/7: TẮT'}
                  </span>
                </div>

                {/* Auto 24/7 Control Banner */}
                <div className="p-4 bg-gradient-to-r from-emerald-950/50 via-teal-950/40 to-black/60 border border-emerald-500/40 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
                  <div>
                    <div className="text-xs font-black text-white flex items-center gap-2">
                      <Zap size={15} className="text-yellow-400 fill-yellow-400" />
                      <span>Vòng Lặp Tự Động Xuyên Suốt 24/24 (Auto Loop 24/7)</span>
                    </div>
                    <p className="text-[11px] text-gray-300 mt-0.5">
                      Tự động cắm cờ mô phỏng 24/7, khi đạt 100% bản đồ sẽ nổ pháo hoa vinh danh TOP 30 + TOP 1 rồi tự đếm ngược 12s reset trận mới.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        bandoEngine.toggleAuto247();
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-md ${
                        bandoEngine.isAuto247Running
                          ? 'bg-red-600 hover:bg-red-500 text-white ring-2 ring-yellow-400 animate-pulse'
                          : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white'
                      }`}
                    >
                      <Zap size={14} />
                      <span>{bandoEngine.isAuto247Running ? 'Dừng Auto 24/7' : 'Bật Chạy Auto 24/7'}</span>
                    </button>
                  </div>
                </div>

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
                    <span>Giao Nhiệm Vụ Vùng</span>
                  </button>

                  <button
                    onClick={() => bandoEngine.triggerVictory({ username: 'Admin Thử Nghiệm' })}
                    className="p-3 bg-yellow-950/60 hover:bg-yellow-900/80 border border-yellow-500/40 text-yellow-200 rounded-xl font-bold text-xs flex flex-col items-center gap-1.5 transition-all"
                  >
                    <Award size={18} className="text-yellow-400" />
                    <span>Vinh Danh TOP 30 & TOP 1</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: 200 WORLD COUNTRIES WITH PROVINCES & ISLANDS */}
          {activeTab === 'countries' && (
            <div className="space-y-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-black text-white uppercase flex items-center gap-2">
                    <Globe size={18} className="text-blue-400" /> Hệ Thống 200 Quốc Gia & Quần Đảo Chi Tiết
                  </h3>
                  <p className="text-xs text-gray-400">
                    Đầy đủ 200 quốc gia trên thế giới kèm thủ đô, các tỉnh thành/tiểu bang và quần đảo địa lý chi tiết
                  </p>
                </div>

                {/* Continent filter tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1">
                  {CONTINENTS.map(ct => (
                    <button
                      key={ct.id}
                      onClick={() => setSelectedContinent(ct.id)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                        selectedContinent === ct.id
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                          : 'bg-white/5 hover:bg-white/10 text-gray-300'
                      }`}
                    >
                      {ct.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search input */}
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={countrySearch}
                  onChange={(e) => setCountrySearch(e.target.value)}
                  placeholder="Tìm kiếm quốc gia theo tên, mã ISO hoặc cờ (ví dụ: Việt Nam, Nhật Bản, US, France, Hàn Quốc...)"
                  className="w-full pl-10 pr-4 py-2.5 bg-black/60 border border-white/20 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-400"
                />
              </div>

              {/* Country Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-[58vh] overflow-y-auto custom-scrollbar pr-1">
                {filteredCountries.map(country => (
                  <div
                    key={country.id}
                    onClick={() => handleSwitchCountry(country.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      selectedCountry === country.id
                        ? 'bg-gradient-to-tr from-red-950/80 via-slate-900 to-black border-yellow-400 ring-2 ring-yellow-400/50 shadow-2xl scale-[1.01]'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-3xl">{country.flag}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 font-mono text-gray-300">
                          {country.code} • {country.continent?.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-xs font-black text-white mb-1">{country.name}</div>
                      <p className="text-[11px] text-gray-300 line-clamp-1 mb-2">{country.title}</p>
                      
                      {/* Hiển thị tóm tắt tỉnh thành & quần đảo */}
                      <div className="text-[10px] text-gray-400 space-y-1 mb-2 bg-black/30 p-2 rounded-lg">
                        <div className="truncate">🏙️ Tỉnh/TP: {country.provinces?.slice(0, 3).map(p => p.name).join(', ')}...</div>
                        {country.labels?.some(l => l.text.includes('QUẦN ĐẢO') || l.text.includes('ĐẢO')) && (
                          <div className="truncate text-emerald-400">🏝️ Hải đảo: {country.labels.filter(l => l.text.includes('ĐẢO')).map(l => l.text.replace(/^[^\w\s]+/, '')).slice(0, 2).join(', ')}</div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-gray-400 pt-2 border-t border-white/10">
                      <span>{country.labels?.length || 0} Nhãn 3D</span>
                      <span className={`font-bold ${selectedCountry === country.id ? 'text-yellow-400' : 'text-blue-400'}`}>
                        {selectedCountry === country.id ? '⭐ Đang kích hoạt' : 'Bấm để chọn'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: VOICE AI & ELEVENLABS 30+ VOICES */}
          {activeTab === 'voices' && (
            <div className="space-y-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-black text-white uppercase flex items-center gap-2">
                    <Mic size={18} className="text-purple-400" /> Hệ Thống 30+ Giọng Đọc Voice AI & Gán Vai Trò (ElevenLabs)
                  </h3>
                  <p className="text-xs text-gray-400">
                    Bấm nghe thử & dừng ngay lập tức. Tự do áp dụng giọng cho Bình Luận Viên Game, Nữ Idol Bán Hàng hoặc Nam Trợ Lý/MC.
                  </p>
                </div>

                {/* Voice filter */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[
                    { id: 'all', label: 'Tất Cả Giọng (30+)' },
                    { id: 'game', label: '🎙️ BLV Game' },
                    { id: 'female', label: '👑 Nữ Idol' },
                    { id: 'male', label: '💼 Nam Trợ Lý' },
                  ].map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setVoiceCategory(cat.id)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                        voiceCategory === cat.id
                          ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30'
                          : 'bg-white/5 hover:bg-white/10 text-gray-300'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* EXECUTIVE TOP ROLES DASHBOARD */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-gradient-to-r from-purple-950/40 via-slate-900/60 to-black/60 border border-purple-500/30 rounded-2xl">
                {/* Role 1: BLV Game */}
                <div className="p-2.5 rounded-xl bg-purple-900/20 border border-purple-500/30">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black text-purple-300 uppercase tracking-wider flex items-center gap-1">
                      <Radio size={11} className="text-yellow-400" /> 🎙️ BLV Trận Đấu Game
                    </span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-200 font-mono">Game</span>
                  </div>
                  <div className="text-xs font-black text-white truncate">
                    {voiceConfig.gameVoice?.name || 'Josh (Nam - BLV Game)'}
                  </div>
                </div>

                {/* Role 2: Nữ Idol */}
                <div className="p-2.5 rounded-xl bg-pink-900/20 border border-pink-500/30">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black text-pink-300 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles size={11} className="text-pink-400" /> 👑 Nữ Idol Bán Hàng
                    </span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-pink-500/20 text-pink-200 font-mono">Idol</span>
                  </div>
                  <div className="text-xs font-black text-white truncate">
                    {voiceConfig.idolVoice?.name || 'Rachel (Nữ - Ngọt ngào)'}
                  </div>
                </div>

                {/* Role 3: Trợ Lý / MC */}
                <div className="p-2.5 rounded-xl bg-blue-900/20 border border-blue-500/30">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black text-blue-300 uppercase tracking-wider flex items-center gap-1">
                      <Zap size={11} className="text-cyan-400" /> 💼 Nam Trợ Lý / MC
                    </span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-200 font-mono">Manager</span>
                  </div>
                  <div className="text-xs font-black text-white truncate">
                    {voiceConfig.managerVoice?.name || 'Callum (Nam - Quyết đoán)'}
                  </div>
                </div>
              </div>

              {/* Voice Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-[52vh] overflow-y-auto custom-scrollbar pr-1">
                {filteredVoices.map(v => {
                  const isBLV = voiceConfig.gameVoice?.id === v.id;
                  const isIdol = voiceConfig.idolVoice?.id === v.id;
                  const isManager = voiceConfig.managerVoice?.id === v.id;
                  const isAnyRole = isBLV || isIdol || isManager;
                  const isPreviewing = previewingVoiceId === v.id;

                  return (
                    <div
                      key={v.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                        isAnyRole
                          ? 'bg-gradient-to-tr from-purple-950/80 via-slate-900 to-black border-purple-400 ring-2 ring-purple-400/50 shadow-2xl'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                              v.gender === 'Female' ? 'bg-pink-500/20 text-pink-300' : 'bg-blue-500/20 text-blue-300'
                            }`}>
                              {v.gender === 'Female' ? '♀ Nữ' : '♂ Nam'} • {v.recommendedFor?.toUpperCase()}
                            </span>
                            {isBLV && (
                              <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-purple-600 text-white shadow-xs">
                                🎙️ Đang làm BLV
                              </span>
                            )}
                            {isIdol && (
                              <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-pink-600 text-white shadow-xs">
                                👑 Đang làm Idol
                              </span>
                            )}
                            {isManager && (
                              <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-blue-600 text-white shadow-xs">
                                💼 Đang làm Trợ Lý
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-mono text-gray-400">ElevenLabs</span>
                        </div>

                        <div className="text-xs font-black text-white mb-1">{v.name}</div>
                        <p className="text-[11px] text-gray-400 mb-3">{v.desc}</p>
                      </div>

                      {/* Controls: Nghe Thử / Dừng Ngay & Áp Dụng Cho Từng Vai Trò */}
                      <div className="space-y-2 pt-2 border-t border-white/10">
                        {/* Play / Stop Preview Button */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleTogglePreviewVoice(v)}
                            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-md ${
                              isPreviewing
                                ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white ring-2 ring-red-400 animate-pulse'
                                : 'bg-white/10 hover:bg-white/20 text-yellow-300'
                            }`}
                            title={isPreviewing ? "Bấm để DỪNG PHÁT NGAY LẬP TỨC" : "Bấm để NGHE THỬ giọng đọc này"}
                          >
                            {isPreviewing ? (
                              <>
                                <VolumeX size={13} className="text-white fill-white" />
                                <span>⏹️ Dừng Ngay</span>
                              </>
                            ) : (
                              <>
                                <Volume2 size={13} className="text-yellow-400" />
                                <span>▶️ Nghe Thử</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Role Assignment Buttons */}
                        <div className="grid grid-cols-3 gap-1.5">
                          <button
                            onClick={() => handleAssignVoiceToRole(v, 'gameVoice')}
                            className={`py-1 px-1.5 rounded-lg text-[10px] font-black transition-all border flex items-center justify-center gap-0.5 ${
                              isBLV
                                ? 'bg-purple-600 text-white border-purple-300 shadow-md ring-1 ring-purple-400'
                                : 'bg-purple-950/40 hover:bg-purple-900/60 text-purple-200 border-purple-500/20'
                            }`}
                            title="Gán giọng này làm Bình Luận Viên Trận Đấu Game"
                          >
                            <span>🎙️ {isBLV ? 'BLV (Dùng)' : 'Gán BLV'}</span>
                          </button>

                          <button
                            onClick={() => handleAssignVoiceToRole(v, 'idolVoice')}
                            className={`py-1 px-1.5 rounded-lg text-[10px] font-black transition-all border flex items-center justify-center gap-0.5 ${
                              isIdol
                                ? 'bg-pink-600 text-white border-pink-300 shadow-md ring-1 ring-pink-400'
                                : 'bg-pink-950/40 hover:bg-pink-900/60 text-pink-200 border-pink-500/20'
                            }`}
                            title="Gán giọng này làm Nữ Idol Livestream & Bán Hàng"
                          >
                            <span>👑 {isIdol ? 'Idol (Dùng)' : 'Gán Idol'}</span>
                          </button>

                          <button
                            onClick={() => handleAssignVoiceToRole(v, 'managerVoice')}
                            className={`py-1 px-1.5 rounded-lg text-[10px] font-black transition-all border flex items-center justify-center gap-0.5 ${
                              isManager
                                ? 'bg-blue-600 text-white border-blue-300 shadow-md ring-1 ring-blue-400'
                                : 'bg-blue-950/40 hover:bg-blue-900/60 text-blue-200 border-blue-500/20'
                            }`}
                            title="Gán giọng này làm Nam Trợ Lý Hậu Trường / Quản Lý"
                          >
                            <span>💼 {isManager ? 'Trợ Lý (Dùng)' : 'Gán Trợ Lý'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: AUDIO BGM, CUSTOM UPLOAD & SFX */}
          {activeTab === 'audio' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-black text-white uppercase flex items-center gap-2">
                  <Music size={18} className="text-emerald-400" /> Tải Lên Âm Nhạc BGM & Kho Hiệu Ứng SFX Kịch Tính
                </h3>
                <p className="text-xs text-gray-400">
                  Tự tải file nhạc nền MP3 từ máy tính hoặc sử dụng kho nhạc hiệu ứng chiến đấu Web Audio siêu thực
                </p>
              </div>

              {/* CUSTOM AUDIO UPLOAD SECTION */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Custom BGM Upload */}
                <div className="p-5 bg-gradient-to-tr from-emerald-950/40 to-black/60 border border-emerald-500/40 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-300 uppercase flex items-center gap-1.5">
                      <Upload size={15} /> Tải Nhạc Nền (BGM) Tùy Chỉnh
                    </span>
                    <span className="text-[10px] text-gray-400">Hỗ trợ MP3 / WAV</span>
                  </div>

                  <p className="text-[11px] text-gray-300">
                    Tải bài hát nền của riêng bạn để phát lặp lại trong suốt buổi livestream cắm cờ.
                  </p>

                  <input
                    ref={bgmFileInputRef}
                    type="file"
                    accept="audio/*"
                    onChange={handleUploadBgm}
                    className="hidden"
                  />

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => bgmFileInputRef.current?.click()}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
                    >
                      <Upload size={14} /> Chọn File Nhạc MP3
                    </button>

                    <button
                      onClick={() => {
                        if (isBgmPlaying) {
                          bandoAudio.stopBgmOnLive();
                          setIsBgmPlaying(false);
                        } else {
                          bandoAudio.playBgmOnLive();
                          setIsBgmPlaying(true);
                        }
                      }}
                      className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                        isBgmPlaying 
                          ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-md' 
                          : 'bg-white/10 hover:bg-white/20 text-white'
                      }`}
                    >
                      {isBgmPlaying ? <Pause size={14} /> : <Play size={14} />}
                      <span>{isBgmPlaying ? 'Dừng Nhạc LIVE' : (uploadedBgmName ? 'Phát Nhạc Tải Lên' : 'Phát Nhạc Hùng Thiêng')}</span>
                    </button>
                  </div>

                  {uploadedBgmName && (
                    <div className="flex items-center justify-between text-xs text-emerald-300 bg-black/40 p-2.5 rounded-xl border border-emerald-500/30 font-mono">
                      <span className="truncate flex items-center gap-1.5"><FileAudio size={14} /> {uploadedBgmName}</span>
                      <button
                        onClick={() => {
                          bandoAudio.stopCustomBgm();
                          bandoAudio.customBgmUrl = '';
                          bandoAudio.customBgmAudio = null;
                          bandoAudio.customBgmName = '';
                          setUploadedBgmName('');
                          setIsBgmPlaying(false);
                          localStorage.removeItem('bando_custom_bgm_meta');
                        }}
                        className="text-red-400 hover:text-red-300 ml-2"
                        title="Xóa nhạc đã tải"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Custom SFX Upload */}
                <div className="p-5 bg-gradient-to-tr from-amber-950/40 to-black/60 border border-amber-500/40 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-yellow-300 uppercase flex items-center gap-1.5">
                      <Upload size={15} /> Tải Hiệu Ứng (SFX) Tùy Chỉnh
                    </span>
                    <span className="text-[10px] text-gray-400">Hỗ trợ MP3 / WAV</span>
                  </div>

                  <p className="text-[11px] text-gray-300">
                    Tải âm thanh hiệu ứng quà tặng hoặc sự kiện đặc biệt của riêng bạn.
                  </p>

                  <input
                    ref={sfxFileInputRef}
                    type="file"
                    accept="audio/*"
                    onChange={handleUploadSfx}
                    className="hidden"
                  />

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => sfxFileInputRef.current?.click()}
                      className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-black font-black rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-yellow-500/20"
                    >
                      <Upload size={14} /> Chọn File SFX
                    </button>

                    {uploadedSfxName && (
                      <button
                        onClick={() => bandoAudio.playCustomSfx()}
                        className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center gap-1"
                      >
                        <Play size={14} /> Nghe Thử SFX
                      </button>
                    )}
                  </div>

                  {uploadedSfxName && (
                    <div className="flex items-center justify-between text-xs text-yellow-300 bg-black/40 p-2.5 rounded-xl border border-yellow-500/30 font-mono">
                      <span className="truncate flex items-center gap-1.5"><FileAudio size={14} /> {uploadedSfxName}</span>
                      <button
                        onClick={() => {
                          bandoAudio.customSfxUrl = '';
                          bandoAudio.customSfxAudio = null;
                          bandoAudio.customSfxName = '';
                          setUploadedSfxName('');
                          localStorage.removeItem('bando_custom_sfx_meta');
                        }}
                        className="text-red-400 hover:text-red-300 ml-2"
                        title="Xóa SFX đã tải"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>

              </div>

              {/* BẢNG KHO SFX KỊCH TÍNH MỚI */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="text-xs font-black text-white uppercase flex items-center gap-2">
                    <Volume2 size={16} className="text-yellow-400" /> Thư Viện Hiệu Ứng Âm Thanh Kịch Tính (SFX):
                  </div>
                  <span className="text-[11px] text-gray-400">Bấm nút để nghe thử tức thì</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <button
                    onClick={() => bandoAudio.playWarHorn()}
                    className="p-3 bg-red-950/60 hover:bg-red-900 border border-red-500/30 text-white rounded-xl text-xs font-bold text-left transition-all"
                  >
                    <div className="text-yellow-400 text-sm mb-1">🎺 Kèn Xung Trận</div>
                    <div className="text-[10px] text-gray-300">Hào hùng xung phong</div>
                  </button>

                  <button
                    onClick={() => bandoAudio.playWarDrums(4)}
                    className="p-3 bg-amber-950/60 hover:bg-amber-900 border border-amber-500/30 text-white rounded-xl text-xs font-bold text-left transition-all"
                  >
                    <div className="text-yellow-400 text-sm mb-1">🥁 Trống Trận</div>
                    <div className="text-[10px] text-gray-300">Dồn dập gay cấn</div>
                  </button>

                  <button
                    onClick={() => bandoAudio.playFireworks()}
                    className="p-3 bg-purple-950/60 hover:bg-purple-900 border border-purple-500/30 text-white rounded-xl text-xs font-bold text-left transition-all"
                  >
                    <div className="text-purple-300 text-sm mb-1">🎆 Pháo Hoa Nổ</div>
                    <div className="text-[10px] text-gray-300">Tiếng nổ vang rực rỡ</div>
                  </button>

                  <button
                    onClick={() => bandoAudio.playCrowdCheer()}
                    className="p-3 bg-blue-950/60 hover:bg-blue-900 border border-blue-500/30 text-white rounded-xl text-xs font-bold text-left transition-all"
                  >
                    <div className="text-blue-300 text-sm mb-1">👏 Khán Giả Hò Reo</div>
                    <div className="text-[10px] text-gray-300">Cổ vũ rợp trời</div>
                  </button>

                  <button
                    onClick={() => bandoAudio.playThunderStrike()}
                    className="p-3 bg-indigo-950/60 hover:bg-indigo-900 border border-indigo-500/30 text-white rounded-xl text-xs font-bold text-left transition-all"
                  >
                    <div className="text-indigo-300 text-sm mb-1">⚡ Sét Đánh Thần Thoại</div>
                    <div className="text-[10px] text-gray-300">Sấm sét giáng lâm</div>
                  </button>

                  <button
                    onClick={() => bandoAudio.playGoldCoins(8)}
                    className="p-3 bg-yellow-950/60 hover:bg-yellow-900 border border-yellow-500/30 text-white rounded-xl text-xs font-bold text-left transition-all"
                  >
                    <div className="text-yellow-300 text-sm mb-1">💰 Mưa Tiền Vàng</div>
                    <div className="text-[10px] text-gray-300">Xu rơi leng keng</div>
                  </button>

                  <button
                    onClick={() => bandoAudio.playLevelUp()}
                    className="p-3 bg-teal-950/60 hover:bg-teal-900 border border-teal-500/30 text-white rounded-xl text-xs font-bold text-left transition-all"
                  >
                    <div className="text-teal-300 text-sm mb-1">🆙 Thăng Cấp Đột Phá</div>
                    <div className="text-[10px] text-gray-300">Lên cấp danh vọng</div>
                  </button>

                  <button
                    onClick={() => bandoAudio.playVictory()}
                    className="p-3 bg-gradient-to-r from-red-900 to-amber-900 border border-yellow-400 text-white rounded-xl text-xs font-black text-left transition-all"
                  >
                    <div className="text-yellow-300 text-sm mb-1">🏆 Đại Khải Hoàn Ca</div>
                    <div className="text-[10px] text-yellow-100">Toàn thắng bản đồ</div>
                  </button>
                </div>
              </div>

              {/* Volume Sliders & Auto Loop Music */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                {/* BGM 24/7 Loop Setting Toggle */}
                <div className="flex items-center justify-between p-3 bg-purple-950/40 border border-purple-500/30 rounded-xl">
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Music size={14} className="text-purple-400" />
                      <span>Tự Động Lặp Lại Nhạc Nền 24/7 (BGM Auto-Loop)</span>
                    </div>
                    <p className="text-[10px] text-gray-300">
                      Khi bài hát kết thúc sẽ tự động phát lại liền mạch, đảm bảo phòng Live luôn tràn ngập âm nhạc hào hùng.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const next = !bandoAudio.isBgmLoop;
                      bandoAudio.setBgmLoop(next);
                      if (next && !bandoAudio.bgmPlaying) {
                        bandoAudio.startSyntheticBgm();
                      }
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      bandoAudio.isBgmLoop
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30'
                        : 'bg-white/10 text-gray-400 hover:bg-white/20'
                    }`}
                  >
                    {bandoAudio.isBgmLoop ? '✓ Đang Lặp 24/7' : '○ Tắt Lặp'}
                  </button>
                </div>

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
              </div>
            </div>
          )}

          {/* TAB 5: GRID / CELL COUNT CONFIGURATION */}
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

              {/* Quick preset selector */}
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

          {/* TAB 6: TRUE 3D ANCHORED LANDMARKS */}
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

          {/* TAB 7: GIFTS CONFIGURATION */}
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

          {/* TAB 8: PROVINCES & REGIONS */}
          {activeTab === 'provinces' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-black text-white uppercase">🗺️ Danh Sách Vùng Miền Của {COUNTRY_PRESETS[selectedCountry]?.name}</h3>
                  <p className="text-xs text-gray-400">Theo dõi tiến độ ghép cờ và bổ sung vùng miền tùy ý cho quốc gia</p>
                </div>

                {/* Tìm kiếm vùng miền */}
                <input
                  type="text"
                  placeholder="🔍 Tìm tỉnh thành..."
                  value={provSearch}
                  onChange={(e) => setProvSearch(e.target.value)}
                  className="px-3 py-1.5 bg-black/40 border border-white/15 rounded-xl text-xs text-white placeholder-gray-500 outline-none w-full sm:w-48"
                />
              </div>

              {/* Form Bổ Sung Vùng Miền / Tỉnh Thành Mới Tùy Ý */}
              <form onSubmit={handleAddCustomProvince} className="bg-gradient-to-r from-red-950/40 via-amber-950/30 to-black border border-yellow-500/30 rounded-2xl p-4 space-y-3">
                <div className="text-xs font-black text-yellow-300 uppercase tracking-wider flex items-center gap-1.5">
                  <PlusCircle size={14} className="text-yellow-400" />
                  <span>➕ Bổ Sung Vùng Miền / Tỉnh Thành Mới Cho {COUNTRY_PRESETS[selectedCountry]?.name}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-bold text-gray-300 block mb-1">Tên Tỉnh / Vùng / Quần Đảo:</label>
                    <input
                      type="text"
                      value={newProvName}
                      onChange={(e) => setNewProvName(e.target.value)}
                      placeholder="Ví dụ: Đảo Phú Quốc, Tỉnh Long An, Bang California..."
                      className="w-full px-3 py-2 bg-black/60 border border-white/20 rounded-xl text-xs text-white placeholder-gray-500 outline-none focus:border-yellow-400"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-300 block mb-1">Số Ô Cờ Dự Kiến:</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="50"
                        max="5000"
                        value={newProvCells}
                        onChange={(e) => setNewProvCells(e.target.value)}
                        className="w-full px-3 py-2 bg-black/60 border border-white/20 rounded-xl text-xs text-white outline-none font-mono"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-black font-black text-xs rounded-xl shadow-lg transition-all shrink-0 active:scale-95"
                      >
                        Thêm
                      </button>
                    </div>
                  </div>
                </div>
              </form>

              {/* Danh sách các Vùng Miền */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto custom-scrollbar p-1">
                {Object.values(gameState.provincesStatus || {})
                  .filter(p => !provSearch.trim() || p.name.toLowerCase().includes(provSearch.toLowerCase()))
                  .map((prov) => {
                    const pct = Math.min(100, Math.round((prov.claimedCount / (prov.totalCells || 1)) * 100));
                    const isCustom = prov.id.includes('custom');
                    return (
                      <div key={prov.id} className="bg-white/5 border border-white/10 rounded-2xl p-3.5 relative group hover:border-yellow-400/40 transition-colors">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="text-xs font-black text-white flex items-center gap-1.5 truncate">
                            <MapPin size={12} className="text-red-400 shrink-0" />
                            <span className="truncate">{prov.name}</span>
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
                          <div className="flex items-center gap-1.5">
                            <span className="text-yellow-300 font-bold truncate max-w-[80px]">
                              {prov.leader ? `👑 ${prov.leader}` : 'Chưa có'}
                            </span>
                            {isCustom && (
                              <button
                                onClick={() => handleRemoveCustomProvince(prov.id)}
                                className="text-red-400 hover:text-red-300 text-[10px] px-1 hover:bg-red-500/20 rounded"
                                title="Xóa vùng miền tự thêm"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* TAB 9: CHECKLIST & LIVE LINK */}
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
