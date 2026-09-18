import re

with open('src/components/MultistreamStudio.jsx', 'r') as f:
    content = f.read()

old_single = """{streamSourceMode === "url" && activeVideoUrl ? (
                  <div className="w-full h-full absolute inset-0 z-0 pointer-events-auto bg-black overflow-hidden">
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
                  </div>
                )"""

new_single = """{streamSourceMode === "url" && activeVideoUrl ? (
                  <div className="w-full h-full pointer-events-auto flex items-center justify-center bg-black">
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
                  </div>
                )"""

content = content.replace(old_single, new_single)

with open('src/components/MultistreamStudio.jsx', 'w') as f:
    f.write(content)

