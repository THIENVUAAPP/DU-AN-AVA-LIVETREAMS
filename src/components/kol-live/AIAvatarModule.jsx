import React, { useState } from 'react';
import { UserSquare2, Sliders, Box, MonitorPlay, Webcam, Zap, Smile, Maximize, MousePointer2 } from 'lucide-react';

const MOCK_AVATARS = [
  { id: 'a1', name: 'Ava - Nữ MC', type: '3D Metahuman', tags: ['Realtime', 'Lip Sync'] },
  { id: 'a2', name: 'Thanh - KOL', type: 'VTuber', tags: ['Anime', 'Face Tracking'] },
  { id: 'a3', name: 'Khoa - Sale', type: '2D Avatar', tags: ['Photo-real', 'Static'] },
];

export default function AIAvatarModule() {
  const [selectedAvatar, setSelectedAvatar] = useState('a1');
  const [activeTab, setActiveTab] = useState('library'); // library, tracking, animation

  return (
    <div className="flex flex-col h-full bg-[#0B0B14] text-white">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-white/10 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
            <UserSquare2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              AI Avatar Engine
            </h1>
            <p className="text-xs text-gray-400">Quản lý nhân vật ảo 3D/2D, VTuber, Metahuman, Face Tracking, Gestures</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 flex gap-6 custom-scrollbar">
        {/* Left Column: Avatar Preview */}
        <div className="w-1/2 flex flex-col gap-6">
          <div className="flex-1 glass-panel rounded-2xl border border-white/10 bg-black/40 relative overflow-hidden flex flex-col">
            <div className="absolute top-4 left-4 z-10">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                RENDER ENGINE ACTIVE
              </span>
            </div>
            
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              <button className="p-2 rounded-lg bg-black/50 border border-white/10 hover:bg-white/10 transition-colors">
                <Maximize className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* 3D Canvas Placeholder */}
            <div className="flex-1 w-full flex items-center justify-center bg-gradient-to-b from-gray-900 to-black relative">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              
              {/* Dummy Avatar Silhouette */}
              <div className="w-48 h-80 bg-gradient-to-t from-emerald-500/20 to-transparent rounded-t-full relative flex items-center justify-center border-t border-emerald-500/30">
                <UserSquare2 className="w-20 h-20 text-emerald-500/40" />
                {/* Tracking dots overlay */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border border-emerald-500/30 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full absolute top-4 left-4" />
                  <div className="w-2 h-2 bg-emerald-400 rounded-full absolute top-4 right-4" />
                  <div className="w-4 h-1 bg-emerald-400 rounded-full absolute bottom-4" />
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-white/10 bg-black/60 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Avatar Preview</h3>
                <p className="text-[10px] text-gray-400">FPS: 60 | Latency: 12ms</p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold transition-colors">
                  Play Animation
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Controls */}
        <div className="w-1/2 flex flex-col gap-4">
          {/* Tabs */}
          <div className="flex p-1 bg-black/40 border border-white/10 rounded-xl">
            {[
              { id: 'library', icon: Box, label: 'Thư viện' },
              { id: 'tracking', icon: Webcam, label: 'Tracking & AI' },
              { id: 'animation', icon: Smile, label: 'Animation & Gestures' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === tab.id ? 'bg-white/10 text-emerald-400' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" /> {tab.label}
              </button>
            ))}
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-black/20 flex-1 overflow-auto custom-scrollbar">
            
            {activeTab === 'library' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-bold">Danh sách Nhân vật</h3>
                  <button className="text-xs px-2 py-1 bg-white/5 rounded border border-white/10 hover:bg-white/10">
                    + Thêm Model (.vrm/.glb)
                  </button>
                </div>
                <div className="space-y-2">
                  {MOCK_AVATARS.map(avatar => (
                    <div 
                      key={avatar.id}
                      onClick={() => setSelectedAvatar(avatar.id)}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                        selectedAvatar === avatar.id ? 'bg-emerald-500/20 border-emerald-500/50' : 'bg-black/40 border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center">
                          <UserSquare2 className="w-5 h-5 text-gray-500" />
                        </div>
                        <div>
                          <div className="font-bold text-sm">{avatar.name}</div>
                          <div className="text-[10px] text-gray-400">{avatar.type}</div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {avatar.tags.map(t => <span key={t} className="text-[9px] px-2 py-0.5 bg-white/10 rounded-full">{t}</span>)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'tracking' && (
              <div className="space-y-6">
                <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 mb-4">
                  <h3 className="text-sm font-bold text-emerald-400 mb-1 flex items-center gap-2">
                    <Webcam className="w-4 h-4" /> AI Camera Tracking
                  </h3>
                  <p className="text-[10px] text-gray-400 mb-3">Sử dụng Camera để nhận diện khuôn mặt và truyền chuyển động (Mocap) trực tiếp cho Avatar.</p>
                  <button className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-xs font-bold transition-colors">
                    Start Camera Tracking
                  </button>
                </div>

                <div className="space-y-4">
                  {[
                    { name: 'Lip Sync (Đồng bộ môi với Voice)', active: true },
                    { name: 'Face Tracking (Mắt, Mũi, Miệng)', active: true },
                    { name: 'Head Tracking (Xoay đầu)', active: true },
                    { name: 'Eye Tracking & Blink (Chớp mắt)', active: true },
                    { name: 'Hand Tracking (Cử chỉ tay)', active: false },
                  ].map(feature => (
                    <div key={feature.name} className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5">
                      <span className="text-xs text-gray-300">{feature.name}</span>
                      <div className={`w-8 h-4 rounded-full relative cursor-pointer ${feature.active ? 'bg-emerald-500' : 'bg-gray-700'}`}>
                        <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${feature.active ? 'left-4.5 right-0.5' : 'left-0.5'}`} style={{ left: feature.active ? '18px' : '2px' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'animation' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold mb-3 flex items-center gap-2"><Smile className="w-4 h-4" /> Biểu Cảm (Expressions)</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {['Vui vẻ', 'Buồn', 'Tức giận', 'Ngạc nhiên', 'Sợ hãi', 'Thư giãn'].map(exp => (
                      <button key={exp} className="py-2 bg-black/40 border border-white/10 hover:border-emerald-500/50 rounded-lg text-xs transition-colors">
                        {exp}
                      </button>
                    ))}
                  </div>
                </div>

                <hr className="border-white/5" />

                <div>
                  <h3 className="text-sm font-bold mb-3 flex items-center gap-2"><MousePointer2 className="w-4 h-4" /> Chuyển Động (Gestures & Poses)</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {['Vẫy tay chào', 'Chỉ sản phẩm', 'Gật đầu đồng ý', 'Nhún nhảy nhẹ', 'Vỗ tay', 'Thả tim'].map(anim => (
                      <button key={anim} className="py-2 bg-black/40 border border-white/10 hover:border-emerald-500/50 rounded-lg text-xs transition-colors text-left px-3 flex justify-between items-center group">
                        {anim}
                        <Play className="w-3 h-3 text-gray-500 group-hover:text-emerald-400" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
