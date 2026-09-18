import React, { useState } from 'react';
import { X, TrendingDown, TrendingUp, Trash2, Coins } from 'lucide-react';
import { useToken } from './TokenContext';

export default function TokenHistoryModal({ onClose, onOpenPayment }) {
  const { balance, history, clearHistory } = useToken();
  const [filter, setFilter] = useState('all'); // all | add | deduct

  const filtered = history.filter(h => filter === 'all' ? true : h.type === filter);

  const formatTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleString('vi-VN', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' });
  };

  const balanceColor = balance === 0 ? 'text-red-500' : balance < 200 ? 'text-orange-400' : 'text-emerald-400';

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9998] flex items-center justify-center p-4">
      <div className="bg-[#13131a] text-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden border border-gray-800">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Coins className="text-amber-400" size={22} />
            </div>
            <div>
              <h3 className="font-black text-white">Lịch sử Token</h3>
              <p className="text-xs text-gray-400">Số dư hiện tại: <span className={`font-bold text-lg ${balanceColor}`}>{balance.toLocaleString()}</span> Token</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={22} />
          </button>
        </div>

        {/* Balance Banner */}
        {balance < 200 && balance > 0 && (
          <div className="mx-4 mt-4 bg-orange-500/10 border border-orange-500/30 rounded-xl px-4 py-3 flex items-center justify-between gap-4">
            <p className="text-sm text-orange-300 font-medium">⚠️ Số dư sắp hết! Nạp thêm để tiếp tục sử dụng.</p>
            <button onClick={() => { onClose(); onOpenPayment(); }} className="px-3 py-1.5 bg-orange-500 hover:bg-orange-400 text-white text-xs font-bold rounded-lg shrink-0 transition-colors">Nạp ngay</button>
          </div>
        )}
        {balance === 0 && (
          <div className="mx-4 mt-4 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 flex items-center justify-between gap-4">
            <p className="text-sm text-red-300 font-medium">🔴 Hết token! AI đã tạm dừng hoạt động.</p>
            <button onClick={() => { onClose(); onOpenPayment(); }} className="px-3 py-1.5 bg-red-500 hover:bg-red-400 text-white text-xs font-bold rounded-lg shrink-0 transition-colors">Nạp ngay</button>
          </div>
        )}

        {/* Filter + Clear */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2 gap-2">
          <div className="flex gap-1 bg-gray-800 rounded-lg p-1">
            {[['all','Tất cả'],['add','Nạp'],['deduct','Dùng']].map(([v,label]) => (
              <button key={v} onClick={() => setFilter(v)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${filter === v ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}>
                {label}
              </button>
            ))}
          </div>
          {history.length > 0 && (
            <button onClick={clearHistory} className="text-xs text-gray-500 hover:text-red-400 flex items-center gap-1 transition-colors">
              <Trash2 size={13} /> Xoá lịch sử
            </button>
          )}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2 scroll-smooth">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-600">
              <Coins size={40} className="mb-3 opacity-30" />
              <p className="font-medium">Chưa có giao dịch nào</p>
            </div>
          ) : (
            filtered.map(item => (
              <div key={item.id} className="flex items-center gap-3 bg-gray-800/50 hover:bg-gray-800 rounded-xl px-4 py-3 transition-colors">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${item.type === 'add' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                  {item.type === 'add' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{item.reason}</p>
                  <p className="text-xs text-gray-500">{formatTime(item.time)}</p>
                </div>
                <span className={`font-black text-base shrink-0 ${item.type === 'add' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {item.type === 'add' ? '+' : '-'}{item.amount.toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-800 px-4 py-4">
          <button
            onClick={() => { onClose(); onOpenPayment(); }}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-black rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Coins size={18} /> Nạp thêm Token
          </button>
        </div>
      </div>
    </div>
  );
}
