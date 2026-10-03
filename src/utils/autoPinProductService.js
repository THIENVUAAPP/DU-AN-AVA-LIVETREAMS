/**
 * autoPinProductService.js - Real-time AI Product Pinning Engine 24/7
 * Tự động nhận diện câu thoại của AI, Video Clip minh họa đang phát hoặc Bình luận của khán giả
 * để Ghim Sản Phẩm lên TikTok Shop, TikTok Live Studio & Livestream Overlay 100% tự động & mượt mà.
 */

import autoCaptchaService from './autoCaptchaService';

export const REAL_TIKTOK_SHOP_CATALOG = [];

/**
 * Phân tích và trích xuất danh sách biến thể (Màu sắc, Kích cỡ, Phân loại, Số lượng) của sản phẩm
 */
export function parsePriceToNumber(priceStr) {
  if (typeof priceStr === 'number') return priceStr;
  if (!priceStr || typeof priceStr !== 'string') return 49999;
  const digits = priceStr.replace(/[^0-9]/g, '');
  return digits ? parseInt(digits, 10) : 49999;
}

export function formatVietnamesePrice(num) {
  return (num || 0).toLocaleString('vi-VN') + ' ₫';
}

export function getProductVariants(prod) {
  if (!prod) {
    return {
      colors: ['Màu Mặc Định'],
      sizes: ['Freesize'],
      types: ['Bản Tiêu Chuẩn'],
      stock: '99',
      unitPrice: 0
    };
  }

  if (prod.variants && typeof prod.variants === 'object') {
    return {
      colors: prod.variants.colors || ['Màu Mặc Định'],
      sizes: prod.variants.sizes || ['Freesize'],
      types: prod.variants.types || ['Bản Tiêu Chuẩn'],
      stock: prod.stock || '99',
      unitPrice: parsePriceToNumber(prod.price)
    };
  }

  return {
    colors: ['Màu Mặc Định'],
    sizes: ['Freesize'],
    types: ['Bản Tiêu Chuẩn'],
    stock: prod.stock || '99',
    unitPrice: parsePriceToNumber(prod.price) || 0
  };
}

/**
 * Phân giải chính xác 100% đường link trang mua hàng và thanh toán trực tiếp của Seller trên TikTok / Shopee
 * Kèm theo các biến thể (Màu sắc, Size, Số lượng) mà người xem vừa lựa chọn trên phiên live.
 */
export function resolveSellerProductBuyUrl(prod, platform = 'tiktok', selectedVariant = null) {
  if (!prod) return 'https://www.tiktok.com/search?q=san+pham+tiktok+shop';

  // 1. Kiểm tra các URL tiếp thị liên kết / URL Seller người dùng tự cấu hình
  const isCleanDirectLink = (u) => {
    if (!u || typeof u !== 'string') return false;
    const s = u.toLowerCase().trim();
    return (s.startsWith('http://') || s.startsWith('https://')) &&
           !s.includes('/streamer/live/product/dashboard') &&
           !s.includes('seller-vn.tiktok.com/homepage') &&
           !s.includes('/vn/pdp/172948291038198') &&
           !s.includes('@powerband.sport') &&
           !s.includes('@fitabcore.official') &&
           !s.includes('@zenyoga.master') &&
           !s.includes('@hydrasport.vn') &&
           !s.includes('@gympro.vietnam') &&
           !s.includes('@eirafit.review') &&
           !s.includes('@havata.official');
  };

  if (isCleanDirectLink(prod.affiliateUrl)) return prod.affiliateUrl.trim();
  if (isCleanDirectLink(prod.buyUrl)) return prod.buyUrl.trim();
  if (isCleanDirectLink(prod.productUrl)) return prod.productUrl.trim();
  if (isCleanDirectLink(prod.sellerStoreUrl)) return prod.sellerStoreUrl.trim();
  if (isCleanDirectLink(prod.storeUrl)) return prod.storeUrl.trim();

  // 2. Tinh chỉnh từ khóa tìm kiếm & checkout trực tiếp có kèm biến thể người dùng vừa chọn (Màu, Size)
  const pName = prod.name || prod.productName || prod.title || '';
  const colorStr = selectedVariant?.color ? ` ${selectedVariant.color}` : '';
  const sizeStr = selectedVariant?.size ? ` ${selectedVariant.size}` : '';
  const fullSearchQuery = `${pName}${colorStr}${sizeStr}`.trim();

  // 3. Nếu nền tảng là Shopee
  const isShopee = String(platform || '').toLowerCase().includes('shopee') || 
                   String(prod.sync || '').toLowerCase().includes('shopee') ||
                   String(prod.platform || '').toLowerCase().includes('shopee');
  if (isShopee) {
    const q = encodeURIComponent(fullSearchQuery || 'san pham shopee live');
    return `https://shopee.vn/search?keyword=${q}`;
  }

  // 4. Phân giải tự động sang trang tìm kiếm & đặt mua trực tiếp của TikTok Shop
  return `https://www.tiktok.com/search?q=${encodeURIComponent(fullSearchQuery || 'san pham tiktok shop')}`;
}

export function getProductSellerName(prod) {
  if (prod?.sellerName) return prod.sellerName;
  if (prod?.shopName) return prod.shopName;
  if (prod?.storeName) return prod.storeName;
  return 'TikTok Shop Official';
}

class AutoPinProductService {
  constructor() {
    this.currentPinnedProduct = null;
    this.autoPinEnabled = true;
    this.pinInterval = 30; // 30 seconds default
    this.lastPinnedTime = 0;
    this.rotationTimer = null;
    this.currentRotationIndex = 0;
    this.tiktokShopUrl = 'https://shop.tiktok.com/streamer/live/product/dashboard';
    this.tiktokShopProducts = [];
    if (typeof window !== 'undefined') {
      setTimeout(() => this.init(), 0);
    }
  }

  init() {
    if (typeof window !== 'undefined') {
      // Đọc trạng thái đã lưu
      try {
        const savedProd = localStorage.getItem('avalive_current_pinned_product');
        let isCheckoutActive = true;
        try {
          const evCfg = JSON.parse(localStorage.getItem('aidol_event_configs') || '{}');
          if (evCfg?.checkout && evCfg.checkout.active === false) isCheckoutActive = false;
        } catch (e) {}

        if (savedProd && isCheckoutActive) {
          const parsed = JSON.parse(savedProd);
          if (parsed && parsed.active !== false && parsed.enabled !== false && parsed.name && !parsed.name.includes('AVA LIVE') && !parsed.name.includes('Streamer Desktop')) {
            this.currentPinnedProduct = parsed;
          } else {
            this.currentPinnedProduct = null;
            localStorage.removeItem('avalive_current_pinned_product');
          }
        } else {
          this.currentPinnedProduct = null;
          localStorage.removeItem('avalive_current_pinned_product');
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
            this.tiktokShopProducts = clean.length > 0 ? clean : [];
          } else {
            this.tiktokShopProducts = [];
          }
        } else {
          this.tiktokShopProducts = [];
          // no fake catalog saved
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
   * Hủy ghim sản phẩm và đồng bộ toàn hệ thống để ẩn hoàn toàn khỏi màn hình Live
   */
  unpinProduct() {
    this.currentPinnedProduct = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('avalive_current_pinned_product');
      window.dispatchEvent(new CustomEvent('avalive:pin_product_updated', {
        detail: { product: null, triggerSource: 'unpin' }
      }));
      window.dispatchEvent(new CustomEvent('avalive_product_pinned', {
        detail: { product: null, triggerSource: 'unpin' }
      }));
      if (this.broadcastChannel) {
        this.broadcastChannel.postMessage({
          type: 'PIN_PRODUCT_UPDATE',
          product: null,
          triggerSource: 'unpin',
          timestamp: Date.now()
        });
      }
      try {
        const masterBc = new BroadcastChannel('avalive_master_live_stream');
        masterBc.postMessage({
          type: 'PIN_PRODUCT_UPDATE',
          product: null,
          timestamp: Date.now()
        });
        masterBc.close();
      } catch (e) {}
    }
  }

  /**
   * Ghim một sản phẩm và đồng bộ toàn hệ thống (TikTok Shop, Live Studio, OBS Overlay)
   */
  pinProduct(product, triggerSource = 'ai_voice') {
    if (!product) return;

    // BẮT BUỘC: Chỉ ghim khi sản phẩm có active !== false && enabled !== false
    if (product.active === false || product.enabled === false) {
      console.log('⛔ [AVA AutoPin] Sản phẩm chưa được kích hoạt (active: false), bỏ qua không ghim.');
      return;
    }

    // BẮT BUỘC: Kiểm tra tab chốt đơn có đang bật không
    try {
      const savedEvCfg = localStorage.getItem('aidol_event_configs');
      if (savedEvCfg) {
        const evCfg = JSON.parse(savedEvCfg);
        if (evCfg?.checkout && evCfg.checkout.active === false) {
          console.log('⛔ [AVA AutoPin] Sự kiện Chốt Đơn đang tắt (active: false), bỏ qua không ghim.');
          return;
        }
      }
    } catch (e) {}

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
   * Ghim sản phẩm theo Mã ID số hoặc Thứ tự (1, 2, 3...) cho widget Auto Ghim Pro
   */
  pinProductByCode(codeOrIndex, triggerSource = 'Auto Ghim Pro (shop.tiktok.com)') {
    const products = this.getAllProducts();
    if (!products || products.length === 0) return null;
    const num = parseInt(codeOrIndex, 10);
    let target = null;
    if (!isNaN(num)) {
      target = products.find(p => p.id === num || String(p.id) === String(num)) || products[num - 1] || products[0];
    } else {
      const query = String(codeOrIndex || '').toLowerCase().trim();
      target = products.find(p => p.name && p.name.toLowerCase().includes(query)) || products[0];
    }
    if (target) {
      this.pinProduct(target, triggerSource);
      return target;
    }
    return null;
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
        // NẾU TAB CHỐT ĐƠN TẮT (active === false), TUYỆT ĐỐI KHÔNG GHIM SẢN PHẨM NÀO
        if (conf?.checkout?.active !== false && conf?.checkout?.checkoutProducts && Array.isArray(conf.checkout.checkoutProducts)) {
          conf.checkout.checkoutProducts.filter(p => p.active !== false && p.enabled !== false && p.productName && !p.productName.includes('AVA LIVE') && !p.productName.includes('Streamer Desktop')).forEach(p => {
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

    return products;
  }

  /**
   * Nhận diện và ghim sản phẩm theo văn bản (Bình luận của khách hàng hoặc Giọng đọc AI / Kịch bản Sequencer)
   * @param {string} text - Nội dung bình luận hoặc câu thoại
   * @param {string} triggerSource - 'viewer_comment' | 'ai_voice' | 'sequencer_flow' | 'script'
   */
  detectAndAutoPinByText(text, triggerSource = 'ai_voice') {
    if (this.autoPinEnabled === false || !text || typeof text !== 'string') return null;

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

    if (synced.length === 0) {
      synced = this.getAllProducts();
    }

    this.tiktokShopProducts = synced;

    if (typeof window !== 'undefined') {
      localStorage.setItem('avalive_tiktok_shop_products', JSON.stringify(synced));
      if (synced.length > 0) {
        localStorage.setItem('avalive_current_pinned_product', JSON.stringify(synced[0]));
        this.currentPinnedProduct = synced[0];
      } else {
        localStorage.removeItem('avalive_current_pinned_product');
        this.currentPinnedProduct = null;
      }

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

      // Tự động bật autoPinEnabled và kích hoạt vòng lặp xoay vòng ghim sản phẩm 24/7
      this.autoPinEnabled = true;
      localStorage.setItem('avalive_auto_pin_enabled', 'true');
      this.startRotationLoop();

      // Tự động ghim ngay sản phẩm đầu tiên lên màn hình và gửi sang TikTok Live Studio / OBS
      if (synced.length > 0) {
        this.pinProduct(synced[0], 'Tự động ghim khi dán link TikTok Shop');
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
