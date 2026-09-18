import re

with open('src/components/UniversalFileUploader.jsx', 'r') as f:
    content = f.read()

# Make the uploader full width by removing grid-cols-2
content = content.replace('className="grid grid-cols-1 md:grid-cols-2 gap-4"', 'className="grid grid-cols-1 gap-4"')

# Remove the whole GẮN LINK VIDEO ĐÃ LIVE (RESTREAM REPLAY LINK) block
# Since it's large, we use a regex or string replacement strategy carefully.
# It starts at: {/* GẮN LINK VIDEO ĐÃ LIVE (RESTREAM REPLAY LINK) */}
# And ends before: {/* UPLOADED & RESTREAM QUEUE LIST */}

start_marker = "{/* GẮN LINK VIDEO ĐÃ LIVE (RESTREAM REPLAY LINK) */}"
end_marker = "{/* UPLOADED & RESTREAM QUEUE LIST */}"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + content[end_idx:]

with open('src/components/UniversalFileUploader.jsx', 'w') as f:
    f.write(content)
