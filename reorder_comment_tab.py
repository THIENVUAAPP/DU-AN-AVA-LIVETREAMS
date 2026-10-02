import re

with open('src/components/genaidol/WorkspaceTacVu.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. DELETE "BƯỚC 2: CHẾ ĐỘ TRẢ LỜI & HÌNH THỨC PHẢN HỒI" (lines ~3113 to ~3300)
# We can find it using regex from "BƯỚC 2: CHẾ ĐỘ TRẢ LỜI & HÌNH THỨC PHẢN HỒI" down to right before "BƯỚC 3"
pattern_b2 = re.compile(r'(\s*\{/\*\s*BƯỚC 2: CHẾ ĐỘ TRẢ LỜI.*?)(?=\s*\{/\*\s*BƯỚC 3:)', re.DOTALL)
content = pattern_b2.sub('', content)

# 2. Extract "BƯỚC 3: XỬ LÝ KHI AI KHÔNG BIẾT" and "BƯỚC 4: CÂU HỎI GỢI MỞ"
pattern_b3 = re.compile(r'(\s*\{/\*\s*BƯỚC 3: Ô CẤU HÌNH XỬ LÝ.*?)(?=\s*\{/\*\s*BƯỚC 4:)', re.DOTALL)
m3 = pattern_b3.search(content)
block_b3 = m3.group(1) if m3 else ''

pattern_b4 = re.compile(r'(\s*\{/\*\s*BƯỚC 4: THÊM CÂU HỎI GỢI MỞ.*?)(?=\s*\{/\*\s*TÍCH HỢP WORKSPACE KEYWORD PANEL)', re.DOTALL)
m4 = pattern_b4.search(content)
block_b4 = m4.group(1) if m4 else ''

# Extract WorkspaceKeywordPanel
pattern_kw = re.compile(r'(\s*\{/\*\s*TÍCH HỢP WORKSPACE KEYWORD PANEL.*?)(?=\s*\{selectedEventId === \'idle\' &&)', re.DOTALL)
m_kw = pattern_kw.search(content)
block_kw = m_kw.group(1) if m_kw else ''

# Delete them from their original positions
content = pattern_b3.sub('', content)
content = pattern_b4.sub('', content)
content = pattern_kw.sub('', content)

# Now, right after "BƯỚC 1" (which ends before where BƯỚC 2 was), we insert:
# block_kw (as Step 2)
# block_b4 (as Step 3)
# block_b3 (as Step 4)

# Let's find BƯỚC 1 end. It ends with:
#                                 </p>
#                               </div>
#                             </div>
#                           </div>
# And then we had BƯỚC 2 (which we deleted), so now it goes straight to:
#                           {selectedEventId === 'idle' && (
pattern_insert = re.compile(r'(\s*\{/\*\s*BƯỚC 1: ĐỌC LẠI BÌNH LUẬN.*?\n\s*</div>\n\s*</div>\n\s*</div>)', re.DOTALL)

def replace_steps(match):
    original_b1 = match.group(1)
    
    # Modify BƯỚC 3 and BƯỚC 4 titles
    new_kw = block_kw.replace('TÍCH HỢP WORKSPACE KEYWORD PANEL CHO TAB BÌNH LUẬN', 'BƯỚC 2: TRẢ LỜI THEO TỪ KHÓA & BỘ NÃO AI')
    new_kw = new_kw.replace('<div className="mt-4 pt-4 border-t border-gray-200">', '<div className="mt-4">')
    
    new_b4 = block_b4.replace('BƯỚC 4:', 'BƯỚC 3:')
    new_b4 = new_b4.replace('w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">4</span>', 'w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">3</span>')
    
    new_b3 = block_b3.replace('BƯỚC 3:', 'BƯỚC 4:')
    new_b3 = new_b3.replace('w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] font-bold">3</span>', 'w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] font-bold">4</span>')
    
    return original_b1 + new_kw + new_b4 + new_b3

content = pattern_insert.sub(replace_steps, content)

# 3. Hide aiPrompt and sampleAnswers for 'comment'
# Replace: {currentConfig.aiPrompt !== undefined && selectedEventId !== 'idle' && selectedEventId !== 'apology' && selectedEventId !== 'welcome' && (
# With: {currentConfig.aiPrompt !== undefined && selectedEventId !== 'idle' && selectedEventId !== 'apology' && selectedEventId !== 'welcome' && selectedEventId !== 'comment' && (
content = content.replace(
    "{currentConfig.aiPrompt !== undefined && selectedEventId !== 'idle' && selectedEventId !== 'apology' && selectedEventId !== 'welcome' && (",
    "{currentConfig.aiPrompt !== undefined && selectedEventId !== 'idle' && selectedEventId !== 'apology' && selectedEventId !== 'welcome' && selectedEventId !== 'comment' && ("
)

# Replace: {currentConfig.sampleAnswers !== undefined && selectedEventId !== 'idle' && (
# With: {currentConfig.sampleAnswers !== undefined && selectedEventId !== 'idle' && selectedEventId !== 'comment' && (
content = content.replace(
    "{currentConfig.sampleAnswers !== undefined && selectedEventId !== 'idle' && (",
    "{currentConfig.sampleAnswers !== undefined && selectedEventId !== 'idle' && selectedEventId !== 'comment' && ("
)

# 4. Hide "Cài đặt trợ lý" (useAssistant) for 'comment'
# Find: {currentConfig.useAssistant !== undefined && (
# Replace: {currentConfig.useAssistant !== undefined && selectedEventId !== 'comment' && (
content = content.replace(
    "{currentConfig.useAssistant !== undefined && (",
    "{currentConfig.useAssistant !== undefined && selectedEventId !== 'comment' && ("
)

with open('src/components/genaidol/WorkspaceTacVu.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
