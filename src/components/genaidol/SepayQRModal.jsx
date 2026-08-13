import React, { useState, useEffect, useRef } from 'react';
import { X, CheckCircle2, Loader2, Copy, Clock } from 'lucide-react';
import { useToken } from './TokenContext';

// ============================================================
// CẤU HÌNH SEPAY (Anh điền thông tin ngân hàng vào đây)
// ============================================================
const SEPAY_CONFIG = {
  bankName: 'MB Bank',            // Tên ngân hàng
  accountNumber: '0987654321',    // Số tài khoản
  accountName: 'NGUYEN VAN A',    // Tên chủ tài khoản
  transferPrefix: 'AVALIVE',      // Prefix nội dung CK để nhận dạng đơn
  // API SePay webhook sẽ tích hợp sau khi anh cung cấp API key
};

// Tạo QR bank tĩnh (VietQR)
function buildQRUrl(amount, orderId) {
  const content = `${SEPAY_CONFIG.transferPrefix}${orderId}`;
  return `https://img.vietqr.io/image/MB-${SEPAY_CONFIG.accountNumber}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(content)}&accountName=${encodeURIComponent(SEPAY_CONFIG.accountName)}`;
}

export default function SepayQRModal({ pkg, onClose, onSuccess }) {
  const { addToken } = useToken();
  const [status, setStatus] = useState('waiting'); // waiting | confirming | success
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 phút
  const orderId = useRef(`${Date.now()}`).current;
  const pollingRef = useRef(null);

  const qrUrl = buildQRUrl(pkg.price, orderId);
  const transferContent = `${SEPAY_CONFIG.transferPrefix}${orderId}`;

  // Đếm ngược 15 phút
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timer); onClose(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Polling giả lập (sẽ gọi API SePay thật khi anh cấp key)
  // Hiện tại: nút thủ công "Tôi đã chuyển khoản" để test
  const handleManualConfirm = () => {
    setStatus('confirming');
    setTimeout(() => {
      addToken(pkg.tokens, `Mua gói ${pkg.name}`);
      setStatus('success');
      setTimeout(() => { onSuccess?.(); onClose(); }, 2000);
    }, 2000);
  };

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div>
            <h3 className="text-lg font-black text-white">Thanh toán qua SePay</h3>
            <p className="text-xs text-blue-200">Quét mã QR hoặc chuyển khoản</p>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
            <X size={22} />
          </button>
        </div>

        {status === 'success' ? (
          <div className="p-10 flex flex-col items-center gap-4">
            <CheckCircle2 className="text-green-500" size={72} />
            <h4 className="text-2xl font-black text-green-700">Thanh toán thành công!</h4>
            <p className="text-gray-600 text-center">Đã cộng <strong className="text-blue-600">{pkg.tokens.toLocaleString()} Token</strong> vào tài khoản của bạn.</p>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            {/* Gói đã chọn */}
            <div className="bg-blue-50 rounded-xl p-4 flex items-center justify-between border border-blue-100">
              <div>
                <p className="text-xs font-bold text-blue-500 uppercase tracking-wide">Gói đã chọn</p>
                <p className="text-lg font-black text-gray-800">{pkg.name}</p>
                <p className="text-sm text-gray-600">+{pkg.tokens.toLocaleString()} Token</p>
              </div>
              <p className="text-2xl font-black text-blue-600">{pkg.price.toLocaleString()}đ</p>
            </div>

            {/* QR Code */}
            <div className="flex justify-center">
              <img
                src={qrUrl}
                alt="QR thanh toán"
                className="w-52 h-52 rounded-xl border-2 border-gray-200 shadow"
                onError={(e) => { e.target.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`Chuyen khoan: ${SEPAY_CONFIG.accountNumber} - ${pkg.price}d - ND: ${transferContent}`)}`; }}
              />
            </div>

            {/* Thông tin CK */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm border border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Ngân hàng</span>
                <span className="font-bold text-gray-800">{SEPAY_CONFIG.bankName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Số TK</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-800">{SEPAY_CONFIG.accountNumber}</span>
                  <button onClick={() => copyText(SEPAY_CONFIG.accountNumber)} className="text-blue-500 hover:text-blue-700">
                    <Copy size={13} />
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Số tiền</span>
                <span className="font-bold text-green-600">{pkg.price.toLocaleString()}đ</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Nội dung CK</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-800 text-xs">{transferContent}</span>
                  <button onClick={() => copyText(transferContent)} className="text-blue-500 hover:text-blue-700">
                    <Copy size={13} />
                  </button>
                </div>
              </div>
            </div>

            {copied && <p className="text-center text-xs text-green-600 font-bold animate-pulse">✅ Đã sao chép!</p>}

            {/* Timer */}
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Clock size={14} />
              <span>Hết hạn sau: <strong className={`${timeLeft < 60 ? 'text-red-500' : 'text-gray-700'}`}>{minutes}:{seconds.toString().padStart(2,'0')}</strong></span>
            </div>

            {/* Nút xác nhận */}
            <button
              onClick={handleManualConfirm}
              disabled={status === 'confirming'}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {status === 'confirming' ? (
                <><Loader2 size={18} className="animate-spin" /> Đang xác nhận...</>
              ) : (
                '✅ Tôi đã chuyển khoản xong'
              )}
            </button>
            <p className="text-center text-xs text-gray-400">Hệ thống sẽ tự động cộng token sau khi xác nhận thanh toán</p>
          </div>
        )}
      </div>
    </div>
  );
}
