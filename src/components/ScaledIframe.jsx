import React, { useRef, useEffect, useState } from 'react';

export default function ScaledIframe({ src, title }) {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0, scale: 1 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        
        // We want the internal iframe to be at least 800px wide to avoid the "Open App" mobile overlay
        // But we want it to keep the EXACT same aspect ratio as the container to avoid black bars
        const targetInternalWidth = 1000;
        const targetInternalHeight = targetInternalWidth * (height / width);
        const scale = width / targetInternalWidth;

        setDimensions({
          width: targetInternalWidth,
          height: targetInternalHeight,
          scale: scale
        });
      }
    };
    
    // Initial update
    updateDimensions();

    // Use ResizeObserver for accurate container resizing
    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
    });
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden bg-[#121216]">
      {dimensions.width > 0 && (
        <iframe 
          src={src}
          title={title}
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
          style={{
            width: `${dimensions.width}px`,
            height: `${dimensions.height}px`,
            transform: `scale(${dimensions.scale})`,
            transformOrigin: 'top left',
            border: 'none',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        />
      )}
    </div>
  );
}
