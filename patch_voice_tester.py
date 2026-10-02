import re
with open('src/components/genaidol/EventVoiceTester.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

target_props = """  pauseBetweenSentences = 0.0,
  onPauseChange = null,
  onVoiceChange = null,"""
replacement_props = """  pauseBetweenSentences = 0.0,
  onPauseChange = null,
  onVoiceChange = null,
  defaultSpeed = 1.0,
  onSpeedChange = null,
  defaultVolume = 1.0,
  onVolumeChange = null,"""

if target_props in content:
    content = content.replace(target_props, replacement_props)
    
target_state = """  const [volume, setVolume] = useState(1.0); // 0.0 to 1.0
  const [speed, setSpeed] = useState(1.0); // 0.75 to 2.0"""
replacement_state = """  const [volume, setVolume] = useState(defaultVolume !== undefined ? Number(defaultVolume) : 1.0);
  const [speed, setSpeed] = useState(defaultSpeed !== undefined ? Number(defaultSpeed) : 1.0);"""

if target_state in content:
    content = content.replace(target_state, replacement_state)

target_speed_change = """  const handleSpeedChange = (val) => {
    setSpeed(val);
    speedRef.current = val;
  };"""
replacement_speed_change = """  const handleSpeedChange = (val) => {
    setSpeed(val);
    speedRef.current = val;
    if (onSpeedChange) onSpeedChange(val);
  };"""
if target_speed_change in content:
    content = content.replace(target_speed_change, replacement_speed_change)

target_volume_change = """  const handleVolumeChange = (valStr) => {
    const val = Number(valStr);
    setVolume(val);
    volumeRef.current = val;
  };"""
replacement_volume_change = """  const handleVolumeChange = (valStr) => {
    const val = Number(valStr);
    setVolume(val);
    volumeRef.current = val;
    if (onVolumeChange) onVolumeChange(val);
  };"""
if target_volume_change in content:
    content = content.replace(target_volume_change, replacement_volume_change)

with open('src/components/genaidol/EventVoiceTester.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Patched EventVoiceTester!")
