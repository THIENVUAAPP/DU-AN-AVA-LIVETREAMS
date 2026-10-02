import re
with open('src/lib/masterLiveSync.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Patch syncMasterLiveState
target_sync = "export function syncMasterLiveState(partialState, socket = null) {\n  if (typeof window === 'undefined') return;"
replacement_sync = """export function syncMasterLiveState(partialState, socket = null) {
  if (typeof window === 'undefined') return;

  // 🛑 FIX: KHI NGƯỜI DÙNG ĐÃ NGẮT KẾT NỐI SÂN KHẤU CHÍNH, CHẶN ĐỨT MỌI TÍN HIỆU CẬP NHẬT TỰ ĐỘNG KHÁC!
  const isMasterStageSynced = localStorage.getItem('avalive_master_sync_active') === 'true';
  if (!isMasterStageSynced && partialState.type !== 'CLEAR_STAGE' && partialState.clearMedia !== true && partialState.stage !== 'offline') {
    return;
  }"""
if target_sync in content:
    content = content.replace(target_sync, replacement_sync)
else:
    print("Could not find target_sync")

# Patch sendVideoControl
target_video = "export function sendVideoControl(control, socket = null) {\n  if (typeof window === 'undefined' || !control) return;"
replacement_video = """export function sendVideoControl(control, socket = null) {
  if (typeof window === 'undefined' || !control) return;

  // 🛑 FIX: KHI NGƯỜI DÙNG ĐÃ NGẮT KẾT NỐI SÂN KHẤU CHÍNH, CHẶN MỌI LỆNH ĐIỀU KHIỂN PLAY/PAUSE (TRỪ CLEAR)
  const isMasterStageSynced = localStorage.getItem('avalive_master_sync_active') === 'true';
  if (!isMasterStageSynced && !control.clearMedia && control.action !== 'stop') {
    return;
  }"""
if target_video in content:
    content = content.replace(target_video, replacement_video)
else:
    print("Could not find target_video")

with open('src/lib/masterLiveSync.js', 'w', encoding='utf-8') as f:
    f.write(content)
