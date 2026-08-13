import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

// ============================================================
// CẤU HÌNH TỶ LỆ TOKEN (Anh chỉnh ở đây)
// ============================================================
export const TOKEN_RATES = {
  AI_PER_30S: 5,
  TTS_PER_50CHARS: 1,
  LOW_BALANCE_WARN: 200,
};

const STORAGE_KEY = 'avalive_token_data';
const TokenContext = createContext(null);

export function TokenProvider({ children }) {
  const [tokenData, setTokenData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return { balance: 0, history: [] };
  });

  const [lowBalanceWarned, setLowBalanceWarned] = useState(false);
  const notifyRef = useRef(null);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tokenData)); } catch (e) {}
  }, [tokenData]);

  useEffect(() => {
    if (tokenData.balance > 0 && tokenData.balance < TOKEN_RATES.LOW_BALANCE_WARN && !lowBalanceWarned) {
      setLowBalanceWarned(true);
      if (notifyRef.current) notifyRef.current({ type: 'warn', message: `⚠️ Số dư token sắp hết! Còn lại ${tokenData.balance} token. Vui lòng nạp thêm.` });
    }
    if (tokenData.balance >= TOKEN_RATES.LOW_BALANCE_WARN) setLowBalanceWarned(false);
  }, [tokenData.balance]);

  const addToken = useCallback((amount, reason = 'Nạp token') => {
    const entry = { id: Date.now(), type: 'add', amount: +amount, reason, time: new Date().toISOString() };
    setTokenData(prev => ({ balance: prev.balance + amount, history: [entry, ...prev.history].slice(0, 200) }));
  }, []);

  const deductToken = useCallback((amount, reason = 'Sử dụng dịch vụ') => {
    setTokenData(prev => {
      const actual = Math.min(amount, prev.balance);
      if (actual <= 0) return prev;
      const entry = { id: Date.now(), type: 'deduct', amount: actual, reason, time: new Date().toISOString() };
      return { balance: Math.max(0, prev.balance - actual), history: [entry, ...prev.history].slice(0, 200) };
    });
  }, []);

  const setNotifyCallback = useCallback((fn) => { notifyRef.current = fn; }, []);
  const clearHistory = useCallback(() => { setTokenData(prev => ({ ...prev, history: [] })); }, []);

  return (
    <TokenContext.Provider value={{ balance: tokenData.balance, history: tokenData.history, addToken, deductToken, setNotifyCallback, clearHistory }}>
      {children}
    </TokenContext.Provider>
  );
}

export function useToken() {
  const ctx = useContext(TokenContext);
  if (!ctx) throw new Error('useToken must be inside TokenProvider');
  return ctx;
}
