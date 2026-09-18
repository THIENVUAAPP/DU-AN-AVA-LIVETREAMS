import re

with open('src/components/MultistreamStudio.jsx', 'r') as f:
    content = f.read()

old_src = """src={`https://www.youtube.com/embed/${getYoutubeId(activeVideoUrl)}?autoplay=1&mute=0&controls=1&loop=1&playlist=${getYoutubeId(activeVideoUrl)}&cc_load_policy=${captionsEnabled ? 1 : 0}`}"""
new_src = """src={`https://www.youtube.com/embed/${getYoutubeId(activeVideoUrl)}?autoplay=1&mute=0&controls=1&loop=1&playlist=${getYoutubeId(activeVideoUrl)}&cc_load_policy=${captionsEnabled ? 1 : 0}&cc_lang_pref=vi&hl=vi`}"""
content = content.replace(old_src, new_src)

with open('src/components/MultistreamStudio.jsx', 'w') as f:
    f.write(content)

