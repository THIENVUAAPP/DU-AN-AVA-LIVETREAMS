import re

with open('src/components/MultistreamStudio.jsx', 'r') as f:
    content = f.read()

# Replace the onClick handler for the "MỞ VIDEO" button
old_button = """<button
                    onClick={() => setActiveVideoUrl(videoUrlInput.trim())}
                    className="h-10 px-6 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm shadow-glow-amber transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap"
                  >"""

new_button = """<button
                    onClick={async () => {
                      let url = videoUrlInput.trim();
                      if (url.includes('tiktok.com') && !url.includes('/video/')) {
                         try {
                            const res = await fetch(`/api/resolve-redirect?url=${encodeURIComponent(url)}`);
                            const data = await res.json();
                            if (data && data.url) {
                               url = data.url;
                            }
                         } catch (e) { console.error("Could not resolve redirect", e); }
                      }
                      setActiveVideoUrl(url);
                    }}
                    className="h-10 px-6 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm shadow-glow-amber transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap"
                  >"""

content = content.replace(old_button, new_button)

with open('src/components/MultistreamStudio.jsx', 'w') as f:
    f.write(content)

