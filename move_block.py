import re

with open('src/components/genaidol/WorkspaceTacVu.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern for Block A
pattern_a = re.compile(r'(\s*\{/\*\s*Cấu hình tương tác Bình luận Thông minh.*?\}\)\n)', re.DOTALL)
m = pattern_a.search(content)

if m:
    block_a = m.group(1)
    
    # Remove Block A from its current position
    content = pattern_a.sub('', content)
    
    # Pattern for end of Block B
    # Block B ends with maxRepeatChars input and `</>\n)}`
    pattern_b_end = re.compile(r'(\s*<FieldLabel icon="🔤" text="Tỷ lệ ký tự lặp lại tối đa \(0\.0-1\.0\)" helpKey="maxRepeatChars" />.*?</div>\n\s*</>\n\s*\)\}\n)', re.DOTALL)
    
    # Insert Block A after Block B
    def insert_after_b(match):
        return match.group(1) + "\n" + block_a
        
    content = pattern_b_end.sub(insert_after_b, content)
    
    with open('src/components/genaidol/WorkspaceTacVu.jsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Move successful")
else:
    print("Could not find Block A")

