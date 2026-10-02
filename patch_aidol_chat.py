with open('src/components/genaidol/AIDOLLiveConsole.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

target_str = """  const { 
    isProcessingEvent,
    handleLiveEvent
  } = useLiveCoordinator({
    isConnected: isLiveConnected,
    onVoiceReply: (data) => {"""

replacement_str = """  const { 
    isProcessingEvent,
    handleLiveEvent
  } = useLiveCoordinator({
    isConnected: isLiveConnected,
    onChatReply: (text) => {
      if (window.socketManager) {
        const socket = window.socketManager.getSocket();
        if (socket) {
          socket.emit('tiktok_chat', {
            uniqueId: 'Trợ lý AvaLive',
            comment: text,
            isModerator: true,
            profilePictureUrl: 'https://ui-avatars.com/api/?name=Ava&background=8b5cf6&color=fff'
          });
        }
      }
    },
    onVoiceReply: (data) => {"""

if target_str in content:
    content = content.replace(target_str, replacement_str)
    with open('src/components/genaidol/AIDOLLiveConsole.jsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Patched AIDOLLiveConsole.jsx for onChatReply!")
else:
    print("Could not find target string in AIDOLLiveConsole.jsx")
