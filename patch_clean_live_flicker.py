import re
with open('src/components/genaidol/CleanLiveOverlay.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove keys from <video> tags to prevent flickering/remounting
content = re.sub(r'key={`quick_\$\{quickResponseVideo\.url\}`}', '', content)
content = re.sub(r'key={`event_\$\{activeEventVideo\.url\}`}', '', content)
content = re.sub(r'key={`lipsync_\$\{lipSyncVideoUrl\}`}', '', content)
content = re.sub(r'key={`single_main_vid_\$\{singleUrl\}`}', '', content)
content = re.sub(r'key={`main_live_vid_\$\{masterState\.mediaUrl\}`}', '', content)

# Fix cropping (cắt đầu đít) -> change object-fit cover to contain or add support for 9:16 explicitly
# The user wants "đúng kích thước và chính tỉ lệ 9:16... không bị cắt đầu đít"
# Actually, if it's 9:16 video on 9:16 screen, 'cover' should be fine without cropping, 
# BUT if it's a 16:9 video on a 9:16 screen, 'cover' will crop the sides. 
# If it's a 9:16 video on a 16:9 screen, 'cover' will crop top and bottom (cắt đầu đít)!
# Wait, TikTok Live Studio uses 9:16. The browser window might be 16:9, so it crops top/bottom.
# In `UniversalMasterOverlayModal.jsx`, it says "Tự Khớp Khung Hình". 
# The best CSS for this is `object-fit: contain;` for the main video, or we force the container to be 9:16.
# Let's check where objectFit is set.

# Wait, in CleanLiveOverlay:
# const getObjectFit = useCallback(() => {
#    return params?.get('fit') === 'contain' ? 'contain' : 'cover';
#  });
# It defaults to 'cover'! 
# Let's change default to 'contain' so it doesn't crop (cắt đầu đít) and preserves full video.
target_fit = "return params?.get('fit') === 'contain' ? 'contain' : 'cover';"
replacement_fit = "return params?.get('fit') === 'cover' ? 'cover' : 'contain'; // Default to contain to avoid cropping (cắt đầu đít)"
if target_fit in content:
    content = content.replace(target_fit, replacement_fit)
else:
    print("target_fit not found")

with open('src/components/genaidol/CleanLiveOverlay.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
