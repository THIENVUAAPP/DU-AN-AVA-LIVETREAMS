import React, { useState } from 'react';
import { 
  LayoutDashboard, Video, UserSquare2, Mic, BrainCircuit, Package, 
  ShoppingCart, MessageSquareText, Users, Receipt, Boxes, CreditCard, 
  Image as ImageIcon, Zap, LineChart, Globe, Cloud, ShieldCheck, 
  Code2, Settings, ChevronRight
} from 'lucide-react';

import AIBrainModule from './kol-live/AIBrainModule';
import AIVoiceModule from './kol-live/AIVoiceModule';
import AIAvatarModule from './kol-live/AIAvatarModule';
import LivestreamModule from './kol-live/LivestreamModule';
import DashboardModule from './kol-live/DashboardModule';

const MODULES = [
  { id: 'dashboard', icon: LayoutDashboard, label: '① Dashboard', category: 'CORE' },
  { id: 'livestream', icon: Video, label: '② Livestream', category: 'CORE' },
  { id: 'ai-avatar', icon: UserSquare2, label: '③ AI Avatar', category: 'AI ENGINE' },
  { id: 'ai-voice', icon: Mic, label: '④ AI Voice', category: 'AI ENGINE' },
  { id: 'ai-brain', icon: BrainCircuit, label: '⑤ AI Brain', category: 'AI ENGINE', isSpecial: true },
  { id: 'products', icon: Package, label: '⑥ Sản phẩm', category: 'E-COMMERCE' },
  { id: 'sales', icon: ShoppingCart, label: '⑦ Bán hàng', category: 'E-COMMERCE' },
  { id: 'comments', icon: MessageSquareText, label: '⑧ Bình luận', category: 'E-COMMERCE' },
  { id: 'crm', icon: Users, label: '⑨ CRM', category: 'E-COMMERCE' },
  { id: 'orders', icon: Receipt, label: '⑩ Đơn hàng', category: 'E-COMMERCE' },
  { id: 'inventory', icon: Boxes, label: '⑪ Kho hàng', category: 'E-COMMERCE' },
  { id: 'payment', icon: CreditCard, label: '⑫ Thanh toán', category: 'E-COMMERCE' },
  { id: 'media', icon: ImageIcon, label: '⑬ Media', category: 'RESOURCES' },
  { id: 'automation', icon: Zap, label: '⑭ Automation', category: 'SYSTEM' },
  { id: 'reports', icon: LineChart, label: '⑮ Báo cáo', category: 'SYSTEM' },
  { id: 'platforms', icon: Globe, label: '⑯ Đa nền tảng', category: 'SYSTEM' },
  { id: 'cloud', icon: Cloud, label: '⑰ Cloud', category: 'INFRA' },
  { id: 'security', icon: ShieldCheck, label: '十八 Bảo mật', category: 'INFRA' },
  { id: 'api', icon: Code2, label: '⑲ API & SDK', category: 'INFRA' },
  { id: 'settings', icon: Settings, label: '⑳ Cài đặt', category: 'INFRA' }
];

const PlaceholderModule = ({ module }) => (
  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-black/20 rounded-2xl border border-white/5 animate-pulse">
    <module.icon className="w-24 h-24 text-gray-700 mb-6" />
    <h2 className="text-3xl font-black text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
      {module.label} Module
    </h2>
    <p className="text-gray-400 max-w-lg mb-8 text-lg">
      Hệ thống đang chuẩn bị kết nối dữ liệu Backend và UI cho phân hệ này. 
      Vui lòng quay lại sau khi bản cập nhật hệ sinh thái KOL LIVE hoàn tất!
    </p>
    <div className="px-6 py-3 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-sm font-bold shadow-[0_0_15px_rgba(59,130,246,0.3)]">
      Đang Khởi Tạo...
    </div>
  </div>
);

export default function KOLLiveDashboard() {
  const [activeModule, setActiveModule] = useState('ai-brain');

  const categories = Array.from(new Set(MODULES.map(m => m.category)));

  const activeModData = MODULES.find(m => m.id === activeModule);

  return (
    <div className="flex h-screen bg-[#0B0B14] text-white font-sans overflow-hidden">
      {/* SIDEBAR: 20 Modules Navigation */}
      <aside className="w-64 flex-shrink-0 bg-black/40 border-r border-white/10 flex flex-col backdrop-blur-md overflow-y-auto custom-scrollbar relative z-10">
        <div className="p-5 border-b border-white/10 sticky top-0 bg-black/80 backdrop-blur-xl z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)]">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                KOL LIVE
              </h1>
              <p className="text-[10px] text-emerald-400 font-bold tracking-wider uppercase">Control Center</p>
            </div>
          </div>
        </div>

        <div className="p-3 space-y-6">
          {categories.map(category => (
            <div key={category} className="space-y-1">
              <h3 className="px-3 text-[10px] font-black text-gray-500 tracking-widest mb-2">{category}</h3>
              <div className="space-y-0.5">
                {MODULES.filter(m => m.category === category).map(module => (
                  <button
                    key={module.id}
                    onClick={() => setActiveModule(module.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-300 group ${
                      activeModule === module.id 
                        ? (module.isSpecial ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/20 border border-purple-400/30' : 'bg-white/10 text-white border border-white/5')
                        : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <module.icon className={`w-4 h-4 ${activeModule === module.id ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`} />
                      <span className="text-xs font-bold">{module.label}</span>
                    </div>
                    {activeModule === module.id && <ChevronRight className="w-3.5 h-3.5 text-white/50" />}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-hidden relative bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-blue-600/5 blur-[120px] pointer-events-none" />

        {/* Dynamic Header */}
        <header className="h-16 flex-shrink-0 flex items-center justify-between px-6 border-b border-white/10 bg-black/30 backdrop-blur-md relative z-10">
          <div className="flex items-center gap-3">
            {activeModData && <activeModData.icon className="w-5 h-5 text-gray-400" />}
            <h2 className="text-lg font-bold text-white">{activeModData?.label}</h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              SYSTEM ONLINE
            </span>
          </div>
        </header>

        {/* Module Content */}
        <div className="flex-1 overflow-auto custom-scrollbar p-6 relative z-10 flex">
          {activeModule === 'dashboard' ? (
            <div className="flex-1 w-full h-full bg-[#0B0B14] rounded-2xl border border-white/10 overflow-hidden shadow-2xl relative">
              <DashboardModule />
            </div>
          ) : activeModule === 'livestream' ? (
            <div className="flex-1 w-full h-full bg-[#0B0B14] rounded-2xl border border-white/10 overflow-hidden shadow-2xl relative">
              <LivestreamModule />
            </div>
          ) : activeModule === 'ai-avatar' ? (
            <div className="flex-1 w-full h-full bg-[#0B0B14] rounded-2xl border border-white/10 overflow-hidden shadow-2xl relative">
              <AIAvatarModule />
            </div>
          ) : activeModule === 'ai-voice' ? (
            <div className="flex-1 w-full h-full bg-[#0B0B14] rounded-2xl border border-white/10 overflow-hidden shadow-2xl relative">
              <AIVoiceModule />
            </div>
          ) : activeModule === 'ai-brain' ? (
            // MODULE 5: Renders the migrated AI Kể Chuyện UI
            <div className="flex-1 w-full h-full bg-[#0B0B14] rounded-2xl border border-white/10 overflow-hidden shadow-2xl relative">
              <AIBrainModule />
            </div>
          ) : (
            <PlaceholderModule module={activeModData} />
          )}
        </div>
      </main>
    </div>
  );
}
