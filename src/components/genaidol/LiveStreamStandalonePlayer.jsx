import React, { useEffect, useState } from "react";

export default function LiveStreamStandalonePlayer() {
  const [frameUrl, setFrameUrl] = useState("");

  useEffect(() => {
    const searchParams = window.location.search || "?sound=1&autoplay=1";
    setFrameUrl(`/live-stream${searchParams}`);
  }, []);

  if (!frameUrl) return <div style={{ background: "#000", width: "100vw", height: "100vh" }} />;

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", backgroundColor: "#000", margin: 0, padding: 0 }}>
      <iframe
        src={frameUrl}
        title="AvaLive Live Stream Player"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          display: "block"
        }}
        allow="autoplay; fullscreen; microphone; camera; display-capture"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      />
    </div>
  );
}
