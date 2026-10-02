with open('src/components/genaidol/DesktopAppUI.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

target_str = """  } = useLiveCoordinator({
    isConnected: true, // Luôn sẵn sàng xử lý sự kiện khi có tín hiệu từ TikTok / Giả lập / Live
    activeBrainPack: 'talk', // mặc định
    onVoiceReply: ({ text, action, baseVideoItem, preRecordedCat, voiceId, voiceObj, voiceChannel, volume, isTest }) => {"""

replacement_str = """  } = useLiveCoordinator({
    isConnected: true, // Luôn sẵn sàng xử lý sự kiện khi có tín hiệu từ TikTok / Giả lập / Live
    activeBrainPack: 'talk', // mặc định
    onChatReply: (text) => {
      // Bắn trực tiếp text lên overlay livestream giả lập
      if (socketRef.current) {
        socketRef.current.emit('tiktok_chat', {
          uniqueId: 'Trợ lý AvaLive',
          comment: text,
          isModerator: true,
          profilePictureUrl: 'https://ui-avatars.com/api/?name=Ava&background=8b5cf6&color=fff'
        });
      }
    },
    onVoiceReply: ({ text, action, baseVideoItem, preRecordedCat, voiceId, voiceObj, voiceChannel, volume, isTest }) => {"""

if target_str in content:
    content = content.replace(target_str, replacement_str)
    with open('src/components/genaidol/DesktopAppUI.jsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Patched DesktopAppUI.jsx for onChatReply!")
else:
    print("Could not find target string in DesktopAppUI.jsx")
