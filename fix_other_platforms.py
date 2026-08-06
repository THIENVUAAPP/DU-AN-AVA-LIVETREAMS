import re

with open('src/components/MultistreamStudio.jsx', 'r') as f:
    content = f.read()

# Add getTiktokId and isFacebookUrl
helpers = """
const getTiktokId = (url) => {
  if (!url) return null;
  const match = url.match(/tiktok\\.com\\/.*video\\/(\\d+)/);
  return match ? match[1] : null;
};

const isFacebookUrl = (url) => {
  if (!url) return false;
  return url.includes('facebook.com') || url.includes('fb.watch');
};
"""

if "getTiktokId" not in content:
    content = content.replace(
        "const getYoutubeId = (url) => {",
        helpers + "\nconst getYoutubeId = (url) => {"
    )

# Fix Single Monitor
# I will use a regex to find the ReactPlayer in the else branch of getYoutubeId(activeVideoUrl)
old_else_player = """<ReactPlayer 
                           key={activeVideoUrl} 
                           url={activeVideoUrl} 
                           playing={true} 
                           loop={true} 
                           muted={false} 
                           controls={true} 
                           width="100%" 
                           height="100%" 
                        />"""

new_else_player = """
                        getTiktokId(activeVideoUrl) ? (
                           <iframe 
                              src={`https://www.tiktok.com/embed/v2/${getTiktokId(activeVideoUrl)}`}
                              width="100%"
                              height="100%"
                              allow="fullscreen"
                              className="w-full h-full border-none pointer-events-auto"
                           ></iframe>
                        ) : isFacebookUrl(activeVideoUrl) ? (
                           <iframe 
                              src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(activeVideoUrl)}&show_text=false&width=auto`}
                              width="100%"
                              height="100%"
                              style={{ border: 'none', overflow: 'hidden' }}
                              scrolling="no"
                              frameBorder="0"
                              allowFullScreen={true}
                              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                              className="w-full h-full pointer-events-auto"
                           ></iframe>
                        ) : (
                           <ReactPlayer 
                              key={activeVideoUrl} 
                              url={activeVideoUrl} 
                              playing={true} 
                              loop={true} 
                              muted={false} 
                              controls={true} 
                              width="100%" 
                              height="100%" 
                           />
                        )
"""

content = content.replace(old_else_player, new_else_player)

# Fix Matrix Monitor
old_matrix_player = """<ReactPlayer 
                               url={activeVideoUrl} 
                               playing={true} 
                               loop={true} 
                               muted={true} 
                               controls={false} 
                               width="100%" 
                               height="100%" 
                            />"""

new_matrix_player = """
                            getTiktokId(activeVideoUrl) ? (
                               <iframe 
                                  src={`https://www.tiktok.com/embed/v2/${getTiktokId(activeVideoUrl)}`}
                                  width="100%"
                                  height="100%"
                                  allow="fullscreen"
                                  className="w-full h-full border-none pointer-events-none"
                               ></iframe>
                            ) : isFacebookUrl(activeVideoUrl) ? (
                               <iframe 
                                  src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(activeVideoUrl)}&show_text=false&width=auto`}
                                  width="100%"
                                  height="100%"
                                  style={{ border: 'none', overflow: 'hidden' }}
                                  scrolling="no"
                                  frameBorder="0"
                                  allowFullScreen={true}
                                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                                  className="w-full h-full pointer-events-none"
                               ></iframe>
                            ) : (
                               <ReactPlayer 
                                  url={activeVideoUrl} 
                                  playing={true} 
                                  loop={true} 
                                  muted={true} 
                                  controls={false} 
                                  width="100%" 
                                  height="100%" 
                               />
                            )
"""

content = content.replace(old_matrix_player, new_matrix_player)

with open('src/components/MultistreamStudio.jsx', 'w') as f:
    f.write(content)

