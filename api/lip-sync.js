export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    const { audioBase64, videoUrl, platform } = req.body;
    if (!audioBase64 || !videoUrl) {
      return res.status(400).json({ error: 'Missing audio or video input' });
    }

    const apiKey = process.env.LIPSYNC_API_KEY || process.env.VITE_LIPSYNC_API_KEY;

    // TODO: Tích hợp API thực tế (SyncLabs / HeyGen)
    if (!apiKey) {
      // MOCK: Nếu chưa có API Key, trả về video gốc và yêu cầu frontend tự phát audio đè lên
      // Cách này giúp mô phỏng Lip-Sync (chỉ có âm thanh + video gốc) mà không làm sập ứng dụng.
      return res.status(200).json({
        success: true,
        lipSyncVideoUrl: videoUrl, // Trả lại video gốc
        audioBase64: audioBase64,  // Trả lại âm thanh để phát kèm
        mocked: true,
        message: 'No LIPSYNC_API_KEY provided, running in mock mode.'
      });
    }

    if (platform === 'synclabs') {
      // Demo cấu trúc gọi SyncLabs API
      /*
      const response = await fetch('https://api.synclabs.so/video', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          audioUrl: "data:audio/mp3;base64," + audioBase64,
          videoUrl: videoUrl,
          synergize: true,
          webhookUrl: "" // Nếu cần webhooks
        })
      });
      const data = await response.json();
      return res.status(200).json({ success: true, lipSyncVideoUrl: data.url });
      */
    }

    // Default mock response nếu có key nhưng chưa config đúng platform
    return res.status(200).json({
      success: true,
      lipSyncVideoUrl: videoUrl,
      audioBase64: audioBase64,
      mocked: true
    });

  } catch (error) {
    console.error('LipSync Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
