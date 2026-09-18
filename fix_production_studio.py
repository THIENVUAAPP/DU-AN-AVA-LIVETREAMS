import re

with open('src/components/ProductionStudio.jsx', 'r') as f:
    content = f.read()

# Make selectedStudioAvatar fallback to a default or use optional chaining
# Actually, since customStudioAvatars is [], selectedStudioAvatar is undefined.
# We just need to change property accesses to use optional chaining.

content = content.replace("selectedStudioAvatar.id", "selectedStudioAvatar?.id")
content = content.replace("selectedStudioAvatar.image", "selectedStudioAvatar?.image")
content = content.replace("selectedStudioAvatar.name", "selectedStudioAvatar?.name")

with open('src/components/ProductionStudio.jsx', 'w') as f:
    f.write(content)
