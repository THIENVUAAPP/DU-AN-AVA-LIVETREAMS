import React, { useState, useEffect } from 'react';
import { ShoppingCart, CheckCircle2, Crown, Sparkles, MapPin } from 'lucide-react';

const vietnameseNames = [
  "Nguyễn Văn An", "Trần Thị Bé", "Lê Hoàng Phúc", "Phạm Thu Thảo", "Hoàng Văn Thái",
  "Phan Thị Mai", "Vũ Đình Trọng", "Đặng Ngọc Duyên", "Bùi Tấn Phát", "Đỗ Hương Giang",
  "Hồ Trọng Đạt", "Ngô Khả Tú", "Dương Quốc Anh", "Lý Thu Trang", "Nguyễn Minh Khang",
  "Trần Hữu Lộc", "Lê Thanh Hằng", "Phạm Quang Vinh", "Hoàng Kim Liên", "Phan Nhật Tuấn",
  "Vũ Thị Thúy", "Đặng Hải Đăng", "Bùi Bích Thủy", "Đỗ Văn Toàn", "Hồ Mỹ Ngọc",
  "Ngô Gia Huy", "Dương Phương Anh", "Lý Anh Tài", "Nguyễn Tuấn Kiệt", "Trần Mai Anh",
  "Lê Duy Mạnh", "Phạm Tuyết Nhung", "Hoàng Xuân Bách", "Phan Thanh Trúc", "Vũ Công Thành",
  "Đặng Thu Ngân", "Bùi Minh Hiếu", "Đỗ Thị Quỳnh", "Hồ Bảo Long", "Ngô Ái Châu",
  "Dương Tiến Dũng", "Lý Kim Yến", "Nguyễn Đình Trường", "Trần Trúc Phương", "Lê Văn Sơn",
  "Phạm Bích Phượng", "Hoàng Đức Hải", "Phan Kim Yến", "Vũ Minh Quân", "Đặng Yến Nhi",
  "Bùi Hữu Tài", "Đỗ Thanh Thảo", "Hồ Văn Bình", "Ngô Mỹ Dung", "Dương Anh Khoa",
  "Lý Gia Linh", "Nguyễn Xuân Nam", "Trần Thúy Vy", "Lê Quốc Thịnh", "Phạm Thu Hà",
  "Hoàng Thái Bảo", "Phan Thị Nhung", "Vũ Hoàng Sơn", "Đặng Hồng Nhung", "Bùi Quang Khải",
  "Đỗ Minh Tâm", "Hồ Bảo Khang", "Ngô Cẩm Ly", "Dương Tấn Sang", "Lý Thanh Tùng",
  "Nguyễn Khánh Ly", "Trần Tiến Đạt", "Lê Mỹ Duyên", "Phạm Văn Thiện", "Hoàng Thị Huyền",
  "Phan Quốc Hưng", "Vũ Bảo Thy", "Đặng Minh Trí", "Bùi Ngọc Hân", "Đỗ Đức Duy",
  "Hồ Thị Nụ", "Ngô Quốc Bảo", "Dương Thu Thủy", "Lý Thành Nam", "Nguyễn Bích Ngọc",
  "Trần Văn Hùng", "Lê Diễm My", "Phạm Thế Anh", "Hoàng Yến Chi", "Phan Thanh Hùng",
  "Vũ Hương Ly", "Đặng Tấn Lộc", "Bùi Lan Anh", "Đỗ Gia Hưng", "Hồ Nhã Kỳ",
  "Ngô Trọng Nghĩa", "Dương Bích Trâm", "Lý Khắc Hiếu", "Nguyễn Tú Anh", "Trần Hùng Cường"
];

const provinces = [
  "Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Cần Thơ", "Hải Phòng", "Bình Dương", "Đồng Nai",
  "Bà Rịa - Vũng Tàu", "Thanh Hóa", "Nghệ An", "Quảng Ninh", "Khánh Hòa", "Lâm Đồng"
];

const packages = [
  { name: "Gói VIP", color: "text-purple-400", bg: "bg-purple-500/20", icon: <Crown className="w-4 h-4 text-purple-400" /> },
  { name: "Gói PRO", color: "text-blue-400", bg: "bg-blue-500/20", icon: <ShoppingCart className="w-4 h-4 text-blue-400" /> },
  { name: "Gói SIÊU CẤP VIP PRO", color: "text-amber-400", bg: "bg-amber-500/20", icon: <Sparkles className="w-4 h-4 text-amber-400" /> },
  { name: "Gói STARTER", color: "text-emerald-400", bg: "bg-emerald-500/20", icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" /> }
];

export default function RecentPurchasePopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentBuyer, setCurrentBuyer] = useState(null);

  useEffect(() => {
    // Show first popup after 5 seconds to test
    const initialTimer = setTimeout(() => {
      triggerPopup();
    }, 5000);

    return () => clearTimeout(initialTimer);
  }, []);

  const triggerPopup = () => {
    // Pick random data
    const randomName = vietnameseNames[Math.floor(Math.random() * vietnameseNames.length)];
    const randomProvince = provinces[Math.floor(Math.random() * provinces.length)];
    const randomPackage = packages[Math.floor(Math.random() * packages.length)];
    const randomTime = Math.floor(Math.random() * 59) + 1; // 1-59 minutes ago (or we can just say "Vừa xong")

    setCurrentBuyer({
      name: randomName,
      province: randomProvince,
      pkg: randomPackage,
      time: 'Vừa xong'
    });

    setIsVisible(true);

    // Hide after 5 seconds
    setTimeout(() => {
      setIsVisible(false);
      
      // Schedule next popup (randomly between 90s and 120s as user asked for "cứ 2 phút")
      const nextDelay = Math.floor(Math.random() * (120000 - 90000 + 1) + 90000);
      setTimeout(() => {
        triggerPopup();
      }, nextDelay);
      
    }, 5000);
  };

  if (!currentBuyer) return null;

  return (
    <div 
      className={`fixed bottom-6 left-6 z-[9999] transition-all duration-700 ease-in-out transform ${
        isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-20 opacity-0 scale-95 pointer-events-none"
      }`}
    >
      <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl flex items-center gap-4 w-[340px] relative overflow-hidden group">
        
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* User Avatar */}
        <div className="relative shrink-0">
          <div className="w-12 h-12 rounded-full border-2 border-emerald-500/50 p-0.5">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white font-black text-lg shadow-glow-emerald">
              {currentBuyer.name.charAt(0)}
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-black rounded-full flex items-center justify-center">
             <CheckCircle2 className="w-3 h-3 text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-sm truncate">{currentBuyer.name}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-gray-400 text-[11px]">Vừa đăng ký</span>
            <span className={`text-[11px] font-black ${currentBuyer.pkg.color} flex items-center gap-1 bg-white/5 px-1.5 py-0.5 rounded`}>
              {currentBuyer.pkg.name}
            </span>
          </div>
          <div className="flex items-center justify-between mt-1.5">
            <div className="flex items-center gap-1 text-[10px] text-gray-500">
               <MapPin className="w-3 h-3" /> {currentBuyer.province}
            </div>
            <span className="text-[10px] text-emerald-400 font-bold">{currentBuyer.time}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
