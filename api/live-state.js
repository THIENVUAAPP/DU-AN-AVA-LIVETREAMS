// Vercel Serverless Function: GET & POST /api/live-state
// Global in-memory fallback state for AvaLive Master Live Realtime Engine

let globalLiveState = {
  stage: 'idol',
  aspectRatio: '9:16',
  characterName: 'AI Idol Linh Anh',
  mediaUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  isVideo: false,
  flvUrl: null,
  isConnected: true,
  isDarkMode: true,
  updatedAt: 0
};

export default async function handler(req, res) {
  // CORS Headers for OBS and TikTok Live Studio CEF
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (body && typeof body === 'object') {
        globalLiveState = {
          ...globalLiveState,
          ...body,
          updatedAt: Date.now()
        };
      }
      return res.status(200).json({ success: true, state: globalLiveState });
    } catch (e) {
      return res.status(400).json({ error: 'Invalid JSON payload' });
    }
  }

  // GET request: return latest state
  return res.status(200).json(globalLiveState);
}
