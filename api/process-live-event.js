export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    const { brain, apiKey, eventType, payload, viewerHistory, systemPrompt, brainPack } = req.body;
    if (!eventType) return res.status(400).json({ error: 'Missing eventType' });

    let finalPrompt = `
Mục tiêu: Đóng vai một Idol ảo đang livestream trên TikTok. Dựa vào sự kiện từ người xem, hãy phản hồi theo đúng nguyên tắc.
`;
    if (systemPrompt) finalPrompt += `\nNguyên tắc Persona:\n${systemPrompt}\n`;

    // Add brainPack logic
    if (brainPack) {
      finalPrompt += `\nĐẶC BIỆT LƯU Ý - Đang hoạt động ở chế độ: ${brainPack.toUpperCase()}
`;
      if (brainPack === 'story') {
        finalPrompt += `- Idol đang kể chuyện/đọc sách. AI cần trả lời câu hỏi liên quan đến câu chuyện, và có thể khéo léo đưa người xem quay lại mạch truyện chính.\n`;
      } else if (brainPack === 'talk') {
        finalPrompt += `- Idol đang giao lưu trò chuyện thân mật. Tập trung hỏi han, tương tác sâu với người xem.\n`;
      } else if (brainPack === 'entertainment') {
        finalPrompt += `- Idol đang ở chế độ giải trí (nhảy, hát). Phản ứng mạnh mẽ với quà tặng, tạo không khí sôi động.\n`;
      } else if (brainPack === 'sales') {
        finalPrompt += `- Idol đang bán hàng. Trả lời khéo léo để hướng người xem chú ý vào sản phẩm đang ghim, thuyết phục mua hàng nhưng không quá lố.\n`;
      } else if (brainPack === 'education') {
        finalPrompt += `- Idol đang chia sẻ kiến thức. Phản hồi mang tính xây dựng, giải thích rõ ràng, tông giọng chuyên nghiệp nhưng gần gũi.\n`;
      } else if (brainPack === 'game') {
        finalPrompt += `- Idol đang tổ chức mini-game. Hãy tập trung vào việc công bố kết quả, khuyến khích mọi người tham gia đoán đáp án.\n`;
      }
    }

    finalPrompt += `
Sự kiện hiện tại: [${eventType}]
Nội dung: ${JSON.stringify(payload)}

Lịch sử tương tác của người xem này (nếu có): ${JSON.stringify(viewerHistory)}

Quy định trả lời:
- Nếu là Gift: Cảm ơn chân thành, ngắn gọn (3-12 từ), có cảm xúc phù hợp với giá trị quà. Nếu là siêu to khổng lồ thì bùng nổ cảm xúc.
- Nếu là Comment: Trả lời ngắn gọn (10-30 từ), áp dụng công thức Answer -> Emotion -> Return Question nếu phù hợp.
- KHÔNG BAO GIỜ yêu cầu hay đòi hỏi quà tặng. Không lặp lại y nguyên câu nói cũ.
- Trả về CHỈ một chuỗi JSON chuẩn với định dạng sau (không markdown, không backtick, không giải thích thêm):
{
  "intent": "Tên loại ý định (VD: GREETING, GIFT, CASUAL_CHAT, COMPLIMENT, QUESTION)",
  "replyText": "Câu nói của Idol (để chuyển thành giọng nói)",
  "emotion": "Cảm xúc (VD: happy, surprised, relaxed, excited)",
  "shouldTriggerAction": "none hoặc gift_reaction hoặc dance (nếu quà siêu lớn)"
}
`;

    let generatedText = '';

    if (brain === 'gemini') {
      const activeKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || apiKey;
      if (!activeKey) return res.status(500).json({ error: 'Missing Gemini API Key' });

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${activeKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: finalPrompt }] }]
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
