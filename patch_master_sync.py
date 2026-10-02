import re
with open('src/lib/masterLiveSync.js', 'r', encoding='utf-8') as f:
    content = f.read()

target = """  // 🛑 FIX: KHI NGƯỜI DÙNG ĐÃ NGẮT KẾT NỐI SÂN KHẤU CHÍNH, CHẶN ĐỨT MỌI TÍN HIỆU CẬP NHẬT TỰ ĐỘNG KHÁC!
  const isMasterStageSynced = localStorage.getItem('avalive_master_sync_active') === 'true';
  if (!isMasterStageSynced && partialState.type !== 'CLEAR_STAGE' && partialState.clearMedia !== true && partialState.stage !== 'offline') {
    return; 
  }"""

content = content.replace(target, "")

with open('src/lib/masterLiveSync.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Patched masterLiveSync")
