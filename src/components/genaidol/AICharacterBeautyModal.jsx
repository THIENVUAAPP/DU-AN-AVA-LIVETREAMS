import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Wand2, Scissors, Image as ImageIcon, Sliders, 
  Check, X, RefreshCw, Eye, Download, Zap, Sun, ShieldCheck
} from 'lucide-react';
import { removeBackgroundAI, enhanceBeautyAI, processCharacterFullAI } from '../../utils/aiBackgroundAndBeautyEngine';

export default function AICharacterBeautyModal({ 
  initialImage = null, 
  characterName = 'Nhân vật Live AI', 
  onSave, 
  onClose 
}) {
  const [originalImage, setOriginalImage] = useState(initialImage);
  const [processedImage, setProcessedImage] = useState(initialImage);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState('');
  
  // Settings
  const [autoRemoveBg, setAutoRemoveBg] = useState(true);
  const [autoEnhanceBeauty, setAutoEnhanceBeauty] = useState(true);
  const [smoothSkin, setSmoothSkin] = useState(65);
  const [sharpness, setSharpness] = useState(60);
  const [brightness, setBrightness] = useState(12);
  const [vibrance, setVibrance] = useState(30);
  const [studioGlow, setStudioGlow] = useState(35);
  
  // View mode
  const [viewMode, setViewMode] = useState('after'); // 'after' | 'compare' | 'before'
  const fileInputRef = useRef(null);

  // Tự động xử lý lần đầu khi mở modal
  useEffect(() => {
    if (initialImage) {
      handleAutoProcessAll(initialImage);
    }
  }, []);

  const handleAutoProcessAll = async (imgSource = originalImage) => {
    if (!imgSource) return;
    setIsProcessing(true);
    setProcessStep('Đang khởi chạy AI Neural Network...');
    try {
      let result = imgSource;

      if (autoRemoveBg) {
        setProcessStep('🪄 AI đang quét & xoá sạch phông nền, khử viền lem tóc...');
        result = await removeBackgroundAI(result, {
          featherRadius: 2,
          decontaminate: true,
          edgeRefinement: true
        });
      }

      if (autoEnhanceBeauty) {
        setProcessStep('✨ AI đang làm mịn da trắng hồng & tăng nét 4K...');
        result = await enhanceBeautyAI(result, {
          smoothSkin,
          sharpness,
          brightness,
          vibrance,
          studioGlow
        });
      }

      setProcessedImage(result);
      setProcessStep('Hoàn tất!');
    } catch (err) {
      console.error('Lỗi xử lý AI:', err);
      alert('Không thể xử lý ảnh: ' + (err.message || 'Lỗi không xác định'));
    } finally {
      setIsProcessing(false);
      setProcessStep('');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setOriginalImage(url);
      handleAutoProcessAll(url);
    }
  };

  const handleSaveResult = () => {
    if (!processedImage) {
      alert('Chưa có ảnh đã xử lý để lưu!');
      return;
    }
    if (onSave) {
      onSave(processedImage);
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in zoom-in duration-200">
      <div className="w-full max-w-5xl h-[92vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl bg-[#0e0e14] border border-pink-500/30 text-white relative">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-gradient-to-r from-pink-950/40 via-[#12121a] to-purple-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-500/20">
              <Wand2 className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                BỘ CÔNG CỤ AI XOÁ PHÔNG & LÀM ĐẸP NHÂN VẬT 4K
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-pink-500 to-amber-500 text-white uppercase tracking-wider">
                  PRO AI BEAUTY
                </span>
              </h2>
              <p className="text-xs text-gray-400">Tự động tách nền trong suốt siêu sạch, làm mịn da trắng hồng tự nhiên & sắc nét chuẩn phòng thu</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-gray-200 flex items-center gap-1.5 transition-all border border-white/10"
            >
              <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
              <span>Đổi Ảnh Khác</span>
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange} 
            />

            <button 
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-red-500/30 hover:text-red-400 text-gray-400 transition-colors"
              title="Đóng"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body 2 Cột */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* CỘT TRÁI (CHÍNH): Khung Xem Ảnh Preview */}
          <div className="flex-1 bg-[#08080c] relative flex flex-col items-center justify-center p-6 border-r border-white/10 overflow-hidden">
            
            {/* View Mode Bar */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-black/60 backdrop-blur-md p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setViewMode('after')}
                className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                  viewMode === 'after'
                    ? 'bg-pink-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                ✨ Đã Xử Lý AI
              </button>
              <button
                onClick={() => setViewMode('compare')}
                className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                  viewMode === 'compare'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                ⚖️ So Sánh 2 Bên
              </button>
              <button
                onClick={() => setViewMode('before')}
                className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                  viewMode === 'before'
                    ? 'bg-gray-700 text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                📷 Ảnh Gốc
              </button>
            </div>

            {/* Checkerboard Background cho PNG trong suốt */}
            <div className="w-full h-full rounded-2xl overflow-hidden relative flex items-center justify-center border border-white/10 shadow-2xl bg-[radial-gradient(#1f1f2e_1px,transparent_1px)] [background-size:16px_16px] bg-[#0c0c12]">
              
              {isProcessing && (
                <div className="absolute inset-0 z-30 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center p-6 animate-in fade-in">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center mb-4 animate-bounce shadow-xl shadow-pink-500/40">
                    <Sparkles className="w-7 h-7 text-white animate-spin" />
                  </div>
                  <h3 className="text-sm font-black text-white mb-1">ĐANG XỬ LÝ SIÊU NÉT BẰNG AI...</h3>
                  <p className="text-xs text-pink-300 font-bold animate-pulse">{processStep}</p>
                </div>
              )}

              {/* View Render */}
              {viewMode === 'compare' ? (
                <div className="w-full h-full grid grid-cols-2 gap-4 p-4">
                  <div className="flex flex-col items-center justify-center relative rounded-xl border border-white/10 bg-black/40 overflow-hidden">
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-black/70 text-gray-300 z-10">Ảnh Gốc Ban Đầu</span>
                    {originalImage ? (
                      <img src={originalImage} className="w-full h-full object-contain" alt="Gốc" />
                    ) : (
                      <span className="text-xs text-gray-500">Chưa có ảnh</span>
                    )}
                  </div>
                  <div className="flex flex-col items-center justify-center relative rounded-xl border border-pink-500/40 bg-black/40 overflow-hidden">
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-pink-600 text-white z-10">Đã Xoá Phông & Làm Đẹp 4K</span>
                    {processedImage ? (
                      <img src={processedImage} className="w-full h-full object-contain drop-shadow-2xl" alt="AI Processed" />
                    ) : (
                      <span className="text-xs text-gray-500">Đang tạo...</span>
                    )}
                  </div>
                </div>
              ) : viewMode === 'before' ? (
                <img 
                  src={originalImage} 
                  className="max-h-full max-w-full object-contain p-4 transition-all" 
                  alt="Ảnh Gốc" 
                />
              ) : (
                <img 
                  src={processedImage || originalImage} 
                  className="max-h-full max-w-full object-contain p-4 drop-shadow-[0_10px_30px_rgba(236,72,153,0.3)] transition-all" 
                  alt="Ảnh Sau Xử Lý AI" 
                />
              )}
            </div>
          </div>

          {/* CỘT PHẢI: Bảng Điều Khiển Chi Tiết Thuật Toán AI */}
          <div className="w-84 bg-[#121218] p-5 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-5">
              
              <div>
                <h3 className="text-xs font-black text-pink-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Sliders size={14} /> Chế Độ Xử Lý Tự Động
                </h3>
                <p className="text-[11px] text-gray-400">Kích hoạt các thuật toán AI cải tiến chất lượng</p>
              </div>

              {/* Toggles */}
              <div className="space-y-2.5">
                <label className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10 hover:border-pink-500/40 cursor-pointer transition-all">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center">
                      <Scissors size={14} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Xoá Phông AI Siêu Sạch</div>
                      <div className="text-[10px] text-gray-400">Khử viền lem tóc, nền trong suốt</div>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={autoRemoveBg} 
                    onChange={(e) => setAutoRemoveBg(e.target.checked)}
                    className="w-4 h-4 accent-pink-500 rounded cursor-pointer" 
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10 hover:border-purple-500/40 cursor-pointer transition-all">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                      <Sparkles size={14} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Làm Đẹp Da & Nét 4K</div>
                      <div className="text-[10px] text-gray-400">Trắng hồng tự nhiên & sắc nét</div>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={autoEnhanceBeauty} 
                    onChange={(e) => setAutoEnhanceBeauty(e.target.checked)}
                    className="w-4 h-4 accent-purple-500 rounded cursor-pointer" 
                  />
                </label>
              </div>

              {/* Sliders Tùy Chỉnh Chi Tiết */}
              {autoEnhanceBeauty && (
                <div className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-4 animate-in fade-in">
                  <h4 className="text-[11px] font-black text-gray-300 uppercase tracking-wide">
                    Tùy Chỉnh Thông Số Làm Đẹp:
                  </h4>

                  {/* 1. Mịn da */}
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-gray-300">Mịn Da Trắng Hồng</span>
                      <span className="text-pink-400">{smoothSkin}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={smoothSkin} 
                      onChange={(e) => setSmoothSkin(Number(e.target.value))}
                      className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500" 
                    />
                  </div>

                  {/* 2. Siêu Sắc Nét 4K */}
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-gray-300">Độ Sắc Nét Chi Tiết 4K</span>
                      <span className="text-purple-400">{sharpness}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={sharpness} 
                      onChange={(e) => setSharpness(Number(e.target.value))}
                      className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500" 
                    />
                  </div>

                  {/* 3. Tươi Tắn Màu Sắc */}
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-gray-300">Độ Rực Rỡ & Chiều Sâu</span>
                      <span className="text-amber-400">{vibrance}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={vibrance} 
                      onChange={(e) => setVibrance(Number(e.target.value))}
                      className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-amber-500" 
                    />
                  </div>

                  {/* 4. Studio Glow */}
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-gray-300">Ánh Sáng Studio Lung Linh</span>
                      <span className="text-emerald-400">{studioGlow}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={studioGlow} 
                      onChange={(e) => setStudioGlow(Number(e.target.value))}
                      className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500" 
                    />
                  </div>
                </div>
              )}

              {/* Nút Áp Dụng Lại */}
              <button
                onClick={() => handleAutoProcessAll()}
                disabled={isProcessing}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <RefreshCw size={14} className={isProcessing ? 'animate-spin' : ''} />
                <span>Áp Dụng Lại Bộ Lọc AI</span>
              </button>

            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-white/10 space-y-2">
              <button
                onClick={handleSaveResult}
                disabled={isProcessing}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <Check size={16} />
                <span>Lưu & Sử Dụng Ngay Cho Live</span>
              </button>

              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs font-bold transition-all"
              >
                Hủy Bỏ
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
