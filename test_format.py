import yt_dlp

ydl_opts = {'quiet': True, 'format': 'best[protocol^=m3u8]/best', 'no_warnings': True}
try:
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info('https://www.tiktok.com/@bf_doran_05/live', download=False)
        print("Success:", info.get('url')[:50])
except Exception as e:
    print("Error:", str(e))
