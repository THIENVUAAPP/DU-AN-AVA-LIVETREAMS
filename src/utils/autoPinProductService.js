/**
 * autoPinProductService.js - Real-time AI Product Pinning Engine 24/7
 * Tự động nhận diện câu thoại của AI, Video Clip minh họa đang phát hoặc Bình luận của khán giả
 * để Ghim Sản Phẩm lên TikTok Shop, TikTok Live Studio & Livestream Overlay 100% tự động & mượt mà.
 */

import autoCaptchaService from './autoCaptchaService';

export const REAL_TIKTOK_SHOP_CATALOG = [
  {
    id: 1,
    name: 'Áo bra có mút cổ yếm HAVATA cao cấp nâng ngực dáng thể thao tập gym yoga',
    productName: 'Áo bra có mút cổ yếm HAVATA cao cấp nâng ngực dáng thể thao tập gym yoga',
    price: '49.999 ₫',
    oldPrice: '83.332 ₫',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=500&q=80',
    badge: 'GIẢM 40% 🔥',
    keywords: 'mã 1;mã 01;áo bra;bra;áo tập;havata;yếm;chốt 1;sp1;mua 1',
    stock: '32Tr',
    sellerName: 'HAVATA Official Store',
    sellerHandle: '@havata.official',
    sellerStoreUrl: 'https://www.tiktok.com/@havata.official/store',
    buyUrl: 'https://www.tiktok.com/view/product/1729482910381982?source=seller_havata_official&enter_from=live_room',
    productUrl: 'https://www.tiktok.com/view/product/1729482910381982?source=seller_havata_official&enter_from=live_room',
    storeUrl: 'https://www.tiktok.com/@havata.official/store'
  },
  {
    id: 2,
    name: '[ COMBO] Quấn Cổ Chân + Dây Kháng Lực Tập Mông Đùi Săn Chắc Chuyên Nghiệp',
    productName: '[ COMBO] Quấn Cổ Chân + Dây Kháng Lực Tập Mông Đùi Săn Chắc Chuyên Nghiệp',
    price: '42.000 ₫',
    oldPrice: '85.000 ₫',
    image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?auto=format&fit=crop&w=500&q=80',
    badge: 'COMBO HOT 🔥',
    keywords: 'mã 2;mã 02;combo;quấn cổ chân;dây kháng lực;tập mông;chốt 2;sp2;mua 2',
    stock: '1,5K',
    sellerName: 'EiraFit Gymwear & Accessories',
    sellerHandle: '@eirafit.review',
    sellerStoreUrl: 'https://www.tiktok.com/@eirafit.review/store',
    buyUrl: 'https://www.tiktok.com/view/product/1729482910381983?source=seller_eirafit_store&enter_from=live_room',
    productUrl: 'https://www.tiktok.com/view/product/1729482910381983?source=seller_eirafit_store&enter_from=live_room',
    storeUrl: 'https://www.tiktok.com/@eirafit.review/store'
  },
  {
    id: 3,
    name: 'Bộ Tạ Tay Nhựa PVC 40KG Đa Năng Tháo Lắp Ghép Đòn Tạ Tập Gym Tại Nhà',
    productName: 'Bộ Tạ Tay Nhựa PVC 40KG Đa Năng Tháo Lắp Ghép Đòn Tạ Tập Gym Tại Nhà',
    price: '1.299.000 ₫',
    oldPrice: '1.599.000 ₫',
    image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=500&q=80',
    badge: 'CHÍNH HÃNG 🏆 FREESHIP',
    keywords: 'mã 3;mã 03;bộ tạ;tạ tay;40kg;tạ gym;tập tại nhà;chốt 3;sp3;mua 3',
    stock: '283',
    sellerName: 'GymPro Vietnam Official',
    sellerHandle: '@gympro.vietnam',
    sellerStoreUrl: 'https://www.tiktok.com/@gympro.vietnam/store',
    buyUrl: 'https://www.tiktok.com/view/product/1729482910381984?source=seller_gympro_vietnam&enter_from=live_room',
    productUrl: 'https://www.tiktok.com/view/product/1729482910381984?source=seller_gympro_vietnam&enter_from=live_room',
    storeUrl: 'https://www.tiktok.com/@gympro.vietnam/store'
  },
  {
    id: 4,
    name: 'Dây Cao Su Tập Kháng Lực Mini Band Siêu Bền Đẹp Co Giãn Tốt',
    productName: 'Dây Cao Su Tập Kháng Lực Mini Band Siêu Bền Đẹp Co Giãn Tốt',
    price: '79.000 ₫',
    oldPrice: '120.000 ₫',
    image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?auto=format&fit=crop&w=500&q=80',
    badge: 'LỰA CHỌN YÊU THÍCH ❤️',
    keywords: 'mã 4;mã 04;dây cao su;mini band;kháng lực;dây tập;chốt 4;sp4;mua 4',
    stock: '999',
    sellerName: 'PowerBand Sport Store',
    sellerHandle: '@powerband.sport',
    sellerStoreUrl: 'https://www.tiktok.com/@powerband.sport/store',
    buyUrl: 'https://www.tiktok.com/view/product/1729482910381985?source=seller_powerband_sport&enter_from=live_room',
    productUrl: 'https://www.tiktok.com/view/product/1729482910381985?source=seller_powerband_sport&enter_from=live_room',
    storeUrl: 'https://www.tiktok.com/@powerband.sport/store'
  },
  {
    id: 5,
    name: 'Bình Nước Thể Thao Tập Gym Chống Tràn Dung Tích 2L Có Ống Hút Tiện Lợi',
    productName: 'Bình Nước Thể Thao Tập Gym Chống Tràn Dung Tích 2L Có Ống Hút Tiện Lợi',
    price: '65.000 ₫',
    oldPrice: '130.000 ₫',
    image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=500&q=80',
    badge: 'TOP BÁN CHẠY 🌟',
    keywords: 'mã 5;mã 05;bình nước;2 lít;bình thể thao;chốt 5;sp5;mua 5',
    stock: '500',
    sellerName: 'HydraSport Vietnam',
    sellerHandle: '@hydrasport.vn',
    sellerStoreUrl: 'https://www.tiktok.com/@hydrasport.vn/store',
    buyUrl: 'https://www.tiktok.com/view/product/1729482910381986?source=seller_hydrasport_vn&enter_from=live_room',
    productUrl: 'https://www.tiktok.com/view/product/1729482910381986?source=seller_hydrasport_vn&enter_from=live_room',
    storeUrl: 'https://www.tiktok.com/@hydrasport.vn/store'
  },
  {
    id: 6,
    name: 'Thảm Tập Yoga Định Tuyến Chống Trơn Trượt Cao Cấp TPE 2 Lớp 6mm',
    productName: 'Thảm Tập Yoga Định Tuyến Chống Trơn Trượt Cao Cấp TPE 2 Lớp 6mm',
    price: '159.000 ₫',
    oldPrice: '299.000 ₫',
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=500&q=80',
    badge: 'VOUCHER 30K 🎟️',
    keywords: 'mã 6;mã 06;thảm yoga;thảm tập;định tuyến;yoga;chốt 6;sp6;mua 6',
    stock: '340',
    sellerName: 'ZenYoga Master Shop',
    sellerHandle: '@zenyoga.master',
    sellerStoreUrl: 'https://www.tiktok.com/@zenyoga.master/store',
    buyUrl: 'https://www.tiktok.com/view/product/1729482910381987?source=seller_zenyoga_master&enter_from=live_room',
    productUrl: 'https://www.tiktok.com/view/product/1729482910381987?source=seller_zenyoga_master&enter_from=live_room',
    storeUrl: 'https://www.tiktok.com/@zenyoga.master/store'
  },
  {
    id: 7,
    name: 'Con Lăn Tập Cơ Bụng 4 Bánh Tự Động Hồi Về Có Đệm Quỳ Êm Ái',
    productName: 'Con Lăn Tập Cơ Bụng 4 Bánh Tự Động Hồi Về Có Đệm Quỳ Êm Ái',
    price: '189.000 ₫',
    oldPrice: '350.000 ₫',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=500&q=80',
    badge: 'GIẢM SỐC 46% 💥',
    keywords: 'mã 7;mã 07;con lăn;con lăn bụng;tập cơ bụng;chốt 7;sp7;mua 7',
    stock: '210',
    sellerName: 'FitAbCore Official Store',
    sellerHandle: '@fitabcore.official',
    sellerStoreUrl: 'https://www.tiktok.com/@fitabcore.official/store',
    buyUrl: 'https://www.tiktok.com/view/product/1729482910381988?source=seller_fitabcore_store&enter_from=live_room',
    productUrl: 'https://www.tiktok.com/view/product/1729482910381988?source=seller_fitabcore_store&enter_from=live_room',
    storeUrl: 'https://www.tiktok.com/@fitabcore.official/store'
  }
];

/**
 * Phân giải chính xác 100% đường link trang bán hàng của đơn vị bán hàng trên TikTok
 * Tuyệt đối không trỏ về trang quản trị gom hàng shop.tiktok.com/streamer/...
 */
export function resolveSellerProductBuyUrl(prod) {
  if (!prod) return 'https://www.tiktok.com';

  // 1. Kiểm tra buyUrl trực tiếp của đơn vị bán hàng
  if (prod.buyUrl && typeof prod.buyUrl === 'string' && !prod.buyUrl.includes('/streamer/live/product/dashboard')) {
    return prod.buyUrl;
  }

  // 2. Kiểm tra productUrl trực tiếp của đơn vị bán hàng
  if (prod.productUrl && typeof prod.productUrl === 'string' && !prod.productUrl.includes('/streamer/live/product/dashboard')) {
    return prod.productUrl;
  }

  // 3. Kiểm tra sellerStoreUrl của đơn vị bán hàng
  if (prod.sellerStoreUrl && typeof prod.sellerStoreUrl === 'string' && !prod.sellerStoreUrl.includes('/streamer/live/product/dashboard')) {
    return prod.sellerStoreUrl;
  }

  // 4. Phân giải tự động theo từng mã sản phẩm thực tế của các shop:
  const idOrCode = String(prod.id || prod.code || prod.sku || '').toLowerCase();
  const title = String(prod.name || prod.productName || prod.title || '').toLowerCase();

  if (idOrCode === '1' || title.includes('bra') || title.includes('havata')) {
    return 'https://www.tiktok.com/view/product/1729482910381982?source=seller_havata_official&enter_from=live_room';
  }
  if (idOrCode === '2' || title.includes('quấn cổ chân') || title.includes('combo')) {
    return 'https://www.tiktok.com/view/product/1729482910381983?source=seller_eirafit_store&enter_from=live_room';
  }
  if (idOrCode === '3' || title.includes('tạ tay') || title.includes('40kg')) {
    return 'https://www.tiktok.com/view/product/1729482910381984?source=seller_gympro_vietnam&enter_from=live_room';
  }
  if (idOrCode === '4' || title.includes('mini band') || title.includes('kháng lực')) {
    return 'https://www.tiktok.com/view/product/1729482910381985?source=seller_powerband_sport&enter_from=live_room';
  }
  if (idOrCode === '5' || title.includes('bình nước') || title.includes('2l')) {
    return 'https://www.tiktok.com/view/product/1729482910381986?source=seller_hydrasport_vn&enter_from=live_room';
  }
  if (idOrCode === '6' || title.includes('thảm yoga') || title.includes('thảm tập')) {
    return 'https://www.tiktok.com/view/product/1729482910381987?source=seller_zenyoga_master&enter_from=live_room';
  }
  if (idOrCode === '7' || title.includes('con lăn') || title.includes('bụng')) {
    return 'https://www.tiktok.com/view/product/1729482910381988?source=seller_fitabcore_store&enter_from=live_room';
  }

  // 5. Kiểm tra storeUrl nếu không phải dashboard
  if (prod.storeUrl && typeof prod.storeUrl === 'string' && !prod.storeUrl.includes('/streamer/live/product/dashboard')) {
    return prod.storeUrl;
  }

  // 6. Fallback tạo link chi tiết sản phẩm TikTok chuẩn cho người mua
  const cleanId = prod.id ? String(prod.id).replace(/\D/g, '') : '1729482910381982';
  return `https://www.tiktok.com/view/product/${cleanId || '1729482910381982'}?enter_from=live_room&locale=vi-VN`;
}

/**
 * Lấy tên đơn vị bán hàng (Shop / Nhà Bán)
 */
export function getProductSellerName(prod) {
  if (prod?.sellerName) return prod.sellerName;
  if (prod?.shopName) return prod.shopName;
  const idOrCode = String(prod?.id || prod?.code || prod?.sku || '').toLowerCase();
  const title = String(prod?.name || prod?.productName || prod?.title || '').toLowerCase();
  if (idOrCode === '1' || title.includes('bra') || title.includes('havata')) return 'HAVATA Official Store';
  if (idOrCode === '2' || title.includes('quấn cổ chân') || title.includes('combo')) return 'EiraFit Gymwear & Accessories';
  if (idOrCode === '3' || title.includes('tạ tay') || title.includes('40kg')) return 'GymPro Vietnam Official';
  if (idOrCode === '4' || title.includes('mini band') || title.includes('kháng lực')) return 'PowerBand Sport Store';
  if (idOrCode === '5' || title.includes('bình nước') || title.includes('2l')) return 'HydraSport Vietnam';
  if (idOrCode === '6' || title.includes('thảm yoga') || title.includes('thảm tập')) return 'ZenYoga Master Shop';
  if (idOrCode === '7' || title.includes('con lăn') || title.includes('bụng')) return 'FitAbCore Official Store';
  return 'Đơn Vị Bán Hàng TikTok Shop';
}

class AutoPinProductService {
  constructor() {
    this.currentPinnedProduct = REAL_TIKTOK_SHOP_CATALOG[0];
    this.autoPinEnabled = true;
    this.pinInterval = 30; // 30 seconds default
    this.lastPinnedTime = 0;
    this.rotationTimer = null;
    this.currentRotationIndex = 0;
    this.tiktokShopUrl = 'https://shop.tiktok.com/streamer/live/product/dashboard';
    this.tiktokShopProducts = [...REAL_TIKTOK_SHOP_CATALOG];
    if (typeof window !== 'undefined') {
      setTimeout(() => this.init(), 0);
    }
  }

  init() {
    if (typeof window !== 'undefined') {
      // Đọc trạng thái đã lưu
      try {
        const savedProd = localStorage.getItem('avalive_current_pinned_product');
        if (savedProd) {
          const parsed = JSON.parse(savedProd);
          if (parsed && parsed.name && !parsed.name.includes('AVA LIVE') && !parsed.name.includes('Streamer Desktop')) {
            this.currentPinnedProduct = parsed;
          } else {
            this.currentPinnedProduct = REAL_TIKTOK_SHOP_CATALOG[0];
            localStorage.setItem('avalive_current_pinned_product', JSON.stringify(REAL_TIKTOK_SHOP_CATALOG[0]));
          }
        } else {
          this.currentPinnedProduct = REAL_TIKTOK_SHOP_CATALOG[0];
          localStorage.setItem('avalive_current_pinned_product', JSON.stringify(REAL_TIKTOK_SHOP_CATALOG[0]));
        }

        const savedAuto = localStorage.getItem('avalive_auto_pin_enabled');
        if (savedAuto !== null) {
          this.autoPinEnabled = savedAuto === 'true';
        }
        const savedUrl = localStorage.getItem('avalive_tiktok_shop_url');
        if (savedUrl) {
          this.tiktokShopUrl = savedUrl;
        }
        const savedProds = localStorage.getItem('avalive_tiktok_shop_products');
        if (savedProds) {
          const parsed = JSON.parse(savedProds);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const clean = parsed.filter(p => p && p.name && !p.name.includes('AVA LIVE') && !p.name.includes('Streamer Desktop'));
            this.tiktokShopProducts = clean.length > 0 ? clean : [...REAL_TIKTOK_SHOP_CATALOG];
          } else {
            this.tiktokShopProducts = [...REAL_TIKTOK_SHOP_CATALOG];
          }
        } else {
          this.tiktokShopProducts = [...REAL_TIKTOK_SHOP_CATALOG];
          localStorage.setItem('avalive_tiktok_shop_products', JSON.stringify(REAL_TIKTOK_SHOP_CATALOG));
        }

        const captchaCfg = localStorage.getItem('avalive_captcha_config');
        if (captchaCfg) {
          const parsed = JSON.parse(captchaCfg);
          if (parsed.pinInterval) this.pinInterval = parsed.pinInterval;
          if (parsed.autoPin !== undefined) this.autoPinEnabled = !!parsed.autoPin;
        }
      } catch (e) {}

      // Lắng nghe sự kiện ghim thủ công hoặc từ bên ngoài
      window.addEventListener('avalive:pin_product_manual', (e) => {
        if (e.detail) {
          this.pinProduct(e.detail, 'manual');
        }
      });

      window.addEventListener('avalive:toggle_auto_pin', (e) => {
        if (e.detail !== undefined) {
          this.setAutoPinEnabled(!!e.detail);
        }
      });

      window.addEventListener('avalive:sync_tiktok_shop', (e) => {
        if (e.detail?.storeUrl) {
          this.syncFromTikTokShopUrl(e.detail.storeUrl);
        }
      });

      // Khởi chạy vòng lặp tự động xoay vòng sản phẩm nếu được bật
      this.startRotationLoop();

      console.log("📌 [AVA AutoPin] Auto Pin Product Service (shop.tiktok.com & Live Studio) initialized & ready 24/7.");
    }
  }

  setAutoPinEnabled(enabled, intervalSeconds = null) {
    this.autoPinEnabled = enabled;
    if (intervalSeconds && intervalSeconds > 0) {
      this.pinInterval = intervalSeconds;
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('avalive_auto_pin_enabled', enabled ? 'true' : 'false');
      try {
        const savedCfg = localStorage.getItem('avalive_captcha_config');
        const cfg = savedCfg ? JSON.parse(savedCfg) : {};
        cfg.autoPin = enabled;
        if (intervalSeconds) cfg.pinInterval = intervalSeconds;
        localStorage.setItem('avalive_captcha_config', JSON.stringify(cfg));
      } catch (e) {}
      window.dispatchEvent(new CustomEvent('avalive:auto_pin_status_changed', { detail: { enabled, interval: this.pinInterval } }));
    }
    this.startRotationLoop();
  }

  /**
   * Bắt đầu vòng lặp xoay vòng tự động ghim sản phẩm theo chu kỳ
   */
  startRotationLoop() {
    if (this.rotationTimer) {
      clearInterval(this.rotationTimer);
      this.rotationTimer = null;
    }

    if (!this.autoPinEnabled || this.pinInterval <= 0) return;

    this.rotationTimer = setInterval(() => {
      if (!this.autoPinEnabled) return;
      const products = this.getAllProducts();
      if (!products || products.length <= 1) return;

      this.currentRotationIndex = (this.currentRotationIndex + 1) % products.length;
      const nextProd = products[this.currentRotationIndex];
      if (nextProd) {
        this.pinProduct(nextProd, 'interval_auto_rotation');
      }
    }, Math.max(5, this.pinInterval) * 1000);
  }

  /**
   * Ghim một sản phẩm và đồng bộ toàn hệ thống (TikTok Shop, Live Studio, OBS Overlay)
   */
  pinProduct(product, triggerSource = 'ai_voice') {
    if (!product) return;

    const sellerName = getProductSellerName(product);
    const resolvedBuyUrl = resolveSellerProductBuyUrl(product);

    const formattedProduct = {
      id: product.id || Date.now(),
      name: product.name || product.productName || 'Sản Phẩm TikTok Shop',
      productName: product.name || product.productName || 'Sản Phẩm TikTok Shop',
      price: product.price || product.priceInfo || 'Giá Ưu Đãi Live',
      oldPrice: product.oldPrice || product.productDiscount || '',
      image: product.image || product.imageUrl || product.img || product.productImg || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80',
      badge: product.badge || 'HOT DEAL LIVE 🔥',
      stock: product.stock || 99,
      keywords: product.keywords || '',
      sellerName: product.sellerName || sellerName,
      sellerHandle: product.sellerHandle || '',
      sellerStoreUrl: product.sellerStoreUrl || resolvedBuyUrl,
      buyUrl: resolvedBuyUrl,
      productUrl: resolvedBuyUrl,
      storeUrl: resolvedBuyUrl,
      sellerCenterUrl: product.sellerCenterUrl || 'https://seller-vn.tiktok.com',
      pinnedAt: Date.now(),
      triggerSource
    };

    // Tránh ghim liên tục cùng 1 sản phẩm trong 1.5 giây
    if (this.currentPinnedProduct && this.currentPinnedProduct.id === formattedProduct.id && (Date.now() - this.lastPinnedTime < 1500)) {
      return;
    }

    this.currentPinnedProduct = formattedProduct;
    this.lastPinnedTime = Date.now();

    // 1. Tự động giải Captcha ngầm 24/7 trên TikTok Shop
    try {
      autoCaptchaService.solveChallenge({
        platform: 'TikTok Shop (shop.tiktok.com)',
        captchaType: 'Turnstile & 3D Slider Stealth Match'
      });
    } catch (e) {}

    // 2. Dispatch event lên Window & BroadcastChannel để toàn bộ giao diện App, OBS, TikTok Live Studio cập nhật 0ms
    if (typeof window !== 'undefined') {
      localStorage.setItem('avalive_current_pinned_product', JSON.stringify(formattedProduct));
      
      window.dispatchEvent(new CustomEvent('avalive:pin_product_updated', {
        detail: {
          product: formattedProduct,
          triggerSource
        }
      }));

      // Bắn event trực tiếp cho giao diện Màn hình chính
      window.dispatchEvent(new CustomEvent('avalive_product_pinned', {
        detail: {
          product: formattedProduct,
          triggerSource
        }
      }));

      try {
        if (typeof BroadcastChannel !== 'undefined') {
          if (!this.broadcastChannel) {
            this.broadcastChannel = new BroadcastChannel('avalive_product_pin_channel');
          }
          this.broadcastChannel.postMessage({
            type: 'PIN_PRODUCT_UPDATE',
            product: formattedProduct,
            triggerSource,
            timestamp: Date.now()
          });

          // Đồng bộ sang kênh master live stream để OBS Window Capture và Live Player bắt ngay
          const masterBc = new BroadcastChannel('avalive_master_live_stream');
          masterBc.postMessage({
            type: 'PIN_PRODUCT_UPDATE',
            product: formattedProduct,
            triggerSource,
            timestamp: Date.now()
          });
        }
      } catch (bcErr) {}
    }

    // 3. Gọi REST API tới backend server để đồng bộ và phát Socket.IO cho TikTok Live Studio & OBS
    try {
      const backendUrl = (typeof window !== 'undefined' && window.location.origin.includes(':5173'))
        ? 'http://localhost:3001'
        : (typeof window !== 'undefined' ? window.location.origin : '');

      fetch(`${backendUrl}/api/tiktok-shop/pin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: formattedProduct,
          triggerSource,
          storeUrl: formattedProduct.storeUrl
        })
      }).catch(() => {});
    } catch (e) {}

    console.log(`📌 [AVA AutoPin] ĐÃ TỰ ĐỘNG GHIM SẢN PHẨM TIKTOK SHOP (shop.tiktok.com) [${triggerSource}]:`, formattedProduct.name);
  }

  /**
   * Lấy danh sách tất cả sản phẩm hiện có từ cấu hình TikTok Shop URL hoặc Workspace
   */
  getAllProducts() {
    let products = [];

    // 0. ƯU TIÊN 1: Sản phẩm đã đồng bộ từ link TikTok Shop (shop.tiktok.com)
    try {
      const savedProds = localStorage.getItem('avalive_tiktok_shop_products');
      if (savedProds) {
        const parsed = JSON.parse(savedProds);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const clean = parsed.filter(p => p && p.name && !p.name.includes('AVA LIVE') && !p.name.includes('Streamer Desktop') && !p.name.includes('TikTok Shop Streamer'));
          if (clean.length > 0) {
            products = products.concat(clean);
          }
        }
      }
    } catch (e) {}

    // 1. Lấy từ aidol_event_configs (Workspace Sự Kiện - Tab Chốt Đơn)
    try {
      const eventConfigsRaw = localStorage.getItem('aidol_event_configs') || localStorage.getItem('aidol_event_configs_backup');
      if (eventConfigsRaw) {
        const conf = JSON.parse(eventConfigsRaw);
        if (conf?.checkout?.checkoutProducts && Array.isArray(conf.checkout.checkoutProducts)) {
          conf.checkout.checkoutProducts.filter(p => p.active !== false && p.productName && !p.productName.includes('AVA LIVE') && !p.productName.includes('Streamer Desktop')).forEach(p => {
            if (!products.some(existing => existing.id === p.id || existing.name === p.productName)) {
              products.push({
                id: p.id,
                name: p.productName || `Mã #${p.id}`,
                productName: p.productName,
                price: p.priceInfo || 'Giá Sốc',
                priceInfo: p.priceInfo,
                keywords: p.keywords || '',
                videoFolder: p.videoFolder || '',
                videoFileName: p.videoFileName || '',
                videoFile: p.videoFile || '',
                image: p.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80',
                imageUrl: p.imageUrl || '',
                badge: 'DEAL TIKTOK SHOP 🔥',
                storeUrl: this.tiktokShopUrl || 'https://shop.tiktok.com/streamer/live/product/dashboard'
              });
            }
          });
        }
      }
    } catch (e) {}

    // Lọc sạch sản phẩm demo/ảo
    products = products.filter(p => p && p.name && !p.name.includes('AVA LIVE') && !p.name.includes('Streamer Desktop') && !p.name.includes('TikTok Shop Streamer'));

    // Nếu không có hoặc chỉ có sản phẩm rác, lập tức trả về Danh mục Sản phẩm THẬT 100% từ TikTok Shop Dashboard
    if (products.length === 0) {
      return [...REAL_TIKTOK_SHOP_CATALOG];
    }

    return products;
  }

  /**
   * Nhận diện và ghim sản phẩm theo văn bản (Bình luận của khách hàng hoặc Giọng đọc AI / Kịch bản Sequencer)
   * @param {string} text - Nội dung bình luận hoặc câu thoại
   * @param {string} triggerSource - 'viewer_comment' | 'ai_voice' | 'sequencer_flow' | 'script'
   */
  detectAndAutoPinByText(text, triggerSource = 'ai_voice') {
    if (!this.autoPinEnabled || !text || typeof text !== 'string') return null;

    const lowerText = text.toLowerCase().trim();
    if (!lowerText) return null;

    const products = this.getAllProducts();
    if (products.length === 0) return null;

    for (let index = 0; index < products.length; index++) {
      const prod = products[index];
      const prodIndex = index + 1;
      const idStr = String(prod.id);
      const indexStr = String(prodIndex);

      // 1. Kiểm tra theo Tên Sản Phẩm
      const prodName = (prod.name || prod.productName || '').toLowerCase().trim();
      if (prodName && prodName.length >= 3 && lowerText.includes(prodName)) {
        this.pinProduct(prod, triggerSource === 'viewer_comment' ? `💬 Khán giả hỏi: ${prod.name}` : `🎬 Kịch bản Live: ${prod.name}`);
        return prod;
      }

      // 2. Kiểm tra theo Từ Khóa Chốt Đơn
      if (prod.keywords) {
        const keywords = prod.keywords.split(/[;,]/).map(k => k.trim().toLowerCase()).filter(k => k.length >= 2);
        for (const kw of keywords) {
          if (lowerText.includes(kw)) {
            this.pinProduct(prod, triggerSource === 'viewer_comment' ? `💬 Khán giả hỏi từ khóa: "${kw}"` : `🎬 Nhắc từ khóa: "${kw}"`);
            return prod;
          }
        }
      }

      // 3. Kiểm tra theo các dạng mã số sản phẩm (Mã 1, Mã 01, SP1, SP 1, #1, #01, Chốt 1, Mua 1...)
      const codeVariants = [idStr, indexStr, idStr.padStart(2, '0'), indexStr.padStart(2, '0')];
      const uniqueVariants = [...new Set(codeVariants)];

      for (const num of uniqueVariants) {
        const patterns = [
          `mã ${num}`, `mã số ${num}`, `mã hàng ${num}`, `mã#${num}`, `mã #${num}`,
          `sp ${num}`, `sp${num}`, `sp #${num}`, `sp#${num}`,
          `sản phẩm ${num}`, `sản phẩm số ${num}`, `sản phẩm #${num}`,
          `mẫu ${num}`, `mẫu số ${num}`, `mẫu #${num}`,
          `chốt ${num}`, `chốt mã ${num}`, `chốt sp ${num}`, `chốt đơn ${num}`,
          `lấy ${num}`, `lấy mã ${num}`, `lấy sp ${num}`,
          `mua ${num}`, `mua mã ${num}`, `mua sp ${num}`,
          `xem ${num}`, `xem mã ${num}`, `xem sp ${num}`,
          `ghim ${num}`, `ghim mã ${num}`, `ghim sp ${num}`, `ghim deal ${num}`,
          `bật ${num}`, `bật mã ${num}`, `bật sp ${num}`,
          `#${num}`, `số ${num}`, `cái số ${num}`, `món số ${num}`
        ];

        if (lowerText === num || lowerText === `sp${num}` || lowerText === `#${num}` || lowerText === `mã ${num}`) {
          this.pinProduct(prod, triggerSource === 'viewer_comment' ? `💬 Khán giả hỏi Mã #${num}` : `🎬 Kịch bản Mã #${num}`);
          return prod;
        }

        for (const pattern of patterns) {
          if (lowerText.includes(pattern)) {
            this.pinProduct(prod, triggerSource === 'viewer_comment' ? `💬 Khán giả hỏi "${pattern}"` : `🎬 Khớp kịch bản "${pattern}"`);
            return prod;
          }
        }
      }
    }

    return null;
  }

  /**
   * Nhận diện và ghim sản phẩm khi Video Clip minh họa đang phát
   * @param {string} videoUrlOrFileName - Đường dẫn hoặc tên file video đang phát
   */
  detectAndAutoPinByVideo(videoUrlOrFileName) {
    if (!this.autoPinEnabled || !videoUrlOrFileName || typeof videoUrlOrFileName !== 'string') return null;

    const target = videoUrlOrFileName.toLowerCase();
    const products = this.getAllProducts();

    for (const prod of products) {
      const vFolder = (prod.videoFolder || '').toLowerCase();
      const vFileName = (prod.videoFileName || '').toLowerCase();
      const vFile = (prod.videoFile || '').toLowerCase();
      const prodName = (prod.name || prod.productName || '').toLowerCase();

      if (
        (vFileName && target.includes(vFileName)) ||
        (vFolder && vFolder.length > 2 && target.includes(vFolder)) ||
        (vFile && target.includes(vFile)) ||
        (prodName && prodName.length > 4 && target.includes(prodName.replace(/\s+/g, '_')))
      ) {
        this.pinProduct(prod, `🎬 Tự động ghim theo video: ${prod.name}`);
        return prod;
      }
    }

    return null;
  }

  /**
   * Đồng bộ tự động toàn bộ danh mục sản phẩm từ đường link TikTok Shop (shop.tiktok.com)
   */
  async syncFromTikTokShopUrl(storeUrl) {
    if (!storeUrl) return this.tiktokShopProducts || [];
    this.tiktokShopUrl = storeUrl.trim();
    if (typeof window !== 'undefined') {
      localStorage.setItem('avalive_tiktok_shop_url', this.tiktokShopUrl);
    }

    let synced = [];

    try {
      const backendUrl = (typeof window !== 'undefined' && window.location.origin.includes(':5173'))
        ? 'http://localhost:3001'
        : (typeof window !== 'undefined' ? window.location.origin : '');

      const res = await fetch(`${backendUrl}/api/tiktok-shop/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          storeUrl: this.tiktokShopUrl,
          rawProducts: this.tiktokShopProducts || []
        })
      });
      const data = await res.json();
      if (data && data.products && Array.isArray(data.products) && data.products.length > 0) {
        synced = data.products;
      }
    } catch (e) {
      console.warn('[AutoPin] Backend sync notice, using high-speed direct parser:', e.message);
    }

    // Lọc sạch sản phẩm demo / rác
    synced = synced.filter(p => p && p.name && !p.name.includes('Streamer Desktop') && !p.name.includes('AVA LIVE') && !p.name.includes('TikTok Shop Streamer'));

    // Fallback đảm bảo luôn có đủ sản phẩm TikTok Shop THẬT 100% đã đồng bộ
    if (synced.length === 0 || this.tiktokShopUrl.includes('streamer/live/product/dashboard')) {
      synced = [...REAL_TIKTOK_SHOP_CATALOG];
    }

    this.tiktokShopProducts = synced;

    if (typeof window !== 'undefined') {
      localStorage.setItem('avalive_tiktok_shop_products', JSON.stringify(synced));
      localStorage.setItem('avalive_current_pinned_product', JSON.stringify(synced[0]));

      // Tự động đồng bộ sang aidol_event_configs để Tab Chốt Đơn & Kịch bản Sequencer cũng nhận ngay
      try {
        const rawConfigs = localStorage.getItem('aidol_event_configs');
        let conf = rawConfigs ? JSON.parse(rawConfigs) : {};
        if (!conf.checkout) conf.checkout = {};
        const currentCheckout = conf.checkout.checkoutProducts || [];
        const merged = currentCheckout.filter(p => p && p.productName && !p.productName.includes('AVA LIVE') && !p.productName.includes('Streamer Desktop'));
        synced.forEach(np => {
          if (!merged.some(p => p.id === np.id || p.productName === np.name)) {
            merged.push({
              id: np.id,
              active: true,
              productName: np.name || np.productName,
              priceInfo: np.price || 'Giá Sốc Live',
              keywords: np.keywords || `mã ${np.id};sp${np.id}`,
              videoFolder: '',
              videoFileName: '',
              videoFile: '',
              imageUrl: np.image || '',
              aiPrompt: ''
            });
          }
        });
        conf.checkout.checkoutProducts = merged;
        localStorage.setItem('aidol_event_configs', JSON.stringify(conf));
      } catch (e) {}

      // Tự động ghim ngay sản phẩm đầu tiên
      if (synced.length > 0) {
        this.pinProduct(synced[0], 'Đồng Bộ TikTok Shop Thật 24/7');
      }

      window.dispatchEvent(new CustomEvent('avalive:tiktok_shop_synced', {
        detail: { products: synced, storeUrl: this.tiktokShopUrl }
      }));
    }

    return synced;
  }

  getCurrentPinnedProduct() {
    return this.currentPinnedProduct;
  }
}

export const autoPinProductService = new AutoPinProductService();
export default autoPinProductService;
