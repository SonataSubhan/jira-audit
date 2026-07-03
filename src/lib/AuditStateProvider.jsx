'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export const STATUS_ENUM = {
  YES: 'YES',
  PARTIAL: 'PARTIAL',
  NO: 'NO',
  NOT_EVALUATED: 'NOT_EVALUATED',
};

const LOCAL_STORAGE_KEY = 'auditResponses';
const AuditStateContext = createContext(null);

export function AuditStateProvider({ children }) {
  const [responses, setResponses] = useState({});

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setResponses(JSON.parse(stored));
      }
    } catch (error) {
      console.warn('Failed to load audit responses from localStorage', error);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(responses));
    } catch (error) {
      console.warn('Failed to save audit responses to localStorage', error);
    }
  }, [responses]);

  const updateResponse = (code, nextState) => {
    setResponses((prev) => ({
      ...prev,
      [code]: {
        ...prev[code],
        ...nextState,
      },
    }));
  };

  const resetResponses = () => {
    window.localStorage.removeItem(LOCAL_STORAGE_KEY);
    setResponses({});
  };

  const value = useMemo(
    () => ({ responses, updateResponse, resetResponses }),
    [responses]
  );

  return <AuditStateContext.Provider value={value}>{children}</AuditStateContext.Provider>;
}

export function useAuditState() {
  const context = useContext(AuditStateContext);
  if (!context) {
    throw new Error('useAuditState must be used within AuditStateProvider');
  }
  return context;
}
