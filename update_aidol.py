import re

with open("src/components/genaidol/AIDOLLiveConsole.jsx", "r") as f:
    content = f.read()

# 1. Add state for customBrains inside the component
# Let's find: const [activeBrainPack, setActiveBrainPack] = useState('talk');
state_code = """
  const [activeBrainPack, setActiveBrainPack] = useState('talk'); // Bộ não chủ đề
  const [customBrains, setCustomBrains] = useState([]);
  
  useEffect(() => {
    const saved = localStorage.getItem('aidol_custom_brains');
    if (saved) {
      try { setCustomBrains(JSON.parse(saved)); } catch(e) {}
    }
  }, []);
  
  const allBrains = [
    { id: 'talk', label: 'Tương tác', icon: '💬' },
    { id: 'sales', label: 'Bán hàng', icon: '🛒' },
    { id: 'dance', label: 'Idol Nhảy', icon: '💃' },
    { id: 'sing', label: 'Idol Hát', icon: '🎤' },
    ...customBrains.map(b => ({ id: b.id, label: b.name, icon: b.icon || '🧠' }))
  ];
"""
content = re.sub(
    r"const \[activeBrainPack, setActiveBrainPack\] = useState\('talk'\); // Bộ não chủ đề",
    state_code,
    content
)

# 2. Update the map rendering
ui_code = """
                    {allBrains.map(pack => (
                      <button key={pack.id} onClick={() => setActiveBrainPack(pack.id)}
"""

content = re.sub(
    r"\{\[\s*\{ id: 'talk', label: 'Tương tác', icon: '💬' \},\s*\{ id: 'sales', label: 'Bán hàng', icon: '🛒' \},\s*\{ id: 'dance', label: 'Idol Nhảy', icon: '💃' \},\s*\{ id: 'sing', label: 'Idol Hát', icon: '🎤' \}\s*\].map\(pack => \(\s*<button key=\{pack.id\} onClick=\{\(\) => setActiveBrainPack\(pack.id\)\}",
    ui_code.strip(),
    content
)


with open("src/components/genaidol/AIDOLLiveConsole.jsx", "w") as f:
    f.write(content)
