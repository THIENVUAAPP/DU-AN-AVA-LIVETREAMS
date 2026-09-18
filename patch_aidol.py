import re

with open("src/components/genaidol/AIDOLLiveConsole.jsx", "r") as f:
    content = f.read()

# We need to inject systemPrompt into the fetch body
search_str = """
        body: JSON.stringify({
          brain: 'gemini',
          apiKey: '',
          eventType: type,
          payload: data,
          viewerHistory: viewerHistory[data.author] || [],
          brainPack: activeBrainPack
        })
"""

# Let's find exactly what the current fetch looks like using regex since it might not match exact whitespace
# It's probably in handleLiveEvent
content = re.sub(
    r"body: JSON\.stringify\(\{\s*brain: 'gemini',\s*apiKey: '',\s*eventType: type,\s*payload: data,\s*viewerHistory: viewerHistory\[data\.author\] \|\| \[\],\s*brainPack: activeBrainPack\s*\}\)",
    "body: JSON.stringify({ brain: 'gemini', apiKey: '', eventType: type, payload: data, viewerHistory: viewerHistory[data.author] || [], brainPack: activeBrainPack, systemPrompt: localStorage.getItem('aidol_prompt_' + activeBrainPack) || '' })",
    content
)

with open("src/components/genaidol/AIDOLLiveConsole.jsx", "w") as f:
    f.write(content)
