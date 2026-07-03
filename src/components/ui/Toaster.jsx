'use client';

import { useToast } from '@/lib/useToast';
import { X } from 'lucide-react';

export default function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className={[
            'pointer-events-auto px-4 py-3 rounded-sm border text-sm font-mono',
            'flex items-start gap-3 shadow-lg',
            t.exiting ? 'toast-exit' : 'toast-enter',
            t.variant === 'destructive'
              ? 'bg-black border-red-500/50 text-white'
              : 'bg-black border-cyan-500/40 text-white',
          ].join(' ')}
        >
          <div className="flex-1 min-w-0">
            {t.title && <div className="font-semibold text-white truncate">{t.title}</div>}
            {t.description && <div className="text-white/60 text-xs mt-0.5 break-words">{t.description}</div>}
          </div>
          <button
            onClick={() => dismiss(t.id)}
            className="shrink-0 text-white/40 hover:text-white transition-colors mt-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
