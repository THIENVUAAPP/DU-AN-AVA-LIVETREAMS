import re
with open('src/components/genaidol/EventVoiceTester.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = """  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);"""
replacement = """  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  useEffect(() => {
    if (defaultVolume !== undefined && !isNaN(Number(defaultVolume))) {
      setVolume(Number(defaultVolume));
      volumeRef.current = Number(defaultVolume);
    }
  }, [defaultVolume]);

  useEffect(() => {
    if (defaultSpeed !== undefined && !isNaN(Number(defaultSpeed))) {
      setSpeed(Number(defaultSpeed));
      speedRef.current = Number(defaultSpeed);
    }
  }, [defaultSpeed]);"""

if target in content:
    content = content.replace(target, replacement)
    print("Patched EventVoiceTester props!")
else:
    print("Target not found!")

with open('src/components/genaidol/EventVoiceTester.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
