'use client';

import { useState } from 'react';
import LoginScreen from '@/components/LoginScreen';
import Dashboard from '@/components/Dashboard';
import Toaster from '@/components/ui/Toaster';
import { ToastProvider } from '@/lib/useToast';

export default function Home() {
  const [auditInfo, setAuditInfo] = useState(null);

  return (
    <ToastProvider>
      {/* Dot-grid overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none dot-grid opacity-40" />

      <div className="relative z-10 min-h-screen">
        {!auditInfo ? (
          <LoginScreen onLogin={setAuditInfo} />
        ) : (
          <Dashboard auditInfo={auditInfo} onLogout={() => setAuditInfo(null)} />
        )}
      </div>

      <Toaster />
    </ToastProvider>
  );
}
