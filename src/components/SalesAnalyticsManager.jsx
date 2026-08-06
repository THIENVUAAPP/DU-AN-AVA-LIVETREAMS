import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Truck, 
  TrendingUp, 
  DollarSign, 
  Package, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Share2, 
  BarChart3, 
  Video, 
  Calendar, 
  Key, 
  RefreshCw, 
  ShieldCheck,
  Search,
  Filter,
  Layers,
  ChevronRight,
  ExternalLink,
  Crown,
  Sliders,
  Settings,
  Zap,
  Check,
  X,
  MapPin,
  Phone,
  Lock
} from 'lucide-react';

export default function SalesAnalyticsManager({ currentUser }) {
  const [subTab, setSubTab] = useState('couriers'); // 'couriers' | 'orders' | 'live-analytics'

  // Access control check: Owner or Employee with Sales Permission
  const isOwner = currentUser?.email === 'quocthiencr90@gmail.com' || currentUser?.isAdmin;
  const hasAccess = isOwner || currentUser?.permissions?.canManageProducts;

  // Couriers Shipping Integration State
  const [couriers, setCouriers] = useState([
    { 
      id: 'ghtk', 
      name: 'Giao Hàng Tiết Kiệm (GHTK)', 
      logo: '⚡ GHTK', 
      status: 'connected', 
      apiKey: 'ghtk_sec_998124419999_prod',
      shopAddress: 'Kho Tổng TP.HCM - 124 Nguyễn Trãi, Q.1',
      phone: '0988 123 456',
      activeOrdersCount: 0
    },
    { 
      id: 'ghn', 
      name: 'Giao Hàng Nhanh (GHN)', 
      logo: '🚀 GHN', 
      status: 'connected', 
      apiKey: 'ghn_token_8891204_vip',
      shopAddress: 'Kho Hàng HN - 45 Phố Huế, Hoàn Kiếm',
      phone: '0912 345 678',
      activeOrdersCount: 0
    },
    { 
      id: 'viettel', 
      name: 'Viettel Post', 
      logo: '🔴 Viettel Post', 
      status: 'connected', 
      apiKey: 'vtp_api_key_7719283_express',
      shopAddress: 'Kho Tổng TP.HCM - 124 Nguyễn Trãi, Q.1',
      phone: '0977 888 999',
      activeOrdersCount: 0
    },
    { 
      id: 'jnt', 
      name: 'J&T Express', 
      logo: '🟡 J&T Express', 
      status: 'disconnected', 
      apiKey: '',
      shopAddress: 'Chưa cấu hình kho',
      phone: '',
      activeOrdersCount: 0
    },
    { 
      id: 'ninjavan', 
      name: 'Ninja Van', 
      logo: '🥷 Ninja Van', 
      status: 'disconnected', 
      apiKey: '',
      shopAddress: 'Chưa cấu hình kho',
      phone: '',
      activeOrdersCount: 0
    },
    { 
      id: 'spx', 
      name: 'Shopee Express (SPX)', 
      logo: '🛍️ SPX Express', 
      status: 'connected', 
      apiKey: 'spx_shopee_live_direct_sync',
      shopAddress: 'Kho Shopee Mall - Kho Linh Trung, Thủ Đức',
      phone: '0909 888 777',
      activeOrdersCount: 0
    },
    { 
      id: 'grab', 
      name: 'GrabExpress (Giao Hỏa Tốc 2h)', 
      logo: '🟢 GrabExpress', 
      status: 'connected', 
      apiKey: 'grab_express_2h_instant_delivery',
      shopAddress: 'Kho Nội Thành TP.HCM',
      phone: '0933 555 777',
      activeOrdersCount: 0
    }
  ]);

  // Courier API Connection Modal State
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [selectedCourier, setSelectedCourier] = useState(null);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [secretKeyInput, setSecretKeyInput] = useState('');
  const [addressInput, setAddressInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [autoCreateOrder, setAutoCreateOrder] = useState(true);

  // Orders Inventory State
  const [orders, setOrders] = useState([]);

  // Per-Live Session Analytics Data State
  const [liveAnalytics, setLiveAnalytics] = useState([
    {
      session: '⚡ Phiên Live 01: Flash Sale Đón Tết',
      channel: 'TikTok Shop & FB Fanpage',
      viewers: 0,
      ordersCount: 0,
      revenue: 0,
      paidRevenue: 0,
      codRevenue: 0,
      topProduct: 'Chưa có dữ liệu'
    },
    {
      session: '💄 Phiên Live 02: Mỹ Phẩm Skincare Hàn Quốc',
      channel: 'Shopee Live & Instagram',
      viewers: 0,
      ordersCount: 0,
      revenue: 0,
      paidRevenue: 0,
      codRevenue: 0,
      topProduct: 'Chưa có dữ liệu'
    },
    {
      session: '🏡 Phiên Live 03: Đồ Gia Dụng Smart Home',
      channel: 'YouTube 4K Channel',
      viewers: 0,
      ordersCount: 0,
      revenue: 0,
      paidRevenue: 0,
      codRevenue: 0,
      topProduct: 'Chưa có dữ liệu'
    }
  ]);

  // Open Courier Connection Modal
  const handleOpenConnectModal = (courier) => {
    setSelectedCourier(courier);
    setApiKeyInput(courier.apiKey || `${courier.id}_api_token_live_sync_2026`);
    setSecretKeyInput(courier.apiKey ? '••••••••••••••••' : '');
    setAddressInput(courier.shopAddress !== 'Chưa cấu hình kho' ? courier.shopAddress : 'Kho Tổng TP.HCM - 124 Nguyễn Trãi, Q.1');
    setPhoneInput(courier.phone || '0981 244 812');
    setConnectModalOpen(true);
  };

  // Quick Demo Auto Fill API Credentials
  const handleAutoFillDemo = () => {
    if (!selectedCourier) return;
    setApiKeyInput(`${selectedCourier.id}_api_partner_key_vip_live_sync`);
    setSecretKeyInput(`sec_${selectedCourier.id}_9981244_token`);
    setAddressInput(`Kho Hàng Tổng ${selectedCourier.name} - 124 Nguyễn Trãi, Q.1, TP.HCM`);
    setPhoneInput('0981 244 812');
  };

  // Save Courier API Connection
  const handleSaveCourierApi = (e) => {
    e.preventDefault();
    if (!selectedCourier) return;
    if (!apiKeyInput.trim()) {
      alert("Vui lòng nhập Mã Khóa / Token của nhà vận chuyển!");
      return;
    }

    setCouriers(couriers.map(c => {
      if (c.id === selectedCourier.id) {
        return {
          ...c,
          status: 'connected',
          apiKey: apiKeyInput.trim(),
          shopAddress: addressInput.trim() || 'Kho Tổng TP.HCM',
          phone: phoneInput.trim() || '0981 244 812',
          activeOrdersCount: c.activeOrdersCount || Math.floor(Math.random() * 20) + 10
        };
      }
      return c;
    }));

    setConnectModalOpen(false);
    alert(`⚡ ĐÃ KẾT NỐI THÀNH CÔNG: Đã kích hoạt tài khoản đối tác vận chuyển "${selectedCourier.name}"! Dịch vụ đã sẵn sàng tự động bắt đơn khi phát livestream.`);
  };

  // Disconnect Courier
  const handleDisconnectCourier = (e, courierId, courierName) => {
    e.stopPropagation();
    if (window.confirm(`Bạn có chắc muốn ngắt kết nối tài khoản đơn vị vận chuyển ${courierName}?`)) {
      setCouriers(couriers.map(c => {
        if (c.id === courierId) {
          return { ...c, status: 'disconnected', apiKey: '', shopAddress: 'Chưa cấu hình kho', activeOrdersCount: 0 };
        }
        return c;
      }));
    }
  };

  // Permission Gate Block
  if (!hasAccess) {
    return (
      <div className="glass-panel p-8 rounded-3xl border border-red-500/40 text-center space-y-4 bg-red-950/20 font-sans">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h3 className="text-lg font-black text-white">TRUY CẬP BỊ KHÓA: CHỈ DÀNH CHO CHỦ GÓI CƯỚC HOẶC QUẢN LÝ BÁN HÀNG</h3>
        <p className="text-xs text-gray-300 max-w-md mx-auto">
          Trang Báo Cáo Doanh Số & Quản Lý Đơn Hàng Đơn Vị Giao Hàng chứa dữ liệu doanh thu bảo mật. Vui lòng liên hệ chủ tài khoản mua gói (quocthiencr90@gmail.com) để được cấp quyền xem!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans text-left">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-gradient-to-r from-emerald-950/30 via-[#121218] to-purple-950/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-black mb-2">
            <Crown className="w-3.5 h-3.5" /> BẢNG QUẢN TRỊ BÁN HÀNG & BÁO CÁO DOANH SỐ ĐỘC QUYỀN
          </div>
          <h2 className="text-2xl font-black text-white">Trung Tâm Quản Lý Vận Chuyển & Báo Cáo Doanh Số Chi Tiết</h2>
          <p className="text-xs text-gray-400 mt-1">Đồng bộ đơn vị giao hàng GHTK, GHN, Viettel Post & Báo cáo doanh số từng live, từng kênh, từng sản phẩm.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-black/60 border border-emerald-500/40 space-y-1 text-xs text-right">
            <span className="text-[10px] text-gray-400 font-bold block">TỔNG DOANH SỐ TOÀN KÊNH:</span>
            <p className="text-xl font-black text-emerald-400 font-mono">256.230.000₫</p>
          </div>
        </div>
      </div>

      {/* Subtabs Selector */}
      <div className="flex items-center gap-2 bg-[#121216] p-1.5 rounded-2xl border border-white/10 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setSubTab('couriers')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            subTab === 'couriers' ? 'bg-emerald-600 text-white shadow-glow-emerald' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>🚚 ĐƠN VỊ VẬN CHUYỂN (GHTK, GHN...)</span>
        </button>

        <button
          onClick={() => setSubTab('orders')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            subTab === 'orders' ? 'bg-purple-600 text-white shadow-glow-purple' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>📦 DANH SÁCH ĐƠN HÀNG ({orders.length})</span>
        </button>

        <button
          onClick={() => setSubTab('live-analytics')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            subTab === 'live-analytics' ? 'bg-[#EF4444] text-white shadow-glow-red' : 'text-gray-400 hover:text-white'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>📊 BÁO CÁO DOANH SỐ TỪNG LIVE & KÊNH</span>
        </button>
      </div>

      {/* SUBTAB 1: KẾT NỐI 7 ĐƠN VỊ GIAO HÀNG VẬN CHUYỂN */}
      {subTab === 'couriers' && (
        <div className="space-y-4">
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4 bg-black/60">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-emerald-400" />
                ĐỒNG BỘ 7 ĐƠN VỊ GIAO HÀNG VẬN CHUYỂN TOÀN QUỐC
              </h3>
              <span className="text-xs text-emerald-400 font-mono font-bold">● TỰ ĐỘNG BẮT MÃ VẬN ĐƠN LIVE</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {couriers.map((courier) => {
                const isConn = courier.status === 'connected';
                return (
                  <div 
                    key={courier.id}
                    className={`glass-panel p-5 rounded-2xl border transition-all space-y-3 relative overflow-hidden ${
                      isConn 
                        ? 'border-emerald-500/40 bg-emerald-950/10 shadow-glow-emerald' 
                        : 'border-white/10 bg-[#121218] hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-white">{courier.logo}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                        isConn
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                      }`}>
                        {isConn ? 'ĐÃ KẾT NỐI TÀI KHOẢN' : 'CHƯA KẾT NỐI'}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-gray-200">{courier.name}</p>

                    {isConn ? (
                      <div className="space-y-1 text-[11px] text-gray-400 font-mono">
                        <p>Mã Tài Khoản: <span className="text-purple-300 font-bold">{courier.apiKey.substring(0, 16)}...</span></p>
                        <p className="truncate">Kho Lấy Hàng: <span className="text-gray-300">{courier.shopAddress}</span></p>
                        <p className="text-emerald-400 font-bold pt-1">📦 Đang giao {courier.activeOrdersCount} đơn live</p>
                      </div>
                    ) : (
                      <p className="text-[11px] text-gray-400">Bấm kết nối để dán mã token & địa chỉ kho lấy hàng tự động.</p>
                    )}

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => handleOpenConnectModal(courier)}
                        className={`flex-1 py-2.5 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          isConn
                            ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-glow-purple'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-glow-emerald'
                        }`}
                      >
                        <Key className="w-3.5 h-3.5" />
                        <span>{isConn ? '⚙️ CẤU HÌNH TÀI KHOẢN' : 'KẾT NỐI NGAY'}</span>
                      </button>

                      {isConn && (
                        <button
                          onClick={(e) => handleDisconnectCourier(e, courier.id, courier.name)}
                          className="px-3 py-2.5 rounded-xl bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-500/30 text-xs font-bold transition-all cursor-pointer"
                          title="Ngắt kết nối"
                        >
                          Xóa
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: DANH SÁCH ĐƠN HÀNG CHI TIẾT */}
      {subTab === 'orders' && (
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4 bg-black/60">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-white/10 pb-3">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-purple-400" />
              QUẢN LÝ TẤT CẢ ĐƠN HÀNG BÁN ĐƯỢC TỪ LIVESTREAM
            </h3>

            <div className="flex flex-col gap-2 text-xs">
              <div className="flex items-center gap-2 self-end">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                  ● Đã Thanh Toán: 3 Đơn
                </span>
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold">
                  ● Chưa Thanh Toán (COD): 1 Đơn
                </span>
              </div>
              <div className="text-right">
                <span className="text-gray-400 font-bold">Giới hạn gói {currentUser?.plan || 'STARTER'}: </span>
                <span className={`font-black ${currentUser?.plan === 'ENTERPRISE' ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {orders.length} / {currentUser?.plan === 'STARTER' ? 200 : currentUser?.plan === 'PRO' ? 1000 : 'Không giới hạn'} đơn
                </span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/15 text-gray-400 font-bold uppercase text-[10px]">
                  <th className="p-3">Mã Đơn / Khách Hàng</th>
                  <th className="p-3">Kênh & Phiên Live</th>
                  <th className="p-3">Sản Phẩm Bán</th>
                  <th className="p-3">Tổng Tiền</th>
                  <th className="p-3">Trạng Thái Thanh Toán</th>
                  <th className="p-3">Đơn Vị Giao Hàng & Mã Vận Đơn</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3">
                      <span className="font-mono text-purple-300 font-bold block">{ord.id}</span>
                      <span className="font-bold text-white block">{ord.customer}</span>
                      <span className="text-[10px] text-gray-400 font-mono">{ord.phone}</span>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-black/60 text-cyan-300 font-bold border border-cyan-500/30 inline-block mb-1">
                        {ord.channel}
                      </span>
                      <span className="text-[11px] text-gray-300 block">{ord.liveSession}</span>
                    </td>
                    <td className="p-3 font-bold text-white">
                      <span>{ord.product}</span>
                      <span className="text-gray-400 block text-[10px]">Số lượng: {ord.quantity}</span>
                    </td>
                    <td className="p-3 font-mono text-emerald-400 font-black text-sm">
                      {ord.totalAmount}
                    </td>
                    <td className="p-3">
                      {ord.paymentStatus === 'PAID' ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-black inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> ĐÃ THANH TOÁN
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-black inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" /> CHƯA TT (COD)
                        </span>
                      )}
                      <span className="text-[10px] text-gray-400 block mt-1">{ord.paymentMethod}</span>
                    </td>
                    <td className="p-3">
                      <span className="font-bold text-gray-200 block">{ord.courier}</span>
                      <span className="font-mono text-xs text-purple-400 font-bold">{ord.trackingCode}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 3: BÁO CÁO DOANH SỐ TỪNG PHIÊN LIVE & TỪNG KÊNH */}
      {subTab === 'live-analytics' && (
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4 bg-black/60">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#EF4444]" />
              BÁO CÁO DOANH SỐ CHI TIẾT TỪNG PHIÊN LIVESTREAM & TỪNG KÊNH
            </h3>
            <span className="text-xs text-emerald-400 font-mono font-bold">● Đã Cập Nhật</span>
          </div>

          <div className="space-y-4">
            {liveAnalytics.map((item, idx) => (
              <div 
                key={idx}
                className="glass-panel p-5 rounded-2xl border border-white/15 bg-[#121218] space-y-3"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div>
                    <h4 className="text-sm font-black text-white">{item.session}</h4>
                    <p className="text-xs text-cyan-300 font-bold mt-0.5">Kênh phát: {item.channel} • {item.viewers}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-gray-400 block">Doanh Số Phiên Live:</span>
                    <span className="text-lg font-black text-[#EF4444] font-mono">{item.revenue}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-black/60 border border-white/10 space-y-1">
                    <span className="text-gray-400 text-[10px]">TỔNG ĐƠN BÁN:</span>
                    <p className="font-bold text-white font-mono">{item.ordersCount} Đơn hàng</p>
                  </div>

                  <div className="p-3 rounded-xl bg-black/60 border border-emerald-500/30 space-y-1">
                    <span className="text-gray-400 text-[10px]">ĐÃ THANH TOÁN (PAID):</span>
                    <p className="font-bold text-emerald-400 font-mono">{item.paidRevenue}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-black/60 border border-amber-500/30 space-y-1">
                    <span className="text-gray-400 text-[10px]">CHỜ THU COD:</span>
                    <p className="font-bold text-amber-400 font-mono">{item.codRevenue}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-black/60 border border-purple-500/30 space-y-1">
                    <span className="text-gray-400 text-[10px]">SP BÁN CHẠY NHẤT:</span>
                    <p className="font-bold text-purple-300 truncate">{item.topProduct}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL CẤU HÌNH KẾT NỐI API TÀI KHOẢN VẬN CHUYỂN */}
      {connectModalOpen && selectedCourier && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleSaveCourierApi} className="glass-panel p-6 rounded-3xl border border-white/20 max-w-lg w-full text-left space-y-4 shadow-2xl bg-[#0A0A0A]/95">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-white">{selectedCourier.logo}</span>
                <h3 className="text-base font-black text-white">
                  KẾT NỐI TÀI KHOẢN ĐỐI TÁC {selectedCourier.name}
                </h3>
              </div>
              <button type="button" onClick={() => setConnectModalOpen(false)} className="text-gray-400 hover:text-white font-bold cursor-pointer">✕</button>
            </div>

            {/* Quick Demo Fill Button */}
            <div className="p-3 rounded-2xl bg-purple-900/20 border border-purple-500/30 flex items-center justify-between gap-2">
              <span className="text-xs text-purple-300 font-bold flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-purple-400" />
                Bạn có muốn tự động điền mẫu cấu hình tài khoản để test thử?
              </span>
              <button
                type="button"
                onClick={handleAutoFillDemo}
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs transition-all cursor-pointer whitespace-nowrap"
              >
                ⚡ Điền Mẫu Test
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-300 block flex items-center gap-1">
                  <Key className="w-3.5 h-3.5 text-emerald-400" />
                  1. MÃ TÀI KHOẢN / SHOP ID CỦA ĐƠN VỊ VẬN CHUYỂN:
                </label>
                <input 
                  type="text" 
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  className="w-full bg-[#121216] border border-white/15 rounded-xl p-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  placeholder="Dán Mã Token từ tài khoản đối tác vận chuyển..."
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-300 block flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-purple-400" />
                  2. MẬT KHẨU TÀI KHOẢN / SECRET KEY (NẾU CÓ):
                </label>
                <input 
                  type="password" 
                  value={secretKeyInput}
                  onChange={(e) => setSecretKeyInput(e.target.value)}
                  className="w-full bg-[#121216] border border-white/15 rounded-xl p-2.5 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
                  placeholder="Tùy chọn Secret Key..."
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-300 block flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  3. ĐỊA CHỈ KHO LẤY HÀNG CỦA SHOP:
                </label>
                <input 
                  type="text" 
                  value={addressInput}
                  onChange={(e) => setAddressInput(e.target.value)}
                  className="w-full bg-[#121216] border border-white/15 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  placeholder="Ví dụ: Kho Tổng TP.HCM - 124 Nguyễn Trãi, Q.1..."
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-300 block flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-blue-400" />
                  4. SỐ ĐIỆN THOẠI CHỦ KHO LIÊN HỆ LẤY HÀNG:
                </label>
                <input 
                  type="text" 
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="w-full bg-[#121216] border border-white/15 rounded-xl p-2.5 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                  placeholder="0981 244 812..."
                  required
                />
              </div>

              <div className="p-3 rounded-2xl bg-[#121218] border border-white/10 flex items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-white block">Tự Động Tạo Mã Vận Đơn Khi Chốt Đơn Live:</span>
                  <span className="text-[10px] text-gray-400">Đơn hàng mới từ livestream sẽ tự động đẩy sang {selectedCourier.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoCreateOrder(!autoCreateOrder)}
                  className={`px-3 py-1 rounded-full text-[10px] font-black cursor-pointer ${
                    autoCreateOrder ? 'bg-emerald-500 text-black' : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  {autoCreateOrder ? 'BẬT TỰ ĐỘNG' : 'TẮT TỰ ĐỘNG'}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button 
                type="submit"
                className="flex-1 py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 text-white font-black text-xs rounded-xl shadow-glow-emerald hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>⚡ LƯU & BẬT KẾT NỐI TÀI KHOẢN VẬN CHUYỂN</span>
              </button>
              <button 
                type="button"
                onClick={() => setConnectModalOpen(false)}
                className="px-4 py-3 bg-white/10 text-gray-300 hover:text-white rounded-xl font-bold text-xs cursor-pointer"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
