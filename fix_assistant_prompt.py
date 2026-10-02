import re

with open('src/components/genaidol/WorkspaceTacVu.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "{currentConfig.assistantPrompt !== undefined && (",
    "{currentConfig.assistantPrompt !== undefined && selectedEventId !== 'comment' && ("
)

with open('src/components/genaidol/WorkspaceTacVu.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
