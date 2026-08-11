import React, { useState } from 'react';
import { Video, Cast, MonitorSmartphone, Radio, Power, Settings2, Volume2, Video as VideoIcon, Activity, RefreshCw } from 'lucide-react';

export default function LivestreamModule() {
  const [activeTab, setActiveTab] = useState('platforms');
  const [isStreaming, setIsStreaming] = useState(false);

  return (
    <div className="flex flex-col h-full bg-[#0B0B14] text-white">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-white/10 bg-black/40 backdrop-blur-md flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-500/20">
            <Video className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Live Stream Engine
            </h1>
            <p className="text-xs text-gray-400">Điều khiển luồng phát, OBS, RTMP, Đa nền tảng và Scene</p>
          </div>
        </div>
        
        <button 
          onClick={() => setIsStreaming(!isStreaming)}
          className={`px-6 py-2 rounded-full font-bold flex items-center gap-2 transition-all ${
            isStreaming 
              ? 'bg-red-500 hover:bg-red-600 shadow-[0_0_20px_rgba(239,68,68,0.5)]' 
              : 'bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
          }`}
        >
          <Power className="w-4 h-4" />
          {isStreaming ? 'STOP STREAM' : 'START STREAM'}
        </button>
      </div>

      <div className="flex-1 overflow-auto p-6 flex gap-6 custom-scrollbar">
        {/* Left Column: Mixer & Preview */}
        <div className="w-7/12 flex flex-col gap-6">
          <div className="flex-1 glass-panel p-4 rounded-2xl border border-white/10 bg-black/40 flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold flex items-center gap-2"><MonitorSmartphone className="w-4 h-4" /> Stream Preview (Program)</h3>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isStreaming ? 'bg-red-500/20 text-red-400' : 'bg-gray-800 text-gray-400'}`}>
                {isStreaming ? 'LIVE' : 'OFFLINE'}
              </span>
            </div>
            
            <div className="flex-1 w-full bg-black rounded-xl border border-white/5 relative overflow-hidden flex items-center justify-center">
               <div className="absolute inset-0 flex items-center justify-center text-gray-700 font-black text-4xl opacity-20">
                 NO SIGNAL
               </div>
               {isStreaming && (
                 <div className="absolute top-4 left-4 flex gap-2">
                   <span className="px-2 py-1 bg-red-600 text-white text-[10px] font-bold rounded">REC</span>
                   <span className="px-2 py-1 bg-black/60 text-white text-[10px] rounded">00:15:23</span>
                 </div>
               )}
            </div>

            {/* Mixers below preview */}
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-gray-400"><Volume2 className="w-3 h-3 inline mr-1" /> Audio Mixer</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] w-10">Avatar</span>
                    <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[70%]" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] w-10">BGM</span>
                    <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 w-[30%]" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-gray-400"><Activity className="w-3 h-3 inline mr-1" /> Stream Health</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div><span className="text-gray-500">FPS:</span> <span className="text-emerald-400 font-bold">60</span></div>
                  <div><span className="text-gray-500">Bitrate:</span> <span className="text-emerald-400 font-bold">6000 Kbps</span></div>
                  <div><span className="text-gray-500">Dropped:</span> <span className="text-emerald-400 font-bold">0 (0%)</span></div>
                  <div><span className="text-gray-500">CPU:</span> <span className="text-yellow-400 font-bold">45%</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Settings */}
        <div className="w-5/12 flex flex-col gap-4">
          <div className="flex p-1 bg-black/40 border border-white/10 rounded-xl">
            {[
              { id: 'platforms', icon: Cast, label: 'Platforms' },
              { id: 'source', icon: VideoIcon, label: 'Sources/Scenes' },
              { id: 'settings', icon: Settings2, label: 'Settings' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === tab.id ? 'bg-white/10 text-red-400' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" /> {tab.label}
              </button>
            ))}
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-black/20 flex-1 overflow-auto custom-scrollbar">
            
            {activeTab === 'platforms' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold flex items-center gap-2"><Radio className="w-4 h-4" /> RTMP Destinations</h3>
                
                {[
                  { name: 'TikTok Live', color: 'bg-black', border: 'border-gray-700', active: true },
                  { name: 'Facebook Live', color: 'bg-blue-600', border: 'border-blue-500', active: true },
                  { name: 'YouTube Live', color: 'bg-red-600', border: 'border-red-500', active: false },
                  { name: 'Shopee Live', color: 'bg-orange-500', border: 'border-orange-400', active: false },
                ].map(p => (
                  <div key={p.name} className="p-4 rounded-xl bg-black/40 border border-white/5">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${p.color} border ${p.border}`} />
                        <span className="font-bold text-sm">{p.name}</span>
                      </div>
                      <div className={`w-8 h-4 rounded-full relative cursor-pointer ${p.active ? 'bg-red-500' : 'bg-gray-700'}`}>
                        <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${p.active ? 'left-4.5 right-0.5' : 'left-0.5'}`} style={{ left: p.active ? '18px' : '2px' }} />
                      </div>
                    </div>
                    {p.active && (
                      <div className="space-y-2">
                        <input type="text" placeholder="RTMP URL" className="w-full text-xs p-2 rounded bg-black/60 border border-white/10 outline-none focus:border-red-500 text-gray-300" defaultValue="rtmp://live.platform.com/app" />
                        <div className="relative">
                          <input type="password" placeholder="Stream Key" className="w-full text-xs p-2 rounded bg-black/60 border border-white/10 outline-none focus:border-red-500 text-gray-300" defaultValue="xxxxxxxxxxxx" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'source' && (
              <div className="space-y-4">
                 <h3 className="text-sm font-bold flex items-center gap-2"><VideoIcon className="w-4 h-4" /> Scenes & Sources</h3>
                 <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                   <div className="font-bold text-xs mb-2 text-gray-400 uppercase tracking-wider">Scenes</div>
                   <div className="space-y-2">
                     <button className="w-full text-left p-2 bg-red-500/20 border border-red-500/50 rounded text-sm text-red-400">Main Live (AI Avatar)</button>
                     <button className="w-full text-left p-2 bg-black/40 border border-white/5 rounded text-sm text-gray-400">BRB (Be Right Back)</button>
                     <button className="w-full text-left p-2 bg-black/40 border border-white/5 rounded text-sm text-gray-400">Starting Soon</button>
                   </div>
                 </div>

                 <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                   <div className="font-bold text-xs mb-2 text-gray-400 uppercase tracking-wider">Sources (Main Live)</div>
                   <div className="space-y-2">
                     <div className="flex justify-between items-center p-2 bg-black/40 rounded text-sm"><span>Avatar Render [3D]</span><span className="text-emerald-400 text-[10px]">ON</span></div>
                     <div className="flex justify-between items-center p-2 bg-black/40 rounded text-sm"><span>Product Overlay [HTML]</span><span className="text-emerald-400 text-[10px]">ON</span></div>
                     <div className="flex justify-between items-center p-2 bg-black/40 rounded text-sm"><span>Background [Video]</span><span className="text-emerald-400 text-[10px]">ON</span></div>
                     <div className="flex justify-between items-center p-2 bg-black/40 rounded text-sm"><span>Alert Box</span><span className="text-gray-500 text-[10px]">OFF</span></div>
                   </div>
                 </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-4">
                 <h3 className="text-sm font-bold flex items-center gap-2"><Settings2 className="w-4 h-4" /> Encoder Settings</h3>
                 
                 <div className="space-y-3 text-sm">
                   <div>
                     <label className="text-xs text-gray-400 block mb-1">Video Encoder</label>
                     <select className="w-full p-2 rounded bg-black/40 border border-white/10 outline-none focus:border-red-500">
                       <option>Hardware (NVENC H.264)</option>
                       <option>Software (x264)</option>
                     </select>
                   </div>
                   <div>
                     <label className="text-xs text-gray-400 block mb-1">Resolution</label>
                     <select className="w-full p-2 rounded bg-black/40 border border-white/10 outline-none focus:border-red-500">
                       <option>1080x1920 (Vertical 1080p)</option>
                       <option>720x1280 (Vertical 720p)</option>
                       <option>1920x1080 (Landscape)</option>
                     </select>
                   </div>
                   <div>
                     <label className="text-xs text-gray-400 block mb-1">Bitrate (Kbps)</label>
                     <input type="number" defaultValue={6000} className="w-full p-2 rounded bg-black/40 border border-white/10 outline-none focus:border-red-500" />
                   </div>
                   <div>
                     <label className="text-xs text-gray-400 block mb-1">Virtual Camera / Output</label>
                     <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5">
                        <span className="text-xs">Enable Virtual Camera</span>
                        <div className="w-8 h-4 rounded-full relative cursor-pointer bg-gray-700">
                          <div className="absolute top-0.5 w-3 h-3 rounded-full bg-white left-0.5" style={{ left: '2px' }} />
                        </div>
                      </div>
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
