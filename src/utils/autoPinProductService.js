/**
 * autoPinProductService.js - Real-time AI Product Pinning Engine
 * Tự động nhận diện câu thoại của AI hoặc Video Clip minh họa đang phát để Ghim Sản Phẩm lên TikTok Shop / Livestream 100% tự động.
 */

class AutoPinProductService {
  constructor() {
    this.currentPinnedProduct = null;
    this.autoPinEnabled = true;
    this.lastPinnedTime = 0;
    this.init();
  }

  init() {
    if (typeof window === 'undefined') return;

    // Đọc trạng thái đã lưu
    try {
      const savedProd = localStorage.getItem('avalive_current_pinned_product');
      if (savedProd) {
        this.currentPinnedProduct = JSON.parse(savedProd);
      }
      const savedAuto = localStorage.getItem('avalive_auto_pin_enabled');
      if (savedAuto !== null) {
        this.autoPinEnabled = savedAuto === 'true';
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

    console.log("📌 [AVA AutoPin] Auto Pin Product Service initialized & ready.");
  }

  setAutoPinEnabled(enabled) {
    this.autoPinEnabled = enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('avalive_auto_pin_enabled', enabled ? 'true' : 'false');
      window.dispatchEvent(new CustomEvent('avalive:auto_pin_status_changed', { detail: { enabled } }));
    }
  }

  /**
   * Ghim một sản phẩm và đồng bộ toàn hệ thống
   */
  pinProduct(product, triggerSource = 'ai_voice') {
    if (!product) return;

    const formattedProduct = {
      id: product.id,
      name: product.name || product.productName || 'Sản Phẩm Livestream',
      price: product.price || product.priceInfo || 'Giá Ưu Đãi',
      oldPrice: product.oldPrice || '',
      image: product.image || product.imageUrl || product.img || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80',
      badge: product.badge || 'HOT DEAL 🔥',
      stock: product.stock || 99,
      keywords: product.keywords || '',
      pinnedAt: Date.now(),
      triggerSource
    };

    // Tránh ghim liên tục cùng 1 sản phẩm trong 3 giây
    if (this.currentPinnedProduct && this.currentPinnedProduct.id === formattedProduct.id && (Date.now() - this.lastPinnedTime < 3000)) {
      return;
    }

    this.currentPinnedProduct = formattedProduct;
    this.lastPinnedTime = Date.now();

    if (typeof window !== 'undefined') {
      localStorage.setItem('avalive_current_pinned_product', JSON.stringify(formattedProduct));
      window.dispatchEvent(new CustomEvent('avalive:pin_product_updated', {
        detail: {
          product: formattedProduct,
          triggerSource
        }
      }));
    }

    console.log(`📌 [AVA AutoPin] ĐÃ TỰ ĐỘNG GHIM SẢN PHẨM [${triggerSource}]:`, formattedProduct.name);
  }

  /**
   * Lấy danh sách tất cả sản phẩm hiện có từ cấu hình Workspace hoặc TikTok Shop Studio
   */
  getAllProducts() {
    let products = [];

    // 1. Lấy từ aidol_event_configs (Workspace Sự Kiện - Tab Chốt Đơn)
    try {
      const eventConfigsRaw = localStorage.getItem('aidol_event_configs') || localStorage.getItem('aidol_event_configs_backup');
      if (eventConfigsRaw) {
        const conf = JSON.parse(eventConfigsRaw);
        if (conf?.checkout?.checkoutProducts && Array.isArray(conf.checkout.checkoutProducts)) {
          products = products.concat(conf.checkout.checkoutProducts.filter(p => p.active !== false).map(p => ({
            id: p.id,
            name: p.productName || `Mã #${p.id}`,
            productName: p.productName,
            price: p.priceInfo || 'Giá Sốc',
            priceInfo: p.priceInfo,
            keywords: p.keywords || '',
            videoFolder: p.videoFolder || '',
            videoFileName: p.videoFileName || '',
            videoFile: p.videoFile || '',
            imageUrl: p.imageUrl || '',
            badge: 'DEAL ĐỘC QUYỀN 🔥'
          })));
        }
      }
    } catch (e) {}

    // 2. Lấy từ avalive_commerce_sessions hoặc LiveCommerceStudio
    try {
      const commerceSessionsRaw = localStorage.getItem('avalive_commerce_sessions');
      if (commerceSessionsRaw) {
        const sessions = JSON.parse(commerceSessionsRaw);
        if (Array.isArray(sessions)) {
          sessions.forEach(sess => {
            if (Array.isArray(sess.products)) {
              sess.products.forEach(p => {
                if (!products.some(existing => existing.id === p.id || existing.name === p.name)) {
                  products.push({
                    id: p.id,
                    name: p.name,
                    productName: p.name,
                    price: p.price,
                    oldPrice: p.oldPrice,
                    image: p.image,
                    badge: p.badge || 'HOT DEAL',
                    keywords: p.keywords || p.name,
                    stock: p.stock
                  });
                }
              });
            }
          });
        }
      }
    } catch (e) {}

    return products;
  }

  /**
   * Nhận diện và ghim sản phẩm theo văn bản (Bình luận của khách hàng hoặc Giọng đọc AI)
   * @param {string} text - Nội dung bình luận hoặc câu thoại
   * @param {string} triggerSource - 'viewer_comment' | 'ai_voice' | 'script'
   */
  detectAndAutoPinByText(text, triggerSource = 'ai_voice') {
    if (!this.autoPinEnabled || !text || typeof text !== 'string') return null;

    const lowerText = text.toLowerCase().trim();
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
        this.pinProduct(prod, triggerSource === 'viewer_comment' ? 'viewer_comment_name_match' : 'ai_speech_name_match');
        return prod;
      }

      // 2. Kiểm tra theo Từ Khóa Chốt Đơn (phân tách bởi dấu chấm phẩy hoặc dấu phẩy ;)
      if (prod.keywords) {
        const keywords = prod.keywords.split(/[;,]/).map(k => k.trim().toLowerCase()).filter(k => k.length >= 2);
        for (const kw of keywords) {
          if (lowerText.includes(kw)) {
            this.pinProduct(prod, triggerSource === 'viewer_comment' ? `viewer_comment_keyword: ${kw}` : `ai_speech_keyword: ${kw}`);
            return prod;
          }
        }
      }

      // 3. Kiểm tra theo các dạng mã số sản phẩm (ID, số thứ tự, mã 01, sp1, chốt 1...)
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

        // Nếu bình luận là chuỗi ngắn chỉ chứa mỗi số mã sản phẩm (ví dụ "1", "01", "sp1", "#1")
        if (lowerText === num || lowerText === `sp${num}` || lowerText === `#${num}` || lowerText === `mã ${num}`) {
          this.pinProduct(prod, triggerSource === 'viewer_comment' ? `viewer_comment_exact_code: ${num}` : `ai_speech_exact_code: ${num}`);
          return prod;
        }

        for (const pattern of patterns) {
          if (lowerText.includes(pattern)) {
            this.pinProduct(prod, triggerSource === 'viewer_comment' ? `viewer_comment_pattern: ${pattern}` : `ai_speech_pattern: ${pattern}`);
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

      if (
        (vFileName && target.includes(vFileName)) ||
        (vFolder && vFolder.length > 2 && target.includes(vFolder)) ||
        (vFile && target.includes(vFile))
      ) {
        this.pinProduct(prod, 'video_playback_match');
        return prod;
      }
    }

    return null;
  }

  getCurrentPinnedProduct() {
    return this.currentPinnedProduct;
  }
}

export const autoPinProductService = new AutoPinProductService();
export default autoPinProductService;
