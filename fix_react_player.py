import re

with open('src/components/MultistreamStudio.jsx', 'r') as f:
    content = f.read()

# Add import ReactPlayer from 'react-player';
if "import ReactPlayer" not in content:
    content = content.replace(
        "import React, { useState, useRef } from 'react';",
        "import React, { useState, useRef } from 'react';\nimport ReactPlayer from 'react-player';"
    )

# Fix Matrix Grid
old_matrix_video = """{streamSourceMode === "url" && activeVideoUrl ? (
                      <video src={activeVideoUrl} controls autoPlay loop muted className="w-full h-full object-cover" />"""
new_matrix_video = """{streamSourceMode === "url" && activeVideoUrl ? (
                      <div className="w-full h-full absolute inset-0 pointer-events-none">
                         <ReactPlayer url={activeVideoUrl} playing loop muted width="100%" height="100%" style={{ objectFit: "cover", position: "absolute", top: 0, left: 0 }} />
                      </div>"""
content = content.replace(old_matrix_video, new_matrix_video)

# Fix Single Monitor
old_single_video = """{streamSourceMode === "url" && activeVideoUrl ? (
                  <video
                    key={activeVideoUrl}
                    src={activeVideoUrl}
                    controls
                    autoPlay
                    loop
                    muted
                    className="w-full h-full object-contain absolute inset-0 z-0"
                  />"""
new_single_video = """{streamSourceMode === "url" && activeVideoUrl ? (
                  <div className="w-full h-full absolute inset-0 z-0 pointer-events-none">
                     <ReactPlayer key={activeVideoUrl} url={activeVideoUrl} playing loop muted width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0 }} />
                  </div>"""
content = content.replace(old_single_video, new_single_video)

with open('src/components/MultistreamStudio.jsx', 'w') as f:
    f.write(content)

