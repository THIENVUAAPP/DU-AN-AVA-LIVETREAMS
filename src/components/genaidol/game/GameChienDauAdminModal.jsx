import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, Lock, Unlock, LogOut, CheckCircle2, RotateCcw, 
  Volume2, VolumeX, Sliders, Play, Pause, Swords, Flame, 
  Zap, Trophy, AlertCircle, X, Sparkles, UserCheck, PlayCircle, StopCircle, 
  Minimize2, Maximize2, Move
} from 'lucide-react';
import { battleAudio } from './battleAudioEngine';

const SIMULATED_USERS = [
  'Nguyễn Hùng', 'Trần Mai', 'Hoàng Long', 'Minh Quân', 
  'Hồng Hạnh', 'Tuấn Kiệt', 'Bảo Trâm', 'Quang Huy', 
  'Khánh Linh', 'Gia Bảo', 'Phương Thảo', 'Đức Anh', 
  'Hải Yến', 'Thành Đạt', 'Ngọc Ánh', 'Việt Hoàng',
  'Thanh Tùng', 'Mỹ Duyên', 'Quốc Bảo', 'Lan Anh'
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
  const [activeTab, setActiveTab] = useState('referee'); // 'referee' | 'audio' | 'settings' | 'match'
  const [isMinimized, setIsMinimized] = useState(false);

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
        const faction = isBlue ? 'blue' : 'red';
        const randChoice = Math.random();

        if (randChoice < 0.65) {
          // 65%: Regular comment joining battle
          if (onTriggerRefereeAction) {
            onTriggerRefereeAction(isBlue ? 'ADD_BLUE_20' : 'ADD_RED_20');
          }
        } else if (randChoice < 0.82) {
          // 17%: Stage Dance celebration gift
          if (onTriggerRefereeAction) {
            onTriggerRefereeAction(isBlue ? 'TRIGGER_DANCE_BLUE' : 'TRIGGER_DANCE_RED');
          }
        } else if (randChoice < 0.94) {
          // 12%: AoE Thunderstorm Strike
          if (onTriggerRefereeAction) {
            onTriggerRefereeAction(isBlue ? 'TRIGGER_AOE_BLUE' : 'TRIGGER_AOE_RED');
          }
        } else {
          // 6%: Mighty Boss Summon
          if (onTriggerRefereeAction) {
            onTriggerRefereeAction(isBlue ? 'SUMMON_BOSS_BLUE' : 'SUMMON_BOSS_RED');
          }
        }
      }, 1400);
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
    window.dispatchEvent(new CustomEvent('GAME_BATTLE_CONFIG_UPDATE', { detail: config }));
    if (onApplyConfig) {
      onApplyConfig(config);
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className={`fixed z-50 transition-all duration-300 ${
      isMinimized 
        ? 'bottom-6 right-6 w-80 shadow-2xl' 
        : 'bottom-4 right-4 md:bottom-6 md:right-6 w-full max-w-xl max-h-[85vh] shadow-2xl shadow-purple-950/70'
    }`}>
      <div className="relative w-full bg-[#11131c]/95 backdrop-blur-xl border border-purple-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header (Always Visible & Compact) */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-950/90 via-indigo-950/90 to-[#11131c] border-b border-purple-500/30 select-none">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-400/30">
              <Shield size={16} />
            </div>
            <div>
              <h2 className="text-xs font-black text-white flex items-center gap-1.5">
                BẢNG QUẢN TRỊ ADMIN (GAME CHIẾN ĐẤU)
                {isSimulating && (
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                )}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {isAdminLoggedIn && (
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                title={isMinimized ? "Mở rộng cửa sổ Admin" : "Thu nhỏ (để xem toàn cảnh trận đấu)"}
              >
                {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
              </button>
            )}

            {isAdminLoggedIn && !isMinimized && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 px-2 py-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold transition-all"
                title="Đăng xuất"
              >
                <LogOut size={11} />
                Thoát
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Đóng bảng Admin"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Minimized Quick Bar */}
        {isMinimized && isAdminLoggedIn && (
          <div className="p-3 bg-black/60 flex items-center justify-between gap-2">
            <button
              onClick={toggleSimulation}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                isSimulating 
                  ? 'bg-rose-600 text-white animate-pulse' 
                  : 'bg-emerald-600 text-white'
              }`}
            >
              {isSimulating ? <><StopCircle size={13} /> Dừng Chạy Thử</> : <><PlayCircle size={13} /> Chạy Thử Tự Động</>}
            </button>
            <button
              onClick={() => onTriggerRefereeAction && onTriggerRefereeAction('RESET_MATCH')}
              className="p-1.5 bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 border border-blue-500/40 rounded-lg text-xs font-bold"
              title="Reset Trận"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        )}

        {/* Full Modal Content */}
        {!isMinimized && (
          <>
            {!isAdminLoggedIn ? (
              /* LOGIN SCREEN */
              <div className="p-6 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-3 shadow-lg">
                  <Lock size={24} />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">Đăng nhập Quyền Quản trị Admin</h3>
                <p className="text-[11px] text-gray-400 max-w-xs mb-4">
                  Mật khẩu mặc định: <span className="font-mono text-purple-300 font-bold">admin123</span>
                </p>

                <form onSubmit={handleLogin} className="w-full max-w-xs space-y-3">
                  <div>
                    <input
                      type="password"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="Nhập mật khẩu Admin..."
                      className="w-full px-3 py-2 rounded-lg bg-black/60 border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400"
                      autoFocus
                    />
                    {loginError && (
                      <p className="text-[10px] text-red-400 mt-1 font-medium flex items-center justify-center gap-1">
                        <AlertCircle size={11} /> {loginError}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Unlock size={13} /> Xác nhận Đăng nhập
                  </button>
                </form>
              </div>
            ) : (
              /* ADMIN DASHBOARD */
              <div className="flex-1 flex flex-col overflow-hidden">
                
                {/* Tabs */}
                <div className="flex border-b border-white/10 bg-black/40 px-4 pt-2 gap-1.5 overflow-x-auto">
                  <button
                    onClick={() => setActiveTab('referee')}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg text-xs font-bold transition-all border-t border-x ${
                      activeTab === 'referee'
                        ? 'bg-[#11131c] border-purple-500/40 text-purple-300'
                        : 'border-transparent text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    <Flame size={13} /> Trọng tài / Chạy Thử
                  </button>
                  <button
                    onClick={() => setActiveTab('audio')}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg text-xs font-bold transition-all border-t border-x ${
                      activeTab === 'audio'
                        ? 'bg-[#11131c] border-purple-500/40 text-purple-300'
                        : 'border-transparent text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    <Volume2 size={13} /> Âm thanh & SFX
                  </button>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg text-xs font-bold transition-all border-t border-x ${
                      activeTab === 'settings'
                        ? 'bg-[#11131c] border-purple-500/40 text-purple-300'
                        : 'border-transparent text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    <Sliders size={13} /> Cấu hình Phe & Máu
                  </button>
                  <button
                    onClick={() => setActiveTab('match')}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg text-xs font-bold transition-all border-t border-x ${
                      activeTab === 'match'
                        ? 'bg-[#11131c] border-purple-500/40 text-purple-300'
                        : 'border-transparent text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    <Swords size={13} /> Điều khiển Trận
                  </button>
                </div>

                {/* Tab Contents */}
                <div className="p-4 overflow-y-auto max-h-[50vh] space-y-4">
                  
                  {/* TAB 1: TRỌNG TÀI & CHẠY THỬ TỰ ĐỘNG */}
                  {activeTab === 'referee' && (
                    <div className="space-y-3">
                      {/* AUTO SIMULATION RUNNER */}
                      <div className="p-3.5 bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-500/40 rounded-xl space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-xs font-bold text-purple-300 uppercase flex items-center gap-1.5">
                              <PlayCircle size={14} className="text-purple-400" /> Chế độ Chạy Thử Tự Động
                            </h4>
                            <p className="text-[10px] text-gray-400 mt-0.5">
                              Tự động giả lập comment dồn dập (Xanh/Đỏ), tặng quà, múa và thả Boss
                            </p>
                          </div>
                          <button
                            onClick={toggleSimulation}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all shadow-md ${
                              isSimulating
                                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/40 animate-pulse'
                                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40'
                            }`}
                          >
                            {isSimulating ? (
                              <>
                                <StopCircle size={14} /> DỪNG CHẠY THỬ
                              </>
                            ) : (
                              <>
                                <PlayCircle size={14} /> BẮT ĐẦU CHẠY THỬ
                              </>
                            )}
                          </button>
                        </div>
                        {isSimulating && (
                          <div className="text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 rounded-lg px-2.5 py-1.5 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                            Đang giả lập tương tác người xem TikTok vào game (nhấn Thu nhỏ để quan sát)...
                          </div>
                        )}
                      </div>

                      {/* DIRECT REFEREE CONTROLS */}
                      <div className="p-3.5 bg-gradient-to-br from-amber-950/20 to-orange-950/20 border border-amber-500/30 rounded-xl space-y-2.5">
                        <h4 className="text-xs font-bold text-amber-400 uppercase flex items-center gap-1.5">
                          <Flame size={13} /> Thao tác Trọng tài Tức thì
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => onTriggerRefereeAction && onTriggerRefereeAction('ADD_BLUE_20')}
                            className="py-2 px-2.5 bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-500/30 rounded-lg text-xs font-bold transition-all text-left flex items-center justify-between"
                          >
                            <span>🛡️ +20 Quân Xanh</span>
                            <span className="text-[9px] bg-blue-500/30 px-1 py-0.5 rounded text-blue-200">+20 HP</span>
                          </button>
                          <button
                            onClick={() => onTriggerRefereeAction && onTriggerRefereeAction('ADD_RED_20')}
                            className="py-2 px-2.5 bg-red-600/20 hover:bg-red-600/40 text-red-300 border border-red-500/30 rounded-lg text-xs font-bold transition-all text-left flex items-center justify-between"
                          >
                            <span>🗡️ +20 Quân Đỏ</span>
                            <span className="text-[9px] bg-red-500/30 px-1 py-0.5 rounded text-red-200">+20 HP</span>
                          </button>

                          <button
                            onClick={() => onTriggerRefereeAction && onTriggerRefereeAction('TRIGGER_DANCE_BLUE')}
                            className="py-2 px-2.5 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-bold transition-all text-left flex items-center justify-between"
                          >
                            <span>💃 Vũ Điệu Phe Xanh</span>
                            <span className="text-[9px] bg-indigo-500/30 px-1 py-0.5 rounded text-indigo-200">Sân khấu</span>
                          </button>
                          <button
                            onClick={() => onTriggerRefereeAction && onTriggerRefereeAction('TRIGGER_DANCE_RED')}
                            className="py-2 px-2.5 bg-pink-600/20 hover:bg-pink-600/40 text-pink-300 border border-pink-500/30 rounded-lg text-xs font-bold transition-all text-left flex items-center justify-between"
                          >
                            <span>💃 Vũ Điệu Phe Đỏ</span>
                            <span className="text-[9px] bg-pink-500/30 px-1 py-0.5 rounded text-pink-200">Sân khấu</span>
                          </button>

                          <button
                            onClick={() => onTriggerRefereeAction && onTriggerRefereeAction('TRIGGER_AOE_BLUE')}
                            className="py-2 px-2.5 bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-300 border border-cyan-500/30 rounded-lg text-xs font-bold transition-all text-left flex items-center justify-between"
                          >
                            <span>⚡ Sét AoE Phe Xanh</span>
                            <span className="text-[9px] bg-cyan-500/30 px-1 py-0.5 rounded text-cyan-200">Bão sét</span>
                          </button>
                          <button
                            onClick={() => onTriggerRefereeAction && onTriggerRefereeAction('TRIGGER_AOE_RED')}
                            className="py-2 px-2.5 bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-bold transition-all text-left flex items-center justify-between"
                          >
                            <span>⚡ Sét AoE Phe Đỏ</span>
                            <span className="text-[9px] bg-rose-500/30 px-1 py-0.5 rounded text-rose-200">Bão lửa</span>
                          </button>

                          <button
                            onClick={() => onTriggerRefereeAction && onTriggerRefereeAction('SUMMON_BOSS_BLUE')}
                            className="py-2 px-2.5 bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 border border-blue-400/40 rounded-lg text-xs font-bold transition-all text-left flex items-center justify-between"
                          >
                            <span>🐉 Thả Boss Rồng Xanh</span>
                            <span className="text-[9px] bg-blue-500/40 px-1 py-0.5 rounded text-blue-100">+250 HP</span>
                          </button>
                          <button
                            onClick={() => onTriggerRefereeAction && onTriggerRefereeAction('SUMMON_BOSS_RED')}
                            className="py-2 px-2.5 bg-red-600/30 hover:bg-red-600/50 text-red-200 border border-red-400/40 rounded-lg text-xs font-bold transition-all text-left flex items-center justify-between"
                          >
                            <span>🐅 Thả Boss Hổ Đỏ</span>
                            <span className="text-[9px] bg-red-500/40 px-1 py-0.5 rounded text-red-100">+250 HP</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: ÂM THANH & NGHE THỬ HIỆU ỨNG */}
                  {activeTab === 'audio' && (
                    <div className="space-y-3">
                      <div className="p-3.5 bg-black/40 border border-white/10 rounded-xl space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-300">Bật / Tắt toàn bộ âm thanh:</span>
                          <button
                            onClick={() => {
                              const updated = { ...config, soundEnabled: !config.soundEnabled };
                              setConfig(updated);
                              handleSaveConfig();
                            }}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                              config.soundEnabled ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-red-500/20 text-red-400 border border-red-500/40'
                            }`}
                          >
                            {config.soundEnabled ? 'ĐANG BẬT' : 'ĐANG TẮT'}
                          </button>
                        </div>

                        <div>
                          <div className="flex justify-between text-xs text-gray-300 mb-1 font-bold">
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
                      <div className="p-3.5 bg-purple-950/20 border border-purple-500/30 rounded-xl space-y-2.5">
                        <h4 className="text-xs font-bold text-purple-300 uppercase flex items-center gap-1.5">
                          <Volume2 size={13} /> Nghe Thử Các Âm Sắc Du Dương / Hào Hùng
                        </h4>
                        <p className="text-[10px] text-gray-400">
                          Toàn bộ âm sắc đã được tái tạo bằng bộ hòa âm thuần khiết, 100% không bị rè rè:
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            onClick={() => battleAudio.playJoin(config.sfxVolume)}
                            className="py-2 px-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-500/30 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1"
                          >
                            <span>🎺 Vào Trận</span>
                          </button>
                          <button
                            onClick={() => battleAudio.playHit(config.sfxVolume)}
                            className="py-2 px-2 bg-amber-600/20 hover:bg-amber-600/40 text-amber-300 border border-amber-500/30 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1"
                          >
                            <span>⚔️ Va Kiếm</span>
                          </button>
                          <button
                            onClick={() => battleAudio.playAoe(config.sfxVolume)}
                            className="py-2 px-2 bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-300 border border-cyan-500/30 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1"
                          >
                            <span>⚡ Sét AoE</span>
                          </button>
                          <button
                            onClick={() => battleAudio.playBoss(config.sfxVolume)}
                            className="py-2 px-2 bg-red-600/20 hover:bg-red-600/40 text-red-300 border border-red-500/30 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1"
                          >
                            <span>🐉 Thần Thú</span>
                          </button>
                          <button
                            onClick={() => battleAudio.playDanceBeat(config.sfxVolume)}
                            className="py-2 px-2 bg-pink-600/20 hover:bg-pink-600/40 text-pink-300 border border-pink-500/30 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1"
                          >
                            <span>💃 Nhịp Vũ Điệu</span>
                          </button>
                          <button
                            onClick={() => battleAudio.playVictory(config.sfxVolume)}
                            className="py-2 px-2 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1"
                          >
                            <span>🏆 Khải Hoàn</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: CẤU HÌNH PHE & MÁU */}
                  {activeTab === 'settings' && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        {/* Phe Xanh */}
                        <div className="p-3 bg-blue-950/30 border border-blue-500/30 rounded-xl space-y-2">
                          <label className="text-xs font-bold text-blue-400 uppercase block">Phe Xanh (Trái)</label>
                          <div>
                            <span className="text-[10px] text-gray-400 block mb-1">Tên hiển thị</span>
                            <input
                              type="text"
                              value={config.blueName}
                              onChange={(e) => setConfig({ ...config, blueName: e.target.value })}
                              className="w-full px-2.5 py-1.5 bg-black/50 border border-blue-500/30 rounded-lg text-white text-xs font-bold"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] text-gray-400 block mb-1">Mã màu</span>
                            <input
                              type="color"
                              value={config.blueColor}
                              onChange={(e) => setConfig({ ...config, blueColor: e.target.value })}
                              className="w-full h-7 bg-transparent cursor-pointer rounded"
                            />
                          </div>
                        </div>

                        {/* Phe Đỏ */}
                        <div className="p-3 bg-red-950/30 border border-red-500/30 rounded-xl space-y-2">
                          <label className="text-xs font-bold text-red-400 uppercase block">Phe Đỏ (Phải)</label>
                          <div>
                            <span className="text-[10px] text-gray-400 block mb-1">Tên hiển thị</span>
                            <input
                              type="text"
                              value={config.redName}
                              onChange={(e) => setConfig({ ...config, redName: e.target.value })}
                              className="w-full px-2.5 py-1.5 bg-black/50 border border-red-500/30 rounded-lg text-white text-xs font-bold"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] text-gray-400 block mb-1">Mã màu</span>
                            <input
                              type="color"
                              value={config.redColor}
                              onChange={(e) => setConfig({ ...config, redColor: e.target.value })}
                              className="w-full h-7 bg-transparent cursor-pointer rounded"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Cấu hình HP & Tỉ lệ */}
                      <div className="p-3 bg-black/40 border border-white/10 rounded-xl space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-300">Máu tối đa mỗi phe (Max HP):</span>
                          <input
                            type="number"
                            min="100"
                            max="50000"
                            step="100"
                            value={config.maxHp}
                            onChange={(e) => setConfig({ ...config, maxHp: parseInt(e.target.value) || 1000 })}
                            className="w-28 px-2.5 py-1 bg-black/60 border border-white/20 rounded-lg text-amber-400 text-xs font-mono font-bold text-right"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-300">Kích thước nhân vật:</span>
                          <div className="flex items-center gap-2">
                            <input
                              type="range"
                              min="0.6"
                              max="2.0"
                              step="0.1"
                              value={config.charScale}
                              onChange={(e) => setConfig({ ...config, charScale: parseFloat(e.target.value) })}
                              className="w-24 accent-purple-500"
                            />
                            <span className="text-xs font-mono text-purple-300 w-8 text-right">{config.charScale.toFixed(1)}x</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 4: ĐIỀU KHIỂN TRẬN ĐẤU */}
                  {activeTab === 'match' && (
                    <div className="space-y-3">
                      <div className="p-3 bg-purple-900/20 border border-purple-500/30 rounded-xl">
                        <h4 className="text-xs font-bold text-purple-300 uppercase mb-2.5 flex items-center gap-1.5">
                          <Swords size={13} /> Thao tác Trận đấu Trực tiếp
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => onTriggerRefereeAction && onTriggerRefereeAction('RESET_MATCH')}
                            className="py-2.5 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-all"
                          >
                            <RotateCcw size={13} /> Bắt đầu Trận Mới
                          </button>
                          <button
                            onClick={() => onTriggerRefereeAction && onTriggerRefereeAction('TOGGLE_PAUSE')}
                            className="py-2.5 px-3 bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 border border-amber-500/40 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                          >
                            <Pause size={13} /> Tạm dừng / Tiếp tục
                          </button>
                          <button
                            onClick={() => onTriggerRefereeAction && onTriggerRefereeAction('FINISH_MATCH_BLUE')}
                            className="py-2.5 px-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-all"
                          >
                            <Trophy size={13} /> Phe Xanh Thắng
                          </button>
                          <button
                            onClick={() => onTriggerRefereeAction && onTriggerRefereeAction('FINISH_MATCH_RED')}
                            className="py-2.5 px-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-all"
                          >
                            <Trophy size={13} /> Phe Đỏ Thắng
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-4 py-3 bg-black/60 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] text-gray-400 flex items-center gap-1">
                    <Shield size={12} className="text-emerald-400" />
                    Đã lưu mật khẩu phiên
                  </span>

                  <div className="flex items-center gap-2">
                    {savedSuccess && (
                      <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 animate-in fade-in">
                        <CheckCircle2 size={13} /> Đã áp dụng!
                      </span>
                    )}
                    <button
                      onClick={handleSaveConfig}
                      className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all flex items-center gap-1"
                    >
                      <CheckCircle2 size={13} /> Lưu & Áp Dụng
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
