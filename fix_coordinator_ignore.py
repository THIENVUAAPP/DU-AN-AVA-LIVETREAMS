with open('src/hooks/useLiveCoordinator.js', 'r', encoding='utf-8') as f:
    content = f.read()

target = """        const userName = payload?.nickname || payload?.username || payload?.uniqueId || 'Khán giả';
        
        // CHỐNG LẶP: Không xử lý comment do chính AI tự động gửi lên!
        if (userName === 'Trợ lý AvaLive' || userName === 'AVA Live AI' || userName === 'Hệ Thống') {
          return;
        }"""

replacement = """        // CHỐNG LẶP: Không xử lý comment do chính AI tự động gửi lên!
        if (rawUserName === 'Trợ lý AvaLive' || rawUserName === 'AVA Live AI' || rawUserName === 'Hệ Thống' || payload?.isModerator === true) {
          return;
        }"""

if target in content:
    content = content.replace(target, replacement)
    with open('src/hooks/useLiveCoordinator.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Fixed ignore logic!")
else:
    print("Target not found!")
