import React, { useState, useEffect } from 'react';
import { 
  X, Shield, Play, Pause, RotateCcw, Award, Globe, Music, Volume2, 
  Sparkles, Gift, MapPin, Flag, CheckCircle, Copy, AlertTriangle, 
  Settings, RefreshCw, Zap, Sliders, ExternalLink, Trophy
} from 'lucide-react';
import bandoEngine, { DEFAULT_MAP_GIFTS, HONOR_TIERS } from './bandoGameEngine';
import bandoAudio from './bandoAudioEngine';

export default function GameBanDoAdminModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('operations');
  const [gameState, setGameState] = useState(() => bandoEngine.state);
  const [giftsList, setGiftsList] = useState(() => DEFAULT_MAP_GIFTS);
  const [copiedLink, setCopiedLink] = useState(false);
  const [bgmVolume, setBgmVolume] = useState(0.35);
  const [sfxVolume, setSfxVolume] = useState(0.8);
  const [autoTour, setAutoTour] = useState(true);
  const [geminiKey, setGeminiKey] = useState(() => localStorage.getItem('aidol_gemini_api_key') || '');
  const [elevenLabsKey, setElevenLabsKey] = useState(() => localStorage.getItem('aidol_elevenlabs_api_key') || '');
  const [selectedCountry, setSelectedCountry] = useState('vietnam');

  useEffect(() => {
    const unsub = bandoEngine.subscribe((state) => {
      setGameState({ ...state });
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[88vh] bg-[#11131a] border border-white/15 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-gray-100 font-sans">
        
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
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-600 text-purple-100">
                  Authoritative
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Điều hành vòng chơi, cấu hình quà tặng, quản lý 34 tỉnh thành & kết nối TikTok LIVE Studio
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
            { id: 'provinces', label: '🗺️ 34 Tỉnh Thành' },
            { id: 'countries', label: '🌍 Bản Đồ Quốc Gia' },
            { id: 'voice', label: '🎙️ Voice AI & BLV' },
            { id: 'audio', label: '🎵 Âm Nhạc & SFX' },
            { id: 'hall_of_fame', label: '🏆 Bảng Vàng Vinh Danh' },
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
          
          {/* TAB 1: OPERATIONS */}
          {activeTab === 'operations' && (
            <div className="space-y-6">
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
                  <div className="text-xs font-bold text-gray-400 mb-1">COMBO & NHIỆM VỤ</div>
                  <div className="text-lg font-black text-red-400">
                    {gameState.combo.active ? `Combo x${gameState.combo.multiplier} (${gameState.combo.count})` : 'Chưa kích hoạt'}
                  </div>
                  <div className="text-xs text-gray-400 mt-2">
                    Boss: <strong className={gameState.boss.active ? 'text-red-400' : 'text-gray-500'}>{gameState.boss.active ? 'Đang Diễn Ra' : 'Chờ Lệnh'}</strong>
                  </div>
                </div>
              </div>

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
                    <span>Nhiệm Vụ Đột Kích</span>
                  </button>

                  <button
                    onClick={() => bandoEngine.triggerVictory({ username: 'Admin Quyền Năng 👑' })}
                    className="p-3 bg-yellow-950/60 hover:bg-yellow-900/80 border border-yellow-500/40 text-yellow-200 rounded-xl font-bold text-xs flex flex-col items-center gap-1.5 transition-all"
                  >
                    <Trophy size={18} className="text-yellow-400" />
                    <span>Ép Chiến Thắng (Victory)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GIFTS CONFIG */}
          {activeTab === 'gifts' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">
                    Cấu Hình Tỷ Lệ Quy Đổi Số Ô Cờ Cho Từng Quà TikTok
                  </h3>
                  <p className="text-xs text-gray-400">Streamer có thể tăng giảm số ô cờ cắm được cho từng món quà</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {giftsList.map(gift => (
                  <div key={gift.id} className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{gift.icon}</span>
                      <div>
                        <div className="text-xs font-bold text-white">{gift.name}</div>
                        <div className="text-[10px] text-gray-400">Giá gốc: ~{gift.priceToken} xu/token</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">Quy đổi:</span>
                      <input 
                        type="number"
                        min="1"
                        value={gift.cells}
                        onChange={(e) => handleSaveGiftCells(gift.id, e.target.value)}
                        className="w-20 px-2.5 py-1 bg-black/50 border border-white/20 rounded-lg text-xs font-mono font-bold text-yellow-400 text-center outline-none focus:border-yellow-400"
                      />
                      <span className="text-xs font-bold text-gray-300">Ô Cờ</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PROVINCES */}
          {activeTab === 'provinces' && (
            <div className="space-y-4">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Tiến Độ Cắm Cờ 34 Tỉnh Thành Việt Nam & Biển Đảo (Hoàng Sa - Trường Sa)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {Object.values(gameState.provincesStatus).map(p => (
                  <div key={p.id} className="p-3 bg-white/5 border border-white/10 rounded-xl">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <MapPin size={13} className="text-red-400" />
                        <span>{p.name}</span>
                      </div>
                      {p.isCompleted ? (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                          <CheckCircle size={10} /> Xong
                        </span>
                      ) : (
                        <span className="text-[10px] text-gray-400 font-mono">
                          {p.claimedCount}/{p.totalCells}
                        </span>
                      )}
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${p.isCompleted ? 'bg-emerald-400' : 'bg-red-500'} transition-all duration-300`}
                        style={{ width: `${Math.min(100, (p.claimedCount / p.totalCells) * 100)}%` }}
                      />
                    </div>
                    {p.leader && (
                      <div className="text-[10px] text-yellow-300 mt-1 truncate">
                        👑 Dẫn đầu: {p.leader}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: COUNTRIES */}
          {activeTab === 'countries' && (
            <div className="space-y-4">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Bản Đồ Đa Quốc Gia & Quốc Kỳ Thế Giới
              </h3>
              <p className="text-xs text-gray-400">Chọn quốc gia để đổi lưới cắm cờ tương ứng cho phiên Live quốc tế</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'vietnam', name: 'Việt Nam 🇻🇳', color: '#DA251D', desc: 'Bản đồ chữ S + Hoàng Sa & Trường Sa' },
                  { id: 'japan', name: 'Nhật Bản 🇯🇵', color: '#ffffff', desc: 'Mặt trời đỏ trên nền trắng' },
                  { id: 'korea', name: 'Hàn Quốc 🇰🇷', color: '#ffffff', desc: 'Thái cực lưỡng nghi đỏ xanh' },
                  { id: 'france', name: 'Pháp 🇫🇷', color: '#0055A4', desc: 'Tam tài Xanh - Trắng - Đỏ' },
                  { id: 'germany', name: 'Đức 🇩🇪', color: '#000000', desc: 'Sọc Đen - Đỏ - Vàng' },
                  { id: 'usa', name: 'Hoa Kỳ 🇺🇸', color: '#B22234', desc: '50 Ngôi sao & Sọc đỏ trắng' },
                ].map(c => (
                  <div 
                    key={c.id}
                    onClick={() => setSelectedCountry(c.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      selectedCountry === c.id 
                        ? 'bg-red-950/40 border-yellow-400 ring-2 ring-yellow-400/40 shadow-lg' 
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="text-base font-black text-white mb-1">{c.name}</div>
                    <div className="text-[11px] text-gray-400 leading-tight">{c.desc}</div>
                    {selectedCountry === c.id && (
                      <span className="inline-block mt-2 text-[10px] font-bold text-yellow-300">✓ Đang kích hoạt</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: VOICE AI & BLV */}
          {activeTab === 'voice' && (
            <div className="space-y-4 max-w-2xl">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Cấu Hình AI Voice & Bình Luận Viên Tự Động
              </h3>

              <div className="space-y-3 bg-white/5 border border-white/10 rounded-2xl p-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Google Gemini API Key (Sáng tác câu bình luận)</label>
                  <input 
                    type="password"
                    value={geminiKey}
                    onChange={(e) => {
                      setGeminiKey(e.target.value);
                      localStorage.setItem('aidol_gemini_api_key', e.target.value);
                    }}
                    placeholder="AIzaSy..."
                    className="w-full px-3 py-2 bg-black/50 border border-white/20 rounded-xl text-xs text-white outline-none focus:border-yellow-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">ElevenLabs API Key (Giọng đọc VIP cao cấp)</label>
                  <input 
                    type="password"
                    value={elevenLabsKey}
                    onChange={(e) => {
                      setElevenLabsKey(e.target.value);
                      localStorage.setItem('aidol_elevenlabs_api_key', e.target.value);
                    }}
                    placeholder="xi-api-key..."
                    className="w-full px-3 py-2 bg-black/50 border border-white/20 rounded-xl text-xs text-white outline-none focus:border-yellow-400 font-mono"
                  />
                </div>
                <p className="text-[11px] text-gray-400 italic">
                  * Nếu không điền key, hệ thống sẽ tự động dùng giọng đọc Web Speech API mặc định hoàn toàn miễn phí.
                </p>
              </div>
            </div>
          )}

          {/* TAB 6: AUDIO & SFX */}
          {activeTab === 'audio' && (
            <div className="space-y-5 max-w-xl">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Cài Đặt Âm Lượng Nhạc Nền (BGM) & Hiệu Ứng (SFX)
              </h3>

              <div className="space-y-4 bg-white/5 border border-white/10 rounded-2xl p-5">
                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-300 mb-1.5">
                    <span>Âm lượng Nhạc Nền (BGM)</span>
                    <span className="font-mono text-yellow-400">{Math.round(bgmVolume * 100)}%</span>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={bgmVolume}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      setBgmVolume(v);
                      bandoAudio.setBgmVolume(v);
                    }}
                    className="w-full accent-yellow-400"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-300 mb-1.5">
                    <span>Âm lượng Hiệu Ứng (SFX)</span>
                    <span className="font-mono text-yellow-400">{Math.round(sfxVolume * 100)}%</span>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={sfxVolume}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      setSfxVolume(v);
                      bandoAudio.setSfxVolume(v);
                    }}
                    className="w-full accent-yellow-400"
                  />
                </div>

                <div className="pt-2 border-t border-white/10 flex flex-wrap gap-2">
                  <button 
                    onClick={() => bandoAudio.playCellPop()}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold"
                  >
                    🔊 Test Cắm Ô
                  </button>
                  <button 
                    onClick={() => bandoAudio.playCombo(3)}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold"
                  >
                    🔥 Test Combo
                  </button>
                  <button 
                    onClick={() => bandoAudio.playProvinceComplete('Hà Nội')}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold"
                  >
                    ⭐ Test Xong Tỉnh
                  </button>
                  <button 
                    onClick={() => bandoAudio.playVictory()}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-yellow-300"
                  >
                    🏆 Test Victory
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: HALL OF FAME */}
          {activeTab === 'hall_of_fame' && (
            <div className="space-y-4">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Bảng Vàng Vinh Danh Đại Tướng Quân & Streamer
              </h3>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-400">
                      <th className="py-2 px-3">Xếp Hạng</th>
                      <th className="py-2 px-3">Đại Gia / Khán Giả</th>
                      <th className="py-2 px-3">Danh Hiệu</th>
                      <th className="py-2 px-3 text-right">Tổng Ô Cờ Cắm</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gameState.leaderboard.map((user, idx) => (
                      <tr key={user.userId} className="border-b border-white/5">
                        <td className="py-2.5 px-3 font-mono font-bold">
                          {idx === 0 ? '🥇 #1' : idx === 1 ? '🥈 #2' : idx === 2 ? '🥉 #3' : `#${idx + 1}`}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-white">{user.username}</td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-yellow-300">
                            {user.tier?.icon} {user.tier?.name}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-black text-yellow-400">
                          +{user.totalCells.toLocaleString()} ô
                        </td>
                      </tr>
                    ))}
                    {gameState.leaderboard.length === 0 && (
                      <tr>
                        <td colSpan="4" className="text-center py-6 text-gray-500 italic">
                          Chưa có dữ liệu vinh danh trong vòng này
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 8: CHECKLIST & OVERLAY LINK */}
          {activeTab === 'checklist' && (
            <div className="space-y-5 max-w-2xl">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Đường Dẫn Overlay Cho TikTok LIVE Studio & OBS Studio
              </h3>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">
                    Đường dẫn Browser Source trong suốt (Transparent Overlay)
                  </label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="text"
                      readOnly
                      value={`${window.location.origin}${window.location.pathname}?overlay=bando`}
                      className="flex-1 px-3 py-2 bg-black/60 border border-white/20 rounded-xl text-xs text-yellow-300 font-mono select-all outline-none"
                    />
                    <button
                      onClick={handleCopyOverlayUrl}
                      className="px-4 py-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5"
                    >
                      <Copy size={14} />
                      <span>{copiedLink ? 'Đã Chép!' : 'Sao Chép'}</span>
                    </button>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10">
                  <h4 className="text-xs font-bold text-white mb-2">📋 4 Bước Kết Nối TikTok LIVE Studio:</h4>
                  <ol className="text-xs text-gray-300 space-y-1.5 list-decimal list-inside leading-relaxed">
                    <li>Mở TikTok LIVE Studio trên máy tính.</li>
                    <li>Thêm Nguồn → Chọn <strong>Trình duyệt (Browser Source)</strong> hoặc <strong>Cửa sổ ứng dụng (Window Capture)</strong>.</li>
                    <li>Dán đường dẫn vừa sao chép ở trên vào ô URL, đặt độ phân giải <strong>1080 x 1920</strong> (Dọc) hoặc <strong>1920 x 1080</strong> (Ngang).</li>
                    <li>Bật nền trong suốt (nếu có) để bản đồ 3D nổi bật hoàn hảo trên phiên Live.</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
