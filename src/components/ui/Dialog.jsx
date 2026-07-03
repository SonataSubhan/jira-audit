'use client';

import * as RadixDialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Dialog({ open, onOpenChange, children }) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </RadixDialog.Root>
  );
}

export function DialogContent({ children, className }) {
  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <RadixDialog.Content
        className={cn(
          'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2',
          'w-full max-w-md max-h-[90vh] overflow-y-auto',
          'bg-black/95 border border-white/10 rounded-sm p-6 shadow-2xl',
          'text-white font-sans',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          className,
        )}
      >
        {children}
        <RadixDialog.Close className="absolute right-4 top-4 text-white/40 hover:text-white transition-colors focus:outline-none">
          <X className="w-4 h-4" />
        </RadixDialog.Close>
      </RadixDialog.Content>
    </RadixDialog.Portal>
  );
}

export function DialogHeader({ children, className }) {
  return <div className={cn('mb-4', className)}>{children}</div>;
}

export function DialogTitle({ children, className }) {
  return (
    <RadixDialog.Title className={cn('text-xl font-medium tracking-tight text-white', className)}>
      {children}
    </RadixDialog.Title>
  );
}

export function DialogDescription({ children, className }) {
  return (
    <RadixDialog.Description className={cn('text-white/50 text-sm mt-1', className)}>
      {children}
    </RadixDialog.Description>
  );
}

export function DialogFooter({ children, className }) {
  return (
    <div className={cn('flex justify-end gap-3 mt-6', className)}>
      {children}
    </div>
  );
}
