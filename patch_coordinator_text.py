import re
with open('src/hooks/useLiveCoordinator.js', 'r', encoding='utf-8') as f:
    content = f.read()

target = "if (onChatReply) onChatReply(chatText || replyText);"
replacement = """if (onChatReply) onChatReply(chatText || replyText);
          // ⚡ Bắn trực tiếp text lên màn hình Sân Khấu Chính bằng Overlay Text
          syncMasterLiveState({
            stage: 'idol',
            overlayText: chatText || replyText,
            overlayTextTransform: { x: 5, y: 75, width: 90, height: 20 },
            overlayTextStyle: 'neon_cyber',
            overlayTextFontSize: 18,
            overlayTextColor: '#38bdf8'
          });"""

if target in content:
    content = content.replace(target, replacement)
    with open('src/hooks/useLiveCoordinator.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Patched useLiveCoordinator.js overlayText")
else:
    print("Could not find target in useLiveCoordinator.js")
