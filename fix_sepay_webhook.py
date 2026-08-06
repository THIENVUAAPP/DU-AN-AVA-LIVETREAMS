import re

with open("src/components/SePayModal.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add orderCode state and polling effect
old_state_block = """  const [timeLeft, setTimeLeft] = useState(900); // 15 mins
  const [copiedField, setCopiedField] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen || !plan) return null;

  const price = billingCycle === 'yearly' ? plan.yearly : plan.monthly;
  const priceDisplay = price.toLocaleString() + '₫';
  const orderCode = `AVA${Math.floor(Math.random() * 90000) + 10000}`;"""

new_state_block = """  const [timeLeft, setTimeLeft] = useState(900); // 15 mins
  const [copiedField, setCopiedField] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [orderCode, setOrderCode] = useState('');
  
  const price = plan ? (billingCycle === 'yearly' ? plan.yearly : plan.monthly) : 0;
  const priceDisplay = price.toLocaleString() + '₫';

  // Generate order code once and create pending payment
  useEffect(() => {
    if (!isOpen || !plan || !currentUser) return;
    
    const code = `AVA${Math.floor(Math.random() * 90000) + 10000}`;
    setOrderCode(code);
    
    // Create pending payment in Supabase
    syncPaymentToSupabase({
      plan: plan.name.replace('Gói ', ''),
      amount: price,
      referenceCode: code,
      status: 'pending',
      email: currentUser?.email,
      billingCycle
    });
  }, [isOpen, plan, currentUser, price, billingCycle]);

  // Timer & Polling for payment completion
  useEffect(() => {
    if (!isOpen || !orderCode) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    const pollPayment = setInterval(async () => {
      try {
        const { data, error } = await supabase
          .from('payments')
          .select('status')
          .eq('reference_code', orderCode)
          .maybeSingle();
          
        if (data && data.status === 'completed') {
          clearInterval(pollPayment);
          setIsVerifying(true);
          setTimeout(() => {
             setIsVerifying(false);
             onSuccess();
          }, 1500);
        }
      } catch (err) {
        console.error("Polling error", err);
      }
    }, 3000); // Poll every 3 seconds

    return () => {
      clearInterval(timer);
      clearInterval(pollPayment);
    };
  }, [isOpen, orderCode, onSuccess]);

  if (!isOpen || !plan) return null;"""

content = content.replace(old_state_block, new_state_block)

# 2. Update bank details
old_qr = """  // URL tạo mã QR VietQR (Cổng SePay / VietQR)
  const bankAccount = "19036789012345";"""
new_qr = """  // URL tạo mã QR VietQR (Cổng SePay / VietQR)
  const bankAccount = "19035907828017";"""
content = content.replace(old_qr, new_qr)

# 3. Update UI to remove simulate button and show polling state
old_button_ui = """           <button 
             onClick={handleSimulatePayment}
             disabled={isVerifying}
             className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
           >
             {isVerifying ? <RefreshCw className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
             {isVerifying ? 'ĐANG KIỂM TRA GIAO DỊCH...' : 'TÔI ĐÃ CHUYỂN KHOẢN '}
           </button>"""

new_button_ui = """           <div className="w-full py-4 bg-blue-600/20 border border-blue-500/30 text-blue-400 font-bold rounded-xl flex items-center justify-center gap-3">
             {isVerifying ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span className="text-green-400">THANH TOÁN THÀNH CÔNG! ĐANG CHUYỂN HƯỚNG...</span>
                </>
             ) : (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  HỆ THỐNG ĐANG CHỜ THANH TOÁN...
                </>
             )}
           </div>"""

content = content.replace(old_button_ui, new_button_ui)

with open("src/components/SePayModal.jsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated SePayModal.jsx with polling and exact bank account")
