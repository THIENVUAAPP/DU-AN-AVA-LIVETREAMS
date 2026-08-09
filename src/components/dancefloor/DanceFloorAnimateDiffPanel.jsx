import React, { useState } from 'react';
import { Wand2, Zap, Upload, Sliders, Image as ImageIcon, Video, Box, Maximize2, Minimize2 } from 'lucide-react';

export default function DanceFloorAnimateDiffPanel({ onApplyAiEffect }) {
  const [prompt, setPrompt] = useState('1girl, cyberpunk style, dancing perfectly to the beat, neon lights, 4k resolution, masterpiece');
  const [motionModule, setMotionModule] = useState('mm_sd_v15_v2');
  const [isGenerating, setIsGenerating] = useState(false);
  const [modelType, setModelType] = useState('3d'); // '3d' (Three.js/Babylon) or 'ai' (AnimateDiff)
  const [scale, setScale] = useState(1.0);
  
  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate AI generation delay
    setTimeout(() => {
      setIsGenerating(false);
      alert(`🎉 Đã render xong video nhảy bằng AnimateDiff AI!\n\nPrompt: ${prompt}\nModule: ${motionModule}\n\nHiệu ứng đã được áp dụng trực tiếp lên luồng Live siêu thực.`);
      if (onApplyAiEffect) onApplyAiEffect({ type: 'animatediff', prompt, scale });
    }, 2500);
  };

  return (
    <div className="bg-[#0B1120] border border-blue-500/30 rounded-2xl p-4 text-white shadow-xl space-y-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex items-center gap-2 mb-2 border-b border-white/10 pb-3">
        <Wand2 className="w-5 h-5 text-purple-400" />
        <h3 className="font-black text-sm uppercase tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
          Động Cơ Đồ Họa 3D & AI AnimateDiff
        </h3>
      </div>

      {/* Engine Selector */}
      <div className="flex bg-black/40 rounded-xl p-1 gap-1 border border-white/5">
        <button
          onClick={() => setModelType('3d')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
            modelType === '3d' 
              ? 'bg-blue-600/80 text-white shadow-glow-blue' 
              : 'text-gray-400 hover:bg-white/5'
          }`}
        >
          <Box className="w-3.5 h-3.5" />
          Three.js / Babylon
        </button>
        <button
          onClick={() => setModelType('ai')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
            modelType === 'ai' 
              ? 'bg-purple-600/80 text-white shadow-glow-purple' 
              : 'text-gray-400 hover:bg-white/5'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          AnimateDiff AI
        </button>
      </div>

      {modelType === '3d' ? (
        <div className="space-y-4 animate-fade-in">
          <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded-xl space-y-2">
            <label className="text-[10px] font-bold text-blue-300 uppercase tracking-wider block">
              Mô hình 3D (VRM/GLTF)
            </label>
            <div className="flex items-center justify-center w-full h-24 border-2 border-dashed border-blue-500/30 rounded-lg bg-black/30 hover:bg-blue-500/10 transition-colors cursor-pointer group">
              <div className="text-center space-y-1">
                <Upload className="w-5 h-5 text-blue-400 mx-auto group-hover:scale-110 transition-transform" />
                <p className="text-xs font-bold text-gray-300">Tải lên file .VRM / .GLB</p>
                <p className="text-[9px] text-gray-500">Hỗ trợ rigging tiêu chuẩn</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-blue-400" />
                Kích thước Nhân Vật (Scale)
              </label>
              <span className="text-xs font-mono text-blue-300 bg-blue-900/40 px-2 rounded">{scale.toFixed(1)}x</span>
            </div>
            <div className="flex items-center gap-2">
              <Minimize2 className="w-3 h-3 text-gray-400" />
              <input 
                type="range" 
                min="0.1" max="3.0" step="0.1" 
                value={scale} 
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="flex-1 accent-blue-500 h-1.5 bg-gray-800 rounded-full appearance-none"
              />
              <Maximize2 className="w-3 h-3 text-gray-400" />
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-purple-900/20 border border-purple-500/30 rounded-xl space-y-2 text-center cursor-pointer hover:bg-purple-900/40 transition-colors">
              <ImageIcon className="w-5 h-5 text-purple-400 mx-auto" />
              <p className="text-xs font-bold text-gray-300">Ảnh Bắt Đầu</p>
            </div>
            <div className="p-3 bg-purple-900/20 border border-purple-500/30 rounded-xl space-y-2 text-center cursor-pointer hover:bg-purple-900/40 transition-colors">
              <Video className="w-5 h-5 text-purple-400 mx-auto" />
              <p className="text-xs font-bold text-gray-300">Video Pose Mẫu</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-purple-300 uppercase tracking-wider block">
              Prompt Hình Ảnh & Chuyển Động
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-20 px-3 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-xs font-mono text-gray-200 focus:outline-none focus:border-purple-500 resize-none"
              placeholder="Miêu tả nhân vật và điệu nhảy..."
            />
          </div>

          <div className="space-y-2">
             <label className="text-[10px] font-bold text-purple-300 uppercase tracking-wider block">
              Motion Module (Động Cơ Chuyển Động)
            </label>
            <select
              value={motionModule}
              onChange={(e) => setMotionModule(e.target.value)}
              className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-xs font-bold text-gray-200 focus:outline-none focus:border-purple-500"
            >
              <option value="mm_sd_v15_v2">AnimateDiff v1.5 (Mượt, Siêu thực)</option>
              <option value="mm_sd_v14">AnimateDiff v1.4 (Hoạt hình 2D/3D)</option>
              <option value="mm_sdxl_v10_beta">AnimateDiff SDXL (4K Cinematic)</option>
            </select>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`w-full py-2.5 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 shadow-xl ${
              isGenerating 
                ? 'bg-purple-600/50 cursor-not-allowed text-gray-300 animate-pulse' 
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white shadow-glow-purple cursor-pointer'
            }`}
          >
            {isGenerating ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ĐANG RENDER AI...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-yellow-300" />
                PHÁT LỆNH ANIMATEDIFF 4K
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
