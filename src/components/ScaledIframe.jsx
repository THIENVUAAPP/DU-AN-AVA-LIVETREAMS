import React, { useRef, useEffect, useState } from 'react';

export default function ScaledIframe({ src, title }) {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  
  // Force a desktop resolution for the iframe
  const desktopWidth = 1280;
  const desktopHeight = 720;

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        setScale(width / desktopWidth);
      }
    };
    
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden bg-[#121216]">
      <iframe 
        src={src}
        title={title}
        allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
        allowFullScreen
        style={{
          width: `${desktopWidth}px`,
          height: `${desktopHeight}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          border: 'none',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      />
    </div>
  );
}
