import re

with open("src/components/SePayModal.jsx", "r", encoding="utf-8") as f:
    content = f.read()

old_qr_logic = """  // URL tạo mã QR VietQR (Cổng SePay / VietQR)
  const bankAccount = "19036789012345";
  const bankName = "Techcombank";
  const qrUrl = `https://qr.sepay.vn/img?acc=${bankAccount}&bank=${bankName}&amount=${price}&des=${orderCode}`;"""

new_qr_logic = """  // URL tạo mã QR VietQR (Cổng SePay / VietQR)
  const bankAccount = "19036789012345";
  const bankName = "Techcombank";
  const accountName = "NGUYEN QUOC THIEN";
  const qrUrl = `https://qr.sepay.vn/img?acc=${bankAccount}&bank=${bankName}&amount=${price}&des=${orderCode}&accountName=${encodeURIComponent(accountName)}`;"""

content = content.replace(old_qr_logic, new_qr_logic)

old_ui = """              <div className="flex justify-between items-center bg-[#1c1c22] p-3 rounded-xl border border-white/5">
                 <div className="flex flex-col">
                   <span className="text-[10px] text-gray-500 font-bold uppercase">Số tài khoản</span>
                   <span className="text-sm font-bold text-[#00f2fe]">{bankAccount}</span>
                 </div>
                 <button onClick={() => copyToClipboard(bankAccount, 'stk')} className="text-gray-400 hover:text-white flex items-center gap-1">
                   {copiedField === 'stk' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                 </button>
              </div>"""

new_ui = """              <div className="flex justify-between items-center bg-[#1c1c22] p-3 rounded-xl border border-white/5">
                 <div className="flex flex-col">
                   <span className="text-[10px] text-gray-500 font-bold uppercase">Chủ tài khoản</span>
                   <span className="text-sm font-bold text-white uppercase">{accountName}</span>
                 </div>
              </div>
              <div className="flex justify-between items-center bg-[#1c1c22] p-3 rounded-xl border border-white/5">
                 <div className="flex flex-col">
                   <span className="text-[10px] text-gray-500 font-bold uppercase">Số tài khoản</span>
                   <span className="text-sm font-bold text-[#00f2fe]">{bankAccount}</span>
                 </div>
                 <button onClick={() => copyToClipboard(bankAccount, 'stk')} className="text-gray-400 hover:text-white flex items-center gap-1">
                   {copiedField === 'stk' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                 </button>
              </div>"""

content = content.replace(old_ui, new_ui)

with open("src/components/SePayModal.jsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Fixed SePay Modal")
