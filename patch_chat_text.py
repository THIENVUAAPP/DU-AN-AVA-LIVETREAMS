import re
with open('src/hooks/useLiveCoordinator.js', 'r', encoding='utf-8') as f:
    content = f.read()

target1 = """    let replyText = '';
    let shouldAction = null;"""
replacement1 = """    let replyText = '';
    let chatText = '';
    let shouldAction = null;"""

target2 = """        // GHÉP TOÀN BỘ CÂU THOẠI HOÀN CHỈNH
        replyText = `${repeatPrefix} ${bodyAnswer}`.replace(/\\s+/g, ' ').trim();
      }"""
replacement2 = """        // GHÉP TOÀN BỘ CÂU THOẠI HOÀN CHỈNH
        replyText = `${repeatPrefix} ${bodyAnswer}`.replace(/\\s+/g, ' ').trim();
        chatText = bodyAnswer.trim() || replyText;
      }"""

target3 = """          if (onChatReply) onChatReply(replyText);"""
replacement3 = """          if (onChatReply) onChatReply(chatText || replyText);"""

target4 = """              ai_reply: replyText"""
replacement4 = """              ai_reply: chatText || replyText"""


if target1 in content:
    content = content.replace(target1, replacement1)
if target2 in content:
    content = content.replace(target2, replacement2)
if target3 in content:
    content = content.replace(target3, replacement3)
if target4 in content:
    content = content.replace(target4, replacement4)

with open('src/hooks/useLiveCoordinator.js', 'w', encoding='utf-8') as f:
    f.write(content)
