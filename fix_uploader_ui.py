import re

with open('src/components/UniversalFileUploader.jsx', 'r') as f:
    content = f.read()

# Make the form simpler
old_form = """          {(!isLinkAnalyzed || !analyzedData) ? (
            <form onSubmit={handleAnalyzeLink} className="space-y-2">
              <input 
                type="text" 
                value={restreamTitleInput}
                onChange={(e) => setRestreamTitleInput(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                placeholder="Tên gợi nhớ (Không bắt buộc)..."
                disabled={analyzing}
              />

              <div className="flex items-center gap-2">
                <input 
                  type="url" 
                  value={restreamUrlInput}
                  onChange={(e) => setRestreamUrlInput(e.target.value)}
                  className="flex-1 bg-[#0A0A0A] border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 font-mono"
                  placeholder="Dán link https://tiktok.com/@video/123..."
                  required
                  disabled={analyzing}
                />

                <button
                  type="submit"
                  disabled={analyzing}
                  className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black text-xs transition-all shadow-glow-emerald cursor-pointer whitespace-nowrap flex items-center gap-1.5"
                >
                  {analyzing ? <Loader2 className="w-4 h-4 animate-spin"/> : <Sparkles className="w-4 h-4"/>}
                  {analyzing ? "ĐANG PHÂN TÍCH" : "PHÂN TÍCH LINK"}
                </button>
              </div>
            </form>"""

new_form = """          {(!isLinkAnalyzed || !analyzedData) ? (
            <form onSubmit={handleAnalyzeLink} className="space-y-3">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-gray-400">ĐƯỜNG LINK VIDEO / LIVESTREAM:</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    value={restreamUrlInput}
                    onChange={(e) => setRestreamUrlInput(e.target.value)}
                    className="flex-1 bg-black border border-emerald-500/40 rounded-xl px-3 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 font-mono"
                    placeholder="VD: https://www.youtube.com/watch?v=..."
                    required
                    disabled={analyzing}
                  />

                  <button
                    type="submit"
                    disabled={analyzing || !restreamUrlInput.trim()}
                    className="py-3 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:opacity-90 disabled:opacity-50 text-white font-black text-xs transition-all shadow-glow-emerald cursor-pointer whitespace-nowrap flex items-center gap-2"
                  >
                    {analyzing ? <Loader2 className="w-4 h-4 animate-spin"/> : <Sparkles className="w-4 h-4"/>}
                    {analyzing ? "ĐANG KIỂM TRA..." : "XEM TRƯỚC VIDEO"}
                  </button>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-gray-500">TÊN GỢI NHỚ (TÙY CHỌN):</label>
                <input 
                  type="text" 
                  value={restreamTitleInput}
                  onChange={(e) => setRestreamTitleInput(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500"
                  placeholder="Để trống hệ thống sẽ tự đặt tên..."
                  disabled={analyzing}
                />
              </div>
            </form>"""

content = content.replace(old_form, new_form)

with open('src/components/UniversalFileUploader.jsx', 'w') as f:
    f.write(content)

