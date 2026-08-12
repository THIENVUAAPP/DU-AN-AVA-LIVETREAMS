export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    const { text, platform, apiKey: clientApiKey } = req.body;
    if (!text) return res.status(400).json({ error: 'Missing text' });

    let audioBase64 = null;

    if (platform === 'openai_tts' || platform === 'openai') {
      const apiKey = process.env.OPENAI_API_KEY || clientApiKey;
      if (!apiKey) return res.status(503).json({ error: 'OPENAI_API_KEY is not set' });
      
      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'tts-1',
          input: text,
          voice: 'alloy'
        })
      });
      
      if (!response.ok) throw new Error('OpenAI TTS Error: ' + await response.text());
      
      const buffer = await response.arrayBuffer();
      audioBase64 = Buffer.from(buffer).toString('base64');
    } 
    else if (platform === 'gemini') {
      const apiKey = process.env.GEMINI_API_KEY || clientApiKey;
      if (!apiKey) return res.status(503).json({ error: 'GEMINI_API_KEY is not set' });
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text }] }],
          generationConfig: {
            responseModalities: ['AUDIO'],
            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } }
          }
        })
      });
      
      if (!response.ok) throw new Error('Gemini TTS Error: ' + await response.text());
      const data = await response.json();
      audioBase64 = data?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!audioBase64) throw new Error('No audio returned from Gemini');
    } 
    else {
      return res.status(400).json({ error: 'Unsupported TTS platform' });
    }

    return res.status(200).json({ audioBase64 });
  } catch (error) {
    console.error('TTS error:', error);
    return res.status(500).json({ error: error.message });
  }
}
