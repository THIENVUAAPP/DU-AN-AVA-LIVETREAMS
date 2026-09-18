import re

with open('src/components/MultistreamStudio.jsx', 'r') as f:
    content = f.read()

# Fix Matrix Grid
old_matrix_video = """{streamSourceMode === "url" && activeVideoUrl ? (
                      <div className="w-full h-full absolute inset-0 pointer-events-none">
                         <ReactPlayer url={activeVideoUrl} playing loop muted width="100%" height="100%" style={{ objectFit: "cover", position: "absolute", top: 0, left: 0 }} />
                      </div>"""
new_matrix_video = """{streamSourceMode === "url" && activeVideoUrl ? (
                      <div className="w-full h-full absolute inset-0 z-0">
                         <ReactPlayer url={activeVideoUrl} playing loop muted controls width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0 }} />
                      </div>"""
content = content.replace(old_matrix_video, new_matrix_video)

# Fix Single Monitor
old_single_video = """{streamSourceMode === "url" && activeVideoUrl ? (
                  <div className="w-full h-full absolute inset-0 z-0 pointer-events-none">
                     <ReactPlayer key={activeVideoUrl} url={activeVideoUrl} playing loop muted width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0 }} />
                  </div>"""
new_single_video = """{streamSourceMode === "url" && activeVideoUrl ? (
                  <div className="w-full h-full absolute inset-0 z-0">
                     <ReactPlayer key={activeVideoUrl} url={activeVideoUrl} playing loop muted controls width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0 }} />
                  </div>"""
content = content.replace(old_single_video, new_single_video)

with open('src/components/MultistreamStudio.jsx', 'w') as f:
    f.write(content)

