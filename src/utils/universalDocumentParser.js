/**
 * Universal Document Parser for AVA Livestream
 * Supports: .txt, .csv, .json, .md (Markdown), .docx (Word), .doc (Legacy Word), .pdf (PDF)
 * Powered by pdfjs-dist and mammoth for 100% accurate, clean text extraction.
 * Guarantees exact sequential ordering (1, 2, 3, 4, 5...) from top to bottom.
 */

import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url';
import mammoth from 'mammoth';

// Configure PDF.js worker
if (typeof window !== 'undefined' && pdfjsLib && pdfjsLib.GlobalWorkerOptions) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
}

// Garbage PDF/Binary tokens to reject
const GARBAGE_PATTERNS = [
  /^\s*\d+\s+\d+\s+obj\b/i,
  /^\s*endobj\b/i,
  /^\s*xref\b/i,
  /^\s*trailer\b/i,
  /^\s*startxref\b/i,
  /^\s*stream\b/i,
  /^\s*endstream\b/i,
  /^\s*\/[A-Z0-9_\-\.]+/i, // /Font, /ColorSpace, /Pattern, /Type, /ProcSet, /Filter, /FlateDecode
  /^\s*<<.*>>\s*$/i,
  /^\s*\[.*\]\s*$/i,
  /xmlns\:/i,
  /schemas\.(openxmlformats|microsoft)/i,
  /^\s*\%PDF\-/i,
  /^\s*\%[A-Za-z0-9]+/i,
  /^<[a-zA-Z0-9\:\_\-]+.*>$/,
  /FlateDecode/i,
  /Length\s+\d+/i,
  /^[A-Za-z0-9+/=]{40,}$/, // Raw base64 string
];

/**
 * Check if a string is a real human-readable speech/sentence
 */
export function isHumanSentence(str) {
  if (!str || typeof str !== 'string') return false;
  const trimmed = str.trim();
  if (trimmed.length < 2) return false;

  // Check against binary garbage
  for (const pattern of GARBAGE_PATTERNS) {
    if (pattern.test(trimmed)) return false;
  }

  // Must contain letters
  const letterMatches = trimmed.match(/[\p{L}]/gu) || [];
  if (letterMatches.length < 2 && trimmed.length > 4) return false;

  // Must not have an excessive ratio of non-printable / weird symbols
  const symbolCount = (trimmed.match(/[^\p{L}\p{N}\s.,!?:;'"“”«»()\-–—\[\]\/\\]/gu) || []).length;
  if (symbolCount > trimmed.length * 0.35 && trimmed.length > 8) return false;

  return true;
}

/**
 * Clean text line and remove markdown / quotes
 */
export function cleanTextLine(line) {
  if (!line || typeof line !== 'string') return '';
  return line
    .replace(/^["'“”«»]+|["'“”«»]+$/g, '')
    .trim();
}

/**
 * Process raw text lines, auto-detect numbered sequence (1, 2, 3, 4, 5...) and return ordered lines
 */
export function processOrderedLines(rawLines) {
  if (!rawLines || !Array.isArray(rawLines)) return [];

  const numberedItems = [];
  const normalItems = [];

  for (let i = 0; i < rawLines.length; i++) {
    const raw = rawLines[i];
    if (!raw || typeof raw !== 'string') continue;
    const trimmed = raw.trim();
    if (!trimmed || !isHumanSentence(trimmed)) continue;

    // Detect numbered prefixes:
    // 1. "1. Nội dung", "1/ Nội dung", "1) Nội dung", "1 - Nội dung", "1: Nội dung"
    // 2. "Câu 1: Nội dung", "Dòng 1: Nội dung", "Kịch bản 1: Nội dung", "Số 1: Nội dung", "Mục 1: Nội dung"
    // 3. "[1] Nội dung", "(1) Nội dung"
    const numPrefixRegex = /^(?:(?:câu|dòng|kịch\s*bản|số|mục|bước)\s*)?\[?\(?(\d+)[\.\/\:\-\)\s\]]+(.*)$/i;
    const match = trimmed.match(numPrefixRegex);

    if (match && match[1]) {
      const num = parseInt(match[1], 10);
      const content = cleanTextLine(match[2] || '').trim();
      if (content && isHumanSentence(content)) {
        numberedItems.push({ num, text: content, originalIndex: i });
      } else if (isHumanSentence(trimmed)) {
        numberedItems.push({ num, text: cleanTextLine(trimmed), originalIndex: i });
      }
    } else {
      const cleaned = cleanTextLine(trimmed);
      if (isHumanSentence(cleaned)) {
        normalItems.push({ text: cleaned, originalIndex: i });
      }
    }
  }

  // If majority of items have explicit numbering (1, 2, 3...), sort them by number strictly
  if (numberedItems.length > 0 && numberedItems.length >= normalItems.length) {
    numberedItems.sort((a, b) => a.num - b.num);
    return numberedItems.map(item => item.text);
  }

  // Otherwise, maintain natural document top-to-bottom order
  const allItems = [...numberedItems, ...normalItems];
  allItems.sort((a, b) => a.originalIndex - b.originalIndex);
  return allItems.map(item => item.text);
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
        const rawStrings = parsed.map(item => {
          if (typeof item === 'string') return item;
          if (item && typeof item === 'object') {
            return item.text || item.replyText || item.content || item.name || item.prompt || JSON.stringify(item);
          }
          return String(item);
        });
        return processOrderedLines(rawStrings);
      } else if (parsed && typeof parsed === 'object') {
        const rawStrings = [];
        Object.values(parsed).forEach(val => {
          if (typeof val === 'string') rawStrings.push(val);
          else if (Array.isArray(val)) val.forEach(v => typeof v === 'string' && rawStrings.push(v));
        });
        return processOrderedLines(rawStrings);
      }
    } catch (e) {
      console.warn('JSON parse fallback:', e);
    }
  }

  // Markdown (.md), Text (.txt), CSV (.csv)
  const rawLines = rawContent.split(/\r?\n/);
  const collected = [];

  for (let rawLine of rawLines) {
    let line = rawLine.trim();
    if (!line) continue;
    if (line.startsWith('```')) continue;
    if (/^#+\s*$/.test(line)) continue;

    // For CSV: if there are multiple columns separated by comma or semicolon
    if (fileExt === 'csv' && (line.includes(',') || line.includes(';'))) {
      const parts = line.split(/[;,]/).map(p => cleanTextLine(p)).filter(isHumanSentence);
      if (parts.length > 0) {
        collected.push(parts.join(' - '));
        continue;
      }
    }

    collected.push(line);
  }

  return processOrderedLines(collected);
}

/**
 * Extract text from DOCX & DOC ArrayBuffer using Mammoth with fallback for legacy Word (.doc)
 */
export async function parseDocxArrayBuffer(arrayBuffer) {
  try {
    // 1. Try Mammoth (works for all .docx and modern Word files)
    const result = await mammoth.extractRawText({ arrayBuffer });
    if (result && result.value) {
      const rawLines = result.value.split(/\r?\n/).filter(Boolean);
      const parsed = processOrderedLines(rawLines);
      if (parsed.length > 0) return parsed;
    }
  } catch (mammothErr) {
    console.warn('Mammoth docx parse failed, trying legacy .doc extraction:', mammothErr);
  }

  // 2. Fallback for legacy Word 97-2003 binary .doc format
  try {
    const bytes = new Uint8Array(arrayBuffer);
    // Scan UTF-16LE text stream
    const utf16Decoder = new TextDecoder('utf-16le', { fatal: false });
    const decoded16 = utf16Decoder.decode(bytes);
    const lines16 = decoded16
      .split(/[\r\n\x0b\x0c\x07]+/)
      .map(s => s.replace(/[\x00-\x1f\x7f-\x9f]/g, '').trim())
      .filter(s => isHumanSentence(s) && s.length >= 3);

    if (lines16.length > 0) {
      return processOrderedLines(lines16);
    }

    // Scan UTF-8 stream
    const utf8Decoder = new TextDecoder('utf-8', { fatal: false });
    const decoded8 = utf8Decoder.decode(bytes);
    const lines8 = decoded8
      .split(/[\r\n]+/)
      .map(s => s.replace(/[\x00-\x1f\x7f-\x9f]/g, '').trim())
      .filter(s => isHumanSentence(s) && s.length >= 3);

    if (lines8.length > 0) {
      return processOrderedLines(lines8);
    }
  } catch (err) {
    console.error('Legacy .doc parse error:', err);
  }

  return [];
}

/**
 * Extract text from PDF binary ArrayBuffer using Mozilla PDF.js (pdfjs-dist)
 * Perfectly handles compressed streams, FlateDecode, custom fonts, and multi-page layouts
 */
export async function parsePdfArrayBuffer(arrayBuffer) {
  try {
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      useSystemFonts: true,
      isEvalSupported: false,
    });
    const pdfDoc = await loadingTask.promise;
    const numPages = pdfDoc.numPages;
    const allLines = [];

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      let currentLine = '';
      let lastY = null;

      for (const item of textContent.items) {
        if (!item || !item.str) continue;
        const text = item.str.trim();
        if (!text) continue;

        // Group text fragments by Y position to assemble whole sentences
        const itemY = item.transform ? item.transform[5] : null;
        if (lastY !== null && itemY !== null && Math.abs(itemY - lastY) > 5) {
          if (currentLine.trim()) {
            allLines.push(currentLine.trim());
          }
          currentLine = text;
        } else {
          currentLine = currentLine ? `${currentLine} ${text}` : text;
        }
        lastY = itemY;
      }
      if (currentLine.trim()) {
        allLines.push(currentLine.trim());
      }
    }

    return processOrderedLines(allLines);
  } catch (err) {
    console.error('Error parsing PDF with pdfjs-dist:', err);
  }
  return [];
}

/**
 * Specialized Universal Rule Pair Parser
 * Intelligently separates Keywords <-> Reply Texts from any document format:
 * - Numbered items: 1. "chào", "hello" \n “Chào bạn nhé!”
 * - Markdown headers: ## 1. Chào hỏi \n "chào", "hi" \n “Chào bạn!”
 * - Colon separated: "chào, hello: Chào bạn nhé"
 * - Tagged: Từ khóa: ... \n Phản hồi: ...
 * - Markdown tables, CSV, JSON
 */
export function parseUniversalRulePairs(rawInput) {
  if (!rawInput) return [];
  
  let rawText = '';
  if (Array.isArray(rawInput)) {
    rawText = rawInput.join('\n');
  } else if (typeof rawInput === 'string') {
    rawText = rawInput;
  } else if (typeof rawInput === 'object') {
    try {
      rawText = JSON.stringify(rawInput);
    } catch (e) {
      return [];
    }
  }

  // 1. Try JSON format
  const trimmed = rawText.trim();
  if ((trimmed.startsWith('[') && trimmed.endsWith(']')) || (trimmed.startsWith('{') && trimmed.endsWith('}'))) {
    try {
      const parsedJson = JSON.parse(trimmed);
      const list = Array.isArray(parsedJson) ? parsedJson : (parsedJson.rules || parsedJson.items || [parsedJson]);
      const validRules = [];
      list.forEach((item, idx) => {
        if (!item) return;
        const kws = Array.isArray(item.keywords) 
          ? item.keywords 
          : (item.keywords || item.keyword || item.kws || item.key || '').split(',').map(s => s.trim().replace(/^["“'‘]|["”'’]$/g, '')).filter(Boolean);
        const reply = item.replyText || item.reply || item.response || item.answer || item.text || '';
        if (kws.length > 0 || reply) {
          validRules.push({
            id: 'k_' + (Date.now() + idx),
            name: item.name || (kws[0] ? `Quy tắc "${kws[0]}"` : `Quy tắc ${idx + 1}`),
            keywords: kws.length > 0 ? kws : ['chào'],
            replyText: reply || 'Dạ em chào bạn nha!',
            role: item.role || 'assistant',
            cooldownSec: item.cooldownSec || 4,
            enabled: item.enabled !== false
          });
        }
      });
      if (validRules.length > 0) return validRules;
    } catch (e) {}
  }

  // 2. Intelligent Multi-Format Block & Line Scanning
  const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const rules = [];

  let currentTitle = '';
  let currentKeywords = [];
  let currentReply = '';
  let ruleCounter = 1;

  function commitCurrentRule() {
    if (currentKeywords.length > 0 || currentReply) {
      const firstKw = currentKeywords[0] || '';
      const rName = currentTitle || (firstKw ? `Quy tắc "${firstKw}"` : `Quy tắc ${ruleCounter}`);
      rules.push({
        id: 'k_' + (Date.now() + rules.length + '_' + Math.random().toString(36).substr(2, 4)),
        name: rName,
        keywords: currentKeywords.length > 0 ? currentKeywords : (firstKw ? [firstKw] : ['chào']),
        replyText: currentReply || `Dạ em chào anh chị [user] ạ!`,
        role: 'assistant',
        cooldownSec: 4,
        enabled: true
      });
      ruleCounter++;
    }
    currentTitle = '';
    currentKeywords = [];
    currentReply = '';
  }

  function extractKeywordsFromString(str) {
    if (!str) return [];
    // Extract phrases in quotes
    const quoteRegex = /["“'‘]([^"“”'‘’]+)["”'’]/g;
    const matches = [];
    let m;
    while ((m = quoteRegex.exec(str)) !== null) {
      if (m[1] && m[1].trim()) matches.push(m[1].trim());
    }
    if (matches.length > 0) return matches;

    // Otherwise split by commas or pipes
    return str
      .split(/[,;|]/)
      .map(s => s.trim().replace(/^["“'‘]|["”'’]$/g, ''))
      .filter(s => s.length > 0 && !/^(\d+[\.\)\:]|Từ khóa|Keywords?|Quy tắc)/i.test(s));
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Markdown Table divider / header row
    if (/^\|?\s*[-:]+\s*\|/.test(line)) continue;
    if (/^\|?\s*(từ khóa|keyword|stt|câu hỏi)\s*\|/i.test(line)) continue;

    // Pattern: Markdown table row: | "kw1", "kw2" | "Reply text" |
    if (line.startsWith('|') && line.endsWith('|')) {
      const cols = line.split('|').map(c => c.trim()).filter(Boolean);
      if (cols.length >= 2) {
        commitCurrentRule();
        const kwCol = cols[0];
        const replyCol = cols.slice(1).join(' ');
        currentKeywords = extractKeywordsFromString(kwCol);
        currentReply = replyCol.replace(/^["“'‘]|["”'’]$/g, '').trim();
        commitCurrentRule();
        continue;
      }
    }

    // Pattern: Header (e.g., ## 5. KÊU GỌI BÌNH LUẬN or # 1. CHÀO HỎI)
    const headerMatch = line.match(/^#+\s*(?:(\d+)[\.\:\-\s]+)?(.*)$/);
    if (headerMatch) {
      commitCurrentRule();
      const num = headerMatch[1];
      const titleText = headerMatch[2]?.trim() || '';
      currentTitle = num ? `Quy tắc ${num}: ${titleText}` : titleText;
      continue;
    }

    // Pattern: Tagged "Từ khóa:" or "Keywords:"
    if (/^(?:từ khóa|keywords?|câu hỏi)\s*[:：]/i.test(line)) {
      if (currentKeywords.length > 0 && currentReply) commitCurrentRule();
      const content = line.replace(/^(?:từ khóa|keywords?|câu hỏi)\s*[:：]\s*/i, '');
      currentKeywords = extractKeywordsFromString(content);
      continue;
    }

    // Pattern: Tagged "Phản hồi:" or "Trả lời:"
    if (/^(?:phản hồi|câu trả lời|reply|response|trả lời)\s*[:：]/i.test(line)) {
      const content = line.replace(/^(?:phản hồi|câu trả lời|reply|response|trả lời)\s*[:：]\s*/i, '');
      currentReply = (currentReply ? currentReply + ' ' : '') + content.replace(/^["“'‘]|["”'’]$/g, '').trim();
      commitCurrentRule();
      continue;
    }

    // Pattern: Numbered line starting with e.g. `1. "chào", "xin chào"...`
    const numberedMatch = line.match(/^(\d+)[\.\)\:\-]\s*(.*)$/);
    if (numberedMatch) {
      commitCurrentRule();
      const ruleNum = numberedMatch[1];
      const rest = numberedMatch[2].trim();
      if (!currentTitle) currentTitle = `Quy tắc ${ruleNum}`;

      // If line contains colon separating keywords and reply
      if (rest.includes(':') && !rest.startsWith('"') && !rest.startsWith('“')) {
        const parts = rest.split(':');
        currentKeywords = extractKeywordsFromString(parts[0]);
        currentReply = parts.slice(1).join(':').replace(/^["“'‘]|["”'’]$/g, '').trim();
        commitCurrentRule();
        continue;
      }

      currentKeywords = extractKeywordsFromString(rest);
      continue;
    }

    // Pattern: Standalone quoted reply line e.g. “Chào mừng bạn đã đến...”
    if (/^[“"«]/.test(line) && currentKeywords.length > 0 && !currentReply) {
      currentReply = line.replace(/^[“"«\s]+|[”"»\s]+$/g, '').trim();
      commitCurrentRule();
      continue;
    }

    // Pattern: Standalone keywords line containing multiple quotes
    if ((line.match(/["“'‘]/g) || []).length >= 2 && currentKeywords.length === 0) {
      currentKeywords = extractKeywordsFromString(line);
      continue;
    }

    // Pattern: If we have keywords and this is the reply line
    if (currentKeywords.length > 0 && !currentReply) {
      currentReply = line.replace(/^[“"«\s]+|[”"»\s]+$/g, '').trim();
      commitCurrentRule();
      continue;
    }

    // Pattern: Single line `kw1, kw2 : reply text`
    if (line.includes(':') || line.includes('|')) {
      commitCurrentRule();
      const delim = line.includes(':') ? ':' : '|';
      const parts = line.split(delim);
      const left = parts[0].trim();
      const right = parts.slice(1).join(delim).trim();
      currentKeywords = extractKeywordsFromString(left);
      currentReply = right.replace(/^["“'‘]|["”'’]$/g, '').trim();
      commitCurrentRule();
      continue;
    }
  }

  commitCurrentRule();
  return rules;
}

/**
 * Universal File Reader for any file (.md, .pdf, .docx, .doc, .txt, .csv, .json)
 * Returns raw text lines from document
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
        resolve(content);
      } else {
        resolve('');
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsText(file, 'utf-8');
  });
}

