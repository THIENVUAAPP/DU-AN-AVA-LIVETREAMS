import re
with open('src/lib/masterLiveSync.js', 'r', encoding='utf-8') as f:
    content = f.read()

target = """  // 🛑 FIX: KHI NGƯỜI DÙNG ĐÃ NGẮT KẾT NỐI SÂN KHẤU CHÍNH, CHẶN MỌI LỆNH ĐIỀU KHIỂN PLAY/PAUSE (TRỪ CLEAR)
  const isMasterStageSynced = localStorage.getItem('avalive_master_sync_active') === 'true';
  if (!isMasterStageSynced && !control.clearMedia && control.action !== 'stop') {
    return;
  }"""

content = content.replace(target, "")

with open('src/lib/masterLiveSync.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Patched sendVideoControl")
