import re

with open('src/components/genaidol/DesktopAppUI.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

with open('new_tabs.jsx', 'r', encoding='utf-8') as f:
    new_tabs_content = f.read()

# We need to find the block to replace.
# Starts at:             {/* Navigation Tabs */}
# Ends just before:             {/* Lịch sử sự kiện */}

pattern = re.compile(r'            \{\/\* Navigation Tabs \*\/\}.*?(?=            \{\/\* Lịch sử sự kiện \*\/\})', re.DOTALL)
new_content, count = pattern.subn(new_tabs_content + '\n', content)

if count == 1:
    with open('src/components/genaidol/DesktopAppUI.jsx', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Replacement successful.")
else:
    print(f"Replacement failed. Count: {count}")

