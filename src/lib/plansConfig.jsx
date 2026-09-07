import React from 'react';
import { MonitorPlay, Zap, Crown, Building2 } from 'lucide-react';

export const defaultPlans = [
  {
    id: "FREE",
    name: "MIỄN PHÍ",
    desc: "Trải nghiệm dùng thử cơ bản đầy đủ tính năng",
    monthly: 0,
    oldMonthly: 0,
    yearly: 0,
    tokens: 100,
    liveMinutes: 60,
    features: [
      "Livestream 1 nền tảng",
      "Tự động chốt đơn (50 đơn/tháng)",
      "Chatbot AI mẫu cơ bản",
      "Thời lượng Live 60 phút",
      "100 Tokens AI"
    ],
    color: "from-gray-400 to-gray-100",
    borderColor: "border-gray-500/30",
    btnText: "BẮT ĐẦU MIỄN PHÍ",
    iconName: "MonitorPlay"
  },
  {
    id: "PRO",
    name: "CHUYÊN NGHIỆP",
    desc: "Dành cho shop bán hàng chuyên nghiệp",
    monthly: 599000,
    oldMonthly: 799000,
    yearly: 599000 * 10,
    tokens: 20000,
    liveMinutes: 3000,
    features: [
      "Livestream 5 nền tảng",
      "Chatbot AI nâng cao",
      "500 đơn hàng/tháng",
      "Thanh toán tự động",
      "Thời lượng Live 50 Giờ (3.000 phút)",
      "20.000 Tokens AI",
      "Hỗ trợ ưu tiên 24/7"
    ],
    isPopular: true,
    color: "from-[#3B82F6] to-[#60A5FA]",
    borderColor: "border-[#3B82F6]",
    btnText: "MUA NGAY",
    iconName: "Zap"
  },
  {
    id: "BUSINESS",
    name: "VIP PRO",
    desc: "Dành cho nhà sáng tạo nội dung & doanh nghiệp",
    monthly: 1299000,
    oldMonthly: 1699000,
    yearly: 1299000 * 10,
    tokens: 50000,
    liveMinutes: 6000,
    features: [
      "Livestream không giới hạn",
      "Chatbot AI thông minh",
      "Thời lượng Live 100 Giờ (6.000 phút)",
      "50.000 Tokens AI",
      "Hỗ trợ VIP 24/7",
      "Tích hợp API nâng cao"
    ],
    color: "from-[#10B981] to-[#34D399]",
    borderColor: "border-[#10B981]/30",
    btnText: "MUA NGAY",
    iconName: "Crown"
  },
  {
    id: "LIFETIME",
    name: "SUPER ADMIN VIP",
    desc: "Quyền quản trị viên tối cao",
    monthly: 9990000,
    oldMonthly: 14990000,
    yearly: 9990000,
    tokens: 100000,
    liveMinutes: 6000000,
    features: [
      "Tất cả tính năng cao cấp",
      "100.000 Giờ Live (6.000.000 phút)",
      "100.000 Tokens AI",
      "Quyền quản trị viên cao cấp",
      "Cập nhật miễn phí trọn đời"
    ],
    color: "from-[#F59E0B] to-[#FCD34D]",
    borderColor: "border-[#F59E0B]/50",
    btnText: "MUA NGAY",
    iconName: "Building2"
  }
];

export const getPlans = () => {
  try {
    const saved = localStorage.getItem('avalive_packages_configs');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error("Error reading packages config", e);
  }
  return defaultPlans;
};

export const plans = getPlans();
