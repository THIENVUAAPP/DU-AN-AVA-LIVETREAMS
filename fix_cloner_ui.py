import re

content = open('src/components/LivestreamClonerStudio.jsx').read()

# Replace the player rendering block
old_player_block_start = """                {/* REAL-TIME VIDEO PLAYER IFRAME / NATIVE PLAYER */}
                <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden group/player">"""

new_player_block_start = """                {/* REAL-TIME VIDEO PLAYER IFRAME / NATIVE PLAYER */}
                <div className={`relative bg-black flex items-center justify-center overflow-hidden group/player ${
                  stream.url.toLowerCase().includes('tiktok.com') 
                    ? (viewMode === 'tabs' ? 'h-[75vh] aspect-[9/16] mx-auto' : 'aspect-[9/16] w-full') 
                    : 'aspect-video w-full'
                }`}>"""

content = content.replace(old_player_block_start, new_player_block_start)

# Replace ScaledIframe usages with native iframe
old_scaled_1 = """                      ) : (
                        <ScaledIframe 
                          src={getEmbedUrl(stream.url)}
                          title="Real-time Livestream Player"
                        />
                      )"""

new_iframe = """                      ) : (
                        <iframe 
                          src={getEmbedUrl(stream.url)}
                          title="Real-time Livestream Player"
                          className="w-full h-full border-none absolute inset-0"
                          allowFullScreen
                          allow="autoplay; encrypted-media; fullscreen"
                        />
                      )"""
content = content.replace(old_scaled_1, new_iframe)

old_scaled_2 = """                    ) : (
                      <ScaledIframe 
                        src={getEmbedUrl(stream.url)}
                        title="Real-time Livestream Player"
                      />
                    )"""

new_iframe_2 = """                    ) : (
                      <iframe 
                        src={getEmbedUrl(stream.url)}
                        title="Real-time Livestream Player"
                        className="w-full h-full border-none absolute inset-0"
                        allowFullScreen
                        allow="autoplay; encrypted-media; fullscreen"
                      />
                    )"""
content = content.replace(old_scaled_2, new_iframe_2)

# Fix the fullscreen logic: we used '.aspect-video' which is now dynamic
old_fullscreen = """                        const container = e.currentTarget.closest('.aspect-video');"""
new_fullscreen = """                        const container = e.currentTarget.closest('.group\\\\/player');"""
content = content.replace(old_fullscreen, new_fullscreen)

open('src/components/LivestreamClonerStudio.jsx', 'w').write(content)
