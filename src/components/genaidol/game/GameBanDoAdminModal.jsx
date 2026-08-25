import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Shield, Play, Pause, Square, RotateCcw, Repeat, Award, Globe, Music, Music2, Volume2, 
  Sparkles, Gift, MapPin, Flag, CheckCircle, Copy, AlertTriangle, 
  Settings, RefreshCw, Zap, Sliders, ExternalLink, Trophy, Type,
  Compass, Sun, Eye, Trash2, Plus, PlusCircle, VolumeX, Save, Check, Grid,
  Upload, UploadCloud, Image, Search, Mic, Radio, Volume1, FileAudio, ZoomIn, ZoomOut, Move, Camera, BookmarkPlus, Layers,
  Palette, Minimize2, Maximize2, Columns, Edit2, MessageSquare, Bot, Key
} from 'lucide-react';
import bandoEngine, { DEFAULT_MAP_GIFTS, COUNTRY_PRESETS, WORLD_COUNTRIES, CONTINENTS } from './bandoGameEngine';
import bandoAudio from './bandoAudioEngine';
import { ELEVENLABS_VOICES, FREE_VOICES, ALL_SYSTEM_VOICES, previewVoiceAudio, stopVoiceAudio, getDualVoiceConfig, saveDualVoiceConfig } from '../../../utils/voiceSyncService';
import { getGiftConfig, saveGiftConfig, DEFAULT_GIFT_MARQUEE_SETTINGS, REGIONAL_FLAG_GIFTS } from '../../../utils/giftSyncService';
import GameVoiceConfigPanel from './GameVoiceConfigPanel';
import { mapVoiceEngine } from './gameVoiceEngine';


export default function GameBanDoAdminModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('operations');
  const [modalWidthMode, setModalWidthMode] = useState('medium'); // 'compact' | 'medium' | 'wide'
  const [isMinimized, setIsMinimized] = useState(false);
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
  const [bannerClaimedColor, setBannerClaimedColor] = useState(() => bandoEngine.state.bannerClaimedColor || '#DA251D');
  const [bannerUnclaimedColor, setBannerUnclaimedColor] = useState(() => bandoEngine.state.bannerUnclaimedColor || '#334155');
  const [bannerVoxelScale, setBannerVoxelScale] = useState(() => bandoEngine.state.bannerVoxelScale || 1.5);

  // 200 Quốc Gia: Tìm kiếm & Lọc theo châu lục
  const [countrySearch, setCountrySearch] = useState('');
  const [selectedContinent, setSelectedContinent] = useState('all');

  // Quản lý tải lên âm nhạc BGM / SFX
  const [uploadedBgmName, setUploadedBgmName] = useState(() => bandoAudio.customBgmName || '');
  const [uploadedSfxName, setUploadedSfxName] = useState(() => bandoAudio.customSfxName || '');
  const [isBgmPlaying, setIsBgmPlaying] = useState(() => bandoAudio.bgmPlaying);
  const [isBgmLoop, setIsBgmLoop] = useState(() => bandoAudio.getBgmLoop());
  const [isSfxEnabled, setIsSfxEnabled] = useState(() => !bandoAudio.isSfxMuted);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(() => !bandoAudio.isVoiceMuted);
  const [voiceVolume, setVoiceVolume] = useState(() => bandoAudio.voiceVolume ?? 1.0);
  const [bgmCurrentTime, setBgmCurrentTime] = useState(0);
  const [bgmDuration, setBgmDuration] = useState(0);
  const [activePlayingSfx, setActivePlayingSfx] = useState(null);
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

  // Quản lý quà tặng TikTok
  const [giftSearch, setGiftSearch] = useState('');
  const [giftTierFilter, setGiftTierFilter] = useState('all');
  const [isAddingGift, setIsAddingGift] = useState(false);
  const [newGiftName, setNewGiftName] = useState('');
  const [newGiftIcon, setNewGiftIcon] = useState('🎁');
  const [newGiftPrice, setNewGiftPrice] = useState(100);
  const [newGiftCells, setNewGiftCells] = useState(100);
  const [newGiftTier, setNewGiftTier] = useState('common');
  const [editingGiftId, setEditingGiftId] = useState(null);
  const [editGiftData, setEditGiftData] = useState({});
  const [giftMarqueeSettings, setGiftMarqueeSettings] = useState(() => getGiftConfig('map').marquee || DEFAULT_GIFT_MARQUEE_SETTINGS);


  // Quản lý Tải Lên Ảnh Mẫu Bản Đồ Tham Chiếu Chuẩn Xác 100%
  const mapImageFileInputRef = useRef(null);
  const [uploadedMapImage, setUploadedMapImage] = useState(null);
  const [customCountryNameInput, setCustomCountryNameInput] = useState('Bản Đồ Mẫu Tùy Chỉnh');
  const [isProcessingMapImage, setIsProcessingMapImage] = useState(false);
  const [mapProcessSuccess, setMapProcessSuccess] = useState(false);

  // Quản lý Kết Nối Real-time TikTok Live Studio
  const [tiktokUsernameInput, setTiktokUsernameInput] = useState(() => {
    return localStorage.getItem('aidol_tiktok_id') || '';
  });
  const [isTiktokConnected, setIsTiktokConnected] = useState(false);
  const [tiktokConnectedUser, setTiktokConnectedUser] = useState('');
  const [isConnectingTiktok, setIsConnectingTiktok] = useState(false);
  const [isSimulationMode, setIsSimulationMode] = useState(false);
  const [adminSocket, setAdminSocket] = useState(null);

  useEffect(() => {
    let backendUrl = '';
    if (typeof window !== 'undefined') {
      const customUrl = localStorage.getItem('aidol_backend_url') || (typeof import.meta !== 'undefined' && import.meta.env?.VITE_BACKEND_URL);
      if (customUrl && customUrl.startsWith('http')) {
        backendUrl = customUrl;
      } else if (window.location.port === '5173') {
        backendUrl = window.location.protocol + '//' + window.location.hostname + ':3001';
      } else if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        backendUrl = 'http://127.0.0.1.nip.io:3001';
      } else if (window.location.protocol === 'file:') {
        backendUrl = 'http://127.0.0.1.nip.io:3001';
      }
    }
    
    let socket = null;
    try {
      socket = io(backendUrl || (window.location.origin !== 'file://' ? window.location.origin : 'http://localhost:3001'), { transports: ['websocket', 'polling'], reconnection: true });
      setAdminSocket(socket);
      socket.emit('get_tiktok_status');
      socket.on('tiktok_status', (data) => {
        setIsTiktokConnected(!!data?.connected);
        setTiktokConnectedUser(data?.username || '');
        setIsConnectingTiktok(false);
        setIsSimulationMode(!!data?.simulationMode);
      });
      socket.on('tiktok_connected', (data) => {
        setIsTiktokConnected(true);
        setTiktokConnectedUser(data?.username || '');
        setIsConnectingTiktok(false);
        setIsSimulationMode(false);
        window.dispatchEvent(new CustomEvent('avalive_toast', { detail: { type: 'success', message: `🎉 Kết nối thành công TikTok Live: ${data?.username}` } }));
      });
      socket.on('tiktok_disconnected', () => {
        setIsTiktokConnected(false);
        setTiktokConnectedUser('');
        setIsConnectingTiktok(false);
      });
      socket.on('tiktok_error', (err) => {
        setIsConnectingTiktok(false);
        window.dispatchEvent(new CustomEvent('avalive_toast', { detail: { type: 'error', message: `LỖI KẾT NỐI: ${err || 'Không thể kết nối'}` } }));
      });
    } catch (e) {}

    return () => {
      if (socket) socket.disconnect();
      setAdminSocket(null);
    };
  }, []);

  const handleConnectTiktok = () => {
    if (!tiktokUsernameInput) return;
    let cleanId = tiktokUsernameInput.trim().split('?')[0].split('#')[0];
    const matchAt = cleanId.match(/@([a-zA-Z0-9_.-]+)/);
    if (matchAt && matchAt[1]) {
      cleanId = matchAt[1];
    } else {
      const parts = cleanId.split('/').filter(Boolean);
      if (parts.length > 0) {
        const last = parts[parts.length - 1];
        cleanId = (last === 'live' && parts.length > 1) ? parts[parts.length - 2].replace(/^@/, '') : last.replace(/^@/, '');
      } else {
        cleanId = cleanId.replace(/^@/, '');
      }
    }
    
    try { localStorage.setItem('aidol_tiktok_id', cleanId); } catch (e) {}
    setIsConnectingTiktok(true);
    if (adminSocket) {
      adminSocket.emit('connect_tiktok', cleanId);
    } else {
      const backendUrl = typeof window !== 'undefined' && (window.location.port === '5173' || window.location.port === '3000' || window.location.port === '3001') ? `${window.location.protocol}//${window.location.hostname}:3001` : '';
      try {
        const socket = io(backendUrl || window.location.origin, { transports: ['websocket', 'polling'] });
        socket.emit('connect_tiktok', cleanId);
      } catch (e) {}
    }
  };

  const handleDisconnectTiktok = () => {
    if (adminSocket) {
      adminSocket.emit('disconnect_tiktok');
    } else {
      const backendUrl = typeof window !== 'undefined' && (window.location.port === '5173' || window.location.port === '3000' || window.location.port === '3001') ? `${window.location.protocol}//${window.location.hostname}:3001` : '';
      try {
        const socket = io(backendUrl || window.location.origin, { transports: ['websocket', 'polling'] });
        socket.emit('disconnect_tiktok');
      } catch (e) {}
    }
    setIsTiktokConnected(false);
    setTiktokConnectedUser('');
  };

  const handleToggleSimulation = async () => {
    const backendUrl = typeof window !== 'undefined' && (window.location.port === '5173' || window.location.port === '3000' || window.location.port === '3001') ? `${window.location.protocol}//${window.location.hostname}:3001` : '';
    const url = backendUrl || window.location.origin;
    try {
      if (isSimulationMode) {
        await fetch(`${url}/api/simulation/stop`, { method: 'POST' });
        setIsSimulationMode(false);
      } else {
        await fetch(`${url}/api/simulation/start`, { method: 'POST' });
        setIsSimulationMode(true);
      }
    } catch (e) {
      // Fallback via socket
      if (adminSocket) {
        adminSocket.emit(isSimulationMode ? 'stop_simulation' : 'start_simulation');
        setIsSimulationMode(!isSimulationMode);
      }
    }
  };



  const handleTestSpecificGift = (gId, gName, count, diamonds, region) => {
    bandoEngine.processGift({
      userId: 'test_donor_' + Date.now().toString(36),
      username: 'Chiến Binh Yêu Nước 🇻🇳',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
      giftId: gId,
      giftName: gName,
      count: count,
      diamondCount: diamonds,
      regionTarget: region || null
    });
  };

  // Quản lý Khung Thời Gian & Trả Lời Bình Luận AI
  const [voiceCommentaryInterval, setVoiceCommentaryInterval] = useState(() => mapVoiceEngine.intervalSeconds || 25);
  const [voiceReplyCooldown, setVoiceReplyCooldown] = useState(() => mapVoiceEngine.replyCooldownSec || 3);
  const [isVoiceAutoCommentary, setIsVoiceAutoCommentary] = useState(() => mapVoiceEngine.isAutoEnabled);
  const [isVoiceKeywordReply, setIsVoiceKeywordReply] = useState(() => mapVoiceEngine.isKeywordAutoReplyEnabled);
  const [isVoiceGeminiAI, setIsVoiceGeminiAI] = useState(() => mapVoiceEngine.useGeminiAI !== false);
  const [testCommentInput, setTestCommentInput] = useState('');
  const [testCommentUser, setTestCommentUser] = useState('Chiến Binh Áo Đỏ 🇻🇳');
  const [testCommentResult, setTestCommentResult] = useState('');

  const handleTestComment = () => {
    if (!testCommentInput.trim()) return;
    bandoAudio.unlock();
    const comment = testCommentInput.trim();
    const user = testCommentUser.trim() || 'Khán Giả';
    setTestCommentResult(`Đang xử lý bình luận: "${comment}"...`);
    
    // Gọi trực tiếp Engine để cắm cờ và kích hoạt voice trả lời
    bandoEngine.processComment(comment, { id: 'test_user_' + Date.now(), username: user, avatar: '' });
    
    setTimeout(() => {
      setTestCommentResult(`✅ Đã gửi: "${comment}" - AI đang đọc phản hồi.`);
      setTimeout(() => setTestCommentResult(''), 4000);
    }, 500);
  };

  // Trigger camera actions from inside Admin settings
  const triggerCameraAction = (action, payload) => {
    window.dispatchEvent(new CustomEvent('bando-camera-action', { detail: { action, payload } }));
  };

  const [isAutoTesting, setIsAutoTesting] = useState(() => bandoEngine.isAutoTesting);

  useEffect(() => {
    const handleBgmStatus = (e) => {
      if (e.detail) {
        if (e.detail.playing !== undefined) setIsBgmPlaying(e.detail.playing);
        if (e.detail.loop !== undefined) setIsBgmLoop(e.detail.loop);
        if (e.detail.currentTime !== undefined) setBgmCurrentTime(e.detail.currentTime);
        if (e.detail.duration !== undefined && e.detail.duration > 0) setBgmDuration(e.detail.duration);
        if (e.detail.name) setUploadedBgmName(e.detail.name);
        if (e.detail.bgmVolume !== undefined) setBgmVolume(e.detail.bgmVolume);
        if (e.detail.sfxVolume !== undefined) setSfxVolume(e.detail.sfxVolume);
        if (e.detail.voiceVolume !== undefined) setVoiceVolume(e.detail.voiceVolume);
        if (e.detail.isSfxMuted !== undefined) setIsSfxEnabled(!e.detail.isSfxMuted);
        if (e.detail.isVoiceMuted !== undefined) setIsVoiceEnabled(!e.detail.isVoiceMuted);
      }
    };
    window.addEventListener('bando-bgm-status', handleBgmStatus);

    const timer = setInterval(() => {
      setIsBgmPlaying(bandoAudio.bgmPlaying);
      setIsBgmLoop(bandoAudio.getBgmLoop());
      setBgmCurrentTime(bandoAudio.getBgmCurrentTime());
      const dur = bandoAudio.getBgmDuration();
      if (dur > 0) setBgmDuration(dur);
    }, 250);

    return () => {
      window.removeEventListener('bando-bgm-status', handleBgmStatus);
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const unsub = bandoEngine.subscribe((state, lastEvent) => {
      setGameState({ ...state });
      setIsAutoTesting(bandoEngine.isAutoTesting);
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

  const handleCopyOverlayUrl = (ratio = '9:16') => {
    const url = `${window.location.origin.replace('localhost', '127.0.0.1.nip.io').replace('127.0.0.1', '127.0.0.1.nip.io')}${window.location.pathname}?overlay=bando&ratio=${ratio}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(ratio);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleUploadMapImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setUploadedMapImage(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleApplyCustomMapFromImage = async () => {
    if (!uploadedMapImage) return;
    setIsProcessingMapImage(true);
    const count = parseInt(totalCellsInput) || 15000;
    const success = await bandoEngine.loadCustomMapFromImage(uploadedMapImage, customCountryNameInput, count);
    setIsProcessingMapImage(false);
    if (success) {
      setSelectedCountry('custom_upload');
      setMapProcessSuccess(true);
      setTimeout(() => setMapProcessSuccess(false), 3000);
    }
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
    bandoEngine.updateGift(giftId, { cells: parseInt(newCells) || 1 });
    saveGiftConfig('map', { gifts: bandoEngine.state.gifts });
  };

  const handleAddGift = (e) => {
    e.preventDefault();
    if (!newGiftName.trim()) return;
    bandoEngine.addGift({
      name: newGiftName.trim(),
      icon: newGiftIcon.trim() || '🎁',
      priceToken: parseInt(newGiftPrice) || 1,
      cells: parseInt(newGiftCells) || 1,
      tier: newGiftTier,
    });
    saveGiftConfig('map', { gifts: bandoEngine.state.gifts });
    setNewGiftName('');
    setNewGiftIcon('🎁');
    setNewGiftPrice(100);
    setNewGiftCells(100);
    setIsAddingGift(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleDeleteGift = (id) => {
    bandoEngine.removeGift(id);
    saveGiftConfig('map', { gifts: bandoEngine.state.gifts });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleStartEditGift = (gift) => {
    setEditingGiftId(gift.id);
    setEditGiftData({
      name: gift.name,
      icon: gift.icon,
      priceToken: gift.priceToken,
      cells: gift.cells,
      tier: gift.tier || 'common',
      regionTarget: gift.regionTarget || null,
    });
  };

  const handleSaveEditGift = (id) => {
    bandoEngine.updateGift(id, editGiftData);
    saveGiftConfig('map', { gifts: bandoEngine.state.gifts });
    setEditingGiftId(null);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleResetDefaultGifts = () => {
    if (window.confirm('Bạn có chắc muốn khôi phục lại toàn bộ danh mục quà TikTok mặc định ban đầu không?')) {
      bandoEngine.resetDefaultGifts();
      saveGiftConfig('map', { gifts: bandoEngine.state.gifts });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }
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

  // Gán hoặc Bỏ Chọn Giọng Đọc Cho Từng Vai Trò Cụ Thể (BLV Game / Nữ Idol / Nam Trợ Lý)
  const handleAssignVoiceToRole = (voice, roleKey) => {
    const isCurrentlyAssigned = voiceConfig[roleKey]?.id === voice.id;
    let updated;
    if (isCurrentlyAssigned) {
      // Bỏ chọn (Deselect / Unassign)
      updated = {
        ...voiceConfig,
        [roleKey]: {
          id: null,
          name: 'Chưa chọn',
          voiceId: null,
          gender: null,
          provider: 'elevenlabs'
        }
      };
      if (roleKey === 'gameVoice') setSelectedGameVoiceId(null);
    } else {
      // Gán vai trò mới
      updated = {
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
    }
    setVoiceConfig(updated);
    saveDualVoiceConfig(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  // Helper format audio time mm:ss
  const formatAudioTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Kéo thanh trượt tiến trình phát nhạc (Seekbar BGM)
  const handleSeekBgm = (e) => {
    const val = parseFloat(e.target.value);
    setBgmCurrentTime(val);
    bandoAudio.seekCustomBgm(val);
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

  // Lọc danh sách Giọng AI (💎 Pro Trả Phí & 🆓 Miễn Phí)
  const filteredVoices = ALL_SYSTEM_VOICES.filter(v => {
    if (voiceCategory === 'all') return true;
    if (voiceCategory === 'pro') return v.tier === 'pro';
    if (voiceCategory === 'free') return v.tier === 'free';
    if (voiceCategory === 'game') return v.recommendedFor === 'game' || v.recommendedFor === 'both';
    if (voiceCategory === 'female') return v.gender === 'Female';
    if (voiceCategory === 'male') return v.gender === 'Male';
    return true;
  });

  // Chế độ Widget Thu Nhỏ Góc Phải (Không Che Màn Hình Live)
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50 pointer-events-auto animate-in fade-in slide-in-from-bottom-2 duration-200">
        <div className="bg-[#11131a]/95 backdrop-blur-xl border border-yellow-500/50 rounded-2xl shadow-2xl p-2.5 flex items-center gap-3 text-white">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-red-600 to-yellow-500 flex items-center justify-center font-bold text-xs shadow">
            {COUNTRY_PRESETS[selectedCountry]?.flag || '🇻🇳'}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-black text-yellow-400">ADMIN BẢN ĐỒ</span>
            <span className="text-[10px] text-gray-400">{gameState.roundId} • Đang Thu Gọn</span>
          </div>
          <button
            onClick={() => setIsMinimized(false)}
            className="px-3 py-1.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-black text-xs flex items-center gap-1 shadow"
            title="Mở rộng bảng quản trị"
          >
            <Maximize2 size={13} /> Mở Rộng
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10"
            title="Đóng"
          >
            <X size={15} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-start justify-end p-2 sm:p-3 animate-in fade-in duration-200">
      <div 
        style={{
          width: modalWidthMode === 'compact' ? '400px' : modalWidthMode === 'medium' ? '560px' : '820px',
          maxWidth: 'calc(100vw - 16px)'
        }}
        className="pointer-events-auto h-[95vh] bg-[#0f1118]/98 backdrop-blur-2xl border border-yellow-500/40 rounded-2xl shadow-2xl shadow-black/80 flex flex-col overflow-hidden text-gray-100 font-sans transition-all duration-200 ml-auto"
      >
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-black/60 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-red-600 via-amber-500 to-yellow-400 flex items-center justify-center shadow-md shadow-red-500/20 shrink-0">
              <Shield size={16} className="text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h2 className="text-xs font-black text-white tracking-wide truncate">
                  ADMIN GAME GHÉP CỜ & VOICE AI
                </h2>
                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-red-600 text-white shadow-sm shrink-0">
                  {gameState.roundId}
                </span>
                <span className="text-xs shrink-0">{COUNTRY_PRESETS[selectedCountry]?.flag || '🇻🇳'}</span>
              </div>
              <p className="text-[10px] text-gray-400 truncate">
                200 Quốc gia • 30+ Voice AI • Cài Đặt Quà Tặng & Tương Tác
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Width Size Switcher */}
            <div className="hidden sm:flex items-center bg-black/50 border border-white/10 rounded-lg p-0.5 text-[10px]">
              <button
                onClick={() => setModalWidthMode('compact')}
                className={`px-1.5 py-0.5 rounded transition-colors ${modalWidthMode === 'compact' ? 'bg-yellow-500 text-black font-black' : 'text-gray-400 hover:text-white'}`}
                title="Khung Gọn (400px)"
              >
                Gọn
              </button>
              <button
                onClick={() => setModalWidthMode('medium')}
                className={`px-1.5 py-0.5 rounded transition-colors ${modalWidthMode === 'medium' ? 'bg-yellow-500 text-black font-black' : 'text-gray-400 hover:text-white'}`}
                title="Khung Vừa (560px)"
              >
                Vừa
              </button>
              <button
                onClick={() => setModalWidthMode('wide')}
                className={`px-1.5 py-0.5 rounded transition-colors ${modalWidthMode === 'wide' ? 'bg-yellow-500 text-black font-black' : 'text-gray-400 hover:text-white'}`}
                title="Khung Rộng (820px)"
              >
                Rộng
              </button>
            </div>

            <button
              onClick={() => setIsMinimized(true)}
              className="p-1.5 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
              title="Thu nhỏ cửa sổ góc phải (để xem toàn cảnh Live)"
            >
              <Minimize2 size={14} />
            </button>

            <button
              onClick={handleSaveAll}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 shadow-md ${
                saveSuccess 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-black font-black'
              }`}
            >
              {saveSuccess ? <Check size={13} /> : <Save size={13} />}
              <span className="hidden sm:inline">{saveSuccess ? 'Đã Lưu!' : 'Lưu'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
              title="Đóng bảng Admin"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-4 py-2 bg-[#141722] border-b border-white/10 overflow-x-auto shrink-0 custom-scrollbar">
          {[
            { id: 'operations', label: '🎮 Vận Hành & Khối Chữ Ô Cờ' },
            { id: 'camera', label: '🎥 Góc Nhìn & Camera 3D' },
            { id: 'countries', label: '🌍 200 Quốc Gia & Quần Đảo' },
            { id: 'voices', label: '🎙️ Voice AI & Bình Luận (30+ Giọng)' },
            { id: 'audio', label: '🎵 Tải Nhạc BGM & Kho SFX' },
            { id: 'grid_cells', label: '🔢 Cài Đặt Số Ô Cờ' },
            { id: 'map_texts', label: '📍 Ghim Nhãn Địa Danh 3D' },
            { id: 'gifts', label: '🎁 Cấu Hình Quà Tặng' },
            { id: 'provinces', label: '🗺️ Danh Sách Vùng Miền' },
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
          
          {/* TAB 0: CAMERA & GÓC NHÌN 3D (ĐIỀU KHIỂN TRỰC TIẾP TỪ CÀI ĐẶT CHO CHẾ ĐỘ 16:9) */}
          {activeTab === 'camera' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-black text-white uppercase flex items-center gap-2">
                  <Compass size={16} className="text-amber-400" /> Điều Khiển Góc Nhìn & Camera Bản Đồ 3D
                </h3>
                <p className="text-xs text-gray-400">Tùy chỉnh góc quay, zoom phóng to thu nhỏ, di chuyển pan và đổi chế độ 2D/3D trực tiếp</p>
              </div>

              {/* Quick Presets Grid */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                <span className="text-xs font-bold text-yellow-300 uppercase tracking-wider block">🌐 Các Góc Nhìn Nhanh (Camera Presets):</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'overview', icon: '🌐', title: 'Toàn Cảnh Đất Nước', desc: 'Bao quát trọn vẹn dải đất hình chữ S' },
                    { id: 'north', icon: '🏛️', title: 'Miền Bắc & Hà Nội', desc: 'Thủ đô Hà Nội và các tỉnh phía Bắc' },
                    { id: 'central', icon: '🏖️', title: 'Miền Trung & Huế', desc: 'Duyên hải miền Trung, Đà Nẵng, Huế' },
                    { id: 'south', icon: '🏙️', title: 'Miền Nam & TP.HCM', desc: 'TP. Hồ Chí Minh & Nam Bộ' },
                    { id: 'islands', icon: '🏝️', title: 'Hoàng Sa & Trường Sa', desc: 'Quần đảo thiêng liêng Tổ Quốc' },
                    { id: 'tip_camau', icon: '⛵', title: 'Mũi Cà Mau', desc: 'Cực Nam của Tổ Quốc' },
                  ].map(p => (
                    <button
                      key={p.id}
                      onClick={() => triggerCameraAction('preset', p.id)}
                      className="p-3.5 rounded-xl bg-black/40 border border-white/10 hover:border-amber-400/50 hover:bg-amber-500/10 text-left transition-all group"
                    >
                      <div className="text-xl mb-1">{p.icon}</div>
                      <div className="text-xs font-black text-white group-hover:text-yellow-300 transition-colors">{p.title}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">{p.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2D / 3D, Pan & Zoom Tools */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                  <span className="text-xs font-bold text-yellow-300 uppercase tracking-wider block">📐 Chế Độ Không Gian & Xoay:</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => triggerCameraAction('viewMode3D', true)}
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <Globe size={14} className="text-yellow-300" />
                      <span>Chế Độ 3D Voxel</span>
                    </button>
                    <button
                      onClick={() => triggerCameraAction('viewMode3D', false)}
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <Layers size={14} className="text-yellow-300" />
                      <span>Chế Độ 2D Phẳng</span>
                    </button>
                  </div>
                  <button
                    onClick={() => triggerCameraAction('autoRotate')}
                    className="w-full py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw size={14} className="text-purple-300" />
                    <span>Bật / Tắt Tự Động Xoay 3D (Auto Rotate)</span>
                  </button>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                  <span className="text-xs font-bold text-yellow-300 uppercase tracking-wider block">🔍 Phóng To / Thu Nhỏ & Di Chuyển:</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => triggerCameraAction('zoomIn')}
                      className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-yellow-300 font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                    >
                      <ZoomIn size={14} /> Phóng To (Zoom +)
                    </button>
                    <button
                      onClick={() => triggerCameraAction('zoomOut')}
                      className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-yellow-300 font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                    >
                      <ZoomOut size={14} /> Thu Nhỏ (Zoom -)
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-1 max-w-[120px] mx-auto text-center pt-1">
                    <div></div>
                    <button onClick={() => triggerCameraAction('panStep', { dx: 0, dy: -25 })} className="p-2 rounded-lg bg-white/10 hover:bg-white/25 text-xs font-bold text-yellow-300">▲</button>
                    <div></div>
                    <button onClick={() => triggerCameraAction('panStep', { dx: -25, dy: 0 })} className="p-2 rounded-lg bg-white/10 hover:bg-white/25 text-xs font-bold text-yellow-300">◀</button>
                    <div className="flex items-center justify-center text-xs text-gray-500">🎯</div>
                    <button onClick={() => triggerCameraAction('panStep', { dx: 25, dy: 0 })} className="p-2 rounded-lg bg-white/10 hover:bg-white/25 text-xs font-bold text-yellow-300">▶</button>
                    <div></div>
                    <button onClick={() => triggerCameraAction('panStep', { dx: 0, dy: 25 })} className="p-2 rounded-lg bg-white/10 hover:bg-white/25 text-xs font-bold text-yellow-300">▼</button>
                    <div></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
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

                {/* Banner Colors & Voxel Scale Customizer */}
                <div className="p-4 bg-black/40 border border-white/10 rounded-xl space-y-3">
                  <div className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                    <Palette size={14} className="text-yellow-400" /> Tùy Chỉnh Màu Sắc & Kích Thước Ô Cờ Khối Chữ:
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-300">
                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1 font-semibold">Màu Ô Khi Đã Cắm Cờ:</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={bannerClaimedColor}
                          onChange={(e) => {
                            const col = e.target.value;
                            setBannerClaimedColor(col);
                            bandoEngine.setBannerColors(col, bannerUnclaimedColor, bannerVoxelScale);
                          }}
                          className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border border-white/20"
                        />
                        <span className="font-mono text-xs text-yellow-300 font-bold">{bannerClaimedColor}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1 font-semibold">Màu Ô Khung Chưa Cắm:</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={bannerUnclaimedColor}
                          onChange={(e) => {
                            const col = e.target.value;
                            setBannerUnclaimedColor(col);
                            bandoEngine.setBannerColors(bannerClaimedColor, col, bannerVoxelScale);
                          }}
                          className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border border-white/20"
                        />
                        <span className="font-mono text-xs text-gray-400 font-bold">{bannerUnclaimedColor}</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-[11px] text-gray-400 font-semibold">Kích Cỡ Khối Voxel:</span>
                        <span className="font-mono text-yellow-300 font-bold">{bannerVoxelScale}x</span>
                      </div>
                      <input
                        type="range" min="0.8" max="3.0" step="0.1"
                        value={bannerVoxelScale}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setBannerVoxelScale(val);
                          bandoEngine.setBannerColors(bannerClaimedColor, bannerUnclaimedColor, val);
                        }}
                        className="w-full h-1.5 bg-gray-700 rounded-lg accent-yellow-400 cursor-pointer mt-2"
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

                {/* Real-time TikTok Live Studio Connection Box */}
                <div className="p-4 bg-gradient-to-r from-rose-950/70 via-red-950/60 to-slate-900/80 border border-rose-500/50 rounded-2xl shadow-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-black text-white flex items-center gap-2">
                      <span className="text-base">📡</span>
                      <span className="uppercase text-rose-300 font-black">Kết Nối TikTok Live Studio (Bắt Quà Thật Realtime)</span>
                    </div>
                    <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border font-bold ${
                      isTiktokConnected 
                        ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                        : 'bg-rose-950/80 text-rose-300 border-rose-500/40'
                    }`}>
                      {isTiktokConnected ? `● ĐÃ KẾT NỐI: ${tiktokConnectedUser}` : '○ CHƯA KẾT NỐI LIVE'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={tiktokUsernameInput}
                      onChange={(e) => setTiktokUsernameInput(e.target.value)}
                      placeholder="Nhập @username TikTok (VD: thienvuaapp)"
                      className="flex-1 px-3 py-2 bg-black/60 border border-white/20 rounded-xl text-xs text-white placeholder-gray-400 focus:outline-none focus:border-rose-400 font-mono"
                    />
                    {isTiktokConnected ? (
                      <button
                        onClick={handleDisconnectTiktok}
                        className="py-2 px-4 bg-rose-700 hover:bg-rose-600 text-white rounded-xl text-xs font-black transition-all shadow-md active:scale-95"
                      >
                        Ngắt Kết Nối
                      </button>
                    ) : (
                      <button
                        onClick={handleConnectTiktok}
                        disabled={isConnectingTiktok}
                        className="py-2 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-black transition-all shadow-md active:scale-95 disabled:opacity-50"
                      >
                        {isConnectingTiktok ? 'Đang Kết Nối...' : '⚡ Kết Nối Live'}
                      </button>
                    )}
                  </div>

                  {/* Fast Gift Testing Buttons (Test ngay lập tức cắm cờ) */}
                  <div className="pt-1 border-t border-white/10">
                    <div className="text-[10px] text-gray-300 font-bold mb-1.5 flex items-center justify-between">
                      <span>🧪 Test Nhanh Quà Tặng (Bấm là cắm cờ và lên Top 10 ngay lập tức):</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                      <button
                        onClick={() => handleTestSpecificGift('rose', 'Hoa Hồng', 1, 1, null)}
                        className="p-1.5 bg-white/5 hover:bg-rose-600/30 border border-white/10 hover:border-rose-400 rounded-lg text-[10px] font-bold text-rose-200 transition-all flex items-center justify-center gap-1"
                      >
                        <span>🌹</span> <span>Hoa Hồng (1 Ô)</span>
                      </button>
                      <button
                        onClick={() => handleTestSpecificGift('peach', 'Quả Đào MB', 1, 5, 'north')}
                        className="p-1.5 bg-white/5 hover:bg-rose-600/30 border border-white/10 hover:border-rose-400 rounded-lg text-[10px] font-bold text-rose-200 transition-all flex items-center justify-center gap-1"
                      >
                        <span>🍑</span> <span>Đào MB (5 Ô)</span>
                      </button>
                      <button
                        onClick={() => handleTestSpecificGift('spin_ball', 'Bóng Xoáy MT', 1, 5, 'central')}
                        className="p-1.5 bg-white/5 hover:bg-amber-600/30 border border-white/10 hover:border-amber-400 rounded-lg text-[10px] font-bold text-amber-200 transition-all flex items-center justify-center gap-1"
                      >
                        <span>⚽</span> <span>Bóng MT (5 Ô)</span>
                      </button>
                      <button
                        onClick={() => handleTestSpecificGift('bing_chilling', 'Kem MN', 1, 5, 'south')}
                        className="p-1.5 bg-white/5 hover:bg-emerald-600/30 border border-white/10 hover:border-emerald-400 rounded-lg text-[10px] font-bold text-emerald-200 transition-all flex items-center justify-center gap-1"
                      >
                        <span>🍦</span> <span>Kem MN (5 Ô)</span>
                      </button>
                      <button
                        onClick={() => handleTestSpecificGift('lion_king', 'Sư Tử', 1, 29999, null)}
                        className="p-1.5 bg-yellow-500/20 hover:bg-yellow-500/40 border border-yellow-400/50 rounded-lg text-[10px] font-black text-yellow-300 transition-all flex items-center justify-center gap-1 shadow-sm"
                      >
                        <span>🦁</span> <span>Sư Tử (29k Ô)</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* AI Commentary & Comment Auto-Reply Time Controller Box */}
                <div className="p-4 bg-gradient-to-r from-indigo-950/70 via-slate-900/80 to-purple-950/70 border border-indigo-500/40 rounded-2xl shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-black text-white flex items-center gap-2">
                      <span className="text-base">🎙️</span>
                      <span className="uppercase text-indigo-300 font-black">Hệ Thống Trả Lời Bình Luận & Dẫn Dắt AI Tự Động</span>
                    </div>
                    <span className="text-[10px] text-indigo-400 font-mono bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-500/30">
                      {isVoiceKeywordReply || isVoiceGeminiAI ? '● AI PHẢN HỒI: BẬT' : '○ TẮT'}
                    </span>
                  </div>

                  <p className="text-[11.5px] text-gray-200 leading-relaxed">
                    ⚡ <strong>Trả lời theo từ khóa & AI thông minh</strong>: Tự động phát âm thanh trả lời khán giả khi bình luận đúng từ khóa (chào hỏi, hướng dẫn, cắm cờ) hoặc câu hỏi bất kỳ, đồng thời điều chỉnh thời gian giãn cách để giọng đọc siêu mượt.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    {/* Slider 1: Chu kỳ AI Tự Động Bình Luận Dẫn Dắt */}
                    <div className="bg-black/40 border border-white/10 p-3 rounded-xl space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-gray-300 flex items-center gap-1.5">
                          <span>⏱️</span> Chu Kỳ AI Bình Luận Dẫn Dắt:
                        </span>
                        <span className="text-amber-400 font-mono text-xs font-black bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                          {voiceCommentaryInterval} giây
                        </span>
                      </div>
                      <input
                        type="range"
                        min={5}
                        max={180}
                        step={5}
                        value={voiceCommentaryInterval}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setVoiceCommentaryInterval(val);
                          mapVoiceEngine.setIntervalSeconds(val);
                        }}
                        className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
                      />
                      <div className="flex justify-between text-[9.5px] text-gray-400 font-mono">
                        <span>5s (Nhanh)</span>
                        <span>25s (Chuẩn)</span>
                        <span>180s (Thưa)</span>
                      </div>
                    </div>

                    {/* Slider 2: Giãn cách Trả Lời Bình Luận tránh đè tiếng */}
                    <div className="bg-black/40 border border-white/10 p-3 rounded-xl space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-gray-300 flex items-center gap-1.5">
                          <span>⏳</span> Giãn Cách Trả Lời Bình Luận:
                        </span>
                        <span className="text-cyan-400 font-mono text-xs font-black bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                          {voiceReplyCooldown} giây
                        </span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={30}
                        step={1}
                        value={voiceReplyCooldown}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setVoiceReplyCooldown(val);
                          mapVoiceEngine.setReplyCooldownSec(val);
                        }}
                        className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                      />
                      <div className="flex justify-between text-[9.5px] text-gray-400 font-mono">
                        <span>1s (Tức thì)</span>
                        <span>3s (Khuyên dùng)</span>
                        <span>30s (Giãn cách cao)</span>
                      </div>
                    </div>
                  </div>

                  {/* Feature Toggles */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                    <button
                      onClick={() => {
                        const nxt = !isVoiceKeywordReply;
                        setIsVoiceKeywordReply(nxt);
                        mapVoiceEngine.isKeywordAutoReplyEnabled = nxt;
                        mapVoiceEngine.saveSettings();
                      }}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                        isVoiceKeywordReply
                          ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                          : 'bg-black/40 border-white/10 text-gray-400'
                      }`}
                    >
                      <span>{isVoiceKeywordReply ? '✅' : '⚪'}</span>
                      <span>Khớp Từ Khóa Cài Sẵn</span>
                    </button>

                    <button
                      onClick={() => {
                        const nxt = !isVoiceGeminiAI;
                        setIsVoiceGeminiAI(nxt);
                        mapVoiceEngine.useGeminiAI = nxt;
                        mapVoiceEngine.saveSettings();
                      }}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                        isVoiceGeminiAI
                          ? 'bg-purple-950/60 border-purple-500/50 text-purple-300'
                          : 'bg-black/40 border-white/10 text-gray-400'
                      }`}
                    >
                      <span>{isVoiceGeminiAI ? '✅' : '⚪'}</span>
                      <span>Trợ Lý Gemini AI</span>
                    </button>

                    <button
                      onClick={() => {
                        const nxt = !isVoiceAutoCommentary;
                        setIsVoiceAutoCommentary(nxt);
                        mapVoiceEngine.isAutoEnabled = nxt;
                        if (nxt) {
                          mapVoiceEngine.startPeriodicCommentary(true);
                        } else {
                          mapVoiceEngine.stopPeriodicCommentary();
                        }
                        mapVoiceEngine.saveSettings();
                      }}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                        isVoiceAutoCommentary
                          ? 'bg-amber-950/60 border-amber-500/50 text-amber-300'
                          : 'bg-black/40 border-white/10 text-gray-400'
                      }`}
                    >
                      <span>{isVoiceAutoCommentary ? '✅' : '⚪'}</span>
                      <span>AI Dẫn Dắt Theo Chu Kỳ</span>
                    </button>
                  </div>

                  {/* Live Comment Test Simulator */}
                  <div className="pt-2 border-t border-white/10 space-y-2">
                    <div className="text-[10.5px] text-gray-300 font-bold flex items-center justify-between">
                      <span>🧪 Test Thử Bình Luận & Nghe Voice AI Phản Hồi Trực Tiếp:</span>
                      {testCommentResult && (
                        <span className="text-[10px] text-emerald-400 font-mono animate-pulse">{testCommentResult}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={testCommentInput}
                        onChange={(e) => setTestCommentInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleTestComment()}
                        placeholder="Nhập thử: xin chào, hướng dẫn, chơi sao, yêu việt nam, số 1..."
                        className="flex-1 px-3 py-2 bg-black/60 border border-white/20 rounded-xl text-xs text-white placeholder-gray-400 focus:outline-none focus:border-indigo-400"
                      />
                      <button
                        onClick={handleTestComment}
                        className="py-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black transition-all shadow-md active:scale-95 flex items-center gap-1.5"
                      >
                        <span>💬</span> <span>Gửi Test</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Auto 24/7 Control Banner (CHẠY THẬT TIKTOK LIVE) */}
                <div className="p-4 bg-gradient-to-r from-emerald-950/60 via-teal-950/50 to-slate-900/80 border border-emerald-500/40 rounded-2xl shadow-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-black text-white flex items-center gap-2">
                      <Zap size={15} className="text-yellow-400 fill-yellow-400 shrink-0" />
                      <span className="uppercase text-emerald-300 font-black">Vận Hành Auto 24/7 (Chạy Thật TikTok Live)</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                      {bandoEngine.isAuto247Running ? '● ĐANG CHẠY' : '○ ĐANG DỪNG'}
                    </span>
                  </div>

                  <p className="text-[11.5px] text-gray-200 leading-relaxed">
                    ⚡ <strong>Chế độ Livestream 24/7</strong>: Tự động chạy nhạc nền BGM, bình luận viên AI và bắt sự kiện quà tặng từ khán giả để cắm cờ thời gian thực.
                  </p>

                  <div className="flex items-center gap-2.5 pt-1">
                    <button
                      onClick={() => {
                        bandoEngine.toggleAuto247();
                        setIsAutoTesting(false);
                      }}
                      className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-md ${
                        bandoEngine.isAuto247Running
                          ? 'bg-red-600 hover:bg-red-500 text-white ring-2 ring-yellow-400 animate-pulse shadow-red-500/30'
                          : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-500/20'
                      }`}
                    >
                      <Zap size={14} className="shrink-0" />
                      <span>{bandoEngine.isAuto247Running ? '🛑 Dừng Auto 24/7' : '⚡ Bật Auto 24/7 (Chạy Thật)'}</span>
                    </button>

                    <button
                      onClick={() => {
                        if (bandoEngine.isAutoTesting) {
                          bandoEngine.stopAutoTestLoop();
                          setIsAutoTesting(false);
                        } else {
                          bandoEngine.startAutoTestLoop();
                          setIsAutoTesting(true);
                        }
                      }}
                      className={`py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-md ${
                        isAutoTesting
                          ? 'bg-amber-600 hover:bg-amber-500 text-white animate-pulse'
                          : 'bg-white/10 hover:bg-white/20 text-yellow-300 border border-yellow-500/30'
                      }`}
                      title="Chạy mô phỏng thả quà giả lập để test"
                    >
                      {isAutoTesting ? <Square size={13} fill="currentColor" /> : <Play size={13} fill="currentColor" />}
                      <span>{isAutoTesting ? 'Dừng Demo' : '🪄 Chạy Demo'}</span>
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

              {/* Ô TẢI ẢNH MẪU BẢN ĐỒ QUỐC GIA THAM CHIẾU CHUẨN XÁC 100% */}
              <div className="p-4 bg-gradient-to-r from-blue-950/50 via-indigo-950/40 to-black/80 border border-blue-500/40 rounded-2xl space-y-3 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      <UploadCloud size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                        <span>Tải Lên Ảnh Mẫu Bản Đồ / Quốc Gia Tùy Chọn</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">Chuẩn Xác 100%</span>
                      </h4>
                      <p className="text-[10px] text-gray-300">
                        Tải ảnh bản đồ lãnh thổ bất kỳ (PNG, JPG, WebP) để AI tự động trích xuất ma trận ô cờ 3D khớp 100% hình dạng thực tế.
                      </p>
                    </div>
                  </div>

                  <input
                    ref={mapImageFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleUploadMapImage}
                    className="hidden"
                  />

                  <button
                    onClick={() => mapImageFileInputRef.current?.click()}
                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-500/20 flex items-center justify-center gap-1.5 transition-all shrink-0 active:scale-95"
                  >
                    <Image size={14} />
                    <span>{uploadedMapImage ? '🔄 Đổi Ảnh Khác' : '📁 Chọn Ảnh Bản Đồ'}</span>
                  </button>
                </div>

                {uploadedMapImage && (
                  <div className="p-3 bg-black/60 border border-white/10 rounded-xl space-y-3 animate-in fade-in duration-200">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      {/* Image Thumbnail Preview */}
                      <div className="relative w-24 h-28 bg-black/80 rounded-lg border border-blue-400/40 overflow-hidden shrink-0 flex items-center justify-center">
                        <img 
                          src={uploadedMapImage} 
                          alt="Bản đồ mẫu" 
                          className="max-w-full max-h-full object-contain"
                        />
                        <span className="absolute bottom-0 inset-x-0 bg-black/80 text-[8px] text-center text-blue-300 font-mono py-0.5">
                          Ảnh Mẫu
                        </span>
                      </div>

                      {/* Custom Country Name & Cell Count Inputs */}
                      <div className="flex-1 w-full space-y-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] font-bold text-gray-300 block mb-1">Tên Quốc Gia / Vùng Đất:</label>
                            <input
                              type="text"
                              value={customCountryNameInput}
                              onChange={(e) => setCustomCountryNameInput(e.target.value)}
                              placeholder="Ví dụ: Việt Nam, Nhật Bản, Châu Âu..."
                              className="w-full px-2.5 py-1.5 bg-black/70 border border-white/20 rounded-lg text-xs font-bold text-white outline-none focus:border-blue-400"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-gray-300 block mb-1">Số Ô Cờ Ma Trận 3D:</label>
                            <input
                              type="number"
                              value={totalCellsInput}
                              onChange={(e) => setTotalCellsInput(e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-black/70 border border-white/20 rounded-lg text-xs font-mono font-bold text-yellow-300 outline-none focus:border-blue-400"
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10px] text-emerald-400 font-mono">
                            {mapProcessSuccess ? '✓ Đã tạo thành công Bản Đồ 3D từ ảnh mẫu!' : 'Đã nạp ảnh mẫu sẵn sàng'}
                          </span>

                          <button
                            onClick={handleApplyCustomMapFromImage}
                            disabled={isProcessingMapImage}
                            className={`px-4 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-md ${
                              isProcessingMapImage
                                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-500/30 active:scale-95'
                            }`}
                          >
                            {isProcessingMapImage ? <RefreshCw size={13} className="animate-spin" /> : <CheckCircle size={13} />}
                            <span>{isProcessingMapImage ? 'Đang Xử Lý Ma Trận...' : '🚀 Áp Dụng Bản Đồ 3D Khớp 100%'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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
                        {country.labels?.some(l => l.text.includes('ĐẢO')) && (
                          <div className="truncate text-emerald-400">🏝️ Hải đảo: {country.labels.filter(l => l.text.includes('ĐẢO')).map(l => l.text).slice(0, 2).join(', ')}</div>
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

          {/* TAB 3: VOICE AI, BLV & TRỢ LÝ TỰ ĐỘNG BÌNH LUẬN */}
          {activeTab === 'voices' && (
            <GameVoiceConfigPanel 
              engine={mapVoiceEngine} 
              gameType="map" 
            />
          )}

          {/* TAB 4: AUDIO BGM, CUSTOM UPLOAD & SFX & VOICE (CLEAN FLEX CARDS LAYOUT) */}
          {activeTab === 'audio' && (
            <div className="space-y-5">
              {/* Header Tab Âm Thanh */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div>
                  <h3 className="text-sm font-black text-white uppercase flex items-center gap-2">
                    <Music size={18} className="text-emerald-400" /> Bảng Điều Khiển Âm Thanh Toàn Diện (BGM, SFX & Giọng Đọc AI)
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Điều khiển âm thanh độc lập, bật tắt tức thì, đồng bộ mượt mà trên toàn bộ luồng phát sóng trực tiếp.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      bandoAudio.unlock();
                      bandoAudio.playWarHorn({ force: true });
                      setActivePlayingSfx('horn');
                      setTimeout(() => setActivePlayingSfx(null), 1200);
                    }}
                    className="px-3.5 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 border border-yellow-500/50 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-md shadow-yellow-500/10 active:scale-95"
                  >
                    <Zap size={14} className="text-yellow-400" /> Kích Hoạt Âm Thanh
                  </button>
                </div>
              </div>

              {/* CARD 1: NHẠC NỀN (BGM) */}
              <div className="bg-gradient-to-br from-emerald-950/60 via-black/80 to-emerald-950/30 border border-emerald-500/40 rounded-2xl p-4 sm:p-5 shadow-2xl space-y-4">
                <input
                  ref={bgmFileInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleUploadBgm}
                  className="hidden"
                />

                {/* Hàng 1: Tiêu đề + Trạng thái bài hát */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-500/20 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0">
                      <Music2 size={20} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-white uppercase tracking-wide">Nhạc Nền (BGM)</span>
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono font-black ${
                          isBgmPlaying ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/50 animate-pulse' : 'bg-gray-800 text-gray-400 border border-white/10'
                        }`}>
                          {isBgmPlaying ? '▶ ĐANG PHÁT' : '⏸ ĐÃ TẮT'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-300 font-mono mt-0.5 truncate" title={uploadedBgmName || 'Hào Khí Đông A (Synth 24/7)'}>
                        🎵 {uploadedBgmName || (isBgmPlaying ? 'Hào Khí Đông A (Synth 24/7)' : 'Chưa phát nhạc nền')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hàng 2: Lưới 4 nút bấm điều khiển BGM kích thước đồng đều, không tràn viền */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full">
                  <button
                    onClick={() => {
                      bandoAudio.unlock();
                      const newState = bandoAudio.toggleBgm();
                      setIsBgmPlaying(newState);
                    }}
                    className={`w-full py-2.5 px-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-lg active:scale-95 truncate ${
                      isBgmPlaying 
                        ? 'bg-rose-600 hover:bg-rose-500 text-white ring-2 ring-rose-400/50 shadow-rose-500/30' 
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white ring-2 ring-emerald-400/40 shadow-emerald-500/20'
                    }`}
                    title={isBgmPlaying ? "Bấm để tắt hẳn nhạc nền" : "Bấm để phát nhạc nền"}
                  >
                    {isBgmPlaying ? <Pause size={14} className="shrink-0" /> : <Play size={14} className="shrink-0" />}
                    <span className="truncate">{isBgmPlaying ? 'TẮT NHẠC' : 'PHÁT NHẠC'}</span>
                  </button>

                  <button
                    onClick={() => bgmFileInputRef.current?.click()}
                    className="w-full py-2.5 px-2 bg-emerald-700/60 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all active:scale-95 border border-emerald-500/40 flex items-center justify-center gap-1.5 truncate shadow-md"
                    title="Chọn file MP3 từ máy tính"
                  >
                    <Upload size={13} className="shrink-0" />
                    <span className="truncate">Tải MP3</span>
                  </button>

                  <button
                    onClick={() => {
                      bandoAudio.unlock();
                      bandoAudio.replayCustomBgm();
                      setIsBgmPlaying(true);
                    }}
                    className="w-full py-2.5 px-2 bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white rounded-xl text-xs font-bold transition-all active:scale-95 border border-white/15 flex items-center justify-center gap-1 truncate shadow-md"
                    title="Tua lại từ đầu bài hát (00:00)"
                  >
                    <RotateCcw size={13} className="shrink-0" />
                    <span className="truncate">Tua Đầu 00:00</span>
                  </button>

                  <button
                    onClick={() => {
                      const next = !bandoAudio.isBgmLoop;
                      bandoAudio.setBgmLoop(next);
                      setIsBgmLoop(next);
                    }}
                    className={`w-full py-2.5 px-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1 truncate shadow-md ${
                      isBgmLoop ? 'bg-purple-600/70 text-purple-100 border-purple-400 shadow-purple-500/20' : 'bg-black/50 text-gray-400 border-white/15'
                    }`}
                    title="Tự động lặp lại bài hát 24/7"
                  >
                    <Repeat size={13} className="shrink-0" />
                    <span className="truncate">{isBgmLoop ? 'Lặp 24/7' : 'Phát 1 Lần'}</span>
                  </button>
                </div>

                {/* Hàng 3: Volume & Seekbar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Volume Slider */}
                  <div className="p-3 bg-black/60 border border-emerald-500/30 rounded-xl space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-gray-300">
                      <span className="flex items-center gap-1.5"><Volume2 size={14} className="text-emerald-400" /> Âm Lượng BGM:</span>
                      <span className="font-mono text-emerald-300 font-black">{Math.round(bgmVolume * 100)}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="1" step="0.05" value={bgmVolume}
                      onChange={(e) => {
                        const v = parseFloat(e.target.value);
                        setBgmVolume(v);
                        bandoAudio.setBgmVolume(v);
                        bandoEngine.updateSettings({ bgmVolume: v });
                      }}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                    />
                  </div>

                  {/* Seekbar */}
                  <div className="p-3 bg-black/60 border border-emerald-500/30 rounded-xl space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-mono text-emerald-300">
                      <span className="text-gray-400 font-sans font-bold">Tiến Trình Phát:</span>
                      <span className="font-bold text-amber-300 font-mono">
                        {formatAudioTime(bgmCurrentTime)} / {formatAudioTime(bgmDuration)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={bgmDuration > 0 ? bgmDuration : 100}
                      step="0.25"
                      value={bgmCurrentTime}
                      onChange={handleSeekBgm}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                    />
                  </div>
                </div>
              </div>

              {/* CARD 2: HIỆU ỨNG ÂM THANH (SFX) */}
              <div className="bg-gradient-to-br from-amber-950/50 via-black/80 to-amber-950/30 border border-amber-500/40 rounded-2xl p-4 sm:p-5 shadow-2xl space-y-4">
                <input
                  ref={sfxFileInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleUploadSfx}
                  className="hidden"
                />

                {/* Hàng 1: Tiêu đề + Trạng thái SFX */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-500/20 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 shrink-0">
                      <Zap size={20} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-white uppercase tracking-wide">Hiệu Ứng Âm Thanh (SFX)</span>
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono font-black ${
                          isSfxEnabled ? 'bg-yellow-500/25 text-yellow-300 border border-yellow-500/50' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        }`}>
                          {isSfxEnabled ? '🔊 ĐANG BẬT' : '🔇 ĐÃ TẮT'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-300 mt-0.5 truncate">
                        Âm thanh cắm cờ, kèn lệnh xung trận, tiếng trống trận gay cấn
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hàng 2: Lưới 4 nút bấm điều khiển & test nhanh SFX gọn gàng */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full">
                  <button
                    onClick={() => {
                      bandoAudio.unlock();
                      const nextState = bandoAudio.toggleSfx();
                      setIsSfxEnabled(nextState);
                    }}
                    className={`w-full py-2.5 px-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-lg active:scale-95 truncate ${
                      isSfxEnabled
                        ? 'bg-yellow-500 hover:bg-yellow-400 text-black ring-2 ring-yellow-300/40 shadow-yellow-500/20'
                        : 'bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40'
                    }`}
                    title={isSfxEnabled ? "Bấm để tắt hiệu ứng âm thanh" : "Bấm để bật hiệu ứng âm thanh"}
                  >
                    {isSfxEnabled ? <Volume2 size={14} className="shrink-0" /> : <VolumeX size={14} className="shrink-0" />}
                    <span className="truncate">{isSfxEnabled ? 'BẬT SFX' : 'TẮT SFX'}</span>
                  </button>

                  <button
                    onClick={() => sfxFileInputRef.current?.click()}
                    className="w-full py-2.5 px-2 bg-yellow-600/80 hover:bg-yellow-500 text-black font-black rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95 truncate"
                    title="Tải file SFX riêng từ máy tính"
                  >
                    <Upload size={13} className="shrink-0" />
                    <span className="truncate">Tải SFX File</span>
                  </button>

                  <button
                    onClick={() => {
                      bandoAudio.unlock();
                      bandoAudio.playWarHorn({ force: true });
                      setActivePlayingSfx('horn');
                      setTimeout(() => setActivePlayingSfx(null), 1200);
                    }}
                    className={`w-full py-2.5 px-2 bg-yellow-500/15 hover:bg-yellow-500/25 text-yellow-300 border border-yellow-500/40 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 truncate ${
                      activePlayingSfx === 'horn' ? 'ring-2 ring-yellow-400 bg-yellow-500/30' : ''
                    }`}
                  >
                    <Play size={12} fill="currentColor" className="shrink-0" />
                    <span className="truncate">🎺 Thử Kèn</span>
                  </button>

                  <button
                    onClick={() => {
                      bandoAudio.unlock();
                      bandoAudio.playFlagPlace(1, { force: true });
                      setActivePlayingSfx('flag');
                      setTimeout(() => setActivePlayingSfx(null), 800);
                    }}
                    className={`w-full py-2.5 px-2 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 truncate ${
                      activePlayingSfx === 'flag' ? 'ring-2 ring-emerald-400 bg-emerald-500/30' : ''
                    }`}
                  >
                    <Play size={12} fill="currentColor" className="shrink-0" />
                    <span className="truncate">🚩 Thử Cắm Cờ</span>
                  </button>
                </div>

                {/* Hàng 3: Volume SFX */}
                <div className="p-3 bg-black/60 border border-yellow-500/30 rounded-xl space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-gray-300">
                    <span className="flex items-center gap-1.5"><Volume2 size={14} className="text-yellow-400" /> Âm Lượng Hiệu Ứng (SFX):</span>
                    <span className="font-mono text-yellow-300 font-black">{Math.round(sfxVolume * 100)}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="1" step="0.05" value={sfxVolume}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      setSfxVolume(v);
                      bandoAudio.setSfxVolume(v);
                      bandoEngine.updateSettings({ sfxVolume: v });
                    }}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-400"
                  />
                </div>
              </div>

              {/* CARD 3: GIỌNG ĐỌC AI (VOICE BLV) */}
              <div className="bg-gradient-to-br from-cyan-950/50 via-black/80 to-blue-950/30 border border-cyan-500/40 rounded-2xl p-4 sm:p-5 shadow-2xl space-y-4">
                {/* Hàng 1: Tiêu đề + Trạng thái Voice */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cyan-500/20 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shrink-0">
                      <Mic size={20} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-white uppercase tracking-wide">Giọng Đọc AI (Voice BLV)</span>
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono font-black ${
                          isVoiceEnabled ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/50' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        }`}>
                          {isVoiceEnabled ? '🎙️ ĐANG BẬT' : '🔇 ĐÃ TẮT'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-300 mt-0.5 truncate">
                        Bình luận viên & Thuyết minh trận đấu tự động theo thời gian thực
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hàng 2: Nút điều khiển Voice */}
                <div className="grid grid-cols-2 gap-2 w-full">
                  <button
                    onClick={() => {
                      const nextState = bandoAudio.toggleVoice();
                      setIsVoiceEnabled(nextState);
                      mapVoiceEngine.setMuted(!nextState);
                    }}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-lg active:scale-95 truncate ${
                      isVoiceEnabled
                        ? 'bg-cyan-500 hover:bg-cyan-400 text-black ring-2 ring-cyan-300/40 shadow-cyan-500/20'
                        : 'bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40'
                    }`}
                    title={isVoiceEnabled ? "Bấm để tắt giọng đọc AI" : "Bấm để bật giọng đọc AI"}
                  >
                    {isVoiceEnabled ? <Volume2 size={14} className="shrink-0" /> : <VolumeX size={14} className="shrink-0" />}
                    <span className="truncate">{isVoiceEnabled ? 'BẬT GIỌNG ĐỌC AI' : 'TẮT GIỌNG ĐỌC AI'}</span>
                  </button>

                  <button
                    onClick={() => {
                      mapVoiceEngine.speak("Chào mừng các chiến binh đến với Đại chiến Bản đồ Việt Nam! Cùng chung tay cắm cờ Tổ Quốc nhé!", 'game', true);
                    }}
                    className="w-full py-2.5 px-3 bg-white/10 hover:bg-white/20 text-cyan-300 border border-white/15 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-md truncate"
                  >
                    <Play size={12} fill="currentColor" className="shrink-0" />
                    <span className="truncate">Nghe Thử BLV</span>
                  </button>
                </div>

                {/* Hàng 3: Âm lượng Voice */}
                <div className="p-3 bg-black/60 border border-cyan-500/30 rounded-xl space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-gray-300">
                    <span className="flex items-center gap-1.5"><Volume2 size={14} className="text-cyan-400" /> Âm Lượng Giọng Đọc:</span>
                    <span className="font-mono text-cyan-300 font-black">{Math.round(voiceVolume * 100)}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="1" step="0.05" value={voiceVolume}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      setVoiceVolume(v);
                      bandoAudio.setVoiceVolume(v);
                      mapVoiceEngine.setVolume(v);
                    }}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                </div>
              </div>

              {/* CARD 4: BẢNG KHO SFX KỊCH TÍNH (SOUNDBOARD) */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="text-xs font-black text-white uppercase flex items-center gap-2">
                    <Volume2 size={16} className="text-yellow-400" /> Kho Hiệu Ứng Âm Thanh Kịch Tính (SFX Soundboard):
                  </div>
                  <span className="text-[11px] text-gray-400">Bấm từng nút để phát âm thanh tức thì</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full">
                  <button
                    onClick={() => {
                      bandoAudio.unlock();
                      setActivePlayingSfx('horn');
                      bandoAudio.playWarHorn({ force: true });
                      setTimeout(() => setActivePlayingSfx(null), 1200);
                    }}
                    className={`p-3 border rounded-xl text-xs font-bold text-left transition-all active:scale-95 w-full ${
                      activePlayingSfx === 'horn'
                        ? 'bg-red-600 text-white border-yellow-300 ring-2 ring-red-400 animate-pulse shadow-lg'
                        : 'bg-red-950/60 hover:bg-red-900 border-red-500/30 text-white'
                    }`}
                  >
                    <div className="text-yellow-400 text-sm mb-1 flex items-center justify-between">
                      <span className="truncate">🎺 Kèn Xung Trận</span>
                      {activePlayingSfx === 'horn' ? <Volume2 size={13} className="text-yellow-300 shrink-0" /> : <Play size={11} className="text-gray-400 shrink-0" />}
                    </div>
                    <div className="text-[10px] text-gray-300 truncate">Hào hùng xung phong</div>
                  </button>

                  <button
                    onClick={() => {
                      bandoAudio.unlock();
                      setActivePlayingSfx('drums');
                      bandoAudio.playWarDrums(4, { force: true });
                      setTimeout(() => setActivePlayingSfx(null), 1500);
                    }}
                    className={`p-3 border rounded-xl text-xs font-bold text-left transition-all active:scale-95 w-full ${
                      activePlayingSfx === 'drums'
                        ? 'bg-amber-600 text-white border-yellow-300 ring-2 ring-amber-400 animate-pulse shadow-lg'
                        : 'bg-amber-950/60 hover:bg-amber-900 border-amber-500/30 text-white'
                    }`}
                  >
                    <div className="text-yellow-400 text-sm mb-1 flex items-center justify-between">
                      <span className="truncate">🥁 Trống Trận</span>
                      {activePlayingSfx === 'drums' ? <Volume2 size={13} className="text-yellow-300 shrink-0" /> : <Play size={11} className="text-gray-400 shrink-0" />}
                    </div>
                    <div className="text-[10px] text-gray-300 truncate">Dồn dập gay cấn</div>
                  </button>

                  <button
                    onClick={() => {
                      bandoAudio.unlock();
                      setActivePlayingSfx('fireworks');
                      bandoAudio.playFireworks({ force: true });
                      setTimeout(() => setActivePlayingSfx(null), 1400);
                    }}
                    className={`p-3 border rounded-xl text-xs font-bold text-left transition-all active:scale-95 w-full ${
                      activePlayingSfx === 'fireworks'
                        ? 'bg-purple-600 text-white border-yellow-300 ring-2 ring-purple-400 animate-pulse shadow-lg'
                        : 'bg-purple-950/60 hover:bg-purple-900 border-purple-500/30 text-white'
                    }`}
                  >
                    <div className="text-purple-300 text-sm mb-1 flex items-center justify-between">
                      <span className="truncate">🎆 Pháo Hoa Nổ</span>
                      {activePlayingSfx === 'fireworks' ? <Volume2 size={13} className="text-yellow-300 shrink-0" /> : <Play size={11} className="text-gray-400 shrink-0" />}
                    </div>
                    <div className="text-[10px] text-gray-300 truncate">Tiếng nổ rực rỡ</div>
                  </button>

                  <button
                    onClick={() => {
                      bandoAudio.unlock();
                      setActivePlayingSfx('cheer');
                      bandoAudio.playCrowdCheer({ force: true });
                      setTimeout(() => setActivePlayingSfx(null), 1600);
                    }}
                    className={`p-3 border rounded-xl text-xs font-bold text-left transition-all active:scale-95 w-full ${
                      activePlayingSfx === 'cheer'
                        ? 'bg-blue-600 text-white border-yellow-300 ring-2 ring-blue-400 animate-pulse shadow-lg'
                        : 'bg-blue-950/60 hover:bg-blue-900 border-blue-500/30 text-white'
                    }`}
                  >
                    <div className="text-blue-300 text-sm mb-1 flex items-center justify-between">
                      <span className="truncate">👏 Khán Giả Hò Reo</span>
                      {activePlayingSfx === 'cheer' ? <Volume2 size={13} className="text-yellow-300 shrink-0" /> : <Play size={11} className="text-gray-400 shrink-0" />}
                    </div>
                    <div className="text-[10px] text-gray-300 truncate">Cổ vũ rợp trời</div>
                  </button>

                  <button
                    onClick={() => {
                      bandoAudio.unlock();
                      setActivePlayingSfx('thunder');
                      bandoAudio.playThunderStrike({ force: true });
                      setTimeout(() => setActivePlayingSfx(null), 1200);
                    }}
                    className={`p-3 border rounded-xl text-xs font-bold text-left transition-all active:scale-95 w-full ${
                      activePlayingSfx === 'thunder'
                        ? 'bg-indigo-600 text-white border-yellow-300 ring-2 ring-indigo-400 animate-pulse shadow-lg'
                        : 'bg-indigo-950/60 hover:bg-indigo-900 border-indigo-500/30 text-white'
                    }`}
                  >
                    <div className="text-indigo-300 text-sm mb-1 flex items-center justify-between">
                      <span className="truncate">⚡ Sét Đánh Thần Thoại</span>
                      {activePlayingSfx === 'thunder' ? <Volume2 size={13} className="text-yellow-300 shrink-0" /> : <Play size={11} className="text-gray-400 shrink-0" />}
                    </div>
                    <div className="text-[10px] text-gray-300 truncate">Sấm sét giáng lâm</div>
                  </button>

                  <button
                    onClick={() => {
                      bandoAudio.unlock();
                      setActivePlayingSfx('coins');
                      bandoAudio.playGoldCoins(8, { force: true });
                      setTimeout(() => setActivePlayingSfx(null), 1200);
                    }}
                    className={`p-3 border rounded-xl text-xs font-bold text-left transition-all active:scale-95 w-full ${
                      activePlayingSfx === 'coins'
                        ? 'bg-yellow-600 text-white border-yellow-300 ring-2 ring-yellow-400 animate-pulse shadow-lg'
                        : 'bg-yellow-950/60 hover:bg-yellow-900 border-yellow-500/30 text-white'
                    }`}
                  >
                    <div className="text-yellow-300 text-sm mb-1 flex items-center justify-between">
                      <span className="truncate">💰 Mưa Tiền Vàng</span>
                      {activePlayingSfx === 'coins' ? <Volume2 size={13} className="text-yellow-300 shrink-0" /> : <Play size={11} className="text-gray-400 shrink-0" />}
                    </div>
                    <div className="text-[10px] text-gray-300 truncate">Xu rơi leng keng</div>
                  </button>

                  <button
                    onClick={() => {
                      bandoAudio.unlock();
                      setActivePlayingSfx('levelup');
                      bandoAudio.playLevelUp({ force: true });
                      setTimeout(() => setActivePlayingSfx(null), 1200);
                    }}
                    className={`p-3 border rounded-xl text-xs font-bold text-left transition-all active:scale-95 w-full ${
                      activePlayingSfx === 'levelup'
                        ? 'bg-teal-600 text-white border-yellow-300 ring-2 ring-teal-400 animate-pulse shadow-lg'
                        : 'bg-teal-950/60 hover:bg-teal-900 border-teal-500/30 text-white'
                    }`}
                  >
                    <div className="text-teal-300 text-sm mb-1 flex items-center justify-between">
                      <span className="truncate">🆙 Thăng Cấp Đột Phá</span>
                      {activePlayingSfx === 'levelup' ? <Volume2 size={13} className="text-yellow-300 shrink-0" /> : <Play size={11} className="text-gray-400 shrink-0" />}
                    </div>
                    <div className="text-[10px] text-gray-300 truncate">Lên cấp danh vọng</div>
                  </button>

                  <button
                    onClick={() => {
                      bandoAudio.unlock();
                      setActivePlayingSfx('victory');
                      bandoAudio.playVictoryTheme({ force: true });
                      setTimeout(() => setActivePlayingSfx(null), 2500);
                    }}
                    className={`p-3 border rounded-xl text-xs font-black text-left transition-all active:scale-95 w-full ${
                      activePlayingSfx === 'victory'
                        ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white border-yellow-200 ring-2 ring-yellow-400 animate-pulse shadow-lg'
                        : 'bg-gradient-to-r from-red-900 to-amber-900 border-yellow-400 text-white'
                    }`}
                  >
                    <div className="text-yellow-300 text-sm mb-1 flex items-center justify-between">
                      <span className="truncate">🏆 Đại Khải Hoàn Ca</span>
                      {activePlayingSfx === 'victory' ? <Volume2 size={13} className="text-yellow-300 shrink-0" /> : <Play size={11} className="text-gray-400 shrink-0" />}
                    </div>
                    <div className="text-[10px] text-yellow-100 truncate">Toàn thắng bản đồ</div>
                  </button>
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
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-gray-300">Chọn Nhanh Số Lượng Ô Cờ Chuẩn:</div>
                  <span className="text-xs font-black font-mono text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded-lg border border-yellow-500/30">
                    Hiện tại: {Number(gameState.totalCells || 15125).toLocaleString('vi-VN')} Ô
                  </span>
                </div>
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
                      type="button"
                      onClick={() => {
                        setTotalCellsInput(p.count);
                        bandoEngine.setTotalCells(p.count);
                        setSaveSuccess(true);
                        setTimeout(() => setSaveSuccess(false), 2500);
                      }}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        Number(gameState.totalCells) === p.count
                          ? 'bg-gradient-to-r from-red-600 to-amber-600 border-yellow-400 text-white shadow-lg ring-2 ring-yellow-400 scale-[1.02]'
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
                    className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs rounded-xl shadow-lg transition-all self-end active:scale-95"
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
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-black text-white uppercase flex items-center gap-2">
                    <Gift size={18} className="text-yellow-400" /> Quản Lý Kho Quà Tặng TikTok Live & Tỷ Lệ Cắm Cờ
                  </h3>
                  <p className="text-xs text-gray-400">
                    Đầy đủ 45+ quà tặng TikTok chuẩn từ 1 xu đến 44,999 xu. Cho phép thêm quà mới, chỉnh sửa tên/xu/ô cờ và xóa tùy ý.
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsAddingGift(!isAddingGift)}
                    className="px-3.5 py-2 bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-500 hover:to-red-500 text-white rounded-xl text-xs font-black shadow-lg flex items-center gap-1.5 transition-all"
                  >
                    <Plus size={14} /> {isAddingGift ? 'Đóng Form Thêm' : '➕ Thêm Quà Mới'}
                  </button>

                  <button
                    onClick={handleResetDefaultGifts}
                    className="px-3 py-2 bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                    title="Khôi phục toàn bộ danh mục quà chuẩn"
                  >
                    <RotateCcw size={13} /> Khôi Phục Gốc
                  </button>

                  <button
                    onClick={() => {
                      if (bandoEngine.isAutoTesting) {
                        bandoEngine.stopAutoTestLoop();
                        setIsAutoTesting(false);
                      } else {
                        bandoEngine.startAutoTestLoop();
                        setIsAutoTesting(true);
                      }
                    }}
                    className={`px-3.5 py-2 ${
                      isAutoTesting 
                        ? 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white animate-pulse' 
                        : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white'
                    } rounded-xl text-xs font-black shadow-lg flex items-center gap-1.5 transition-all`}
                  >
                    {isAutoTesting ? <Square size={13} fill="currentColor" /> : <Play size={13} fill="currentColor" />}
                    <span>{isAutoTesting ? 'Dừng Test Ngay' : 'Chạy Test Tự Động'}</span>
                  </button>
                </div>
              </div>

              {/* CARD 1: CẤU HÌNH BẢNG ĐIỆN CUỘN LED MARQUEE TRONG SUỐT */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-black/60 border border-cyan-500/40 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
                    <h4 className="text-xs sm:text-sm font-black text-cyan-300 uppercase tracking-wider">
                      ⚡ Bảng Điện Cuộn Quà Tặng (LED Marquee Ticker)
                    </h4>
                  </div>
                  <span className="text-[11px] text-gray-300 font-medium">
                    Nền trong suốt nhìn xuyên thấu bản đồ, không che khuất thao tác
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {/* Bật / Tắt */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-300 uppercase">Hiển Thị Bảng Điện:</label>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = { ...giftMarqueeSettings, enabled: giftMarqueeSettings.enabled === false ? true : false };
                        setGiftMarqueeSettings(updated);
                        saveGiftConfig('map', { marquee: updated });
                      }}
                      className={`w-full py-2 rounded-xl text-xs font-black transition-all ${
                        giftMarqueeSettings.enabled !== false 
                          ? 'bg-emerald-600 text-white shadow-md' 
                          : 'bg-rose-600/80 text-white'
                      }`}
                    >
                      {giftMarqueeSettings.enabled !== false ? '🟢 ĐANG BẬT' : '🔴 ĐANG TẮT'}
                    </button>
                  </div>

                  {/* Tốc độ */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-300 uppercase">Tốc Độ Cuộn:</label>
                    <select
                      value={giftMarqueeSettings.speed || 'normal'}
                      onChange={(e) => {
                        const updated = { ...giftMarqueeSettings, speed: e.target.value };
                        setGiftMarqueeSettings(updated);
                        saveGiftConfig('map', { marquee: updated });
                      }}
                      className="w-full px-2.5 py-2 rounded-xl bg-black/60 border border-white/20 text-xs text-white outline-none focus:border-cyan-400 font-bold"
                    >
                      <option value="slow">🐢 Chậm (50s)</option>
                      <option value="normal">🚶 Vừa (30s)</option>
                      <option value="fast">⚡ Nhanh (18s)</option>
                    </select>
                  </div>

                  {/* Độ trong suốt */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-300 uppercase">Độ Trong Suốt:</label>
                    <select
                      value={giftMarqueeSettings.opacityMode || 'ultra_transparent'}
                      onChange={(e) => {
                        const updated = { ...giftMarqueeSettings, opacityMode: e.target.value };
                        setGiftMarqueeSettings(updated);
                        saveGiftConfig('map', { marquee: updated });
                      }}
                      className="w-full px-2.5 py-2 rounded-xl bg-black/60 border border-white/20 text-xs text-white outline-none focus:border-cyan-400 font-bold"
                    >
                      <option value="ultra_transparent">✨ Trong suốt 100% (Khuyên dùng)</option>
                      <option value="glassmorphism">🪟 Kính Mờ (Glass)</option>
                      <option value="semi_dark">⬛ Nền Tối Đậm</option>
                    </select>
                  </div>

                  {/* Vị trí */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-300 uppercase">Vị Trí Hiển Thị:</label>
                    <select
                      value={giftMarqueeSettings.position || 'bottom'}
                      onChange={(e) => {
                        const updated = { ...giftMarqueeSettings, position: e.target.value };
                        setGiftMarqueeSettings(updated);
                        saveGiftConfig('map', { marquee: updated });
                      }}
                      className="w-full px-2.5 py-2 rounded-xl bg-black/60 border border-white/20 text-xs text-white outline-none focus:border-cyan-400 font-bold"
                    >
                      <option value="bottom">⬇️ Dưới Đáy Màn Hình</option>
                      <option value="top">⬆️ Trên Đỉnh</option>
                      <option value="floating">🖱️ Tự Do Kéo Thả</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-white/10">
                  <div className="flex-1 w-full flex items-center gap-2">
                    <span className="text-[11px] font-bold text-gray-400 shrink-0">Tiêu đề LED:</span>
                    <input
                      type="text"
                      value={giftMarqueeSettings.tickerTitle || '🎁 QUÀ TẶNG & CẮM CỜ:'}
                      onChange={(e) => {
                        const updated = { ...giftMarqueeSettings, tickerTitle: e.target.value };
                        setGiftMarqueeSettings(updated);
                        saveGiftConfig('map', { marquee: updated });
                      }}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-black/60 border border-white/20 text-xs text-yellow-300 font-bold outline-none focus:border-yellow-400"
                    />
                  </div>
                </div>
              </div>

              {/* CARD 2: 3 MÓN QUÀ CẮM CỜ 3 MIỀN (5 XU) - THIẾT KẾ MỚI SIÊU GỌN GÀNG, ĐẸP MẮT */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-red-950/30 via-amber-950/20 to-emerald-950/30 border border-yellow-500/40 shadow-2xl space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-white/10 pb-2.5">
                  <h4 className="text-xs sm:text-sm font-black text-yellow-300 uppercase tracking-wider flex items-center gap-2">
                    <span className="p-1 rounded-md bg-red-600/30 border border-red-500/40 text-red-400">
                      <Flag size={14} />
                    </span>
                    <span>🚩 3 Quà Cắm Cờ 3 Miền (5 Xu): Bắc - Trung - Nam</span>
                  </h4>
                  <span className="text-[11px] text-gray-300 font-mono">
                    Tự động nhận diện quà & cắm cờ chuẩn xác 100% từng miền
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {REGIONAL_FLAG_GIFTS.map((rg) => {
                    let rStyle = {
                      regionName: 'Miền Bắc',
                      border: 'border-red-500/50 hover:border-red-400',
                      bg: 'bg-gradient-to-br from-red-950/60 via-black/70 to-red-950/40',
                      badgeBg: 'bg-red-500/20 text-red-300 border-red-500/40',
                      btnBg: 'bg-red-600 hover:bg-red-500 text-white shadow-red-500/20'
                    };
                    if (rg.regionTarget === 'central') {
                      rStyle = {
                        regionName: 'Miền Trung',
                        border: 'border-amber-500/50 hover:border-amber-400',
                        bg: 'bg-gradient-to-br from-amber-950/60 via-black/70 to-amber-950/40',
                        badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
                        btnBg: 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-500/20'
                      };
                    } else if (rg.regionTarget === 'south') {
                      rStyle = {
                        regionName: 'Miền Nam',
                        border: 'border-emerald-500/50 hover:border-emerald-400',
                        bg: 'bg-gradient-to-br from-emerald-950/60 via-black/70 to-emerald-950/40',
                        badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
                        btnBg: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20'
                      };
                    }

                    return (
                      <div 
                        key={rg.id} 
                        className={`p-3.5 rounded-xl border ${rStyle.border} ${rStyle.bg} flex items-center justify-between gap-3 shadow-lg backdrop-blur-md transition-all hover:scale-[1.01]`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Avatar Icon */}
                          <div className="w-11 h-11 rounded-xl bg-black/60 border border-white/15 flex items-center justify-center text-2xl shadow-inner shrink-0">
                            {rg.icon}
                          </div>
                          
                          {/* Info */}
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-black text-white">{rg.name.split(' (')[0]}</span>
                              <span className={`text-[9.5px] px-2 py-0.5 rounded-full font-bold border ${rStyle.badgeBg} shrink-0`}>
                                {rStyle.regionName}
                              </span>
                            </div>
                            <div className="text-[11px] font-mono text-yellow-300 font-bold mt-1 flex items-center gap-1.5">
                              <span className="bg-black/40 px-2 py-0.5 rounded border border-yellow-500/30">🪙 {rg.priceToken} xu</span>
                              <span className="text-emerald-400 font-black">+{rg.cells} ô cờ</span>
                            </div>
                          </div>
                        </div>

                        {/* Test Button */}
                        <button
                          type="button"
                          onClick={() => {
                            bandoAudio.unlock();
                            bandoEngine.processGift({
                              userId: `admin_test_${rg.regionTarget}`,
                              nickname: `Chiến Binh ${rStyle.regionName}`,
                              giftId: rg.id,
                              giftName: rg.name,
                              diamondCount: rg.priceToken,
                              repeatCount: 1,
                              regionTarget: rg.regionTarget
                            });
                          }}
                          className={`px-3.5 py-2 rounded-xl ${rStyle.btnBg} text-xs font-black shrink-0 flex items-center gap-1.5 shadow-md active:scale-95 transition-all`}
                          title={`Bấm để test cắm cờ ${rStyle.regionName}`}
                        >
                          <Play size={11} fill="currentColor" /> Test
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Form Thêm Món Quà Mới */}
              {isAddingGift && (
                <form onSubmit={handleAddGift} className="bg-gradient-to-r from-amber-950/40 via-red-950/40 to-black/80 border border-yellow-500/40 rounded-2xl p-5 space-y-4 animate-in fade-in duration-200">
                  <div className="text-xs font-black text-yellow-300 uppercase tracking-wider flex items-center gap-1.5">
                    <PlusCircle size={15} className="text-yellow-400" />
                    <span>Thêm Món Quà Tặng TikTok Mới Vào Hệ Thống</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-gray-300 block mb-1">Biểu tượng (Icon/Emoji):</label>
                      <input
                        type="text"
                        value={newGiftIcon}
                        onChange={(e) => setNewGiftIcon(e.target.value)}
                        placeholder="🌹, 👑, 🦁..."
                        className="w-full px-3 py-2 bg-black/60 border border-white/20 rounded-xl text-center text-lg text-white placeholder-gray-500 outline-none focus:border-yellow-400"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-[11px] font-bold text-gray-300 block mb-1">Tên Món Quà:</label>
                      <input
                        type="text"
                        value={newGiftName}
                        onChange={(e) => setNewGiftName(e.target.value)}
                        placeholder="Ví dụ: Rồng Thần, Siêu Xe, Trống Trận..."
                        className="w-full px-3 py-2 bg-black/60 border border-white/20 rounded-xl text-xs text-white placeholder-gray-500 outline-none focus:border-yellow-400"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-gray-300 block mb-1">Giá Xu (Coins):</label>
                      <input
                        type="number"
                        min="1"
                        max="500000"
                        value={newGiftPrice}
                        onChange={(e) => setNewGiftPrice(e.target.value)}
                        className="w-full px-3 py-2 bg-black/60 border border-white/20 rounded-xl text-xs font-mono text-yellow-300 outline-none focus:border-yellow-400"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-gray-300 block mb-1">Số Ô Cờ Nhận Được:</label>
                      <input
                        type="number"
                        min="1"
                        max="500000"
                        value={newGiftCells}
                        onChange={(e) => setNewGiftCells(e.target.value)}
                        className="w-full px-3 py-2 bg-black/60 border border-white/20 rounded-xl text-xs font-mono text-emerald-400 outline-none focus:border-yellow-400"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <label className="text-[11px] font-bold text-gray-300">Cấp Độ (Tier):</label>
                      <select
                        value={newGiftTier}
                        onChange={(e) => setNewGiftTier(e.target.value)}
                        className="px-3 py-1.5 bg-black/60 border border-white/20 rounded-xl text-xs text-white outline-none focus:border-yellow-400"
                      >
                        <option value="common">Phổ biến (Common)</option>
                        <option value="rare">Hiếm (Rare)</option>
                        <option value="epic">Sử thi (Epic)</option>
                        <option value="legendary">Huyền thoại (Legendary)</option>
                        <option value="mythic">Thần thoại (Mythic)</option>
                        <option value="divine">Tuyệt phẩm (Divine)</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingGift(false)}
                        className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-gray-300 rounded-xl text-xs font-bold"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-1.5 bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-black rounded-xl text-xs shadow-lg flex items-center gap-1"
                      >
                        <Check size={14} /> Lưu Món Quà
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Tìm kiếm & Lọc Theo Phân Hạng Tier */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[
                    { id: 'all', label: `Tất Cả (${(gameState.gifts || []).length})` },
                    { id: 'common', label: '🟢 Phổ biến (1-10 xu)' },
                    { id: 'rare', label: '🔵 Hiếm (20-499 xu)' },
                    { id: 'epic', label: '🟣 Sử thi (500-2,999 xu)' },
                    { id: 'legendary', label: '🟡 Huyền thoại (3,000-15,999 xu)' },
                    { id: 'mythic', label: '🔴 Thần thoại (17,000-44,999 xu)' },
                  ].map(t => (
                    <button
                      key={t.id}
                      onClick={() => setGiftTierFilter(t.id)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                        giftTierFilter === t.id
                          ? 'bg-yellow-500 text-black shadow-md shadow-yellow-500/30'
                          : 'bg-white/5 hover:bg-white/10 text-gray-300'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-64">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={giftSearch}
                    onChange={(e) => setGiftSearch(e.target.value)}
                    placeholder="Tìm tên quà hoặc số xu..."
                    className="w-full pl-9 pr-3 py-1.5 bg-black/50 border border-white/15 rounded-xl text-xs text-white placeholder-gray-500 outline-none focus:border-yellow-400"
                  />
                </div>
              </div>

              {/* Danh Sách Quà Tặng Dưới Dạng Thẻ Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[58vh] overflow-y-auto custom-scrollbar pr-1">
                {(gameState.gifts || DEFAULT_MAP_GIFTS)
                  .filter(g => {
                    const matchTier = giftTierFilter === 'all' || g.tier === giftTierFilter || (giftTierFilter === 'mythic' && (g.tier === 'mythic' || g.tier === 'divine'));
                    const matchSearch = !giftSearch.trim() || g.name.toLowerCase().includes(giftSearch.toLowerCase()) || g.priceToken.toString().includes(giftSearch);
                    return matchTier && matchSearch;
                  })
                  .map((gift) => (
                    <div
                      key={gift.id}
                      className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                        editingGiftId === gift.id
                          ? 'bg-amber-950/60 border-yellow-400 ring-2 ring-yellow-400/40 shadow-xl'
                          : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/[0.08]'
                      }`}
                    >
                      {editingGiftId === gift.id ? (
                        /* Chế độ Chỉnh Sửa Trực Tiếp */
                        <div className="space-y-2.5">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editGiftData.icon || ''}
                              onChange={(e) => setEditGiftData({ ...editGiftData, icon: e.target.value })}
                              className="w-10 px-1 py-1 bg-black/60 border border-white/20 rounded-lg text-center text-lg text-white"
                              title="Biểu tượng"
                            />
                            <input
                              type="text"
                              value={editGiftData.name || ''}
                              onChange={(e) => setEditGiftData({ ...editGiftData, name: e.target.value })}
                              className="flex-1 px-2 py-1 bg-black/60 border border-white/20 rounded-lg text-xs font-bold text-white"
                              placeholder="Tên quà"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-[11px]">
                            <div>
                              <span className="text-gray-400 block mb-0.5">Giá Xu:</span>
                              <input
                                type="number"
                                value={editGiftData.priceToken || ''}
                                onChange={(e) => setEditGiftData({ ...editGiftData, priceToken: e.target.value })}
                                className="w-full px-2 py-1 bg-black/60 border border-white/20 rounded-lg text-xs font-mono font-bold text-yellow-300"
                              />
                            </div>
                            <div>
                              <span className="text-gray-400 block mb-0.5">Số Ô Cờ:</span>
                              <input
                                type="number"
                                value={editGiftData.cells || ''}
                                onChange={(e) => setEditGiftData({ ...editGiftData, cells: e.target.value })}
                                className="w-full px-2 py-1 bg-black/60 border border-white/20 rounded-lg text-xs font-mono font-bold text-emerald-400"
                              />
                            </div>
                          </div>

                          <div>
                            <span className="text-gray-400 block mb-0.5 text-[10px]">🚩 Vùng Miền Cắm Cờ:</span>
                            <select
                              value={editGiftData.regionTarget || 'all'}
                              onChange={(e) => setEditGiftData({ ...editGiftData, regionTarget: e.target.value === 'all' ? null : e.target.value })}
                              className="w-full px-2 py-1 bg-black/60 border border-white/20 rounded-lg text-[11px] font-bold text-amber-300"
                            >
                              <option value="all">🌐 Toàn Quốc (Tất cả vùng miền)</option>
                              <option value="north">🏔️ Miền Bắc (Hà Nội, Tây Bắc...)</option>
                              <option value="central">🌊 Miền Trung (Đà Nẵng, Huế, Khánh Hòa...)</option>
                              <option value="south">🌴 Miền Nam (TP.HCM, Cần Thơ, Cà Mau...)</option>
                            </select>
                          </div>

                          <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-white/10">
                            <button
                              onClick={() => setEditingGiftId(null)}
                              className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-gray-300 text-[11px]"
                            >
                              Hủy
                            </button>
                            <button
                              onClick={() => handleSaveEditGift(gift.id)}
                              className="px-3 py-1 rounded bg-yellow-500 hover:bg-yellow-400 text-black font-black text-[11px]"
                            >
                              Lưu
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Chế độ Hiển Thị Thông Thường */
                        <div className="space-y-2.5">
                          <div className="flex items-start justify-between gap-1.5">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="text-3xl shrink-0 p-1.5 rounded-xl bg-black/40 border border-white/10 shadow-inner">{gift.icon}</span>
                              <div className="min-w-0">
                                <div className="text-xs font-black text-white truncate" title={gift.name}>{gift.name}</div>
                                <div className="flex items-center gap-1 mt-1 flex-wrap">
                                  <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[11px] font-bold font-mono shadow-xs">
                                    🪙 {gift.priceToken?.toLocaleString()} xu
                                  </span>
                                  {gift.regionTarget === 'north' && (
                                    <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30 text-[9px] font-bold">
                                      🏔️ Miền Bắc
                                    </span>
                                  )}
                                  {gift.regionTarget === 'central' && (
                                    <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-bold">
                                      🌊 Miền Trung
                                    </span>
                                  )}
                                  {gift.regionTarget === 'south' && (
                                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-bold">
                                      🌴 Miền Nam
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => handleStartEditGift(gift)}
                                className="p-1 text-gray-400 hover:text-yellow-300 hover:bg-white/10 rounded-lg transition-colors"
                                title="Sửa quà này"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => handleDeleteGift(gift.id)}
                                className="p-1 text-gray-400 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                                title="Xóa món quà này"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                            <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono font-black text-[11px]">
                              +{gift.cells?.toLocaleString()} ô cờ
                            </span>
                            <button
                              onClick={() => {
                                bandoAudio.unlock();
                                bandoEngine.processGift(gift.id, 1, { id: 'admin_test', username: 'Admin Thử Nghiệm 👑', avatar: '' });
                              }}
                              className="px-3 py-1 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-[11px] shadow-md shadow-red-500/20 transition-all active:scale-95 flex items-center gap-1"
                            >
                              <Play size={10} /> Test
                            </button>
                          </div>
                        </div>
                      )}
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

        </div>

      </div>
    </div>
  );
}
