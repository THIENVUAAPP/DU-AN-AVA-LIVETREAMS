import re

with open('src/components/genaidol/DesktopAppUI.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the block
old_block = """      // ⚡ 2. Xử lý khi video bị xóa đang là video đang chọn / phát trên sân khấu hoặc đã xóa hết video
      if (selectedCharacter === id || remaining.length === 0) {
        if (remaining.length === 0) {"""
        
new_block = """      // ⚡ 2. Xử lý khi video bị xóa đang là video đang chọn / phát trên sân khấu hoặc đã xóa hết video
      if (selectedCharacter === id || remaining.length === 0) {
        if (true) { // TUYỆT ĐỐI XÓA SẠCH SÂN KHẤU KHI VIDEO ĐANG PHÁT BỊ XÓA"""

content = content.replace(old_block, new_block)

with open('src/components/genaidol/DesktopAppUI.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
