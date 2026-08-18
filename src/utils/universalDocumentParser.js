/**
 * Universal Document Parser for AVA Livestream
 * Supports: .txt, .csv, .json, .md (Markdown), .docx (Word), .pdf (PDF)
 */

/**
 * Clean and normalize text line
 */
export function cleanTextLine(line) {
  if (!line || typeof line !== 'string') return '';
  return line
    .replace(/^(\d+[\.\/\:\-\)]\s*|[\-\*\•\#\>\~]\s*)/, '') // remove markdown bullets / numbers
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
          if (typeof item === 'string') return item;
          if (item && typeof item === 'object') {
            return item.text || item.replyText || item.content || item.name || JSON.stringify(item);
          }
          return String(item);
        }).filter(Boolean);
      } else if (parsed && typeof parsed === 'object') {
        const lines = [];
        Object.values(parsed).forEach(val => {
          if (typeof val === 'string') lines.push(val);
          else if (Array.isArray(val)) val.forEach(v => typeof v === 'string' && lines.push(v));
        });
        if (lines.length > 0) return lines;
      }
    } catch (e) {
      console.warn('JSON parse fallback to line splitting:', e);
    }
  }

  // Markdown (.md) or Text (.txt) or CSV (.csv)
  const rawLines = rawContent.split(/\r?\n/);
  const result = [];

  for (let line of rawLines) {
    line = line.trim();
    if (!line) continue;
    // Skip Markdown code fence block markers like ```
    if (line.startsWith('```')) continue;
    // Skip empty markdown headers
    if (/^#+\s*$/.test(line)) continue;

    result.push(line);
  }

  return result;
}

/**
 * Extract text from DOCX (Word) binary ArrayBuffer
 * DOCX is a zip file containing word/document.xml
 */
export async function parseDocxArrayBuffer(arrayBuffer) {
  try {
    const bytes = new Uint8Array(arrayBuffer);
    
    // Search for XML content in docx container
    // We search for document.xml or text markers <w:t>...</w:t>
    const textDecoder = new TextDecoder('utf-8', { fatal: false });
    const fullText = textDecoder.decode(bytes);
    
    // Extract text inside <w:t>...</w:t> or <w:t xml:space="preserve">...</w:t>
    const matches = fullText.match(/<w:t[^>]*>(.*?)<\/w:t>/g);
    if (matches && matches.length > 0) {
      const extracted = matches
        .map(m => m.replace(/<[^>]+>/g, '').trim())
        .filter(t => t.length > 0);
      
      // Group contiguous fragments by paragraph tags if present or return as lines
      return extracted.join(' ').split(/\r?\n|\.\s+/).filter(l => l.trim().length > 3);
    }

    // Fallback: extract printable strings of length >= 4
    const asciiMatches = fullText.match(/[\p{L}\p{N}\p{P}\s]{5,}/gu);
    if (asciiMatches && asciiMatches.length > 0) {
      return asciiMatches
        .map(s => s.trim())
        .filter(s => s.length > 4 && !s.includes('schemas.openxmlformats') && !s.includes('xmlns:'));
    }
  } catch (err) {
    console.error('Error parsing DOCX:', err);
  }
  return [];
}

/**
 * Extract text from PDF binary ArrayBuffer
 * Parses text objects in PDF streams (BT ... ET, (text) Tj, [(text)] TJ)
 */
export async function parsePdfArrayBuffer(arrayBuffer) {
  try {
    const bytes = new Uint8Array(arrayBuffer);
    const textDecoder = new TextDecoder('latin1');
    const content = textDecoder.decode(bytes);
    
    const lines = [];
    
    // Match text inside parentheses followed by Tj or TJ: e.g., (Sample text) Tj or [(Sample) 10 (text)] TJ
    const tjRegex = /\(([^)]+)\)\s*Tj/g;
    let match;
    while ((match = tjRegex.exec(content)) !== null) {
      const txt = match[1].replace(/\\([()\\])/g, '$1').trim();
      if (txt && txt.length > 1 && !lines.includes(txt)) {
        lines.push(txt);
      }
    }

    // Match array strings in TJ: [ (text1) ... (text2) ] TJ
    const arrayTjRegex = /\[([^\]]+)\]\s*TJ/g;
    while ((match = arrayTjRegex.exec(content)) !== null) {
      const subMatches = match[1].match(/\(([^)]+)\)/g);
      if (subMatches) {
        const fullStr = subMatches
          .map(s => s.slice(1, -1).replace(/\\([()\\])/g, '$1'))
          .join('')
          .trim();
        if (fullStr && fullStr.length > 1) {
          lines.push(fullStr);
        }
      }
    }

    if (lines.length > 0) {
      return lines;
    }

    // Fallback: search for UTF-8 or readable strings
    const utf8Decoder = new TextDecoder('utf-8', { fatal: false });
    const utf8Text = utf8Decoder.decode(bytes);
    const matches = utf8Text.match(/[\p{L}\p{N}\p{P}\s]{6,}/gu);
    if (matches) {
      return matches
        .map(s => s.trim())
        .filter(s => s.length > 4 && !s.startsWith('/Font') && !s.startsWith('/Type') && !s.includes('xref'));
    }
  } catch (err) {
    console.error('Error parsing PDF:', err);
  }
  return [];
}

/**
 * Universal File Reader for any file (.md, .pdf, .docx, .txt, .csv, .json)
 * Returns array of raw string lines
 */
export async function readUniversalFile(file) {
  if (!file) return [];
  const fileName = file.name || '';
  const ext = fileName.split('.').pop()?.toLowerCase() || 'txt';

  if (ext === 'docx') {
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
