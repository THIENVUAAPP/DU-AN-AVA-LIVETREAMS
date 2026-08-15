import React, { useEffect, useState } from 'react';
import GameBanDoVietNam from './GameBanDoVietNam';
import bandoEngine from './bandoGameEngine';

export default function GameBanDoOverlay() {
  const [liveEvent, setLiveEvent] = useState(null);

  useEffect(() => {
    // Listen to BroadcastChannel for real-time live events from Admin / Host
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        const bc = new BroadcastChannel('avalive_bando_stage');
        bc.onmessage = (e) => {
          if (e.data && e.data.lastEvent) {
            setLiveEvent(e.data.lastEvent);
          }
        };
        return () => bc.close();
      } catch (err) {}
    }
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden bg-transparent select-none">
      <GameBanDoVietNam 
        isPopout={true}
        externalLiveEvent={liveEvent}
      />
    </div>
  );
}
