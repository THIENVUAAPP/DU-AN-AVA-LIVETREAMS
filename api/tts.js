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
    else if (platform === 'elevenlabs') {
      const apiKey = process.env.ELEVENLABS_API_KEY || clientApiKey;
      if (!apiKey) return res.status(503).json({ error: 'ELEVENLABS_API_KEY is not set' });
      
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${req.body.voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'xi-api-key': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: { stability: 0.5, similarity_boost: 0.75 }
        })
      });
      if (!response.ok) throw new Error('ElevenLabs TTS Error: ' + await response.text());
      const buffer = await response.arrayBuffer();
      audioBase64 = Buffer.from(buffer).toString('base64');
    }
    else if (platform === 'minimax') {
      const apiKey = process.env.MINIMAX_API_KEY || clientApiKey;
      const groupId = process.env.MINIMAX_GROUP_ID || req.body.groupId || '';
      if (!apiKey) return res.status(503).json({ error: 'MINIMAX_API_KEY is not set' });
      
      let url = 'https://api.minimaxi.chat/v1/t2a_v2';
      if (groupId) {
        url += `?GroupId=${groupId}`;
      }
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'speech-01-hd',
          text,
          stream: false,
          voice_setting: {
            voice_id: req.body.voiceId || 'male-qn-qingse',
            speed: 1.0,
            vol: 1.0,
            pitch: 0
          },
          audio_setting: {
            audio_format: 'mp3',
            sample_rate: 32000,
            bitrate: 128000
          }
        })
      });
      
      if (!response.ok) throw new Error('MiniMax TTS Error: ' + await response.text());
      const data = await response.json();
      if (data.base_resp && data.base_resp.status_code !== 0) {
        throw new Error('MiniMax TTS Error: ' + data.base_resp.status_msg);
      }
      if (data.data && data.data.audio) {
        audioBase64 = Buffer.from(data.data.audio, 'hex').toString('base64');
      } else {
        throw new Error('No audio returned from MiniMax');
      }
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
