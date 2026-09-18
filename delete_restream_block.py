import re

with open('src/components/UniversalFileUploader.jsx', 'r') as f:
    content = f.read()

start_marker = "{/* GẮN LINK VIDEO ĐÃ LIVE (RESTREAM REPLAY LINK) */}"
# The block is inside <div className="grid grid-cols-1 gap-4">
# We can find the start, and then parse the closing div, but it's simpler to just replace everything from start_marker to the end of the file since it's the last thing in that container, EXCEPT we need to preserve the closing tags.

start_idx = content.find(start_marker)

# Let's find the closing tag for the `grid-cols-1 gap-4` container.
# It ends with:
#         </div>
# 
#       </div>
# 
#     </div>
#   );
# }

if start_idx != -1:
    end_pattern = "      </div>\n\n    </div>\n  );\n}"
    end_idx = content.find(end_pattern)
    
    if end_idx != -1:
        new_content = content[:start_idx] + end_pattern
        with open('src/components/UniversalFileUploader.jsx', 'w') as f:
            f.write(new_content)
        print("Successfully removed the Restream block.")
    else:
        print("End pattern not found.")
else:
    print("Start marker not found.")
