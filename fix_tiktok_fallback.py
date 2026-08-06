import re

with open('src/components/MultistreamStudio.jsx', 'r') as f:
    content = f.read()

# I need to add a TikTokEmbed component wrapper inside the file, and use it as a fallback.
tiktok_embed_component = """
const TikTokEmbed = ({ url }) => {
  const containerRef = useRef(null);
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = `<blockquote class="tiktok-embed" cite="${url}" data-video-id=""><section></section></blockquote>`;
    }
    const scriptId = 'tiktok-embed-script';
    let script = document.getElementById(scriptId);
    if (script) script.remove();
    script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://www.tiktok.com/embed.js';
    script.async = true;
    document.body.appendChild(script);
  }, [url]);
  return <div ref={containerRef} className="w-full h-full bg-black overflow-hidden flex items-center justify-center pointer-events-auto"></div>;
};
"""

if "const TikTokEmbed =" not in content:
    content = content.replace("const MultistreamStudio = () => {", tiktok_embed_component + "\nconst MultistreamStudio = () => {")

# Modify Single Monitor
old_else_player = """                        getTiktokId(activeVideoUrl) ? (
                           <iframe 
                              src={`https://www.tiktok.com/embed/v2/${getTiktokId(activeVideoUrl)}`}
                              width="100%"
                              height="100%"
                              allow="fullscreen"
                              className="w-full h-full border-none pointer-events-auto"
                           ></iframe>
                        ) : isFacebookUrl(activeVideoUrl) ? ("""

new_else_player = """                        getTiktokId(activeVideoUrl) ? (
                           <iframe 
                              src={`https://www.tiktok.com/embed/v2/${getTiktokId(activeVideoUrl)}`}
                              width="100%"
                              height="100%"
                              allow="fullscreen"
                              className="w-full h-full border-none pointer-events-auto"
                           ></iframe>
                        ) : activeVideoUrl.includes('tiktok.com') ? (
                           <TikTokEmbed url={activeVideoUrl} />
                        ) : isFacebookUrl(activeVideoUrl) ? ("""

content = content.replace(old_else_player, new_else_player)

# Modify Matrix Monitor
old_matrix_player = """                            getTiktokId(activeVideoUrl) ? (
                               <iframe 
                                  src={`https://www.tiktok.com/embed/v2/${getTiktokId(activeVideoUrl)}`}
                                  width="100%"
                                  height="100%"
                                  allow="fullscreen"
                                  className="w-full h-full border-none pointer-events-none"
                               ></iframe>
                            ) : isFacebookUrl(activeVideoUrl) ? ("""

new_matrix_player = """                            getTiktokId(activeVideoUrl) ? (
                               <iframe 
                                  src={`https://www.tiktok.com/embed/v2/${getTiktokId(activeVideoUrl)}`}
                                  width="100%"
                                  height="100%"
                                  allow="fullscreen"
                                  className="w-full h-full border-none pointer-events-none"
                               ></iframe>
                            ) : activeVideoUrl.includes('tiktok.com') ? (
                               <TikTokEmbed url={activeVideoUrl} />
                            ) : isFacebookUrl(activeVideoUrl) ? ("""

content = content.replace(old_matrix_player, new_matrix_player)

with open('src/components/MultistreamStudio.jsx', 'w') as f:
    f.write(content)

