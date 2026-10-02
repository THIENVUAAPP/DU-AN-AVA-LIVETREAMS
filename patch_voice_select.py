import re
with open('src/components/genaidol/WorkspaceKeywordPanel.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = "{/* TÙY CHỈNH GIỌNG VOICE AI */}"
replacement = """{/* TÙY CHỈNH GIỌNG VOICE AI */}
      <div className="p-3 bg-[#161922] rounded-xl border border-purple-500/30 flex flex-wrap items-center gap-4 mb-2">
        <div className="w-full flex items-center gap-3">
          <label className="text-[11px] font-bold text-gray-300 whitespace-nowrap min-w-[80px]">Giọng Đọc AI</label>
          <select 
            value={currentConfig.voiceId || 'free_vi_female'}
            onChange={(e) => syncConfig({ voiceId: e.target.value })}
            className="flex-1 bg-[#0b0e14] border border-gray-700 text-purple-300 text-xs rounded-lg p-2 focus:border-purple-500 focus:outline-none"
          >
            {ALL_SYSTEM_VOICES.map(v => (
              <option key={v.id} value={v.id}>{v.name} - {v.provider} ({v.gender})</option>
            ))}
          </select>
        </div>
      </div>"""

content = content.replace(target, replacement)

with open('src/components/genaidol/WorkspaceKeywordPanel.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Patched WorkspaceKeywordPanel")
