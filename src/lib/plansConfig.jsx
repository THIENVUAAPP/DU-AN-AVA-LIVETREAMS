import React from 'react';
import { MonitorPlay, Zap, Crown, Building2 } from 'lucide-react';

export const plans = [
  {
    name: "MIỄN PHÍ",
    desc: "Trải nghiệm cơ bản, không giới hạn thời gian",
    monthly: 0,
    oldMonthly: 0,
    yearly: 0,
    features: [
      "Livestream 1 nền tảng",
      "Tự động chốt đơn (50 đơn/tháng)",
      "Chatbot AI mẫu cơ bản",
      "Hỗ trợ qua cộng đồng"
    ],
    color: "from-gray-400 to-gray-100",
    borderColor: "border-gray-500/30",
    btnText: "BẮT ĐẦU MIỄN PHÍ",
    icon: <MonitorPlay className="w-5 h-5 text-gray-300" />
  },
  {
    name: "CHUYÊN NGHIỆP",
    desc: "Dành cho shop bán hàng chuyên nghiệp",
    monthly: 599000,
    oldMonthly: 799000,
    yearly: 599000 * 10,
    features: [
      "Livestream 5 nền tảng",
      "Chatbot AI nâng cao",
      "500 đơn hàng/tháng",
      "Thanh toán tự động",
      "Báo cáo doanh số chi tiết",
      "Hỗ trợ ưu tiên 24/7",
      "Tích hợp API"
    ],
    isPopular: true,
    color: "from-[#3B82F6] to-[#60A5FA]",
    borderColor: "border-[#3B82F6]",
    btnText: "MUA NGAY",
    icon: <Zap className="w-5 h-5 text-blue-300" />
  },
  {
    name: "DOANH NGHIỆP",
    desc: "Dành cho doanh nghiệp vừa và lớn",
    monthly: 1299000,
    oldMonthly: 1699000,
    yearly: 1299000 * 10,
    features: [
      "Livestream không giới hạn",
      "Chatbot AI thông minh",
      "Không giới hạn đơn hàng",
      "Thanh toán tự động nâng cao",
      "Báo cáo nâng cao",
      "Hỗ trợ VIP 24/7",
      "Tích hợp API nâng cao"
    ],
    color: "from-[#10B981] to-[#34D399]",
    borderColor: "border-[#10B981]/30",
    btnText: "MUA NGAY",
    icon: <Crown className="w-5 h-5 text-emerald-300" />
  },
  {
    name: "TRỌN ĐỜI",
    desc: "Sở hữu trọn đời - Không phí hằng tháng",
    monthly: 9990000,
    oldMonthly: 14990000,
    yearly: 9990000,
    features: [
      "Tất cả tính năng cao cấp",
      "Livestream không giới hạn",
      "Không giới hạn đơn hàng",
      "Hỗ trợ VIP trọn đời",
      "Cập nhật miễn phí trọn đời",
      "Tích hợp API nâng cao"
    ],
    color: "from-[#F59E0B] to-[#FCD34D]",
    borderColor: "border-[#F59E0B]/50",
    btnText: "MUA NGAY",
    icon: <Building2 className="w-5 h-5 text-amber-300" />
  }
];
