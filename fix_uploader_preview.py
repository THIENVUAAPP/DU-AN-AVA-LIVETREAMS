import re

with open('src/components/UniversalFileUploader.jsx', 'r') as f:
    content = f.read()

# Make sure ReactPlayer is imported
if "import ReactPlayer from 'react-player';" not in content:
    content = content.replace(
        "import React, { useState, useRef } from 'react';",
        "import React, { useState, useRef } from 'react';\nimport ReactPlayer from 'react-player';"
    )

old_analyzed_block = """          ) : (
            <div className="bg-[#121216] border border-emerald-500/40 rounded-xl p-3 flex flex-col gap-3 shadow-glow-green-sm">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">"""

new_analyzed_block = """          ) : (
            <div className="bg-[#121216] border border-emerald-500/40 rounded-xl p-3 flex flex-col gap-3 shadow-glow-green-sm animate-fadeIn">
              
              {/* VIDEO PREVIEW PLAYER (NEW) */}
              <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black border border-white/10">
                 <ReactPlayer 
                   url={restreamUrlInput} 
                   playing={true} 
                   controls={true} 
                   width="100%" 
                   height="100%" 
                   style={{ position: 'absolute', top: 0, left: 0 }} 
                 />
              </div>

              <div className="flex items-center justify-between border-b border-white/10 pb-2">"""

content = content.replace(old_analyzed_block, new_analyzed_block)

# Also fix the "Tên gợi nhớ" required issue (make it optional or auto-fill)
content = content.replace(
    """placeholder="Tên gợi nhớ (Ví dụ: Phiên Live Đón Tết)..."
                disabled={analyzing}
              />""",
    """placeholder="Tên gợi nhớ (Không bắt buộc)..."
                disabled={analyzing}
              />"""
)

with open('src/components/UniversalFileUploader.jsx', 'w') as f:
    f.write(content)

