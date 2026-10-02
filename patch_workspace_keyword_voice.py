import re

with open('src/components/genaidol/WorkspaceKeywordPanel.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_block = """          <label 
            onClick={(e) => {
              e.preventDefault();
              const isChat = currentConfig.sendChatText !== false && currentConfig.commentResponseFormat !== 'voice_only';
              const isVoice = currentConfig.speakVoice !== false && currentConfig.commentResponseFormat !== 'text_only';
              const nextVoice = !isVoice;
              if (!nextVoice && !isChat) return;
              const nextFormat = isChat && nextVoice ? 'hybrid' : nextVoice ? 'voice_only' : 'text_only';
              syncConfig({ speakVoice: nextVoice, commentResponseFormat: nextFormat });
            }}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 select-none ${
              (currentConfig.speakVoice !== false && currentConfig.commentResponseFormat !== 'text_only')
                ? 'bg-purple-600/30 border-purple-500 text-purple-300'
                : 'bg-white/5 border-white/10 text-gray-500 hover:text-gray-300'
            }`}
          >
            <input 
              type="checkbox" 
              checked={currentConfig.speakVoice !== false && currentConfig.commentResponseFormat !== 'text_only'}
              onChange={() => {}}
              className="w-3 h-3 accent-purple-500 rounded cursor-pointer"
            />
            <span>🗣️ Voice AI</span>
          </label>
        </div>
      </div>"""

new_block = """          <label 
            onClick={(e) => {
              e.preventDefault();
              const isChat = currentConfig.sendChatText !== false && currentConfig.commentResponseFormat !== 'voice_only';
              const isVoice = currentConfig.speakVoice !== false && currentConfig.commentResponseFormat !== 'text_only';
              const nextVoice = !isVoice;
              if (!nextVoice && !isChat) return;
              const nextFormat = isChat && nextVoice ? 'hybrid' : nextVoice ? 'voice_only' : 'text_only';
              syncConfig({ speakVoice: nextVoice, commentResponseFormat: nextFormat });
            }}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 select-none ${
              (currentConfig.speakVoice !== false && currentConfig.commentResponseFormat !== 'text_only')
                ? 'bg-purple-600/30 border-purple-500 text-purple-300'
                : 'bg-white/5 border-white/10 text-gray-500 hover:text-gray-300'
            }`}
          >
            <input 
              type="checkbox" 
              checked={currentConfig.speakVoice !== false && currentConfig.commentResponseFormat !== 'text_only'}
              onChange={() => {}}
              className="w-3 h-3 accent-purple-500 rounded cursor-pointer"
            />
            <span>🗣️ Voice AI</span>
          </label>
        </div>
        
        {/* THANH ĐIỀU CHỈNH VOLUME & SPEED */}
        {(currentConfig.speakVoice !== false && currentConfig.commentResponseFormat !== 'text_only') && (
          <div className="mt-3 p-3 bg-black/40 border border-purple-500/20 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-purple-300 flex items-center gap-1"><Volume2 size={14}/> Âm lượng (Volume):</span>
                <span className="text-xs font-black text-white">{currentConfig.voiceVolume !== undefined ? currentConfig.voiceVolume : 1.0}</span>
              </div>
              <input 
                type="range" min="0" max="1" step="0.1" 
                value={currentConfig.voiceVolume !== undefined ? currentConfig.voiceVolume : 1.0} 
                onChange={e => syncConfig({ voiceVolume: parseFloat(e.target.value) })}
                className="w-full accent-purple-500" 
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-purple-300 flex items-center gap-1">⚡ Tốc độ (Speed):</span>
                <span className="text-xs font-black text-white">{currentConfig.voiceRate !== undefined ? currentConfig.voiceRate : 1.0}x</span>
              </div>
              <input 
                type="range" min="0.5" max="2.0" step="0.1" 
                value={currentConfig.voiceRate !== undefined ? currentConfig.voiceRate : 1.0} 
                onChange={e => syncConfig({ voiceRate: parseFloat(e.target.value) })}
                className="w-full accent-purple-500" 
              />
            </div>
          </div>
        )}
      </div>"""

content = content.replace(old_block, new_block)
with open('src/components/genaidol/WorkspaceKeywordPanel.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
