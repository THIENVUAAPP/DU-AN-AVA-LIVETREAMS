/**
 * Banner Flag Cells Matrix Engine (Khối Lưới Chữ Ô Cờ 3D Trên Đầu Bản Đồ)
 * Chuyển đổi chuỗi văn bản (ví dụ: "VIỆT NAM MUÔN NĂM", "TỰ HÀO VIỆT NAM") thành ma trận các Ô CỜ 3D (Voxel Cells).
 * Người xem tặng quà có thể lấp đầy cờ quốc kỳ vào từng nét chữ.
 * Cho phép Admin tùy chỉnh nội dung văn bản và di chuyển toạ độ 3D (X, Y, Z).
 */

// Bảng ma trận 5x7 Voxel Font cho ký tự Latin và Tiếng Việt cơ bản
const BITMAP_FONT_5X7 = {
  'A': [
    " 111 ",
    "1   1",
    "1   1",
    "11111",
    "1   1",
    "1   1",
    "1   1"
  ],
  'Ă': [
    " 1 1 ",
    " 111 ",
    "1   1",
    "11111",
    "1   1",
    "1   1",
    "1   1"
  ],
  'Â': [
    "  1  ",
    " 1 1 ",
    "11111",
    "1   1",
    "1   1",
    "1   1",
    "1   1"
  ],
  'B': [
    "1111 ",
    "1   1",
    "1111 ",
    "1   1",
    "1   1",
    "1111 "
  ],
  'C': [
    " 1111",
    "1    ",
    "1    ",
    "1    ",
    "1    ",
    " 1111"
  ],
  'D': [
    "1111 ",
    "1   1",
    "1   1",
    "1   1",
    "1   1",
    "1111 "
  ],
  'Đ': [
    " 111 ",
    "11111",
    "1   1",
    "1   1",
    "1   1",
    "1111 "
  ],
  'E': [
    "11111",
    "1    ",
    "1111 ",
    "1    ",
    "1    ",
    "11111"
  ],
  'Ê': [
    "  1  ",
    " 1 1 ",
    "11111",
    "1111 ",
    "1    ",
    "11111"
  ],
  'G': [
    " 1111",
    "1    ",
    "1 111",
    "1   1",
    "1   1",
    " 1111"
  ],
  'H': [
    "1   1",
    "1   1",
    "11111",
    "1   1",
    "1   1",
    "1   1"
  ],
  'I': [
    "11111",
    "  1  ",
    "  1  ",
    "  1  ",
    "  1  ",
    "11111"
  ],
  'J': [
    "    1",
    "    1",
    "    1",
    "1   1",
    "1   1",
    " 111 "
  ],
  'K': [
    "1   1",
    "1  1 ",
    "111  ",
    "1  1 ",
    "1   1",
    "1   1"
  ],
  'L': [
    "1    ",
    "1    ",
    "1    ",
    "1    ",
    "1    ",
    "11111"
  ],
  'M': [
    "1   1",
    "11 11",
    "1 1 1",
    "1   1",
    "1   1",
    "1   1"
  ],
  'N': [
    "1   1",
    "11  1",
    "1 1 1",
    "1  11",
    "1   1",
    "1   1"
  ],
  'O': [
    " 111 ",
    "1   1",
    "1   1",
    "1   1",
    "1   1",
    " 111 "
  ],
  'Ô': [
    "  1  ",
    " 1 1 ",
    " 111 ",
    "1   1",
    "1   1",
    " 111 "
  ],
  'Ơ': [
    "   1 ",
    " 1111",
    "1   1",
    "1   1",
    "1   1",
    " 111 "
  ],
  'P': [
    "1111 ",
    "1   1",
    "1111 ",
    "1    ",
    "1    ",
    "1    "
  ],
  'Q': [
    " 111 ",
    "1   1",
    "1   1",
    "1 1 1",
    "1  1 ",
    " 11 1"
  ],
  'R': [
    "1111 ",
    "1   1",
    "1111 ",
    "1  1 ",
    "1   1",
    "1   1"
  ],
  'S': [
    " 1111",
    "1    ",
    " 111 ",
    "    1",
    "1   1",
    " 111 "
  ],
  'T': [
    "11111",
    "  1  ",
    "  1  ",
    "  1  ",
    "  1  ",
    "  1  "
  ],
  'U': [
    "1   1",
    "1   1",
    "1   1",
    "1   1",
    "1   1",
    " 111 "
  ],
  'Ư': [
    "   1 ",
    "1  11",
    "1   1",
    "1   1",
    "1   1",
    " 111 "
  ],
  'V': [
    "1   1",
    "1   1",
    "1   1",
    "1   1",
    " 1 1 ",
    "  1  "
  ],
  'W': [
    "1   1",
    "1   1",
    "1 1 1",
    "1 1 1",
    "11 11",
    "1   1"
  ],
  'X': [
    "1   1",
    " 1 1 ",
    "  1  ",
    " 1 1 ",
    "1   1",
    "1   1"
  ],
  'Y': [
    "1   1",
    " 1 1 ",
    "  1  ",
    "  1  ",
    "  1  ",
    "  1  "
  ],
  'Z': [
    "11111",
    "   1 ",
    "  1  ",
    " 1   ",
    "11111"
  ],
  ' ': [
    "     ",
    "     ",
    "     ",
    "     ",
    "     "
  ],
  '-': [
    "     ",
    "     ",
    "11111",
    "     ",
    "     "
  ],
  '!': [
    "  1  ",
    "  1  ",
    "  1  ",
    "     ",
    "  1  "
  ],
  '⭐': [
    "  1  ",
    "11111",
    " 111 ",
    "1 1 1"
  ]
};

// Loại bỏ dấu để tra cứu font ma trận nếu ký tự chưa có
function normalizeChar(char) {
  const upper = char.toUpperCase();
  if (BITMAP_FONT_5X7[upper]) return upper;
  
  // Ánh xạ các ký tự có dấu phổ biến
  const map = {
    'Á': 'A', 'À': 'A', 'Ả': 'A', 'Ã': 'A', 'Ạ': 'A',
    'Ắ': 'Ă', 'Ằ': 'Ă', 'Ẳ': 'Ă', 'Ẵ': 'Ă', 'Ặ': 'Ă',
    'Ấ': 'Â', 'Ầ': 'Â', 'Ẩ': 'Â', 'Ẫ': 'Â', 'Ậ': 'Â',
    'É': 'E', 'È': 'E', 'Ẻ': 'E', 'Ẽ': 'E', 'Ẹ': 'E',
    'Ế': 'Ê', 'Ề': 'Ê', 'Ể': 'Ê', 'Ễ': 'Ê', 'Ệ': 'Ê',
    'Í': 'I', 'Ì': 'I', 'Ỉ': 'I', 'Ĩ': 'I', 'Ị': 'I',
    'Ó': 'O', 'Ò': 'O', 'Ỏ': 'O', 'Õ': 'O', 'Ọ': 'O',
    'Ố': 'Ô', 'Ồ': 'Ô', 'Ổ': 'Ô', 'Ỗ': 'Ô', 'Ộ': 'Ô',
    'Ớ': 'Ơ', 'Ờ': 'Ơ', 'Ở': 'Ơ', 'Ỡ': 'Ơ', 'Ợ': 'Ơ',
    'Ú': 'U', 'Ù': 'U', 'Ủ': 'U', 'Ũ': 'U', 'Ụ': 'U',
    'Ứ': 'Ư', 'Ừ': 'Ư', 'Ử': 'Ư', 'Ữ': 'Ư', 'Ự': 'Ư',
    'Ý': 'Y', 'Ỳ': 'Y', 'Ỷ': 'Y', 'Ỹ': 'Y', 'Ỵ': 'Y',
  };
  return map[upper] || upper;
}

export class BannerFlagCellsEngine {
  constructor(options = {}) {
    this.text = options.text || 'VIỆT NAM MUÔN NĂM';
    this.posX = options.posX !== undefined ? options.posX : 0;
    this.posY = options.posY !== undefined ? options.posY : 3.5;
    this.posZ = options.posZ !== undefined ? options.posZ : -155; // Vị trí trên đầu bản đồ
    this.cellSpacing = options.cellSpacing || 2.4;
    this.letterSpacing = options.letterSpacing || 3.0;
    this.claimedColor = options.claimedColor || '#DA251D';
    this.unclaimedColor = options.unclaimedColor || '#334155';
    this.starColor = options.starColor || '#FFD700';

    this.cells = [];
    this.claimedCount = 0;
    this.generateCells();
  }

  setText(newText) {
    this.text = (newText || 'VIỆT NAM MUÔN NĂM').trim().toUpperCase();
    this.generateCells();
  }

  setPosition(x, y, z) {
    if (x !== undefined) this.posX = parseFloat(x);
    if (y !== undefined) this.posY = parseFloat(y);
    if (z !== undefined) this.posZ = parseFloat(z);
    this.generateCells();
  }

  generateCells() {
    const chars = Array.from(this.text);
    const charGrids = chars.map(c => {
      const norm = normalizeChar(c);
      return BITMAP_FONT_5X7[norm] || BITMAP_FONT_5X7[' '];
    });

    // Tính toán tổng chiều rộng để căn giữa
    let totalWidth = 0;
    charGrids.forEach(grid => {
      const cols = grid[0]?.length || 5;
      totalWidth += cols * this.cellSpacing + this.letterSpacing;
    });

    const startX = this.posX - totalWidth / 2;
    let currentX = startX;
    const newCells = [];
    let cellId = 1;

    charGrids.forEach((grid, charIdx) => {
      const char = chars[charIdx];
      const rows = grid.length;
      const cols = grid[0]?.length || 5;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (grid[r] && grid[r][c] === '1') {
            const wx = currentX + c * this.cellSpacing;
            const wz = this.posZ + (r - rows / 2) * this.cellSpacing;
            const wy = this.posY;

            newCells.push({
              id: `banner_cell_${cellId++}`,
              char,
              charIndex: charIdx,
              r,
              c,
              wx,
              wy,
              wz,
              isClaimed: false,
              claimedBy: null,
              color: this.unclaimedColor
            });
          }
        }
      }
      currentX += cols * this.cellSpacing + this.letterSpacing;
    });

    this.cells = newCells;
    this.claimedCount = 0;
    return this.cells;
  }

  // Tự động cắm cờ vào ô chữ theo tiến độ bản đồ hoặc theo quà tặng riêng
  claimCells(count = 1, user = null) {
    let newlyClaimed = 0;
    for (let i = 0; i < this.cells.length && newlyClaimed < count; i++) {
      const cell = this.cells[i];
      if (!cell.isClaimed) {
        cell.isClaimed = true;
        cell.claimedBy = user;
        cell.color = this.claimedColor;
        this.claimedCount++;
        newlyClaimed++;
      }
    }
    return newlyClaimed;
  }

  // Tuỳ chỉnh màu sắc ô cờ khối chữ (Đã cắm / Chưa cắm)
  setColors(claimedColor, unclaimedColor) {
    if (claimedColor) this.claimedColor = claimedColor;
    if (unclaimedColor) this.unclaimedColor = unclaimedColor;
    this.cells.forEach(c => {
      c.color = c.isClaimed ? this.claimedColor : this.unclaimedColor;
    });
  }

  // Tuỳ chỉnh khoảng cách và kích cỡ ô chữ
  setSpacing(cellSpacing, letterSpacing) {
    if (cellSpacing !== undefined) this.cellSpacing = parseFloat(cellSpacing);
    if (letterSpacing !== undefined) this.letterSpacing = parseFloat(letterSpacing);
    this.generateCells();
  }

  // Đồng bộ tỷ lệ lấp đầy theo phần trăm hoàn thành của toàn bản đồ
  syncWithMapPercent(percent = 0) {
    const targetClaimed = Math.floor((this.cells.length * Math.min(100, Math.max(0, percent))) / 100);
    this.claimedCount = targetClaimed;
    this.cells.forEach((cell, idx) => {
      cell.isClaimed = idx < targetClaimed;
      cell.color = cell.isClaimed ? this.claimedColor : this.unclaimedColor;
    });
  }

  reset() {
    this.claimedCount = 0;
    this.cells.forEach(c => {
      c.isClaimed = false;
      c.claimedBy = null;
      c.color = this.unclaimedColor;
    });
  }
}

export default BannerFlagCellsEngine;
