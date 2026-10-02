with open('src/hooks/useLiveCoordinator.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add onChatReply to the hook signature
target_sig = "export function useLiveCoordinator({ isConnected, onVoiceReply, activeBrainPack = 'talk' }) {"
replacement_sig = "export function useLiveCoordinator({ isConnected, onVoiceReply, onChatReply, activeBrainPack = 'talk' }) {"
if target_sig in content:
    content = content.replace(target_sig, replacement_sig)
    print("Patched signature!")

# 2. Call onChatReply
target_chat = """        if (shouldSendChat) {
          setViewerHistory(prev => [
            ...prev, 
            { 
              time: new Date().toLocaleTimeString(), 
              type, 
              payload, 
              ai_intent: 'STRUCTURED_CONFIG', 
              ai_reply: replyText 
            }
          ].slice(-20));
        }"""

replacement_chat = """        if (shouldSendChat) {
          setViewerHistory(prev => [
            ...prev, 
            { 
              time: new Date().toLocaleTimeString(), 
              type, 
              payload, 
              ai_intent: 'STRUCTURED_CONFIG', 
              ai_reply: replyText 
            }
          ].slice(-20));
          if (onChatReply) onChatReply(replyText);
        }"""

if target_chat in content:
    content = content.replace(target_chat, replacement_chat)
    print("Patched chat trigger!")

with open('src/hooks/useLiveCoordinator.js', 'w', encoding='utf-8') as f:
    f.write(content)
