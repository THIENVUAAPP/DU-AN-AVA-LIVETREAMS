with open('src/components/genaidol/WorkspaceTacVu.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

start_a = content.find("{/* Cấu hình tương tác Bình luận Thông minh 4 bước Đỉnh Cao */}")
end_a = content.find("{currentConfig.videoCategory !== undefined && (", start_a)

# We need to backtrack from end_a to find the closing `)}`
# The block ends with:
#                         </div>
#                       )}
#
#                       {currentConfig.videoCategory
text_before_end_a = content[:end_a]
# find the last `)}` before end_a
last_bracket = text_before_end_a.rfind(")}")

if start_a != -1 and last_bracket != -1:
    # get the exact block a including the `)}`
    # We backtrack to the beginning of the line for start_a
    line_start_a = content.rfind("\n", 0, start_a)
    block_a = content[line_start_a:last_bracket + 2]
    
    # remove block_a from content
    content = content[:line_start_a] + content[last_bracket + 2:]
    
    # now find end of block B
    start_b = content.find('helpKey="maxRepeatChars"')
    if start_b != -1:
        # find the `)}` after start_b
        end_b = content.find(")}", start_b)
        if end_b != -1:
            # insert block_a after end_b
            content = content[:end_b + 2] + "\n" + block_a + content[end_b + 2:]
            
            with open('src/components/genaidol/WorkspaceTacVu.jsx', 'w', encoding='utf-8') as f:
                f.write(content)
            print("Move successful")
        else:
            print("Could not find end of Block B")
    else:
        print("Could not find Block B")
else:
    print("Could not find Block A")

