import re

with open('src/components/MultistreamStudio.jsx', 'r') as f:
    content = f.read()

# Fix Single Monitor
old_single = """{streamSourceMode === "url" && activeVideoUrl ? (
                  <div className="w-full h-full absolute inset-0 z-0 pointer-events-auto bg-black">
                     <ReactPlayer 
                        key={activeVideoUrl} 
                        url={activeVideoUrl} 
                        playing={true} 
                        loop={true} 
                        muted={false} 
                        controls={true} 
                        width="100%" 
                        height="100%" 
                        style={{ position: 'absolute', top: 0, left: 0 }}
                        onError={(e) => alert("Lỗi khi tải video từ link: " + activeVideoUrl + ". Vui lòng kiểm tra lại link hoặc trình duyệt có đang chặn quảng cáo/video không.")}
                     />
                  </div>
                )"""

new_single = """{streamSourceMode === "url" && activeVideoUrl ? (
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

content = content.replace(old_single, new_single)

# Fix Matrix Monitor
old_matrix = """{streamSourceMode === "url" && activeVideoUrl ? (
                      <div className="w-full h-full absolute inset-0 z-0 bg-black pointer-events-auto">
                         <ReactPlayer 
                            url={activeVideoUrl} 
                            playing={true} 
                            loop={true} 
                            muted={true} 
                            controls={false} 
                            width="100%" 
                            height="100%" 
                            style={{ position: 'absolute', top: 0, left: 0 }}
                         />
                      </div>
                    )"""

new_matrix = """{streamSourceMode === "url" && activeVideoUrl ? (
                      <div className="w-full h-full absolute inset-0 z-0 bg-black pointer-events-auto overflow-hidden">
                         <ReactPlayer 
                            url={activeVideoUrl} 
                            playing={true} 
                            loop={true} 
                            muted={true} 
                            controls={false} 
                            width="100%" 
                            height="100%" 
                         />
                      </div>
                    )"""

content = content.replace(old_matrix, new_matrix)

with open('src/components/MultistreamStudio.jsx', 'w') as f:
    f.write(content)

