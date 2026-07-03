'use client';

import { createContext, useContext, useMemo, useState } from 'react';

export const STATUS_ENUM = {
  YES: 'YES',
  PARTIAL: 'PARTIAL',
  NO: 'NO',
  NOT_EVALUATED: 'NOT_EVALUATED',
};

const AuditStateContext = createContext(null);

export function AuditStateProvider({ children }) {
  const [responses, setResponses] = useState({});

  const updateResponse = (code, nextState) => {
    setResponses((prev) => ({
      ...prev,
      [code]: {
        ...prev[code],
        ...nextState,
      },
    }));
  };

  const resetResponses = () => setResponses({});

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
