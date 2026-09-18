import { getSalesPrompt } from './_brains/sales.js';
import { getTalkPrompt } from './_brains/talk.js';
import { getDancePrompt } from './_brains/dance.js';
import { getSingPrompt } from './_brains/sing.js';
import { getCustomPrompt } from './_brains/custom.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    const { brain, apiKey, eventType, payload, viewerHistory, systemPrompt, brainPack } = req.body;
    if (!eventType) return res.status(400).json({ error: 'Missing eventType' });

    let finalPrompt = '';

    if (eventType === 'ASSISTANT_PROMPT') {
      finalPrompt = `
SYSTEM PROMPT (Cấu hình nhân vật):
${systemPrompt}

LỊCH SỬ TƯƠNG TÁC GẦN ĐÂY:
${JSON.stringify(viewerHistory)}

====================
LỆNH TỪ TRỢ LÝ/ĐẠO DIỄN: 
${payload.prompt}

Yêu cầu: Bạn HÃY LÀM THEO lệnh trên của trợ lý một cách tự nhiên nhất với tư cách là nhân vật của bạn. Không được nói lộ ra là "trợ lý bảo tôi...".
Trả về ĐÚNG định dạng JSON sau:
{
  "intent": "ASSISTANT_DIRECTIVE",
  "replyText": "[Câu nói tự nhiên của bạn để thực hiện lệnh trợ lý]",
  "emotion": "happy",
  "shouldTriggerAction": "none"
}
`;
    } else if (brainPack === 'sales') {
      finalPrompt = getSalesPrompt(systemPrompt, eventType, payload, viewerHistory);
    } else if (brainPack === 'dance') {
      finalPrompt = getDancePrompt(systemPrompt, eventType, payload, viewerHistory);
    } else if (brainPack === 'sing') {
      finalPrompt = getSingPrompt(systemPrompt, eventType, payload, viewerHistory);
    } else if (brainPack === 'talk') {
      finalPrompt = getTalkPrompt(systemPrompt, eventType, payload, viewerHistory);
    } else {
      // For any custom brain Pack created by user
      finalPrompt = getCustomPrompt(systemPrompt, eventType, payload, viewerHistory);
    }

    let generatedText = '';

    if (brain === 'gemini' || brain === 'avalive') {
      const activeKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || apiKey;
      if (!activeKey) return res.status(500).json({ error: 'Missing Gemini API Key' });

      // Ưu tiên model gemini-1.5-flash: Nhanh nhất (<500ms), thông minh nhất và rẻ nhất cho livestream real-time
      const selectedModel = req.body.model || 'gemini-1.5-flash';
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${activeKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: finalPrompt }] }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 250,
            topP: 0.95
          }
        })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error.message || 'Gemini API Error');
      generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } 
    else if (brain === 'chatgpt') {
      const activeKey = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY || apiKey;
      if (!activeKey) return res.status(500).json({ error: 'Missing OpenAI API Key' });

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: finalPrompt }]
        })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error.message || 'OpenAI API Error');
      generatedText = data.choices?.[0]?.message?.content || '';
    }
    else {
      return res.status(400).json({ error: 'Unsupported AI Brain' });
    }

    // Parse JSON
    let parsedData = { replyText: '' };
    try {
      // Remove backticks if present
      const cleanText = generatedText.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedData = JSON.parse(cleanText);
    } catch(e) {
      // Fallback
      parsedData = {
        intent: 'UNKNOWN',
        replyText: generatedText,
        emotion: 'relaxed',
        shouldTriggerAction: 'none'
      };
    }

    res.status(200).json(parsedData);
  } catch (error) {
    console.error('Process Live Event Error:', error);
    res.status(500).json({ error: error.message || 'Server Error' });
  }
}
