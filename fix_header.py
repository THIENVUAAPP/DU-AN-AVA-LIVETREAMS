import re

with open('src/components/Header.jsx', 'r') as f:
    content = f.read()

# Replace the navigation items
old_nav = """  const workspaceNavItems = [
    { id: 'broadcast', label: 'Live Studio' },
    { 
      id: 'avatars', 
      label: aiAvatarFeatureEnabled 
        ? 'MC AI & Restream' 
        : 'Restream 24/7' 
    },
    { id: 'multistream', label: 'Đa Nền Tảng' },
    { id: 'livestream-cloner', label: 'Sao Chép Live' },
    { id: 'chat-hub', label: 'Chat Hub AI' },
  ];"""

new_nav = """  const workspaceNavItems = [
    { id: 'broadcast', label: 'Live Studio' },
    ...(aiAvatarFeatureEnabled ? [{ id: 'avatars', label: 'MC AI Studio' }] : []),
    { id: 'multistream', label: 'Restream Đa Nền Tảng' },
    { id: 'livestream-cloner', label: 'Sao Chép Live' },
    { id: 'chat-hub', label: 'Chat Hub AI' },
  ];"""

content = content.replace(old_nav, new_nav)

with open('src/components/Header.jsx', 'w') as f:
    f.write(content)

