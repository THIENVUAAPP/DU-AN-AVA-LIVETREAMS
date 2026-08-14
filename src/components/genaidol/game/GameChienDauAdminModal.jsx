import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, Lock, Unlock, LogOut, CheckCircle2, RotateCcw, 
  Volume2, VolumeX, Sliders, Play, Pause, Swords, Flame, 
  Zap, Trophy, AlertCircle, X, Sparkles, UserCheck, PlayCircle, StopCircle, Music
} from 'lucide-react';
import { battleAudio } from './battleAudioEngine';

const SIMULATED_USERS = [
  'Nguyễn Hùng', 'Trần Mai', 'Hoàng Long', 'Minh Quân', 
  'Hồng Hạnh', 'Tuấn Kiệt', 'Bảo Trâm', 'Quang Huy', 
  'Khánh Linh', 'Gia Bảo', 'Phương Thảo', 'Đức Anh', 
  'Hải Yến', 'Thành Đạt', 'Ngọc Ánh', 'Việt Hoàng'
];

export default function GameChienDauAdminModal({ 
  isOpen, 
  onClose,
  onApplyConfig,
  onTriggerRefereeAction
}) {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return sessionStorage.getItem('GAME_ADMIN_AUTH') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('referee'); // Default to referee / test tab

  // Auto simulation state
  const [isSimulating, setIsSimulating] = useState(false);
  const simTimerRef = useRef(null);

  // Editable config state
  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem('GAME_BATTLE_CONFIG');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      title: 'Kingdom Clash: Ultimate War',
      blueName: 'Rồng Xanh',
      blueColor: '#2f6bff',
      redName: 'Hổ Đỏ',
      redColor: '#ff3b4e',
      maxHp: 1000,
      comebackThreshold: 30,
      charScale: 1.0,
      musicVolume: 0.4,
      sfxVolume: 0.7,
      soundEnabled: true
    };
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem('GAME_BATTLE_CONFIG');
      if (saved) {
        try { setConfig(JSON.parse(saved)); } catch (e) {}
      }
    }
  }, [isOpen]);

  // Clean up auto simulation timer when unmounting
  useEffect(() => {
    return () => {
      if (simTimerRef.current) clearInterval(simTimerRef.current);
    };
  }, []);

  const toggleSimulation = () => {
    if (isSimulating) {
      if (simTimerRef.current) clearInterval(simTimerRef.current);
      setIsSimulating(false);
    } else {
      setIsSimulating(true);
      let tick = 0;
      simTimerRef.current = setInterval(() => {
        tick++;
        const randomUser = SIMULATED_USERS[Math.floor(Math.random() * SIMULATED_USERS.length)];
        const isBlue = Math.random() < 0.5;

        // Every 1.5s: Spawns regular fighter comment
        if (tick % 2 === 0) {
          if (onTriggerRefereeAction) {
            onTriggerRefereeAction(isBlue ? 'ADD_BLUE_20' : 'ADD_RED_20');
          }
        }

        // Every 6s: Spawns a dance gift
        if (tick % 4 === 0) {
          if (onTriggerRefereeAction) {
            onTriggerRefereeAction(isBlue ? 'TRIGGER_DANCE_BLUE' : 'TRIGGER_DANCE_RED');
          }
        }

        // Every 12s: Spawns AoE Skill
        if (tick % 8 === 0) {
          if (onTriggerRefereeAction) {
            onTriggerRefereeAction(isBlue ? 'TRIGGER_AOE_BLUE' : 'TRIGGER_AOE_RED');
          }
        }

        // Every 24s: Spawns Boss Summon
        if (tick % 16 === 0) {
          if (onTriggerRefereeAction) {
            onTriggerRefereeAction(isBlue ? 'SUMMON_BOSS_BLUE' : 'SUMMON_BOSS_RED');
          }
        }
      }, 1500);
    }
  };

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === 'admin' || passwordInput === 'admin123' || passwordInput === '123456') {
      setIsAdminLoggedIn(true);
      sessionStorage.setItem('GAME_ADMIN_AUTH', 'true');
      setLoginError('');
      setPasswordInput('');
    } else {
      setLoginError('Mật khẩu quản trị không đúng! (Mặc định: admin123)');
    }
  };

  const handleLogout = () => {
    if (simTimerRef.current) clearInterval(simTimerRef.current);
    setIsSimulating(false);
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem('GAME_ADMIN_AUTH');
    setPasswordInput('');
  };

  const handleSaveConfig = () => {
    localStorage.setItem('GAME_BATTLE_CONFIG', JSON.stringify(config));
    if (onApplyConfig) {
      onApplyConfig(config);
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#13151f] border border-purple-500/40 rounded-2xl shadow-2xl shadow-purple-900/40 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-purple-950/80 via-indigo-950/80 to-[#13151f] border-b border-purple-500/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-400/30 shadow-inner">
              <Shield size={20} />
            </div>
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                BẢNG QUẢN TRỊ GAME CHIẾN ĐẤU (ADMIN)
              </h2>
              <p className="text-xs text-purple-300/70">
                Điều khiển trận đấu, kiểm tra âm thanh & chạy thử tự động quy trình chiến đấu
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdminLoggedIn && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold transition-all"
                title="Đăng xuất phiên Admin"
              >
                <LogOut size={13} />
                Đăng xuất
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        {!isAdminLoggedIn ? (
          /* LOGIN SCREEN */
          <div className="p-8 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4 shadow-lg">
              <Lock size={32} />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Đăng nhập Quyền Quản trị Admin</h3>
            <p className="text-xs text-gray-400 max-w-sm mb-6">
              Vui lòng nhập mật khẩu Admin để truy cập toàn quyền cấu hình, điều khiển trận đấu và chạy thử mô phỏng.
            </p>

            <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
              <div>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Nhập mật khẩu Admin (mặc định: admin123)..."
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400 transition-colors"
                  autoFocus
                />
                {loginError && (
                  <p className="text-xs text-red-400 mt-2 font-medium flex items-center justify-center gap-1">
                    <AlertCircle size={13} /> {loginError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2"
              >
                <Unlock size={16} /> Xác nhận Đăng nhập
              </button>
            </form>
          </div>
        ) : (
          /* ADMIN DASHBOARD */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Tabs */}
            <div className="flex border-b border-white/10 bg-black/40 px-6 pt-2 gap-2">
              <button
                onClick={() => setActiveTab('referee')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-t border-x ${
                  activeTab === 'referee'
                    ? 'bg-[#13151f] border-purple-500/40 text-purple-300'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                <Flame size={14} /> Trọng tài / Chạy Thử
              </button>
              <button
                onClick={() => setActiveTab('audio')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-t border-x ${
                  activeTab === 'audio'
                    ? 'bg-[#13151f] border-purple-500/40 text-purple-300'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                <Volume2 size={14} /> Âm thanh & SFX
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-t border-x ${
                  activeTab === 'settings'
                    ? 'bg-[#13151f] border-purple-500/40 text-purple-300'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                <Sliders size={14} /> Cấu hình Phe & Máu
              </button>
              <button
                onClick={() => setActiveTab('match')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-t border-x ${
                  activeTab === 'match'
                    ? 'bg-[#13151f] border-purple-500/40 text-purple-300'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                <Swords size={14} /> Điều khiển Trận
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 p-6 overflow-y-auto space-y-5">
              
              {/* TAB 1: TRỌNG TÀI & CHẠY THỬ TỰ ĐỘNG */}
              {activeTab === 'referee' && (
                <div className="space-y-4">
                  {/* AUTO SIMULATION RUNNER */}
                  <div className="p-4 bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-500/40 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-purple-300 uppercase flex items-center gap-1.5">
                          <PlayCircle size={15} className="text-purple-400" /> Chế độ Chạy Thử Tự Động (Auto Simulation Test)
                        </h4>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          Tự động giả lập bình luận (Xanh/Đỏ), tặng quà, nhảy múa, bão kỹ năng và gọi Boss
                        </p>
                      </div>
                      <button
                        onClick={toggleSimulation}
                        className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all shadow-lg ${
                          isSimulating
                            ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/40 animate-pulse'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40'
                        }`}
                      >
                        {isSimulating ? (
                          <>
                            <StopCircle size={15} /> DỪNG CHẠY THỬ
                          </>
                        ) : (
                          <>
                            <PlayCircle size={15} /> BẮT ĐẦU CHẠY THỬ
                          </>
                        )}
                      </button>
                    </div>
                    {isSimulating && (
                      <div className="text-[11px] text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 rounded-lg p-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                        Đang liên tục giả lập tương tác người xem TikTok vào game...
                      </div>
                    )}
                  </div>

                  {/* DIRECT REFEREE CONTROLS */}
                  <div className="p-4 bg-gradient-to-br from-amber-950/20 to-orange-950/20 border border-amber-500/30 rounded-xl space-y-3">
                    <h4 className="text-xs font-bold text-amber-400 uppercase flex items-center gap-1.5">
                      <Flame size={14} /> Công cụ Trọng tài Thủ công
                    </h4>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        onClick={() => onTriggerRefereeAction && onTriggerRefereeAction('ADD_BLUE_20')}
                        className="py-2.5 px-3 bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-500/30 rounded-lg text-xs font-bold transition-all text-left flex items-center justify-between"
                      >
                        <span>🛡️ Thêm Quân Xanh</span>
                        <span className="text-[10px] bg-blue-500/30 px-1.5 py-0.5 rounded text-blue-200">+20 HP</span>
                      </button>
                      <button
                        onClick={() => onTriggerRefereeAction && onTriggerRefereeAction('ADD_RED_20')}
                        className="py-2.5 px-3 bg-red-600/20 hover:bg-red-600/40 text-red-300 border border-red-500/30 rounded-lg text-xs font-bold transition-all text-left flex items-center justify-between"
                      >
                        <span>🗡️ Thêm Quân Đỏ</span>
                        <span className="text-[10px] bg-red-500/30 px-1.5 py-0.5 rounded text-red-200">+20 HP</span>
                      </button>

                      <button
                        onClick={() => onTriggerRefereeAction && onTriggerRefereeAction('TRIGGER_DANCE_BLUE')}
                        className="py-2.5 px-3 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-bold transition-all text-left flex items-center justify-between"
                      >
                        <span>💃 Vũ Điệu Phe Xanh</span>
                        <span className="text-[10px] bg-indigo-500/30 px-1.5 py-0.5 rounded text-indigo-200">Sân khấu</span>
                      </button>
                      <button
                        onClick={() => onTriggerRefereeAction && onTriggerRefereeAction('TRIGGER_DANCE_RED')}
                        className="py-2.5 px-3 bg-pink-600/20 hover:bg-pink-600/40 text-pink-300 border border-pink-500/30 rounded-lg text-xs font-bold transition-all text-left flex items-center justify-between"
                      >
                        <span>💃 Vũ Điệu Phe Đỏ</span>
                        <span className="text-[10px] bg-pink-500/30 px-1.5 py-0.5 rounded text-pink-200">Sân khấu</span>
                      </button>

                      <button
                        onClick={() => onTriggerRefereeAction && onTriggerRefereeAction('TRIGGER_AOE_BLUE')}
                        className="py-2.5 px-3 bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-300 border border-cyan-500/30 rounded-lg text-xs font-bold transition-all text-left flex items-center justify-between"
                      >
                        <span>⚡ Bão AoE Phe Xanh</span>
                        <span className="text-[10px] bg-cyan-500/30 px-1.5 py-0.5 rounded text-cyan-200">Sát thương</span>
                      </button>
                      <button
                        onClick={() => onTriggerRefereeAction && onTriggerRefereeAction('TRIGGER_AOE_RED')}
                        className="py-2.5 px-3 bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-bold transition-all text-left flex items-center justify-between"
                      >
                        <span>⚡ Bão AoE Phe Đỏ</span>
                        <span className="text-[10px] bg-rose-500/30 px-1.5 py-0.5 rounded text-rose-200">Sát thương</span>
                      </button>

                      <button
                        onClick={() => onTriggerRefereeAction && onTriggerRefereeAction('SUMMON_BOSS_BLUE')}
                        className="py-2.5 px-3 bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 border border-blue-400/40 rounded-lg text-xs font-bold transition-all text-left flex items-center justify-between"
                      >
                        <span>🐉 Thả Boss Rồng Xanh</span>
                        <span className="text-[10px] bg-blue-500/40 px-1.5 py-0.5 rounded text-blue-100">+250 HP</span>
                      </button>
                      <button
                        onClick={() => onTriggerRefereeAction && onTriggerRefereeAction('SUMMON_BOSS_RED')}
                        className="py-2.5 px-3 bg-red-600/30 hover:bg-red-600/50 text-red-200 border border-red-400/40 rounded-lg text-xs font-bold transition-all text-left flex items-center justify-between"
                      >
                        <span>🐅 Thả Boss Hổ Đỏ</span>
                        <span className="text-[10px] bg-red-500/40 px-1.5 py-0.5 rounded text-red-100">+250 HP</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ÂM THANH & NGHE THỬ HIỆU ỨNG */}
              {activeTab === 'audio' && (
                <div className="space-y-4">
                  <div className="p-4 bg-black/40 border border-white/10 rounded-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-300">Bật / Tắt toàn bộ âm thanh:</span>
                      <button
                        onClick={() => setConfig({ ...config, soundEnabled: !config.soundEnabled })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          config.soundEnabled ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-red-500/20 text-red-400 border border-red-500/40'
                        }`}
                      >
                        {config.soundEnabled ? 'ĐANG BẬT' : 'ĐANG TẮT'}
                      </button>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-gray-300 mb-1.5 font-bold">
                        <span>Âm lượng Hiệu ứng Game & Chiến Đấu (SFX):</span>
                        <span className="font-mono text-purple-400">{Math.round((config.sfxVolume !== undefined ? config.sfxVolume : 0.7) * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={config.sfxVolume !== undefined ? config.sfxVolume : 0.7}
                        onChange={(e) => setConfig({ ...config, sfxVolume: parseFloat(e.target.value) })}
                        className="w-full accent-purple-500"
                      />
                    </div>
                  </div>

                  {/* Sound Effect Previews */}
                  <div className="p-4 bg-purple-950/20 border border-purple-500/30 rounded-xl space-y-3">
                    <h4 className="text-xs font-bold text-purple-300 uppercase flex items-center gap-1.5">
                      <Volume2 size={14} /> Kiểm tra & Nghe Thử Các Hiệu Ứng Âm Thanh
                    </h4>
                    <p className="text-[11px] text-gray-400">
                      Bấm vào từng nút bên dưới để nghe thử âm thanh hành động (đã loại bỏ hoàn toàn tiếng ù nền liên tục):
                    </p>
                    <div className="grid grid-cols-3 gap-2.5">
                      <button
                        onClick={() => battleAudio.playJoin(config.sfxVolume)}
                        className="py-2.5 px-3 bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-500/30 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                      >
                        <span>🎺 Vào Trận</span>
                      </button>
                      <button
                        onClick={() => battleAudio.playHit(config.sfxVolume)}
                        className="py-2.5 px-3 bg-amber-600/20 hover:bg-amber-600/40 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                      >
                        <span>⚔️ Va Chạm Kiếm</span>
                      </button>
                      <button
                        onClick={() => battleAudio.playAoe(config.sfxVolume)}
                        className="py-2.5 px-3 bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-300 border border-cyan-500/30 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                      >
                        <span>⚡ Sét AoE</span>
                      </button>
                      <button
                        onClick={() => battleAudio.playBoss(config.sfxVolume)}
                        className="py-2.5 px-3 bg-red-600/20 hover:bg-red-600/40 text-red-300 border border-red-500/30 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                      >
                        <span>🐉 Thần Thú Boss</span>
                      </button>
                      <button
                        onClick={() => battleAudio.playDanceBeat(config.sfxVolume)}
                        className="py-2.5 px-3 bg-pink-600/20 hover:bg-pink-600/40 text-pink-300 border border-pink-500/30 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                      >
                        <span>💃 Nhịp Vũ Điệu</span>
                      </button>
                      <button
                        onClick={() => battleAudio.playVictory(config.sfxVolume)}
                        className="py-2.5 px-3 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                      >
                        <span>🏆 Kèn Chiến Thắng</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: CẤU HÌNH PHE & MÁU */}
              {activeTab === 'settings' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Phe Xanh */}
                    <div className="p-4 bg-blue-950/30 border border-blue-500/30 rounded-xl space-y-3">
                      <label className="text-xs font-bold text-blue-400 uppercase block">Phe Xanh (Bên Trái)</label>
                      <div>
                        <span className="text-[11px] text-gray-400 block mb-1">Tên hiển thị</span>
                        <input
                          type="text"
                          value={config.blueName}
                          onChange={(e) => setConfig({ ...config, blueName: e.target.value })}
                          className="w-full px-3 py-2 bg-black/50 border border-blue-500/30 rounded-lg text-white text-xs font-bold"
                        />
                      </div>
                      <div>
                        <span className="text-[11px] text-gray-400 block mb-1">Mã màu</span>
                        <input
                          type="color"
                          value={config.blueColor}
                          onChange={(e) => setConfig({ ...config, blueColor: e.target.value })}
                          className="w-full h-8 bg-transparent cursor-pointer rounded"
                        />
                      </div>
                    </div>

                    {/* Phe Đỏ */}
                    <div className="p-4 bg-red-950/30 border border-red-500/30 rounded-xl space-y-3">
                      <label className="text-xs font-bold text-red-400 uppercase block">Phe Đỏ (Bên Phải)</label>
                      <div>
                        <span className="text-[11px] text-gray-400 block mb-1">Tên hiển thị</span>
                        <input
                          type="text"
                          value={config.redName}
                          onChange={(e) => setConfig({ ...config, redName: e.target.value })}
                          className="w-full px-3 py-2 bg-black/50 border border-red-500/30 rounded-lg text-white text-xs font-bold"
                        />
                      </div>
                      <div>
                        <span className="text-[11px] text-gray-400 block mb-1">Mã màu</span>
                        <input
                          type="color"
                          value={config.redColor}
                          onChange={(e) => setConfig({ ...config, redColor: e.target.value })}
                          className="w-full h-8 bg-transparent cursor-pointer rounded"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Cấu hình HP & Tỉ lệ */}
                  <div className="p-4 bg-black/40 border border-white/10 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-300">Máu tối đa mỗi phe (Max HP):</span>
                      <input
                        type="number"
                        min="100"
                        max="50000"
                        step="100"
                        value={config.maxHp}
                        onChange={(e) => setConfig({ ...config, maxHp: parseInt(e.target.value) || 1000 })}
                        className="w-32 px-3 py-1.5 bg-black/60 border border-white/20 rounded-lg text-amber-400 text-xs font-mono font-bold text-right"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-300">Kích thước nhân vật trên sàn:</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="0.6"
                          max="2.0"
                          step="0.1"
                          value={config.charScale}
                          onChange={(e) => setConfig({ ...config, charScale: parseFloat(e.target.value) })}
                          className="w-28 accent-purple-500"
                        />
                        <span className="text-xs font-mono text-purple-300 w-10 text-right">{config.charScale.toFixed(1)}x</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: ĐIỀU KHIỂN TRẬN ĐẤU */}
              {activeTab === 'match' && (
                <div className="space-y-4">
                  <div className="p-4 bg-purple-900/20 border border-purple-500/30 rounded-xl">
                    <h4 className="text-xs font-bold text-purple-300 uppercase mb-3 flex items-center gap-1.5">
                      <Swords size={14} /> Thao tác Trận đấu Trực tiếp
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => onTriggerRefereeAction && onTriggerRefereeAction('RESET_MATCH')}
                        className="py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                      >
                        <RotateCcw size={15} /> Bắt đầu Trận Mới
                      </button>
                      <button
                        onClick={() => onTriggerRefereeAction && onTriggerRefereeAction('FINISH_MATCH_BLUE')}
                        className="py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                      >
                        <Trophy size={15} /> Phe Xanh Thắng Ngay
                      </button>
                      <button
                        onClick={() => onTriggerRefereeAction && onTriggerRefereeAction('FINISH_MATCH_RED')}
                        className="py-3 px-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                      >
                        <Trophy size={15} /> Phe Đỏ Thắng Ngay
                      </button>
                      <button
                        onClick={() => onTriggerRefereeAction && onTriggerRefereeAction('TOGGLE_PAUSE')}
                        className="py-3 px-4 bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 border border-amber-500/40 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all"
                      >
                        <Pause size={15} /> Tạm dừng / Tiếp tục
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-black/60 border-t border-white/10 flex items-center justify-between">
              <span className="text-[11px] text-gray-400 flex items-center gap-1.5">
                <Shield size={13} className="text-emerald-400" />
                Phiên Admin được bảo vệ & ghi nhớ trong phiên làm việc
              </span>

              <div className="flex items-center gap-2">
                {savedSuccess && (
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 animate-in fade-in">
                    <CheckCircle2 size={14} /> Đã áp dụng!
                  </span>
                )}
                <button
                  onClick={handleSaveConfig}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 size={14} /> Lưu & Áp Dụng Cài Đặt
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
