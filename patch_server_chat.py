import re
with open('backend/server.cjs', 'r', encoding='utf-8') as f:
    content = f.read()

target = "socket.on('disconnect', () => {"
replacement = """  socket.on('tiktok_chat', (data) => {
    // Cho phép AI tự động nhắn text lên tất cả các màn hình Sân Khấu Phụ & Chính
    io.emit('tiktok_chat', data);
  });

  socket.on('disconnect', () => {"""

if target in content:
    content = content.replace(target, replacement)
    with open('backend/server.cjs', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Patched server.cjs")
else:
    print("Could not find target in server.cjs")
