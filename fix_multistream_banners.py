import re

with open('src/components/MultistreamStudio.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the Security banner
content = re.sub(r'\{\/\*\s*Enterprise Anti-Hack & Security Guard Banner\s*\*\/.*?\}\s*<\/div>\s*<\/div>', '', content, flags=re.DOTALL)

# Remove the Auto Captcha banner
content = re.sub(r'\{\/\*\s*Auto-Captcha Solver Banner\s*\*\/.*?\}\s*<\/div>\s*<\/div>\s*<\/div>', '', content, flags=re.DOTALL)

with open('src/components/MultistreamStudio.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Banners removed from MultistreamStudio!")
