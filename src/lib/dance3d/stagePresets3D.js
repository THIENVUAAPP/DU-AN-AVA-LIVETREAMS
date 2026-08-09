// 30 preset sàn nhảy 3D — tổ hợp THẬT giữa 6 chủ đề bối cảnh × 5 tông ánh sáng (không phải 30 bộ mô
// hình 3D dựng tay riêng lẻ, vì đó là khối lượng công việc mỹ thuật 3D chuyên nghiệp ngoài phạm vi
// tạo code). Mỗi tổ hợp cho màu sàn/nền/sương mù/đèn thật khác nhau, áp trực tiếp vào THREE.js.
const THEMES = [
  { key: "neon_club", label: "Neon Club", floor: "#1a0b2e", backdrop: "#05030a", fog: "#1a0b2e" },
  { key: "gold_vip", label: "Phòng VIP Vàng", floor: "#2e2205", backdrop: "#0a0805", fog: "#2e2205" },
  { key: "rain_night", label: "Đêm Mưa", floor: "#0b1a2e", backdrop: "#050a12", fog: "#0b1a2e" },
  { key: "fire_stage", label: "Sân Khấu Lửa", floor: "#2e0b0b", backdrop: "#120404", fog: "#2e0b0b" },
  { key: "cyber_city", label: "Cyber City", floor: "#052e2e", backdrop: "#020a0a", fog: "#052e2e" },
  { key: "dream_pink", label: "Mộng Hồng", floor: "#2e0b22", backdrop: "#0f0209", fog: "#2e0b22" },
];

const LIGHT_SCHEMES = [
  { key: "warm", label: "Ánh Sáng Ấm", colors: ["#ff6b35", "#f7c548"] },
  { key: "cool", label: "Ánh Sáng Lạnh", colors: ["#3b82f6", "#22d3ee"] },
  { key: "rainbow", label: "Cầu Vồng LED", colors: ["#ef4444", "#8b5cf6", "#3b82f6", "#22c55e"] },
  { key: "mono_purple", label: "Tím Đơn Sắc", colors: ["#8b5cf6", "#a78bfa"] },
  { key: "gold_white", label: "Vàng Trắng Sang", colors: ["#facc15", "#ffffff"] },
];

export const STAGE_PRESETS_3D = THEMES.flatMap((theme) =>
  LIGHT_SCHEMES.map((scheme) => ({
    id: `stage3d_${theme.key}_${scheme.key}`,
    name: `${theme.label} — ${scheme.label}`,
    floorColor: theme.floor,
    backdropColor: theme.backdrop,
    fogColor: theme.fog,
    lightColors: scheme.colors,
  }))
);
