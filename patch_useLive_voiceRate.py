import re

with open('src/hooks/useLiveCoordinator.js', 'r', encoding='utf-8') as f:
    content = f.read()

old_vol = """          const finalVoiceObj = {
            ...effectiveVoice,
            volume: effectiveVolume
          };"""

new_vol = """          const effectiveRate = currentEvConfig.voiceRate !== undefined ? Number(currentEvConfig.voiceRate) : (effectiveVoice.rate ?? 1.0);
          const finalVoiceObj = {
            ...effectiveVoice,
            volume: effectiveVolume,
            rate: effectiveRate
          };"""

content = content.replace(old_vol, new_vol)

with open('src/hooks/useLiveCoordinator.js', 'w', encoding='utf-8') as f:
    f.write(content)
