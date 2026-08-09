// Bảng màu Tailwind CSS v3 chuẩn (public spec, ổn định) — dùng để đổi class gradient Tailwind sẵn có
// của nhân vật (vd "from-pink-500 to-purple-600") thành màu vật liệu THREE.js thật, tránh phải khai
// báo lại màu cho từng nhân vật.
export const TAILWIND_HEX = {
  "amber-400": "#fbbf24", "amber-500": "#f59e0b", "amber-600": "#d97706", "amber-950": "#451a03",
  "blue-500": "#3b82f6", "blue-950": "#172554",
  "cyan-300": "#67e8f9", "cyan-500": "#06b6d4", "cyan-700": "#0e7490", "cyan-950": "#083344",
  "emerald-500": "#10b981", "emerald-700": "#047857",
  "fuchsia-400": "#e879f9", "fuchsia-500": "#d946ef", "fuchsia-950": "#4a044e",
  "gray-400": "#9ca3af", "gray-500": "#6b7280", "gray-600": "#4b5563", "gray-800": "#1f2937",
  "green-500": "#22c55e",
  "indigo-500": "#6366f1", "indigo-600": "#4f46e5", "indigo-700": "#4338ca", "indigo-950": "#1e1b4b",
  "neutral-600": "#525252", "neutral-700": "#404040",
  "orange-300": "#fdba74", "orange-400": "#fb923c", "orange-500": "#f97316", "orange-600": "#ea580c",
  "orange-700": "#c2410c", "orange-900": "#7c2d12", "orange-950": "#431407",
  "pink-300": "#f9a8d4", "pink-400": "#f472b6", "pink-500": "#ec4899", "pink-600": "#db2777",
  "pink-700": "#be185d", "pink-900": "#831843",
  "purple-400": "#c084fc", "purple-600": "#9333ea", "purple-700": "#7e22ce", "purple-950": "#3b0764",
  "red-500": "#ef4444", "red-600": "#dc2626", "red-700": "#b91c1c", "red-950": "#450a0a",
  "rose-300": "#fda4af", "rose-400": "#fb7185", "rose-600": "#e11d48", "rose-800": "#9f1239", "rose-950": "#4c0519",
  "sky-400": "#38bdf8",
  "slate-200": "#e2e8f0", "slate-400": "#94a3b8", "slate-500": "#64748b", "slate-600": "#475569",
  "slate-700": "#334155", "slate-800": "#1e293b", "slate-900": "#0f172a", "slate-950": "#020617",
  "stone-900": "#1c1917",
  "teal-500": "#14b8a6",
  "violet-400": "#a78bfa",
  "yellow-300": "#fde047", "yellow-400": "#facc15", "yellow-500": "#eab308",
  "yellow-700": "#a16207", "yellow-800": "#854d0e", "yellow-900": "#713f12",
};

// "from-pink-500 to-purple-600" → { from: '#ec4899', to: '#9333ea' }
export function gradientToHexPair(gradientClass) {
  const fromMatch = gradientClass.match(/from-([a-z]+-\d+)/);
  const toMatch = gradientClass.match(/to-([a-z]+-\d+)/);
  return {
    from: (fromMatch && TAILWIND_HEX[fromMatch[1]]) || "#EF4444",
    to: (toMatch && TAILWIND_HEX[toMatch[1]]) || "#8B5CF6",
  };
}
