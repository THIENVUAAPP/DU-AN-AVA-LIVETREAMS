import re
with open('src/components/genaidol/DesktopAppUI.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = """      const now = Date.now();
      const timeSinceLastGreet = now - lastAiGreetingTime.current;
      if (timeSinceLastGreet > 2000) {
        lastAiGreetingTime.current = now;
        handleLiveEventRef.current?.('VIEWER_JOIN', { name: author });
      } else {
        const delay = 2000 - timeSinceLastGreet;
        setTimeout(() => {
          lastAiGreetingTime.current = Date.now();
          handleLiveEventRef.current?.('VIEWER_JOIN', { name: author });
        }, delay);
      }"""

replacement = """      const now = Date.now();
      let scheduleTime = lastAiGreetingTime.current + 2500;
      if (scheduleTime < now) scheduleTime = now;
      lastAiGreetingTime.current = scheduleTime;
      
      const delay = scheduleTime - now;
      if (delay <= 0) {
        handleLiveEventRef.current?.('VIEWER_JOIN', { name: author });
      } else {
        setTimeout(() => {
          handleLiveEventRef.current?.('VIEWER_JOIN', { name: author });
        }, delay);
      }"""

content = content.replace(target, replacement)
with open('src/components/genaidol/DesktopAppUI.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Patched DesktopAppUI")
