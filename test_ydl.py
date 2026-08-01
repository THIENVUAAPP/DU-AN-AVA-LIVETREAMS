import yt_dlp
url = "https://www.tiktok.com/@thoitrangmevabe/live"
ydl_opts = {'quiet': True, 'format': 'best', 'no_warnings': True}
try:
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=False)
        print("URL:", info.get('url'))
except Exception as e:
    print("Error:", e)
