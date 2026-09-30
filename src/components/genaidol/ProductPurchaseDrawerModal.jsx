import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Zap, Check, Plus, Minus, ShieldCheck, Tag, ExternalLink } from 'lucide-react';
import { getProductVariants, resolveSellerProductBuyUrl, getProductSellerName, formatVietnamesePrice, parsePriceToNumber } from '../../utils/autoPinProductService';

export default function ProductPurchaseDrawerModal({ product, isOpen, onClose, defaultPlatform = 'tiktok' }) {
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      const variants = getProductVariants(product);
      setSelectedColor(variants.colors && variants.colors.length > 0 ? variants.colors[0] : '');
      setSelectedSize(variants.sizes && variants.sizes.length > 0 ? variants.sizes[0] : '');
      setSelectedType(variants.types && variants.types.length > 0 ? variants.types[0] : '');
      setQuantity(1);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const variants = getProductVariants(product);
  const sellerName = getProductSellerName(product);
  const unitPrice = variants.unitPrice || parsePriceToNumber(product.price);
  const totalPrice = unitPrice * quantity;

  const handleCheckout = (platform = 'tiktok') => {
    const variantInfo = {
      color: selectedColor,
      size: selectedSize,
      type: selectedType,
      quantity
    };
    const targetUrl = resolveSellerProductBuyUrl(product, platform, variantInfo);
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg bg-slate-950 border border-rose-500/60 rounded-t-3xl sm:rounded-3xl shadow-[0_0_50px_rgba(244,63,94,0.35)] text-white overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Drawer */}
        <div className="flex items-start justify-between p-4 border-b border-white/10 bg-slate-900/80">
          <div className="flex gap-3 items-center min-w-0 flex-1">
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-rose-500/50 bg-black shrink-0 shadow-md">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              <span className="absolute top-0 left-0 bg-rose-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-br uppercase">
                {product.id ? `MÃ #${product.id}` : '📌 DEAL'}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-amber-400 font-mono">
                  {formatVietnamesePrice(unitPrice)}
                </span>
                {product.oldPrice && (
                  <span className="text-xs text-gray-400 line-through font-mono">
                    {product.oldPrice}
                  </span>
                )}
              </div>
              <div className="text-xs text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                <Zap className="w-3 h-3" />
                <span>Kho: Còn {variants.stock || product.stock || '500'} sản phẩm</span>
              </div>
              <div className="text-[11px] text-rose-300 font-medium truncate mt-0.5">
                Đang chọn: {[selectedColor, selectedSize, selectedType, `SL: ${quantity}`].filter(Boolean).join(' • ')}
              </div>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 overflow-y-auto space-y-4 max-h-[50vh] text-left">
          {/* Shop and Title */}
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold mb-1.5">
              <span>🏪 {sellerName}</span>
              <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <h3 className="text-sm font-bold text-gray-100 leading-snug">
              {product.name}
            </h3>
          </div>

          {/* Color Section */}
          {variants.colors && variants.colors.length > 0 && (
            <div>
              <label className="block text-xs font-black text-gray-300 uppercase tracking-wider mb-2">
                🎨 Phân Loại / Màu Sắc:
              </label>
              <div className="flex flex-wrap gap-2">
                {variants.colors.map((color) => {
                  const isSelected = selectedColor === color;
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white border border-rose-400 shadow-md shadow-rose-950 scale-[1.02]'
                          : 'bg-slate-900 border border-white/15 text-gray-300 hover:border-rose-400 hover:text-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                      <span>{color}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Size Section */}
          {variants.sizes && variants.sizes.length > 0 && (
            <div>
              <label className="block text-xs font-black text-gray-300 uppercase tracking-wider mb-2">
                📏 Kích Thước / Size:
              </label>
              <div className="flex flex-wrap gap-2">
                {variants.sizes.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white border border-rose-400 shadow-md shadow-rose-950 scale-[1.02]'
                          : 'bg-slate-900 border border-white/15 text-gray-300 hover:border-rose-400 hover:text-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                      <span>{size}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Type / Combo Section */}
          {variants.types && variants.types.length > 1 && (
            <div>
              <label className="block text-xs font-black text-gray-300 uppercase tracking-wider mb-2">
                🎁 Quy Cách / Combo:
              </label>
              <div className="flex flex-wrap gap-2">
                {variants.types.map((type) => {
                  const isSelected = selectedType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSelectedType(type)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white border border-rose-400 shadow-md shadow-rose-950 scale-[1.02]'
                          : 'bg-slate-900 border border-white/15 text-gray-300 hover:border-rose-400 hover:text-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                      <span>{type}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity Section */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <div>
              <div className="text-xs font-black text-white">Số Lượng:</div>
              <div className="text-[10px] text-gray-400">Ưu đãi freeship khi mua từ 1 món</div>
            </div>
            <div className="flex items-center bg-slate-900 border border-white/20 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-9 h-8 bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-10 text-center text-sm font-black font-mono text-white">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(Math.min(99, quantity + 1))}
                className="w-9 h-8 bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Voucher Badge banner */}
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-gradient-to-r from-rose-950/60 to-red-950/60 border border-dashed border-rose-500/50 text-rose-300 text-xs font-semibold">
            <Tag className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Đã tự động áp dụng Voucher Live giảm 30K - 50K & Freeship Extra</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/10 bg-slate-950/95 space-y-2.5">
          <div className="flex justify-between items-baseline text-xs">
            <span className="text-gray-400">Tổng thanh toán tạm tính:</span>
            <span className="text-xl font-black text-rose-400 font-mono">
              {formatVietnamesePrice(totalPrice)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleCheckout('tiktok')}
              className="py-3 px-3 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 hover:from-rose-500 hover:to-pink-500 text-white font-black text-xs shadow-lg shadow-rose-950/80 flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>Mua Trên TikTok</span>
              <ExternalLink className="w-3 h-3 opacity-75" />
            </button>
            <button
              type="button"
              onClick={() => handleCheckout('shopee')}
              className="py-3 px-3 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-black text-xs shadow-lg shadow-orange-950/80 flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Mua Trên Shopee</span>
              <ExternalLink className="w-3 h-3 opacity-75" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
