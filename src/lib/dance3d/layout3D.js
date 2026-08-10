// Tính vị trí 3D cho từng nhân vật trên sàn — dàn theo lưới xoắn ốc để chứa được tới 50-80 nhân vật
// mà không chồng lấn, và dàn đội hình cụm cho chế độ nhảy đôi/3/nhóm (Ghi ở Mục "danceMode").
const FLOOR_RADIUS = 7;

// Lưới xoắn ốc kiểu hoa hướng dương — phân bố đều trong hình tròn sàn diễn, người đầu tiên luôn ở gần
// tâm sàn (dễ thấy nhất), càng đông thì tự giãn dần ra ngoài, không chồng lấn.
export function spiralPosition(index, total) {
  // Thay vì lưới xoắn ốc tỏa tròn khiến người đứng xa bị trôi lơ lửng lên trên (do phối cảnh),
  // ta xếp theo Đội hình Hàng Ngang (Band Layout - Chuẩn Audition) ở nửa dưới màn hình.
  const columns = 14; // Số người tối đa trên 1 hàng ngang
  const row = Math.floor(index / columns);
  const col = index % columns;
  
  // Dãn cách ngang
  const spacingX = 1.3;
  // OffsetX để căn giữa sân khấu
  const offsetX = (col - Math.min(total, columns) / 2 + 0.5) * spacingX;
  
  // Z càng lớn thì càng gần Camera (Camera đang ở Z=12).
  // Đẩy đội hình sát về phía trước (Z từ 7 đến 10) để luôn bám sàn.
  const baseZ = 9.5;
  const offsetZ = baseZ - row * 1.5; 
  
  // So le các hàng để không bị che lấp
  const staggerX = (row % 2 === 1) ? (spacingX / 2) : 0;

  return { x: offsetX + staggerX, z: offsetZ };
}

// Đội hình cụm cho nhảy đôi/3/nhóm — các thành viên cùng groupId đứng gần nhau thành 1 hàng ngang,
// tâm cụm vẫn theo vị trí xoắn ốc của thành viên đầu tiên trong nhóm.
export function groupClusterPosition(centerX, centerZ, memberIndex, groupSize) {
  if (groupSize <= 1) return { x: centerX, z: centerZ };
  const spacing = 0.9;
  const offset = (memberIndex - (groupSize - 1) / 2) * spacing;
  return { x: centerX + offset, z: centerZ };
}
