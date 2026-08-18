export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // Support GET proxy for quick direct audio stream
  if (req.method === 'GET') {
    try {
      const text = req.query.text || 'Chào bạn';
      const lang = req.query.lang || 'vi';
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${encodeURIComponent(lang)}&q=${encodeURIComponent(text.slice(0, 200))}`;
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': 'https://translate.google.com/'
        }
      });
      if (!response.ok) throw new Error(`Google TTS status: ${response.status}`);
      const buffer = await response.arrayBuffer();
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return res.status(200).send(Buffer.from(buffer));
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    const { text, platform, lang = 'vi', apiKey: clientApiKey } = req.body;
    if (!text) return res.status(400).json({ error: 'Missing text' });

    let audioBase64 = null;

    // 1. FREE TTS PROXY (Google / Edge Free)
    if (!platform || platform === 'free' || platform === 'google' || platform === 'edge') {
      try {
        const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${encodeURIComponent(lang)}&q=${encodeURIComponent(text.slice(0, 200))}`;
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Referer': 'https://translate.google.com/'
          }
        });
        if (response.ok) {
          const buffer = await response.arrayBuffer();
          audioBase64 = Buffer.from(buffer).toString('base64');
          return res.status(200).json({ audioBase64, format: 'audio/mpeg' });
        }
      } catch (err) {
        console.warn('Free TTS fetch warning:', err);
      }
    }

    // 2. OPENAI TTS
    if (platform === 'openai_tts' || platform === 'openai') {
      const apiKey = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY || clientApiKey;
      if (!apiKey) return res.status(503).json({ error: 'Vui lòng kiểm tra lại cấu hình OPENAI_API_KEY trên Vercel.' });
      
      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'tts-1',
          input: text,
          voice: req.body.voiceId || 'alloy'
        })
      });
      
      if (!response.ok) throw new Error('OpenAI TTS Error: ' + await response.text());
      const buffer = await response.arrayBuffer();
      audioBase64 = Buffer.from(buffer).toString('base64');
    } 
    // 3. GEMINI TTS
    else if (platform === 'gemini') {
      const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || clientApiKey;
      if (!apiKey) return res.status(503).json({ error: 'Vui lòng kiểm tra lại cấu hình GEMINI_API_KEY trên Vercel.' });
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text }] }],
          generationConfig: {
            responseModalities: ['AUDIO'],
            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: req.body.voiceId || 'Kore' } } }
          }
        })
      });
      
      if (!response.ok) throw new Error('Gemini TTS Error: ' + await response.text());
      const data = await response.json();
      audioBase64 = data?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!audioBase64) throw new Error('No audio returned from Gemini');
    } 
    // 4. ELEVENLABS TTS
    else if (platform === 'elevenlabs') {
      const apiKey = process.env.ELEVENLABS_API_KEY || process.env.VITE_ELEVENLABS_API_KEY || clientApiKey;
      if (!apiKey) return res.status(503).json({ error: 'Vui lòng kiểm tra lại cấu hình ELEVENLABS_API_KEY trên Vercel.' });
      
      const voiceId = req.body.voiceId || '21m00Tcm4TlvDq8ikWAM';
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
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
    // 5. MINIMAX TTS
    else if (platform === 'minimax') {
      const apiKey = process.env.MINIMAX_API_KEY || process.env.VITE_MINIMAX_API_KEY || clientApiKey;
      const groupId = process.env.MINIMAX_GROUP_ID || process.env.VITE_MINIMAX_GROUP_ID || req.body.groupId;
      if (!apiKey) return res.status(503).json({ error: 'Vui lòng kiểm tra lại cấu hình MINIMAX_API_KEY trên Vercel.' });
      
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
      // Fallback to Google Free TTS
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${encodeURIComponent(lang)}&q=${encodeURIComponent(text.slice(0, 200))}`;
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': 'https://translate.google.com/'
        }
      });
      if (response.ok) {
        const buffer = await response.arrayBuffer();
        audioBase64 = Buffer.from(buffer).toString('base64');
      } else {
        return res.status(400).json({ error: 'Unsupported TTS platform' });
      }
    }

    return res.status(200).json({ audioBase64 });
  } catch (error) {
    console.error('TTS error:', error);
    return res.status(500).json({ error: error.message });
  }
}
