import re

with open('src/components/MultistreamStudio.jsx', 'r') as f:
    content = f.read()

# Make it robust by providing a fallback empty channel object if both are undefined
fallback_fix = """  const activeMonitorChannelObj = channels.find(c => c.id === selectedMonitorChannel) || channels[0] || {
    id: 'empty',
    name: 'Chưa có kênh kết nối',
    icon: '❓',
    streamKey: '',
    viewers: '0'
  };"""

content = re.sub(r'  const activeMonitorChannelObj = channels\.find\(c => c\.id === selectedMonitorChannel\) \|\| channels\[0\];', fallback_fix, content)

with open('src/components/MultistreamStudio.jsx', 'w') as f:
    f.write(content)
