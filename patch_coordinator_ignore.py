with open('src/hooks/useLiveCoordinator.js', 'r', encoding='utf-8') as f:
    content = f.read()

target = "const commentText = (payload?.text || payload?.comment || '').trim();"
replacement = """const commentText = (payload?.text || payload?.comment || '').trim();
        const userName = payload?.nickname || payload?.username || payload?.uniqueId || 'Khán giả';
        
        // CHỐNG LẶP: Không xử lý comment do chính AI tự động gửi lên!
        if (userName === 'Trợ lý AvaLive' || userName === 'AVA Live AI' || userName === 'Hệ Thống') {
          return;
        }"""

if target in content:
    content = content.replace(target, replacement)
    with open('src/hooks/useLiveCoordinator.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Patched ignore logic!")
else:
    print("Target not found!")
