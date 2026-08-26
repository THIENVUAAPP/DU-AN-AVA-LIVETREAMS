import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

// ============================================================
// CẤU HÌNH TỶ LỆ TOKEN (Chuẩn hóa Biên Lợi Nhuận Gộp 65% - Chi Phí API <= 35%)
// ============================================================
export const TOKEN_RATES = {
  TTS_PER_CHAR: 1,           // 1 Token = 1 Ký tự ElevenLabs siêu thực (Idol, Quản lý, Game PK)
  AI_LIVE_PER_30S: 5,        // 10 Token / phút duy trì kết nối LLM Brain & Server Live
  LOW_BALANCE_WARN: 500,     // Cảnh báo khi số dư dưới 500 Token
};

const STORAGE_KEY = 'avalive_token_data';
const USER_KEY = 'avalive_current_user';
const SYS_KEY = 'avalive_system_configs';
const TokenContext = createContext(null);

export function TokenProvider({ children }) {
  const [tokenData, setTokenData] = useState(() => {
    // Read from USER_KEY for balance, STORAGE_KEY for history
    let balance = 100;
    let history = [];
    
    try {
      const userSaved = localStorage.getItem(USER_KEY);
      if (userSaved) {
        const parsedUser = JSON.parse(userSaved);
        if (typeof parsedUser.tokens === 'number') {
          balance = parsedUser.tokens;
        }
      }
      
      const histSaved = localStorage.getItem(STORAGE_KEY);
      if (histSaved) {
        const parsedHist = JSON.parse(histSaved);
        if (Array.isArray(parsedHist?.history)) {
          history = parsedHist.history;
        }
      }
    } catch (e) {
      console.warn("Error parsing token data:", e);
    }
    
    return { balance, history };
  });

  // Get dynamic rates from system config
  const getDynamicRates = () => {
    try {
      const sysConfig = JSON.parse(localStorage.getItem(SYS_KEY)) || {};
      return {
        ...TOKEN_RATES,
        TTS_PER_CHAR: sysConfig.costVoice || 5,
        AI_LIVE_PER_30S: sysConfig.costLiveAI || 10
      };
    } catch (e) {
      return { ...TOKEN_RATES, TTS_PER_CHAR: 5, AI_LIVE_PER_30S: 10 };
    }
  };

  const [lowBalanceWarned, setLowBalanceWarned] = useState(false);
  const notifyRef = useRef(null);

  useEffect(() => {
    // Sync balance to USER_KEY
    try {
      const userSaved = localStorage.getItem(USER_KEY);
      if (userSaved) {
        const parsedUser = JSON.parse(userSaved);
        parsedUser.tokens = tokenData.balance;
        localStorage.setItem(USER_KEY, JSON.stringify(parsedUser));
      }
      
      // Sync history to STORAGE_KEY
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ history: tokenData.history }));
      
      // Dispatch custom event for UI updates (like UserProfile)
      window.dispatchEvent(new Event('avalive:user_updated'));
    } catch (e) {}
  }, [tokenData]);

  useEffect(() => {
    const curBal = Number(tokenData?.balance ?? 0);
    const rates = getDynamicRates();
    if (curBal > 0 && curBal < rates.LOW_BALANCE_WARN && !lowBalanceWarned) {
      setLowBalanceWarned(true);
      if (notifyRef.current) notifyRef.current({ type: 'warn', message: `⚠️ Số dư token sắp hết! Còn lại ${curBal} token. Vui lòng nạp thêm.` });
    }
    if (curBal >= rates.LOW_BALANCE_WARN) setLowBalanceWarned(false);
  }, [tokenData?.balance, lowBalanceWarned]);

  const addToken = useCallback((amount, reason = 'Nạp token') => {
    const validAmount = Number(amount) || 0;
    const entry = { id: Date.now(), type: 'add', amount: validAmount, reason, time: new Date().toISOString() };
    setTokenData(prev => {
      const prevBal = Number(prev?.balance ?? 0);
      const prevHist = Array.isArray(prev?.history) ? prev.history : [];
      return { balance: prevBal + validAmount, history: [entry, ...prevHist].slice(0, 200) };
    });
  }, []);

  const deductToken = useCallback((amount, reason = 'Sử dụng dịch vụ') => {
    const validAmount = Number(amount) || 0;
    setTokenData(prev => {
      const prevBal = Number(prev?.balance ?? 0);
      const prevHist = Array.isArray(prev?.history) ? prev.history : [];
      const actual = Math.min(validAmount, prevBal);
      if (actual <= 0) return prev;
      const entry = { id: Date.now(), type: 'deduct', amount: actual, reason, time: new Date().toISOString() };
      return { balance: Math.max(0, prevBal - actual), history: [entry, ...prevHist].slice(0, 200) };
    });
  }, []);

  // Global event listeners to allow decoupled modules (e.g. Battle Game Commentary, Standalone TTS) to deduct/add tokens
  useEffect(() => {
    const handleGlobalDeduct = (e) => {
      if (e.detail && e.detail.amount) {
        deductToken(e.detail.amount, e.detail.reason || 'Sử dụng ElevenLabs / AI Voice');
      }
    };
    const handleGlobalAdd = (e) => {
      if (e.detail && e.detail.amount) {
        addToken(e.detail.amount, e.detail.reason || 'Nạp Token');
      }
    };

    window.addEventListener('avalive:deduct_token', handleGlobalDeduct);
    window.addEventListener('avalive:add_token', handleGlobalAdd);

    return () => {
      window.removeEventListener('avalive:deduct_token', handleGlobalDeduct);
      window.removeEventListener('avalive:add_token', handleGlobalAdd);
    };
  }, [deductToken, addToken]);

  const setNotifyCallback = useCallback((fn) => { notifyRef.current = fn; }, []);
  const clearHistory = useCallback(() => { setTokenData(prev => ({ ...prev, history: [] })); }, []);

  const safeBalance = Number(tokenData?.balance ?? 0);
  const safeHistory = Array.isArray(tokenData?.history) ? tokenData.history : [];

  return (
    <TokenContext.Provider value={{ balance: safeBalance, history: safeHistory, addToken, deductToken, setNotifyCallback, clearHistory, getDynamicRates }}>
      {children}
    </TokenContext.Provider>
  );
}

export function useToken() {
  const ctx = useContext(TokenContext);
  if (!ctx) {
    return {
      balance: 0,
      history: [],
      addToken: () => {},
      deductToken: () => {},
      setNotifyCallback: () => {},
      clearHistory: () => {},
      getDynamicRates: () => ({ ...TOKEN_RATES, TTS_PER_CHAR: 5, AI_LIVE_PER_30S: 10 })
    };
  }
  return ctx;
}
