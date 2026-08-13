import re

with open("src/components/genaidol/AIDOLLiveConsole.jsx", "r") as f:
    content = f.read()

# Add import
if "import WorkspaceTacVu" not in content:
    content = re.sub(
        r"import AIAudioPlayer from './AIAudioPlayer';",
        "import AIAudioPlayer from './AIAudioPlayer';\nimport WorkspaceTacVu from './WorkspaceTacVu';",
        content
    )

# Change tab name
content = re.sub(
    r"\['scripts','📄 Kịch bản'\]",
    "['ai-setup','⚙️ Cài đặt Sự kiện AI']",
    content
)

# Change tab content
old_tab_content_regex = r"\{\/\*\s*══ TAB: KỊCH BẢN ══\s*\*\/.*?\}\)"
new_tab_content = """{/* ══ TAB: KỊCH BẢN (NAY LÀ EVENT MANAGER) ══ */}
            {activeTab === 'ai-setup' && (
              <div className="h-full overflow-y-auto">
                 <WorkspaceTacVu />
              </div>
            )}"""

# Replace the whole activeTab === 'scripts' block
# Since the regex might be tricky with newlines, we can just replace 'scripts' with 'ai-setup' and empty the content.
# Actually, I'll use a simpler replace
content = re.sub(
    r"\{\/\*\s*══ TAB: KỊCH BẢN ══\s*\*\/.*?(?=\{\/\*\s*══ TAB: STREAM SETUP ══\s*\*\/)",
    new_tab_content + "\n\n            ",
    content,
    flags=re.DOTALL
)

with open("src/components/genaidol/AIDOLLiveConsole.jsx", "w") as f:
    f.write(content)
