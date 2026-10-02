import re

with open('src/components/genaidol/WorkspaceTacVu.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# --- 1. DELETE BƯỚC 2 ---
pattern_b2 = re.compile(r'(\s*\{/\*\s*BƯỚC 2: CHẾ ĐỘ TRẢ LỜI.*?)(?=\s*\{/\*\s*BƯỚC 3: Ô CẤU HÌNH XỬ LÝ)', re.DOTALL)
content = pattern_b2.sub('', content)

# --- 2. EXTRACT BƯỚC 3 (Fallback) AND BƯỚC 4 (Followup) ---
pattern_b3 = re.compile(r'(\s*\{/\*\s*BƯỚC 3: Ô CẤU HÌNH XỬ LÝ.*?)(?=\s*\{/\*\s*BƯỚC 4: THÊM CÂU HỎI)', re.DOTALL)
m3 = pattern_b3.search(content)
block_b3 = m3.group(1) if m3 else ''
content = pattern_b3.sub('', content)

pattern_b4 = re.compile(r'(\s*\{/\*\s*BƯỚC 4: THÊM CÂU HỎI GỢI MỞ.*?)(?=\s*</div>\n\s*\)\}\n\n\s*\{currentConfig\.videoCategory)', re.DOTALL)
m4 = pattern_b4.search(content)
block_b4 = m4.group(1) if m4 else ''
content = pattern_b4.sub('', content)

# --- 3. EXTRACT WORKSPACE KEYWORD PANEL ---
pattern_kw = re.compile(r'(\s*\{/\*\s*TÍCH HỢP WORKSPACE KEYWORD PANEL.*?)(?=\s*\{selectedEventId === \'idle\' &&)', re.DOTALL)
m_kw = pattern_kw.search(content)
block_kw = m_kw.group(1) if m_kw else ''
content = pattern_kw.sub('', content)

# --- 4. RENAME TITLES ---
block_kw = block_kw.replace('TÍCH HỢP WORKSPACE KEYWORD PANEL CHO TAB BÌNH LUẬN', 'BƯỚC 2: TRẢ LỜI THEO TỪ KHÓA & BỘ NÃO AI')
block_kw = block_kw.replace('<div className="mt-4 pt-4 border-t border-gray-200">', '<div className="mt-4">')

block_b4 = block_b4.replace('BƯỚC 4:', 'BƯỚC 3:')
block_b4 = block_b4.replace('w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">4</span>', 'w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">3</span>')

block_b3 = block_b3.replace('BƯỚC 3:', 'BƯỚC 4:')
block_b3 = block_b3.replace('w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px] font-bold">3</span>', 'w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px] font-bold">4</span>')

# --- 5. INSERT AFTER "GIÃN CÁCH TRẢ LỜI BÌNH LUẬN & BỘ LỌC SPAM THÔNG MINH" ---
# Wait, look at where BƯỚC 2 was before. It was right after the "GIÃN CÁCH TRẢ LỜI BÌNH LUẬN" block!
# Let's insert block_kw + block_b4 + block_b3 back to where BƯỚC 2 was (or where BƯỚC 3 used to start).
# Since I deleted BƯỚC 2, BƯỚC 3, BƯỚC 4, the end of the "GIÃN CÁCH TRẢ LỜI" block is now immediately followed by `</div>\n                      )}`
# Wait! Let's insert them right before `</div>\n                      )}\n\n                      {currentConfig.videoCategory`
pattern_insert = re.compile(r'(\s*</div>\n\s*\)\}\n\n\s*\{currentConfig\.videoCategory)', re.DOTALL)
content = pattern_insert.sub(block_kw + block_b4 + block_b3 + r'\1', content)

# --- 6. HIDE aiPrompt AND sampleAnswers AND useAssistant FOR COMMENT ---
content = content.replace(
    "{currentConfig.aiPrompt !== undefined && selectedEventId !== 'idle' && selectedEventId !== 'apology' && selectedEventId !== 'welcome' && (",
    "{currentConfig.aiPrompt !== undefined && selectedEventId !== 'idle' && selectedEventId !== 'apology' && selectedEventId !== 'welcome' && selectedEventId !== 'comment' && ("
)
content = content.replace(
    "{currentConfig.sampleAnswers !== undefined && selectedEventId !== 'idle' && (",
    "{currentConfig.sampleAnswers !== undefined && selectedEventId !== 'idle' && selectedEventId !== 'comment' && ("
)
content = content.replace(
    "{currentConfig.useAssistant !== undefined && (",
    "{currentConfig.useAssistant !== undefined && selectedEventId !== 'comment' && ("
)

with open('src/components/genaidol/WorkspaceTacVu.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
