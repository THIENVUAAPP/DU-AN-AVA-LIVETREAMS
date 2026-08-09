// Tính vị trí 3D cho từng nhân vật trên sàn — dàn theo lưới xoắn ốc để chứa được tới 50-80 nhân vật
// mà không chồng lấn, và dàn đội hình cụm cho chế độ nhảy đôi/3/nhóm (Ghi ở Mục "danceMode").
const FLOOR_RADIUS = 7;

// Lưới xoắn ốc kiểu hoa hướng dương — phân bố đều trong hình tròn sàn diễn, người đầu tiên luôn ở gần
// tâm sàn (dễ thấy nhất), càng đông thì tự giãn dần ra ngoài, không chồng lấn.
export function spiralPosition(index, total) {
  const goldenAngle = 2.399963;
  const n = Math.max(1, total);
  const radius = FLOOR_RADIUS * Math.sqrt((index + 0.5) / n);
  const angle = index * goldenAngle;
  return {
    x: Math.cos(angle) * Math.min(radius, FLOOR_RADIUS),
    z: Math.sin(angle) * Math.min(radius, FLOOR_RADIUS),
  };
}

// Đội hình cụm cho nhảy đôi/3/nhóm — các thành viên cùng groupId đứng gần nhau thành 1 hàng ngang,
// tâm cụm vẫn theo vị trí xoắn ốc của thành viên đầu tiên trong nhóm.
export function groupClusterPosition(centerX, centerZ, memberIndex, groupSize) {
  if (groupSize <= 1) return { x: centerX, z: centerZ };
  const spacing = 0.9;
  const offset = (memberIndex - (groupSize - 1) / 2) * spacing;
  return { x: centerX + offset, z: centerZ };
}
