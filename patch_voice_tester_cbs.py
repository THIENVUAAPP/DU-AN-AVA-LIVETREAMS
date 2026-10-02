import re
with open('src/components/genaidol/EventVoiceTester.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "setRealtimeAudioParams({ volume: val });",
    "setRealtimeAudioParams({ volume: val });\n    if (onVolumeChange) onVolumeChange(val);"
)

content = content.replace(
    "setRealtimeAudioParams({ rate });",
    "setRealtimeAudioParams({ rate });\n    if (onSpeedChange) onSpeedChange(rate);"
)

with open('src/components/genaidol/EventVoiceTester.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
