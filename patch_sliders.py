with open('src/components/genaidol/WorkspaceKeywordPanel.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

target_str = """          </label>
        </div>
      </div>"""

replacement_str = """          </label>
        </div>
      </div>

      {/* TÙY CHỈNH GIỌNG VOICE AI */}
      <div className="p-3 bg-[#161922] rounded-xl border border-purple-500/30 flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px] flex items-center gap-3">
          <label className="text-[11px] font-bold text-gray-300 whitespace-nowrap min-w-[80px]">Âm lượng Voice</label>
          <input 
            type="range" 
            min="0" max="1" step="0.1" 
            value={currentConfig.voiceVolume !== undefined ? currentConfig.voiceVolume : 1.0}
            onChange={(e) => syncConfig({ voiceVolume: parseFloat(e.target.value) })}
            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          <span className="text-[10px] text-purple-400 font-mono w-[30px]">{Math.round((currentConfig.voiceVolume !== undefined ? currentConfig.voiceVolume : 1.0) * 100)}%</span>
        </div>
        <div className="flex-1 min-w-[200px] flex items-center gap-3">
          <label className="text-[11px] font-bold text-gray-300 whitespace-nowrap min-w-[80px]">Tốc độ đọc</label>
          <input 
            type="range" 
            min="0.5" max="2" step="0.1" 
            value={currentConfig.voiceRate !== undefined ? currentConfig.voiceRate : 1.0}
            onChange={(e) => syncConfig({ voiceRate: parseFloat(e.target.value) })}
            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          <span className="text-[10px] text-purple-400 font-mono w-[30px]">{currentConfig.voiceRate !== undefined ? currentConfig.voiceRate : 1.0}x</span>
        </div>
      </div>"""

if target_str in content:
    content = content.replace(target_str, replacement_str)
    with open('src/components/genaidol/WorkspaceKeywordPanel.jsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Sliders added successfully")
else:
    print("Target string not found")
