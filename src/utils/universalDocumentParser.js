/**
 * Universal Document Parser for AVA Livestream
 * Supports: .txt, .csv, .json, .md (Markdown), .docx (Word), .pdf (PDF)
 * With strict human-readable text filtering (removes PDF objects, XML tags, binary artifacts)
 */

// List of internal PDF/DOCX/binary garbage keywords to ignore completely
const GARBAGE_PATTERNS = [
  /^\s*\d+\s+\d+\s+obj\b/i,
  /^\s*endobj\b/i,
  /^\s*xref\b/i,
  /^\s*trailer\b/i,
  /^\s*startxref\b/i,
  /^\s*stream\b/i,
  /^\s*endstream\b/i,
  /^\s*\/[A-Z0-9_\-\.]+/i, // /Font, /ColorSpace, /Pattern, /Type, /ProcSet
  /^\s*<<.*>>\s*$/i,
  /^\s*\[.*\]\s*$/i,
  /xmlns\:/i,
  /schemas\.(openxmlformats|microsoft)/i,
  /^\s*\%PDF\-/i,
  /^\s*\%[A-Za-z0-9]+/i,
  /^<[a-zA-Z0-9\:\_\-]+.*>$/,
];

/**
 * Check if a text line is real human speech/sentence
 */
export function isHumanSentence(str) {
  if (!str || typeof str !== 'string') return false;
  const trimmed = str.trim();
  if (trimmed.length < 2) return false;

  // Check against known PDF/DOCX binary garbage
  for (const pattern of GARBAGE_PATTERNS) {
    if (pattern.test(trimmed)) return false;
  }

  // Must contain at least one Vietnamese/Latin letter or word character
  const hasLetters = /[\p{L}]/u.test(trimmed);
  if (!hasLetters) return false;

  // Discard lines that are mostly symbols like "/F1 12 Tf" or "1 0 0 1 50 700 Tm"
  const letterCount = (trimmed.match(/[\p{L}]/gu) || []).length;
  if (letterCount < 2 && trimmed.length > 5) return false;

  return true;
}

/**
 * Clean and normalize text line
 */
export function cleanTextLine(line) {
  if (!line || typeof line !== 'string') return '';
  return line
    .replace(/^(\d+[\.\/\:\-\)]\s*|[\-\*\•\#\>\~]\s*)/, '') // remove markdown bullets / numbers
    .replace(/^["'“”«»]+|["'“”«»]+$/g, '') // remove surrounding quotes
    .trim();
}

/**
 * Extract text lines from plain text, markdown, csv or json string
 */
export function parseTextContent(rawContent, fileExt = 'txt') {
  if (!rawContent || typeof rawContent !== 'string') return [];

  // JSON format
  if (fileExt === 'json') {
    try {
      const parsed = JSON.parse(rawContent);
      if (Array.isArray(parsed)) {
        return parsed.map(item => {
          if (typeof item === 'string') return cleanTextLine(item);
          if (item && typeof item === 'object') {
            const val = item.text || item.replyText || item.content || item.name || item.prompt || JSON.stringify(item);
            return cleanTextLine(val);
          }
          return cleanTextLine(String(item));
        }).filter(isHumanSentence);
      } else if (parsed && typeof parsed === 'object') {
        const lines = [];
        Object.values(parsed).forEach(val => {
          if (typeof val === 'string') lines.push(cleanTextLine(val));
          else if (Array.isArray(val)) val.forEach(v => typeof v === 'string' && lines.push(cleanTextLine(v)));
        });
        if (lines.length > 0) return lines.filter(isHumanSentence);
      }
    } catch (e) {
      console.warn('JSON parse fallback to line splitting:', e);
    }
  }

  // Markdown (.md), Text (.txt), CSV (.csv)
  const rawLines = rawContent.split(/\r?\n/);
  const result = [];

  for (let rawLine of rawLines) {
    let line = rawLine.trim();
    if (!line) continue;
    // Skip Markdown code fence block markers like ```
    if (line.startsWith('```')) continue;
    // Skip empty markdown headers
    if (/^#+\s*$/.test(line)) continue;

    // For CSV: if there are multiple columns separated by comma or semicolon
    if (fileExt === 'csv' && (line.includes(',') || line.includes(';'))) {
      const parts = line.split(/[;,]/).map(p => cleanTextLine(p)).filter(isHumanSentence);
      if (parts.length > 0) {
        result.push(parts.join(' - '));
        continue;
      }
    }

    const cleaned = cleanTextLine(line);
    if (isHumanSentence(cleaned)) {
      result.push(cleaned);
    }
  }

  return result;
}

/**
 * Extract text from DOCX (Word) binary ArrayBuffer
 */
export async function parseDocxArrayBuffer(arrayBuffer) {
  try {
    const bytes = new Uint8Array(arrayBuffer);
    const textDecoder = new TextDecoder('utf-8', { fatal: false });
    const fullText = textDecoder.decode(bytes);
    
    // Extract text specifically inside <w:t>...</w:t> tags
    const matches = fullText.match(/<w:t[^>]*>([^<]+)<\/w:t>/g);
    if (matches && matches.length > 0) {
      const lines = [];
      let currentParagraph = [];

      for (const m of matches) {
        const txt = m.replace(/<[^>]+>/g, '').trim();
        if (txt) {
          currentParagraph.push(txt);
        }
      }

      const combinedText = currentParagraph.join(' ');
      // Split into clean sentence-based lines
      const splitSentences = combinedText.split(/(?<=[.!?\n])\s+/);
      for (const s of splitSentences) {
        const cleaned = cleanTextLine(s);
        if (isHumanSentence(cleaned)) {
          lines.push(cleaned);
        }
      }

      if (lines.length > 0) return lines;
    }
  } catch (err) {
    console.error('Error parsing DOCX:', err);
  }
  return [];
}

/**
 * Extract human text from PDF binary ArrayBuffer
 * Parses text inside Text Blocks (BT ... ET) and extracts readable strings
 */
export async function parsePdfArrayBuffer(arrayBuffer) {
  try {
    const bytes = new Uint8Array(arrayBuffer);
    const textDecoder = new TextDecoder('latin1');
    const content = textDecoder.decode(bytes);
    
    const lines = [];

    // 1. Extract text from Text Blocks: BT ... ET
    const btRegex = /BT([\s\S]*?)ET/g;
    let btMatch;
    while ((btMatch = btRegex.exec(content)) !== null) {
      const block = btMatch[1];
      
      // Extract (text) Tj
      const tjRegex = /\(([^)]+)\)\s*Tj/g;
      let tjMatch;
      let blockText = [];
      while ((tjMatch = tjRegex.exec(block)) !== null) {
        const rawStr = tjMatch[1].replace(/\\([()\\])/g, '$1').trim();
        if (isHumanSentence(rawStr)) {
          blockText.push(rawStr);
        }
      }

      // Extract array [(text1) (text2)] TJ
      const arrayTjRegex = /\[([\s\S]*?)\]\s*TJ/g;
      let arrMatch;
      while ((arrMatch = arrayTjRegex.exec(block)) !== null) {
        const subStrings = arrMatch[1].match(/\(([^)]+)\)/g);
        if (subStrings) {
          const joined = subStrings
            .map(s => s.slice(1, -1).replace(/\\([()\\])/g, '$1'))
            .join('')
            .trim();
          if (isHumanSentence(joined)) {
            blockText.push(joined);
          }
        }
      }

      if (blockText.length > 0) {
        const fullBlock = blockText.join(' ');
        const cleaned = cleanTextLine(fullBlock);
        if (isHumanSentence(cleaned) && !lines.includes(cleaned)) {
          lines.push(cleaned);
        }
      }
    }

    if (lines.length > 0) {
      return lines;
    }

    // 2. Fallback: UTF-8 scan of human words (with strict filter against PDF internal syntax)
    const utf8Decoder = new TextDecoder('utf-8', { fatal: false });
    const utf8Text = utf8Decoder.decode(bytes);
    const rawChunks = utf8Text.split(/\r?\n/);
    
    for (const chunk of rawChunks) {
      const cleaned = cleanTextLine(chunk);
      if (isHumanSentence(cleaned)) {
        lines.push(cleaned);
      }
    }

    return lines;
  } catch (err) {
    console.error('Error parsing PDF:', err);
  }
  return [];
}

/**
 * Universal File Reader for any file (.md, .pdf, .docx, .txt, .csv, .json)
 * Returns array of clean, verified human-speech string lines
 */
export async function readUniversalFile(file) {
  if (!file) return [];
  const fileName = file.name || '';
  const ext = fileName.split('.').pop()?.toLowerCase() || 'txt';

  if (ext === 'docx' || ext === 'doc') {
    const arrayBuffer = await file.arrayBuffer();
    return await parseDocxArrayBuffer(arrayBuffer);
  }

  if (ext === 'pdf') {
    const arrayBuffer = await file.arrayBuffer();
    return await parsePdfArrayBuffer(arrayBuffer);
  }

  // Plain text, Markdown (.md), CSV (.csv), JSON (.json)
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === 'string') {
        resolve(parseTextContent(content, ext));
      } else {
        resolve([]);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsText(file, 'utf-8');
  });
}
