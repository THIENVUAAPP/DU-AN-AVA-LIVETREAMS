import React, { useRef, useEffect, useState } from 'react';

export default function ScaledIframe({ src, title }) {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ scale: 1, height: 0 });

  // TikTok Desktop Embed Layout Constants
  // When width is >= 1000px, it shows video on left, chat on right.
  const TIKTOK_INTERNAL_WIDTH = 1000;
  // The chat box takes about 320px on the right. 
  // The video area is approximately 680px wide.
  const TIKTOK_VIDEO_WIDTH = 680;

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        // Scale the 680px video area to fit the actual container width
        const scale = width / TIKTOK_VIDEO_WIDTH;
        
        // We calculate how much internal height is needed to fill the container's height after scaling
        const requiredInternalHeight = height / scale;
        
        setDimensions({ scale, height: requiredInternalHeight });
      }
    };
    
    updateDimensions();

    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
    });
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full relative overflow-hidden bg-[#121216]"
    >
      {dimensions.height > 0 && (
        <div 
          style={{
            width: `${TIKTOK_VIDEO_WIDTH}px`,
            height: `${dimensions.height}px`,
            transform: `scale(${dimensions.scale})`,
            transformOrigin: 'top left',
            position: 'absolute',
            top: 0,
            left: 0,
            overflow: 'hidden' // This hides the chat box!
          }}
        >
          <iframe 
            src={src}
            title={title}
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
            style={{
              width: `${TIKTOK_INTERNAL_WIDTH}px`,
              height: `${dimensions.height}px`,
              border: 'none',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          />
        </div>
      )}
    </div>
  );
}
