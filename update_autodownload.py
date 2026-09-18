import re

with open('src/components/LivestreamClonerStudio.jsx', 'r') as f:
    content = f.read()

# Replace the simulateEndLive to actually trigger download
old_simulate = """  const simulateEndLive = (id) => {
    setStreams(prev => prev.map(s => s.id === id ? { ...s, isPlaying: false, status: 'downloading' } : s));
    
    // Giả lập tải video thành công sau 3 giây
    setTimeout(() => {
      setStreams(prev => prev.map(s => s.id === id ? { ...s, status: 'downloaded' } : s));
    }, 3000);
  };"""

new_simulate = """  const simulateEndLive = (id) => {
    const stream = streams.find(s => s.id === id);
    if (!stream) return;
    
    setStreams(prev => prev.map(s => s.id === id ? { ...s, isPlaying: false, status: 'downloading' } : s));
    
    // Nếu có luồng FLV, tiến hành download bằng thẻ <a> (Trình duyệt sẽ xử lý tải luồng trực tiếp)
    if (stream.streamUrl) {
      const a = document.createElement('a');
      a.href = stream.streamUrl;
      a.download = `Livestream_Record_${stream.uploader || 'TikTok'}_${id}.flv`;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    
    // Chuyển trạng thái
    setTimeout(() => {
      setStreams(prev => prev.map(s => s.id === id ? { ...s, status: 'downloaded' } : s));
    }, 2000);
  };"""
content = content.replace(old_simulate, new_simulate)

# We should also trigger download automatically when extraction succeeds if autoDownload is true.
# In handleAddLinks, the fetch succeeds and updates the state. 
# We can use a useEffect to watch for streamUrl changes and autoDownload.
old_useeffect = """  // Giả lập việc thay đổi số lượng người xem
  useEffect(() => {"""

new_useeffect = """  // Auto download khi kết nối luồng thành công
  useEffect(() => {
    streams.forEach(stream => {
      if (stream.autoDownload && stream.extractionStatus === 'success' && stream.streamUrl && !stream.downloadStarted) {
        stream.downloadStarted = true; // prevent multiple triggers
        const a = document.createElement('a');
        a.href = stream.streamUrl;
        a.download = `Auto_Record_${stream.uploader || 'Live'}_${stream.id}.flv`;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        console.log("Đã kích hoạt tải luồng trực tiếp cho:", stream.url);
      }
    });
  }, [streams]);

  // Giả lập việc thay đổi số lượng người xem
  useEffect(() => {"""

if "Auto_Record_" not in content:
    content = content.replace(old_useeffect, new_useeffect)

# Update LivePlayer prop in render block
old_liveplayer = """                          <LivePlayer 
                            url={stream.streamUrl} 
                            playing={true} 
                            muted={true} 
                          />"""

new_liveplayer = """                          <LivePlayer 
                            url={stream.streamUrl} 
                            playing={true} 
                            muted={true} 
                            onVideoMount={(v) => console.log('Video mounted for:', stream.id)}
                          />"""
content = content.replace(old_liveplayer, new_liveplayer)

with open('src/components/LivestreamClonerStudio.jsx', 'w') as f:
    f.write(content)
