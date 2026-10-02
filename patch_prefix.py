import re
with open('src/hooks/useLiveCoordinator.js', 'r', encoding='utf-8') as f:
    content = f.read()

target = "const tpl = commentConfig.repeatCommentPrefix || 'Dạ bạn {user} vừa hỏi là: \"{comment}\". ';"
replacement = "const tpl = commentConfig.repeatCommentPrefix || 'Dạ chào bạn {user}, bạn vừa bình luận là: \"{comment}\". ';"
content = content.replace(target, replacement)

with open('src/hooks/useLiveCoordinator.js', 'w', encoding='utf-8') as f:
    f.write(content)

with open('src/components/genaidol/WorkspaceTacVu.jsx', 'r', encoding='utf-8') as f:
    content2 = f.read()
target2 = "repeatCommentPrefix: ev.id === 'comment' ? 'Dạ bạn {user} vừa hỏi là: \"{comment}\". ' : undefined,"
replacement2 = "repeatCommentPrefix: ev.id === 'comment' ? 'Dạ chào bạn {user}, bạn vừa bình luận là: \"{comment}\". ' : undefined,"
content2 = content2.replace(target2, replacement2)
with open('src/components/genaidol/WorkspaceTacVu.jsx', 'w', encoding='utf-8') as f:
    f.write(content2)

print("Patched prefix")
