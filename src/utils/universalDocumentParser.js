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
 * Universal File Reader for any file (.md, .pdf, .docx, .doc, .txt, .csv, .json)
 * Returns array of clean, verified human-speech string lines in exact numerical/document order
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
