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
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          const currentBal = typeof parsed.balance === 'number' ? parsed.balance : 0;
          if (currentBal < 100000) {
            parsed.balance = 100000;
            parsed.history = [
              { id: Date.now(), type: 'add', amount: 100000, reason: 'Cấp 100.000 Token tài khoản Quản trị Admin', time: new Date().toISOString() },
              ...(Array.isArray(parsed.history) ? parsed.history : [])
            ];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
          }
          return {
            balance: typeof parsed.balance === 'number' ? parsed.balance : 100000,
            history: Array.isArray(parsed.history) ? parsed.history : []
          };
        }
      }
    } catch (e) {
      console.warn("Error parsing token data:", e);
    }
    const initialAdminData = {
      balance: 100000,
      history: [
        { id: Date.now(), type: 'add', amount: 100000, reason: 'Cấp 100.000 Token tài khoản Quản trị Admin', time: new Date().toISOString() }
      ]
    };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(initialAdminData)); } catch (e) {}
    return initialAdminData;
  });

  const [lowBalanceWarned, setLowBalanceWarned] = useState(false);
  const notifyRef = useRef(null);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tokenData)); } catch (e) {}
  }, [tokenData]);

  useEffect(() => {
    const curBal = Number(tokenData?.balance ?? 100000);
    if (curBal > 0 && curBal < TOKEN_RATES.LOW_BALANCE_WARN && !lowBalanceWarned) {
      setLowBalanceWarned(true);
      if (notifyRef.current) notifyRef.current({ type: 'warn', message: `⚠️ Số dư token sắp hết! Còn lại ${curBal} token. Vui lòng nạp thêm.` });
    }
    if (curBal >= TOKEN_RATES.LOW_BALANCE_WARN) setLowBalanceWarned(false);
  }, [tokenData?.balance, lowBalanceWarned]);

  const addToken = useCallback((amount, reason = 'Nạp token') => {
    const validAmount = Number(amount) || 0;
    const entry = { id: Date.now(), type: 'add', amount: validAmount, reason, time: new Date().toISOString() };
    setTokenData(prev => {
      const prevBal = Number(prev?.balance ?? 100000);
      const prevHist = Array.isArray(prev?.history) ? prev.history : [];
      return { balance: prevBal + validAmount, history: [entry, ...prevHist].slice(0, 200) };
    });
  }, []);

  const deductToken = useCallback((amount, reason = 'Sử dụng dịch vụ') => {
    const validAmount = Number(amount) || 0;
    setTokenData(prev => {
      const prevBal = Number(prev?.balance ?? 100000);
      const prevHist = Array.isArray(prev?.history) ? prev.history : [];
      const actual = Math.min(validAmount, prevBal);
      if (actual <= 0) return prev;
      const entry = { id: Date.now(), type: 'deduct', amount: actual, reason, time: new Date().toISOString() };
      return { balance: Math.max(0, prevBal - actual), history: [entry, ...prevHist].slice(0, 200) };
    });
  }, []);

  const setNotifyCallback = useCallback((fn) => { notifyRef.current = fn; }, []);
  const clearHistory = useCallback(() => { setTokenData(prev => ({ ...prev, history: [] })); }, []);

  const safeBalance = Number(tokenData?.balance ?? 100000);
  const safeHistory = Array.isArray(tokenData?.history) ? tokenData.history : [];

  return (
    <TokenContext.Provider value={{ balance: safeBalance, history: safeHistory, addToken, deductToken, setNotifyCallback, clearHistory }}>
      {children}
    </TokenContext.Provider>
  );
}

export function useToken() {
  const ctx = useContext(TokenContext);
  if (!ctx) {
    return {
      balance: 100000,
      history: [],
      addToken: () => {},
      deductToken: () => {},
      setNotifyCallback: () => {},
      clearHistory: () => {}
    };
  }
  return ctx;
}
